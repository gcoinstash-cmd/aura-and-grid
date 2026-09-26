import { motion } from 'motion/react';
import { PACKAGES } from '../data';
import { Check, Info, ShieldCheck, Zap } from 'lucide-react';
import { PackageTier } from '../types';

interface PricingMatrixProps {
  onSelectPackageService: (serviceName: string, servicePrice: number) => void;
  packages?: PackageTier[];
}

export default function PricingMatrix({ onSelectPackageService, packages }: PricingMatrixProps) {
  
  // Custom helper mapping packages to booking flow selections
  const handleSelectPkg = (pkgId: string) => {
    switch (pkgId) {
      case 'pkg-street':
        // Map to standard fluid & safety diagnostics
        onSelectPackageService('fluid-service', 165);
        break;
      case 'pkg-apex':
        // Map to ECU Tuning stage calibration
        onSelectPackageService('ecu-tuning', 799);
        break;
      case 'pkg-track':
        // Map to track preparation
        onSelectPackageService('track-prep', 280);
        break;
      default:
        onSelectPackageService('fluid-service', 165);
    }
  };

  return (
    <section id="pricing" className="relative py-20 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
      
      {/* Background light flare */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16 relative">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 justify-center mb-1">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-orange bg-accent-orange/5 px-3 py-1 rounded-full uppercase">
              <span>[ COST TRANSPARENCY ]</span>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans max-w-md text-left leading-normal">
              ⚠️ Reseller Note: All vehicle makes, pricing tiers, and performance services are 100% customizable via our central data configuration file.
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Performance Pricing Matrix
          </h2>
          <p className="text-zinc-500 font-sans text-sm font-light">
            Review detailed service breakdowns for street, signature tuning, and performance racing scopes. No obscure additions; clear estimates provided.
          </p>
        </div>

        {/* Dynamic Pricing Grid cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {(packages || PACKAGES).map((tier, idx) => {
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-2xl border flex flex-col justify-between p-6 sm:p-8 relative transition-all duration-300 ${
                  tier.isPopular 
                    ? 'border-accent-orange bg-neutral-900/60 ring-2 ring-accent-orange/15 shadow-xl shadow-accent-orange/5' 
                    : 'border-neutral-900 bg-[#101115] hover:border-neutral-800'
                }`}
              >
                {/* Popular Corner Light Tag bar */}
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent-orange text-black font-mono text-[9px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-accent-orange/20">
                    <Zap className="h-2.5 w-2.5 fill-black" />
                    <span>Highly Requested Calibration</span>
                  </div>
                )}

                {/* Card Top Area */}
                <div className="space-y-6">
                  {/* Name Price */}
                  <div className="space-y-2">
                    <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                      PACKAGE 0{idx + 1}
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {tier.name}
                    </h3>
                    <p className="text-zinc-400 text-xs font-light tracking-wide min-h-[36px]">
                      {tier.description}
                    </p>
                  </div>

                  {/* Gigantic Price tag */}
                  <div className="flex items-baseline font-display">
                    <span className="text-4xl sm:text-5xl font-black text-white">{tier.price}</span>
                    <span className="text-xs text-zinc-500 font-mono uppercase ml-2 tracking-widest">/ flat rate</span>
                  </div>

                  {/* Feature inclusions */}
                  <div className="space-y-3.5 pt-6 border-t border-neutral-900/80">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                      Calibrated Inclusions:
                    </span>
                    <ul className="space-y-2.5 text-xs text-zinc-300 font-sans">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5 leading-relaxed font-light">
                          <Check className="h-4 w-4 text-accent-orange shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Trigger Action button */}
                <div className="pt-8 mt-8 border-t border-neutral-900/40">
                  <button
                    onClick={() => handleSelectPkg(tier.id)}
                    className={`w-full rounded-lg py-3.5 text-center font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      tier.isPopular
                        ? 'bg-accent-orange text-black hover:bg-white'
                        : 'bg-neutral-900 text-zinc-300 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    Select {tier.name} Scope
                  </button>
                  <p className="text-[10pt] font-mono text-zinc-600 text-center mt-3">
                    ⏰ Diagnostic alignment included.
                  </p>
                </div>

              </motion.div>
            )
          })}
        </div>

        {/* Custom Tune Notice */}
        <div className="mt-16 bg-[#101115] border border-neutral-950 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left md:max-w-xl">
            <h4 className="font-display text-base font-bold uppercase text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-orange" />
              Need Bespoke Racing Engine Configurations?
            </h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              For complete turbo retrofits, full engine rebuilds, or standalone Haltech/Motec ECU configurations, we configure custom bespoke hourly telemetry estimates.
            </p>
          </div>
          <button
            onClick={() => handleSelectPkg('pkg-apex')}
            className="rounded-lg border border-neutral-800 hover:border-accent-orange bg-neutral-950 px-6 py-3.5 text-center text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Custom Consult
          </button>
        </div>

      </div>
    </section>
  );
}
