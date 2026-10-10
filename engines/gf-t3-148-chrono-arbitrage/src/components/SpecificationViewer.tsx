import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Search } from 'lucide-react';

interface Props {
  specMarkdown: string;
}

export const SpecificationViewer: React.FC<Props> = ({ specMarkdown }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'math' | 'python' | 'sql' | 'openapi' | 'docker' | 'tests'>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(specMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([specMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ENGINE_SPEC.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions Bar */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">ENGINE_SPEC.md</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-200 font-bold border border-zinc-700">
                MONOLITHIC ZERO-PLACEHOLDER
              </span>
            </div>
            <span className="text-zinc-300 text-xs font-medium">
              T3-QUANT-02: Chrono-Arbitrage Institutional Blueprint
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-100 font-bold transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SPEC'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD .MD</span>
          </button>
        </div>
      </div>

      {/* Filter / Quick Jump Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 p-3 rounded-lg border border-zinc-800 font-mono text-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'all' ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            Full Document
          </button>
          <button
            onClick={() => setActiveSection('math')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'math' ? 'bg-zinc-800 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            1. Math &amp; -ln(R) Derivation
          </button>
          <button
            onClick={() => setActiveSection('python')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'python' ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            2. Python Solver Engine
          </button>
          <button
            onClick={() => setActiveSection('sql')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'sql' ? 'bg-zinc-800 text-violet-300 border border-violet-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            3. AlloyDB / Postgres DDL
          </button>
          <button
            onClick={() => setActiveSection('openapi')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'openapi' ? 'bg-zinc-800 text-pink-300 border border-pink-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            4. OpenAPI 3.1 &amp; WS
          </button>
          <button
            onClick={() => setActiveSection('docker')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'docker' ? 'bg-zinc-800 text-blue-300 border border-blue-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            5. Docker &amp; Cloud Run
          </button>
          <button
            onClick={() => setActiveSection('tests')}
            className={`px-3 py-1.5 rounded transition font-bold ${
              activeSection === 'tests' ? 'bg-zinc-800 text-emerald-300 border border-emerald-500/30' : 'text-zinc-300 hover:text-white'
            }`}
          >
            6. PyTest Suite (&gt;85%)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search keywords in spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Main Spec Content Block */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-zinc-100 overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500/30">
        {specMarkdown}
      </div>
    </div>
  );
};
