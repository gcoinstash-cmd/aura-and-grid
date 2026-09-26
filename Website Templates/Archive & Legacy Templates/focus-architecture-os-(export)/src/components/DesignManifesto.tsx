import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Eye, Heart, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DesignManifestoProps {
  onDismiss: () => void;
  isDismissed: boolean;
  hasCompletedFirstTask: boolean;
}

export const DesignManifesto: React.FC<DesignManifestoProps> = ({
  onDismiss,
  isDismissed,
  hasCompletedFirstTask,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isDismissed || hasCompletedFirstTask) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto" id="design-manifesto-root">
      <div className="border border-stone-800/50 bg-[#161616]/60 backdrop-blur-sm rounded-sm p-6 space-y-4">
        {/* Header controller */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3.5 focus:outline-none text-left cursor-pointer group"
            id="manifesto-toggle-expand"
          >
            <div className="p-1 px-2 rounded-sm bg-[#C5A85C]/10 text-[#C5A85C] text-[10px] font-mono tracking-widest uppercase">
              Manifesto
            </div>
            <h3 className="font-serif text-base text-stone-200 font-light group-hover:text-stone-100 transition-colors">
              The Architecture of Quiet Space
            </h3>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-500 hover:text-stone-300 transition-colors focus:outline-none cursor-pointer"
              title={isOpen ? "Collapse Manifesto" : "Expand Manifesto"}
            >
              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <button
              onClick={onDismiss}
              className="text-stone-500 hover:text-stone-300 transition-colors focus:outline-none cursor-pointer"
              title="Minimize Architectural Guide"
              id="manifesto-dismiss-btn"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-400 font-sans leading-relaxed">
          Welcome to Focus OS. This space is intentionally designed to minimize digital friction and help you quiet your mind. Read the design principles below to begin.
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
              {/* ====================================================================
                  DEVELOPER NOTICE: ONBOARDING QUICK-START MANIFESTO LAYOUT
                  To update this copy, adjust the texts in the sections below.
                  This component uses a custom 'font-light' sans style and 'font-mono' labels
                  to achieve an editorial look.
                 ==================================================================== */}
              <div className="pt-5 border-t border-stone-800/40 space-y-8 text-xs text-stone-300 leading-relaxed font-sans font-light">
                
                {/* Philosophical Segment I - Breathing room */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] tracking-widest text-[#C5A85C] uppercase block font-semibold">
                    I. Breathing Room: Open Design
                  </span>
                  <p className="text-stone-400 pl-4 border-l border-[#C5A85C]/20">
                    Traditional digital lists trap your thoughts inside complex, crowded layouts. By styling your dashboard with generous space and omitting heavy containment lines, we restore a sense of calm. Your daily list can breathe organically on an open background.
                  </p>
                </div>

                {/* Philosophical Segment II - Quiet interactions */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] tracking-widest text-[#C5A85C] uppercase block font-semibold">
                    II. Gentle Interactions: Quiet Actions
                  </span>
                  <p className="text-stone-400 pl-4 border-l border-[#C5A85C]/20">
                    Loud badges, red dots, and hyper-reactive buttons constantly pull at your attention. Here, action options appear softly only when you hover or tap. This keeps your focus entirely on your work until you are ready to make a move.
                  </p>
                </div>

                {/* Philosophical Segment III - Single-task focus */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] tracking-widest text-[#C5A85C] uppercase block font-semibold">
                    III. Single Focus: The Screen Center
                  </span>
                  <p className="text-stone-400 pl-4 border-l border-[#C5A85C]/20">
                    Our minds are at their best when they do one thing at a time. Select your single most important task, and it takes center stage. When you toggle Focus Mode, peripheral list elements gently fade to 20% opacity.
                  </p>
                </div>

                {/* Quick-start instructions sequence formatted like an editorial checklist */}
                <div className="pt-5 border-t border-stone-800/40 space-y-3">
                  <h4 className="font-serif italic text-[#C5A85C] text-sm font-medium">
                    The Practice of Focus &mdash; Quick-Start Guide
                  </h4>
                  <ul className="space-y-3 text-stone-400 pl-1">
                    <li className="flex items-start">
                      <span className="font-mono text-[#C5A85C] text-[10px] w-5 shrink-0 mt-0.5">01/</span>
                      <div>
                        <strong className="text-stone-200 font-medium">Enter Thoughts Freely:</strong> Record any random thought or task into the main field. It seamlessly routes low-energy items to your Simple Tasks, complex tasks to Active Deep Work, or unorganized thoughts straight to your Inbox.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono text-[#C5A85C] text-[10px] w-5 shrink-0 mt-0.5">02/</span>
                      <div>
                        <strong className="text-stone-200 font-medium">Set One Clear Target:</strong> Choose the task you want to work on. Realize its priority as it fills the Active Focus chamber at the center of your page.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-mono text-[#C5A85C] text-[10px] w-5 shrink-0 mt-0.5">03/</span>
                      <div>
                        <strong className="text-stone-200 font-medium">Activate Focus Mode:</strong> Turn on Focus Mode to dim distracting elements. Listen to soft ambient tone waves to filter out background noise, complete your work, and tap to finish.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Dismiss Action Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={onDismiss}
                    className="text-[10px] font-mono uppercase bg-stone-900 border border-stone-800 hover:border-[#C5A85C] text-stone-300 py-2 px-5 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] focus:outline-none cursor-pointer"
                    id="manifesto-ack-btn"
                  >
                    Initialize Cosmic Calm &mdash; Align Channels
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
