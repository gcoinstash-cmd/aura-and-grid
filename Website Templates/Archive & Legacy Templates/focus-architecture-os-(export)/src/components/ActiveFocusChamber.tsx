import React, { useState, useEffect, useRef } from "react";
import { Task } from "../types";
import { Check, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, X, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ActiveFocusChamberProps {
  activeFocusTask: Task | undefined;
  onUpdateTask: (task: Task) => void;
  isFocusActive: boolean;
  onFocusActiveChange: (active: boolean) => void;
}

// Generate organic Woody/Tick sound for focus pacing
const playQuietTick = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Quick organic decay centered on woody 900hz peak
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.008, ctx.currentTime); // very subtle, non-intrusive
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // blocked or key-activation required
  }
};

// Play a gorgeous harmonic chime when a target Pomodoro/session is achieved
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major Chord harmonic stack
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.012 / (idx + 1), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2 + idx * 0.15);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  } catch (e) {
    // blocked or non-interactive context
  }
};

// Generates warm, deep background brown noise as a premium focus isolation drone
const startFocusDrone = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise formula (integration / leakage)
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 4.5; // Gain compensation
    }
    
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    
    // Lowpass filter for absolute plush warmth
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 260; // deep oceanic cutoff freq
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2); // subtle background isolation
    
    source.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start(0);
    return { ctx, source, gainNode };
  } catch (err) {
    console.error("Focus Wave generation failed:", err);
    return null;
  }
};

export const ActiveFocusChamber: React.FC<ActiveFocusChamberProps> = ({
  activeFocusTask,
  onUpdateTask,
  isFocusActive,
  onFocusActiveChange,
}) => {
  // Focus duration state
  const [durationPreset, setDurationPreset] = useState<number>(45); // Set to 45 minutes by default as requested
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [enableSound, setEnableSound] = useState<boolean>(false);
  
  // Ambient Sound Ambient Wave drone state
  const [isAmbientActive, setIsAmbientActive] = useState<boolean>(false);
  const ambientAudioRef = useRef<{ ctx: AudioContext; source: AudioBufferSourceNode; gainNode: GainNode } | null>(null);

  // Success completed state
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [completedSessionTaskName, setCompletedSessionTaskName] = useState<string>("");
  const [completedSessionMinutes, setCompletedSessionMinutes] = useState<number>(45);

  // Sync state & dismiss completed banner when active goal changes
  useEffect(() => {
    if (activeFocusTask) {
      setSecondsLeft(durationPreset * 60);
      setIsTimerRunning(false);
      setShowSuccess(false);
    }
  }, [activeFocusTask?.id, durationPreset]);

  // Manage warm brown noise background isolation thread
  useEffect(() => {
    if (isAmbientActive) {
      if (!ambientAudioRef.current) {
        const drone = startFocusDrone();
        if (drone) {
          ambientAudioRef.current = drone;
        } else {
          setIsAmbientActive(false);
        }
      }
    } else {
      if (ambientAudioRef.current) {
        const drone = ambientAudioRef.current;
        try {
          // Sweet fade out curve to prevent audio pop artifacts
          drone.gainNode.gain.setValueAtTime(drone.gainNode.gain.value, drone.ctx.currentTime);
          drone.gainNode.gain.exponentialRampToValueAtTime(0.0001, drone.ctx.currentTime + 0.6);
          setTimeout(() => {
            try {
              drone.source.stop();
              drone.ctx.close();
            } catch (_) {}
          }, 700);
        } catch (_) {
          try {
            drone.source.stop();
            drone.ctx.close();
          } catch (_) {}
        }
        ambientAudioRef.current = null;
      }
    }

    return () => {
      // Ensure pristine garbage collection of audio context thread
      if (ambientAudioRef.current) {
        try {
          ambientAudioRef.current.source.stop();
          ambientAudioRef.current.ctx.close();
        } catch (_) {}
          ambientAudioRef.current = null;
      }
    };
  }, [isAmbientActive]);

  // Handle countdown intervals
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          if (enableSound && next >= 0) {
            playQuietTick();
          }
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playChime();
      if (activeFocusTask) {
        setCompletedSessionTaskName(activeFocusTask.title);
        setCompletedSessionMinutes(durationPreset);
      } else {
        setCompletedSessionTaskName("your scheduled focus target");
        setCompletedSessionMinutes(durationPreset);
      }
      setShowSuccess(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsLeft, enableSound, activeFocusTask, durationPreset]);

  // Quick reset
  const handleResetTimer = () => {
    setSecondsLeft(durationPreset * 60);
    setIsTimerRunning(false);
  };

  // Change preset length
  const selectPreset = (mins: number) => {
    setDurationPreset(mins);
    setSecondsLeft(mins * 60);
    setIsTimerRunning(false);
  };

  const handleTaskCompleted = () => {
    if (activeFocusTask) {
      playChime();
      setCompletedSessionTaskName(activeFocusTask.title);
      setCompletedSessionMinutes(durationPreset);
      onUpdateTask({ ...activeFocusTask, completed: true });
      setShowSuccess(true);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG progress math
  const totalSeconds = durationPreset * 60;
  const percentChange = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 105 : 0; // complete look around radius scale
  const radius = 64;
  const strokeWidth = 1.5;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentChange / 105) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto py-2 text-center" id="active-focus-container">
      
      {/* 1. COMPACT NON-IMMERSIVE ACTIVE OR SETTING VIEW */}
      {activeFocusTask ? (
        <div className="flex flex-col items-center justify-start space-y-6">
          
          <div className="w-full flex justify-end items-center px-2">
            {!isFocusActive && (
              <span className="text-[9px] font-mono tracking-widest text-[#C5A85C]/60 uppercase">
                Active Focal Point
              </span>
            )}
          </div>

          {/* Core objective title */}
          <div className="w-full space-y-3">
            <div className="flex flex-col items-center space-y-1.5 pointer-events-none select-none">
              <div className="w-[1.5px] h-6 bg-gradient-to-b from-[#C5A85C]/60 to-transparent animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl md:text-3.2xl text-stone-100 font-light tracking-tight leading-relaxed max-w-2xl mx-auto py-1">
              {activeFocusTask.title}
            </h2>
            {activeFocusTask.notes && (
              <p className="text-xs md:text-sm text-stone-400 italic max-w-lg mx-auto font-sans font-light">
                “{activeFocusTask.notes}”
              </p>
            )}
          </div>

          {/* COMPACT ENTRY CONTROLS FOR FOCUS MODE */}
          <div className="w-full pt-3 flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <button
                onClick={() => onFocusActiveChange(true)}
                className="bg-[#C5A85C]/10 border border-[#C5A85C]/30 hover:bg-[#C5A85C]/20 hover:border-[#C5A85C]/60 text-[#C5A85C] hover:text-stone-100 tracking-wide text-xs font-sans font-semibold py-2.5 px-6 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#C5A85C]/5 focus:outline-none cursor-pointer flex items-center space-x-2"
                id="enter-focus-chamber-btn"
              >
                <Sparkles size={13} className="text-[#C5A85C]" />
                <span>Enter Visual Calm Focus Mode</span>
              </button>

              <button
                onClick={handleTaskCompleted}
                className="bg-stone-900/50 border border-stone-850 hover:border-stone-600 text-stone-300 hover:text-stone-105 tracking-wide text-xs font-sans py-2.5 px-6 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:scale-[1.02] active:scale-[0.98] focus:outline-none cursor-pointer hover:bg-stone-850"
                id="finish-focus-btn"
              >
                Mark Done
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAmbientActive(!isAmbientActive)}
                className={`flex items-center space-x-2 text-[10px] font-mono tracking-wider px-3.5 py-1.5 rounded-sm border transition-all duration-500 cursor-pointer ${
                  isAmbientActive 
                    ? "bg-[#C5A85C]/15 border-[#C5A85C]/40 text-[#C5A85C] animate-pulse" 
                    : "bg-transparent border-stone-850 text-stone-500 hover:text-stone-300"
                }`}
                title={isAmbientActive ? "ambient sound active" : "ambient sound"}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isAmbientActive ? "bg-[#C5A85C]" : "bg-stone-600"}`} />
                <span>{isAmbientActive ? "ambient sound active" : "ambient sound"}</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <span className="font-serif italic text-sm text-stone-500 block mb-1.5">
            Current Focus
          </span>
          <p className="font-serif text-xl text-stone-400 italic font-light flex items-center justify-center gap-2">
            Your mind is completely clear.
            <span 
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" 
              style={{ animationDuration: "3000ms" }}
              aria-hidden="true"
            />
          </p>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-sans font-light">
            Select or enter a task above and commit to it to begin.
          </p>
        </div>
      )}

      {/* 2. FULL SCREEN "VISUAL CALM" IMMERSIVE CANVAS */}
      <AnimatePresence>
        {isFocusActive && activeFocusTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-between py-12 px-6 md:py-20 text-center text-stone-200 overflow-hidden"
            id="visual-calm-immersive-canvas"
          >
            {/* Edge Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_65%,_rgba(0,0,0,0.85)_100%)] pointer-events-none select-none z-0" />

            {/* Immersive Top Header */}
            <div className="w-full flex justify-between items-center max-w-4xl mx-auto z-10 px-4 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-medium text-stone-400">
                  Visual Calm Active
                </span>
              </div>
              <button
                onClick={() => onFocusActiveChange(false)}
                className="text-[10px] font-mono text-stone-400 hover:text-stone-100 transition-colors uppercase tracking-[0.2em] bg-stone-900/60 border border-stone-850 px-3 py-1.5 rounded-sm cursor-pointer"
                id="exit-visual-calm-btn"
              >
                Return to Workspace
              </button>
            </div>

            {/* Immersive Centered Core */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full my-auto space-y-12 z-10">
              
              {/* Single Current Focus Task Title */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A85C]/60 font-mono block">
                  Committing attention to
                </span>
                <h2 className="font-serif text-3.5xl md:text-5.5xl text-stone-50 font-light tracking-tight leading-snug px-2 max-w-2xl mx-auto">
                  {activeFocusTask.title}
                </h2>
                {activeFocusTask.notes && (
                  <p className="text-xs md:text-sm text-stone-400 italic max-w-lg mx-auto font-sans font-light tracking-wide px-4">
                    “{activeFocusTask.notes}”
                  </p>
                )}
              </div>

              {/* Large Minimalist Countdown Timer */}
              <div className="relative flex flex-col items-center justify-center space-y-8 select-none">
                
                {/* Mega Ticking Circle Ring */}
                <div 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="group relative flex items-center justify-center w-60 h-60 md:w-72 md:h-72 rounded-full border border-stone-900/80 bg-[#09090b]/40 backdrop-blur-md cursor-pointer hover:border-[#C5A85C]/20 transition-all duration-700 hover:shadow-[0_0_60px_rgba(197,168,92,0.02)]"
                  id="mega-radial-timer-container"
                  title="Click anyway inside the ring to play / pause the timer"
                >
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 select-none pointer-events-none" viewBox="0 0 128 128">
                    {/* Ring background */}
                    <circle
                      className="text-stone-950"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx="64"
                      cy="64"
                    />
                    {/* Golden actual progress thread */}
                    <circle
                      className="text-[#C5A85C] transition-all duration-300 ease-linear"
                      strokeWidth="2.5"
                      strokeDasharray={`${circumference} ${circumference}`}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r={normalizedRadius}
                      cx="64"
                      cy="64"
                    />
                  </svg>

                  {/* Mass clock typography inside */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-5xl md:text-6.5xl font-extralight text-stone-100 tracking-wider">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#C5A85C]/60 font-mono mt-1.5 transition-colors group-hover:text-[#C5A85C]">
                      {isTimerRunning ? "Ticking" : "Paused"}
                    </span>
                    {/* Click-to-action hover helper */}
                    <span className="text-[7px] text-stone-605 tracking-widest uppercase opacity-0 group-hover:opacity-100 mt-1.5 transition-all duration-550">
                      Click inside to {isTimerRunning ? "Pause" : "Start"}
                    </span>
                  </div>
                </div>

                {/* Presets and isolate noise toggles styled inside Visual Calm */}
                <div className="space-y-4">
                  {/* Presets strip */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-mono">
                      Session Target
                    </span>
                    <div className="flex gap-1.5 p-0.5 border border-stone-900 rounded-sm bg-stone-950/80">
                      {[15, 25, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectPreset(mins);
                          }}
                          className={`text-[10px] font-mono px-3 py-1 rounded-sm cursor-pointer transition-all ${
                            durationPreset === mins 
                              ? "bg-[#C5A85C]/15 text-[#C5A85C] border border-[#C5A85C]/35" 
                              : "text-stone-500 hover:text-stone-300"
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio toggler row */}
                  <div className="flex items-center gap-3 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnableSound(!enableSound);
                      }}
                      className={`flex items-center space-x-1.5 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1.5 rounded-sm border transition-all cursor-pointer ${
                        enableSound 
                          ? "bg-[#C5A85C]/10 border-[#C5A85C]/30 text-[#C5A85C]" 
                          : "bg-transparent border-stone-900 text-stone-600 hover:text-stone-400"
                      }`}
                    >
                      {enableSound ? <Volume2 size={11} /> : <VolumeX size={11} />}
                      <span>{enableSound ? "Ticks On" : "Mute Ticks"}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAmbientActive(!isAmbientActive);
                      }}
                      className={`flex items-center space-x-1.5 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1.5 rounded-sm border transition-all cursor-pointer ${
                        isAmbientActive 
                          ? "bg-[#C5A85C]/10 border-[#C5A85C]/30 text-[#C5A85C] animate-pulse" 
                          : "bg-transparent border-stone-900 text-stone-600 hover:text-stone-400"
                      }`}
                    >
                      <Sparkles size={11} className={isAmbientActive ? "text-[#C5A85C]" : "text-stone-600"} />
                      <span>{isAmbientActive ? "Noise Active" : "No Noise"}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Immersive Immersive Controls Footer */}
            <div className="w-full max-w-xl mx-auto flex items-center justify-between border-t border-stone-900/60 pt-6 z-10 px-4">
              <button
                onClick={handleResetTimer}
                className="bg-transparent border border-stone-900 hover:border-stone-800 text-stone-550 hover:text-stone-300 px-4 py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                title="Reset timer to preset value"
              >
                Reset Session
              </button>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center space-x-2 border py-2.5 px-8 rounded-sm text-[11px] font-mono uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                  isTimerRunning 
                    ? "bg-transparent border-stone-700 text-stone-300 hover:border-stone-100" 
                    : "bg-[#C5A85C] border-[#C5A85C] text-stone-950 hover:bg-[#C5A85C]/90"
                }`}
              >
                {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                <span>{isTimerRunning ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={handleTaskCompleted}
                className="bg-stone-950 border border-[#C5A85C]/20 hover:border-[#C5A85C]/50 text-[#C5A85C] hover:text-stone-100 py-2 px-4 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                id="immersive-complete-btn"
              >
                Complete Objective
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SOPHISTICATED, QUIET SUMMARY MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#030303]/96 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center select-none"
            id="session-complete-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0c0c0e] border border-[#C5A85C]/25 max-w-xl w-full p-10 md:p-14 rounded-sm shadow-2xl relative space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C5A85C]/50 to-transparent" />
              
              <div className="space-y-2">
                <div className="flex justify-center mb-1">
                  <Trophy size={20} className="text-[#C5A85C]" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase block">
                  Pristine Focus Achieved
                </span>
                <div className="w-8 h-[1px] bg-stone-850 mx-auto mt-2" />
              </div>

              <h3 className="font-serif text-3xl md:text-4.5xl text-stone-100 tracking-wide font-extralight leading-tight">
                Deep Work Session Concluded.
              </h3>

              <p className="text-stone-300 font-sans text-sm md:text-base leading-relaxed font-light tracking-wide px-2">
                {completedSessionMinutes} minutes of pristine execution dedicated to{" "}
                <span className="font-serif italic text-white font-normal block mt-2">
                  "{completedSessionTaskName}"
                </span>
                .
              </p>

              <div className="h-[1px] w-12 bg-stone-850 mx-auto" />

              <div className="pt-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    onFocusActiveChange(false);
                  }}
                  className="text-[10px] font-mono tracking-[0.25em] text-[#C5A85C] hover:text-stone-950 bg-transparent hover:bg-[#C5A85C] border border-[#C5A85C]/40 px-8 py-3 rounded-sm transition-all duration-300 font-bold uppercase cursor-pointer"
                  id="modal-reset-close"
                >
                  Conclude Focus Session & Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
