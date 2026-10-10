"""
Ghost FactoryOS — Engine GF-T3-144: Lattice-Mesh Post-Quantum KEM Engine
Integration Tests for FastAPI Service Layer & Error Handling.
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
    assert data["engine"] == "GF-T3-144"


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
    assert data["engineId"] == "GF-T3-144"
    assert data["copyleftViolations"] == 0
    assert "ML-KEM-1024" in data["mathematicalProof"]


def test_encapsulate_endpoint():
    payload = {
        "initiator_node_id": "node-edge-001",
        "target_node_id": "node-edge-002",
        "peer_public_key_t_hex": "4a90c128" * 8,
        "seed_a_hex": "3a8f9b7c210d",
    }
    response = client.post("/pqc/kem/encapsulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "ciphertext_u_hex" in data
    assert "ciphertext_v_hex" in data
    assert len(data["shared_secret_hash_sha256"]) == 64


def test_encapsulate_validation_error():
    payload = {
        "initiator_node_id": "node-edge-001",
        # Missing target_node_id
    }
    response = client.post("/pqc/kem/encapsulate", json=payload)
    assert response.status_code == 422


def test_encapsulate_exception(monkeypatch):
    def mock_encapsulate(*args, **kwargs):
        raise RuntimeError("Entropy exhaustion error")

    monkeypatch.setattr(engine, "encapsulate", mock_encapsulate)
    payload = {
        "initiator_node_id": "node-edge-001",
        "target_node_id": "node-edge-002",
        "peer_public_key_t_hex": "4a90c128" * 8,
        "seed_a_hex": "3a8f9b7c210d",
    }
    response = client.post("/pqc/kem/encapsulate", json=payload)
    assert response.status_code == 400
    assert "KEM encapsulation failed" in response.json()["detail"]


def test_decapsulate_endpoint():
    payload = {
        "node_id": "node-edge-002",
        "hsm_secret_handle": "hsm-slot-04-key-pqc",
        "ciphertext_u_hex": "01020304" * 8,
        "ciphertext_v_hex": "05060708" * 8,
    }
    response = client.post("/pqc/kem/decapsulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert len(data["shared_secret_hex"]) == 64


def test_decapsulate_exception(monkeypatch):
    def mock_decapsulate(*args, **kwargs):
        raise ValueError("HSM token locked")

    monkeypatch.setattr(engine, "decapsulate", mock_decapsulate)
    payload = {
        "node_id": "node-edge-002",
        "hsm_secret_handle": "hsm-slot-04-key-pqc",
        "ciphertext_u_hex": "01020304" * 8,
        "ciphertext_v_hex": "05060708" * 8,
    }
    response = client.post("/pqc/kem/decapsulate", json=payload)
    assert response.status_code == 400
    assert "KEM decapsulation failed" in response.json()["detail"]


def test_ratchet_endpoint():
    payload = {
        "node_id": "node-edge-001",
        "peer_node_id": "node-edge-002",
        "current_epoch_counter": 55,
    }
    response = client.post("/pqc/mesh/ratchet", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["new_epoch_sequence"] == 56
    assert data["rollover_status"] == "SYNCHRONIZED_ZERO_LOSS"


def test_ratchet_exception(monkeypatch):
    def mock_ratchet(*args, **kwargs):
        raise RuntimeError("WireGuard kernel netlink failure")

    monkeypatch.setattr(engine, "advance_ratchet", mock_ratchet)
    payload = {
        "node_id": "node-edge-001",
        "peer_node_id": "node-edge-002",
        "current_epoch_counter": 55,
    }
    response = client.post("/pqc/mesh/ratchet", json=payload)
    assert response.status_code == 400
    assert "Ratchet epoch advance failed" in response.json()["detail"]


def test_mesh_nodes_endpoint():
    response = client.get("/pqc/mesh/nodes?limit=12")
    assert response.status_code == 200
    data = response.json()
    assert data["total_nodes"] == 24
    assert len(data["nodes"]) == 12


def test_fleet_telemetry_endpoint():
    response = client.get("/pqc/mesh/telemetry")
    assert response.status_code == 200
    data = response.json()
    assert data["p99_latency_ms"] == 2.85
    assert data["qta_matrix"]["shor_resistance_nist_level"] == 5
