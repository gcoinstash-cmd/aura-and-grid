import React, { useState } from "react";
import { BLUEPRINT_SPECS } from "../data";
import { BlueprintSpec } from "../types";
import { Compass, Hammer, ShieldCheck, MapPin } from "lucide-react";

export default function Anatomy() {
  const [activeSpecId, setActiveSpecId] = useState<string>("welt");

  const activeSpec = BLUEPRINT_SPECS.find((s) => s.id === activeSpecId) || BLUEPRINT_SPECS[2];

  // Helper icons depending on the selected section to enhance the aesthetic
  const getFeatureIcon = (id: string) => {
    switch (id) {
      case "last":
        return <Compass className="w-5 h-5 text-accent" />;
      case "upper":
        return <Hammer className="w-5 h-5 text-accent" />;
      case "welt":
        return <ShieldCheck className="w-5 h-5 text-accent" />;
      case "sole":
        return <MapPin className="w-5 h-5 text-accent" />;
      default:
        return <Compass className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section
      className="py-24 bg-bg-secondary border-t border-bg-tertiary relative overflow-hidden"
      id="anatomy-section"
    >
      {/* Mesh/Grid subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Core Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono tracking-[0.3em] text-accent block uppercase">
            ARCHITECTURAL ENGINEERING
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-[#FFFFFF] tracking-tight">
            The Anatomy of Craft
          </h2>
          <p className="text-text-secondary text-sm font-sans font-light leading-relaxed">
            Every millimeter of an Aethel shoe is calculated to balance anatomical skeletal strain 
            against lifelong structural wear. Click the high-precision anchors below to study the breakdown.
          </p>
        </div>

        {/* Master Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Panel: The Interactive Schematic Diagram (L_7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-bg-primary border border-bg-tertiary p-8 md:p-12 relative overflow-hidden aspect-[4/3] group shadow-2xl">
            
            {/* Technical Stamp Details */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-text-secondary select-none">
              [ REF-SPEC: GOODYEAR-CH-01 // R-FDL ]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-accent/60 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping inline-block" />
              <span>INTERACTIVE RAY TRACING DIAGRAM</span>
            </div>

            {/* High-Precision SVG shoe side blueprint cross-section */}
            <div className="relative w-full max-w-lg select-none" style={{ aspectRatio: "500 / 240" }}>
              
              <svg
                viewBox="0 0 500 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-accent opacity-90 select-none pb-0"
              >
                {/* Structural Outer Shoes profile lines */}
                <path
                  d="M10 210 C50 208, 65 208, 120 208 C170 208, 220 205, 270 190 C340 170, 390 140, 420 100 C450 60, 480 50, 490 80 C500 110, 495 190, 490 200 C485 210, 455 212, 420 212 C350 212, 290 215, 240 215 C190 215, 120 218, 90 220 L10 220 Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  className="opacity-40"
                />
                
                {/* Inner Last block lines rendering inside the shoe */}
                <path
                  d="M40 205 C100 205, 140 205, 180 200 C210 195, 260 180, 290 160 C320 140, 360 85, 380 75 C400 65, 415 65, 430 75 C440 85, 450 110, 445 150 C440 190, 420 203, 395 204"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="opacity-70"
                />

                {/* Upper curve leather panel */}
                <path
                  d="M120 208 C150 150, 240 90, 360 80 C390 78, 430 78, 440 90 C455 110, 465 170, 460 202"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Welt Line along the bottom edge */}
                <path
                  d="M15 211 L485 211"
                  stroke="white"
                  strokeWidth="1"
                  className="opacity-50"
                />
                <path
                  d="M20 215 L480 215"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Heel Block outline */}
                <path
                  d="M10 210 L10 226 C40 228, 80 228, 95 226 L95 210"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                {/* Internal Cork filling lining texture */}
                <path
                  d="M130 208 C180 206, 250 205, 300 195"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                />
              </svg>

              {/* Clicking coordinates - overlay absolute anchor points */}
              
              {/* Point 1: The Last (Located upper-center of shoe frame) */}
              <button
                onClick={() => setActiveSpecId("last")}
                className="absolute top-[62%] left-[52%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                aria-label="Select Last Anatomical Feature"
              >
                <span className={`absolute -inset-3 rounded-full animate-ping duration-1000 ${activeSpecId === "last" ? "bg-accent/30" : "bg-transparent group-hover:bg-accent/10"}`} />
                <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-mono transition-luxury ${
                  activeSpecId === "last" 
                    ? "bg-accent border-accent text-[#0A0A0A] font-bold" 
                    : "bg-bg-primary border-bg-tertiary text-text-secondary group-hover:border-accent group-hover:text-text-primary animate-luxury-glow"
                }`}>
                  01
                </span>
                <span className="absolute left-10 top-1.5 whitespace-nowrap hidden md:inline text-[9px] font-mono tracking-widest text-text-secondary group-hover:text-accent bg-bg-primary/95 px-2 py-0.5 border border-bg-tertiary">
                  THE LAST
                </span>
              </button>

              {/* Point 2: The Upper (Located on upper calfskin curve) */}
              <button
                onClick={() => setActiveSpecId("upper")}
                className="absolute top-[46%] left-[44%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                aria-label="Select Upper Leather Feature"
              >
                <span className={`absolute -inset-3 rounded-full animate-ping duration-1000 ${activeSpecId === "upper" ? "bg-accent/30" : "bg-transparent group-hover:bg-accent/10"}`} />
                <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-mono transition-luxury ${
                  activeSpecId === "upper" 
                    ? "bg-accent border-accent text-[#0A0A0A] font-bold" 
                    : "bg-bg-primary border-bg-tertiary text-text-secondary group-hover:border-accent group-hover:text-text-primary animate-luxury-glow"
                }`}>
                  02
                </span>
                <span className="absolute left-10 top-1.5 whitespace-nowrap hidden md:inline text-[9px] font-mono tracking-widest text-text-secondary group-hover:text-accent bg-bg-primary/95 px-2 py-0.5 border border-bg-tertiary">
                  THE UPPER
                </span>
              </button>

              {/* Point 3: The Goodyear Welt (Located inline with welt stitch line) */}
              <button
                onClick={() => setActiveSpecId("welt")}
                className="absolute top-[87%] left-[60%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                aria-label="Select Goodyear Welt Feature"
              >
                <span className={`absolute -inset-3 rounded-full animate-ping duration-1000 ${activeSpecId === "welt" ? "bg-accent/30" : "bg-transparent group-hover:bg-accent/10"}`} />
                <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-mono transition-luxury ${
                  activeSpecId === "welt" 
                    ? "bg-accent border-accent text-[#0A0A0A] font-bold" 
                    : "bg-bg-primary border-bg-tertiary text-text-secondary group-hover:border-accent group-hover:text-text-primary animate-luxury-glow"
                }`}>
                  03
                </span>
                <span className="absolute left-10 top-1.5 whitespace-nowrap hidden md:inline text-[9px] font-mono tracking-widest text-text-secondary group-hover:text-accent bg-bg-primary/95 px-2 py-0.5 border border-bg-tertiary">
                  GOODYEAR WELT
                </span>
              </button>

              {/* Point 4: Oak-Bark Sole (Located beneath the leather sole block) */}
              <button
                onClick={() => setActiveSpecId("sole")}
                className="absolute top-[91%] left-[10%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                aria-label="Select Sole Tannery Feature"
              >
                <span className={`absolute -inset-3 rounded-full animate-ping duration-1000 ${activeSpecId === "sole" ? "bg-accent/30" : "bg-transparent group-hover:bg-accent/10"}`} />
                <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-mono transition-luxury ${
                  activeSpecId === "sole" 
                    ? "bg-accent border-accent text-[#0A0A0A] font-bold" 
                    : "bg-bg-primary border-bg-tertiary text-text-secondary group-hover:border-accent group-hover:text-text-primary animate-luxury-glow"
                }`}>
                  04
                </span>
                <span className="absolute left-10 top-1.5 whitespace-nowrap hidden md:inline text-[9px] font-mono tracking-widest text-[#FFFFFF] group-hover:text-accent bg-bg-primary/95 px-2 py-0.5 border border-bg-tertiary">
                  OAK-BARK SOLE
                </span>
              </button>

            </div>

            {/* Quick click controls selectors */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-2 w-full max-w-xs">
              {BLUEPRINT_SPECS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSpecId(s.id)}
                  className={`text-[9px] font-mono px-3 py-1.5 transition-luxury shrink-0 ${
                    activeSpecId === s.id
                      ? "bg-bg-tertiary text-accent border border-accent/20"
                      : "text-text-secondary hover:text-text-primary border border-transparent"
                  }`}
                >
                  {s.id.toUpperCase()}
                </button>
              ))}
            </div>

          </div>

          {/* Right Panel: The Spec Description Tray (L_5 cols) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between" id="blueprint-description-tray">
            <div className="bg-bg-primary border border-bg-tertiary p-8 space-y-6 md:p-10 h-full flex flex-col justify-center">
              
              <div className="flex items-center space-x-4 border-b border-bg-tertiary pb-6">
                <span className="text-3xl font-mono text-accent italic font-light">
                  {activeSpec.number}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-light text-text-primary tracking-tight">
                    {activeSpec.title}
                  </h3>
                  <span className="text-[10px] font-mono text-text-secondary tracking-widest block uppercase mt-0.5">
                    {activeSpec.subtitle}
                  </span>
                </div>
              </div>

              {/* Sourcing Stage High Resolution Photo */}
              {activeSpec.image && (
                <div className="relative w-full aspect-[2/1] overflow-hidden border border-bg-tertiary bg-[#0A0A0A]/40 group-hover:border-accent/40 transition-colors">
                  <img
                    src={activeSpec.image}
                    alt={activeSpec.title}
                    className="w-full h-full object-cover grayscale brightness-90 contrast-[1.05] hover:scale-105 transition-all duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg-primary to-transparent opacity-80" />
                  <div className="absolute top-2 left-2 bg-[#0A0A0A]/90 border border-bg-tertiary text-[7px] font-mono tracking-widest text-accent uppercase px-2 py-0.5">
                    STAGE_{activeSpec.number}_SEC_DETAIL
                  </div>
                </div>
              )}

              {/* Sourcing Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-accent">
                  {getFeatureIcon(activeSpec.id)}
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    Material & Sourcing Process
                  </span>
                </div>
                <p className="text-text-secondary font-sans text-sm font-light leading-relaxed">
                  {activeSpec.sourcing}
                </p>
              </div>

              {/* Origin Section */}
              <div className="space-y-1 bg-bg-secondary p-4 border border-bg-tertiary">
                <span className="text-[9px] font-mono text-text-secondary tracking-widest block uppercase">
                  Tannery House & Provenance
                </span>
                <span className="text-xs font-mono text-accent font-medium block">
                  {activeSpec.origin}
                </span>
              </div>

              {/* Lifespan/Longevity Section */}
              <div className="space-y-2 border-t border-bg-tertiary/60 pt-6">
                <span className="text-[10px] font-mono tracking-widest text-text-primary block uppercase">
                  Longevity Metric & Aging
                </span>
                <p className="text-text-secondary font-sans text-xs font-light leading-relaxed italic">
                  "{activeSpec.longevity}"
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
