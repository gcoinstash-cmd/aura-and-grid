-- ============================================================================
-- OCEANUS-ICE TETHER RIG // CRYOBOT PROBE CR-07 CONTROL DECK
-- PostgreSQL DDL Schema for Planetary Sub-Ice Submergence Robotics
-- ============================================================================

-- Extensions for institutional UUIDs and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Definitions
CREATE TYPE probe_operational_status AS ENUM (
    'standby',
    'melt_penetration',
    'water_jet_assisted',
    'ocean_ingress',
    'abyssal_survey',
    'emergency_ascent',
    'tether_severed'
);

CREATE TYPE alert_severity_level AS ENUM (
    'nominal',
    'advisory',
    'warning',
    'critical',
    'emergency'
);

CREATE TYPE science_bay_state AS ENUM (
    'empty_purged',
    'sampling_active',
    'sealed_refrigerated',
    'analyzing',
    'exhausted'
);

CREATE TYPE mission_operator_role AS ENUM (
    'mission_director',
    'rov_lead_pilot',
    'biogeochemist_specialist',
    'flight_engineer'
);

-- ============================================================================
-- 1. Mission Profiles & Probe Chassis Registry
-- ============================================================================
CREATE TABLE IF NOT EXISTS probe_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    callsign VARCHAR(64) NOT NULL UNIQUE,
    model_designation VARCHAR(128) NOT NULL,
    hull_material VARCHAR(128) NOT NULL DEFAULT 'Titanium Grade 5 + Aerogel Insulated Matrix',
    crush_depth_rating_meters NUMERIC(10, 2) NOT NULL DEFAULT 12000.00,
    max_thermal_power_kw NUMERIC(8, 2) NOT NULL DEFAULT 250.00,
    commissioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_status probe_operational_status NOT NULL DEFAULT 'melt_penetration',
    target_body VARCHAR(64) NOT NULL DEFAULT 'Europa / Pwyll Crater Ice Shell',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. Telemetry Records (Abyssal Depth, Tension, Thermal, Pressure)
-- ============================================================================
CREATE TABLE IF NOT EXISTS probe_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    depth_meters NUMERIC(10, 3) NOT NULL,
    hydrostatic_pressure_mpa NUMERIC(8, 3) NOT NULL,
    thermal_core_power_kw NUMERIC(7, 2) NOT NULL,
    tether_payout_meters NUMERIC(10, 2) NOT NULL,
    tether_tension_kn NUMERIC(6, 2) NOT NULL,
    melt_core_temp_celsius NUMERIC(6, 2) NOT NULL,
    cartridge_1_temp_c NUMERIC(6, 2) NOT NULL,
    cartridge_2_temp_c NUMERIC(6, 2) NOT NULL,
    cartridge_3_temp_c NUMERIC(6, 2) NOT NULL,
    cartridge_4_temp_c NUMERIC(6, 2) NOT NULL,
    bus_voltage_v NUMERIC(7, 2) NOT NULL DEFAULT 400.00,
    fiber_attenuation_db_per_km NUMERIC(5, 3) NOT NULL DEFAULT 0.185,
    circulator_flow_l_per_min NUMERIC(6, 2) NOT NULL DEFAULT 142.50,
    buoyancy_bladder_volume_l NUMERIC(6, 2) NOT NULL DEFAULT 24.80,
    buoyancy_piston_bar NUMERIC(7, 2) NOT NULL DEFAULT 385.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. Science Payloads & Geochemical Sensor Ledgers
-- ============================================================================
CREATE TABLE IF NOT EXISTS science_payload_manifest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    sensor_code VARCHAR(32) NOT NULL,
    sensor_name VARCHAR(128) NOT NULL,
    sensor_type VARCHAR(64) NOT NULL,
    operating_wavelength_nm NUMERIC(7, 2),
    sampling_rate_hz NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    health_score_pct NUMERIC(5, 2) NOT NULL DEFAULT 98.50,
    last_calibration_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vent_water_chemistry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    depth_meters NUMERIC(10, 2) NOT NULL,
    dissolved_methane_nmol_l NUMERIC(8, 3) NOT NULL,
    dissolved_hydrogen_umol_kg NUMERIC(8, 3) NOT NULL,
    ph_level NUMERIC(4, 2) NOT NULL,
    salinity_psu NUMERIC(6, 2) NOT NULL,
    orp_redox_mv NUMERIC(7, 2) NOT NULL,
    dissolved_oxygen_umol_l NUMERIC(8, 3) NOT NULL,
    turbidity_fnu NUMERIC(6, 2) NOT NULL DEFAULT 1.25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS niskin_sample_bays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    bay_number INT NOT NULL CHECK (bay_number BETWEEN 1 AND 8),
    capacity_ml INT NOT NULL DEFAULT 750,
    fill_volume_ml INT NOT NULL DEFAULT 0,
    state science_bay_state NOT NULL DEFAULT 'empty_purged',
    sealed_at TIMESTAMPTZ,
    seal_pressure_bar NUMERIC(7, 2),
    sample_depth_meters NUMERIC(10, 2),
    organic_compounds_detected JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. Sub-Ice Column Layers & Waypoint Targets
-- ============================================================================
CREATE TABLE IF NOT EXISTS ice_column_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_name VARCHAR(64) NOT NULL,
    depth_start_m NUMERIC(10, 2) NOT NULL,
    depth_end_m NUMERIC(10, 2) NOT NULL,
    ambient_temp_c NUMERIC(5, 2) NOT NULL,
    ice_type VARCHAR(64) NOT NULL,
    cavitation_assist_required BOOLEAN NOT NULL DEFAULT FALSE,
    acoustic_ping_rate_hz NUMERIC(5, 2) NOT NULL DEFAULT 4.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. Command Deck Operator Authorization & Audit Trails
-- ============================================================================
CREATE TABLE IF NOT EXISTS flight_deck_operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    callsign VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    role mission_operator_role NOT NULL,
    clearance_level INT NOT NULL DEFAULT 4,
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operator_command_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES flight_deck_operators(id) ON DELETE CASCADE,
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    command_name VARCHAR(128) NOT NULL,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    dual_key_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    execution_result VARCHAR(64) NOT NULL DEFAULT 'ACK_EXECUTED'
);

-- ============================================================================
-- 6. Alerts & Anomaly Diagnostic Ledgers
-- ============================================================================
CREATE TABLE IF NOT EXISTS telemetry_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    probe_id UUID NOT NULL REFERENCES probe_units(id) ON DELETE CASCADE,
    subsystem VARCHAR(64) NOT NULL,
    severity alert_severity_level NOT NULL,
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    triggered_value NUMERIC(12, 4),
    threshold_value NUMERIC(12, 4),
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_by UUID REFERENCES flight_deck_operators(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Sub-Millisecond Telemetry Queries & Analytics
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_telemetry_probe_recorded ON probe_telemetry_logs (probe_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_chemistry_probe_time ON vent_water_chemistry_logs (probe_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unack ON telemetry_alerts (probe_id, is_acknowledged, severity);
CREATE INDEX IF NOT EXISTS idx_commands_exec ON operator_command_actions (probe_id, executed_at DESC);

-- ============================================================================
-- Row Level Security (RLS) Mandate
-- ============================================================================
ALTER TABLE probe_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE probe_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE science_payload_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE vent_water_chemistry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE niskin_sample_bays ENABLE ROW LEVEL SECURITY;
ALTER TABLE ice_column_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_deck_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_command_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_alerts ENABLE ROW LEVEL SECURITY;

-- Institutional Access Policies (Authenticated Mission Personnel)
CREATE POLICY "Allow authenticated read on probe_units" 
    ON probe_units FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on probe_telemetry_logs" 
    ON probe_telemetry_logs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on probe_telemetry_logs" 
    ON probe_telemetry_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read on science_payload_manifest" 
    ON science_payload_manifest FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on vent_water_chemistry_logs" 
    ON vent_water_chemistry_logs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on niskin_sample_bays" 
    ON niskin_sample_bays FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update on niskin_sample_bays" 
    ON niskin_sample_bays FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated read on ice_column_waypoints" 
    ON ice_column_waypoints FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on flight_deck_operators" 
    ON flight_deck_operators FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on operator_command_actions" 
    ON operator_command_actions FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on operator_command_actions" 
    ON operator_command_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read on telemetry_alerts" 
    ON telemetry_alerts FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update on telemetry_alerts" 
    ON telemetry_alerts FOR UPDATE USING (true);
