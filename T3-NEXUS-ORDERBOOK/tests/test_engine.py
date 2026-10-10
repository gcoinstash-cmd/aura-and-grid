"""
T3-NEXUS-ORDERBOOK: Automated Verification Test Suite
Target: >85% Code Coverage & Zero Algorithmic Drift
Run: pytest tests/ -v --cov=src --cov-report=term-missing
"""
import pytest
from decimal import Decimal
import asyncio
from concurrent.futures import ThreadPoolExecutor

from src.models import (
    OrderRecord, OrderSide, OrderType, OrderStatus,
    TimeInForce, SelfTradePrevention
)
from src.engine import OrderBook


@pytest.fixture
def clean_book():
    return OrderBook(
        symbol="BTC-USDT",
        maker_fee_rate=Decimal("-0.00015"),
        taker_fee_rate=Decimal("0.00040")
    )


def test_clean_room_empty_orderbook(clean_book):
    assert clean_book.get_best_bid() is None
    assert clean_book.get_best_ask() is None
    snapshot = clean_book.get_l2_snapshot()
    assert len(snapshot.bids) == 0
    assert len(snapshot.asks) == 0


def test_limit_order_placement_and_cancellation(clean_book):
    order = OrderRecord(
        client_order_id="cl-001",
        symbol="BTC-USDT",
        side=OrderSide.BUY,
        order_type=OrderType.LIMIT,
        price=Decimal("60000.00"),
        original_quantity=Decimal("1.50000000"),
        remaining_quantity=Decimal("1.50000000"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_alpha",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    )

    trades, updated = clean_book.process_order(order)
    assert len(trades) == 0
    assert updated.status == OrderStatus.ACCEPTED
    assert clean_book.get_best_bid() == Decimal("60000.00")

    # Cancel the resting order
    cancelled = clean_book.cancel_order(order.order_id)
    assert cancelled is not None
    assert cancelled.status == OrderStatus.CANCELLED
    assert clean_book.get_best_bid() is None


def test_full_crossing_limit_match(clean_book):
    # 1. Place resting ask: 2.0 @ 61000
    maker_sell = OrderRecord(
        client_order_id="m-sell-1",
        symbol="BTC-USDT",
        side=OrderSide.SELL,
        order_type=OrderType.LIMIT,
        price=Decimal("61000.00"),
        original_quantity=Decimal("2.00000000"),
        remaining_quantity=Decimal("2.00000000"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_beta",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    )
    clean_book.process_order(maker_sell)

    # 2. Place crossing bid: 2.0 @ 61500 (Aggressive match)
    taker_buy = OrderRecord(
        client_order_id="t-buy-1",
        symbol="BTC-USDT",
        side=OrderSide.BUY,
        order_type=OrderType.LIMIT,
        price=Decimal("61500.00"),
        original_quantity=Decimal("2.00000000"),
        remaining_quantity=Decimal("2.00000000"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_gamma",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    )
    trades, updated = clean_book.process_order(taker_buy)

    assert len(trades) == 1
    trade = trades[0]
    assert trade.price == Decimal("61000.00")  # Executed at maker price
    assert trade.quantity == Decimal("2.00000000")
    assert trade.maker_fee_rebate < Decimal("0")  # Maker earned rebate
    assert trade.taker_fee_paid > Decimal("0")    # Taker paid fee
    assert updated.status == OrderStatus.FILLED
    assert clean_book.get_best_ask() is None


def test_partial_fill_with_remaining_resting(clean_book):
    # Resting ask: 1.0 @ 62000
    clean_book.process_order(OrderRecord(
        client_order_id="m-1",
        symbol="BTC-USDT",
        side=OrderSide.SELL,
        order_type=OrderType.LIMIT,
        price=Decimal("62000.00"),
        original_quantity=Decimal("1.00000000"),
        remaining_quantity=Decimal("1.00000000"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_1",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    ))

    # Aggressive buy: 3.0 @ 62000 -> Should consume 1.0, rest 2.0 at 62000 bid
    trades, taker = clean_book.process_order(OrderRecord(
        client_order_id="t-1",
        symbol="BTC-USDT",
        side=OrderSide.BUY,
        order_type=OrderType.LIMIT,
        price=Decimal("62000.00"),
        original_quantity=Decimal("3.00000000"),
        remaining_quantity=Decimal("3.00000000"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_2",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    ))

    assert len(trades) == 1
    assert trades[0].quantity == Decimal("1.00000000")
    assert taker.filled_quantity == Decimal("1.00000000")
    assert taker.remaining_quantity == Decimal("2.00000000")
    assert taker.status == OrderStatus.PARTIALLY_FILLED
    assert clean_book.get_best_bid() == Decimal("62000.00")
    assert clean_book.get_best_ask() is None


def test_self_trade_prevention_cancel_taker(clean_book):
    # Resting bid for trader_omega
    clean_book.process_order(OrderRecord(
        client_order_id="omega-bid",
        symbol="BTC-USDT",
        side=OrderSide.BUY,
        order_type=OrderType.LIMIT,
        price=Decimal("60000.00"),
        original_quantity=Decimal("1.0"),
        remaining_quantity=Decimal("1.0"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_omega",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    ))

    # Same trader attempts to cross own order with sell @ 60000
    trades, taker = clean_book.process_order(OrderRecord(
        client_order_id="omega-sell",
        symbol="BTC-USDT",
        side=OrderSide.SELL,
        order_type=OrderType.LIMIT,
        price=Decimal("60000.00"),
        original_quantity=Decimal("1.0"),
        remaining_quantity=Decimal("1.0"),
        time_in_force=TimeInForce.GTC,
        trader_id="trader_omega",
        stp_mode=SelfTradePrevention.CANCEL_TAKER
    ))

    assert len(trades) == 0
    assert taker.status == OrderStatus.CANCELLED
    # Resting order remains alive
    assert clean_book.get_best_bid() == Decimal("60000.00")


def test_cancel_nonexistent_order_returns_none(clean_book):
    res = clean_book.cancel_order("non-existent-uuid-0000")
    assert res is None


def test_high_volume_burst_deterministic_invariants(clean_book):
    burst_count = 1000
    for i in range(burst_count):
        side = OrderSide.BUY if i % 2 == 0 else OrderSide.SELL
        price = Decimal("50000.00") + Decimal(str(i % 50))
        clean_book.process_order(OrderRecord(
            client_order_id=f"burst-{i}",
            symbol="BTC-USDT",
            side=side,
            order_type=OrderType.LIMIT,
            price=price,
            original_quantity=Decimal("0.1"),
            remaining_quantity=Decimal("0.1"),
            time_in_force=TimeInForce.GTC,
            trader_id=f"trader_{i % 10}",
            stp_mode=SelfTradePrevention.CANCEL_TAKER
        ))

    # The clearing invariant must remain strictly true: Best Bid < Best Ask
    best_bid = clean_book.get_best_bid()
    best_ask = clean_book.get_best_ask()
    if best_bid is not None and best_ask is not None:
        assert best_bid < best_ask, f"Arbitrage violation: Bid {best_bid} >= Ask {best_ask}"
