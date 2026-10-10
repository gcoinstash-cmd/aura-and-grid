"""
Ghost FactoryOS — Engine GF-T3-142: Aegis-Orbit Mission Control Engine
FastAPI ASGI Service Layer conforming to OpenAPI 3.1.0 specification.
License: Apache-2.0 / MIT Dual Permissive
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.engine import AegisOrbitEngine
from src.models import (
    PropagateOrbitRequest,
    PropagateOrbitResponse,
    ConjunctionEvaluationRequest,
    ConjunctionEvaluationResponse,
    ManeuverOptimizationRequest,
    ManeuverOptimizationResponse,
    TelemetryStreamPayload,
    EngineHealthResponse,
    AuditComplianceResponse,
)

app = FastAPI(
    title="Aegis-Orbit Autonomous Constellation Flight Dynamics & CARA Engine",
    description=(
        "Ghost FactoryOS Fleet Track 3 F1 Skunkworks Engine (Asset GF-T3-142). "
        "Zero-placeholder REST API specification for autonomous LEO constellation stationkeeping, "
        "high-order gravitational perturbation propagation, Clohessy-Wiltshire proximity operations, "
        "and Conjunction Assessment & Risk Analysis (CARA)."
    ),
    version="1.0.0-PROD",
    openapi_version="3.1.0",
)

# Permissive CORS for flight telemetry dashboards and ground station consoles
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AegisOrbitEngine()


@app.get("/healthz", tags=["Infrastructure"], summary="Cloud Run Liveness Probe")
async def health_check():
    """Standard HTTP 200 health check for Cloud Run container routing."""
    return {"status": "HEALTHY", "engine": "GF-T3-142", "version": "1.0.0-PROD"}


@app.post(
    "/orbit/propagate",
    response_model=PropagateOrbitResponse,
    status_code=status.HTTP_200_OK,
    tags=["Orbital Dynamics"],
    summary="Propagate 6-DOF Orbital State Vector with J2-J4 Harmonics & Drag",
    operation_id="propagateOrbitStep",
)
async def propagate_orbit(req: PropagateOrbitRequest) -> PropagateOrbitResponse:
    """
    Integrates 6-DOF Cartesian state vector over specified time interval
    using 4th-order Runge-Kutta numerical integration with WGS-84 gravitational harmonics.
    """
    try:
        return engine.propagate(req)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Orbit propagation failed: {str(exc)}",
        ) from exc


@app.post(
    "/conjunction/evaluate",
    response_model=ConjunctionEvaluationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Conjunction Assessment (CARA)"],
    summary="Evaluate Encounter Risk, Miss Distance, and Foster Collision Probability (Pc)",
    operation_id="evaluateConjunctionRisk",
)
async def evaluate_conjunction(req: ConjunctionEvaluationRequest) -> ConjunctionEvaluationResponse:
    """
    Calculates 2D collision probability (Pc) in the encounter B-plane using Foster-1992
    numerical integration and Chan's analytical series expansion.
    """
    try:
        return engine.evaluate_conjunction(req)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Conjunction evaluation failed: {str(exc)}",
        ) from exc


@app.post(
    "/maneuver/optimize",
    response_model=ManeuverOptimizationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Proximity Operations & Maneuvers"],
    summary="Compute Optimal Impulsive Collision Avoidance Maneuver (CAM) Delta-V",
    operation_id="optimizeAvoidanceManeuver",
)
async def optimize_maneuver(req: ManeuverOptimizationRequest) -> ManeuverOptimizationResponse:
    """
    Computes optimal impulsive delta-V burn vector using Clohessy-Wiltshire (Hill's LVLH)
    relative motion equations and calculates Tsiolkovsky propellant mass.
    """
    try:
        return engine.optimize_maneuver(req)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maneuver optimization failed: {str(exc)}",
        ) from exc


@app.get(
    "/telemetry/stream",
    response_model=TelemetryStreamPayload,
    tags=["Telemetry"],
    summary="Constellation Flight Telemetry Metrics",
    operation_id="getTelemetryStream",
)
async def get_telemetry_stream() -> TelemetryStreamPayload:
    """Returns real-time constellation flight dynamics telemetry metrics and compute latency."""
    return engine.get_telemetry_stream()


@app.get(
    "/v1/health",
    response_model=EngineHealthResponse,
    tags=["Infrastructure"],
    summary="Detailed Engine Health Diagnostics",
)
async def get_health_diagnostics() -> EngineHealthResponse:
    """Returns detailed operational health, loop frequency, and clean-room compliance status."""
    return engine.get_health()


@app.get(
    "/audit/compliance",
    response_model=AuditComplianceResponse,
    tags=["Compliance"],
    summary="NIST SP 800-218 and Clean-Room IP Compliance Audit",
)
async def get_audit_compliance() -> AuditComplianceResponse:
    """Returns formal clean-room IP verification and mathematical proof manifest."""
    return engine.get_compliance()
