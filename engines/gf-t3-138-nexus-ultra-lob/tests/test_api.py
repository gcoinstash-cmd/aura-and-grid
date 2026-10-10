"""
T3-NEXUS-ORDERBOOK: Service-layer tests (REST + WebSocket) for src/main.py.

These are additions to the ENGINE_SPEC.md Section 8 suite, which covers only the
matching core. They run entirely in-process against sample/simulated orders.
"""
import asyncio

import pytest
from fastapi.testclient import TestClient

from src.main import MarketHub, _diff_side, _memory_usage_mb, create_app


@pytest.fixture
def client():
    app = create_app(symbols=["BTC-USDT", "ETH-USDT"], tick_interval_ms=10)
    with TestClient(app) as c:
        yield c


def order(**overrides):
    body = {
        "symbol": "BTC-USDT",
        "side": "BUY",
        "order_type": "LIMIT",
        "price": "60000.00",
        "quantity": "1.0",
        "trader_id": "trader_a",
    }
    body.update(overrides)
    return body


# ----------------------------------------------------------------- health
def test_healthz(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "HEALTHY"
    assert body["active_symbols"] == ["BTC-USDT", "ETH-USDT"]
    assert body["uptime_seconds"] >= 0
    assert body["memory_usage_mb"] > 0


def test_memory_usage_helper_positive():
    assert _memory_usage_mb() > 0


# ----------------------------------------------------------------- orders
def test_place_resting_limit_order(client):
    r = client.post("/api/v1/orders", json=order())
    assert r.status_code == 201
    body = r.json()
    assert body["trades"] == []
    assert body["order"]["status"] == "ACCEPTED"
    assert body["order"]["price"] == "60000.00"
    assert body["order"]["remaining_quantity"] == "1.0"


def test_crossing_order_produces_trade_at_maker_price(client):
    client.post("/api/v1/orders", json=order(side="SELL", price="61000", trader_id="maker"))
    r = client.post(
        "/api/v1/orders", json=order(side="BUY", price="61500", trader_id="taker")
    )
    assert r.status_code == 201
    body = r.json()
    assert body["order"]["status"] == "FILLED"
    assert len(body["trades"]) == 1
    trade = body["trades"][0]
    assert trade["price"] == "61000"
    assert trade["side"] == "BUY"
    assert trade["sequence_id"] == 1
    assert trade["maker_trader_id"] == "maker"
    assert trade["taker_trader_id"] == "taker"


def test_market_order_executes_against_book(client):
    client.post("/api/v1/orders", json=order(side="SELL", price="100", trader_id="m"))
    r = client.post(
        "/api/v1/orders",
        json={
            "symbol": "BTC-USDT",
            "side": "BUY",
            "order_type": "MARKET",
            "quantity": "0.4",
            "trader_id": "t",
        },
    )
    assert r.status_code == 201
    assert r.json()["order"]["status"] == "FILLED"
    assert r.json()["trades"][0]["quantity"] == "0.4"


def test_market_order_on_empty_book_is_cancelled(client):
    r = client.post(
        "/api/v1/orders",
        json={
            "symbol": "BTC-USDT",
            "side": "SELL",
            "order_type": "MARKET",
            "quantity": "1",
            "trader_id": "t",
        },
    )
    assert r.status_code == 201
    assert r.json()["order"]["status"] == "CANCELLED"


def test_ioc_remainder_is_not_rested(client):
    client.post("/api/v1/orders", json=order(side="SELL", price="100", quantity="1", trader_id="m"))
    r = client.post(
        "/api/v1/orders",
        json=order(side="BUY", price="100", quantity="3", time_in_force="IOC", trader_id="t"),
    )
    assert r.json()["order"]["status"] == "PARTIALLY_FILLED"
    book = client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT"}).json()
    assert book["bids"] == []


def test_unknown_symbol_rejected_400(client):
    r = client.post("/api/v1/orders", json=order(symbol="DOGE-USDT"))
    assert r.status_code == 400


def test_limit_without_price_rejected_400(client):
    body = order()
    del body["price"]
    r = client.post("/api/v1/orders", json=body)
    assert r.status_code == 400
    assert "Price" in r.json()["detail"]


def test_fok_is_explicitly_rejected(client):
    r = client.post("/api/v1/orders", json=order(time_in_force="FOK"))
    assert r.status_code == 400
    assert "FOK" in r.json()["detail"]


def test_decrement_and_cancel_is_explicitly_rejected(client):
    r = client.post("/api/v1/orders", json=order(stp_mode="DECREMENT_AND_CANCEL"))
    assert r.status_code == 400


def test_duplicate_client_order_id_rejected(client):
    assert client.post("/api/v1/orders", json=order(client_order_id="dup-12345")).status_code == 201
    assert client.post("/api/v1/orders", json=order(client_order_id="dup-12345")).status_code == 400
    # Same client id from a different trader is allowed (DB unique key is per trader).
    assert (
        client.post(
            "/api/v1/orders", json=order(client_order_id="dup-12345", trader_id="other")
        ).status_code
        == 201
    )


@pytest.mark.parametrize(
    "patch",
    [
        {"quantity": "0"},
        {"quantity": "-1"},
        {"side": "HOLD"},
        {"price": "0"},
        {"price": "1.123456789"},
        {"unexpected_field": 1},
    ],
)
def test_malformed_payload_rejected_422(client, patch):
    r = client.post("/api/v1/orders", json=order(**patch))
    assert r.status_code == 422


def test_cancel_resting_order(client):
    placed = client.post("/api/v1/orders", json=order()).json()["order"]
    r = client.delete(f"/api/v1/orders/{placed['order_id']}")
    assert r.status_code == 200
    assert r.json()["status"] == "CANCELLED"
    # Cancelling again -> not found
    assert client.delete(f"/api/v1/orders/{placed['order_id']}").status_code == 404


def test_cancel_unknown_order_404(client):
    assert client.delete("/api/v1/orders/00000000-0000-0000-0000-000000000000").status_code == 404


# -------------------------------------------------------------- market data
def test_l2_snapshot_and_depth_limit(client):
    for i in range(5):
        client.post("/api/v1/orders", json=order(price=str(100 + i), trader_id=f"t{i}"))
    full = client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT"}).json()
    assert [lvl["price"] for lvl in full["bids"]] == ["104", "103", "102", "101", "100"]
    top2 = client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT", "depth": 2}).json()
    assert len(top2["bids"]) == 2


def test_l2_validation(client):
    assert client.get("/api/v1/orderbook/l2", params={"symbol": "NOPE"}).status_code == 404
    assert (
        client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT", "depth": 201}).status_code
        == 422
    )
    assert (
        client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT", "depth": 0}).status_code
        == 422
    )
    assert client.get("/api/v1/orderbook/l2").status_code == 422


def test_recent_trades_chronological_and_limited(client):
    for i in range(4):
        client.post("/api/v1/orders", json=order(side="SELL", price="100", quantity="1", trader_id=f"m{i}"))
    client.post("/api/v1/orders", json=order(side="BUY", price="100", quantity="4", trader_id="t"))
    trades = client.get("/api/v1/trades/recent", params={"symbol": "BTC-USDT"}).json()
    assert [t["sequence_id"] for t in trades] == [1, 2, 3, 4]
    last2 = client.get("/api/v1/trades/recent", params={"symbol": "BTC-USDT", "limit": 2}).json()
    assert [t["sequence_id"] for t in last2] == [3, 4]


def test_recent_trades_validation(client):
    assert client.get("/api/v1/trades/recent", params={"symbol": "NOPE"}).status_code == 404
    assert (
        client.get("/api/v1/trades/recent", params={"symbol": "BTC-USDT", "limit": 501}).status_code
        == 422
    )


def test_symbols_are_isolated(client):
    client.post("/api/v1/orders", json=order(symbol="ETH-USDT", price="3000"))
    btc = client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT"}).json()
    eth = client.get("/api/v1/orderbook/l2", params={"symbol": "ETH-USDT"}).json()
    assert btc["bids"] == [] and len(eth["bids"]) == 1


def test_openapi_document_served(client):
    spec = client.get("/openapi.json").json()
    assert spec["openapi"].startswith("3.1")
    for path in ("/healthz", "/api/v1/orders", "/api/v1/orders/{order_id}",
                 "/api/v1/orderbook/l2", "/api/v1/trades/recent"):
        assert path in spec["paths"]


def test_default_app_reads_env(monkeypatch):
    monkeypatch.setenv("SYMBOLS", "AAA-USD, BBB-USD")
    monkeypatch.setenv("TICK_INTERVAL_MS", "250")
    app = create_app()
    assert list(app.state.hub.books) == ["AAA-USD", "BBB-USD"]
    assert app.state.hub.tick_interval == 0.25


# ---------------------------------------------------------------- websockets
def test_market_depth_ws_snapshot_then_diff(client):
    client.post("/api/v1/orders", json=order(price="100", quantity="2"))
    with client.websocket_connect("/ws/v1/market-depth") as ws:
        ws.send_json({"action": "subscribe", "channel": "market-depth", "symbol": "BTC-USDT"})
        first = ws.receive_json()
        assert first["type"] == "depth_update"
        assert first["prev_seq"] == 0
        assert first["bids"] == [["100.00000000", "2.00000000", 1]]
        assert first["asks"] == []

        # New better bid -> diff contains only the new level
        client.post("/api/v1/orders", json=order(price="101", quantity="1", trader_id="b"))
        second = ws.receive_json()
        assert second["prev_seq"] == first["seq"]
        assert second["seq"] > first["seq"]
        assert second["bids"] == [["101.00000000", "1.00000000", 1]]

        # Cancelling the level -> quantity 0 signals deletion
        resting = client.get("/api/v1/orderbook/l2", params={"symbol": "BTC-USDT"}).json()
        assert [lvl["price"] for lvl in resting["bids"]] == ["101", "100"]


def test_market_depth_ws_level_deletion(client):
    placed = client.post("/api/v1/orders", json=order(price="100")).json()["order"]
    with client.websocket_connect("/ws/v1/market-depth") as ws:
        ws.send_json({"action": "subscribe", "channel": "market-depth", "symbol": "BTC-USDT"})
        ws.receive_json()
        client.delete(f"/api/v1/orders/{placed['order_id']}")
        diff = ws.receive_json()
        assert diff["bids"] == [["100.00000000", "0.00000000", 0]]


def test_market_depth_ws_empty_book_first_frame(client):
    with client.websocket_connect("/ws/v1/market-depth") as ws:
        ws.send_json({"action": "subscribe", "channel": "market-depth", "symbol": "ETH-USDT"})
        msg = ws.receive_json()
        assert msg["bids"] == [] and msg["asks"] == [] and msg["symbol"] == "ETH-USDT"


def test_trade_stream_ws_broadcasts_trades(client):
    with client.websocket_connect("/ws/v1/trade-stream") as ws:
        ws.send_json({"action": "subscribe", "channel": "trade-stream", "symbol": "BTC-USDT"})
        client.post("/api/v1/orders", json=order(side="SELL", price="64250.00", quantity="0.75", trader_id="m"))
        client.post("/api/v1/orders", json=order(side="BUY", price="64250.00", quantity="0.75", trader_id="t"))
        msg = ws.receive_json()
        assert msg["type"] == "trade"
        assert msg["symbol"] == "BTC-USDT"
        assert msg["side"] == "BUY"
        assert msg["price"] == "64250.00000000"
        assert msg["qty"] == "0.75000000"
        assert msg["quote_vol"] == "48187.50000000"
        assert msg["seq"] == 1
        assert isinstance(msg["ts"], int)


@pytest.mark.parametrize(
    "path,payload",
    [
        ("/ws/v1/market-depth", {"action": "subscribe", "channel": "market-depth", "symbol": "NOPE"}),
        ("/ws/v1/market-depth", {"action": "hello"}),
        ("/ws/v1/market-depth", {"action": "subscribe", "channel": "trade-stream", "symbol": "BTC-USDT"}),
        ("/ws/v1/market-depth", [1, 2, 3]),
        ("/ws/v1/trade-stream", {"action": "subscribe", "channel": "trade-stream", "symbol": "NOPE"}),
    ],
)
def test_ws_invalid_subscription_gets_error_frame(client, path, payload):
    with client.websocket_connect(path) as ws:
        ws.send_json(payload)
        assert ws.receive_json()["type"] == "error"


def test_ws_non_json_frame_closes(client):
    with client.websocket_connect("/ws/v1/market-depth") as ws:
        ws.send_text("not json")
        with pytest.raises(Exception):
            ws.receive_json()


# ----------------------------------------------------------- hub internals
def test_slow_trade_subscriber_is_dropped():
    hub = MarketHub(["BTC-USDT"], tick_interval_ms=10)
    sub = hub.subscribe_trades("BTC-USDT")
    sub.queue = asyncio.Queue(maxsize=1)  # force overflow
    from src.engine import OrderBook  # noqa: F401  (imports verified separately)
    from decimal import Decimal
    from src.models import OrderSide, TradeExecution

    def mk(i):
        return TradeExecution(
            sequence_id=i, symbol="BTC-USDT", taker_order_id="t", maker_order_id="m",
            maker_trader_id="a", taker_trader_id="b", side=OrderSide.BUY,
            price=Decimal("1"), quantity=Decimal("1"), quote_volume=Decimal("1"),
            maker_fee_rebate=Decimal("0"), taker_fee_paid=Decimal("0"),
        )

    hub.after_mutation("BTC-USDT", (None, None), [mk(1), mk(2)])
    assert sub.dropped is True
    assert sub not in hub._trade_subs["BTC-USDT"]
    assert len(hub.trades["BTC-USDT"]) == 2


def test_diff_side_detects_changes_and_removals():
    from decimal import Decimal as D

    prev = {D("1"): (D("1"), 1), D("2"): (D("5"), 2)}
    cur = {D("1"): (D("3"), 1), D("3"): (D("1"), 1)}
    diff = _diff_side(prev, cur)
    assert ["1.00000000", "3.00000000", 1] in diff
    assert ["3.00000000", "1.00000000", 1] in diff
    assert ["2.00000000", "0.00000000", 0] in diff
    assert len(diff) == 3
