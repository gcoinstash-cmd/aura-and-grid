import { WellData, SeismicEvent, TurbineStage } from './types';

export const INITIAL_WELLS: WellData[] = [
  { id: 'w1', code: 'PROD-01', type: 'PRODUCTION', depth: 5240, tempC: 464.2, pressureMpa: 27.8, flowKgS: 78.4, enthalpyKjKg: 2780, silicaIndex: 0.82, seismicRisk: 'GREEN', chokePct: 95, status: 'ACTIVE' },
  { id: 'w2', code: 'PROD-02', type: 'PRODUCTION', depth: 5180, tempC: 459.8, pressureMpa: 26.9, flowKgS: 72.1, enthalpyKjKg: 2740, silicaIndex: 0.88, seismicRisk: 'GREEN', chokePct: 90, status: 'ACTIVE' },
  { id: 'w3', code: 'PROD-03', type: 'PRODUCTION', depth: 5310, tempC: 468.1, pressureMpa: 28.5, flowKgS: 68.9, enthalpyKjKg: 2810, silicaIndex: 0.94, seismicRisk: 'AMBER', chokePct: 82, status: 'ACTIVE' },
  { id: 'w4', code: 'PROD-04', type: 'PRODUCTION', depth: 5290, tempC: 461.5, pressureMpa: 27.2, flowKgS: 74.2, enthalpyKjKg: 2760, silicaIndex: 0.79, seismicRisk: 'GREEN', chokePct: 95, status: 'ACTIVE' },
  { id: 'w5', code: 'PROD-05', type: 'PRODUCTION', depth: 5120, tempC: 455.0, pressureMpa: 26.4, flowKgS: 64.5, enthalpyKjKg: 2710, silicaIndex: 0.74, seismicRisk: 'GREEN', chokePct: 88, status: 'ACTIVE' },
  { id: 'w6', code: 'PROD-06', type: 'PRODUCTION', depth: 5360, tempC: 471.3, pressureMpa: 29.1, flowKgS: 62.1, enthalpyKjKg: 2835, silicaIndex: 1.06, seismicRisk: 'AMBER', chokePct: 76, status: 'CHOKED' },
  { id: 'w7', code: 'INJ-01', type: 'INJECTION', depth: 5080, tempC: 64.2, pressureMpa: 28.6, flowKgS: 145.0, enthalpyKjKg: 272, silicaIndex: 0.31, seismicRisk: 'GREEN', chokePct: 100, status: 'ACTIVE' },
  { id: 'w8', code: 'INJ-02', type: 'INJECTION', depth: 5140, tempC: 62.8, pressureMpa: 28.2, flowKgS: 138.5, enthalpyKjKg: 266, silicaIndex: 0.28, seismicRisk: 'GREEN', chokePct: 96, status: 'ACTIVE' },
  { id: 'w9', code: 'INJ-03', type: 'INJECTION', depth: 5210, tempC: 65.1, pressureMpa: 28.4, flowKgS: 136.7, enthalpyKjKg: 276, silicaIndex: 0.35, seismicRisk: 'AMBER', chokePct: 85, status: 'ACTIVE' },
];

export const INITIAL_TURBINES: TurbineStage[] = [
  { stage: 1, name: 'Stage 1: HP Supercritical Expander', mwE: 48.2, inletMpa: 27.8, inletTempC: 460.5, rpm: 5400, efficiencyPct: 91.4, vacuumKpa: -94.2, vibrationMmS: 1.12 },
  { stage: 2, name: 'Stage 2: IP Reheat Flash Expander', mwE: 42.1, inletMpa: 11.2, inletTempC: 385.0, rpm: 3600, efficiencyPct: 89.8, vacuumKpa: -94.1, vibrationMmS: 0.94 },
  { stage: 3, name: 'Stage 3: LP Dual-Flash Generator', mwE: 34.5, inletMpa: 3.4, inletTempC: 240.2, rpm: 3000, efficiencyPct: 88.2, vacuumKpa: -94.2, vibrationMmS: 0.88 },
  { stage: 4, name: 'Stage 4: Binary Isobutane ORC', mwE: 23.8, inletMpa: 1.8, inletTempC: 148.0, rpm: 1800, efficiencyPct: 86.5, vacuumKpa: -94.5, vibrationMmS: 0.65 },
];

export const INITIAL_SEISMIC: SeismicEvent[] = [
  { id: 'ev-1', depthM: 5142, mag: 0.42, xPct: 44, yPct: 76, timestamp: '13:02:14', strike: 214, dip: 78, freqHz: 185, tier: 'GREEN' },
  { id: 'ev-2', depthM: 5210, mag: 0.68, xPct: 56, yPct: 82, timestamp: '13:03:50', strike: 218, dip: 82, freqHz: 162, tier: 'GREEN' },
  { id: 'ev-3', depthM: 4980, mag: 0.15, xPct: 38, yPct: 69, timestamp: '13:04:18', strike: 205, dip: 75, freqHz: 210, tier: 'GREEN' },
  { id: 'ev-4', depthM: 5320, mag: 0.89, xPct: 68, yPct: 88, timestamp: '13:05:02', strike: 222, dip: 85, freqHz: 142, tier: 'AMBER' },
  { id: 'ev-5', depthM: 5060, mag: 0.31, xPct: 49, yPct: 72, timestamp: '13:05:44', strike: 210, dip: 76, freqHz: 195, tier: 'GREEN' },
];
