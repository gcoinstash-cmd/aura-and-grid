import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Instagram, 
  Utensils, 
  Compass, 
  Lock, 
  Disc, 
  Ticket, 
  CheckCircle, 
  PhoneCall, 
  Volume2, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

import HeroSection from './components/HeroSection';
import VinylPlayer from './components/VinylPlayer';
import ProvisionsMenu from './components/ProvisionsMenu';
import TicketingSection from './components/TicketingSection';
import ReservationModal from './components/ReservationModal';
import CateringInquiry from './components/CateringInquiry';

import { SupperClubEvent, VinylTrack, ReservationSubmission } from './types';
import { VINYL_PLAYLIST } from './data';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<SupperClubEvent | null>(null);
  const [activeVinyl, setActiveVinyl] = useState<VinylTrack>(VINYL_PLAYLIST[0]);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'seating' | 'curation' | 'private'>('home');
  
  // Track successful bookings locally to display user vouchers on site
  const [myBookings, setMyBookings] = useState<ReservationSubmission[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // References for refined smooth scroll targets
  const heroRef = useRef<HTMLDivElement>(null);
  const acousticsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const cateringRef = useRef<HTMLDivElement>(null);

  // Load existing personal bookings from localStorage if applicable
  useEffect(() => {
    const cached = localStorage.getItem('aura_my_bookings');
    if (cached) {
      try {
        setMyBookings(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, tabName: typeof activeTab) => {
    setActiveTab(tabName);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookingSuccess = (newReservation: ReservationSubmission) => {
    const updated = [newReservation, ...myBookings];
    setMyBookings(updated);
    localStorage.setItem('aura_my_bookings', JSON.stringify(updated));
    setSelectedEvent(null); // Close modal
    
    // Trigger glorious micro notifications
    setShowNotification(`Pass authorized: Seat code ${newReservation.id}`);
    setTimeout(() => {
      setShowNotification(null);
    }, 6000);
  };

  const handleTrackSynchronized = (track: VinylTrack) => {
    setActiveVinyl(track);
  };

  return (
    <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col font-sans selection:bg-gold selection:text-obsidian" id="root-aura">
      
      {/* GLORIOUS TRANSITION BANNER ON ACTIVE BOOKING */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
            id="notification-banner"
          >
            <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-gold rounded-xl p-4 shadow-2xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-white font-medium block">Secured Board Space Issued</strong>
                <p className="text-stone-300 leading-normal">
                  Our system validated your verification criteria. Scroll to your "Secured Vouchers" list at the footer bottom to view details.
                </p>
                <span className="font-mono text-[9px] text-stone-500 block">{showNotification}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY COMPACT TOP MARGINAL HEADER */}
      <header className="sticky top-0 z-40 bg-obsidian/90 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center" id="luxury-header">
        
        {/* Brand Logo Alignment */}
        <button 
          onClick={() => scrollToSection(heroRef, 'home')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-full bg-stone-900 border border-gold flex items-center justify-center font-serif text-sm text-gold font-semibold tracking-tighter shadow-md">
            A
            {/* Spinning groove background hint */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-gold/40 animate-spin" />
          </div>
          <div className="text-left">
            <span className="font-serif text-md font-semibold tracking-wide text-white block">AURA</span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-terracotta uppercase block font-bold leading-none">Supper Club</span>
          </div>
        </button>

        {/* Minimal Navigation System (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono tracking-widest uppercase">
          <button 
            onClick={() => scrollToSection(heroRef, 'home')}
            className={`transition-colors cursor-pointer ${activeTab === 'home' ? 'text-gold font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            Manifesto
          </button>
          <button 
            onClick={() => scrollToSection(menuRef, 'menu')}
            className={`transition-colors cursor-pointer ${activeTab === 'menu' ? 'text-gold font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            Provisions
          </button>
          <button 
            onClick={() => scrollToSection(ticketsRef, 'seating')}
            className={`transition-colors cursor-pointer ${activeTab === 'seating' ? 'text-gold font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            Seating
          </button>
          <button 
            onClick={() => scrollToSection(acousticsRef, 'curation')}
            className={`transition-colors cursor-pointer ${activeTab === 'curation' ? 'text-gold font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            Sound Sync
          </button>
          <button 
            onClick={() => scrollToSection(cateringRef, 'private')}
            className={`transition-colors cursor-pointer ${activeTab === 'private' ? 'text-gold font-bold' : 'text-stone-400 hover:text-white'}`}
          >
            Private Inquiries
          </button>
        </nav>

        {/* Marginal interaction: Quick booking callback CTA */}
        <div className="flex items-center gap-3">
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-stone-950 border border-white/5 flex items-center justify-center text-stone-400 hover:text-gold transition-colors"
            title="Follow Aura on Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <button
            onClick={() => scrollToSection(ticketsRef, 'seating')}
            className="px-4 py-2 cursor-pointer bg-gold hover:bg-gold-hover text-obsidian text-[10px] font-mono uppercase font-bold tracking-widest rounded-lg transition-colors shadow shadow-gold/5"
            aria-label="Secure a chair in upcoming dinner"
          >
            Secure Chair
          </button>
        </div>

      </header>

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 space-y-24 py-10">
        
        {/* Module 1: Landing/Hero block */}
        <div ref={heroRef}>
          <HeroSection 
            onScrollToTickets={() => scrollToSection(ticketsRef, 'seating')}
            onScrollToMenu={() => scrollToSection(menuRef, 'menu')}
            currentlyVinylPlaying={activeVinyl.title}
            vinylArtist={activeVinyl.artist}
          />
        </div>

        {/* INTERACTIVE BENTO STAGE: "Senses & Sanctum" */}
        <section id="bento-sanctum-showcase" className="space-y-8">
          
          {/* Header */}
          <div className="text-left space-y-2">
            <div className="inline-flex items-center gap-1 bg-stone-900 border border-white/10 px-3 py-1 rounded-full">
              <Compass className="w-3.5 h-3.5 text-gold" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Atmosphere Pillars</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium">
              Senses & Sanctum
            </h2>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Box 1: Ancestral Alchemy (Large 7 Columns) */}
            <div className="md:col-span-7 bg-[#111112] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-44 h-44 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C86A4B] block">Pillar I</span>
                <h3 className="font-serif text-2xl text-stone-100 font-medium">Ancestral Alchemy</h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed max-w-md">
                  We partner directly with historical Black farming cooperatives across the Carolinas and Georgia to source organic, non-GMO stone-ground grain mill bases, small-batch cane syrups, and wild heirloom okra. Every plate honors cooking methodologies honed by Southern ancestors, updated for the contemporary West Coast palate.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-gold flex items-center gap-1 group-hover:text-white transition-colors">
                    <span>100% Traceable Farming Linkage</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Acoustic Sync (Mini 5 Columns) */}
            <div className="md:col-span-5 bg-[#111112] border border-white/10 rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold block">Pillar II</span>
                <h3 className="font-serif text-2xl text-stone-100 font-medium">Analog Tube Sync</h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  Audio curation is not background filler; it drives dining tempo. Hand-built wood horn cabinets and glowing 1970 Macintosh pre-amps sync directly with each course flavor profile.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-stone-500">
                <span>Tube pre-amps: Macintosh C28</span>
                <span className="text-gold">33 RPM</span>
              </div>
            </div>

            {/* Box 3: View Park coordinate (Mini 5 Columns) */}
            <div className="md:col-span-5 bg-[#111112] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block">Pillar III</span>
                <h3 className="font-serif text-xl text-stone-100 font-medium">Private Architectural Enclaves</h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  We rotate sessions between iconic mid-century modern residences located on historical hillsides—featuring views stretching from View Park down to DTLA.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2 font-mono text-[9px] text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Baldwin Hills • Windsor Hills • View Park</span>
              </div>
            </div>

            {/* Box 4: Convivial communal (Large 7 Columns) */}
            <div className="md:col-span-7 bg-[#111112] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-stone-900 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] block">Pillar IV</span>
                <h3 className="font-serif text-2xl text-stone-100 font-medium font-semibold">The Communal Hearth</h3>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  Aura chairs are aligned facing a single custom-built communal live-edge redwood table. Twenty strangers gather under California twilight, and design a modern network as slow-cooked pots simmer right behind them. To protect our guest's presence, handheld mobile photography is restricted around the board.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-terracotta uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unplugged communal engagement enforced</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* Module 2: Curated Sound Vinyl Player (Acoustics Stage) */}
        <div ref={acousticsRef} className="pt-8">
          <div className="mb-6 max-w-xl text-left">
            <h2 className="font-serif text-3xl lg:text-4xl text-stone-100 font-medium mb-2">The Atmospheric Needle</h2>
            <p className="text-sm text-stone-400 font-sans font-light leading-relaxed">
              Every dinner aligns with analog vinyl albums selected for their groove composition and thermal presence. Test track alignments on our digital pre-amp module below.
            </p>
          </div>
          <VinylPlayer 
            activeTrackId={activeVinyl.id} 
            onTrackChange={handleTrackSynchronized} 
          />
        </div>

        {/* Module 3: Provisions food Menu */}
        <div ref={menuRef} className="pt-10">
          <ProvisionsMenu />
        </div>

        {/* Module 4: Seating Schedules & Ticketing dashboard */}
        <div ref={ticketsRef} className="pt-10">
          <TicketingSection onSelectEvent={(evt) => setSelectedEvent(evt)} />
        </div>

        {/* Module 5: Private Catering & Takeover Request */}
        <div ref={cateringRef} className="pt-10">
          <CateringInquiry />
        </div>

        {/* DIGITAL ACTIVE VOUCHERS LIST (Unbelievable dynamic component showing booked seats) */}
        {myBookings.length > 0 && (
          <section id="secured-vouchers-list" className="space-y-8 border-t border-gold/25 pt-12">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold block">Your Vaulted Passes</span>
                <h3 className="font-serif text-2xl lg:text-3xl text-white font-medium">Secured Board Placements</h3>
              </div>
              <div className="text-xs font-mono text-stone-500">
                Count: {myBookings.length} Approved Ledger {myBookings.length === 1 ? 'Stub' : 'Stubs'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((tkt) => (
                <div 
                  key={tkt.id} 
                  className="bg-stone-950/60 border border-gold/40 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between font-mono text-[11px] text-stone-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                    <span className="text-gold font-bold uppercase tracking-wider">Aura Seat Pass {tkt.id.split('-')[2]}</span>
                    <span className="text-[9px] text-[#C86A4B] font-bold">{tkt.seatingPreference}</span>
                  </div>

                  {/* Info table */}
                  <div className="space-y-1.5 leading-relaxed text-left">
                    <div>
                      <span className="text-stone-500 text-[9px] uppercase block">Assigned To</span>
                      <span className="text-white text-xs">{tkt.customerName} ({tkt.guestCount} Board {tkt.guestCount === 1 ? 'Seat' : 'Seats'})</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[9px] uppercase block">Reserved Chemical Options</span>
                      <span className="text-stone-300">Spice: {tkt.customSpiceTier}</span>
                      {tkt.dietaryNotes && <span className="text-stone-400 block text-[10px] truncate">Notes: "{tkt.dietaryNotes}"</span>}
                    </div>
                  </div>

                  {/* Printable/Save alert bar */}
                  <div className="mt-4 pt-3 border-t border-dashed border-white/10 flex items-center justify-between text-[9px] text-stone-500">
                    <span>Issued: {new Date(tkt.createdTime).toLocaleDateString()}</span>
                    <span className="text-gold font-bold uppercase tracking-widest flex items-center gap-1">
                      <Lock className="w-3 h-3 text-gold" />
                      <span>Secured Ledger</span>
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </section>
        )}

      </main>

      {/* LUXURY EMBERS ECLIPSE FOOTER */}
      <footer className="bg-[#080809] border-t border-white/5 mt-20 py-16 px-6 sm:px-12" id="luxury-footer">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 border-b border-white/5 pb-12 mb-10">
          
          {/* Logo & Manifesto summary (5 cols) */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-stone-900 border border-gold flex items-center justify-center font-serif text-xs text-gold">A</div>
              <span className="font-serif text-md tracking-wider text-white">AURA SUPPER CLUB</span>
            </div>
            
            <p className="text-xs text-stone-500 font-sans font-light leading-relaxed max-w-sm">
              An elite digital templating presence designed exclusively for culinary visionaries representing contemporary Black American Fine Dining. Locked into the "Golden Hour Eclipse" design palette.
            </p>

            <span className="font-mono text-[9px] text-[#C86A4B] block uppercase tracking-[0.2em] font-bold">
              © 2026 Aura Dining Commune Group • South Los Angeles
            </span>
          </div>

          {/* Quick links columns (4 cols) */}
          <div className="md:col-span-4 text-left space-y-3 font-mono text-xs">
            <div className="text-[10px] uppercase text-stone-500 tracking-wider">Aura Coordinates</div>
            <div className="space-y-1.5 text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>View Park & Baldwin Hills Gated Terraces</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-gold" />
                <span>Leimert Park Sound Parlor Nooks</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Registry: member @aurasupper.club</span>
              </div>
            </div>
          </div>

          {/* Social Links & Trust (3 cols) */}
          <div className="md:col-span-3 text-left space-y-4">
            <div className="text-[10px] font-mono uppercase text-stone-500 tracking-wider">System Authenticator</div>
            <div className="p-3 bg-stone-950 border border-white/5 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-gold">
                <Lock className="w-3.5 h-3.5" />
                <span>Ledger Security Verified</span>
              </div>
              <p className="text-[9.5px] text-stone-500 font-sans leading-normal">
                All booking verification tokens are stored using client-side secure sandboxes. No physical credentials are leaked.
              </p>
            </div>
          </div>

        </div>

        {/* Intellectual disclaimer banner avoiding unrequested telemetry */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-stone-600">
          <div>
            <span>PROVISIONS DESIGNED AND PRODUCED WITH ABSOLUTE INTENT FOR HIGH END DINING SEATING</span>
          </div>
          <div className="flex items-center gap-4">
            <span>VERSION 1.0.4 SPEC</span>
            <span>HIFI-STATION COMMUNE SECURE</span>
          </div>
        </div>

      </footer>

      {/* DETACHED PORTAL OVERLAY */}
      <ReservationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={handleBookingSuccess}
      />

    </div>
  );
}
