import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  decay: number;
  type: 'coin' | 'neon-spark' | 'streak-ember' | 'ember-shooting-star';
  bounceCount: number;
}

interface StimChartCanvasProps {
  triggerBlastCount: number;
  quickAddCount: number;
  totalBtc: number;
  livePrice: number | null;
  onStackClick: () => void;
  currentStreak: number;
  dopamineGravity?: number;
  particleCountMultiplier?: number;
  particleColorPreset?: 'gold' | 'neon' | 'emerald' | 'amber';
}

export function StimChartCanvas({
  triggerBlastCount,
  quickAddCount,
  totalBtc,
  livePrice,
  onStackClick,
  currentStreak,
  dopamineGravity = 0.25,
  particleCountMultiplier = 1.0,
  particleColorPreset = 'gold'
}: StimChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const prevTriggerBlastCount = useRef(triggerBlastCount);
  const prevQuickAddCount = useRef(quickAddCount);

  // Maintain streak in a mutable ref to keep canvas updates butter-smooth without restarts
  const streakRef = useRef(currentStreak);
  useEffect(() => {
    streakRef.current = currentStreak;
  }, [currentStreak]);

  // Orbit radius tracked via ref to permit smooth easing transitions
  const currentOrbitRadius = useRef<number>(76);

  // Spawns neon-green explosion sparks inside the canvas
  const spawnNeonGreenExplosion = (count: number = 55) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const originX = width / 2;
    const originY = height / 2 + 10;
    const finalCount = Math.round(count * particleCountMultiplier);

    for (let i = 0; i < finalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      
      let colors = ['#22c55e', '#4ade80', '#86efac', '#10b981', '#00ff66'];
      if (particleColorPreset === 'neon') {
        colors = ['#f472b6', '#ec4899', '#db2777', '#c084fc', '#a855f7'];
      } else if (particleColorPreset === 'emerald') {
        colors = ['#86efac', '#34d399', '#10b981', '#059669', '#34d399'];
      } else if (particleColorPreset === 'amber') {
        colors = ['#f97316', '#fbbf24', '#f59e0b', '#ea580c', '#d97706'];
      }
      const color = colors[Math.floor(Math.random() * colors.length)];

      particlesRef.current.push({
        x: originX + (Math.random() * 40 - 20),
        y: originY + (Math.random() * 20 - 10),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 2.5 + Math.random() * 4.5,
        color: color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.2 - 0.1),
        alpha: 1.0,
        decay: 1 / (800 / 16.67), 
        type: 'neon-spark',
        bounceCount: 0
      });
    }
  };

  // Spawns standard yellow gold coin rain particles
  const spawnGoldCoins = (count: number = 15) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const finalCount = Math.round(count * particleCountMultiplier);
    for (let i = 0; i < finalCount; i++) {
      let finalColor = Math.random() > 0.5 ? '#FBBF24' : '#F59E0B';
      if (particleColorPreset === 'neon') {
        finalColor = '#d946ef'; // Fuchsia
      } else if (particleColorPreset === 'emerald') {
        finalColor = '#10b981'; // Emerald
      } else if (particleColorPreset === 'amber') {
        finalColor = '#ea580c'; // Dark orange amber
      }
      particlesRef.current.push({
        x: width / 2 + (Math.random() * 100 - 50),
        y: 20 + Math.random() * 30,
        vx: Math.random() * 6 - 3,
        vy: Math.random() * -3 - 1,
        size: 7 + Math.random() * 8,
        color: finalColor,
        rotation: Math.random() * Math.PI,
        rotationSpeed: Math.random() * 0.1 - 0.05,
        alpha: 1.0,
        decay: 0.012, 
        type: 'coin',
        bounceCount: 0
      });
    }
  };

  // Watch count variables to trigger bursts instantly
  useEffect(() => {
    if (triggerBlastCount > prevTriggerBlastCount.current) {
      // 1. Spawns high-intensity standard neon-green explosion
      spawnNeonGreenExplosion(55);

      // 2. Explode existing or freshly injected streak orbits as outward shooting stars
      const canvas = canvasRef.current;
      if (canvas) {
        const originX = canvas.width / 2;
        const originY = canvas.height / 2 + 10;
        const streak = streakRef.current;
        const particles = particlesRef.current;
        
        let convertedCount = 0;
        particles.forEach(p => {
          if (p.type === 'streak-ember') {
            const dx = p.x - originX;
            const dy = p.y - originY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const launchSpeed = 8 + Math.random() * 8 + (streak * 0.6);
            p.vx = (dx / dist) * launchSpeed;
            p.vy = (dy / dist) * launchSpeed;
            p.type = 'ember-shooting-star';
            p.decay = 0.018 + Math.random() * 0.015;
            p.alpha = 1.0;
            convertedCount++;
          }
        });

        // Inject shooting star vectors
        const injectionTarget = Math.max(16, streak * 8) - convertedCount;
        if (injectionTarget > 0) {
          for (let i = 0; i < injectionTarget; i++) {
            const theta = Math.random() * Math.PI * 2;
            const R = 45 + Math.random() * 30;
            const px = originX + Math.cos(theta) * R;
            const py = originY + Math.sin(theta) * R;
            
            const launchSpeed = 9 + Math.random() * 8 + (streak * 0.7);
            const vx = Math.cos(theta) * launchSpeed;
            const vy = Math.sin(theta) * launchSpeed;
            
            const colorSelection = ['#00ff66', '#10b981', '#34d399', '#a7f3d0'];
            const color = colorSelection[Math.floor(Math.random() * colorSelection.length)];

            particles.push({
              x: px,
              y: py,
              vx: vx,
              vy: vy,
              size: 2.2 + Math.random() * 2.5,
              color: color,
              rotation: theta,
              rotationSpeed: 0,
              alpha: 1.0,
              decay: 0.014 + Math.random() * 0.014,
              type: 'ember-shooting-star',
              bounceCount: 0
            });
          }
        }
      }

      prevTriggerBlastCount.current = triggerBlastCount;
    }
  }, [triggerBlastCount]);

  useEffect(() => {
    if (quickAddCount > prevQuickAddCount.current) {
      spawnGoldCoins(12); 
      spawnNeonGreenExplosion(20); 
      prevQuickAddCount.current = quickAddCount;
    }
  }, [quickAddCount]);

  // Main Canvas animation and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 420;
      canvas.height = rect?.height || 255;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updatePhysics = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      
      const originX = canvas.width / 2;
      const originY = canvas.height / 2 + 10;
      const streak = streakRef.current;

      // 1. Calculate dynamic bounding radius based on the active balance text length
      const balanceString = "$" + (totalBtc * (livePrice || 67420)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Calculate half text width (~9.5px per character of font-size 36px) and add 40px strict padding gap
      const charBasedRadius = (balanceString.length * 9.5) + 40;
      const streakExtra = streak * 2.5; 
      const targetRadius = Math.max(76, charBasedRadius + streakExtra);

      // Apply smooth easing function so the particle ring gracefully balloons outward rather than jumping rigidly
      currentOrbitRadius.current += (targetRadius - currentOrbitRadius.current) * 0.1;

      // 2. Continuous Visual Streak Aura generation when streakCount > 0
      if (streak > 0) {
        const activeStreakEmbers = particles.filter(p => p.type === 'streak-ember').length;
        // Ember capacity scales with streak
        const maxStreakEmbers = Math.min(130, streak * 16);
        
        if (activeStreakEmbers < maxStreakEmbers) {
          const spawnAmt = Math.min(4, Math.ceil(streak / 2));
          for (let s = 0; s < spawnAmt; s++) {
            const theta = Math.random() * Math.PI * 2;
            // Radius bounds fitting the dynamic orbit with additional drift layer
            const R = currentOrbitRadius.current + (Math.random() * 20);
            
            const px = originX + Math.cos(theta) * R;
            const py = originY + Math.sin(theta) * R;
            
            // Speed scales dynamically with streak count (slowed down by ~55% for a luxurious, calm orbit)
            const speedFactor = (0.4 + (streak * 0.12)) * 0.45;
            const vx = -Math.sin(theta) * speedFactor + (Math.random() * 0.18 - 0.09);
            const vy = Math.cos(theta) * speedFactor - (Math.random() * 0.225 + 0.045); 
            
            // Size scales brighter/larger on higher streaks
            const size = (1.5 + Math.random() * 1.8) * (1 + streak * 0.08);
            
            const emberColors = [
              '#00ff66', 
              '#10b981', 
              '#34d399', 
              '#059669', 
              '#6ee7b7'  
            ];
            const color = emberColors[Math.floor(Math.random() * emberColors.length)];

            particles.push({
              x: px,
              y: py,
              vx: vx,
              vy: vy,
              size: size,
              color: color,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() * 0.08 - 0.04) * 0.45,
              alpha: 0.6 + Math.random() * 0.35,
              decay: 0.005 + Math.random() * 0.008, 
              type: 'streak-ember',
              bounceCount: 0
            });
          }
        }
      }

      // 3. Physics & Render Loop
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.type === 'streak-ember') {
          // Continuous orbit with spring dampening centered on the balance ring
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          const dx = p.x - originX;
          const dy = p.y - originY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetR = currentOrbitRadius.current;
          // Soft magnetic pull scaled coordinate to slower velocities matching dynamic radius
          const force = (targetR - dist) * 0.0035;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

        } else if (p.type === 'ember-shooting-star') {
          // Bullet straight line outward trajectory
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

        } else {
          // Standard falling coins and neon points
          p.x += p.vx;
          p.y += p.vy;
          p.vy += dopamineGravity; 
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay; 

          // Bounce on bottom border boundary
          const bottomY = canvas.height - p.size;
          if (p.y > bottomY) {
            p.y = bottomY;
            p.vy = -p.vy * 0.55; 
            p.vx *= 0.78; 
            p.bounceCount += 1;
          }
        }

        // Render pass
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'ember-shooting-star') {
          // Sleek neon star trailing lines
          ctx.strokeStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 14;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.6, p.y - p.vy * 1.6);
          ctx.stroke();

        } else if (p.type === 'streak-ember') {
          // Orbiter halo dots
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6 + (streak * 1.8);
          ctx.fill();

        } else if (p.type === 'neon-spark') {
          // Explosive green haptic sparks
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 11;
          ctx.fill();

        } else {
          // Amber S coins
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#78350F';
          ctx.font = `bold ${p.size * 1.0}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('s', 0, 0);
        }

        ctx.restore();

        // Safe pruning
        if (p.alpha <= 0 || p.x < -100 || p.x > canvas.width + 100 || p.y < -100 || p.y > canvas.height + 100 || p.bounceCount > 4) {
          particles.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`p-5 rounded-3xl relative h-[255px] flex flex-col justify-between overflow-hidden backdrop-blur-md smooth-morph border ${
      currentStreak > 0
        ? 'bg-slate-950/90 border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
        : 'bg-slate-950/80 border-slate-800'
    }`}>
      {/* Background layer for canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-sm text-yellow-400 uppercase tracking-widest flex items-center gap-1">
            <span>Market Volatility Visualizer</span>
          </h3>
          <p className="text-[10px] text-zinc-500">Continuous high-frequency rendering stress-test</p>
        </div>
        <span className="bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
          Canvas Live ⚛
        </span>
      </div>

      <div className="relative z-10 text-center py-6">
        <div className="text-[11px] text-zinc-500 uppercase tracking-wide">Current Stack Value</div>
        <div className="text-4xl font-extrabold text-white mt-1 select-none tracking-tight">
          ${(totalBtc * (livePrice || 67420)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <button
        onClick={onStackClick}
        className="relative z-10 w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 active:translate-y-0.5 transition-all outline-none"
      >
        ⚡ Simulate Stack Burst
      </button>
    </div>
  );
}
