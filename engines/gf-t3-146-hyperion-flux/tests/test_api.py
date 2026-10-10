"""
Ghost FactoryOS — Engine GF-T3-146: Hyperion-Flux Neuromorphic Event-Vision
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
        assert data["service"] == "gf-t3-146-hyperion-flux"

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
        assert data["engineId"] == "GF-T3-146"
        assert data["copyleftViolations"] == 0
        assert "Apache-2.0" in data["license"]

    def test_ingest_event_stream(self):
        payload = {
            "sensorId": "a8f34120-7b24-4df8-9d41-3b7c2d140e01",
            "events": [
                {"x": 120, "y": 85, "timestampUs": 1000100, "polarity": 1},
                {"x": 121, "y": 85, "timestampUs": 1000110, "polarity": -1},
                {"x": 122, "y": 86, "timestampUs": 1000120, "polarity": 1},
            ],
        }
        response = client.post("/api/v1/event/stream/ingest", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "BUFFERED_OK"
        assert data["eventsIngested"] == 3

    def test_flow_calculate(self):
        payload = {
            "sensorId": "a8f34120-7b24-4df8-9d41-3b7c2d140e01",
            "spatialRoi": {"xMin": 100, "yMin": 80, "xMax": 160, "yMax": 140},
            "temporalSliceUs": 5000,
        }
        response = client.post("/api/v1/flow/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "velocityVx" in data
        assert "velocityVy" in data
        assert "magnitudePxUs" in data
        assert "conditionNumber" in data

    def test_spiking_track(self):
        payload = {
            "sensorId": "a8f34120-7b24-4df8-9d41-3b7c2d140e01",
            "decayTimeConstantUs": 20000,
        }
        response = client.post("/api/v1/spiking/track", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "threatLevel" in data
        assert data["threatLevel"] in ["NOMINAL", "MONITORED", "CRITICAL_BRAKING_REQUIRED"]

    def test_sensor_calibrate(self):
        payload = {
            "sensorId": "a8f34120-7b24-4df8-9d41-3b7c2d140e01",
            "contrastThresholdOn": 0.19,
            "contrastThresholdOff": -0.19,
            "refractoryPeriodUs": 10.0,
            "hotPixelSuppression": True,
        }
        response = client.put("/api/v1/sensor/dvs/calibrate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "hardwareRegisterCrc" in data

    def test_telemetry_p99_audit(self):
        response = client.get("/api/v1/telemetry/p99-audit")
        assert response.status_code == 200
        data = response.json()
        assert "COMPLIANT" in data["status"]
        assert data["p99LatencyUs"] <= 750.0

    def test_validation_error_422(self):
        payload = {
            "sensorId": "a8f34120-7b24-4df8-9d41-3b7c2d140e01",
            "events": [
                {"x": -5, "y": 85, "timestampUs": 1000100, "polarity": 1},  # Invalid x < 0
            ],
        }
        response = client.post("/api/v1/event/stream/ingest", json=payload)
        assert response.status_code == 422
