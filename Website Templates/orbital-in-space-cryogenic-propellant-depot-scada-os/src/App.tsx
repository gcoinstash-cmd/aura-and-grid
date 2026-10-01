/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Satellite,
  Gauge,
  Thermometer,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Droplets,
  RotateCw,
  RefreshCw,
  Sun,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Pause,
  Download,
  Terminal,
  Sliders,
  X,
  CheckCircle2,
  Cpu,
  Radio,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// ============================================================================
// Institutional Types & Interfaces
// ============================================================================
interface TankState {
  code: string;
  fluid: 'LOX' | 'LCH4';
  capacityTonnes: number;
  massTonnes: number;
  fillPct: number;
  ullagePressureKpa: number;
  tempK: number;
  boilOffRateKgHr: number;
  targetTempK: number;
  reliefValveOpen: boolean;
}

interface CryoLoopState {
  coolerPowerKw: number;
  boilOffVentRateTrim: number;
  tvsPumpActive: boolean;
  coldheadTempK: number;
  heatExchangerDeltaTK: number;
  jtValvePct: number;
  compressorRpm: number;
  compressorPowerKw: number;
  settlementStabilityPct: number;
  qdSealTempK: number;
  heliumPurgeActive: boolean;
  leakRateSccm: number;
}

interface TransferSession {
  targetVehicle: string;
  port: number;
  propellant: 'LOX' | 'LCH4' | 'DUAL';
  targetMassTonnes: number;
  transferredMassTonnes: number;
  flowRateKgMin: number;
  stage: 'STANDBY' | 'CHILLDOWN' | 'PRESSURE_EQ' | 'FLOWING' | 'PURGING' | 'COMPLETED';
  active: boolean;
}

interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  severity: 'NOMINAL' | 'INFO' | 'CAUTION' | 'CRITICAL';
  source: string;
  message: string;
}

// ============================================================================
// Main Application Component
// ============================================================================
export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'CROSS_SECTION' | 'THERMODYNAMICS' | 'TRANSFER' | 'EVENTS'>('CROSS_SECTION');

  // Master Clock & Elapsed Time
  const [metSeconds, setMetSeconds] = useState<number>(3154820);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Solar Aspect Angle (0 to 180 deg)
  const [sunAspectAngle, setSunAspectAngle] = useState<number>(42);

  // Tanks State
  const [tanks, setTanks] = useState<{ LOX: TankState; LCH4: TankState }>({
    LOX: {
      code: 'TANK-01-LOX',
      fluid: 'LOX',
      capacityTonnes: 151.5,
      massTonnes: 142.4,
      fillPct: 94.0,
      ullagePressureKpa: 240.2,
      tempK: 90.15,
      targetTempK: 90.10,
      boilOffRateKgHr: 0.012,
      reliefValveOpen: false,
    },
    LCH4: {
      code: 'TANK-02-LCH4',
      fluid: 'LCH4',
      capacityTonnes: 52.4,
      massTonnes: 48.2,
      fillPct: 92.0,
      ullagePressureKpa: 238.8,
      tempK: 111.45,
      targetTempK: 111.40,
      boilOffRateKgHr: 0.018,
      reliefValveOpen: false,
    }
  });

  // Cryocooler & Subsystem State
  const [cryoLoop, setCryoLoop] = useState<CryoLoopState>({
    coolerPowerKw: 4.2,
    boilOffVentRateTrim: 0.02,
    tvsPumpActive: true,
    coldheadTempK: 20.4,
    heatExchangerDeltaTK: 1.4,
    jtValvePct: 38.5,
    compressorRpm: 18400,
    compressorPowerKw: 4.2,
    settlementStabilityPct: 99.2,
    qdSealTempK: 92.0,
    heliumPurgeActive: false,
    leakRateSccm: 0.0084,
  });

  // Chaser Transfer State
  const [transfer, setTransfer] = useState<TransferSession>({
    targetVehicle: 'CHASER-ORION-FREIGHTER-9',
    port: 2,
    propellant: 'DUAL',
    targetMassTonnes: 35.0,
    transferredMassTonnes: 12.45,
    flowRateKgMin: 120.0,
    stage: 'FLOWING',
    active: true,
  });

  // Telemetry Audit Logs
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([
    { id: 'LOG-101', timestamp: '02:35:12.82', severity: 'NOMINAL', source: 'CRYO-PULSE-BRAYTON', message: 'Coldhead thermal lock locked at 20.40 K.' },
    { id: 'LOG-102', timestamp: '02:35:18.45', severity: 'INFO', source: 'TVS-SPRAY-BAR', message: 'Subcooling injection delta-T stabilized at 1.40 K.' },
    { id: 'LOG-103', timestamp: '02:35:24.11', severity: 'NOMINAL', source: 'QD-COUPLER-PORT-2', message: 'Cryo mechanical seal leak rate holding 0.0084 sccm.' },
    { id: 'LOG-104', timestamp: '02:35:32.90', severity: 'NOMINAL', source: 'RCS-ULLAGE-SETTLE', message: 'Interfacial acceleration 0.0150 g sustained. Slosh damping 99.2%.' },
    { id: 'LOG-105', timestamp: '02:35:40.04', severity: 'CAUTION', source: 'THERMAL-SUNSHIELD', message: 'Sun aspect yaw deflection +2.4° from solar optimum.' }
  ]);

  // Modals & Panels
  const [showRecalibrateModal, setShowRecalibrateModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recalibrate Draft State in Modal
  const [draftPowerKw, setDraftPowerKw] = useState<number>(4.2);
  const [draftVentTrim, setDraftVentTrim] = useState<number>(0.02);
  const [draftTvsPump, setDraftTvsPump] = useState<boolean>(true);

  // Emergency Modal Dual Verification State
  const [key1Armed, setKey1Armed] = useState<boolean>(false);
  const [key2Armed, setKey2Armed] = useState<boolean>(false);
  const [emergencyIsolationActive, setEmergencyIsolationActive] = useState<boolean>(false);

  // Sub-millisecond tick & simulated dynamic telemetry
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(
        now.toISOString().replace('T', ' ').substring(11, 23) + ' UTC'
      );
      setMetSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Micro-fluctuation telemetry loop (realistic sensor jitter & thermodynamic model)
  useEffect(() => {
    const jitterInterval = setInterval(() => {
      // Solar flux effect based on sun aspect angle
      // Sun aspect angle near 0° or 180° exposes unshielded hull
      const solarCosine = Math.cos((sunAspectAngle * Math.PI) / 180);
      const heatFluxFactor = Math.max(0.2, Math.abs(solarCosine));
      const jitter = (Math.random() - 0.5) * 0.02;

      setTanks((prev) => {
        const loxP = Number((240.2 + jitter * 2 + (heatFluxFactor - 0.5) * 1.5).toFixed(2));
        const lch4P = Number((238.8 + jitter * 2 + (heatFluxFactor - 0.5) * 1.2).toFixed(2));
        const loxT = Number((90.15 + jitter * 0.1).toFixed(2));
        const lch4T = Number((111.45 + jitter * 0.1).toFixed(2));

        // If transfer active, slowly increment transferred mass
        return {
          LOX: {
            ...prev.LOX,
            ullagePressureKpa: loxP,
            tempK: loxT,
          },
          LCH4: {
            ...prev.LCH4,
            ullagePressureKpa: lch4P,
            tempK: lch4T,
          }
        };
      });

      // Compressors & loops jitter
      setCryoLoop((prev) => {
        const rpmJitter = Math.floor((Math.random() - 0.5) * 40);
        return {
          ...prev,
          compressorRpm: Math.min(22000, Math.max(16000, prev.compressorRpm + rpmJitter)),
          coldheadTempK: Number((20.4 + (Math.random() - 0.5) * 0.05).toFixed(2)),
          heatExchangerDeltaTK: Number((1.4 + (Math.random() - 0.5) * 0.04).toFixed(2)),
        };
      });

      // Transfer progress if active
      setTransfer((prev) => {
        if (!prev.active || prev.stage !== 'FLOWING') return prev;
        const addTonnes = (prev.flowRateKgMin / 60 / 1000) * 0.4;
        const newTransferred = Math.min(prev.targetMassTonnes, prev.transferredMassTonnes + addTonnes);
        const stage = newTransferred >= prev.targetMassTonnes ? 'COMPLETED' : prev.stage;
        return {
          ...prev,
          transferredMassTonnes: Number(newTransferred.toFixed(3)),
          stage: stage as any,
          active: stage !== 'COMPLETED'
        };
      });
    }, 400);

    return () => clearInterval(jitterInterval);
  }, [sunAspectAngle]);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Format Mission Elapsed Time (MET)
  const formatMet = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `T+${String(days).padStart(3, '0')}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  // Execute Recalibrate Modal Changes
  const handleCommitRecalibration = () => {
    const powerLift = (draftPowerKw / 4.2);
    const newLoxTemp = Number((90.15 - (draftPowerKw - 4.2) * 0.08).toFixed(2));
    const newLch4Temp = Number((111.45 - (draftPowerKw - 4.2) * 0.10).toFixed(2));
    const newUllageLox = Number((240.2 - (draftPowerKw - 4.2) * 1.8 - draftVentTrim * 20).toFixed(2));
    const newUllageLch4 = Number((238.8 - (draftPowerKw - 4.2) * 1.6 - draftVentTrim * 18).toFixed(2));

    setCryoLoop((prev) => ({
      ...prev,
      coolerPowerKw: draftPowerKw,
      boilOffVentRateTrim: draftVentTrim,
      tvsPumpActive: draftTvsPump,
      coldheadTempK: Number((20.40 - (draftPowerKw - 4.2) * 0.35).toFixed(2)),
      compressorRpm: Math.round(18400 * Math.sqrt(powerLift)),
      compressorPowerKw: draftPowerKw,
    }));

    setTanks((prev) => ({
      LOX: {
        ...prev.LOX,
        ullagePressureKpa: Math.max(210, newUllageLox),
        tempK: newLoxTemp,
        boilOffRateKgHr: Number(Math.max(0.002, 0.012 - (draftPowerKw - 4.2) * 0.002).toFixed(3))
      },
      LCH4: {
        ...prev.LCH4,
        ullagePressureKpa: Math.max(210, newUllageLch4),
        tempK: newLch4Temp,
        boilOffRateKgHr: Number(Math.max(0.003, 0.018 - (draftPowerKw - 4.2) * 0.003).toFixed(3))
      }
    }));

    const newLog: TelemetryLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'INFO',
      source: 'RECAL-CRYO-LOOP',
      message: `Thermal re-alignment executed. Cryo-lift set to ${draftPowerKw.toFixed(1)} kW, TVS pump: ${draftTvsPump ? 'ONLINE' : 'OFFLINE'}.`
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    setShowRecalibrateModal(false);
    triggerToast(`THERMAL RE-ALIGNMENT COMMITTED: Cooler lift ${draftPowerKw.toFixed(1)} kW. Ullage pressure adjusted.`);
  };

  // Execute Emergency Vent Isolation
  const handleExecuteEmergencyIsolation = () => {
    if (!key1Armed || !key2Armed) return;
    setEmergencyIsolationActive(true);
    setTanks((prev) => ({
      LOX: { ...prev.LOX, reliefValveOpen: true, ullagePressureKpa: 215.0 },
      LCH4: { ...prev.LCH4, reliefValveOpen: true, ullagePressureKpa: 212.0 }
    }));
    setTransfer((prev) => ({ ...prev, active: false, stage: 'STANDBY' }));

    const newLog: TelemetryLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      severity: 'CRITICAL',
      source: 'EMERGENCY-INTERLOCK',
      message: 'PYRO-ISOLATION VALVES FIRED. Depot manifold isolated. Rapid relief dump open.'
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    setShowEmergencyModal(false);
    triggerToast('CRITICAL ACTION: EMERGENCY ISOLATION ENGAGED. Pyro valves sealed. Relief open.');
  };

  // Reset Emergency Isolation
  const handleResetEmergency = () => {
    setEmergencyIsolationActive(false);
    setKey1Armed(false);
    setKey2Armed(false);
    setTanks((prev) => ({
      LOX: { ...prev.LOX, reliefValveOpen: false, ullagePressureKpa: 240.2 },
      LCH4: { ...prev.LCH4, reliefValveOpen: false, ullagePressureKpa: 238.8 }
    }));
    triggerToast('EMERGENCY RELIEF RESET: Depot return to closed autonomous loop.');
  };

  // Calculated Boil-off Margin based on sun angle & cooler power
  const calculatedBoilOffMarginPct = useMemo(() => {
    // 90 deg is direct edge-on (maximum shield protection), 0 or 180 is hull exposure
    const shieldEfficiency = Math.sin((sunAspectAngle * Math.PI) / 180);
    const powerBonus = (cryoLoop.coolerPowerKw - 4.2) * 2;
    const margin = 88.0 + shieldEfficiency * 10.0 + powerBonus;
    return Number(Math.min(99.9, Math.max(72.0, margin)).toFixed(1));
  }, [sunAspectAngle, cryoLoop.coolerPowerKw]);

  // Export Telemetry Data to CSV
  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Severity,Source,Message\n';
    const csvContent = logs.map((l) => `"${l.id}","${l.timestamp}","${l.severity}","${l.source}","${l.message.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DEPOT-SCADA-TELEMETRY-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
    triggerToast('TELEMETRY EXPORT COMPLETE: CSV manifest downloaded.');
  };

  return (
    <>
      <div className="min-h-screen bg-[#040812] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col justify-between">
        
        {/* ================================================================== */}
        {/* HEADER / TOP METADATA HUD BAR                                      */}
        {/* ================================================================== */}
        <header className="border-b border-slate-800/80 bg-[#070D1A]/90 backdrop-blur px-4 py-2.5 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            
            {/* Branding & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Satellite className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-wider uppercase text-slate-100 font-mono">
                    Orbital Cryogenic Depot SCADA OS
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider font-mono rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    REV 4.9.1
                  </span>
                  {emergencyIsolationActive && (
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono rounded bg-rose-950 text-rose-300 border border-rose-600 animate-pulse flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" /> ISOLATION ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-cyan-400/90 tracking-tight">
                  Zero-Boil-Off (ZBO) Methalox Refueling Node • LEO 450 km
                </p>
              </div>
            </div>

            {/* Sub-millisecond Telemetry Clocks & Quick Badges */}
            <div className="flex items-center flex-wrap gap-4 font-mono text-xs">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Mission Elapsed Time</span>
                <span className="text-cyan-300 font-semibold">{formatMet(metSeconds)}</span>
              </div>

              <div className="flex flex-col text-right pl-3 border-l border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 tracking-wider">UTC Telemetry</span>
                <span className="text-emerald-400 font-semibold">{currentTimeStr || '12:00:00.00 UTC'}</span>
              </div>

              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-2.5 py-1 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
                  title="Export telemetry snapshots"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPORT</span>
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* ================================================================== */}
        {/* OPERATIONAL ORBIT RIBBON (REQUIREMENT 1)                          */}
        {/* ================================================================== */}
        <section className="bg-[#091122] border-b border-slate-800 px-4 py-3 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
            
            {/* Station Coordinates & Status Ribbons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 flex-1">
              {/* Ribbon 1: Node & Orbit */}
              <div className="bg-[#040812]/70 p-2.5 rounded border border-slate-800/90 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-slate-400 tracking-widest flex items-center gap-1">
                  <Satellite className="w-3 h-3 text-cyan-400" /> Node & Orbit
                </span>
                <div className="mt-1">
                  <div className="text-cyan-200 font-bold truncate">Aura-Depot-Alpha Station 01</div>
                  <div className="text-slate-400 text-[11px]">450 km Circular • Inc 28.5°</div>
                </div>
              </div>

              {/* Ribbon 2: Mode & Port */}
              <div className="bg-[#040812]/70 p-2.5 rounded border border-slate-800/90 flex flex-col justify-between">
                <span className="text-[10px] uppercase text-slate-400 tracking-widest flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" /> Station Guidance
                </span>
                <div className="mt-1">
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Autonomous Robotic
                  </div>
                  <div className="text-slate-300 text-[11px] truncate">
                    Port 2: Active (Chaser Docked)
                  </div>
                </div>
              </div>

              {/* Ribbon 3: Mass Balance LOX */}
              <div className="bg-[#040812]/70 p-2.5 rounded border border-slate-800/90 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] uppercase text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Droplets className="w-3 h-3" /> LOX Tank Mass
                  </span>
                  <span className="text-cyan-300 font-semibold">{tanks.LOX.fillPct}%</span>
                </div>
                <div className="mt-1">
                  <div className="text-slate-100 font-bold">{tanks.LOX.massTonnes.toFixed(1)} tonnes</div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-800">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      style={{ width: `${tanks.LOX.fillPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Ribbon 4: Mass Balance LCH4 & Pressure */}
              <div className="bg-[#040812]/70 p-2.5 rounded border border-slate-800/90 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] uppercase text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Droplets className="w-3 h-3" /> LCH4 Tank Mass
                  </span>
                  <span className="text-amber-300 font-semibold">{tanks.LCH4.fillPct}%</span>
                </div>
                <div className="mt-1">
                  <div className="text-slate-100 font-bold">{tanks.LCH4.massTonnes.toFixed(1)} tonnes</div>
                  <div className="text-slate-400 text-[11px] flex justify-between">
                    <span>Ullage: {tanks.LOX.ullagePressureKpa.toFixed(1)} kPa</span>
                    <span className="text-emerald-400 font-semibold">ZBO Locked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Action CTAs (Requirement 1) */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              {/* Recalibrate CTA */}
              <button
                onClick={() => {
                  setDraftPowerKw(cryoLoop.coolerPowerKw);
                  setDraftVentTrim(cryoLoop.boilOffVentRateTrim);
                  setDraftTvsPump(cryoLoop.tvsPumpActive);
                  setShowRecalibrateModal(true);
                }}
                className="flex-1 lg:flex-initial px-3.5 py-2 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition active:scale-95 text-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>+ RECALIBRATE CRYO-COOLER LOOP</span>
              </button>

              {/* Initiate Chaser Transfer CTA */}
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex-1 lg:flex-initial px-3.5 py-2 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition active:scale-95 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${transfer.active ? 'animate-spin' : ''}`} />
                <span>INITIATE CHASER TRANSFER</span>
              </button>

              {/* Emergency Vent Isolation CTA */}
              <button
                onClick={() => setShowEmergencyModal(true)}
                className={`flex-1 lg:flex-initial px-3.5 py-2 rounded font-bold tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 text-xs ${
                  emergencyIsolationActive
                    ? 'bg-rose-900 text-white border border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.4)] animate-pulse'
                    : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 hover:border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>EMERGENCY VENT ISOLATION</span>
              </button>
            </div>

          </div>
        </section>

        {/* ================================================================== */}
        {/* TOAST POPUP NOTIFICATION                                           */}
        {/* ================================================================== */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900/95 border border-cyan-500 text-slate-100 px-4 py-3 rounded-lg shadow-2xl backdrop-blur flex items-start gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <div className="font-bold text-cyan-300 uppercase tracking-wider">SCADA Telemetry Event</div>
              <p className="mt-0.5 text-slate-300">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* SUB-NAV TABS                                                       */}
        {/* ================================================================== */}
        <div className="bg-[#050B16] border-b border-slate-800/80 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('CROSS_SECTION')}
              className={`px-4 py-2 border-b-2 font-semibold tracking-wider flex items-center gap-2 transition ${
                activeTab === 'CROSS_SECTION'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>DEPOT CROSS-SECTION & FLOWFIELD</span>
            </button>

            <button
              onClick={() => setActiveTab('THERMODYNAMICS')}
              className={`px-4 py-2 border-b-2 font-semibold tracking-wider flex items-center gap-2 transition ${
                activeTab === 'THERMODYNAMICS'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>THERMODYNAMICS & TVS LOOPS</span>
            </button>

            <button
              onClick={() => setActiveTab('TRANSFER')}
              className={`px-4 py-2 border-b-2 font-semibold tracking-wider flex items-center gap-2 transition ${
                activeTab === 'TRANSFER'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>CHASER DOCKING & MASS TRANSFER</span>
            </button>

            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`px-4 py-2 border-b-2 font-semibold tracking-wider flex items-center gap-2 transition ${
                activeTab === 'EVENTS'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>TELEMETRY FAULT MATRIX ({logs.length})</span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* MAIN OPERATIONAL WORKSPACE                                         */}
        {/* ================================================================== */}
        <main className="max-w-7xl mx-auto px-4 py-3 sm:py-4 w-full flex-1 flex flex-col gap-4">

          {/* TAB 1: DEPOT CROSS SECTION & FLOWFIELD (Primary visualizer) */}
          {activeTab === 'CROSS_SECTION' && (
            <div className="flex flex-col gap-4">
              
              {/* Visualizer & Sun Shield Control Container */}
              <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-3.5 sm:p-4 shadow-2xl relative overflow-hidden">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
                      <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
                        Cryogenic Depot Cross-Section & Thermodynamic Flowfield
                      </h2>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Pulse Tube Brayton Chilling Loop • Vacuum Jacket Shell • Active Multi-Layer Insulation
                    </p>
                  </div>

                  {/* Sun Aspect Angle Interactive Slider Control */}
                  <div className="bg-[#050A14] border border-slate-700/80 rounded-lg p-2.5 w-full lg:w-96 flex flex-col gap-1 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '18s' }} />
                        Sun Aspect Angle (Yaw/Pitch)
                      </span>
                      <span className="text-slate-100 font-bold px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                        {sunAspectAngle}° ({sunAspectAngle < 60 || sunAspectAngle > 120 ? 'HIGH HEAT LEAK' : 'OPTIMAL SHADE'})
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={180}
                      value={sunAspectAngle}
                      onChange={(e) => setSunAspectAngle(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                    />

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>0° Solar Direct</span>
                      <span className="text-emerald-400">90° Edge Shielding</span>
                      <span>180° Direct Aft</span>
                    </div>

                    <div className="mt-0.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Boil-Off Margin:</span>
                      <span className={`font-bold ${calculatedBoilOffMarginPct > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {calculatedBoilOffMarginPct}% (ZBO Margin: +{(calculatedBoilOffMarginPct - 80).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive SVG Diagram Cross Section */}
                <div className="relative mt-2.5 w-full h-[260px] sm:h-[295px] max-h-[320px] bg-[#02050E] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                  
                  {/* Solar Flux Vectors Dynamic Visualization based on sunAspectAngle */}
                  <div 
                    className="absolute top-4 left-4 transition-transform duration-300 pointer-events-none flex flex-col gap-1 z-20"
                    style={{
                      transform: `rotate(${sunAspectAngle - 90}deg) scale(0.95)`,
                      transformOrigin: '20px 20px'
                    }}
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-amber-500/40">
                      <Sun className="w-3 h-3" />
                      <span>SOLAR FLUX: 1,361 W/m²</span>
                    </div>
                    <div className="flex gap-2 text-amber-500/70">
                      <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent animate-pulse"></div>
                      <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent animate-pulse"></div>
                      <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent animate-pulse"></div>
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 1000 480"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Gradient LOX Liquid */}
                      <linearGradient id="loxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0891B2" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#0E7490" stopOpacity="0.95" />
                      </linearGradient>

                      {/* Gradient LCH4 Liquid */}
                      <linearGradient id="lch4Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D97706" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#B45309" stopOpacity="0.95" />
                      </linearGradient>

                      {/* Vacuum Jacket Gradient */}
                      <linearGradient id="vacuumJacketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E293B" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#334155" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#1E293B" stopOpacity="0.6" />
                      </linearGradient>

                      {/* Brayton Chilling Loop Glow */}
                      <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Sun-Shield Multi-Layer Insulation (MLI) Bow & Dynamic Rotating Angle Line */}
                    <g 
                      transform={`rotate(${sunAspectAngle - 90}, 500, 240)`}
                      className="transition-transform duration-300 ease-out"
                    >
                      {/* Sun Aspect Angle Normal Line */}
                      <line
                        x1="500"
                        y1="240"
                        x2="500"
                        y2="40"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        className="opacity-75"
                      />
                      <circle cx="500" cy="40" r="4.5" fill="#10B981" />

                      {/* Deployable Shield Bow Arc */}
                      <path
                        d="M 140 85 Q 500 30 860 85"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="5"
                        strokeDasharray="6 3"
                        className="opacity-90"
                      />
                      <path
                        d="M 150 95 Q 500 42 850 95"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        className="opacity-80"
                      />

                      {/* Shield End-Cap Indicators */}
                      <line x1="140" y1="75" x2="140" y2="95" stroke="#10B981" strokeWidth="2.5" />
                      <line x1="860" y1="75" x2="860" y2="95" stroke="#10B981" strokeWidth="2.5" />

                      <text x="500" y="62" fill="#10B981" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        DEPLOYABLE SUN-SHIELD • ANGLE {sunAspectAngle}° [60-LAYER MLI]
                      </text>
                    </g>

                    {/* Depot Outer Vacuum Shell & Truss Structure */}
                    <rect
                      x="160"
                      y="110"
                      width="680"
                      height="260"
                      rx="40"
                      fill="url(#vacuumJacketGrad)"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />

                    {/* Truss reinforcement lines */}
                    <line x1="200" y1="110" x2="260" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="260" y1="110" x2="200" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="470" y1="110" x2="530" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="530" y1="110" x2="470" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="740" y1="110" x2="800" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="800" y1="110" x2="740" y2="370" stroke="#1E293B" strokeWidth="2" strokeDasharray="4 4" />

                    {/* ====================================================== */}
                    {/* TANK 1: LOX CRYO TANK (LEFT)                           */}
                    {/* ====================================================== */}
                    <g>
                      {/* Vacuum barrier outer */}
                      <rect
                        x="200"
                        y="140"
                        width="240"
                        height="200"
                        rx="30"
                        fill="#0A111F"
                        stroke="#0284C7"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />

                      {/* LOX Ullage Gas Region (Top) */}
                      <path
                        d="M 205 170 C 205 145 220 145 240 145 L 400 145 C 420 145 435 145 435 170 L 435 180 L 205 180 Z"
                        fill="#0E2F44"
                        className="animate-pulse"
                      />
                      <text x="320" y="165" fill="#38BDF8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        LOX ULLAGE ({tanks.LOX.ullagePressureKpa.toFixed(1)} kPa • {tanks.LOX.tempK.toFixed(1)} K)
                      </text>

                      {/* LOX Liquid Mass (Dynamic Fill based on tanks.LOX.fillPct) */}
                      <path
                        d="M 205 180 L 435 180 L 435 310 C 435 330 420 335 400 335 L 240 335 C 220 335 205 330 205 310 Z"
                        fill="url(#loxGrad)"
                      />

                      {/* LOX Liquid Level Marker */}
                      <line x1="205" y1="180" x2="435" y2="180" stroke="#38BDF8" strokeWidth="2" filter="url(#glowCyan)" />
                      
                      <text x="320" y="240" fill="#FFFFFF" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        LIQUID OXYGEN (LOX)
                      </text>
                      <text x="320" y="260" fill="#E0F2FE" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        142.4 t • 94.0% Vol • 90.15 K
                      </text>

                      {/* TVS Subcooling Spray Bar representation */}
                      <line x1="320" y1="150" x2="320" y2="300" stroke="#67E8F9" strokeWidth="2.5" strokeDasharray="3 3" />
                      <circle cx="320" cy="200" r="3" fill="#67E8F9" />
                      <circle cx="320" cy="240" r="3" fill="#67E8F9" />
                      <circle cx="320" cy="280" r="3" fill="#67E8F9" />
                      <text x="320" y="325" fill="#67E8F9" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        [TVS SPRAY-BAR SUBCOOLER]
                      </text>
                    </g>

                    {/* ====================================================== */}
                    {/* TANK 2: LCH4 CRYO TANK (RIGHT)                         */}
                    {/* ====================================================== */}
                    <g>
                      {/* Vacuum barrier outer */}
                      <rect
                        x="560"
                        y="140"
                        width="240"
                        height="200"
                        rx="30"
                        fill="#161208"
                        stroke="#D97706"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />

                      {/* LCH4 Ullage Gas Region (Top) */}
                      <path
                        d="M 565 170 C 565 145 580 145 600 145 L 760 145 C 780 145 795 145 795 170 L 795 185 L 565 185 Z"
                        fill="#451A03"
                        className="animate-pulse"
                      />
                      <text x="680" y="165" fill="#FCD34D" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        LCH4 ULLAGE ({tanks.LCH4.ullagePressureKpa.toFixed(1)} kPa • {tanks.LCH4.tempK.toFixed(1)} K)
                      </text>

                      {/* LCH4 Liquid Mass */}
                      <path
                        d="M 565 185 L 795 185 L 795 310 C 795 330 780 335 760 335 L 600 335 C 580 335 565 330 565 310 Z"
                        fill="url(#lch4Grad)"
                      />

                      {/* LCH4 Liquid Level Marker */}
                      <line x1="565" y1="185" x2="795" y2="185" stroke="#FBBF24" strokeWidth="2" filter="url(#glowAmber)" />

                      <text x="680" y="240" fill="#FFFFFF" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        LIQUID METHANE (LCH4)
                      </text>
                      <text x="680" y="260" fill="#FEF3C7" fontSize="11" fontFamily="monospace" textAnchor="middle">
                        48.2 t • 92.0% Vol • 111.45 K
                      </text>

                      {/* TVS Subcooling Spray Bar */}
                      <line x1="680" y1="150" x2="680" y2="300" stroke="#FDE68A" strokeWidth="2.5" strokeDasharray="3 3" />
                      <circle cx="680" cy="205" r="3" fill="#FDE68A" />
                      <circle cx="680" cy="245" r="3" fill="#FDE68A" />
                      <circle cx="680" cy="285" r="3" fill="#FDE68A" />
                      <text x="680" y="325" fill="#FDE68A" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        [TVS CIRCULATION MIXER]
                      </text>
                    </g>

                    {/* ====================================================== */}
                    {/* CENTRAL CRYO-COOLER & BRAYTON RE-LIQUEFACTION HUB     */}
                    {/* ====================================================== */}
                    <g>
                      {/* Central Cryocooler Housing */}
                      <rect
                        x="455"
                        y="155"
                        width="90"
                        height="170"
                        rx="12"
                        fill="#0F172A"
                        stroke="#06B6D4"
                        strokeWidth="2"
                      />

                      {/* Pulse Tube Coldhead Core */}
                      <rect
                        x="470"
                        y="170"
                        width="60"
                        height="40"
                        rx="6"
                        fill="#083344"
                        stroke="#22D3EE"
                        strokeWidth="1.5"
                      />
                      <text x="500" y="187" fill="#67E8F9" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        PULSE TUBE
                      </text>
                      <text x="500" y="200" fill="#A5F3FC" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {cryoLoop.coldheadTempK.toFixed(1)} K
                      </text>

                      {/* Chilling Loop Feed Lines to LOX & LCH4 */}
                      <path
                        d="M 470 190 L 435 190 M 470 270 L 435 270"
                        stroke="#06B6D4"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                      <path
                        d="M 530 190 L 565 190 M 530 270 L 565 270"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />

                      {/* Compressor Graphic */}
                      <circle cx="500" cy="255" r="22" fill="#020617" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="500" y1="235" x2="500" y2="275" stroke="#38BDF8" strokeWidth="2" transform={`rotate(${metSeconds * 40}, 500, 255)`} />
                      <line x1="480" y1="255" x2="520" y2="255" stroke="#38BDF8" strokeWidth="2" transform={`rotate(${metSeconds * 40}, 500, 255)`} />
                      <text x="500" y="295" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        {cryoLoop.compressorRpm.toLocaleString()} RPM
                      </text>
                      <text x="500" y="310" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                        {cryoLoop.coolerPowerKw.toFixed(1)} kW LIFT
                      </text>
                    </g>

                    {/* ====================================================== */}
                    {/* DOCKING PORT 2 & TRANSFER LINE UMBILICAL (BOTTOM RIGHT)*/}
                    {/* ====================================================== */}
                    <g>
                      {/* Docking Coupler Collar */}
                      <rect
                        x="840"
                        y="200"
                        width="45"
                        height="80"
                        rx="6"
                        fill="#0F172A"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />
                      <text x="862" y="235" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        PORT 2
                      </text>
                      <text x="862" y="250" fill="#6EE7B7" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ACTIVE
                      </text>

                      {/* Transfer Conduit from Tanks to Port */}
                      <path
                        d="M 435 270 L 450 270 L 450 395 L 850 395 L 850 280"
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="3.5"
                        strokeDasharray={transfer.active ? "6 3" : "none"}
                        className={transfer.active ? "animate-pulse" : ""}
                      />
                      <path
                        d="M 760 270 L 775 270 L 775 405 L 865 405 L 865 280"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        strokeDasharray={transfer.active ? "6 3" : "none"}
                        className={transfer.active ? "animate-pulse" : ""}
                      />

                      {/* Chaser Vehicle Representation docked on right */}
                      <path
                        d="M 885 170 L 980 130 L 980 350 L 885 310 Z"
                        fill="#030712"
                        stroke="#334155"
                        strokeWidth="2"
                      />
                      <text x="935" y="240" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        CHASER TANKER
                      </text>
                      <text x="935" y="255" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        LATCH PINS 100%
                      </text>
                    </g>

                    {/* RCS Settle Thruster Arming Indicator */}
                    <g transform="translate(100, 220)">
                      <path d="M 60 10 L 30 0 L 30 20 Z" fill="#38BDF8" className="animate-pulse" />
                      <text x="0" y="14" fill="#38BDF8" fontSize="9" fontFamily="monospace">
                        RCS 0.015g SETTLING
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Legend & Telemetry Indicators Bar */}
                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
                    <div>
                      <div className="text-slate-400 text-[10px]">LOX VACUUM JACKET</div>
                      <div className="text-cyan-300 font-bold">1.4 × 10⁻⁶ Torr</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
                    <div>
                      <div className="text-slate-400 text-[10px]">LCH4 MLI SHIELD</div>
                      <div className="text-amber-300 font-bold">65 Layers • Nom</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    <div>
                      <div className="text-slate-400 text-[10px]">BRAYTON COLDHEAD</div>
                      <div className="text-emerald-300 font-bold">20.4 K Closed Loop</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 px-2.5 rounded bg-slate-900/90 border border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
                    <div>
                      <div className="text-slate-400 text-[10px]">SLOSH STABILITY</div>
                      <div className="text-indigo-300 font-bold">99.2% Nominal</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ============================================================ */}
              {/* TELEMETRY GRID (4 CARDS) (REQUIREMENT 3)                     */}
              {/* ============================================================ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* CARD 1: Active Thermodynamic Vent System (TVS) */}
                <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-3 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                          Active TVS Loop
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400">Thermodynamic Vent</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="my-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">HX Delta-T:</span>
                      <span className="text-cyan-300 font-bold">{cryoLoop.heatExchangerDeltaTK.toFixed(2)} K</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Joule-Thomson:</span>
                      <span className="text-emerald-400 font-bold">{cryoLoop.jtValvePct.toFixed(1)}% OPEN</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">Circulation:</span>
                      <span className={`font-bold ${cryoLoop.tvsPumpActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {cryoLoop.tvsPumpActive ? 'RUNNING (980 RPM)' : 'STANDBY'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Boil-off Suppression:</span>
                    <span className="text-emerald-400 font-bold">100.0% (Zero Loss)</span>
                  </div>
                </div>

                {/* CARD 2: Microgravity Ullage Settlement */}
                <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-3 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                        <Gauge className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                          Ullage Settlement
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400">Microgravity Dynamics</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-mono font-bold">
                      LOCKED
                    </span>
                  </div>

                  <div className="my-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">RCS Settle:</span>
                      <span className="text-emerald-400 font-bold">ARMED (0.015 g)</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Stability:</span>
                      <span className="text-cyan-300 font-bold">{cryoLoop.settlementStabilityPct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">Ingestion Risk:</span>
                      <span className="text-emerald-400 font-bold">&lt; 0.001% (Safe)</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Tension Vane:</span>
                    <span className="text-indigo-400 font-bold">PMD Passive Wet</span>
                  </div>
                </div>

                {/* CARD 3: Transfer Line Quick-Disconnect (QD) */}
                <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-3 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <Droplets className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                          Transfer Line QD
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400">Coupler Cryo Umbilical</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                      CHILLED
                    </span>
                  </div>

                  <div className="my-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Seal Temp:</span>
                      <span className="text-cyan-300 font-bold">{cryoLoop.qdSealTempK.toFixed(1)} K</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Purge Cycle:</span>
                      <span className={`font-bold ${cryoLoop.heliumPurgeActive ? 'text-amber-400' : 'text-slate-400'}`}>
                        {cryoLoop.heliumPurgeActive ? 'PURGING' : 'COMPLETE (PASS)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">Leak Rate:</span>
                      <span className="text-emerald-400 font-bold">{cryoLoop.leakRateSccm.toFixed(4)} sccm</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Latch Mech:</span>
                    <span className="text-emerald-400 font-bold">DUAL-BALL LATCH</span>
                  </div>
                </div>

                {/* CARD 4: Reliquefaction Compressor */}
                <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-3 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                          Cryo-Compressor
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400">120 K Turbo-Brayton</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold">
                      NOMINAL
                    </span>
                  </div>

                  <div className="my-2 space-y-1 font-mono text-xs">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Speed:</span>
                      <span className="text-amber-300 font-bold">{cryoLoop.compressorRpm.toLocaleString()} RPM</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Shaft Power:</span>
                      <span className="text-cyan-300 font-bold">{cryoLoop.compressorPowerKw.toFixed(1)} kW</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">Mass Flow:</span>
                      <span className="text-slate-200 font-bold">0.42 kg/s He-Ne</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Fluid:</span>
                    <span className="text-cyan-400 font-bold">Helium-Neon Binary</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: THERMODYNAMICS & TVS LOOPS */}
          {activeTab === 'THERMODYNAMICS' && (
            <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6 font-mono">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-cyan-400" />
                    Depot Thermodynamic Heat Balance & TVS Cycle
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zero-Boil-Off (ZBO) Closed Enthalpy Envelope • Heat Leak vs Active Cryocooler Heat Lift
                  </p>
                </div>
                <div className="px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold">
                  HEAT LIFT: {cryoLoop.coolerPowerKw.toFixed(1)} kW
                </div>
              </div>

              {/* Heat Balance Equation Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#050A14] p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 uppercase">Q_in (Solar & Earth Albedo)</span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-amber-400">
                      +{(2.85 + (Math.abs(Math.cos((sunAspectAngle * Math.PI) / 180)) * 1.8)).toFixed(2)} kW
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Radiative penetration through 60-layer MLI blanket</p>
                </div>

                <div className="bg-[#050A14] p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 uppercase">Q_cryo (Pulse Tube Lift)</span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-cyan-400">
                      -{(cryoLoop.coolerPowerKw * 1.15).toFixed(2)} kW
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">20 K Coldhead subcooler extraction capacity</p>
                </div>

                <div className="bg-[#050A14] p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 uppercase">Net Boil-Off Margin</span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-emerald-400">
                      {calculatedBoilOffMarginPct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400/90">Zero venting required. Ullage pressure holding &lt; 245 kPa</p>
                </div>
              </div>

              {/* State Table of Depot Tanks */}
              <div className="bg-[#050A14] rounded-lg border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">CRYOGENIC STORAGE THERMODYNAMICS SPECIFICATION</span>
                  <span className="text-slate-400">ASME SEC VIII DIV 1 / NASA SP-8089</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3">Tank Identifier</th>
                        <th className="p-3">Fluid</th>
                        <th className="p-3">Bulk Temp (K)</th>
                        <th className="p-3">Ullage Temp (K)</th>
                        <th className="p-3">Ullage Press (kPa)</th>
                        <th className="p-3">Boil-off Rate</th>
                        <th className="p-3">Relief Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-3 font-bold text-cyan-300">{tanks.LOX.code}</td>
                        <td className="p-3 text-cyan-400">Liquid Oxygen (LOX)</td>
                        <td className="p-3">{tanks.LOX.tempK.toFixed(2)} K</td>
                        <td className="p-3">{(tanks.LOX.tempK + 4.6).toFixed(2)} K</td>
                        <td className="p-3 font-semibold">{tanks.LOX.ullagePressureKpa.toFixed(1)} kPa</td>
                        <td className="p-3 text-emerald-400">{tanks.LOX.boilOffRateKgHr.toFixed(3)} kg/hr</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                            {tanks.LOX.reliefValveOpen ? 'VENTING RELIEF' : 'CLOSED AUTO'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-300">{tanks.LCH4.code}</td>
                        <td className="p-3 text-amber-400">Liquid Methane (LCH4)</td>
                        <td className="p-3">{tanks.LCH4.tempK.toFixed(2)} K</td>
                        <td className="p-3">{(tanks.LCH4.tempK + 3.8).toFixed(2)} K</td>
                        <td className="p-3 font-semibold">{tanks.LCH4.ullagePressureKpa.toFixed(1)} kPa</td>
                        <td className="p-3 text-emerald-400">{tanks.LCH4.boilOffRateKgHr.toFixed(3)} kg/hr</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                            {tanks.LCH4.reliefValveOpen ? 'VENTING RELIEF' : 'CLOSED AUTO'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHASER DOCKING & MASS TRANSFER */}
          {activeTab === 'TRANSFER' && (
            <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6 font-mono">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    Active Chaser Mass Transfer Sequencer
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Docking Port 2 Coupler • Cryogenic Line Chilldown & Pumping Manifold
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    transfer.active ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    TRANSFER: {transfer.stage}
                  </span>
                </div>
              </div>

              {/* Transfer Metrics Progress */}
              <div className="bg-[#050A14] p-5 rounded-lg border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs text-slate-400 uppercase">Target Chaser Vessel:</span>
                    <span className="text-sm font-bold text-slate-100 ml-2">{transfer.targetVehicle}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Propellant Mode: <span className="text-cyan-400 font-bold">{transfer.propellant}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">Pumped Mass:</span>
                    <span className="text-emerald-400 font-bold">
                      {transfer.transferredMassTonnes.toFixed(2)} / {transfer.targetMassTonnes.toFixed(2)} Tonnes ({((transfer.transferredMassTonnes / transfer.targetMassTonnes) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                      style={{ width: `${Math.min(100, (transfer.transferredMassTonnes / transfer.targetMassTonnes) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Flow Controller Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">PUMP FLOW RATE</span>
                    <span className="text-emerald-300 font-bold text-sm">{transfer.flowRateKgMin.toFixed(1)} kg/min</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">COUPLER PRESSURE</span>
                    <span className="text-cyan-300 font-bold text-sm">218.4 kPa</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CHILLDOWN VALVE</span>
                    <span className="text-emerald-400 font-bold text-sm">OPEN & RECIRC</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TRANSFER INTEGRITY</span>
                    <span className="text-slate-100 font-bold text-sm">NOMINAL ZERO LEAK</span>
                  </div>
                </div>

                {/* Transfer Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setTransfer((prev) => ({ ...prev, active: !prev.active }));
                      triggerToast(transfer.active ? 'MASS TRANSFER PAUSED: Flow valves isolated.' : 'MASS TRANSFER RESUMED: Flow pumping active.');
                    }}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    {transfer.active ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{transfer.active ? 'PAUSE TRANSFER' : 'RESUME TRANSFER'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setTransfer((prev) => ({
                        ...prev,
                        transferredMassTonnes: 0,
                        stage: 'FLOWING',
                        active: true
                      }));
                      triggerToast('TRANSFER CYCLE RESTARTED: Flushed with helium and primed.');
                    }}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RESET CYCLE COUNTER</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TELEMETRY FAULT MATRIX & LOGS */}
          {activeTab === 'EVENTS' && (
            <div className="bg-[#0B0F17] rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6 font-mono">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    SCADA Telemetry Fault Matrix & Event Audit
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-Time Flight Software Bus Monitor • Sub-millisecond Time-Tagged Records
                  </p>
                </div>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT LOG RECORD</span>
                </button>
              </div>

              {/* Event Logs Table */}
              <div className="bg-[#050A14] rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3">Sequence</th>
                      <th className="p-3">Time Tag (UTC)</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Subsystem Source</th>
                      <th className="p-3">Telemetry Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-3 font-semibold text-slate-400">{log.id}</td>
                        <td className="p-3 text-cyan-300">{log.timestamp}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              log.severity === 'NOMINAL'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : log.severity === 'INFO'
                                ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                                : log.severity === 'CAUTION'
                                ? 'bg-amber-950 text-amber-400 border-amber-800'
                                : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-300">{log.source}</td>
                        <td className="p-3 text-slate-300">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>

        {/* ================================================================== */}
        {/* INTERACTIVE MODAL 1: RECALIBRATE CRYO-COOLER LOOP (REQUIREMENT 4)  */}
        {/* ================================================================== */}
        {showRecalibrateModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0B0F17] border border-cyan-500/60 rounded-xl max-w-lg w-full p-6 shadow-2xl font-mono text-slate-200 flex flex-col gap-5">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                      Recalibrate Cryo-Cooler Loop
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowRecalibrateModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Cryocooler Power Slider (2 kW to 10 kW) */}
                  <div className="bg-[#050A14] p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-cyan-300">Cryocooler Shaft Power</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                        {draftPowerKw.toFixed(1)} kW
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2.0}
                      max={10.0}
                      step={0.1}
                      value={draftPowerKw}
                      onChange={(e) => setDraftPowerKw(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer h-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>2.0 kW (Low Lift)</span>
                      <span>4.2 kW (Nominal)</span>
                      <span>10.0 kW (Cryo-Peak)</span>
                    </div>
                  </div>

                  {/* Boil-Off Vent Rate Trim Slider */}
                  <div className="bg-[#050A14] p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-300">Boil-Off Vent Rate Trim</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
                        {draftVentTrim.toFixed(3)} kg/hr
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.00}
                      max={0.50}
                      step={0.01}
                      value={draftVentTrim}
                      onChange={(e) => setDraftVentTrim(Number(e.target.value))}
                      className="w-full accent-amber-400 bg-slate-800 rounded cursor-pointer h-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.00 (Zero Boil-Off Lock)</span>
                      <span>0.25</span>
                      <span>0.50 kg/hr Max Trim</span>
                    </div>
                  </div>

                  {/* TVS Circulation Pump Toggle */}
                  <div className="bg-[#050A14] p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">TVS Subcooling Spray Circulation</div>
                      <div className="text-[11px] text-slate-400">Spray-bar injection into liquid bulk</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraftTvsPump(!draftTvsPump)}
                      className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
                        draftTvsPump
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : 'bg-slate-900 text-slate-500 border border-slate-700'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{draftTvsPump ? 'PUMP ACTIVE' : 'OFFLINE'}</span>
                    </button>
                  </div>
                </div>

                {/* Commit Action Button */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowRecalibrateModal(false)}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleCommitRecalibration}
                    className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EXECUTE THERMAL RE-ALIGNMENT</span>
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* INTERACTIVE MODAL 2: INITIATE CHASER TRANSFER                      */}
        {/* ================================================================== */}
        {showTransferModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0B0F17] border border-emerald-500/60 rounded-xl max-w-lg w-full p-6 shadow-2xl font-mono text-slate-200 flex flex-col gap-5">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                      Initiate Chaser Propellant Transfer
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="bg-[#050A14] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Selected Docking Node</span>
                    <span className="text-emerald-300 font-bold text-sm">PORT 2 • CHASER-ORION-FREIGHTER-9</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Dual-ball retention latched • Seal temp 92.0 K</span>
                  </div>

                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Transfer Propellant Commodity:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['LOX', 'LCH4', 'DUAL'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setTransfer((prev) => ({ ...prev, propellant: mode }))}
                          className={`p-2 rounded text-center font-bold text-xs border transition ${
                            transfer.propellant === mode
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {mode === 'DUAL' ? 'DUAL METHALOX' : mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Planned Transfer Target (Tonnes):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={transfer.targetMassTonnes}
                        onChange={(e) => setTransfer((prev) => ({ ...prev, targetMassTonnes: Number(e.target.value) }))}
                        className="w-full bg-[#050A14] border border-slate-700 rounded px-3 py-1.5 text-slate-100 font-bold text-xs"
                      />
                      <span className="text-slate-400 text-xs font-mono">Tonnes</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Cryo Pump Rate (kg/min):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={40}
                        max={240}
                        step={10}
                        value={transfer.flowRateKgMin}
                        onChange={(e) => setTransfer((prev) => ({ ...prev, flowRateKgMin: Number(e.target.value) }))}
                        className="w-full accent-emerald-400 bg-slate-800 rounded cursor-pointer h-2"
                      />
                      <span className="text-emerald-300 font-bold text-xs w-24 text-right">
                        {transfer.flowRateKgMin} kg/min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    DISMISS
                  </button>
                  <button
                    onClick={() => {
                      setTransfer((prev) => ({
                        ...prev,
                        stage: 'FLOWING',
                        active: true
                      }));
                      setShowTransferModal(false);
                      triggerToast(`TRANSFER DISPATCHED: Pumping ${transfer.propellant} to ${transfer.targetVehicle} at ${transfer.flowRateKgMin} kg/min.`);
                    }}
                    className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>ENGAGE COMMODITY FLOW</span>
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* INTERACTIVE MODAL 3: EMERGENCY VENT ISOLATION                      */}
        {/* ================================================================== */}
        {showEmergencyModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0B0F17] border border-rose-600 rounded-xl max-w-lg w-full p-6 shadow-2xl font-mono text-slate-200 flex flex-col gap-5">
                
                <div className="flex justify-between items-center pb-3 border-b border-rose-950">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
                    <h3 className="text-base font-bold text-rose-200 uppercase tracking-wider">
                      Emergency Vent & Pyro Isolation
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      FLIGHT CRITICAL ACTION WARNING
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Executing emergency isolation will fire pyrotechnic guillotine isolation valves, severing the chaser transfer umbilical and dumping cryogenic ullage overboard to prevent catastrophic over-pressurization.
                    </p>
                  </div>

                  {/* Dual Key Interlock Verification */}
                  <div className="bg-[#050A14] p-4 rounded-lg border border-slate-800 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                      Dual-Officer Mechanical Interlocks Required
                    </span>

                    <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-300">Command Interlock Key Alpha</span>
                      <button
                        type="button"
                        onClick={() => setKey1Armed(!key1Armed)}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                          key1Armed ? 'bg-rose-900 text-rose-200 border border-rose-500' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {key1Armed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{key1Armed ? 'ARMED' : 'DISARMED'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-300">SCADA Safety Interlock Key Beta</span>
                      <button
                        type="button"
                        onClick={() => setKey2Armed(!key2Armed)}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                          key2Armed ? 'bg-rose-900 text-rose-200 border border-rose-500' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {key2Armed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{key2Armed ? 'ARMED' : 'DISARMED'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-3 pt-3 border-t border-slate-800">
                  {emergencyIsolationActive ? (
                    <button
                      onClick={handleResetEmergency}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>RESET ISOLATION INTERLOCKS</span>
                    </button>
                  ) : <div></div>}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEmergencyModal(false)}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      ABORT
                    </button>
                    <button
                      disabled={!key1Armed || !key2Armed}
                      onClick={handleExecuteEmergencyIsolation}
                      className={`px-4 py-2 rounded font-bold text-xs tracking-wider flex items-center gap-1.5 ${
                        key1Armed && key2Armed
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] cursor-pointer'
                          : 'bg-rose-950/40 text-slate-600 border border-rose-950 cursor-not-allowed'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>CONFIRM EMERGENCY ISOLATION</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* INTERACTIVE MODAL 4: DATA EXPORT MODAL                             */}
        {/* ================================================================== */}
        {showExportModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl font-mono text-slate-200 flex flex-col gap-4">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                      Export SCADA Telemetry
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Generate an institutional mission flight telemetry manifest including tank thermodynamic pressures, temperatures, and event audit tags.
                </p>

                <div className="bg-[#050A14] p-3 rounded border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-300 font-bold">Records In Buffer: {logs.length} events</div>
                  <div className="text-slate-400">Station: Aura-Depot-Alpha Station 01</div>
                  <div className="text-slate-400">Format: Standard CSV / ISO-8601 UTC tags</div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD CSV AUDIT</span>
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* MANDATORY SIMULATED MISSION CONSOLE FOOTER                         */}
        {/* ================================================================== */}
        <footer className="border-t border-slate-900 bg-[#02050E] px-4 py-3 text-center z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="tracking-widest font-semibold text-slate-400">
              AURA &amp; GRID • GHOST FACTORY INSTITUTIONAL BLUEPRINT
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400/90 font-bold tracking-wider">
              SIMULATED MISSION CONSOLE — FOR CONCEPT DEMO USE ONLY — NOT FLIGHT SOFTWARE
            </span>
            <span className="text-slate-600">
              LEO 450 KM NODE SCADA • ENCRYPTION: SHA-384
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}
