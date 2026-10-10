import React, { useEffect, useRef } from 'react';
import { EulerDegrees } from '../types/ekf';

interface AttitudeHorizonCanvasProps {
  euler: EulerDegrees;
  quaternion: [number, number, number, number];
  width?: number;
  height?: number;
}

export const AttitudeHorizonCanvas: React.FC<AttitudeHorizonCanvasProps> = ({
  euler,
  quaternion,
  width = 540,
  height = 360,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.44;

    // Clear canvas
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Draw circular horizon clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // 1. Artificial Horizon Background
    // Pitch offset: ~2.5 pixels per degree
    const pitchOffset = Math.max(-radius * 0.9, Math.min(radius * 0.9, euler.pitch * 2.2));
    const rollRad = (-euler.roll * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rollRad);
    ctx.translate(0, pitchOffset);

    // Sky half (Deep Navy / Cobalt)
    ctx.fillStyle = '#0c4a6e';
    ctx.fillRect(-radius * 2, -radius * 2, radius * 4, radius * 2);

    // Ground half (Dark Slate / Charcoal)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-radius * 2, 0, radius * 4, radius * 2);

    // Horizon line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-radius * 1.5, 0);
    ctx.lineTo(radius * 1.5, 0);
    ctx.stroke();

    // Pitch ladder rungs (+- 10, 20, 30 degrees)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    for (let deg = -40; deg <= 40; deg += 10) {
      if (deg === 0) continue;
      const y = -deg * 2.2;
      const rungWidth = deg % 20 === 0 ? 50 : 25;

      ctx.beginPath();
      ctx.moveTo(-rungWidth, y);
      ctx.lineTo(rungWidth, y);
      ctx.stroke();

      if (deg % 20 === 0) {
        ctx.fillText(`${deg}°`, rungWidth + 14, y + 3);
        ctx.fillText(`${deg}°`, -rungWidth - 14, y + 3);
      }
    }

    ctx.restore(); // Undo roll & pitch translation

    // 2. 3D Drone Wireframe Attitude Projection
    // Draw 3D drone axes & quadcopter rotor arms
    ctx.save();
    ctx.translate(cx, cy);

    // Rotate context to roll, then pitch for 3D perspective
    const pitchRad = (euler.pitch * Math.PI) / 180;
    const yawRad = (euler.yaw * Math.PI) / 180;

    // Define 3D wireframe points of an autonomous drone
    // Body center, 4 arms, forward nose indicator
    const armLen = radius * 0.45;
    const points3D: [number, number, number][] = [
      [0, 0, 0], // 0: center
      [armLen * 0.7, armLen * 0.7, 0], // 1: Front-Right
      [-armLen * 0.7, armLen * 0.7, 0], // 2: Front-Left
      [-armLen * 0.7, -armLen * 0.7, 0], // 3: Rear-Left
      [armLen * 0.7, -armLen * 0.7, 0], // 4: Rear-Right
      [0, armLen * 0.9, 0], // 5: Forward direction nose
    ];

    // Project 3D points using yaw, pitch, roll
    const cosR = Math.cos(rollRad);
    const sinR = Math.sin(rollRad);
    const cosP = Math.cos(pitchRad);
    const sinP = Math.sin(pitchRad);

    const projected = points3D.map(([x, y, z]) => {
      // Rotate around X (pitch)
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;
      // Rotate around Z (roll in screen space)
      const x2 = x * cosR - y1 * sinR;
      const y2 = x * sinR + y1 * cosR;
      return { x: x2, y: -y2 }; // canvas y is down
    });

    // Draw drone body frame
    ctx.strokeStyle = '#14b8a6'; // Aero Teal
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Arm 1 to Arm 3
    ctx.moveTo(projected[2].x, projected[2].y);
    ctx.lineTo(projected[4].x, projected[4].y);
    // Arm 2 to Arm 4
    ctx.moveTo(projected[1].x, projected[1].y);
    ctx.lineTo(projected[3].x, projected[3].y);
    ctx.stroke();

    // Central avionics hub
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.arc(projected[0].x, projected[0].y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4 Rotor discs
    const rotorRadius = radius * 0.12;
    [1, 2, 3, 4].forEach((idx) => {
      const pt = projected[idx];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, rotorRadius, 0, Math.PI * 2);
      ctx.fillStyle = idx <= 2 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(245, 158, 11, 0.25)';
      ctx.fill();
      ctx.strokeStyle = idx <= 2 ? '#38bdf8' : '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Forward Heading Pointer
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    ctx.lineTo(projected[5].x, projected[5].y);
    ctx.stroke();

    ctx.restore();

    // 3. Fixed Aircraft Reticle (Aircraft HUD Reference)
    ctx.strokeStyle = '#f59e0b'; // Amber reticle
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Left wing reticle
    ctx.moveTo(cx - 50, cy);
    ctx.lineTo(cx - 20, cy);
    ctx.lineTo(cx - 20, cy + 8);
    // Right wing reticle
    ctx.moveTo(cx + 50, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.lineTo(cx + 20, cy + 8);
    // Center reticle dot
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore(); // Undo clipping

    // 4. Outer Bezel & Pitch/Roll Degree Indices
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Roll indicator ticks at top
    for (let a = -60; a <= 60; a += 15) {
      const rad = ((a - 90) * Math.PI) / 180;
      const x1 = cx + (radius - 8) * Math.cos(rad);
      const y1 = cy + (radius - 8) * Math.sin(rad);
      const x2 = cx + (radius + 2) * Math.cos(rad);
      const y2 = cy + (radius + 2) * Math.sin(rad);

      ctx.strokeStyle = a === 0 ? '#38bdf8' : '#64748b';
      ctx.lineWidth = a === 0 ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Roll angle indicator triangle
    const topRollRad = ((-euler.roll - 90) * Math.PI) / 180;
    const triX = cx + (radius - 12) * Math.cos(topRollRad);
    const triY = cy + (radius - 12) * Math.sin(topRollRad);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(triX, triY, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Heading Tape / Compass at Top
    const tapeY = 22;
    ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
    ctx.fillRect(cx - 110, tapeY - 14, 220, 26);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(cx - 110, tapeY - 14, 220, 26);

    const normYaw = ((euler.yaw % 360) + 360) % 360;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`HDG: ${normYaw.toFixed(1).padStart(5, '0')}°`, cx, tapeY + 4);

    // 6. Corner Telemetry Monospace Readouts
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ROLL:  ${euler.roll.toFixed(2)}°`, 16, height - 36);
    ctx.fillText(`PITCH: ${euler.pitch.toFixed(2)}°`, 16, height - 20);

    ctx.textAlign = 'right';
    ctx.fillText(`QW: ${quaternion[0].toFixed(4)}`, width - 16, height - 36);
    ctx.fillText(`QZ: ${quaternion[3].toFixed(4)}`, width - 16, height - 20);
  }, [euler, quaternion, width, height]);

  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#070a12] p-2 shadow-2xl flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="rounded-lg"
      />
    </div>
  );
};
