"""
Ghost FactoryOS — Engine GF-T3-150: Chronos Kinetic-9 MagLev Telemetry Rig
Production FastAPI ASGI Application & Tactical Avionics Gateway.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive.
"""

from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.models import (
    VehicleTelemetry,
    RunModeRequest,
    FluxBiasRequest,
    SuspensionStiffnessRequest,
    ActionResponse,
    EngineHealthResponse,
    AuditComplianceResponse,
)
from src.engine import ChronosK9Engine

app = FastAPI(
    title="Chronos Kinetic-9 MagLev Telemetry Rig API",
    version="1.0.0-PROD",
    description="Production REST & WebSocket API specification for GF-T3-150 Chronos-K9.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ChronosK9Engine()


@app.get("/healthz", tags=["Health"])
def healthz():
    """Liveness probe for Cloud Run / Kubernetes."""
    return {"status": "healthy", "service": "gf-t3-150-chronos-k9", "version": "1.0.0-PROD"}


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
    response_model=VehicleTelemetry,
    tags=["Telemetry"],
    summary="Retrieve full tactical MagLev telemetry snapshot",
)
def get_telemetry_state():
    """
    Returns latest aggregated telemetry snapshot (bogies, cryo loop, capacitors, sectors).
    """
    return engine.tick()


@app.post(
    "/api/v1/telemetry/run-mode",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Set active MagLev operational run mode",
)
def set_run_mode(request: RunModeRequest):
    """
    Switches run mode between stationary levitation, launch, and max flux sprint.
    """
    try:
        new_state = engine.set_run_mode(request.run_mode)
        return ActionResponse(
            status="SUCCESS",
            message=f"Run mode transitioned to {request.run_mode}",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to set run mode: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/bogie/flux-bias",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Apply dynamic magnetic flux bias across quad bogies",
)
def set_flux_bias(request: FluxBiasRequest):
    """
    Adjusts magnetic flux bias percentage (-15% to +15%).
    """
    try:
        new_state = engine.set_flux_bias(request.bias_pct)
        return ActionResponse(
            status="SUCCESS",
            message=f"Magnetic flux bias updated to {request.bias_pct}%",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update flux bias: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/suspension/stiffness",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Adjust active electromagnetic suspension stiffness",
)
def set_suspension_stiffness(request: SuspensionStiffnessRequest):
    """
    Updates active suspension stiffness (120 to 320 N/mm).
    """
    try:
        new_state = engine.set_suspension_stiffness(request.stiffness_n_mm)
        return ActionResponse(
            status="SUCCESS",
            message=f"Suspension stiffness calibrated to {request.stiffness_n_mm} N/mm",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to calibrate suspension stiffness: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/brake/linear",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Toggle linear eddy-current braking system",
)
def toggle_linear_braking():
    """
    Engages or disengages linear eddy-current braking with regenerative capture.
    """
    try:
        new_state = engine.toggle_linear_braking()
        status_str = "ENGAGED" if new_state.linearBrakingEngaged else "DISENGAGED"
        return ActionResponse(
            status="SUCCESS",
            message=f"Linear eddy-current braking {status_str}",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to toggle linear braking: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/emergency/scram",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Trigger emergency magnetic SCRAM lock",
)
def trigger_emergency_scram():
    """
    Triggers critical emergency SCRAM lock and full deceleration.
    """
    try:
        new_state = engine.trigger_emergency_scram()
        return ActionResponse(
            status="SUCCESS",
            message="EMERGENCY MAGNETIC SCRAM EXECUTED — All stators locked.",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to trigger SCRAM: {str(e)}",
        )


@app.post(
    "/api/v1/telemetry/cryo/purge",
    response_model=ActionResponse,
    tags=["Control"],
    summary="Trigger cryogenic liquid helium purge cycle",
)
def trigger_cryo_purge():
    """
    Initiates emergency or maintenance purge of cryogenic LHe loop.
    """
    try:
        new_state = engine.trigger_cryo_purge()
        return ActionResponse(
            status="SUCCESS",
            message="Cryogenic loop purge cycle initiated.",
            telemetry=new_state,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to initiate cryo purge: {str(e)}",
        )
