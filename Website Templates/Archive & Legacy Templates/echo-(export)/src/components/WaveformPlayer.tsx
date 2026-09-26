import React, { useRef, useEffect, useState } from 'react';
import { Track, SynthPreset } from '../types';
import { MODE_LABEL_CONFIG } from '../config';
import { 
  startPlayback, 
  stopPlayback, 
  isAudioEnginePlaying, 
  getAudioAnalysisData, 
  synthParams, 
  updateSynthParam,
  getAudioContext,
  tryUnlockAudioContext
} from '../utils/audioEngine';
import { Play, Square, Sliders, Activity, AlertCircle, RefreshCw, Timer, Volume2, Download, Copy, Keyboard, History, FolderSync, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PresetSuite } from './PresetSuite';
import { MidiMapHud } from './MidiMapHud';

interface WaveformPlayerProps {
  currentTrack: Track;
  onTrackChanged: (track: Track) => void;
  templateMode?: 'PRODUCER_MATRIX' | 'CREATIVE_ENTERPRENEUR';
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ 
  currentTrack, 
  onTrackChanged,
  templateMode = 'PRODUCER_MATRIX'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState<string>('---');
  const [sampleRate, setSampleRate] = useState<number>(44100);
  const [dspLoad, setDspLoad] = useState<number>(2.4);
  const [visualMode, setVisualMode] = useState<'waveform' | 'spectrum' | 'matrix' | 'waterfall'>('waveform');
  
  // Local copies of parameters to sync sliders immediately
  const [oscType, setOscType] = useState(synthParams.oscillatorType);
  const [cutoff, setCutoff] = useState(synthParams.cutoffFrequency);
  const [resonance, setResonance] = useState(synthParams.resonance);
  const [delayFeedback, setDelayFeedback] = useState(synthParams.delayFeedbackLimit);
  const [tempo, setTempo] = useState(synthParams.tempo);
  const [noise, setNoise] = useState(synthParams.noiseAmount);
  const [masterVolume, setMasterVolume] = useState(synthParams.masterVolume);
  const [isBypassed, setIsBypassed] = useState<boolean>(synthParams.effectsBypassed);
  const [activeModulatedSlider, setActiveModulatedSlider] = useState<string | null>(null);
  
  const handleBypassChange = (bypassed: boolean) => {
    setIsBypassed(bypassed);
    handleParamChange('effectsBypassed', bypassed);
    addBpmHistoryEntry(tempo, bypassed ? 'DSP MASTER EFFECTS BYPASSED' : 'DSP MASTER EFFECTS ENGAGED');
  };
  
  // Real-time BPM and visual metronome/feedback states
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(-1);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [isNudgingUp, setIsNudgingUp] = useState<boolean>(false);
  const [isNudgingDown, setIsNudgingDown] = useState<boolean>(false);
  const [pitchMultiplier, setPitchMultiplier] = useState<number>(1.0);
  
  // BPM Tracker history logging
  const [bpmHistory, setBpmHistory] = useState<Array<{ id: string; time: string; bpm: number; source: string }>>([
    { id: 'init', time: new Date().toLocaleTimeString(), bpm: synthParams.tempo, source: 'ENGINE BOOT' }
  ]);

  const addBpmHistoryEntry = (bpmValue: number, source: string) => {
    setBpmHistory(prev => {
      if (prev.length > 0 && prev[0].bpm === bpmValue && prev[0].source === source) {
        return prev;
      }
      const entry = {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        bpm: bpmValue,
        source: source
      };
      return [entry, ...prev].slice(0, 15);
    });
  };

  // Keyboard shortcut active indicator highlight
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);
  const [showMidiMap, setShowMidiMap] = useState<boolean>(false);
  const [showPresetsOverlay, setShowPresetsOverlay] = useState<boolean>(false);

  // Export panel toggles
  const [showExportPanel, setShowExportPanel] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Ref to hold frequency response history for waterfall Spectrum History
  const spectrumHistoryRef = useRef<Uint8Array[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web Audio Context Autoplay & Unlock state listener
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  useEffect(() => {
    const measureContext = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'running') {
        setAudioUnlocked(true);
      } else {
        setAudioUnlocked(false);
      }
    };

    // Low-overhead periodic sync polling checks the low-level engine status
    const pollId = setInterval(measureContext, 800);

    const unlock = async () => {
      const success = await tryUnlockAudioContext();
      if (success) {
        setAudioUnlocked(true);
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener('click', unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
    };

    window.addEventListener('click', unlock, { capture: true });
    window.addEventListener('touchstart', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });

    measureContext();

    return () => {
      clearInterval(pollId);
      cleanup();
    };
  }, []);

  // Sync state if song changes
  useEffect(() => {
    setTempo(currentTrack.bpm);
    setPitchMultiplier(1.0); // Reset speed factor to normal on track change
    updateSynthParam('tempo', currentTrack.bpm);
    addBpmHistoryEntry(currentTrack.bpm, `LOADED TRACK (${currentTrack.title.toUpperCase()})`);
    
    if (isPlaying) {
      // Re-trigger with new track
      startPlayback(currentTrack, (playing) => {
        setIsPlaying(playing);
      });
    }
  }, [currentTrack]);

  // Sync play states
  useEffect(() => {
    setIsPlaying(isAudioEnginePlaying());
    
    // Initialize Web Audio sample rate if context exists
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const testCtx = new AudioContextClass();
        setSampleRate(testCtx.sampleRate);
        testCtx.close();
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Fluctuations for a fully operational organic technical aesthetic
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setDspLoad(parseFloat((3.2 + Math.random() * 2.1).toFixed(1)));
        if (currentTrack.notes && currentTrack.notes.length > 0) {
          const randomIndex = Math.floor(Math.random() * currentTrack.notes.length);
          setActiveNote(currentTrack.notes[randomIndex].note);
        }
      } else {
        setDspLoad(parseFloat((0.2 + Math.random() * 0.3).toFixed(1)));
        setActiveNote('---');
      }
    }, 400);
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack]);

  // Dynamic visual feedback beat flash interval syncing with current audio playback speed (BPM)
  useEffect(() => {
    if (!isPlaying) {
      setActiveBeatIndex(-1);
      return;
    }

    // Immediately trigger index 0
    setActiveBeatIndex(0);

    let expectedTime = Date.now();
    let timeoutId: number;

    const tick = () => {
      setActiveBeatIndex((prev) => (prev + 1) % 4);
      const intervalTime = (60 * 1000) / tempo;
      expectedTime += intervalTime;
      // Self-correcting clock to keep beat flashing steady
      const drift = Date.now() - expectedTime;
      const nextDelay = Math.max(0, intervalTime - drift);
      timeoutId = window.setTimeout(tick, nextDelay);
    };

    const intervalTime = (60 * 1000) / tempo;
    expectedTime = Date.now() + intervalTime;
    timeoutId = window.setTimeout(tick, intervalTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPlaying, tempo]);

  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].filter(t => now - t < 2500); // Only keep taps within 2.5 seconds
    setTapTimes(newTapTimes);

    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      
      const averageInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const targetBPM = Math.round(60000 / averageInterval);
      
      if (targetBPM >= 60 && targetBPM <= 240) {
        setTempo(targetBPM);
        setPitchMultiplier(parseFloat((targetBPM / currentTrack.bpm).toFixed(2)));
        updateSynthParam('tempo', targetBPM);
        addBpmHistoryEntry(targetBPM, 'MANUAL TAP IN');
      }
    }
  };

  const startNudge = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setIsNudgingUp(true);
      const nudged = Math.round(tempo * 1.05);
      updateSynthParam('tempo', nudged);
      addBpmHistoryEntry(nudged, 'PITCH NUDGE (+)');
    } else {
      setIsNudgingDown(true);
      const nudged = Math.round(tempo * 0.95);
      updateSynthParam('tempo', nudged);
      addBpmHistoryEntry(nudged, 'PITCH NUDGE (-)');
    }
  };

  const stopNudge = () => {
    setIsNudgingUp(false);
    setIsNudgingDown(false);
    updateSynthParam('tempo', tempo); // Restore actual tempo
    addBpmHistoryEntry(tempo, 'NUDGE STABILIZED');
  };

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger hotkeys if user is editing inputs
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' || 
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // SPACE: Play / Pause Toggle
      if (e.code === 'Space') {
        e.preventDefault();
        setActivePressedKey('Space');
        togglePlayback();
        setTimeout(() => setActivePressedKey(null), 200);
      }

      // T: Tap Tempo Rhythm
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setActivePressedKey('T');
        handleTapTempo();
        setTimeout(() => setActivePressedKey(null), 200);
      }

      // r or R: Reset Synthesizer params to defaults
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setActivePressedKey('R');
        handleParamChange('oscillatorType', 'sawtooth');
        handleParamChange('cutoffFrequency', 1200);
        handleParamChange('resonance', 4);
        handleParamChange('delayFeedbackLimit', 0.3);
        handleParamChange('tempo', currentTrack.bpm);
        handleParamChange('noiseAmount', 0.15);
        handleParamChange('masterVolume', 0.4);
        setPitchMultiplier(1.0);
        addBpmHistoryEntry(currentTrack.bpm, 'RESET TO DEFAULT');
        setTimeout(() => setActivePressedKey(null), 200);
      }

      // V: Switch active Visual Mode
      if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setActivePressedKey('V');
        setVisualMode(prev => {
          const modes: Array<'waveform' | 'spectrum' | 'matrix' | 'waterfall'> = ['waveform', 'spectrum', 'matrix', 'waterfall'];
          const idx = modes.indexOf(prev);
          return modes[(idx + 1) % modes.length];
        });
        setTimeout(() => setActivePressedKey(null), 200);
      }

      // O: Toggle Oscillator shapes
      if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setActivePressedKey('O');
        setOscType(prev => {
          const shapes: Array<'sawtooth' | 'square' | 'triangle' | 'sine'> = ['sawtooth', 'square', 'triangle', 'sine'];
          const idx = shapes.indexOf(prev);
          const nextShape = shapes[(idx + 1) % shapes.length];
          handleParamChange('oscillatorType', nextShape);
          return nextShape;
        });
        setTimeout(() => setActivePressedKey(null), 200);
      }

      // [ or ]: Multiplier Nudges
      if (e.key === '[') {
        e.preventDefault();
        setActivePressedKey('[');
        setTempo(p => {
          const next = Math.max(60, p - 1);
          updateSynthParam('tempo', next);
          addBpmHistoryEntry(next, 'DEC TEMPO KEY');
          return next;
        });
        setTimeout(() => setActivePressedKey(null), 200);
      }
      if (e.key === ']') {
        e.preventDefault();
        setActivePressedKey(']');
        setTempo(p => {
          const next = Math.min(240, p + 1);
          updateSynthParam('tempo', next);
          addBpmHistoryEntry(next, 'INC TEMPO KEY');
          return next;
        });
        setTimeout(() => setActivePressedKey(null), 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentTrack, tempo, tapTimes]);

  // Canvas Realtime Animation Frame Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      // Handle resizing cleanly
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Draw subtle tactical grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      const gridSpacing = 20;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw baseline horizontal reference line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const analysis = getAudioAnalysisData();

      if (isPlaying && analysis) {
        const { frequencies, waveform } = analysis;

        // Push spectrum values into history array for the Spectrum History visualizer
        const frame = new Uint8Array(256);
        // Copy frequency data
        for (let i = 0; i < Math.min(256, frequencies.length); i++) {
          frame[i] = frequencies[i];
        }
        spectrumHistoryRef.current.push(frame);
        if (spectrumHistoryRef.current.length > 40) {
          spectrumHistoryRef.current.shift();
        }

        if (visualMode === 'waveform') {
          // 1. Oscilloscope Mode: Draws real-time time-domain signals
          ctx.beginPath();
          ctx.strokeStyle = '#00FF41'; // Terminal green
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#00FF41';

          const sliceWidth = w / waveform.length;
          let x = 0;

          for (let i = 0; i < waveform.length; i++) {
            const v = waveform[i] / 128.0; // range 0 to 2
            const y = (v * h) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        } else if (visualMode === 'spectrum') {
          // 2. Spectrum Bars Mode: Draws real-time bars with glow effects
          const barWidth = (w / frequencies.length) * 1.5;
          let x = 0;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#00F0FF'; // Cyber cyan
          
          for (let i = 0; i < frequencies.length; i++) {
            const barHeight = (frequencies[i] / 255) * h * 0.8;
            
            // Draw dual gradients
            ctx.fillStyle = `rgba(0, 240, 255, ${parseFloat((0.2 + (i / frequencies.length) * 0.8).toFixed(2))})`;
            ctx.fillRect(x, h - barHeight, barWidth - 1.5, barHeight);
            
            // Draw glowing tips
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, h - barHeight, barWidth - 1.5, 2);

            x += barWidth;
          }
          ctx.shadowBlur = 0; // reset
        } else if (visualMode === 'matrix') {
          // 3. Matrix Multi-Band Column Waveform Player (from user requirement visual outline)
          ctx.shadowBlur = 0;
          const barCount = 60;
          const barWidth = w / barCount;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

          for (let i = 0; i < barCount; i++) {
            // Pick index from frequencies sequence
            const freqVal = frequencies[Math.min(frequencies.length - 1, Math.floor((i / barCount) * frequencies.length))];
            const waveVal = waveform[Math.min(waveform.length - 1, Math.floor((i / barCount) * waveform.length))];
            
            const baseAmp = (freqVal / 255) * h * 0.9;
            const detuneOffset = Math.sin(phase * 4 + i * 0.2) * 5;
            const computedHeight = Math.max(4, baseAmp + detuneOffset);

            // Left side dark bar
            ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 255, 65, 0.45)' : 'rgba(0, 255, 65, 0.2)';
            ctx.fillRect(i * barWidth, h / 2 - computedHeight / 2, barWidth - 1.5, computedHeight);
          }
        } else if (visualMode === 'waterfall') {
          // 4. Spectrum History (Waterfall 3D Isometric Ridge Plot)
          ctx.shadowBlur = 0;
          const hist = spectrumHistoryRef.current;
          const histLen = hist.length;

          if (histLen > 0) {
            // Render back-to-front (oldest first to overlap with newer frames closer to foreground)
            for (let step = 0; step < histLen; step++) {
              const frameData = hist[step];
              const ratio = step / (histLen - 1 || 1);
              
              // Map vertical Y base coordinate with depth perspective
              const yBase = h * 0.2 + ratio * h * 0.6;
              const fadeAlpha = 0.15 + ratio * 0.8;
              
              // Color gradient transitioning from dark purple/blue at back to bright neon cyan/green at front
              const colorVal = Math.floor(ratio * 255);
              ctx.strokeStyle = `rgba(${120 - Math.floor(ratio * 120)}, ${55 + Math.floor(ratio * 200)}, ${200 + Math.floor(ratio * 55)}, ${fadeAlpha})`;
              ctx.lineWidth = 1.0 + ratio * 1.5;

              // Perspective compression (narrower at back, wider at front)
              const screenWidthRatio = 0.5 + ratio * 0.45;
              const rowWidth = w * screenWidthRatio;
              const xStart = (w - rowWidth) / 2;

              // Grid points
              const stepCount = 50; 
              ctx.beginPath();

              for (let i = 0; i <= stepCount; i++) {
                // Downsample analysis bins to 50 nodes for high-performance organic ridge outline
                const binIndex = Math.min(frameData.length - 1, Math.floor((i / stepCount) * (frameData.length / 2)));
                const ampVal = frameData[binIndex] / 255;
                
                // Add a bell-curve weight so sides are muted, giving a majestic mountain peaks feeling
                const weight = Math.sin((i / stepCount) * Math.PI);
                const peakHeight = ampVal * h * 0.45 * weight * (0.4 + ratio * 0.6);

                const px = xStart + i * (rowWidth / stepCount);
                const py = yBase - peakHeight;

                if (i === 0) {
                  ctx.moveTo(px, py);
                } else {
                  ctx.lineTo(px, py);
                }
              }

              // Draw solid background layer fill for that stylized opaque mountain depth
              ctx.fillStyle = `rgba(3, 3, 4, ${0.4 + ratio * 0.5})`;
              ctx.lineTo(xStart + rowWidth, yBase);
              ctx.lineTo(xStart, yBase);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
          } else {
            // Empty grid state
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
            ctx.moveTo(w * 0.15, h / 2);
            ctx.lineTo(w * 0.85, h / 2);
            ctx.stroke();
          }
        }
      } else {
        // Idle Animation: Sophisticated computer-designed sine waves blending elegantly
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.01 + phase) * 15 * Math.sin(x * 0.002);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.cos(x * 0.015 - phase * 1.5) * 10 * Math.sin(x * 0.005);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.008 + phase * 0.8) * 6 * Math.cos(x * 0.003 + 2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, visualMode]);

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback((playing) => setIsPlaying(playing));
    } else {
      startPlayback(currentTrack, (playing) => setIsPlaying(playing));
    }
  };

  const handleParamChange = (key: keyof typeof synthParams, value: any) => {
    switch (key) {
      case 'oscillatorType':
        setOscType(value);
        break;
      case 'cutoffFrequency':
        setCutoff(value);
        break;
      case 'resonance':
        setResonance(value);
        break;
      case 'delayFeedbackLimit':
        setDelayFeedback(value);
        break;
      case 'tempo':
        setTempo(value);
        setPitchMultiplier(parseFloat((value / currentTrack.bpm).toFixed(2)));
        break;
      case 'noiseAmount':
        setNoise(value);
        break;
      case 'masterVolume':
        setMasterVolume(value);
        break;
      case 'effectsBypassed':
        setIsBypassed(value);
        break;
    }
    updateSynthParam(key, value);
  };

  const handleApplyPreset = (preset: SynthPreset) => {
    handleParamChange('oscillatorType', preset.oscillatorType);
    handleParamChange('cutoffFrequency', preset.cutoffFrequency);
    handleParamChange('resonance', preset.resonance);
    handleParamChange('delayFeedbackLimit', preset.delayFeedbackLimit);
    handleParamChange('tempo', preset.tempo);
    handleParamChange('noiseAmount', preset.noiseAmount);
    handleParamChange('masterVolume', preset.masterVolume);
    handleParamChange('effectsBypassed', preset.effectsBypassed);
    addBpmHistoryEntry(preset.tempo, `LOADED PRESET (${preset.name.split(': ').pop()?.toUpperCase()})`);
  };

  const getLoopDataJson = () => {
    return JSON.stringify({
      meta: {
        engine: "ECHO DUPLEX SYNTH",
        timestamp: new Date().toISOString(),
        exported_from_web_sdk: true
      },
      source_track: {
        id: currentTrack.id,
        title: currentTrack.title,
        genre: currentTrack.genre,
        native_bpm: currentTrack.bpm
      },
      synthesizer_parameters: {
        oscillator_shape: oscType,
        cutoff_frequency_hz: cutoff,
        filter_resonance_q: resonance,
        delay_feedback_ratio: delayFeedback,
        active_speed_bpm: tempo,
        cyber_noise_level: noise,
        master_volume_gain: masterVolume,
        pitch_multiplier: pitchMultiplier,
        effects_bypassed_active: isBypassed
      },
      grid_sequencer_signature: currentTrack.notes || []
    }, null, 2);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getLoopDataJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `echo_loop_${currentTrack.id}_${tempo}bpm.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addBpmHistoryEntry(tempo, 'EXPORTED CONFIG DOWNLOADED');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getLoopDataJson());
    setCopied(true);
    addBpmHistoryEntry(tempo, 'COPIED TO CLIPBOARD');
    setTimeout(() => setCopied(false), 2000);
  };

  const getMeterDots = (current: number, min: number, max: number, color = "text-[#00FF41]") => {
    const percent = (current - min) / (max - min);
    const totalCount = 5;
    const activeCount = Math.min(totalCount, Math.max(0, Math.round(percent * totalCount)));
    return (
      <span className="font-mono text-[9px] select-none text-stone-700 font-bold bg-[#040405] px-1.5 py-0.5 rounded border border-stone-900/60 flex items-center shrink-0">
        <span className={color}>{'•'.repeat(activeCount)}</span>
        <span className="text-stone-800">{'•'.repeat(totalCount - activeCount)}</span>
      </span>
    );
  };

  return (
    <div id="echo-master-player" className="bg-[#09090b] border border-[#1f1f23] p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden rounded-xl shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
      
      {/* Cyber ambient grid accent lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-24 bg-[#00FF41]/2 opacity-[0.03] pointer-events-none filter blur-2xl" />

      {/* 1. Header Information Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1A1A1A] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_8px_#00FF41]" />
            <span className="text-[#00FF41] text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
              SYS STATUS: {isPlaying ? 'ACTIVE NODE SYNTHESIZER' : 'STANDBY IDLE'}
            </span>
          </div>
          <h2 className="text-white text-2xl font-light tracking-tight flex items-center gap-2">
            {currentTrack.title}
            <span className="text-xs font-mono px-2 py-0.5 border border-[#333] text-stone-400 bg-[#0A0A0A]">
              {currentTrack.genre}
            </span>
          </h2>
        </div>

        {/* Tactical Control Triggers */}
        <div className="flex items-center gap-3">
          <button
            id="play-synth-btn"
            onClick={togglePlayback}
            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isPlaying 
                ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.25)]' 
                : 'border-white bg-transparent text-white hover:bg-white hover:text-black hover:scale-105'
            }`}
            title={isPlaying ? 'Pause Synthesizer' : 'Start Synthesizer'}
          >
            {isPlaying ? (
              <Square className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Sound Visualizer Controls & Stats Header (Real static layout, no overlays) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[10px] text-stone-500 bg-[#010102] p-3 border border-stone-700/60 rounded-t-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] relative z-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            TRACK_ID: <span className="text-stone-300">{currentTrack.id.toUpperCase()}</span>
          </div>
          <div>
            RATE: <span className="text-stone-300">{sampleRate} HZ</span>
          </div>
          <div>
            DSP_LOAD: <span className={isPlaying ? 'text-red-400 font-bold' : 'text-stone-300'}>{dspLoad}%</span>
          </div>
          {isPlaying && (
            <div>
              TRIG_FREQ: <span className="text-emerald-400 font-bold glow-green">{activeNote}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 p-0.5 bg-black/85 rounded border border-stone-850">
          <button
            onClick={() => setVisualMode('waveform')}
            className={`px-2 py-0.5 border text-[9.5px] transition-all cursor-pointer rounded-sm ${
              visualMode === 'waveform' ? 'text-[#00FF41] border-stone-600 bg-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            OSCILLOSCOPE
          </button>
          <button
            onClick={() => setVisualMode('spectrum')}
            className={`px-2 py-0.5 border text-[9.5px] transition-all cursor-pointer rounded-sm ${
              visualMode === 'spectrum' ? 'text-[#00F0FF] border-stone-600 bg-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            SPECTRUM ANALYZER
          </button>
          <button
            onClick={() => setVisualMode('matrix')}
            className={`px-2 py-0.5 border text-[9.5px] transition-all cursor-pointer rounded-sm ${
              visualMode === 'matrix' ? 'text-cyan-400 border-stone-600 bg-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            MATRIX BARS
          </button>
          <button
            onClick={() => setVisualMode('waterfall')}
            className={`px-2 py-0.5 border text-[9.5px] transition-all cursor-pointer rounded-sm ${
              visualMode === 'waterfall' ? 'text-[#C084FC] border-stone-600 bg-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            SPECTRUM HISTORY
          </button>
        </div>
      </div>

      {/* 2b. Sound Visualizer Waveform Screen */}
      <div className="relative bg-black border-x border-b border-stone-700/60 rounded-b-lg shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
        {/* Decorative corner brackets for cyber tech mood */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-stone-700" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-stone-700" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-stone-700" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-stone-700" />

        {/* HTML5 drawing surface (explicitly no absolute text string overlays) */}
        <canvas 
          ref={canvasRef} 
          className="w-full h-44 cursor-pointer block rounded-b-lg filter saturate-150"
          title="Dynamic sound visualization grid" 
        />

        {/* Style-paired high-visibility banner warning for blocked autoplay or lack of permissions */}
        {!audioUnlocked && templateMode === 'PRODUCER_MATRIX' && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/90 backdrop-blur-xs text-center p-4 rounded-b-lg border border-red-500/30 font-mono z-30">
            <Volume2 className="w-8 h-8 text-red-500 mb-2 animate-pulse" />
            <span className="text-[#00FF41] text-xs font-bold tracking-[0.2em] uppercase">SYSTEM AUDIO STATE: SUSPENDED</span>
            <div className="mt-3 px-4 py-2 bg-gradient-to-r from-red-950/40 to-red-900/40 border border-red-500/60 text-white text-[11px] font-bold rounded-sm uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none animate-pulse">
              TAP ANYWHERE TO INITIALIZE AUDIO ENGINE
            </div>
            <p className="text-stone-500 text-[8.5px] mt-2.5 uppercase tracking-wide leading-normal max-w-sm">
              Standard secure policy requires user interaction on this node to activate synthesis.
            </p>
          </div>
        )}
        
        {/* Visual Cue overlay with delay trigger alert */}
        {audioUnlocked && !isPlaying && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 backdrop-blur-[1px] pointer-events-none text-center p-4 rounded-b-lg">
            <Activity className="w-6 h-6 text-stone-600 mb-2 animate-pulse" />
            <span className="text-stone-400 text-xs tracking-wider uppercase font-mono">Web Audio Engine Inactive</span>
            <span className="text-stone-600 text-[10px] font-mono mt-1">CLICK PLAY BUTTON TO INITIALIZE REAL SYNTACTIC SEQUENCER</span>
          </div>
        )}
      </div>

      {/* 2c. Real-Time BPM & Tempo Synchronization Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#050507] border border-[#141416] p-5 rounded-lg">
        
        {/* Segment A: Current BPM counter readout */}
        <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#151518] pb-4 md:pb-0 pr-0 md:pr-4">
          <div className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#00FF41]" />
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold">01. TEMPO READOUT</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl lg:text-4xl font-mono font-bold text-white tracking-widest glow-green select-all">
              {tempo}
            </span>
            <span className="text-xs text-stone-500 font-mono">BPM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00FF41] animate-ping' : 'bg-stone-700'}`} />
            <span className="text-[9px] font-mono text-stone-400 uppercase tracking-tight">
              {isPlaying ? `PITCH RATE: ${pitchMultiplier.toFixed(2)}x` : 'SOUND ENGINE STOPPED'}
            </span>
          </div>
        </div>

        {/* Segment B: Beat metronome & Tap button */}
        <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#151518] pb-4 md:pb-0 px-0 md:px-4">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold">02. BEAT METRONOME</span>
          <div className="flex items-center gap-1.5 my-2">
            {[0, 1, 2, 3].map((stepIndex) => {
              const isActive = activeBeatIndex === stepIndex;
              return (
                <div
                  key={stepIndex}
                  className={`flex-1 h-6 flex items-center justify-center font-mono text-[9px] border font-bold rounded transition-all duration-75 ${
                    isActive
                      ? 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                      : 'bg-[#08080c] border-[#18181c] text-stone-600'
                  }`}
                >
                  B{stepIndex + 1}
                </div>
              );
            })}
          </div>
          <button
            onClick={handleTapTempo}
            className="w-full py-1.5 border border-stone-800 bg-stone-900/60 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono font-bold uppercase rounded transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-1.5"
            title="Tap repeatedly in rhythm to set tempo"
          >
            <span>⌨ TAP TEMPO</span>
            {tapTimes.length > 0 && isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            )}
          </button>
        </div>

        {/* Segment C: Fine pitch fader & Nudge adjustments */}
        <div className="md:col-span-4 flex flex-col justify-between pl-0 md:pl-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold">03. PITCH DECK</span>
            
            {/* Quick Speed Multipliers */}
            <div className="flex gap-1">
              {([0.5, 1.0, 1.5, 2.0] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setPitchMultiplier(r);
                    const newBPM = Math.round(currentTrack.bpm * r);
                    setTempo(newBPM);
                    updateSynthParam('tempo', newBPM);
                  }}
                  className={`px-1 py-0.2 border text-[8px] font-mono rounded-sm cursor-pointer uppercase ${
                    pitchMultiplier === r
                      ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5 font-bold'
                      : 'border-stone-850 text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {r.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>
          
          {/* Fine pitch feedback & slider */}
          <div className="flex items-center gap-2 my-1">
            <span className="text-[8px] font-mono text-stone-600 min-w-[20px]">-25%</span>
            <input
              type="range"
              min="-25"
              max="25"
              step="0.5"
              value={Math.round((pitchMultiplier - 1.0) * 100)}
              onChange={(e) => {
                const pct = Number(e.target.value);
                const mult = 1 + pct / 100;
                const newBPM = Math.round(currentTrack.bpm * mult);
                setPitchMultiplier(parseFloat(mult.toFixed(2)));
                setTempo(newBPM);
                updateSynthParam('tempo', newBPM);
              }}
              className="flex-1 accent-[#00F0FF] bg-stone-950 h-1.5 rounded cursor-pointer"
              title="Drag to adjust fine-pitch playback speed rate"
            />
            <span className="text-[8px] font-mono text-stone-600 min-w-[20px] text-right">+25%</span>
          </div>

          <div className="flex gap-1.5 mt-2">
            <button
              onMouseDown={() => startNudge('down')}
              onMouseUp={stopNudge}
              onMouseLeave={stopNudge}
              onTouchStart={() => startNudge('down')}
              onTouchEnd={stopNudge}
              className={`flex-1 py-1 border text-[9px] font-mono rounded font-bold uppercase transition-all select-none cursor-pointer ${
                isNudgingDown
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
              }`}
              title="Hold to temporarily slow tempo slightly (Pitch Bend)"
            >
              NUDGE -
            </button>
            
            <button
              onClick={() => {
                setPitchMultiplier(1.0);
                setTempo(currentTrack.bpm);
                updateSynthParam('tempo', currentTrack.bpm);
              }}
              className="px-2 py-1 border border-stone-800 bg-stone-900/40 text-stone-500 hover:text-stone-300 text-[8px] font-mono rounded uppercase"
              title="Reset to default native track BPM"
            >
              RESET
            </button>

            <button
              onMouseDown={() => startNudge('up')}
              onMouseUp={stopNudge}
              onMouseLeave={stopNudge}
              onTouchStart={() => startNudge('up')}
              onTouchEnd={stopNudge}
              className={`flex-1 py-1 border text-[9px] font-mono rounded font-bold uppercase transition-all select-none cursor-pointer ${
                isNudgingUp
                  ? 'bg-[#00FF41]/20 border-[#00FF41] text-[#00FF41] shadow-[0_0_5px_rgba(0,255,65,0.3)]'
                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
              }`}
              title="Hold to temporarily speed up tempo slightly (Pitch Bend)"
            >
              NUDGE +
            </button>
          </div>
        </div>

      </div>

      {/* 2d. BPM Tracker Historical Telemetry & Loop Exporter Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-[#050507] border border-[#141416] p-5 rounded-lg">
        {/* Left: BPM History / Tracker Log */}
        <div className="lg:col-span-8 flex flex-col justify-between opacity-40 select-none">
          <div className="flex items-center justify-between border-b border-[#141415] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-stone-600" />
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-tight font-light">REAL-TIME TEMPO DRIFT & BPM TRACKER</span>
            </div>
            <span className="text-[8px] font-mono text-stone-600 uppercase font-light tracking-tight">SYS_LOG_HEURISTIC_OK</span>
          </div>

          <div className="h-28 overflow-y-auto pr-2 custom-scrollbar space-y-1.5 font-mono text-[9px] tracking-tight">
            {bpmHistory.map((item) => {
              const diff = item.bpm - currentTrack.bpm;
              const diffStr = diff === 0 ? '±0' : diff > 0 ? `+${diff}` : `${diff}`;
              return (
                <div key={item.id} className="flex items-center justify-between p-1.5 rounded bg-stone-950/20 border border-stone-900/40 text-stone-500 font-light">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-stone-600 font-light">{item.time}</span>
                    <span className="text-stone-500 uppercase font-light text-[8.5px]">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-600 font-light">DRIFT: <span className="text-stone-500">{diffStr} BPM</span></span>
                    <span className="text-stone-500 font-light px-1.5 py-0.2 bg-black/30 rounded border border-stone-900">{item.bpm} BPM</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[8.5px] font-mono text-stone-500 mt-2">
            Tracks physical deviations relative to {currentTrack.title}'s master benchmark rate ({currentTrack.bpm} BPM).
          </p>
        </div>

        {/* Right: Export Loop Data & Utility Suite */}
        <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#151518] pt-4 lg:pt-0 pl-0 lg:pl-4">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-bold mb-2">04. EXPORT & UTILITY SYSTEM</span>
          
          <div className="space-y-2">
            <button
              onClick={() => setShowExportPanel(!showExportPanel)}
              className="w-full py-2 px-3 bg-stone-900 hover:bg-[#00F0FF]/10 text-stone-200 hover:text-[#00F0FF] border border-stone-800 hover:border-[#00F0FF]/40 text-[10px] font-mono font-bold uppercase rounded transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT LOOP DATA</span>
              </span>
              <span className="text-[8.5px] px-1 bg-stone-950 text-stone-500 group-hover:text-[#00F0FF]">JSON</span>
            </button>

            {/* Quick hotkeys summary */}
            <div className="bg-stone-950/60 p-2.5 rounded border border-stone-900 font-mono text-[8.5px] text-stone-500 leading-tight space-y-1">
              <div className="flex items-center gap-1 text-[9px] text-stone-400 font-bold mb-1">
                <Keyboard className="w-3 h-3 text-[#00FF41]" />
                <span>HOTKEYS INSTANT HUD</span>
              </div>
              <div className="flex justify-between items-center">
                <span>[SPACE] Toggle Play/Pause</span>
                <span className={`px-1 bg-stone-900 border border-stone-800 text-[8px] rounded ${activePressedKey === 'Space' ? 'text-[#00FF41] border-[#00FF41] font-bold' : ''}`}>ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>[ T ] Tap Tempo Counter</span>
                <span className={`px-1 bg-stone-900 border border-stone-800 text-[8px] rounded ${activePressedKey === 'T' ? 'text-[#00F0FF] border-[#00F0FF] font-bold' : ''}`}>TAP</span>
              </div>
              <div className="flex justify-between items-center">
                <span>[ V ] Cycle Visual Mode</span>
                <span className={`px-1 bg-stone-900 border border-stone-800 text-[8px] rounded ${activePressedKey === 'V' ? 'text-purple-400 border-purple-400 font-bold' : ''}`}>MODE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>[ O ] Toggle Osc Shape</span>
                <span className={`px-1 bg-stone-900 border border-stone-800 text-[8px] rounded ${activePressedKey === 'O' ? 'text-amber-400 border-amber-400 font-bold' : ''}`}>OSC</span>
              </div>
              <div className="flex justify-between items-center">
                <span>[ [ / ] ] Fine Pitch Offset</span>
                <span className={`px-1 bg-stone-900 border border-stone-800 text-[8px] rounded ${activePressedKey === '[' || activePressedKey === ']' ? 'text-teal-400 border-teal-400 font-bold' : ''}`}>PITCH</span>
              </div>
              <div className="pt-2 border-t border-stone-900/40 mt-1.5 flex flex-col gap-1.5">
                <button
                  id="launch-midi-hud-fader-btn"
                  onClick={() => setShowMidiMap(true)}
                  className="w-full py-1.5 bg-stone-900 hover:bg-[#00FF41]/10 text-stone-300 hover:text-[#00FF41] border border-stone-850 hover:border-[#00FF41]/30 text-[8.5px] font-mono tracking-widest uppercase rounded flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Launch full hardware CC routing chart and keyboard maps"
                >
                  <Keyboard className="w-3 h-3 text-[#00FF41]" />
                  <span>OPEN MIDI CC MAP HUD</span>
                </button>
                <button
                  id="launch-preset-suite-btn"
                  onClick={() => setShowPresetsOverlay(true)}
                  className="w-full py-1.5 md:hidden bg-stone-900 hover:bg-[#a855f7]/10 text-stone-300 hover:text-[#a855f7] border border-stone-850 hover:border-[#a855f7]/30 text-[8.5px] font-mono tracking-widest uppercase rounded flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Launch premium preset selection and local storage capture suite"
                >
                  <FolderSync className="w-3 h-3 text-[#a855f7]" />
                  <span>OPEN PRESETS BANK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2e. Expandable JSON Export Drawer Interface */}
      <AnimatePresence>
        {showExportPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-black border border-stone-850 rounded-lg p-4 font-mono text-xs text-stone-300 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <span className="text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider">LOOP METADATA DESCRIPTOR (EXPORT CONFIG)</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="px-2 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-[9px] text-stone-300 hover:text-white rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="px-2 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-[#00F0FF] text-[9px] text-[#00F0FF] rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3 h-3" />
                  <span>DOWNLOAD .JSON</span>
                </button>
              </div>
            </div>
            
            <pre className="p-3 bg-[#030304] border border-stone-950 rounded text-[9.5px] text-emerald-400 max-h-56 overflow-y-auto custom-scrollbar select-all leading-normal whitespace-pre">
              {getLoopDataJson()}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Parameter Synthesizer Rack Controls */}
      <div className="bg-black border border-stone-700/60 p-4 lg:p-5 rounded-lg flex flex-col gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#181818] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-400" />
            <span className="text-white text-xs font-mono tracking-wider uppercase">
              {MODE_LABEL_CONFIG[templateMode].parameterRackTitle}
            </span>
          </div>
          
          {/* A/B Test Deck master dry/wet bypass toggle */}
          <div className="flex items-center gap-1.5 bg-stone-950 p-1 border border-stone-850 rounded">
            <span className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest font-bold px-1.5">A/B TEST DECK:</span>
            <button
              id="ab-test-wet-btn"
              onClick={() => handleBypassChange(false)}
              className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer uppercase ${
                !isBypassed 
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/35 font-bold shadow-[0_0_8px_rgba(0,255,65,0.08)]' 
                  : 'text-stone-500 border border-transparent hover:text-stone-300'
              }`}
              title="Compare with processed DSP audio effects active"
            >
              WET (PROCESSED)
            </button>
            <button
              id="ab-test-dry-btn"
              onClick={() => handleBypassChange(true)}
              className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer uppercase ${
                isBypassed 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/35 font-bold shadow-[0_0_8px_rgba(245,158,11,0.08)]' 
                  : 'text-stone-500 border border-transparent hover:text-stone-300'
              }`}
              title="Compare with clean raw bypassed sound"
            >
              DRY (BYPASS)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 divide-y divide-[#151515] md:divide-y-0">
          
          {/* A. Oscillator Configuration Row */}
          <div className="flex justify-between items-center py-2 text-[11px] font-mono w-full">
            <span className="text-stone-400 uppercase tracking-wide">01. OSC SHAPE</span>
            <div className="flex items-center gap-1">
              <span className="text-[#00FF41] font-bold mr-2 uppercase text-[10px]">{oscType}</span>
              <div className="flex gap-0.5 border border-[#1e1e1e] p-0.5 bg-black rounded">
                {(['sawtooth', 'square', 'triangle', 'sine'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleParamChange('oscillatorType', type)}
                    className={`px-2 py-1 text-[9px] font-mono transition-all cursor-pointer uppercase rounded-sm ${
                      oscType === type 
                        ? 'bg-[#00FF41]/10 text-[#00FF41] font-bold' 
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {type.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* B. Biquad Filter Cutoff Row */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 text-[11px] font-mono w-full gap-2 sm:gap-4 px-2 border border-transparent transition-all duration-300 rounded ${activeModulatedSlider === 'cutoff' ? 'dsp-pulse-cyan' : ''}`}>
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
              <span className="text-stone-400 uppercase tracking-wide">02. FILTER CUTOFF</span>
              <div className="flex items-center gap-2 sm:hidden">
                {getMeterDots(cutoff, 100, 8000)}
                <span className="text-[#00FF41] font-bold text-right">{cutoff} Hz</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 min-w-[125px] justify-end">
                {getMeterDots(cutoff, 100, 8000)}
                <span className="text-[#00FF41] font-bold text-right">{cutoff} Hz</span>
              </div>
              <input
                id="filter-cutoff-range"
                type="range"
                min="100"
                max="8000"
                step="50"
                value={cutoff}
                onChange={(e) => handleParamChange('cutoffFrequency', Number(e.target.value))}
                onMouseDown={() => setActiveModulatedSlider('cutoff')}
                onMouseUp={() => setActiveModulatedSlider(null)}
                onTouchStart={() => setActiveModulatedSlider('cutoff')}
                onTouchEnd={() => setActiveModulatedSlider(null)}
                onFocus={() => setActiveModulatedSlider('cutoff')}
                onBlur={() => setActiveModulatedSlider(null)}
                className="w-full sm:w-44 accent-[#00FF41] bg-[#0c0c0e] h-6 sm:h-2 rounded-md sm:rounded cursor-pointer border border-[#1a1a1a] shadow-inner"
              />
            </div>
          </div>

          {/* C. Filter Resonance Row */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 text-[11px] font-mono w-full gap-2 sm:gap-4 px-2 border border-transparent transition-all duration-300 rounded ${activeModulatedSlider === 'resonance' ? 'dsp-pulse-green' : ''}`}>
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
              <span className="text-stone-400 uppercase tracking-wide">03. FILTER RESONANCE (Q)</span>
              <div className="flex items-center gap-2 sm:hidden">
                {getMeterDots(resonance, 1, 20)}
                <span className="text-stone-300 font-bold text-right">{resonance}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 min-w-[110px] justify-end">
                {getMeterDots(resonance, 1, 20)}
                <span className="text-stone-300 font-bold text-right">{resonance}</span>
              </div>
              <input
                id="filter-q-range"
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={resonance}
                onChange={(e) => handleParamChange('resonance', Number(e.target.value))}
                onMouseDown={() => setActiveModulatedSlider('resonance')}
                onMouseUp={() => setActiveModulatedSlider(null)}
                onTouchStart={() => setActiveModulatedSlider('resonance')}
                onTouchEnd={() => setActiveModulatedSlider(null)}
                onFocus={() => setActiveModulatedSlider('resonance')}
                onBlur={() => setActiveModulatedSlider(null)}
                className="w-full sm:w-44 accent-[#00FF41] bg-[#0c0c0e] h-6 sm:h-2 rounded-md sm:rounded cursor-pointer border border-[#1a1a1a] shadow-inner"
              />
            </div>
          </div>

          {/* D. Delay Feedback Row */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 text-[11px] font-mono w-full gap-2 sm:gap-4 px-2 border border-transparent transition-all duration-300 rounded ${activeModulatedSlider === 'delay' ? 'dsp-pulse-amber' : ''}`}>
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
              <span className="text-stone-400 uppercase tracking-wide">04. DELAY FEEDBACK</span>
              <div className="flex items-center gap-2 sm:hidden">
                {getMeterDots(delayFeedback, 0.0, 0.9, "text-emerald-400")}
                <span className="text-stone-300 font-bold text-right">{Math.round(delayFeedback * 100)} %</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 min-w-[110px] justify-end">
                {getMeterDots(delayFeedback, 0.0, 0.9, "text-emerald-400")}
                <span className="text-stone-300 font-bold text-right">{Math.round(delayFeedback * 100)} %</span>
              </div>
              <input
                id="delay-feedback-range"
                type="range"
                min="0.0"
                max="0.9"
                step="0.05"
                value={delayFeedback}
                onChange={(e) => handleParamChange('delayFeedbackLimit', Number(e.target.value))}
                onMouseDown={() => setActiveModulatedSlider('delay')}
                onMouseUp={() => setActiveModulatedSlider(null)}
                onTouchStart={() => setActiveModulatedSlider('delay')}
                onTouchEnd={() => setActiveModulatedSlider(null)}
                onFocus={() => setActiveModulatedSlider('delay')}
                onBlur={() => setActiveModulatedSlider(null)}
                className="w-full sm:w-44 accent-emerald-500 bg-[#0c0c0e] h-6 sm:h-2 rounded-md sm:rounded cursor-pointer border border-[#1a1a1a] shadow-inner"
              />
            </div>
          </div>

          {/* E. Cyber Noise Grunge Row */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 text-[11px] font-mono w-full gap-2 sm:gap-4 px-2 border border-transparent transition-all duration-300 rounded ${activeModulatedSlider === 'noise' ? 'dsp-pulse-purple' : ''}`}>
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
              <span className="text-stone-400 uppercase tracking-wide">05. CYBER NOISE GRUNGE</span>
              <div className="flex items-center gap-2 sm:hidden">
                {getMeterDots(noise, 0.00, 0.40, "text-[#00FF41]")}
                <span className="text-stone-300 font-bold text-right">{Math.round(noise * 100)} %</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 min-w-[110px] justify-end">
                {getMeterDots(noise, 0.00, 0.40, "text-[#00FF41]")}
                <span className="text-stone-300 font-bold text-right">{Math.round(noise * 100)} %</span>
              </div>
              <input
                id="cyber-noise-range"
                type="range"
                min="0.00"
                max="0.40"
                step="0.01"
                value={noise}
                onChange={(e) => handleParamChange('noiseAmount', Number(e.target.value))}
                onMouseDown={() => setActiveModulatedSlider('noise')}
                onMouseUp={() => setActiveModulatedSlider(null)}
                onTouchStart={() => setActiveModulatedSlider('noise')}
                onTouchEnd={() => setActiveModulatedSlider(null)}
                onFocus={() => setActiveModulatedSlider('noise')}
                onBlur={() => setActiveModulatedSlider(null)}
                className="w-full sm:w-44 accent-[#00FF41] bg-[#0c0c0e] h-6 sm:h-2 rounded-md sm:rounded cursor-pointer border border-[#1a1a1a] shadow-inner"
              />
            </div>
          </div>

          {/* F. Master Volume Gain Control Row */}
          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 text-[11px] font-mono w-full gap-2 sm:gap-4 px-2 border border-transparent transition-all duration-300 rounded ${activeModulatedSlider === 'volume' ? 'dsp-pulse-green' : ''}`}>
            <div className="flex justify-between items-center w-full sm:w-auto gap-2">
              <span className="text-stone-400 uppercase tracking-wide font-bold text-[#00FF41]">06. MASTER VOLUME GAIN</span>
              <div className="flex items-center gap-2 sm:hidden">
                {getMeterDots(masterVolume, 0.0, 1.0, "text-[#00FF41]")}
                <span className="text-[#00FF41] font-bold text-right">{Math.round(masterVolume * 100)} %</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 min-w-[110px] justify-end">
                {getMeterDots(masterVolume, 0.0, 1.0, "text-[#00FF41]")}
                <span className="text-[#00FF41] font-bold text-right">{Math.round(masterVolume * 100)} %</span>
              </div>
              <input
                id="master-volume-range"
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={masterVolume}
                onChange={(e) => handleParamChange('masterVolume', Number(e.target.value))}
                onMouseDown={() => setActiveModulatedSlider('volume')}
                onMouseUp={() => setActiveModulatedSlider(null)}
                onTouchStart={() => setActiveModulatedSlider('volume')}
                onTouchEnd={() => setActiveModulatedSlider(null)}
                onFocus={() => setActiveModulatedSlider('volume')}
                onBlur={() => setActiveModulatedSlider(null)}
                className="w-full sm:w-44 accent-[#00FF41] bg-[#0c0c0e] h-6 sm:h-2 rounded-md sm:rounded cursor-pointer border border-[#1a1a1a] shadow-inner"
                title="Configurable Master volume gain level"
              />
            </div>
          </div>

        </div>

        {/* Manual sequencer note trigger section */}
        <div className="mt-2 pt-3 border-t border-[#141414] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
            <AlertCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span>Interactive Node Synth allows on-the-fly hardware parameters sweep during playback.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-stone-500 uppercase">TEMPO/BPM</span>
              <input
                id="synth-tempo-input"
                type="number"
                min="60"
                max="240"
                value={tempo}
                onChange={(e) => handleParamChange('tempo', Number(e.target.value))}
                className="w-16 px-2 py-0.5 border border-stone-800 bg-[#050505] text-[#00FF41] font-mono text-xs font-bold text-center rounded focus:outline-none focus:border-[#00FF41]/40"
              />
            </div>
            <button
              id="reset-synth-params-btn"
              onClick={() => {
                handleBypassChange(false);
                handleParamChange('oscillatorType', 'sawtooth');
                handleParamChange('cutoffFrequency', 1200);
                handleParamChange('resonance', 4);
                handleParamChange('delayFeedbackLimit', 0.3);
                handleParamChange('tempo', currentTrack.bpm);
                handleParamChange('noiseAmount', 0.15);
                handleParamChange('masterVolume', 0.4);
                setPitchMultiplier(1.0);
                addBpmHistoryEntry(currentTrack.bpm, 'RESET TO DEFAULT');
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-400 border border-stone-800 text-[10px] font-mono rounded hover:text-white hover:bg-neutral-800 cursor-pointer"
              title="Reset synthesizer to system default"
            >
              <RefreshCw className="w-3 h-3" />
              RESET DSP
            </button>
          </div>
        </div>
      </div>

      {/* 4. Preset Management Suite */}
      <div className="hidden md:block">
        <PresetSuite
          currentOscillatorType={oscType}
          currentCutoffFrequency={cutoff}
          currentResonance={resonance}
          currentDelayFeedbackLimit={delayFeedback}
          currentTempo={tempo}
          currentNoiseAmount={noise}
          currentMasterVolume={masterVolume}
          currentEffectsBypassed={isBypassed}
          onApplyPreset={handleApplyPreset}
        />
      </div>

      {/* Mobile Preset Overlay Modal */}
      <AnimatePresence>
        {showPresetsOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-0 md:hidden overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full h-full min-h-screen p-5 overflow-y-auto bg-[#030304] flex flex-col justify-start gap-4"
            >
              <button
                id="close-presets-mobile-overlay"
                onClick={() => setShowPresetsOverlay(false)}
                className="fixed top-4 right-4 z-[60] p-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold border-2 border-white rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
                title="Close Presets Suite"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              
              <div className="mt-14 shrink-0">
                <div className="text-center pb-2 border-b border-stone-900">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-[0.3em]">PRESET SUITE DECK</span>
                  <p className="text-[10px] font-mono text-stone-500 mt-1">MOBILE STORAGE & INSTRUMENT PROFILES</p>
                </div>
              </div>

              <div className="flex-1">
                <PresetSuite
                  currentOscillatorType={oscType}
                  currentCutoffFrequency={cutoff}
                  currentResonance={resonance}
                  currentDelayFeedbackLimit={delayFeedback}
                  currentTempo={tempo}
                  currentNoiseAmount={noise}
                  currentMasterVolume={masterVolume}
                  currentEffectsBypassed={isBypassed}
                  onApplyPreset={(p) => {
                    handleApplyPreset(p);
                  }}
                />
              </div>

              <div className="mt-8 pb-8">
                <button
                  onClick={() => setShowPresetsOverlay(false)}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-purple-400 hover:text-white font-mono text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                >
                  RETURN TO INSTRUMENT PANEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MIDI Mapping CC HUD Overlay */}
      <MidiMapHud
        isOpen={showMidiMap}
        onClose={() => setShowMidiMap(false)}
        activePressedKey={activePressedKey}
        cutoff={cutoff}
        resonance={resonance}
        delayFeedback={delayFeedback}
        noise={noise}
        masterVolume={masterVolume}
        tempo={tempo}
      />
    </div>
  );
};
