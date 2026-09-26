import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  onBookOpen: () => void;
  onBlueprintOpen: () => void;
}

export default function Header({ onBookOpen, onBlueprintOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          scrolled
            ? 'py-4 glassmorphism border-b bg-[#0a0a0ab3]'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo & Brand ID */}
          <a href="#" className="flex flex-col items-start gap-1.5 group py-1.5 select-none">
            <div className="flex items-center">
              <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.14em] uppercase text-white font-light group-hover:text-[#E6C587] transition-colors duration-500 leading-none">
                Crown & <span className="italic font-normal">Collective</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[7.5px] md:text-[8px] font-mono tracking-[0.35em] uppercase text-[#E6C587]/95">
              <span>Melrose Residency</span>
              <span className="w-1 h-1 rounded-full bg-[#E6C587]/30" />
              <span className="text-[#F7F4EB]/55">Los Angeles</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            <a
              href="#philosophy"
              className="text-xs font-sans uppercase tracking-[0.25em] text-[#F7F4EB]/70 hover:text-white transition-colors duration-300"
            >
              Philosophy
            </a>
            <a
              href="#curation"
              className="text-xs font-sans uppercase tracking-[0.25em] text-[#F7F4EB]/70 hover:text-white transition-colors duration-300"
            >
              Curation
            </a>
            <a
              href="#editorial"
              className="text-xs font-sans uppercase tracking-[0.25em] text-[#F7F4EB]/70 hover:text-white transition-colors duration-300"
            >
              Gallery
            </a>
            <button
              onClick={onBlueprintOpen}
              className="flex items-center space-x-1.5 text-xs font-sans uppercase tracking-[0.25em] text-[#E6C587] hover:text-white transition-colors duration-300"
            >
              <Compass className="w-3 h-3" />
              <span>Blueprint</span>
            </button>
          </nav>

          {/* Client Action Group */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={onBookOpen}
              className="relative px-6 py-2.5 bg-[#F7F4EB] text-[#0A0A0A] text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all duration-300 hover:bg-[#E6C587] hover:scale-[1.02] shadow-xs active:scale-95"
            >
              Book an Experience
            </button>
          </div>

          {/* Hamburger trigger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#F7F4EB] hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[65px] z-35 bg-[#0a0a0a] border-b border-white/5 py-8 px-6 flex flex-col space-y-6 md:hidden glassmorphism"
          >
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-sans uppercase tracking-[0.2em] text-[#F7F4EB]/80 hover:text-white"
            >
              Philosophy
            </a>
            <a
              href="#curation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-sans uppercase tracking-[0.2em] text-[#F7F4EB]/80 hover:text-white"
            >
              Curation
            </a>
            <a
              href="#editorial"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-sans uppercase tracking-[0.2em] text-[#F7F4EB]/80 hover:text-white"
            >
              Gallery
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBlueprintOpen();
              }}
              className="flex items-center space-x-2 text-sm font-sans uppercase tracking-[0.2em] text-[#E6C587] hover:text-white text-left"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Resale Blueprint</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookOpen();
              }}
              className="w-full py-3.5 bg-[#F7F4EB] text-[#0A0A0A] text-xs font-sans uppercase tracking-[0.22em] font-medium text-center"
            >
              Book an Experience
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
