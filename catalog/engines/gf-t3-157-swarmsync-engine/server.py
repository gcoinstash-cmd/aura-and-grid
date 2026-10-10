"""
SwarmSync Engine // GF-T3-157
FastAPI Production Gateway & Multi-Agent Swarm Orchestration Microservice
"""

import os, time, uuid
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src.core.swarm_engine import SwarmSyncEngine, Vector2D

app = FastAPI(
    title="SwarmSync Swarm Orchestration API",
    version="1.5.7-T3",
    description="GF-T3-157 Decentralized Consensus & Collision-Free Swarm Flocking Core"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = SwarmSyncEngine(node_count=32)

class StepRequest(BaseModel):
    dt: float = 0.05
    target_x: Optional[float] = 500.0
    target_y: Optional[float] = 500.0

class ObstacleRequest(BaseModel):
    id: str = Field(default_factory=lambda: f"obs_{uuid.uuid4().hex[:6]}")
    x: float
    y: float
    radius: float = 30.0

@app.get("/healthz", tags=["Telemetry"])
def healthz():
    return {
        "status": "HEALTHY",
        "asset": "GF-T3-157",
        "codename": "SwarmSync Engine",
        "track": "Track 3 Skunkworks",
        "node_count": engine.node_count,
        "obstacle_count": len(engine.obstacles),
        "target_latency_us": 10.0
    }

@app.post("/api/v1/swarm/step", tags=["Simulation"])
def step_swarm(req: StepRequest):
    target = Vector2D(req.target_x, req.target_y) if req.target_x is not None else None
    metrics = engine.step(req.dt, target)
    return {
        "metrics": metrics,
        "node_sample": [
            {
                "id": n.id,
                "x": round(n.pos.x, 2),
                "y": round(n.pos.y, 2),
                "vx": round(n.vel.x, 2),
                "vy": round(n.vel.y, 2),
                "consensus_val": round(n.consensus_value, 2)
            }
            for n in engine.nodes[:8]
        ]
    }

@app.post("/api/v1/swarm/obstacle", tags=["Simulation"])
def add_obstacle(req: ObstacleRequest):
    obs = engine.add_obstacle(req.id, req.x, req.y, req.radius)
    return {"status": "ADDED", "id": obs.id, "x": obs.x, "y": obs.y, "radius": obs.radius}

@app.get("/api/v1/telemetry", tags=["Telemetry"])
def get_telemetry():
    return {
        "status": "ONLINE",
        "engine": "SwarmSync",
        "nodes": len(engine.nodes)
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server:app", host="0.0.0.0", port=port)
