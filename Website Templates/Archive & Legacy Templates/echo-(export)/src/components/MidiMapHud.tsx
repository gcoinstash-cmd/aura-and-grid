import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Radio, Sliders, Settings2, HelpCircle, X, Cpu, Info, CheckCircle2 } from 'lucide-react';

interface MidiMapHudProps {
  isOpen: boolean;
  onClose: () => void;
  activePressedKey: string | null;
  cutoff: number;
  resonance: number;
  delayFeedback: number;
  noise: number;
  masterVolume: number;
  tempo: number;
}

interface MidiCCMapping {
  cc: number;
  parameter: string;
  key: string;
  currentValue: string;
  description: string;
  standardDAW: string;
}

export const MidiMapHud: React.FC<MidiMapHudProps> = ({
  isOpen,
  onClose,
  activePressedKey,
  cutoff,
  resonance,
  delayFeedback,
  noise,
  masterVolume,
  tempo
}) => {
  const [testCCVal, setTestCCVal] = useState<number | null>(null);
  const [testCcLog, setTestCcLog] = useState<string[]>(['[MIDI INIT] Awaiting physical controller or shortcut...']);
  
  const ccMappings: MidiCCMapping[] = [
    {
      cc: 74,
      parameter: 'FILTER CUTOFF',
      key: 'DRAG SLIDER',
      currentValue: `${cutoff} Hz`,
      description: 'Controls synth high-frequency brightness and ladder cutoff threshold',
      standardDAW: 'CC 74 (Brightness)'
    },
    {
      cc: 71,
      parameter: 'FILTER RESONANCE',
      key: 'DRAG SLIDER',
      currentValue: `${resonance} Q`,
      description: 'Sweeps filter harmonic peak levels and active resonance band feedback',
      standardDAW: 'CC 71 (Resonance)'
    },
    {
      cc: 91,
      parameter: 'DELAY FEEDBACK',
      key: 'DRAG SLIDER',
      currentValue: `${Math.round(delayFeedback * 100)} %`,
      description: 'Extends feedback echo loop buffer limit for spacious spatial reflections',
      standardDAW: 'CC 91 (Reverb/Delay Rate)'
    },
    {
      cc: 12,
      parameter: 'CYBER NOISE GRUNGE',
      key: 'DRAG SLIDER',
      currentValue: `${Math.round(noise * 100)} %`,
      description: 'Injects modular digital white noise matrix texture into oscillator stream',
      standardDAW: 'CC 12 (Effect Control 1)'
    },
    {
      cc: 7,
      parameter: 'MASTER VOLUME GAIN',
      key: 'DRAG SLIDER',
      currentValue: `${Math.round(masterVolume * 100)} %`,
      description: 'Sets overall master stereo gain stage amplitude limit',
      standardDAW: 'CC 07 (Main Volume)'
    },
    {
      cc: 102,
      parameter: 'PLAY/PAUSE TOGGLE',
      key: 'SPACE',
      currentValue: 'KEY TRIGGER',
      description: 'Switches the real-time node sequence execution state',
      standardDAW: 'CC 102 (Sequence Control)'
    },
    {
      cc: 103,
      parameter: 'TAP TEMPO GENERATOR',
      key: 'T',
      currentValue: 'KEY TRIGGER',
      description: 'Calculates active tempo by averaging historical tap timing delays',
      standardDAW: 'CC 103 (Active Trigger)'
    },
    {
      cc: 104,
      parameter: 'VISUAL INDEX MODE',
      key: 'V',
      currentValue: 'KEY TRIGGER',
      description: 'Loops audio monitor rendering mode (Oscilloscope, Spectrum, etc)',
      standardDAW: 'CC 104 (Feedback Control)'
    },
    {
      cc: 105,
      parameter: 'OSCILLATOR FORM SHAPE',
      key: 'O',
      currentValue: 'KEY TRIGGER',
      description: 'Cycles generator source shapes: Sawtooth, Square, Triangle, Sine',
      standardDAW: 'CC 105 (Waveform Mode Selection)'
    },
    {
      cc: 106,
      parameter: 'NUDGE TEMPO DOWN',
      key: '[',
      currentValue: `${tempo} BPM`,
      description: 'Slightly decreases current synthesis tempo (nudge limit dec)',
      standardDAW: 'CC 106 (Step Decrement)'
    },
    {
      cc: 107,
      parameter: 'NUDGE TEMPO UP',
      key: ']',
      currentValue: `${tempo} BPM`,
      description: 'Slightly increases current synthesis tempo (nudge limit inc)',
      standardDAW: 'CC 107 (Step Increment)'
    },
    {
      cc: 108,
      parameter: 'SYSTEM RESET',
      key: 'R',
      currentValue: 'KEY TRIGGER',
      description: 'Instantly restores all synth faders and oscillators back to bios defaults',
      standardDAW: 'CC 108 (Engine Reset)'
    }
  ];

  const triggerTestCC = (ccNumber: number, paramName: string) => {
    setTestCCVal(ccNumber);
    const dateStr = new Date().toLocaleTimeString();
    setTestCcLog(prev => [
      `[CC OUT] Transmitted CC #${ccNumber} mapped to [${paramName}] at ${dateStr}`,
      ...prev.slice(0, 7)
    ]);
    setTimeout(() => setTestCCVal(null), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="midi-map-hud-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 md:bg-black/90 md:backdrop-blur-md z-50 flex md:items-center md:justify-center p-0 md:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-[#040406] border-0 md:border md:border-[#00FF41]/30 max-w-4xl w-full min-h-screen md:min-h-0 md:rounded-lg overflow-y-auto overflow-x-hidden md:overflow-hidden md:shadow-[0_0_35px_rgba(0,255,65,0.08)] relative flex flex-col justify-between"
          >
            {/* High-visibility prominent absolute close button for mobile screens */}
            <button
              id="midi-map-mobile-close-btn"
              onClick={onClose}
              className="md:hidden fixed top-4 right-4 z-50 p-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold border-2 border-white rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
              title="Close MIDI CC Map HUD"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>

            {/* HUD Corner Tech Graphics */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FF41]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00FF41]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00FF41]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FF41]" />

            {/* Header section */}
            <div className="bg-[#07070a] border-b border-[#00FF41]/10 px-4 md:px-6 py-4 flex justify-between items-center pr-16 md:pr-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF41] animate-ping shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white font-mono font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs">MIDI MAP DAW CHANNELS HUD</span>
                  <span className="text-[8px] md:text-[9px] font-mono text-stone-500 uppercase">Hardware controllers & keyboard CC mapping manifest</span>
                </div>
              </div>
              <button
                id="midi-map-close-btn"
                onClick={onClose}
                className="hidden md:block p-1 px-1.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-[#00FF41] hover:border-[#00FF41] transition-all rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Grid */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-md:pb-24 md:max-h-[80vh] overflow-y-auto custom-scrollbar flex-1">
              
              {/* Left Column: DAW/Hardware mappings catalog */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 tracking-wider">
                  <span className="uppercase">PARAMETER ROUTING DIAGRAM</span>
                  <span className="text-[#00FF41]">MATRIX RE-ROUTE: STANDBY</span>
                </div>

                <div className="border border-[#141416] rounded overflow-hidden">
                  {/* Table headers */}
                  <div className="hidden md:grid grid-cols-12 bg-stone-950 px-3 py-2 text-[9px] font-mono text-stone-500 uppercase tracking-wider font-bold border-b border-[#141416]">
                    <div className="col-span-1">CC #</div>
                    <div className="col-span-3">PARAMETER</div>
                    <div className="col-span-2">SHORTCUT</div>
                    <div className="col-span-2">LIVE VALUE</div>
                    <div className="col-span-4 text-right">MAPPED DIRECT ASSIGNMENT</div>
                  </div>

                  {/* List rows */}
                  <div className="divide-y divide-stone-950">
                    {ccMappings.map((mapping) => {
                      const isKeyPressed = activePressedKey?.toLowerCase() === mapping.key.toLowerCase() || 
                                           (mapping.key === 'SPACE' && activePressedKey === 'Space') ||
                                           (mapping.key === '[' && activePressedKey === '[') ||
                                           (mapping.key === ']' && activePressedKey === ']');
                                           
                      const activeCCFlash = testCCVal === mapping.cc;

                      return (
                        <div
                          key={mapping.cc}
                          className={`flex flex-col md:grid md:grid-cols-12 px-4 py-3 md:px-3 md:py-2.5 font-mono text-[10px] items-start md:items-center gap-2 md:gap-0 transition-all ${
                            isKeyPressed 
                              ? 'bg-[#00FF41]/15 text-[#00FF41] border-l-2 border-[#00FF41]' 
                              : activeCCFlash
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-[#040406]/40 text-stone-300 hover:bg-stone-900/40'
                          }`}
                        >
                          {/* Mobil layout header split */}
                          <div className="flex md:contents justify-between items-center w-full">
                            <div className="md:col-span-1 text-slate-400 font-bold">#{mapping.cc}</div>
                            <div className="md:col-span-3 uppercase font-medium">{mapping.parameter}</div>
                            <div className="md:hidden text-cyan-400 font-mono font-bold">{mapping.currentValue}</div>
                          </div>
                          
                          {/* Mobil layout attributes line */}
                          <div className="flex md:contents justify-between items-center w-full mt-1 md:mt-0">
                            <div className="md:col-span-2 select-all">
                              <span className={`px-1.5 py-0.5 rounded border leading-none text-[9px] ${
                                isKeyPressed 
                                  ? 'bg-[#00FF41]/25 border-[#00FF41] font-bold text-black bg-[#00FF41]'
                                  : 'bg-black border-stone-800 text-stone-400'
                              }`}>
                                {mapping.key}
                              </span>
                            </div>
                            <div className={`hidden md:block md:col-span-2 text-stone-400 ${isKeyPressed ? 'text-[#00FF41]' : ''}`}>
                              {mapping.currentValue}
                            </div>
                            <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-stone-900 md:border-t-0">
                              <span className="text-[9px] text-stone-500 uppercase">{mapping.standardDAW}</span>
                              <button
                                id={`trigger-test-cc-${mapping.cc}`}
                                onClick={() => triggerTestCC(mapping.cc, mapping.parameter)}
                                className="text-[8.5px] px-2 py-0.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-cyan-400 hover:text-cyan-400 text-stone-400 rounded transition-all shrink-0 cursor-pointer"
                                title="Simulate hardware CC signal burst"
                              >
                                TEST
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Professional Hardware DAW Documentation Tip */}
                <div className="bg-[#07070c] border border-[#1e1e2d]/60 p-4 rounded-lg font-mono text-[10.5px] text-stone-400 space-y-2 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-stone-200 uppercase tracking-wider text-[11px] font-bold">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ENTREPRENEUR NOTE: DAW MAP LINKING STEPS</span>
                  </div>
                  <p>
                    Ensure your physical hardware controller (e.g. Moog Subsequent 37, TR-8S, Akai MPK Mini, Launchkey) is plugged in. In any modern DAW (Ableton Live, FL Studio, Logic Pro Pro X, Cubase, Reaper):
                  </p>
                  <ol className="list-decimal list-inside text-stone-400 space-y-1">
                    <li>Toggle the <strong className="text-white">MIDI Map Mode (CTRL + M / CMD + M)</strong>.</li>
                    <li>Click standard parameters in your virtual track mixer.</li>
                    <li>Move standard hardware faders/knobs corresponding to standard MIDI CCs listed above.</li>
                    <li>Toggle out of MIDI Map Mode to instantly establish hardware synchronization.</li>
                  </ol>
                </div>
              </div>

              {/* Right Column: Mini Console Output Terminal logs */}
              <div className="md:col-span-4 flex flex-col justify-between h-full bg-[#030304]/60 border border-[#131315] p-3 rounded opacity-40 select-none tracking-tight font-light">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-tight font-light">MIDI Activity Feed</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-stone-600"></span>
                  </div>

                  {/* Terminal Logger Output block */}
                  <div className="p-2 bg-black/40 border border-stone-950/80 rounded font-mono text-[9.5px] text-stone-500 space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar select-none leading-normal">
                    {testCcLog.map((log, idx) => (
                      <p key={idx} className={idx === 0 ? 'text-stone-400' : 'opacity-50 font-light'}>
                        {log}
                      </p>
                    ))}
                  </div>

                  <div className="border-t border-[#121214] pt-3 font-mono text-[10px] text-stone-500 space-y-1.5">
                    <span className="text-[8px] text-stone-600 block uppercase tracking-tight">Shortcuts Quick Check</span>
                    <div className="flex justify-between">
                      <span>SPACE KEY:</span>
                      <span className="text-stone-500">
                        {activePressedKey === 'Space' ? 'DETECTED' : 'READY'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>TEMPO [T] FEEDBACK:</span>
                      <span className="text-stone-500">
                        {activePressedKey === 'T' ? 'DETECTED' : 'READY'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHAPE [O] FEEDBACK:</span>
                      <span className="text-stone-500">
                        {activePressedKey === 'O' ? 'DETECTED' : 'READY'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#121214] flex flex-col gap-2">
                  <span className="text-[8px] font-mono text-stone-600 block uppercase tracking-tight">MANUFACTURING INFO</span>
                  <div className="font-mono text-[8px] text-stone-500 space-y-1 leading-normal">
                    <p>ENGINE: ECHO INTEGRITY CORE</p>
                    <p>MIDI COMPATIBILITY: DUPLEX DATA CC INTERFACE</p>
                    <p>LATENCY STATE: ZERO DRIFT (&lt; 0.6ms)</p>
                  </div>
                  <button
                    id="midi-map-clear-logs"
                    onClick={() => setTestCcLog(['[CONSOLE FREED] Awaiting physical controller...'])}
                    className="w-full mt-2 py-1 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-white font-mono text-[8.5px] rounded uppercase cursor-pointer"
                  >
                    Clear Feed Logs
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Footer block */}
            <div className="bg-[#07070a] border-t border-[#00FF41]/10 px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-2 font-mono text-[9px] text-stone-500">
              <span className="uppercase tracking-widest text-slate-500">ECHO DIGITAL INSTRUMENT MATRIX SPEC</span>
              <span className="text-[#00FF41] uppercase">MIDI CC LINK ACTIVE (CH 01-16 DUPLEX SENDS)</span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
