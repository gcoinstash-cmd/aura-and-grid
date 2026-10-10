"""
Ghost FactoryOS — Engine GF-T3-149: Chrono-Chassis Telemetry Interface
Unit Tests for Telemetry Engine & Physical State Machines.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.engine import ChronoChassisEngine, INITIAL_ROUTES


class TestChronoChassisEngine:
    def test_engine_initialization(self):
        engine = ChronoChassisEngine()
        assert engine.engine_id == "GF-T3-149"
        assert engine.system_code == "T3-QUANT-03"

        state = engine.get_state()
        assert state.driveMode == "LATENCY_ARBITRAGE"
        assert state.quantum.qubitsActive == 512
        assert state.quantum.coherenceRate > 99.0
        assert state.aero.diffuserAngleDeg == 14.5
        assert len(state.arbitrageRoutes) == len(INITIAL_ROUTES)
        assert state.coolingPumpActive is True

    def test_engine_tick(self):
        engine = ChronoChassisEngine()
        initial_alpha = engine.get_state().accumulatedAlphaUsd
        # Run multiple ticks
        for _ in range(12):
            next_state = engine.tick()
        assert next_state.accumulatedAlphaUsd > initial_alpha
        assert next_state.quantum.cryoTempMK > 12.0
        assert next_state.aero.pushrodStrainFrontKn > 0

    def test_set_drive_modes(self):
        engine = ChronoChassisEngine()

        # LATENCY_ARBITRAGE
        state = engine.set_drive_mode("LATENCY_ARBITRAGE")
        assert state.driveMode == "LATENCY_ARBITRAGE"
        assert state.quantum.laserEmeraldOutputW == 54.2
        assert state.aero.speedKmh == 320.0

        # CROSS_EXCHANGE
        state = engine.set_drive_mode("CROSS_EXCHANGE")
        assert state.driveMode == "CROSS_EXCHANGE"
        assert state.quantum.laserEmeraldOutputW == 45.0
        assert state.aero.speedKmh == 295.0

        # QUANTUM_SUPERPOSITION
        state = engine.set_drive_mode("QUANTUM_SUPERPOSITION")
        assert state.driveMode == "QUANTUM_SUPERPOSITION"
        assert state.quantum.coherenceRate == 99.998
        assert state.aero.speedKmh == 345.0

        # SLIPSTREAM_WARP
        state = engine.set_drive_mode("SLIPSTREAM_WARP")
        assert state.driveMode == "SLIPSTREAM_WARP"
        assert state.quantum.laserEmeraldOutputW == 68.0
        assert state.aero.diffuserAngleDeg == 18.0
        assert state.aero.speedKmh == 412.0

    def test_set_diffuser_angle_and_aero_recompute(self):
        engine = ChronoChassisEngine()

        # Normal valid range
        state = engine.set_diffuser_angle(20.0)
        assert state.aero.diffuserAngleDeg == 20.0
        assert state.aero.downforceKgf > 1500
        assert state.aero.groundEffectVenturiLoadKgf > 0
        assert state.aero.dragCoefficientCd > 0.28

        # Clamping lower bound
        state_clamped_low = engine.set_diffuser_angle(5.0)
        assert state_clamped_low.aero.diffuserAngleDeg == 10.0

        # Clamping upper bound
        state_clamped_high = engine.set_diffuser_angle(30.0)
        assert state_clamped_high.aero.diffuserAngleDeg == 25.0

    def test_toggle_cryo_pump(self):
        engine = ChronoChassisEngine()
        assert engine.get_state().coolingPumpActive is True

        state = engine.toggle_cryo_pump()
        assert state.coolingPumpActive is False

        state = engine.toggle_cryo_pump()
        assert state.coolingPumpActive is True

    def test_trigger_shock_events(self):
        engine = ChronoChassisEngine()

        # FLASH_VOLATILITY
        alpha_before = engine.get_state().accumulatedAlphaUsd
        state_flash = engine.trigger_shock_event("FLASH_VOLATILITY")
        assert state_flash.accumulatedAlphaUsd >= alpha_before + 40000.0
        assert all(r.status == "EXECUTING" for r in state_flash.arbitrageRoutes)

        # DECOHERENCE_PULSE
        state_pulse = engine.trigger_shock_event("DECOHERENCE_PULSE")
        assert state_pulse.quantum.coherenceRate == 98.42
        assert state_pulse.quantum.phaseDriftPs == 0.89

        # WARP_BURST
        state_warp = engine.trigger_shock_event("WARP_BURST")
        assert state_warp.aero.speedKmh == 388.0
        assert state_warp.aero.downforceKgf > 1800.0
        assert state_warp.quantum.photonFluxTHz == 492.5

    def test_get_routes(self):
        engine = ChronoChassisEngine()
        routes = engine.get_routes()
        assert len(routes) == 4
        assert routes[0].route == "AURORA ↔ LD4"
        assert routes[0].deltaGainNs > 0

    def test_health_and_compliance(self):
        engine = ChronoChassisEngine()
        health = engine.get_health()
        assert health.status == "HEALTHY"
        assert health.engine_id == "GF-T3-149"
        assert health.active_routes == 4
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = engine.get_compliance()
        assert compliance.engineId == "GF-T3-149"
        assert compliance.systemCode == "T3-QUANT-03"
        assert compliance.copyleftViolations == 0
        assert "Apache-2.0" in compliance.license
