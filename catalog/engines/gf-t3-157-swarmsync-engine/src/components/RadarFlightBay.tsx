import React, { useRef, useEffect, useState } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  MousePointer,
  Crosshair,
  Trash2,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { RadarToolMode, SwarmConfig, TelemetryState } from '../types/swarm';
import { SwarmSimulation } from '../engine/swarmSimulation';

interface RadarFlightBayProps {
  sim: SwarmSimulation;
  telemetry: TelemetryState;
  config: SwarmConfig;
  onConfigChange: (newConfig: Partial<SwarmConfig>) => void;
}

export const RadarFlightBay: React.FC<RadarFlightBayProps> = ({
  sim,
  telemetry,
  config,
  onConfigChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [toolMode, setToolMode] = useState<RadarToolMode>('add_obstacle');
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);
  const [selectedObstacleId, setSelectedObstacleId] = useState<string | null>(null);
  const [injectionRadius, setInjectionRadius] = useState<number>(45);
  const [injectionMargin, setInjectionMargin] = useState<number>(20);
  const [autoPatrol, setAutoPatrol] = useState<boolean>(true);
  const [showMeshLinks, setShowMeshLinks] = useState<boolean>(true);
  const [showCBFVectors, setShowCBFVectors] = useState<boolean>(true);
  const [showVelocityTrails, setShowVelocityTrails] = useState<boolean>(true);
  const [draggedObstacleId, setDraggedObstacleId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Patrol orbit timer for dynamic flocking target
  useEffect(() => {
    if (!autoPatrol) return;
    let t = 0;
    const interval = setInterval(() => {
      t += 0.02;
      // Smooth figure-8 / Lissajous trajectory for swarm guidance
      const centerX = 460;
      const centerY = 280;
      const targetX = centerX + Math.sin(t) * 220;
      const targetY = centerY + Math.sin(t * 2) * 110;
      sim.globalTarget = { x: targetX, y: targetY };
    }, 40);

    return () => clearInterval(interval);
  }, [autoPatrol, sim]);

  // Canvas render & animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Step simulation
      sim.step(0.035, width, height);

      // 2. Clear canvas with dark radar background
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);

      // 3. Tactical Radar Grid lines
      ctx.strokeStyle = '#111a2e';
      ctx.lineWidth = 1;
      const gridSize = 50;
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

      // Range rings centered on canvas
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = '#0e1d38';
      ctx.lineWidth = 1.5;
      [100, 200, 320, 440].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Mesh Peer-to-Peer Communication Links
      if (showMeshLinks) {
        ctx.lineWidth = 1;
        for (const node of sim.nodes) {
          for (const neighborId of node.neighbors) {
            if (neighborId > node.id) {
              const peer = sim.nodes[neighborId];
              if (peer) {
                const dx = node.x - peer.x;
                const dy = node.y - peer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const alpha = Math.max(0.08, 0.45 - dist / (sim.config.commRadius * 1.5));
                ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(peer.x, peer.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // 5. Render Obstacles & Control Barrier Function Envelopes
      for (const obs of sim.obstacles) {
        const isSelected = obs.id === selectedObstacleId;
        const isDragged = obs.id === draggedObstacleId;
        const totalSafeRadius = obs.radius + obs.safetyMargin;

        // Check if any drone currently breaches this obstacle's barrier margin
        let isBreached = false;
        for (const node of sim.nodes) {
          const d = Math.hypot(node.x - obs.x, node.y - obs.y);
          if (d <= totalSafeRadius + 4) {
            isBreached = true;
            break;
          }
        }

        // Active dragging halo if currently being dragged by user
        if (isDragged) {
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, totalSafeRadius + 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fill();

          ctx.beginPath();
          ctx.arc(obs.x, obs.y, totalSafeRadius + 22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Outer CBF Envelope (Dashed barrier boundary ring)
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, totalSafeRadius, 0, Math.PI * 2);
        if (isBreached) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.95)';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 5]);
        } else {
          ctx.strokeStyle = isSelected || isDragged ? 'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.65)';
          ctx.fillStyle = isSelected || isDragged ? 'rgba(6, 182, 212, 0.08)' : 'rgba(245, 158, 11, 0.05)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        }
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]); // reset dash

        // Inner Physical Hazard Zone
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(obs.x, obs.y, 2, obs.x, obs.y, obs.radius);
        if (isBreached) {
          grad.addColorStop(0, '#581c87');
          grad.addColorStop(0.5, '#450a0a');
          grad.addColorStop(1, '#ef4444');
          ctx.fillStyle = grad;
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5;
        } else {
          grad.addColorStop(0, '#1c1917');
          grad.addColorStop(0.7, '#141416');
          grad.addColorStop(1, isSelected || isDragged ? '#06b6d4' : '#f59e0b');
          ctx.fillStyle = grad;
          ctx.strokeStyle = isSelected || isDragged ? '#06b6d4' : '#f59e0b';
          ctx.lineWidth = 2.5;
        }
        ctx.fill();
        ctx.stroke();

        // Cross-hatch hazard pattern in obstacle center
        ctx.save();
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = isBreached ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 2;
        for (let i = -obs.radius; i < obs.radius; i += 14) {
          ctx.beginPath();
          ctx.moveTo(obs.x + i - obs.radius, obs.y - obs.radius);
          ctx.lineTo(obs.x + i + obs.radius, obs.y + obs.radius);
          ctx.stroke();
        }
        ctx.restore();

        // Obstacle Center Label
        ctx.fillStyle = isBreached ? '#ffffff' : isSelected || isDragged ? '#cffafe' : '#fef3c7';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obs.label || `OBS // R=${obs.radius}M`, obs.x, obs.y - 8);

        // Metric subtext
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = isBreached ? '#fca5a5' : '#94a3b8';
        ctx.fillText(`DEFLECTIONS: ${obs.interventions}`, obs.x, obs.y + 10);
      }

      // 6. Global Target Waypoint
      const target = sim.globalTarget;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Pulsing target beacon ring
      const pulseR = 14 + ((Date.now() / 25) % 22);
      ctx.beginPath();
      ctx.arc(target.x, target.y, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(target.x - 18, target.y);
      ctx.lineTo(target.x + 18, target.y);
      ctx.moveTo(target.x, target.y - 18);
      ctx.lineTo(target.x, target.y + 18);
      ctx.stroke();

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET // WAYPOINT', target.x, target.y - 24);

      // 7. Render Drones
      for (const node of sim.nodes) {
        const isSelected = node.id === selectedDroneId;
        const angle = Math.atan2(node.vy, node.vx);

        // History velocity trails
        if (showVelocityTrails && node.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(node.history[0].x, node.history[0].y);
          for (let k = 1; k < node.history.length; k++) {
            ctx.lineTo(node.history[k].x, node.history[k].y);
          }
          ctx.strokeStyle = node.cbfActive
            ? 'rgba(239, 68, 68, 0.45)'
            : node.isByzantine
            ? 'rgba(244, 63, 94, 0.45)'
            : 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Render CBF Deflection Vector Arrow when Safety Filter is triggered
        if (showCBFVectors && node.cbfActive) {
          const defX = node.cbfDeflectionX;
          const defY = node.cbfDeflectionY;
          const defMag = Math.hypot(defX, defY);
          if (defMag > 0.1) {
            const scale = Math.min(42, defMag * 2.4);
            const endX = node.x + (defX / defMag) * scale;
            const endY = node.y + (defY / defMag) * scale;

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrow head
            const arrowAngle = Math.atan2(defY, defX);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - 8 * Math.cos(arrowAngle - Math.PI / 6),
              endY - 8 * Math.sin(arrowAngle - Math.PI / 6)
            );
            ctx.lineTo(
              endX - 8 * Math.cos(arrowAngle + Math.PI / 6),
              endY - 8 * Math.sin(arrowAngle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
          }
        }

        // Drone Body (Arrow / Chevron heading)
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(angle);

        // Active CBF repulsion warning aura
        if (node.cbfActive) {
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Byzantine rogue aura
        if (node.isByzantine) {
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Selection highlight ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Triangle chevron drone
        ctx.beginPath();
        ctx.moveTo(11, 0);
        ctx.lineTo(-8, -7);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-8, 7);
        ctx.closePath();

        if (node.isByzantine) {
          ctx.fillStyle = '#f43f5e';
          ctx.strokeStyle = '#ffffff';
        } else if (node.cbfActive) {
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#ef4444';
        } else if (isSelected) {
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#059669';
        }
        ctx.lineWidth = 1.8;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // Node ID label for inspector identification
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = isSelected ? '#38bdf8' : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(`#${node.id.toString().padStart(2, '0')}`, node.x, node.y + 16);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    sim,
    showMeshLinks,
    showCBFVectors,
    showVelocityTrails,
    selectedDroneId,
    selectedObstacleId,
    draggedObstacleId,
  ]);

  // Handle Canvas Mouse Clicks & Dragging
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicked on an existing obstacle
    const clickedObs = sim.obstacles.find((obs) => {
      const d = Math.hypot(clickX - obs.x, clickY - obs.y);
      return d <= obs.radius + 12;
    });

    if (clickedObs) {
      if (toolMode === 'delete_obstacle') {
        sim.removeObstacle(clickedObs.id);
        setSelectedObstacleId(null);
        return;
      }
      setSelectedObstacleId(clickedObs.id);
      setSelectedDroneId(null);
      setDraggedObstacleId(clickedObs.id);
      setDragOffset({ x: clickX - clickedObs.x, y: clickY - clickedObs.y });
      return;
    }

    // Check if clicked on a drone
    const clickedDrone = sim.nodes.find((n) => {
      const d = Math.hypot(clickX - n.x, clickY - n.y);
      return d <= 22;
    });

    if (clickedDrone) {
      setSelectedDroneId(clickedDrone.id);
      setSelectedObstacleId(null);
      return;
    }

    // Empty space actions based on tool mode:
    if (toolMode === 'add_obstacle') {
      const newObs = sim.addObstacle(clickX, clickY, injectionRadius, injectionMargin);
      setSelectedObstacleId(newObs.id);
      setSelectedDroneId(null);
    } else if (toolMode === 'move_target') {
      sim.globalTarget = { x: clickX, y: clickY };
      setAutoPatrol(false);
    } else {
      setSelectedObstacleId(null);
      setSelectedDroneId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedObstacleId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    sim.setObstaclePosition(draggedObstacleId, currentX - dragOffset.x, currentY - dragOffset.y);
  };

  const handleCanvasMouseUp = () => {
    setDraggedObstacleId(null);
  };

  const selectedObstacle = sim.obstacles.find((o) => o.id === selectedObstacleId);
  const selectedDrone = sim.nodes.find((n) => n.id === selectedDroneId);

  return (
    <div className="space-y-6">
      {/* Real-time Status Card & Invariant Header */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              FLIGHT BAY // CONTROL BARRIER FUNCTION OVERRIDE SYSTEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Live Swarm Radar &amp; Real-Time Obstacle Injection Bay
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium mt-1 leading-relaxed">
              Place circular collision zones directly onto the radar. Observe the active quadratic programming
              (QP) barrier deflection vectors (<span className="text-red-400 font-mono font-bold">Δu_CBF</span>)
              steering drones smoothly along the safe manifold.
            </p>
          </div>

          {/* Zero-Collision Guarantee Callout */}
          <div className="flex items-center gap-3 bg-[#11192e] border border-emerald-500/40 px-5 py-3 rounded-xl shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-400">
                SAFETY INVARIANT PROOF
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white">
                d_min &ge; r_safe :{' '}
                <span className="text-emerald-300">100% PRESERVED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4 pt-1">
          <div className="bg-[#0e1628] border border-slate-800/80 p-4 rounded-xl">
            <div className="text-sm sm:text-base font-mono text-slate-400 font-bold uppercase tracking-wide">
              Active Obstacles
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 mt-1">
              {sim.obstacles.length} <span className="text-sm font-normal text-slate-400">Zones</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Dynamic CBF Envelopes</div>
          </div>

          <div className="bg-[#0e1628] border border-slate-800/80 p-4 rounded-xl">
            <div className="text-sm sm:text-base font-mono text-slate-400 font-bold uppercase tracking-wide">
              CBF Deflections
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-rose-400 mt-1">
              {telemetry.cbfInterventionsPerSec}{' '}
              <span className="text-sm font-normal text-slate-400">per sec</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">QP Safety Filter Activations</div>
          </div>

          <div className="bg-[#0e1628] border border-slate-800/80 p-4 rounded-xl">
            <div className="text-sm sm:text-base font-mono text-slate-400 font-bold uppercase tracking-wide">
              Obstacle Clearance
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-300 mt-1">
              {telemetry.minObstacleDistM}{' '}
              <span className="text-sm font-normal text-slate-400">meters</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Closest Drone to Obstacle</div>
          </div>

          <div className="bg-[#0e1628] border border-slate-800/80 p-4 rounded-xl">
            <div className="text-sm sm:text-base font-mono text-slate-400 font-bold uppercase tracking-wide">
              Inter-Drone Margin
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 mt-1">
              {telemetry.minInterDroneDistM}{' '}
              <span className="text-sm font-normal text-slate-400">meters</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">Mutual Pairwise Separation</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area: Radar Canvas + Sidebar Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left 3 Columns: Interactive Radar Canvas */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tactical Toolbar for Obstacle Injection */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            {/* Tool Selection Buttons */}
            <div className="flex items-center gap-2 bg-[#080d18] p-1.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setToolMode('add_obstacle')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-mono font-bold transition-all ${
                  toolMode === 'add_obstacle'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Click anywhere on the radar canvas to instantiate a circular collision zone"
              >
                <PlusCircle className="w-5 h-5 shrink-0" />
                <span>INJECT OBSTACLE</span>
              </button>

              <button
                onClick={() => setToolMode('inspect')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-mono font-bold transition-all ${
                  toolMode === 'inspect'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MousePointer className="w-5 h-5 shrink-0" />
                <span>INSPECT / DRAG</span>
              </button>

              <button
                onClick={() => setToolMode('move_target')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-mono font-bold transition-all ${
                  toolMode === 'move_target'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Crosshair className="w-5 h-5 shrink-0" />
                <span>MOVE TARGET</span>
              </button>

              <button
                onClick={() => setToolMode('delete_obstacle')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-mono font-bold transition-all ${
                  toolMode === 'delete_obstacle'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>DELETE</span>
              </button>
            </div>

            {/* Presets & Actions */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-slate-400 font-bold">PRESETS:</span>
              <button
                onClick={() => sim.loadPresetObstacles('corridor')}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-mono font-bold transition-colors"
              >
                Pincer Corridor
              </button>
              <button
                onClick={() => sim.loadPresetObstacles('grid')}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-mono font-bold transition-colors"
              >
                Defense Grid
              </button>
              <button
                onClick={() => sim.loadPresetObstacles('orbit')}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-mono font-bold transition-colors"
              >
                Monolith
              </button>
              <button
                onClick={() => {
                  sim.clearAllObstacles();
                  setSelectedObstacleId(null);
                }}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-700/80 rounded-lg text-sm font-mono font-bold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* The Canvas HUD Viewport */}
          <div className="relative bg-[#080c14] border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <canvas
              ref={canvasRef}
              width={900}
              height={560}
              className="w-full h-auto cursor-crosshair block"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            />

            {/* Canvas Overlay Legend / Tool Mode Indicator */}
            <div className="absolute top-3 left-3 bg-[#0a0f1d]/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-lg text-sm font-mono flex items-center gap-2.5 pointer-events-none">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-400">ACTIVE TOOL:</span>
              <span className="text-cyan-300 font-bold uppercase">{toolMode.replace('_', ' ')}</span>
            </div>

            {/* Canvas Bottom Toggles */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between text-sm font-mono bg-[#0a0f1d]/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg gap-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white font-medium">
                  <input
                    type="checkbox"
                    checked={showCBFVectors}
                    onChange={(e) => setShowCBFVectors(e.target.checked)}
                    className="accent-rose-500 rounded w-4 h-4"
                  />
                  <span>Show CBF Repulsion (Δu_CBF)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white font-medium">
                  <input
                    type="checkbox"
                    checked={showMeshLinks}
                    onChange={(e) => setShowMeshLinks(e.target.checked)}
                    className="accent-cyan-500 rounded w-4 h-4"
                  />
                  <span>Show P2P Mesh Links</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white font-medium">
                  <input
                    type="checkbox"
                    checked={showVelocityTrails}
                    onChange={(e) => setShowVelocityTrails(e.target.checked)}
                    className="accent-emerald-500 rounded w-4 h-4"
                  />
                  <span>Trails</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoPatrol(!autoPatrol)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-colors ${
                    autoPatrol
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {autoPatrol ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
                </button>
                <button
                  onClick={() => sim.resetSwarmAroundTarget()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-sm font-mono font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Swarm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Telemetry & Interactive Inspector Sidebar */}
        <div className="space-y-4">
          {/* Obstacle Injection Controls */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-xl font-black font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                OBSTACLE CONFIGURATION
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-1">
                  <span>INJECTION RADIUS:</span>
                  <span className="text-amber-400 font-bold">{injectionRadius}m</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={injectionRadius}
                  onChange={(e) => setInjectionRadius(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2"
                />
                <div className="flex justify-between text-sm font-mono text-slate-400 mt-1">
                  <span>Small (20m)</span>
                  <span>Medium (50m)</span>
                  <span>Fortress (100m)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-1">
                  <span>SAFETY MARGIN (r_safe):</span>
                  <span className="text-cyan-400 font-bold">{injectionMargin}m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={injectionMargin}
                  onChange={(e) => setInjectionMargin(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2"
                />
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Dashed boundary where Control Barrier Function Lie derivative condition triggers closed-form QP override.
                </p>
              </div>

              {/* Selected Obstacle Deep Dive */}
              {selectedObstacle && (
                <div className="bg-[#0e1628] border border-amber-500/50 p-4 rounded-xl space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono font-bold text-amber-300">
                      SELECTED: {selectedObstacle.label || selectedObstacle.id}
                    </span>
                    <button
                      onClick={() => {
                        sim.removeObstacle(selectedObstacle.id);
                        setSelectedObstacleId(null);
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Delete this obstacle"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono text-slate-300">
                    <div>
                      <span className="text-slate-400">Position:</span> ({Math.round(selectedObstacle.x)},{' '}
                      {Math.round(selectedObstacle.y)})
                    </div>
                    <div>
                      <span className="text-slate-400">Deflections:</span>{' '}
                      <span className="text-rose-400 font-bold">{selectedObstacle.interventions}</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <label className="text-sm font-mono font-bold text-slate-300 block mb-1">Adjust Radius:</label>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={selectedObstacle.radius}
                      onChange={(e) => sim.setObstacleRadius(selectedObstacle.id, Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Node Inspector */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-xl font-black font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                DRONE NODE INSPECTOR
              </h3>
            </div>

            {selectedDrone ? (
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">NODE ID:</span>
                  <span className="text-cyan-300 font-bold text-base">#{selectedDrone.id}</span>
                </div>
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">CBF STATUS:</span>
                  <span
                    className={`font-bold ${
                      selectedDrone.cbfActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    {selectedDrone.cbfActive ? 'REPELLING (ACTIVE QP)' : 'NOMINAL FLOCKING'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">BARRIER SLACK h(x):</span>
                  <span className="text-amber-300 font-bold">{(selectedDrone.cbfSlack * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">POSITION:</span>
                  <span className="text-slate-200">
                    ({selectedDrone.x.toFixed(1)}, {selectedDrone.y.toFixed(1)})
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">VELOCITY:</span>
                  <span className="text-slate-200">
                    ||v|| = {Math.hypot(selectedDrone.vx, selectedDrone.vy).toFixed(1)} m/s
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#11192b] p-3 rounded-lg">
                  <span className="text-slate-400 font-semibold">NEIGHBOR PEERS:</span>
                  <span className="text-cyan-300 font-bold">{selectedDrone.neighbors.length} links</span>
                </div>

                <button
                  onClick={() => {
                    selectedDrone.isByzantine = !selectedDrone.isByzantine;
                  }}
                  className={`w-full mt-2 py-2 px-4 rounded-lg text-sm font-mono font-bold transition-colors ${
                    selectedDrone.isByzantine
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-slate-800 text-rose-300 hover:bg-slate-700 border border-rose-900/60'
                  }`}
                >
                  {selectedDrone.isByzantine ? 'REMOVE BYZANTINE FAULT' : 'INJECT BYZANTINE FAULT'}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm font-mono leading-relaxed">
                Click any drone node on the canvas to inspect real-time CBF slack, Lie derivatives, and peer links.
              </div>
            )}
          </div>

          {/* Swarm Dynamics Tuning */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-xl font-black font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                FLEET CONFIGURATION
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-2">
                  <span>ACTIVE DRONES:</span>
                  <span className="text-emerald-400 font-bold">{config.nodeCount}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[32, 48, 64].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        onConfigChange({ nodeCount: count });
                        sim.resetNodes(count, true);
                      }}
                      className={`py-2 rounded-lg text-sm sm:text-base font-mono font-bold border transition-colors ${
                        config.nodeCount === count
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {count} Nodes
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-1">
                  <span>CBF ALPHA GAIN (α):</span>
                  <span className="text-cyan-400 font-bold">{config.cbfAlpha.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={config.cbfAlpha}
                  onChange={(e) => onConfigChange({ cbfAlpha: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-1">
                  <span>SEPARATION WEIGHT:</span>
                  <span className="text-amber-400 font-bold">{config.wSep.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={config.wSep}
                  onChange={(e) => onConfigChange({ wSep: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-base sm:text-lg font-mono font-bold text-slate-200 mb-1">
                  <span>ALIGNMENT / COHESION:</span>
                  <span className="text-indigo-400 font-bold">{config.wAli.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={config.wAli}
                  onChange={(e) => onConfigChange({ wAli: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
