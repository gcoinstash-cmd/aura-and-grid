/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Gauge,
  Activity,
  Zap,
  Wind,
  ShieldAlert,
  Sliders,
  Camera,
  Download,
  RotateCcw,
  Sparkles,
  Waves,
  Eye,
  Crosshair,
  Volume2,
  VolumeX,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  Pause,
  Layers,
  Thermometer,
  Compass,
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
  Database,
  BarChart3,
  Server,
  X,
  ChevronRight,
  RefreshCw,
  Cpu
} from 'lucide-react';

// Pressure tap definition interface
interface PressureTap {
  id: string;
  label: string;
  location: string;
  xRatio: number; // 0 to 1 along chord
  yOffset: number; // offset on model geometry
  surface: 'windward' | 'leeward' | 'internal' | 'base';
  basePressureKPa: number;
  baseHeatFluxMWM2: number;
  wallTempK: number;
}

// 6-Component Balance Telemetry Interface
interface ForceBalance {
  liftN: number;
  dragN: number;
  pitchingMomentNm: number;
  sideForceN: number;
  yawMomentNm: number;
  rollMomentNm: number;
  liftToDrag: number;
  dynamicPressureKPa: number;
  reynoldsMillion: number;
}

// Optical Schlieren Capture Frame
interface SchlierenFrame {
  id: string;
  timestamp: string;
  mach: number;
  aoa: number;
  p0Mpa: number;
  shockAngleDeg: number;
  exposureNs: number;
  mode: string;
  peakFlux: number;
}

// Test Matrix Run Profile
interface TestRunProfile {
  id: string;
  runCode: string;
  machTarget: number;
  aoaTarget: number;
  driverEnthalpyMJkg: number;
  targetDurationSec: number;
  modelVariant: string;
  status: 'COMPLETED' | 'ACTIVE' | 'STANDBY' | 'ANALYZING' | 'ABORTED';
  notes: string;
}

// Initial 12 Pressure & Heat-Flux Taps
const INITIAL_PRESSURE_TAPS: PressureTap[] = [
  { id: 'P01', label: 'P1', location: 'Forebody 1st Compression Ramp', xRatio: 0.12, yOffset: 12, surface: 'windward', basePressureKPa: 28.4, baseHeatFluxMWM2: 3.42, wallTempK: 1240 },
  { id: 'P02', label: 'P2', location: '2nd Compression Ramp Shock Impingement', xRatio: 0.28, yOffset: 16, surface: 'windward', basePressureKPa: 54.8, baseHeatFluxMWM2: 5.84, wallTempK: 1560 },
  { id: 'P03', label: 'P3', location: 'Scramjet Cowl Stagnation Lip', xRatio: 0.44, yOffset: 26, surface: 'windward', basePressureKPa: 86.2, baseHeatFluxMWM2: 6.95, wallTempK: 1780 },
  { id: 'P04', label: 'P4', location: 'Internal Isolator Duct Entrance', xRatio: 0.49, yOffset: 4, surface: 'internal', basePressureKPa: 68.3, baseHeatFluxMWM2: 4.15, wallTempK: 1420 },
  { id: 'P05', label: 'P5', location: 'Combustor Cavity Flameholder', xRatio: 0.58, yOffset: 6, surface: 'internal', basePressureKPa: 74.1, baseHeatFluxMWM2: 4.88, wallTempK: 1490 },
  { id: 'P06', label: 'P6', location: 'Hydrogen Strut Wake Zone', xRatio: 0.65, yOffset: 5, surface: 'internal', basePressureKPa: 62.4, baseHeatFluxMWM2: 3.92, wallTempK: 1380 },
  { id: 'P07', label: 'P7', location: 'Afterbody Expansion Nozzle Ramp', xRatio: 0.78, yOffset: 14, surface: 'windward', basePressureKPa: 19.5, baseHeatFluxMWM2: 2.15, wallTempK: 1150 },
  { id: 'P08', label: 'P8', location: 'Leeward Forebody Expansion', xRatio: 0.18, yOffset: -14, surface: 'leeward', basePressureKPa: 3.8, baseHeatFluxMWM2: 0.85, wallTempK: 720 },
  { id: 'P09', label: 'P9', location: 'Leeward Mid-Chord Shield', xRatio: 0.45, yOffset: -18, surface: 'leeward', basePressureKPa: 2.4, baseHeatFluxMWM2: 0.64, wallTempK: 680 },
  { id: 'P10', label: 'P10', location: 'Trailing Edge Elevon Hinge Locus', xRatio: 0.88, yOffset: -12, surface: 'leeward', basePressureKPa: 6.2, baseHeatFluxMWM2: 1.45, wallTempK: 910 },
  { id: 'P11', label: 'P11', location: 'Outboard Strakes / Fin Leading Edge', xRatio: 0.72, yOffset: -22, surface: 'leeward', basePressureKPa: 14.1, baseHeatFluxMWM2: 2.82, wallTempK: 1190 },
  { id: 'P12', label: 'P12', location: 'Base Recirculation Wake Cavity', xRatio: 0.96, yOffset: 2, surface: 'base', basePressureKPa: 1.15, baseHeatFluxMWM2: 0.42, wallTempK: 580 },
];

// Test Matrix RUN-01 to RUN-08
const INITIAL_RUNS: TestRunProfile[] = [
  { id: 'run-1', runCode: 'RUN-01', machTarget: 5.8, aoaTarget: 0.0, driverEnthalpyMJkg: 2.45, targetDurationSec: 40.0, modelVariant: 'Waverider Baseline-A', status: 'COMPLETED', notes: 'Laminar boundary verification' },
  { id: 'run-2', runCode: 'RUN-02', machTarget: 6.5, aoaTarget: 2.0, driverEnthalpyMJkg: 2.95, targetDurationSec: 42.0, modelVariant: 'Waverider Baseline-A', status: 'COMPLETED', notes: 'Cowl transition onset detected' },
  { id: 'run-3', runCode: 'RUN-03', machTarget: 7.0, aoaTarget: 4.0, driverEnthalpyMJkg: 3.40, targetDurationSec: 45.0, modelVariant: 'Scramjet Aero-Grid V2', status: 'COMPLETED', notes: 'Isolator shock train stable' },
  { id: 'run-4', runCode: 'RUN-04', machTarget: 7.42, aoaTarget: 4.5, driverEnthalpyMJkg: 3.82, targetDurationSec: 45.0, modelVariant: 'Scramjet Aero-Grid V2', status: 'COMPLETED', notes: 'Arc-heater 45MW nominal test' },
  { id: 'run-5', runCode: 'RUN-05', machTarget: 7.42, aoaTarget: 6.0, driverEnthalpyMJkg: 3.82, targetDurationSec: 45.0, modelVariant: 'Scramjet Aero-Grid V2', status: 'COMPLETED', notes: 'Peak thermal gradient survey' },
  { id: 'run-6', runCode: 'RUN-06', machTarget: 7.42, aoaTarget: 4.8, driverEnthalpyMJkg: 3.82, targetDurationSec: 45.0, modelVariant: 'Scramjet Aero-Grid V2', status: 'ACTIVE', notes: 'High-enthalpy blowdown active run' },
  { id: 'run-7', runCode: 'RUN-07', machTarget: 8.0, aoaTarget: 5.0, driverEnthalpyMJkg: 4.35, targetDurationSec: 35.0, modelVariant: 'Ultra-High Enthalpy C', status: 'STANDBY', notes: 'Pebble bed boost + max arc drive' },
  { id: 'run-8', runCode: 'RUN-08', machTarget: 8.5, aoaTarget: 7.5, driverEnthalpyMJkg: 4.90, targetDurationSec: 30.0, modelVariant: 'Ultra-High Enthalpy C', status: 'STANDBY', notes: 'Boundary layer trip grid survey' },
];

export function HypersonicTunnelControl() {
  // Facility blowdown state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isScrammed, setIsScrammed] = useState<boolean>(false);
  const [scramAlertOpen, setScramAlertOpen] = useState<boolean>(false);
  const [runTimeSec, setRunTimeSec] = useState<number>(18.42);
  const maxBlowdownDuration = 45.0; // seconds before reservoir exhaustion

  // Operational controls
  const [angleOfAttack, setAngleOfAttack] = useState<number>(4.8); // degrees
  const [yawAngle, setYawAngle] = useState<number>(0.2); // degrees
  const [blSuctionActive, setBlSuctionActive] = useState<boolean>(true);
  const [opticalMode, setOpticalMode] = useState<'toepler' | 'wollaston' | 'shadowgraph' | 'infrared'>('toepler');
  const [activeTab, setActiveTab] = useState<'telemetry' | 'matrix' | 'diagnostics' | 'oscilloscope'>('telemetry');
  const [selectedTap, setSelectedTap] = useState<PressureTap>(INITIAL_PRESSURE_TAPS[1]);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showTapLabels, setShowTapLabels] = useState<boolean>(true);
  const [isPitchSweeping, setIsPitchSweeping] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [spectralModalOpen, setSpectralModalOpen] = useState<boolean>(false);
  const [capturedFrames, setCapturedFrames] = useState<SchlierenFrame[]>([
    {
      id: 'SF-0914',
      timestamp: 'T+12.18s',
      mach: 7.42,
      aoa: 4.8,
      p0Mpa: 8.48,
      shockAngleDeg: 14.8,
      exposureNs: 120,
      mode: 'Toepler Knife-Edge',
      peakFlux: 6.94
    },
    {
      id: 'SF-0915',
      timestamp: 'T+15.60s',
      mach: 7.41,
      aoa: 4.8,
      p0Mpa: 8.46,
      shockAngleDeg: 14.9,
      exposureNs: 120,
      mode: 'Wollaston Prism',
      peakFlux: 6.98
    }
  ]);

  // Flash indicator for capture
  const [cameraFlash, setCameraFlash] = useState<boolean>(false);

  // Real-time dynamic facility telemetry state
  const [jitter, setJitter] = useState<number>(0);
  const [freestreamMach, setFreestreamMach] = useState<number>(7.42);
  const [freestreamVelocityMs, setFreestreamVelocityMs] = useState<number>(2480);
  const [p0StagnationMpa, setP0StagnationMpa] = useState<number>(8.45);
  const [t0StagnationK, setT0StagnationK] = useState<number>(1820);
  const [staticPressureKpa, setStaticPressureKpa] = useState<number>(1.24);
  const [arcHeaterPowerMw, setArcHeaterPowerMw] = useState<number>(45.2);
  const [arcCurrentA, setArcCurrentA] = useState<number>(14125);
  const [arcVoltageV, setArcVoltageV] = useState<number>(3200);
  const [pebbleBedTempK, setPebbleBedTempK] = useState<number>(1640);
  const [nozzleDeltaTC, setNozzleDeltaTC] = useState<number>(48.6);
  const [vacuumSphereTorr, setVacuumSphereTorr] = useState<number>(8.4);
  const [heliumBottleBankMpa, setHeliumBottleBankMpa] = useState<number>(41.8);
  const [nitrogenBufferMpa, setNitrogenBufferMpa] = useState<number>(28.2);

  // Internal 6-component balance
  const [forceBalance, setForceBalance] = useState<ForceBalance>({
    liftN: 14820,
    dragN: 4210,
    pitchingMomentNm: -324,
    sideForceN: 48,
    yawMomentNm: 12,
    rollMomentNm: -8.5,
    liftToDrag: 3.52,
    dynamicPressureKPa: 84.6,
    reynoldsMillion: 4.22
  });

  // Tap readings with dynamic perturbations
  const [tapReadings, setTapReadings] = useState<Record<string, { pressure: number; heatFlux: number; temp: number }>>({});

  // Active runs state
  const [runsList, setRunsList] = useState<TestRunProfile[]>(INITIAL_RUNS);

  // Canvas visual shock wave parameters calculated from Mach and AoA
  const shockAngleDeg = useMemo(() => {
    // Oblique shock wave relation approximation for hypersonic wedge flow
    const baseDeflection = 10 + angleOfAttack * 0.9;
    const waveAngle = Math.max(11.5, Math.min(28.0, Math.asin(1 / freestreamMach) * (180 / Math.PI) + baseDeflection * 0.65 + jitter * 0.4));
    return parseFloat(waveAngle.toFixed(2));
  }, [freestreamMach, angleOfAttack, jitter]);

  const bowStandoffMm = useMemo(() => {
    // Detached standoff distance approximation
    const standoff = Math.max(1.8, 6.2 / Math.sqrt(freestreamMach - 1) + Math.sin((angleOfAttack * Math.PI) / 180) * 1.5 + jitter * 0.1);
    return parseFloat(standoff.toFixed(2));
  }, [freestreamMach, angleOfAttack, jitter]);

  // Main high-frequency simulation tick loop (30Hz)
  useEffect(() => {
    if (!isRunning || isScrammed) return;

    const interval = setInterval(() => {
      // Small aerodynamic turbulence jitter
      const j = (Math.random() - 0.5) * 0.4;
      setJitter(j);

      // Blowdown timer advance
      setRunTimeSec((prev) => {
        const next = prev + 0.1;
        if (next >= maxBlowdownDuration) {
          setIsRunning(false);
          return maxBlowdownDuration;
        }
        return parseFloat(next.toFixed(2));
      });

      // Slowly deplete driver pressure as blowdown progresses
      setP0StagnationMpa((prev) => Math.max(7.2, parseFloat((prev - 0.0006 + j * 0.003).toFixed(3))));
      setHeliumBottleBankMpa((prev) => Math.max(34.0, parseFloat((prev - 0.001).toFixed(2))));
      setVacuumSphereTorr((prev) => Math.min(18.0, parseFloat((prev + 0.0015).toFixed(2))));

      // Aerothermal parameters jitter
      setFreestreamMach((prev) => parseFloat((7.42 + j * 0.03).toFixed(2)));
      setFreestreamVelocityMs((prev) => Math.round(2480 + j * 12));
      setT0StagnationK((prev) => Math.round(1820 + j * 8));
      setStaticPressureKpa((prev) => parseFloat((1.24 + j * 0.02).toFixed(3)));

      // Arc-heater electrical jitter
      setArcHeaterPowerMw((prev) => parseFloat((45.2 + j * 0.3).toFixed(2)));
      setArcCurrentA((prev) => Math.round(14125 + j * 80));
      setArcVoltageV((prev) => Math.round(3200 + j * 15));
      setNozzleDeltaTC((prev) => parseFloat((48.6 + (Math.random() - 0.5) * 0.1).toFixed(1)));
      setPebbleBedTempK((prev) => Math.round(1640 - prev * 0.00001));

      // Calculate 6-Component forces according to Mach, AoA, and Boundary Layer state
      const aoaRad = (angleOfAttack * Math.PI) / 180;
      const suctionFactor = blSuctionActive ? 0.94 : 1.06; // Suction reduces drag
      const dynamicQ = 84.6 * (1 + j * 0.02);

      const baseLift = (11200 + angleOfAttack * 820) * (1 + j * 0.015);
      const baseDrag = (3400 + Math.pow(angleOfAttack, 1.8) * 45) * suctionFactor * (1 + j * 0.012);
      const ldRatio = parseFloat((baseLift / Math.max(baseDrag, 1)).toFixed(2));

      setForceBalance({
        liftN: Math.round(baseLift),
        dragN: Math.round(baseDrag),
        pitchingMomentNm: Math.round(-240 - angleOfAttack * 18.5 + j * 4),
        sideForceN: Math.round(yawAngle * 240 + j * 6),
        yawMomentNm: Math.round(yawAngle * 60 + j * 2),
        rollMomentNm: Math.round(-8.5 + j * 1.5),
        liftToDrag: ldRatio,
        dynamicPressureKPa: parseFloat(dynamicQ.toFixed(1)),
        reynoldsMillion: parseFloat((4.22 + j * 0.05).toFixed(2))
      });

      // Update pressure taps with aerothermal flux scaling
      const readings: Record<string, { pressure: number; heatFlux: number; temp: number }> = {};
      INITIAL_PRESSURE_TAPS.forEach((tap) => {
        const aoaMultiplier = tap.surface === 'windward' ? 1 + angleOfAttack * 0.08 : tap.surface === 'leeward' ? Math.max(0.4, 1 - angleOfAttack * 0.06) : 1;
        const p = parseFloat((tap.basePressureKPa * aoaMultiplier * (1 + j * 0.05)).toFixed(2));
        const qFlux = parseFloat((tap.baseHeatFluxMWM2 * aoaMultiplier * (1 + j * 0.07)).toFixed(2));
        const tWall = Math.round(tap.wallTempK + (qFlux - tap.baseHeatFluxMWM2) * 50);
        readings[tap.id] = { pressure: p, heatFlux: qFlux, temp: tWall };
      });
      setTapReadings(readings);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isScrammed, angleOfAttack, yawAngle, blSuctionActive]);

  // Pitch sweep oscillation effect
  useEffect(() => {
    if (!isPitchSweeping) return;
    let sweepDir = 1;
    const sweepInterval = setInterval(() => {
      setAngleOfAttack((prev) => {
        let next = prev + 0.3 * sweepDir;
        if (next >= 10.5) {
          sweepDir = -1;
          next = 10.5;
        } else if (next <= 0.5) {
          sweepDir = 1;
          next = 0.5;
        }
        return parseFloat(next.toFixed(1));
      });
    }, 120);

    return () => clearInterval(sweepInterval);
  }, [isPitchSweeping]);

  // Handle emergency scram switch
  const triggerScram = () => {
    setIsScrammed(true);
    setIsRunning(false);
    setArcHeaterPowerMw(0.0);
    setArcCurrentA(0);
    setArcVoltageV(0);
    setScramAlertOpen(true);
  };

  // Reset scram after inspection
  const resetScram = () => {
    setIsScrammed(false);
    setScramAlertOpen(false);
    setArcHeaterPowerMw(45.2);
    setArcCurrentA(14125);
    setArcVoltageV(3200);
    setIsRunning(true);
  };

  // Capture Schlieren frame
  const captureSchlierenFrame = () => {
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 200);

    const newFrame: SchlierenFrame = {
      id: `SF-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `T+${runTimeSec.toFixed(2)}s`,
      mach: freestreamMach,
      aoa: angleOfAttack,
      p0Mpa: p0StagnationMpa,
      shockAngleDeg: shockAngleDeg,
      exposureNs: 120,
      mode: opticalMode === 'toepler' ? 'Toepler Knife-Edge' : opticalMode === 'wollaston' ? 'Wollaston Prism' : opticalMode === 'shadowgraph' ? 'Shadowgraph' : 'Infrared Thermography',
      peakFlux: Math.max(...Object.values(tapReadings).map((t) => t.heatFlux || 5.8))
    };

    setCapturedFrames((prev) => [newFrame, ...prev.slice(0, 9)]);
  };

  // Download Telemetry Report
  const handleExportTelemetry = () => {
    const reportData = {
      facility: 'Langley Transonic-Hypersonic Complex',
      blowdownCell: 'Mach 7.5 High-Enthalpy Blowdown Facility',
      testRun: 'RUN-06 (Active Test Series)',
      exportTimestamp: new Date().toISOString(),
      runDurationSec: runTimeSec,
      stagnationReservoir: {
        p0Mpa: p0StagnationMpa,
        t0K: t0StagnationK,
        staticPressureKPa: staticPressureKpa,
        machFreestream: freestreamMach,
        velocityMs: freestreamVelocityMs,
        driverPebbleBedK: pebbleBedTempK
      },
      arcHeater: {
        powerMw: arcHeaterPowerMw,
        currentAmps: arcCurrentA,
        voltageVolts: arcVoltageV,
        nozzleDeltaTC: nozzleDeltaTC,
        vacuumDumpTorr: vacuumSphereTorr
      },
      sixComponentBalance: forceBalance,
      pressureTaps: INITIAL_PRESSURE_TAPS.map((t) => ({
        ...t,
        currentReading: tapReadings[t.id] || { pressure: t.basePressureKPa, heatFlux: t.baseHeatFluxMWM2, temp: t.wallTempK }
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LANGLEY-HYP75-RUN06-T+${runTimeSec.toFixed(0)}s.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  // Color generator for heat flux (MW/m²)
  const getHeatFluxColor = (flux: number) => {
    if (flux < 1.5) return 'text-cyan-400 bg-cyan-950/60 border-cyan-800';
    if (flux < 4.0) return 'text-amber-400 bg-amber-950/60 border-amber-700';
    if (flux < 6.0) return 'text-orange-400 bg-orange-950/60 border-orange-600';
    return 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-600 animate-pulse';
  };

  const getHeatFluxSvgColor = (flux: number) => {
    if (flux < 1.5) return '#22d3ee'; // cyan
    if (flux < 4.0) return '#fbbf24'; // amber
    if (flux < 6.0) return '#f97316'; // orange
    return '#c084fc'; // purple/violet
  };

  return (
    <>
      <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans select-none antialiased">
        {/* TOP INSTITUTIONAL STATUS BANNER & FACILITY HUD */}
        <header className="border-b border-slate-800/80 bg-[#090d16] px-4 py-2.5 shadow-2xl relative z-30">
          {/* Facility Hub Callout */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded border border-cyan-500/40 bg-cyan-950/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Wind className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScrammed ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isScrammed ? 'bg-red-500' : 'bg-emerald-500'}`} />
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">
                    NASA LA-HTC // BLOWDOWN DECK 04
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    ISO-9001 AEROTHERMAL
                  </span>
                </div>
                <h1 className="text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-2 mt-0.5 font-mono">
                  LANGLEY TRANSONIC-HYPERSONIC COMPLEX
                  <span className="text-slate-500 font-normal hidden sm:inline">|</span>
                  <span className="text-orange-400 font-semibold hidden sm:inline">MACH 7.5 HIGH-ENTHALPY BLOWDOWN FACILITY</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Unified Top Command Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-800/80 pb-3 mb-4">
            {/* Pitch Sweep Trigger */}
            <button
              type="button"
              onClick={() => setIsPitchSweeping(!isPitchSweeping)}
              className={`w-full h-10 flex items-center justify-center gap-2 px-3 rounded text-xs font-mono font-bold tracking-wide border transition-all ${
                isPitchSweeping
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                  : 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
              title="Automatically oscillate model Angle of Attack across test range"
            >
              <Sliders className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">PITCH SWEEP {isPitchSweeping ? 'ACTIVE' : 'IDLE'}</span>
            </button>

            {/* Boundary Layer Suction Purge Trigger */}
            <button
              type="button"
              onClick={() => setBlSuctionActive(!blSuctionActive)}
              className={`w-full h-10 flex items-center justify-center gap-2 px-3 rounded text-xs font-mono font-bold tracking-wide border transition-all ${
                blSuctionActive
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              title="Purge boundary layer suction slots"
            >
              <Layers className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">BL SUCTION PURGE {blSuctionActive ? 'ON' : 'BYPASS'}</span>
            </button>

            {/* Resume/Pause Blowdown Test */}
            <button
              type="button"
              disabled={isScrammed}
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full h-10 flex items-center justify-center gap-2 px-3 rounded text-xs font-mono font-bold tracking-wide border transition-all ${
                isScrammed
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : isRunning
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 hover:bg-emerald-900/60 hover:text-white'
                  : 'bg-amber-950/50 border-amber-500 text-amber-300 hover:bg-amber-900/60 hover:text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 flex-shrink-0" /> : <Play className="w-4 h-4 flex-shrink-0" />}
              <span className="truncate">{isRunning ? 'HOLD BLOWDOWN' : 'RESUME TEST'}</span>
            </button>

            {/* ARC-HEATER FAST-QUENCH SCRAM Trigger */}
            <button
              type="button"
              onClick={isScrammed ? resetScram : triggerScram}
              className={`w-full h-10 flex items-center justify-center gap-2 px-3 rounded border text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg ${
                isScrammed
                  ? 'border-red-500 bg-red-700 hover:bg-red-600 text-white animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                  : 'border-rose-500/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 hover:text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              }`}
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span className="truncate">{isScrammed ? 'RESET SCRAM' : 'ARC-HEATER FAST-QUENCH SCRAM'}</span>
            </button>
          </div>

          {/* TELEMETRY STRIP (HUD 5-METRIC HIGH-CONTRAST READOUT) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2.5 pt-2 border-t border-slate-800/60">
            {/* Metric 1: Freestream Velocity & Mach */}
            <div className="bg-[#0b0f17] border border-slate-800/80 rounded px-3 py-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> FREESTREAM VELOCITY
                </span>
                <span className="text-cyan-400 font-semibold">U∞</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg md:text-xl font-mono font-extrabold text-white tracking-tight">
                  Mach {freestreamMach.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-cyan-300">
                  {freestreamVelocityMs.toLocaleString()} m/s
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (freestreamMach / 9.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Stagnation Pressure P0 */}
            <div className="bg-[#0b0f17] border border-slate-800/80 rounded px-3 py-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-orange-400" /> STAGNATION PRESS. P0
                </span>
                <span className="text-orange-400 font-semibold">8.45 MPa Nom</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg md:text-xl font-mono font-extrabold text-orange-400 tracking-tight">
                  {p0StagnationMpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">MPa</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {(p0StagnationMpa * 9.869).toFixed(0)} atm
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (p0StagnationMpa / 12.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Total Temperature T0 */}
            <div className="bg-[#0b0f17] border border-slate-800/80 rounded px-3 py-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-fuchsia-400" /> TOTAL TEMP. T0
                </span>
                <span className="text-fuchsia-400 font-semibold">HIGH-ENTHALPY</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg md:text-xl font-mono font-extrabold text-fuchsia-400 tracking-tight">
                  {t0StagnationK.toLocaleString()} <span className="text-xs font-normal text-slate-400">K</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {(t0StagnationK - 273.15).toFixed(0)} °C
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-fuchsia-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (t0StagnationK / 2400) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Test Cell Static Pressure */}
            <div className="bg-[#0b0f17] border border-slate-800/80 rounded px-3 py-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" /> TEST CELL P∞
                </span>
                <span className="text-emerald-400 font-semibold">VAC EXPANSION</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg md:text-xl font-mono font-extrabold text-emerald-400 tracking-tight">
                  {staticPressureKpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">kPa</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {(staticPressureKpa * 7.5006).toFixed(1)} Torr
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (staticPressureKpa / 3.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 5: Blowdown Run Timer & Reservoir Depletion */}
            <div className="col-span-2 sm:col-span-1 bg-[#0b0f17] border border-slate-800/80 rounded px-3 py-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400" /> RUN TIMER / WINDOW
                </span>
                <span className={`font-semibold ${runTimeSec > 38 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                  {maxBlowdownDuration - runTimeSec > 0 ? `${(maxBlowdownDuration - runTimeSec).toFixed(1)}s REM` : 'DEPLETED'}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg md:text-xl font-mono font-extrabold text-white tracking-tight">
                  T+ {runTimeSec.toFixed(2)}s
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {((runTimeSec / maxBlowdownDuration) * 100).toFixed(0)}% DELIVERED
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-200 ${
                    runTimeSec > 38 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 via-orange-500 to-fuchsia-500'
                  }`}
                  style={{ width: `${Math.min(100, (runTimeSec / maxBlowdownDuration) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* SCRAM MODAL DIALOG */}
        {scramAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#111827] border-2 border-red-600 rounded-lg max-w-lg w-full p-6 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <div className="flex items-center gap-3 text-red-500 border-b border-red-900/60 pb-3 mb-4">
                <ShieldAlert className="w-8 h-8 animate-pulse text-red-400" />
                <div>
                  <h2 className="text-lg font-bold font-mono tracking-wider text-red-200">
                    FACILITY EMERGENCY SCRAM ENGAGED
                  </h2>
                  <p className="text-xs font-mono text-red-400">
                    AUTOMATIC NITROGEN FAST-QUENCH DELUGE TRIGGERED
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-xs font-mono text-slate-300">
                <div className="p-3 bg-red-950/40 border border-red-900/80 rounded space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Arc-Heater Contactor:</span>
                    <span className="text-red-400 font-bold">OPEN // 0.0 MW (ISOLATED)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Throat Quench N2 Flow:</span>
                    <span className="text-emerald-400 font-bold">120 kg/s ACTIVE DUMP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vacuum Sphere Isolation Valve:</span>
                    <span className="text-amber-400 font-bold">LATCHED CLOSED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Acoustic Trip Sensor:</span>
                    <span className="text-slate-200">TRIP AT T+{runTimeSec.toFixed(2)}s</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Arc electrode plasma extinguish completed in 42 ms. Throat temperature decay rate: -450 K/s. Operator clearance verified before reset.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetScram}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-md"
                >
                  ACKNOWLEDGE & DISENGAGE SCRAM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT TELEMETRY MODAL */}
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#0f172a] border border-cyan-500/50 rounded-lg max-w-xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                  <Database className="w-5 h-5" />
                  <span>EXPORT HIGH-SPEED TELEMETRY DATASET</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs font-mono space-y-3 text-slate-300">
                <p className="text-slate-400">
                  Export synchronous telemetry streams captured at 10 kHz: 6-component internal balance, 12 surface dynamic pressure transducers, arc driver power parameters, and optical metadata.
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Facility Code:</span>
                    <span className="text-white">NASA-LA-HTC-M75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Run Target:</span>
                    <span className="text-cyan-400">Mach 7.42 @ 4.8° AoA // RUN-06</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data Points Logged:</span>
                    <span className="text-emerald-400">184,200 samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Optical Schlieren Frames:</span>
                    <span className="text-orange-400">{capturedFrames.length} captured frames</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleExportTelemetry}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD HDF5 / JSON DATASET</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPECTRAL FFT MODAL */}
        {spectralModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#0f172a] border border-fuchsia-500/50 rounded-lg max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-fuchsia-400 font-mono font-bold text-sm">
                  <BarChart3 className="w-5 h-5" />
                  <span>TRANSDUCER ACOUSTIC FFT POWER SPECTRAL DENSITY</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpectralModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs font-mono space-y-4">
                <div className="bg-[#090d16] border border-slate-800 p-4 rounded h-48 flex items-end justify-between gap-1 relative overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-20 border-b border-slate-700">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border-t border-r border-slate-600" />
                    ))}
                  </div>
                  {/* Synthesized FFT Bars */}
                  {[
                    14, 18, 22, 35, 78, 92, 45, 28, 30, 85, 100, 68, 42, 36, 52, 60, 48, 35, 22, 18, 14, 12, 10, 8, 6, 5
                  ].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 via-orange-500 to-fuchsia-500 rounded-t transition-all duration-300"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[8px] text-slate-500 hidden sm:block">
                        {((idx + 1) * 0.8).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 text-slate-400 text-[11px]">
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold block">2.4 kHz Mode</span>
                    <span>Shock-boundary layer unsteadiness peak (SBLI)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span className="text-orange-400 font-bold block">8.8 kHz Mode</span>
                    <span>Second-mode Mack acoustic wave instability</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span className="text-fuchsia-400 font-bold block">16.5 kHz Mode</span>
                    <span>Isolator shock-train acoustic resonance</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSpectralModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN 4-PANE OPERATIONAL AEROTHERMAL GRID */}
        <div className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 max-w-[1920px] mx-auto w-full">
          {/* CENTER-LEFT (7 COLS): 2D SCHLIEREN SHOCKWAVE & TEST-ARTICLE FLOW CANVAS */}
          <div className="lg:col-span-7 flex flex-col bg-[#0b0f17] border border-slate-800 rounded-lg shadow-xl overflow-hidden relative">
            {/* Camera flash overlay */}
            {cameraFlash && (
              <div className="absolute inset-0 bg-white/70 z-40 pointer-events-none transition-opacity duration-150" />
            )}

            {/* Pane Header & Optics Control Bar */}
            <div className="border-b border-slate-800/80 bg-[#090d16] px-3 py-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-xs font-bold font-mono tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  2D SYNTHETIC SCHLIEREN OPTICAL TEST CELL (Z-TYPE SYSTEM)
                </h2>
              </div>

              {/* Optical Mode Selectors */}
              <div className="flex items-center space-x-1 bg-slate-900/90 p-0.5 rounded border border-slate-800">
                {(
                  [
                    { id: 'toepler', label: 'Toepler Knife-Edge' },
                    { id: 'wollaston', label: 'Wollaston Prism' },
                    { id: 'shadowgraph', label: 'Shadowgraph' },
                    { id: 'infrared', label: 'IR Thermography' }
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setOpticalMode(mode.id)}
                    className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                      opticalMode === mode.id
                        ? 'bg-cyan-900/70 text-cyan-300 font-bold border border-cyan-600/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Visual Toggles & Capture Button */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReticle(!showReticle)}
                  className={`p-1.5 rounded border text-xs font-mono transition-colors ${
                    showReticle ? 'bg-slate-800 border-cyan-600/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle optical reticle grid"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowStreamlines(!showStreamlines)}
                  className={`p-1.5 rounded border text-xs font-mono transition-colors ${
                    showStreamlines ? 'bg-slate-800 border-orange-600/50 text-orange-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle aerodynamic flow vector streamlines"
                >
                  <Wind className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowTapLabels(!showTapLabels)}
                  className={`p-1.5 rounded border text-xs font-mono transition-colors ${
                    showTapLabels ? 'bg-slate-800 border-fuchsia-600/50 text-fuchsia-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle P1-P12 transducer markers"
                >
                  <Gauge className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={captureSchlierenFrame}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-700/80 hover:bg-cyan-600 text-white font-mono text-xs font-semibold shadow-sm transition-all"
                  title="High-speed camera laser exposure capture"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>CAPTURE FRAME</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE SVG SCHLIEREN VISUALIZATION */}
            <div className="relative flex-1 min-h-[360px] md:min-h-[440px] bg-[#05070d] flex items-center justify-center overflow-hidden">
              {/* Scanline subtle radar line */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />

              <svg
                viewBox="0 0 880 500"
                className="w-full h-full object-contain cursor-crosshair select-none"
              >
                <defs>
                  {/* Toepler Schlieren density gradient */}
                  <linearGradient id="schlierenBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#080c14" />
                    <stop offset="40%" stopColor="#0f172a" />
                    <stop offset="70%" stopColor="#080d1a" />
                    <stop offset="100%" stopColor="#05070d" />
                  </linearGradient>

                  {/* Wollaston Prism Rainbow gradient */}
                  <linearGradient id="wollastonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#f97316" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                  </linearGradient>

                  {/* High-enthalpy Plasma Shock glow */}
                  <filter id="plasmaGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Strong Shock Wave Filter */}
                  <filter id="shockShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Expansion Fan Pattern */}
                  <linearGradient id="expansionGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
                  </linearGradient>

                  {/* Test Model Surface Metallic / Ceramic TPS Shader */}
                  <linearGradient id="tpsCeramic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="40%" stopColor="#334155" />
                    <stop offset="75%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Background optical test chamber */}
                <rect width="880" height="500" fill="url(#schlierenBg)" />

                {/* Optical Reticle & Measurement Grids */}
                {showReticle && (
                  <g className="text-slate-600" opacity="0.35">
                    {/* Concentric test cell optical circles */}
                    <circle cx="440" cy="250" r="230" fill="none" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="4 4" />
                    <circle cx="440" cy="250" r="140" fill="none" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="2 2" />
                    <circle cx="440" cy="250" r="50" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
                    {/* Crosshairs */}
                    <line x1="440" y1="20" x2="440" y2="480" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="40" y1="250" x2="840" y2="250" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Millimeter ticks on horizontal datum */}
                    {Array.from({ length: 17 }).map((_, i) => (
                      <line
                        key={`tick-h-${i}`}
                        x1={80 + i * 45}
                        y1={245}
                        x2={80 + i * 45}
                        y2={255}
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    ))}
                    <text x="50" y="475" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      TEST SECTION NOZZLE EXIT: Ø 762mm // SCHLIEREN FIELD: 450mm
                    </text>
                  </g>
                )}

                {/* WIND TUNNEL NOZZLE CONTOUR (Contoured Contraction & Expansion Walls) */}
                <g opacity="0.65">
                  {/* Upper Nozzle Wall */}
                  <path
                    d="M 20 50 Q 180 80, 440 90 T 860 110 L 860 20 L 20 20 Z"
                    fill="#111827"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {/* Upper Boundary layer suction slots */}
                  {blSuctionActive && (
                    <g stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.8">
                      <line x1="280" y1="85" x2="295" y2="65" />
                      <line x1="340" y1="88" x2="355" y2="68" />
                      <line x1="400" y1="90" x2="415" y2="70" />
                      <line x1="460" y1="91" x2="475" y2="71" />
                    </g>
                  )}
                  {/* Lower Nozzle Wall */}
                  <path
                    d="M 20 450 Q 180 420, 440 410 T 860 390 L 860 480 L 20 480 Z"
                    fill="#111827"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {/* Lower Boundary layer suction slots */}
                  {blSuctionActive && (
                    <g stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.8">
                      <line x1="280" y1="415" x2="295" y2="435" />
                      <line x1="340" y1="412" x2="355" y2="432" />
                      <line x1="400" y1="410" x2="415" y2="430" />
                      <line x1="460" y1="409" x2="475" y2="429" />
                    </g>
                  )}
                </g>

                {/* FREESTREAM SUPERSONIC/HYPERSONIC VECTORS */}
                {showStreamlines && (
                  <g opacity="0.45" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 8">
                    <line x1="40" y1="160" x2="240" y2="160" className="animate-pulse" />
                    <line x1="40" y1="210" x2="260" y2="210" />
                    <line x1="40" y1="250" x2="270" y2="250" />
                    <line x1="40" y1="290" x2="260" y2="290" />
                    <line x1="40" y1="340" x2="240" y2="340" className="animate-pulse" />
                    <text x="45" y="152" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                      M∞ = 7.42 // HIGH ENTHALPY AIR
                    </text>
                  </g>
                )}

                {/* TEST MODEL ASSEMBLY & SHOCKWAVE SYSTEM (Dynamic transform by AoA and Jitter) */}
                <g transform={`rotate(${angleOfAttack}, 480, 250)`}>
                  {/* EXPANSION FANS AT CONVEX CORNERS (PRANDTL-MEYER FANS) */}
                  <g opacity="0.6">
                    {/* Leeward Forebody Expansion Fan */}
                    <path
                      d="M 330 236 L 220 120 L 260 90 L 320 85 Z"
                      fill="url(#expansionGradient)"
                      filter="url(#shockShadow)"
                    />
                    {/* Trailing edge expansion rays */}
                    <line x1="680" y1="235" x2="800" y2="170" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="680" y1="235" x2="820" y2="190" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="680" y1="235" x2="840" y2="215" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                  </g>

                  {/* BOUNDARY LAYER TRANSITION LOCUS & TURBULENT EDDIES */}
                  <g opacity="0.8">
                    {/* Windward laminar-to-turbulent transition marked at x/c ~ 0.35 */}
                    <circle cx="430" cy="265" r="4" fill="#f97316" className="animate-ping" />
                    <text x="440" y="278" fill="#f97316" fontSize="9" fontFamily="monospace">
                      X_tr (TRANSITION)
                    </text>
                    {/* Boundary layer thickness displacement line */}
                    <path
                      d="M 280 250 Q 430 263, 670 270"
                      fill="none"
                      stroke={blSuctionActive ? '#22d3ee' : '#f97316'}
                      strokeWidth={blSuctionActive ? '1.5' : '3'}
                      strokeDasharray="4 2"
                    />
                  </g>

                  {/* ATTACHED / DETACHED BOW SHOCK WAVE (Dynamically calculated angle and jitter) */}
                  <g filter="url(#plasmaGlowFilter)">
                    {/* Windward Primary Oblique Shock Wave */}
                    <path
                      d={`M ${280 - bowStandoffMm} 250 L ${280 + 380 * Math.cos((shockAngleDeg * Math.PI) / 180)} ${250 + 380 * Math.sin((shockAngleDeg * Math.PI) / 180)}`}
                      fill="none"
                      stroke={
                        opticalMode === 'wollaston'
                          ? 'url(#wollastonGradient)'
                          : opticalMode === 'infrared'
                          ? '#f43f5e'
                          : '#f97316'
                      }
                      strokeWidth={opticalMode === 'shadowgraph' ? '4.5' : '3.0'}
                      strokeLinecap="round"
                    />

                    {/* Leeward Weaker Oblique Shock Wave */}
                    <path
                      d={`M ${280 - bowStandoffMm} 250 L ${280 + 350 * Math.cos(((shockAngleDeg * 0.75) * Math.PI) / 180)} ${250 - 350 * Math.sin(((shockAngleDeg * 0.75) * Math.PI) / 180)}`}
                      fill="none"
                      stroke={
                        opticalMode === 'wollaston'
                          ? '#a855f7'
                          : opticalMode === 'infrared'
                          ? '#06b6d4'
                          : '#38bdf8'
                      }
                      strokeWidth="2.0"
                      strokeLinecap="round"
                    />

                    {/* Cowl Reflected Internal Isolator Shock Train */}
                    <path
                      d="M 460 270 L 510 248 L 560 270 L 610 250"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.2"
                      strokeDasharray="3 1"
                    />
                  </g>

                  {/* Shock Wave Angle Annotations */}
                  <g>
                    <path
                      d="M 330 250 A 50 50 0 0 1 325 264"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="1.2"
                    />
                    <text x="340" y="270" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      β = {shockAngleDeg}°
                    </text>
                  </g>

                  {/* WAVERIDER / SCRAMJET TEST ARTICLE GEOMETRY */}
                  {/* Model Sting Mount / Strut Balance Support */}
                  <polygon
                    points="670,240 790,230 810,260 670,255"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <line x1="740" y1="210" x2="740" y2="280" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="700" y="295" fill="#64748b" fontSize="8" fontFamily="monospace">
                    INTERNAL 6-DOF BALANCE STING
                  </text>

                  {/* Test Model Main Body (Waverider Scramjet Fuselage) */}
                  <polygon
                    points="280,250 330,236 470,235 670,230 670,265 610,268 560,252 470,254 440,268 380,262"
                    fill="url(#tpsCeramic)"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    filter="url(#shockShadow)"
                  />

                  {/* Scramjet Cowl Lip Geometry */}
                  <polygon
                    points="450,274 580,274 580,268 460,268"
                    fill="#0f172a"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  {/* Fuel injection struts in internal combustor duct */}
                  <rect x="520" y="254" width="4" height="14" fill="#38bdf8" />

                  {/* SURFACE PRESSURE & HEAT-FLUX TRANSDUCER TAPS (P1 - P12) */}
                  {INITIAL_PRESSURE_TAPS.map((tap) => {
                    // Compute physical coordinate along model length (chord x from 280 to 670 = 390px span)
                    const tapX = 280 + tap.xRatio * 390;
                    const tapY = 250 + tap.yOffset;
                    const reading = tapReadings[tap.id] || {
                      pressure: tap.basePressureKPa,
                      heatFlux: tap.baseHeatFluxMWM2,
                      temp: tap.wallTempK
                    };
                    const isSelected = selectedTap.id === tap.id;
                    const color = getHeatFluxSvgColor(reading.heatFlux);

                    return (
                      <g
                        key={tap.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => setSelectedTap(tap)}
                      >
                        {/* Tap halo / hotspot */}
                        <circle
                          cx={tapX}
                          cy={tapY}
                          r={isSelected ? 7 : 4}
                          fill={color}
                          fillOpacity={isSelected ? 0.9 : 0.75}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 1}
                        />
                        {/* Tap pulse if critical heat flux */}
                        {reading.heatFlux > 5.5 && (
                          <circle
                            cx={tapX}
                            cy={tapY}
                            r={9}
                            fill="none"
                            stroke={color}
                            strokeWidth="1.2"
                            className="animate-ping"
                          />
                        )}
                        {/* Tap Label */}
                        {showTapLabels && (
                          <text
                            x={tapX + (tap.surface === 'leeward' ? -4 : 5)}
                            y={tapY + (tap.surface === 'leeward' ? -8 : 12)}
                            fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight={isSelected ? 'bold' : 'normal'}
                          >
                            {tap.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Clean Canvas HUD Stamp */}
                <g className="font-mono text-xs opacity-75">
                  <text x="35" y="42" fill="#38bdf8" fontSize="10" fontWeight="bold">
                    NASA LA-HTC // FIELD: Ø 762mm
                  </text>
                  <text x="35" y="56" fill="#94a3b8" fontSize="9">
                    β: <tspan fill="#f97316" fontWeight="bold">{shockAngleDeg}°</tspan> | δ: <tspan fill="#22d3ee">{bowStandoffMm}mm</tspan>
                  </text>
                </g>
              </svg>

              {/* Angle of Attack Control floating badge overlay */}
              <div className="absolute bottom-3 left-3 bg-[#090d16]/90 backdrop-blur border border-slate-800 rounded px-3 py-2 flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-mono">ANGLE OF ATTACK (α)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {angleOfAttack > 0 ? `+${angleOfAttack.toFixed(1)}°` : `${angleOfAttack.toFixed(1)}°`}
                    </span>
                    <input
                      type="range"
                      min="-2.0"
                      max="12.0"
                      step="0.1"
                      value={angleOfAttack}
                      onChange={(e) => setAngleOfAttack(parseFloat(e.target.value))}
                      className="w-24 accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                    />
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-800" />

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-mono">SIDESLIP / YAW (β)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-orange-400">
                      {yawAngle > 0 ? `+${yawAngle.toFixed(1)}°` : `${yawAngle.toFixed(1)}°`}
                    </span>
                    <input
                      type="range"
                      min="-4.0"
                      max="4.0"
                      step="0.1"
                      value={yawAngle}
                      onChange={(e) => setYawAngle(parseFloat(e.target.value))}
                      className="w-20 accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schlieren Diagnostic Footer Spacing */}
            <div className="p-3 border-t border-slate-800/80 bg-[#090d16]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {/* Optical Archive Tag */}
                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3 font-mono text-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      NASA HYP-7.5 OPTICAL ARCHIVE
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
                      10,000 FPS LASER
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">SHOCK ANGLE (β)</span>
                      <span className="text-sm font-bold text-orange-400">{shockAngleDeg}°</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">STANDOFF DISTANCE</span>
                      <span className="text-sm font-bold text-cyan-300">{bowStandoffMm} mm</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>EXPOSURE: 120 ns (Q-SWITCHED YAG)</span>
                    <span className="text-emerald-400 font-semibold">KNIFE-EDGE: 90° VERT</span>
                  </div>
                </div>

                {/* Active Pressure Tap Card (P2: P02) */}
                {selectedTap && (
                  <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-lg p-3 font-mono text-xs shadow-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        ACTIVE TAP: {selectedTap.label}: {selectedTap.id}
                      </span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {selectedTap.surface}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mb-2 truncate">
                      {selectedTap.location}
                    </div>
                    {/* Heat flux and pressure metric badges with comfortable p-2.5 internal padding & zero clipped characters */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
                        <span className="text-slate-400 text-[10px] block">STATIC PRESSURE</span>
                        <span className="text-sm font-bold text-white whitespace-nowrap mt-0.5">
                          {(tapReadings[selectedTap.id]?.pressure || selectedTap.basePressureKPa).toFixed(1)} kPa
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
                        <span className="text-slate-400 text-[10px] block">HEAT FLUX (qw)</span>
                        <span className="text-sm font-bold text-orange-400 whitespace-nowrap mt-0.5">
                          {(tapReadings[selectedTap.id]?.heatFlux || selectedTap.baseHeatFluxMWM2).toFixed(2)} MW/m²
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
                        <span className="text-slate-400 text-[10px] block">WALL TEMP (Tw)</span>
                        <span className="text-sm font-bold text-fuchsia-400 whitespace-nowrap mt-0.5">
                          {tapReadings[selectedTap.id]?.temp || selectedTap.wallTempK} K
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
                        <span className="text-slate-400 text-[10px] block">CHORD X/C</span>
                        <span className="text-sm font-bold text-cyan-300 whitespace-nowrap mt-0.5">
                          x/c = {selectedTap.xRatio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CENTER-RIGHT (5 COLS): ARC-HEATER & HIGH-PRESSURE GAS DRIVER DIAGNOSTICS */}
          <div className="lg:col-span-5 flex flex-col bg-[#0b0f17] border border-slate-800 rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-800/80 bg-[#090d16] px-3.5 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <h2 className="text-xs font-bold font-mono tracking-wider text-slate-200">
                  ARC-HEATER & HIGH-PRESSURE DRIVER DIAGNOSTICS
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/40 text-orange-300 border border-orange-800/60">
                CONSTRESTRICTED ARC COIL: 1.85 T
              </span>
            </div>

            {/* Diagnostic gauges & live readouts */}
            <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between overflow-y-auto">
              {/* Primary Arc-Heater Power Draw Block */}
              <div className="bg-[#0f172a] border border-slate-800 rounded p-3 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    HUELS-TYPE CONSTRICTED ARC-HEATER POWER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                    STABLE DISCHARGE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 block">TOTAL POWER</span>
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      {arcHeaterPowerMw.toFixed(1)} <span className="text-xs text-slate-400 font-normal">MW</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 block">ARC CURRENT</span>
                    <span className="text-lg font-mono font-bold text-white">
                      {arcCurrentA.toLocaleString()} <span className="text-xs text-slate-400 font-normal">A</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 block">VOLTAGE DROP</span>
                    <span className="text-lg font-mono font-bold text-white">
                      {arcVoltageV.toLocaleString()} <span className="text-xs text-slate-400 font-normal">V</span>
                    </span>
                  </div>
                </div>

                {/* Power Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>ELECTRODE THERMAL LOAD</span>
                    <span>{((arcHeaterPowerMw / 60.0) * 100).toFixed(0)}% OF 60 MW FACILITY RATING</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 h-full transition-all duration-300"
                      style={{ width: `${(arcHeaterPowerMw / 60.0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sub-system Diagnostics 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pebble-Bed Preheater */}
                <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-fuchsia-400" />
                      PEBBLE-BED PREHEATER
                    </span>
                    <span className="text-fuchsia-400 font-bold">ZrO2 CORE</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-lg font-mono font-bold text-white">
                      {pebbleBedTempK} <span className="text-xs text-slate-400">K</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Gradient: 18 K/m
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                    <span>Argon Blanket: 3.4 MPa</span>
                    <span className="text-emerald-400">NOMINAL</span>
                  </div>
                </div>

                {/* Nozzle Throat Water Jacket Delta-T */}
                <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      NOZZLE THROAT COOLING
                    </span>
                    <span className="text-cyan-400 font-bold">CuCrZr LINER</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-lg font-mono font-bold text-cyan-300">
                      ΔT {nozzleDeltaTC.toFixed(1)} <span className="text-xs text-slate-400">°C</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      182 L/min
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                    <span>P_inlet: 4.2 MPa</span>
                    <span className="text-emerald-400">PUMP 1+2 DUAL</span>
                  </div>
                </div>

                {/* Vacuum Sphere Dump Tank Pressure */}
                <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      VACUUM SPHERE DUMP TANK
                    </span>
                    <span className="text-emerald-400 font-bold">50-FT SPHERE</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-lg font-mono font-bold text-white">
                      {vacuumSphereTorr.toFixed(1)} <span className="text-xs text-slate-400">Torr</span>
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      Back-P limit 40T
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                    <span>Roots Blowers: 4/4 ON</span>
                    <span className="text-emerald-400">DIFFUSER SEALED</span>
                  </div>
                </div>

                {/* Driver Gas Bottle Banks */}
                <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-orange-400" />
                      DRIVER GAS RESERVOIRS
                    </span>
                    <span className="text-orange-400 font-bold">BOTTLE BANK</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-mono font-bold text-slate-200">
                      He: <span className="text-orange-300">{heliumBottleBankMpa.toFixed(1)} MPa</span>
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-200">
                      N2: <span className="text-cyan-300">{nitrogenBufferMpa.toFixed(1)} MPa</span>
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                    <span>Fast Quench Supply: 98%</span>
                    <span className="text-emerald-400">ARMED</span>
                  </div>
                </div>
              </div>

              {/* Enthalpy Energy Balance Strip */}
              <div className="bg-[#090d16] border border-slate-800 rounded p-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-slate-400">FACILITY TOTAL BULK ENTHALPY (H0):</span>
                  <span className="text-sm font-bold text-fuchsia-400 font-mono">3.82 MJ / kg</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-400">
                  <div className="border border-slate-800 p-1 rounded bg-slate-900/50">
                    <span className="block text-slate-500">Throat ṁ</span>
                    <span className="text-white font-bold">14.8 kg/s</span>
                  </div>
                  <div className="border border-slate-800 p-1 rounded bg-slate-900/50">
                    <span className="block text-slate-500">K-Ratio (γ)</span>
                    <span className="text-white font-bold">1.332</span>
                  </div>
                  <div className="border border-slate-800 p-1 rounded bg-slate-900/50">
                    <span className="block text-slate-500">Pitot P02</span>
                    <span className="text-white font-bold">142 kPa</span>
                  </div>
                  <div className="border border-slate-800 p-1 rounded bg-slate-900/50">
                    <span className="block text-slate-500">Gas Mix</span>
                    <span className="text-cyan-400 font-bold">Air + 4% He</span>
                  </div>
                </div>
              </div>

              {/* Optical Capture Reel Preview strip */}
              <div className="border border-slate-800/80 rounded p-2 bg-[#090d16]">
                <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    RECENT OPTICAL SCHLIEREN FRAMES ({capturedFrames.length})
                  </span>
                  <span className="text-[10px] text-cyan-400 font-semibold">10,000 FPS LASER DIODE</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {capturedFrames.map((frame) => (
                    <div
                      key={frame.id}
                      className="flex-shrink-0 bg-slate-900 border border-slate-800 hover:border-cyan-600 rounded p-1.5 w-32 font-mono text-[10px] transition-all cursor-pointer"
                    >
                      <div className="flex justify-between text-slate-400">
                        <span className="text-white font-bold">{frame.id}</span>
                        <span className="text-cyan-400">{frame.timestamp}</span>
                      </div>
                      <div className="text-slate-500 text-[9px] mt-0.5">
                        M{frame.mach} @ {frame.aoa}° AoA
                      </div>
                      <div className="text-[9px] text-orange-400 font-semibold mt-0.5">
                        β={frame.shockAngleDeg}° // {frame.peakFlux} MW/m²
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM (12 COLS): AERODYNAMIC LOAD MANIFEST & PIEZOELECTRIC TRANSDUCER LEDGER */}
          <div className="lg:col-span-12 flex flex-col bg-[#0b0f17] border border-slate-800 rounded-lg shadow-xl overflow-hidden">
            {/* Ledger Tabs & Action Bar */}
            <div className="border-b border-slate-800/80 bg-[#090d16] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs md:text-sm font-bold font-mono tracking-wider text-slate-100">
                  INTERNAL 6-COMPONENT FORCE BALANCE & PIEZOELECTRIC TRANSDUCER LEDGER
                </h2>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center space-x-1 bg-slate-900/90 p-0.5 rounded border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === 'telemetry'
                      ? 'bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-700/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  6-DOF FORCES & MOMENTS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('matrix')}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === 'matrix'
                      ? 'bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-700/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  TEST CAMPAIGN RUN MATRIX
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('oscilloscope')}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === 'oscilloscope'
                      ? 'bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-700/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  12-TAP PRESSURE MAP (P1-P12)
                </button>
              </div>

              {/* Quick Actions Triggers */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSpectralModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>FFT SPECTRAL MODES</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-600/70 text-xs font-mono text-cyan-300 font-semibold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT HDF5 TELEMETRY</span>
                </button>
              </div>
            </div>

            {/* TAB 1: 6-DOF FORCES & MOMENTS TABLE AND AERODYNAMIC PERFORMANCE */}
            {activeTab === 'telemetry' && (
              <div className="p-4 space-y-4">
                {/* 6 Performance Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">LIFT-TO-DRAG (L/D)</span>
                    <span className="text-xl font-mono font-extrabold text-cyan-400">
                      {forceBalance.liftToDrag.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                      Target: &gt; 3.20 (MET)
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">PEAK HEAT FLUX (qw)</span>
                    <span className="text-xl font-mono font-extrabold text-orange-400">
                      5.84 <span className="text-xs text-slate-400 font-normal">MW/m²</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 block mt-0.5">
                      Cowl Stagnation Locus
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">DYNAMIC PRESS. (q∞)</span>
                    <span className="text-xl font-mono font-extrabold text-white">
                      {forceBalance.dynamicPressureKPa.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kPa</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      1,768 lb/ft²
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">REYNOLDS NO. (Re/m)</span>
                    <span className="text-xl font-mono font-extrabold text-fuchsia-400">
                      {forceBalance.reynoldsMillion.toFixed(2)} <span className="text-xs text-slate-400 font-normal">×10⁶</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      Unit Reynolds Number
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">SKIN FRICTION COEFF (Cf)</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-400">
                      0.00168
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                      {blSuctionActive ? '-12% Suction Benefit' : 'Standard Baseline'}
                    </span>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800 rounded p-2.5">
                    <span className="text-[10px] font-mono text-slate-400 block">TRIP STATUS</span>
                    <span className="text-lg font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      LAMINAR RUN
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                      Forebody Clean Flow
                    </span>
                  </div>
                </div>

                {/* 6-Component Balance Real-time Tabular Ledger */}
                <div className="border border-slate-800 rounded overflow-x-auto max-h-[320px] overflow-y-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="sticky top-0 bg-[#070A12] z-10 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                      <tr>
                        <th className="px-3 py-2">Component Axis</th>
                        <th className="px-3 py-2">Force / Moment Variable</th>
                        <th className="px-3 py-2">Measured Value</th>
                        <th className="px-3 py-2">Aero Coefficient</th>
                        <th className="px-3 py-2">Balance Uncertainty</th>
                        <th className="px-3 py-2">Transducer Health</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#0b0f17]">
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-cyan-300">NORMAL / LIFT (L)</td>
                        <td className="px-3 py-2 text-slate-400">F_z (Vertical Lift)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.liftN.toLocaleString()} N</td>
                        <td className="px-3 py-2 text-cyan-400">C_L = {(forceBalance.liftN / 42000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 12.4 N (0.08%)</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-orange-300">AXIAL / DRAG (D)</td>
                        <td className="px-3 py-2 text-slate-400">F_x (Streamwise Drag)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.dragN.toLocaleString()} N</td>
                        <td className="px-3 py-2 text-orange-400">C_D = {(forceBalance.dragN / 42000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 8.2 N (0.19%)</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-fuchsia-300">PITCHING MOMENT (M_y)</td>
                        <td className="px-3 py-2 text-slate-400">M_pitch (About 0.65 c)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.pitchingMomentNm} N·m</td>
                        <td className="px-3 py-2 text-fuchsia-400">C_m = {(forceBalance.pitchingMomentNm / 28000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 1.4 N·m</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-slate-300">SIDE FORCE (Y)</td>
                        <td className="px-3 py-2 text-slate-400">F_y (Cross-flow lateral)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.sideForceN} N</td>
                        <td className="px-3 py-2 text-slate-300">C_Y = {(forceBalance.sideForceN / 42000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 2.1 N</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-slate-300">YAWING MOMENT (M_z)</td>
                        <td className="px-3 py-2 text-slate-400">M_yaw (Directional)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.yawMomentNm} N·m</td>
                        <td className="px-3 py-2 text-slate-300">C_n = {(forceBalance.yawMomentNm / 28000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 0.8 N·m</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 font-bold text-slate-300">ROLLING MOMENT (M_x)</td>
                        <td className="px-3 py-2 text-slate-400">M_roll (Lateral dihedral)</td>
                        <td className="px-3 py-2 font-bold text-white">{forceBalance.rollMomentNm} N·m</td>
                        <td className="px-3 py-2 text-slate-300">C_l = {(forceBalance.rollMomentNm / 28000).toFixed(4)}</td>
                        <td className="px-3 py-2 text-slate-400">± 0.5 N·m</td>
                        <td className="px-3 py-2 text-emerald-400 font-semibold">CALIBRATED // OPTIMAL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ACTIVE TEST MATRIX RUN-01 TO RUN-08 */}
            {activeTab === 'matrix' && (
              <div className="p-4 space-y-3">
                <div className="border border-slate-800 rounded overflow-x-auto max-h-[320px] overflow-y-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="sticky top-0 bg-[#070A12] z-10 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                      <tr>
                        <th className="px-3 py-2">Run ID</th>
                        <th className="px-3 py-2">Model Variant</th>
                        <th className="px-3 py-2">Target Mach</th>
                        <th className="px-3 py-2">Target AoA</th>
                        <th className="px-3 py-2">Enthalpy H0</th>
                        <th className="px-3 py-2">Blowdown Duration</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Engineering Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#0b0f17]">
                      {runsList.map((run) => (
                        <tr
                          key={run.id}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            run.status === 'ACTIVE' ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400' : ''
                          }`}
                        >
                          <td className="px-3 py-2 font-bold text-cyan-300">{run.runCode}</td>
                          <td className="px-3 py-2 text-slate-200">{run.modelVariant}</td>
                          <td className="px-3 py-2 font-bold text-white">Mach {run.machTarget}</td>
                          <td className="px-3 py-2 text-orange-400">{run.aoaTarget}°</td>
                          <td className="px-3 py-2 text-fuchsia-400">{run.driverEnthalpyMJkg} MJ/kg</td>
                          <td className="px-3 py-2 text-slate-300">{run.targetDurationSec}s</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                run.status === 'ACTIVE'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 animate-pulse'
                                  : run.status === 'COMPLETED'
                                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                  : 'bg-amber-950/40 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {run.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-400 text-[11px]">{run.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: 12-TAP TRANSDUCER PROFILE (P1 TO P12) */}
            {activeTab === 'oscilloscope' && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {INITIAL_PRESSURE_TAPS.map((tap) => {
                    const r = tapReadings[tap.id] || {
                      pressure: tap.basePressureKPa,
                      heatFlux: tap.baseHeatFluxMWM2,
                      temp: tap.wallTempK
                    };
                    const isSelected = selectedTap.id === tap.id;
                    const badgeClass = getHeatFluxColor(r.heatFlux);

                    return (
                      <div
                        key={tap.id}
                        onClick={() => setSelectedTap(tap)}
                        className={`bg-[#0f172a] border rounded p-3 cursor-pointer transition-all hover:border-cyan-500 font-mono text-xs ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            {tap.label} // {tap.id}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeClass}`}>
                            {r.heatFlux.toFixed(2)} MW/m²
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mb-2">
                          {tap.location}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[9px]">STATIC PRESS.</span>
                            <span className="text-white font-bold">{r.pressure.toFixed(1)} kPa</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">SURFACE TEMP.</span>
                            <span className="text-fuchsia-400 font-bold">{r.temp} K</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM METADATA & FOOTER */}
        <footer className="border-t border-slate-800/80 bg-[#090d16] px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              FACILITY DAQ: 64-CHANNEL 16-BIT 10 MSPS SYNCHRONOUS
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">TEST CELL ATMOSPHERE: HE-ENRICHED CRYOGENIC NITROGEN BLEND</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">BUILD: REV-4.8.1-INSTITUTIONAL</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              SYS-INTEGRITY: NOMINAL
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <HypersonicTunnelControl />
    </>
  );
}
