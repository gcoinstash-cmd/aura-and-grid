/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Zero-Placeholder Engine Specification (70% Workload Deliverable)
 */

import React, { useState } from 'react';
import { ENGINE_SPEC_MD } from '../data/engineSpecMarkdown';
import { FileCode, Copy, Check, Terminal, Shield, Zap, Sparkles } from 'lucide-react';

export const FullSpecModal: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ENGINE_SPEC_MD);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/40 rounded-xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700/50 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> 70% Skunkworks Workload Blueprint
          </span>
          <h2 className="text-3xl font-black text-white mt-2 flex items-center gap-3">
            <FileCode className="w-8 h-8 text-rose-400" />
            ENGINE_SPEC_T3_NEXUS.md (Monopoly Vault Spec)
          </h2>
          <p className="text-slate-300 text-base mt-1 max-w-4xl">
            Comprehensive, zero-placeholder reference engine architecture satisfying all 5 Monopoly Vault Criteria. Structured for autonomous Google Antigravity agent code ingestion.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-base tracking-wide uppercase transition-all shadow-lg shadow-rose-950 cursor-pointer"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'SPEC COPIED' : 'COPY ENGINE_SPEC.MD'}</span>
        </button>
      </div>

      {/* Raw Specification Document Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-300 text-sm font-bold uppercase">
          <span className="flex items-center gap-2 font-mono-numbers">
            <Terminal className="w-4 h-4 text-rose-400" /> ENGINE_SPEC_T3_NEXUS.md Complete Markdown
          </span>
          <span className="text-xs text-slate-400 font-mono-numbers">Track 3 F1 Skunkworks Engine Specification</span>
        </div>
        <pre className="text-xs md:text-sm text-rose-200 font-mono-numbers overflow-x-auto p-4 bg-slate-950/90 rounded-lg border border-slate-800/80 max-h-[600px] leading-relaxed select-all whitespace-pre-wrap">
          {ENGINE_SPEC_MD}
        </pre>
      </div>
    </div>
  );
};
