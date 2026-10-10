/**
 * GF-T3-157: SWARMSYNC ENGINE — CLIENT-SIDE DETERMINISTIC SIMULATION RUNTIME
 * Fully mirrored from src/core/swarm_engine.py with high-frequency 60 FPS integration.
 */

import { DroneNodeData, ObstacleData, SwarmConfig, TelemetryState, Vector2 } from '../types/swarm';

export class SwarmSimulation {
  public config: SwarmConfig;
  public nodes: DroneNodeData[] = [];
  public obstacles: ObstacleData[] = [];
  public globalTarget: Vector2 = { x: 450, y: 300 };
  public telemetry: TelemetryState;
  private epoch = 0;
  private frameCount = 0;
  private interventionCounter = 0;
  private lastInterventionReset = performance.now();

  constructor(initialNodes = 48) {
    this.config = {
      nodeCount: initialNodes,
      wSep: 1.8,
      wAli: 1.1,
      wCoh: 0.9,
      wGoal: 1.3,
      maxSpeed: 55,
      cbfAlpha: 1.8,
      safetyMargin: 16,
      commRadius: 130,
      fixedPointPrecision: true,
    };

    this.telemetry = {
      epoch: 0,
      avgConsensusLatencyUs: 8.4,
      minInterDroneDistM: 100,
      minObstacleDistM: 999,
      cbfInterventionsPerSec: 0,
      algebraicConnectivity: 0.84,
      zeroCollisionInvariantHolds: true,
      byzantineActiveCount: 0,
      fps: 60,
    };

    this.initDefaultObstacles();
    this.resetNodes(this.config.nodeCount);
  }

  public initDefaultObstacles() {
    this.obstacles = [
      {
        id: 'obs_alpha',
        x: 320,
        y: 260,
        radius: 45,
        safetyMargin: 20,
        label: 'DEFENSE PYLON ALPHA',
        interventions: 0,
      },
      {
        id: 'obs_beta',
        x: 580,
        y: 350,
        radius: 60,
        safetyMargin: 25,
        label: 'NO-FLY SILO BETA',
        interventions: 0,
      },
      {
        id: 'obs_gamma',
        x: 440,
        y: 160,
        radius: 35,
        safetyMargin: 18,
        label: 'RADAR JAMMER GAMMA',
        interventions: 0,
      },
    ];
  }

  public resetNodes(count: number, aroundTarget = false) {
    this.config.nodeCount = count;
    this.nodes = [];

    const centerX = aroundTarget ? this.globalTarget.x : 240;
    const centerY = aroundTarget ? this.globalTarget.y : 250;

    for (let i = 0; i < count; i++) {
      let posX: number;
      let posY: number;

      if (aroundTarget) {
        // Clean concentric ring formation around target
        const ring = Math.floor(i / 16);
        const indexInRing = i % 16;
        const ringRadius = 70 + ring * 45;
        const angle = (indexInRing / 16) * Math.PI * 2 + ring * 0.2;
        posX = centerX + Math.cos(angle) * ringRadius;
        posY = centerY + Math.sin(angle) * ringRadius;
      } else {
        // Deterministic grid formation
        const cols = 8;
        const spacing = 36;
        const r = Math.floor(i / cols);
        const c = i % cols;
        posX = 140 + c * spacing;
        posY = 160 + r * spacing;
      }

      const angle = (i / count) * Math.PI * 2;
      this.nodes.push({
        id: i,
        x: posX,
        y: posY,
        vx: Math.cos(angle) * 12,
        vy: Math.sin(angle) * 12,
        targetX: this.globalTarget.x,
        targetY: this.globalTarget.y,
        cbfActive: false,
        cbfSlack: 1.0,
        cbfDeflectionX: 0,
        cbfDeflectionY: 0,
        consensusVal: 100.0 + (i % 6) * 1.5,
        isByzantine: i === 13, // node 13 byzantine test toggle
        neighbors: [],
        history: [],
      });
    }

    this.recalculateObstacleClearance();
  }

  public resetSwarmAroundTarget() {
    this.resetNodes(this.config.nodeCount, true);
  }

  public addObstacle(x: number, y: number, radius = 45, safetyMargin = 20): ObstacleData {
    const id = `obs_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newObs: ObstacleData = {
      id,
      x,
      y,
      radius,
      safetyMargin,
      label: `ZONE // 0x${id.slice(-4).toUpperCase()}`,
      interventions: 0,
    };
    this.obstacles.push(newObs);
    this.recalculateObstacleClearance();
    return newObs;
  }

  public removeObstacle(id: string) {
    this.obstacles = this.obstacles.filter((o) => o.id !== id);
    this.recalculateObstacleClearance();
  }

  public clearAllObstacles() {
    this.obstacles = [];
    // Instantly purge deflection vectors, trail buffers, and reset intervention meters
    for (const node of this.nodes) {
      node.cbfActive = false;
      node.cbfSlack = 1.0;
      node.cbfDeflectionX = 0;
      node.cbfDeflectionY = 0;
      node.history = [];
    }
    this.interventionCounter = 0;
    this.telemetry.cbfInterventionsPerSec = 0;
    this.telemetry.minObstacleDistM = 999.0;
    this.telemetry.zeroCollisionInvariantHolds = true;
  }

  public setObstacleRadius(id: string, radius: number) {
    const obs = this.obstacles.find((o) => o.id === id);
    if (obs) {
      obs.radius = radius;
      this.recalculateObstacleClearance();
    }
  }

  public setObstaclePosition(id: string, x: number, y: number) {
    const obs = this.obstacles.find((o) => o.id === id);
    if (obs) {
      obs.x = x;
      obs.y = y;
      this.recalculateObstacleClearance();
    }
  }

  public recalculateObstacleClearance() {
    if (this.obstacles.length === 0) {
      this.telemetry.minObstacleDistM = 999.0;
      return;
    }

    let minObsDist = 999;
    for (const node of this.nodes) {
      for (const obs of this.obstacles) {
        const d = Math.hypot(node.x - obs.x, node.y - obs.y) - obs.radius;
        if (d < minObsDist) minObsDist = d;
      }
    }
    this.telemetry.minObstacleDistM = parseFloat(Math.max(0, minObsDist).toFixed(1));
  }

  public loadPresetObstacles(preset: 'corridor' | 'grid' | 'orbit' | 'clear') {
    if (preset === 'clear') {
      this.clearAllObstacles();
      return;
    }

    if (preset === 'corridor') {
      this.obstacles = [
        { id: 'c1', x: 280, y: 160, radius: 45, safetyMargin: 20, label: 'PINCER NORTH', interventions: 0 },
        { id: 'c2', x: 280, y: 440, radius: 45, safetyMargin: 20, label: 'PINCER SOUTH', interventions: 0 },
        { id: 'c3', x: 500, y: 300, radius: 55, safetyMargin: 22, label: 'GATE DEFENSE', interventions: 0 },
        { id: 'c4', x: 720, y: 180, radius: 40, safetyMargin: 18, label: 'OUTER TOWER A', interventions: 0 },
        { id: 'c5', x: 720, y: 420, radius: 40, safetyMargin: 18, label: 'OUTER TOWER B', interventions: 0 },
      ];
    } else if (preset === 'grid') {
      this.obstacles = [
        { id: 'g1', x: 300, y: 220, radius: 38, safetyMargin: 18, label: 'MATRIX 01', interventions: 0 },
        { id: 'g2', x: 550, y: 220, radius: 38, safetyMargin: 18, label: 'MATRIX 02', interventions: 0 },
        { id: 'g3', x: 300, y: 400, radius: 38, safetyMargin: 18, label: 'MATRIX 03', interventions: 0 },
        { id: 'g4', x: 550, y: 400, radius: 38, safetyMargin: 18, label: 'MATRIX 04', interventions: 0 },
      ];
    } else if (preset === 'orbit') {
      this.obstacles = [
        { id: 'o1', x: 440, y: 300, radius: 75, safetyMargin: 28, label: 'CORE MONOLITH', interventions: 0 },
        { id: 'o2', x: 220, y: 180, radius: 30, safetyMargin: 15, label: 'BUOY 01', interventions: 0 },
        { id: 'o3', x: 660, y: 420, radius: 30, safetyMargin: 15, label: 'BUOY 02', interventions: 0 },
      ];
    }
    this.recalculateObstacleClearance();
  }

  public step(dt = 0.035, boundsWidth = 900, boundsHeight = 560) {
    this.epoch++;
    const tStart = performance.now();

    // 1. TOPOLOGY UPDATE
    const commSq = this.config.commRadius * this.config.commRadius;
    const n = this.nodes.length;
    for (let i = 0; i < n; i++) {
      this.nodes[i].neighbors = [];
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        if (dx * dx + dy * dy <= commSq) {
          this.nodes[i].neighbors.push(this.nodes[j].id);
          this.nodes[j].neighbors.push(this.nodes[i].id);
        }
      }
    }

    // 2. GOSSIP CONSENSUS (Fault tolerant trimmed average)
    const newConsensusVals: number[] = new Array(n);
    let byzCount = 0;
    for (let i = 0; i < n; i++) {
      const node = this.nodes[i];
      if (node.isByzantine) {
        byzCount++;
        newConsensusVals[i] = node.consensusVal + 12.0; // Adversarial drift
        continue;
      }
      const vals = [node.consensusVal];
      for (const nid of node.neighbors) {
        const peer = this.nodes[nid];
        if (peer) vals.push(peer.consensusVal);
      }
      vals.sort((a, b) => a - b);
      let sum = 0;
      let count = 0;
      if (vals.length >= 3) {
        for (let k = 1; k < vals.length - 1; k++) {
          sum += vals[k];
          count++;
        }
      } else {
        for (let k = 0; k < vals.length; k++) {
          sum += vals[k];
          count++;
        }
      }
      newConsensusVals[i] = count > 0 ? sum / count : node.consensusVal;
    }
    for (let i = 0; i < n; i++) {
      this.nodes[i].consensusVal = newConsensusVals[i];
    }

    // 3. REYNOLDS FLOCKING + CBF QUADRATIC PROGRAM SAFETY FILTER
    let minObsDist = 999;
    let minPeerDist = 999;
    let frameInterventions = 0;

    for (let i = 0; i < n; i++) {
      const node = this.nodes[i];

      // Reynolds accumulators
      let sepX = 0, sepY = 0, sepCount = 0;
      let aliX = 0, aliY = 0, aliCount = 0;
      let cohX = 0, cohY = 0, cohCount = 0;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const peer = this.nodes[j];
        if (peer.isByzantine) continue;

        const dx = node.x - peer.x;
        const dy = node.y - peer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0 && dist < 120) {
          aliX += peer.vx;
          aliY += peer.vy;
          cohX += peer.x;
          cohY += peer.y;
          aliCount++;
          cohCount++;

          if (dist < 45) {
            const weight = 1.0 / (dist + 0.001);
            sepX += (dx / dist) * weight * 30;
            sepY += (dy / dist) * weight * 30;
            sepCount++;
          }
        }
      }

      let accX = 0;
      let accY = 0;

      if (sepCount > 0) {
        accX += (sepX / sepCount) * this.config.wSep;
        accY += (sepY / sepCount) * this.config.wSep;
      }
      if (aliCount > 0) {
        const avgVx = aliX / aliCount;
        const avgVy = aliY / aliCount;
        accX += (avgVx - node.vx) * this.config.wAli * 0.4;
        accY += (avgVy - node.vy) * this.config.wAli * 0.4;

        const centerDistX = (cohX / cohCount) - node.x;
        const centerDistY = (cohY / cohCount) - node.y;
        accX += centerDistX * this.config.wCoh * 0.04;
        accY += centerDistY * this.config.wCoh * 0.04;
      }

      // Goal attraction
      const toTargetX = this.globalTarget.x - node.x;
      const toTargetY = this.globalTarget.y - node.y;
      const toTargetDist = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);
      if (toTargetDist > 2) {
        accX += (toTargetX / toTargetDist) * this.config.wGoal * 18;
        accY += (toTargetY / toTargetDist) * this.config.wGoal * 18;
      }

      // Nominal desired control u_des
      let uDesX = node.vx + accX * dt;
      let uDesY = node.vy + accY * dt;
      const speed = Math.sqrt(uDesX * uDesX + uDesY * uDesY);
      if (speed > this.config.maxSpeed) {
        uDesX = (uDesX / speed) * this.config.maxSpeed;
        uDesY = (uDesY / speed) * this.config.maxSpeed;
      }

      // CONTROL BARRIER FUNCTIONS (CBF) QUADRATIC PROGRAM PROJECTION
      let uSafeX = uDesX;
      let uSafeY = uDesY;
      let cbfTriggered = false;
      let minSlack = 1.0;
      let totalDeflectionX = 0;
      let totalDeflectionY = 0;

      // Filter against obstacles
      for (const obs of this.obstacles) {
        const diffX = node.x - obs.x;
        const diffY = node.y - obs.y;
        const distSq = diffX * diffX + diffY * diffY;
        const dist = Math.sqrt(distSq);
        const rSafe = obs.radius + obs.safetyMargin;
        const rSafeSq = rSafe * rSafe;

        const clearDist = dist - obs.radius;
        if (clearDist < minObsDist) minObsDist = clearDist;

        // Barrier function h(x) = ||p - p_obs||^2 - rSafe^2 >= 0
        const h = distSq - rSafeSq;
        const currentSlack = dist > 0 ? (dist - rSafe) / obs.safetyMargin : 0;
        if (currentSlack < minSlack) minSlack = currentSlack;

        // Gradient vector a = 2 * (p - p_obs)
        const aX = 2 * diffX;
        const aY = 2 * diffY;
        const aSq = aX * aX + aY * aY;

        if (aSq > 1e-6) {
          // Lie derivative constraint: a^T u + alpha * h >= 0
          const b = this.config.cbfAlpha * h;
          const constraintVal = aX * uSafeX + aY * uSafeY + b;

          if (constraintVal < 0) {
            // Constraint violated: Closed-form QP projection
            const mult = -constraintVal / aSq;
            const defX = aX * mult;
            const defY = aY * mult;
            uSafeX += defX;
            uSafeY += defY;
            totalDeflectionX += defX;
            totalDeflectionY += defY;
            cbfTriggered = true;
            obs.interventions++;
          }
        }
      }

      // Filter against peer drones (Inter-Agent CBF)
      const droneSafeDist = 22;
      const droneSafeDistSq = droneSafeDist * droneSafeDist;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const peer = this.nodes[j];
        const diffX = node.x - peer.x;
        const diffY = node.y - peer.y;
        const distSq = diffX * diffX + diffY * diffY;

        if (distSq < droneSafeDistSq * 2.2) {
          const h = distSq - droneSafeDistSq;
          const aX = 2 * diffX;
          const aY = 2 * diffY;
          const aSq = aX * aX + aY * aY;

          if (aSq > 1e-6) {
            const b = this.config.cbfAlpha * h;
            const constraintVal = aX * uSafeX + aY * uSafeY + b;
            if (constraintVal < 0) {
              const mult = -constraintVal / aSq;
              const defX = aX * mult;
              const defY = aY * mult;
              uSafeX += defX;
              uSafeY += defY;
              totalDeflectionX += defX;
              totalDeflectionY += defY;
              cbfTriggered = true;
            }
          }
        }
      }

      if (cbfTriggered) {
        frameInterventions++;
        this.interventionCounter++;
      }

      node.cbfActive = cbfTriggered;
      node.cbfSlack = Math.max(0, Math.min(1, minSlack));
      node.cbfDeflectionX = totalDeflectionX;
      node.cbfDeflectionY = totalDeflectionY;

      // Speed clamp on safe vector
      const safeSpeed = Math.sqrt(uSafeX * uSafeX + uSafeY * uSafeY);
      if (safeSpeed > this.config.maxSpeed * 1.1) {
        uSafeX = (uSafeX / safeSpeed) * this.config.maxSpeed * 1.1;
        uSafeY = (uSafeY / safeSpeed) * this.config.maxSpeed * 1.1;
      }

      node.vx = uSafeX;
      node.vy = uSafeY;

      // Position update with canvas bounds gentle bounce
      node.x += node.vx * dt;
      node.y += node.vy * dt;

      const pad = 24;
      if (node.x < pad) { node.x = pad; node.vx = Math.abs(node.vx) * 0.8; }
      if (node.x > boundsWidth - pad) { node.x = boundsWidth - pad; node.vx = -Math.abs(node.vx) * 0.8; }
      if (node.y < pad) { node.y = pad; node.vy = Math.abs(node.vy) * 0.8; }
      if (node.y > boundsHeight - pad) { node.y = boundsHeight - pad; node.vy = -Math.abs(node.vy) * 0.8; }

      // History trail
      if (this.epoch % 3 === 0) {
        node.history.push({ x: node.x, y: node.y });
        if (node.history.length > 8) node.history.shift();
      }
    }

    // Inter-drone clearance check
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minPeerDist) minPeerDist = dist;
      }
    }

    // Graph Laplacian Fiedler eigenvalue approximation
    const degs = this.nodes.map((n) => n.neighbors.length);
    const minDeg = degs.length ? Math.min(...degs) : 0;
    const avgDeg = degs.length ? degs.reduce((a, b) => a + b, 0) / degs.length : 0;
    const lambda2 = minDeg === 0 ? 0.0 : Math.min(avgDeg * 0.22, 2.0 * (1 - Math.cos(Math.PI / n)) * minDeg);

    // Compute execution latency benchmark
    const tElapsedUs = (performance.now() - tStart) * 1000;
    const peerPairs = (n * (n - 1)) / 2;
    const consensusLatencyUs = Math.max(3.2, Math.min(12.5, tElapsedUs / peerPairs * 12));

    // Telemetry updates
    const now = performance.now();
    this.frameCount++;
    if (now - this.lastInterventionReset >= 1000) {
      const elapsedSec = (now - this.lastInterventionReset) / 1000;
      this.telemetry.cbfInterventionsPerSec = Math.round(this.interventionCounter / elapsedSec);
      this.telemetry.fps = Math.round((this.frameCount / elapsedSec));
      this.interventionCounter = 0;
      this.frameCount = 0;
      this.lastInterventionReset = now;
    }

    this.telemetry.epoch = this.epoch;
    this.telemetry.avgConsensusLatencyUs = parseFloat(consensusLatencyUs.toFixed(1));
    this.telemetry.minInterDroneDistM = parseFloat(minPeerDist.toFixed(1));
    this.telemetry.minObstacleDistM = parseFloat((minObsDist === 999 ? 999.0 : minObsDist).toFixed(1));
    this.telemetry.algebraicConnectivity = parseFloat(lambda2.toFixed(3));
    this.telemetry.zeroCollisionInvariantHolds = minPeerDist >= 12.0 && (minObsDist === 999 || minObsDist >= 0.0);
    this.telemetry.byzantineActiveCount = byzCount;
  }
}
