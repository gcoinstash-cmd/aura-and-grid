#!/usr/bin/env python3
import os
import json

BASE_DIR = "/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid"

engines_meta = [
    {
        "id": "T3-NEXUS-01",
        "name": "NEXUS-ORDERBOOK: High-Frequency L2/L3 Matching Engine",
        "codeName": "NEXUS-LOB",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "Sub-50µs Continuous",
        "cycleFrequencyHz": 20000,
        "tickPeriodMs": 0.05,
        "nominalLatencyMs": 0.048,
        "nominalThroughputReqSec": 25000,
        "mathCore": "Price-Time-Priority FIFO Matching Engine with Deterministic Clearing Invariants & Self-Trade Prevention",
        "stateMachineStates": ["BOOK_ACTIVE", "MATCHING_ACTIVE", "CROSSING_EXECUTED", "DEPTH_DIFF_PUBLISHED", "CIRCUIT_BREAKER_HALT"],
        "initialState": "BOOK_ACTIVE",
        "dir": "T3-NEXUS-ORDERBOOK",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Deployable Source Template // Simulated Data Only // In-Memory Matching",
        "sourceRepo": "T3-NEXUS-ORDERBOOK/",
        "endpoints": [
            {
                "id": "nexus-health",
                "method": "GET",
                "path": "/healthz",
                "summary": "Liveness Probe & Memory Allocation Telemetry",
                "samplePayload": None,
                "sampleResponse": {
                    "status": "ok",
                    "service": "t3-nexus-orderbook",
                    "symbols": ["BTC-USDT", "ETH-USDT"],
                    "memory_bytes": 14285712,
                    "active_orders": 3410
                }
            },
            {
                "id": "nexus-order-post",
                "method": "POST",
                "path": "/v1/orders",
                "summary": "Submit Resting Limit or Aggressive Market Order",
                "samplePayload": {
                    "symbol": "BTC-USDT",
                    "side": "buy",
                    "order_type": "limit",
                    "price": "64500.00000000",
                    "quantity": "1.25000000",
                    "time_in_force": "gtc",
                    "stp_mode": "cancel_taker"
                },
                "sampleResponse": {
                    "order": {
                        "order_id": "ord_9f81a7b",
                        "symbol": "BTC-USDT",
                        "side": "buy",
                        "price": "64500.00000000",
                        "quantity": "1.25000000",
                        "status": "resting"
                    },
                    "trades": []
                }
            },
            {
                "id": "nexus-book-get",
                "method": "GET",
                "path": "/v1/book/BTC-USDT",
                "summary": "Fetch Level-2 Aggregated Depth Snapshot",
                "samplePayload": None,
                "sampleResponse": {
                    "symbol": "BTC-USDT",
                    "sequence": 142091,
                    "bids": [["64500.00000000", "4.15000000"], ["64490.00000000", "12.80000000"]],
                    "asks": [["64505.00000000", "2.35000000"], ["64510.00000000", "8.90000000"]],
                    "timestamp_ns": 1791384000000000
                }
            },
            {
                "id": "nexus-trades-get",
                "method": "GET",
                "path": "/v1/trades/BTC-USDT",
                "summary": "Fetch Recent Execution History (O(1) Circular Ring)",
                "samplePayload": None,
                "sampleResponse": [
                    {
                        "trade_id": "trd_301a",
                        "symbol": "BTC-USDT",
                        "price": "64502.50000000",
                        "quantity": "0.45000000",
                        "aggressor_side": "buy",
                        "timestamp_ns": 1791383999900000
                    }
                ]
            }
        ]
    },
    {
        "id": "GF-T3-138",
        "name": "Nexus Ultra-LOB Engine Workstation",
        "codeName": "NEXUS-ULTRA-LOB",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "Sub-50µs Continuous Double Auction",
        "cycleFrequencyHz": 22000,
        "tickPeriodMs": 0.045,
        "nominalLatencyMs": 0.042,
        "nominalThroughputReqSec": 50000,
        "mathCore": "Deterministic In-Memory Sorted Radix Double Auction with Zero Copyleft Clean-Room Audit",
        "stateMachineStates": ["ENGINE_NOMINAL", "RADIX_BOOK_SYNCHRONIZED", "MATCH_BURST_ACTIVE", "L2_DIFF_STREAMING", "AUDIT_VERIFIED"],
        "initialState": "ENGINE_NOMINAL",
        "dir": "engines/gf-t3-138-nexus-ultra-lob",
        "specFile": "ENGINE_SPEC_T3_NEXUS.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-138-nexus-ultra-lob/",
        "endpoints": [
            {
                "id": "138-healthz",
                "method": "GET",
                "path": "/healthz",
                "summary": "Liveness Probe & P99 Microsecond Telemetry",
                "samplePayload": None,
                "sampleResponse": {
                    "status": "ok",
                    "engine": "nexus-ultra-lob",
                    "mode": "in-memory-radix",
                    "p99_latency_us": 42.1,
                    "memory_bytes": 18241904
                }
            },
            {
                "id": "138-orders-post",
                "method": "POST",
                "path": "/v1/orders",
                "summary": "Submit Sub-Millisecond Double-Auction Order",
                "samplePayload": {
                    "symbol": "BTC-USDT",
                    "side": "sell",
                    "order_type": "limit",
                    "price": "64520.00000000",
                    "quantity": "2.50000000",
                    "time_in_force": "ioc",
                    "client_order_id": "hft_algo_99"
                },
                "sampleResponse": {
                    "order": {
                        "order_id": "ord_88e0b12",
                        "symbol": "BTC-USDT",
                        "side": "sell",
                        "status": "filled",
                        "filled_qty": "2.50000000"
                    },
                    "trades": [
                        {
                            "trade_id": "trd_881",
                            "price": "64520.00000000",
                            "qty": "2.50000000"
                        }
                    ]
                }
            },
            {
                "id": "138-orders-delete",
                "method": "DELETE",
                "path": "/v1/orders/ord_88e0b12",
                "summary": "Cancel Resting Order with O(1) Radix Pruning",
                "samplePayload": None,
                "sampleResponse": {
                    "cancelled_order_id": "ord_88e0b12",
                    "symbol": "BTC-USDT",
                    "remaining_qty": "0.00000000",
                    "timestamp_ns": 1791384000050000
                }
            },
            {
                "id": "138-book-get",
                "method": "GET",
                "path": "/v1/book/BTC-USDT",
                "summary": "Fetch Level-2 Deterministic Radix Depth",
                "samplePayload": None,
                "sampleResponse": {
                    "symbol": "BTC-USDT",
                    "sequence": 94821,
                    "bids": [["64515.00000000", "8.50000000"]],
                    "asks": [["64520.00000000", "3.10000000"]]
                }
            }
        ]
    },
    {
        "id": "GF-T3-139",
        "name": "AeroDyn-RT 1000Hz Telemetry Engine Workstation",
        "codeName": "AERODYN-RT",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "cyan",
        "cycleFrequency": "1000 Hz Deterministic Loop",
        "cycleFrequencyHz": 1000,
        "tickPeriodMs": 1.0,
        "nominalLatencyMs": 0.12,
        "nominalThroughputReqSec": 1000,
        "mathCore": "1000Hz Extended Kalman Filter (EKF), Dynamic CoP Aerodynamic Ratio & Active DRS Airbrake Actuation",
        "stateMachineStates": ["CALIBRATING", "TRACKING_1000HZ", "DRS_DEPLOYED", "AERO_BALANCE_LOCK", "FAILSAFE_PURGE"],
        "initialState": "TRACKING_1000HZ",
        "dir": "engines/gf-t3-139-aerodyn-rt",
        "specFile": "ENGINE_SPEC_GF_T3_139.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-139-aerodyn-rt/",
        "endpoints": [
            {
                "id": "139-telemetry-frame",
                "method": "POST",
                "path": "/telemetry/frame",
                "summary": "Submit 1000Hz Telemetry Frame Batch",
                "samplePayload": {
                    "frames": [
                        {
                            "timestamp_us": 1791384000100,
                            "chassis_speed_ms": 78.4,
                            "yaw_rate_rads": 0.042,
                            "front_ride_height_mm": 24.2,
                            "rear_ride_height_mm": 52.8,
                            "steer_angle_deg": 3.8,
                            "pitot_dynamic_pressure_pa": 3840.5
                        }
                    ]
                },
                "sampleResponse": {
                    "processed_count": 1,
                    "ekf_state": {
                        "cop_front_ratio": 0.432,
                        "total_downforce_n": 18450.2,
                        "drag_force_n": 4820.1,
                        "aero_efficiency_ratio": 3.827
                    },
                    "cycle_time_us": 118
                }
            },
            {
                "id": "139-aero-state",
                "method": "GET",
                "path": "/aero/state",
                "summary": "Fetch Dynamic Aero State & CoP Balance",
                "samplePayload": None,
                "sampleResponse": {
                    "engine_hz": 1000,
                    "cop_front_ratio": 0.435,
                    "cop_target_ratio": 0.430,
                    "drs_status": "CLOSED",
                    "flap_angle_deg": 12.4,
                    "surface_pressure_bar": 1.018
                }
            },
            {
                "id": "139-aero-drs",
                "method": "POST",
                "path": "/aero/drs",
                "summary": "Command DRS / Airbrake Flap Angle",
                "samplePayload": {
                    "command": "OPEN",
                    "angle_deg": 28.5,
                    "actuator_force_kn": 2.4
                },
                "sampleResponse": {
                    "drs_status": "DEPLOYED",
                    "flap_angle_deg": 28.5,
                    "drag_reduction_pct": 21.4,
                    "cop_shift_mm": -8.4
                }
            },
            {
                "id": "139-health",
                "method": "GET",
                "path": "/health",
                "summary": "1000Hz Engine Health & Ring-Buffer Telemetry",
                "samplePayload": None,
                "sampleResponse": {
                    "status": "NOMINAL",
                    "loop_frequency_hz": 1000.0,
                    "ring_buffer_utilization_pct": 14.8,
                    "p99_latency_us": 120.4
                }
            }
        ]
    },
    {
        "id": "GF-T3-140",
        "name": "Chronos-Tick Algorithmic Execution Core Workstation",
        "codeName": "CHRONOS-TICK",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "500 Hz Slicing Cycle",
        "cycleFrequencyHz": 500,
        "tickPeriodMs": 2.0,
        "nominalLatencyMs": 0.85,
        "nominalThroughputReqSec": 10000,
        "mathCore": "Almgren-Chriss Optimal Execution Trajectory, VWAP/TWAP Non-Linear Slicing & Market-Impact Minimization",
        "stateMachineStates": ["MANDATE_PENDING", "SLICING_ACTIVE", "OPTIMAL_TRAJECTORY_LOCKED", "CHILD_DISPATCHED", "EXECUTION_COMPLETE"],
        "initialState": "SLICING_ACTIVE",
        "dir": "engines/gf-t3-140-chronos-tick",
        "specFile": "ENGINE_SPEC_GF_T3_140.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-140-chronos-tick/",
        "endpoints": [
            {
                "id": "140-mandates-post",
                "method": "POST",
                "path": "/v1/algo/mandates",
                "summary": "Submit Parent Order Mandate for Almgren-Chriss Slicing",
                "samplePayload": {
                    "symbol": "ETH-USDT",
                    "side": "BUY",
                    "target_quantity": "500.0000",
                    "urgency_param_lambda": 0.025,
                    "horizon_seconds": 300,
                    "venue_routing": "MULTI_VENUE_OPTIMAL"
                },
                "sampleResponse": {
                    "mandate_id": "mnd_chronos_44",
                    "status": "ACTIVE",
                    "total_slices": 60,
                    "almgren_chriss_trajectory": {
                        "half_life_seconds": 45.2,
                        "expected_impact_bps": 2.4,
                        "projected_vwap": "3421.80"
                    }
                }
            },
            {
                "id": "140-mandates-perf",
                "method": "GET",
                "path": "/v1/algo/mandates/mnd_chronos_44/performance",
                "summary": "Fetch Live VWAP & Slippage Audit Performance",
                "samplePayload": None,
                "sampleResponse": {
                    "mandate_id": "mnd_chronos_44",
                    "executed_qty": "184.2000",
                    "arrival_price": "3420.50",
                    "current_vwap": "3421.10",
                    "slippage_bps": 1.75,
                    "active_child_orders": 3
                }
            },
            {
                "id": "140-mandates-delete",
                "method": "DELETE",
                "path": "/v1/algo/mandates/mnd_chronos_44",
                "summary": "Emergency Stop / Cancel Open Child Slices",
                "samplePayload": None,
                "sampleResponse": {
                    "mandate_id": "mnd_chronos_44",
                    "status": "CANCELLED_EMERGENCY_STOP",
                    "cancelled_child_count": 3,
                    "unfilled_qty": "315.8000"
                }
            },
            {
                "id": "140-health",
                "method": "GET",
                "path": "/v1/health",
                "summary": "Engine Clock Drift & AlloyDB Connection Health",
                "samplePayload": None,
                "sampleResponse": {
                    "status": "NOMINAL",
                    "clock_drift_ns": 42,
                    "alloydb_latency_ms": 1.12,
                    "execution_queue_depth": 0
                }
            }
        ]
    },
    {
        "id": "GF-T3-141",
        "name": "VoxelTrack-Edge 3D Spatial Perception Engine Workstation",
        "codeName": "VOXELTRACK-EDGE",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "125 Hz Perception Sweep",
        "cycleFrequencyHz": 125,
        "tickPeriodMs": 8.0,
        "nominalLatencyMs": 7.4,
        "nominalThroughputReqSec": 125,
        "mathCore": "125Hz 64-Beam LiDAR Octree Voxel Fusion, Kalman Extrapolation & Time-To-Collision (TTC) Risk Grading",
        "stateMachineStates": ["OCTREE_INITIALIZING", "SWEEP_INGESTED", "VOXEL_FUSION_CONVERGED", "TRACK_EXTRAPOLATED", "THREAT_ALERT"],
        "initialState": "VOXEL_FUSION_CONVERGED",
        "dir": "engines/gf-t3-141-voxeltrack-edge",
        "specFile": "ENGINE_SPEC_GF_T3_141.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-141-voxeltrack-edge/",
        "endpoints": [
            {
                "id": "141-sweep-post",
                "method": "POST",
                "path": "/v1/perception/sweep",
                "summary": "Ingest Raw 64-Beam LiDAR Point Cloud Sweep",
                "samplePayload": {
                    "vehicle_id": "GHOST-F1-APOLLO",
                    "frame_seq": 1048576,
                    "timestamp_ns": 1791384000125000,
                    "raw_point_count": 98304,
                    "lidar_beams": 64,
                    "format": "CARTESIAN_PACKED"
                },
                "sampleResponse": {
                    "sweep_id": "swp_9841",
                    "voxel_nodes_updated": 14280,
                    "tracked_objects_count": 28,
                    "critical_threats_count": 1,
                    "processing_time_ms": 7.38
                }
            },
            {
                "id": "141-tracks-get",
                "method": "GET",
                "path": "/v1/perception/tracks",
                "summary": "Query Active 3D Tracked Objects",
                "samplePayload": None,
                "sampleResponse": {
                    "active_tracks": [
                        {
                            "track_id": "trk_081",
                            "class": "OBSTACLE_DYNAMIC",
                            "position_xyz_m": [18.4, -2.1, 0.4],
                            "velocity_xyz_ms": [-12.5, 0.2, 0.0],
                            "covariance_trace": 0.041,
                            "time_to_collision_s": 1.47
                        }
                    ]
                }
            },
            {
                "id": "141-threats-get",
                "method": "GET",
                "path": "/v1/perception/threats",
                "summary": "Fetch Critical Collision Threat List",
                "samplePayload": None,
                "sampleResponse": {
                    "threat_level": "WARNING",
                    "critical_threats": [
                        {
                            "track_id": "trk_081",
                            "ttc_s": 1.47,
                            "risk_score": 0.88,
                            "recommended_evasion": "VECTOR_RIGHT_30DEG"
                        }
                    ]
                }
            }
        ]
    },
    {
        "id": "GF-T3-142",
        "name": "Aegis-Orbit Autonomous Constellation Flight Dynamics & CARA Engine",
        "codeName": "AEGIS-ORBIT",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "cyan",
        "cycleFrequency": "100 Hz Orbital Propagation",
        "cycleFrequencyHz": 100,
        "tickPeriodMs": 10.0,
        "nominalLatencyMs": 0.42,
        "nominalThroughputReqSec": 1200,
        "mathCore": "RK4 6-DOF J2-J4 Geopotential Harmonics, Foster Probability of Collision (Pc) & Clohessy-Wiltshire Burn Optimization",
        "stateMachineStates": ["PROPAGATION_NOMINAL", "CONJUNCTION_SCREENING", "FOSTER_PC_EVALUATED", "IMPULSE_OPTIMIZED", "BURN_EXECUTING"],
        "initialState": "PROPAGATION_NOMINAL",
        "dir": "engines/gf-t3-142-aegis-orbit",
        "specFile": "ENGINE_SPEC_GF_T3_142.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-142-aegis-orbit/",
        "endpoints": [
            {
                "id": "142-propagate-post",
                "method": "POST",
                "path": "/orbit/propagate",
                "summary": "Propagate 6-DOF Orbital State Vector with J2-J4 Harmonics",
                "samplePayload": {
                    "satellite_id": "AEGIS-SAT-07",
                    "epoch_iso": "2026-10-08T02:00:00Z",
                    "position_eci_km": [6878.14, 0.0, 0.0],
                    "velocity_eci_kms": [0.0, 7.612, 0.0],
                    "step_size_s": 10.0,
                    "duration_s": 600.0
                },
                "sampleResponse": {
                    "propagated_states_count": 60,
                    "final_position_eci_km": [6854.21, 584.12, 120.4],
                    "final_velocity_eci_kms": [-0.648, 7.581, 0.124],
                    "computation_time_ms": 0.418
                }
            },
            {
                "id": "142-conjunction-post",
                "method": "POST",
                "path": "/conjunction/evaluate",
                "summary": "Evaluate Encounter Risk & Foster Probability of Collision (Pc)",
                "samplePayload": {
                    "chief_id": "AEGIS-SAT-07",
                    "debris_id": "DEBRIS-COSMOS-2251",
                    "tca_iso": "2026-10-08T04:15:30Z",
                    "miss_distance_m": 84.5,
                    "combined_covariance_matrix": [[12.0, 0.0, 0.0], [0.0, 18.0, 0.0], [0.0, 0.0, 8.0]]
                },
                "sampleResponse": {
                    "conjunction_id": "cnj_4821",
                    "foster_probability_of_collision": 0.004812,
                    "action_required": True,
                    "critical_threshold": 0.0001
                }
            },
            {
                "id": "142-maneuver-post",
                "method": "POST",
                "path": "/maneuver/optimize",
                "summary": "Optimize Clohessy-Wiltshire Impulsive Collision Avoidance Delta-V",
                "samplePayload": {
                    "chief_id": "AEGIS-SAT-07",
                    "conjunction_id": "cnj_4821",
                    "max_delta_v_ms": 0.85,
                    "burn_window_start_iso": "2026-10-08T03:30:00Z"
                },
                "sampleResponse": {
                    "maneuver_id": "mnv_910",
                    "optimal_burn_vector_rtn_ms": [0.045, 0.280, 0.0],
                    "total_delta_v_ms": 0.284,
                    "post_burn_miss_distance_m": 1240.0,
                    "post_burn_pc": 0.0000001
                }
            }
        ]
    },
    {
        "id": "GF-T3-143",
        "name": "Vanguard-ECLSS Autonomous Life Support Engine",
        "codeName": "VANGUARD-ECLSS",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "cyan",
        "cycleFrequency": "50 Hz MPC Loop",
        "cycleFrequencyHz": 50,
        "tickPeriodMs": 20.0,
        "nominalLatencyMs": 2.1,
        "nominalThroughputReqSec": 500,
        "mathCore": "MIMO-MPC Gas Balancer, Psychrometric Thermodynamic Phase Solver & Zero-RPO FDIR Isolation Matrix",
        "stateMachineStates": ["ATMOSPHERE_BALANCED", "MIMO_SOLVER_ACTIVE", "SABATIER_STABILIZED", "WATER_RECOVERED", "FDIR_CONTAINMENT"],
        "initialState": "ATMOSPHERE_BALANCED",
        "dir": "engines/gf-t3-143-vanguard-eclss",
        "specFile": "ENGINE_SPEC_GF_T3_143.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-143-vanguard-eclss/",
        "endpoints": [
            {
                "id": "143-atmosphere-post",
                "method": "POST",
                "path": "/eclss/atmosphere/balance",
                "summary": "Solve Closed-Loop Atmospheric Gas Balance",
                "samplePayload": {
                    "habitat_sector": "CREW_MODULE_ALPHA",
                    "o2_partial_pressure_kpa": 20.8,
                    "co2_partial_pressure_kpa": 0.62,
                    "total_pressure_kpa": 101.3,
                    "cabin_temp_c": 21.4,
                    "relative_humidity_pct": 48.5
                },
                "sampleResponse": {
                    "status": "STABILIZING",
                    "mimo_actuation": {
                        "o2_injector_valve_pct": 14.2,
                        "co2_scrubber_flow_slpm": 420.0,
                        "humidity_condenser_duty_pct": 55.0
                    },
                    "predicted_equilibrium_time_s": 145.0
                }
            },
            {
                "id": "143-water-post",
                "method": "POST",
                "path": "/eclss/water/recovery",
                "summary": "Process Hydrologic Inflow & Calculate Recovery Yield",
                "samplePayload": {
                    "inflow_rate_lph": 12.4,
                    "graywater_conductivity_us": 840.0,
                    "urine_brine_mass_kg": 4.8
                },
                "sampleResponse": {
                    "potable_yield_lph": 11.65,
                    "recovery_efficiency_pct": 94.0,
                    "catalytic_purifier_pressure_kpa": 340.0,
                    "water_quality_index": 99.8
                }
            },
            {
                "id": "143-fdir-post",
                "method": "POST",
                "path": "/eclss/fdir/triage",
                "summary": "Execute Automated Fault Detection & Emergency Isolation",
                "samplePayload": {
                    "telemetry_anomaly_id": "ANOM_O2_DROP_SECTOR_3",
                    "pressure_delta_kpa_sec": -0.045,
                    "isolated_hatch_id": "HATCH_ALPHA_BETA"
                },
                "sampleResponse": {
                    "fdir_state": "CONTAINMENT_SUCCESS",
                    "leak_rate_slpm": 0.0,
                    "mitigation_action": "AUTOMATIC_BULKHEAD_SEAL",
                    "crew_safety_margin_hours": 72.0
                }
            }
        ]
    },
    {
        "id": "GF-T3-144",
        "name": "Lattice-Mesh Post-Quantum Cryptographic Engine",
        "codeName": "LATTICE-MESH",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "200 Hz Key Epoch",
        "cycleFrequencyHz": 200,
        "tickPeriodMs": 5.0,
        "nominalLatencyMs": 1.15,
        "nominalThroughputReqSec": 4000,
        "mathCore": "NIST FIPS 203 ML-KEM-1024 Ephemeral Encapsulation, Post-Quantum Ratchet & Zero-Trust Ephemeral Mesh Topology",
        "stateMachineStates": ["PQC_KEYPAIR_READY", "KEM_ENCAPSULATING", "MESH_RATCHET_ADVANCED", "SHARED_SECRET_ROUTED", "QUANTUM_RESISTANT_LOCKED"],
        "initialState": "QUANTUM_RESISTANT_LOCKED",
        "dir": "engines/gf-t3-144-lattice-mesh",
        "specFile": "ENGINE_SPEC_GF_T3_144.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-144-lattice-mesh/",
        "endpoints": [
            {
                "id": "144-encapsulate-post",
                "method": "POST",
                "path": "/pqc/kem/encapsulate",
                "summary": "Execute ML-KEM-1024 Ephemeral Encapsulation",
                "samplePayload": {
                    "node_id": "EDGE-FLEET-NODE-12",
                    "peer_public_key_b64": "MIIB...[ML-KEM-1024-KEY]...",
                    "crypto_suite": "NIST_FIPS_203_ML_KEM_1024"
                },
                "sampleResponse": {
                    "ciphertext_b64": "G7w1...[CIPHERTEXT]...",
                    "shared_secret_hash": "sha256:4a8f9c102b339485e8a2",
                    "encapsulation_time_us": 1140
                }
            },
            {
                "id": "144-decapsulate-post",
                "method": "POST",
                "path": "/pqc/kem/decapsulate",
                "summary": "Execute ML-KEM-1024 Secret Decapsulation",
                "samplePayload": {
                    "ciphertext_b64": "G7w1...[CIPHERTEXT]...",
                    "secret_key_ref": "sec_vault_k1024_04"
                },
                "sampleResponse": {
                    "shared_secret_hash": "sha256:4a8f9c102b339485e8a2",
                    "status": "SECRET_DERIVED",
                    "decapsulation_time_us": 980
                }
            },
            {
                "id": "144-ratchet-post",
                "method": "POST",
                "path": "/pqc/mesh/ratchet",
                "summary": "Advance Ephemeral WireGuard PSK Epoch",
                "samplePayload": {
                    "epoch_number": 481,
                    "wireguard_psk_sync": True
                },
                "sampleResponse": {
                    "new_epoch": 482,
                    "ephemeral_psk_fingerprint": "wg_psk_77a4",
                    "fleet_nodes_synced": 64,
                    "ratchet_duration_ms": 1.15
                }
            }
        ]
    },
    {
        "id": "GF-T3-145",
        "name": "Nexus-ATS Hybrid Central Limit Order Book & Dark Pool Crossing Engine",
        "codeName": "NEXUS-ATS",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "2,000 Hz Sub-ms Crossing",
        "cycleFrequencyHz": 2000,
        "tickPeriodMs": 0.5,
        "nominalLatencyMs": 0.345,
        "nominalThroughputReqSec": 40000,
        "mathCore": "Sub-Millisecond Dark Pool Midpoint Peg Crossing, VPIN Toxicity Flow Filter & Hawkes Self-Exciting Point Process",
        "stateMachineStates": ["LIT_BOOK_MATCHING", "DARK_CROSSING_ENGAGED", "VPIN_TOXICITY_ACCEPTED", "HAWKES_STABLE", "PEGGED_SETTLED"],
        "initialState": "LIT_BOOK_MATCHING",
        "dir": "engines/gf-t3-145-nexus-ats",
        "specFile": "ENGINE_SPEC_GF_T3_145.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-145-nexus-ats/",
        "endpoints": [
            {
                "id": "145-submit-post",
                "method": "POST",
                "path": "/api/v1/order/submit",
                "summary": "Submit Institutional Order (Lit CLOB or Dark Pool Peg)",
                "samplePayload": {
                    "order_type": "DARK_MIDPOINT_PEG",
                    "symbol": "BTC-USD",
                    "side": "BUY",
                    "quantity": "15.0000",
                    "min_execution_size": "2.0000",
                    "discretionary_offset_bps": 0.5
                },
                "sampleResponse": {
                    "order_id": "dark_ord_5529",
                    "status": "RESTING_DARK_POOL",
                    "peg_reference": "NBBO_MIDPOINT",
                    "current_midpoint": "64512.50",
                    "vpin_toxicity_score": 0.182
                }
            },
            {
                "id": "145-cross-post",
                "method": "POST",
                "path": "/api/v1/dark/cross",
                "summary": "Execute Discretionary Dark Pool Midpoint Cross",
                "samplePayload": {
                    "symbol": "BTC-USD",
                    "max_cross_size": "50.0000"
                },
                "sampleResponse": {
                    "matched_crosses_count": 2,
                    "total_shares_matched": "15.0000",
                    "execution_price": "64512.50",
                    "price_improvement_usd": 187.50,
                    "hawkes_clustering_index": 0.24
                }
            },
            {
                "id": "145-vpin-get",
                "method": "GET",
                "path": "/api/v1/telemetry/vpin-hawkes",
                "summary": "Retrieve Microstructure Flow Toxicity & Hawkes Metrics",
                "samplePayload": None,
                "sampleResponse": {
                    "symbol": "BTC-USD",
                    "vpin": 0.184,
                    "toxicity_state": "LOW_TOXICITY",
                    "hawkes_intensity_lambda": 14.8,
                    "matching_latency_us": 345
                }
            }
        ]
    },
    {
        "id": "GF-T3-146",
        "name": "Hyperion-Flux Neuromorphic Event-Vision & Optical Flow Engine",
        "codeName": "HYPERION-FLUX",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "1,333 Hz Optical Flow Slices",
        "cycleFrequencyHz": 1333,
        "tickPeriodMs": 0.75,
        "nominalLatencyMs": 0.68,
        "nominalThroughputReqSec": 20000,
        "mathCore": "Surface of Active Events (SAE) Lucas-Kanade Microsecond Flow & Leaky Integrate-and-Fire (LIF) Spike Cluster Estimators",
        "stateMachineStates": ["DVS_BUFFER_STREAMING", "SAE_SURFACE_UPDATING", "LUCAS_KANADE_CONVERGED", "SPIKE_CLUSTER_LOCKED", "COLLISION_PREDICTED"],
        "initialState": "LUCAS_KANADE_CONVERGED",
        "dir": "engines/gf-t3-146-hyperion-flux",
        "specFile": "ENGINE_SPEC_GF_T3_146.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-146-hyperion-flux/",
        "endpoints": [
            {
                "id": "146-ingest-post",
                "method": "POST",
                "path": "/api/v1/event/stream/ingest",
                "summary": "Ingest Raw Asynchronous DVS Event Stream Buffer",
                "samplePayload": {
                    "sensor_id": "DVS_NEUROMORPHIC_01",
                    "events": [
                        {"x": 312, "y": 240, "polarity": 1, "timestamp_us": 1791384000100},
                        {"x": 313, "y": 240, "polarity": -1, "timestamp_us": 1791384000105}
                    ]
                },
                "sampleResponse": {
                    "events_ingested": 2,
                    "buffer_head_us": 1791384000105,
                    "event_rate_eps": 8450000,
                    "sae_surface_resolution": "640x480"
                }
            },
            {
                "id": "146-flow-post",
                "method": "POST",
                "path": "/api/v1/flow/calculate",
                "summary": "Calculate Microsecond SAE Lucas-Kanade Optical Flow",
                "samplePayload": {
                    "sae_slice_id": "sae_0091",
                    "algorithm": "LUCAS_KANADE_MICROSECOND",
                    "gradient_threshold": 0.05
                },
                "sampleResponse": {
                    "optical_flow_vectors_count": 1420,
                    "mean_flow_vx": 42.1,
                    "mean_flow_vy": -8.4,
                    "computation_time_us": 680,
                    "p99_latency_us": 745
                }
            },
            {
                "id": "146-spiking-post",
                "method": "POST",
                "path": "/api/v1/spiking/track",
                "summary": "Execute LIF Spike Clustering & Time-To-Collision Tracking",
                "samplePayload": {
                    "lif_threshold_potential": 1.2,
                    "leak_rate_lambda": 0.15
                },
                "sampleResponse": {
                    "active_spike_clusters": 8,
                    "time_to_collision_ms": 240.0,
                    "collision_probability": 0.021
                }
            }
        ]
    },
    {
        "id": "GF-T3-147",
        "name": "Sol-Rotor Autonomous Heavy-Lift eVTOL & Swarm Flight Telemetry Engine",
        "codeName": "SOL-ROTOR",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "cyan",
        "cycleFrequency": "1,000 Hz Inner / 100 Hz Swarm",
        "cycleFrequencyHz": 1000,
        "tickPeriodMs": 1.0,
        "nominalLatencyMs": 0.85,
        "nominalThroughputReqSec": 1000,
        "mathCore": "6-DOF Nonlinear Flight Dynamics, Blade Element Momentum (BEM) Aerodynamic Solver & Reciprocal Velocity Obstacle (RVO) Consensus",
        "stateMachineStates": ["NOMINAL_FLIGHT_INNER", "NDI_ATTITUDE_CONVERGED", "SWARM_CONSENSUS_SYNCED", "ESC_REALLOCATION_FAILSAFE", "EMERGENCY_DEGRADE"],
        "initialState": "NOMINAL_FLIGHT_INNER",
        "dir": "engines/gf-t3-147-sol-rotor",
        "specFile": "ENGINE_SPEC_GF_T3_147.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-147-sol-rotor/",
        "endpoints": [
            {
                "id": "147-state-post",
                "method": "POST",
                "path": "/flight/state/update",
                "summary": "High-Frequency 6-DOF Inertial Sensor & State Vector Ingestion",
                "samplePayload": {
                    "vehicle_id": "EVTOL-SOL-01",
                    "position_ned_m": [124.5, 48.2, -85.0],
                    "velocity_ned_ms": [24.0, 1.2, -0.4],
                    "quaternion": [0.998, 0.012, 0.045, 0.0],
                    "rotor_rpms": [2400, 2410, 2390, 2405]
                },
                "sampleResponse": {
                    "status": "STATE_CONVERGED",
                    "altitude_agl_m": 85.0,
                    "climb_rate_ms": 0.4,
                    "aerodynamic_thrust_total_n": 8420.0,
                    "latency_us": 850
                }
            },
            {
                "id": "147-attitude-post",
                "method": "POST",
                "path": "/control/attitude/compute",
                "summary": "Nonlinear Dynamic Inversion (NDI) Inner-Loop Attitude Compute",
                "samplePayload": {
                    "target_roll_deg": 12.0,
                    "target_pitch_deg": 4.5,
                    "target_yaw_rate_degs": 0.0
                },
                "sampleResponse": {
                    "actuator_commands": {
                        "nacelle_tilt_deg": 14.2,
                        "collective_pitch_deg": 8.4,
                        "cyclic_roll_delta": 0.12
                    },
                    "control_allocation_status": "CONVERGED_OPTIMAL"
                }
            },
            {
                "id": "147-swarm-post",
                "method": "POST",
                "path": "/swarm/consensus/sync",
                "summary": "Distributed Swarm Consensus Epoch & RVO Collision Sync",
                "samplePayload": {
                    "swarm_id": "SWARM-AURA-9",
                    "peer_states_count": 8,
                    "rvo_collision_cone_radius_m": 15.0
                },
                "sampleResponse": {
                    "consensus_epoch": 941,
                    "collision_free_vector_ned": [23.8, 1.5, -0.4],
                    "swarm_dispersion_m": 42.5
                }
            }
        ]
    },
    {
        "id": "GF-T3-148",
        "name": "Chrono-Arbitrage Triangular Arbitrage Engine",
        "codeName": "CHRONO-ARBITRAGE",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "2,500 Hz Arbitrage Scan",
        "cycleFrequencyHz": 2500,
        "tickPeriodMs": 0.4,
        "nominalLatencyMs": 0.38,
        "nominalThroughputReqSec": 50000,
        "mathCore": "Sub-Millisecond Bellman-Ford Negative Cycle Triangular Arbitrage Detection with Cross-Venue Execution Routing",
        "stateMachineStates": ["VENUE_TICKS_POLLING", "BELLMAN_FORD_SCANNING", "NEGATIVE_CYCLE_DISCOVERED", "ATOMIC_MULTI_HOP_DISPATCH", "ARB_SETTLED"],
        "initialState": "BELLMAN_FORD_SCANNING",
        "dir": "engines/gf-t3-148-chrono-arbitrage",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-148-chrono-arbitrage/",
        "endpoints": [
            {
                "id": "148-healthz",
                "method": "GET",
                "path": "/healthz",
                "summary": "Liveness and Readiness Probe with Connected Venues",
                "samplePayload": None,
                "sampleResponse": {
                    "status": "ok",
                    "service": "chrono-arbitrage",
                    "solver": "bellman-ford-negative-cycle",
                    "connected_venues": ["BINANCE", "COINBASE", "OKX", "BYBIT"]
                }
            },
            {
                "id": "148-routes-get",
                "method": "GET",
                "path": "/api/v1/routes/triangular",
                "summary": "Retrieve Profitable Triangular Arbitrage Cycles",
                "samplePayload": None,
                "sampleResponse": {
                    "detected_cycles": [
                        {
                            "cycle_id": "arb_cyc_901",
                            "path": ["USDT", "BTC", "ETH", "USDT"],
                            "gross_spread_bps": 8.4,
                            "net_profit_bps": 4.2,
                            "optimal_capital_usd": 45000.0,
                            "p99_execution_window_us": 380
                        }
                    ]
                }
            },
            {
                "id": "148-execute-post",
                "method": "POST",
                "path": "/api/v1/execute/arb",
                "summary": "Execute Atomic Multi-Hop Arbitrage Route",
                "samplePayload": {
                    "cycle_id": "arb_cyc_901",
                    "capital_amount_usd": 25000.0,
                    "max_slippage_bps": 1.0,
                    "atomic_execution": True
                },
                "sampleResponse": {
                    "execution_id": "exec_arb_770",
                    "status": "ATOMIC_COMPLETE",
                    "realized_net_pnl_usd": 105.40,
                    "hops_executed": 3,
                    "total_roundtrip_latency_us": 382
                }
            }
        ]
    },
    {
        "id": "GF-T3-149",
        "name": "CHRONO-CHASSIS Quantum Hypercar Chassis Telemetry Interface",
        "codeName": "CHRONO-CHASSIS",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "100 Hz Sync Loop",
        "cycleFrequencyHz": 100,
        "tickPeriodMs": 10.0,
        "nominalLatencyMs": 1.2,
        "nominalThroughputReqSec": 1500,
        "mathCore": "Sub-Millisecond Quantum Core Telemetry Streamer, Active Ground-Effect Aerodynamics & Global Cross-Venue Alpha Projection",
        "stateMachineStates": ["SYSTEM_ARMED", "QUANTUM_CORE_SYNCED", "CRYO_COOLING_ACTIVE", "DIFFUSER_AERO_TRIM", "TELEMETRY_LOGGING"],
        "initialState": "QUANTUM_CORE_SYNCED",
        "dir": "engines/gf-t3-149-chrono-chassis",
        "specFile": "ENGINE_SPEC_GF_T3_149.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-149-chrono-chassis/",
        "endpoints": [
            {
                "id": "149-telemetry-get",
                "method": "GET",
                "path": "/api/v1/telemetry/state",
                "summary": "Full Telemetry State Snapshot & Quantum Core Status",
                "samplePayload": None,
                "sampleResponse": {
                    "chassis_mode": "TRACK_ATTACK",
                    "ground_effect_downforce_n": 22400,
                    "quantum_core_temp_k": 4.2,
                    "quantum_entropy_bits_sec": 48000000,
                    "diffuser_angle_deg": 14.5,
                    "cryo_pump_rpm": 8200
                }
            },
            {
                "id": "149-drivemode-post",
                "method": "POST",
                "path": "/api/v1/telemetry/drive-mode",
                "summary": "Set Dynamic Drive Mode & Powertrain Allocation",
                "samplePayload": {
                    "mode": "QUANTUM_SPRINT",
                    "stability_control_level": "PRO_SLIP"
                },
                "sampleResponse": {
                    "mode": "QUANTUM_SPRINT",
                    "power_split_f_r": "30/70",
                    "torque_vectoring_bias": 1.25,
                    "active_aero_map": "LOW_DRAG_HIGH_DOWNFORCE"
                }
            },
            {
                "id": "149-diffuser-post",
                "method": "POST",
                "path": "/api/v1/telemetry/diffuser-angle",
                "summary": "Update Aerodynamic Diffuser Angle",
                "samplePayload": {
                    "angle_deg": 18.2
                },
                "sampleResponse": {
                    "diffuser_angle_deg": 18.2,
                    "venturi_pressure_kpa": -14.8,
                    "rear_downforce_gain_pct": 12.4
                }
            }
        ]
    },
    {
        "id": "GF-T3-150",
        "name": "Chronos Kinetic-9 MagLev Telemetry & Vector Rig",
        "codeName": "CHRONOS-K9",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "cyan",
        "cycleFrequency": "350 Hz Coil Excitation",
        "cycleFrequencyHz": 350,
        "tickPeriodMs": 2.85,
        "nominalLatencyMs": 0.95,
        "nominalThroughputReqSec": 3500,
        "mathCore": "High-Frequency PID Flux-Bias Coil Compensator, Dynamic Eddy-Current Linear Braking & Cryogenic Stabilization",
        "stateMachineStates": ["GUIDEWAY_ENGAGED", "CRYO_COIL_SUPERCONDUCTING", "FLUX_BIAS_COMPENSATED", "LINEAR_BRAKE_ARMED", "SCRAM_STANDBY"],
        "initialState": "GUIDEWAY_ENGAGED",
        "dir": "engines/gf-t3-150-chronos-k9",
        "specFile": "ENGINE_SPEC_GF_T3_150.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "engines/gf-t3-150-chronos-k9/",
        "endpoints": [
            {
                "id": "150-telemetry-get",
                "method": "GET",
                "path": "/api/v1/telemetry/state",
                "summary": "Full MagLev Telemetry State & Cryogenic Coil Status",
                "samplePayload": None,
                "sampleResponse": {
                    "maglev_velocity_ms": 142.5,
                    "air_gap_mm": 14.8,
                    "cryo_coil_temp_k": 3.8,
                    "magnetic_flux_density_t": 5.4,
                    "linear_inductor_frequency_hz": 348.5,
                    "bogie_yaw_mrad": 0.08
                }
            },
            {
                "id": "150-runmode-post",
                "method": "POST",
                "path": "/api/v1/telemetry/run-mode",
                "summary": "Set MagLev Run Mode & Guideway Sector Power",
                "samplePayload": {
                    "mode": "HIGH_SPEED_SUPERCONDUCTING"
                },
                "sampleResponse": {
                    "mode": "HIGH_SPEED_SUPERCONDUCTING",
                    "guideway_stator_sector": 4,
                    "target_velocity_ms": 160.0,
                    "coil_cooling_margin_k": 5.2
                }
            },
            {
                "id": "150-flux-post",
                "method": "POST",
                "path": "/api/v1/telemetry/bogie/flux-bias",
                "summary": "Set Magnetic Flux Bias Compensation",
                "samplePayload": {
                    "flux_bias_compensation_t": 0.42,
                    "bogie_id": "BOGIE_LEAD_01"
                },
                "sampleResponse": {
                    "flux_bias_t": 0.42,
                    "air_gap_delta_mm": 0.2,
                    "stabilization_pid_p_gain": 4.8
                }
            },
            {
                "id": "150-scram-post",
                "method": "POST",
                "path": "/api/v1/telemetry/emergency/scram",
                "summary": "Trigger Emergency Magnetic SCRAM & Linear Eddy Brake",
                "samplePayload": {
                    "trigger_reason": "TEST_SCRAM_SIMULATION"
                },
                "sampleResponse": {
                    "status": "EMERGENCY_SCRAM_DEPLOYED",
                    "linear_eddy_brakes_engaged": True,
                    "deceleration_rate_ms2": 9.81,
                    "stopping_distance_projected_m": 120.4
                }
            }
        ]
    },
    {
        "id": "GF-T3-151",
        "name": "ApexLimit: High-Performance Limit Order Matching Engine",
        "codeName": "APEXLIMIT-MATCH",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "Sub-50µs Continuous",
        "cycleFrequencyHz": 20000,
        "tickPeriodMs": 0.05,
        "nominalLatencyMs": 0.045,
        "nominalThroughputReqSec": 28000,
        "mathCore": "Price-Time-Priority FIFO Matching Engine with Deterministic Clearing Invariants & Self-Trade Prevention",
        "stateMachineStates": ["BOOK_ACTIVE", "MATCHING_ACTIVE", "CROSSING_EXECUTED", "DEPTH_DIFF_PUBLISHED", "CIRCUIT_BREAKER_HALT"],
        "initialState": "BOOK_ACTIVE",
        "dir": "catalog/engines/gf-t3-151-apexlimit-engine",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-151-apexlimit-engine/",
        "endpoints": [
            {
                "id": "151-health-get",
                "method": "GET",
                "path": "/health",
                "summary": "Matching Engine Liveness & Microsecond Telemetry",
                "samplePayload": None,
                "sampleResponse": {"status": "ok", "service": "gf-t3-151-apexlimit", "latency_us": 45.2}
            }
        ]
    },
    {
        "id": "GF-T3-152",
        "name": "ChronosRisk: Real-Time Portfolio Margin & VaR Engine",
        "codeName": "CHRONOS-RISK",
        "vertical": "Vertical B (FinTech/Quant Risk)",
        "verticalColor": "emerald",
        "cycleFrequency": "100Hz Continuous",
        "cycleFrequencyHz": 100,
        "tickPeriodMs": 10.0,
        "nominalLatencyMs": 0.12,
        "nominalThroughputReqSec": 8500,
        "mathCore": "Acklam Inverse Normal CDF & Cornish-Fisher Expansion for Multi-Asset Value-at-Risk (VaR)",
        "stateMachineStates": ["RISK_NOMINAL", "STRESS_TESTING", "MARGIN_CALL_WARN", "AUTO_DELEVERAGE", "CIRCUIT_BREAKER"],
        "initialState": "RISK_NOMINAL",
        "dir": "catalog/engines/gf-t3-152-chronosrisk-engine",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-152-chronosrisk-engine/",
        "endpoints": [
            {
                "id": "152-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Portfolio Margin Engine Health & Liveness Probe",
                "samplePayload": None,
                "sampleResponse": {"status": "ok", "service": "gf-t3-152-chronosrisk"}
            }
        ]
    },
    {
        "id": "GF-T3-153",
        "name": "Aegis Sovereign: Atomic DvP Multi-Party Settlement Core",
        "codeName": "AEGIS-SOVEREIGN",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "Event-Driven Sub-10ms",
        "cycleFrequencyHz": 100,
        "tickPeriodMs": 10.0,
        "nominalLatencyMs": 0.85,
        "nominalThroughputReqSec": 5000,
        "mathCore": "FROST / Feldman VSS Threshold Cryptography & Atomic Delivery-versus-Payment State Machine",
        "stateMachineStates": ["ROUND1_COMMIT", "ROUND2_PARTIAL_SIGN", "QUORUM_VERIFIED", "SETTLEMENT_COMMITTED", "ROLLBACK"],
        "initialState": "ROUND1_COMMIT",
        "dir": "catalog/engines/gf-t3-153-aegis-sovereign",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-153-aegis-sovereign/",
        "endpoints": [
            {
                "id": "153-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Threshold Settlement Core Liveness & Quorum Health",
                "samplePayload": None,
                "sampleResponse": {"status": "ok", "service": "gf-t3-153-aegis-sovereign"}
            }
        ]
    },
    {
        "id": "GF-T3-154",
        "name": "VortexRoute: Smart Order Routing & Convex Liquidity Aggregator",
        "codeName": "VORTEX-ROUTE",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "blue",
        "cycleFrequency": "Sub-20µs Continuous",
        "cycleFrequencyHz": 50000,
        "tickPeriodMs": 0.02,
        "nominalLatencyMs": 0.018,
        "nominalThroughputReqSec": 35000,
        "mathCore": "Karush-Kuhn-Tucker (KKT) Convex Multi-Venue Optimization & Triangular Arbitrage Detection",
        "stateMachineStates": ["POLLING_VENUES", "SOLVING_KKT", "CHILD_ORDERS_DISPATCHED", "FILLS_RECONCILED", "HALT"],
        "initialState": "POLLING_VENUES",
        "dir": "catalog/engines/gf-t3-154-vortex-route",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-154-vortex-route/",
        "endpoints": [
            {
                "id": "154-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Router Health Probe & Venue Latency Tracking",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "venues_connected": 3}
            }
        ]
    },
    {
        "id": "GF-T3-155",
        "name": "PrismMesh: PBS MEV Auction & Deterministic Bundle Sequencing Core",
        "codeName": "PRISMMESH-MEV",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "Sub-12µs Simulation",
        "cycleFrequencyHz": 80000,
        "tickPeriodMs": 0.012,
        "nominalLatencyMs": 0.011,
        "nominalThroughputReqSec": 45000,
        "mathCore": "First-Price Sealed-Bid Combinatorial Knapsack & Conflict DAG State Access Key Resolution",
        "stateMachineStates": ["BID_WINDOW_OPEN", "DAG_RESOLVING", "BLOCK_PROPOSAL_SEALED", "AUCTION_FINALIZED", "REVERT_ISOLATION"],
        "initialState": "BID_WINDOW_OPEN",
        "dir": "catalog/engines/gf-t3-155-prismmesh-engine",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-155-prismmesh-engine/",
        "endpoints": [
            {
                "id": "155-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "MEV Auction Pipeline Liveness & Gas Capacity",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "gas_limit": 30000000}
            }
        ]
    },
    {
        "id": "GF-T3-156",
        "name": "AeroKinetic: 6-DoF Multi-Rate Avionics ES-EKF Telemetry Engine",
        "codeName": "AEROKINETIC-EKF",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "blue",
        "cycleFrequency": "1000Hz IMU / 10Hz GNSS",
        "cycleFrequencyHz": 1000,
        "tickPeriodMs": 1.0,
        "nominalLatencyMs": 0.015,
        "nominalThroughputReqSec": 15000,
        "mathCore": "16-State Nominal Kinematics Error-State Extended Kalman Filter with Chi-Squared Gating & Joseph Covariance",
        "stateMachineStates": ["UNINITIALIZED", "ALIGNED", "NOMINAL_TRACKING", "GPS_DENIED_DR", "FAULT_ISOLATION"],
        "initialState": "NOMINAL_TRACKING",
        "dir": "catalog/engines/gf-t3-156-aerokinetic-engine",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-156-aerokinetic-engine/",
        "endpoints": [
            {
                "id": "156-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Avionics EKF Filter Diagnostics & Covariance Trace",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "latency_target_us": 15.0}
            }
        ]
    },
    {
        "id": "GF-T3-157",
        "name": "SwarmSync: Decentralized Multi-Agent Consensus & Flocking Core",
        "codeName": "SWARMSYNC-CORE",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "20Hz Control Loop",
        "cycleFrequencyHz": 20,
        "tickPeriodMs": 50.0,
        "nominalLatencyMs": 0.01,
        "nominalThroughputReqSec": 12000,
        "mathCore": "Reynolds Flocking, Control Barrier Function (CBF) Active-Set QP, Gossip Consensus & Hungarian Assignment",
        "stateMachineStates": ["FORMATION_ALIGN", "GOSSIP_CONSENSUS", "WAYPOINT_TRACKING", "COLLISION_DEFLECTION", "PARTITION_HEAL"],
        "initialState": "FORMATION_ALIGN",
        "dir": "catalog/engines/gf-t3-157-swarmsync-engine",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-157-swarmsync-engine/",
        "endpoints": [
            {
                "id": "157-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Swarm Synchronization Health & Node Topology",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "node_count": 32}
            }
        ]
    },
    {
        "id": "GF-T3-158",
        "name": "AeroVex CBF: Trajectory Deconfliction & ASIL-D Safe Set Engine",
        "codeName": "AEROVEX-CBF",
        "vertical": "Vertical A (Telemetry/Aerospace)",
        "verticalColor": "blue",
        "cycleFrequency": "100Hz Real-Time QP",
        "cycleFrequencyHz": 100,
        "tickPeriodMs": 10.0,
        "nominalLatencyMs": 0.012,
        "nominalThroughputReqSec": 20000,
        "mathCore": "Decentralized Active-Set QP Control Barrier Functions with ISO 26262 ASIL-D Forward Invariance Guarantee",
        "stateMachineStates": ["NOMINAL_FLIGHT", "CBF_EVALUATION", "DEFLECTION_ACTIVE", "TANGENTIAL_CIRCULATION", "INTRUDER_EVADE"],
        "initialState": "NOMINAL_FLIGHT",
        "dir": "catalog/engines/gf-t3-158-aerovex-cbf",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-158-aerovex-cbf/",
        "endpoints": [
            {
                "id": "158-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "CBF Solver Health & Target Latency Probe",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "target_latency_us": 15.0}
            }
        ]
    },
    {
        "id": "GF-T3-159",
        "name": "VoronoiGrid Swarm: Decentralized Coverage & Dynamic Partitioning Core",
        "codeName": "VORONOI-SWARM",
        "vertical": "Vertical C (Edge AI/Consensus)",
        "verticalColor": "purple",
        "cycleFrequency": "50Hz Iterative Lloyd",
        "cycleFrequencyHz": 50,
        "tickPeriodMs": 20.0,
        "nominalLatencyMs": 0.025,
        "nominalThroughputReqSec": 10000,
        "mathCore": "Decentralized Lloyd Relaxation, Lyapunov-Stable Centroidal Voronoi Partitioning & Distortion Ratio Bounds",
        "stateMachineStates": ["PARTITION_INIT", "LLOYD_RELAXATION", "EXCLUSION_CLEARANCE", "NODE_DROPOUT_HEAL", "EQUILIBRIUM"],
        "initialState": "PARTITION_INIT",
        "dir": "catalog/engines/gf-t3-159-voronoigrid-swarm",
        "specFile": "ENGINE_SPEC.md",
        "apaValueFloor": "$35,000",
        "monopolyCeiling": "$75,000–$150,000+",
        "monthlySeatLicense": "$1,500/mo",
        "truthBadge": "Working Service Engine // Zero Mock Client State // MIT Permissive",
        "sourceRepo": "catalog/engines/gf-t3-159-voronoigrid-swarm/",
        "endpoints": [
            {
                "id": "159-healthz-get",
                "method": "GET",
                "path": "/healthz",
                "summary": "Voronoi Swarm Partitioning Health & Lyapunov Energy",
                "samplePayload": None,
                "sampleResponse": {"status": "HEALTHY", "target_latency_ms": 1.0}
            }
        ]
    }

]

# Read spec excerpt and Dockerfile content for each engine
for eng in engines_meta:
    dir_path = os.path.join(BASE_DIR, eng["dir"])
    spec_path = os.path.join(dir_path, eng["specFile"])
    eng["specFileName"] = eng["specFile"]
    eng["primaryEndpoints"] = eng["endpoints"]
    docker_path = os.path.join(dir_path, "Dockerfile")
    if os.path.exists(spec_path):
        with open(spec_path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
            eng["specContent"] = "".join(lines)
            eng["specExcerpt"] = "".join(lines[:35]).strip()
    else:
        eng["specContent"] = f"# {eng['name']}\n\nSpec file {eng['specFile']} not found."
        eng["specExcerpt"] = f"# {eng['name']}"

    if os.path.exists(docker_path):
        with open(docker_path, "r", encoding="utf-8", errors="replace") as f:
            eng["dockerfileContent"] = f.read().strip()
    else:
        eng["dockerfileContent"] = f"# Dockerfile for {eng['id']}\nFROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nCMD [\"uvicorn\", \"src.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8080\"]"

ts_content = """// ============================================================================
// TRACK 3 F1 SKUNKWORKS SERVICE ENGINES — INVENTORY & TELEMETRY MANIFEST
// Curated 14 Production Reference Architectures & Working Service Engines
// Units: T3-NEXUS-01, GF-T3-138 to GF-T3-150
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'WS';

export interface EngineEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  samplePayload?: Record<string, any> | null;
  sampleResponse: Record<string, any> | any[];
  description?: string;
}

export interface Track3Engine {
  id: string;
  name: string;
  codeName: string;
  vertical: 'Vertical A (Telemetry/Aerospace)' | 'Vertical B (FinTech/Quant Risk)' | 'Vertical C (Edge AI/Consensus)';
  verticalColor: string;
  cycleFrequency: string;
  cycleFrequencyHz: number;
  tickPeriodMs: number;
  nominalLatencyMs: number;
  nominalThroughputReqSec: number;
  mathCore: string;
  stateMachineStates: string[];
  initialState: string;
  primaryEndpoints: EngineEndpoint[];
  endpoints?: EngineEndpoint[];
  apaValueFloor: string;
  monopolyCeiling: string;
  monthlySeatLicense: string;
  truthBadge: string;
  sourceRepo: string;
  dir?: string;
  specFile?: string;
  specFileName: string;
  specExcerpt: string;
  specContent: string;
  dockerfileContent: string;
}

export const TRACK_3_ENGINES: Track3Engine[] = """ + json.dumps(engines_meta, indent=2) + """;

export const getTrack3EngineById = (id: string): Track3Engine | undefined => {
  return TRACK_3_ENGINES.find((e) => e.id.toLowerCase() === id.toLowerCase());
};

export const DEFAULT_TRACK_3_ENGINE: Track3Engine = TRACK_3_ENGINES[1]; // GF-T3-138
"""

out_paths = [
    os.path.join(BASE_DIR, "src/data/track3Engines.ts"),
    os.path.join(BASE_DIR, "tools/ghost-factory-console/src/data/track3Engines.ts")
]

for p in out_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"✅ Generated {p} ({len(ts_content)} bytes)")
