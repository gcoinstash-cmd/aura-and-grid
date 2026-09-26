import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  Smile, 
  Info, 
  Heart, 
  Clock, 
  Compass, 
  AlertCircle,
  Wind
} from "lucide-react";
import { UserStats } from "../types";

interface ShameFreeResetProps {
  stats: UserStats;
  onWipeHistory: () => void;
  onBackToDump: () => void;
  triggerReason?: "abandoned" | "paused" | "missed" | "manual";
}

export default function ShameFreeReset({
  stats,
  onWipeHistory,
  onBackToDump,
  triggerReason = "manual",
}: ShameFreeResetProps) {
  const [isWiped, setIsWiped] = useState(false);
  const [clearingWorkspace, setClearingWorkspace] = useState(false);

  // Auto-accepting warm quote options depending on trigger
  const getComfortDetails = () => {
    switch (triggerReason) {
      case "abandoned":
        return {
          title: "You called a timeout.",
          subtitle: "And we are completely here for it.",
          badge: "Conscious Unplug",
          color: "text-amber-400 bg-amber-500/5 border-amber-500/10",
          icon: <Wind className="w-5 h-5 text-amber-400" />,
          quote: "Abandoning a sprint means you recognized you needed a pivot. That is self-awareness, not failure."
        };
      case "paused":
        return {
          title: "Pause Detected.",
          subtitle: "Nature has pauses too.",
          badge: "Inactivity Grace",
          color: "text-sky-400 bg-sky-500/5 border-sky-500/10",
          icon: <Clock className="w-5 h-5 text-sky-400" />,
          quote: "A long pause means the mind is busy sorting background noise. You are returned here with no penalties."
        };
      case "missed":
        return {
          title: "Missed Interval.",
          subtitle: "Grace over metrics, always.",
          badge: "Zero Obligations",
          color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
          icon: <Compass className="w-5 h-5 text-emerald-400" />,
          quote: "You stepped away. The world did not end, and your worth did not change. Start clean right now."
        };
      case "manual":
      default:
        return {
          title: "Weekly Shame-Free Reset",
          subtitle: "Clear the whiteboard.",
          badge: "Manual Reset",
          color: "text-slate-400 bg-slate-900 border-slate-800",
          icon: <Smile className="w-5 h-5 text-slate-400" />,
          quote: "The slate belongs to you. No penalties, no streaks lost for resting, and absolutely no nagging reminders."
        };
    }
  };

  const details = getComfortDetails();

  const handleWipeClick = () => {
    setIsWiped(true);
    setTimeout(() => {
      onWipeHistory();
      setIsWiped(false);
    }, 1000);
  };

  const handleInstantResetClick = () => {
    setClearingWorkspace(true);
    onWipeHistory(); // Clears any history logs for perfect fresh start
    setTimeout(() => {
      onBackToDump(); // Resets active task and view state back to empty input
    }, 1100);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 py-6">
      
      {/* Premium Adaptive Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-slate-950/90 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[220px] h-[220px] rounded-full bg-slate-900/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className={`px-2.5 py-1 rounded-full border text-[10px] uppercase font-mono tracking-wider ${details.color} flex items-center gap-1.5`}>
            {details.icon}
            <span>{details.badge} Safeguard</span>
          </div>
          <span className="text-[10px] font-mono text-slate-550">
            Done Enough Slate V1.2
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 font-medium tracking-tight">
            {details.title}
          </h2>
          <p className="text-sm text-slate-400 font-sans font-light">
            {details.subtitle}
          </p>
        </div>

        {/* Central comforting quote or grounding system statement */}
        <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl relative">
          <p className="text-xs sm:text-sm text-slate-300 italic font-sans leading-relaxed font-light">
            "{details.quote}"
          </p>
          <div className="mt-3 flex items-center gap-1 text-[9px] text-slate-500 font-mono">
            <Heart className="w-3 h-3 text-rose-500/50" />
            <span>Guilt Inhibitor Active • No metrics docked</span>
          </div>
        </div>

        {/* Core user comforting grounding micro-copy */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Grounding Mantra</h4>
          <p className="text-xs sm:text-sm text-amber-500/95 leading-relaxed font-mono font-medium">
            "The slate is clear. No penalties. No history tracking. Fresh start whenever you are ready."
          </p>
        </div>

        {/* Instantly Reset Focus Workspace - Single tactile click action */}
        <div className="pt-4 border-t border-slate-900/80 flex flex-col items-center">
          <button
            id="instant-reset-tactile-btn"
            onClick={handleInstantResetClick}
            disabled={clearingWorkspace}
            className="w-full py-4 px-6 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-mono text-xs font-bold transition-all relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/5 active:scale-[0.99] disabled:opacity-80"
          >
            {clearingWorkspace ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Sweeping Slate & Unlocking Freedom...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 text-slate-950" />
                <span>Reset Focus Workspace Instantly</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-500 font-mono mt-2.5 text-center">
            Sweeps away all active unfinished tasks, clears previous loops, and initializes a clean slate.
          </p>
        </div>

      </motion.div>

      {/* Routine History & Logs (Optional list overview to wipe manually) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-5 space-y-4"
      >
        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Previous Shipped Records ({stats.historyLogs.length})
          </span>
          {stats.historyLogs.length > 0 && (
            <button
              id="wipe-slate-shame-free"
              onClick={handleWipeClick}
              disabled={isWiped}
              className="text-[10px] font-mono text-rose-500/80 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Force Wipe Logs</span>
            </button>
          )}
        </div>

        {isWiped ? (
          <div className="text-center py-6 space-y-1.5 animate-pulse">
            <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-emerald-400">Sweeping past records cleanly...</p>
          </div>
        ) : stats.historyLogs.length === 0 ? (
          <div className="text-center py-4 text-slate-650 font-sans text-xs font-light">
            Nothing logged. Zero cognitive load maintained.
          </div>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {stats.historyLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/30 border border-slate-900/40 text-xs font-sans"
              >
                <span className="text-slate-300 font-light truncate max-w-[70%]">
                  "{log.taskTitle}"
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                  Shipped
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Alternative Quiet Return option */}
      <div className="text-center">
        <button
          id="shame-free-quiet-return-btn"
          onClick={onBackToDump}
          className="text-xs font-mono text-slate-550 hover:text-slate-300 transition-colors py-2 px-3 hover:bg-slate-900/40 rounded-lg cursor-pointer"
        >
          Cancel Reset & Return
        </button>
      </div>

    </div>
  );
}
