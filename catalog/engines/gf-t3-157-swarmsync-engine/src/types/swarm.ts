/**
 * GF-T3-157: SWARMSYNC ENGINE — TYPESCRIPT TYPE SYSTEM
 */

export interface Vector2 {
  x: number;
  y: number;
}

export interface DroneNodeData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  cbfActive: boolean;
  cbfSlack: number;
  cbfDeflectionX: number;
  cbfDeflectionY: number;
  consensusVal: number;
  isByzantine: boolean;
  neighbors: number[];
  history: Vector2[];
}

export interface ObstacleData {
  id: string;
  x: number;
  y: number;
  radius: number;
  safetyMargin: number;
  label?: string;
  interventions: number;
}

export interface SwarmConfig {
  nodeCount: number;
  wSep: number;
  wAli: number;
  wCoh: number;
  wGoal: number;
  maxSpeed: number;
  cbfAlpha: number;
  safetyMargin: number;
  commRadius: number;
  fixedPointPrecision: boolean;
}

export interface TelemetryState {
  epoch: number;
  avgConsensusLatencyUs: number;
  minInterDroneDistM: number;
  minObstacleDistM: number;
  cbfInterventionsPerSec: number;
  algebraicConnectivity: number;
  zeroCollisionInvariantHolds: boolean;
  byzantineActiveCount: number;
  fps: number;
}

export type RadarToolMode = 'inspect' | 'add_obstacle' | 'move_target' | 'delete_obstacle';
export type ObstaclePresetSize = 'small' | 'medium' | 'large' | 'huge';
