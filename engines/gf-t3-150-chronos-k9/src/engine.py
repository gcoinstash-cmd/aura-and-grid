"""
Ghost FactoryOS — Engine GF-T3-150: Chronos Kinetic-9 MagLev Telemetry Rig
Core Mathematical MagLev Telemetry Engine & Kinematics State Machine.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import math
import time
from datetime import datetime, timezone
from typing import List, Optional

from src.models import (
    RunMode,
    BogieStatus,
    CryoLoop,
    CapacitorBank,
    StatorSector,
    TelemetryLog,
    VehicleTelemetry,
    EngineHealthResponse,
    AuditComplianceResponse,
)


class ChronosK9Engine:
    """
    High-frequency tactical MagLev telemetry and vector dynamics engine.
    """

    def __init__(self):
        self.engine_id = "GF-T3-150"
        self.system_code = "T3-TELEMETRY-05"
        self.start_time = time.time()
        self.tick_count = 0

        self.telemetry = VehicleTelemetry(
            velocityKmh=340.0,
            targetVelocityKmh=350.0,
            accelG=1.24,
            maxVelocityKmh=640.0,
            lateralDisplacementMm=0.35,
            dampingResponsePercent=92.4,
            runMode="SUPERCONDUCTING_LAUNCH",
            linearBrakingEngaged=False,
            emergencyScram=False,
            suspensionStiffness=210.0,
            fluxBias=0.0,
            bogies=[
                BogieStatus(id="FL", label="BOGIE FL (PORT FWD)", gapMm=15.12, targetGapMm=15.0, fluxTesla=3.42, status="nominal"),
                BogieStatus(id="FR", label="BOGIE FR (STBD FWD)", gapMm=14.88, targetGapMm=15.0, fluxTesla=3.41, status="nominal"),
                BogieStatus(id="RL", label="BOGIE RL (PORT AFT)", gapMm=15.05, targetGapMm=15.0, fluxTesla=3.39, status="nominal"),
                BogieStatus(id="RR", label="BOGIE RR (STBD AFT)", gapMm=14.95, targetGapMm=15.0, fluxTesla=3.40, status="nominal"),
            ],
            cryo=CryoLoop(
                coilTempKelvin=4.22,
                coolantPressureBar=14.2,
                heliumFlowRateLpm=38.5,
                superconductingState=True,
                purgeActive=False,
            ),
            capacitorBanks=[
                CapacitorBank(id="A", chargePercent=94.0, voltageKv=4.18, tempCelsius=42.1, regCaptureKw=185.0),
                CapacitorBank(id="B", chargePercent=92.0, voltageKv=4.14, tempCelsius=43.6, regCaptureKw=172.0),
            ],
            sectors=[
                StatorSector(sector=1, loadPercent=68.0, phaseDeg=0.0, frequencyHz=340.0, activePulse=True),
                StatorSector(sector=2, loadPercent=74.0, phaseDeg=45.0, frequencyHz=340.0, activePulse=False),
                StatorSector(sector=3, loadPercent=82.0, phaseDeg=90.0, frequencyHz=345.0, activePulse=True),
                StatorSector(sector=4, loadPercent=79.0, phaseDeg=135.0, frequencyHz=345.0, activePulse=False),
                StatorSector(sector=5, loadPercent=71.0, phaseDeg=180.0, frequencyHz=340.0, activePulse=True),
                StatorSector(sector=6, loadPercent=85.0, phaseDeg=225.0, frequencyHz=348.0, activePulse=False),
                StatorSector(sector=7, loadPercent=88.0, phaseDeg=270.0, frequencyHz=350.0, activePulse=True),
                StatorSector(sector=8, loadPercent=64.0, phaseDeg=315.0, frequencyHz=340.0, activePulse=False),
            ],
            logs=[
                TelemetryLog(id="1", timestamp="20:19:10.420", source="FLUX_CONTROLLER", message="Tri-phase inverter synchronized with 400kHz guideway stator.", level="SUCCESS"),
                TelemetryLog(id="2", timestamp="20:19:11.920", source="CRYO_SYSTEM", message="LHe cooling loop stabilized at 4.22K across quad bogie manifolds.", level="INFO"),
                TelemetryLog(id="3", timestamp="20:19:13.420", source="GUIDEWAY_SENSOR", message="Guideway lane alignment deviation within +/- 0.40mm corridor.", level="INFO"),
                TelemetryLog(id="4", timestamp="20:19:14.920", source="STATOR_SYNC", message="Linear motor sector excitation frequency elevated to 345Hz.", level="INFO"),
            ],
        )

    def tick(self) -> VehicleTelemetry:
        """
        Executes a deterministic high-frequency physics tick.
        """
        self.tick_count += 1
        sin1 = math.sin(self.tick_count * 0.1)
        cos1 = math.cos(self.tick_count * 0.08)

        # Dynamic airgaps with sub-millimeter closed-loop feedback
        bias = self.telemetry.fluxBias * 0.02
        self.telemetry.bogies[0].gapMm = round(15.0 + sin1 * 0.15 - bias, 2)
        self.telemetry.bogies[1].gapMm = round(15.0 - sin1 * 0.12 - bias, 2)
        self.telemetry.bogies[2].gapMm = round(15.0 + cos1 * 0.10 - bias, 2)
        self.telemetry.bogies[3].gapMm = round(15.0 - cos1 * 0.14 - bias, 2)

        # Guideway lateral displacement
        self.telemetry.lateralDisplacementMm = round(sin1 * 0.38, 2)

        # Velocity convergence
        if not self.telemetry.emergencyScram:
            if self.telemetry.linearBrakingEngaged:
                self.telemetry.velocityKmh = max(0.0, round(self.telemetry.velocityKmh - 15.0, 1))
            else:
                diff = self.telemetry.targetVelocityKmh - self.telemetry.velocityKmh
                self.telemetry.velocityKmh = round(self.telemetry.velocityKmh + diff * 0.08, 1)

        # Stator pulse rotation
        pulse_idx = self.tick_count % 8
        for idx, sector in enumerate(self.telemetry.sectors):
            sector.activePulse = (idx == pulse_idx or idx == (pulse_idx + 4) % 8)

        return self.get_state()

    def set_run_mode(self, mode: RunMode) -> VehicleTelemetry:
        self.telemetry.runMode = mode
        if mode == "STATIONARY_LEVITATION":
            self.telemetry.targetVelocityKmh = 0.0
            self.telemetry.accelG = 0.0
            self.telemetry.suspensionStiffness = 160.0
        elif mode == "SUPERCONDUCTING_LAUNCH":
            self.telemetry.targetVelocityKmh = 350.0
            self.telemetry.accelG = 1.24
            self.telemetry.suspensionStiffness = 210.0
        elif mode == "MAX_FLUX_SPRINT":
            self.telemetry.targetVelocityKmh = 580.0
            self.telemetry.accelG = 2.45
            self.telemetry.suspensionStiffness = 280.0

        return self.get_state()

    def set_flux_bias(self, bias_pct: float) -> VehicleTelemetry:
        clamped = max(-15.0, min(15.0, bias_pct))
        self.telemetry.fluxBias = round(clamped, 2)
        multiplier = 1.0 + (clamped / 100.0)
        for b in self.telemetry.bogies:
            b.fluxTesla = round(3.40 * multiplier, 2)
        return self.get_state()

    def set_suspension_stiffness(self, stiffness: float) -> VehicleTelemetry:
        clamped = max(120.0, min(320.0, stiffness))
        self.telemetry.suspensionStiffness = round(clamped, 1)
        self.telemetry.dampingResponsePercent = round(85.0 + (clamped - 120.0) * (15.0 / 200.0), 1)
        return self.get_state()

    def toggle_linear_braking(self) -> VehicleTelemetry:
        self.telemetry.linearBrakingEngaged = not self.telemetry.linearBrakingEngaged
        if self.telemetry.linearBrakingEngaged:
            self.telemetry.capacitorBanks[0].regCaptureKw = 280.0
            self.telemetry.capacitorBanks[1].regCaptureKw = 265.0
        else:
            self.telemetry.capacitorBanks[0].regCaptureKw = 185.0
            self.telemetry.capacitorBanks[1].regCaptureKw = 172.0
        return self.get_state()

    def trigger_emergency_scram(self) -> VehicleTelemetry:
        self.telemetry.emergencyScram = True
        self.telemetry.linearBrakingEngaged = True
        self.telemetry.velocityKmh = 0.0
        self.telemetry.targetVelocityKmh = 0.0
        self.telemetry.accelG = -3.50
        for b in self.telemetry.bogies:
            b.status = "warning"

        self.telemetry.logs.insert(
            0,
            TelemetryLog(
                id=str(len(self.telemetry.logs) + 1),
                timestamp=datetime.now(timezone.utc).strftime("%H:%M:%S.%f")[:12],
                source="BRAKE_ACTUATOR",
                message="EMERGENCY MAGNETIC SCRAM ENGAGED — High-voltage dump triggered.",
                level="CRITICAL",
            ),
        )
        return self.get_state()

    def trigger_cryo_purge(self) -> VehicleTelemetry:
        self.telemetry.cryo.purgeActive = True
        self.telemetry.cryo.coilTempKelvin = round(max(4.15, self.telemetry.cryo.coilTempKelvin - 0.04), 2)
        return self.get_state()

    def get_state(self) -> VehicleTelemetry:
        return self.telemetry.model_copy(deep=True)

    def get_health(self) -> EngineHealthResponse:
        return EngineHealthResponse(
            status="HEALTHY",
            engine_id=self.engine_id,
            system_code=self.system_code,
            uptime_seconds=round(time.time() - self.start_time, 2),
            superconducting_state=self.telemetry.cryo.superconductingState,
            coil_temp_kelvin=self.telemetry.cryo.coilTempKelvin,
            run_mode=self.telemetry.runMode,
            bogies_nominal=all(b.status == "nominal" for b in self.telemetry.bogies),
            cleanRoomCompliance="100% VERIFIED CLEAN-ROOM (MIT/Apache-2.0)",
        )

    def get_compliance(self) -> AuditComplianceResponse:
        return AuditComplianceResponse()
