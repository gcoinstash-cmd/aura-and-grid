import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Menu } from './components/Menu';
import { MapMock } from './components/MapMock';
import { CateringWizard } from './components/CateringWizard';
import { AdminPanel } from './components/AdminPanel';
import { EventLogisticsFAQ } from './components/EventLogisticsFAQ';
import { SocialProof } from './components/SocialProof';
import { InstagramFeed } from './components/InstagramFeed';
import { VIPNewsletter } from './components/VIPNewsletter';
import { 
  Flame, 
  MapPin, 
  Compass, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle, 
  TrendingUp, 
  Truck, 
  Award, 
  Activity, 
  ChefHat, 
  Coffee 
} from 'lucide-react';
import { motion } from 'motion/react';

function LandingPage() {
  const { truckLocation } = useApp();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-zinc-300 selection:bg-agave-500 selection:text-black font-sans">
      
      {/* Floating Glassmorphic Top Header */}
      <header className="sticky top-0 z-40 bg-obsidian/85 backdrop-blur-md border-b border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-agave-500 to-agave-600 flex items-center justify-center text-black shadow-lg shadow-agave-500/10">
              <Flame className="w-5 h-5 fill-black stroke-[1.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white tracking-tight">AGAVE &amp; MESA</span>
              <span className="text-[9px] font-mono font-bold uppercase text-agave-400 tracking-widest block -mt-1">Cult Gastronomy</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
            <button onClick={() => handleScrollTo('digital-menu')} className="hover:text-white transition-colors cursor-pointer">
              Catalog
            </button>
            <button onClick={() => handleScrollTo('live-tracker')} className="hover:text-white transition-colors cursor-pointer">
              Live Coords
            </button>
            <button onClick={() => handleScrollTo('catering-booking-wizard')} className="hover:text-white transition-colors cursor-pointer">
              Event Booking
            </button>
          </nav>

          {/* Live Tracker Header Status Badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => handleScrollTo('live-tracker')}
              className="bg-charcoal border border-zinc-850 px-3.5 py-1.5 rounded-full flex items-center gap-2 cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agave-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-agave-400"></span>
              </span>
              <span className="font-mono text-[10px] font-bold text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">
                {truckLocation.status === 'Live' ? 'Live Now' : truckLocation.status}
              </span>
            </div>
            
            <button
              onClick={() => handleScrollTo('catering-booking-wizard')}
              className="hidden sm:flex bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-xl transition-all cursor-pointer"
            >
              Commission Truck
            </button>
          </div>

        </div>
      </header>

      {/* Hero: Immersive Split Screen layout */}
      <section className="relative border-b border-zinc-900 overflow-hidden">
        
        {/* Accent visual background lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-agave-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 relative z-10">
            
            {/* Live Spot Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs font-mono text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-agave-400 animate-pulse" />
              <span>Tonight's Spot:</span>
              <strong className="text-zinc-200 font-semibold">{truckLocation.spotName}</strong>
              <span className="text-zinc-600">|</span>
              <span className="text-[11px] text-agave-400 font-medium">{truckLocation.hours}</span>
            </div>

            {/* Title display */}
            <div className="space-y-4">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[0.95]">
                Heirloom Coals.<br />
                Gritty Soul.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Ultra Premium.</span>
              </h1>
              <p className="text-zinc-500 text-base sm:text-lg max-w-xl leading-relaxed">
                We craft with stone-ground heirloom blue corn, 12-hour mesquite coals, and organic agave distillates. Street ritual met by culinary masterclass.
              </p>
            </div>

            {/* Hero Quick Call-to-Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleScrollTo('catering-booking-wizard')}
                className="bg-white hover:bg-zinc-200 text-black font-bold rounded-xl py-3.5 px-6 flex items-center justify-center gap-2 shadow-xl shadow-white/5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4.5 h-4.5 fill-black stroke-[1.5]" />
                Commission Catering Portal
              </button>
              
              <button
                onClick={() => handleScrollTo('digital-menu')}
                className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold font-mono text-xs uppercase tracking-wider rounded-xl py-3.5 px-5 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Explore Catalog
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {/* Premium Trust Accents */}
            <div className="pt-8 border-t border-zinc-900 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <div>
                <span className="text-white font-bold text-base block font-display">100%</span>
                Stone-Ground Masa
              </div>
              <div>
                <span className="text-white font-bold text-base block font-display">12-HR</span>
                Brisket Smokes
              </div>
              <div>
                <span className="text-white font-bold text-base block font-display">4.9★</span>
                Critically Acclaimed
              </div>
            </div>

          </div>

          {/* Hero Right Media / Food Styling Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-charcoal p-2 aspect-[4/5] shadow-2xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" 
                  alt="Heirloom Tacos Crafting" 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Visual Accent Card over image */}
                <div className="absolute bottom-6 left-6 right-6 bg-charcoal/90 backdrop-blur-md border border-zinc-800 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-agave-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Chef Selected
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-bold">$6.50 / Taco</span>
                  </div>
                  <h4 className="font-display font-medium text-lg text-white">Chipotle Birria de Res</h4>
                  <p className="text-[11px] text-zinc-500"> Blue corn tortilla, melted Oaxacan cheese, consommé dip.</p>
                </div>
              </div>
            </div>

            {/* Floating Graphic Element */}
            <div className="absolute -top-6 -right-6 bg-obsidian border border-zinc-850 p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-agave-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Operational Stream</span>
                <span className="text-xs font-semibold text-zinc-200">Broadcast Coords Live</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Manifesto / Philosophy Banner */}
      <section className="py-20 border-b border-zinc-900 bg-charcoal/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-[0.25em] font-bold block">
            HEIRLOOM MESA MANIFESTO
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-zinc-100 font-medium leading-relaxed tracking-tight max-w-3xl mx-auto">
            "We believe that street culture does not have to compromise on gourmet rigor. We marry charcoal ashes and double-smoked pork fat with high-editorial design to create a luxury, raw culinary experience."
          </h2>
          <div className="h-0.5 w-16 bg-agave-500 mx-auto rounded-full" />
        </div>
      </section>

      {/* Main Experience Layout Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-28">
        
        {/* SECTION 1: THE MENU */}
        <section id="digital-menu" className="scroll-mt-24">
          <Menu />
        </section>

        {/* SECTION 2: LIVE TRACKER */}
        <section id="live-tracker" className="scroll-mt-24 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-agave-400 font-bold tracking-widest uppercase flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                Live Telemetry Feed
              </span>
              <h3 className="font-display font-medium text-3xl text-white mt-1">Satellite Positioner.</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-md">Our active location, hours, and operational status are updated in real-time by our drivers.</p>
            </div>

            <div className="bg-charcoal border border-zinc-850 p-4 rounded-xl flex items-center gap-4 max-w-md">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-agave-400">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-500 leading-normal">
                Want us to park at your office or gallery launch? Head down to the event commission ledger to book.
              </p>
            </div>
          </div>

          <MapMock location={truckLocation} />
        </section>

        {/* SECTION 3: THE RITUAL (CATERING BOOKING) */}
        <section id="catering-booking-wizard" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Catering pitch */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-xs text-agave-400 font-bold tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Private Commissions
              </span>
              <h3 className="font-display font-medium text-4xl text-white tracking-tight leading-[0.95]">
                Luxury Catering &amp; Corporate Galas.
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Bring our acclaimed street setup directly to your private estate, gallery vernissage, or corporate headquarters. We customize menu profiles, package custom visual design labels, and bring our mesquite-charcoal grills directly to you.
              </p>
            </div>

            {/* Quality list checkmarks */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-agave-950/40 border border-agave-500/30 text-agave-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChefHat className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="font-semibold text-zinc-200 text-sm">Bespoke Gastronomy Curation</h5>
                  <p className="text-zinc-500 text-xs mt-0.5">Custom allergen profiles, ingredient requests, and off-catalog releases.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-agave-950/40 border border-agave-500/30 text-agave-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Coffee className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="font-semibold text-zinc-200 text-sm">Visual Identity Customization</h5>
                  <p className="text-zinc-500 text-xs mt-0.5">Personalized paper wraps, menu screens, and custom mocktail formulations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-agave-950/40 border border-agave-500/30 text-agave-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="font-semibold text-zinc-200 text-sm">Full Cleanup &amp; Zero Friction</h5>
                  <p className="text-zinc-500 text-xs mt-0.5">Our culinary team handles everything from setup to cleanup so you focus on hosting.</p>
                </div>
              </div>
            </div>

            {/* High Ticket Value Proof Card */}
            <div className="bg-charcoal border border-zinc-850 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">COMMISSION TERMS</span>
              <p className="text-zinc-400 text-xs leading-relaxed">
                We accept commissions across Los Angeles county with minimum guest budgets starting at <strong className="text-white">$1,200</strong>. Secure dates early; peak weekend slots fill up to 3 months in advance.
              </p>
            </div>

          </div>

          {/* Right Column: Multi-step booking wizard */}
          <div className="lg:col-span-7">
            <CateringWizard />
          </div>

          {/* Social Proof Horizontal Carousel */}
          <div className="col-span-1 lg:col-span-12 mt-12">
            <SocialProof />
          </div>

          {/* Instagram Feed Grid with Lightbox */}
          <div className="col-span-1 lg:col-span-12 mt-12">
            <InstagramFeed />
          </div>

          {/* Full Width Event Logistics FAQ Accordion */}
          <div className="col-span-1 lg:col-span-12">
            <EventLogisticsFAQ />
          </div>

        </section>

      </main>

      {/* Global Minimalist Editorial Footer */}
      <footer className="border-t border-zinc-900 bg-charcoal/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <VIPNewsletter />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-zinc-500">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-agave-500 flex items-center justify-center text-black">
                <Flame className="w-4 h-4 fill-black" />
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">AGAVE &amp; MESA</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              Acclaimed luxury-editorial street gastronomy truck &amp; private event commission portal. Crafting raw elegance since 2024.
            </p>
            <p className="text-[10px] font-mono text-zinc-600">
              © 2026 Agave &amp; Mesa Culinary Group. All rights reserved.
            </p>
          </div>

          {/* Catalog Col */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">Catalog Assets</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleScrollTo('digital-menu')} className="hover:text-white transition-colors cursor-pointer">Menu List</button></li>
              <li><button onClick={() => handleScrollTo('live-tracker')} className="hover:text-white transition-colors cursor-pointer">Live Coordinates</button></li>
              <li><button onClick={() => handleScrollTo('catering-booking-wizard')} className="hover:text-white transition-colors cursor-pointer">Catering Estimate</button></li>
            </ul>
          </div>

          {/* Sales pitches Col */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">Developer Licence</h5>
            <ul className="space-y-2 text-[11px] leading-relaxed">
              <li>
                <span className="text-zinc-400 font-bold">Gumroad Price Tag:</span> $99+ Commercial Template
              </li>
              <li>
                <span className="text-zinc-400 font-bold">Client Valuation:</span> $3,500+ Fully Scaled Portal
              </li>
              <li>
                Includes PostgreSQL schemas, RLS security triggers, real-time sync adapters.
              </li>
            </ul>
          </div>

        </div>
      </footer>

      {/* Hidden Administrative Vitals console panel trigger */}
      <AdminPanel />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LandingPage />
    </AppProvider>
  );
}
