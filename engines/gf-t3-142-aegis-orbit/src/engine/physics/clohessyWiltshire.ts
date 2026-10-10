/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 * Clohessy-Wiltshire (Hill's) Relative Motion Equations & Autonomous Maneuver Solver
 */

import { CONSTANTS } from './sgp4';
import { HillRelativeState } from '../../types/orbital';

/**
 * Clohessy-Wiltshire (CW) Equations of Relative Motion in the Local-Vertical/Local-Horizontal (LVLH/RIC) frame:
 * Radial (x), In-Track (y), Cross-Track (z)
 * 
 * d^2 x / dt^2 - 2 n (dy/dt) - 3 n^2 x = f_x / m
 * d^2 y / dt^2 + 2 n (dx/dt) = f_y / m
 * d^2 z / dt^2 + n^2 z = f_z / m
 * 
 * where n = sqrt(mu / a^3) is the chief orbital mean motion.
 */

export interface CwStateTransitionMatrix {
  phi_rr: number[][]; // 3x3
  phi_rv: number[][]; // 3x3
  phi_vr: number[][]; // 3x3
  phi_vv: number[][]; // 3x3
}

/**
 * Generates the analytical 6x6 Clohessy-Wiltshire State Transition Matrix Phi(t)
 */
export function getCwStateTransitionMatrix(semiMajorAxisKm: number, dtSeconds: number): CwStateTransitionMatrix {
  const mu = CONSTANTS.MU_EARTH;
  const n = Math.sqrt(mu / Math.pow(semiMajorAxisKm, 3)); // mean motion in rad/s
  const nt = n * dtSeconds;
  const s = Math.sin(nt);
  const c = Math.cos(nt);

  // Position from Position: phi_rr
  const phi_rr = [
    [4 - 3 * c, 0, 0],
    [6 * (s - nt), 1, 0],
    [0, 0, c]
  ];

  // Position from Velocity: phi_rv
  const phi_rv = [
    [s / n, (2 / n) * (1 - c), 0],
    [(2 / n) * (c - 1), (4 * s - 3 * nt) / n, 0],
    [0, 0, s / n]
  ];

  // Velocity from Position: phi_vr
  const phi_vr = [
    [3 * n * s, 0, 0],
    [6 * n * (c - 1), 0, 0],
    [0, 0, -n * s]
  ];

  // Velocity from Velocity: phi_vv
  const phi_vv = [
    [c, 2 * s, 0],
    [-2 * s, 4 * c - 3, 0],
    [0, 0, c]
  ];

  return { phi_rr, phi_rv, phi_vr, phi_vv };
}

/**
 * Propagates relative state vector [x, y, z, vx, vy, vz] forward by dt using CW matrix.
 */
export function propagateCwRelativeState(
  initialState: HillRelativeState,
  semiMajorAxisKm: number,
  dtSeconds: number
): HillRelativeState {
  const phi = getCwStateTransitionMatrix(semiMajorAxisKm, dtSeconds);
  const r0 = initialState.r_ric;
  const v0 = initialState.v_ric;

  const rNext: [number, number, number] = [
    phi.phi_rr[0][0] * r0[0] + phi.phi_rr[0][1] * r0[1] + phi.phi_rr[0][2] * r0[2] +
    phi.phi_rv[0][0] * v0[0] + phi.phi_rv[0][1] * v0[1] + phi.phi_rv[0][2] * v0[2],

    phi.phi_rr[1][0] * r0[0] + phi.phi_rr[1][1] * r0[1] + phi.phi_rr[1][2] * r0[2] +
    phi.phi_rv[1][0] * v0[0] + phi.phi_rv[1][1] * v0[1] + phi.phi_rv[1][2] * v0[2],

    phi.phi_rr[2][0] * r0[0] + phi.phi_rr[2][1] * r0[1] + phi.phi_rr[2][2] * r0[2] +
    phi.phi_rv[2][0] * v0[0] + phi.phi_rv[2][1] * v0[1] + phi.phi_rv[2][2] * v0[2],
  ];

  const vNext: [number, number, number] = [
    phi.phi_vr[0][0] * r0[0] + phi.phi_vr[0][1] * r0[1] + phi.phi_vr[0][2] * r0[2] +
    phi.phi_vv[0][0] * v0[0] + phi.phi_vv[0][1] * v0[1] + phi.phi_vv[0][2] * v0[2],

    phi.phi_vr[1][0] * r0[0] + phi.phi_vr[1][1] * r0[1] + phi.phi_vr[1][2] * r0[2] +
    phi.phi_vv[1][0] * v0[0] + phi.phi_vv[1][1] * v0[1] + phi.phi_vv[1][2] * v0[2],

    phi.phi_vr[2][0] * r0[0] + phi.phi_vr[2][1] * r0[1] + phi.phi_vr[2][2] * r0[2] +
    phi.phi_vv[2][0] * v0[0] + phi.phi_vv[2][1] * v0[1] + phi.phi_vv[2][2] * v0[2],
  ];

  return { r_ric: rNext, v_ric: vNext };
}

/**
 * Solves for the optimal impulsive Collision Avoidance Maneuver (CAM) Delta-V.
 * Maximizes miss distance along the B-plane encounter axis while bounding fuel expenditure.
 */
export function calculateOptimalAvoidanceDeltaV(
  semiMajorAxisKm: number,
  timeToTcaSeconds: number,
  targetMissDistanceMeters: number = 1000,
  currentMissDistanceRic: [number, number, number]
): {
  deltaVRicMps: [number, number, number];
  magnitudeMps: number;
  projectedNewMissDistanceMeters: number;
  burnDurationSeconds: number;
  propellantKg: number;
} {
  const mu = CONSTANTS.MU_EARTH;
  const n = Math.sqrt(mu / Math.pow(semiMajorAxisKm, 3));
  const t = Math.max(60, timeToTcaSeconds);

  // In Hill coordinates, an in-track burn (Delta V_y) creates a radial displacement that shears over time:
  // Delta y(t) = (4 sin(nt)/n - 3 t) * Delta V_y + 2(1 - cos(nt))/n * Delta V_x
  // In-track maneuvers are roughly 10x-50x more fuel-efficient than radial or out-of-plane for collision avoidance when applied > 0.5 orbit prior to TCA.
  
  const currentTotalMiss = Math.sqrt(
    currentMissDistanceRic[0] * currentMissDistanceRic[0] +
    currentMissDistanceRic[1] * currentMissDistanceRic[1] +
    currentMissDistanceRic[2] * currentMissDistanceRic[2]
  );

  const neededSeparation = Math.max(0, targetMissDistanceMeters - currentTotalMiss);

  // Sensitivity matrix coefficient for in-track burn: dy / dv_y
  const s = Math.sin(n * t);
  const c = Math.cos(n * t);
  const sens_y = Math.abs((4 * s - 3 * n * t) / n);
  const sens_x = Math.abs(s / n);
  const sens_z = Math.abs(s / n);

  let dv_y = 0;
  let dv_x = 0;
  let dv_z = 0;

  if (sens_y > 1e-4) {
    // Distribute 85% in-track, 10% radial, 5% cross-track to ensure safe 3D corridor clearance
    dv_y = (neededSeparation * 0.85) / sens_y;
    // Alternate direction away from secondary object's relative velocity
    if (currentMissDistanceRic[1] > 0) dv_y = -dv_y;
  }

  if (sens_x > 1e-4) {
    dv_x = (neededSeparation * 0.10) / sens_x;
    if (currentMissDistanceRic[0] > 0) dv_x = -dv_x;
  }

  if (sens_z > 1e-4) {
    dv_z = (neededSeparation * 0.05) / sens_z;
    if (currentMissDistanceRic[2] > 0) dv_z = -dv_z;
  }

  // Ensure minimum authoritative pulse if separation needed
  const mag = Math.sqrt(dv_x * dv_x + dv_y * dv_y + dv_z * dv_z);
  const finalMag = Math.max(0.05, Math.min(mag, 8.5)); // clamp between 5 cm/s and 8.5 m/s

  // Scale vectors
  const scale = mag > 1e-6 ? finalMag / mag : 1;
  const deltaVVector: [number, number, number] = [
    Math.round(dv_x * scale * 1000) / 1000,
    Math.round(dv_y * scale * 1000) / 1000,
    Math.round(dv_z * scale * 1000) / 1000
  ];

  // Tsiolkovsky propellant calculation for 260 kg dry mass with 1800s Hall thruster (g0 = 9.80665)
  const m0 = 260; // kg
  const isp = 1800; // s
  const g0 = 9.80665;
  const deltaMassKg = m0 * (1 - Math.exp(-finalMag / (isp * g0)));

  // Thrust = 65 mN (0.065 N)
  const thrustN = 0.065;
  const burnDurationSec = (m0 * finalMag) / thrustN;

  return {
    deltaVRicMps: deltaVVector,
    magnitudeMps: Math.round(finalMag * 1000) / 1000,
    projectedNewMissDistanceMeters: Math.round((currentTotalMiss + neededSeparation) * 10) / 10,
    burnDurationSeconds: Math.round(burnDurationSec),
    propellantKg: Math.round(deltaMassKg * 10000) / 10000
  };
}
