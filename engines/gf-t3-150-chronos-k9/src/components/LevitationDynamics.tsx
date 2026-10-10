import React from 'react';
import { BogieStatus, CryoLoop } from '../types/telemetry';
import { 
  Magnet, 
  ThermometerSnowflake, 
  Sliders, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface LevitationDynamicsProps {
  bogies: BogieStatus[];
  cryo: CryoLoop;
  suspensionStiffness: number;
  fluxBias: number;
  onChangeSuspension: (val: number) => void;
  onChangeFluxBias: (val: number) => void;
  onResetCalibration: () => void;
  onTriggerCryoPurge: () => void;
}

export const LevitationDynamics: React.FC<LevitationDynamicsProps> = ({
  bogies,
  cryo,
  suspensionStiffness,
  fluxBias,
  onChangeSuspension,
  onChangeFluxBias,
  onResetCalibration,
  onTriggerCryoPurge
}) => {
  // Cryo thermal alert state (>18K is critical warning, >10K is caution, <5K is optimal)
  const isCryoHot = cryo.coilTempKelvin > 18;
  const isCryoWarm = cryo.coilTempKelvin > 10;

  return (
    <div className="flex flex-col gap-5">
      {/* Panel 1: 4-Point Magnetic Levitation Gap Matrix */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Magnet className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              BOGIE LEVITATION GAP [4-POINT]
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-mono-tactical font-bold px-3 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wide">
            TARGET: 15.0 mm
          </span>
        </div>

        {/* 4-Bogie Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {bogies.map((bogie) => {
            const dev = bogie.gapMm - bogie.targetGapMm;
            const absDev = Math.abs(dev);
            const isWarn = absDev > 1.2;
            const isCritical = absDev > 2.5;

            return (
              <div 
                key={bogie.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isCritical 
                    ? 'bg-rose-950/30 border-rose-600/60 glow-amber' 
                    : isWarn 
                    ? 'bg-amber-950/30 border-amber-600/50' 
                    : 'bg-zinc-900/70 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono-tactical">
                  <span className="font-bold text-zinc-200">{bogie.label}</span>
                  <span className={`font-semibold ${dev >= 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                    {dev >= 0 ? `+${dev.toFixed(2)}` : dev.toFixed(2)} mm
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl sm:text-4xl font-mono-tactical font-black tracking-wider text-white">
                    {bogie.gapMm.toFixed(1)}
                  </span>
                  <span className="text-sm font-mono-tactical font-semibold text-zinc-300">
                    {bogie.fluxTesla.toFixed(2)} T
                  </span>
                </div>

                {/* Gap Visual Range Meter */}
                <div className="relative w-full bg-zinc-950 h-3 rounded-full overflow-hidden mt-2.5 border border-zinc-800">
                  {/* Target 15mm center marker */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-blue-400 z-10" />
                  {/* Active bar */}
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isCritical ? 'bg-rose-500' : isWarn ? 'bg-amber-400' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.max(5, Math.min(100, ((bogie.gapMm - 10) / 10) * 100))}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono-tactical text-zinc-400 font-semibold mt-1">
                  <span>10mm</span>
                  <span className="text-blue-400 font-bold">15mm [NOMINAL]</span>
                  <span>20mm</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chassis Levitation Overview Diagram */}
        <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/80 flex items-center justify-between text-sm font-mono-tactical">
          <span className="text-zinc-300 font-medium">FLUX COUPLING RATIO</span>
          <span className="text-emerald-400 font-bold tracking-wide">99.4% SYNCHRONIZED</span>
        </div>
      </div>

      {/* Panel 2: Superconducting Cryogenic Thermal Telemetry */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <ThermometerSnowflake className={`w-5 h-5 ${isCryoHot ? 'text-rose-400 animate-bounce' : 'text-blue-400'}`} />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              CRYO-COIL THERMAL MATRIX
            </h2>
          </div>
          <span className={`text-xs sm:text-sm font-mono-tactical font-bold px-3 py-1 rounded border uppercase tracking-wider ${
            isCryoHot ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' :
            isCryoWarm ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' :
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {isCryoHot ? 'CRITICAL WARN' : isCryoWarm ? 'ELEVATED' : 'SUPERCONDUCTING'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Main Kelvin readout */}
          <div className="p-4 bg-zinc-900/70 rounded-xl border border-zinc-800 flex flex-col justify-between">
            <div className="text-xs sm:text-sm font-mono-tactical font-semibold text-zinc-300 uppercase tracking-wide">
              COIL TEMPERATURE
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-mono-tactical font-black tracking-wider ${
                isCryoHot ? 'text-rose-400 text-glow-amber' : isCryoWarm ? 'text-amber-400' : 'text-blue-300 text-glow-blue'
              }`}>
                {cryo.coilTempKelvin.toFixed(2)}
              </span>
              <span className="text-lg font-mono-tactical font-extrabold text-zinc-400">K</span>
            </div>
            <div className="text-xs font-mono-tactical text-zinc-400 font-medium">
              TARGET: 4.20 K (LHe)
            </div>
          </div>

          {/* Coolant Pressure & Flow */}
          <div className="p-4 bg-zinc-900/70 rounded-xl border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-xs sm:text-sm font-mono-tactical font-semibold text-zinc-300 uppercase tracking-wide">
                HELIUM PRESSURE
              </div>
              <div className="text-2xl font-mono-tactical font-extrabold text-zinc-100 mt-1">
                {cryo.coolantPressureBar.toFixed(1)} <span className="text-sm text-zinc-400">BAR</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <div className="text-xs sm:text-sm font-mono-tactical font-semibold text-zinc-300 uppercase tracking-wide">
                FLOW RATE
              </div>
              <div className="text-lg font-mono-tactical font-extrabold text-purple-300 mt-1">
                {cryo.heliumFlowRateLpm.toFixed(1)} <span className="text-sm text-zinc-400">L/MIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Emergency Cryo Purge (with requested px-5 py-3 and text-base font-semibold) */}
        <div className="mt-4">
          <button
            onClick={() => {
              tacticalAudio.playThermalPurge();
              onTriggerCryoPurge();
            }}
            disabled={cryo.purgeActive}
            className={`w-full px-5 py-3 rounded-xl border-2 text-base font-mono-tactical font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              cryo.purgeActive 
                ? 'bg-blue-600/40 border-blue-400 text-blue-200 animate-pulse'
                : 'bg-zinc-900 hover:bg-blue-950/50 border-zinc-700 hover:border-blue-500 text-zinc-100 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>{cryo.purgeActive ? 'CRYOGENIC PURGE IN PROGRESS...' : 'EMERGENCY CRYO PURGE [VENT LHe]'}</span>
          </button>
        </div>
      </div>

      {/* Panel 3: Calibration & Tuning Sliders */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              SUSPENSION & FLUX CALIBRATION
            </h2>
          </div>
          <button 
            onClick={() => {
              tacticalAudio.playClick(900);
              onResetCalibration();
            }}
            title="Reset to factory trim"
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Slider 1: Bogie Suspension Stiffness */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-sm font-mono-tactical mb-2">
            <span className="text-zinc-200 font-semibold">Bogie Suspension Stiffness</span>
            <span className="text-purple-300 font-extrabold text-base">{suspensionStiffness} N/mm</span>
          </div>
          <input
            type="range"
            min={120}
            max={320}
            step={5}
            value={suspensionStiffness}
            onChange={(e) => {
              onChangeSuspension(Number(e.target.value));
            }}
            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs font-mono-tactical text-zinc-400 font-medium mt-1.5">
            <span>SOFT (120)</span>
            <span className="text-purple-400 font-semibold">NOMINAL (210)</span>
            <span>TRACK RIGID (320)</span>
          </div>
        </div>

        {/* Slider 2: Coil Magnetic Flux Bias */}
        <div>
          <div className="flex justify-between items-center text-sm font-mono-tactical mb-2">
            <span className="text-zinc-200 font-semibold">Coil Magnetic Flux Bias</span>
            <span className={`font-extrabold text-base ${fluxBias > 0 ? 'text-amber-400' : fluxBias < 0 ? 'text-blue-400' : 'text-zinc-200'}`}>
              {fluxBias > 0 ? `+${fluxBias}%` : `${fluxBias}%`}
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={1}
            value={fluxBias}
            onChange={(e) => {
              onChangeFluxBias(Number(e.target.value));
            }}
            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs font-mono-tactical text-zinc-400 font-medium mt-1.5">
            <span>LEAN FLUX (-15%)</span>
            <span className="text-blue-400 font-semibold">BALANCED (0%)</span>
            <span>OVERFLUX (+15%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
