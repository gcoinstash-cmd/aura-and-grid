export interface Point {
  x: number;
  y: number;
}

export interface DroneNode {
  id: string;
  code: string;
  position: Point;
  velocity: Point;
  targetCentroid: Point;
  cellArea: number;
  cellVertices: Point[];
  battery: number; // percentage
  status: 'OPTIMAL' | 'CONVERGING' | 'RELOCATING' | 'WARNING';
  color: string;
  loadRatio: number;
  lastDistanceToCentroid: number;
}

export interface ExclusionZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  type: 'NO_FLY' | 'EW_JAMMING' | 'TERRAIN_HAZARD';
  severity: 'HIGH' | 'CRITICAL' | 'ELEVATED';
}

export interface SimulationState {
  nodes: DroneNode[];
  exclusionZones: ExclusionZone[];
  isRunning: boolean;
  lloydGain: number; // gamma: 0.1 - 2.0
  coverageDamping: number; // damping factor: 0.0 - 1.0
  swarmDensity: number; // count: 24 - 64
  cycleLatencyUs: number; // microseconds
  coverageEfficiency: number; // percentage
  maxDistortionRatio: number; // area max / area min
  lyapunovEnergy: number; // H(P)
  energyHistory: { step: number; energy: number; timestamp: number }[];
  stepCount: number;
  showMeshLines: boolean;
  showCentroids: boolean;
  showVelocityVectors: boolean;
  showHeatmap: boolean;
  selectedNodeId: string | null;
  draggedNodeId: string | null;
  draggedZoneId: string | null;
  interactionMode: 'INSPECT' | 'DRAG_NODE' | 'ADD_THREAT' | 'ADD_NODE';
}
