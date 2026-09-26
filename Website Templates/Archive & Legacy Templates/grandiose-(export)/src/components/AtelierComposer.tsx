/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CustomSensoryMix } from "../types";
import { Sparkles, Trash2, Heart, Music, Layers, Eye, RefreshCw, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AtelierComposerProps {
  onSavedMixesChange?: () => void;
}

const PRESET_TOP_NOTES = ["Crisp White Bergamot", "Somalian Frankincense", "Crushed Bamboo Scent", "Juniper & Dry Ginger", "Nectarine & Saffron"];
const PRESET_HEART_NOTES = ["Damascan Rose absolute", "Sandalwood & Orchid Wood", "Warm Slate & Cedar smoke", "White Tea & Wet Petals", "Ambergris & Violet leaf"];
const PRESET_BASE_NOTES = ["Somalian Resin & Myrrh", "Aged Kyoto Moss", "Sombre Leather & Oudh", "Smoked Vetiver & Amber", "Platinum Musk & Cypress Wood"];

const ACOUSTIC_STYLES = ["Neo-Classical Chamber", "Minimalist modular modulars", "Ambient House Cadence", "Jazz Saxophone & Vinyl", "Acoustic Harp Arpeggios"];
const LIGHTING_SCHEMES = [
  { key: "candle", name: "Obsidian Drip Candle Glow" },
  { key: "plasma", name: "Cyber Laser Geometry" },
  { key: "eclipse", name: "Eclipse Indigo Monolith" },
  { key: "velvet", name: "Velvet Wine Dark Crimson" }
];

export default function AtelierComposer({ onSavedMixesChange }: AtelierComposerProps) {
  const [eventName, setEventName] = useState("");
  const [topNote, setTopNote] = useState(PRESET_TOP_NOTES[0]);
  const [heartNote, setHeartNote] = useState(PRESET_HEART_NOTES[0]);
  const [baseNote, setBaseNote] = useState(PRESET_BASE_NOTES[0]);
  const [acousticStyle, setAcousticStyle] = useState(ACOUSTIC_STYLES[0]);
  const [bpm, setBpm] = useState(72);
  const [lightingKey, setLightingKey] = useState("candle");

  // Custom interactive soundwave peaks
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>([
    40, 60, 80, 50, 30, 45, 70, 90, 65, 40, 55, 75, 95, 60, 40, 30, 50, 70, 85, 45
  ]);

  const [savedMixes, setSavedMixes] = useState<CustomSensoryMix[]>([]);
  const [message, setMessage] = useState("");

  // Premium "MINT PRODUCTION BRIEF" Google Docs Inspired Export States
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [exportStep, setExportStep] = useState(0);

  useEffect(() => {
    loadSavedFormulations();
  }, []);

  const loadSavedFormulations = () => {
    const key = "grandiose-sensory-recipes";
    try {
      const records = localStorage.getItem(key);
      if (records) {
        const parsed = JSON.parse(records);
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid formulation records schema: must be an array");
        }
        setSavedMixes(parsed);
      }
    } catch (e) {
      console.warn("Gracefully dropping corrupted storage exception. Initiating original blueprint default restoration.", e);
      try {
        localStorage.removeItem(key);
      } catch (clearErr) {
        // Drop any inner failures when modifying storage
      }
      resetToBlueprintDefaults();
    }
  };

  const handleBarClick = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const heightPercentage = Math.round(100 - (clickY / rect.height) * 100);
    const clampedHeight = Math.max(10, Math.min(100, heightPercentage));

    const updated = [...waveAmplitudes];
    updated[idx] = clampedHeight;
    setWaveAmplitudes(updated);
  };

  const randomizeAll = () => {
    setTopNote(PRESET_TOP_NOTES[Math.floor(Math.random() * PRESET_TOP_NOTES.length)]);
    setHeartNote(PRESET_HEART_NOTES[Math.floor(Math.random() * PRESET_HEART_NOTES.length)]);
    setBaseNote(PRESET_BASE_NOTES[Math.floor(Math.random() * PRESET_BASE_NOTES.length)]);
    setAcousticStyle(ACOUSTIC_STYLES[Math.floor(Math.random() * ACOUSTIC_STYLES.length)]);
    setBpm(Math.floor(Math.random() * 40) + 50); // 50 to 90
    setLightingKey(LIGHTING_SCHEMES[Math.floor(Math.random() * LIGHTING_SCHEMES.length)].key);
    
    // Randomize amplitudes
    const randAmps = waveAmplitudes.map(() => Math.floor(Math.random() * 80) + 20);
    setWaveAmplitudes(randAmps);
  };

  const resetToBlueprintDefaults = () => {
    // Clear user-mutated ledger recipes from local storage
    localStorage.removeItem("grandiose-sensory-recipes");
    setSavedMixes([]);
    
    // Instantly restore the sensory blueprint formulation defaults
    setEventName("");
    setTopNote(PRESET_TOP_NOTES[0]);
    setHeartNote(PRESET_HEART_NOTES[0]);
    setBaseNote(PRESET_BASE_NOTES[0]);
    setAcousticStyle(ACOUSTIC_STYLES[0]);
    setBpm(72);
    setLightingKey("candle");
    setWaveAmplitudes([
      40, 60, 80, 50, 30, 45, 70, 90, 65, 40, 55, 75, 95, 60, 40, 30, 50, 70, 85, 45
    ]);

    setMessage("All user-mutated formulations and saved recipes reset to original blueprint standards.");
    setTimeout(() => setMessage(""), 5000);

    if (onSavedMixesChange) {
      onSavedMixesChange();
    }
  };

  const handleMintProductionBrief = () => {
    setIsExporting(true);
    setExportStep(1);
    setExportProgress("Accessing secure browser cache & extracting active register records...");

    const audioCtx = typeof window !== "undefined" && window.AudioContext;
    
    setTimeout(() => {
      setExportStep(2);
      setExportProgress("Analyzing custom dietary directives, helicopter permits & yacht mooring slots...");
    }, 1000);

    setTimeout(() => {
      setExportStep(3);
      setExportProgress("Synthesizing acoustic frequencies, interactive soundwaves & olfactory notes...");
    }, 2000);

    setTimeout(() => {
      setExportStep(4);
      setExportProgress("Encrypting payload parameters with elite Aura & Grid production schemas...");
    }, 3000);

    setTimeout(() => {
      // Gather live register data
      let guests = [];
      try {
        const stored = localStorage.getItem("grandiose-registrations-ledger");
        if (stored) {
          guests = JSON.parse(stored);
        } else {
          // Fallback to the initial elite parameters if local storage is uninitialized yet
          guests = [
            {
              fullName: "Archduchess Francesca von Habsburg",
              email: "francesca@habsburg-estate.at",
              attendance: "accept",
              guestCount: 2,
              dietaryRestrictions: ["Classic Tasting", "Caviar Alternative"],
              accommodationPreference: "Imperial Suite (Villa Sourced)",
              customRequests: "Dietary Directives: White Truffle Infusions Only / Saffron-Allergy Strict. Logistics: Private Airport Transfer (Tail #N700AG Reserved)."
            },
            {
              fullName: "Viscount Charles de Valois",
              email: "charles@valois-heritage.co.fr",
              attendance: "accept",
              guestCount: 2,
              dietaryRestrictions: ["Vegetarian Flight"],
              accommodationPreference: "Executive Observatory Balcony",
              customRequests: "Dietary Directives: Strictly organic micro-greens sourced from Northern Milan estate."
            }
          ];
        }
      } catch (err) {
        console.error("Could not parse registries for manifest", err);
      }

      const sensoryFormulation = {
        title: eventName.trim() || "Obsidian Soliloquy Gala Active Formulation",
        scentProfile: {
          topNote,
          heartNote,
          baseNote,
          formulationType: "Pure Extract Distillation"
        },
        acousticsStyle: {
          style: acousticStyle,
          tempo: `${bpm} BPM`,
          interactiveAmplitudes: waveAmplitudes
        },
        lightingScheme: {
          key: lightingKey,
          title: activeLighting.name
        }
      };

      const docsPayload = {
        generator: "Aura & Grid - Grandiose Haute-Couture Manifest Generator",
        schema: "https://aura-and-grid.com/schemas/gala-v14.json",
        issuedAt: new Date().toISOString(),
        compilationMetadata: {
          archivalKey: `MINT-${Date.now()}`,
          securityStatus: "SEALED / RESTRICTED ACCESS"
        },
        activeSensoryBrief: sensoryFormulation,
        coordinatorRegistries: guests
      };

      // Output direct download stream
      const jsonString = JSON.stringify(docsPayload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AuraGrid_GalaManifest_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportStep(0);
      setExportProgress("");
      setMessage("Production brief manifest alchemized successfully! Compiled file downloaded to local directory.");
      setTimeout(() => setMessage(""), 5000);
    }, 4200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = eventName.trim() || "Obsidian Soliloquy Gala";

    const newMix: CustomSensoryMix = {
      id: "recipe-" + Date.now(),
      eventName: cleanName,
      topNote,
      heartNote,
      baseNote,
      bpm,
      acousticStyle,
      lightingKey,
    };

    const updatedList = [newMix, ...savedMixes];
    setSavedMixes(updatedList);
    localStorage.setItem("grandiose-sensory-recipes", JSON.stringify(updatedList));

    // Reset details
    setEventName("");
    setMessage("Atmosphere formulation successfully sealed into chronological ledger.");
    setTimeout(() => setMessage(""), 4000);

    if (onSavedMixesChange) {
      onSavedMixesChange();
    }
  };

  const deleteMix = (id: string) => {
    const updated = savedMixes.filter((m) => m.id !== id);
    setSavedMixes(updated);
    localStorage.setItem("grandiose-sensory-recipes", JSON.stringify(updated));
    
    if (onSavedMixesChange) {
      onSavedMixesChange();
    }
  };

  const activeLighting = LIGHTING_SCHEMES.find((l) => l.key === lightingKey) || LIGHTING_SCHEMES[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12" id="atelier-sensory-composer">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-charcoal pb-8 mb-12">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase block mb-2 font-sans font-medium">
            03 / Atelier & Lab
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-stark-white font-light tracking-wide">
            La Galerie d&apos;Atmos
          </h2>
        </div>
        <p className="max-w-md text-xs tracking-wider text-platinum/70 leading-relaxed font-sans font-light mt-4 md:mt-0">
          An interactive laboratory interface representing the absolute premium event composition suite. Curate molecular physical vibrations, acoustics, and notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="composer-main-grid">
        
        {/* 1. ATELIER COMPOSER FORM PANEL (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-charcoal-deep/30 border border-charcoal p-6 md:p-10 space-y-8 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal/50">
            <span className="text-[10px] tracking-[0.25em] text-gold uppercase font-serif">
              Formulation Sheet
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="reset-blueprint-defaults"
                onClick={resetToBlueprintDefaults}
                className="text-[9px] tracking-widest text-[#E5E5E5]/45 hover:text-[#FFFFFF] uppercase hover:underline cursor-pointer transition-all font-sans font-medium"
              >
                RESET TO BLUEPRINT DEFAULTS
              </button>
              <div className="w-[1px] h-3 bg-charcoal-light hidden sm:block" />
              <button
                type="button"
                id="randomize-inputs"
                onClick={randomizeAll}
                className="text-[9px] tracking-widest text-[#E5E5E5]/60 hover:text-gold uppercase flex items-center gap-1 bg-obsidian border border-charcoal px-3 py-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={10} /> ALCHEMIZE RECIPE
              </button>
            </div>
          </div>

          {message && (
            <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-100 text-xs p-4 text-center font-sans tracking-wide">
              {message}
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-6">
            
            {/* Celebration Title */}
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.2em] uppercase text-platinum/50 block">
                ATMOSPHERE TITRE / CELEBRATION CODES
              </label>
              <input
                id="composer-event-name"
                type="text"
                placeholder="e.g. Royal Canopy Opening or Amber Glass Dinner"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-obsidian border border-charcoal px-4 py-3.5 text-xs text-stark-white focus:outline-none focus:border-gold font-sans font-medium tracking-widest"
              />
            </div>

            {/* Scent Formulation Layer */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1.5 text-gold border-b border-charcoal/40 pb-2">
                <Layers size={11} />
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                  I. Scent Profile Formulation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top Note */}
                <div className="space-y-1.5">
                  <span className="text-[8px] text-platinum/40 uppercase font-mono block">TOP DIFFUSION</span>
                  <select
                    id="select-top-note"
                    value={topNote}
                    onChange={(e) => setTopNote(e.target.value)}
                    className="w-full bg-obsidian border border-charcoal text-[11px] text-platinum py-2 px-2.5 outline-none focus:border-gold"
                  >
                    {PRESET_TOP_NOTES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Heart Note */}
                <div className="space-y-1.5">
                  <span className="text-[8px] text-platinum/40 uppercase font-mono block">HEART NARRATIVE</span>
                  <select
                    id="select-heart-note"
                    value={heartNote}
                    onChange={(e) => setHeartNote(e.target.value)}
                    className="w-full bg-obsidian border border-charcoal text-[11px] text-platinum py-2 px-2.5 outline-none focus:border-gold"
                  >
                    {PRESET_HEART_NOTES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Base Note */}
                <div className="space-y-1.5">
                  <span className="text-[8px] text-platinum/40 uppercase font-mono block">BASE FOUNDATION</span>
                  <select
                    id="select-base-note"
                    value={baseNote}
                    onChange={(e) => setBaseNote(e.target.value)}
                    className="w-full bg-obsidian border border-charcoal text-[11px] text-platinum py-2 px-2.5 outline-none focus:border-gold"
                  >
                    {PRESET_BASE_NOTES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sonic Engineering Layer */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1.5 text-gold border-b border-charcoal/40 pb-2">
                <Music size={11} />
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                  II. Acoustic Cadence & Soundwave Peaks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Style selector */}
                <div className="space-y-2">
                  <span className="text-[8px] text-platinum/40 uppercase font-mono block">ACOUSTIC CADENCE STYLE</span>
                  <select
                    id="select-acoustic-style"
                    value={acousticStyle}
                    onChange={(e) => setAcousticStyle(e.target.value)}
                    className="w-full bg-obsidian border border-charcoal text-[11px] text-platinum pr-4 py-2.5 outline-none focus:border-gold"
                  >
                    {ACOUSTIC_STYLES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* BPM Custom sliders */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] text-platinum/40 font-mono">
                    <span>CADENCE TEMPO</span>
                    <span className="text-gold font-bold">{bpm} BPM</span>
                  </div>
                  <input
                    id="config-bpm-slider"
                    type="range"
                    min="50"
                    max="110"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full accent-gold bg-charcoal h-1 cursor-pointer appearance-none rounded"
                  />
                  <div className="flex justify-between text-[7px] text-platinum/30 tracking-widest font-mono">
                    <span>LENTO (50)</span>
                    <span>ALLEGRETTO (110)</span>
                  </div>
                </div>

              </div>

              {/* DRAW WAVEFORM COMPONENT: Acoustic Waveform Interface with interactive amplitudes */}
              <div className="space-y-2 bg-obsidian border border-charcoal p-4 rounded-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] text-gold/80 tracking-widest font-mono uppercase block">
                    INTERACTIVE FREQUENCY TUNER (TAP PEAK CHANNELS TO ADAPT)
                  </span>
                  <span className="text-[7.5px] text-platinum/30 font-mono font-medium">Bespoke Resonations</span>
                </div>

                <div className="h-20 flex items-end gap-[4px] px-1 pt-2">
                  {waveAmplitudes.map((amp, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => handleBarClick(idx, e)}
                      className="group flex-1 h-full flex items-end cursor-ns-resize"
                      title="Adjust peak amplitude"
                    >
                      <div
                        id={`wave-bar-${idx}`}
                        style={{ height: `${amp}%` }}
                        className="w-full bg-charcoal-light group-hover:bg-gold hover:opacity-100 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[7px] font-mono text-platinum/40 tracking-widest pt-1 border-t border-charcoal/30">
                  <span>SUB HARMONIC</span>
                  <span>MID CORE TENSION</span>
                  <span>PRECISE HF ATOMS</span>
                </div>
              </div>
            </div>

            {/* Photographic Space Architect */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1.5 text-gold border-b border-charcoal/40 pb-2">
                <Eye size={11} />
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                  III. Architectural Lighting Calibration
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {LIGHTING_SCHEMES.map((scheme) => {
                  const active = lightingKey === scheme.key;
                  return (
                    <button
                      key={scheme.key}
                      id={`lighting-option-${scheme.key}`}
                      type="button"
                      onClick={() => setLightingKey(scheme.key)}
                      className={`p-3 text-left border transition-all duration-300 relative cursor-pointer ${
                        active
                          ? "border-gold bg-charcoal text-stark-white"
                          : "border-charcoal bg-obsidian text-platinum/50 hover:border-platinum/30 hover:text-platinum"
                      }`}
                    >
                      <span className="text-[7px] font-mono text-gold/45 block mb-1 uppercase">
                        VEC0{scheme.key === "candle" ? "1" : scheme.key === "plasma" ? "2" : scheme.key === "eclipse" ? "3" : "4"}
                      </span>
                      <p className="text-[10px] font-sans font-medium tracking-tight leading-tight">
                        {scheme.name}
                      </p>
                      {active && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="submit"
              id="mint-blueprint-btn"
              className="bg-charcoal text-[#E5E5E5] border border-charcoal-light hover:border-gold hover:text-gold text-xs uppercase tracking-[0.25em] py-4 font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <Sparkles size={13} className="text-gold" /> MINT BLUEPRINT
            </button>
            <button
              type="button"
              id="mint-production-brief-btn"
              onClick={handleMintProductionBrief}
              disabled={isExporting}
              className="bg-gold text-obsidian font-bold text-xs uppercase tracking-[0.25em] py-4 hover:bg-stark-white transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <FileText size={13} /> MINT PRODUCTION BRIEF
            </button>
          </div>
        </form>

        {/* 2. CHRONOLOGICAL ATMOSPHERE LEDGER LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] tracking-[0.2em] text-platinum/40 uppercase block font-sans">
            MINTED LEDGER SCROLL
          </span>

          <div className="border border-charcoal bg-obsidian text-stark-white p-6 relative min-h-[400px] flex flex-col justify-between">
            {/* Fine watermark backdrops representing printed books */}
            <div className="absolute inset-0 block grain-overlay pointer-events-none opacity-40" />

            <div className="space-y-6 relative z-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">
              <div className="border-b border-charcoal/60 pb-3 flex justify-between items-baseline">
                <h4 className="font-serif italic text-lg text-gold font-light">
                  L&apos;Archive de l&apos;Atmos
                </h4>
                <span className="text-[8px] font-mono text-platinum/30">
                  {savedMixes.length} SLOTS USED
                </span>
              </div>

              {savedMixes.length === 0 ? (
                <div className="text-center py-20 text-platinum/40 font-sans text-xs">
                  <p className="font-serif italic text-sm text-platinum/70 mb-2">The Scroll is pristine.</p>
                  <p className="max-w-[240px] mx-auto text-[10px] leading-relaxed">
                    Set your codes on the left panel & click &quot;Mint Sensory Blueprint&quot; to populate your bespoke draft formulations ledger here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedMixes.map((mix, idx) => (
                    <div
                      key={mix.id}
                      id={`ledger-item-${mix.id}`}
                      className="p-4 bg-charcoal-deep/50 border border-charcoal/80 hover:border-gold/30 transition-all flex justify-between items-start"
                    >
                      <div className="space-y-2 flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] text-[#A3842C] tracking-widest uppercase">
                            RECIPE 0{idx + 1}
                          </span>
                        </div>
                        <h5 className="font-serif text-base text-stark-white truncate">
                          {mix.eventName}
                        </h5>
                        
                        {/* Recipe list tags summary */}
                        <div className="space-y-1 font-sans text-[9px] text-[#E5E5E5]/70">
                          <p className="truncate">
                            <span className="text-platinum/40 uppercase">OLFACTORY: </span>
                            {mix.topNote} &rarr; {mix.heartNote}
                          </p>
                          <p className="truncate">
                            <span className="text-platinum/40 uppercase">ACOUSTICS: </span>
                            {mix.acousticStyle} ({mix.bpm} BPM)
                          </p>
                          <p className="truncate">
                            <span className="text-platinum/40 uppercase">LIGHTING: </span>
                            {mix.lightingKey.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        id={`delete-recipe-${mix.id}`}
                        onClick={() => deleteMix(mix.id)}
                        className="p-2 border border-charcoal text-platinum/40 hover:text-red-400 hover:border-red-950/60 transition-all duration-300 cursor-pointer"
                        title="Delete blueprint"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-charcoal/60 pt-4 mt-6 text-center text-[8px] font-mono text-platinum/30 tracking-widest relative z-10">
              MAPPED REALTIME INTO SECURE LOCAL BROWSER LEDGER
            </div>
          </div>
        </div>

      </div>

      {/* Luxury, slow-loading animation state for client manifest brief drafting */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            id="couture-generator-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-xl w-full border border-gold/40 bg-[#0C0C0C] p-8 md:p-12 relative text-center space-y-8"
            >
              <div className="absolute inset-2 border border-charcoal/30 pointer-events-none" />
              <div className="absolute top-4 left-4 text-left text-[8px] tracking-widest text-gold/60 font-mono uppercase">
                Aura & Grid System
              </div>
              <div className="absolute top-4 right-4 text-right text-[8px] tracking-widest text-[#E5E5E5]/30 font-mono">
                SECURE HANDSHAKE / V14
              </div>

              {/* Pulsing monogram spinner */}
              <div className="w-20 h-20 mx-auto border-t-2 border-r border-gold rounded-full animate-spin flex items-center justify-center">
                <div className="w-14 h-14 border border-charcoal rounded-full flex items-center justify-center font-serif text-gold text-sm italic animate-pulse">
                  AG
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif italic text-2xl text-stark-white tracking-wide animate-pulse">
                  Generating Haute-Couture Manifest...
                </h3>
                <div className="h-[1px] w-20 bg-gold/50 mx-auto" />
                <p className="text-[10px] tracking-[0.2em] text-[#E5E5E5]/70 uppercase font-sans leading-relaxed h-12 flex items-center justify-center max-w-sm mx-auto">
                  {exportProgress}
                </p>
              </div>

              {/* Luxury Step indicators */}
              <div className="flex justify-center items-center gap-2 pt-2">
                {[1, 2, 3, 4].map((step) => {
                  const active = exportStep >= step;
                  return (
                    <div
                      key={step}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        active ? "w-8 bg-gold" : "w-1.5 bg-charcoal"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="pt-4 text-[8px] font-mono text-[#E5E5E5]/35 tracking-widest uppercase">
                READYING COMPATIBILITY SPECIFICATIONS FOR GOOGLE DOCS API DISPATCH
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
