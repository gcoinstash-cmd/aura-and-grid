import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Disc, Volume2, Music, Sparkles } from 'lucide-react';
import { VINYL_PLAYLIST } from '../data';
import { VinylTrack } from '../types';

interface VinylPlayerProps {
  activeTrackId?: string;
  onTrackChange?: (track: VinylTrack) => void;
}

export default function VinylPlayer({ activeTrackId, onTrackChange }: VinylPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const [rotationDegree, setRotationDegree] = useState(0);

  const currentTrack = VINYL_PLAYLIST[currentTrackIndex];

  // If outside props requests an active track by ID
  useEffect(() => {
    if (activeTrackId) {
      const idx = VINYL_PLAYLIST.findIndex((t) => t.id === activeTrackId);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
        setIsPlaying(true);
      }
    }
  }, [activeTrackId]);

  // Keep spinning while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotationDegree((prev) => (prev + 3) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (onTrackChange) onTrackChange(currentTrack);
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % VINYL_PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
    if (onTrackChange) onTrackChange(VINYL_PLAYLIST[nextIdx]);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    if (onTrackChange) onTrackChange(VINYL_PLAYLIST[index]);
  };

  return (
    <div className="bg-charcoal border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden relative" id="hifi-turntable-module">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta font-semibold">Live Sound Curation</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-900 border border-white/5">
          <Music className="w-3 h-3 text-gold" />
          <span className="font-mono text-[9px] uppercase text-gray-400 tracking-wider">Acoustics: Tube Amps</span>
        </div>
      </div>

      {/* Main Turntable Deck & Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Playback controls & Metadata block (Left 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-gold uppercase block mb-1">Night Program</span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-2xl lg:text-3xl text-white font-medium leading-tight tracking-tight mb-2">
                  {currentTrack.title}
                </h3>
                <p className="font-sans text-stone-300 font-semibold text-sm">
                  {currentTrack.artist}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-stone-900 border border-white/5 text-stone-400">
                    {currentTrack.releaseYear}
                  </span>
                  <span className="font-mono text-[10px] font-medium tracking-wide text-terracotta uppercase">
                    {currentTrack.moodTag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vibes Sublist */}
          <div className="border-t border-white/5 pt-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-2">Aura Flavor Profiles</div>
            <div className="flex flex-wrap gap-1.5">
              {currentTrack.vibes.map((v, i) => (
                <span key={i} className="text-[10px] text-stone-300 bg-stone-900/40 px-2 py-1 rounded border border-white/5">
                  #{v}
                </span>
              ))}
            </div>
          </div>

          {/* Audio interface controls */}
          <div className="space-y-4">
            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full cursor-pointer bg-terracotta hover:bg-terracotta-hover text-white flex items-center justify-center transition-all shadow-md shadow-terracotta/20"
                id="btn-play-vinyl"
                aria-label={isPlaying ? "Pause music demonstration" : "Play music demonstration"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full cursor-pointer bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-200 flex items-center justify-center transition-all"
                title="Next Record"
                aria-label="Next Record"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900/60 border border-white/5">
                <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-stone-800 accent-terracotta rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundImage: `linear-gradient(to right, #C86A4B ${volume}%, #292524 ${volume}%)` }}
                />
              </div>
            </div>

            {/* EQ Simulation (visual only, isPlaying stateful) */}
            <div className="h-6 flex items-end gap-1 px-1 justify-between bg-stone-950/80 rounded border border-white/5 p-1">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-full bg-gold/70 rounded-xs"
                  initial={{ height: '10%' }}
                  animate={{ 
                    height: isPlaying 
                      ? `${Math.max(10, Math.floor(Math.random() * 95))}%` 
                      : '8%' 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: 'reverse', 
                    duration: 0.15 + (i % 5) * 0.05, 
                    ease: 'easeInOut' 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Physical Turntable Deck (Right 7 cols) */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div className="relative w-76 h-76 sm:w-80 sm:h-80 bg-[#1D1B1B] rounded-2xl p-4 border-4 border-stone-800 shadow-inner flex items-center justify-center">
            
            {/* Turntable Platter Rim */}
            <div className="absolute inset-4 rounded-full bg-black/80 border-8 border-stone-800/80 shadow-[0_0_15px_rgba(0,0,0,0.8)]" />

            {/* Glowing Strobelight/Speed indicator */}
            <div className="absolute top-8 left-8 z-10 w-3 h-3 rounded-full bg-gold/90 animate-pulse border border-white/30" />
            <div className="absolute top-11 left-8.5 z-10 font-mono text-[6px] tracking-tighter text-stone-500 uppercase">33 RPM</div>

            {/* Silver spindle core center axis */}
            <div className="absolute z-20 w-3.5 h-3.5 rounded-full bg-neutral-300 border border-neutral-400 shadow shadow-neutral-600" />
            <div className="absolute z-20 w-1.5 h-1.5 rounded-full bg-neutral-600" />

            {/* Tone-arm assembly */}
            <div className="absolute right-4 top-4 z-20 flex flex-col items-center">
              {/* Gold pivot hub */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 via-stone-800 to-yellow-800 border border-white/10 shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-stone-950 border border-stone-800" />
              </div>
              
              {/* Metallic Silver Needle arm that pivots depending on isPlaying */}
              <motion.div
                className="absolute origin-top-left -left-1 top-5 w-4 h-24"
                style={{ originX: 0.5, originY: 0 }}
                animate={{ 
                  rotate: isPlaying ? [18, 20, 21, 20, 22] : [-5] 
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: isPlaying ? 25 : 80,
                  damping: 10,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: 'reverse'
                }}
              >
                {/* Silver wire bar */}
                <div className="w-1 bg-stone-400 h-22 mx-auto border-r border-stone-500 shadow" />
                {/* Vintage red cartridge / needle shell */}
                <div className="w-3 h-6 bg-rose-600 rounded-sm -ml-1 border border-rose-700 shadow flex flex-col justify-end">
                  <div className="w-1.5 h-1.5 bg-silver mx-auto rounded-full mb-0.5" />
                </div>
              </motion.div>
            </div>

            {/* Spinning Grooved Vinyl Record */}
            <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl flex items-center justify-center">
              
              {/* Moving vinyl body */}
              <div 
                className="w-full h-full rounded-full transition-transform ease-linear"
                style={{ 
                  transform: `rotate(${rotationDegree}deg)`,
                  background: 'repeating-radial-gradient(circle, #292828, #181717 2px, #0F0E0E 4px, #1c1a1a 8px)'
                }}
                id="vinyl-slab"
              >
                {/* Subtle rainbow vinyl sheen layer */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgba(200,106,75,0.05)_20%,transparent_40%,rgba(212,175,55,0.05)_65%,transparent_80%,rgba(200,106,75,0.05)_90%,transparent_100%)] opacity-80" />

                {/* Outer runout groove groove ring */}
                <div className="absolute inset-4 rounded-full border border-stone-800/10 pointer-events-none" />

                {/* Centered Curated Album Art / Cylinder Label */}
                <div className="absolute inset-20 rounded-full bg-stone-900 border-4 border-stone-950 flex items-center justify-center shadow-inner overflow-hidden">
                  <img
                    src={currentTrack.albumCover}
                    alt={currentTrack.album}
                    className="w-full h-full object-cover select-none filter brightness-50 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  {/* Colored center inner circle representing vintage label core */}
                  <div 
                    className="absolute w-12 h-12 rounded-full border border-neutral-900 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: currentTrack.labelColor }}
                  >
                    <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-[7px] font-mono text-white/90 uppercase font-bold text-center leading-none">
                      AURA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Tracks Direct Selector */}
      <div className="mt-8 border-t border-white/10 pt-4">
        <h4 className="font-mono text-[10px] uppercase text-stone-500 tracking-[0.15em] mb-3 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Audition Curated Plates & Playlist Sync</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {VINYL_PLAYLIST.map((track, idx) => {
            const isSelected = currentTrackIndex === idx;
            return (
              <button
                key={track.id}
                onClick={() => selectTrack(idx)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900/80 border-gold shadow shadow-gold/5'
                    : 'bg-stone-950/40 border-white/5 hover:border-white/20'
                }`}
                aria-label={`Select and play ${track.title} by ${track.artist}`}
              >
                <div className="relative w-8 h-8 rounded bg-stone-900 flex-shrink-0 overflow-hidden border border-white/10 flex items-center justify-center">
                  {isSelected && isPlaying ? (
                    <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center z-10">
                      <Disc className="w-4 h-4 text-gold animate-spin" />
                    </div>
                  ) : null}
                  <img
                    src={track.albumCover}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className={`font-medium truncate ${isSelected ? 'text-gold' : 'text-gray-200'}`}>
                    {track.title}
                  </div>
                  <div className="text-gray-400 text-[10px] truncate">{track.artist}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
