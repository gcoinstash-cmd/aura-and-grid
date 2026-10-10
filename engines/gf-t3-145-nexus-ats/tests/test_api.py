"""
Ghost FactoryOS — Engine GF-T3-145: Nexus-ATS Matching Engine
Comprehensive FastAPI Endpoint Integration Tests.
License: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


class TestApiEndpoints:
    def test_healthz(self):
        response = client.get("/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "gf-t3-145-nexus-ats"

    def test_v1_health(self):
        response = client.get("/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "HEALTHY"
        assert data["engineVersion"] == "1.0.0-PROD"
        assert "CLEAN-ROOM" in data["cleanRoomCompliance"]

    def test_audit_compliance(self):
        response = client.get("/audit/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["engineId"] == "GF-T3-145"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]

    def test_book_depth(self):
        response = client.get("/api/v1/book/depth?instrument_id=GF-US-100&levels=5")
        assert response.status_code == 200
        data = response.json()
        assert data["instrument_id"] == "GF-US-100"
        assert data["nbbo_bid"] == 99.95
        assert data["nbbo_ask"] == 100.00
        assert len(data["bids"]) <= 5
        assert len(data["asks"]) <= 5

    def test_submit_order_limit(self):
        payload = {
            "instrument_id": "GF-US-100",
            "side": "BUY",
            "order_type": "LIMIT",
            "limit_price": 99.80,
            "quantity": 150,
            "client_order_id": "API-TEST-01",
        }
        headers = {
            "X-Participant-MPID": "GHTF",
            "X-SBE-Sequence-Num": "1001",
        }
        response = client.post("/api/v1/order/submit", json=payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "NEW"
        assert data["remaining_quantity"] == 150
        assert data["order_id"].startswith("ORD-")

    def test_submit_order_market_fill(self):
        payload = {
            "instrument_id": "GF-US-100",
            "side": "BUY",
            "order_type": "MARKET",
            "quantity": 250,
            "client_order_id": "API-MKT-01",
        }
        response = client.post("/api/v1/order/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "FILLED"
        assert data["filled_quantity"] == 250

    def test_submit_order_dark_venue(self):
        payload = {
            "instrument_id": "GF-US-100",
            "side": "BUY",
            "order_type": "MIDPOINT_PEG",
            "execution_venue": "DARK",
            "quantity": 300,
            "client_order_id": "API-DARK-01",
        }
        response = client.post("/api/v1/order/submit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["FILLED", "RESTING_DARK", "PARTIALLY_FILLED"]

    def test_order_cancel_flow(self):
        # First place resting order
        submit_payload = {
            "instrument_id": "GF-US-100",
            "side": "BUY",
            "order_type": "LIMIT",
            "limit_price": 99.70,
            "quantity": 100,
        }
        sub_resp = client.post("/api/v1/order/submit", json=submit_payload)
        assert sub_resp.status_code == 200
        order_id = sub_resp.json()["order_id"]

        # Cancel the order
        cancel_payload = {
            "order_id": order_id,
            "instrument_id": "GF-US-100",
        }
        can_resp = client.post("/api/v1/order/cancel", json=cancel_payload)
        assert can_resp.status_code == 200
        assert can_resp.json()["status"] == "CANCELED"
        assert can_resp.json()["unallocated_quantity"] == 100

    def test_order_cancel_not_found(self):
        cancel_payload = {
            "order_id": "NON-EXISTENT-ORDER-ID",
            "instrument_id": "GF-US-100",
        }
        can_resp = client.post("/api/v1/order/cancel", json=cancel_payload)
        assert can_resp.status_code == 404

    def test_dark_cross_endpoint(self):
        payload = {
            "instrument_id": "GF-US-100",
            "side": "BUY",
            "quantity": 400,
            "min_quantity": 100,
        }
        response = client.post("/api/v1/dark/cross", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["cross_status"] in ["FILLED", "RESTING_DARK", "PARTIALLY_FILLED"]
        assert data["midpoint_execution_price"] > 0

    def test_telemetry_vpin_hawkes(self):
        response = client.get("/api/v1/telemetry/vpin-hawkes?instrument_id=GF-US-100")
        assert response.status_code == 200
        data = response.json()
        assert data["instrument_id"] == "GF-US-100"
        assert "current_vpin" in data
        assert "hawkes_trade_intensity_lambda1" in data
        assert "predatory_cancel_ratio" in data

    def test_validation_error_422(self):
        # Invalid side
        payload = {
            "instrument_id": "GF-US-100",
            "side": "INVALID_SIDE",
            "order_type": "LIMIT",
            "quantity": -50,
        }
        response = client.post("/api/v1/order/submit", json=payload)
        assert response.status_code == 422
