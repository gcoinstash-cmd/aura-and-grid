import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, MoveHorizontal, Compass, Eye, ShieldCheck, Zap } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface GuidanceCanvasProps {
  velocityKmh: number;
  lateralDisplacementMm: number;
  dampingResponsePercent: number;
  linearBraking: boolean;
  emergencyScram: boolean;
}

export const GuidanceCanvas: React.FC<GuidanceCanvasProps> = ({
  velocityKmh,
  lateralDisplacementMm,
  dampingResponsePercent,
  linearBraking,
  emergencyScram
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'perspective' | 'ortho'>('perspective');
  const [showFluxArcs, setShowFluxArcs] = useState<boolean>(true);
  const [historyDisplacement, setHistoryDisplacement] = useState<number[]>([]);

  // Keep 40 data points for micro-oscillation graph
  useEffect(() => {
    setHistoryDisplacement(prev => {
      const next = [...prev, lateralDisplacementMm];
      if (next.length > 50) next.shift();
      return next;
    });
  }, [lateralDisplacementMm]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let gridOffset = 0;

    // Synthetic velocity particles
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 300,
      z: Math.random() * 800 + 50,
      speed: Math.random() * 0.4 + 0.8,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? '#3b82f6' : '#8b5cf6'
    }));

    const render = () => {
      // Auto resize to display dimensions
      const width = canvas.width = canvas.parentElement?.clientWidth || 600;
      const height = canvas.height = canvas.parentElement?.clientHeight || 420;

      // Clear with dark tactical background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Speed scalar: 0 to 620 km/h maps to movement rate
      const speedFactor = Math.max(0.2, (velocityKmh / 620) * 18);
      gridOffset = (gridOffset + speedFactor) % 40;

      const centerX = width / 2;
      const centerY = height * 0.62;

      if (viewMode === 'perspective') {
        // --- 1. Horizon & Sky Glow ---
        const horizonY = height * 0.38;
        const horizonGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        horizonGrad.addColorStop(0, '#020617');
        horizonGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Guideway Glow
        const groundGrad = ctx.createLinearGradient(centerX, horizonY, centerX, height);
        groundGrad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        groundGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.12)');
        groundGrad.addColorStop(1, 'rgba(9, 9, 11, 0.9)');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, horizonY, width, height - horizonY);

        // --- 2. Magnetic Guideway Perspective Rails ---
        const railHalfWidthNear = width * 0.42;
        const railHalfWidthFar = 35;
        const guidewayCenterNear = centerX + (lateralDisplacementMm * 6);
        const guidewayCenterFar = centerX;

        ctx.lineWidth = 1.5;

        // Longitudinal Stator Track Lines
        const trackDivisions = [-1, -0.65, -0.3, 0, 0.3, 0.65, 1];
        trackDivisions.forEach((div, idx) => {
          const xNear = guidewayCenterNear + (div * railHalfWidthNear);
          const xFar = guidewayCenterFar + (div * railHalfWidthFar);

          ctx.beginPath();
          ctx.moveTo(xFar, horizonY);
          ctx.lineTo(xNear, height);

          if (idx === 3) {
            // Center alignment rail
            ctx.strokeStyle = emergencyScram ? '#f43f5e' : linearBraking ? '#f59e0b' : '#38bdf8';
            ctx.setLineDash([8, 6]);
            ctx.lineWidth = 2;
          } else if (idx === 0 || idx === 6) {
            // Guideway Levitation Walls
            ctx.strokeStyle = '#8b5cf6';
            ctx.setLineDash([]);
            ctx.lineWidth = 2.5;
          } else {
            // Stator Induction coils
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
            ctx.setLineDash([]);
            ctx.lineWidth = 1;
          }
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Transverse Stator Sleeper Ties (Accelerating towards viewer)
        const numTies = 14;
        for (let i = 0; i < numTies; i++) {
          const p = (i + (gridOffset / 40)) / numTies;
          const curveP = Math.pow(p, 2.6); // Exponential perspective
          const y = horizonY + (height - horizonY) * curveP;

          const spanHalf = railHalfWidthFar + (railHalfWidthNear - railHalfWidthFar) * curveP;
          const leftX = guidewayCenterFar + (guidewayCenterNear - guidewayCenterFar) * curveP - spanHalf;
          const rightX = guidewayCenterFar + (guidewayCenterNear - guidewayCenterFar) * curveP + spanHalf;

          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 + curveP * 0.55})`;
          ctx.lineWidth = 1 + curveP * 2;
          ctx.stroke();

          // Magnetic flux dots along stator ties
          if (showFluxArcs && curveP > 0.4) {
            ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a855f7';
            ctx.beginPath();
            ctx.arc(leftX + spanHalf * 0.35, y, 1.5 + curveP * 2, 0, Math.PI * 2);
            ctx.arc(rightX - spanHalf * 0.35, y, 1.5 + curveP * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // --- 3. Warp / Velocity Particles ---
        particles.forEach(p => {
          p.z -= speedFactor * p.speed * 2.2;
          if (p.z <= 10) {
            p.z = 800;
            p.x = (Math.random() - 0.5) * 600;
            p.y = (Math.random() - 0.5) * 300;
          }

          const k = 220 / p.z;
          const px = centerX + p.x * k;
          const py = centerY + p.y * k;

          if (px > 0 && px < width && py > 0 && py < height) {
            const size = Math.max(0.8, (1 - p.z / 800) * 3.5 * p.size);

            // Motion blur tail
            const tailLen = (velocityKmh / 620) * 25 * (1 - p.z / 800);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py - tailLen);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = size * 0.8;
            ctx.stroke();

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // --- 4. Levitation Arc Underglow (Simulated vehicle clearance) ---
        if (showFluxArcs) {
          const hoverY = height * 0.78;
          const arcWidth = 140;

          // Glowing plasma field beneath vehicle
          const arcGrad = ctx.createRadialGradient(
            centerX, hoverY, 10,
            centerX, hoverY, arcWidth
          );
          arcGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
          arcGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
          arcGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = arcGrad;
          ctx.beginPath();
          ctx.ellipse(centerX, hoverY, arcWidth, 24, 0, 0, Math.PI * 2);
          ctx.fill();

          // Vehicle Bogie Target Markers
          [-65, 65].forEach(xOff => {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX + xOff, hoverY, 6, 0, Math.PI * 2);
            ctx.stroke();
          });
        }

      } else {
        // --- Orthographic Top-Down Sensor Radar View ---
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);

        // Circular Radar Rings
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 1;
        [60, 120, 180, 240].forEach(r => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Lateral guideway bounds
        const trackW = 160;
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - trackW, 0);
        ctx.lineTo(centerX - trackW, height);
        ctx.moveTo(centerX + trackW, 0);
        ctx.lineTo(centerX + trackW, height);
        ctx.stroke();

        // Center zero-line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vehicle Top-down footprint
        const vehX = centerX + (lateralDisplacementMm * 12);
        const vehY = centerY;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(vehX - 35, vehY - 60, 70, 120, 12);
        ctx.fill();
        ctx.stroke();

        // 4 Levitation Bogie pads
        [[-25, -45], [25, -45], [-25, 45], [25, 45]].forEach(([bx, by]) => {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(vehX + bx, vehY + by, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // --- 5. Reticle Alignment HUD Overlay (Always Active) ---
      const reticleX = centerX + (lateralDisplacementMm * 5);
      const reticleY = height * 0.48;

      ctx.strokeStyle = Math.abs(lateralDisplacementMm) > 2 ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 1.5;

      // Crosshair brackets
      const retLen = 14;
      ctx.beginPath();
      // Center dot
      ctx.arc(reticleX, reticleY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Top-Left bracket
      ctx.moveTo(reticleX - retLen, reticleY - retLen / 2);
      ctx.lineTo(reticleX - retLen, reticleY - retLen);
      ctx.lineTo(reticleX - retLen / 2, reticleY - retLen);

      // Top-Right bracket
      ctx.moveTo(reticleX + retLen / 2, reticleY - retLen);
      ctx.lineTo(reticleX + retLen, reticleY - retLen);
      ctx.lineTo(reticleX + retLen, reticleY - retLen / 2);

      // Bottom-Left bracket
      ctx.moveTo(reticleX - retLen, reticleY + retLen / 2);
      ctx.lineTo(reticleX - retLen, reticleY + retLen);
      ctx.lineTo(reticleX - retLen / 2, reticleY + retLen);

      // Bottom-Right bracket
      ctx.moveTo(reticleX + retLen / 2, reticleY + retLen);
      ctx.lineTo(reticleX + retLen, reticleY + retLen);
      ctx.lineTo(reticleX + retLen, reticleY + retLen / 2);
      ctx.stroke();

      // Guideway Alignment Boundary Tolerance (+/- 3mm limits)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX - 18, reticleY - 20);
      ctx.lineTo(centerX - 18, reticleY + 20);
      ctx.moveTo(centerX + 18, reticleY - 20);
      ctx.lineTo(centerX + 18, reticleY + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [velocityKmh, lateralDisplacementMm, viewMode, showFluxArcs, linearBraking, emergencyScram]);

  return (
    <div className="flex flex-col gap-5">
      {/* Central Interactive Guidance Canvas Panel */}
      <div className="cyber-panel rounded-xl bg-zinc-950/90 border border-zinc-800 overflow-hidden flex flex-col shadow-xl">
        {/* Canvas Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-zinc-900/80 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              SYNTHETIC VECTOR GUIDANCE & TRACK CORRIDOR
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                tacticalAudio.playClick(1100);
                setShowFluxArcs(!showFluxArcs);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono-tactical font-bold border transition-colors cursor-pointer ${
                showFluxArcs 
                  ? 'bg-blue-500/25 text-blue-200 border-blue-500/50' 
                  : 'bg-zinc-850 text-zinc-300 border-zinc-700'
              }`}
            >
              <span className="flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5" /> FLUX ARCS
              </span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playClick(950);
                setViewMode(v => v === 'perspective' ? 'ortho' : 'perspective');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono-tactical font-bold bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {viewMode === 'perspective' ? 'CAMERA: 3D PERSPECTIVE' : 'CAMERA: ORTHO RADAR'}
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className="relative w-full h-[320px] sm:h-[370px] bg-zinc-950">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full block cursor-crosshair"
          />

          {/* Canvas Floating Telemetry Overlays */}
          <div className="absolute top-3.5 left-3.5 bg-zinc-950/85 backdrop-blur border border-zinc-800 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono-tactical text-zinc-200 space-y-1 pointer-events-none shadow-lg">
            <div className="flex items-center justify-between gap-5">
              <span className="text-zinc-400 font-medium">CORRIDOR LOCK:</span>
              <span className="text-emerald-400 font-extrabold">ACTIVE (0.02ms)</span>
            </div>
            <div className="flex items-center justify-between gap-5">
              <span className="text-zinc-400 font-medium">DAMPING STATUS:</span>
              <span className="text-blue-400 font-bold">{dampingResponsePercent.toFixed(1)}% APPLIED</span>
            </div>
            <div className="flex items-center justify-between gap-5">
              <span className="text-zinc-400 font-medium">LATERAL JITTER:</span>
              <span className={`font-bold ${Math.abs(lateralDisplacementMm) > 2 ? 'text-amber-400' : 'text-zinc-200'}`}>
                {lateralDisplacementMm >= 0 ? `+${lateralDisplacementMm.toFixed(2)}` : lateralDisplacementMm.toFixed(2)} mm
              </span>
            </div>
          </div>

          <div className="absolute top-3.5 right-3.5 bg-zinc-950/85 backdrop-blur border border-zinc-800 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono-tactical text-right pointer-events-none shadow-lg">
            <div className="text-zinc-400 font-medium uppercase">LINEAR GUIDEWAY</div>
            <div className="text-purple-400 font-extrabold text-sm sm:text-base">MAG-SYNC 400kHz</div>
            <div className="text-xs text-zinc-300 font-semibold mt-0.5">FLUX CHANNEL 09-ALPHA</div>
          </div>

          {/* Center Target Indicator Notice */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-zinc-950/85 px-4 py-1.5 rounded-lg border border-zinc-800 text-xs sm:text-sm font-mono-tactical text-zinc-300 flex items-center gap-2.5 pointer-events-none shadow-lg font-semibold">
            <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>ALIGNMENT RETICLE: {Math.abs(lateralDisplacementMm) < 1.0 ? 'LOCKED ON AXIS' : 'AUTO-COMPENSATING'}</span>
          </div>
        </div>
      </div>

      {/* Real-time Lateral Displacement & Active Damping Oscillogram */}
      <div className="cyber-panel p-5 rounded-xl bg-zinc-950/85 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <MoveHorizontal className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm sm:text-base font-display-hud font-extrabold uppercase tracking-wider text-white">
              LATERAL DISPLACEMENT OSCILLOGRAM (MICRO-DAMPING)
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono-tactical">
            <span className="text-zinc-300">OFFSET: <strong className="text-white text-base">{lateralDisplacementMm.toFixed(2)} mm</strong></span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">DAMPING: <strong className="text-purple-400 text-base">{dampingResponsePercent.toFixed(0)}%</strong></span>
          </div>
        </div>

        {/* SVG Sparkline Oscillogram */}
        <div className="relative h-28 bg-zinc-900/60 rounded-xl border border-zinc-800 p-2.5 overflow-hidden flex flex-col justify-center">
          {/* Zero baseline */}
          <div className="absolute left-0 right-0 top-1/2 border-t border-blue-500/40 border-dashed" />
          {/* Boundary limits +3mm / -3mm */}
          <div className="absolute left-0 right-0 top-3.5 border-t border-rose-500/30" />
          <div className="absolute left-0 right-0 bottom-3.5 border-t border-rose-500/30" />

          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            {/* Draw displacement path */}
            {historyDisplacement.length > 1 && (
              <>
                {/* Glow shadow */}
                <path
                  d={historyDisplacement.map((val, idx) => {
                    const x = (idx / (historyDisplacement.length - 1)) * 100;
                    const y = Math.max(2, Math.min(38, 20 - (val * 4.5)));
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeOpacity="0.45"
                />
                {/* Crisp sharp line */}
                <path
                  d={historyDisplacement.map((val, idx) => {
                    const x = (idx / (historyDisplacement.length - 1)) * 100;
                    const y = Math.max(2, Math.min(38, 20 - (val * 4.5)));
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>

          {/* Axis Labels */}
          <div className="absolute left-3 top-1.5 text-xs font-mono-tactical font-bold text-rose-400">+3.0 mm</div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-tactical font-bold text-blue-400">0.0 mm (TRACK CENTER)</div>
          <div className="absolute left-3 bottom-1.5 text-xs font-mono-tactical font-bold text-rose-400">-3.0 mm</div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm font-mono-tactical text-zinc-300 mt-2.5 font-medium">
          <span>ALGORITHM: REAL-TIME LQR ACTIVE LEVITATION KALMAN FILTER</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> DAMPING LOOP CLOSED
          </span>
        </div>
      </div>
    </div>
  );
};
