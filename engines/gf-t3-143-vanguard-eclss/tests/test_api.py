"""
Ghost FactoryOS — Engine GF-T3-143: Vanguard-ECLSS Life Support Engine
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
    assert data["engine"] == "GF-T3-143"


def test_v1_health_endpoint():
    response = client.get("/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["engineVersion"] == "1.0.0-PROD"
    assert "CLEAN-ROOM" in data["cleanRoomCompliance"]


def test_audit_compliance_endpoint():
    response = client.get("/audit/compliance")
    assert response.status_code == 200
    data = response.json()
    assert data["engineId"] == "GF-T3-143"
    assert data["copyleftViolations"] == 0
    assert "MIMO-MPC" in data["mathematicalProof"]


def test_telemetry_stream_endpoint():
    response = client.get("/telemetry/stream")
    assert response.status_code == 200
    data = response.json()
    assert data["nodeId"] == "VANGUARD-OUTPOST-01"
    assert data["slaBudgetMs"] == 6.5


def test_atmospheric_balance_endpoint():
    payload = {
        "nodeId": "VANGUARD-OUTPOST-01",
        "totalPressureKpa": 101.325,
        "ppO2Kpa": 21.28,
        "ppCO2Kpa": 0.36,
        "ppN2Kpa": 78.42,
        "temperatureCelsius": 21.5,
        "relativeHumidityPct": 45.2,
        "crewHeadcount": 6,
        "metabolicActivity": "NOMINAL",
    }
    response = client.post("/eclss/atmosphere/balance", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPTIMAL"
    assert "actuatorCommands" in data
    assert "projectedState1Min" in data


def test_atmospheric_balance_validation_error():
    # Missing required ppO2Kpa
    payload = {
        "nodeId": "VANGUARD-OUTPOST-01",
        "totalPressureKpa": 101.325,
        "ppCO2Kpa": 0.36,
    }
    response = client.post("/eclss/atmosphere/balance", json=payload)
    assert response.status_code == 422


def test_atmospheric_balance_exception(monkeypatch):
    def mock_solve(*args, **kwargs):
        raise RuntimeError("Solver matrix ill-conditioned")

    monkeypatch.setattr(engine, "solve_atmospheric_balance", mock_solve)
    payload = {
        "totalPressureKpa": 101.325,
        "ppO2Kpa": 21.28,
        "ppCO2Kpa": 0.36,
        "crewHeadcount": 6,
    }
    response = client.post("/eclss/atmosphere/balance", json=payload)
    assert response.status_code == 400
    assert "Atmospheric balance optimization failed" in response.json()["detail"]


def test_water_recovery_endpoint():
    payload = {
        "nodeId": "VANGUARD-OUTPOST-01",
        "greywaterInflowLph": 3.85,
        "urineDistillateInflowLph": 1.25,
        "distillateConductivityMicroSiemens": 0.08,
        "catalyticOxidizerTempC": 135.0,
    }
    response = client.post("/eclss/water/recovery", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["potableYieldLph"] > 0.0
    assert data["potableQualityStandardMet"] is True


def test_water_recovery_exception(monkeypatch):
    def mock_recover(*args, **kwargs):
        raise ValueError("Hydrologic sensor telemetry corrupt")

    monkeypatch.setattr(engine, "calculate_water_recovery", mock_recover)
    payload = {
        "greywaterInflowLph": 3.85,
        "urineDistillateInflowLph": 1.25,
    }
    response = client.post("/eclss/water/recovery", json=payload)
    assert response.status_code == 400
    assert "Water recovery calculation failed" in response.json()["detail"]


def test_fdir_triage_endpoint():
    payload = {
        "nodeId": "VANGUARD-OUTPOST-01",
        "anomalyCategory": "DECOMPRESSION",
        "deltaPressureRateKpaPerSec": -0.18,
        "currentTotalPressureKpa": 98.4,
        "acousticSensorAlertVector": ["SECTOR_ALPHA_SEAL"],
    }
    response = client.post("/eclss/fdir/triage", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["severity"] == "CRITICAL"
    assert len(data["rootCauseProbabilities"]) > 0
    assert len(data["automatedValvesEngaged"]) > 0


def test_fdir_triage_exception(monkeypatch):
    def mock_triage(*args, **kwargs):
        raise RuntimeError("FDIR inference network failure")

    monkeypatch.setattr(engine, "execute_fdir_triage", mock_triage)
    payload = {
        "anomalyCategory": "DECOMPRESSION",
    }
    response = client.post("/eclss/fdir/triage", json=payload)
    assert response.status_code == 400
    assert "FDIR triage failed" in response.json()["detail"]
