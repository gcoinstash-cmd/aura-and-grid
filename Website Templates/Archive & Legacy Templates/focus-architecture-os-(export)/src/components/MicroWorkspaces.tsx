import React, { useState, useEffect, useRef } from "react";
import { 
  Inbox as InboxIcon, 
  Trash2, 
  Plus, 
  Check, 
  Play, 
  Pause, 
  HelpCircle, 
  Sliders, 
  Layers, 
  Bookmark, 
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";
import { Task, InboxItem, Habit, SubTask, TaskStatus, EnergyLevel, Horizon } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MicroWorkspacesProps {
  tasks: Task[];
  inboxItems: InboxItem[];
  habits: Habit[];
  onToggleHabit: (id: string, dateStr: string) => void;
  onAddTask: (title: string, options?: Partial<Task>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onConvertInboxItem: (item: InboxItem) => void;
  onDeleteInboxItem: (id: string) => void;
  onResetAll?: () => void;
  isShielded?: boolean;
  onShieldedChange?: (shielded: boolean) => void;
  isSecondaryDimmed?: boolean;
  forcedTab?: "inbox" | "now" | "today";
  hideInboxTab?: boolean;
}

export const MicroWorkspaces: React.FC<MicroWorkspacesProps> = ({
  tasks,
  inboxItems,
  habits,
  onToggleHabit,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onConvertInboxItem,
  onDeleteInboxItem,
  onResetAll,
  isShielded: propIsShielded,
  onShieldedChange,
  isSecondaryDimmed = false,
  forcedTab,
  hideInboxTab = false,
}) => {
  // Navigation tab state matching simplified focus planners: Inbox, Now, Today
  const [activeTab, setActiveTab] = useState<"inbox" | "now" | "today">("inbox");

  // Sync forcedTab prop
  useEffect(() => {
    if (forcedTab) {
      setActiveTab(forcedTab);
    }
  }, [forcedTab]);

  // Sync hideInboxTab prop
  useEffect(() => {
    if (hideInboxTab && activeTab === "inbox") {
      setActiveTab("now");
    }
  }, [hideInboxTab, activeTab]);

  // Monk Mode / Shield View state
  const [localShielded, setLocalShielded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_is_shielded");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const isShielded = propIsShielded !== undefined ? propIsShielded : localShielded;

  const setIsShielded = (val: boolean) => {
    if (onShieldedChange) {
      onShieldedChange(val);
    } else {
      setLocalShielded(val);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("focus_planner_is_shielded", String(isShielded));
    } catch (e) {}
  }, [isShielded]);

  // Inputs for quick interactions
  const [quickInputText, setQuickInputText] = useState("");
  const [quickNoteText, setQuickNoteText] = useState("");

  const [notesList, setNotesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_notes");
      return saved ? JSON.parse(saved) : [
        "Focus on one single thing at a time to keep your mind completely clear.",
        "Take regular, quiet breaks to refresh your energy and attention.",
        "Keep your workspace tidy and free of distractions to encourage quiet thinking."
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("focus_planner_notes", JSON.stringify(notesList));
  }, [notesList]);

  // Focus Sounds Synthesis States
  const [playingTracks, setPlayingTracks] = useState<{
    grounding: boolean;
    pulse: boolean;
    waves: boolean;
  }>({
    grounding: false,
    pulse: false,
    waves: false,
  });

  const [trackVolumes, setTrackVolumes] = useState<{
    grounding: number;
    pulse: number;
    waves: number;
  }>({
    grounding: 0.3,
    pulse: 0.3,
    waves: 0.3,
  });

  // Audio nodes cache using useRef to prevent multi-allocation and enable exact cleanup
  const audioContextRef = useRef<AudioContext | null>(null);

  const groundingNodesRef = useRef<{
    osc1?: OscillatorNode;
    osc2?: OscillatorNode;
    noise?: AudioBufferSourceNode;
    filter?: BiquadFilterNode;
    gain?: GainNode;
  }>({});

  const pulseNodesRef = useRef<{
    intervalId?: any;
    gain?: GainNode;
  }>({});

  const wavesNodesRef = useRef<{
    osc?: OscillatorNode;
    lfo?: OscillatorNode;
    lfoGain?: GainNode;
    gain?: GainNode;
  }>({});

  const getAudioContext = () => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const startGrounding = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopGrounding();

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(trackVolumes.grounding, ctx.currentTime);
    trackGain.connect(ctx.destination);
    groundingNodesRef.current.gain = trackGain;

    // 55Hz sub-bass sine wave
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(55, ctx.currentTime);

    // 110Hz detuned low-mid sine wave
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(110.4, ctx.currentTime);

    // Warm, filtered low brown noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.5; 
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    noise.connect(filter);
    filter.connect(trackGain);

    osc1.start();
    osc2.start();
    noise.start();

    groundingNodesRef.current.osc1 = osc1;
    groundingNodesRef.current.osc2 = osc2;
    groundingNodesRef.current.noise = noise;
    groundingNodesRef.current.filter = filter;

    setPlayingTracks(prev => ({ ...prev, grounding: true }));
  };

  const stopGrounding = () => {
    const nodes = groundingNodesRef.current;
    if (nodes.osc1) { try { nodes.osc1.stop(); } catch {} }
    if (nodes.osc2) { try { nodes.osc2.stop(); } catch {} }
    if (nodes.noise) { try { nodes.noise.stop(); } catch {} }
    groundingNodesRef.current = {};
    setPlayingTracks(prev => ({ ...prev, grounding: false }));
  };

  const startPulse = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopPulse();

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(trackVolumes.pulse, ctx.currentTime);
    trackGain.connect(ctx.destination);
    pulseNodesRef.current.gain = trackGain;

    let nextPulseTime = ctx.currentTime;
    const scheduleAheadTime = 0.3;

    const tick = () => {
      while (nextPulseTime < ctx.currentTime + scheduleAheadTime) {
        const timeToSchedule = nextPulseTime;
        const osc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        osc.connect(clickGain);
        clickGain.connect(trackGain);

        osc.type = "sine";
        osc.frequency.setValueAtTime(750, timeToSchedule);
        osc.frequency.exponentialRampToValueAtTime(300, timeToSchedule + 0.05);

        clickGain.gain.setValueAtTime(0.001, timeToSchedule);
        clickGain.gain.exponentialRampToValueAtTime(0.35, timeToSchedule + 0.003);
        clickGain.gain.exponentialRampToValueAtTime(0.001, timeToSchedule + 0.06);

        osc.start(timeToSchedule);
        osc.stop(timeToSchedule + 0.08);

        nextPulseTime += 1.0; 
      }
    };

    tick();
    const id = setInterval(tick, 100);
    pulseNodesRef.current.intervalId = id;

    setPlayingTracks(prev => ({ ...prev, pulse: true }));
  };

  const stopPulse = () => {
    const nodes = pulseNodesRef.current;
    if (nodes.intervalId) {
      clearInterval(nodes.intervalId);
    }
    pulseNodesRef.current = {};
    setPlayingTracks(prev => ({ ...prev, pulse: false }));
  };

  const startWaves = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopWaves();

    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0.5, ctx.currentTime);

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(trackVolumes.waves, ctx.currentTime);

    swellGain.connect(trackGain);
    trackGain.connect(ctx.destination);
    wavesNodesRef.current.gain = trackGain;

    // LFO at 0.05Hz -> 20s swell cycle to pace deep breathing
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.42, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(swellGain.gain);

    // Warm analog synth style triangle waves
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(85, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(85.5, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);

    // Slow modulating lowpass sweep linked to the breathing swell
    const filterModGain = ctx.createGain();
    filterModGain.gain.setValueAtTime(30, ctx.currentTime);
    lfo.connect(filterModGain);
    filterModGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(swellGain);

    lfo.start();
    osc1.start();
    osc2.start();

    wavesNodesRef.current.osc = osc1;
    wavesNodesRef.current.lfo = lfo;
    wavesNodesRef.current.lfoGain = lfoGain;

    setPlayingTracks(prev => ({ ...prev, waves: true }));
  };

  const stopWaves = () => {
    const nodes = wavesNodesRef.current;
    if (nodes.osc) { try { nodes.osc.stop(); } catch {} }
    if (nodes.lfo) { try { nodes.lfo.stop(); } catch {} }
    wavesNodesRef.current = {};
    setPlayingTracks(prev => ({ ...prev, waves: false }));
  };

  const stopAllFocusSounds = () => {
    stopGrounding();
    stopPulse();
    stopWaves();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
  };

  useEffect(() => {
    if (groundingNodesRef.current.gain) {
      groundingNodesRef.current.gain.gain.setValueAtTime(trackVolumes.grounding, audioContextRef.current?.currentTime || 0);
    }
  }, [trackVolumes.grounding]);

  useEffect(() => {
    if (pulseNodesRef.current.gain) {
      pulseNodesRef.current.gain.gain.setValueAtTime(trackVolumes.pulse, audioContextRef.current?.currentTime || 0);
    }
  }, [trackVolumes.pulse]);

  useEffect(() => {
    if (wavesNodesRef.current.gain) {
      wavesNodesRef.current.gain.gain.setValueAtTime(trackVolumes.waves, audioContextRef.current?.currentTime || 0);
    }
  }, [trackVolumes.waves]);

  useEffect(() => {
    return () => {
      stopAllFocusSounds();
    };
  }, []);

  // Focus Sprint Audio Guide States
  const [sprintPlaying, setSprintPlaying] = useState(false);
  const [sprintSeconds, setSprintSeconds] = useState(1500); // 25:00

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (sprintPlaying) {
      interval = setInterval(() => {
        setSprintSeconds((prev) => {
          if (prev <= 1) {
            setSprintPlaying(false);
            return 1500; // Reset after done
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sprintPlaying]);

  // Helper to format remaining seconds to e.g. "25:00"
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleToggleSprint = () => {
    if (sprintPlaying) {
      setSprintPlaying(false);
      // Auto pause if active
      if (playingTracks.waves) {
        stopWaves();
      }
    } else {
      setSprintPlaying(true);
      // Auto activate a relaxing waves audio guide on play
      if (!playingTracks.waves) {
        startWaves();
      }
    }
  };

  // Grouped task filterings using standard labels
  const inboxTasksList = tasks.filter(t => t.status === TaskStatus.INBOX && !t.completed);
  
  const easyTasksList = tasks.filter(
    t => (t.energy === EnergyLevel.LOW_BATTERY) && !t.completed
  );

  const deepWorkList = tasks.filter(
    t => (t.energy === EnergyLevel.HIGH_CHARGE) && !t.completed
  ).slice(0, 3); // Max 3 items to avoid cluttering your workspace

  // Date formats
  const todayStr = new Date().toISOString().split("T")[0];

  const handleAddQuickItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInputText.trim()) return;

    if (activeTab === "inbox") {
      onAddTask(quickInputText.trim(), {
        status: TaskStatus.INBOX,
        energy: EnergyLevel.LOW_BATTERY,
      });
    } else if (activeTab === "today") {
      onAddTask(quickInputText.trim(), {
        status: TaskStatus.NEXT_UP,
        energy: EnergyLevel.LOW_BATTERY,
      });
    } else if (activeTab === "now") {
      onAddTask(quickInputText.trim(), {
        status: TaskStatus.IN_PROGRESS,
        energy: EnergyLevel.HIGH_CHARGE,
      });
    }

    setQuickInputText("");
  };

  const handleMinimalistCleanup = () => {
    if (!quickNoteText.trim()) return;
    
    // Split text into individual lines
    const lines = quickNoteText.split("\n");
    
    // Process each line
    const cleanedLines = lines
      .map((line) => {
        let trimmed = line.trim();
        if (!trimmed) return "";
        
        // Strip out common filler words (case insensitive, whole words)
        const fillerWords = [
          /\bbasically\b/gi,
          /\bactually\b/gi,
          /\bhonestly\b/gi,
          /\bliterally\b/gi,
          /\breally\b/gi,
          /\babsolutely\b/gi,
          /\btotally\b/gi,
          /\bjust\b/gi,
          /\bkind of\b/gi,
          /\bsort of\b/gi,
        ];
        
        let processed = trimmed;
        fillerWords.forEach((regex) => {
          processed = processed.replace(regex, "");
        });
        
        // Clean up redundant internal spaces after removing words
        processed = processed.replace(/\s+/g, " ").trim();
        
        if (!processed) return "";
        
        // Strip existing leading bullet points/hyphens to avoid duplicates
        processed = processed.replace(/^[\s\-\—\*\•\+\>]+/g, "").trim();
        
        if (!processed) return "";
        
        // Capitalize first letter of the line
        processed = processed.charAt(0).toUpperCase() + processed.slice(1);
        
        // Prefix with elegant minimalist bullet (—)
        return `— ${processed}`;
      })
      .filter((line) => line !== "");
      
    setQuickNoteText(cleanedLines.join("\n"));
  };

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    setNotesList([quickNoteText.trim(), ...notesList]);
    setQuickNoteText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-8 md:pt-12 border-t border-stone-900/25 space-y-8" id="secondary-sections-container">
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => setIsShielded(!isShielded)}
          className={`flex items-center space-x-1.5 tracking-wide text-xs font-sans font-medium px-2.5 py-1 rounded border transition-all duration-500 ease-[0.16,1,0.3,1] cursor-pointer ${
            isShielded 
              ? "bg-[#C5A85C]/10 text-[#C5A85C] border-[#C5A85C]/35 hover:bg-[#C5A85C]/15" 
              : "text-stone-500 border-stone-700/40 hover:text-stone-300 hover:border-stone-600"
          }`}
          title={isShielded ? "Return to default view" : "Enter Focus Mode"}
          id="shield-view-toggle"
        >
          {isShielded ? <EyeOff size={11} /> : <Eye size={11} />}
          <span>{isShielded ? "Focus active" : "Focus mode"}</span>
        </button>
      </div>
      {/* FLAT MINIMAL TAB NAVIGATION */}
      <div className="flex border-b border-stone-900/15 justify-between items-center py-2 overflow-x-auto scroller-none gap-2" id="flat-tab-navigation">
        <div className="flex space-x-6 flex-nowrap overflow-x-auto">
          {(["inbox", "now", "today"] as const)
            .filter((tab) => !(hideInboxTab && tab === "inbox"))
            .map((tab) => {
            const inboxCount = inboxItems.length + inboxTasksList.length;
            const nowCount = deepWorkList.length;
            const todayCount = easyTasksList.length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-sans tracking-wide pb-3 relative cursor-pointer transition-all duration-300 ease-out flex items-center space-x-1.5 px-0.5 ${
                  activeTab === tab
                    ? isSecondaryDimmed
                      ? "text-stone-400/40 font-medium pointer-events-none"
                      : "text-stone-300 font-medium scale-[1.01]"
                    : isSecondaryDimmed
                      ? "text-stone-600 opacity-20 pointer-events-none"
                      : "text-stone-500 hover:text-stone-300 hover:translate-y-[-0.5px]"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                {tab === "inbox" && (
                  <>
                    <span>Inbox</span>
                    {inboxCount > 0 && (
                      <span className="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded-full bg-stone-900 border border-stone-850 text-[#C5A85C] font-semibold animate-pulse" style={{ animationDuration: "3s" }}>
                        {inboxCount}
                      </span>
                    )}
                  </>
                )}
                {tab === "now" && (
                  <>
                    <span>Focus Mode</span>
                    {nowCount > 0 && (
                      <span className="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded-full bg-stone-900 border border-stone-850 text-stone-400">
                        {nowCount}
                      </span>
                    )}
                  </>
                )}
                {tab === "today" && (
                  <>
                    <span>Today</span>
                    {todayCount > 0 && (
                      <span className="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded-full bg-stone-900 border border-stone-850 text-stone-400">
                        {todayCount}
                      </span>
                    )}
                  </>
                )}
                
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A85C]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className={`pt-10 md:pt-14 pb-4 transition-all duration-500 ease-[0.16,1,0.3,1] ${isSecondaryDimmed ? "opacity-20 pointer-events-none select-none" : "opacity-100"}`} id="active-tab-panel">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INBOX */}
          {activeTab === "inbox" && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-8 text-left"
            >
              <div className="flex justify-between items-start border-b border-stone-900/35 pb-4">
                <div className="flex flex-col space-y-1 text-left">
                  <h3 className="font-serif text-lg text-stone-200 font-light tracking-tight">Open Loops</h3>
                  <p className="text-xs text-stone-400 font-sans font-light max-w-sm md:max-w-md">A temporary repository for peripheral thoughts. Clear your mental bandwidth so you can return to deep execution.</p>
                </div>
                {inboxItems.length > 0 && onResetAll && (
                  <button
                    onClick={onResetAll}
                    className="text-[10px] font-mono uppercase tracking-wider bg-stone-950 border border-stone-900/60 hover:border-stone-700 text-stone-400 hover:text-stone-250 transition-all px-3 py-1.5 rounded-sm shrink-0 cursor-pointer"
                  >
                    Clear All Loops
                  </button>
                )}
              </div>

              <div className="space-y-6 pt-2">
                {inboxItems.length > 0 && (
                  <div className="space-y-3">
                    <span className={`text-xs font-serif italic text-stone-500 block transition-all duration-500 ${isShielded ? "opacity-20" : "opacity-100"}`}>
                      currently holding
                    </span>
                    <div className="space-y-1">
                      {inboxItems.map((item) => (
                        <div
                          key={item.id}
                          className="group flex justify-between items-center py-4 border-b border-stone-900/15 text-stone-300 text-sm hover:text-stone-100 transition-all duration-500 ease-[0.16,1,0.3,1]"
                        >
                          <span className="text-stone-300 group-hover:text-stone-200 font-sans tracking-wide leading-relaxed">
                            {item.content}
                          </span>
                          <div className="flex items-center space-x-3 shrink-0">
                            <button
                              onClick={() => onConvertInboxItem(item)}
                              className="text-[11px] font-sans tracking-wide text-[#C5A85C] hover:text-stone-100 hover:border-[#C5A85C]/65 bg-stone-950/80 border border-[#C5A85C]/35 px-2 py-1 md:py-0.5 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] cursor-pointer"
                            >
                              Move to focus
                            </button>
                            <button
                              onClick={() => onDeleteInboxItem(item.id)}
                              className="text-stone-500 hover:text-rose-400 p-1 md:p-0.5 bg-stone-900 border border-stone-800 hover:border-rose-900/40 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STANDARD INBOX TASKS */}
                {inboxTasksList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className={`text-xs font-serif italic text-stone-500 block transition-all duration-500 ${isShielded ? "opacity-20" : "opacity-100"}`}>
                      queued for sorting
                    </span>
                    <div className="space-y-1">
                      {inboxTasksList.map((task) => (
                        <div
                          key={task.id}
                          className="group flex justify-between items-center py-4 border-b border-stone-900/15 text-stone-300 text-sm hover:text-stone-100 transition-all duration-500 ease-[0.16,1,0.3,1]"
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => onUpdateTask({ ...task, completed: true })}
                              className="w-4 h-4 rounded-sm bg-stone-950 border-stone-850 text-[#C5A85C] focus:ring-0 cursor-pointer transition-colors"
                            />
                            <span className="text-stone-300 group-hover:text-stone-200 font-sans tracking-wide">
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => onUpdateTask({ ...task, status: TaskStatus.IN_PROGRESS })}
                            className="text-[11px] font-sans tracking-wide text-stone-400 hover:text-[#C5A85C] hover:border-[#C5A85C]/35 bg-stone-900 border border-stone-850 px-2 py-1 md:py-0.5 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 md:opacity-0 md:group-hover:opacity-100 shrink-0 cursor-pointer"
                          >
                            Move to focus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRESTIGE SERIF EMPTY STATE */}
                {inboxItems.length === 0 && inboxTasksList.length === 0 && (
                  <div className={`py-16 md:py-20 px-8 bg-gradient-to-b from-[#151515]/35 to-[#0b0b0b]/35 border border-dashed border-[#282828]/60 rounded-sm flex flex-col items-center justify-center text-center space-y-4 shadow-lg transition-all duration-500 ease-[0.16,1,0.3,1] ${isShielded ? "opacity-20" : "opacity-100"}`} id="inbox-perfect-clear-state">
                    <div className="relative flex items-center justify-center w-8 h-8">
                      <div className="absolute inset-0 rounded-full bg-[#C5A85C]/5 blur-lg animate-pulse" style={{ animationDuration: '4000ms' }} />
                      <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-[#C5A85C]/75 animate-ping" style={{ animationDuration: '3000ms' }} />
                      <span className="absolute inline-block w-2.5 h-2.5 rounded-full bg-[#C5A85C]" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-serif italic text-stone-150 text-xl md:text-2xl font-light tracking-wide max-w-lg mx-auto">
                        Your mind is completely clear. Deep breath.
                      </p>
                      <p className="text-[11px] font-sans text-stone-400 tracking-[0.15em] uppercase font-light">
                        All objectives routed. Ready for mindful execution.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK CAPTURE ADDER IN TAB */}
              <form onSubmit={handleAddQuickItem} className={`flex gap-4 border-b border-stone-700/40 pb-5 transition-all duration-500 ${isShielded ? "opacity-15 pointer-events-none select-none" : "opacity-100"}`}>
                <input
                  type="text"
                  value={quickInputText}
                  onChange={(e) => setQuickInputText(e.target.value)}
                  placeholder="Type a thought, task, or reminder..."
                  className="flex-1 bg-transparent border-none text-sm text-stone-300 tracking-wide focus:outline-none focus:ring-0 px-0 placeholder-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!quickInputText.trim()}
                  className="text-xs font-sans font-medium text-stone-500 hover:text-stone-300 disabled:text-stone-700 transition-colors"
                >
                  Save for later
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: NOW (Focus on Deep Work) */}
          {activeTab === "now" && (
            <motion.div
              key="now"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col space-y-1 text-left border-b border-stone-900/35 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C5A85C]/75">Deep Work Canvas</span>
                <h3 className="font-serif text-lg text-stone-200 font-light tracking-tight">Singular Focus</h3>
                <p className="text-xs text-stone-400 font-sans font-light">Establish your cornerstone intentions. Dedicate your undivided focus to a single point of progress.</p>
              </div>

              <div className="space-y-6 pt-2">
                <span className={`text-[10px] font-mono tracking-wider uppercase text-stone-500 block transition-all duration-500 ${isShielded ? "opacity-20" : "opacity-100"}`}>
                  Active deep work
                </span>
                <div className="space-y-1">
                  {deepWorkList.length > 0 ? (
                    deepWorkList.map((task) => (
                      <div
                        key={task.id}
                        className="group flex justify-between items-center py-5 text-stone-300 text-sm hover:text-stone-100 transition-all duration-500 ease-[0.16,1,0.3,1] border-b border-stone-900/15"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onUpdateTask({ ...task, completed: true })}
                            className="w-4 h-4 rounded-sm bg-stone-950 border-stone-850 text-[#C5A85C] focus:ring-0 cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-stone-300 group-hover:text-stone-200 font-sans tracking-wide block">
                              {task.title}
                            </span>
                            {task.notes && (
                              <p className="text-xs text-stone-400/80 italic">
                                “{task.notes}”
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onUpdateTask({ ...task, status: TaskStatus.IN_PROGRESS })}
                          className="text-[11px] font-sans tracking-wide text-stone-400 hover:text-[#C5A85C] hover:border-[#C5A85C]/35 bg-stone-900 border border-stone-850 px-2 py-1 md:py-0.5 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 md:opacity-0 md:group-hover:opacity-100 shrink-0 cursor-pointer"
                        >
                          Move to focus
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className={`py-12 px-6 border border-dashed border-stone-850/40 rounded flex flex-col items-center justify-center text-center space-y-2 transition-all duration-500 ease-[0.16,1,0.3,1] ${isShielded ? "opacity-20" : "opacity-100"}`}>
                      <p className="font-serif italic text-base text-stone-300 font-light flex items-center justify-center gap-2">
                        Your mind is completely clear.
                        <span 
                          className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" 
                          style={{ animationDuration: "3000ms" }}
                        />
                      </p>
                      <p className="text-xs font-sans text-stone-500 tracking-wide">No active deep work targets registered. Define a strategic focus above.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* QUICK DEEP ADDER IN TAB */}
              <form onSubmit={handleAddQuickItem} className={`flex gap-4 border-b border-stone-700/40 pb-5 transition-all duration-500 ${isShielded ? "opacity-15 pointer-events-none select-none" : "opacity-100"}`}>
                <input
                  type="text"
                  value={quickInputText}
                  onChange={(e) => setQuickInputText(e.target.value)}
                  placeholder="Define an intensive objective (e.g., system design, tactical drafting)..."
                  className="flex-1 bg-transparent border-none text-sm text-stone-200 tracking-wide focus:outline-none focus:ring-0 px-0 placeholder-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!quickInputText.trim()}
                  className="text-xs font-sans font-medium text-[#C5A85C] hover:text-stone-100 disabled:text-stone-600 transition-colors"
                >
                  Add deep work
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 3: TODAY (Easy Tasks + Habits checklist) */}
          {activeTab === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-8 text-left"
            >
              <div className="flex flex-col space-y-1 text-left border-b border-stone-900/35 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C5A85C]/75">Rituals & Habits</span>
                <h3 className="font-serif text-lg text-stone-200 font-light tracking-tight">Daily Anchors</h3>
                <p className="text-xs text-stone-400 font-sans font-light">A curated collection of small supportive habits and routine checklist tasks to anchor your focal window.</p>
              </div>

              {/* SECTION A: EASY TASKS */}
              <div className="space-y-6">
                <div className={`transition-all duration-500 ${isShielded ? "opacity-20 select-none pointer-events-none" : ""}`}>
                  <h4 className="font-serif text-base font-light text-stone-200 tracking-tighter">Simple tasks</h4>
                  <p className="text-xs text-stone-400 font-sans tracking-wide mt-1 font-light">
                    Quick tasks and checklists to handle during transition times.
                  </p>
                </div>

                <div className="space-y-1 pt-2">
                  {easyTasksList.length > 0 ? (
                    easyTasksList.map((task) => (
                      <div
                        key={task.id}
                        className="group flex justify-between items-center py-4 border-b border-stone-850/30 text-stone-300 text-sm hover:text-stone-100 transition-all duration-500 ease-[0.16,1,0.3,1]"
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onUpdateTask({ ...task, completed: true })}
                            className="w-4 h-4 rounded-sm bg-stone-950 border-stone-850 text-[#C5A85C] focus:ring-0 cursor-pointer"
                          />
                          <span className="text-stone-300 group-hover:text-stone-200 font-sans tracking-wide">{task.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500 bg-stone-900 border border-stone-850 px-2 py-0.5 rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1] font-light">
                          Simple task
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={`py-12 px-6 border border-dashed border-[#282828]/60 rounded-sm flex flex-col items-center justify-center text-center space-y-2 transition-all duration-500 ease-[0.16,1,0.3,1] ${isShielded ? "opacity-20" : ""}`}>
                      <p className="font-serif italic text-base text-stone-300 font-light flex items-center justify-center gap-2">
                        Your mind is completely clear.
                        <span 
                          className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" 
                          style={{ animationDuration: "3000ms" }}
                        />
                      </p>
                      <p className="text-xs font-sans text-stone-500 tracking-wide">No simple tasks scheduled for this cycle.</p>
                    </div>
                  )}
                </div>

                {/* QUICK EASY ADDER IN TAB */}
                <form onSubmit={handleAddQuickItem} className={`flex gap-4 border-b border-[#282828]/50 pb-5 transition-all duration-500 ${isShielded ? "opacity-15 pointer-events-none select-none" : "opacity-100"}`}>
                  <input
                    type="text"
                    value={quickInputText}
                    onChange={(e) => setQuickInputText(e.target.value)}
                    placeholder="Type a quick task or checklist item..."
                    className="flex-1 bg-transparent border-none text-sm text-stone-300 tracking-wide focus:outline-none focus:ring-0 px-0 placeholder-zinc-400"
                  />
                  <button
                    type="submit"
                    disabled={!quickInputText.trim()}
                    className="text-xs font-sans font-medium text-[#C5A85C] hover:text-stone-100 disabled:text-stone-600 transition-colors"
                  >
                    Add simple task
                  </button>
                </form>
              </div>

              {/* SECTION B: HABITS (RITUALS) */}
              <div className="pt-8 border-t border-stone-700/20 space-y-6">
                <div className={`transition-all duration-500 ${isShielded ? "opacity-20 select-none pointer-events-none" : ""}`}>
                  <h4 className="font-serif text-lg font-light text-stone-200 tracking-tighter">Daily Habits</h4>
                  <p className="text-sm text-stone-400 font-sans tracking-wide mt-2 font-light">
                    Simple habits to anchor your routine & maintain a calm mindset throughout the day.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 pt-2">
                  {habits.map((habit) => {
                    const completed = !!habit.completedDays[todayStr];
                    return (
                      <div
                        key={habit.id}
                        onClick={() => onToggleHabit(habit.id, todayStr)}
                        className={`flex items-center space-x-4 py-4.5 cursor-pointer transition-all duration-500 ease-[0.16,1,0.3,1] ${
                          completed ? "text-stone-400/60 line-through" : "text-stone-300 hover:text-stone-100"
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-all duration-500 ease-[0.16,1,0.3,1] ${
                          completed ? "bg-[#C5A85C]/15 border-[#C5A85C] text-[#C5A85C]" : "border-stone-850 bg-stone-950"
                        }`}>
                          {completed && <Check size={8} />}
                        </div>
                        <span className="text-xs font-sans tracking-wide flex-1">{habit.title}</span>
                        <span className="text-xs font-sans text-stone-400 w-24 text-right font-light">
                          {habit.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: MORE (Sort Tasks, Notes Scratchpad, Focus Sounds) */}
          {activeTab === "more" && (
            <motion.div
              key="more"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-12 text-left"
            >
              <div className="flex flex-col space-y-1 text-left border-b border-stone-900/35 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C5A85C]/75">Ambient Space</span>
                <h3 className="font-serif text-lg text-stone-200 font-light tracking-tight">Resonance & Harmony</h3>
                <p className="text-xs text-stone-400 font-sans font-light">Create a gentle acoustic backdrop with custom-synthesized focus tones, ambient guides, or interactive sonic resonances.</p>
              </div>

              {/* SECTION A: FOCUS SOUNDS SYNTHESISER */}
              <div className="space-y-8">
                {/* FOCUS SPRINT AUDIO GUIDE */}
                <div className="space-y-4 pb-6 border-b border-[#1f1f1f]/60">
                   <div>
                     <span className={`text-xs font-sans font-medium text-stone-500 block mb-1 transition-all duration-500 ${isShielded ? "text-stone-500 opacity-20" : ""}`}>
                       Deep focus timer & ambient guide
                     </span>
                     <p className={`text-sm text-stone-300 font-sans tracking-wide leading-relaxed transition-all duration-500 ${isShielded ? "opacity-20 select-none" : "opacity-100"}`}>
                       A minimalist focus timer with soft ambient waves to help you pace through deep work intervals and clear your thoughts.
                     </p>
                   </div>
 
                   {/* INLINE MEDIA CONTROLLER ROW */}
                   <div className="flex flex-col sm:flex-row items-center gap-6 py-4 px-5 bg-stone-900/40 border border-stone-700/20 rounded-md">
                     {/* PLAYBACK TOGGLE */}
                     <button
                       onClick={handleToggleSprint}
                       className={`flex items-center justify-center space-x-2 px-5 py-2.5 border rounded transition-all cursor-pointer min-w-[120px] shrink-0 text-xs font-sans ${
                         sprintPlaying
                           ? "bg-[#C5A85C] text-stone-950 border-[#C5A85C] font-semibold h-9 focus:ring-0"
                           : "bg-transparent border-[#C5A85C]/60 text-amber-200 hover:bg-[#C5A85C]/10 h-9"
                       }`}
                     >
                       {sprintPlaying ? (
                         <>
                           <Pause size={12} className="text-stone-950 fill-stone-950" />
                           <span>Pause Sprint</span>
                         </>
                       ) : (
                         <>
                           <Play size={12} className="text-amber-200 fill-amber-200/10" />
                           <span>Start Sprint</span>
                         </>
                       )}
                     </button>
 
                     {/* PROGRESS BAR TRACK & TIME */}
                     <div className="flex-1 w-full space-y-2">
                       <div className="flex justify-between items-center text-xs font-sans">
                         <span className={`transition-colors font-medium text-xs font-sans ${sprintPlaying ? "text-[#C5A85C]" : "text-stone-500"}`}>
                           {sprintPlaying ? "Deep focus timer running" : "Focus timer currently idle"}
                         </span>
                         <span className="text-stone-300 font-mono tracking-wider">{formatTime(sprintSeconds)}</span>
                       </div>
 
                       {/* MINIMALIST PROGRESS TRACK */}
                       <div className="relative w-full h-[3px] bg-stone-700 rounded-full overflow-hidden">
                         <div
                           className="absolute left-0 top-0 h-full bg-amber-200 transition-all duration-1000 ease-linear rounded-full"
                           style={{ width: `${((1500 - sprintSeconds) / 1500) * 100}%` }}
                         />
                       </div>
                     </div>
                   </div>
                 </div>
 
                 {/* INDIVIDUAL CALMING FOCUS WAVES */}
                 <div className="space-y-4">
                   <div className={`transition-all duration-500 ${isShielded ? "opacity-20 select-none pointer-events-none" : ""}`}>
                     <h4 className="font-serif text-lg font-light text-stone-200">Ambient background sounds</h4>
                     <p className="text-sm text-stone-500 font-sans tracking-wide mt-1 font-light">
                       Calming, synthesizer-generated waves playing directly in your browser to mask atmospheric background noise.
                     </p>
                   </div>
                 </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "grounding" as const,
                      name: "Grounding Hum",
                      desc: "A low, comforting hum to soothe busy thoughts and mask distracting noise.",
                      start: startGrounding,
                      stop: stopGrounding,
                    },
                    {
                      id: "pulse" as const,
                      name: "Steady Breath Tempo",
                      desc: "A soft, rhythmic beat that helps anchor your focus pace.",
                      start: startPulse,
                      stop: stopPulse,
                    },
                    {
                      id: "waves" as const,
                      name: "Gentle Breath Swell",
                      desc: "A soft rise and fall of sound styled after deep breathing to relax your awareness.",
                      start: startWaves,
                      stop: stopWaves,
                    },
                  ].map((track) => {
                    const isPlaying = playingTracks[track.id];
                    const volume = trackVolumes[track.id];

                    return (
                      <div
                        key={track.id}
                        className="p-4 bg-stone-900/60 border border-stone-700/30 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-stone-700/60"
                      >
                        <div className="space-y-1 max-w-sm">
                          <h4 className={`text-sm font-sans font-medium tracking-wide ${isPlaying ? "text-[#C5A85C]" : "text-stone-300"}`}>
                            {track.name}
                          </h4>
                          <p className="text-xs text-stone-300 font-sans tracking-wide leading-relaxed">
                            {track.desc}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 min-w-[180px]" id={`controls-${track.id}`}>
                          <button
                            onClick={() => {
                              if (isPlaying) {
                                track.stop();
                              } else {
                                track.start();
                              }
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                              isPlaying
                                ? "bg-[#C5A85C]/15 border-[#C5A85C] text-[#C5A85C] hover:bg-[#C5A85C]/20"
                                : "bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-600 hover:text-stone-100"
                            }`}
                            aria-label={isPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
                          >
                            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-stone-350">
                              <span>Volume</span>
                              <span>{Math.round(volume * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.0"
                              max="1.0"
                              step="0.05"
                              value={volume}
                              onChange={(e) => {
                                const newVol = parseFloat(e.target.value);
                                setTrackVolumes((prev) => ({ ...prev, [track.id]: newVol }));
                              }}
                              className="w-full accent-[#C5A85C] h-[2px] bg-stone-950 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: HORIZON PLANNER */}
              <div className="pt-8 border-t border-stone-700/30 space-y-4">
                <div className={`transition-all duration-500 ${isShielded ? "opacity-20 select-none pointer-events-none" : ""}`}>
                  <h4 className="font-serif text-lg font-light text-stone-200 tracking-tighter">Temporal horizons</h4>
                  <p className="text-sm text-stone-400 font-sans tracking-wide mt-1 font-light">
                    Deploy priorities across intentional temporal stages: immediate flow, next-in-line sequence, or future preservation.
                  </p>
                </div>

                <div className="space-y-6">
                  {[Horizon.NOW, Horizon.NEXT, Horizon.LATER].map((horizon) => {
                    const horizonTasks = tasks.filter((t) => t.horizon === horizon && !t.completed);
                    return (
                      <div key={horizon} className="space-y-3">
                        <span className={`text-xs font-sans font-medium text-stone-405 block border-b border-stone-800/40 pb-2 transition-all duration-500 ${isShielded ? "opacity-20" : ""}`}>
                          {horizon === Horizon.NOW ? "Immediate flow" : horizon === Horizon.NEXT ? "Sequential queue" : "Future horizons"}
                        </span>
                        <div className="space-y-1">
                          {horizonTasks.length > 0 ? (
                            horizonTasks.map((task) => (
                              <div
                                key={task.id}
                                className="group flex justify-between items-center py-5 text-sm text-stone-300 hover:text-stone-100 transition-all duration-500 ease-[0.16,1,0.3,1]"
                              >
                                <span className="font-sans tracking-wide group-hover:text-stone-200">{task.title}</span>
                                <div className="flex items-center space-x-3 shrink-0">
                                  <button
                                    onClick={() => {
                                      const nextScale =
                                        task.horizon === Horizon.NOW
                                          ? Horizon.NEXT
                                          : task.horizon === Horizon.NEXT
                                            ? Horizon.LATER
                                            : Horizon.NOW;
                                      onUpdateTask({ ...task, horizon: nextScale });
                                    }}
                                    className="text-[11px] font-sans tracking-wide text-stone-400 hover:text-[#C5A85C] hover:border-[#C5A85C]/35 bg-stone-900 border border-stone-850 px-2 py-1 md:py-0.5 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                                  >
                                    Cycle
                                  </button>
                                  <button
                                    onClick={() => onDeleteTask(task.id)}
                                    className="text-stone-500 hover:text-rose-400 p-1 md:p-0.5 bg-stone-900 border border-stone-800 hover:border-rose-900/40 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={`py-4 text-xs font-sans text-stone-500 italic transition-all duration-500 ${isShielded ? "opacity-20" : ""}`}>
                              No tasks in this segment
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: SCRATCHPAD LOG */}
              <div className="pt-8 border-t border-stone-700/30 space-y-4">
                <div className={`transition-all duration-500 ${isShielded ? "opacity-20 select-none pointer-events-none" : ""}`}>
                  <h4 className="font-serif text-lg font-light text-stone-200 tracking-tighter">Quick Notes</h4>
                  <p className="text-sm text-stone-400 font-sans tracking-wide mt-1 font-light">
                    A simple notepad for keeping temporary references, raw thoughts, and reminders.
                  </p>
                </div>

                <form onSubmit={handleAddQuickNote} className={`space-y-4 transition-all duration-500 ${isShielded ? "opacity-15 pointer-events-none select-none" : ""}`}>
                  <textarea
                    value={quickNoteText}
                    onChange={(e) => setQuickNoteText(e.target.value)}
                    placeholder="Scribble quick notes, links, or draft ideas here..."
                    rows={3}
                    className="w-full bg-stone-950/45 border border-stone-850 rounded-sm p-3.5 text-xs focus:outline-none focus:border-[#C5A85C]/40 text-stone-200 placeholder-stone-600 font-sans tracking-wide leading-relaxed"
                  />
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button
                      type="submit"
                      className="text-[10px] font-mono tracking-wider uppercase text-stone-400 hover:text-stone-200 transition-all cursor-pointer bg-stone-900/60 hover:bg-stone-900 border border-stone-850 px-3.5 py-2 rounded-sm"
                    >
                      Save Note
                    </button>
                    <button
                      type="button"
                      onClick={handleMinimalistCleanup}
                      className="text-[10px] font-mono tracking-wider uppercase border border-stone-850/60 rounded-sm px-3.5 py-2 text-stone-500 hover:text-[#C5A85C] hover:border-[#C5A85C]/30 transition-all cursor-pointer bg-transparent hover:bg-stone-900/15"
                      id="minimalist-cleanup-btn"
                    >
                      Minimalist Cleanup
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {notesList.map((note, idx) => (
                    <div key={idx} className="p-3 bg-stone-900/40 border border-stone-750 rounded-sm text-xs text-stone-300 font-sans leading-relaxed flex justify-between items-start animate-fade-in">
                      <span className="flex-1 pr-4">{note}</span>
                      <button
                        onClick={() => {
                          const updateNotes = notesList.filter((_, i) => i !== idx);
                          setNotesList(updateNotes);
                        }}
                        className="text-stone-500 hover:text-rose-450 font-sans text-xs transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
