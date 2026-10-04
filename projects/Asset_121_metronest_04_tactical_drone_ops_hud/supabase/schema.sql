-- ==============================================================================
-- DRONE NEST OPERATIONS (METRONEST-04 DELTA) DATABASE SCHEMA
-- PostgreSQL DDL for Autonomous Verti-Hub Airspace & Bay Operations
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. DRONE NEST HUBS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drone_nest_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_code VARCHAR(50) NOT NULL UNIQUE,
    callsign VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    elevation_meters NUMERIC(6, 2) NOT NULL DEFAULT 42.50,
    status VARCHAR(30) NOT NULL DEFAULT 'operational',
    ground_hold_active BOOLEAN NOT NULL DEFAULT false,
    mesh_network_id VARCHAR(50) NOT NULL DEFAULT 'MESH-5G-DELTA-04',
    mesh_latency_ms NUMERIC(5, 2) NOT NULL DEFAULT 4.20,
    mesh_signal_rssi_dbm INTEGER NOT NULL DEFAULT -58,
    active_peers INTEGER NOT NULL DEFAULT 14,
    total_sorties_today INTEGER NOT NULL DEFAULT 142,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. LANDING PADS TABLE (Automated Charging & Bay Telemetry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS landing_pads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id UUID NOT NULL REFERENCES drone_nest_hubs(id) ON DELETE CASCADE,
    pad_code VARCHAR(20) NOT NULL,
    bay_number INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Clear', -- 'Occupied', 'Swapping', 'Charging', 'Clear'
    charger_output_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    max_charge_rate_kw NUMERIC(6, 2) NOT NULL DEFAULT 45.00,
    temperature_celsius NUMERIC(5, 2) NOT NULL DEFAULT 24.50,
    latch_status VARCHAR(30) NOT NULL DEFAULT 'Secure', -- 'Locked', 'Releasing', 'Empty', 'Secure', 'Thermal Lock Active'
    assigned_drone_callsign VARCHAR(50),
    swap_progress_percent NUMERIC(5, 2) DEFAULT 0.00,
    ils_beacon_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_hub_pad UNIQUE (hub_id, pad_code)
);

-- ------------------------------------------------------------------------------
-- 3. DRONES TABLE (Fleet Telemetry & Flight State)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    callsign VARCHAR(50) NOT NULL UNIQUE,
    model_name VARCHAR(100) NOT NULL,
    firmware_version VARCHAR(30) NOT NULL DEFAULT 'v4.19.2-TACTICAL',
    flight_status VARCHAR(30) NOT NULL DEFAULT 'in_flight', -- 'in_flight', 'docked', 'charging', 'maintenance', 'diverted', 'holding'
    battery_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    battery_health_percentage NUMERIC(5, 2) NOT NULL DEFAULT 98.50,
    current_latitude NUMERIC(10, 6) NOT NULL,
    current_longitude NUMERIC(10, 6) NOT NULL,
    altitude_feet NUMERIC(7, 2) NOT NULL DEFAULT 400.00,
    airspeed_knots NUMERIC(6, 2) NOT NULL DEFAULT 45.00,
    heading_degrees NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    target_pad_id UUID REFERENCES landing_pads(id) ON DELETE SET NULL,
    flight_hours_total NUMERIC(8, 2) NOT NULL DEFAULT 128.40,
    motor_temperature_celsius NUMERIC(5, 2) NOT NULL DEFAULT 36.20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. DELIVERY MANIFESTS TABLE (Cargo, Priority, Sector, & Corridors)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    drone_id UUID REFERENCES drones(id) ON DELETE SET NULL,
    priority_tier VARCHAR(40) NOT NULL, -- 'Cold-Chain Medical', 'Rush Express', 'Standard Cargo'
    cargo_description TEXT NOT NULL,
    payload_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 2.50,
    target_temperature_celsius NUMERIC(5, 2),
    actual_temperature_celsius NUMERIC(5, 2),
    origin_hub_id UUID NOT NULL REFERENCES drone_nest_hubs(id) ON DELETE CASCADE,
    origin_sector VARCHAR(50) NOT NULL DEFAULT 'MetroNest-04 Delta',
    destination_sector VARCHAR(50) NOT NULL,
    corridor_assigned VARCHAR(100) NOT NULL,
    estimated_arrival_minutes INTEGER NOT NULL DEFAULT 12,
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'in_transit', -- 'in_transit', 'docked', 'queued', 'diverted', 'delivered', 'aborted'
    departure_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 5. AIRSPACE HAZARD ZONES TABLE (Dynamic Weather & Obstacle Exclusions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS airspace_hazard_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id UUID NOT NULL REFERENCES drone_nest_hubs(id) ON DELETE CASCADE,
    zone_code VARCHAR(50) NOT NULL UNIQUE,
    hazard_title VARCHAR(100) NOT NULL,
    hazard_type VARCHAR(50) NOT NULL, -- 'Microburst Shear', 'Downdraft Turbulence', 'Electromagnetic Interference', 'Restricted Crane Operation'
    severity_level VARCHAR(20) NOT NULL DEFAULT 'moderate', -- 'advisory', 'moderate', 'severe', 'critical'
    azimuth_bearing_deg NUMERIC(5, 2) NOT NULL,
    center_distance_km NUMERIC(5, 2) NOT NULL,
    radius_km NUMERIC(5, 2) NOT NULL DEFAULT 2.50,
    wind_speed_knots NUMERIC(5, 2) DEFAULT 32.00,
    altitude_ceiling_feet NUMERIC(7, 2) DEFAULT 800.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. TACTICAL TELEMETRY LOGS TABLE (Time-series audit events)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tactical_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id UUID NOT NULL REFERENCES drone_nest_hubs(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_landing_pads_hub ON landing_pads(hub_id);
CREATE INDEX IF NOT EXISTS idx_landing_pads_status ON landing_pads(status);
CREATE INDEX IF NOT EXISTS idx_drones_status ON drones(flight_status);
CREATE INDEX IF NOT EXISTS idx_drones_callsign ON drones(callsign);
CREATE INDEX IF NOT EXISTS idx_manifests_drone ON delivery_manifests(drone_id);
CREATE INDEX IF NOT EXISTS idx_manifests_status ON delivery_manifests(delivery_status);
CREATE INDEX IF NOT EXISTS idx_manifests_priority ON delivery_manifests(priority_tier);
CREATE INDEX IF NOT EXISTS idx_hazard_zones_active ON airspace_hazard_zones(is_active);
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_hub_time ON tactical_telemetry_logs(hub_id, recorded_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (Mandatory institutional security)
-- ------------------------------------------------------------------------------
ALTER TABLE drone_nest_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drones ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE airspace_hazard_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactical_telemetry_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous/Authenticated Read Policies for Mission Control HUD
CREATE POLICY "Allow public read access to hubs" ON drone_nest_hubs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pads" ON landing_pads FOR SELECT USING (true);
CREATE POLICY "Allow public read access to drones" ON drones FOR SELECT USING (true);
CREATE POLICY "Allow public read access to delivery manifests" ON delivery_manifests FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hazard zones" ON airspace_hazard_zones FOR SELECT USING (true);
CREATE POLICY "Allow public read access to telemetry logs" ON tactical_telemetry_logs FOR SELECT USING (true);
