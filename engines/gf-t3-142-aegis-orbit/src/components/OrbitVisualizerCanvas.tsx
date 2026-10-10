/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import React, { useRef, useEffect, useState } from 'react';
import { SatelliteNode, ConjunctionEvent } from '../types/orbital';
import { Eye, RotateCcw, Play, Pause, FastForward, Shield, Navigation, Compass } from 'lucide-react';

interface OrbitVisualizerCanvasProps {
  satellites: SatelliteNode[];
  selectedSatellite: SatelliteNode;
  activeConjunctions: ConjunctionEvent[];
  onSelectSatellite: (sat: SatelliteNode) => void;
  showManeuverTrajectory?: boolean;
}

export const OrbitVisualizerCanvas: React.FC<OrbitVisualizerCanvasProps> = ({
  satellites,
  selectedSatellite,
  activeConjunctions,
  onSelectSatellite,
  showManeuverTrajectory = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'3D_EARTH' | 'HILL_RIC'>('3D_EARTH');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(5);
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(-45);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [simTimeSec, setSimTimeSec] = useState<number>(0);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setSimTimeSec((prev) => prev + dt * simSpeed);
      }

      drawCanvas();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, simSpeed, rotX, rotY, zoom, viewMode, satellites, selectedSatellite, activeConjunctions, simTimeSec, showManeuverTrajectory]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    ctx.fillStyle = '#030712'; // dark space
    ctx.fillRect(0, 0, width, height);

    // Draw background stars
    drawStarfield(ctx, width, height);

    if (viewMode === '3D_EARTH') {
      draw3DEarthView(ctx, cx, cy, width, height);
    } else {
      drawHillRicView(ctx, cx, cy, width, height);
    }
  };

  const drawStarfield = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    // deterministic starfield
    for (let i = 0; i < 70; i++) {
      const sx = (Math.sin(i * 997) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 349) * 0.5 + 0.5) * height;
      const size = (i % 3 === 0) ? 2 : 1;
      ctx.fillRect(sx, sy, size, size);
    }
  };

  const draw3DEarthView = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number
  ) => {
    const radX = (rotX * Math.PI) / 180;
    const radY = ((rotY + simTimeSec * 0.5) * Math.PI) / 180;
    const earthRadiusPx = 115 * zoom;

    // 1. Earth Atmosphere Glow
    const glowGrad = ctx.createRadialGradient(cx, cy, earthRadiusPx * 0.9, cx, cy, earthRadiusPx * 1.4);
    glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    glowGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.12)');
    glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, earthRadiusPx * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Earth Sphere Body
    const earthGrad = ctx.createRadialGradient(
      cx - earthRadiusPx * 0.35,
      cy - earthRadiusPx * 0.35,
      earthRadiusPx * 0.1,
      cx,
      cy,
      earthRadiusPx
    );
    earthGrad.addColorStop(0, '#0f766e'); // cyan/teal ocean highlight
    earthGrad.addColorStop(0.4, '#0c4a6e'); // deep blue oceans
    earthGrad.addColorStop(0.85, '#082f49'); // dark limb
    earthGrad.addColorStop(1, '#020617'); // night terminator shadow

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, earthRadiusPx, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = earthGrad;
    ctx.fill();

    // Draw continent stylized wire lines
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
    ctx.lineWidth = 1.2;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      const yLat = cy + (lat / 90) * earthRadiusPx;
      const rAtLat = Math.sqrt(Math.max(0, earthRadiusPx * earthRadiusPx - (yLat - cy) * (yLat - cy)));
      ctx.ellipse(cx, yLat, rAtLat, rAtLat * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Meridian longitudes
    for (let lon = 0; lon < 180; lon += 45) {
      ctx.beginPath();
      const currentLon = lon + rotY + simTimeSec * 2;
      const xOffset = Math.sin((currentLon * Math.PI) / 180) * earthRadiusPx;
      ctx.ellipse(cx, cy, Math.abs(xOffset), earthRadiusPx, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    // 3. Earth Rim Highlight
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, earthRadiusPx, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Draw Orbit Planes and Satellites
    const orbitRadiusPx = earthRadiusPx * 1.55;

    // Draw Orbit Plane Alpha (53 deg inclination)
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitRadiusPx, orbitRadiusPx * 0.55, (25 * Math.PI) / 180, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Orbit Plane Bravo
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitRadiusPx, orbitRadiusPx * 0.55, (-25 * Math.PI) / 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Draw Satellites on Orbit
    satellites.forEach((sat, idx) => {
      const isSelected = sat.id === selectedSatellite.id;
      const planeAngle = sat.planeId === 'PLANE-ALPHA' ? 25 : -25;
      const rotRad = (planeAngle * Math.PI) / 180;

      // Anomaly angle with simulation time
      const anomalyRad =
        ((sat.elements.trueAnomalyDeg + (simTimeSec * 15) / (idx + 1)) * Math.PI) / 180;

      const px0 = Math.cos(anomalyRad) * orbitRadiusPx;
      const py0 = Math.sin(anomalyRad) * (orbitRadiusPx * 0.55);

      const px = cx + px0 * Math.cos(rotRad) - py0 * Math.sin(rotRad);
      const py = cy + px0 * Math.sin(rotRad) + py0 * Math.cos(rotRad);

      // Satellite glow & pulse
      if (isSelected) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Status color
      let satColor = '#10b981'; // nominal emerald
      if (sat.status === 'WARNING') satColor = '#f59e0b'; // amber
      if (sat.status === 'CRITICAL_MANEUVER') satColor = '#f43f5e'; // rose

      ctx.fillStyle = satColor;
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 6.5 : 5, 0, Math.PI * 2);
      ctx.fill();

      // Satellite Label
      ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
      ctx.font = isSelected ? 'bold 14px "JetBrains Mono"' : '12px "JetBrains Mono"';
      ctx.fillText(sat.name, px + 12, py - 4);
    });

    // Draw Active Debris & Conjunction Warning Objects
    activeConjunctions.forEach((conj) => {
      if (conj.collisionStatus === 'ACTION_REQUIRED') {
        const debX = cx + Math.cos((simTimeSec * 12 * Math.PI) / 180) * (orbitRadiusPx + 15);
        const debY = cy + Math.sin((simTimeSec * 12 * Math.PI) / 180) * (orbitRadiusPx * 0.55 + 8);

        // Pulsing warning ring
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(debX, debY, 14 + Math.sin(simTimeSec * 8) * 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(debX, debY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 13px "JetBrains Mono"';
        ctx.fillText(`DEBRIS #${conj.secondaryNoradId} (Pc=${conj.probabilityOfCollision.toExponential(2)})`, debX + 16, debY + 4);
      }
    });

    // Viewport telemetry watermark
    ctx.fillStyle = 'rgba(203, 213, 225, 0.95)';
    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillText(`ORBIT FRAME: ECI WGS-84 (J2000)`, 20, 30);
    ctx.fillText(`INCLINATION: 53.05° | ALT: 550.0 km`, 20, 50);
    ctx.fillText(`ACTIVE BIRDS: ${satellites.length} | SIM RATE: ${simSpeed}x`, 20, 70);
  };

  const drawHillRicView = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number
  ) => {
    // Hill's Frame: Chief satellite at center (0, 0)
    // Horizontal Axis: In-Track (Y), Vertical Axis: Radial (X)
    const scale = 0.28 * zoom; // pixels per meter

    // 1. Radar Grid Lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 1.2;

    // Concentric Range Rings (100m, 250m, 500m, 1000m, 1500m)
    const ranges = [100, 250, 500, 1000, 1500];
    ranges.forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText(`${r}m`, cx + r * scale + 6, cy - 6);
    });

    // Coordinate Axes
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.95)';
    ctx.lineWidth = 1.8;
    // In-Track Axis (Y)
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Radial Axis (X)
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillText('+ IN-TRACK (VELOCITY VECTOR →)', width - 260, cy - 10);
    ctx.fillText('+ RADIAL (ZENITH ↑)', cx + 12, 30);
    ctx.fillText('- RADIAL (NADIR / EARTH ↓)', cx + 12, height - 20);

    // 2. Keep-Out Zone (KOZ) - 250m radius
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, 250 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillText('KEEP-OUT ZONE (KOZ: 250m)', cx - 95, cy - 250 * scale - 8);

    // 3. Chief Satellite at Origin
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "JetBrains Mono"';
    ctx.fillText(`${selectedSatellite.name} (CHIEF)`, cx + 16, cy + 5);

    // 4. Secondary Conjunction Debris & Collision Ellipsoid
    const activeConj = activeConjunctions.find(
      (c) => c.primaryNoradId === selectedSatellite.noradId
    ) || activeConjunctions[0];

    if (activeConj) {
      const [rR, rI, rC] = activeConj.missDistanceVectorRicMeters;
      const debX = cx + rI * scale;
      const debY = cy - rR * scale;

      // 3-Sigma Error Covariance Ellipse
      ctx.save();
      ctx.translate(debX, debY);
      ctx.rotate((-20 * Math.PI) / 180);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 65 * scale, 25 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Debris Marker
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(debX, debY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Line of Miss Distance
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(debX, debY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 13px "JetBrains Mono"';
      ctx.fillText(
        `${activeConj.secondaryName} (Miss: ${activeConj.missDistanceTotalMeters.toFixed(1)}m)`,
        debX + 14,
        debY - 8
      );
      ctx.fillText(
        `Pc = ${activeConj.probabilityOfCollision.toExponential(2)} (CRITICAL)`,
        debX + 14,
        debY + 12
      );

      // 5. Post-Maneuver Evasive Trajectory (Green Departure Corridor)
      if (showManeuverTrajectory || activeConj.collisionStatus === 'ACTION_REQUIRED') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        // Curving departure trajectory powered by in-track delta-V
        ctx.bezierCurveTo(
          cx + 120 * scale,
          cy + 40 * scale,
          cx + 350 * scale,
          cy + 180 * scale,
          cx + 700 * scale,
          cy + 450 * scale
        );
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 13px "JetBrains Mono"';
        ctx.fillText('EVASIVE CAM DEPARTURE ARC (ΔV = +0.165 m/s In-Track)', cx + 220 * scale, cy + 140 * scale);

        // New safe clearance marker
        const safeX = cx + 700 * scale;
        const safeY = cy + 450 * scale;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(safeX, safeY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('CLEARED POST-MANEUVER SEPARATION (1,420m)', safeX + 12, safeY + 5);
      }
    }

    // Telemetry Legend
    ctx.fillStyle = 'rgba(203, 213, 225, 0.95)';
    ctx.font = 'bold 13px "JetBrains Mono"';
    ctx.fillText(`FRAME: CLOHESSY-WILTSHIRE (RIC / HILL FRAME)`, 20, 30);
    ctx.fillText(`COVARIANCE B-PLANE: FOSTER-1992 2D PROJECTION`, 20, 50);
    ctx.fillText(`ACTION THRESHOLD: Pc >= 1.0e-4`, 20, 70);
  };

  // Mouse drag handlers for rotating 3D view
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.5);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - dy * 0.5)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Top Controls Overlay */}
      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-2.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80">
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setViewMode('3D_EARTH')}
            className={`px-3 py-1.5 text-sm font-hud rounded-md transition-all cursor-pointer ${
              viewMode === '3D_EARTH'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            3D Globe Orbit
          </button>
          <button
            onClick={() => setViewMode('HILL_RIC')}
            className={`px-3 py-1.5 text-sm font-hud rounded-md transition-all cursor-pointer ${
              viewMode === 'HILL_RIC'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Hill/RIC Encounter
          </button>
        </div>

        <div className="h-5 w-px bg-slate-700"></div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setSimSpeed((prev) => (prev === 1 ? 5 : prev === 5 ? 20 : 1))}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-mono font-bold cursor-pointer"
          title="Toggle Simulation Speed"
        >
          {simSpeed}x
        </button>

        <button
          onClick={() => {
            setZoom(1.0);
            setRotX(25);
            setRotY(-45);
          }}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-sm text-slate-200 font-mono px-1.5">
          <span>Zoom:</span>
          <input
            type="range"
            min="0.6"
            max="2.2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={920}
        height={480}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[440px] sm:h-[500px] cursor-grab active:cursor-grabbing block"
      />

      {/* Bottom Telemetry Bar */}
      <div className="px-5 py-3 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between text-sm font-mono text-slate-300 gap-3">
        <div className="flex items-center space-x-3.5">
          <span>
            FOCUSED TARGET: <span className="text-cyan-400 font-extrabold text-base">{selectedSatellite.name}</span> (#{selectedSatellite.noradId})
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">PROPAGATOR: SGP4/J2-J4 RK4</span>
        </div>
        <div className="flex items-center space-x-3.5">
          <span>DRAG TERM: <span className="text-white font-bold">B* = {selectedSatellite.elements.bStar.toExponential(3)}</span></span>
          <span className="text-slate-600">|</span>
          <span>ALT: <span className="text-cyan-300 font-extrabold text-base">{(selectedSatellite.elements.semiMajorAxisKm - 6378.137).toFixed(1)} km</span></span>
        </div>
      </div>
    </div>
  );
};

