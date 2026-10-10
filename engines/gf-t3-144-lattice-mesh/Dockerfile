# Multi-stage hardened build for GF-T3-144 Lattice-Mesh Engine
# Base Image: Python 3.11 Slim
FROM python:3.11-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final Runtime Image
FROM python:3.11-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    PATH=/home/nonroot/.local/bin:$PATH

# Non-root user creation (UID 10001)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m nonroot

COPY --from=builder --chown=nonroot:appgroup /root/.local /home/nonroot/.local
COPY --chown=nonroot:appgroup src/ ./src/
COPY --chown=nonroot:appgroup migrations/ ./migrations/
COPY --chown=nonroot:appgroup openapi.json .
COPY --chown=nonroot:appgroup ENGINE_SPEC_GF_T3_144.md .

USER nonroot

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/healthz')" || exit 1

CMD ["python3", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
