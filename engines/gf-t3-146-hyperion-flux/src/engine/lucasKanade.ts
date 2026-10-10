import { DvsEvent, OpticalFlowVector } from '../types/neuromorphic';

/**
 * Surface of Active Events (SAE) and Asynchronous Lucas-Kanade Optical Flow Solver
 * 
 * Mathematical Formulation:
 * 1. Let Sigma_e(x, y) be the timestamp t of the most recent event at pixel (x, y).
 * 2. Along motion trajectories of contrast edges, the event manifold obeys:
 *      nabla Sigma_e(x, y) . v + 1 = 0
 *    where v = (v_x, v_y)^T is the true 2D velocity in pixels / microsecond.
 * 3. Over a local spatial window Omega around (x_0, y_0) of radius R (e.g. 5x5 or 9x9):
 *      A = [ dSigma/dx, dSigma/dy ] for all active pixels in Omega
 *      b = [ -1, -1, ..., -1 ]^T
 * 4. Weighted Normal Equation:
 *      (A^T W A) v = A^T W b = - A^T W 1
 *      v = - (A^T W A)^(-1) A^T W 1
 * 5. Aperture Problem & Matrix Conditioning:
 *      Let M = A^T W A = [ [m11, m12], [m21, m22] ]
 *      Trace: Tr(M) = m11 + m22
 *      Determinant: Det(M) = m11*m22 - m12*m21
 *      Eigenvalues: lambda_{1,2} = (Tr +- sqrt(Tr^2 - 4*Det)) / 2
 *      Condition number kappa = lambda_max / lambda_min
 *      If Det < 1e-9 or kappa > 12.5, the local patch suffers from the aperture problem
 *      (e.g., 1D straight edge without corners) and the vector is rejected or flagged.
 */
export class AsynchronousLucasKanadeEngine {
  private readonly width: number;
  private readonly height: number;
  private readonly saeOn: Float64Array;
  private readonly saeOff: Float64Array;
  private readonly radius: number;
  private readonly temporalTauUs: number;

  constructor(width: number = 256, height: number = 256, radius: number = 3, temporalTauUs: number = 60000) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.temporalTauUs = temporalTauUs;
    this.saeOn = new Float64Array(width * height);
    this.saeOff = new Float64Array(width * height);
  }

  /**
   * Update the Surface of Active Events with an incoming event and compute its microsecond optical flow.
   */
  public processEvent(event: DvsEvent): OpticalFlowVector | null {
    const { x, y, timestampUs, polarity } = event;
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;

    const idx = y * this.width + x;
    const targetSae = polarity === 1 ? this.saeOn : this.saeOff;
    targetSae[idx] = timestampUs;

    // Check boundary margin for spatial patch computation
    const r = this.radius;
    if (x < r + 1 || x >= this.width - r - 1 || y < r + 1 || y >= this.height - r - 1) {
      return null;
    }

    // Accumulate weighted normal equations: M = A^T W A, b_vec = - A^T W 1
    let m11 = 0;
    let m12 = 0;
    let m22 = 0;
    let b1 = 0;
    let b2 = 0;
    let validSampleCount = 0;

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const px = x + dx;
        const py = y + dy;
        const pIdx = py * this.width + px;
        const pTimestamp = targetSae[pIdx];

        // Only consider events within recent temporal window
        const dt = timestampUs - pTimestamp;
        if (pTimestamp > 0 && dt <= this.temporalTauUs && dt >= 0) {
          // Compute central spatial gradients of the SAE at (px, py)
          // nabla Sigma_x = (Sigma(px+1, py) - Sigma(px-1, py)) / 2.0
          // nabla Sigma_y = (Sigma(px, py+1) - Sigma(px, py-1)) / 2.0
          const right = targetSae[py * this.width + (px + 1)];
          const left = targetSae[py * this.width + (px - 1)];
          const down = targetSae[(py + 1) * this.width + px];
          const up = targetSae[(py - 1) * this.width + px];

          if (right > 0 && left > 0 && down > 0 && up > 0) {
            // Gradient in microsecond / pixel
            const gradX = (right - left) / 2.0;
            const gradY = (down - up) / 2.0;

            // Gaussian spatial-temporal weight: W_k = exp(-(dx^2 + dy^2)/(2*sigma^2)) * exp(-dt / tau)
            const spatialDistSq = dx * dx + dy * dy;
            const weight = Math.exp(-spatialDistSq / (2 * (r * 0.75) ** 2)) * Math.exp(-dt / this.temporalTauUs);

            m11 += weight * gradX * gradX;
            m12 += weight * gradX * gradY;
            m22 += weight * gradY * gradY;

            // b_k = -1, so A^T W b = sum( - weight * grad )
            b1 += -weight * gradX;
            b2 += -weight * gradY;

            validSampleCount++;
          }
        }
      }
    }

    if (validSampleCount < 4) {
      return null;
    }

    // Matrix conditioning & eigenvalue analysis
    const det = m11 * m22 - m12 * m12;
    const tr = m11 + m22;
    const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
    const lambda1 = (tr + disc) / 2;
    const lambda2 = (tr - disc) / 2;
    const lambdaMin = Math.min(lambda1, lambda2);
    const lambdaMax = Math.max(lambda1, lambda2);

    const conditionNumber = lambdaMin > 1e-9 ? lambdaMax / lambdaMin : Infinity;

    // Strict aperture problem rejection criterion: kappa <= 12.5 and det > 1e-7
    if (det < 1e-7 || lambdaMin < 1e-6 || conditionNumber > 12.5) {
      return null;
    }

    // Solve 2x2 linear system M * v = b_vec using Cramer's Rule / Inverse
    // v = M^(-1) * b_vec
    const vx = (m22 * b1 - m12 * b2) / det;
    const vy = (-m12 * b1 + m11 * b2) / det;

    const magnitude = Math.sqrt(vx * vx + vy * vy);
    const angleRad = Math.atan2(vy, vx);

    // Compute confidence score in range [0, 1]
    const confidence = Math.min(1.0, Math.max(0.0, 1.0 - (conditionNumber / 12.5)) * Math.min(1.0, validSampleCount / 12));

    return {
      x,
      y,
      vx,
      vy,
      magnitude,
      angleRad,
      confidence,
      conditionNumber,
      timestampUs,
    };
  }

  /**
   * Extract downsampled SAE surface for canvas visualizer
   */
  public getSaeSnapshot(targetWidth: number, targetHeight: number, currentTimestampUs: number): { on: Float32Array; off: Float32Array } {
    const onNorm = new Float32Array(targetWidth * targetHeight);
    const offNorm = new Float32Array(targetWidth * targetHeight);
    const scaleX = this.width / targetWidth;
    const scaleY = this.height / targetHeight;

    for (let ty = 0; ty < targetHeight; ty++) {
      for (let tx = 0; tx < targetWidth; tx++) {
        const sx = Math.floor(tx * scaleX);
        const sy = Math.floor(ty * scaleY);
        const srcIdx = sy * this.width + sx;
        const dstIdx = ty * targetWidth + tx;

        const onT = this.saeOn[srcIdx];
        if (onT > 0 && currentTimestampUs - onT <= this.temporalTauUs) {
          onNorm[dstIdx] = Math.max(0, 1.0 - (currentTimestampUs - onT) / this.temporalTauUs);
        }

        const offT = this.saeOff[srcIdx];
        if (offT > 0 && currentTimestampUs - offT <= this.temporalTauUs) {
          offNorm[dstIdx] = Math.max(0, 1.0 - (currentTimestampUs - offT) / this.temporalTauUs);
        }
      }
    }

    return { on: onNorm, off: offNorm };
  }

  public reset(): void {
    this.saeOn.fill(0);
    this.saeOff.fill(0);
  }
}
