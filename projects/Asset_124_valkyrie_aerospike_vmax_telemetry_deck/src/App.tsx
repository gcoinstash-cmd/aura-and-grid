/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Flame,
  Gauge,
  Zap,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Download,
  Thermometer,
  Activity,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  Cpu,
  Sliders,
  ChevronRight,
  X,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  FileSpreadsheet,
  ArrowUpRight,
  Database
} from 'lucide-react';

// ==============================================================================
// TYPES & TELEMETRY INTERFACES
// ==============================================================================

type BurnProfile = 'ELECTRIC_CRUISE' | 'TRANSONIC_BOOST' | 'VMAX_FULL_IGNITION' | 'PYRO_SHUTDOWN';

interface SectorTelemetry {
  sectorIndex: number;
  label: string;
  speedKmh: number;
  mach: number;
  aerospikeThrustKn: number;
  chamberPressBar: number;
  propellantFlowKgs: number;
  loxTankPct: number;
  ch4TankPct: number;
  parachuteArmed: boolean;
  parachuteDeployed: boolean;
  shockAngleDeg: number;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
}

interface VehicleProfile {
  id: string;
  chassisCode: string;
  name: string;
  callsign: string;
  massKg: number;
  aerodynamicCd: number;
  maxRocketKn: number;
  maxElectricKw: number;
}

const VEHICLES: VehicleProfile[] = [
  {
    id: 'VH-PROTO-15',
    chassisCode: 'PROTO-15',
    name: 'Valkyrie Aerospike-VMax (Flagship)',
    callsign: 'TALON-1',
    massKg: 2248.5,
    aerodynamicCd: 0.2845,
    maxRocketKn: 25.0,
    maxElectricKw: 1200.0,
  },
  {
    id: 'VH-PROTO-14',
    chassisCode: 'PROTO-14',
    name: 'Aerospike-Beta Mule (Testbed)',
    callsign: 'MULE-4',
    massKg: 2290.0,
    aerodynamicCd: 0.2980,
    maxRocketKn: 18.0,
    maxElectricKw: 900.0,
  },
];

const INITIAL_SECTORS: SectorTelemetry[] = [
  { sectorIndex: 1, label: 'SEC-01: Grid Departure & Cryo Chill', speedKmh: 102.5, mach: 0.083, aerospikeThrustKn: 0.0, chamberPressBar: 0.0, propellantFlowKgs: 0.0, loxTankPct: 99.8, ch4TankPct: 99.6, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 90.0, status: 'COMPLETED' },
  { sectorIndex: 2, label: 'SEC-02: Front Electric Torque Wave', speedKmh: 205.8, mach: 0.167, aerospikeThrustKn: 0.0, chamberPressBar: 1.4, propellantFlowKgs: 0.12, loxTankPct: 99.5, ch4TankPct: 99.3, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 90.0, status: 'COMPLETED' },
  { sectorIndex: 3, label: 'SEC-03: Pyro Torch Ignition Gate', speedKmh: 298.4, mach: 0.242, aerospikeThrustKn: 4.5, chamberPressBar: 38.4, propellantFlowKgs: 1.45, loxTankPct: 98.1, ch4TankPct: 97.9, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 90.0, status: 'COMPLETED' },
  { sectorIndex: 4, label: 'SEC-04: Turbopump Spin-Up Ramp', speedKmh: 348.2, mach: 0.282, aerospikeThrustKn: 9.8, chamberPressBar: 64.2, propellantFlowKgs: 3.15, loxTankPct: 96.4, ch4TankPct: 96.0, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 88.5, status: 'COMPLETED' },
  { sectorIndex: 5, label: 'SEC-05: Transonic Compression Ingress', speedKmh: 388.5, mach: 0.315, aerospikeThrustKn: 14.8, chamberPressBar: 89.5, propellantFlowKgs: 4.85, loxTankPct: 94.2, ch4TankPct: 93.8, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 78.2, status: 'COMPLETED' },
  { sectorIndex: 6, label: 'SEC-06: Shock Boundary Wedge Lock', speedKmh: 416.2, mach: 0.337, aerospikeThrustKn: 18.4, chamberPressBar: 102.3, propellantFlowKgs: 6.05, loxTankPct: 92.0, ch4TankPct: 91.5, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 71.4, status: 'COMPLETED' },
  { sectorIndex: 7, label: 'SEC-07: Linear Aerospike Full Burn', speedKmh: 428.4, mach: 0.347, aerospikeThrustKn: 22.4, chamberPressBar: 115.0, propellantFlowKgs: 7.45, loxTankPct: 88.4, ch4TankPct: 87.6, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 68.5, status: 'ACTIVE' },
  { sectorIndex: 8, label: 'SEC-08: Max Dynamic Pressure (Max-Q)', speedKmh: 441.2, mach: 0.358, aerospikeThrustKn: 22.9, chamberPressBar: 117.2, propellantFlowKgs: 7.60, loxTankPct: 84.8, ch4TankPct: 83.9, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 66.2, status: 'PENDING' },
  { sectorIndex: 9, label: 'SEC-09: Aerodynamic Ground Trim', speedKmh: 435.0, mach: 0.352, aerospikeThrustKn: 21.8, chamberPressBar: 114.1, propellantFlowKgs: 7.30, loxTankPct: 81.1, ch4TankPct: 80.3, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 67.4, status: 'PENDING' },
  { sectorIndex: 10, label: 'SEC-10: V-Max Optical Timing Trap', speedKmh: 429.6, mach: 0.348, aerospikeThrustKn: 21.1, chamberPressBar: 112.5, propellantFlowKgs: 7.10, loxTankPct: 77.5, ch4TankPct: 76.8, parachuteArmed: false, parachuteDeployed: false, shockAngleDeg: 68.2, status: 'PENDING' },
  { sectorIndex: 11, label: 'SEC-11: Chute Interlock Arming Zone', speedKmh: 399.1, mach: 0.323, aerospikeThrustKn: 15.6, chamberPressBar: 93.4, propellantFlowKgs: 5.20, loxTankPct: 74.2, ch4TankPct: 73.5, parachuteArmed: true, parachuteDeployed: false, shockAngleDeg: 74.8, status: 'PENDING' },
  { sectorIndex: 12, label: 'SEC-12: Aerospike Cutoff & N2 Purge', speedKmh: 354.0, mach: 0.287, aerospikeThrustKn: 3.8, chamberPressBar: 22.5, propellantFlowKgs: 1.15, loxTankPct: 73.9, ch4TankPct: 73.1, parachuteArmed: true, parachuteDeployed: false, shockAngleDeg: 86.0, status: 'PENDING' },
  { sectorIndex: 13, label: 'SEC-13: Supersonic Drogue Ejection', speedKmh: 258.4, mach: 0.209, aerospikeThrustKn: 0.0, chamberPressBar: 0.0, propellantFlowKgs: 0.0, loxTankPct: 73.9, ch4TankPct: 73.1, parachuteArmed: true, parachuteDeployed: true, shockAngleDeg: 90.0, status: 'PENDING' },
  { sectorIndex: 14, label: 'SEC-14: Front Carbon-SiC Regen Stop', speedKmh: 142.0, mach: 0.115, aerospikeThrustKn: 0.0, chamberPressBar: 0.0, propellantFlowKgs: 0.0, loxTankPct: 73.9, ch4TankPct: 73.1, parachuteArmed: true, parachuteDeployed: true, shockAngleDeg: 90.0, status: 'PENDING' },
];

export default function ValkyrieAerospikeDeck() {
  // ----------------------------------------------------------------------------
  // GLOBAL & SIMULATION STATE
  // ----------------------------------------------------------------------------
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(VEHICLES[0]);
  const [activeTab, setActiveTab] = useState<'FLIGHT_DECK' | 'PLUME_MAP' | 'CRYO_BUS' | 'RUN_LEDGER' | 'SYSTEM_LOGS'>('FLIGHT_DECK');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<1 | 5>(1);

  // Keyed Ignition & Armed State
  const [isKeyCoverOpen, setIsKeyCoverOpen] = useState<boolean>(false);
  const [isStagedIgnitionArmed, setIsStagedIgnitionArmed] = useState<boolean>(true);
  const [burnProfile, setBurnProfile] = useState<BurnProfile>('VMAX_FULL_IGNITION');
  const [yawTrimDeg, setYawTrimDeg] = useState<number>(0.0);

  // Dynamic Telemetry Metrics
  const [groundSpeedKmh, setGroundSpeedKmh] = useState<number>(428.4);
  const [aerospikeThrustKn, setAerospikeThrustKn] = useState<number>(22.4);
  const [electricHarvestKw, setElectricHarvestKw] = useState<number>(1146.0);
  const [chamberPressureBar, setChamberPressureBar] = useState<number>(115.0);
  const [loxTankPct, setLoxTankPct] = useState<number>(88.4);
  const [ch4TankPct, setCh4TankPct] = useState<number>(87.6);
  const [throatTempK, setThroatTempK] = useState<number>(2850);
  const [throatHeatFluxMw, setThroatHeatFluxMw] = useState<number>(42.1);
  const [recircPumpActive, setRecircPumpActive] = useState<boolean>(true);
  const [purgeValveSealed, setPurgeValveSealed] = useState<boolean>(true);
  const [parachuteArmed, setParachuteArmed] = useState<boolean>(false);

  // Modal Dialogs & Alerts
  const [activeModal, setActiveModal] = useState<'PRE_CHILL' | 'IGNITER_TEST' | 'N2_BLANKET' | 'EXPORT_CONFIRM' | 'CHASSIS_SWITCH' | null>(null);
  const [modalProgress, setModalProgress] = useState<number>(0);
  const [modalStatusMsg, setModalStatusMsg] = useState<string>('');
  const [notificationToast, setNotificationToast] = useState<{ title: string; desc: string; type: 'success' | 'warn' | 'info' } | null>(null);

  // Sector ledger state
  const [sectors, setSectors] = useState<SectorTelemetry[]>(INITIAL_SECTORS);
  const [activeSectorIdx, setActiveSectorIdx] = useState<number>(7);

  // Derived Telemetry Values
  // Speed of sound at test dry lakebed ~ 1234.8 km/h (343 m/s)
  const currentMach = useMemo(() => {
    return Number((groundSpeedKmh / 1234.8).toFixed(3));
  }, [groundSpeedKmh]);

  // Equivalent BHP = (Electric kW + (Aerospike kN * speed m/s converted))
  const totalSystemPowerKw = useMemo(() => {
    const rocketKw = (aerospikeThrustKn * 1000 * (groundSpeedKmh / 3.6)) / 1000;
    return Math.round(electricHarvestKw + rocketKw);
  }, [electricHarvestKw, aerospikeThrustKn, groundSpeedKmh]);

  const totalBhpEquiv = useMemo(() => {
    return Math.round(totalSystemPowerKw * 1.34102);
  }, [totalSystemPowerKw]);

  // Mach wave compression angle: mu = arcsin(1/M) if M > 1, else 90 deg
  const compressionAngleDeg = useMemo(() => {
    if (currentMach >= 1.0) {
      const rad = Math.asin(1 / Math.max(currentMach, 1.001));
      return Number(((rad * 180) / Math.PI).toFixed(1));
    }
    // Subsonic/transonic pseudo-wedge visualization
    return Number((90 - Math.min(30, currentMach * 60)).toFixed(1));
  }, [currentMach]);

  // Auto-dismiss toast
  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => setNotificationToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // ----------------------------------------------------------------------------
  // REAL-TIME SIMULATION TICK LOOP
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Dynamic profile targets
      let targetThrust = 0;
      let targetPressure = 0;
      let targetThroatTemp = 300;
      let flowRateKgs = 0;

      switch (burnProfile) {
        case 'VMAX_FULL_IGNITION':
          targetThrust = isStagedIgnitionArmed ? 22.4 : 0;
          targetPressure = isStagedIgnitionArmed ? 115.0 : 0;
          targetThroatTemp = isStagedIgnitionArmed ? 2850 : 420;
          flowRateKgs = isStagedIgnitionArmed ? 7.45 : 0;
          break;
        case 'TRANSONIC_BOOST':
          targetThrust = isStagedIgnitionArmed ? 14.8 : 0;
          targetPressure = isStagedIgnitionArmed ? 89.5 : 0;
          targetThroatTemp = isStagedIgnitionArmed ? 2240 : 380;
          flowRateKgs = isStagedIgnitionArmed ? 4.85 : 0;
          break;
        case 'ELECTRIC_CRUISE':
          targetThrust = 0;
          targetPressure = 1.2;
          targetThroatTemp = 295;
          flowRateKgs = 0;
          break;
        case 'PYRO_SHUTDOWN':
          targetThrust = 0;
          targetPressure = 0;
          targetThroatTemp = 850;
          flowRateKgs = 0;
          break;
      }

      // Micro-fluctuations for realistic avionics telemetry
      const pressureFluctuation = isStagedIgnitionArmed && burnProfile !== 'ELECTRIC_CRUISE' && burnProfile !== 'PYRO_SHUTDOWN'
        ? (Math.random() - 0.5) * 1.8
        : 0;

      const thrustFluctuation = isStagedIgnitionArmed && burnProfile !== 'ELECTRIC_CRUISE' && burnProfile !== 'PYRO_SHUTDOWN'
        ? (Math.random() - 0.5) * 0.35
        : 0;

      // Update parameters smoothly
      setChamberPressureBar((prev) => {
        const next = prev + (targetPressure - prev) * 0.15 + pressureFluctuation * 0.2;
        return Number(Math.max(0, next).toFixed(1));
      });

      setAerospikeThrustKn((prev) => {
        const next = prev + (targetThrust - prev) * 0.18 + thrustFluctuation * 0.1;
        return Number(Math.max(0, next).toFixed(1));
      });

      setThroatTempK((prev) => {
        const jitter = (Math.random() - 0.5) * 8;
        const next = prev + (targetThroatTemp - prev) * 0.08 + jitter;
        return Math.round(next);
      });

      // Speed integration
      setGroundSpeedKmh((prev) => {
        let accel = 0;
        if (burnProfile === 'VMAX_FULL_IGNITION' && isStagedIgnitionArmed) {
          accel = 0.45 * simSpeedMultiplier;
        } else if (burnProfile === 'TRANSONIC_BOOST' && isStagedIgnitionArmed) {
          accel = 0.25 * simSpeedMultiplier;
        } else if (burnProfile === 'PYRO_SHUTDOWN' || parachuteArmed) {
          accel = -1.2 * simSpeedMultiplier;
        } else {
          // slight drift
          accel = (Math.random() - 0.48) * 0.1;
        }

        const nextSpeed = Math.min(480.0, Math.max(90.0, prev + accel));
        return Number(nextSpeed.toFixed(1));
      });

      // Propellant consumption
      if (isStagedIgnitionArmed && flowRateKgs > 0) {
        setLoxTankPct((prev) => Math.max(12.5, Number((prev - 0.012 * simSpeedMultiplier).toFixed(2))));
        setCh4TankPct((prev) => Math.max(11.8, Number((prev - 0.010 * simSpeedMultiplier).toFixed(2))));
      }

      // Update active sector matching speed
      setSectors((prev) => {
        return prev.map((sec) => {
          if (sec.sectorIndex === 7) {
            return {
              ...sec,
              speedKmh: groundSpeedKmh,
              mach: currentMach,
              aerospikeThrustKn,
              chamberPressBar: chamberPressureBar,
              propellantFlowKgs: flowRateKgs,
              loxTankPct,
              ch4TankPct,
            };
          }
          return sec;
        });
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isSimulating, burnProfile, isStagedIgnitionArmed, simSpeedMultiplier, parachuteArmed, groundSpeedKmh, currentMach, aerospikeThrustKn, chamberPressureBar, loxTankPct, ch4TankPct]);

  // ----------------------------------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------------------------------
  const handleBurnProfileSelect = (profile: BurnProfile) => {
    setBurnProfile(profile);
    if (profile === 'PYRO_SHUTDOWN') {
      setIsStagedIgnitionArmed(false);
      setNotificationToast({
        title: 'PYRO-ISOLATION ENGAGED',
        desc: 'Methalox main gate closed. Nitrogen sweep active.',
        type: 'warn',
      });
    } else if (profile === 'VMAX_FULL_IGNITION') {
      setIsStagedIgnitionArmed(true);
      setNotificationToast({
        title: 'V-MAX FULL IGNITION ARMED',
        desc: 'Linear aerospike ramp pressure targeting 115 bar (22.4 kN).',
        type: 'success',
      });
    } else {
      setNotificationToast({
        title: `BURN PROFILE: ${profile}`,
        desc: 'Avionics mapped to linear thrust scheduler.',
        type: 'info',
      });
    }
  };

  const handleToggleIgnitionArm = () => {
    const nextState = !isStagedIgnitionArmed;
    setIsStagedIgnitionArmed(nextState);
    if (!nextState) {
      setBurnProfile('ELECTRIC_CRUISE');
      setNotificationToast({
        title: 'V-MAX ABORT TRIGGERED',
        desc: 'Rocket thrust zeroed. Front e-motors commanded to cruise.',
        type: 'warn',
      });
    } else {
      setBurnProfile('VMAX_FULL_IGNITION');
      setNotificationToast({
        title: 'STAGED IGNITION ARMED',
        desc: 'Dual exciters primed. Ready for aerospike chamber surge.',
        type: 'success',
      });
    }
  };

  const executeActionProcedure = (type: 'PRE_CHILL' | 'IGNITER_TEST' | 'N2_BLANKET') => {
    setActiveModal(type);
    setModalProgress(5);
    setModalStatusMsg('Initiating telemetry handshake...');

    let progress = 5;
    const interval = setInterval(() => {
      progress += 20;
      setModalProgress(Math.min(100, progress));

      if (progress === 45) {
        if (type === 'PRE_CHILL') setModalStatusMsg('Opening LOX/CH4 chill-bypass lines @ 90 K...');
        if (type === 'IGNITER_TEST') setModalStatusMsg('Exciter circuit 1 & 2 firing test (1.42 Ω)...');
        if (type === 'N2_BLANKET') setModalStatusMsg('Purging aerospike ramp with 220 bar N2 gas...');
      } else if (progress === 85) {
        setModalStatusMsg('Verifying transducer feedback & delta-P...');
      } else if (progress >= 100) {
        clearInterval(interval);
        setModalStatusMsg('Procedure successfully verified & logged.');
        setTimeout(() => {
          setActiveModal(null);
          setNotificationToast({
            title: `${type} COMPLETED`,
            desc: 'Telemetry logged to telemetry_events ledger.',
            type: 'success',
          });
        }, 800);
      }
    }, 280);
  };

  const handleExportCsv = () => {
    const headers = 'Sector,Label,Ground_Speed_kmh,Mach,Rocket_Thrust_kN,Chamber_Press_bar,Mass_Flow_kgs,LOX_Pct,CH4_Pct,Parachute_Armed,Status\n';
    const rows = sectors
      .map(
        (s) =>
          `${s.sectorIndex},"${s.label}",${s.speedKmh},${s.mach},${s.aerospikeThrustKn},${s.chamberPressBar},${s.propellantFlowKgs},${s.loxTankPct},${s.ch4TankPct},${s.parachuteArmed},${s.status}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VALKYRIE_PROTO15_RUN_SECTORS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationToast({
      title: 'TELEMETRY CSV EXPORTED',
      desc: '14 sectors downloaded with high-speed flight metrics.',
      type: 'success',
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#020408] text-slate-100 flex flex-col font-sans select-none antialiased">
        {/* ==================================================================== */}
        {/* 1. TOP HEADER & TELEMETRY CONTROLS                                  */}
        {/* ==================================================================== */}
        <header className="border-b border-slate-800/90 bg-[#0B0F17]/95 px-4 md:px-6 py-3.5 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
            {/* Left Brand Lockup (Locked chassis code, title, and status badge to prevent wrap) */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-amber-300 bg-amber-950/70 border border-amber-500/40 rounded whitespace-nowrap">
                  {selectedVehicle.chassisCode}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-800/70 border border-slate-700 rounded whitespace-nowrap hidden sm:inline-block">
                  METHALOX // AEROSPIKE
                </span>
              </div>

              <div className="h-5 w-px bg-slate-800 hidden sm:block" />

              <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 whitespace-nowrap truncate">
                VALKYRIE AEROSPIKE-VMAX
              </h1>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold tracking-wider rounded bg-slate-900 border border-slate-700/80 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${isStagedIgnitionArmed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className={isStagedIgnitionArmed ? 'text-emerald-400' : 'text-amber-400'}>
                  {isStagedIgnitionArmed ? 'AEROSPIKE ARMED' : 'ROCKET STANDBY'}
                </span>
              </div>
            </div>

            {/* Right Action Controls: Clean h-9 row */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* Simulation Run/Pause */}
              <div className="h-9 flex items-center bg-slate-900/90 border border-slate-800 rounded p-1 gap-1">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`h-7 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isSimulating
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? 'RUNNING' : 'PAUSED'}</span>
                </button>

                {/* 1x / 5x Speed Multiplier */}
                <div className="flex items-center border-l border-slate-800 pl-1">
                  <button
                    onClick={() => setSimSpeedMultiplier(1)}
                    className={`h-7 px-2 text-xs font-mono font-bold rounded ${
                      simSpeedMultiplier === 1 ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1X
                  </button>
                  <button
                    onClick={() => setSimSpeedMultiplier(5)}
                    className={`h-7 px-2 text-xs font-mono font-bold rounded ${
                      simSpeedMultiplier === 5 ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    5X
                  </button>
                </div>
              </div>

              {/* Staged Ignition Key Switch / Toggle */}
              <div className="h-9 flex items-center bg-slate-900 border border-slate-800 rounded px-2 gap-2">
                <button
                  onClick={() => setIsKeyCoverOpen(!isKeyCoverOpen)}
                  className={`h-7 px-2 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-colors ${
                    isKeyCoverOpen
                      ? 'bg-red-950/80 border border-red-500/50 text-red-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Toggle Safety Key Flap"
                >
                  {isKeyCoverOpen ? <Unlock className="w-3.5 h-3.5 text-red-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="hidden sm:inline">{isKeyCoverOpen ? 'COVER OPEN' : 'KEY GUARD'}</span>
                </button>

                <button
                  disabled={!isKeyCoverOpen}
                  onClick={handleToggleIgnitionArm}
                  className={`h-7 px-3 text-xs md:text-sm font-black font-mono tracking-wider uppercase rounded flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    !isKeyCoverOpen
                      ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                      : isStagedIgnitionArmed
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40 animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isStagedIgnitionArmed ? 'V-MAX ABORT' : 'STAGE IGNITION'}</span>
                </button>
              </div>

              {/* Vehicle Chassis Switcher */}
              <button
                onClick={() => setActiveModal('CHASSIS_SWITCH')}
                className="h-9 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Switch Hypercar Chassis"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{selectedVehicle.chassisCode}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* RESPONSIVE TAB BAR (with scrollbar-none & overflow-x-auto)          */}
        {/* ==================================================================== */}
        <div className="border-b border-slate-800/80 bg-[#070B12] px-4 md:px-6">
          <div className="max-w-[1720px] mx-auto flex items-center justify-between">
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase whitespace-nowrap">
              <button
                onClick={() => setActiveTab('FLIGHT_DECK')}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeTab === 'FLIGHT_DECK'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>FLIGHT DECK HUD</span>
              </button>

              <button
                onClick={() => setActiveTab('PLUME_MAP')}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeTab === 'PLUME_MAP'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>AEROSPIKE PLUME MAP</span>
              </button>

              <button
                onClick={() => setActiveTab('CRYO_BUS')}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeTab === 'CRYO_BUS'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>CRYO PROPULSION BUS</span>
              </button>

              <button
                onClick={() => setActiveTab('RUN_LEDGER')}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeTab === 'RUN_LEDGER'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>VELOCITY RUN LEDGER</span>
              </button>

              <button
                onClick={() => setActiveTab('SYSTEM_LOGS')}
                className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-2 ${
                  activeTab === 'SYSTEM_LOGS'
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Database className="w-4 h-4 text-slate-400" />
                <span>SYSTEM LOGS</span>
              </button>
            </nav>

            {/* Quick Live Clock / Lakebed conditions */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                EDWARDS DRY LAKEBED [R-17]
              </span>
              <span>AMB: 16°C / 101.3 kPa</span>
              <span className="text-amber-400 font-bold">ALT: 698m ASL</span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MAIN OPERATIONS WORKSPACE                                            */}
        {/* ==================================================================== */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 md:p-6 space-y-6">
          {/* ------------------------------------------------------------------ */}
          {/* PANE 1: TOP POWERTRAIN & ROCKET THRUST HUD                         */}
          {/* ------------------------------------------------------------------ */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-lg p-4 md:p-5 shadow-2xl relative overflow-hidden">
            {/* Top decorative titanium accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/70 via-red-500/60 to-slate-700" />

            {/* Section Hub Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  DUAL-PROPULSION POWERTRAIN & AEROSPIKE TELEMETRY HUD
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
                  // PROTO-15 ACTIVE FLIGHT TELEMETRY
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-mono">
                <span className="text-slate-400">BURN PROFILE:</span>
                <span className="text-amber-400 font-bold uppercase">{burnProfile.replace('_', ' ')}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">MACH COMPRESSION:</span>
                <span className="text-rose-400 font-bold">{compressionAngleDeg}°</span>
              </div>
            </div>

            {/* Telemetry Strip Metric Cards (Permanent Large Typography) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {/* Metric 1: Ground Speed */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    GROUND SPEED
                  </span>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-amber-400">
                    {groundSpeedKmh.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">KM/H</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">SONIC RATIO:</span>
                  <span className="font-bold text-amber-300 font-mono">MACH {currentMach.toFixed(3)}</span>
                </div>
              </div>

              {/* Metric 2: Total System Thrust / Power */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    TOTAL SYSTEM POWER
                  </span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-amber-400">
                    {totalSystemPowerKw.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">KW</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">BHP EQUIV:</span>
                  <span className="font-bold text-slate-200 font-mono">{totalBhpEquiv.toLocaleString()} BHP</span>
                </div>
              </div>

              {/* Metric 3: Aerospike Rocket Thrust */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    AEROSPIKE THRUST
                  </span>
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-red-400">
                    {aerospikeThrustKn.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">KN</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">THRUST RATING:</span>
                  <span className="font-bold text-red-300 font-mono">
                    {Math.round((aerospikeThrustKn / selectedVehicle.maxRocketKn) * 100)}% MAX
                  </span>
                </div>
              </div>

              {/* Metric 4: Chamber Pressure */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    CHAMBER PRESSURE
                  </span>
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-amber-400">
                    {chamberPressureBar.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">BAR</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">TARGET PC:</span>
                  <span className="font-bold text-cyan-300 font-mono">115.0 BAR</span>
                </div>
              </div>

              {/* Metric 5: LOX Propellant Tank */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    LOX CRYO TANK
                  </span>
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-amber-400">
                    {loxTankPct.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">TEMP @ 90 K:</span>
                  <span className="font-bold text-cyan-400 font-mono">90.2 K</span>
                </div>
              </div>

              {/* Metric 6: Throat Thermal Temperature */}
              <div className="bg-[#0F172A] border border-slate-800/90 rounded-md p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    THROAT JACKET
                  </span>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="my-1">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-amber-400">
                    {throatTempK.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 ml-1.5 font-bold">K</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">REGEN FLUX:</span>
                  <span className="font-bold text-rose-400 font-mono">{throatHeatFluxMw.toFixed(1)} MW/m²</span>
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* CENTER SPLIT: 2D AEROSPIKE PLUME CANVAS + CRYO PROPULSION BUS      */}
          {/* ------------------------------------------------------------------ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ---------------------------------------------------------------- */}
            {/* PANE 2: CENTER-LEFT 2D INTERACTIVE LINEAR AEROSPIKE PLUME CANVAS */}
            {/* ---------------------------------------------------------------- */}
            <div className="lg:col-span-7 bg-[#0B0F17] border border-slate-800 rounded-lg p-4 md:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      LINEAR AEROSPIKE PLUME & SHOCK-DIAMOND VECTOR STAGE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                      YAW TRIM: {yawTrimDeg >= 0 ? `+${yawTrimDeg}°` : `${yawTrimDeg}°`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
                      SHOCK WEDGE: {compressionAngleDeg}°
                    </span>
                  </div>
                </div>

                {/* Burn Profile Trigger Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    onClick={() => handleBurnProfileSelect('ELECTRIC_CRUISE')}
                    className={`py-2 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-all flex flex-col items-center justify-center border ${
                      burnProfile === 'ELECTRIC_CRUISE'
                        ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>ELECTRIC CRUISE</span>
                    <span className="text-[10px] text-slate-500 font-normal">COLD RUN (0 kN)</span>
                  </button>

                  <button
                    onClick={() => handleBurnProfileSelect('TRANSONIC_BOOST')}
                    className={`py-2 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-all flex flex-col items-center justify-center border ${
                      burnProfile === 'TRANSONIC_BOOST'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>TRANSONIC BOOST</span>
                    <span className="text-[10px] text-amber-500/80 font-normal">GATE INGRESS (14.8 kN)</span>
                  </button>

                  <button
                    onClick={() => handleBurnProfileSelect('VMAX_FULL_IGNITION')}
                    className={`py-2 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-all flex flex-col items-center justify-center border ${
                      burnProfile === 'VMAX_FULL_IGNITION'
                        ? 'bg-red-950/70 text-red-300 border-red-500/60 shadow-lg shadow-red-950/30'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>V-MAX FULL IGNITION</span>
                    <span className="text-[10px] text-red-400 font-normal">FULL RAMP (22.4 kN)</span>
                  </button>

                  <button
                    onClick={() => handleBurnProfileSelect('PYRO_SHUTDOWN')}
                    className={`py-2 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded transition-all flex flex-col items-center justify-center border ${
                      burnProfile === 'PYRO_SHUTDOWN'
                        ? 'bg-slate-800 text-slate-100 border-slate-500 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>PYRO SHUTDOWN</span>
                    <span className="text-[10px] text-slate-500 font-normal">N2 PURGE CORRIDOR</span>
                  </button>
                </div>

                {/* 2D Interactive SVG Visualizer */}
                <div className="relative w-full h-[320px] md:h-[360px] bg-[#02050B] rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
                  {/* Subtle Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }}
                  />

                  {/* SVG Chassis & Aerospike Ramp Geometry */}
                  <svg
                    viewBox="0 0 760 380"
                    className="w-full h-full max-h-full transition-transform duration-300"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Rocket Plume Glow */}
                      <radialGradient id="plumeCore" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="70%" stopColor="#EF4444" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
                      </radialGradient>

                      {/* Shock Diamond Gradient */}
                      <linearGradient id="shockDiamondGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                      </linearGradient>

                      {/* Carbon Chassis Gradient */}
                      <linearGradient id="chassisSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                    </defs>

                    {/* Coordinate axes watermark */}
                    <text x="20" y="30" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      AEROSPIKE RAMP [X: 0.00m | YAW: {yawTrimDeg}°]
                    </text>
                    <text x="20" y="50" fill="#475569" fontSize="10" fontFamily="monospace">
                      ATMOSPHERIC ALT: 698m | EXPANSION RATIO: 18.4:1
                    </text>

                    {/* Dynamic Mach Compression Shock Waves (Overlay Wedge) */}
                    <g opacity={burnProfile !== 'ELECTRIC_CRUISE' ? '0.7' : '0.2'}>
                      {/* Bow shock from vehicle nose */}
                      <line
                        x1="180"
                        y1="190"
                        x2="40"
                        y2={190 - Math.tan((compressionAngleDeg * Math.PI) / 180) * 140}
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      <line
                        x1="180"
                        y1="190"
                        x2="40"
                        y2={190 + Math.tan((compressionAngleDeg * Math.PI) / 180) * 140}
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />

                      {/* Trailing expansion fan rays */}
                      <line x1="420" y1="140" x2="320" y2="60" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                      <line x1="420" y1="240" x2="320" y2="320" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                    </g>

                    {/* Top-Down Aerodynamic Hypercar Chassis */}
                    {/* Nose Cone */}
                    <path
                      d="M 170 190 Q 220 160 280 155 L 430 140 L 490 145 L 530 165 L 530 215 L 490 235 L 430 240 L 280 225 Q 220 220 170 190 Z"
                      fill="url(#chassisSkin)"
                      stroke="#475569"
                      strokeWidth="2"
                    />

                    {/* Cockpit Canopy */}
                    <path
                      d="M 270 190 Q 320 172 380 172 L 400 174 L 400 206 L 380 208 Q 320 208 270 190 Z"
                      fill="#020408"
                      stroke="#38BDF8"
                      strokeWidth="1.2"
                      strokeOpacity="0.7"
                    />

                    {/* Dual Front-Axle Electric Motors */}
                    <rect x="250" y="125" width="30" height="20" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                    <rect x="250" y="235" width="30" height="20" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                    <text x="210" y="118" fill="#38BDF8" fontSize="9" fontFamily="monospace">FL MOTOR (600kW)</text>
                    <text x="210" y="272" fill="#38BDF8" fontSize="9" fontFamily="monospace">FR MOTOR (600kW)</text>

                    {/* Cryogenic Propellant Tanks outline inside body */}
                    <ellipse cx="370" cy="190" rx="35" ry="18" fill="#0369A1" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="350" y="193" fill="#BAE6FD" fontSize="8" fontFamily="monospace" fontWeight="bold">LOX TANK</text>

                    <ellipse cx="445" cy="190" rx="25" ry="16" fill="#D97706" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="430" y="193" fill="#FDE68A" fontSize="8" fontFamily="monospace" fontWeight="bold">CH4 TANK</text>

                    {/* LINEAR AEROSPIKE SPIKE / CENTRAL WEDGE */}
                    {/* The spike is in the rear center (X: 530 to 595, Y: 190) */}
                    <g transform={`rotate(${yawTrimDeg}, 530, 190)`}>
                      {/* Linear Aerospike Central Spike Wedge */}
                      <path
                        d="M 525 170 L 595 188 L 595 192 L 525 210 L 530 190 Z"
                        fill="#334155"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />

                      {/* Upper & Lower Thruster Combustion Chambers */}
                      <rect x="520" y="162" width="15" height="10" rx="2" fill="#DC2626" stroke="#EF4444" strokeWidth="1.2" />
                      <rect x="520" y="208" width="15" height="10" rx="2" fill="#DC2626" stroke="#EF4444" strokeWidth="1.2" />

                      {/* Dynamic Thrust Vectoring Vanes (±8° yaw trim visual) */}
                      <line x1="535" y1="158" x2="550" y2="155" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="535" y1="222" x2="550" y2="225" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

                      {/* ROCKET PLUME & SHOCK-DIAMONDS (Visible if ignition active) */}
                      {isStagedIgnitionArmed && burnProfile !== 'ELECTRIC_CRUISE' && burnProfile !== 'PYRO_SHUTDOWN' && (
                        <g>
                          {/* Upper Ramp Plume Expansion */}
                          <path
                            d="M 535 165 C 570 162, 630 170, 710 178 L 700 190 L 595 189 Z"
                            fill="url(#plumeCore)"
                            opacity="0.8"
                          />
                          {/* Lower Ramp Plume Expansion */}
                          <path
                            d="M 535 215 C 570 218, 630 210, 710 202 L 700 190 L 595 191 Z"
                            fill="url(#plumeCore)"
                            opacity="0.8"
                          />

                          {/* Central Supersonic Core Envelope */}
                          <ellipse cx="640" cy="190" rx="90" ry="24" fill="url(#plumeCore)" opacity="0.9" />

                          {/* Shock Diamonds along the linear aerospike axis */}
                          {/* Shock Diamond 1 */}
                          <polygon
                            points="605,190 615,183 625,190 615,197"
                            fill="url(#shockDiamondGrad)"
                            className="animate-pulse"
                          />
                          {/* Shock Diamond 2 */}
                          <polygon
                            points="635,190 648,181 660,190 648,199"
                            fill="url(#shockDiamondGrad)"
                          />
                          {/* Shock Diamond 3 */}
                          <polygon
                            points="670,190 682,183 695,190 682,197"
                            fill="url(#shockDiamondGrad)"
                            opacity="0.85"
                          />
                          {/* Shock Diamond 4 */}
                          <polygon
                            points="705,190 715,185 725,190 715,195"
                            fill="url(#shockDiamondGrad)"
                            opacity="0.65"
                          />
                        </g>
                      )}

                      {/* Cold Gas or Idle Purge Stream */}
                      {burnProfile === 'PYRO_SHUTDOWN' && (
                        <path
                          d="M 535 175 L 630 180 L 630 200 L 535 205 Z"
                          fill="#64748B"
                          opacity="0.3"
                          strokeDasharray="3 3"
                        />
                      )}
                    </g>
                  </svg>

                  {/* Canvas Legend Overlay */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-amber-400 inline-block" />
                      SHOCK BOUNDARY
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-cyan-400 inline-block" />
                      DIAMOND NODES
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-1 bg-red-500 inline-block" />
                      METHALOX FLAME
                    </span>
                  </div>
                </div>
              </div>

              {/* Vectoring Yaw Trim Slider Controls */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm font-mono">
                <div className="flex items-center gap-2 text-slate-300 font-bold tracking-wider uppercase">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>THRUST VECTORING VANE TRIM (±8° YAW)</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-slate-400 text-xs font-mono">-8° [PORT]</span>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="0.5"
                    value={yawTrimDeg}
                    onChange={(e) => setYawTrimDeg(parseFloat(e.target.value))}
                    className="w-36 md:w-48 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-slate-400 text-xs font-mono">+8° [STBD]</span>
                  <button
                    onClick={() => setYawTrimDeg(0)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono font-bold"
                  >
                    ZERO
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* PANE 3: CENTER-RIGHT METHALOX CRYO-TANK & THERMAL MATRIX          */}
            {/* ---------------------------------------------------------------- */}
            <div className="lg:col-span-5 bg-[#0B0F17] border border-slate-800 rounded-lg p-4 md:p-5 shadow-xl flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    METHALOX CRYO-VESSELS & THERMAL MATRIX
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    REGEN COOLING // ACTIVE
                  </span>
                </div>

                {/* Cryo Vessel Dual Pressure Tanks (LOX & CH4) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* LOX Tank */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-md p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
                        LIQUID OXYGEN (LOX)
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">90.2 K</span>
                    </div>
                    {/* Level Bar */}
                    <div className="w-full bg-slate-900 rounded h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-cyan-500 h-full transition-all duration-300"
                        style={{ width: `${loxTankPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                      <span>CAP: 420 L</span>
                      <span className="text-amber-400 font-bold">{loxTankPct.toFixed(1)}%</span>
                      <span>FEED: 18.4 BAR</span>
                    </div>
                  </div>

                  {/* CH4 Tank */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-md p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
                        LIQUID METHANE (CH4)
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">111.4 K</span>
                    </div>
                    {/* Level Bar */}
                    <div className="w-full bg-slate-900 rounded h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${ch4TankPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                      <span>CAP: 310 L</span>
                      <span className="text-amber-400 font-bold">{ch4TankPct.toFixed(1)}%</span>
                      <span>FEED: 19.8 BAR</span>
                    </div>
                  </div>
                </div>

                {/* Turbopump & Recirculation Telemetry Grid */}
                <div className="bg-[#070B12] border border-slate-800/80 rounded-md p-3.5 space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold tracking-wider uppercase">TURBOPUMP SHAFT SPEED</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {isStagedIgnitionArmed && burnProfile !== 'ELECTRIC_CRUISE' ? '42,800 RPM' : '12,400 RPM'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800">
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800/60">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">BEARING TEMP</div>
                      <div className="text-slate-100 font-bold text-sm">41.8 °C</div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800/60">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">SHAFT VIBE</div>
                      <div className="text-emerald-400 font-bold text-sm">0.14 G</div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800/60">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">MASS FLOW</div>
                      <div className="text-amber-400 font-bold text-sm">
                        {isStagedIgnitionArmed && burnProfile === 'VMAX_FULL_IGNITION' ? '7.45 kg/s' : '0.10 kg/s'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dual Front-Axle Electric Motors Harvest Matrix */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-md p-3.5 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold tracking-wider uppercase">
                      DUAL FLUX-CORE FRONT E-MOTORS
                    </span>
                    <span className="text-emerald-400 font-bold">SYNCHRONIZED (1,200 kW)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="flex justify-between text-slate-400 font-bold">
                        <span>FRONT LEFT (FL)</span>
                        <span className="text-amber-300">585 kW</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>ROTOR TEMP: 482 °C</span>
                        <span className="text-emerald-400">96.8% EFF</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="flex justify-between text-slate-400 font-bold">
                        <span>FRONT RIGHT (FR)</span>
                        <span className="text-amber-300">588 kW</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>ROTOR TEMP: 486 °C</span>
                        <span className="text-emerald-400">97.1% EFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pump & Relief Valve Quick Toggles */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setRecircPumpActive(!recircPumpActive);
                    setNotificationToast({
                      title: 'BOIL-OFF RECIRCULATION PUMP',
                      desc: recircPumpActive ? 'Recirculation paused' : 'Recirculation pumps energized',
                      type: recircPumpActive ? 'warn' : 'info',
                    });
                  }}
                  className={`flex-1 py-2 px-3 rounded text-xs font-mono font-bold tracking-wider uppercase border transition-colors flex items-center justify-center gap-1.5 ${
                    recircPumpActive
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${recircPumpActive ? 'animate-spin' : ''}`} />
                  <span>RECIRC PUMPS: {recircPumpActive ? 'ACTIVE' : 'IDLE'}</span>
                </button>

                <button
                  onClick={() => {
                    setPurgeValveSealed(!purgeValveSealed);
                    setNotificationToast({
                      title: 'PURGE RELIEF VALVE',
                      desc: purgeValveSealed ? 'Overpressure bleed open' : 'Relief valve sealed shut',
                      type: purgeValveSealed ? 'warn' : 'info',
                    });
                  }}
                  className={`flex-1 py-2 px-3 rounded text-xs font-mono font-bold tracking-wider uppercase border transition-colors flex items-center justify-center gap-1.5 ${
                    purgeValveSealed
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>RELIEF VALVE: {purgeValveSealed ? 'SEALED' : 'BLEED'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* PANE 4: BOTTOM SUPERSONIC STINT & ACCELERATION VECTOR LEDGER       */}
          {/* ------------------------------------------------------------------ */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-lg p-4 md:p-5 shadow-2xl">
            {/* Table & Stint Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    SUPERSONIC RUN SECTOR LEDGER (SECTORS 01 — 14)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    14 TELEMETRY GATES
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  High-speed velocity records, aerospike combustion chamber bar, and deceleration chute flags.
                </p>
              </div>

              {/* Ledger Action Buttons (Pre-chill, Igniter test, Nitrogen blanket, Export CSV) */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => executeActionProcedure('PRE_CHILL')}
                  className="py-1.5 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRE-CHILL CRYO</span>
                </button>

                <button
                  onClick={() => executeActionProcedure('IGNITER_TEST')}
                  className="py-1.5 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>IGNITER TEST</span>
                </button>

                <button
                  onClick={() => executeActionProcedure('N2_BLANKET')}
                  className="py-1.5 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>N2 BLANKET</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="py-1.5 px-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase rounded bg-amber-600 hover:bg-amber-500 text-slate-950 transition-colors flex items-center gap-1.5 font-black"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>EXPORT CSV</span>
                </button>
              </div>
            </div>

            {/* Telemetry Sectors Data Table (py-3.5 px-3 generous clearance, border-slate-800, no clipped columns) */}
            <div className="overflow-x-auto border border-slate-800/90 rounded-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070B12] text-slate-400 text-xs font-mono font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-3">SECTOR</th>
                    <th className="py-3 px-3">OPERATIONAL PHASE</th>
                    <th className="py-3 px-3 text-right">SPEED (KM/H)</th>
                    <th className="py-3 px-3 text-right">SONIC MACH</th>
                    <th className="py-3 px-3 text-right">THRUST (KN)</th>
                    <th className="py-3 px-3 text-right">CHAMBER (BAR)</th>
                    <th className="py-3 px-3 text-right">FLOW (KG/S)</th>
                    <th className="py-3 px-3 text-center">CHUTE ARM</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs md:text-sm font-mono text-slate-200">
                  {sectors.map((sec) => {
                    const isActive = sec.sectorIndex === activeSectorIdx;
                    return (
                      <tr
                        key={sec.sectorIndex}
                        onClick={() => setActiveSectorIdx(sec.sectorIndex)}
                        className={`cursor-pointer transition-colors hover:bg-slate-900/70 ${
                          isActive ? 'bg-slate-900/90 font-bold border-l-2 border-l-amber-400' : ''
                        }`}
                      >
                        {/* Sector ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          SEC-{sec.sectorIndex < 10 ? `0${sec.sectorIndex}` : sec.sectorIndex}
                        </td>

                        {/* Label */}
                        <td className="py-3.5 px-3 text-slate-200 whitespace-nowrap">
                          {sec.label}
                        </td>

                        {/* Speed */}
                        <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-slate-100 whitespace-nowrap">
                          {sec.speedKmh.toFixed(1)}
                        </td>

                        {/* Mach */}
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-amber-300 whitespace-nowrap">
                          M {sec.mach.toFixed(3)}
                        </td>

                        {/* Thrust */}
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-red-400 whitespace-nowrap">
                          {sec.aerospikeThrustKn.toFixed(1)} kN
                        </td>

                        {/* Chamber Pressure */}
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-cyan-400 whitespace-nowrap">
                          {sec.chamberPressBar.toFixed(1)}
                        </td>

                        {/* Propellant Flow */}
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-300 whitespace-nowrap">
                          {sec.propellantFlowKgs.toFixed(2)}
                        </td>

                        {/* Chute */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {sec.parachuteDeployed ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-red-950 text-red-400 border border-red-500/50">
                              DEPLOYED
                            </span>
                          ) : sec.parachuteArmed ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-500/50">
                              ARMED
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">LOCKED</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {sec.status === 'COMPLETED' ? (
                            <span className="text-emerald-400 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-xs uppercase">LOGGED</span>
                            </span>
                          ) : sec.status === 'ACTIVE' ? (
                            <span className="text-amber-400 flex items-center justify-center gap-1 animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span className="text-xs uppercase font-bold">STREAMING</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs uppercase">PENDING</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* TAB 5 / INSPECTOR MODAL: SYSTEM AUDIT LOGS                         */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'SYSTEM_LOGS' && (
            <section className="bg-[#0B0F17] border border-slate-800 rounded-lg p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    AVIONICS & STAGED IGNITION AUDIT TRAILS (EVENT BUS)
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">8 LOGGED HARDWARE TRANSACTIONS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded space-y-1.5">
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>STAGE_2_MAIN_METHALOX_GATE_OPEN</span>
                    <span>T-02:45</span>
                  </div>
                  <p className="text-slate-300">
                    Chamber pressurized to 115.0 bar nominal. Mass flow stabilized at 7.45 kg/s across dual injector manifolds.
                  </p>
                  <div className="text-slate-500 text-[11px] pt-1">
                    VERIFICATION HASH: 0x8A12F98B4490C12D · AUTH: FLIGHT_DIR_SOTO
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded space-y-1.5">
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>IGNITER_CONTINUITY_CONFIRMED</span>
                    <span>T-04:10</span>
                  </div>
                  <p className="text-slate-300">
                    Dual pyro-torch exciter bridge resistance measured at 1.420 Ω / 1.422 Ω. Closed loop continuity accepted.
                  </p>
                  <div className="text-slate-500 text-[11px] pt-1">
                    VERIFICATION HASH: 0x3E118B8091CA7723 · AUTH: SYS_AUTOMATION_CORE
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded space-y-1.5">
                  <div className="flex justify-between text-cyan-400 font-bold">
                    <span>TRANSONIC_MACH_BARRIER_CROSSED</span>
                    <span>T-01:25</span>
                  </div>
                  <p className="text-slate-300">
                    Ground speed 414.7 km/h (Mach 0.337 local boundary condition). Compression shock wedge locked at 71.4°.
                  </p>
                  <div className="text-slate-500 text-[11px] pt-1">
                    VERIFICATION HASH: 0x9F4C2A1E7B8092DA · AUTH: AVIONICS_TELEMETRY
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded space-y-1.5">
                  <div className="flex justify-between text-red-400 font-bold">
                    <span>PARACHUTE_MORTAR_INTERLOCK_ARMED</span>
                    <span>T-00:45</span>
                  </div>
                  <p className="text-slate-300">
                    Mortar charge interlock pin disengaged. Automatic barometric trigger gate armed for speed decay corridor.
                  </p>
                  <div className="text-slate-500 text-[11px] pt-1">
                    VERIFICATION HASH: 0x77DA102298BC3156 · AUTH: PILOT_TALON_1
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* ==================================================================== */}
        {/* INTERACTIVE MODALS & PROCEDURE RUNNERS                               */}
        {/* ==================================================================== */}
        {activeModal && activeModal !== 'CHASSIS_SWITCH' && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#0B0F17] border border-slate-700 w-full max-w-md rounded-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                  {activeModal === 'PRE_CHILL' && 'PRE-CHILL CRYO LINES'}
                  {activeModal === 'IGNITER_TEST' && 'IGNITER CONTINUITY TEST'}
                  {activeModal === 'N2_BLANKET' && 'EMERGENCY NITROGEN BLANKET'}
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">SYSTEM PROCEDURE</span>
              </div>

              <p className="text-xs md:text-sm font-mono text-slate-300">
                {modalStatusMsg}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-500 h-full transition-all duration-200"
                  style={{ width: `${modalProgress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>STATUS: {modalProgress < 100 ? 'PROCESSING' : 'COMPLETED'}</span>
                <span className="text-amber-400 font-bold">{modalProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Chassis Selector Modal */}
        {activeModal === 'CHASSIS_SWITCH' && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#0B0F17] border border-slate-700 w-full max-w-lg rounded-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                  SELECT HYPERCAR CHASSIS CONFIGURATION
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {VEHICLES.map((veh) => {
                  const isCur = veh.id === selectedVehicle.id;
                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        setSelectedVehicle(veh);
                        setActiveModal(null);
                        setNotificationToast({
                          title: `CHASSIS SWITCHED: ${veh.chassisCode}`,
                          desc: veh.name,
                          type: 'info',
                        });
                      }}
                      className={`p-4 rounded border cursor-pointer transition-all ${
                        isCur
                          ? 'bg-slate-900 border-amber-500/70'
                          : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold font-mono text-amber-400">
                          {veh.chassisCode} // {veh.callsign}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          {veh.id}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-200 font-bold mb-2">
                        {veh.name}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <div>MASS: {veh.massKg} kg</div>
                        <div>ROCKET: {veh.maxRocketKn} kN</div>
                        <div>ELECTRIC: {veh.maxElectricKw} kW</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {notificationToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] border border-amber-500/50 rounded-lg p-3.5 shadow-2xl max-w-sm flex items-start gap-3">
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-100">
                {notificationToast.title}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                {notificationToast.desc}
              </div>
            </div>
            <button onClick={() => setNotificationToast(null)} className="text-slate-400 hover:text-slate-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
