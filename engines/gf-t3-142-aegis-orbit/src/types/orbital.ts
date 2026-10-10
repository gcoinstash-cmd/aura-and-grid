/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

export interface KeplerianElements {
  semiMajorAxisKm: number;      // a (km)
  eccentricity: number;         // e (0 to 1)
  inclinationDeg: number;       // i (degrees)
  raanDeg: number;              // Right Ascension of Ascending Node Ω (degrees)
  argPerigeeDeg: number;        // Argument of Perigee ω (degrees)
  trueAnomalyDeg: number;       // True Anomaly ν (degrees)
  epochUtc: string;             // ISO-8601 UTC
  bStar: number;                // B* drag term (1/earth radii)
}

export interface CartesianState {
  r: [number, number, number];  // [x, y, z] in km (ECI frame)
  v: [number, number, number];  // [vx, vy, vz] in km/s (ECI frame)
  epochUtc: string;
}

export interface HillRelativeState {
  r_ric: [number, number, number]; // [Radial, In-track, Cross-track] in meters
  v_ric: [number, number, number]; // [v_R, v_I, v_C] in m/s
}

export interface CovarianceMatrix6x6 {
  // 6x6 upper-triangular or full symmetric covariance array
  data: number[][]; // [km^2 / km*km/s / km^2/s^2]
  sigmaRadialMeters: number;
  sigmaInTrackMeters: number;
  sigmaCrossTrackMeters: number;
}

export interface SatelliteNode {
  id: string;
  noradId: number;
  name: string;
  planeId: string;
  slotIndex: number;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL_MANEUVER' | 'MAINTENANCE';
  dryMassKg: number;
  propellantRemainingKg: number;
  propellantInitialKg: number;
  thrusterType: 'KRYPTON_HALL' | 'XENON_ION' | 'HYDRAZINE_MONOPROP';
  ispSeconds: number;
  maxThrustMilliNewtons: number;
  elements: KeplerianElements;
  state: CartesianState;
  telemetry: {
    batterySocPercent: number;
    solarArrayPowerWatts: number;
    starTrackerLockStatus: boolean;
    gpsLockChannels: number;
    ekfInnovationNorm: number;
    dragDecayMetersPerDay: number;
    lastContactUtc: string;
  };
}

export interface ConjunctionEvent {
  conjunctionId: string;
  primaryNoradId: number;
  primaryName: string;
  secondaryNoradId: number;
  secondaryName: string;
  secondaryObjectType: 'DEBRIS' | 'DEFUNCT_SAT' | 'PAYLOAD' | 'ROCKET_BODY';
  tcaUtc: string;
  timeToTcaSeconds: number;
  probabilityOfCollision: number; // Pc (e.g. 2.45e-4)
  pcThreshold: number;           // 1.0e-4 (Automated Maneuver Limit)
  missDistanceTotalMeters: number;
  missDistanceVectorRicMeters: [number, number, number]; // [Radial, In-track, Cross-track]
  relativeVelocityKmPerSec: number;
  combinedHardBodyRadiusMeters: number;
  collisionStatus: 'MONITORING' | 'ACTION_REQUIRED' | 'MANEUVER_SCHEDULED' | 'RESOLVED';
  recommendedDeltaV: [number, number, number]; // [dv_R, dv_I, dv_C] in m/s
}

export interface ManeuverPlan {
  maneuverId: string;
  satelliteId: string;
  satelliteName: string;
  targetConjunctionId?: string;
  maneuverType: 'COLLISION_AVOIDANCE' | 'ALTITUDE_RAISE' | 'PLANE_INCLINATION_TRIM' | 'PHASING_CORRECTION';
  plannedEpochUtc: string;
  deltaVVectorRicMps: [number, number, number]; // [dv_R, dv_I, dv_C] m/s
  deltaVMagnitudeMps: number;
  burnDurationSeconds: number;
  propellantConsumptionKg: number;
  postManeuverMissDistanceMeters?: number;
  postManeuverPc?: number;
  thrusterDutyCyclePercent: number;
  status: 'PENDING_APPROVAL' | 'COMMITTED' | 'EXECUTING' | 'COMPLETED' | 'VERIFIED';
}

export interface EkfStateSnapshot {
  epochUtc: string;
  estimatedPositionKm: [number, number, number];
  estimatedVelocityKmPerSec: [number, number, number];
  estimatedCd: number;
  positionResidualsMeters: [number, number, number];
  velocityResidualsMps: [number, number, number];
  covariance3SigmaPositionMeters: [number, number, number];
  sensorFusionStatus: {
    gnssQuality: 'CARRIER_FIX' | 'FLOAT_PPP' | 'DOPPLER';
    starTrackerResidualArcsec: number;
    imuBiasDriftDegPerHour: number;
    conditionNumber: number;
  };
}

export interface ComputeP99Metrics {
  currentCycleLatencyMs: number;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p99LatencyMs: number;
  slaLimitMs: number; // 8.2ms
  trajectoryStepRateHz: number;
  simdVectorWidthBits: number;
  activeThreads: number;
  memoryFootprintKb: number;
  conjunctionChecksPerSec: number;
  lastStepTimestampUtc: string;
}
