import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  Wind,
  ShieldAlert,
  Sliders,
  RotateCcw,
  Download,
  AlertTriangle,
  Play,
  Pause,
  ChevronRight,
  Crosshair,
  Layers,
  Thermometer,
  Cpu,
  RefreshCw,
  CheckCircle2,
  X,
  Compass,
  Radio,
  FileSpreadsheet,
  Lock,
  Unlock,
  ChevronsUp,
  CircleDot,
  Flame,
  ArrowUpRight
} from 'lucide-react';

// ============================================================================
// DATA MODELS & INTERFACES
// ============================================================================

export type AeroProfileKey = 'V_MAX' | 'CORNER_CARVER' | 'AIRBRAKE' | 'AUTO_ADAPTIVE';

export interface AeroProfileConfig {
  key: AeroProfileKey;
  label: string;
  sublabel: string;
  cdBase: number;
  downforceBase: number;
  splitterFlexPct: number;
  bargeboardFlarePct: number;
  rearWingCamberDeg: number;
  diffuserAngleDeg: number;
  accentColor: string;
  badgeBg: string;
}

export interface ActuatorChannel {
  id: number;
  name: string;
  zone: 'FRONT_SPLITTER' | 'SIDE_BARGEBOARD' | 'VENTURI_DIFFUSER' | 'REAR_AERO';
  x: number; // SVG % coordinate
  y: number; // SVG % coordinate
  currentAmps: number;
  tempCelsius: number;
  deflectionMm: number;
  maxDeflectionMm: number;
  cycleCount: number;
  status: 'NOMINAL' | 'WARMING' | 'ACTIVE_FLEX' | 'LOCKED';
}

export interface SectorRecord {
  sector: number;
  name: string;
  entrySpeed: number;
  apexSpeed: number;
  exitSpeed: number;
  cd: number;
  downforceKg: number;
  actuatorCycles: number;
  sectorTime: number;
  morphState: string;
  status: 'OPTIMAL' | 'RECORD' | 'HIGH_LOAD';
}

export interface TelemetryLogEvent {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'OPTIMAL' | 'WARNING' | 'ACTION';
  code: string;
  title: string;
  details: string;
  voltagePulse: number;
  operator: string;
}

// ============================================================================
// STATIC CONSTANTS & SEED REPOSITORIES
// ============================================================================

const AERO_PROFILES: Record<AeroProfileKey, AeroProfileConfig> = {
  V_MAX: {
    key: 'V_MAX',
    label: 'V-MAX STREAMLINE',
    sublabel: 'Drag Purge Lock // Cd 0.198',
    cdBase: 0.198,
    downforceBase: 1680,
    splitterFlexPct: -18.5,
    bargeboardFlarePct: 4.2,
    rearWingCamberDeg: -2.4,
    diffuserAngleDeg: 7.8,
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
  },
  CORNER_CARVER: {
    key: 'CORNER_CARVER',
    label: 'CORNER CARVER',
    sublabel: 'Max Lateral Suction // Cd 0.410',
    cdBase: 0.410,
    downforceBase: 2450,
    splitterFlexPct: 32.0,
    bargeboardFlarePct: 68.4,
    rearWingCamberDeg: 14.5,
    diffuserAngleDeg: 18.2,
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
  },
  AIRBRAKE: {
    key: 'AIRBRAKE',
    label: 'AIRBRAKE DUMP',
    sublabel: 'High-G Decel Drag Dump // Cd 0.440',
    cdBase: 0.440,
    downforceBase: 2890,
    splitterFlexPct: 45.0,
    bargeboardFlarePct: 92.0,
    rearWingCamberDeg: 26.8,
    diffuserAngleDeg: 22.0,
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300'
  },
  AUTO_ADAPTIVE: {
    key: 'AUTO_ADAPTIVE',
    label: 'AUTO ADAPTIVE MORPH',
    sublabel: 'Dynamic AI Fluid-Flex // Real-Time Cd',
    cdBase: 0.285,
    downforceBase: 1980,
    splitterFlexPct: 12.0,
    bargeboardFlarePct: 34.0,
    rearWingCamberDeg: 6.2,
    diffuserAngleDeg: 12.5,
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/60 border-emerald-400/40 text-emerald-300'
  }
};

const INITIAL_ACTUATORS: ActuatorChannel[] = [
  { id: 1, name: 'ACT-01 L-Splitter Canard', zone: 'FRONT_SPLITTER', x: 26, y: 15, currentAmps: 4.8, tempCelsius: 24.8, deflectionMm: -4.2, maxDeflectionMm: 12.0, cycleCount: 1420, status: 'NOMINAL' },
  { id: 2, name: 'ACT-02 R-Splitter Canard', zone: 'FRONT_SPLITTER', x: 74, y: 15, currentAmps: 4.9, tempCelsius: 25.1, deflectionMm: -4.2, maxDeflectionMm: 12.0, cycleCount: 1418, status: 'NOMINAL' },
  { id: 3, name: 'ACT-03 Nose Venturi Inflow', zone: 'FRONT_SPLITTER', x: 50, y: 20, currentAmps: 5.2, tempCelsius: 26.0, deflectionMm: 1.8, maxDeflectionMm: 8.0, cycleCount: 1890, status: 'NOMINAL' },
  { id: 4, name: 'ACT-04 Nose Variable Camber', zone: 'FRONT_SPLITTER', x: 50, y: 26, currentAmps: 4.1, tempCelsius: 23.9, deflectionMm: 0.6, maxDeflectionMm: 6.0, cycleCount: 1120, status: 'NOMINAL' },
  { id: 5, name: 'ACT-05 L-Bargeboard Flap Up', zone: 'SIDE_BARGEBOARD', x: 22, y: 38, currentAmps: 6.1, tempCelsius: 27.4, deflectionMm: 8.4, maxDeflectionMm: 16.0, cycleCount: 2240, status: 'ACTIVE_FLEX' },
  { id: 6, name: 'ACT-06 L-Bargeboard Flap Low', zone: 'SIDE_BARGEBOARD', x: 21, y: 48, currentAmps: 5.8, tempCelsius: 26.8, deflectionMm: 7.2, maxDeflectionMm: 16.0, cycleCount: 2210, status: 'ACTIVE_FLEX' },
  { id: 7, name: 'ACT-07 R-Bargeboard Flap Up', zone: 'SIDE_BARGEBOARD', x: 78, y: 38, currentAmps: 6.0, tempCelsius: 27.2, deflectionMm: 8.3, maxDeflectionMm: 16.0, cycleCount: 2235, status: 'ACTIVE_FLEX' },
  { id: 8, name: 'ACT-08 R-Bargeboard Flap Low', zone: 'SIDE_BARGEBOARD', x: 79, y: 48, currentAmps: 5.9, tempCelsius: 26.9, deflectionMm: 7.1, maxDeflectionMm: 16.0, cycleCount: 2215, status: 'ACTIVE_FLEX' },
  { id: 9, name: 'ACT-09 Side Pod Bleed L', zone: 'SIDE_BARGEBOARD', x: 25, y: 60, currentAmps: 3.8, tempCelsius: 23.1, deflectionMm: 2.1, maxDeflectionMm: 10.0, cycleCount: 940, status: 'NOMINAL' },
  { id: 10, name: 'ACT-10 Side Pod Bleed R', zone: 'SIDE_BARGEBOARD', x: 75, y: 60, currentAmps: 3.7, tempCelsius: 23.0, deflectionMm: 2.0, maxDeflectionMm: 10.0, cycleCount: 938, status: 'NOMINAL' },
  { id: 11, name: 'ACT-11 Active Venturi Throat', zone: 'VENTURI_DIFFUSER', x: 42, y: 72, currentAmps: 7.2, tempCelsius: 29.5, deflectionMm: 9.8, maxDeflectionMm: 15.0, cycleCount: 3100, status: 'WARMING' },
  { id: 12, name: 'ACT-12 Diffuser Central Fin', zone: 'VENTURI_DIFFUSER', x: 58, y: 72, currentAmps: 6.8, tempCelsius: 28.9, deflectionMm: 9.2, maxDeflectionMm: 15.0, cycleCount: 3080, status: 'NOMINAL' },
  { id: 13, name: 'ACT-13 Wing Mainplane Pitch', zone: 'REAR_AERO', x: 50, y: 84, currentAmps: 8.4, tempCelsius: 31.2, deflectionMm: 14.2, maxDeflectionMm: 25.0, cycleCount: 4210, status: 'WARMING' },
  { id: 14, name: 'ACT-14 Wing Camber Tip L', zone: 'REAR_AERO', x: 24, y: 88, currentAmps: 5.3, tempCelsius: 25.6, deflectionMm: 5.1, maxDeflectionMm: 14.0, cycleCount: 1980, status: 'NOMINAL' },
  { id: 15, name: 'ACT-15 Wing Camber Tip R', zone: 'REAR_AERO', x: 76, y: 88, currentAmps: 5.4, tempCelsius: 25.8, deflectionMm: 5.2, maxDeflectionMm: 14.0, cycleCount: 1985, status: 'NOMINAL' },
  { id: 16, name: 'ACT-16 Vortex Gate Purge', zone: 'REAR_AERO', x: 50, y: 93, currentAmps: 4.5, tempCelsius: 24.2, deflectionMm: 3.5, maxDeflectionMm: 8.0, cycleCount: 1540, status: 'NOMINAL' }
];

const INITIAL_SECTORS: SectorRecord[] = [
  { sector: 1,  name: 'Main Straight // Launch Blast', entrySpeed: 294.2, apexSpeed: 384.6, exitSpeed: 392.4, cd: 0.198, downforceKg: 1680.0, actuatorCycles: 48,  sectorTime: 6.842, morphState: 'STREAMLINE_LOCK', status: 'RECORD' },
  { sector: 2,  name: 'Supersonic Kink East // T1',    entrySpeed: 390.1, apexSpeed: 355.4, exitSpeed: 368.2, cd: 0.235, downforceKg: 1890.0, actuatorCycles: 84,  sectorTime: 7.120, morphState: 'ADAPTIVE_TRIM',   status: 'OPTIMAL' },
  { sector: 3,  name: 'Braking Gate 1 // Threshold',   entrySpeed: 368.2, apexSpeed: 192.5, exitSpeed: 204.0, cd: 0.440, downforceKg: 2890.0, actuatorCycles: 142, sectorTime: 5.450, morphState: 'AIRBRAKE_DUMP',   status: 'HIGH_LOAD' },
  { sector: 4,  name: 'Omega Carousel Apex',           entrySpeed: 204.0, apexSpeed: 178.6, exitSpeed: 225.4, cd: 0.410, downforceKg: 2450.0, actuatorCycles: 188, sectorTime: 8.934, morphState: 'CORNER_CARVE',    status: 'OPTIMAL' },
  { sector: 5,  name: 'Acceleration Chute Alpha',      entrySpeed: 225.4, apexSpeed: 288.9, exitSpeed: 312.0, cd: 0.245, downforceKg: 1750.0, actuatorCycles: 92,  sectorTime: 5.890, morphState: 'PROGRESSIVE_FLEX', status: 'OPTIMAL' },
  { sector: 6,  name: 'High-Speed Chicane Entry',      entrySpeed: 312.0, apexSpeed: 245.0, exitSpeed: 252.0, cd: 0.360, downforceKg: 2210.0, actuatorCycles: 134, sectorTime: 4.980, morphState: 'ROLL_MOMENT_COMP', status: 'OPTIMAL' },
  { sector: 7,  name: 'Chicane Direction Transition',  entrySpeed: 252.0, apexSpeed: 238.4, exitSpeed: 268.0, cd: 0.380, downforceKg: 2340.0, actuatorCycles: 156, sectorTime: 5.120, morphState: 'DYNAMIC_VECTOR',  status: 'OPTIMAL' },
  { sector: 8,  name: 'Hangar Velocity Sprint',        entrySpeed: 268.0, apexSpeed: 372.1, exitSpeed: 401.5, cd: 0.202, downforceKg: 1695.0, actuatorCycles: 66,  sectorTime: 6.410, morphState: 'DRAG_PURGE_PULSE', status: 'RECORD' },
  { sector: 9,  name: 'V-Max High-Bank Curve South',   entrySpeed: 401.5, apexSpeed: 386.0, exitSpeed: 394.8, cd: 0.218, downforceKg: 1790.0, actuatorCycles: 110, sectorTime: 7.820, morphState: 'GROUND_SUCTION',   status: 'OPTIMAL' },
  { sector: 10, name: 'Deceleration Funnel Bravo',     entrySpeed: 394.8, apexSpeed: 210.0, exitSpeed: 220.5, cd: 0.435, downforceKg: 2810.0, actuatorCycles: 138, sectorTime: 5.620, morphState: 'AERO_DECEL_MAX',  status: 'HIGH_LOAD' },
  { sector: 11, name: 'Corkscrew Drop // Compression', entrySpeed: 220.5, apexSpeed: 185.0, exitSpeed: 214.2, cd: 0.395, downforceKg: 2380.0, actuatorCycles: 162, sectorTime: 6.740, morphState: 'GROUND_SEAL_ACT', status: 'OPTIMAL' },
  { sector: 12, name: 'Spine Sweeper Right',           entrySpeed: 214.2, apexSpeed: 274.5, exitSpeed: 305.0, cd: 0.280, downforceKg: 1880.0, actuatorCycles: 98,  sectorTime: 6.190, morphState: 'TRANSVERSE_STAB',  status: 'OPTIMAL' },
  { sector: 13, name: 'Penultimate High-G Left',       entrySpeed: 305.0, apexSpeed: 260.0, exitSpeed: 289.0, cd: 0.340, downforceKg: 2140.0, actuatorCycles: 122, sectorTime: 5.430, morphState: 'VORTEX_TRAPPING',  status: 'OPTIMAL' },
  { sector: 14, name: 'Final Grid Launch Straight',    entrySpeed: 289.0, apexSpeed: 379.8, exitSpeed: 384.6, cd: 0.198, downforceKg: 1680.0, actuatorCycles: 52,  sectorTime: 6.250, morphState: 'STREAMLINE_PURGE', status: 'RECORD' }
];

const INITIAL_LOGS: TelemetryLogEvent[] = [
  {
    id: 'EVT-904',
    timestamp: '04:39:52.180',
    severity: 'OPTIMAL',
    code: 'ALLOY_VMAX_ENGAGED',
    title: 'Streamline Morph Engaged // Drag Purge Active',
    details: 'Front canards retracted to -18.5%, active underfloor venturi skirts sealed to 4.2mm. Cd locked at 0.198.',
    voltagePulse: 48.0,
    operator: 'PILOT_SYS_AUTO'
  },
  {
    id: 'EVT-903',
    timestamp: '04:39:34.912',
    severity: 'ACTION',
    code: 'AIRBRAKE_DEPLOY_MAX',
    title: 'High-G Airbrake Deployed // Vortex Dump',
    details: 'Piezo actuators pulsed at 48.2V. Variable-camber rear wing deflected +26.8° pitch, yielding 2,890 kg aero brake load.',
    voltagePulse: 48.2,
    operator: 'PILOT_THRESHOLD_TRIGGER'
  },
  {
    id: 'EVT-902',
    timestamp: '04:39:12.440',
    severity: 'OPTIMAL',
    code: 'SKIN_PRESTRESS_CALIB',
    title: 'Alloy Surface Pre-Stressed // Tension Balanced',
    details: 'Shape-memory nickel-titanium lattice thermally pre-stressed to 24.8°C baseline. Hysteresis under 0.04mm.',
    voltagePulse: 47.9,
    operator: 'CREW_CHIEF_SYSTEM'
  },
  {
    id: 'EVT-901',
    timestamp: '04:38:50.004',
    severity: 'INFO',
    code: 'HYDR_BUS_STABILIZED',
    title: 'Hydraulic Bus Pressure Nominal at 280.2 Bar',
    details: 'Micro-hydraulic fluid manifold operating within target window (278-282 bar). Servo response verified at 2.8ms.',
    voltagePulse: 48.0,
    operator: 'HYDR_CONTROLLER_P01'
  },
  {
    id: 'EVT-900',
    timestamp: '04:38:18.720',
    severity: 'WARNING',
    code: 'DIFFUSER_TEMP_SPIKE',
    title: 'Diffuser Actuator ACT-13 Thermal Gradient Alert',
    details: 'Actuator 13 reached 31.2°C under sustained downforce load in Sector 4. Secondary liquid coolant loop increased to 14.2 LPM.',
    voltagePulse: 48.0,
    operator: 'THERMAL_MGMT_SUBSYS'
  }
];

// ============================================================================
// MAIN COMPONENT: ChronosMorphDeck
// ============================================================================

export default function ChronosMorphDeck() {
  // Navigation & View Tabs
  const [activeTab, setActiveTab] = useState<'DECK' | 'SKIN' | 'ACTUATORS' | 'SECTORS' | 'LOGS'>('DECK');

  // Simulation Controls
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 5>(1);
  const [streamlineMorphActive, setStreamlineMorphActive] = useState<boolean>(true);
  const [currentProfileKey, setCurrentProfileKey] = useState<AeroProfileKey>('V_MAX');
  const [activeSectorIndex, setActiveSectorIndex] = useState<number>(0);

  // Core Dynamic Telemetry
  const [speedKmh, setSpeedKmh] = useState<number>(384.6);
  const [powerKw, setPowerKw] = useState<number>(1976);
  const [cd, setCd] = useState<number>(0.198);
  const [downforceKg, setDownforceKg] = useState<number>(1680);
  const [alloyVoltage, setAlloyVoltage] = useState<number>(48.0);
  const [hydraulicPressureBar, setHydraulicPressureBar] = useState<number>(280.2);
  const [valveResponseMs, setValveResponseMs] = useState<number>(2.8);
  const [inverterLoadPct, setInverterLoadPct] = useState<number>(96.2);
  const [superconductingTempK, setSuperconductingTempK] = useState<number>(77.4);
  const [coolantFlowLpm, setCoolantFlowLpm] = useState<number>(14.2);

  // Actuator Grid & Sector Data
  const [actuators, setActuators] = useState<ActuatorChannel[]>(INITIAL_ACTUATORS);
  const [sectors, setSectors] = useState<SectorRecord[]>(INITIAL_SECTORS);
  const [logs, setLogs] = useState<TelemetryLogEvent[]>(INITIAL_LOGS);
  const [selectedActuator, setSelectedActuator] = useState<ActuatorChannel | null>(null);

  // Action Modals State
  const [activeModal, setActiveModal] = useState<'RESET_MEMORY' | 'PRE_STRESS' | 'EMERGENCY_LOCK' | 'EXPORT_CSV' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Sync profile when Streamline toggle is clicked
  const handleToggleStreamline = useCallback(() => {
    setStreamlineMorphActive(prev => {
      const next = !prev;
      if (next) {
        setCurrentProfileKey('V_MAX');
        showToast('STREAMLINE MORPH ENGAGED // Drag Purge Active (Cd 0.198)');
      } else {
        setCurrentProfileKey('AUTO_ADAPTIVE');
        showToast('AUTO ADAPTIVE MORPH ENGAGED // Dynamic Flow Active');
      }
      return next;
    });
  }, [showToast]);

  const handleSelectProfile = useCallback((key: AeroProfileKey) => {
    setCurrentProfileKey(key);
    if (key === 'V_MAX') {
      setStreamlineMorphActive(true);
    } else {
      setStreamlineMorphActive(false);
    }
    const profile = AERO_PROFILES[key];
    showToast(`Aero Profile Switched to: ${profile.label}`);
  }, [showToast]);

  // Simulation Tick Loop
  useEffect(() => {
    if (!simRunning) return;

    const intervalMs = simSpeed === 5 ? 120 : 600;
    const timer = setInterval(() => {
      // 1. Advance sector rhythmically
      setActiveSectorIndex(prev => (prev + 1) % sectors.length);

      // 2. Modulate telemetry based on active profile and current sector
      const currentProfile = AERO_PROFILES[currentProfileKey];
      const targetSector = sectors[activeSectorIndex];

      // Jitter & physics formula
      const speedJitter = (Math.random() - 0.5) * 4.2;
      const baseSpeed = currentProfileKey === 'V_MAX' ? 384.6 : currentProfileKey === 'AIRBRAKE' ? 220.0 : 310.0;
      const newSpeed = Math.max(160, Math.min(442.5, +(baseSpeed + speedJitter).toFixed(1)));
      setSpeedKmh(newSpeed);

      const powerFactor = (newSpeed / 400);
      const newPower = Math.round(1976 * 0.85 + (powerFactor * 290) + (Math.random() * 20));
      setPowerKw(Math.min(1976, Math.max(1200, newPower)));

      const cdVariance = (Math.random() - 0.5) * 0.006;
      const newCd = +(currentProfile.cdBase + cdVariance).toFixed(3);
      setCd(newCd);

      const downforceJitter = Math.round((Math.random() - 0.5) * 35);
      const newDf = Math.round(currentProfile.downforceBase * (newSpeed / 350) + downforceJitter);
      setDownforceKg(newDf);

      // Voltage pulse around 48V
      const newVolt = +(48.0 + (Math.random() - 0.5) * 0.3).toFixed(1);
      setAlloyVoltage(newVolt);

      // Hydraulics
      const newPress = +(280.0 + (Math.random() - 0.5) * 1.2).toFixed(1);
      setHydraulicPressureBar(newPress);
      const newValveMs = +(2.8 + (Math.random() - 0.5) * 0.4).toFixed(1);
      setValveResponseMs(newValveMs);

      // Superconducting temps & inverters
      setInverterLoadPct(+(95.5 + Math.random() * 2.2).toFixed(1));
      setSuperconductingTempK(+(77.2 + Math.random() * 0.4).toFixed(1));
      setCoolantFlowLpm(+(14.0 + Math.random() * 0.5).toFixed(1));

      // 3. Modulate Actuators
      setActuators(prev =>
        prev.map(act => {
          const thermalDelta = (Math.random() - 0.48) * 0.3;
          const currentDelta = (Math.random() - 0.5) * 0.2;
          const newTemp = +(act.tempCelsius + thermalDelta).toFixed(1);
          const newCurrent = +(act.currentAmps + currentDelta).toFixed(1);

          let newStatus = act.status;
          if (newTemp > 31.0) newStatus = 'WARMING';
          else if (Math.abs(act.deflectionMm) > 7.0) newStatus = 'ACTIVE_FLEX';
          else newStatus = 'NOMINAL';

          return {
            ...act,
            tempCelsius: newTemp,
            currentAmps: Math.max(2.0, newCurrent),
            cycleCount: act.cycleCount + (Math.random() > 0.6 ? 1 : 0),
            status: newStatus
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simRunning, simSpeed, currentProfileKey, activeSectorIndex, sectors]);

  // Quick Action Handlers
  const handleResetAlloyMemory = () => {
    setActuators(prev =>
      prev.map(a => ({
        ...a,
        deflectionMm: 0,
        tempCelsius: 24.8,
        currentAmps: 4.5,
        status: 'NOMINAL'
      }))
    );
    const newLog: TelemetryLogEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'ACTION',
      code: 'ALLOY_MEMORY_RESET',
      title: 'Alloy Memory Crystallographic Anneal Reset Executed',
      details: 'All 16 piezoelectric channels calibrated to 0.00mm offset. Thermal envelope stabilized at 24.8°C.',
      voltagePulse: 48.4,
      operator: 'PILOT_MANUAL_OVERRIDE'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    setActiveModal(null);
    showToast('Alloy Memory Crystallographic Reset Complete (16/16 channels)');
  };

  const handlePreStressPanels = () => {
    setActuators(prev =>
      prev.map(a => ({
        ...a,
        tempCelsius: 25.2,
        currentAmps: 5.4,
        status: 'ACTIVE_FLEX'
      }))
    );
    const newLog: TelemetryLogEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'OPTIMAL',
      code: 'SKIN_PRESTRESS_CALIB',
      title: 'Active Skin Pre-Stressed // Tension Gradient Balanced',
      details: 'Nickel-Titanium composite lattice pre-strained. Flow resistance reduced by 3.2% across high-G envelope.',
      voltagePulse: 48.1,
      operator: 'CREW_CHIEF_SYSTEM'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    setActiveModal(null);
    showToast('Alloy Skin Pre-Stressing Pulse Applied (48.1V Pulse)');
  };

  const handleEmergencyLock = () => {
    setActuators(prev =>
      prev.map(a => ({
        ...a,
        status: 'LOCKED'
      }))
    );
    const newLog: TelemetryLogEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'WARNING',
      code: 'EMERGENCY_HYDR_LOCK',
      title: 'Emergency Hydraulic & Alloy Lock Engaged',
      details: 'Pilot initiated hydraulic bypass lock. All aero surfaces frozen in neutral low-vibration position.',
      voltagePulse: 0.0,
      operator: 'SAFETY_INTERLOCK'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    setActiveModal(null);
    showToast('EMERGENCY LOCK APPLIED: Aero actuators locked in failsafe trim');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Sector,Sector Name,Entry Speed (km/h),Apex Speed (km/h),Exit Speed (km/h),Cd,Downforce (kg),Actuator Cycles,Sector Time (s),Morph State\n' +
      sectors
        .map(
          s =>
            `${s.sector},"${s.name}",${s.entrySpeed},${s.apexSpeed},${s.exitSpeed},${s.cd},${s.downforceKg},${s.actuatorCycles},${s.sectorTime},"${s.morphState}"`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CHRONOS_PROTO14_AERO_TELEMETRY_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const newLog: TelemetryLogEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'INFO',
      code: 'TELEMETRY_EXPORT',
      title: 'Sector Telemetry Ledger Exported to CSV',
      details: '14 sectors of aerodynamic coefficients and velocity telemetry dumped to CSV artifact.',
      voltagePulse: 48.0,
      operator: 'FLIGHT_DECK_SYSTEM'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    setActiveModal(null);
    showToast('Export Complete: Morph Telemetry CSV saved.');
  };

  const currentSectorData = useMemo(() => sectors[activeSectorIndex], [sectors, activeSectorIndex]);
  const activeProfile = useMemo(() => AERO_PROFILES[currentProfileKey], [currentProfileKey]);

  return (
    <>
      <div className="min-h-screen bg-[#030712] text-slate-100 font-mono flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
        
        {/* ================================================================== */}
        {/* 1. TOP HEADER & HUD BAR                                           */}
        {/* ================================================================== */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-[1920px] mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* Left: Locked Identity & Chassis Code */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Wind className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>

              <div className="min-w-0 flex items-baseline gap-2.5 flex-wrap">
                <span className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 whitespace-nowrap">
                  CHRONOS MORPH-GT
                </span>
                <span className="text-xs md:text-sm font-bold font-mono tracking-widest text-emerald-400 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded shrink-0">
                  PROTO-14
                </span>
                <span className="hidden sm:inline-block text-xs font-mono font-medium text-slate-400 tracking-wider">
                  SHAPE-SHIFTING AERO INTERCEPTOR
                </span>
              </div>
            </div>

            {/* Right: Controls aligned in clean h-9 row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => setSimRunning(p => !p)}
                className={`h-9 px-3.5 rounded border text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition flex items-center gap-2 ${
                  simRunning
                    ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-amber-950/70 border-amber-500/60 text-amber-300 hover:bg-amber-900/60'
                }`}
                title={simRunning ? 'Pause live telemetry tick loop' : 'Resume live telemetry tick loop'}
              >
                {simRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{simRunning ? 'TELEMETRY LIVE' : 'FROZEN'}</span>
              </button>

              {/* Speed 1x / 5x Switcher */}
              <div className="h-9 p-0.5 rounded border border-slate-700 bg-slate-900/80 flex items-center">
                <button
                  type="button"
                  onClick={() => setSimSpeed(1)}
                  className={`h-full px-2.5 rounded text-xs font-mono font-bold tracking-wider transition ${
                    simSpeed === 1 ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1X
                </button>
                <button
                  type="button"
                  onClick={() => setSimSpeed(5)}
                  className={`h-full px-2.5 rounded text-xs font-mono font-bold tracking-wider transition ${
                    simSpeed === 5 ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  5X SPEED
                </button>
              </div>

              {/* Keyed Streamline Morph / Drag Purge Switch */}
              <button
                type="button"
                onClick={handleToggleStreamline}
                className={`h-9 px-3.5 rounded border text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition flex items-center gap-2 ${
                  streamlineMorphActive
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
                title="Toggle Streamline Aero Skin Lock"
              >
                <Zap className={`w-4 h-4 ${streamlineMorphActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <span>STREAMLINE MORPH</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-black ${
                    streamlineMorphActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {streamlineMorphActive ? 'LOCKED' : 'OFF'}
                </span>
              </button>

              {/* Emergency Status Pill */}
              <div className="h-9 px-3 rounded border border-slate-800 bg-[#0F172A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
                  48V BUS ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* TOP POWERTRAIN & MORPH-AERO HUD METRICS STRIP                    */}
          {/* ================================================================ */}
          <div className="border-t border-slate-800/80 bg-[#0F172A]/70 px-4 py-3">
            <div className="max-w-[1920px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Metric 1: Ground Speed */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    GROUND SPEED
                  </span>
                  <Gauge className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {speedKmh.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">KM/H</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>V-MAX: 442.5</span>
                  <span className="text-emerald-400 font-bold">{(speedKmh * 0.621371).toFixed(1)} MPH</span>
                </div>
              </div>

              {/* Metric 2: Total Drive Power */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    DRIVE POWER
                  </span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {powerKw.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">KW</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>PEAK: 1,976 KW</span>
                  <span className="text-emerald-400 font-bold">2,650 HP</span>
                </div>
              </div>

              {/* Metric 3: Aero Drag Coefficient */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    AERO DRAG (Cd)
                  </span>
                  <Wind className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {cd.toFixed(3)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">Cd</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>RANGE: 0.198 - 0.440</span>
                  <span className={activeProfile.accentColor}>{activeProfile.label.split(' ')[0]}</span>
                </div>
              </div>

              {/* Metric 4: Downforce Yield */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    DOWNFORCE YIELD
                  </span>
                  <ChevronsUp className="w-4 h-4 text-emerald-400 rotate-180" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {downforceKg.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">KG</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>@ CURRENT SPEED</span>
                  <span className="text-slate-300 font-bold">{(downforceKg * 9.80665 / 1000).toFixed(1)} kN</span>
                </div>
              </div>

              {/* Metric 5: Memory Alloy Voltage */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    ALLOY PULSE
                  </span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {alloyVoltage.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">VOLT</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>BUS: 48V HIGH-RATE</span>
                  <span className="text-emerald-400 font-bold">16 CHANNELS</span>
                </div>
              </div>

              {/* Metric 6: Hydraulic Pressure Bus */}
              <div className="p-3 rounded-lg bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    HYDRAULIC BUS
                  </span>
                  <Compass className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {hydraulicPressureBar.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">BAR</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                  <span>LATENCY: {valveResponseMs}ms</span>
                  <span className="text-emerald-400 font-bold">&lt; 4ms SLA</span>
                </div>
              </div>

            </div>
          </div>

          {/* ================================================================ */}
          {/* RESPONSIVE HORIZONTAL TAB BAR                                    */}
          {/* ================================================================ */}
          <div className="border-t border-slate-800 bg-[#0B0F17] px-4">
            <div className="max-w-[1920px] mx-auto overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 py-2">
              <button
                type="button"
                onClick={() => setActiveTab('DECK')}
                className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'DECK'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>STEALTH FLIGHT DECK</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SKIN')}
                className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'SKIN'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>MORPHING SKIN MAP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ACTUATORS')}
                className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'ACTUATORS'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>ACTUATOR MATRIX (16-CH)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SECTORS')}
                className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'SECTORS'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>SECTOR STINT LEDGER (1-14)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('LOGS')}
                className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition flex items-center gap-2 shrink-0 ${
                  activeTab === 'LOGS'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>SYSTEM LOGS &amp; EVENTS</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================================================================== */}
        {/* TOAST NOTIFICATION BANNER                                          */}
        {/* ================================================================== */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] border-2 border-emerald-500 text-slate-100 px-5 py-3 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs md:text-sm font-bold font-mono uppercase">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* MAIN BODY WORKSPACE (ACCORDING TO ACTIVE TAB)                     */}
        {/* ================================================================== */}
        <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 md:p-6 space-y-6">

          {/* VIEW TAB 1: STEALTH FLIGHT DECK (DEFAULT 4-PANE MASTER VIEW) */}
          {(activeTab === 'DECK' || activeTab === 'SKIN') && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

              {/* ============================================================ */}
              {/* PANE 2: CENTER-LEFT 2D INTERACTIVE MORPHING CARBON SILHOUETTE */}
              {/* ============================================================ */}
              <section className="xl:col-span-7 bg-[#0F172A] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                
                {/* Panel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Crosshair className="w-5 h-5 text-emerald-400" />
                      <span>2D INTERACTIVE MORPHING CARBON SILHOUETTE</span>
                    </h2>
                    <p className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                      16 Active Memory Alloy Flex Points // Real-Time Panel Vectors
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">ACTIVE PROFILE:</span>
                    <span className={`text-xs font-mono font-black uppercase px-2.5 py-1 rounded border ${activeProfile.badgeBg}`}>
                      {activeProfile.label}
                    </span>
                  </div>
                </div>

                {/* Clickable Aero Profile Selector Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                  {(Object.keys(AERO_PROFILES) as AeroProfileKey[]).map(key => {
                    const prof = AERO_PROFILES[key];
                    const isSelected = currentProfileKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectProfile(key)}
                        className={`p-2.5 rounded-lg border text-left transition ${
                          isSelected
                            ? `${prof.badgeBg} ring-1 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]`
                            : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase truncate">
                          {prof.label}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                          {prof.sublabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* SVG Silhouette Aerodynamic Canvas */}
                <div className="relative w-full h-[480px] bg-[#0B0F17] border border-slate-800/80 rounded-xl flex items-center justify-center p-4 overflow-hidden">
                  
                  {/* Subtle Grid Radar Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

                  {/* Wind Tunnel Streamlines Visualization */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-10 opacity-30">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-[1px] w-full bg-gradient-to-r from-transparent ${
                          currentProfileKey === 'AIRBRAKE'
                            ? 'via-amber-400'
                            : currentProfileKey === 'CORNER_CARVER'
                            ? 'via-cyan-400'
                            : 'via-emerald-400'
                        } to-transparent animate-pulse`}
                        style={{
                          animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                          transform: `scaleY(${1 + Math.sin(i) * 0.5})`
                        }}
                      />
                    ))}
                  </div>

                  {/* Central Top-Down Aerodynamic Hypercar Silhouette SVG */}
                  <svg
                    viewBox="0 0 400 700"
                    className="h-full w-auto max-w-full drop-shadow-[0_0_30px_rgba(16,185,129,0.15)] select-none"
                  >
                    {/* Defs for gradients */}
                    <defs>
                      <linearGradient id="carbonBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#111827" />
                        <stop offset="50%" stopColor="#0B0F17" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="canopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Active Aero Vector Vectors (Dynamic arrows) */}
                    {/* Front Splitter Expansion Flex */}
                    <path
                      d={
                        activeProfile.splitterFlexPct > 0
                          ? "M 100 80 Q 200 45 300 80"
                          : "M 120 90 Q 200 75 280 90"
                      }
                      fill="none"
                      stroke={currentProfileKey === 'AIRBRAKE' ? '#F59E0B' : '#10B981'}
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="transition-all duration-500"
                    />

                    {/* Left & Right Bargeboard Outward Flares */}
                    <path
                      d={
                        activeProfile.bargeboardFlarePct > 30
                          ? "M 70 240 Q 50 340 70 440"
                          : "M 85 240 Q 75 340 85 440"
                      }
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    <path
                      d={
                        activeProfile.bargeboardFlarePct > 30
                          ? "M 330 240 Q 350 340 330 440"
                          : "M 315 240 Q 325 340 315 440"
                      }
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />

                    {/* CHASSIS SILHOUETTE BODYWORK */}
                    {/* Main Carbon Monocoque & Fenders */}
                    <path
                      d="
                        M 200 60
                        C 170 60, 140 80, 120 110
                        C 90 150, 85 210, 95 260
                        C 70 280, 65 340, 80 400
                        C 70 430, 65 490, 75 550
                        C 85 610, 120 640, 150 655
                        C 180 665, 200 668, 200 668
                        C 200 668, 220 665, 250 655
                        C 280 640, 315 610, 325 550
                        C 335 490, 330 430, 320 400
                        C 335 340, 330 280, 305 260
                        C 315 210, 310 150, 280 110
                        C 260 80, 230 60, 200 60
                        Z
                      "
                      fill="url(#carbonBodyGrad)"
                      stroke="#334155"
                      strokeWidth="2"
                    />

                    {/* Cockpit Fighter-Jet Canopy */}
                    <path
                      d="
                        M 200 230
                        C 165 245, 150 310, 155 380
                        C 160 440, 180 470, 200 480
                        C 220 470, 240 440, 245 380
                        C 250 310, 235 245, 200 230
                        Z
                      "
                      fill="url(#canopyGrad)"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />

                    {/* Front Splitter Surface Plate */}
                    <path
                      d="M 110 95 L 200 70 L 290 95 L 275 125 L 200 105 L 125 125 Z"
                      fill="#030712"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Active Underfloor Venturi Tunnel Strakes */}
                    <line x1="165" y1="460" x2="155" y2="640" stroke="#10B981" strokeWidth="2" strokeDasharray="6 3" />
                    <line x1="235" y1="460" x2="245" y2="640" stroke="#10B981" strokeWidth="2" strokeDasharray="6 3" />
                    <line x1="190" y1="490" x2="185" y2="650" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="210" y1="490" x2="215" y2="650" stroke="#38BDF8" strokeWidth="1.5" />

                    {/* Rear Active Morphing Mainplane Wing */}
                    <rect
                      x="70"
                      y={activeProfile.rearWingCamberDeg > 15 ? 590 : 610}
                      width="260"
                      height={activeProfile.rearWingCamberDeg > 15 ? 32 : 20}
                      rx="4"
                      fill="#1E293B"
                      stroke={currentProfileKey === 'AIRBRAKE' ? '#F59E0B' : '#10B981'}
                      strokeWidth="2"
                      className="transition-all duration-500"
                    />

                    {/* Rear Wing Endplates */}
                    <path d="M 65 580 L 75 640" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 335 580 L 325 640" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

                    {/* Center Spine Dorsal Fin */}
                    <line x1="200" y1="260" x2="200" y2="610" stroke="#475569" strokeWidth="2" />

                    {/* INTERACTIVE MEMORY ALLOY FLEX NODES (1 to 16) */}
                    {actuators.map(act => {
                      const svgX = (act.x / 100) * 400;
                      const svgY = (act.y / 100) * 700;
                      const isHovered = selectedActuator?.id === act.id;
                      const isHot = act.tempCelsius > 30;

                      return (
                        <g
                          key={act.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedActuator(act)}
                        >
                          {/* Pulsing Concentric Ring */}
                          <circle
                            cx={svgX}
                            cy={svgY}
                            r={isHovered ? 16 : 10}
                            fill={isHot ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
                            stroke={isHot ? '#F59E0B' : '#10B981'}
                            strokeWidth="1"
                            className="animate-ping origin-center"
                            style={{ animationDuration: `${2.5 - (act.id % 3) * 0.5}s` }}
                          />

                          {/* Node Core */}
                          <circle
                            cx={svgX}
                            cy={svgY}
                            r={isHovered ? 7 : 5}
                            fill={isHot ? '#F59E0B' : '#10B981'}
                            stroke="#0B0F17"
                            strokeWidth="2"
                          />

                          {/* Node ID Label */}
                          <text
                            x={svgX + 8}
                            y={svgY + 4}
                            fill="#F1F5F9"
                            fontSize="9"
                            fontWeight="bold"
                            fontFamily="monospace"
                            className="pointer-events-none drop-shadow"
                          >
                            P{act.id}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Canvas Legend Overlay */}
                  <div className="absolute top-3 left-3 bg-[#0F172A]/90 border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono space-y-1 backdrop-blur-sm pointer-events-none">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>48V Shape-Memory Flex Node</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Thermal Excursion &gt; 30°C</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      Click node to inspect piezo telemetry
                    </div>
                  </div>

                  {/* Surface Deflection Summary Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#0F172A]/90 border border-slate-800 p-2.5 rounded-lg text-right backdrop-blur-sm">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">WING CAMBER ANGLE</div>
                    <div className="text-lg font-black font-mono text-emerald-400">
                      {activeProfile.rearWingCamberDeg > 0 ? `+${activeProfile.rearWingCamberDeg.toFixed(1)}°` : `${activeProfile.rearWingCamberDeg.toFixed(1)}°`}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Splitter: {activeProfile.splitterFlexPct}%
                    </div>
                  </div>
                </div>

                {/* Bottom Vector Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">FRONT SPLITTER FLEX</div>
                    <div className="text-slate-100 font-bold">{activeProfile.splitterFlexPct}% OFFSET</div>
                  </div>
                  <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">BARGEBOARD FLARE</div>
                    <div className="text-slate-100 font-bold">{activeProfile.bargeboardFlarePct}% EXPANSION</div>
                  </div>
                  <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">DIFFUSER EXPANSION</div>
                    <div className="text-slate-100 font-bold">{activeProfile.diffuserAngleDeg}° THROAT</div>
                  </div>
                  <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">SKIN VORTEX BLEED</div>
                    <div className="text-emerald-400 font-bold">{streamlineMorphActive ? 'LAMINAR PURGE' : 'TURBULENT DUMP'}</div>
                  </div>
                </div>
              </section>

              {/* ============================================================ */}
              {/* PANE 3: CENTER-RIGHT PIEZOELECTRIC ACTUATOR & HYDRAULIC BUS  */}
              {/* ============================================================ */}
              <section className="xl:col-span-5 bg-[#0F172A] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-2xl">
                
                {/* Panel Header */}
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      <span>PIEZOELECTRIC ACTUATOR &amp; HYDRAULIC BUS MATRIX</span>
                    </h2>
                    <p className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                      16-Channel Current &amp; Thermal Balance Grid
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 rounded">
                    280.2 BAR BUS
                  </span>
                </div>

                {/* Subsystem Health Gauges Strip */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>SUPERCONDUCT CRYO</span>
                      <Flame className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="text-lg md:text-xl font-black font-mono text-cyan-300 mt-0.5">
                      {superconductingTempK.toFixed(1)} K
                    </div>
                    <div className="text-[10px] text-slate-400">FLUX STATOR CORE</div>
                  </div>

                  <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>INVERTER LOAD</span>
                      <Activity className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-lg md:text-xl font-black font-mono text-emerald-400 mt-0.5">
                      {inverterLoadPct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400">EFFICIENCY 99.4%</div>
                  </div>

                  <div className="bg-[#0B0F17] border border-slate-800 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                      <span>COOLANT LOOP</span>
                      <Thermometer className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-lg md:text-xl font-black font-mono text-slate-100 mt-0.5">
                      {coolantFlowLpm.toFixed(1)} LPM
                    </div>
                    <div className="text-[10px] text-slate-400">PUMP RATE STABLE</div>
                  </div>
                </div>

                {/* 16-Channel Piezoelectric Micro-Grid */}
                <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                      PIEZO CELL CURRENT / THERMAL MATRIX
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      SELECT NODE FOR TELEMETRY
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {actuators.map(act => {
                      const isSelected = selectedActuator?.id === act.id;
                      const isHot = act.tempCelsius > 30;

                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => setSelectedActuator(act)}
                          className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-950/70 border-emerald-400 ring-1 ring-emerald-400'
                              : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-mono text-slate-200">
                              CH-{String(act.id).padStart(2, '0')}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isHot ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                          </div>

                          <div className="my-1">
                            <div className="text-sm font-black font-mono tabular-nums text-slate-100">
                              {act.tempCelsius.toFixed(1)}°C
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                              {act.currentAmps.toFixed(1)} A // {act.deflectionMm > 0 ? `+${act.deflectionMm.toFixed(1)}` : act.deflectionMm.toFixed(1)}mm
                            </div>
                          </div>

                          {/* Progress bar of deflection */}
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isHot ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.min(100, Math.max(10, (Math.abs(act.deflectionMm) / act.maxDeflectionMm) * 100))}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Micro-Hydraulic Bus Spec Banner */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>VALVE SERVO LATENCY: <strong className="text-emerald-400">{valveResponseMs}ms</strong></span>
                    <span>PRESSURE DELTA: <strong className="text-slate-200">±0.4 BAR</strong></span>
                    <span>FLUID TEMP: <strong className="text-slate-200">26.4°C</strong></span>
                  </div>
                </div>

                {/* Selected Actuator Deep Inspection Drawer */}
                {selectedActuator && (
                  <div className="mt-4 p-3 bg-[#0B0F17] border border-emerald-500/50 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                        SELECTED: {selectedActuator.name}
                      </div>
                      <div className="text-xs font-mono text-slate-300 mt-0.5">
                        Deflection: <strong>{selectedActuator.deflectionMm.toFixed(1)} mm</strong> (Max: {selectedActuator.maxDeflectionMm}mm) | Life Cycles: <strong>{selectedActuator.cycleCount}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedActuator(null)}
                      className="text-xs font-mono px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                    >
                      CLEAR
                    </button>
                  </div>
                )}
              </section>

            </div>
          )}

          {/* VIEW TAB 2: SECTOR STINT LEDGER (OR BOTTOM PANE OF DECK) */}
          {(activeTab === 'DECK' || activeTab === 'SECTORS') && (
            <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl">
              
              {/* Header and Quick Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    <span>HIGH-SPEED STINT &amp; MORPH ACTUATION LEDGER (SECTORS 1 TO 14)</span>
                  </h2>
                  <p className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                    Live Sector Velocity, Drag Modulations, Alloy Actuator Cycles &amp; Downforce Yield
                  </p>
                </div>

                {/* 4 Required Quick Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveModal('RESET_MEMORY')}
                    className="h-9 px-3 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-200 hover:text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RESET ALLOY MEMORY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('PRE_STRESS')}
                    className="h-9 px-3 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PRE-STRESS SKIN PANELS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('EMERGENCY_LOCK')}
                    className="h-9 px-3 rounded bg-amber-950/40 border border-amber-500/50 hover:bg-amber-900/60 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>EMERGENCY HYDRAULIC LOCK</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('EXPORT_CSV')}
                    className="h-9 px-3 rounded bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>EXPORT TELEMETRY CSV</span>
                  </button>
                </div>
              </div>

              {/* High-Contrast Dense Sector Table */}
              <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0B0F17] border-b border-slate-800 text-[11px] md:text-xs font-bold font-mono tracking-wider uppercase text-slate-400">
                      <th className="py-3 px-3">SEC</th>
                      <th className="py-3 px-3">SECTOR DESIGNATION</th>
                      <th className="py-3 px-3">ENTRY SPEED</th>
                      <th className="py-3 px-3">APEX SPEED</th>
                      <th className="py-3 px-3">EXIT SPEED</th>
                      <th className="py-3 px-3">ACTIVE Cd</th>
                      <th className="py-3 px-3">DOWNFORCE</th>
                      <th className="py-3 px-3">PIEZO CYCLES</th>
                      <th className="py-3 px-3">SECTOR TIME</th>
                      <th className="py-3 px-3">MORPH STATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm font-mono">
                    {sectors.map((sec, idx) => {
                      const isCurrentSector = idx === activeSectorIndex;
                      return (
                        <tr
                          key={sec.sector}
                          className={`transition ${
                            isCurrentSector
                              ? 'bg-emerald-950/30 border-l-4 border-l-emerald-400'
                              : 'hover:bg-slate-800/40 bg-[#0F172A]'
                          }`}
                        >
                          {/* Sector Number */}
                          <td className="py-3.5 px-3 font-bold text-slate-300 tabular-nums">
                            {String(sec.sector).padStart(2, '0')}
                          </td>

                          {/* Sector Name */}
                          <td className="py-3.5 px-3 font-semibold text-slate-100 flex items-center gap-2">
                            {isCurrentSector && (
                              <CircleDot className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                            )}
                            <span className="truncate max-w-[240px]">{sec.name}</span>
                          </td>

                          {/* Speeds */}
                          <td className="py-3.5 px-3 tabular-nums text-slate-300">
                            {sec.entrySpeed.toFixed(1)} km/h
                          </td>
                          <td className="py-3.5 px-3 tabular-nums font-bold text-emerald-400">
                            {sec.apexSpeed.toFixed(1)} km/h
                          </td>
                          <td className="py-3.5 px-3 tabular-nums text-slate-300">
                            {sec.exitSpeed.toFixed(1)} km/h
                          </td>

                          {/* Active Cd */}
                          <td className="py-3.5 px-3 tabular-nums">
                            <span
                              className={`px-2 py-0.5 rounded font-black text-xs ${
                                sec.cd <= 0.22
                                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                                  : sec.cd >= 0.40
                                  ? 'bg-amber-950 border border-amber-500/40 text-amber-300'
                                  : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                              }`}
                            >
                              Cd {sec.cd.toFixed(3)}
                            </span>
                          </td>

                          {/* Downforce */}
                          <td className="py-3.5 px-3 tabular-nums text-slate-200 font-bold">
                            {sec.downforceKg.toLocaleString()} kg
                          </td>

                          {/* Actuator Cycles */}
                          <td className="py-3.5 px-3 tabular-nums text-slate-400">
                            {sec.actuatorCycles} cyc
                          </td>

                          {/* Sector Time */}
                          <td className="py-3.5 px-3 tabular-nums font-bold text-slate-100">
                            {sec.sectorTime.toFixed(3)} s
                          </td>

                          {/* Morph State Badge */}
                          <td className="py-3.5 px-3">
                            <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              {sec.morphState}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* VIEW TAB 3: SYSTEM LOGS & EVENTS */}
          {(activeTab === 'LOGS') && (
            <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span>SYSTEM DIAGNOSTIC &amp; VEHICLE ACTION EVENTS LEDGER</span>
                  </h2>
                  <p className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                    Real-Time Flight Computer Interlock Telemetry Records
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const testLog: TelemetryLogEvent = {
                      id: `EVT-${Date.now().toString().slice(-4)}`,
                      timestamp: new Date().toISOString().substring(11, 23),
                      severity: 'OPTIMAL',
                      code: 'DIAGNOSTIC_PING',
                      title: 'Manual Bus Diagnostic Telemetry Ping',
                      details: 'All 16 memory alloy channels responded within 1.4ms handshake window.',
                      voltagePulse: 48.0,
                      operator: 'PILOT_SYS_AUTO'
                    };
                    setLogs(p => [testLog, ...p]);
                    showToast('Diagnostic Ping Recorded in System Log');
                  }}
                  className="h-8 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>INJECT PING</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0B0F17] border-b border-slate-800 text-[11px] md:text-xs font-bold font-mono tracking-wider uppercase text-slate-400">
                      <th className="py-3 px-3">TIMESTAMP</th>
                      <th className="py-3 px-3">SEVERITY</th>
                      <th className="py-3 px-3">EVENT CODE</th>
                      <th className="py-3 px-3">EVENT TITLE &amp; DETAILS</th>
                      <th className="py-3 px-3">VOLTAGE</th>
                      <th className="py-3 px-3">OPERATOR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm font-mono">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/40 bg-[#0F172A]">
                        <td className="py-3.5 px-3 tabular-nums text-slate-400 font-mono">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-black font-mono tracking-wider uppercase ${
                              log.severity === 'OPTIMAL'
                                ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                                : log.severity === 'ACTION'
                                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                                : log.severity === 'WARNING'
                                ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-200 font-mono">
                          {log.code}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-100">{log.title}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{log.details}</div>
                        </td>
                        <td className="py-3.5 px-3 tabular-nums font-bold text-emerald-400">
                          {log.voltagePulse.toFixed(1)} V
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 text-xs">
                          {log.operator}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* VIEW TAB 4: EXPANDED ACTUATOR MATRIX FULL VIEW */}
          {(activeTab === 'ACTUATORS') && (
            <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl">
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <span>16-CHANNEL PIEZOELECTRIC ACTUATOR EXPANDED DIAGNOSTICS</span>
                </h2>
                <p className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                  Real-time thermal envelope, dynamic deflection tolerances, and life cycle wear indexes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actuators.map(act => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          NODE P{act.id} // {act.zone}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {act.status}
                        </span>
                      </div>
                      <div className="text-sm font-bold font-mono text-slate-100 truncate">
                        {act.name}
                      </div>
                    </div>

                    <div className="my-3 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">TEMPERATURE:</span>
                        <span className="font-bold text-slate-100">{act.tempCelsius.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">CURRENT DRAW:</span>
                        <span className="font-bold text-emerald-400">{act.currentAmps.toFixed(2)} A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ACTUAL DEFLECTION:</span>
                        <span className="font-bold text-cyan-300">{act.deflectionMm.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">TOTAL CYCLES:</span>
                        <span className="text-slate-400">{act.cycleCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.min(100, (Math.abs(act.deflectionMm) / act.maxDeflectionMm) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>

        {/* ================================================================== */}
        {/* ACTION CONFIRMATION MODALS                                         */}
        {/* ================================================================== */}

        {/* Modal 1: Reset Alloy Memory */}
        {activeModal === 'RESET_MEMORY' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border-2 border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-emerald-400">
                <RotateCcw className="w-6 h-6 animate-spin" />
                <h3 className="text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  RESET ALLOY MEMORY
                </h3>
              </div>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                Confirm execution of a full crystallographic lattice anneal cycle across all 16 piezoelectric channels. This will recalibrate zero-point baseline offsets to 0.00mm.
              </p>
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">PULSE VOLTAGE: <strong className="text-slate-200">48.4V</strong></div>
                <div className="text-slate-400">CHANNELS INVOLVED: <strong className="text-emerald-400">16 / 16</strong></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300"
                >
                  ABORT
                </button>
                <button
                  type="button"
                  onClick={handleResetAlloyMemory}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                >
                  EXECUTE ANNEAL RESET
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Pre-Stress Skin Panels */}
        {activeModal === 'PRE_STRESS' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border-2 border-cyan-500/50 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-cyan-400">
                <Sliders className="w-6 h-6" />
                <h3 className="text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  PRE-STRESS SKIN PANELS
                </h3>
              </div>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                Applies calibrated 48.1V pre-tension across outer nickel-titanium aero skin. Prevents flutter at speeds exceeding 380 km/h.
              </p>
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400">PRE-STRESS PROFILE: <strong className="text-slate-200">HIGH-SPEED LAMINAR</strong></div>
                <div className="text-slate-400">ESTIMATED DRAG REDUCTION: <strong className="text-emerald-400">-3.2%</strong></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handlePreStressPanels}
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                >
                  APPLY PRE-STRESS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Emergency Hydraulic Lock */}
        {activeModal === 'EMERGENCY_LOCK' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border-2 border-amber-500 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <h3 className="text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  EMERGENCY HYDRAULIC LOCK
                </h3>
              </div>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                WARNING: Engaging hydraulic lock will freeze all active morphing surfaces immediately at neutral trim. Actuators will decouple from dynamic aerodynamic feedback.
              </p>
              <div className="bg-amber-950/40 p-3 rounded border border-amber-500/40 text-xs font-mono text-amber-200">
                Safety bypass pressure will be vented to reservoir.
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300"
                >
                  DISMISS
                </button>
                <button
                  type="button"
                  onClick={handleEmergencyLock}
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                >
                  CONFIRM EMERGENCY LOCK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Export CSV */}
        {activeModal === 'EXPORT_CSV' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border-2 border-emerald-500/50 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-emerald-400">
                <Download className="w-6 h-6" />
                <h3 className="text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  EXPORT MORPH TELEMETRY CSV
                </h3>
              </div>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                Compile and download full 14-sector high-rate aerodynamic telemetry file including Cd curves, downforce metrics, and actuator cycle counts.
              </p>
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 text-xs font-mono text-slate-400">
                TARGET FILE: <span className="text-emerald-400 font-bold">CHRONOS_PROTO14_AERO_TELEMETRY.csv</span>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                >
                  DOWNLOAD CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* FOOTER BAR                                                         */}
        {/* ================================================================== */}
        <footer className="border-t border-slate-800/80 bg-[#0B0F17] px-4 py-3 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AURA &amp; GRID // GHOST FACTORY AEROSPACE TELEMETRY ENGINE</span>
          </div>
          <div>
            <span>CHRONOS PROTO-14 // ENCRYPTED FLIGHT-DECK LINK 48.0V PULSE ACTIVE</span>
          </div>
        </footer>

      </div>
    </>
  );
}
