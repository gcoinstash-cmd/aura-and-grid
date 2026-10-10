"""
AeroVex CBF Engine // GF-T3-158
FastAPI Production Gateway & Control Barrier Function Deconfliction Microservice
"""

import os, time, uuid
from typing import Dict, List, Optional, Any
import numpy as np
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from aerovex_cbf_solver import AeroVexCBFSolver, AgentState, IntruderObstacle, CBFParams

app = FastAPI(
    title="AeroVex CBF Deconfliction API",
    version="1.5.8-T3",
    description="GF-T3-158 Multi-Agent Trajectory Deconfliction via Control Barrier Functions"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

solver = AeroVexCBFSolver()

class DeconflictRequest(BaseModel):
    agent_id: int = 1
    pos: List[float] = [100.0, 100.0]
    vel: List[float] = [2.0, 0.0]
    nominal_vel: List[float] = [2.0, 0.0]

@app.get("/healthz", tags=["Telemetry"])
def healthz():
    return {
        "status": "HEALTHY",
        "asset": "GF-T3-158",
        "codename": "AeroVex CBF Engine",
        "track": "Track 3 Skunkworks",
        "target_latency_us": 15.0
    }

@app.post("/api/v1/cbf/solve", tags=["Deconfliction"])
def solve_cbf(req: DeconflictRequest):
    agent = AgentState(
        id=req.agent_id,
        pos=np.array(req.pos, dtype=np.float64),
        vel=np.array(req.vel, dtype=np.float64),
        nominal_vel=np.array(req.nominal_vel, dtype=np.float64)
    )
    solution = solver.solve(agent, [])
    return {
        "u_opt": solution.u_opt.tolist(),
        "delta_u": solution.delta_u.tolist(),
        "h_min": float(solution.h_min),
        "is_deflecting": solution.is_deflecting,
        "solve_time_us": solution.solve_time_us
    }

@app.get("/api/v1/telemetry", tags=["Telemetry"])
def get_telemetry():
    return {
        "status": "ONLINE",
        "engine": "AeroVex CBF"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server:app", host="0.0.0.0", port=port)
