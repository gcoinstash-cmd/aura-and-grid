import React from 'react';
import { TelemetryState, DriveMode } from '../types/telemetry';
import { telemetryEngine } from '../services/telemetryEngine';
import { Activity, ShieldAlert, Zap, Cpu, Gauge, Compass, Radio, ArrowUpRight, Snowflake, SlidersHorizontal } from 'lucide-react';

interface CockpitHUDProps {
  telemetry: TelemetryState;
}

export const CockpitHUD: React.FC<CockpitHUDProps> = ({ telemetry }) => {
  const modes: { id: DriveMode; name: string; tag: string }[] = [
    { id: 'LATENCY_ARBITRAGE', name: 'Latency Intercept', tag: 'CME ↔ LD4 0.12ps' },
    { id: 'CROSS_EXCHANGE', name: 'Multi-Venue Triangulation', tag: 'Global Mesh' },
    { id: 'QUANTUM_SUPERPOSITION', name: 'Superposition Lock', tag: '99.998% Coherence' },
    { id: 'SLIPSTREAM_WARP', name: 'Aerodynamic Warp', tag: '2,120 kgf Ground-Effect' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. Drive Mode Segmented Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
        <div>
          <div className="text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-2">
            <Radio className="w-4 h-4" />
            OPERATIONAL COCKPIT MODE
          </div>
          <div className="text-base text-zinc-200 font-medium mt-0.5">
            Active Mode: <span className="text-white font-mono font-bold">{telemetry.driveMode.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => telemetryEngine.setDriveMode(m.id)}
              className={`px-3.5 py-2.5 text-left rounded-xl transition-all font-mono border ${
                telemetry.driveMode === m.id
                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-slate-950/60 border-slate-800 text-zinc-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="text-sm font-extrabold leading-tight truncate">{m.name}</div>
              <div className="text-xs text-emerald-400 truncate mt-0.5">{m.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Multi-Panel Telemetry Grid (Scaled +20%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Panel 1: Quantum Core State */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              QUANTUM COHERENCE
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-800/60 font-bold">
              512 QUBITS
            </span>
          </div>

          <div className="my-4">
            <div className="text-4xl font-mono font-black text-white tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {telemetry.quantum.coherenceRate.toFixed(3)}
              <span className="text-base font-normal text-emerald-400 ml-1">%</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 mt-1.5 flex flex-wrap items-center gap-2">
              <span>Phase Drift: <strong className="text-white font-mono">{telemetry.quantum.phaseDriftPs.toFixed(3)} ps</strong></span>
              <span aria-hidden="true">·</span>
              <span>Eigen: <strong className="text-white font-mono">{telemetry.quantum.hamiltonianEigenvalue} eV</strong></span>
            </div>
          </div>

          {/* Coherence Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-300"
                style={{ width: `${Math.min(100, telemetry.quantum.coherenceRate)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>98.000% FLUX</span>
              <span>100.000% SUPERPOSITION</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Cryogenic Thermal & Laser Conduits */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-sky-400" />
              CRYO & LASER BUS
            </span>
            <button
              onClick={() => telemetryEngine.toggleCryoPump()}
              className={`text-xs font-mono px-2.5 py-0.5 rounded border transition-colors font-bold ${
                telemetry.coolingPumpActive
                  ? 'bg-sky-950/70 border-sky-700 text-sky-300'
                  : 'bg-rose-950/70 border-rose-700 text-rose-300'
              }`}
            >
              {telemetry.coolingPumpActive ? 'PUMP ACTIVE' : 'PUMP PAUSED'}
            </button>
          </div>

          <div className="my-4">
            <div className="text-4xl font-mono font-black text-sky-300 tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              {telemetry.quantum.cryoTempMK.toFixed(2)}
              <span className="text-base font-normal text-zinc-400 ml-1">mK</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 font-mono font-bold">532nm: {telemetry.quantum.laserEmeraldOutputW}W</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-mono font-bold">589nm: {telemetry.quantum.laserGoldOutputW}W</span>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-mono text-zinc-300 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Photon Flux:</span>
            <span className="text-white font-bold tabular-nums">
              {telemetry.quantum.photonFluxTHz.toFixed(1)} THz
            </span>
          </div>
        </div>

        {/* Panel 3: Aerodynamic Ground Effect & Diffuser */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              AERO DOWNFORCE
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded border border-amber-800/60 font-bold">
              Cd {telemetry.aero.dragCoefficientCd}
            </span>
          </div>

          <div className="my-4">
            <div className="text-4xl font-mono font-black text-amber-400 tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              {telemetry.aero.downforceKgf}
              <span className="text-base font-normal text-zinc-400 ml-1">kgf</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 mt-1.5">
              Venturi: <strong className="text-white font-mono">{telemetry.aero.groundEffectVenturiLoadKgf} kgf</strong> · Suction: <strong className="text-white font-mono">{telemetry.aero.frontSplitterSuctionHPa} hPa</strong>
            </div>
          </div>

          {/* Interactive Diffuser Flap Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-300">
              <span>Diffuser Angle</span>
              <span className="text-white font-bold">{telemetry.aero.diffuserAngleDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="0.5"
              value={telemetry.aero.diffuserAngleDeg}
              onChange={(e) => telemetryEngine.setDiffuserAngle(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Panel 4: Titanium Suspension Pushrod Strain */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-300" />
              PUSHROD STRAIN
            </span>
            <span className="text-xs font-mono text-zinc-300 bg-slate-800 px-2.5 py-0.5 rounded font-bold">
              GRADE 5 Ti
            </span>
          </div>

          <div className="my-4 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="text-zinc-300">Front Pushrods:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{telemetry.aero.pushrodStrainFrontKn.toFixed(2)} kN</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${(telemetry.aero.pushrodStrainFrontKn / 15) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="text-zinc-300">Rear Wishbones:</span>
                <span className="text-amber-400 font-bold tabular-nums">{telemetry.aero.pushrodStrainRearKn.toFixed(2)} kN</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${(telemetry.aero.pushrodStrainRearKn / 20) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-mono text-zinc-300 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Ride Height:</span>
            <span className="text-white font-bold">{telemetry.aero.rideHeightMm} mm</span>
          </div>
        </div>
      </div>

      {/* 3. Global Arbitrage Interconnect Matrix (Live Financial Streams) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Global Sub-Picosecond Arbitrage Interconnects
            </h3>
            <p className="text-sm text-zinc-300">
              Topological quantum optical tunnels out-pacing terrestrial trans-oceanic fiber optic cables.
            </p>
          </div>

          {/* Interactive Shock Event Injectors */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => telemetryEngine.triggerShockEvent('FLASH_VOLATILITY')}
              className="px-3.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Simulate Alpha Surge</span>
            </button>

            <button
              onClick={() => telemetryEngine.triggerShockEvent('DECOHERENCE_PULSE')}
              className="px-3.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg bg-amber-950/80 text-amber-300 border border-amber-700 hover:bg-amber-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Decoherence Jitter</span>
            </button>
          </div>
        </div>

        {/* Route Cards (Scaled +20%) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {telemetry.arbitrageRoutes.map((route) => (
            <div
              key={route.route}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-extrabold text-white">{route.route}</span>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 font-bold">
                  {route.status}
                </span>
              </div>

              <div className="text-xs text-zinc-300">
                {route.sourceVenue} → {route.targetVenue} ({route.distanceKm.toLocaleString()} km)
              </div>

              <div className="pt-2.5 border-t border-slate-900 space-y-1.5 font-mono text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Fiber Round-Trip:</span>
                  <span className="text-zinc-300 font-medium">{(route.fiberLatencyNs / 1e6).toFixed(2)} ms</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Chrono-Quantum:</span>
                  <span>{(route.quantumChronoLatencyNs / 1e6).toFixed(2)} ms</span>
                </div>
                <div className="flex justify-between text-xs text-amber-400 font-semibold">
                  <span>Delta Advantage:</span>
                  <span>-{(route.deltaGainNs / 1e6).toFixed(2)} ms</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900/80 flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-zinc-400">Projected Alpha:</span>
                <span className="text-emerald-300 font-black">+{route.projectedAlphaBps} bps</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
