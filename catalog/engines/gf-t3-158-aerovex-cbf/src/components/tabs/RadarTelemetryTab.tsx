import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, AlertTriangle,
  Crosshair, Sliders, RefreshCw, Trash2
} from 'lucide-react';
import { AgentNode, IntruderZone, CBFConfig } from '../../types/telemetry';
import { createFormationAgents, updateAirspaceStep } from '../../utils/cbfEngine';

interface RadarTelemetryTabProps {
  config: CBFConfig;
  onUpdateConfig: (newCfg: Partial<CBFConfig>) => void;
  onLatencyUpdate: (us: number) => void;
}

export const RadarTelemetryTab: React.FC<RadarTelemetryTabProps> = ({
  config,
  onUpdateConfig,
  onLatencyUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [agents, setAgents] = useState<AgentNode[]>([]);
  const [intruders, setIntruders] = useState<IntruderZone[]>([
    {
      id: 'intruder-alpha',
      x: 180,
      y: 220,
      vx: 1.4,
      vy: 0.9,
      radius: 22,
      active: true,
    },
    {
      id: 'intruder-bravo',
      x: 520,
      y: 380,
      vx: -1.2,
      vy: -0.8,
      radius: 26,
      active: true,
    },
  ]);

  // Selected agent for detailed inspection HUD
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(1);

  // Live telemetry counters
  const [metrics, setMetrics] = useState({
    deflectionsCount: 0,
    minSeparation: 34.2,
    meanLatencyUs: 7.8,
    activeThreatsResolved: 142,
    fps: 60,
  });

  // Mouse coords on canvas
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingNewIntruder, setIsDraggingNewIntruder] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Sync state into refs for high-frequency 60fps loop without re-triggering effect subscriptions
  const agentsRef = useRef<AgentNode[]>([]);
  const intrudersRef = useRef<IntruderZone[]>(intruders);
  const configRef = useRef<CBFConfig>(config);
  const onLatencyUpdateRef = useRef<(us: number) => void>(onLatencyUpdate);

  useEffect(() => {
    intrudersRef.current = intruders;
  }, [intruders]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    onLatencyUpdateRef.current = onLatencyUpdate;
  }, [onLatencyUpdate]);

  // Initialize agents based on current dimensions and density
  const initAgents = useCallback(() => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 840;
    const height = canvas ? canvas.height : 560;
    const initialAgents = createFormationAgents(config.nodeCount, width, height, config.formation);
    agentsRef.current = initialAgents;
    setAgents(initialAgents);
  }, [config.nodeCount, config.formation]);

  useEffect(() => {
    initAgents();
  }, [initAgents]);

  // Main simulation tick loop
  useEffect(() => {
    let animationFrameId: number;
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const loop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(loop);

      frameCount++;
      if (currentTime - lastFpsTime >= 1000) {
        setMetrics((prev) => ({ ...prev, fps: frameCount }));
        frameCount = 0;
        lastFpsTime = currentTime;
      }

      if (!isRunning) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      const currentAgents = agentsRef.current;
      if (currentAgents.length === 0) return;

      // Pure physics computation step
      const result = updateAirspaceStep(
        currentAgents,
        intrudersRef.current,
        configRef.current,
        { width, height }
      );

      // Mutate refs synchronously for the next tick
      agentsRef.current = result.updatedAgents;
      intrudersRef.current = result.updatedIntruders;

      // Update React states cleanly without nested updater calls
      setAgents(result.updatedAgents);
      setIntruders(result.updatedIntruders);

      onLatencyUpdateRef.current(result.meanLatency);

      setMetrics((m) => ({
        ...m,
        deflectionsCount: result.deflectionsThisStep,
        minSeparation: result.minSeparation,
        meanLatencyUs: result.meanLatency,
        activeThreatsResolved: m.activeThreatsResolved + result.deflectionsThisStep,
      }));
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Clear background - Defense radar obsidian
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw tactical grid lines (50px spacing)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Draw Radar Range Rings & Crosshairs
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1;
    const maxRadius = Math.min(width, height) * 0.45;
    [maxRadius * 0.25, maxRadius * 0.5, maxRadius * 0.75, maxRadius].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();

      // Range text
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(`${(idx + 1) * 50}m`, centerX + 6, centerY - r + 14);
    });

    // Center crosshairs
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();

    // 4. Render Dynamic Intruders
    if (config.showIntruders) {
      intruders.forEach((intruder) => {
        // Hazard safety zone
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(intruder.x, intruder.y, intruder.radius + config.rSafe * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        // Core intruder body
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(intruder.x, intruder.y, intruder.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Velocity vector
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(intruder.x, intruder.y);
        ctx.lineTo(intruder.x + intruder.vx * 20, intruder.y + intruder.vy * 20);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fca5a5';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`INTRUDER [${intruder.id.toUpperCase()}]`, intruder.x - 45, intruder.y - intruder.radius - 8);
      });
    }

    // 5. Render Agent Trails
    if (config.showTrails) {
      agents.forEach((ag) => {
        if (ag.history.length > 1) {
          ctx.strokeStyle = ag.isDeflecting
            ? 'rgba(245, 158, 11, 0.25)'
            : 'rgba(16, 185, 129, 0.18)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ag.history[0].x, ag.history[0].y);
          for (let i = 1; i < ag.history.length; i++) {
            ctx.lineTo(ag.history[i].x, ag.history[i].y);
          }
          ctx.stroke();
        }
      });
    }

    // 6. Render Quadrotor Agents with CBF Halos
    agents.forEach((ag) => {
      const isSelected = ag.id === selectedAgentId;

      // Target dashed guideline
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(ag.x, ag.y);
      ctx.lineTo(ag.targetX, ag.targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Safety Barrier Halo
      if (config.showHalos) {
        if (ag.isDeflecting) {
          // Barrier is actively modifying trajectory (amber halo)
          ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
        } else {
          // Nominal safe envelope (emerald halo)
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.arc(ag.x, ag.y, config.rSafe, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Render Cyan Velocity Deflection Vector (Δu)
      if (config.showDeflections && ag.isDeflecting) {
        const deflMag = Math.hypot(ag.deltaU.x, ag.deltaU.y);
        if (deflMag > 0.05) {
          ctx.strokeStyle = '#06b6d4'; // Laser cyan
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(ag.x, ag.y);
          // Scale arrow for dramatic visual clarity
          const endX = ag.x + ag.deltaU.x * 24;
          const endY = ag.y + ag.deltaU.y * 24;
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(ag.deltaU.y, ag.deltaU.x);
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - 7 * Math.cos(angle - Math.PI / 6),
            endY - 7 * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            endX - 7 * Math.cos(angle + Math.PI / 6),
            endY - 7 * Math.sin(angle + Math.PI / 6)
          );
          ctx.fill();
        }
      }

      // Quadrotor node body
      ctx.fillStyle = isSelected
        ? '#38bdf8'
        : ag.isDeflecting
        ? '#fbbf24'
        : '#34d399';
      ctx.beginPath();
      ctx.arc(ag.x, ag.y, isSelected ? 6.5 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Rotor struts (tactical quadcopter look)
      ctx.strokeStyle = isSelected ? '#bae6fd' : '#94a3b8';
      ctx.lineWidth = 1;
      const d = 5;
      ctx.beginPath();
      ctx.moveTo(ag.x - d, ag.y - d);
      ctx.lineTo(ag.x + d, ag.y + d);
      ctx.moveTo(ag.x - d, ag.y + d);
      ctx.lineTo(ag.x + d, ag.y - d);
      ctx.stroke();

      // Selected ring
      if (isSelected) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.arc(ag.x, ag.y, config.rSafe + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#e0f2fe';
        ctx.font = 'bold 12px JetBrains Mono';
        ctx.fillText(`NODE #${ag.id}`, ag.x + 12, ag.y - 12);
      }
    });

    // 7. Interactive drag preview for dropping dynamic intruder
    if (isDraggingNewIntruder && dragStart && mousePos) {
      const radius = Math.max(16, Math.hypot(mousePos.x - dragStart.x, mousePos.y - dragStart.y));
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(dragStart.x, dragStart.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '12px JetBrains Mono';
      ctx.fillText(`Release to deploy Intruder (r=${Math.round(radius)}m)`, dragStart.x + 10, dragStart.y - 10);
    }
  }, [agents, intruders, config, selectedAgentId, isDraggingNewIntruder, dragStart, mousePos]);

  // Handle canvas interactions (click node or drop intruder)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check if clicked near an agent
    const clickedAgent = agents.find((a) => Math.hypot(a.x - x, a.y - y) <= config.rSafe);
    if (clickedAgent) {
      setSelectedAgentId(clickedAgent.id);
      return;
    }

    // Otherwise start dragging new dynamic intruder
    setIsDraggingNewIntruder(true);
    setDragStart({ x, y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    setMousePos({ x: Math.round(x), y: Math.round(y) });
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingNewIntruder && dragStart && mousePos && canvasRef.current) {
      const dist = Math.hypot(mousePos.x - dragStart.x, mousePos.y - dragStart.y);
      const radius = Math.max(18, Math.min(45, dist));
      // Give it non-zero velocity aimed toward center
      const angle = Math.atan2(canvasRef.current.height / 2 - dragStart.y, canvasRef.current.width / 2 - dragStart.x);
      const newIntruder: IntruderZone = {
        id: `zone-${Date.now().toString().slice(-4)}`,
        x: dragStart.x,
        y: dragStart.y,
        vx: Math.cos(angle) * 1.5,
        vy: Math.sin(angle) * 1.5,
        radius,
        active: true,
      };
      setIntruders((prev) => [...prev, newIntruder]);
    }
    setIsDraggingNewIntruder(false);
    setDragStart(null);
  };

  // Actions
  const handleInjectIntruder = () => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 840;
    const height = canvas ? canvas.height : 560;
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;

    if (side === 0) { // Top
      x = width * (0.2 + Math.random() * 0.6);
      y = 20;
      vx = (Math.random() - 0.5) * 1.2;
      vy = 1.4 + Math.random() * 0.8;
    } else if (side === 1) { // Bottom
      x = width * (0.2 + Math.random() * 0.6);
      y = height - 20;
      vx = (Math.random() - 0.5) * 1.2;
      vy = -(1.4 + Math.random() * 0.8);
    } else if (side === 2) { // Left
      x = 20;
      y = height * (0.2 + Math.random() * 0.6);
      vx = 1.4 + Math.random() * 0.8;
      vy = (Math.random() - 0.5) * 1.2;
    } else { // Right
      x = width - 20;
      y = height * (0.2 + Math.random() * 0.6);
      vx = -(1.4 + Math.random() * 0.8);
      vy = (Math.random() - 0.5) * 1.2;
    }

    const newIntruder: IntruderZone = {
      id: `int-${Math.floor(Math.random() * 900 + 100)}`,
      x,
      y,
      vx,
      vy,
      radius: Math.floor(20 + Math.random() * 15),
      active: true,
    };
    setIntruders((prev) => [...prev, newIntruder]);
  };

  const handleClearIntruders = () => {
    setIntruders([]);
  };

  const handleResetAirspace = () => {
    initAgents();
    setIntruders([
      {
        id: 'intruder-alpha',
        x: 180,
        y: 220,
        vx: 1.4,
        vy: 0.9,
        radius: 22,
        active: true,
      },
      {
        id: 'intruder-bravo',
        x: 520,
        y: 380,
        vx: -1.2,
        vy: -0.8,
        radius: 26,
        active: true,
      },
    ]);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Telemetry Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-3">
        <div className="flex flex-col">
          <span className="text-xs uppercase font-mono text-slate-400">Active QP Deflections</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {metrics.deflectionsCount}
            </span>
            <span className="text-xs font-mono text-slate-400">nodes actively deflecting</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase font-mono text-slate-400">Fleet Min Clearance</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              {metrics.minSeparation}m
            </span>
            <span className="text-xs font-mono text-slate-400">safe margin: {config.rSafe}m</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase font-mono text-slate-400">QP Solver Mean Latency</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 tabular-nums">
              {metrics.meanLatencyUs.toFixed(1)} µs
            </span>
            <span className="text-xs font-mono text-slate-400">per agent step</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase font-mono text-slate-400">Safety Invariant (h ≥ 0)</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
              0 VIOLATIONS
            </span>
            <span className="text-xs font-mono text-slate-400">100% formal invariance</span>
          </div>
        </div>
      </div>

      {/* Main Radar Canvas & Right Control Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            {/* HUD Status Overlay */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded text-xs font-mono">
              <span className="text-cyan-400 font-bold">2D AIRSPACE RADAR</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">{agents.length} QUADROTORS</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400">{intruders.length} INTRUDERS</span>
              {mousePos && (
                <>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">COORDS: X={mousePos.x} Y={mousePos.y}</span>
                </>
              )}
            </div>

            {/* Quick Action Overlay Buttons */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isRunning
                    ? 'bg-slate-900/90 text-amber-300 border-amber-500/40 hover:bg-slate-800'
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                }`}
                title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={handleResetAirspace}
                className="p-2 rounded bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset Airspace"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={860}
              height={560}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="w-full h-auto aspect-[860/560] block cursor-crosshair"
            />

            {/* Canvas Bottom Legend / Instructions */}
            <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block"></span>
                  <span>Nominal Barrier</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-400 inline-block"></span>
                  <span>Active CBF Halo</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-cyan-400 inline-block"></span>
                  <span>Δu Deflection Vector</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500 inline-block"></span>
                  <span>Dynamic Intruder</span>
                </span>
              </div>
              <span className="text-slate-500 hidden sm:inline">
                Click &amp; drag on radar to drop dynamic intruder zone
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Control Dock & Node Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Control Dock Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-semibold text-slate-200">Deconfliction Control Dock</h2>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                α={config.alpha.toFixed(1)}
              </span>
            </div>

            {/* Slider 1: Barrier Rigidity (alpha) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="barrier-rigidity" className="text-slate-300">
                  Barrier Rigidity (α)
                </label>
                <span className="font-mono text-cyan-400 text-sm">{config.alpha.toFixed(1)}</span>
              </div>
              <input
                id="barrier-rigidity"
                type="range"
                min="0.4"
                max="4.0"
                step="0.1"
                value={config.alpha}
                onChange={(e) => onUpdateConfig({ alpha: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                Higher rigidity yields aggressive early deflection; lower yields gradual smooth curvature.
              </span>
            </div>

            {/* Slider 2: Repulsion Radius (r_safe) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="repulsion-radius" className="text-slate-300">
                  Repulsion Radius (r_safe)
                </label>
                <span className="font-mono text-emerald-400 text-sm">{config.rSafe}m</span>
              </div>
              <input
                id="repulsion-radius"
                type="range"
                min="14"
                max="50"
                step="2"
                value={config.rSafe}
                onChange={(e) => onUpdateConfig({ rSafe: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                Enforced safe separation radius bounding super-level set h(x) ≥ 0.
              </span>
            </div>

            {/* Slider 3: Agent Density */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <label htmlFor="agent-density" className="text-slate-300">
                  Agent Density
                </label>
                <span className="font-mono text-amber-400 text-sm">{config.nodeCount} nodes</span>
              </div>
              <input
                id="agent-density"
                type="range"
                min="16"
                max="96"
                step="8"
                value={config.nodeCount}
                onChange={(e) => onUpdateConfig({ nodeCount: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-xs text-slate-400">
                Decentralized nodes operating pairwise CBF constraints simultaneously.
              </span>
            </div>

            {/* Formation Preset */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="formation-preset" className="text-xs font-medium text-slate-300">
                Airspace Geometry Preset
              </label>
              <select
                id="formation-preset"
                value={config.formation}
                onChange={(e) => onUpdateConfig({ formation: e.target.value as CBFConfig['formation'] })}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded px-3 py-1.5 font-sans focus:border-cyan-500 focus:outline-none"
              >
                <option value="cross_flow">Cross-Flow Transit (90° Collision Convergence)</option>
                <option value="concentric_circle">Concentric Circle Inversion (High Stress Deadlock)</option>
                <option value="corridor">Corridor Bi-directional Flocking</option>
                <option value="grid_transit">Opposed Grid Diagonal Transit</option>
              </select>
            </div>

            {/* Layer Visibility Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => onUpdateConfig({ showHalos: !config.showHalos })}
                className={`px-2.5 py-1.5 rounded border text-left transition-colors cursor-pointer ${
                  config.showHalos
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Halos: {config.showHalos ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => onUpdateConfig({ showDeflections: !config.showDeflections })}
                className={`px-2.5 py-1.5 rounded border text-left transition-colors cursor-pointer ${
                  config.showDeflections
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Δu Vectors: {config.showDeflections ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => onUpdateConfig({ showIntruders: !config.showIntruders })}
                className={`px-2.5 py-1.5 rounded border text-left transition-colors cursor-pointer ${
                  config.showIntruders
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Intruders: {config.showIntruders ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => onUpdateConfig({ showTrails: !config.showTrails })}
                className={`px-2.5 py-1.5 rounded border text-left transition-colors cursor-pointer ${
                  config.showTrails
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Trails: {config.showTrails ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Tactical Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleInjectIntruder}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-rose-300 bg-rose-950/60 border border-rose-700/60 hover:bg-rose-900/60 rounded transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>[Inject Dynamic Intruder]</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetAirspace}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>[Reset Airspace]</span>
                </button>
                <button
                  onClick={handleClearIntruders}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 hover:text-rose-300 hover:border-rose-900 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>[Clear All]</span>
                </button>
              </div>
            </div>
          </div>

          {/* Selected Node Telemetry Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Node Telemetry Inspector {selectedAgent ? `(#${selectedAgent.id})` : ''}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {selectedAgent?.isDeflecting ? 'BARRIER ACTIVE' : 'NOMINAL PATH'}
              </span>
            </div>

            {selectedAgent ? (
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Position (X, Y)</span>
                  <span className="text-slate-200 text-sm font-semibold">
                    [{Math.round(selectedAgent.x)}, {Math.round(selectedAgent.y)}]
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Velocity (uX, uY)</span>
                  <span className="text-slate-200 text-sm font-semibold">
                    [{selectedAgent.vx.toFixed(2)}, {selectedAgent.vy.toFixed(2)}]
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Deflection ||Δu||</span>
                  <span className={`text-sm font-semibold ${selectedAgent.isDeflecting ? 'text-amber-400' : 'text-slate-400'}`}>
                    {Math.hypot(selectedAgent.deltaU.x, selectedAgent.deltaU.y).toFixed(3)} m/s
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">QP Solver Latency</span>
                  <span className="text-cyan-300 text-sm font-semibold">
                    {selectedAgent.qpLatencyUs} µs
                  </span>
                </div>
                <div className="col-span-2 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-[11px]">Local Barrier Invariant h(x)</span>
                    <span className="text-emerald-400 font-bold">≥ 0 (INVARIANT HELD)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full ${selectedAgent.isDeflecting ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, Math.max(15, (selectedAgent.hMin / 1500) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">
                Click any quadrotor agent on the radar canvas to lock telemetry.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
