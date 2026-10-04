import React, { useState, useEffect, useRef } from 'react';
import {
  Gauge,
  Zap,
  Activity,
  Flame,
  Droplets,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sliders,
  ChevronRight,
  Radio,
  Clock,
  Sparkles,
  Thermometer,
  Layers,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  X,
  RefreshCw,
  Power
} from 'lucide-react';

// --- Types & Interfaces ---
export type StintMode =
  | '24H ENDURANCE CRUISE'
  | 'ATTACK QUALI'
  | 'RAIN REGEN BIAS'
  | 'H2 PURGE & VENT';

export interface StintRecord {
  stintNumber: number;
  driver: string;
  laps: number;
  avgPace: string;
  avgPaceSec: number;
  h2BurnPerLap: number; // kg/lap
  tireWearPct: number;
  capHealthPct: number;
  energyDeltaPct: number;
  pitTargetSec: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PIT_WINDOW';
}

export interface PitEvent {
  id: string;
  timestamp: string;
  stint: number;
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'OPERATIONAL';
  message: string;
}

// Initial 16 realistic stints for 24H endurance race
const INITIAL_STINTS: StintRecord[] = [
  { stintNumber: 1, driver: 'S. Buemi', laps: 24, avgPace: '3:22.180', avgPaceSec: 202.18, h2BurnPerLap: 0.542, tireWearPct: 18.5, capHealthPct: 100.0, energyDeltaPct: -0.8, pitTargetSec: 42.0, status: 'COMPLETED' },
  { stintNumber: 2, driver: 'S. Buemi', laps: 25, avgPace: '3:21.940', avgPaceSec: 201.94, h2BurnPerLap: 0.548, tireWearPct: 38.0, capHealthPct: 99.9, energyDeltaPct: -1.1, pitTargetSec: 44.5, status: 'COMPLETED' },
  { stintNumber: 3, driver: 'K. Kobayashi', laps: 24, avgPace: '3:22.450', avgPaceSec: 202.45, h2BurnPerLap: 0.539, tireWearPct: 22.0, capHealthPct: 99.8, energyDeltaPct: -0.5, pitTargetSec: 41.8, status: 'COMPLETED' },
  { stintNumber: 4, driver: 'K. Kobayashi', laps: 24, avgPace: '3:22.890', avgPaceSec: 202.89, h2BurnPerLap: 0.545, tireWearPct: 41.5, capHealthPct: 99.7, energyDeltaPct: -1.3, pitTargetSec: 43.0, status: 'COMPLETED' },
  { stintNumber: 5, driver: 'M. Conway', laps: 25, avgPace: '3:23.120', avgPaceSec: 203.12, h2BurnPerLap: 0.551, tireWearPct: 24.0, capHealthPct: 99.6, energyDeltaPct: -1.7, pitTargetSec: 42.5, status: 'COMPLETED' },
  { stintNumber: 6, driver: 'M. Conway', laps: 23, avgPace: '3:24.050', avgPaceSec: 204.05, h2BurnPerLap: 0.558, tireWearPct: 46.0, capHealthPct: 99.5, energyDeltaPct: -2.1, pitTargetSec: 45.0, status: 'COMPLETED' },
  { stintNumber: 7, driver: 'S. Buemi', laps: 25, avgPace: '3:21.850', avgPaceSec: 201.85, h2BurnPerLap: 0.536, tireWearPct: 21.0, capHealthPct: 99.4, energyDeltaPct: -0.4, pitTargetSec: 41.2, status: 'COMPLETED' },
  { stintNumber: 8, driver: 'S. Buemi', laps: 25, avgPace: '3:22.030', avgPaceSec: 202.03, h2BurnPerLap: 0.540, tireWearPct: 43.5, capHealthPct: 99.3, energyDeltaPct: -0.9, pitTargetSec: 43.8, status: 'COMPLETED' },
  { stintNumber: 9, driver: 'K. Kobayashi', laps: 24, avgPace: '3:23.410', avgPaceSec: 203.41, h2BurnPerLap: 0.544, tireWearPct: 25.5, capHealthPct: 99.2, energyDeltaPct: -1.2, pitTargetSec: 42.0, status: 'COMPLETED' },
  { stintNumber: 10, driver: 'K. Kobayashi', laps: 24, avgPace: '3:23.780', avgPaceSec: 203.78, h2BurnPerLap: 0.549, tireWearPct: 48.0, capHealthPct: 99.1, energyDeltaPct: -1.6, pitTargetSec: 44.0, status: 'COMPLETED' },
  { stintNumber: 11, driver: 'M. Conway', laps: 26, avgPace: '3:22.650', avgPaceSec: 202.65, h2BurnPerLap: 0.538, tireWearPct: 22.5, capHealthPct: 99.0, energyDeltaPct: -0.7, pitTargetSec: 41.5, status: 'COMPLETED' },
  { stintNumber: 12, driver: 'M. Conway', laps: 24, avgPace: '3:24.300', avgPaceSec: 204.30, h2BurnPerLap: 0.562, tireWearPct: 49.0, capHealthPct: 98.9, energyDeltaPct: -2.4, pitTargetSec: 46.2, status: 'COMPLETED' },
  { stintNumber: 13, driver: 'S. Buemi', laps: 25, avgPace: '3:22.210', avgPaceSec: 202.21, h2BurnPerLap: 0.541, tireWearPct: 23.0, capHealthPct: 98.8, energyDeltaPct: -0.9, pitTargetSec: 42.1, status: 'COMPLETED' },
  { stintNumber: 14, driver: 'S. Buemi', laps: 25, avgPace: '3:22.540', avgPaceSec: 202.54, h2BurnPerLap: 0.546, tireWearPct: 45.5, capHealthPct: 98.7, energyDeltaPct: -1.3, pitTargetSec: 43.4, status: 'COMPLETED' },
  { stintNumber: 15, driver: 'K. Kobayashi', laps: 25, avgPace: '3:21.990', avgPaceSec: 201.99, h2BurnPerLap: 0.539, tireWearPct: 26.0, capHealthPct: 98.6, energyDeltaPct: -0.6, pitTargetSec: 41.9, status: 'COMPLETED' },
  { stintNumber: 16, driver: 'K. Kobayashi', laps: 18, avgPace: '3:21.412', avgPaceSec: 201.41, h2BurnPerLap: 0.535, tireWearPct: 31.2, capHealthPct: 98.5, energyDeltaPct: -1.4, pitTargetSec: 42.0, status: 'IN_PROGRESS' },
];

const INITIAL_EVENTS: PitEvent[] = [
  { id: 'ev-1', timestamp: '03:47:30', stint: 16, type: 'CRYO_VENT_RELIEF', severity: 'INFO', message: 'Cryo-venturi pressure stabilization valve actuated at 700.5 bar. Thermal target maintained at 20.35 K.' },
  { id: 'ev-2', timestamp: '03:48:45', stint: 16, type: 'OVERTAKE_BOOST', severity: 'OPERATIONAL', message: 'Driver Kobayashi keyed Megacap Burst (600 kW) through Mulsanne Kink. Axle flux peaked at 592 kW.' },
  { id: 'ev-3', timestamp: '03:49:20', stint: 16, type: 'STACK_PURGE', severity: 'INFO', message: 'Cathode moisture purge cycle completed. Membrane relative humidity normalized to 88.5%.' },
  { id: 'ev-4', timestamp: '03:50:10', stint: 16, type: 'MGU_K_REGEN', severity: 'INFO', message: 'Indianapolis braking zone kinetic harvest reached -584 kW peak regeneration at 798 V bus.' },
  { id: 'ev-5', timestamp: '03:50:50', stint: 16, type: 'BOILOFF_COOLER', severity: 'INFO', message: 'Stirling cryo-cooler re-liquefaction compressor active at 98% efficiency. Zero boil-off loss.' },
  { id: 'ev-6', timestamp: '03:51:15', stint: 16, type: 'EIS_IMPEDANCE', severity: 'INFO', message: 'High-frequency EIS sweep confirms membrane resistance at 14.2 mΩ-cm². Zero cell flooding.' },
  { id: 'ev-7', timestamp: '03:51:40', stint: 16, type: 'PIT_WINDOW', severity: 'WARNING', message: 'Pit window opening in 4 laps. Current H2 remaining: 4.82 kg. Target turnaround: 42.0s.' },
  { id: 'ev-8', timestamp: '03:52:05', stint: 16, type: 'FIA_BEACON', severity: 'OPERATIONAL', message: 'FIA race direction telemetry handshake verified. All power boundaries within homologation tolerances.' },
];

export default function HydraEnduranceDeck() {
  // --- Simulation State ---
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [chassis, setChassis] = useState<'PROTO-11' | 'PROTO-10'>('PROTO-11');
  const [activeTab, setActiveTab] = useState<'COCKPIT HUD' | 'CRYO H2 & STACK' | 'SUPERCAPACITOR BUS' | '24H STINT LEDGER' | 'SYSTEM LOGS'>('COCKPIT HUD');
  const [stintMode, setStintMode] = useState<StintMode>('24H ENDURANCE CRUISE');
  const [overtakeBoost, setOvertakeBoost] = useState<boolean>(false);
  const [boostTimer, setBoostTimer] = useState<number>(0);

  // Live dynamic physics telemetry
  const [speed, setSpeed] = useState<number>(338.4);
  const [stackKw, setStackKw] = useState<number>(420.5);
  const [supercapSoc, setSupercapSoc] = useState<number>(92.4);
  const [supercapKw, setSupercapKw] = useState<number>(145.0); // instant power (+ boost, - regen)
  const [tankPressureBar, setTankPressureBar] = useState<number>(700.2);
  const [tankTempK, setTankTempK] = useState<number>(20.35);
  const [h2MassKg, setH2MassKg] = useState<number>(4.82);
  const [anodeFlow, setAnodeFlow] = useState<number>(4.85); // g/s
  const [cathodeFlow, setCathodeFlow] = useState<number>(38.8); // g/s
  const [waterExhaust, setWaterExhaust] = useState<number>(43.2); // mL/s
  const [energyDelta, setEnergyDelta] = useState<number>(-1.4);
  const [boiloffReliefActive, setBoiloffReliefActive] = useState<boolean>(false);
  const [frontRotorTemp, setFrontRotorTemp] = useState<number>(740);
  const [rearRotorTemp, setRearRotorTemp] = useState<number>(780);
  const [membraneHumidity, setMembraneHumidity] = useState<number>(88.5);
  const [events, setEvents] = useState<PitEvent[]>(INITIAL_EVENTS);
  const [stints] = useState<StintRecord[]>(INITIAL_STINTS);

  // Interactive Modals
  const [activeModal, setActiveModal] = useState<'BALANCE' | 'PRECHARGE' | 'VENT' | 'INSPECTION' | null>(null);
  const [inspectionTarget, setInspectionTarget] = useState<string>('');
  const [modalActionState, setModalActionState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animation cycle counter for SVG visuals
  const [tick, setTick] = useState<number>(0);

  // Track phase simulation (Straight vs Braking vs Corner vs Acceleration)
  const phaseRef = useRef<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // --- Real-time Simulation Loop ---
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 360);
      phaseRef.current = (phaseRef.current + 0.05 * simSpeed) % (Math.PI * 2);

      const sinVal = Math.sin(phaseRef.current);
      const cosVal = Math.cos(phaseRef.current);

      // Speed oscillation simulating Le Mans circuit (Mulsanne straights vs chicanes & Indianapolis)
      let baseSpeed = 260 + sinVal * 75 + cosVal * 15;
      if (overtakeBoost) {
        baseSpeed = Math.min(352.0, baseSpeed + 28);
      }
      setSpeed(Number(baseSpeed.toFixed(1)));

      // Supercapacitor & Axle Flux calculation
      if (overtakeBoost) {
        setSupercapKw(580 + Math.random() * 20); // Massive discharge +600 kW
        setSupercapSoc((prev) => Math.max(12, Number((prev - 0.45 * simSpeed).toFixed(2))));
        setStackKw(445.0 + Math.random() * 4.5);
        setFrontRotorTemp((prev) => Math.min(845, prev + 1.2));
        setRearRotorTemp((prev) => Math.min(850, prev + 1.4));
      } else if (sinVal < -0.3) {
        // Heavy braking zone: Heavy kinetic regeneration harvest (-350 to -590 kW)
        const regenPower = -420 + sinVal * 160 + (Math.random() * 15 - 7.5);
        setSupercapKw(Number(Math.max(-600, regenPower).toFixed(1)));
        setSupercapSoc((prev) => Math.min(99.5, Number((prev + 0.35 * simSpeed).toFixed(2))));
        setFrontRotorTemp((prev) => Math.min(840, prev + 2.5));
        setRearRotorTemp((prev) => Math.min(840, prev + 2.1));
      } else {
        // Normal acceleration / cruising
        const drawPower = 120 + sinVal * 140;
        setSupercapKw(Number(drawPower.toFixed(1)));
        setSupercapSoc((prev) => Math.max(25, Number((prev - 0.08 * simSpeed).toFixed(2))));
        setFrontRotorTemp((prev) => Math.max(620, prev - 1.1));
        setRearRotorTemp((prev) => Math.max(640, prev - 1.0));
      }

      // Fuel cell stack power
      let targetStack = 410 + sinVal * 25;
      if (stintMode === 'ATTACK QUALI') targetStack += 25;
      if (stintMode === 'RAIN REGEN BIAS') targetStack -= 35;
      setStackKw(Number(Math.min(450, Math.max(280, targetStack)).toFixed(1)));

      // Mass flows & Exhaust
      const currentStack = targetStack;
      const calculatedAnode = Number((currentStack * 0.0116).toFixed(2)); // ~4.85 g/s at 420 kW
      setAnodeFlow(calculatedAnode);
      setCathodeFlow(Number((calculatedAnode * 8.0).toFixed(1)));
      setWaterExhaust(Number((calculatedAnode * 8.9).toFixed(1)));

      // Tank depletion & pressure fluctuation
      setH2MassKg((prev) => Math.max(0.2, Number((prev - (calculatedAnode / 1000) * 0.05 * simSpeed).toFixed(3))));
      setTankPressureBar((prev) => {
        const jitter = (Math.random() - 0.5) * 0.15;
        const p = Number((prev + jitter).toFixed(1));
        return Math.min(702, Math.max(692, p));
      });

      // Tank temperature micro-variations around 20.35 K
      setTankTempK(Number((20.35 + (Math.random() - 0.5) * 0.04).toFixed(2)));

      // Boil-off relief indicator
      setBoiloffReliefActive(Math.random() > 0.88);

      // Membrane humidity
      setMembraneHumidity(Number((88.5 + sinVal * 1.5).toFixed(1)));

      // Energy Delta
      setEnergyDelta(Number((-1.4 + sinVal * 0.3).toFixed(1)));
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed, overtakeBoost, stintMode]);

  // Overtake boost timer countdown
  useEffect(() => {
    if (!overtakeBoost) return;
    const t = setInterval(() => {
      setBoostTimer((prev) => {
        if (prev <= 1) {
          setOvertakeBoost(false);
          showToast('MEGACAP OVERTAKE BOOST EXHAUSTED // RE-ENGAGING ENERGY REGENERATION');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [overtakeBoost]);

  const triggerOvertakeBoost = () => {
    if (overtakeBoost) {
      setOvertakeBoost(false);
      setBoostTimer(0);
      showToast('MEGACAP OVERTAKE BOOST DISENGAGED');
    } else {
      setOvertakeBoost(true);
      setBoostTimer(8);
      showToast('MEGACAP BURST ARMED // 600 kW HIGH-VOLTAGE AXLE FLUX ENGAGED');
      const newEv: PitEvent = {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        stint: 16,
        type: 'OVERTAKE_BOOST',
        severity: 'OPERATIONAL',
        message: 'Driver keyed 600 kW Megacap Burst through sector. Dual MGU-K flux peak.'
      };
      setEvents((prev) => [newEv, ...prev.slice(0, 19)]);
    }
  };

  // --- Handlers for Action Modals ---
  const handleBalanceStack = () => {
    setModalActionState('PROCESSING');
    setTimeout(() => {
      setModalActionState('SUCCESS');
      showToast('PEM FUEL-CELL STACK BALANCED // CELL IMPEDANCE UNIFORM AT 14.1 mΩ');
      setTimeout(() => {
        setActiveModal(null);
        setModalActionState('IDLE');
      }, 1400);
    }, 1800);
  };

  const handlePrechargeCaps = () => {
    setModalActionState('PROCESSING');
    setTimeout(() => {
      setSupercapSoc(99.2);
      setModalActionState('SUCCESS');
      showToast('800V GRAPHENE SUPERCAPACITOR BUS PRE-CHARGED TO 99.2% SOC');
      setTimeout(() => {
        setActiveModal(null);
        setModalActionState('IDLE');
      }, 1400);
    }, 1800);
  };

  const handleVentCryo = () => {
    setModalActionState('PROCESSING');
    setTimeout(() => {
      setTankPressureBar(695.0);
      setModalActionState('SUCCESS');
      showToast('CRYO VENTURI PURGED // PRESSURE STABILIZED TO 695.0 BAR AT 20.30 K');
      setTimeout(() => {
        setActiveModal(null);
        setModalActionState('IDLE');
      }, 1400);
    }, 1800);
  };

  const handleExportCSV = () => {
    const headers = 'Stint,Driver,Laps,AvgPace,AvgPaceSec,H2BurnKgPerLap,TireWearPct,CapHealthPct,EnergyDeltaPct,PitTargetSec,Status\n';
    const rows = stints
      .map(
        (s) =>
          `${s.stintNumber},"${s.driver}",${s.laps},"${s.avgPace}",${s.avgPaceSec},${s.h2BurnPerLap},${s.tireWearPct},${s.capHealthPct},${s.energyDeltaPct},${s.pitTargetSec},"${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HYDRA_PROTO11_LEMANS24_STINTS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('FIA HOMOLOGATED STINT CSV EXPORTED SUCCESSFULLY');
  };

  const openInspection = (componentName: string) => {
    setInspectionTarget(componentName);
    setActiveModal('INSPECTION');
  };

  // Axle calculation splits
  const frontAxleKw = supercapKw > 0 ? (supercapKw * 0.48).toFixed(1) : (supercapKw * 0.52).toFixed(1);
  const rearAxleKw = supercapKw > 0 ? (supercapKw * 0.52).toFixed(1) : (supercapKw * 0.48).toFixed(1);

  return (
    <>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono selection:bg-sky-500 selection:text-white">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded bg-sky-950/90 border border-sky-400 text-sky-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse shrink-0" />
            <span className="text-xs md:text-sm font-bold tracking-wider">{toastMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 1. TOP HEADER & OPERATIONAL TELEMETRY HUD                      */}
        {/* ------------------------------------------------------------- */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-40 backdrop-blur-md">
          {/* Main Flight-Deck Banner */}
          <div className="max-w-[1720px] mx-auto px-4 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Chassis Beacon & Big Flight-Deck Title */}
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              {/* Telemetry Status Beacon */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold tracking-wider text-slate-300">
                  {isRunning ? 'LIVE 2.4GHz FIA BEACON' : 'SIMULATION PAUSED'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-sky-400 font-bold">24H STINT 16/24</span>
              </div>

              {/* Chassis Selector Pill */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setChassis('PROTO-11')}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                    chassis === 'PROTO-11' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PROTO-11 (RACE)
                </button>
                <button
                  type="button"
                  onClick={() => setChassis('PROTO-10')}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                    chassis === 'PROTO-10' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PROTO-10 (DYNO)
                </button>
              </div>

              {/* Primary Large Title */}
              <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 uppercase truncate">
                HYDRA LE MANS-24 // LIQUID H2 FUEL-CELL HYPERCAR {chassis}
              </h1>
            </div>

            {/* Right: Simulation Controls & Megacap Overtake Boost */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Sim Run/Pause Toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded h-9 px-1">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded transition-colors ${
                    isRunning ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'ACTIVE' : 'HOLD'}</span>
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                {/* Sim Speed Selectors */}
                <button
                  type="button"
                  onClick={() => setSimSpeed(1)}
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    simSpeed === 1 ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1X
                </button>
                <button
                  type="button"
                  onClick={() => setSimSpeed(5)}
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    simSpeed === 5 ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  5X
                </button>
              </div>

              {/* Master Keyed Overtake Boost Toggle */}
              <button
                type="button"
                onClick={triggerOvertakeBoost}
                className={`flex items-center gap-2 h-9 px-4 rounded border font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-lg ${
                  overtakeBoost
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-850 text-amber-400 border-amber-500/50 hover:border-amber-400'
                }`}
              >
                <Zap className={`w-4 h-4 ${overtakeBoost ? 'fill-current' : ''}`} />
                <span>
                  {overtakeBoost ? `MEGACAP BURST ACTIVE (${boostTimer}s)` : 'ARM OVERTAKE BOOST (600kW)'}
                </span>
              </button>
            </div>
          </div>

          {/* Top HUD Telemetry Strip - 5 Massive Metrics */}
          <div className="bg-[#070B12] border-t border-slate-800/80">
            <div className="max-w-[1720px] mx-auto px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Metric 1: Ground Speed */}
              <div className="bg-[#0B0F17] p-3.5 rounded border border-slate-800 hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    GROUND SPEED
                  </span>
                  <Gauge className="w-4 h-4 text-sky-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-sky-400">
                    {speed.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">KM/H</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>GEAR 7 · 18,420 RPM</span>
                  <span className="text-emerald-400 font-semibold">MULSANNE S2</span>
                </div>
              </div>

              {/* Metric 2: Fuel Cell Stack Output */}
              <div className="bg-[#0B0F17] p-3.5 rounded border border-slate-800 hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    PEM STACK OUTPUT
                  </span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-sky-400">
                    {stackKw.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">KW</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>EFFICIENCY: 58.4%</span>
                  <span className="text-sky-300 font-semibold">800V DC BUS</span>
                </div>
              </div>

              {/* Metric 3: Supercapacitor SOC */}
              <div className="bg-[#0B0F17] p-3.5 rounded border border-slate-800 hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    SUPERCAP SOC
                  </span>
                  <Zap className={`w-4 h-4 ${overtakeBoost ? 'text-amber-400 animate-bounce' : 'text-sky-400'}`} />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-3xl md:text-4xl font-black font-mono tabular-nums ${overtakeBoost ? 'text-amber-400' : 'text-sky-400'}`}>
                    {supercapSoc.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">804 V</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>FLUX: {supercapKw >= 0 ? `+${supercapKw.toFixed(0)} kW` : `${supercapKw.toFixed(0)} kW`}</span>
                  <span className={supercapKw < 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {supercapKw < 0 ? 'REGEN HARVEST' : 'AXLE DISCHARGE'}
                  </span>
                </div>
              </div>

              {/* Metric 4: Liquid H2 Tank Pressure & Cryo Temp */}
              <div className="bg-[#0B0F17] p-3.5 rounded border border-slate-800 hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    CRYO H2 PRESSURE
                  </span>
                  <Droplets className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-sky-400">
                    {tankPressureBar.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">BAR</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-cyan-300 font-bold">{tankTempK.toFixed(2)} K (CRYO)</span>
                  <span className="text-slate-300 font-bold">{h2MassKg.toFixed(2)} / 14.5 KG</span>
                </div>
              </div>

              {/* Metric 5: Stint Energy Delta */}
              <div className="bg-[#0B0F17] p-3.5 rounded border border-slate-800 hover:border-sky-500/50 transition-colors col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    STINT DELTA
                  </span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-emerald-400">
                    {energyDelta.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase">AHEAD</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>PIT WINDOW: LAP 22</span>
                  <span className="text-emerald-400 font-semibold">TGT 42.0s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Tab Bar inside Horizontal Overflow Wrapper with scrollbar-none */}
          <div className="border-t border-slate-800 bg-[#090D15]">
            <div className="max-w-[1720px] mx-auto px-4 overflow-x-auto scrollbar-none">
              <nav className="flex items-center space-x-1 py-1.5 min-w-max">
                {(['COCKPIT HUD', 'CRYO H2 & STACK', 'SUPERCAPACITOR BUS', '24H STINT LEDGER', 'SYSTEM LOGS'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-colors ${
                      activeTab === tab
                        ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* MAIN OPERATIONS DECK BODY                                     */}
        {/* ------------------------------------------------------------- */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 space-y-4">
          {/* TAB 1: COCKPIT HUD (Unified 4-Pane Overview) */}
          {(activeTab === 'COCKPIT HUD' || activeTab === 'CRYO H2 & STACK' || activeTab === 'SUPERCAPACITOR BUS') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CENTER-LEFT: 2D Interactive Cryo-H2 Storage & Stack Canvas (7 cols) */}
              <section className={`${activeTab === 'CRYO H2 & STACK' ? 'lg:col-span-12' : activeTab === 'SUPERCAPACITOR BUS' ? 'hidden' : 'lg:col-span-7'} bg-[#0B0F17] rounded border border-slate-800 p-4 flex flex-col justify-between`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      CRYO-H2 STORAGE &amp; FUEL-CELL CHASSIS TOPOGRAPHY
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">RE-LIQUEFACTION COMPRESSOR:</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE (98.4%)
                    </span>
                  </div>
                </div>

                {/* Clickable Stint Mode Selector */}
                <div className="my-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['24H ENDURANCE CRUISE', 'ATTACK QUALI', 'RAIN REGEN BIAS', 'H2 PURGE & VENT'] as StintMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setStintMode(mode);
                        showToast(`STINT MODE SET: ${mode}`);
                      }}
                      className={`p-2.5 text-center rounded border transition-all ${
                        stintMode === mode
                          ? 'bg-sky-950/80 border-sky-400 text-sky-300 font-bold shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase tracking-wider">{mode}</div>
                    </button>
                  ))}
                </div>

                {/* Interactive Top-Down SVG Chassis Schematic */}
                <div className="relative bg-[#050810] border border-slate-800/90 rounded-lg p-4 overflow-hidden flex items-center justify-center min-h-[360px]">
                  <div className="absolute top-2 left-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    INTERACTIVE CHASSIS MAP · CLICK SUBSYSTEM FOR TELEMETRY INSPECTION
                  </div>

                  <svg
                    viewBox="0 0 800 400"
                    className="w-full h-auto max-h-[380px] select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Gradients */}
                      <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B132B" />
                        <stop offset="50%" stopColor="#1C2541" />
                        <stop offset="100%" stopColor="#0B132B" />
                      </linearGradient>

                      <linearGradient id="cryoTankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0284C7" />
                        <stop offset="50%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0369A1" />
                      </linearGradient>

                      <linearGradient id="stackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EA580C" />
                        <stop offset="50%" stopColor="#F97316" />
                        <stop offset="100%" stopColor="#C2410C" />
                      </linearGradient>

                      <linearGradient id="supercapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>

                      {/* Carbon fiber grid pattern */}
                      <pattern id="carbonGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="10" y2="10" stroke="#1E293B" strokeWidth="0.8" />
                        <line x1="10" y1="0" x2="0" y2="10" stroke="#1E293B" strokeWidth="0.8" />
                      </pattern>
                    </defs>

                    {/* Outer Reference Race Track Grid */}
                    <rect x="0" y="0" width="800" height="400" fill="#030712" />
                    <rect x="0" y="0" width="800" height="400" fill="url(#carbonGrid)" opacity="0.4" />

                    {/* Front Aero Splitter */}
                    <path
                      d="M 60,140 L 100,100 L 140,100 L 140,300 L 100,300 L 60,260 Z"
                      fill="#0F172A"
                      stroke="#334155"
                      strokeWidth="2"
                    />

                    {/* Main Hypercar Cockpit & Chassis Silhouette */}
                    <path
                      d="M 120,110 Q 300,85 540,95 Q 680,105 740,140 L 740,260 Q 680,295 540,305 Q 300,315 120,290 Z"
                      fill="url(#chassisGrad)"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="cursor-pointer"
                      onClick={() => openInspection('AERODYNAMIC CARBON CHASSIS PROTO-11')}
                    />

                    {/* Cockpit Canopy */}
                    <ellipse
                      cx="320"
                      cy="200"
                      rx="85"
                      ry="45"
                      fill="#030712"
                      stroke="#475569"
                      strokeWidth="2"
                      className="cursor-pointer hover:stroke-sky-400"
                      onClick={() => openInspection('COCKPIT & DRIVER CELL (FIA APPROVED)')}
                    />
                    <text x="320" y="205" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">
                      COCKPIT · DRIVER
                    </text>

                    {/* FRONT AXLE MGU-K & BRAKES */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('FRONT AXLE MGU-K & CARBON-CERAMIC BRAKE MATRIX')}
                    >
                      {/* Left Front Wheel */}
                      <rect x="170" y="55" width="70" height="35" rx="5" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      {/* Right Front Wheel */}
                      <rect x="170" y="310" width="70" height="35" rx="5" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      {/* Front Motor MGU-K Generator */}
                      <rect x="185" y="170" width="40" height="60" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="205" y1="90" x2="205" y2="170" stroke="#38BDF8" strokeWidth="3" />
                      <line x1="205" y1="230" x2="205" y2="310" stroke="#38BDF8" strokeWidth="3" />
                      <text x="205" y="205" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="bold">
                        MGU-F
                      </text>
                    </g>

                    {/* REAR AXLE DUAL MGU-K & DIFFUSER */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('REAR AXLE DUAL MGU-K & ELECTRIC TORQUE VECTORING')}
                    >
                      {/* Left Rear Wheel */}
                      <rect x="620" y="55" width="75" height="38" rx="5" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      {/* Right Rear Wheel */}
                      <rect x="620" y="307" width="75" height="38" rx="5" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      {/* Rear MGU-K Unit */}
                      <rect x="635" y="165" width="45" height="70" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="657" y1="93" x2="657" y2="165" stroke="#38BDF8" strokeWidth="3" />
                      <line x1="657" y1="235" x2="657" y2="307" stroke="#38BDF8" strokeWidth="3" />
                      <text x="657" y="205" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="bold">
                        MGU-R
                      </text>
                    </g>

                    {/* TWIN 700-BAR CRYOGENIC H2 STORAGE TANKS (Mid-chassis flanking) */}
                    {/* Tank 1 (Port) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('PORT 700-BAR CRYO-H2 TANK (CARBON FIBER TYPE-IV)')}
                    >
                      <rect
                        x="425"
                        y="105"
                        width="110"
                        height="40"
                        rx="12"
                        fill="url(#cryoTankGrad)"
                        stroke="#7DD3FC"
                        strokeWidth="2"
                        className="group-hover:stroke-white"
                      />
                      <text x="480" y="129" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                        H2 TANK 1 (PORT)
                      </text>
                    </g>

                    {/* Tank 2 (Starboard) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('STARBOARD 700-BAR CRYO-H2 TANK (CARBON FIBER TYPE-IV)')}
                    >
                      <rect
                        x="425"
                        y="255"
                        width="110"
                        height="40"
                        rx="12"
                        fill="url(#cryoTankGrad)"
                        stroke="#7DD3FC"
                        strokeWidth="2"
                        className="group-hover:stroke-white"
                      />
                      <text x="480" y="279" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                        H2 TANK 2 (STBD)
                      </text>
                    </g>

                    {/* PEM FUEL CELL CORE STACK (Center-aft) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('PEM FUEL CELL 450 kW STACK MATRIX')}
                    >
                      <rect
                        x="430"
                        y="160"
                        width="95"
                        height="80"
                        rx="6"
                        fill="url(#stackGrad)"
                        stroke="#FDBA74"
                        strokeWidth="2.5"
                        className="group-hover:stroke-white animate-pulse"
                      />
                      <text x="477" y="195" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
                        PEM STACK
                      </text>
                      <text x="477" y="215" textAnchor="middle" fill="#FEF08A" fontSize="10" fontWeight="bold">
                        {stackKw.toFixed(0)} kW
                      </text>
                    </g>

                    {/* 800V GRAPHENE SUPERCAPACITOR BUFFER (Forward center) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => openInspection('800V GRAPHENE SUPERCAPACITOR BUFFER (600 kW BURST)')}
                    >
                      <rect
                        x="245"
                        y="170"
                        width="50"
                        height="60"
                        rx="5"
                        fill="url(#supercapGrad)"
                        stroke="#FDE047"
                        strokeWidth="2"
                        className="group-hover:stroke-white"
                      />
                      <text x="270" y="198" textAnchor="middle" fill="#0B0F17" fontSize="9" fontWeight="900">
                        SUPERCAP
                      </text>
                      <text x="270" y="215" textAnchor="middle" fill="#0B0F17" fontSize="9" fontWeight="bold">
                        {supercapSoc.toFixed(0)}%
                      </text>
                    </g>

                    {/* Fuel lines from tanks to stack */}
                    <path d="M 480,145 L 480,160" stroke="#38BDF8" strokeWidth="3" strokeDasharray="3 2" />
                    <path d="M 480,255 L 480,240" stroke="#38BDF8" strokeWidth="3" strokeDasharray="3 2" />

                    {/* Exhaust Water Vapor Jets (Rearward) */}
                    <g opacity={isRunning ? 0.9 : 0.3}>
                      <circle cx={745 + (tick % 25)} cy="180" r="4" fill="#38BDF8" opacity="0.6" />
                      <circle cx={755 + (tick % 25)} cy="190" r="6" fill="#7DD3FC" opacity="0.4" />
                      <circle cx={765 + (tick % 25)} cy="200" r="8" fill="#BAE6FD" opacity="0.3" />
                      <circle cx={755 + (tick % 25)} cy="210" r="6" fill="#7DD3FC" opacity="0.4" />
                      <circle cx={745 + (tick % 25)} cy="220" r="4" fill="#38BDF8" opacity="0.6" />
                      <text x="745" y="240" fill="#38BDF8" fontSize="9" fontWeight="bold">
                        H2O VAPOR
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Subsystem Telemetry Bar underneath schematic */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <span className="text-slate-400 block font-bold">ANODE H2 FLOW</span>
                    <span className="text-sky-400 font-bold text-sm">{anodeFlow} g/s</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <span className="text-slate-400 block font-bold">CATHODE AIR FLOW</span>
                    <span className="text-sky-400 font-bold text-sm">{cathodeFlow} g/s</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <span className="text-slate-400 block font-bold">EXHAUST H2O RATE</span>
                    <span className="text-emerald-400 font-bold text-sm">{waterExhaust} mL/s</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <span className="text-slate-400 block font-bold">BOIL-OFF RELIEF</span>
                    <span className={`font-bold text-sm ${boiloffReliefActive ? 'text-amber-400' : 'text-slate-400'}`}>
                      {boiloffReliefActive ? 'VENT STABILIZED' : 'CLOSED / RELIQ'}
                    </span>
                  </div>
                </div>
              </section>

              {/* CENTER-RIGHT: 800V Graphene Supercapacitor & Axle Flux Matrix (5 cols) */}
              <section className={`${activeTab === 'SUPERCAPACITOR BUS' ? 'lg:col-span-12' : activeTab === 'CRYO H2 & STACK' ? 'hidden' : 'lg:col-span-5'} bg-[#0B0F17] rounded border border-slate-800 p-4 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                        800V SUPERCAP &amp; AXLE FLUX MATRIX
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      GRAPHENE 800V
                    </span>
                  </div>

                  {/* Instant Charge / Discharge Bipolar Flux Meter */}
                  <div className="mt-4 p-3.5 rounded bg-[#070B12] border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-400 flex items-center gap-1">
                        ◀ MAX REGEN (-600 kW)
                      </span>
                      <span className="text-slate-300 font-mono">
                        INSTANT FLUX: <span className={supercapKw >= 0 ? 'text-amber-400 font-black' : 'text-emerald-400 font-black'}>
                          {supercapKw >= 0 ? `+${supercapKw.toFixed(1)} kW` : `${supercapKw.toFixed(1)} kW`}
                        </span>
                      </span>
                      <span className="text-amber-400 flex items-center gap-1">
                        MAX BOOST (+600 kW) ▶
                      </span>
                    </div>

                    {/* Dual directional bar */}
                    <div className="mt-2.5 h-6 bg-slate-900 rounded overflow-hidden relative flex">
                      {/* Left half: Regen (negative power) */}
                      <div className="w-1/2 flex justify-end bg-slate-950 border-r border-slate-700">
                        {supercapKw < 0 && (
                          <div
                            className="h-full bg-gradient-to-l from-emerald-500 to-cyan-400 transition-all duration-150"
                            style={{ width: `${Math.min(100, (Math.abs(supercapKw) / 600) * 100)}%` }}
                          />
                        )}
                      </div>

                      {/* Right half: Boost (positive power) */}
                      <div className="w-1/2 bg-slate-950">
                        {supercapKw > 0 && (
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
                            style={{ width: `${Math.min(100, (supercapKw / 600) * 100)}%` }}
                          />
                        )}
                      </div>

                      {/* Zero Center Notch */}
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-0.5 w-1 bg-white shadow-sm" />
                    </div>

                    <div className="mt-1.5 flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>-600 kW</span>
                      <span>-300 kW</span>
                      <span className="text-slate-300 font-bold">0 kW</span>
                      <span>+300 kW</span>
                      <span>+600 kW</span>
                    </div>
                  </div>

                  {/* Dual MGU-K Axle Splits */}
                  <div className="mt-3.5 grid grid-cols-2 gap-3">
                    {/* Front Axle */}
                    <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>FRONT AXLE (MGU-F)</span>
                        <span className="text-sky-400">48% SPLIT</span>
                      </div>
                      <div className="mt-2 text-xl font-bold font-mono text-slate-100">
                        {frontAxleKw} <span className="text-xs font-normal text-slate-400">kW</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">CARBON ROTOR:</span>
                        <span className={`font-bold font-mono ${frontRotorTemp > 800 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {frontRotorTemp.toFixed(0)}°C
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                        <div
                          className="bg-sky-400 h-full transition-all"
                          style={{ width: `${(frontRotorTemp / 900) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Rear Axle */}
                    <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>REAR AXLE (MGU-R)</span>
                        <span className="text-sky-400">52% SPLIT</span>
                      </div>
                      <div className="mt-2 text-xl font-bold font-mono text-slate-100">
                        {rearAxleKw} <span className="text-xs font-normal text-slate-400">kW</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">CARBON ROTOR:</span>
                        <span className={`font-bold font-mono ${rearRotorTemp > 800 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {rearRotorTemp.toFixed(0)}°C
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all"
                          style={{ width: `${(rearRotorTemp / 900) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PEM Fuel Cell Membrane & Thermal Balance */}
                  <div className="mt-3.5 p-3 bg-slate-900/40 rounded border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300 block">
                      PEM MEMBRANE &amp; STOICHIOMETRY INTEGRITY
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">MEMBRANE RH</span>
                        <span className="text-slate-200 font-bold font-mono text-sm">{membraneHumidity}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">STOICHIOMETRY</span>
                        <span className="text-slate-200 font-bold font-mono text-sm">λ = 1.82</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">COOLANT LOOP</span>
                        <span className="text-emerald-400 font-bold font-mono text-sm">74.2°C (Δ 5.8)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Diagnostics Actions Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal('BALANCE');
                      setModalActionState('IDLE');
                    }}
                    className="flex-1 min-w-[130px] px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    BALANCE CELL STACK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal('PRECHARGE');
                      setModalActionState('IDLE');
                    }}
                    className="flex-1 min-w-[130px] px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 transition-colors"
                  >
                    PRE-CHARGE CAPS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal('VENT');
                      setModalActionState('IDLE');
                    }}
                    className="flex-1 min-w-[130px] px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 transition-colors"
                  >
                    VENT CRYO VENTURI
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2 & 4: BOTTOM 24-HOUR STINT DEGRADATION & PIT STRATEGY LEDGER */}
          {(activeTab === 'COCKPIT HUD' || activeTab === '24H STINT LEDGER') && (
            <section className="bg-[#0B0F17] rounded border border-slate-800 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    24-HOUR STINT DEGRADATION &amp; PIT STRATEGY LEDGER (STINTS 1–16)
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-400 font-bold hidden sm:inline">
                    FIA ACCREDITED TELEMETRY SYNC
                  </span>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT FIA STINT CSV</span>
                  </button>
                </div>
              </div>

              {/* High-Contrast Data Density Table with py-3.5 px-3 and border-slate-800 */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/70 text-slate-300 text-xs md:text-sm font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">STINT #</th>
                      <th className="py-3 px-3">DRIVER</th>
                      <th className="py-3 px-3">LAPS</th>
                      <th className="py-3 px-3">AVG PACE</th>
                      <th className="py-3 px-3">H2 BURN (KG/LAP)</th>
                      <th className="py-3 px-3">TIRE DEGRAD</th>
                      <th className="py-3 px-3">SUPERCAP SOH</th>
                      <th className="py-3 px-3">ENERGY DELTA</th>
                      <th className="py-3 px-3">PIT TARGET</th>
                      <th className="py-3 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs md:text-sm font-mono text-slate-200">
                    {stints.map((s) => (
                      <tr
                        key={s.stintNumber}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          s.status === 'IN_PROGRESS' ? 'bg-sky-950/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 font-bold text-slate-300">
                          #{s.stintNumber.toString().padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-100 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                          {s.driver}
                        </td>
                        <td className="py-3.5 px-3 tabular-nums">{s.laps} LAPS</td>
                        <td className="py-3.5 px-3 tabular-nums text-sky-400 font-bold">{s.avgPace}</td>
                        <td className="py-3.5 px-3 tabular-nums text-slate-300">{s.h2BurnPerLap.toFixed(3)} kg</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="tabular-nums">{s.tireWearPct.toFixed(1)}%</span>
                            <div className="w-16 bg-slate-800 h-1.5 rounded overflow-hidden hidden sm:block">
                              <div
                                className={`h-full ${
                                  s.tireWearPct > 40
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                                }`}
                                style={{ width: `${s.tireWearPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 tabular-nums text-emerald-400 font-semibold">
                          {s.capHealthPct.toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-3 tabular-nums font-bold text-emerald-400">
                          {s.energyDeltaPct > 0 ? `+${s.energyDeltaPct.toFixed(1)}%` : `${s.energyDeltaPct.toFixed(1)}%`}
                        </td>
                        <td className="py-3.5 px-3 tabular-nums text-slate-300">{s.pitTargetSec.toFixed(1)}s</td>
                        <td className="py-3.5 px-3 text-right">
                          {s.status === 'IN_PROGRESS' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950 border border-sky-400 text-sky-300 text-xs font-bold animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                              IN PROGRESS
                            </span>
                          ) : s.status === 'PIT_WINDOW' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950 border border-amber-400 text-amber-300 text-xs font-bold">
                              PIT WINDOW
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold">
                              COMPLETED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: SYSTEM LOGS & PIT STRATEGY DAEMON EVENTS */}
          {(activeTab === 'SYSTEM LOGS' || activeTab === 'COCKPIT HUD') && (
            <section className="bg-[#0B0F17] rounded border border-slate-800 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    REAL-TIME PIT STRATEGY DAEMON &amp; FIA HOMOLOGATION NOTICES
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  LOG STREAM · {events.length} EVENTS RECORDED
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-800/80 font-mono">
                {events.slice(0, activeTab === 'SYSTEM LOGS' ? 20 : 5).map((ev) => (
                  <div key={ev.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 shrink-0">{ev.timestamp}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                          ev.severity === 'CRITICAL'
                            ? 'bg-rose-950 border border-rose-500 text-rose-300'
                            : ev.severity === 'WARNING'
                            ? 'bg-amber-950 border border-amber-500 text-amber-300'
                            : ev.severity === 'OPERATIONAL'
                            ? 'bg-sky-950 border border-sky-500 text-sky-300'
                            : 'bg-slate-900 border border-slate-700 text-slate-300'
                        }`}
                      >
                        {ev.type}
                      </span>
                      <span className="text-xs md:text-sm text-slate-200">{ev.message}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-bold shrink-0">STINT {ev.stint}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE ACTION MODALS                                     */}
        {/* ------------------------------------------------------------- */}

        {/* Modal: Balance Cell Stack */}
        {activeModal === 'BALANCE' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0B0F17] border border-slate-700 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-bold font-mono text-slate-100 uppercase">BALANCE CELL STACK</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Initiate automated high-frequency Electrochemical Impedance Spectroscopy (EIS) sweep across all 480 PEM fuel-cell bipolar plates. Re-equilibrates cathode moisture gradient and equalizes stack sub-voltages.
              </p>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Stack Voltage:</span>
                  <span className="font-bold text-sky-400">804.2 V DC</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Plate Deviation:</span>
                  <span className="font-bold text-emerald-400">&lt; 3.2 mV (Nominal)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleBalanceStack}
                  disabled={modalActionState === 'PROCESSING'}
                  className="px-4 py-2 rounded text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-2"
                >
                  {modalActionState === 'PROCESSING' && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalActionState === 'PROCESSING' ? 'BALANCING...' : 'CONFIRM STACK BALANCE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Pre-Charge Caps */}
        {activeModal === 'PRECHARGE' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0B0F17] border border-amber-500/40 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold font-mono text-amber-400 uppercase">PRE-CHARGE SUPERCAPACITORS</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Command fuel-cell auxiliary DC-DC converter to pump energy into the 800V Graphene Supercapacitor pack, bringing State of Charge (SOC) to 99.2% for impending pit exit or overtake sequence.
              </p>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Current SOC:</span>
                  <span className="font-bold text-amber-400">{supercapSoc.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Target SOC:</span>
                  <span className="font-bold text-emerald-400">99.2% (Full Reserve)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handlePrechargeCaps}
                  disabled={modalActionState === 'PROCESSING'}
                  className="px-4 py-2 rounded text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2"
                >
                  {modalActionState === 'PROCESSING' && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalActionState === 'PROCESSING' ? 'CHARGING...' : 'EXECUTE PRE-CHARGE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Vent Cryo Venturi */}
        {activeModal === 'VENT' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0B0F17] border border-cyan-500/40 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold font-mono text-cyan-400 uppercase">VENT CRYO VENTURI</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Trigger manual actuation of the Stirling cryo-cooler venturi relief valve. Bleeds trace excess boil-off pressure and stabilizes twin 700-bar tanks to 695.0 bar target.
              </p>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Current Tank Pressure:</span>
                  <span className="font-bold text-cyan-400">{tankPressureBar.toFixed(1)} BAR</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cryo Target Temperature:</span>
                  <span className="font-bold text-slate-200">20.30 K (Liquid Phase)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleVentCryo}
                  disabled={modalActionState === 'PROCESSING'}
                  className="px-4 py-2 rounded text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2"
                >
                  {modalActionState === 'PROCESSING' && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalActionState === 'PROCESSING' ? 'PURGING...' : 'ACTUATE RELIEF VALVE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Chassis Subsystem Inspection */}
        {activeModal === 'INSPECTION' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0B0F17] border border-sky-500/50 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold font-mono text-slate-100 uppercase truncate">
                    {inspectionTarget}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono text-slate-300">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                  <span className="text-sky-400 font-bold block">SUBSYSTEM STATUS: NOMINAL</span>
                  <p>
                    Continuous fiber-optic Bragg grating sensors verify structural integrity, thermal boundaries, and galvanic isolation under extreme 3.8G cornering loads.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">VOLTAGE / PRESSURE:</span>
                    <span className="font-bold text-slate-100 text-sm">804 V / 700.2 BAR</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block">TEMPERATURE:</span>
                    <span className="font-bold text-emerald-400 text-sm">20.35 K CRYO / 74°C LOOP</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 uppercase"
                >
                  CLOSE INSPECTION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-800 py-3 bg-[#0B0F17] text-xs font-mono text-slate-300">
          <div className="max-w-[1720px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HYDRA ENDURANCE PROTOCOL // FIA LM-H2 REGULATIONS 2026</span>
            </div>
            <div>
              <span>CIRCUIT DE LA SARTHE · TRACK AMBIENT: 16.4°C · RELATIVE HUMIDITY: 62%</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
