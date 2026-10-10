/**
 * Vanguard-ECLSS: Interactive Closed-Loop Reactor & Mass Flow Schematic
 * High-Contrast SVG / Flow Visualization
 * Upgraded Font Floor & High-Legibility Typography
 */

import React from 'react';
import { Flame, Zap, Droplets, Wind, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';
import { AtmosphericState, HydrologicState, ReactorState } from '../../types/eclss';

interface ReactorSchematicProps {
  atmosphere: AtmosphericState;
  reactor: ReactorState;
  hydrologic: HydrologicState;
}

export const ReactorSchematic: React.FC<ReactorSchematicProps> = ({
  atmosphere,
  reactor,
  hydrologic,
}) => {
  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <RotateCw className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            AUTONOMOUS CLOSED-LOOP PROCESS FLOW SCHEMATIC
          </h3>
          <p className="text-base text-slate-300 font-medium mt-1">
            Real-time mass coupling: Sabatier Methanation, PEM Electrolysis, and Catalytic Water Distillation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="px-3.5 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-700 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" /> STOICHIOMETRIC BALANCED
          </span>
        </div>
      </div>

      {/* Schematic Diagram Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Node 1: Cabin Module */}
        <div className="p-6 rounded-xl bg-slate-950 border border-cyan-900/70 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold font-mono text-cyan-300 flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                CABIN ENVIRONMENT (450 m³)
              </span>
              <span className="text-sm font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                NODE 01
              </span>
            </div>
            <div className="space-y-3 text-base text-slate-200 font-mono">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">P_tot:</span>
                <span className="text-white font-bold">{atmosphere.totalPressureKpa.toFixed(2)} kPa</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">ppO2:</span>
                <span className="text-cyan-300 font-bold">{atmosphere.ppO2Kpa.toFixed(2)} kPa</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">ppCO2:</span>
                <span className="text-emerald-300 font-bold">{atmosphere.ppCO2Kpa.toFixed(3)} kPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Humidity:</span>
                <span className="text-slate-200 font-semibold">{atmosphere.relativeHumidityPct.toFixed(1)}% RH</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 text-sm text-slate-300 flex items-center justify-between">
            <span>CO2 Exhale Inflow:</span>
            <span className="font-mono text-amber-300 font-bold">~{reactor.sabatierCo2FeedRateSccm.toFixed(0)} SCCM</span>
          </div>
        </div>

        {/* Node 2: Sabatier Reactor & Electrolyzer Cluster */}
        <div className="p-6 rounded-xl bg-slate-950 border border-amber-900/70 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold font-mono text-amber-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                SABATIER REACTOR (CO2 REDUCTION)
              </span>
              <span className={`text-sm font-bold px-2.5 py-1 rounded border font-mono ${
                reactor.sabatierStatus === 'NOMINAL'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-rose-950 text-rose-200 border-rose-600 animate-pulse'
              }`}>
                {reactor.sabatierStatus}
              </span>
            </div>
            <div className="space-y-3 text-base text-slate-200 font-mono">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">Catalyst Temp:</span>
                <span className="text-amber-300 font-bold">{reactor.sabatierTempC.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">Conversion Eff:</span>
                <span className="text-emerald-400 font-bold">{reactor.sabatierConversionEfficiencyPct.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">CH4 Vent Stream:</span>
                <span className="text-slate-200 font-semibold">{reactor.sabatierMethaneYieldSccm.toFixed(1)} SCCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">H2O Recovery Stream:</span>
                <span className="text-cyan-300 font-bold">{reactor.sabatierWaterYieldSccm.toFixed(1)} SCCM</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 text-sm text-slate-300 flex items-center justify-between">
            <span>Kinetics:</span>
            <span className="font-mono text-sm text-amber-300 font-bold">CO2 + 4H2 → CH4 + 2H2O</span>
          </div>
        </div>

        {/* Node 3: PEM Water Electrolysis & Water Recovery */}
        <div className="p-6 rounded-xl bg-slate-950 border border-emerald-900/70 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold font-mono text-emerald-300 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                PEM ELECTROLYSIS (OGS)
              </span>
              <span className="text-sm font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                24-CELL STACK
              </span>
            </div>
            <div className="space-y-3 text-base text-slate-200 font-mono">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">Stack Power:</span>
                <span className="text-white font-bold">{reactor.electrolyzerCurrentAmps.toFixed(1)} A @ {reactor.electrolyzerVoltageVolts.toFixed(1)} V</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">O2 Production:</span>
                <span className="text-cyan-300 font-bold">{reactor.electrolyzerO2ProdSccm.toFixed(1)} SCCM</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-400">H2 to Sabatier:</span>
                <span className="text-amber-300 font-bold">{reactor.electrolyzerH2ProdSccm.toFixed(1)} SCCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cell Degradation:</span>
                <span className="text-slate-200 font-semibold">{reactor.cellDegradationIndexPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800 text-sm text-slate-300 flex items-center justify-between">
            <span>Electrochemical:</span>
            <span className="font-mono text-sm text-emerald-300 font-bold">2H2O → 2H2 + O2</span>
          </div>
        </div>
      </div>

      {/* Hydrologic & Water Loop Bottom Bar */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-base font-mono">
        <div className="flex items-center gap-3">
          <Droplets className="w-6 h-6 text-cyan-400" />
          <span className="text-slate-300">Water Processor Distillate Loop:</span>
          <span className="text-cyan-300 font-bold text-lg">{hydrologic.potableYieldLph.toFixed(2)} L/hr Potable</span>
        </div>
        <div className="flex items-center flex-wrap gap-5 text-slate-300 text-sm">
          <span>Potable Reservoir: <strong className="text-white text-base">{hydrologic.potableBufferLiters.toFixed(1)} / 500 L</strong></span>
          <span>Waste Feed: <strong className="text-white text-base">{hydrologic.wasteBufferLiters.toFixed(1)} L</strong></span>
          <span>Filter Life: <strong className="text-emerald-400 text-base">{(100 - hydrologic.filterSaturationIndexPct).toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  );
};
