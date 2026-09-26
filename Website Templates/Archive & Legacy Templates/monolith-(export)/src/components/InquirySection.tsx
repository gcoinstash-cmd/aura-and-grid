import React from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { SITE_COPY } from "../data";

interface InquirySectionProps {
  onOpenInquiry: () => void;
}

/**
 * InquirySection Component
 * Prompts the visitor to launch a narrative engagement inquiry.
 * Engineered with dynamic content mapping and high-end button micro-interactions
 * to offer immediate, heavy tactical feedback on touch patterns.
 */
export default function InquirySection({ onOpenInquiry }: InquirySectionProps) {
  return (
    <section
      id="inquiry-cta"
      className="py-24 md:py-36 bg-black relative border-b border-neutral-900 overflow-hidden"
    >
      {/* Editorial graphics framing */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 border-l border-neutral-900/60 pointer-events-none hidden lg:block">
        <div className="h-full w-full flex items-center justify-center opacity-[0.015]">
          <span className="font-display font-extrabold text-[12vw] select-none text-neutral-100">
            MNLT
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
            {SITE_COPY.inquiry.label}
          </span>
          
          <h2
            id="inquiry-headline"
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-medium leading-[1.1] tracking-tight mb-6"
          >
            {SITE_COPY.inquiry.headline}
          </h2>

          <p
            id="inquiry-body"
            className="text-neutral-400 font-light text-base md:text-lg leading-relaxed mb-10 max-w-2xl"
          >
            {SITE_COPY.inquiry.body}
          </p>

          <button
            id="open-inquiry-trigger"
            onClick={onOpenInquiry}
            className="group flex items-center space-x-4 bg-[#8b947c] hover:bg-[#9ca58d] active:scale-[0.98] active:bg-[#7a836c] text-[#050505] font-semibold font-mono text-[11px] uppercase tracking-widest py-4 px-10 transition-all transform duration-200 pointer-events-auto cursor-pointer"
          >
            <span>{SITE_COPY.inquiry.buttonText}</span>
            <ArrowUpRight className="w-4 h-4 text-[#050505] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>

          {/* Secure partner advisory badge */}
          <div className="mt-12 flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            <span>{SITE_COPY.inquiry.footerBadge}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
