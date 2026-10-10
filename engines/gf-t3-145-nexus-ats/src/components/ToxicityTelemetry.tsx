/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Mathematical Flow Toxicity & 2-Variate Hawkes Process Telemetry
 */

import React from 'react';
import { VpinMetrics, HawkesMetrics } from '../types/trading';
import { Flame, ShieldAlert, Activity, BarChart2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ToxicityTelemetryProps {
  vpin: VpinMetrics;
  hawkes: HawkesMetrics;
}

export const ToxicityTelemetry: React.FC<ToxicityTelemetryProps> = ({
  vpin,
  hawkes
}) => {
  const vpinPercentage = Math.min(100, Math.round((vpin.currentVpin / 0.60) * 100));
  const bucketFillPct = Math.min(100, Math.round((vpin.currentBucketVolume / vpin.bucketSize) * 100));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            Flow Toxicity & Hawkes Process <span className="text-slate-400 text-base font-medium">(Microstructure Filter)</span>
          </h2>
        </div>
        <div>
          {vpin.isToxic ? (
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500 animate-pulse flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> TOXIC ADVERSE SELECTION
            </span>
          ) : (
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> FLOW EQUILIBRIUM
            </span>
          )}
        </div>
      </div>

      {/* VPIN Metric Card & Progress Bar */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Volume-Synchronized Probability of Toxicity (VPIN)</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-4xl font-black font-mono-numbers ${vpin.isToxic ? 'text-rose-400' : 'text-emerald-400'}`}>
                {vpin.currentVpin.toFixed(4)}
              </span>
              <span className="text-base font-semibold text-slate-400 font-mono-numbers">
                / Threshold: {vpin.vpinThreshold.toFixed(4)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono-numbers text-slate-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
              Formula: (Σ |V_τ^B - V_τ^S|) / (N · V)
            </span>
          </div>
        </div>

        {/* VPIN Gauge Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
            <span className="text-emerald-400">0.00 (Uninformed Flow)</span>
            <span className="text-amber-400 font-bold">0.42 (Toxic Limit)</span>
            <span className="text-rose-400">0.60+ (Flash Crash Risk)</span>
          </div>
          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            {/* Threshold Marker Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
              style={{ left: `${(0.42 / 0.60) * 100}%` }}
            />
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                vpin.isToxic
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${vpinPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Volume Bucket Progress */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Information Bucket V ({vpin.bucketSize} shs):</span>
            <span className="font-bold text-slate-200 font-mono-numbers">
              {vpin.currentBucketVolume} / {vpin.bucketSize} shs ({bucketFillPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono-numbers text-xs">
            <span className="text-emerald-400 font-bold">Buy: {vpin.currentBucketBuyVol}</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-bold">Sell: {vpin.currentBucketSellVol}</span>
          </div>
        </div>
      </div>

      {/* 2-Variate Hawkes Point Process Intensity HUD */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              2-Variate Hawkes Point Process <span className="text-slate-400 text-sm font-normal">(Cross-Exciting Intensity)</span>
            </h3>
          </div>
          {hawkes.spoofingAlert && (
            <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500 animate-pulse">
              PREDATORY SPOOFING DETECTED
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Lambda 1: Trade Intensity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
              <span>λ₁(t) Trade Arrival Rate</span>
              <span className="text-indigo-400 font-mono-numbers">μ₁ = {hawkes.mu1.toFixed(1)}</span>
            </div>
            <div className="text-3xl font-black text-indigo-400 font-mono-numbers mt-1">
              {hawkes.lambda1.toFixed(2)} <span className="text-base font-normal text-slate-400">events/s</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Self-excitation α₁₁: {hawkes.alpha11} • Decay β: {hawkes.beta}
            </div>
          </div>

          {/* Lambda 2: Cancellation Intensity */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
              <span>λ₂(t) Cancel Arrival Rate</span>
              <span className="text-rose-400 font-mono-numbers">μ₂ = {hawkes.mu2.toFixed(1)}</span>
            </div>
            <div className="text-3xl font-black text-rose-400 font-mono-numbers mt-1">
              {hawkes.lambda2.toFixed(2)} <span className="text-base font-normal text-slate-400">cancels/s</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Predatory cross-excitation α₂₁: <span className="text-amber-400 font-bold">{hawkes.alpha21}</span>
            </div>
          </div>
        </div>

        {/* Predatory Cancel-to-Trade Ratio Meter */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-base">
          <span className="text-slate-400 font-medium">Predatory Cancel/Trade Ratio:</span>
          <div className="flex items-center gap-2">
            <span className={`font-mono-numbers font-black text-lg ${hawkes.predatoryCancelRatio > 0.65 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {(hawkes.predatoryCancelRatio * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">
              ({hawkes.predatoryCancelRatio > 0.65 ? 'High Quote Stuffing' : 'Normal Order Flow'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
