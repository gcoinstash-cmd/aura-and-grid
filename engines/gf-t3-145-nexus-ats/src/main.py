"""
Ghost FactoryOS — Engine GF-T3-145: Nexus-ATS Matching Engine
Production FastAPI ASGI Application & Order Gateway.
Clean-Room Certified: MIT / Apache-2.0 Dual Permissive.
"""

from typing import Optional
from fastapi import FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.models import (
    OrderSubmissionRequest,
    OrderSubmissionResponse,
    OrderCancelRequest,
    OrderCancelResponse,
    OrderBookSnapshotResponse,
    DarkCrossRequest,
    DarkCrossResponse,
    ToxicityMetricsResponse,
    EngineHealthResponse,
    AuditComplianceResponse,
)
from src.engine import NexusATSEngine

app = FastAPI(
    title="Nexus-ATS Ultra-Low Latency Order Gateway",
    version="1.0.0",
    description="Production REST/SBE Gateway for Ghost FactoryOS Fleet Track 3 Asset GF-T3-145 (Nexus-ATS Hybrid Central Limit Order Book & Dark Pool Crossing Engine).",
)

# Enable CORS for institutional frontends and monitoring consoles
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engine instance
engine = NexusATSEngine(instrument_id="GF-US-100")


@app.get("/healthz", tags=["Health"])
def healthz():
    """Liveness probe for Cloud Run / Kubernetes."""
    return {"status": "healthy", "service": "gf-t3-145-nexus-ats", "version": "1.0.0-PROD"}


@app.get("/v1/health", response_model=EngineHealthResponse, tags=["Health"])
def engine_health():
    """Engine operational telemetry & health check."""
    return engine.get_health()


@app.get("/audit/compliance", response_model=AuditComplianceResponse, tags=["Compliance"])
def audit_compliance():
    """Clean-Room and NIST SP 800-218 compliance manifest."""
    return engine.get_compliance()


@app.post(
    "/api/v1/order/submit",
    response_model=OrderSubmissionResponse,
    tags=["Order Gateway"],
    summary="Submit Institutional Order (Lit CLOB or Dark Pool Peg)",
)
def submit_order(
    request: OrderSubmissionRequest,
    x_participant_mpid: Optional[str] = Header(default="GHTF", alias="X-Participant-MPID"),
    x_sbe_sequence_num: Optional[int] = Header(default=None, alias="X-SBE-Sequence-Num"),
):
    """
    Ingests Limit, Market, IOC, FOK, or Midpoint Peg orders into the deterministic matching ring with microsecond routing.
    """
    try:
        mpid = x_participant_mpid or "GHTF"
        response = engine.submit_order(request, mpid=mpid)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order rejected by matching engine: {str(e)}",
        )


@app.post(
    "/api/v1/order/cancel",
    response_model=OrderCancelResponse,
    tags=["Order Gateway"],
    summary="Cancel Active Resting Order (O(1) Tree Pruning)",
)
def cancel_order(request: OrderCancelRequest):
    """
    Instantly cancels an unallocated resting limit or dark peg order from the double-linked priority ring.
    """
    try:
        response = engine.cancel_order(request.order_id)
        if response.status == "NOT_FOUND":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order ID {request.order_id} not found in resting book",
            )
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cancellation error: {str(e)}",
        )


@app.get(
    "/api/v1/book/depth",
    response_model=OrderBookSnapshotResponse,
    tags=["Market Data"],
    summary="Query Real-Time L2 Order Book Depth & NBBO Midpoint",
)
def get_book_depth(
    instrument_id: str = Query(default="GF-US-100", description="Security identifier"),
    levels: int = Query(default=10, ge=1, le=50, description="Depth levels to return"),
):
    """
    Returns top N aggregated price tiers, aggregate volumes, cumulative depths, and prevailing NBBO spread.
    """
    return engine.get_depth(levels=levels)


@app.post(
    "/api/v1/dark/cross",
    response_model=DarkCrossResponse,
    tags=["Dark Pool"],
    summary="Execute Discretionary Dark Pool Midpoint Cross",
)
def execute_dark_cross(
    request: DarkCrossRequest,
    x_participant_mpid: Optional[str] = Header(default="GHTF", alias="X-Participant-MPID"),
):
    """
    Direct crossing against non-displayed institutional peg orders at (NBBO_bid + NBBO_ask)/2 with MinQty enforcement.
    """
    try:
        mpid = x_participant_mpid or "GHTF"
        return engine.execute_dark_cross(request, mpid=mpid)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dark cross execution failed: {str(e)}",
        )


@app.get(
    "/api/v1/telemetry/vpin-hawkes",
    response_model=ToxicityMetricsResponse,
    tags=["Microstructure Telemetry"],
    summary="Retrieve Microstructure Flow Toxicity & Hawkes Process Metrics",
)
def get_toxicity_telemetry(
    instrument_id: str = Query(default="GF-US-100", description="Security identifier"),
):
    """
    Live VPIN index, volume bucket progress, Hawkes cancellation arrival intensity lambda2, and predatory spoofing scores.
    """
    return engine.get_toxicity()
