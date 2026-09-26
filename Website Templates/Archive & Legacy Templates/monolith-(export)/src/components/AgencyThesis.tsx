import React from "react";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { SITE_COPY } from "../data";

/**
 * AgencyThesis Component
 * Details the core strategic approach of the agency.
 * Utilizes a heavy column grid structure with a signature quote block.
 * The left accent border is engineered to offer an authoritative visual anchor,
 * built with expanded left padding (pl-10 md:pl-12) to keep text perfectly aligned.
 */
export default function AgencyThesis() {
  return (
    <section
      id="thesis"
      className="py-24 md:py-36 bg-[#050505] relative border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Large Editorial Left Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
                {SITE_COPY.thesis.label}
              </span>
              <h3 className="font-serif text-lg text-neutral-400 italic tracking-wide">
                {SITE_COPY.thesis.sidebarHeading}
              </h3>
            </div>
            
            <div className="hidden lg:block mt-32 border-l border-neutral-900 pl-6">
              <span className="font-mono text-[10px] text-neutral-600 block leading-relaxed uppercase tracking-widest">
                {SITE_COPY.thesis.sidebarTags.map((tag, idx) => (
                  <React.Fragment key={idx}>
                    {tag}
                    <br />
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>

          {/* Huge Main Editorial Body */}
          <div className="lg:col-span-8 lg:pl-12 border-t lg:border-t-0 lg:border-l border-neutral-900 pt-8 lg:pt-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-6 block">
              {SITE_COPY.thesis.philosophyLabel}
            </span>
            
            <h2
              id="thesis-headline"
              className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-medium leading-[1.1] tracking-tight mb-8"
            >
              {SITE_COPY.thesis.headline}
            </h2>

            <div className="w-12 h-[1px] bg-neutral-700 my-8"></div>

            <p
              id="thesis-body"
              className="font-light text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
            >
              {SITE_COPY.thesis.body}
            </p>

            {/* Inset Quote box for that extra Awwwards authority look */}
            <div className="bg-[#080808] border border-neutral-900 border-l-[3px] border-l-[#8b947c] pt-8 pb-8 pr-8 pl-10 md:pt-10 md:pb-10 md:pr-10 md:pl-12 relative overflow-hidden">
              <div className="absolute right-4 bottom-[-10px] opacity-[0.02]">
                <Quote className="w-48 h-48 text-white stroke-[1]" />
              </div>
              
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8b947c] mb-3 block">
                {SITE_COPY.thesis.quoteLabel}
              </span>
              
              <blockquote className="text-[#a3a3a3] font-serif italic text-base md:text-lg leading-relaxed relative z-10">
                "{SITE_COPY.thesis.quoteText}"
              </blockquote>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

