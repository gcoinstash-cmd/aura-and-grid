/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { ArrowRight, ShieldCheck, HelpCircle, Compass, Sparkles } from 'lucide-react';

interface LandingPageProps {
  featuredProperties: Property[];
  onExplore: () => void;
  onPortal: () => void;
  onInquire: (property: Property) => void;
  onSchedule: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export function LandingPage({
  featuredProperties,
  onExplore,
  onPortal,
  onInquire,
  onSchedule,
  onViewDetails
}: LandingPageProps) {
  return (
    <div className="w-full bg-[#050505]" id="landing-page-module">
      
      {/* 1. Dramatic Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 bg-[radial-gradient(circle_at_center,_rgba(20,18,15,0.45)_0%,_rgba(5,5,5,1)_70%)]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 bg-gold-950/20 border border-gold-500/10 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold-300">
              Exclusive Sanctuary Tech Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-[1.1] max-w-5xl"
          >
            Sensory Architecture for <br />
            <span className="font-normal text-[#E5D3B3] bg-gradient-to-r from-[#F3E5D8] via-[#E5D3B3] to-[#B09E51] bg-clip-text text-transparent">
              Elevated Modern Living
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-sans text-sm sm:text-md text-neutral-400 max-w-2xl font-light leading-relaxed tracking-wide"
          >
            A carefully curated repository of structural sanctuaries, tailored for discerning collectors of elite real estate. Powered by secure, digital-first broker portals and unified client tracking systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={onExplore}
              className="group flex items-center justify-center gap-2 w-full sm:w-52 py-3.5 px-6 font-display font-medium text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-600 text-black border border-transparent rounded-sm transition-all duration-300 shadow-lg shadow-gold-500/10"
              id="hero-explore-btn"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={onPortal}
              className="flex items-center justify-center w-full sm:w-52 py-3.5 px-6 font-display font-normal text-xs uppercase tracking-widest bg-[#0A0A0A] hover:bg-[#121212] text-neutral-400 hover:text-white border border-neutral-900 hover:border-neutral-800 rounded-sm transition-all duration-350"
              id="hero-portal-btn"
            >
              Configure Portal
            </button>
          </motion.div>
        </div>

        {/* Floating Minimalist Stat Banner at bottom of hero */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-5xl px-4 sm:px-6 hidden lg:block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="grid grid-cols-4 bg-[#070707]/90 backdrop-blur-md border border-neutral-900 rounded-sm p-6 text-center divide-x divide-neutral-900"
          >
            <div>
              <span className="font-display text-2xl font-normal text-white">8.4M+</span>
              <p className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Average valuation</p>
            </div>
            <div>
              <span className="font-display text-2xl font-normal text-white">100%</span>
              <p className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Sovereign Privacy</p>
            </div>
            <div>
              <span className="font-display text-2xl font-normal text-white">24hr</span>
              <p className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Broker Concierge</p>
            </div>
            <div>
              <span className="font-display text-2xl font-normal text-white">99.8%</span>
              <p className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Contract Integrity</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Philosophy & Editorial Block */}
      <section className="py-32 border-t border-b border-neutral-950 bg-[#060606] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
                Architectural Intent
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                Refining physical form into monolithic sculpture.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed font-light space-y-4">
                We believe that premium buildings should be more than living spaces. They are quiet monuments intended to isolate residents from the kinetic friction of modern cities. Our selected listings stand out for raw architectural truth: hand-honed travertine walls, blackened structural steel plates, and hidden layouts that favor sensory relief.
              </p>
              <div className="h-0.5 bg-neutral-900 w-24 pt-1" />
              <div className="italic font-display text-neutral-500 tracking-wide font-light text-sm">
                "Monastic calm is the ultimate expression of material abundance."
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video lg:aspect-square bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85"
                alt="Zen architecture concept"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-mono text-[9px] uppercase tracking-widest text-gold-400 mb-1">Featured Layout</div>
                <div className="font-display text-md text-white font-normal">Minimalist Courtyard Atrium, Kyoto</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Featured Portfolio Showroom */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 text-left">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
                Exclusive Showroom
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
                Featured Sanctuaries
              </h2>
            </div>
            <button
              onClick={onExplore}
              className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-white transition-colors uppercase font-mono tracking-widest mt-2"
              id="view-all-landing-btn"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onInquire={onInquire}
                onSchedule={onSchedule}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sovereign Platform Advantage */}
      <section className="py-24 bg-[#080808] border-t border-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-400">
              Sovereign Real Estate Tech Stack
            </span>
            <h2 className="font-display text-3xl font-light text-white tracking-tight mt-2">
              Modular Integration Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-3 leading-relaxed">
              Designed as a premium developer asset. Quickly adjust features to secure commercial, multifamily, or high-worth bespoke townhouse community clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="advantage-columns">
            
            <div className="bg-[#050505] p-8 border border-neutral-900 rounded-sm space-y-4">
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-md w-fit">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-white">Secure Zero-Trust Rules</h3>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
                Securely locked down using attributes verification. Client profiles, private leases, sensitive transaction files, and active repair tickets are insulated from unauthorized queries.
              </p>
            </div>

            <div className="bg-[#050505] p-8 border border-neutral-900 rounded-sm space-y-4">
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-md w-fit">
                <Compass className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-white">Modular Subassemblies</h3>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
                Separate directory, scheduling portal, and database files. Strip the tenant system entirely for an elite agency homepage, or expand the scheduling portal for active communities.
              </p>
            </div>

            <div className="bg-[#050505] p-8 border border-neutral-900 rounded-sm space-y-4">
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-md w-fit">
                <HelpCircle className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-white">Production-Ready Template</h3>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
                A clean, modern React structure with beautiful animation logic, comprehensive mock persistence fallbacks and responsive navigation menus appropriate for client presentations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Minimalist CTA Section */}
      <section className="py-32 relative bg-[radial-gradient(circle_at_bottom,_rgba(20,18,15,0.3)_0%,_rgba(5,5,5,1)_100%)] border-t border-neutral-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">
            Private Access Framework
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight mt-3 mb-6">
            Ready to deploy for bespoke architectural client contracts?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Gain immediate access to full database state synchronizations, appointment bookings, and file uploads. Register as a broker or premium buyer now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onPortal}
              className="px-8 py-3.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-mono uppercase tracking-widest rounded-sm transition-colors duration-300 w-full sm:w-auto font-semibold"
              id="cta-join-btn"
            >
              Sign In To Portal
            </button>
            <button
              onClick={onExplore}
              className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-900 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors duration-300 w-full sm:w-auto"
              id="cta-explore-btn"
            >
              Browse Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Footer */}
      <footer className="bg-black py-12 border-t border-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="font-display text-sm tracking-widest text-[#E5D3B3] uppercase font-semibold">
              Obsidian Estate Tech
            </span>
            <p className="font-mono text-[9px] text-neutral-600 mt-1 uppercase tracking-wider">
              Zen-Minimalist flagship template v1.0.0
            </p>
          </div>
          <div className="flex gap-6 mt-2 sm:mt-0 font-mono text-[10px] text-neutral-600 tracking-wider">
            <a href="#landing-page-module" className="hover:text-neutral-400 transition-colors uppercase">Top</a>
            <span>•</span>
            <span className="uppercase">Licence: Hardcoded Dark Domain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
