import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Trash2, 
  User, 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Award, 
  RotateCcw,
  Zap
} from "lucide-react";

// Types & Utilities
import { ViewState, FocusTask, UserStats, SubStep } from "./types";
import { analyzeBrainDump } from "./data/mockSuggestions";

// Inner Components
import LandingView from "./components/LandingView";
import BrainDump from "./components/BrainDump";
import NextStep from "./components/NextStep";
import FocusSprint from "./components/FocusSprint";
import CompletionState from "./components/CompletionState";
import ShameFreeReset from "./components/ShameFreeReset";
import PaywallOverlay from "./components/PaywallOverlay";
import AntiLoopToast from "./components/AntiLoopToast";

export default function App() {
  const [viewState, setViewState] = useState<ViewState>("landing");
  const [userName, setUserName] = useState<string>("Guest Creator");
  const [initialBrainDumpText, setInitialBrainDumpText] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "studio">("free");
  const [activeTask, setActiveTask] = useState<FocusTask | null>(null);
  
  // Custom Anti-Loop tracking state
  const [loopCount, setLoopCount] = useState<number>(0);
  const [isAntiLoopOpen, setIsAntiLoopOpen] = useState<boolean>(false);
  const [antiLoopTriggerType, setAntiLoopTriggerType] = useState<"edit" | "reset" | "overcheck">("edit");

  // Shame-Free Reset Trigger Reason tracking
  const [resetReason, setResetReason] = useState<"abandoned" | "paused" | "missed" | "manual">("manual");

  // Paywall Modal Visibility
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  // Interactive User Game Stats pre-seeded with supportive mock log history
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 60,
    shippedCount: 4,
    streakCount: 3,
    historyLogs: [
      {
        id: "p-1",
        taskTitle: "Swept 5 ceramic coffee mugs from work standing desk",
        completedAt: "2026-06-19T14:30:00.000Z",
        wasDoneEnough: true,
        durationMinutes: 10,
      },
      {
        id: "p-2",
        taskTitle: "Outlined terriblest 200-word introduction newsletter",
        completedAt: "2026-06-18T11:15:00.000Z",
        wasDoneEnough: true,
        durationMinutes: 15,
      },
      {
        id: "p-3",
        taskTitle: "Wiped keyboard and organized top file folders",
        completedAt: "2026-06-17T09:05:00.000Z",
        wasDoneEnough: true,
        durationMinutes: 8,
      },
      {
        id: "p-4",
        taskTitle: "Capped spreadsheet cells of tax invoices row #1",
        completedAt: "2026-06-16T17:40:00.000Z",
        wasDoneEnough: true,
        durationMinutes: 20,
      }
    ],
  });

  // Track edits to activate the supportive Anti-loop popup
  const handleEditTask = (updatedPrimary: string) => {
    if (!activeTask) return;
    
    // Increment loops counter
    const nextLoopCount = loopCount + 1;
    setLoopCount(nextLoopCount);
    setAntiLoopTriggerType("edit");

    setActiveTask({
      ...activeTask,
      primaryStep: updatedPrimary,
    });

    // Check if loopCount crosses a perfectionist alarm limit (e.g. >= 2 edits)
    if (nextLoopCount >= 2) {
      setIsAntiLoopOpen(true);
    }
  };

  // Handle supportive Anti-Loop triggers initiated from FocusSprint or details checking
  const handleTriggerAntiLoopFromSprint = (triggerType: "reset" | "overcheck") => {
    setAntiLoopTriggerType(triggerType);
    setLoopCount((prev) => {
      const next = prev + 1;
      setIsAntiLoopOpen(true);
      return next;
    });
  };

  // Skip overthinking & direct-force ship MVP
  const handleForceShipMVP = () => {
    setIsAntiLoopOpen(false);
    setLoopCount(0);
    
    // Simulate finishing sprint with 100% completion award
    handleCompleteSprint(true, 5);
  };

  // Normal brain dump submission and analytical extract
  const handleBrainDumpAnalyzed = (extractedTask: FocusTask) => {
    setActiveTask(extractedTask);
    setLoopCount(0); // Reset anti-loop revs for new task
    setViewState("next-step");
  };

  // Start Focus Sprint Clock mode
  const handleStartSprint = () => {
    setViewState("focus-sprint");
  };

  // Complete immersive focus sprint & award milestones
  const handleCompleteSprint = (wasDoneEnough: boolean, durationMinutes: number, updatedSubSteps?: SubStep[]) => {
    const xpReward = wasDoneEnough ? 25 : 10;
    
    // Log new entry
    const newLog = {
      id: `history_${Date.now()}`,
      taskTitle: activeTask?.primaryStep || "Standard Shipped Task",
      completedAt: new Date().toISOString(),
      wasDoneEnough,
      durationMinutes,
    };

    if (updatedSubSteps && activeTask) {
      setActiveTask({
        ...activeTask,
        subSteps: updatedSubSteps
      });
    }

    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + xpReward,
      shippedCount: prev.shippedCount + 1,
      historyLogs: [newLog, ...prev.historyLogs],
    }));

    setViewState("completion");
  };

  // User onboarder initialization
  const handleUserStart = (input: string) => {
    const trimmedVal = input.trim();
    // If the input represents a long thought (containing spaces/punctuation)
    if (trimmedVal.length > 25 || trimmedVal.includes(" ") || trimmedVal.includes(",") || trimmedVal.includes(".")) {
      setInitialBrainDumpText(trimmedVal);
      setUserName("Guest Creator");
    } else {
      setUserName(trimmedVal || "Guest Creator");
      setInitialBrainDumpText("");
    }
    setViewState("brain-dump");
  };

  // Zero-penalty Slate cleaner
  const handleWipeHistory = () => {
    setUserStats((prev) => ({
      ...prev,
      historyLogs: [],
    }));
  };

  // Return to flow screen to input next challenge
  const handleNextTask = () => {
    setActiveTask(null);
    setLoopCount(0);
    setIsAntiLoopOpen(false);
    setViewState("brain-dump");
  };

  // Set up dynamic reset router with reasons
  const handleTriggerShameFreeReset = (reason: "abandoned" | "paused" | "missed" | "manual") => {
    setResetReason(reason);
    setViewState("reset-dashboard");
  };

  // Add global keyboard shortcut listener for 'Escape' key (Esc)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Explicitly ignore triggers when user is actively typing inside text inputs or textareas
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === "INPUT" || 
        activeEl.tagName === "TEXTAREA" || 
        activeEl.getAttribute("contenteditable") === "true"
      )) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        
        switch (viewState) {
          case "focus-sprint":
            // Prompt the Shame-Free Reset state machine if executed from inside an active sprint
            handleTriggerShameFreeReset("abandoned");
            break;
          case "next-step":
            // Transition back to main workspace state (brain-dump)
            setViewState("brain-dump");
            break;
          case "brain-dump":
            // Transition back to clean landing view state
            setViewState("landing");
            setActiveTask(null);
            setLoopCount(0);
            break;
          case "reset-dashboard":
          case "completion":
            // Escape helper dashboard back to main workspace state (brain-dump)
            handleNextTask();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [viewState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Immersive Subtle Ambient Light Gradient Ring */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-slate-900/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-slate-900/10 blur-[130px] pointer-events-none -z-10" />

      {/* Global Header */}
      <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div 
            id="header-nav-logo"
            onClick={() => {
              setViewState("landing");
              setActiveTask(null);
              setLoopCount(0);
            }} 
            className="flex items-center gap-2 cursor-pointer group hover:opacity-90 active:scale-[0.98] transition-all duration-300"
            title="Return to Clean Landing Page"
          >
            <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-mono text-xs font-bold leading-none group-hover:border-amber-500/30 transition-colors">
              D
            </div>
            <span className="font-serif tracking-widest text-sm font-semibold text-slate-200 group-hover:text-slate-100 group-hover:underline decoration-amber-500/35 decoration-1 underline-offset-4 transition-all">
              DONE <span className="text-slate-450 italic font-light">ENOUGH</span>.
            </span>
          </div>

          {/* Right Navigation & Game Stats Displays */}
          {viewState !== "landing" && (
            <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
              
              {/* Gamified feedback - XP & Shipped Counters */}
              <div className="hidden sm:flex items-center gap-3.5 text-slate-400">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{userStats.xp} XP</span>
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1" title="Completed Minimum Viable Projects">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{userStats.shippedCount} Shipped</span>
                </span>
              </div>

              {/* Slate Cleaner Navigation Link */}
              <button
                id="header-nav-reset"
                onClick={() => handleTriggerShameFreeReset("manual")}
                className={`hover:text-slate-200 transition-colors text-slate-400 py-1 px-2 rounded-md ${
                  viewState === "reset-dashboard" ? "bg-slate-900 text-slate-100" : ""
                }`}
              >
                Reset Board
              </button>

              {/* Members pricing button */}
              <button
                id="header-membership-btn"
                onClick={() => setIsPaywallOpen(true)}
                className="px-2.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="hidden xs:inline">Zen Pro</span>
              </button>

            </div>
          )}

        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* View Dispatcher Routing */}
            {viewState === "landing" && (
              <LandingView 
                onStart={handleUserStart} 
                onOpenPricing={() => setIsPaywallOpen(true)} 
              />
            )}

            {viewState === "brain-dump" && (
              <BrainDump 
                onAnalyze={handleBrainDumpAnalyzed} 
                userName={userName} 
                initialText={initialBrainDumpText}
              />
            )}

            {viewState === "next-step" && activeTask && (
              <NextStep
                task={activeTask}
                onStartSprint={handleStartSprint}
                onEditTask={handleEditTask}
                onBackToDump={() => setViewState("brain-dump")}
              />
            )}

            {viewState === "focus-sprint" && activeTask && (
              <FocusSprint
                task={activeTask}
                onCompleteSprint={handleCompleteSprint}
                onAbandon={() => handleTriggerShameFreeReset("abandoned")}
                onTriggerAntiLoop={handleTriggerAntiLoopFromSprint}
                onTriggerShameFreeReset={handleTriggerShameFreeReset}
              />
            )}

            {viewState === "completion" && activeTask && (
              <CompletionState
                task={activeTask}
                primaryStep={activeTask.primaryStep}
                category={activeTask.category}
                durationMinutes={3} // Static sprint minutes representation
                xpAwarded={25}
                totalShipped={userStats.shippedCount}
                totalXp={userStats.xp}
                wasDoneEnough={true}
                onNextTask={handleNextTask}
                onGoToResetDashboard={() => setViewState("reset-dashboard")}
              />
            )}

            {viewState === "reset-dashboard" && (
              <ShameFreeReset
                stats={userStats}
                onWipeHistory={handleWipeHistory}
                onBackToDump={handleNextTask}
                triggerReason={resetReason}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Interactive Anti-Loop Proactive Alert (Toast) */}
      <AnimatePresence>
        {isAntiLoopOpen && (
          <AntiLoopToast
            loopCount={loopCount}
            triggerType={antiLoopTriggerType}
            onDismiss={() => {
              setIsAntiLoopOpen(false);
              setLoopCount(0);
            }}
            onOverrideAndShip={handleForceShipMVP}
          />
        )}
      </AnimatePresence>

      {/* Subscription Paywall Modal */}
      <PaywallOverlay
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        selectedTier={selectedTier}
        onSelectTier={(tier) => setSelectedTier(tier)}
      />

      {/* Ambient Minimal Bottom Footer */}
      <footer className="border-t border-slate-900 py-10 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <span className="text-lg sm:text-xl font-bold font-sans text-slate-200 tracking-wide py-3 block select-none">
            "Acknowledge the effort. Leave the perfection behind."
          </span>
          <span className="text-slate-600">© 2026 Done Enough. Designed strictly for overthinkers.</span>
        </div>
      </footer>

    </div>
  );
}
