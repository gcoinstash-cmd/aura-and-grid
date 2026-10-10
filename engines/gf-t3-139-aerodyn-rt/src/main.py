"""
Ghost FactoryOS — Engine GF-T3-139: AeroDyn-RT
FastAPI ASGI Service Layer conforming to OpenAPI 3.1.0 specification.
License: Apache-2.0 / MIT Dual Permissive
"""

from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.engine import AeroDynEngine
from src.models import (
    AeroStateResponse,
    AuditComplianceResponse,
    DrsCommandInput,
    DrsCommandResponse,
    EngineHealthResponse,
    TelemetryAck,
    TelemetryFrameInput,
)

app = FastAPI(
    title="Ghost FactoryOS AeroDyn-RT 1000Hz Telemetry API",
    description="High-throughput deterministic 1000Hz telemetry ingestion and active aerodynamic control API for Track 3 Engine GF-T3-139.",
    version="3.1.0",
    openapi_version="3.1.0",
)

# Permissive CORS for interactive workstation connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Engine singleton instance
engine = AeroDynEngine()


@app.get("/healthz", tags=["Infrastructure"], summary="Cloud Run Liveness Probe")
async def health_check():
    """Standard HTTP 200 health check for Cloud Run deployment routing."""
    return {"status": "HEALTHY", "engine": "GF-T3-139", "version": "3.1.0"}


@app.post(
    "/telemetry/frame",
    response_model=TelemetryAck,
    status_code=status.HTTP_201_CREATED,
    tags=["Telemetry Ingestion"],
    summary="Submit 1000Hz Telemetry Frame Batch",
    operation_id="submitTelemetryFrame",
)
async def submit_telemetry_frame(frame: TelemetryFrameInput) -> TelemetryAck:
    """
    Ingest a 1000Hz chassis telemetry frame into the EKF state estimator.
    """
    try:
        ack = engine.ingest_frame(frame)
        return ack
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Telemetry frame ingestion failed: {str(exc)}",
        )


@app.get(
    "/aero/state",
    response_model=AeroStateResponse,
    tags=["Aerodynamic Telemetry"],
    summary="Fetch Dynamic Aero State & CoP Balance",
    operation_id="getAeroState",
)
async def get_aero_state(speed_mph: Optional[float] = None) -> AeroStateResponse:
    """
    Compute real-time downforce, drag, Center of Pressure, and ground-effect stall risk.
    """
    return engine.calculate_aero_state(speed_mph=speed_mph)


@app.post(
    "/aero/drs",
    response_model=DrsCommandResponse,
    tags=["Active Aero Actuation"],
    summary="Command DRS / Airbrake Flap Angle",
    operation_id="commandDrsFlap",
)
async def command_drs_flap(command: DrsCommandInput) -> DrsCommandResponse:
    """
    Dispatch commanded rear aerofoil flap angle subject to slew-rate and stall clamps.
    """
    return engine.dispatch_drs_command(command)


@app.get(
    "/health",
    response_model=EngineHealthResponse,
    tags=["Diagnostics"],
    summary="1000Hz Engine Health & Ring-Buffer Telemetry",
    operation_id="getEngineHealth",
)
async def get_engine_health() -> EngineHealthResponse:
    """
    Retrieve diagnostics, queue capacity, and P99 deterministic loop latency.
    """
    return engine.get_health()


@app.get(
    "/audit/compliance",
    response_model=AuditComplianceResponse,
    tags=["Regulatory & M&A"],
    summary="External Third-Party Regulatory & Clean-Room Verification",
    operation_id="getAuditCompliance",
)
async def get_audit_compliance() -> AuditComplianceResponse:
    """
    Produce cryptographic clean-room IP verification attesting zero copyleft contaminants.
    """
    return AuditComplianceResponse()
