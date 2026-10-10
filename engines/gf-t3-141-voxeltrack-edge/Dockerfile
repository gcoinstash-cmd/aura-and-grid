# =============================================================================
# Multi-Stage Hardened Dockerfile: GF-T3-141 VOXELTRACK-EDGE SPATIAL PERCEPTION ENGINE
# Base Image: Python 3.12-slim (Debian Bookworm)
# Security: Non-Root Execution Context (UID 10001)
# =============================================================================

# --- Stage 1: Build & Dependencies Compiler ---
FROM python:3.12-slim AS builder

WORKDIR /build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-warn-script-location -r requirements.txt

# --- Stage 2: Hardened Runtime Container ---
FROM python:3.12-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    APP_ENV=production \
    PATH="/home/engineuser/.local/bin:${PATH}"

# Install minimal runtime shared libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged system user
RUN groupadd -g 10001 enginegroup && \
    useradd -u 10001 -g enginegroup -s /bin/bash -m engineuser

# Copy installed packages from builder
COPY --from=builder --chown=engineuser:enginegroup /root/.local /home/engineuser/.local

# Copy application source
COPY --chown=engineuser:enginegroup src/ /app/src/

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
