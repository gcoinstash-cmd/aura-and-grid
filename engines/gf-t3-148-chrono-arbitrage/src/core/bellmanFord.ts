import { OrderBookTick, GraphEdge, ArbitrageRoute } from '../types/quant';

/**
 * ThreadSafeCurrencyGraph (Client-side TypeScript implementation of T3-QUANT-02)
 */
export class ClientCurrencyGraph {
  vertices: Set<string> = new Set();
  adj: Map<string, Map<string, GraphEdge>> = new Map();

  clear() {
    this.vertices.clear();
    this.adj.clear();
  }

  updateTick(tick: OrderBookTick) {
    const b = tick.baseCurrency.toUpperCase();
    const q = tick.quoteCurrency.toUpperCase();
    this.vertices.add(b);
    this.vertices.add(q);
    const fee = tick.takerFeeBps / 10000.0;

    if (!this.adj.has(b)) this.adj.set(b, new Map());
    if (!this.adj.has(q)) this.adj.set(q, new Map());

    // Leg 1: SELL base for quote. Rate = bidPrice
    if (tick.bidPrice > 0) {
      const effSell = tick.bidPrice * (1.0 - fee);
      if (effSell > 0) {
        const weight = -Math.log(effSell);
        this.adj.get(b)!.set(q, {
          source: b,
          target: q,
          rate: tick.bidPrice,
          feeFraction: fee,
          weight,
          depthLiquidity: tick.bidQty * tick.bidPrice,
          venue: tick.venue,
          symbol: tick.symbol,
          action: 'SELL',
          timestampNs: tick.timestampNs,
        });
      }
    }

    // Leg 2: BUY base with quote. Rate = 1.0 / askPrice
    if (tick.askPrice > 0) {
      const effBuy = (1.0 / tick.askPrice) * (1.0 - fee);
      if (effBuy > 0) {
        const weight = -Math.log(effBuy);
        this.adj.get(q)!.set(b, {
          source: q,
          target: b,
          rate: 1.0 / tick.askPrice,
          feeFraction: fee,
          weight,
          depthLiquidity: tick.askQty * tick.askPrice,
          venue: tick.venue,
          symbol: tick.symbol,
          action: 'BUY',
          timestampNs: tick.timestampNs,
        });
      }
    }
  }

  getSnapshot(): { nodes: string[]; edges: GraphEdge[] } {
    const nodes = Array.from(this.vertices);
    const edges: GraphEdge[] = [];
    for (const [, targets] of this.adj) {
      for (const [, edge] of targets) {
        edges.push(edge);
      }
    }
    return { nodes, edges };
  }
}

/**
 * Modified Bellman-Ford Solver for Negative Log Cycles
 */
export function solveNegativeCycles(
  graph: ClientCurrencyGraph,
  minProfitBps = 4.0,
  maxHops = 4,
  capitalUsd = 25000
): ArbitrageRoute[] {
  const { nodes, edges } = graph.getSnapshot();
  if (nodes.length === 0 || edges.length === 0) return [];

  const dist: Record<string, number> = {};
  const pred: Record<string, { prev: string; edge: GraphEdge } | null> = {};

  for (const node of nodes) {
    dist[node] = 0.0;
    pred[node] = null;
  }

  const n = nodes.length;
  // Relax |V| - 1 times
  for (let i = 0; i < n - 1; i++) {
    let relaxed = false;
    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const w = edge.weight;
      if (dist[u] + w < dist[v] - 1e-12) {
        dist[v] = dist[u] + w;
        pred[v] = { prev: u, edge };
        relaxed = true;
      }
    }
    if (!relaxed) break;
  }

  // Detect negative cycles on final pass
  const discoveredRoutes: ArbitrageRoute[] = [];
  const visitedCycleKeys = new Set<string>();

  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const w = edge.weight;

    if (dist[u] + w < dist[v] - 1e-12) {
      // Step into negative cycle
      let curr = v;
      for (let i = 0; i < n; i++) {
        if (pred[curr]) {
          curr = pred[curr]!.prev;
        }
      }

      const cycleNodes: string[] = [];
      const cycleEdges: GraphEdge[] = [];
      let trace = curr;
      let weightAccum = 0.0

      for (let step = 0; step < maxHops + 2; step++) {
        cycleNodes.push(trace);
        const p = pred[trace];
        if (!p) break;
        cycleEdges.push(p.edge);
        weightAccum += p.edge.weight;
        trace = p.prev;
        if (trace === curr && cycleNodes.length > 1) {
          cycleNodes.push(curr);
          break;
        }
      }

      cycleEdges.reverse();
      cycleNodes.reverse();

      if (cycleNodes.length >= 4 && cycleNodes[0] === cycleNodes[cycleNodes.length - 1]) {
        const canonicalKey = cycleNodes.join('->');
        if (!visitedCycleKeys.has(canonicalKey)) {
          visitedCycleKeys.add(canonicalKey);
          const grossMult = Math.exp(-weightAccum);
          const netBps = (grossMult - 1.0) * 10000.0;

          if (netBps >= minProfitBps) {
            // Slippage estimation
            let depthSlippageSum = 0;
            for (const leg of cycleEdges) {
              const depthRatio = leg.depthLiquidity > 0 ? capitalUsd / leg.depthLiquidity : 0.05;
              depthSlippageSum += 0.125 * Math.pow(Math.min(depthRatio, 0.4), 2);
            }
            const slippageBps = depthSlippageSum * 10000.0;
            const effectiveProfitBps = Math.max(0, netBps - slippageBps);
            const expectedProfitUsd = (capitalUsd * effectiveProfitBps) / 10000.0;

            discoveredRoutes.push({
              id: `ARB-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
              cycleNodes,
              edges: cycleEdges,
              grossMultiplier: grossMult,
              netProfitBps: Number(netBps.toFixed(2)),
              cycleWeightSum: Number(weightAccum.toFixed(6)),
              estimatedFillMs: Number((0.85 + Math.random() * 0.9).toFixed(2)),
              detectedTimestampNs: Date.now() * 1_000_000,
              allocatedCapitalUsd: capitalUsd,
              expectedProfitUsd: Number(expectedProfitUsd.toFixed(2)),
              slippageBps: Number(slippageBps.toFixed(2)),
            });
          }
        }
      }
    }
  }

  return discoveredRoutes.sort((a, b) => b.netProfitBps - a.netProfitBps);
}

/**
 * Generates synthetic initial market orderbook state with cross-venue discrepancies
 */
export function getInitialMarketTicks(): OrderBookTick[] {
  const ts = Date.now() * 1_000_000;
  return [
    // Binance BTC/USDT
    {
      venue: 'Binance',
      symbol: 'BTCUSDT',
      baseCurrency: 'BTC',
      quoteCurrency: 'USDT',
      bidPrice: 67420.5,
      bidQty: 8.42,
      askPrice: 67425.0,
      askQty: 7.91,
      timestampNs: ts,
      takerFeeBps: 7.5,
    },
    // OKX ETH/BTC
    {
      venue: 'OKX',
      symbol: 'ETHBTC',
      baseCurrency: 'ETH',
      quoteCurrency: 'BTC',
      bidPrice: 0.05195,
      bidQty: 45.2,
      askPrice: 0.05202,
      askQty: 38.6,
      timestampNs: ts,
      takerFeeBps: 8.0,
    },
    // Coinbase Pro ETH/USDT (Slightly elevated spot price creating triangle arb)
    {
      venue: 'Coinbase Pro',
      symbol: 'ETHUSDT',
      baseCurrency: 'ETH',
      quoteCurrency: 'USDT',
      bidPrice: 3524.8,
      bidQty: 62.0,
      askPrice: 3527.2,
      askQty: 54.5,
      timestampNs: ts,
      takerFeeBps: 7.0,
    },
    // Bybit SOL/USDC
    {
      venue: 'Bybit',
      symbol: 'SOLUSDC',
      baseCurrency: 'SOL',
      quoteCurrency: 'USDC',
      bidPrice: 154.2,
      bidQty: 310.0,
      askPrice: 154.4,
      askQty: 290.0,
      timestampNs: ts,
      takerFeeBps: 6.0,
    },
    // Kraken SOL/ETH
    {
      venue: 'Kraken',
      symbol: 'SOLETH',
      baseCurrency: 'SOL',
      quoteCurrency: 'ETH',
      bidPrice: 0.0436,
      bidQty: 180.0,
      askPrice: 0.0437,
      askQty: 210.0,
      timestampNs: ts,
      takerFeeBps: 9.0,
    },
    // Binance USDC/USDT
    {
      venue: 'Binance',
      symbol: 'USDCUSDT',
      baseCurrency: 'USDC',
      quoteCurrency: 'USDT',
      bidPrice: 0.9998,
      bidQty: 250000.0,
      askPrice: 1.0001,
      askQty: 320000.0,
      timestampNs: ts,
      takerFeeBps: 2.0,
    },
    // Kraken EUR/USDT
    {
      venue: 'Kraken',
      symbol: 'EURUSDT',
      baseCurrency: 'EUR',
      quoteCurrency: 'USDT',
      bidPrice: 1.0825,
      bidQty: 120000.0,
      askPrice: 1.0832,
      askQty: 95000.0,
      timestampNs: ts,
      takerFeeBps: 6.5,
    },
    // OKX BTC/EUR
    {
      venue: 'OKX',
      symbol: 'BTCEUR',
      baseCurrency: 'BTC',
      quoteCurrency: 'EUR',
      bidPrice: 62240.0,
      bidQty: 4.5,
      askPrice: 62260.0,
      askQty: 5.1,
      timestampNs: ts,
      takerFeeBps: 7.5,
    },
  ];
}

/**
 * Simulates micro-jitter on market prices to induce intermittent triangular arbitrage spreads
 */
export function perturbTicks(ticks: OrderBookTick[]): OrderBookTick[] {
  const ts = Date.now() * 1_000_000;
  return ticks.map((t) => {
    // 15% chance of creating momentary latency dislocation
    const isDislocated = Math.random() < 0.15;
    const shiftPercent = isDislocated ? (Math.random() - 0.45) * 0.008 : (Math.random() - 0.5) * 0.001;
    const newBid = Math.max(0.0001, t.bidPrice * (1 + shiftPercent));
    const spreadFraction = (t.askPrice - t.bidPrice) / t.bidPrice;
    const newAsk = newBid * (1 + Math.max(0.0001, spreadFraction));

    return {
      ...t,
      bidPrice: Number(newBid.toFixed(newBid > 100 ? 2 : 5)),
      askPrice: Number(newAsk.toFixed(newAsk > 100 ? 2 : 5)),
      timestampNs: ts,
    };
  });
}
