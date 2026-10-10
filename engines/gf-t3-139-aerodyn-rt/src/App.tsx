/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderHUD } from './components/HeaderHUD';
import { AeroSimulatorTab } from './components/AeroSimulatorTab';
import { OpenApiSandboxTab } from './components/OpenApiSandboxTab';
import { SpecificationExportTab } from './components/SpecificationExportTab';
import { ArchitecturalTopologyTab } from './components/ArchitecturalTopologyTab';
import { AlloyDbSchemaTab } from './components/AlloyDbSchemaTab';
import { MonopolyVaultTab } from './components/MonopolyVaultTab';
import { DeploymentDashboardTab } from './components/DeploymentDashboardTab';
import { AuditReportModal } from './components/AuditReportModal';
import { ShieldCheck, Cpu, HardDrive, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tab1_simulator');
  const [loopLatencyMs, setLoopLatencyMs] = useState<number>(0.78);
  const [sequenceId, setSequenceId] = useState<number>(942180);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Background monotonic sequence incrementer
  useEffect(() => {
    const timer = setInterval(() => {
      setSequenceId((prev) => prev + 1);
      setLoopLatencyMs(Number((0.77 + Math.random() * 0.03).toFixed(3)));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* HUD Header Bar */}
      <HeaderHUD
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loopLatencyMs={loopLatencyMs}
        sequenceId={sequenceId}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* Main Workstation Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'tab1_simulator' && <AeroSimulatorTab />}
        {activeTab === 'tab2_openapi' && <OpenApiSandboxTab />}
        {activeTab === 'tab3_specification' && <SpecificationExportTab />}
        {activeTab === 'tab4_topology' && <ArchitecturalTopologyTab />}
        {activeTab === 'tab5_alloydb' && <AlloyDbSchemaTab />}
        {activeTab === 'tab6_monopoly' && <MonopolyVaultTab />}
        {activeTab === 'tab7_deployment' && (
          <DeploymentDashboardTab onOpenAuditModal={() => setIsAuditModalOpen(true)} />
        )}
      </main>

      {/* Bottom Technical Status Bar */}
      <footer className="border-t border-zinc-800/80 bg-slate-950 px-4 lg:px-6 py-3 text-xs font-mono text-zinc-500 flex flex-wrap items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>ENGINE: <strong className="text-zinc-200">GF-T3-139</strong> (v3.1.0-PROD)</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>LINUX PREEMPT_RT 1000Hz TICK</span>
          </div>
          <span className="hidden md:inline text-zinc-700">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>ALLOYDB HYPERTABLE SYNC: OK</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ANTIGRAVITY AUTONOMOUS AGENT INGESTION READY</span>
          </div>
        </div>
      </footer>

      {/* Audit Report Modal */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
