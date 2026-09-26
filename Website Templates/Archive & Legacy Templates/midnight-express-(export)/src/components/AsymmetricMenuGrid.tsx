import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Percent, Shield, Zap, Layers, RefreshCw } from 'lucide-react';
import { playWokSizzle, playNeonChime } from '../utils/audio';

export type MenuFilter = 'ALL' | 'SEARED' | 'INFUSED' | 'STEAMED';

interface AsymmetricMenuGridProps {
  onSelectItem?: (id: string) => void;
  activeSelections?: string[];
}

export default function AsymmetricMenuGrid({ onSelectItem, activeSelections = [] }: AsymmetricMenuGridProps) {
  const [activeFilter, setActiveFilter] = useState<MenuFilter>('ALL');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [szechuanLoaded, setSzechuanLoaded] = useState(false);
  const [szechuanError, setSzechuanError] = useState(false);
  const [dumplingLoaded, setDumplingLoaded] = useState(false);
  const [dumplingError, setDumplingError] = useState(false);

  const handleCardClick = (id: string) => {
    playWokSizzle();
    if (onSelectItem) {
      onSelectItem(id);
    }
  };

  return (
    <div 
      id="asymmetric-menu-grid-root" 
      className="bg-[#0e0e0e] border border-white/5 p-6 text-white w-full space-y-6 max-w-4xl mx-auto backdrop-blur-md relative"
    >
      {/* Neon pink outline bracket accent to coordinate with luxury theme */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF3366]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF3366]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF3366]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF3366]" />

      {/* Header telemetry and brand label */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#FF3366] tracking-[0.2em] uppercase font-bold">
            <span className="w-1.5 h-1.5 bg-[#FF3366] animate-ping rounded-full inline-block mr-1" />
            LIMITED EDITION // SERIES 01 CULINARY DROPS
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-tighter text-white mt-1">
            THE ASYMMETRIC FLAVOR METRIC GRID
          </h2>
        </div>

        {/* 1. HORIZONTAL FILTER BAR OF RAW TEXT TRIGGERS SEPARATED BY MINIMAL SLASHES */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-400">
          {(['ALL', 'SEARED', 'INFUSED', 'STEAMED'] as MenuFilter[]).map((filter, index, array) => (
            <React.Fragment key={filter}>
              <button
                onClick={() => {
                  setActiveFilter(filter);
                  playNeonChime();
                }}
                className={`transition-colors duration-200 uppercase font-bold cursor-pointer ${
                  activeFilter === filter
                    ? 'text-[#FF3366] border-b border-[#FF3366]'
                    : 'hover:text-white text-neutral-500'
                }`}
              >
                {filter}
              </button>
              {index < array.length - 1 && (
                <span className="text-neutral-700 select-none px-1.5">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ASYMMETRIC COLUMNS/GRID DROP */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 pt-2">
        
        {/* 2. FEATURE ITEM (Spans full grid width or 2 large columns) */}
        {(activeFilter === 'ALL' || activeFilter === 'SEARED') && (
          <div 
            className="md:col-span-6 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('feature-brisket')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Elegant, premium product drop card layout */}
            <div 
              onClick={() => handleCardClick('szechuan-brisket')}
              className={`group flex flex-col lg:flex-row justify-between items-stretch border transition-all duration-300 bg-[#121212] overflow-hidden cursor-pointer ${
                activeSelections.includes('szechuan-brisket')
                  ? 'border-[#FF3366] shadow-[0_0_25px_rgba(255,51,102,0.25)] bg-[#1a1114]'
                  : hoveredCard === 'feature-brisket'
                    ? 'border-[#ff3366]/60 shadow-[0_0_25px_rgba(255,51,102,0.15)] bg-[#141112]'
                    : 'border-[#222]'
              }`}
            >
              
              {/* Product Info left area */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                
                {/* Visual Label */}
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 border text-[8.5px] font-mono tracking-widest font-bold ${
                    activeSelections.includes('szechuan-brisket')
                      ? 'bg-[#FF3366] text-white border-[#FF3366]'
                      : 'border-[#FF3366]/30 text-[#FF3366]'
                  }`}>
                    {activeSelections.includes('szechuan-brisket') ? '✓ ACTIVE // WOK FUEL LOADED' : 'PREMIUM EXTREME OVERDRIVE DROP'}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono">CODE: SYS-WOK-BRISKET</span>
                </div>

                {/* Massive Typographic Headline */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display font-black text-3xl md:text-4xl tracking-tight text-white leading-none group-hover:text-[#FF3366] transition-colors">
                      SZECHUAN SMOKED BRISKET WOK
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400 font-bold">夜間川味煙燻牛胸</span>
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
                    <span className="font-mono text-lg font-black text-[#FF3366] tracking-wider animate-pulse">
                      ¥260 <span className="text-[10px] text-neutral-500 font-normal">($38.00)</span>
                    </span>
                  </div>
                </div>

                {/* Monospace Ingredient Block */}
                <div className="bg-black/50 border border-white/5 p-3.5 space-y-2 font-mono text-[10px] text-neutral-400 leading-normal">
                  <div className="flex justify-between items-center text-[#FF3366] text-[8px] font-bold border-b border-white/5 pb-1">
                    <span>INGREDIENTS REGISTERED SPEC:</span>
                    <span>320°C FLASH SEAR ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>[COMP: C3_OIL] PREMIUM RED CHILI NECTAR</div>
                    <div>[BASE: ANGUS_A5] AGED HEAVY SMOKED BRISKET</div>
                    <div>[HEAT: DUAL_INDUCTION] APEX JET STAGE</div>
                    <div>[SPICE: LV_3] FUEL INJECTED SZECHUAN PEPPER</div>
                  </div>
                </div>

                {/* Action button inside drop */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-mono text-neutral-500 text-[10px] uppercase">
                    EST. PREPARATION DURATION: <span className="text-[#FF3366] font-bold">240 SECONDS</span>
                  </span>
                  
                  <span className="font-mono text-[10px] font-bold text-white group-hover:text-[#FF3366] transition-colors flex items-center gap-1.5">
                    {activeSelections.includes('szechuan-brisket') ? 'ACTIVE / DISCHARGE CYLINDER' : 'LOAD WOK CHASSIS'}
                    <span className="w-1.5 h-1.5 bg-[#FF3366] rounded-full inline-block animate-pulse" />
                  </span>
                </div>

              </div>

              {/* Wide Aspect Visual Container Framed in Deep Shadows */}
              {/* Animation 1.02x scale zoom on hover */}
              <div className="lg:w-80 w-full min-h-[180px] bg-[#090909] relative flex items-center justify-center border-t lg:border-t-0 lg:border-l border-[#222] select-none overflow-hidden shrink-0">
                
                {!szechuanLoaded && !szechuanError && (
                  <div className="absolute inset-0 bg-[#0c0c0c] flex items-center justify-center animate-pulse z-20">
                    <svg className="w-10 h-10 text-neutral-800 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}

                {szechuanError ? (
                  <div className="absolute inset-0 bg-neutral-950 border border-[#FF3366]/10 flex flex-col items-center justify-center p-4 text-center z-10 select-none">
                    <span className="text-[10px] text-[#FF3366] font-mono tracking-widest uppercase font-bold animate-pulse">// SYSTEM_IMG_OFFLINE</span>
                    <span className="text-[9px] text-neutral-500 font-mono mt-1">USING DESIGN BLUEPRINT MODE</span>
                  </div>
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" 
                    alt="Szechuan Smoked Brisket Wok" 
                    onLoad={() => setSzechuanLoaded(true)}
                    onError={() => setSzechuanError(true)}
                    className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${szechuanLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: hoveredCard === 'feature-brisket' ? 'scale(1.02)' : 'scale(1)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Gradient overlay supporting ultimate text readability */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }}
                />

                {/* 1.02x zoom graphic container overlaying blueprint on photo */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-15 bg-black/10"
                >
                  {/* Cyberpunk vector blueprint stylized dish representation */}
                  <svg className="w-48 h-48 text-[#FF3366]/20" viewBox="0 0 120 120" fill="none">
                    {/* Concentric rotating radar layout */}
                    <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                    <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="60" cy="60" r="18" stroke="#FF3366" strokeWidth="0.5" strokeDasharray="5 2" />
                    
                    {/* Wok smoke vectors */}
                    <path d="M50 40 Q40 50, 42 60 T48 80" stroke="#FF3366" strokeWidth="0.8" opacity="0.6" className="animate-pulse" />
                    <path d="M70 40 Q80 50, 78 60 T72 80" stroke="#FF3366" strokeWidth="0.8" opacity="0.6" className="animate-pulse" />
                    
                    {/* Meat geometric vectors representing beef cubes */}
                    <rect x="52" y="52" width="16" height="16" transform="rotate(45 60 60)" stroke="#FF3366" strokeWidth="1.5" />
                    <line x1="15" y1="60" x2="105" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                    <line x1="60" y1="15" x2="60" y2="105" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                    
                    <text x="60" y="86" fill="#FF3366" fontSize="5" textAnchor="middle" fontFamily="monospace" letterSpacing="1" opacity="0.8">320°C COMBUSTION</text>
                  </svg>
                </div>
                
                <div className="absolute top-3 right-3 bg-black/60 border border-white/10 px-2 py-0.5 text-[8px] font-mono text-neutral-400 z-30">
                  DIAGRAM_WOK_01
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. SECONDARY ASYMMETRICAL STAGGERED COLUMNS */}
        
        {/* Left Column (Spans 3/6 columns) with visual blueprint element */}
        {(activeFilter === 'ALL' || activeFilter === 'STEAMED') && (
          <div 
            className="md:col-span-3 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('dumpling-drop')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              onClick={() => handleCardClick('truffle-dumplings')}
              className={`group flex flex-col justify-between h-full border transition-all duration-300 bg-[#121212] overflow-hidden cursor-pointer ${
                activeSelections.includes('truffle-dumplings')
                  ? 'border-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.20)] bg-[#1a1114]'
                  : hoveredCard === 'dumpling-drop'
                    ? 'border-[#ff3366]/60 shadow-[0_0_20px_rgba(255,51,102,0.12)] bg-[#141112]'
                    : 'border-[#222]'
              }`}
            >
              {/* Vector blueprint image header */}
              <div className="h-44 bg-[#090909] relative flex items-center justify-center border-b border-[#222] overflow-hidden select-none">
                
                {!dumplingLoaded && !dumplingError && (
                  <div className="absolute inset-0 bg-[#0c0c0c] flex items-center justify-center animate-pulse z-20">
                    <svg className="w-8 h-8 text-neutral-800 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}

                {dumplingError ? (
                  <div className="absolute inset-0 bg-neutral-950 border border-[#FF3366]/10 flex flex-col items-center justify-center p-4 text-center z-10 select-none">
                    <span className="text-[10px] text-[#FF3366] font-mono tracking-widest uppercase font-bold animate-pulse">// STEAM_MATRIX_OFFLINE</span>
                    <span className="text-[9px] text-neutral-500 font-mono mt-1">USING DECRYPTED DIAGRAM</span>
                  </div>
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" 
                    alt="Truffle Chiang Mai Dumplings" 
                    onLoad={() => setDumplingLoaded(true)}
                    onError={() => setDumplingError(true)}
                    className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${dumplingLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: hoveredCard === 'dumpling-drop' ? 'scale(1.02)' : 'scale(1)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Gradient overlay supporting ultimate text readability */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }}
                />

                {/* Overlaid blueprint vectors */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-15 bg-black/10"
                >
                  <svg className="w-36 h-36 text-neutral-400/30 group-hover:text-[#FF3366]/30 transition-colors" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 1" />
                    
                    {/* Steamed dim sum graphics */}
                    <path d="M45 42 C 48 35, 52 35, 55 42 C 58 45, 42 45, 45 42 Z" stroke="#FF3366" strokeWidth="1" />
                    <path d="M42 50 C 45 45, 49 45, 52 50 C 55 52, 39 52, 42 50 Z" stroke="#FF3366" strokeWidth="1" />
                    <path d="M52 52 C 55 47, 59 47, 62 52 C 65 54, 49 54, 52 52 Z" stroke="#FF3366" strokeWidth="1" />
                    
                    <path d="M30 65 L70 65" stroke="currentColor" strokeWidth="1.5" />
                    <text x="50" y="80" fill="#FF3366" fontSize="5" textAnchor="middle" fontFamily="monospace" letterSpacing="0.5" opacity="0.7">CAVIAR STEAM MATRIX</text>
                  </svg>
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-black/60 border border-white/5 px-2 py-0.5 text-[8px] font-mono text-neutral-400 z-30">
                  SPECTRAL_STEAM_STALL_03
                </div>
              </div>

              {/* Data descriptors */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className={`px-1.5 py-0.5 border text-[8px] font-mono tracking-widest font-bold inline-block mb-1.5 ${
                      activeSelections.includes('truffle-dumplings')
                        ? 'bg-[#FF3366] text-white border-[#FF3366]'
                        : 'border-[#FF3366]/30 text-[#FF3366]'
                    }`}>
                      {activeSelections.includes('truffle-dumplings') ? '✓ ACTIVE // DISH SYNCED' : 'LIMITED INJECTION // 03 STEAMED'}
                    </span>
                    <h4 className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#FF3366] transition-colors">
                      TRUFFLE CHIANG MAI DUMPLINGS
                    </h4>
                  </div>
                  <span className="font-mono text-sm font-black text-[#FF3366] tracking-wider shrink-0 mt-0.5">
                    ¥165 <span className="text-[9px] text-neutral-500 font-normal">($24.00)</span>
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Infused with black truffle oil extracts, wrapped in electric crimson beets wrapper, and loaded with dry-aged heritage pork belly.
                </p>

                <div className="flex justify-between text-[9px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                  <span>PREP INTERVAL: 180s</span>
                  <span>420 KCAL // SPICE 0</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Right Column (Spans 3/6 columns) with NO visual image element to break visual repetition */}
        {(activeFilter === 'ALL' || activeFilter === 'INFUSED') && (
          <div 
            className="md:col-span-3 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('chips-drop')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              onClick={() => handleCardClick('lotus-chips')}
              className={`group flex flex-col justify-between h-full border p-6 transition-all duration-300 bg-[#121212] cursor-pointer ${
                activeSelections.includes('lotus-chips')
                  ? 'border-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.20)] bg-[#1a1114]'
                  : hoveredCard === 'chips-drop'
                    ? 'border-[#ff3366]/60 shadow-[0_0_20px_rgba(255,51,102,0.12)] bg-[#141112]'
                    : 'border-[#222]'
              }`}
            >
              
              <div className="space-y-4">
                
                {/* Drop Info Title label */}
                <div className="flex justify-between items-baseline">
                  <span className={`px-1.5 py-0.5 border text-[8px] font-mono tracking-widest font-bold ${
                    activeSelections.includes('lotus-chips')
                      ? 'bg-[#FF3366] text-white border-[#FF3366]'
                      : 'border-[#FF3366]/20 text-[#FF3366]'
                  }`}>
                    {activeSelections.includes('lotus-chips') ? '✓ ACTIVE // SNACK ENGAGED' : '04 INFUSED // TELEMETRY SNACK'}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono">CODE: SYS-LOTUS-CHIPS</span>
                </div>

                {/* Typography blocks and descriptions */}
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-xl tracking-tight text-white group-hover:text-[#FF3366] transition-colors leading-tight">
                    CRISPY LOTUS ROOT CHIPS
                  </h4>
                  <p className="text-xs font-mono text-neutral-400 font-bold">香脆油炸蓮藕片</p>
                </div>

                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Ultra-thinly sliced organic lotus roots fried in pure flash peanut oil. Generously dusted with high-octane dried szechuan chili hulls and high-purity volcanic salt.
                </p>

                {/* Additional asymmetric technical metrics layout to replace image */}
                <div className="bg-black/40 border border-white/5 p-3.5 space-y-1.5 font-mono text-[9.5px] text-neutral-500">
                  <div className="flex justify-between">
                    <span>SEAR INTENSITY:</span>
                    <span className="text-white font-bold">290°C COAXIAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OIL ABSORPTION INDEX:</span>
                    <span className="text-white font-bold">4.2% CRITICAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CRISP RESONANCE DEV:</span>
                    <span className="text-white font-bold">88 / 100 STABLE</span>
                  </div>
                </div>

              </div>

              {/* Grid Pricing with no image footer */}
              <div className="space-y-3 pt-4 mt-6 border-t border-white/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-neutral-500 font-mono">DISH DROP COST INDEX</span>
                  <span className="font-mono text-base font-black text-[#FF3366]">
                    ¥82 <span className="text-[9px] text-neutral-500 font-normal">($12.00)</span>
                  </span>
                </div>
                
                <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                  <span>PREP COAXIAL: 90s</span>
                  <span>140 KCAL // SPICE 1</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      <div className="text-center pt-2 select-none">
        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed">
          CLICKING DISH DROPS DIRECTY LOADS THE CORRESPONDING HEAT INJECTORS ON LANE 01 ORDER ENGINE. 
          <br className="hidden sm:inline" /> 
          PROV-GRID INTEGRATION COMPATIBLE WITH APEX ACTIVE COUPE, SEDAN, AND SUV VEHICLE CHASSIS.
        </p>
      </div>

    </div>
  );
}
