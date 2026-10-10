"""
Unit and Integration Test Suite for GF-T3-153: AegisSovereign Engine
Tests all mathematical threshold invariants, Byzantine fault tolerances,
atomic 2PC rollbacks, anti-replay guards, and sub-15ms performance targets.
Compatible with standard Python unittest and Pytest.
"""

import os
import sys
import time
import unittest

# Add source directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.core.settlement_engine import (
    AtomicSettlementEngine,
    FeldmanVSS,
    DvPState,
    SECP256K1_N
)


class TestAegisSovereignEngine(unittest.TestCase):
    """Enterprise verification suite for Track 3 Monopolistic Vault Gate."""

    def setUp(self):
        """Provide a fresh instance of the settlement engine."""
        self.engine = AtomicSettlementEngine(threshold_k=3, total_n=5)

    def test_01_feldman_vss_secret_reconstruction(self):
        """Verify Shamir polynomial and Lagrange interpolation reconstruct master key."""
        engine = self.engine
        combos = [
            [engine.shares_map[1], engine.shares_map[2], engine.shares_map[3]],
            [engine.shares_map[1], engine.shares_map[3], engine.shares_map[5]],
            [engine.shares_map[2], engine.shares_map[4], engine.shares_map[5]],
        ]
        for combo in combos:
            reconstructed = FeldmanVSS.reconstruct_secret(combo)
            self.assertEqual(
                reconstructed,
                engine.master_secret,
                "Lagrange reconstruction failed to match master secret"
            )

    def test_02_frost_quorum_achievement_permutations(self):
        """Verify 3-of-5 FROST consensus succeeds across different node permutations."""
        engine = self.engine
        permutations = [
            [1, 2, 3],
            [1, 3, 5],
            [2, 4, 5],
            [3, 4, 5],
        ]
        for node_subset in permutations:
            trade = engine.initialize_dvp_trade(
                asset_ticker="UST-2028-TKN",
                asset_units=100_000_00000000,
                cash_ticker="FEDNOW-CBDC",
                cash_units=99_500_000_000000,
                asset_seller="GOLDMAN_LIQUIDITY_VAULT",
                cash_buyer="BNY_MELLON_CLEARING"
            )
            res = engine.execute_dvp_settlement(trade, participating_node_ids=node_subset)
            self.assertEqual(res.state, DvPState.SETTLED)
            self.assertIsNotNone(res.signature)
            self.assertTrue(res.signature.verified)
            self.assertEqual(set(res.signature.signers), set(node_subset))

    def test_03_sub_threshold_quorum_failure(self):
        """Verify that less than k=3 nodes strictly aborts settlement."""
        engine = self.engine
        trade = engine.initialize_dvp_trade(
            asset_ticker="UST-2028-TKN",
            asset_units=50_000_00000000,
            cash_ticker="USDC",
            cash_units=49_800_000_000000,
            asset_seller="SELLER_ALPHA",
            cash_buyer="BUYER_BETA"
        )
        # Attempt with only 2 nodes (Nodes 1, 2)
        res = engine.execute_dvp_settlement(trade, participating_node_ids=[1, 2])
        self.assertEqual(res.state, DvPState.ROLLBACK_FAULT)
        self.assertIsNone(res.signature)
        self.assertFalse(res.asset_leg.locked_in_escrow)
        self.assertFalse(res.cash_leg.locked_in_escrow)

    def test_04_byzantine_rogue_partial_signature_rejection(self):
        """Verify Byzantine node injecting corrupt partial signature is caught and isolated."""
        engine = self.engine
        trade = engine.initialize_dvp_trade(
            asset_ticker="UST-2028-TKN",
            asset_units=25_000_00000000,
            cash_ticker="USDC",
            cash_units=24_900_000_000000,
            asset_seller="SELLER_ALPHA",
            cash_buyer="BUYER_BETA"
        )
        # Node 3 is simulated as rogue/corrupted
        res = engine.execute_dvp_settlement(
            trade,
            participating_node_ids=[1, 2, 3],
            simulate_rogue_node_id=3
        )
        self.assertEqual(res.state, DvPState.ROLLBACK_FAULT)
        self.assertIn("Byzantine fault detected", res.state_history[-1][2])
        self.assertFalse(res.asset_leg.locked_in_escrow)

    def test_05_dvp_cash_leg_timeout_rollback(self):
        """Verify 2PC rollback when counterparty fails to fund cash leg before deadline."""
        engine = self.engine
        trade = engine.initialize_dvp_trade(
            asset_ticker="UST-2028-TKN",
            asset_units=10_000_00000000,
            cash_ticker="EUR-CBDC",
            cash_units=9_200_000_000000,
            asset_seller="SELLER_ALPHA",
            cash_buyer="DEFAULTING_BUYER",
            timeout_ms=3000
        )
        res = engine.execute_dvp_settlement(trade, simulate_cash_leg_timeout=True)
        self.assertEqual(res.state, DvPState.ROLLBACK_EXPIRED)
        self.assertIn("timeout exceeded", res.state_history[-1][2])
        self.assertFalse(res.asset_leg.locked_in_escrow)
        self.assertFalse(res.cash_leg.locked_in_escrow)

    def test_06_anti_replay_nonce_sequencing(self):
        """Verify that identical transaction nonces are strictly rejected."""
        engine = self.engine
        trade = engine.initialize_dvp_trade(
            asset_ticker="UST-2028-TKN",
            asset_units=1000_00000000,
            cash_ticker="USDC",
            cash_units=995_000000,
            asset_seller="SELLER_1",
            cash_buyer="BUYER_1"
        )
        res1 = engine.execute_dvp_settlement(trade, participating_node_ids=[1, 2, 3])
        self.assertEqual(res1.state, DvPState.SETTLED)

        # Attempt to replay the exact same trade instance
        res2 = engine.execute_dvp_settlement(trade, participating_node_ids=[1, 2, 3])
        self.assertEqual(res2.state, DvPState.ROLLBACK_FAULT)
        self.assertIn("Anti-replay invariant violation", res2.state_history[-1][2])

    def test_07_big_integer_precision_invariants(self):
        """Ensure full satoshi/wei unit scaling preserves exact quantities with zero fractional leakage."""
        engine = self.engine
        asset_amt = 999_999_999_999_999_999
        cash_amt = 888_888_888_888_888_888
        trade = engine.initialize_dvp_trade(
            asset_ticker="TBILL-TOKEN",
            asset_units=asset_amt,
            cash_ticker="W-CBDC",
            cash_units=cash_amt,
            asset_seller="TREASURY_CENTRAL",
            cash_buyer="PRIMARY_DEALER"
        )
        res = engine.execute_dvp_settlement(trade, participating_node_ids=[1, 4, 5])
        self.assertEqual(res.state, DvPState.SETTLED)
        self.assertEqual(res.asset_leg.amount_units, asset_amt)
        self.assertEqual(res.cash_leg.amount_units, cash_amt)

    def test_08_performance_latency_benchmark(self):
        """Benchmark 3-of-5 FROST round aggregation runs in sub-15ms target."""
        engine = self.engine
        latencies = []
        for _ in range(30):
            trade = engine.initialize_dvp_trade(
                asset_ticker="UST-2028",
                asset_units=1000,
                cash_ticker="USDC",
                cash_units=1000,
                asset_seller="DESK_A",
                cash_buyer="DESK_B"
            )
            t0 = time.perf_counter()
            res = engine.execute_dvp_settlement(trade, participating_node_ids=[1, 2, 3])
            elapsed_ms = (time.perf_counter() - t0) * 1000
            self.assertEqual(res.state, DvPState.SETTLED)
            latencies.append(elapsed_ms)

        avg_latency = sum(latencies) / len(latencies)
        print(f"\n[BENCHMARK] Average 3-of-5 settlement round: {avg_latency:.3f} ms (Target < 15.0 ms)")
        self.assertLess(avg_latency, 15.0, f"Performance target missed: {avg_latency:.2f} ms >= 15.0 ms")


if __name__ == "__main__":
    unittest.main(verbosity=2)
