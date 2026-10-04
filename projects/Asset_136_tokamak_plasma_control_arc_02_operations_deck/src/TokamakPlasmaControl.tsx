/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * COMMONWEALTH TOKAMAK ALLIANCE // ARC-02 HIGH-FIELD MAGNETIC CONFINEMENT DECK
 * Flagship Burning Plasma Fusion Operations Control Deck
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flame,
  Zap,
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Thermometer,
  Gauge,
  Cpu,
  RefreshCw,
  Sliders,
  Wind,
  Layers,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  X,
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  Crosshair,
  Maximize2
} from 'lucide-react';

// Type Definitions
interface DivertorTile {
  code: string;
  zone: 'UPPER_OUTER' | 'UPPER_INNER' | 'DOME' | 'LOWER_INNER' | 'LOWER_OUTER';
  sector: number;
  heatFlux: number; // MW/m²
  tempC: number; // °C
  densityNe: number; // 10^20 m⁻³
  tempTe: number; // eV
  coolantFlow: number; // kg/s
  warningLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
}

interface ZoneDiagnostics {
  name: string;
  subTitle: string;
  teKeV: number;
  tiKeV: number;
  density: number; // 10^20 m^-3
  safetyFactorQ: number;
  poloidalFieldT: number;
  thermalPressureAtm: number;
  description: string;
}

export function TokamakPlasmaControl() {
  // Operational Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [shotNumber] = useState<number>(4092);
  const [pulseTime, setPulseTime] = useState<number>(42.8); // seconds into flat-top
  const [shotStatus, setShotStatus] = useState<'FLAT_TOP' | 'QUENCHED' | 'RAMPING'>('FLAT_TOP');

  // Core Plasma Physics Metrics (Dynamic)
  const [coreTempKeV, setCoreTempKeV] = useState<number>(12.35); // keV (~143.3 MK)
  const [plasmaCurrentMa, setPlasmaCurrentMa] = useState<number>(15.22); // MA
  const [toroidalFieldT, setToroidalFieldT] = useState<number>(12.41); // Tesla
  const [fusionGainQ, setFusionGainQ] = useState<number>(11.45);
  const [normalizedBetaBn, setNormalizedBetaBn] = useState<number>(2.46);
  const [greenwaldFraction, setGreenwaldFraction] = useState<number>(0.842);
  const [neutronRate, setNeutronRate] = useState<number>(1.84); // x 10^20 n/s

  // Auxiliary Heating States
  const [nbi1Power, setNbi1Power] = useState<number>(15.8); // MW
  const [nbi2Power, setNbi2Power] = useState<number>(15.7); // MW
  const [ecrhPower, setEcrhPower] = useState<number>(15.9); // MW (4x gyrotrons)
  const [ecrhFrequency] = useState<number>(170.0); // GHz
  const [ecrhAngle, setEcrhAngle] = useState<number>(18.5); // Deg

  // HTS Magnet Cryogenics & Diagnostics
  const [cryoInletTemp, setCryoInletTemp] = useState<number>(19.82); // K
  const [cryoOutletTemp, setCryoOutletTemp] = useState<number>(20.44); // K
  const [quenchVoltageBridge, setQuenchVoltageBridge] = useState<number>(1.42); // microvolts
  const [cryostatPressure, setCryostatPressure] = useState<number>(1.18); // x 10^-8 mbar
  const [lorentzStress, setLorentzStress] = useState<number>(382.4); // MPa

  // Confinement & Mitigation Toggles
  const [elmCoilsActive, setElmCoilsActive] = useState<boolean>(true);
  const [argonPuffActive, setArgonPuffActive] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>('CORE');
  const [showFluxSurfaces, setShowFluxSurfaces] = useState<boolean>(true);
  const [showDensityProfile, setShowDensityProfile] = useState<boolean>(true);

  // Safety & Quench Interlock
  const [safetyKeyArmed, setSafetyKeyArmed] = useState<boolean>(false);
  const [showQuenchModal, setShowQuenchModal] = useState<boolean>(false);
  const [showArgonModal, setShowArgonModal] = useState<boolean>(false);
  const [showSolenoidModal, setShowSolenoidModal] = useState<boolean>(false);
  const [argonDose, setArgonDose] = useState<number>(2.0); // Pa*m³/s
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter for Divertor Plates
  const [divertorFilter, setDivertorFilter] = useState<'ALL' | 'LOWER' | 'UPPER'>('ALL');

  // Divertor Target Plates Data
  const [divertorTiles, setDivertorTiles] = useState<DivertorTile[]>([
    { code: 'DIV-UPPER-01', zone: 'UPPER_OUTER', sector: 1, heatFlux: 4.22, tempC: 420.5, densityNe: 1.15, tempTe: 24.2, coolantFlow: 14.8, warningLevel: 'NOMINAL' },
    { code: 'DIV-UPPER-02', zone: 'UPPER_OUTER', sector: 2, heatFlux: 4.65, tempC: 438.0, densityNe: 1.20, tempTe: 25.0, coolantFlow: 14.8, warningLevel: 'NOMINAL' },
    { code: 'DIV-UPPER-03', zone: 'UPPER_INNER', sector: 3, heatFlux: 3.80, tempC: 395.2, densityNe: 0.95, tempTe: 19.8, coolantFlow: 14.5, warningLevel: 'NOMINAL' },
    { code: 'DIV-UPPER-04', zone: 'UPPER_INNER', sector: 4, heatFlux: 3.94, tempC: 402.1, densityNe: 0.98, tempTe: 20.4, coolantFlow: 14.5, warningLevel: 'NOMINAL' },
    { code: 'DIV-LOWER-01', zone: 'LOWER_OUTER', sector: 1, heatFlux: 9.85, tempC: 785.4, densityNe: 3.82, tempTe: 38.6, coolantFlow: 22.4, warningLevel: 'ELEVATED' },
    { code: 'DIV-LOWER-02', zone: 'LOWER_OUTER', sector: 2, heatFlux: 10.42, tempC: 814.0, densityNe: 4.10, tempTe: 41.2, coolantFlow: 22.4, warningLevel: 'ELEVATED' },
    { code: 'DIV-LOWER-03', zone: 'LOWER_OUTER', sector: 3, heatFlux: 11.28, tempC: 865.9, densityNe: 4.45, tempTe: 44.5, coolantFlow: 23.1, warningLevel: 'CRITICAL' },
    { code: 'DIV-LOWER-04', zone: 'LOWER_OUTER', sector: 4, heatFlux: 10.85, tempC: 845.2, densityNe: 4.28, tempTe: 42.8, coolantFlow: 22.8, warningLevel: 'ELEVATED' },
    { code: 'DIV-LOWER-05', zone: 'DOME',        sector: 1, heatFlux: 2.15, tempC: 310.8, densityNe: 0.65, tempTe: 14.0, coolantFlow: 12.0, warningLevel: 'NOMINAL' },
    { code: 'DIV-LOWER-06', zone: 'DOME',        sector: 2, heatFlux: 2.30, tempC: 322.4, densityNe: 0.70, tempTe: 14.5, coolantFlow: 12.0, warningLevel: 'NOMINAL' },
    { code: 'DIV-LOWER-07', zone: 'LOWER_INNER', sector: 3, heatFlux: 7.64, tempC: 650.1, densityNe: 2.90, tempTe: 31.5, coolantFlow: 19.5, warningLevel: 'NOMINAL' },
    { code: 'DIV-LOWER-08', zone: 'LOWER_INNER', sector: 4, heatFlux: 7.82, tempC: 664.7, densityNe: 3.02, tempTe: 32.8, coolantFlow: 19.5, warningLevel: 'NOMINAL' },
  ]);

  // Toast Helper
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Plasma zones inspection catalog
  const zoneInfoCatalog: Record<string, ZoneDiagnostics> = useMemo(() => ({
    CORE: {
      name: 'BURNING CORE PLASMA (ψ ≤ 0.25)',
      subTitle: 'Thermonuclear D-T Fusion Reaction Zone',
      teKeV: coreTempKeV,
      tiKeV: coreTempKeV * 1.04,
      density: 1.48,
      safetyFactorQ: 1.05,
      poloidalFieldT: 0.85,
      thermalPressureAtm: 8.42,
      description: 'Central ignition core confined by helical flux surfaces. Alpha particle heating sustains steady-state burning regime with high fusion triple product n·T·τE.'
    },
    PEDESTAL: {
      name: 'H-MODE EDGE PEDESTAL (0.85 < ψ ≤ 0.98)',
      subTitle: 'Steep Transport Barrier (ETB)',
      teKeV: 4.85,
      tiKeV: 4.60,
      density: 1.12,
      safetyFactorQ: 2.82,
      poloidalFieldT: 2.45,
      thermalPressureAtm: 3.65,
      description: 'High-confinement transport barrier with sheared ExB flow suppression of turbulence. Susceptible to peeling-ballooning ELM instabilities mitigated by active RMP coils.'
    },
    SOL: {
      name: 'SCRAPE-OFF LAYER (SOL, ψ > 1.0)',
      subTitle: 'Open Field Line Exhaust Channel',
      teKeV: 0.22,
      tiKeV: 0.28,
      density: 0.35,
      safetyFactorQ: 4.10,
      poloidalFieldT: 1.95,
      thermalPressureAtm: 0.45,
      description: 'Radial cross-field particle transport along open magnetic field lines directly channeled to divertor target plates with supersonic parallel exhaust flow.'
    },
    DIVERTOR_X: {
      name: 'POLOIDAL NULL (X-POINT REGION)',
      subTitle: 'Lower Single-Null Magnetic Separatrix',
      teKeV: 0.85,
      tiKeV: 0.92,
      density: 0.65,
      safetyFactorQ: Infinity,
      poloidalFieldT: 0.05,
      thermalPressureAtm: 0.92,
      description: 'Zero poloidal magnetic field locus (Bp = 0). Infinite magnetic shear provides stabilization against low-n MHD instabilities and defines boundary between closed and open flux.'
    },
    SOLENOID: {
      name: 'CENTRAL SOLENOID STACK (R = 0)',
      subTitle: 'High-Field Pulsed Inductive Drive',
      teKeV: 0.0,
      tiKeV: 0.0,
      density: 0.0,
      safetyFactorQ: 0.0,
      poloidalFieldT: 14.5,
      thermalPressureAtm: 0.0,
      description: 'Segmented REBCO superconducting solenoid providing 120 V·s volt-second inductive flux capability to drive and maintain plasma current Ip.'
    }
  }), [coreTempKeV]);

  // Real-time Physics Simulation Loop (500ms intervals)
  useEffect(() => {
    if (!isRunning || shotStatus === 'QUENCHED') return;

    const interval = setInterval(() => {
      setPulseTime(prev => Number((prev + 0.5).toFixed(1)));

      // Micro-oscillations in plasma parameters
      const betaDrift = (Math.random() - 0.49) * 0.015;
      setNormalizedBetaBn(prev => Math.max(2.1, Math.min(2.85, Number((prev + betaDrift).toFixed(3)))));

      const ripple = (Math.random() - 0.5) * 0.02;
      setToroidalFieldT(prev => Number((12.40 + ripple).toFixed(2)));

      const ipOsc = (Math.random() - 0.5) * 0.03;
      setPlasmaCurrentMa(prev => Number((15.20 + ipOsc).toFixed(2)));

      // Temperature drift influenced by auxiliary heating
      const auxSum = nbi1Power + nbi2Power + ecrhPower;
      const baseTemp = 10.0 + (auxSum / 47.0) * 2.35;
      const tempJitter = (Math.random() - 0.48) * 0.08;
      setCoreTempKeV(Number((baseTemp + tempJitter).toFixed(2)));

      // Gain factor Q calculation
      const dynamicQ = (baseTemp / 12.35) * (plasmaCurrentMa / 15.2) * 11.45;
      setFusionGainQ(Number(dynamicQ.toFixed(2)));

      // Neutron yield rate oscillation (10^20 n/s)
      const nJitter = (Math.random() - 0.5) * 0.04;
      setNeutronRate(Number((1.84 + nJitter).toFixed(2)));

      // Cryogenic micro-telemetry
      setQuenchVoltageBridge(Number((1.35 + Math.random() * 0.18).toFixed(2)));
      setCryoInletTemp(Number((19.80 + Math.random() * 0.05).toFixed(2)));
      setCryoOutletTemp(Number((20.40 + Math.random() * 0.08).toFixed(2)));

      // Divertor tile thermal response
      setDivertorTiles(prevTiles =>
        prevTiles.map(tile => {
          let deltaFlux = (Math.random() - 0.5) * 0.15;
          if (argonPuffActive && tile.zone.startsWith('LOWER')) {
            deltaFlux -= 0.18; // Cooling effect of radiative divertor
          }
          const newFlux = Math.max(1.8, Number((tile.heatFlux + deltaFlux).toFixed(2)));
          const targetTemp = tile.zone.startsWith('LOWER_OUTER')
            ? 700 + newFlux * 15
            : 350 + newFlux * 18;
          const newTemp = Number((tile.tempC * 0.95 + targetTemp * 0.05).toFixed(1));

          let level: 'NOMINAL' | 'ELEVATED' | 'CRITICAL' = 'NOMINAL';
          if (newFlux >= 11.0 || newTemp >= 850) {
            level = 'CRITICAL';
          } else if (newFlux >= 8.5 || newTemp >= 750) {
            level = 'ELEVATED';
          }

          return {
            ...tile,
            heatFlux: newFlux,
            tempC: newTemp,
            warningLevel: level
          };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, shotStatus, nbi1Power, nbi2Power, ecrhPower, argonPuffActive, plasmaCurrentMa]);

  // Action: Trigger Argon Impurity Puff
  const handleApplyArgonPuff = () => {
    setArgonPuffActive(true);
    setShowArgonModal(false);
    triggerToast(`[ACTUATOR] ARGON IMPURITY PUFF INJECTED @ ${argonDose} Pa·m³/s - RADIATIVE DETACHMENT ENGAGED`);

    setTimeout(() => {
      setArgonPuffActive(false);
      triggerToast(`[VACUUM] ARGON CHARGE EXHAUSTED - DIVERTOR RECOVERED TO NOMINAL REGIME`);
    }, 8000);
  };

  // Action: Central Solenoid Inductive Ramp
  const handleRampSolenoid = () => {
    setShowSolenoidModal(false);
    setPlasmaCurrentMa(prev => Number((prev + 0.08).toFixed(2)));
    triggerToast(`[CS DRIVER] CENTRAL SOLENOID FLUX RAMPED +0.25 V·s -> Ip INCREASED TO ${ (plasmaCurrentMa + 0.08).toFixed(2) } MA`);
  };

  // Action: Cycle Divertor Cryo Pumps
  const handleCycleCryoPumps = () => {
    triggerToast(`[CRYO] DIVERTOR SORPTION PANELS REGENERATING - CRYOGENIC VALVE PURGE EXECUTED`);
    setCryostatPressure(1.05);
    setTimeout(() => {
      setCryostatPressure(1.18);
    }, 4000);
  };

  // Action: Emergency Quench & Rapid Plasma Dump
  const handleExecuteEmergencyQuench = () => {
    setShowQuenchModal(false);
    setShotStatus('QUENCHED');
    setIsRunning(false);
    setPlasmaCurrentMa(0.00);
    setFusionGainQ(0.00);
    setCoreTempKeV(0.05);
    setNeutronRate(0.00);
    setSafetyKeyArmed(false);
    triggerToast(`[INTERLOCK ACTIVATED] EMERGENCY MASSIVE GAS & PELLET QUENCH FIRED. TOROIDAL CURRENT DISCHARGED.`);
  };

  // Action: Reset Shot
  const handleResetShot = () => {
    setShotStatus('FLAT_TOP');
    setPulseTime(42.8);
    setCoreTempKeV(12.35);
    setPlasmaCurrentMa(15.22);
    setFusionGainQ(11.45);
    setNormalizedBetaBn(2.46);
    setNeutronRate(1.84);
    setIsRunning(true);
    triggerToast(`[RESET] ARC-02 SHOT #4092 RE-INITIALIZED IN H-MODE FLAT-TOP.`);
  };

  // Filtered divertor tiles
  const filteredTiles = useMemo(() => {
    if (divertorFilter === 'ALL') return divertorTiles;
    if (divertorFilter === 'LOWER') return divertorTiles.filter(t => t.zone.startsWith('LOWER') || t.zone === 'DOME');
    return divertorTiles.filter(t => t.zone.startsWith('UPPER'));
  }, [divertorTiles, divertorFilter]);

  // Selected Zone Diagnostics Detail
  const activeZoneData = zoneInfoCatalog[selectedZone] || zoneInfoCatalog.CORE;

  return (
    <>
      <div className="min-h-screen bg-[#03050A] text-slate-100 flex flex-col antialiased selection:bg-fuchsia-600 selection:text-white">
        
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 bg-slate-900/95 border-2 border-cyan-400 text-cyan-200 px-4 py-3 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-xs md:text-sm font-bold tracking-wider">{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANE 1: TOP PLASMA STABILITY & CONFINEMENT HUD                            */}
        {/* ========================================================================= */}
        <header className="border-b border-[#1E293B] bg-[#070B13]/90 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
            
            {/* CTA Hub Identification */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex items-center justify-center w-11 h-11 bg-[#111827] border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0">
                <Flame className="w-6 h-6 text-fuchsia-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 animate-ping" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-700/60 whitespace-nowrap">
                    HIGH-FIELD HTS REBCO
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/60 whitespace-nowrap">
                    BURNING PLASMA
                  </span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                    shotStatus === 'FLAT_TOP' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse' 
                      : 'bg-rose-950 text-rose-300 border-rose-600'
                  }`}>
                    {shotStatus}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800/90 text-cyan-200 border border-slate-700 whitespace-nowrap">
                    HIGH-FIELD MAGNETIC CONFINEMENT DECK
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100 break-words leading-tight">
                  COMMONWEALTH TOKAMAK ALLIANCE // ARC-02
                </h1>
              </div>
            </div>

            {/* Pulse Timer & Simulation Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-[#0B0F17] border border-[#1E293B] px-3 py-1.5 flex items-center space-x-3">
                <span className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">SHOT #{shotNumber}</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">PULSE:</span>
                <span className="text-base font-black font-mono text-cyan-300 tabular-nums">
                  +{pulseTime.toFixed(1)}s
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-cyan-900/60 text-cyan-200 border border-cyan-600/40 uppercase">
                  FLAT-TOP
                </span>
              </div>

              {/* Pause / Resume Live Tick */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={shotStatus === 'QUENCHED'}
                className="px-3 py-1.5 bg-[#111827] border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 flex items-center space-x-1.5 text-xs font-bold uppercase transition disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>HOLD TELEMETRY</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RESUME TICK</span>
                  </>
                )}
              </button>

              {/* Reset if quenched */}
              {shotStatus === 'QUENCHED' && (
                <button
                  onClick={handleResetShot}
                  className="px-3 py-1.5 bg-cyan-950 border border-cyan-500 text-cyan-300 hover:bg-cyan-900 flex items-center space-x-1.5 text-xs font-black uppercase transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RE-ARM ARC-02</span>
                </button>
              )}

              {/* KEYED EMERGENCY QUENCH TOGGLE SWITCH */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => setSafetyKeyArmed(!safetyKeyArmed)}
                  title="Turn physical safety interlock key"
                  className={`p-1.5 border transition ${
                    safetyKeyArmed 
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {safetyKeyArmed ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (!safetyKeyArmed) {
                      triggerToast('[INTERLOCK ERROR] SAFETY KEY MUST BE UNLOCKED PRIOR TO FIRING RAPID DUMP');
                      return;
                    }
                    setShowQuenchModal(true);
                  }}
                  className={`px-3 py-1.5 border font-mono text-xs font-black tracking-wider uppercase transition flex items-center space-x-2 ${
                    safetyKeyArmed
                      ? 'bg-rose-950 border-rose-500 text-rose-200 hover:bg-rose-900 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>RAPID PLASMA DUMP</span>
                </button>
              </div>

            </div>
          </div>

          {/* BALANCED 4-COLUMN TOP HUD METRICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            
            {/* 1. Core Ion Temperature */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-fuchsia-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>CORE ION TEMP (Ti)</span>
                <Thermometer className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.35)]">
                  {coreTempKeV.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-fuchsia-200 uppercase">keV</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>≈ {(coreTempKeV * 11.605).toFixed(1)} MK</span>
                <span className="text-emerald-400 font-bold">IGNITION OK</span>
              </div>
            </div>

            {/* 2. Plasma Current Ip */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-cyan-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>PLASMA CURRENT (Ip)</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.35)]">
                  {plasmaCurrentMa.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-cyan-200 uppercase">MA</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>TARGET: 15.20 MA</span>
                <span className="text-cyan-300 font-bold">100.1%</span>
              </div>
            </div>

            {/* 3. Toroidal Field Bt */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-indigo-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>TOROIDAL FIELD (Bt)</span>
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-indigo-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.35)]">
                  {toroidalFieldT.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-indigo-200 uppercase">TESLA</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>HTS REBCO COILS</span>
                <span className="text-indigo-400 font-bold">20 K NEON</span>
              </div>
            </div>

            {/* 4. Fusion Gain Factor Q */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-emerald-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>FUSION GAIN (Q)</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]">
                  {fusionGainQ.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-200 uppercase">NET +</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>P_FUS ≈ 520 MW</span>
                <span className="text-emerald-400 font-bold">BURNING</span>
              </div>
            </div>

            {/* 5. Normalized Beta βN */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-amber-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>NORMALIZED BETA (βN)</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-amber-300">
                  {normalizedBetaBn.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-amber-200 uppercase">TROYON</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>LIMIT: 2.80</span>
                <span className="text-amber-400 font-bold">87.8% LIMIT</span>
              </div>
            </div>

            {/* 6. Greenwald Density Fraction */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-cyan-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>GREENWALD (n/nG)</span>
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-cyan-300">
                  {greenwaldFraction.toFixed(3)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>LINE AVG ne: 1.48e20</span>
                <span className="text-emerald-400 font-bold">NOMINAL</span>
              </div>
            </div>

            {/* 7. Total 14.1 MeV Neutron Rate */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-violet-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>14.1 MeV NEUTRONS</span>
                <Compass className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-violet-300">
                  {neutronRate.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-violet-200">×10²⁰/s</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>BLANKET BREEDING</span>
                <span className="text-violet-400 font-bold">TBR = 1.14</span>
              </div>
            </div>

            {/* 8. Alpha Particle Self-Heating Power */}
            <div className="bg-[#0B0F17] border border-[#1E293B] hover:border-rose-500/50 p-3 transition shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
                <span>ALPHA HEATING (Pα)</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black font-mono tabular-nums text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.35)]">
                  {(fusionGainQ * 9.1).toFixed(1)}
                </span>
                <span className="text-xs font-bold text-rose-200 uppercase">MW</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>SELF-HEATING SHARE</span>
                <span className="text-rose-400 font-bold">69.2% TOTAL</span>
              </div>
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* CENTER SECTION: 2D POLOIDAL CROSS SECTION (LEFT) + AUX HEATING / CRYO (RIGHT) */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6">
          
          {/* ======================================================================= */}
          {/* PANE 2: CENTER-LEFT 2D POLOIDAL CROSS-SECTION & MAGNETIC FLUX CANVAS   */}
          {/* ======================================================================= */}
          <section className="lg:col-span-7 bg-[#0B0F17] border border-[#1E293B] flex flex-col shadow-xl">
            {/* Header with Display Controls */}
            <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0F172A]/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider text-slate-100 uppercase">
                  2D POLOIDAL CROSS-SECTION & FLUX SURFACES (EFIT-Recon)
                </h2>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <button
                  onClick={() => setShowFluxSurfaces(!showFluxSurfaces)}
                  className={`px-2.5 py-1 border transition uppercase font-bold ${
                    showFluxSurfaces 
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Ψ FLUX {showFluxSurfaces ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setShowDensityProfile(!showDensityProfile)}
                  className={`px-2.5 py-1 border transition uppercase font-bold ${
                    showDensityProfile 
                      ? 'bg-fuchsia-950/70 border-fuchsia-500 text-fuchsia-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  TE / NE HEATMAP
                </button>
                <button
                  onClick={() => setElmCoilsActive(!elmCoilsActive)}
                  className={`px-2.5 py-1 border transition uppercase font-bold flex items-center space-x-1 ${
                    elmCoilsActive 
                      ? 'bg-amber-950/70 border-amber-500 text-amber-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>RMP ELM COILS:</span>
                  <span className={elmCoilsActive ? 'text-amber-400' : 'text-slate-500'}>
                    {elmCoilsActive ? 'LOCKED' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative flex-1 min-h-[460px] flex items-center justify-center p-3 bg-[#03050A] overflow-hidden">
              
              {/* Background Geometric Grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#d946ef 1px, #03050A 1px)',
                  backgroundSize: '30px 30px',
                  backgroundPosition: '0 0, 15px 15px'
                }}
              />

              <svg 
                viewBox="0 0 540 640" 
                className="w-full h-auto max-h-[560px] drop-shadow-2xl select-none"
              >
                <defs>
                  {/* Core Plasma Radial Glow */}
                  <radialGradient id="corePlasmaGlow" cx="50%" cy="48%" r="48%">
                    <stop offset="0%" stopColor="#fae8ff" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#d946ef" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.55" />
                    <stop offset="90%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#03050a" stopOpacity="0.0" />
                  </radialGradient>

                  {/* Divertor Heat Flux Gradient */}
                  <linearGradient id="divertorHeatGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>

                  {/* Central Solenoid Gradient */}
                  <linearGradient id="solenoidGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="30%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Filter for glowing lines */}
                  <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="fuchsiaGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* COORDINATE AXES & MAJOR RADIUS MARKS (R, Z) */}
                <g className="text-[10px] font-mono fill-slate-500">
                  <line x1="120" y1="310" x2="510" y2="310" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="310" y1="30" x2="310" y2="610" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <text x="315" y="45" fill="#64748b" fontWeight="bold">Z = +3.5 m</text>
                  <text x="315" y="595" fill="#64748b" fontWeight="bold">Z = -3.5 m</text>
                  <text x="130" y="305" fill="#64748b" fontWeight="bold">R = 1.8 m</text>
                  <text x="470" y="305" fill="#64748b" fontWeight="bold">R = 4.8 m</text>
                  <text x="315" y="325" fill="#38bdf8" fontWeight="bold">R₀ = 3.3 m (MAGNETIC AXIS)</text>
                </g>

                {/* 1. CENTRAL SOLENOID STACK (R = 0 to 1.4m) */}
                <g 
                  onClick={() => setSelectedZone('SOLENOID')}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="35" 
                    y="70" 
                    width="55" 
                    height="480" 
                    fill="url(#solenoidGradient)" 
                    stroke="#38bdf8" 
                    strokeWidth="1.5"
                    className="group-hover:stroke-cyan-300 transition"
                  />
                  {/* Solenoid Segment Blocks */}
                  {[90, 150, 210, 270, 330, 390, 450, 510].map((y, idx) => (
                    <line key={idx} x1="35" y1={y} x2="90" y2={y} stroke="#0f172a" strokeWidth="2.5" />
                  ))}
                  <text 
                    x="-310" 
                    y="65" 
                    transform="rotate(-90)" 
                    fill="#94a3b8" 
                    fontSize="11" 
                    fontWeight="bold"
                    letterSpacing="2"
                    textAnchor="middle"
                  >
                    CENTRAL SOLENOID STACK (REBCO 120 V·s)
                  </text>
                </g>

                {/* 2. TOROIDAL FIELD (TF) D-COIL CASING OUTER PERIMETER */}
                <path
                  d="M 100 80 C 100 40, 240 25, 360 40 C 470 60, 525 180, 525 310 C 525 440, 470 560, 360 580 C 240 595, 100 580, 100 540 Z"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />

                {/* 3. DOUBLE-WALL VACUUM VESSEL & BERYLLIUM FIRST WALL */}
                <path
                  d="M 140 120 C 160 80, 270 70, 360 85 C 450 100, 490 200, 490 310 C 490 420, 450 510, 370 535 C 290 560, 190 540, 140 500 C 130 400, 130 220, 140 120 Z"
                  fill="#070b13"
                  stroke="#334155"
                  strokeWidth="4"
                />

                {/* 4. UPPER PASSIVE DIVERTOR PLATES (DIV-UPPER) */}
                <path
                  d="M 270 88 L 330 92 L 350 115 L 290 110 Z"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text x="300" y="82" fill="#38bdf8" fontSize="9" fontWeight="bold">UPPER DIVERTOR</text>

                {/* 5. PLASMA REGION / CORE HEATMAP GLOW */}
                {showDensityProfile && (
                  <path
                    d="M 175 180 C 210 135, 310 130, 385 155 C 445 180, 465 240, 465 310 C 465 390, 435 445, 365 475 C 310 500, 280 505, 230 460 C 180 410, 160 280, 175 180 Z"
                    fill="url(#corePlasmaGlow)"
                    className="animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                )}

                {/* 6. MAGNETIC FLUX SURFACES (PSI CONTOURS ψ = 0.2, 0.4, 0.6, 0.8, 1.0) */}
                {showFluxSurfaces && (
                  <g className="transition-opacity duration-300">
                    {/* ψ = 0.2 Core Closed Flux */}
                    <path
                      d="M 275 250 C 300 230, 340 230, 365 255 C 385 275, 385 340, 365 365 C 340 385, 290 385, 275 360 C 260 335, 260 275, 275 250 Z"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                      filter="url(#fuchsiaGlow)"
                      className="cursor-pointer hover:stroke-white"
                      onClick={() => setSelectedZone('CORE')}
                    />

                    {/* ψ = 0.5 Mid-Core Flux */}
                    <path
                      d="M 240 215 C 275 185, 360 185, 395 220 C 425 250, 425 365, 390 405 C 355 435, 280 435, 250 400 C 220 360, 220 255, 240 215 Z"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:stroke-white"
                      onClick={() => setSelectedZone('CORE')}
                    />

                    {/* ψ = 0.8 Pedestal Boundary */}
                    <path
                      d="M 210 180 C 255 145, 380 145, 425 190 C 455 225, 455 390, 415 440 C 375 475, 275 480, 225 435 C 190 390, 185 225, 210 180 Z"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="6 2"
                      filter="url(#cyanGlow)"
                      className="cursor-pointer hover:stroke-white"
                      onClick={() => setSelectedZone('PEDESTAL')}
                    />

                    {/* ψ = 1.0 SEPARATRIX (LAST CLOSED FLUX SURFACE) WITH LOWER X-POINT */}
                    <path
                      d="M 190 160 C 240 120, 390 120, 440 170 C 475 210, 475 410, 430 460 C 385 505, 325 515, 270 515 C 235 515, 205 485, 175 440 C 150 380, 160 210, 190 160 Z"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.2"
                      className="cursor-pointer hover:stroke-white"
                      onClick={() => setSelectedZone('PEDESTAL')}
                    />

                    {/* X-POINT LEGS TO DIVERTOR STRIKE POINTS */}
                    <path
                      d="M 270 515 L 230 575 M 270 515 L 340 580"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeDasharray="3 2"
                    />

                    {/* X-POINT MARKER */}
                    <circle
                      cx="270"
                      cy="515"
                      r="6"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer animate-ping"
                      style={{ animationDuration: '2s' }}
                      onClick={() => setSelectedZone('DIVERTOR_X')}
                    />
                    <circle
                      cx="270"
                      cy="515"
                      r="4"
                      fill="#ef4444"
                      className="cursor-pointer"
                      onClick={() => setSelectedZone('DIVERTOR_X')}
                    />
                    <text x="282" y="520" fill="#f87171" fontSize="11" fontWeight="bold">X-POINT (Bp=0)</text>
                  </g>
                )}

                {/* 7. LOWER DIVERTOR TARGET ARMOR & STRIKE ZONES (TUNGSTEN) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => setSelectedZone('DIVERTOR_X')}
                >
                  {/* Inner Strike Plate (ISP) */}
                  <path
                    d="M 205 565 L 245 580 L 235 595 L 195 580 Z"
                    fill={argonPuffActive ? '#0284c7' : '#ea580c'}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <text x="180" y="608" fill="#fbbf24" fontSize="9" fontWeight="bold">ISP (INNER)</text>

                  {/* Divertor Dome */}
                  <path
                    d="M 260 575 L 300 575 L 295 590 L 265 590 Z"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Outer Strike Plate (OSP) - HIGHEST HEAT FLUX */}
                  <path
                    d="M 320 580 L 375 560 L 385 575 L 330 595 Z"
                    fill={argonPuffActive ? '#0284c7' : 'url(#divertorHeatGradient)'}
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text x="350" y="608" fill="#f87171" fontSize="9" fontWeight="bold">OSP (OUTER ~11.2 MW/m²)</text>
                </g>

                {/* 8. RESONANT MAGNETIC PERTURBATION (RMP) ELM COILS */}
                {elmCoilsActive && (
                  <g className="animate-pulse" style={{ animationDuration: '1.2s' }}>
                    {/* Low-Field Side (LFS) RMP Coils Upper, Mid, Lower */}
                    <rect x="495" y="190" width="18" height="35" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                    <rect x="495" y="295" width="18" height="35" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                    <rect x="495" y="400" width="18" height="35" rx="3" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
                    
                    {/* Magnetic Perturbation Ripples (n=3 Mode) */}
                    <path d="M 490 205 Q 460 220 445 205" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 490 310 Q 460 325 445 310" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 490 415 Q 460 430 445 415" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />

                    <text x="430" y="175" fill="#f59e0b" fontSize="9" fontWeight="bold">RMP n=3 ELM SUPPRESSION</text>
                  </g>
                )}

                {/* 9. MAGNETIC AXIS / SHAFRANOV SHIFT POINT */}
                <circle
                  cx="310"
                  cy="310"
                  r="5"
                  fill="#ffffff"
                  stroke="#d946ef"
                  strokeWidth="2.5"
                  className="cursor-pointer"
                  onClick={() => setSelectedZone('CORE')}
                />
                <circle
                  cx="310"
                  cy="310"
                  r="12"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />

                {/* 10. NEUTRAL BEAM INJECTION (NBI) CHORD OVERLAY */}
                <line
                  x1="510"
                  y1="230"
                  x2="240"
                  y2="340"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.85"
                />
                <text x="420" y="220" fill="#38bdf8" fontSize="9" fontWeight="bold">NBI-1 TANGENCY CHORD</text>

                {/* 11. ECRH 170 GHz RESONANCE LAUNCHER CHORD */}
                <line
                  x1="510"
                  y1="380"
                  x2="310"
                  y2="310"
                  stroke="#d946ef"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.85"
                />
                <text x="400" y="375" fill="#d946ef" fontSize="9" fontWeight="bold">ECRH 170 GHz FOCUS</text>
              </svg>

              {/* Argon Impurity Puff Particle Visual Overlay */}
              {argonPuffActive && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-400 px-3 py-1.5 text-cyan-300 font-mono text-xs font-black tracking-wider flex items-center space-x-2 animate-bounce">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span>RADIATIVE ARGON MANTLE ACTIVE // PEAK HEAT FLUX MITIGATED (-35%)</span>
                </div>
              )}
            </div>

            {/* Selected Zone Deep Diagnostic Drawer */}
            <div className="border-t border-[#1E293B] bg-[#070B13] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-800 gap-2">
                <div>
                  <div className="text-[11px] font-bold font-mono tracking-wider text-cyan-400 uppercase">
                    ZONE DIAGNOSTICS INSPECTION // {selectedZone}
                  </div>
                  <h3 className="text-base font-black font-mono text-slate-100 uppercase">
                    {activeZoneData.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {['CORE', 'PEDESTAL', 'SOL', 'DIVERTOR_X', 'SOLENOID'].map(zoneKey => (
                    <button
                      key={zoneKey}
                      onClick={() => setSelectedZone(zoneKey)}
                      className={`px-2 py-0.5 text-xs font-bold font-mono uppercase transition ${
                        selectedZone === zoneKey 
                          ? 'bg-cyan-500 text-black font-black' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {zoneKey === 'DIVERTOR_X' ? 'X-POINT' : zoneKey}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-2 text-xs font-mono text-slate-400 leading-relaxed">
                {activeZoneData.description}
              </p>

              {/* Local parameters grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Te (ELECTRON)</span>
                  <span className="text-base font-black font-mono text-cyan-300">
                    {activeZoneData.teKeV.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">keV</span>
                  </span>
                </div>
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ti (ION)</span>
                  <span className="text-base font-black font-mono text-fuchsia-300">
                    {activeZoneData.tiKeV.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">keV</span>
                  </span>
                </div>
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ne DENSITY</span>
                  <span className="text-base font-black font-mono text-slate-100">
                    {activeZoneData.density.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">10²⁰/m³</span>
                  </span>
                </div>
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">SAFETY (q)</span>
                  <span className="text-base font-black font-mono text-amber-300">
                    {activeZoneData.safetyFactorQ === Infinity ? '∞ (NULL)' : activeZoneData.safetyFactorQ.toFixed(2)}
                  </span>
                </div>
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bp FIELD</span>
                  <span className="text-base font-black font-mono text-slate-100">
                    {activeZoneData.poloidalFieldT.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">T</span>
                  </span>
                </div>
                <div className="bg-[#0F172A] p-2 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PRESSURE</span>
                  <span className="text-base font-black font-mono text-emerald-300">
                    {activeZoneData.thermalPressureAtm.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">ATM</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* PANE 3: CENTER-RIGHT AUXILIARY HEATING & MAGNET CRYOGENICS             */}
          {/* ======================================================================= */}
          <section className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* SUB-PANEL A: AUXILIARY HEATING (NBI & ECRH GYROTRONS) */}
            <div className="bg-[#0B0F17] border border-[#1E293B] shadow-xl p-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-fuchsia-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider text-slate-100 uppercase">
                    AUXILIARY HEATING & CURRENT DRIVE
                  </h2>
                </div>
                <span className="text-xs font-bold font-mono text-fuchsia-400 bg-fuchsia-950 px-2 py-0.5 border border-fuchsia-700/60 uppercase">
                  TOTAL: {(nbi1Power + nbi2Power + ecrhPower).toFixed(1)} MW
                </span>
              </div>

              {/* NBI Beamlines 1 & 2 */}
              <div className="mt-3 space-y-3">
                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>NEUTRAL BEAM INJECTION 1 (NBI-1)</span>
                    </span>
                    <span className="text-cyan-400 font-black">{nbi1Power.toFixed(1)} MW</span>
                  </div>

                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="16.0"
                      step="0.1"
                      value={nbi1Power}
                      onChange={(e) => setNbi1Power(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-none"
                    />
                    <span className="text-xs font-mono font-bold text-slate-300 w-16 text-right">
                      {nbi1Power.toFixed(1)} / 16 MW
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>ACCEL: <span className="text-slate-200 font-bold">120 keV D°</span></div>
                    <div>NEUTRAL EFF: <span className="text-emerald-400 font-bold">84.2%</span></div>
                    <div>PITCH: <span className="text-slate-200 font-bold">22.5° TANG</span></div>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>NEUTRAL BEAM INJECTION 2 (NBI-2)</span>
                    </span>
                    <span className="text-cyan-400 font-black">{nbi2Power.toFixed(1)} MW</span>
                  </div>

                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="16.0"
                      step="0.1"
                      value={nbi2Power}
                      onChange={(e) => setNbi2Power(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-none"
                    />
                    <span className="text-xs font-mono font-bold text-slate-300 w-16 text-right">
                      {nbi2Power.toFixed(1)} / 16 MW
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>ACCEL: <span className="text-slate-200 font-bold">120 keV D°</span></div>
                    <div>NEUTRAL EFF: <span className="text-emerald-400 font-bold">83.8%</span></div>
                    <div>PITCH: <span className="text-slate-200 font-bold">24.0° TANG</span></div>
                  </div>
                </div>

                {/* ECRH Gyrotron Bank (170 GHz) */}
                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Radio className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>ECRH GYROTRON CLUSTER (4× UNITS)</span>
                    </span>
                    <span className="text-fuchsia-400 font-black">{ecrhPower.toFixed(1)} MW</span>
                  </div>

                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="16.0"
                      step="0.1"
                      value={ecrhPower}
                      onChange={(e) => setEcrhPower(parseFloat(e.target.value))}
                      className="flex-1 accent-fuchsia-400 cursor-pointer h-2 bg-slate-800 rounded-none"
                    />
                    <span className="text-xs font-mono font-bold text-slate-300 w-16 text-right">
                      {ecrhPower.toFixed(1)} / 16 MW
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <div>FREQ: <span className="text-slate-200 font-bold">{ecrhFrequency} GHz</span></div>
                    <div>LAUNCHER: <span className="text-slate-200 font-bold">θ={ecrhAngle}°</span></div>
                    <div>NTM STAB: <span className="text-emerald-400 font-bold">LOCKED q=2</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUB-PANEL B: HTS MAGNET CRYOGENICS & QUENCH DETECTION */}
            <div className="bg-[#0B0F17] border border-[#1E293B] shadow-xl p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider text-slate-100 uppercase">
                    HTS REBCO MAGNET CRYOGENICS & QUENCH
                  </h2>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-700/60 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SUPERCONDUCTING</span>
                </div>
              </div>

              {/* Cryogenics Telemetry Grid */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="text-[10px] font-bold font-mono tracking-wider text-slate-300 uppercase">
                    INLET TEMP (LIQUID NEON)
                  </div>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-2xl font-black font-mono text-cyan-300 tabular-nums">
                      {cryoInletTemp.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-cyan-200">K</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">FLOW: 4.8 kg/s SUBCOOLED</span>
                </div>

                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="text-[10px] font-bold font-mono tracking-wider text-slate-300 uppercase">
                    OUTLET TEMP (RETURN)
                  </div>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-2xl font-black font-mono text-cyan-300 tabular-nums">
                      {cryoOutletTemp.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-cyan-200">K</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">ΔT: +{(cryoOutletTemp - cryoInletTemp).toFixed(2)} K NOMINAL</span>
                </div>

                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="text-[10px] font-bold font-mono tracking-wider text-slate-300 uppercase">
                    QUENCH BRIDGE VOLTAGE
                  </div>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                      {quenchVoltageBridge.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-200">μV</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">TRIP THRESHOLD: 100 μV</span>
                </div>

                <div className="bg-[#0F172A] p-3 border border-slate-800">
                  <div className="text-[10px] font-bold font-mono tracking-wider text-slate-300 uppercase">
                    LORENTZ HOOP STRESS
                  </div>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-2xl font-black font-mono text-indigo-300 tabular-nums">
                      {lorentzStress.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-indigo-200">MPa</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">STRUCTURAL LIMIT: 800 MPa</span>
                </div>
              </div>

              {/* Fast Energy Dump Switch (FEDS) Armed Status */}
              <div className="mt-3 p-3 bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-slate-200 block uppercase">FAST DISCHARGE CIRCUIT (FEDS)</span>
                    <span className="text-[11px] text-slate-400">Dump Resistor Bank: 0.12 Ω // 2.4 GJ Dissipation Capacity</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600 font-black uppercase text-[10px]">
                  ARMED & READY
                </span>
              </div>

              {/* Cryostat Vacuum Chamber */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>CRYOSTAT INSULATION VACUUM:</span>
                <span className="text-slate-200 font-black tabular-nums">{cryostatPressure.toFixed(2)} × 10⁻⁸ mbar</span>
              </div>
            </div>

          </section>
        </div>

        {/* ========================================================================= */}
        {/* PANE 4: BOTTOM DIVERTOR TILE LEDGER & MAGNETIC EQUILIBRIUM ROSTER        */}
        {/* ========================================================================= */}
        <footer className="border-t border-[#1E293B] bg-[#070B13] p-4 md:p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
            
            {/* Divertor Ledger Title & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider text-slate-100 uppercase">
                  DIVERTOR TARGET PLATES & EXHAUST LEDGER
                </h2>
              </div>

              <div className="flex items-center space-x-1 bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setDivertorFilter('ALL')}
                  className={`px-2.5 py-1 uppercase font-bold transition ${
                    divertorFilter === 'ALL' 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ALL TILES (12)
                </button>
                <button
                  onClick={() => setDivertorFilter('LOWER')}
                  className={`px-2.5 py-1 uppercase font-bold transition ${
                    divertorFilter === 'LOWER' 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  LOWER STRIKE (8)
                </button>
                <button
                  onClick={() => setDivertorFilter('UPPER')}
                  className={`px-2.5 py-1 uppercase font-bold transition ${
                    divertorFilter === 'UPPER' 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  UPPER PASSIVE (4)
                </button>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowArgonModal(true)}
                className="px-3 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-200 text-xs font-bold font-mono uppercase transition flex items-center space-x-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>INJECT ARGON IMPURITY PUFF</span>
              </button>

              <button
                onClick={() => setShowSolenoidModal(true)}
                className="px-3 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/70 text-indigo-200 text-xs font-bold font-mono uppercase transition flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>RAMP CENTRAL SOLENOID (+0.25 V·s)</span>
              </button>

              <button
                onClick={handleCycleCryoPumps}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold font-mono uppercase transition flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-300" />
                <span>CYCLE CRYO PUMPS</span>
              </button>
            </div>
          </div>

          {/* Divertor Target Plates Data Table */}
          <div className="overflow-x-auto border border-[#1E293B] bg-[#0B0F17]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#0F172A] text-slate-300">
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider whitespace-nowrap">TILE CODE</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">POLOIDAL ZONE</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">HEAT FLUX (MW/m²)</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">SURFACE TEMP (°C)</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">ne DENSITY (10²⁰ m⁻³)</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">Te TEMP (eV)</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">COOLANT (kg/s)</th>
                  <th className="py-3 px-3 text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70 font-mono">
                {filteredTiles.map((tile) => {
                  const isCritical = tile.warningLevel === 'CRITICAL';
                  const isElevated = tile.warningLevel === 'ELEVATED';

                  return (
                    <tr 
                      key={tile.code} 
                      className={`hover:bg-[#111827] transition-colors ${
                        isCritical ? 'bg-rose-950/20' : isElevated ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-xs md:text-sm font-bold text-slate-200 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            isCritical ? 'bg-rose-500 animate-ping' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span className="whitespace-nowrap">{tile.code}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm text-slate-400 font-bold">
                        {tile.zone}
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-bold tabular-nums">
                        <span className={`px-2 py-0.5 border ${
                          isCritical 
                            ? 'bg-rose-950 text-rose-300 border-rose-600' 
                            : isElevated 
                            ? 'bg-amber-950 text-amber-300 border-amber-600' 
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}>
                          {tile.heatFlux.toFixed(2)} MW/m²
                        </span>
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-bold tabular-nums text-slate-200">
                        <span className={tile.tempC > 800 ? 'text-rose-400' : tile.tempC > 600 ? 'text-amber-300' : 'text-slate-300'}>
                          {tile.tempC.toFixed(1)} °C
                        </span>
                        <span className="text-[11px] text-slate-400 block font-normal">LIMIT: 1200 °C</span>
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-bold tabular-nums text-cyan-300">
                        {tile.densityNe.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-bold tabular-nums text-slate-300">
                        {tile.tempTe.toFixed(1)} eV
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-bold tabular-nums text-slate-300">
                        {tile.coolantFlow.toFixed(1)}
                      </td>

                      <td className="py-3 px-3 text-xs md:text-sm font-black text-right">
                        <span className={`px-2 py-1 text-xs uppercase border ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                            : isElevated
                            ? 'bg-amber-950 text-amber-300 border-amber-500'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        }`}>
                          {tile.warningLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* INTERACTIVE ACTION MODALS                                                */}
        {/* ========================================================================= */}

        {/* 1. EMERGENCY RAPID DUMP CONFIRMATION MODAL */}
        {showQuenchModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-[#0F172A] border-2 border-rose-600 p-6 shadow-[0_0_40px_rgba(244,63,94,0.4)]">
              <div className="flex items-center space-x-3 text-rose-400 pb-3 border-b border-rose-800">
                <AlertTriangle className="w-8 h-8 text-rose-500 animate-bounce" />
                <div>
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider text-rose-200">
                    CRITICAL SAFETY INTERLOCK // RAPID DUMP
                  </h3>
                  <span className="text-xs text-rose-400 font-mono">ARC-02 HIGH-FIELD TOKAMAK SHUTDOWN</span>
                </div>
              </div>

              <div className="my-4 text-xs font-mono text-slate-300 space-y-3 leading-relaxed">
                <p>
                  You are about to trigger an institutional <strong className="text-white">Massive Gas Injection (MGI) & Cryogenic Deuterium Pellet Quench</strong>.
                </p>
                <div className="bg-rose-950/40 p-3 border border-rose-800 text-rose-300 space-y-1">
                  <div>• Plasma Current Ip (15.2 MA) will be dumped within 18 milliseconds.</div>
                  <div>• Auxiliary heating sources (NBI & ECRH) will be tripped immediately.</div>
                  <div>• FEDS Fast Discharge Resistors will dissipate 2.4 GJ of magnetic energy.</div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowQuenchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono uppercase"
                >
                  ABORT / CANCEL
                </button>
                <button
                  onClick={handleExecuteEmergencyQuench}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.7)]"
                >
                  CONFIRM RAPID DUMP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARGON IMPURITY PUFF SETTINGS MODAL */}
        {showArgonModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0F172A] border border-cyan-500 p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-900">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider text-slate-100">
                    RADIATIVE IMPURITY INJECTION
                  </h3>
                </div>
                <button onClick={() => setShowArgonModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 font-bold block mb-1 uppercase">GAS SPECIES SELECTION</label>
                  <select className="w-full bg-[#0B0F17] border border-slate-700 p-2 text-slate-200 font-mono">
                    <option value="AR">ARGON (Ar) - High Divertor Radiation Efficiency</option>
                    <option value="NE">NEON (Ne) - Mantle & Edge Radiation</option>
                    <option value="N2">NITROGEN (N₂) - Sub-Divertor Radiative Detachment</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold uppercase">MASS FLOW DOSAGE RATE</label>
                    <span className="text-cyan-400 font-black">{argonDose.toFixed(1)} Pa·m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={argonDose}
                    onChange={(e) => setArgonDose(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.5 (MILD DETACHMENT)</span>
                    <span>5.0 (DEEP RADIATIVE SHIELD)</span>
                  </div>
                </div>

                <div className="bg-[#0B0F17] p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  Injecting Argon creates a dense radiating mantle in the scrape-off layer, transferring localized strike point heat flux into diffuse photon radiation across the vessel armor.
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowArgonModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold font-mono uppercase"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleApplyArgonPuff}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black font-mono uppercase tracking-wider"
                >
                  FIRE IMPURITY VALVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. CENTRAL SOLENOID FLUX RAMP MODAL */}
        {showSolenoidModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0F172A] border border-indigo-500 p-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider text-slate-100">
                    CENTRAL SOLENOID INDUCTIVE RAMP
                  </h3>
                </div>
                <button onClick={() => setShowSolenoidModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-3 text-xs font-mono text-slate-300">
                <p>
                  Initiate a positive inductive flux change of <strong className="text-indigo-300">+0.25 Volt-seconds</strong> from the Central Solenoid REBCO stack.
                </p>
                <div className="bg-[#0B0F17] p-3 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Ip:</span>
                    <span className="text-slate-100 font-bold">{plasmaCurrentMa.toFixed(2)} MA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Projected Ip:</span>
                    <span className="text-emerald-400 font-bold">{(plasmaCurrentMa + 0.08).toFixed(2)} MA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining CS Flux:</span>
                    <span className="text-cyan-300 font-bold">68.4 V·s / 120 V·s</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowSolenoidModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold font-mono uppercase"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleRampSolenoid}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black font-mono uppercase tracking-wider"
                >
                  EXECUTE INDUCTIVE RAMP
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default TokamakPlasmaControl;
