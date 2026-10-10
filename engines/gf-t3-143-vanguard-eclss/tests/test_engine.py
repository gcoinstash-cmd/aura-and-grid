"""
Ghost FactoryOS — Engine GF-T3-143: Vanguard-ECLSS Life Support Engine
Unit Tests for Psychrometric Thermodynamics, Sabatier Kinetics, PEM Electrolysis,
MIMO-MPC Gas Balancing, Water Recovery, and FDIR Triage.
License: Apache-2.0 / MIT Dual Permissive
"""

import math
import pytest
from src.engine import (
    VanguardECLSSEngine,
    calculate_saturation_vapor_pressure,
    calculate_actual_vapor_pressure,
    calculate_dew_point,
    calculate_humidity_ratio,
    calculate_enthalpy,
    solve_sabatier_kinetics,
    solve_electrolyzer_faraday,
)
from src.models import (
    AtmosphericBalanceRequest,
    BalanceStatusEnum,
    WaterRecoveryRequest,
    FDIRTriageRequest,
    AnomalyCategoryEnum,
    SeverityEnum,
    MetabolicActivityEnum,
)


def test_psychrometric_solvers():
    # Saturation pressure at 20°C should be ~2.338 kPa
    p_sat = calculate_saturation_vapor_pressure(20.0)
    assert 2.30 < p_sat < 2.40

    # Actual vapor pressure at 20°C and 50% RH
    pv = calculate_actual_vapor_pressure(20.0, 50.0)
    assert abs(pv - (0.50 * p_sat)) < 0.001

    # Dew point at 20°C and 50% RH should be ~9.27°C
    dew_point = calculate_dew_point(20.0, 50.0)
    assert 8.5 < dew_point < 10.0

    # Humidity ratio W at 20°C, 50% RH, 101.325 kPa
    w = calculate_humidity_ratio(20.0, 50.0, 101.325)
    assert 0.005 < w < 0.010

    # Enthalpy at 20°C, 50% RH, 101.325 kPa
    h = calculate_enthalpy(20.0, 50.0, 101.325)
    assert 30.0 < h < 50.0


def test_sabatier_kinetics():
    # 850 SCCM CO2 with stoichiometric 4:1 H2 (3400 SCCM) at 400°C and 150 kPa
    ch4, water_sccm, water_lph, eff_pct = solve_sabatier_kinetics(
        co2_feed_sccm=850.0,
        h2_feed_sccm=3400.0,
        reactor_temp_c=400.0,
        reactor_pressure_kpa=150.0,
    )
    assert eff_pct > 95.0
    assert ch4 > 800.0
    assert water_sccm > 1600.0
    assert water_lph > 0.05


def test_electrolyzer_faraday():
    # 60 Amps, 28.4 Volts, 24 cells
    o2_sccm, h2_sccm, water_lph, cell_eff = solve_electrolyzer_faraday(
        stack_current_amps=60.0,
        stack_voltage_volts=28.4,
        number_of_cells=24,
        degradation_pct=0.0,
    )
    assert o2_sccm > 800.0
    assert abs(h2_sccm - (2.0 * o2_sccm)) < 0.1
    assert water_lph > 0.05
    assert 50.0 <= cell_eff <= 95.0


def test_atmospheric_balance_optimal():
    engine = VanguardECLSSEngine()
    req = AtmosphericBalanceRequest(
        nodeId="VANGUARD-OUTPOST-01",
        totalPressureKpa=101.325,
        ppO2Kpa=21.28,
        ppCO2Kpa=0.36,
        ppN2Kpa=78.42,
        temperatureCelsius=21.5,
        relativeHumidityPct=45.2,
        crewHeadcount=6,
        metabolicActivity=MetabolicActivityEnum.NOMINAL,
    )
    res = engine.solve_atmospheric_balance(req)
    assert res.status == BalanceStatusEnum.OPTIMAL
    assert res.solverLatencyMs < 6.5
    assert res.actuatorCommands.o2InjectionRateGps > 0.0
    assert res.actuatorCommands.co2ScrubberBlowerDutyPct > 0.0
    assert len(res.activeConstraintViolations) == 0


def test_atmospheric_balance_constrained():
    engine = VanguardECLSSEngine()
    # Hypoxia and elevated CO2 within constrained boundaries
    req = AtmosphericBalanceRequest(
        totalPressureKpa=99.0,
        ppO2Kpa=19.2,
        ppCO2Kpa=0.45,
        crewHeadcount=6,
        metabolicActivity=MetabolicActivityEnum.STRENUOUS_EVA,
    )
    res = engine.solve_atmospheric_balance(req)
    assert res.status == BalanceStatusEnum.CONSTRAINED
    assert len(res.activeConstraintViolations) >= 2


def test_atmospheric_balance_hyperoxia_overpressure():
    engine = VanguardECLSSEngine()
    # High O2 (>23.1) and high total pressure (>103.4)
    req = AtmosphericBalanceRequest(
        totalPressureKpa=104.5,
        ppO2Kpa=24.0,
        ppCO2Kpa=0.30,
        crewHeadcount=4,
    )
    res = engine.solve_atmospheric_balance(req)
    assert res.status == BalanceStatusEnum.CONSTRAINED
    assert any("HYPEROXIA" in v for v in res.activeConstraintViolations)
    assert any("OVERPRESSURE" in v for v in res.activeConstraintViolations)


def test_atmospheric_balance_emergency_override():
    engine = VanguardECLSSEngine()
    # Severe barometric decompression below 95 kPa
    req = AtmosphericBalanceRequest(
        totalPressureKpa=92.0,
        ppO2Kpa=18.0,
        ppCO2Kpa=0.72,
        crewHeadcount=6,
        metabolicActivity=MetabolicActivityEnum.REST,
    )
    res = engine.solve_atmospheric_balance(req)
    assert res.status == BalanceStatusEnum.EMERGENCY_OVERRIDE


def test_water_recovery():
    engine = VanguardECLSSEngine()
    req = WaterRecoveryRequest(
        nodeId="VANGUARD-OUTPOST-01",
        greywaterInflowLph=3.85,
        urineDistillateInflowLph=1.25,
        distillateConductivityMicroSiemens=0.08,
        catalyticOxidizerTempC=135.0,
    )
    res = engine.calculate_water_recovery(req)
    assert res.potableYieldLph > 4.5
    assert res.loopRecoveryEfficiencyPct > 95.0
    assert res.totalOrganicCarbonPpb < 200.0
    assert res.potableQualityStandardMet is True
    assert res.estimatedFilterBedHoursRemaining > 1000.0


def test_fdir_triage_all_categories():
    engine = VanguardECLSSEngine()

    # 1. Decompression
    req_dec = FDIRTriageRequest(
        anomalyCategory=AnomalyCategoryEnum.DECOMPRESSION,
        deltaPressureRateKpaPerSec=-0.18,
        currentTotalPressureKpa=98.2,
    )
    res_dec = engine.execute_fdir_triage(req_dec)
    assert res_dec.severity == SeverityEnum.CRITICAL
    assert len(res_dec.automatedValvesEngaged) > 0
    assert "SEAL_COMPARTMENT_ALPHA" in res_dec.crewEgressAdvisory

    # 2. Sabatier Quench
    req_sab = FDIRTriageRequest(anomalyCategory=AnomalyCategoryEnum.SABATIER_QUENCH)
    res_sab = engine.execute_fdir_triage(req_sab)
    assert res_sab.severity == SeverityEnum.WARNING
    assert "PURGE_SABATIER_N2" in res_sab.prescribedProtocol

    # 3. OGS Degradation
    req_ogs = FDIRTriageRequest(anomalyCategory=AnomalyCategoryEnum.OGS_DEGRADATION)
    res_ogs = engine.execute_fdir_triage(req_ogs)
    assert res_ogs.severity == SeverityEnum.WARNING
    assert "REDUCE_OGS_STACK_CURRENT" in res_ogs.prescribedProtocol

    # 4. VOC Spike
    req_voc = FDIRTriageRequest(anomalyCategory=AnomalyCategoryEnum.VOC_SPIKE)
    res_voc = engine.execute_fdir_triage(req_voc)
    assert res_voc.severity == SeverityEnum.ADVISORY
    assert "MAXIMIZE_TCCS_BLOWER_CFM" in res_voc.prescribedProtocol


def test_engine_health_telemetry_compliance():
    engine = VanguardECLSSEngine()
    telemetry = engine.get_telemetry_stream()
    assert telemetry.nodeId == "VANGUARD-OUTPOST-01"
    assert telemetry.slaBudgetMs == 6.5
    assert telemetry.systemHealthScore >= 90.0

    health = engine.get_health()
    assert health.status == "HEALTHY"
    assert health.engineVersion == "1.0.0-PROD"

    compliance = engine.get_compliance()
    assert compliance.engineId == "GF-T3-143"
    assert compliance.copyleftViolations == 0
    assert "MIMO-MPC" in compliance.mathematicalProof
