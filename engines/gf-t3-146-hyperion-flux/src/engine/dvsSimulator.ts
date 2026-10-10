import { DvsEvent, TrajectoryMode } from '../types/neuromorphic';

export class DvsStreamSimulator {
  private readonly width: number;
  private readonly height: number;
  private mode: TrajectoryMode = 'ROTATIONAL_VORTEX';
  private targetSpeedMultiplier: number = 1.0;
  private noiseRate: number = 0.03; // 3% background thermal noise
  private eventDensity: number = 1.0;

  private currentClockUs: number = 1000000; // Starts at 1.000000s
  private targetAngleRad: number = 0;
  private targetX: number = 128;
  private targetY: number = 128;
  private targetVx: number = 180;
  private targetVy: number = 0;
  private targetRadius: number = 28;
  private expansionPhase: number = 0;

  constructor(width: number = 256, height: number = 256) {
    this.width = width;
    this.height = height;
    this.targetX = width / 2;
    this.targetY = height / 2;
  }

  public setMode(mode: TrajectoryMode): void {
    this.mode = mode;
    if (mode === 'LATERAL_PAN') {
      this.targetX = 20;
      this.targetY = this.height / 2;
      this.targetVx = 220;
      this.targetVy = 0;
      this.targetRadius = 26;
    } else if (mode === 'ROTATIONAL_VORTEX') {
      this.targetX = this.width / 2;
      this.targetY = this.height / 2;
      this.targetRadius = 45;
    } else if (mode === 'EMERGENCY_DECEL') {
      this.targetX = this.width / 2;
      this.targetY = this.height / 2;
      this.targetRadius = 16;
      this.expansionPhase = 0;
    } else if (mode === 'F1_SLALOM') {
      this.targetX = 30;
      this.targetY = this.height / 2;
      this.targetRadius = 24;
    }
  }

  public setSpeedMultiplier(mult: number): void {
    this.targetSpeedMultiplier = Math.max(0.1, Math.min(5.0, mult));
  }

  public setNoiseRate(rate: number): void {
    this.noiseRate = Math.max(0, Math.min(0.25, rate));
  }

  public setEventDensity(density: number): void {
    this.eventDensity = Math.max(0.2, Math.min(3.0, density));
  }

  /**
   * Advance the microsecond simulation clock by deltaMicroseconds and generate synthesized asynchronous DVS events
   */
  public step(deltaUs: number): DvsEvent[] {
    const events: DvsEvent[] = [];
    const stepCount = Math.max(1, Math.floor((deltaUs / 100) * this.eventDensity));
    const dtPerEvent = deltaUs / stepCount;

    for (let i = 0; i < stepCount; i++) {
      this.currentClockUs += dtPerEvent;
      const t = this.currentClockUs;
      const tSec = t / 1_000_000;

      // Update trajectory kinematics
      if (this.mode === 'ROTATIONAL_VORTEX') {
        const angularVelocityRadSec = 2 * Math.PI * 35 * this.targetSpeedMultiplier; // 35 rev/s = 2,100 RPM scaled for smooth 60fps
        this.targetAngleRad += (angularVelocityRadSec * (dtPerEvent / 1_000_000));
        
        // Generate edge points along a rotating high-contrast textured disk with 3 crossbars
        const barIdx = Math.floor(Math.random() * 3);
        const barAngle = this.targetAngleRad + (barIdx * Math.PI / 3);
        const distFromCenter = (Math.random() * 0.9 + 0.1) * this.targetRadius;
        
        const px = Math.round(this.width / 2 + Math.cos(barAngle) * distFromCenter);
        const py = Math.round(this.height / 2 + Math.sin(barAngle) * distFromCenter);
        
        // Polarity depends on direction of motion relative to gradient
        const polarity: 1 | -1 = (Math.sin(barAngle) * Math.cos(this.targetAngleRad) > 0) ? 1 : -1;

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          events.push({ x: px, y: py, timestampUs: Math.round(t), polarity });
        }
      } else if (this.mode === 'LATERAL_PAN') {
        this.targetX += (this.targetVx * this.targetSpeedMultiplier * (dtPerEvent / 1_000_000));
        if (this.targetX > this.width - 30) {
          this.targetVx = -Math.abs(this.targetVx);
        } else if (this.targetX < 30) {
          this.targetVx = Math.abs(this.targetVx);
        }

        // Generate events along perimeter of moving vehicle silhouette
        const angle = Math.random() * Math.PI * 2;
        const px = Math.round(this.targetX + Math.cos(angle) * this.targetRadius);
        const py = Math.round(this.targetY + Math.sin(angle) * (this.targetRadius * 0.65));
        const polarity: 1 | -1 = (Math.cos(angle) * this.targetVx > 0) ? 1 : -1;

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          events.push({ x: px, y: py, timestampUs: Math.round(t), polarity });
        }
      } else if (this.mode === 'EMERGENCY_DECEL') {
        // Rapid expansion of obstacle (Time to Collision shrinking rapidly, optical divergence)
        this.expansionPhase += (dtPerEvent / 1_000_000) * 1.8 * this.targetSpeedMultiplier;
        const currentRadius = 14 + (Math.sin(this.expansionPhase) * 0.5 + 0.5) * 58;
        
        const angle = Math.random() * Math.PI * 2;
        const px = Math.round(this.width / 2 + Math.cos(angle) * currentRadius);
        const py = Math.round(this.height / 2 + Math.sin(angle) * currentRadius);
        const isExpanding = Math.cos(this.expansionPhase) > 0;
        const polarity: 1 | -1 = isExpanding ? 1 : -1;

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          events.push({ x: px, y: py, timestampUs: Math.round(t), polarity });
        }
      } else if (this.mode === 'F1_SLALOM') {
        // Slalom trajectory across X with sinusoidal Y oscillations
        const f1Speed = 160 * this.targetSpeedMultiplier;
        this.targetX += f1Speed * (dtPerEvent / 1_000_000);
        if (this.targetX > this.width - 25) this.targetX = 25;
        this.targetY = (this.height / 2) + Math.sin(tSec * 6.5 * this.targetSpeedMultiplier) * 55;

        const angle = Math.random() * Math.PI * 2;
        const px = Math.round(this.targetX + Math.cos(angle) * this.targetRadius);
        const py = Math.round(this.targetY + Math.sin(angle) * this.targetRadius);
        const polarity: 1 | -1 = (Math.random() > 0.48) ? 1 : -1;

        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          events.push({ x: px, y: py, timestampUs: Math.round(t), polarity });
        }
      }

      // Random thermal background noise injection
      if (Math.random() < this.noiseRate) {
        const nx = Math.floor(Math.random() * this.width);
        const ny = Math.floor(Math.random() * this.height);
        events.push({
          x: nx,
          y: ny,
          timestampUs: Math.round(t),
          polarity: Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    return events;
  }

  public getCurrentClockUs(): number {
    return this.currentClockUs;
  }

  public getMode(): TrajectoryMode {
    return this.mode;
  }
}
