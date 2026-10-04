-- ==============================================================================
-- AEON SUCTION-GT // ACTIVE GROUND-EFFECT TELEMETRY DATABASE
-- Schema DDL: Institutional PostgreSQL / Supabase Blueprint
-- Target: Active Ground-Effect Aerodynamics & Hypercar Vacuum Telemetry
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running migration
DROP TABLE IF EXISTS aero_event_logs CASCADE;
DROP TABLE IF EXISTS cornering_apex_records CASCADE;
DROP TABLE IF EXISTS turbine_fan_logs CASCADE;
DROP TABLE IF EXISTS vacuum_telemetry_snapshots CASCADE;
DROP TABLE IF EXISTS ground_effect_vehicles CASCADE;

-- 1. VEHICLE REGISTRY TABLE
CREATE TABLE ground_effect_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chassis_code VARCHAR(32) NOT NULL UNIQUE,
    model_name VARCHAR(128) NOT NULL,
    prototype_stage VARCHAR(32) NOT NULL DEFAULT 'EXPERIMENTAL',
    curb_weight_kg NUMERIC(8, 2) NOT NULL DEFAULT 1420.00,
    powertrain_config VARCHAR(64) NOT NULL DEFAULT 'TRI-MOTOR AWD 1680HP',
    battery_capacity_kwh NUMERIC(6, 2) NOT NULL DEFAULT 88.00,
    dual_turbine_rating_cfm INTEGER NOT NULL DEFAULT 19000,
    max_vacuum_kpa NUMERIC(6, 2) NOT NULL DEFAULT -54.00,
    max_downforce_kg NUMERIC(8, 2) NOT NULL DEFAULT 2800.00,
    skirt_material VARCHAR(64) NOT NULL DEFAULT 'KEVLAR-PTFE FLEX COMPOSITE',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    commissioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. REAL-TIME VACUUM TELEMETRY SNAPSHOTS TABLE
CREATE TABLE vacuum_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES ground_effect_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ground_speed_kmh NUMERIC(6, 2) NOT NULL,
    underfloor_vacuum_kpa NUMERIC(6, 2) NOT NULL,
    total_downforce_kg NUMERIC(8, 2) NOT NULL,
    vacuum_mode VARCHAR(32) NOT NULL DEFAULT 'HIGH_DOWNFORCE',
    lateral_g NUMERIC(5, 3) NOT NULL,
    longitudinal_g NUMERIC(5, 3) NOT NULL,
    skirt_clearance_fl_mm NUMERIC(5, 2) NOT NULL,
    skirt_clearance_fr_mm NUMERIC(5, 2) NOT NULL,
    skirt_clearance_rl_mm NUMERIC(5, 2) NOT NULL,
    skirt_clearance_rr_mm NUMERIC(5, 2) NOT NULL,
    seal_integrity_pct NUMERIC(5, 2) NOT NULL,
    venturi_throat_velocity_ms NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DUAL TURBINE FAN DIAGNOSTIC LOGS TABLE
CREATE TABLE turbine_fan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES ground_effect_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fan_channel VARCHAR(16) NOT NULL, -- 'TURBINE_L', 'TURBINE_R', 'DUAL_SYNC'
    rpm_actual INTEGER NOT NULL,
    rpm_target INTEGER NOT NULL,
    air_evacuation_cfm INTEGER NOT NULL,
    blade_pitch_deg NUMERIC(5, 2) NOT NULL,
    inverter_temp_celsius NUMERIC(5, 2) NOT NULL,
    stator_temp_celsius NUMERIC(5, 2) NOT NULL,
    power_draw_kw NUMERIC(6, 2) NOT NULL,
    overboost_active BOOLEAN NOT NULL DEFAULT FALSE,
    purge_cycle_active BOOLEAN NOT NULL DEFAULT FALSE,
    bearing_vibration_g NUMERIC(5, 3) NOT NULL DEFAULT 0.042,
    fault_code VARCHAR(32) DEFAULT 'NOMINAL'
);

-- 4. CORNERING APEX HIGH-G RECORDS TABLE
CREATE TABLE cornering_apex_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES ground_effect_vehicles(id) ON DELETE CASCADE,
    corner_number INTEGER NOT NULL,
    corner_name VARCHAR(64) NOT NULL,
    track_name VARCHAR(128) NOT NULL DEFAULT 'AERO-DYNE HIGH SPEED PROVING GROUND',
    apex_speed_kmh NUMERIC(6, 2) NOT NULL,
    entry_lateral_g NUMERIC(5, 3) NOT NULL,
    peak_lateral_g NUMERIC(5, 3) NOT NULL,
    exit_lateral_g NUMERIC(5, 3) NOT NULL,
    underfloor_suction_kpa NUMERIC(6, 2) NOT NULL,
    skirt_ground_gap_min_mm NUMERIC(5, 2) NOT NULL,
    seal_integrity_pct NUMERIC(5, 2) NOT NULL,
    turbine_kw_demand NUMERIC(6, 2) NOT NULL,
    aero_balance_front_pct NUMERIC(5, 2) NOT NULL DEFAULT 46.50,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AERO EVENT & DRIVER ACTION LOGS TABLE
CREATE TABLE aero_event_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES ground_effect_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARN', 'CRITICAL', 'ACTION'
    description TEXT NOT NULL,
    telemetry_delta JSONB DEFAULT '{}'::jsonb,
    triggered_by VARCHAR(64) NOT NULL DEFAULT 'PILOT_CONTROL'
);

-- PERFORMANCE & SEARCH INDEXES
CREATE INDEX idx_vac_telemetry_vehicle_time ON vacuum_telemetry_snapshots(vehicle_id, recorded_at DESC);
CREATE INDEX idx_turbine_fan_vehicle_time ON turbine_fan_logs(vehicle_id, recorded_at DESC);
CREATE INDEX idx_cornering_apex_vehicle_corner ON cornering_apex_records(vehicle_id, corner_number);
CREATE INDEX idx_aero_events_vehicle_time ON aero_event_logs(vehicle_id, recorded_at DESC);
CREATE INDEX idx_aero_events_severity ON aero_event_logs(severity);

-- ROW LEVEL SECURITY CONFIGURATION
ALTER TABLE ground_effect_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacuum_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE turbine_fan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cornering_apex_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE aero_event_logs ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE PUBLIC READ POLICIES FOR TELEMETRY DASHBOARD
CREATE POLICY "Allow public read access on ground_effect_vehicles"
    ON ground_effect_vehicles FOR SELECT USING (true);

CREATE POLICY "Allow public read access on vacuum_telemetry_snapshots"
    ON vacuum_telemetry_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow public read access on turbine_fan_logs"
    ON turbine_fan_logs FOR SELECT USING (true);

CREATE POLICY "Allow public read access on cornering_apex_records"
    ON cornering_apex_records FOR SELECT USING (true);

CREATE POLICY "Allow public read access on aero_event_logs"
    ON aero_event_logs FOR SELECT USING (true);

-- SERVICE ROLE WRITE ACCESS POLICIES
CREATE POLICY "Allow service role all on ground_effect_vehicles"
    ON ground_effect_vehicles FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all on vacuum_telemetry_snapshots"
    ON vacuum_telemetry_snapshots FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all on turbine_fan_logs"
    ON turbine_fan_logs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all on cornering_apex_records"
    ON cornering_apex_records FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all on aero_event_logs"
    ON aero_event_logs FOR ALL USING (auth.role() = 'service_role');
