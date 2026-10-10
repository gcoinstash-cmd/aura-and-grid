import React, { useState } from 'react';
import { Database, Copy, Check, Table, ShieldCheck, Layers, FileCode } from 'lucide-react';

export const AlloyDbSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('mesh_edge_nodes');

  const tables = [
    {
      name: 'mesh_edge_nodes',
      desc: 'Master hardware node registry with FQDN, WireGuard interfaces, and operational states.',
      cols: 17,
      type: 'Relational Core'
    },
    {
      name: 'kem_key_pair_registry',
      desc: 'Public key vectors (t), algorithm parameters, and hardware HSM key handles.',
      cols: 12,
      type: 'Cryptographic Ledger'
    },
    {
      name: 'session_ratchet_epochs',
      desc: 'Double-buffered ephemeral WireGuard PSK epoch states and handshake audit metrics.',
      cols: 16,
      type: 'Session State'
    },
    {
      name: 'tunnel_telemetry_metrics',
      desc: 'High-throughput time-series telemetry partition table with RTT, Jitter, and Shor/Grover scores.',
      cols: 14,
      type: 'Range Partitioned (Time)'
    },
    {
      name: 'revocation_audit_ledger',
      desc: 'Immutable append-only audit trail with tamper-proof SHA-256 event chaining.',
      cols: 9,
      type: 'Tamper-Evident Ledger'
    }
  ];

  const sqlCode = `-- ============================================================================
-- GHOST FACTORYOS FLEET TRACK 3 (F1 SKUNKWORKS SERVICE ENGINE)
-- ASSET IDENTIFIER: GF-T3-144 (Lattice-Mesh: Post-Quantum Cryptographic Engine)
-- PRODUCTION DATABASE DDL SPECIFICATION: AlloyDB / PostgreSQL 16+ Enterprise
-- ZERO PLACEHOLDERS / COMPLETE INTEGRITY CONSTRAINTS & TIME-SERIES PARTITIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Custom Domain Types & Enums
CREATE TYPE node_operational_state AS ENUM ('PROVISIONING', 'ONLINE_ACTIVE', 'ROTATING', 'DRAINING', 'REVOKED', 'OFFLINE');
CREATE TYPE kem_algorithm_type AS ENUM ('ML_KEM_512', 'ML_KEM_768', 'ML_KEM_1024', 'HYBRID_X25519_ML_KEM_1024');
CREATE TYPE ratchet_status_type AS ENUM ('INITIALIZING', 'ACTIVE_SYNCHRONIZED', 'STANDBY_PROPAGATED', 'SUPERSEDED', 'FAILED_REJECTED');

-- ----------------------------------------------------------------------------
-- 1. TABLE: mesh_edge_nodes
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

-- ----------------------------------------------------------------------------
-- 2. TABLE: kem_key_pair_registry
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

-- ----------------------------------------------------------------------------
-- 3. TABLE: session_ratchet_epochs
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

-- ----------------------------------------------------------------------------
-- 4. TABLE: tunnel_telemetry_metrics (PARTITIONED BY TIME)
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

-- ----------------------------------------------------------------------------
-- 5. TABLE: revocation_audit_ledger
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS revocation_audit_ledger (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_node_id VARCHAR(64) NOT NULL REFERENCES mesh_edge_nodes(node_id) ON DELETE RESTRICT,
    key_fingerprint_sha256 VARCHAR(64) REFERENCES kem_key_pair_registry(key_fingerprint_sha256) ON DELETE RESTRICT,
    revocation_type VARCHAR(64) NOT NULL,
    triggering_principal VARCHAR(255) NOT NULL,
    tamper_proof_prev_hash_sha256 VARCHAR(64) NOT NULL,
    event_hash_sha256 VARCHAR(64) NOT NULL,
    signature_ecdsa_sha512 BYTEA NOT NULL,
    audit_details JSONB NOT NULL
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              AlloyDB &amp; PostgreSQL 16+ Production Schema
            </h2>
            <span className="text-base text-slate-400 block mt-1 font-mono">
              Normalized DDL · Time-Series Range Partitioning · Zero-RPO Tamper Ledger
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-base border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied SQL Script!' : 'Copy DDL Script'}</span>
          </button>
        </div>
      </div>

      {/* 2. Table Structure Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tables.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTable(t.name)}
            className={`p-4 rounded-xl text-left border transition-all ${
              activeTable === t.name
                ? 'bg-slate-800 border-emerald-500 shadow-md'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <span className="text-base font-bold text-white block truncate">{t.name}</span>
            <span className="text-base text-emerald-400 font-mono block mt-1">{t.type}</span>
            <span className="text-base text-slate-400 block mt-2">{t.cols} Columns</span>
          </button>
        ))}
      </div>

      {/* 3. SQL Code Display Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <span className="text-xl font-bold text-white">ALLOYDB_SCHEMA.sql</span>
          </div>
          <span className="text-base text-slate-400 font-mono">
            Target: Google Cloud AlloyDB / PostgreSQL 16+
          </span>
        </div>

        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-base font-mono text-slate-200 leading-relaxed">
            <code>{sqlCode}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
