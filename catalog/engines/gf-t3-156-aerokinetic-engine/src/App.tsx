/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HeaderBadges } from './components/HeaderBadges';
import { TelemetryRadarTab } from './components/TelemetryRadarTab';
import { CovarianceHeatmapTab } from './components/CovarianceHeatmapTab';
import { EngineSpecTab } from './components/EngineSpecTab';
import { MonopolyVaultTab } from './components/MonopolyVaultTab';
import { PythonCoreTab } from './components/PythonCoreTab';
import { AeroKineticEKFSimulator } from './core/ekfSimulator';
import { StateSummary, TrajectoryPoint } from './types/ekf';
import { Radar, Grid3X3, FileText, Award, Code2, Play, Pause, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'covariance' | 'spec' | 'vault' | 'code'>('radar');
  const [isRunning, setIsRunning] = useState(true);

  // Simulator instance
  const simulatorRef = useRef<AeroKineticEKFSimulator>(new AeroKineticEKFSimulator());

  // Interactive controls state
  const [flightMode, setFlightMode] = useState<'hover' | 'figure8' | 'bankedTurn' | 'orbit' | 'manual'>('figure8');
  const [manualRoll, setManualRoll] = useState<number>(0);
  const [manualPitch, setManualPitch] = useState<number>(0);
  const [manualYaw, setManualYaw] = useState<number>(45);
  const [vibration, setVibration] = useState<number>(0.05);
  const [chi2Gate, setChi2Gate] = useState<number>(7.815);

  // Filter snapshot state for React UI
  const [summary, setSummary] = useState<StateSummary>(() =>
    simulatorRef.current.getStateSummary(0)
  );
  const [covMatrix, setCovMatrix] = useState<number[][]>(() =>
    simulatorRef.current.P.map((row) => [...row])
  );
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);

  // Simulation clock
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // Update simulator settings when state changes
  useEffect(() => {
    simulatorRef.current.chi2GateGPS = chi2Gate;
    simulatorRef.current.chi2GateFlow = chi2Gate;
    simulatorRef.current.imuVibrationAmplitude = vibration;
  }, [chi2Gate, vibration]);

  // Main real-time simulation animation loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dtMs = Math.min(100, Math.max(10, now - lastFrameTimeRef.current));
      lastFrameTimeRef.current = now;
      const dtSec = dtMs / 1000;

      if (isRunning) {
        timeRef.current += dtSec;
        const newSummary = simulatorRef.current.advanceSimulation(
          dtSec,
          timeRef.current,
          flightMode,
          { roll: manualRoll, pitch: manualPitch, yaw: manualYaw }
        );

        setSummary(newSummary);
        setCovMatrix(simulatorRef.current.P.map((r) => [...r]));
        setTrajectory([...simulatorRef.current.trajectoryHistory]);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, flightMode, manualRoll, manualPitch, manualYaw]);

  const handleReset = () => {
    simulatorRef.current.resetFilter([0, 0, 5]);
    timeRef.current = 0;
    setSummary(simulatorRef.current.getStateSummary(0));
    setCovMatrix(simulatorRef.current.P.map((r) => [...r]));
    setTrajectory([]);
  };

  const handleInjectGlitch = () => {
    simulatorRef.current.injectGpsMultipathGlitch([35.0, -25.0, 15.0]);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-medium">
      {/* Global Header & 2x2 Telemetry Grid */}
      <HeaderBadges
        latencyUs={summary.latencyUs}
        totalSteps={summary.totalSteps}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0b0f19] border border-slate-800 rounded-xl">
            {[
              { id: 'radar', label: '1. Live 6-DoF Radar', icon: Radar },
              { id: 'covariance', label: '2. Covariance & χ² Gate', icon: Grid3X3 },
              { id: 'spec', label: '3. ENGINE_SPEC.md', icon: FileText },
              { id: 'vault', label: '4. Monopoly Vault & APA', icon: Award },
              { id: 'code', label: '5. Python Core & Docker', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Simulation Playback & Clock Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                isRunning
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause Sim' : 'Resume Sim'}
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all"
              title="Reset Filter"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'radar' && (
          <TelemetryRadarTab
            summary={summary}
            trajectory={trajectory}
            flightMode={flightMode}
            setFlightMode={setFlightMode}
            manualRoll={manualRoll}
            setManualRoll={setManualRoll}
            manualPitch={manualPitch}
            setManualPitch={setManualPitch}
            manualYaw={manualYaw}
            setManualYaw={setManualYaw}
            vibration={vibration}
            setVibration={setVibration}
            onReset={handleReset}
          />
        )}

        {activeTab === 'covariance' && (
          <CovarianceHeatmapTab
            summary={summary}
            covMatrix={covMatrix}
            trajectory={trajectory}
            chi2Gate={chi2Gate}
            setChi2Gate={setChi2Gate}
            onInjectGlitch={handleInjectGlitch}
          />
        )}

        {activeTab === 'spec' && <EngineSpecTab />}

        {activeTab === 'vault' && <MonopolyVaultTab />}

        {activeTab === 'code' && <PythonCoreTab />}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0a0e17] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-bold">GHOST FACTORYOS</span>
            <span>·</span>
            <span>GF-T3-156 AEROKINETIC ENGINE</span>
            <span>·</span>
            <span>70% ARCHITECTURAL PROTOCOL</span>
          </div>
          <div>
            <span>CLEAN-ROOM CERTIFIED · 100% PERMISSIVE APA TURNKEY REFERENCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
