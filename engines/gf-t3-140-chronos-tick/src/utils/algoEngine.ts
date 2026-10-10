import { ChildSlice, VolumeBucket, ExecutionMandate } from '../types/quant';

export const BASE_BTC_PRICE = 64250.0;
const VENUES: Array<'COINBASE_PRIME' | 'BINANCE_US' | 'KRAKEN_INST' | 'LMAX_DIGITAL'> = [
  'COINBASE_PRIME',
  'BINANCE_US',
  'KRAKEN_INST',
  'LMAX_DIGITAL',
];

/**
 * Generates an Intraday U-Shaped (bimodal) volume curve over 60 minutes
 * with heightened volume in early and late phases, dipping slightly in the middle.
 */
export function generateVolumeProfile(durationMinutes: number = 60, totalNotional: number = 10_000_000): VolumeBucket[] {
  const buckets: VolumeBucket[] = [];
  const basePrice = BASE_BTC_PRICE;

  let totalWeight = 0;
  const rawWeights: number[] = [];

  for (let m = 0; m <= durationMinutes; m++) {
    const norm = m / durationMinutes; // 0 to 1
    // U-shaped polynomial: 4 * (norm - 0.5)^2 + 0.35 + slight micro variation
    const weight = 3.5 * Math.pow(norm - 0.5, 2) + 0.38 + 0.05 * Math.sin(norm * Math.PI * 4);
    rawWeights.push(weight);
    totalWeight += weight;
  }

  const startHour = 9;
  const startMinute = 30;

  for (let m = 0; m <= durationMinutes; m++) {
    const normalizedWeight = rawWeights[m] / totalWeight;
    const bucketNotional = totalNotional * normalizedWeight;

    const curMin = (startMinute + m) % 60;
    const curHr = startHour + Math.floor((startMinute + m) / 60);
    const timeLabel = `${String(curHr).padStart(2, '0')}:${String(curMin).padStart(2, '0')} UTC`;

    // Price trajectory with slight random walk and volume impact
    const priceDrift = Math.sin((m / durationMinutes) * Math.PI * 2) * 18.5 + (m * 0.45);
    const scheduledPrice = basePrice + priceDrift;
    const realizedPrice = scheduledPrice + (Math.sin(m * 1.5) * 4.2);

    buckets.push({
      minute: m,
      timeLabel,
      historicalVolumeWeight: normalizedWeight * durationMinutes, // normalized relative weight
      expectedSliceNotional: bucketNotional,
      scheduledPrice: Number(scheduledPrice.toFixed(2)),
      realizedPrice: Number(realizedPrice.toFixed(2)),
    });
  }

  return buckets;
}

/**
 * Calculates Almgren-Chriss optimal trajectory weights
 * kappa = sqrt(lambda * sigma^2 / eta)
 */
export function calculateAlmgrenChrissTrajectory(
  totalSlices: number = 100,
  lambdaRiskAversion: number = 1e-6,
  volatilitySigma: number = 0.02,
  tempImpactEta: number = 2.5e-6
): number[] {
  const kappa = Math.sqrt((lambdaRiskAversion * Math.pow(volatilitySigma, 2)) / tempImpactEta) || 0.15;
  const T = 1.0; // Normalized time unit
  const weights: number[] = [];
  let sum = 0;

  for (let i = 0; i < totalSlices; i++) {
    const t = i / totalSlices;
    // Almgren-Chriss rate of trading: sinh(kappa * (T - t)) / sinh(kappa * T)
    const rate = Math.sinh(Math.max(0.001, kappa * (T - t))) / Math.sinh(Math.max(0.001, kappa * T));
    weights.push(rate);
    sum += rate;
  }

  return weights.map((w) => w / sum);
}

/**
 * Generates 100 realistic deterministic/stochastic child slices
 */
export function generateChildSlices(
  totalNotionalUsd: number = 10_000_000,
  durationMinutes: number = 60,
  totalSlices: number = 100,
  arrivalPrice: number = BASE_BTC_PRICE,
  lambda: number = 1e-6
): ChildSlice[] {
  const slices: ChildSlice[] = [];
  const acWeights = calculateAlmgrenChrissTrajectory(totalSlices, lambda);
  const totalBtc = totalNotionalUsd / arrivalPrice;

  const startMs = Date.parse('2026-10-05T14:30:00.000Z');
  const durationMs = durationMinutes * 60 * 1000;
  const avgSliceInterval = durationMs / totalSlices;

  let cumulativePriceXQty = 0;
  let cumulativeQty = 0;

  for (let i = 0; i < totalSlices; i++) {
    const sliceWeight = acWeights[i];
    const targetQty = Number((totalBtc * sliceWeight).toFixed(6));
    
    // Poisson arrival time jitter (+/- 800ms)
    const poissonJitterMs = (Math.sin(i * 3.7) * 0.4 + 0.5) * (avgSliceInterval * 0.15);
    const sliceTimestamp = startMs + Math.floor(i * avgSliceInterval + poissonJitterMs);
    const date = new Date(sliceTimestamp);
    const scheduledTime = date.toISOString().substring(11, 23); // HH:mm:ss.sss

    // Microscopic price movement simulation
    // Low impact: 0.2 bps to 1.4 bps range with mean ~ 0.8 bps
    const marketImpactBps = 0.45 + (sliceWeight * 100 * 0.35) + (Math.sin(i * 0.8) * 0.25);
    const priceDrift = (Math.sin(i / 15) * 12.0) + (i * 0.18);
    const filledPrice = Number((arrivalPrice + priceDrift + (arrivalPrice * (marketImpactBps / 10000))).toFixed(2));
    
    cumulativeQty += targetQty;
    cumulativePriceXQty += filledPrice * targetQty;
    const currentVwap = cumulativePriceXQty / cumulativeQty;
    
    const vwapDelta = Number((filledPrice - currentVwap).toFixed(2));
    const realizedSlippageBps = Number((((filledPrice - arrivalPrice) / arrivalPrice) * 10000).toFixed(2));
    const venue = VENUES[i % VENUES.length];
    const impactCostUsd = Number(((filledPrice - arrivalPrice) * targetQty).toFixed(2));

    slices.push({
      sliceIndex: i + 1,
      scheduledTime,
      executionTimestamp: sliceTimestamp,
      targetQty,
      filledQty: targetQty,
      arrivalPrice,
      filledPrice,
      marketVwap: Number(currentVwap.toFixed(2)),
      vwapDelta,
      realizedSlippageBps,
      venue,
      status: 'FILLED',
      impactCostUsd,
      poissonIntervalMs: Math.round(avgSliceInterval + poissonJitterMs),
    });
  }

  return slices;
}

export const INITIAL_MANDATE: ExecutionMandate = {
  mandateId: 'MAN-2026-BTC-8921-ALPHA',
  symbol: 'BTC-USD',
  side: 'BUY',
  totalNotionalUsd: 10_000_000,
  totalQuantity: Number((10_000_000 / BASE_BTC_PRICE).toFixed(4)),
  durationMinutes: 60,
  strategy: 'ALMGREN_CHRISS',
  riskAversionLambda: 1.0e-6,
  targetSlippageBpsCap: 3.0,
  arrivalPrice: BASE_BTC_PRICE,
  currentVwap: BASE_BTC_PRICE + 5.14,
  realizedSlippageBps: 0.80,
  filledNotionalUsd: 10_000_000,
  filledQuantity: Number((10_000_000 / BASE_BTC_PRICE).toFixed(4)),
  progressPercent: 100,
  status: 'COMPLETED',
  slicesCount: 100,
  filledSlicesCount: 100,
  startTime: '14:30:00.000 UTC',
  endTime: '15:30:00.000 UTC',
};
