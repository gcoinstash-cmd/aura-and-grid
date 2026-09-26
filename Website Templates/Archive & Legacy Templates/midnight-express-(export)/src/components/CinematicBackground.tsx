import React, { useEffect, useRef } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track state of background particles / grids
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
    }> = [];

    // Initialize slow glowing particles (simulating steam & distant brake lights)
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -Math.random() * 0.25 - 0.05, // drifting up
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    // Handle Resize using a ResizeObserver to prevent canvas stretching
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let frame = 0;

    const render = () => {
      frame++;
      
      // Clear with dark obsidian base
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw dynamic perspective grid lines representing the race-track / drive-thru asphalt
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.03)';
      ctx.lineWidth = 1;
      
      const horizonY = height * 0.5;
      const fov = 350;
      
      // Draw 3D-looking grid
      for (let x = -width; x < width * 2; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x + (frame * 0.08) % 120, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.1, horizonY);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = horizonY; y < height; y += 45) {
        const relativeY = (y - horizonY) / (height - horizonY);
        const yOffset = Math.pow(relativeY, 2) * (height - horizonY) + horizonY;
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset);
        ctx.lineTo(width, yOffset);
        ctx.stroke();
      }

      // 2. Neon Pink slow sweep scanner lines (luxury telemetry UI feel)
      const sweepY = (frame * 1.2) % (height + 200) - 100;
      const gradientSweep = ctx.createLinearGradient(0, sweepY - 80, 0, sweepY);
      gradientSweep.addColorStop(0, 'rgba(255, 51, 102, 0)');
      gradientSweep.addColorStop(0.5, 'rgba(255, 51, 102, 0.04)');
      gradientSweep.addColorStop(1, 'rgba(255, 51, 102, 0)');

      ctx.fillStyle = gradientSweep;
      ctx.fillRect(0, sweepY - 80, width, 80);

      // Single razor line of scan
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, sweepY);
      ctx.lineTo(width, sweepY);
      ctx.stroke();

      // 3. Ambient slow moving circles representing neon signage glow
      const lights = [
        { x: width * 0.25, y: height * 0.4, r: 250, color: 'rgba(255, 51, 102, 0.05)' },
        { x: width * 0.8, y: height * 0.7, r: 350, color: 'rgba(255, 51, 102, 0.03)' },
        { x: width * 0.5, y: height * 0.2, r: 400, color: 'rgba(40, 40, 45, 0.2)' }
      ];

      lights.forEach((light) => {
        const radGrd = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r);
        radGrd.addColorStop(0, light.color);
        radGrd.addColorStop(1, 'rgba(10, 10, 10, 0)');
        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update and draw steam and twilight floaters
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(frame * p.pulseSpeed) * 0.005;

        // Reset if goes off screen
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(255, 51, 102, ${Math.max(0.01, Math.min(0.5, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Slight glow under the larger floating steam particles
        if (p.size > 2.5) {
          ctx.shadowColor = '#FF3366';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 51, 102, ${p.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Draw horizontal HUD frame telemetry at top
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 40);
      ctx.lineTo(120, 40);
      ctx.moveTo(40, 40);
      ctx.lineTo(40, 80);
      
      ctx.moveTo(width - 40, 40);
      ctx.lineTo(width - 120, 40);
      ctx.moveTo(width - 40, 40);
      ctx.lineTo(width - 40, 80);
      ctx.stroke();

      // Draw faint geometric grid intersection points
      ctx.fillStyle = 'rgba(255, 51, 102, 0.1)';
      ctx.fillRect(40, 40, 2, 2);
      ctx.fillRect(width - 42, 40, 2, 2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div id="ambient-canvas-wrapper" className="absolute inset-0 block overflow-hidden z-0 bg-[#0A0A0A]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
      {/* Absolute dark radial vignetting layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.1)_0%,#0A0A0A_95%)] pointer-events-none" />
    </div>
  );
}
