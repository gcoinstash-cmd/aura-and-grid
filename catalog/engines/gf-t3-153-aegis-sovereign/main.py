"""
GF-T3-153: AegisSovereign Engine — ASGI Gateway Service
Exposes OpenAPI 3.1 REST & health endpoints for Cloud Run multi-region ingress.
"""

import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.core.settlement_engine import (
    AtomicSettlementEngine,
    DvPState,
    DvPTransaction
)

app = FastAPI(
    title="AegisSovereign Engine // GF-T3-153",
    description="Multi-Party Threshold Signature Scheme (TSS) & Atomic DvP Settlement Core",
    version="1.0.0-PROD",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory settlement engine instance
engine = AtomicSettlementEngine(threshold_k=3, total_n=5)
trades_db = {}


class SettlementInitiateRequest(BaseModel):
    asset_ticker: str = Field(..., example="UST-2028-TKN")
    asset_units: int = Field(..., example=50000_00000000)
    cash_ticker: str = Field(..., example="USDC-INSTITUTIONAL")
    cash_units: int = Field(..., example=49850000_000000)
    asset_seller: str = Field(..., example="BLACKROCK_TREASURY_DESK")
    cash_buyer: str = Field(..., example="JPM_INSTITUTIONAL_DVP")
    timeout_ms: int = Field(5000, example=5000)


class SettlementExecuteRequest(BaseModel):
    trade_id: str
    participating_nodes: List[int] = Field([1, 2, 3], example=[1, 2, 3])
    simulate_cash_leg_timeout: bool = False
    simulate_rogue_node_id: Optional[int] = None


@app.get("/healthz", status_code=status.HTTP_200_OK)
def health_check():
    """Cloud Run container liveness and readiness probe."""
    return {
        "status": "HEALTHY",
        "asset_tag": "GF-T3-153",
        "engine": "AegisSovereign Core",
        "tss_threshold": f"{engine.threshold_k}-of-{engine.total_n} FROST",
        "active_enclaves": 5,
        "timestamp_epoch_ms": int(time.time() * 1000)
    }


@app.post("/api/v1/settlement/initiate", status_code=status.HTTP_201_CREATED)
def initiate_settlement(req: SettlementInitiateRequest):
    trade = engine.initialize_dvp_trade(
        asset_ticker=req.asset_ticker,
        asset_units=req.asset_units,
        cash_ticker=req.cash_ticker,
        cash_units=req.cash_units,
        asset_seller=req.asset_seller,
        cash_buyer=req.cash_buyer,
        timeout_ms=req.timeout_ms
    )
    trades_db[trade.trade_id] = trade
    return {
        "trade_id": trade.trade_id,
        "nonce": trade.settlement_nonce,
        "state": trade.state.value,
        "state_root": trade.state_root,
        "asset_leg": trade.asset_leg.__dict__,
        "cash_leg": trade.cash_leg.__dict__
    }


@app.post("/api/v1/settlement/execute", status_code=status.HTTP_200_OK)
def execute_settlement(req: SettlementExecuteRequest):
    if req.trade_id not in trades_db:
        raise HTTPException(status_code=404, detail="Trade ID not found")

    trade = trades_db[req.trade_id]
    t0 = time.perf_counter()
    res = engine.execute_dvp_settlement(
        tx=trade,
        participating_node_ids=req.participating_nodes,
        simulate_cash_leg_timeout=req.simulate_cash_leg_timeout,
        simulate_rogue_node_id=req.simulate_rogue_node_id
    )
    latency_ms = (time.perf_counter() - t0) * 1000

    return {
        "trade_id": res.trade_id,
        "state": res.state.value,
        "state_root": res.state_root,
        "settlement_latency_ms": round(latency_ms, 3),
        "asset_leg_locked": res.asset_leg.locked_in_escrow,
        "cash_leg_locked": res.cash_leg.locked_in_escrow,
        "signature_verified": res.signature.verified if res.signature else False,
        "aggregate_z": hex(res.signature.z_aggregate) if res.signature else None,
        "signers": res.signature.signers if res.signature else [],
        "state_history": res.state_history
    }
