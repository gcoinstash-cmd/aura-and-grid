export type Polarity = 1 | -1;

export interface DvsEvent {
  x: number;          // 0 - 255 or 0 - 512
  y: number;          // 0 - 255 or 0 - 512
  timestampUs: number;// Monotonic microsecond timestamp
  polarity: Polarity; // +1 (ON / Increase in log intensity) or -1 (OFF / Decrease)
}

export interface OpticalFlowVector {
  x: number;
  y: number;
  vx: number;         // Velocity in pixels/microsecond (or pixels/second scaled)
  vy: number;
  magnitude: number;  // sqrt(vx^2 + vy^2)
  angleRad: number;   // atan2(vy, vx)
  confidence: number; // Based on local gradient determinant & eigenvalue conditioning
  conditionNumber: number; // kappa(A^T W A)
  timestampUs: number;
}

export interface LifNeuronState {
  id: number;
  x: number;
  y: number;
  membranePotential: number; // V_i(t) in mV
  vRest: number;             // -70 mV
  vThreshold: number;        // -55 mV
  vReset: number;            // -75 mV
  lastSpikeUs: number;
  refractoryPeriodUs: number;// 10 microseconds
  isSpiking: boolean;
  firingRateHz: number;
}

export interface TrackingTarget {
  id: string;
  label: string;
  centroidX: number;
  centroidY: number;
  vx: number;
  vy: number;
  radius: number;
  confidence: number;
  spikeDensity: number;
  timeToCollisionMs: number; // TTC in milliseconds
  activeSpikesCount: number;
  trajectory: Array<{ x: number; y: number; timestampUs: number }>;
}

export interface DvsSensorConfig {
  sensorId: string;
  resolutionX: number;
  resolutionY: number;
  contrastThresholdOn: number;  // Theta_on, default 0.18
  contrastThresholdOff: number; // Theta_off, default -0.18
  refractoryPeriodUs: number;   // 10 microseconds
  hotPixelFilterEnabled: boolean;
  bandwidthMbps: number;
  spatialNeighborhoodRadius: number; // R for SAE patch, default 4
  temporalDecayTauUs: number;        // 50,000 microseconds
}

export interface TelemetryMetrics {
  currentThroughputEvSec: number;
  peakThroughputEvSec: number;
  p99LatencyUs: number;
  p95LatencyUs: number;
  meanLatencyUs: number;
  jitterUs: number;
  activePixelRatio: number;
  droppedEventCount: number;
  bandwidthUsageMbps: number;
  temperatureCelsius: number;
  powerConsumptionWatts: number;
  monotonicClockUs: number;
}

export type TrajectoryMode = 'ROTATIONAL_VORTEX' | 'LATERAL_PAN' | 'EMERGENCY_DECEL' | 'F1_SLALOM';
