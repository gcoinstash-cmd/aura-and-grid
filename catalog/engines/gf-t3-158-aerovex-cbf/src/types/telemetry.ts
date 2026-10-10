export interface AgentNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  nominalVx: number;
  nominalVy: number;
  radius: number;
  hMin: number;
  isDeflecting: boolean;
  deltaU: {
    x: number;
    y: number;
  };
  qpLatencyUs: number;
  history: Array<{ x: number; y: number }>;
}

export interface IntruderZone {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
}

export interface CBFConfig {
  alpha: number; // Barrier rigidity
  rSafe: number; // Safety radius in meters / px
  nodeCount: number; // Agent density
  simSpeed: number;
  formation: 'cross_flow' | 'concentric_circle' | 'corridor' | 'grid_transit';
  showHalos: boolean;
  showDeflections: boolean;
  showIntruders: boolean;
  showTrails: boolean;
}

export interface AirspaceMetrics {
  activeNodes: number;
  qpDeflectionsCount: number;
  minSeparationMeters: number;
  meanSolverLatencyUs: number;
  violationsCount: number; // Strict invariant: 0
  activeThreatsResolved: number;
  stepCount: number;
}
