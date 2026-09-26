import { Compass, Sparkles, MapPin, Phone, Mail, Instagram, ArrowUp } from 'lucide-react';

interface FooterProps {
  onBlueprintOpen: () => void;
  onBookOpen: () => void;
}

export default function Footer({ onBlueprintOpen, onBookOpen }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-[85%] top-0 bottom-0 w-px bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Footer Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand & Coordinates Map (Lg: col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2.5">
              <span className="font-serif text-2xl tracking-[0.16em] uppercase text-white font-light">
                CROWN & <span className="italic font-normal">COLLECTIVE</span>
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] uppercase bg-[#181816] text-[#E6C587] px-2 py-0.5 border border-[#E6C587]/20 rounded-xs">
                LA
              </span>
            </div>
            
            <p className="text-xs md:text-sm text-[#F7F4EB]/60 leading-relaxed font-light tracking-wide max-w-sm">
              An avant-garde physical sanctuary residing on Melrose, sculpting luxury textured hair crowns and rich organic color synthesis.
            </p>

            <div className="space-y-3 pt-4 text-[11px] font-mono text-[#F7F4EB]/70 tracking-wider">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6C587]" />
                <span>8473 MELROSE PLACE, WEST HOLLYWOOD, CA 90069</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-[#E6C587]" />
                <span>+1 (310) 843-1244</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-[#E6C587]" />
                <span>CONVERSATIONS@CROWNECOLLECTIVE.COM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Studio Hours Array (Lg: col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-serif text-sm text-white uppercase tracking-widest font-normal">
              Operating Parameters
            </h4>
            
            <div className="space-y-3 text-xs font-mono font-light text-[#F7F4EB]/60">
              <div className="flex justify-between pb-2 border-b border-white/[0.03]">
                <span>TUESDAY - THURSDAY</span>
                <span className="text-white">09:00 AM - 07:00 PM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.03]">
                <span>FRIDAY - SATURDAY</span>
                <span className="text-white">09:00 AM - 08:00 PM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.03] text-[#E6C587]">
                <span>SUNDAY - MONDAY</span>
                <span>STUDIO REST CLOSED</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic pt-2 font-serif">
                “To maintain our quiet client flow metrics, appointments require online reservation 48 hours in advance.”
              </p>
            </div>
          </div>

          {/* Column 3: Customization Resale licensing (Lg: col-span-3) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-serif text-sm text-white uppercase tracking-widest font-normal">
              Digital Template Resale
            </h4>
            
            <p className="text-[11px] text-[#F7F4EB]/50 leading-relaxed font-light tracking-wide">
              Fully optimized for Framer, Webflow CMS collections, and Wix Studio docking engines. Read the tech specifications.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={onBlueprintOpen}
                className="flex items-center space-x-2.5 text-xs text-[#E6C587] hover:text-white transition-colors uppercase tracking-widest font-mono font-medium text-left"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Inspect Spec Blueprint</span>
              </button>

              <button
                onClick={onBookOpen}
                className="flex items-center space-x-2.5 text-xs text-[#F7F4EB]/80 hover:text-white transition-colors uppercase tracking-widest font-mono font-medium text-left"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve Consultation</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright and License info */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-mono tracking-widest text-[#F7F4EB]/40 uppercase">
          <div className="flex items-center space-x-2.5">
            <span>© 2026 CROWN & COLLECTIVE INC.</span>
            <span>•</span>
            <span>LOS ANGELES COIFFURE STUDIOS</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-[#E6C587] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@CROWN.COLLECTIVE</span>
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 p-2 bg-white/5 hover:bg-[#E6C587] hover:text-[#0A0A0A] transition-all cursor-pointer"
              title="Go to high crown"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
