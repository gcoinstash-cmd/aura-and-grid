/**
 * Vanguard-ECLSS: Atmospheric & Resource Telemetry Dashboard
 * High-Contrast Luxury Mission-Control Dark Mode
 * Upgraded Font Floor & Large High-Legibility Metrics
 */

import React from 'react';
import { Wind, Droplets, Thermometer, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';
import { AtmosphericState, HydrologicState } from '../../types/eclss';

interface AtmosphericHUDProps {
  atmosphere: AtmosphericState;
  hydrologic: HydrologicState;
}

export const AtmosphericHUD: React.FC<AtmosphericHUDProps> = ({ atmosphere, hydrologic }) => {
  // Safe Ranges
  const isPtotNominal = atmosphere.totalPressureKpa >= 98.0 && atmosphere.totalPressureKpa <= 103.4;
  const isPpO2Nominal = atmosphere.ppO2Kpa >= 19.5 && atmosphere.ppO2Kpa <= 23.1;
  const isPpCO2Nominal = atmosphere.ppCO2Kpa <= 0.40;

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <Gauge className="w-7 h-7 text-cyan-400" />
            ATMOSPHERIC & CLOSED-LOOP RESOURCE METRICS
          </h2>
          <p className="text-base text-slate-300 font-medium mt-1">
            Real-time barometric partial pressure decomposition, psychrometric dew point, and water distillation efficiency.
          </p>
        </div>
      </div>

      {/* Primary 4-Card Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Pressure */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isPtotNominal ? 'bg-slate-900/90 border-slate-800' : 'bg-rose-950/50 border-rose-600 shadow-xl shadow-rose-950/60'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-slate-300 uppercase tracking-wider">Total Pressure</span>
            {isPtotNominal ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-800 font-mono">
                <CheckCircle className="w-4 h-4" /> NOMINAL
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-300 bg-rose-950 px-2.5 py-1 rounded-md border border-rose-700 font-mono animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> CRITICAL
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {atmosphere.totalPressureKpa.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-cyan-400 font-mono">kPa</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300 border-t border-slate-800/90 pt-3 font-mono">
            <span>Setpoint: 101.325 kPa</span>
            <span className="text-slate-400">Range: 98.0 - 103.4</span>
          </div>
        </div>

        {/* Oxygen Partial Pressure ppO2 */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isPpO2Nominal ? 'bg-slate-900/90 border-slate-800' : 'bg-amber-950/50 border-amber-600'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-slate-300 uppercase tracking-wider">Oxygen (ppO2)</span>
            <span className="text-sm font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-700 font-mono">
              {((atmosphere.ppO2Kpa / atmosphere.totalPressureKpa) * 100).toFixed(1)}% MOL
            </span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-300 tracking-tight">
              {atmosphere.ppO2Kpa.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-cyan-400 font-mono">kPa</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300 border-t border-slate-800/90 pt-3 font-mono">
            <span>Sea Level: 21.28 kPa</span>
            <span className="text-slate-400">Floor: 19.5 kPa</span>
          </div>
        </div>

        {/* Carbon Dioxide ppCO2 */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isPpCO2Nominal ? 'bg-slate-900/90 border-slate-800' : 'bg-rose-950/50 border-rose-600'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-slate-300 uppercase tracking-wider">Carbon Dioxide</span>
            <span className={`text-sm font-bold px-2.5 py-1 rounded-md border font-mono ${
              isPpCO2Nominal ? 'text-emerald-300 bg-emerald-950/70 border-emerald-800' : 'text-rose-300 bg-rose-950 border-rose-700'
            }`}>
              {(atmosphere.ppCO2Kpa * 7.50062).toFixed(1)} mmHg
            </span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${isPpCO2Nominal ? 'text-emerald-300' : 'text-rose-400'}`}>
              {atmosphere.ppCO2Kpa.toFixed(3)}
            </span>
            <span className="text-xl font-bold text-slate-300 font-mono">kPa</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300 border-t border-slate-800/90 pt-3 font-mono">
            <span>CDRA Target: &lt;0.400</span>
            <span className="text-slate-400">Limit: 0.650</span>
          </div>
        </div>

        {/* Water Loop Recovery */}
        <div className="p-6 rounded-2xl border bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-slate-300 uppercase tracking-wider">Water Loop Yield</span>
            <span className="text-sm font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-800 font-mono">
              CLOSED-LOOP
            </span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {hydrologic.recoveryEfficiencyPct.toFixed(1)}
            </span>
            <span className="text-xl font-bold text-emerald-500 font-mono">%</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300 border-t border-slate-800/90 pt-3 font-mono">
            <span>Yield: {hydrologic.potableYieldLph.toFixed(2)} L/hr</span>
            <span className="text-slate-400">TOC: {hydrologic.totalOrganicCarbonPpb} ppb</span>
          </div>
        </div>
      </div>

      {/* Secondary Gas Partial Pressures & Psychrometric Card Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Nitrogen ppN2 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5">Nitrogen (ppN2)</div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {atmosphere.ppN2Kpa.toFixed(2)} <span className="text-sm text-cyan-400 font-normal">kPa</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            {((atmosphere.ppN2Kpa / atmosphere.totalPressureKpa) * 100).toFixed(1)}% Diluent
          </div>
        </div>

        {/* Cabin Temperature */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Cabin Temp</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {atmosphere.temperatureCelsius.toFixed(1)} <span className="text-sm text-amber-400 font-normal">°C</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            {(atmosphere.temperatureCelsius * 1.8 + 32).toFixed(1)} °F
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity (RH)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {atmosphere.relativeHumidityPct.toFixed(1)} <span className="text-sm text-cyan-400 font-normal">%</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            Setpoint 45.0%
          </div>
        </div>

        {/* Dew Point */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5">Dew Point (T_dp)</div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {atmosphere.dewPointCelsius.toFixed(1)} <span className="text-sm text-emerald-400 font-normal">°C</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            Non-Condensing
          </div>
        </div>

        {/* Cabin Enthalpy */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5">Enthalpy (h)</div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {atmosphere.enthalpyKjPerKg.toFixed(1)} <span className="text-sm text-purple-400 font-normal">kJ/kg</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            Psychrometric
          </div>
        </div>

        {/* Trace VOC */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-sm text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-amber-400" />
            <span>Trace VOC</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${atmosphere.traceVocPpm > 0.1 ? 'text-amber-400' : 'text-slate-100'}`}>
            {atmosphere.traceVocPpm.toFixed(3)} <span className="text-sm text-amber-400 font-normal">ppm</span>
          </div>
          <div className="text-sm text-slate-400 font-mono mt-1">
            TCCS Catalytic
          </div>
        </div>
      </div>
    </div>
  );
};
