import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Download, 
  AlertOctagon, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface CommandDockProps {
  linearBraking: boolean;
  onToggleLinearBraking: () => void;
  onPurgeThermalLoop: () => void;
  purgeActive: boolean;
  emergencyScram: boolean;
  onToggleEmergencyScram: () => void;
  onExportTelemetryJson: () => void;
  onOpenTradeDress: () => void;
}

export const CommandDock: React.FC<CommandDockProps> = ({
  linearBraking,
  onToggleLinearBraking,
  onPurgeThermalLoop,
  purgeActive,
  emergencyScram,
  onToggleEmergencyScram,
  onExportTelemetryJson,
}) => {
  return (
    <footer className="w-full bg-zinc-950/95 border-t border-zinc-800/80 backdrop-blur-md sticky bottom-0 z-40 px-4 py-3.5 lg:px-8 shadow-2xl">
      <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-mono-tactical">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>INTERLOCK: SECURE</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold shadow-sm">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>LEVITATION GAP: LOCKED (15mm)</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span>CRYO BUS: 4.2K</span>
          </div>
        </div>

        {/* Tactical Command Actions with px-5 py-3 and text-base font-semibold */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Action 1: Engage Linear Braking */}
          <button
            onClick={() => {
              tacticalAudio.playBrakingEngage();
              onToggleLinearBraking();
            }}
            className={`px-5 py-3 rounded-xl border-2 text-base font-mono-tactical font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg uppercase tracking-wide ${
              linearBraking
                ? 'bg-amber-500/25 border-amber-500 text-amber-200 glow-amber ring-2 ring-amber-500/50 animate-pulse'
                : 'bg-zinc-900 hover:bg-amber-950/40 border-zinc-700 hover:border-amber-500/70 text-zinc-100 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>{linearBraking ? 'DISENGAGE EDDY BRAKES' : 'ENGAGE LINEAR BRAKING'}</span>
          </button>

          {/* Action 2: Purge Thermal Loop */}
          <button
            onClick={() => {
              tacticalAudio.playThermalPurge();
              onPurgeThermalLoop();
            }}
            disabled={purgeActive}
            className={`px-5 py-3 rounded-xl border-2 text-base font-mono-tactical font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg uppercase tracking-wide ${
              purgeActive
                ? 'bg-blue-600/40 border-blue-400 text-blue-200 animate-pulse'
                : 'bg-zinc-900 hover:bg-blue-950/50 border-zinc-700 hover:border-blue-500/70 text-zinc-100 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>{purgeActive ? 'PURGING LHe...' : 'PURGE THERMAL LOOP'}</span>
          </button>

          {/* Action 3: Export Run Telemetry (.JSON) */}
          <button
            onClick={() => {
              tacticalAudio.playClick(1400);
              onExportTelemetryJson();
            }}
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-purple-950/50 border-2 border-zinc-700 hover:border-purple-500/70 text-base font-mono-tactical font-semibold text-zinc-100 hover:text-white flex items-center gap-2.5 transition-all cursor-pointer shadow-lg uppercase tracking-wide"
          >
            <Download className="w-5 h-5 text-purple-400" />
            <span>EXPORT RUN TELEMETRY (.JSON)</span>
          </button>

          {/* Emergency SCRAM */}
          <button
            onClick={() => {
              tacticalAudio.playClick(400);
              onToggleEmergencyScram();
            }}
            className={`px-5 py-3 rounded-xl border-2 text-base font-mono-tactical font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-lg uppercase tracking-wide ${
              emergencyScram
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500 animate-bounce'
                : 'bg-rose-950/50 hover:bg-rose-900/70 border-rose-600/80 text-rose-200'
            }`}
          >
            <AlertOctagon className="w-5 h-5" />
            <span>{emergencyScram ? 'SCRAM LOCK (RESET)' : 'EMERGENCY SCRAM'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
