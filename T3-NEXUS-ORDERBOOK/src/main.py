"""
T3-NEXUS-ORDERBOOK: HTTP + WebSocket service layer (ENGINE_SPEC.md Section 6)

Routes the OpenAPI 3.1 contract onto the deterministic in-memory matching core.

Concurrency model
-----------------
The matching core is single-threaded by design. Every handler that mutates a
book is an ``async def`` with NO ``await`` between reading and mutating book
state, so each mutation is atomic with respect to the asyncio event loop. Do not
convert these handlers to plain ``def`` (FastAPI would run them in a thread pool
and break that guarantee) and run uvicorn with ``--workers 1``.

Scope note
----------
State is held in memory only. The PostgreSQL schema in ``migrations/`` is
provided but is NOT yet wired into this service layer.
"""
from __future__ import annotations

import asyncio
import os
import resource
import sys
import time
from collections import deque
from contextlib import asynccontextmanager
from decimal import Decimal
from typing import Deque, Dict, List, Optional, Set, Tuple

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from src.engine import OrderBook
from src.models import (
    MarketDepthSnapshot,
    OrderBookLevel,
    OrderCreateRequest,
    OrderRecord,
    OrderStatus,
    SelfTradePrevention,
    TimeInForce,
    TradeExecution,
)

DEFAULT_SYMBOLS = "BTC-USDT,ETH-USDT"
TRADE_HISTORY_LIMIT = 10_000
SUBSCRIBER_QUEUE_SIZE = 1_000
WS_DEPTH_LEVELS = 50
ZERO_QTY = "0.00000000"


class OrderExecutionResult(BaseModel):
    order: OrderRecord
    trades: List[TradeExecution]


def _fmt(value: Decimal) -> str:
    """Render a Decimal as a fixed 8-decimal string for wire payloads."""
    return f"{value:.8f}"


class TradeSubscriber:
    """A trade-stream consumer. Dropped (and disconnected) if it falls too far behind."""

    def __init__(self, queue_size: int = SUBSCRIBER_QUEUE_SIZE) -> None:
        self.queue: asyncio.Queue = asyncio.Queue(maxsize=queue_size)
        self.dropped = False


class MarketHub:
    """Owns order books, trade history, and WebSocket fan-out state."""

    def __init__(self, symbols: List[str], tick_interval_ms: int) -> None:
        self.books: Dict[str, OrderBook] = {s: OrderBook(symbol=s) for s in symbols}
        self.trades: Dict[str, Deque[TradeExecution]] = {
            s: deque(maxlen=TRADE_HISTORY_LIMIT) for s in symbols
        }
        # Depth sequence increments on EVERY book mutation (resting, cancel, fill),
        # whereas OrderBook.sequence_id only counts trades.
        self.depth_seq: Dict[str, int] = {s: 0 for s in symbols}
        self.tick_interval = tick_interval_ms / 1000.0
        self.started_at = time.monotonic()
        self.client_order_ids: Set[Tuple[str, str]] = set()
        self._trade_subs: Dict[str, Set[TradeSubscriber]] = {s: set() for s in symbols}
        self._depth_wakeups: Dict[str, Set[asyncio.Event]] = {s: set() for s in symbols}

    # -- mutation helpers --------------------------------------------------
    def bbo(self, symbol: str) -> Tuple[Optional[Decimal], Optional[Decimal]]:
        book = self.books[symbol]
        return book.get_best_bid(), book.get_best_ask()

    def after_mutation(
        self,
        symbol: str,
        bbo_before: Tuple[Optional[Decimal], Optional[Decimal]],
        trades: List[TradeExecution],
    ) -> None:
        self.depth_seq[symbol] += 1
        for trade in trades:
            self.trades[symbol].append(trade)
            for sub in list(self._trade_subs[symbol]):
                try:
                    sub.queue.put_nowait(trade)
                except asyncio.QueueFull:
                    sub.dropped = True
                    self._trade_subs[symbol].discard(sub)
        if self.bbo(symbol) != bbo_before:
            for event in list(self._depth_wakeups[symbol]):
                event.set()

    # -- subscription helpers ----------------------------------------------
    def subscribe_trades(self, symbol: str) -> TradeSubscriber:
        sub = TradeSubscriber()
        self._trade_subs[symbol].add(sub)
        return sub

    def unsubscribe_trades(self, symbol: str, sub: TradeSubscriber) -> None:
        self._trade_subs[symbol].discard(sub)

    def register_depth_wakeup(self, symbol: str) -> asyncio.Event:
        event = asyncio.Event()
        self._depth_wakeups[symbol].add(event)
        return event

    def unregister_depth_wakeup(self, symbol: str, event: asyncio.Event) -> None:
        self._depth_wakeups[symbol].discard(event)


def _memory_usage_mb() -> float:
    rss = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    # ru_maxrss is bytes on macOS, kilobytes on Linux.
    return round(rss / (1024 * 1024) if sys.platform == "darwin" else rss / 1024, 2)


def _levels_to_map(levels: List[OrderBookLevel]) -> Dict[Decimal, Tuple[Decimal, int]]:
    return {lvl.price: (lvl.quantity, lvl.order_count) for lvl in levels}


def _diff_side(
    previous: Dict[Decimal, Tuple[Decimal, int]],
    current: Dict[Decimal, Tuple[Decimal, int]],
) -> List[list]:
    changes: List[list] = []
    for price, (qty, count) in current.items():
        if previous.get(price) != (qty, count):
            changes.append([_fmt(price), _fmt(qty), count])
    for price in previous:
        if price not in current:
            changes.append([_fmt(price), ZERO_QTY, 0])
    return changes


def create_app(
    symbols: Optional[List[str]] = None,
    tick_interval_ms: Optional[int] = None,
) -> FastAPI:
    if symbols is None:
        raw = os.getenv("SYMBOLS", DEFAULT_SYMBOLS)
        symbols = [s.strip() for s in raw.split(",") if s.strip()]
    if tick_interval_ms is None:
        tick_interval_ms = int(os.getenv("TICK_INTERVAL_MS", "100"))

    hub = MarketHub(symbols, tick_interval_ms)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        yield

    app = FastAPI(
        title="T3-NEXUS-ORDERBOOK Institutional API",
        version="1.0.0",
        description=(
            "Continuous double auction matching engine and market feed protocol. "
            "In-memory state; sample/simulated data only."
        ),
        lifespan=lifespan,
    )
    app.state.hub = hub

    def _require_symbol(symbol: str) -> OrderBook:
        book = hub.books.get(symbol)
        if book is None:
            raise HTTPException(status_code=404, detail=f"Unknown symbol: {symbol}")
        return book

    # ---------------------------------------------------------------- REST
    @app.get("/healthz")
    async def get_health() -> dict:
        return {
            "status": "HEALTHY",
            "uptime_seconds": round(time.monotonic() - hub.started_at, 3),
            "active_symbols": list(hub.books.keys()),
            "memory_usage_mb": _memory_usage_mb(),
        }

    @app.post("/api/v1/orders", status_code=201, response_model=OrderExecutionResult)
    async def place_order(req: OrderCreateRequest) -> OrderExecutionResult:
        book = hub.books.get(req.symbol)
        if book is None:
            raise HTTPException(status_code=400, detail=f"Unknown symbol: {req.symbol}")
        if req.order_type.value == "LIMIT" and req.price is None:
            raise HTTPException(status_code=400, detail="Price is required for LIMIT orders")
        if req.time_in_force == TimeInForce.FOK:
            raise HTTPException(
                status_code=400,
                detail="time_in_force FOK is not supported in this release (use GTC or IOC)",
            )
        if req.stp_mode == SelfTradePrevention.DECREMENT_AND_CANCEL:
            raise HTTPException(
                status_code=400,
                detail="stp_mode DECREMENT_AND_CANCEL is not supported in this release",
            )
        key = (req.trader_id, req.client_order_id)
        if key in hub.client_order_ids:
            raise HTTPException(
                status_code=400,
                detail="Duplicate client_order_id for this trader_id",
            )

        order = OrderRecord(
            client_order_id=req.client_order_id,
            symbol=req.symbol,
            side=req.side,
            order_type=req.order_type,
            price=req.price,
            original_quantity=req.quantity,
            remaining_quantity=req.quantity,
            time_in_force=req.time_in_force,
            trader_id=req.trader_id,
            stp_mode=req.stp_mode,
        )

        # Atomic section: no awaits between here and after_mutation().
        before = hub.bbo(req.symbol)
        trades, updated = book.process_order(order)
        hub.client_order_ids.add(key)
        hub.after_mutation(req.symbol, before, trades)
        return OrderExecutionResult(order=updated, trades=trades)

    @app.delete("/api/v1/orders/{order_id}", response_model=OrderRecord)
    async def cancel_order(order_id: str) -> OrderRecord:
        for symbol, book in hub.books.items():
            if order_id in book.orders:
                before = hub.bbo(symbol)
                cancelled = book.cancel_order(order_id)
                hub.after_mutation(symbol, before, [])
                return cancelled  # type: ignore[return-value]
        raise HTTPException(status_code=404, detail="Order ID not found or already filled")

    @app.get("/api/v1/orderbook/l2", response_model=MarketDepthSnapshot)
    async def get_l2_snapshot(
        symbol: str = Query(...),
        depth: int = Query(50, ge=1, le=200),
    ) -> MarketDepthSnapshot:
        return _require_symbol(symbol).get_l2_snapshot(depth)

    @app.get("/api/v1/trades/recent", response_model=List[TradeExecution])
    async def get_recent_trades(
        symbol: str = Query(...),
        limit: int = Query(50, ge=1, le=500),
    ) -> List[TradeExecution]:
        _require_symbol(symbol)
        history = hub.trades[symbol]
        return list(history)[-limit:]

    # ----------------------------------------------------------- WebSockets
    async def _read_subscription(ws: WebSocket, channel: str) -> Optional[str]:
        """Accept the socket and validate the subscribe frame. Returns symbol or None."""
        await ws.accept()
        try:
            msg = await ws.receive_json()
        except (WebSocketDisconnect, ValueError):
            await ws.close(code=1003)
            return None
        symbol = msg.get("symbol") if isinstance(msg, dict) else None
        if (
            not isinstance(msg, dict)
            or msg.get("action") != "subscribe"
            or msg.get("channel") != channel
            or symbol not in hub.books
        ):
            await ws.send_json({"type": "error", "message": "Invalid subscribe request"})
            await ws.close(code=1008)
            return None
        return symbol

    @app.websocket("/ws/v1/market-depth")
    async def ws_market_depth(ws: WebSocket) -> None:
        symbol = await _read_subscription(ws, "market-depth")
        if symbol is None:
            return
        book = hub.books[symbol]
        wakeup = hub.register_depth_wakeup(symbol)
        prev_bids: Dict[Decimal, Tuple[Decimal, int]] = {}
        prev_asks: Dict[Decimal, Tuple[Decimal, int]] = {}
        prev_seq = 0
        sent_first = False  # first frame is a full snapshot encoded as a diff vs. an empty book
        try:
            while True:
                # Clear BEFORE snapshotting so a mutation during the awaits below is never lost.
                wakeup.clear()
                snap = book.get_l2_snapshot(WS_DEPTH_LEVELS)
                seq = hub.depth_seq[symbol]
                cur_bids = _levels_to_map(snap.bids)
                cur_asks = _levels_to_map(snap.asks)
                bid_diff = _diff_side(prev_bids, cur_bids)
                ask_diff = _diff_side(prev_asks, cur_asks)
                if bid_diff or ask_diff or not sent_first:
                    await ws.send_json(
                        {
                            "type": "depth_update",
                            "symbol": symbol,
                            "seq": seq,
                            "prev_seq": prev_seq,
                            "ts": time.time_ns(),
                            "bids": bid_diff,
                            "asks": ask_diff,
                        }
                    )
                    prev_bids, prev_asks, prev_seq = cur_bids, cur_asks, seq
                    sent_first = True
                try:
                    await asyncio.wait_for(wakeup.wait(), timeout=hub.tick_interval)
                except asyncio.TimeoutError:
                    pass
        except (WebSocketDisconnect, RuntimeError):
            pass
        finally:
            hub.unregister_depth_wakeup(symbol, wakeup)

    @app.websocket("/ws/v1/trade-stream")
    async def ws_trade_stream(ws: WebSocket) -> None:
        symbol = await _read_subscription(ws, "trade-stream")
        if symbol is None:
            return
        sub = hub.subscribe_trades(symbol)
        try:
            while True:
                try:
                    trade: TradeExecution = await asyncio.wait_for(
                        sub.queue.get(), timeout=max(hub.tick_interval, 0.05)
                    )
                except asyncio.TimeoutError:
                    if sub.dropped:
                        await ws.close(code=1013)  # try again later: consumer too slow
                        return
                    continue
                await ws.send_json(
                    {
                        "type": "trade",
                        "symbol": trade.symbol,
                        "trade_id": trade.trade_id,
                        "seq": trade.sequence_id,
                        "side": trade.side.value,
                        "price": _fmt(trade.price),
                        "qty": _fmt(trade.quantity),
                        "quote_vol": _fmt(trade.quote_volume),
                        "ts": trade.executed_at_ns,
                    }
                )
        except (WebSocketDisconnect, RuntimeError):
            pass
        finally:
            hub.unsubscribe_trades(symbol, sub)

    return app


app = create_app()
