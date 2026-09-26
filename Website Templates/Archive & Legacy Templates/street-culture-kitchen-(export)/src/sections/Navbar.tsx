import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu as MenuIcon, X, Flame, MapPin, Calendar, Compass } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundsystemActive, setSoundsystemActive] = useState(false);

  // Stateful countdown ticking down from 03h 42m 19s
  const [countdown, setCountdown] = useState({
    hours: 3,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 4 hours cycle automatically
          return { hours: 4, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSegment = (val: number) => String(val).padStart(2, "0");
  const countdownText = `${formatSegment(countdown.hours)}H // ${formatSegment(countdown.minutes)}M // ${formatSegment(countdown.seconds)}S`;

  const navLinks = [
    { id: "story", label: "STORY", icon: Compass },
    { id: "menu", label: "MENU GRID", icon: Flame },
    { id: "catering", label: "CATERING", icon: Calendar },
    { id: "location", label: "FIND SCK", icon: MapPin }
  ];

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        id="main_nav_header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono ${
          scrolled
            ? "bg-brand-bg/95 backdrop-blur-md border-b border-brand-border"
            : "bg-transparent"
        }`}
      >
        {/* DISPATCH COUNTDOWN BANNER */}
        <div className="w-full bg-[#121214] border-b border-brand-border py-1.5 px-6 flex items-center justify-center gap-3 text-center select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,69,0,0.06)_0%,transparent_75%)] pointer-events-none" />
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-orange"></span>
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] font-black tracking-widest text-[#E4E4E7] uppercase flex items-center gap-2">
            NEXT COVER SQUAD DEPLOYMENT:{" "}
            <span className="text-brand-orange focus-ring transition-colors duration-200">
              {countdownText}
            </span>
          </span>
        </div>

        <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? "py-3.5" : "py-5"}`}>
          
          {/* Logo / Brand */}
          <button
            id="nav_logo_button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-accent text-black font-black text-lg select-none">
              S
            </span>
            <div className="leading-none">
              <span className="block text-sm font-black text-white tracking-widest group-hover:text-brand-accent transition-colors duration-200">
                STREET CULTURE
              </span>
              <span className="block text-[9px] text-brand-muted tracking-wide font-medium">
                // CULINARY KITCHEN
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav_link_${link.id}`}
                onClick={() => handleScrollTo(link.id)}
                className="text-xs font-bold tracking-widest text-[#8E8E93] hover:text-brand-accent transition-colors duration-200 cursor-pointer uppercase select-none flex items-center gap-1.5"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Action Panel (Widget + CTA) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Soundsystem Audio Visualizer */}
            <div className="flex items-center gap-3 pr-4 border-r border-brand-border/60">
              <button
                id="soundsystem-trigger"
                onClick={() => setSoundsystemActive(!soundsystemActive)}
                className="text-[9px] font-mono font-bold text-brand-muted hover:text-white transition-colors duration-200 tracking-wider select-none cursor-pointer uppercase focus:outline-none"
              >
                {soundsystemActive ? "[ SOUNDSYSTEM: BROADCASTING ]" : "[ SOUNDSYSTEM: MUTED ]"}
              </button>
              
              <div className="flex items-end gap-[2px] h-3 w-5 overflow-hidden">
                {[...Array(5)].map((_, barIdx) => (
                  <motion.span
                    key={barIdx}
                    animate={soundsystemActive ? {
                      height: ["20%", "100%", "40%", "85%", "20%"]
                    } : {
                      height: "20%"
                    }}
                    transition={soundsystemActive ? {
                      repeat: Infinity,
                      duration: 0.4 + barIdx * 0.08,
                      ease: "easeInOut",
                      repeatType: "reverse"
                    } : { duration: 0.2 }}
                    className={`w-[2px] rounded-t-[1px] ${
                      soundsystemActive ? "bg-brand-accent" : "bg-brand-muted/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              id="action_trigger_cta_nav"
              onClick={() => handleScrollTo("catering")}
              className="text-xs font-bold tracking-widest text-black bg-brand-accent px-4 py-2 border border-brand-accent hover:bg-transparent hover:text-brand-accent transition-all duration-200 cursor-pointer"
            >
              BOOK EVENT
            </button>
          </div>

          {/* Mobile Actions Overlay Trigger */}
          <div className="flex md:hidden items-center gap-4">
            {/* Soundsystem Mini visualizer trigger */}
            <button
              onClick={() => setSoundsystemActive(!soundsystemActive)}
              className="flex items-end gap-[1.5px] h-4 w-4 overflow-hidden p-0.5"
              aria-label="Toggle sound system"
            >
              {[...Array(3)].map((_, barIdx) => (
                <motion.span
                  key={barIdx}
                  animate={soundsystemActive ? {
                    height: ["20%", "100%", "40%", "20%"]
                  } : {
                    height: "30%"
                  }}
                  transition={soundsystemActive ? {
                    repeat: Infinity,
                    duration: 0.45 + barIdx * 0.08,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  } : { duration: 0.2 }}
                  className={`w-[2px] rounded-t-[0.5px] ${
                    soundsystemActive ? "bg-brand-accent" : "bg-brand-muted/50"
                  }`}
                />
              ))}
            </button>

            <button
              id="mobile_menu_trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-2 text-white hover:text-brand-accent transition-colors duration-200 select-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile_drawer_overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 top-[92px] z-40 bg-[#0B0B0C]/98 backdrop-blur-xl border-t border-brand-border md:hidden flex flex-col justify-between py-12 px-8 font-mono"
          >
            <div className="space-y-8 flex flex-col">
              <span className="text-[10px] text-brand-muted tracking-widest">// NAVIGATION CORE</span>
              
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.id}
                  id={`mobile_nav_link_${link.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleScrollTo(link.id)}
                  className="text-lg font-black tracking-widest text-left text-white hover:text-brand-accent active:text-brand-accent uppercase flex items-center gap-3 select-none py-1 border-b border-brand-border/30"
                >
                  <link.icon className="w-5 h-5 text-brand-accent" />
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Sounddeck Widget + CTA */}
            <div className="space-y-6">
              
              <div className="p-4 bg-brand-card border border-brand-border rounded-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-[#8E8E93] tracking-widest uppercase font-black">// SOUNDSYSTEM SYSTEM</span>
                  <span className="text-[8px] font-mono text-brand-accent uppercase">● live grid broadcast</span>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSoundsystemActive(!soundsystemActive)}
                    className="text-left font-mono text-xs font-bold text-white hover:text-brand-accent transition-all duration-250 select-none uppercase"
                  >
                    {soundsystemActive ? "SOUND: BROADCASTING" : "SOUND: MUTED"}
                  </button>
                  <div className="flex items-end gap-[2px] h-3.5 w-6 overflow-hidden">
                    {[...Array(5)].map((_, barIdx) => (
                      <motion.span
                        key={barIdx}
                        animate={soundsystemActive ? {
                          height: ["20%", "100%", "40%", "80%", "20%"]
                        } : {
                          height: "20%"
                        }}
                        transition={soundsystemActive ? {
                          repeat: Infinity,
                          duration: 0.4 + barIdx * 0.08,
                          ease: "easeInOut",
                          repeatType: "reverse"
                        } : { duration: 0.2 }}
                        className={`w-[2.5px] rounded-t-[1px] ${
                          soundsystemActive ? "bg-brand-accent" : "bg-brand-muted/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                id="mobile_book_event_direct"
                onClick={() => handleScrollTo("catering")}
                className="w-full text-center text-sm font-bold tracking-widest text-black bg-brand-accent py-4 border border-brand-accent uppercase glow-accent cursor-pointer font-bold"
              >
                BOOK THE TRUCK NOW
              </button>

              <div className="text-center font-mono text-[9px] text-brand-muted space-y-1">
                <p>1082 VANDAL WAY SE, INDUSTRIAL QUARTER</p>
                <p>DOORS ENGAGED THU-SUN LATE NIGHTS</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
