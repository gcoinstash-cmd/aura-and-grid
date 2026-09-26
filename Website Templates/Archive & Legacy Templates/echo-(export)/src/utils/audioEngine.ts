import { Track } from '../types';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let delayNode: DelayNode | null = null;
let delayFeedback: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;
let wetGainNode: GainNode | null = null;
let dryGainNode: GainNode | null = null;

// Scheduler & Synth state
let isPlaying = false;
let currentTrack: Track | null = null;
let stepTimer: number | null = null;
let startTime = 0;
let nextNoteTime = 0;
let currentNoteIndex = 0;
let bpm = 120;

// Synthesizer parameters (adjustable in real time)
export interface SynthParameters {
  oscillatorType: 'sawtooth' | 'square' | 'triangle' | 'sine';
  cutoffFrequency: number;
  resonance: number;
  delayFeedbackLimit: number;
  tempo: number;
  noiseAmount: number;
  masterVolume: number;
  effectsBypassed: boolean;
}

export let synthParams: SynthParameters = {
  oscillatorType: 'sawtooth',
  cutoffFrequency: 1200,
  resonance: 4,
  delayFeedbackLimit: 0.3,
  tempo: 110,
  noiseAmount: 0.15,
  masterVolume: 0.4,
  effectsBypassed: false,
};

export function updateSynthParam(key: keyof SynthParameters, value: number | string) {
  if (key === 'oscillatorType') {
    synthParams.oscillatorType = value as any;
  } else if (key === 'cutoffFrequency') {
    synthParams.cutoffFrequency = Number(value);
    if (filterNode) {
      filterNode.frequency.setValueAtTime(synthParams.cutoffFrequency, audioCtx?.currentTime || 0);
    }
  } else if (key === 'resonance') {
    synthParams.resonance = Number(value);
    if (filterNode) {
      filterNode.Q.setValueAtTime(synthParams.resonance, audioCtx?.currentTime || 0);
    }
  } else if (key === 'delayFeedbackLimit') {
    synthParams.delayFeedbackLimit = Number(value);
    if (delayFeedback) {
      delayFeedback.gain.setValueAtTime(synthParams.delayFeedbackLimit, audioCtx?.currentTime || 0);
    }
  } else if (key === 'tempo') {
    synthParams.tempo = Number(value);
    bpm = synthParams.tempo;
    if (customSourceNode && currentTrack?.isCustomSample && currentTrack.bpm) {
      const rate = synthParams.tempo / currentTrack.bpm;
      customSourceNode.playbackRate.setValueAtTime(rate, audioCtx?.currentTime || 0);
    }
  } else if (key === 'noiseAmount') {
    synthParams.noiseAmount = Number(value);
  } else if (key === 'masterVolume') {
    synthParams.masterVolume = Number(value);
    if (masterGain) {
      masterGain.gain.setValueAtTime(synthParams.masterVolume, audioCtx?.currentTime || 0);
    }
  } else if (key === 'effectsBypassed') {
    synthParams.effectsBypassed = Boolean(value);
    if (audioCtx && wetGainNode && dryGainNode) {
      const time = audioCtx.currentTime;
      const wetVal = synthParams.effectsBypassed ? 0 : 1;
      const dryVal = synthParams.effectsBypassed ? 1 : 0;
      wetGainNode.gain.setTargetAtTime(wetVal, time, 0.012);
      dryGainNode.gain.setTargetAtTime(dryVal, time, 0.012);
    }
  }
}

let customSourceNode: AudioBufferSourceNode | null = null;

function initAudio() {
  if (audioCtx) return;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  audioCtx = new AudioContextClass();
  
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(synthParams.masterVolume, audioCtx.currentTime);

  // Warm analog-modeled filter
  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(synthParams.cutoffFrequency, audioCtx.currentTime);
  filterNode.Q.setValueAtTime(synthParams.resonance, audioCtx.currentTime);

  // Digital tape delay effect
  delayNode = audioCtx.createDelay(1.0);
  delayNode.delayTime.setValueAtTime(0.33, audioCtx.currentTime); // dotted eighth note delay

  delayFeedback = audioCtx.createGain();
  delayFeedback.gain.setValueAtTime(synthParams.delayFeedbackLimit, audioCtx.currentTime);

  // A/B Dry/Wet routing channels
  wetGainNode = audioCtx.createGain();
  dryGainNode = audioCtx.createGain();

  const initialWet = synthParams.effectsBypassed ? 0 : 1;
  const initialDry = synthParams.effectsBypassed ? 1 : 0;
  wetGainNode.gain.setValueAtTime(initialWet, audioCtx.currentTime);
  dryGainNode.gain.setValueAtTime(initialDry, audioCtx.currentTime);

  // Route Wet path to Filter & Delay loop
  wetGainNode.connect(filterNode);
  // Route Dry path directly to Master Gain (bypassing filter/delay)
  dryGainNode.connect(masterGain);

  // Routing Filter output and Delay loop output to master gain
  filterNode.connect(masterGain);
  
  // Connect delay feedback loop
  filterNode.connect(delayNode);
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayNode.connect(masterGain);

  masterGain.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
}

// Convert note name (e.g., C4, A#3) to frequency
function noteToFreq(note: string): number {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const name = note.slice(0, -1);
  const octave = parseInt(note.slice(-1), 10);
  const semitones = notes.indexOf(name) + (octave - 4) * 12;
  return 440 * Math.pow(2, semitones / 12);
}

// Web Audio synthesizer synthesis helper
function playSynthVoice(note: string, time: number, duration: number) {
  if (!audioCtx || !filterNode) return;

  const freq = noteToFreq(note);
  if (isNaN(freq)) return;

  // 1. Double Oscillator Stack for a fat modern sound
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();

  osc1.type = synthParams.oscillatorType;
  osc1.frequency.setValueAtTime(freq, time);
  
  osc2.type = synthParams.oscillatorType === 'sine' ? 'sawtooth' : synthParams.oscillatorType;
  // Detune slightly for lush chorus-like feel (classic cyber-noir)
  osc2.frequency.setValueAtTime(freq * 1.006, time);

  oscGain.gain.setValueAtTime(0, time);
  // Volume Envelope (ADSR - Attack Decay Sustain Release)
  const attack = 0.02;
  const decay = duration * 0.4;
  const sustain = 0.5;
  const release = 0.15;

  oscGain.gain.linearRampToValueAtTime(0.35, time + attack);
  oscGain.gain.exponentialRampToValueAtTime(0.35 * sustain, time + attack + decay);
  oscGain.gain.setValueAtTime(0.35 * sustain, time + duration);
  oscGain.gain.linearRampToValueAtTime(0, time + duration + release);

  // 2. Filter Sweep Envelope
  if (!synthParams.effectsBypassed) {
    filterNode.frequency.setValueAtTime(synthParams.cutoffFrequency, time);
    filterNode.frequency.exponentialRampToValueAtTime(
      Math.min(20000, synthParams.cutoffFrequency * 2.8), 
      time + 0.04
    );
    filterNode.frequency.exponentialRampToValueAtTime(
      synthParams.cutoffFrequency, 
      time + duration
    );
  }

  // 3. Connect routing
  osc1.connect(oscGain);
  osc2.connect(oscGain);
  if (wetGainNode && dryGainNode) {
    oscGain.connect(wetGainNode);
    oscGain.connect(dryGainNode);
  } else {
    oscGain.connect(filterNode);
  }

  osc1.start(time);
  osc1.stop(time + duration + release + 0.1);

  osc2.start(time);
  osc2.stop(time + duration + release + 0.1);

  // 4. Synthesizer White Noise snare/clap burst for rhythm (mood build-up)
  if (!synthParams.effectsBypassed && synthParams.noiseAmount > 0.01 && (currentNoteIndex % 4 === 2 || currentNoteIndex % 8 === 7)) {
    synthNoiseDrum(time, duration);
  }
}

function synthNoiseDrum(time: number, duration: number) {
  if (!audioCtx || !filterNode) return;

  const bufferSize = audioCtx.sampleRate * 0.1; // 100ms burst
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1500, time);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(synthParams.noiseAmount * 0.25, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination); // Direct bypass for crisp drum tone

  noiseNode.start(time);
  noiseNode.stop(time + 0.12);
}

// Low frequency cyber kick drum synthesised manually
function synthKickDrum(time: number) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);

  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.18);
}

// Synthesize and schedule sound notes
function scheduler() {
  while (nextNoteTime < (audioCtx?.currentTime || 0) + 0.1) {
    scheduleNextNote(currentNoteIndex, nextNoteTime);
    advanceSequence();
  }
  // Schedule check 25 milliseconds away
  stepTimer = window.setTimeout(scheduler, 25);
}

function scheduleNextNote(step: number, time: number) {
  if (!currentTrack || !currentTrack.notes || currentTrack.notes.length === 0) {
    // Fallback notes if song file has empty notes
    const debugNotes = ['C3', 'E3', 'G3', 'A3', 'C4', 'A3', 'G3', 'E3'];
    const currentNote = debugNotes[step % debugNotes.length];
    playSynthVoice(currentNote, time, 0.25);
    if (step % 2 === 0) {
      synthKickDrum(time);
    }
    return;
  }

  // Get note index wrapped
  const noteIndex = step % currentTrack.notes.length;
  const noteObj = currentTrack.notes[noteIndex];

  // Synthesize note
  playSynthVoice(noteObj.note, time, noteObj.duration);

  // Core rhythmic beat
  if (step % 4 === 0) {
    synthKickDrum(time);
  }
}

function advanceSequence() {
  const secondsPerBeat = 60.0 / bpm;
  nextNoteTime += 0.25 * secondsPerBeat; // 16th note timing

  currentNoteIndex++;
}

// Public API
export function startPlayback(track: Track, onPlayStateChanged?: (isPlaying: boolean) => void) {
  try {
    initAudio();
    if (audioCtx?.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) {
      stopPlayback();
    }

    isPlaying = true;
    currentTrack = track;
    bpm = track.bpm || synthParams.tempo;
    currentNoteIndex = 0;
    
    if (audioCtx) {
      if (track.isCustomSample && track.audioBuffer) {
        customSourceNode = audioCtx.createBufferSource();
        customSourceNode.buffer = track.audioBuffer;
        customSourceNode.loop = true;
        
        if (wetGainNode && dryGainNode) {
          customSourceNode.connect(wetGainNode);
          customSourceNode.connect(dryGainNode);
        } else if (filterNode) {
          customSourceNode.connect(filterNode);
        }
        
        const rate = synthParams.tempo / track.bpm;
        customSourceNode.playbackRate.setValueAtTime(rate, audioCtx.currentTime);
        customSourceNode.start(0);
      } else {
        startTime = audioCtx.currentTime;
        nextNoteTime = startTime + 0.05;
        scheduler();
      }
    }
    
    if (onPlayStateChanged) onPlayStateChanged(true);
  } catch (error) {
    console.error('Failed to initialize or play synth audio context:', error);
  }
}

export function stopPlayback(onPlayStateChanged?: (isPlaying: boolean) => void) {
  isPlaying = false;
  currentTrack = null;
  if (stepTimer) {
    clearTimeout(stepTimer);
    stepTimer = null;
  }
  if (customSourceNode) {
    try {
      customSourceNode.stop();
    } catch (e) {}
    customSourceNode.disconnect();
    customSourceNode = null;
  }
  if (onPlayStateChanged) onPlayStateChanged(false);
}

export function isAudioEnginePlaying(): boolean {
  return isPlaying;
}

export function getAudioAnalysisData(): { frequencies: Uint8Array; waveform: Uint8Array } | null {
  if (!analyserNode) return null;
  
  const frequencies = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(frequencies);

  const waveform = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteTimeDomainData(waveform);

  return { frequencies, waveform };
}

export function getAudioContext(): AudioContext | null {
  return audioCtx;
}

export function tryUnlockAudioContext(): Promise<boolean> {
  if (!audioCtx) {
    try {
      initAudio();
    } catch (e) {
      console.error('Failed to pre-init audio context on tap:', e);
      return Promise.resolve(false);
    }
  }
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      return audioCtx.resume().then(() => {
        return audioCtx?.state === 'running';
      }).catch((err) => {
        console.warn('Audio resume promise rejected:', err);
        return false;
      });
    }
    return Promise.resolve(audioCtx.state === 'running');
  }
  return Promise.resolve(false);
}

