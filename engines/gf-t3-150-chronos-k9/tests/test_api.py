"""
Ghost FactoryOS — Engine GF-T3-150: Chronos Kinetic-9 MagLev Telemetry Rig
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
        assert data["service"] == "gf-t3-150-chronos-k9"
        assert data["version"] == "1.0.0-PROD"

    def test_v1_health(self):
        response = client.get("/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "HEALTHY"
        assert data["engine_id"] == "GF-T3-150"
        assert data["system_code"] == "T3-TELEMETRY-05"
        assert "CLEAN-ROOM" in data["cleanRoomCompliance"]

    def test_audit_compliance(self):
        response = client.get("/audit/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["engineId"] == "GF-T3-150"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]
        assert "Maxwell" in data["mathematicalProof"]

    def test_get_telemetry_state(self):
        response = client.get("/api/v1/telemetry/state")
        assert response.status_code == 200
        data = response.json()
        assert data["velocityKmh"] > 0
        assert len(data["bogies"]) == 4
        assert data["cryo"]["superconductingState"] is True
        assert len(data["sectors"]) == 8

    def test_set_run_mode_success(self):
        payload = {"run_mode": "MAX_FLUX_SPRINT"}
        response = client.post("/api/v1/telemetry/run-mode", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "MAX_FLUX_SPRINT" in data["message"]
        assert data["telemetry"]["runMode"] == "MAX_FLUX_SPRINT"

    def test_set_run_mode_validation_error(self):
        payload = {"run_mode": "INVALID_RUN_MODE"}
        response = client.post("/api/v1/telemetry/run-mode", json=payload)
        assert response.status_code == 422

    def test_set_run_mode_exception_handling(self):
        with patch("src.main.engine.set_run_mode", side_effect=RuntimeError("Mode actuator failed")):
            payload = {"run_mode": "STATIONARY_LEVITATION"}
            response = client.post("/api/v1/telemetry/run-mode", json=payload)
            assert response.status_code == 400
            assert "Failed to set run mode" in response.json()["detail"]

    def test_set_flux_bias_success(self):
        payload = {"bias_pct": 5.0}
        response = client.post("/api/v1/telemetry/bogie/flux-bias", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "5.0%" in data["message"]
        assert data["telemetry"]["fluxBias"] == 5.0

    def test_set_flux_bias_validation_error(self):
        # bias < -15 or > 15
        payload = {"bias_pct": -20.0}
        response = client.post("/api/v1/telemetry/bogie/flux-bias", json=payload)
        assert response.status_code == 422

        payload = {"bias_pct": 25.0}
        response = client.post("/api/v1/telemetry/bogie/flux-bias", json=payload)
        assert response.status_code == 422

    def test_set_flux_bias_exception_handling(self):
        with patch("src.main.engine.set_flux_bias", side_effect=RuntimeError("Flux coil fault")):
            payload = {"bias_pct": 3.0}
            response = client.post("/api/v1/telemetry/bogie/flux-bias", json=payload)
            assert response.status_code == 400
            assert "Failed to update flux bias" in response.json()["detail"]

    def test_set_suspension_stiffness_success(self):
        payload = {"stiffness_n_mm": 240.0}
        response = client.post("/api/v1/telemetry/suspension/stiffness", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "240.0" in data["message"]
        assert data["telemetry"]["suspensionStiffness"] == 240.0

    def test_set_suspension_stiffness_validation_error(self):
        # stiffness < 120 or > 320
        payload = {"stiffness_n_mm": 50.0}
        response = client.post("/api/v1/telemetry/suspension/stiffness", json=payload)
        assert response.status_code == 422

        payload = {"stiffness_n_mm": 400.0}
        response = client.post("/api/v1/telemetry/suspension/stiffness", json=payload)
        assert response.status_code == 422

    def test_set_suspension_stiffness_exception_handling(self):
        with patch("src.main.engine.set_suspension_stiffness", side_effect=RuntimeError("Suspension valve error")):
            payload = {"stiffness_n_mm": 200.0}
            response = client.post("/api/v1/telemetry/suspension/stiffness", json=payload)
            assert response.status_code == 400
            assert "Failed to calibrate suspension stiffness" in response.json()["detail"]

    def test_toggle_linear_braking_success(self):
        response = client.post("/api/v1/telemetry/brake/linear")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "Linear eddy-current braking" in data["message"]

    def test_toggle_linear_braking_exception_handling(self):
        with patch("src.main.engine.toggle_linear_braking", side_effect=RuntimeError("Brake actuator fault")):
            response = client.post("/api/v1/telemetry/brake/linear")
            assert response.status_code == 400
            assert "Failed to toggle linear braking" in response.json()["detail"]

    def test_trigger_emergency_scram_success(self):
        response = client.post("/api/v1/telemetry/emergency/scram")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "EMERGENCY MAGNETIC SCRAM" in data["message"]
        assert data["telemetry"]["emergencyScram"] is True

    def test_trigger_emergency_scram_exception_handling(self):
        with patch("src.main.engine.trigger_emergency_scram", side_effect=RuntimeError("SCRAM relay failure")):
            response = client.post("/api/v1/telemetry/emergency/scram")
            assert response.status_code == 400
            assert "Failed to trigger SCRAM" in response.json()["detail"]

    def test_trigger_cryo_purge_success(self):
        response = client.post("/api/v1/telemetry/cryo/purge")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "SUCCESS"
        assert "Cryogenic loop purge" in data["message"]

    def test_trigger_cryo_purge_exception_handling(self):
        with patch("src.main.engine.trigger_cryo_purge", side_effect=RuntimeError("Purge solenoid stuck")):
            response = client.post("/api/v1/telemetry/cryo/purge")
            assert response.status_code == 400
            assert "Failed to initiate cryo purge" in response.json()["detail"]
