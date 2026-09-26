import React from "react";
import { SERVICES_LIST, SITE_COPY } from "../data";
import { Hammer, CircleAlert, Newspaper, Shield, Sparkles, UserCheck } from "lucide-react";

/**
 * Services Component
 * Lists primary consulting capabilities in a structured, high-contrast two-column list.
 */
export default function Services() {
  // Helper to map icons appropriately
  const getSubIcon = (idx: string) => {
    switch (idx) {
      case "01":
        return <Newspaper className="w-5 h-5 text-[#8b947c]" />;
      case "02":
        return <UserCheck className="w-5 h-5 text-[#8b947c]" />;
      case "03":
        return <Sparkles className="w-5 h-5 text-[#8b947c]" />;
      case "04":
        return <Hammer className="w-5 h-5 text-[#8b947c]" />;
      case "05":
        return <Shield className="w-5 h-5 text-[#8b947c]" />;
      case "06":
        return <CircleAlert className="w-5 h-5 text-[#8b947c]" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="services"
      className="py-24 md:py-36 bg-[#050505] relative border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
            {SITE_COPY.services.label}
          </span>
          <h2
            id="services-headline"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-[1.1] tracking-tight"
          >
            {SITE_COPY.services.headline}
          </h2>
        </div>

        {/* Structural List / Grid Layout with heavy dividers */}
        <div className="border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {SERVICES_LIST.map((service) => (
            <div
              key={service.id}
              className="py-12 border-b border-neutral-900 hover:border-neutral-700 transition-colors duration-300 flex flex-col md:flex-row items-start justify-between gap-6 group"
            >
              {/* Left Indicator Index */}
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xs text-neutral-600 group-hover:text-brand-gold transition-colors block">
                  {service.idx}
                </span>
                <div className="p-2.5 bg-[#0a0a0a] border border-neutral-900 group-hover:border-neutral-800 transition-colors">
                  {getSubIcon(service.idx)}
                </div>
              </div>

              {/* Main Text Info */}
              <div className="flex-1 md:pl-4">
                <h3 className="font-serif text-2xl text-neutral-100 group-hover:text-white transition-colors mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Bottom Accent Indicator */}
        <div className="mt-16 flex items-center justify-between text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em] border border-neutral-900 py-4 px-6 bg-[#030303]">
          <div className="flex items-center space-x-2">
            <span>{SITE_COPY.services.footerLeft}</span>
          </div>
          <span className="hidden sm:inline">{SITE_COPY.services.footerRight}</span>
        </div>

      </div>
    </section>
  );
}
