import React, { useState, useEffect, useId } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Download,
  Flame,
  Gauge,
  Layers,
  Maximize2,
  Play,
  Power,
  Radio,
  RefreshCw,
  RotateCcw,
  Sliders,
  Sparkles,
  Thermometer,
  Volume2,
  Wind,
  Zap,
  ZapOff
} from 'lucide-react';

// Channel configuration constants for the X3 Nested-Channel Hall Thruster
interface ChannelConfig {
  id: 'inner' | 'middle' | 'outer';
  name: string;
  nominalPowerKw: number;
  baseFlowMgs: number;
  anodeRadiusInnerMm: number;
  anodeRadiusOuterMm: number;
  color: string;
  glowColor: string;
}

const CHANNELS: ChannelConfig[] = [
  {
    id: 'inner',
    name: 'Inner Channel (Stage 1)',
    nominalPowerKw: 15,
    baseFlowMgs: 4.2,
    anodeRadiusInnerMm: 80,
    anodeRadiusOuterMm: 110,
    color: '#38bdf8', // Cyan-400
    glowColor: 'rgba(56, 189, 248, 0.4)',
  },
  {
    id: 'middle',
    name: 'Middle Channel (Stage 2)',
    nominalPowerKw: 35,
    baseFlowMgs: 9.8,
    anodeRadiusInnerMm: 160,
    anodeRadiusOuterMm: 200,
    color: '#00f3ff', // Electric Xenon Cyan
    glowColor: 'rgba(0, 243, 255, 0.5)',
  },
  {
    id: 'outer',
    name: 'Outer Channel (Stage 3)',
    nominalPowerKw: 50,
    baseFlowMgs: 14.5,
    anodeRadiusInnerMm: 260,
    anodeRadiusOuterMm: 310,
    color: '#818cf8', // Electric Violet / Blue
    glowColor: 'rgba(129, 140, 248, 0.6)',
  },
];

interface FaradayDataPoint {
  angle: number;
  currentDensity: number; // mA/cm²
  ionFlux: number; // x10^16 ions/cm²·s
  plasmaPotential: number; // V
  divergenceFraction: number;
  timestamp: string;
}

export function HallThrusterControl() {
  const gradientId = useId();

  // Facility Operating State
  const [isFastTripped, setIsFastTripped] = useState<boolean>(false);
  const [fastTripModalOpen, setFastTripModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deck' | 'diagnostics' | 'manifold' | 'history'>('deck');

  // Thruster Nested Channel Active States
  const [channelActive, setChannelActive] = useState<{
    inner: boolean;
    middle: boolean;
    outer: boolean;
  }>({
    inner: true,
    middle: true,
    outer: true,
  });

  // Power & Anode Voltage Settings
  const [dischargeVoltage, setDischargeVoltage] = useState<number>(400); // 300V to 800V
  const [voltageTrim, setVoltageTrim] = useState<{ inner: number; middle: number; outer: number }>({
    inner: 0,
    middle: 0,
    outer: 0,
  });

  // Hollow Cathode Diagnostics
  const [cathodeIgnited, setCathodeIgnited] = useState<boolean>(true);
  const [cathodeHeaterCurrent, setCathodeHeaterCurrent] = useState<number>(7.12);
  const [cathodeKeeperVoltage, setCathodeKeeperVoltage] = useState<number>(18.35);
  const [cathodeFlowMgs, setCathodeFlowMgs] = useState<number>(2.10);
  const [cathodeModalOpen, setCathodeModalOpen] = useState<boolean>(false);
  const [cathodeIgniteStep, setCathodeIgniteStep] = useState<number>(0);

  // Magnetic Coil Currents (Amperes)
  const [innerCoilCurrent, setInnerCoilCurrent] = useState<number>(8.5);
  const [trimCoilCurrent, setTrimCoilCurrent] = useState<number>(12.2);
  const [outerCoilCurrent, setOuterCoilCurrent] = useState<number>(16.4);

  // Faraday Rake Sweep System
  const [rakeAngle, setRakeAngle] = useState<number>(0.0);
  const [autoSweepActive, setAutoSweepActive] = useState<boolean>(true);
  const [sweepDirection, setSweepDirection] = useState<number>(1);
  const [faradaySweepLedger, setFaradaySweepLedger] = useState<FaradayDataPoint[]>([]);

  // Facility Thermal & Vacuum Telemetry
  const [cryoTempA, setCryoTempA] = useState<number>(14.85);
  const [cryoTempB, setCryoTempB] = useState<number>(15.12);
  const [cryoTempC, setCryoTempC] = useState<number>(14.92);
  const [ln2BaffleTemp, setLn2BaffleTemp] = useState<number>(77.38);
  const [gateValveOpen, setGateValveOpen] = useState<boolean>(true);

  // Micro-oscillation Jitter state (realistic plasma breathing mode simulation)
  const [plasmaJitter, setPlasmaJitter] = useState<number>(0);
  const [plasmaIntensity, setPlasmaIntensity] = useState<number>(1);

  // Modals & Action States
  const [purgeModalOpen, setPurgeModalOpen] = useState<boolean>(false);
  const [purgeProgress, setPurgeProgress] = useState<number>(0);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [facilityAlert, setFacilityAlert] = useState<string | null>(null);

  // Incident log state
  const [incidentLogs, setIncidentLogs] = useState<Array<{
    id: string;
    time: string;
    code: string;
    type: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
    resolved: boolean;
  }>>([
    {
      id: 'EVT-101',
      time: '22:42:10',
      code: 'ARC-SNUBBER-08',
      type: 'DISCHARGE_ARC',
      severity: 'WARNING',
      message: 'Inner channel micro-arc cleared in 1.2ms by fast LC snubber.',
      resolved: true,
    },
    {
      id: 'EVT-102',
      time: '22:35:48',
      code: 'CRYO-BAL-02',
      type: 'THERMAL_STABILIZATION',
      severity: 'INFO',
      message: 'Liquid nitrogen chevron baffle stabilized at 77.38 K.',
      resolved: true,
    },
    {
      id: 'EVT-103',
      time: '22:20:15',
      code: 'RAKE-CAL-01',
      type: 'DIAGNOSTIC_CAL',
      severity: 'INFO',
      message: 'Faraday cup angular resolver zero reference confirmed at 0.00°.',
      resolved: true,
    },
  ]);

  // Physics calculation formulas based on NASA GRC test telemetry
  const activeCount = (channelActive.inner ? 1 : 0) + (channelActive.middle ? 1 : 0) + (channelActive.outer ? 1 : 0);
  const anyChannelActive = activeCount > 0 && !isFastTripped && cathodeIgnited;

  // Mass Flow Calculations (mg/s)
  const innerFlow = (channelActive.inner && !isFastTripped) ? CHANNELS[0].baseFlowMgs * (dischargeVoltage / 400) ** 0.5 : 0;
  const middleFlow = (channelActive.middle && !isFastTripped) ? CHANNELS[1].baseFlowMgs * (dischargeVoltage / 400) ** 0.5 : 0;
  const outerFlow = (channelActive.outer && !isFastTripped) ? CHANNELS[2].baseFlowMgs * (dischargeVoltage / 400) ** 0.5 : 0;
  const actualCathodeFlow = (cathodeIgnited && !isFastTripped) ? cathodeFlowMgs : 0;
  const totalMassFlowMgs = innerFlow + middleFlow + outerFlow + actualCathodeFlow;

  // Discharge Current Calculations (Amperes)
  // At nominal 400V: Inner ~37.5A (15kW), Middle ~87.5A (35kW), Outer ~125.0A (50kW)
  const currentJitter = 1 + plasmaJitter * 0.015;
  const innerCurrent = (channelActive.inner && !isFastTripped && cathodeIgnited)
    ? (15000 / dischargeVoltage) * (1 + voltageTrim.inner / 100) * currentJitter
    : 0;
  const middleCurrent = (channelActive.middle && !isFastTripped && cathodeIgnited)
    ? (35000 / dischargeVoltage) * (1 + voltageTrim.middle / 100) * currentJitter
    : 0;
  const outerCurrent = (channelActive.outer && !isFastTripped && cathodeIgnited)
    ? (50000 / dischargeVoltage) * (1 + voltageTrim.outer / 100) * currentJitter
    : 0;
  const totalCurrent = innerCurrent + middleCurrent + outerCurrent;

  // Discharge Power (kW)
  const dischargePowerKw = anyChannelActive ? (dischargeVoltage * totalCurrent) / 1000 : 0;

  // Calculated Ion Exhaust Velocity (m/s) & Thrust (Newtons)
  // v_ion = sqrt(2 * e * V_d / M_xe) * acceleration_efficiency (~0.88)
  // v_ion(400V) approx 24,200 m/s
  const ionVelocity = Math.sqrt((2 * 1.602e-19 * dischargeVoltage) / 2.18e-25) * 0.88;
  const beamDivergenceEfficiency = 0.94; // Cosine loss
  const thrustAnode = (totalMassFlowMgs - actualCathodeFlow) * 1e-6 * ionVelocity * beamDivergenceEfficiency;
  const totalThrustNewtons = anyChannelActive ? Math.max(0, thrustAnode * 1.05 * currentJitter) : 0;

  // Specific Impulse Isp (seconds) = Thrust / (total_mass_flow * g0)
  const g0 = 9.80665;
  const ispSeconds = (anyChannelActive && totalMassFlowMgs > 0)
    ? totalThrustNewtons / (totalMassFlowMgs * 1e-6 * g0)
    : 0;

  // Chamber Vacuum Pressure (Torr)
  // Base pressure in VF6: 1.1e-7 Torr. Each mg/s of Xenon adds ~4.2e-8 Torr given 350,000 L/s pumping speed
  const baseVacuum = 1.1e-7;
  const flowVacuumContribution = totalMassFlowMgs * 4.25e-8;
  const vacuumPressureTorr = (isFastTripped || totalMassFlowMgs === 0)
    ? baseVacuum + (Math.sin(Date.now() / 3000) * 0.05 * baseVacuum)
    : baseVacuum + flowVacuumContribution + (plasmaJitter * 0.04 * flowVacuumContribution);

  // Initialize and update Faraday Sweep Ledger based on current rake angle
  const computeFaradayPoint = (angleDeg: number, pwrKw: number): FaradayDataPoint => {
    // Current density follows Gaussian/cos^n profile centered at 0° with secondary wings from nested rings
    const rad = (angleDeg * Math.PI) / 180;
    const powerScale = pwrKw > 0 ? pwrKw / 100 : 0.01;
    // Central core + nested ring side-lobes at +/- 18 deg
    const corePeak = 10.45 * Math.exp(-Math.pow(angleDeg / 24, 2));
    const sideLobes = 2.1 * Math.exp(-Math.pow((Math.abs(angleDeg) - 18) / 10, 2));
    const density = Math.max(0.02, (corePeak + sideLobes) * powerScale * (1 + plasmaJitter * 0.03));
    const flux = density * 6.242; // in 10^16 ions/cm²·s
    const potential = Math.max(6, 20.1 * Math.cos(rad * 0.8));
    const divFrac = 0.285 * Math.exp(-Math.pow(angleDeg / 32, 2));

    return {
      angle: Number(angleDeg.toFixed(1)),
      currentDensity: Number(density.toFixed(4)),
      ionFlux: Number(flux.toFixed(2)),
      plasmaPotential: Number(potential.toFixed(1)),
      divergenceFraction: Number(divFrac.toFixed(3)),
      timestamp: new Date().toISOString().substring(11, 19),
    };
  };

  // Populate initial sweep ledger (-60° to +60° in 10° increments)
  useEffect(() => {
    const points: FaradayDataPoint[] = [];
    for (let a = -60; a <= 60; a += 10) {
      points.push(computeFaradayPoint(a, 102.4));
    }
    setFaradaySweepLedger(points);
  }, []);

  // Realistic Simulation Tick Loop (Plasma micro-oscillations, rake sweep, thermal drift)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Plasma micro-oscillations (breathing mode frequency emulation)
      const jitterVal = (Math.random() - 0.5) * 1.8;
      setPlasmaJitter(jitterVal);
      setPlasmaIntensity(0.92 + Math.random() * 0.16);

      // 2. Slow thermal drift on Cryopump panels and cathode
      setCryoTempA(prev => Number((14.85 + Math.sin(Date.now() / 15000) * 0.12).toFixed(2)));
      setCryoTempB(prev => Number((15.10 + Math.cos(Date.now() / 18000) * 0.15).toFixed(2)));
      setLn2BaffleTemp(prev => Number((77.35 + Math.sin(Date.now() / 25000) * 0.08).toFixed(2)));

      if (cathodeIgnited && !isFastTripped) {
        setCathodeKeeperVoltage(prev => Number((18.35 + jitterVal * 0.08).toFixed(2)));
        setCathodeHeaterCurrent(prev => Number((7.12 + Math.cos(Date.now() / 8000) * 0.04).toFixed(2)));
      }

      // 3. Automated Faraday Rake Sweep Motion
      if (autoSweepActive && !isFastTripped) {
        setRakeAngle(prev => {
          let next = prev + sweepDirection * 1.5;
          if (next >= 60) {
            next = 60;
            setSweepDirection(-1);
          } else if (next <= -60) {
            next = -60;
            setSweepDirection(1);
          }
          return Number(next.toFixed(1));
        });
      }
    }, 180);

    return () => clearInterval(interval);
  }, [autoSweepActive, sweepDirection, isFastTripped, cathodeIgnited]);

  // Update current rake reading in ledger periodically
  useEffect(() => {
    if (rakeAngle % 10 === 0 || Math.abs(rakeAngle % 10) < 1.0) {
      const currentPt = computeFaradayPoint(rakeAngle, dischargePowerKw);
      setFaradaySweepLedger(prev => {
        const index = prev.findIndex(p => Math.abs(p.angle - rakeAngle) < 3);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = currentPt;
          return updated;
        }
        return [currentPt, ...prev.slice(0, 14)];
      });
    }
  }, [rakeAngle, dischargePowerKw]);

  // Trigger Fast Trip Emergency Shutdown
  const executeFastTrip = () => {
    setIsFastTripped(true);
    setFastTripModalOpen(false);
    setChannelActive({ inner: false, middle: false, outer: false });
    setCathodeIgnited(false);
    setAutoSweepActive(false);

    const tripLog = {
      id: `TRIP-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString(),
      code: 'HV-FAST-TRIP-ENGAGED',
      type: 'OPERATOR_SCRAM',
      severity: 'CRITICAL' as const,
      message: 'High-Voltage Anodes fast-snubbed to GND. Xenon isolation valves slammed shut.',
      resolved: false,
    };
    setIncidentLogs(prev => [tripLog, ...prev]);
    showToast('EMERGENCY FAST TRIP TRIGGERED: HIGH VOLTAGE ISOLATED');
  };

  // Reset Fast Trip
  const resetFastTrip = () => {
    setIsFastTripped(false);
    setChannelActive({ inner: true, middle: true, outer: true });
    setCathodeIgnited(true);
    showToast('FACILITY INTERLOCKS RESET: CHANNELS ARMED & READY');
  };

  // Helper for notification toast
  const showToast = (msg: string) => {
    setFacilityAlert(msg);
    setTimeout(() => {
      setFacilityAlert(null);
    }, 5000);
  };

  // Preset Configurations
  const applyPreset = (preset: 'all' | 'inner_mid' | 'outer_only' | 'inner_only' | 'standby') => {
    if (isFastTripped) {
      showToast('CANNOT APPLY PRESET: FAST TRIP INTERLOCK IS ENGAGED');
      return;
    }
    switch (preset) {
      case 'all':
        setChannelActive({ inner: true, middle: true, outer: true });
        setDischargeVoltage(400);
        showToast('STAGE PRESET: ALL 3 RINGS (100 kW FLAGSHIP)');
        break;
      case 'inner_mid':
        setChannelActive({ inner: true, middle: true, outer: false });
        setDischargeVoltage(420);
        showToast('STAGE PRESET: INNER + MIDDLE (50 kW HIGH-EFFICIENCY)');
        break;
      case 'outer_only':
        setChannelActive({ inner: false, middle: false, outer: true });
        setDischargeVoltage(400);
        showToast('STAGE PRESET: OUTER RING ONLY (50 kW HIGH-CURRENT)');
        break;
      case 'inner_only':
        setChannelActive({ inner: true, middle: false, outer: false });
        setDischargeVoltage(350);
        showToast('STAGE PRESET: INNER RING CHECKOUT (15 kW LOW-POWER)');
        break;
      case 'standby':
        setChannelActive({ inner: false, middle: false, outer: false });
        showToast('STAGE PRESET: STANDBY (PROPULSION CHANNELS ISOLATED)');
        break;
    }
  };

  // Trigger Purge Sequence
  const handlePurgeSequence = () => {
    setPurgeModalOpen(true);
    setPurgeProgress(5);
    const steps = [15, 35, 60, 85, 100];
    steps.forEach((pct, idx) => {
      setTimeout(() => {
        setPurgeProgress(pct);
        if (pct === 100) {
          setTimeout(() => {
            setPurgeModalOpen(false);
            showToast('XENON LINE PURGE COMPLETE: PURITY 99.9999% RESTORED');
          }, 800);
        }
      }, (idx + 1) * 700);
    });
  };

  // Trigger Cathode Ignition Sequence
  const handleCathodeIgnition = () => {
    setCathodeModalOpen(true);
    setCathodeIgniteStep(1);
    // Step 1: Pre-heater ramp
    setTimeout(() => {
      setCathodeIgniteStep(2);
      // Step 2: High Voltage Keeper strike (120V ignition pulse)
      setTimeout(() => {
        setCathodeIgniteStep(3);
        // Step 3: Thermionic discharge sustained
        setTimeout(() => {
          setCathodeIgnited(true);
          setCathodeModalOpen(false);
          showToast('HOLLOW CATHODE IGNITED: EMISSION CURRENT 25.0 A STABLE');
        }, 1200);
      }, 1500);
    }, 1500);
  };

  // Zero Faraday Rake Position
  const handleZeroFaradayRake = () => {
    setAutoSweepActive(false);
    setRakeAngle(0.0);
    showToast('FARADAY CUP ENCODER ZEROED TO 0.00° THRUST AXIS');
  };

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 font-mono antialiased selection:bg-cyan-500/30 selection:text-cyan-200 p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-5">
      {/* Toast Alert Banner */}
      {facilityAlert && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-cyan-950/90 border border-cyan-400 text-cyan-200 px-4 py-3 shadow-[0_0_25px_rgba(0,243,255,0.4)] backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xs md:text-sm font-bold font-mono tracking-wider">{facilityAlert}</span>
        </div>
      )}

      {/* =========================================================================
          PANE 1: TOP FACILITY VACUUM & BEAM HUD
         ========================================================================= */}
      <header className="bg-[#0B0F17] border border-[#1E293B] shadow-2xl p-4 md:p-6 relative overflow-hidden">
        {/* Subtle Background Circuit Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 opacity-80" />

        {/* Header Top Row: Hub Callout and Operational Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.25)]">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 shrink-0 bg-emerald-400 rounded-none shadow-[0_0_8px_#10b981]" />
                <h1 className="text-lg sm:text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100 break-words leading-snug">
                  NASA GLENN VACUUM FACILITY 6 // X3 100kW NESTED-CHANNEL HALL THRUSTER
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mt-1.5">
                <span>CHAMBER B (7.6M × 21M)</span>
                <span className="text-slate-500">•</span>
                <span>PUMPING SPEED: 350,000 L/S XE</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">INTERLOCKS: ARMED & SEALED</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400">PROP: XE-131 (99.999%)</span>
              </div>
            </div>
          </div>

          {/* Right Header: Emergency Fast-Trip Toggle & Tabs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Fast Trip Disengage or Re-arm Toggle Button */}
            {isFastTripped ? (
              <button
                onClick={resetFastTrip}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black font-mono text-xs md:text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                RESET FAST TRIP & RE-ARM
              </button>
            ) : (
              <button
                onClick={() => setFastTripModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black font-mono text-xs md:text-sm tracking-widest uppercase border border-rose-400 shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all cursor-pointer animate-pulse"
              >
                <AlertOctagon className="w-4 h-4" />
                EMERGENCY FAST-TRIP / PROP ISOLATION
              </button>
            )}

            {/* Navigation Tab Selectors */}
            <div className="flex border border-[#1E293B] bg-[#04060E] p-1">
              <button
                onClick={() => setActiveTab('deck')}
                className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'deck' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Test Deck
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'diagnostics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Beam Sweep
              </button>
              <button
                onClick={() => setActiveTab('manifold')}
                className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'manifold' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                P&ID Manifold
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Trip Log ({incidentLogs.length})
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Strip: Balanced 2x3 Grid with 6 High-Contrast HUD Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {/* 1. Total Thrust */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                TOTAL THRUST
              </span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {isFastTripped ? '0.00' : totalThrustNewtons.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-cyan-400">N</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              <span>Target: 5.42 N @ 100kW</span>
            </div>
          </div>

          {/* 2. Specific Impulse (Isp) */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                SPECIFIC IMPULSE (ISP)
              </span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {isFastTripped ? '0' : Math.round(ispSeconds).toLocaleString()}
              </span>
              <span className="text-sm font-bold text-indigo-400">s</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-indigo-400" />
              <span>v_ion ≈ {isFastTripped ? 0 : Math.round(ionVelocity).toLocaleString()} m/s</span>
            </div>
          </div>

          {/* 3. Total Discharge Power */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                DISCHARGE POWER
              </span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {isFastTripped ? '0.0' : dischargePowerKw.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-amber-400">kW</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-amber-400" />
              <span>Current: {isFastTripped ? '0.0' : totalCurrent.toFixed(1)} A</span>
            </div>
          </div>

          {/* 4. Chamber Vacuum Pressure */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                CHAMBER VACUUM
              </span>
              <Wind className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {vacuumPressureTorr.toExponential(2).replace('e', 'E')}
              </span>
              <span className="text-sm font-bold text-emerald-400">Torr</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-emerald-400" />
              <span>Status: ULTRA-HIGH VAC (15K)</span>
            </div>
          </div>

          {/* 5. Total Propellant Mass Flow */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                TOTAL XENON FLOW
              </span>
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {isFastTripped ? '0.00' : totalMassFlowMgs.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-cyan-400">mg/s</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              <span>Active Rings: {activeCount} / 3</span>
            </div>
          </div>

          {/* 6. Anode Efficiency (Completing Balanced 2x3 Grid) */}
          <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 relative overflow-hidden group hover:border-cyan-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                ANODE EFFICIENCY
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                {isFastTripped ? '0.0' : anyChannelActive ? '64.5' : '0.0'}
              </span>
              <span className="text-sm font-bold text-cyan-400">%</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              <span>Total Thrust Power / Input Power</span>
            </div>
          </div>
        </div>

        {/* Quick Power Presets Strip with Uniform Button Heights */}
        <div className="mt-2 pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold tracking-wider uppercase">FIRING STAGE PRESETS:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => applyPreset('all')}
              className={`h-9 md:h-10 px-3.5 flex items-center justify-center border font-bold font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                channelActive.inner && channelActive.middle && channelActive.outer && !isFastTripped
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-500 text-slate-300'
              }`}
            >
              100 kW FLAGSHIP (ALL 3 RINGS)
            </button>
            <button
              onClick={() => applyPreset('inner_mid')}
              className={`h-9 md:h-10 px-3.5 flex items-center justify-center border font-bold font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                channelActive.inner && channelActive.middle && !channelActive.outer && !isFastTripped
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-500 text-slate-300'
              }`}
            >
              50 kW (INNER + MIDDLE)
            </button>
            <button
              onClick={() => applyPreset('outer_only')}
              className={`h-9 md:h-10 px-3.5 flex items-center justify-center border font-bold font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                !channelActive.inner && !channelActive.middle && channelActive.outer && !isFastTripped
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-500 text-slate-300'
              }`}
            >
              50 kW (OUTER RING ONLY)
            </button>
            <button
              onClick={() => applyPreset('inner_only')}
              className={`h-9 md:h-10 px-3.5 flex items-center justify-center border font-bold font-mono text-xs tracking-wider transition-colors cursor-pointer ${
                channelActive.inner && !channelActive.middle && !channelActive.outer && !isFastTripped
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'border-[#1E293B] bg-[#0F172A] hover:border-slate-500 text-slate-300'
              }`}
            >
              15 kW (INNER ONLY CHECKOUT)
            </button>
            <button
              onClick={() => applyPreset('standby')}
              className="h-9 md:h-10 px-3.5 flex items-center justify-center border border-rose-900/60 bg-[#0F172A] hover:border-rose-500 text-rose-300 hover:bg-rose-950/30 font-bold font-mono text-xs tracking-wider transition-colors cursor-pointer"
            >
              STANDBY (0 kW)
            </button>
          </div>
        </div>
      </header>

      {/* Main Operational Body */}
      {activeTab === 'deck' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* =========================================================================
              PANE 2: CENTER-LEFT 2D THRUSTER CHANNEL & PLASMA PLUME CANVAS (7 COLS)
             ========================================================================= */}
          <section className="lg:col-span-7 bg-[#0B0F17] border border-[#1E293B] p-4 md:p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-none shadow-[0_0_8px_#00f3ff]" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  X3 2D NESTED CHANNEL & IONIZED PLASMA PLUME PROFILE
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">RAKE ANGLE:</span>
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  {rakeAngle > 0 ? `+${rakeAngle.toFixed(1)}°` : `${rakeAngle.toFixed(1)}°`}
                </span>
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full aspect-[16/10] bg-[#020409] border border-[#1E293B] overflow-hidden flex items-center justify-center">
              {/* Grid / Vacuum Chamber Cross-Hairs Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

              <svg
                viewBox="0 0 800 500"
                className="w-full h-full select-none"
                style={{ filter: isFastTripped ? 'grayscale(80%)' : 'none' }}
              >
                <defs>
                  {/* Outer Channel Plasma Gradient */}
                  <radialGradient id={`outer-plasma-${gradientId}`} cx="20%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9 * plasmaIntensity} />
                    <stop offset="40%" stopColor="#00f3ff" stopOpacity={0.6 * plasmaIntensity} />
                    <stop offset="80%" stopColor="#0284c7" stopOpacity={0.15 * plasmaIntensity} />
                    <stop offset="100%" stopColor="#020409" stopOpacity="0" />
                  </radialGradient>

                  {/* Middle Channel Plasma Gradient */}
                  <radialGradient id={`mid-plasma-${gradientId}`} cx="20%" cy="50%" r="75%">
                    <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.95 * plasmaIntensity} />
                    <stop offset="45%" stopColor="#38bdf8" stopOpacity={0.7 * plasmaIntensity} />
                    <stop offset="85%" stopColor="#0369a1" stopOpacity={0.2 * plasmaIntensity} />
                    <stop offset="100%" stopColor="#020409" stopOpacity="0" />
                  </radialGradient>

                  {/* Inner Channel Plasma Gradient */}
                  <radialGradient id={`inner-plasma-${gradientId}`} cx="20%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                    <stop offset="25%" stopColor="#38bdf8" stopOpacity={0.85 * plasmaIntensity} />
                    <stop offset="65%" stopColor="#0284c7" stopOpacity={0.4 * plasmaIntensity} />
                    <stop offset="100%" stopColor="#020409" stopOpacity="0" />
                  </radialGradient>

                  {/* Cathode Emission Arc Gradient */}
                  <radialGradient id={`cathode-glow-${gradientId}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="40%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </radialGradient>

                  {/* Glow Filter for High-Energy Ion Beam */}
                  <filter id={`beam-glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Chamber Wall & Thruster Backplate Axis */}
                <line x1="140" y1="20" x2="140" y2="480" stroke="#1E293B" strokeWidth="4" strokeDasharray="4 4" />
                <line x1="40" y1="250" x2="780" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="6 6" />
                <text x="760" y="244" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                  THRUST AXIS (Z)
                </text>

                {/* 2. Dynamic Ionized Xenon Plasma Plumes (Rendered when stages are active) */}
                {anyChannelActive && (
                  <g filter={`url(#beam-glow-${gradientId})`}>
                    {/* Outer Stage Plasma Plume Envelope */}
                    {channelActive.outer && (
                      <>
                        <path
                          d="M 140 100 Q 380 70, 680 40 Q 520 250, 680 460 Q 380 430, 140 400 Z"
                          fill={`url(#outer-plasma-${gradientId})`}
                          className="transition-opacity duration-300"
                        />
                        <path
                          d="M 140 110 C 260 110, 480 80, 620 50 C 440 250, 440 250, 620 450 C 480 420, 260 390, 140 390 Z"
                          fill="#818cf8"
                          fillOpacity={0.25 * plasmaIntensity}
                        />
                      </>
                    )}

                    {/* Middle Stage Plasma Plume Envelope */}
                    {channelActive.middle && (
                      <>
                        <path
                          d="M 140 150 Q 350 140, 620 100 Q 480 250, 620 400 Q 350 360, 140 350 Z"
                          fill={`url(#mid-plasma-${gradientId})`}
                          className="transition-opacity duration-300"
                        />
                        <path
                          d="M 140 160 C 240 160, 420 160, 560 120 C 420 250, 420 250, 560 380 C 420 340, 240 340, 140 340 Z"
                          fill="#00f3ff"
                          fillOpacity={0.35 * plasmaIntensity}
                        />
                      </>
                    )}

                    {/* Inner Stage Plasma Plume Envelope */}
                    {channelActive.inner && (
                      <>
                        <path
                          d="M 140 200 Q 320 210, 560 170 Q 420 250, 560 330 Q 320 290, 140 300 Z"
                          fill={`url(#inner-plasma-${gradientId})`}
                          className="transition-opacity duration-300"
                        />
                        {/* High-Current Core Ion Stream */}
                        <polygon
                          points="140,240 460,244 540,250 460,256 140,260"
                          fill="#ffffff"
                          fillOpacity={0.8 * plasmaIntensity}
                        />
                      </>
                    )}

                    {/* Streamline Ion Drift Arrows */}
                    <g stroke="#00f3ff" strokeWidth="1" strokeDasharray="3 3" opacity={0.6 * plasmaIntensity}>
                      <line x1="150" y1="120" x2="480" y2="90" />
                      <line x1="150" y1="180" x2="510" y2="150" />
                      <line x1="150" y1="230" x2="530" y2="220" />
                      <line x1="150" y1="270" x2="530" y2="280" />
                      <line x1="150" y1="320" x2="510" y2="350" />
                      <line x1="150" y1="380" x2="480" y2="410" />
                    </g>
                  </g>
                )}

                {/* 3. Thruster Physical Mechanical Cross-Section (Nested Annular Channels) */}
                <g id="thruster-hardware">
                  {/* Central Body & Cathode Mount */}
                  <rect x="50" y="235" width="90" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="130" y="240" width="15" height="20" fill="#334155" stroke="#64748b" strokeWidth="1" />
                  {/* Hollow Cathode Tip */}
                  <circle
                    cx="145"
                    cy="250"
                    r="6"
                    fill={cathodeIgnited && !isFastTripped ? '#fbbf24' : '#64748b'}
                    filter={cathodeIgnited && !isFastTripped ? `url(#beam-glow-${gradientId})` : 'none'}
                  />
                  {cathodeIgnited && !isFastTripped && (
                    <circle cx="145" cy="250" r="14" fill={`url(#cathode-glow-${gradientId})`} />
                  )}

                  {/* Channel 1: Inner Channel (Y: 200-230, 270-300) */}
                  <rect
                    x="70"
                    y="200"
                    width="70"
                    height="30"
                    fill={channelActive.inner && !isFastTripped ? '#0c4a6e' : '#0f172a'}
                    stroke={channelActive.inner && !isFastTripped ? '#38bdf8' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, inner: !p.inner }))}
                  />
                  <rect
                    x="70"
                    y="270"
                    width="70"
                    height="30"
                    fill={channelActive.inner && !isFastTripped ? '#0c4a6e' : '#0f172a'}
                    stroke={channelActive.inner && !isFastTripped ? '#38bdf8' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, inner: !p.inner }))}
                  />
                  <text x="105" y="218" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    INNER
                  </text>
                  <text x="105" y="288" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    15 kW
                  </text>

                  {/* Inter-Channel Magnetic Intermediate Pole Piece 1 */}
                  <rect x="60" y="180" width="80" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <rect x="60" y="300" width="80" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                  {/* Channel 2: Middle Channel (Y: 150-180, 320-350) */}
                  <rect
                    x="70"
                    y="150"
                    width="70"
                    height="30"
                    fill={channelActive.middle && !isFastTripped ? '#083344' : '#0f172a'}
                    stroke={channelActive.middle && !isFastTripped ? '#00f3ff' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, middle: !p.middle }))}
                  />
                  <rect
                    x="70"
                    y="320"
                    width="70"
                    height="30"
                    fill={channelActive.middle && !isFastTripped ? '#083344' : '#0f172a'}
                    stroke={channelActive.middle && !isFastTripped ? '#00f3ff' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, middle: !p.middle }))}
                  />
                  <text x="105" y="168" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    MIDDLE
                  </text>
                  <text x="105" y="338" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    35 kW
                  </text>

                  {/* Inter-Channel Magnetic Intermediate Pole Piece 2 */}
                  <rect x="60" y="130" width="80" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <rect x="60" y="350" width="80" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                  {/* Channel 3: Outer Channel (Y: 100-130, 370-400) */}
                  <rect
                    x="70"
                    y="100"
                    width="70"
                    height="30"
                    fill={channelActive.outer && !isFastTripped ? '#312e81' : '#0f172a'}
                    stroke={channelActive.outer && !isFastTripped ? '#818cf8' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, outer: !p.outer }))}
                  />
                  <rect
                    x="70"
                    y="370"
                    width="70"
                    height="30"
                    fill={channelActive.outer && !isFastTripped ? '#312e81' : '#0f172a'}
                    stroke={channelActive.outer && !isFastTripped ? '#818cf8' : '#334155'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setChannelActive(p => ({ ...p, outer: !p.outer }))}
                  />
                  <text x="105" y="118" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    OUTER
                  </text>
                  <text x="105" y="388" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    50 kW
                  </text>

                  {/* Outer Shield & Electromagnet Casing */}
                  <rect x="50" y="80" width="90" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <rect x="50" y="400" width="90" height="20" fill="#1e293b" stroke="#475569" strokeWidth="1" />

                  {/* Magnetic Flux B-Field Lines */}
                  <path
                    d="M 140 90 C 200 90, 240 140, 240 250 C 240 360, 200 410, 140 410"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity={0.7}
                  />
                  <path
                    d="M 140 140 C 180 140, 200 180, 200 250 C 200 320, 180 360, 140 360"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity={0.6}
                  />
                </g>

                {/* 4. Faraday Cup Sweeping Arm & Arc Detector */}
                {/* Arc Rail at R = 420mm from thruster center */}
                <path
                  d="M 500 80 A 380 380 0 0 1 500 420"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />

                {/* Calculate Position of Faraday Rake on Arc */}
                {(() => {
                  const pivotX = 140;
                  const pivotY = 250;
                  const radius = 400;
                  const rad = (rakeAngle * Math.PI) / 180;
                  const probeX = pivotX + radius * Math.cos(rad);
                  const probeY = pivotY + radius * Math.sin(rad);

                  return (
                    <g id="faraday-rake-arm">
                      {/* Sweeping Articulated Arm */}
                      <line
                        x1={pivotX}
                        y1={pivotY}
                        x2={probeX}
                        y2={probeY}
                        stroke="#e2e8f0"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />
                      {/* Faraday Collector Cup Head */}
                      <circle
                        cx={probeX}
                        cy={probeY}
                        r="9"
                        fill="#0f172a"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        filter={`url(#beam-glow-${gradientId})`}
                      />
                      <circle cx={probeX} cy={probeY} r="3" fill="#38bdf8" />

                      {/* Angular Callout Tag */}
                      <rect
                        x={probeX + 12}
                        y={probeY - 14}
                        width="80"
                        height="26"
                        fill="#04060E"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <text
                        x={probeX + 18}
                        y={probeY + 4}
                        fill="#38bdf8"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {rakeAngle > 0 ? `+${rakeAngle}°` : `${rakeAngle}°`}
                      </text>

                      {/* 90% Beam Divergence Envelope Guides */}
                      <line x1="140" y1="250" x2="620" y2="70" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
                      <line x1="140" y1="250" x2="620" y2="430" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
                      <text x="630" y="75" fill="#f43f5e" fontSize="9" fontFamily="monospace">
                        +42.6° (90% INT)
                      </text>
                      <text x="630" y="435" fill="#f43f5e" fontSize="9" fontFamily="monospace">
                        -42.6° (90% INT)
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Plume Canvas Legend & HUD Overlays */}
              <div className="absolute bottom-2 left-2 bg-[#04060E]/90 border border-[#1E293B] p-2 flex items-center gap-4 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-cyan-400" />
                  <span className="text-slate-300">Xe+ Singly Ionized</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-indigo-500" />
                  <span className="text-slate-300">Xe++ Doubly Ionized</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-400" />
                  <span className="text-slate-300">Cathode Plasma</span>
                </div>
              </div>
            </div>

            {/* Clickable Channel Stage Control Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CHANNELS.map(ch => {
                const isActive = channelActive[ch.id] && !isFastTripped;
                const flow = ch.id === 'inner' ? innerFlow : ch.id === 'middle' ? middleFlow : outerFlow;
                const curr = ch.id === 'inner' ? innerCurrent : ch.id === 'middle' ? middleCurrent : outerCurrent;
                const pwr = (dischargeVoltage * curr) / 1000;

                return (
                  <div
                    key={ch.id}
                    className={`border p-3 flex flex-col justify-between transition-all ${
                      isActive
                        ? 'bg-[#0F172A] border-cyan-500/50 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                        : 'bg-[#04060E] border-[#1E293B] opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-100">
                        {ch.name}
                      </span>
                      <button
                        onClick={() => {
                          if (isFastTripped) {
                            showToast('INTERLOCK ACTIVE: CLEAR FAST TRIP FIRST');
                            return;
                          }
                          setChannelActive(prev => ({ ...prev, [ch.id]: !prev[ch.id] }));
                        }}
                        className={`px-2.5 py-1 text-xs font-bold font-mono uppercase border cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {isActive ? 'FIRING' : 'ISOLATED'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">STAGE POWER</span>
                        <span className="text-sm font-bold text-slate-200">
                          {isActive ? `${pwr.toFixed(1)} kW` : '0.0 kW'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">DISCHARGE CURR</span>
                        <span className="text-sm font-bold text-slate-200">
                          {isActive ? `${curr.toFixed(1)} A` : '0.0 A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">XE MASS FLOW</span>
                        <span className="text-sm font-bold text-cyan-300">
                          {isActive ? `${flow.toFixed(2)} mg/s` : '0.00 mg/s'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase">RADIUS (INNER/OUT)</span>
                        <span className="text-xs font-bold text-slate-300">
                          {ch.anodeRadiusInnerMm}/{ch.anodeRadiusOuterMm}mm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =========================================================================
              PANE 3: CENTER-RIGHT POWER PROCESSING UNIT (PPU) & CATHODE (5 COLS)
             ========================================================================= */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            {/* PPU Master Voltage & Inverter Ingestion */}
            <div className="bg-[#0B0F17] border border-[#1E293B] p-4 md:p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    POWER PROCESSING UNIT (PPU 100kW)
                  </h2>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5">
                  EFFICIENCY: 94.8%
                </span>
              </div>

              {/* Master Anode Discharge Voltage Slider (300V to 800V) */}
              <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                    MASTER ANODE DISCHARGE VOLTAGE
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono tabular-nums text-amber-400">
                      {dischargeVoltage}
                    </span>
                    <span className="text-xs font-bold text-amber-500">V</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="300"
                  max="800"
                  step="10"
                  value={dischargeVoltage}
                  disabled={isFastTripped}
                  onChange={e => setDischargeVoltage(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 h-2 cursor-pointer disabled:opacity-40"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>300 V (High-Current)</span>
                  <span>400 V (Nominal)</span>
                  <span>600 V (High-Isp)</span>
                  <span>800 V (Max Flight)</span>
                </div>
              </div>

              {/* Hollow Cathode Diagnostics Card */}
              <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                      HOLLOW CATHODE (LaB6 EMITTER)
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 border ${
                      cathodeIgnited && !isFastTripped
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                        : 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                    }`}
                  >
                    {cathodeIgnited && !isFastTripped ? 'DISCHARGE IGNITED' : 'EXTINGUISHED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-[#04060E] p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">KEEPER VOLTAGE</span>
                    <span className="text-base font-bold text-slate-100">
                      {cathodeIgnited && !isFastTripped ? `${cathodeKeeperVoltage} V` : '0.0 V'}
                    </span>
                  </div>
                  <div className="bg-[#04060E] p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">HEATER CURRENT</span>
                    <span className="text-base font-bold text-slate-100">
                      {cathodeIgnited && !isFastTripped ? `${cathodeHeaterCurrent} A` : '0.0 A'}
                    </span>
                  </div>
                  <div className="bg-[#04060E] p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">CATHODE XE FLOW</span>
                    <span className="text-base font-bold text-cyan-300">
                      {cathodeIgnited && !isFastTripped ? `${actualCathodeFlow.toFixed(2)} mg/s` : '0.00 mg/s'}
                    </span>
                  </div>
                  <div className="bg-[#04060E] p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">EMITTER TEMP</span>
                    <span className="text-base font-bold text-amber-300">
                      {cathodeIgnited && !isFastTripped ? '1,340 K' : '293 K'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleCathodeIgnition}
                    disabled={cathodeIgnited && !isFastTripped}
                    className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold font-mono tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    IGNITE HOLLOW CATHODE
                  </button>
                  <button
                    onClick={() => {
                      setCathodeIgnited(false);
                      showToast('HOLLOW CATHODE EXTINGUISHED');
                    }}
                    disabled={!cathodeIgnited || isFastTripped}
                    className="py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold font-mono tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    EXTINGUISH
                  </button>
                </div>
              </div>

              {/* Magnetic Coil Circuit Control */}
              <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                    MAGNETIC CIRCUIT COILS (B-FIELD)
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">PEAK: 185 GAUSS</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">INNER COIL</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        step="0.5"
                        value={innerCoilCurrent}
                        onChange={e => setInnerCoilCurrent(Number(e.target.value))}
                        className="w-16 bg-[#04060E] border border-slate-700 px-2 py-1 text-slate-200"
                      />
                      <span className="text-slate-400">A</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">TRIM COIL</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        step="0.5"
                        value={trimCoilCurrent}
                        onChange={e => setTrimCoilCurrent(Number(e.target.value))}
                        className="w-16 bg-[#04060E] border border-slate-700 px-2 py-1 text-slate-200"
                      />
                      <span className="text-slate-400">A</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">OUTER COIL</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        step="0.5"
                        value={outerCoilCurrent}
                        onChange={e => setOuterCoilCurrent(Number(e.target.value))}
                        className="w-16 bg-[#04060E] border border-slate-700 px-2 py-1 text-slate-200"
                      />
                      <span className="text-slate-400">A</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryopump Thermal Status (15 K cryo-panels) */}
              <div className="bg-[#0F172A] border border-[#1E293B] p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                      CRYOGENIC CONDENSATION ARRAYS
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">STATUS: REFRIGERATING</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-[#04060E] p-2 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">CRYO-A (15K)</span>
                    <span className="font-bold text-cyan-300">{cryoTempA} K</span>
                  </div>
                  <div className="bg-[#04060E] p-2 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">CRYO-B (15K)</span>
                    <span className="font-bold text-cyan-300">{cryoTempB} K</span>
                  </div>
                  <div className="bg-[#04060E] p-2 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">CRYO-C (15K)</span>
                    <span className="font-bold text-cyan-300">{cryoTempC} K</span>
                  </div>
                  <div className="bg-[#04060E] p-2 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">LN2 BAFFLE</span>
                    <span className="font-bold text-indigo-300">{ln2BaffleTemp} K</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          PANE 4: BOTTOM FARADAY CUP PROBE LEDGER & PROPELLANT ROSTER
         ========================================================================= */}
      {activeTab === 'deck' && (
        <section className="bg-[#0B0F17] border border-[#1E293B] p-4 md:p-5 flex flex-col gap-4 shadow-xl">
          {/* Header & Quick Action Trigger Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                FARADAY CUP PROBE SWEEP LEDGER & MASS FLOW TELEMETRY
              </h2>
            </div>

            {/* Quick Action Triggers Required by Brief */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleZeroFaradayRake}
                className="px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                ZERO FARADAY RAKE
              </button>
              <button
                onClick={handlePurgeSequence}
                className="px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                PURGE XENON LINE
              </button>
              <button
                onClick={handleCathodeIgnition}
                className="px-3.5 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                IGNITE HOLLOW CATHODE
              </button>
              <button
                onClick={() => setAutoSweepActive(prev => !prev)}
                className={`px-3.5 py-2 border text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  autoSweepActive
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-[#0F172A] border-slate-700 text-slate-300'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${autoSweepActive ? 'animate-spin' : ''}`} />
                {autoSweepActive ? 'SWEEP ACTIVE' : 'START MOTOR SWEEP'}
              </button>
              <button
                onClick={() => setExportModalOpen(true)}
                className="px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                EXPORT LEDGER
              </button>
            </div>
          </div>

          {/* Mass Flow Controller (MFC) Status Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#04060E] p-3 border border-[#1E293B]">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">MFC 1: INNER CHANNEL</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-cyan-400">{innerFlow.toFixed(2)}</span>
                <span className="text-xs text-slate-400">mg/s</span>
              </div>
              <span className="text-[10px] text-emerald-400">P_in: 38.4 psia</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">MFC 2: MIDDLE CHANNEL</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-cyan-400">{middleFlow.toFixed(2)}</span>
                <span className="text-xs text-slate-400">mg/s</span>
              </div>
              <span className="text-[10px] text-emerald-400">P_in: 38.4 psia</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">MFC 3: OUTER CHANNEL</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-cyan-400">{outerFlow.toFixed(2)}</span>
                <span className="text-xs text-slate-400">mg/s</span>
              </div>
              <span className="text-[10px] text-emerald-400">P_in: 38.4 psia</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">MFC 4: CATHODE EMITTER</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-amber-400">{actualCathodeFlow.toFixed(2)}</span>
                <span className="text-xs text-slate-400">mg/s</span>
              </div>
              <span className="text-[10px] text-emerald-400">P_in: 41.2 psia</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">XE BOTTLE RESERVE</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono text-slate-200">94.2</span>
                <span className="text-xs text-slate-400">kg (82%)</span>
              </div>
              <span className="text-[10px] text-slate-400">Tank P: 1,840 psig</span>
            </div>
          </div>

          {/* Faraday Sweep Tabular Log */}
          <div className="overflow-x-auto border border-[#1E293B]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-bold font-mono uppercase tracking-wider text-slate-300">
                  <th className="py-3 px-3">SWEEP ANGLE (θ)</th>
                  <th className="py-3 px-3">CURRENT DENSITY (j)</th>
                  <th className="py-3 px-3">ION FLUX</th>
                  <th className="py-3 px-3">PLASMA POTENTIAL (Vp)</th>
                  <th className="py-3 px-3">DIVERGENCE FRACTION</th>
                  <th className="py-3 px-3">TIMESTAMP</th>
                  <th className="py-3 px-3">PROBE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] bg-[#04060E]">
                {faradaySweepLedger.map((row, idx) => {
                  const isCurrentPosition = Math.abs(row.angle - rakeAngle) < 2.5;

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors font-mono text-xs md:text-sm ${
                        isCurrentPosition
                          ? 'bg-cyan-950/40 text-cyan-200 border-l-4 border-cyan-400 font-bold'
                          : 'hover:bg-[#0F172A]/50 text-slate-300'
                      }`}
                    >
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="tabular-nums font-bold">
                          {row.angle > 0 ? `+${row.angle.toFixed(1)}°` : `${row.angle.toFixed(1)}°`}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                        {row.currentDensity.toFixed(4)} mA/cm²
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                        {row.ionFlux.toFixed(2)} × 10¹⁶ cm⁻²s⁻¹
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                        {row.plasmaPotential.toFixed(1)} V
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                        {(row.divergenceFraction * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                        {row.timestamp}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {isCurrentPosition ? (
                          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/50 px-2 py-0.5">
                            COLLECTING NOW
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">LOCKED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: BEAM DIAGNOSTICS & DIVERGENCE ANALYSIS
         ========================================================================= */}
      {activeTab === 'diagnostics' && (
        <div className="bg-[#0B0F17] border border-[#1E293B] p-5 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-slate-100">
                FARADAY PROBE ANGULAR CURRENT PROFILE & DIVERGENCE ANALYSIS
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Collimated current density sweep across the plume expansion boundary (-60° to +60° off-axis)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('deck')}
              className="px-4 py-2 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-bold font-mono uppercase cursor-pointer"
            >
              RETURN TO TEST DECK
            </button>
          </div>

          {/* Graphical Histogram / Current Density Chart */}
          <div className="bg-[#04060E] border border-[#1E293B] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>CURRENT DENSITY PROFILE (mA/cm²) VS OFF-AXIS ANGLE (°)</span>
              <span className="text-cyan-400">90% TOTAL BEAM DIVERGENCE: 42.6°</span>
            </div>

            {/* Simulated Chart Bars across -60° to +60° */}
            <div className="h-64 flex items-end justify-between gap-1 border-b border-l border-slate-700 px-2 pb-1 pt-6 relative">
              {/* Centerline Axis Marker */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-cyan-400/40 border-r border-dashed border-cyan-400" />

              {faradaySweepLedger.map((pt, i) => {
                const maxVal = 11.0;
                const heightPct = Math.min(100, Math.max(4, (pt.currentDensity / maxVal) * 100));

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-slate-900 border border-cyan-400 text-cyan-200 text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {pt.angle}° : {pt.currentDensity.toFixed(3)} mA/cm²
                    </div>

                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full transition-all duration-300 ${
                        Math.abs(pt.angle) < 15
                          ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]'
                          : Math.abs(pt.angle) < 35
                          ? 'bg-indigo-400'
                          : 'bg-slate-600'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-slate-400 transform -rotate-45 origin-top-left mt-2">
                      {pt.angle}°
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 text-xs font-mono">
              <div className="bg-[#0F172A] p-3 border border-[#1E293B]">
                <span className="text-slate-400 text-[10px] block">PEAK CURRENT DENSITY</span>
                <span className="text-lg font-bold text-cyan-300">10.45 mA/cm²</span>
                <span className="text-[10px] text-slate-500 block">Measured at θ = 0.0°</span>
              </div>
              <div className="bg-[#0F172A] p-3 border border-[#1E293B]">
                <span className="text-slate-400 text-[10px] block">MASS UTILIZATION EFFICIENCY</span>
                <span className="text-lg font-bold text-emerald-400">92.4%</span>
                <span className="text-[10px] text-slate-500 block">Xe ionization fraction</span>
              </div>
              <div className="bg-[#0F172A] p-3 border border-[#1E293B]">
                <span className="text-slate-400 text-[10px] block">ELECTRICAL EFFICIENCY</span>
                <span className="text-lg font-bold text-amber-400">71.8%</span>
                <span className="text-[10px] text-slate-500 block">Thrust power / Total power</span>
              </div>
              <div className="bg-[#0F172A] p-3 border border-[#1E293B]">
                <span className="text-slate-400 text-[10px] block">TOTAL ION BEAM CURRENT</span>
                <span className="text-lg font-bold text-slate-100">248.5 A</span>
                <span className="text-[10px] text-slate-500 block">Integrated over hemispherical arc</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VACUUM & PROPELLANT P&ID MANIFOLD
         ========================================================================= */}
      {activeTab === 'manifold' && (
        <div className="bg-[#0B0F17] border border-[#1E293B] p-5 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-slate-100">
                VF6 VACUUM FACILITY & XENON PROPELLANT FEED P&ID
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Piping and instrumentation diagram showing high-pressure Xe delivery, gas regulators, and roughing/cryo isolation valves
              </p>
            </div>
            <button
              onClick={() => setActiveTab('deck')}
              className="px-4 py-2 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-bold font-mono uppercase cursor-pointer"
            >
              RETURN TO TEST DECK
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Xenon High-Purity Supply Train */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-4 flex flex-col gap-3">
              <span className="text-xs font-bold font-mono uppercase text-slate-200 border-b border-slate-700 pb-2">
                1. XENON PROP FEED TRAIN (99.999% XE)
              </span>
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">BOTTLE BANK PRESSURE:</span>
                  <span className="font-bold text-slate-100">1,840 psig</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">REGULATOR STAGE 1:</span>
                  <span className="font-bold text-slate-100">150 psig</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">MANIFOLD DELIVERY:</span>
                  <span className="font-bold text-cyan-300">38.4 psia</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">PURITY FILTER DP:</span>
                  <span className="font-bold text-emerald-400">0.12 psid (CLEAN)</span>
                </div>
              </div>
            </div>

            {/* Cryogenic Pumping Arrays */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-4 flex flex-col gap-3">
              <span className="text-xs font-bold font-mono uppercase text-slate-200 border-b border-slate-700 pb-2">
                2. 15K CRYO-PANELS & SHROUD
              </span>
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">CRYO ARRAY SPEED:</span>
                  <span className="font-bold text-slate-100">350,000 L/s (Xe)</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">PANEL TEMPERATURE:</span>
                  <span className="font-bold text-cyan-300">14.85 K</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">LN2 SHROUD FLOW:</span>
                  <span className="font-bold text-indigo-300">22.4 L/min (77 K)</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">XENON FROST ACCUMULATION:</span>
                  <span className="font-bold text-amber-300">1.42 kg (SAFE)</span>
                </div>
              </div>
            </div>

            {/* Roughing & Turbomolecular Vacuum Train */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-4 flex flex-col gap-3">
              <span className="text-xs font-bold font-mono uppercase text-slate-200 border-b border-slate-700 pb-2">
                3. ROUGHING & GATE VALVE INTERLOCKS
              </span>
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">MAIN GATE VALVE (36"):</span>
                  <span className="font-bold text-emerald-400">{gateValveOpen ? 'OPEN' : 'ISOLATED'}</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">ROOTS BLOWER RPM:</span>
                  <span className="font-bold text-slate-100">3,450 RPM</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">TURBO BACKING PRESSURE:</span>
                  <span className="font-bold text-slate-100">8.5e-5 Torr</span>
                </div>
                <div className="flex justify-between bg-[#04060E] p-2 border border-slate-800">
                  <span className="text-slate-400">CHAMBER ROUGH GAUGE:</span>
                  <span className="font-bold text-emerald-400">NOMINAL OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: INCIDENT & TRIP EVENT HISTORY
         ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-[#0B0F17] border border-[#1E293B] p-5 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wider uppercase text-slate-100">
                FACILITY INCIDENT, ARC DETECTION & FAST-TRIP LOGS
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Real-time safety interlock events, PPU snubber trip records, and thermal alarms
              </p>
            </div>
            <button
              onClick={() => setActiveTab('deck')}
              className="px-4 py-2 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-bold font-mono uppercase cursor-pointer"
            >
              RETURN TO TEST DECK
            </button>
          </div>

          <div className="overflow-x-auto border border-[#1E293B]">
            <table className="w-full text-left border-collapse font-mono text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  <th className="py-3 px-3">EVENT ID</th>
                  <th className="py-3 px-3">TIME</th>
                  <th className="py-3 px-3">CODE</th>
                  <th className="py-3 px-3">SEVERITY</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3">DETAILS</th>
                  <th className="py-3 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] bg-[#04060E]">
                {incidentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0F172A]/50">
                    <td className="py-3.5 px-3 font-bold text-slate-200">{log.id}</td>
                    <td className="py-3.5 px-3 text-slate-400">{log.time}</td>
                    <td className="py-3.5 px-3 text-cyan-300 font-bold">{log.code}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 border ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border-rose-500'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border-amber-500'
                            : 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{log.type}</td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-md">{log.message}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {log.resolved ? 'RESOLVED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EMERGENCY FAST-TRIP CONFIRMATION
         ========================================================================= */}
      {fastTripModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border-2 border-rose-600 max-w-lg w-full p-6 shadow-[0_0_50px_rgba(225,29,72,0.8)] flex flex-col gap-4">
            <div className="flex items-center gap-3 text-rose-500 border-b border-rose-900/60 pb-3">
              <AlertOctagon className="w-8 h-8 animate-bounce" />
              <div>
                <h3 className="text-lg font-black font-mono tracking-wider uppercase text-rose-100">
                  CONFIRM EMERGENCY HIGH-VOLTAGE FAST-TRIP
                </h3>
                <span className="text-xs font-mono text-rose-400">INSTITUTIONAL SAFETY INTERLOCK DIRECTIVE</span>
              </div>
            </div>

            <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
              Initiating Fast-Trip will immediately dump all 3 discharge stages (Inner, Middle, Outer) to earth ground
              via high-speed crowbar thyristors (&lt;5 microseconds), slam shut the pneumatic xenon isolation valves,
              and extinguish the central hollow cathode emitter.
            </p>

            <div className="bg-[#04060E] border border-rose-950 p-3 text-xs font-mono text-slate-400 space-y-1">
              <div>• Discharge Power: <span className="text-rose-400">{dischargePowerKw.toFixed(1)} kW → 0.0 kW</span></div>
              <div>• Chamber Pressure: <span className="text-emerald-400">1.4e-6 Torr (Safe)</span></div>
              <div>• Active Channels: <span className="text-rose-400">All 3 Rings will be Isolated</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFastTripModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono tracking-wider uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={executeFastTrip}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black font-mono text-xs md:text-sm tracking-widest uppercase border border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.8)] cursor-pointer"
              >
                CONFIRM FAST-TRIP SCRAM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PURGE XENON LINE SEQUENCE
         ========================================================================= */}
      {purgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-amber-500/60 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-amber-400 border-b border-[#1E293B] pb-3">
              <Wind className="w-6 h-6 animate-spin" />
              <div>
                <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                  XENON LINE PURGE SEQUENCE IN PROGRESS
                </h3>
                <span className="text-xs font-mono text-amber-400">STAGE VACUUM FLUSH & BLEED</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Purge Cycle Completion</span>
                <span className="font-bold text-amber-400">{purgeProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${purgeProgress}%` }}
                />
              </div>
            </div>

            <div className="text-xs font-mono text-slate-300 space-y-1 bg-[#04060E] p-3 border border-slate-800">
              <div>• Step 1: Evacuate line to 10⁻⁴ Torr: {purgeProgress > 20 ? '✓' : '...'}</div>
              <div>• Step 2: High-purity Xe gas sweep: {purgeProgress > 50 ? '✓' : '...'}</div>
              <div>• Step 3: Vent residual contamination: {purgeProgress > 80 ? '✓' : '...'}</div>
              <div>• Step 4: Reseal regulator at 38.4 psia: {purgeProgress === 100 ? '✓' : '...'}</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: HOLLOW CATHODE IGNITION STATE MACHINE
         ========================================================================= */}
      {cathodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-cyan-500/60 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-[#1E293B] pb-3">
              <Flame className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                  IGNITING HOLLOW CATHODE EMITTER
                </h3>
                <span className="text-xs font-mono text-cyan-300">THERMIONIC ARREST STRIKE</span>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono bg-[#04060E] p-4 border border-slate-800">
              <div className={`flex items-center gap-2 ${cathodeIgniteStep >= 1 ? 'text-cyan-300' : 'text-slate-500'}`}>
                <span>{cathodeIgniteStep >= 1 ? '●' : '○'}</span>
                <span>STEP 1: Ramping Heater Current to 7.20 A (T &gt; 1,300 K)</span>
              </div>
              <div className={`flex items-center gap-2 ${cathodeIgniteStep >= 2 ? 'text-amber-300' : 'text-slate-500'}`}>
                <span>{cathodeIgniteStep >= 2 ? '●' : '○'}</span>
                <span>STEP 2: Pulsing High-Voltage Keeper Bias (120 V ignition strike)</span>
              </div>
              <div className={`flex items-center gap-2 ${cathodeIgniteStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span>{cathodeIgniteStep >= 3 ? '●' : '○'}</span>
                <span>STEP 3: Thermionic Arc Transfer Sustained (Keeper V: 18.4 V)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: EXPORT TELEMETRY SNAPSHOT
         ========================================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-cyan-500/60 max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Download className="w-5 h-5" />
                <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                  EXPORT TELEMETRY FLIGHT LOG
                </h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300">
              Generate an institutional test flight deck snapshot compatible with NASA Glenn / AFRL data reduction systems.
            </p>

            <div className="bg-[#04060E] border border-slate-800 p-3 text-[11px] font-mono text-slate-400 space-y-1">
              <div>• Campaign ID: <span className="text-slate-200">NASA-GRC-VF6-X3-CY26-004</span></div>
              <div>• Thruster Model: <span className="text-slate-200">X3 100kW Nested-Channel Hall Thruster</span></div>
              <div>• Total Thrust: <span className="text-cyan-300">{totalThrustNewtons.toFixed(3)} N</span></div>
              <div>• Discharge Power: <span className="text-amber-300">{dischargePowerKw.toFixed(2)} kW</span></div>
              <div>• Faraday Data Points: <span className="text-slate-200">{faradaySweepLedger.length} Records</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  // Generate downloadable JSON
                  const exportPayload = {
                    campaign: 'NASA-GRC-VF6-X3-CY26-004',
                    timestamp: new Date().toISOString(),
                    thrustNewtons: totalThrustNewtons,
                    ispSeconds,
                    dischargePowerKw,
                    dischargeVoltage,
                    chamberVacuumTorr: vacuumPressureTorr,
                    totalMassFlowMgs,
                    activeChannels: channelActive,
                    faradayLedger: faradaySweepLedger,
                  };
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `X3_100kW_Telemetry_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  setExportModalOpen(false);
                  showToast('TELEMETRY RECORD DOWNLOADED SUCCESSFULLY');
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs uppercase cursor-pointer"
              >
                DOWNLOAD JSON ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HallThrusterControl;
