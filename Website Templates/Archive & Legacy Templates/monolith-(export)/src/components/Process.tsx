import React from "react";
import { PROCESS_STEPS, SITE_COPY } from "../data";

/**
 * Process Component
 * Visualizes a multi-step engagement roadmap inside a modern grid layout with smooth, subtle hover transitions.
 */
export default function Process() {
  return (
    <section
      id="process"
      className="py-24 md:py-36 bg-[#030303] relative border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
            {SITE_COPY.process.label}
          </span>
          <h2
            id="process-headline"
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-100 font-medium tracking-tight max-w-xl"
          >
            {SITE_COPY.process.headline}
          </h2>
        </div>

        {/* Steps Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border-l border-t border-neutral-900">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="border-r border-b border-neutral-900 bg-[#050505]/40 hover:bg-[#070707] transition-all duration-300 p-8 flex flex-col justify-between min-h-[300px] group cursor-default"
            >
              <div>
                <span className="font-mono text-xs text-[#8b947c] block mb-12 uppercase tracking-widest font-medium">
                  Phase {step.number}
                </span>
                
                <h3 className="font-serif text-xl text-neutral-200 group-hover:text-white transition-colors duration-300 mb-4 tracking-snug">
                  {step.title}
                </h3>
              </div>
              
              <div>
                <p className="text-neutral-500 font-light text-xs md:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
