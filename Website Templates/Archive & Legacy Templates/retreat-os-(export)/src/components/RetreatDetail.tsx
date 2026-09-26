import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Retreat, AccommodationTier } from '../types';
import { Check, X, Calendar, MapPin, CornerDownRight, Landmark } from 'lucide-react';
import PackingMatrix from './PackingMatrix';
import PastContainers from './PastContainers';

interface RetreatDetailProps {
  currentRetreat: Retreat;
  allRetreats: Retreat[];
  onSelectRetreat: (retreat: Retreat) => void;
  onSelectLodging: (tierId: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function RetreatDetail({ 
  currentRetreat, 
  allRetreats, 
  onSelectRetreat, 
  onSelectLodging, 
  setCurrentTab 
}: RetreatDetailProps) {
  // Itinerary state tracking which day numbers are expanded
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const selectLodgingAndApply = (tier: AccommodationTier) => {
    onSelectLodging(tier.id);
    setCurrentTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Top Selector / Ribbon allowing switching between retreats to test the system design */}
      <div className="bg-white/40 border border-ink/10 pb-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-sm shadow-xs">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-ochre font-bold uppercase block mb-1">
            PREVIEW ALTERNATIVE PROGRAMS:
          </span>
          <p className="text-xs text-ink/60 font-sans">
            Select an option below to test how different content dynamically populates the layouts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allRetreats.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRetreat(r)}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border cursor-pointer rounded-sm ${
                currentRetreat.id === r.id
                  ? 'bg-ink border-ink text-alabaster font-bold'
                  : 'bg-transparent border-ink/15 hover:border-ink/40 text-ink/80'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Header Area (Magazine Cover Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-24 items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center space-x-1.5 text-xs text-[#5A6455] font-mono uppercase tracking-widest mb-3">
            <MapPin size={12} />
            <span>{currentRetreat.location}</span>
            <span>•</span>
            <Calendar size={12} />
            <span>{currentRetreat.dates}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ink leading-[1.05] mb-6">
            {currentRetreat.title}
          </h1>

          <p className="text-sm uppercase tracking-[0.25em] text-[#5A6455] font-semibold">
            {currentRetreat.subtitle}
          </p>
        </div>
        
        <div className="lg:col-span-4 lg:text-right border-l lg:border-l-0 lg:border-r border-ochre/30 pl-4 lg:pl-0 lg:pr-4 py-1">
          <p className="text-xs uppercase tracking-widest text-[#C4A482]/50 font-bold mb-1">DURATION & TUITION</p>
          <p className="font-serif text-2xl text-ink italic font-normal">{currentRetreat.durationDays}-Day Workshop</p>
          <p className="text-[10px] text-ochre tracking-wider font-mono mt-1 font-bold">From ${Math.min(...currentRetreat.accommodations.map(a => a.price))} USD — All-Inclusive</p>
        </div>
      </div>

      {/* Large Lead Paragraph & Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 md:mb-32">
        {/* Left main text info */}
        <div className="lg:col-span-7 space-y-8">
          <p className="font-serif text-xl sm:text-2xl font-light leading-relaxed text-ink/90 border-l-2 border-ochre pl-6 italic">
            {currentRetreat.narrativeOverview}
          </p>

          <div className="space-y-4 text-sm text-ink/75 leading-relaxed font-sans tracking-wide pt-4">
            <p>
              By dedicating yourself to focused instruction, posture alignments, and deep strategic work blocks, you can successfully exit daily administrative fatigue and return with absolute clarity.
            </p>
            <p>
              We maintain a small leader-to-guest ratio. Check below for our detailed daily schedule, accommodation availability, and transparent payment plans.
            </p>
          </div>

          {/* Bullet points of focus */}
          <div className="pt-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-ochre mb-6">What sets this program apart</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentRetreat.aboutDetails.map((detail, idx) => (
                <div key={idx} className="flex space-x-2">
                  <CornerDownRight className="text-[#5A6455] shrink-0 mt-0.5" size={14} />
                  <p className="text-xs text-ink/80 leading-relaxed font-sans font-semibold">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right contextual graphic banner */}
        <div className="lg:col-span-5">
          <div className="relative border border-ink/10 p-3 bg-white/40 shadow-xs">
            <img 
              referrerPolicy="no-referrer"
              src={currentRetreat.heroImage} 
              alt={currentRetreat.title} 
              className="w-full aspect-[4/3] object-cover filter grayscale brightness-[0.98] contrast-[1.01] hover:grayscale-0 transition duration-700"
            />
            <div className="pt-4 flex items-center justify-between text-[10px] tracking-widest font-mono text-[#C4A482] font-semibold uppercase">
              <span>ESTABLISHED 2026</span>
              <span>LOCKED DESIGN SYSTEM</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: THE INTERACTIVE TIMELINE / DAILY TIMELINE */}
      <div className="mb-20 md:mb-32">
        <div className="border-b border-ink/15 pb-6 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-1">01 / PROGRAM SCHEDULE & ITINERARY</span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-ink">The Daily Itinerary <span className="italic">Timeline</span></h2>
          <p className="text-xs text-ink/60 mt-2 font-sans tracking-wide">
            Click on any day below to expand the scheduled block and view hourly session focuses.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {currentRetreat.itinerary.map((day) => {
            const isExpanded = !!expandedDays[day.dayNumber];
            return (
              <div 
                key={day.dayNumber}
                className="border border-ink/10 rounded-sm overflow-hidden bg-white/50 hover:bg-white/80 transition duration-300 shadow-xs"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleDay(day.dayNumber)}
                  className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-serif text-3xl italic text-ochre font-semibold shrink-0">
                      Day {day.dayNumber}
                    </span>
                    <div className="h-6 w-[1.5px] bg-ink/10 hidden sm:block" />
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                        {day.dayTitle}
                      </h3>
                      <p className="text-[11px] text-[#5A6455] font-sans tracking-semibold font-semibold h-4 leading-4 mt-0.5">
                        Focus: {day.focus}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-ochre uppercase tracking-widest font-semibold flex items-center space-x-1.5 shrink-0">
                    <span>{isExpanded ? '[ COLLAPSE ]' : '[ EXPLORE ]'}</span>
                  </div>
                </button>

                {/* Expanded content under Framer Motion animate height */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 pt-2 border-t border-ink/10 bg-[#FBF9F6]/50">
                        <div className="relative pl-4 sm:pl-8 border-l border-ochre/30 py-2 space-y-6">
                           {day.items.map((item, index) => (
                            <div key={index} className="relative">
                              {/* Left dot marker */}
                              <span className="absolute -left-[20px] sm:-left-[37px] top-1 h-2 w-2 rounded-full bg-ochre border border-[#FBF9F6]" />
                              
                              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                                <span className="font-mono text-xs font-bold text-ochre uppercase tracking-widest min-w-[70px] pt-0.5">
                                  {item.time}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-ink/75 leading-relaxed max-w-xl font-sans font-normal">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: COMPARISON MATRIX (Included vs. Not Included) */}
      <div className="mb-20 md:mb-32">
        <div className="border-b border-ink/15 pb-6 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-1">02 / BILLING TRANSPARENCY</span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-ink">The Inclusions <span className="italic">Overview</span></h2>
          <p className="text-xs text-ink/65 mt-2 font-sans tracking-wide">
            Completely transparent fees. Clear division of program responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl">
          {/* WHAT IS INCLUDED (Sage checkmark layout) */}
          <div className="border border-ochre/20 bg-ochre/5 p-8 rounded-sm shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-ochre mb-6 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-ochre" />
              <span>Full Inclusions [ Provided by Host ]</span>
            </h3>
            <ul className="space-y-4">
              {currentRetreat.included.map((inc, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check size={14} className="text-[#5A6455] mt-0.5 shrink-0" />
                  <span className="text-xs text-ink/80 leading-relaxed font-sans">{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHAT IS NOT INCLUDED (Ink / X layout) */}
          <div className="border border-ink/10 bg-white/40 p-8 rounded-sm shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-ink/60 mb-6 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-ink/30" />
              <span>Exclusions [ Provided by Guest ]</span>
            </h3>
            <ul className="space-y-4">
              {currentRetreat.notIncluded.map((exc, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <X size={14} className="text-ink/40 mt-0.5 shrink-0" />
                  <span className="text-xs text-ink/65 leading-relaxed font-sans">{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3: MULTI-TIER ACCOMMODATIONS GRID (Asymmetric Cards) */}
      <div>
        <div className="border-b border-ink/15 pb-6 mb-10">
          <span className="text-[10px] tracking-[0.25em] text-ochre font-bold uppercase block mb-1">03 / Accommodation Details</span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-ink">Available Lodging <span className="italic">& Rates</span></h2>
          <p className="text-xs text-ink/65 mt-2 font-sans tracking-wide">
            Carefully designed rooms mapped with real spot availability indicators. Select an option below to hold your rate and proceed to application.
          </p>
        </div>

        {/* Accommodation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch max-w-5xl">
          {currentRetreat.accommodations.map((tier) => {
            const hasSpots = tier.spotsRemaining > 0;
            return (
              <div 
                key={tier.id}
                className="group border border-ink/10 bg-white/40 hover:bg-white/80 p-6 flex flex-col justify-between rounded-sm cursor-pointer transition duration-500 hover:border-ochre/50 hover:shadow-sm"
                onClick={() => selectLodgingAndApply(tier)}
              >
                <div>
                  {/* Space image frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink/5 border border-ink/10 mb-6">
                    <img 
                      referrerPolicy="no-referrer"
                      src={tier.imageUrl} 
                      alt={tier.name}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-[800ms] ease-out"
                    />
                    {/* Remaining spots tag */}
                    <div className={`absolute top-3 right-3 px-2 py-1 text-[8px] tracking-widest font-mono uppercase bg-[#FBF9F6] border border-ink/10 ${
                      tier.spotsRemaining === 1 ? 'text-ochre font-bold animate-pulse' : 'text-ochre font-semibold'
                    }`}>
                      {hasSpots ? `[ ONLY ${tier.spotsRemaining} SPOT${tier.spotsRemaining > 1 ? 'S' : ''} REMAINING ]` : '[ SOLD OUT ]'}
                    </div>
                  </div>

                  {/* Pricing Matrix details */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-serif text-2xl font-light text-ink tracking-wide">
                      {tier.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-ink/40 tracking-wider">TUITION</span>
                      <p className="font-serif text-2xl font-medium text-ochre">${tier.price}</p>
                    </div>
                  </div>

                  <p className="text-xs text-ink/75 leading-relaxed font-sans mb-6 line-clamp-3 font-normal">
                    {tier.description}
                  </p>

                  <div className="h-[1px] bg-ink/10 my-4" />

                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#5A6455] mb-3">Suite Amenities</h4>
                    <ul className="space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      {tier.amenities.map((amenity, i) => (
                        <li key={i} className="flex gap-2 items-start text-[10px] text-ink/75 font-sans">
                          <Check size={10} className="text-[#5A6455] mt-0.5" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto w-full">
                  {/* Payment plan detail */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider text-ochre">
                     <Landmark size={12} className="text-ochre" />
                    <span>PLANS FROM {tier.paymentPlan}</span>
                  </div>

                  {/* Primary card CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectLodgingAndApply(tier);
                    }}
                    disabled={!hasSpots}
                    className={`w-full sm:w-auto text-center px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest border transition duration-300 cursor-pointer rounded-sm ${
                      hasSpots 
                        ? 'bg-ink border-ink hover:bg-[#5A6455] text-alabaster font-bold hover:text-white'
                        : 'bg-ink/5 border-ink/5 text-ink/30 cursor-not-allowed'
                    }`}
                  >
                    {hasSpots ? 'Select accommodation' : 'Sold Out'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: PACKING & PREPARATION MATRIX */}
      <div className="mt-20 md:mt-32">
        <PackingMatrix currentRetreat={currentRetreat} />
      </div>

      {/* SECTION 5: PAST CONTAINERS ARCHIVE */}
      <PastContainers />
    </div>
  );
}
