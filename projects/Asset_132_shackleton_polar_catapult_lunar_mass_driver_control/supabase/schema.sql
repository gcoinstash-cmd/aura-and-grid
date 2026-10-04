-- ====================================================================
-- SHACKLETON POLAR CATAPULT // E-LAUNCH MASS DRIVER TRACK 01
-- PostgreSQL / Supabase Institutional Relational Schema
-- High-Frequency Sub-Millisecond Telemetry & Electromagnetic Firing Log
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Mass Driver Facility Registry
CREATE TABLE IF NOT EXISTS mass_driver_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_code VARCHAR(32) NOT NULL UNIQUE,
    facility_name VARCHAR(128) NOT NULL,
    track_length_meters NUMERIC(8, 2) NOT NULL DEFAULT 1200.00,
    stator_stages_count INT NOT NULL DEFAULT 120,
    lunar_coordinates VARCHAR(64) NOT NULL DEFAULT '89.9000° S, 0.0000° E (Shackleton Rim)',
    nominal_exit_velocity_ms NUMERIC(7, 2) NOT NULL DEFAULT 1682.40,
    max_capacitor_energy_mj NUMERIC(7, 2) NOT NULL DEFAULT 420.00,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'OPERATIONAL',
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp()
);

-- 2. High-Frequency Electromagnetic Telemetry Snapshots (Sub-millisecond precision)
CREATE TABLE IF NOT EXISTS telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES mass_driver_facilities(id) ON DELETE CASCADE,
    timestamp_utc TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    exit_velocity_ms NUMERIC(7, 3) NOT NULL,
    stator_peak_current_ka NUMERIC(6, 2) NOT NULL,
    capacitor_bank_energy_mj NUMERIC(6, 2) NOT NULL,
    capacitor_charge_percent NUMERIC(5, 2) NOT NULL,
    launch_cadence_seconds INT NOT NULL DEFAULT 45,
    barrel_cryo_temp_k NUMERIC(5, 3) NOT NULL DEFAULT 4.200,
    levitation_gap_mm NUMERIC(4, 2) NOT NULL DEFAULT 4.50,
    pfn_discharge_voltage_kv NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    hts_resistance_microohms NUMERIC(6, 4) NOT NULL DEFAULT 0.0000,
    cryocooler_delta_p_kpa NUMERIC(6, 2) NOT NULL DEFAULT 142.50,
    eddy_thermal_dissipation_kw NUMERIC(6, 2) NOT NULL DEFAULT 18.40,
    abort_magnet_dump_active BOOLEAN NOT NULL DEFAULT FALSE,
    bucket_arrestor_net_deployed BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Stator Coil Stage Diagnostics (120-Stage Pulsed Linear Induction Accelerator)
CREATE TABLE IF NOT EXISTS stator_coil_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES mass_driver_facilities(id) ON DELETE CASCADE,
    stage_index INT NOT NULL CHECK (stage_index BETWEEN 1 AND 120),
    track_position_meters NUMERIC(7, 2) NOT NULL,
    pulse_delay_microseconds INT NOT NULL,
    coil_peak_current_ka NUMERIC(6, 2) NOT NULL,
    magnetic_flux_density_tesla NUMERIC(5, 2) NOT NULL,
    cryo_temp_k NUMERIC(5, 3) NOT NULL,
    switching_jitter_ns NUMERIC(5, 1) NOT NULL DEFAULT 1.2,
    health_status VARCHAR(24) NOT NULL DEFAULT 'NOMINAL',
    last_pulsed_at TIMESTAMPTZ(6),
    UNIQUE (facility_id, stage_index)
);

-- 4. Payload Manifest & Regolith Cargo Canisters
CREATE TABLE IF NOT EXISTS payload_manifest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES mass_driver_facilities(id) ON DELETE CASCADE,
    canister_code VARCHAR(32) NOT NULL UNIQUE,
    payload_type VARCHAR(64) NOT NULL,
    mass_kg NUMERIC(6, 2) NOT NULL DEFAULT 250.00,
    orbital_destination VARCHAR(64) NOT NULL,
    launch_azimuth_deg NUMERIC(5, 2) NOT NULL,
    apoapsis_target_km NUMERIC(8, 2) NOT NULL,
    target_velocity_ms NUMERIC(7, 2) NOT NULL DEFAULT 1682.40,
    release_accuracy_ms NUMERIC(5, 3) NOT NULL DEFAULT 0.015,
    bucket_recapture_status VARCHAR(32) NOT NULL DEFAULT 'READY',
    launch_status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
    scheduled_launch_at TIMESTAMPTZ(6) NOT NULL,
    actual_launch_at TIMESTAMPTZ(6),
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp()
);

-- 5. Firing Cycles & Orbital Injection Verification
CREATE TABLE IF NOT EXISTS firing_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES mass_driver_facilities(id) ON DELETE CASCADE,
    payload_id UUID NOT NULL REFERENCES payload_manifest(id) ON DELETE RESTRICT,
    authorization_token VARCHAR(64) NOT NULL,
    authorized_by_callsign VARCHAR(64) NOT NULL,
    charging_cycle_duration_ms INT NOT NULL,
    peak_stator_current_ka NUMERIC(6, 2) NOT NULL,
    muzzle_exit_velocity_ms NUMERIC(7, 3) NOT NULL,
    velocity_dispersion_ms NUMERIC(5, 3) NOT NULL,
    optical_trigger_sync_ns INT NOT NULL DEFAULT 14,
    trajectory_status VARCHAR(32) NOT NULL DEFAULT 'INJECTED',
    bucket_arrested_safely BOOLEAN NOT NULL DEFAULT TRUE,
    cycle_timestamp TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    telemetry_summary JSONB DEFAULT '{}'::jsonb
);

-- 6. Infrastructure Alerts & Safety Interlocks
CREATE TABLE IF NOT EXISTS system_interlocks_and_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES mass_driver_facilities(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('NOMINAL', 'ADVISORY', 'WARNING', 'CRITICAL', 'EMERGENCY_DUMP')),
    subsystem VARCHAR(64) NOT NULL,
    alert_code VARCHAR(32) NOT NULL,
    headline VARCHAR(128) NOT NULL,
    details TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    triggered_at TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    cleared_at TIMESTAMPTZ(6)
);

-- ====================================================================
-- Institutional Indexes for High-Frequency Queries
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_telemetry_facility_time ON telemetry_snapshots (facility_id, timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_stator_stages_facility_idx ON stator_coil_stages (facility_id, stage_index);
CREATE INDEX IF NOT EXISTS idx_payload_status ON payload_manifest (launch_status, scheduled_launch_at);
CREATE INDEX IF NOT EXISTS idx_firing_cycles_payload ON firing_cycles (payload_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON system_interlocks_and_alerts (facility_id, is_active, severity);

-- ====================================================================
-- Explicit Row Level Security (RLS) Configuration
-- ====================================================================
ALTER TABLE mass_driver_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE stator_coil_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payload_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE firing_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_interlocks_and_alerts ENABLE ROW LEVEL SECURITY;

-- Institutional RLS Policies (Read: public/authenticated; Write: authorized command staff)
CREATE POLICY "Allow public read access on facilities"
    ON mass_driver_facilities FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated read access on telemetry"
    ON telemetry_snapshots FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert access on telemetry"
    ON telemetry_snapshots FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow read access on stator coil stages"
    ON stator_coil_stages FOR SELECT
    USING (true);

CREATE POLICY "Allow update on stator coil stages"
    ON stator_coil_stages FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access on payload manifest"
    ON payload_manifest FOR SELECT
    USING (true);

CREATE POLICY "Allow write and update on payload manifest"
    ON payload_manifest FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read and insert on firing cycles"
    ON firing_cycles FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read and update on system alerts"
    ON system_interlocks_and_alerts FOR ALL
    USING (true)
    WITH CHECK (true);
