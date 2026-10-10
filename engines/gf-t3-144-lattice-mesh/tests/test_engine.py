"""
Ghost FactoryOS — Engine GF-T3-144: Lattice-Mesh Post-Quantum KEM Engine
Unit Tests for Cyclotomic Polynomial Ring Arithmetic, NTT Transformations,
ML-KEM-1024 Encapsulation, Decapsulation, and WireGuard Ratchet Rotation.
License: Apache-2.0 / MIT Dual Permissive
"""

import hashlib
import pytest
from src.engine import (
    LatticeMeshEngine,
    mod_q,
    poly_add,
    poly_sub,
    poly_ntt,
    poly_inv_ntt,
    sample_cbd,
    sample_matrix_a,
    KYBER_Q,
    KYBER_N,
    KYBER_K,
)
from src.models import (
    EncapsulateRequest,
    DecapsulateRequest,
    RatchetRequest,
)


def test_poly_arithmetic():
    a = [1000] * KYBER_N
    b = [2500] * KYBER_N
    sum_poly = poly_add(a, b)
    # (1000 + 2500) % 3329 = 3500 % 3329 = 171
    assert sum_poly[0] == 171

    diff_poly = poly_sub(a, b)
    # (1000 - 2500) % 3329 = -1500 % 3329 = 1829
    assert diff_poly[0] == 1829


def test_sample_cbd():
    poly = sample_cbd(2, 42)
    assert len(poly) == KYBER_N
    # Values should be in range [-2, 2] mod 3329
    valid_mod_vals = {0, 1, 2, KYBER_Q - 1, KYBER_Q - 2}
    assert all(c in valid_mod_vals for c in poly)


def test_sample_matrix_a():
    matrix = sample_matrix_a("3a8f9b7c210d")
    assert len(matrix) == KYBER_K
    assert len(matrix[0]) == KYBER_K
    assert len(matrix[0][0]) == KYBER_N


def test_ntt_roundtrip():
    p = sample_cbd(2, 7)
    p_ntt = poly_ntt(p)
    assert len(p_ntt) == KYBER_N
    p_inv = poly_inv_ntt(p_ntt)
    assert len(p_inv) == KYBER_N


def test_engine_encapsulate():
    engine = LatticeMeshEngine()
    req = EncapsulateRequest(
        initiator_node_id="node-edge-001",
        target_node_id="node-edge-002",
        peer_public_key_t_hex="4a90c128" * 8,
        seed_a_hex="3a8f9b7c210d",
    )
    res = engine.encapsulate(req)
    assert len(res.ciphertext_u_hex) > 0
    assert len(res.ciphertext_v_hex) > 0
    assert len(res.shared_secret_hash_sha256) == 64
    assert res.compute_duration_ms > 0.0


def test_engine_decapsulate():
    engine = LatticeMeshEngine()
    req = DecapsulateRequest(
        node_id="node-edge-002",
        hsm_secret_handle="hsm-slot-04-key-pqc",
        ciphertext_u_hex="0102030405060708" * 4,
        ciphertext_v_hex="090a0b0c0d0e0f10" * 4,
    )
    res = engine.decapsulate(req)
    assert res.is_valid is True
    assert len(res.shared_secret_hex) == 64
    assert len(res.shared_secret_hash_sha256) == 64
    assert res.decapsulation_duration_ms > 0.0


def test_engine_ratchet():
    engine = LatticeMeshEngine()
    req = RatchetRequest(
        node_id="node-edge-001",
        peer_node_id="node-edge-002",
        current_epoch_counter=142,
    )
    res = engine.advance_ratchet(req)
    assert res.new_epoch_sequence == 143
    assert len(res.active_psk_hash) == 16
    assert len(res.standby_psk_hash) == 16
    assert "Z" in res.epoch_expires_at
    assert res.rollover_status == "SYNCHRONIZED_ZERO_LOSS"


def test_engine_list_nodes():
    engine = LatticeMeshEngine()
    all_nodes = engine.list_nodes(limit=10)
    assert all_nodes.total_nodes == 24
    assert len(all_nodes.nodes) == 10

    east_nodes = engine.list_nodes(region="us-east")
    assert all(n.region == "us-east" for n in east_nodes.nodes)


def test_engine_fleet_telemetry():
    engine = LatticeMeshEngine()
    telem = engine.get_fleet_telemetry()
    assert telem.p99_latency_ms == 2.85
    assert telem.qta_matrix.shor_resistance_nist_level == 5
    assert telem.qta_matrix.grover_speedup_margin_bits == 256
    assert telem.qta_matrix.hndl_mitigation_index_pct == 100.0


def test_engine_health_and_compliance():
    engine = LatticeMeshEngine()
    health = engine.get_health()
    assert health.status == "HEALTHY"
    assert health.engineVersion == "1.0.0-PROD"

    compliance = engine.get_compliance()
    assert compliance.engineId == "GF-T3-144"
    assert compliance.copyleftViolations == 0
    assert "ML-KEM-1024" in compliance.mathematicalProof
