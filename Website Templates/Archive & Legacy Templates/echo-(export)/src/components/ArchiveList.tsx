import React, { useState, useRef } from 'react';
import { Track } from '../types';
import { TRACK_ARCHIVE } from '../data';
import { Disc, Activity, Hash, AudioLines, Music, CloudUpload, AlertCircle, Loader } from 'lucide-react';

interface ArchiveListProps {
  currentTrack: Track;
  onSelectTrack: (track: Track) => void;
  isPlaying: boolean;
  tracks?: Track[];
  onAddTrack?: (track: Track) => void;
}

export const ArchiveList: React.FC<ArchiveListProps> = ({ 
  currentTrack, 
  onSelectTrack, 
  isPlaying,
  tracks,
  onAddTrack
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const finalTracks = tracks || TRACK_ARCHIVE;

  const processFile = async (file: File) => {
    const isAudio = file.type.startsWith('audio/') || 
                    file.name.endsWith('.mp3') || 
                    file.name.endsWith('.wav') || 
                    file.name.endsWith('.ogg') || 
                    file.name.endsWith('.m4a');
                    
    if (!isAudio) {
      setUploadError("Invalid file. Please drop a valid .mp3 or .wav audio loop.");
      return;
    }
    
    setUploadError(null);
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const tempAudioCtx = new AudioContextClass();
      
      tempAudioCtx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
        // Retrieve or calculate BPM
        let estimatedBPM = 120;
        const bpmMatch = file.name.match(/(\d+)\s*(bpm|BPM)/);
        if (bpmMatch && bpmMatch[1]) {
          estimatedBPM = parseInt(bpmMatch[1], 10);
        } else {
          // Intelligent guestimate for common arpeggio loop BPM based on length
          const durationSec = decodedBuffer.duration;
          const candidateTempos = [80, 90, 100, 110, 120, 128, 130, 140, 150];
          let bestBpm = 120;
          let minDiff = Infinity;
          for (const b of candidateTempos) {
            const beats = (durationSec * b) / 60;
            const diff = Math.min(
              Math.abs(beats - 4), 
              Math.abs(beats - 8), 
              Math.abs(beats - 16), 
              Math.abs(beats - 32)
            );
            if (diff < minDiff) {
              minDiff = diff;
              bestBpm = b;
            }
          }
          estimatedBPM = bestBpm;
        }

        const durationMinutes = Math.floor(decodedBuffer.duration / 60);
        const durationSeconds = Math.round(decodedBuffer.duration % 60);
        const durationString = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

        const newTrack: Track = {
          id: `custom-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "").substring(0, 18).toUpperCase(),
          bitrate: "DECODED",
          year: new Date().getFullYear().toString(),
          duration: durationString,
          genre: "UPLOADED",
          bpm: estimatedBPM,
          description: `Custom Loop loaded dynamically. Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Duration: ${decodedBuffer.duration.toFixed(2)}s • Sample Rate: ${decodedBuffer.sampleRate} Hz. Connected directly to ECHO Web Synth DSP channels.`,
          notes: [],
          isCustomSample: true,
          audioBuffer: decodedBuffer
        };

        if (onAddTrack) {
          onAddTrack(newTrack);
        }
        setIsProcessing(false);
        tempAudioCtx.close();
      }, (err) => {
        console.error("Web Audio decoder failed:", err);
        setUploadError("Could not decode audio file. Keep codec simple (.wav/.mp3).");
        setIsProcessing(false);
        tempAudioCtx.close();
      });
    } catch (e) {
      console.error(e);
      setUploadError("Memory buffer processing failed. Try again.");
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="echo-archive-panel" className="bg-[#050505] border border-[#1A1A1A] p-6 lg:p-8 flex flex-col gap-6 relative rounded-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Header section with description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <span className="text-[#00FF41] text-[10px] font-mono uppercase tracking-[0.25em] font-bold">MASTER CHANNELS</span>
          <h2 className="text-white text-xl font-light tracking-tight uppercase">PRODUCER ARCHIVE</h2>
        </div>
        <div className="text-[10px] font-mono text-stone-500 text-right uppercase">
          {finalTracks.length} COMPOSITIONS LOADED • 24-BIT DEC
        </div>
      </div>

      {/* Drag and Drop Custom Loop Target Module */}
      <div
        id="drag-drop-loop-loader"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative p-6 border border-dashed rounded-md flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-[#00FF41] bg-[#00FF41]/10 text-white' 
            : 'border-stone-800 bg-stone-950/80 hover:border-stone-600 hover:bg-[#070709] text-stone-400'
        }`}
        title="Drop an MP3 or WAV file loop to play through real-time synthesizer effects"
      >
        <input 
          id="custom-sample-file-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*,.mp3,.wav,.ogg,.m4a"
          className="hidden"
        />

        {/* Decorative corner highlights */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-stone-800 group-hover:border-[#00FF41]/40" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-stone-800 group-hover:border-[#00FF41]/40" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-stone-800 group-hover:border-[#00FF41]/40" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-stone-800 group-hover:border-[#00FF41]/40" />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-2.5 py-2">
            <Loader className="w-6 h-6 text-[#00F0FF] animate-spin" />
            <span className="text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold">DECODING AUDIO VOLTAGE FROM MATRIX...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <CloudUpload className={`w-6 h-6 mb-1 transition-transform group-hover:-translate-y-0.5 ${isDragging ? 'text-[#00FF41]' : 'text-stone-500 group-hover:text-stone-300'}`} />
            <span className="text-[11px] font-mono text-stone-200 uppercase tracking-widest font-bold group-hover:text-white">
              DROP CUSTOM SAMPLE LOOP
            </span>
            <span className="text-[9.5px] font-mono text-stone-500 uppercase leading-normal">
              supports <strong className="text-stone-400">.mp3, .wav, .ogg, .m4a</strong> • click to browse local files
            </span>
          </div>
        )}

        {/* Feedback errors */}
        {uploadError && (
          <div className="flex items-center gap-1.5 mt-3 text-red-400 text-[10px] font-mono justify-center bg-red-950/20 px-2 py-1 rounded border border-red-900/30">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Grid of tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
        {finalTracks.map((track) => {
          const isSelected = track.id === currentTrack.id;
          const isCustom = track.isCustomSample;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`group relative p-4 border transition-all cursor-pointer flex flex-col justify-between gap-4 h-36 rounded-md ${
                isSelected 
                  ? isCustom 
                    ? 'border-[#00F0FF]/40 bg-[#00F0FF]/3 text-white'
                    : 'border-[#00FF41]/40 bg-[#00FF41]/3 text-white' 
                  : 'border-[#141414] bg-[#070707] text-stone-400 hover:border-stone-800 hover:bg-[#0A0A0A]'
              }`}
              title="Click to mount track on Synthesizer player"
            >
              {/* Hot selection color band */}
              {isSelected && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCustom ? 'bg-[#00F0FF] glow-blue' : 'bg-[#00FF41] glow-green'}`} />
              )}
              
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <Music className={`w-3.5 h-3.5 shrink-0 ${isSelected ? isCustom ? 'text-[#00F0FF]' : 'text-[#00FF41]' : 'text-stone-500'}`} />
                    <h3 className={`text-sm font-mono font-bold tracking-tight truncate ${isSelected ? 'text-white' : 'text-stone-200 group-hover:text-white transition-colors'}`}>
                      {track.title}
                    </h3>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    isCustom 
                      ? 'text-[#00F0FF] border-[#00F0FF]/25 bg-[#00F0FF]/5' 
                      : 'text-stone-500 bg-neutral-900 border-neutral-800'
                  }`}>
                    {track.genre.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-stone-500 leading-relaxed truncate-2-lines line-clamp-2">
                  {track.description}
                </p>
              </div>

              {/* Bitrate & Year Metadata (Explicit Requirement) */}
              <div className="flex justify-between items-end border-t border-[#131111]/30 pt-2 text-[10px] font-mono mt-auto">
                <div className="flex items-center gap-4 text-stone-500">
                  <div>
                    BITRATE: <span className={isSelected ? isCustom ? 'text-[#00F0FF] font-bold' : 'text-[#00FF41] font-bold' : 'text-stone-400'}>{track.bitrate}</span>
                  </div>
                  <div>
                    YEAR: <span className="text-stone-400">{track.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold ${isCustom ? 'text-[#00F0FF]' : 'text-[#00FF41]'}`}>{track.bpm} BPM</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-400">{track.duration}</span>
                  {isSelected && isPlaying && (
                    <div className="flex gap-[1.5px] h-3.5 items-end ml-1">
                      <div className={`w-[1.5px] h-3 animate-[pulse_0.6s_infinite] ${isCustom ? 'bg-[#00F0FF]' : 'bg-[#00FF41]'}`} />
                      <div className={`w-[1.5px] h-2 animate-[pulse_0.4s_infinite] ${isCustom ? 'bg-[#00F0FF]' : 'bg-[#00FF41]'}`} />
                      <div className={`w-[1.5px] h-3.5 animate-[pulse_0.8s_infinite] ${isCustom ? 'bg-[#00F0FF]' : 'bg-[#00FF41]'}`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
