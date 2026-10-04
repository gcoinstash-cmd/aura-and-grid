/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Activity,
  Gauge,
  Wind,
  ShieldAlert,
  Zap,
  Waves,
  Sliders,
  CheckCircle2,
  Layers,
  Droplets,
  TrendingUp,
  Cpu
} from 'lucide-react';

export interface WellData {
  id: string;
  code: string;
  type: 'PRODUCTION' | 'INJECTION';
  depth: number;
  tempC: number;
  pressureMpa: number;
  flowKgS: number;
  enthalpyKjKg: number;
  silicaIndex: number;
  seismicRisk: 'GREEN' | 'AMBER' | 'RED';
  chokePct: number;
  status: 'ACTIVE' | 'CHOKED' | 'FLUSHING' | 'ISOLATED';
}

export interface SeismicEvent {
  id: string;
  depthM: number;
  mag: number;
  xPct: number;
  yPct: number;
  timestamp: string;
  strike: number;
  dip: number;
  freqHz: number;
  tier: 'GREEN' | 'AMBER' | 'RED';
}

export interface TurbineStage {
  stage: number;
  name: string;
  mwE: number;
  inletMpa: number;
  inletTempC: number;
  rpm: number;
  efficiencyPct: number;
  vacuumKpa: number;
  vibrationMmS: number;
}

const INITIAL_WELLS: WellData[] = [
  { id: 'w1', code: 'PROD-01', type: 'PRODUCTION', depth: 5240, tempC: 464.2, pressureMpa: 27.8, flowKgS: 78.4, enthalpyKjKg: 2780, silicaIndex: 0.82, seismicRisk: 'GREEN', chokePct: 95, status: 'ACTIVE' },
  { id: 'w2', code: 'PROD-02', type: 'PRODUCTION', depth: 5180, tempC: 459.8, pressureMpa: 26.9, flowKgS: 72.1, enthalpyKjKg: 2740, silicaIndex: 0.88, seismicRisk: 'GREEN', chokePct: 90, status: 'ACTIVE' },
  { id: 'w3', code: 'PROD-03', type: 'PRODUCTION', depth: 5310, tempC: 468.1, pressureMpa: 28.5, flowKgS: 68.9, enthalpyKjKg: 2810, silicaIndex: 0.94, seismicRisk: 'AMBER', chokePct: 82, status: 'ACTIVE' },
  { id: 'w4', code: 'PROD-04', type: 'PRODUCTION', depth: 5290, tempC: 461.5, pressureMpa: 27.2, flowKgS: 74.2, enthalpyKjKg: 2760, silicaIndex: 0.79, seismicRisk: 'GREEN', chokePct: 95, status: 'ACTIVE' },
  { id: 'w5', code: 'PROD-05', type: 'PRODUCTION', depth: 5120, tempC: 455.0, pressureMpa: 26.4, flowKgS: 64.5, enthalpyKjKg: 2710, silicaIndex: 0.74, seismicRisk: 'GREEN', chokePct: 88, status: 'ACTIVE' },
  { id: 'w6', code: 'PROD-06', type: 'PRODUCTION', depth: 5360, tempC: 471.3, pressureMpa: 29.1, flowKgS: 62.1, enthalpyKjKg: 2835, silicaIndex: 1.06, seismicRisk: 'AMBER', chokePct: 76, status: 'CHOKED' },
  { id: 'w7', code: 'INJ-01', type: 'INJECTION', depth: 5080, tempC: 64.2, pressureMpa: 28.6, flowKgS: 145.0, enthalpyKjKg: 272, silicaIndex: 0.31, seismicRisk: 'GREEN', chokePct: 100, status: 'ACTIVE' },
  { id: 'w8', code: 'INJ-02', type: 'INJECTION', depth: 5140, tempC: 62.8, pressureMpa: 28.2, flowKgS: 138.5, enthalpyKjKg: 266, silicaIndex: 0.28, seismicRisk: 'GREEN', chokePct: 96, status: 'ACTIVE' },
  { id: 'w9', code: 'INJ-03', type: 'INJECTION', depth: 5210, tempC: 65.1, pressureMpa: 28.4, flowKgS: 136.7, enthalpyKjKg: 276, silicaIndex: 0.35, seismicRisk: 'AMBER', chokePct: 85, status: 'ACTIVE' },
];

const INITIAL_TURBINES: TurbineStage[] = [
  { stage: 1, name: 'Stage 1: HP Supercritical Expander', mwE: 48.2, inletMpa: 27.8, inletTempC: 460.5, rpm: 5400, efficiencyPct: 91.4, vacuumKpa: -94.2, vibrationMmS: 1.12 },
  { stage: 2, name: 'Stage 2: IP Reheat Flash Expander', mwE: 42.1, inletMpa: 11.2, inletTempC: 385.0, rpm: 3600, efficiencyPct: 89.8, vacuumKpa: -94.1, vibrationMmS: 0.94 },
  { stage: 3, name: 'Stage 3: LP Dual-Flash Generator', mwE: 34.5, inletMpa: 3.4, inletTempC: 240.2, rpm: 3000, efficiencyPct: 88.2, vacuumKpa: -94.2, vibrationMmS: 0.88 },
  { stage: 4, name: 'Stage 4: Binary Isobutane ORC', mwE: 23.8, inletMpa: 1.8, inletTempC: 148.0, rpm: 1800, efficiencyPct: 86.5, vacuumKpa: -94.5, vibrationMmS: 0.65 },
];

const INITIAL_SEISMIC: SeismicEvent[] = [
  { id: 'ev-1', depthM: 5142, mag: 0.42, xPct: 44, yPct: 76, timestamp: '13:02:14', strike: 214, dip: 78, freqHz: 185, tier: 'GREEN' },
  { id: 'ev-2', depthM: 5210, mag: 0.68, xPct: 56, yPct: 82, timestamp: '13:03:50', strike: 218, dip: 82, freqHz: 162, tier: 'GREEN' },
  { id: 'ev-3', depthM: 4980, mag: 0.15, xPct: 38, yPct: 69, timestamp: '13:04:18', strike: 205, dip: 75, freqHz: 210, tier: 'GREEN' },
  { id: 'ev-4', depthM: 5320, mag: 0.89, xPct: 68, yPct: 88, timestamp: '13:05:02', strike: 222, dip: 85, freqHz: 142, tier: 'AMBER' },
  { id: 'ev-5', depthM: 5060, mag: 0.31, xPct: 49, yPct: 72, timestamp: '13:05:44', strike: 210, dip: 76, freqHz: 195, tier: 'GREEN' },
];

export default function App() {
  // Telemetry state
  const [depth] = useState<number>(-5240);
  const [temperature, setTemperature] = useState<number>(462.4);
  const [pressure, setPressure] = useState<number>(28.4);
  const [flowRate, setFlowRate] = useState<number>(420.2);
  const [bopActive, setBopActive] = useState<boolean>(false);
  const [bopModalOpen, setBopModalOpen] = useState<boolean>(false);

  // Wells & Turbines & Seismic Events
  const [wells, setWells] = useState<WellData[]>(INITIAL_WELLS);
  const [turbines, setTurbines] = useState<TurbineStage[]>(INITIAL_TURBINES);
  const [seismicEvents, setSeismicEvents] = useState<SeismicEvent[]>(INITIAL_SEISMIC);
  const [selectedEvent, setSelectedEvent] = useState<SeismicEvent | null>(null);

  // Interactive Action Modals
  const [modulateWell, setModulateWell] = useState<WellData | null>(null);
  const [chokeInput, setChokeInput] = useState<number>(85);
  const [flushWell, setFlushWell] = useState<WellData | null>(null);
  const [activeTab, setActiveTab] = useState<'OPERATIONS' | 'SEISMOLOGY' | 'THERMODYNAMICS'>('OPERATIONS');
  const [notification, setNotification] = useState<string | null>(null);

  // Net Megawatt calculation
  const totalMWe = useMemo(() => {
    return Number(turbines.reduce((acc, t) => acc + t.mwE, 0).toFixed(1));
  }, [turbines]);

  // Simulation Tick Loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Jitter wellhead temperature slightly
      setTemperature((prev) => {
        const delta = (Math.random() - 0.49) * 0.3;
        return Number((prev + delta).toFixed(2));
      });

      // Jitter pressure & flow
      setPressure((prev) => {
        const delta = (Math.random() - 0.5) * 0.08;
        return Number((prev + delta).toFixed(2));
      });

      setFlowRate((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Number((prev + delta).toFixed(1));
      });

      // Jitter turbines
      setTurbines((prev) =>
        prev.map((t) => {
          const deltaMw = (Math.random() - 0.49) * 0.15;
          return {
            ...t,
            mwE: Number(Math.max(10, t.mwE + deltaMw).toFixed(1)),
          };
        })
      );

      // Microseismic burst generator (every few ticks randomly)
      if (Math.random() > 0.65) {
        const newMag = Number((Math.random() * 0.85 + 0.05).toFixed(2));
        const newDepth = Math.floor(4800 + Math.random() * 600);
        const newEvent: SeismicEvent = {
          id: `ev-${Date.now()}`,
          depthM: newDepth,
          mag: newMag,
          xPct: Math.floor(32 + Math.random() * 42),
          yPct: Math.floor(65 + Math.random() * 26),
          timestamp: new Date().toLocaleTimeString(),
          strike: Math.floor(205 + Math.random() * 25),
          dip: Math.floor(75 + Math.random() * 12),
          freqHz: Math.floor(140 + Math.random() * 80),
          tier: newMag > 0.75 ? 'AMBER' : 'GREEN',
        };

        setSeismicEvents((prev) => [newEvent, ...prev.slice(0, 8)]);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleModulateSubmit = () => {
    if (!modulateWell) return;
    setWells((prev) =>
      prev.map((w) =>
        w.id === modulateWell.id
          ? { ...w, chokePct: chokeInput, status: chokeInput < 80 ? 'CHOKED' : 'ACTIVE' }
          : w
      )
    );
    triggerNotification(`Choke aperture for ${modulateWell.code} calibrated to ${chokeInput}%`);
    setModulateWell(null);
  };

  const handleFlushSubmit = () => {
    if (!flushWell) return;
    setWells((prev) =>
      prev.map((w) =>
        w.id === flushWell.id
          ? { ...w, silicaIndex: Math.max(0.4, Number((w.silicaIndex - 0.22).toFixed(2))), status: 'FLUSHING' }
          : w
      )
    );
    triggerNotification(`Calcite wash inhibitor cycle started for ${flushWell.code}`);
    setTimeout(() => {
      setWells((prev) =>
        prev.map((w) => (w.id === flushWell.id ? { ...w, status: 'ACTIVE' } : w))
      );
    }, 5000);
    setFlushWell(null);
  };

  const toggleBopSafety = () => {
    setBopActive((prev) => !prev);
    setBopModalOpen(false);
    triggerNotification(
      !bopActive
        ? 'ALERT: BOP Containment Choke ENGAGED. Downhole manifold isolated!'
        : 'BOP Containment Choke DISENGAGED. Normal supercritical circulation restored.'
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans p-3 md:p-6 select-none flex flex-col gap-4">
        {/* Hub Notification Banner */}
        {notification && (
          <>
            <div className="fixed top-4 right-4 z-50 bg-[#0F172A] border border-cyan-500/50 shadow-lg shadow-cyan-950/50 text-cyan-300 text-xs px-4 py-2.5 rounded flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{notification}</span>
            </div>
          </>
        )}

        {/* 1. TOP WELLHEAD & SUBSURFACE HUD */}
        <header className="bg-[#0D121D] border border-[#1E293B] rounded-lg p-4 shadow-xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <div className="text-[11px] font-mono tracking-widest text-orange-400 font-semibold uppercase">
                  CASCADE RANGE CALDERA // SUPERCRITICAL EGS POWER STATION 04
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  DEEP THERMODYNAMIC TELEMETRY ARRAY &bull; LAT: 44.1209° N &bull; LON: 121.7712° W
                </div>
              </div>
            </div>

            {/* Quick Status Badges & Tab Navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-[#111827] border border-slate-700/60 px-3 py-1 rounded text-xs font-mono flex items-center gap-2">
                <span className="text-slate-400">GRID SYNC:</span>
                <span className="text-emerald-400 font-bold">500 kV @ 60.02 Hz</span>
              </div>
              <div className="bg-[#111827] border border-slate-700/60 px-3 py-1 rounded text-xs font-mono flex items-center gap-2">
                <span className="text-slate-400">NET OUTPUT:</span>
                <span className="text-cyan-300 font-bold">{totalMWe} MW e</span>
              </div>
              <div className="flex bg-[#111827] border border-slate-700 rounded p-0.5 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('OPERATIONS')}
                  className={`px-3 py-1 rounded transition ${activeTab === 'OPERATIONS' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  DECK
                </button>
                <button
                  onClick={() => setActiveTab('SEISMOLOGY')}
                  className={`px-3 py-1 rounded transition ${activeTab === 'SEISMOLOGY' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  SEISMIC
                </button>
                <button
                  onClick={() => setActiveTab('THERMODYNAMICS')}
                  className={`px-3 py-1 rounded transition ${activeTab === 'THERMODYNAMICS' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  ORC CYCLE
                </button>
              </div>
            </div>
          </div>

          {/* HUD Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Metric 1: Bottom-Hole Depth */}
            <div className="bg-[#111827] border border-[#1E293B] p-3 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>BOTTOM-HOLE DEPTH</span>
                <Layers className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">{depth.toLocaleString()}</span>
                <span className="text-xs font-mono text-slate-400">m</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-cyan-400">CRYSTALLINE GRANODIORITE</div>
            </div>

            {/* Metric 2: Wellhead Temp */}
            <div className="bg-[#111827] border border-orange-500/30 p-3 rounded flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>WELLHEAD TEMP</span>
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-orange-400">{temperature}</span>
                <span className="text-xs font-mono text-orange-300">°C</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-orange-300/80 uppercase font-semibold">
                SUPERCRITICAL REGIME
              </div>
            </div>

            {/* Metric 3: Injection Pressure */}
            <div className="bg-[#111827] border border-cyan-500/30 p-3 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>LOOP PRESSURE</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-cyan-300">{pressure}</span>
                <span className="text-xs font-mono text-cyan-400">MPa</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-emerald-400">STABLE CONFINEMENT</div>
            </div>

            {/* Metric 4: Steam Flow */}
            <div className="bg-[#111827] border border-[#1E293B] p-3 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>STEAM FLOW RATE</span>
                <Wind className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-teal-300">{flowRate}</span>
                <span className="text-xs font-mono text-teal-400">kg/s</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">6 WELLS AGGREGATED</div>
            </div>

            {/* Metric 5: Emergency BOP Containment Choke */}
            <div className={`p-3 rounded border flex flex-col justify-between transition ${bopActive ? 'bg-red-950/40 border-red-500 text-red-200' : 'bg-[#111827] border-amber-600/40'}`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-semibold text-amber-400">BOP CHOKE SWITCH</span>
                <ShieldAlert className={`w-3.5 h-3.5 ${bopActive ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-2xl font-bold font-mono tracking-tight ${bopActive ? 'text-red-400' : 'text-slate-100'}`}>
                  {bopActive ? 'TRIPPED' : 'ARMED'}
                </span>
                <button
                  onClick={() => setBopModalOpen(true)}
                  className={`px-3 py-1 rounded text-[11px] font-mono font-bold uppercase transition ${bopActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50'}`}
                >
                  {bopActive ? 'RESET' : 'TRIP'}
                </button>
              </div>
              <div className={`mt-1 text-[10px] font-mono ${bopActive ? 'text-red-400 font-semibold' : 'text-emerald-400'}`}>
                {bopActive ? 'WELLHEAD ISOLATED' : 'NOMINAL CIRCULATION'}
              </div>
            </div>
          </div>
        </header>

        {/* 2 & 3. CENTER DUAL-PANE VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* CENTER-LEFT: 2D Subsurface Fracture & Micro-Seismic Cross-Section (7 cols) */}
          <section className="lg:col-span-7 bg-[#0D121D] border border-[#1E293B] rounded-lg p-4 flex flex-col shadow-xl">
            <div className="flex flex-col gap-1.5 border-b border-[#1E293B] pb-2.5 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                <h2 className="text-xs font-mono font-bold tracking-wider leading-snug text-slate-200 uppercase">
                  2D Subsurface Fracture &amp; Micro-Seismic Cross-Section
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Cold Injection (64°C)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Supercritical (462°C)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Micro-Seismic (&lt;1.0M)
                </span>
              </div>
            </div>

            {/* Interactive SVG Geothermal Earth Cross-Section */}
            <div className="h-[460px] w-full bg-[#05070B] border border-slate-800 rounded-lg relative overflow-hidden flex flex-col justify-center">
              <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="w-full h-full preserve-3d">
                <defs>
                  {/* Gradients for Geologic Formations */}
                  <linearGradient id="volcanicCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="dioriteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F172A" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1C131D" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="magmaBasement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A120B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4A1504" stopOpacity="0.95" />
                  </linearGradient>

                  <filter id="glowEmber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <filter id="glowBlip" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.8" />
                  </filter>
                  <filter id="glowCyanBlip" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06B6D4" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Stratigraphic Geologic Strata */}
                {/* 0 to -1,500m: Andesite Caprock */}
                <rect x="0" y="0" width="800" height="120" fill="url(#volcanicCap)" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <text x="28" y="65" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="600">
                  0m to -1,500m &bull; Andesite &amp; Tuff Caprock Seal
                </text>

                {/* -1,500m to -3,500m: Impermeable Granitic Barrier */}
                <rect x="0" y="120" width="800" height="160" fill="url(#dioriteGrad)" />
                <line x1="0" y1="280" x2="800" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                <text x="28" y="200" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="600">
                  -1,500m to -3,500m &bull; Impermeable Quartz Diorite Batholith
                </text>

                {/* -3,500m to -6,000m: High-Enthalpy Supercritical Granodiorite Basement */}
                <rect x="0" y="280" width="800" height="220" fill="url(#magmaBasement)" />
                <text x="28" y="440" fill="#F97316" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  -5,240m SUPERCRITICAL RESERVOIR (462°C // 28.4 MPa)
                </text>

                {/* Stimulated Reservoir Volume (Fracture Network Mesh) */}
                <g opacity="0.65">
                  <path d="M 260 360 L 320 340 L 400 380 L 460 350 L 520 410 L 580 370 L 640 430" stroke="#F97316" strokeWidth="1.5" fill="none" filter="url(#glowEmber)" />
                  <path d="M 280 410 L 350 380 L 430 420 L 510 390 L 570 450" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.8" />
                  <path d="M 310 460 L 380 430 L 450 470 L 530 440 L 610 480" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
                  <path d="M 330 330 L 390 390 L 440 340 L 500 420 L 560 360" stroke="#F97316" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                </g>

                {/* Wellbore 1: Cold Injection Well (INJ-01/02) */}
                <path
                  d="M 220 0 L 220 220 Q 220 360 310 390"
                  stroke="#06B6D4"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Cold Fluid Vectors (Cyan Flow downward) */}
                <path
                  d="M 220 10 L 220 220 Q 220 360 310 390"
                  stroke="#22D3EE"
                  strokeWidth="2"
                  fill="none"
                  className="animate-fluid-flow"
                />

                {/* Wellbore 2: Production Well (PROD-01 Supercritical Apex) */}
                <path
                  d="M 580 0 L 580 240 Q 580 380 490 420"
                  stroke="#EA580C"
                  strokeWidth="4.5"
                  fill="none"
                />
                {/* Supercritical Thermal Vectors (Orange Flow upward) */}
                <path
                  d="M 490 420 Q 580 380 580 240 L 580 0"
                  stroke="#FDBA74"
                  strokeWidth="2"
                  fill="none"
                  className="animate-fluid-flow-fast"
                />

                {/* Wellbore 3: Production Well 2 (PROD-03 Flank) */}
                <path
                  d="M 690 0 L 690 280 Q 690 430 600 460"
                  stroke="#EA580C"
                  strokeWidth="3.5"
                  fill="none"
                />

                {/* Surface Plant Rig Icons */}
                <rect x="205" y="2" width="30" height="15" fill="#334155" rx="2" />
                <text x="202" y="-4" fill="#06B6D4" fontSize="9" fontFamily="monospace">INJ-01/02</text>

                <rect x="565" y="2" width="30" height="15" fill="#C2410C" rx="2" />
                <text x="560" y="-4" fill="#F97316" fontSize="9" fontFamily="monospace">PROD-01</text>

                {/* Dynamic Micro-Seismic Hypocenter Blips */}
                {seismicEvents.map((ev) => {
                  const cx = (ev.xPct / 100) * 800;
                  const cy = (ev.yPct / 100) * 500;
                  const radius = Math.max(3.5, ev.mag * 8.5);
                  const isAmber = ev.tier === 'AMBER';

                  return (
                    <g
                      key={ev.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedEvent(ev)}
                    >
                      {/* Radiating acoustic pulse ring */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius * 2.4}
                        fill="none"
                        stroke={isAmber ? '#F59E0B' : '#06B6D4'}
                        strokeWidth="1.2"
                        className="animate-radar-pulse"
                      />
                      {/* Core hypocenter dot with glow */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill={isAmber ? '#F59E0B' : '#06B6D4'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        filter={isAmber ? 'url(#glowBlip)' : 'url(#glowCyanBlip)'}
                      />
                      <text
                        x={cx + 9}
                        y={cy - 6}
                        fill={isAmber ? '#FCD34D' : '#67E8F9'}
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.9))"
                      >
                        M{ev.mag} ({ev.depthM}m)
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hypocenter Event Detail Box overlay */}
              {selectedEvent && (
                <div className="absolute bottom-3 left-3 bg-[#0F172A]/90 border border-slate-700 p-2.5 rounded text-xs font-mono shadow-2xl backdrop-blur max-w-xs">
                  <div className="flex items-center justify-between font-bold text-orange-400 border-b border-slate-700 pb-1 mb-1">
                    <span>SEISMIC HYPOCENTER {selectedEvent.id}</span>
                    <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white ml-2">&times;</button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-300">
                    <div>Mag: <span className="text-emerald-300 font-bold">{selectedEvent.mag} Mw</span></div>
                    <div>Depth: <span className="text-slate-100">{selectedEvent.depthM} m</span></div>
                    <div>Corner Freq: <span className="text-cyan-300">{selectedEvent.freqHz} Hz</span></div>
                    <div>Fault Strike: <span className="text-slate-100">{selectedEvent.strike}° / {selectedEvent.dip}°</span></div>
                    <div>Time: <span className="text-slate-400">{selectedEvent.timestamp}</span></div>
                    <div>Status: <span className={selectedEvent.tier === 'AMBER' ? 'text-amber-400' : 'text-emerald-400'}>SAFE THRESHOLD</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Micro-Seismic Array: 16 Downhole Geophones Active</span>
              </span>
              <span className="text-slate-400">Gutenberg-Richter b-value: <b className="text-slate-200">1.18</b></span>
            </div>
          </section>

          {/* CENTER-RIGHT: Binary Organic Rankine & Turbine Diagnostics (5 cols) */}
          <section className="lg:col-span-5 bg-[#0D121D] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                    4-Stage Supercritical Turbine Matrix
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                  ISENTROPIC: 89.2% AVG
                </span>
              </div>

              {/* 4 Turbine Stages Cards */}
              <div className="space-y-2.5">
                {turbines.map((t) => (
                  <div
                    key={t.stage}
                    className="bg-[#111827] border border-[#1E293B] rounded p-2.5 flex flex-col gap-1.5 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-200">{t.name}</span>
                      <span className="text-xs font-mono font-bold text-orange-400">{t.mwE} MW e</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-400 border-t border-slate-800/70 pt-1.5">
                      <div>
                        <span className="block text-slate-500">INLET P</span>
                        <span className="text-cyan-300 font-medium">{t.inletMpa} MPa</span>
                      </div>
                      <div>
                        <span className="block text-slate-500">INLET T</span>
                        <span className="text-orange-300 font-medium">{t.inletTempC}°C</span>
                      </div>
                      <div>
                        <span className="block text-slate-500">SPEED</span>
                        <span className="text-slate-200 font-medium">{t.rpm} RPM</span>
                      </div>
                      <div>
                        <span className="block text-slate-500">EFFICIENCY</span>
                        <span className="text-emerald-400 font-medium">{t.efficiencyPct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic gauges & Rankine Thermal Efficiency curve */}
            <div className="mt-4 pt-3 border-t border-[#1E293B] bg-[#0A0E17] p-3 rounded border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  THERMODYNAMIC EFFICIENCY CURVE (ORC)
                </span>
                <span className="text-orange-400 font-bold">32.8% OVERALL NET</span>
              </div>

              {/* Mini SVG Curve */}
              <div className="w-full h-16 bg-[#05070B] rounded border border-slate-900 p-1 flex items-center">
                <svg viewBox="0 0 300 60" className="w-full h-full">
                  <path
                    d="M 10 50 Q 80 45 140 25 T 290 10"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2"
                  />
                  <path
                    d="M 10 50 Q 80 45 140 25 T 290 10 L 290 55 L 10 55 Z"
                    fill="url(#orcGrad)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="orcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Gauge dots */}
                  <circle cx="140" cy="25" r="3" fill="#F97316" />
                  <text x="148" y="24" fill="#F97316" fontSize="8" fontFamily="monospace">Pinch Pt 4.2°C</text>
                </svg>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-[#111827] p-1.5 rounded flex items-center justify-between">
                  <span className="text-slate-500">CONDENSER VACUUM:</span>
                  <span className="text-slate-200 font-bold">-94.2 kPa</span>
                </div>
                <div className="bg-[#111827] p-1.5 rounded flex items-center justify-between">
                  <span className="text-slate-500">TURBINE VIBRATION:</span>
                  <span className="text-emerald-400 font-bold">0.92 mm/s</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. BOTTOM SUBSURFACE WELLBORE MANIFEST & HYDRO-FRACTURE LEDGER */}
        <footer className="bg-[#0D121D] border border-[#1E293B] rounded-lg p-4 shadow-xl flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between border-b border-[#1E293B] pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Subsurface Wellbore Manifest &amp; Hydro-Fracture Ledger
              </h2>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-4">
              <span>ACTIVE PRODUCTION: <b className="text-orange-400">6 WELLBORES</b></span>
              <span>RECHARGE INJECTION: <b className="text-cyan-400">3 WELLBORES</b></span>
            </div>
          </div>

          {/* Interactive Ledger Table */}
          <div className="max-h-[320px] overflow-y-auto overflow-x-auto border border-slate-800/80 rounded">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="sticky top-0 bg-[#0A0E17] z-10 shadow-sm shadow-black/40">
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-[#0A0E17]">
                  <th className="py-2.5 px-3">WELL CODE</th>
                  <th className="py-2.5 px-3">ROLE</th>
                  <th className="py-2.5 px-3">DEPTH</th>
                  <th className="py-2.5 px-3">TEMP (°C)</th>
                  <th className="py-2.5 px-3">ENTHALPY (kJ/kg)</th>
                  <th className="py-2.5 px-3">SILICA INDEX</th>
                  <th className="py-2.5 px-3">SEISMIC RISK</th>
                  <th className="py-2.5 px-3">CHOKE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">QUICK ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {wells.map((well) => (
                  <tr key={well.id} className="hover:bg-[#111827]/70 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${well.type === 'PRODUCTION' ? 'bg-orange-500' : 'bg-cyan-400'}`} />
                      {well.code}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${well.type === 'PRODUCTION' ? 'bg-orange-950/60 text-orange-400 border border-orange-800/40' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'}`}>
                        {well.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{well.depth} m</td>
                    <td className="py-2.5 px-3 text-orange-300 font-semibold">{well.tempC}°C</td>
                    <td className="py-2.5 px-3 text-slate-200">{well.enthalpyKjKg}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${well.silicaIndex > 1.0 ? 'text-red-400 font-bold' : well.silicaIndex > 0.9 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {well.silicaIndex}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${well.seismicRisk === 'AMBER' ? 'bg-amber-950/70 text-amber-400 border border-amber-800/50' : 'bg-emerald-950/50 text-emerald-400'}`}>
                        {well.seismicRisk}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-bold">{well.chokePct}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold ${well.status === 'ACTIVE' ? 'text-emerald-400' : well.status === 'CHOKED' ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {well.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setModulateWell(well);
                            setChokeInput(well.chokePct);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[10px] flex items-center gap-1 transition"
                        >
                          <Sliders className="w-3 h-3 text-cyan-400" />
                          <span>Choke</span>
                        </button>
                        <button
                          onClick={() => setFlushWell(well)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[10px] flex items-center gap-1 transition"
                        >
                          <Droplets className="w-3 h-3 text-teal-400" />
                          <span>Flush</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </footer>

        {/* MODAL 1: Modulate Injection Choke */}
        {modulateWell && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg max-w-md w-full p-5 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-slate-100 uppercase">Modulate Wellbore Choke // {modulateWell.code}</span>
                  </div>
                  <button onClick={() => setModulateWell(null)} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#111827] p-3 rounded border border-slate-800 space-y-1">
                    <div className="text-slate-400">Current Flow: <span className="text-slate-200 font-bold">{modulateWell.flowKgS} kg/s</span></div>
                    <div className="text-slate-400">Wellbore Temp: <span className="text-orange-400 font-bold">{modulateWell.tempC}°C</span></div>
                    <div className="text-slate-400">Target Formation: <span className="text-slate-200">Granodiorite Fracture Network</span></div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 font-semibold flex justify-between">
                      <span>CHOKE APERTURE PERCENT:</span>
                      <span className="text-cyan-400 font-bold">{chokeInput}%</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={chokeInput}
                      onChange={(e) => setChokeInput(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setModulateWell(null)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModulateSubmit}
                      className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-lg shadow-cyan-950/50"
                    >
                      Apply Aperture
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODAL 2: Flush Wellbore Calcite */}
        {flushWell && (
          <>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0F172A] border border-orange-500/40 rounded-lg max-w-md w-full p-5 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-orange-400 uppercase">Chemical Anti-Scalant Flush // {flushWell.code}</span>
                  </div>
                  <button onClick={() => setFlushWell(null)} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    Initiating downhole high-pressure calcite anti-scalant acid flush. Will chelate precipitated quartz-silica crystals and restore permeability.
                  </p>
                  <div className="bg-[#111827] p-3 rounded border border-slate-800 space-y-1 text-slate-400">
                    <div>Current Silica Scaling Index: <span className="text-red-400 font-bold">{flushWell.silicaIndex}</span></div>
                    <div>Post-Wash Target Index: <span className="text-emerald-400 font-bold">~0.60</span></div>
                    <div>Inhibitor Compound: <span className="text-slate-200">Polyphosphonate Organic Matrix (18 m³)</span></div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setFlushWell(null)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFlushSubmit}
                      className="px-4 py-1.5 rounded bg-orange-600 hover:bg-orange-500 font-bold text-white shadow-lg shadow-orange-950/50"
                    >
                      Confirm Inhibitor Flush
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODAL 3: BOP Emergency Safety Switch */}
        {bopModalOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0F172A] border-2 border-red-500 rounded-lg max-w-lg w-full p-6 shadow-2xl font-mono text-xs">
                <div className="flex items-center gap-3 border-b border-red-500/40 pb-3 mb-4">
                  <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-400 uppercase">
                      CRITICAL SAFETY INTERLOCK // BOP CONTAINMENT CHOKE
                    </h3>
                    <p className="text-[10px] text-slate-400">BLOWOUT PREVENTER &amp; SUPERCRITICAL MANIFOLD TRIP</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    {bopActive
                      ? 'You are about to RESET the BOP Containment Choke. This will reopen downhole production headers and re-engage continuous 462°C supercritical fluid delivery into the binary turbines.'
                      : 'WARNING: Engaging the BOP Containment Choke will immediately isolate wellhead headers, actuate blind shear rams, and vent high-enthalpy steam through the emergency silencer diffuser.'}
                  </p>

                  <div className="bg-red-950/30 border border-red-900/50 p-3 rounded text-[11px] text-red-200">
                    &bull; Station Code: CASCADE-CALDERA-04<br />
                    &bull; Hydraulic Annular Pressure: 24.5 MPa (Primed)<br />
                    &bull; Grid Interconnect: Controlled shedding active
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setBopModalOpen(false)}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Abort Action
                    </button>
                    <button
                      onClick={toggleBopSafety}
                      className={`px-5 py-2 rounded font-bold uppercase transition ${bopActive ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50'}`}
                    >
                      {bopActive ? 'Reset BOP Interlock' : 'Engage Emergency Choke'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
