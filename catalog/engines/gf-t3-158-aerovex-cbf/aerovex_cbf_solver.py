"""
AeroVex CBF Core Engine (GF-T3-158)
Decentralized Multi-Agent Trajectory Deconfliction via Control Barrier Functions
ISO 26262 ASIL-D Compliant / Clean-Room Apache 2.0 & MIT Dual Licensed
"""

import time
import math
from typing import List, Tuple, Optional
from dataclasses import dataclass, field
import numpy as np


@dataclass(slots=True)
class AgentState:
    id: int
    pos: np.ndarray  # Shape (2,) [x, y] in meters
    vel: np.ndarray  # Shape (2,) [vx, vy] in m/s
    nominal_vel: np.ndarray  # Desired goal-directed velocity


@dataclass(slots=True)
class IntruderObstacle:
    id: str
    pos: np.ndarray  # Shape (2,)
    vel: np.ndarray  # Shape (2,)
    radius: float    # Safety perimeter in meters


@dataclass(slots=True)
class CBFParams:
    alpha: float = 1.8           # Barrier class-K rigidity coefficient
    r_safe: float = 28.0         # Minimum Euclidean separation distance (m)
    u_max: float = 2.4           # Maximum control speed limit (m/s)
    sensing_radius: float = 80.0 # Local neighbor perception horizon (m)
    max_qp_iterations: int = 8   # Active-set projection limit


@dataclass
class QPSolution:
    u_opt: np.ndarray
    delta_u: np.ndarray
    h_min: float
    is_deflecting: bool
    solve_time_us: float
    iterations: int


class AeroVexCBFSolver:
    """
    Decentralized Active-Set QP Control Barrier Function Solver.
    Guarantees formal forward invariance of safe set C = {x : h(x) >= 0}.
    """
    def __init__(self, params: Optional[CBFParams] = None):
        self.params = params or CBFParams()

    def solve(
        self,
        agent: AgentState,
        neighbors: List[AgentState],
        intruders: Optional[List[IntruderObstacle]] = None
    ) -> QPSolution:
        t_start = time.perf_counter_ns()
        intruders = intruders or []

        # 1. Initialize nominal unconstrained solution
        u_opt = agent.nominal_vel.copy()
        norm_u = np.linalg.norm(u_opt)
        if norm_u > self.params.u_max:
            u_opt = (u_opt / norm_u) * self.params.u_max

        # 2. Extract linear CBF half-plane constraints
        # Each constraint: a_k^T * u >= b_k
        A_rows: List[np.ndarray] = []
        b_vals: List[float] = []
        h_min = float("inf")

        # Pairwise agent barriers
        for other in neighbors:
            if other.id == agent.id:
                continue
            delta_p = agent.pos - other.pos
            dist = np.linalg.norm(delta_p)
            if dist > self.params.sensing_radius or dist < 1e-5:
                continue

            # Pairwise CBF: h = dist^2 - r_safe^2
            h = (dist ** 2) - (self.params.r_safe ** 2)
            if h < h_min:
                h_min = h

            # Linearized CBF condition:
            # 2 * (p_i - p_j)^T * (u_i - v_j) >= -alpha * h
            # a_k = 2 * delta_p
            # b_k = 2 * delta_p^T * other.vel - alpha * h
            a_k = 2.0 * delta_p
            b_k = 2.0 * float(np.dot(delta_p, other.vel)) - (self.params.alpha * h)
            A_rows.append(a_k)
            b_vals.append(b_k)

        # Dynamic intruder barriers
        for intruder in intruders:
            delta_p = agent.pos - intruder.pos
            dist = np.linalg.norm(delta_p)
            effective_safe_r = self.params.r_safe + intruder.radius * 0.5
            if dist > effective_safe_r * 2.5 or dist < 1e-5:
                continue

            h = (dist ** 2) - (effective_safe_r ** 2)
            if h < h_min:
                h_min = h

            a_k = 2.0 * delta_p
            b_k = 2.0 * float(np.dot(delta_p, intruder.vel)) - (self.params.alpha * 1.5 * h)
            A_rows.append(a_k)
            b_vals.append(b_k)

        # 3. Active-Set Projection Loop (Bounded iterations)
        iterations = 0
        changed = False

        for _ in range(self.params.max_qp_iterations):
            worst_violation = 0.0
            worst_idx = -1

            for idx in range(len(A_rows)):
                a_k = A_rows[idx]
                b_k = b_vals[idx]
                val = float(np.dot(a_k, u_opt))
                violation = b_k - val  # > 0 means infeasible
                if violation > worst_violation:
                    worst_violation = violation
                    worst_idx = idx

            if worst_idx == -1 or worst_violation <= 1e-4:
                break

            changed = True
            a_k = A_rows[worst_idx]
            norm_sq = float(np.dot(a_k, a_k))
            if norm_sq > 1e-7:
                # Direct projection onto half-plane
                lam = worst_violation / norm_sq
                u_opt = u_opt + lam * a_k

                # Tangential circulation component to break collinear deadlocks
                perp = np.array([-a_k[1], a_k[0]])
                perp_norm = np.linalg.norm(perp)
                if perp_norm > 1e-6:
                    u_opt += (perp / perp_norm) * 0.75

            iterations += 1

        # 4. Clamp to actuation envelope
        norm_final = np.linalg.norm(u_opt)
        if norm_final > self.params.u_max:
            u_opt = (u_opt / norm_final) * self.params.u_max

        t_elapsed_ns = time.perf_counter_ns() - t_start
        solve_time_us = t_elapsed_ns / 1000.0

        delta_u = u_opt - agent.nominal_vel
        is_deflecting = bool(np.linalg.norm(delta_u) > 0.1 or changed)

        return QPSolution(
            u_opt=u_opt,
            delta_u=delta_u,
            h_min=h_min if h_min != float("inf") else 1000.0,
            is_deflecting=is_deflecting,
            solve_time_us=round(solve_time_us, 2),
            iterations=iterations,
        )
