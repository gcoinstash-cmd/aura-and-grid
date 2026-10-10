"""
Ghost FactoryOS — Engine GF-T3-147: Sol-Rotor Autonomous Heavy-Lift eVTOL
Comprehensive Engine Domain Unit Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.models import (
    Vector3D,
    Quaternion,
    FlightStateUpdateRequest,
    ControlAttitudeComputeRequest,
    SwarmSyncRequest,
    ActuatorReallocateRequest,
)
from src.engine import (
    quaternion_to_euler,
    FlightDynamicsEngine,
    SwarmConsensusEngine,
    SolRotorEngine,
)


class TestQuaternionKinematics:
    def test_identity_quaternion(self):
        q = Quaternion(w=1.0, x=0.0, y=0.0, z=0.0)
        euler = quaternion_to_euler(q)
        assert euler.roll == 0.0
        assert euler.pitch == 0.0
        assert euler.yaw == 0.0

    def test_pure_rotations(self):
        # 90 deg yaw around z-axis: cos(45)=0.7071, sin(45)=0.7071
        q_yaw = Quaternion(w=0.7071, x=0.0, y=0.0, z=0.7071)
        euler = quaternion_to_euler(q_yaw)
        assert abs(euler.yaw - 90.0) < 1.0


class TestFlightDynamicsEngine:
    def test_bem_inflow_solver(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        vi_hover = fde.solve_bem_inflow(thrust_n_per_rotor=3500.0, v_inf_x=0.0, v_inf_z=0.0)
        assert vi_hover > 5.0

        # In fast cruise, induced inflow decreases
        vi_cruise = fde.solve_bem_inflow(thrust_n_per_rotor=3500.0, v_inf_x=45.0, v_inf_z=0.0)
        assert vi_cruise < vi_hover

    def test_vrs_boundary_detection(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        vi0 = 12.0
        # Normal level cruise: no VRS
        assert fde.check_vrs_boundary(descent_speed_mps=0.0, forward_airspeed_mps=30.0, vi0=vi0) == "NONE"

        # Hazardous steep descent with low forward speed: CRITICAL VRS
        assert fde.check_vrs_boundary(descent_speed_mps=12.0, forward_airspeed_mps=5.0, vi0=vi0) == "CRITICAL"

        # Steep descent with moderate forward speed: CAUTION VRS
        assert fde.check_vrs_boundary(descent_speed_mps=12.0, forward_airspeed_mps=12.0, vi0=vi0) == "CAUTION"

    def test_estimate_state(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        req = FlightStateUpdateRequest(
            airframe_id="GF-T3-147",
            timestamp_ns=1791244800000000000,
            imu_accel=Vector3D(x=0.2, y=-0.1, z=-9.81),
            imu_gyro=Vector3D(x=0.01, y=0.02, z=0.05),
            gps_pos=Vector3D(x=100.0, y=200.0, z=-450.0),
            baro_alt_m=450.2,
            radar_alt_agl_m=448.5,
            nacelle_angle_deg=45.0,
        )
        res = fde.estimate_state(req)
        assert res.status == "STATE_ESTIMATED"
        assert res.airframe_id == "GF-T3-147"
        assert res.airspeed_kts >= 80.0
        assert res.ndi_latency_ms < 4.5
        assert res.vrs_risk in ["NONE", "CAUTION", "CRITICAL"]

    def test_ndi_attitude_control(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        req = ControlAttitudeComputeRequest(
            airframe_id="GF-T3-147",
            nacelle_target_deg=60.0,
        )
        res = fde.compute_ndi_control(req)
        assert res.calculation_time_ms < 4.5
        assert res.ndi_budget_ok is True
        assert res.total_thrust_kn > 30.0
        assert len(res.rotors_rpm) == 8
        assert res.aerodynamic_inflow_bem_vi_mps > 0.0

    def test_actuator_reallocation_failsafe(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        # Rotor 3 fails
        res = fde.reallocate_actuators(failed_rotor_id=3)
        assert res.reallocation_success is True
        assert res.active_rotors_count == 7
        assert res.ndi_thrust_margin_pct > 15.0
        assert res.safe_flight_envelope_maintained is True
        assert fde.rotor_health[2] is False


class TestSwarmConsensusEngine:
    def test_swarm_sync_patterns(self):
        sce = SwarmConsensusEngine("SWARM-GF-ALPHA-770")

        # Tactical Diamond
        req_diamond = SwarmSyncRequest(formation_pattern="TACTICAL_DIAMOND")
        res_diamond = sce.sync_consensus(req_diamond)
        assert res_diamond.algebraic_connectivity_lambda2 == 1.84
        assert res_diamond.formation_rms_error_m == 1.45

        # Cargo Sling Tether
        req_sling = SwarmSyncRequest(formation_pattern="CARGO_SLING_TETHER")
        res_sling = sce.sync_consensus(req_sling)
        assert res_sling.algebraic_connectivity_lambda2 == 2.45
        assert res_sling.formation_rms_error_m == 0.88

        # V Stagger
        req_v = SwarmSyncRequest(formation_pattern="V_STAGGER")
        res_v = sce.sync_consensus(req_v)
        assert res_v.algebraic_connectivity_lambda2 == 1.62

        # Default / Custom Pattern
        req_other = SwarmSyncRequest(formation_pattern="TRAIL_CONVOY")
        res_other = sce.sync_consensus(req_other)
        assert res_other.algebraic_connectivity_lambda2 == 1.50


class TestEdgeCases:
    def test_extreme_pitch_gimbal_lock(self):
        # 90 degrees pitch up: sinp = 1.0
        q_pitch = Quaternion(w=0.7071, x=0.0, y=0.7071, z=0.0)
        euler = quaternion_to_euler(q_pitch)
        assert abs(euler.pitch - 90.0) < 1.0

    def test_bem_zero_thrust_case(self):
        fde = FlightDynamicsEngine("GF-T3-147")
        vi_zero = fde.solve_bem_inflow(thrust_n_per_rotor=0.0, v_inf_x=0.0, v_inf_z=0.0)
        assert vi_zero == 0.0


class TestSolRotorEngine:
    def test_orchestrator(self):
        engine = SolRotorEngine("GF-T3-147")
        health = engine.get_health()
        assert health.status == "HEALTHY"
        assert health.computeBudgetMs == 4.50
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = engine.get_compliance()
        assert compliance.engineId == "GF-T3-147"
        assert compliance.copyleftViolations == 0
        assert "Apache-2.0" in compliance.license
