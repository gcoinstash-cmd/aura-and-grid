"""
Unit and algorithmic tests for Engine GF-T3-139: AeroDyn-RT Core.
Tests EKF convergence, aerodynamic CoP solver, stall clamps, and ring buffer.
"""

import math
import pytest
from src.engine import (
    AeroDynEngine,
    CRIT_DIFFUSER_RIDE_HEIGHT,
    MAX_DRS_SLEW_DPS,
    MAX_WING_FLAP_DEG,
    MIN_WING_FLAP_DEG,
)
from src.models import (
    DrsCommandInput,
    ImuInput,
    RideHeightInput,
    TelemetryFrameInput,
)


def make_frame(
    seq: int = 1,
    timestamp_ns: int = 1_000_000,
    speed_mph: float = 180.0,
    fl: float = 20.0,
    fr: float = 20.0,
    rl: float = 30.0,
    rr: float = 30.0,
    pitch_deg: float = -0.5,
    roll_deg: float = 0.1,
) -> TelemetryFrameInput:
    return TelemetryFrameInput(
        chassis_id="AERO-TEST-01",
        timestamp_ns=timestamp_ns,
        speed_mph=speed_mph,
        ride_height_mm=RideHeightInput(fl=fl, fr=fr, rl=rl, rr=rr),
        imu=ImuInput(
            pitch_deg=pitch_deg,
            roll_deg=roll_deg,
            yaw_rate_dps=0.2,
            lat_g=0.5,
            long_g=-1.2,
        ),
    )


def test_engine_initialization():
    engine = AeroDynEngine(capacity=500)
    assert engine.capacity == 500
    assert len(engine.ring_buffer) == 0
    assert engine.sequence_counter == 0
    assert engine.current_wing_deg == 32.0

    health = engine.get_health()
    assert health.status == "ONLINE"
    assert health.frames_ingested == 0
    assert health.stall_interlock_active is False


def test_frame_ingestion_single():
    engine = AeroDynEngine()
    frame = make_frame(seq=1, timestamp_ns=1_000_000, speed_mph=160.0)
    ack = engine.ingest_frame(frame)

    assert ack.status == "INGESTED_RING_BUFFER"
    assert ack.frame_seq_id == 1
    assert ack.latency_us > 0
    assert ack.ekf_residual_norm >= 0.0
    assert len(engine.ring_buffer) == 1


def test_ekf_sequential_convergence():
    engine = AeroDynEngine()
    t = 1_000_000_000

    # Feed 20 frames at 1000Hz (1ms apart) with identical measurements
    residuals = []
    for i in range(20):
        t += 1_000_000  # +1 ms
        frame = make_frame(seq=i + 1, timestamp_ns=t, fl=18.0, fr=18.0, rl=28.0, rr=28.0)
        ack = engine.ingest_frame(frame)
        residuals.append(ack.ekf_residual_norm)

    # Residuals should decrease as EKF updates state
    assert residuals[-1] < residuals[0]
    assert math.isclose(engine.x[0], 18.0, abs_tol=0.5)
    assert math.isclose(engine.x[2], 28.0, abs_tol=0.5)


def test_dynamic_dt_and_clock_jitter():
    engine = AeroDynEngine()
    # First frame
    frame1 = make_frame(timestamp_ns=100_000_000)
    engine.ingest_frame(frame1)

    # Second frame with large gap (testing clamp dt <= 0.05)
    frame2 = make_frame(timestamp_ns=200_000_000)
    ack2 = engine.ingest_frame(frame2)
    assert ack2.frame_seq_id == 2

    # Third frame with reverse timestamp (testing fallback dt = 0.001)
    frame3 = make_frame(timestamp_ns=150_000_000)
    ack3 = engine.ingest_frame(frame3)
    assert ack3.frame_seq_id == 3


def test_aero_state_calculation_speed_scaling():
    engine = AeroDynEngine()
    # At low speed
    low_speed_state = engine.calculate_aero_state(speed_mph=30.0)
    # At high speed
    high_speed_state = engine.calculate_aero_state(speed_mph=200.0)

    # Downforce and drag scale quadratically with velocity
    assert high_speed_state.downforce_total_kgf > low_speed_state.downforce_total_kgf * 10
    assert high_speed_state.drag_kgf > low_speed_state.drag_kgf * 10
    assert 30.0 <= high_speed_state.cop_front_pct <= 60.0
    assert math.isclose(
        high_speed_state.cop_front_pct + high_speed_state.cop_rear_pct,
        100.0,
        abs_tol=0.1,
    )


def test_diffuser_choke_and_stall_risk():
    engine = AeroDynEngine()
    
    # Ingest frames with dangerously low rear ride height below critical threshold (e.g., 8.0 mm)
    t = 1_000_000_000
    for i in range(25):
        t += 1_000_000
        frame = make_frame(timestamp_ns=t, rl=8.0, rr=8.0)
        engine.ingest_frame(frame)

    state = engine.calculate_aero_state(speed_mph=180.0)
    assert state.stall_risk > 0.8
    assert engine.stall_interlock_active is True


def test_drs_dispatch_normal():
    engine = AeroDynEngine()
    cmd = DrsCommandInput(requested_angle_deg=10.0, reason="DRS_ZONE_ACTIVATION")
    resp = engine.dispatch_drs_command(cmd)

    assert resp.status == "DISPATCHED_CAN_ACTUATOR"
    assert resp.commanded_angle_deg == 10.0
    assert resp.effective_angle_deg == 10.0
    assert resp.slew_rate_dps == MAX_DRS_SLEW_DPS


def test_drs_dispatch_clamped_boundaries():
    engine = AeroDynEngine()
    # Below minimum
    cmd_low = DrsCommandInput(requested_angle_deg=0.0, reason="ZERO_FLAP")
    resp_low = engine.dispatch_drs_command(cmd_low)
    assert resp_low.effective_angle_deg == 0.0

    # Above maximum
    cmd_high = DrsCommandInput(requested_angle_deg=42.0, reason="MAX_DOWNFORCE")
    resp_high = engine.dispatch_drs_command(cmd_high)
    assert resp_high.effective_angle_deg == 42.0


def test_drs_dispatch_stall_interlock_clamp():
    engine = AeroDynEngine()
    engine.stall_interlock_active = True

    # Request high flap angle while stall interlock is active
    cmd = DrsCommandInput(requested_angle_deg=38.0, reason="BRAKING_HIGH_DOWNFORCE")
    resp = engine.dispatch_drs_command(cmd)

    assert resp.status == "CLAMPED_STALL_INTERLOCK"
    assert resp.effective_angle_deg == 20.0


def test_ring_buffer_capacity_rollover():
    small_engine = AeroDynEngine(capacity=5)
    t = 1_000_000_000
    for i in range(10):
        t += 1_000_000
        frame = make_frame(seq=i, timestamp_ns=t)
        small_engine.ingest_frame(frame)

    assert len(small_engine.ring_buffer) == 5
    assert small_engine.sequence_counter == 10


def test_engine_health_p99_computation():
    engine = AeroDynEngine()
    t = 1_000_000_000
    for i in range(20):
        t += 1_000_000
        frame = make_frame(seq=i, timestamp_ns=t)
        engine.ingest_frame(frame)

    health = engine.get_health()
    assert health.frames_ingested == 20
    assert health.loop_latency_p99_us >= 1.0


def test_wing_slew_rate_in_frame_step():
    engine = AeroDynEngine()
    engine.dispatch_drs_command(DrsCommandInput(requested_angle_deg=10.0, reason="TEST"))
    # Ingest frame with small dt (1ms = 0.001s)
    frame = make_frame(seq=1, timestamp_ns=1_001_000_000)
    engine.ingest_frame(frame)
    # Wing should have moved by at most 233 * 0.001 = 0.233 degrees
    assert engine.current_wing_deg < 32.0
    assert engine.current_wing_deg >= 31.7


def test_moderate_diffuser_risk_and_ring_buffer_speed():
    engine = AeroDynEngine()
    # Ingest frame with 16.0mm rear ride height and speed 140mph
    frame = make_frame(seq=1, timestamp_ns=1_000_000_000, speed_mph=140.0, rl=16.0, rr=16.0)
    for _ in range(20):
        engine.ingest_frame(frame)

    # Without speed argument, should pick up speed from ring buffer
    state = engine.calculate_aero_state()
    assert 0.0 < state.stall_risk < 0.85
    assert state.downforce_total_kgf > 0.0


def test_zero_speed_cop_fallback():
    engine = AeroDynEngine()
    state = engine.calculate_aero_state(speed_mph=0.0)
    assert state.downforce_total_kgf == 0.0
    assert state.cop_front_pct == 42.0
    assert state.cop_rear_pct == 58.0

