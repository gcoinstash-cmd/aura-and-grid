import React, { useState } from 'react';
import { 
  Database, 
  Table2, 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Key, 
  FileCode2,
  CheckCircle2
} from 'lucide-react';
import { ALLOYDB_SCHEMA_SQL } from '../data/monopolyDocs';
import { BASE_BTC_PRICE } from '../utils/algoEngine';

interface QueryPreset {
  id: string;
  name: string;
  query: string;
  runMock: () => any[];
}

export const AlloyDbSchemaTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<'mandates' | 'slices' | 'benchmark'>('mandates');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>(
    'SELECT mandate_id, symbol, side, total_notional_usd, arrival_price, current_vwap, realized_slippage_bps, status FROM execution_mandates;'
  );
  const [queryResult, setQueryResult] = useState<any[] | null>([
    {
      mandate_id: 'MAN-2026-BTC-8921-ALPHA',
      symbol: 'BTC-USD',
      side: 'BUY',
      total_notional_usd: '$10,000,000.00',
      arrival_price: '$64,250.00',
      current_vwap: '$64,255.14',
      realized_slippage_bps: '0.80 bps',
      status: 'COMPLETED',
    },
  ]);
  const [isExecutingSql, setIsExecutingSql] = useState<boolean>(false);
  const [sqlExecutionTime, setSqlExecutionTime] = useState<string>('0.42 ms');

  const queryPresets: QueryPreset[] = [
    {
      id: 'active-mandates',
      name: '1. Select Parent Mandates Overview',
      query: 'SELECT mandate_id, symbol, side, total_notional_usd, arrival_price, current_vwap, realized_slippage_bps, status FROM execution_mandates;',
      runMock: () => [
        {
          mandate_id: 'MAN-2026-BTC-8921-ALPHA',
          symbol: 'BTC-USD',
          side: 'BUY',
          total_notional_usd: '$10,000,000.00',
          arrival_price: '$64,250.00',
          current_vwap: '$64,255.14',
          realized_slippage_bps: '0.80 bps',
          status: 'COMPLETED',
        },
        {
          mandate_id: 'MAN-2026-ETH-4102-BETA',
          symbol: 'ETH-USD',
          side: 'BUY',
          total_notional_usd: '$5,000,000.00',
          arrival_price: '$3,480.00',
          current_vwap: '$3,480.45',
          realized_slippage_bps: '0.62 bps',
          status: 'ACTIVE',
        },
      ],
    },
    {
      id: 'slippage-audit',
      name: '2. Audit Slippage Against 3.0 bps Threshold',
      query: 'SELECT audit_id, mandate_id, arrival_price, terminal_vwap, total_slippage_bps, compliance_passed, hash_signature FROM benchmark_slippage WHERE total_slippage_bps <= 3.00;',
      runMock: () => [
        {
          audit_id: 1042,
          mandate_id: 'MAN-2026-BTC-8921-ALPHA',
          arrival_price: '$64,250.00',
          terminal_vwap: '$64,255.14',
          total_slippage_bps: '0.80 bps',
          compliance_passed: 'TRUE (PASSED)',
          hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        },
      ],
    },
    {
      id: 'venue-breakdown',
      name: '3. Volume & Slippage by Execution Venue',
      query: 'SELECT venue, COUNT(*) as slice_count, SUM(filled_quantity) as total_btc, AVG(slippage_bps) as avg_slippage_bps FROM slice_orders GROUP BY venue ORDER BY total_btc DESC;',
      runMock: () => [
        { venue: 'COINBASE_PRIME', slice_count: 25, total_btc: '38.9102 BTC', avg_slippage_bps: '0.78 bps' },
        { venue: 'BINANCE_US', slice_count: 25, total_btc: '38.9102 BTC', avg_slippage_bps: '0.81 bps' },
        { venue: 'KRAKEN_INST', slice_count: 25, total_btc: '38.9102 BTC', avg_slippage_bps: '0.79 bps' },
        { venue: 'LMAX_DIGITAL', slice_count: 25, total_btc: '38.9102 BTC', avg_slippage_bps: '0.82 bps' },
      ],
    },
  ];

  const handleCopySql = () => {
    navigator.clipboard.writeText(ALLOYDB_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExecuteSql = (preset?: QueryPreset) => {
    setIsExecutingSql(true);
    const targetPreset = preset || queryPresets.find((p) => p.query.trim() === activeQuery.trim()) || queryPresets[0];
    if (preset) setActiveQuery(preset.query);

    setTimeout(() => {
      setQueryResult(targetPreset.runMock());
      setSqlExecutionTime((0.35 + Math.random() * 0.2).toFixed(2) + ' ms');
      setIsExecutingSql(false);
    }, 120);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Database className="w-6 h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
              AlloyDB PostgreSQL 16 Production DDL Schema
            </h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
              RPO=0 ZERO-DATA-LOSS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Normalized DDL schema with range-partitioned child order tables, composite indices on (symbol, scheduled_timestamp), and audit triggers.
          </p>
        </div>

        <button
          onClick={handleCopySql}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-sm font-bold border border-slate-700 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
          <span>{copied ? 'COPIED SQL' : 'COPY ALLOYDB DDL'}</span>
        </button>
      </div>

      {/* Tables Structure Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Table2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-black text-white uppercase">
            Relational Schema Invariants & Indices
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTable('mandates')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedTable === 'mandates'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            TABLE execution_mandates (Parent Orders)
          </button>
          <button
            onClick={() => setSelectedTable('slices')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedTable === 'slices'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            TABLE slice_orders (Partitioned Nanosecond Fills)
          </button>
          <button
            onClick={() => setSelectedTable('benchmark')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedTable === 'benchmark'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            TABLE benchmark_slippage (Immutable Audit Trail)
          </button>
        </div>

        {/* Selected Table Detail Card */}
        {selectedTable === 'mandates' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold text-sm">
              CREATE TABLE execution_mandates
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">mandate_id</span> (VARCHAR(64) PK)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">symbol</span> (VARCHAR(32) NOT NULL)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">side</span> (ENUM &apos;BUY&apos;, &apos;SELL&apos;)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">total_notional_usd</span> (NUMERIC(18,4))
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">arrival_price</span> (NUMERIC(18,4))
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">realized_slippage_bps</span> (NUMERIC(8,4))
              </div>
            </div>
            <div className="text-slate-400 text-xs mt-2">
              <strong className="text-emerald-400">Composite Index:</strong> CREATE INDEX idx_mandates_symbol_status ON execution_mandates (symbol, status);
            </div>
          </div>
        )}

        {selectedTable === 'slices' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold text-sm">
              CREATE TABLE slice_orders PARTITION BY RANGE (scheduled_timestamp)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">slice_id</span> (UUID DEFAULT uuid_generate_v4())
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">mandate_id</span> (FK execution_mandates)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">scheduled_timestamp</span> (TIMESTAMPTZ PK)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">venue</span> (ENUM COINBASE, BINANCE, KRAKEN, LMAX)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">executed_price</span> (NUMERIC(18,4))
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">slippage_bps</span> (NUMERIC(8,4))
              </div>
            </div>
            <div className="text-slate-400 text-xs mt-2">
              <strong className="text-emerald-400">Partitioned:</strong> Quarterly Range Partitioning for instant sub-millisecond sequential index lookups.
            </div>
          </div>
        )}

        {selectedTable === 'benchmark' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold text-sm">
              CREATE TABLE benchmark_slippage (Immutable Audit Ledger)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">audit_id</span> (BIGSERIAL PK)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">mandate_id</span> (FK execution_mandates)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">total_slippage_bps</span> (NUMERIC(8,4))
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">compliance_passed</span> (BOOLEAN)
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">hash_signature</span> (VARCHAR(64) SHA256)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive SQL Test Query Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white uppercase">
              AlloyDB Interactive SQL Query Runner
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Presets:</span>
            {queryPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleExecuteSql(preset)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 cursor-pointer"
              >
                {preset.name.split('.')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Editor Area */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={activeQuery}
            onChange={(e) => setActiveQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-amber-500"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>AlloyDB Engine: PostgreSQL 16.4</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Exec Time: {sqlExecutionTime}</span>
            </div>

            <button
              onClick={() => handleExecuteSql()}
              disabled={isExecutingSql}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow transition-all cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-slate-950 ${isExecutingSql ? 'animate-spin' : ''}`} />
              <span>{isExecutingSql ? 'RUNNING SQL...' : 'EXECUTE QUERY'}</span>
            </button>
          </div>
        </div>

        {/* SQL Query Result Table */}
        {queryResult && (
          <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-60 overflow-y-auto">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800 sticky top-0">
                <tr>
                  {Object.keys(queryResult[0] || {}).map((col) => (
                    <th key={col} className="py-2.5 px-3 font-bold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-200">
                {queryResult.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    {Object.values(row).map((val: any, valIdx) => (
                      <td key={valIdx} className="py-2.5 px-3 text-slate-300">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
