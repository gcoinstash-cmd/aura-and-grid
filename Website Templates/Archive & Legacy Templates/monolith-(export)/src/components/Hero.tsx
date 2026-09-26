import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SITE_COPY } from "../data";

interface HeroProps {
  onOpenInquiry: () => void;
}

/**
 * Hero Component
 * Sets the editorial atmosphere of the landing experience.
 * Employs heavy asymmetric column margins and premium typography pairing:
 * serif headings paired with minimal metadata labels.
 */
export default function Hero({ onOpenInquiry }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-40 pb-24 px-6 md:px-12 flex flex-col justify-center overflow-hidden bg-[#050505] border-b border-neutral-900"
    >
      {/* Editorial geometric line framework in the background to evoke a drafted blueprint look */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 relative flex justify-between">
          <div className="w-[1px] h-full bg-neutral-900/10 md:bg-neutral-900/25"></div>
          <div className="hidden md:block w-[1px] h-full bg-neutral-900/15"></div>
          <div className="w-[1px] h-full bg-neutral-900/10 md:bg-neutral-900/25"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content (Left aligned, heavy visual offset) */}
        <div className="lg:col-span-11 flex flex-col justify-center">
          
          {/* Subtle Accent Label */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8b947c]">
              {SITE_COPY.hero.accent}
            </span>
          </div>

          {/* Headline Container */}
          <div className="mb-10">
            <motion.h1
              id="hero-headline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05] text-neutral-100 max-w-5xl"
            >
              {SITE_COPY.hero.headline}
            </motion.h1>
          </div>

          {/* Horizontal rule separator */}
          <div className="w-16 h-[1px] bg-brand-gold/60 mb-10"></div>

          {/* Subcopy & Asymmetrical Editorial Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-14">
            <div className="md:col-span-7">
              <p
                id="hero-subcopy"
                className="text-neutral-400 font-light text-base md:text-lg leading-relaxed max-w-full"
              >
                {SITE_COPY.hero.subcopy}
              </p>
            </div>
            
            <div className="md:col-span-5 md:pl-10 flex flex-col justify-center space-y-2 border-l border-neutral-900 h-full min-h-[90px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                {SITE_COPY.hero.sidebarLabel}
              </span>
              <span className="font-serif italic text-neutral-500 text-sm leading-relaxed">
                {SITE_COPY.hero.sidebarText}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-primary-cta"
              onClick={onOpenInquiry}
              className="group relative flex items-center justify-between sm:justify-start space-x-4 bg-white text-black py-4 px-8 font-mono text-[11px] uppercase tracking-widest font-semibold transition-transform duration-300 active:scale-[0.98] border border-white"
            >
              <span>Start a project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <a
              id="hero-secondary-cta"
              href="#wins"
              className="group flex items-center justify-between sm:justify-start space-x-3 border border-neutral-800 hover:border-neutral-500 py-4 px-8 font-mono text-[11px] uppercase tracking-widest font-medium text-neutral-300 hover:text-white transition-colors duration-300"
            >
              <span>View results</span>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
