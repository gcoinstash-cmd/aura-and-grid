# ==============================================================
# Ghost FactoryOS — Engine GF-T3-146: Hyperion-Flux
# Hardened Production Multi-Stage Container
# Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
# ==============================================================

FROM python:3.11-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner

WORKDIR /app

# Create non-root unprivileged runtime user
RUN useradd -u 10001 -m hyperion && \
    mkdir -p /app/data /app/logs && \
    chown -R hyperion:hyperion /app

COPY --from=builder /root/.local /home/hyperion/.local
COPY src/ /app/src/
COPY openapi.json /app/
COPY migrations/ /app/migrations/

USER hyperion
ENV PATH=/home/hyperion/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/healthz')" || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
