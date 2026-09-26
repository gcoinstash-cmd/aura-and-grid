import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Props for the AudioEngineControl Component.
 */
export interface AudioEngineControlProps {
  /**
   * Represents whether the ambient audio hum is actively playing.
   */
  audioEnabled: boolean;
  /**
   * Callback fired when clicking the primary toggle action button.
   */
  onToggleAudio: () => void;
}

/**
 * AudioEngineControl - Highly documented, modular audio engine settings widget.
 * Controls the 80Hz ambient synthesizer drone mimicking a high-temperature searing kitchen/engine.
 */
export default function AudioEngineControl({
  audioEnabled,
  onToggleAudio
}: AudioEngineControlProps) {
  return (
    <div 
      id="custom-audio-engine-controls" 
      className="flex items-center gap-3 select-none"
    >
      <span className="text-[9px] font-mono text-neutral-500 hidden md:inline tracking-wider uppercase">
        ENGINE HUM: {audioEnabled ? 'ACTIVE (80HZ)' : 'MUTED'}
      </span>
      <button
        id="audio-toggle-btn"
        onClick={onToggleAudio}
        className={`p-1.5 transition-all duration-300 border flex items-center gap-1.5 text-[10px] font-mono tracking-tighter cursor-pointer ${
          audioEnabled
            ? 'border-[#FF3366] text-[#FF3366] bg-[#FF3366]/5 shadow-[0_0_8px_rgba(255,51,102,0.15)]'
            : 'border-white/5 text-neutral-500 hover:text-white hover:border-white/10'
        }`}
        title="Toggle Synthesizer Atmosphere"
      >
        {audioEnabled ? (
          <Volume2 className="w-3 h-3 text-[#FF3366]" id="icon-volume-high" />
        ) : (
          <VolumeX className="w-3 h-3 text-neutral-500" id="icon-volume-muted" />
        )}
        <span className="font-bold tracking-widest uppercase">
          {audioEnabled ? "[ // AUDIO ACTIVE ]" : "[ ‖ AUDIO OFF ]"}
        </span>
      </button>
    </div>
  );
}
