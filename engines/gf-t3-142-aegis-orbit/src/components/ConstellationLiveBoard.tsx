/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import React from 'react';
import { SatelliteNode } from '../types/orbital';
import { Satellite, Zap, Battery, Compass, AlertTriangle, ShieldCheck, Fuel, Orbit } from 'lucide-react';

interface ConstellationLiveBoardProps {
  satellites: SatelliteNode[];
  selectedSatellite: SatelliteNode;
  onSelectSatellite: (sat: SatelliteNode) => void;
}

export const ConstellationLiveBoard: React.FC<ConstellationLiveBoardProps> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Orbit className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-hud text-white tracking-wide">
            CONSTELLATION FLEET ORBITAL TRACKING BOARD
          </h2>
        </div>
        <span className="text-sm font-mono text-cyan-300 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          PLANE ARCHITECTURE: 53.05° WALKER DELTA (550 KM LEO)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {satellites.map((sat) => {
          const isSelected = sat.id === selectedSatellite.id;
          const altKm = sat.elements.semiMajorAxisKm - 6378.137;
          const periodMinutes = (2 * Math.PI * Math.sqrt(Math.pow(sat.elements.semiMajorAxisKm, 3) / 398600.4418)) / 60;
          const fuelPct = (sat.propellantRemainingKg / sat.propellantInitialKg) * 100;

          return (
            <div
              key={sat.id}
              onClick={() => onSelectSatellite(sat)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900/95 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-2 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {/* Top Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white font-mono text-base">{sat.name}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-800/80">
                      {sat.planeId}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 font-mono mt-0.5">
                    NORAD #{sat.noradId} &bull; SLOT #{sat.slotIndex}
                  </div>
                </div>

                {/* Status Badge */}
                {sat.status === 'NOMINAL' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> NOMINAL
                  </span>
                )}
                {sat.status === 'WARNING' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-amber-950 text-amber-400 border border-amber-800 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> CARA ALERT
                  </span>
                )}
                {sat.status === 'CRITICAL_MANEUVER' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-rose-950 text-rose-400 border border-rose-800 animate-bounce">
                    <Zap className="w-3.5 h-3.5" /> CAM ACTIVE
                  </span>
                )}
              </div>

              {/* Orbital Elements Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-sm font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3">
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">SEMI-MAJOR (a)</span>
                  <span className="text-slate-100 font-bold text-sm sm:text-base">{sat.elements.semiMajorAxisKm.toFixed(1)} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">ALTITUDE (h)</span>
                  <span className="text-cyan-300 font-extrabold text-sm sm:text-base">{altKm.toFixed(1)} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">ECCENTRICITY (e)</span>
                  <span className="text-slate-100 font-bold text-sm">{sat.elements.eccentricity.toFixed(5)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">INCLINATION (i)</span>
                  <span className="text-slate-100 font-bold text-sm">{sat.elements.inclinationDeg.toFixed(2)}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">RAAN (Ω)</span>
                  <span className="text-slate-100 font-bold text-sm">{sat.elements.raanDeg.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">PERIOD (T)</span>
                  <span className="text-slate-100 font-bold text-sm">{periodMinutes.toFixed(1)} min</span>
                </div>
              </div>

              {/* Telemetry Bar (Propellant & Battery) */}
              <div className="space-y-2 text-sm font-mono">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Propellant ({sat.thrusterType.replace('_', ' ')})</span>
                    </span>
                    <span className="text-white font-bold">
                      {sat.propellantRemainingKg.toFixed(1)} / {sat.propellantInitialKg.toFixed(1)} kg ({fuelPct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${fuelPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1.5 border-t border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-cyan-400" />
                    <span>Battery: <span className="text-white font-extrabold text-sm">{sat.telemetry.batterySocPercent}%</span></span>
                  </span>
                  <span className="text-slate-300">
                    B*: <span className="text-slate-100 font-bold">{sat.elements.bStar.toExponential(2)}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

