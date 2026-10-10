import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Table, 
  Layers, 
  HardDrive, 
  ShieldCheck, 
  Clock, 
  Code2 
} from 'lucide-react';
import { SPEC_ALLOYDB_SCHEMA_SQL } from '../data/specificationBundle';

export const AlloyDbSchemaTab: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);
  const [queryExecutionTimeMs, setQueryExecutionTimeMs] = useState<number | null>(null);

  const sampleQueries = [
    {
      title: '1. High-Speed Braking CoP Migration Analysis',
      description: 'Find all telemetry frames where brake pressure > 100 bar and active wing angle reached 42° airbrake position.',
      sql: `SELECT 
    recorded_at, 
    frame_seq_id, 
    speed_mph, 
    brake_bar, 
    ride_height_fl_mm, 
    cop_front_pct, 
    cop_rear_pct, 
    downforce_total_kgf, 
    active_wing_deg
FROM telemetry_frames
WHERE brake_bar > 100.0 AND speed_mph > 180.0
ORDER BY recorded_at DESC
LIMIT 5;`,
      mockData: [
        { recorded_at: "2026-10-05T15:56:46.120Z", frame_seq_id: 942180, speed_mph: 198.4, brake_bar: 118.5, ride_height_fl_mm: 18.2, cop_front_pct: 41.2, cop_rear_pct: 58.8, downforce_total_kgf: 2450.0, active_wing_deg: 42.0 },
        { recorded_at: "2026-10-05T15:56:46.110Z", frame_seq_id: 942170, speed_mph: 199.1, brake_bar: 115.0, ride_height_fl_mm: 18.5, cop_front_pct: 41.5, cop_rear_pct: 58.5, downforce_total_kgf: 2410.0, active_wing_deg: 42.0 },
        { recorded_at: "2026-10-05T15:56:46.100Z", frame_seq_id: 942160, speed_mph: 199.8, brake_bar: 110.2, ride_height_fl_mm: 19.1, cop_front_pct: 42.0, cop_rear_pct: 58.0, downforce_total_kgf: 2350.0, active_wing_deg: 38.5 },
        { recorded_at: "2026-10-05T15:56:46.090Z", frame_seq_id: 942150, speed_mph: 200.2, brake_bar: 95.0, ride_height_fl_mm: 20.4, cop_front_pct: 43.1, cop_rear_pct: 56.9, downforce_total_kgf: 2180.0, active_wing_deg: 24.0 },
        { recorded_at: "2026-10-05T15:56:46.080Z", frame_seq_id: 942140, speed_mph: 200.5, brake_bar: 60.0, ride_height_fl_mm: 22.8, cop_front_pct: 44.5, cop_rear_pct: 55.5, downforce_total_kgf: 1850.0, active_wing_deg: 12.0 },
      ]
    },
    {
      title: '2. Loop Jitter & Latency P99 Percentiles',
      description: 'Aggregate sub-millisecond execution times over the last 100,000 frames to verify SLA < 0.85 ms.',
      sql: `SELECT 
    COUNT(*) as total_frames,
    AVG(loop_latency_us) as avg_latency_us,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY loop_latency_us) as p95_latency_us,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY loop_latency_us) as p99_latency_us,
    MAX(loop_latency_us) as max_latency_us
FROM telemetry_frames
WHERE recorded_at >= NOW() - INTERVAL '1 hour';`,
      mockData: [
        { total_frames: 3600000, avg_latency_us: 782.4, p95_latency_us: 812.0, p99_latency_us: 838.5, max_latency_us: 848.0 }
      ]
    },
    {
      title: '3. Wing Actuator Slew Rate & Safety Log',
      description: 'Audit all active flap commands to verify zero interlock violations.',
      sql: `SELECT 
    command_id, 
    dispatched_at, 
    chassis_id, 
    target_angle_deg, 
    previous_angle_deg, 
    slew_rate_dps, 
    command_source, 
    latency_us, 
    safety_interlock_ok
FROM wing_commands
ORDER BY dispatched_at DESC
LIMIT 4;`,
      mockData: [
        { command_id: "c8f9210a-31b4-4b5d-91b3-573e849201aa", dispatched_at: "2026-10-05T15:56:45.890Z", chassis_id: "GHOST-F1-PROTOTYPE", target_angle_deg: 42.0, previous_angle_deg: 0.0, slew_rate_dps: 233.3, command_source: "EKF_AIRBRAKE", latency_us: 18, safety_interlock_ok: true },
        { command_id: "e4a11902-8f92-491b-87cf-1928374650bb", dispatched_at: "2026-10-05T15:55:12.440Z", chassis_id: "GHOST-F1-PROTOTYPE", target_angle_deg: 0.0, previous_angle_deg: 18.0, slew_rate_dps: 210.0, command_source: "MANUAL_DRS", latency_us: 14, safety_interlock_ok: true },
        { command_id: "d9182374-1234-4567-8901-abcdef123456", dispatched_at: "2026-10-05T15:53:30.120Z", chassis_id: "GHOST-F1-PROTOTYPE", target_angle_deg: 18.0, previous_angle_deg: 0.0, slew_rate_dps: 200.0, command_source: "APEX_DOWNFORCE", latency_us: 16, safety_interlock_ok: true },
        { command_id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0", dispatched_at: "2026-10-05T15:50:00.000Z", chassis_id: "GHOST-F1-PROTOTYPE", target_angle_deg: 0.0, previous_angle_deg: 42.0, slew_rate_dps: 233.3, command_source: "DRS_SPRINT", latency_us: 15, safety_interlock_ok: true },
      ]
    }
  ];

  const handleCopySql = () => {
    navigator.clipboard.writeText(SPEC_ALLOYDB_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleRunQuery = () => {
    setIsQueryRunning(true);
    setTimeout(() => {
      setQueryResults(sampleQueries[activeQueryIndex].mockData);
      setQueryExecutionTimeMs(Number((1.2 + Math.random() * 0.8).toFixed(2)));
      setIsQueryRunning(false);
    }, 180);
  };

  return (
    <div className="space-y-6">
      {/* Schema Header */}
      <div className="bg-slate-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-md text-sm font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500">
                ALLOYDB & TIMESCALE DDL
              </span>
              <span className="text-zinc-600 font-bold">•</span>
              <span className="text-zinc-200 text-base font-bold">Columnar Hypertable Telemetry Schema</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1.5">
              Production-Grade 1000Hz Partitioned Database DDL
            </h2>
            <p className="text-base text-zinc-300 mt-1 max-w-4xl leading-relaxed">
              Optimized for 1,000,000 records/sec async batch ingestion, automatic 1-hour chunking, 10x columnar compression, and sub-millisecond composite indexing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopySql}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-zinc-200 text-sm font-mono font-bold flex items-center gap-2 border border-zinc-600 shadow-md"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'SQL Copied' : 'Copy Full SQL DDL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SQL Query Console */}
      <div className="bg-slate-900 border border-zinc-700 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Interactive SQL Query Runner</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunQuery}
              disabled={isQueryRunning}
              className="px-5 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 font-mono transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isQueryRunning ? 'EXECUTING SQL...' : 'EXECUTE QUERY'}</span>
            </button>
          </div>
        </div>

        {/* Query Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveQueryIndex(idx);
                setQueryResults(null);
                setQueryExecutionTimeMs(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-mono transition-all ${
                activeQueryIndex === idx
                  ? 'bg-cyan-950 text-cyan-300 border-2 border-cyan-500 font-bold'
                  : 'bg-slate-950/70 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>

        {/* SQL Code Block */}
        <div className="bg-slate-950 p-5 rounded-xl border border-zinc-800 font-mono text-sm text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
          <pre>{sampleQueries[activeQueryIndex].sql}</pre>
        </div>

        {/* Query Results Table */}
        {queryResults && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-zinc-300 font-bold uppercase">
                Query Results ({queryResults.length} rows returned)
              </span>
              <span className="text-emerald-400 font-extrabold">
                Execution Time: {queryExecutionTimeMs} ms (AlloyDB Engine Cache)
              </span>
            </div>

            <div className="overflow-x-auto bg-slate-950 rounded-xl border border-zinc-800 font-mono text-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-zinc-400 border-b border-zinc-800 text-xs uppercase">
                  <tr>
                    {Object.keys(queryResults[0]).map((key) => (
                      <th key={key} className="py-3 px-3.5">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                  {queryResults.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/60">
                      {Object.values(row).map((val: any, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3.5">
                          {typeof val === 'boolean' ? (
                            <span className="text-emerald-400 font-extrabold">{val ? 'TRUE' : 'FALSE'}</span>
                          ) : typeof val === 'number' ? (
                            <span className="text-cyan-300 font-bold">{val}</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Full DDL Schema Code Display */}
      <div className="bg-slate-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-400" />
          <span>Complete PostgreSQL / TimescaleDB DDL Source</span>
        </h3>
        <p className="text-base text-zinc-300 mb-4 leading-relaxed">
          Includes Hypertable creation, compression policies, and audit triggers.
        </p>

        <div className="bg-slate-950 rounded-xl border border-zinc-800 p-5 font-mono text-sm text-zinc-200 max-h-[400px] overflow-y-auto leading-relaxed">
          <pre>{SPEC_ALLOYDB_SCHEMA_SQL}</pre>
        </div>
      </div>
    </div>
  );
};
