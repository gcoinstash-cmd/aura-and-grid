import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Gauge,
  Zap,
  Wind,
  ShieldAlert,
  Cpu,
  BatteryCharging,
  Radio,
  Play,
  Pause,
  Sliders,
  RefreshCw,
  Feather,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  X,
  Copy,
  Flame,
  Layers,
  Disc,
  Thermometer,
  ShieldCheck,
  Compass,
  CornerDownRight,
  Terminal,
  Crosshair,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

// Drive Modes Definition
type DriveMode = 'PURE TRACK' | 'ENDURANCE QUALI' | 'TOP-SPEED VMAX' | 'REGEN CRUISER';
type TabView = 'COCKPIT HUD' | 'TORQUE VECTORING' | 'AERO & BRAKES' | 'STINT LEDGER' | 'SYSTEM LOGS';

interface MotorData {
  id: string;
  name: string;
  position: 'FL' | 'FR' | 'RL' | 'RR';
  torqueNm: number;
  rpm: number;
  tempC: number;
  inverterTempC: number;
  slipRatio: number;
  efficiency: number;
}

interface SectorRecord {
  id: string;
  lap: number;
  sector: 1 | 2 | 3;
  timeSec: number;
  deltaSec: number;
  apexSpeedKmh: number;
  energyKwhKm: number;
  rotorTemps: { fl: number; fr: number; rl: number; rr: number };
  pressureKpa: number;
  status: 'PURPLE' | 'GREEN' | 'YELLOW';
}

interface DiagnosticLog {
  id: string;
  timestamp: string;
  category: string;
  name: string;
  severity: 'INFO' | 'ADVISORY' | 'WARNING' | 'CRITICAL';
  metric: string;
  subsystem: string;
  details: string;
}

export function HypercarTelemetryDeck() {
  // Global Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 5>(1);
  const [activeTab, setActiveTab] = useState<TabView>('COCKPIT HUD');
  const [driveMode, setDriveMode] = useState<DriveMode>('ENDURANCE QUALI');

  // Keyed DRS Overdrive & Launch Decouple Toggle
  const [drsEngaged, setDrsEngaged] = useState<boolean>(false);
  const [launchDecoupled, setLaunchDecoupled] = useState<boolean>(false);

  // Active Modals
  const [modalOpen, setModalOpen] = useState<'torque' | 'purge' | 'aero' | 'export' | null>(null);
  const [selectedWheel, setSelectedWheel] = useState<'FL' | 'FR' | 'RL' | 'RR' | null>('FL');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [purgeStage, setPurgeStage] = useState<number>(0);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  // Operational Tuning State
  const [torqueBiasFront, setTorqueBiasFront] = useState<number>(38); // 38% front, 62% rear
  const [yawDamping, setYawDamping] = useState<number>(1.85);
  const [aeroWingAngleOverride, setAeroWingAngleOverride] = useState<number>(24.0);
  const [failSafeLock, setFailSafeLock] = useState<boolean>(true);

  // Live Telemetry Telemetry Frame State
  const [telemetry, setTelemetry] = useState({
    speedKmh: 342.4,
    totalPowerKw: 1450.0,
    inverterTempC: 48.6,
    downforceKg: 1120.0,
    regenHarvestKw: 380.0,
    aeroAoADeg: 24.0,
    batterySocPct: 88.4,
    cellDeltaMv: 3.8,
    coolantFlowLpm: 42.0,
    lateralG: 1.85,
    longitudinalG: -0.65,
    frictionTrail: [
      { x: 0.8, y: -0.4 },
      { x: 1.2, y: -0.2 },
      { x: 1.6, y: 0.1 },
      { x: 1.85, y: -0.65 }
    ]
  });

  // Quad Motor Realtime Array
  const [motors, setMotors] = useState<MotorData[]>([
    { id: 'm-fl', name: 'Front-Left Axial Flux', position: 'FL', torqueNm: 412.5, rpm: 2860, tempC: 62.4, inverterTempC: 46.2, slipRatio: 1.15, efficiency: 97.2 },
    { id: 'm-fr', name: 'Front-Right Axial Flux', position: 'FR', torqueNm: 418.0, rpm: 2864, tempC: 63.1, inverterTempC: 47.1, slipRatio: 1.20, efficiency: 96.9 },
    { id: 'm-rl', name: 'Rear-Left Axial Flux', position: 'RL', torqueNm: 642.0, rpm: 2910, tempC: 71.8, inverterTempC: 51.4, slipRatio: 1.42, efficiency: 96.4 },
    { id: 'm-rr', name: 'Rear-Right Axial Flux', position: 'RR', torqueNm: 655.5, rpm: 2915, tempC: 73.2, inverterTempC: 52.8, slipRatio: 1.48, efficiency: 96.1 }
  ]);

  // Sector Ledger Records (12 initial records)
  const [sectorRecords, setSectorRecords] = useState<SectorRecord[]>([
    { id: 's-17-3', lap: 17, sector: 3, timeSec: 26.904, deltaSec: -0.491, apexSpeedKmh: 328.7, energyKwhKm: 1.925, rotorTemps: { fl: 571.2, fr: 585.3, rl: 518.0, rr: 531.0 }, pressureKpa: 211.2, status: 'PURPLE' },
    { id: 's-17-2', lap: 17, sector: 2, timeSec: 42.490, deltaSec: -0.492, apexSpeedKmh: 180.1, energyKwhKm: 2.365, rotorTemps: { fl: 684.0, fr: 699.5, rl: 602.1, rr: 616.4 }, pressureKpa: 213.2, status: 'GREEN' },
    { id: 's-17-1', lap: 17, sector: 1, timeSec: 28.245, deltaSec: -0.352, apexSpeedKmh: 291.5, energyKwhKm: 2.095, rotorTemps: { fl: 604.2, fr: 618.0, rl: 536.0, rr: 549.5 }, pressureKpa: 210.5, status: 'GREEN' },
    { id: 's-16-3', lap: 16, sector: 3, timeSec: 26.812, deltaSec: -0.583, apexSpeedKmh: 332.0, energyKwhKm: 1.910, rotorTemps: { fl: 578.0, fr: 592.1, rl: 524.6, rr: 538.2 }, pressureKpa: 211.8, status: 'PURPLE' },
    { id: 's-16-2', lap: 16, sector: 2, timeSec: 42.340, deltaSec: -0.642, apexSpeedKmh: 182.4, energyKwhKm: 2.350, rotorTemps: { fl: 692.4, fr: 708.2, rl: 610.5, rr: 625.0 }, pressureKpa: 214.1, status: 'PURPLE' },
    { id: 's-16-1', lap: 16, sector: 1, timeSec: 28.190, deltaSec: -0.407, apexSpeedKmh: 294.0, energyKwhKm: 2.080, rotorTemps: { fl: 610.5, fr: 624.0, rl: 542.1, rr: 556.0 }, pressureKpa: 211.0, status: 'PURPLE' },
    { id: 's-15-3', lap: 15, sector: 3, timeSec: 26.985, deltaSec: -0.410, apexSpeedKmh: 324.5, energyKwhKm: 1.940, rotorTemps: { fl: 560.1, fr: 574.0, rl: 508.3, rr: 519.7 }, pressureKpa: 210.4, status: 'GREEN' },
    { id: 's-15-2', lap: 15, sector: 2, timeSec: 42.610, deltaSec: -0.372, apexSpeedKmh: 178.6, energyKwhKm: 2.380, rotorTemps: { fl: 671.0, fr: 685.4, rl: 588.2, rr: 601.5 }, pressureKpa: 212.5, status: 'GREEN' },
    { id: 's-15-1', lap: 15, sector: 1, timeSec: 28.320, deltaSec: -0.277, apexSpeedKmh: 289.1, energyKwhKm: 2.110, rotorTemps: { fl: 595.6, fr: 608.2, rl: 528.0, rr: 539.4 }, pressureKpa: 209.8, status: 'YELLOW' },
    { id: 's-14-3', lap: 14, sector: 3, timeSec: 27.155, deltaSec: -0.240, apexSpeedKmh: 318.0, energyKwhKm: 1.980, rotorTemps: { fl: 540.0, fr: 551.3, rl: 490.5, rr: 502.8 }, pressureKpa: 209.2, status: 'GREEN' },
    { id: 's-14-2', lap: 14, sector: 2, timeSec: 42.890, deltaSec: -0.092, apexSpeedKmh: 174.2, energyKwhKm: 2.420, rotorTemps: { fl: 648.2, fr: 662.0, rl: 565.4, rr: 580.1 }, pressureKpa: 211.0, status: 'YELLOW' },
    { id: 's-14-1', lap: 14, sector: 1, timeSec: 28.412, deltaSec: -0.185, apexSpeedKmh: 286.4, energyKwhKm: 2.140, rotorTemps: { fl: 582.4, fr: 594.1, rl: 512.0, rr: 524.6 }, pressureKpa: 208.5, status: 'YELLOW' }
  ]);

  // System Diagnostics & Driver Events Log
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    { id: 'log-1', timestamp: '10:42:18.042', category: 'AERODYNAMICS', name: 'Aero DRS Engage Command', severity: 'INFO', metric: '12.0° AoA / -68% Drag', subsystem: 'ACTIVE_AERO_ECU', details: 'DRS hydraulic actuator triggered past 280 km/h straightaway threshold.' },
    { id: 'log-2', timestamp: '10:41:54.810', category: 'TORQUE_VECTORING', name: 'Torque Vector Bias Shift', severity: 'INFO', metric: '38:62 F/R Yaw Lock', subsystem: 'CHASSIS_DYNAMICS_MCU', details: 'Apex turn-in yaw damping modulated for high-speed cornering stability.' },
    { id: 'log-3', timestamp: '10:41:31.220', category: 'POWERTRAIN', name: 'Regen Threshold Check', severity: 'INFO', metric: '380 kW / 900V SiC', subsystem: 'ENERGY_HARVEST_MCU', details: 'Brake blend controller recapturing maximum allowable recuperation.' },
    { id: 'log-4', timestamp: '10:40:48.915', category: 'THERMAL', name: 'Immersion Coolant Loop Stage 2', severity: 'ADVISORY', metric: '42.0 L/min / 48.6°C', subsystem: 'IMMERSION_THERMAL_CTRL', details: 'Fluorochemical immersion pump elevated to stage 2 continuous flow.' },
    { id: 'log-5', timestamp: '10:39:12.604', category: 'BATTERY_MANAGEMENT', name: 'Solid-State Cell Delta Equilibrium', severity: 'INFO', metric: '3.8 mV Spread', subsystem: 'BMS_CORE', details: '95 kWh pack cell balance check complete across all 216 series modules.' },
    { id: 'log-6', timestamp: '10:38:05.118', category: 'BRAKE_SYSTEM', name: 'Carbon-Ceramic Rotor Thermal Peak', severity: 'ADVISORY', metric: '708.2°C (FR Rotor)', subsystem: 'BRAKE_SYSTEM_BY_WIRE', details: 'Heavy braking zone from 332 km/h into Bus Stop chicane.' },
    { id: 'log-7', timestamp: '10:37:22.441', category: 'CHASSIS_SAFETY', name: 'G-Force Friction Circle Envelope', severity: 'INFO', metric: '2.68G Lateral Peak', subsystem: 'VEHICLE_STATE_ESTIMATOR', details: 'Pouhon cornering sequence logged 2.68G sustained lateral acceleration.' },
    { id: 'log-8', timestamp: '10:35:10.090', category: 'TRANSMISSION', name: 'Launch Decouple Key Armed', severity: 'INFO', metric: 'Zero Backlash Lock', subsystem: 'POWERTRAIN_CLUTCH_GATEWAY', details: 'Front axial-flux planetary decoupling clutch ready for top speed pass.' }
  ]);

  // Tick counter ref
  const tickRef = useRef<number>(0);

  // Real-time Physics & Telemetry Tick Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current * 0.1 * simSpeed;

      // Adjust parameters based on driveMode
      let targetSpeed = 342.4;
      let targetPower = 1450.0;
      let targetAoA = 24.0;
      let targetDownforce = 1120.0;
      let targetRegen = 380.0;

      if (driveMode === 'TOP-SPEED VMAX') {
        targetSpeed = drsEngaged ? 386.5 : 368.0;
        targetPower = 1580.0;
        targetAoA = drsEngaged ? 12.0 : 16.0;
        targetDownforce = 740.0;
        targetRegen = 220.0;
      } else if (driveMode === 'PURE TRACK') {
        targetSpeed = 328.0;
        targetPower = 1480.0;
        targetAoA = 32.0;
        targetDownforce = 1380.0;
        targetRegen = 410.0;
      } else if (driveMode === 'REGEN CRUISER') {
        targetSpeed = 245.0;
        targetPower = 680.0;
        targetAoA = 18.0;
        targetDownforce = 620.0;
        targetRegen = 480.0;
      }

      // Sine oscillations to mimic cornering and acceleration
      const speedOsc = Math.sin(t * 0.7) * 8.5;
      const powerOsc = Math.cos(t * 0.9) * 45.0;
      const latG = Math.sin(t * 1.1) * 2.2;
      const longG = Math.cos(t * 0.8) * 1.5;

      const currentSpeed = parseFloat((targetSpeed + speedOsc).toFixed(1));
      const currentPower = parseFloat((targetPower + powerOsc).toFixed(0));
      const currentInverterTemp = parseFloat((48.6 + Math.sin(t * 0.2) * 2.4).toFixed(1));
      const currentDownforce = parseFloat((targetDownforce * (currentSpeed / 300) ** 2).toFixed(0));
      const currentRegen = parseFloat((targetRegen + Math.sin(t * 1.4) * 25).toFixed(0));
      const currentAoA = parseFloat((targetAoA + Math.sin(t * 0.5) * 1.2).toFixed(1));

      // Update friction trail
      setTelemetry((prev) => {
        const nextTrail = [
          ...prev.frictionTrail.slice(-6),
          { x: parseFloat(latG.toFixed(2)), y: parseFloat(longG.toFixed(2)) }
        ];

        return {
          speedKmh: currentSpeed,
          totalPowerKw: currentPower,
          inverterTempC: currentInverterTemp,
          downforceKg: currentDownforce,
          regenHarvestKw: currentRegen,
          aeroAoADeg: currentAoA,
          batterySocPct: Math.max(12.0, parseFloat((prev.batterySocPct - 0.004 * simSpeed).toFixed(2))),
          cellDeltaMv: parseFloat((3.8 + Math.sin(t * 0.3) * 0.4).toFixed(1)),
          coolantFlowLpm: parseFloat((42.0 + Math.cos(t * 0.4) * 1.5).toFixed(1)),
          lateralG: parseFloat(latG.toFixed(2)),
          longitudinalG: parseFloat(longG.toFixed(2)),
          frictionTrail: nextTrail
        };
      });

      // Update Quad Motors dynamic torque & rpm
      const baseRpm = Math.floor(currentSpeed * 8.35);
      const frontFraction = torqueBiasFront / 100;
      const rearFraction = (100 - torqueBiasFront) / 100;
      const totalTorqueNm = (currentPower * 1000) / (baseRpm * 0.1047 || 1);

      const latTransfer = latG * 45; // torque transfer across axle

      setMotors([
        {
          id: 'm-fl',
          name: 'Front-Left Axial Flux',
          position: 'FL',
          torqueNm: parseFloat(((totalTorqueNm * frontFraction * 0.5) - latTransfer).toFixed(1)),
          rpm: baseRpm + Math.floor(latG * 12),
          tempC: parseFloat((62.4 + Math.sin(t * 0.15) * 3).toFixed(1)),
          inverterTempC: parseFloat((46.2 + Math.sin(t * 0.2) * 2).toFixed(1)),
          slipRatio: parseFloat((1.15 + Math.abs(latG) * 0.18).toFixed(2)),
          efficiency: 97.2
        },
        {
          id: 'm-fr',
          name: 'Front-Right Axial Flux',
          position: 'FR',
          torqueNm: parseFloat(((totalTorqueNm * frontFraction * 0.5) + latTransfer).toFixed(1)),
          rpm: baseRpm - Math.floor(latG * 12),
          tempC: parseFloat((63.1 + Math.sin(t * 0.18) * 3).toFixed(1)),
          inverterTempC: parseFloat((47.1 + Math.sin(t * 0.22) * 2).toFixed(1)),
          slipRatio: parseFloat((1.20 + Math.abs(latG) * 0.17).toFixed(2)),
          efficiency: 96.9
        },
        {
          id: 'm-rl',
          name: 'Rear-Left Axial Flux',
          position: 'RL',
          torqueNm: parseFloat(((totalTorqueNm * rearFraction * 0.5) - latTransfer * 1.4).toFixed(1)),
          rpm: baseRpm + Math.floor(latG * 18),
          tempC: parseFloat((71.8 + Math.sin(t * 0.25) * 4).toFixed(1)),
          inverterTempC: parseFloat((51.4 + Math.sin(t * 0.28) * 3).toFixed(1)),
          slipRatio: parseFloat((1.42 + Math.abs(latG) * 0.22).toFixed(2)),
          efficiency: 96.4
        },
        {
          id: 'm-rr',
          name: 'Rear-Right Axial Flux',
          position: 'RR',
          torqueNm: parseFloat(((totalTorqueNm * rearFraction * 0.5) + latTransfer * 1.4).toFixed(1)),
          rpm: baseRpm - Math.floor(latG * 18),
          tempC: parseFloat((73.2 + Math.sin(t * 0.3) * 4).toFixed(1)),
          inverterTempC: parseFloat((52.8 + Math.sin(t * 0.32) * 3).toFixed(1)),
          slipRatio: parseFloat((1.48 + Math.abs(latG) * 0.24).toFixed(2)),
          efficiency: 96.1
        }
      ]);
    }, 400 / simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, driveMode, drsEngaged, torqueBiasFront]);

  // Coolant Purge Sequence Handler
  const handleStartPurge = () => {
    setIsPurging(true);
    setPurgeStage(1);
    setTimeout(() => setPurgeStage(2), 1200);
    setTimeout(() => setPurgeStage(3), 2400);
    setTimeout(() => {
      setPurgeStage(4);
      setIsPurging(false);
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().substring(11, 23),
          category: 'THERMAL',
          name: 'Manual Coolant Loop Flush Executed',
          severity: 'INFO',
          metric: '44.8 L/min / 3.4 Bar',
          subsystem: 'IMMERSION_THERMAL_CTRL',
          details: 'Fluorochemical immersion loop degassed, micro-bubble traps purged, pump duty cycle calibrated.'
        },
        ...prev
      ]);
    }, 3600);
  };

  // CSV Export Generator
  const generateCsvData = useMemo(() => {
    const headers = 'Lap,Sector,Time_Sec,Delta_Ref_Sec,Apex_Speed_Kmh,Energy_Kwh_Km,FL_Rotor_C,FR_Rotor_C,RL_Rotor_C,RR_Rotor_C,Tire_Pressure_Kpa,Sector_Status\n';
    const rows = sectorRecords
      .map(
        (r) =>
          `${r.lap},${r.sector},${r.timeSec.toFixed(3)},${r.deltaSec.toFixed(3)},${r.apexSpeedKmh.toFixed(1)},${r.energyKwhKm.toFixed(3)},${r.rotorTemps.fl},${r.rotorTemps.fr},${r.rotorTemps.rl},${r.rotorTemps.rr},${r.pressureKpa},${r.status}`
      )
      .join('\n');
    return headers + rows;
  }, [sectorRecords]);

  const handleDownloadCsv = () => {
    const blob = new Blob([generateCsvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VORTEX_APEX_GT_PROTO09_STINT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(generateCsvData);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono selection:bg-lime-500 selection:text-black">
        {/* TOP STATUS BAR & FLIGHT CONTROLS */}
        <header className="w-full bg-[#0B0F17] border-b border-[#1E293B] px-4 py-2.5">
          <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left: Grouped Chassis Badge, Status Dot & Primary Title (Never Breaks Awkwardly) */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="inline-flex items-center gap-2 bg-[#111827] border border-lime-500/40 px-3 py-1 rounded">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-lime-400">
                  LIVE MONOCOQUE BUS
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 whitespace-nowrap">
                VORTEX APEX-GT // QUAD-MOTOR HYPERCAR PROTO-09
              </h1>
            </div>

            {/* Right: Flight Deck Control Strip (h-9 bounds, Single Row) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Play / Pause Toggle */}
              <div className="inline-flex items-center bg-[#111827] border border-[#1E293B] rounded p-0.5 h-9">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`h-7 px-3 rounded flex items-center gap-1.5 text-xs font-bold font-mono transition-colors ${
                    isPlaying
                      ? 'bg-lime-500 text-black shadow-[0_0_12px_rgba(132,204,22,0.5)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>STREAMING</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSED</span>
                    </>
                  )}
                </button>
              </div>

              {/* Playback Multiplier */}
              <div className="inline-flex items-center bg-[#111827] border border-[#1E293B] rounded p-0.5 h-9">
                <button
                  type="button"
                  onClick={() => setSimSpeed(1)}
                  className={`h-7 px-2.5 rounded text-xs font-bold font-mono transition-colors ${
                    simSpeed === 1
                      ? 'bg-slate-700 text-lime-400 border border-lime-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1X
                </button>
                <button
                  type="button"
                  onClick={() => setSimSpeed(5)}
                  className={`h-7 px-2.5 rounded text-xs font-bold font-mono transition-colors ${
                    simSpeed === 5
                      ? 'bg-slate-700 text-lime-400 border border-lime-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  5X WARP
                </button>
              </div>

              {/* Keyed DRS Overdrive Toggle */}
              <button
                type="button"
                onClick={() => setDrsEngaged(!drsEngaged)}
                className={`h-9 px-3.5 rounded border text-xs md:text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-2 transition-all ${
                  drsEngaged
                    ? 'bg-lime-950/80 border-lime-400 text-lime-300 shadow-[0_0_16px_rgba(132,204,22,0.4)]'
                    : 'bg-[#111827] border-[#1E293B] text-slate-300 hover:border-slate-600'
                }`}
              >
                <Wind className={`w-4 h-4 ${drsEngaged ? 'text-lime-400 animate-pulse' : 'text-slate-400'}`} />
                <span>DRS OVERDRIVE {drsEngaged ? '[ACTIVE -68%]' : '[STANDBY]'}</span>
              </button>

              {/* Launch Decouple Keyed Switch */}
              <button
                type="button"
                onClick={() => setLaunchDecoupled(!launchDecoupled)}
                className={`h-9 px-3 rounded border text-xs md:text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 transition-all ${
                  launchDecoupled
                    ? 'bg-amber-950/70 border-amber-400 text-amber-300'
                    : 'bg-[#111827] border-[#1E293B] text-slate-300 hover:border-slate-600'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${launchDecoupled ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>DECOUPLE {launchDecoupled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* PANE 1: TOP POWERTRAIN & VELOCITY HUD (High-Contrast Large Typography) */}
        <section className="w-full bg-[#0B0F17]/95 border-b border-[#1E293B] px-4 py-4">
          <div className="max-w-[1720px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Metric 1: Ground Speed */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  GROUND SPEED
                </span>
                <Gauge className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.speedKmh.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400">KM/H</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span>VMAX GOV: 395 KM/H</span>
                <span className="text-lime-400 font-bold">GPS-RTK ±1CM</span>
              </div>
            </div>

            {/* Metric 2: Total Power Output */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  TOTAL POWER
                </span>
                <Zap className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.totalPowerKw.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">KW</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span className="text-slate-300 font-bold">1,944 HP DYN</span>
                <span className="text-lime-400 font-bold">900V SiC BUS</span>
              </div>
            </div>

            {/* Metric 3: Inverter Temp */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  SiC INVERTER
                </span>
                <Thermometer className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.inverterTempC.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400">°C</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span>JUNCTION: 54.2°C</span>
                <span className="text-emerald-400 font-bold">NOMINAL</span>
              </div>
            </div>

            {/* Metric 4: Aerodynamic Downforce */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  DOWNFORCE
                </span>
                <Layers className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.downforceKg.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">KG</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span>@ 300 KM/H</span>
                <span className="text-lime-400 font-bold">AOA {telemetry.aeroAoADeg}°</span>
              </div>
            </div>

            {/* Metric 5: Regen Braking Harvest */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  REGEN HARVEST
                </span>
                <BatteryCharging className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.regenHarvestKw.toFixed(0)}
                </span>
                <span className="text-xs font-bold text-slate-400">KW</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span>BLEND RATIO: 82%</span>
                <span className="text-emerald-400 font-bold">HYDRAULIC SAFE</span>
              </div>
            </div>

            {/* Metric 6: Battery Pack Status */}
            <div className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/50 p-3.5 rounded transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  SOLID-STATE SOC
                </span>
                <Activity className="w-4 h-4 text-lime-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-lime-400">
                  {telemetry.batterySocPct.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400">%</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-mono flex justify-between">
                <span>95 KWH PACK</span>
                <span className="text-lime-400 font-bold">Δ {telemetry.cellDeltaMv} MV</span>
              </div>
            </div>
          </div>
        </section>

        {/* RESPONSIVE HORIZONTAL TAB NAVIGATION (Guaranteed Zero Truncation) */}
        <nav className="w-full bg-[#080D1A] border-b border-[#1E293B] px-4">
          <div className="max-w-[1720px] mx-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex items-center gap-2 py-2">
            {(['COCKPIT HUD', 'TORQUE VECTORING', 'AERO & BRAKES', 'STINT LEDGER', 'SYSTEM LOGS'] as TabView[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-9 px-4 rounded text-xs md:text-sm font-bold font-mono tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-lime-500 text-black shadow-[0_0_14px_rgba(132,204,22,0.4)]'
                      : 'bg-[#111827] text-slate-300 hover:text-white hover:bg-slate-800 border border-[#1E293B]'
                  }`}
                >
                  {tab === 'COCKPIT HUD' && <Gauge className="w-4 h-4" />}
                  {tab === 'TORQUE VECTORING' && <Zap className="w-4 h-4" />}
                  {tab === 'AERO & BRAKES' && <Wind className="w-4 h-4" />}
                  {tab === 'STINT LEDGER' && <Disc className="w-4 h-4" />}
                  {tab === 'SYSTEM LOGS' && <Terminal className="w-4 h-4" />}
                  <span>{tab}</span>
                </button>
              );
            })}

            {/* Quick telemetry sync indicator */}
            <div className="ml-auto hidden xl:flex items-center gap-3 pl-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Radio className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
                CAN-FD 5.0 MBPS // 1000 HZ STREAM
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">CHASSIS: PROTO-09</span>
            </div>
          </div>
        </nav>

        {/* MAIN 4-PANE OPERATIONAL CONTENT CANVAS */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 flex flex-col gap-4">
          {/* TAB 1 & 2 DUAL SPLIT: CENTER-LEFT (Active Aero & G-Force) and CENTER-RIGHT (Quad Motor Vectoring) */}
          {(activeTab === 'COCKPIT HUD' || activeTab === 'TORQUE VECTORING' || activeTab === 'AERO & BRAKES') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* PANE 2: CENTER-LEFT 2D ACTIVE AERO & G-FORCE SLIP CANVAS (lg:col-span-6) */}
              <div className="lg:col-span-6 bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-lime-400" />
                      <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                        ACTIVE AERO & G-FORCE SLIP CANVAS
                      </h2>
                    </div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/30 text-lime-400">
                      TELEMETRY RADAR
                    </span>
                  </div>

                  {/* Drive Mode Selector Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {(['PURE TRACK', 'ENDURANCE QUALI', 'TOP-SPEED VMAX', 'REGEN CRUISER'] as DriveMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setDriveMode(mode)}
                        className={`py-2 px-2 rounded text-xs font-bold font-mono tracking-wider uppercase text-center transition-all border ${
                          driveMode === mode
                            ? 'bg-lime-950/70 border-lime-400 text-lime-300 shadow-[0_0_10px_rgba(132,204,22,0.3)]'
                            : 'bg-[#111827] border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* 2D Top-Down Chassis Silhouette & Friction Radar Canvas */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#070B14] p-3 rounded-lg border border-[#1E293B]/70">
                    {/* SVG Top-Down Hypercar Monocoque & Slip Vectors (sm:col-span-7) */}
                    <div className="sm:col-span-7 flex flex-col items-center">
                      <div className="text-xs font-bold font-mono text-slate-400 mb-2 flex items-center justify-between w-full px-2">
                        <span>AERODYNAMIC PROFILE // AoA {telemetry.aeroAoADeg}°</span>
                        <span className="text-lime-400 font-bold">{drsEngaged ? 'DRS OPEN' : 'AUTO-AERO'}</span>
                      </div>

                      <div className="relative w-full max-w-[280px] h-[340px] flex items-center justify-center">
                        <svg viewBox="0 0 280 340" className="w-full h-full drop-shadow-md">
                          {/* Grid Background Lines */}
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                            </pattern>
                            <linearGradient id="chassisGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1E293B" />
                              <stop offset="50%" stopColor="#0F172A" />
                              <stop offset="100%" stopColor="#0B0F17" />
                            </linearGradient>
                          </defs>
                          <rect width="280" height="340" fill="url(#grid)" opacity="0.6" />

                          {/* Centerline */}
                          <line x1="140" y1="10" x2="140" y2="330" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

                          {/* Front Splitter & Ground Effect Vortex Tunnels */}
                          <path d="M 90 40 L 140 18 L 190 40 L 210 55 L 70 55 Z" fill="#111827" stroke="#84CC16" strokeWidth="1.5" />
                          <text x="140" y="32" fill="#84CC16" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                            VENTURI TUNNEL
                          </text>

                          {/* Main Carbon Monocoque Cockpit Silhouette */}
                          <path
                            d="M 100 55 C 80 80, 75 140, 75 200 C 75 250, 85 280, 95 300 L 185 300 C 195 280, 205 250, 205 200 C 205 140, 200 80, 180 55 Z"
                            fill="url(#chassisGrad)"
                            stroke="#334155"
                            strokeWidth="2"
                          />

                          {/* Cockpit Canopy */}
                          <ellipse cx="140" cy="150" rx="28" ry="50" fill="#030712" stroke="#475569" strokeWidth="1.5" />
                          <circle cx="140" cy="135" r="10" fill="#1E293B" stroke="#84CC16" strokeWidth="1" />

                          {/* Active Rear Multi-Element Wing (Angle of Attack representation) */}
                          <g transform={`rotate(${drsEngaged ? 0 : (telemetry.aeroAoADeg - 24) * 0.4}, 140, 310)`}>
                            <rect
                              x="50"
                              y="306"
                              width="180"
                              height={drsEngaged ? 6 : 14}
                              rx="2"
                              fill={drsEngaged ? '#84CC16' : '#1E293B'}
                              stroke="#84CC16"
                              strokeWidth="1.5"
                            />
                            <text x="140" y="316" fill={drsEngaged ? '#000000' : '#84CC16'} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                              {drsEngaged ? 'DRS FLAT 12° AoA' : `ACTIVE AIRFOIL ${telemetry.aeroAoADeg}°`}
                            </text>
                          </g>

                          {/* 4 Tires with Dynamic Contact Patches & Slip Vectors */}
                          {/* Front-Left Wheel */}
                          <g
                            onClick={() => setSelectedWheel('FL')}
                            className="cursor-pointer"
                            transform={`rotate(${telemetry.lateralG * -3.5}, 55, 80)`}
                          >
                            <rect x="44" y="62" width="22" height="38" rx="4" fill="#0B0F17" stroke={selectedWheel === 'FL' ? '#84CC16' : '#475569'} strokeWidth={selectedWheel === 'FL' ? 2.5 : 1.5} />
                            <rect x="47" y="65" width="16" height="32" fill="#84CC16" opacity={0.35 + (motors[0]?.slipRatio || 1) * 0.2} />
                            <text x="35" y="82" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="end">FL</text>
                            {/* Slip angle vector line */}
                            <line x1="55" y1="80" x2={55 + telemetry.lateralG * 6} y2="60" stroke="#84CC16" strokeWidth="2" />
                          </g>

                          {/* Front-Right Wheel */}
                          <g
                            onClick={() => setSelectedWheel('FR')}
                            className="cursor-pointer"
                            transform={`rotate(${telemetry.lateralG * -3.5}, 225, 80)`}
                          >
                            <rect x="214" y="62" width="22" height="38" rx="4" fill="#0B0F17" stroke={selectedWheel === 'FR' ? '#84CC16' : '#475569'} strokeWidth={selectedWheel === 'FR' ? 2.5 : 1.5} />
                            <rect x="217" y="65" width="16" height="32" fill="#84CC16" opacity={0.35 + (motors[1]?.slipRatio || 1) * 0.2} />
                            <text x="245" y="82" fill="#94A3B8" fontSize="8" fontFamily="monospace">FR</text>
                            <line x1="225" y1="80" x2={225 + telemetry.lateralG * 6} y2="60" stroke="#84CC16" strokeWidth="2" />
                          </g>

                          {/* Rear-Left Wheel */}
                          <g onClick={() => setSelectedWheel('RL')} className="cursor-pointer">
                            <rect x="40" y="240" width="26" height="44" rx="4" fill="#0B0F17" stroke={selectedWheel === 'RL' ? '#84CC16' : '#475569'} strokeWidth={selectedWheel === 'RL' ? 2.5 : 1.5} />
                            <rect x="44" y="244" width="18" height="36" fill="#84CC16" opacity={0.45 + (motors[2]?.slipRatio || 1) * 0.2} />
                            <text x="30" y="264" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="end">RL</text>
                            <line x1="53" y1="262" x2={53 + telemetry.lateralG * 4} y2="238" stroke="#84CC16" strokeWidth="2" />
                          </g>

                          {/* Rear-Right Wheel */}
                          <g onClick={() => setSelectedWheel('RR')} className="cursor-pointer">
                            <rect x="214" y="240" width="26" height="44" rx="4" fill="#0B0F17" stroke={selectedWheel === 'RR' ? '#84CC16' : '#475569'} strokeWidth={selectedWheel === 'RR' ? 2.5 : 1.5} />
                            <rect x="218" y="244" width="18" height="36" fill="#84CC16" opacity={0.45 + (motors[3]?.slipRatio || 1) * 0.2} />
                            <text x="248" y="264" fill="#94A3B8" fontSize="8" fontFamily="monospace">RR</text>
                            <line x1="227" y1="262" x2={227 + telemetry.lateralG * 4} y2="238" stroke="#84CC16" strokeWidth="2" />
                          </g>
                        </svg>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1">CLICK WHEEL TO INSPECT CONTACT PATCH</span>
                    </div>

                    {/* Dynamic G-Force Friction Radar & Tire Inspector (sm:col-span-5) */}
                    <div className="sm:col-span-5 flex flex-col items-center gap-3">
                      <div className="w-full text-center">
                        <span className="text-xs font-bold font-mono text-slate-300">
                          G-FORCE FRICTION RADAR [2.8G MAX]
                        </span>
                      </div>

                      {/* Radar SVG Circle */}
                      <div className="relative w-44 h-44 flex items-center justify-center bg-[#0B0F17] rounded-full border border-slate-800">
                        <svg viewBox="0 0 160 160" className="w-full h-full">
                          {/* Concentric G circles */}
                          <circle cx="80" cy="80" r="25" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,2" />
                          <circle cx="80" cy="80" r="50" fill="none" stroke="#334155" strokeWidth="1" />
                          <circle cx="80" cy="80" r="70" fill="none" stroke="#84CC16" strokeWidth="1.2" strokeOpacity="0.6" />

                          {/* Axes */}
                          <line x1="80" y1="5" x2="80" y2="155" stroke="#334155" strokeWidth="1" />
                          <line x1="5" y1="80" x2="155" y2="80" stroke="#334155" strokeWidth="1" />

                          {/* Labels */}
                          <text x="80" y="18" fill="#64748B" fontSize="8" textAnchor="middle" fontFamily="monospace">2.8G ACCEL</text>
                          <text x="80" y="150" fill="#64748B" fontSize="8" textAnchor="middle" fontFamily="monospace">2.8G BRAKE</text>
                          <text x="145" y="83" fill="#64748B" fontSize="8" textAnchor="end" fontFamily="monospace">R</text>
                          <text x="15" y="83" fill="#64748B" fontSize="8" textAnchor="start" fontFamily="monospace">L</text>

                          {/* Historical friction trail */}
                          {telemetry.frictionTrail.map((pt, idx) => (
                            <circle
                              key={idx}
                              cx={80 + (pt.x / 2.8) * 65}
                              cy={80 - (pt.y / 2.8) * 65}
                              r={idx + 1.5}
                              fill="#84CC16"
                              opacity={0.2 + idx * 0.15}
                            />
                          ))}

                          {/* Current G Vector Vector Dot */}
                          <circle
                            cx={80 + (telemetry.lateralG / 2.8) * 65}
                            cy={80 - (telemetry.longitudinalG / 2.8) * 65}
                            r="5.5"
                            fill="#84CC16"
                            className="animate-pulse shadow-lg"
                          />
                        </svg>
                      </div>

                      {/* Current Vector Numerical Readout */}
                      <div className="w-full bg-[#111827] border border-[#1E293B] p-2.5 rounded text-xs font-mono">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>LATERAL G:</span>
                          <span className="font-bold text-lime-400 tabular-nums">
                            {telemetry.lateralG >= 0 ? `+${telemetry.lateralG.toFixed(2)}` : telemetry.lateralG.toFixed(2)} G
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300 mt-1">
                          <span>LONGITUDINAL G:</span>
                          <span className="font-bold text-lime-400 tabular-nums">
                            {telemetry.longitudinalG >= 0 ? `+${telemetry.longitudinalG.toFixed(2)}` : telemetry.longitudinalG.toFixed(2)} G
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Wheel Contact Patch Micro-Deck */}
                <div className="mt-4 pt-3 border-t border-[#1E293B] bg-[#0E1524] p-3 rounded">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-slate-200">
                      TIRE {selectedWheel} ACTIVE CONTACT PATCH
                    </span>
                    <span className="text-lime-400 font-bold">205.0 KPA / HOT</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#111827] p-1.5 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Inner Temp</div>
                      <div className="font-bold text-slate-100">88.4°C</div>
                    </div>
                    <div className="bg-[#111827] p-1.5 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Center Temp</div>
                      <div className="font-bold text-lime-400">86.2°C</div>
                    </div>
                    <div className="bg-[#111827] p-1.5 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Outer Temp</div>
                      <div className="font-bold text-slate-100">83.9°C</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANE 3: CENTER-RIGHT QUAD-MOTOR TORQUE VECTORING & INVERTER DIAGNOSTICS (lg:col-span-6) */}
              <div className="lg:col-span-6 bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-lime-400" />
                      <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                        QUAD-MOTOR TORQUE VECTORING & INVERTERS
                      </h2>
                    </div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/30 text-lime-400">
                      4X AXIAL-FLUX
                    </span>
                  </div>

                  {/* 4 Motors Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {motors.map((motor) => {
                      const isHighThermal = motor.tempC > 72.0;
                      return (
                        <div
                          key={motor.id}
                          className="bg-[#111827] border border-[#1E293B] hover:border-lime-500/40 p-3.5 rounded-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm font-bold font-mono tracking-wider text-slate-200">
                              {motor.position} // {motor.name.replace(' Axial Flux', '')}
                            </span>
                            <span
                              className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                                isHighThermal
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {motor.efficiency}% EFF
                            </span>
                          </div>

                          {/* Torque & RPM */}
                          <div className="mt-3 flex items-baseline justify-between">
                            <div>
                              <div className="text-[11px] text-slate-400 font-mono">TORQUE VECTOR</div>
                              <div className="text-2xl font-black font-mono tabular-nums text-lime-400">
                                {motor.torqueNm.toFixed(1)}{' '}
                                <span className="text-xs font-normal text-slate-400">NM</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[11px] text-slate-400 font-mono">SPEED</div>
                              <div className="text-lg font-bold font-mono tabular-nums text-slate-100">
                                {motor.rpm.toLocaleString()}{' '}
                                <span className="text-xs font-normal text-slate-400">RPM</span>
                              </div>
                            </div>
                          </div>

                          {/* Torque Bar Visualizer */}
                          <div className="mt-2 w-full bg-slate-900 h-2 rounded overflow-hidden">
                            <div
                              className="h-full bg-lime-500 transition-all duration-300"
                              style={{ width: `${Math.min(100, (motor.torqueNm / 800) * 100)}%` }}
                            />
                          </div>

                          {/* Thermals & Slip */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                            <div>
                              <span className="text-slate-400">Inverter:</span>{' '}
                              <span className="text-slate-100 font-bold">{motor.inverterTempC.toFixed(1)}°C</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400">Stator:</span>{' '}
                              <span className={isHighThermal ? 'text-amber-400 font-bold' : 'text-slate-100 font-bold'}>
                                {motor.tempC.toFixed(1)}°C
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Slip Ratio:</span>{' '}
                              <span className="text-lime-400 font-bold">{motor.slipRatio}%</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400">Thermal Thresh:</span>{' '}
                              <span className="text-slate-300 font-bold">
                                {((motor.tempC / 110) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Immersion Cooling & Solid-State Pack Diagnostic Strip */}
                <div className="mt-4 pt-3 border-t border-[#1E293B] bg-[#0E1524] p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-slate-400 uppercase">Immersion Coolant Loop:</span>{' '}
                      <span className="font-bold text-cyan-400 tabular-nums">{telemetry.coolantFlowLpm.toFixed(1)} L/MIN</span>
                      <span className="text-slate-500 ml-1">(STAGE 2 ACTIVE)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-lime-400" />
                    <div>
                      <span className="text-slate-400 uppercase">Pack Voltage Spread:</span>{' '}
                      <span className="font-bold text-lime-400 tabular-nums">Δ {telemetry.cellDeltaMv} MV</span>
                      <span className="text-slate-500 ml-1">(216 CELL BALANCED)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANE 4: BOTTOM LAP SECTOR MANIFEST & ENERGY TELEMETRY LEDGER */}
          {(activeTab === 'COCKPIT HUD' || activeTab === 'STINT LEDGER') && (
            <section className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E293B] pb-3 mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <Disc className="w-5 h-5 text-lime-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    LAP SECTOR MANIFEST & ENERGY TELEMETRY LEDGER
                  </h2>
                </div>

                {/* 4 Required Quick Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setModalOpen('torque')}
                    className="h-8 px-3 rounded bg-[#111827] border border-[#1E293B] hover:border-lime-500 text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-lime-400" />
                    <span>RECALIBRATE TORQUE BIAS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen('purge')}
                    className="h-8 px-3 rounded bg-[#111827] border border-[#1E293B] hover:border-cyan-400 text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PURGE COOLANT LOOP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen('aero')}
                    className="h-8 px-3 rounded bg-[#111827] border border-[#1E293B] hover:border-amber-400 text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Feather className="w-3.5 h-3.5 text-amber-400" />
                    <span>STOW AERO WING</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen('export')}
                    className="h-8 px-3 rounded bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-[0_0_12px_rgba(132,204,22,0.4)]"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>EXPORT STINT CSV</span>
                  </button>
                </div>
              </div>

              {/* Realtime Tabular Ledger with py-3.5 and High-Contrast border-slate-800 */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#080D1A] text-slate-400 text-xs font-mono uppercase tracking-wider">
                      <th className="py-3 px-3">LAP / SECTOR</th>
                      <th className="py-3 px-3">SECTOR TIME</th>
                      <th className="py-3 px-3">DELTA (REF)</th>
                      <th className="py-3 px-3">APEX SPEED</th>
                      <th className="py-3 px-3">ENERGY RATE</th>
                      <th className="py-3 px-3">ROTOR THERMALS (FL / FR / RL / RR)</th>
                      <th className="py-3 px-3">PRESSURE</th>
                      <th className="py-3 px-3 text-right">PACE STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs md:text-sm font-mono">
                    {sectorRecords.map((row) => (
                      <tr key={row.id} className="hover:bg-[#111827] transition-colors">
                        {/* LAP / SECTOR */}
                        <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-100">
                          LAP {row.lap} - S{row.sector}
                        </td>

                        {/* SECTOR TIME */}
                        <td className="py-3.5 px-3 whitespace-nowrap font-bold text-slate-200 tabular-nums">
                          {row.timeSec.toFixed(3)}s
                        </td>

                        {/* DELTA */}
                        <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                          <span
                            className={`font-bold ${
                              row.deltaSec < 0 ? 'text-lime-400' : 'text-rose-400'
                            }`}
                          >
                            {row.deltaSec < 0 ? row.deltaSec.toFixed(3) : `+${row.deltaSec.toFixed(3)}`}s
                          </span>
                        </td>

                        {/* APEX SPEED */}
                        <td className="py-3.5 px-3 whitespace-nowrap tabular-nums text-slate-200">
                          {row.apexSpeedKmh.toFixed(1)} km/h
                        </td>

                        {/* ENERGY CONSUMPTION */}
                        <td className="py-3.5 px-3 whitespace-nowrap tabular-nums text-slate-300">
                          {row.energyKwhKm.toFixed(3)} kWh/km
                        </td>

                        {/* ROTOR THERMALS */}
                        <td className="py-3.5 px-3 whitespace-nowrap tabular-nums text-slate-400">
                          <span className={row.rotorTemps.fl > 650 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {row.rotorTemps.fl.toFixed(0)}°
                          </span>{' '}
                          /{' '}
                          <span className={row.rotorTemps.fr > 650 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {row.rotorTemps.fr.toFixed(0)}°
                          </span>{' '}
                          /{' '}
                          <span className="text-slate-300">{row.rotorTemps.rl.toFixed(0)}°</span>{' '}
                          /{' '}
                          <span className="text-slate-300">{row.rotorTemps.rr.toFixed(0)}°C</span>
                        </td>

                        {/* PRESSURE */}
                        <td className="py-3.5 px-3 whitespace-nowrap tabular-nums text-slate-300">
                          {row.pressureKpa} kPa
                        </td>

                        {/* PACE STATUS BADGE */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wider ${
                              row.status === 'PURPLE'
                                ? 'bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_8px_rgba(217,70,239,0.3)]'
                                : row.status === 'GREEN'
                                ? 'bg-lime-950/80 text-lime-300 border border-lime-500/40'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {row.status === 'PURPLE'
                              ? 'FASTEST IN STINT'
                              : row.status === 'GREEN'
                              ? 'PERSONAL BEST'
                              : 'STEADY PACE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SYSTEM LOGS & DIAGNOSTICS VIEW */}
          {activeTab === 'SYSTEM LOGS' && (
            <section className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-lime-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    DRIVER DIAGNOSTIC EVENT LOGS & SYSTEM ANOMALIES
                  </h2>
                </div>
                <span className="text-xs font-bold font-mono text-slate-400">
                  {logs.length} REGISTERED CAN-BUS EVENTS
                </span>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#111827] border border-slate-800 p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs md:text-sm font-mono"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono uppercase shrink-0 ${
                          log.severity === 'INFO'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                            : log.severity === 'ADVISORY'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono">{log.timestamp}</span>
                          <span className="text-slate-600">//</span>
                          <span className="font-bold text-slate-100">{log.name}</span>
                          <span className="text-lime-400 font-bold">[{log.subsystem}]</span>
                        </div>
                        <p className="text-slate-300 mt-1">{log.details}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold font-mono text-lime-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        {log.metric}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* MODAL 1: RECALIBRATE TORQUE BIAS */}
        {modalOpen === 'torque' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg max-w-lg w-full p-6 text-slate-100 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-lime-400" />
                  <h3 className="text-base md:text-lg font-bold uppercase text-slate-100">
                    RECALIBRATE TORQUE BIAS & MCU YAW
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-5 text-xs md:text-sm">
                <div>
                  <div className="flex justify-between mb-1.5 font-bold">
                    <span>AXLE TORQUE SPLIT</span>
                    <span className="text-lime-400">
                      FRONT: {torqueBiasFront}% // REAR: {100 - torqueBiasFront}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="50"
                    value={torqueBiasFront}
                    onChange={(e) => setTorqueBiasFront(Number(e.target.value))}
                    className="w-full accent-lime-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>30:70 (HIGH OVERSTEER)</span>
                    <span>40:60 (BALANCED QUALI)</span>
                    <span>50:50 (MAX TRACTION)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-bold">
                    <span>YAW DAMPING RATE</span>
                    <span className="text-lime-400">{yawDamping.toFixed(2)}x SENSITIVITY</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.05"
                    value={yawDamping}
                    onChange={(e) => setYawDamping(Number(e.target.value))}
                    className="w-full accent-lime-500 cursor-pointer"
                  />
                </div>

                <div className="bg-[#111827] border border-slate-800 p-3 rounded">
                  <div className="text-xs text-slate-300 font-bold mb-1">
                    TRANSIENT SIMULATION ESTIMATE:
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>• Corner Entry Yaw Inertia: -4.2% faster rotation</div>
                    <div>• Apex Power Exit: Reduced rear wheel slip ratio to 1.25%</div>
                    <div>• Safety Threshold: 900V Silicon Carbide limit intact</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#1E293B] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogs((prev) => [
                      {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toISOString().substring(11, 23),
                        category: 'TORQUE_VECTORING',
                        name: 'MCU Torque Vector Flash Complete',
                        severity: 'INFO',
                        metric: `${torqueBiasFront}:${100 - torqueBiasFront} F/R`,
                        subsystem: 'CHASSIS_DYNAMICS_MCU',
                        details: `Flash applied to 4 axial-flux motor controllers. Yaw damping rate fixed at ${yawDamping}x.`
                      },
                      ...prev
                    ]);
                    setModalOpen(null);
                  }}
                  className="px-4 py-2 rounded bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold uppercase shadow-[0_0_12px_rgba(132,204,22,0.4)]"
                >
                  FLASH TO MCU
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: PURGE COOLANT LOOP */}
        {modalOpen === 'purge' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg max-w-lg w-full p-6 text-slate-100 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-5 h-5 text-cyan-400 ${isPurging ? 'animate-spin' : ''}`} />
                  <h3 className="text-base md:text-lg font-bold uppercase text-slate-100">
                    IMMERSION COOLANT LOOP PURGE SEQUENCE
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs md:text-sm">
                <p className="text-slate-300">
                  Execute controlled fluorochemical circulation flush across all 4 motor stators and 900V SiC inverters.
                </p>

                <div className="bg-[#111827] border border-slate-800 p-4 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">STAGE 1: MICRO-BUBBLE VENTING</span>
                    <span className={purgeStage >= 1 ? 'text-lime-400 font-bold' : 'text-slate-600'}>
                      {purgeStage >= 1 ? 'COMPLETE' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">STAGE 2: VALVE BYPASS 3.8 BAR</span>
                    <span className={purgeStage >= 2 ? 'text-lime-400 font-bold' : 'text-slate-600'}>
                      {purgeStage >= 2 ? 'COMPLETE' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">STAGE 3: 45 L/MIN PUMP DUTY CYCLE</span>
                    <span className={purgeStage >= 3 ? 'text-lime-400 font-bold' : 'text-slate-600'}>
                      {purgeStage >= 3 ? 'COMPLETE' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">STAGE 4: EQUILIBRIUM SEAL VERIFICATION</span>
                    <span className={purgeStage >= 4 ? 'text-lime-400 font-bold' : 'text-slate-600'}>
                      {purgeStage >= 4 ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                </div>

                {isPurging && (
                  <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${(purgeStage / 4) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#1E293B] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-slate-300"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  disabled={isPurging}
                  onClick={handleStartPurge}
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase shadow-[0_0_12px_rgba(6,182,212,0.4)] disabled:opacity-50"
                >
                  {isPurging ? 'PURGING IN PROGRESS...' : 'INITIATE PURGE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: STOW AERO WING */}
        {modalOpen === 'aero' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg max-w-lg w-full p-6 text-slate-100 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base md:text-lg font-bold uppercase text-slate-100">
                    STOW AERO WING & OVERRIDE
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs md:text-sm">
                <div>
                  <div className="flex justify-between mb-1.5 font-bold">
                    <span>MANUAL WING ANGLE OF ATTACK</span>
                    <span className="text-amber-400">{aeroWingAngleOverride.toFixed(1)}° AoA</span>
                  </div>
                  <input
                    type="range"
                    min="12.0"
                    max="45.0"
                    step="0.5"
                    value={aeroWingAngleOverride}
                    onChange={(e) => setAeroWingAngleOverride(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>12° (DRS MIN DRAG)</span>
                    <span>24° (OPTIMAL DOWNFORCE)</span>
                    <span>45° (AIRBRAKE)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#111827] border border-slate-800 p-3 rounded">
                  <div>
                    <div className="font-bold text-slate-200">HIGH-SPEED FAIL-SAFE LATCH</div>
                    <div className="text-[11px] text-slate-400">Lock mechanical pins to prevent accidental stall above 320 km/h</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFailSafeLock(!failSafeLock)}
                    className={`px-3 py-1.5 rounded text-xs font-bold ${
                      failSafeLock ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {failSafeLock ? 'ENGAGED' : 'UNLOCKED'}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#1E293B] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTelemetry((prev) => ({ ...prev, aeroAoADeg: aeroWingAngleOverride }));
                    setLogs((prev) => [
                      {
                        id: `log-${Date.now()}`,
                        timestamp: new Date().toISOString().substring(11, 23),
                        category: 'AERODYNAMICS',
                        name: 'Aero Wing Manual Angle Override Locked',
                        severity: 'ADVISORY',
                        metric: `${aeroWingAngleOverride.toFixed(1)}° AoA`,
                        subsystem: 'ACTIVE_AERO_ECU',
                        details: `Rear wing actuator overridden by pitwall engineer. Fail-safe status: ${failSafeLock ? 'ENGAGED' : 'UNLOCKED'}.`
                      },
                      ...prev
                    ]);
                    setModalOpen(null);
                  }}
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                >
                  APPLY WING OVERRIDE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: EXPORT STINT CSV */}
        {modalOpen === 'export' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg max-w-2xl w-full p-6 text-slate-100 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-lime-400" />
                  <h3 className="text-base md:text-lg font-bold uppercase text-slate-100">
                    EXPORT STINT TELEMETRY CSV
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="text-slate-300">
                  Data format ready for MoTeC i2 Pro, Bosch Motorsport WinDarab, and McLaren ATLAS telemetry parsers.
                </div>

                <div className="bg-[#050811] border border-slate-800 p-3 rounded max-h-48 overflow-y-auto text-[11px] font-mono text-slate-300">
                  <pre>{generateCsvData}</pre>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#1E293B] pt-4">
                <button
                  type="button"
                  onClick={handleCopyCsv}
                  className="px-3.5 py-2 rounded bg-[#111827] border border-[#1E293B] hover:border-slate-500 text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5"
                >
                  {copyFeedback ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-lime-400" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>COPY RAW CSV</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(null)}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase text-slate-300"
                  >
                    CLOSE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadCsv();
                      setModalOpen(null);
                    }}
                    className="px-4 py-2 rounded bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold uppercase shadow-[0_0_12px_rgba(132,204,22,0.4)] flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD .CSV FILE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ENGINEERING TELEMETRY TICKER */}
        <footer className="w-full bg-[#080D1A] border-t border-[#1E293B] px-4 py-2 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-lime-400 font-bold">VORTEX AERODYNAMICS LAB</span>
            <span>//</span>
            <span>CHASSIS SERIAL: PROTO-09-MONOCOQUE</span>
            <span>//</span>
            <span>POWERTRAIN: 4X AXIAL-FLUX 900V SiC</span>
          </div>
          <div className="flex items-center gap-4">
            <span>PACK HEALTH: 99.4% SOH</span>
            <span>PITWALL STATUS: NOMINAL</span>
            <span className="text-slate-200">AURA & GRID // GHOST FACTORY</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HypercarTelemetryDeck;
