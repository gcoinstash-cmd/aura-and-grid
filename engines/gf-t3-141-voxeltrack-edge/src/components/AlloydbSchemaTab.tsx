/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Play, 
  Table, 
  Layers, 
  Sparkles, 
  Terminal, 
  Code2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ALLOYDB_SCHEMA_SQL } from '../data/specData';

export const AlloydbSchemaTab: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [queryRunning, setQueryRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<any>(null);

  const sampleQueries = [
    {
      title: '1. Query Critical Collision Alerts (TTC ≤ 1.20s)',
      desc: 'Retrieves all immediate emergency braking triggers indexed by PostGIS 3D & TTC.',
      sql: `SELECT 
    ca.alert_id,
    ca.track_id,
    do.classification,
    ca.ttc_seconds,
    ca.relative_speed_kmh,
    ca.ego_brake_pressure_pct,
    ca.threat_status,
    ca.recorded_at
FROM collision_alerts ca
JOIN detected_objects do ON ca.object_id = do.object_id
WHERE ca.ttc_seconds <= 1.200
ORDER BY ca.recorded_at DESC
LIMIT 5;`,
      mockResult: [
        {
          alert_id: "a810f19b-4b10-82a1-1250-9182bb140001",
          track_id: "TRK-9821",
          classification: "PEDESTRIAN",
          ttc_seconds: "1.140",
          relative_speed_kmh: "18.40",
          ego_brake_pressure_pct: "100.00",
          threat_status: "CRITICAL_COLLISION_IMMINENT",
          recorded_at: "2026-10-05 16:47:45.124-07"
        },
        {
          alert_id: "a810f19b-4b10-82a1-1250-9182bb140002",
          track_id: "TRK-9818",
          classification: "CYCLIST",
          ttc_seconds: "1.190",
          relative_speed_kmh: "24.60",
          ego_brake_pressure_pct: "100.00",
          threat_status: "CRITICAL_COLLISION_IMMINENT",
          recorded_at: "2026-10-05 16:47:43.882-07"
        }
      ]
    },
    {
      title: '2. Spatial 3D Bounding Range Query (PostGIS GIST)',
      desc: 'Executes 3D bounding box spatial query within 25 meters of ego vehicle.',
      sql: `SELECT 
    track_id,
    classification,
    pos_x,
    pos_y,
    pos_z,
    confidence,
    ST_AsText(geom_pos) as wkt_3d_point
FROM detected_objects
WHERE geom_pos &&& ST_MakeEnvelope3D(-25, 0, -2, 25, 50, 4, 4326)
ORDER BY confidence DESC
LIMIT 4;`,
      mockResult: [
        {
          track_id: "TRK-9821",
          classification: "PEDESTRIAN",
          pos_x: "12.400",
          pos_y: "2.100",
          pos_z: "-0.400",
          confidence: "0.984",
          wkt_3d_point: "POINT Z(12.4 2.1 -0.4)"
        },
        {
          track_id: "TRK-9815",
          classification: "VEHICLE",
          pos_x: "-4.200",
          pos_y: "28.500",
          pos_z: "0.200",
          confidence: "0.996",
          wkt_3d_point: "POINT Z(-4.2 28.5 0.2)"
        },
        {
          track_id: "TRK-9819",
          classification: "CYCLIST",
          pos_x: "8.600",
          pos_y: "14.200",
          pos_z: "-0.100",
          confidence: "0.971",
          wkt_3d_point: "POINT Z(8.6 14.2 -0.1)"
        }
      ]
    },
    {
      title: '3. 125Hz Perception Ingest Latency Aggregation',
      desc: 'Analyzes P99 latency percentiles and zero-drop reliability over the latest partition.',
      sql: `SELECT 
    date_trunc('minute', created_at) AS minute_window,
    count(*) AS total_sweeps,
    round(avg(sweep_duration_ms), 3) AS avg_duration_ms,
    percentile_cont(0.99) WITHIN GROUP (ORDER BY p99_latency_ms) AS p99_latency_ms,
    round(avg(sensor_sync_drift_ms), 2) AS avg_drift_ms
FROM perception_sweeps
GROUP BY 1
ORDER BY 1 DESC
LIMIT 5;`,
      mockResult: [
        {
          minute_window: "2026-10-05 16:47:00-07",
          total_sweeps: "7500",
          avg_duration_ms: "7.342",
          p99_latency_ms: "7.380",
          avg_drift_ms: "1.40"
        },
        {
          minute_window: "2026-10-05 16:46:00-07",
          total_sweeps: "7500",
          avg_duration_ms: "7.338",
          p99_latency_ms: "7.390",
          avg_drift_ms: "1.38"
        }
      ]
    }
  ];

  const copySql = () => {
    navigator.clipboard.writeText(ALLOYDB_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSelectedQuery = () => {
    setQueryRunning(true);
    setQueryResult(null);
    setTimeout(() => {
      setQueryResult(sampleQueries[activeQueryIndex].mockResult);
      setQueryRunning(false);
    }, 220);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-zinc-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Google Cloud AlloyDB & PostgreSQL 16 DDL Schema
            </h3>
            <p className="text-sm text-zinc-400 font-mono">
              Partitioned High-Frequency Tables • PostGIS 3D Spatial Indices • Instant Threat Triggers
            </p>
          </div>
        </div>
        <button
          onClick={copySql}
          className="px-4 py-2 rounded-lg bg-slate-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED DDL' : 'COPY FULL DDL (.SQL)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 6 Cols: SQL DDL Viewer */}
        <div className="xl:col-span-6 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                ALLOYDB_SCHEMA_GF_T3_140.sql
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                POSTGRESQL 16 / POSTGIS 3.4
              </span>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-zinc-800/80 font-mono text-xs overflow-x-auto max-h-[520px] overflow-y-auto">
              <pre className="text-cyan-200/90 whitespace-pre leading-relaxed">
                {ALLOYDB_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Interactive SQL Query Sandbox */}
        <div className="xl:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-base font-bold text-white">
                  Interactive Spatial SQL Query Sandbox
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ALLOYDB ENGINE ATTACHED
              </span>
            </div>

            {/* Query Selector Tabs */}
            <div className="space-y-2">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveQueryIndex(idx);
                    setQueryResult(null);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left font-mono text-xs transition-all ${
                    activeQueryIndex === idx
                      ? 'bg-slate-950 border-cyan-500/60 text-white shadow-sm'
                      : 'bg-slate-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-slate-200">{q.title}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{q.desc}</div>
                </button>
              ))}
            </div>

            {/* Selected SQL Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400">
                  SQL QUERY STATEMENT:
                </span>
                <button
                  onClick={runSelectedQuery}
                  disabled={queryRunning}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${queryRunning ? 'animate-spin' : ''}`} />
                  <span>{queryRunning ? 'EXECUTING...' : 'RUN QUERY'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-zinc-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>{sampleQueries[activeQueryIndex].sql}</pre>
              </div>
            </div>

            {/* Query Execution Output Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">
                QUERY RESULT (JSON / RECORD SET):
              </span>
              <div className="p-3 rounded-lg bg-slate-950 border border-zinc-800 font-mono text-xs overflow-x-auto min-h-[160px]">
                {queryResult ? (
                  <pre className="text-cyan-300 whitespace-pre">
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-28 flex flex-col items-center justify-center text-zinc-500 space-y-1">
                    <Table className="w-6 h-6 text-zinc-700" />
                    <p className="text-xs font-sans">
                      Click <strong className="text-emerald-400">"RUN QUERY"</strong> above to execute on AlloyDB PostGIS.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
