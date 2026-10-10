/**
 * Distributed Lattice-Mesh Edge Fleet Network Simulator
 * Supports 12 to 64 active edge peers with real-time telemetry,
 * P99 hybrid KEM latency tracking, Quantum Threat Assessment Matrix,
 * and dynamic lattice noise vector injection.
 */

import { mlKemKeyGen, MLKEM1024KeyPair } from '../pqc/ml_kem';
import { executeHybridHandshake, HybridHandshakeResult } from '../pqc/hybrid_engine';

export interface MeshNode {
  id: string;
  name: string;
  region: string;
  ipAddress: string;
  wireguardInterface: string;
  status: 'ONLINE_ACTIVE' | 'SYNCHRONIZING' | 'RE-KEYING' | 'MAINTENANCE';
  keyPair: MLKEM1024KeyPair;
  currentPsk: string;
  standbyPsk: string;
  lastHandshakeEpoch: number;
  rttMs: number;
  jitterMs: number;
  packetLossPct: number;
  quantumResistanceScore: number; // 0 - 100
  tunnelKeepAliveSec: number;
  noiseVectorStdDev: number; // e.g. 2.0 (eta=2)
  coords: { x: number; y: number };
}

export interface MeshLink {
  sourceId: string;
  targetId: string;
  latencyMs: number;
  activePskHash: string;
  isEncryptedPQC: boolean;
  status: 'HEALTHY' | 'ROTATING' | 'CONGESTED';
}

export interface QuantumThreatAssessment {
  shorAlgorithmResistanceNistLevel: number; // Level 5 (256-bit classical / 128-bit quantum security)
  groversAlgorithmSecurityMarginBits: number; // 256 bits (AES-256 equivalent)
  hndlMitigationIndexPct: number; // 100% (Harvest-Now-Decrypt-Later fully neutralized)
  classicalDLogVulnerabilityPct: number; // 0% (Protected by post-quantum KEM)
  algebraicLatticeSecurityDimension: number; // 1024 (k=4, n=256)
  estimatedQubitThresholdForBreak: number; // >6,800 logical error-corrected qubits
}

export const REGIONS = [
  'us-east-va (Ashburn)',
  'us-west-or (The Dalles)',
  'eu-central-de (Frankfurt)',
  'ap-northeast-jp (Tokyo)',
  'ap-southeast-sg (Singapore)',
  'sa-east-br (São Paulo)',
  'me-west-il (Tel Aviv)',
  'eu-west-uk (London)'
];

export function createInitialNodes(nodeCount: number = 24): MeshNode[] {
  const nodes: MeshNode[] = [];
  const cx = 500;
  const cy = 300;
  const radius = 220;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI;
    // Layered ring arrangement
    const ringRadius = radius + (i % 2 === 0 ? -25 : 25) + ((i % 3) * 15);
    const x = cx + ringRadius * Math.cos(angle);
    const y = cy + ringRadius * Math.sin(angle);

    const region = REGIONS[i % REGIONS.length];
    const nodeId = `node-edge-${String(i + 1).padStart(3, '0')}`;
    const kp = mlKemKeyGen(`lattice-node-seed-${i}`);

    nodes.push({
      id: nodeId,
      name: `Edge Gateway ${i + 1} (${region.split(' ')[0]})`,
      region,
      ipAddress: `10.240.${Math.floor(i / 254)}.${(i % 254) + 1}`,
      wireguardInterface: `wg-pqc-${i}`,
      status: 'ONLINE_ACTIVE',
      keyPair: kp,
      currentPsk: kp.publicKey.rawHex.substring(0, 32),
      standbyPsk: kp.secretKey.rawHex.substring(0, 32),
      lastHandshakeEpoch: 1,
      rttMs: 1.8 + Math.random() * 1.3, // Baseline sub-3.2ms
      jitterMs: 0.12 + Math.random() * 0.2,
      packetLossPct: 0.0,
      quantumResistanceScore: 99.98,
      tunnelKeepAliveSec: 25,
      noiseVectorStdDev: 2.0,
      coords: { x, y }
    });
  }

  return nodes;
}

export function generateMeshLinks(nodes: MeshNode[]): MeshLink[] {
  const links: MeshLink[] = [];
  const n = nodes.length;

  for (let i = 0; i < n; i++) {
    // Connect each node to 3 to 4 nearest neighbors in ring topology
    const neighbors = [
      (i + 1) % n,
      (i + 2) % n,
      (i + Math.floor(n / 2)) % n
    ];

    for (const targetIdx of neighbors) {
      if (i < targetIdx) {
        links.push({
          sourceId: nodes[i].id,
          targetId: nodes[targetIdx].id,
          latencyMs: +(nodes[i].rttMs * 0.5 + nodes[targetIdx].rttMs * 0.5).toFixed(2),
          activePskHash: nodes[i].currentPsk.substring(0, 16),
          isEncryptedPQC: true,
          status: 'HEALTHY'
        });
      }
    }
  }

  return links;
}

export const GLOBAL_QTA_MATRIX: QuantumThreatAssessment = {
  shorAlgorithmResistanceNistLevel: 5,
  groversAlgorithmSecurityMarginBits: 256,
  hndlMitigationIndexPct: 100.0,
  classicalDLogVulnerabilityPct: 0.0,
  algebraicLatticeSecurityDimension: 1024,
  estimatedQubitThresholdForBreak: 6840
};
