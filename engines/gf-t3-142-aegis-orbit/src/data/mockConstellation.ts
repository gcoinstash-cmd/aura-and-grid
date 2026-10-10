/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 */

import { SatelliteNode, ConjunctionEvent, ManeuverPlan } from '../types/orbital';
import { keplerianToCartesian } from '../engine/physics/sgp4';

export const INITIAL_SATELLITES: SatelliteNode[] = [
  {
    id: 'SAT-AEGIS-01',
    noradId: 54201,
    name: 'Aegis Sentinel 1A',
    planeId: 'PLANE-ALPHA',
    slotIndex: 0,
    status: 'WARNING',
    dryMassKg: 260.0,
    propellantRemainingKg: 34.82,
    propellantInitialKg: 38.0,
    thrusterType: 'KRYPTON_HALL',
    ispSeconds: 1800,
    maxThrustMilliNewtons: 65.0,
    elements: {
      semiMajorAxisKm: 6928.137, // ~550 km altitude
      eccentricity: 0.00045,
      inclinationDeg: 53.05,
      raanDeg: 42.18,
      argPerigeeDeg: 88.42,
      trueAnomalyDeg: 134.21,
      epochUtc: new Date().toISOString(),
      bStar: 0.000184
    },
    state: keplerianToCartesian({
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00045,
      inclinationDeg: 53.05,
      raanDeg: 42.18,
      argPerigeeDeg: 88.42,
      trueAnomalyDeg: 134.21,
      epochUtc: new Date().toISOString(),
      bStar: 0.000184
    }),
    telemetry: {
      batterySocPercent: 94.2,
      solarArrayPowerWatts: 840.5,
      starTrackerLockStatus: true,
      gpsLockChannels: 18,
      ekfInnovationNorm: 0.42,
      dragDecayMetersPerDay: 28.4,
      lastContactUtc: new Date().toISOString()
    }
  },
  {
    id: 'SAT-AEGIS-02',
    noradId: 54202,
    name: 'Aegis Sentinel 1B',
    planeId: 'PLANE-ALPHA',
    slotIndex: 1,
    status: 'NOMINAL',
    dryMassKg: 260.0,
    propellantRemainingKg: 36.15,
    propellantInitialKg: 38.0,
    thrusterType: 'KRYPTON_HALL',
    ispSeconds: 1800,
    maxThrustMilliNewtons: 65.0,
    elements: {
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00038,
      inclinationDeg: 53.05,
      raanDeg: 42.18,
      argPerigeeDeg: 120.15,
      trueAnomalyDeg: 254.80,
      epochUtc: new Date().toISOString(),
      bStar: 0.000176
    },
    state: keplerianToCartesian({
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00038,
      inclinationDeg: 53.05,
      raanDeg: 42.18,
      argPerigeeDeg: 120.15,
      trueAnomalyDeg: 254.80,
      epochUtc: new Date().toISOString(),
      bStar: 0.000176
    }),
    telemetry: {
      batterySocPercent: 88.7,
      solarArrayPowerWatts: 795.0,
      starTrackerLockStatus: true,
      gpsLockChannels: 20,
      ekfInnovationNorm: 0.31,
      dragDecayMetersPerDay: 26.8,
      lastContactUtc: new Date().toISOString()
    }
  },
  {
    id: 'SAT-AEGIS-03',
    noradId: 54203,
    name: 'Aegis Sentinel 2A',
    planeId: 'PLANE-BRAVO',
    slotIndex: 0,
    status: 'NOMINAL',
    dryMassKg: 260.0,
    propellantRemainingKg: 35.40,
    propellantInitialKg: 38.0,
    thrusterType: 'KRYPTON_HALL',
    ispSeconds: 1800,
    maxThrustMilliNewtons: 65.0,
    elements: {
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00041,
      inclinationDeg: 53.05,
      raanDeg: 102.18,
      argPerigeeDeg: 45.30,
      trueAnomalyDeg: 18.50,
      epochUtc: new Date().toISOString(),
      bStar: 0.000180
    },
    state: keplerianToCartesian({
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00041,
      inclinationDeg: 53.05,
      raanDeg: 102.18,
      argPerigeeDeg: 45.30,
      trueAnomalyDeg: 18.50,
      epochUtc: new Date().toISOString(),
      bStar: 0.000180
    }),
    telemetry: {
      batterySocPercent: 96.5,
      solarArrayPowerWatts: 860.0,
      starTrackerLockStatus: true,
      gpsLockChannels: 19,
      ekfInnovationNorm: 0.28,
      dragDecayMetersPerDay: 27.5,
      lastContactUtc: new Date().toISOString()
    }
  },
  {
    id: 'SAT-AEGIS-04',
    noradId: 54204,
    name: 'Aegis Sentinel 2B',
    planeId: 'PLANE-BRAVO',
    slotIndex: 1,
    status: 'NOMINAL',
    dryMassKg: 260.0,
    propellantRemainingKg: 37.02,
    propellantInitialKg: 38.0,
    thrusterType: 'KRYPTON_HALL',
    ispSeconds: 1800,
    maxThrustMilliNewtons: 65.0,
    elements: {
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00035,
      inclinationDeg: 53.05,
      raanDeg: 102.18,
      argPerigeeDeg: 180.20,
      trueAnomalyDeg: 138.90,
      epochUtc: new Date().toISOString(),
      bStar: 0.000172
    },
    state: keplerianToCartesian({
      semiMajorAxisKm: 6928.137,
      eccentricity: 0.00035,
      inclinationDeg: 53.05,
      raanDeg: 102.18,
      argPerigeeDeg: 180.20,
      trueAnomalyDeg: 138.90,
      epochUtc: new Date().toISOString(),
      bStar: 0.000172
    }),
    telemetry: {
      batterySocPercent: 91.0,
      solarArrayPowerWatts: 820.0,
      starTrackerLockStatus: true,
      gpsLockChannels: 17,
      ekfInnovationNorm: 0.35,
      dragDecayMetersPerDay: 27.1,
      lastContactUtc: new Date().toISOString()
    }
  }
];

export const INITIAL_CONJUNCTIONS: ConjunctionEvent[] = [
  {
    conjunctionId: 'CARA-2026-8941',
    primaryNoradId: 54201,
    primaryName: 'Aegis Sentinel 1A',
    secondaryNoradId: 34812,
    secondaryName: 'FENGYUN 1C DEB (SSN #34812)',
    secondaryObjectType: 'DEBRIS',
    tcaUtc: new Date(Date.now() + 6840 * 1000).toISOString(),
    timeToTcaSeconds: 6840,
    probabilityOfCollision: 0.000284, // 2.84e-4 > 1.0e-4 threshold
    pcThreshold: 0.000100,
    missDistanceTotalMeters: 74.2,
    missDistanceVectorRicMeters: [18.4, 68.2, -24.1],
    relativeVelocityKmPerSec: 14.82,
    combinedHardBodyRadiusMeters: 8.5,
    collisionStatus: 'ACTION_REQUIRED',
    recommendedDeltaV: [0.012, 0.165, -0.008]
  },
  {
    conjunctionId: 'CARA-2026-8942',
    primaryNoradId: 54202,
    primaryName: 'Aegis Sentinel 1B',
    secondaryNoradId: 41208,
    secondaryName: 'COSMOS 2251 DEB (SSN #41208)',
    secondaryObjectType: 'DEBRIS',
    tcaUtc: new Date(Date.now() + 24200 * 1000).toISOString(),
    timeToTcaSeconds: 24200,
    probabilityOfCollision: 0.000032, // 3.2e-5 < 1.0e-4 (monitoring)
    pcThreshold: 0.000100,
    missDistanceTotalMeters: 420.5,
    missDistanceVectorRicMeters: [-62.0, 395.0, 128.0],
    relativeVelocityKmPerSec: 11.45,
    combinedHardBodyRadiusMeters: 8.5,
    collisionStatus: 'MONITORING',
    recommendedDeltaV: [0.0, 0.0, 0.0]
  },
  {
    conjunctionId: 'CARA-2026-8943',
    primaryNoradId: 54203,
    primaryName: 'Aegis Sentinel 2A',
    secondaryNoradId: 28945,
    secondaryName: 'CZ-4B R/B SPENT UPPER STAGE',
    secondaryObjectType: 'ROCKET_BODY',
    tcaUtc: new Date(Date.now() + 48900 * 1000).toISOString(),
    timeToTcaSeconds: 48900,
    probabilityOfCollision: 0.000008,
    pcThreshold: 0.000100,
    missDistanceTotalMeters: 1280.0,
    missDistanceVectorRicMeters: [140.0, 1240.0, -290.0],
    relativeVelocityKmPerSec: 9.80,
    combinedHardBodyRadiusMeters: 12.0,
    collisionStatus: 'MONITORING',
    recommendedDeltaV: [0.0, 0.0, 0.0]
  }
];

export const INITIAL_MANEUVERS: ManeuverPlan[] = [
  {
    maneuverId: 'MAN-2026-104',
    satelliteId: 'SAT-AEGIS-01',
    satelliteName: 'Aegis Sentinel 1A',
    targetConjunctionId: 'CARA-2026-8941',
    maneuverType: 'COLLISION_AVOIDANCE',
    plannedEpochUtc: new Date(Date.now() + 3600 * 1000).toISOString(),
    deltaVVectorRicMps: [0.012, 0.165, -0.008],
    deltaVMagnitudeMps: 0.1656,
    burnDurationSeconds: 662.0,
    propellantConsumptionKg: 0.0024,
    postManeuverMissDistanceMeters: 1420.0,
    postManeuverPc: 0.000001,
    thrusterDutyCyclePercent: 100.0,
    status: 'PENDING_APPROVAL'
  }
];
