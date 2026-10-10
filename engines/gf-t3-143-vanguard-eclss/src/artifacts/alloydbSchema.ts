/**
 * Vanguard-ECLSS: Autonomous Closed-Loop Environmental Control & Life Support System
 * Asset Code: GF-T3-143 (Ghost FactoryOS Fleet Track 3 - F1 Skunkworks Engine)
 * 
 * Production Cloud-Scale AlloyDB / PostgreSQL 16 Normalized Database DDL Schema
 */

export const ALLOYDB_SCHEMA_SQL = `-- ============================================================================
-- GHOST FACTORYOS FLEET TRACK 3: F1 SKUNKWORKS REFERENCE ENGINE
-- ASSET IDENTIFIER: GF-T3-143 | VANGUARD-ECLSS AUTONOMOUS LIFE SUPPORT
-- TARGET DATABASE: Google Cloud AlloyDB for PostgreSQL (v16.x Enterprise)
-- HIGH-CONCURRENCY, ZERO-RPO IMMUTABLE TELEMETRY & AUDIT ARCHITECTURE
-- ============================================================================

-- Enforce Strict Session Parameters & Timezone
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = on;
SET timezone = 'UTC';

-- Install Mandatory Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create Dedicated High-Security Schema
CREATE SCHEMA IF NOT EXISTS vanguard_eclss;
SET search_path TO vanguard_eclss, public;

-- ============================================================================
-- 1. ENUMS & DOMAIN TYPES
-- ============================================================================

CREATE TYPE habitat_operational_status AS ENUM (
    'ACTIVE_NOMINAL',
    'DEGRADED_FAILSAFE',
    'ISOLATION_EMERGENCY',
    'SURVIVAL_LOW_POWER',
    'DECOMMISSIONED'
);

CREATE TYPE fdir_severity_level AS ENUM (
    'INFO',
    'ADVISORY',
    'WARNING',
    'CRITICAL'
);

CREATE TYPE actuator_valve_type AS ENUM (
    'PROPORTIONAL_SOLENOID',
    'BALL_ISOLATION_VALVE',
    'BLOWER_VARIABLE_FREQUENCY_DRIVE',
    'THERMAL_EXPANSION_VALVE',
    'PEM_POWER_MODULATOR'
);

-- ============================================================================
-- 2. HABITAT NODES & TOPOLOGY REGISTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS eclss_habitat_nodes (
    node_id VARCHAR(64) PRIMARY KEY,
    habitat_name VARCHAR(128) NOT NULL,
    orbital_regime VARCHAR(64) NOT NULL DEFAULT 'LUNAR_SURFACE_OUTPOST',
    pressurized_volume_m3 NUMERIC(10, 3) NOT NULL CHECK (pressurized_volume_m3 > 0),
    nominal_crew_capacity INT NOT NULL CHECK (nominal_crew_capacity BETWEEN 1 AND 32),
    maximum_crew_capacity INT NOT NULL CHECK (maximum_crew_capacity >= nominal_crew_capacity),
    status habitat_operational_status NOT NULL DEFAULT 'ACTIVE_NOMINAL',
    current_firmware_version VARCHAR(32) NOT NULL DEFAULT 'v4.18.2-rtos',
    firmware_sha256 CHAR(64) NOT NULL,
    provisioned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT chk_firmware_hash CHECK (firmware_sha256 ~ '^[a-f0-9]{64}$')
);

-- ============================================================================
-- 3. ATMOSPHERIC & RESOURCE TELEMETRY LOGS (TIME-SERIES PARTITIONED)
-- ============================================================================

CREATE TABLE IF NOT EXISTS atmospheric_telemetry_logs (
    log_id UUID DEFAULT gen_random_uuid(),
    timestamp_utc TIMESTAMPTZ NOT NULL,
    node_id VARCHAR(64) NOT NULL REFERENCES eclss_habitat_nodes(node_id) ON DELETE RESTRICT,
    total_pressure_kpa NUMERIC(8, 4) NOT NULL CHECK (total_pressure_kpa BETWEEN 0 AND 150.0),
    ppo2_kpa NUMERIC(8, 4) NOT NULL CHECK (ppo2_kpa BETWEEN 0 AND 50.0),
    ppco2_kpa NUMERIC(8, 4) NOT NULL CHECK (ppco2_kpa BETWEEN 0 AND 10.0),
    ppn2_kpa NUMERIC(8, 4) NOT NULL CHECK (ppn2_kpa BETWEEN 0 AND 120.0),
    pph2o_kpa NUMERIC(8, 4) NOT NULL CHECK (pph2o_kpa BETWEEN 0 AND 15.0),
    cabin_temperature_celsius NUMERIC(6, 3) NOT NULL CHECK (cabin_temperature_celsius BETWEEN -20 AND 60),
    relative_humidity_pct NUMERIC(5, 2) NOT NULL CHECK (relative_humidity_pct BETWEEN 0 AND 100),
    calculated_dew_point_celsius NUMERIC(6, 3) NOT NULL,
    calculated_enthalpy_kj_per_kg NUMERIC(8, 3) NOT NULL,
    trace_voc_ppm NUMERIC(8, 5) NOT NULL DEFAULT 0.0 CHECK (trace_voc_ppm >= 0),
    carbon_monoxide_ppm NUMERIC(8, 4) NOT NULL DEFAULT 0.0 CHECK (carbon_monoxide_ppm >= 0),
    methane_ppm NUMERIC(8, 4) NOT NULL DEFAULT 0.0 CHECK (methane_ppm >= 0),
    mpc_execution_latency_ms NUMERIC(6, 3) NOT NULL CHECK (mpc_execution_latency_ms > 0),
    mpc_quadratic_cost NUMERIC(12, 4) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (timestamp_utc, log_id, node_id)
) PARTITION BY RANGE (timestamp_utc);

-- Initial Partitioning Scheme (Monthly Rolling Partitions)
CREATE TABLE IF NOT EXISTS atmospheric_telemetry_y2026m10 PARTITION OF atmospheric_telemetry_logs
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS atmospheric_telemetry_y2026m11 PARTITION OF atmospheric_telemetry_logs
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS atmospheric_telemetry_y2026m12 PARTITION OF atmospheric_telemetry_logs
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- Composite High-Performance Indexing
CREATE INDEX IF NOT EXISTS idx_telemetry_node_time ON atmospheric_telemetry_logs (node_id, timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_ppo2_anomalies ON atmospheric_telemetry_logs (timestamp_utc DESC) WHERE ppo2_kpa < 19.5 OR ppo2_kpa > 23.1;
CREATE INDEX IF NOT EXISTS idx_telemetry_ppco2_critical ON atmospheric_telemetry_logs (timestamp_utc DESC) WHERE ppco2_kpa > 0.50;

-- ============================================================================
-- 4. CONSUMABLE BUFFER RESERVES & INVENTORY AUDITING
-- ============================================================================

CREATE TABLE IF NOT EXISTS consumable_buffer_reserves (
    reserve_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(64) NOT NULL REFERENCES eclss_habitat_nodes(node_id) ON DELETE CASCADE,
    cryo_o2_stored_kg NUMERIC(10, 3) NOT NULL CHECK (cryo_o2_stored_kg >= 0),
    cryo_n2_stored_kg NUMERIC(10, 3) NOT NULL CHECK (cryo_n2_stored_kg >= 0),
    cryo_h2_stored_kg NUMERIC(10, 3) NOT NULL CHECK (cryo_h2_stored_kg >= 0),
    potable_water_stored_liters NUMERIC(10, 3) NOT NULL CHECK (potable_water_stored_liters >= 0),
    hygiene_water_stored_liters NUMERIC(10, 3) NOT NULL CHECK (hygiene_water_stored_liters >= 0),
    urine_distillate_buffer_liters NUMERIC(10, 3) NOT NULL CHECK (urine_distillate_buffer_liters >= 0),
    co2_sorbent_bed_life_hours NUMERIC(8, 2) NOT NULL CHECK (co2_sorbent_bed_life_hours >= 0),
    catalytic_oxidizer_run_hours NUMERIC(8, 2) NOT NULL CHECK (catalytic_oxidizer_run_hours >= 0),
    calculated_margin_days NUMERIC(8, 2) NOT NULL CHECK (calculated_margin_days >= 0),
    last_calibrated_utc TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reserves_node ON consumable_buffer_reserves(node_id);

-- ============================================================================
-- 5. ACTUATOR COMMAND & SERVO AUDIT HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS actuator_command_history (
    command_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(64) NOT NULL REFERENCES eclss_habitat_nodes(node_id) ON DELETE RESTRICT,
    actuator_tag VARCHAR(64) NOT NULL,
    actuator_type actuator_valve_type NOT NULL,
    commanded_by VARCHAR(64) NOT NULL DEFAULT 'MPC_CORE_AUTONOMOUS',
    setpoint_value NUMERIC(10, 4) NOT NULL,
    engineering_units VARCHAR(32) NOT NULL,
    feedback_value NUMERIC(10, 4),
    response_time_ms NUMERIC(6, 2),
    command_status VARCHAR(32) NOT NULL DEFAULT 'ACKNOWLEDGED',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_command_latency CHECK (response_time_ms >= 0)
);

CREATE INDEX IF NOT EXISTS idx_actuator_node_time ON actuator_command_history (node_id, issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_actuator_tag ON actuator_command_history (actuator_tag, issued_at DESC);

-- ============================================================================
-- 6. FAULT DETECTION, ISOLATION, AND RECOVERY (FDIR) INCIDENT RECORDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS fdir_incident_records (
    incident_id VARCHAR(64) PRIMARY KEY,
    node_id VARCHAR(64) NOT NULL REFERENCES eclss_habitat_nodes(node_id) ON DELETE RESTRICT,
    subsystem VARCHAR(32) NOT NULL,
    severity fdir_severity_level NOT NULL,
    anomaly_code VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    root_cause_probability_vector JSONB NOT NULL,
    mitigation_protocol VARCHAR(128) NOT NULL,
    isolation_valves_engaged TEXT[] NOT NULL DEFAULT '{}',
    is_autonomous_mitigated BOOLEAN NOT NULL DEFAULT true,
    resolved BOOLEAN NOT NULL DEFAULT false,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    telemetry_state_snapshot JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fdir_unresolved ON fdir_incident_records (node_id, triggered_at DESC) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_fdir_severity ON fdir_incident_records (severity, triggered_at DESC);

-- ============================================================================
-- 7. IMMUTABLE AUDIT TRAIL & ZERO-RPO TRIGGERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_audit_ledger (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    operation_type VARCHAR(16) NOT NULL,
    record_pk VARCHAR(128) NOT NULL,
    prior_state JSONB,
    new_state JSONB,
    actor_identity VARCHAR(128) NOT NULL DEFAULT CURRENT_USER,
    client_addr INET,
    client_port INT,
    transaction_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION audit_ledger_recorder()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO vanguard_eclss.system_audit_ledger (
            table_name, operation_type, record_pk, prior_state, new_state, actor_identity, client_addr, client_port
        ) VALUES (
            TG_TABLE_NAME, 'DELETE', OLD.node_id::text, to_jsonb(OLD), NULL, CURRENT_USER, inet_client_addr(), inet_client_port()
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO vanguard_eclss.system_audit_ledger (
            table_name, operation_type, record_pk, prior_state, new_state, actor_identity, client_addr, client_port
        ) VALUES (
            TG_TABLE_NAME, 'UPDATE', NEW.node_id::text, to_jsonb(OLD), to_jsonb(NEW), CURRENT_USER, inet_client_addr(), inet_client_port()
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO vanguard_eclss.system_audit_ledger (
            table_name, operation_type, record_pk, prior_state, new_state, actor_identity, client_addr, client_port
        ) VALUES (
            TG_TABLE_NAME, 'INSERT', NEW.node_id::text, NULL, to_jsonb(NEW), CURRENT_USER, inet_client_addr(), inet_client_port()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Audit Triggers to Critical Master Tables
CREATE TRIGGER trg_audit_nodes
AFTER INSERT OR UPDATE OR DELETE ON eclss_habitat_nodes
FOR EACH ROW EXECUTE FUNCTION audit_ledger_recorder();

CREATE TRIGGER trg_audit_reserves
AFTER INSERT OR UPDATE OR DELETE ON consumable_buffer_reserves
FOR EACH ROW EXECUTE FUNCTION audit_ledger_recorder();

-- ============================================================================
-- 8. INITIAL SEED PROVISIONING (VANGUARD OUTPOST 01)
-- ============================================================================

INSERT INTO eclss_habitat_nodes (
    node_id, habitat_name, orbital_regime, pressurized_volume_m3, nominal_crew_capacity, maximum_crew_capacity, status, firmware_sha256
) VALUES (
    'VANGUARD-OUTPOST-01',
    'Vanguard Lunar Deep-Space Habitat Alpha',
    'LUNAR_SOUTH_POLE_SHACKLETON',
    450.000,
    6,
    12,
    'ACTIVE_NOMINAL',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
) ON CONFLICT (node_id) DO NOTHING;

INSERT INTO consumable_buffer_reserves (
    node_id, cryo_o2_stored_kg, cryo_n2_stored_kg, cryo_h2_stored_kg, potable_water_stored_liters, hygiene_water_stored_liters, urine_distillate_buffer_liters, co2_sorbent_bed_life_hours, catalytic_oxidizer_run_hours, calculated_margin_days
) VALUES (
    'VANGUARD-OUTPOST-01',
    780.000,
    1650.000,
    48.500,
    940.000,
    380.000,
    42.000,
    4200.00,
    8600.00,
    182.50
) ON CONFLICT DO NOTHING;
`;
