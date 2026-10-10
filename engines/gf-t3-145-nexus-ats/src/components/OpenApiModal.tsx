/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * OpenAPI 3.1.0 High-Frequency Gateway Explorer
 */

import React, { useState } from 'react';
import { OPENAPI_SPEC_JSON } from '../data/openapiSpec';
import { Code2, Copy, Check, Terminal, Globe, Send, ShieldCheck, Zap } from 'lucide-react';

export const OpenApiModal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/order/submit');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(OPENAPI_SPEC_JSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const endpoints = [
    { path: '/api/v1/order/submit', method: 'POST', tag: 'Matching Core', desc: 'Submit Lit Limit/Market or Dark Midpoint Peg orders' },
    { path: '/api/v1/order/cancel', method: 'POST', tag: 'Matching Core', desc: 'Cancel resting order with O(1) pointer unlinking' },
    { path: '/api/v1/book/depth', method: 'GET', tag: 'Market Data', desc: 'Fetch top N depth levels and active NBBO spread' },
    { path: '/api/v1/dark/cross', method: 'POST', tag: 'Dark Pool', desc: 'Direct discretionary midpoint crossing evaluation' },
    { path: '/api/v1/telemetry/vpin-hawkes', method: 'GET', tag: 'Risk & Telemetry', desc: 'Real-time VPIN toxicity and Hawkes intensity meters' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/40 rounded-xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700/50">
            API Contract Specification
          </span>
          <h2 className="text-3xl font-black text-white mt-2 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-purple-400" />
            OpenAPI 3.1.0 High-Frequency Gateway
          </h2>
          <p className="text-slate-300 text-base mt-1 max-w-4xl">
            Complete, zero-placeholder REST/SBE interface contracts with RFC 7807 problem details, FIX 4.4 tag mappings, and idempotent microsecond sequence validation.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-base tracking-wide uppercase transition-all shadow-lg shadow-purple-950 cursor-pointer"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'JSON COPIED TO CLIPBOARD' : 'COPY OPENAPI_SPEC.JSON'}</span>
        </button>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {endpoints.map((ep) => (
          <button
            key={ep.path}
            onClick={() => setSelectedEndpoint(ep.path)}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedEndpoint === ep.path
                ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-lg shadow-purple-950'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black px-2 py-0.5 rounded font-mono-numbers ${
                ep.method === 'POST' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-blue-950 text-blue-300 border border-blue-700'
              }`}>
                {ep.method}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{ep.tag}</span>
            </div>
            <div className="text-xs font-bold font-mono-numbers text-white mt-2 truncate">
              {ep.path}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {ep.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive JSON Schema Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-300 text-sm font-bold uppercase">
          <span className="flex items-center gap-2 font-mono-numbers">
            <Globe className="w-4 h-4 text-purple-400" /> OPENAPI_SPEC.json (OpenAPI 3.1.0 Full Document)
          </span>
          <span className="text-xs text-slate-400">Strict RFC 7807 Error Models • SBE Compatibility</span>
        </div>
        <pre className="text-xs md:text-sm text-purple-200 font-mono-numbers overflow-x-auto p-4 bg-slate-950/90 rounded-lg border border-slate-800/80 max-h-[520px] leading-relaxed select-all">
          {JSON.stringify(OPENAPI_SPEC_JSON, null, 2)}
        </pre>
      </div>
    </div>
  );
};
