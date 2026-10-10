# T3-NEXUS-ORDERBOOK

**Label:** Deployable Source Template (Track 3 candidate) · sample/simulated data only · in-memory state · not a production service.

A price-time-priority limit-order-book matching engine with a FastAPI REST + WebSocket layer.
Full diligence material: [ACQUIRE_DATA_ROOM.md](ACQUIRE_DATA_ROOM.md). Spec: [ENGINE_SPEC.md](ENGINE_SPEC.md).

## Run locally (Python 3.11 or 3.12)

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt        # runtime deps + test client
.venv/bin/pytest tests/ -v --cov=src --cov-report=term-missing
cp .env.example .env                                  # then edit; never commit .env
.venv/bin/uvicorn src.main:app --port 8080 --workers 1
curl http://127.0.0.1:8080/healthz
```

Interactive API docs: `http://127.0.0.1:8080/docs`.

## Layout

```
src/            models.py  engine.py  main.py
migrations/     001_initial_schema.sql   (PostgreSQL 16; not yet wired into src/)
tests/          test_engine.py  test_engine_extended.py  test_api.py
Dockerfile  docker-compose.yml  deploy_cloud_run.sh  requirements.txt  requirements-dev.txt
```

## Security & Integrity Notes

- No authentication or RBAC in this release. Do **not** expose it publicly as-is (`deploy_cloud_run.sh` uses `--allow-unauthenticated`; change it first).
- `.env.example` contains placeholders only. `docker-compose.yml` refuses to start without `POSTGRES_PASSWORD`.
- Container build and cloud deployment have not been executed. See the data room, sections 6 and 9, for all open items.
- License: MIT (see `LICENSE`). Not legal, financial or compliance advice.
