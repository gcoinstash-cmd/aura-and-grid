"""
Ghost FactoryOS — Engine GF-T3-150: Chronos Kinetic-9 MagLev Telemetry Rig
Unit Tests for MagLev Telemetry Engine & Dynamic State Machines.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.engine import ChronosK9Engine


class TestChronosK9Engine:
    def test_engine_initialization(self):
        engine = ChronosK9Engine()
        assert engine.engine_id == "GF-T3-150"
        assert engine.system_code == "T3-TELEMETRY-05"

        state = engine.get_state()
        assert state.velocityKmh == 340.0
        assert state.runMode == "SUPERCONDUCTING_LAUNCH"
        assert len(state.bogies) == 4
        assert state.cryo.superconductingState is True
        assert len(state.capacitorBanks) == 2
        assert len(state.sectors) == 8
        assert len(state.logs) >= 4

    def test_engine_tick_and_airgaps(self):
        engine = ChronosK9Engine()
        # Tick multiple times
        for _ in range(16):
            state = engine.tick()

        # Airgaps should remain in nominal corridor (14.0mm to 16.0mm)
        for bogie in state.bogies:
            assert 14.0 <= bogie.gapMm <= 16.0

        # Check active pulses rotate through sectors
        active_sectors = [s for s in state.sectors if s.activePulse]
        assert len(active_sectors) >= 1

    def test_set_run_modes(self):
        engine = ChronosK9Engine()

        # STATIONARY_LEVITATION
        state = engine.set_run_mode("STATIONARY_LEVITATION")
        assert state.runMode == "STATIONARY_LEVITATION"
        assert state.targetVelocityKmh == 0.0
        assert state.suspensionStiffness == 160.0

        # SUPERCONDUCTING_LAUNCH
        state = engine.set_run_mode("SUPERCONDUCTING_LAUNCH")
        assert state.runMode == "SUPERCONDUCTING_LAUNCH"
        assert state.targetVelocityKmh == 350.0
        assert state.suspensionStiffness == 210.0

        # MAX_FLUX_SPRINT
        state = engine.set_run_mode("MAX_FLUX_SPRINT")
        assert state.runMode == "MAX_FLUX_SPRINT"
        assert state.targetVelocityKmh == 580.0
        assert state.suspensionStiffness == 280.0

    def test_set_flux_bias(self):
        engine = ChronosK9Engine()

        # Normal bias
        state = engine.set_flux_bias(10.0)
        assert state.fluxBias == 10.0
        for b in state.bogies:
            assert b.fluxTesla > 3.40

        # Clamping lower bound (-15%)
        state_low = engine.set_flux_bias(-25.0)
        assert state_low.fluxBias == -15.0

        # Clamping upper bound (+15%)
        state_high = engine.set_flux_bias(30.0)
        assert state_high.fluxBias == 15.0

    def test_set_suspension_stiffness(self):
        engine = ChronosK9Engine()

        state = engine.set_suspension_stiffness(250.0)
        assert state.suspensionStiffness == 250.0
        assert state.dampingResponsePercent > 85.0

        # Clamping low
        state_low = engine.set_suspension_stiffness(90.0)
        assert state_low.suspensionStiffness == 120.0

        # Clamping high
        state_high = engine.set_suspension_stiffness(400.0)
        assert state_high.suspensionStiffness == 320.0

    def test_toggle_linear_braking(self):
        engine = ChronosK9Engine()
        assert engine.get_state().linearBrakingEngaged is False

        # Engage
        state = engine.toggle_linear_braking()
        assert state.linearBrakingEngaged is True
        assert state.capacitorBanks[0].regCaptureKw == 280.0

        # Disengage
        state = engine.toggle_linear_braking()
        assert state.linearBrakingEngaged is False
        assert state.capacitorBanks[0].regCaptureKw == 185.0

    def test_emergency_scram(self):
        engine = ChronosK9Engine()

        state = engine.trigger_emergency_scram()
        assert state.emergencyScram is True
        assert state.linearBrakingEngaged is True
        assert state.velocityKmh == 0.0
        assert state.accelG == -3.50
        for b in state.bogies:
            assert b.status == "warning"
        assert state.logs[0].level == "CRITICAL"

    def test_cryo_purge(self):
        engine = ChronosK9Engine()
        assert engine.get_state().cryo.purgeActive is False

        state = engine.trigger_cryo_purge()
        assert state.cryo.purgeActive is True
        assert state.cryo.coilTempKelvin <= 4.22

    def test_health_and_compliance(self):
        engine = ChronosK9Engine()
        health = engine.get_health()
        assert health.status == "HEALTHY"
        assert health.engine_id == "GF-T3-150"
        assert health.system_code == "T3-TELEMETRY-05"
        assert health.superconducting_state is True
        assert health.coil_temp_kelvin == 4.22
        assert health.bogies_nominal is True
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = engine.get_compliance()
        assert compliance.engineId == "GF-T3-150"
        assert compliance.copyleftViolations == 0
        assert "Apache-2.0" in compliance.license
        assert "Maxwell" in compliance.mathematicalProof

    def test_tick_with_linear_braking(self):
        engine = ChronosK9Engine()
        engine.toggle_linear_braking()
        assert engine.get_state().linearBrakingEngaged is True
        v_before = engine.get_state().velocityKmh
        state = engine.tick()
        assert state.velocityKmh < v_before

