import React, { useState } from 'react';
import { CapacitorBank, StatorSector, TelemetryLog } from '../types/telemetry';
import { 
  BatteryCharging, 
  Terminal, 
  Zap, 
  Layers, 
  Pause,
  Play
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface PowerInductorsProps {
  capacitorBanks: [CapacitorBank, CapacitorBank];
  sectors: StatorSector[];
  logs: TelemetryLog[];
  onClearLogs?: () => void;
}

export const PowerInductors: React.FC<PowerInductorsProps> = ({
  capacitorBanks,
  sectors,
  logs,
}) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'WARN_CRIT'>('ALL');
  const [isPaused, setIsPaused] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'WARN_CRIT') {
      return log.level === 'WARN' || log.level === 'CRITICAL';
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Panel 1: Dual Capacitor Bank & Regenerative Capture */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <BatteryCharging className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              CAPACITOR BANKS & REGEN CAPTURE
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-mono-tactical font-bold px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-amber-400" /> DUAL 4.2 kV BUS
          </span>
        </div>

        {/* Dual Bank Cards */}
        <div className="grid grid-cols-2 gap-4">
          {capacitorBanks.map((bank) => {
            const isHot = bank.tempCelsius > 55;
            return (
              <div 
                key={bank.id} 
                className="p-4 bg-zinc-900/70 rounded-xl border border-zinc-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono-tactical">
                  <span className="font-bold text-zinc-200">BANK {bank.id}</span>
                  <span className={`font-semibold ${isHot ? 'text-rose-400 font-bold' : 'text-zinc-300'}`}>
                    {bank.tempCelsius.toFixed(1)}°C
                  </span>
                </div>

                <div className="my-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-mono-tactical font-black tracking-wider text-white">
                      {Math.round(bank.chargePercent)}%
                    </span>
                    <span className="text-sm sm:text-base font-mono-tactical font-extrabold text-amber-300">
                      {bank.voltageKv.toFixed(2)} kV
                    </span>
                  </div>

                  {/* Charge Progress bar */}
                  <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden mt-2 border border-zinc-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                      style={{ width: `${bank.chargePercent}%` }}
                    />
                  </div>
                </div>

                {/* Regenerative Power Capture Rate */}
                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm font-mono-tactical">
                  <span className="text-zinc-400 font-medium">REGEN CAPTURE:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    +{Math.round(bank.regCaptureKw)} kW
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Regen Summary */}
        <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-between text-sm font-mono-tactical">
          <span className="text-zinc-300 font-medium">COMBINED REGEN EFFICIENCY</span>
          <span className="text-emerald-300 font-extrabold flex items-center gap-1.5 text-base">
            <Zap className="w-4 h-4 fill-emerald-300" />
            {(capacitorBanks[0].regCaptureKw + capacitorBanks[1].regCaptureKw).toFixed(0)} kW ACTIVE
          </span>
        </div>
      </div>

      {/* Panel 2: Stator Coil Load Percentage across 8 Acceleration Sectors */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              LINEAR STATOR SECTORS [S1 - S8]
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-mono-tactical font-bold px-3 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wide">
            SYNC MOTOR
          </span>
        </div>

        {/* 8-Sector Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {sectors.map((sec) => {
            const isHigh = sec.loadPercent > 80;
            return (
              <div
                key={sec.sector}
                className={`p-2.5 rounded-xl border transition-all text-center flex flex-col justify-between ${
                  sec.activePulse
                    ? 'bg-purple-950/50 border-purple-500/80 shadow-md shadow-purple-500/30 ring-1 ring-purple-400/40'
                    : 'bg-zinc-900/70 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-tactical text-zinc-300 font-bold">
                  <span>S{sec.sector}</span>
                  <div className={`w-2 h-2 rounded-full ${sec.activePulse ? 'bg-purple-400 animate-ping' : 'bg-zinc-750'}`} />
                </div>

                <div className="my-2">
                  <div className={`text-xl sm:text-2xl font-mono-tactical font-black tracking-wider ${isHigh ? 'text-amber-400' : 'text-zinc-100'}`}>
                    {Math.round(sec.loadPercent)}%
                  </div>

                  {/* Vertical mini load indicator */}
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5 border border-zinc-800">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isHigh ? 'bg-amber-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${sec.loadPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] font-mono-tactical text-zinc-400 font-medium">
                  {sec.frequencyHz.toFixed(0)}Hz
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-mono-tactical text-zinc-300 font-medium">
          <span>PHASE ANGLE: +120° TRI-PHASE</span>
          <span className="text-blue-400 font-bold">FLUX PROPULSION: 18.2 kN</span>
        </div>
      </div>

      {/* Panel 3: Live Telemetry Event Stream */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 flex flex-col flex-1 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              LIVE TELEMETRY EVENT STREAM
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                tacticalAudio.playClick(900);
                setLogFilter(f => f === 'ALL' ? 'WARN_CRIT' : 'ALL');
              }}
              className="text-xs font-mono-tactical font-bold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white cursor-pointer uppercase"
            >
              {logFilter === 'ALL' ? 'FILTER: ALL' : 'FILTER: WARN/CRIT'}
            </button>
            <button
              onClick={() => {
                tacticalAudio.playClick(1000);
                setIsPaused(!isPaused);
              }}
              title={isPaused ? "Resume event stream" : "Pause event stream"}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Scrollable Log Terminal */}
        <div className="h-48 overflow-y-auto space-y-2 pr-1.5 font-mono-tactical text-xs sm:text-sm leading-relaxed">
          {filteredLogs.slice().reverse().map((log) => {
            const badgeColor = 
              log.level === 'CRITICAL' ? 'text-rose-400 bg-rose-500/15 border-rose-500/40' :
              log.level === 'WARN' ? 'text-amber-400 bg-amber-500/15 border-amber-500/40' :
              log.level === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40' :
              'text-blue-400 bg-blue-500/15 border-blue-500/40';

            return (
              <div 
                key={log.id} 
                className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5 hover:bg-zinc-900 transition-colors"
              >
                <span className="text-zinc-500 shrink-0 text-xs">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded border text-xs font-bold shrink-0 uppercase tracking-wide ${badgeColor}`}>
                  {log.level}
                </span>
                <span className="text-zinc-400 shrink-0 text-xs font-semibold">[{log.source}]</span>
                <span className="text-zinc-200 break-words flex-1 font-medium">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
