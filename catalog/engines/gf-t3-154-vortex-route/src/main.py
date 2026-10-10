"""
VortexRoute Engine // GF-T3-154
FastAPI Production Gateway & Smart Order Router Microservice
"""

import os, time, uuid
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.core.router_engine import (
    VortexRouteCore, OrderSide, VenueId, ParentOrder,
    build_default_institutional_books, from_fixed, to_fixed
)

app = FastAPI(
    title="VortexRoute Smart Order Router API",
    version="1.5.4-T3",
    description="GF-T3-154 High-Frequency Convex Liquidity Routing Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

core_engine = VortexRouteCore()
venue_books = build_default_institutional_books()

class OrderRouteRequest(BaseModel):
    order_id: str = Field(default_factory=lambda: f"ord_{uuid.uuid4().hex[:8]}")
    symbol: str = "BTC-USDT"
    side: str = "buy"
    quantity: float = 1.5
    urgency: float = 0.5

@app.get("/healthz", tags=["Telemetry"])
def healthz():
    return {
        "status": "HEALTHY",
        "asset": "GF-T3-154",
        "codename": "VortexRoute Engine",
        "track": "Track 3 Skunkworks",
        "venues_connected": len(venue_books),
        "target_latency_us": 20.0
    }

@app.post("/api/v1/route", tags=["Routing"])
def optimize_route(req: OrderRouteRequest):
    side = OrderSide.BUY if req.side.lower() == "buy" else OrderSide.SELL
    parent = ParentOrder(
        order_id=req.order_id,
        symbol=req.symbol,
        side=side,
        total_quantity=to_fixed(req.quantity),
        urgency=req.urgency,
        created_timestamp_ns=time.perf_counter_ns()
    )
    decision = core_engine.optimize_route(parent, venue_books)
    return {
        "parent_order_id": decision.parent_order_id,
        "side": decision.side.name,
        "effective_avg_price": from_fixed(decision.effective_avg_price_fixed),
        "total_slippage_bps": decision.total_slippage_bps,
        "fill_probability": round(decision.fill_probability, 4),
        "total_latency_penalty_ms": round(decision.total_latency_penalty_ms, 4),
        "allocations": [
            {
                "child_id": c.child_id,
                "venue_id": c.venue_id.name,
                "quantity": from_fixed(c.allocated_quantity_fixed),
                "limit_price": from_fixed(c.limit_price_fixed),
                "fill_probability": round(c.fill_probability, 4)
            }
            for c in decision.child_orders
        ]
    }

@app.get("/api/v1/telemetry", tags=["Telemetry"])
def get_telemetry():
    return {
        "status": "ONLINE",
        "engine": "VortexRoute",
        "venues": [v.name for v in venue_books.keys()]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server:app", host="0.0.0.0", port=port)
