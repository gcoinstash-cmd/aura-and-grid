"""
Ghost FactoryOS — Engine GF-T3-141: VoxelTrack-Edge 3D Spatial Perception Engine
API Service Integration Tests for FastAPI Endpoints.
Conforms to OpenAPI 3.1.0 specification.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from src.main import app, engine


@pytest.fixture
def client():
    # Fresh engine state
    engine.sweeps_processed = 0
    engine.sweep_history.clear()
    engine.tracks = engine._init_default_tracks()
    with TestClient(app) as c:
        yield c


def valid_sweep_payload(**overrides):
    payload = {
        "vehicle_id": "GHOST-F1-APOLLO",
        "frame_seq": 1048576,
        "timestamp_ns": 1791384000125000,
        "raw_point_count": 98304,
        "lidar_beams": 64,
        "format": "CARTESIAN_PACKED",
    }
    payload.update(overrides)
    return payload


# ----------------------------------------------------------------- Health & Liveness
def test_healthz_endpoint(client):
    res = client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["engine"] == "GF-T3-141"
    assert data["version"] == "3.4.0"


def test_engine_health_endpoint(client):
    res = client.get("/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["engine_version"] == "3.4.0-PROD"
    assert data["loop_frequency_hz"] == 125.04
    assert data["p99_latency_ms"] >= 7.0
    assert data["clean_room_compliance"] == "100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)"


def test_audit_compliance_endpoint(client):
    res = client.get("/audit/compliance")
    assert res.status_code == 200
    data = res.json()
    assert data["engine_id"] == "GF-T3-141"
    assert data["copyleft_violations"] == 0
    assert "NIST SP 800-218" in data["audit_standard"]
    assert data["license"] == "Apache-2.0 / MIT Dual Permissive"
    assert data["monopoly_vault_status"] == "LEVEL 10 INSTITUTIONAL MONOPOLY ASSET"


# ----------------------------------------------------------------- Sweep Ingestion
def test_submit_perception_sweep_success(client):
    res = client.post("/v1/perception/sweep", json=valid_sweep_payload())
    assert res.status_code == 201
    data = res.json()
    assert "sweep_id" in data
    assert data["status"] == "PROCESSED"
    assert data["latency_ms"] > 0.0
    assert data["octree_voxel_nodes"] > 10000
    assert data["detected_tracks_count"] == 5
    assert data["critical_ttc_alert"] is True


def test_submit_perception_sweep_validation_error(client):
    # Invalid raw point count (<= 0)
    payload = valid_sweep_payload(raw_point_count=-10)
    res = client.post("/v1/perception/sweep", json=payload)
    assert res.status_code == 422


def test_submit_perception_sweep_exception_handling(client):
    with patch.object(engine, "ingest_sweep", side_effect=RuntimeError("Point cloud ring buffer overflow")):
        res = client.post("/v1/perception/sweep", json=valid_sweep_payload())
        assert res.status_code == 400
        assert "LiDAR sweep ingestion failed" in res.json()["detail"]


# ----------------------------------------------------------------- Tracks & Threats
def test_get_active_tracks_endpoint(client):
    res = client.get("/v1/perception/tracks")
    assert res.status_code == 200
    tracks = res.json()
    assert len(tracks) == 5

    track_ids = [t["track_id"] for t in tracks]
    assert "TRK-9821" in track_ids
    assert "TRK-9815" in track_ids


def test_get_threat_alerts_endpoint(client):
    res = client.get("/v1/perception/threats")
    assert res.status_code == 200
    data = res.json()
    assert data["alert_count"] >= 1
    assert data["threat_level"] == "CRITICAL_COLLISION_IMMINENT"
    assert len(data["threats"]) >= 1

    threat_trk_ids = [t["track_id"] for t in data["threats"]]
    assert "TRK-9821" in threat_trk_ids


# ----------------------------------------------------------------- OpenAPI Contract
def test_openapi_schema(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    schema = res.json()
    assert schema["openapi"].startswith("3.1")
    assert "/healthz" in schema["paths"]
    assert "/v1/perception/sweep" in schema["paths"]
    assert "/v1/perception/tracks" in schema["paths"]
    assert "/v1/perception/threats" in schema["paths"]
    assert "/v1/health" in schema["paths"]
    assert "/audit/compliance" in schema["paths"]
