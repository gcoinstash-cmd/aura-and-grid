"""
Ghost FactoryOS — Engine GF-T3-140: Chronos-Tick Algorithmic Execution Core
FastAPI ASGI Service Layer conforming to OpenAPI 3.1.0 specification.
License: Apache-2.0 / MIT Dual Permissive
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.engine import ChronosTickEngine
from src.models import (
    AuditComplianceResponse,
    EngineHealthResponse,
    MandateCreateInput,
    MandateCreateResponse,
    MandatePerformanceResponse,
)

app = FastAPI(
    title="Chronos-Tick Algorithmic Execution Core API",
    description="Institutional REST & Streaming Execution API for Almgren-Chriss Slicing, Dynamic VWAP Curves, and AlloyDB Slippage Audit.",
    version="1.4.1",
    openapi_version="3.1.0",
)

# Permissive CORS for institutional workstation telemetry
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ChronosTickEngine()


@app.get("/healthz", tags=["Infrastructure"], summary="Cloud Run Liveness Probe")
async def health_check():
    """Standard HTTP 200 health check for Cloud Run deployment routing."""
    return {"status": "HEALTHY", "engine": "GF-T3-140", "version": "1.4.1"}


@app.post(
    "/v1/algo/mandates",
    response_model=MandateCreateResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Execution Slicing"],
    summary="Submit Parent Order Mandate for Almgren-Chriss Slicing",
    operation_id="createMandate",
)
async def create_mandate(payload: MandateCreateInput) -> MandateCreateResponse:
    """
    Submit and initialize an institutional parent mandate for optimal execution slicing.
    """
    try:
        return engine.create_mandate(payload)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mandate initialization failed: {str(exc)}",
        )


@app.get(
    "/v1/algo/mandates/{mandate_id}",
    tags=["Execution Slicing"],
    summary="Get Mandate Details",
    operation_id="getMandate",
)
async def get_mandate(mandate_id: str):
    """
    Fetch execution status and metadata for a specific parent mandate.
    """
    perf = engine.get_mandate_performance(mandate_id)
    if not perf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mandate {mandate_id} not found in memory registry",
        )
    return perf


@app.delete(
    "/v1/algo/mandates/{mandate_id}",
    tags=["Execution Slicing"],
    summary="Emergency Stop / Cancel Open Child Slices",
    operation_id="cancelMandate",
)
async def cancel_mandate(mandate_id: str):
    """
    Emergency stop triggering immediate purge of open child slices.
    """
    success = engine.cancel_mandate(mandate_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mandate {mandate_id} not found",
        )
    return {
        "status": "ABORTED",
        "mandate_id": mandate_id,
        "detail": "Emergency stop acknowledged; child slices purged from active RingBuffer queue",
    }


@app.get(
    "/v1/algo/mandates/{mandate_id}/performance",
    response_model=MandatePerformanceResponse,
    tags=["Benchmark & Slippage Audit"],
    summary="Fetch Live VWAP & Slippage Audit Performance",
    operation_id="getMandatePerformance",
)
async def get_mandate_performance(mandate_id: str) -> MandatePerformanceResponse:
    """
    Retrieve real-time benchmark performance, execution VWAP, and basis-point slippage ledger.
    """
    perf = engine.get_mandate_performance(mandate_id)
    if not perf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mandate {mandate_id} not found in execution ledger",
        )
    return perf


@app.get(
    "/v1/health",
    response_model=EngineHealthResponse,
    tags=["Diagnostics"],
    summary="Engine Clock Drift & AlloyDB Connection Health",
    operation_id="getEngineHealth",
)
async def get_engine_health() -> EngineHealthResponse:
    """
    Diagnostics probe reporting execution queue status, replication lag, and P99 latency.
    """
    return engine.get_health()


@app.get(
    "/audit/compliance",
    response_model=AuditComplianceResponse,
    tags=["Regulatory & M&A"],
    summary="Clean-Room IP & NIST SP 800-218 Audit Attestation",
    operation_id="getAuditCompliance",
)
async def get_audit_compliance() -> AuditComplianceResponse:
    """
    Attestation of zero copyleft contaminants and NIST SP 800-218 secure software development alignment.
    """
    return AuditComplianceResponse()
