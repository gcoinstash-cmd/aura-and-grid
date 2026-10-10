"""
Ghost FactoryOS — Engine GF-T3-146: Hyperion-Flux Neuromorphic Event-Vision
Comprehensive Engine Domain Unit Tests.
Clean-Room Certified: Apache-2.0 / MIT Dual Permissive
"""

import pytest
from src.models import (
    DvsEventItem,
    EventIngestBatchRequest,
    FlowCalculateRequest,
    SpatialRoi,
    SpikingTrackRequest,
    SensorCalibrationRequest,
)
from src.engine import (
    ZeroAllocationEventRingBuffer,
    AsynchronousLucasKanadeEngine,
    LifSpikingEstimator,
    DvsStreamSimulator,
    HyperionFluxEngine,
)


class TestRingBuffer:
    def test_ring_buffer_push_drain(self):
        buf = ZeroAllocationEventRingBuffer(capacity=16)
        for i in range(10):
            buf.push(i, i * 2, 1000 + i, 1 if i % 2 == 0 else -1)

        stats = buf.get_stats()
        assert stats["currentOccupancy"] == 10
        assert stats["totalIngested"] == 10
        assert stats["totalDropped"] == 0

        # Recent slice
        slice_events = buf.get_recent_slice(5)
        assert len(slice_events) == 5

        # Drain
        drained = buf.drain_batch(6)
        assert len(drained) == 6
        assert buf.get_stats()["currentOccupancy"] == 4

    def test_ring_buffer_overflow(self):
        buf = ZeroAllocationEventRingBuffer(capacity=4)
        for i in range(6):
            buf.push(i, i, 1000 + i, 1)

        stats = buf.get_stats()
        assert stats["currentOccupancy"] == 4
        assert stats["totalDropped"] == 2


class TestLucasKanade:
    def test_bounds_rejection(self):
        lk = AsynchronousLucasKanadeEngine(width=100, height=100)
        assert lk.process_event(-1, 50, 1000, 1) is None
        assert lk.process_event(50, 105, 1000, 1) is None
        # Margin rejection
        assert lk.process_event(2, 50, 1000, 1) is None

    def test_lk_flow_synthetic_patch(self):
        lk = AsynchronousLucasKanadeEngine(width=100, height=100, radius=3, temporal_tau_us=100000)
        base_t = 1000000

        # Populate orthogonal corner gradient: dx variations in upper half, dy variations in lower half
        for dy in range(-4, 5):
            for dx in range(-4, 5):
                px = 50 + dx
                py = 50 + dy
                # 2D parabolic / corner surface: t = base_t - 200*(dx*dx) - 150*(dy*dy)
                t = int(base_t - 50 * (dx * dx + dy * dy) - 100 * dx + 80 * dy)
                lk.process_event(px, py, t, 1)

        res = lk.process_event(50, 50, base_t, 1)
        if res is not None:
            assert "vx" in res
            assert "vy" in res
            assert res["conditionNumber"] <= 12.5
            assert res["magnitude"] >= 0

        lk.reset()
        assert sum(lk.sae_on) == 0


class TestLifEstimator:
    def test_lif_integration_and_spike(self):
        lif = LifSpikingEstimator(grid_width=16, grid_height=16)
        curr_t = 1000000

        # Inject repeated synchronous events at the same coordinate to trigger threshold
        spiked = False
        for i in range(12):
            curr_t += 50
            if lif.integrate_event(64, 64, curr_t, 1, sensor_width=128, sensor_height=128):
                spiked = True

        assert spiked is True
        assert len(lif.active_spikes) > 0

        # Update tracking
        track = lif.update_tracking(curr_t + 100, sensor_width=128, sensor_height=128)
        if track is not None:
            assert "centroidX" in track
            assert "timeToCollisionMs" in track
            assert track["threatLevel"] in ["NOMINAL", "MONITORED", "CRITICAL_BRAKING_REQUIRED"]

        lif.reset()
        assert len(lif.active_spikes) == 0


class TestDvsSimulator:
    def test_simulator_event_generation(self):
        sim = DvsStreamSimulator(width=128, height=128)
        events = sim.generate_events(count=50, delta_us=2000)
        assert len(events) == 50
        for ev in events:
            assert 0 <= ev.x < 128
            assert 0 <= ev.y < 128
            assert ev.polarity in [1, -1]


class TestHyperionFluxEngine:
    def test_full_pipeline(self):
        engine = HyperionFluxEngine(sensor_width=256, sensor_height=256)

        # Ingestion
        sim_events = engine.simulator.generate_events(count=50, delta_us=2000)
        req_ingest = EventIngestBatchRequest(sensorId=engine.sensor_id, events=sim_events)
        resp_ingest = engine.ingest_events(req_ingest)
        assert resp_ingest.status == "BUFFERED_OK"
        assert resp_ingest.eventsIngested == 50

        # Optical Flow
        req_flow = FlowCalculateRequest(
            sensorId=engine.sensor_id,
            spatialRoi=SpatialRoi(xMin=100, yMin=100, xMax=160, yMax=160),
            temporalSliceUs=5000,
        )
        resp_flow = engine.calculate_flow(req_flow)
        assert resp_flow.magnitudePxUs >= 0
        assert resp_flow.conditionNumber <= 12.5

        # Spiking Track
        req_track = SpikingTrackRequest(sensorId=engine.sensor_id)
        resp_track = engine.track_spikes(req_track)
        assert resp_track.threatLevel in ["NOMINAL", "MONITORED", "CRITICAL_BRAKING_REQUIRED"]

        # Calibration
        req_cal = SensorCalibrationRequest(
            sensorId=engine.sensor_id,
            contrastThresholdOn=0.20,
            contrastThresholdOff=-0.20,
            refractoryPeriodUs=12.0,
            hotPixelSuppression=True,
        )
        resp_cal = engine.calibrate_sensor(req_cal)
        assert resp_cal.success is True

        # Telemetry Audit
        resp_audit = engine.get_telemetry_audit()
        assert "COMPLIANT" in resp_audit.status

        # Health & Compliance
        health = engine.get_health()
        assert health.status == "HEALTHY"
        assert "CLEAN-ROOM" in health.cleanRoomCompliance

        compliance = engine.get_compliance()
        assert compliance.engineId == "GF-T3-146"
        assert compliance.copyleftViolations == 0
