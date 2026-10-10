/**
 * Vanguard-ECLSS: AlloyDB / PostgreSQL 16 Normalized Database DDL Schema View
 * Upgraded Font Floor & High-Legibility Typography
 */

import React, { useState } from 'react';
import { Database, Copy, Check, Server, Shield, Layers, Table } from 'lucide-react';
import { ALLOYDB_SCHEMA_SQL } from '../../artifacts/alloydbSchema';

export const DatabaseSchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(ALLOYDB_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-cyan-400" />
            CLOUD-SCALE ALLOYDB / POSTGRESQL 16 SCHEMA
          </h2>
          <p className="text-base text-slate-300 font-medium mt-1">
            Zero-RPO immutable telemetry logging, time-series range partitioning, and trigger-enforced audit ledger.
          </p>
        </div>

        <button
          onClick={handleCopySql}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-base font-bold font-mono transition cursor-pointer shadow-md"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'SQL COPIED TO CLIPBOARD' : 'COPY ALLOYDB_SCHEMA.SQL'}</span>
        </button>
      </div>

      {/* Schema Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-base">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
            <Layers className="w-5 h-5" />
            <span>TIME-SERIES PARTITIONING</span>
          </div>
          <p className="text-sm text-slate-300">
            Monthly partitioned tables (<code className="text-cyan-300 font-semibold">atmospheric_telemetry_logs</code>) with range keys on UTC timestamps for high ingestion throughput.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
            <Shield className="w-5 h-5" />
            <span>ZERO-RPO AUDIT LEDGER</span>
          </div>
          <p className="text-sm text-slate-300">
            Security Definer trigger functions capture before/after delta JSON for all actuator commands and reserve modifications in <code className="text-emerald-300 font-semibold">system_audit_ledger</code>.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-purple-400 font-bold text-lg">
            <Table className="w-5 h-5" />
            <span>STRICT INTEGRITY CONSTRAINTS</span>
          </div>
          <p className="text-sm text-slate-300">
            Numeric boundaries enforced at DDL level: total pressure (0-150 kPa), ppO2 (0-50 kPa), ppCO2 (&lt;10 kPa), and SHA-256 firmware verification.
          </p>
        </div>
      </div>

      {/* Interactive SQL Code Browser */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-base font-bold text-white">ALLOYDB_SCHEMA.sql (PostgreSQL 16 Enterprise DDL)</span>
          </div>
          <span className="text-sm font-mono text-slate-400">220 lines · UTF-8</span>
        </div>

        <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-sm sm:text-base text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed select-all">
          {ALLOYDB_SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
};
