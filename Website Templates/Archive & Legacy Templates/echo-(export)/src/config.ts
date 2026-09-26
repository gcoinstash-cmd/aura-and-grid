/**
 * ============================================================================
 *               AURA & GRID CONFIGURATION MANIFEST (config.ts)
 * ============================================================================
 * This single configuration file drives all applet visual modes, technical
 * label copy, and catalog listings. Modifying these arrays and dictionaries
 * will instantly rebrand and restyle the entire digital ecosystem.
 */

import { Track, GearItem } from './types';

// AURA & GRID DEV NOTE: Change these string values to instantly swap the music niche out for SaaS metrics, digital product analytics, or standard portfolio grids.
export const globalConfig = {
  /**
   * 1. WORKSPACE LABEL TRANSLATIONS (PRODUCER vs ENTREPRENEUR MODES)
   * These label states are toggled via the global [Template Mode Toggle] header.
   */
  MODE_LABEL_CONFIG: {
    PRODUCER_MATRIX: {
      systemHeader: 'Sophisticated Visual Sound Engine & Hardware Hub',
      syncStatus: 'MATRIX SYNC: STABLE',
      parameterRackTitle: 'DSP Parameter Rack',
      gearListTitle: 'STUDIO GEAR LIST',
      gearManifestSub: 'Hardware Manifest'
    },
    CREATIVE_ENTERPRENEUR: {
      systemHeader: 'Premium Visual Product Studio & Asset Ecosystem',
      syncStatus: 'PORTFOLIO DECK: ONLINE',
      parameterRackTitle: 'Product Parameter Suite',
      gearListTitle: 'DIGITAL PRODUCT ASSETS',
      gearManifestSub: 'Digital Asset Catalogue'
    }
  },

  /**
   * 2. CENTRALIZED MUSIC OR DIGITAL PRODUCT TRACKS
   * Swap or add objects into this array to customize the workspace sound player.
   */
  TRACK_ARCHIVE: [
    {
      id: 'track_1',
      title: 'Sub-harmonic Pulse',
      bitrate: '1411kbps',
      year: '2026',
      duration: '4:16',
      genre: 'Industrial Techno',
      bpm: 125,
      description: 'A deep, heavy minimal stomp emphasizing extreme low frequency oscillations and raw modular textures.',
      notes: [
        { note: 'C2', duration: 0.15, time: 0 },
        { note: 'C2', duration: 0.1, time: 0.25 },
        { note: 'D#2', duration: 0.2, time: 0.5 },
        { note: 'C2', duration: 0.15, time: 0.75 },
        { note: 'F2', duration: 0.1, time: 1.0 },
        { note: 'C2', duration: 0.15, time: 1.25 },
        { note: 'A#1', duration: 0.3, time: 1.5 },
        { note: 'C2', duration: 0.2, time: 1.75 },
      ]
    },
    {
      id: 'track_2',
      title: 'Glitch Theory',
      bitrate: '320kbps',
      year: '2025',
      duration: '3:45',
      genre: 'IDM',
      bpm: 110,
      description: 'Granular synthesizer bursts overlaid with sporadic micro-percussion and digital errors inspired by machine decay.',
      notes: [
        { note: 'A2', duration: 0.1, time: 0 },
        { note: 'C3', duration: 0.05, time: 0.25 },
        { note: 'E3', duration: 0.12, time: 0.5 },
        { note: 'A3', duration: 0.05, time: 0.75 },
        { note: 'G3', duration: 0.08, time: 1.0 },
        { note: 'E3', duration: 0.1, time: 1.25 },
        { note: 'C3', duration: 0.05, time: 1.5 },
        { note: 'D3', duration: 0.15, time: 1.75 },
      ]
    },
    {
      id: 'track_3',
      title: 'Void Reverb',
      bitrate: '2822kbps (DSD)',
      year: '2026',
      duration: '5:02',
      genre: 'Dark Ambient',
      bpm: 90,
      description: 'Ethereal, high-resonance synthesizer sweeps layered over a continuous 40Hz drone, filtered recursively.',
      notes: [
        { note: 'E2', duration: 0.8, time: 0 },
        { note: 'B2', duration: 0.6, time: 0.5 },
        { note: 'G3', duration: 0.7, time: 1.0 },
        { note: 'F#3', duration: 0.9, time: 1.5 },
        { note: 'E3', duration: 0.8, time: 2.0 },
        { note: 'D3', duration: 0.4, time: 2.5 },
        { note: 'B2', duration: 0.5, time: 3.0 },
        { note: 'E2', duration: 0.9, time: 3.5 },
      ]
    },
    {
      id: 'track_4',
      title: 'Neon Grid Shift',
      bitrate: '1411kbps',
      year: '2026',
      duration: '3:58',
      genre: 'Cyberpunk Synthwave',
      bpm: 120,
      description: 'High-octane synth lead line synchronized to a driving 4-on-the-floor rhythm with rich hardware detuning.',
      notes: [
        { note: 'D3', duration: 0.15, time: 0 },
        { note: 'D3', duration: 0.15, time: 0.25 },
        { note: 'F3', duration: 0.15, time: 0.5 },
        { note: 'D3', duration: 0.15, time: 0.75 },
        { note: 'G3', duration: 0.15, time: 1.0 },
        { note: 'A3', duration: 0.2, time: 1.25 },
        { note: 'C4', duration: 0.15, time: 1.5 },
        { note: 'F3', duration: 0.25, time: 1.75 },
      ]
    },
    {
      id: 'track_5',
      title: 'Echoplex Transmissions',
      bitrate: '320kbps',
      year: '2024',
      duration: '6:12',
      genre: 'Dub Techno',
      bpm: 115,
      description: 'Spacious space-echo delay feedback chords overlapping each other in a continuous, hypnotic rhythmic wave.',
      notes: [
        { note: 'G2', duration: 0.4, time: 0 },
        { note: 'A#2', duration: 0.2, time: 0.5 },
        { note: 'D3', duration: 0.4, time: 1.0 },
        { note: 'C3', duration: 0.2, time: 1.5 },
        { note: 'F3', duration: 0.4, time: 2.0 },
        { note: 'D#3', duration: 0.3, time: 2.5 },
        { note: 'G3', duration: 0.5, time: 3.0 },
        { note: 'C2', duration: 0.5, time: 3.5 },
      ]
    }
  ] as Track[],

  /**
   * 3. CENTRALIZED GEAR MANIFEST / DIGITAL PRODUCT ASSETS
   * Map physical properties to creative product vectors. Easily customize items below.
   */
  GEAR_LIST: [
    {
      id: 'gear_01',
      name: 'Moog Subsequent 37',
      brand: 'Moog Music',
      category: 'Synthesizer',
      rackSpace: 'Desktop',
      specs: {
        'Engine': 'Analog (2x Monophonic / Duo-phonic)',
        'Keys': '37 semi-weighted with Aftertouch',
        'Filters': 'Moog Ladder Filter (20Hz - 20kHz)',
        'Oscillators': '2x VCO, 1x Sub Osc, 1x Noise Gen',
        'Presets': '256 user-writable locations',
        'Outputs': '1x TS Balanced line-out, MIDI I/O'
      },
      powerDraw: 'AC 100-240V, 50/60Hz, 15W',
      status: 'online',
      description: 'Designed for fat, analog basslines, gritty leads, and expressive modulation capabilities via the multidrive circuit.'
    },
    {
      id: 'gear_02',
      name: 'TR-8S Rhythm Performer',
      brand: 'Roland Corp.',
      category: 'Drum Machine',
      rackSpace: 'Desktop',
      specs: {
        'Sound Engine': 'ACB (Analog Circuit Behavior) + FM + Samples',
        'Instruments': '11 channels (Bass, Snare, Toms, Perc, Hats, etc.)',
        'Sample Space': 'Up to 180 seconds mono storage',
        'Pattern Storage': '128 patterns, 8 variations (A-H) each',
        'Outputs': 'Mix L/R, 6x assignable audio outs, Trig-out'
      },
      powerDraw: 'DC 9V via adapter, 2000mA',
      status: 'patched',
      description: 'Flagship rhythm machine blending pristine virtual-analog modeling of classic 808/909 circuits with user sample loading.'
    },
    {
      id: 'gear_03',
      name: 'SSL Fusion Outboard',
      brand: 'Solid State Logic',
      category: 'Effect Processor',
      rackSpace: '2U',
      specs: {
        'Circuitry': '100% Solid-state premium analogue core',
        'Key Modules': 'Vintage Drive, Violet EQ, HF Compressor',
        'Output Stage': 'Transformer (Custom SSL) for size & weight',
        'Input Range': '+24dBu max level head-room',
        'Bus Type': 'Stereo processor insert path'
      },
      powerDraw: 'AC 100-240V, 45W draw',
      status: 'patched',
      description: 'An advanced stereo analogue coloration master processor designed to add weight, depth, and spatial enhancement to mixes.'
    },
    {
      id: 'gear_04',
      name: 'Noise Plethora (Eurorack)',
      brand: 'Befaco',
      category: 'Eurorack Module',
      rackSpace: '14HP',
      specs: {
        'Oscillators': 'Dual digital multi-algo noise engines',
        'Sound Modes': 'Gritty Digital, Analog S&H, White Noise, FM Noise',
        'Filter': 'Analog lowpass & highpass filters built-in',
        'CV Control': 'V/Oct, Pitch, Cutoff, Resonance, Mode CV'
      },
      powerDraw: '+12V: 110mA, -12V: 68mA',
      status: 'online',
      description: 'Complex noise generator designed to shape chaotic texture arrays, vinyl clicks, sandstorm blasts, and aggressive glitch drums.'
    },
    {
      id: 'gear_05',
      name: 'Digitakt II Sampler',
      brand: 'Elektron',
      category: 'Drum Machine',
      rackSpace: 'Desktop',
      specs: {
        'Tracks': '16 digital stereo audio tracks or MIDI tracks',
        'Sound Engines': 'Grid, Oneshot, Slice, Werp, Repitch sampler engines',
        'LFOs': '3x assignable LFOs per single track',
        'RAM Space': '400MB sample memory, 20GB internal SSD'
      },
      powerDraw: 'DC 12V, 2.0A, typical 10W',
      status: 'online',
      description: 'Highly versatile stereo performance sampler and software-controlled step sequencer for extreme beats and rhythmic manipulation.'
    },
    {
      id: 'gear_06',
      name: 'Metropopolis Sequencer',
      brand: 'Intellijel',
      category: 'Eurorack Module',
      rackSpace: '34HP',
      specs: {
        'Step Count': '8 multi-stage slider tracks',
        'Modes': 'Forward, Reverse, Ping-pong, Random, Custom',
        'CV Inputs': 'Sync clock, aux pitch, gate duration controls',
        'Output Range': 'V/Oct pitch, 0-10V gate length, Trig-pulse'
      },
      powerDraw: '+12V: 145mA, -12V: 15mA',
      status: 'inactive',
      description: 'An interactive rhythmic pitch generator based on classic Ryk M-185 architectural step gating and loop slicing.'
    }
  ] as GearItem[]
};

// Aliased exports to prevent any compatibility disruption with existing imports
export const { MODE_LABEL_CONFIG, TRACK_ARCHIVE, GEAR_LIST } = globalConfig;
