/**
 * Ghost FactoryOS Track 3 (F1 Skunkworks Engine)
 * Asset GF-T3-147: Sol-Rotor Autonomous Heavy-Lift eVTOL & Swarm Flight Telemetry Engine
 * 
 * Swarm Topology & Reciprocal Velocity Obstacle (RVO) Collision Avoidance Radar HUD
 */

import React, { useState } from 'react';
import { SwarmState, FormationPattern } from '../../engine/swarmConsensus';
import { Radio, Users, ShieldAlert, Cpu, Share2, Layers, Compass, ArrowUpRight } from 'lucide-react';

interface SwarmRadarHUDProps {
  swarm: SwarmState;
  onSelectFormation: (pattern: FormationPattern) => void;
  onUpdateSpacing: (spacingM: number) => void;
  onUpdatePeerCount: (count: number) => void;
}

export const SwarmRadarHUD: React.FC<SwarmRadarHUDProps> = ({
  swarm,
  onSelectFormation,
  onUpdateSpacing,
  onUpdatePeerCount,
}) => {
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(swarm.peers[0]?.airframeId || null);

  const radarScale = 1.6; // pixels per meter
  const radarCenterPx = 220; // radar canvas center

  const formations: { id: FormationPattern; label: string; desc: string }[] = [
    { id: 'TACTICAL_DIAMOND', label: 'Tactical Diamond', desc: 'Low aerodynamic drag escort formation' },
    { id: 'V_STAGGER', label: 'V-Stagger Ladder', desc: 'Stepped wake-vortex reduction ladder' },
    { id: 'CARGO_SLING_TETHER', label: 'Heavy Cargo Multi-Lift', desc: 'Distributed tether sling formation for 5+ ton loads' },
    { id: 'PERIMETER_RING', label: 'Perimeter Defense Ring', desc: '360° situational radar perimeter ring' },
    { id: 'TRAIL_CONVOY', label: 'In-Trail Corridor', desc: 'High-speed autonomous freight corridor' },
  ];

  const selectedPeer = swarm.peers.find(p => p.airframeId === selectedPeerId) || swarm.peers[0];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Swarm Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md">
        <div>
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" /> ACTIVE SWARM FLEET
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            {swarm.activePeerCount} <span className="text-base text-slate-400 font-normal">Airframes</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" /> MESH LINK LATENCY
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {swarm.meanLinkLatencyMs.toFixed(2)} <span className="text-base text-slate-400 font-normal">ms</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" /> GRAPH CONNECTIVITY (λ₂)
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            {swarm.algebraicConnectivityLambda2.toFixed(3)} <span className="text-base text-emerald-400 font-normal">(Quorum)</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-cyan-400" /> FORMATION RMS ERROR
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            {swarm.formationErrorRmsM.toFixed(2)} <span className="text-base text-slate-400 font-normal">m</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> RVO COLLISION RISK
          </span>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${
            swarm.collisionWarningCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
          }`}>
            {swarm.collisionWarningCount === 0 ? '0 HAZARDS' : `${swarm.collisionWarningCount} CONFLICTS`}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tactical Radar HUD, Right Peer Telemetry & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tactical 2D Radar HUD */}
        <div className="lg:col-span-6 bg-slate-950 border-2 border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold font-avionics text-white">
                TACTICAL SWARM MESH RADAR (RVO CONES)
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded">
              RANGE: 120M RADIUS
            </span>
          </div>

          {/* Radar Screen Area */}
          <div className="relative w-[440px] h-[440px] rounded-full border-2 border-cyan-500/50 bg-slate-950/90 shadow-inner flex items-center justify-center overflow-hidden radar-grid">
            
            {/* Concentric Range Rings */}
            <div className="absolute w-[100px] h-[100px] rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-500/30 pointer-events-none" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/40 pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/30 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/30 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-cyan-500/30 pointer-events-none" />

            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-spin duration-3000 pointer-events-none" />

            {/* Mesh Link Interconnect Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {swarm.peers.map((peer, idx) => {
                if (idx === 0) return null;
                const egoX = radarCenterPx;
                const egoY = radarCenterPx;
                const px = radarCenterPx + peer.positionRelM.y * radarScale;
                const py = radarCenterPx - peer.positionRelM.x * radarScale;

                return (
                  <line
                    key={`line-${peer.airframeId}`}
                    x1={egoX}
                    y1={egoY}
                    x2={px}
                    y2={py}
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {/* Swarm Peers on Radar */}
            {swarm.peers.map((peer, idx) => {
              const isEgo = idx === 0;
              const px = radarCenterPx + peer.positionRelM.y * radarScale;
              const py = radarCenterPx - peer.positionRelM.x * radarScale;
              const isSelected = selectedPeerId === peer.airframeId;

              return (
                <div
                  key={peer.airframeId}
                  onClick={() => setSelectedPeerId(peer.airframeId)}
                  className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all group z-10 flex flex-col items-center`}
                  style={{ left: `${px}px`, top: `${py}px` }}
                >
                  {/* Safety Separation Bubble (18m) */}
                  <div
                    className={`absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${
                      peer.collisionRiskLevel === 'CRITICAL'
                        ? 'border-2 border-rose-500 bg-rose-500/20 animate-ping'
                        : peer.collisionRiskLevel === 'WARNING'
                        ? 'border border-amber-500/80 bg-amber-500/10'
                        : 'border border-cyan-500/20'
                    }`}
                    style={{ width: `${18 * radarScale * 2}px`, height: `${18 * radarScale * 2}px` }}
                  />

                  {/* Airframe Icon Marker */}
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs transition-all shadow-lg ${
                    isEgo
                      ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/40'
                      : isSelected
                      ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/40 scale-125'
                      : peer.collisionRiskLevel === 'CRITICAL'
                      ? 'bg-rose-500 text-white animate-bounce'
                      : 'bg-slate-800 text-cyan-300 border border-cyan-500/60'
                  }`}>
                    {idx === 0 ? '★' : idx}
                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-mono text-cyan-200 mt-1 bg-slate-950/90 px-1 rounded border border-cyan-500/40 whitespace-nowrap">
                    {peer.airframeId}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-6 mt-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-cyan-400 rounded-sm" /> Ego Leader (#147)
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-slate-800 border border-cyan-400 rounded-sm" /> Swarm Peers
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-500 rounded-sm" /> RVO Collision Threat
            </span>
          </div>
        </div>

        {/* Swarm Controls & Peer Detail Panel */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* Formation Pattern Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
            <h4 className="text-xl font-bold font-avionics text-white flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-cyan-400" />
              DISTRIBUTED FORMATION PROTOCOL
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {formations.map(f => {
                const isActive = swarm.formationPattern === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onSelectFormation(f.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-avionics font-bold text-base flex justify-between items-center">
                      <span>{f.label}</span>
                      {isActive && <span className="text-xs bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Sliders: Spacing & Peer Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-300">INTER-VEHICLE SPACING:</span>
                  <span className="font-mono text-cyan-400">{swarm.targetSeparationM} METERS</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="90"
                  step="5"
                  value={swarm.targetSeparationM}
                  onChange={(e) => onUpdateSpacing(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-300">SWARM AIRFRAME COUNT:</span>
                  <span className="font-mono text-cyan-400">{swarm.activePeerCount} AIRFRAMES</span>
                </div>
                <div className="flex gap-2">
                  {[4, 8, 12, 16].map(count => (
                    <button
                      key={count}
                      onClick={() => onUpdatePeerCount(count)}
                      className={`flex-1 py-1 text-sm font-mono font-bold rounded border transition-all ${
                        swarm.activePeerCount === count
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Peer Inspector Card */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">INSPECTED AIRFRAME</span>
                <h4 className="text-2xl font-bold font-avionics text-white mt-0.5">
                  {selectedPeer.callsign} ({selectedPeer.airframeId})
                </h4>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                selectedPeer.collisionRiskLevel === 'SAFE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950 text-rose-300 border border-rose-500'
              }`}>
                {selectedPeer.role} • {selectedPeer.collisionRiskLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-sm mb-3">
              <div>
                <span className="text-slate-400 text-xs block">DISTANCE TO EGO:</span>
                <span className="text-lg font-bold text-white">{selectedPeer.separationDistanceM.toFixed(1)} m</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">MESH SNR:</span>
                <span className="text-lg font-bold text-emerald-400">{selectedPeer.meshLinkSnrDb.toFixed(1)} dB</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">PACKET LATENCY:</span>
                <span className="text-lg font-bold text-cyan-300">{selectedPeer.linkLatencyMs.toFixed(2)} ms</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">BATTERY SOC:</span>
                <span className="text-lg font-bold text-amber-400">{selectedPeer.batterySocPct.toFixed(1)} %</span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400 flex justify-between items-center bg-slate-950/40 px-3 py-2 rounded">
              <span>TARGET SLOT RELATIVE OFFSET:</span>
              <span className="text-cyan-300">
                X: {selectedPeer.targetSlotM.x.toFixed(1)}m | Y: {selectedPeer.targetSlotM.y.toFixed(1)}m | Z: {selectedPeer.targetSlotM.z.toFixed(1)}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swarm Full Telemetry Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl overflow-x-auto">
        <h4 className="text-xl font-bold font-avionics text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          SWARM FLEET CONSENSUS REGISTRY
        </h4>

        <table className="w-full text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
              <th className="pb-2">AIRFRAME ID</th>
              <th className="pb-2">CALLSIGN</th>
              <th className="pb-2">ROLE</th>
              <th className="pb-2">POS REL (X, Y, Z)</th>
              <th className="pb-2">SEPARATION</th>
              <th className="pb-2">MESH SNR</th>
              <th className="pb-2">LATENCY</th>
              <th className="pb-2">BATTERY</th>
              <th className="pb-2">RVO STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {swarm.peers.map((p, idx) => (
              <tr
                key={p.airframeId}
                onClick={() => setSelectedPeerId(p.airframeId)}
                className={`cursor-pointer hover:bg-slate-800/50 transition-colors ${
                  selectedPeerId === p.airframeId ? 'bg-cyan-950/30' : ''
                }`}
              >
                <td className="py-2.5 font-bold text-cyan-300">{p.airframeId}</td>
                <td className="py-2.5 text-white">{p.callsign}</td>
                <td className="py-2.5 text-slate-300">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    idx === 0 ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {p.role}
                  </span>
                </td>
                <td className="py-2.5 text-slate-300">
                  {p.positionRelM.x.toFixed(1)}, {p.positionRelM.y.toFixed(1)}, {p.positionRelM.z.toFixed(1)} m
                </td>
                <td className="py-2.5 font-bold text-white">{p.separationDistanceM.toFixed(1)} m</td>
                <td className="py-2.5 text-emerald-400">{p.meshLinkSnrDb.toFixed(1)} dB</td>
                <td className="py-2.5 text-cyan-400">{p.linkLatencyMs.toFixed(2)} ms</td>
                <td className="py-2.5 text-amber-400">{p.batterySocPct.toFixed(0)}%</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    p.collisionRiskLevel === 'SAFE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500'
                  }`}>
                    {p.collisionRiskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
