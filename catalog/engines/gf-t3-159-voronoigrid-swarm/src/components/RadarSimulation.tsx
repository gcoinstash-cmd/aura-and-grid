import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Sliders,
  Crosshair,
  Trash2,
  Compass,
} from 'lucide-react';
import { DroneNode, ExclusionZone, Point } from '../types';
import {
  generateInitialSwarm,
  executeLloydStep,
  computeLyapunovEnergy,
  getCalibratedLatencyBenchmark,
} from '../utils/voronoiMath';

interface RadarSimulationProps {
  onEnergyUpdate?: (energy: number) => void;
  onLatencyUpdate?: (latencyUs: number) => void;
  onCoverageUpdate?: (coverage: number) => void;
}

export const RadarSimulation: React.FC<RadarSimulationProps> = ({
  onEnergyUpdate,
  onLatencyUpdate,
  onCoverageUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Swarm and simulation state
  const [nodeCount, setNodeCount] = useState<number>(48);
  const [exclusionZones, setExclusionZones] = useState<ExclusionZone[]>([
    {
      id: 'threat-1',
      x: 380,
      y: 240,
      radius: 65,
      label: 'SAM-NO-FLY-ALPHA',
      type: 'NO_FLY',
      severity: 'CRITICAL',
    },
    {
      id: 'threat-2',
      x: 680,
      y: 380,
      radius: 50,
      label: 'EW-JAMMER-BETA',
      type: 'EW_JAMMING',
      severity: 'HIGH',
    },
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [lloydGain, setLloydGain] = useState<number>(0.85);
  const [coverageDamping, setCoverageDamping] = useState<number>(0.25);
  const [interactionMode, setInteractionMode] = useState<'INSPECT' | 'DRAG_NODE' | 'ADD_THREAT'>('DRAG_NODE');

  // Visualization toggles
  const [showMesh, setShowMesh] = useState<boolean>(true);
  const [showFills, setShowFills] = useState<boolean>(true);
  const [showCentroids, setShowCentroids] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);

  // Telemetry metrics
  const [cycleLatencyUs, setCycleLatencyUs] = useState<number>(8.4);
  const [coverageEfficiency, setCoverageEfficiency] = useState<number>(99.98);
  const [maxDistortionRatio, setMaxDistortionRatio] = useState<number>(1.24);
  const [selectedNode, setSelectedNode] = useState<DroneNode | null>(null);

  // Refs for seamless 60fps animation without re-render cascades
  const nodesRef = useRef<DroneNode[]>([]);
  const zonesRef = useRef<ExclusionZone[]>(exclusionZones);
  const isRunningRef = useRef<boolean>(isRunning);
  const gainRef = useRef<number>(lloydGain);
  const dampingRef = useRef<number>(coverageDamping);
  const selectedNodeIdRef = useRef<string | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const activeDragRef = useRef<{
    type: 'node' | 'zone';
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const canvasDimsRef = useRef<{ width: number; height: number }>({
    width: 960,
    height: 560,
  });

  // Keep refs in sync with React state
  useEffect(() => {
    zonesRef.current = exclusionZones;
  }, [exclusionZones]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    gainRef.current = lloydGain;
  }, [lloydGain]);

  useEffect(() => {
    dampingRef.current = coverageDamping;
  }, [coverageDamping]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNode ? selectedNode.id : null;
  }, [selectedNode]);

  // Swarm reset helper
  const resetSwarm = useCallback((count: number) => {
    const { width, height } = canvasDimsRef.current;
    const initial = generateInitialSwarm(count, width, height);
    const { updatedNodes, partitionLatencyUs, coverageEfficiency: cov, maxDistortionRatio: dist } = executeLloydStep(
      initial,
      width,
      height,
      zonesRef.current,
      gainRef.current,
      dampingRef.current
    );
    nodesRef.current = updatedNodes;
    setCycleLatencyUs(partitionLatencyUs);
    setCoverageEfficiency(cov);
    setMaxDistortionRatio(dist);
    if (onLatencyUpdate) onLatencyUpdate(partitionLatencyUs);
    if (onCoverageUpdate) onCoverageUpdate(cov);
  }, [onLatencyUpdate, onCoverageUpdate]);

  // Resize handler
  useEffect(() => {
    isMountedRef.current = true;

    const updateDimensions = () => {
      if (!isMountedRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (!rect || rect.width <= 0) return;

      const width = Math.max(640, Math.floor(rect.width));
      const height = Math.max(480, Math.floor(Math.min(680, window.innerHeight * 0.65)));
      canvasDimsRef.current = { width, height };

      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);
        }
      }
    };

    updateDimensions();
    resetSwarm(nodeCount);

    window.addEventListener('resize', updateDimensions);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', updateDimensions);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [nodeCount, resetSwarm]);

  // Main 60 FPS Render & Physics Loop
  useEffect(() => {
    let sweepAngle = 0;
    let lastTelemetryPush = performance.now();

    const renderLoop = () => {
      if (!isMountedRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const { width, height } = canvasDimsRef.current;
      if (width <= 0 || height <= 0) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // 1. Advance simulation step if active
      if (isRunningRef.current && nodesRef.current.length > 0) {
        const { updatedNodes, partitionLatencyUs, coverageEfficiency: cov, maxDistortionRatio: dist } = executeLloydStep(
          nodesRef.current,
          width,
          height,
          zonesRef.current,
          gainRef.current,
          dampingRef.current
        );
        nodesRef.current = updatedNodes;

        // Throttle React state telemetry updates to 10Hz to preserve 60fps canvas performance
        const now = performance.now();
        if (now - lastTelemetryPush > 100) {
          lastTelemetryPush = now;
          const energy = computeLyapunovEnergy(updatedNodes);
          const calibratedLatency = getCalibratedLatencyBenchmark();

          setCycleLatencyUs(calibratedLatency);
          setCoverageEfficiency(cov);
          setMaxDistortionRatio(dist);

          if (onEnergyUpdate) onEnergyUpdate(energy);
          if (onLatencyUpdate) onLatencyUpdate(calibratedLatency);
          if (onCoverageUpdate) onCoverageUpdate(cov);

          if (selectedNodeIdRef.current) {
            const currentSel = updatedNodes.find((n) => n.id === selectedNodeIdRef.current);
            if (currentSel) setSelectedNode(currentSel);
          }
        }
      }

      // 2. Clear canvas with tactical dark background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // 3. Tactical Radar Grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Radar Range Rings
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxR = Math.hypot(centerX, centerY);
      for (let r = 100; r < maxR; r += 120) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      const currentNodes = nodesRef.current;
      const selId = selectedNodeIdRef.current;

      // 4. Render Voronoi Cells
      for (let nIdx = 0; nIdx < currentNodes.length; nIdx++) {
        const node = currentNodes[nIdx];
        if (!node || !node.cellVertices || node.cellVertices.length < 3) continue;

        const isSel = selId === node.id;

        ctx.beginPath();
        const v0 = node.cellVertices[0];
        if (v0 && isFinite(v0.x) && isFinite(v0.y)) {
          ctx.moveTo(v0.x, v0.y);
          for (let i = 1; i < node.cellVertices.length; i++) {
            const vi = node.cellVertices[i];
            if (vi && isFinite(vi.x) && isFinite(vi.y)) {
              ctx.lineTo(vi.x, vi.y);
            }
          }
          ctx.closePath();

          if (showFills) {
            ctx.fillStyle = isSel ? 'rgba(6, 182, 212, 0.28)' : `${node.color}14`;
            ctx.fill();
          }

          if (showMesh) {
            ctx.strokeStyle = isSel ? '#22d3ee' : `${node.color}55`;
            ctx.lineWidth = isSel ? 2.5 : 1.2;
            ctx.stroke();
          }
        }

        // Draw Centroid Target Reticle
        if (showCentroids && node.targetCentroid && isFinite(node.targetCentroid.x) && isFinite(node.targetCentroid.y)) {
          const cx = node.targetCentroid.x;
          const cy = node.targetCentroid.y;

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.stroke();

          if (isFinite(node.position.x) && isFinite(node.position.y)) {
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = `${node.color}99`;
            ctx.beginPath();
            ctx.moveTo(node.position.x, node.position.y);
            ctx.lineTo(cx, cy);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // Velocity Vector
        if (showVectors && isFinite(node.velocity.x) && isFinite(node.velocity.y)) {
          if (Math.abs(node.velocity.x) > 0.05 || Math.abs(node.velocity.y) > 0.05) {
            const vx = node.velocity.x * 6;
            const vy = node.velocity.y * 6;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(node.position.x, node.position.y);
            ctx.lineTo(node.position.x + vx, node.position.y + vy);
            ctx.stroke();
          }
        }

        // Drone Agent Core
        const px = node.position.x;
        const py = node.position.y;
        if (isFinite(px) && isFinite(py)) {
          try {
            const gradient = ctx.createRadialGradient(px, py, 1, px, py, 10);
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();
          } catch {
            // Safe fallback if gradient bounds fail
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = isSel ? '#ffffff' : node.color;
          ctx.beginPath();
          ctx.arc(px, py, isSel ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fill();

          if (isSel) {
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(px, py, 14, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // 5. Render Exclusion / Threat Zones
      const currentZones = zonesRef.current;
      for (let zIdx = 0; zIdx < currentZones.length; zIdx++) {
        const zone = currentZones[zIdx];
        if (!zone || !isFinite(zone.x) || !isFinite(zone.y) || !isFinite(zone.radius) || zone.radius <= 0) continue;

        const safeR = Math.max(12, zone.radius);
        try {
          const zoneGrad = ctx.createRadialGradient(zone.x, zone.y, Math.min(8, safeR * 0.2), zone.x, zone.y, safeR);
          zoneGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
          zoneGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.15)');
          zoneGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
          ctx.fillStyle = zoneGrad;
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, safeR, 0, Math.PI * 2);
          ctx.fill();
        } catch {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, safeR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, safeR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(zone.x - 8, zone.y - 8);
        ctx.lineTo(zone.x + 8, zone.y + 8);
        ctx.moveTo(zone.x + 8, zone.y - 8);
        ctx.lineTo(zone.x - 8, zone.y + 8);
        ctx.stroke();

        ctx.fillStyle = '#fca5a5';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(zone.label || 'THREAT-ZONE', zone.x, zone.y + safeR + 14);
      }

      // 6. Radar Sweep line effect
      if (showRadarSweep) {
        sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);
        const sweepEndX = centerX + Math.cos(sweepAngle) * maxR;
        const sweepEndY = centerY + Math.sin(sweepAngle) * maxR;

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(sweepEndX, sweepEndY);
        ctx.stroke();
      }

      // 7. Tactical Frame / Corners
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      const cornerLen = 16;
      ctx.beginPath();
      ctx.moveTo(8, 8 + cornerLen);
      ctx.lineTo(8, 8);
      ctx.lineTo(8 + cornerLen, 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 8 - cornerLen, 8);
      ctx.lineTo(width - 8, 8);
      ctx.lineTo(width - 8, 8 + cornerLen);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(8, height - 8 - cornerLen);
      ctx.lineTo(8, height - 8);
      ctx.lineTo(8 + cornerLen, height - 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 8 - cornerLen, height - 8);
      ctx.lineTo(width - 8, height - 8);
      ctx.lineTo(width - 8, height - 8 - cornerLen);
      ctx.stroke();

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [showFills, showMesh, showCentroids, showVectors, showRadarSweep, onEnergyUpdate, onLatencyUpdate, onCoverageUpdate]);

  // Pointer interactions on canvas
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
    const scaleX = canvasDimsRef.current.width / rect.width;
    const scaleY = canvasDimsRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    if (!isFinite(pos.x) || !isFinite(pos.y)) return;

    if (interactionMode === 'ADD_THREAT') {
      const newZone: ExclusionZone = {
        id: `threat-${Date.now()}`,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        radius: 55,
        label: `NO-FLY-ZONE-${exclusionZones.length + 1}`,
        type: 'NO_FLY',
        severity: 'CRITICAL',
      };
      setExclusionZones((prev) => [...prev, newZone]);
      setInteractionMode('DRAG_NODE');
      return;
    }

    for (const zone of zonesRef.current) {
      if (Math.hypot(pos.x - zone.x, pos.y - zone.y) < zone.radius) {
        activeDragRef.current = {
          type: 'zone',
          id: zone.id,
          offsetX: pos.x - zone.x,
          offsetY: pos.y - zone.y,
        };
        try {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        return;
      }
    }

    let closestNode: DroneNode | null = null;
    let minDist = 30;

    for (const node of nodesRef.current) {
      const d = Math.hypot(pos.x - node.position.x, pos.y - node.position.y);
      if (d < minDist) {
        minDist = d;
        closestNode = node;
      }
    }

    if (closestNode) {
      setSelectedNode(closestNode);
      activeDragRef.current = {
        type: 'node',
        id: closestNode.id,
        offsetX: pos.x - closestNode.position.x,
        offsetY: pos.y - closestNode.position.y,
      };
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    } else {
      setSelectedNode(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragRef.current) return;
    const pos = getCanvasCoords(e);
    if (!isFinite(pos.x) || !isFinite(pos.y)) return;
    const { type, id, offsetX, offsetY } = activeDragRef.current;
    const { width, height } = canvasDimsRef.current;

    const newX = Math.max(15, Math.min(width - 15, pos.x - offsetX));
    const newY = Math.max(15, Math.min(height - 15, pos.y - offsetY));

    if (type === 'node') {
      nodesRef.current = nodesRef.current.map((n) =>
        n.id === id ? { ...n, position: { x: newX, y: newY } } : n
      );
    } else if (type === 'zone') {
      setExclusionZones((prev) =>
        prev.map((z) => (z.id === id ? { ...z, x: newX, y: newY } : z))
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeDragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      activeDragRef.current = null;
    }
  };

  const handleInjectThreat = () => {
    const { width, height } = canvasDimsRef.current;
    const newZone: ExclusionZone = {
      id: `threat-${Date.now()}`,
      x: Math.floor(width * 0.25 + Math.random() * (width * 0.5)),
      y: Math.floor(height * 0.25 + Math.random() * (height * 0.5)),
      radius: Math.floor(45 + Math.random() * 35),
      label: `AIRSPACE-DENIAL-${exclusionZones.length + 1}`,
      type: 'NO_FLY',
      severity: 'CRITICAL',
    };
    setExclusionZones((prev) => [...prev, newZone]);
  };

  const handleClearThreats = () => {
    setExclusionZones([]);
  };

  const stepSingleIteration = () => {
    const { width, height } = canvasDimsRef.current;
    const { updatedNodes, coverageEfficiency: cov, maxDistortionRatio: dist } = executeLloydStep(
      nodesRef.current,
      width,
      height,
      zonesRef.current,
      gainRef.current,
      dampingRef.current
    );
    nodesRef.current = updatedNodes;
    const calibratedLatency = getCalibratedLatencyBenchmark();
    setCycleLatencyUs(calibratedLatency);
    setCoverageEfficiency(cov);
    setMaxDistortionRatio(dist);
    if (onLatencyUpdate) onLatencyUpdate(calibratedLatency);
    if (onCoverageUpdate) onCoverageUpdate(cov);
    if (onEnergyUpdate) onEnergyUpdate(computeLyapunovEnergy(updatedNodes));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Clearance Strip / Telemetry HUD */}
      <div 
        role="region"
        aria-label="Live Telemetry Clearance Strip"
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-mono shadow-md"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-200 font-bold tracking-wider">
              {isRunning ? 'SWARM ENGINE: LIVE RELAXATION' : 'SWARM ENGINE: FROZEN STEP'}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="text-slate-300">
            <span className="text-slate-400">Coverage Efficiency: </span>
            <span className="text-emerald-400 font-bold">{coverageEfficiency.toFixed(2)}%</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="text-slate-300">
            <span className="text-slate-400">Max Distortion Ratio: </span>
            <span className="text-cyan-400 font-bold">{maxDistortionRatio.toFixed(2)}:1</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="text-slate-300">
            <span className="text-slate-400">Partition Cycle: </span>
            <span className="text-violet-400 font-bold">{cycleLatencyUs.toFixed(1)} µs</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Threats:</span>
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold text-xs">
            {exclusionZones.length} ZONES
          </span>
        </div>
      </div>

      {/* Main Canvas Viewport & Node Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="lg:col-span-3 relative flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl"
        >
          {/* Canvas Header / Mode Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs sm:text-sm font-mono text-slate-300">
            <div className="flex items-center gap-2 font-bold tracking-wide">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>RADAR SECTOR // 2D DOMAIN [0, 960] x [0, 560]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Mode:</span>
              <button
                type="button"
                onClick={() => setInteractionMode(interactionMode === 'DRAG_NODE' ? 'ADD_THREAT' : 'DRAG_NODE')}
                className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                  interactionMode === 'ADD_THREAT'
                    ? 'bg-red-950/80 text-red-300 border-red-600'
                    : 'bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500'
                }`}
                aria-label="Toggle threat placement mode"
              >
                {interactionMode === 'ADD_THREAT' ? '✚ Click Canvas to Drop Threat' : 'Interactive Drag & Drop'}
              </button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative w-full overflow-hidden flex-1 min-h-[440px] cursor-crosshair">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full block touch-none"
              aria-label="Interactive Voronoi Partition Radar Canvas"
            />

            <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/80 backdrop-blur-sm">
              <span>Drag any drone node or threat circle to warp Voronoi boundaries</span>
            </div>
          </div>

          {/* Canvas Bottom Quick Toggles */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showFills}
                  onChange={(e) => setShowFills(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Cell Fills</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showMesh}
                  onChange={(e) => setShowMesh(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Mesh Borders</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showCentroids}
                  onChange={(e) => setShowCentroids(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Centroid Reticles</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Velocity Vectors</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showRadarSweep}
                  onChange={(e) => setShowRadarSweep(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Radar Sweep</span>
              </label>
            </div>

            <div className="text-[11px] text-slate-400">
              Active Agents: <span className="text-cyan-400 font-bold">{nodeCount}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Inspector Sidebar */}
        <div 
          role="complementary"
          aria-label="Node Telemetry Inspector"
          className="lg:col-span-1 flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-slate-100 font-mono text-base tracking-wide">
                NODE TELEMETRY
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {selectedNode ? selectedNode.code : 'AUTONOMOUS'}
            </span>
          </div>

          {selectedNode ? (
            <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span>IDENTIFIER:</span>
                  <span className="text-cyan-300 font-bold">{selectedNode.code}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>STATUS:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    selectedNode.status === 'OPTIMAL'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : selectedNode.status === 'WARNING'
                      ? 'bg-red-950/80 text-red-300 border-red-800'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>BATTERY:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.battery}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="text-slate-400 text-xs font-bold tracking-wider uppercase border-b border-slate-800/80 pb-1">
                  SPATIAL COORDINATES
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Position (x, y):</span>
                  <span className="text-slate-100">
                    [{selectedNode.position.x.toFixed(1)}, {selectedNode.position.y.toFixed(1)}]
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Centroid C_i:</span>
                  <span className="text-slate-100">
                    [{selectedNode.targetCentroid.x.toFixed(1)}, {selectedNode.targetCentroid.y.toFixed(1)}]
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Centroid Error ||e_i||:</span>
                  <span className="text-cyan-400 font-bold">
                    {selectedNode.lastDistanceToCentroid.toFixed(2)} px
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="text-slate-400 text-xs font-bold tracking-wider uppercase border-b border-slate-800/80 pb-1">
                  VORONOI PARTITION METRICS
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cell Area A_i:</span>
                  <span className="text-violet-300 font-bold">
                    {Math.round(selectedNode.cellArea)} px²
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Load Ratio:</span>
                  <span className="text-slate-100 font-bold">
                    {(selectedNode.loadRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Polygon Vertices:</span>
                  <span className="text-slate-400">
                    {selectedNode.cellVertices.length} edges
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 font-mono text-xs flex-1 border border-dashed border-slate-800 rounded-lg">
              <Crosshair className="w-8 h-8 text-slate-600 mb-2" />
              <p className="font-bold text-slate-300 mb-1">NO NODE SELECTED</p>
              <p className="text-[12px] text-slate-500">
                Click any drone node on the radar sector to inspect spatial telemetry and Voronoi cell boundaries.
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs flex flex-col gap-1.5 mt-auto">
            <div className="flex justify-between text-slate-400">
              <span>TOTAL COVERAGE:</span>
              <span className="text-emerald-400 font-bold">100.0% DOMAIN</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ALGORITHM:</span>
              <span className="text-cyan-400">DECENTRALIZED CVT</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>STABILITY:</span>
              <span className="text-violet-400">LASALLE INVARIANT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Control Dock */}
      <div 
        role="region"
        aria-label="Simulation Interactive Control Dock"
        className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono tracking-wide">
              INTERACTIVE CONTROL DOCK // LLOYD DYNAMICS
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              aria-label={isRunning ? 'Pause simulation' : 'Resume simulation'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Simulation' : 'Resume Simulation'}</span>
            </button>

            <button
              type="button"
              onClick={stepSingleIteration}
              disabled={isRunning}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Execute single Lloyd relaxation step"
            >
              Step (1 Cycle)
            </button>

            <button
              type="button"
              onClick={handleInjectThreat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-700 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              aria-label="Inject threat exclusion zone"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>[Inject Exclusion Zone]</span>
            </button>

            <button
              type="button"
              onClick={() => resetSwarm(nodeCount)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Randomize positions"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>[Randomize Positions]</span>
            </button>

            <button
              type="button"
              onClick={handleClearThreats}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
              aria-label="Clear all exclusion zones"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>[Clear Threats]</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Lloyd Iteration Gain Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <label htmlFor="lloyd-gain-slider" className="text-slate-300 font-semibold">
                Lloyd Iteration Gain (γ)
              </label>
              <span className="text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {lloydGain.toFixed(2)}x
              </span>
            </div>
            <input
              id="lloyd-gain-slider"
              type="range"
              min="0.10"
              max="2.00"
              step="0.05"
              value={lloydGain}
              onChange={(e) => setLloydGain(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              aria-label="Lloyd iteration gain slider"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>0.10 (Creep)</span>
              <span>1.00 (Standard)</span>
              <span>2.00 (Aggressive)</span>
            </div>
          </div>

          {/* Coverage Damping Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <label htmlFor="coverage-damping-slider" className="text-slate-300 font-semibold">
                Coverage Damping (c)
              </label>
              <span className="text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {coverageDamping.toFixed(2)}
              </span>
            </div>
            <input
              id="coverage-damping-slider"
              type="range"
              min="0.00"
              max="0.80"
              step="0.05"
              value={coverageDamping}
              onChange={(e) => setCoverageDamping(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              aria-label="Coverage damping slider"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>0.00 (Undamped)</span>
              <span>0.25 (Critical)</span>
              <span>0.80 (Heavy Drag)</span>
            </div>
          </div>

          {/* Swarm Density Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <label htmlFor="swarm-density-slider" className="text-slate-300 font-semibold">
                Swarm Density (Nodes)
              </label>
              <span className="text-violet-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {nodeCount} NODES
              </span>
            </div>
            <input
              id="swarm-density-slider"
              type="range"
              min="24"
              max="64"
              step="4"
              value={nodeCount}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                setNodeCount(count);
                resetSwarm(count);
              }}
              className="w-full accent-violet-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              aria-label="Swarm density node count slider"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>24 Nodes</span>
              <span>48 Nodes (Default)</span>
              <span>64 Nodes (Max)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
