"""
Ghost FactoryOS — Engine GF-T3-149: Chrono-Chassis Telemetry Interface
Core Mathematical Telemetry Solver & Multi-Subsystem State Machine.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import math
import time
from datetime import datetime, timezone
from typing import List, Optional

from src.models import (
    DriveMode,
    ShockEventType,
    QuantumCoreTelemetry,
    ArbitrageVector,
    AeroMechanicalTelemetry,
    TelemetryState,
    EngineHealthResponse,
    AuditComplianceResponse,
)

INITIAL_ROUTES = [
    ArbitrageVector(
        route="AURORA ↔ LD4",
        sourceVenue="CME Chicago",
        targetVenue="Equinix London",
        distanceKm=6380.0,
        fiberLatencyNs=34100000,
        quantumChronoLatencyNs=31280000,
        deltaGainNs=2820000,
        projectedAlphaBps=4.82,
        annualizedYieldUsd=18450000.0,
        status="OPTIMAL",
    ),
    ArbitrageVector(
        route="NY4 ↔ TY3",
        sourceVenue="Secaucus NY",
        targetVenue="Tokyo TY3",
        distanceKm=10850.0,
        fiberLatencyNs=67200000,
        quantumChronoLatencyNs=61450000,
        deltaGainNs=5750000,
        projectedAlphaBps=8.15,
        annualizedYieldUsd=31200000.0,
        status="EXECUTING",
    ),
    ArbitrageVector(
        route="FR2 ↔ HKG1",
        sourceVenue="Frankfurt Eurex",
        targetVenue="Hong Kong HKEX",
        distanceKm=9160.0,
        fiberLatencyNs=58400000,
        quantumChronoLatencyNs=53100000,
        deltaGainNs=5300000,
        projectedAlphaBps=6.94,
        annualizedYieldUsd=24800000.0,
        status="CONVERGING",
    ),
    ArbitrageVector(
        route="LD4 ↔ SG1",
        sourceVenue="London LSE",
        targetVenue="Singapore SGX",
        distanceKm=10840.0,
        fiberLatencyNs=68900000,
        quantumChronoLatencyNs=63200000,
        deltaGainNs=5700000,
        projectedAlphaBps=7.42,
        annualizedYieldUsd=28100000.0,
        status="OPTIMAL",
    ),
]


class ChronoChassisEngine:
    """
    Stateful high-frequency telemetry core for GF-T3-149 Chrono-Chassis.
    """

    def __init__(self):
        self.engine_id = "GF-T3-149"
        self.system_code = "T3-QUANT-03"
        self.start_time = time.time()
        self.tick_count = 0

        self.state = TelemetryState(
            timestamp=datetime.now(timezone.utc).isoformat(),
            microsecondTime=time.time() * 1e6,
            driveMode="LATENCY_ARBITRAGE",
            quantum=QuantumCoreTelemetry(
                coherenceRate=99.984,
                qubitsActive=512,
                cryoTempMK=12.38,
                photonFluxTHz=420.84,
                hamiltonianEigenvalue=4.892,
                phaseDriftPs=0.124,
                laserEmeraldOutputW=48.5,
                laserGoldOutputW=36.2,
            ),
            aero=AeroMechanicalTelemetry(
                downforceKgf=1420.0,
                dragCoefficientCd=0.284,
                diffuserAngleDeg=14.5,
                frontSplitterSuctionHPa=890.0,
                pushrodStrainFrontKn=8.42,
                pushrodStrainRearKn=12.18,
                rideHeightMm=52.0,
                speedKmh=318.0,
                groundEffectVenturiLoadKgf=960.0,
            ),
            arbitrageRoutes=[r.model_copy() for r in INITIAL_ROUTES],
            accumulatedAlphaUsd=4821590.40,
            systemHealth=99.98,
            coolingPumpActive=True,
            conduitLaserFreqHz=5.32e14,
        )

    def tick(self) -> TelemetryState:
        """
        Executes a deterministic high-frequency physics cycle.
        """
        self.tick_count += 1
        now_utc = datetime.now(timezone.utc).isoformat()
        self.state.timestamp = now_utc
        self.state.microsecondTime = time.time() * 1e6

        sin1 = math.sin(self.tick_count * 0.1)
        cos1 = math.cos(self.tick_count * 0.07)

        # Quantum jitter
        self.state.quantum.cryoTempMK = round(12.38 + sin1 * 0.04, 3)
        self.state.quantum.phaseDriftPs = round(0.124 + abs(cos1) * 0.035, 3)
        self.state.quantum.photonFluxTHz = round(420.84 + sin1 * 1.2, 2)
        self.state.quantum.coherenceRate = round(99.980 + abs(sin1) * 0.018, 3)

        # Mechanical suspension dynamic strain
        self.state.aero.pushrodStrainFrontKn = round(8.42 + sin1 * 0.35, 2)
        self.state.aero.pushrodStrainRearKn = round(12.18 + cos1 * 0.45, 2)

        # Incremental alpha accumulation
        self.state.accumulatedAlphaUsd = round(self.state.accumulatedAlphaUsd + 18.45 + abs(sin1) * 12.3, 2)

        # Periodic route jitter
        if self.tick_count % 10 == 0:
            for idx, r in enumerate(self.state.arbitrageRoutes):
                jitter = math.sin(self.tick_count + idx) * 0.15
                r.projectedAlphaBps = round(r.projectedAlphaBps + jitter * 0.08, 2)

        return self.get_state()

    def set_drive_mode(self, mode: DriveMode) -> TelemetryState:
        self.state.driveMode = mode
        if mode == "LATENCY_ARBITRAGE":
            self.state.quantum.laserEmeraldOutputW = 54.2
            self.state.quantum.laserGoldOutputW = 42.0
            self.state.aero.downforceKgf = 1420.0
            self.state.aero.speedKmh = 320.0
        elif mode == "CROSS_EXCHANGE":
            self.state.quantum.laserEmeraldOutputW = 45.0
            self.state.quantum.laserGoldOutputW = 48.0
            self.state.aero.downforceKgf = 1550.0
            self.state.aero.speedKmh = 295.0
        elif mode == "QUANTUM_SUPERPOSITION":
            self.state.quantum.laserEmeraldOutputW = 62.0
            self.state.quantum.laserGoldOutputW = 38.5
            self.state.quantum.coherenceRate = 99.998
            self.state.aero.downforceKgf = 1680.0
            self.state.aero.speedKmh = 345.0
        elif mode == "SLIPSTREAM_WARP":
            self.state.quantum.laserEmeraldOutputW = 68.0
            self.state.quantum.laserGoldOutputW = 52.0
            self.state.aero.downforceKgf = 2120.0
            self.state.aero.diffuserAngleDeg = 18.0
            self.state.aero.speedKmh = 412.0

        self.recompute_aero()
        return self.get_state()

    def set_diffuser_angle(self, angle: float) -> TelemetryState:
        clamped = max(10.0, min(25.0, angle))
        self.state.aero.diffuserAngleDeg = round(clamped, 1)
        self.recompute_aero()
        return self.get_state()

    def recompute_aero(self):
        angle = self.state.aero.diffuserAngleDeg
        speed = self.state.aero.speedKmh
        downforce = round(950.0 + angle * 38.5 + (speed * 0.8))
        self.state.aero.downforceKgf = float(downforce)
        self.state.aero.dragCoefficientCd = round(0.26 + (angle / 20.0) * 0.05, 3)
        self.state.aero.groundEffectVenturiLoadKgf = round(downforce * 0.68)

    def toggle_cryo_pump(self) -> TelemetryState:
        self.state.coolingPumpActive = not self.state.coolingPumpActive
        return self.get_state()

    def trigger_shock_event(self, shock_type: ShockEventType) -> TelemetryState:
        if shock_type == "FLASH_VOLATILITY":
            self.state.accumulatedAlphaUsd = round(self.state.accumulatedAlphaUsd + 42180.50, 2)
            for r in self.state.arbitrageRoutes:
                r.projectedAlphaBps = round(r.projectedAlphaBps * 1.45, 2)
                r.status = "EXECUTING"
        elif shock_type == "DECOHERENCE_PULSE":
            self.state.quantum.coherenceRate = 98.42
            self.state.quantum.phaseDriftPs = 0.89
        elif shock_type == "WARP_BURST":
            self.state.aero.speedKmh = 388.0
            self.state.aero.downforceKgf = 1890.0
            self.state.quantum.photonFluxTHz = 492.5
            self.recompute_aero()

        return self.get_state()

    def get_routes(self) -> List[ArbitrageVector]:
        return [r.model_copy() for r in self.state.arbitrageRoutes]

    def get_state(self) -> TelemetryState:
        return self.state.model_copy(deep=True)

    def get_health(self) -> EngineHealthResponse:
        return EngineHealthResponse(
            status="HEALTHY",
            engine_id=self.engine_id,
            system_code=self.system_code,
            uptime_seconds=round(time.time() - self.start_time, 2),
            drive_mode=self.state.driveMode,
            cryo_temp_mk=self.state.quantum.cryoTempMK,
            active_routes=len(self.state.arbitrageRoutes),
            cleanRoomCompliance="100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)",
        )

    def get_compliance(self) -> AuditComplianceResponse:
        return AuditComplianceResponse()
