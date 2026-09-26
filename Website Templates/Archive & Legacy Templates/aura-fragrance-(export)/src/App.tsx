/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SIGNATURE_FRAGRANCES } from './data';
import { ScentProfile } from './components/ScentProfile';
import { FragranceProduct, NoteItem } from './types';
import { Compass, Sparkles, Sliders, Play, Trash2, Plus, ArrowRight, Eye, RefreshCw } from 'lucide-react';

export default function App() {
  // Active selected pre-made signature perfume
  const [selectedProductId, setSelectedProductId] = useState<string>('santalum-vetiver');
  
  // Custom perfume form states for the "Aura Lab"
  const [isLabMode, setIsLabMode] = useState<boolean>(false);
  const [customPerfumeName, setCustomPerfumeName] = useState<string>('Lapis Lazuli');
  const [customTagline, setCustomTagline] = useState<string>('A deep cobalt blue, dust-born sea draft.');
  const [customStory, setCustomStory] = useState<string>('An imaginative composition based on synesthesic cold blues and warm ores. Built as an architectural fragrance exercise.');
  const [customCharacter, setCustomCharacter] = useState<string>('Mineral, Ozonic, Cold Metallic');
  const [customIntensity, setCustomIntensity] = useState<number>(3);
  const [customVesselImage, setCustomVesselImage] = useState<string>('https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200');
  const [showLabSchematic, setShowLabSchematic] = useState<boolean>(false);

  // Initial standard custom notes
  const [customTopNotes, setCustomTopNotes] = useState<NoteItem[]>([
    { name: 'Ozone Accord', origin: 'Synthesized', description: 'Blustery, fresh rain, cold air blowing over slate stones.' },
    { name: 'Crushed Mint Leaf', origin: 'Morocco', description: 'Super-iced bitter herbal mint offering instantaneous cold green.' }
  ]);
  const [customHeartNotes, setCustomHeartNotes] = useState<NoteItem[]>([
    { name: 'Sea Salt Crust', origin: 'Brittany, France', description: 'Crystalline, mineral marine salt that grounds sweet aspects.' },
    { name: 'Blue Lotus Absolute', origin: 'Thailand', description: 'Watery, pristine, ethereal sacred floral absolute.' }
  ]);
  const [customBaseNotes, setCustomBaseNotes] = useState<NoteItem[]>([
    { name: 'Wet Granite Shards', origin: 'Scotland', description: 'A wet-stone mineral foundation evoking rain-dappled masonry.' },
    { name: 'Frankincense Tears', origin: 'Oman', description: 'Cold, slow-burning sacred resin that anchors the mineral sillage.' }
  ]);

  // Temp form fields to add notes
  const [tempNoteName, setTempNoteName] = useState<string>('');
  const [tempNoteOrigin, setTempNoteOrigin] = useState<string>('');
  const [tempNoteDesc, setTempNoteDesc] = useState<string>('');
  const [tempNoteTier, setTempNoteTier] = useState<'top' | 'heart' | 'base'>('top');

  // Find active pre-made perfume
  const activeProduct = SIGNATURE_FRAGRANCES.find(p => p.id === selectedProductId) || SIGNATURE_FRAGRANCES[0];

  // Render variables depending on whether we are viewing a curated product or custom lab product
  const currentProductName = isLabMode ? customPerfumeName : activeProduct.name;
  const currentProductTagline = isLabMode ? customTagline : activeProduct.tagline;
  const currentProductStory = isLabMode ? customStory : activeProduct.story;
  const currentProductCharacter = isLabMode ? customCharacter : activeProduct.character;
  const currentProductIntensity = isLabMode ? customIntensity : activeProduct.intensity;
  const currentProductNotes = isLabMode ? {
    top: customTopNotes,
    heart: customHeartNotes,
    base: customBaseNotes
  } : activeProduct.notes;
  const currentProductImageUrl = isLabMode ? customVesselImage.replace('w=1200', 'w=600') : activeProduct.imageUrl;
  const currentProductHeroImage = isLabMode ? customVesselImage : activeProduct.heroImage;

  // Handler to add custom note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempNoteName.trim()) return;

    const newNote: NoteItem = {
      name: tempNoteName.trim(),
      origin: tempNoteOrigin.trim() || undefined,
      description: tempNoteDesc.trim() || undefined
    };

    if (tempNoteTier === 'top') {
      setCustomTopNotes([...customTopNotes, newNote]);
    } else if (tempNoteTier === 'heart') {
      setCustomHeartNotes([...customHeartNotes, newNote]);
    } else {
      setCustomBaseNotes([...customBaseNotes, newNote]);
    }

    // Reset temp inputs
    setTempNoteName('');
    setTempNoteOrigin('');
    setTempNoteDesc('');
  };

  // Handler to remove a custom note
  const handleRemoveNote = (tier: 'top' | 'heart' | 'base', index: number) => {
    if (tier === 'top') {
      setCustomTopNotes(customTopNotes.filter((_, i) => i !== index));
    } else if (tier === 'heart') {
      setCustomHeartNotes(customHeartNotes.filter((_, i) => i !== index));
    } else {
      setCustomBaseNotes(customBaseNotes.filter((_, i) => i !== index));
    }
  };

  // Preset custom blends
  const loadPresetCustom = (presetName: string) => {
    if (presetName === 'volcanic') {
      setCustomPerfumeName('Obsidian Suede');
      setCustomTagline('The warm smoke of lava cooled by mountain ash.');
      setCustomStory('A highly contrasting composition inspired by black volcanic soils. It juxtaposes scorched birch tar and mineral charcoal with dry rose and cold, crisp alpine air.');
      setCustomCharacter('Smoky, Balsamic, Volcanic');
      setCustomIntensity(5);
      setCustomVesselImage('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200');
      setCustomTopNotes([
        { name: 'Mountain Ash', origin: 'Switzerland', description: 'Crisp, cold green leaf aroma with stone-fruit and lichen undertones.' },
        { name: 'White Grapefruit', origin: 'Florida, USA', description: 'Sharp, pulpy bitterness that sparkles like hot magma cooling down.' }
      ]);
      setCustomHeartNotes([
        { name: 'Damask Rose Absolute', origin: 'Bulgaria', description: 'Velvety, wine-dark, dense floral sweetness that acts as a heart furnace.' },
        { name: 'Mineral Charcoal', origin: 'Artisanal Accord', description: 'Dry, dusty carbonaceous character with clean ash facets.' }
      ]);
      setCustomBaseNotes([
        { name: 'Scorched Birch Tar', origin: 'Finland', description: 'Intensely leather-like, pitch-smoky, resinous wood base.' },
        { name: 'White Suede', origin: 'Cruelty-Free Accord', description: 'Supple, comforting leather undertone creating soft, clean sillage.' }
      ]);
    } else if (presetName === 'forest') {
      setCustomPerfumeName('Möss & Tall');
      setCustomTagline('Lichen-coated pine boughs in subzero silence.');
      setCustomStory('Moss and Pine captures the deep stillness of primeval Scandinavian forests. A pine needle and cold metal accord dissolves into thick, green oakmoss and ancient tree resins.');
      setCustomCharacter('Coniferous, Earthy, Subzero');
      setCustomIntensity(4);
      setCustomVesselImage('https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200');
      setCustomTopNotes([
        { name: 'Siberian Pine Needles', origin: 'Russia', description: 'Piercingly fresh woody-camphorous pine sap scent.' },
        { name: 'Frozen Aldehydes', origin: 'Synthesized', description: 'Synthetic sparkling starch notes that simulate heavy arctic frost.' }
      ]);
      setCustomHeartNotes([
        { name: 'Juniper Berries', origin: 'Hungary', description: 'Gin-dry, spicy, piney berry flavor with herbal sweetness.' },
        { name: 'Galbanum Resin', origin: 'Iran', description: 'Violently green, bitter herbal resin evoking bruised leaves and damp shadows.' }
      ]);
      setCustomBaseNotes([
        { name: 'High-Altitude Oakmoss', origin: 'Macedonia', description: 'Rich, ink-damped mossy earth scent with leather-tobacco facets.' },
        { name: 'Fossilized Amber', origin: 'India', description: 'Thick, sweet, dry fossilized pine sap that secures 12-hour longevity.' }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#29241E] font-sans selection:bg-[#A2947F]/20 select-none pb-24">
      
      {/* BRAND HEADER */}
      <header className="sticky top-0 bg-[#FAF9F6]/85 backdrop-blur-md z-40 border-b border-stone-200/40 py-5 px-6 md:px-12 flex justify-between items-center">
        <a 
          href="/"
          aria-label="Aura Home"
          className="group flex flex-col p-2 -m-2 transition-all duration-500 focus:outline-none focus:ring-1 focus:ring-stone-400 select-none"
        >
          <h1 className="font-serif text-2xl tracking-[0.35em] font-light text-stone-900 group-hover:text-stone-600 transition-colors duration-500 uppercase">
            A U R A
          </h1>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-stone-400 group-hover:text-stone-550 transition-colors duration-500 mt-1">
            Fine Scent & Architecture
          </span>
        </a>

        {/* Navigation & Mode Toggle */}
        <nav className="flex items-center gap-6" aria-label="Main Navigation">
          <button
            onClick={() => setIsLabMode(false)}
            className={`font-sans text-[11px] uppercase tracking-[0.16em] transition-colors focus:outline-none ${
              !isLabMode ? 'text-stone-900 font-medium border-b border-stone-850 pb-0.5' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Signature House
          </button>
          
          <button
            onClick={() => setIsLabMode(true)}
            className={`flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.16em] transition-colors focus:outline-none ${
              isLabMode ? 'text-stone-900 font-medium border-b border-stone-850 pb-0.5' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Sliders size={12} className="text-stone-500" />
            <span>Perfumer’s Lab</span>
          </button>
        </nav>
      </header>

      {/* CORE DISPLAY STAGE */}
      <main className="max-w-6xl mx-auto px-6 mt-12">
        
        {/* EDITORIAL HERO */}
        <section className="mb-16 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200/50 rounded-full py-1.5 px-3 border border-stone-200/30 text-stone-600 transition-colors">
              <span className="inline-block w-1.5 h-1.5 bg-stone-500 rounded-full animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-wider">
                {isLabMode ? 'Aura Labs: Custom Formulation' : 'Curated Volatiles Exhibition'}
              </span>
            </div>
            
            <h3 className="font-serif text-4xl md:text-6xl font-light text-stone-900 leading-[1.1] tracking-tight">
              {currentProductName}
            </h3>
            
            <p className="font-serif italic text-xl md:text-2xl text-stone-500 font-light leading-relaxed">
              "{currentProductTagline}"
            </p>

            <div className="h-[1px] w-24 bg-stone-300" aria-hidden="true" />

            <p className="text-stone-600 text-sm md:text-base leading-relaxed tracking-normal font-light max-w-xl">
              {currentProductStory}
            </p>

            {/* Micro Specs Panel */}
            <div className="grid grid-cols-2 gap-4 max-w-sm pt-4 border-t border-stone-200/50">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wide text-stone-400 block mb-1">
                  Olfactory Character
                </span>
                <span className="text-stone-800 text-xs md:text-sm font-medium">
                  {currentProductCharacter}
                </span>
              </div>
              
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wide text-stone-400 block mb-1">
                  Sillage Intensity
                </span>
                <div className="flex gap-1 items-center mt-1" aria-label={`Sillage intensity: ${currentProductIntensity} out of 5`}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level} 
                      className={`h-2 w-4 border border-stone-300 ${
                        level <= currentProductIntensity ? 'bg-stone-800 border-stone-800' : 'bg-transparent'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real Minimalist Luxury Image Showcase instead of empty blocks */}
          <div className="relative h-[280px] md:h-[420px] overflow-hidden group/hero shadow-xs border border-stone-200 bg-[#FAF9F6]">
            {currentProductHeroImage && !showLabSchematic ? (
              <div className="w-full h-full relative">
                {/* The premium imagery */}
                <img 
                  src={currentProductHeroImage} 
                  alt={currentProductName} 
                  className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover/hero:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro Blueprint Overlay */}
                <div className="absolute inset-0 bg-stone-900/10 group-hover/hero:bg-stone-900/5 transition-all duration-700 pointer-events-none" />
                <div className="absolute inset-4 border border-white/20 pointer-events-none" />
                
                {/* Interactive floating label */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 border border-stone-200/40 flex justify-between items-center transition-all duration-550 transform translate-y-0 group-hover/hero:-translate-y-1 shadow-sm">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400 block mb-0.5">
                      ACTIVE EXHIBIT
                    </span>
                    <h4 className="font-serif text-lg font-light text-stone-900">
                      {currentProductName}
                    </h4>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500 border-b border-stone-300 pb-0.5">
                    {currentProductCharacter.split(',')[0]}
                  </span>
                </div>

                {isLabMode && (
                  <button
                    type="button"
                    onClick={() => setShowLabSchematic(true)}
                    className="absolute top-4 right-4 z-20 bg-stone-900/95 text-white border border-stone-800 px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.15em] hover:bg-stone-800 transition-all shadow-md focus:outline-none"
                  >
                    Schematic View
                  </button>
                )}
              </div>
            ) : (
              /* Fallback/Lab blueprint frame */
              <div className="relative w-full h-full bg-stone-200/30 p-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-stone-100/40 mix-blend-overlay backdrop-blur-[0.5px]" />
                <div className="relative z-10 w-full h-full border border-dashed border-stone-300/80 p-6 flex flex-col justify-between" aria-hidden="true">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] tracking-widest text-stone-400">
                      FIG 01 // TEXTURE & SPACE
                    </span>
                    <span className="font-mono text-[9px] text-stone-400">
                      EST. 2026
                    </span>
                  </div>

                  {/* Minimalist perfume graphic */}
                  <div className="my-auto flex flex-col items-center">
                    <div className="w-24 h-40 border border-stone-800/80 bg-white/70 backdrop-blur-sm shadow-sm flex flex-col items-center py-4 justify-between relative group hover:shadow-md transition-shadow duration-500">
                      <div className="w-6 h-6 border-b border-stone-800 bg-stone-100 flex items-center justify-center -mt-8 relative z-20">
                        <span className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
                      </div>
                      
                      {/* Fluid liquid level inside */}
                      <div className="absolute bottom-0 inset-x-0 bg-stone-200/30 border-t border-stone-300 h-[65%] origin-bottom transition-all duration-[1000ms]" />
                      
                      <div className="text-center z-10 px-2">
                        <span className="font-serif text-[10px] uppercase font-light tracking-[0.2em] text-stone-800 block">
                          AURA
                        </span>
                        <span className="font-mono text-[7px] text-stone-400 uppercase tracking-widest block mt-1">
                          {isLabMode ? 'CUSTOM LAB' : activeProduct.name.split(' ')[0]}
                        </span>
                      </div>

                      <span className="font-mono text-[7px] text-stone-400 z-10 tracking-widest uppercase">
                        50 ML // 1.7 FL.OZ
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[8px] text-stone-400">
                      FORMULATION CODES INCLUDED
                    </span>
                    <span className="font-serif italic text-xs text-stone-400">
                      Zen Minimalist Architecture
                    </span>
                  </div>
                </div>

                {isLabMode && (
                  <button
                    type="button"
                    onClick={() => setShowLabSchematic(false)}
                    className="absolute top-4 right-4 z-20 bg-stone-900/95 text-white border border-stone-800 px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.15em] hover:bg-stone-800 transition-all shadow-md focus:outline-none"
                  >
                    Photo View
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* NOTIFICATION BOX (GENTLE ONBOARDING) */}
        {!isLabMode && (
          <div className="mb-12 bg-stone-100 p-6 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-serif italic text-stone-800 text-sm md:text-base">
                "We design formulas where spaces between notes breathe as deeply as the note themselves."
              </p>
              <span className="font-mono text-[9px] text-stone-500 block mt-1 uppercase tracking-wider">
                — Aurelius Scent Atelier Workshop
              </span>
            </div>
            
            <button
              onClick={() => setIsLabMode(true)}
              className="inline-flex items-center gap-1 bg-stone-900 text-white hover:bg-stone-850 px-4 py-2 text-[10px] uppercase tracking-wider font-mono focus:ring-1 focus:ring-stone-400"
            >
              <Sliders size={12} />
              <span>Experiment In Lab</span>
            </button>
          </div>
        )}

        {/* SIGNATURE SELECTION CARDS (HOUSE MODE ONLY) - THE TACTILE GHOST GRID */}
        {!isLabMode && (
          <section className="mb-24" aria-label="Signature Curated Scents">
            <header className="mb-10 text-center md:text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-450 block mb-2">
                Curated Collections
              </span>
              <h4 className="font-serif text-3xl font-light text-stone-900 tracking-tight">
                The House Catalogue
              </h4>
              <p className="text-stone-500 text-xs mt-1 font-light">
                A borderless ghost grid where physical textures and information blend seamlessly upon contact.
              </p>
            </header>

            {/* Ghost Grid: Entirely borderless container, separating list items purely by spatial alignment & negative space */}
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {SIGNATURE_FRAGRANCES.map((prod) => {
                const isActive = prod.id === selectedProductId;
                return (
                  <li key={prod.id} className="relative group overflow-hidden">
                    
                    {/* The Touch/Click Segment */}
                    <button
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="w-full text-left p-10 bg-transparent flex flex-col justify-between aspect-square relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-400 select-none overflow-hidden transition-all duration-700 hover:bg-stone-100/30"
                    >
                      {/* Frosted Glass + Heavy Textured Paper Overlay: Recreated using Soft-Focus and Split-Blend styling */}
                      <div className="absolute inset-0 bg-stone-50/50 backdrop-blur-[1px] opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      {/* Real Minimalist Product Photography back-bleed */}
                      {prod.imageUrl && (
                        <div className="absolute inset-0 z-0 opacity-[0.35] group-hover:opacity-[0.82] transition-opacity duration-1000 transform scale-100 group-hover:scale-[1.03] pointer-events-none">
                          <img 
                            src={prod.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover transition-all duration-[1200ms]" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-[#FAF9F6]/10 mix-blend-color" />
                        </div>
                      )}
                      
                      {/* Tactile SVG Noise layer (Separated and set to multiply or overlay for organic texture) */}
                      <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-multiply pointer-events-none" />
                      
                      {/* Inner delicate white glow frame for subtle frosted highlight */}
                      <div className="absolute inset-4 border border-white/0 group-hover:border-white/50 transition-all duration-700 pointer-events-none" />

                      {/* Header Section: Always visible but brightens up on context change */}
                      <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="flex justify-between items-baseline mb-4">
                          <span className="font-mono text-[8px] text-stone-400 tracking-widest uppercase">
                            NO. {prod.id.slice(0, 3).toUpperCase()}
                          </span>
                          
                          {/* Scent intensity indicator mapped to precise dots */}
                          <div className="flex gap-1 items-center" aria-label={`Scent weight: ${prod.intensity}`}>
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                                  i < prod.intensity 
                                    ? 'bg-stone-800' 
                                    : 'bg-stone-200'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        {isActive && (
                          <span className="font-mono text-[8px] bg-stone-900 text-white px-2 py-0.5 uppercase tracking-[0.15em] mb-4 inline-block font-light">
                            Currently Viewing
                          </span>
                        )}

                        <h5 className="font-serif text-3xl font-light text-stone-900 group-hover:text-stone-950 transition-colors duration-500 leading-tight">
                          {prod.name}
                        </h5>
                        <p className="font-serif italic text-sm text-stone-500 tracking-normal mt-2 transition-all duration-500 group-hover:text-stone-750">
                          {prod.tagline}
                        </p>
                      </div>

                      {/* Ghost Metadata: Seamlessly slides & transitions into view from structural void on hover */}
                      <div className="relative z-10 border-t border-stone-200/50 pt-5 mt-6 w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        
                        <div className="mb-4">
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
                            Olfactory Path
                          </span>
                          <span className="text-[12px] text-stone-600 block leading-snug">
                            {prod.character}
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-stone-400 block mb-1">
                              Acquisition
                            </span>
                            <span className="font-serif italic text-base text-stone-900">
                              $185.00
                            </span>
                            <span className="font-mono text-[9px] text-stone-400 ml-1.5 uppercase tracking-wide">
                              (50ML)
                            </span>
                          </div>

                          <span className="inline-flex items-center gap-1 font-mono text-[9px] text-stone-800 uppercase tracking-widest hover:underline">
                            <span>Scent Profile</span>
                            <ArrowRight size={10} className="transform group-hover:translate-x-1.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* CUSTOM LAB BOARD (LAB MODE ONLY) */}
        {isLabMode && (
          <section className="mb-16 border border-stone-200 bg-stone-50 p-6 md:p-10" aria-label="Perfumer's Formulation Dashboard">
            <header className="border-b border-stone-200 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-serif text-2xl font-light text-stone-950">
                  Custom Formulation Desk
                </h4>
                <p className="text-stone-500 text-xs mt-1">
                  Re-engineer the molecular weight. Populate custom ingredients to update the active Scent Profile dynamically.
                </p>
              </div>

              {/* Lab presets */}
              <div className="flex gap-2 items-center">
                <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest">
                  Quick Blends:
                </span>
                
                <button
                  type="button"
                  onClick={() => loadPresetCustom('volcanic')}
                  className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono border border-stone-300 hover:border-black bg-white focus:ring-1 focus:ring-stone-400"
                >
                  Obsidian Smoke
                </button>
                
                <button
                  type="button"
                  onClick={() => loadPresetCustom('forest')}
                  className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono border border-stone-300 hover:border-black bg-white focus:ring-1 focus:ring-stone-400"
                >
                  Arctic Pine
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form details */}
              <form onSubmit={handleAddNote} className="lg:col-span-5 bg-white p-6 border border-stone-200 space-y-4">
                <header className="border-b border-stone-100 pb-3 mb-2">
                  <h5 className="font-mono text-[10.5px] uppercase tracking-wider text-stone-800 font-bold block">
                    1. Formula Credentials
                  </h5>
                </header>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="pname" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                      Fragrance Title
                    </label>
                    <input 
                      id="pname"
                      type="text" 
                      value={customPerfumeName}
                      onChange={(e) => setCustomPerfumeName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500 font-serif"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ptag" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                      Poetic Tagline
                    </label>
                    <input 
                      id="ptag"
                      type="text" 
                      value={customTagline}
                      onChange={(e) => setCustomTagline(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500 italic"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pimage" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                      Vessel Aesthetic (Vial Imagery Study)
                    </label>
                    <select
                      id="pimage"
                      value={customVesselImage}
                      onChange={(e) => {
                        setCustomVesselImage(e.target.value);
                        setShowLabSchematic(false);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 py-1.5 px-2 text-xs focus:outline-none focus:border-stone-500 font-mono text-[11px]"
                    >
                      <option value="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200">
                        Clear Oak Sandstone (Monolith Study)
                      </option>
                      <option value="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200">
                        Obsidian & Smoked Iron (Dark Suede Study)
                      </option>
                      <option value="https://images.unsplash.com/photo-1588405748373-122b25c07990?auto=format&fit=crop&q=80&w=1200">
                        Prism Crystal & Alabaster (Pristine Study)
                      </option>
                      <option value="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=1200">
                        Citrus Branch & Sunlit Gold (Amber Study)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="pchar" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                        Character Category
                      </label>
                      <input 
                        id="pchar"
                        type="text" 
                        value={customCharacter}
                        onChange={(e) => setCustomCharacter(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="pint" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                        Intensity (1-5)
                      </label>
                      <select 
                        id="pint"
                        value={customIntensity}
                        onChange={(e) => setCustomIntensity(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 py-1.5 px-2 text-xs focus:outline-none focus:border-stone-500"
                      >
                        <option value={1}>1 - Soft Whisper</option>
                        <option value={2}>2 - Gentle Draft</option>
                        <option value={3}>3 - Present</option>
                        <option value={4}>4 - Bold</option>
                        <option value={5}>5 - Extraordinary</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pstory" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                      Perfume House Backstory
                    </label>
                    <textarea 
                      id="pstory"
                      rows={2}
                      value={customStory}
                      onChange={(e) => setCustomStory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500 resize-none font-light leading-relaxed"
                      required
                    />
                  </div>
                </div>

                <header className="border-b border-stone-100 pb-3 pt-4 mb-2">
                  <h5 className="font-mono text-[10.5px] uppercase tracking-wider text-stone-800 font-bold block">
                    2. Add Ingredient Note
                  </h5>
                </header>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="notetarget" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                        Placement Tier
                      </label>
                      <select 
                        id="notetarget"
                        value={tempNoteTier}
                        onChange={(e) => setTempNoteTier(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-200 py-1.5 px-2 text-xs focus:outline-none focus:border-stone-500"
                      >
                        <option value="top">Top (Head)</option>
                        <option value="heart">Heart (Core)</option>
                        <option value="base">Base (Anchor)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="notename" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                        Ingredient Name
                      </label>
                      <input 
                        id="notename"
                        type="text" 
                        placeholder="e.g. Damascus Rose"
                        value={tempNoteName}
                        onChange={(e) => setTempNoteName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label htmlFor="noteorig" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                        Botanical / Chemical Origin
                      </label>
                      <input 
                        id="noteorig"
                        type="text" 
                        placeholder="e.g. Grasse, France (Optional)"
                        value={tempNoteOrigin}
                        onChange={(e) => setTempNoteOrigin(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notedesc" className="font-mono text-[9px] uppercase tracking-wider text-stone-500 block mb-1">
                      Aromatic Description
                    </label>
                    <input 
                      id="notedesc"
                      type="text" 
                      placeholder="e.g. Syrupy warm bloom with earthy facets (Optional)"
                      value={tempNoteDesc}
                      onChange={(e) => setTempNoteDesc(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 py-1.5 px-3 text-xs focus:outline-none focus:border-stone-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!tempNoteName.trim()}
                    className={`w-full py-2.5 font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                      tempNoteName.trim() 
                        ? 'bg-stone-900 border-stone-900 text-white hover:bg-stone-850 cursor-pointer' 
                        : 'bg-stone-150 border-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={14} />
                    <span>Inject Into Pyramid</span>
                  </button>
                </div>
              </form>

              {/* Form output / interactive pyramid list to inspect and delete components */}
              <div className="lg:col-span-7 bg-white p-6 border border-stone-200 space-y-6">
                <header className="border-b border-stone-100 pb-3">
                  <h5 className="font-mono text-[11px] uppercase tracking-wider text-stone-800 font-bold block">
                    Active Formulation Ingredients
                  </h5>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Delete or inspect active components prior to rendering.
                  </span>
                </header>

                <div className="space-y-4">
                  {/* Top Note list */}
                  <div>
                    <div className="flex justify-between items-center bg-stone-50 px-3 py-1.5 border-l-2 border-stone-300">
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-stone-600 font-bold">
                        Top Notes ({customTopNotes.length})
                      </span>
                      <span className="font-mono text-[8px] text-stone-400">Notes de Tête</span>
                    </div>
                    {customTopNotes.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic p-3 text-center border border-dashed border-stone-100">
                        No top notes added. Scent profile will miss high-volatility impressions.
                      </p>
                    ) : (
                      <ul className="divide-y divide-stone-100 border-x border-b border-stone-100">
                        {customTopNotes.map((note, idx) => (
                          <li key={idx} className="flex justify-between items-center p-3 hover:bg-stone-50 transition-colors">
                            <div>
                              <strong className="text-xs text-stone-800">{note.name}</strong>
                              {note.origin && <span className="font-mono text-[9px] text-stone-400 ml-2 italic">({note.origin})</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveNote('top', idx)}
                              className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Heart Note list */}
                  <div>
                    <div className="flex justify-between items-center bg-stone-50 px-3 py-1.5 border-l-2 border-stone-400">
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-stone-600 font-bold">
                        Heart Notes ({customHeartNotes.length})
                      </span>
                      <span className="font-mono text-[8px] text-stone-400">Notes de Cœur</span>
                    </div>
                    {customHeartNotes.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic p-3 text-center border border-dashed border-stone-100">
                        No heart notes added. Formulation lacks definition and body.
                      </p>
                    ) : (
                      <ul className="divide-y divide-stone-100 border-x border-b border-stone-100">
                        {customHeartNotes.map((note, idx) => (
                          <li key={idx} className="flex justify-between items-center p-3 hover:bg-stone-50 transition-colors">
                            <div>
                              <strong className="text-xs text-stone-800">{note.name}</strong>
                              {note.origin && <span className="font-mono text-[9px] text-stone-400 ml-2 italic">({note.origin})</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveNote('heart', idx)}
                              className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Base Note list */}
                  <div>
                    <div className="flex justify-between items-center bg-stone-50 px-3 py-1.5 border-l-2 border-stone-500">
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-stone-600 font-bold">
                        Base Notes ({customBaseNotes.length})
                      </span>
                      <span className="font-mono text-[8px] text-stone-400">Notes de Fond</span>
                    </div>
                    {customBaseNotes.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic p-3 text-center border border-dashed border-stone-100">
                        No base notes added. Scent profile will evaporate instantly with zero skin retention.
                      </p>
                    ) : (
                      <ul className="divide-y divide-stone-100 border-x border-b border-stone-100">
                        {customBaseNotes.map((note, idx) => (
                          <li key={idx} className="flex justify-between items-center p-3 hover:bg-stone-50 transition-colors">
                            <div>
                              <strong className="text-xs text-stone-800">{note.name}</strong>
                              {note.origin && <span className="font-mono text-[9px] text-stone-400 ml-2 italic">({note.origin})</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveNote('base', idx)}
                              className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50 p-4 border border-stone-200 flex justify-between items-center mt-6">
                  <span className="font-mono text-[10px] text-stone-500">
                    ScentProfile is bound reactively below. Look at the changes in real-time.
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPerfumeName('Ethereal Dew');
                      setCustomTagline('A vapor of freshly crushed pine needles and morning lake mist.');
                      setCustomStory('A cool botanical study featuring highly reactive, cold minerals alongside dry high-altitude cedar.');
                      setCustomCharacter('Green, Cold Ozonic, Mineral');
                      setCustomIntensity(2);
                      setCustomTopNotes([
                        { name: 'Crushed Pine Needle', origin: 'Norway', description: 'Piercing green vapor with high volatile count.' }
                      ]);
                      setCustomHeartNotes([
                        { name: 'Spearmint Co2 extract', origin: 'Oregon, USA', description: 'Slightly sweet, chilled mint.' }
                      ]);
                      setCustomBaseNotes([
                        { name: 'Atlas Cedar Absolute', origin: 'Morocco', description: 'Dry wood chips holding a cold forest humidity.' }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 bg-white border border-stone-300 hover:border-black text-stone-700 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider"
                  >
                    <RefreshCw size={11} className="animate-spin-slow" />
                    Reset to Ethereal Preset
                  </button>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* CORE SCENT_PROFILE COMPONENT INTEGRATION */}
        <div className="relative border border-stone-300/40 p-1 bg-white shadow-sm">
          <div className="absolute top-2 right-4 text-[9px] font-mono text-stone-400 uppercase tracking-widest hidden md:block" aria-hidden="true">
            Render Mode: Production Ready Web Custom Profile Component
          </div>
          
          <ScentProfile 
            productName={currentProductName} 
            notes={currentProductNotes} 
            imageUrl={currentProductImageUrl}
            heroImage={currentProductHeroImage}
          />
        </div>

        {/* ZEN METRICS & SCIENTIFIC METHOD ARTICLE */}
        <section className="mt-24 border-t border-stone-205 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-stone-700" aria-label="Aura Synesthesia Science">
          <article>
            <h4 className="font-serif text-xl font-light text-stone-900 mb-4">
              01 // Volatility Index
            </h4>
            <p className="text-stone-600 text-[13px] leading-relaxed font-light">
              We define volatility as the speed of molecule evaporation. The top notes of Calabrian Bergamot or Guatemalan Cardamom contain low atomic weight esters that flight-release upon contact with body heat. This creates the initial spatial expansion.
            </p>
          </article>

          <article>
            <h4 className="font-serif text-xl font-light text-stone-900 mb-4">
              02 // The Core Accord
            </h4>
            <p className="text-stone-600 text-[13px] leading-relaxed font-light">
              Transitioning from top notes takes place via Heart notes—primarily Iris Concrete or ancient Egyptian Papyrus. These act as modifiers, calming molecular excitement and creating a dense, rich wood or velvet floral cushion.
            </p>
          </article>

          <article>
            <h4 className="font-serif text-xl font-light text-stone-900 mb-4">
              03 // Sillage & Anchors
            </h4>
            <p className="text-stone-600 text-[13px] leading-relaxed font-light">
              The longevity (6 to 24 hours) depends on high molecular weight polymers like Indian Sandalwood or Haitian Vetiver root. They wrap around other volatile molecules, slowing down complete dissipation and leaving a signature skin sillage.
            </p>
          </article>
        </section>

        {/* PHILOSOPHY FOOTER MARQUEE */}
        <section className="mt-20 border-y border-stone-200 py-10 text-center" aria-label="Aura Philosophy Quote">
          <p className="font-serif italic text-lg text-stone-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
            "Artisanal luxury is in the margin. The blank canvas is as essential as the paint. The dry stone is as evocative as the flower."
          </p>
          <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mt-4">
            Aura & Grid Fine Fragrances — Grasse & Copenhagen
          </span>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-32 max-w-6xl mx-auto px-6 border-t border-stone-200/55 pt-12 flex flex-col md:flex-row justify-between items-center text-stone-400 gap-6">
        <div>
          <span className="font-serif text-stone-800 tracking-widest text-sm uppercase">AURA</span>
          <p className="text-[10px] font-mono mt-1 text-stone-450 uppercase tracking-wider">
            Premium website template for high-end boutique fragrance brands.
          </p>
        </div>
        
        <div className="flex gap-6 font-mono text-[10px] tracking-wider uppercase text-stone-500">
          <a href="#scent" className="hover:text-stone-850 transition-colors">Olfactory Pyramid</a>
          <a href="#lab" className="hover:text-stone-850 transition-colors">Scent Chemistry</a>
          <a href="#studio" className="hover:text-stone-850 transition-colors">Accessibility Statement</a>
        </div>
        
        <div className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
          © 2026 Aura Scent House. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

