/**
 * Type definitions for AeroKinetic Engine // GF-T3-156
 * 16-State ES-EKF, Covariance, Diagnostics & Telemetry
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface EulerDegrees {
  roll: number;
  pitch: number;
  yaw: number;
}

export interface IMUData {
  timestamp: number;
  accel: [number, number, number]; // m/s^2
  gyro: [number, number, number];  // rad/s
}

export interface GNSSData {
  timestamp: number;
  position: [number, number, number]; // meters [x, y, z]
  stdDev: number; // meters
}

export interface OpticalFlowData {
  timestamp: number;
  velocity: [number, number, number]; // m/s [vx, vy, vz]
  stdDev: number;
}

export interface StateSummary {
  timestamp: number;
  position: [number, number, number];
  velocity: [number, number, number];
  quaternion: [number, number, number, number]; // [w, x, y, z]
  euler: EulerDegrees;
  accelBias: [number, number, number];
  gyroBias: [number, number, number];
  stdPos: [number, number, number];
  stdVel: [number, number, number];
  stdAtt: [number, number, number];
  latencyUs: number;
  totalSteps: number;
  gpsAccepted: number;
  gpsRejected: number;
  lastGpsNis: number;
  lastFlowNis: number;
  covTrace: number;
  fixedPoint: {
    posTicks: [number, number, number];
    attitudeTicks: [number, number, number];
  };
}

export interface TrajectoryPoint {
  time: number;
  groundTruth: [number, number, number];
  filtered: [number, number, number];
  rawGps: [number, number, number];
  nis: number;
  wasRejected: boolean;
}

export interface TestResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  durationMs: number;
  detail: string;
}
