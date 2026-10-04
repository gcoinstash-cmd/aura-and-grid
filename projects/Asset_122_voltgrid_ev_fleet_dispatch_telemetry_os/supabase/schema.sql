-- ==============================================================================
-- Institutional EV Fleet Management & Charging Matrix DDL Schema
-- Aura & Grid Blueprint Artifact
-- ==============================================================================

-- 1. Fleet Depots & Grid Substations
CREATE TABLE IF NOT EXISTS public.fleets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_name VARCHAR(120) NOT NULL,
    substation_code VARCHAR(60) NOT NULL,
    metro_zone VARCHAR(80) NOT NULL,
    max_grid_capacity_kw INTEGER NOT NULL DEFAULT 1200,
    peak_throttle_limit_kw INTEGER NOT NULL DEFAULT 600,
    emergency_throttle_active BOOLEAN NOT NULL DEFAULT FALSE,
    baseload_kw INTEGER NOT NULL DEFAULT 48,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Commercial Fleet Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fleet_id UUID REFERENCES public.fleets(id) ON DELETE SET NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    callsign VARCHAR(60) NOT NULL,
    model VARCHAR(100) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_callsign VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'in_transit' CHECK (status IN ('in_transit', 'charging', 'idle', 'warning', 'rerouted', 'offline')),
    assigned_corridor VARCHAR(120) NOT NULL,
    battery_capacity_kwh NUMERIC(6, 2) NOT NULL DEFAULT 120.0,
    soc_pct NUMERIC(5, 2) NOT NULL DEFAULT 100.0 CHECK (soc_pct >= 0 AND soc_pct <= 100),
    range_mi INTEGER NOT NULL DEFAULT 200,
    speed_mph INTEGER NOT NULL DEFAULT 0,
    route_progress_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0 CHECK (route_progress_pct >= 0 AND route_progress_pct <= 100),
    parcel_capacity_pct INTEGER NOT NULL DEFAULT 0 CHECK (parcel_capacity_pct >= 0 AND parcel_capacity_pct <= 100),
    parcels_total INTEGER NOT NULL DEFAULT 0,
    parcels_remaining INTEGER NOT NULL DEFAULT 0,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    heading_deg INTEGER NOT NULL DEFAULT 0 CHECK (heading_deg >= 0 AND heading_deg <= 360),
    temp_motor_c NUMERIC(5, 2) NOT NULL DEFAULT 55.0,
    temp_pack_c NUMERIC(5, 2) NOT NULL DEFAULT 28.0,
    tire_fl_psi NUMERIC(4, 1) NOT NULL DEFAULT 42.0,
    tire_fr_psi NUMERIC(4, 1) NOT NULL DEFAULT 42.0,
    tire_rl_psi NUMERIC(4, 1) NOT NULL DEFAULT 45.0,
    tire_rr_psi NUMERIC(4, 1) NOT NULL DEFAULT 45.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DC Fast Charging Bays
CREATE TABLE IF NOT EXISTS public.charging_bays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fleet_id UUID NOT NULL REFERENCES public.fleets(id) ON DELETE CASCADE,
    bay_number VARCHAR(10) NOT NULL,
    bay_name VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'standby' CHECK (status IN ('charging', 'standby', 'maintenance', 'offline')),
    max_output_kw INTEGER NOT NULL DEFAULT 150,
    current_kw INTEGER NOT NULL DEFAULT 0,
    connected_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    vehicle_vin VARCHAR(17),
    vehicle_callsign VARCHAR(60),
    target_soc_pct NUMERIC(5, 2) NOT NULL DEFAULT 90.0,
    thermals_c NUMERIC(5, 2) NOT NULL DEFAULT 24.0,
    time_to_full_sec INTEGER NOT NULL DEFAULT 0,
    is_boosted BOOLEAN NOT NULL DEFAULT FALSE,
    is_surge_throttled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. In-Cab Delivery Stop Waypoints
CREATE TABLE IF NOT EXISTS public.delivery_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    stop_sequence INTEGER NOT NULL DEFAULT 1,
    stop_name VARCHAR(120) NOT NULL,
    street_address VARCHAR(200) NOT NULL,
    parcels_count INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    eta_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. High-Frequency Telemetry Ingest Logs
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    soc_pct NUMERIC(5, 2) NOT NULL,
    speed_mph INTEGER NOT NULL,
    motor_temp_c NUMERIC(5, 2) NOT NULL,
    pack_temp_c NUMERIC(5, 2) NOT NULL,
    cell_min_v NUMERIC(4, 3) NOT NULL,
    cell_max_v NUMERIC(4, 3) NOT NULL,
    kw_draw NUMERIC(6, 2) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL
);

-- 6. Emergency & Priority Reroute Dispatches
CREATE TABLE IF NOT EXISTS public.reroute_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    target_bay_id UUID REFERENCES public.charging_bays(id) ON DELETE SET NULL,
    dispatch_status VARCHAR(30) NOT NULL DEFAULT 'en_route' CHECK (dispatch_status IN ('pending', 'en_route', 'docked', 'cancelled')),
    reason VARCHAR(255) NOT NULL,
    dispatched_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_AUTOPILOT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_fleet_id ON public.vehicles(fleet_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_charging_bays_fleet_id ON public.charging_bays(fleet_id);
CREATE INDEX IF NOT EXISTS idx_charging_bays_status ON public.charging_bays(status);
CREATE INDEX IF NOT EXISTS idx_delivery_waypoints_vehicle_id ON public.delivery_waypoints(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_logs_vehicle_id_time ON public.telemetry_logs(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_reroute_dispatches_vehicle_id ON public.reroute_dispatches(vehicle_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.fleets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_bays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reroute_dispatches ENABLE ROW LEVEL SECURITY;

-- Institutional Authenticated Operator Policies
CREATE POLICY "Allow authenticated read on fleets"
    ON public.fleets FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated operators read vehicles"
    ON public.vehicles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated operators update vehicle telemetry"
    ON public.vehicles FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on charging bays"
    ON public.charging_bays FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow operators update charging bays"
    ON public.charging_bays FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on delivery waypoints"
    ON public.delivery_waypoints FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow telemetry ingest on telemetry logs"
    ON public.telemetry_logs FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated dispatches on reroutes"
    ON public.reroute_dispatches FOR ALL
    TO authenticated
    USING (true);
