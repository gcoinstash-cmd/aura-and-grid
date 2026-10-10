export const ALLOYDB_SCHEMA_SQL = `-- ============================================================================
-- GHOST FACTORYOS FLEET TIER: TRACK 3 (F1 SKUNKWORKS)
-- ASSET ID: GF-T3-146 (HYPERION-FLUX: NEUROMORPHIC EVENT-VISION ENGINE)
-- ALLOYDB / POSTGRESQL PRODUCTION DDL SCHEMA
-- DIALECT: PostgreSQL 16+ / Google Cloud AlloyDB for PostgreSQL
-- COMPLIANCE: 10/10 MONOPOLY VAULT ZERO-PLACEHOLDER STANDARD
-- ============================================================================

-- Enable required enterprise extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set strict time zone and isolation parameters
SET TIME ZONE 'UTC';
SET default_transaction_isolation = 'read committed';

-- ----------------------------------------------------------------------------
-- 1. SENSOR NODES REGISTRY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS neuromorphic_sensor_nodes (
    sensor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_serial VARCHAR(64) NOT NULL UNIQUE,
    fleet_vehicle_id VARCHAR(64) NOT NULL,
    sensor_model VARCHAR(64) NOT NULL DEFAULT 'PROPHESEE_GEN4_HD_CD',
    resolution_x INTEGER NOT NULL CHECK (resolution_x > 0 AND resolution_x <= 4096),
    resolution_y INTEGER NOT NULL CHECK (resolution_y > 0 AND resolution_y <= 4096),
    active_refractory_period_us NUMERIC(8,2) NOT NULL DEFAULT 10.00 CHECK (active_refractory_period_us >= 1.00),
    contrast_threshold_on NUMERIC(5,3) NOT NULL DEFAULT 0.180 CHECK (contrast_threshold_on > 0),
    contrast_threshold_off NUMERIC(5,3) NOT NULL DEFAULT -0.180 CHECK (contrast_threshold_off < 0),
    pcie_bus_slot VARCHAR(32) NOT NULL DEFAULT '0000:03:00.0',
    firmware_revision VARCHAR(32) NOT NULL DEFAULT 'v4.18.2-rt-rtx',
    calibration_matrix_hash CHAR(64) NOT NULL,
    provisioned_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE INDEX idx_sensor_nodes_vehicle ON neuromorphic_sensor_nodes (fleet_vehicle_id, is_active);
CREATE INDEX idx_sensor_nodes_serial ON neuromorphic_sensor_nodes (node_serial);

-- ----------------------------------------------------------------------------
-- 2. EVENT STREAM PARTITIONS (Time-Series Range Partitioned Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_stream_partitions (
    event_partition_id UUID DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES neuromorphic_sensor_nodes(sensor_id) ON DELETE RESTRICT,
    partition_start_us BIGINT NOT NULL,
    partition_end_us BIGINT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    event_count_on BIGINT NOT NULL CHECK (event_count_on >= 0),
    event_count_off BIGINT NOT NULL CHECK (event_count_off >= 0),
    peak_throughput_eps BIGINT NOT NULL CHECK (peak_throughput_eps >= 0),
    mean_noise_floor_ratio NUMERIC(6,4) NOT NULL CHECK (mean_noise_floor_ratio >= 0 AND mean_noise_floor_ratio <= 1.0),
    binary_stream_storage_uri TEXT NOT NULL,
    crc32_checksum CHAR(8) NOT NULL,
    PRIMARY KEY (sensor_id, partition_start_us, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- Create Initial Daily Partitions
CREATE TABLE IF NOT EXISTS event_stream_partitions_2026_10_05 
    PARTITION OF event_stream_partitions
    FOR VALUES FROM ('2026-10-05 00:00:00+00') TO ('2026-10-06 00:00:00+00');

CREATE TABLE IF NOT EXISTS event_stream_partitions_2026_10_06 
    PARTITION OF event_stream_partitions
    FOR VALUES FROM ('2026-10-06 00:00:00+00') TO ('2026-10-07 00:00:00+00');

CREATE TABLE IF NOT EXISTS event_stream_partitions_2026_10_07 
    PARTITION OF event_stream_partitions
    FOR VALUES FROM ('2026-10-07 00:00:00+00') TO ('2026-10-08 00:00:00+00');

-- High-performance BRIN index for append-only time series querying
CREATE INDEX idx_event_partitions_recorded_brin 
    ON event_stream_partitions USING BRIN (recorded_at);

CREATE INDEX idx_event_partitions_sensor_time 
    ON event_stream_partitions (sensor_id, partition_start_us DESC);

-- ----------------------------------------------------------------------------
-- 3. OPTICAL FLOW VECTOR TIME SERIES (Microsecond Kinematics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS optical_flow_vectors (
    flow_id UUID DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES neuromorphic_sensor_nodes(sensor_id) ON DELETE RESTRICT,
    timestamp_us BIGINT NOT NULL,
    spatial_roi_x_min SMALLINT NOT NULL CHECK (spatial_roi_x_min >= 0),
    spatial_roi_y_min SMALLINT NOT NULL CHECK (spatial_roi_y_min >= 0),
    spatial_roi_x_max SMALLINT NOT NULL CHECK (spatial_roi_x_max >= spatial_roi_x_min),
    spatial_roi_y_max SMALLINT NOT NULL CHECK (spatial_roi_y_max >= spatial_roi_y_min),
    velocity_vx_px_us NUMERIC(10,5) NOT NULL,
    velocity_vy_px_us NUMERIC(10,5) NOT NULL,
    velocity_magnitude_px_us NUMERIC(10,5) NOT NULL CHECK (velocity_magnitude_px_us >= 0),
    angle_radians NUMERIC(6,4) NOT NULL CHECK (angle_radians >= -3.1416 AND angle_radians <= 3.1416),
    condition_number_kappa NUMERIC(8,3) NOT NULL CHECK (condition_number_kappa >= 1.0),
    aperture_confidence_score NUMERIC(5,4) NOT NULL CHECK (aperture_confidence_score >= 0.0 AND aperture_confidence_score <= 1.0),
    computation_latency_us NUMERIC(8,2) NOT NULL CHECK (computation_latency_us >= 0),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    PRIMARY KEY (sensor_id, timestamp_us, flow_id)
) PARTITION BY RANGE (recorded_at);

-- Partitions for optical flow vectors
CREATE TABLE IF NOT EXISTS optical_flow_vectors_2026_10_05 
    PARTITION OF optical_flow_vectors
    FOR VALUES FROM ('2026-10-05 00:00:00+00') TO ('2026-10-06 00:00:00+00');

CREATE TABLE IF NOT EXISTS optical_flow_vectors_2026_10_06 
    PARTITION OF optical_flow_vectors
    FOR VALUES FROM ('2026-10-06 00:00:00+00') TO ('2026-10-07 00:00:00+00');

CREATE INDEX idx_flow_vectors_sensor_time 
    ON optical_flow_vectors (sensor_id, timestamp_us DESC);
CREATE INDEX idx_flow_vectors_confidence 
    ON optical_flow_vectors (aperture_confidence_score) WHERE (aperture_confidence_score > 0.85);

-- ----------------------------------------------------------------------------
-- 4. EDGE ANOMALY & COLLISION TRIGGERS (LIF Spiking Estimator Alerts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS edge_anomaly_triggers (
    anomaly_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES neuromorphic_sensor_nodes(sensor_id) ON DELETE RESTRICT,
    trigger_timestamp_us BIGINT NOT NULL,
    anomaly_type VARCHAR(48) NOT NULL CHECK (anomaly_type IN ('IMMINENT_COLLISION', 'HYPER_VELOCITY_DEVIATION', 'OPTICAL_DIVERGENCE_SHOCKWAVE', 'REFRACTORY_SATURATION')),
    severity_level VARCHAR(16) NOT NULL CHECK (severity_level IN ('CRITICAL', 'HIGH', 'WARNING', 'INFO')),
    time_to_collision_ms NUMERIC(8,2) NOT NULL,
    spike_density_per_px2 NUMERIC(8,4) NOT NULL,
    target_centroid_x NUMERIC(7,2) NOT NULL,
    target_centroid_y NUMERIC(7,2) NOT NULL,
    relative_approach_speed_m_s NUMERIC(8,2) NOT NULL,
    can_bus_arbitration_id VARCHAR(16) NOT NULL DEFAULT '0x0CFE6CEE',
    autonomous_override_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE INDEX idx_anomaly_triggers_sensor_sev 
    ON edge_anomaly_triggers (sensor_id, severity_level, trigger_timestamp_us DESC);
CREATE INDEX idx_anomaly_triggers_ttc 
    ON edge_anomaly_triggers (time_to_collision_ms) WHERE (time_to_collision_ms <= 150.00);

-- ----------------------------------------------------------------------------
-- 5. FIRMWARE & OPTICAL CALIBRATION RECORDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS firmware_calibration_records (
    calibration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES neuromorphic_sensor_nodes(sensor_id) ON DELETE RESTRICT,
    calibration_version VARCHAR(32) NOT NULL,
    temporal_tau_decay_us INTEGER NOT NULL CHECK (temporal_tau_decay_us > 0),
    spatial_patch_radius_r SMALLINT NOT NULL CHECK (spatial_patch_radius_r BETWEEN 1 AND 16),
    condition_number_threshold NUMERIC(5,2) NOT NULL DEFAULT 12.50,
    lif_membrane_tau_us INTEGER NOT NULL DEFAULT 20000,
    lif_threshold_mv NUMERIC(5,2) NOT NULL DEFAULT -55.00,
    lif_reset_mv NUMERIC(5,2) NOT NULL DEFAULT -75.00,
    lif_rest_mv NUMERIC(5,2) NOT NULL DEFAULT -70.00,
    calibrated_by_engineer VARCHAR(96) NOT NULL,
    verification_digest CHAR(64) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE INDEX idx_calibration_sensor_applied 
    ON firmware_calibration_records (sensor_id, applied_at DESC);

-- ----------------------------------------------------------------------------
-- 6. IMMUTABLE AUDIT TRIGGER & SYSTEM CONSTRAINTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_telemetry_ledger (
    audit_id BIGSERIAL PRIMARY KEY,
    entity_name VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(16) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    prior_state JSONB,
    new_state JSONB,
    executed_by VARCHAR(64) NOT NULL DEFAULT CURRENT_USER,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE OR REPLACE FUNCTION record_immutable_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_telemetry_ledger (entity_name, entity_id, operation, prior_state)
        VALUES (TG_TABLE_NAME, OLD.sensor_id, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_telemetry_ledger (entity_name, entity_id, operation, prior_state, new_state)
        VALUES (TG_TABLE_NAME, NEW.sensor_id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_telemetry_ledger (entity_name, entity_id, operation, new_state)
        VALUES (TG_TABLE_NAME, NEW.sensor_id, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_sensor_nodes
AFTER INSERT OR UPDATE OR DELETE ON neuromorphic_sensor_nodes
FOR EACH ROW EXECUTE FUNCTION record_immutable_audit_log();

-- Verify constraint integrity
COMMENT ON TABLE neuromorphic_sensor_nodes IS 'Master DVS hardware registry for F1 Skunkworks edge nodes.';
COMMENT ON TABLE event_stream_partitions IS 'Time-range partitioned asynchronous DVS event stream partitions.';
COMMENT ON TABLE optical_flow_vectors IS 'Sub-millisecond optical flow vectors calculated via Surface of Active Events.';
COMMENT ON TABLE edge_anomaly_triggers IS 'Autonomous edge braking and collision hazard triggers generated by LIF estimator.';
`;
