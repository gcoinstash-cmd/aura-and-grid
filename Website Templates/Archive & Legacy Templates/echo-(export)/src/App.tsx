/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Track, GearItem } from './types';
import { TRACK_ARCHIVE, GEAR_LIST, MODE_LABEL_CONFIG } from './config';
import { WaveformPlayer } from './components/WaveformPlayer';
import { GearList } from './components/GearList';
import { ArchiveList } from './components/ArchiveList';
import { PatchCableOverlay } from './components/PatchCableOverlay';
import { isAudioEnginePlaying } from './utils/audioEngine';
import { AudioLines, SlidersHorizontal, Info, Hammer, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [templateMode, setTemplateMode] = useState<'PRODUCER_MATRIX' | 'CREATIVE_ENTERPRENEUR'>('PRODUCER_MATRIX');
  const [tracks, setTracks] = useState<Track[]>(TRACK_ARCHIVE);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACK_ARCHIVE[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const [gearItems, setGearItems] = useState<GearItem[]>(GEAR_LIST);
  const [activeCables, setActiveCables] = useState<Record<string, boolean>>({
    gear_01: true,
    gear_02: true,
    gear_03: true,
    gear_04: false,
    gear_05: false,
    gear_06: false,
  });

  useEffect(() => {
    // Periodically sync playback indicator states
    const timer = setInterval(() => {
      setIsPlaying(isAudioEnginePlaying());
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleCustomTrackAdd = (newTrack: Track) => {
    setTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-stone-100 font-sans tracking-normal scanline relative flex flex-col justify-between selection:bg-[#00FF41]/20">
      
      {/* Beautifully styled Aura & Grid developer note banner */}
      <div className="w-full bg-[#050507]/90 border-b border-stone-900/60 py-2.5 px-4 text-center text-[10px] sm:text-xs font-mono tracking-[0.2em] text-cyan-400 select-none shadow-[0_1px_5px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2 relative z-50">
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shrink-0" />
        <span>AURA & GRID TEMPLATE READY // SWAP DATA ARRAYS IN <span className="text-white underline font-bold px-1.5 py-0.5 bg-stone-900 rounded border border-stone-800">CONFIG.TS</span> TO INSTANTLY CUSTOMIZE THE HUB</span>
      </div>

      {/* Decorative cyber grid pattern overlay */}
      <div className="absolute inset-0 cyber-grid opacity-[0.4] pointer-events-none" />

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 md:gap-8 relative z-10">
        
        {/* Core Header Navigation Bar */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-stone-900 pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#00FF41] flex items-center justify-center bg-[#00FF41]/5 select-none rounded animate-pulse">
                <AudioLines className="w-5 h-5 text-[#00FF41]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-[0.4em] text-white uppercase flex items-center gap-2">
                  E C H O
                </h1>
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest opacity-60">
                  {MODE_LABEL_CONFIG[templateMode].systemHeader}
                </p>
              </div>
            </div>

            {/* Segmented Control - Template Mode Toggle */}
            <div id="template-mode-toggle" className="flex bg-[#070709] border border-stone-850 p-0.5 rounded text-[9px] font-mono shrink-0 select-none shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => setTemplateMode('PRODUCER_MATRIX')}
                className={`px-2.5 py-1.5 uppercase tracking-wider transition-all rounded-sm cursor-pointer ${
                  templateMode === 'PRODUCER_MATRIX'
                    ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 font-bold shadow-[0_0_8px_rgba(0,255,65,0.15)]'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Switch to Sound Producer Interface"
              >
                PRODUCER MATRIX
              </button>
              <button
                onClick={() => setTemplateMode('CREATIVE_ENTERPRENEUR')}
                className={`px-2.5 py-1.5 uppercase tracking-wider transition-all rounded-sm cursor-pointer ${
                  templateMode === 'CREATIVE_ENTERPRENEUR'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Switch to Entrepreneur Portfolio View"
              >
                CREATIVE ENTERPRENEUR
              </button>
            </div>
          </div>

          {/* Quick instructions indicator */}
          <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
            <button
               onClick={() => setShowGuide(!showGuide)}
               className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-800 bg-[#060606] text-xs font-mono text-stone-400 hover:text-[#00FF41] hover:border-[#00FF41]/30 rounded transition-all cursor-pointer opacity-60 hover:opacity-100"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuide ? 'HIDE LAB GUIDE' : 'LAB GUIDE'}</span>
            </button>
            <div className="flex flex-col items-end text-right font-mono text-[9.5px] tracking-tight text-stone-500 opacity-40 select-none">
              <span className="font-light">
                {MODE_LABEL_CONFIG[templateMode].syncStatus}
              </span>
              <span className="font-light">TIME: 2026-06-04 UTC</span>
            </div>
          </div>
        </header>

        {/* Dynamic Instructional panel */}
        {showGuide && (
          <div className="bg-[#050505] border border-emerald-950/40 p-4 font-mono text-xs text-stone-400 rounded-lg space-y-3 relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00FF41]/40" />
            <h4 className="text-white text-[11px] font-bold uppercase tracking-wider text-[#00FF41] flex items-center gap-1.5">
              <span>HOW TO OPERATE ECHO TERMINAL DESIGN MATRIX:</span>
            </h4>
            <ul className="list-decimal list-inside space-y-1.5 text-stone-400 leading-relaxed text-[11px]">
              <li>
                <strong className="text-stone-200">Synthesize Real Sound:</strong> Click the <strong className="text-[#00FF41]">▶ Play button</strong> on the main player. It uses the modern <strong className="text-[#00F0FF]">Web Audio API</strong> to generate beats, basslines, and synth arpeggios directly in your browser.
              </li>
              <li>
                <strong className="text-stone-200">Visual Modulation:</strong> Watch the real-time frequencies captured directly from the synth nodes. Cycle between the <strong className="text-stone-200">Oscilloscope</strong>, <strong className="text-stone-200">Spectrum Analyzer</strong>, and <strong className="text-stone-100">Matrix Bars</strong>.
              </li>
              <li>
                <strong className="text-stone-200">Interactive DSP Sliders:</strong> Twist the Cutoff frequency, change the wave generator shapes (Sawtooth/Square/Triangle/Sine), tweak Resonance, or increase delay feedback real-time to deform the audio loop.
              </li>
              <li>
                <strong className="text-stone-200">Studio Rack Integration:</strong> Hover or check hardware parameters in the <strong className="text-stone-200">Gear Manifest</strong>. Click the <strong className="text-[#00FF41]">SYS PATCH</strong> button to toggle patch channel routings.
              </li>
            </ul>
          </div>
        )}

        {/* Spatially Separated Layout Blocks */}
        
        {/* SECTION 1: Embedded Custom Waveform Synth Audio Player at the top of the body page */}
        <section id="producer-player-rack">
          <WaveformPlayer 
            currentTrack={currentTrack} 
            onTrackChanged={handleTrackSelect}
            templateMode={templateMode}
          />
        </section>

        {/* SECTION 2 & 3: Two-column grid split for hardware gear definitions and song tracks archive list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Hardware Gear Specs Manifest */}
          <section id="producer-hardware-manifest" className="h-full">
            <GearList 
              gearItems={gearItems} 
              setGearItems={setGearItems}
              activeCables={activeCables}
              setActiveCables={setActiveCables}
              templateMode={templateMode}
            />
          </section>

          {/* Master Song tracks Archive catalog */}
          <section id="producer-tracks-catalog" className="h-full">
            <ArchiveList 
              currentTrack={currentTrack} 
              onSelectTrack={handleTrackSelect} 
              isPlaying={isPlaying}
              tracks={tracks}
              onAddTrack={handleCustomTrackAdd}
            />
          </section>

        </div>
      </div>

      {/* SVG dynamic patch cables overlay */}
      <PatchCableOverlay gearItems={gearItems} activeCables={activeCables} />

      {/* Cyber Noir Footer */}
      <footer className="border-t border-stone-900 bg-[#030303] py-6 relative z-10 mt-12 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-stone-600">
          <div className="flex items-center gap-2">
            <span>© 2026 ECHO LABS CORE COMPILATION</span>
            <span>•</span>
            <span className="text-stone-500 uppercase">Pro Audio Workstation Framework</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600 opacity-40 font-light tracking-tight select-none">
            <span className="uppercase font-light">AES-256 SOUNDSTREAM</span>
            <span>LEVEL FEEDBACK: STATED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
