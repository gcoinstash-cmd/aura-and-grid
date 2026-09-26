import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { TruckLocation } from '../types';

interface MapMockProps {
  location: TruckLocation;
}

export const MapMock: React.FC<MapMockProps> = ({ location }) => {
  const [zoom, setZoom] = useState(14);
  const [showSatellite, setShowSatellite] = useState(false);

  // Status-based colors
  const getStatusColor = (status: TruckLocation['status']) => {
    switch (status) {
      case 'Live':
        return 'text-agave-400 bg-agave-950/80 border-agave-500/50';
      case 'Setting Up':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'Sold Out':
        return 'text-chipotle-400 bg-chipotle-950/80 border-chipotle-500/50';
      default:
        return 'text-zinc-400 bg-zinc-950/80 border-zinc-500/50';
    }
  };

  return (
    <div id="interactive-map" className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-zinc-800 bg-obsidian group">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-zinc-850)_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      {/* Mock Vector Street Map / Grid Lines */}
      <svg className="absolute inset-0 w-full h-full text-zinc-900 pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        {/* Main Streets */}
        <line x1="0" y1="120" x2="100%" y2="120" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="280" x2="100%" y2="280" stroke="currentColor" strokeWidth="2" />
        <line x1="180" y1="0" x2="180" y2="100%" stroke="currentColor" strokeWidth="2" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="currentColor" strokeWidth="2" />
        
        {/* Secondary Streets */}
        <line x1="0" y1="60" x2="100%" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="200" x2="100%" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="320" y1="0" x2="320" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

        {/* River outline / Scenic highway curves */}
        <path d="M -50,50 Q 200,80 400,250 T 900,380" fill="none" stroke="var(--color-charcoal)" strokeWidth="24" />
        <path d="M -50,50 Q 200,80 400,250 T 900,380" fill="none" stroke="var(--color-agave-700)" strokeWidth="2" strokeDasharray="5 5" />
      </svg>

      {/* Styled Location Map UI elements */}
      {showSatellite ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 to-charcoal opacity-95 transition-all duration-300 pointer-events-none">
          {/* Mock satellite building blocks */}
          <div className="absolute top-24 left-12 w-28 h-20 border border-zinc-800 bg-zinc-900/30 rounded" />
          <div className="absolute top-12 right-24 w-40 h-32 border border-zinc-800 bg-zinc-900/30 rounded" />
          <div className="absolute bottom-16 left-36 w-32 h-24 border border-zinc-800 bg-zinc-900/30 rounded" />
          <div className="absolute bottom-8 right-12 w-48 h-16 border border-zinc-800 bg-zinc-900/30 rounded" />
        </div>
      ) : null}

      {/* Street Names (Mocking Urban Editorial Vibe) */}
      <div className="absolute top-10 left-4 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 pointer-events-none select-none">
        3rd Street / Arts District
      </div>
      <div className="absolute bottom-20 right-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 pointer-events-none select-none">
        Santa Fe Ave
      </div>
      <div className="absolute top-1/2 left-1/3 text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-700 pointer-events-none select-none -rotate-90">
        Mesa Boulevard
      </div>

      {/* Glowing active position beacon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Ripple animation rings */}
          <motion.div
            animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-10 rounded-full bg-agave-500/10 border border-agave-500/20 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.3, 1.8, 1.3], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -inset-6 rounded-full bg-agave-500/15 pointer-events-none"
          />

          {/* Central pin marker */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="relative z-10 cursor-pointer flex flex-col items-center group/pin"
          >
            {/* Tag Popup above pin */}
            <div className="absolute bottom-12 bg-charcoal border border-zinc-800 text-white py-2 px-3 rounded-lg shadow-2xl whitespace-nowrap opacity-100 group-hover/pin:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-agave-400 animate-pulse`} />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-zinc-400">
                  {location.status} Now
                </span>
              </div>
              <p className="font-display font-medium text-sm mt-0.5">{location.spotName}</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{location.hours}</p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-charcoal border-r border-b border-zinc-800 rotate-45" />
            </div>

            {/* Glowing Map Pin Icon */}
            <div className="w-10 h-10 rounded-full bg-agave-500 text-black flex items-center justify-center shadow-xl border border-agave-400 shadow-agave-500/20 hover:scale-110 transition-transform duration-200">
              <MapPin className="w-5 h-5 fill-black" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Control Overlay Panels */}
      {/* Top Left: GPS Metadata */}
      <div className="absolute top-4 left-4 bg-charcoal/90 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
          <Compass className="w-4 h-4 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Coordinates</span>
            <span className="text-[9px] font-mono text-agave-400 px-1 py-0.2 bg-agave-950/50 rounded border border-agave-900/30">GPS Verified</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-300 mt-0.5">
            {location.latitude.toFixed(4)}° N, {Math.abs(location.longitude).toFixed(4)}° W
          </div>
        </div>
      </div>

      {/* Top Right: Status Flag & Detail Link */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        <div className={`px-3 py-1.5 rounded-full border text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 ${getStatusColor(location.status)}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          {location.status}
        </div>
        
        <button 
          onClick={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
            window.open(url, '_blank');
          }}
          className="bg-charcoal/90 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-agave-400" />
          Route in Maps
        </button>
      </div>

      {/* Bottom Left: Location Footer Display */}
      <div className="absolute bottom-4 left-4 right-16 md:right-32 bg-charcoal/95 backdrop-blur-md border border-zinc-800/80 p-3.5 rounded-xl flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Active Destination</span>
          <h4 className="text-zinc-200 text-sm font-semibold truncate mt-0.5">{location.spotName}</h4>
          <p className="text-zinc-400 text-xs truncate mt-0.5">{location.address}</p>
        </div>
      </div>

      {/* Bottom Right: Zoom & Layer Widgets */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        <button
          onClick={() => setShowSatellite(!showSatellite)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-150 cursor-pointer ${
            showSatellite 
              ? 'bg-agave-500 border-agave-400 text-black' 
              : 'bg-charcoal/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title="Toggle Satellite Imagery"
        >
          <Layers className="w-4 h-4" />
        </button>
        <div className="bg-charcoal/90 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
          <button 
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer border-b border-zinc-800"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(Math.max(zoom - 1, 10))}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
