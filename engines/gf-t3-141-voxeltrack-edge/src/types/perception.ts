/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrackClassification = 
  | 'VEHICLE'
  | 'PEDESTRIAN'
  | 'CYCLIST'
  | 'MOTORCYCLIST'
  | 'ROAD_OBSTACLE'
  | 'EMERGENCY_VEHICLE';

export type ThreatLevel = 
  | 'NOMINAL'
  | 'CAUTION'
  | 'WARNING'
  | 'CRITICAL_COLLISION_IMMINENT';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Velocity3D {
  vx: number;
  vy: number;
  vz: number;
}

export interface Dimensions3D {
  length: number;
  width: number;
  height: number;
}

export interface TrackedObject {
  id: string;
  trackId: string;
  classification: TrackClassification;
  confidence: number;
  position: Vector3D;
  velocity: Velocity3D;
  acceleration: { ax: number; ay: number };
  dimensions: Dimensions3D;
  yaw: number;
  yawRate: number;
  ttcSeconds: number | null;
  threatLevel: ThreatLevel;
  distance: number;
  history: Vector3D[];
  covarianceDiagonal: [number, number, number, number, number, number];
}

export interface TelemetryFrame {
  frameSeq: number;
  timestampNs: number;
  loopLatencyMs: number;
  jitterMs: number;
  rawPointCount: number;
  octreeNodes: number;
  activeTracksCount: number;
  packetLossPct: number;
  driftMs: number;
  threatDetected: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  frameSeq: number;
  trackId: string;
  classification: TrackClassification;
  coordinates: string;
  velocity: string;
  ttc: string;
  status: 'TRACKED_OK' | 'CRITICAL_THREAT' | 'ASSOCIATED' | 'OCTREE_INSERT';
}

export interface VoxelNode {
  x: number;
  y: number;
  z: number;
  size: number;
  occupancy: number; // 0.0 to 1.0
  color: string;
}
