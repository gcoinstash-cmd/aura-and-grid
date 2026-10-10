#!/usr/bin/env bash
# =============================================================================
# T3-NEXUS-ORDERBOOK: Zero-Downtime Google Cloud Run Deploy Pipeline
# =============================================================================
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-ghost-factoryos-prod}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="t3-nexus-orderbook"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"

echo "===> [1/4] Building container image via Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" .

echo "===> [2/4] Deploying container to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image="${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform="managed" \
    --allow-unauthenticated \
    --port=8080 \
    --cpu=2 \
    --memory=2Gi \
    --min-instances=1 \
    --max-instances=20 \
    --concurrency=1000 \
    --timeout=300 \
    --set-env-vars="APP_ENV=production,TICK_INTERVAL_MS=100" \
    --execution-environment=gen2

echo "===> [3/4] Verifying production health endpoint..."
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --format="value(status.url)")
curl -sSf "${SERVICE_URL}/healthz" | grep -q "HEALTHY"

echo "===> [4/4] DEPLOYMENT COMPLETE. Ingestion URL: ${SERVICE_URL}"
