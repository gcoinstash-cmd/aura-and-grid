"""
AeroKinetic Engine // GF-T3-156
FastAPI / ASGI Microservice Entrypoint for Cloud Run
Provides /healthz liveness/readiness probe and /api/v1/telemetry snapshot
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.ekf_engine import AeroKineticEKF

app = FastAPI(
    title="AeroKinetic Engine API",
    version="1.5.6-T3",
    description="GF-T3-156 6-DoF Sensor Fusion ES-EKF Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global engine instance
ekf_engine = AeroKineticEKF()


@app.get("/healthz")
def healthz():
    """Cloud Run health probe."""
    return {
        "status": "HEALTHY",
        "asset": "GF-T3-156",
        "codename": "AeroKinetic Engine",
        "track": "Track 3 Skunkworks",
        "filter_initialized": True,
        "latency_target_us": 15.0,
        "current_latency_us": ekf_engine.diagnostics.last_step_latency_us,
        "cov_trace": ekf_engine.diagnostics.cov_trace
    }


@app.get("/api/v1/telemetry")
def get_telemetry():
    """Returns serialized snapshot of 16-state vector and covariances."""
    return ekf_engine.get_state_summary()


@app.get("/api/v1/fixed-point")
def get_fixed_point():
    """Returns fixed-point scaled telemetry (10^7 ticks/rad, 10^4 ticks/m)."""
    return ekf_engine.get_fixed_point_telemetry()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("src.server:app", host="0.0.0.0", port=port, log_level="info")
