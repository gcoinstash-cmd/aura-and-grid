/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  Clock, 
  Instagram, 
  Twitter, 
  Cpu, 
  Database, 
  Activity,
  ChevronRight,
  Terminal,
  Sun,
  Moon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-neon-cyan"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative">
        <div className="w-32 h-32 border border-neon-cyan/20 rounded-full flex items-center justify-center">
          <div className="text-xl font-black tracking-tighter animate-pulse">{percent}%</div>
          <motion.svg className="absolute inset-0 w-32 h-32 -rotate-90">
            <motion.circle 
              cx="64" cy="64" r="60" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="transparent" 
              initial={{ strokeDasharray: "377", strokeDashoffset: "377" }}
              animate={{ strokeDashoffset: 377 - (377 * percent) / 100 }}
            />
          </motion.svg>
        </div>
      </div>
      <div className="mt-8 text-[10px] tracking-[0.5em] uppercase text-white/40">
        Establishing Link...
      </div>
    </motion.div>
  );
};

const ProtocolBar = ({ theme, setTheme }: { theme: 'default' | 'terminal' | 'overdrive', setTheme: (val: 'default' | 'terminal' | 'overdrive') => void }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-black/95 border-b border-white/10 z-50 flex items-center justify-between px-4 sm:px-8 font-mono select-none">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-pink"></span>
        </span>
        <span className="text-[9px] text-neon-pink font-bold uppercase tracking-widest leading-none">SYSTEM_ROOT: ACTIVE</span>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-4 text-[9px] shrink-0">
        <span className="text-white/30 text-[8px] uppercase tracking-wider hidden sm:inline">NETWORK_PROTOCOL:</span>
        <div className="flex items-center border border-white/10 rounded overflow-hidden bg-black/50 text-[8px]">
          <button 
            onClick={() => setTheme('default')}
            className={cn(
              "px-2.5 py-0.5 transition-all duration-200 uppercase font-bold tracking-wider",
              theme === 'default'
                ? "text-neon-cyan bg-neon-cyan/15 border-r border-white/10"
                : "text-white/40 hover:text-white/85 border-r border-white/10"
            )}
          >
            Default
          </button>
          <button 
            onClick={() => setTheme('terminal')}
            className={cn(
              "px-2.5 py-0.5 transition-all duration-200 uppercase font-bold tracking-wider",
              theme === 'terminal'
                ? "text-[#00ff00] bg-[#00ff00]/15 border-r border-white/10"
                : "text-white/40 hover:text-white/85 border-r border-white/10"
            )}
          >
            Terminal
          </button>
          <button 
            onClick={() => setTheme('overdrive')}
            className={cn(
              "px-2.5 py-0.5 transition-all duration-200 uppercase font-bold tracking-wider",
              theme === 'overdrive'
                ? "text-neon-cyan bg-neon-cyan/15"
                : "text-white/40 hover:text-white/85"
            )}
          >
            Overdrive
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ theme, setTheme }: { theme: 'default' | 'terminal' | 'overdrive', setTheme: (val: 'default' | 'terminal' | 'overdrive') => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '01_FEED', href: '#menu' },
    { name: '02_SCAN', href: '#gallery' },
    { name: '03_COORD', href: '#location' },
  ];

  return (
    <nav className={cn(
      "fixed top-7 left-0 right-0 z-40 transition-all duration-300 border-b border-neon-cyan/30 h-[64px] flex items-center bg-black/85 backdrop-blur-md px-4 sm:px-8",
      scrolled ? "bg-black/95 h-[60px]" : "bg-black h-[64px]"
    )}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-6 min-w-0">
          <a href="#" className="font-mono text-sm font-black tracking-widest text-glitch text-neon-cyan shrink-0 hover:opacity-80 transition-opacity">
            NEO_SHINJUKU
          </a>
          
          <div className="h-4 w-px bg-neon-cyan/30 shrink-0 hidden md:block"></div>
          
          <div className="hidden md:flex gap-6 font-mono text-xs uppercase tracking-tighter shrink-0">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-white/70 hover:text-neon-pink border-b border-transparent hover:border-neon-pink transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden sm:flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00FFFF]"></div>
            <span className="font-mono text-xs text-white/50 uppercase tracking-widest whitespace-nowrap">
              {theme === 'default' && "PROTOCOL: CYBER"}
              {theme === 'terminal' && "PROTOCOL: PHOSPHOR"}
              {theme === 'overdrive' && "PROTOCOL: OVERDRIVE"}
            </span>
          </div>

          <button className="hidden sm:inline-block btn-editorial text-[9px] py-1.5 px-4 font-bold tracking-widest uppercase shrink-0">
            LOGIN_NODE
          </button>

          <button className="md:hidden text-white shrink-0" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed top-[92px] right-0 bottom-0 w-64 bg-black border-l border-neon-cyan/30 z-[100] p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-8 pb-12">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-lg text-white/80 hover:text-neon-pink tracking-widest py-1 border-b border-transparent hover:border-neon-pink/20 transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 bg-black relative z-10 w-full mt-auto sticky bottom-0">
              <button className="w-full btn-editorial text-xs py-3.5 font-bold">
                LOGIN_NODE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState<'syn' | 'pro' | 'str'>('syn');

  const menuItems = {
    syn: [
      { name: "Cyber-Gyoza [Glitch-Infused]", desc: "Bio-luminescent salt, wasabi mist", price: "¥2,400" },
      { name: "Neon-Dashi Broth", desc: "Black silken tofu, electric kelp", price: "¥1,800" },
      { name: "Synthetic Edamame", desc: "Plasma-salted pods", price: "¥1,100" },
    ],
    pro: [
      { name: "Toxin-Free Ramen [Bio-Gen]", desc: "Truffle broth, glowing egg, slow-cooked pork", price: "¥4,800" },
      { name: "Carbon-Seared Eel", desc: "Flash-chilled nigiri with liquid data gels", price: "¥6,200" },
      { name: "Neural Sushi Set", desc: "Laboratory-grade seafood fragments", price: "¥7,500" },
    ],
    str: [
      { name: "Iridescent Sake", desc: "Electric cyan gin, ozone bubbles", price: "¥1,200" },
      { name: "Void Cocktail", desc: "Deep charcoal vodka, nebula dust", price: "¥2,400" },
      { name: "Synthesized Nectar", desc: "Pure glucose encryption", price: "¥1,800" },
    ]
  };

  const categoryImages = {
    syn: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop",
    pro: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
    str: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop"
  };

  return (
    <section id="menu" className="py-24 bg-carbon-950 border-t border-neon-cyan/20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-32">
            <h2 className="text-4xl font-black mb-8 leading-none">
              NEURAL<br/><span className="text-neon-pink">_FEED</span>
            </h2>
            <div className="space-y-2 flex flex-col items-start font-mono text-[10px] uppercase tracking-widest text-white/40 mb-12">
              <span>Sector: Urban_Core</span>
              <span>Catalog: 2077-A</span>
              <span className="text-neon-cyan">Status: Available</span>
            </div>
            
            <div className="flex flex-col gap-1 font-mono text-xs">
              {[
                { id: 'syn', label: '01_SYNTHETICS' },
                { id: 'pro', label: '02_MAIN_PROTOCOLS' },
                { id: 'str', label: '03_DATA_STREAMS' }
              ].map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={cn(
                    "w-full text-left px-4 py-3 border transition-all flex items-center justify-between",
                    activeCategory === cat.id 
                      ? "bg-neon-cyan text-black border-neon-cyan font-bold" 
                      : "border-white/10 text-white/50 hover:bg-white/5"
                  )}
                >
                  {cat.label}
                  {activeCategory === cat.id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 bg-black/45 backdrop-blur-md border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[520px] p-8 md:p-16">
          {/* Moody Background Food Image for high-end digital menu feel */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img 
              key={activeCategory}
              src={categoryImages[activeCategory]}
              alt="Japanese cyber gastronomy food profile" 
              className="w-full h-full object-cover opacity-25 filter saturate-[0.6] contrast-[1.1] transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          </div>

          <div className="relative z-10 space-y-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="flex items-center gap-3 font-mono text-[10px] text-white/40 uppercase tracking-[0.4em] border-b border-white/10 pb-8">
                  <span>Current_Buffer // {activeCategory === 'syn' ? '01_Appetizers' : activeCategory === 'pro' ? '02_Main_Courses' : '03_Beverage_Streams'}</span>
                </div>
                
                <div className="grid gap-12">
                  {menuItems[activeCategory].map((item, idx) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <div className="flex justify-between items-baseline gap-4 mb-3">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:text-neon-cyan transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dashed border-white/15 group-hover:border-neon-cyan/40 mx-2 mb-2" />
                        <span className="font-mono text-lg text-neon-pink">{item.price}</span>
                      </div>
                      <p className="text-white/50 text-sm md:text-base max-w-2xl font-sans tracking-wide leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="relative z-10 mt-24 pt-8 border-t border-white/10 flex justify-between items-center text-white/30">
            <div className="flex gap-12 font-mono text-[8px] uppercase tracking-widest">
              <div className="flex flex-col gap-1">
                <span className="text-neon-cyan font-bold">Source:</span>
                <span>Bio_Gen_Farm_04</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neon-cyan font-bold">Temp:</span>
                <span>Optimum // 4°C</span>
              </div>
            </div>
            <Activity size={24} className="opacity-20 text-neon-cyan animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

const GallerySection = () => {
  const images = [
    { src: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000", title: "SCAN_01.JPG" },
    { src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000", title: "SCAN_02.JPG" },
    { src: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=1000", title: "SCAN_03.JPG" },
  ];

  return (
    <section id="gallery" className="py-24 bg-carbon-950 border-t border-neon-cyan/20">
      <div className="container mx-auto px-6">
        <div className="mb-16 border-l-4 border-neon-cyan pl-6">
          <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
            VISUAL<span className="text-neon-cyan">_SCAN</span>
          </h2>
          <p className="text-white/40 font-mono tracking-[0.3em] text-[10px] uppercase">Optical sensors at 98% efficiency</p>
        </div>

        <div className="grid md:grid-cols-3 gap-1 p-1 bg-neon-cyan/10">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 0.98 }}
              className="group relative aspect-[4/5] bg-black overflow-hidden border border-neon-cyan/20"
            >
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover filter saturate-0 contrast-125 brightness-75 group-hover:saturate-100 group-hover:brightness-100 transition-all duration-700 gallery-glitch"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-0 left-0 w-full h-[30px] bg-neon-cyan/5 border-b border-neon-cyan/20 flex items-center px-4">
                <span className="font-mono text-[9px] text-neon-cyan tracking-widest">{img.title}</span>
              </div>
              <div className="absolute bottom-4 left-4 font-mono text-[8px] text-white/40 bg-black/80 px-2 py-1 border border-white/10 uppercase">
                Captured: Grid_2077
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LocationSection = () => {
  return (
    <section id="location" className="py-24 bg-carbon-950 border-t border-neon-cyan/20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-1 border border-neon-cyan/30 p-1 bg-neon-cyan/5">
          <div className="lg:col-span-4 bg-black p-8 md:p-12">
            <h2 className="text-4xl font-black mb-12 leading-none">
              COORD<br/><span className="text-neon-pink">_INATES</span>
            </h2>
            
            <div className="space-y-12 font-mono">
              <div>
                <span className="text-[10px] text-neon-pink uppercase tracking-widest mb-4 block">01_Grid_Node</span>
                <p className="text-lg leading-tight uppercase font-bold">Shinjuku District 022<br />Tokyo Grid, Sector 7</p>
                <p className="mt-2 text-white/30 text-xs">35.6938° N, 139.7034° E</p>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                <span className="text-[10px] text-neon-cyan uppercase tracking-widest mb-4 block">02_Uptime_Window</span>
                <p className="text-lg leading-tight uppercase font-bold">Cycles 1-7<br />18:00 - 04:00 JST</p>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button className="btn-editorial w-full text-xs">
                  SYNC_LOCAL_GRID
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative aspect-square md:aspect-video lg:aspect-auto bg-black overflow-hidden group border border-neon-cyan/25">
            {/* Cyberpunk styled OpenStreetMap interactive iframe */}
            <iframe
              title="Cyber Shinjuku Coordinate Grid Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://www.openstreetmap.org/export/embed.html?bbox=139.6920%2C35.6880%2C139.7150%2C35.6990&layer=mapnik"
              className="w-full h-full opacity-65 mix-blend-screen select-none pointer-events-none"
              style={{
                filter: "invert(95%) hue-rotate(180deg) saturate(3.2) brightness(0.55) contrast(1.65)",
              }}
            />

            {/* Glowing neon grid overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 255, 255, 0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 255, 255, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px'
              }}
            />

            {/* Simulated target radar scan pulse lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-neon-pink/10 via-transparent to-transparent h-[150%] w-full animate-scanline pointer-events-none" />

            {/* Crosshair target & markers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1 h-[240px] bg-gradient-to-b from-transparent via-neon-cyan/40 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-1 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-neon-cyan/30 rounded-full animate-pulse" />
            </div>

            {/* Interactive Coordinate Markers */}
            {/* HQ Marker */}
            <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-neon-pink shadow-[0_0_12px_#ff00ff]"></span>
              </span>
              <div className="mt-1 px-2 py-0.5 bg-black/90 border border-neon-pink text-[8px] font-mono text-neon-pink uppercase tracking-widest leading-none shadow-[0_0_6px_rgba(255,0,255,0.4)] whitespace-nowrap">
                NEO_SHINJUKU_HQ
              </div>
            </div>

            {/* Auxiliary Node 1 */}
            <div className="absolute top-[32%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00FFFF] animate-pulse" />
              <div className="px-1.5 py-0.5 bg-black/90 text-[7px] font-mono text-neon-cyan/70 border border-neon-cyan/20 whitespace-nowrap uppercase tracking-wider">
                NODE_01_SECURE
              </div>
            </div>

            {/* Auxiliary Node 2 */}
            <div className="absolute top-[68%] left-[72%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00FFFF] animate-pulse" />
              <div className="px-1.5 py-0.5 bg-black/90 text-[7px] font-mono text-neon-cyan/70 border border-neon-cyan/20 whitespace-nowrap uppercase tracking-wider">
                NODE_02_RECEIVER
              </div>
            </div>

            {/* Tactical labels in corners */}
            <div className="absolute bottom-6 left-6 text-left font-mono text-[8px] text-white/50 space-y-1 bg-black/90 p-2.5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-neon-cyan uppercase">Grid_Status: STABLE</p>
              <p>SAT_LINK: SHINJ_04_NET</p>
              <p>ZOOM_SCALE: 1:4000</p>
            </div>

            <div className="absolute bottom-6 right-6 text-right font-mono text-[8px] text-white/45 space-y-1 bg-black/90 p-2.5 border border-white/10 backdrop-blur-sm">
              <p>SIGNAL_DETECTED_0029</p>
              <p>LATENCY: 0.003ms</p>
              <p className="text-neon-cyan font-bold">ENCRYPTION: AES_2077</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ConsoleSection = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SYSTEM' | 'DATA' | 'SECURITY'>('ALL');

  const layoutElements = [
    {
      id: "sys_core_01",
      name: "CORE_VIRT_NODE",
      category: "SYSTEM" as const,
      desc: "Active hypervisor cluster. Regulates local grid parameters and sync states.",
      status: "OPTIMAL",
      metric: "99.98% SYNC",
      icon: Cpu
    },
    {
      id: "sys_daemon_02",
      name: "UPTIME_DAEMON",
      category: "SYSTEM" as const,
      desc: "Heartbeat manager of local network protocols. Restarts stale buffer states.",
      status: "ACTIVE",
      metric: "12,482 HZ",
      icon: Activity
    },
    {
      id: "data_feed_01",
      name: "GASTRO_STREAMS",
      category: "DATA" as const,
      desc: "High-throughput flow of synthetic gastronomy blueprints and molecular ratios.",
      status: "STREAMING",
      metric: "4.8 MB/S",
      icon: Database
    },
    {
      id: "sec_enc_01",
      name: "AES_PERIMETER",
      category: "SECURITY" as const,
      desc: "Outer cryptographed security firewall routing incoming reservation ledger links.",
      status: "ENCRYPTED",
      metric: "AES_2077_GCM",
      icon: Terminal
    },
    {
      id: "data_buffer_02",
      name: "GLITCH_REGISTRY",
      category: "DATA" as const,
      desc: "Temporal sensor logs of local culinary visual scans and feedback matrices.",
      status: "BUFFERED",
      metric: "824 FILES",
      icon: Database
    },
    {
      id: "sec_bio_02",
      name: "BIOMETRIC_CHECK",
      category: "SECURITY" as const,
      desc: "Neural signature and ocular pattern validator for operator-level console login.",
      status: "SECURE",
      metric: "0.003ms PIN",
      icon: MapPin
    }
  ];

  const filteredElements = activeFilter === 'ALL' 
    ? layoutElements 
    : layoutElements.filter(el => el.category === activeFilter);

  return (
    <section id="console" className="py-20 bg-black border-t border-neon-cyan/20 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-pink/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Monospace Filter Bar Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
              <span className="font-mono text-[9px] text-neon-cyan tracking-[0.3em] uppercase">Control Center // Node Registry</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              GRID<span className="text-neon-pink">_CONSOLE</span>
            </h2>
          </div>

          {/* Monospace interactive filter bar */}
          <div className="flex flex-wrap gap-1 bg-white/5 p-1 border border-white/10 font-mono text-[10px] tracking-widest shrink-0 rounded backdrop-blur-sm">
            {(['ALL', 'SYSTEM', 'DATA', 'SECURITY'] as const).map(filter => (
              <button
                key={filter}
                id={`filter-${filter.toLowerCase()}`}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-2 transition-all duration-300 relative uppercase font-black",
                  activeFilter === filter
                    ? "text-black bg-neon-cyan shadow-[0_0_12px_rgba(0,255,255,0.4)]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid Layout Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredElements.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  layout
                  key={item.id}
                  id={`node-card-${item.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-black/60 backdrop-blur-md border border-white/5 p-6 relative overflow-hidden group hover:border-neon-cyan/40 transition-all duration-300 flex flex-col justify-between min-h-[180px]"
                >
                  {/* Subtle top indicator band */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent group-hover:via-neon-cyan/50 transition-all duration-500" />
                  
                  <div>
                    {/* Card Header Status */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                        [{item.category}]
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-neon-cyan animate-pulse" />
                        <span className="font-mono text-[8px] text-neon-cyan tracking-wider">{item.status}</span>
                      </div>
                    </div>

                    {/* Card Title & Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 border border-white/10 group-hover:border-neon-cyan/30 bg-white/5 text-neon-cyan shrink-0 transition-colors duration-300">
                        <Icon size={16} />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight uppercase group-hover:text-neon-cyan transition-colors duration-300">
                        {item.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 text-xs font-sans leading-relaxed tracking-wide group-hover:text-white/70 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Operational Metrics Section */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center font-mono text-[9px] text-white/30">
                    <span>SECTOR_07</span>
                    <span className="text-neon-pink tracking-widest font-black group-hover:animate-pulse">
                      {item.metric}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'default' | 'terminal' | 'overdrive'>('default');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-terminal', 'theme-overdrive', 'theme-indigo', 'light');
    if (theme === 'terminal') {
      root.classList.add('theme-terminal');
    } else if (theme === 'overdrive') {
      root.classList.add('theme-overdrive');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tokyoTimeString = time.toLocaleTimeString('en-GB', { 
    timeZone: 'Asia/Tokyo', 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="min-h-screen text-slate-100 transition-colors duration-700 bg-carbon-950">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <ProtocolBar theme={theme} setTheme={setTheme} />
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="fixed inset-0 scanline-full" />

      {/* Hero Section */}
      <header className="relative h-screen flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1600&auto=format&fit=crop"
            alt="Moody Neon Tokyo Night City"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/35 to-transparent" />
          <div className="absolute inset-0 hud-overlay opacity-55" />
        </div>

        <div className="relative z-10 w-full container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-4 py-2 px-4 bg-white/5 border border-white/10 font-mono text-[10px] text-neon-cyan mb-12 backdrop-blur-sm protocol-subtitle">
              <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
              <span>EST. 2077 // SHINJUKU PROTOCOL</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
              NEO-<br/>
              <span className="text-neon-pink text-glitch" style={{ textShadow: "4px 4px 0px #00FFFF" }}>SHINJUKU</span>
            </h1>
            
            <p className="max-w-xl font-sans text-lg md:text-xl text-white/60 mb-16 leading-relaxed">
              Premium synthetic gastronomy. Experience the high-tech culinary frontier of the Shinjuku Urban Core.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <button className="btn-reservation w-full sm:w-auto">
                <span className="relative z-10">INITIATE RESERVATION</span>
              </button>
              
              <div className="flex items-center gap-4 font-mono text-[10px] text-white/30 tracking-widest uppercase">
                <div className="w-12 h-px bg-white/10" />
                <span>Sector 7 // Urban Core</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 font-mono text-[10px] text-white/20">
          <span>LAT: 35.6938° N</span>
          <span>LNG: 139.7034° E</span>
        </div>
      </header>

      <ConsoleSection />
      <MenuSection />
      <GallerySection />
      <LocationSection />

      {/* Footer */}
      <footer className="py-12 border-t border-neon-cyan/30 bg-black">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="flex flex-col md:flex-row items-start gap-12 font-mono text-[10px] tracking-widest">
              <div className="flex flex-col">
                <span className="text-neon-pink opacity-50 uppercase mb-2 group">01_Location_Coord</span>
                <span className="text-sm font-bold">35.6938° N, 139.7034° E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neon-pink opacity-50 uppercase mb-2">02_Local_Time</span>
                <span className="text-sm font-bold uppercase">{tokyoTimeString} JST</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 items-center font-mono text-[10px] uppercase">
              <span className="text-white/40">COMM-CHANNELS:</span>
              <a href="#" className="hover:text-neon-pink transition-colors">X_NET</a>
              <a href="#" className="hover:text-neon-pink transition-colors">INSTA_DATA</a>
              <div className="hidden lg:block w-10 h-[1px] bg-neon-cyan/40"></div>
              <span className="text-neon-cyan">© 2077 NEO-SHINJUKU CORP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
