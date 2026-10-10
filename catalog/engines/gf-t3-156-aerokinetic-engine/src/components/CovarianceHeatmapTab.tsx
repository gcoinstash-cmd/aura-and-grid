import React, { useState } from 'react';
import { StateSummary, TrajectoryPoint } from '../types/ekf';
import { AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Zap, Sliders } from 'lucide-react';

interface CovarianceHeatmapTabProps {
  summary: StateSummary;
  covMatrix: number[][];
  trajectory: TrajectoryPoint[];
  chi2Gate: number;
  setChi2Gate: (v: number) => void;
  onInjectGlitch: () => void;
}

const STATE_LABELS = [
  'δpx', 'δpy', 'δpz',
  'δvx', 'δvy', 'δvz',
  'δθx', 'δθy', 'δθz',
  'δbax', 'δbay', 'δbaz',
  'δbgx', 'δbgy', 'δbgz'
];

export const CovarianceHeatmapTab: React.FC<CovarianceHeatmapTabProps> = ({
  summary,
  covMatrix,
  trajectory,
  chi2Gate,
  setChi2Gate,
  onInjectGlitch,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number; val: number } | null>(null);

  // Check recent outlier rejections in last 20 frames
  const recentRejections = trajectory.slice(-15).filter((t) => t.wasRejected);
  const isRecentlyRejected = recentRejections.length > 0;

  // Maximum value for heatmap normalization
  let maxDiag = 1e-4;
  for (let i = 0; i < 15; i++) {
    if (covMatrix[i] && covMatrix[i][i] > maxDiag) maxDiag = covMatrix[i][i];
  }

  // Get cell color based on normalized value
  const getCellColor = (i: number, j: number, val: number) => {
    const isDiag = i === j;
    const absVal = Math.abs(val);
    const norm = Math.min(1.0, Math.max(0.0, Math.sqrt(absVal / maxDiag)));

    if (isDiag) {
      // Diagonal: Teal to Emerald intensity
      if (norm > 0.6) return 'bg-teal-500 text-slate-950 font-bold';
      if (norm > 0.2) return 'bg-teal-600/70 text-white';
      return 'bg-teal-900/50 text-teal-300';
    } else {
      // Off-diagonal correlations: Deep slate to Amber/Sky
      if (absVal < 1e-7) return 'bg-[#090d16] text-slate-700';
      if (norm > 0.4) return 'bg-amber-500/80 text-slate-950 font-bold';
      if (norm > 0.1) return 'bg-sky-900/50 text-sky-300';
      return 'bg-slate-900/70 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Chi-Squared Outlier Gating Controls & Active Alert */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                CHI-SQUARED OUTLIER GATE & COVARIANCE TOPOLOGY
              </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Normalized Innovation Squared (NIS) gating with numerically stabilized Joseph-form updates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onInjectGlitch}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              Inject GNSS Multipath Glitch (+35m Step)
            </button>
          </div>
        </div>

        {/* Real-Time Outlier Alert Banner */}
        {isRecentlyRejected ? (
          <div className="mt-4 p-3.5 bg-rose-500/15 border border-rose-500/50 rounded-lg flex items-center justify-between gap-3 text-rose-200 animate-pulse">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="text-sm font-bold">
                MULTIPATH ANOMALY REJECTED: NIS score {summary.lastGpsNis.toFixed(2)} exceeded Chi-squared threshold{' '}
                {chi2Gate.toFixed(2)}. State vector and covariance protected!
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-500 text-white rounded">
              GATE BLOCKED
            </span>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-between gap-3 text-teal-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-mono">
                NOMINAL FUSION: NIS = <strong className="text-teal-300">{summary.lastGpsNis.toFixed(2)}</strong> (Gate
                Limit: {chi2Gate.toFixed(2)}) · P-Matrix positive semi-definiteness guaranteed via Joseph Form
              </span>
            </div>
            <span className="text-xs font-mono text-teal-400">JOSEPH FORM ACTIVE</span>
          </div>
        )}
      </div>

      {/* 2-Column Split: Heatmap on Left (7 cols), NIS Scope & Gate Slider on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 15x15 Error Covariance P-Matrix Heatmap */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              15x15 ERROR COVARIANCE MATRIX [P]
            </h3>
            <span className="text-xs font-mono text-slate-400">
              TRACE: <strong className="text-teal-300 font-bold">{summary.covTrace.toFixed(5)}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Hover over matrix cells to inspect cross-correlation covariance values between error states.
          </p>

          {/* 15x15 Matrix Table Container */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-full">
              {/* Header row labels */}
              <div className="flex ml-10 mb-1">
                {STATE_LABELS.map((lbl, idx) => (
                  <div
                    key={idx}
                    className="w-7 sm:w-8 text-center text-[10px] font-mono text-slate-400 font-bold truncate"
                    title={lbl}
                  >
                    {lbl}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: 15 }).map((_, rIdx) => (
                <div key={rIdx} className="flex items-center mb-1">
                  <div className="w-10 text-[10px] font-mono text-slate-400 font-bold text-right pr-2 shrink-0">
                    {STATE_LABELS[rIdx]}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 15 }).map((_, cIdx) => {
                      const val = covMatrix[rIdx]?.[cIdx] ?? 0;
                      return (
                        <div
                          key={cIdx}
                          onMouseEnter={() => setHoveredCell({ i: rIdx, j: cIdx, val })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded cursor-pointer transition-transform hover:scale-110 flex items-center justify-center text-[9px] font-mono select-none ${getCellColor(
                            rIdx,
                            cIdx,
                            val
                          )}`}
                          title={`${STATE_LABELS[rIdx]} × ${STATE_LABELS[cIdx]}: ${val.toExponential(4)}`}
                        >
                          {rIdx === cIdx ? 'σ²' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cell Inspector Hover Box */}
          <div className="bg-[#070a12] border border-slate-800 rounded-lg p-3 text-xs font-mono">
            {hoveredCell ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-teal-400 font-bold">
                    P[{STATE_LABELS[hoveredCell.i]}, {STATE_LABELS[hoveredCell.j]}]
                  </span>
                  <span className="text-slate-400 ml-2">
                    {hoveredCell.i === hoveredCell.j ? '(Variance)' : '(Cross-Covariance)'}
                  </span>
                </div>
                <div className="text-white font-bold text-sm">
                  {hoveredCell.val.toExponential(6)}
                </div>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover cursor over any cell in the 15x15 matrix to inspect exact state uncertainty.
              </div>
            )}
          </div>
        </div>

        {/* Right: Chi-Squared Oscilloscope & Gating Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Gate Configuration Slider */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Chi-Squared Gate Config
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                χ² LIMIT = {chi2Gate.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Outlier Gate Threshold (3-DoF):</span>
                <span className="text-amber-300 font-bold">{chi2Gate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="20.0"
                step="0.1"
                value={chi2Gate}
                onChange={(e) => setChi2Gate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>3.0 (Aggressive Rejection)</span>
                <span>7.815 (95% Confidence)</span>
                <span>15.0 (Permissive)</span>
              </div>
            </div>

            {/* Rejection Ratio Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">ACCEPTED</div>
                <div className="text-base font-mono font-bold text-teal-300 tabular-nums">
                  {summary.gpsAccepted}
                </div>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">REJECTED</div>
                <div className="text-base font-mono font-bold text-rose-400 tabular-nums">
                  {summary.gpsRejected}
                </div>
              </div>
              <div className="bg-[#070a12] p-2.5 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">LAST NIS</div>
                <div className="text-base font-mono font-bold text-white tabular-nums">
                  {summary.lastGpsNis.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time NIS Time-Series Oscilloscope */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                NIS INNOVATION OSCILLOSCOPE (LAST 50 STEPS)
              </h3>
              <span className="text-xs font-mono text-slate-400">γ = yᵀ S⁻¹ y</span>
            </div>

            {/* SVG Mini Chart */}
            <div className="h-44 bg-[#070a12] rounded-lg border border-slate-800 p-2 relative flex flex-col justify-end">
              <svg className="w-full h-full overflow-visible">
                {/* Threshold line */}
                {(() => {
                  const maxNisPlot = Math.max(15, chi2Gate * 1.3);
                  const yThresh = 150 - (chi2Gate / maxNisPlot) * 130;
                  return (
                    <line
                      x1="0"
                      y1={yThresh}
                      x2="100%"
                      y2={yThresh}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  );
                })()}

                {/* Plot points & bars */}
                {(() => {
                  const maxNisPlot = Math.max(15, chi2Gate * 1.3);
                  const points = trajectory.slice(-45);
                  if (points.length < 2) return null;

                  const polylineCoords = points
                    .map((pt, i) => {
                      const x = (i / (points.length - 1)) * 100;
                      const clampedNis = Math.min(maxNisPlot, Math.max(0, pt.nis));
                      const y = 150 - (clampedNis / maxNisPlot) * 130;
                      return `${x}%,${y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="2"
                        points={polylineCoords}
                      />
                      {points.map((pt, i) => {
                        const x = `${(i / (points.length - 1)) * 100}%`;
                        const clampedNis = Math.min(maxNisPlot, Math.max(0, pt.nis));
                        const y = 150 - (clampedNis / maxNisPlot) * 130;
                        if (pt.wasRejected) {
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#f43f5e"
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                          );
                        }
                        return null;
                      })}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>T - 45 steps</span>
                <span className="text-amber-400 font-bold">--- Gate Limit ({chi2Gate.toFixed(1)})</span>
                <span>Now</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              When a GNSS multipath spike arrives, NIS exceeds the Chi-squared barrier (red dots), rejecting the measurement before it can corrupt the 16-state vector.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
