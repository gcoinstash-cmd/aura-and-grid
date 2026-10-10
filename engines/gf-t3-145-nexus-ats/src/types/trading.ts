/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * High-Precision Trading Engine Type System
 */

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'MIDPOINT_PEG' | 'IOC' | 'FOK';
export type ExecutionVenue = 'LIT' | 'DARK' | 'HYBRID_SWEEP';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'RESTING_DARK';

export interface Order {
  id: string;
  clientOrderId: string;
  instrumentId: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  venue: ExecutionVenue;
  minQuantity: number;
  participantMpid: string;
  antiInternalization: boolean;
  entryEpochNs: number;
  status: OrderStatus;
  latencyMicroseconds: number;
  notes?: string;
}

export interface BookLevel {
  price: number;
  volume: number;
  orderCount: number;
  totalCumulative: number;
  depthPct: number;
}

export interface OrderBookSnapshot {
  bids: BookLevel[];
  asks: BookLevel[];
  nbboBid: number;
  nbboAsk: number;
  midpoint: number;
  spread: number;
  spreadBps: number;
  totalBidVolume: number;
  totalAskVolume: number;
}

export interface TradeExecution {
  execId: string;
  instrumentId: string;
  price: number;
  quantity: number;
  makerOrderId: string;
  takerOrderId: string;
  makerMpid: string;
  takerMpid: string;
  venue: ExecutionVenue;
  side: OrderSide;
  isDarkCross: boolean;
  midpointSavedPrice: number;
  timestamp: number;
  epochNs: number;
  matchingLatencyUs: number;
}

export interface DarkPoolRestingOrder {
  order: Order;
  timestamp: number;
  priorityScore: number;
}

export interface VpinBucket {
  bucketIndex: number;
  buyVolume: number;
  sellVolume: number;
  orderImbalance: number;
  absImbalance: number;
  timestamp: number;
}

export interface VpinMetrics {
  currentVpin: number;
  vpinThreshold: number;
  isToxic: boolean;
  bucketSize: number;
  currentBucketVolume: number;
  currentBucketBuyVol: number;
  currentBucketSellVol: number;
  completedBuckets: VpinBucket[];
  historicalVpin: Array<{ timestamp: number; vpin: number }>;
}

export interface HawkesMetrics {
  lambda1: number; // Trade arrival conditional intensity
  lambda2: number; // Cancel arrival conditional intensity
  mu1: number;    // Baseline trade intensity
  mu2: number;    // Baseline cancel intensity
  alpha11: number;
  alpha12: number; // Cancel -> Trade cross excitation
  alpha21: number; // Trade -> Cancel cross excitation (predatory reaction)
  alpha22: number;
  beta: number;    // Exponential decay parameter
  predatoryCancelRatio: number;
  spoofingAlert: boolean;
  history: Array<{ timestamp: number; lambda1: number; lambda2: number; predatoryScore: number }>;
}

export interface LatencySample {
  latencyUs: number;
  timestamp: number;
  orderType: string;
}

export interface LatencyHistogramBucket {
  bucketLabel: string;
  minUs: number;
  maxUs: number;
  count: number;
  percentage: number;
}

export interface LatencyMetrics {
  currentUs: number;
  p50Us: number;
  p90Us: number;
  p99Us: number;
  maxUs: number;
  minUs: number;
  throughputTps: number;
  totalOrdersProcessed: number;
  totalTradesExecuted: number;
  hotPathZeroAllocBytes: number;
  histogram: LatencyHistogramBucket[];
}

export interface MarketStats {
  instrument: string;
  lastPrice: number;
  priceChange: number;
  priceChangePct: number;
  volume24h: number;
  darkVolumeShare: number;
  litVolumeShare: number;
  totalTradesCount: number;
  activeOrdersCount: number;
  darkOrdersCount: number;
}
