import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Fan,
  Gauge,
  Activity,
  Zap,
  ShieldAlert,
  Wind,
  Layers,
  Compass,
  ArrowUpRight,
  Sliders,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  FastForward,
  Cpu,
  Flame,
  Maximize2,
  RefreshCw,
  HelpCircle,
  X,
  Radio,
  BarChart3,
  Thermometer,
  Car
} from 'lucide-react';

// --- Telemetry Types ---
export type VacuumMode = 'HIGH_DOWNFORCE' | 'V_MAX_STREAMLINE' | 'BRAKING_AIR_SUCTION' | 'AUTO_ADAPTIVE';

export interface CornerRecord {
  id: number;
  cornerName: string;
  trackSector: string;
  apexSpeedKmh: number;
  entryLateralG: number;
  peakLateralG: number;
  exitLateralG: number;
  underfloorVacuumKpa: number;
  skirtGapMm: number;
  sealIntegrityPct: number;
  turbineKw: number;
  statusTag: 'EXTREME_G' | 'ULTRA_VAC' | 'OPTIMAL' | 'CURB_DEFLECT';
}

export interface AeroLogEvent {
  id: string;
  time: string;
  type: 'OVERBOOST' | 'SKIRT' | 'VACUUM' | 'MODE' | 'WARNING' | 'CALIBRATION';
  severity: 'INFO' | 'ACTION' | 'WARN' | 'CRITICAL';
  message: string;
}

// Initial 16 Apex Data Points
const INITIAL_CORNERS: CornerRecord[] = [
  { id: 1,  cornerName: 'Tamburello Inflow',        trackSector: 'S1', apexSpeedKmh: 248.4, entryLateralG: 2.78, peakLateralG: 3.12, exitLateralG: 2.65, underfloorVacuumKpa: -46.8, skirtGapMm: 3.8, sealIntegrityPct: 98.9, turbineKw: 68.2, statusTag: 'OPTIMAL' },
  { id: 2,  cornerName: 'Villeneuve Sweeper',       trackSector: 'S1', apexSpeedKmh: 262.1, entryLateralG: 2.95, peakLateralG: 3.35, exitLateralG: 2.82, underfloorVacuumKpa: -48.5, skirtGapMm: 3.6, sealIntegrityPct: 99.1, turbineKw: 72.4, statusTag: 'OPTIMAL' },
  { id: 3,  cornerName: 'Tosa Hairpin Compression', trackSector: 'S1', apexSpeedKmh: 114.6, entryLateralG: 2.15, peakLateralG: 2.88, exitLateralG: 2.40, underfloorVacuumKpa: -50.2, skirtGapMm: 3.2, sealIntegrityPct: 99.8, turbineKw: 76.5, statusTag: 'ULTRA_VAC' },
  { id: 4,  cornerName: 'Piratella Crest Apex',     trackSector: 'S2', apexSpeedKmh: 218.0, entryLateralG: 3.08, peakLateralG: 3.42, exitLateralG: 2.94, underfloorVacuumKpa: -49.1, skirtGapMm: 3.5, sealIntegrityPct: 98.4, turbineKw: 74.0, statusTag: 'EXTREME_G' },
  { id: 5,  cornerName: 'Acque Minerali Turn-In',   trackSector: 'S2', apexSpeedKmh: 188.5, entryLateralG: 3.15, peakLateralG: 3.55, exitLateralG: 3.10, underfloorVacuumKpa: -51.4, skirtGapMm: 3.4, sealIntegrityPct: 99.3, turbineKw: 79.1, statusTag: 'EXTREME_G' },
  { id: 6,  cornerName: 'Acque Minerali Launch',    trackSector: 'S2', apexSpeedKmh: 205.2, entryLateralG: 2.80, peakLateralG: 3.22, exitLateralG: 2.70, underfloorVacuumKpa: -47.6, skirtGapMm: 3.7, sealIntegrityPct: 98.8, turbineKw: 71.0, statusTag: 'OPTIMAL' },
  { id: 7,  cornerName: 'Variante Alta Curbs',      trackSector: 'S2', apexSpeedKmh: 142.0, entryLateralG: 2.45, peakLateralG: 2.95, exitLateralG: 2.30, underfloorVacuumKpa: -45.0, skirtGapMm: 4.2, sealIntegrityPct: 96.5, turbineKw: 66.8, statusTag: 'CURB_DEFLECT' },
  { id: 8,  cornerName: 'Rivazza 1 High-G Dip',     trackSector: 'S3', apexSpeedKmh: 228.7, entryLateralG: 3.22, peakLateralG: 3.68, exitLateralG: 3.15, underfloorVacuumKpa: -52.1, skirtGapMm: 3.3, sealIntegrityPct: 99.6, turbineKw: 81.5, statusTag: 'EXTREME_G' },
  { id: 9,  cornerName: 'Rivazza 2 Apex Hold',      trackSector: 'S3', apexSpeedKmh: 176.3, entryLateralG: 2.90, peakLateralG: 3.30, exitLateralG: 2.85, underfloorVacuumKpa: -49.8, skirtGapMm: 3.5, sealIntegrityPct: 99.0, turbineKw: 75.3, statusTag: 'OPTIMAL' },
  { id: 10, cornerName: 'Parabolica Super-Radial',  trackSector: 'S3', apexSpeedKmh: 274.0, entryLateralG: 3.10, peakLateralG: 3.60, exitLateralG: 3.25, underfloorVacuumKpa: -50.8, skirtGapMm: 3.5, sealIntegrityPct: 98.7, turbineKw: 78.4, statusTag: 'EXTREME_G' },
  { id: 11, cornerName: 'Curva Grande Transition',  trackSector: 'S1', apexSpeedKmh: 312.5, entryLateralG: 2.65, peakLateralG: 3.15, exitLateralG: 2.70, underfloorVacuumKpa: -46.2, skirtGapMm: 4.0, sealIntegrityPct: 98.1, turbineKw: 69.5, statusTag: 'OPTIMAL' },
  { id: 12, cornerName: 'Lesmo 1 Compression Apex', trackSector: 'S2', apexSpeedKmh: 204.8, entryLateralG: 2.92, peakLateralG: 3.38, exitLateralG: 2.88, underfloorVacuumKpa: -48.7, skirtGapMm: 3.6, sealIntegrityPct: 99.0, turbineKw: 73.2, statusTag: 'OPTIMAL' },
  { id: 13, cornerName: 'Lesmo 2 Edge Traction',    trackSector: 'S2', apexSpeedKmh: 198.2, entryLateralG: 3.01, peakLateralG: 3.44, exitLateralG: 2.92, underfloorVacuumKpa: -49.4, skirtGapMm: 3.5, sealIntegrityPct: 99.2, turbineKw: 74.8, statusTag: 'EXTREME_G' },
  { id: 14, cornerName: 'Ascari Chicane Inflow',    trackSector: 'S3', apexSpeedKmh: 236.9, entryLateralG: 3.28, peakLateralG: 3.74, exitLateralG: 3.18, underfloorVacuumKpa: -52.4, skirtGapMm: 3.2, sealIntegrityPct: 99.5, turbineKw: 83.2, statusTag: 'EXTREME_G' },
  { id: 15, cornerName: 'Ascari Transition Flick',  trackSector: 'S3', apexSpeedKmh: 215.4, entryLateralG: 3.05, peakLateralG: 3.51, exitLateralG: 2.95, underfloorVacuumKpa: -50.6, skirtGapMm: 3.4, sealIntegrityPct: 98.9, turbineKw: 77.0, statusTag: 'EXTREME_G' },
  { id: 16, cornerName: 'Rettifilo Braking Anchor',  trackSector: 'S1', apexSpeedKmh: 122.0, entryLateralG: 2.20, peakLateralG: 2.75, exitLateralG: 2.10, underfloorVacuumKpa: -53.1, skirtGapMm: 3.1, sealIntegrityPct: 99.9, turbineKw: 84.5, statusTag: 'ULTRA_VAC' }
];

export default function App() {
  // Navigation & View Tab
  const [activeTab, setActiveTab] = useState<'COCKPIT' | 'VENTURI' | 'SUSPENSION' | 'LEDGER' | 'LOGS'>('COCKPIT');

  // Chassis Selection
  const [chassis, setChassis] = useState<'PROTO-10' | 'PROTO-09'>('PROTO-10');

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 5>(1);

  // Core Aero & Vacuum Controls
  const [vacuumMode, setVacuumMode] = useState<VacuumMode>('HIGH_DOWNFORCE');
  const [isOverboostArmed, setIsOverboostArmed] = useState<boolean>(false);
  const [isOverboostActive, setIsOverboostActive] = useState<boolean>(false);
  const [isVacuumDumped, setIsVacuumDumped] = useState<boolean>(false);

  // Dynamic Telemetry States (Simulated continuous dynamics)
  const [groundSpeed, setGroundSpeed] = useState<number>(318.6);
  const [turbineRpm, setTurbineRpm] = useState<number>(21400);
  const [vacuumKpa, setVacuumKpa] = useState<number>(-48.2);
  const [downforceKg, setDownforceKg] = useState<number>(2250);
  const [lateralG, setLateralG] = useState<number>(3.42);
  const [airCfm, setAirCfm] = useState<number>(18500);

  // Skirt clearances (mm)
  const [skirtFL, setSkirtFL] = useState<number>(4.0);
  const [skirtFR, setSkirtFR] = useState<number>(3.9);
  const [skirtRL, setSkirtRL] = useState<number>(3.8);
  const [skirtRR, setSkirtRR] = useState<number>(3.8);
  const [skirtWearL, setSkirtWearL] = useState<number>(98.4);
  const [skirtWearR, setSkirtWearR] = useState<number>(97.9);

  // Damper Heights (mm)
  const [damperFL, setDamperFL] = useState<number>(28.2);
  const [damperFR, setDamperFR] = useState<number>(28.5);
  const [damperRL, setDamperRL] = useState<number>(32.1);
  const [damperRR, setDamperRR] = useState<number>(31.8);

  // Powertrain & High Voltage
  const [batterySoc, setBatterySoc] = useState<number>(84.6);
  const [dcVoltage, setDcVoltage] = useState<number>(814.2);
  const [dcCurrentA, setDcCurrentA] = useState<number>(640);
  const [inverterTemp1, setInverterTemp1] = useState<number>(58.4);
  const [inverterTemp2, setInverterTemp2] = useState<number>(60.1);

  // Modals & Action States
  const [showCalibrateModal, setShowCalibrateModal] = useState<boolean>(false);
  const [calibratingProgress, setCalibratingProgress] = useState<number>(0);
  const [showReverseModal, setShowReverseModal] = useState<boolean>(false);
  const [showOverboostModal, setShowOverboostModal] = useState<boolean>(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Logs state
  const [eventLogs, setEventLogs] = useState<AeroLogEvent[]>([
    { id: 'ev-1', time: '10:34:02', type: 'VACUUM', severity: 'INFO', message: 'Ground-effect master vacuum plenum locked at -48.2 kPa' },
    { id: 'ev-2', time: '10:33:48', type: 'SKIRT', severity: 'ACTION', message: 'Active skirts settled to 3.8mm high-speed track stance' },
    { id: 'ev-3', time: '10:33:12', type: 'OVERBOOST', severity: 'WARN', message: 'Turbine Overboost pre-charge cycle ready (max 24,500 RPM)' },
    { id: 'ev-4', time: '10:32:45', type: 'MODE', severity: 'INFO', message: 'Profile initialized: HIGH DOWNFORCE (Corner Carver)' },
  ]);

  // Corner ledger records
  const [corners, setCorners] = useState<CornerRecord[]>(INITIAL_CORNERS);
  const [cornerSearch, setCornerSearch] = useState<string>('');
  const [selectedCorner, setSelectedCorner] = useState<CornerRecord | null>(INITIAL_CORNERS[3]); // default Piratella

  // Add event log helper
  const addLog = (type: AeroLogEvent['type'], severity: AeroLogEvent['severity'], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AeroLogEvent = {
      id: `ev-${Date.now()}`,
      time: timeStr,
      type,
      severity,
      message,
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Switch Vacuum Mode Handler
  const handleSelectMode = (mode: VacuumMode) => {
    setVacuumMode(mode);
    let targetRpm = 21400;
    let targetKpa = -48.2;
    let targetDownforce = 2250;
    let targetGap = 3.8;

    if (mode === 'HIGH_DOWNFORCE') {
      targetRpm = 21500;
      targetKpa = -48.5;
      targetDownforce = 2300;
      targetGap = 3.6;
      addLog('MODE', 'ACTION', 'Engaged HIGH DOWNFORCE: Venturi tunnels optimized for max apex lateral load');
    } else if (mode === 'V_MAX_STREAMLINE') {
      targetRpm = 13800;
      targetKpa = -31.2;
      targetDownforce = 1580;
      targetGap = 7.2;
      addLog('MODE', 'INFO', 'Engaged V-MAX STREAMLINE: Diffuser stalled, drag coefficient reduced by 41%');
    } else if (mode === 'BRAKING_AIR_SUCTION') {
      targetRpm = 23800;
      targetKpa = -52.4;
      targetDownforce = 2620;
      targetGap = 3.2;
      addLog('MODE', 'WARN', 'Engaged BRAKING AIR-SUCTION: Instant aero anchor engaged for maximum deceleration stability');
    } else {
      targetRpm = 21000;
      targetKpa = -47.0;
      targetDownforce = 2180;
      targetGap = 4.0;
      addLog('MODE', 'INFO', 'Engaged AUTO ADAPTIVE: Dynamic slip-angle & ride-height matrix active');
    }

    setTurbineRpm(targetRpm);
    setVacuumKpa(targetKpa);
    setDownforceKg(targetDownforce);
    setSkirtFL(targetGap);
    setSkirtFR(targetGap + 0.1);
    setSkirtRL(targetGap - 0.1);
    setSkirtRR(targetGap);
  };

  // Overboost Toggle
  const toggleOverboost = () => {
    if (!isOverboostArmed) {
      setShowOverboostModal(true);
      return;
    }

    if (isOverboostActive) {
      setIsOverboostActive(false);
      setTurbineRpm(21400);
      setVacuumKpa(-48.2);
      setDownforceKg(2250);
      setAirCfm(18500);
      addLog('OVERBOOST', 'INFO', 'Turbine Overboost disengaged: Dual fans returned to nominal profile');
    } else {
      setIsOverboostActive(true);
      setTurbineRpm(24350);
      setVacuumKpa(-53.8);
      setDownforceKg(2780);
      setAirCfm(21800);
      addLog('OVERBOOST', 'ACTION', 'TURBINE OVERBOOST ACTIVE: Dual fans spooled to 24,350 RPM. Downforce +530 kg');
    }
  };

  // Vacuum Dump Handler
  const handleDumpVacuum = () => {
    if (isVacuumDumped) {
      setIsVacuumDumped(false);
      setVacuumKpa(-48.2);
      setDownforceKg(2250);
      addLog('VACUUM', 'ACTION', 'Plenum seal repressurized: Underfloor suction restored to nominal');
      setBannerAlert('Underfloor vacuum seal repressurized and locked.');
    } else {
      setIsVacuumDumped(true);
      setVacuumKpa(-2.1);
      setDownforceKg(420);
      addLog('VACUUM', 'CRITICAL', 'SEAL PURGE / DUMP EXECUTED: Vent valves open. Suction bled to atmospheric');
      setBannerAlert('WARNING: Vacuum seal dumped! Vehicle relying solely on passive aero wings.');
    }
    setTimeout(() => setBannerAlert(null), 4000);
  };

  // Run Skirt Calibration routine
  const runCalibrationRoutine = () => {
    setShowCalibrateModal(true);
    setCalibratingProgress(10);
    const interval = setInterval(() => {
      setCalibratingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowCalibrateModal(false);
            setSkirtFL(3.8);
            setSkirtFR(3.8);
            setSkirtRL(3.7);
            setSkirtRR(3.7);
            addLog('CALIBRATION', 'ACTION', 'All 4 corner pneumatic skirt actuators zero-calibrated to 3.8mm datum');
            setBannerAlert('Zero-datum skirt calibration successful: 3.8mm datum locked.');
            setTimeout(() => setBannerAlert(null), 3500);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  // Emergency Reverse Confirmation
  const confirmEmergencyReverse = () => {
    setShowReverseModal(false);
    setTurbineRpm(0);
    setVacuumKpa(4.2);
    setDownforceKg(120);
    addLog('VACUUM', 'CRITICAL', 'EMERGENCY FAN REVERSE FIRED: Debris ejection blast completed');
    setBannerAlert('EMERGENCY FAN REVERSE COMPLETED: Positive air pulse evacuated underfloor ducting.');
    setTimeout(() => {
      setTurbineRpm(21400);
      setVacuumKpa(-48.2);
      setDownforceKg(2250);
      setBannerAlert(null);
    }, 4500);
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = [
      'Corner ID',
      'Corner Name',
      'Sector',
      'Apex Speed (km/h)',
      'Entry Lateral G',
      'Peak Lateral G',
      'Exit Lateral G',
      'Underfloor Vacuum (kPa)',
      'Skirt Gap (mm)',
      'Seal Integrity (%)',
      'Turbine Demand (kW)',
      'Status'
    ];
    const rows = corners.map(c => [
      c.id,
      `"${c.cornerName}"`,
      c.trackSector,
      c.apexSpeedKmh,
      c.entryLateralG,
      c.peakLateralG,
      c.exitLateralG,
      c.underfloorVacuumKpa,
      c.skirtGapMm,
      c.sealIntegrityPct,
      c.turbineKw,
      c.statusTag
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aeon_suction_gt_stint_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog('VACUUM', 'INFO', 'Stint telemetry exported to CSV (16 Corner Apex Records)');
    setBannerAlert('Stint Telemetry CSV successfully generated and downloaded.');
    setTimeout(() => setBannerAlert(null), 3000);
  };

  // Real-time continuous simulation tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const tickInterval = simSpeed === 5 ? 200 : 700;

    const timer = setInterval(() => {
      // Natural telemetry fluctuation
      const speedJitter = (Math.random() - 0.48) * 1.8;
      const rpmJitter = Math.floor((Math.random() - 0.5) * 60);
      const kpaJitter = (Math.random() - 0.5) * 0.4;
      const gJitter = (Math.random() - 0.5) * 0.08;

      setGroundSpeed(prev => {
        const next = prev + speedJitter;
        return Number(Math.max(280, Math.min(345, next)).toFixed(1));
      });

      if (!isVacuumDumped) {
        setTurbineRpm(prev => {
          const base = isOverboostActive ? 24350 : (vacuumMode === 'HIGH_DOWNFORCE' ? 21400 : 18000);
          return base + rpmJitter;
        });

        setVacuumKpa(prev => {
          const base = isOverboostActive ? -53.8 : (vacuumMode === 'HIGH_DOWNFORCE' ? -48.2 : -36.0);
          return Number((base + kpaJitter).toFixed(1));
        });

        setDownforceKg(prev => {
          const base = isOverboostActive ? 2780 : (vacuumMode === 'HIGH_DOWNFORCE' ? 2250 : 1650);
          return Math.round(base + (Math.random() - 0.5) * 25);
        });

        setAirCfm(prev => {
          const base = isOverboostActive ? 21800 : (vacuumMode === 'HIGH_DOWNFORCE' ? 18500 : 14200);
          return Math.round(base + (Math.random() - 0.5) * 120);
        });
      }

      setLateralG(prev => {
        const base = 3.35;
        const next = base + gJitter;
        return Number(Math.max(2.4, Math.min(3.85, next)).toFixed(2));
      });

      // Micro skirt deflection
      setSkirtFL(prev => Number((3.8 + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setSkirtFR(prev => Number((3.8 + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setSkirtRL(prev => Number((3.7 + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setSkirtRR(prev => Number((3.7 + (Math.random() - 0.5) * 0.2).toFixed(1)));

      // Slight thermal creep
      setInverterTemp1(prev => Number((58.4 + (Math.random() - 0.45) * 0.2).toFixed(1)));
      setInverterTemp2(prev => Number((60.1 + (Math.random() - 0.45) * 0.2).toFixed(1)));
      setDcCurrentA(prev => Math.round(630 + Math.random() * 40));

    }, tickInterval);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, isOverboostActive, vacuumMode, isVacuumDumped]);

  // Filtered corners for search
  const filteredCorners = useMemo(() => {
    if (!cornerSearch.trim()) return corners;
    return corners.filter(c =>
      c.cornerName.toLowerCase().includes(cornerSearch.toLowerCase()) ||
      c.trackSector.toLowerCase().includes(cornerSearch.toLowerCase()) ||
      c.statusTag.toLowerCase().includes(cornerSearch.toLowerCase())
    );
  }, [corners, cornerSearch]);

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none antialiased">
        {/* Banner Alert for quick feedback */}
        {bannerAlert && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/40 text-cyan-200 px-4 py-2 text-xs md:text-sm font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold tracking-wider">[TELEMETRY ALERT]:</span>
              <span>{bannerAlert}</span>
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-cyan-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. TOP HEADER & TELEMETRY CONTROLS STRIP */}
        <header className="bg-[#0B0F17] border-b border-slate-800 px-3 md:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sticky top-0 z-40 shadow-xl">
          {/* Locked Chassis Beacon & Title */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOverboostActive ? 'bg-amber-400' : 'bg-cyan-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOverboostActive ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
              </span>
              <div className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                {chassis}
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 truncate flex items-center gap-2">
                <span>AEON SUCTION-GT</span>
                <span className="text-xs md:text-sm font-bold font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 hidden sm:inline-block">
                  ACTIVE GROUND-EFFECT CONSOLE
                </span>
              </h1>
              <p className="text-xs font-mono text-slate-400 tracking-wide truncate">
                TWIN 22k-RPM VENTURI FANS // PNEUMATIC RIDE-SEAL CHASSIS PROTO-10
              </p>
            </div>
          </div>

          {/* Controls: Run/Pause, 1x/5x, Chassis Switch, and Keyed Turbine Overboost */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap lg:flex-nowrap justify-between lg:justify-end">
            {/* Chassis Selector */}
            <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-md p-0.5 h-9">
              <button
                onClick={() => {
                  setChassis('PROTO-10');
                  addLog('MODE', 'INFO', 'Switched telemetry feed to PROTO-10 Flagship Flight-Spec');
                }}
                className={`px-2.5 h-full text-xs font-mono font-bold rounded tracking-wider transition-colors ${chassis === 'PROTO-10' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                PROTO-10
              </button>
              <button
                onClick={() => {
                  setChassis('PROTO-09');
                  addLog('MODE', 'INFO', 'Switched telemetry feed to PROTO-09 Aero Rig Testbed');
                }}
                className={`px-2.5 h-full text-xs font-mono font-bold rounded tracking-wider transition-colors ${chassis === 'PROTO-09' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                PROTO-09 RIG
              </button>
            </div>

            {/* Sim Loop Controls in an h-9 row */}
            <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-md p-0.5 h-9">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1.5 px-3 h-full rounded text-xs font-mono font-bold transition-colors ${
                  isSimulating ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-300'
                }`}
                title={isSimulating ? 'Pause Telemetry Stream' : 'Resume Telemetry Stream'}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span className="hidden sm:inline">{isSimulating ? 'LIVE STREAM' : 'PAUSED'}</span>
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              <button
                onClick={() => setSimSpeed(simSpeed === 1 ? 5 : 1)}
                className="flex items-center gap-1 px-2 h-full text-xs font-mono font-bold text-slate-300 hover:text-cyan-400 transition-colors"
                title="Toggle Telemetry Tick Speed"
              >
                <FastForward className="w-3 h-3 text-cyan-400" />
                <span>{simSpeed}x</span>
              </button>
            </div>

            {/* Keyed Turbine Overboost Safety Switch */}
            <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-md px-1.5 h-9 gap-2">
              <button
                onClick={() => {
                  const nextState = !isOverboostArmed;
                  setIsOverboostArmed(nextState);
                  if (!nextState && isOverboostActive) {
                    setIsOverboostActive(false);
                    setTurbineRpm(21400);
                  }
                  addLog('OVERBOOST', nextState ? 'WARN' : 'INFO', nextState ? 'TURBINE OVERBOOST ARMED by pilot interlock' : 'Turbine Overboost disarmed');
                }}
                className={`text-[10px] md:text-xs font-mono font-bold px-2 py-1 rounded transition-colors ${
                  isOverboostArmed ? 'bg-amber-950/90 text-amber-300 border border-amber-600 animate-pulse' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isOverboostArmed ? 'ARMED' : 'ARM'}
              </button>

              <button
                onClick={toggleOverboost}
                disabled={!isOverboostArmed}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-black tracking-wider uppercase transition-all ${
                  !isOverboostArmed
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    : isOverboostActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-500/50'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isOverboostActive ? 'text-black fill-current animate-bounce' : 'text-amber-400'}`} />
                <span>{isOverboostActive ? 'BOOST ON' : 'OVERBOOST'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. TOP HUD TELEMETRY STRIP (5 Core Flight-Deck Numbers) */}
        <section className="bg-[#080D1A] border-b border-slate-800 px-3 md:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Speed */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  GROUND SPEED
                </span>
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400">
                  {groundSpeed.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">km/h</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>V-Max Ref: 385 km/h</span>
                <span className="text-emerald-400">RADAR LOCK</span>
              </div>
            </div>

            {/* Suction Downforce */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  TOTAL DOWNFORCE
                </span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400 rotate-90" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400">
                  {downforceKg.toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">kg</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Fan Suction: 84%</span>
                <span className="text-cyan-400">AT ANY SPEED</span>
              </div>
            </div>

            {/* Dual Fan RPM */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  DUAL FAN SPEED
                </span>
                <Fan className={`w-4 h-4 text-cyan-400 ${isSimulating ? 'animate-spin' : ''}`} />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-3xl md:text-4xl font-black font-mono tabular-nums ${isOverboostActive ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {turbineRpm.toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">RPM</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Sync Delta: &lt;12 RPM</span>
                <span className={isOverboostActive ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {isOverboostActive ? 'BOOST LIMIT' : 'NOMINAL'}
                </span>
              </div>
            </div>

            {/* Underfloor Pressure Delta */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  UNDERFLOOR VACUUM
                </span>
                <Wind className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-3xl md:text-4xl font-black font-mono tabular-nums ${isVacuumDumped ? 'text-red-400' : 'text-cyan-400'}`}>
                  {vacuumKpa.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">kPa</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Atmospheric: 101.3</span>
                <span className={isVacuumDumped ? 'text-red-400 font-bold' : 'text-cyan-400'}>
                  {isVacuumDumped ? 'SEAL DUMPED' : 'SEAL LOCKED'}
                </span>
              </div>
            </div>

            {/* Lateral Peak G */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  LATERAL LOAD
                </span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-cyan-400">
                  {lateralG.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">G</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Peak Apex: 3.74 G</span>
                <span className="text-amber-400 font-bold">AERO GLUE</span>
              </div>
            </div>

            {/* Skirt Seal Status & Dump Trigger */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  SEAL INTEGRITY
                </span>
                <ShieldAlert className={`w-4 h-4 ${isVacuumDumped ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-3xl md:text-4xl font-black font-mono tabular-nums ${isVacuumDumped ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isVacuumDumped ? '0.0%' : '99.4%'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Gap: {skirtFL.toFixed(1)}mm</span>
                <button
                  onClick={handleDumpVacuum}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                    isVacuumDumped ? 'bg-emerald-900 text-emerald-200' : 'bg-red-950 text-red-300 hover:bg-red-900 border border-red-800/80'
                  }`}
                >
                  {isVacuumDumped ? 'RESTORE' : 'SEAL PURGE'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. RESPONSIVE TAB BAR (Horizontal overflow wrapper with scrollbar-none) */}
        <nav className="bg-[#0B0F17] border-b border-slate-800 px-3 md:px-6">
          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2">
            {[
              { id: 'COCKPIT', label: 'VACUUM COCKPIT', icon: Gauge },
              { id: 'VENTURI', label: 'VENTURI TUNNELS', icon: Wind },
              { id: 'SUSPENSION', label: 'SUSPENSION & SKIRTS', icon: Layers },
              { id: 'LEDGER', label: 'CORNER APEX LEDGER', icon: BarChart3 },
              { id: 'LOGS', label: 'SYSTEM LOGS & EVENTS', icon: Activity },
            ].map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono text-xs md:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 4. MAIN INTERACTIVE CONTENT AREA */}
        <main className="flex-1 p-3 md:p-6 space-y-6">
          {/* VIEW: VACUUM COCKPIT (The 4-Pane Flagship Deck Layout) */}
          {(activeTab === 'COCKPIT' || activeTab === 'VENTURI') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CENTER-LEFT: 2D Interactive Underfloor Vacuum & Skirt Pressure Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col space-y-4 shadow-2xl">
                {/* Header & Modes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Wind className="w-5 h-5 text-cyan-400" />
                      <span>UNDERFLOOR VACUUM & VENTURI SCHEMATIC</span>
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Real-time negative pressure gradient and twin suction turbine chamber
                    </p>
                  </div>

                  {/* Mode Badges / Switchers */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'HIGH_DOWNFORCE', label: 'CORNER CARVER' },
                      { id: 'V_MAX_STREAMLINE', label: 'V-MAX LOW-DRAG' },
                      { id: 'BRAKING_AIR_SUCTION', label: 'BRAKE ANCHOR' },
                      { id: 'AUTO_ADAPTIVE', label: 'AUTO ADAPTIVE' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMode(m.id as VacuumMode)}
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded border transition-all ${
                          vacuumMode === m.id
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2D Heatmap SVG & Venturi Canvas */}
                <div className="relative bg-[#020617] border border-slate-800/80 rounded-lg p-4 overflow-hidden flex items-center justify-center min-h-[380px]">
                  {/* Subtle Grid overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Top-Down Aerodynamic Ground-Effect Chassis SVG */}
                  <svg
                    viewBox="0 0 540 380"
                    className="w-full h-auto max-h-[360px] drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  >
                    <defs>
                      {/* Gradient for Venturi Suction Tunnels */}
                      <linearGradient id="venturiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                        <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.9" />
                        <stop offset="80%" stopColor="#0284c7" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                      </linearGradient>

                      {/* Pressure Plenum Glow */}
                      <radialGradient id="plenumGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={isVacuumDumped ? '#ef4444' : '#06b6d4'} stopOpacity="0.75" />
                        <stop offset="70%" stopColor={isVacuumDumped ? '#7f1d1d' : '#0e7490'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Outer Chassis Silhouette Reference */}
                    <path
                      d="M 60,190 C 60,110 110,80 180,75 L 360,75 C 440,75 480,105 490,190 C 480,275 440,305 360,305 L 180,305 C 110,300 60,270 60,190 Z"
                      fill="#090E17"
                      stroke="#1E293B"
                      strokeWidth="2.5"
                    />

                    {/* Front Splitter Ingestion Zone */}
                    <path
                      d="M 50,150 L 95,140 L 95,240 L 50,230 Z"
                      fill="#0E7490"
                      fillOpacity="0.25"
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x="56" y="195" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      RAM SPLITTER
                    </text>

                    {/* LEFT VENTURI TUNNEL */}
                    <path
                      d="M 100,100 L 260,120 L 380,110 L 440,95 L 440,140 L 380,150 L 260,150 L 100,135 Z"
                      fill="url(#venturiGrad)"
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      className={isSimulating ? 'animate-pulse' : ''}
                    />

                    {/* RIGHT VENTURI TUNNEL */}
                    <path
                      d="M 100,280 L 260,260 L 380,270 L 440,285 L 440,240 L 380,230 L 260,230 L 100,245 Z"
                      fill="url(#venturiGrad)"
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      className={isSimulating ? 'animate-pulse' : ''}
                    />

                    {/* CENTRAL SEALED VACUUM PLENUM */}
                    <rect
                      x="160"
                      y="145"
                      width="200"
                      height="90"
                      rx="8"
                      fill="url(#plenumGlow)"
                      stroke={isVacuumDumped ? '#EF4444' : '#06B6D4'}
                      strokeWidth="2"
                    />

                    {/* Dynamic Air Flow Streamlines */}
                    <path
                      d="M 80,190 Q 200,190 350,190"
                      fill="none"
                      stroke="#E0F2FE"
                      strokeWidth="2"
                      strokeDasharray="6 8"
                      className={isSimulating ? 'animate-[dash_1s_linear_infinite]' : ''}
                    />
                    <path
                      d="M 110,125 Q 260,135 430,120"
                      fill="none"
                      stroke="#67E8F9"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                      className={isSimulating ? 'animate-[dash_1.2s_linear_infinite]' : ''}
                    />
                    <path
                      d="M 110,255 Q 260,245 430,260"
                      fill="none"
                      stroke="#67E8F9"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                      className={isSimulating ? 'animate-[dash_1.2s_linear_infinite]' : ''}
                    />

                    {/* ACTIVE FLEXIBLE PNEUMATIC SIDE SKIRTS (Left & Right Edge Bars) */}
                    {/* Left Skirt */}
                    <rect
                      x="130"
                      y="68"
                      width="250"
                      height="7"
                      rx="3.5"
                      fill={isVacuumDumped ? '#EF4444' : '#10B981'}
                      stroke="#020617"
                      strokeWidth="1"
                    />
                    <text x="140" y="62" fill="#E2E8F0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      LEFT SKIRT // GAP: {skirtFL.toFixed(1)}mm [SEAL: {isVacuumDumped ? 'LEAK' : '99.2%'}]
                    </text>

                    {/* Right Skirt */}
                    <rect
                      x="130"
                      y="305"
                      width="250"
                      height="7"
                      rx="3.5"
                      fill={isVacuumDumped ? '#EF4444' : '#10B981'}
                      stroke="#020617"
                      strokeWidth="1"
                    />
                    <text x="140" y="325" fill="#E2E8F0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      RIGHT SKIRT // GAP: {skirtFR.toFixed(1)}mm [SEAL: {isVacuumDumped ? 'LEAK' : '98.9%'}]
                    </text>

                    {/* DUAL VACUUM SUCTION TURBINES (Rear Diffuser Location) */}
                    {/* Turbine 1 (Upper/Left) */}
                    <g transform="translate(425, 145)">
                      <circle
                        cx="25"
                        cy="25"
                        r="26"
                        fill="#0B132B"
                        stroke={isOverboostActive ? '#F59E0B' : '#06B6D4'}
                        strokeWidth="2.5"
                      />
                      {/* Blades */}
                      <g className={isSimulating ? 'animate-spin origin-center' : ''} style={{ transformOrigin: '25px 25px' }}>
                        <line x1="25" y1="5" x2="25" y2="45" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="5" y1="25" x2="45" y2="25" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="11" y1="11" x2="39" y2="39" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="11" y1="39" x2="39" y2="11" stroke="#38BDF8" strokeWidth="2.5" />
                      </g>
                      <circle cx="25" cy="25" r="7" fill="#E0F2FE" />
                      <text x="-4" y="60" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        FAN 1 L
                      </text>
                    </g>

                    {/* Turbine 2 (Lower/Right) */}
                    <g transform="translate(425, 210)">
                      <circle
                        cx="25"
                        cy="25"
                        r="26"
                        fill="#0B132B"
                        stroke={isOverboostActive ? '#F59E0B' : '#06B6D4'}
                        strokeWidth="2.5"
                      />
                      {/* Blades */}
                      <g className={isSimulating ? 'animate-spin origin-center' : ''} style={{ transformOrigin: '25px 25px' }}>
                        <line x1="25" y1="5" x2="25" y2="45" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="5" y1="25" x2="45" y2="25" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="11" y1="11" x2="39" y2="39" stroke="#38BDF8" strokeWidth="2.5" />
                        <line x1="11" y1="39" x2="39" y2="11" stroke="#38BDF8" strokeWidth="2.5" />
                      </g>
                      <circle cx="25" cy="25" r="7" fill="#E0F2FE" />
                      <text x="-4" y="60" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        FAN 2 R
                      </text>
                    </g>

                    {/* Central Pressure Node Readout inside the SVG */}
                    <g transform="translate(180, 160)">
                      <rect x="0" y="0" width="160" height="58" rx="4" fill="#020617" fillOpacity="0.85" stroke="#1E293B" />
                      <text x="12" y="20" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        PLENUM VACUUM DELTA
                      </text>
                      <text x="12" y="44" fill={isVacuumDumped ? '#F87171' : '#22D3EE'} fontSize="20" fontFamily="monospace" fontWeight="900">
                        {vacuumKpa.toFixed(1)} <tspan fontSize="12">kPa</tspan>
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Dual Turbine Telemetry & Flow Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="bg-[#0F172A] border border-slate-800 rounded p-2.5">
                    <div className="text-xs font-mono font-bold text-slate-400">EVACUATION RATE</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                      {airCfm.toLocaleString()} <span className="text-xs text-slate-400 font-bold">CFM</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Dual Stator Sync</div>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded p-2.5">
                    <div className="text-xs font-mono font-bold text-slate-400">BLADE PITCH</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                      {isOverboostActive ? '34.0°' : '28.5°'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Active Aerofoil</div>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded p-2.5">
                    <div className="text-xs font-mono font-bold text-slate-400">EXIT VELOCITY</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                      128.4 <span className="text-xs text-slate-400 font-bold">m/s</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Diffuser Ejector</div>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded p-2.5">
                    <div className="text-xs font-mono font-bold text-slate-400">AERO BALANCE</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                      46.8% <span className="text-xs text-slate-400 font-bold">F</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">53.2% Rear Bias</div>
                  </div>
                </div>
              </div>

              {/* CENTER-RIGHT: Tri-Motor Powertrain & Active Suspension Actuation (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                {/* 1. Tri-Motor Powertrain Card */}
                <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <span>TRI-MOTOR POWERTRAIN MATRIX</span>
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                      1,680 HP
                    </span>
                  </div>

                  <div className="space-y-3 font-mono">
                    {/* Front Motors */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>FRONT AXLE (DUAL PERMANENT MAGNET)</span>
                        <span className="text-cyan-400">840 HP (420 x 2)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <div className="text-slate-400">Front Left Motor:</div>
                          <div className="text-slate-100 font-bold">420 HP // 480 Nm</div>
                          <div className="text-emerald-400">Inverter: 54.2°C</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Front Right Motor:</div>
                          <div className="text-slate-100 font-bold">420 HP // 480 Nm</div>
                          <div className="text-emerald-400">Inverter: 55.1°C</div>
                        </div>
                      </div>
                    </div>

                    {/* Rear Axial Motor */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>REAR AXLE (HIGH-TORQUE AXIAL FLUX)</span>
                        <span className="text-cyan-400">840 HP // 1,120 Nm</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Direct Carbon Rotor Drive</span>
                        <span className="text-emerald-400 font-bold">Inverter: 62.0°C</span>
                      </div>
                    </div>

                    {/* 88kWh Battery & Bus Current */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                        <span>88 kWh GRAPHENE-LITHIUM PACK</span>
                        <span className="text-cyan-400">{batterySoc.toFixed(1)}% SOC</span>
                      </div>
                      {/* Battery Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all"
                          style={{ width: `${batterySoc}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2.5 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">BUS VOLTAGE</span>
                          <span className="font-bold">{dcVoltage.toFixed(1)} V</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">CURRENT</span>
                          <span className="font-bold">{dcCurrentA} A</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">CELL DELTA</span>
                          <span className="font-bold text-emerald-400">4.8 mV</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 4-Corner Active Suspension & Damper Ride Heights */}
                <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <span>4-CORNER MAGNETORHEOLOGICAL DAMPERS</span>
                    </h2>
                    <span className="text-xs font-mono text-cyan-400 font-bold">1000 Hz VALVE</span>
                  </div>

                  {/* 4 Corner Graphic Box */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    {/* Front-Left */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>FRONT LEFT (FL)</span>
                        <span className="text-cyan-400">{damperFL.toFixed(1)} mm</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Skirt Proximity:</span>
                        <span className="text-emerald-400 font-bold">{skirtFL.toFixed(1)} mm</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${(damperFL / 50) * 100}%` }} />
                      </div>
                    </div>

                    {/* Front-Right */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>FRONT RIGHT (FR)</span>
                        <span className="text-cyan-400">{damperFR.toFixed(1)} mm</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Skirt Proximity:</span>
                        <span className="text-emerald-400 font-bold">{skirtFR.toFixed(1)} mm</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${(damperFR / 50) * 100}%` }} />
                      </div>
                    </div>

                    {/* Rear-Left */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>REAR LEFT (RL)</span>
                        <span className="text-cyan-400">{damperRL.toFixed(1)} mm</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Skirt Proximity:</span>
                        <span className="text-emerald-400 font-bold">{skirtRL.toFixed(1)} mm</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${(damperRL / 50) * 100}%` }} />
                      </div>
                    </div>

                    {/* Rear-Right */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span>REAR RIGHT (RR)</span>
                        <span className="text-cyan-400">{damperRR.toFixed(1)} mm</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Skirt Proximity:</span>
                        <span className="text-emerald-400 font-bold">{skirtRR.toFixed(1)} mm</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${(damperRR / 50) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Skirt Wear Telemetry */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 font-mono text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-300 mb-2">
                      <span>PNEUMATIC SKIRT PTFE WEAR INDEX</span>
                      <span className="text-emerald-400 font-bold">HEALTHY</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Left Skirt:</span>
                          <span className="text-slate-100 font-bold">{skirtWearL}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1">
                          <div className="bg-emerald-400 h-full" style={{ width: `${skirtWearL}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Right Skirt:</span>
                          <span className="text-slate-100 font-bold">{skirtWearR}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1">
                          <div className="bg-emerald-400 h-full" style={{ width: `${skirtWearR}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SUSPENSION & SKIRTS TAB (Detailed Stance View) */}
          {activeTab === 'SUSPENSION' && (
            <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg md:text-xl font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>ACTIVE SKIRT PROXIMITY & SUSPENSION GEOMETRY</span>
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    High-speed pneumatic skirt ground clearance and laser sensor calibration
                  </p>
                </div>
                <button
                  onClick={runCalibrationRoutine}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono text-xs font-bold uppercase transition-colors"
                >
                  CALIBRATE SKIRTS
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                {[
                  { name: 'FRONT LEFT CORNER', gap: skirtFL, damper: damperFL, wear: skirtWearL, temp: 48.2 },
                  { name: 'FRONT RIGHT CORNER', gap: skirtFR, damper: damperFR, wear: skirtWearR, temp: 49.0 },
                  { name: 'REAR LEFT CORNER', gap: skirtRL, damper: damperRL, wear: skirtWearL, temp: 52.4 },
                  { name: 'REAR RIGHT CORNER', gap: skirtRR, damper: damperRR, wear: skirtWearR, temp: 53.1 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-bold text-cyan-300 border-b border-slate-800 pb-1.5">
                      {item.name}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Pneumatic Skirt Gap:</span>
                        <span className="text-cyan-400 font-bold text-sm">{item.gap.toFixed(2)} mm</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Damper Height:</span>
                        <span className="text-slate-100 font-bold">{item.damper.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Composite Skirt Wear:</span>
                        <span className="text-emerald-400 font-bold">{item.wear}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Rake/Friction Temp:</span>
                        <span className="text-slate-200 font-bold">{item.temp}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SYSTEM LOGS & EVENTS TAB */}
          {activeTab === 'LOGS' && (
            <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>AERO DAEMON & DRIVER EVENT TELEMETRY LOGS</span>
                </h2>
                <button
                  onClick={() => addLog('VACUUM', 'INFO', 'Manual telemetry snapshot created by engineer')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
                >
                  ADD DIAGNOSTIC PING
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs max-h-[460px] overflow-y-auto pr-1">
                {eventLogs.map(log => (
                  <div
                    key={log.id}
                    className="bg-[#0F172A] border border-slate-800/80 rounded-md p-3 flex items-start gap-3 hover:border-slate-700 transition-colors"
                  >
                    <span className="text-slate-500 font-bold shrink-0">{log.time}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        log.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : log.severity === 'WARN'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : log.severity === 'ACTION'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-slate-200 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. BOTTOM CORNERING APEX & HIGH-G TELEMETRY LEDGER */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <span>CORNERING APEX & HIGH-G TELEMETRY LEDGER (16 APEX STINT)</span>
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Cornering velocity, peak lateral G load, underfloor seal integrity, and turbine kilowatt demand
                </p>
              </div>

              {/* Action Buttons & Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Filter corner or status..."
                  value={cornerSearch}
                  onChange={e => setCornerSearch(e.target.value)}
                  className="bg-[#0F172A] border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <button
                  onClick={runCalibrationRoutine}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Calibrate Skirts</span>
                </button>

                <button
                  onClick={() => setShowReverseModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fan Reverse</span>
                </button>

                <button
                  onClick={handleDumpVacuum}
                  className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                    isVacuumDumped
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isVacuumDumped ? 'Restore Seal' : 'Dump Seal'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Stint CSV</span>
                </button>
              </div>
            </div>

            {/* High-Contrast Telemetry Table (with py-3.5 px-3 row styling and generous clearance) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-300 font-bold uppercase text-xs tracking-wider bg-[#080D1A]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">APEX / CORNER NAME</th>
                    <th className="py-3 px-3">SECTOR</th>
                    <th className="py-3 px-3 text-right">APEX SPEED</th>
                    <th className="py-3 px-3 text-right">ENTRY G</th>
                    <th className="py-3 px-3 text-right">PEAK LATERAL G</th>
                    <th className="py-3 px-3 text-right">EXIT G</th>
                    <th className="py-3 px-3 text-right">SUCTION (kPa)</th>
                    <th className="py-3 px-3 text-right">SKIRT GAP</th>
                    <th className="py-3 px-3 text-right">SEAL (%)</th>
                    <th className="py-3 px-3 text-right">TURBINE (kW)</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCorners.map(corner => {
                    const isExtremeG = corner.peakLateralG >= 3.4;
                    const isUltraVac = corner.underfloorVacuumKpa <= -50.0;
                    const isSelected = selectedCorner?.id === corner.id;

                    return (
                      <tr
                        key={corner.id}
                        onClick={() => setSelectedCorner(corner)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 text-slate-100 font-bold'
                            : 'hover:bg-[#0F172A]/70 text-slate-200'
                        }`}
                      >
                        <td className="py-3.5 px-3 font-bold text-slate-400">{corner.id}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>{corner.cornerName}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 font-bold">{corner.trackSector}</td>
                        <td className="py-3.5 px-3 text-right font-black tabular-nums text-slate-100">
                          {corner.apexSpeedKmh.toFixed(1)} <span className="text-[11px] text-slate-400 font-normal">km/h</span>
                        </td>
                        <td className="py-3.5 px-3 text-right tabular-nums text-slate-300">
                          {corner.entryLateralG.toFixed(2)} G
                        </td>
                        <td className={`py-3.5 px-3 text-right font-black tabular-nums ${isExtremeG ? 'text-amber-400 font-bold' : 'text-cyan-400'}`}>
                          {corner.peakLateralG.toFixed(2)} G
                        </td>
                        <td className="py-3.5 px-3 text-right tabular-nums text-slate-300">
                          {corner.exitLateralG.toFixed(2)} G
                        </td>
                        <td className={`py-3.5 px-3 text-right font-bold tabular-nums ${isUltraVac ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {corner.underfloorVacuumKpa.toFixed(1)} kPa
                        </td>
                        <td className="py-3.5 px-3 text-right tabular-nums text-slate-300">
                          {corner.skirtGapMm.toFixed(1)} mm
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold tabular-nums text-emerald-400">
                          {corner.sealIntegrityPct.toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-3 text-right tabular-nums text-slate-300">
                          {corner.turbineKw.toFixed(1)} kW
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-[11px] font-mono font-bold tracking-wider uppercase inline-block ${
                              corner.statusTag === 'EXTREME_G'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/70'
                                : corner.statusTag === 'ULTRA_VAC'
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-600/70'
                                : corner.statusTag === 'CURB_DEFLECT'
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-600/70'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {corner.statusTag}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Corner Deep Dive Card */}
            {selectedCorner && (
              <div className="mt-4 bg-[#080D1A] border border-cyan-900/50 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center font-bold text-cyan-300 text-sm">
                    {selectedCorner.id}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{selectedCorner.cornerName}</div>
                    <div className="text-slate-400">
                      Sector {selectedCorner.trackSector} // Ground-Effect Anchor: {selectedCorner.underfloorVacuumKpa} kPa
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PEAK G-LOAD</span>
                    <span className="text-sm font-black text-amber-400">{selectedCorner.peakLateralG} G</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">APEX SPEED</span>
                    <span className="text-sm font-black text-cyan-400">{selectedCorner.apexSpeedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TURBINE POWER</span>
                    <span className="text-sm font-black text-slate-100">{selectedCorner.turbineKw} kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SKIRT GAP</span>
                    <span className="text-sm font-black text-emerald-400">{selectedCorner.skirtGapMm} mm</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* FOOTER */}
        <footer className="bg-[#0B0F17] border-t border-slate-800 px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>AEON DYNAMICS AERO LAB // REVISION 4.8.1</span>
            <span className="text-slate-600">|</span>
            <span>VENTURI VACUUM FLUIDICS LOCKED</span>
          </div>
          <div>
            <span>SYSTEM CLOCK: 2026-10-04 // TELEMETRY BUFFER HEALTH: 100%</span>
          </div>
        </footer>

        {/* MODAL: CALIBRATION PROGRESS */}
        {showCalibrateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-cyan-500/50 rounded-xl p-6 max-w-md w-full space-y-4 font-mono shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Sliders className="w-4 h-4 animate-spin" />
                  <span>SKIRT ZERO-DATUM CALIBRATION</span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Lowering vehicle to laser datum. Zeroing high-speed pneumatic actuators on all 4 corners to 3.8mm clearance.
              </p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Laser Sensor Zeroing:</span>
                  <span className="text-cyan-400 font-bold">{calibratingProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${calibratingProgress}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <div>• Front Left Actuator: {calibratingProgress >= 50 ? 'LOCKED (3.8mm)' : 'ALIGNING...'}</div>
                <div>• Front Right Actuator: {calibratingProgress >= 75 ? 'LOCKED (3.8mm)' : 'ALIGNING...'}</div>
                <div>• Rear Seal Integrity: {calibratingProgress === 100 ? 'VERIFIED (99.8%)' : 'TESTING...'}</div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EMERGENCY FAN REVERSE CONFIRMATION */}
        {showReverseModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-amber-600 rounded-xl p-6 max-w-md w-full space-y-4 font-mono shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>CONFIRM EMERGENCY FAN REVERSE</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                WARNING: Engaging turbine fan reverse instantly reverses blade pitch to blow high-pressure air through the underfloor Venturi ducts. This will purge track rubber debris but will eliminate all vacuum downforce for 4.5 seconds.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowReverseModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded"
                >
                  ABORT
                </button>
                <button
                  onClick={confirmEmergencyReverse}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs rounded tracking-wider uppercase"
                >
                  EXECUTE REVERSE PULSE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: OVERBOOST SAFETY ARM PROMPT */}
        {showOverboostModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-cyan-500 rounded-xl p-6 max-w-md w-full space-y-4 font-mono shadow-2xl">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm pb-2 border-b border-slate-800">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>SAFETY INTERLOCK: ARM TURBINE OVERBOOST</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Turbine Overboost requires pilot safety interlock arming before high-RPM spooling can be commanded. Arming allows the dual fans to surge past 21,500 RPM up to 24,500 RPM for maximum cornering suction.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowOverboostModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setIsOverboostArmed(true);
                    setShowOverboostModal(false);
                    addLog('OVERBOOST', 'WARN', 'Turbine Overboost armed via safety interlock');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded tracking-wider uppercase"
                >
                  ARM OVERBOOST
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
