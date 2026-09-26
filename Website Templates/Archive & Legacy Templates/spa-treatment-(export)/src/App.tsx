/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { TreatmentMenu } from './components/SerenityMenu';
import { BreathingSanctuary } from './components/BreathingSanctuary';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Calendar, 
  Clock, 
  Sun,
  Volume2,
  VolumeX,
  Play,
  ArrowDown,
  Info,
  Check,
  Award,
  BookOpen
} from 'lucide-react';

// Unified Premium Luxury Sanctuary Menu Dataset
const RITUAL_CATEGORIES_DATA = [
  {
    name: "Massages & Therapeutic Bodywork",
    items: [
      "Warm Basalt Stone Restorative | 75 Min / $210",
      "Himalayan Salt Stone Therapy | 60 Min / $195",
      "Deep-Tissue Muscle Release | 90 Min / $240",
      "Aromatherapy Meditation Massage | 75 Min / $215",
      "Warm Sand Cocoon Ritual | 90 Min / $260"
    ]
  },
  {
    name: "Thermal Bath & Aqueous Rituals",
    items: [
      "Mineral Rich Hydrotherapy Soak | 30 Min / $95",
      "Alps Salt Inhalation Steambath | 45 Min / $120",
      "Botanical Infused Tub Bath | 40 Min / $110",
      "Detoxifying Herbal Steam Canopy | 45 Min / $130"
    ]
  },
  {
    name: "Botanical Facials & Skin Medicine",
    items: [
      "Pure Wildflower Radiance Facial | 60 Min / $185",
      "Aura Collagen Lift Therapy | 75 Min / $220",
      "Oxygen Skin Infusion | 75 Min / $210",
      "Cryo-Firming Cellular Facial | 60 Min / $195"
    ]
  },
  {
    name: "Breathwork & Guided Recovery",
    // Premium customizable listing items
    items: undefined
  }
];

export default function App() {
  const [categories, setCategories] = useState(RITUAL_CATEGORIES_DATA);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [selectedRitualFilter, setSelectedRitualFilter] = useState<'all' | 'body' | 'thermal' | 'facial'>('all');
  const [userNewsletterEmail, setUserNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'philosophy' | 'provenance' | 'scent'>('philosophy');
  const [theme, setTheme] = useState<'obsidian' | 'alabaster'>('obsidian');

  const videoRef = useRef<HTMLVideoElement>(null);

  const isDark = theme === 'obsidian';

  // Dynamic Theme Styling configurations
  const themeBg = isDark ? 'bg-[#0D0D0C] text-[#E5E4E0]' : 'bg-[#FAF9F5] text-[#2C2A27]';
  const themeHeaderBg = isDark ? 'bg-[#0D0D0C]/75 border-stone-900/60' : 'bg-[#FAF9F5]/85 border-stone-200/80';
  const themeTextH1 = isDark ? 'text-stone-100' : 'text-stone-900';
  const themeTextSubtitle = isDark ? 'text-stone-400' : 'text-stone-600';
  const themeTextItalic = isDark ? 'text-stone-300' : 'text-stone-800';
  const themeTextSubtle = isDark ? 'text-stone-500' : 'text-stone-400';
  const themeBorder = isDark ? 'border-stone-900' : 'border-stone-200';
  const themeBorderSubtle = isDark ? 'border-stone-850' : 'border-stone-150';
  const themeCardBg = isDark ? 'bg-stone-950/45' : 'bg-[#F2F0EA]/80';
  const themeBadge = isDark ? 'bg-stone-950/80 border-[#1B1A18]' : 'bg-[#EDEBE5] border-stone-250';
  const themeFAQBorder = isDark ? 'border-[#1B1A18]/80' : 'border-stone-200/80';

  // Video controller behavior
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  // Filtered categories preview handler
  const handleFilterChange = (filter: 'all' | 'body' | 'thermal' | 'facial') => {
    setSelectedRitualFilter(filter);
    if (filter === 'all') {
      setCategories(RITUAL_CATEGORIES_DATA);
    } else if (filter === 'body') {
      setCategories(RITUAL_CATEGORIES_DATA.filter(c => c.name.includes("Bodywork") || c.name.includes("Breathwork")));
    } else if (filter === 'thermal') {
      setCategories(RITUAL_CATEGORIES_DATA.filter(c => c.name.includes("Aqueous") || c.name.includes("Thermal")));
    } else if (filter === 'facial') {
      setCategories(RITUAL_CATEGORIES_DATA.filter(c => c.name.includes("Facials")));
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (userNewsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setUserNewsletterEmail('');
    }
  };

  return (
    <div className={`relative min-h-screen ${themeBg} noise-overlay overflow-x-hidden selection:bg-stone-800 selection:text-white transition-all duration-700`}>
      
      {/* 1. FLUID LUXURY NAVIGATION HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 px-3 min-[400px]:px-6 md:px-12 py-3 min-[400px]:py-4 md:py-6 backdrop-blur-md ${themeHeaderBg} border-b flex justify-between items-center transition-all duration-500`}>
        <a href="#" className="flex items-center space-x-2 min-[400px]:space-x-3 group" id="serenity-brand-logo">
          <div className="w-7 h-7 min-[400px]:w-8 min-[400px]:h-8 rounded-full border border-stone-800/40 flex items-center justify-center bg-stone-950/20 relative overflow-hidden transition-all duration-300 group-hover:border-stone-500">
            <span className="font-serif italic text-xs font-light tracking-widest">S</span>
          </div>
          <div>
            <span className={`font-sans text-[10px] min-[400px]:text-xs tracking-[0.25em] min-[400px]:tracking-[0.3em] font-medium uppercase transition-colors ${isDark ? 'text-stone-300 group-hover:text-stone-100' : 'text-stone-700 group-hover:text-stone-900'}`}>
              SERENITY
            </span>
            <span className="block text-[7px] min-[400px]:text-[8px] font-mono tracking-widest text-stone-500">SANCTUARY</span>
          </div>
        </a>

        <nav className={`hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-light ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          <a href="#about" className={`transition-colors ${isDark ? 'hover:text-stone-100' : 'hover:text-stone-900'}`}>Origins</a>
          <a href="#rituals" className={`transition-colors ${isDark ? 'hover:text-stone-100' : 'hover:text-stone-900'}`}>The Rituals</a>
          <a href="#philosophy" className={`transition-colors ${isDark ? 'hover:text-stone-100' : 'hover:text-stone-900'}`}>Breath</a>
          <a href="#location" className={`transition-colors ${isDark ? 'hover:text-stone-100' : 'hover:text-stone-900'}`}>Find Us</a>
        </nav>

        <div className="flex items-center space-x-2 min-[400px]:space-x-4">
          {/* Aesthetic Toggle Switch */}
          <div className="flex items-center space-x-1 p-0.5 min-[400px]:space-x-1.5 min-[400px]:p-1 bg-stone-950/20 rounded-full border border-stone-800/65 text-[8px] min-[400px]:text-[9px] font-mono select-none">
            <button 
              onClick={() => setTheme('obsidian')}
              className={`px-1.5 min-[400px]:px-2.5 py-0.5 rounded-full transition-all duration-300 ${isDark ? 'bg-stone-100 text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-400'}`}
              title="Switch to Obsidian Noir theme"
            >
              <span className="hidden min-[400px]:inline">Obsidian</span>
              <span className="min-[400px]:hidden">Noir</span>
            </button>
            <button 
              onClick={() => setTheme('alabaster')}
              className={`px-1.5 min-[400px]:px-2.5 py-0.5 rounded-full transition-all duration-300 ${!isDark ? 'bg-stone-950 text-[#FAF9F5] font-semibold' : 'text-stone-500 hover:text-[#FAF9F5]'}`}
              title="Switch to Alabaster Sand theme"
            >
              <span className="hidden min-[400px]:inline">Alabaster</span>
              <span className="min-[400px]:hidden">Light</span>
            </button>
          </div>

          <button 
            id="client-portal-btn"
            onClick={() => alert("Sovereign Client Access is restricted. Please contact your private concierge key holder for your secure credentials.")}
            className={`hidden sm:inline-block text-[10px] tracking-[0.15em] uppercase font-light transition-colors pr-2 border-r ${isDark ? 'text-stone-400 hover:text-stone-100 border-stone-800/40' : 'text-stone-600 hover:text-stone-900 border-stone-200'}`}
          >
            Portal Access
          </button>
          
          <a 
            href="#rituals"
            id="luxury-cta-booking"
            className={`${isDark ? 'bg-stone-100 text-[#0D0D0C] hover:bg-white shadow-md hover:shadow-stone-950' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'} text-[9px] min-[400px]:text-xs uppercase font-medium tracking-[0.1em] min-[400px]:tracking-[0.15em] px-2.5 py-1.5 min-[400px]:px-5 min-[400px]:py-2.5 rounded-sm transition-all duration-300 whitespace-nowrap`}
          >
            Reserve<span className="hidden min-[450px]:inline"> Sanctuary</span>
          </a>
        </div>
      </header>

      {/* 2. ATMOSPHERE SECTION - FULL-SCREEN CINEMATIC HERO */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10" id="hero-atmosphere">
        
        {/* Looping Ambient Smoke Video Background */}
        <div className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none animate-fade-in" style={{ animationDuration: '3s' }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover opacity-35 scale-105 filter contrast-125 saturate-50 brightness-75 transition-all duration-700`}
            src="https://assets.mixkit.co/videos/preview/mixkit-smoke-flowing-in-the-dark-44186-large.mp4"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Soft Radial and Linear Gradient Overlays to completely blend the video */}
        <div className={`absolute inset-0 bg-radial-gradient from-transparent ${isDark ? 'via-[#0D0D0C]/40 to-[#0D0D0C]' : 'via-[#FAF9F5]/40 to-[#FAF9F5]'} pointer-events-none transition-all duration-700`} />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0D0D0C] via-transparent to-[#0D0D0C]/85' : 'from-[#FAF9F5] via-transparent to-[#FAF9F5]/85'} pointer-events-none transition-all duration-700`} />
        <div className={`absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t ${isDark ? 'from-[#0D0D0C]' : 'from-[#FAF9F5]'} to-transparent pointer-events-none transition-all duration-700`} />

        {/* Hero Content Layer with responsive content shield wrapper to completely prevent layout overflow and optically pull up design elements */}
        <div className="relative z-20 w-full animate-fade-in transform translate-y-3 sm:translate-y-6 md:translate-y-8">
          <div id="hero-content-shield-wrapper" className="relative max-w-xs sm:max-w-xl md:max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
            
            {/* Audio controller pill */}
            <button 
              onClick={toggleMute}
              className={`mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'border-stone-800/80 bg-stone-950/60 text-stone-400 hover:text-stone-100' : 'border-stone-200 bg-white/80 text-stone-600 hover:text-stone-900 shadow-sm'} text-[10px] uppercase tracking-widest transition-all`}
              title={isVideoMuted ? "Unmute background noise" : "Mute background noise"}
            >
              {isVideoMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
              <span>{isVideoMuted ? "Acoustic Silence" : "Atmospheric Waves"}</span>
            </button>

            {/* Balanced Epic Logo Title with elegant, responsive typography scale and refined tracing to prevent clipping or overflow on all screen sizes */}
            <h1 className={`text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.4em] lg:tracking-[0.45em] uppercase block text-center select-none mb-6 transition-colors duration-705 ${themeTextH1}`}>
              SERENITY
            </h1>

            <p className={`px-4 sm:px-0 max-w-xl sm:max-w-2xl mx-auto font-serif italic text-base sm:text-lg md:text-xl leading-relaxed font-light transition-colors duration-700 ${themeTextSubtitle}`}>
              A serene spa and wellness sanctuary designed to restore mind and body.
            </p>

            <div className={`mt-8 flex flex-wrap justify-center items-center gap-y-2 gap-x-3 text-[9px] uppercase tracking-[0.25em] font-mono max-w-xs sm:max-w-none mx-auto text-center transition-colors duration-700 ${themeTextSubtle}`}>
              <span>● Oasis Retreat</span>
              <span>● Healing Wellspring</span>
              <span>● Organic Botanicals</span>
            </div>

          </div>
        </div>

        {/* 3. ELEGANT VERTICAL SCROLL INDICATOR LINE AT BOTTOM - Hidden on mobile/tablet to avoid vertical overlaps */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-3 pointer-events-none select-none z-20">
          <span className={`text-[9px] uppercase tracking-[0.25em] transition-colors duration-700 ${themeTextSubtle}`}>Discover stillness</span>
          <div className="w-[1.2px] h-16 bg-gradient-to-b from-stone-500/50 to-transparent relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-[50%] ${isDark ? 'bg-[#E5E4E0]' : 'bg-stone-900'} animate-bounce`} style={{ animationDuration: '3.5s' }} />
          </div>
        </div>

      </section>

      {/* 4. SPATIAL FLOW SECTION - SPLIT 12-COLUMN RESPONSIVE LAYOUT GRID */}
      <section className={`relative py-28 md:py-36 px-6 md:px-12 max-w-7xl mx-auto z-20 border-b ${themeBorder}`} id="about">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column (5 Columns) - Minimalist Asymmetric Editorial Copy */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 block">Philosophy of Atmosphere</span>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] transition-colors duration-700 ${themeTextH1}`}>
                The Raw Architecture of <span className="italic font-normal text-stone-400">Stillness</span>
              </h2>
            </div>

            <div className={`text-sm leading-relaxed font-light space-y-6 transition-colors duration-700 ${isDark ? 'text-stone-400' : 'text-stone-700'}`}>
              <p className={`first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-2.5 first-letter:font-light font-sans ${isDark ? 'first-letter:text-[#E5E4E0] text-stone-300' : 'first-letter:text-stone-900 text-stone-800'}`}>
                To build sensory rest, we look entirely to raw elemental mediums. Our spaces are crafted using natural wood, refined stone, and organic textures, letting soft light filter through to create calming shadows that change softly with the passage of the sun.
              </p>
              
              <p className={`font-serif italic text-base border-l ${isDark ? 'border-stone-800 text-stone-205' : 'border-stone-300 text-stone-850'} pl-4 py-1 leading-relaxed`}>
                “True luxury is not defined by excess, but by the absolute exclusion of distraction. It is the weight of quietude.”
              </p>

              <p className="font-sans text-xs">
                Our spaces are designed to align with your natural circadian rhythm, helping to ease nervous system activity and gently guide you back to deep, traditional quietude.
              </p>
            </div>

            {/* Quick interactive feature tabs */}
            <div className="pt-2">
              <div className={`flex border-b ${isDark ? 'border-stone-900/80' : 'border-stone-200'} text-[10px] uppercase tracking-widest font-semibold text-stone-500 mb-4 gap-6`}>
                <button 
                  onClick={() => setActiveTab('philosophy')}
                  className={`pb-2.5 transition-all text-stone-400 relative ${activeTab === 'philosophy' ? (isDark ? 'text-white border-b border-stone-200' : 'text-stone-900 border-b border-stone-800') : 'hover:text-stone-500'}`}
                >
                  Thermal Heat
                </button>
                <button 
                  onClick={() => setActiveTab('provenance')}
                  className={`pb-2.5 transition-all text-stone-400 relative ${activeTab === 'provenance' ? (isDark ? 'text-white border-b border-stone-200' : 'text-stone-900 border-b border-stone-800') : 'hover:text-stone-500'}`}
                >
                  Circadian Cycle
                </button>
                <button 
                  onClick={() => setActiveTab('scent')}
                  className={`pb-2.5 transition-all text-stone-400 relative ${activeTab === 'scent' ? (isDark ? 'text-white border-b border-stone-200' : 'text-stone-900 border-b border-stone-800') : 'hover:text-stone-500'}`}
                >
                  Scent Profile
                </button>
              </div>

              <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-605'} font-light min-h-[48px] animate-fade-in`}>
                {activeTab === 'philosophy' && "3-Phase dry and moist heat chambers optimized within volcanic thermal springs. Calms neuro-tension instantly."}
                {activeTab === 'provenance' && "Soft-wavelength circadian lighting matching natural desert sunrises, noon solar caps, and cold navy dusk shades."}
                {activeTab === 'scent' && "Top Notes: Sandalwood essence. Heart: Crushed cedar and organic chamomile. Foundation: Warm dry vetiver extract."}
              </div>
            </div>
          </div>

          {/* Right Column (7 Columns) - Grayscale Image Container with Organic Rounded Corners */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <div className={`relative w-full max-w-xl aspect-[4/5] rounded-[4rem] rounded-tl-none overflow-hidden border ${isDark ? 'border-stone-800/80 bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950' : 'border-stone-200 bg-gradient-to-tr from-[#EBE9E2] via-[#F4F3EF] to-[#EBE9E2]'} group`}>
              
              {/* Grayscale Architectural Visual Grid Layer */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              
              {/* Premium Grayscale Custom Vector/Atmosphere Graphic */}
              <div className={`absolute inset-0 flex flex-col justify-between p-12 select-none ${isDark ? 'text-stone-500' : 'text-stone-700'}`}>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] tracking-widest uppercase">Schema No. 13 • Serenity Bath</span>
                  <Award size={14} className={`${isDark ? 'text-stone-600' : 'text-stone-400'} group-hover:text-stone-300 transition-colors`} />
                </div>
                
                {/* Central abstract minimalist gold/stone architectural geometric shape representing modern layout */}
                <div className="my-auto py-12 flex flex-col items-center text-center space-y-6">
                  <div className={`relative w-44 h-44 rounded-full border-2 ${isDark ? 'border-stone-800/80' : 'border-stone-300/80'} flex items-center justify-center p-4`}>
                    <div className={`w-full h-full rounded-full border ${isDark ? 'border-stone-700/50' : 'border-stone-200/50'} flex items-center justify-center animate-spin`} style={{ animationDuration: '30s' }}>
                      <div className={`w-1.5 h-1.5 ${isDark ? 'bg-stone-500' : 'bg-stone-700'} rounded-full absolute top-1`} />
                    </div>
                    {/* Inner core */}
                    <div className={`absolute w-24 h-24 rounded-full ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-[#FAF9F5] border-stone-200'} border flex items-center justify-center`}>
                      <span className={`font-serif italic text-2xl font-light ${isDark ? 'text-stone-350' : 'text-stone-900'}`}>Quiet</span>
                    </div>
                  </div>
                  <p className={`text-[10px] font-mono tracking-[0.2em] px-4 py-1.5 rounded-sm border inline-block ${isDark ? 'text-stone-400 bg-[#0D0D0C]/80 border-stone-900' : 'text-stone-600 bg-white/90 border-stone-200'}`}>
                    Circadian Wellness Core
                  </p>
                </div>

                <div className={`flex justify-between items-end border-t pt-6 ${isDark ? 'border-stone-900' : 'border-stone-200'}`}>
                  <div>
                    <span className="text-[9px] block uppercase tracking-wide text-stone-500">Sanctuary Hours</span>
                    <span className={`font-mono text-xs ${isDark ? 'text-stone-400' : 'text-stone-800'}`}>Open Daily • 8am – 9pm</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] block uppercase tracking-wide text-stone-500">Natural Aromas</span>
                    <span className={`font-mono text-xs ${isDark ? 'text-stone-400' : 'text-stone-800'}`}>Eucalyptus & Organic Oakwood</span>
                  </div>
                </div>
              </div>

              {/* Absolute hovering real texture details */}
              <div className="absolute inset-0 bg-stone-950/20 backdrop-brightness-75 group-hover:bg-transparent transition-all duration-700 pointer-events-none" />
              <div className={`absolute bottom-8 left-8 right-8 border p-6 rounded-2xl rounded-tl-none transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${isDark ? 'bg-[#0D0D0C]/95 border-stone-855' : 'bg-white/95 border-stone-200 shadow-lg'}`}>
                <span className="text-[8px] font-mono tracking-widest text-stone-500 block uppercase">Live Ambient Feed</span>
                <p className={`font-serif italic text-sm mt-1 ${isDark ? 'text-stone-200' : 'text-stone-850'}`}>Temperature-controlled basalt pools sitting at exactly 38.5°C.</p>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 5. INTEGRATED MODULES SECTION - HIGH-TOUCH TREATMENT MENU */}
      <section className="relative py-28 md:py-36 px-6 z-20 overflow-hidden" id="rituals">
        
        {/* Soft Background atmospheric shape */}
        <div className={`absolute bottom-10 -left-48 w-96 h-96 ${isDark ? 'bg-stone-900/10' : 'bg-stone-300/10'} rounded-full blur-3xl pointer-events-none`} />

        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full mb-2 border ${themeBadge}`}>
            <Sparkles size={11} className={isDark ? 'text-stone-450' : 'text-stone-600'} />
            <span className="text-[9px] uppercase font-sans tracking-[0.2em] font-medium">Circadian Healing Services</span>
          </div>
          
          <h2 className={`font-serif text-4xl md:text-5xl font-light tracking-wide transition-colors duration-700 ${themeTextH1}`}>
            The Treatment <span className="italic font-normal text-stone-400">Menu</span>
          </h2>
          
          <p className={`text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed transition-colors duration-700 ${themeTextSubtitle}`}>
            Expand the headers below to discover our deep physical restorative treatments, featuring seamless accordion transitions and fine dot-line styling. 
          </p>

          {/* Scent & Atmosphere Filter selection indicators */}
          <div className="flex flex-wrap justify-center gap-2 pt-6" id="ritual-filters">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase border transition-all ${
                selectedRitualFilter === 'all'
                  ? (isDark ? 'bg-[#E5E4E0] text-[#0D0D0C] border-stone-200 font-semibold' : 'bg-stone-900 text-white border-stone-800 font-semibold')
                  : (isDark ? 'bg-stone-950/50 text-stone-400 border-stone-900/80 hover:text-stone-200' : 'bg-white/60 text-stone-600 border-stone-200 hover:text-stone-900 shadow-sm')
              }`}
            >
              All Rituals
            </button>
            <button
              onClick={() => handleFilterChange('body')}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase border transition-all ${
                selectedRitualFilter === 'body'
                  ? (isDark ? 'bg-[#E5E4E0] text-[#0D0D0C] border-stone-200 font-semibold' : 'bg-stone-900 text-white border-stone-800 font-semibold')
                  : (isDark ? 'bg-stone-950/50 text-stone-400 border-stone-900/80 hover:text-stone-200' : 'bg-white/60 text-stone-600 border-stone-200 hover:text-stone-900 shadow-sm')
              }`}
            >
              Body Restorations
            </button>
            <button
              onClick={() => handleFilterChange('thermal')}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase border transition-all ${
                selectedRitualFilter === 'thermal'
                  ? (isDark ? 'bg-[#E5E4E0] text-[#0D0D0C] border-stone-200 font-semibold' : 'bg-stone-900 text-white border-stone-800 font-semibold')
                  : (isDark ? 'bg-stone-950/50 text-stone-400 border-stone-900/80 hover:text-stone-200' : 'bg-white/60 text-stone-600 border-stone-200 hover:text-stone-900 shadow-sm')
              }`}
            >
              Aqueous & Hydro
            </button>
            <button
              onClick={() => handleFilterChange('facial')}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase border transition-all ${
                selectedRitualFilter === 'facial'
                  ? (isDark ? 'bg-[#E5E4E0] text-[#0D0D0C] border-stone-200 font-semibold' : 'bg-stone-900 text-white border-stone-800 font-semibold')
                  : (isDark ? 'bg-stone-950/50 text-stone-400 border-stone-900/80 hover:text-stone-200' : 'bg-white/60 text-stone-600 border-stone-200 hover:text-stone-900 shadow-sm')
              }`}
            >
              Skin Medicine
            </button>
          </div>
        </div>

        {/* Outer Frame Wrapper for TreatmentMenu Component */}
        <div id="integrated-menu-block" className={`max-w-3xl mx-auto px-6 sm:px-12 py-8 rounded-xl relative transition-all duration-700 ${isDark ? 'bg-[#0D0D0C]/40 border border-stone-900' : 'bg-[#EBE9E2]/40 border border-stone-200 shadow-sm'}`}>
          
          {/* Subtle gold visual corner marks */}
          <div className={`absolute top-4 left-4 w-3 h-3 border-t border-l ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute top-4 right-4 w-3 h-3 border-t border-r ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute bottom-4 left-4 w-3 h-3 border-b border-l ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute bottom-4 right-4 w-3 h-3 border-b border-r ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />

          {/* Renders the pristine native-details SerenityMenu component mapped to custom filter states */}
          <TreatmentMenu categories={categories} />

          {/* Quick interactive sandbox helper widget block within the dark section with robust design separation */}
          <div className={`mt-8 pt-6 border-t ${isDark ? 'border-stone-900/80 text-stone-500' : 'border-stone-200/80 text-stone-600'} flex flex-col sm:flex-row justify-between items-center text-[10px] gap-6 w-full`}>
            <div className="flex items-center gap-1.5 min-w-0 text-center sm:text-left">
              <Clock size={12} className={`shrink-0 ${isDark ? 'text-stone-650' : 'text-stone-400'}`} /> 
              <span className="font-sans font-light tracking-wide leading-relaxed">
                All journeys begin with a cold-mint face wipe ritual.
              </span>
            </div>
            <button 
              onClick={() => {
                const demoCat = {
                  name: "Sound Therapy & Vibrational Alignment",
                  items: undefined
                };
                setCategories(prev => [...prev, demoCat]);
              }}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] font-medium transition-all duration-300 rounded-sm border ${isDark ? 'border-stone-800 text-stone-300 hover:text-white hover:border-stone-600 bg-stone-950/25' : 'border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 bg-stone-100/50'} focus:outline-none whitespace-nowrap cursor-pointer`}
            >
              + Add Sound Therapy Option
            </button>
          </div>

        </div>

      </section>

         {/* INTERACTIVE SANCTUARY BREATHING STATION FIELD (Dwell Time booster) */}
      <section className={`relative py-24 px-6 z-20 border-t border-b ${themeBorder}`} id="philosophy">
        <div className="max-w-4xl mx-auto">
          <BreathingSanctuary />
        </div>
      </section>

      {/* BOUTIQUE FAQ & GUIDELINES SECTION */}
      <section className={`relative py-28 md:py-36 px-6 z-20 border-b ${themeBorder}`} id="faq">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(27,26,24,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full mb-2 border ${themeBadge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-stone-600' : 'bg-stone-400'} animate-pulse`} />
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-mono">Sanctuary Etiquette</span>
          </div>
          
          <h2 className={`font-serif text-3xl md:text-5xl font-light tracking-wide select-none transition-colors duration-700 ${themeTextH1}`}>
            Essential <span className="italic font-normal text-stone-400 font-serif">Guidelines</span>
          </h2>
          
          <p className={`text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed transition-colors duration-700 ${isDark ? 'text-stone-400' : 'text-stone-650'}`}>
            Familiarizing yourself with our simple spa etiquette and timing ensures a seamless, deeply calming experience for all guests.
          </p>
        </div>

        {/* Accordions Matrix */}
        <div className={`max-w-3xl mx-auto space-y-4 px-6 sm:px-12 py-8 rounded-xl relative transition-all duration-700 ${isDark ? 'bg-[#0D0D0C]/45 border border-stone-900/60' : 'bg-[#EBE9E2]/40 border border-stone-200'}`}>
          
          {/* Topography aesthetic marks */}
          <div className={`absolute top-4 left-4 w-3.5 h-3.5 border-t border-l ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute top-4 right-4 w-3.5 h-3.5 border-t border-r ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />
          <div className={`absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r ${isDark ? 'border-stone-800' : 'border-stone-300'}`} />

          {/* Reservation Policies FAQ */}
          <details className={`group border-b pb-3 ${isDark ? 'border-stone-900' : 'border-stone-200'}`} id="faq-reservation">
            <summary className="list-none flex justify-between items-center py-5 cursor-pointer focus:outline-none select-none">
              <span className={`text-sm tracking-wide font-light transition-colors duration-300 ${isDark ? 'text-stone-300 hover:text-stone-150' : 'text-stone-800 hover:text-stone-950'}`}>
                What is the reservation cancellation & reschedule policy?
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-colors duration-300">
                <span className="absolute w-2.5 h-[1px] bg-current rounded-full transition-transform duration-300 group-open:rotate-180" />
                <span className="absolute w-[1px] h-2.5 bg-current rounded-full transition-all duration-300 origin-center group-open:scale-y-0 group-open:rotate-90" />
              </div>
            </summary>
            <div className={`pb-5 pt-1 px-1 text-xs leading-relaxed font-light animate-fade-in ${isDark ? 'text-stone-400' : 'text-stone-650'}`}>
              To preserve the deep silence and tailored experience of each sanctuary session, reservations must be canceled or rescheduled at least 72 hours prior to scheduled arrival. Cancellations made within the 72-hour window will forfeit the initial deposit of 50%.
            </div>
          </details>

          {/* Thermal Prep FAQ */}
          <details className={`group border-b pb-3 ${isDark ? 'border-stone-900' : 'border-stone-200'}`} id="faq-thermal">
            <summary className="list-none flex justify-between items-center py-5 cursor-pointer focus:outline-none select-none">
              <span className={`text-sm tracking-wide font-light transition-colors duration-300 ${isDark ? 'text-stone-300 hover:text-stone-150' : 'text-stone-800 hover:text-stone-950'}`}>
                Are there thermal preparation windows before treatments?
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-colors duration-300">
                <span className="absolute w-2.5 h-[1px] bg-current rounded-full transition-transform duration-300 group-open:rotate-180" />
                <span className="absolute w-[1px] h-2.5 bg-current rounded-full transition-all duration-300 origin-center group-open:scale-y-0 group-open:rotate-90" />
              </div>
            </summary>
            <div className={`pb-5 pt-1 px-1 text-xs leading-relaxed font-light animate-fade-in ${isDark ? 'text-stone-400' : 'text-stone-650'}`}>
              We highly recommend arriving exactly 45 minutes prior to your healing ritual treatment. This dedicated thermal window allows your vascular system to align and open in our temperature-controlled basalt pools and sage-infused dry sauna.
            </div>
          </details>

          {/* Couples & Customized Groups FAQ */}
          <details className="group pb-1" id="faq-couples">
            <summary className="list-none flex justify-between items-center py-5 cursor-pointer focus:outline-none select-none">
              <span className={`text-sm tracking-wide font-light transition-colors duration-300 ${isDark ? 'text-stone-300 hover:text-stone-150' : 'text-stone-800 hover:text-stone-950'}`}>
                Can you accommodate couples or customized group experiences?
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-colors duration-300">
                <span className="absolute w-2.5 h-[1px] bg-current rounded-full transition-transform duration-300 group-open:rotate-180" />
                <span className="absolute w-[1px] h-2.5 bg-current rounded-full transition-all duration-300 origin-center group-open:scale-y-0 group-open:rotate-90" />
              </div>
            </summary>
            <div className={`pb-5 pt-1 px-1 text-xs leading-relaxed font-light animate-fade-in ${isDark ? 'text-stone-400' : 'text-stone-650'}`}>
              Yes, our spacious treatment suites are designed to accommodate couples' rituals or side-by-side therapies. We also offer curated packages for private groups and corporate wellness retreats when arranged through our booking desk in advance.
            </div>
          </details>

        </div>
      </section>

      {/* 6. MAP CANVAS WRAPPER - CUSTOM DUX DUAL MAP CONTAINER */}
      <section className="relative py-28 md:py-36 px-6 max-w-7xl mx-auto z-20" id="location">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (5 columns) - Floating address label summary & booking card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 block">Our Sanctuary Location</span>
              <h2 className={`font-serif text-3xl sm:text-4xl font-light tracking-tight leading-normal ${themeTextH1}`}>
                How to Locate our <span className="italic font-normal text-stone-400">Spa Sanctuary</span>
              </h2>
            </div>

            <p className={`text-sm font-light leading-relaxed font-sans ${isDark ? 'text-stone-400' : 'text-stone-755'}`}>
              Fully immersed in the tranquil embrace of nature, our Sanctuary is thoughtfully positioned far from the noise of modern traffic. Surrounded by pristine local greenery and carefully preserved scenic paths, our secluded location offers absolute auditory and sensory clarity.
            </p>

            {/* floating editorial info card containing address details */}
            <div className={`border p-6 rounded-xl space-y-4 transition-all duration-700 shadow-xl ${isDark ? 'bg-[#0D0D0C]/80 border-stone-900/80 shadow-stone-950' : 'bg-[#EBE9E2]/50 border-stone-200 shadow-stone-200/20'}`}>
              <span className="text-[10px] uppercase tracking-widest text-[#7A7568] font-bold block">Sanctuary Address</span>
              
              <div className="space-y-1">
                <p className={`text-sm font-serif italic ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>120 Quiet Valley Road</p>
                <p className={`text-xs font-sans font-light ${isDark ? 'text-stone-450' : 'text-stone-650'}`}>Saint Helena • Napa Valley, CA 94574</p>
              </div>

              <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-stone-900/60' : 'border-stone-200'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs text-stone-500 gap-1 sm:gap-4">
                  <span className="font-sans font-light">Concierge Access:</span>
                  <span className={`font-mono font-light text-left sm:text-right ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>Dedicated Concierge Desk</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs text-stone-500 gap-1 sm:gap-4">
                  <span className="font-sans font-light">Private arrival access:</span>
                  <span className={`font-mono font-light text-left sm:text-right ${isDark ? 'text-stone-400' : 'text-stone-850'}`}>Secure Gated Intake Gate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 columns) - Monochrome Customized Mapbox Canvas integration */}
          <div className="lg:col-span-7">
            <div 
              id="mapbox-container" 
              className={`relative w-full aspect-video sm:aspect-[16/10] rounded-[3rem] rounded-tr-none overflow-hidden border shadow-2xl flex flex-col justify-between group transition-all duration-700 ${isDark ? 'border-stone-850 bg-stone-950' : 'border-stone-200 bg-[#EBE9E2]'}`}
            >
              
              {/* Mapbox grid line placeholder illustration representing high-end topography mapping */}
              <div className={`absolute inset-0 select-none opacity-20 pointer-events-none ${isDark ? 'bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#b5b1a5_1px,transparent_1px),linear-gradient(to_bottom,#b5b1a5_1px,transparent_1px)]'} [background-size:24px_24px]`} />
              
              {/* Absolute mock topography vector paths */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                <svg width="100%" height="100%" className={`stroke-current ${isDark ? 'text-stone-850' : 'text-stone-400'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer circle contours */}
                  <path d="M100 100 C 200 40, 400 300, 600 200 C 650 150, 700 80, 800 120" strokeWidth="0.8" strokeDasharray="3 3" />
                  <path d="M50 150 C 180 90, 380 340, 580 240 C 640 190, 680 120, 780 160" strokeWidth="1.2" />
                  <path d="M0 200 C 160 140, 360 380, 560 280 C 620 230, 660 160, 760 200" strokeWidth="0.8" strokeDasharray="4 4" />
                  
                  {/* Canyon river cut */}
                  <path d="M-100 350 Q 200 100, 350 250 T 900 100" strokeWidth="2.5" />
                  
                  {/* Target coordinates crosshair ring */}
                  <circle cx="350" cy="250" r="16" className={`${isDark ? 'text-[#E5E4E0] fill-stone-950' : 'text-stone-900 fill-[#FAF9F5]'} animate-pulse`} strokeWidth="1.5" />
                  <circle cx="350" cy="250" r="4" className={isDark ? 'fill-[#E5E4E0]' : 'fill-stone-900'} />
                </svg>
              </div>

              {/* Floating map location banner badge */}
              <div className={`relative p-6 flex justify-between items-start z-10 bg-gradient-to-b ${isDark ? 'from-[#0D0D0C]/90' : 'from-[#FAF9F5]/90'} to-transparent`}>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 block">Topographic Survey</span>
                  <h3 className={`font-serif italic mt-1 ${isDark ? 'text-stone-200' : 'text-stone-905'}`}>Satellite Valley View</h3>
                </div>
                <div className={`text-[9px] font-mono tracking-widest px-2 py-1 rounded border transition-colors ${isDark ? 'bg-stone-900/90 text-stone-300 border-stone-800' : 'bg-white/95 text-stone-700 border-stone-300 shadow-sm'}`}>
                  ZOOM: 12.5x
                </div>
              </div>

              {/* Map visual indicator tags */}
              <div className={`relative p-6 flex justify-between items-end z-10 bg-gradient-to-t ${isDark ? 'from-[#0D0D0C]/90' : 'from-[#FAF9F5]/90'} to-transparent`}>
                <div className={`flex items-center space-x-2 border px-3.5 py-1.5 rounded-full ${isDark ? 'bg-stone-950/90 border-stone-850' : 'bg-[#FAF9F5]/95 border-stone-250 shadow-sm'}`}>
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-ping" />
                  <span className={`font-mono text-[9px] tracking-widest uppercase font-semibold ${isDark ? 'text-[#E5E4E0]' : 'text-stone-900'}`}>Sanctuary Location</span>
                </div>
                
                <span className="text-[10px] font-mono text-stone-500">Serenity Wilderness Compass</span>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 7. REFINED EMAIL JOURNAL SIGNUP & LUXURY FOOTER */}
      <footer className={`relative border-t pt-24 pb-16 z-20 transition-all duration-700 ${isDark ? 'bg-[#070706] border-stone-900/70' : 'bg-stone-100 border-stone-200'}`}>
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 opacity-95">
          
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b items-center ${isDark ? 'border-stone-900/60' : 'border-stone-200'}`}>
            
            {/* Newsletter tagline */}
            <div className="md:col-span-6 space-y-4 text-center md:text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500 block">The Serenity Journal</span>
              <h3 className={`font-serif text-3xl font-light italic leading-tight transition-colors duration-700 ${themeTextH1}`}>
                Receive our quiet reflections and seasonal wellness guides.
              </h3>
              <p className={`text-xs font-sans font-light max-w-md mx-auto md:mx-0 leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-650'}`}>
                Stay connected with curated wellness wisdom, traditional self-care tips, and priority updates on new session availability.
              </p>
            </div>

            {/* Newsletter input card */}
            <div className="md:col-span-6 w-full max-w-md mx-auto md:mx-0" id="journal-signup-block">
              {subscribed ? (
                <div className={`p-6 border rounded-lg flex flex-col sm:flex-row items-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 text-xs tracking-wider animate-focus-in transition-colors ${isDark ? 'bg-[#0D0D0C]/80 border-stone-900 text-stone-200' : 'bg-white border-stone-200 text-stone-850 shadow-sm'}`}>
                  <Check size={16} className={isDark ? 'text-stone-300' : 'text-green-600'} />
                  <p>You are registered. Welcome to our wellness community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="email"
                    required
                    value={userNewsletterEmail}
                    onChange={(e) => setUserNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`flex-1 px-4 py-3 rounded-sm text-sm font-light transition-all focus:outline-none ${isDark ? 'bg-stone-950 border-stone-900 text-[#E5E4E0] focus:border-stone-700 placeholder:text-stone-600' : 'bg-white border-stone-250 text-stone-900 focus:border-stone-400 placeholder:text-stone-400'}`}
                  />
                  <button
                    type="submit"
                    className={`text-[10px] uppercase font-semibold tracking-widest px-6 py-3 transition-colors rounded-sm ${isDark ? 'bg-[#E5E4E0] hover:bg-white text-stone-950' : 'bg-stone-900 hover:bg-stone-850 text-white shadow-sm'}`}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Base links and global copyrights */}
          <div className="pt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-6">
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span className="font-mono text-[9px] text-[#7A7568]">SERENITY © 2026</span>
              <span>/</span>
              <span className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer" onClick={() => alert("Privacy policy details are held in absolute confidence.")}>Privacy Policy</span>
              <span>/</span>
              <span className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer" onClick={() => alert("Sanctuary terms apply to all seasonal bookings and reservations.")}>Terms of Sanctuary</span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] tracking-wide font-light text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500/55" />
              <span>Architectural Blueprint No. 13</span>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}
