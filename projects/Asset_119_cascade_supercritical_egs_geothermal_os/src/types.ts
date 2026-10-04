export interface WellData {
  id: string;
  code: string;
  type: 'PRODUCTION' | 'INJECTION';
  depth: number;
  tempC: number;
  pressureMpa: number;
  flowKgS: number;
  enthalpyKjKg: number;
  silicaIndex: number;
  seismicRisk: 'GREEN' | 'AMBER' | 'RED';
  chokePct: number;
  status: 'ACTIVE' | 'CHOKED' | 'FLUSHING' | 'ISOLATED';
}

export interface SeismicEvent {
  id: string;
  depthM: number;
  mag: number;
  xPct: number;
  yPct: number;
  timestamp: string;
  strike: number;
  dip: number;
  freqHz: number;
  tier: 'GREEN' | 'AMBER' | 'RED';
}

export interface TurbineStage {
  stage: number;
  name: string;
  mwE: number;
  inletMpa: number;
  inletTempC: number;
  rpm: number;
  efficiencyPct: number;
  vacuumKpa: number;
  vibrationMmS: number;
}
