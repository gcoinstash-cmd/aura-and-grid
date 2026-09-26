import React, { useState } from "react";
import { ArrowRight, Sparkles, Shield, AlertCircle, Lock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingViewProps {
  onStart: (name: string) => void;
  onOpenPricing: () => void;
}

export default function LandingView({ onStart, onOpenPricing }: LandingViewProps) {
  const [nameInput, setNameInput] = useState("");
  const [isInteracted, setIsInteracted] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showTransformation, setShowTransformation] = useState(false);

  const LANDING_CHIPS = [
    {
      id: "client-work",
      label: "Client Work",
      prompt: "I need to respond to client comments without getting anxious that they'll derail my entire setup..."
    },
    {
      id: "launch-anxiety",
      label: "Launch Anxiety",
      prompt: "I want to launch this feature today, but I keep stalling by introducing minor code changes..."
    },
    {
      id: "over-editing",
      label: "Over-Editing",
      prompt: "Trailing behind schedule because I've spent three hours rearranging words on a static page..."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || "Guest Creator";
    onStart(finalName);
  };

  const handleQuickEnter = () => {
    onStart("Guest Creator");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const finalName = nameInput.trim() || "Guest Creator";
      onStart(finalName);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Decorative ultra-soft background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-slate-900/30 blur-[140px] -z-10 pointer-events-none" />

      {/* Main Clean Container with Enhanced Spacing & Rhythm */}
      <div className="w-full max-w-2xl text-center space-y-32 py-20 md:py-28 animate-fade-in">
        
        {/* Main Brand Header & Outcomes */}
        <div className="space-y-8 md:space-y-10">
          <h1 className="text-5xl md:text-6.5xl font-black font-serif text-white tracking-tight leading-tight select-none">
            Done Enough.
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans tracking-wide">
            "Finish creative work without spiraling, stalling, or over-revising."
          </p>
        </div>

        {/* Heavy Mental Weight - Main Input Section with Top Padding Buffer */}
        <div className="space-y-16 text-left pt-16 md:pt-20">
          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-8">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-4">
                  <label 
                    htmlFor="user-name-input" 
                    className="block text-sm sm:text-base font-bold tracking-wider text-slate-400 uppercase font-sans leading-relaxed select-none"
                  >
                    What is making your mind feel heavy right now?
                  </label>
                  <button
                    id="toggle-transformation-peek"
                    type="button"
                    onClick={() => setShowTransformation(!showTransformation)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 select-none active:scale-95 min-h-[44px] ${
                      showTransformation
                        ? "bg-emerald-950/45 border-emerald-800 text-emerald-400 font-extrabold"
                        : "bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                    }`}
                    aria-label="Toggle transformation example"
                  >
                    <Sparkles className={`w-3.5 h-3.5 shrink-0 ${showTransformation ? "text-emerald-400 fill-emerald-400/15 animate-pulse" : "text-slate-550"}`} />
                    <span>{showTransformation ? "Hide Example" : "See Example"}</span>
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 italic font-sans leading-relaxed select-none text-left">
                  e.g., Transforming a "perfect" landing page into 3 shippable steps
                </p>
              </div>
              <textarea
                id="user-name-input"
                rows={3}
                value={nameInput}
                onFocus={() => setIsInteracted(true)}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setIsInteracted(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g., I need to finish the landing page copy, reply to those client reviews, and stop over-tweaking."
                className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 text-white text-lg md:text-xl font-medium rounded-2xl p-6 outline-none transition-all duration-300 font-sans placeholder:text-slate-500 leading-relaxed tracking-wide resize-none focus:ring-1 focus:ring-slate-700 shadow-inner"
                maxLength={200}
              />

              {/* Seamless high-end ghost card slide-down for transformation proof */}
              <AnimatePresence>
                {showTransformation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -12 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-950/40 border border-slate-900/85 rounded-2xl p-5 md:p-6 text-left space-y-6 shadow-2xl relative mt-2 mb-4">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                      
                      {/* Messy Thought block */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest leading-none">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>// Messy Thought / perfectionist specification</span>
                        </div>
                        <div className="p-3.5 bg-red-950/10 border border-red-950/30 text-red-200/90 text-xs sm:text-sm font-sans italic rounded-xl leading-relaxed select-none">
                          "I want to launch this feature today, but first I need total test coverage, custom styled layouts, deep-work rituals, and flawless illustrations, or it's not ready..."
                        </div>
                      </div>

                      {/* Structured Output block */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest leading-none">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                          <span>// Actionable Clarity (Done Enough Method)</span>
                        </div>
                        
                        <div className="space-y-2 font-sans">
                          <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-900/60 p-3 rounded-xl">
                            <span className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              1
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs sm:text-sm text-slate-200 font-semibold block leading-tight">
                                Build exactly what the user described. Nothing more, nothing less.
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
                                High Leverage • 15 Mins
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-900/60 p-3 rounded-xl">
                            <span className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              2
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs sm:text-sm text-slate-200 font-semibold block leading-tight">
                                Run verification linter and compile build pipeline checks.
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
                                High Leverage • 10 Mins
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-900/60 p-3 rounded-xl">
                            <span className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              3
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs sm:text-sm text-slate-200 font-semibold block leading-tight">
                                Declare victory, ship the segment, and close the session.
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
                                Micro Finish • 5 Mins
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ship Safeguard Footer */}
                      <div className="pt-3 border-t border-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-sans font-bold leading-none">
                          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Action threshold reached — Perfectionism neutralized</span>
                        </div>
                        <div className="text-[9px] text-slate-550 font-mono leading-none">
                          // DONE ENOUGH SAFEGUARD
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Example Preset Chips and Trust Ribbon - appear ONLY after focus/interaction */}
            <AnimatePresence>
              {isInteracted && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-10 overflow-hidden pt-4"
                >
                  {/* Quick-select blockages */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold select-none block">Suggested Blockers:</span>
                    <div className="flex flex-wrap gap-2">
                      {LANDING_CHIPS.map((chip) => (
                        <button
                          id={`landing-chip-${chip.id}`}
                          key={chip.id}
                          type="button"
                          onClick={() => {
                            setNameInput(chip.prompt);
                            setIsInteracted(true);
                          }}
                          className="px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer min-h-[44px] text-left select-none"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Private Trust Ribbon */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-4 px-6 rounded-2xl bg-slate-900/20 border border-slate-800/40 max-w-xl mx-auto select-none mt-2">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium font-sans">
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[1.5]" />
                      <span>Private by default</span>
                    </div>
                    <span className="hidden sm:inline text-slate-800" aria-hidden="true">•</span>
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium font-sans">
                      <Heart className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[1.5]" />
                      <span>Zero shame mechanics</span>
                    </div>
                    <span className="hidden sm:inline text-slate-800" aria-hidden="true">•</span>
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[1.5]" />
                      <span>Built for creative fatigue</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ultimate UI Gravity Well / CTA Button - with massive footprint & deliberate transition */}
            <div className="pt-12 md:pt-14">
              <button
                id="start-flow-btn"
                type="submit"
                className="w-full py-5 px-10 bg-white hover:bg-slate-100 active:bg-slate-200 text-black font-sans text-xl md:text-2xl font-black tracking-widest uppercase rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 ease-out active:scale-[98.5%] cursor-pointer shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.12)] border border-transparent select-none min-h-[56px] focus-visible:ring-2 focus-visible:ring-slate-300 group"
              >
                <span>Initiate Flow Space</span>
                <ArrowRight className="w-6 h-6 stroke-[3] transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
            
            {/* Highly Refined Muted Auxiliary Interactions & Sub-Upsell */}
            <div className="text-center pt-6 space-y-8">
              <button
                id="quick-enter"
                type="button"
                onClick={handleQuickEnter}
                className="text-sm font-semibold text-slate-500 hover:text-slate-400 transition-colors duration-300 cursor-pointer font-sans block mx-auto py-1.5 min-h-[44px] select-none"
              >
                Prefer privacy? Continue anonymously
              </button>

              <div className="pt-1">
                <span className="text-xs sm:text-sm font-sans font-normal text-slate-500 block max-w-md mx-auto leading-relaxed select-none">
                  Calm Mode: Anti-spiral coaching · Deep-work rituals · Progress memory
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Single, Highly Visible Zen Footer Quote */}
        <div className="pt-16 border-t border-slate-900/30">
          <span className="text-lg md:text-xl font-bold text-slate-400 tracking-wide block max-w-xl mx-auto leading-relaxed font-sans">
            "Perfectionism is just procrastination holding a high-end handbag."
          </span>
        </div>

      </div>

      {/* Elegant, Responsive Collapsible Drawer for Paradigm and Proof */}
      <div className="w-full max-w-2xl border-t border-slate-900 pb-16 px-4">
        <button
          id="toggle-learn-more-drawer"
          type="button"
          onClick={() => setShowLearnMore(!showLearnMore)}
          className="w-full py-6 flex items-center justify-between text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-[0.2em] text-xs font-mono font-bold cursor-pointer select-none border-b border-slate-950 min-h-[48px]"
        >
          <span>{showLearnMore ? "Hide Paradigm & Science" : "See How It Works"}</span>
          <motion.span
            animate={{ rotate: showLearnMore ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-bold text-slate-400 shrink-0 ml-2"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {showLearnMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 space-y-12">
                
                {/* 3 Step Sequence with Editorial Typography */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest text-left">
                    The 3-Step Flow Mechanics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    
                    <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900/60 space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest block uppercase">Step 01</span>
                      <h5 className="text-base font-bold text-slate-100">Unload your mental weight.</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                        Dump all the chaotic steps, anxious micro-tasks, and perfectionist specs swirling in your head.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900/60 space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest block uppercase">Step 02</span>
                      <h5 className="text-base font-bold text-slate-100">Get one actionable step.</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                        Done Enough slices through the heavy fog to give you exactly one tiny action to commit to in this single moment.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900/60 space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest block uppercase">Step 03</span>
                      <h5 className="text-base font-bold text-slate-100">Stop when it's enough.</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                        Receive proactive, non-judgmental coach interventions that shield your attention from overthinking fatigue.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Dual Pane Transformation Preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest text-left">
                    Transformation Proof
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Ghosted Before Pane */}
                    <div className="bg-slate-950/40 border border-red-950/30 rounded-2xl p-6 space-y-4 text-left flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-red-500 bg-red-950/30 border border-red-900/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 leading-none">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Before: Mentally Overwhelmed</span>
                          </span>
                        </div>
                        <p className="text-red-300/60 text-xs italic leading-relaxed font-light font-sans">
                          "I want to build this feature, but first I need total test coverage, custom DB schemas, perfect illustrations, flawless styling systems, and zero warnings or it’s not ready..."
                        </p>
                      </div>
                      <div className="text-[9px] font-mono text-red-500/50 font-semibold tracking-wide border-t border-red-950/10 pt-2.5 leading-none">
                        Result: Infinite Loop • 0% Shipped
                      </div>
                    </div>

                    {/* Ghosted After Pane */}
                    <div className="bg-slate-950/50 border border-emerald-950/30 rounded-2xl p-6 space-y-4 text-left flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 leading-none">
                            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>After: Done Enough Clarity</span>
                          </span>
                        </div>
                        <div className="space-y-2 font-sans font-light">
                          <div className="text-xs text-slate-200 flex items-center gap-2 font-medium">
                            <span className="w-4.5 h-4.5 rounded-full bg-emerald-950 border border-emerald-900/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                            <span>Draft 3 basic core helper routes</span>
                          </div>
                          <div className="text-xs text-slate-200 flex items-center gap-2 font-medium">
                            <span className="w-4.5 h-4.5 rounded-full bg-emerald-950 border border-emerald-900/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                            <span>Apply clean layout with native fonts</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-wide border-t border-emerald-950/10 pt-2.5 flex justify-between leading-none">
                        <span>Victory Declared: Segment Shipped</span>
                        <span>+25 XP</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Proof Section Footer quote info */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 text-left">
                  <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                    Done Enough is an ADHD-friendly, high-contrast, zero-guilt application that leverages simple cognitive offloading to turn high-anxiety brain dumps into bite-sized actionable wins. Absolute focus, zero clutter, 100% private.
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
