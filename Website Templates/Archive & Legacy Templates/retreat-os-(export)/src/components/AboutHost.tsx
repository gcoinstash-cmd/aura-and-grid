import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Retreat } from '../types';
import { ChevronRight, GraduationCap } from 'lucide-react';

interface AboutHostProps {
  currentRetreat: Retreat;
  allRetreats: Retreat[];
  onSelectRetreat: (retreat: Retreat) => void;
  setCurrentTab: (tab: string) => void;
}

export default function AboutHost({ currentRetreat, allRetreats, onSelectRetreat, setCurrentTab }: AboutHostProps) {
  // Allow toggling between different hosts across the template system
  const [activeHostRetreatId, setActiveHostRetreatId] = useState<string>(currentRetreat.id);
  
  const selectedRetreat = allRetreats.find(r => r.id === activeHostRetreatId) || currentRetreat;
  const host = selectedRetreat.host;

  // Key Host-Specific Credentials & Philosophies (buyer-facing, clean, and premium)
  const hostPhilosophies: Record<string, { title: string; desc: string }[]> = {
    'soma-silence': [
      { title: 'Subtractive Focus', desc: 'True productivity occurs of its own accord when we put aside continuous modern device notifications and scrolling feeds.' },
      { title: 'Actionable Frameworks', desc: 'We avoid complex theories. We provide the practical, reusable lifestyle and work alignment tactics to help you self-regulate.' },
      { title: 'Authentic Methods', desc: 'No generic formulas. Our stress-relief tools are built from years of direct anatomical teaching.' }
    ],
    'kairou-clay': [
      { title: 'Sincere Coordination', desc: 'Any hesitation or physical tension is immediately translated into the spinning clay. Craft teaches direct physical awareness.' },
      { title: 'Adaptive Progress', desc: 'Each high-fire wood kiln is a complex ecosystem. We teach our students to adapt their techniques to organic, physical variables.' },
      { title: 'Functional Designs', desc: 'We prioritize clean proportions and timeless structural rules. True elegance comes from deliberate simplicity.' }
    ],
    'prana-surf': [
      { title: 'Anatomical Alignment', desc: 'The physical posture is your foundation. Active surf movement requires correct joint mechanics and strong focus markers.' },
      { title: 'Contrast Recovery', desc: 'By combining high-temperature dry heat and sub-zero ice immersions, we stimulate metabolic resilience and relief.' },
      { title: 'Fluid Coordination', desc: 'Physical movement should optimize natural lines rather than force unnatural poses. We tune your stance for physical sustainability.' }
    ],
  };

  const currentPhilosophies = hostPhilosophies[selectedRetreat.id] || hostPhilosophies['soma-silence'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fade-in" id="credentials-view">
      {/* Title Header */}
      <div className="border-b border-ink/15 pb-10 mb-12 md:mb-16">
        <span className="text-xs font-semibold tracking-[0.25em] text-ochre uppercase block mb-3">
          [ VERIFIED PROGRAM DIRECTORS ]
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-ink">
          Expert <span className="italic">Credentials & Experience</span>
        </h1>
        <p className="text-sm text-ink/75 font-sans tracking-wide leading-relaxed mt-4 max-w-2xl">
          We believe premium workshops require seasoned leaders. Settle issues of instructional quality with teachers who feature verifiable backgrounds, certifications, and past reviews.
        </p>

        {/* Hot host selector pills */}
        <div className="flex flex-wrap gap-2 mt-8">
          {allRetreats.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveHostRetreatId(r.id)}
              className={`px-4 py-2 border text-[10px] uppercase tracking-widest font-bold transition duration-300 rounded-sm cursor-pointer ${
                activeHostRetreatId === r.id
                  ? 'bg-ink border-ink text-alabaster font-bold'
                  : 'bg-white/40 border-ink/15 hover:border-ink/50 text-ink/80'
              }`}
            >
              Director: {r.host.name} ({r.location})
            </button>
          ))}
        </div>
      </div>

      {/* Main Asymmetric grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeHostRetreatId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        >
          {/* Column 1: Image & Highlight Credibility (Asymmetric) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-ink/10 p-3 bg-white/40 rounded-sm">
              <div className="overflow-hidden bg-[#1A1A1A]">
                <img
                  referrerPolicy="no-referrer"
                  src={host.avatarUrl}
                  alt={host.name}
                  className="w-full aspect-[4/5] object-cover filter grayscale hover:grayscale-0 transition duration-700"
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-[#FBF9F6] border border-ink/10 px-4 py-2 text-[10px] font-mono tracking-widest text-[#C4A482] font-semibold uppercase">
                {host.role}
              </div>
            </div>

            {/* Credentials Verification Box */}
            <div className="border border-ochre/20 bg-ochre/5 p-6 rounded-sm shadow-xs">
              <div className="flex items-start space-x-3">
                <GraduationCap className="text-ochre shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink">
                    Verified Background & Accreditations
                  </h4>
                  <p className="text-xs text-ink/75 leading-relaxed font-sans mt-2">
                    {host.lineage}
                  </p>
                  <p className="text-[10px] font-mono text-[#5A6455] mt-3 uppercase tracking-widest font-bold">
                    ✓ Verified Template Instructor
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Rich Copy & Core Principles */}
          <div className="lg:col-span-7 space-y-10">
            {/* Host Name Intro */}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-ochre">[ PROGRAM DIRECTOR ]</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink tracking-tight mt-1 mb-6">
                {host.name}
              </h2>
              <div className="h-[1.5px] bg-[#C4A482] w-20 mb-6" />
              <p className="text-base text-ink/80 font-sans leading-relaxed tracking-wide italic font-light">
                &ldquo;{selectedRetreat.quote.text}&rdquo;
              </p>
            </div>

            {/* Long narrative bio */}
            <div className="space-y-4 text-sm text-ink/75 leading-relaxed font-sans tracking-wide">
              <p>{host.bio}</p>
              <p>
                Having directed scores of developers, designers, and managers through structured creative retreats, {host.name} designs curriculum schedules with absolute precision. Every itinerary block, nutritional resource, and posture workout is optimized to yield maximum physical relief and strategic output.
              </p>
            </div>

            {/* Core Philosophies (Interactive List or beautiful grid) */}
            <div className="pt-4 border-t border-ink/10">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#5A6455] mb-6">
                Instructional Core Beliefs
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {currentPhilosophies.map((phil, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-ink/10 last:border-b-0">
                    <span className="font-serif text-xl italic text-ochre font-semibold shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-ink mb-1">
                        {phil.title}
                      </h4>
                      <p className="text-xs text-ink/70 leading-relaxed font-sans">
                        {phil.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action to connect with host */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-ink/10 bg-white/40 rounded-sm shadow-xs">
              <span className="text-xs text-ink/80 tracking-wide font-sans text-center sm:text-left font-medium">
                Have specific constraints or queries before completing your registration?
              </span>
              <button
                onClick={() => {
                  onSelectRetreat(selectedRetreat);
                  setCurrentTab('apply');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 transition duration-300 cursor-pointer"
              >
                Inquire via Application Form
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
