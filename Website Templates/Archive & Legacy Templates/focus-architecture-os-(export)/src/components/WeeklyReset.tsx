import React, { useState, useEffect } from "react";
import { Task, InboxItem, Habit, TaskStatus, EnergyLevel, Horizon } from "../types";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  HelpCircle,
  MessageSquareCode,
  PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WeeklyResetProps {
  tasks: Task[];
  inboxItems: InboxItem[];
  habits: Habit[];
  onAddTask: (title: string, options?: Partial<Task>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onConvertInboxItem: (item: InboxItem) => void;
  onDeleteInboxItem: (id: string) => void;
  onAddInboxItem: (content: string) => void;
  onExportWorkspace: () => void;
  onResetHabitsForNewCycle: () => void;
  onClearCompletedTasks: () => void;
}

export const WeeklyReset: React.FC<WeeklyResetProps> = ({
  tasks,
  inboxItems,
  habits,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onConvertInboxItem,
  onDeleteInboxItem,
  onAddInboxItem,
  onExportWorkspace,
  onResetHabitsForNewCycle,
  onClearCompletedTasks,
}) => {
  // Current Active Wizard Step (1: Mind Dump, 2: Process Loops, 3: Anchors, 4: Reflections, 5: Export & Complete)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Reflective Prompts State
  const [reflectiveRight, setReflectiveRight] = useState(() => 
    localStorage.getItem("weekly_reset_reflective_right") || ""
  );
  const [reflectiveLever, setReflectiveLever] = useState(() => 
    localStorage.getItem("weekly_reset_reflective_lever") || ""
  );

  // Step Completion states
  const [step1Completed, setStep1Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("weekly_reset_step_1") === "true";
    } catch { return false; }
  });
  const [step2Completed, setStep2Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("weekly_reset_step_2") === "true";
    } catch { return false; }
  });
  const [step3Completed, setStep3Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("weekly_reset_step_3") === "true";
    } catch { return false; }
  });
  const [step4Completed, setStep4Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("weekly_reset_step_4") === "true";
    } catch { return false; }
  });
  const [step5Completed, setStep5Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("weekly_reset_step_5") === "true";
    } catch { return false; }
  });

  // Dump input for Step 1
  const [mindDumpInput, setMindDumpInput] = useState("");
  const [mindDumpedItems, setMindDumpedItems] = useState<string[]>([]);

  // Step 3 non-negotiable anchors inputs
  const [anchor1, setAnchor1] = useState(() => localStorage.getItem("weekly_reset_anchor_1") || "");
  const [anchor2, setAnchor2] = useState(() => localStorage.getItem("weekly_reset_anchor_2") || "");
  const [anchor3, setAnchor3] = useState(() => localStorage.getItem("weekly_reset_anchor_3") || "");

  // Tracks session reset completion count
  const [resetHistory, setResetHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("weekly_reset_history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [showCelebration, setShowCelebration] = useState(false);

  // Sync state values to localStorage
  useEffect(() => {
    localStorage.setItem("weekly_reset_step_1", String(step1Completed));
  }, [step1Completed]);
  useEffect(() => {
    localStorage.setItem("weekly_reset_step_2", String(step2Completed));
  }, [step2Completed]);
  useEffect(() => {
    localStorage.setItem("weekly_reset_step_3", String(step3Completed));
  }, [step3Completed]);
  useEffect(() => {
    localStorage.setItem("weekly_reset_step_4", String(step4Completed));
  }, [step4Completed]);
  useEffect(() => {
    localStorage.setItem("weekly_reset_step_5", String(step5Completed));
  }, [step5Completed]);

  useEffect(() => {
    localStorage.setItem("weekly_reset_anchor_1", anchor1);
    localStorage.setItem("weekly_reset_anchor_2", anchor2);
    localStorage.setItem("weekly_reset_anchor_3", anchor3);
  }, [anchor1, anchor2, anchor3]);

  useEffect(() => {
    localStorage.setItem("weekly_reset_reflective_right", reflectiveRight);
    localStorage.setItem("weekly_reset_reflective_lever", reflectiveLever);
  }, [reflectiveRight, reflectiveLever]);

  // Action for step 1
  const handleAddMindDump = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mindDumpInput.trim()) return;
    
    // Add item as an open loop
    onAddInboxItem(mindDumpInput.trim());
    setMindDumpedItems([mindDumpInput.trim(), ...mindDumpedItems]);
    setMindDumpInput("");
    setStep1Completed(true);
  };

  // Convert or archive in step 2
  const handleProcessInboxItem = (item: InboxItem) => {
    onConvertInboxItem(item);
  };

  const handleArchiveInboxItem = (id: string) => {
    onDeleteInboxItem(id);
  };

  // Check if step 2 is automatically completed when inbox becomes 0
  useEffect(() => {
    if (inboxItems.length === 0 && mindDumpedItems.length > 0) {
      setStep2Completed(true);
    }
  }, [inboxItems, mindDumpedItems]);

  const handleTriggerVaultDownload = () => {
    onExportWorkspace();
    setStep5Completed(true);
  };

  // Complete Reset Celebration & Real State Mutations
  const handleResetWorkspaceNewCycle = () => {
    // 1. Clear completed tasks
    onClearCompletedTasks();
    // 2. Clear habit completes daily status
    onResetHabitsForNewCycle();
    // 3. Clear reset steps
    setStep1Completed(false);
    setStep2Completed(false);
    setStep3Completed(false);
    setStep4Completed(false);
    setStep5Completed(false);
    setMindDumpedItems([]);
    setAnchor1("");
    setAnchor2("");
    setAnchor3("");
    setReflectiveRight("");
    setReflectiveLever("");
    setActiveStep(1);
    
    // Track completion in history
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const updatedHistory = [dateStr, ...resetHistory].slice(0, 5);
    setResetHistory(updatedHistory);
    localStorage.setItem("weekly_reset_history", JSON.stringify(updatedHistory));

    // Show visual celebratory overlay
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  // Progress calculations
  const stepsList = [
    { num: 1, label: "Clear the Mind", desc: "Dump raw cognitive feedback loops" },
    { num: 2, label: "Zero Open Loops", desc: "Process inbox to structured horizons" },
    { num: 3, label: "Horizon Alignment", desc: "Review scale and commit 3 anchors" },
    { num: 4, label: "Reflective Inquiry", desc: "Inquire priorities and insights" },
    { num: 5, label: "Sovereign Sync", desc: "Export archive and refresh cycle" }
  ];

  const overallProgressPercent = Math.round(
    ([step1Completed, step2Completed, step3Completed, step4Completed, step5Completed].filter(Boolean).length / 5) * 100
  );

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto" id="weekly-reset-chassis">
      {/* Dynamic Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/98 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-8 text-center"
            id="alignment-celebration-screen"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-24 rounded-full border border-[#C5A85C]/35 flex items-center justify-center mb-6 relative"
            >
              <div className="absolute inset-0 rounded-full border border-[#C5A85C]/10 animate-ping" />
              <Check className="text-[#C5A85C] w-10 h-10" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-3 max-w-md"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A85C]">
                Weekly Alignment Harmonized
              </span>
              <h2 className="font-serif text-3xl font-light text-stone-100 tracking-tight">
                Focus Channels Synced
              </h2>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                Your completed tasks have been converted to vault records, habits reset, and your channels of consciousness clear of open loops. Breathe deeply and start your next execution cycle.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BLOCK */}
      <section className="bg-[#161616]/40 border border-stone-900/20 rounded-sm py-6 md:py-8 px-8 md:px-12 text-left relative overflow-hidden" id="reset-header">
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#C5A85C]/5 to-transparent pointer-events-none" />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A85C]">
            <span>Pillar 05</span>
            <span className="text-stone-700">&bull;</span>
            <span>Weekly Calibration Profile</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-stone-100 font-light tracking-tight">
            The Weekly Reset Protocol
          </h2>
          <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-xl">
            A deep structural calibration designed to clean your psychological slate, empty physical/digital static, route temporal priorities, and compile back up records.
          </p>
        </div>

        {/* PROGRESS BLOCK */}
        <div className="mt-6 pt-5 border-t border-stone-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Calibration Progress</span>
            <div className="text-sm font-sans text-stone-200 flex items-center space-x-2">
              <span className="font-medium text-[#C5A85C]">{overallProgressPercent}%</span>
              <span className="text-stone-600 font-light">•</span>
              <span className="font-light text-stone-400">Step {activeStep} of 5 Active</span>
            </div>
          </div>
          {/* Bar indicator */}
          <div className="w-full sm:w-48 h-[2.5px] bg-stone-950 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#C5A85C]" 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </section>

      {/* MULTI-STEP WIZARD SECTOR SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPACT NAVIGATION RAIL */}
        <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-left">
          {stepsList.map((step) => {
            const isActive = activeStep === step.num;
            const isDone = 
              (step.num === 1 && step1Completed) ||
              (step.num === 2 && step2Completed) ||
              (step.num === 3 && step3Completed) ||
              (step.num === 4 && step4Completed) ||
              (step.num === 5 && step5Completed);
            
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`flex-1 md:flex-none w-full text-left p-3 border rounded-sm transition-all cursor-pointer focus:outline-none flex flex-col space-y-1.5 ${
                  isActive
                    ? "bg-[#161616]/75 border-[#C5A85C]/35"
                    : "bg-[#141414]/15 border-stone-900/35 hover:bg-stone-950 hover:border-stone-850"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[9px] font-mono font-semibold ${isActive ? "text-[#C5A85C]" : "text-stone-400"}`}>
                    PHASE 0{step.num}
                  </span>
                  {isDone ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center text-emerald-400">
                      <Check size={8} strokeWidth={3} />
                    </span>
                  ) : (
                    isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                  )}
                </div>
                <div>
                  <h4 className={`text-[11px] font-serif tracking-wide block leading-tight ${isActive ? "text-stone-100" : "text-stone-400"}`}>
                    {step.label}
                  </h4>
                  <p className="text-[8.5px] font-sans font-light text-stone-400 mt-1 line-clamp-1 hidden md:block">
                    {step.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT ANIMATED WIZARD CONTAINER */}
        <div className="md:col-span-8 border border-stone-900 bg-stone-950/60 rounded-sm p-6 min-h-[360px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              
              {/* STEP 1: CLEAR THE MIND */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-mono text-[#C5A85C] uppercase tracking-wider block">Phase 1</span>
                    <h3 className="font-serif text-lg text-stone-100 font-light tracking-wide">Clear the Mind (Dump to Open Loops)</h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Wipe your biological processor clean. Empty mental static and draft outstanding thoughts directly to Open Loops so they can be processed and prioritised.
                    </p>
                  </div>

                  <form onSubmit={handleAddMindDump} className="space-y-3.5">
                    <textarea
                      value={mindDumpInput}
                      onChange={(e) => setMindDumpInput(e.target.value)}
                      placeholder="Ex. Draft contract terms for licensing, purchase fresh linen for lookbook set up, clean office desk..."
                      className="w-full bg-stone-950 border border-stone-850 rounded-sm text-xs text-stone-300 p-3 h-24 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-650 font-sans tracking-wide leading-relaxed resize-none focus:ring-0"
                    />
                    <div className="flex justify-between items-center text-left">
                      <span className="text-[9px] font-mono text-stone-600 leading-normal max-w-[200px] block">
                        Pressing add captures item into Open Loops instantly
                      </span>
                      <button
                        type="submit"
                        disabled={!mindDumpInput.trim()}
                        className="text-[10px] font-mono uppercase tracking-wider bg-stone-900 hover:bg-[#C5A85C]/15 border border-stone-800 hover:border-[#C5A85C]/35 px-4 py-2 rounded-sm text-stone-300 hover:text-[#C5A85C] disabled:opacity-40 disabled:hover:text-stone-350 disabled:hover:border-stone-850 transition-all cursor-pointer flex items-center space-x-1 focus:outline-none"
                      >
                        <Plus size={11} />
                        <span>Dump Loop</span>
                      </button>
                    </div>
                  </form>

                  {/* List dumps */}
                  {mindDumpedItems.length > 0 && (
                    <div className="pt-3.5 border-t border-stone-900/60 text-left space-y-2">
                      <span className="text-[9px] font-mono uppercase text-stone-400 block">Captured in current session:</span>
                      <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                        {mindDumpedItems.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-stone-300 font-sans font-light flex items-start space-x-2 bg-stone-900/15 border border-stone-900/30 p-2 rounded-sm">
                            <span className="text-[#C5A85C] text-[10px] mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 bg-stone-900/10 border border-stone-900/35 rounded-sm flex items-start space-x-2.5 text-left">
                    <Info size={11} className="text-[#C5A85C]/90 mt-0.5" />
                    <p className="text-[10px] font-sans text-stone-500 leading-relaxed font-light">
                      A clear mind registers deeper focus flow states. Aim to capture at least 2 key mental static elements before routing.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: ZERO THE INBOX */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-mono text-[#C5A85C] uppercase tracking-wider block">Phase 2</span>
                    <h3 className="font-serif text-lg text-stone-100 font-light tracking-wide">Zero the Inbox (Process Loops)</h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Delegate loose loops of attention to dedicated focus horizons (Now, Next, Later) so they are systematically addressed.
                    </p>
                  </div>

                  {inboxItems.length === 0 ? (
                    <div className="py-6 px-4 border border-emerald-900/25 bg-emerald-950/15 rounded-sm text-xs font-mono text-emerald-450 flex flex-col items-center justify-center text-center space-y-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="font-semibold uppercase tracking-wider">Inbox Clean & Clear</span>
                      <span className="text-[10px] text-stone-300 font-sans max-w-xs lowercase">
                        All open loops are processed and routed. Your attention channels are zeroed.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono uppercase text-[#C5A85C]/80 block tracking-widest">
                          Pending inbox items ({inboxItems.length})
                        </span>
                        <button
                          onClick={() => setStep2Completed(true)}
                          className="text-[9.5px] font-mono text-[#C5A85C] border-b border-[#C5A85C]/20 hover:border-[#C5A85C] pb-0.5"
                        >
                          Mark Process Completed
                        </button>
                      </div>

                      <div className="border border-stone-900 rounded-sm overflow-hidden divide-y divide-stone-900/40 max-h-52 overflow-y-auto pr-1 text-left">
                        {inboxItems.map((item) => (
                          <div key={item.id} className="p-3 bg-stone-950/40 flex justify-between items-center gap-3">
                            <span className="text-[11.5px] text-stone-250 font-sans font-light leading-snug flex-1">
                              {item.content}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleProcessInboxItem(item)}
                                className="bg-stone-900 border border-stone-850 hover:border-[#C5A85C]/35 px-2.5 py-1.5 rounded-sm text-[9px] font-mono uppercase text-stone-300 hover:text-[#C5A85C] transition-colors cursor-pointer focus:outline-none"
                              >
                                Triage Focus
                              </button>
                              <button
                                onClick={() => handleArchiveInboxItem(item.id)}
                                className="text-stone-400 hover:text-rose-450 p-2 rounded-sm transition-colors cursor-pointer"
                                title="Wipe Static Loop"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-stone-900/10 border border-stone-900/35 rounded-sm flex items-start space-x-2 text-left">
                    <Info size={11} className="text-[#C5A85C]/90 mt-0.5" />
                    <p className="text-[10px] font-sans text-stone-500 leading-relaxed font-light">
                      Processing is a strict exercise of sorting. Do not start executing tasks now. Build the system architecture first, executing occurs in the Focus block.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: TEMPORAL HORIZON ALIGNMENT */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-mono text-[#C5A85C] uppercase tracking-wider block">Phase 3</span>
                    <h3 className="font-serif text-lg text-stone-100 font-light tracking-wide">Temporal Horizon Alignment</h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Set 3 non-negotiable anchors. Analyze current horizon distributions to ensure balance.
                    </p>
                  </div>

                  {/* Horizon breakdown counts */}
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-2.5 border border-stone-900 bg-stone-950/40 rounded-sm">
                      <span className="text-[9px] text-stone-500 block font-mono">NOW HORIZON</span>
                      <span className="text-sm font-semibold font-sans text-stone-200 block mt-1">
                        {tasks.filter(t => t.horizon === Horizon.NOW && !t.completed).length} items
                      </span>
                    </div>
                    <div className="p-2.5 border border-stone-900 bg-stone-950/40 rounded-sm">
                      <span className="text-[9px] text-stone-500 block font-mono">NEXT HORIZON</span>
                      <span className="text-sm font-semibold font-sans text-stone-200 block mt-1">
                        {tasks.filter(t => t.horizon === Horizon.NEXT && !t.completed).length} items
                      </span>
                    </div>
                    <div className="p-2.5 border border-stone-900 bg-stone-950/40 rounded-sm">
                      <span className="text-[9px] text-stone-500 block font-mono">LATER HORIZON</span>
                      <span className="text-sm font-semibold font-sans text-stone-200 block mt-1">
                        {tasks.filter(t => t.horizon === Horizon.LATER && !t.completed).length} items
                      </span>
                    </div>
                  </div>

                  {/* 3 Anchors Commit forms */}
                  <div className="space-y-3.5 text-left">
                    <div className="flex items-center space-x-1.5 border-b border-stone-9D0 pb-1.5">
                      <Calendar size={11} className="text-[#C5A85C]" />
                      <span className="text-[9px] font-mono uppercase text-stone-200 tracking-widest block font-semibold">
                        Commit to 3 Non-Negotiable Daily Anchors
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-[#C5A85C] font-semibold">01</span>
                        <input
                          type="text"
                          value={anchor1}
                          onChange={(e) => { 
                            setAnchor1(e.target.value); 
                            if(e.target.value && anchor2 && anchor3) setStep3Completed(true);
                          }}
                          placeholder="Anchor 1: Critical strategic launch audit..."
                          className="flex-1 bg-stone-950 border border-stone-900 rounded-sm text-xs text-stone-300 p-2.5 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-700 font-sans tracking-wide"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-[#C5A85C] font-semibold">02</span>
                        <input
                          type="text"
                          value={anchor2}
                          onChange={(e) => { 
                            setAnchor2(e.target.value); 
                            if(anchor1 && e.target.value && anchor3) setStep3Completed(true);
                          }}
                          placeholder="Anchor 2: Refine lookbook styling grid layouts..."
                          className="flex-1 bg-stone-950 border border-stone-900 rounded-sm text-xs text-stone-300 p-2.5 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-700 font-sans tracking-wide"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-[#C5A85C] font-semibold">03</span>
                        <input
                          type="text"
                          value={anchor3}
                          onChange={(e) => { 
                            setAnchor3(e.target.value); 
                            if(anchor1 && anchor2 && e.target.value) setStep3Completed(true);
                          }}
                          placeholder="Anchor 3: Setup local backup vault sync archive..."
                          className="flex-1 bg-stone-950 border border-stone-900 rounded-sm text-xs text-stone-300 p-2.5 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-700 font-sans tracking-wide"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setStep3Completed(true)}
                      className={`text-[9.5px] font-mono uppercase bg-stone-900 hover:bg-[#C5A85C]/15 border border-stone-850 px-4 py-1.5 text-stone-300 hover:text-[#C5A85C] hover:border-[#C5A85C]/30 rounded-sm transition-all focus:outline-none cursor-pointer ${
                        step3Completed ? "opacity-40" : ""
                      }`}
                    >
                      {step3Completed ? "Anchors Committed ✔" : "Confirm Anchors Placement"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REFLECTIVE INQUIRY (NEW FEATURE) */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-mono text-[#C5A85C] uppercase tracking-wider block">Phase 4</span>
                    <h3 className="font-serif text-lg text-stone-100 font-light tracking-wide">Reflective Inquiry</h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Take 60 seconds to review the week objectively. Formulate a review structure that links straight to your calibration records.
                    </p>
                  </div>

                  {/* Reflections Input Fields */}
                  <div className="space-y-4 text-left">
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <PenTool size={11} className="text-[#C5A85C]" />
                        <label className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block">
                          What went right this past week?
                        </label>
                      </div>
                      <textarea
                        value={reflectiveRight}
                        onChange={(e) => {
                          setReflectiveRight(e.target.value);
                          if (e.target.value.trim() && reflectiveLever.trim()) setStep4Completed(true);
                        }}
                        placeholder="Draft high-level insights or milestones achieved with zero distraction (e.g. typography specs completed flawlessly, client styleframes approved)."
                        className="w-full bg-stone-950 border border-stone-900 rounded-sm text-xs text-stone-300 p-3 h-20 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-700 font-sans tracking-wide leading-relaxed resize-none focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <MessageSquareCode size={11} className="text-[#C5A85C]" />
                        <label className="text-[10px] font-mono text-stone-300 uppercase tracking-wider block">
                          What is the primary operational lever for next week?
                        </label>
                      </div>
                      <textarea
                        value={reflectiveLever}
                        onChange={(e) => {
                          setReflectiveLever(e.target.value);
                          if (reflectiveRight.trim() && e.target.value.trim()) setStep4Completed(true);
                        }}
                        placeholder="Define the single highly high-leverage objective next week (e.g. render design blueprint mockups, lock architecture styleguides)."
                        className="w-full bg-stone-950 border border-stone-900 rounded-sm text-xs text-stone-300 p-3 h-20 focus:outline-none focus:border-[#C5A85C]/35 placeholder-stone-700 font-sans tracking-wide leading-relaxed resize-none focus:ring-0"
                      />
                    </div>

                  </div>

                  <div className="flex justify-between items-center pt-1 text-left">
                    <span className="text-[9px] font-mono text-stone-400 block max-w-xs leading-normal">
                      Notes are compiled directly inside your Weekly Metrics markdown files.
                    </span>
                    <button
                      onClick={() => setStep4Completed(true)}
                      className={`text-[9.5px] font-mono uppercase bg-stone-900 hover:bg-[#C5A85C]/15 border border-stone-850 px-4 py-1.5 text-stone-300 hover:text-[#C5A85C] hover:border-[#C5A85C]/30 rounded-sm transition-all focus:outline-none cursor-pointer ${
                        step4Completed ? "opacity-40" : ""
                      }`}
                    >
                      {step4Completed ? "Reflections Saved ✔" : "Confirm Reflections"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: SOVEREIGN ARCHIVE & CYCLES */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] font-mono text-[#C5A85C] uppercase tracking-wider block">Phase 5</span>
                    <h3 className="font-serif text-lg text-stone-100 font-light tracking-wide">Sovereign Vault Archive</h3>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                      Download your latest attention file and reset Completed Milestones and Habits to start a completely pristine cycle.
                    </p>
                  </div>

                  <div className="bg-[#121212] p-5 border border-stone-9D0 rounded-sm space-y-3.5 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block">Ledgers Status</span>
                        <h4 className="font-serif text-sm text-stone-300 block font-light mt-1">Ready for compilation and refresh</h4>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-stone-900 border border-stone-800 text-[8px] font-mono text-stone-400">
                        OFFLINE-LOCAL ONLY
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-sans text-stone-300 leading-relaxed font-light">
                      <p>&bull; Completed Tasks to wipe: <span className="text-stone-300 font-mono font-semibold">{tasks.filter(t => t.completed).length} items</span></p>
                      <p>&bull; Active open loops remaining: <span className="text-stone-300 font-mono font-semibold">{inboxItems.length} items</span></p>
                      <p>&bull; Commits: <span className="text-stone-300 font-mono font-semibold">3 Active anchors written</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center py-4">
                    <button
                      onClick={handleTriggerVaultDownload}
                      className={`text-[10px] font-mono uppercase tracking-widest border rounded-sm px-6 py-3 transition-all cursor-pointer flex items-center space-x-2.5 focus:outline-none ${
                        step5Completed 
                          ? "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300"
                          : "bg-stone-900/80 border-[#C5A85C]/35 text-[#C5A85C] hover:bg-stone-950 hover:border-[#C5A85C]"
                      }`}
                    >
                      <Download size={11} />
                      <span>{step5Completed ? "Vault Archived Successfully" : "Download & Complete Reset"}</span>
                    </button>
                    <span className="text-[8.5px] font-mono text-stone-600 tracking-wider block mt-2 lowercase">
                      Requires downloading markdown prior to cycling active indexes
                    </span>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* LOWER PROGRESS CONTROL NAVIGATION */}
          <div className="pt-4 border-t border-stone-900 flex justify-between items-center">
            
            <button
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="text-[10px] font-mono uppercase text-stone-300 hover:text-stone-250 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors cursor-pointer flex items-center space-x-1 focus:outline-none"
            >
              <ArrowLeft size={11} />
              <span>Back</span>
            </button>

            {activeStep < 5 ? (
              <button
                onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                className="text-[10px] font-mono uppercase text-[#C5A85C] hover:text-[#C5A85C]/80 transition-colors cursor-pointer flex items-center space-x-1.5 focus:outline-none"
              >
                <span>Next Phase</span>
                <ArrowRight size={11} />
              </button>
            ) : (
              <div />
            )}

          </div>

        </div>

      </div>

      {/* CORE ACTION MODULE: SYNC CYCLES & CELEBRATION TRIGGER (Step 5 required completion) */}
      {step5Completed && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-950/40 border border-[#C5A85C]/35 p-6 md:p-8 rounded-sm text-center space-y-4 relative overflow-hidden" 
          id="harmony-reset-box"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A85C] to-transparent" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#C5A85C] tracking-[0.25em] uppercase block">Alignment Fully Configured</span>
            <h3 className="font-serif text-xl text-stone-100 font-light tracking-normal">Initialize New Execution Cycle</h3>
            <p className="text-[11px] text-stone-400 font-sans font-light max-w-md mx-auto leading-relaxed">
              Completing the reset will clear completed items from the active board, reset habits, flush custom anchors, and log the alignment to local history.
            </p>
          </div>

          <button
            onClick={handleResetWorkspaceNewCycle}
            className="w-full sm:w-auto bg-[#C5A85C] hover:bg-[#C5A85C]/90 text-stone-950 text-xs font-mono uppercase tracking-[0.15em] px-8 py-3 rounded-sm transition-all shadow-xl font-bold cursor-pointer focus:outline-none"
          >
            Clean Slate & Start Cycle
          </button>
        </motion.div>
      )}
    </div>
  );
};
