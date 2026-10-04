-- NASA Glenn Vacuum Facility 6 (VF6) // X3 100kW Nested-Channel Hall Thruster
-- PostgreSQL / Supabase Relational DDL Architecture
-- Enforces strict typing, foreign keys, timestamps, indexes, and Row Level Security (RLS).

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Test Campaigns Table
CREATE TABLE IF NOT EXISTS test_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_code VARCHAR(64) NOT NULL UNIQUE,
    facility_name VARCHAR(128) NOT NULL DEFAULT 'NASA Glenn VF6',
    thruster_model VARCHAR(128) NOT NULL DEFAULT 'X3 100kW Nested-Channel Hall Thruster',
    lead_test_engineer VARCHAR(128) NOT NULL,
    target_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    primary_propellant VARCHAR(32) NOT NULL DEFAULT 'Xenon (Xe-131)',
    chamber_id VARCHAR(32) NOT NULL DEFAULT 'VF-6 Chamber B',
    status VARCHAR(32) NOT NULL DEFAULT 'OPERATIONAL' CHECK (status IN ('PRE_FIRE', 'OPERATIONAL', 'FAST_TRIP', 'POST_FIRE_COOLDOWN', 'ABORTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Firing Telemetry Snapshots
CREATE TABLE IF NOT EXISTS firing_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES test_campaigns(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    inner_channel_active BOOLEAN NOT NULL DEFAULT true,
    middle_channel_active BOOLEAN NOT NULL DEFAULT true,
    outer_channel_active BOOLEAN NOT NULL DEFAULT true,
    discharge_voltage_v NUMERIC(6, 2) NOT NULL,
    discharge_current_inner_a NUMERIC(6, 2) NOT NULL,
    discharge_current_middle_a NUMERIC(6, 2) NOT NULL,
    discharge_current_outer_a NUMERIC(6, 2) NOT NULL,
    total_discharge_power_kw NUMERIC(6, 2) NOT NULL,
    thrust_newtons NUMERIC(6, 3) NOT NULL,
    isp_seconds NUMERIC(6, 1) NOT NULL,
    chamber_pressure_torr NUMERIC(10, 8) NOT NULL,
    cathode_keeper_voltage_v NUMERIC(5, 2) NOT NULL,
    cathode_heater_current_a NUMERIC(5, 2) NOT NULL,
    mass_flow_inner_mgs NUMERIC(5, 2) NOT NULL,
    mass_flow_middle_mgs NUMERIC(5, 2) NOT NULL,
    mass_flow_outer_mgs NUMERIC(5, 2) NOT NULL,
    mass_flow_cathode_mgs NUMERIC(5, 2) NOT NULL,
    ln2_baffle_temp_k NUMERIC(5, 2) NOT NULL DEFAULT 77.4,
    cryo_panel_15k_temp_k NUMERIC(5, 2) NOT NULL DEFAULT 14.8,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Faraday Cup Plume Sweeps
CREATE TABLE IF NOT EXISTS faraday_sweeps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES test_campaigns(id) ON DELETE CASCADE,
    sweep_batch_id UUID NOT NULL DEFAULT gen_random_uuid(),
    angle_degrees NUMERIC(5, 1) NOT NULL CHECK (angle_degrees BETWEEN -90.0 AND 90.0),
    current_density_ma_cm2 NUMERIC(7, 4) NOT NULL,
    ion_flux_cm2_s NUMERIC(16, 2) NOT NULL,
    plasma_potential_v NUMERIC(6, 2) NOT NULL DEFAULT 18.5,
    divergence_fraction NUMERIC(5, 4) NOT NULL DEFAULT 0.05,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Facility Subsystems & Safety Interlocks
CREATE TABLE IF NOT EXISTS facility_subsystems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsystem_code VARCHAR(32) NOT NULL UNIQUE,
    subsystem_name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('VACUUM', 'PROPULSION', 'POWER', 'THERMAL', 'DIAGNOSTICS', 'SAFETY')),
    health_status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL' CHECK (health_status IN ('NOMINAL', 'DEGRADED', 'INTERLOCK_TRIP', 'OFFLINE')),
    operating_temp_k NUMERIC(6, 2),
    operational_pressure_torr NUMERIC(12, 9),
    interlock_armed BOOLEAN NOT NULL DEFAULT true,
    last_calibrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Incident & Fast-Trip Logs
CREATE TABLE IF NOT EXISTS incident_trip_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES test_campaigns(id) ON DELETE CASCADE,
    incident_code VARCHAR(32) NOT NULL,
    trip_category VARCHAR(64) NOT NULL CHECK (trip_category IN ('HIGH_VOLTAGE_ARC', 'VACUUM_LOSS', 'PPU_OVERCURRENT', 'CATHODE_EXTINCTION', 'THERMAL_OVERRUN', 'OPERATOR_FAST_TRIP')),
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'EMERGENCY_SCRAM')),
    trigger_metric VARCHAR(64) NOT NULL,
    trigger_value VARCHAR(64) NOT NULL,
    threshold_value VARCHAR(64) NOT NULL,
    action_taken TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT false,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_telemetry_campaign_time ON firing_telemetry_snapshots (campaign_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_faraday_sweep_batch ON faraday_sweeps (sweep_batch_id, angle_degrees ASC);
CREATE INDEX IF NOT EXISTS idx_incident_campaign_time ON incident_trip_logs (campaign_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_subsystems_category ON facility_subsystems (category);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE test_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE firing_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE faraday_sweeps ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_subsystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_trip_logs ENABLE ROW LEVEL SECURITY;

-- Institutional RLS Policies (Read-Only Public / Authenticated Facility Operators)
CREATE POLICY "Public Read Test Campaigns" ON test_campaigns FOR SELECT USING (true);
CREATE POLICY "Public Read Telemetry Snapshots" ON firing_telemetry_snapshots FOR SELECT USING (true);
CREATE POLICY "Public Read Faraday Sweeps" ON faraday_sweeps FOR SELECT USING (true);
CREATE POLICY "Public Read Facility Subsystems" ON facility_subsystems FOR SELECT USING (true);
CREATE POLICY "Public Read Incident Logs" ON incident_trip_logs FOR SELECT USING (true);
