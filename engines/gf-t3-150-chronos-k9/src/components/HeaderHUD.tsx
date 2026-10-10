import React from 'react';
import { RunMode } from '../types/telemetry';
import { 
  Activity, 
  Zap, 
  Volume2, 
  VolumeX, 
  Radio, 
  Cpu
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface HeaderHUDProps {
  velocityKmh: number;
  accelG: number;
  runMode: RunMode;
  onSetRunMode: (mode: RunMode) => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
  systemTime: string;
  linearBraking: boolean;
  emergencyScram: boolean;
  onOpenTradeDress: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  velocityKmh,
  accelG,
  runMode,
  onSetRunMode,
  audioMuted,
  onToggleAudio,
  systemTime,
  linearBraking,
  emergencyScram,
  onOpenTradeDress
}) => {
  const modes: { id: RunMode; label: string; desc: string; color: string }[] = [
    {
      id: 'STATIONARY_LEVITATION',
      label: 'STATIONARY LEVITATION',
      desc: 'HOVER GAP 15.0mm // 0 km/h IDLE',
      color: 'border-blue-500/60 text-blue-300 bg-blue-500/15'
    },
    {
      id: 'SUPERCONDUCTING_LAUNCH',
      label: 'SUPERCONDUCTING LAUNCH',
      desc: 'STATOR VECTOR // 380 km/h CRUISE',
      color: 'border-purple-500/60 text-purple-300 bg-purple-500/15'
    },
    {
      id: 'MAX_FLUX_SPRINT',
      label: 'MAX FLUX SPRINT',
      desc: 'OVERCLOCK 620 km/h // 4.8G BOOST',
      color: 'border-amber-500/60 text-amber-300 bg-amber-500/15'
    }
  ];

  return (
    <header className="w-full bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 lg:px-8 shadow-2xl">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border-2 border-blue-500/50 bg-blue-950/50 text-blue-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-blue-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-display-hud font-extrabold text-base sm:text-lg tracking-wider text-white uppercase">
                MAGLEV FLEET RUNNER // CHRONOS K-9 ACTIVE
              </span>
              <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-mono-tactical font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                RIG-09X ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-mono-tactical text-zinc-300 flex items-center gap-2.5 mt-0.5 flex-wrap">
              <span>SYNC: 1.5s CYCLE</span>
              <span className="text-zinc-600">|</span>
              <span>GUIDEWAY: L4-AERO-VAC</span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400 font-semibold">
                STATUS: {emergencyScram ? 'SCRAM ENGAGED' : linearBraking ? 'EDDY DECEL' : 'NOMINAL FLUX'}
              </span>
            </p>
          </div>
        </div>

        {/* Global Controls & Status Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 text-sm font-mono-tactical text-zinc-200">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>SYS_TIME: {systemTime}</span>
          </div>

          <button
            onClick={() => {
              onToggleAudio();
              tacticalAudio.playClick(1000);
            }}
            title={audioMuted ? "Unmute Tactical SFX" : "Mute Tactical SFX"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-sm font-mono-tactical text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            <span className="hidden md:inline font-semibold">{audioMuted ? 'SFX MUTED' : 'SFX LIVE'}</span>
          </button>

          <button
            onClick={onOpenTradeDress}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-900/50 to-purple-900/50 hover:from-blue-900/70 hover:to-purple-900/70 border border-blue-500/50 text-sm font-mono-tactical text-blue-200 transition-all hover:glow-blue cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-bold tracking-wide uppercase">FLEET VAULT & TRADE-DRESS</span>
          </button>
        </div>
      </div>

      {/* Main HUD Row: Primary Velocity & Acceleration Gauge + Mode Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-3.5">
        {/* Velocity Gauge Callout */}
        <div className="lg:col-span-5 flex items-center gap-5 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-mono-tactical text-zinc-300 font-semibold mb-1">
              <span className="flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-blue-400" />
                TRACK VELOCITY
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">MAX 620 KM/H</span>
            </div>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="font-mono-tactical text-5xl sm:text-6xl font-black tracking-wider text-white text-glow-blue">
                {Math.round(velocityKmh)}
              </span>
              <span className="text-sm font-mono-tactical font-extrabold text-blue-400 uppercase tracking-widest">
                KM/H
              </span>
            </div>

            {/* Velocity Bar Indicator */}
            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden mt-2.5 border border-zinc-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (velocityKmh / 620) * 100)}%` }}
              />
            </div>
          </div>

          {/* G-Force Telemetry Badge */}
          <div className="w-32 text-center px-3 py-2 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="text-xs font-mono-tactical font-semibold text-zinc-300 uppercase tracking-wider">ACCEL G-FORCE</div>
            <div className={`text-3xl sm:text-4xl font-mono-tactical font-black tracking-wider mt-1 ${
              accelG > 2.5 ? 'text-amber-400 text-glow-amber' : accelG < 0 ? 'text-rose-400' : 'text-blue-300'
            }`}>
              {accelG >= 0 ? `+${accelG.toFixed(2)}` : accelG.toFixed(2)}
              <span className="text-sm ml-1 text-zinc-400">G</span>
            </div>
            <div className="text-xs font-mono-tactical font-semibold text-zinc-400 mt-0.5 uppercase tracking-wide">
              {accelG > 3 ? 'HIGH LOAD' : accelG < -1 ? 'DECEL' : 'CRUISE'}
            </div>
          </div>
        </div>

        {/* Operational Run Mode Toggles */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-2.5">
          {modes.map((mode) => {
            const isActive = runMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  tacticalAudio.playModeSwitch();
                  onSetRunMode(mode.id);
                }}
                className={`flex-1 text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? `${mode.color} shadow-lg ring-2 ring-blue-400/40` 
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display-hud font-extrabold uppercase tracking-wide">
                    {mode.label}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-current animate-ping' : 'bg-zinc-750'}`} />
                </div>
                <div className="text-xs sm:text-sm font-mono-tactical text-zinc-300 mt-1.5 font-medium">
                  {mode.desc}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-90" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
