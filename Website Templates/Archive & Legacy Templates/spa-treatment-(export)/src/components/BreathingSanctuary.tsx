import React, { useState, useEffect } from 'react';
import { Sun, Wind } from 'lucide-react';

export type BreathPhase = 'Inhale' | 'Hold' | 'Exhale';

/**
 * BreathingSanctuary Component
 * 
 * An isolated luxury relaxation driver implementing a traditional therapeutic respiration cycle.
 * Contains its own internal interval drivers to prevent expensive parent layout re-renders.
 * 
 * Cadence:
 * - Inhale: 4 seconds (Visual Scale Expands)
 * - Hold: 4 seconds (Visual Scale Sustained)
 * - Exhale: 5 seconds (Visual Scale Contracts)
 */
export const BreathingSanctuary: React.FC = () => {
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [totalCycles, setTotalCycles] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4; // Hold for 4s
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 5; // Exhale for 5s
          } else {
            setPhase('Inhale');
            setTotalCycles((c) => c + 1);
            return 4; // Inhale for 4s
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Self-contained elegant theme detector to seamlessly support multiple colorways
  useEffect(() => {
    const checkTheme = () => {
      const parent = document.querySelector('.noise-overlay');
      if (parent) {
        setIsDarkMode(!parent.classList.contains('bg-[#FAF9F5]'));
      }
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    const parent = document.querySelector('.noise-overlay');
    if (parent) {
      observer.observe(parent, { attributes: true, attributeFilter: ['class'] });
    }
    return () => observer.disconnect();
  }, []);

  // Determine scale calculations based on state phase
  const getPulsingScaleClass = () => {
    switch (phase) {
      case 'Inhale':
        return `scale-110 ${isDarkMode ? 'border-stone-400/80 shadow-[0_0_40px_rgba(229,228,224,0.08)] bg-stone-900/30' : 'border-stone-500/80 shadow-[0_0_40px_rgba(27,26,24,0.04)] bg-stone-100/40'}`;
      case 'Hold':
        return `scale-115 ${isDarkMode ? 'border-stone-200 shadow-[0_0_55px_rgba(229,228,224,0.14)] bg-stone-900/40' : 'border-stone-950 shadow-[0_0_55px_rgba(27,26,24,0.08)] bg-stone-200/50'}`;
      case 'Exhale':
        return `scale-90 shadow-none ${isDarkMode ? 'border-stone-900 bg-stone-950/10' : 'border-stone-200 bg-stone-50/10'}`;
      default:
        return `scale-100 ${isDarkMode ? 'border-stone-800' : 'border-stone-300'}`;
    }
  };

  return (
    <div 
      id="breathing-sanctuary-root" 
      className={`w-full max-w-xl mx-auto border rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden transition-all duration-700 ${isDarkMode ? 'bg-[#0A0A09] border-stone-900/80 text-stone-300' : 'bg-white border-stone-200 text-stone-800 shadow-sm'}`}
    >
      {/* Decorative vector grid lines */}
      <div className={`absolute inset-0 opacity-5 [background-size:20px_20px] pointer-events-none ${isDarkMode ? 'bg-[linear-gradient(to_right,#333_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#ccc_1px,transparent_1px)]'}`} />
      
      {/* Dynamic phase ambient background glow wrapper */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[1500ms] pointer-events-none rounded-3xl ${
          phase === 'Hold' 
            ? 'opacity-10 bg-gradient-to-tr from-stone-800/10 via-[#E5E4E0]/5 to-transparent' 
            : 'opacity-0'
        }`} 
      />

      {/* Component Header Metadata block */}
      <div className="relative z-10 space-y-1 mb-8" id="breathing-meta-header">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500 block">
          Respiratory Balance No. 13
        </span>
        <h3 className={`font-serif text-2xl font-light tracking-wide italic transition-colors ${isDarkMode ? 'text-[#E5E4E0]' : 'text-stone-900'}`}>
          Guided Breathing Ritual
        </h3>
        <p className={`text-[11px] font-sans font-light max-w-xs mx-auto transition-colors ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
          Synchronize your breath to our traditional wellness rhythms. Proven to calm tension before your therapeutic treatments.
        </p>
      </div>

      {/* Central Visual Pulsing Stage Ring */}
      <div className="relative z-10 flex flex-col items-center py-4">
        <div 
          id="pulsing-breathing-ring"
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 flex flex-col items-center justify-center p-4 relative transition-all duration-[4000ms] ease-in-out ${getPulsingScaleClass()}`}
        >
          {/* Pulsing Ripple Visual Indicator */}
          <div 
            className={`absolute inset-0 rounded-full border border-stone-500/10 transition-transform ${
              phase === 'Inhale' ? 'animate-ping duration-[6000ms]' : 'scale-100'
            }`} 
          />

          <Wind size={18} className="text-stone-400 mb-1 animate-pulse" />
          
          <span className={`font-serif italic text-2xl capitalize tracking-wide transition-colors ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
            {phase}
          </span>
          
          <span className="text-[10px] font-mono text-stone-500 mt-1">
            {secondsLeft}s remain
          </span>
        </div>
      </div>

      {/* Interactive Footer & Meta Progress Status Lines */}
      <div className={`relative z-15 mt-10 pt-6 border-t flex justify-between items-center text-[10px] text-stone-500 font-mono tracking-wider ${isDarkMode ? 'border-stone-900/60' : 'border-stone-200'}`}>
        <span className="flex items-center gap-1">
          <Sun size={11} className="text-[#7A7568]" /> 
          Respiration Coherence
        </span>
        <span>
          Cycles: {totalCycles}
        </span>
      </div>
    </div>
  );
};

export default BreathingSanctuary;
