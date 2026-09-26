import React from 'react';
import { DriveThruConfig, VehicleClass, BoostPreset } from '../types';
import { VEHICLE_CLASSES, BOOST_PRESETS } from '../data';
import { playWokSizzle } from '../utils/audio';

interface ConfigurationPanelProps {
  config: DriveThruConfig;
  onChange: (newConfig: DriveThruConfig) => void;
}

export default function ConfigurationPanel({ config, onChange }: ConfigurationPanelProps) {
  const handleVehicleChange = (vehicleClass: VehicleClass) => {
    onChange({ ...config, vehicleClass });
  };

  const handleBoostChange = (boostPreset: BoostPreset) => {
    onChange({ ...config, boostPreset });
  };

  const handleWokTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wokTemperature = parseInt(e.target.value);
    onChange({ ...config, wokTemperature });
    if (wokTemperature % 10 === 0) {
      playWokSizzle(); // quick audio feedback on heavy heat changes
    }
  };

  const handleTogglePriority = () => {
    onChange({ ...config, lanePriority: !config.lanePriority });
  };

  return (
    <div id="drive-thru-config-panel" className="bg-[#111111]/90 border border-white/5 backdrop-blur-md p-5 space-y-5">
      <div className="border-b border-white/5 pb-2.5 flex justify-between items-center">
        <h3 className="font-display font-medium text-xs tracking-widest text-[#FF3366] uppercase">
          TELEMETRY CONTROLS // SYSTEM CONFIG
        </h3>
        <span className="text-[9px] font-mono text-neutral-500">REV: 902.1</span>
      </div>

      {/* Vehicle class selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase block">
          01 // VEHICLE INTENTION SYSTEM
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VEHICLE_CLASSES.map((vc) => {
            const isSelected = config.vehicleClass === vc.id;
            return (
              <button
                key={vc.id}
                onClick={() => handleVehicleChange(vc.id)}
                className={`py-2 px-3 text-left border relative transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FF3366] bg-[#FF3366]/5'
                    : 'border-white/5 bg-[#151515] hover:border-white/15'
                }`}
              >
                <div className="font-display font-bold text-xs text-white">
                  {vc.name}
                </div>
                <div className="text-[9px] text-neutral-400 font-mono mt-0.5 leading-none">
                  MULT: {vc.multiplier}X
                </div>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF3366]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Szechuan engine injection presets */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase block">
          02 // SPICE FUEL INTEGRATION MODES
        </label>
        <div className="space-y-1.5">
          {BOOST_PRESETS.map((bp) => {
            const isSelected = config.boostPreset === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => handleBoostChange(bp.id)}
                className={`w-full py-2 px-3 text-left border relative flex justify-between items-center transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FF3366] bg-[#FF3366]/5'
                    : 'border-white/5 bg-[#151515] hover:border-white/10'
                }`}
              >
                <div>
                  <div className="font-display font-bold text-[11px] text-white">
                    {bp.name}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-mono">
                    {bp.desc}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#FF3366]' : 'text-neutral-400'}`}>
                    {bp.addTime < 0 ? `${bp.addTime}S` : 'N/A'}
                  </span>
                </div>
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FF3366]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wok temperature slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase block">
            03 // FLASH WOK METRIC TEMPERATURE
          </label>
          <span className="text-xs font-mono text-[#FF3366] font-bold">
            {config.wokTemperature}°C
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="250"
            max="350"
            value={config.wokTemperature}
            onChange={handleWokTempChange}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF3366]"
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-neutral-500">
          <span>LOW SEAR (250°C)</span>
          <span>HIGH COMBUSTION (350°C)</span>
        </div>
      </div>

      {/* Apex overdrive switch */}
      <div className="pt-2">
        <button
          onClick={handleTogglePriority}
          className={`w-full py-2.5 px-4 text-center font-mono text-xs tracking-wider border uppercase transition-all duration-300 flex justify-between items-center ${
            config.lanePriority
              ? 'border-[#FF3366] text-[#FF3366] bg-[#FF3366]/10 shadow-[0_0_15px_rgba(255,51,102,0.1)]'
              : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
          }`}
        >
          <span>APEX OVERDRIVE SPEED LANE</span>
          <span className={`text-md ${config.lanePriority ? 'animate-pulse text-[#FF3366]' : 'text-neutral-500'}`}>
            {config.lanePriority ? '● ACTIVE' : '○ DEACTIVATED'}
          </span>
        </button>
      </div>
    </div>
  );
}
