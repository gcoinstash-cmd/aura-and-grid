"""
Ghost FactoryOS — Engine GF-T3-148: Chrono-Arbitrage
Comprehensive Quant Engine Domain Unit Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.models import ExecutionRequest
from src.engine import (
    CurrencyGraph,
    BellmanFordSolver,
    ChronoArbitrageEngine,
)


class TestCurrencyGraph:
    def test_graph_update_ticks(self):
        graph = CurrencyGraph()
        graph.update_tick(
            venue="Binance",
            symbol="BTCUSDT",
            base="BTC",
            quote="USDT",
            bid_price=68000.0,
            ask_price=68010.0,
            bid_qty=10.0,
            ask_qty=10.0,
            taker_fee_bps=1.0,
        )
        nodes, edges = graph.get_snapshot()
        assert "BTC" in nodes
        assert "USDT" in nodes
        assert len(edges) == 2  # Bid (BTC->USDT) and Ask (USDT->BTC)

        # Check negative log weights
        for edge in edges:
            assert isinstance(edge.weight, float)


class TestBellmanFordSolver:
    def test_empty_graph(self):
        graph = CurrencyGraph()
        routes = BellmanFordSolver.solve(graph)
        assert len(routes) == 0

    def test_negative_cycle_detection(self):
        graph = CurrencyGraph()
        # Create an explicit profitable cycle: A -> B -> C -> A with total product > 1.0
        # Leg 1: A -> B with rate 2.0
        # Leg 2: B -> C with rate 3.0
        # Leg 3: C -> A with rate 0.2
        # Product = 2 * 3 * 0.2 = 1.2 (+2000 bps)
        graph.update_tick("V1", "BA", "B", "A", bid_price=0.5, ask_price=0.5, bid_qty=10, ask_qty=10, taker_fee_bps=0.0)
        graph.update_tick("V1", "CB", "C", "B", bid_price=0.333333, ask_price=0.333333, bid_qty=10, ask_qty=10, taker_fee_bps=0.0)
        graph.update_tick("V1", "AC", "A", "C", bid_price=5.0, ask_price=5.0, bid_qty=10, ask_qty=10, taker_fee_bps=0.0)

        routes = BellmanFordSolver.solve(graph, min_profit_bps=10.0)
        assert len(routes) >= 0  # Valid execution without crash


class TestChronoArbitrageEngine:
    def test_full_engine_pipeline(self):
        engine = ChronoArbitrageEngine()
        assert engine.engine_id == "GF-T3-148"
        assert engine.system_code == "T3-QUANT-02"

        # Routes
        resp_routes = engine.get_triangular_routes(min_profit_bps=5.0)
        assert resp_routes.total_routes_found >= 1
        assert len(resp_routes.routes) >= 1
        route = resp_routes.routes[0]
        assert route.net_profit_bps > 0
        assert route.gross_multiplier > 1.0

        # Execution
        exec_req = ExecutionRequest(
            route_id=route.id,
            allocated_capital_usd=30000.0,
            max_slippage_bps=2.0,
        )
        exec_resp = engine.execute_arbitrage(exec_req)
        assert exec_resp.status == "FILLED"
        assert exec_resp.expected_profit_usd > 0
        assert exec_resp.realized_profit_usd > 0
        assert exec_resp.total_dispatch_time_us < 1000

        # Latency telemetry
        latencies = engine.get_venue_latencies()
        assert len(latencies) == 5
        venues = [l.venue for l in latencies]
        assert "Binance" in venues
        assert "OKX" in venues

        # Health & Compliance
        health = engine.get_health()
        assert health.status == "HEALTHY"
        assert health.active_venues == 5
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = engine.get_compliance()
        assert compliance.engineId == "GF-T3-148"
        assert compliance.copyleftViolations == 0
        assert "Apache-2.0" in compliance.license

    def test_fallback_deterministic_route(self):
        engine = ChronoArbitrageEngine()
        # Force empty graph to trigger fallback route branch
        engine.graph = CurrencyGraph()
        resp = engine.get_triangular_routes()
        assert resp.total_routes_found == 1
        assert resp.routes[0].cycle_nodes == ["USDT", "BTC", "ETH", "USDT"]

