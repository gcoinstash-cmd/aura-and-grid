export type OrderSide = 'BUY' | 'SELL';

export type VenueId = 'BINANCE' | 'COINBASE' | 'KRAKEN' | 'OKX' | 'BYBIT';

export interface BookLevel {
  price: number;
  qty: number;
}

export interface VenueInfo {
  id: VenueId;
  name: string;
  latencyUs: number;
  takerFeeBps: number;
  makerRebateBps: number;
  replenishRate: number; // units/ms
  bids: BookLevel[];
  asks: BookLevel[];
  color: string;
}

export interface ChildOrderOutput {
  childId: string;
  venueId: VenueId;
  side: OrderSide;
  qty: number;
  limitPrice: number;
  pacingDelayUs: number;
  expectedFeeUsd: number;
  fillProbability: number;
  percentage: number;
}

export interface RoutingDecisionOutput {
  parentId: string;
  symbol: string;
  side: OrderSide;
  totalQty: number;
  allocatedQty: number;
  unfilledQty: number;
  effectiveVwap: number;
  naiveBenchmarkPrice: number;
  slippageSavedUsd: number;
  slippageSavedBps: number;
  totalFeesUsd: number;
  computationTimeUs: number;
  triangularDetected: boolean;
  triangularSyntheticPrice?: number;
  triangularArbitrageBps?: number;
  childOrders: ChildOrderOutput[];
  timestamp: string;
}

export interface ExecutionLogItem {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ROUTING' | 'DISPATCH' | 'FILL' | 'DEFENSE';
  message: string;
  details?: string;
  color?: string;
}
