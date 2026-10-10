"""
Ghost FactoryOS — Engine GF-T3-139: AeroDyn-RT
Core 1000Hz Extended Kalman Filter (EKF), Dynamic Center of Pressure (CoP) Solver,
and Zero-Copy Circular Ring Buffer.
License: Apache-2.0 / MIT Dual Permissive
"""

import math
import time
from collections import deque
from typing import Dict, List, Optional, Tuple

from src.models import (
    AeroStateResponse,
    DrsCommandInput,
    DrsCommandResponse,
    EngineHealthResponse,
    TelemetryAck,
    TelemetryFrameInput,
)

# Constants for 1000Hz Aero Physics
AIR_DENSITY_SEA_LEVEL = 1.225        # kg/m^3 (ISA sea level)
MPH_TO_MS = 0.44704                  # Conversion factor mph -> m/s
NEWTON_TO_KGF = 1.0 / 9.80665        # Conversion factor N -> kgf
S_REF_AREA = 1.60                    # Reference aerodynamic planform area (m^2)
MAX_DRS_SLEW_DPS = 233.0             # Maximum actuator slew rate (deg/s)
MAX_WING_FLAP_DEG = 42.0             # Maximum rear aerofoil flap deflection (deg)
MIN_WING_FLAP_DEG = 0.0              # Minimum flap angle / fully open DRS (deg)
CRIT_DIFFUSER_RIDE_HEIGHT = 14.5     # Critical ground-effect stall threshold (mm)
RING_BUFFER_CAPACITY = 10_000        # 10 seconds of 1000Hz history buffer


class AeroDynEngine:
    """
    High-Throughput 1000Hz State-Estimation and Active Aerodynamic Control Core.
    """

    def __init__(self, capacity: int = RING_BUFFER_CAPACITY):
        self.capacity = capacity
        self.ring_buffer: deque = deque(maxlen=capacity)
        self.sequence_counter: int = 0
        self.last_timestamp_ns: int = 0
        
        # 7-State Vector: [h_fl, h_fr, h_rl, h_rr, pitch_rad, roll_rad, wing_deg]
        self.x = [25.0, 25.0, 35.0, 35.0, 0.0, 0.0, 32.0]
        
        # Error Covariance Matrix P (7x7 diagonal approximation)
        self.P = [0.1, 0.1, 0.1, 0.1, 0.01, 0.01, 0.05]
        
        # Process Noise Q
        self.Q = [0.08, 0.08, 0.08, 0.08, 0.001, 0.001, 0.02]
        
        # Measurement Noise R
        self.R = [0.05, 0.05, 0.05, 0.05, 0.005, 0.005, 0.01]
        
        # Actuator State
        self.current_wing_deg: float = 32.0
        self.target_wing_deg: float = 32.0
        self.last_command_time = time.monotonic()
        
        # Diagnostics
        self.latencies_us: deque = deque(maxlen=1000)
        self.stall_interlock_active: bool = False

    def ingest_frame(self, frame: TelemetryFrameInput) -> TelemetryAck:
        """
        Process a high-frequency 1000Hz frame through the Extended Kalman Filter.
        """
        t_start = time.perf_counter_ns()
        self.sequence_counter += 1

        # Calculate dynamic dt in seconds (default to 0.001s if first frame or overflow)
        if self.last_timestamp_ns > 0 and frame.timestamp_ns > self.last_timestamp_ns:
            dt = min(0.05, (frame.timestamp_ns - self.last_timestamp_ns) * 1e-9)
        else:
            dt = 0.001
        self.last_timestamp_ns = frame.timestamp_ns

        # 1. Prediction Step: x_pred = f(x, u, dt)
        # Slew wing towards target within physical rate limit
        delta_wing_req = self.target_wing_deg - self.current_wing_deg
        max_delta_wing = MAX_DRS_SLEW_DPS * dt
        if abs(delta_wing_req) > max_delta_wing:
            self.current_wing_deg += math.copysign(max_delta_wing, delta_wing_req)
        else:
            self.current_wing_deg = self.target_wing_deg

        self.current_wing_deg = max(MIN_WING_FLAP_DEG, min(MAX_WING_FLAP_DEG, self.current_wing_deg))
        self.x[6] = self.current_wing_deg

        # Propagate error covariance
        for i in range(7):
            self.P[i] = self.P[i] + self.Q[i] * dt

        # 2. Measurement Update Step (EKF Innovation)
        # Measurement vector z from frame sensors
        pitch_rad = math.radians(frame.imu.pitch_deg)
        roll_rad = math.radians(frame.imu.roll_deg)
        z = [
            frame.ride_height_mm.fl,
            frame.ride_height_mm.fr,
            frame.ride_height_mm.rl,
            frame.ride_height_mm.rr,
            pitch_rad,
            roll_rad,
            self.current_wing_deg,
        ]

        residual_sq = 0.0
        for i in range(7):
            # Innovation y = z - Hx (H is identity for direct states)
            y = z[i] - self.x[i]
            residual_sq += y * y
            # S = H P H^T + R
            S = self.P[i] + self.R[i]
            # Kalman gain K = P / S
            K = self.P[i] / S if S > 1e-9 else 0.5
            # State update
            self.x[i] += K * y
            # Covariance update
            self.P[i] = (1.0 - K) * self.P[i]

        residual_norm = math.sqrt(residual_sq / 7.0)

        # 3. Store in Ring Buffer
        self.ring_buffer.append((self.sequence_counter, frame, self.current_wing_deg))

        # 4. Measure Loop Latency
        t_end = time.perf_counter_ns()
        latency_us = max(1, int((t_end - t_start) / 1000))
        self.latencies_us.append(latency_us)

        return TelemetryAck(
            status="INGESTED_RING_BUFFER",
            frame_seq_id=self.sequence_counter,
            latency_us=latency_us,
            ekf_residual_norm=round(residual_norm, 5),
        )

    def calculate_aero_state(self, speed_mph: Optional[float] = None) -> AeroStateResponse:
        """
        Solve downforce, drag, Center of Pressure, and ground-effect stall risk.
        """
        # Determine speed
        if speed_mph is None:
            if self.ring_buffer:
                speed_mph = self.ring_buffer[-1][1].speed_mph
            else:
                speed_mph = 150.0

        v_ms = max(0.0, speed_mph * MPH_TO_MS)
        q_dyn = 0.5 * AIR_DENSITY_SEA_LEVEL * (v_ms ** 2)

        # Dynamic ride height averages from EKF state
        h_front = max(5.0, (self.x[0] + self.x[1]) * 0.5)
        h_rear = max(5.0, (self.x[2] + self.x[3]) * 0.5)
        pitch_rad = self.x[4]
        wing_deg = self.x[6]

        # Ground-effect stall and diffuser choke risk calculation
        min_rear_h = min(self.x[2], self.x[3])
        if min_rear_h < CRIT_DIFFUSER_RIDE_HEIGHT:
            stall_risk = min(1.0, (CRIT_DIFFUSER_RIDE_HEIGHT - min_rear_h) / 5.0 + 0.3)
        elif min_rear_h < 18.0:
            stall_risk = (18.0 - min_rear_h) / 10.0
        else:
            stall_risk = 0.002

        self.stall_interlock_active = stall_risk > 0.85

        # Aerodynamic coefficients
        # Front lift coefficient with ground effect scaling
        c_l_front = max(0.25, 1.40 - 0.015 * h_front + 0.35 * pitch_rad)
        # Rear lift coefficient with wing flap and ground effect
        c_l_rear_base = max(0.35, 1.65 - 0.012 * h_rear)
        c_l_wing_delta = (wing_deg / MAX_WING_FLAP_DEG) * 0.85
        
        # If diffuser choke is detected, boundary layer separates, reducing rear downforce
        if self.stall_interlock_active:
            c_l_rear_base *= 0.55

        c_l_rear = c_l_rear_base + c_l_wing_delta

        # Drag coefficient
        c_d = 0.48 + (wing_deg / MAX_WING_FLAP_DEG) * 0.32 + abs(pitch_rad) * 0.12

        # Aerodynamic forces in Newtons -> convert to kgf
        downforce_front_n = q_dyn * S_REF_AREA * c_l_front
        downforce_rear_n = q_dyn * S_REF_AREA * c_l_rear
        downforce_total_n = downforce_front_n + downforce_rear_n
        drag_n = q_dyn * S_REF_AREA * c_d

        downforce_front_kgf = downforce_front_n * NEWTON_TO_KGF
        downforce_rear_kgf = downforce_rear_n * NEWTON_TO_KGF
        downforce_total_kgf = downforce_total_n * NEWTON_TO_KGF
        drag_kgf = drag_n * NEWTON_TO_KGF

        # Center of Pressure (CoP) percentage
        if downforce_total_kgf > 1.0:
            cop_front_pct = (downforce_front_kgf / downforce_total_kgf) * 100.0
        else:
            cop_front_pct = 42.0
        cop_rear_pct = max(0.0, 100.0 - cop_front_pct)

        return AeroStateResponse(
            cop_front_pct=round(cop_front_pct, 2),
            cop_rear_pct=round(cop_rear_pct, 2),
            downforce_total_kgf=round(downforce_total_kgf, 1),
            downforce_front_kgf=round(downforce_front_kgf, 1),
            downforce_rear_kgf=round(downforce_rear_kgf, 1),
            drag_kgf=round(drag_kgf, 1),
            wing_flap_deg=round(self.current_wing_deg, 2),
            stall_risk=round(stall_risk, 4),
        )

    def dispatch_drs_command(self, command: DrsCommandInput) -> DrsCommandResponse:
        """
        Validate, clamp, and dispatch rear flap / DRS actuator commands.
        """
        target = command.requested_angle_deg

        # Apply Stall Interlock Clamp
        if self.stall_interlock_active and target > 20.0:
            effective_target = 20.0
            status = "CLAMPED_STALL_INTERLOCK"
        else:
            effective_target = max(MIN_WING_FLAP_DEG, min(MAX_WING_FLAP_DEG, target))
            status = "DISPATCHED_CAN_ACTUATOR"

        self.target_wing_deg = effective_target

        return DrsCommandResponse(
            status=status,
            commanded_angle_deg=target,
            effective_angle_deg=self.target_wing_deg,
            slew_rate_dps=MAX_DRS_SLEW_DPS,
            reason=command.reason,
        )

    def get_health(self) -> EngineHealthResponse:
        """
        Produce 1000Hz engine diagnostics and P99 latency status.
        """
        p99_lat = 0.0
        if self.latencies_us:
            sorted_lat = sorted(self.latencies_us)
            p99_idx = int(len(sorted_lat) * 0.99)
            p99_lat = float(sorted_lat[min(p99_idx, len(sorted_lat) - 1)])

        return EngineHealthResponse(
            ring_buffer_capacity=self.capacity,
            frames_ingested=self.sequence_counter,
            loop_latency_p99_us=p99_lat,
            stall_interlock_active=self.stall_interlock_active,
        )
