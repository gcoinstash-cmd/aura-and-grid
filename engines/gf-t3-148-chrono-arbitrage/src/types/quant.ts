/**
 * T3-QUANT-02: CHRONO-ARBITRAGE Engine Types
 * Clean-Room Mathematical Quant Data Structures
 */

export interface OrderBookTick {
  venue: 'Binance' | 'OKX' | 'Coinbase Pro' | 'Bybit' | 'Kraken';
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  timestampNs: number;
  takerFeeBps: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  rate: number;
  feeFraction: number;
  weight: number; // -ln(rate * (1 - fee))
  depthLiquidity: number;
  venue: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  timestampNs: number;
}

export interface ArbitrageRoute {
  id: string;
  cycleNodes: string[];
  edges: GraphEdge[];
  grossMultiplier: number;
  netProfitBps: number;
  cycleWeightSum: number;
  estimatedFillMs: number;
  detectedTimestampNs: number;
  allocatedCapitalUsd: number;
  expectedProfitUsd: number;
  slippageBps: number;
}

export interface VenueLatencyTelemetry {
  venue: string;
  pingMs: number;
  orderbookDepthUsd: number;
  status: 'ACTIVE' | 'DEGRADED' | 'HALTED';
  packetsDropped: number;
  jitterUs: number;
  location: string;
}

export interface ExecutionDispatch {
  dispatchId: string;
  routeId: string;
  path: string;
  allocatedCapitalUsd: number;
  expectedProfitUsd: number;
  realizedProfitUsd: number;
  status: 'FILLED' | 'ROUTED' | 'REJECTED' | 'PARTIAL_FILL';
  dispatchTimeUs: number;
  timestamp: string;
  legs: {
    venue: string;
    pair: string;
    action: 'BUY' | 'SELL';
    price: number;
    qty: number;
    feeUsd: number;
    latencyUs: number;
  }[];
}
