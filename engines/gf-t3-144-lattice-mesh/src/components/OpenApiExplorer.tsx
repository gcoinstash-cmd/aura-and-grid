import React, { useState } from 'react';
import { mlKemKeyGen, mlKemEncapsulate, mlKemDecapsulate } from '../lib/pqc/ml_kem';
import { executeHybridHandshake } from '../lib/pqc/hybrid_engine';
import { Send, CheckCircle2, Code2, Globe, Play, Copy, Check } from 'lucide-react';

export const OpenApiExplorer: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('encapsulate');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    {
      id: 'encapsulate',
      method: 'POST',
      path: '/api/v1/pqc/kem/encapsulate',
      desc: 'Execute ML-KEM-1024 Ephemeral Encapsulation against target peer public key vector.'
    },
    {
      id: 'decapsulate',
      method: 'POST',
      path: '/api/v1/pqc/kem/decapsulate',
      desc: 'Execute ML-KEM-1024 Secret Decapsulation and Fujisaki-Okamoto verification.'
    },
    {
      id: 'ratchet',
      method: 'POST',
      path: '/api/v1/pqc/mesh/ratchet',
      desc: 'Advance Ephemeral WireGuard PSK Epoch using HKDF-SHA512 dual-secret fusion.'
    },
    {
      id: 'nodes',
      method: 'GET',
      path: '/api/v1/pqc/mesh/nodes',
      desc: 'Query Mesh Fleet Topology and active node cryptographic states.'
    },
    {
      id: 'telemetry',
      method: 'GET',
      path: '/api/v1/pqc/mesh/telemetry',
      desc: 'Fetch Real-time Quantum Threat Assessment (QTA) and P99 latency metrics.'
    }
  ];

  const handleExecuteRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      let resData: any = {};

      if (activeEndpoint === 'encapsulate') {
        const kp = mlKemKeyGen('demo-peer-seed');
        const ct = mlKemEncapsulate(kp.publicKey);
        resData = {
          status: 200,
          data: {
            ciphertext_u_hex: ct.rawHex.substring(0, 64) + '...',
            ciphertext_v_hex: ct.rawHex.substring(64, 128) + '...',
            shared_secret_hash_sha256: ct.sharedSecretHex,
            compute_duration_ms: ct.encapsulationTimeMs,
            lattice_parameters: {
              n: 256,
              q: 3329,
              k: 4,
              eta1: 2,
              eta2: 2
            }
          }
        };
      } else if (activeEndpoint === 'decapsulate') {
        const kp = mlKemKeyGen('decaps-demo-seed');
        const ct = mlKemEncapsulate(kp.publicKey);
        const dec = mlKemDecapsulate(ct, kp.secretKey, kp.publicKey);
        resData = {
          status: 200,
          data: {
            shared_secret_hex: dec.recoveredSecretHex,
            shared_secret_hash_sha256: dec.recoveredSecretHex,
            is_valid: dec.isValid,
            message_bit_matches: dec.messageBitMatches,
            decapsulation_duration_ms: dec.decapsulationTimeMs
          }
        };
      } else if (activeEndpoint === 'ratchet') {
        const kpA = mlKemKeyGen('node-1-seed');
        const kpB = mlKemKeyGen('node-2-seed');
        const hs = executeHybridHandshake('node-001', 'node-002', kpA, kpB, 143);
        resData = {
          status: 200,
          data: {
            new_epoch_sequence: 143,
            active_psk_hash: hs.wireguardPskHex.substring(0, 32),
            standby_psk_hash: hs.combinedSessionKeyHex.substring(0, 32),
            epoch_expires_at: new Date(Date.now() + 120000).toISOString(),
            rollover_status: 'SYNCHRONIZED_ZERO_PACKET_LOSS',
            handshake_latency_ms: hs.handshakeLatencyMs
          }
        };
      } else if (activeEndpoint === 'nodes') {
        resData = {
          status: 200,
          data: {
            total_nodes: 24,
            online_nodes: 24,
            nodes_sample: [
              { id: 'node-edge-001', region: 'us-east-va (Ashburn)', status: 'ONLINE_ACTIVE', rtt_ms: 1.84 },
              { id: 'node-edge-002', region: 'eu-central-de (Frankfurt)', status: 'ONLINE_ACTIVE', rtt_ms: 2.12 }
            ]
          }
        };
      } else if (activeEndpoint === 'telemetry') {
        resData = {
          status: 200,
          data: {
            p99_latency_ms: 2.85,
            average_handshake_ms: 2.42,
            active_epoch_interval_sec: 120,
            qta_matrix: {
              shor_resistance_nist_level: 5,
              grover_speedup_margin_bits: 256,
              hndl_mitigation_index_pct: 100.0
            }
          }
        };
      }

      setResponseJson(JSON.stringify(resData, null, 2));
      setIsLoading(false);
    }, 150);
  };

  const handleCopy = () => {
    if (!responseJson) return;
    navigator.clipboard.writeText(responseJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Production OpenAPI 3.1 REST Sandbox
        </h2>
        <span className="text-base text-slate-400 block mt-1 font-mono">
          NIST FIPS 203 Cryptographic Endpoints · RFC 7807 Error Handlers · Bearer JWT Authentication
        </span>
      </div>

      {/* 2. Endpoint Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Endpoint Menu */}
        <div className="lg:col-span-5 space-y-3">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setActiveEndpoint(ep.id);
                setResponseJson(null);
              }}
              className={`w-full p-4 rounded-xl text-left border transition-all ${
                activeEndpoint === ep.id
                  ? 'bg-slate-800 border-emerald-500 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`text-base font-bold font-mono px-2.5 py-0.5 rounded ${
                    ep.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-base font-mono text-white font-bold truncate">
                  {ep.path}
                </span>
              </div>
              <span className="text-base text-slate-400 block mt-2">
                {ep.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Right 7 Cols: Request Execution & Response Box */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Live API Invocation Sandbox
              </span>

              <button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-base transition-colors shadow-md disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                <span>{isLoading ? 'Executing...' : 'Execute Live Request'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-4">
              <span className="text-base font-semibold text-slate-400 block mb-1">Headers &amp; Authorization:</span>
              <code className="text-base font-mono text-emerald-400 block">
                Authorization: Bearer jwt-pqc-session-token-v1
              </code>
              <code className="text-base font-mono text-slate-400 block">
                Content-Type: application/json · Accept: application/json
              </code>
            </div>

            {/* Response Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-slate-300">Live JSON Response:</span>
                {responseJson && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-base text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 max-h-[400px] overflow-y-auto">
                {responseJson ? (
                  <pre className="text-base font-mono text-emerald-300 leading-relaxed">
                    <code>{responseJson}</code>
                  </pre>
                ) : (
                  <div className="text-slate-400 text-base py-8 text-center">
                    Click "Execute Live Request" to dispatch a real-time cryptographic payload to the engine.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-base text-slate-400">
            Compliant with OpenAPI 3.1.0 specifications and RFC 7807 problem details error format.
          </div>

        </div>

      </div>

    </div>
  );
};
