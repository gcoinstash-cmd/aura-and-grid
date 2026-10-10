import React, { useEffect, useRef, useState } from 'react';
import { TelemetryState, CameraPreset } from '../types/telemetry';
import { RotateCw, Eye, Sparkles, Sliders, Layers, Zap, Maximize2 } from 'lucide-react';

interface ChassisVisualizerProps {
  telemetry: TelemetryState;
  onCameraChange?: (preset: CameraPreset) => void;
}

export const ChassisVisualizer: React.FC<ChassisVisualizerProps> = ({ telemetry }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interactive camera rotation
  const [rotY, setRotY] = useState<number>(-0.35); // Horizontal rotation in radians
  const [rotX, setRotX] = useState<number>(0.15); // Elevation
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Visual toggles
  const [showLaserConduits, setShowLaserConduits] = useState<boolean>(true);
  const [showFinancialVectors, setShowFinancialVectors] = useState<boolean>(true);
  const [showWetReflection, setShowWetReflection] = useState<boolean>(true);
  const [showVolumetricLight, setShowVolumetricLight] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>('SHOWROOM_3D');

  const animationFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Handle Preset Changes
  const applyPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    switch (preset) {
      case 'SHOWROOM_3D':
        setRotY(-0.35);
        setRotX(0.18);
        setZoom(1.0);
        break;
      case 'CORE_MACRO':
        setRotY(0.1);
        setRotX(0.28);
        setZoom(1.85);
        break;
      case 'SUSPENSION_DIFFUSER':
        setRotY(1.95);
        setRotX(0.12);
        setZoom(1.35);
        break;
      case 'COCKPIT_HUD':
        setRotY(-0.02);
        setRotX(0.08);
        setZoom(1.4);
        break;
      case 'AERO_WIND_TUNNEL':
        setRotY(-1.57); // 90 deg side
        setRotX(0.05);
        setZoom(1.1);
        break;
    }
  };

  // Mouse / Touch Drag handlers for 360 degree inspection
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.008);
    setRotX((prev) => Math.max(-0.2, Math.min(0.65, prev + dy * 0.006)));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.6, Math.min(2.4, prev - e.deltaY * 0.0015)));
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;
      timeRef.current += 0.025;
      const t = timeRef.current;

      // Handle high-DPI
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Moody Showroom Background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0f141d');
      bgGrad.addColorStop(0.4, '#090b0f');
      bgGrad.addColorStop(1, '#030406');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Volumetric Studio Ceiling Softbox Lights
      if (showVolumetricLight) {
        // Softbox reflection light array in ceiling
        ctx.save();
        ctx.globalAlpha = 0.08;
        const softboxGrad = ctx.createLinearGradient(0, 0, 0, height * 0.3);
        softboxGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        softboxGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = softboxGrad;
        ctx.fillRect(width * 0.15, 0, width * 0.7, height * 0.25);

        // Volumetric Cone left (Emerald)
        const coneEmerald = ctx.createRadialGradient(
          width * 0.2,
          0,
          10,
          width * 0.35,
          height * 0.7,
          width * 0.5
        );
        coneEmerald.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
        coneEmerald.addColorStop(0.6, 'rgba(16, 185, 129, 0.03)');
        coneEmerald.addColorStop(1, 'transparent');
        ctx.fillStyle = coneEmerald;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Cone right (Warm Gold)
        const coneGold = ctx.createRadialGradient(
          width * 0.8,
          0,
          10,
          width * 0.65,
          height * 0.7,
          width * 0.5
        );
        coneGold.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        coneGold.addColorStop(0.6, 'rgba(245, 158, 11, 0.02)');
        coneGold.addColorStop(1, 'transparent');
        ctx.fillStyle = coneGold;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Studio Floor Horizon & Wet Black Glass
      const horizonY = height * 0.52;

      // 3. Wet Reflective Black Glass Floor
      ctx.save();
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, 'rgba(8, 10, 14, 0.95)');
      floorGrad.addColorStop(0.2, 'rgba(10, 14, 20, 0.98)');
      floorGrad.addColorStop(1, 'rgba(4, 5, 8, 1)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Floor Perspective Grid with subtle falloff
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      const vanishX = width * 0.5;
      const numLines = 24;
      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const bottomX = vanishX + i * (width / 12);
        ctx.beginPath();
        ctx.moveTo(vanishX + i * 8, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal depth rings on wet floor
      for (let yStep = horizonY + 15; yStep < height; yStep += (yStep - horizonY) * 0.35 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, yStep);
        ctx.lineTo(width, yStep);
        ctx.stroke();
      }
      ctx.restore();

      // 4. 3D Hypercar Projection Transform
      const originX = width * 0.5;
      const originY = height * 0.56;
      const scale = Math.min(width * 0.85, height * 1.1) * 0.5 * zoom;

      // 3D Projection Helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis (yaw)
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;

        // Rotate around X axis (pitch)
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const ry = y * cosX - rz * sinX;
        const rz2 = y * sinX + rz * cosX;

        // Perspective division
        const distance = 4.2;
        const pz = rz2 + distance;
        const factor = pz > 0.1 ? (scale * 3.8) / pz : 0;

        return {
          px: originX + rx * factor,
          py: originY - ry * factor,
          depth: pz,
          scale: factor,
        };
      };

      // 5. Wet Glass Floor Reflection (Under-chassis mirror)
      if (showWetReflection) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.filter = 'blur(3px)';

        // Reflection of Quantum Core Glow
        const coreFloor = project(0, -0.05, 0);
        const reflGrad = ctx.createRadialGradient(
          coreFloor.px,
          coreFloor.py + 40,
          5,
          coreFloor.px,
          coreFloor.py + 40,
          160 * zoom
        );
        reflGrad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        reflGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.4)');
        reflGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.ellipse(coreFloor.px, coreFloor.py + 45, 180 * zoom, 40 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 6. Draw Hypercar Chassis Components (Back-to-Front Z ordering)
      // Car dimensions in normalized 3D space:
      // Length: -2.2 (rear) to +2.4 (nose)
      // Width: -1.0 to +1.0
      // Height: 0.0 (ground) to 0.75 (roof canopy)

      // A. Shadow Pool
      ctx.save();
      const shadowCenter = project(0, 0, 0);
      const shadowGrad = ctx.createRadialGradient(
        shadowCenter.px,
        shadowCenter.py,
        20,
        shadowCenter.px,
        shadowCenter.py,
        280 * zoom
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(shadowCenter.px, shadowCenter.py, 340 * zoom, 90 * zoom, rotY * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // B. Carbon Fiber Underfloor & Venturi Diffusers
      const diffuserAngleRad = (telemetry.aero.diffuserAngleDeg * Math.PI) / 180;
      const diffuserPoints = [
        project(-1.8, 0.08, -0.85),
        project(-1.8, 0.08 + Math.sin(diffuserAngleRad) * 0.2, -0.85),
        project(-2.2, 0.22 + Math.sin(diffuserAngleRad) * 0.35, -0.9),
        project(-2.2, 0.22 + Math.sin(diffuserAngleRad) * 0.35, 0.9),
        project(-1.8, 0.08 + Math.sin(diffuserAngleRad) * 0.2, 0.85),
        project(-1.8, 0.08, 0.85),
      ];

      ctx.save();
      ctx.fillStyle = 'rgba(18, 22, 28, 0.85)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(diffuserPoints[0].px, diffuserPoints[0].py);
      for (let i = 1; i < diffuserPoints.length; i++) {
        ctx.lineTo(diffuserPoints[i].px, diffuserPoints[i].py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Diffuser Strakes / Vertical Aerodynamic fins
      for (const strakeZ of [-0.6, -0.25, 0.25, 0.6]) {
        const p1 = project(-1.8, 0.08, strakeZ);
        const p2 = project(-2.25, 0.26, strakeZ);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.stroke();
      }
      ctx.restore();

      // C. Exposed Titanium Suspension Pushrods & Wishbones
      const suspensionNodes = [
        // Front Left
        { base: [1.4, 0.18, 0.4], hub: [1.35, 0.16, 0.92] },
        // Front Right
        { base: [1.4, 0.18, -0.4], hub: [1.35, 0.16, -0.92] },
        // Rear Left
        { base: [-1.2, 0.22, 0.45], hub: [-1.25, 0.2, 0.98] },
        // Rear Right
        { base: [-1.2, 0.22, -0.45], hub: [-1.25, 0.2, -0.98] },
      ];

      ctx.save();
      suspensionNodes.forEach((s) => {
        const pBase = project(s.base[0], s.base[1], s.base[2]);
        const pHub = project(s.hub[0], s.hub[1], s.hub[2]);

        // Pushrod bar (titanium)
        ctx.beginPath();
        ctx.moveTo(pBase.px, pBase.py);
        ctx.lineTo(pHub.px, pHub.py);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.4 * zoom;
        ctx.stroke();

        // Upper wishbone
        const pBaseHigh = project(s.base[0] + 0.15, s.base[1] + 0.14, s.base[2] * 0.8);
        ctx.beginPath();
        ctx.moveTo(pBaseHigh.px, pBaseHigh.py);
        ctx.lineTo(pHub.px, pHub.py);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5 * zoom;
        ctx.stroke();

        // Active pushrod strain glow dot
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(pHub.px, pHub.py, 3.5 * zoom, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // D. Wheels & Aero Discs
      const wheelPositions = [
        { x: 1.35, y: 0.18, z: 0.94 },
        { x: 1.35, y: 0.18, z: -0.94 },
        { x: -1.25, y: 0.22, z: 0.98 },
        { x: -1.25, y: 0.22, z: -0.98 },
      ];

      wheelPositions.forEach((wp) => {
        const p = project(wp.x, wp.y, wp.z);
        ctx.save();
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(p.px, p.py, 22 * zoom, 38 * zoom, rotY * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Center hub gold laser connector
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.px, p.py, 4 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // E. Central Quantum Computing Core: "CHRONO-ARBITRAGE"
      // Positioned in the central mid-engine bay [x: -0.2 to 0.4, y: 0.15 to 0.48, z: -0.3 to 0.3]
      const coreCenter = project(0.1, 0.32, 0);

      ctx.save();
      // Outer Sapphire Vacuum Chamber Glow
      const coreRadius = 55 * zoom;
      const coreGlow = ctx.createRadialGradient(
        coreCenter.px,
        coreCenter.py,
        5,
        coreCenter.px,
        coreCenter.py,
        coreRadius * 1.8
      );
      coreGlow.addColorStop(0, 'rgba(16, 185, 129, 0.95)');
      coreGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.6)');
      coreGlow.addColorStop(0.7, 'rgba(16, 185, 129, 0.2)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(coreCenter.px, coreCenter.py, coreRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Sapphire Glass Cylinder Walls
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coreCenter.px, coreCenter.py, coreRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Dual Counter-Rotating Gold Qubit Resonance Rings
      const ring1Angle = t * 1.4;
      const ring2Angle = -t * 1.1;

      // Ring 1 (Gold)
      ctx.save();
      ctx.translate(coreCenter.px, coreCenter.py);
      ctx.rotate(ring1Angle);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 0.82, coreRadius * 0.35, 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring 2 (Emerald)
      ctx.save();
      ctx.translate(coreCenter.px, coreCenter.py);
      ctx.rotate(ring2Angle);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 0.72, coreRadius * 0.28, -0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Central Quantum Qubit Lattice (Pulsing constellation nodes)
      const numQubits = 14;
      for (let i = 0; i < numQubits; i++) {
        const theta = (i / numQubits) * Math.PI * 2 + t * 0.6;
        const r = (coreRadius * 0.45) * (0.5 + 0.5 * Math.sin(t * 2 + i));
        const qx = coreCenter.px + Math.cos(theta) * r;
        const qy = coreCenter.py + Math.sin(theta) * (r * 0.6);

        ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(qx, qy, 2.5 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Entanglement line to next node
        if (i > 0) {
          const prevTheta = ((i - 1) / numQubits) * Math.PI * 2 + t * 0.6;
          const prevR = (coreRadius * 0.45) * (0.5 + 0.5 * Math.sin(t * 2 + i - 1));
          const pqx = coreCenter.px + Math.cos(prevTheta) * prevR;
          const pqy = coreCenter.py + Math.sin(prevTheta) * (prevR * 0.6);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pqx, pqy);
          ctx.lineTo(qx, qy);
          ctx.stroke();
        }
      }

      // Core Branding Text Tag
      ctx.font = '600 10px JetBrains Mono';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText('CHRONO-ARBITRAGE', coreCenter.px, coreCenter.py - coreRadius - 10);
      ctx.font = '400 8px JetBrains Mono';
      ctx.fillStyle = '#10b981';
      ctx.fillText('512-QUBIT TOPOLOGICAL CORE', coreCenter.px, coreCenter.py - coreRadius);
      ctx.restore();

      // F. Glowing Gold & Emerald Laser Conduits
      if (showLaserConduits) {
        ctx.save();
        // Emerald conduits branching forward from core to front suspension and splitter
        const conduitsEmerald = [
          // Left front conduit
          [
            [0.1, 0.32, 0.1],
            [0.6, 0.28, 0.3],
            [1.2, 0.22, 0.45],
            [1.8, 0.12, 0.6],
            [2.3, 0.08, 0.0],
          ],
          // Right front conduit
          [
            [0.1, 0.32, -0.1],
            [0.6, 0.28, -0.3],
            [1.2, 0.22, -0.45],
            [1.8, 0.12, -0.6],
            [2.3, 0.08, 0.0],
          ],
        ];

        // Gold conduits branching backward through diffusers
        const conduitsGold = [
          // Left rear conduit
          [
            [0.1, 0.32, 0.1],
            [-0.5, 0.26, 0.35],
            [-1.2, 0.22, 0.48],
            [-1.9, 0.18, 0.7],
            [-2.2, 0.25, 0.5],
          ],
          // Right rear conduit
          [
            [0.1, 0.32, -0.1],
            [-0.5, 0.26, -0.35],
            [-1.2, 0.22, -0.48],
            [-1.9, 0.18, -0.7],
            [-2.2, 0.25, -0.5],
          ],
        ];

        // Draw Emerald Conduits with traveling photons
        conduitsEmerald.forEach((path) => {
          ctx.beginPath();
          const pStart = project(path[0][0], path[0][1], path[0][2]);
          ctx.moveTo(pStart.px, pStart.py);
          for (let i = 1; i < path.length; i++) {
            const pt = project(path[i][0], path[i][1], path[i][2]);
            ctx.lineTo(pt.px, pt.py);
          }
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.2 * zoom;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Traveling photon packet
          const packetProgress = (t * 0.7) % (path.length - 1);
          const segIndex = Math.floor(packetProgress);
          const segFrac = packetProgress - segIndex;
          const pA = path[segIndex];
          const pB = path[segIndex + 1];
          if (pA && pB) {
            const photonX = pA[0] + (pB[0] - pA[0]) * segFrac;
            const photonY = pA[1] + (pB[1] - pA[1]) * segFrac;
            const photonZ = pA[2] + (pB[2] - pA[2]) * segFrac;
            const pPhoton = project(photonX, photonY, photonZ);

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pPhoton.px, pPhoton.py, 4.5 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Draw Gold Conduits with traveling photons
        conduitsGold.forEach((path) => {
          ctx.beginPath();
          const pStart = project(path[0][0], path[0][1], path[0][2]);
          ctx.moveTo(pStart.px, pStart.py);
          for (let i = 1; i < path.length; i++) {
            const pt = project(path[i][0], path[i][1], path[i][2]);
            ctx.lineTo(pt.px, pt.py);
          }
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.0 * zoom;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Traveling photon packet
          const packetProgress = (t * 0.85) % (path.length - 1);
          const segIndex = Math.floor(packetProgress);
          const segFrac = packetProgress - segIndex;
          const pA = path[segIndex];
          const pB = path[segIndex + 1];
          if (pA && pB) {
            const photonX = pA[0] + (pB[0] - pA[0]) * segFrac;
            const photonY = pA[1] + (pB[1] - pA[1]) * segFrac;
            const photonZ = pA[2] + (pB[2] - pA[2]) * segFrac;
            const pPhoton = project(photonX, photonY, photonZ);

            ctx.fillStyle = '#fffbeb';
            ctx.beginPath();
            ctx.arc(pPhoton.px, pPhoton.py, 4 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();
      }

      // G. Futuristic Transparent Polycarbonate / Glass Canopy & Monocoque
      // Sculpted crystal profile with edge refraction
      const canopyOutline = [
        project(2.35, 0.08, 0.0), // Nose tip
        project(1.9, 0.16, 0.6), // Front fender left
        project(1.1, 0.35, 0.55), // A-pillar base
        project(0.3, 0.68, 0.42), // Roof peak left
        project(-0.5, 0.62, 0.42), // Roof rear left
        project(-1.4, 0.42, 0.65), // Engine cowl rear
        project(-2.1, 0.32, 0.85), // Rear wing support left
        project(-2.25, 0.34, 0.0), // Rear center tail
        project(-2.1, 0.32, -0.85), // Rear wing support right
        project(-1.4, 0.42, -0.65),
        project(-0.5, 0.62, -0.42),
        project(0.3, 0.68, -0.42),
        project(1.1, 0.35, -0.55),
        project(1.9, 0.16, -0.6),
      ];

      ctx.save();
      // Transparent crystal refraction fill
      ctx.beginPath();
      ctx.moveTo(canopyOutline[0].px, canopyOutline[0].py);
      for (let i = 1; i < canopyOutline.length; i++) {
        ctx.lineTo(canopyOutline[i].px, canopyOutline[i].py);
      }
      ctx.closePath();

      const crystalGrad = ctx.createLinearGradient(
        originX,
        originY - 120 * zoom,
        originX,
        originY + 80 * zoom
      );
      crystalGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      crystalGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.08)');
      crystalGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.06)');
      crystalGrad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');
      ctx.fillStyle = crystalGrad;
      ctx.fill();

      // Specular crystal edge reflection line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Internal cockpit HUD / seat silhouette lines
      const seatLeft = project(0.4, 0.25, 0.2);
      const seatHead = project(0.2, 0.52, 0.2);
      ctx.beginPath();
      ctx.moveTo(seatLeft.px, seatLeft.py);
      ctx.lineTo(seatHead.px, seatHead.py);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // H. Holographic Financial Vector Streams
      if (showFinancialVectors) {
        ctx.save();
        // 3D vector arrows streaming from front nose up into the atmosphere
        const vectors = [
          { origin: [1.8, 0.25, 0.3], end: [2.8, 0.95, 0.8], label: 'CME +4.82 bps' },
          { origin: [1.5, 0.3, -0.3], end: [2.5, 1.05, -0.7], label: 'LD4 -0.12ps' },
          { origin: [0.0, 0.7, 0.0], end: [0.0, 1.45, 0.0], label: 'α: $4.82M/yr' },
          { origin: [-1.2, 0.45, 0.5], end: [-1.8, 1.1, 1.1], label: 'TY3 SYNCH' },
        ];

        vectors.forEach((v, idx) => {
          const p1 = project(v.origin[0], v.origin[1], v.origin[2]);
          const p2 = project(v.end[0], v.end[1], v.end[2]);

          // Pulsing holographic stream line
          const streamGrad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
          streamGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          streamGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)');
          streamGrad.addColorStop(1, 'rgba(16, 185, 129, 0.9)');

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Arrow head
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(p2.px, p2.py, 3, 0, Math.PI * 2);
          ctx.fill();

          // Floating financial data label
          ctx.font = '500 9px JetBrains Mono';
          ctx.fillStyle = idx % 2 === 0 ? '#10b981' : '#f59e0b';
          ctx.fillText(v.label, p2.px + 6, p2.py - 3);
        });

        // Floating latency vector ribbon over nose
        ctx.beginPath();
        for (let step = 0; step < 20; step++) {
          const frac = step / 19;
          const vx = 2.4 - frac * 1.5;
          const vy = 0.12 + Math.sin(frac * Math.PI * 2 + t * 2) * 0.12 + frac * 0.45;
          const vz = Math.cos(frac * Math.PI + t) * 0.4;
          const pRibbon = project(vx, vy, vz);
          if (step === 0) ctx.moveTo(pRibbon.px, pRibbon.py);
          else ctx.lineTo(pRibbon.px, pRibbon.py);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore(); // Restore dpr scale

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isMounted = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [rotX, rotY, zoom, showLaserConduits, showFinancialVectors, showWetReflection, showVolumetricLight, telemetry]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-[#06080c] border border-slate-800/80 shadow-2xl select-none group"
    >
      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Showroom Ambient Watermark Badge (Non-obtrusive / domain authentic) */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-0.5">
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase font-mono text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          CHRONO-ARBITRAGE · FLAGSHIP CHASSIS
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Reflective Obsidian Showroom · 512-Qubit Topo Manifold · Cryo 12.4 mK
        </div>
      </div>

      {/* Preset Camera Viewport Switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800">
        {(
          [
            { id: 'SHOWROOM_3D', label: 'Showroom 3D' },
            { id: 'CORE_MACRO', label: 'Quantum Core' },
            { id: 'SUSPENSION_DIFFUSER', label: 'Aero Diffuser' },
            { id: 'COCKPIT_HUD', label: 'Cockpit View' },
            { id: 'AERO_WIND_TUNNEL', label: 'Wind Tunnel' },
          ] as { id: CameraPreset; label: string }[]
        ).map((cam) => (
          <button
            key={cam.id}
            onClick={() => applyPreset(cam.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activePreset === cam.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {cam.label}
          </button>
        ))}
      </div>

      {/* Real-time Telemetry Overlay Mini-Bar (Lower Left) */}
      <div className="absolute bottom-4 left-4 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/80 flex items-center gap-6 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">COHERENCE</span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {telemetry.quantum.coherenceRate.toFixed(3)}%
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div>
          <span className="text-slate-500 block text-[10px]">CRYO TEMP</span>
          <span className="text-sky-300 font-bold tabular-nums">
            {telemetry.quantum.cryoTempMK.toFixed(2)} mK
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div>
          <span className="text-slate-500 block text-[10px]">DOWNFORCE</span>
          <span className="text-amber-400 font-bold tabular-nums">
            {telemetry.aero.downforceKgf} kgf
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div>
          <span className="text-slate-500 block text-[10px]">CONDUIT FLUX</span>
          <span className="text-emerald-300 font-bold tabular-nums">
            {telemetry.quantum.photonFluxTHz.toFixed(1)} THz
          </span>
        </div>
      </div>

      {/* Interactive Visual Element Toggles (Lower Right) */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800/80">
        <button
          onClick={() => setShowLaserConduits(!showLaserConduits)}
          title="Toggle Emerald & Gold Laser Conduits"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
            showLaserConduits ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Laser Conduits</span>
        </button>

        <button
          onClick={() => setShowFinancialVectors(!showFinancialVectors)}
          title="Toggle Holographic Vector Streams"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
            showFinancialVectors ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Arbitrage Vectors</span>
        </button>

        <button
          onClick={() => setShowWetReflection(!showWetReflection)}
          title="Toggle Wet Mirror Reflection"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
            showWetReflection ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Reflective Floor</span>
        </button>

        <button
          onClick={() => applyPreset('SHOWROOM_3D')}
          title="Reset Orbit Camera"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drag Hint on Hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700">
        Drag to Orbit 360° · Scroll to Zoom
      </div>
    </div>
  );
};
