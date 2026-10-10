"""
Unit and algorithmic tests for Engine GF-T3-140: Chronos-Tick Quantitative Core.
Tests Almgren-Chriss weights, bimodal volume profile, Poisson scheduling, and venue routing.
"""

import math
import pytest
from src.engine import ChronosTickEngine, BASE_BTC_PRICE, VENUES
from src.models import (
    MandateCreateInput,
    MandateSide,
    MandateStatus,
    MandateStrategy,
)


def test_engine_initialization():
    engine = ChronosTickEngine()
    assert len(engine.mandates) == 0
    assert engine.sequence_counter == 0
    assert engine.total_processed_slices == 0

    health = engine.get_health()
    assert health.status == "ONLINE"
    assert health.engine_id == "GF-T3-140"
    assert health.active_mandates == 0
    assert health.processed_slices == 0
    assert health.clock_drift_ms < 1.0


def test_almgren_chriss_weights_boundary_conditions():
    # 0 slices
    assert ChronosTickEngine.calculate_almgren_chriss_weights(total_slices=0) == []

    # 1 slice
    assert ChronosTickEngine.calculate_almgren_chriss_weights(total_slices=1) == [1.0]

    # 100 slices
    weights = ChronosTickEngine.calculate_almgren_chriss_weights(total_slices=100)
    assert len(weights) == 100
    assert math.isclose(sum(weights), 1.0, abs_tol=1e-5)
    # Almgren-Chriss front-loads execution to reduce price variance: first slice > last slice
    assert weights[0] > weights[-1]
    assert all(w > 0 for w in weights)


def test_almgren_chriss_fallback_when_sum_rates_zero(monkeypatch):
    monkeypatch.setattr(math, "sinh", lambda x: 0.0)
    weights = ChronosTickEngine.calculate_almgren_chriss_weights(total_slices=5)
    assert weights == [0.2] * 5


def test_bimodal_volume_profile_generation():
    buckets = ChronosTickEngine.generate_bimodal_volume_profile(
        duration_minutes=60,
        total_notional_usd=10_000_000.0,
        base_price=BASE_BTC_PRICE,
    )
    assert len(buckets) == 61  # minute 0 to minute 60 inclusive
    assert buckets[0].minute == 0
    assert buckets[-1].minute == 60
    assert "UTC" in buckets[0].time_label

    # Check total sum approximates total notional
    total_notional = sum(b.expected_slice_notional for b in buckets)
    assert math.isclose(total_notional, 10_000_000.0, rel_tol=1e-2)

    # U-shaped check: early and late buckets have higher volume weights than middle
    mid_idx = 30
    assert buckets[0].historical_volume_weight > buckets[mid_idx].historical_volume_weight
    assert buckets[60].historical_volume_weight > buckets[mid_idx].historical_volume_weight


def test_create_mandate_almgren_chriss_buy():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="BTC-USD",
        side=MandateSide.BUY,
        total_notional_usd=5_000_000.0,
        duration_minutes=60,
        strategy=MandateStrategy.ALMGREN_CHRISS,
        risk_aversion_lambda=1e-6,
        target_slippage_bps_cap=3.0,
    )
    res = engine.create_mandate(inp)

    assert res.status == MandateStatus.ACTIVE.value
    assert res.total_slices == 100
    assert res.arrival_price == BASE_BTC_PRICE
    assert res.estimated_slippage_bps > 0.0
    assert engine.total_processed_slices == 100

    # Retrieve performance record
    perf = engine.get_mandate_performance(res.mandate_id)
    assert perf is not None
    assert perf.mandate_id == res.mandate_id
    assert perf.symbol == "BTC-USD"
    assert perf.side == "BUY"
    assert perf.slices_count == 100
    assert perf.benchmark_compliance is True
    assert len(perf.slices) == 100

    # Check first slice
    first_slice = perf.slices[0]
    assert first_slice.slice_index == 1
    assert first_slice.status == "FILLED"
    assert first_slice.venue in VENUES
    assert first_slice.arrival_price == BASE_BTC_PRICE
    assert first_slice.poisson_interval_ms > 0


def test_create_mandate_twap_sell():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="ETH-USD",
        side=MandateSide.SELL,
        total_notional_usd=2_000_000.0,
        duration_minutes=30,
        strategy=MandateStrategy.TWAP,
        arrival_price=2650.0,
    )
    res = engine.create_mandate(inp)
    assert res.arrival_price == 2650.0

    perf = engine.get_mandate_performance(res.mandate_id)
    assert perf is not None
    assert perf.strategy == "TWAP"
    # For TWAP, all target quantities should be approximately equal
    quantities = [s.target_qty for s in perf.slices]
    assert math.isclose(quantities[0], quantities[-1], rel_tol=1e-3)


def test_create_mandate_vwap_strategy():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="SOL-USD",
        side=MandateSide.BUY,
        total_notional_usd=1_000_000.0,
        duration_minutes=45,
        strategy=MandateStrategy.VWAP,
        arrival_price=150.0,
    )
    res = engine.create_mandate(inp)
    perf = engine.get_mandate_performance(res.mandate_id)
    assert perf is not None
    assert perf.strategy == "VWAP"
    assert len(perf.slices) == 100


def test_cancel_mandate_lifecycle():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="BTC-USD",
        side=MandateSide.BUY,
        total_notional_usd=10_000_000.0,
    )
    res = engine.create_mandate(inp)
    
    # Cancel existing mandate
    cancelled = engine.cancel_mandate(res.mandate_id)
    assert cancelled is True

    perf = engine.get_mandate_performance(res.mandate_id)
    assert perf.status == MandateStatus.ABORTED.value

    # Cancel unknown mandate
    assert engine.cancel_mandate("NON_EXISTENT_ID") is False


def test_get_mandate_performance_unknown():
    engine = ChronosTickEngine()
    assert engine.get_mandate_performance("UNKNOWN_ID") is None


def test_multi_venue_smart_routing():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="BTC-USD",
        side=MandateSide.BUY,
        total_notional_usd=10_000_000.0,
    )
    res = engine.create_mandate(inp)
    perf = engine.get_mandate_performance(res.mandate_id)

    venues_hit = {s.venue for s in perf.slices}
    # All 4 venues should be routed to
    assert venues_hit == set(VENUES)


def test_poisson_arrival_jitter_distribution():
    engine = ChronosTickEngine()
    inp = MandateCreateInput(
        symbol="BTC-USD",
        side=MandateSide.BUY,
        total_notional_usd=10_000_000.0,
        duration_minutes=60,
    )
    res = engine.create_mandate(inp)
    perf = engine.get_mandate_performance(res.mandate_id)

    intervals = [s.poisson_interval_ms for s in perf.slices]
    # Check that intervals are not all identical (jitter is present)
    assert len(set(intervals)) > 10
