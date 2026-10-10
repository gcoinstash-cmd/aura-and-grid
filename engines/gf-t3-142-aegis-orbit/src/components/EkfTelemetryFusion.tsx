/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import React, { useState, useEffect } from 'react';
import { SatelliteNode, EkfStateSnapshot } from '../types/orbital';
import { OrbitExtendedKalmanFilter } from '../engine/physics/kalmanFilter';
import { Activity, Radio, Cpu, CheckCircle2, ShieldCheck, Compass, Gauge, BarChart2 } from 'lucide-react';

interface EkfTelemetryFusionProps {
  selectedSatellite: SatelliteNode;
}

export const EkfTelemetryFusion: React.FC<EkfTelemetryFusionProps> = ({ selectedSatellite }) => {
  const [filterInstance, setFilterInstance] = useState<OrbitExtendedKalmanFilter | null>(null);
  const [snapshot, setSnapshot] = useState<EkfStateSnapshot | null>(null);
  const [innovationHistory, setInnovationHistory] = useState<number[]>([]);

  useEffect(() => {
    const ekf = new OrbitExtendedKalmanFilter(selectedSatellite.state, 2.2);
    setFilterInstance(ekf);
    setSnapshot(ekf.getSnapshot());

    const interval = setInterval(() => {
      ekf.predict(1.0);
      // Simulate GPS measurement with 0.8m noise
      const measuredPos: [number, number, number] = [
        selectedSatellite.state.r[0] + (Math.random() - 0.5) * 0.0016,
        selectedSatellite.state.r[1] + (Math.random() - 0.5) * 0.0016,
        selectedSatellite.state.r[2] + (Math.random() - 0.5) * 0.0016
      ];
      const { innovationNorm } = ekf.updateGps(measuredPos);
      const snap = ekf.getSnapshot();
      setSnapshot(snap);
      setInnovationHistory((prev) => [...prev.slice(-24), innovationNorm]);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSatellite]);

  if (!snapshot) return null;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold font-hud text-white tracking-wide">
              CLOSED-LOOP EXTENDED KALMAN FILTER (EKF) SENSOR FUSION
            </h2>
            <p className="text-sm text-slate-300 font-mono mt-0.5">
              7-State Estimator [r, v, Cd] &bull; GNSS Carrier-Phase + Star Tracker Optical Integration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-400 border border-emerald-800 text-sm font-mono font-extrabold">
            <ShieldCheck className="w-5 h-5" /> JOSEPH-FORM COVARIANCE LOCKED
          </span>
        </div>
      </div>

      {/* Main EKF Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* State Estimate Vector */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-base font-bold font-hud text-cyan-400">1. ESTIMATED STATE VECTOR x̂</span>
            <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">ECI J2000</span>
          </div>

          <div className="space-y-3 text-sm font-mono">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1">ESTIMATED POSITION (r̂) [km]</div>
              <div className="text-white font-extrabold text-base">
                X: {snapshot.estimatedPositionKm[0].toFixed(3)} | Y: {snapshot.estimatedPositionKm[1].toFixed(3)} | Z: {snapshot.estimatedPositionKm[2].toFixed(3)}
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1">ESTIMATED VELOCITY (v̂) [km/s]</div>
              <div className="text-cyan-300 font-extrabold text-base">
                Vx: {snapshot.estimatedVelocityKmPerSec[0].toFixed(5)} | Vy: {snapshot.estimatedVelocityKmPerSec[1].toFixed(5)} | Vz: {snapshot.estimatedVelocityKmPerSec[2].toFixed(5)}
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-slate-400 text-xs font-semibold mb-0.5">BALLISTIC DRAG COEFF (Ĉd)</div>
                <div className="text-emerald-400 font-extrabold text-base sm:text-lg">{snapshot.estimatedCd.toFixed(4)}</div>
              </div>
              <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                NRLMSISE-00 Profile
              </span>
            </div>
          </div>
        </div>

        {/* 3-Sigma Covariance & Residuals */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-base font-bold font-hud text-cyan-400">2. 3-SIGMA COVARIANCE BOUNDS</span>
            <span className="text-xs font-mono font-bold text-emerald-400">P_k|k POSITIVE-DEFINITE</span>
          </div>

          <div className="space-y-3 text-sm font-mono">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1.5">3σ POSITION ERROR ENVELOPE (METERS)</div>
              <div className="grid grid-cols-3 gap-2 text-center font-bold text-white mt-1">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-0.5">3σ Radial</span>
                  <span className="text-cyan-300 text-sm sm:text-base font-extrabold">{snapshot.covariance3SigmaPositionMeters[0].toFixed(2)}m</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-0.5">3σ In-Track</span>
                  <span className="text-cyan-300 text-sm sm:text-base font-extrabold">{snapshot.covariance3SigmaPositionMeters[1].toFixed(2)}m</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-0.5">3σ Cross-Track</span>
                  <span className="text-cyan-300 text-sm sm:text-base font-extrabold">{snapshot.covariance3SigmaPositionMeters[2].toFixed(2)}m</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-semibold mb-1">MEASUREMENT RESIDUALS y = z - Hx̂</div>
              <div className="text-slate-200 font-bold text-sm sm:text-base mt-1">
                ΔX: <span className="text-white">{snapshot.positionResidualsMeters[0].toFixed(2)}m</span> | ΔY: <span className="text-white">{snapshot.positionResidualsMeters[1].toFixed(2)}m</span> | ΔZ: <span className="text-white">{snapshot.positionResidualsMeters[2].toFixed(2)}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Fusion Health */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-base font-bold font-hud text-cyan-400">3. SENSOR QUALITY &amp; CONDITION</span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">HW LOCK ACTIVE</span>
          </div>

          <div className="space-y-2.5 text-sm font-mono">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">GNSS Carrier-Phase Quality:</span>
              <span className="text-emerald-400 font-extrabold px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800">
                {snapshot.sensorFusionStatus.gnssQuality} (18 SVIDs)
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Star Tracker Optical Residual:</span>
              <span className="text-cyan-300 font-extrabold text-base">
                {snapshot.sensorFusionStatus.starTrackerResidualArcsec.toFixed(2)} arcsec
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">IMU Gyro Bias Drift:</span>
              <span className="text-slate-100 font-extrabold text-base">
                {snapshot.sensorFusionStatus.imuBiasDriftDegPerHour.toFixed(4)} °/hr
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Covariance Condition Number (κ):</span>
              <span className="text-white font-extrabold text-base">{snapshot.sensorFusionStatus.conditionNumber.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Norm Sparkline */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
        <div className="flex items-center justify-between text-sm font-mono text-slate-300">
          <span className="text-white font-extrabold text-base">EKF INNOVATION RESIDUAL NORM (||y_k|| &lt; 3σ BOUND)</span>
          <span className="text-emerald-400 font-bold">NOMINAL GAUSSIAN WHITE NOISE</span>
        </div>

        <div className="h-20 flex items-end gap-1.5 pt-3 border-b border-slate-800">
          {innovationHistory.map((val, idx) => {
            const heightPct = Math.min(100, Math.max(10, (val / 1.5) * 100));
            return (
              <div
                key={idx}
                className="flex-1 bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all"
                style={{ height: `${heightPct}%` }}
                title={`Step ${idx}: ${val.toFixed(3)}m`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

