"""
Ghost FactoryOS — Engine GF-T3-147: Sol-Rotor Autonomous Heavy-Lift eVTOL
FastAPI Endpoint Integration Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
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
        assert data["service"] == "gf-t3-147-sol-rotor"

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
        assert data["engineId"] == "GF-T3-147"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]

    def test_flight_state_update(self):
        payload = {
            "airframe_id": "GF-T3-147",
            "timestamp_ns": 1791244800000000000,
            "imu_accel": {"x": 0.1, "y": -0.2, "z": -9.81},
            "imu_gyro": {"x": 0.01, "y": 0.02, "z": 0.03},
            "gps_pos": {"x": 10.0, "y": 20.0, "z": -500.0},
            "baro_alt_m": 500.0,
            "radar_alt_agl_m": 498.0,
            "nacelle_angle_deg": 60.0,
        }
        response = client.post("/flight/state/update", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "STATE_ESTIMATED"
        assert "quaternion" in data
        assert "euler_deg" in data
        assert "airspeed_kts" in data
        assert "vsi_mps" in data

    def test_control_attitude_compute(self):
        payload = {
            "airframe_id": "GF-T3-147",
            "nacelle_target_deg": 45.0,
        }
        response = client.post("/control/attitude/compute", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["ndi_budget_ok"] is True
        assert len(data["rotors_rpm"]) == 8
        assert data["total_thrust_kn"] > 0

    def test_swarm_consensus_sync(self):
        payload = {
            "swarm_id": "SWARM-GF-ALPHA-770",
            "formation_pattern": "TACTICAL_DIAMOND",
            "target_spacing_m": 45.0,
        }
        response = client.post("/swarm/consensus/sync", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["algebraic_connectivity_lambda2"] > 0
        assert data["formation_rms_error_m"] > 0

    def test_actuators_reallocate(self):
        payload = {
            "airframe_id": "GF-T3-147",
            "failed_rotor_id": 4,
        }
        response = client.post("/actuators/reallocate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["reallocation_success"] is True
        assert data["active_rotors_count"] == 7
        assert data["safe_flight_envelope_maintained"] is True

    def test_validation_error_422(self):
        # Invalid rotor id = 9 (> 8)
        payload = {
            "airframe_id": "GF-T3-147",
            "failed_rotor_id": 9,
        }
        response = client.post("/actuators/reallocate", json=payload)
        assert response.status_code == 422
