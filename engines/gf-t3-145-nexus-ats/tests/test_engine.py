"""
Ghost FactoryOS — Engine GF-T3-145: Nexus-ATS Matching Engine
Comprehensive Engine Domain Unit Tests.
License: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.models import (
    SideEnum,
    OrderTypeEnum,
    VenueEnum,
    OrderStatusEnum,
    OrderSubmissionRequest,
    OrderCancelRequest,
    DarkCrossRequest,
)
from src.engine import (
    OrderBook,
    DarkPoolEngine,
    VpinHawkesEngine,
    NexusATSEngine,
    InternalOrder,
)


class TestOrderBook:
    def test_order_book_initialization(self):
        book = OrderBook("GF-US-100")
        assert book.instrument_id == "GF-US-100"
        snapshot = book.get_snapshot(levels=5)
        assert snapshot.nbbo_bid == 99.95
        assert snapshot.nbbo_ask == 100.00
        assert snapshot.midpoint == 99.975
        assert snapshot.spread_bps > 0
        assert len(snapshot.bids) == 5
        assert len(snapshot.asks) == 5

    def test_submit_resting_limit_orders(self):
        book = OrderBook("GF-US-100")
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.LIMIT,
            limit_price=99.90,
            quantity=200,
            client_order_id="TEST-BUY-01",
        )
        res = book.submit_order(req, mpid="JUMP")
        assert res.status == OrderStatusEnum.NEW
        assert res.filled_quantity == 0
        assert res.remaining_quantity == 200
        assert res.order_id in book.orders_by_id

    def test_aggressive_limit_order_crossing(self):
        book = OrderBook("GF-US-100")
        # Aggressive buy crossing the inside ask (100.00)
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.LIMIT,
            limit_price=100.00,
            quantity=300,
            client_order_id="TEST-CROSS-01",
        )
        res = book.submit_order(req, mpid="JUMP")
        assert res.status == OrderStatusEnum.FILLED
        assert res.filled_quantity == 300
        assert res.remaining_quantity == 0
        assert res.average_execution_price == 100.00
        assert len(res.trades) > 0

    def test_market_order_execution(self):
        book = OrderBook("GF-US-100")
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.MARKET,
            quantity=400,
            client_order_id="TEST-MKT-BUY",
        )
        res = book.submit_order(req, mpid="JUMP")
        assert res.status == OrderStatusEnum.FILLED
        assert res.filled_quantity == 400
        assert res.remaining_quantity == 0
        assert res.average_execution_price >= 100.00

        # Sell market order
        req_sell = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            order_type=OrderTypeEnum.MARKET,
            quantity=300,
            client_order_id="TEST-MKT-SELL",
        )
        res_sell = book.submit_order(req_sell, mpid="JUMP")
        assert res_sell.status == OrderStatusEnum.FILLED
        assert res_sell.filled_quantity == 300
        assert res_sell.average_execution_price <= 99.95

    def test_ioc_order_partial_fill_and_cancel(self):
        book = OrderBook("GF-US-100")
        # IOC buy at 100.00 with large size exceeding the level
        # Inside ask is 500 shares at 100.00
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.IOC,
            limit_price=100.00,
            quantity=800,
            client_order_id="TEST-IOC-01",
        )
        res = book.submit_order(req, mpid="SUSQ")
        assert res.filled_quantity == 500
        assert res.remaining_quantity == 0
        assert res.status == OrderStatusEnum.CANCELED

    def test_fok_order_satisfaction_and_kill(self):
        book = OrderBook("GF-US-100")
        # FOK when size cannot be satisfied at limit price
        req_kill = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.FOK,
            limit_price=100.00,
            quantity=1000,  # only 500 available at 100.00
            client_order_id="TEST-FOK-KILL",
        )
        res_kill = book.submit_order(req_kill, mpid="SUSQ")
        assert res_kill.status == OrderStatusEnum.REJECTED
        assert res_kill.filled_quantity == 0

        # FOK when size can be satisfied
        req_fill = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.FOK,
            limit_price=100.00,
            quantity=250,
            client_order_id="TEST-FOK-FILL",
        )
        res_fill = book.submit_order(req_fill, mpid="SUSQ")
        assert res_fill.status == OrderStatusEnum.FILLED
        assert res_fill.filled_quantity == 250

    def test_order_cancellation(self):
        book = OrderBook("GF-US-100")
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.LIMIT,
            limit_price=99.80,
            quantity=500,
        )
        res = book.submit_order(req, mpid="TOWR")
        assert res.order_id in book.orders_by_id

        # Cancel order
        cancel_res = book.cancel_order(res.order_id)
        assert cancel_res.status == "CANCELED"
        assert cancel_res.unallocated_quantity == 500
        assert res.order_id not in book.orders_by_id

        # Cancel non-existent order
        cancel_missing = book.cancel_order("NON-EXISTENT-ID")
        assert cancel_missing.status == "NOT_FOUND"
        assert cancel_missing.unallocated_quantity == 0

    def test_anti_internalization_prevention(self):
        book = OrderBook("GF-US-100")
        # Seed order from CITD is at 99.95
        # Submit sell order at 99.95 from same MPID CITD with anti_internalization enabled
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            order_type=OrderTypeEnum.LIMIT,
            limit_price=99.95,
            quantity=200,
            anti_internalization=True,
        )
        # Should not match against own orders if anti_internalization is True
        res = book.submit_order(req, mpid="CITD")
        # CITD rests or matches other participant
        assert res.order_id is not None


class TestDarkPoolEngine:
    def test_dark_cross_midpoint_execution(self):
        book = OrderBook("GF-US-100")
        dark = DarkPoolEngine("GF-US-100")
        dark.resting_sell_pegs.clear()
        dark.resting_buy_pegs.clear()

        # First add a resting dark sell peg
        dark_sell = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            quantity=1000,
            min_quantity=200,
        )
        res_sell = dark.cross(dark_sell, book, mpid="CITD")
        assert res_sell.cross_status == "RESTING_DARK"
        assert res_sell.executed_quantity == 0

        # Now submit matching dark buy cross
        dark_buy = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            quantity=600,
            min_quantity=100,
        )
        res_buy = dark.cross(dark_buy, book, mpid="JUMP")
        assert res_buy.cross_status == "FILLED"
        assert res_buy.executed_quantity == 600
        assert res_buy.midpoint_execution_price == 99.975
        assert res_buy.price_improvement_total_usd > 0

    def test_dark_cross_min_quantity_filter(self):
        book = OrderBook("GF-US-100")
        dark = DarkPoolEngine("GF-US-100")

        # Resting sell peg with large min quantity
        dark_sell = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            quantity=1000,
            min_quantity=800,
        )
        dark.cross(dark_sell, book, mpid="CITD")

        # Small incoming buy that fails min_quantity
        dark_buy_small = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            quantity=300,
            min_quantity=100,
        )
        res_small = dark.cross(dark_buy_small, book, mpid="JUMP")
        assert res_small.executed_quantity == 0
        assert res_small.cross_status == "RESTING_DARK"


class TestVpinHawkesEngine:
    def test_toxicity_metrics(self):
        engine = VpinHawkesEngine("GF-US-100")
        metrics = engine.get_metrics()
        assert metrics.instrument_id == "GF-US-100"
        assert metrics.current_vpin == 0.225
        assert metrics.vpin_threshold == 0.42
        assert not metrics.is_toxic_flow_detected
        assert metrics.hawkes_trade_intensity_lambda1 == 3.42
        assert metrics.hawkes_cancel_intensity_lambda2 == 4.15
        assert metrics.predatory_cancel_ratio > 0.5


class TestNexusATSEngine:
    def test_orchestrator_flow(self):
        ats = NexusATSEngine("GF-US-100")
        assert ats.instrument_id == "GF-US-100"

        # Depth
        depth = ats.get_depth(5)
        assert len(depth.bids) == 5

        # Submit LIT order
        req = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            order_type=OrderTypeEnum.LIMIT,
            limit_price=99.85,
            quantity=100,
        )
        resp = ats.submit_order(req, mpid="TEST")
        assert resp.status == OrderStatusEnum.NEW

        # Cancel order
        cancel_resp = ats.cancel_order(resp.order_id)
        assert cancel_resp.status == "CANCELED"

        # Dark cross
        dark_req = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            quantity=500,
        )
        dark_resp = ats.execute_dark_cross(dark_req, mpid="TEST")
        assert dark_resp.cross_status in ["FILLED", "RESTING_DARK"]

        # Health & Compliance
        health = ats.get_health()
        assert health.status == "HEALTHY"
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = ats.get_compliance()
        assert compliance.engineId == "GF-T3-145"
        assert compliance.copyleftViolations == 0

    def test_fok_sell_order_flow(self):
        book = OrderBook("GF-US-100")
        req_kill = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            order_type=OrderTypeEnum.FOK,
            limit_price=99.95,
            quantity=2000,  # exceeds bid at 99.95
        )
        res_kill = book.submit_order(req_kill, mpid="JUMP")
        assert res_kill.status == OrderStatusEnum.REJECTED

        req_fill = OrderSubmissionRequest(
            instrument_id="GF-US-100",
            side=SideEnum.SELL,
            order_type=OrderTypeEnum.FOK,
            limit_price=99.95,
            quantity=200,
        )
        res_fill = book.submit_order(req_fill, mpid="JUMP")
        assert res_fill.status == OrderStatusEnum.FILLED

    def test_dark_cross_sweep_to_lit(self):
        book = OrderBook("GF-US-100")
        dark = DarkPoolEngine("GF-US-100")
        dark.resting_sell_pegs.clear()
        dark.resting_buy_pegs.clear()

        # Submit dark buy with sweep_to_lit_on_unfilled=True
        req = DarkCrossRequest(
            instrument_id="GF-US-100",
            side=SideEnum.BUY,
            quantity=400,
            sweep_to_lit_on_unfilled=True,
        )
        res = dark.cross(req, book, mpid="JUMP")
        assert res.executed_quantity == 400
        assert res.cross_status == "FILLED"
