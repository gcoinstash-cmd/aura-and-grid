/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Download, 
  Layers, 
  Radio, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Zap,
  Globe2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'mission-control' | 'cara-risk' | 'maneuvers' | 'ekf-telemetry' | 'vault-docs';
  setActiveTab: (tab: 'mission-control' | 'cara-risk' | 'maneuvers' | 'ekf-telemetry' | 'vault-docs') => void;
  onOpenExportModal: () => void;
  p99Latency: number;
  activeAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  p99Latency,
  activeAlertsCount
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').replace('Z', ' UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner Status Bar */}
      <div className="px-5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-sm text-slate-300 gap-2.5">
        <div className="flex items-center space-x-3.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono font-bold tracking-wider text-xs sm:text-sm">
            GHOST FACTORYOS FLEET TRACK 3
          </span>
          <span className="text-slate-200 font-semibold hidden sm:inline text-sm">
            ASSET <span className="text-white font-extrabold text-base">GF-T3-142</span> (F1 SKUNKWORKS ENGINE)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            MONOPOLY VAULT VERIFIED ($135,000 USD)
          </span>
        </div>

        <div className="flex items-center space-x-5 font-mono text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-200 font-bold text-sm sm:text-base">{utcTime || '2026-10-05 19:47:26 UTC'}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-300">
            <span>TAI-UTC: +37s</span>
            <span>|</span>
            <span className="text-emerald-300 font-bold text-sm sm:text-base">P99: {p99Latency.toFixed(2)}ms &lt; 8.2ms SLA</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-5 py-3.5 flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full xl:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 p-0.5 shadow-xl shadow-cyan-950 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe2 className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-hud tracking-wide text-white">
                AEGIS-ORBIT <span className="text-cyan-400 font-light">MISSION CONTROL</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700 rounded-md">
                v1.0.0-PROD
              </span>
            </div>
            <p className="text-sm text-slate-300 font-mono mt-0.5">
              Autonomous Low-Earth Orbit Constellation Stationkeeping &amp; Collision Avoidance Engine
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('mission-control')}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mission-control'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Flight Ops HUD</span>
          </button>

          <button
            onClick={() => setActiveTab('cara-risk')}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 relative cursor-pointer ${
              activeTab === 'cara-risk'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>CARA Risk</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('maneuvers')}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'maneuvers'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Impulse Maneuvers</span>
          </button>

          <button
            onClick={() => setActiveTab('ekf-telemetry')}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ekf-telemetry'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>EKF Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('vault-docs')}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vault-docs'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Vault Docs (5 Criteria)</span>
          </button>
        </div>

        {/* Master Export Button */}
        <div>
          <button
            onClick={onOpenExportModal}
            className="w-full xl:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 text-sm sm:text-base font-hud tracking-wide transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>EXPORT 10/10 BUNDLE</span>
          </button>
        </div>
      </div>
    </header>
  );
};

