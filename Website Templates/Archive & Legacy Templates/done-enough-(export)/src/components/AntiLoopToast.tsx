import React from "react";
import { motion } from "motion/react";
import { Sparkles, ShieldCheck, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

interface AntiLoopToastProps {
  onDismiss: () => void;
  onOverrideAndShip: () => void;
  loopCount: number;
  triggerType: "edit" | "reset" | "overcheck";
}

export default function AntiLoopToast({
  onDismiss,
  onOverrideAndShip,
  loopCount,
  triggerType,
}: AntiLoopToastProps) {
  // Map trigger types to elegant, non-judgmental micro-copy options
  const getDisplayDetails = () => {
    switch (triggerType) {
      case "reset":
        return {
          header: "Acknowledge the Effort",
          body: "Acknowledge the effort. Leave the perfection behind. Finish sprint?",
          badge: "Timer Loop",
          icon: <RotateCcw className="w-4 h-4 text-emerald-400" />,
          accentColor: "border-emerald-500/30",
          glowColor: "shadow-emerald-500/5",
        };
      case "overcheck":
        return {
          header: "Completely Functional",
          body: "This looks completely functional. Let's push it live and iterate later.",
          badge: "Check Loop",
          icon: <HelpCircle className="w-4 h-4 text-sky-400" />,
          accentColor: "border-sky-500/30",
          glowColor: "shadow-sky-500/5",
        };
      case "edit":
      default:
        return {
          header: "Perfectionism Flagged",
          body: "You’ve revised this a few times. Is version one ready to ship?",
          badge: "Revision Loop",
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          accentColor: "border-amber-500/30",
          glowColor: "shadow-amber-500/5",
        };
    }
  };

  const details = getDisplayDetails();

  return (
    <motion.div
      id="anti-loop-container"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ 
        type: "spring", 
        stiffness: 180, 
        damping: 24, 
        mass: 1.1 
      }}
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950/95 border ${details.accentColor} backdrop-blur-lg shadow-2xl ${details.glowColor} rounded-xl p-4 md:p-5`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          {details.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 uppercase">
              {details.badge} Detected
            </span>
            <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-500 border border-slate-900 font-mono">
              Rev #{loopCount}
            </span>
          </div>
          <h4 className="text-sm font-serif text-slate-100 font-medium tracking-tight mb-1">
            {details.header}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4 font-light">
            {details.body}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              id="ship-mvp-btn"
              onClick={onOverrideAndShip}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              <span>Ship MVP Now</span>
            </button>
            <button
              id="keep-refining-btn"
              onClick={onDismiss}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors duration-150 cursor-pointer"
            >
              Keep Refining
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

