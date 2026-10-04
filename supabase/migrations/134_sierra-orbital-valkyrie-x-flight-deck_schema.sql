-- ==============================================================================
-- SIERRA-ORBITAL // VALKYRIE-X SUBORBITAL AEROSPIKE & RCS FLIGHT DECK
-- Institutional PostgreSQL / Supabase Schema Definition
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean drop existing tables for blueprint reconstitution
DROP TABLE IF EXISTS anomaly_events CASCADE;
DROP TABLE IF EXISTS attitude_commands CASCADE;
DROP TABLE IF EXISTS propulsion_telemetry_logs CASCADE;
DROP TABLE IF EXISTS rcs_thrusters CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS spaceplanes CASCADE;

-- ------------------------------------------------------------------------------
-- 1. Spaceplanes Registry
-- ------------------------------------------------------------------------------
CREATE TABLE spaceplanes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tail_number VARCHAR(32) NOT NULL UNIQUE,
    callsign VARCHAR(64) NOT NULL,
    chassis_model VARCHAR(64) NOT NULL,
    aerospike_model VARCHAR(64) NOT NULL,
    dry_mass_kg NUMERIC(10, 2) NOT NULL,
    max_apogee_km NUMERIC(6, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'MISSION_READY',
    operational_hours NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Suborbital Flight Missions
-- ------------------------------------------------------------------------------
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spaceplane_id UUID NOT NULL REFERENCES spaceplanes(id) ON DELETE CASCADE,
    mission_code VARCHAR(32) NOT NULL UNIQUE,
    mission_name VARCHAR(128) NOT NULL,
    trajectory_profile VARCHAR(64) NOT NULL DEFAULT 'MESOSPHERIC_SUBORBITAL_APOGEE',
    target_apogee_km NUMERIC(6, 2) NOT NULL,
    target_velocity_mach NUMERIC(4, 2) NOT NULL,
    flight_status VARCHAR(32) NOT NULL DEFAULT 'IN_FLIGHT',
    launch_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    touchdown_time TIMESTAMPTZ,
    commander_callsign VARCHAR(64) NOT NULL,
    propulsion_lead_callsign VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Reaction Control System (RCS) Thruster Cluster
-- ------------------------------------------------------------------------------
CREATE TABLE rcs_thrusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spaceplane_id UUID NOT NULL REFERENCES spaceplanes(id) ON DELETE CASCADE,
    thruster_code VARCHAR(32) NOT NULL,
    quad_position VARCHAR(32) NOT NULL, -- 'QUAD-FWD-01', 'QUAD-PORT-02', 'QUAD-STBD-03', 'QUAD-AFT-04'
    orientation_axis VARCHAR(32) NOT NULL, -- '+PITCH', '-PITCH', '+ROLL', '-ROLL', '+YAW', '-YAW'
    rated_thrust_n NUMERIC(6, 2) NOT NULL DEFAULT 440.00,
    chamber_pressure_nominal_bar NUMERIC(5, 2) NOT NULL DEFAULT 14.50,
    cumulative_pulse_count INTEGER NOT NULL DEFAULT 0,
    valve_latency_ms NUMERIC(4, 2) NOT NULL DEFAULT 4.20,
    nozzle_temp_c NUMERIC(6, 2) NOT NULL DEFAULT 24.00,
    duty_cycle_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    manifold_isolated BOOLEAN NOT NULL DEFAULT FALSE,
    health_status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_spaceplane_thruster UNIQUE (spaceplane_id, thruster_code)
);

-- ------------------------------------------------------------------------------
-- 4. Propulsion & Trajectory Live Telemetry Logs
-- ------------------------------------------------------------------------------
CREATE TABLE propulsion_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    altitude_km NUMERIC(7, 3) NOT NULL,
    velocity_mps NUMERIC(8, 2) NOT NULL,
    velocity_mach NUMERIC(4, 2) NOT NULL,
    dynamic_pressure_q_kpa NUMERIC(6, 2) NOT NULL,
    aerospike_thrust_kn NUMERIC(6, 2) NOT NULL,
    aerospike_chamber_pressure_bar NUMERIC(6, 2) NOT NULL,
    turbopump_rpm NUMERIC(8, 2) NOT NULL,
    turbine_inlet_temp_k NUMERIC(6, 2) NOT NULL,
    he_bottle_pressure_bar NUMERIC(6, 2) NOT NULL,
    he_regulator_outlet_bar NUMERIC(5, 2) NOT NULL,
    mmh_tank_pressure_bar NUMERIC(5, 2) NOT NULL,
    nto_tank_pressure_bar NUMERIC(5, 2) NOT NULL,
    mmh_propellant_pct NUMERIC(5, 2) NOT NULL,
    nto_propellant_pct NUMERIC(5, 2) NOT NULL,
    pitch_rate_deg_s NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
    roll_rate_deg_s NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
    yaw_rate_deg_s NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
    flight_phase VARCHAR(64) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. Attitude Commands & Maneuver Ledger
-- ------------------------------------------------------------------------------
CREATE TABLE attitude_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    command_type VARCHAR(64) NOT NULL, -- 'NULL_RATES', 'PITCH_TRIM', 'ROLL_STABILIZE', 'YAW_CORRECTION', 'TEST_BURST'
    target_axis VARCHAR(32) NOT NULL, -- 'PITCH', 'ROLL', 'YAW', 'ALL_AXES'
    pulse_duration_ms INTEGER NOT NULL,
    quad_mask VARCHAR(64) NOT NULL, -- e.g. 'QUAD-FWD-01|QUAD-AFT-04'
    operator_role VARCHAR(64) NOT NULL DEFAULT 'FLIGHT_DIRECTOR_AUTO',
    execution_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    response_delta_ms NUMERIC(5, 2) NOT NULL DEFAULT 5.40,
    telemetry_notes TEXT
);

-- ------------------------------------------------------------------------------
-- 6. Propulsion Deck Anomaly Events & Interlocks
-- ------------------------------------------------------------------------------
CREATE TABLE anomaly_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(32) NOT NULL, -- 'ADVISORY', 'CAUTION', 'WARNING', 'CRITICAL_ABORT'
    subsystem VARCHAR(64) NOT NULL, -- 'AEROSPIKE_TURBOPUMP', 'RCS_MANIFOLD_FWD', 'HELIUM_PRESSURIZATION', 'NTO_FEED'
    code VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    cleared BOOLEAN NOT NULL DEFAULT FALSE,
    cleared_at TIMESTAMPTZ,
    resolution_protocol TEXT
);

-- ------------------------------------------------------------------------------
-- Indexes for High-Velocity Telemetry Queries
-- ------------------------------------------------------------------------------
CREATE INDEX idx_missions_spaceplane_id ON missions(spaceplane_id);
CREATE INDEX idx_missions_status ON missions(flight_status);
CREATE INDEX idx_rcs_thrusters_spaceplane ON rcs_thrusters(spaceplane_id);
CREATE INDEX idx_rcs_thrusters_quad ON rcs_thrusters(quad_position);
CREATE INDEX idx_telemetry_mission_recorded ON propulsion_telemetry_logs(mission_id, recorded_at DESC);
CREATE INDEX idx_attitude_commands_mission ON attitude_commands(mission_id, issued_at DESC);
CREATE INDEX idx_anomaly_events_mission_severity ON anomaly_events(mission_id, severity, cleared);

-- ------------------------------------------------------------------------------
-- Institutional Row Level Security (RLS) Policy Declarations
-- ------------------------------------------------------------------------------
ALTER TABLE spaceplanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcs_thrusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE propulsion_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE attitude_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_events ENABLE ROW LEVEL SECURITY;

-- Default authenticated read/write operational policies
CREATE POLICY "spaceplanes_read_authenticated" ON spaceplanes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "spaceplanes_write_authenticated" ON spaceplanes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "missions_read_authenticated" ON missions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "missions_write_authenticated" ON missions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "rcs_thrusters_read_authenticated" ON rcs_thrusters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "rcs_thrusters_write_authenticated" ON rcs_thrusters
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "propulsion_telemetry_logs_read_authenticated" ON propulsion_telemetry_logs
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "propulsion_telemetry_logs_write_authenticated" ON propulsion_telemetry_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "attitude_commands_read_authenticated" ON attitude_commands
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "attitude_commands_write_authenticated" ON attitude_commands
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anomaly_events_read_authenticated" ON anomaly_events
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "anomaly_events_write_authenticated" ON anomaly_events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
