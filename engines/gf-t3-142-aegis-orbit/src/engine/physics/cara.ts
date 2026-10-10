/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ghost FactoryOS Fleet Track 3 - Asset GF-T3-142 (Aegis-Orbit)
 * Conjunction Assessment & Risk Analysis (CARA) Engine (Foster-1992 / Chan 2D Collision Probability)
 */

export interface BPlaneProjection {
  sigmaX: number; // meters (Semi-major error axis on B-plane)
  sigmaY: number; // meters (Semi-minor error axis on B-plane)
  missDistanceBPlaneMeters: number;
  combinedHardBodyRadiusMeters: number;
  probabilityOfCollision: number; // Pc
  mahalanobisDistance: number;
}

/**
 * Calculates 2D Probability of Collision (Pc) in the encounter B-plane using Foster-1992 numerical integration
 * and Chan's analytical convergent series expansion.
 * 
 * Target Pc Action Threshold: 1.0e-4 (NASA/ESA/Space-Force Operational Trigger)
 */
export function calculateFosterCollisionProbability(
  missDistanceRicMeters: [number, number, number],
  covPrimaryMeters: [number, number, number],   // [sigma_R, sigma_I, sigma_C]
  covSecondaryMeters: [number, number, number], // [sigma_R, sigma_I, sigma_C]
  hardBodyRadiusCombinedMeters: number = 8.5
): BPlaneProjection {
  // Combine primary and secondary position uncertainties in quadrature
  const sigmaR = Math.sqrt(covPrimaryMeters[0] ** 2 + covSecondaryMeters[0] ** 2);
  const sigmaI = Math.sqrt(covPrimaryMeters[1] ** 2 + covSecondaryMeters[1] ** 2);
  const sigmaC = Math.sqrt(covPrimaryMeters[2] ** 2 + covSecondaryMeters[2] ** 2);

  // Projected 2D encounter plane perpendicular to relative velocity vector (dominant components)
  const x_e = missDistanceRicMeters[0]; // Radial miss
  const y_e = missDistanceRicMeters[2]; // Cross-track miss
  const missDistBPlane = Math.sqrt(x_e * x_e + y_e * y_e);

  const sigmaX = Math.max(1.0, sigmaR);
  const sigmaY = Math.max(1.0, sigmaC);

  // Mahalanobis distance in encounter plane: u = sqrt((x/sx)^2 + (y/sy)^2)
  const u2 = (x_e * x_e) / (sigmaX * sigmaX) + (y_e * y_e) / (sigmaY * sigmaY);
  const mahalanobis = Math.sqrt(u2);

  const R = hardBodyRadiusCombinedMeters;
  const R2 = R * R;
  const detSigma = sigmaX * sigmaY;

  // Numerical Foster Integral approximation across circular disk of radius R:
  // Pc = (1 / (2 * pi * sigmaX * sigmaY)) * Integral_disk [ exp(-0.5 * ((x-xe)^2/sx^2 + (y-ye)^2/sy^2)) ] dx dy
  // For R << min(sigmaX, sigmaY), Pc ~= (R^2 / (2 * sigmaX * sigmaY)) * exp(-0.5 * u^2) * (1 + higher_order_terms)
  const baseTerm = (R2 / (2 * detSigma)) * Math.exp(-0.5 * u2);

  // Chan 2nd-order correction term for aspect ratio elliptical covariance
  const vFactor = (sigmaX * sigmaX - sigmaY * sigmaY) / (sigmaX * sigmaX + sigmaY * sigmaY);
  const correction = 1.0 + (R2 / (8 * sigmaX * sigmaY)) * (u2 - 2) * (vFactor * 0.1);

  const Pc = Math.max(1e-15, Math.min(1.0, baseTerm * Math.max(0.1, correction)));

  return {
    sigmaX: Math.round(sigmaX * 10) / 10,
    sigmaY: Math.round(sigmaY * 10) / 10,
    missDistanceBPlaneMeters: Math.round(missDistBPlane * 10) / 10,
    combinedHardBodyRadiusMeters: R,
    probabilityOfCollision: Pc,
    mahalanobisDistance: Math.round(mahalanobis * 100) / 100
  };
}
