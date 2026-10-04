-- =============================================================================
-- AEGIS-SWARM PERIMETER DEFENSE COMMAND
-- Database Schema: PostgreSQL / Supabase
-- Operational Perimeter Telemetry, Drone Swarm Mesh, Electronic Warfare & Engagements
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. DEFENSE SECTORS & PERIMETER GEOFENCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.defense_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_code VARCHAR(32) NOT NULL UNIQUE,
    sector_name VARCHAR(128) NOT NULL,
    threat_level VARCHAR(32) NOT NULL DEFAULT 'DEFCON 3',
    inner_exclusion_radius_m NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
    buffer_zone_radius_m NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    outer_perimeter_radius_m NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    active_bogeys_count INTEGER NOT NULL DEFAULT 0,
    airborne_nodes_count INTEGER NOT NULL DEFAULT 16,
    master_arm_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on threat level & sector code
CREATE INDEX IF NOT EXISTS idx_defense_sectors_code ON public.defense_sectors (sector_code);
CREATE INDEX IF NOT EXISTS idx_defense_sectors_threat ON public.defense_sectors (threat_level);

-- -----------------------------------------------------------------------------
-- 2. SWARM AUTONOMOUS PATROL NODES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.swarm_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.defense_sectors(id) ON DELETE CASCADE,
    node_identifier VARCHAR(32) NOT NULL UNIQUE, -- e.g. 'SWARM-01'
    callsign VARCHAR(64) NOT NULL,              -- e.g. 'Aegis Vector 1'
    operational_status VARCHAR(48) NOT NULL DEFAULT 'AIRBORNE // PATROL',
    -- Telemetry
    altitude_m_agl NUMERIC(8, 2) NOT NULL DEFAULT 240.00,
    airspeed_knots NUMERIC(8, 2) NOT NULL DEFAULT 65.00,
    battery_percentage NUMERIC(5, 2) NOT NULL DEFAULT 92.50,
    battery_runtime_min INTEGER NOT NULL DEFAULT 45,
    payload_mode VARCHAR(64) NOT NULL DEFAULT 'EO/IR Optical', -- 'EO/IR Optical', 'RF Jammer', 'Kinetic Net', 'LIDAR Recon'
    heading_degrees NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    pos_x_m NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Local coordinate frame (relative to HUB)
    pos_y_m NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sensor_fov_deg NUMERIC(5, 2) NOT NULL DEFAULT 75.00,
    target_lock_id VARCHAR(64),
    mesh_signal_snr_db NUMERIC(5, 2) NOT NULL DEFAULT 34.20,
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_swarm_nodes_identifier ON public.swarm_nodes (node_identifier);
CREATE INDEX IF NOT EXISTS idx_swarm_nodes_status ON public.swarm_nodes (operational_status);
CREATE INDEX IF NOT EXISTS idx_swarm_nodes_battery ON public.swarm_nodes (battery_percentage);

-- -----------------------------------------------------------------------------
-- 3. RADAR CONTACTS & UNIDENTIFIED BOGEYS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.radar_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.defense_sectors(id) ON DELETE CASCADE,
    contact_code VARCHAR(48) NOT NULL UNIQUE, -- e.g. 'BOGEY-ALPHA'
    transponder_code VARCHAR(64) NOT NULL DEFAULT 'UNKNOWN // NONE',
    threat_tier VARCHAR(32) NOT NULL DEFAULT 'ELEVATED', -- 'MONITOR', 'ELEVATED', 'CRITICAL', 'HOSTILE'
    classification VARCHAR(64) NOT NULL DEFAULT 'Unmanned Aerial Incursion',
    estimated_speed_knots NUMERIC(8, 2) NOT NULL DEFAULT 145.00,
    heading_degrees NUMERIC(5, 2) NOT NULL DEFAULT 135.00,
    current_range_m NUMERIC(10, 2) NOT NULL DEFAULT 7400.00,
    altitude_m_agl NUMERIC(8, 2) NOT NULL DEFAULT 320.00,
    time_to_breach_sec INTEGER NOT NULL DEFAULT 164,
    status VARCHAR(32) NOT NULL DEFAULT 'INBOUND', -- 'INBOUND', 'INTERCEPTING', 'CONTAINED', 'NEUTRALIZED'
    assigned_interceptor_id UUID REFERENCES public.swarm_nodes(id) ON DELETE SET NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_radar_contacts_code ON public.radar_contacts (contact_code);
CREATE INDEX IF NOT EXISTS idx_radar_contacts_status ON public.radar_contacts (status);
CREATE INDEX IF NOT EXISTS idx_radar_contacts_range ON public.radar_contacts (current_range_m);

-- -----------------------------------------------------------------------------
-- 4. ELECTRONIC WARFARE (EW) SPECTRUM BANDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ew_spectrum_bands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.defense_sectors(id) ON DELETE CASCADE,
    band_name VARCHAR(64) NOT NULL, -- '2.4 GHz ISM', '5.8 GHz Downlink', 'GNSS L1/L2'
    center_freq_mhz NUMERIC(10, 2) NOT NULL,
    noise_floor_dbm NUMERIC(6, 2) NOT NULL DEFAULT -95.00,
    peak_signal_dbm NUMERIC(6, 2) NOT NULL DEFAULT -42.00,
    jamming_detected BOOLEAN NOT NULL DEFAULT FALSE,
    jamming_type VARCHAR(64) NOT NULL DEFAULT 'NONE', -- 'CHIRP SWEEP', 'DIRECT TONE', 'NOISE BARRAGE'
    countermeasure_active BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ew_spectrum_band_name ON public.ew_spectrum_bands (band_name);

-- -----------------------------------------------------------------------------
-- 5. DIRECTED ENERGY & HIGH-POWER MICROWAVE (HPM) EMITTERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hpm_emitters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.defense_sectors(id) ON DELETE CASCADE,
    emitter_identifier VARCHAR(64) NOT NULL UNIQUE,
    power_kw NUMERIC(8, 2) NOT NULL DEFAULT 120.00,
    capacitor_charge_pct NUMERIC(5, 2) NOT NULL DEFAULT 94.50,
    gimbal_azimuth_deg NUMERIC(6, 2) NOT NULL DEFAULT 284.50,
    gimbal_elevation_deg NUMERIC(5, 2) NOT NULL DEFAULT 32.80,
    system_temperature_c NUMERIC(5, 2) NOT NULL DEFAULT 42.10,
    coolant_pressure_bar NUMERIC(5, 2) NOT NULL DEFAULT 6.40,
    emitter_status VARCHAR(48) NOT NULL DEFAULT 'STANDBY // ARMED',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. INTERCEPT ENGAGEMENT LEDGER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.intercept_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES public.defense_sectors(id) ON DELETE CASCADE,
    node_id UUID REFERENCES public.swarm_nodes(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES public.radar_contacts(id) ON DELETE SET NULL,
    countermeasure_type VARCHAR(64) NOT NULL, -- 'KINETIC_NET', 'HPM_DIRECTED_ENERGY', 'RF_DOWNLINK_DISRUPT', 'AERO_SHADOW'
    authorization_tier VARCHAR(48) NOT NULL DEFAULT 'COMMANDER_KEY_VERIFIED',
    authorized_by VARCHAR(64) NOT NULL DEFAULT 'OPERATOR // DEF-06-ALPHA',
    engagement_status VARCHAR(48) NOT NULL DEFAULT 'COMPLETED', -- 'PENDING', 'IN_FLIGHT', 'COMPLETED', 'ABORTED'
    initial_target_range_m NUMERIC(10, 2) NOT NULL,
    outcome VARCHAR(64) NOT NULL, -- 'TARGET_CONTAINED', 'PROPULSION_DISABLED', 'LINK_SEVERED_FORCED_LAND'
    telemetry_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_engagements_status ON public.intercept_engagements (engagement_status);
CREATE INDEX IF NOT EXISTS idx_engagements_created_at ON public.intercept_engagements (created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.defense_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ew_spectrum_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpm_emitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercept_engagements ENABLE ROW LEVEL SECURITY;

-- Institutional Authenticated Operator Policies
CREATE POLICY "Allow authenticated read on defense_sectors"
    ON public.defense_sectors FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated update on defense_sectors"
    ON public.defense_sectors FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on swarm_nodes"
    ON public.swarm_nodes FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated manage on swarm_nodes"
    ON public.swarm_nodes FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on radar_contacts"
    ON public.radar_contacts FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated manage on radar_contacts"
    ON public.radar_contacts FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on ew_spectrum_bands"
    ON public.ew_spectrum_bands FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated read on hpm_emitters"
    ON public.hpm_emitters FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated read on intercept_engagements"
    ON public.intercept_engagements FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow authenticated insert on intercept_engagements"
    ON public.intercept_engagements FOR INSERT
    TO authenticated
    WITH CHECK (true);
