"""
Ghost FactoryOS — Engine GF-T3-149: Chrono-Chassis Telemetry Interface
FastAPI Endpoint Integration Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


class TestApiEndpoints:
    def test_healthz(self):
        response = client.get("/healthz")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "gf-t3-149-chrono-chassis"
        assert data["version"] == "1.0.0-PROD"

    def test_v1_health(self):
        response = client.get("/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "HEALTHY"
        assert data["engine_id"] == "GF-T3-149"
        assert data["system_code"] == "T3-QUANT-03"
        assert "CLEAN-ROOM" in data["cleanRoomCompliance"]

    def test_audit_compliance(self):
        response = client.get("/audit/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["engineId"] == "GF-T3-149"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]
        assert "Hamiltonian" in data["mathematicalProof"]

    def test_get_telemetry_state(self):
        response = client.get("/api/v1/telemetry/state")
        assert response.status_code == 200
        data = response.json()
        assert "timestamp" in data
        assert "quantum" in data
        assert "aero" in data
        assert "arbitrageRoutes" in data
        assert data["quantum"]["coherenceRate"] > 0
        assert data["aero"]["downforceKgf"] > 0

    def test_set_drive_mode_success(self):
        payload = {"mode": "QUANTUM_SUPERPOSITION"}
        response = client.post("/api/v1/telemetry/drive-mode", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "QUANTUM_SUPERPOSITION" in data["message"]
        assert data["telemetry"]["driveMode"] == "QUANTUM_SUPERPOSITION"

    def test_set_drive_mode_validation_error(self):
        payload = {"mode": "INVALID_MODE"}
        response = client.post("/api/v1/telemetry/drive-mode", json=payload)
        assert response.status_code == 422

    def test_set_drive_mode_exception_handling(self):
        with patch("src.main.engine.set_drive_mode", side_effect=RuntimeError("Mode switch fault")):
            payload = {"mode": "LATENCY_ARBITRAGE"}
            response = client.post("/api/v1/telemetry/drive-mode", json=payload)
            assert response.status_code == 400
            assert "Failed to update drive mode" in response.json()["detail"]

    def test_set_diffuser_angle_success(self):
        payload = {"angle": 18.5}
        response = client.post("/api/v1/telemetry/diffuser-angle", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "18.5" in data["message"]
        assert data["telemetry"]["aero"]["diffuserAngleDeg"] == 18.5

    def test_set_diffuser_angle_validation_error(self):
        # angle < 10 or > 25
        payload = {"angle": 5.0}
        response = client.post("/api/v1/telemetry/diffuser-angle", json=payload)
        assert response.status_code == 422

        payload = {"angle": 30.0}
        response = client.post("/api/v1/telemetry/diffuser-angle", json=payload)
        assert response.status_code == 422

    def test_set_diffuser_angle_exception_handling(self):
        with patch("src.main.engine.set_diffuser_angle", side_effect=RuntimeError("Actuator jam")):
            payload = {"angle": 15.0}
            response = client.post("/api/v1/telemetry/diffuser-angle", json=payload)
            assert response.status_code == 400
            assert "Failed to update diffuser angle" in response.json()["detail"]

    def test_trigger_shock_event_success(self):
        payload = {"shock_type": "FLASH_VOLATILITY"}
        response = client.post("/api/v1/telemetry/shock-event", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "FLASH_VOLATILITY" in data["message"]

    def test_trigger_shock_event_validation_error(self):
        payload = {"shock_type": "UNKNOWN_SHOCK"}
        response = client.post("/api/v1/telemetry/shock-event", json=payload)
        assert response.status_code == 422

    def test_trigger_shock_event_exception_handling(self):
        with patch("src.main.engine.trigger_shock_event", side_effect=RuntimeError("Shock injection failure")):
            payload = {"shock_type": "WARP_BURST"}
            response = client.post("/api/v1/telemetry/shock-event", json=payload)
            assert response.status_code == 400
            assert "Failed to execute shock event" in response.json()["detail"]

    def test_get_routes(self):
        response = client.get("/api/v1/telemetry/routes")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 4
        venues = [r["sourceVenue"] for r in data]
        assert "CME Chicago" in venues

    def test_toggle_cryo_pump_success(self):
        response = client.post("/api/v1/telemetry/cryo-pump/toggle")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "Cryogenic cooling pump is now" in data["message"]

    def test_toggle_cryo_pump_exception_handling(self):
        with patch("src.main.engine.toggle_cryo_pump", side_effect=RuntimeError("Refrigeration compressor fault")):
            response = client.post("/api/v1/telemetry/cryo-pump/toggle")
            assert response.status_code == 400
            assert "Failed to toggle cryo pump" in response.json()["detail"]
