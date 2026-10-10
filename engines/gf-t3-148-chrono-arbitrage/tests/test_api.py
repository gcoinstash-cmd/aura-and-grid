"""
Ghost FactoryOS — Engine GF-T3-148: Chrono-Arbitrage
FastAPI Endpoint Integration Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from src.main import app

client = TestClient(app)


class TestApiEndpoints:
    def test_healthz(self):
        response = client.get("/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "gf-t3-148-chrono-arbitrage"
        assert data["version"] == "1.0.0-PROD"

    def test_v1_health(self):
        response = client.get("/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "HEALTHY"
        assert data["active_venues"] == 5
        assert "CLEAN-ROOM" in data["cleanRoomCompliance"]

    def test_audit_compliance(self):
        response = client.get("/audit/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["engineId"] == "GF-T3-148"
        assert data["systemCode"] == "T3-QUANT-02"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]
        assert "Negative-Log" in data["mathematicalProof"]

    def test_get_triangular_routes_default(self):
        response = client.get("/api/v1/routes/triangular")
        assert response.status_code == 200
        data = response.json()
        assert data["total_routes_found"] >= 1
        assert len(data["routes"]) >= 1
        route = data["routes"][0]
        assert "id" in route
        assert "cycle_nodes" in route
        assert route["gross_multiplier"] > 1.0
        assert route["net_profit_bps"] > 0

    def test_get_triangular_routes_filtered(self):
        response = client.get("/api/v1/routes/triangular?min_profit_bps=10.0&max_hops=5")
        assert response.status_code == 200
        data = response.json()
        assert "total_routes_found" in data
        assert isinstance(data["routes"], list)

    def test_get_triangular_routes_validation_error(self):
        # min_profit_bps < 0 or max_hops > 6
        response = client.get("/api/v1/routes/triangular?min_profit_bps=-1.0")
        assert response.status_code == 422

        response = client.get("/api/v1/routes/triangular?max_hops=10")
        assert response.status_code == 422

        response = client.get("/api/v1/routes/triangular?max_hops=2")
        assert response.status_code == 422

    def test_execute_arbitrage_success(self):
        payload = {
            "route_id": "ARB-TEST-001",
            "allocated_capital_usd": 50000.0,
            "max_slippage_bps": 2.5,
        }
        response = client.post("/api/v1/execute/arb", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "FILLED"
        assert data["expected_profit_usd"] > 0
        assert data["realized_profit_usd"] > 0
        assert data["total_dispatch_time_us"] > 0

    def test_execute_arbitrage_validation_error(self):
        # capital < 100
        payload = {
            "route_id": "ARB-TEST-001",
            "allocated_capital_usd": 50.0,
            "max_slippage_bps": 2.5,
        }
        response = client.post("/api/v1/execute/arb", json=payload)
        assert response.status_code == 422

    def test_execute_arbitrage_exception_handling(self):
        with patch("src.main.engine.execute_arbitrage", side_effect=RuntimeError("Simulated execution failure")):
            payload = {
                "route_id": "ARB-TEST-ERR",
                "allocated_capital_usd": 25000.0,
                "max_slippage_bps": 2.0,
            }
            response = client.post("/api/v1/execute/arb", json=payload)
            assert response.status_code == 400
            assert "Arbitrage execution failed" in response.json()["detail"]

    def test_get_venue_latencies(self):
        response = client.get("/api/v1/latency/venues")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5
        venues = [v["venue"] for v in data]
        assert "Binance" in venues
        assert "OKX" in venues
        for v in data:
            assert v["ping_ms"] > 0
            assert v["orderbook_depth_usd"] > 0
            assert v["status"] == "ACTIVE"
