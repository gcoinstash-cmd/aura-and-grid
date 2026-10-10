export interface TelemetryFrame {
  id: number;
  timestamp: string;
  monotonic_ns: number;
  speed_mph: number;
  throttle_pct: number;
  brake_pressure_bar: number;
  suspension: {
    fl_mm: number;
    fr_mm: number;
    rl_mm: number;
    rr_mm: number;
  };
  imu: {
    pitch_deg: number;
    roll_deg: number;
    yaw_rate_dps: number;
    lat_g: number;
    long_g: number;
    vert_g: number;
  };
  aero: {
    cop_front_pct: number;
    cop_rear_pct: number;
    downforce_front_kgf: number;
    downforce_rear_kgf: number;
    total_downforce_kgf: number;
    drag_kgf: number;
    wing_flap_deg: number;
    drs_state: 'OPEN' | 'CLOSED' | 'AIRBRAKE_DEPLOYED' | 'STALL_LOCKED';
    stall_margin_pct: number;
  };
  engine: {
    loop_latency_us: number;
    ekf_residual: number;
    packet_loss_count: number;
    can_bus_load_pct: number;
  };
}

export type ScenarioType = 
  | 'BRAKING_200MPH'
  | 'APEX_TRANSITION'
  | 'DRS_HIGH_SPEED'
  | 'CROSSWIND_RECOVERY';

export interface ScenarioDefinition {
  id: ScenarioType;
  name: string;
  description: string;
  durationMs: number;
  initialSpeed: number;
  targetSpeed: number;
  initialWingAngle: number;
  targetWingAngle: number;
  peakDownforce: number;
  copShift: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  requestBodyExample?: Record<string, any>;
  queryParamsExample?: Record<string, string>;
  responseExample: Record<string, any>;
  status: number;
}

export interface NodeHealth {
  id: string;
  name: string;
  region: string;
  type: 'EDGE_COMPUTE' | 'BUFFER_RING' | 'ALLOYDB_PRIMARY' | 'REDIS_STREAM' | 'ACTUATOR_GATEWAY';
  status: 'OPTIMAL' | 'DEGRADED' | 'FAILOVER_STANDBY';
  cpuUsagePct: number;
  memoryUsagePct: number;
  latencyMs: number;
  throughputPerSec: number;
  activeThreads: number;
}
