/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code2, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Server, 
  Zap, 
  Terminal, 
  Sliders,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { OPENAPI_3_1_SPEC_JSON } from '../data/specData';
import { TrackedObject } from '../types/perception';

interface OpenApiSandboxTabProps {
  trackedObjects: TrackedObject[];
  frameSeq: number;
  loopLatencyMs: number;
}

export const OpenApiSandboxTab: React.FC<OpenApiSandboxTabProps> = ({
  trackedObjects,
  frameSeq,
  loopLatencyMs,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('POST_SWEEP');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  // Custom request body states
  const [sweepPayload, setSweepPayload] = useState(JSON.stringify({
    vehicle_id: "GHOST-F1-APOLLO",
    frame_seq: frameSeq || 1048576,
    timestamp_ns: Date.now() * 1000000,
    raw_point_count: 98304,
    lidar_beams: 64,
    format: "CARTESIAN_PACKED"
  }, null, 2));

  const [voxelQueryPayload, setVoxelQueryPayload] = useState(JSON.stringify({
    min_bound: { x: -10.0, y: 0.0, z: -2.0 },
    max_bound: { x: 20.0, y: 30.0, z: 4.0 },
    octree_resolution_m: 0.1,
    filter_occupancy_threshold: 0.5
  }, null, 2));

  const endpoints = [
    {
      id: 'POST_SWEEP',
      method: 'POST',
      path: '/v1/perception/sweep',
      title: 'Ingest 64-Beam LiDAR Sweep',
      desc: 'Streams 64-beam raw point cloud packet into POSIX shared memory ring.'
    },
    {
      id: 'GET_TRACKS',
      method: 'GET',
      path: '/v1/perception/tracks',
      title: 'Query Active 3D Tracked Objects',
      desc: 'Retrieves 11-D Kalman kinematic bounding boxes with velocity vectors.'
    },
    {
      id: 'GET_THREATS',
      method: 'GET',
      path: '/v1/perception/threats',
      title: 'Evaluate Critical Collision Hazards',
      desc: 'Retrieves instant TTC evaluation with emergency braking triggers.'
    },
    {
      id: 'GET_HEALTH',
      method: 'GET',
      path: '/v1/health',
      title: 'Perception Engine Health & Synchronicity',
      desc: 'Returns loop jitter, PTP drift, voxel occupancy, and AlloyDB write lag.'
    },
    {
      id: 'POST_VOXEL_QUERY',
      method: 'POST',
      path: '/v1/perception/voxel-grid/query',
      title: '3D Voxel Sub-Grid Spatial Range Query',
      desc: 'Queries sub-millisecond Morton-ordered Octree for dense obstacle bitmasks.'
    }
  ];

  const handleExecuteRequest = () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);

    const startTime = performance.now();

    setTimeout(() => {
      const endTime = performance.now();
      const latency = parseFloat((endTime - startTime + loopLatencyMs * 0.4).toFixed(2));
      setResponseLatency(latency);

      if (selectedEndpoint === 'POST_SWEEP') {
        let parsed = {};
        try { parsed = JSON.parse(sweepPayload); } catch (e) {}
        setResponseStatus(201);
        setResponseData({
          sweep_id: "c8e29a10-f19b-4b10-82a1-12509182bb14",
          timestamp_ns: Date.now() * 1000000,
          frame_seq: frameSeq,
          point_count: 98304,
          octree_voxel_nodes: 14280,
          detected_tracks_count: trackedObjects.length,
          p99_latency_ms: 7.34,
          zero_copy_shm_ring: "/dev/shm/voxeltrack_ingest_ring",
          status: "PROCESSED",
          critical_ttc_alert: trackedObjects.some(t => t.threatLevel === 'CRITICAL_COLLISION_IMMINENT')
        });
      } else if (selectedEndpoint === 'GET_TRACKS') {
        setResponseStatus(200);
        setResponseData({
          sweep_id: "c8e29a10-f19b-4b10-82a1-12509182bb14",
          timestamp_ns: Date.now() * 1000000,
          active_tracks_count: trackedObjects.length,
          tracks: trackedObjects.map(t => ({
            track_id: t.trackId,
            classification: t.classification,
            confidence: t.confidence,
            position: t.position,
            velocity: t.velocity,
            dimensions: t.dimensions,
            yaw_rad: t.yaw,
            ttc_seconds: t.ttcSeconds,
            threat_level: t.threatLevel,
            covariance_diag: t.covarianceDiagonal
          }))
        });
      } else if (selectedEndpoint === 'GET_THREATS') {
        const threats = trackedObjects.filter(t => t.ttcSeconds !== null && t.ttcSeconds <= 2.5);
        setResponseStatus(200);
        setResponseData({
          timestamp_ns: Date.now() * 1000000,
          alert_count: threats.length,
          threat_level: threats.some(t => t.threatLevel === 'CRITICAL_COLLISION_IMMINENT') ? "CRITICAL_COLLISION_IMMINENT" : "NOMINAL",
          emergency_brake_engaged: threats.some(t => t.threatLevel === 'CRITICAL_COLLISION_IMMINENT'),
          threats: threats.map(t => ({
            track_id: t.trackId,
            target_class: t.classification,
            distance_m: t.distance,
            ttc_seconds: t.ttcSeconds,
            relative_velocity_kmh: (Math.sqrt(t.velocity.vx * t.velocity.vx + t.velocity.vy * t.velocity.vy) * 3.6).toFixed(1),
            recommended_action: t.threatLevel === 'CRITICAL_COLLISION_IMMINENT' ? "AEB_FULL_FORCE_APPLY" : "PRE_CHARGE_BRAKES"
          }))
        });
      } else if (selectedEndpoint === 'GET_HEALTH') {
        setResponseStatus(200);
        setResponseData({
          status: "HEALTHY",
          engine_id: "GF-T3-140-VOXELTRACK",
          engine_version: "3.4.0-PROD-MONOPOLY",
          loop_frequency_hz: 125.04,
          p99_latency_ms: 7.38,
          synchronicity_drift_ms: 1.40,
          occupancy_util_pct: 34.2,
          alloydb_write_lag_ms: 2.1,
          memory_bandwidth_gbps: 118.4,
          packet_drop_rate: 0.00,
          zero_copy_ring_buffer_util: "18.6%",
          cpu_affinity: "CORES [2, 3, 4, 5, 6, 7, 8, 9] PINNED"
        });
      } else if (selectedEndpoint === 'POST_VOXEL_QUERY') {
        setResponseStatus(200);
        setResponseData({
          query_id: "qry-spatial-91823",
          bounding_box: { min: [-10, 0, -2], max: [20, 30, 4] },
          octree_depth: 8,
          occupied_voxel_count: 3120,
          free_voxel_count: 11160,
          execution_time_us: 142.6,
          spatial_hash_scheme: "MORTON_Z_ORDER_64BIT",
          dense_bitmask_sha256: "9f83ac02b9e110298a83cb9128038abce1982736"
        });
      }

      setIsLoading(false);
    }, 180);
  };

  const copyResponseText = () => {
    if (!responseData) return;
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const currentEp = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const curlCommand = currentEp.method === 'GET'
    ? `curl -X GET "https://edge-node.ghostfactory.internal${currentEp.path}" \\
  -H "Accept: application/json" \\
  -H "X-Engine-Key: GF_T3_SECRET_TOKEN"`
    : `curl -X POST "https://edge-node.ghostfactory.internal${currentEp.path}" \\
  -H "Content-Type: application/json" \\
  -d '${selectedEndpoint === 'POST_SWEEP' ? sweepPayload.replace(/\n/g, '') : voxelQueryPayload.replace(/\n/g, '')}'`;

  const copyCurlText = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-zinc-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              OpenAPI 3.1 Live Sandbox & Protocol Testing
            </h3>
            <p className="text-sm text-zinc-400 font-mono">
              Deterministic In-Memory Mock Engine • High-Frequency 125Hz Endpoints
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            SPEC: OAS 3.1.0
          </span>
          <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
            REST / gRPC READY
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Menu */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            AVAILABLE 125Hz ENDPOINTS
          </div>
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep.id);
                  setResponseData(null);
                  setResponseStatus(null);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-white'
                    : 'bg-slate-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      ep.method === 'POST' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-100">
                      {ep.path}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-medium text-zinc-300 mt-2">
                  {ep.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 font-mono">
                  {ep.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Request / Response Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-zinc-800 shadow-xl space-y-4">
            {/* Active Endpoint Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  currentEp.method === 'POST' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentEp.method}
                </span>
                <span className="font-mono text-base font-bold text-white">
                  https://edge-node.ghostfactory.internal{currentEp.path}
                </span>
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'EXECUTING...' : 'SEND REQUEST'}</span>
              </button>
            </div>

            {/* Request Body Editor if POST */}
            {currentEp.method === 'POST' && (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-bold">REQUEST BODY (JSON Schema Validated):</span>
                  <span className="text-[11px] text-cyan-400">Content-Type: application/json</span>
                </div>
                <textarea
                  value={selectedEndpoint === 'POST_SWEEP' ? sweepPayload : voxelQueryPayload}
                  onChange={(e) => {
                    if (selectedEndpoint === 'POST_SWEEP') setSweepPayload(e.target.value);
                    else setVoxelQueryPayload(e.target.value);
                  }}
                  rows={6}
                  className="w-full bg-slate-950 border border-zinc-800 rounded-lg p-3 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {/* Response Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-zinc-400 font-bold">RESPONSE PAYLOAD:</span>
                  {responseStatus && (
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                      responseStatus === 200 || responseStatus === 201 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-300'
                    }`}>
                      {responseStatus} {responseStatus === 201 ? 'CREATED' : 'OK'}
                    </span>
                  )}
                  {responseLatency !== null && (
                    <span className="text-zinc-400">
                      LATENCY: <span className="text-cyan-300 font-bold">{responseLatency} ms</span>
                    </span>
                  )}
                </div>

                {responseData && (
                  <button
                    onClick={copyResponseText}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded border border-zinc-800 transition-colors font-mono"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'COPIED' : 'COPY JSON'}</span>
                  </button>
                )}
              </div>

              {/* JSON Display */}
              <div className="bg-slate-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs overflow-x-auto min-h-[220px]">
                {responseData ? (
                  <pre className="text-emerald-300 whitespace-pre leading-relaxed">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Terminal className="w-8 h-8 text-zinc-700 animate-pulse" />
                    <p className="text-sm font-sans">
                      Click <strong className="text-cyan-400">"SEND REQUEST"</strong> above to execute the 125Hz perception call.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated cURL Command */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  cURL REPRODUCTION SNIPPET
                </span>
                <button
                  onClick={copyCurlText}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'COPIED' : 'COPY CURL'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{curlCommand}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
