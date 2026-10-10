import React, { useState, useEffect, useRef } from 'react';
import { 
  RunMode, 
  VehicleTelemetry, 
  BogieStatus, 
  CryoLoop, 
  CapacitorBank, 
  StatorSector, 
  TelemetryLog 
} from './types/telemetry';
import { HeaderHUD } from './components/HeaderHUD';
import { LevitationDynamics } from './components/LevitationDynamics';
import { GuidanceCanvas } from './components/GuidanceCanvas';
import { VehicleSchematic } from './components/VehicleSchematic';
import { PowerInductors } from './components/PowerInductors';
import { CommandDock } from './components/CommandDock';
import { TradeDressModal } from './components/TradeDressModal';
import { tacticalAudio } from './utils/audio';

export default function App() {
  // Audio state
  const [audioMuted, setAudioMuted] = useState(false);
  const [isTradeDressOpen, setIsTradeDressOpen] = useState(false);

  // Operational State
  const [runMode, setRunMode] = useState<RunMode>('SUPERCONDUCTING_LAUNCH');
  const [linearBraking, setLinearBraking] = useState<boolean>(false);
  const [emergencyScram, setEmergencyScram] = useState<boolean>(false);
  const [suspensionStiffness, setSuspensionStiffness] = useState<number>(210); // N/mm
  const [fluxBias, setFluxBias] = useState<number>(0); // %

  // Telemetry Metrics
  const [velocityKmh, setVelocityKmh] = useState<number>(340);
  const [accelG, setAccelG] = useState<number>(1.24);
  const [lateralDisplacementMm, setLateralDisplacementMm] = useState<number>(0.35);
  const [dampingResponsePercent, setDampingResponsePercent] = useState<number>(92.4);

  // Bogie Telemetry (Target: 15.0 mm)
  const [bogies, setBogies] = useState<BogieStatus[]>([
    { id: 'FL', label: 'BOGIE FL (PORT FWD)', gapMm: 15.12, targetGapMm: 15.0, fluxTesla: 3.42, status: 'nominal' },
    { id: 'FR', label: 'BOGIE FR (STBD FWD)', gapMm: 14.88, targetGapMm: 15.0, fluxTesla: 3.41, status: 'nominal' },
    { id: 'RL', label: 'BOGIE RL (PORT AFT)', gapMm: 15.05, targetGapMm: 15.0, fluxTesla: 3.39, status: 'nominal' },
    { id: 'RR', label: 'BOGIE RR (STBD AFT)', gapMm: 14.95, targetGapMm: 15.0, fluxTesla: 3.40, status: 'nominal' },
  ]);

  // Cryogenic Loop
  const [cryo, setCryo] = useState<CryoLoop>({
    coilTempKelvin: 4.22,
    coolantPressureBar: 14.2,
    heliumFlowRateLpm: 38.5,
    superconductingState: true,
    purgeActive: false,
  });

  // Dual Capacitor Banks
  const [capacitorBanks, setCapacitorBanks] = useState<[CapacitorBank, CapacitorBank]>([
    { id: 'A', chargePercent: 94, voltageKv: 4.18, tempCelsius: 42.1, regCaptureKw: 185 },
    { id: 'B', chargePercent: 92, voltageKv: 4.14, tempCelsius: 43.6, regCaptureKw: 172 },
  ]);

  // 8 Acceleration Stator Sectors
  const [sectors, setSectors] = useState<StatorSector[]>([
    { sector: 1, loadPercent: 68, phaseDeg: 0, frequencyHz: 340, activePulse: true },
    { sector: 2, loadPercent: 74, phaseDeg: 45, frequencyHz: 340, activePulse: false },
    { sector: 3, loadPercent: 82, phaseDeg: 90, frequencyHz: 345, activePulse: true },
    { sector: 4, loadPercent: 79, phaseDeg: 135, frequencyHz: 345, activePulse: false },
    { sector: 5, loadPercent: 71, phaseDeg: 180, frequencyHz: 340, activePulse: true },
    { sector: 6, loadPercent: 85, phaseDeg: 225, frequencyHz: 348, activePulse: false },
    { sector: 7, loadPercent: 88, phaseDeg: 270, frequencyHz: 350, activePulse: true },
    { sector: 8, loadPercent: 64, phaseDeg: 315, frequencyHz: 340, activePulse: false },
  ]);

  // Live Telemetry Logs
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: '1', timestamp: '20:19:10.420', source: 'FLUX_CONTROLLER', message: 'Tri-phase inverter synchronized with 400kHz guideway stator.', level: 'SUCCESS' },
    { id: '2', timestamp: '20:19:11.920', source: 'CRYO_SYSTEM', message: 'LHe cooling loop stabilized at 4.22K across quad bogie manifolds.', level: 'INFO' },
    { id: '3', timestamp: '20:19:13.420', source: 'GUIDEWAY_SENSOR', message: 'Guideway lane alignment deviation within +/- 0.40mm corridor.', level: 'INFO' },
    { id: '4', timestamp: '20:19:14.920', source: 'STATOR_SYNC', message: 'Linear motor sector excitation frequency elevated to 345Hz.', level: 'INFO' },
  ]);

  const [systemTime, setSystemTime] = useState<string>('20:19:54.000');
  const activeSectorIndex = useRef<number>(0);

  // Sync audio mute
  const handleToggleAudio = () => {
    const nextMuted = !audioMuted;
    setAudioMuted(nextMuted);
    tacticalAudio.enabled = !nextMuted;
  };

  // Automated Mock Telemetry Generator: Ticks every 1.5 seconds smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds())).padStart(3, '0')}`;
      setSystemTime(timeStr);

      // Determine Target Velocity & G-Force
      let targetVel = 380;
      let targetG = 1.2;

      if (emergencyScram) {
        targetVel = 0;
        targetG = -2.8;
      } else if (linearBraking) {
        targetVel = 45;
        targetG = -1.95;
      } else if (runMode === 'STATIONARY_LEVITATION') {
        targetVel = 0;
        targetG = 0.05;
      } else if (runMode === 'SUPERCONDUCTING_LAUNCH') {
        targetVel = 380 + (fluxBias * 4);
        targetG = 1.8 + (fluxBias * 0.05);
      } else if (runMode === 'MAX_FLUX_SPRINT') {
        targetVel = 590 + Math.random() * 25 + (fluxBias * 3);
        targetG = 4.2 + (fluxBias * 0.08);
      }

      // Smooth step towards target velocity
      setVelocityKmh(prev => {
        const delta = (targetVel - prev) * 0.35;
        const next = Math.max(0, Math.min(620, prev + delta + (Math.random() * 2 - 1)));
        return Number(next.toFixed(1));
      });

      // Update Accel G with realistic micro-jitter
      setAccelG(() => {
        const jitter = (Math.random() - 0.5) * 0.08;
        return Number((targetG + jitter).toFixed(2));
      });

      // Update Bogie Levitation Gap (15.0mm Target)
      const stiffnessFactor = (320 - suspensionStiffness) / 200; // Softer = more displacement
      setBogies(prev => prev.map(bogie => {
        const randomOsc = (Math.random() - 0.5) * 0.45 * (0.6 + stiffnessFactor);
        const nextGap = Math.max(12.5, Math.min(17.5, 15.0 + randomOsc + (fluxBias * 0.02)));
        const nextFlux = 3.40 + (fluxBias * 0.04) + (Math.random() - 0.5) * 0.06;
        return {
          ...bogie,
          gapMm: Number(nextGap.toFixed(2)),
          fluxTesla: Number(nextFlux.toFixed(2)),
          status: Math.abs(nextGap - 15.0) > 1.2 ? 'warning' : 'nominal'
        };
      }));

      // Cryo Thermal Loop
      setCryo(prev => {
        let nextTemp = prev.coilTempKelvin;
        if (prev.purgeActive) {
          // Rapid cool down
          nextTemp = Math.max(3.85, nextTemp - 0.28);
        } else if (runMode === 'MAX_FLUX_SPRINT') {
          // Heat builds slightly under max flux sprint
          nextTemp = Math.min(14.5, nextTemp + 0.08);
        } else {
          // Return toward optimal 4.20K
          nextTemp = prev.coilTempKelvin + (4.20 - prev.coilTempKelvin) * 0.2 + (Math.random() - 0.5) * 0.04;
        }

        return {
          ...prev,
          coilTempKelvin: Number(nextTemp.toFixed(2)),
          coolantPressureBar: Number((14.0 + (Math.random() - 0.5) * 0.4).toFixed(1)),
          heliumFlowRateLpm: Number((38.0 + (prev.purgeActive ? 22 : 0) + (Math.random() - 0.5) * 1.5).toFixed(1)),
          superconductingState: nextTemp < 18.0
        };
      });

      // Capacitor Banks & Regen Capture
      setCapacitorBanks(([bankA, bankB]) => {
        const isBraking = linearBraking || emergencyScram;
        const regenKw = isBraking ? 460 + Math.random() * 70 : 160 + Math.random() * 40;

        const nextACharge = Math.min(100, Math.max(60, bankA.chargePercent + (isBraking ? 1.5 : -0.4)));
        const nextBCharge = Math.min(100, Math.max(60, bankB.chargePercent + (isBraking ? 1.2 : -0.3)));

        return [
          {
            ...bankA,
            chargePercent: Number(nextACharge.toFixed(1)),
            voltageKv: Number((3.8 + (nextACharge / 100) * 0.42).toFixed(2)),
            tempCelsius: Number((41.0 + (isBraking ? 6.5 : 0) + (Math.random() - 0.5) * 0.8).toFixed(1)),
            regCaptureKw: Number((regenKw * 0.52).toFixed(0))
          },
          {
            ...bankB,
            chargePercent: Number(nextBCharge.toFixed(1)),
            voltageKv: Number((3.78 + (nextBCharge / 100) * 0.42).toFixed(2)),
            tempCelsius: Number((42.0 + (isBraking ? 7.0 : 0) + (Math.random() - 0.5) * 0.8).toFixed(1)),
            regCaptureKw: Number((regenKw * 0.48).toFixed(0))
          }
        ];
      });

      // 8 Stator Sectors Pulse Advance
      activeSectorIndex.current = (activeSectorIndex.current + 1) % 8;
      setSectors(prev => prev.map((sec, idx) => {
        const isCurrentPulse = idx === activeSectorIndex.current;
        let baseLoad = runMode === 'MAX_FLUX_SPRINT' ? 86 : runMode === 'SUPERCONDUCTING_LAUNCH' ? 72 : 18;
        if (emergencyScram) baseLoad = 0;
        const pulseBoost = isCurrentPulse ? 14 : 0;
        const randomLoad = baseLoad + pulseBoost + (Math.random() - 0.5) * 6;

        return {
          ...sec,
          activePulse: isCurrentPulse && !emergencyScram,
          loadPercent: Math.max(0, Math.min(100, Number(randomLoad.toFixed(0)))),
          frequencyHz: Math.round(runMode === 'MAX_FLUX_SPRINT' ? 440 : runMode === 'SUPERCONDUCTING_LAUNCH' ? 340 : 60)
        };
      }));

      // Lateral Micro-Oscillations
      setLateralDisplacementMm(prev => {
        const target = (Math.random() - 0.5) * 2.2 * stiffnessFactor;
        const damped = prev + (target - prev) * (dampingResponsePercent / 100);
        return Number(damped.toFixed(2));
      });

      setDampingResponsePercent(Number((90 + Math.random() * 8.5).toFixed(1)));

      // Periodically inject tactical telemetry log entries
      if (Math.random() > 0.35) {
        const sampleLogs: { source: TelemetryLog['source']; message: string; level: TelemetryLog['level'] }[] = [
          { source: 'FLUX_CONTROLLER', message: `Dynamic flux bias trimmed to ${fluxBias >= 0 ? '+' : ''}${fluxBias}%. Current coupling coefficient 0.994.`, level: 'INFO' },
          { source: 'GUIDEWAY_SENSOR', message: `Optical lane crosshair acquired stator fiducial track node #${Math.floor(Math.random() * 800) + 1200}.`, level: 'INFO' },
          { source: 'STATOR_SYNC', message: `Linear sector S${activeSectorIndex.current + 1} phase pulse locked at ${runMode === 'MAX_FLUX_SPRINT' ? '440' : '340'}Hz.`, level: 'INFO' },
          { source: 'CRYO_SYSTEM', message: `Helium return manifold pressure nominal at 14.1 bar. Heat load nominal.`, level: 'SUCCESS' },
          { source: 'BRAKE_ACTUATOR', message: `Linear eddy-current brake actuators calibrated on dual flux rails.`, level: 'INFO' },
        ];

        const chosen = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        const newLog: TelemetryLog = {
          id: String(Date.now()),
          timestamp: timeStr,
          source: chosen.source,
          message: chosen.message,
          level: chosen.level
        };

        setLogs(prev => [...prev.slice(-45), newLog]);
      }

    }, 1500);

    return () => clearInterval(interval);
  }, [runMode, linearBraking, emergencyScram, suspensionStiffness, fluxBias, dampingResponsePercent]);

  // Command Action: Toggle Linear Braking
  const handleToggleLinearBraking = () => {
    setLinearBraking(prev => {
      const next = !prev;
      const now = new Date().toLocaleTimeString();
      setLogs(l => [
        ...l, 
        {
          id: String(Date.now()),
          timestamp: now,
          source: 'BRAKE_ACTUATOR',
          message: next 
            ? 'HIGH-G LINEAR EDDY BRAKING ENGAGED! Regenerative capture peaked at 480kW.' 
            : 'Linear eddy brakes disengaged. Guideway thrust vector restored.',
          level: next ? 'WARN' : 'INFO'
        }
      ]);
      return next;
    });
  };

  // Command Action: Purge Thermal Loop
  const handlePurgeThermalLoop = () => {
    setCryo(c => ({ ...c, purgeActive: true }));
    const now = new Date().toLocaleTimeString();
    setLogs(l => [
      ...l,
      {
        id: String(Date.now()),
        timestamp: now,
        source: 'CRYO_SYSTEM',
        message: 'EMERGENCY CRYO PURGE INITIATED: Liquid Helium dump activated. Subcooling coils to 3.8K.',
        level: 'WARN'
      }
    ]);

    setTimeout(() => {
      setCryo(c => ({ ...c, purgeActive: false, coilTempKelvin: 3.9 }));
      setLogs(l => [
        ...l,
        {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          source: 'CRYO_SYSTEM',
          message: 'Thermal purge sequence complete. Cryo manifold restored to nominal 4.10K baseline.',
          level: 'SUCCESS'
        }
      ]);
    }, 4500);
  };

  // Command Action: Toggle Emergency SCRAM
  const handleToggleEmergencyScram = () => {
    setEmergencyScram(prev => {
      const next = !prev;
      const now = new Date().toLocaleTimeString();
      setLogs(l => [
        ...l,
        {
          id: String(Date.now()),
          timestamp: now,
          source: 'FLUX_CONTROLLER',
          message: next 
            ? 'CRITICAL EMERGENCY SCRAM ACTIVATED! Stator excitation killed, mechanical hover skid armed.'
            : 'SCRAM RESET. System interlocks verified. Stator excitation re-armed.',
          level: next ? 'CRITICAL' : 'SUCCESS'
        }
      ]);
      return next;
    });
  };

  // Command Action: Export Run Telemetry (.JSON)
  const handleExportTelemetryJson = () => {
    const runExport = {
      meta: {
        rig: "CHRONOS KINETIC-9 // MagLev Telemetry & Vector Rig",
        exportTimestamp: new Date().toISOString(),
        guidewayClass: "L4-AERO-VAC-GUIDEWAY",
        chassisMaterial: "Brushed Titanium / Forged Carbon Monocoque",
        cleanRoomLicense: "Ghost FactoryOS Track 2 - Institutional Asset"
      },
      telemetrySnapshot: {
        velocityKmh,
        accelG,
        runMode,
        linearBrakingEngaged: linearBraking,
        emergencyScram,
        suspensionStiffnessNmm: suspensionStiffness,
        fluxBiasPercent: fluxBias,
        lateralDisplacementMm,
        dampingResponsePercent,
        bogies,
        cryo,
        capacitorBanks,
        sectors
      },
      recentLogs: logs.slice(-20)
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chronos-k9-telemetry-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setLogs(l => [
      ...l,
      {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        source: 'FLUX_CONTROLLER',
        message: 'Telemetry package serialized and exported successfully as .JSON snapshot.',
        level: 'SUCCESS'
      }
    ]);
  };

  const handleResetCalibration = () => {
    setSuspensionStiffness(210);
    setFluxBias(0);
    setLogs(l => [
      ...l,
      {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        source: 'FLUX_CONTROLLER',
        message: 'Suspension stiffness reset to 210 N/mm; flux bias trimmed to 0%.',
        level: 'INFO'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 cockpit-grid flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      {/* 1. Header Telemetry HUD */}
      <HeaderHUD
        velocityKmh={velocityKmh}
        accelG={accelG}
        runMode={runMode}
        onSetRunMode={setRunMode}
        audioMuted={audioMuted}
        onToggleAudio={handleToggleAudio}
        systemTime={systemTime}
        linearBraking={linearBraking}
        emergencyScram={emergencyScram}
        onOpenTradeDress={() => setIsTradeDressOpen(true)}
      />

      {/* 2. Main 3-Column Operational Cockpit */}
      <main className="flex-1 max-w-[1780px] w-full mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Column 1: Levitation & Coil Dynamics (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <LevitationDynamics
              bogies={bogies}
              cryo={cryo}
              suspensionStiffness={suspensionStiffness}
              fluxBias={fluxBias}
              onChangeSuspension={setSuspensionStiffness}
              onChangeFluxBias={setFluxBias}
              onResetCalibration={handleResetCalibration}
              onTriggerCryoPurge={handlePurgeThermalLoop}
            />
          </div>

          {/* Column 2: Central Guidance Canvas & Vector Grid (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <GuidanceCanvas
              velocityKmh={velocityKmh}
              lateralDisplacementMm={lateralDisplacementMm}
              dampingResponsePercent={dampingResponsePercent}
              linearBraking={linearBraking}
              emergencyScram={emergencyScram}
            />

            <VehicleSchematic
              velocityKmh={velocityKmh}
              runMode={runMode}
              linearBraking={linearBraking}
              emergencyScram={emergencyScram}
              bogies={bogies}
            />
          </div>

          {/* Column 3: Power Reserves & Linear Inductors (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <PowerInductors
              capacitorBanks={capacitorBanks}
              sectors={sectors}
              logs={logs}
            />
          </div>

        </div>
      </main>

      {/* 3. Tactical Command Dock (Bottom Bar) */}
      <CommandDock
        linearBraking={linearBraking}
        onToggleLinearBraking={handleToggleLinearBraking}
        onPurgeThermalLoop={handlePurgeThermalLoop}
        purgeActive={cryo.purgeActive}
        emergencyScram={emergencyScram}
        onToggleEmergencyScram={handleToggleEmergencyScram}
        onExportTelemetryJson={handleExportTelemetryJson}
        onOpenTradeDress={() => setIsTradeDressOpen(true)}
      />

      {/* 4. Trade-Dress Defense & Dealership Fleet Tier Modal */}
      <TradeDressModal
        isOpen={isTradeDressOpen}
        onClose={() => setIsTradeDressOpen(false)}
      />
    </div>
  );
}
