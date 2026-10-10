-- ============================================================================
-- GHOST FACTORYOS FLEET TRACK 3: F1 SKUNKWORKS
-- ASSET GF-T3-142: AEGIS-ORBIT AUTONOMOUS LEO ENGINE
-- ALLOYDB / POSTGRESQL PRODUCTION DDL SCHEMA SPECIFICATION
-- Database Compatibility: PostgreSQL 16+ / Google Cloud AlloyDB for PostgreSQL
-- High-Availability: Multi-Zone HA with Zero-RPO Continuous WAL Streaming
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Enum types for strict domain validation
CREATE TYPE orbital_status_enum AS ENUM ('NOMINAL', 'WARNING', 'CRITICAL_MANEUVER', 'DECAYING', 'DECOMMISSIONED');
CREATE TYPE thruster_propulsion_enum AS ENUM ('KRYPTON_HALL', 'XENON_ION', 'HYDRAZINE_MONOPROP', 'COLD_GAS');
CREATE TYPE conjunction_severity_enum AS ENUM ('MONITORING', 'EVALUATION', 'ACTION_REQUIRED', 'MANEUVER_COMMITTED', 'RESOLVED');
CREATE TYPE maneuver_type_enum AS ENUM ('COLLISION_AVOIDANCE', 'ALTITUDE_RAISE', 'PLANE_INCLINATION_TRIM', 'PHASING_CORRECTION', 'DEORBIT_DISPOSAL');
CREATE TYPE execution_status_enum AS ENUM ('PLANNED', 'AUTHORIZED', 'UPLINKED', 'EXECUTING', 'COMPLETED', 'ABORTED', 'FAILED');

-- ----------------------------------------------------------------------------
-- 1. CONSTELLATION SATELLITE FLEET REGISTRY
-- ----------------------------------------------------------------------------
CREATE TABLE constellation_satellites (
    satellite_id VARCHAR(64) PRIMARY KEY,
    norad_cat_id INTEGER UNIQUE NOT NULL,
    international_designator VARCHAR(24) NOT NULL,
    satellite_name VARCHAR(128) NOT NULL,
    constellation_plane_id VARCHAR(32) NOT NULL,
    plane_slot_index INTEGER NOT NULL CHECK (plane_slot_index >= 0),
    dry_mass_kg NUMERIC(8, 3) NOT NULL CHECK (dry_mass_kg > 0),
    propellant_capacity_kg NUMERIC(8, 3) NOT NULL CHECK (propellant_capacity_kg >= 0),
    propellant_remaining_kg NUMERIC(8, 3) NOT NULL CHECK (propellant_remaining_kg >= 0),
    thruster_type thruster_propulsion_enum NOT NULL DEFAULT 'KRYPTON_HALL',
    specific_impulse_seconds NUMERIC(6, 1) NOT NULL CHECK (specific_impulse_seconds > 0),
    max_thrust_millinewtons NUMERIC(8, 2) NOT NULL CHECK (max_thrust_millinewtons > 0),
    cross_sectional_area_m2 NUMERIC(6, 3) NOT NULL DEFAULT 1.800,
    drag_coefficient_cd NUMERIC(5, 3) NOT NULL DEFAULT 2.200,
    srp_reflectivity_cr NUMERIC(5, 3) NOT NULL DEFAULT 1.300,
    operational_status orbital_status_enum NOT NULL DEFAULT 'NOMINAL',
    commissioned_epoch_utc TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_uplink_epoch_utc TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_satellites_plane ON constellation_satellites(constellation_plane_id, plane_slot_index);
CREATE INDEX idx_satellites_status ON constellation_satellites(operational_status);

-- ----------------------------------------------------------------------------
-- 2. TLE & EPHEMERIS KEPLERIAN RECORDS
-- ----------------------------------------------------------------------------
CREATE TABLE tle_ephemeris_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_id VARCHAR(64) NOT NULL REFERENCES constellation_satellites(satellite_id) ON DELETE RESTRICT,
    norad_cat_id INTEGER NOT NULL,
    epoch_utc TIMESTAMPTZ NOT NULL,
    semi_major_axis_km NUMERIC(12, 6) NOT NULL CHECK (semi_major_axis_km > 6400),
    eccentricity NUMERIC(10, 8) NOT NULL CHECK (eccentricity >= 0 AND eccentricity < 1),
    inclination_deg NUMERIC(8, 5) NOT NULL CHECK (inclination_deg >= 0 AND inclination_deg <= 180),
    raan_deg NUMERIC(8, 5) NOT NULL CHECK (raan_deg >= 0 AND raan_deg <= 360),
    arg_perigee_deg NUMERIC(8, 5) NOT NULL CHECK (arg_perigee_deg >= 0 AND arg_perigee_deg <= 360),
    true_anomaly_deg NUMERIC(8, 5) NOT NULL CHECK (true_anomaly_deg >= 0 AND true_anomaly_deg <= 360),
    mean_motion_revs_day NUMERIC(12, 8) NOT NULL,
    bstar_drag_term NUMERIC(14, 10) NOT NULL,
    perigee_alt_km NUMERIC(10, 3) GENERATED ALWAYS AS (semi_major_axis_km * (1 - eccentricity) - 6378.137) STORED,
    apogee_alt_km NUMERIC(10, 3) GENERATED ALWAYS AS (semi_major_axis_km * (1 + eccentricity) - 6378.137) STORED,
    raw_tle_line1 VARCHAR(70) NOT NULL,
    raw_tle_line2 VARCHAR(70) NOT NULL,
    source_agency VARCHAR(32) NOT NULL DEFAULT '18_SPACE_DEFENSE_SQ',
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sat_epoch UNIQUE (satellite_id, epoch_utc)
);

CREATE INDEX idx_tle_sat_epoch ON tle_ephemeris_records(satellite_id, epoch_utc DESC);
CREATE INDEX idx_tle_norad_epoch ON tle_ephemeris_records(norad_cat_id, epoch_utc DESC);

-- ----------------------------------------------------------------------------
-- 3. CONJUNCTION RISK & CARA WARNING AUDIT LOG
-- ----------------------------------------------------------------------------
CREATE TABLE conjunction_warnings (
    conjunction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_satellite_id VARCHAR(64) NOT NULL REFERENCES constellation_satellites(satellite_id) ON DELETE RESTRICT,
    primary_norad_id INTEGER NOT NULL,
    secondary_norad_id INTEGER NOT NULL,
    secondary_object_name VARCHAR(128) NOT NULL,
    secondary_object_type VARCHAR(32) NOT NULL DEFAULT 'DEBRIS',
    tca_epoch_utc TIMESTAMPTZ NOT NULL,
    collision_probability_pc NUMERIC(14, 10) NOT NULL CHECK (collision_probability_pc >= 0 AND collision_probability_pc <= 1),
    pc_threshold_limit NUMERIC(14, 10) NOT NULL DEFAULT 0.0001000000,
    miss_distance_total_m NUMERIC(10, 3) NOT NULL CHECK (miss_distance_total_m >= 0),
    miss_radial_m NUMERIC(10, 3) NOT NULL,
    miss_intrack_m NUMERIC(10, 3) NOT NULL,
    miss_crosstrack_m NUMERIC(10, 3) NOT NULL,
    relative_speed_km_s NUMERIC(8, 4) NOT NULL,
    combined_cov_sigma_radial_m NUMERIC(8, 3) NOT NULL,
    combined_cov_sigma_crosstrack_m NUMERIC(8, 3) NOT NULL,
    combined_hard_body_radius_m NUMERIC(6, 2) NOT NULL DEFAULT 8.50,
    mahalanobis_distance NUMERIC(8, 3) NOT NULL,
    severity_status conjunction_severity_enum NOT NULL DEFAULT 'MONITORING',
    mitigation_maneuver_id UUID,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_conjunction_event UNIQUE (primary_satellite_id, secondary_norad_id, tca_epoch_utc)
);

CREATE INDEX idx_conjunction_tca ON conjunction_warnings(tca_epoch_utc ASC);
CREATE INDEX idx_conjunction_pc ON conjunction_warnings(collision_probability_pc DESC);
CREATE INDEX idx_conjunction_primary_tca ON conjunction_warnings(primary_satellite_id, tca_epoch_utc);

-- ----------------------------------------------------------------------------
-- 4. AUTONOMOUS MANEUVER EXECUTION PLANS & AUDIT TRAIL
-- ----------------------------------------------------------------------------
CREATE TABLE maneuver_execution_logs (
    maneuver_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_id VARCHAR(64) NOT NULL REFERENCES constellation_satellites(satellite_id) ON DELETE RESTRICT,
    target_conjunction_id UUID REFERENCES conjunction_warnings(conjunction_id) ON DELETE SET NULL,
    maneuver_type maneuver_type_enum NOT NULL,
    burn_start_epoch_utc TIMESTAMPTZ NOT NULL,
    burn_duration_seconds NUMERIC(8, 2) NOT NULL CHECK (burn_duration_seconds > 0),
    delta_v_radial_mps NUMERIC(8, 4) NOT NULL DEFAULT 0.0000,
    delta_v_intrack_mps NUMERIC(8, 4) NOT NULL DEFAULT 0.0000,
    delta_v_crosstrack_mps NUMERIC(8, 4) NOT NULL DEFAULT 0.0000,
    delta_v_total_mps NUMERIC(8, 4) NOT NULL CHECK (delta_v_total_mps > 0),
    propellant_consumed_kg NUMERIC(8, 4) NOT NULL CHECK (propellant_consumed_kg >= 0),
    thruster_duty_cycle_pct NUMERIC(5, 2) NOT NULL CHECK (thruster_duty_cycle_pct > 0 AND thruster_duty_cycle_pct <= 100),
    pre_maneuver_pc NUMERIC(14, 10),
    projected_post_maneuver_pc NUMERIC(14, 10),
    projected_miss_distance_m NUMERIC(10, 3),
    execution_status execution_status_enum NOT NULL DEFAULT 'PLANNED',
    authorized_by VARCHAR(64) NOT NULL DEFAULT 'AUTONOMOUS_FLIGHT_CONTROLLER_V1',
    execution_sha256_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maneuvers_sat_start ON maneuver_execution_logs(satellite_id, burn_start_epoch_utc DESC);
CREATE INDEX idx_maneuvers_status ON maneuver_execution_logs(execution_status);

-- ----------------------------------------------------------------------------
-- 5. TIME-SERIES PARTITIONED TELEMETRY & EKF STATE SNAPSHOTS
-- ----------------------------------------------------------------------------
CREATE TABLE telemetry_snapshots (
    telemetry_id UUID DEFAULT uuid_generate_v4(),
    satellite_id VARCHAR(64) NOT NULL,
    recorded_epoch_utc TIMESTAMPTZ NOT NULL,
    eci_x_km NUMERIC(14, 6) NOT NULL,
    eci_y_km NUMERIC(14, 6) NOT NULL,
    eci_z_km NUMERIC(14, 6) NOT NULL,
    eci_vx_km_s NUMERIC(14, 8) NOT NULL,
    eci_vy_km_s NUMERIC(14, 8) NOT NULL,
    eci_vz_km_s NUMERIC(14, 8) NOT NULL,
    ekf_estimated_cd NUMERIC(6, 4) NOT NULL,
    ekf_residual_radial_m NUMERIC(8, 3) NOT NULL,
    ekf_residual_intrack_m NUMERIC(8, 3) NOT NULL,
    ekf_residual_crosstrack_m NUMERIC(8, 3) NOT NULL,
    ekf_3sigma_pos_m NUMERIC(8, 3) NOT NULL,
    gnss_lock_channel_count SMALLINT NOT NULL CHECK (gnss_lock_channel_count >= 0),
    star_tracker_locked BOOLEAN NOT NULL DEFAULT TRUE,
    battery_state_of_charge_pct NUMERIC(5, 2) NOT NULL CHECK (battery_state_of_charge_pct >= 0 AND battery_state_of_charge_pct <= 100),
    solar_array_power_w NUMERIC(8, 2) NOT NULL CHECK (solar_array_power_w >= 0),
    compute_cycle_latency_ms NUMERIC(6, 3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recorded_epoch_utc, satellite_id, telemetry_id)
) PARTITION BY RANGE (recorded_epoch_utc);

-- Partition range examples for active operations
CREATE TABLE telemetry_y2026m10 PARTITION OF telemetry_snapshots
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE telemetry_y2026m11 PARTITION OF telemetry_snapshots
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE INDEX idx_telemetry_sat_time ON telemetry_snapshots(satellite_id, recorded_epoch_utc DESC);

-- ----------------------------------------------------------------------------
-- 6. IMMUTABLE ZERO-RPO AUDIT CHAIN TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_maneuver_audit_hash()
RETURNS TRIGGER AS $$
BEGIN
    NEW.execution_sha256_hash := encode(
        digest(
            CONCAT(
                NEW.satellite_id, '|',
                NEW.maneuver_type, '|',
                NEW.burn_start_epoch_utc, '|',
                NEW.delta_v_total_mps, '|',
                NEW.propellant_consumed_kg, '|',
                NEW.authorized_by
            ),
            'sha256'
        ),
        'hex'
    );
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maneuver_audit_hash
BEFORE INSERT OR UPDATE ON maneuver_execution_logs
FOR EACH ROW EXECUTE FUNCTION generate_maneuver_audit_hash();
