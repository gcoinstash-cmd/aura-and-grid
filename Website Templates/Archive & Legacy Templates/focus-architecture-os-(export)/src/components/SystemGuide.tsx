import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Sparkles, X, Target, Mail, Eye, Save, Calendar, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SystemGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SystemGuide: React.FC<SystemGuideProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="w-full max-w-2xl mx-auto" id="system-guide-root">
      <div className="border border-stone-850 bg-[#161616]/40 backdrop-blur-md rounded-sm p-5 md:p-6 space-y-4">
        {/* Header Controller */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-3 focus:outline-none text-left cursor-pointer group"
            id="system-guide-toggle-btn"
          >
            <div className="p-1 px-2 rounded-sm bg-[#C5A85C]/10 text-[#C5A85C] text-[10px] font-mono tracking-widest uppercase font-semibold">
              OS Guide
            </div>
            <h3 className="font-serif text-base text-stone-200 font-light group-hover:text-stone-100 transition-colors">
              How to Run Focus OS
            </h3>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggle}
              className="text-stone-500 hover:text-stone-300 transition-colors focus:outline-none cursor-pointer p-1.5"
              title={isOpen ? "Collapse Guide" : "Expand Guide"}
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Framing Positioning */}
        <p className="text-xs text-stone-400 font-sans leading-relaxed">
          <strong className="text-stone-200 font-semibold font-sans">Best for Solo Creators, Consultants, and Boutique Studios</strong> looking to transition from mental chaos to a unified, repeatable execution engine.
        </p>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 border-t border-stone-900/45 space-y-6 text-xs text-stone-300 leading-relaxed font-sans font-light">
                
                {/* Introduction Narrative */}
                <div className="space-y-2 text-left">
                  <h4 className="font-serif text-sm text-stone-200 font-normal">
                    The Unified Ritual: How the 5 Pillars Connect
                  </h4>
                  <p className="text-stone-400 text-xs text-stone-400/90">
                    Focus OS is not just a layout; it's a closed-loop operating protocol. By design, thoughts flow smoothly through distinct attention phases, never lingering as persistent cognitive static. This is the daily sequence:
                  </p>
                </div>

                {/* THE 5 PILLARS INTERCONNECT SYNC DESIGN */}
                <div className="space-y-4">
                  {[
                    {
                      num: "01",
                      name: "FOCUS",
                      tag: "Deep Execution",
                      desc: "The center of daily gravity. Choose exactly one key deliverable from your curated horizon backlogs. Activate Focus Mode to quiet the interface with an immersive active workspace and trigger soft wave synths. Execution is sacred.",
                      icon: <Target size={12} className="text-[#C5A85C]" />
                    },
                    {
                      num: "02",
                      name: "OPEN LOOPS",
                      tag: "Mind Unloading",
                      desc: "The safe inbox vault. When ideas, anxieties, or requests surface mid-session, do not process them. Unload them instantly here in 3 seconds flat. Keep your immediate attention reservoir pristine and secure.",
                      icon: <Mail size={12} className="text-[#C5A85C]" />
                    },
                    {
                      num: "03",
                      name: "STUDIO STAGE",
                      tag: "Agency Showcase Hub",
                      desc: "The professional presentation state. Swap between raw tracking backlogs and clean custom presentation cards. Ideal for high-end boutique agency directors looking to pitch, review deliverables, or audit boards live with premium clients.",
                      icon: <Eye size={12} className="text-[#C5A85C]" />
                    },
                    {
                      num: "04",
                      name: "OFFLINE VAULT",
                      tag: "Sovereign Portability",
                      desc: "Complete Isolated Local Environment privacy. Focus OS collects zero tracking telemetry. Periodically audit the formatted Markdown schema logs of your tasks, metrics, and captures, perfectly optimized for copy-paste straight to Obsidian.",
                      icon: <Save size={12} className="text-[#C5A85C]" />
                    },
                    {
                      num: "05",
                      name: "WEEKLY RESET",
                      tag: "System Alignment",
                      desc: "The system's absolute alignment cycle. Run this multi-step wizard every Sunday to sweep completed tasks, process unprocessed open loops, commit to 3 non-negotiable anchors, log weekly reflections, and download high-contrast backup files.",
                      icon: <Calendar size={12} className="text-[#C5A85C]" />
                    }
                  ].map((p, idx) => (
                    <div 
                      key={p.num} 
                      className="p-3.5 bg-stone-950/40 border border-stone-900/60 rounded-sm flex gap-3.5 items-start text-left hover:border-stone-850/70 transition-all"
                    >
                      <span className="font-mono text-[10px] text-[#C5A85C] font-semibold tracking-wider bg-[#C5A85C]/5 border border-[#C5A85C]/15 rounded-sm px-1.5 py-0.5 shrink-0">
                        {p.num}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h5 className="font-mono text-[11px] font-bold text-stone-200 tracking-wider">
                            {p.name}
                          </h5>
                          <span className="text-stone-700 font-mono text-[9px]">&bull;</span>
                          <span className="text-[10px] text-stone-400 font-serif italic">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footnote instruction */}
                <div className="p-3 bg-stone-900/10 border border-stone-900/35 rounded-sm flex items-start space-x-2 text-left">
                  <Info size={11} className="text-[#C5A85C]/90 mt-0.5" />
                  <p className="text-[10px] font-sans text-stone-500 leading-relaxed font-light">
                    Practice discipline. Transitioning your studio to structured attention is an exercise in editing. Limit your concurrent active work to avoid burnout and keep your creative assets pure.
                  </p>
                </div>

                {/* Collapse Actions */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onToggle}
                    className="text-[9px] font-mono uppercase bg-stone-900/50 hover:bg-stone-900 border border-stone-850 text-stone-400 hover:text-stone-200 py-1.5 px-4 rounded-sm transition-all focus:outline-none cursor-pointer"
                  >
                    Hide OS Guide
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
