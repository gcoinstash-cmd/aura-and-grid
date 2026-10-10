import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Flame, 
  CheckCircle2,
  Trash2,
  Play,
  ArrowRight
} from 'lucide-react';
import { OPENAPI_SPEC_JSON } from '../data/monopolyDocs';
import { BASE_BTC_PRICE } from '../utils/algoEngine';

interface ApiTestCard {
  id: string;
  method: 'POST' | 'GET' | 'DELETE';
  endpoint: string;
  title: string;
  description: string;
  defaultBody?: string;
  defaultPathParams?: Record<string, string>;
  generateResponse: (body?: string, pathParams?: Record<string, string>) => {
    statusCode: number;
    statusText: string;
    payload: any;
  };
}

export const OpenApiSandboxTab: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('create-mandate');
  const [requestBodies, setRequestBodies] = useState<Record<string, string>>({
    'create-mandate': JSON.stringify(
      {
        symbol: 'BTC-USD',
        side: 'BUY',
        total_notional_usd: 10000000,
        duration_minutes: 60,
        strategy: 'ALMGREN_CHRISS',
        risk_aversion_lambda: 0.000001,
        target_slippage_bps_cap: 3.0,
      },
      null,
      2
    ),
    'cancel-mandate': '',
    'get-performance': '',
    'get-health': '',
    'get-curve': '',
  });

  const [pathParamInputs, setPathParamInputs] = useState<Record<string, string>>({
    mandate_id: 'MAN-2026-BTC-8921-ALPHA',
    symbol: 'BTC-USD',
  });

  const [activeResponse, setActiveResponse] = useState<{
    endpointId: string;
    statusCode: number;
    statusText: string;
    latencyMs: string;
    timestamp: string;
    payload: any;
  } | null>({
    endpointId: 'create-mandate',
    statusCode: 201,
    statusText: 'Created',
    latencyMs: '4.62',
    timestamp: new Date().toISOString(),
    payload: {
      mandate_id: 'MAN-2026-BTC-8921-ALPHA',
      symbol: 'BTC-USD',
      side: 'BUY',
      target_algo: 'VWAP',
      total_slices: 120,
      status: 'ACTIVE',
      arrival_price: BASE_BTC_PRICE,
      estimated_slippage_bps: 0.8,
      alloydb_wal_lsn: '0/1F8A90C',
      scheduled_completion_utc: '15:30:00.000Z',
    },
  });

  const [isSending, setIsSending] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showRawOpenApi, setShowRawOpenApi] = useState<boolean>(false);

  const endpoints: ApiTestCard[] = [
    {
      id: 'create-mandate',
      method: 'POST',
      endpoint: '/v1/algo/mandates',
      title: 'Submit Parent Order Mandate',
      description: 'Ingests institutional order, computes Almgren-Chriss trajectory, and loads child slices into Redis ring buffer.',
      defaultBody: requestBodies['create-mandate'],
      generateResponse: (body) => {
        let parsed = { total_notional_usd: 10000000, symbol: 'BTC-USD', side: 'BUY' };
        try {
          if (body) parsed = JSON.parse(body);
        } catch {}
        return {
          statusCode: 201,
          statusText: 'Created',
          payload: {
            mandate_id: `MAN-2026-${parsed.symbol.replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}-ALPHA`,
            symbol: parsed.symbol || 'BTC-USD',
            side: parsed.side || 'BUY',
            target_algo: 'VWAP',
            total_slices: 120,
            status: 'ACTIVE',
            arrival_price: BASE_BTC_PRICE,
            estimated_slippage_bps: 0.80,
            alloydb_wal_lsn: '0/1F8A90C',
            scheduled_completion_utc: new Date(Date.now() + 3600 * 1000).toISOString(),
          },
        };
      },
    },
    {
      id: 'cancel-mandate',
      method: 'DELETE',
      endpoint: '/v1/algo/mandates/{id}',
      title: 'Emergency Stop / Cancel Mandate',
      description: 'Atomic circuit-breaker purge. Cancels remaining open slices in Redis and finalizes AlloyDB ledger.',
      generateResponse: () => ({
        statusCode: 200,
        statusText: 'OK',
        payload: {
          mandate_id: pathParamInputs.mandate_id,
          status: 'ABORTED',
          message: 'Remaining open slices cancelled successfully. Ledger finalized.',
          executed_fill_audit: {
            executed_slices: 74,
            cancelled_slices: 46,
            filled_notional_usd: 6184500.0,
            realized_vwap: BASE_BTC_PRICE + 4.2,
            slippage_bps: 0.65,
          },
        },
      }),
    },
    {
      id: 'get-performance',
      method: 'GET',
      endpoint: '/v1/algo/mandates/{id}/performance',
      title: 'Fetch Real-Time Slippage Audit',
      description: 'Returns real-time arrival price, final execution VWAP, implementation shortfall, and benchmark slippage bps.',
      generateResponse: () => ({
        statusCode: 200,
        statusText: 'OK',
        payload: {
          mandate_id: pathParamInputs.mandate_id,
          symbol: 'BTC-USD',
          benchmark_metric: 'ARRIVAL_PRICE_VWAP',
          arrival_price: BASE_BTC_PRICE,
          final_execution_vwap: BASE_BTC_PRICE + 5.14,
          market_impact_usd: 802.40,
          realized_slippage_bps: 0.80,
          slippage_cap_bps: 3.00,
          compliance_status: 'VERIFIED_COMPLIANT',
          hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        },
      }),
    },
    {
      id: 'get-health',
      method: 'GET',
      endpoint: '/v1/health',
      title: 'Engine Health & Clock Drift',
      description: 'Pings ultra-low latency monotonic clock drift and AlloyDB ACID replication status.',
      generateResponse: () => ({
        statusCode: 200,
        statusText: 'OK',
        payload: {
          status: 'HEALTHY',
          clock_drift_ns: 28,
          active_mandates: 4,
          alloydb_ledger_status: 'RPO_ZERO',
          redis_ringbuffer_depth: 320,
          p99_execution_latency_ms: 4.78,
          timestamp_utc: new Date().toISOString(),
        },
      }),
    },
    {
      id: 'get-curve',
      method: 'GET',
      endpoint: '/v1/algo/curves/{symbol}',
      title: 'Intraday Volume Curve Profile',
      description: 'Fetches historical bimodal volume density curve used for VWAP slicing weighting.',
      generateResponse: () => ({
        statusCode: 200,
        statusText: 'OK',
        payload: {
          symbol: pathParamInputs.symbol || 'BTC-USD',
          profile_type: 'BIMODAL_U_SHAPED',
          granularity_minutes: 1,
          total_buckets: 60,
          open_weight_alpha: 3.5,
          midday_weight_beta: 0.38,
          close_weight_gamma: 3.8,
          generated_at_utc: new Date().toISOString(),
        },
      }),
    },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpointId) || endpoints[0];

  const handleExecuteRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      const responseData = currentEndpoint.generateResponse(
        requestBodies[selectedEndpointId],
        pathParamInputs
      );
      const simulatedLatency = (3.4 + Math.random() * 1.5).toFixed(2);
      setActiveResponse({
        endpointId: currentEndpoint.id,
        statusCode: responseData.statusCode,
        statusText: responseData.statusText,
        latencyMs: simulatedLatency,
        timestamp: new Date().toISOString(),
        payload: responseData.payload,
      });
      setIsSending(false);
    }, 150);
  };

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Schema Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
              OpenAPI 3.1 Live Interactive Sandbox
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              REST / FIX 4.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic mock testbed executing institutional mandate lifecycles with ultra-low latency response feeds.
          </p>
        </div>

        <button
          onClick={() => setShowRawOpenApi(!showRawOpenApi)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm font-bold border border-slate-700 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>{showRawOpenApi ? 'HIDE OPENAPI JSON' : 'VIEW OPENAPI 3.1 SCHEMA'}</span>
        </button>
      </div>

      {/* Raw OpenAPI 3.1 Specification Modal/Drawer */}
      {showRawOpenApi && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-300">
              OPENAPI_SPEC.json (OpenAPI 3.1.0 Institutional Spec)
            </h3>
            <button
              onClick={() => handleCopyJson(OPENAPI_SPEC_JSON)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-80 border border-slate-800">
            {OPENAPI_SPEC_JSON}
          </pre>
        </div>
      )}

      {/* Main Grid: Endpoint Selector & Request/Response Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Endpoints Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Production Endpoints ({endpoints.length})
          </div>

          <div className="space-y-2.5">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpointId === ep.id;
              const methodColor = 
                ep.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                ep.method === 'DELETE' ? 'bg-rose-950 text-rose-400 border-rose-500/40' :
                'bg-cyan-950 text-cyan-400 border-cyan-500/40';

              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpointId(ep.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-black border ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-200 truncate">
                      {ep.endpoint}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-300 mt-2">
                    {ep.title}
                  </div>
                  <div className="text-[12px] text-slate-400 mt-0.5 line-clamp-2">
                    {ep.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Request & Response Sandbox (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Request Config Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-black border ${
                  currentEndpoint.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                  currentEndpoint.method === 'DELETE' ? 'bg-rose-950 text-rose-400 border-rose-500/40' :
                  'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                }`}>
                  {currentEndpoint.method}
                </span>
                <span className="text-base font-mono font-bold text-white">
                  https://algo-core.chronos-tick.internal{currentEndpoint.endpoint}
                </span>
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={isSending}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/60 transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
              >
                <Send className={`w-4 h-4 ${isSending ? 'animate-spin' : ''}`} />
                <span>{isSending ? 'EXECUTING...' : 'SEND REQUEST'}</span>
              </button>
            </div>

            {/* Path Parameters (if applicable) */}
            {currentEndpoint.endpoint.includes('{id}') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Path Parameter: <span className="text-cyan-400 font-bold">&#123;id&#125;</span>
                </label>
                <input
                  type="text"
                  value={pathParamInputs.mandate_id}
                  onChange={(e) => setPathParamInputs({ ...pathParamInputs, mandate_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {currentEndpoint.endpoint.includes('{symbol}') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Path Parameter: <span className="text-cyan-400 font-bold">&#123;symbol&#125;</span>
                </label>
                <input
                  type="text"
                  value={pathParamInputs.symbol}
                  onChange={(e) => setPathParamInputs({ ...pathParamInputs, symbol: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Request Body Editor (for POST) */}
            {currentEndpoint.method === 'POST' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Request JSON Body (Almgren-Chriss Input)
                  </label>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Content-Type: application/json</span>
                </div>
                <textarea
                  rows={8}
                  value={requestBodies[selectedEndpointId] || ''}
                  onChange={(e) => setRequestBodies({ ...requestBodies, [selectedEndpointId]: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs rounded-lg p-3.5 focus:outline-none focus:border-emerald-500 resize-y"
                />
              </div>
            )}
          </div>

          {/* Response Inspector Card */}
          {activeResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Response:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    activeResponse.statusCode >= 200 && activeResponse.statusCode < 300
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {activeResponse.statusCode} {activeResponse.statusText}
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeResponse.latencyMs} ms
                  </span>
                </div>

                <button
                  onClick={() => handleCopyJson(JSON.stringify(activeResponse.payload, null, 2))}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded border border-slate-700 cursor-pointer self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY RESPONSE'}</span>
                </button>
              </div>

              {/* Pretty JSON Response Body */}
              <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 border border-slate-800">
                {JSON.stringify(activeResponse.payload, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
