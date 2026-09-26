import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Flame, Gauge, Volume2, VolumeX, Cpu, CheckCircle2, Sparkles, Navigation, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TELEMETRY_FEED } from './data';
import { MENU_ITEMS } from './config/menuConfig';

import { MenuItem, DriveThruConfig, MetricState } from './types';
import CinematicBackground from './components/CinematicBackground';
import MenuItemCard from './components/MenuItemCard';
import ConfigurationPanel from './components/ConfigurationPanel';
import ExpressLogistics from './components/ExpressLogistics';
import { ProfileType } from './components/ChassisProfileSelector';
import AsymmetricMenuGrid from './components/AsymmetricMenuGrid';
import CheckoutCRO from './components/CheckoutCRO';
import AudioEngineControl from './components/AudioEngineControl';
import { startEngineHum, stopEngineHum, playNeonChime, playWokSizzle, setVolume, playHardwareThud } from './utils/audio';

export default function App() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([MENU_ITEMS[0].id]); // pre-select wagyu
  const [config, setConfig] = useState<DriveThruConfig>({
    vehicleClass: 'SUPERCAR',
    boostPreset: 'UMAMI',
    lanePriority: true,
    wokTemperature: 320,
  });

  const [activeTab, setActiveTab] = useState<'cuisine' | 'drops' | 'logistics' | 'checkout'>('cuisine');
  const [syncedVehicle, setSyncedVehicle] = useState<{ plate: string; type: ProfileType } | null>(null);

  // System animation / checkout trigger
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStep, setInitStep] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);

  // CRO Custom additions and dynamic calculations
  const [authorizeAdditions, setAuthorizeAdditions] = useState<string[]>([]);
  const [customYuanTotal, setCustomYuanTotal] = useState<string | null>(null);
  const [customUsdTotal, setCustomUsdTotal] = useState<string | null>(null);

  // Live calculated metrics
  const [metrics, setMetrics] = useState<MetricState>({
    pipelineVolume: 65,
    avgWokTimeSeconds: 198,
    liveWaitMinutes: 4.2,
    apexSpeedMatures: 240,
  });

  // Handle live recalculation of wait times based on configurations
  useEffect(() => {
    let totalPrepSeconds = 0;
    
    // Add time from selected items
    selectedItems.forEach((itemId) => {
      const item = MENU_ITEMS.find((i) => i.id === itemId);
      if (item) {
        totalPrepSeconds += item.prepTimeSeconds;
      }
    });

    if (totalPrepSeconds === 0) {
      totalPrepSeconds = 120; // baseline if empty
    }

    // Vehicle weight dynamic modifier
    let vehicleMod = 1.0;
    if (config.vehicleClass === 'HYPERCAR') vehicleMod = 0.8;
    else if (config.vehicleClass === 'SUPERCAR') vehicleMod = 0.9;
    else if (config.vehicleClass === 'EV') vehicleMod = 1.0;
    else if (config.vehicleClass === 'SPORT_TOURER') vehicleMod = 1.15;

    // Fuel Boost modifier
    let boostSec = 0;
    if (config.boostPreset === 'UMAMI') boostSec = 25;
    else if (config.boostPreset === 'SUPERCHARGED') boostSec = 50;

    // Heat factor: higher wok heat cooks faster
    const heatSavingSec = (config.wokTemperature - 250) * 0.4; // up to 40 seconds off

    // Compute wait
    let finalSeconds = (totalPrepSeconds - boostSec - heatSavingSec) * vehicleMod;
    
    // Lane priority discount
    if (config.lanePriority) {
      finalSeconds *= 0.85;
    }

    // Convert to minutes with random noise to simulate ticking/live calculations
    let calculatedMinutes = Math.max(1.5, finalSeconds / 60);

    // Dynamic pipe volume
    const currentPipeVolume = Math.min(
      95,
      Math.max(25, 45 + selectedItems.length * 10 - (config.lanePriority ? 15 : 0))
    );

    setMetrics({
      pipelineVolume: Math.round(currentPipeVolume),
      avgWokTimeSeconds: Math.round(Math.max(90, totalPrepSeconds - boostSec - heatSavingSec)),
      liveWaitMinutes: parseFloat(calculatedMinutes.toFixed(1)),
      apexSpeedMatures: Math.round(180 + (config.wokTemperature - 250) * 0.8),
    });
  }, [selectedItems, config]);

  // Audio Toggle
  const handleToggleAudio = () => {
    if (audioEnabled) {
      stopEngineHum();
      setAudioEnabled(false);
    } else {
      startEngineHum();
      setAudioEnabled(true);
    }
  };

  // Toggle selection of food item
  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        // preserve at least one item
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle highly coordinated transitions with midpoint tactile mechanical sound feedback
  const handleTabChange = (targetTab: 'cuisine' | 'drops' | 'logistics' | 'checkout') => {
    if (targetTab === activeTab) return;
    
    // Play electronic transition snap / mechanical hardware closure thud at exactly the midpoint (190ms)
    // of our elegant 380ms framer-motion transition window
    setTimeout(() => {
      try {
        playHardwareThud();
      } catch (err) {
        console.warn('Transition sound trigger failure:', err);
      }
    }, 190);
    
    setActiveTab(targetTab);
  };

  // Run the express initialization micro-cinematic sequence
  const handleTriggerExpressLane = () => {
    if (isInitializing) return;
    
    playNeonChime();
    handleTabChange('checkout');
  };

  // Calculate total price of current selections
  const getTotalPrice = () => {
    let sum = 0;
    selectedItems.forEach((id) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      if (item) {
        const val = parseInt(item.price.replace('¥', ''));
        sum += val;
      }
    });
    // Add dynamic premium service surcharge for peak boost
    if (config.lanePriority) sum += 30;
    return `¥${sum}`;
  };

  return (
    <div id="midnight-express-root" className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#0A0A0A] text-white flex flex-col justify-between overflow-x-hidden relative font-sans select-none selection:bg-[#FF3366] selection:text-white">
      
      {/* 2. BACKGROUND CONTAINER (Full bleed dynamic highway loop canvas) */}
      <CinematicBackground />

      {/* FIXED HEADER SYSTEM */}
      <header id="midnight-express-header" className="relative z-10 border-b border-white/5 bg-[#040404]/80 backdrop-blur-lg px-6 py-3 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 animate-pulse ${
            activeTab === 'cuisine' 
              ? 'bg-[#FF3366]' 
              : activeTab === 'drops' 
                ? 'bg-[#FF3366]' 
                : activeTab === 'checkout' 
                  ? 'bg-[#FF3366]' 
                  : 'bg-[#00FF66]'
          }`} />
          <span className="font-mono text-xs tracking-[0.16em] font-extrabold text-white">
            THE MIDNIGHT EXPRESS <span className="text-neutral-500 font-normal select-none">// 夜間馳騁</span>
          </span>
        </div>

        {/* Tab Controller Switcher Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#111] p-1 border border-white/5 order-last sm:order-none shadow-2xl relative">
          
          <button
            id="tab-culinary-engine"
            onClick={() => handleTabChange('cuisine')}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest transition-all duration-300 uppercase flex items-center gap-1.5 font-bold cursor-pointer relative border ${
              activeTab === 'cuisine'
                ? 'bg-[#FF3366] text-white border-[#FF3366] shadow-[0_0_18px_rgba(255,51,102,0.45)]'
                : 'text-neutral-400 hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            01 // CULINARY ENGINE
            {activeTab === 'cuisine' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
            )}
          </button>
          
          <button
            id="tab-asymmetric-drops"
            onClick={() => handleTabChange('drops')}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest transition-all duration-300 uppercase flex items-center gap-1.5 font-bold cursor-pointer relative border ${
              activeTab === 'drops'
                ? 'bg-[#FF3366] text-white border-[#FF3366] shadow-[0_0_18px_rgba(255,51,102,0.45)]'
                : 'text-neutral-400 hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF3366] group-hover:text-white" />
            02 // LUXURY DROPS
            {activeTab === 'drops' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
            )}
          </button>
          
          <button
            id="tab-logistics-matrix"
            onClick={() => handleTabChange('logistics')}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest transition-all duration-300 uppercase flex items-center gap-1.5 font-bold cursor-pointer relative border ${
              activeTab === 'logistics'
                ? 'bg-[#FF3366] text-white border-[#FF3366] shadow-[0_0_18px_rgba(255,51,102,0.45)]'
                : 'text-neutral-400 hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            03 // LOGISTICS
            {activeTab === 'logistics' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
            )}
          </button>
          
          <button
            id="tab-checkout-cro"
            onClick={() => handleTabChange('checkout')}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest transition-all duration-300 uppercase flex items-center gap-1.5 font-bold cursor-pointer relative border ${
              activeTab === 'checkout'
                ? 'bg-[#FF3366] text-white border-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.5)]'
                : 'text-neutral-400 hover:text-[#FF3366] border-transparent hover:border-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#FF3366] group-hover:text-white" />
            04 // TERMINAL CHECKOUT
            {activeTab === 'checkout' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white" />
            )}
          </button>

        </div>

        {/* Ambient audio toggle control */}
        <AudioEngineControl 
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
        />
      </header>

      {/* CORE EDITORIAL VIEWPORT */}
      <div id="midnight-express-viewport-wrapper" className="relative z-10 flex-1 w-full flex flex-col lg:overflow-hidden justify-center pb-24 lg:pb-0">
        
        <main
          id="midnight-express-main" 
          className="grid grid-cols-1 lg:grid-cols-2 w-full lg:h-full lg:overflow-hidden"
        >
          {/* LEFT COLUMN: BRAND HERO EDITORIAL HEADER AREA */}
          <div id="midnight-hero-left" className="px-4 py-8 sm:p-6 md:p-8 lg:p-16 lg:h-full flex flex-col justify-center space-y-4 lg:space-y-6 text-left border-b lg:border-b-0 lg:border-r border-[#161616]">
            
            {/* Micro-Labels & Telemetry Metadata */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-[#FF3366]/20 bg-[#FF3366]/10 text-xs font-mono tracking-widest text-[#FF3366]">
                LANE 01 // OVERDRIVE
              </span>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#FF3366]/30 to-transparent" />
              <span className="text-[10px] text-neutral-500 font-mono tracking-wide uppercase">
                HIGH-TEMPERATURE SEARING OUTLET // EST 2026
              </span>
            </div>

            {/* 1. MASSIVE, HIGH-CONTRAST EDITORIAL HEADLINE */}
            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white leading-none">
                THE MIDNIGHT
              </h1>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-[#FF3366] leading-none uppercase relative flex items-center gap-4">
                EXPRESS <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neutral-600 font-normal">夜間馳騁</span>
              </h1>
            </div>

            <p className="text-sm md:text-md text-neutral-400 font-sans tracking-wide leading-relaxed max-w-lg">
              A premium cybernetic night market drive-thru. Aerodynamic vehicle pickup prioritized, wok charred culinary fuel prepared at 320°C, and instantly loaded with high-octane spice.
            </p>

            {/* Action container with prominent CTA button */}
            <div id="cta-landing-container" className="pt-4 space-y-4 max-w-md hidden lg:block">
              
              {/* 3. MAGNETIC PRIMARY CTA WITH INTERNAL BORDER EXPANSION MICRO-INTERACTION (on hover) */}
              <button
                id="initialize-express-lane-cta"
                onClick={handleTriggerExpressLane}
                disabled={isInitializing}
                className={`w-full group relative py-4 px-6 text-left bg-gradient-to-r from-[#FF3366] to-[#E62255] cursor-pointer text-white transition-all duration-300 select-none shadow-[0_5px_30px_rgba(255,51,102,0.25)] hover:shadow-[0_8px_40px_rgba(255,51,102,0.4)] border-none shrink-0 ${
                  isInitializing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {/* Internal border expansion micro-interaction block on hover */}
                <span className="absolute inset-[3px] border border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none" />
                
                {/* Secondary micro highlighted border loop */}
                <span className="absolute inset-0 border border-[#FF3366] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none" />

                <div className="flex justify-between items-center relative z-20">
                  <div className="space-y-0.5">
                    <span className="text-[10px] tracking-widest text-white/70 font-mono block">
                      {isInitializing ? 'CALCULATING HANDSHAKE...' : '01 // VECTOR FLOW'}
                    </span>
                    <span className="font-display font-black text-lg md:text-xl tracking-tight uppercase flex items-center gap-2">
                      {isInitializing ? 'INITIALIZING...' : 'INITIALIZE EXPRESS LANE'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                  
                  {/* Visual heat spark badge inside CTA */}
                  <div className="bg-black/30 backdrop-blur-sm p-2 text-center flex flex-col items-center">
                    <Flame className="w-4 h-4 text-[#FF3366]" />
                    <span className="text-[9px] font-mono mt-0.5 font-bold tracking-tighter">
                      {config.wokTemperature}°C
                    </span>
                  </div>
                </div>
              </button>

              {/* Micro Live metrics wait time line inside CTA bounding block */}
              <div className="flex justify-between items-center text-[11px] font-mono tracking-wider px-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-neutral-500 uppercase">EST. WAIT TIME</span>
                </div>
                
                {/* 3. Live metrics reading required by prompt */}
                <span className="text-[#FF3366] font-bold tracking-tight text-right flex items-center gap-1 bg-[#151213] px-2 py-0.5 border border-[#FF3366]/10">
                  Est. Wait: <span className="font-black text-white">{metrics.liveWaitMinutes} Min</span>
                </span>
              </div>
            </div>

            {/* TELEMETRY READOUT / TERMINAL FLOW */}
            <div className="bg-[#111111]/80 border border-white/5 p-4 rounded-none font-mono text-[10px] space-y-1 text-neutral-400 mt-2 max-w-lg relative block overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 text-neutral-600">
                <Cpu className="w-3 h-3 text-[#FF3366]" />
                <span>DIAG_PORT</span>
              </div>
              <div className="text-neutral-500 pb-1 border-b border-white/5 uppercase select-none mb-1 tracking-tighter xs:tracking-tight md:tracking-normal">
                VECTOR HANDSHAKE DATA STREAM (LIVE):
                <div className="text-[8px] text-neutral-500 font-mono tracking-wider lowercase mt-0.5">// Real-Time Logistics Pipeline</div>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1.5">
                <span>[ACTIVE MENU DEPTH]</span>
                <span className="text-white">{selectedItems.length} SELECTIONS</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1.5">
                <div className="flex flex-col text-left">
                  <span>[VEHICLE COEFFICIENT]</span>
                  <span className="text-[8px] text-neutral-500 font-mono tracking-wider lowercase mt-0.5">// Selected Vehicle Profile</span>
                </div>
                <span className="text-white self-center">{config.vehicleClass} ({metrics.pipelineVolume > 60 ? 'HIGH INTAKE' : 'STABLE'})</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1.5">
                <div className="flex flex-col text-left">
                  <span>[APEX BURN PRESSURE]</span>
                  <span className="text-[8px] text-neutral-500 font-mono tracking-wider lowercase mt-0.5">// Spice Intensity Preset</span>
                </div>
                <span className="text-[#FF3366] self-center">{config.boostPreset} SPICE</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-1.5">
                <span>[CALCULATED PRICE]</span>
                <motion.span 
                  key={getTotalPrice()}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    color: ['#FFFFFF', '#FF3366', '#FFFFFF'],
                    textShadow: ['0 0 0px rgba(255, 51, 102, 0)', '0 0 12px rgba(255, 51, 102, 0.8)', '0 0 0px rgba(255, 51, 102, 0)']
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="font-mono font-bold text-white text-right inline-block origin-right"
                >
                  {getTotalPrice()}
                </motion.span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SLIDING VIEWPORTS */}
          <div id="midnight-hero-right" className="lg:h-full lg:overflow-hidden relative flex flex-col bg-[#050505]/50">
            <AnimatePresence mode="wait">
              {activeTab === 'cuisine' && (
                <motion.div
                  key="cuisine-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-4 sm:px-6 md:px-12 py-6 md:py-12 lg:p-12 xl:p-16 w-full lg:h-full lg:overflow-y-auto custom-scrollbar space-y-6"
                >
                  <div className="space-y-4">
                    
                    {/* Header for food engine select */}
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-neutral-500 font-mono tracking-widest block">
                          CRAV_ENGINE v1.02
                        </span>
                        <h2 className="font-display font-medium text-xs tracking-widest text-[#FF3366] uppercase">
                          CARGO MENU SELECTION // LOAD VEHICLE
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {selectedItems.length} OF {MENU_ITEMS.length} ENGINES LOADED
                      </span>
                    </div>

                    {/* Dynamic Items Cards list conforming to strict luxury visual rule */}
                    <div className="space-y-2.5">
                      {MENU_ITEMS.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          isSelected={selectedItems.includes(item.id)}
                          onSelect={() => handleToggleItem(item.id)}
                        />
                      ))}
                    </div>

                    {/* Dynamic Config telemetry sliders panel */}
                    <ConfigurationPanel
                      config={config}
                      onChange={(newConfig) => setConfig(newConfig)}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'drops' && (
                <motion.div
                  key="drops-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-4 sm:px-6 md:px-12 py-6 md:py-12 lg:p-12 xl:p-16 w-full lg:h-full lg:overflow-y-auto custom-scrollbar"
                >
                  <AsymmetricMenuGrid 
                    activeSelections={selectedItems}
                    onSelectItem={(id) => handleToggleItem(id)}
                  />
                </motion.div>
              )}

              {activeTab === 'checkout' && (
                <motion.div
                  key="checkout-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-4 sm:px-6 md:px-12 py-6 md:py-12 lg:p-12 xl:p-11 w-full lg:h-full lg:overflow-y-auto custom-scrollbar"
                >
                  <CheckoutCRO
                    selectedItems={selectedItems}
                    syncedVehicle={syncedVehicle}
                    config={config}
                    metrics={metrics}
                    onClose={() => handleTabChange('cuisine')}
                    onAuthorizeComplete={(finalTotalYan, finalTotalUsd, additions) => {
                      setAuthorizeAdditions(additions);
                      setCustomYuanTotal(finalTotalYan);
                      setCustomUsdTotal(finalTotalUsd);
                      setShowInvoice(true);
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'logistics' && (
                <motion.div
                  key="logistics-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-4 sm:px-6 md:px-12 py-6 md:py-12 lg:p-12 xl:p-16 w-full lg:h-full lg:overflow-y-auto custom-scrollbar"
                >
                  <ExpressLogistics 
                    initialWaitMin={metrics.liveWaitMinutes}
                    onSyncComplete={(plate, type) => {
                      setSyncedVehicle({ plate, type });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* OVERDYNAMIC CINEMATIC INITIALIZING SCREEN MODAL */}
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="max-w-md w-full space-y-6">
              
              {/* Matrix glow radar logo */}
              <div className="relative inline-block mx-auto">
                <div className="w-16 h-16 rounded-none border border-[#FF3366] flex items-center justify-center relative animate-spin [animation-duration:8s]">
                  <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#FF3366]" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#FF3366]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#FF3366] animate-pulse" />
                </div>
              </div>

              {/* Progress Stepper readout */}
              <div className="space-y-2 font-mono text-xs">
                <h3 className="font-display font-bold text-lg tracking-wider text-white uppercase">
                  INITIALIZING DRIVE-THRU HANDSHAKE
                </h3>
                <p className="text-neutral-500 tracking-wider">
                  TUNING PRESSURE INTAKES ON APEX LANE 01
                </p>
              </div>

              {/* Step indicator sequence */}
              <div className="bg-[#111111] border border-white/5 p-4 text-left space-y-1.5 font-mono text-[11px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className={initStep >= 0 ? "text-[#FF3366]" : "text-neutral-700"}>
                    {initStep > 0 ? "✓" : "▶"}
                  </span>
                  <span className={initStep >= 0 ? "text-white" : "text-neutral-600"}>
                    SYNCING APEX {config.vehicleClass} HANDSHAKE COMPLETED.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={initStep >= 1 ? "text-[#FF3366]" : "text-neutral-700"}>
                    {initStep > 1 ? "✓" : initStep === 1 ? "▶" : "○"}
                  </span>
                  <span className={initStep >= 1 ? "text-white" : "text-neutral-600"}>
                    IGNITING BURN PRESSURE TO {config.wokTemperature}°CELSIUS...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={initStep >= 2 ? "text-[#FF3366]" : "text-neutral-700"}>
                    {initStep > 2 ? "✓" : initStep === 2 ? "▶" : "○"}
                  </span>
                  <span className={initStep >= 2 ? "text-white" : "text-neutral-600"}>
                    SZECHUAN NITRO CODES GENERATED ACCORDING TO SYSTEM CONFIG.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={initStep >= 3 ? "text-[#FF3366]" : "text-neutral-700"}>
                    {initStep >= 3 ? "✓" : "○"}
                  </span>
                  <span className={initStep >= 3 ? "text-white" : "text-neutral-600"}>
                    DISPATCH PRINCIPALS ARMED FOR APEX SPEED LANE.
                  </span>
                </div>
              </div>

              {/* Wait indicator bar */}
              <div className="w-full bg-neutral-800 h-1 relative overflow-hidden">
                <div
                  className="bg-[#FF3366] h-full transition-all duration-1000 ease-out shadow-[0_0_8px_#FF3366]"
                  style={{ width: `${(initStep / 3) * 100}%` }}
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINALIZED ORDER SUMMARY INVOICE MODAL */}
      <AnimatePresence>
        {showInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md select-none"
          >
            <div className="bg-[#111111] border border-[#FF3366] max-w-md w-full p-6 text-left relative shadow-[0_0_40px_rgba(255,51,102,0.2)]">
              
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF3366]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#FF3366]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#FF3366]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF3366]" />

              <div className="text-center pb-4 border-b border-white/5 space-y-1.5">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="font-display font-medium text-sm tracking-widest text-[#FF3366] uppercase">
                  DISPATCH CONFIRMATION // GATEWAY 01
                </h3>
                <span className="font-mono text-[9px] text-neutral-500 block uppercase">
                  RESERVATION KEY: MDN-{Math.floor(100000 + Math.random() * 900000)}
                </span>
                {syncedVehicle && (
                  <span className="text-[10px] bg-[#00FF66]/10 border border-[#00FF66]/20 text-[#00FF66] px-2 py-0.5 tracking-wider font-mono uppercase inline-block mt-1">
                    VEHICLE: {syncedVehicle.plate} [{syncedVehicle.type}]
                  </span>
                )}
              </div>

              {/* Invoice Table elements */}
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="text-neutral-500 border-b border-white/5 pb-1 uppercase text-[10px]">
                  PROVISION REPORT:
                </div>
                
                {selectedItems.map((id) => {
                  const item = MENU_ITEMS.find((m) => m.id === id);
                  if (!item) return null;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-white">
                      <span>{item.name}</span>
                      <span className="text-[#FF3366] font-bold">{item.price}</span>
                    </div>
                  );
                })}

                {authorizeAdditions.map((addition) => (
                  <div key={addition} className="flex justify-between items-center text-[#00FF66]">
                    <span>+ {addition}</span>
                    <span className="font-bold">
                      {addition.includes("CHILI") ? "¥28" : "¥63"}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-white/5 space-y-1 text-neutral-400">
                  <div className="flex justify-between">
                    <span>VEHICLE MULTIPLIER ({config.vehicleClass})</span>
                    <span className="text-white">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FUEL SEAR BOOST ({config.boostPreset})</span>
                    <span className="text-white">Applied</span>
                  </div>
                  {config.lanePriority && (
                    <div className="flex justify-between text-[#FF3366]">
                      <span>APEX DIRECT PRIORITY SURCHARGE</span>
                      <span>+¥30</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-dashed border-[#FF3366]/40 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase">TOTAL METRIC COST</span>
                  <span className="text-xl font-display font-black text-[#FF3366]">
                    {customYuanTotal || getTotalPrice()}
                  </span>
                </div>
              </div>

              {/* ETA Display Box */}
              <div className="bg-[#151213] border border-[#FF3366]/20 p-3 rounded-none flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono block">EXPRESS TERMINATION WAIT:</span>
                  <span className="font-display font-black text-white text-lg tracking-tight">
                    {metrics.liveWaitMinutes} MINS
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 font-mono block">APEX APERTURE:</span>
                  <span className="font-mono text-emerald-500 font-bold block text-sm">
                    LANE 01 // OVERDRIVE
                  </span>
                </div>
              </div>

              {/* Reset button to construct another formula */}
              <div className="mt-5">
                <button
                  id="reset-invoice-btn"
                  onClick={() => setShowInvoice(false)}
                  className="w-full py-2.5 px-4 text-center border border-white/10 hover:border-[#FF3366]/50 hover:bg-[#FF3366]/5 font-mono text-xs text-white transition-all uppercase"
                >
                  RETURN TO STEWARD ENGINE
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY BOTTOM ACTION SHEET BAR */}
      <div 
        id="mobile-sticky-action-bar"
        className="fixed bottom-0 left-0 right-0 bg-[#070707]/95 backdrop-blur-xl border-t border-[#FF3366]/20 py-3 px-5 flex lg:hidden items-center justify-between gap-4 z-40 shadow-[0_-12px_30px_rgba(0,0,0,0.9)]"
      >
        <div className="flex flex-col text-left font-mono">
          <span className="text-[9px] text-[#FF3366] tracking-widest uppercase">// [CALCULATED PRICE]</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <motion.span 
              key={getTotalPrice()}
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                color: ['#FFFFFF', '#FF3366', '#FFFFFF'],
                textShadow: ['0 0 0px rgba(255, 51, 102, 0)', '0 0 12px rgba(255, 51, 102, 0.8)', '0 0 0px rgba(255, 51, 102, 0)']
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-lg font-black tracking-tight text-white inline-block origin-left"
            >
              {getTotalPrice()}
            </motion.span>
            <span className="text-[8px] text-neutral-400 font-mono tracking-tighter">({metrics.liveWaitMinutes}M EST)</span>
          </div>
        </div>

        <button
          id="mobile-sticky-initialize-btn"
          onClick={handleTriggerExpressLane}
          disabled={isInitializing}
          className="group relative px-4 py-2.5 bg-gradient-to-r from-[#FF3366] to-[#E62255] cursor-pointer text-white font-mono font-bold text-xs tracking-widest uppercase shadow-[0_4px_15px_rgba(255,51,102,0.35)] active:scale-95 transition-all outline-none border-none flex items-center gap-1.5 select-none"
        >
          <span className="absolute inset-[2px] border border-white/0 group-hover:border-white/20 transition-all pointer-events-none" />
          <span>{isInitializing ? 'INITIALIZING...' : 'INITIALIZE'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 4. PERSISTENT LOW-PROFILE HORIZONTAL TICKER BANNER AT BOTTOM VIEWPORT */}
      <footer id="midnight-express-ticker-banner" className="relative z-10 border-t border-white/5 bg-[#050505] p-2.5 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
        
        {/* Infinite CSS marquee loop using flex and animation */}
        <div className="flex select-none overflow-hidden max-w-full">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-[10px] uppercase font-mono tracking-widest text-neutral-500">
            {/* Iterated twice so there is no visual gap in horizontal flow */}
            {[...TELEMETRY_FEED, ...TELEMETRY_FEED, ...TELEMETRY_FEED].map((feed, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className="font-bold text-[#FF3366] select-none">//</span>
                <span className="hover:text-white transition-colors duration-200 cursor-default">
                  {feed}
                </span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
