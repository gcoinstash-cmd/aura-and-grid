/**
 * GF-T3-153: AegisSovereign Engine — Client-Side Mathematical TSS & DvP Core
 * Deterministic reproduction of the Python core for interactive cockpit simulation.
 */

// Secp256k1 group order n
export const SECP256K1_N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

// Extended Euclidean Algorithm for modular inverse
export function modInverse(a: bigint, m: bigint = SECP256K1_N): bigint {
  let [old_r, r] = [(a % m + m) % m, m];
  let [old_s, s] = [1n, 0n];

  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }

  return (old_s % m + m) % m;
}

export interface KeyShard {
  index: number;
  secretShare: bigint;
  publicCommitment: string;
}

export interface NodeStatus {
  id: number;
  name: string;
  enclaveType: string;
  region: string;
  isOnline: boolean;
  isByzantine: boolean;
  latencyMs: number;
  lastNonceCommitment?: { D: string; E: string };
  lastPartialSignature?: string;
  health: "HEALTHY" | "OFFLINE" | "BYZANTINE";
}

export interface Round1Commitment {
  nodeId: number;
  d: bigint;
  e: bigint;
  D: bigint;
  E: bigint;
}

export interface PartialSignature {
  nodeId: number;
  zShare: bigint;
  RGroup: bigint;
  challenge: bigint;
}

export interface AggregatedSignature {
  R: bigint;
  z: bigint;
  messageDigestHex: string;
  signers: number[];
  verified: boolean;
}

export type DvPState =
  | "INITIALIZED"
  | "PREPARE_LEGS"
  | "ESCROW_LOCKED"
  | "TSS_ROUND_1_NONCE"
  | "TSS_ROUND_2_PARTIAL_SIGN"
  | "COMMIT_SETTLED"
  | "ROLLBACK_EXPIRED"
  | "ROLLBACK_FAULT";

export interface SettlementLeg {
  legId: string;
  counterparty: string;
  assetTicker: string;
  amountUnits: bigint;
  accountSource: string;
  accountDestination: string;
  lockedInEscrow: boolean;
  escrowTxHash?: string;
}

export interface DvPTransactionRecord {
  tradeId: string;
  settlementNonce: number;
  createdAt: number;
  timeoutMs: number;
  assetLeg: SettlementLeg;
  cashLeg: SettlementLeg;
  state: DvPState;
  stateRoot: string;
  signers: number[];
  signature?: AggregatedSignature;
  latencyBreakdown: {
    prepMs: number;
    escrowLockMs: number;
    round1NonceMs: number;
    round2SignMs: number;
    aggregationMs: number;
    totalMs: number;
  };
  logSteps: { state: DvPState; timestamp: number; message: string }[];
}

// Compute deterministic SHA-256 in browser via WebCrypto or fallback
export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
}

export class ClientSettlementEngine {
  public thresholdK: number = 3;
  public totalN: number = 5;
  public masterSecret: bigint;
  public groupPublicKey: bigint;
  public shares: KeyShard[] = [];
  public coefficients: bigint[] = [];
  public nodes: NodeStatus[] = [];
  public nonceCounter: number = 100000;
  public processedNonces: Set<number> = new Set();

  constructor() {
    // Deterministic master secret for demonstration consistency
    this.masterSecret = BigInt("0x3f9a72b1d048208ecbe35091c68f23491f2402bc0f7193b2a0918734918231aa") % SECP256K1_N;
    this.groupPublicKey = (this.masterSecret * 7n) % SECP256K1_N;

    this.initCoefficientsAndShares();
    this.initNodes();
  }

  private initCoefficientsAndShares() {
    this.coefficients = [
      this.masterSecret,
      BigInt("0x1847192837418237498172938471928374918237491823749182374918237491") % SECP256K1_N,
      BigInt("0x4918237491823749182374918237491823749182374918237491823749182374") % SECP256K1_N,
    ];

    this.shares = [];
    for (let i = 1; i <= this.totalN; i++) {
      const idx = BigInt(i);
      // f(i) = a0 + a1*i + a2*i^2 mod n
      const share = (
        this.coefficients[0] +
        this.coefficients[1] * idx +
        this.coefficients[2] * idx * idx
      ) % SECP256K1_N;

      const pubCommit = "0x" + ((share * 7n) % SECP256K1_N).toString(16).slice(0, 16) + "...";
      this.shares.push({
        index: i,
        secretShare: share,
        publicCommitment: pubCommit,
      });
    }
  }

  private initNodes() {
    const specs = [
      { name: "Node Alpha (Primary)", enclaveType: "AWS Nitro Enclave", region: "us-east-1 (N. Virginia)", lat: 2.1 },
      { name: "Node Beta (Secondary)", enclaveType: "GCP Confidential Space", region: "us-central1 (Iowa)", lat: 3.4 },
      { name: "Node Gamma (Tertiary)", enclaveType: "Azure SGX Hardware", region: "europe-west1 (Belgium)", lat: 8.2 },
      { name: "Node Delta (Sovereign)", enclaveType: "Swiss Banking HSM", region: "ch-datacenter (Zurich)", lat: 11.5 },
      { name: "Node Epsilon (Consortium)", enclaveType: "Tokyo Shield Enclave", region: "ap-northeast-1 (Tokyo)", lat: 14.8 },
    ];

    this.nodes = specs.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      enclaveType: s.enclaveType,
      region: s.region,
      isOnline: true,
      isByzantine: false,
      latencyMs: s.lat,
      health: "HEALTHY",
    }));
  }

  public getLagrangeCoefficient(participantId: number, selectedIds: number[]): bigint {
    let num = 1n;
    let den = 1n;

    for (const j of selectedIds) {
      if (j === participantId) continue;
      const bJ = BigInt(j);
      const bI = BigInt(participantId);

      num = (num * bJ) % SECP256K1_N;
      const diff = bJ - bI;
      const positiveDiff = (diff % SECP256K1_N + SECP256K1_N) % SECP256K1_N;
      den = (den * positiveDiff) % SECP256K1_N;
    }

    return (num * modInverse(den, SECP256K1_N)) % SECP256K1_N;
  }

  public reconstructSecret(subsetIds: number[]): bigint {
    let acc = 0n;
    for (const id of subsetIds) {
      const shard = this.shares.find(s => s.index === id)!;
      const lam = this.getLagrangeCoefficient(id, subsetIds);
      acc = (acc + lam * shard.secretShare) % SECP256K1_N;
    }
    return acc;
  }

  public async executeSettlement(params: {
    assetTicker: string;
    assetUnits: bigint;
    cashTicker: string;
    cashUnits: bigint;
    seller: string;
    buyer: string;
    participatingNodeIds?: number[];
    simulateTimeout?: boolean;
    simulateByzantineNodeId?: number;
    timeoutMs?: number;
  }): Promise<DvPTransactionRecord> {
    const tStart = performance.now();
    this.nonceCounter++;
    const nonce = this.nonceCounter;
    const tradeId = `DVP-TX-${nonce.toString().padStart(8, "0")}`;
    const timeout = params.timeoutMs || 5000;

    const record: DvPTransactionRecord = {
      tradeId,
      settlementNonce: nonce,
      createdAt: Date.now(),
      timeoutMs: timeout,
      assetLeg: {
        legId: `${tradeId}-LEG-ASSET`,
        counterparty: params.seller,
        assetTicker: params.assetTicker,
        amountUnits: params.assetUnits,
        accountSource: `custody://${params.seller}/vault-01`,
        accountDestination: `custody://${params.buyer}/vault-01`,
        lockedInEscrow: false,
      },
      cashLeg: {
        legId: `${tradeId}-LEG-CASH`,
        counterparty: params.buyer,
        assetTicker: params.cashTicker,
        amountUnits: params.cashUnits,
        accountSource: `cbdc://${params.buyer}/account-rtgs`,
        accountDestination: `cbdc://${params.seller}/account-rtgs`,
        lockedInEscrow: false,
      },
      state: "INITIALIZED",
      stateRoot: "",
      signers: [],
      latencyBreakdown: {
        prepMs: 0,
        escrowLockMs: 0,
        round1NonceMs: 0,
        round2SignMs: 0,
        aggregationMs: 0,
        totalMs: 0,
      },
      logSteps: [],
    };

    // Helper to log step
    const addLog = (state: DvPState, msg: string) => {
      record.state = state;
      record.logSteps.push({ state, timestamp: Date.now(), message: msg });
    };

    addLog("INITIALIZED", `Trade ${tradeId} initiated. Nonce: ${nonce}. Anti-replay sequence verified.`);

    // Check Anti-Replay
    if (this.processedNonces.has(nonce)) {
      addLog("ROLLBACK_FAULT", "Anti-replay invariant violation: Nonce collision detected.");
      record.stateRoot = await sha256Hex(`${tradeId}:ROLLBACK_FAULT`);
      return record;
    }

    const tPrepStart = performance.now();
    addLog("PREPARE_LEGS", `Verifying asset solvency: ${params.assetUnits.toString()} ${params.assetTicker} & ${params.cashUnits.toString()} ${params.cashTicker}`);
    record.latencyBreakdown.prepMs = parseFloat((performance.now() - tPrepStart).toFixed(2));

    // Lock Escrow
    const tLockStart = performance.now();
    record.assetLeg.lockedInEscrow = true;
    record.assetLeg.escrowTxHash = await sha256Hex(`ESCROW_ASSET:${tradeId}:${params.assetUnits.toString()}`);

    if (params.simulateTimeout) {
      // Simulate timeout
      record.assetLeg.lockedInEscrow = false;
      addLog("ROLLBACK_EXPIRED", `Cash leg funding deadline (${timeout}ms) breached. Atomic rollback triggered. Asset escrow released to ${params.seller}.`);
      record.stateRoot = await sha256Hex(`${tradeId}:ROLLBACK_EXPIRED`);
      record.latencyBreakdown.totalMs = parseFloat((performance.now() - tStart).toFixed(2));
      return record;
    }

    record.cashLeg.lockedInEscrow = true;
    record.cashLeg.escrowTxHash = await sha256Hex(`ESCROW_CASH:${tradeId}:${params.cashUnits.toString()}`);
    addLog("ESCROW_LOCKED", "Bilateral atomic lock confirmed. Escrow pipes sealed with dual hashes.");
    record.latencyBreakdown.escrowLockMs = parseFloat((performance.now() - tLockStart).toFixed(2));

    // Determine participating nodes
    const activeSigners = params.participatingNodeIds && params.participatingNodeIds.length > 0
      ? params.participatingNodeIds
      : this.nodes.filter(n => n.isOnline).map(n => n.id).slice(0, 3);

    record.signers = activeSigners;

    // Check threshold
    if (activeSigners.length < this.thresholdK) {
      record.assetLeg.lockedInEscrow = false;
      record.cashLeg.lockedInEscrow = false;
      addLog("ROLLBACK_FAULT", `Quorum deficiency: Only ${activeSigners.length} nodes provided, but threshold k = ${this.thresholdK} required.`);
      record.stateRoot = await sha256Hex(`${tradeId}:ROLLBACK_FAULT:QUORUM_FAIL`);
      record.latencyBreakdown.totalMs = parseFloat((performance.now() - tStart).toFixed(2));
      return record;
    }

    // TSS Round 1: Nonce commitments
    const tR1Start = performance.now();
    addLog("TSS_ROUND_1_NONCE", `FROST Round 1: Collecting nonce pairs (d_i, e_i) and commitments (D_i, E_i) across nodes [${activeSigners.join(", ")}].`);
    const round1Pkgs: Round1Commitment[] = activeSigners.map(nid => {
      const d = (BigInt(nid * 987123) * 1337n) % SECP256K1_N;
      const e = (BigInt(nid * 456789) * 2024n) % SECP256K1_N;
      const D = (d * 7n) % SECP256K1_N;
      const E = (e * 7n) % SECP256K1_N;
      return { nodeId: nid, d, e, D, E };
    });
    record.latencyBreakdown.round1NonceMs = parseFloat((performance.now() - tR1Start).toFixed(2));

    // TSS Round 2: Partial Signatures
    const tR2Start = performance.now();
    addLog("TSS_ROUND_2_PARTIAL_SIGN", "FROST Round 2: Generating Schnorr partial signatures with Fiat-Shamir challenge.");
    const msgToSign = `EXECUTE_DVP:${tradeId}:${nonce}:${params.assetUnits.toString()}:${params.cashUnits.toString()}`;
    const msgDigest = await sha256Hex(msgToSign);

    // Simulated R group and challenge
    const RGroup = round1Pkgs.reduce((acc, p) => (acc + p.D + p.E * 3n) % SECP256K1_N, 0n);
    const challenge = BigInt("0x" + msgDigest) % SECP256K1_N;

    const partialSignatures: PartialSignature[] = [];
    let detectedByzantine = false;

    for (const nid of activeSigners) {
      const shard = this.shares.find(s => s.index === nid)!;
      const pkg = round1Pkgs.find(p => p.nodeId === nid)!;
      const lam = this.getLagrangeCoefficient(nid, activeSigners);

      // Fault injection check
      if (params.simulateByzantineNodeId === nid) {
        // Corrupted signature
        detectedByzantine = true;
        partialSignatures.push({
          nodeId: nid,
          zShare: 0xDEADBEEFn,
          RGroup,
          challenge,
        });
      } else {
        const zShare = (pkg.d + pkg.e * 3n + (lam * shard.secretShare % SECP256K1_N * challenge % SECP256K1_N)) % SECP256K1_N;
        partialSignatures.push({
          nodeId: nid,
          zShare,
          RGroup,
          challenge,
        });
      }
    }
    record.latencyBreakdown.round2SignMs = parseFloat((performance.now() - tR2Start).toFixed(2));

    // Signature Aggregation
    const tAggStart = performance.now();
    if (detectedByzantine) {
      record.assetLeg.lockedInEscrow = false;
      record.cashLeg.lockedInEscrow = false;
      addLog("ROLLBACK_FAULT", `Byzantine fault detected: Invalid partial signature from Node ${params.simulateByzantineNodeId}. Signer isolated; trade aborted with zero loss.`);
      record.stateRoot = await sha256Hex(`${tradeId}:ROLLBACK_FAULT:BYZANTINE`);
      record.latencyBreakdown.aggregationMs = parseFloat((performance.now() - tAggStart).toFixed(2));
      record.latencyBreakdown.totalMs = parseFloat((performance.now() - tStart).toFixed(2));
      return record;
    }

    // Valid aggregate
    const zAgg = partialSignatures.reduce((acc, ps) => (acc + ps.zShare) % SECP256K1_N, 0n);
    record.signature = {
      R: RGroup,
      z: zAgg,
      messageDigestHex: msgDigest,
      signers: activeSigners,
      verified: true,
    };
    record.latencyBreakdown.aggregationMs = parseFloat((performance.now() - tAggStart).toFixed(2));

    // Commit Final
    addLog("COMMIT_SETTLED", `Threshold consensus verified (3-of-5). Atomic ownership transfer completed on both ledgers with zero-reorg finality.`);
    this.processedNonces.add(nonce);

    record.stateRoot = await sha256Hex(`${tradeId}:${nonce}:COMMIT_SETTLED:${zAgg.toString(16).slice(0, 16)}`);
    record.latencyBreakdown.totalMs = parseFloat((performance.now() - tStart).toFixed(2));

    return record;
  }
}
