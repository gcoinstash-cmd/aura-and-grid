import React, { useState } from 'react';
import {
  Play,
  Zap,
  PlusCircle,
  RotateCcw,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Fuel,
  Info
} from 'lucide-react';
import {
  Bundle,
  AuctionResult,
  GAS_TARGET_BLOCK_MAX,
  createInitialBundles,
  generateBenchmarkBundles,
  PrismMeshEngineTs
} from '../core/mevEngineTs';

interface AuctionPipelineTabProps {
  bundles: Bundle[];
  setBundles: React.Dispatch<React.SetStateAction<Bundle[]>>;
  auctionResult: AuctionResult | null;
  setAuctionResult: React.Dispatch<React.SetStateAction<AuctionResult | null>>;
  onRunAuction: (filterToxic: boolean) => void;
  filterToxicMev: boolean;
  setFilterToxicMev: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuctionPipelineTab: React.FC<AuctionPipelineTabProps> = ({
  bundles,
  setBundles,
  auctionResult,
  setAuctionResult,
  onRunAuction,
  filterToxicMev,
  setFilterToxicMev,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  // New Bundle Form state
  const [newBundleId, setNewBundleId] = useState('B-SEARCHER-CUSTOM');
  const [newTipEth, setNewTipEth] = useState('0.15');
  const [newGasLimit, setNewGasLimit] = useState(250000);
  const [newStateKey, setNewStateKey] = useState('USDC:PoolReserves');
  const [newWillRevert, setNewWillRevert] = useState(false);
  const [newActionType, setNewActionType] = useState<'ARB' | 'LIQUIDATION' | 'SWAP'>('ARB');

  // Handle adding custom bundle
  const handleAddBundle = (e: React.FormEvent) => {
    e.preventDefault();
    const tipWei = BigInt(Math.floor(parseFloat(newTipEth || '0.01') * 1e18));
    const gas = Number(newGasLimit);

    const newBundle: Bundle = {
      bundleId: newBundleId || `B-CUSTOM-${Date.now().toString().slice(-4)}`,
      searcherAddress: '0xCustomSearcher0000000000000000000000000000',
      targetBlock: 19842100,
      targetSlot: 894512,
      tipBidWei: tipWei,
      gasTotal: gas,
      txs: [
        {
          txHash: `0xcustom_${Math.random().toString(16).slice(2, 10)}`,
          sender: '0xCustomSearcher0000000000000000000000000000',
          recipient: '0xCustomProtocolContract',
          valueWei: 0n,
          gasLimit: gas,
          gasUsed: Math.floor(gas * 0.95),
          maxPriorityFeePerGasWei: tipWei / BigInt(gas),
          stateReads: [newStateKey],
          stateWrites: [newStateKey],
          reverts: newWillRevert,
          actionType: newActionType,
        },
      ],
      commitmentHash: '0xcustom_commitment_hash',
      revealedSecret: 'secret_revealed_custom',
      status: 'PENDING',
      insulationGuarantee: true,
      stateReads: new Set([newStateKey]),
      stateWrites: new Set([newStateKey]),
    };

    setBundles(prev => [newBundle, ...prev]);
    setShowSubmitModal(false);
    // Auto-run auction to reflect changes
    setTimeout(() => onRunAuction(filterToxicMev), 50);
  };

  // Run 2,500 Concurrent Bids Benchmark
  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const benchBundles = generateBenchmarkBundles(2500);
      const engine = new PrismMeshEngineTs(GAS_TARGET_BLOCK_MAX);
      const result = engine.solveAuction(benchBundles, filterToxicMev);
      setBundles(benchBundles.slice(0, 50)); // Show top 50 in UI table for rendering speed
      setAuctionResult(result);
      setIsBenchmarking(false);
    }, 20);
  };

  const handleReset = () => {
    const initial = createInitialBundles();
    setBundles(initial);
    const engine = new PrismMeshEngineTs(GAS_TARGET_BLOCK_MAX);
    setAuctionResult(engine.solveAuction(initial, filterToxicMev));
  };

  const gasUsed = auctionResult?.totalGasUtilized ?? 0;
  const gasRatio = auctionResult?.gasUtilizationRatio ?? 0;
  const gasPercent = (gasRatio * 100).toFixed(1);
  const totalEth = auctionResult?.totalValidatorTipEth ?? 0;
  const totalUsd = (totalEth * 3450).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Visual Block Gas Meter & Target Capacity */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <Fuel className="w-5 h-5 text-fuchsia-400" />
              <span>BLOCK SPACE GAS PACKING INVARIANT</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                {gasUsed.toLocaleString()}
              </span>
              <span className="text-lg font-mono font-bold text-slate-400">
                / {GAS_TARGET_BLOCK_MAX.toLocaleString()} GAS ({gasPercent}%)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Validator Tip Yield
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                {totalEth.toFixed(4)} ETH
              </div>
              <div className="text-xs font-mono text-slate-400">
                ≈ ${totalUsd} USD
              </div>
            </div>

            <div className="border-l border-slate-800 pl-4 text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Packed / Total
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-blue-400">
                {auctionResult?.packedBundles.length ?? 0}
                <span className="text-base text-slate-500"> / {bundles.length}</span>
              </div>
              <div className="text-xs font-mono text-rose-400">
                {auctionResult?.rejectedBundles.length ?? 0} Rejected / Insulated
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Segmented Gas Progress Bar */}
        <div className="w-full h-5 rounded-lg bg-slate-950 p-1 border border-slate-800 relative">
          <div
            className="h-full rounded-md transition-all duration-300 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-400 shadow-md shadow-fuchsia-500/20"
            style={{ width: `${Math.min(100, Math.max(2, parseFloat(gasPercent)))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 mt-2">
          <span>0 GAS (EMPTY)</span>
          <span className="text-fuchsia-400 font-bold">15M TARGET EIP-1559</span>
          <span className="text-emerald-400 font-bold">30.0M HARD CAP (KNAPSACK BOUND)</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onRunAuction(filterToxicMev)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-fuchsia-950/40 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>SOLVE AUCTION (SUB-12µS)</span>
          </button>

          <button
            onClick={handleRunBenchmark}
            disabled={isBenchmarking}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Zap className="w-5 h-5" />
            <span>{isBenchmarking ? 'RUNNING BENCHMARK...' : '2,500 BIDS STRESS TEST'}</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-2 cursor-pointer transition-all"
          >
            <PlusCircle className="w-5 h-5 text-fuchsia-400" />
            <span>SUBMIT BUNDLE</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Toxic Sandwich MEV Filter Toggle */}
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterToxicMev}
              onChange={e => {
                setFilterToxicMev(e.target.checked);
                onRunAuction(e.target.checked);
              }}
              className="w-4 h-4 rounded text-fuchsia-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Filter Toxic Sandwich MEV
            </span>
          </label>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Bundles"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bundle Pipeline Table / Inspector */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              BUNDLE PIPELINE & SEQUENCING ORDER
            </h2>
          </div>
          <div className="text-xs font-mono font-bold text-slate-400">
            {bundles.length} CANDIDATES EVALUATED
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Rank / ID</th>
                <th className="py-3 px-4">Status & Invariant</th>
                <th className="py-3 px-4">Tip Bid (ETH)</th>
                <th className="py-3 px-4">Gas Limit</th>
                <th className="py-3 px-4">Density (Gwei/Gas)</th>
                <th className="py-3 px-4">Touched State Keys</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm font-medium">
              {bundles.map((b, index) => {
                const tipEth = (Number(b.tipBidWei) / 1e18).toFixed(4);
                const densityGwei = b.gasTotal > 0
                  ? (Number(b.tipBidWei / BigInt(b.gasTotal)) / 1e9).toFixed(2)
                  : '0.00';

                // Status styling
                let statusBadge = (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-slate-800 text-slate-300">
                    PENDING
                  </span>
                );

                if (b.status === 'PACKED') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      PACKED #{b.dagPriorityRank}
                    </span>
                  );
                } else if (b.status === 'DAG_CONFLICT') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
                      <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                      DAG CONFLICT
                    </span>
                  );
                } else if (b.status === 'SANDWICH_TOXIC') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-800/60">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      TOXIC MEV DROP
                    </span>
                  );
                } else if (b.status === 'REVERTED') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-800/60">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ZERO-REVERT DROP
                    </span>
                  );
                } else if (b.status === 'DROPPED') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-slate-800 text-slate-400">
                      EXCEEDS GAS CAP
                    </span>
                  );
                }

                return (
                  <tr
                    key={b.bundleId}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      b.status === 'PACKED' ? 'bg-emerald-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">#{index + 1}</span>
                        <span className="text-fuchsia-400">{b.bundleId}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-normal truncate max-w-[160px]">
                        {b.searcherAddress}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {statusBadge}
                      {b.statusMessage && (
                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                          {b.statusMessage}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-base">
                      {tipEth} ETH
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {b.gasTotal.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {densityGwei} Gwei
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {Array.from(b.stateWrites).map(slot => (
                          <span
                            key={slot}
                            className="text-xs font-mono bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedBundle(b)}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-fuchsia-400" />
                Submit Sealed-Bid MEV Bundle
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBundle} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Bundle Identifier
                </label>
                <input
                  type="text"
                  value={newBundleId}
                  onChange={e => setNewBundleId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Validator Tip (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={newTipEth}
                    onChange={e => setNewTipEth(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Gas Limit
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="21000"
                    max="10000000"
                    value={newGasLimit}
                    onChange={e => setNewGasLimit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  State Slot / Target Storage Key
                </label>
                <select
                  value={newStateKey}
                  onChange={e => setNewStateKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                >
                  <option value="USDC:PoolReserves">USDC:PoolReserves (Uniswap V3)</option>
                  <option value="WETH:Reserves">WETH:Reserves (Uniswap V3)</option>
                  <option value="Aave:UserCollateral">Aave:UserCollateral (Aave V3)</option>
                  <option value="Curve:TriCryptoReserves">Curve:TriCryptoReserves (Curve)</option>
                  <option value="Balancer:VaultBalances">Balancer:VaultBalances (Balancer)</option>
                  <option value="DAI:Balances">DAI:Balances (MakerDAO)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Strategy Type
                  </label>
                  <select
                    value={newActionType}
                    onChange={e => setNewActionType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                  >
                    <option value="ARB">Cross-DEX Arbitrage</option>
                    <option value="LIQUIDATION">Debt Liquidation</option>
                    <option value="SWAP">Retail / Private Swap</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-300">
                    <input
                      type="checkbox"
                      checked={newWillRevert}
                      onChange={e => setNewWillRevert(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700"
                    />
                    <span>Simulate Tx Revert (Test Drop)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold hover:from-fuchsia-500 hover:to-indigo-500 shadow-lg shadow-fuchsia-950/40"
                >
                  Submit Sealed Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Bundle Detail Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-fuchsia-400">
                  BUNDLE INSPECTION TELEMETRY
                </span>
                <h3 className="text-xl font-black text-white font-mono">
                  {selectedBundle.bundleId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBundle(null)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm font-mono">
              <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <div className="font-bold text-white">{selectedBundle.status}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Tip Bid</div>
                  <div className="font-bold text-emerald-400">
                    {(Number(selectedBundle.tipBidWei) / 1e18).toFixed(4)} ETH
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Gas Total</div>
                  <div className="font-bold text-slate-200">
                    {selectedBundle.gasTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Searcher Address</div>
                  <div className="font-bold text-slate-200 truncate">
                    {selectedBundle.searcherAddress}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-bold mb-1">
                  CHILD TRANSACTIONS ({selectedBundle.txs.length})
                </div>
                <div className="space-y-2">
                  {selectedBundle.txs.map((tx, idx) => (
                    <div
                      key={tx.txHash}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-fuchsia-400">TX[{idx}]:</span>{' '}
                        <span className="text-slate-300">{tx.txHash}</span>
                        <div className="text-slate-400">
                          {tx.actionType} · Target: {tx.recipient.slice(0, 14)}...
                        </div>
                      </div>
                      <div className="text-right">
                        {tx.reverts ? (
                          <span className="text-rose-400 font-bold">REVERTS (DROPPED)</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">SUCCESS (SIMULATED)</span>
                        )}
                        <div className="text-slate-500 font-mono">{tx.gasLimit.toLocaleString()} Gas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>All-or-Nothing Guarantee:</strong> If any child transaction in this bundle reverts, PrismMesh eliminates the entire bundle from the proposed block, preventing gas leakage and validator penalty.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBundle(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
