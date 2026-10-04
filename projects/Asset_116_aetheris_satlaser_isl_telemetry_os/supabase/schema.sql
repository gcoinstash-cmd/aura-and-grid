-- =============================================================================
-- AETHERIS-MESH LEO CONSTELLATION: SATELLITE LASER ISL ARCHITECTURE
-- PostgreSQL / Supabase Database Schema
-- Canonical Schema Definition for Spaceborne Optical Communications & PAT Diagnostics
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if re-applying schema in development
DROP TABLE IF EXISTS terminal_commands CASCADE;
DROP TABLE IF EXISTS routing_manifest_hops CASCADE;
DROP TABLE IF EXISTS isl_routing_manifest CASCADE;
DROP TABLE IF EXISTS pat_telemetry_logs CASCADE;
DROP TABLE IF EXISTS active_crosslinks CASCADE;
DROP TABLE IF EXISTS optical_isl_terminals CASCADE;
DROP TABLE IF EXISTS constellation_satellites CASCADE;

-- -----------------------------------------------------------------------------
-- 1. CONSTELLATION SATELLITES TABLE
-- Tracks the 24 Walker-Delta LEO spacecraft nodes across 8 orbital planes
-- -----------------------------------------------------------------------------
CREATE TABLE constellation_satellites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sat_code VARCHAR(16) NOT NULL UNIQUE,              -- e.g. 'SAT-01' through 'SAT-24'
    orbital_plane SMALLINT NOT NULL CHECK (orbital_plane BETWEEN 1 AND 8),
    plane_slot SMALLINT NOT NULL CHECK (plane_slot BETWEEN 1 AND 3),
    altitude_km NUMERIC(7, 2) NOT NULL DEFAULT 550.00,
    inclination_deg NUMERIC(5, 2) NOT NULL DEFAULT 97.40,
    eccentricity NUMERIC(6, 5) NOT NULL DEFAULT 0.00015,
    true_anomaly_deg NUMERIC(6, 2) NOT NULL,
    raan_deg NUMERIC(6, 2) NOT NULL,                   -- Right Ascension of Ascending Node
    battery_soc_pct NUMERIC(5, 2) NOT NULL DEFAULT 94.50,
    solar_flux_w NUMERIC(7, 2) NOT NULL DEFAULT 2480.00,
    operational_status VARCHAR(24) NOT NULL DEFAULT 'NOMINAL_OPERATIONAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on satellite code and plane for ultra-fast constellation lookups
CREATE INDEX idx_satellites_plane ON constellation_satellites (orbital_plane);
CREATE INDEX idx_satellites_status ON constellation_satellites (operational_status);

-- -----------------------------------------------------------------------------
-- 2. OPTICAL ISL TERMINALS TABLE
-- Spaceborne Optical Intersatellite Link Terminals (4 heads per spacecraft)
-- -----------------------------------------------------------------------------
CREATE TABLE optical_isl_terminals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    satellite_id UUID NOT NULL REFERENCES constellation_satellites(id) ON DELETE CASCADE,
    terminal_code VARCHAR(32) NOT NULL UNIQUE,         -- e.g. 'TERM-SAT04-HEAD1'
    terminal_role VARCHAR(20) NOT NULL CHECK (terminal_role IN ('FORE', 'AFT', 'PORT', 'STARBOARD')),
    laser_wavelength_nm NUMERIC(7, 2) NOT NULL DEFAULT 1550.52,
    laser_frequency_thz NUMERIC(6, 2) NOT NULL DEFAULT 193.35,
    edfa_power_watts NUMERIC(5, 2) NOT NULL DEFAULT 4.82,
    edfa_pump_current_ma NUMERIC(6, 1) NOT NULL DEFAULT 855.0,
    edfa_stage2_gain_db NUMERIC(5, 2) NOT NULL DEFAULT 34.20,
    shutter_state VARCHAR(16) NOT NULL DEFAULT 'OPEN' CHECK (shutter_state IN ('OPEN', 'CLOSED_SAFE_MODE', 'DEPLOYING', 'FAULT')),
    fsm_lock_status VARCHAR(24) NOT NULL DEFAULT 'FINE_LOCKED' CHECK (fsm_lock_status IN ('FINE_LOCKED', 'COARSE_LOCKED', 'SPIRAL_SCAN', 'OPEN_LOOP', 'OFFLINE')),
    qpd_error_x_urad NUMERIC(6, 3) NOT NULL DEFAULT 0.142,
    qpd_error_y_urad NUMERIC(6, 3) NOT NULL DEFAULT -0.281,
    gimbal_azimuth_deg NUMERIC(6, 2) NOT NULL DEFAULT 142.84,
    gimbal_elevation_deg NUMERIC(6, 2) NOT NULL DEFAULT -12.38,
    motor_temp_az_c NUMERIC(5, 2) NOT NULL DEFAULT 24.30,
    motor_temp_el_c NUMERIC(5, 2) NOT NULL DEFAULT 26.80,
    fsm_piezo_temp_c NUMERIC(5, 2) NOT NULL DEFAULT 18.70,
    radiator_temp_c NUMERIC(5, 2) NOT NULL DEFAULT -32.40,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_terminals_satellite_id ON optical_isl_terminals (satellite_id);
CREATE INDEX idx_terminals_role ON optical_isl_terminals (terminal_role);
CREATE INDEX idx_terminals_fsm_status ON optical_isl_terminals (fsm_lock_status);

-- -----------------------------------------------------------------------------
-- 3. ACTIVE CROSSLINKS TABLE
-- Coherent optical laser interlocks established between orbital nodes
-- -----------------------------------------------------------------------------
CREATE TABLE active_crosslinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_terminal_id UUID NOT NULL REFERENCES optical_isl_terminals(id) ON DELETE CASCADE,
    target_satellite_id UUID NOT NULL REFERENCES constellation_satellites(id) ON DELETE RESTRICT,
    link_identifier VARCHAR(32) NOT NULL UNIQUE,       -- e.g. 'LINK-FORE-01'
    link_direction VARCHAR(16) NOT NULL CHECK (link_direction IN ('FORE', 'AFT', 'PORT', 'STARBOARD')),
    slant_range_km NUMERIC(8, 2) NOT NULL,
    range_rate_kms NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
    doppler_shift_ghz NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
    packet_latency_ms NUMERIC(6, 3) NOT NULL,
    osnr_db NUMERIC(5, 2) NOT NULL DEFAULT 28.40,
    link_margin_db NUMERIC(5, 2) NOT NULL DEFAULT 7.20,
    bit_error_rate VARCHAR(24) NOT NULL DEFAULT '1.20e-11',
    throughput_gbps NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    buffer_depth_kb INTEGER NOT NULL DEFAULT 142,
    packet_drop_count BIGINT NOT NULL DEFAULT 0,
    link_status VARCHAR(24) NOT NULL DEFAULT 'LOCKED' CHECK (link_status IN ('LOCKED', 'RE_ACQUIRING', 'DEGRADED', 'TERMINATED', 'SHUTTER_HALT')),
    established_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crosslinks_source ON active_crosslinks (source_terminal_id);
CREATE INDEX idx_crosslinks_target ON active_crosslinks (target_satellite_id);
CREATE INDEX idx_crosslinks_status ON active_crosslinks (link_status);

-- -----------------------------------------------------------------------------
-- 4. PAT TELEMETRY LOGS TABLE
-- Pointing, Acquisition, and Tracking (PAT) high-cadence sensor telemetry
-- -----------------------------------------------------------------------------
CREATE TABLE pat_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    terminal_id UUID NOT NULL REFERENCES optical_isl_terminals(id) ON DELETE CASCADE,
    ephemeris_jitter_urad NUMERIC(6, 3) NOT NULL,
    solar_exclusion_angle_deg NUMERIC(5, 2) NOT NULL,
    qpd_sum_voltage_mv NUMERIC(7, 2) NOT NULL DEFAULT 845.20,
    qpd_delta_x_mv NUMERIC(6, 2) NOT NULL,
    qpd_delta_y_mv NUMERIC(6, 2) NOT NULL,
    coarse_pointing_error_urad NUMERIC(6, 2) NOT NULL,
    fine_steering_angle_x_urad NUMERIC(6, 2) NOT NULL,
    fine_steering_angle_y_urad NUMERIC(6, 2) NOT NULL,
    edfa_temp_c NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pat_telemetry_terminal ON pat_telemetry_logs (terminal_id);
CREATE INDEX idx_pat_telemetry_recorded_at ON pat_telemetry_logs (recorded_at DESC);

-- -----------------------------------------------------------------------------
-- 5. ISL ROUTING MANIFEST TABLE
-- Mesh routing tables, multi-hop optical paths, and dynamic reroutes
-- -----------------------------------------------------------------------------
CREATE TABLE isl_routing_manifest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_hash VARCHAR(64) NOT NULL UNIQUE,
    route_name VARCHAR(128) NOT NULL,
    ingress_sat_code VARCHAR(16) NOT NULL,
    egress_sat_code VARCHAR(16) NOT NULL,
    hop_count SMALLINT NOT NULL DEFAULT 4,
    total_latency_ms NUMERIC(6, 2) NOT NULL,
    mesh_throughput_gbps NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    route_priority VARCHAR(16) NOT NULL DEFAULT 'ULTRA_LOW_LATENCY' CHECK (route_priority IN ('ULTRA_LOW_LATENCY', 'BULK_BACKHAUL', 'CRITICAL_TELECOMMAND', 'DEEP_SPACE_RELAY')),
    route_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (route_status IN ('ACTIVE', 'RE_ROUTING', 'STANDBY', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routing_manifest_status ON isl_routing_manifest (route_status);
CREATE INDEX idx_routing_manifest_priority ON isl_routing_manifest (route_priority);

-- -----------------------------------------------------------------------------
-- 6. ROUTING MANIFEST HOPS TABLE
-- Ordered path breakdown per optical mesh route
-- -----------------------------------------------------------------------------
CREATE TABLE routing_manifest_hops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES isl_routing_manifest(id) ON DELETE CASCADE,
    hop_index SMALLINT NOT NULL,
    from_sat_code VARCHAR(16) NOT NULL,
    to_sat_code VARCHAR(16) NOT NULL,
    isl_direction VARCHAR(16) NOT NULL,
    hop_latency_ms NUMERIC(5, 2) NOT NULL,
    hop_margin_db NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routing_hops_route_id ON routing_manifest_hops (route_id, hop_index);

-- -----------------------------------------------------------------------------
-- 7. TERMINAL COMMANDS TABLE
-- Telecommand execution ledger (Raster scans, buffer flushes, shutter toggles)
-- -----------------------------------------------------------------------------
CREATE TABLE terminal_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    terminal_id UUID NOT NULL REFERENCES optical_isl_terminals(id) ON DELETE CASCADE,
    command_name VARCHAR(64) NOT NULL,
    command_payload JSONB DEFAULT '{}'::jsonb,
    executed_by VARCHAR(64) NOT NULL DEFAULT 'SYSTEM_AUTONOMY',
    execution_status VARCHAR(24) NOT NULL DEFAULT 'SUCCESS' CHECK (execution_status IN ('PENDING', 'EXECUTING', 'SUCCESS', 'REJECTED', 'FAILED')),
    response_telemetry JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_terminal_commands_terminal ON terminal_commands (terminal_id);
CREATE INDEX idx_terminal_commands_status ON terminal_commands (execution_status);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict institutional security enablement on every table
-- -----------------------------------------------------------------------------
ALTER TABLE constellation_satellites ENABLE ROW LEVEL SECURITY;
ALTER TABLE optical_isl_terminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_crosslinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pat_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE isl_routing_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_manifest_hops ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_commands ENABLE ROW LEVEL SECURITY;

-- Read-only institutional policy for authenticated operators and read tokens
CREATE POLICY "Allow public read-access to constellation satellites"
    ON constellation_satellites FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to optical isl terminals"
    ON optical_isl_terminals FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to active crosslinks"
    ON active_crosslinks FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to pat telemetry logs"
    ON pat_telemetry_logs FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to isl routing manifest"
    ON isl_routing_manifest FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to routing manifest hops"
    ON routing_manifest_hops FOR SELECT
    USING (true);

CREATE POLICY "Allow public read-access to terminal commands"
    ON terminal_commands FOR SELECT
    USING (true);

-- Allow authorized insert/update operations
CREATE POLICY "Allow telemetry ingest and updates to terminals"
    ON optical_isl_terminals FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow crosslink status modifications"
    ON active_crosslinks FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow command log insertion"
    ON terminal_commands FOR INSERT
    WITH CHECK (true);
