"""
Ghost FactoryOS — Engine GF-T3-140: Chronos-Tick Algorithmic Execution Core
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
    engine.mandates.clear()
    engine.sequence_counter = 0
    engine.total_processed_slices = 0
    with TestClient(app) as c:
        yield c


def valid_mandate_payload(**overrides):
    payload = {
        "symbol": "BTC-USD",
        "side": "BUY",
        "total_notional_usd": 10000000.0,
        "duration_minutes": 60,
        "strategy": "ALMGREN_CHRISS",
        "risk_aversion_lambda": 0.000001,
        "target_slippage_bps_cap": 3.0,
    }
    payload.update(overrides)
    return payload


# ----------------------------------------------------------------- Health & Liveness
def test_healthz_endpoint(client):
    res = client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["engine"] == "GF-T3-140"
    assert data["version"] == "1.4.1"


def test_engine_health_endpoint(client):
    res = client.get("/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["engine_id"] == "GF-T3-140"
    assert data["status"] == "ONLINE"
    assert data["active_mandates"] == 0
    assert data["processed_slices"] == 0
    assert data["clock_drift_ms"] < 1.0
    assert "loop_latency_p99_ms" in data
    assert data["clean_room_compliance"] == "100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)"


def test_audit_compliance_endpoint(client):
    res = client.get("/audit/compliance")
    assert res.status_code == 200
    data = res.json()
    assert data["engine_id"] == "GF-T3-140"
    assert data["copyleft_violations"] == 0
    assert "NIST SP 800-218" in data["audit_standard"]
    assert data["license"] == "Apache-2.0 / MIT Dual Permissive"
    assert data["monopoly_vault_status"] == "LEVEL 10 INSTITUTIONAL MONOPOLY ASSET"


# ----------------------------------------------------------------- Mandate Ingestion & Lifecycle
def test_create_mandate_success(client):
    res = client.post("/v1/algo/mandates", json=valid_mandate_payload())
    assert res.status_code == 201
    data = res.json()
    assert "mandate_id" in data
    assert data["status"] == "ACTIVE"
    assert data["total_slices"] == 100
    assert data["arrival_price"] == 64250.0
    assert data["estimated_slippage_bps"] > 0.0


def test_create_mandate_validation_failure(client):
    # Negative notional
    payload = valid_mandate_payload(total_notional_usd=-500)
    res = client.post("/v1/algo/mandates", json=payload)
    assert res.status_code == 422


def test_create_mandate_exception_handling(client):
    with patch.object(engine, "create_mandate", side_effect=RuntimeError("AlloyDB connection refused")):
        res = client.post("/v1/algo/mandates", json=valid_mandate_payload())
        assert res.status_code == 400
        assert "Mandate initialization failed" in res.json()["detail"]


def test_get_mandate_by_id_and_performance(client):
    create_res = client.post("/v1/algo/mandates", json=valid_mandate_payload())
    mandate_id = create_res.json()["mandate_id"]

    # Get mandate details
    get_res = client.get(f"/v1/algo/mandates/{mandate_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["mandate_id"] == mandate_id
    assert data["symbol"] == "BTC-USD"
    assert data["slices_count"] == 100

    # Get performance endpoint
    perf_res = client.get(f"/v1/algo/mandates/{mandate_id}/performance")
    assert perf_res.status_code == 200
    perf_data = perf_res.json()
    assert perf_data["mandate_id"] == mandate_id
    assert perf_data["benchmark_compliance"] is True
    assert len(perf_data["slices"]) == 100


def test_get_mandate_not_found(client):
    res = client.get("/v1/algo/mandates/NON_EXISTENT")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"]

    perf_res = client.get("/v1/algo/mandates/NON_EXISTENT/performance")
    assert perf_res.status_code == 404
    assert "not found" in perf_res.json()["detail"]


def test_cancel_mandate_lifecycle(client):
    create_res = client.post("/v1/algo/mandates", json=valid_mandate_payload())
    mandate_id = create_res.json()["mandate_id"]

    # Cancel mandate
    del_res = client.delete(f"/v1/algo/mandates/{mandate_id}")
    assert del_res.status_code == 200
    data = del_res.json()
    assert data["status"] == "ABORTED"
    assert data["mandate_id"] == mandate_id

    # Verify updated status
    get_res = client.get(f"/v1/algo/mandates/{mandate_id}")
    assert get_res.json()["status"] == "ABORTED"


def test_cancel_mandate_not_found(client):
    del_res = client.delete("/v1/algo/mandates/NON_EXISTENT")
    assert del_res.status_code == 404
    assert "not found" in del_res.json()["detail"]


# ----------------------------------------------------------------- OpenAPI Contract
def test_openapi_schema(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    schema = res.json()
    assert schema["openapi"].startswith("3.1")
    assert "/healthz" in schema["paths"]
    assert "/v1/algo/mandates" in schema["paths"]
    assert "/v1/algo/mandates/{mandate_id}" in schema["paths"]
    assert "/v1/algo/mandates/{mandate_id}/performance" in schema["paths"]
    assert "/v1/health" in schema["paths"]
    assert "/audit/compliance" in schema["paths"]
