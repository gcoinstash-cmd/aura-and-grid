"""
Ghost FactoryOS — Engine GF-T3-139: AeroDyn-RT
API Service Integration Tests for FastAPI Endpoints.
Conforms to OpenAPI 3.1.0 specification.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from src.main import app, engine


@pytest.fixture
def client():
    # Fresh engine state for clean test isolation
    engine.ring_buffer.clear()
    engine.sequence_counter = 0
    engine.current_wing_deg = 32.0
    engine.stall_interlock_active = False
    with TestClient(app) as c:
        yield c


def valid_frame_payload(**overrides):
    payload = {
        "chassis_id": "CHASSIS-W15-01",
        "timestamp_ns": 1_000_000_000,
        "speed_mph": 175.5,
        "ride_height_mm": {
            "fl": 22.4,
            "fr": 22.8,
            "rl": 31.0,
            "rr": 31.2,
        },
        "imu": {
            "pitch_deg": -0.45,
            "roll_deg": 0.12,
            "yaw_rate_dps": 0.05,
            "lat_g": 0.85,
            "long_g": -1.15,
        },
    }
    payload.update(overrides)
    return payload


# ----------------------------------------------------------------- Health & Liveness
def test_healthz_endpoint(client):
    res = client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["engine"] == "GF-T3-139"
    assert data["version"] == "3.1.0"


def test_engine_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["engine_id"] == "GF-T3-139"
    assert data["status"] == "ONLINE"
    assert data["ring_buffer_capacity"] == 10000
    assert data["frames_ingested"] == 0
    assert "loop_latency_p99_us" in data
    assert data["clean_room_compliance"] == "100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)"


def test_audit_compliance_endpoint(client):
    res = client.get("/audit/compliance")
    assert res.status_code == 200
    data = res.json()
    assert data["engine_id"] == "GF-T3-139"
    assert data["copyleft_violations"] == 0
    assert "NIST SP 800-218" in data["audit_standard"]
    assert data["license"] == "Apache-2.0 / MIT Dual Permissive"
    assert data["monopoly_vault_status"] == "LEVEL 10 INSTITUTIONAL MONOPOLY ASSET"


# ----------------------------------------------------------------- Telemetry Ingestion
def test_submit_telemetry_frame_success(client):
    res = client.post("/telemetry/frame", json=valid_frame_payload())
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "INGESTED_RING_BUFFER"
    assert data["frame_seq_id"] == 1
    assert data["latency_us"] >= 0
    assert data["ekf_residual_norm"] >= 0.0


def test_submit_telemetry_frame_validation_error(client):
    # Invalid ride height (> 150mm max constraint)
    payload = valid_frame_payload()
    payload["ride_height_mm"]["fl"] = 999.0
    res = client.post("/telemetry/frame", json=payload)
    assert res.status_code == 422


def test_submit_telemetry_frame_exception_handling(client):
    with patch.object(engine, "ingest_frame", side_effect=RuntimeError("Sensor bus timeout")):
        res = client.post("/telemetry/frame", json=valid_frame_payload())
        assert res.status_code == 400
        assert "Telemetry frame ingestion failed" in res.json()["detail"]


# ----------------------------------------------------------------- Aerodynamic State
def test_get_aero_state_default(client):
    res = client.get("/aero/state")
    assert res.status_code == 200
    data = res.json()
    assert "cop_front_pct" in data
    assert "cop_rear_pct" in data
    assert data["downforce_total_kgf"] > 0.0
    assert data["drag_kgf"] > 0.0
    assert 0.0 <= data["stall_risk"] <= 1.0


def test_get_aero_state_with_custom_speed(client):
    res_slow = client.get("/aero/state", params={"speed_mph": 60.0})
    res_fast = client.get("/aero/state", params={"speed_mph": 220.0})
    assert res_slow.status_code == 200
    assert res_fast.status_code == 200
    
    fast_data = res_fast.json()
    slow_data = res_slow.json()
    assert fast_data["downforce_total_kgf"] > slow_data["downforce_total_kgf"] * 5


# ----------------------------------------------------------------- DRS & Active Aero
def test_command_drs_flap_normal(client):
    cmd = {"requested_angle_deg": 12.0, "reason": "OVERTAKE_DRS_ACTIVE"}
    res = client.post("/aero/drs", json=cmd)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DISPATCHED_CAN_ACTUATOR"
    assert data["commanded_angle_deg"] == 12.0
    assert data["effective_angle_deg"] == 12.0
    assert data["slew_rate_dps"] == 233.0


def test_command_drs_flap_stall_interlock_active(client):
    engine.stall_interlock_active = True
    cmd = {"requested_angle_deg": 35.0, "reason": "HIGH_DOWNFORCE_REQUEST"}
    res = client.post("/aero/drs", json=cmd)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "CLAMPED_STALL_INTERLOCK"
    assert data["effective_angle_deg"] == 20.0


def test_command_drs_flap_out_of_bounds(client):
    cmd = {"requested_angle_deg": 55.0, "reason": "EXCEED_LIMIT"}
    res = client.post("/aero/drs", json=cmd)
    assert res.status_code == 422


# ----------------------------------------------------------------- OpenAPI Contract
def test_openapi_schema(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    schema = res.json()
    assert schema["openapi"].startswith("3.1")
    assert "/telemetry/frame" in schema["paths"]
    assert "/aero/state" in schema["paths"]
    assert "/aero/drs" in schema["paths"]
    assert "/health" in schema["paths"]
    assert "/audit/compliance" in schema["paths"]
    assert "/healthz" in schema["paths"]
