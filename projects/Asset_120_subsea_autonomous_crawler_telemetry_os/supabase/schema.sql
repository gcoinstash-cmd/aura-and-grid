-- ====================================================================
-- AURA & GRID / GHOST FACTORY INSTITUTIONAL BLUEPRINT
-- Subsea Crawler Autonomous Mining Operations (Pacific Trench Sector 11B)
-- PostgreSQL DDL: Schema, Foreign Keys, Indexes, Row Level Security
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE mission_operational_status AS ENUM (
        'ACTIVE_HARVEST',
        'SURFACE_TRANSIT',
        'EMERGENCY_BALLAST_BLOW',
        'MAINTENANCE_STANDBY',
        'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waypoint_navigation_status AS ENUM (
        'COMPLETED',
        'CURRENT_TARGET',
        'SCHEDULED',
        'OBSTACLE_BYPASS'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE beacon_mesh_status AS ENUM (
        'LOCKED',
        'SYNCHRONIZING',
        'SIGNAL_DEGRADED',
        'OFFLINE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DEFINITION

-- Mission Master Record
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    sector_name VARCHAR(120) NOT NULL,
    crawler_designation VARCHAR(120) NOT NULL,
    target_depth_meters NUMERIC(8, 2) NOT NULL DEFAULT 4180.00,
    status mission_operational_status NOT NULL DEFAULT 'ACTIVE_HARVEST',
    ballast_armed BOOLEAN NOT NULL DEFAULT true,
    ballast_blown BOOLEAN NOT NULL DEFAULT false,
    hopper_capacity_tons NUMERIC(5, 2) NOT NULL DEFAULT 60.00,
    current_hopper_payload_tons NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    operator_callsign VARCHAR(80) NOT NULL DEFAULT 'ARCHITECT-01',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Continuous Abyssal Telemetry Stream
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    depth_meters NUMERIC(8, 2) NOT NULL,
    hydrostatic_pressure_mpa NUMERIC(6, 2) NOT NULL,
    sea_temp_celsius NUMERIC(5, 2) NOT NULL,
    salinity_psu NUMERIC(4, 2) NOT NULL DEFAULT 34.70,
    acoustic_ping_latency_ms INTEGER NOT NULL,
    primary_hydraulic_psi INTEGER NOT NULL,
    aux_hydraulic_psi INTEGER NOT NULL,
    nodule_intake_rate_tph NUMERIC(5, 2) NOT NULL,
    battery_reserves_kwh NUMERIC(7, 2) NOT NULL,
    power_consumption_kw NUMERIC(6, 2) NOT NULL,
    slurry_density_gpcm3 NUMERIC(4, 2) NOT NULL,
    track_magnetic_lock BOOLEAN NOT NULL DEFAULT false,
    purge_valve_active BOOLEAN NOT NULL DEFAULT false,
    heading_degrees NUMERIC(5, 2) NOT NULL DEFAULT 142.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sonar Bathymetry Waypoints & Traversal Grid
CREATE TABLE IF NOT EXISTS waypoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    waypoint_code VARCHAR(30) NOT NULL,
    coord_x_meters NUMERIC(8, 2) NOT NULL,
    coord_y_meters NUMERIC(8, 2) NOT NULL,
    bathymetry_depth_meters NUMERIC(8, 2) NOT NULL,
    nodule_density_grade VARCHAR(50) NOT NULL,
    estimated_cluster_yield_tons NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    status waypoint_navigation_status NOT NULL DEFAULT 'SCHEDULED',
    sequence_order INTEGER NOT NULL,
    standoff_obstacle_distance_m NUMERIC(6, 2) NOT NULL DEFAULT 15.00,
    geological_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seafloor Mineral Harvest Manifest
CREATE TABLE IF NOT EXISTS harvest_manifest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    lot_code VARCHAR(60) UNIQUE NOT NULL,
    mineral_class VARCHAR(100) NOT NULL,
    wet_weight_kg NUMERIC(8, 2) NOT NULL,
    dry_equivalent_kg NUMERIC(8, 2) NOT NULL,
    assay_mn_pct NUMERIC(5, 2) NOT NULL,
    assay_ni_pct NUMERIC(5, 2) NOT NULL,
    assay_co_pct NUMERIC(5, 2) NOT NULL,
    assay_cu_pct NUMERIC(5, 2) NOT NULL,
    extraction_zone VARCHAR(100) NOT NULL,
    hopper_bay_code VARCHAR(30) NOT NULL,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USBL / LBL Acoustic Beacon Mesh Network
CREATE TABLE IF NOT EXISTS acoustic_beacons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    beacon_tag VARCHAR(40) NOT NULL,
    transponder_freq_khz NUMERIC(6, 2) NOT NULL,
    signal_snr_db NUMERIC(5, 2) NOT NULL,
    battery_pct NUMERIC(5, 2) NOT NULL,
    sync_drift_microsec NUMERIC(8, 2) NOT NULL,
    seafloor_fix_latitude NUMERIC(10, 6) NOT NULL,
    seafloor_fix_longitude NUMERIC(10, 6) NOT NULL,
    location_descriptor VARCHAR(120) NOT NULL,
    mesh_status beacon_mesh_status NOT NULL DEFAULT 'LOCKED',
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6-Axis Heavy Excavator Robotic Arm Telemetry
CREATE TABLE IF NOT EXISTS robotic_arm_diagnostics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    base_yaw_deg NUMERIC(6, 2) NOT NULL,
    boom_pitch_deg NUMERIC(6, 2) NOT NULL,
    stick_pitch_deg NUMERIC(6, 2) NOT NULL,
    wrist_roll_deg NUMERIC(6, 2) NOT NULL,
    wrist_pitch_deg NUMERIC(6, 2) NOT NULL,
    gripper_clamp_kn NUMERIC(6, 2) NOT NULL,
    hydraulic_circuit_temp_celsius NUMERIC(5, 2) NOT NULL,
    suction_depression_kpa NUMERIC(6, 2) NOT NULL,
    active_kinematic_pose VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_telemetry_mission_recorded ON telemetry_logs (mission_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_waypoints_mission_seq ON waypoints (mission_id, sequence_order ASC);
CREATE INDEX IF NOT EXISTS idx_manifest_mission_logged ON harvest_manifest (mission_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_beacons_mission_tag ON acoustic_beacons (mission_id, beacon_tag);
CREATE INDEX IF NOT EXISTS idx_arm_mission_created ON robotic_arm_diagnostics (mission_id, created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE acoustic_beacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE robotic_arm_diagnostics ENABLE ROW LEVEL SECURITY;

-- Institutional Permissive Service Read & Operator Insert Policies
CREATE POLICY "Allow public read access on missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on telemetry_logs" ON telemetry_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on waypoints" ON waypoints FOR SELECT USING (true);
CREATE POLICY "Allow public read access on harvest_manifest" ON harvest_manifest FOR SELECT USING (true);
CREATE POLICY "Allow public read access on acoustic_beacons" ON acoustic_beacons FOR SELECT USING (true);
CREATE POLICY "Allow public read access on robotic_arm_diagnostics" ON robotic_arm_diagnostics FOR SELECT USING (true);

CREATE POLICY "Allow operator mutation on missions" ON missions FOR ALL USING (true);
CREATE POLICY "Allow operator mutation on telemetry_logs" ON telemetry_logs FOR ALL USING (true);
CREATE POLICY "Allow operator mutation on waypoints" ON waypoints FOR ALL USING (true);
CREATE POLICY "Allow operator mutation on harvest_manifest" ON harvest_manifest FOR ALL USING (true);
CREATE POLICY "Allow operator mutation on acoustic_beacons" ON acoustic_beacons FOR ALL USING (true);
CREATE POLICY "Allow operator mutation on robotic_arm_diagnostics" ON robotic_arm_diagnostics FOR ALL USING (true);
