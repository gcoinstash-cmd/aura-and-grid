import React, { useState } from 'react';
import { FileCode, Download, Copy, Check, Terminal, Server, ShieldCheck } from 'lucide-react';

export const ArtifactsVault: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'dockerfile' | 'compose' | 'deploy' | 'tests'>('dockerfile');
  const [copied, setCopied] = useState(false);

  const files = {
    dockerfile: {
      name: 'Dockerfile',
      type: 'dockerfile',
      content: `# Multi-stage hardened production Dockerfile for Chrono-Arbitrage T3-QUANT-02
# Base: Python 3.12-slim Debian Bookworm
FROM python:3.12-slim-bookworm AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    curl \\
    gcc \\
    libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final Minimal Distroless-like Runtime Stage
FROM python:3.12-slim-bookworm AS runner

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PORT=8080 \\
    APP_ENV=production

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    libpq5 \\
    ca-certificates \\
    && rm -rf /var/lib/apt/lists/* \\
    && groupadd -r quantgroup -g 10001 \\
    && useradd -r -u 10001 -g quantgroup -s /bin/bash -m quantuser

COPY --from=builder /root/.local /home/quantuser/.local
COPY --chown=quantuser:quantgroup . /app

ENV PATH=/home/quantuser/.local/bin:$PATH

USER quantuser

EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=2s --start-period=3s --retries=3 \\
    CMD curl -f http://localhost:8080/healthz || exit 1

ENTRYPOINT ["uvicorn", "chrono_arb.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "4", "--loop", "uvloop", "--http", "httptools"]`,
    },
    compose: {
      name: 'docker-compose.yml',
      type: 'yaml',
      content: `version: '3.8'

services:
  chrono-arb-engine:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: chrono-arb-core
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://quant:vault_secure_pwd_99@timescaledb:5432/chrono_arb
      - REDIS_URL=redis://redis-cluster:6379/0
      - MIN_PROFIT_BPS=4.0
      - MAX_HOPS=4
      - APP_ENV=production
    depends_on:
      timescaledb:
        condition: service_healthy
      redis-cluster:
        condition: service_healthy
    networks:
      - quant-network
    restart: unless-stopped

  mock-orderbook-feeder:
    image: python:3.12-slim-bookworm
    container_name: chrono-arb-mock-feeder
    working_dir: /feeder
    volumes:
      - ./feeder:/feeder
    command: >
      bash -c "pip install websockets aiohttp && python -u simulate_orderbook_ticks.py"
    environment:
      - TARGET_WS_URL=ws://chrono-arb-engine:8080/ws/v1/tick-stream
      - TICKS_PER_SECOND=50000
    depends_on:
      - chrono-arb-engine
    networks:
      - quant-network

  timescaledb:
    image: timescale/timescaledb:latest-pg16
    container_name: chrono-arb-db
    environment:
      - POSTGRES_USER=quant
      - POSTGRES_PASSWORD=vault_secure_pwd_99
      - POSTGRES_DB=chrono_arb
    ports:
      - "5432:5432"
    volumes:
      - timescaledb_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quant -d chrono_arb"]
      interval: 3s
      timeout: 2s
      retries: 5
    networks:
      - quant-network

  redis-cluster:
    image: redis:7.2-alpine
    container_name: chrono-arb-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 3s
      timeout: 2s
      retries: 5
    networks:
      - quant-network

volumes:
  timescaledb_data:

networks:
  quant-network:
    driver: bridge`,
    },
    deploy: {
      name: 'deploy_cloud_run.sh',
      type: 'bash',
      content: `#!/usr/bin/env bash
# ==============================================================================
# CHRONO-ARBITRAGE T3-QUANT-02 CLOUD RUN DEPLOYMENT SCRIPT
# Compliant with GCP Cloud Run V2 Gen2 High-CPU Engine
# ==============================================================================
set -euo pipefail

PROJECT_ID="\${GCP_PROJECT_ID:-\$(gcloud config get-value project)}"
REGION="\${GCP_REGION:-us-east1}"
SERVICE_NAME="t3-chrono-arbitrage-engine"
IMAGE_TAG="gcr.io/\${PROJECT_ID}/\${SERVICE_NAME}:latest"

echo "=========================================================="
echo "DEPLOYING: \${SERVICE_NAME} to GCP Project: \${PROJECT_ID}"
echo "REGION: \${REGION}"
echo "=========================================================="

# 1. Build and Submit Container Image
echo "[Step 1/3] Building hardened container image via Cloud Build..."
gcloud builds submit --tag "\${IMAGE_TAG}" .

# 2. Deploy to Google Cloud Run Gen2
echo "[Step 2/3] Deploying to Cloud Run with Gen2 Execution Environment..."
gcloud run deploy "\${SERVICE_NAME}" \\
    --image "\${IMAGE_TAG}" \\
    --platform managed \\
    --region "\${REGION}" \\
    --allow-unauthenticated \\
    --execution-environment gen2 \\
    --cpu 4 \\
    --memory 8Gi \\
    --concurrency 1000 \\
    --min-instances 1 \\
    --max-instances 10 \\
    --port 8080 \\
    --set-env-vars="APP_ENV=production,MIN_PROFIT_BPS=5.0,MAX_HOPS=4"

# 3. Output Endpoint URL
ENDPOINT_URL=\$(gcloud run services describe "\${SERVICE_NAME}" --platform managed --region "\${REGION}" --format="value(status.url)")
echo "=========================================================="
echo "DEPLOYMENT COMPLETE! Primary Endpoint:"
echo "\${ENDPOINT_URL}/healthz"
echo "=========================================================="`,
    },
    tests: {
      name: 'tests/test_solver.py',
      type: 'python',
      content: `"""
Chrono-Arbitrage T3-QUANT-02 Engine
Module: tests/test_solver.py
Coverage Target: >85%
"""

import math
import time
import pytest
from chrono_arb.core.solver import (
    OrderBookTick,
    ThreadSafeCurrencyGraph,
    BellmanFordArbitrageSolver,
    ArbitrageRoute
)


@pytest.fixture
def empty_graph() -> ThreadSafeCurrencyGraph:
    return ThreadSafeCurrencyGraph()


@pytest.fixture
def solver() -> BellmanFordArbitrageSolver:
    return BellmanFordArbitrageSolver(min_profit_bps=5.0)


def test_empty_graph_cycle_detection(empty_graph, solver):
    """Verifies that an unpopulated graph returns empty arbitrage routes gracefully."""
    routes = solver.find_arbitrage_cycles(empty_graph)
    assert routes == []


def test_positive_triangular_arbitrage_discovery(empty_graph, solver):
    """
    Constructs an explicit positive triangular arbitrage scenario:
    USDT -> BTC -> ETH -> USDT
    Leg 1: BUY BTC with USDT @ 60,000 (USDT -> BTC: rate = 1/60,000)
    Leg 2: BUY ETH with BTC @ 0.050 (BTC -> ETH: rate = 1/0.050 = 20.0)
    Leg 3: SELL ETH for USDT @ 3,100 (ETH -> USDT: rate = 3,100)

    Without fee: 1 USDT -> (1/60,000) BTC * 20 ETH * 3100 USDT = 1.0333 (+3.33% gross)
    With 7.5 bps fee per leg:
    Effective multiplier = 1.0333 * (1 - 0.00075)^3 = 1.0310 (+3.10% net, ~310 bps)
    """
    ts = time.time_ns()
    ticks = [
        OrderBookTick("Binance", "BTCUSDT", "BTC", "USDT", bid_price=59990.0, bid_qty=5.0, ask_price=60000.0, ask_qty=5.0, timestamp_ns=ts),
        OrderBookTick("OKX", "ETHBTC", "ETH", "BTC", bid_price=0.0498, bid_qty=40.0, ask_price=0.0500, ask_qty=40.0, timestamp_ns=ts),
        OrderBookTick("Coinbase", "ETHUSDT", "ETH", "USDT", bid_price=3100.0, bid_qty=50.0, ask_price=3105.0, ask_qty=50.0, timestamp_ns=ts),
    ]
    for tick in ticks:
        empty_graph.update_tick(tick)

    routes = solver.find_arbitrage_cycles(empty_graph)
    assert len(routes) >= 1

    top_route = max(routes, key=lambda r: r.net_profit_bps)
    assert top_route.net_profit_bps > 200.0
    assert "USDT" in top_route.cycle_nodes
    assert top_route.cycle_nodes[0] == top_route.cycle_nodes[-1]


def test_zero_profit_balanced_market(empty_graph, solver):
    """
    Constructs perfectly balanced exchange rates with fees.
    Any cycle must yield negative return, hence zero arbitrage detected.
    """
    ts = time.time_ns()
    ticks = [
        OrderBookTick("Binance", "BTCUSDT", "BTC", "USDT", bid_price=60000.0, bid_qty=10.0, ask_price=60010.0, ask_qty=10.0, timestamp_ns=ts),
        OrderBookTick("OKX", "ETHBTC", "ETH", "BTC", bid_price=0.0500, bid_qty=100.0, ask_price=0.0501, ask_qty=100.0, timestamp_ns=ts),
        OrderBookTick("Coinbase", "ETHUSDT", "ETH", "USDT", bid_price=2990.0, bid_qty=100.0, ask_price=3000.0, ask_qty=100.0, timestamp_ns=ts),
    ]
    for tick in ticks:
        empty_graph.update_tick(tick)

    routes = solver.find_arbitrage_cycles(empty_graph)
    assert len(routes) == 0


def test_fee_depletion_edge_case(empty_graph):
    """
    Verifies that a marginal gross spread (+10 bps) is rejected when taker fees (3 * 7.5 bps = 22.5 bps)
    wipe out net profitability.
    """
    solver_strict = BellmanFordArbitrageSolver(min_profit_bps=5.0)
    ts = time.time_ns()
    ticks = [
        OrderBookTick("Binance", "BTCUSDT", "BTC", "USDT", bid_price=60000.0, bid_qty=1.0, ask_price=60000.0, ask_qty=1.0, timestamp_ns=ts, taker_fee_bps=10.0),
        OrderBookTick("OKX", "ETHBTC", "ETH", "BTC", bid_price=0.0500, bid_qty=20.0, ask_price=0.0500, ask_qty=20.0, timestamp_ns=ts, taker_fee_bps=10.0),
        OrderBookTick("Coinbase", "ETHUSDT", "ETH", "USDT", bid_price=3003.0, bid_qty=20.0, ask_price=3003.0, ask_qty=20.0, timestamp_ns=ts, taker_fee_bps=10.0),
    ]
    for tick in ticks:
        empty_graph.update_tick(tick)

    routes = solver_strict.find_arbitrage_cycles(empty_graph)
    assert len(routes) == 0


def test_high_frequency_tick_burst_throughput(empty_graph, solver):
    """
    Pumps 50,000 synthetic ticks through the thread-safe graph
    to verify sub-second ingestion capability without locking deadlocks.
    """
    start_time = time.perf_counter()
    num_ticks = 50_000

    for i in range(num_ticks):
        bid = 60000.0 + (i % 100) * 0.1
        empty_graph.update_tick(OrderBookTick(
            venue="Binance",
            symbol="BTCUSDT",
            base_currency="BTC",
            quote_currency="USDT",
            bid_price=bid,
            bid_qty=2.5,
            ask_price=bid + 0.5,
            ask_qty=3.0,
            timestamp_ns=time.time_ns()
        ))

    elapsed = time.perf_counter() - start_time
    ticks_per_sec = num_ticks / elapsed
    assert ticks_per_sec > 40_000, f"Throughput was {ticks_per_sec:.2f} ticks/sec, target >40,000"`,
    },
  };

  const curr = files[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(curr.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([curr.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = curr.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* File Selector Tabs */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 font-mono text-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFile('dockerfile')}
            className={`px-3.5 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              selectedFile === 'dockerfile'
                ? 'bg-zinc-800 text-pink-300 border border-pink-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-pink-400" />
            Dockerfile (Distroless Python 3.12)
          </button>

          <button
            onClick={() => setSelectedFile('compose')}
            className={`px-3.5 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              selectedFile === 'compose'
                ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-cyan-400" />
            docker-compose.yml (Cluster &amp; Feeder)
          </button>

          <button
            onClick={() => setSelectedFile('deploy')}
            className={`px-3.5 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              selectedFile === 'deploy'
                ? 'bg-zinc-800 text-amber-300 border border-amber-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            deploy_cloud_run.sh (1-Click Gen2)
          </button>

          <button
            onClick={() => setSelectedFile('tests')}
            className={`px-3.5 py-2 rounded-md transition flex items-center gap-2 font-bold ${
              selectedFile === 'tests'
                ? 'bg-zinc-800 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            tests/test_solver.py (&gt;85% Coverage)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 hover:text-white transition flex items-center gap-1.5 font-bold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{copied ? 'COPIED' : 'COPY ARTIFACT'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD {curr.name}</span>
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed text-zinc-100 overflow-x-auto whitespace-pre-wrap selection:bg-pink-500/30">
        {curr.content}
      </div>
    </div>
  );
};
