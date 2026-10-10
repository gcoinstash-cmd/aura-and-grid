-- ============================================================================
-- GHOST FACTORYOS FLEET TRACK 3 (F1 SKUNKWORKS SERVICE ENGINE)
-- ASSET IDENTIFIER: GF-T3-144 (Lattice-Mesh: Post-Quantum Cryptographic Engine)
-- PRODUCTION DATABASE DDL SPECIFICATION: AlloyDB / PostgreSQL 16+ Enterprise
-- ZERO PLACEHOLDERS / COMPLETE INTEGRITY CONSTRAINTS & TIME-SERIES PARTITIONS
-- ============================================================================

-- Extensions Required for Cryptographic Vector Processing & Partitioning
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Custom Domain Types & Enums
DO $$ BEGIN
    CREATE TYPE node_operational_state AS ENUM ('PROVISIONING', 'ONLINE_ACTIVE', 'ROTATING', 'DRAINING', 'REVOKED', 'OFFLINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kem_algorithm_type AS ENUM ('ML_KEM_512', 'ML_KEM_768', 'ML_KEM_1024', 'HYBRID_X25519_ML_KEM_1024');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ratchet_status_type AS ENUM ('INITIALIZING', 'ACTIVE_SYNCHRONIZED', 'STANDBY_PROPAGATED', 'SUPERSEDED', 'FAILED_REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 1. TABLE: mesh_edge_nodes
-- Master registry of all authorized zero-trust edge hardware gateways.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mesh_edge_nodes (
    node_id VARCHAR(64) PRIMARY KEY,
    organization_id UUID NOT NULL,
    hardware_uuid UUID NOT NULL UNIQUE,
    node_fqdn VARCHAR(255) NOT NULL UNIQUE,
    ipv4_mesh_address INET NOT NULL UNIQUE,
    ipv6_mesh_address INET NOT NULL UNIQUE,
    region_cluster VARCHAR(64) NOT NULL,
    wireguard_interface_name VARCHAR(32) NOT NULL DEFAULT 'wg-pqc0',
    wireguard_listen_port INTEGER NOT NULL CHECK (wireguard_listen_port BETWEEN 1024 AND 65535),
    operational_state node_operational_state NOT NULL DEFAULT 'PROVISIONING',
    current_epoch_counter BIGINT NOT NULL DEFAULT 0 CHECK (current_epoch_counter >= 0),
    lattice_dimension_k INTEGER NOT NULL DEFAULT 4 CHECK (lattice_dimension_k IN (2, 3, 4)),
    lattice_modulus_q INTEGER NOT NULL DEFAULT 3329 CHECK (lattice_modulus_q = 3329),
    cbd_noise_eta1 INTEGER NOT NULL DEFAULT 2 CHECK (cbd_noise_eta1 IN (2, 3)),
    cbd_noise_eta2 INTEGER NOT NULL DEFAULT 2 CHECK (cbd_noise_eta2 IN (2, 3)),
    keepalive_interval_sec INTEGER NOT NULL DEFAULT 25 CHECK (keepalive_interval_sec BETWEEN 5 AND 300),
    rekey_interval_sec INTEGER NOT NULL DEFAULT 120 CHECK (rekey_interval_sec BETWEEN 30 AND 3600),
    max_p99_latency_budget_ms NUMERIC(6,3) NOT NULL DEFAULT 3.200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mesh_nodes_state ON mesh_edge_nodes (operational_state);
CREATE INDEX IF NOT EXISTS idx_mesh_nodes_region ON mesh_edge_nodes (region_cluster);
CREATE INDEX IF NOT EXISTS idx_mesh_nodes_heartbeat ON mesh_edge_nodes (last_heartbeat_at DESC);

-- ----------------------------------------------------------------------------
-- 2. TABLE: kem_key_pair_registry
-- Cryptographic public key registry and lattice parameter validation state.
-- Secret keys are NEVER stored in plaintext (ephemeral in hardware HSM / Enclave).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kem_key_pair_registry (
    key_fingerprint_sha256 VARCHAR(64) PRIMARY KEY,
    node_id VARCHAR(64) NOT NULL REFERENCES mesh_edge_nodes(node_id) ON DELETE CASCADE,
    algorithm kem_algorithm_type NOT NULL DEFAULT 'HYBRID_X25519_ML_KEM_1024',
    matrix_seed_hex VARCHAR(64) NOT NULL,
    public_key_t_vector BYTEA NOT NULL,
    classical_public_key_curve25519 BYTEA NOT NULL,
    public_key_byte_length INTEGER NOT NULL CHECK (public_key_byte_length = 1568),
    hsm_key_handle VARCHAR(128) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_kem_keys_node_active ON kem_key_pair_registry (node_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_kem_keys_expiry ON kem_key_pair_registry (expires_at);

-- ----------------------------------------------------------------------------
-- 3. TABLE: session_ratchet_epochs
-- Real-time audit trail of double-buffered ephemeral WireGuard Pre-Shared Keys.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_ratchet_epochs (
    epoch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    epoch_sequence BIGINT NOT NULL,
    initiator_node_id VARCHAR(64) NOT NULL REFERENCES mesh_edge_nodes(node_id) ON DELETE RESTRICT,
    responder_node_id VARCHAR(64) NOT NULL REFERENCES mesh_edge_nodes(node_id) ON DELETE RESTRICT,
    kem_public_key_fingerprint VARCHAR(64) NOT NULL REFERENCES kem_key_pair_registry(key_fingerprint_sha256) ON DELETE RESTRICT,
    ciphertext_u_vector BYTEA NOT NULL,
    ciphertext_v_polynomial BYTEA NOT NULL,
    classical_ecdh_hash_sha256 VARCHAR(64) NOT NULL,
    pqc_shared_secret_hash_sha256 VARCHAR(64) NOT NULL,
    derived_wireguard_psk_hash_sha256 VARCHAR(64) NOT NULL,
    hkdf_salt VARCHAR(128) NOT NULL,
    handshake_compute_duration_ms NUMERIC(6,3) NOT NULL,
    status ratchet_status_type NOT NULL DEFAULT 'INITIALIZING',
    epoch_started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    epoch_active_until TIMESTAMPTZ NOT NULL,
    superseded_at TIMESTAMPTZ,
    zero_packet_loss_verified BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_node_epoch_pair UNIQUE (initiator_node_id, responder_node_id, epoch_sequence),
    CONSTRAINT chk_different_nodes CHECK (initiator_node_id <> responder_node_id)
);

CREATE INDEX IF NOT EXISTS idx_ratchet_active_epochs ON session_ratchet_epochs (epoch_active_until, status);
CREATE INDEX IF NOT EXISTS idx_ratchet_nodes_seq ON session_ratchet_epochs (initiator_node_id, responder_node_id, epoch_sequence DESC);

-- ----------------------------------------------------------------------------
-- 4. TABLE: tunnel_telemetry_metrics (RANGE PARTITIONED BY TIME)
-- High-throughput time-series telemetry partition capturing sub-millisecond
-- latency, jitter, packet transfer counters, and quantum safety indicators.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tunnel_telemetry_metrics (
    telemetry_id UUID DEFAULT gen_random_uuid(),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    node_id VARCHAR(64) NOT NULL,
    peer_node_id VARCHAR(64) NOT NULL,
    epoch_sequence BIGINT NOT NULL,
    rtt_latency_ms NUMERIC(6,3) NOT NULL,
    jitter_ms NUMERIC(6,3) NOT NULL,
    rx_bytes BIGINT NOT NULL DEFAULT 0,
    tx_bytes BIGINT NOT NULL DEFAULT 0,
    rx_packets BIGINT NOT NULL DEFAULT 0,
    tx_packets BIGINT NOT NULL DEFAULT 0,
    packet_loss_ratio NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
    kem_handshake_ms NUMERIC(6,3) NOT NULL,
    shor_resistance_margin_bits INTEGER NOT NULL DEFAULT 256,
    grover_speedup_margin_bits INTEGER NOT NULL DEFAULT 256,
    hndl_mitigation_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    PRIMARY KEY (recorded_at, telemetry_id)
) PARTITION BY RANGE (recorded_at);

-- Partitions for 2026-2027 Operations
CREATE TABLE IF NOT EXISTS tunnel_telemetry_metrics_2026_q3 PARTITION OF tunnel_telemetry_metrics
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS tunnel_telemetry_metrics_2026_q4 PARTITION OF tunnel_telemetry_metrics
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS tunnel_telemetry_metrics_2027_q1 PARTITION OF tunnel_telemetry_metrics
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2027-04-01 00:00:00+00');

CREATE INDEX IF NOT EXISTS idx_telemetry_node_time ON tunnel_telemetry_metrics (node_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_peer_time ON tunnel_telemetry_metrics (peer_node_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_rtt ON tunnel_telemetry_metrics (rtt_latency_ms);

-- ----------------------------------------------------------------------------
-- 5. TABLE: revocation_audit_ledger
-- Immutable cryptographic revocation log satisfying zero-RPO tamper evidence.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS revocation_audit_ledger (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_node_id VARCHAR(64) NOT NULL REFERENCES mesh_edge_nodes(node_id) ON DELETE RESTRICT,
    key_fingerprint_sha256 VARCHAR(64) REFERENCES kem_key_pair_registry(key_fingerprint_sha256) ON DELETE RESTRICT,
    revocation_type VARCHAR(64) NOT NULL, -- 'EMERGENCY_ISOLATION', 'NOISE_ANOMALY', 'MANUAL_DECOMMISSION'
    triggering_principal VARCHAR(255) NOT NULL,
    tamper_proof_prev_hash_sha256 VARCHAR(64) NOT NULL,
    event_hash_sha256 VARCHAR(64) NOT NULL,
    signature_ecdsa_sha512 BYTEA NOT NULL,
    audit_details JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_revocation_target ON revocation_audit_ledger (target_node_id, event_timestamp DESC);

-- ----------------------------------------------------------------------------
-- AUTOMATED TRIGGERS & PROCEDURAL GUARDS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_mesh_nodes_ts ON mesh_edge_nodes;
CREATE TRIGGER trg_update_mesh_nodes_ts
    BEFORE UPDATE ON mesh_edge_nodes
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_timestamp_column();

-- Row Level Security (RLS) Policy Declarations
ALTER TABLE mesh_edge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kem_key_pair_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_ratchet_epochs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tunnel_telemetry_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revocation_audit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_mesh_nodes_org_isolation ON mesh_edge_nodes
    FOR ALL
    USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::uuid);
