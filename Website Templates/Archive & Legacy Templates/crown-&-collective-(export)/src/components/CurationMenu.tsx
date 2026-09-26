import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data';
import { ServiceItem } from '../types';
import { ArrowUpRight, Sparkles, Clock, Compass } from 'lucide-react';
import BlueprintDrawer from './BlueprintDrawer';

interface CurationMenuProps {
  onBookOpen: (selectedServiceId?: string) => void;
}

type CategoryFilter = 'all' | 'cut-styling' | 'color' | 'treatments';

export default function CurationMenu({ onBookOpen }: CurationMenuProps) {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAnnotated, setIsAnnotated] = useState(false);

  const filteredServices = activeTab === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeTab);

  const filterTabs = [
    { label: 'All Curations', id: 'all' as CategoryFilter },
    { label: 'Cut & Silhouette', id: 'cut-styling' as CategoryFilter },
    { label: 'Spectral Color', id: 'color' as CategoryFilter },
    { label: 'Alchemy Therapies', id: 'treatments' as CategoryFilter }
  ];

  return (
    <section id="curation" className="relative py-28 md:py-36 bg-[#0a0a0a] overflow-hidden border-b border-white/[0.03]">
      
      {/* Decorative vertical texts */}
      <div className="absolute top-24 left-6 md:left-12 rotate-90 origin-top-left text-white/[0.02] font-mono text-xs uppercase tracking-[0.25em] pointer-events-none select-none hidden lg:block">
        CROWN & COLLECTIVE — LES SALONS DE HAUTE COIFFURE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-lg">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#E6C587]">
              SERVICE PORTFOLIO
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-white font-light tracking-tight">
              Curated Services & <span className="italic">Hair Rituals</span>
            </h2>
            <p className="mt-4 text-xs md:text-sm text-[#F7F4EB]/60 tracking-wide font-light">
              A bespoke curation of premium services instead of a cluttered prices list. Filter by your aesthetic intention and reserve your slow-salon block.
            </p>
          </div>

          {/* Luxury Filter Toggle Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex flex-wrap gap-2.5 border border-white/5 p-1.5 bg-[#121212]/40 backdrop-blur-md rounded-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? 'text-[#0A0A0A] bg-[#F7F4EB]'
                      : 'text-[#F7F4EB]/85 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center space-x-1.5 border ${
                isAnnotated 
                  ? 'border-cyan-500/50 bg-cyan-500/5 text-cyan-400 hover:border-cyan-400 hover:text-white' 
                  : 'border-[#E6C587]/30 text-[#E6C587] hover:border-[#E6C587] hover:text-white'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isAnnotated ? 'animate-spin-slow' : ''}`} />
              <span>Blueprint Specs</span>
            </button>
          </div>
        </div>

        {/* Asymmetric Service Menu Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                className={`relative bg-[#121212]/70 hover:bg-[#121212] border-b p-8 md:p-10 flex flex-col justify-between transition-all duration-500 ease-out group ${
                  isAnnotated 
                    ? 'border-cyan-500/40 ring-1 ring-cyan-500/15 bg-cyan-950/[0.02]' 
                    : 'border-white/[0.04] hover:border-white/10'
                }`}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                
                {/* Visual HUD overlay boundary class */}
                {isAnnotated && (
                  <div className="absolute top-0 left-0 bg-cyan-500 text-[#070707] font-mono text-[7px] uppercase font-bold tracking-widest px-2 py-0.5 z-20">
                    class="curation_card" • col-mapping="Collection List Item"
                  </div>
                )}

                {/* Micro Ambient Glow behind card */}
                <div className="absolute inset-0 bg-[#E6C587]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div>
                  {/* Title & Price Header */}
                  <div className="flex items-start justify-between gap-6 pb-6 border-b border-white/[0.04]">
                    <div>
                      {isAnnotated && (
                        <div className="text-[7.5px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                          bound to: [category = "{service.category}"]
                        </div>
                      )}
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#E6C587] font-semibold">
                        {service.category === 'cut-styling' ? 'CHRONO_CUT' : service.category === 'color' ? 'BALAYAGE_RES' : 'DETOX_CELL'}
                      </span>
                      {isAnnotated && (
                        <div className="text-[7.5px] font-mono text-cyan-400 block mb-0.5">
                          bind: [name]
                        </div>
                      )}
                      <h3 className="font-serif text-xl md:text-2xl font-light text-white tracking-wide mt-1.5 group-hover:text-[#E6C587] transition-colors duration-300">
                        {service.name}
                      </h3>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-zinc-400 tracking-widest block uppercase">
                        FROM
                      </span>
                      {isAnnotated && (
                        <span className="text-[7.5px] font-mono text-cyan-400 block mb-0.5">
                          bind: [price]
                        </span>
                      )}
                      <span className="font-serif text-2xl text-white font-medium mt-0.5 block">
                        ${service.price}
                      </span>
                    </div>
                  </div>

                  {/* Core Description */}
                  <div className="mt-6">
                    {isAnnotated && (
                      <div className="text-[7.5px] font-mono text-cyan-400 mb-1 block">
                        bind: [description]
                      </div>
                    )}
                    <p className="text-xs md:text-[13px] text-[#F7F4EB]/85 leading-relaxed font-light tracking-wide">
                      {service.description}
                    </p>
                  </div>

                  {/* Curated Interactive Step Details (High-converting asset) */}
                  <div className={`mt-6 pt-4 px-4 py-3.5 space-y-1 transition-all duration-300 ${
                    isAnnotated ? 'border border-cyan-500/20 bg-cyan-950/20' : 'bg-white/[0.02] border border-white/[0.03]'
                  }`}>
                    {isAnnotated && (
                      <div className="text-[7.5px] font-mono text-cyan-400 mb-1 block">
                        bind: [ritual-step]
                      </div>
                    )}
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#E6C587] uppercase tracking-wider font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>Curated Ritual Complement</span>
                    </div>
                    <p className="text-[11px] text-[#F7F4EB]/80 italic font-serif">
                      “{service.ritualStep}”
                    </p>
                  </div>
                </div>

                {/* Footer specs / CTA details */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/[0.03]">
                  <div className="flex items-center space-x-4">
                    {isAnnotated && (
                      <span className="text-[7.5px] font-mono text-cyan-400 shrink-0">
                        bind: [duration]
                      </span>
                    )}
                    <span className="flex items-center space-x-1.5 text-[10px] font-mono text-[#F7F4EB]/75">
                      <Clock className="w-3.5 h-3.5 text-[#E6C587]/80" />
                      <span>{service.duration} BLOCK</span>
                    </span>
                    <span className="text-[10px] font-mono text-white/30">|</span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      1-ON-1 REST
                    </span>
                  </div>

                  {/* Dynamic hovering action */}
                  <button
                    onClick={() => onBookOpen(service.id)}
                    className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-[0.22em] font-medium text-white group-hover:text-[#E6C587] transition-colors duration-300 relative"
                  >
                    <span>Reserve Ritual</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <BlueprintDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isAnnotated={isAnnotated}
          onToggleAnnotations={() => setIsAnnotated(!isAnnotated)}
        />

        {/* Dynamic Interactive Callout */}
        <div className="mt-16 bg-[#121212] border border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start space-x-4 max-w-xl">
            <div className="p-3 bg-white/[0.03] text-[#E6C587] rounded-none hidden sm:block">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-light tracking-wide">
                Need a complete aesthetic counseling session?
              </h4>
              <p className="text-xs text-[#F7F4EB]/80 leading-relaxed font-light mt-1.5 tracking-wide">
                We design custom comprehensive plans combining sculptural restructuring, tailored dimensional micro-balayage, and deep botanical treatments. Reserve a complimentary 15-minute introductory virtual consultation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onBookOpen('cut-ritual')}
            className="w-full md:w-auto shrink-0 px-6 py-3.5 bg-transparent hover:bg-[#F7F4EB] text-[#F7F4EB] hover:text-[#0A0A0A] border border-white/25 hover:border-[#F7F4EB] text-xs font-sans uppercase tracking-[0.22em] transition-all duration-400 font-medium"
          >
            Claim Consultation
          </button>
        </div>

      </div>
    </section>
  );
}
