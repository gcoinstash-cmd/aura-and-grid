import React, { useState, useEffect } from 'react';
import { SynthPreset } from '../types';
import { Save, Trash2, FolderSync, CheckCircle2, Sliders, Music, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PREMIUM_PRESETS: SynthPreset[] = [
  {
    id: 'prem_01',
    name: 'Preset 01: Vault Drone',
    oscillatorType: 'sawtooth',
    cutoffFrequency: 350,
    resonance: 14,
    delayFeedbackLimit: 0.75,
    tempo: 92,
    noiseAmount: 0.32,
    masterVolume: 0.50,
    effectsBypassed: false,
    description: 'Heavy low sub-harmonic industrial drone with dense, spacious delay reflections and subtle analog grunge.',
    isCustom: false
  },
  {
    id: 'prem_02',
    name: 'Preset 02: Industrial Drift',
    oscillatorType: 'square',
    cutoffFrequency: 900,
    resonance: 8,
    delayFeedbackLimit: 0.45,
    tempo: 128,
    noiseAmount: 0.38,
    masterVolume: 0.45,
    effectsBypassed: false,
    description: 'Noisy, saturated square wave pulsing at active mid-tempo. Excels in cold warehouse aesthetics.',
    isCustom: false
  },
  {
    id: 'prem_03',
    name: 'Preset 03: Acid Spike',
    oscillatorType: 'sawtooth',
    cutoffFrequency: 2100,
    resonance: 17.5,
    delayFeedbackLimit: 0.30,
    tempo: 135,
    noiseAmount: 0.12,
    masterVolume: 0.40,
    effectsBypassed: false,
    description: 'High-frequency screaming sawtooth with aggressive filter resonance. Classic 303 bass-line resonance.',
    isCustom: false
  },
  {
    id: 'prem_04',
    name: 'Preset 04: Dream Sine',
    oscillatorType: 'sine',
    cutoffFrequency: 650,
    resonance: 2.5,
    delayFeedbackLimit: 0.80,
    tempo: 82,
    noiseAmount: 0.02,
    masterVolume: 0.55,
    effectsBypassed: false,
    description: 'Minimal flute-like pure frequency reflections drifting in an endless, feedback-looped acoustic room.',
    isCustom: false
  }
];

interface PresetSuiteProps {
  currentOscillatorType: 'sawtooth' | 'square' | 'triangle' | 'sine';
  currentCutoffFrequency: number;
  currentResonance: number;
  currentDelayFeedbackLimit: number;
  currentTempo: number;
  currentNoiseAmount: number;
  currentMasterVolume: number;
  currentEffectsBypassed: boolean;
  onApplyPreset: (preset: SynthPreset) => void;
}

export const PresetSuite: React.FC<PresetSuiteProps> = ({
  currentOscillatorType,
  currentCutoffFrequency,
  currentResonance,
  currentDelayFeedbackLimit,
  currentTempo,
  currentNoiseAmount,
  currentMasterVolume,
  currentEffectsBypassed,
  onApplyPreset
}) => {
  const [customPresets, setCustomPresets] = useState<SynthPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('prem_01');
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loadNotice, setLoadNotice] = useState<string | null>(null);

  // Load custom presets on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('echo_user_presets');
      if (stored) {
        setCustomPresets(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load presets from local storage', e);
    }
  }, []);

  const allPresets = [...PREMIUM_PRESETS, ...customPresets];
  const activePreset = allPresets.find(p => p.id === selectedPresetId) || PREMIUM_PRESETS[0];

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: SynthPreset = {
      id: `custom_${Date.now()}`,
      name: newPresetName.trim().slice(0, 32),
      oscillatorType: currentOscillatorType,
      cutoffFrequency: currentCutoffFrequency,
      resonance: currentResonance,
      delayFeedbackLimit: currentDelayFeedbackLimit,
      tempo: currentTempo,
      noiseAmount: currentNoiseAmount,
      masterVolume: currentMasterVolume,
      effectsBypassed: currentEffectsBypassed,
      isCustom: true,
      description: `User-defined hardware profile, saved on ${new Date().toLocaleDateString()}`
    };

    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    localStorage.setItem('echo_user_presets', JSON.stringify(updated));
    setSelectedPresetId(newPreset.id);
    setNewPresetName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem('echo_user_presets', JSON.stringify(updated));
    if (selectedPresetId === id) {
      setSelectedPresetId(PREMIUM_PRESETS[0].id);
    }
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = allPresets.find(p => p.id === id);
    if (preset) {
      onApplyPreset(preset);
      setLoadNotice(`Preset "${preset.name.split(': ').pop()}" Applied`);
      setTimeout(() => setLoadNotice(null), 2500);
    }
  };

  return (
    <div id="echo-preset-suite-container" className="bg-[#030304] border border-[#141417] p-4 lg:p-5 rounded-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#181818] pb-3">
        <div className="flex items-center gap-2">
          <FolderSync className="w-4 h-4 text-[#00FF41]" />
          <span className="text-white text-xs font-mono tracking-wider uppercase">Preset Saving Suite</span>
        </div>
        <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest bg-[#00FF41]/5 px-2 py-0.5 rounded border border-[#00FF41]/10">
          BANK STATUS: {allPresets.length} SLOTS
        </div>
      </div>

      {/* Selector & Details Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Dropdown selectors */}
        <div className="md:col-span-5 flex flex-col gap-3 justify-between">
          <div className="space-y-1">
            <label className="text-[9px] font-mono text-stone-500 uppercase tracking-wide">Select Preset Profile</label>
            <div className="relative">
              <select
                id="echo-preset-select-dropdown"
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full bg-[#08080a] border border-[#222227] text-white font-mono text-xs p-2.5 rounded focus:outline-none focus:border-[#00FF41] cursor-pointer"
              >
                <optgroup label="PREMIUM DEFAULT BANK">
                  {PREMIUM_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                {customPresets.length > 0 && (
                  <optgroup label="USER SAVED BANK">
                    {customPresets.map((p) => (
                      <option key={p.id} value={p.id}>
                        ★ {p.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Quick Stats display of Active Selected preset */}
          <div className="bg-black/60 p-3 border border-[#16161a] rounded font-mono text-[10px] space-y-2">
            <span className="text-stone-500 uppercase text-[8px] tracking-widest block mb-1">Active Preset State Parameters</span>
            <div className="grid grid-cols-2 gap-2 text-stone-300">
              <div className="flex items-center gap-1.5 justify-between border-b border-stone-900 pb-1">
                <span className="text-stone-500">TYPE:</span>
                <span className="text-[#00FF41] font-bold uppercase">{activePreset.oscillatorType}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-between border-b border-stone-900 pb-1">
                <span className="text-stone-500">CUTOFF:</span>
                <span className="text-white">{activePreset.cutoffFrequency} Hz</span>
              </div>
              <div className="flex items-center gap-1.5 justify-between border-b border-stone-900 pb-1">
                <span className="text-stone-500">FILTER Q:</span>
                <span className="text-white">{activePreset.resonance}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-between border-b border-stone-900 pb-1">
                <span className="text-stone-500">BPM/BPM:</span>
                <span className="text-white">{activePreset.tempo}</span>
              </div>
            </div>
            <p className="text-stone-400 italic text-[9.5px] leading-relaxed pt-1 select-all border-t border-stone-900 mt-2">
              "{activePreset.description || 'No description provided'}"
            </p>
          </div>
        </div>

        {/* Save Current Values Form */}
        <div className="md:col-span-7 flex flex-col justify-between bg-zinc-950/40 p-3 border border-[#141416] rounded">
          <form onSubmit={handleSavePreset} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Capture Operational State</span>
              <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">W/ REAL-TIME CC VALUES</span>
            </div>

            {/* Simulated Live Capture Parameters Values */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-stone-950 border border-stone-900/60 rounded font-mono text-[9px] text-stone-400">
              <div className="flex flex-col">
                <span className="text-stone-600 text-[8px]">OSC</span>
                <span className="text-[#00FF41] uppercase font-bold truncate">{currentOscillatorType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-600 text-[8px]">CUTOFF</span>
                <span className="text-[#00F0FF] truncate">{currentCutoffFrequency} Hz</span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-600 text-[8px]">RESONANCE</span>
                <span className="text-amber-500 truncate">{currentResonance} Q</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-stone-600 text-[8px]">DELAY FEEDBACK</span>
                <span className="text-purple-400 truncate">{Math.round(currentDelayFeedbackLimit * 100)} %</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-stone-600 text-[8px]">ACTIVE TEMPO</span>
                <span className="text-white truncate">{currentTempo} BPM</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-stone-600 text-[8px]">MASTER GAIN</span>
                <span className="text-[#00FF41] truncate">{Math.round(currentMasterVolume * 100)} %</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                id="echo-preset-name-input"
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Name preset... (e.g. Sub Void Sweep)"
                maxLength={32}
                className="flex-1 bg-[#09090b] border border-[#2c2c35] text-stone-100 font-mono text-xs p-2 rounded focus:outline-none focus:border-[#00FF41]"
              />
              <button
                id="echo-save-preset-btn"
                type="submit"
                disabled={!newPresetName.trim()}
                className={`px-4 py-2 text-xs font-mono rounded flex items-center gap-1.5 transition-all select-none ${
                  newPresetName.trim()
                    ? 'bg-[#00FF41] hover:bg-[#00d035] text-black font-extrabold cursor-pointer active:scale-95'
                    : 'bg-stone-900 border border-stone-850 text-stone-600 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE</span>
              </button>
            </div>
          </form>

          {/* User Preset Bank List */}
          <div className="mt-4 pt-3 border-t border-stone-900">
            <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block mb-2">My Saved Presets</span>
            {customPresets.length === 0 ? (
              <p className="text-[9.5px] font-mono text-stone-600 italic">No custom presets saved to current localStorage pool yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`flex items-center gap-2 px-2.5 py-1 rounded bg-[#0a0a0d] border font-mono text-[10px] transition-all cursor-pointer group hover:bg-[#121217] ${
                      selectedPresetId === preset.id
                        ? 'border-[#00FF41]/40 text-[#00FF41]'
                        : 'border-[#1b1b1f] text-stone-400'
                    }`}
                  >
                    <span className="truncate max-w-[140px]">{preset.name}</span>
                    <button
                      onClick={(e) => handleDeletePreset(preset.id, e)}
                      className="text-stone-600 hover:text-red-400 cursor-pointer transition-colors p-0.5 shrink-0"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications overlay inside parent */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 bg-[#00FF41]/10 border border-[#00FF41]/30 p-2 rounded text-[#00FF41] font-mono text-[11px] animate-pulse"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Operational state captured successfully to "USER SAVED" Bank.</span>
          </motion.div>
        )}
        {loadNotice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/35 p-2 rounded text-cyan-400 font-mono text-[11px]"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 animate-bounce" />
            <span>{loadNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
