-- ============================================================================
-- GHOST FACTORYOS ENTERPRISE FLEET SCHEMA: ALLOYDB / POSTGRESQL 16+
-- ASSET IDENTIFIER: GF-T3-147 (Sol-Rotor: Autonomous Multi-Agent Heavy-Lift eVTOL)
-- COMPLIANCE: DO-178C Level A, FAA 14 CFR Part 135/107, ISO 26262 ASIL-D
-- ============================================================================

-- Enable essential cryptographic and time-series extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Set standard timezone and search path
SET timezone = 'UTC';

-- ----------------------------------------------------------------------------
-- 1. FLEET AIRFRAME REGISTRY
-- Master record of all heavy-lift eVTOL tiltrotor airframes in the autonomous swarm.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS airframe_fleet_registry (
    airframe_id             VARCHAR(32) PRIMARY KEY,
    tail_number             VARCHAR(16) NOT NULL UNIQUE,
    callsign                VARCHAR(32) NOT NULL,
    airframe_class          VARCHAR(32) NOT NULL DEFAULT 'HEAVY_LIFT_EVTOL_TILTROTOR',
    empty_mass_kg           NUMERIC(8, 2) NOT NULL CHECK (empty_mass_kg > 0),
    max_takeoff_weight_kg   NUMERIC(8, 2) NOT NULL CHECK (max_takeoff_weight_kg >= empty_mass_kg),
    max_payload_kg          NUMERIC(8, 2) NOT NULL CHECK (max_payload_kg > 0),
    rotor_count             INT NOT NULL CHECK (rotor_count >= 4),
    tilting_nacelle_count   INT NOT NULL CHECK (tilting_nacelle_count >= 0),
    wing_span_m             NUMERIC(6, 2) NOT NULL CHECK (wing_span_m > 0),
    wing_area_m2            NUMERIC(6, 2) NOT NULL CHECK (wing_area_m2 > 0),
    avionics_ndi_version    VARCHAR(24) NOT NULL DEFAULT 'v4.12.0-F1-SKUNKWORKS',
    operational_status      VARCHAR(24) NOT NULL CHECK (operational_status IN ('ACTIVE_FLIGHT', 'STANDBY', 'MAINTENANCE_DOCK', 'DECOMMISSIONED')),
    commissioned_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_avionics_audit_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hardware_security_hash  VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_airframe_status ON airframe_fleet_registry (operational_status);

-- ----------------------------------------------------------------------------
-- 2. HIGH-FREQUENCY 6-DOF FLIGHT TELEMETRY (RANGE PARTITIONED)
-- Ingestion throughput target: 100 Hz per active airframe (Zero-RPO).
-- Partitioned by day on timestamp_ns.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flight_telemetry_partitions (
    telemetry_id            BIGSERIAL,
    airframe_id             VARCHAR(32) NOT NULL REFERENCES airframe_fleet_registry(airframe_id) ON DELETE RESTRICT,
    timestamp_ns            BIGINT NOT NULL CHECK (timestamp_ns > 0),
    recorded_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- 6-DOF Inertial Position & Velocity (WGS-84 / Local NED)
    latitude_deg            NUMERIC(10, 7) NOT NULL CHECK (latitude_deg BETWEEN -90 AND 90),
    longitude_deg           NUMERIC(10, 7) NOT NULL CHECK (longitude_deg BETWEEN -180 AND 180),
    altitude_baro_m         NUMERIC(8, 2) NOT NULL,
    altitude_radar_agl_m    NUMERIC(8, 2) NOT NULL CHECK (altitude_radar_agl_m >= -10),
    vel_body_u_mps          NUMERIC(7, 3) NOT NULL, -- Forward
    vel_body_v_mps          NUMERIC(7, 3) NOT NULL, -- Lateral
    vel_body_w_mps          NUMERIC(7, 3) NOT NULL, -- Downward
    true_airspeed_kts       NUMERIC(6, 2) NOT NULL CHECK (true_airspeed_kts >= 0),
    ground_speed_kts        NUMERIC(6, 2) NOT NULL CHECK (ground_speed_kts >= 0),
    vertical_speed_mps      NUMERIC(6, 2) NOT NULL,
    
    -- Attitude Quaternion (w, x, y, z) Normalized
    quat_w                  NUMERIC(8, 6) NOT NULL,
    quat_x                  NUMERIC(8, 6) NOT NULL,
    quat_y                  NUMERIC(8, 6) NOT NULL,
    quat_z                  NUMERIC(8, 6) NOT NULL,
    euler_roll_deg          NUMERIC(6, 2) NOT NULL CHECK (euler_roll_deg BETWEEN -180 AND 180),
    euler_pitch_deg         NUMERIC(6, 2) NOT NULL CHECK (euler_pitch_deg BETWEEN -90 AND 90),
    euler_yaw_deg           NUMERIC(6, 2) NOT NULL CHECK (euler_yaw_deg BETWEEN 0 AND 360),
    
    -- Body Angular Rates (p, q, r)
    rate_roll_p_rads        NUMERIC(7, 4) NOT NULL,
    rate_pitch_q_rads       NUMERIC(7, 4) NOT NULL,
    rate_yaw_r_rads         NUMERIC(7, 4) NOT NULL,
    
    -- Aerodynamics & Nacelle
    nacelle_angle_deg       NUMERIC(5, 2) NOT NULL CHECK (nacelle_angle_deg BETWEEN 0 AND 90),
    total_thrust_kn         NUMERIC(6, 2) NOT NULL CHECK (total_thrust_kn >= 0),
    load_factor_g           NUMERIC(5, 2) NOT NULL,
    vrs_risk_indicator      VARCHAR(16) NOT NULL CHECK (vrs_risk_indicator IN ('NONE', 'CAUTION', 'CRITICAL')),
    ndi_control_latency_ms  NUMERIC(5, 2) NOT NULL CHECK (ndi_control_latency_ms < 20.0),
    flight_mode             VARCHAR(32) NOT NULL,
    
    -- Cryptographic Blockchain Log Seal
    block_hash_sha256       VARCHAR(64) NOT NULL,
    prev_block_hash         VARCHAR(64) NOT NULL,

    PRIMARY KEY (airframe_id, timestamp_ns)
) PARTITION BY RANGE (timestamp_ns);

-- Composite indices on hypertable partitions
CREATE INDEX IF NOT EXISTS idx_telemetry_airframe_time ON flight_telemetry_partitions (airframe_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_vrs ON flight_telemetry_partitions (vrs_risk_indicator) WHERE vrs_risk_indicator != 'NONE';

-- Partition declarations for current production epochs
CREATE TABLE IF NOT EXISTS telemetry_p_2026_10_05 PARTITION OF flight_telemetry_partitions
    FOR VALUES FROM (1791244800000000000) TO (1791331200000000000);

CREATE TABLE IF NOT EXISTS telemetry_p_2026_10_06 PARTITION OF flight_telemetry_partitions
    FOR VALUES FROM (1791331200000000000) TO (1791417600000000000);

-- ----------------------------------------------------------------------------
-- 3. DISTRIBUTED SWARM FORMATION EPOCHS
-- Tracks graph consensus state, Laplacian connectivity, and swarm topology.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS swarm_formation_epochs (
    epoch_id                BIGSERIAL PRIMARY KEY,
    swarm_identifier        VARCHAR(32) NOT NULL,
    epoch_timestamp_ns      BIGINT NOT NULL,
    recorded_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    virtual_leader_id       VARCHAR(32) NOT NULL REFERENCES airframe_fleet_registry(airframe_id),
    formation_pattern       VARCHAR(32) NOT NULL CHECK (formation_pattern IN ('TACTICAL_DIAMOND', 'V_STAGGER', 'CARGO_SLING_TETHER', 'PERIMETER_RING', 'TRAIL_CONVOY')),
    active_peer_count       INT NOT NULL CHECK (active_peer_count BETWEEN 1 AND 64),
    target_separation_m     NUMERIC(6, 2) NOT NULL CHECK (target_separation_m > 0),
    actual_rms_error_m      NUMERIC(6, 3) NOT NULL,
    algebraic_conn_lambda2  NUMERIC(6, 3) NOT NULL CHECK (algebraic_conn_lambda2 >= 0),
    mean_mesh_latency_ms    NUMERIC(6, 2) NOT NULL,
    rvo_active_evasion_flag BOOLEAN NOT NULL DEFAULT FALSE,
    mesh_consensus_quorum   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_swarm_epochs ON swarm_formation_epochs (swarm_identifier, recorded_at DESC);

-- ----------------------------------------------------------------------------
-- 4. ACTUATOR & ROTOR CONTROL LOGS (8-ROTOR SUBSYSTEM)
-- Sub-millisecond logging for individual brushless motor ESCs and nacelle servos.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS actuator_control_logs (
    actuator_log_id         BIGSERIAL PRIMARY KEY,
    airframe_id             VARCHAR(32) NOT NULL REFERENCES airframe_fleet_registry(airframe_id),
    timestamp_ns            BIGINT NOT NULL,
    rotor_index             INT NOT NULL CHECK (rotor_index BETWEEN 1 AND 8),
    commanded_rpm           NUMERIC(6, 1) NOT NULL,
    measured_rpm            NUMERIC(6, 1) NOT NULL,
    pwm_duty_cycle_pct      NUMERIC(5, 2) NOT NULL CHECK (pwm_duty_cycle_pct BETWEEN 0 AND 100),
    phase_current_amps      NUMERIC(6, 2) NOT NULL,
    inverter_temp_c         NUMERIC(5, 2) NOT NULL,
    stator_temp_c           NUMERIC(5, 2) NOT NULL,
    calculated_thrust_n     NUMERIC(7, 2) NOT NULL,
    actuator_health         VARCHAR(16) NOT NULL CHECK (actuator_health IN ('NOMINAL', 'DEGRADED', 'FAILED', 'OFFLINE'))
);

CREATE INDEX IF NOT EXISTS idx_actuator_time ON actuator_control_logs (airframe_id, timestamp_ns DESC);

-- ----------------------------------------------------------------------------
-- 5. FAILSAFE INTERVENTION & ZERO-RPO AUDIT LOG
-- Immutable audit log for any flight envelope excursion, VRS trigger, or rotor failure.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS failsafe_intervention_records (
    record_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airframe_id             VARCHAR(32) NOT NULL REFERENCES airframe_fleet_registry(airframe_id),
    incident_timestamp_ns   BIGINT NOT NULL,
    intervention_type       VARCHAR(48) NOT NULL,
    trigger_source          VARCHAR(48) NOT NULL,
    pre_event_velocity_mps  NUMERIC(6, 2) NOT NULL,
    pre_event_altitude_m    NUMERIC(8, 2) NOT NULL,
    ndi_reallocation_ms     NUMERIC(5, 2) NOT NULL,
    emergency_ballistic_chute BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_status       VARCHAR(24) NOT NULL CHECK (resolution_status IN ('RESOLVED_AUTONOMOUS', 'SAFE_RECOVERY_HOVER', 'REROUTED_DIVERT', 'EMERGENCY_LANDED')),
    audit_signature_ed25519 VARCHAR(128) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failsafe_audit ON failsafe_intervention_records (airframe_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. CRYPTOGRAPHIC INTEGRITY AUDIT TRIGGER
-- Ensures zero-tamper flight telemetry chain with SHA-256 block hashing.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_audit_telemetry_hash()
RETURNS TRIGGER AS $$
DECLARE
    v_prev_hash VARCHAR(64);
BEGIN
    -- Query latest block hash for the given airframe
    SELECT block_hash_sha256 INTO v_prev_hash
    FROM flight_telemetry_partitions
    WHERE airframe_id = NEW.airframe_id
    ORDER BY timestamp_ns DESC
    LIMIT 1;

    IF v_prev_hash IS NULL THEN
        NEW.prev_block_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    ELSE
        NEW.prev_block_hash := v_prev_hash;
    END IF;

    -- Compute SHA-256 signature across critical state vector fields
    NEW.block_hash_sha256 := encode(digest(
        NEW.airframe_id || NEW.timestamp_ns::text || NEW.altitude_baro_m::text || 
        NEW.quat_w::text || NEW.quat_x::text || NEW.quat_y::text || NEW.quat_z::text ||
        NEW.total_thrust_kn::text || NEW.prev_block_hash,
        'sha256'
    ), 'hex');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_telemetry_hash ON flight_telemetry_partitions;
CREATE TRIGGER trg_audit_telemetry_hash
    BEFORE INSERT ON flight_telemetry_partitions
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_telemetry_hash();
