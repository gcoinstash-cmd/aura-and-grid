/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * AlloyDB / PostgreSQL 16 Normalized Schema Vault
 */

import React, { useState } from 'react';
import { ALLOYDB_SCHEMA_SQL } from '../data/alloydbSchema';
import { Database, Copy, Check, ShieldCheck, Table, Key, Layers } from 'lucide-react';

export const SqlSchemaVaultModal: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ALLOYDB_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const schemaTables = [
    { name: 'nexus_core.trading_instruments', desc: 'Master instrument metadata, tick sizes, circuit breaker bands' },
    { name: 'nexus_core.market_participants', desc: 'Broker-dealer MPID directory, risk limits, self-trade prevention flags' },
    { name: 'nexus_core.limit_orders_active', desc: 'Active resting L2/L3 order cache with price-time priority indices' },
    { name: 'nexus_core.trade_executions_ledger', desc: 'Daily range-partitioned financial execution ledger (Zero-RPO)' },
    { name: 'nexus_core.dark_pool_cross_logs', desc: 'Dark pool midpoint executions & price improvement audit history' },
    { name: 'nexus_core.nbbo_tick_snapshots', desc: 'High-frequency NBBO spread and microstructure toxicity (VPIN & Hawkes) ticks' },
    { name: 'nexus_core.regulatory_audit_trail', desc: 'Immutable trigger-driven regulatory audit logging' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 rounded-xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
            Database Architecture Vault
          </span>
          <h2 className="text-3xl font-black text-white mt-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            AlloyDB / PostgreSQL 16 DDL Specification
          </h2>
          <p className="text-slate-300 text-base mt-1 max-w-4xl">
            Normalized, daily range-partitioned financial ledger schema designed for zero RPO resilience, sub-millisecond index scans, and complete regulatory compliance audit logging.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base tracking-wide uppercase transition-all shadow-lg shadow-blue-950 cursor-pointer"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'SQL COPIED TO CLIPBOARD' : 'COPY ALLOYDB_SCHEMA.SQL'}</span>
        </button>
      </div>

      {/* Schema Table Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {schemaTables.map((t) => (
          <div key={t.name} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-sm font-bold text-blue-400 font-mono-numbers flex items-center gap-1.5">
              <Table className="w-4 h-4 text-slate-400" />
              {t.name}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {t.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Full Syntax Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-300 text-sm font-bold uppercase">
          <span className="flex items-center gap-2 font-mono-numbers">
            <Layers className="w-4 h-4 text-blue-400" /> ALLOYDB_SCHEMA.sql (PostgreSQL 16 High-Throughput DDL)
          </span>
          <span className="text-xs text-slate-400">7 Master Tables • Daily Partitioning • Pl/pgSQL Triggers</span>
        </div>
        <pre className="text-xs md:text-sm text-blue-200 font-mono-numbers overflow-x-auto p-4 bg-slate-950/90 rounded-lg border border-slate-800/80 max-h-[550px] leading-relaxed select-all">
          {ALLOYDB_SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
};
