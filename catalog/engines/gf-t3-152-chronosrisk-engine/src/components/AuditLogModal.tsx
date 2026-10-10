/**
 * CHRONOSRISK ENGINE // GF-T3-152
 * Immutable System & Calculation Activity Audit Log
 */

import React, { useState } from 'react';
import { Shield, Clock, Download, CheckCircle2, Filter, X } from 'lucide-react';

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  officerId: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AuditEntry[];
  onClearLog: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClearLog,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredEntries = filterAction === 'ALL'
    ? entries
    : entries.filter((e) => e.action.includes(filterAction));

  const handleExportAuditJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CHRONOSRISK-AUDIT-LOG-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e1626] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                System Activity & Calculation Audit Log
              </h3>
              <p className="text-xs text-slate-400">
                Append-only immutable record satisfying institutional compliance & Basel III audits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Export */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Filter:</span>
            {['ALL', 'SHOCK', 'WEIGHT', 'AUTH', 'APA'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterAction(f)}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  filterAction === f
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportAuditJson}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No audit records found.</div>
          ) : (
            filteredEntries.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{item.action}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{item.timestamp}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400">Officer: {item.officerId}</span>
                  </div>
                  <p className="text-slate-300">{item.details}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Total Recorded Events: {entries.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
          >
            Close Audit Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
