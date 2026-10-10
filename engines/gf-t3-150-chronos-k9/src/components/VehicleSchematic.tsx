import React from 'react';
import { BogieStatus, RunMode } from '../types/telemetry';
import { Cpu } from 'lucide-react';

interface VehicleSchematicProps {
  velocityKmh: number;
  runMode: RunMode;
  linearBraking: boolean;
  emergencyScram: boolean;
  bogies: BogieStatus[];
}

export const VehicleSchematic: React.FC<VehicleSchematicProps> = ({
  velocityKmh,
  runMode,
  linearBraking,
  emergencyScram,
  bogies,
}) => {
  return (
    <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
            CHRONOS KINETIC-9 // VECTOR DIGITAL TWIN
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-mono-tactical font-bold text-zinc-300 uppercase tracking-wide">
          CHASSIS: FORGED CARBON / BRUSHED TITANIUM
        </span>
      </div>

      {/* Interactive Vector Rig Graphic */}
      <div className="relative w-full h-48 bg-zinc-900/50 rounded-xl border border-zinc-800 p-2.5 flex items-center justify-center overflow-hidden">
        {/* Guideway background lines */}
        <div className="absolute inset-x-0 h-0.5 bg-blue-500/25 top-1/4" />
        <div className="absolute inset-x-0 h-0.5 bg-purple-500/25 top-3/4" />
        
        {/* Aerodynamic Speed Flow Lines */}
        {velocityKmh > 20 && (
          <div className="absolute inset-0 pointer-events-none opacity-45">
            <div className="w-full h-full flex flex-col justify-around">
              <div className="h-[1.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
              <div className="h-[1.5px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>
        )}

        {/* Hypercar Silhouette SVG */}
        <svg viewBox="0 0 500 120" className="w-full h-full max-h-40 overflow-visible">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#334155" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="glowUnder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="20%" stopColor={linearBraking ? "#f59e0b" : "#38bdf8"} stopOpacity="0.85" />
              <stop offset="80%" stopColor={linearBraking ? "#ef4444" : "#a855f7"} stopOpacity="0.85" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Underglow Levitation Field (15mm gap) */}
          <rect x="70" y="85" width="360" height="9" rx="4.5" fill="url(#glowUnder)" className={emergencyScram ? 'opacity-30' : 'animate-pulse'} />

          {/* Magnetic Guideway Rail surface */}
          <line x1="20" y1="96" x2="480" y2="96" stroke="#475569" strokeWidth="3" strokeDasharray="8 6" />
          <line x1="20" y1="99" x2="480" y2="99" stroke="#1e293b" strokeWidth="2" />

          {/* Aerodynamic Hypercar Body Contour */}
          <path
            d="M 60 76 
               C 80 72, 110 50, 150 42 
               C 190 34, 240 28, 290 28 
               C 340 28, 380 40, 420 62 
               C 445 74, 450 78, 445 82 
               C 435 84, 420 84, 390 84 
               C 380 84, 370 70, 340 70 
               C 310 70, 300 84, 220 84 
               C 200 84, 190 70, 160 70 
               C 130 70, 120 84, 80 84 
               C 65 84, 55 80, 60 76 Z"
            fill="url(#bodyGrad)"
            stroke={linearBraking ? "#f59e0b" : "#38bdf8"}
            strokeWidth="2.5"
          />

          {/* Cockpit Canopy Glass */}
          <path
            d="M 200 40 
               C 230 32, 270 32, 310 38 
               C 335 44, 345 52, 335 55 
               C 290 55, 220 54, 185 52 
               C 180 48, 190 42, 200 40 Z"
            fill="#0f172a"
            stroke="#818cf8"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Front Stator Coil Shroud (Left/Right) */}
          <circle cx="160" cy="80" r="15" fill="#09090b" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="160" cy="80" r="7" fill="#38bdf8" className="animate-ping" style={{ transformOrigin: '160px 80px' }} />
          <text x="160" y="84" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">FL/FR</text>

          {/* Rear Stator Coil Shroud */}
          <circle cx="340" cy="80" r="15" fill="#09090b" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="340" cy="80" r="7" fill="#a855f7" className="animate-ping" style={{ transformOrigin: '340px 80px' }} />
          <text x="340" y="84" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">RL/RR</text>

          {/* Eddy Current Brake Actuator Blades */}
          {linearBraking && (
            <g>
              <rect x="235" y="74" width="34" height="14" fill="#ef4444" rx="3" className="animate-pulse" />
              <text x="252" y="85" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">EDDY BRK</text>
            </g>
          )}

          {/* Hover Height Callout */}
          <line x1="250" y1="84" x2="250" y2="96" stroke="#38bdf8" strokeWidth="2" />
          <text x="262" y="93" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">15.0 mm GAP</text>
        </svg>

        {/* Status Callout Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-950/85 border border-zinc-800 text-xs sm:text-sm font-mono-tactical shadow-lg font-bold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-200 uppercase">AERODYNAMIC RIG: Cd 0.18</span>
        </div>
      </div>
    </div>
  );
};
