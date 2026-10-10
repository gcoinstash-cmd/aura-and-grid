-- ============================================================================
-- GHOST FACTORYOS: ALLOYDB / POSTGRESQL PRODUCTION DDL SCHEMA
-- Engine: GF-T3-140 (VoxelTrack-Edge 125Hz 3D Spatial Perception Engine)
-- Dialect: Google Cloud AlloyDB for PostgreSQL 16+ (PostGIS & pgvector enabled)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ENUMS FOR SPATIAL ENGINE
CREATE TYPE classification_enum AS ENUM (
    'VEHICLE',
    'PEDESTRIAN',
    'CYCLIST',
    'MOTORCYCLIST',
    'ROAD_OBSTACLE',
    'EMERGENCY_VEHICLE',
    'UNKNOWN_DEBRIS'
);

CREATE TYPE threat_level_enum AS ENUM (
    'NOMINAL',
    'CAUTION',
    'WARNING',
    'CRITICAL_COLLISION_IMMINENT'
);

-- 1. PERCEPTION SWEEPS (Partitioned by timestamp for 125Hz sub-millisecond writes)
CREATE TABLE perception_sweeps (
    sweep_id UUID DEFAULT uuid_generate_v4(),
    frame_sequence BIGINT NOT NULL,
    vehicle_id VARCHAR(64) NOT NULL,
    timestamp_ns BIGINT NOT NULL,
    sweep_duration_ms NUMERIC(6, 3) NOT NULL,
    raw_point_count INTEGER NOT NULL,
    voxel_octree_nodes INTEGER NOT NULL,
    active_track_count INTEGER NOT NULL,
    p99_latency_ms NUMERIC(5, 2) NOT NULL,
    sensor_sync_drift_ms NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    PRIMARY KEY (sweep_id, created_at)
) PARTITION BY RANGE (created_at);

-- Partition template for high throughput ingest
CREATE TABLE perception_sweeps_current PARTITION OF perception_sweeps
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE INDEX idx_perception_sweeps_seq ON perception_sweeps (vehicle_id, frame_sequence DESC);
CREATE INDEX idx_perception_sweeps_time ON perception_sweeps (timestamp_ns DESC);

-- 2. DETECTED 3D OBJECT TRACKS
CREATE TABLE detected_objects (
    object_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sweep_id UUID NOT NULL,
    track_id VARCHAR(32) NOT NULL,
    classification classification_enum NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    
    -- 3D Bounding Box Centroid (Meters from Ego Center)
    pos_x NUMERIC(8, 3) NOT NULL,
    pos_y NUMERIC(8, 3) NOT NULL,
    pos_z NUMERIC(8, 3) NOT NULL,
    
    -- Dimensions (L x W x H in meters)
    dim_length NUMERIC(6, 2) NOT NULL,
    dim_width NUMERIC(6, 2) NOT NULL,
    dim_height NUMERIC(6, 2) NOT NULL,
    
    -- Kinematic Velocity Vectors (m/s)
    vel_x NUMERIC(8, 3) NOT NULL,
    vel_y NUMERIC(8, 3) NOT NULL,
    vel_z NUMERIC(8, 3) NOT NULL,
    
    -- Yaw Angle (Radians) & Angular Rate
    yaw_rad NUMERIC(6, 3) NOT NULL,
    yaw_rate_rad_s NUMERIC(6, 3) NOT NULL,
    
    -- Estimated Time to Collision (Seconds)
    ttc_seconds NUMERIC(6, 2),
    threat_level threat_level_enum DEFAULT 'NOMINAL' NOT NULL,
    
    -- PostGIS 3D Point for Rapid Spatial Indexing
    geom_pos geometry(PointZ, 4326),
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE INDEX idx_detected_objects_sweep ON detected_objects (sweep_id);
CREATE INDEX idx_detected_objects_track ON detected_objects (track_id, created_at DESC);
CREATE INDEX idx_detected_objects_threat ON detected_objects (threat_level, ttc_seconds) WHERE ttc_seconds <= 1.5;
CREATE INDEX idx_detected_objects_spatial ON detected_objects USING GIST (geom_pos);

-- 3. COLLISION ALERTS & EMERGENCY BRAKING EVENTS
CREATE TABLE collision_alerts (
    alert_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sweep_id UUID NOT NULL,
    object_id UUID REFERENCES detected_objects(object_id) ON DELETE CASCADE,
    track_id VARCHAR(32) NOT NULL,
    ttc_seconds NUMERIC(5, 3) NOT NULL,
    relative_speed_kmh NUMERIC(6, 2) NOT NULL,
    ego_brake_pressure_pct NUMERIC(5, 2) NOT NULL,
    threat_status threat_level_enum NOT NULL,
    evasive_action_dispatched BOOLEAN DEFAULT TRUE NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE INDEX idx_collision_alerts_ttc ON collision_alerts (ttc_seconds, recorded_at DESC);

-- 4. REAL-TIME AUDIT TRIGGER FOR IMMEDIATE BRAKE LOGGING
CREATE OR REPLACE FUNCTION trg_log_critical_threat()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ttc_seconds IS NOT NULL AND NEW.ttc_seconds <= 1.200 THEN
        INSERT INTO collision_alerts (
            sweep_id,
            object_id,
            track_id,
            ttc_seconds,
            relative_speed_kmh,
            ego_brake_pressure_pct,
            threat_status,
            evasive_action_dispatched
        ) VALUES (
            NEW.sweep_id,
            NEW.object_id,
            NEW.track_id,
            NEW.ttc_seconds,
            SQRT(POWER(NEW.vel_x, 2) + POWER(NEW.vel_y, 2)) * 3.6,
            100.0,
            'CRITICAL_COLLISION_IMMINENT',
            TRUE
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_collision_alert
AFTER INSERT OR UPDATE OF ttc_seconds ON detected_objects
FOR EACH ROW EXECUTE FUNCTION trg_log_critical_threat();
