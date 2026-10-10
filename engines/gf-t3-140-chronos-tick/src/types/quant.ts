export interface ChildSlice {
  sliceIndex: number;
  scheduledTime: string;
  executionTimestamp: number;
  targetQty: number;
  filledQty: number;
  arrivalPrice: number;
  filledPrice: number;
  marketVwap: number;
  vwapDelta: number;
  realizedSlippageBps: number;
  venue: 'COINBASE_PRIME' | 'BINANCE_US' | 'KRAKEN_INST' | 'LMAX_DIGITAL';
  status: 'FILLED' | 'IN_TRANSIT' | 'PENDING' | 'CANCELLED';
  impactCostUsd: number;
  poissonIntervalMs: number;
}

export interface VolumeBucket {
  minute: number; // 0 to 60
  timeLabel: string;
  historicalVolumeWeight: number; // 0.0 to 1.0 (U-shaped profile)
  expectedSliceNotional: number;
  realizedPrice: number;
  scheduledPrice: number;
}

export interface ExecutionMandate {
  mandateId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  totalNotionalUsd: number;
  totalQuantity: number;
  durationMinutes: number;
  strategy: 'VWAP' | 'TWAP' | 'ALMGREN_CHRISS';
  riskAversionLambda: number;
  targetSlippageBpsCap: number;
  arrivalPrice: number;
  currentVwap: number;
  realizedSlippageBps: number;
  filledNotionalUsd: number;
  filledQuantity: number;
  progressPercent: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ABORTED';
  slicesCount: number;
  filledSlicesCount: number;
  startTime: string;
  endTime: string;
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
  title: string;
  description: string;
  defaultParams?: Record<string, string>;
  defaultBody?: string;
  mockResponseGenerator: (params: Record<string, string>, body?: string) => {
    status: number;
    latencyMs: number;
    data: any;
  };
}

export type ActiveTab = 'simulator' | 'sandbox' | 'spec' | 'topology' | 'alloydb' | 'vault';
