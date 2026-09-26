import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Check, Sparkles, AlertCircle, ShieldAlert, Volume2, VolumeX, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FocusTask, SubStep } from "../types";

interface FocusSprintProps {
  task: FocusTask;
  onCompleteSprint: (wasDoneEnough: boolean, durationMinutes: number, updatedSubSteps?: SubStep[]) => void;
  onAbandon: () => void;
  onTriggerAntiLoop?: (triggerType: "reset" | "edit" | "overcheck") => void;
  onTriggerShameFreeReset?: (reason: "abandoned" | "paused" | "missed" | "manual") => void;
}

export default function FocusSprint({
  task,
  onCompleteSprint,
  onAbandon,
  onTriggerAntiLoop,
  onTriggerShameFreeReset,
}: FocusSprintProps) {
  // Timer State
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes (600s) default
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10); // in minutes
  const timerRef = useRef<any>(null);

  // Background state listener counters for perfectionism tracking
  const [resetClickCount, setResetClickCount] = useState(0);
  const [toggleCounts, setToggleCounts] = useState<Record<string, number>>({});
  const [inactiveSeconds, setInactiveSeconds] = useState(0);

  // Sub-steps state local
  const [subSteps, setSubSteps] = useState<SubStep[]>(task?.subSteps || []);

  // Editing individual milestone/subtasks tracking & Spiral interrupt
  const [editingSubStepId, setEditingSubStepId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [subStepEditCounts, setSubStepEditCounts] = useState<Record<string, number>>({});
  const [showSpiralInterrupt, setShowSpiralInterrupt] = useState(false);
  const [editingStartTime, setEditingStartTime] = useState<number | null>(null);
  const [showTimeSpiralInterrupt, setShowTimeSpiralInterrupt] = useState(false);

  useEffect(() => {
    if (editingSubStepId !== null) {
      setEditingStartTime(Date.now());
    } else {
      setEditingStartTime(null);
    }
  }, [editingSubStepId]);

  useEffect(() => {
    if (!editingStartTime || editingSubStepId === null) return;

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - editingStartTime) / 1000;
      // Trigger modal alert at 300 seconds (5 minutes)
      if (elapsedSeconds >= 300) {
        setShowTimeSpiralInterrupt(true);
        setEditingSubStepId(null);
        setEditingStartTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [editingStartTime, editingSubStepId]);

  const handleSaveEditedSubStep = (stepId: string) => {
    if (!editingText.trim()) return;

    setSubSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, text: editingText.trim() } : step
      )
    );

    // Track repeated edits on this specific sub-task or sub-steps in general
    const currentCount = (subStepEditCounts[stepId] || 0) + 1;
    const nextEditCounts = { ...subStepEditCounts, [stepId]: currentCount };
    setSubStepEditCounts(nextEditCounts);

    // If edited the same sub-task 2 or more times, trigger spiral intervention
    if (currentCount >= 2) {
      setShowSpiralInterrupt(true);
    }

    setEditingSubStepId(null);
  };

  // Premium Audio States & Refs
  const [soundscape, setSoundscape] = useState<"Silence" | "Binaural Focus" | "Slate Rain">("Silence");
  const [audioAllowed, setAudioAllowed] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Stop current active nodes
  const stopActiveSounds = (fadeOut = false) => {
    if (activeNodesRef.current.length > 0) {
      const nodesToStop = [...activeNodesRef.current];
      activeNodesRef.current = [];

      nodesToStop.forEach((nodeOrGain) => {
        // If it is a gain node, let's fade out first if requested
        if (fadeOut && nodeOrGain instanceof GainNode) {
          try {
            const ctx = audioCtxRef.current;
            if (ctx) {
              nodeOrGain.gain.setValueAtTime(nodeOrGain.gain.value, ctx.currentTime);
              nodeOrGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
            }
          } catch (e) {
            // fallback safe block
          }
        }

        // Call stop on oscillators or buffer sources
        if (nodeOrGain && typeof nodeOrGain.stop === "function") {
          try {
            if (fadeOut) {
              setTimeout(() => {
                try {
                  nodeOrGain.stop();
                } catch (e) {}
              }, 1250);
            } else {
              nodeOrGain.stop();
            }
          } catch (err) {
            // already stopped
          }
        }
      });
    }
  };

  // Play finished arpeggiated chime
  const triggerSprintCompleteSound = () => {
    stopActiveSounds(true);
    if (!audioAllowed) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Arpeggiated happy ambient chord sweep (C5, E5, G5, C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gainNode.gain.setValueAtTime(0.001, now + idx * 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch (err) {
      console.warn("Could not play finish chime audio:", err);
    }
  };

  // Sync ambient waves soundscapes when state or active status changes
  useEffect(() => {
    if (!audioAllowed) return;

    const handleSync = async () => {
      // If silence or paused, fade out existing sounds
      if (soundscape === "Silence" || !isActive) {
        stopActiveSounds(true);
        return;
      }

      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtxClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Reset previous sound nodes
        stopActiveSounds(false);

        if (soundscape === "Binaural Focus") {
          // Play deep binaural focus waves
          const oscLeft = ctx.createOscillator();
          const oscRight = ctx.createOscillator();

          oscLeft.type = "sine";
          oscRight.type = "sine";

          oscLeft.frequency.value = 140; // 140 Hz left ear
          oscRight.frequency.value = 148; // 148 Hz right ear (8Hz alpha/theta brain difference)

          const merger = ctx.createChannelMerger(2);
          oscLeft.connect(merger, 0, 0);
          oscRight.connect(merger, 0, 1);

          const lowpass = ctx.createBiquadFilter();
          lowpass.type = "lowpass";
          lowpass.frequency.value = 180; // filter any high harmonics for a deep warm hum

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1.5); // smooth fade in

          merger.connect(lowpass);
          lowpass.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscLeft.start();
          oscRight.start();

          activeNodesRef.current = [oscLeft, oscRight, gainNode];

        } else if (soundscape === "Slate Rain") {
          // Pink noise buffer generation
          const bufferSize = 2 * ctx.sampleRate;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);

          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; // normalizes level
            b6 = white * 0.115926;
          }

          const bufferSource = ctx.createBufferSource();
          bufferSource.buffer = noiseBuffer;
          bufferSource.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 1400; // soft rain filter

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5); // smooth fade in

          bufferSource.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          bufferSource.start();
          activeNodesRef.current = [bufferSource, filter, gainNode];
        }

      } catch (err) {
        console.warn("Failed to synchronize audio:", err);
      }
    };

    handleSync();
  }, [soundscape, isActive, audioAllowed]);

  // Clean up sounds on absolute unmount
  useEffect(() => {
    return () => {
      stopActiveSounds(false);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // Completed items count and percentage
  const completedCount = subSteps.filter((s) => s.completed).length;
  const totalSubSteps = subSteps.length;
  const completedPercentage = totalSubSteps > 0 ? Math.round((completedCount / totalSubSteps) * 100) : 0;
  
  // Decide whether they hit the "done enough" line
  const isDoneEnoughReached = completedPercentage >= (task?.doneEnoughMetric ?? 70);

  // Manage Timer ticking
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      triggerSprintCompleteSound();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  // Paused inactivity tracking for Shame-Free Reset
  useEffect(() => {
    let inactiveInterval: any = null;
    const hasStarted = secondsLeft < selectedDuration * 60;
    
    if (!isActive && hasStarted) {
      inactiveInterval = setInterval(() => {
        setInactiveSeconds((prev) => {
          const next = prev + 1;
          if (next >= 45) {
            clearInterval(inactiveInterval);
            if (onTriggerShameFreeReset) {
              onTriggerShameFreeReset("paused");
            }
          }
          return next;
        });
      }, 1000);
    } else {
      setInactiveSeconds(0);
    }

    return () => {
      if (inactiveInterval) clearInterval(inactiveInterval);
    };
  }, [isActive, secondsLeft, selectedDuration, onTriggerShameFreeReset]);

  // Set preset
  const handleSetPreset = (minutes: number) => {
    setIsActive(false);
    setSelectedDuration(minutes);
    setSecondsLeft(minutes * 60);
  };

  const toggleTimer = () => {
    setAudioAllowed(true);
    setIsActive(!isActive);
  };

  // Spacebar toggle timer hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === "INPUT" || 
        activeEl.tagName === "TEXTAREA" || 
        activeEl.getAttribute("contenteditable") === "true"
      )) {
        return;
      }

      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(selectedDuration * 60);
    
    // Track repeated timer resets
    const nextResetCount = resetClickCount + 1;
    setResetClickCount(nextResetCount);
    if (nextResetCount >= 2 && onTriggerAntiLoop) {
      onTriggerAntiLoop("reset");
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle checklist
  const handleToggleStep = (stepId: string) => {
    setSubSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );

    // Track repeated checklist toggles (check-loop/overthinking detection)
    setToggleCounts((prev) => {
      const currentVal = prev[stepId] || 0;
      const nextVal = currentVal + 1;
      
      // Trigger anti-loop alert if a sub-step is toggled repeatedly (e.g. 3 times: check, uncheck, check)
      if (nextVal >= 3 && onTriggerAntiLoop) {
        onTriggerAntiLoop("overcheck");
      }
      return { ...prev, [stepId]: nextVal };
    });
  };

  // Ship flow
  const handleShipTask = () => {
    const minutesFocused = selectedDuration - Math.floor(secondsLeft / 60);
    onCompleteSprint(isDoneEnoughReached, Math.max(1, minutesFocused), subSteps);
  };

  // SVG Progress Ring geometry parameters
  const radius = 50;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completedPercentage / 100) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* 5-minute Spiral Interrupt Nudge Modal */}
      {showTimeSpiralInterrupt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Spiral Interrupt Coach
                </span>
              </div>
              
              <h4 className="text-2xl font-serif text-white font-black leading-tight">
                Done for now?
              </h4>
              
              <p className="text-sm sm:text-base font-sans text-slate-300 leading-relaxed font-light">
                This looks good enough to ship. Should we push it live, or snooze this task for now?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="snooze-nudge-btn"
                type="button"
                onClick={() => {
                  setShowTimeSpiralInterrupt(false);
                  setEditingStartTime(Date.now());
                }}
                className="w-full sm:w-1/2 py-3 bg-transparent border border-slate-800 hover:border-slate-705 text-slate-400 hover:text-slate-200 rounded-xl font-sans text-sm font-bold tracking-wide transition-all cursor-pointer text-center"
              >
                Snooze
              </button>
              <button
                id="ship-nudge-btn"
                type="button"
                onClick={() => {
                  setShowTimeSpiralInterrupt(false);
                  handleShipTask();
                }}
                className="w-full sm:w-1/2 py-3 bg-white hover:bg-slate-200 text-black rounded-xl font-sans text-sm font-extrabold tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-lg hover:scale-[101%] active:scale-[99%]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Push Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top action header info */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 pb-3 border-b border-slate-900">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Immersive Mode: Running Task
        </span>
        <button
          id="abandon-sprint"
          onClick={onAbandon}
          className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <span>Abandon Sprint</span>
          <kbd className="hidden sm:inline-block px-1 py-0.5 text-[8px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded leading-none">Esc</kbd>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Immersive Circular Progress & Timer */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-6">
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Slate background circle rail */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-900 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Dynamic progress highlight stroke */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-amber-500 transition-all duration-300 fill-none"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            {/* In-middle metrics clock */}
            <div className="absolute text-center space-y-1">
              <span className="text-3xl font-mono text-slate-100 font-medium tracking-tight">
                {formatTime(secondsLeft)}
              </span>
              <p className="text-[10px] font-mono text-slate-500">
                {completedPercentage}% done
              </p>
            </div>
          </div>

          {/* Time presets configuration */}
          <div className="flex gap-2.5 font-mono text-xs">
            <button
              id="set-10m-preset"
              onClick={() => handleSetPreset(10)}
              className={`px-3 py-1 rounded-full border transition-all ${
                selectedDuration === 10
                  ? "bg-slate-100 border-slate-100 text-slate-950 font-semibold"
                  : "bg-transparent border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              10m
            </button>
            <button
              id="set-25m-preset"
              onClick={() => handleSetPreset(25)}
              className={`px-3 py-1 rounded-full border transition-all ${
                selectedDuration === 25
                  ? "bg-slate-100 border-slate-100 text-slate-950 font-semibold"
                  : "bg-transparent border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              25m
            </button>
          </div>

          {/* Pause Grace Indicator / Missed interval warnings */}
          {inactiveSeconds > 0 && (
            <div className="text-[10px] font-mono text-amber-500 bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse max-w-[200px] text-center justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Reset Grace: clean in {45 - inactiveSeconds}s</span>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-3">
              <button
                id="toggle-timer-btn"
                onClick={toggleTimer}
                className={`p-3 rounded-full transition-colors ${
                  isActive ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
                title={isActive ? "Pause sprint (Space)" : "Start focus sprint (Space)"}
              >
                {isActive ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-200" />}
              </button>
              <button
                id="reset-timer-btn"
                onClick={resetTimer}
                className="p-3 bg-transparent border border-slate-800 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                title="Reset time"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[8px] font-mono text-slate-650 block tracking-wider uppercase">
              Space to {isActive ? "pause" : "start"}
            </span>
          </div>

          {/* Luxury Minimal Ambient Soundscape Selection Panel */}
          <div className="w-full max-w-[200px] pt-4 border-t border-slate-900/60 flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono text-slate-500 tracking-wider">
              {soundscape === "Silence" ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-500/80 animate-pulse" />
              )}
              <span>Ambient Wavescape</span>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-900 rounded-full w-full justify-between">
              {(["Silence", "Binaural Focus", "Slate Rain"] as const).map((track) => {
                const isSelected = soundscape === track;
                const shrinkLabel = track === "Silence" ? "Mute" : track === "Binaural Focus" ? "Binaural" : "Rain";
                return (
                  <button
                    key={track}
                    id={`soundscape-btn-${track.toLowerCase().replace(" ", "-")}`}
                    onClick={() => {
                      setAudioAllowed(true);
                      setSoundscape(track);
                      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
                        audioCtxRef.current.resume().catch(() => {});
                      }
                    }}
                    className={`px-2.5 py-1 text-[9px] rounded-full font-mono transition-all text-center flex-1 cursor-pointer truncate ${
                      isSelected
                        ? "bg-slate-900 text-amber-500 font-semibold border border-amber-550/10 shadow-sm"
                        : "text-slate-500 hover:text-slate-350 bg-transparent border border-transparent"
                    }`}
                    title={`Switch output to ${track}`}
                  >
                    {shrinkLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Guilt-Free Simulation Sandbox Trigger Panel - Excluded in production builds */}
          {!(import.meta as any).env?.PROD && (
            <div className="w-full max-w-[200px] pt-4 border-t border-slate-900/60 flex flex-col items-center space-y-2">
              <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">
                Lapse Safeguard Sandbox
              </span>
              <div className="flex flex-col gap-1 w-full text-[9px] font-mono">
                <button
                  id="sandbox-trigger-paused-btn"
                  onClick={() => onTriggerShameFreeReset?.("paused")}
                  className="w-full py-1 text-left px-2 bg-slate-950 hover:bg-slate-900 hover:text-slate-300 border border-slate-900 text-slate-500 rounded cursor-pointer flex items-center justify-between"
                  title="Simulate a long pause of inactivity"
                >
                  <span>Simulate Idle Lapse</span>
                  <span className="text-[8px] opacity-70">45s Pause</span>
                </button>
                <button
                  id="sandbox-trigger-missed-btn"
                  onClick={() => onTriggerShameFreeReset?.("missed")}
                  className="w-full py-1 text-left px-2 bg-slate-950 hover:bg-slate-900 hover:text-slate-300 border border-slate-900 text-slate-500 rounded cursor-pointer flex items-center justify-between"
                  title="Simulate missing a deep focus interval"
                >
                  <span>Simulate Missed Period</span>
                  <span className="text-[8px] opacity-70">Shift View</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Primary objective checklist with minimalist elements */}
        {/* Right Side: Primary objective checklist with minimalist elements */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-amber-500 tracking-widest font-semibold uppercase">
              Current Mission
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-slate-100 leading-relaxed italic font-medium">
              "{task?.primaryStep || ""}"
            </h3>
          </div>

          {/* Calm Spiral Interrupt Intervention Card */}
          <AnimatePresence>
            {showSpiralInterrupt && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 sm:p-7 space-y-6 relative overflow-hidden backdrop-blur-md ring-1 ring-white/5"
              >
                {/* Decorative sub-glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-slate-950 border border-slate-800 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold">
                      Anti-Perfectionist Guard
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-serif text-white font-black leading-tight">
                    Done for now?
                  </h4>
                  
                  <p className="text-sm sm:text-base font-sans text-slate-300 leading-relaxed font-light">
                    This looks good enough to ship. Should we push it live, or snooze this task for now?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    id="confirm-ship-spiral-btn"
                    type="button"
                    onClick={() => {
                      setShowSpiralInterrupt(false);
                      handleShipTask();
                    }}
                    className="w-full sm:w-1/2 py-3 bg-white hover:bg-slate-200 text-black text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[101%] active:scale-[99%] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Push Live</span>
                  </button>
                  
                  <button
                    id="cancel-spiral-btn"
                    type="button"
                    onClick={() => {
                      setSubStepEditCounts({});
                      setShowSpiralInterrupt(false);
                    }}
                    className="w-full sm:w-1/2 py-3 bg-transparent border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl font-sans text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer text-center"
                  >
                    Snooze
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sub-steps checkboxes */}
          <div className="space-y-4">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-300 font-bold block">
              Milestone Checklist ({completedCount}/{totalSubSteps})
            </span>
            
            <div id="checklist-tasks" className="space-y-2.5">
              {subSteps.map((step) => {
                const isEditingThisStep = editingSubStepId === step.id;
                return (
                  <div
                    key={step.id}
                    id={`checklist-item-${step.id}`}
                    onClick={() => {
                      if (!isEditingThisStep) {
                        handleToggleStep(step.id);
                      }
                    }}
                    className={`group/item flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      step.completed
                        ? "bg-slate-950 border-slate-900 text-slate-500 opacity-80"
                        : "bg-slate-900/45 border-slate-800/80 text-slate-200 hover:border-slate-700/80"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div 
                        onClick={(e) => {
                          if (isEditingThisStep) {
                            e.stopPropagation();
                          }
                        }}
                        className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          step.completed ? "bg-amber-500/20 border-amber-500 text-amber-500" : "border-slate-700"
                        }`}
                      >
                        {step.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                      
                      {isEditingThisStep ? (
                        <input
                          id={`edit-substep-input-${step.id}`}
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              handleSaveEditedSubStep(step.id);
                            } else if (e.key === "Escape") {
                              e.stopPropagation();
                              setEditingSubStepId(null);
                            }
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 flex-1 font-sans font-light"
                          autoFocus
                        />
                      ) : (
                        <span className={`text-xs font-sans leading-relaxed ${step.completed ? "line-through decoration-slate-800" : ""}`}>
                          {step.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {isEditingThisStep ? (
                        <button
                          id={`save-substep-btn-${step.id}`}
                          type="button"
                          onClick={() => handleSaveEditedSubStep(step.id)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline cursor-pointer"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          id={`edit-substep-btn-${step.id}`}
                          type="button"
                          onClick={() => {
                            setEditingSubStepId(step.id);
                            setEditingText(step.text);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 text-slate-500 hover:text-slate-300 transition-opacity p-0.5 rounded cursor-pointer"
                          title="Rewrite/Edit sub-task"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive "Done Enough" trigger indicator */}
          <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3.5">
            <div className="flex items-start justify-between gap-1">
              <div className="flex gap-1.5 text-xs font-mono">
                {isDoneEnoughReached ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Done Enough!
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1/5">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                    Completeness: {completedPercentage}%
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500">Threshold target: {task?.doneEnoughMetric ?? 70}%</span>
            </div>

            {isDoneEnoughReached ? (
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                You have met or exceeded the <strong>{task?.doneEnoughMetric ?? 70}%</strong> "Done Enough" threshold. Finishing now halts the paralysis loops. Leave the remainder today and claim victory.
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 leading-normal font-sans">
                Complete at least {Math.ceil(((task?.doneEnoughMetric ?? 70) / 100) * totalSubSteps)} steps to securely clear the perfectionism firewall threshold.
              </p>
            )}

            <button
              id="ship-sprint-btn"
              onClick={handleShipTask}
              className={`w-full py-2.5 font-mono text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isDoneEnoughReached
                  ? "bg-slate-100 hover:bg-white text-slate-950 font-bold"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isDoneEnoughReached ? "Declare Finished (Ship MVP)" : "I'm Done Enough Already (Override & Stop)"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
