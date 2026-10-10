"""
Ghost FactoryOS — Engine GF-T3-142: Aegis-Orbit Mission Control Engine
Unit Tests for Astrodynamics, CARA Conjunction Assessment, and Maneuver Physics.
License: Apache-2.0 / MIT Dual Permissive
"""

import math
import pytest
from src.engine import (
    AegisOrbitEngine,
    calculate_atmospheric_density,
    compute_total_acceleration,
    propagate_step_rk4,
    keplerian_to_cartesian,
    cartesian_to_keplerian,
)
from src.models import (
    CartesianStateModel,
    KeplerianElementsModel,
    PropagateOrbitRequest,
    ConjunctionEvaluationRequest,
    ConjunctionSeverity,
    ManeuverOptimizationRequest,
)


def test_atmospheric_density():
    # Altitude < 200 km
    rho_low = calculate_atmospheric_density(150.0)
    assert rho_low == 3.0e-9

    # Altitude between 200 and 1000 km
    rho_leo = calculate_atmospheric_density(450.0)
    assert 1.0e-13 < rho_leo < 1.0e-11

    # Altitude > 1000 km
    rho_high = calculate_atmospheric_density(1200.0)
    assert rho_high == 1.0e-16


def test_compute_total_acceleration():
    # Satellite at ~500 km LEO equatorial orbit: r = [6878.137, 0, 0] km
    r = [6878.137, 0.0, 0.0]
    v = [0.0, 7.612, 0.0]  # Circular orbit velocity ~7.61 km/s
    a = compute_total_acceleration(r, v, mass_kg=260.0, area_m2=1.8)

    # Gravitational acceleration should point predominantly towards center of Earth (-X)
    assert a[0] < -0.008  # ~ -0.0084 km/s^2 (-8.4 m/s^2)
    assert abs(a[1]) < 0.001
    assert abs(a[2]) < 0.001


def test_keplerian_cartesian_roundtrip():
    # Circular LEO orbit
    keplerian_in = KeplerianElementsModel(
        semi_major_axis_km=6928.137,  # ~550 km altitude
        eccentricity=0.0005,
        inclination_deg=51.6,
        raan_deg=45.0,
        arg_perigee_deg=90.0,
        true_anomaly_deg=30.0,
    )

    cartesian = keplerian_to_cartesian(keplerian_in)
    assert len(cartesian.r_eci_km) == 3
    assert len(cartesian.v_eci_km_s) == 3

    # Check radius magnitude ~6928 km
    r_mag = math.sqrt(sum(x ** 2 for x in cartesian.r_eci_km))
    assert abs(r_mag - 6928.137) < 5.0

    # Convert back to Keplerian
    keplerian_out = cartesian_to_keplerian(cartesian)
    assert abs(keplerian_out.semi_major_axis_km - keplerian_in.semi_major_axis_km) < 5.0
    assert abs(keplerian_out.inclination_deg - keplerian_in.inclination_deg) < 1.0


def test_propagate_step_rk4():
    state = CartesianStateModel(
        r_eci_km=[6878.137, 0.0, 0.0],
        v_eci_km_s=[0.0, 7.612, 0.0],
        epoch_utc="2026-10-07T12:00:00Z",
    )
    next_state = propagate_step_rk4(state, dt_seconds=10.0, mass_kg=260.0, area_m2=1.8)

    # After 10s, satellite moved in +Y direction and position updated
    assert next_state.r_eci_km[1] > 0.0
    assert next_state.epoch_utc == "2026-10-07T12:00:10Z"


def test_engine_propagate():
    engine = AegisOrbitEngine()
    req = PropagateOrbitRequest(
        satellite_id="SAT-AEGIS-01",
        initial_state=CartesianStateModel(
            r_eci_km=[6878.137, 0.0, 0.0],
            v_eci_km_s=[0.0, 7.612, 0.0],
            epoch_utc="2026-10-07T12:00:00Z",
        ),
        step_duration_seconds=30.0,
        mass_kg=260.0,
        cross_sectional_area_m2=1.8,
    )
    res = engine.propagate(req)
    assert res.final_state.r_eci_km[1] > 0.0
    assert res.keplerian_elements.semi_major_axis_km > 6000.0
    assert res.computation_time_ms >= 0.0


def test_conjunction_evaluation_critical():
    engine = AegisOrbitEngine()
    # High-risk close conjunction (miss distance 15m, tight covariance)
    req = ConjunctionEvaluationRequest(
        primary_norad_id=54201,
        secondary_norad_id=98402,
        miss_distance_ric_meters=[8.0, 10.0, 5.0],
        primary_covariance_3sigma_m=[10.0, 20.0, 10.0],
        secondary_covariance_3sigma_m=[12.0, 25.0, 12.0],
        combined_hard_body_radius_m=8.5,
        tca_epoch_utc="2026-10-07T14:30:00Z",
    )
    res = engine.evaluate_conjunction(req)
    assert res.action_required is True
    assert res.probability_of_collision_pc >= 1.0e-4
    assert res.severity in [ConjunctionSeverity.CRITICAL, ConjunctionSeverity.ACTION_REQUIRED]
    assert res.miss_distance_total_m > 0.0


def test_conjunction_evaluation_monitoring():
    engine = AegisOrbitEngine()
    # Low-risk conjunction (miss distance 15,000m)
    req = ConjunctionEvaluationRequest(
        primary_norad_id=54201,
        secondary_norad_id=98402,
        miss_distance_ric_meters=[5000.0, 12000.0, 6000.0],
        primary_covariance_3sigma_m=[15.0, 45.0, 18.0],
        secondary_covariance_3sigma_m=[35.0, 110.0, 42.0],
        combined_hard_body_radius_m=8.5,
        tca_epoch_utc="2026-10-07T14:30:00Z",
    )
    res = engine.evaluate_conjunction(req)
    assert res.action_required is False
    assert res.probability_of_collision_pc < 1.0e-4
    assert res.severity == ConjunctionSeverity.MONITORING


def test_conjunction_evaluation_action_required():
    engine = AegisOrbitEngine()
    # Moderate encounter: pc between 1e-4 and 1e-3 (0.0005)
    req = ConjunctionEvaluationRequest(
        primary_norad_id=54201,
        secondary_norad_id=98402,
        miss_distance_ric_meters=[60.0, 0.0, 60.0],
        primary_covariance_3sigma_m=[20.0, 30.0, 20.0],
        secondary_covariance_3sigma_m=[20.0, 30.0, 20.0],
        combined_hard_body_radius_m=8.5,
        tca_epoch_utc="2026-10-07T14:30:00Z",
    )
    res = engine.evaluate_conjunction(req)
    assert res.action_required is True
    assert res.severity == ConjunctionSeverity.ACTION_REQUIRED


def test_propagate_step_invalid_epoch():
    state = CartesianStateModel(
        r_eci_km=[6878.137, 0.0, 0.0],
        v_eci_km_s=[0.0, 7.612, 0.0],
        epoch_utc="INVALID_DATE_FORMAT",
    )
    next_state = propagate_step_rk4(state, dt_seconds=10.0)
    assert next_state.r_eci_km[1] > 0.0


def test_maneuver_optimization():
    engine = AegisOrbitEngine()
    req = ManeuverOptimizationRequest(
        satellite_id="SAT-AEGIS-01",
        semi_major_axis_km=6928.137,
        time_to_tca_seconds=7200.0,
        target_miss_distance_m=1000.0,
        current_miss_ric_m=[30.0, 120.0, 15.0],
        thruster_isp_seconds=1800.0,
    )
    res = engine.optimize_maneuver(req)
    assert res.magnitude_mps > 0.0
    assert len(res.delta_v_ric_mps) == 3
    assert res.propellant_kg > 0.0
    assert res.burn_duration_seconds > 0.0
    assert res.projected_new_miss_distance_m >= 1000.0


def test_engine_health_and_diagnostics():
    engine = AegisOrbitEngine()
    telemetry = engine.get_telemetry_stream()
    assert telemetry.active_satellites_count == 12
    assert telemetry.sla_budget_ms == 8.2

    health = engine.get_health()
    assert health.status == "HEALTHY"
    assert health.engine_version == "1.0.0-PROD"

    compliance = engine.get_compliance()
    assert compliance.engine_id == "GF-T3-142"
    assert compliance.copyleft_violations == 0
