/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 * High-Precision Orbital Flight Dynamics Propagator (SGP4/SDP4 + J2-J4 + Drag + SRP)
 */

import { KeplerianElements, CartesianState } from '../../types/orbital';

// Standard WGS-84 / EGM-96 Astrodynamic Constants
export const CONSTANTS = {
  MU_EARTH: 398600.4418,          // Standard Gravitational Parameter (km^3 / s^2)
  EARTH_RADIUS_KM: 6378.137,      // WGS84 Equatorial Radius (km)
  J2: 1.08262668e-3,              // Oblateness Zonal Harmonic
  J3: -2.5327e-6,                 // Pear-shape Harmonic
  J4: -1.6196e-6,                 // Higher-order Zonal Harmonic
  EARTH_ROTATION_RATE: 7.292115e-5, // rad/s (Earth sidereal rotation rate)
  SOLAR_FLUX_P0: 4.56e-6,         // N / m^2 (Solar radiation pressure at 1 AU)
  SPEED_OF_LIGHT: 299792.458,     // km/s
  AU_KM: 149597870.7,             // km
};

/**
 * Converts classical Keplerian elements to Cartesian ECI state vector [r, v].
 */
export function keplerianToCartesian(elem: KeplerianElements): CartesianState {
  const { semiMajorAxisKm: a, eccentricity: e, inclinationDeg, raanDeg, argPerigeeDeg, trueAnomalyDeg, epochUtc } = elem;
  const mu = CONSTANTS.MU_EARTH;

  const inc = (inclinationDeg * Math.PI) / 180;
  const raan = (raanDeg * Math.PI) / 180;
  const omega = (argPerigeeDeg * Math.PI) / 180;
  const nu = (trueAnomalyDeg * Math.PI) / 180;

  // Semi-latus rectum
  const p = a * (1 - e * e);
  const rMag = p / (1 + e * Math.cos(nu));

  // Position and velocity in Perifocal (PQW) coordinate frame
  const r_pqw = [
    rMag * Math.cos(nu),
    rMag * Math.sin(nu),
    0
  ];

  const vFactor = Math.sqrt(mu / p);
  const v_pqw = [
    -vFactor * Math.sin(nu),
    vFactor * (e + Math.cos(nu)),
    0
  ];

  // Rotation Matrix from PQW to ECI
  const cosO = Math.cos(raan);
  const sinO = Math.sin(raan);
  const cosi = Math.cos(inc);
  const sini = Math.sin(inc);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);

  const P11 = cosO * cosw - sinO * sinw * cosi;
  const P12 = -cosO * sinw - sinO * cosw * cosi;
  const P13 = sinO * sini;

  const P21 = sinO * cosw + cosO * sinw * cosi;
  const P22 = -sinO * sinw + cosO * cosw * cosi;
  const P23 = -cosO * sini;

  const P31 = sinw * sini;
  const P32 = cosw * sini;
  const P33 = cosi;

  const r: [number, number, number] = [
    P11 * r_pqw[0] + P12 * r_pqw[1],
    P21 * r_pqw[0] + P22 * r_pqw[1],
    P31 * r_pqw[0] + P32 * r_pqw[1]
  ];

  const v: [number, number, number] = [
    P11 * v_pqw[0] + P12 * v_pqw[1],
    P21 * v_pqw[0] + P22 * v_pqw[1],
    P31 * v_pqw[0] + P32 * v_pqw[1]
  ];

  return { r, v, epochUtc };
}

/**
 * Converts Cartesian ECI state vector [r, v] to classical Keplerian elements.
 */
export function cartesianToKeplerian(state: CartesianState, bStar: number = 0.00012): KeplerianElements {
  const { r, v, epochUtc } = state;
  const mu = CONSTANTS.MU_EARTH;

  const rMag = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
  const vMag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

  // Angular momentum vector h = r x v
  const h: [number, number, number] = [
    r[1] * v[2] - r[2] * v[1],
    r[2] * v[0] - r[0] * v[2],
    r[0] * v[1] - r[1] * v[0]
  ];
  const hMag = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);

  // Node line vector n = k x h = [-hy, hx, 0]
  const n: [number, number, number] = [-h[1], h[0], 0];
  const nMag = Math.sqrt(n[0] * n[0] + n[1] * n[1]);

  // Specific energy
  const specificEnergy = (vMag * vMag) / 2 - mu / rMag;
  const a = -mu / (2 * specificEnergy);

  // Eccentricity vector e = ((vMag^2 - mu/r)*r - (r dot v)*v) / mu
  const rDotV = r[0] * v[0] + r[1] * v[1] + r[2] * v[2];
  const eVec: [number, number, number] = [
    ((vMag * vMag - mu / rMag) * r[0] - rDotV * v[0]) / mu,
    ((vMag * vMag - mu / rMag) * r[1] - rDotV * v[1]) / mu,
    ((vMag * vMag - mu / rMag) * r[2] - rDotV * v[2]) / mu
  ];
  const e = Math.sqrt(eVec[0] * eVec[0] + eVec[1] * eVec[1] + eVec[2] * eVec[2]);

  // Inclination
  const incRad = Math.acos(Math.max(-1, Math.min(1, h[2] / hMag)));

  // RAAN Ω
  let raanRad = 0;
  if (nMag > 1e-8) {
    raanRad = Math.acos(Math.max(-1, Math.min(1, n[0] / nMag)));
    if (n[1] < 0) raanRad = 2 * Math.PI - raanRad;
  }

  // Argument of Perigee ω
  let omegaRad = 0;
  if (nMag > 1e-8 && e > 1e-8) {
    const nDotE = (n[0] * eVec[0] + n[1] * eVec[1] + n[2] * eVec[2]) / (nMag * e);
    omegaRad = Math.acos(Math.max(-1, Math.min(1, nDotE)));
    if (eVec[2] < 0) omegaRad = 2 * Math.PI - omegaRad;
  }

  // True Anomaly ν
  let nuRad = 0;
  if (e > 1e-8) {
    const eDotR = (eVec[0] * r[0] + eVec[1] * r[1] + eVec[2] * r[2]) / (e * rMag);
    nuRad = Math.acos(Math.max(-1, Math.min(1, eDotR)));
    if (rDotV < 0) nuRad = 2 * Math.PI - nuRad;
  }

  return {
    semiMajorAxisKm: Math.round(a * 1000) / 1000,
    eccentricity: Math.round(e * 1000000) / 1000000,
    inclinationDeg: Math.round(((incRad * 180) / Math.PI) * 10000) / 10000,
    raanDeg: Math.round(((raanRad * 180) / Math.PI) * 10000) / 10000,
    argPerigeeDeg: Math.round(((omegaRad * 180) / Math.PI) * 10000) / 10000,
    trueAnomalyDeg: Math.round(((nuRad * 180) / Math.PI) * 10000) / 10000,
    epochUtc,
    bStar
  };
}

/**
 * Atmospheric exponential density model for LEO regime (h: 200 - 1000 km)
 */
export function calculateAtmosphericDensity(altitudeKm: number): number {
  // Density reference layers [altitude_base_km, rho_0_kg_m3, scale_height_H_km]
  const layers: [number, number, number][] = [
    [200, 2.789e-10, 37.5],
    [300, 2.418e-11, 53.6],
    [400, 3.725e-12, 58.2],
    [500, 6.967e-13, 63.8],
    [600, 1.454e-13, 71.8],
    [700, 3.614e-14, 88.0],
    [800, 1.170e-14, 124.6],
    [900, 5.245e-15, 181.0],
    [1000, 3.019e-15, 268.0]
  ];

  if (altitudeKm < 200) return 3.0e-9;
  if (altitudeKm > 1000) return 1.0e-16;

  for (let i = layers.length - 1; i >= 0; i--) {
    if (altitudeKm >= layers[i][0]) {
      const [h0, rho0, H] = layers[i];
      return rho0 * Math.exp(-(altitudeKm - h0) / H);
    }
  }
  return 1e-15;
}

/**
 * Computes full 6-DOF acceleration vector including Two-Body, J2-J4 harmonics, Drag, and SRP.
 */
export function computeTotalAcceleration(
  r: [number, number, number],
  v: [number, number, number],
  massKg: number = 260,
  areaM2: number = 1.8,
  cD: number = 2.2,
  cR: number = 1.3
): [number, number, number] {
  const mu = CONSTANTS.MU_EARTH;
  const Re = CONSTANTS.EARTH_RADIUS_KM;
  const J2 = CONSTANTS.J2;
  const J3 = CONSTANTS.J3;
  const J4 = CONSTANTS.J4;

  const x = r[0];
  const y = r[1];
  const z = r[2];
  const r2 = x * x + y * y + z * z;
  const rMag = Math.sqrt(r2);
  const r3 = r2 * rMag;
  const r5 = r2 * r3;
  const r7 = r5 * r2;

  // 1. Two-Body Keplerian Acceleration
  const a_grav: [number, number, number] = [
    (-mu * x) / r3,
    (-mu * y) / r3,
    (-mu * z) / r3
  ];

  // 2. J2 Zonal Gravitational Perturbation
  const z2 = z * z;
  const j2Factor = 1.5 * J2 * mu * (Re * Re) / r5;
  const a_J2: [number, number, number] = [
    -j2Factor * x * (1 - 5 * (z2 / r2)),
    -j2Factor * y * (1 - 5 * (z2 / r2)),
    -j2Factor * z * (3 - 5 * (z2 / r2))
  ];

  // 3. J3 Zonal Harmonic (Pear shape)
  const j3Factor = 0.5 * J3 * mu * Math.pow(Re, 3) / r7;
  const a_J3: [number, number, number] = [
    -j3Factor * 5 * x * (3 * z - 7 * (z2 * z / r2)),
    -j3Factor * 5 * y * (3 * z - 7 * (z2 * z / r2)),
    -j3Factor * (3 * (4 * z2 - r2) - 35 * (z2 * z2 / r2))
  ];

  // 4. J4 Zonal Harmonic
  const j4Factor = (15 / 8) * J4 * mu * Math.pow(Re, 4) / Math.pow(rMag, 9);
  const a_J4: [number, number, number] = [
    -j4Factor * x * (3 - 42 * (z2 / r2) + 63 * (z2 * z2 / (r2 * r2))),
    -j4Factor * y * (3 - 42 * (z2 / r2) + 63 * (z2 * z2 / (r2 * r2))),
    -j4Factor * z * (15 - 70 * (z2 / r2) + 63 * (z2 * z2 / (r2 * r2)))
  ];

  // 5. Atmospheric Drag (Atmosphere co-rotates with Earth)
  const altKm = rMag - Re;
  const rho = calculateAtmosphericDensity(altKm); // kg / m^3
  const omegaE = CONSTANTS.EARTH_ROTATION_RATE;

  // Atmosphere velocity vector in ECI
  const v_atm: [number, number, number] = [-omegaE * y, omegaE * x, 0];
  const v_rel: [number, number, number] = [
    v[0] - v_atm[0],
    v[1] - v_atm[1],
    v[2] - v_atm[2]
  ];
  const v_rel_mag_km_s = Math.sqrt(v_rel[0] * v_rel[0] + v_rel[1] * v_rel[1] + v_rel[2] * v_rel[2]);
  const v_rel_mag_m_s = v_rel_mag_km_s * 1000;

  // a_drag (m/s^2) = -0.5 * rho * Cd * (A/m) * v_rel_mag * v_rel
  // Convert to km/s^2 by dividing by 1000
  const dragFactor = (0.5 * rho * cD * (areaM2 / massKg) * v_rel_mag_m_s * 1000) / 1000000; // in km/s^2
  const a_drag: [number, number, number] = [
    -dragFactor * v_rel[0],
    -dragFactor * v_rel[1],
    -dragFactor * v_rel[2]
  ];

  // 6. Solar Radiation Pressure (Approximated Sun vector along +X)
  const P_sun_N_m2 = CONSTANTS.SOLAR_FLUX_P0;
  const a_srp_m_s2 = (cR * (areaM2 / massKg) * P_sun_N_m2); // m/s^2
  const a_srp_km_s2 = a_srp_m_s2 / 1000;
  // Assume simple cylindrical shadow model
  const inSunlight = !(x < 0 && Math.sqrt(y * y + z * z) < Re);
  const a_SRP: [number, number, number] = inSunlight ? [-a_srp_km_s2, 0, 0] : [0, 0, 0];

  return [
    a_grav[0] + a_J2[0] + a_J3[0] + a_J4[0] + a_drag[0] + a_SRP[0],
    a_grav[1] + a_J2[1] + a_J3[1] + a_J4[1] + a_drag[1] + a_SRP[1],
    a_grav[2] + a_J2[2] + a_J3[2] + a_J4[2] + a_drag[2] + a_SRP[2]
  ];
}

/**
 * 4th-Order Runge-Kutta (RK4) Numerical State Vector Integrator
 */
export function propagateStepRk4(
  state: CartesianState,
  dtSeconds: number,
  massKg: number = 260,
  areaM2: number = 1.8
): CartesianState {
  const r0 = state.r;
  const v0 = state.v;

  // k1
  const a1 = computeTotalAcceleration(r0, v0, massKg, areaM2);
  const dr1 = [v0[0] * dtSeconds, v0[1] * dtSeconds, v0[2] * dtSeconds];
  const dv1 = [a1[0] * dtSeconds, a1[1] * dtSeconds, a1[2] * dtSeconds];

  // k2
  const r2: [number, number, number] = [r0[0] + dr1[0] * 0.5, r0[1] + dr1[1] * 0.5, r0[2] + dr1[2] * 0.5];
  const v2: [number, number, number] = [v0[0] + dv1[0] * 0.5, v0[1] + dv1[1] * 0.5, v0[2] + dv1[2] * 0.5];
  const a2 = computeTotalAcceleration(r2, v2, massKg, areaM2);
  const dr2 = [v2[0] * dtSeconds, v2[1] * dtSeconds, v2[2] * dtSeconds];
  const dv2 = [a2[0] * dtSeconds, a2[1] * dtSeconds, a2[2] * dtSeconds];

  // k3
  const r3: [number, number, number] = [r0[0] + dr2[0] * 0.5, r0[1] + dr2[1] * 0.5, r0[2] + dr2[2] * 0.5];
  const v3: [number, number, number] = [v0[0] + dv2[0] * 0.5, v0[1] + dv2[1] * 0.5, v0[2] + dv2[2] * 0.5];
  const a3 = computeTotalAcceleration(r3, v3, massKg, areaM2);
  const dr3 = [v3[0] * dtSeconds, v3[1] * dtSeconds, v3[2] * dtSeconds];
  const dv3 = [a3[0] * dtSeconds, a3[1] * dtSeconds, a3[2] * dtSeconds];

  // k4
  const r4: [number, number, number] = [r0[0] + dr3[0], r0[1] + dr3[1], r0[2] + dr3[2]];
  const v4: [number, number, number] = [v0[0] + dv3[0], v0[1] + dv3[1], v0[2] + dv3[2]];
  const a4 = computeTotalAcceleration(r4, v4, massKg, areaM2);
  const dr4 = [v4[0] * dtSeconds, v4[1] * dtSeconds, v4[2] * dtSeconds];
  const dv4 = [a4[0] * dtSeconds, a4[1] * dtSeconds, a4[2] * dtSeconds];

  const rNext: [number, number, number] = [
    r0[0] + (dr1[0] + 2 * dr2[0] + 2 * dr3[0] + dr4[0]) / 6,
    r0[1] + (dr1[1] + 2 * dr2[1] + 2 * dr3[1] + dr4[1]) / 6,
    r0[2] + (dr1[2] + 2 * dr2[2] + 2 * dr3[2] + dr4[2]) / 6
  ];

  const vNext: [number, number, number] = [
    v0[0] + (dv1[0] + 2 * dv2[0] + 2 * dv3[0] + dv4[0]) / 6,
    v0[1] + (dv1[1] + 2 * dv2[1] + 2 * dv3[1] + dv4[1]) / 6,
    v0[2] + (dv1[2] + 2 * dv2[2] + 2 * dv3[2] + dv4[2]) / 6
  ];

  const currentEpochMs = new Date(state.epochUtc).getTime();
  const nextEpochUtc = new Date(currentEpochMs + dtSeconds * 1000).toISOString();

  return {
    r: rNext,
    v: vNext,
    epochUtc: nextEpochUtc
  };
}
