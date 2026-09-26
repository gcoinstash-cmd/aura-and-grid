import React from "react";
import { ChevronDown, Sparkles } from "lucide-react";

interface HeroProps {
  onEnterAtelier: () => void;
}

export default function Hero({ onEnterAtelier }: HeroProps) {
  return (
    <section
      className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-bg-primary overflow-hidden"
      id="aethel-hero-experience"
    >
      {/* Decorative Golden Ambient Backlight */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Layout Container */}
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Left Panel: Symmetrical & Asymmetrical Typography */}
        <div className="flex flex-col space-y-8 text-left z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-mono tracking-[0.2em] text-accent uppercase">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>THE 2026 EDITION LOOKBOOK</span>
            </div>
            
            <h1 className="font-display font-light text-5xl lg:text-7xl leading-[1.1] text-text-primary tracking-tight">
              Aethel.<br />
              <span className="italic font-normal text-accent font-display">Archetypes</span> of<br />
              Hand-Lasted Lineage.
            </h1>
          </div>

          <p className="text-text-secondary font-sans text-sm md:text-base leading-relaxed max-w-lg font-light">
            We operate at the severe intersection of anatomical truth and historic footwear craftsmanship. 
            Every single pair of Aethel shoes undergoes more than 200 meticulous hand-operations—spanning 
            from our custom hornbeam wood lasts to genuine JR oak-bark pits and neat Goodyear stitching.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-bg-tertiary pt-8 max-w-md">
            <div>
              <span className="block text-xl font-display text-text-primary font-medium">200+</span>
              <span className="block text-[9px] font-mono tracking-widest text-text-secondary uppercase">Stitches Room</span>
            </div>
            <div>
              <span className="block text-xl font-display text-text-primary font-medium">9 Mo.</span>
              <span className="block text-[9px] font-mono tracking-widest text-text-secondary uppercase">Bark Tanned</span>
            </div>
            <div>
              <span className="block text-xl font-display text-text-primary font-medium">Bespoke</span>
              <span className="block text-[9px] font-mono tracking-widest text-text-secondary uppercase">Anatomy Last</span>
            </div>
          </div>

          {/* Micro-Interaction Wrapper */}
          <div className="pt-4 flex flex-wrap items-center gap-6">
            <button
              onClick={onEnterAtelier}
              className="relative group inline-flex items-center text-xs tracking-[0.2em] font-mono uppercase bg-accent text-[#0A0A0A] font-medium py-4 px-8 rounded-none border border-accent hover:bg-transparent transition-luxury cursor-pointer"
              id="hero-enter-atelier-btn"
            >
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1.5 text-bg-primary group-hover:text-accent font-bold">[</span>
              <span className="mx-1.5 transition-colors duration-500 text-bg-primary group-hover:text-accent font-semibold">Enter Atelier</span>
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 text-bg-primary group-hover:text-accent font-bold">]</span>
            </button>
            
            <button
              onClick={() => {
                const spec = document.getElementById("anatomy-section");
                spec?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group inline-flex items-center space-x-2 text-xs tracking-widest text-text-secondary hover:text-[#FFFFFF] transition-colors font-mono py-2 py-4"
              id="hero-view-blueprint-btn"
            >
              <span>DISCOVER ANATOMY</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Right Panel: Premium video wrapper simulation */}
        <div className="relative group w-full aspect-[4/5] max-w-lg mx-auto overflow-hidden bg-bg-secondary border border-bg-tertiary shadow-2xl">
          {/* Framed Image Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan sewing bespoke calfskin boot"
              className="w-full h-full object-cover grayscale brightness-75 scale-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Cinematic Gold Scanning Frame */}
          <div className="absolute inset-4 border border-accent/20 group-hover:border-accent/40 z-10 transition-colors pointer-events-none" />

          {/* Atelier Stamp Coordinates */}
          <div className="absolute top-6 left-6 z-20 mix-blend-difference opacity-80">
            <div className="text-[10px] font-mono tracking-widest uppercase text-accent">
              COORD. AETH-1.2
            </div>
            <div className="text-[8px] font-mono text-text-secondary">
              [ 51.5074° N, 0.1278° W ]
            </div>
          </div>

          {/* Aesthetic Real-Time Detail Tag */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end bg-bg-primary/90 border border-bg-tertiary p-4 backdrop-blur-sm">
            <div>
              <span className="block text-[8px] font-mono tracking-widest text-accent uppercase">ARTISANAL PH-04</span>
              <h3 className="font-display text-sm font-medium text-text-primary mt-1">Carving Thread Alignment</h3>
            </div>
            <span className="text-[9px] font-mono text-text-secondary bg-bg-tertiary px-2 py-1 uppercase">
              Live Loop
            </span>
          </div>

          {/* Scanning Line overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent h-1/2 w-full animate-pulse pointer-events-none z-10" />
        </div>

      </div>

      {/* Elegant Infinite Scroll Indicator */}
      <div 
        onClick={onEnterAtelier}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] text-text-secondary uppercase mb-2">
          Vertical Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
      </div>
    </section>
  );
}
