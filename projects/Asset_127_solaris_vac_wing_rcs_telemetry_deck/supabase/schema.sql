-- ====================================================================
-- SOLARIS VAC-WING PROTO-12 // COLD-GAS RCS HYPERCAR TELEMETRY SCHEMA
-- PostgreSQL / Supabase Institutional Telemetry Blueprint
-- ====================================================================

-- 1. VEHICLE REGISTRY TABLE
CREATE TABLE IF NOT EXISTS rcs_hypercar_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chassis_code VARCHAR(32) UNIQUE NOT NULL,
    vehicle_name VARCHAR(128) NOT NULL,
    model_generation VARCHAR(64) NOT NULL,
    max_drive_power_kw NUMERIC(8,2) NOT NULL DEFAULT 1640.00,
    dry_mass_kg NUMERIC(8,2) NOT NULL DEFAULT 1280.00,
    nitrogen_tank_capacity_kg NUMERIC(6,2) NOT NULL DEFAULT 22.00,
    max_storage_pressure_bar NUMERIC(6,2) NOT NULL DEFAULT 350.00,
    nozzle_count INT NOT NULL DEFAULT 8,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TELEMETRY SNAPSHOTS TABLE (High frequency vehicle kinematics)
CREATE TABLE IF NOT EXISTS thruster_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES rcs_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ground_speed_kmh NUMERIC(6,2) NOT NULL,
    drive_power_kw NUMERIC(8,2) NOT NULL,
    lateral_g NUMERIC(5,2) NOT NULL,
    longitudinal_g NUMERIC(5,2) NOT NULL,
    vertical_g NUMERIC(5,2) NOT NULL,
    total_thruster_thrust_kn NUMERIC(6,2) NOT NULL,
    nitrogen_mass_kg NUMERIC(6,2) NOT NULL,
    nitrogen_pressure_bar NUMERIC(6,2) NOT NULL,
    battery_temp_celsius NUMERIC(5,2) NOT NULL,
    inverter_output_voltage NUMERIC(6,2) NOT NULL,
    telemetry_mode VARCHAR(64) NOT NULL DEFAULT 'ORBITAL VECTORING',
    slip_counter_active BOOLEAN NOT NULL DEFAULT true,
    active_nozzle_mask VARCHAR(16) NOT NULL DEFAULT '11111111'
);

-- 3. NITROGEN PNEUMATIC BUFFER & GAS LOGS TABLE
CREATE TABLE IF NOT EXISTS nitrogen_gas_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES rcs_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tank_pressure_bar NUMERIC(6,2) NOT NULL,
    buffer_pressure_bar NUMERIC(6,2) NOT NULL,
    gas_temp_celsius NUMERIC(5,2) NOT NULL,
    mass_flow_rate_gps NUMERIC(6,2) NOT NULL,
    compressor_state VARCHAR(32) NOT NULL,
    compressor_power_draw_kw NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    valve_cycle_duty_pct NUMERIC(5,2) NOT NULL,
    cumulative_gas_used_kg NUMERIC(6,2) NOT NULL
);

-- 4. LAP SECTOR DYNAMICS & THRUSTER ACTUATION TABLE
CREATE TABLE IF NOT EXISTS sector_dynamics_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES rcs_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lap_number INT NOT NULL DEFAULT 1,
    sector_number INT NOT NULL,
    sector_name VARCHAR(64) NOT NULL,
    entry_speed_kmh NUMERIC(6,2) NOT NULL,
    apex_speed_kmh NUMERIC(6,2) NOT NULL,
    exit_speed_kmh NUMERIC(6,2) NOT NULL,
    peak_lateral_g NUMERIC(5,2) NOT NULL,
    gas_mass_used_grams NUMERIC(6,2) NOT NULL,
    downforce_delta_kg NUMERIC(6,2) NOT NULL,
    compressor_recharge_status VARCHAR(64) NOT NULL
);

-- 5. DIAGNOSTIC EVENTS & CONTROL LOGS TABLE
CREATE TABLE IF NOT EXISTS rcs_diagnostic_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES rcs_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'INFO',
    nozzle_id VARCHAR(32),
    impulse_duration_ms INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL
);

-- ====================================================================
-- INDEXES FOR TEMPORAL AND KINEMATIC AGGREGATIONS
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_thruster_telemetry_veh_time 
    ON thruster_telemetry_snapshots (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_nitrogen_gas_veh_time 
    ON nitrogen_gas_logs (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_sector_dynamics_veh_time 
    ON sector_dynamics_records (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_rcs_diagnostic_veh_time 
    ON rcs_diagnostic_events (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_sector_lookup 
    ON sector_dynamics_records (vehicle_id, lap_number, sector_number);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE rcs_hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE thruster_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE nitrogen_gas_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_dynamics_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcs_diagnostic_events ENABLE ROW LEVEL SECURITY;

-- Permissive public read policies for live dashboard streaming
CREATE POLICY "Allow public read access on rcs_hypercar_vehicles" 
    ON rcs_hypercar_vehicles FOR SELECT USING (true);

CREATE POLICY "Allow public read access on thruster_telemetry_snapshots" 
    ON thruster_telemetry_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow public read access on nitrogen_gas_logs" 
    ON nitrogen_gas_logs FOR SELECT USING (true);

CREATE POLICY "Allow public read access on sector_dynamics_records" 
    ON sector_dynamics_records FOR SELECT USING (true);

CREATE POLICY "Allow public read access on rcs_diagnostic_events" 
    ON rcs_diagnostic_events FOR SELECT USING (true);

-- Institutional service role write policies
CREATE POLICY "Allow service role write on rcs_hypercar_vehicles" 
    ON rcs_hypercar_vehicles FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on thruster_telemetry_snapshots" 
    ON thruster_telemetry_snapshots FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on nitrogen_gas_logs" 
    ON nitrogen_gas_logs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on sector_dynamics_records" 
    ON sector_dynamics_records FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write on rcs_diagnostic_events" 
    ON rcs_diagnostic_events FOR ALL USING (auth.role() = 'service_role');
