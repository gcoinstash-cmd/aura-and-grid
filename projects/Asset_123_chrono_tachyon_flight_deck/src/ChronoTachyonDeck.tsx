import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Gauge,
  Zap,
  Flame,
  ShieldAlert,
  Activity,
  Wind,
  Thermometer,
  RotateCcw,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
  Radio,
  Layers,
  ChevronRight,
  Sparkles,
  Cpu,
  RefreshCw,
  FileText
} from 'lucide-react';

// Types
export type InletMode = 'SUBSONIC STARTUP' | 'TRANSONIC INGRESS' | 'SCRAMJET SUPERSONIC RAM' | 'EMERGENCY INLET UNSTART';

export interface SectorRecord {
  id: number;
  sectorName: string;
  mach: number;
  speedKmh: number;
  thrustKn: number;
  dynamicPressureKpa: number;
  captureRatio: number;
  repulsionForceKn: number;
  skidGapMm: number;
  status: 'LOCKED' | 'OPTIMAL' | 'STABLE' | 'HIGH_STRESS' | 'NOMINAL' | 'ALERT';
  elapsedMs: number;
}

export interface SkidCornerState {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface DiagnosticEvent {
  id: string;
  time: string;
  type: string;
  severity: 'INFO' | 'NORMAL' | 'WARNING' | 'CRITICAL';
  details: string;
}

const INITIAL_SECTORS: SectorRecord[] = [
  { id: 1, sectorName: 'S1 - Launch Ingress & Pre-Ram', mach: 0.285, speedKmh: 350.2, thrustKn: 14.2, dynamicPressureKpa: 88.4, captureRatio: 0.780, repulsionForceKn: 38.4, skidGapMm: 3.8, status: 'NOMINAL', elapsedMs: 3420 },
  { id: 2, sectorName: 'S2 - Supersonic Ramp Ramp-Up Alpha', mach: 0.312, speedKmh: 383.6, thrustKn: 17.8, dynamicPressureKpa: 105.8, captureRatio: 0.815, repulsionForceKn: 41.2, skidGapMm: 3.2, status: 'LOCKED', elapsedMs: 2980 },
  { id: 3, sectorName: 'S3 - Transonic Straightaway Ingress', mach: 0.338, speedKmh: 415.7, thrustKn: 21.4, dynamicPressureKpa: 124.6, captureRatio: 0.852, repulsionForceKn: 44.6, skidGapMm: 2.7, status: 'LOCKED', elapsedMs: 2750 },
  { id: 4, sectorName: 'S4 - Scramjet Silane Primary Injection', mach: 0.360, speedKmh: 442.8, thrustKn: 26.8, dynamicPressureKpa: 142.0, captureRatio: 0.890, repulsionForceKn: 48.2, skidGapMm: 2.1, status: 'LOCKED', elapsedMs: 2590 },
  { id: 5, sectorName: 'S5 - Salt Flats High-Q Choke Point', mach: 0.378, speedKmh: 464.9, thrustKn: 27.9, dynamicPressureKpa: 156.4, captureRatio: 0.912, repulsionForceKn: 51.8, skidGapMm: 1.9, status: 'STABLE', elapsedMs: 2480 },
  { id: 6, sectorName: 'S6 - Mag-Lev High-G Bank Ingress', mach: 0.372, speedKmh: 457.5, thrustKn: 26.1, dynamicPressureKpa: 151.2, captureRatio: 0.904, repulsionForceKn: 56.4, skidGapMm: 1.7, status: 'OPTIMAL', elapsedMs: 2540 },
  { id: 7, sectorName: 'S7 - Apex Magnetic Levitation Turn', mach: 0.354, speedKmh: 435.4, thrustKn: 23.5, dynamicPressureKpa: 137.5, captureRatio: 0.874, repulsionForceKn: 62.8, skidGapMm: 1.5, status: 'HIGH_STRESS', elapsedMs: 2810 },
  { id: 8, sectorName: 'S8 - Oblique Shock Re-Alignment Exit', mach: 0.369, speedKmh: 453.8, thrustKn: 26.4, dynamicPressureKpa: 149.3, captureRatio: 0.898, repulsionForceKn: 50.1, skidGapMm: 2.0, status: 'LOCKED', elapsedMs: 2620 },
  { id: 9, sectorName: 'S9 - Tachyon Main Runway Burn', mach: 0.395, speedKmh: 485.8, thrustKn: 28.1, dynamicPressureKpa: 171.2, captureRatio: 0.940, repulsionForceKn: 49.0, skidGapMm: 2.2, status: 'LOCKED', elapsedMs: 2350 },
  { id: 10, sectorName: 'S10 - Supersonic Iso-Chamber Expansion', mach: 0.412, speedKmh: 506.7, thrustKn: 28.4, dynamicPressureKpa: 186.0, captureRatio: 0.958, repulsionForceKn: 48.5, skidGapMm: 2.3, status: 'OPTIMAL', elapsedMs: 2240 },
  { id: 11, sectorName: 'S11 - Aerodynamic Boundary Bleed Arc', mach: 0.404, speedKmh: 496.9, thrustKn: 27.6, dynamicPressureKpa: 179.1, captureRatio: 0.945, repulsionForceKn: 52.0, skidGapMm: 2.0, status: 'LOCKED', elapsedMs: 2300 },
  { id: 12, sectorName: 'S12 - Decel Thermal Soak Buffer', mach: 0.380, speedKmh: 467.4, thrustKn: 24.2, dynamicPressureKpa: 158.3, captureRatio: 0.908, repulsionForceKn: 47.6, skidGapMm: 2.4, status: 'NOMINAL', elapsedMs: 2510 },
  { id: 13, sectorName: 'S13 - Cryo Skid Re-Stabilization', mach: 0.345, speedKmh: 424.3, thrustKn: 19.8, dynamicPressureKpa: 130.4, captureRatio: 0.860, repulsionForceKn: 43.5, skidGapMm: 3.0, status: 'NOMINAL', elapsedMs: 2780 },
  { id: 14, sectorName: 'S14 - Recovery Deceleration Trap', mach: 0.298, speedKmh: 366.5, thrustKn: 15.0, dynamicPressureKpa: 97.2, captureRatio: 0.795, repulsionForceKn: 39.8, skidGapMm: 3.6, status: 'NOMINAL', elapsedMs: 3120 }
];

export const ChronoTachyonDeck: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'FLIGHT DECK HUD' | 'SCRAMJET INTAKE MAP' | 'MAG-SKID CRYO BUS' | 'VELOCITY RUN LEDGER' | 'SYSTEM LOGS'>('FLIGHT DECK HUD');

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 5>(1);

  // Active flight parameters (live animated)
  const [speedKmh, setSpeedKmh] = useState<number>(442.8);
  const [drivePowerKw, setDrivePowerKw] = useState<number>(2535.0);
  const [scramjetThrustKn, setScramjetThrustKn] = useState<number>(26.8);
  const [dynamicPressureKpa, setDynamicPressureKpa] = useState<number>(142.0);
  const [gForce, setGForce] = useState<number>(4.5);
  const [inletMode, setInletMode] = useState<InletMode>('SCRAMJET SUPERSONIC RAM');
  const [rampAngleDeg, setRampAngleDeg] = useState<number>(14.2);
  const [bypassActive, setBypassActive] = useState<boolean>(false);
  const [cryoTempK, setCryoTempK] = useState<number>(77.3);
  const [fluxStabilityPct, setFluxStabilityPct] = useState<number>(99.6);
  const [fuelFlowKgS, setFuelFlowKgS] = useState<number>(1.84);
  const [isolatorPressureKpa, setIsolatorPressureKpa] = useState<number>(198.4);
  const [combustionBar, setCombustionBar] = useState<number>(18.4);

  // Skid clearance state in mm (measured at 4 corners)
  const [skidGaps, setSkidGaps] = useState<SkidCornerState>({
    fl: 2.10,
    fr: 2.15,
    rl: 2.05,
    rr: 2.10
  });

  // Action status / banner feedback
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>({
    message: 'FLIGHT COMPUTER ONLINE // SCRAMJET ISOLATOR CRITICAL PRESSURE LOCKED',
    type: 'success'
  });

  // Modals state
  const [bypassModalOpen, setBypassModalOpen] = useState<boolean>(false);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState<boolean>(false);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [cryoCycleActive, setCryoCycleActive] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<SectorRecord | null>(null);

  // Diagnostic Logs
  const [logs, setLogs] = useState<DiagnosticEvent[]>([
    { id: 'EV-884', time: '15:20:12', type: 'INLET_RAMP_SYNC', severity: 'NORMAL', details: 'Hydraulic ramp angle synchronized to Mach 0.360 flight profile.' },
    { id: 'EV-883', time: '15:19:44', type: 'SILANE_INJECTION', severity: 'NORMAL', details: 'Supersonic catalyst delivery nominal at 1.840 kg/s mass rate.' },
    { id: 'EV-882', time: '15:18:02', type: 'FLUX_PINNING_LOCK', severity: 'NORMAL', details: 'Coil levitation repulsion locked at 48.2 kN with 2.10 mm average clearance.' },
    { id: 'EV-881', time: '15:16:30', type: 'CRYO_STABILITY', severity: 'NORMAL', details: 'Subcooled LN2 loop pressure 1.8 bar, cryostat steady at 77.30 Kelvin.' },
    { id: 'EV-880', time: '15:14:15', type: 'ACOUSTIC_NODE_ALIGN', severity: 'INFO', details: 'Internal isolator shock train established between station X-220 and X-245.' }
  ]);

  // Derived Mach number (1 Mach ≈ 1,225 km/h at standard sea-level STP)
  const machNumber = useMemo(() => {
    return Number((speedKmh / 1225.0).toFixed(3));
  }, [speedKmh]);

  // Oblique Shock wave angle calculation: theta = arcsin(1/M) + delta
  const shockWaveAngleDeg = useMemo(() => {
    if (inletMode === 'EMERGENCY INLET UNSTART') return 82.5; // Detached bow shock
    const m = Math.max(machNumber, 0.28);
    // Radians calculation for aesthetic aerodynamic visualization
    const machAngle = Math.asin(Math.min(1.0, 1.0 / (m * 2.8))) * (180 / Math.PI);
    return Number((machAngle * 0.5 + rampAngleDeg * 0.9).toFixed(1));
  }, [machNumber, rampAngleDeg, inletMode]);

  // Simulation tick loop
  const tickRef = useRef<number>(0);
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current * (simSpeed === 5 ? 0.2 : 0.05);

      // Controlled micro-fluctuations simulating genuine supersonic flight telemetry
      const speedJitter = Math.sin(t * 1.5) * 1.8 + Math.cos(t * 0.8) * 0.9;
      const baseSpeed = inletMode === 'SUBSONIC STARTUP' ? 320.0
        : inletMode === 'TRANSONIC INGRESS' ? 410.0
        : inletMode === 'EMERGENCY INLET UNSTART' ? 240.0
        : 442.8;

      const newSpeed = Number((baseSpeed + speedJitter).toFixed(1));
      setSpeedKmh(newSpeed);

      // Power and Thrust response
      const thrustBase = inletMode === 'EMERGENCY INLET UNSTART' ? 4.2
        : inletMode === 'SUBSONIC STARTUP' ? 14.5
        : inletMode === 'TRANSONIC INGRESS' ? 21.8
        : 26.8;
      const thrustJitter = Math.cos(t * 2.1) * 0.25;
      setScramjetThrustKn(Number((thrustBase + thrustJitter).toFixed(2)));

      const powerBase = inletMode === 'EMERGENCY INLET UNSTART' ? 1200
        : inletMode === 'SUBSONIC STARTUP' ? 1850
        : 2535;
      setDrivePowerKw(Number((powerBase + Math.sin(t) * 15).toFixed(0)));

      // Dynamic Pressure Q = 0.5 * rho * v^2 ~ proportional to speed squared
      const qVal = Number(((newSpeed / 442.8) * (newSpeed / 442.8) * 142.0).toFixed(1));
      setDynamicPressureKpa(qVal);

      // G Force dynamic compensation
      setGForce(Number((4.5 + Math.sin(t * 1.2) * 0.18).toFixed(2)));

      // Skid Gap micro-fluctuations (0.8 mm to 5.0 mm bounds)
      const baseGap = inletMode === 'EMERGENCY INLET UNSTART' ? 3.8 : 2.10;
      setSkidGaps({
        fl: Number(Math.max(0.8, Math.min(5.0, baseGap + Math.sin(t * 3.1) * 0.06)).toFixed(2)),
        fr: Number(Math.max(0.8, Math.min(5.0, baseGap + 0.05 + Math.cos(t * 2.8) * 0.05)).toFixed(2)),
        rl: Number(Math.max(0.8, Math.min(5.0, baseGap - 0.05 + Math.sin(t * 2.5) * 0.07)).toFixed(2)),
        rr: Number(Math.max(0.8, Math.min(5.0, baseGap + Math.cos(t * 3.3) * 0.06)).toFixed(2))
      });

      // Cryostat and Fuel variations
      setCryoTempK(Number((77.30 + Math.sin(t * 0.5) * 0.08).toFixed(2)));
      setFluxStabilityPct(Number((99.60 + Math.cos(t * 0.7) * 0.15).toFixed(2)));
      setFuelFlowKgS(Number((inletMode === 'EMERGENCY INLET UNSTART' ? 0.32 : 1.84 + Math.sin(t * 1.9) * 0.02).toFixed(3)));
      setIsolatorPressureKpa(Number((inletMode === 'EMERGENCY INLET UNSTART' ? 92.5 : 198.4 + Math.cos(t * 2.0) * 2.1).toFixed(1)));
      setCombustionBar(Number((inletMode === 'EMERGENCY INLET UNSTART' ? 4.1 : 18.4 + Math.sin(t * 2.2) * 0.3).toFixed(2)));
    }, 120);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed, inletMode]);

  // Mode changer handler
  const handleSetMode = (mode: InletMode) => {
    setInletMode(mode);
    let ramp = 14.2;
    let notice = '';
    if (mode === 'SUBSONIC STARTUP') {
      ramp = 5.0;
      notice = 'MODE: SUBSONIC STARTUP // COMPRESSION RAMP RELAXED TO 5.0°';
    } else if (mode === 'TRANSONIC INGRESS') {
      ramp = 10.2;
      notice = 'MODE: TRANSONIC INGRESS // BOUNDARY BLEED ACTIVATED (10.2°)';
    } else if (mode === 'SCRAMJET SUPERSONIC RAM') {
      ramp = 14.2;
      notice = 'MODE: SCRAMJET SUPERSONIC RAM // FULL ISOLATOR LOCK (14.2°)';
    } else if (mode === 'EMERGENCY INLET UNSTART') {
      ramp = 21.0;
      notice = 'WARNING: EMERGENCY INLET UNSTART FORCED // BYPASS DOOR FLUSH ARMED';
    }
    setRampAngleDeg(ramp);
    setActionNotice({
      message: notice,
      type: mode === 'EMERGENCY INLET UNSTART' ? 'warning' : 'success'
    });

    const newLog: DiagnosticEvent = {
      id: `EV-${Math.floor(Math.random() * 900 + 100)}`,
      time: new Date().toTimeString().split(' ')[0],
      type: 'MODE_TRANSITION',
      severity: mode === 'EMERGENCY INLET UNSTART' ? 'CRITICAL' : 'NORMAL',
      details: `Inlet operational envelope pivoted to ${mode}. Ramp angle set to ${ramp}°.`
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Pre-Cool Mag Skids action
  const handlePreCoolSkids = () => {
    setCryoCycleActive(true);
    setActionNotice({
      message: 'CRYO FLUSH ENGAGED // SUBCOOLED LIQUID NITROGEN FLUSHING TO ALL 4 FLUX COILS',
      type: 'info'
    });
    setTimeout(() => {
      setCryoTempK(76.95);
      setFluxStabilityPct(99.92);
      setCryoCycleActive(false);
      setActionNotice({
        message: 'CRYO FLUSH COMPLETE // COIL TEMPERATURE SATURATED AT 76.95 KELVIN (STABILITY 99.92%)',
        type: 'success'
      });
      const newLog: DiagnosticEvent = {
        id: `EV-${Math.floor(Math.random() * 900 + 100)}`,
        time: new Date().toTimeString().split(' ')[0],
        type: 'CRYO_PRE_COOL',
        severity: 'NORMAL',
        details: 'High-pressure LN2 pulsed through quad-corner cryostats; thermal dissipation stabilized.'
      };
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 2400);
  };

  // Inlet Ramp Calibration Action
  const handleInletCalibration = () => {
    setCalibrationModalOpen(true);
    setCalibrationProgress(10);
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCalibrationModalOpen(false);
            setActionNotice({
              message: 'INLET RAMP CALIBRATION PASSED // ACTUATOR RESOLUTION CONFIRMED ±0.015 DEGREE',
              type: 'success'
            });
            const newLog: DiagnosticEvent = {
              id: `EV-${Math.floor(Math.random() * 900 + 100)}`,
              time: new Date().toTimeString().split(' ')[0],
              type: 'RAMP_CALIBRATION',
              severity: 'NORMAL',
              details: '3-stage variable ramp sweep 4.0° to 22.0° executed with 100% position accuracy.'
            };
            setLogs(prev => [newLog, ...prev.slice(0, 19)]);
          }, 600);
          return 100;
        }
        return prev + 18;
      });
    }, 200);
  };

  // Emergency Air Spill action
  const handleEmergencyAirSpill = () => {
    setBypassActive(prev => {
      const next = !prev;
      setActionNotice({
        message: next
          ? 'EMERGENCY AIR SPILL DOORS DEPLOYED // ISOLATOR BACKPRESSURE RELIEVED'
          : 'AIR SPILL DOORS RETRACTED // FULL ISOLATOR COMPRESSION RE-ENGAGED',
        type: next ? 'warning' : 'info'
      });
      const newLog: DiagnosticEvent = {
        id: `EV-${Math.floor(Math.random() * 900 + 100)}`,
        time: new Date().toTimeString().split(' ')[0],
        type: 'BYPASS_TOGGLE',
        severity: next ? 'WARNING' : 'NORMAL',
        details: next ? 'Bypass cowl actuated open to vent 42% dynamic volume.' : 'Bypass cowl locked flush with aerodynamic skin.'
      };
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);
      return next;
    });
  };

  // Export Telemetry CSV
  const handleExportCSV = () => {
    const headers = [
      'Sector ID',
      'Sector Name',
      'Mach Speed',
      'Ground Speed (km/h)',
      'Scramjet Thrust (kN)',
      'Dynamic Pressure Q (kPa)',
      'Inlet Capture Area Ratio',
      'Skid Repulsion (kN)',
      'Skid Gap (mm)',
      'Status',
      'Sector Elapsed (ms)'
    ];

    const rows = INITIAL_SECTORS.map(s => [
      s.id,
      `"${s.sectorName}"`,
      s.mach,
      s.speedKmh,
      s.thrustKn,
      s.dynamicPressureKpa,
      s.captureRatio,
      s.repulsionForceKn,
      s.skidGapMm,
      s.status,
      s.elapsedMs
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CHRONO_TACHYON_PROTO16_TELEMETRY_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionNotice({
      message: 'TELEMETRY EXPORT INITIATED // 14-SECTOR AERODYNAMIC DATASET DOWNLOADED',
      type: 'success'
    });
  };

  // Skid Height Trim adjustment
  const handleTrimSkid = (corner: keyof SkidCornerState, delta: number) => {
    setSkidGaps(prev => ({
      ...prev,
      [corner]: Number(Math.max(0.8, Math.min(5.0, prev[corner] + delta)).toFixed(2))
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-[#02040A] text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & OPERATIONAL TELEMETRY CONTROL STRIP                      */}
        {/* ========================================================================= */}
        <header className="border-b border-slate-800 bg-[#070B14] px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* Left: Locked Chassis Designation and Armed Status Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                  <span className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 truncate">
                    CHRONO TACHYON-FX
                  </span>
                  <span className="hidden sm:inline-block text-slate-500 font-mono text-sm">/</span>
                  <span className="hidden sm:inline-block text-xs font-bold font-mono tracking-wider uppercase text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60">
                    PROTO-16
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    SCRAMJET ARMED
                  </span>
                </div>
                <div className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 truncate">
                  HYPERSONIC SCRAMJET HYPERCAR // SUPERCONDUCTING FLUX CHASSIS
                </div>
              </div>
            </div>

            {/* Right: Clean h-9 aligned Action & Simulation Controls */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`h-9 px-3 rounded flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors border ${
                  isRunning
                    ? 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-800/80 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-700/60'
                }`}
                title={isRunning ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isRunning ? 'STREAMING' : 'HALTED'}</span>
              </button>

              {/* Simulation Rate: 1x / 5x */}
              <div className="h-9 flex items-center bg-[#0B1120] border border-slate-800 rounded p-0.5">
                <button
                  onClick={() => setSimSpeed(1)}
                  className={`h-7 px-2.5 rounded text-xs font-bold font-mono transition-colors ${
                    simSpeed === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1X
                </button>
                <button
                  onClick={() => setSimSpeed(5)}
                  className={`h-7 px-2.5 rounded text-xs font-bold font-mono transition-colors ${
                    simSpeed === 5 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  5X
                </button>
              </div>

              {/* Keyed Compression Bypass / Inlet Abort Switch */}
              <button
                onClick={() => setBypassModalOpen(true)}
                className={`h-9 px-3 rounded flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-all border ${
                  bypassActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-[#0B1120] hover:bg-slate-900 text-slate-300 border-slate-700/80 hover:border-amber-600/70'
                }`}
                title="Open Safety Interlock Dialog for Compression Bypass"
              >
                {bypassActive ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                <span className="hidden sm:inline">INLET ABORT / BYPASS</span>
                <span className="sm:hidden">BYPASS</span>
              </button>

              {/* Reset to Nominal Profile */}
              <button
                onClick={() => {
                  handleSetMode('SCRAMJET SUPERSONIC RAM');
                  setBypassActive(false);
                  setActionNotice({
                    message: 'TELEMETRY RESTORED // FLIGHT VECTOR RETURNED TO PROTO-16 NOMINAL ENVELOPE',
                    type: 'success'
                  });
                }}
                className="h-9 w-9 rounded bg-[#0B1120] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200"
                title="Reset Telemetry Vector to Nominal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Global Action Banner (High contrast feedback) */}
        {actionNotice && (
          <div className={`px-4 py-2 border-b text-xs md:text-sm font-bold font-mono tracking-wider flex items-center justify-between transition-colors ${
            actionNotice.type === 'warning'
              ? 'bg-amber-950/80 text-amber-200 border-amber-700/80'
              : actionNotice.type === 'info'
              ? 'bg-purple-950/80 text-purple-200 border-purple-700/80'
              : 'bg-cyan-950/80 text-cyan-200 border-cyan-800/80'
          }`}>
            <div className="max-w-[1600px] mx-auto w-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-current shrink-0 animate-ping" />
              <span className="truncate">{actionNotice.message}</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RESPONSIVE SCROLLBAR-NONE VIEW TAB BAR                                    */}
        {/* ========================================================================= */}
        <div className="border-b border-slate-800 bg-[#040812] px-4">
          <div className="max-w-[1600px] mx-auto flex items-center overflow-x-auto scrollbar-none py-2 gap-2">
            {(['FLIGHT DECK HUD', 'SCRAMJET INTAKE MAP', 'MAG-SKID CRYO BUS', 'VELOCITY RUN LEDGER', 'SYSTEM LOGS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-all shrink-0 border ${
                  activeTab === tab
                    ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN OPERATIONS DECK CONTAINER                                            */}
        {/* ========================================================================= */}
        <main className="max-w-[1600px] mx-auto w-full p-4 space-y-4 flex-1">

          {/* ======================================================================= */}
          {/* PANE 1: TOP POWERTRAIN & SCRAMJET THRUST HUD                            */}
          {/* ======================================================================= */}
          <section className="bg-[#0A0F1D] border border-slate-800 rounded-lg p-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  PRIMARY HYPERSONIC TELEMETRY STRIP
                </h2>
                <div className="text-xs font-mono text-slate-400">
                  REAL-TIME PITOT-STATIC & DYNAMIC FLUX VECTOR (SAMPLING @ 1000 HZ)
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <span>MACH NUMBER: <strong className="text-cyan-400 text-sm">{machNumber.toFixed(3)}</strong></span>
                <span className="text-slate-600">|</span>
                <span>COMBUSTION: <strong className="text-purple-400 text-sm">{combustionBar.toFixed(1)} BAR</strong></span>
                <span className="text-slate-600">|</span>
                <span>CHASSIS LOAD: <strong className="text-amber-400 text-sm">{gForce.toFixed(2)} G</strong></span>
              </div>
            </div>

            {/* HUD Metric Grid with Large Flight-Deck Typography */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
              
              {/* Metric 1: Ground Speed */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>GROUND SPEED</span>
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {speedKmh.toFixed(1)}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>KM/H</span>
                  <span className="text-cyan-300/80">MACH {machNumber}</span>
                </div>
              </div>

              {/* Metric 2: Total Drive Power */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>TOTAL DRIVE POWER</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {drivePowerKw.toLocaleString()}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>KW</span>
                  <span className="text-amber-300/90">3,400 BHP EQUIV</span>
                </div>
              </div>

              {/* Metric 3: Scramjet Net Thrust */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>SCRAMJET THRUST</span>
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {scramjetThrustKn.toFixed(1)}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>KN (NET)</span>
                  <span className="text-purple-300">DUAL-PLENUM</span>
                </div>
              </div>

              {/* Metric 4: Dynamic Pressure Q */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>DYNAMIC PRESS. Q</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {dynamicPressureKpa.toFixed(0)}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>KPA</span>
                  <span className="text-slate-300">SALT FLATS AIR</span>
                </div>
              </div>

              {/* Metric 5: Mag-Skid Clearance */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>MAG-SKID GAP</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {skidGaps.fl.toFixed(1)}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>MM @ 4.5G</span>
                  <span className="text-emerald-400">FLUX LOCKED</span>
                </div>
              </div>

              {/* Metric 6: Shock Stability */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>SHOCK ANGLE θ</span>
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  {shockWaveAngleDeg.toFixed(1)}°
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 flex justify-between">
                  <span>OBLIQUE TRAIN</span>
                  <span className={inletMode === 'EMERGENCY INLET UNSTART' ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                    {inletMode === 'EMERGENCY INLET UNSTART' ? 'DETACHED' : 'FOCUSED'}
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* ======================================================================= */}
          {/* PANE 2 & 3 SPLIT: 2D SCRAMJET INTAKE & ELECTROMAGNETIC CRYO MATRIX     */}
          {/* ======================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* CENTER-LEFT (7 Cols): 2D Interactive Scramjet Intake & Shockwave Canvas */}
            <section className="lg:col-span-7 bg-[#0A0F1D] border border-slate-800 rounded-lg p-4 flex flex-col shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-cyan-400" />
                    VARIABLE-GEOMETRY SCRAMJET INTAKE & OBLIQUE SHOCK STAGE
                  </h2>
                  <div className="text-xs font-mono text-slate-400">
                    AERODYNAMIC SPEED-CHASSIS // ISOLATOR SHOCK TRAINS & DUAL SUPERSONIC COMBUSTORS
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  COWL DEFLECTION: <strong className="text-cyan-400">{rampAngleDeg.toFixed(1)}°</strong>
                </span>
              </div>

              {/* Mode Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
                {(['SUBSONIC STARTUP', 'TRANSONIC INGRESS', 'SCRAMJET SUPERSONIC RAM', 'EMERGENCY INLET UNSTART'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleSetMode(mode)}
                    className={`px-2.5 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded border transition-all text-left flex flex-col justify-between ${
                      inletMode === mode
                        ? mode === 'EMERGENCY INLET UNSTART'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                          : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-[#050914] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500">MODE</span>
                    <span className="truncate">{mode.replace('SCRAMJET ', '').replace('EMERGENCY ', '')}</span>
                  </button>
                ))}
              </div>

              {/* Top-Down Aerodynamic Scramjet SVG Visualization Canvas */}
              <div className="relative bg-[#02050D] border border-slate-800/80 rounded-lg p-3 my-2 flex-1 flex flex-col justify-center min-h-[340px] overflow-hidden">
                
                {/* Visual grid watermark / background coordinates */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                
                {/* SVG Flight Deck Engine Cross-Section & Shock Train */}
                <svg viewBox="0 0 740 320" className="w-full h-auto drop-shadow-md select-none">
                  <defs>
                    <linearGradient id="scramjetSkin" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="50%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0B0F17" />
                    </linearGradient>
                    <linearGradient id="combustionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="exhaustFlame" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="40%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Incoming Hypersonic Airflow Streamlines */}
                  <g opacity="0.6">
                    <line x1="20" y1="90" x2="140" y2="90" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="6,4" />
                    <line x1="10" y1="120" x2="160" y2="120" stroke="#06B6D4" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="20" y1="160" x2="180" y2="160" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="10,4" />
                    <line x1="10" y1="200" x2="160" y2="200" stroke="#06B6D4" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="20" y1="230" x2="140" y2="230" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="6,4" />
                    <text x="30" y="70" fill="#94A3B8" fontSize="11" fontFamily="monospace">FREE-STREAM AIRFLOW // M {machNumber}</text>
                  </g>

                  {/* Scramjet Hypercar Outer Body Contour / Aero Nacelle */}
                  <path
                    d="M 120,40 L 260,70 L 480,70 L 620,30 L 660,110 L 600,120 L 520,125 L 420,125 L 300,110 L 200,80 Z"
                    fill="url(#scramjetSkin)"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  <path
                    d="M 120,280 L 260,250 L 480,250 L 620,290 L 660,210 L 600,200 L 520,195 L 420,195 L 300,210 L 200,240 Z"
                    fill="url(#scramjetSkin)"
                    stroke="#334155"
                    strokeWidth="2"
                  />

                  {/* Variable Geometry Intake Forebody Ramp 1 & 2 */}
                  <path
                    d={`M 150,160 L 240,${160 - rampAngleDeg * 2.2} L 310,135 L 310,185 L 240,${160 + rampAngleDeg * 2.2} Z`}
                    fill="#1E293B"
                    stroke="#06B6D4"
                    strokeWidth="2.5"
                  />

                  {/* Oblique Shock Waves */}
                  {inletMode !== 'EMERGENCY INLET UNSTART' ? (
                    <g>
                      {/* Shock Wave 1 from Ramp Tip to Upper/Lower Cowl */}
                      <line
                        x1="150"
                        y1="160"
                        x2="270"
                        y2={85 + (22 - rampAngleDeg) * 1.5}
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeDasharray="4,2"
                        className="animate-pulse"
                      />
                      <line
                        x1="150"
                        y1="160"
                        x2="270"
                        y2={235 - (22 - rampAngleDeg) * 1.5}
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeDasharray="4,2"
                        className="animate-pulse"
                      />
                      {/* Reflected Internal Shock Waves in Isolator */}
                      <polyline
                        points={`270,${95} 320,160 370,105 420,160 470,110`}
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                      <polyline
                        points={`270,${225} 320,160 370,215 420,160 470,210`}
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    </g>
                  ) : (
                    /* Emergency Detached Unstart Bow Shock */
                    <g>
                      <path
                        d="M 120,40 Q 90,160 120,280"
                        fill="none"
                        stroke="#F43F5E"
                        strokeWidth="5"
                        strokeDasharray="8,4"
                        className="animate-pulse"
                      />
                      <text x="50" y="165" fill="#F43F5E" fontSize="13" fontWeight="bold" fontFamily="monospace">
                        DETACHED BOW SHOCK UNSTART
                      </text>
                    </g>
                  )}

                  {/* Internal Isolator & Acoustic Diffuser Stage (Station X-240) */}
                  <rect x="310" y="125" width="160" height="70" fill="#0B132B" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Acoustic Isolator Pressure Nodes */}
                  <circle cx="340" cy="160" r="4" fill="#06B6D4" />
                  <circle cx="390" cy="160" r="4" fill="#38BDF8" />
                  <circle cx="440" cy="160" r="4" fill="#A855F7" />
                  <text x="320" y="120" fill="#94A3B8" fontSize="10" fontFamily="monospace">ISOLATOR SHOCK TRAIN (X-240)</text>

                  {/* Boundary Layer Air Spill / Bypass Duct */}
                  {bypassActive && (
                    <g>
                      <path
                        d="M 330,125 C 330,80 390,80 430,70"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeDasharray="4,2"
                      />
                      <text x="340" y="65" fill="#F59E0B" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        BYPASS AIR SPILL ACTIVE
                      </text>
                    </g>
                  )}

                  {/* Supersonic Fuel Injectors (Silane / CH4 Catalyst Pods) */}
                  <g>
                    <line x1="450" y1="125" x2="450" y2="140" stroke="#A855F7" strokeWidth="3" />
                    <line x1="450" y1="195" x2="450" y2="180" stroke="#A855F7" strokeWidth="3" />
                    <circle cx="450" cy="140" r="3" fill="#C084FC" />
                    <circle cx="450" cy="180" r="3" fill="#C084FC" />
                    <text x="420" y="112" fill="#C084FC" fontSize="9" fontFamily="monospace">SILANE/CH4 INJ</text>
                  </g>

                  {/* Dual Supersonic Combustors (Flameholding Plenums) */}
                  <polygon
                    points="470,120 580,105 580,215 470,200"
                    fill="url(#combustionGlow)"
                    stroke="#A855F7"
                    strokeWidth="2"
                  />

                  {/* Scramjet Exhaust Mach Diamonds & Kinetic Plume */}
                  <path
                    d="M 580,110 L 720,80 L 680,160 L 720,240 L 580,210 Z"
                    fill="url(#exhaustFlame)"
                    opacity={inletMode === 'EMERGENCY INLET UNSTART' ? 0.2 : 0.85}
                  />

                  {/* Mach Diamonds */}
                  {inletMode !== 'EMERGENCY INLET UNSTART' && (
                    <g>
                      <polygon points="605,160 620,150 635,160 620,170" fill="#E0F2FE" />
                      <polygon points="645,160 660,152 675,160 660,168" fill="#BAE6FD" />
                      <polygon points="685,160 695,155 705,160 695,165" fill="#7DD3FC" />
                    </g>
                  )}

                  {/* Chassis Label Overlay */}
                  <text x="500" y="310" fill="#64748B" fontSize="11" fontFamily="monospace">
                    CHRONO AERODYNAMICS // 3-STAGE INTAKE MATRIX
                  </text>
                </svg>
              </div>

              {/* Interactive Fine-Tuning Slider for Ramp Deflection */}
              <div className="bg-[#050914] border border-slate-800 rounded p-3 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold font-mono uppercase text-slate-200">
                      VARIABLE INLET RAMP POSITION TRIM
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      CALIBRATE SHOCK FOCUS DISTANCE TO COWL LIP
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="range"
                    min="4"
                    max="22"
                    step="0.2"
                    value={rampAngleDeg}
                    onChange={(e) => setRampAngleDeg(parseFloat(e.target.value))}
                    className="w-full sm:w-48 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                  <span className="text-sm font-bold font-mono tabular-nums text-cyan-400 w-14 text-right">
                    {rampAngleDeg.toFixed(1)}°
                  </span>
                </div>
              </div>
            </section>

            {/* CENTER-RIGHT (5 Cols): Electromagnetic Skid Levitation & Superconducting Cryo Matrix */}
            <section className="lg:col-span-5 bg-[#0A0F1D] border border-slate-800 rounded-lg p-4 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                    MAG-SKID LEVITATION & CRYO BUS
                  </h2>
                  <div className="text-xs font-mono text-slate-400">
                    QUAD-CORNER FLUX PINNING // 77.3K LIQUID NITROGEN CRYOSTAT
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                  FLUX LOCKED
                </span>
              </div>

              {/* 4-Corner Micro-Gap Flight Clearance Gauges */}
              <div className="grid grid-cols-2 gap-3 my-3">
                
                {/* FL Skid */}
                <div className="bg-[#050914] border border-slate-800/90 rounded p-3 relative">
                  <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-300">
                    <span>FRONT-LEFT [FL]</span>
                    <span className="text-[10px] text-cyan-400">COIL-A1</span>
                  </div>
                  <div className="text-3xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                    {skidGaps.fl.toFixed(2)}
                    <span className="text-xs font-mono text-slate-400 ml-1">MM</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-400">GAP TRIM:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTrimSkid('fl', -0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Lower 0.1 mm"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleTrimSkid('fl', 0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Raise 0.1 mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* FR Skid */}
                <div className="bg-[#050914] border border-slate-800/90 rounded p-3 relative">
                  <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-300">
                    <span>FRONT-RIGHT [FR]</span>
                    <span className="text-[10px] text-cyan-400">COIL-A2</span>
                  </div>
                  <div className="text-3xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                    {skidGaps.fr.toFixed(2)}
                    <span className="text-xs font-mono text-slate-400 ml-1">MM</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-400">GAP TRIM:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTrimSkid('fr', -0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Lower 0.1 mm"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleTrimSkid('fr', 0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Raise 0.1 mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* RL Skid */}
                <div className="bg-[#050914] border border-slate-800/90 rounded p-3 relative">
                  <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-300">
                    <span>REAR-LEFT [RL]</span>
                    <span className="text-[10px] text-purple-400">COIL-B1</span>
                  </div>
                  <div className="text-3xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                    {skidGaps.rl.toFixed(2)}
                    <span className="text-xs font-mono text-slate-400 ml-1">MM</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-400">GAP TRIM:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTrimSkid('rl', -0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Lower 0.1 mm"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleTrimSkid('rl', 0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Raise 0.1 mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* RR Skid */}
                <div className="bg-[#050914] border border-slate-800/90 rounded p-3 relative">
                  <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-300">
                    <span>REAR-RIGHT [RR]</span>
                    <span className="text-[10px] text-purple-400">COIL-B2</span>
                  </div>
                  <div className="text-3xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                    {skidGaps.rr.toFixed(2)}
                    <span className="text-xs font-mono text-slate-400 ml-1">MM</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-400">GAP TRIM:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTrimSkid('rr', -0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Lower 0.1 mm"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleTrimSkid('rr', 0.1)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                        title="Raise 0.1 mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Superconducting Cryostat & Fuel Bus Matrix */}
              <div className="bg-[#050914] border border-slate-800/90 rounded p-3 space-y-3 flex-1 flex flex-col justify-around">
                
                {/* Cryo Temp & Flux Stability */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold font-mono uppercase text-slate-200">
                        CRYOSTAT TEMPERATURE
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">SUBCOOLED LN2 LOOP</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono tabular-nums text-cyan-400">
                      {cryoTempK.toFixed(2)} K
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      FLUX STABILITY {fluxStabilityPct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Fuel Mass Flow & Silane Catalyst */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold font-mono uppercase text-slate-200">
                        SUPERSONIC FUEL MASS FLOW
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">SILANE / CH4 PROPELLANT MIX</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono tabular-nums text-purple-400">
                      {fuelFlowKgS.toFixed(3)} KG/S
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono">PLENUM AT 18.4 BAR</div>
                  </div>
                </div>

                {/* Isolator Static Pressure Transducers */}
                <div>
                  <div className="text-xs font-bold font-mono uppercase text-slate-200 flex justify-between mb-1.5">
                    <span>ISOLATOR TRANSDUCERS (P1 / P2 / P3)</span>
                    <span className="text-cyan-400 font-bold">{isolatorPressureKpa.toFixed(1)} KPA</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#0B1120] border border-slate-800 p-1.5 rounded">
                      <div className="text-[10px] text-slate-400">P1 (DIFFUSER)</div>
                      <div className="text-slate-200 font-bold">104.2 kPa</div>
                    </div>
                    <div className="bg-[#0B1120] border border-slate-800 p-1.5 rounded">
                      <div className="text-[10px] text-slate-400">P2 (THROAT)</div>
                      <div className="text-cyan-300 font-bold">156.8 kPa</div>
                    </div>
                    <div className="bg-[#0B1120] border border-slate-800 p-1.5 rounded">
                      <div className="text-[10px] text-slate-400">P3 (ISOLATOR)</div>
                      <div className="text-purple-300 font-bold">198.4 kPa</div>
                    </div>
                  </div>
                </div>

                {/* Coils Vacuum & Current Readout */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono text-slate-400">
                  <span>COIL CURRENT: <strong className="text-slate-200">1,240 A</strong></span>
                  <span>VACUUM: <strong className="text-slate-200">1.2 × 10⁻⁵ TORR</strong></span>
                  <span>REPULSION: <strong className="text-cyan-400">48.2 KN</strong></span>
                </div>

              </div>
            </section>

          </div>

          {/* ======================================================================= */}
          {/* PANE 4: BOTTOM HYPERSONIC STINT & ACCELERATION VECTOR LEDGER            */}
          {/* ======================================================================= */}
          <section className="bg-[#0A0F1D] border border-slate-800 rounded-lg p-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  HYPERSONIC STINT & ACCELERATION VECTOR LEDGER
                </h2>
                <div className="text-xs font-mono text-slate-400">
                  RECORDED LAP SECTORS 1 TO 14 // OBLIQUE SHOCK STABILITY & GROUND EFFECT TELEMETRY
                </div>
              </div>

              {/* Quick Action Button Group */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Pre-Cool Mag Skids */}
                <button
                  onClick={handlePreCoolSkids}
                  disabled={cryoCycleActive}
                  className={`h-9 px-3 text-xs font-bold font-mono uppercase tracking-wider rounded border flex items-center gap-1.5 transition-all ${
                    cryoCycleActive
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 animate-pulse'
                      : 'bg-[#050914] hover:bg-slate-900 text-slate-200 border-slate-700/80 hover:border-cyan-500/60'
                  }`}
                  title="Pulse subcooled Liquid Nitrogen through all 4 superconducting skid coils"
                >
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{cryoCycleActive ? 'COOLING SKIDS...' : 'PRE-COOL MAG SKIDS'}</span>
                </button>

                {/* Inlet Ramp Calibration */}
                <button
                  onClick={handleInletCalibration}
                  className="h-9 px-3 text-xs font-bold font-mono uppercase tracking-wider rounded border bg-[#050914] hover:bg-slate-900 text-slate-200 border-slate-700/80 hover:border-purple-500/60 flex items-center gap-1.5 transition-all"
                  title="Execute 3-stage hydraulic variable geometry actuator sweep"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>INLET RAMP CALIBRATION</span>
                </button>

                {/* Emergency Air Spill */}
                <button
                  onClick={handleEmergencyAirSpill}
                  className={`h-9 px-3 text-xs font-bold font-mono uppercase tracking-wider rounded border flex items-center gap-1.5 transition-all ${
                    bypassActive
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500 animate-pulse'
                      : 'bg-[#050914] hover:bg-slate-900 text-slate-200 border-slate-700/80 hover:border-amber-500/60'
                  }`}
                  title="Toggle boundary layer dynamic pressure relief air doors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{bypassActive ? 'AIR SPILL OPEN' : 'EMERGENCY AIR SPILL'}</span>
                </button>

                {/* Export Telemetry CSV */}
                <button
                  onClick={handleExportCSV}
                  className="h-9 px-3 text-xs font-bold font-mono uppercase tracking-wider rounded border bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-700/80 hover:border-cyan-400 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Download institutional CSV record of all 14 sectors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPORT CSV</span>
                </button>

              </div>
            </div>

            {/* High-Contrast Telemetry Table with py-3.5 row styling */}
            <div className="overflow-x-auto mt-4 rounded border border-slate-800 scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#050914] border-b border-slate-800 text-slate-300 font-mono text-xs uppercase tracking-wider">
                    <th className="py-3 px-3">SECTOR</th>
                    <th className="py-3 px-3">NAME & DESCRIPTION</th>
                    <th className="py-3 px-3">MACH</th>
                    <th className="py-3 px-3">SPEED</th>
                    <th className="py-3 px-3">SCRAMJET THRUST</th>
                    <th className="py-3 px-3">DYNAMIC Q</th>
                    <th className="py-3 px-3">CAPTURE Ac/A0</th>
                    <th className="py-3 px-3">SKID FORCE</th>
                    <th className="py-3 px-3">GROUND GAP</th>
                    <th className="py-3 px-3">SHOCK STATUS</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-[#070C18]">
                  {INITIAL_SECTORS.map((sector) => {
                    const isHighStress = sector.status === 'HIGH_STRESS';
                    const isOptimal = sector.status === 'OPTIMAL';
                    const isLocked = sector.status === 'LOCKED';

                    return (
                      <tr
                        key={sector.id}
                        className="hover:bg-slate-900/60 transition-colors font-mono text-xs md:text-sm"
                      >
                        <td className="py-3.5 px-3 font-bold text-slate-300 whitespace-nowrap">
                          #{sector.id.toString().padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-200 whitespace-nowrap">
                          {sector.sectorName}
                        </td>
                        <td className="py-3.5 px-3 font-bold tabular-nums text-cyan-400 whitespace-nowrap">
                          M {sector.mach.toFixed(3)}
                        </td>
                        <td className="py-3.5 px-3 font-medium tabular-nums text-slate-200 whitespace-nowrap">
                          {sector.speedKmh.toFixed(1)} km/h
                        </td>
                        <td className="py-3.5 px-3 font-bold tabular-nums text-purple-400 whitespace-nowrap">
                          {sector.thrustKn.toFixed(1)} kN
                        </td>
                        <td className="py-3.5 px-3 font-medium tabular-nums text-slate-300 whitespace-nowrap">
                          {sector.dynamicPressureKpa.toFixed(1)} kPa
                        </td>
                        <td className="py-3.5 px-3 font-medium tabular-nums text-slate-300 whitespace-nowrap">
                          {sector.captureRatio.toFixed(3)}
                        </td>
                        <td className="py-3.5 px-3 font-medium tabular-nums text-slate-300 whitespace-nowrap">
                          {sector.repulsionForceKn.toFixed(1)} kN
                        </td>
                        <td className="py-3.5 px-3 font-bold tabular-nums text-cyan-300 whitespace-nowrap">
                          {sector.skidGapMm.toFixed(2)} mm
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                              isHighStress
                                ? 'bg-amber-950/70 text-amber-300 border-amber-600/80'
                                : isOptimal
                                ? 'bg-purple-950/70 text-purple-300 border-purple-600/80'
                                : isLocked
                                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-600/80'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {sector.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedSector(sector)}
                            className="px-2 py-1 text-xs font-mono font-bold uppercase text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                          >
                            INSPECT
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* SYSTEM DIAGNOSTIC LOGS SECTION (Always visible or in Tab)              */}
          {/* ======================================================================= */}
          <section className="bg-[#0A0F1D] border border-slate-800 rounded-lg p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                SYSTEM DIAGNOSTIC TELEMETRY & AUTO-GOVERNOR LOG
              </h2>
              <span className="text-xs font-mono text-slate-400">
                ACTIVE DAEMON: AUTO_FLIGHT_DIRECTOR_CHRONO
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {logs.slice(0, 5).map(log => (
                <div
                  key={log.id}
                  className="bg-[#050914] border border-slate-800/80 rounded p-2.5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">{log.time}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-200">{log.details}</span>
                  </div>
                  <span className="text-slate-500 shrink-0">{log.id}</span>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ========================================================================= */}
        {/* INTERLOCK MODAL: COMPRESSION BYPASS / INLET ABORT                         */}
        {/* ========================================================================= */}
        {bypassModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0F1D] border border-amber-600/80 rounded-lg max-w-md w-full p-6 shadow-2xl font-mono">
              <div className="flex items-center gap-3 text-amber-400 mb-4">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-100">
                  SAFETY INTERLOCK OVERRIDE
                </h3>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed mb-4">
                Deploying the <strong>SCRAMJET COMPRESSION BYPASS</strong> will immediately actuate internal relief doors, venting 42% dynamic inlet volume and disrupting the supersonic isolator shock train. This prevents catastrophic unstart structural shockwaves.
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded text-xs space-y-1 mb-5">
                <div className="flex justify-between text-slate-400">
                  <span>CURRENT AIRFLOW:</span>
                  <span className="text-cyan-400">MACH {machNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>BACKPRESSURE MARGIN:</span>
                  <span className="text-amber-400">24.5% OVER AMBIENT</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>BYPASS STATE:</span>
                  <span className={bypassActive ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    {bypassActive ? 'DEPLOYED / VENTING' : 'LOCKED CLOSED'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setBypassModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    handleEmergencyAirSpill();
                    setBypassModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-slate-950 rounded transition-colors shadow-lg"
                >
                  CONFIRM TOGGLE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CALIBRATION MODAL: INLET RAMP SWEEP TEST                                  */}
        {/* ========================================================================= */}
        {calibrationModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0F1D] border border-cyan-500/80 rounded-lg max-w-md w-full p-6 shadow-2xl font-mono">
              <div className="flex items-center gap-3 text-cyan-400 mb-4">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-100">
                  INLET RAMP CALIBRATION SWEEP
                </h3>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed mb-4">
                Conducting full-stroke hydraulic actuator self-test across variable geometry ramps 1, 2, and 3. Isolator acoustic resonance and optical shock detectors synchronizing...
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-200"
                  style={{ width: `${calibrationProgress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>SWEEP: 4.0° TO 22.0°</span>
                <span className="text-cyan-400">{calibrationProgress}% COMPLETE</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTOR INSPECTOR MODAL                                                    */}
        {/* ========================================================================= */}
        {selectedSector && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0F1D] border border-cyan-500/70 rounded-lg max-w-lg w-full p-6 shadow-2xl font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-bold uppercase text-slate-100">
                    SECTOR #{selectedSector.id.toString().padStart(2, '0')} TELEMETRY PROFILE
                  </h3>
                  <div className="text-xs text-cyan-400 font-bold">{selectedSector.sectorName}</div>
                </div>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="text-slate-400 hover:text-slate-100 text-sm font-bold px-2 py-1 bg-slate-900 rounded border border-slate-800"
                >
                  CLOSE
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-[#050914] p-3 rounded border border-slate-800">
                  <div className="text-slate-400">MACH NUMBER</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">M {selectedSector.mach.toFixed(3)}</div>
                  <div className="text-slate-500 text-[11px]">{selectedSector.speedKmh.toFixed(1)} km/h</div>
                </div>
                <div className="bg-[#050914] p-3 rounded border border-slate-800">
                  <div className="text-slate-400">SCRAMJET THRUST</div>
                  <div className="text-xl font-bold text-purple-400 mt-1">{selectedSector.thrustKn.toFixed(1)} kN</div>
                  <div className="text-slate-500 text-[11px]">Silane supersonic burn</div>
                </div>
                <div className="bg-[#050914] p-3 rounded border border-slate-800">
                  <div className="text-slate-400">DYNAMIC PRESSURE Q</div>
                  <div className="text-xl font-bold text-slate-200 mt-1">{selectedSector.dynamicPressureKpa.toFixed(1)} kPa</div>
                  <div className="text-slate-500 text-[11px]">Chassis skin load</div>
                </div>
                <div className="bg-[#050914] p-3 rounded border border-slate-800">
                  <div className="text-slate-400">MAG-SKID GROUND GAP</div>
                  <div className="text-xl font-bold text-cyan-300 mt-1">{selectedSector.skidGapMm.toFixed(2)} mm</div>
                  <div className="text-slate-500 text-[11px]">Repulsion: {selectedSector.repulsionForceKn.toFixed(1)} kN</div>
                </div>
              </div>

              <div className="bg-[#050914] p-3 rounded border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>INLET CAPTURE RATIO:</span>
                  <span className="text-slate-200 font-bold">{selectedSector.captureRatio.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SECTOR ELAPSED DURATION:</span>
                  <span className="text-slate-200 font-bold">{selectedSector.elapsedMs} ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>AERODYNAMIC SHOCK STATUS:</span>
                  <span className="text-cyan-400 font-bold">{selectedSector.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-[#02040A] py-3 px-4 text-xs font-mono text-slate-500 text-center">
          CHRONO TACHYON-FX FLIGHT DECK BLUEPRINT // SCRAMJET CHASSIS PROTO-16 // AURA & GRID INSTITUTIONAL AERODYNAMICS
        </footer>

      </div>
    </>
  );
};

export default ChronoTachyonDeck;
