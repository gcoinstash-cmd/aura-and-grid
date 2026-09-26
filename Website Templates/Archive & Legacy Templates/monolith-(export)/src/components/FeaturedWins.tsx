import React, { useState } from "react";
import { CASE_STUDIES, SITE_COPY } from "../data";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, Flame, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * FeaturedWins Component
 * Visualizes in-depth case studies with an interactive tabs layout.
 * Optimized for rapid animation swaps using Framer Motion exit states.
 */
export default function FeaturedWins() {
  const [activeID, setActiveID] = useState<string>("win-1");

  const activeWin = CASE_STUDIES.find((study) => study.id === activeID) || CASE_STUDIES[0];

  return (
    <section
      id="wins"
      className="py-24 md:py-36 bg-[#030303] relative border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
              {SITE_COPY.caseStudies.label}
            </span>
            <h2
              id="wins-headline"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-100 font-medium tracking-tight"
            >
              {SITE_COPY.caseStudies.headline}
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-neutral-500 font-light text-sm leading-relaxed">
              {SITE_COPY.caseStudies.description}
            </p>
          </div>
        </div>

        {/* Editorial Story Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Selection Rail */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {CASE_STUDIES.map((study, index) => (
              <button
                key={study.id}
                onClick={() => setActiveID(study.id)}
                className={`text-left p-6 border transition-all duration-300 flex flex-col justify-between ${
                  activeID === study.id
                    ? "border-brand-gold bg-[#0a0a0a]"
                    : "border-neutral-900 bg-transparent hover:border-neutral-800"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] text-neutral-500">
                    CASE STUDY 0{index + 1}
                  </span>
                  <span className="font-mono text-[10px] text-brand-gold">
                    {study.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-neutral-200 group-hover:text-white mb-2 leading-snug">
                  {study.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Right Widescreen Editorial Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWin.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-[#070707] border border-neutral-900 p-8 md:p-12 relative overflow-hidden"
              >
                {/* Visual Accent Box */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand-gold/5 blur-3xl pointer-events-none rounded-full"></div>

                <div className="flex items-center space-x-3 mb-8">
                  <span className="font-mono text-[10px] text-[#8b947c] uppercase tracking-[0.25em]">
                    Strategy & Execution
                  </span>
                </div>

                <h3 className="font-serif text-3xl md:text-4xl text-white font-medium mb-6 leading-tight">
                  {activeWin.title}
                </h3>

                <p className="text-neutral-400 font-light text-base leading-relaxed mb-10 max-w-2xl border-l-2 border-neutral-800 pl-6 italic">
                  "{activeWin.description}"
                </p>

                {/* Main Premium Outcome Container */}
                <div className="bg-[#0c0c0c] border border-neutral-900 p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-4 h-4 text-brand-gold" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#a3a3a3]">
                      Strategic Outcome
                    </span>
                  </div>
                  
                  <p className="font-serif text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
                    {activeWin.outcome}
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
