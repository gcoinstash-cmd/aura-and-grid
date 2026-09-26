import React from 'react';
import { playNeonChime } from '../utils/audio';

/**
 * Type of supported vehicular profiles.
 */
export type ProfileType = 'Coupe' | 'Sedan' | 'SUV';

/**
 * Props defined for ChassisProfileSelector.
 */
export interface ChassisProfileSelectorProps {
  /**
   * The active selected chassis profile.
   */
  selectedProfile: ProfileType;
  /**
   * Callback fired to announce profile changes.
   */
  onProfileChange: (profile: ProfileType) => void;
}

/**
 * ChassisProfileSelector - High contrast visual selector displaying
 * mechanical silhouettes of primary chassis categories.
 */
export default function ChassisProfileSelector({
  selectedProfile,
  onProfileChange,
}: ChassisProfileSelectorProps) {
  
  const profiles: ProfileType[] = ['Coupe', 'Sedan', 'SUV'];

  const getWeightMultiplier = (profile: ProfileType): string => {
    switch (profile) {
      case 'Coupe': return '0.8X';
      case 'Sedan': return '1.0X';
      case 'SUV': return '1.2X';
    }
  };

  const handleSelect = (prof: ProfileType) => {
    onProfileChange(prof);
    try {
      playNeonChime();
    } catch (err) {
      console.warn('Audio chime failure:', err);
    }
  };

  return (
    <div className="space-y-3 select-none">
      <div>
        <span className="text-[10px] text-neutral-400 font-mono tracking-widest block mb-1">
          02 // CHASSIS COEFFICIENT SELECT
        </span>
        <h3 className="font-display font-medium text-xs text-white uppercase tracking-wider">
          VEHICLE PROFILE SELECTION
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {profiles.map((prof) => {
          const isSelected = selectedProfile === prof;
          return (
            <button
              key={prof}
              onClick={() => handleSelect(prof)}
              className={`p-3 text-left border relative transition-all duration-300 overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-[#00FF66] bg-[#00FF66]/5 shadow-[0_0_12px_rgba(0,255,102,0.08)]'
                  : 'border-[#222] bg-[#151515] hover:border-[#333] hover:bg-[#1a1a1a]'
              }`}
            >
              {/* SVG Silhouettes of Coupe, Sedan, and SUV */}
              <div className="h-10 flex items-center justify-center text-neutral-400 mb-2 pointer-events-none">
                {prof === 'Coupe' && (
                  <svg className={`w-14 h-8 transition-colors ${isSelected ? 'text-[#00FF66]' : 'text-neutral-500'}`} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 28 L30 28 C30 25, 33 22, 37 22 C41 22, 44 25, 44 28 L66 28 C66 25, 69 22, 73 22 C77 22, 80 25, 80 28 L90 28 L88 23 C86 20, 80 18, 70 17 L56 12 L32 12 L16 19 L10 23 Z" />
                    <circle cx="37" cy="28" r="4" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                    <circle cx="73" cy="28" r="4" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                  </svg>
                )}
                {prof === 'Sedan' && (
                  <svg className={`w-14 h-8 transition-colors ${isSelected ? 'text-[#00FF66]' : 'text-neutral-500'}`} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 28 L20 28 C20 25, 23 22, 27 22 C31 22, 34 25, 34 28 L66 28 C66 25, 69 22, 73 22 C77 22, 80 25, 80 28 L95 28 L92 22 L75 19 L58 12 L35 12 L22 19 L5 22 Z" />
                    <circle cx="27" cy="28" r="4" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                    <circle cx="73" cy="28" r="4" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                  </svg>
                )}
                {prof === 'SUV' && (
                  <svg className={`w-14 h-8 transition-colors ${isSelected ? 'text-[#00FF66]' : 'text-neutral-500'}`} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 28 L23 28 C23 25, 26 21, 30 21 C34 21, 37 25, 37 28 L68 28 C68 25, 71 21, 75 21 C79 21, 82 25, 82 28 L95 28 L93 18 L78 15 L45 12 L22 12 L8 19 L5 22 Z" />
                    <circle cx="30" cy="28" r="4.5" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                    <circle cx="75" cy="28" r="4.5" className={isSelected ? 'fill-[#00FF66]' : 'fill-[#222]'} />
                  </svg>
                )}
              </div>
              
              <span className="font-display font-medium text-[11px] text-white tracking-tight uppercase block text-center">
                {prof}
              </span>
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="text-[10px] font-mono text-neutral-500 flex justify-between pr-1">
        <span>WEIGHT CLASS MOD: {getWeightMultiplier(selectedProfile)}</span>
        <span>GAP OFFSET STALL</span>
      </div>
    </div>
  );
}
