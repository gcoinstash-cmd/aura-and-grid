"""
Unit and algorithmic tests for Engine GF-T3-141: VoxelTrack-Edge 3D Spatial Perception Core.
Tests LiDAR spherical projection, 11-D Kalman filter, Octree voxelization, and TTC calculations.
"""

import math
import pytest
from src.engine import VoxelTrackEngine
from src.models import (
    SweepFormat,
    SweepInput,
    ThreatLevel,
    TrackClassification,
)


def test_engine_initialization():
    engine = VoxelTrackEngine()
    assert engine.sweeps_processed == 0
    assert len(engine.tracks) == 5
    assert "TRK-9821" in engine.tracks
    assert "TRK-9815" in engine.tracks

    health = engine.get_health()
    assert health.status == "HEALTHY"
    assert health.engine_version == "3.4.0-PROD"
    assert health.loop_frequency_hz == 125.04
    assert health.clean_room_compliance == "100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)"


def test_spherical_to_cartesian_projection():
    # Straight forward laser (elevation=0, azimuth=0, r=10)
    x, y, z = VoxelTrackEngine.spherical_to_cartesian(r=10.0, azimuth_rad=0.0, elevation_rad=0.0)
    assert math.isclose(x, 10.0, abs_tol=1e-3)
    assert math.isclose(y, 0.0, abs_tol=1e-3)
    assert math.isclose(z, 0.0, abs_tol=1e-3)

    # 90 deg azimuth (y-axis)
    x, y, z = VoxelTrackEngine.spherical_to_cartesian(r=10.0, azimuth_rad=math.pi / 2.0, elevation_rad=0.0)
    assert math.isclose(x, 0.0, abs_tol=1e-3)
    assert math.isclose(y, 10.0, abs_tol=1e-3)
    assert math.isclose(z, 0.0, abs_tol=1e-3)

    # 45 deg elevation (z-axis)
    x, y, z = VoxelTrackEngine.spherical_to_cartesian(r=10.0, azimuth_rad=0.0, elevation_rad=math.pi / 4.0)
    assert math.isclose(x, 10.0 * math.cos(math.pi / 4.0), abs_tol=1e-3)
    assert math.isclose(z, 10.0 * math.sin(math.pi / 4.0), abs_tol=1e-3)


def test_ttc_calculation_head_on_vs_stationary():
    # Head-on pedestrian: at x=10m, moving at vx=-5m/s towards origin (with zero ego velocity)
    ttc, dist = VoxelTrackEngine.calculate_ttc(position=[10.0, 0.0, 0.0], velocity=[-5.0, 0.0, 0.0], ego_velocity=[0.0, 0.0, 0.0])
    assert ttc == 2.0
    assert dist == 10.0

    # Moving away from origin: at x=10m, moving at vx=+5m/s away
    ttc_away, dist_away = VoxelTrackEngine.calculate_ttc(position=[10.0, 0.0, 0.0], velocity=[5.0, 0.0, 0.0], ego_velocity=[0.0, 0.0, 0.0])
    assert ttc_away is None
    assert dist_away == 10.0

    # Stationary obstacle: zero velocity
    ttc_stat, dist_stat = VoxelTrackEngine.calculate_ttc(position=[10.0, 0.0, 0.0], velocity=[0.0, 0.0, 0.0], ego_velocity=[0.0, 0.0, 0.0])
    assert ttc_stat is None
    assert dist_stat == 10.0

    # Zero distance edge case
    ttc_zero, dist_zero = VoxelTrackEngine.calculate_ttc(position=[0.0, 0.0, 0.0], velocity=[0.0, 0.0, 0.0], ego_velocity=[0.0, 0.0, 0.0])
    assert ttc_zero == 0.0
    assert dist_zero == 0.0


def test_kalman_filter_extrapolation():
    engine = VoxelTrackEngine()
    trk = engine.tracks["TRK-9821"]
    x_init = trk["position"][0]
    vx_init = trk["velocity"][0]

    # Step Kalman filter by 0.008s (125Hz)
    engine.step_kalman_filter(dt=0.008)
    # x(t + dt) should have decreased since vx is negative
    assert trk["position"][0] < x_init


def test_ingest_sweep_and_octree_voxelization():
    engine = VoxelTrackEngine()
    sweep = SweepInput(
        vehicle_id="GHOST-F1-APOLLO",
        frame_seq=1,
        timestamp_ns=1_791_384_000_125_000,
        raw_point_count=98304,
        lidar_beams=64,
        format=SweepFormat.CARTESIAN_PACKED,
    )
    resp = engine.ingest_sweep(sweep)

    assert resp.status == "PROCESSED"
    assert resp.octree_voxel_nodes > 10000
    assert resp.detected_tracks_count == 5
    assert resp.critical_ttc_alert is True
    assert resp.latency_ms > 0.0
    assert engine.sweeps_processed == 1
    assert len(engine.sweep_history) == 1


def test_get_active_tracks_schema():
    engine = VoxelTrackEngine()
    tracks = engine.get_active_tracks()
    assert len(tracks) == 5

    ped = next(t for t in tracks if t.track_id == "TRK-9821")
    assert ped.classification == TrackClassification.PEDESTRIAN
    assert ped.confidence > 0.95
    assert ped.dimensions.height == 1.78
    assert ped.threat_level == ThreatLevel.CRITICAL_COLLISION_IMMINENT
    assert ped.distance > 0.0


def test_get_threats_and_aeb_trigger():
    engine = VoxelTrackEngine()
    threats_resp = engine.get_threats()
    assert threats_resp.alert_count >= 1
    assert threats_resp.threat_level == ThreatLevel.CRITICAL_COLLISION_IMMINENT

    crit = next(t for t in threats_resp.threats if t.track_id == "TRK-9821")
    assert crit.target_class == TrackClassification.PEDESTRIAN
    assert crit.recommended_action == "AEB_FULL_FORCE_APPLY"
    assert crit.ttc_seconds <= 1.2


def test_ring_buffer_rollover_history():
    engine = VoxelTrackEngine()
    # Ingest 505 sweeps to test rollover (>500)
    for i in range(505):
        sweep = SweepInput(
            vehicle_id="GHOST-F1",
            frame_seq=i,
            timestamp_ns=1_000_000_000 + i * 8_000_000,
            raw_point_count=50000,
        )
        engine.ingest_sweep(sweep)

    assert len(engine.sweep_history) == 500
    assert engine.sweeps_processed == 505


def test_engine_health_p99_metrics():
    engine = VoxelTrackEngine()
    health = engine.get_health()
    assert health.p99_latency_ms >= 7.0
    assert health.loop_frequency_hz == 125.04
    assert health.packet_drop_rate == 0.0


def test_latencies_ring_buffer_rollover():
    engine = VoxelTrackEngine()
    for i in range(1005):
        sweep = SweepInput(
            vehicle_id="GHOST-F1",
            frame_seq=i,
            timestamp_ns=1_000_000_000 + i * 8_000_000,
            raw_point_count=50000,
        )
        engine.ingest_sweep(sweep)
    assert len(engine.latencies_ms) == 1000


def test_caution_threat_level_without_critical():
    engine = VoxelTrackEngine()
    # Remove the critical pedestrian so only caution/nominal tracks remain
    del engine.tracks["TRK-9821"]
    threats_resp = engine.get_threats()
    assert threats_resp.threat_level == ThreatLevel.CAUTION

