"""
T3-NEXUS-ORDERBOOK: Extended matching-core tests (additions to ENGINE_SPEC.md Section 8).

Covers sell-side matching, multi-level sweeps, FIFO priority, self-trade prevention
variants, fee conservation (Section 4.2), and model validation.
"""
from decimal import Decimal as D

import pytest
from pydantic import ValidationError

from src.engine import OrderBook
from src.models import (
    OrderCreateRequest,
    OrderRecord,
    OrderSide,
    OrderStatus,
    OrderType,
    SelfTradePrevention,
    TimeInForce,
)


def mk(side, price, qty, trader="t", otype=OrderType.LIMIT, tif=TimeInForce.GTC,
       stp=SelfTradePrevention.CANCEL_TAKER, cid=None):
    return OrderRecord(
        client_order_id=cid or f"c-{side.value}-{price}-{qty}-{trader}",
        symbol="BTC-USDT",
        side=side,
        order_type=otype,
        price=None if price is None else D(str(price)),
        original_quantity=D(str(qty)),
        remaining_quantity=D(str(qty)),
        time_in_force=tif,
        trader_id=trader,
        stp_mode=stp,
    )


@pytest.fixture
def book():
    return OrderBook("BTC-USDT")


# ------------------------------------------------------------ price ladders
def test_price_ladders_sorted_best_first(book):
    for p in (100, 102, 101):
        book.process_order(mk(OrderSide.BUY, p, 1, trader=f"b{p}"))
    for p in (110, 108, 109):
        book.process_order(mk(OrderSide.SELL, p, 1, trader=f"s{p}"))
    assert book.bid_prices == [D(102), D(101), D(100)]
    assert book.ask_prices == [D(108), D(109), D(110)]
    assert book.get_best_bid() == D(102)
    assert book.get_best_ask() == D(108)


def test_same_price_orders_share_one_level(book):
    book.process_order(mk(OrderSide.BUY, 100, 1, trader="a"))
    book.process_order(mk(OrderSide.BUY, 100, 2, trader="b"))
    snap = book.get_l2_snapshot()
    assert len(snap.bids) == 1
    assert snap.bids[0].quantity == D(3) and snap.bids[0].order_count == 2


def test_l2_snapshot_depth_truncation(book):
    for p in range(100, 110):
        book.process_order(mk(OrderSide.BUY, p, 1, trader=f"b{p}"))
        book.process_order(mk(OrderSide.SELL, p + 100, 1, trader=f"s{p}"))
    snap = book.get_l2_snapshot(depth=3)
    assert len(snap.bids) == 3 and len(snap.asks) == 3
    assert snap.bids[0].price == D(109) and snap.asks[0].price == D(200)


# ------------------------------------------------------------- sell matching
def test_aggressive_sell_matches_best_bid_at_maker_price(book):
    book.process_order(mk(OrderSide.BUY, 100, 2, trader="maker"))
    trades, taker = book.process_order(mk(OrderSide.SELL, 99, 2, trader="taker"))
    assert len(trades) == 1
    assert trades[0].price == D(100)
    assert trades[0].side == OrderSide.SELL
    assert taker.status == OrderStatus.FILLED
    assert book.get_best_bid() is None


def test_sell_limit_that_does_not_cross_rests(book):
    book.process_order(mk(OrderSide.BUY, 100, 1, trader="a"))
    trades, taker = book.process_order(mk(OrderSide.SELL, 101, 1, trader="b"))
    assert trades == [] and taker.status == OrderStatus.ACCEPTED
    assert book.get_best_ask() == D(101)


def test_buy_limit_that_does_not_cross_rests(book):
    book.process_order(mk(OrderSide.SELL, 101, 1, trader="a"))
    trades, taker = book.process_order(mk(OrderSide.BUY, 100, 1, trader="b"))
    assert trades == [] and taker.status == OrderStatus.ACCEPTED


# ------------------------------------------------------------ sweep and FIFO
def test_buy_sweeps_multiple_levels_in_price_order(book):
    book.process_order(mk(OrderSide.SELL, 102, 1, trader="s2"))
    book.process_order(mk(OrderSide.SELL, 101, 1, trader="s1"))
    book.process_order(mk(OrderSide.SELL, 103, 1, trader="s3"))
    trades, taker = book.process_order(mk(OrderSide.BUY, 102, 5, trader="buyer"))
    assert [t.price for t in trades] == [D(101), D(102)]
    assert [t.sequence_id for t in trades] == [1, 2]
    assert taker.status == OrderStatus.PARTIALLY_FILLED
    assert taker.remaining_quantity == D(3)
    assert book.get_best_bid() == D(102)  # remainder rests
    assert book.get_best_ask() == D(103)


def test_sell_sweeps_multiple_levels_in_price_order(book):
    book.process_order(mk(OrderSide.BUY, 99, 1, trader="b1"))
    book.process_order(mk(OrderSide.BUY, 100, 1, trader="b2"))
    trades, taker = book.process_order(mk(OrderSide.SELL, 99, 2, trader="seller"))
    assert [t.price for t in trades] == [D(100), D(99)]
    assert taker.status == OrderStatus.FILLED


def test_fifo_time_priority_within_level(book):
    a = mk(OrderSide.SELL, 100, 1, trader="first")
    b = mk(OrderSide.SELL, 100, 1, trader="second")
    book.process_order(a)
    book.process_order(b)
    trades, _ = book.process_order(mk(OrderSide.BUY, 100, 1, trader="buyer"))
    assert trades[0].maker_order_id == a.order_id
    assert b.order_id in book.orders and a.order_id not in book.orders


def test_partial_fill_of_maker_keeps_it_resting_with_updated_volume(book):
    maker = mk(OrderSide.SELL, 100, 5, trader="maker")
    book.process_order(maker)
    book.process_order(mk(OrderSide.BUY, 100, 2, trader="taker"))
    assert maker.status == OrderStatus.PARTIALLY_FILLED
    assert maker.remaining_quantity == D(3) and maker.filled_quantity == D(2)
    snap = book.get_l2_snapshot()
    assert snap.asks[0].quantity == D(3)


def test_sell_partial_maker_fill(book):
    maker = mk(OrderSide.BUY, 100, 5, trader="maker")
    book.process_order(maker)
    book.process_order(mk(OrderSide.SELL, 100, 2, trader="taker"))
    assert maker.status == OrderStatus.PARTIALLY_FILLED
    assert book.get_l2_snapshot().bids[0].quantity == D(3)


# ------------------------------------------------------- market / IOC orders
def test_market_buy_consumes_liquidity_without_resting(book):
    book.process_order(mk(OrderSide.SELL, 100, 1, trader="s"))
    trades, taker = book.process_order(
        mk(OrderSide.BUY, None, 3, trader="b", otype=OrderType.MARKET)
    )
    assert len(trades) == 1
    assert taker.status == OrderStatus.PARTIALLY_FILLED
    assert book.get_best_bid() is None


def test_market_sell_on_empty_book_is_cancelled(book):
    trades, taker = book.process_order(
        mk(OrderSide.SELL, None, 1, trader="s", otype=OrderType.MARKET)
    )
    assert trades == [] and taker.status == OrderStatus.CANCELLED


def test_ioc_limit_does_not_rest(book):
    trades, taker = book.process_order(mk(OrderSide.BUY, 100, 1, trader="b", tif=TimeInForce.IOC))
    assert trades == [] and taker.status == OrderStatus.CANCELLED
    assert book.get_best_bid() is None


# ------------------------------------------------- self-trade prevention
def test_stp_cancel_taker_on_buy_side(book):
    book.process_order(mk(OrderSide.SELL, 100, 1, trader="omega"))
    trades, taker = book.process_order(mk(OrderSide.BUY, 100, 1, trader="omega"))
    assert trades == [] and taker.status == OrderStatus.CANCELLED
    assert book.get_best_ask() == D(100)


def test_stp_cancel_maker_on_buy_side_cancels_resting_then_continues(book):
    own = mk(OrderSide.SELL, 100, 1, trader="omega")
    other = mk(OrderSide.SELL, 100, 1, trader="other")
    book.process_order(own)
    book.process_order(other)
    trades, taker = book.process_order(
        mk(OrderSide.BUY, 100, 1, trader="omega", stp=SelfTradePrevention.CANCEL_MAKER)
    )
    assert own.status == OrderStatus.CANCELLED
    assert len(trades) == 1 and trades[0].maker_order_id == other.order_id
    assert taker.status == OrderStatus.FILLED


def test_stp_cancel_maker_on_sell_side(book):
    own = mk(OrderSide.BUY, 100, 1, trader="omega")
    book.process_order(own)
    trades, taker = book.process_order(
        mk(OrderSide.SELL, 100, 1, trader="omega", stp=SelfTradePrevention.CANCEL_MAKER)
    )
    assert own.status == OrderStatus.CANCELLED
    assert trades == []
    # Remainder rests as an ask because the book is now empty on the bid side.
    assert taker.status == OrderStatus.ACCEPTED and book.get_best_ask() == D(100)


def test_stp_cancel_taker_on_sell_side(book):
    book.process_order(mk(OrderSide.BUY, 100, 1, trader="omega"))
    trades, taker = book.process_order(mk(OrderSide.SELL, 100, 1, trader="omega"))
    assert trades == [] and taker.status == OrderStatus.CANCELLED


# -------------------------------------------------------------- cancellation
def test_cancel_from_middle_of_queue_preserves_links(book):
    orders = [mk(OrderSide.BUY, 100, 1, trader=f"t{i}") for i in range(3)]
    for o in orders:
        book.process_order(o)
    book.cancel_order(orders[1].order_id)
    queue = book.bids[D(100)]
    assert queue.count == 2 and queue.total_volume == D(2)
    assert queue.head.order is orders[0] and queue.tail.order is orders[2]
    assert queue.head.next is queue.tail and queue.tail.prev is queue.head


def test_cancel_last_order_removes_price_level(book):
    o = mk(OrderSide.SELL, 105, 1)
    book.process_order(o)
    book.cancel_order(o.order_id)
    assert D(105) not in book.asks and book.ask_prices == []


# ------------------------------------------------------ fee conservation law
def test_fee_conservation_platform_margin_non_negative(book):
    book.process_order(mk(OrderSide.SELL, 61000, 2, trader="m"))
    trades, _ = book.process_order(mk(OrderSide.BUY, 61000, 2, trader="t"))
    t = trades[0]
    assert t.quote_volume == D(122000)
    assert t.taker_fee_paid == D(122000) * D("0.00040")
    assert t.maker_fee_rebate == D(122000) * D("-0.00015")
    assert t.taker_fee_paid - abs(t.maker_fee_rebate) >= 0


def test_custom_fee_rates_applied():
    b = OrderBook("X", maker_fee_rate=D("0"), taker_fee_rate=D("0.001"))
    b.process_order(mk(OrderSide.SELL, 10, 1, trader="m"))
    trades, _ = b.process_order(mk(OrderSide.BUY, 10, 1, trader="t"))
    assert trades[0].maker_fee_rebate == 0 and trades[0].taker_fee_paid == D("0.010")


# ------------------------------------------------------ clearing invariant
def test_clearing_invariant_holds_through_mixed_flow(book):
    import random

    rng = random.Random(1337)  # deterministic seed
    live = []
    for i in range(2000):
        if live and rng.random() < 0.2:
            book.cancel_order(live.pop(rng.randrange(len(live))))
            continue
        o = mk(
            rng.choice([OrderSide.BUY, OrderSide.SELL]),
            round(100 + rng.uniform(-5, 5), 2),
            round(rng.uniform(0.1, 3), 2),
            trader=f"t{i % 17}",
            stp=rng.choice([SelfTradePrevention.CANCEL_TAKER, SelfTradePrevention.CANCEL_MAKER]),
            cid=f"mix-{i}",
        )
        book.process_order(o)
        if o.order_id in book.orders:
            live.append(o.order_id)
        bid, ask = book.get_best_bid(), book.get_best_ask()
        if bid is not None and ask is not None:
            assert bid < ask
    # Aggregates agree with queues
    for price, q in book.bids.items():
        assert q.total_volume == sum(n.order.remaining_quantity for n in _iter(q))
        assert q.count == len(list(_iter(q)))


def _iter(queue):
    node = queue.head
    while node:
        yield node
        node = node.next


# ------------------------------------------------------------ model checks
def test_create_request_requires_positive_limit_price():
    with pytest.raises(ValidationError):
        OrderCreateRequest(symbol="BTC-USDT", side="BUY", order_type="LIMIT",
                           price="0", quantity="1", trader_id="a")


def test_create_request_rejects_excess_price_precision():
    with pytest.raises(ValidationError):
        OrderCreateRequest(symbol="BTC-USDT", side="BUY", order_type="LIMIT",
                           price="1.123456789", quantity="1", trader_id="a")


def test_create_request_market_order_needs_no_price_and_gets_client_id():
    req = OrderCreateRequest(symbol="BTC-USDT", side="SELL", order_type="MARKET",
                             quantity="1", trader_id="a")
    assert req.price is None and len(req.client_order_id) >= 8


def test_create_request_is_frozen_and_forbids_extras():
    req = OrderCreateRequest(symbol="BTC-USDT", side="BUY", order_type="MARKET",
                             quantity="1", trader_id="a")
    with pytest.raises(ValidationError):
        req.quantity = D(2)
    with pytest.raises(ValidationError):
        OrderCreateRequest(symbol="BTC-USDT", side="BUY", order_type="MARKET",
                           quantity="1", trader_id="a", bogus=1)
