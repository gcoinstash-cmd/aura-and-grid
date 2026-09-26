/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GalaEvent } from "../types";
import { Play, Pause, Compass, Music, Sliders, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GalaJournalProps {
  events: GalaEvent[];
  onOpenRsvp: (eventName: string) => void;
}

export default function GalaJournal({ events, onOpenRsvp }: GalaJournalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredBlueprint, setHoveredBlueprint] = useState<string | null>(null);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  if (!activeEvent) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12" id="gala-journal-section">
      {/* Narrative Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-charcoal pb-8 mb-12">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase block mb-2 font-sans font-medium">
            01 / Curated Archives
          </span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-stark-white font-light tracking-wide leading-none tracking-tight">
            Le Journal d'Exception
          </h2>
        </div>
        <p className="max-w-md text-xs tracking-wider text-platinum/70 leading-relaxed font-sans font-light mt-4 md:mt-0">
          A physical-magazine-inspired view of upcoming bespoke atmospheres. These celebrations represent our signature sensory blueprints: engineered to the millimeter.
        </p>
      </div>

      {/* Grid Layout: Editorial Magazine spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Event Selector Rail (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <span className="text-[10px] tracking-[0.2em] text-platinum/40 uppercase block font-sans">
            SELECT ATMOSPHERE
          </span>
          <div className="space-y-4">
            {events.map((event, index) => {
              const isSelected = event.id === selectedEventId;
              return (
                <button
                  key={event.id}
                  id={`event-select-${event.id}`}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-6 border transition-all duration-500 cursor-pointer ${
                    isSelected
                      ? "bg-charcoal-deep border-gold text-stark-white shadow-xl shadow-obsidian"
                      : "bg-obsidian border-charcoal hover:border-platinum/30 text-platinum/60"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] tracking-widest text-[#A3842C]">
                      MODEL 0{index + 1}
                    </span>
                    <span className="font-sans text-[10px] tracking-wider uppercase bg-charcoal px-2 py-0.5 text-platinum/70">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-light leading-tight mb-1">
                    {event.title}
                  </h3>
                  <p className="font-mono text-[9px] tracking-widest text-platinum/40 uppercase">
                    {event.location}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick Stats Block inside left rail */}
          <div className="border border-charcoal/80 bg-obsidian p-6 mt-8 space-y-4">
            <span className="text-[10px] tracking-[0.2em] text-[#A3842C] uppercase block">
              SPECIFICATIONS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] text-platinum/40 uppercase">FOOTPRINT</p>
                <p className="text-sm font-mono text-stark-white">{activeEvent.squareFootage}</p>
              </div>
              <div>
                <p className="text-[9px] text-platinum/40 uppercase">VOLUME</p>
                <p className="text-sm font-mono text-stark-white">{activeEvent.guestCount}</p>
              </div>
              <div>
                <p className="text-[9px] text-platinum/40 uppercase">ACOUSTICS</p>
                <p className="text-xs font-serif text-stark-white italic">{activeEvent.acousticTheme}</p>
              </div>
              <div>
                <p className="text-[9px] text-platinum/40 uppercase">CHRONOLOGY</p>
                <p className="text-xs font-mono text-stark-white">{activeEvent.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Editorial Presentation (8 columns) */}
        <div className="lg:col-span-8 space-y-12 bg-charcoal-deep/30 border border-charcoal/50 p-6 md:p-10">
          
          {/* Header containing large titles and quick location tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold">
              <MapPin size={12} />
              <span className="text-[10px] tracking-[0.25em] font-sans uppercase font-medium">{activeEvent.venue}</span>
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-light text-stark-white leading-none tracking-tight">
              {activeEvent.title}
            </h1>
            <p className="text-lg font-serif italic text-[#E5E5E5]/80 font-light pl-1">
              &ldquo;{activeEvent.subtitle}&rdquo;
            </p>
          </div>

          {/* ArchitecturalView Blueprint Toggle: Interactive hover swaps photo for details blueprint */}
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] text-platinum/40 uppercase block font-sans">
              ARCHITECTURAL COMPOSITE (HOVER OR CLICK TO VIEW BLUEPRINT)
            </span>
            <div
              id="blueprint-toggle-frame"
              className="relative aspect-video overflow-hidden border border-charcoal cursor-crosshair group bg-obsidian"
              onMouseEnter={() => setHoveredBlueprint(activeEvent.id)}
              onMouseLeave={() => setHoveredBlueprint(null)}
              onClick={() => {
                setHoveredBlueprint((prev) => (prev === activeEvent.id ? null : activeEvent.id));
              }}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={activeEvent.photoUrl}
                  alt={activeEvent.title}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    hoveredBlueprint === activeEvent.id ? "opacity-0" : "opacity-90"
                  }`}
                />
                <img
                  src={activeEvent.blueprintUrl}
                  alt={`${activeEvent.title} Blueprint`}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    hoveredBlueprint === activeEvent.id ? "opacity-90" : "opacity-0"
                  }`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/45 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 bg-obsidian/90 border border-charcoal backdrop-blur-md px-3 py-1.5 text-[9px] tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                {hoveredBlueprint === activeEvent.id ? "Technical Cad Schematic" : "Final Completed Ambience"}
              </div>

              {/* Guide prompt */}
              <div className="absolute top-4 right-4 bg-obsidian/80 backdrop-blur-sm border border-charcoal/60 rounded px-2 py-1 text-[8px] uppercase font-mono tracking-wider text-platinum/60">
                Tap image to toggle schematic
              </div>
            </div>
          </div>

          {/* Editorial Narrative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-charcoal py-10 my-8">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.25em] text-gold uppercase block font-sans">
                CONCEPT STATEMENT
              </span>
              <p className="text-sm font-sans font-light leading-relaxed text-platinum/80 text-justify">
                {activeEvent.editorialText}
              </p>
              <button
                id="rsvp-trigger-btn"
                onClick={() => onOpenRsvp(activeEvent.title)}
                className="inline-block border-b border-gold hover:border-stark-white pb-1 text-[10px] font-sans uppercase tracking-[0.3em] font-medium text-stark-white hover:text-gold transition-colors duration-300 mt-4 cursor-pointer"
              >
                REQUEST EXCLUSIVE ACCESS &rarr;
              </button>
            </div>

            {/* ScentNotes visualization */}
            <div className="space-y-4 bg-charcoal-deep/60 p-6 border border-charcoal/40">
              <span className="text-[10px] tracking-[0.25em] text-gold uppercase block font-sans">
                OLFACTORY ATMOSPHERE
              </span>
              <div className="space-y-4 font-sans text-xs">
                <div className="flex gap-4 items-start pb-3 border-b border-charcoal/40">
                  <span className="text-[10px] font-mono text-gold mt-0.5">01</span>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-platinum/40">TOP NOTE</h5>
                    <p className="font-serif italic text-sm text-stark-white">{activeEvent.scentProfile.top}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pb-3 border-b border-charcoal/40">
                  <span className="text-[10px] font-mono text-gold mt-0.5">02</span>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-platinum/40">HEART NOTE</h5>
                    <p className="font-serif italic text-sm text-stark-white">{activeEvent.scentProfile.heart}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-[10px] font-mono text-gold mt-0.5">03</span>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-platinum/40">BASE NOTE</h5>
                    <p className="font-serif italic text-sm text-stark-white">{activeEvent.scentProfile.base}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Waveform Player component: Sonic textures visualised */}
          <div className="bg-obsidian border border-charcoal p-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-platinum/40 font-mono tracking-widest uppercase">
                  ACOUSTIC CADENCE / {activeEvent.bpm} BPM
                </p>
                <h4 className="text-xs tracking-[0.25em] text-stark-white uppercase font-sans font-semibold">
                  {activeEvent.acousticTheme}
                </h4>
              </div>
              <button
                id="play-music-toggle"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full border border-charcoal bg-charcoal-deep flex items-center justify-center text-gold hover:text-stark-white hover:border-gold transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
              </button>
            </div>

            {/* Custom soundwave visualization reacting to playing state & idling */}
            <div className="h-16 flex items-center gap-[2px] pt-4 px-2">
              {activeEvent.waveformSeed.map((height, i) => {
                // Staggered continuous fluid wave durations to create ambient visual motion
                const durationIdle = 2.0 + (i % 8) * 0.2;
                const durationPlaying = 0.8 + (i % 5) * 0.15;

                return (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            height: [`${height * 0.3}%`, `${height * 1.0}%`, `${height * 0.3}%`],
                          }
                        : {
                            height: [`${height * 0.25}%`, `${height * 0.45}%`, `${height * 0.25}%`],
                          }
                    }
                    transition={{
                      duration: isPlaying ? durationPlaying : durationIdle,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`flex-1 transition-colors duration-500 ${
                      isPlaying ? "bg-gold" : "bg-charcoal-light/70 hover:bg-gold-muted/40"
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-platinum/30 uppercase tracking-widest">
              <span>0:00 MASTER MIX</span>
              <span className="flex items-center gap-1">
                <Music size={8} /> LIVE PREVIEW FEED
              </span>
              <span>2:45 DIGITAL LINK</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
