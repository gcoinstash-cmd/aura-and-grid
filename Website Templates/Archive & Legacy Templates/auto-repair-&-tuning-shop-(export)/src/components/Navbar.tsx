import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert, Cpu, Hammer, Gauge } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  shopName?: string;
}

export default function Navbar({ onNavigate, activeSection, shopName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'services', label: 'Services' },
    { id: 'booking', label: 'Booking' },
    { id: 'tracker', label: 'Live tracker' },
    { id: 'pricing', label: 'Packages' },
    { id: 'reviews', label: 'Proof & Reviews' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-[#0A0B0E]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex cursor-pointer items-center space-x-2.5 font-display text-xl sm:text-2xl font-bold tracking-wider"
          id="nav-logo"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange/10 border border-accent-orange/40">
            <Cpu className="h-5 w-5 text-accent-orange" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange"></span>
            </span>
          </div>
          <div className="font-display">
            {shopName ? (
              (() => {
                const words = shopName.split(' ');
                const firstWord = words[0] || 'APEX';
                const restWords = words.slice(1).join(' ') || '';
                return (
                  <div className="flex items-center space-x-1">
                    <span className="text-white uppercase font-bold">{firstWord}</span>
                    <span className="text-accent-orange font-light">//</span>
                    <span className="text-zinc-500 font-medium uppercase">{restWords}</span>
                  </div>
                );
              })()
            ) : (
              <>
                <span className="text-white">APEX</span>
                <span className="text-accent-orange font-light mx-1">//</span>
                <span className="text-zinc-500 font-medium font-display">DYNAMICS</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Live Station Telemetry Status */}
        <div className="hidden lg:flex items-center space-x-3 rounded-full border border-neutral-800/80 bg-neutral-950/60 px-4 py-1.5 text-xs font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-400">BAY STATUS:</span>
          <span className="text-emerald-400 font-semibold tracking-wide uppercase">2 OPEN CAR BAYS AVAILABLE TODAY</span>
        </div>

        {/* Right: Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 font-mono text-xs uppercase tracking-widest">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`transition-colors duration-200 hover:text-accent-orange relative py-2 cursor-pointer ${
                activeSection === item.id ? 'text-accent-orange font-semibold' : 'text-zinc-400'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span 
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-accent-orange"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          
          <button
            onClick={() => handleNavClick('booking')}
            className="glow-border-orange relative overflow-hidden rounded-md bg-accent-orange px-5 py-2.5 text-center font-display text-xs font-semibold uppercase tracking-wider text-black hover:bg-white hover:text-black transition-all cursor-pointer"
            id="nav-cta"
          >
            Book Appointment
          </button>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center space-x-3">
          <div className="flex items-center space-x-1.5 rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] font-mono leading-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold uppercase sm:hidden">2 BAYS</span>
            <span className="text-emerald-400 font-bold uppercase hidden sm:inline">2 BAYS OPEN</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-zinc-300 hover:text-white hover:border-neutral-700 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
            id="mobile-menu-trigger"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-900 bg-[#0C0D12] px-4 py-6 text-center"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 text-base font-display font-medium uppercase tracking-wider border-b border-zinc-900/40 pb-2 ${
                    activeSection === item.id ? 'text-accent-orange' : 'text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => handleNavClick('booking')}
                  className="w-full rounded-md bg-accent-orange py-3 font-display text-sm font-semibold uppercase tracking-wider text-black shadow-lg shadow-accent-orange/10"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
