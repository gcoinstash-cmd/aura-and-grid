let audioCtx: AudioContext | null = null;
let engineOsc1: OscillatorNode | null = null;
let engineOsc2: OscillatorNode | null = null;
let lfoNode: OscillatorNode | null = null;
let masterGain: GainNode | null = null;

function initAudio() {
  if (audioCtx) return;
  // Initialize context
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  audioCtx = new AudioContextClass();
  
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime); // low initial volume
  masterGain.connect(audioCtx.destination);
  
  // Create twin-turbo V8 engine idle hum using low-frequency oscillators
  engineOsc1 = audioCtx.createOscillator();
  engineOsc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const engineGain = audioCtx.createGain();

  engineOsc1.type = 'sawtooth';
  engineOsc1.frequency.setValueAtTime(42, audioCtx.currentTime); // very low rumble

  engineOsc2.type = 'square';
  engineOsc2.frequency.setValueAtTime(84, audioCtx.currentTime); // harmonic

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(95, audioCtx.currentTime); // keep it bassy

  // Introduce an LFO to modulate frequency for realistic engine idle pulses
  lfoNode = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfoNode.frequency.setValueAtTime(6.5, audioCtx.currentTime); // 6.5 Hz idle vibration
  lfoGain.gain.setValueAtTime(2.5, audioCtx.currentTime);

  lfoNode.connect(lfoGain);
  lfoGain.connect(engineOsc1.frequency);
  lfoGain.connect(engineOsc2.frequency);

  engineOsc1.connect(filter);
  engineOsc2.connect(filter);
  
  engineGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  filter.connect(engineGain);
  engineGain.connect(masterGain);

  engineOsc1.start();
  engineOsc2.start();
  lfoNode.start();
}

export function startEngineHum() {
  try {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (masterGain) {
      masterGain.gain.setTargetAtTime(0.25, audioCtx!.currentTime, 0.5);
    }
  } catch (err) {
    console.warn('Web Audio could not be started:', err);
  }
}

export function setVolume(volume: number) {
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(volume * 0.4, audioCtx.currentTime, 0.1);
  }
}

export function stopEngineHum() {
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
  }
}

// Synthesizes a crispy searing wok flare sizzle using white noise and highpass filtering
export function playWokSizzle() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 second sizzle
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill buffer with white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.exponentialRampToValueAtTime(12000, audioCtx.currentTime + 0.4);
  filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

  const sizzleGain = audioCtx.createGain();
  sizzleGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  sizzleGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  noiseNode.connect(filter);
  filter.connect(sizzleGain);
  sizzleGain.connect(masterGain || audioCtx.destination);

  noiseNode.start();
}

// Synthesizes an Electric Cosmic pink activation neon discharge sound
export function playNeonChime() {
  try {
    if (!audioCtx) {
      initAudio();
    }
  } catch (e) {
    return;
  }
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;

  // Primary chime oscillator
  const osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880, now); // high pitch
  osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // electric slide up
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.6); // slide down resolution

  // Metallic accent resonance
  const subOsc = audioCtx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(220, now);
  subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.4);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'peaking';
  filter.frequency.setValueAtTime(1200, now);

  const neonGain = audioCtx.createGain();
  neonGain.gain.setValueAtTime(0, now);
  neonGain.gain.linearRampToValueAtTime(0.35, now + 0.05); // sharp onset
  neonGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85); // long glow ring out

  osc.connect(filter);
  subOsc.connect(neonGain);
  filter.connect(neonGain);
  
  neonGain.connect(masterGain || audioCtx.destination);

  osc.start(now);
  subOsc.start(now);
  osc.stop(now + 0.9);
  subOsc.stop(now + 0.9);
}

// Synthesizes a luxury-grade, calculated hardware mechanical transition sound
// Consists of a high-frequency electronic "snap" paired with a solid mechanical low-end "thud"
export function playHardwareThud() {
  // Ensure audio is initialized
  try {
    if (!audioCtx) {
      initAudio();
    }
  } catch (e) {
    return;
  }
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  // 1. Tactile Low-Frequency "Thud" representing premium door-latch mechanical closure
  const thudOsc = audioCtx.createOscillator();
  const thudGain = audioCtx.createGain();
  
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(135, now);
  thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.18); // rapid sub dropdown

  thudGain.gain.setValueAtTime(0.001, now);
  thudGain.gain.linearRampToValueAtTime(0.45, now + 0.008);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  // 2. High-Frequency Electronic Spark/Snap representing laser relays click
  const snapOsc = audioCtx.createOscillator();
  const snapGain = audioCtx.createGain();
  
  snapOsc.type = 'triangle';
  snapOsc.frequency.setValueAtTime(4200, now);
  snapOsc.frequency.exponentialRampToValueAtTime(1500, now + 0.06);

  snapGain.gain.setValueAtTime(0.001, now);
  snapGain.gain.linearRampToValueAtTime(0.14, now + 0.004);
  snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  // Biquad Bandpass filter to sculpt premium electronic snap resonance
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3000, now);
  filter.Q.setValueAtTime(1.8, now);

  thudOsc.connect(thudGain);
  thudGain.connect(masterGain || audioCtx.destination);

  snapOsc.connect(filter);
  filter.connect(snapGain);
  snapGain.connect(masterGain || audioCtx.destination);

  thudOsc.start(now);
  thudOsc.stop(now + 0.35);

  snapOsc.start(now);
  snapOsc.stop(now + 0.12);
}

