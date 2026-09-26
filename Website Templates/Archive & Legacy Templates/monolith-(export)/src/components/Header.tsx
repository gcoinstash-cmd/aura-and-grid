import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SITE_COPY } from "../data";

interface HeaderProps {
  onOpenInquiry: () => void;
}

/**
 * Header Component
 * Handles responsive navigational layouts and sticky states.
 * Custom styled with generous letter-spacing for high-end editorial positioning.
 */
export default function Header({ onOpenInquiry }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Elegant background blending offset once scrolled past 50px
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Thesis", href: "#thesis" },
    { name: "Clients", href: "#brands" },
    { name: "Case Studies", href: "#wins" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
  ];

  return (
    <>
      <header
        id="app-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-neutral-900 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Custom wordmark word spacing / typography */}
          <a
            id="brand-logo"
            href="#"
            className="font-display font-bold text-xl tracking-[0.25em] text-white hover:text-brand-gold transition-colors duration-300"
          >
            {SITE_COPY.global.brandName}
          </a>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:block">
            <button
              id="header-cta-btn"
              onClick={onOpenInquiry}
              className="group flex items-center space-x-2 font-mono text-[11px] uppercase tracking-widest border border-white/20 bg-transparent hover:bg-white hover:text-black py-2.5 px-5 transition-all duration-300 font-medium cursor-pointer"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-400 hover:text-white p-1 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.5]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[1.5]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[70px] bg-[#050505] z-40 border-t border-neutral-900 md:hidden flex flex-col justify-between p-8"
          >
            <div className="flex flex-col space-y-8 pt-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="font-serif text-3xl text-neutral-300 hover:text-white font-light tracking-wide transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="border-t border-neutral-900 pt-8 pb-12 flex flex-col space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                Core Inquiry
              </span>
              <button
                id="mobile-cta-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full text-center border border-white/20 hover:border-white py-4 px-6 text-xs uppercase tracking-widest bg-white text-black font-semibold transition-all duration-300 cursor-pointer"
              >
                Start a project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
