"""
T3-NEXUS-ORDERBOOK: Deterministic In-Memory Matching Core
Zero-Copy Pointer Manipulations via Doubly Linked Lists & Ordered B-Tree Simulation
"""
from decimal import Decimal
from typing import Dict, List, Optional, Tuple
import bisect
import time
import uuid

# Models imported from section 3 (package-style import so `src.main:app` and `--cov=src` resolve)
from src.models import (
    OrderRecord, OrderSide, OrderType, OrderStatus,
    TimeInForce, TradeExecution, OrderBookLevel,
    MarketDepthSnapshot, SelfTradePrevention
)


class OrderNode:
    __slots__ = ("order", "prev", "next", "level")

    def __init__(self, order: OrderRecord):
        self.order: OrderRecord = order
        self.prev: Optional[OrderNode] = None
        self.next: Optional[OrderNode] = None
        self.level: Optional["PriceQueue"] = None


class PriceQueue:
    __slots__ = ("price", "head", "tail", "total_volume", "count")

    def __init__(self, price: Decimal):
        self.price: Decimal = price
        self.head: Optional[OrderNode] = None
        self.tail: Optional[OrderNode] = None
        self.total_volume: Decimal = Decimal("0")
        self.count: int = 0

    def append(self, node: OrderNode) -> None:
        node.level = self
        if self.tail is None:
            self.head = node
            self.tail = node
        else:
            self.tail.next = node
            node.prev = self.tail
            self.tail = node
        self.total_volume += node.order.remaining_quantity
        self.count += 1

    def remove(self, node: OrderNode) -> None:
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next

        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev

        self.total_volume -= node.order.remaining_quantity
        self.count -= 1
        node.prev = None
        node.next = None
        node.level = None

    def is_empty(self) -> bool:
        return self.count == 0


class OrderBook:
    def __init__(
        self,
        symbol: str,
        maker_fee_rate: Decimal = Decimal("-0.00015"),
        taker_fee_rate: Decimal = Decimal("0.00040")
    ):
        self.symbol: str = symbol
        self.maker_fee_rate: Decimal = maker_fee_rate
        self.taker_fee_rate: Decimal = taker_fee_rate
        self.sequence_id: int = 0

        # Fast O(1) order lookup
        self.orders: Dict[str, OrderNode] = {}

        # Price ladders: Sorted lists of keys + mapping to PriceQueue
        self.bid_prices: List[Decimal] = []  # Kept in descending order
        self.ask_prices: List[Decimal] = []  # Kept in ascending order
        self.bids: Dict[Decimal, PriceQueue] = {}
        self.asks: Dict[Decimal, PriceQueue] = {}

    def get_best_bid(self) -> Optional[Decimal]:
        return self.bid_prices[0] if self.bid_prices else None

    def get_best_ask(self) -> Optional[Decimal]:
        return self.ask_prices[0] if self.ask_prices else None

    def _insert_price_level(self, side: OrderSide, price: Decimal) -> PriceQueue:
        if side == OrderSide.BUY:
            if price not in self.bids:
                queue = PriceQueue(price)
                self.bids[price] = queue
                # Maintain descending order: bisect on inverted values
                keys = [-p for p in self.bid_prices]
                idx = bisect.bisect_left(keys, -price)
                self.bid_prices.insert(idx, price)
                return queue
            return self.bids[price]
        else:
            if price not in self.asks:
                queue = PriceQueue(price)
                self.asks[price] = queue
                idx = bisect.bisect_left(self.ask_prices, price)
                self.ask_prices.insert(idx, price)
                return queue
            return self.asks[price]

    def _remove_price_level(self, side: OrderSide, price: Decimal) -> None:
        if side == OrderSide.BUY:
            if price in self.bids and self.bids[price].is_empty():
                del self.bids[price]
                self.bid_prices.remove(price)
        else:
            if price in self.asks and self.asks[price].is_empty():
                del self.asks[price]
                self.ask_prices.remove(price)

    def process_order(self, order: OrderRecord) -> Tuple[List[TradeExecution], Optional[OrderRecord]]:
        trades: List[TradeExecution] = []

        # 1. Matching Engine Execution Loop
        if order.side == OrderSide.BUY:
            trades = self._match_buy(order)
        else:
            trades = self._match_sell(order)

        # 2. Post-Match State Handling
        if order.remaining_quantity > Decimal("0"):
            if order.order_type == OrderType.LIMIT and order.time_in_force != TimeInForce.IOC:
                # Rest remainder on book
                order.status = (
                    OrderStatus.PARTIALLY_FILLED if order.filled_quantity > Decimal("0")
                    else OrderStatus.ACCEPTED
                )
                node = OrderNode(order)
                queue = self._insert_price_level(order.side, order.price)
                queue.append(node)
                self.orders[order.order_id] = node
            else:
                # Market or IOC orders cancel remaining unfilled portion
                order.status = (
                    OrderStatus.PARTIALLY_FILLED if order.filled_quantity > Decimal("0")
                    else OrderStatus.CANCELLED
                )
        else:
            # PATCH T3-FIX-001 (deviation from ENGINE_SPEC.md 4.3): the STP CANCEL_TAKER path zeroes
            # remaining_quantity and sets CANCELLED; the spec code then overwrote it with FILLED.
            if order.status != OrderStatus.CANCELLED:
                order.status = OrderStatus.FILLED

        order.updated_at_ns = time.time_ns()
        return trades, order

    def _match_buy(self, taker_order: OrderRecord) -> List[TradeExecution]:
        trades: List[TradeExecution] = []

        while self.ask_prices and taker_order.remaining_quantity > Decimal("0"):
            best_ask = self.ask_prices[0]
            if taker_order.order_type == OrderType.LIMIT and taker_order.price < best_ask:
                break  # Price did not cross

            queue = self.asks[best_ask]
            curr_node = queue.head

            while curr_node and taker_order.remaining_quantity > Decimal("0"):
                maker_order = curr_node.order

                # Self-Trade Prevention (STP) check
                if maker_order.trader_id == taker_order.trader_id:
                    if taker_order.stp_mode == SelfTradePrevention.CANCEL_TAKER:
                        taker_order.remaining_quantity = Decimal("0")
                        taker_order.status = OrderStatus.CANCELLED
                        return trades
                    elif taker_order.stp_mode == SelfTradePrevention.CANCEL_MAKER:
                        next_node = curr_node.next
                        self.cancel_order(maker_order.order_id)
                        curr_node = next_node
                        continue

                # Compute fill quantity
                matched_qty = min(taker_order.remaining_quantity, maker_order.remaining_quantity)
                match_price = maker_order.price
                quote_vol = matched_qty * match_price

                # Mutate quantities
                taker_order.remaining_quantity -= matched_qty
                taker_order.filled_quantity += matched_qty
                maker_order.remaining_quantity -= matched_qty
                maker_order.filled_quantity += matched_qty
                queue.total_volume -= matched_qty

                # Update sequence & fee calculation
                self.sequence_id += 1
                trade = TradeExecution(
                    sequence_id=self.sequence_id,
                    symbol=self.symbol,
                    taker_order_id=taker_order.order_id,
                    maker_order_id=maker_order.order_id,
                    maker_trader_id=maker_order.trader_id,
                    taker_trader_id=taker_order.trader_id,
                    side=OrderSide.BUY,
                    price=match_price,
                    quantity=matched_qty,
                    quote_volume=quote_vol,
                    maker_fee_rebate=quote_vol * self.maker_fee_rate,
                    taker_fee_paid=quote_vol * self.taker_fee_rate,
                    executed_at_ns=time.time_ns(),
                )
                trades.append(trade)

                # Advance or retire maker order
                if maker_order.remaining_quantity == Decimal("0"):
                    maker_order.status = OrderStatus.FILLED
                    maker_order.updated_at_ns = time.time_ns()
                    next_node = curr_node.next
                    queue.remove(curr_node)
                    del self.orders[maker_order.order_id]
                    curr_node = next_node
                else:
                    maker_order.status = OrderStatus.PARTIALLY_FILLED
                    maker_order.updated_at_ns = time.time_ns()
                    break

            if queue.is_empty():
                self._remove_price_level(OrderSide.SELL, best_ask)

        return trades

    def _match_sell(self, taker_order: OrderRecord) -> List[TradeExecution]:
        trades: List[TradeExecution] = []

        while self.bid_prices and taker_order.remaining_quantity > Decimal("0"):
            best_bid = self.bid_prices[0]
            if taker_order.order_type == OrderType.LIMIT and taker_order.price > best_bid:
                break

            queue = self.bids[best_bid]
            curr_node = queue.head

            while curr_node and taker_order.remaining_quantity > Decimal("0"):
                maker_order = curr_node.order

                if maker_order.trader_id == taker_order.trader_id:
                    if taker_order.stp_mode == SelfTradePrevention.CANCEL_TAKER:
                        taker_order.remaining_quantity = Decimal("0")
                        taker_order.status = OrderStatus.CANCELLED
                        return trades
                    elif taker_order.stp_mode == SelfTradePrevention.CANCEL_MAKER:
                        next_node = curr_node.next
                        self.cancel_order(maker_order.order_id)
                        curr_node = next_node
                        continue

                matched_qty = min(taker_order.remaining_quantity, maker_order.remaining_quantity)
                match_price = maker_order.price
                quote_vol = matched_qty * match_price

                taker_order.remaining_quantity -= matched_qty
                taker_order.filled_quantity += matched_qty
                maker_order.remaining_quantity -= matched_qty
                maker_order.filled_quantity += matched_qty
                queue.total_volume -= matched_qty

                self.sequence_id += 1
                trade = TradeExecution(
                    sequence_id=self.sequence_id,
                    symbol=self.symbol,
                    taker_order_id=taker_order.order_id,
                    maker_order_id=maker_order.order_id,
                    maker_trader_id=maker_order.trader_id,
                    taker_trader_id=taker_order.trader_id,
                    side=OrderSide.SELL,
                    price=match_price,
                    quantity=matched_qty,
                    quote_volume=quote_vol,
                    maker_fee_rebate=quote_vol * self.maker_fee_rate,
                    taker_fee_paid=quote_vol * self.taker_fee_rate,
                    executed_at_ns=time.time_ns(),
                )
                trades.append(trade)

                if maker_order.remaining_quantity == Decimal("0"):
                    maker_order.status = OrderStatus.FILLED
                    maker_order.updated_at_ns = time.time_ns()
                    next_node = curr_node.next
                    queue.remove(curr_node)
                    del self.orders[maker_order.order_id]
                    curr_node = next_node
                else:
                    maker_order.status = OrderStatus.PARTIALLY_FILLED
                    maker_order.updated_at_ns = time.time_ns()
                    break

            if queue.is_empty():
                self._remove_price_level(OrderSide.BUY, best_bid)

        return trades

    def cancel_order(self, order_id: str) -> Optional[OrderRecord]:
        if order_id not in self.orders:
            return None

        node = self.orders[order_id]
        queue = node.level
        queue.remove(node)
        del self.orders[order_id]

        if queue.is_empty():
            self._remove_price_level(node.order.side, queue.price)

        node.order.status = OrderStatus.CANCELLED
        node.order.updated_at_ns = time.time_ns()
        return node.order

    def get_l2_snapshot(self, depth: int = 50) -> MarketDepthSnapshot:
        bids = [
            OrderBookLevel(
                price=p,
                quantity=self.bids[p].total_volume,
                order_count=self.bids[p].count
            )
            for p in self.bid_prices[:depth]
        ]
        asks = [
            OrderBookLevel(
                price=p,
                quantity=self.asks[p].total_volume,
                order_count=self.asks[p].count
            )
            for p in self.ask_prices[:depth]
        ]
        return MarketDepthSnapshot(
            symbol=self.symbol,
            sequence_id=self.sequence_id,
            timestamp_ns=time.time_ns(),
            bids=bids,
            asks=asks
        )
