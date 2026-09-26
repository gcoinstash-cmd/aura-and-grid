import React, { useState, useEffect, useRef } from 'react';
import { GearItem } from '../types';

interface PatchCableOverlayProps {
  gearItems: GearItem[];
  activeCables: Record<string, boolean>;
}

interface CableCoordinates {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  glowColor: string;
}

const GEAR_SLIDER_MAP: Record<string, { sliderId: string; color: string; glowColor: string }> = {
  gear_01: { sliderId: 'filter-cutoff-range', color: '#00F0FF', glowColor: 'rgba(0, 240, 255, 0.4)' },
  gear_02: { sliderId: 'filter-q-range', color: '#00FF41', glowColor: 'rgba(0, 255, 65, 0.4)' },
  gear_03: { sliderId: 'master-volume-range', color: '#F59E0B', glowColor: 'rgba(245, 158, 11, 0.4)' },
  gear_04: { sliderId: 'cyber-noise-range', color: '#C084FC', glowColor: 'rgba(192, 132, 252, 0.4)' },
  gear_05: { sliderId: 'delay-feedback-range', color: '#FF3E3E', glowColor: 'rgba(255, 62, 62, 0.4)' },
  gear_06: { sliderId: 'synth-tempo-input', color: '#14B8A6', glowColor: 'rgba(20, 184, 166, 0.4)' },
};

export const PatchCableOverlay: React.FC<PatchCableOverlayProps> = ({ gearItems, activeCables }) => {
  const overlayRef = useRef<SVGSVGElement>(null);
  const [cables, setCables] = useState<CableCoordinates[]>([]);
  const [svgHeight, setSvgHeight] = useState<number>(1200);
  const [, forceUpdate] = useState({});

  const updateCoordinates = () => {
    if (!overlayRef.current) return;

    // Update dynamic SVG canvas height matching the current relative layout document height
    const currentScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1200;
    setSvgHeight((prev) => (prev === currentScrollHeight ? prev : currentScrollHeight));

    const overlayRect = overlayRef.current.getBoundingClientRect();
    const newCables: CableCoordinates[] = [];

    gearItems.forEach((item) => {
      // Draw cable only if it is online/patched and active in user settings
      if ((item.status === 'online' || item.status === 'patched') && activeCables[item.id]) {
        const mapping = GEAR_SLIDER_MAP[item.id];
        if (!mapping) return;

        const badgeEl = document.getElementById(`patch-badge-${item.id}`);
        const sliderEl = document.getElementById(mapping.sliderId);

        if (badgeEl && sliderEl) {
          const r1 = badgeEl.getBoundingClientRect();
          const r2 = sliderEl.getBoundingClientRect();

          // Compute absolute center coordinates relative to our SVG overlay canvas
          const x1 = r1.left + r1.width / 2 - overlayRect.left;
          const y1 = r1.top + r1.height / 2 - overlayRect.top;
          const x2 = r2.left + r2.width / 2 - overlayRect.left;
          const y2 = r2.top + r2.height / 2 - overlayRect.top;

          newCables.push({
            id: item.id,
            x1,
            y1,
            x2,
            y2,
            color: mapping.color,
            glowColor: mapping.glowColor,
          });
        }
      }
    });

    // Simple shallow comparison to limit state updates if coordinates haven't changed
    const hash = (arr: CableCoordinates[]) => arr.map(c => `${c.id}:${Math.round(c.x1)},${Math.round(c.y1)}–${Math.round(c.x2)},${Math.round(c.y2)}`).join('|');
    
    setCables((prev) => {
      if (hash(prev) === hash(newCables)) {
        return prev;
      }
      return newCables;
    });
  };

  useEffect(() => {
    updateCoordinates();

    const handler = () => {
      updateCoordinates();
    };

    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    window.addEventListener('scroll', handler, { capture: true, passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && overlayRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateCoordinates();
      });
      resizeObserver.observe(overlayRef.current);
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    // Instantly poll on requestAnimationFrame for buttery smooth target tracking during any resizing, flex reflow, or animations
    let animationFrameId: number;
    const animationTick = () => {
      updateCoordinates();
      animationFrameId = requestAnimationFrame(animationTick);
    };
    animationFrameId = requestAnimationFrame(animationTick);

    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
      window.removeEventListener('scroll', handler, true);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [gearItems, activeCables]);

  return (
    <svg
      id="echo-svg-patch-overlay"
      ref={overlayRef}
      className="absolute inset-x-0 top-0 w-full balance-patch-canvas pointer-events-none z-[45] overflow-visible"
      style={{
        mixBlendMode: 'screen',
        height: svgHeight,
      }}
    >
      <defs>
        {/* Glow Filters for high-end studio illumination */}
        <filter id="cable-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Signal pulses moving down the cord */}
        <linearGradient id="signal-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00FF41" stopOpacity="1" />
          <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
        </linearGradient>
      </defs>

      {cables.map((cable) => {
        // Compute beautiful hanging droop cubic bezier curve coordinates
        // Midpoint coordinates
        const midX = (cable.x1 + cable.x2) / 2;
        
        // Define a natural hanging droop factor depending on horizontal distance
        const dx = Math.abs(cable.x1 - cable.x2);
        const yDroop = Math.max(cable.x1, cable.x2); // A natural peak based on horizontal span
        
        // Control Points (Cubic Bezier curve droops naturally below the lowest point)
        const lowestY = Math.max(cable.y1, cable.y2);
        // The droop is relative to the distance between elements, simulating gravity
        const droopFactor = Math.min(220, 80 + dx * 0.18);
        const cpY = lowestY + droopFactor;

        // Curve trajectory: Starting at the DSP slider, curving downwards, ending up at the Gear badge
        const pathData = `M ${cable.x2} ${cable.y2} C ${cable.x2} ${cpY} ${cable.x1} ${cpY} ${cable.x1} ${cable.y1}`;

        return (
          <g key={cable.id} className="select-none pointer-events-none">
            {/* Outer neon halo shadow line */}
            <path
              d={pathData}
              fill="none"
              stroke={cable.color}
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.12"
              className="blur-[5px]"
            />

            {/* Glowing mid-layer */}
            <path
              d={pathData}
              fill="none"
              stroke={cable.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.5"
              filter="url(#cable-glow-filter)"
            />

            {/* Sharp inner core light wire */}
            <path
              d={pathData}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Animated signal voltage pulse tracing the path to signify ACTIVE routing connection */}
            <path
              d={pathData}
              fill="none"
              stroke={cable.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="12 40"
              className="animate-patch-flow"
              style={{
                filter: 'drop-shadow(0 0 3px ' + cable.color + ')',
              }}
            />

            {/* Little connection pins on both ends */}
            <circle cx={cable.x1} cy={cable.y1} r="3.5" fill="#111" stroke={cable.color} strokeWidth="1.5" />
            <circle cx={cable.x2} cy={cable.y2} r="3.5" fill="#111" stroke={cable.color} strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
};
