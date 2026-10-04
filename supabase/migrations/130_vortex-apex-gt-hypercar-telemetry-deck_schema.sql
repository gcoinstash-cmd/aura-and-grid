-- VORTEX APEX-GT HYPERCAR PROTO-09 TELEMETRY PLATFORM
-- Institutional PostgreSQL Schema with 5 Relational Tables, RLS, and Indexes

-- 1. HYPERCAR VEHICLES REGISTRY
CREATE TABLE IF NOT EXISTS hypercar_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chassis_code VARCHAR(64) UNIQUE NOT NULL,
    vehicle_designation VARCHAR(128) NOT NULL,
    powertrain_architecture VARCHAR(64) NOT NULL DEFAULT 'QUAD_AXIAL_FLUX_900V_SIC',
    battery_chemistry VARCHAR(64) NOT NULL DEFAULT 'SOLID_STATE_LI_METAL',
    nominal_pack_capacity_kwh NUMERIC(6, 2) NOT NULL DEFAULT 95.00,
    peak_system_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 1450.00,
    peak_horsepower NUMERIC(6, 1) NOT NULL DEFAULT 1944.0,
    dry_mass_kg NUMERIC(6, 2) NOT NULL DEFAULT 1340.00,
    drag_coefficient_cd NUMERIC(4, 3) NOT NULL DEFAULT 0.315,
    max_downforce_kg NUMERIC(6, 2) NOT NULL DEFAULT 1120.00,
    inverter_architecture VARCHAR(64) NOT NULL DEFAULT '900V_SILICON_CARBIDE',
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_TRACK_STINT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TELEMETRY SNAPSHOTS (HIGH FREQUENCY TELEMETRY STREAM)
CREATE TABLE IF NOT EXISTS telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES hypercar_vehicles(id) ON DELETE CASCADE,
    ground_speed_kmh NUMERIC(6, 2) NOT NULL,
    total_power_output_kw NUMERIC(6, 2) NOT NULL,
    inverter_temp_celsius NUMERIC(5, 2) NOT NULL,
    downforce_kg NUMERIC(6, 2) NOT NULL,
    regen_braking_harvest_kw NUMERIC(6, 2) NOT NULL,
    drs_overdrive_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    aero_wing_angle_deg NUMERIC(4, 1) NOT NULL DEFAULT 24.0,
    g_force_lateral NUMERIC(4, 2) NOT NULL,
    g_force_longitudinal NUMERIC(4, 2) NOT NULL,
    battery_soc_pct NUMERIC(5, 2) NOT NULL DEFAULT 88.4,
    cell_delta_mv NUMERIC(5, 2) NOT NULL DEFAULT 3.8,
    coolant_flow_rate_lpm NUMERIC(5, 2) NOT NULL DEFAULT 42.0,
    drive_mode VARCHAR(32) NOT NULL DEFAULT 'PURE_TRACK',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MOTOR TORQUE LOGS (QUAD AXIAL-FLUX MOTOR VECTORING)
CREATE TABLE IF NOT EXISTS motor_torque_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES hypercar_vehicles(id) ON DELETE CASCADE,
    motor_position VARCHAR(16) NOT NULL CHECK (motor_position IN ('FRONT_LEFT', 'FRONT_RIGHT', 'REAR_LEFT', 'REAR_RIGHT')),
    torque_split_nm NUMERIC(6, 2) NOT NULL,
    wheel_speed_rpm INT NOT NULL,
    inverter_temp_celsius NUMERIC(5, 2) NOT NULL,
    thermal_threshold_pct NUMERIC(5, 2) NOT NULL,
    slip_ratio_pct NUMERIC(4, 2) NOT NULL DEFAULT 1.2,
    efficiency_pct NUMERIC(5, 2) NOT NULL DEFAULT 96.8,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LAP SECTOR RECORDS (ENDURANCE TIMING & BRAKE THERMAL LEDGER)
CREATE TABLE IF NOT EXISTS lap_sector_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES hypercar_vehicles(id) ON DELETE CASCADE,
    stint_identifier VARCHAR(64) NOT NULL,
    lap_number INT NOT NULL,
    sector_number INT NOT NULL CHECK (sector_number BETWEEN 1 AND 3),
    sector_time_seconds NUMERIC(6, 3) NOT NULL,
    delta_to_reference_seconds NUMERIC(6, 3) NOT NULL,
    apex_speed_kmh NUMERIC(5, 2) NOT NULL,
    energy_consumption_kwh_per_km NUMERIC(5, 3) NOT NULL,
    fl_rotor_temp_celsius NUMERIC(5, 1) NOT NULL,
    fr_rotor_temp_celsius NUMERIC(5, 1) NOT NULL,
    rl_rotor_temp_celsius NUMERIC(5, 1) NOT NULL,
    rr_rotor_temp_celsius NUMERIC(5, 1) NOT NULL,
    tire_pressure_kpa NUMERIC(5, 1) NOT NULL DEFAULT 205.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DRIVER EVENT LOGS (DIAGNOSTICS & SYSTEM ANOMALIES)
CREATE TABLE IF NOT EXISTS driver_event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES hypercar_vehicles(id) ON DELETE CASCADE,
    event_category VARCHAR(64) NOT NULL,
    event_name VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'ADVISORY', 'WARNING', 'CRITICAL')),
    metric_value VARCHAR(64) NOT NULL,
    diagnostic_details TEXT,
    system_subsystem VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PERFORMANCE INDEXES (Optimized for vehicle_id and recorded_at)
CREATE INDEX IF NOT EXISTS idx_telemetry_snapshots_vehicle_recorded ON telemetry_snapshots(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_motor_torque_logs_vehicle_recorded ON motor_torque_logs(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_lap_sector_records_vehicle_recorded ON lap_sector_records(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_event_logs_vehicle_recorded ON driver_event_logs(vehicle_id, recorded_at DESC);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE motor_torque_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lap_sector_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_event_logs ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE PUBLIC READ / SERVICE ROLE WRITE POLICIES
CREATE POLICY "Public read hypercar_vehicles" ON hypercar_vehicles FOR SELECT TO public USING (true);
CREATE POLICY "Public read telemetry_snapshots" ON telemetry_snapshots FOR SELECT TO public USING (true);
CREATE POLICY "Public read motor_torque_logs" ON motor_torque_logs FOR SELECT TO public USING (true);
CREATE POLICY "Public read lap_sector_records" ON lap_sector_records FOR SELECT TO public USING (true);
CREATE POLICY "Public read driver_event_logs" ON driver_event_logs FOR SELECT TO public USING (true);

CREATE POLICY "Service write hypercar_vehicles" ON hypercar_vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service write telemetry_snapshots" ON telemetry_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service write motor_torque_logs" ON motor_torque_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service write lap_sector_records" ON lap_sector_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service write driver_event_logs" ON driver_event_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
