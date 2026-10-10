/**
 * CHRONOSRISK ENGINE // GF-T3-152
 * Tab 1: Live Risk & Shock Radar
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Layers,
  ArrowRight,
  Download,
  FileCheck,
  Percent,
  Sliders,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import {
  AssetPosition,
  RiskMetricsResult,
  StressScenario,
  StressResult,
  HISTORICAL_SHOCKS,
  simulateHistoricalShock,
} from '../core/riskEngineTs';

interface RadarTabProps {
  assets: AssetPosition[];
  portfolioEquity: number;
  setPortfolioEquity: (equity: number) => void;
  confidenceInterval: number;
  setConfidenceInterval: (ci: number) => void;
  timeHorizonDays: number;
  setTimeHorizonDays: (days: number) => void;
  volMultiplier: number;
  setVolMultiplier: (vol: number) => void;
  enableCornishFisher: boolean;
  setEnableCornishFisher: (enable: boolean) => void;
  riskResult: RiskMetricsResult;
  onExportCsv: () => void;
  onOpenReportModal: () => void;
  onLogAuditAction: (action: string, details: string) => void;
}

export const RadarTab: React.FC<RadarTabProps> = ({
  assets,
  portfolioEquity,
  setPortfolioEquity,
  confidenceInterval,
  setConfidenceInterval,
  timeHorizonDays,
  setTimeHorizonDays,
  volMultiplier,
  setVolMultiplier,
  enableCornishFisher,
  setEnableCornishFisher,
  riskResult,
  onExportCsv,
  onOpenReportModal,
  onLogAuditAction,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<StressScenario>(HISTORICAL_SHOCKS[0]);
  const [activeStressResult, setActiveStressResult] = useState<StressResult>(() =>
    simulateHistoricalShock(HISTORICAL_SHOCKS[0], assets, portfolioEquity, riskResult)
  );

  const handleSimulateShock = (scenario: StressScenario) => {
    setSelectedScenario(scenario);
    const res = simulateHistoricalShock(scenario, assets, portfolioEquity, riskResult);
    setActiveStressResult(res);
    onLogAuditAction(
      'MACRO_SHOCK_SIMULATED',
      `Executed ${scenario.name}: Drawdown -$${(res.totalLossAmount / 1_000_000).toFixed(2)}M (${(
        res.portfolioDrawdownPercent * 100
      ).toFixed(1)}%)`
    );
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  const equityPresets = [10_000_000, 50_000_000, 125_000_000, 250_000_000];

  return (
    <div className="space-y-8">
      {/* Parameter Controls Bar */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Portfolio Stress & Parameter Console
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Executive Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portfolio Equity */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
              <span>PORTFOLIO EQUITY</span>
              <span className="text-amber-400 font-mono font-bold text-lg">
                {formatCurrency(portfolioEquity)}
              </span>
            </div>
            <input
              type="range"
              min={1_000_000}
              max={500_000_000}
              step={1_000_000}
              value={portfolioEquity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPortfolioEquity(val);
                setActiveStressResult(
                  simulateHistoricalShock(selectedScenario, assets, val, riskResult)
                );
              }}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between gap-1 pt-1">
              {equityPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setPortfolioEquity(preset);
                    setActiveStressResult(
                      simulateHistoricalShock(selectedScenario, assets, preset, riskResult)
                    );
                  }}
                  className={`text-xs px-2 py-1 rounded font-mono font-bold cursor-pointer transition ${
                    portfolioEquity === preset
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  ${preset / 1_000_000}M
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Interval */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
              <span>CONFIDENCE INTERVAL</span>
              <span className="text-emerald-400 font-mono font-bold text-lg">
                {(confidenceInterval * 100).toFixed(1)}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0.95, 0.99, 0.999].map((ci) => (
                <button
                  key={ci}
                  onClick={() => setConfidenceInterval(ci)}
                  className={`py-2 text-sm font-bold font-mono rounded-lg border transition cursor-pointer ${
                    confidenceInterval === ci
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {(ci * 100).toFixed(1)}%
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Critical z = {riskResult.zNormal.toFixed(4)}
            </p>
          </div>

          {/* Time Horizon */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
              <span>HOLDING PERIOD HORIZON</span>
              <span className="text-sky-400 font-mono font-bold text-lg">
                {timeHorizonDays}-Day (Basel III)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 1, label: '1-Day' },
                { days: 5, label: '5-Day' },
                { days: 10, label: '10-Day' },
              ].map((h) => (
                <button
                  key={h.days}
                  onClick={() => setTimeHorizonDays(h.days)}
                  className={`py-2 text-sm font-bold font-mono rounded-lg border transition cursor-pointer ${
                    timeHorizonDays === h.days
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Sqrt(T) factor = {Math.sqrt(timeHorizonDays).toFixed(3)}x
            </p>
          </div>

          {/* Volatility Multiplier & Fat-Tail Mode */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
              <span>VOLATILITY MULTIPLIER</span>
              <span className="text-rose-400 font-mono font-bold text-lg">
                {volMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.5}
              step={0.1}
              value={volMultiplier}
              onChange={(e) => setVolMultiplier(Number(e.target.value))}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-slate-400">Cornish-Fisher Fat-Tail:</span>
              <button
                onClick={() => setEnableCornishFisher(!enableCornishFisher)}
                className={`text-xs px-2.5 py-1 font-mono font-bold rounded cursor-pointer transition ${
                  enableCornishFisher
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {enableCornishFisher ? 'ENABLED' : 'OFF (GAUSSIAN)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Parametric VaR */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
            <span>Parametric VaR</span>
            <span className="text-xs font-mono text-sky-400">GAUSSIAN</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(riskResult.parametricVaRAmount)}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Risk Exposure:</span>
            <span className="text-sky-400 font-mono font-bold">
              {(riskResult.parametricVaRPercent * 100).toFixed(2)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between font-mono">
            <span>z_norm: {riskResult.zNormal.toFixed(3)}</span>
            <span>Horizon: {timeHorizonDays}d</span>
          </div>
        </div>

        {/* Card 2: Cornish-Fisher VaR (Primary) */}
        <div className="bg-[#0e1626] border-2 border-amber-500/60 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-amber-500/10">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
            <span className="text-amber-400 font-extrabold">Cornish-Fisher VaR</span>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
              FAT-TAIL
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {formatCurrency(riskResult.cornishFisherVaRAmount)}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-300">Fat-Tail Impact:</span>
            <span className="text-amber-400 font-mono font-bold">
              {(riskResult.cornishFisherVaRPercent * 100).toFixed(2)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between font-mono">
            <span>z_cf: {riskResult.zCornishFisher.toFixed(3)}</span>
            <span className="text-emerald-400">
              +{((riskResult.zCornishFisher / riskResult.zNormal - 1) * 100).toFixed(1)}% tail buffer
            </span>
          </div>
        </div>

        {/* Card 3: Expected Shortfall (CVaR) */}
        <div className="bg-[#0e1626] border border-rose-900/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
            <span className="text-rose-400">Expected Shortfall (CVaR)</span>
            <span className="text-xs font-mono text-rose-400">TAIL LOSS</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {formatCurrency(riskResult.expectedShortfallAmount)}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Tail Expectation:</span>
            <span className="text-rose-400 font-mono font-bold">
              {(riskResult.expectedShortfallPercent * 100).toFixed(2)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between font-mono">
            <span>Beyond VaR Loss</span>
            <span>α = {((1 - confidenceInterval) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 4: Volatility & Fixed-Point Units */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
            <span>Volatility & Precision</span>
            <span className="text-xs font-mono text-emerald-400">FIXED-POINT</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
            {(riskResult.portfolioAnnualVol * 100).toFixed(1)}%
            <span className="text-sm font-normal text-slate-400 ml-2">Ann. Vol</span>
          </div>
          <div className="mt-2 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Daily σ:</span>
              <span className="text-white">{(riskResult.portfolioDailyVol * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Skewness / Kurtosis:</span>
              <span className="text-amber-400">
                {riskResult.portfolioSkewness.toFixed(2)} / {riskResult.portfolioKurtosis.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-800">
              <span>Integer Units:</span>
              <span className="text-emerald-400 truncate max-w-[120px]">
                {riskResult.fixedPointVaRUnits.toString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Loss Cascade Chart & Tail Density */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loss Cascade Comparison Chart */}
        <div className="lg:col-span-2 bg-[#0e1626] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Risk Cascade & Loss Waterfall Comparison
              </h3>
              <p className="text-sm text-slate-400">
                Visualizing loss severity from Gaussian Baseline to Fat-Tail CVaR and Historical Shock
              </p>
            </div>
            <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
              PORTFOLIO: {formatCurrency(portfolioEquity)}
            </div>
          </div>

          <div className="space-y-5">
            {/* 1. Parametric VaR Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-semibold">
                <span className="text-slate-300">Parametric Gaussian VaR ({(confidenceInterval * 100).toFixed(1)}%)</span>
                <span className="text-sky-400 font-mono">
                  {formatCurrency(riskResult.parametricVaRAmount)} (
                  {(riskResult.parametricVaRPercent * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="h-5 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (riskResult.parametricVaRPercent / 0.7) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 2. Cornish-Fisher VaR Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-semibold">
                <span className="text-amber-300">Cornish-Fisher Tail-Adjusted VaR</span>
                <span className="text-amber-400 font-mono font-bold">
                  {formatCurrency(riskResult.cornishFisherVaRAmount)} (
                  {(riskResult.cornishFisherVaRPercent * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="h-5 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (riskResult.cornishFisherVaRPercent / 0.7) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 3. Expected Shortfall Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-semibold">
                <span className="text-rose-400">Expected Shortfall (CVaR Tail Loss)</span>
                <span className="text-rose-400 font-mono font-bold">
                  {formatCurrency(riskResult.expectedShortfallAmount)} (
                  {(riskResult.expectedShortfallPercent * 100).toFixed(2)}%)
                </span>
              </div>
              <div className="h-5 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-700 to-rose-500 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (riskResult.expectedShortfallPercent / 0.7) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 4. Simulated Historical Shock Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-semibold">
                <span className="text-purple-300">
                  Macro Shock: {activeStressResult.scenario.name}
                </span>
                <span className="text-purple-400 font-mono font-bold">
                  {formatCurrency(activeStressResult.totalLossAmount)} (
                  {(
                    (activeStressResult.totalLossAmount / portfolioEquity) *
                    100
                  ).toFixed(2)}
                  %)
                </span>
              </div>
              <div className="h-5 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((activeStressResult.totalLossAmount / portfolioEquity) / 0.7) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                Historical shock exceeds 1-day Cornish-Fisher VaR by{' '}
                <strong className="text-amber-400 font-mono">
                  {activeStressResult.tailLossMultiplier.toFixed(2)}x
                </strong>
                . Tail liquidity spread penalty: {activeStressResult.scenario.liquiditySpreadBps} bps.
              </span>
            </div>
          </div>
        </div>

        {/* Tail Distribution Curve Simulation (SVG) */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white tracking-wide">Tail Density Function</h3>
              <span className="text-xs font-mono text-emerald-400">PDF(z)</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Cornish-Fisher transformation shifts standard Gaussian bell curve to reflect negative skewness and excess kurtosis fat-tails.
            </p>

            {/* Interactive SVG Bell Curve */}
            <div className="h-44 w-full relative bg-slate-950/60 rounded-xl p-2 border border-slate-900 flex items-end">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                {/* Gridlines */}
                <line x1="0" y1="110" x2="300" y2="110" stroke="#1e293b" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="110" stroke="#334155" strokeDasharray="3,3" />

                {/* Gaussian Bell curve */}
                <path
                  d="M 10 110 Q 75 109 110 85 Q 150 10 190 85 Q 225 109 290 110"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                />

                {/* Fat Tail Skewed Curve */}
                <path
                  d="M 10 98 Q 65 95 105 80 Q 145 15 185 85 Q 235 108 290 110"
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />

                {/* VaR Cutoff Line */}
                <line x1="60" y1="20" x2="60" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
                <text x="63" y="30" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  VaR {(confidenceInterval * 100).toFixed(0)}%
                </text>

                {/* CVaR Tail Area */}
                <rect x="10" y="80" width="50" height="30" fill="rgba(239, 68, 68, 0.25)" />
                <text x="14" y="105" fill="#fca5a5" fontSize="8" fontFamily="monospace">
                  CVaR Tail
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Standard Z-Score:</span>
              <span className="text-white">{riskResult.zNormal.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cornish-Fisher Z:</span>
              <span className="text-amber-400 font-bold">{riskResult.zCornishFisher.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Excess Kurtosis K:</span>
              <span className="text-emerald-400">{riskResult.portfolioKurtosis.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Macro Shock Simulation Suite */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-2">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Historical Macro Shock Replay Suite
            </h3>
            <p className="text-sm text-slate-400">
              Instantaneous stress-testing across extreme market liquidity shocks and contagion cascades
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded">
            SELECT SCENARIO TO STRESS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HISTORICAL_SHOCKS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            const scenarioSim = simulateHistoricalShock(sc, assets, portfolioEquity, riskResult);

            return (
              <div
                key={sc.id}
                onClick={() => handleSimulateShock(sc)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2 py-0.5 rounded">
                      {sc.year}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Vol: {sc.volMultiplier}x
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white mb-1.5">{sc.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{sc.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Est. Drawdown:</span>
                    <span className="font-mono font-bold text-rose-400">
                      {(scenarioSim.portfolioDrawdownPercent * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Loss:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(scenarioSim.totalLossAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Worst Asset:</span>
                    <span className="font-mono text-amber-400">
                      {scenarioSim.worstHitAsset.symbol} (
                      {(scenarioSim.worstHitAsset.drop * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateShock(sc);
                    }}
                    className={`w-full mt-2 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{isSelected ? 'ACTIVE SCENARIO' : 'APPLY STRESS'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
