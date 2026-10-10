"""
Ghost FactoryOS — Engine GF-T3-142: Aegis-Orbit Mission Control Engine
Integration Tests for FastAPI Service Endpoints & Error Handling.
License: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app, engine

client = TestClient(app)


def test_healthz_endpoint():
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["engine"] == "GF-T3-142"


def test_v1_health_endpoint():
    response = client.get("/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["engine_version"] == "1.0.0-PROD"
    assert data["clean_room_compliance"] == "100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)"


def test_audit_compliance_endpoint():
    response = client.get("/audit/compliance")
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "GF-T3-142"
    assert data["copyleft_violations"] == 0
    assert "Foster-1992" in data["mathematical_proof"]


def test_telemetry_stream_endpoint():
    response = client.get("/telemetry/stream")
    assert response.status_code == 200
    data = response.json()
    assert data["active_satellites_count"] == 12
    assert data["sla_budget_ms"] == 8.2


def test_orbit_propagate_endpoint():
    payload = {
        "satellite_id": "SAT-AEGIS-01",
        "initial_state": {
            "r_eci_km": [6878.137, 0.0, 0.0],
            "v_eci_km_s": [0.0, 7.612, 0.0],
            "epoch_utc": "2026-10-07T12:00:00Z",
        },
        "step_duration_seconds": 60.0,
        "mass_kg": 260.0,
        "cross_sectional_area_m2": 1.8,
    }
    response = client.post("/orbit/propagate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "final_state" in data
    assert "keplerian_elements" in data
    assert data["computation_time_ms"] >= 0.0


def test_orbit_propagate_validation_error():
    # Missing required initial_state
    response = client.post("/orbit/propagate", json={"step_duration_seconds": 10.0})
    assert response.status_code == 422


def test_orbit_propagate_exception(monkeypatch):
    def mock_propagate(*args, **kwargs):
        raise RuntimeError("Integrator numerical divergence")

    monkeypatch.setattr(engine, "propagate", mock_propagate)
    payload = {
        "initial_state": {
            "r_eci_km": [6878.137, 0.0, 0.0],
            "v_eci_km_s": [0.0, 7.612, 0.0],
            "epoch_utc": "2026-10-07T12:00:00Z",
        },
        "step_duration_seconds": 60.0,
    }
    response = client.post("/orbit/propagate", json=payload)
    assert response.status_code == 400
    assert "Orbit propagation failed" in response.json()["detail"]


def test_conjunction_evaluate_endpoint():
    payload = {
        "primary_norad_id": 54201,
        "secondary_norad_id": 98402,
        "miss_distance_ric_meters": [12.0, 18.0, 8.0],
        "primary_covariance_3sigma_m": [12.0, 45.0, 18.0],
        "secondary_covariance_3sigma_m": [35.0, 110.0, 42.0],
        "combined_hard_body_radius_m": 8.5,
        "tca_epoch_utc": "2026-10-07T14:30:00Z",
    }
    response = client.post("/conjunction/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "probability_of_collision_pc" in data
    assert "severity" in data
    assert "mahalanobis_distance" in data


def test_conjunction_evaluate_exception(monkeypatch):
    def mock_eval(*args, **kwargs):
        raise ValueError("Singular covariance matrix")

    monkeypatch.setattr(engine, "evaluate_conjunction", mock_eval)
    payload = {
        "miss_distance_ric_meters": [12.0, 18.0, 8.0],
        "tca_epoch_utc": "2026-10-07T14:30:00Z",
    }
    response = client.post("/conjunction/evaluate", json=payload)
    assert response.status_code == 400
    assert "Conjunction evaluation failed" in response.json()["detail"]


def test_maneuver_optimize_endpoint():
    payload = {
        "satellite_id": "SAT-AEGIS-01",
        "semi_major_axis_km": 6928.137,
        "time_to_tca_seconds": 7200.0,
        "target_miss_distance_m": 1000.0,
        "current_miss_ric_m": [50.0, 150.0, 20.0],
        "thruster_isp_seconds": 1800.0,
    }
    response = client.post("/maneuver/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "delta_v_ric_mps" in data
    assert data["magnitude_mps"] > 0.0
    assert data["propellant_kg"] > 0.0
    assert data["burn_duration_seconds"] > 0.0


def test_maneuver_optimize_exception(monkeypatch):
    def mock_optimize(*args, **kwargs):
        raise RuntimeError("Propulsion subsystem offline")

    monkeypatch.setattr(engine, "optimize_maneuver", mock_optimize)
    payload = {
        "current_miss_ric_m": [50.0, 150.0, 20.0],
    }
    response = client.post("/maneuver/optimize", json=payload)
    assert response.status_code == 400
    assert "Maneuver optimization failed" in response.json()["detail"]
