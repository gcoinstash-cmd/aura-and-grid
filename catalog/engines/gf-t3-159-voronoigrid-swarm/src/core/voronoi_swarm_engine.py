"""
GF-T3-159: VoronoiGrid Swarm Decentralized Partitioning Engine
Clean-Room Reference Implementation (Apache 2.0 / MIT Dual License)
"""

from dataclasses import dataclass, field
import math
from typing import List, Tuple, Optional

@dataclass
class Point2D:
    x: float
    y: float

    def __add__(self, other: "Point2D") -> "Point2D":
        return Point2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other: "Point2D") -> "Point2D":
        return Point2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar: float) -> "Point2D":
        return Point2D(self.x * scalar, self.y * scalar)

    def norm(self) -> float:
        return math.hypot(self.x, self.y)

@dataclass
class ExclusionZone:
    center: Point2D
    radius: float
    repulsion_strength: float = 25.0

@dataclass
class DroneAgent:
    agent_id: str
    position: Point2D
    velocity: Point2D = field(default_factory=lambda: Point2D(0.0, 0.0))
    cell_polygon: List[Point2D] = field(default_factory=list)
    cell_area: float = 0.0
    centroid: Point2D = field(default_factory=lambda: Point2D(0.0, 0.0))

class VoronoiSwarmEngine:
    """
    Decentralized Centroidal Voronoi Tessellation & Dynamic Load Balancer.
    """
    def __init__(self, width: float = 960.0, height: float = 560.0, lloyd_gain: float = 0.85):
        self.width = width
        self.height = height
        self.lloyd_gain = lloyd_gain
        self.boundary_box = [
            Point2D(0.0, 0.0),
            Point2D(width, 0.0),
            Point2D(width, height),
            Point2D(0.0, height),
        ]

    def clip_polygon_halfplane(
        self, polygon: List[Point2D], midpoint: Point2D, normal: Point2D
    ) -> List[Point2D]:
        """Sutherland-Hodgman convex polygon clipping."""
        if not polygon:
            return []
        clipped = []
        n = len(polygon)
        for i in range(n):
            curr_pt = polygon[i]
            next_pt = polygon[(i + 1) % n]
            d_curr = (curr_pt.x - midpoint.x) * normal.x + (curr_pt.y - midpoint.y) * normal.y
            d_next = (next_pt.x - midpoint.x) * normal.x + (next_pt.y - midpoint.y) * normal.y

            if d_curr <= 0:
                clipped.append(curr_pt)
                if d_next > 0:
                    t = d_curr / (d_curr - d_next)
                    clipped.append(Point2D(curr_pt.x + t * (next_pt.x - curr_pt.x),
                                           curr_pt.y + t * (next_pt.y - curr_pt.y)))
            else:
                if d_next <= 0:
                    t = d_curr / (d_curr - d_next)
                    clipped.append(Point2D(curr_pt.x + t * (next_pt.x - curr_pt.x),
                                           curr_pt.y + t * (next_pt.y - curr_pt.y)))
        return clipped

    def compute_polygon_area_centroid(self, vertices: List[Point2D]) -> Tuple[float, Point2D]:
        """Shoelace formula for exact planar area and geometric centroid."""
        if len(vertices) < 3:
            return 0.0, Point2D(0.0, 0.0)
        signed_area = 0.0
        cx = 0.0
        cy = 0.0
        n = len(vertices)
        for i in range(n):
            j = (i + 1) % n
            cross = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y
            signed_area += cross
            cx += (vertices[i].x + vertices[j].x) * cross
            cy += (vertices[i].y + vertices[j].y) * cross

        signed_area *= 0.5
        area = abs(signed_area)
        if area < 1e-7:
            return 0.0, Point2D(vertices[0].x, vertices[0].y)
        factor = 1.0 / (6.0 * signed_area)
        return area, Point2D(cx * factor, cy * factor)

    def compute_lyapunov_cost(self, agents: List[DroneAgent]) -> float:
        """Lyapunov energy functional: H(P) = sum_i integral_{V_i} ||q - p_i||^2 dq."""
        total_energy = 0.0
        for agent in agents:
            p = agent.position
            verts = agent.cell_polygon
            if len(verts) < 3:
                continue
            for i in range(len(verts)):
                j = (i + 1) % len(verts)
                ux, uy = verts[i].x - p.x, verts[i].y - p.y
                wx, wy = verts[j].x - p.x, verts[j].y - p.y
                cross = abs(ux * wy - uy * wx)
                u_norm_sq = ux * ux + uy * uy
                w_norm_sq = wx * wx + wy * wy
                dot_uw = ux * wx + uy * wy
                total_energy += (cross / 12.0) * (u_norm_sq + dot_uw + w_norm_sq)
        return total_energy

    def step_relaxation(
        self, agents: List[DroneAgent], obstacles: Optional[List[ExclusionZone]] = None
    ) -> float:
        """Executes one continuous gradient descent step across all agents."""
        obstacles = obstacles or []
        # 1. Compute Voronoi partitions
        for agent in agents:
            poly = list(self.boundary_box)
            for other in agents:
                if other.agent_id == agent.agent_id:
                    continue
                dx = other.position.x - agent.position.x
                dy = other.position.y - agent.position.y
                if dx * dx + dy * dy < 1e-6:
                    continue
                midpoint = Point2D((agent.position.x + other.position.x) * 0.5,
                                   (agent.position.y + other.position.y) * 0.5)
                normal = Point2D(dx, dy)
                poly = self.clip_polygon_halfplane(poly, midpoint, normal)
            agent.cell_polygon = poly
            area, centroid = self.compute_polygon_area_centroid(poly)
            agent.cell_area = area
            agent.centroid = centroid

        # 2. Update agent positions toward centroids + obstacle repulsion
        for agent in agents:
            ex = agent.centroid.x - agent.position.x
            ey = agent.centroid.y - agent.position.y
            fx_obs, fy_obs = 0.0, 0.0
            for obs in obstacles:
                dx = agent.position.x - obs.center.x
                dy = agent.position.y - obs.center.y
                d = math.hypot(dx, dy)
                if d < obs.radius * 1.5 and d > 1e-4:
                    repel = obs.repulsion_strength * (obs.radius * 1.5 - d) / obs.radius
                    fx_obs += (dx / d) * repel
                    fy_obs += (dy / d) * repel

            vx = ex * self.lloyd_gain * 0.2 + fx_obs
            vy = ey * self.lloyd_gain * 0.2 + fy_obs
            agent.position.x = max(5.0, min(self.width - 5.0, agent.position.x + vx))
            agent.position.y = max(5.0, min(self.height - 5.0, agent.position.y + vy))

        return self.compute_lyapunov_cost(agents)
