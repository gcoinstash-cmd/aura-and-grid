import { TelemetryState, DriveMode, ArbitrageVector } from '../types/telemetry';

const INITIAL_ROUTES: ArbitrageVector[] = [
  {
    route: 'AURORA ↔ LD4',
    sourceVenue: 'CME Chicago',
    targetVenue: 'Equinix London',
    distanceKm: 6380,
    fiberLatencyNs: 34100000,
    quantumChronoLatencyNs: 31280000,
    deltaGainNs: 2820000,
    projectedAlphaBps: 4.82,
    annualizedYieldUsd: 18450000,
    status: 'OPTIMAL',
  },
  {
    route: 'NY4 ↔ TY3',
    sourceVenue: 'Secaucus NY',
    targetVenue: 'Tokyo TY3',
    distanceKm: 10850,
    fiberLatencyNs: 67200000,
    quantumChronoLatencyNs: 61450000,
    deltaGainNs: 5750000,
    projectedAlphaBps: 8.15,
    annualizedYieldUsd: 31200000,
    status: 'EXECUTING',
  },
  {
    route: 'FR2 ↔ HKG1',
    sourceVenue: 'Frankfurt Eurex',
    targetVenue: 'Hong Kong HKEX',
    distanceKm: 9160,
    fiberLatencyNs: 58400000,
    quantumChronoLatencyNs: 53100000,
    deltaGainNs: 5300000,
    projectedAlphaBps: 6.94,
    annualizedYieldUsd: 24800000,
    status: 'CONVERGING',
  },
  {
    route: 'LD4 ↔ SG1',
    sourceVenue: 'London LSE',
    targetVenue: 'Singapore SGX',
    distanceKm: 10840,
    fiberLatencyNs: 68900000,
    quantumChronoLatencyNs: 63200000,
    deltaGainNs: 5700000,
    projectedAlphaBps: 7.42,
    annualizedYieldUsd: 28100000,
    status: 'OPTIMAL',
  },
];

export class TelemetryEngine {
  private state: TelemetryState;
  private listeners: Set<(state: TelemetryState) => void> = new Set();
  private intervalId: number | null = null;
  private tickCount: number = 0;

  constructor() {
    this.state = {
      timestamp: new Date().toISOString(),
      microsecondTime: performance.now(),
      driveMode: 'LATENCY_ARBITRAGE',
      quantum: {
        coherenceRate: 99.984,
        qubitsActive: 512,
        cryoTempMK: 12.38,
        photonFluxTHz: 420.84,
        hamiltonianEigenvalue: 4.892,
        phaseDriftPs: 0.124,
        laserEmeraldOutputW: 48.5,
        laserGoldOutputW: 36.2,
      },
      aero: {
        downforceKgf: 1420,
        dragCoefficientCd: 0.284,
        diffuserAngleDeg: 14.5,
        frontSplitterSuctionHPa: 890,
        pushrodStrainFrontKn: 8.42,
        pushrodStrainRearKn: 12.18,
        rideHeightMm: 52,
        speedKmh: 318,
        groundEffectVenturiLoadKgf: 960,
      },
      arbitrageRoutes: INITIAL_ROUTES,
      accumulatedAlphaUsd: 4821590.40,
      systemHealth: 99.98,
      coolingPumpActive: true,
      conduitLaserFreqHz: 5.32e14,
    };
  }

  public start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 100);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(cb: (state: TelemetryState) => void) {
    this.listeners.add(cb);
    cb(this.state);
    return () => this.listeners.delete(cb);
  }

  public setDriveMode(mode: DriveMode) {
    this.state.driveMode = mode;
    this.applyModeModifiers(mode);
    this.notify();
  }

  public setDiffuserAngle(angle: number) {
    this.state.aero.diffuserAngleDeg = angle;
    this.recomputeAero();
    this.notify();
  }

  public toggleCryoPump() {
    this.state.coolingPumpActive = !this.state.coolingPumpActive;
    this.notify();
  }

  public triggerShockEvent(type: 'FLASH_VOLATILITY' | 'DECOHERENCE_PULSE' | 'WARP_BURST') {
    if (type === 'FLASH_VOLATILITY') {
      this.state.accumulatedAlphaUsd += 42180.50;
      this.state.arbitrageRoutes = this.state.arbitrageRoutes.map(r => ({
        ...r,
        projectedAlphaBps: +(r.projectedAlphaBps * 1.45).toFixed(2),
        status: 'EXECUTING',
      }));
    } else if (type === 'DECOHERENCE_PULSE') {
      this.state.quantum.coherenceRate = 98.42;
      this.state.quantum.phaseDriftPs = 0.89;
      setTimeout(() => {
        this.state.quantum.coherenceRate = 99.984;
        this.state.quantum.phaseDriftPs = 0.124;
        this.notify();
      }, 1200);
    } else if (type === 'WARP_BURST') {
      this.state.aero.speedKmh = 388;
      this.state.aero.downforceKgf = 1890;
      this.state.quantum.photonFluxTHz = 492.5;
    }
    this.notify();
  }

  private applyModeModifiers(mode: DriveMode) {
    switch (mode) {
      case 'LATENCY_ARBITRAGE':
        this.state.quantum.laserEmeraldOutputW = 54.2;
        this.state.quantum.laserGoldOutputW = 42.0;
        this.state.aero.downforceKgf = 1420;
        this.state.aero.speedKmh = 320;
        break;
      case 'CROSS_EXCHANGE':
        this.state.quantum.laserEmeraldOutputW = 45.0;
        this.state.quantum.laserGoldOutputW = 48.0;
        this.state.aero.downforceKgf = 1550;
        this.state.aero.speedKmh = 295;
        break;
      case 'QUANTUM_SUPERPOSITION':
        this.state.quantum.laserEmeraldOutputW = 62.0;
        this.state.quantum.laserGoldOutputW = 38.5;
        this.state.quantum.coherenceRate = 99.998;
        this.state.aero.downforceKgf = 1680;
        this.state.aero.speedKmh = 345;
        break;
      case 'SLIPSTREAM_WARP':
        this.state.quantum.laserEmeraldOutputW = 68.0;
        this.state.quantum.laserGoldOutputW = 52.0;
        this.state.aero.downforceKgf = 2120;
        this.state.aero.diffuserAngleDeg = 18.0;
        this.state.aero.speedKmh = 412;
        break;
    }
  }

  private recomputeAero() {
    const angle = this.state.aero.diffuserAngleDeg;
    // Aerodynamic physical model mapping
    this.state.aero.downforceKgf = Math.round(950 + angle * 38.5 + (this.state.aero.speedKmh * 0.8));
    this.state.aero.dragCoefficientCd = +(0.26 + (angle / 20) * 0.05).toFixed(3);
    this.state.aero.groundEffectVenturiLoadKgf = Math.round(this.state.aero.downforceKgf * 0.68);
  }

  private tick() {
    this.tickCount++;
    const now = new Date();
    this.state.timestamp = now.toISOString();
    this.state.microsecondTime = performance.now();

    // Deterministic subtle oscillations
    const sin1 = Math.sin(this.tickCount * 0.1);
    const cos1 = Math.cos(this.tickCount * 0.07);

    // Quantum jitter
    this.state.quantum.cryoTempMK = +(12.38 + sin1 * 0.04).toFixed(3);
    this.state.quantum.phaseDriftPs = +(0.124 + Math.abs(cos1) * 0.035).toFixed(3);
    this.state.quantum.photonFluxTHz = +(420.84 + sin1 * 1.2).toFixed(2);
    this.state.quantum.coherenceRate = +(99.980 + Math.abs(sin1) * 0.018).toFixed(3);

    // Mechanical suspension dynamic strain
    this.state.aero.pushrodStrainFrontKn = +(8.42 + sin1 * 0.35).toFixed(2);
    this.state.aero.pushrodStrainRearKn = +(12.18 + cos1 * 0.45).toFixed(2);

    // Incremental alpha accumulation
    this.state.accumulatedAlphaUsd += (18.45 + Math.abs(sin1) * 12.3);

    // Periodically update route state
    if (this.tickCount % 20 === 0) {
      this.state.arbitrageRoutes = this.state.arbitrageRoutes.map((r, idx) => {
        const jitter = Math.sin(this.tickCount + idx) * 0.15;
        return {
          ...r,
          projectedAlphaBps: +(r.projectedAlphaBps + jitter * 0.08).toFixed(2),
        };
      });
    }

    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public getState(): TelemetryState {
    return { ...this.state };
  }
}

export const telemetryEngine = new TelemetryEngine();
