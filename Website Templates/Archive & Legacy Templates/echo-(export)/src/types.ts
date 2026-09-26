export interface Track {
  id: string;
  title: string;
  bitrate: string;
  year: string;
  duration: string;
  genre: string;
  bpm: number;
  description: string;
  notes: Array<{ note: string; duration: number; time: number }>;
  isCustomSample?: boolean;
  audioBuffer?: AudioBuffer;
}

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: 'Synthesizer' | 'Drum Machine' | 'Effect Processor' | 'Eurorack Module' | 'Utility';
  rackSpace?: string; // e.g. "1U", "3U", "Desktop"
  specs: Record<string, string>;
  powerDraw?: string; // e.g., "+12V: 140mA, -12V: 70mA"
  status: 'online' | 'patched' | 'inactive';
  description: string;
}

export interface SynthPreset {
  id: string;
  name: string;
  oscillatorType: 'sawtooth' | 'square' | 'triangle' | 'sine';
  cutoffFrequency: number;
  resonance: number;
  delayFeedbackLimit: number;
  tempo: number;
  noiseAmount: number;
  masterVolume: number;
  effectsBypassed: boolean;
  isCustom?: boolean;
  description?: string;
}

