/**
 * Vanguard-ECLSS: Dynamic Crew Metabolic Load & Consumable Buffer Simulator
 * Upgraded Font Floor & High-Legibility Typography
 */

import React from 'react';
import { Users, Hourglass, Shield, TrendingDown, Layers, Zap } from 'lucide-react';
import { ConsumableReserves, CrewMetabolicProfile } from '../../types/eclss';

interface MassBalanceSimulatorProps {
  crew: CrewMetabolicProfile;
  reserves: ConsumableReserves;
  onUpdateCrew: (crew: Partial<CrewMetabolicProfile>) => void;
}

export const MassBalanceSimulator: React.FC<MassBalanceSimulatorProps> = ({
  crew,
  reserves,
  onUpdateCrew,
}) => {
  const metabolicFactor =
    crew.metabolicActivity === 'STRENUOUS_EVA' ? 1.45 : crew.metabolicActivity === 'REST' ? 0.8 : 1.0;

  const totalO2BurnPerDay = (crew.crewCount * crew.o2ConsumptionKgPerDayPerCrew * metabolicFactor).toFixed(2);
  const totalCo2ProdPerDay = (crew.crewCount * crew.co2ProductionKgPerDayPerCrew * metabolicFactor).toFixed(2);
  const totalWaterProdPerDay = (
    crew.crewCount *
    (crew.metabolicWaterProductionLPerDay + crew.perspirationLPerDay) *
    metabolicFactor
  ).toFixed(2);
  const totalHeatWatts = (crew.crewCount * crew.heatOutputWattsPerCrew * metabolicFactor).toFixed(0);

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            CREW METABOLIC LOAD & BUFFER MARGIN SIMULATOR
          </h3>
          <p className="text-base text-slate-300 font-medium mt-1">
            Real-time multi-agent metabolic load balancing, cryo buffer reserves, and autonomous endurance margin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono text-base font-bold shadow-md">
          <Hourglass className="w-5 h-5 text-cyan-400" />
          <span>AUTONOMOUS ENDURANCE: <strong className="text-white text-lg">{reserves.calculatedMarginDays.toFixed(1)} DAYS</strong></span>
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-xl bg-slate-950 border border-slate-800">
        {/* Crew Headcount Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Active Crew Headcount
            </label>
            <span className="text-2xl font-extrabold font-mono text-cyan-300 px-4 py-1 rounded-lg bg-cyan-950 border border-cyan-700 shadow-inner">
              {crew.crewCount} CREW
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            step="1"
            value={crew.crewCount}
            onChange={(e) => onUpdateCrew({ crewCount: parseInt(e.target.value, 10) })}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-sm text-slate-400 font-mono">
            <span>4 (Nominal Outpost)</span>
            <span>8 (Standard Rotation)</span>
            <span>12 (Surge Maximum)</span>
          </div>
        </div>

        {/* Metabolic Activity Level Segmented Selector */}
        <div className="space-y-4">
          <label className="text-base font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Metabolic Activity & Workload State
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onUpdateCrew({ metabolicActivity: 'REST' })}
              className={`py-3 px-3 rounded-xl text-sm font-bold font-mono transition cursor-pointer border ${
                crew.metabolicActivity === 'REST'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-900/50'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              REST (0.8x)
            </button>
            <button
              onClick={() => onUpdateCrew({ metabolicActivity: 'NOMINAL' })}
              className={`py-3 px-3 rounded-xl text-sm font-bold font-mono transition cursor-pointer border ${
                crew.metabolicActivity === 'NOMINAL'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-900/50'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              NOMINAL (1.0x)
            </button>
            <button
              onClick={() => onUpdateCrew({ metabolicActivity: 'STRENUOUS_EVA' })}
              className={`py-3 px-3 rounded-xl text-sm font-bold font-mono transition cursor-pointer border ${
                crew.metabolicActivity === 'STRENUOUS_EVA'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-900/50'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              EVA (1.45x)
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Metabolic Burn Calculations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-sm font-semibold text-slate-400 uppercase">Gross O2 Consumption</div>
          <div className="text-3xl font-extrabold text-cyan-300 mt-2">
            {totalO2BurnPerDay} <span className="text-base font-normal text-slate-400">kg/day</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            {((parseFloat(totalO2BurnPerDay) / 24) * 1000).toFixed(1)} g/hour
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-sm font-semibold text-slate-400 uppercase">Gross CO2 Exhalation</div>
          <div className="text-3xl font-extrabold text-amber-300 mt-2">
            {totalCo2ProdPerDay} <span className="text-base font-normal text-slate-400">kg/day</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            CDRA Duty: ~{Math.min(100, Math.round(parseFloat(totalCo2ProdPerDay) * 8.5))}%
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-sm font-semibold text-slate-400 uppercase">Metabolic Water Output</div>
          <div className="text-3xl font-extrabold text-emerald-300 mt-2">
            {totalWaterProdPerDay} <span className="text-base font-normal text-slate-400">L/day</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            CHX Condensing: {(parseFloat(totalWaterProdPerDay) / 24).toFixed(2)} L/hr
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-sm font-semibold text-slate-400 uppercase">Metabolic Heat Load</div>
          <div className="text-3xl font-extrabold text-purple-300 mt-2">
            {totalHeatWatts} <span className="text-base font-normal text-slate-400">Watts</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Thermal TCS rejection
          </div>
        </div>
      </div>

      {/* Cryogenic & High-Pressure Consumable Reserves Table */}
      <div className="space-y-4">
        <div className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>CRYOGENIC & BUFFER STORAGE INVENTORY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-slate-300 font-medium">O2 Cryo Reservoir:</span>
              <span className="text-cyan-300 font-bold">{reserves.storedO2Kg.toFixed(1)} / 850 kg</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-3 rounded-full"
                style={{ width: `${(reserves.storedO2Kg / 850) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-slate-300 font-medium">N2 Cryo Reservoir:</span>
              <span className="text-slate-100 font-bold">{reserves.storedN2Kg.toFixed(1)} / 1800 kg</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-slate-400 h-3 rounded-full"
                style={{ width: `${(reserves.storedN2Kg / 1800) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-slate-300 font-medium">Potable Main Tank:</span>
              <span className="text-emerald-400 font-bold">{reserves.storedPotableWaterL.toFixed(1)} / 1200 L</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-3 rounded-full"
                style={{ width: `${(reserves.storedPotableWaterL / 1200) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
