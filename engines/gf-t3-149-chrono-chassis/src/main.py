"""
Ghost FactoryOS — Engine GF-T3-149: Chrono-Chassis Telemetry Interface
Production FastAPI ASGI Application & High-Frequency Telemetry Gateway.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive.
"""

from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.models import (
    TelemetryState,
    DriveModeRequest,
    DiffuserAngleRequest,
    ShockEventRequest,
    ActionResponse,
    ArbitrageVector,
    EngineHealthResponse,
    AuditComplianceResponse,
)
from src.engine import ChronoChassisEngine

app = FastAPI(
    title="Chrono-Chassis Telemetry Interface API",
    version="1.0.0-PROD",
    description="Production REST & WebSocket API specification for GF-T3-149 Chrono-Chassis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ChronoChassisEngine()


@app.get("/healthz", tags=["Health"])
def healthz():
    """Liveness probe for Cloud Run / Kubernetes."""
    return {"status": "healthy", "service": "gf-t3-149-chrono-chassis", "version": "1.0.0-PROD"}


@app.get("/v1/health", response_model=EngineHealthResponse, tags=["Health"])
def engine_health():
    """Engine operational telemetry & health check."""
    return engine.get_health()


@app.get("/audit/compliance", response_model=AuditComplianceResponse, tags=["Compliance"])
def audit_compliance():
    """Clean-Room and NIST SP 800-218 compliance manifest."""
    return engine.get_compliance()


@app.get(
    "/api/v1/telemetry/state",
    response_model=TelemetryState,
    tags=["Telemetry"],
    summary="Retrieve full high-frequency telemetry state snapshot",
)
def get_telemetry_state():
    """
    Returns latest aggregated telemetry snapshot (quantum, aero, routes).
    """
    return engine.tick()


@app.post(
    "/api/v1/telemetry/drive-mode",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Set active hypercar drive mode",
)
def set_drive_mode(request: DriveModeRequest):
    """
    Switches drive mode and applies quantum/aerodynamic parameter modifiers.
    """
    try:
        new_state = engine.set_drive_mode(request.mode)
        return ActionResponse(
            status="SUCCESS",
            message=f"Drive mode updated to {request.mode}",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update drive mode: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/diffuser-angle",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Update active rear Venturi diffuser angle",
)
def set_diffuser_angle(request: DiffuserAngleRequest):
    """
    Recomputes ground-effect Venturi suction load and aerodynamic downforce.
    """
    try:
        new_state = engine.set_diffuser_angle(request.angle)
        return ActionResponse(
            status="SUCCESS",
            message=f"Diffuser angle set to {request.angle} deg",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update diffuser angle: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/shock-event",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Inject volatility or warp burst shock event into telemetry stream",
)
def trigger_shock_event(request: ShockEventRequest):
    """
    Simulates flash volatility burst, decoherence pulse, or warp burst.
    """
    try:
        new_state = engine.trigger_shock_event(request.shock_type)
        return ActionResponse(
            status="SUCCESS",
            message=f"Injected shock event: {request.shock_type}",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to execute shock event: {str(e)}",
        )


@app.get(
    "/api/v1/telemetry/routes",
    response_model=List[ArbitrageVector],
    tags=["Arbitrage"],
    summary="List active global arbitrage vectors and latency differentials",
)
def get_routes():
    """
    Returns array of monitored financial venue routes with fiber vs quantum latency metrics.
    """
    return engine.get_routes()


@app.post(
    "/api/v1/telemetry/cryo-pump/toggle",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Toggle dilution refrigeration cooling pump",
)
def toggle_cryo_pump():
    """
    Toggles cryogenic cooling pump status.
    """
    try:
        new_state = engine.toggle_cryo_pump()
        status_str = "ACTIVE" if new_state.coolingPumpActive else "INACTIVE"
        return ActionResponse(
            status="SUCCESS",
            message=f"Cryogenic cooling pump is now {status_str}",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to toggle cryo pump: {str(e)}",
        )
