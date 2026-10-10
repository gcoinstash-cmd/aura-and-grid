import React, { useState } from 'react';
import { ArbitrageRoute, VenueLatencyTelemetry } from '../types/quant';
import { Database, Terminal, Send, Radio, Play, Pause } from 'lucide-react';

interface Props {
  routes: ArbitrageRoute[];
  venues: VenueLatencyTelemetry[];
  ticksPerSec: number;
}

export const ApiConsole: React.FC<Props> = ({ routes, venues, ticksPerSec }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/routes/triangular');
  const [activeTab, setActiveTab] = useState<'rest' | 'ws'>('rest');
  const [wsFeedType, setWsFeedType] = useState<'signals' | 'ticks'>('signals');
  const [isWsStreaming, setIsWsStreaming] = useState(true);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [requestTimeMs, setRequestTimeMs] = useState<number | null>(null);

  // Execute mock REST call based on live state
  const handleExecuteRequest = () => {
    const start = performance.now();
    let res: any = {};

    if (selectedEndpoint === 'GET /healthz') {
      res = {
        status: 'HEALTHY',
        engine_time_ns: Date.now() * 1_000_000,
        ticks_per_sec: ticksPerSec,
        active_venues: venues.length,
        version: '1.0.4-PROD',
        solver_mode: 'BELLMAN_FORD_NEGATIVE_LOG',
      };
    } else if (selectedEndpoint === 'GET /api/v1/routes/triangular') {
      res = {
        timestamp_ns: Date.now() * 1_000_000,
        total_routes_found: routes.length,
        min_profit_bps_filter: 4.0,
        routes: routes.map((r) => ({
          id: r.id,
          cycle_nodes: r.cycleNodes,
          gross_multiplier: r.grossMultiplier,
          net_profit_bps: r.netProfitBps,
          cycle_weight_sum: r.cycleWeightSum,
          estimated_fill_ms: r.estimatedFillMs,
          detected_timestamp_ns: r.detectedTimestampNs,
          edges: r.edges.map((e) => ({
            source: e.source,
            target: e.target,
            rate: e.rate,
            fee_bps: e.feeFraction * 10000,
            weight: e.weight,
            venue: e.venue,
            symbol: e.symbol,
            action: e.action,
          })),
        })),
      };
    } else if (selectedEndpoint === 'POST /api/v1/execute/arb') {
      const target = routes[0];
      if (target) {
        res = {
          dispatch_id: `DISP-${Date.now()}-${Math.floor(Math.random() * 899 + 100)}`,
          route_id: target.id,
          status: 'FILLED',
          path: target.cycleNodes.join('->'),
          allocated_capital_usd: target.allocatedCapitalUsd,
          expected_profit_usd: target.expectedProfitUsd,
          realized_profit_usd: Number((target.expectedProfitUsd * 0.985).toFixed(2)),
          total_dispatch_time_us: 342,
          commit_hash: '2pc-verified-atomic-ok',
          legs_filled: target.edges.length,
        };
      } else {
        res = {
          error_code: 'NO_ACTIVE_NEGATIVE_CYCLES',
          message: 'No profitable cycles meet the risk-adjusted execution criteria at this epoch.',
        };
      }
    } else if (selectedEndpoint === 'GET /api/v1/latency/venues') {
      res = venues.map((v) => ({
        venue: v.venue,
        ping_ms: v.pingMs,
        orderbook_depth_usd: v.orderbookDepthUsd,
        status: v.status,
        packets_dropped: v.packetsDropped,
        jitter_us: v.jitterUs,
        location: v.location,
      }));
    }

    const elapsed = performance.now() - start;
    setRequestTimeMs(Number(elapsed.toFixed(2)));
    setLastResponse(res);
  };

  return (
    <div className="space-y-6">
      {/* Selector: REST vs WebSocket */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between font-mono text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('rest')}
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              activeTab === 'rest'
                ? 'bg-zinc-800 text-violet-300 border border-violet-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-violet-400" />
            OpenAPI 3.1 REST Endpoints
          </button>

          <button
            onClick={() => setActiveTab('ws')}
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              activeTab === 'ws'
                ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            WebSocket Streams (&lt;50ms)
          </button>
        </div>

        <span className="text-zinc-300 font-semibold hidden sm:inline text-xs">
          Internal Low-Latency Mesh: Port 8080
        </span>
      </div>

      {activeTab === 'rest' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-sm">
          {/* Left: Endpoint Picker & Trigger */}
          <div className="lg:col-span-4 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
            <div className="text-zinc-200 font-extrabold uppercase tracking-wider pb-2 border-b border-zinc-800">
              Select REST Endpoint
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'GET /api/v1/routes/triangular', desc: 'Scan active negative cycles', method: 'GET' },
                { name: 'POST /api/v1/execute/arb', desc: 'Atomic 2PC Route Dispatch', method: 'POST' },
                { name: 'GET /api/v1/latency/venues', desc: 'Cross-venue microsecond ping', method: 'GET' },
                { name: 'GET /healthz', desc: 'Liveness & tick buffer probe', method: 'GET' },
              ].map((ep) => (
                <button
                  key={ep.name}
                  onClick={() => setSelectedEndpoint(ep.name)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedEndpoint === ep.name
                      ? 'bg-zinc-900 border-violet-500 text-white font-bold'
                      : 'border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${
                        ep.method === 'GET'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-sm font-bold">{ep.name.split(' ')[1]}</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 font-normal">{ep.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleExecuteRequest}
              className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              EXECUTE REQUEST
            </button>
          </div>

          {/* Right: Response Payload Viewer */}
          <div className="lg:col-span-8 bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-white uppercase text-sm">Response Payload (200 OK)</span>
              </div>
              {requestTimeMs !== null && (
                <span className="text-zinc-300 text-xs">
                  Execution time:{' '}
                  <strong className="text-cyan-400 font-bold">{requestTimeMs} ms</strong>
                </span>
              )}
            </div>

            <div className="bg-zinc-900/90 p-4 rounded-lg border border-zinc-800 max-h-[440px] overflow-y-auto text-emerald-400 text-sm whitespace-pre-wrap leading-relaxed font-mono">
              {lastResponse
                ? JSON.stringify(lastResponse, null, 2)
                : '// Click "EXECUTE REQUEST" to query live internal engine state.'}
            </div>
          </div>
        </div>
      ) : (
        /* WebSocket Live Channel Inspector */
        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4 font-mono text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">Active Channel:</span>
              <button
                onClick={() => setWsFeedType('signals')}
                className={`px-3.5 py-1.5 rounded transition ${
                  wsFeedType === 'signals' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700' : 'text-zinc-400'
                }`}
              >
                /ws/v1/arbitrage-signals (&lt;50ms)
              </button>
              <button
                onClick={() => setWsFeedType('ticks')}
                className={`px-3.5 py-1.5 rounded transition ${
                  wsFeedType === 'ticks' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700' : 'text-zinc-400'
                }`}
              >
                /ws/v1/tick-stream (&lt;2ms)
              </button>
            </div>

            <button
              onClick={() => setIsWsStreaming((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 hover:text-white font-bold text-xs"
            >
              {isWsStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isWsStreaming ? 'PAUSE FEED' : 'RESUME FEED'}</span>
            </button>
          </div>

          <div className="bg-zinc-900/90 p-4 rounded-lg border border-zinc-800 max-h-[440px] overflow-y-auto space-y-3">
            {wsFeedType === 'signals' ? (
              routes.length > 0 ? (
                routes.map((r, idx) => (
                  <div key={idx} className="p-3.5 rounded bg-zinc-950 border border-zinc-800 text-cyan-300 space-y-1.5">
                    <div className="flex items-center justify-between text-zinc-400 text-xs">
                      <span className="font-bold text-cyan-400">EVENT: ARB_SIGNAL</span>
                      <span>{new Date().toISOString()}</span>
                    </div>
                    <div className="text-white font-black text-base">{r.cycleNodes.join(' → ')}</div>
                    <div className="text-emerald-400 font-extrabold text-sm">
                      Net Spread: +{r.netProfitBps.toFixed(2)} BPS | Expected Net PnL: +${r.expectedProfitUsd.toFixed(2)}
                    </div>
                    <div className="text-zinc-400 text-xs font-mono">
                      Route ID: {r.id} | Cycle Weight Sum: {r.cycleWeightSum} | Est. Fill: {r.estimatedFillMs}ms
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-zinc-400 text-center py-8">
                  Awaiting next negative-log cycle dislocation trigger...
                </div>
              )
            ) : (
              <div className="space-y-1.5 text-zinc-300">
                <div className="text-emerald-400 font-extrabold text-xs mb-2 tracking-wider uppercase">
                  STREAMING REAL-TIME AGGREGATED L1 ORDERBOOK QUOTES...
                </div>
                {[
                  { venue: 'Binance', sym: 'BTCUSDT', bid: 67421.2, ask: 67423.8 },
                  { venue: 'OKX', sym: 'ETHBTC', bid: 0.05196, ask: 0.05201 },
                  { venue: 'Coinbase', sym: 'ETHUSDT', bid: 3526.1, ask: 3528.0 },
                  { venue: 'Bybit', sym: 'SOLUSDC', bid: 154.25, ask: 154.40 },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono text-sm">
                    <span className="text-white font-bold">{item.venue} {item.sym}</span>
                    <span className="text-emerald-400 font-extrabold">BID: {item.bid}</span>
                    <span className="text-rose-400 font-extrabold">ASK: {item.ask}</span>
                    <span className="text-zinc-400 text-xs">{Date.now() * 1_000_000}ns</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
