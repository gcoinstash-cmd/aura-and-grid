/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Mathematical Flow Toxicity Engine: Real-Time VPIN & 2-Variate Hawkes Process
 * 
 * Equations:
 * 1. VPIN = (sum_{tau=1}^{N} |V_tau^B - V_tau^S|) / (N * V)
 * 2. Hawkes Intensity:
 *    lambda_1(t) = mu_1 + sum_{t_i < t} alpha_11 * e^{-beta * (t - t_i)} + sum_{s_j < t} alpha_12 * e^{-beta * (t - s_j)}
 *    lambda_2(t) = mu_2 + sum_{t_i < t} alpha_21 * e^{-beta * (t - t_i)} + sum_{s_j < t} alpha_22 * e^{-beta * (t - s_j)}
 */

import { HawkesMetrics, TradeExecution, VpinBucket, VpinMetrics } from '../types/trading';

export class VpinHawkesEngine {
  // VPIN Parameters
  private bucketSize: number = 500; // Fixed volume per bucket (V)
  private numBucketsN: number = 30; // Rolling window of buckets (N)
  private currentBucketVol: number = 0;
  private currentBucketBuyVol: number = 0;
  private currentBucketSellVol: number = 0;
  private bucketIndexCounter: number = 1;
  private completedBuckets: VpinBucket[] = [];
  private historicalVpin: Array<{ timestamp: number; vpin: number }> = [];
  private lastTradePrice: number = 100.00;

  // Hawkes Process Parameters
  private mu1: number = 1.2; // Baseline trade arrival intensity
  private mu2: number = 2.5; // Baseline cancel arrival intensity
  private alpha11: number = 0.45; // Trade self-excitation
  private alpha12: number = 0.20; // Cancel -> Trade excitation
  private alpha21: number = 0.85; // Trade -> Cancel predatory excitation
  private alpha22: number = 0.60; // Cancel self-excitation (quote stuffing)
  private beta: number = 1.8;     // Exponential decay speed

  private tradeTimestamps: number[] = [];  // Event 1 (t_i)
  private cancelTimestamps: number[] = []; // Event 2 (s_j)
  private hawkesHistory: Array<{ timestamp: number; lambda1: number; lambda2: number; predatoryScore: number }> = [];

  constructor() {
    this.seedInitialBuckets();
  }

  private seedInitialBuckets(): void {
    const now = Date.now();
    for (let i = 0; i < 25; i++) {
      const buyFraction = 0.42 + Math.random() * 0.16;
      const buyVol = Math.round(this.bucketSize * buyFraction);
      const sellVol = this.bucketSize - buyVol;
      const imb = buyVol - sellVol;
      const absImb = Math.abs(imb);

      this.completedBuckets.push({
        bucketIndex: this.bucketIndexCounter++,
        buyVolume: buyVol,
        sellVolume: sellVol,
        orderImbalance: imb,
        absImbalance: absImb,
        timestamp: now - (25 - i) * 2000
      });
    }
    this.updateVpinHistory(now);
  }

  /**
   * Process a new trade execution for VPIN classification (Lee-Ready algorithm)
   */
  public ingestTrade(trade: TradeExecution, nbboMidpoint: number): void {
    const now = Date.now();
    this.tradeTimestamps.push(now);
    this.pruneOldEvents(now);

    // Lee-Ready classification: price > midpoint => BUY, price < midpoint => SELL, else tick direction
    let isBuy = false;
    if (trade.price > nbboMidpoint) {
      isBuy = true;
    } else if (trade.price < nbboMidpoint) {
      isBuy = false;
    } else {
      isBuy = trade.price >= this.lastTradePrice;
    }
    this.lastTradePrice = trade.price;

    let remainingTradeQty = trade.quantity;

    while (remainingTradeQty > 0) {
      const spaceInBucket = this.bucketSize - this.currentBucketVol;
      const allocQty = Math.min(remainingTradeQty, spaceInBucket);

      if (isBuy) {
        this.currentBucketBuyVol += allocQty;
      } else {
        this.currentBucketSellVol += allocQty;
      }
      this.currentBucketVol += allocQty;
      remainingTradeQty -= allocQty;

      // When volume bucket reaches capacity V, finalize bucket and roll window
      if (this.currentBucketVol >= this.bucketSize) {
        const imb = this.currentBucketBuyVol - this.currentBucketSellVol;
        this.completedBuckets.push({
          bucketIndex: this.bucketIndexCounter++,
          buyVolume: this.currentBucketBuyVol,
          sellVolume: this.currentBucketSellVol,
          orderImbalance: imb,
          absImbalance: Math.abs(imb),
          timestamp: now
        });

        if (this.completedBuckets.length > this.numBucketsN * 2) {
          this.completedBuckets.shift();
        }

        this.currentBucketVol = 0;
        this.currentBucketBuyVol = 0;
        this.currentBucketSellVol = 0;
      }
    }

    this.updateVpinHistory(now);
    this.recordHawkesSample(now);
  }

  /**
   * Process an order cancellation event for Hawkes process quote-stuffing & predatory cancel detection
   */
  public ingestCancellation(): void {
    const now = Date.now();
    this.cancelTimestamps.push(now);
    this.pruneOldEvents(now);
    this.recordHawkesSample(now);
  }

  private pruneOldEvents(now: number): void {
    const cutoff = now - 15000; // Keep 15 seconds event history for kernel decay
    while (this.tradeTimestamps.length > 0 && this.tradeTimestamps[0] < cutoff) {
      this.tradeTimestamps.shift();
    }
    while (this.cancelTimestamps.length > 0 && this.cancelTimestamps[0] < cutoff) {
      this.cancelTimestamps.shift();
    }
  }

  private updateVpinHistory(timestamp: number): void {
    const currentVpin = this.calculateCurrentVpin();
    this.historicalVpin.push({ timestamp, vpin: currentVpin });
    if (this.historicalVpin.length > 60) {
      this.historicalVpin.shift();
    }
  }

  public calculateCurrentVpin(): number {
    if (this.completedBuckets.length === 0) return 0.18;
    const windowBuckets = this.completedBuckets.slice(-this.numBucketsN);
    const sumAbsImbalance = windowBuckets.reduce((acc, b) => acc + b.absImbalance, 0);
    const totalVolumeSampled = windowBuckets.length * this.bucketSize;
    if (totalVolumeSampled === 0) return 0.18;
    return Number((sumAbsImbalance / totalVolumeSampled).toFixed(4));
  }

  public computeHawkesIntensities(now: number = Date.now()): { lambda1: number; lambda2: number; predatoryScore: number } {
    let decaySum11 = 0;
    let decaySum12 = 0;
    let decaySum21 = 0;
    let decaySum22 = 0;

    for (const t_i of this.tradeTimestamps) {
      const dtSeconds = Math.max(0, (now - t_i) / 1000);
      const decay = Math.exp(-this.beta * dtSeconds);
      decaySum11 += decay;
      decaySum21 += decay;
    }

    for (const s_j of this.cancelTimestamps) {
      const dtSeconds = Math.max(0, (now - s_j) / 1000);
      const decay = Math.exp(-this.beta * dtSeconds);
      decaySum12 += decay;
      decaySum22 += decay;
    }

    const lambda1 = this.mu1 + this.alpha11 * decaySum11 + this.alpha12 * decaySum12;
    const lambda2 = this.mu2 + this.alpha21 * decaySum21 + this.alpha22 * decaySum22;

    // Predatory cancellation score
    const cancelRatio = lambda2 / (lambda1 + lambda2 + 0.001);
    const predatoryScore = Number((cancelRatio * (this.alpha21 / 0.85) * (lambda2 / 10)).toFixed(3));

    return {
      lambda1: Number(lambda1.toFixed(2)),
      lambda2: Number(lambda2.toFixed(2)),
      predatoryScore: Math.min(1.0, predatoryScore)
    };
  }

  private recordHawkesSample(now: number): void {
    const { lambda1, lambda2, predatoryScore } = this.computeHawkesIntensities(now);
    this.hawkesHistory.push({ timestamp: now, lambda1, lambda2, predatoryScore });
    if (this.hawkesHistory.length > 50) {
      this.hawkesHistory.shift();
    }
  }

  public getVpinMetrics(): VpinMetrics {
    const currentVpin = this.calculateCurrentVpin();
    return {
      currentVpin,
      vpinThreshold: 0.42,
      isToxic: currentVpin > 0.42,
      bucketSize: this.bucketSize,
      currentBucketVolume: this.currentBucketVol,
      currentBucketBuyVol: this.currentBucketBuyVol,
      currentBucketSellVol: this.currentBucketSellVol,
      completedBuckets: [...this.completedBuckets],
      historicalVpin: [...this.historicalVpin]
    };
  }

  public getHawkesMetrics(): HawkesMetrics {
    const now = Date.now();
    const { lambda1, lambda2, predatoryScore } = this.computeHawkesIntensities(now);
    return {
      lambda1,
      lambda2,
      mu1: this.mu1,
      mu2: this.mu2,
      alpha11: this.alpha11,
      alpha12: this.alpha12,
      alpha21: this.alpha21,
      alpha22: this.alpha22,
      beta: this.beta,
      predatoryCancelRatio: Number((lambda2 / (lambda1 + lambda2 + 0.001)).toFixed(3)),
      spoofingAlert: predatoryScore > 0.70 || lambda2 > 18.0,
      history: [...this.hawkesHistory]
    };
  }
}
