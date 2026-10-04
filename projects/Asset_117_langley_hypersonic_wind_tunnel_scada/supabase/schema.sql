-- ============================================================================
-- LANGLEY TRANSONIC-HYPERSONIC COMPLEX // MACH 7.5 HIGH-ENTHALPY FACILITY
-- Institutional Ground-Test Operations Database Schema (PostgreSQL / Supabase DDL)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. HYPERSONIC GROUND-TEST FACILITIES TABLE
CREATE TABLE IF NOT EXISTS hypersonic_facilities (
    facility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_code VARCHAR(32) NOT NULL UNIQUE,
    facility_name VARCHAR(255) NOT NULL,
    complex_location VARCHAR(255) NOT NULL,
    driver_type VARCHAR(64) NOT NULL, -- 'Huels-Type Constricted Arc', 'Pebble-Bed Heated Blowdown', etc.
    max_mach_number NUMERIC(4, 2) NOT NULL,
    max_stagnation_pressure_mpa NUMERIC(6, 2) NOT NULL,
    max_stagnation_temp_k NUMERIC(6, 1) NOT NULL,
    max_arc_heater_power_mw NUMERIC(5, 1) NOT NULL,
    test_section_diameter_mm NUMERIC(6, 1) NOT NULL,
    vacuum_sphere_volume_m3 NUMERIC(7, 1) NOT NULL,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TEST CAMPAIGNS (AERODYNAMIC VEHICLE EVALUATIONS)
CREATE TABLE IF NOT EXISTS test_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES hypersonic_facilities(facility_id) ON DELETE CASCADE,
    campaign_code VARCHAR(64) NOT NULL UNIQUE,
    test_article_designation VARCHAR(128) NOT NULL,
    vehicle_class VARCHAR(64) NOT NULL, -- 'Waverider Glide Body', 'Scramjet Cruise', etc.
    sponsor_agency VARCHAR(128) NOT NULL,
    principal_investigator VARCHAR(128) NOT NULL,
    target_mach_min NUMERIC(4, 2) NOT NULL,
    target_mach_max NUMERIC(4, 2) NOT NULL,
    target_reynolds_per_meter NUMERIC(12, 2) NOT NULL,
    total_planned_blowdowns INT NOT NULL DEFAULT 10,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 3. TEST BLOWDOWN RUNS (INDIVIDUAL TUNNEL FIRINGS)
CREATE TABLE IF NOT EXISTS test_runs (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES test_campaigns(campaign_id) ON DELETE CASCADE,
    run_number VARCHAR(32) NOT NULL,
    model_configuration VARCHAR(128) NOT NULL,
    angle_of_attack_deg NUMERIC(5, 2) NOT NULL,
    sideslip_angle_deg NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    freestream_mach NUMERIC(4, 2) NOT NULL,
    freestream_velocity_ms INT NOT NULL,
    p0_stagnation_pressure_mpa NUMERIC(5, 2) NOT NULL,
    t0_stagnation_temp_k NUMERIC(6, 1) NOT NULL,
    test_cell_static_pressure_kpa NUMERIC(6, 3) NOT NULL,
    dynamic_pressure_kpa NUMERIC(6, 2) NOT NULL,
    arc_heater_power_mw NUMERIC(5, 2) NOT NULL,
    arc_current_amps INT NOT NULL,
    arc_voltage_volts INT NOT NULL,
    boundary_layer_suction_active BOOLEAN NOT NULL DEFAULT TRUE,
    run_duration_seconds NUMERIC(5, 2) NOT NULL,
    scram_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    scram_trigger_reason TEXT,
    execution_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 6-DOF PIEZOELECTRIC INTERNAL BALANCE TELEMETRY
CREATE TABLE IF NOT EXISTS transducer_telemetry (
    telemetry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES test_runs(run_id) ON DELETE CASCADE,
    time_offset_seconds NUMERIC(7, 3) NOT NULL,
    lift_force_n NUMERIC(9, 2) NOT NULL,
    drag_force_n NUMERIC(9, 2) NOT NULL,
    pitching_moment_nm NUMERIC(8, 2) NOT NULL,
    side_force_n NUMERIC(8, 2) NOT NULL,
    yaw_moment_nm NUMERIC(8, 2) NOT NULL,
    roll_moment_nm NUMERIC(8, 2) NOT NULL,
    lift_to_drag_ratio NUMERIC(5, 3) NOT NULL,
    peak_heat_flux_mw_m2 NUMERIC(5, 2) NOT NULL,
    skin_friction_coefficient NUMERIC(7, 6) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SURFACE PRESSURE & HEAT-FLUX SENSOR TAPS (P1-P12)
CREATE TABLE IF NOT EXISTS pressure_tap_readings (
    tap_reading_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES test_runs(run_id) ON DELETE CASCADE,
    tap_identifier VARCHAR(16) NOT NULL, -- 'P01' through 'P12'
    surface_location VARCHAR(128) NOT NULL,
    surface_type VARCHAR(32) NOT NULL, -- 'windward', 'leeward', 'internal', 'base'
    chord_x_ratio NUMERIC(4, 3) NOT NULL,
    static_pressure_kpa NUMERIC(7, 2) NOT NULL,
    heat_flux_mw_m2 NUMERIC(6, 2) NOT NULL,
    wall_temperature_k INT NOT NULL,
    shock_impingement_detected BOOLEAN NOT NULL DEFAULT FALSE,
    sample_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. OPTICAL SCHLIEREN CAPTURE FRAMES
CREATE TABLE IF NOT EXISTS schlieren_optical_frames (
    frame_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES test_runs(run_id) ON DELETE CASCADE,
    frame_serial_code VARCHAR(32) NOT NULL UNIQUE,
    frame_time_offset_sec NUMERIC(6, 3) NOT NULL,
    exposure_nanoseconds INT NOT NULL DEFAULT 120,
    optical_mode VARCHAR(64) NOT NULL, -- 'Toepler Knife-Edge', 'Wollaston Prism', etc.
    shock_wave_angle_deg NUMERIC(4, 2) NOT NULL,
    bow_shock_standoff_mm NUMERIC(4, 2) NOT NULL,
    boundary_layer_transition_x_c NUMERIC(4, 3) NOT NULL,
    laser_illumination_wavelength_nm NUMERIC(5, 1) NOT NULL DEFAULT 532.0,
    storage_blob_uri TEXT NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FACILITY FAST-QUENCH SCRAM EVENTS
CREATE TABLE IF NOT EXISTS facility_scram_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES test_runs(run_id) ON DELETE CASCADE,
    trigger_subsystem VARCHAR(64) NOT NULL, -- 'Operator Manual Switch', 'Nozzle Delta-T Trip', etc.
    arc_power_at_trip_mw NUMERIC(5, 2) NOT NULL,
    quench_deluge_gas VARCHAR(32) NOT NULL DEFAULT 'CRYOGENIC_NITROGEN',
    quench_mass_flow_kg_s NUMERIC(6, 1) NOT NULL DEFAULT 120.0,
    extinguish_time_ms INT NOT NULL DEFAULT 42,
    operator_clearance_id VARCHAR(64) NOT NULL,
    investigation_summary TEXT NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_test_runs_campaign ON test_runs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(execution_status);
CREATE INDEX IF NOT EXISTS idx_transducer_telemetry_run ON transducer_telemetry(run_id);
CREATE INDEX IF NOT EXISTS idx_transducer_time ON transducer_telemetry(time_offset_seconds);
CREATE INDEX IF NOT EXISTS idx_pressure_taps_run_tap ON pressure_tap_readings(run_id, tap_identifier);
CREATE INDEX IF NOT EXISTS idx_schlieren_frames_run ON schlieren_optical_frames(run_id);
CREATE INDEX IF NOT EXISTS idx_scram_events_run ON facility_scram_events(run_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Explicit institutional security for test facility databases
-- ============================================================================
ALTER TABLE hypersonic_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transducer_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE pressure_tap_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schlieren_optical_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_scram_events ENABLE ROW LEVEL SECURITY;

-- Read policies for institutional facility users and test conductors
CREATE POLICY "Allow read access to authenticated test operators for facilities"
    ON hypersonic_facilities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for campaigns"
    ON test_campaigns FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for test runs"
    ON test_runs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for balance telemetry"
    ON transducer_telemetry FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for pressure taps"
    ON pressure_tap_readings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for schlieren frames"
    ON schlieren_optical_frames FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated test operators for scram events"
    ON facility_scram_events FOR SELECT TO authenticated USING (true);

-- Insert policies for facility automated data acquisition systems (DAQ)
CREATE POLICY "Allow DAQ logging into test runs"
    ON test_runs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow DAQ logging into transducer telemetry"
    ON transducer_telemetry FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow DAQ logging into pressure taps"
    ON pressure_tap_readings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow high-speed camera logging into schlieren frames"
    ON schlieren_optical_frames FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow safety system logging into scram events"
    ON facility_scram_events FOR INSERT TO authenticated WITH CHECK (true);
