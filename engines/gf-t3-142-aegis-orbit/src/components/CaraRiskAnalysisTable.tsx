/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import React from 'react';
import { ConjunctionEvent } from '../types/orbital';
import { ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, Zap, Info, Crosshair } from 'lucide-react';

interface CaraRiskAnalysisTableProps {
  conjunctions: ConjunctionEvent[];
  onTriggerManeuver: (conjunction: ConjunctionEvent) => void;
}

export const CaraRiskAnalysisTable: React.FC<CaraRiskAnalysisTableProps> = ({
  conjunctions,
  onTriggerManeuver
}) => {
  const formatTcaCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `T-${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold font-hud text-white tracking-wide">
              CONJUNCTION ASSESSMENT &amp; RISK ANALYSIS (CARA) ENGINE
            </h2>
            <p className="text-sm text-slate-300 font-mono mt-0.5">
              Encounter B-Plane Foster-1992 Integral &bull; Autonomous CAM Threshold: <span className="text-amber-300 font-bold">Pc &gt;= 1.00e-4</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
            ACTIVE ENCOUNTERS: <span className="text-cyan-400 font-extrabold text-base">{conjunctions.length}</span>
          </span>
        </div>
      </div>

      {/* Main Conjunctions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-2xl">
        <table className="w-full text-left text-sm font-mono border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 text-sm font-bold">
              <th className="py-4 px-4">EVENT ID &amp; OBJECTS</th>
              <th className="py-4 px-4">TCA (UTC) &amp; COUNTDOWN</th>
              <th className="py-4 px-4">COLLISION PROBABILITY (Pc)</th>
              <th className="py-4 px-4">TOTAL MISS DISTANCE</th>
              <th className="py-4 px-4">HILL MISS [R, I, C]</th>
              <th className="py-4 px-4">REL VELOCITY</th>
              <th className="py-4 px-4">STATUS</th>
              <th className="py-4 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {conjunctions.map((conj) => {
              const isCritical = conj.probabilityOfCollision >= conj.pcThreshold;
              const pcFormatted = conj.probabilityOfCollision.toExponential(3);

              return (
                <tr
                  key={conj.conjunctionId}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    isCritical ? 'bg-rose-950/20' : ''
                  }`}
                >
                  {/* Event ID & Objects */}
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-white text-base">{conj.conjunctionId}</div>
                    <div className="text-cyan-300 font-semibold mt-1">
                      {conj.primaryName} <span className="text-slate-500">vs</span>
                    </div>
                    <div className="text-rose-400 font-bold text-sm">
                      {conj.secondaryName}
                    </div>
                  </td>

                  {/* TCA Countdown */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-slate-200 font-semibold text-sm">
                      {new Date(conj.tcaUtc).toISOString().slice(11, 19)} UTC
                    </div>
                    <div className="text-cyan-400 font-extrabold text-base sm:text-lg mt-1">
                      {formatTcaCountdown(conj.timeToTcaSeconds)}
                    </div>
                  </td>

                  {/* Collision Probability Pc */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div
                      className={`text-base sm:text-lg font-extrabold ${
                        isCritical ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      Pc = {pcFormatted}
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-1">
                      {isCritical ? 'EXCEEDS 1.0e-4 LIMIT' : 'BELOW ACTION THRESHOLD'}
                    </div>
                  </td>

                  {/* Total Miss Distance */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-white font-extrabold text-base sm:text-lg">
                      {conj.missDistanceTotalMeters.toFixed(1)} m
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Hard-Body: {conj.combinedHardBodyRadiusMeters.toFixed(1)}m
                    </div>
                  </td>

                  {/* RIC Components */}
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-200 font-medium">
                    <div>R: <span className="text-cyan-300 font-bold">{conj.missDistanceVectorRicMeters[0].toFixed(1)}m</span></div>
                    <div>I: <span className="text-cyan-300 font-bold">{conj.missDistanceVectorRicMeters[1].toFixed(1)}m</span></div>
                    <div>C: <span className="text-cyan-300 font-bold">{conj.missDistanceVectorRicMeters[2].toFixed(1)}m</span></div>
                  </td>

                  {/* Relative Velocity */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-slate-100 font-bold text-base">
                      {conj.relativeVelocityKmPerSec.toFixed(2)} km/s
                    </span>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {(conj.relativeVelocityKmPerSec * 3600).toLocaleString()} km/h
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {conj.collisionStatus === 'ACTION_REQUIRED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-700 text-xs sm:text-sm font-extrabold">
                        <AlertTriangle className="w-4 h-4" /> ACTION REQ
                      </span>
                    )}
                    {conj.collisionStatus === 'MANEUVER_SCHEDULED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-200 border border-cyan-700 text-xs sm:text-sm font-extrabold">
                        <Zap className="w-4 h-4" /> CAM UPLINKED
                      </span>
                    )}
                    {conj.collisionStatus === 'MONITORING' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> MONITORING
                      </span>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onTriggerManeuver(conj)}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm font-hud transition-all flex items-center gap-2 ml-auto cursor-pointer shadow-lg shadow-cyan-950"
                    >
                      <span>OPTIMIZE CAM</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Astrodynamics Formula Explainer Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm font-mono">
        <div className="space-y-1.5">
          <div className="text-cyan-400 font-bold flex items-center gap-2 text-base">
            <Crosshair className="w-5 h-5" />
            <span>Foster-1992 Collision Integral</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Calculates the 2D Gaussian probability density of the combined position error covariance matrix projected onto the encounter B-plane.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="text-cyan-400 font-bold flex items-center gap-2 text-base">
            <Info className="w-5 h-5" />
            <span>Autonomous CAM Trigger (1e-4)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Conjunctions exceeding Pc = 1.0×10⁻⁴ trigger the autonomous Clohessy-Wiltshire impulsive burn solver to clear a 1,000m safe envelope.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="text-cyan-400 font-bold flex items-center gap-2 text-base">
            <Zap className="w-5 h-5" />
            <span>Optimal In-Track Fuel Efficiency</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            In-track burns ($\Delta V_y$) leverage orbital shearing to maximize radial and along-track separation while consuming &lt; 3 grams of propellant.
          </p>
        </div>
      </div>
    </div>
  );
};

