import { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../data';
import { ServiceItem } from '../types';
import { Droplet, Cpu, Activity, Sparkles, Sliders, Gauge, Clock, ArrowRight, CheckCircle } from 'lucide-react';

interface ServicesGridProps {
  onSelectService: (serviceId: string) => void;
  services?: ServiceItem[];
}

export default function ServicesGrid({ onSelectService, services }: ServicesGridProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'maintenance' | 'tuning' | 'diagnostics' | 'detailing'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'tuning', label: 'Tuning & Dyno' },
    { id: 'diagnostics', label: 'OEM Diagnostics' },
    { id: 'maintenance', label: 'Precision Maintenance' },
    { id: 'detailing', label: 'Ceramic Detailing' }
  ] as const;

  const filteredServices = (services || SERVICES).filter(service => 
    activeCategory === 'all' || service.category === activeCategory
  );

  // Icon dynamic rendering helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="h-6 w-6" />;
      case 'Cpu': return <Cpu className="h-6 w-6" />;
      case 'Activity': return <Activity className="h-6 w-6" />;
      case 'Sparkles': return <Sparkles className="h-6 w-6" />;
      case 'Sliders': return <Sliders className="h-6 w-6" />;
      case 'Gauge': return <Gauge className="h-6 w-6" />;
      default: return <Sliders className="h-6 w-6" />;
    }
  };

  return (
    <section id="services" className="relative py-20 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
      {/* Decorative Technical grid behind background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-accent-orange uppercase tracking-widest">
              <span>[ PERFORMANCE SPECTRUM ]</span>
              <span className="hidden sm:inline text-zinc-700">//</span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans tracking-normal normal-case">
                ⚠️ Reseller Note: All vehicle makes, pricing tiers, and performance services are 100% customizable via our central data configuration file.
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Bespoke Garage & Tuning Services
            </h2>
            <p className="text-zinc-500 font-sans text-sm font-light">
              We operate a state-of-the-art facility tailored for high-performance exotics, racing platforms, and luxury touring models. Explore our modular capabilities.
            </p>
            <div className="sm:hidden mt-2 p-2.5 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans tracking-normal leading-normal">
              ⚠️ Reseller Note: All vehicle makes, pricing tiers, and performance services are 100% customizable via our central data configuration file.
            </div>
          </div>

          {/* Filtering Tabs bar */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-md border tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'border-accent-orange bg-accent-orange/10 text-accent-orange'
                    : 'border-neutral-800 bg-neutral-900/40 text-zinc-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const isHovered = hoveredId === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="glass-panel rounded-xl p-6 flex flex-col justify-between md:min-h-[300px] hover:border-accent-orange/30 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Accent Corner Lighting decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-orange/10 to-transparent rounded-tr-xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
                
                {/* top corner layout */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/80 text-accent-orange group-hover:bg-accent-orange group-hover:text-black transition-all duration-300 shadow-md">
                      {renderIcon(service.icon)}
                    </div>
                    <span className="font-mono text-xs text-zinc-500 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-900 uppercase">
                      {service.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white group-hover:text-accent-orange transition-colors duration-200">
                      {service.name}
                    </h3>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                    {service.helperText && (
                      <span className="text-xs text-slate-400 mt-1 block font-sans leading-relaxed italic">
                        {service.helperText}
                      </span>
                    )}
                  </div>
                </div>

                {/* technical meta metrics bottom row */}
                <div className="pt-6 mt-6 border-t border-neutral-900/60 flex items-center justify-between relative z-10 font-mono">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-600 uppercase">Estd Price</span>
                    <span className="text-sm font-bold text-white font-display">from ${service.estimatePrice}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-zinc-600 uppercase">Est Time</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-accent-orange" />
                      {service.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 group-hover:bg-accent-orange group-hover:text-black group-hover:border-accent-orange transition-all duration-300 cursor-pointer"
                    aria-label={`Book service ${service.name}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Info callout footer */}
        <div className="mt-12 text-center">
          <p className="inline-flex flex-col sm:flex-row sm:items-center justify-center gap-2 rounded-full border border-neutral-900 bg-neutral-950 px-6 py-2.5 text-xs text-zinc-400 font-mono">
            <span>🔧 Custom spec tuning or motor swaps require advanced mapping services.</span>
            <button 
              onClick={() => onSelectService('ecu-tuning')}
              className="text-accent-orange hover:underline font-semibold cursor-pointer"
            >
              Consult Calibration Engineer →
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
