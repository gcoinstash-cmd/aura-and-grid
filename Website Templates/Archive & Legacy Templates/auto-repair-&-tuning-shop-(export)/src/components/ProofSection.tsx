import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data';
import { TestimonialRecord } from '../types';
import { Star, Shield, Image, Sparkles, MessageSquare, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

export default function ProofSection() {
  const [selectedReviewIdx, setSelectedReviewIdx] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(50); // percentage of 'before' cover width

  const activeReview = TESTIMONIALS[selectedReviewIdx];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPercent(Number(e.target.value));
  };

  return (
    <section id="reviews" className="relative py-20 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
      
      {/* Structural layout decorations */}
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-red-650/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Blocks Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-orange bg-accent-orange/5 px-3 py-1 rounded-full uppercase">
            <span>[ VERIFIED PROOF ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Before & After Results Grid
          </h2>
          <p className="text-zinc-500 font-sans text-sm font-light">
            Don't take our word for it. Review certified mechanical telemetry reports, paint correction, and structural results. Drag the slider below to test the finish.
          </p>
        </div>

        {/* Outer Split layout: Left dynamic slider, Right reviews list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* LEFT: THE INTERACTIVE BEFORE/AFTER SLIDER (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-accent-orange animate-spin-slow" />
              Interactive Surface Slider
            </h3>

            {/* Slider Container Box */}
            <div className="relative h-[350px] sm:h-[420px] rounded-2xl overflow-hidden border border-neutral-900 select-none bg-neutral-900 shadow-2xl">
              
              {/* After Image (Background) */}
              <img
                src={activeReview.afterUrl}
                alt="After precision treatment"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 contrasts-125"
              />
              {/* After label */}
              <div className="absolute bottom-4 right-4 z-20 bg-emerald-500/90 text-black font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-emerald-400 shadow-lg select-none">
                AFTER // TREATED
              </div>

              {/* Before Image (Foreground overlay clip) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden z-10 pointer-events-none"
                style={{ width: `${sliderPercent}%` }}
              >
                <img
                  src={activeReview.beforeUrl}
                  alt="Before treatment"
                  referrerPolicy="no-referrer"
                  className="absolute inset-y-0 left-0 w-full max-w-none h-full object-cover grayscale brightness-50 contrast-100 placeholder-blur"
                  style={{ width: '100%', minWidth: '100%', height: '100%' }}
                />
              </div>
              {/* Before label */}
              <div className="absolute bottom-4 left-4 z-20 bg-neutral-950/90 text-zinc-400 font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-neutral-800 shadow-lg select-none">
                BEFORE // INTAKE
              </div>

              {/* Physical slider bar visual overlay element */}
              <div 
                className="absolute inset-y-0 z-20 pointer-events-none"
                style={{ left: `${sliderPercent}%` }}
              >
                {/* Thin dividing glow line */}
                <div className="absolute inset-y-0 w-0.5 bg-accent-orange -left-[1px] shadow-[0_0_15px_rgba(255,95,31,0.6)]" />
                
                {/* Drag handle block */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-accent-orange text-black border border-white flex items-center justify-center shadow-2xl">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
              </div>

              {/* Real hidden range input overlay doing the math */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPercent}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Drag before and after visual slider"
              />
            </div>

            {/* Slider help prompt */}
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 bg-[#101115] border border-neutral-900 p-4 rounded-xl">
              <span className="flex items-center gap-1.5 uppercase">
                <MessageSquare className="h-4 w-4 text-accent-orange" />
                Active Vehicle Context:
              </span>
              <span className="text-white font-bold tracking-wide uppercase">
                {activeReview.vehicle}
              </span>
            </div>
          </div>

          {/* RIGHT: MASONRY FEEDBACK LIST (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Verified Client Feedbacks
            </h3>

            <div className="space-y-4">
              {TESTIMONIALS.map((review, idx) => {
                const isSelected = selectedReviewIdx === idx;
                return (
                  <motion.div
                    key={review.id}
                    onClick={() => {
                      setSelectedReviewIdx(idx);
                      setSliderPercent(50); // reset slider to center on swap
                    }}
                    className={`rounded-2xl border p-5 cursor-pointer text-left transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'border-accent-orange/40 bg-neutral-900' 
                        : 'border-neutral-900 bg-neutral-900/30 hover:border-neutral-800'
                    }`}
                  >
                    {/* Glowing highlight selector line */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-orange shadow-[0_0_10px_rgba(255,95,31,0.5)]" />
                    )}

                    {/* Star Rating & metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, rIdx) => (
                          <Star key={rIdx} className="h-3.5 w-3.5 text-accent-amber fill-accent-amber" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        {review.date}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide">
                        {review.author}
                      </h4>
                      <p className="font-mono text-[10px] text-accent-orange uppercase flex items-center gap-1">
                        <span>{review.vehicle}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 font-sans italic">{review.type}</span>
                      </p>
                      
                      <p className="text-zinc-400 text-xs font-light leading-relaxed pt-2">
                        "{review.text}"
                      </p>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
