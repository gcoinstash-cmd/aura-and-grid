/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AegisSwarmControl - Single-File Flagship Operational Dashboard
 * Autonomous Perimeter Defense Command Deck
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  Radio,
  Zap,
  AlertTriangle,
  Power,
  Battery,
  Activity,
  Maximize2,
  Lock,
  Unlock,
  Target,
  CircleDot,
  Filter,
  Volume2,
  VolumeX,
  Database
} from 'lucide-react';

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

export type ThreatLevel = 'DEFCON 4 / GUARDED' | 'DEFCON 3 / ELEVATED' | 'DEFCON 2 / SEVERE' | 'DEFCON 1 / MAXIMUM';

export type PayloadMode = 'EO/IR Optical' | 'RF Jammer' | 'Kinetic Net' | 'LIDAR Recon';

export type DroneStatus = 
  | 'AIRBORNE // PATROL' 
  | 'INTERCEPT VECTOR' 
  | 'RTB // CHARGING' 
  | 'STATIONARY HOVER' 
  | 'EW JAMMING ACTIVE';

export interface SwarmDrone {
  id: string;
  callsign: string;
  status: DroneStatus;
  altitudeM: number;
  airspeedKts: number;
  batteryPct: number;
  runtimeMin: number;
  payload: PayloadMode;
  headingDeg: number;
  posXM: number; // relative to Hub (0,0) in meters
  posYM: number;
  orbitRadiusM: number;
  orbitAngleDeg: number;
  orbitSpeedDegPerSec: number;
  sensorFovDeg: number;
  targetLockId: string | null;
  meshSignalSnrDb: number;
}

export interface RadarBogey {
  id: string;
  code: string;
  transponder: string;
  threatTier: 'MONITOR' | 'ELEVATED' | 'CRITICAL' | 'HOSTILE';
  classification: string;
  speedKts: number;
  headingDeg: number;
  rangeM: number;
  altitudeM: number;
  timeToBreachSec: number;
  posXM: number;
  posYM: number;
  status: 'INBOUND' | 'INTERCEPTING' | 'CONTAINED' | 'NEUTRALIZED';
  assignedDroneId: string | null;
}

export interface RfSpectrumBand {
  id: string;
  name: string;
  centerFreqMhz: number;
  noiseFloorDbm: number;
  peakSignalDbm: number;
  jammingDetected: boolean;
  jammingType: string;
  countermeasureActive: boolean;
}

export interface InterceptLedgerEntry {
  id: string;
  timestamp: string;
  nodeCallsign: string;
  contactCode: string;
  countermeasureType: string;
  authorizedBy: string;
  status: 'COMPLETED' | 'IN_FLIGHT' | 'ABORTED';
  rangeM: number;
  outcome: string;
}

// =============================================================================
// INITIAL DATA CONSTANTS
// =============================================================================

const INITIAL_DRONES: SwarmDrone[] = [
  { id: 'SWARM-01', callsign: 'Aegis Vector 01', status: 'AIRBORNE // PATROL', altitudeM: 245, airspeedKts: 68.4, batteryPct: 94.2, runtimeMin: 52, payload: 'EO/IR Optical', headingDeg: 34, posXM: 1800, posYM: 2400, orbitRadiusM: 3000, orbitAngleDeg: 53, orbitSpeedDegPerSec: 1.2, sensorFovDeg: 80, targetLockId: null, meshSignalSnrDb: 36.8 },
  { id: 'SWARM-02', callsign: 'Aegis Vector 02', status: 'AIRBORNE // PATROL', altitudeM: 260, airspeedKts: 71.0, batteryPct: 91.0, runtimeMin: 48, payload: 'RF Jammer', headingDeg: 72, posXM: 3100, posYM: 1400, orbitRadiusM: 3400, orbitAngleDeg: 24, orbitSpeedDegPerSec: 1.1, sensorFovDeg: 75, targetLockId: null, meshSignalSnrDb: 34.2 },
  { id: 'SWARM-03', callsign: 'Aegis Vector 03', status: 'INTERCEPT VECTOR', altitudeM: 310, airspeedKts: 92.5, batteryPct: 87.5, runtimeMin: 41, payload: 'Kinetic Net', headingDeg: 115, posXM: 4200, posYM: -800, orbitRadiusM: 4275, orbitAngleDeg: 349, orbitSpeedDegPerSec: 2.4, sensorFovDeg: 90, targetLockId: 'BOGEY-ALPHA', meshSignalSnrDb: 32.5 },
  { id: 'SWARM-04', callsign: 'Aegis Vector 04', status: 'AIRBORNE // PATROL', altitudeM: 230, airspeedKts: 64.0, batteryPct: 89.2, runtimeMin: 46, payload: 'EO/IR Optical', headingDeg: 158, posXM: 2900, posYM: -2600, orbitRadiusM: 3895, orbitAngleDeg: 318, orbitSpeedDegPerSec: 1.0, sensorFovDeg: 75, targetLockId: null, meshSignalSnrDb: 35.0 },
  { id: 'SWARM-05', callsign: 'Aegis Vector 05', status: 'AIRBORNE // PATROL', altitudeM: 280, airspeedKts: 69.2, batteryPct: 85.0, runtimeMin: 42, payload: 'LIDAR Recon', headingDeg: 205, posXM: 1100, posYM: -3800, orbitRadiusM: 3956, orbitAngleDeg: 286, orbitSpeedDegPerSec: 1.2, sensorFovDeg: 85, targetLockId: null, meshSignalSnrDb: 33.1 },
  { id: 'SWARM-06', callsign: 'Aegis Vector 06', status: 'AIRBORNE // PATROL', altitudeM: 255, airspeedKts: 66.8, batteryPct: 86.4, runtimeMin: 43, payload: 'EO/IR Optical', headingDeg: 248, posXM: -1600, posYM: -3200, orbitRadiusM: 3578, orbitAngleDeg: 243, orbitSpeedDegPerSec: 1.1, sensorFovDeg: 80, targetLockId: null, meshSignalSnrDb: 34.7 },
  { id: 'SWARM-07', callsign: 'Aegis Vector 07', status: 'INTERCEPT VECTOR', altitudeM: 340, airspeedKts: 96.0, batteryPct: 82.1, runtimeMin: 37, payload: 'Kinetic Net', headingDeg: 290, posXM: -3400, posYM: -1200, orbitRadiusM: 3605, orbitAngleDeg: 199, orbitSpeedDegPerSec: 2.2, sensorFovDeg: 90, targetLockId: 'BOGEY-BRAVO', meshSignalSnrDb: 31.9 },
  { id: 'SWARM-08', callsign: 'Aegis Vector 08', status: 'AIRBORNE // PATROL', altitudeM: 235, airspeedKts: 65.5, batteryPct: 93.8, runtimeMin: 51, payload: 'RF Jammer', headingDeg: 330, posXM: -2800, posYM: 1900, orbitRadiusM: 3384, orbitAngleDeg: 145, orbitSpeedDegPerSec: 1.3, sensorFovDeg: 75, targetLockId: null, meshSignalSnrDb: 36.1 },
  { id: 'SWARM-09', callsign: 'Aegis Sentinel 09', status: 'AIRBORNE // PATROL', altitudeM: 190, airspeedKts: 58.0, batteryPct: 88.0, runtimeMin: 44, payload: 'EO/IR Optical', headingDeg: 12, posXM: 800, posYM: 1500, orbitRadiusM: 1700, orbitAngleDeg: 62, orbitSpeedDegPerSec: 1.8, sensorFovDeg: 70, targetLockId: null, meshSignalSnrDb: 38.2 },
  { id: 'SWARM-10', callsign: 'Aegis Sentinel 10', status: 'AIRBORNE // PATROL', altitudeM: 210, airspeedKts: 60.5, batteryPct: 87.2, runtimeMin: 43, payload: 'LIDAR Recon', headingDeg: 60, posXM: 1900, posYM: 900, orbitRadiusM: 2102, orbitAngleDeg: 25, orbitSpeedDegPerSec: 1.6, sensorFovDeg: 75, targetLockId: null, meshSignalSnrDb: 37.9 },
  { id: 'SWARM-11', callsign: 'Aegis Sentinel 11', status: 'AIRBORNE // PATROL', altitudeM: 205, airspeedKts: 61.0, batteryPct: 90.4, runtimeMin: 47, payload: 'EO/IR Optical', headingDeg: 135, posXM: 1600, posYM: -1400, orbitRadiusM: 2126, orbitAngleDeg: 319, orbitSpeedDegPerSec: 1.7, sensorFovDeg: 70, targetLockId: null, meshSignalSnrDb: 38.0 },
  { id: 'SWARM-12', callsign: 'Aegis Sentinel 12', status: 'AIRBORNE // PATROL', altitudeM: 215, airspeedKts: 59.5, batteryPct: 86.8, runtimeMin: 42, payload: 'RF Jammer', headingDeg: 190, posXM: 300, posYM: -2100, orbitRadiusM: 2121, orbitAngleDeg: 278, orbitSpeedDegPerSec: 1.5, sensorFovDeg: 75, targetLockId: null, meshSignalSnrDb: 37.4 },
  { id: 'SWARM-13', callsign: 'Aegis Sentinel 13', status: 'AIRBORNE // PATROL', altitudeM: 220, airspeedKts: 62.0, batteryPct: 84.5, runtimeMin: 39, payload: 'EO/IR Optical', headingDeg: 235, posXM: -1400, posYM: -1600, orbitRadiusM: 2126, orbitAngleDeg: 229, orbitSpeedDegPerSec: 1.6, sensorFovDeg: 70, targetLockId: null, meshSignalSnrDb: 36.9 },
  { id: 'SWARM-14', callsign: 'Aegis Sentinel 14', status: 'AIRBORNE // PATROL', altitudeM: 195, airspeedKts: 58.5, batteryPct: 91.6, runtimeMin: 49, payload: 'Kinetic Net', headingDeg: 280, posXM: -2000, posYM: 400, orbitRadiusM: 2040, orbitAngleDeg: 169, orbitSpeedDegPerSec: 1.7, sensorFovDeg: 80, targetLockId: null, meshSignalSnrDb: 37.5 },
  { id: 'SWARM-15', callsign: 'Aegis Sentinel 15', status: 'AIRBORNE // PATROL', altitudeM: 225, airspeedKts: 63.2, batteryPct: 89.0, runtimeMin: 45, payload: 'EO/IR Optical', headingDeg: 320, posXM: -1100, posYM: 1800, orbitRadiusM: 2109, orbitAngleDeg: 121, orbitSpeedDegPerSec: 1.6, sensorFovDeg: 70, targetLockId: null, meshSignalSnrDb: 38.1 },
  { id: 'SWARM-16', callsign: 'Aegis Sentinel 16', status: 'AIRBORNE // PATROL', altitudeM: 240, airspeedKts: 67.0, batteryPct: 81.0, runtimeMin: 36, payload: 'LIDAR Recon', headingDeg: 355, posXM: 200, posYM: 2200, orbitRadiusM: 2209, orbitAngleDeg: 85, orbitSpeedDegPerSec: 1.5, sensorFovDeg: 85, targetLockId: null, meshSignalSnrDb: 36.5 }
];

const INITIAL_BOGEYS: RadarBogey[] = [
  {
    id: 'BOGEY-ALPHA',
    code: 'BOGEY-ALPHA',
    transponder: 'UNKNOWN // UNREGISTERED',
    threatTier: 'CRITICAL',
    classification: 'Fixed-Wing Fast Recon Incursion',
    speedKts: 148,
    headingDeg: 142,
    rangeM: 6420,
    altitudeM: 320,
    timeToBreachSec: 148,
    posXM: 4600,
    posYM: 4500,
    status: 'INBOUND',
    assignedDroneId: 'SWARM-03'
  },
  {
    id: 'BOGEY-BRAVO',
    code: 'BOGEY-BRAVO',
    transponder: 'SPOOFED_HEX // 0x88F4A',
    threatTier: 'HOSTILE',
    classification: 'Rotary Loitering Munition Carrier',
    speedKts: 192,
    headingDeg: 310,
    rangeM: 4180,
    altitudeM: 480,
    timeToBreachSec: 86,
    posXM: -3100,
    posYM: -2800,
    status: 'INTERCEPTING',
    assignedDroneId: 'SWARM-07'
  }
];

const INITIAL_SPECTRUM: RfSpectrumBand[] = [
  { id: 'rf-1', name: '2.4 GHz ISM Command Mesh', centerFreqMhz: 2440.0, noiseFloorDbm: -96.2, peakSignalDbm: -44.0, jammingDetected: false, jammingType: 'NONE', countermeasureActive: false },
  { id: 'rf-2', name: '5.8 GHz High-Band Video Link', centerFreqMhz: 5800.0, noiseFloorDbm: -92.5, peakSignalDbm: -28.4, jammingDetected: true, jammingType: 'CHIRP SWEEP', countermeasureActive: true },
  { id: 'rf-3', name: 'GNSS L1 Frequency (1575.42 MHz)', centerFreqMhz: 1575.42, noiseFloorDbm: -98.0, peakSignalDbm: -38.2, jammingDetected: true, jammingType: 'CARRIER SPOOF', countermeasureActive: true },
  { id: 'rf-4', name: 'GNSS L2 Frequency (1227.60 MHz)', centerFreqMhz: 1227.6, noiseFloorDbm: -97.4, peakSignalDbm: -62.0, jammingDetected: false, jammingType: 'NONE', countermeasureActive: false },
  { id: 'rf-5', name: 'UHF Tactical Mesh (433.92 MHz)', centerFreqMhz: 433.92, noiseFloorDbm: -101.0, peakSignalDbm: -51.2, jammingDetected: false, jammingType: 'NONE', countermeasureActive: false }
];

const INITIAL_ENGAGEMENTS: InterceptLedgerEntry[] = [
  { id: 'ENG-8821', timestamp: '21:38:04 UTC', nodeCallsign: 'SWARM-03', contactCode: 'BOGEY-ALPHA', countermeasureType: 'KINETIC_NET', authorizedBy: 'WATCH_OFFICER // DEF-06', status: 'IN_FLIGHT', rangeM: 6420, outcome: 'Closing vector, est. intercept 94s' },
  { id: 'ENG-8820', timestamp: '21:37:12 UTC', nodeCallsign: 'SWARM-07', contactCode: 'BOGEY-BRAVO', countermeasureType: 'RF_DOWNLINK_DISRUPT', authorizedBy: 'AEGIS_AUTO_ENGAGE_MESH', status: 'IN_FLIGHT', rangeM: 4180, outcome: 'Downlink sweep active, carrier degraded' },
  { id: 'ENG-8819', timestamp: '20:54:19 UTC', nodeCallsign: 'SWARM-02', contactCode: 'INCURSION-09', countermeasureType: 'HPM_DIRECTED_ENERGY', authorizedBy: 'COL_V_MARKOVA // AUTH-99', status: 'COMPLETED', rangeM: 2850, outcome: 'Avionics disrupted, safe soft-descent' },
  { id: 'ENG-8818', timestamp: '19:12:44 UTC', nodeCallsign: 'SWARM-08', contactCode: 'INCURSION-08', countermeasureType: 'KINETIC_NET', authorizedBy: 'AEGIS_AUTO_ENGAGE_MESH', status: 'COMPLETED', rangeM: 1420, outcome: 'Net deployed, recovered intact' },
  { id: 'ENG-8817', timestamp: '18:02:11 UTC', nodeCallsign: 'SWARM-04', contactCode: 'TARGET-07', countermeasureType: 'AERO_SHADOW', authorizedBy: 'WATCH_OFFICER // DEF-06', status: 'COMPLETED', rangeM: 4900, outcome: 'Escorted past 10km exclusion perimeter' }
];

// =============================================================================
// MAIN OPERATIONAL APPLICATION
// =============================================================================

export default function App() {
  // State Management
  const [drones, setDrones] = useState<SwarmDrone[]>(INITIAL_DRONES);
  const [bogeys, setBogeys] = useState<RadarBogey[]>(INITIAL_BOGEYS);
  const [spectrum, setSpectrum] = useState<RfSpectrumBand[]>(INITIAL_SPECTRUM);
  const [engagements, setEngagements] = useState<InterceptLedgerEntry[]>(INITIAL_ENGAGEMENTS);
  
  // HUD & Command Controls
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('DEFCON 3 / ELEVATED');
  const [masterArmSafetyLatch, setMasterArmSafetyLatch] = useState<boolean>(false);
  const [masterArmActive, setMasterArmActive] = useState<boolean>(false);
  const [showArmModal, setShowArmModal] = useState<boolean>(false);
  
  // Tactical Radar State
  const [radarZoom, setRadarZoom] = useState<number>(1);
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);
  const [radarLayers, setRadarLayers] = useState({
    zones: true,
    sensorCones: true,
    vectors: true,
    trajectories: true,
    lidarCloud: true
  });
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>('SWARM-03');
  const [selectedBogeyId, setSelectedBogeyId] = useState<string | null>('BOGEY-ALPHA');
  const [radarHoverCoord, setRadarHoverCoord] = useState<{ x: number; y: number; rangeKm: number; bearingDeg: number } | null>(null);

  // EW & Directed Energy State
  const [hpmPowerKw] = useState<number>(120);
  const [capacitorBankPct, setCapacitorBankPct] = useState<number>(94.5);
  const [gimbalAzimuth, setGimbalAzimuth] = useState<number>(284.5);
  const [gimbalElevation, setGimbalElevation] = useState<number>(32.8);
  const [isHpmFiring, setIsHpmFiring] = useState<boolean>(false);
  const [selectedSpectrumTab, setSelectedSpectrumTab] = useState<string>('ALL');

  // Bottom Deck View Tabs & Sector Filter
  const [activeBottomTab, setActiveBottomTab] = useState<'FLEET' | 'LEDGER' | 'ROE_POLICY'>('FLEET');
  const [rosterSectorFilter, setRosterSectorFilter] = useState<'ALL' | 'OUTER' | 'INNER'>('ALL');
  
  // Audio & Notification Banner
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(
    'PERIMETER ADVISORY: 2 UNIDENTIFIED AIRBORNE CONTACTS DESIGNATED IN OUTER RADAR BUFFER'
  );

  // UTC Military Clock
  const [utcTime, setUtcTime] = useState<string>('');

  // ---------------------------------------------------------------------------
  // TICKS & REAL-TIME OPERATIONAL SIMULATION LOOPS
  // ---------------------------------------------------------------------------

  // UTC Clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19);
      setUtcTime(iso);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Radar sweep angle tick
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setRadarSweepAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(sweepInterval);
  }, []);

  // Capacitor Bank trickle recharge loop
  useEffect(() => {
    const chargeInterval = setInterval(() => {
      setCapacitorBankPct((prev) => {
        if (prev < 100) {
          return Math.min(100, Number((prev + 0.35).toFixed(1)));
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(chargeInterval);
  }, []);

  // Realistic Swarm Patrol Waypoints & Bogey countdown loop
  useEffect(() => {
    const tickInterval = setInterval(() => {
      // 1. Update Drones
      setDrones((prevDrones) =>
        prevDrones.map((drone) => {
          if (drone.status === 'RTB // CHARGING') {
            const currentDist = Math.hypot(drone.posXM, drone.posYM);
            if (currentDist > 200) {
              const angle = Math.atan2(drone.posYM, drone.posXM);
              const step = 80;
              const newX = drone.posXM - Math.cos(angle) * step;
              const newY = drone.posYM - Math.sin(angle) * step;
              return {
                ...drone,
                posXM: Math.round(newX),
                posYM: Math.round(newY),
                headingDeg: Math.round(((angle * 180) / Math.PI + 180) % 360),
                airspeedKts: 55,
                altitudeM: Math.max(20, drone.altitudeM - 4)
              };
            }
            return {
              ...drone,
              airspeedKts: 0,
              altitudeM: 5,
              batteryPct: Math.min(100, Number((drone.batteryPct + 0.1).toFixed(1)))
            };
          }

          if (drone.status === 'INTERCEPT VECTOR' && drone.targetLockId) {
            const target = INITIAL_BOGEYS.find((b) => b.id === drone.targetLockId);
            if (target) {
              const dx = target.posXM - drone.posXM;
              const dy = target.posYM - drone.posYM;
              const targetAngle = Math.atan2(dy, dx);
              const step = 110;
              const newX = drone.posXM + Math.cos(targetAngle) * step;
              const newY = drone.posYM + Math.sin(targetAngle) * step;
              const heading = Math.round(((targetAngle * 180) / Math.PI + 360) % 360);
              return {
                ...drone,
                posXM: Math.round(newX),
                posYM: Math.round(newY),
                headingDeg: heading,
                airspeedKts: 96,
                batteryPct: Math.max(10, Number((drone.batteryPct - 0.04).toFixed(1)))
              };
            }
          }

          // Default autonomous orbit patrol
          const newAngleDeg = (drone.orbitAngleDeg + drone.orbitSpeedDegPerSec * 0.4) % 360;
          const rad = (newAngleDeg * Math.PI) / 180;
          const newX = Math.round(Math.cos(rad) * drone.orbitRadiusM);
          const newY = Math.round(Math.sin(rad) * drone.orbitRadiusM);
          const heading = Math.round((newAngleDeg + 90) % 360);

          return {
            ...drone,
            orbitAngleDeg: Number(newAngleDeg.toFixed(2)),
            posXM: newX,
            posYM: newY,
            headingDeg: heading,
            batteryPct: Math.max(15, Number((drone.batteryPct - 0.01).toFixed(1)))
          };
        })
      );

      // 2. Update Bogeys
      setBogeys((prevBogeys) =>
        prevBogeys.map((bogey) => {
          if (bogey.status === 'NEUTRALIZED' || bogey.status === 'CONTAINED') {
            return bogey;
          }

          const angleToHub = Math.atan2(-bogey.posYM, -bogey.posXM);
          const speedFactor = bogey.speedKts * 0.4;
          const newX = bogey.posXM + Math.cos(angleToHub) * speedFactor;
          const newY = bogey.posYM + Math.sin(angleToHub) * speedFactor;
          const newRange = Math.round(Math.hypot(newX, newY));
          const newCountdown = Math.max(0, bogey.timeToBreachSec - 1);

          return {
            ...bogey,
            posXM: Math.round(newX),
            posYM: Math.round(newY),
            rangeM: newRange,
            timeToBreachSec: newCountdown
          };
        })
      );

      // 3. RF Spectrum noise floor jitter
      setSpectrum((prev) =>
        prev.map((band) => ({
          ...band,
          noiseFloorDbm: Number((-96 + (Math.random() * 2.4 - 1.2)).toFixed(1)),
          peakSignalDbm: band.jammingDetected
            ? Number((-28 + (Math.random() * 4 - 2)).toFixed(1))
            : Number((-44 + (Math.random() * 2 - 1)).toFixed(1))
        }))
      );
    }, 400);

    return () => clearInterval(tickInterval);
  }, []);

  // ---------------------------------------------------------------------------
  // DERIVED METRICS
  // ---------------------------------------------------------------------------
  const airborneDronesCount = useMemo(() => {
    return drones.filter((d) => d.status !== 'RTB // CHARGING' && d.altitudeM > 10).length;
  }, [drones]);

  const averageMeshBattery = useMemo(() => {
    const total = drones.reduce((sum, d) => sum + d.batteryPct, 0);
    return (total / drones.length).toFixed(1);
  }, [drones]);

  const activeEncroachmentsCount = useMemo(() => {
    return bogeys.filter((b) => b.rangeM <= 5000 && b.status !== 'NEUTRALIZED').length;
  }, [bogeys]);

  const selectedDrone = useMemo(() => {
    return drones.find((d) => d.id === selectedDroneId) || null;
  }, [drones, selectedDroneId]);

  const selectedBogey = useMemo(() => {
    return bogeys.find((b) => b.id === selectedBogeyId) || null;
  }, [bogeys, selectedBogeyId]);

  const filteredDrones = useMemo(() => {
    if (rosterSectorFilter === 'OUTER') return drones.slice(0, 8);
    if (rosterSectorFilter === 'INNER') return drones.slice(8, 16);
    return drones;
  }, [drones, rosterSectorFilter]);

  // ---------------------------------------------------------------------------
  // INTERACTIVE HANDLERS
  // ---------------------------------------------------------------------------

  const handleToggleSafetyLatch = () => {
    if (masterArmActive) {
      setMasterArmActive(false);
      setMasterArmSafetyLatch(false);
      setNotificationBanner('PERIMETER DEFENSE NOTICE: MASTER ARM DE-AUTHORIZED // KINETIC STANDDOWN');
    } else {
      setMasterArmSafetyLatch((prev) => !prev);
    }
  };

  const handleArmSwitchClick = () => {
    if (!masterArmSafetyLatch) {
      setNotificationBanner('SAFETY INTERLOCK ENGAGED: LIFT PROTECTIVE SAFETY COVER BEFORE ARMING');
      return;
    }
    if (masterArmActive) {
      setMasterArmActive(false);
      setNotificationBanner('PERIMETER DEFENSE NOTICE: MASTER ARM DE-AUTHORIZED // KINETIC STANDDOWN');
    } else {
      setShowArmModal(true);
    }
  };

  const handleConfirmMasterArm = () => {
    setMasterArmActive(true);
    setShowArmModal(false);
    setThreatLevel('DEFCON 2 / SEVERE');
    setNotificationBanner('RED ALERT // MASTER ARM AUTHORIZED: ALL 16 SECTOR INTERCEPTORS CLEARED FOR KINETIC NET DEPLOYMENT');
  };

  const handleScrambleDrone = (droneId: string) => {
    const target = bogeys.find((b) => b.status === 'INBOUND' || b.status === 'INTERCEPTING') || bogeys[0];
    setDrones((prev) =>
      prev.map((d) => {
        if (d.id === droneId) {
          return {
            ...d,
            status: 'INTERCEPT VECTOR',
            targetLockId: target ? target.id : 'BOGEY-ALPHA',
            airspeedKts: 96,
            payload: 'Kinetic Net'
          };
        }
        return d;
      })
    );

    if (target) {
      setBogeys((prev) =>
        prev.map((b) => (b.id === target.id ? { ...b, assignedDroneId: droneId, status: 'INTERCEPTING' } : b))
      );

      const newEntry: InterceptLedgerEntry = {
        id: `ENG-${Math.floor(8822 + Math.random() * 500)}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        nodeCallsign: droneId,
        contactCode: target.code,
        countermeasureType: masterArmActive ? 'KINETIC_NET' : 'AERO_SHADOW',
        authorizedBy: masterArmActive ? 'COMMANDER_KEY_VERIFIED' : 'AUTONOMOUS_INTERCEPT_POLICY',
        status: 'IN_FLIGHT',
        rangeM: target.rangeM,
        outcome: 'Vector intercept course plotted. Closing.'
      };
      setEngagements((prev) => [newEntry, ...prev]);
    }

    setNotificationBanner(`TACTICAL DISPATCH: ${droneId} SCRAMBLED ON DIRECT INTERCEPT VECTOR`);
  };

  const handleScrambleAllPerimeter = () => {
    drones.slice(0, 4).forEach((d) => handleScrambleDrone(d.id));
    setNotificationBanner('ALL-UNITS SCRAMBLE: PERIMETER MESH EXPANDING TO ACTIVE INTERCEPT VECTORS');
  };

  const handleRtbDrone = (droneId: string) => {
    setDrones((prev) =>
      prev.map((d) => {
        if (d.id === droneId) {
          return {
            ...d,
            status: 'RTB // CHARGING',
            targetLockId: null
          };
        }
        return d;
      })
    );
    setNotificationBanner(`COMMAND TELEMETRY: ${droneId} ORDERED RTB TO CENTRAL CHARGING DOCK`);
  };

  const handleTogglePayload = (droneId: string) => {
    const modes: PayloadMode[] = ['EO/IR Optical', 'RF Jammer', 'Kinetic Net', 'LIDAR Recon'];
    setDrones((prev) =>
      prev.map((d) => {
        if (d.id === droneId) {
          const nextIndex = (modes.indexOf(d.payload) + 1) % modes.length;
          return { ...d, payload: modes[nextIndex] };
        }
        return d;
      })
    );
  };

  const handleFireHpmPulse = () => {
    if (capacitorBankPct < 30) {
      setNotificationBanner('DIRECTED ENERGY FAULT: CAPACITOR BANK INSUFFICIENT (<30%). RECHARGING.');
      return;
    }

    setIsHpmFiring(true);
    setCapacitorBankPct((prev) => Math.max(12, Number((prev - 55).toFixed(1))));

    if (selectedBogeyId) {
      setBogeys((prev) =>
        prev.map((b) => {
          if (b.id === selectedBogeyId) {
            return {
              ...b,
              status: 'CONTAINED',
              threatTier: 'MONITOR',
              classification: `${b.classification} (AVIONICS DISRUPTED)`
            };
          }
          return b;
        })
      );
    }

    const newLedger: InterceptLedgerEntry = {
      id: `ENG-${Math.floor(8900 + Math.random() * 99)}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      nodeCallsign: 'HPM-DIRECTED-01',
      contactCode: selectedBogeyId || 'BROADCAST_SECTOR',
      countermeasureType: 'HPM_DIRECTED_ENERGY',
      authorizedBy: masterArmActive ? 'COMMANDER_KEY_VERIFIED' : 'LOCAL_DIRECTED_OVERRIDE',
      status: 'COMPLETED',
      rangeM: selectedBogey ? selectedBogey.rangeM : 3400,
      outcome: '120kW Microwave pulse discharged. RF receiver burnout confirmed.'
    };
    setEngagements((prev) => [newLedger, ...prev]);

    setNotificationBanner('DIRECTED ENERGY FIRED: 120kW HPM PULSE EMITTED // RF BURNOUT WAVE PROPAGATED');

    setTimeout(() => {
      setIsHpmFiring(false);
    }, 1200);
  };

  const handleSlewGimbal = (deltaAz: number, deltaEl: number) => {
    setGimbalAzimuth((prev) => Number(((prev + deltaAz + 360) % 360).toFixed(1)));
    setGimbalElevation((prev) => Number(Math.max(-5, Math.min(85, prev + deltaEl)).toFixed(1)));
  };

  const handleAutoTrackBogey = (bogeyId: string) => {
    const bogey = bogeys.find((b) => b.id === bogeyId);
    if (bogey) {
      const angle = (Math.atan2(bogey.posYM, bogey.posXM) * 180) / Math.PI;
      const az = Number(((angle + 360) % 360).toFixed(1));
      setGimbalAzimuth(az);
      setGimbalElevation(34.2);
      setSelectedBogeyId(bogeyId);
      setNotificationBanner(`GIMBAL TRACKER: HPM SLAVED TO ${bogey.code} (AZ: ${az}°, EL: 34.2°)`);
    }
  };

  // ---------------------------------------------------------------------------
  // RADAR CANVAS PROJECTIONS
  // ---------------------------------------------------------------------------
  const SVG_CENTER = 300;
  const SVG_MAX_R = 270;
  const METERS_TO_PX = SVG_MAX_R / 10000;

  const toSvgX = useCallback((xm: number) => SVG_CENTER + xm * METERS_TO_PX, [METERS_TO_PX]);
  const toSvgY = useCallback((ym: number) => SVG_CENTER - ym * METERS_TO_PX, [METERS_TO_PX]);

  const handleRadarMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const scale = 600 / rect.width;
    const svgX = clientX * scale;
    const svgY = clientY * scale;

    const dx = svgX - SVG_CENTER;
    const dy = SVG_CENTER - svgY;
    const distPx = Math.hypot(dx, dy);
    const rangeKm = Number(((distPx / SVG_MAX_R) * 10).toFixed(2));
    const angleRad = Math.atan2(dx, dy);
    const bearingDeg = Math.round(((angleRad * 180) / Math.PI + 360) % 360);

    setRadarHoverCoord({
      x: Math.round(dx / METERS_TO_PX),
      y: Math.round(dy / METERS_TO_PX),
      rangeKm,
      bearingDeg
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#05080E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
        
        {/* =====================================================================
            PANE 1: TOP PERIMETER AIRSPACE & NODE HUD
        ===================================================================== */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-40 backdrop-blur-md px-4 py-2.5">
          <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            
            {/* Hub Callout & Mission Clock */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border border-cyan-500/30 bg-cyan-950/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100 uppercase">
                    STRAT-DEFENSE COMMAND // AEGIS-SWARM PERIMETER INTERCEPT MESH 06
                  </h1>
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-1">
                  <span className="whitespace-nowrap text-emerald-400 font-semibold">SECTOR SIERRA-9</span>
                  <span className="hidden sm:inline text-slate-600">·</span>
                  <span className="whitespace-nowrap">{utcTime || 'SYNCHRONIZING'} UTC</span>
                  <span className="hidden sm:inline text-slate-600">·</span>
                  <span className="whitespace-nowrap text-cyan-400">ENCRYPTION: AES-256-GCM</span>
                </div>
              </div>
            </div>

            {/* Tactical Telemetry Strip & Emergency Master Arm Keyed Safety Switch */}
            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
              
              {/* Telemetry 1: Active Swarm Drones */}
              <div className="bg-[#111827] border border-slate-800 rounded px-3.5 py-2 min-w-[150px]">
                <div className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">SWARM NODES</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0 self-center" />
                  <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                    {airborneDronesCount}/16
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-normal">Airborne</span>
                </div>
              </div>

              {/* Telemetry 2: RF Threat Level */}
              <div className="bg-[#111827] border border-slate-800 rounded px-3.5 py-2 min-w-[175px]">
                <div className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">RF EW THREAT</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <Activity className="w-4 h-4 text-amber-400 shrink-0 self-center" />
                  <span className={`text-3xl font-black font-mono tracking-tight tabular-nums ${
                    threatLevel.includes('DEFCON 1') || threatLevel.includes('DEFCON 2') ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {threatLevel.split('/')[0].trim()}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-normal">/ {threatLevel.split('/')[1]?.trim() || 'ELEVATED'}</span>
                </div>
              </div>

              {/* Telemetry 3: Perimeter Encroachments */}
              <div className="bg-[#111827] border border-slate-800 rounded px-3.5 py-2 min-w-[160px]">
                <div className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">ENCROACHMENT</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <AlertTriangle className={`w-4 h-4 shrink-0 self-center ${activeEncroachmentsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span className={`text-3xl font-black font-mono tabular-nums ${activeEncroachmentsCount > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                    {activeEncroachmentsCount > 0 ? `${activeEncroachmentsCount} Inbound` : '0 Contained'}
                  </span>
                </div>
              </div>

              {/* Telemetry 4: Mesh Battery Reserve */}
              <div className="bg-[#111827] border border-slate-800 rounded px-3.5 py-2 min-w-[145px]">
                <div className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono">BATTERY RESERVE</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <Battery className="w-4 h-4 text-cyan-400 shrink-0 self-center" />
                  <span className="text-3xl font-black font-mono tabular-nums text-slate-100">
                    {averageMeshBattery}%
                  </span>
                </div>
              </div>

              {/* Telemetry 5: Emergency Master Arm / Kinetic Intercept Authorize Switch */}
              <div className={`flex items-center gap-2 p-1.5 rounded border transition-colors ${
                masterArmActive 
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                  : 'bg-[#111827] border-slate-800'
              }`}>
                {/* Protective Safety Cover Latch Button */}
                <button
                  onClick={handleToggleSafetyLatch}
                  title={masterArmSafetyLatch ? 'Close protective safety cover' : 'Open spring-loaded safety cover'}
                  className={`px-2 py-1 text-[11px] font-mono rounded flex items-center gap-1 transition-colors ${
                    masterArmSafetyLatch 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {masterArmSafetyLatch ? <Unlock className="w-3 h-3 text-amber-400" /> : <Lock className="w-3 h-3" />}
                  <span>{masterArmSafetyLatch ? 'COVER OPEN' : 'SAFETY COVER'}</span>
                </button>

                {/* Keyed Master Arm Toggle */}
                <button
                  onClick={handleArmSwitchClick}
                  className={`px-3 py-1 text-xs font-semibold font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                    masterArmActive
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg animate-pulse'
                      : masterArmSafetyLatch
                      ? 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/80'
                      : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{masterArmActive ? 'MASTER ARM: ARMED' : 'MASTER ARM: SAFE'}</span>
                </button>
              </div>

              {/* Mute/Sound Toggle */}
              <button
                onClick={() => setAudioFeedback(!audioFeedback)}
                className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                title={audioFeedback ? 'Sound Feedback Active' : 'Sound Feedback Muted'}
              >
                {audioFeedback ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Real-time High Priority Operational Notification Banner */}
          {notificationBanner && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 rounded border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs font-mono font-medium">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 animate-pulse" />
                <span className="leading-snug whitespace-normal">{notificationBanner}</span>
              </div>
              <button
                onClick={() => setNotificationBanner(null)}
                className="text-slate-400 hover:text-slate-200 text-[10px] uppercase font-mono shrink-0 cursor-pointer self-end sm:self-auto px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 transition-colors"
              >
                DISMISS [ESC]
              </button>
            </div>
          )}
        </header>

        {/* =====================================================================
            MAIN OPERATIONAL DECK: SPLIT 2-COLUMNS
            Center-Left (Radar) & Center-Right (Electronic Warfare & HPM)
        ===================================================================== */}
        <main className="flex-1 max-w-[1920px] w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
          
          {/* -------------------------------------------------------------------
              PANE 2: CENTER-LEFT 2D TACTICAL AIRSPACE RADAR & LIDAR CANVAS
          ------------------------------------------------------------------- */}
          <section className="lg:col-span-7 flex flex-col bg-[#0B0F17] border border-slate-800 rounded-lg p-3 lg:p-4 relative overflow-hidden">
            
            {/* Header & Radar Display Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-slate-100 font-mono">
                  TACTICAL AIRSPACE VECTOR RADAR & LIDAR MESH
                </h2>
                <span className="text-slate-600 font-mono hidden sm:inline">|</span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">10 KM SCAN VOLUME</span>
              </div>

              {/* Layer Controls & Zoom */}
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => setRadarLayers((p) => ({ ...p, sensorCones: !p.sensorCones }))}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    radarLayers.sensorCones
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  SENSOR FOV
                </button>
                <button
                  onClick={() => setRadarLayers((p) => ({ ...p, trajectories: !p.trajectories }))}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    radarLayers.trajectories
                      ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  INTERCEPT VECTORS
                </button>
                <button
                  onClick={() => setRadarLayers((p) => ({ ...p, lidarCloud: !p.lidarCloud }))}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    radarLayers.lidarCloud
                      ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  LIDAR CLOUD
                </button>
                <div className="h-4 w-px bg-slate-800 mx-1" />
                <button
                  onClick={() => setRadarZoom((z) => (z === 1 ? 1.5 : z === 1.5 ? 2.2 : 1))}
                  className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-300 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>ZOOM {radarZoom}x</span>
                </button>
              </div>
            </div>

            {/* Radar Viewport Stage */}
            <div className="relative flex-1 min-h-[460px] lg:min-h-[520px] bg-[#070B12] rounded border border-slate-900 flex items-center justify-center overflow-hidden cursor-crosshair">
              
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

              {/* Live SVG Vector Radar */}
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full max-h-[560px] object-contain select-none"
                onMouseMove={handleRadarMouseMove}
                onMouseLeave={() => setRadarHoverCoord(null)}
              >
                <defs>
                  <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>

                  <radialGradient id="threatGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </radialGradient>

                  <radialGradient id="hpmWaveGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.5" />
                    <stop offset="90%" stopColor="#38BDF8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <g transform={`translate(${300 * (1 - radarZoom)}, ${300 * (1 - radarZoom)}) scale(${radarZoom})`}>
                  
                  {/* Concentric Geofence Exclusion Zones */}
                  {radarLayers.zones && (
                    <>
                      {/* 10 KM (Radius = 270px) */}
                      <circle
                        cx="300"
                        cy="300"
                        r={SVG_MAX_R}
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text x="305" y="42" fill="#64748B" fontSize="9" fontFamily="monospace">
                        10 KM OUTER SENSOR PERIMETER
                      </text>

                      {/* 5 KM (Radius = 135px) */}
                      <circle
                        cx="300"
                        cy="300"
                        r={SVG_MAX_R * 0.5}
                        fill="rgba(245, 158, 11, 0.02)"
                        stroke="#F59E0B"
                        strokeWidth="1.2"
                        strokeOpacity="0.4"
                      />
                      <text x="305" y="176" fill="#F59E0B" fontSize="9" fontFamily="monospace" opacity="0.8">
                        5 KM INTERCEPT BUFFER ZONE
                      </text>

                      {/* 1 KM (Radius = 27px) */}
                      <circle
                        cx="300"
                        cy="300"
                        r={SVG_MAX_R * 0.1}
                        fill="rgba(244, 63, 94, 0.06)"
                        stroke="#F43F5E"
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                      <text x="305" y="284" fill="#F43F5E" fontSize="8" fontFamily="monospace">
                        1 KM CRITICAL EXCLUSION
                      </text>
                    </>
                  )}

                  {/* Radial Crosshairs and Azimuth Ticks */}
                  <line x1="300" y1="20" x2="300" y2="580" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="20" y1="300" x2="580" y2="300" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="102" y1="102" x2="498" y2="498" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 4" />
                  <line x1="102" y1="498" x2="498" y2="102" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 4" />

                  {/* Compass Cardinal Points */}
                  <text x="296" y="22" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">000° N</text>
                  <text x="560" y="304" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">090° E</text>
                  <text x="296" y="594" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">180° S</text>
                  <text x="05" y="304" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="bold">270° W</text>

                  {/* Lidar Point Cloud Simulation */}
                  {radarLayers.lidarCloud && (
                    <g opacity="0.35">
                      {Array.from({ length: 42 }).map((_, i) => {
                        const angle = (i * 8.5 * Math.PI) / 180;
                        const dist = 60 + ((i * 37) % 210);
                        const px = 300 + Math.cos(angle) * dist;
                        const py = 300 + Math.sin(angle) * dist;
                        return (
                          <circle
                            key={`lidar-${i}`}
                            cx={px}
                            cy={py}
                            r="1"
                            fill="#06B6D4"
                            opacity={0.4 + (i % 5) * 0.12}
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Radar Sweeping Beam */}
                  <g transform={`rotate(${radarSweepAngle} 300 300)`}>
                    <line x1="300" y1="300" x2="300" y2="30" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.8" />
                    <path
                      d="M 300 300 L 300 30 A 270 270 0 0 1 390 48 Z"
                      fill="url(#sweepGradient)"
                    />
                  </g>

                  {/* HPM Directed Energy Firing Visual Wave */}
                  {isHpmFiring && (
                    <g>
                      <circle cx="300" cy="300" r="180" fill="url(#hpmWaveGlow)" className="animate-ping" />
                      <line
                        x1="300"
                        y1="300"
                        x2={toSvgX(selectedBogey ? selectedBogey.posXM : -3100)}
                        y2={toSvgY(selectedBogey ? selectedBogey.posYM : -2800)}
                        stroke="#38BDF8"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                      />
                    </g>
                  )}

                  {/* Intercept Trajectory Solutions */}
                  {radarLayers.trajectories && (
                    <g>
                      {bogeys.map((bogey) => {
                        const interceptor = drones.find((d) => d.id === bogey.assignedDroneId);
                        if (!interceptor || bogey.status === 'NEUTRALIZED') return null;

                        return (
                          <g key={`trajectory-${bogey.id}`}>
                            <line
                              x1={toSvgX(interceptor.posXM)}
                              y1={toSvgY(interceptor.posYM)}
                              x2={toSvgX(bogey.posXM)}
                              y2={toSvgY(bogey.posYM)}
                              stroke="#F59E0B"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              strokeOpacity="0.7"
                            />
                            <circle
                              cx={(toSvgX(interceptor.posXM) + toSvgX(bogey.posXM)) / 2}
                              cy={(toSvgY(interceptor.posYM) + toSvgY(bogey.posYM)) / 2}
                              r="3"
                              fill="#F59E0B"
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Base Station Hub */}
                  <g>
                    <circle cx="300" cy="300" r="6" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
                    <circle cx="300" cy="300" r="14" fill="none" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.4" />
                    <text x="308" y="318" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      HUB-06
                    </text>
                  </g>

                  {/* SWARM NODES (SWARM-01 through SWARM-16) */}
                  {drones.map((drone) => {
                    const cx = toSvgX(drone.posXM);
                    const cy = toSvgY(drone.posYM);
                    const isSelected = drone.id === selectedDroneId;
                    const isIntercepting = drone.status === 'INTERCEPT VECTOR';

                    const fovAngleRad = (drone.sensorFovDeg * Math.PI) / 180;
                    const headingRad = (drone.headingDeg * Math.PI) / 180;
                    const coneLen = 38;
                    const leftAngle = headingRad - fovAngleRad / 2;
                    const rightAngle = headingRad + fovAngleRad / 2;
                    const coneX1 = cx + Math.sin(leftAngle) * coneLen;
                    const coneY1 = cy - Math.cos(leftAngle) * coneLen;
                    const coneX2 = cx + Math.sin(rightAngle) * coneLen;
                    const coneY2 = cy - Math.cos(rightAngle) * coneLen;

                    return (
                      <g
                        key={drone.id}
                        onClick={() => setSelectedDroneId(drone.id)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        {radarLayers.sensorCones && drone.status !== 'RTB // CHARGING' && (
                          <path
                            d={`M ${cx} ${cy} L ${coneX1} ${coneY1} A ${coneLen} ${coneLen} 0 0 1 ${coneX2} ${coneY2} Z`}
                            fill={isIntercepting ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)'}
                            stroke={isIntercepting ? '#F59E0B' : '#10B981'}
                            strokeWidth="0.8"
                            strokeOpacity="0.5"
                          />
                        )}

                        {isSelected && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="11"
                            fill="none"
                            stroke="#38BDF8"
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            className="animate-spin"
                          />
                        )}

                        {radarLayers.vectors && (
                          <line
                            x1={cx}
                            y1={cy}
                            x2={cx + Math.sin(headingRad) * 16}
                            y2={cy - Math.cos(headingRad) * 16}
                            stroke={isIntercepting ? '#F59E0B' : '#10B981'}
                            strokeWidth="1.5"
                          />
                        )}

                        <circle
                          cx={cx}
                          cy={cy}
                          r={isIntercepting ? 5 : 4}
                          fill={isIntercepting ? '#F59E0B' : '#10B981'}
                          stroke="#05080E"
                          strokeWidth="1.5"
                        />

                        <text
                          x={cx + 8}
                          y={cy - 5}
                          fill={isSelected ? '#38BDF8' : '#94A3B8'}
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {drone.id}
                        </text>
                      </g>
                    );
                  })}

                  {/* UNIDENTIFIED RADAR BOGEYS */}
                  {bogeys.map((bogey) => {
                    const bx = toSvgX(bogey.posXM);
                    const by = toSvgY(bogey.posYM);
                    const isSelected = bogey.id === selectedBogeyId;
                    const isCritical = bogey.threatTier === 'CRITICAL' || bogey.threatTier === 'HOSTILE';

                    return (
                      <g
                        key={bogey.id}
                        onClick={() => setSelectedBogeyId(bogey.id)}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        <circle
                          cx={bx}
                          cy={by}
                          r={isSelected ? 18 : 14}
                          fill="url(#threatGlow)"
                          className={isCritical ? 'animate-ping' : ''}
                        />

                        <polygon
                          points={`${bx},${by - 8} ${bx + 8},${by} ${bx},${by + 8} ${bx - 8},${by}`}
                          fill={bogey.status === 'CONTAINED' ? '#38BDF8' : '#F43F5E'}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                        />

                        <g transform={`translate(${bx + 12}, ${by - 10})`}>
                          <rect
                            x="0"
                            y="0"
                            width="90"
                            height="24"
                            fill="#0F172A"
                            stroke={isCritical ? '#F43F5E' : '#F59E0B'}
                            strokeWidth="1"
                            rx="2"
                            opacity="0.9"
                          />
                          <text x="4" y="10" fill="#F87171" fontSize="8" fontFamily="monospace" fontWeight="bold">
                            {bogey.code}
                          </text>
                          <text x="4" y="20" fill="#CBD5E1" fontSize="7" fontFamily="monospace">
                            {(bogey.rangeM / 1000).toFixed(1)}km | T-{bogey.timeToBreachSec}s
                          </text>
                        </g>

                        <line
                          x1={bx}
                          y1={by}
                          x2={bx + Math.cos((bogey.headingDeg * Math.PI) / 180) * 35}
                          y2={by + Math.sin((bogey.headingDeg * Math.PI) / 180) * 35}
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      </g>
                    );
                  })}

                </g>
              </svg>

              {/* Radar Corner Overlay HUD */}
              <div className="absolute top-2 left-2 pointer-events-none font-mono text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800 backdrop-blur-sm">
                <div className="text-emerald-400 font-semibold mb-0.5">MESH SECTOR SIERRA-9</div>
                <div>GEOFENCE 1KM / 5KM / 10KM</div>
                <div>SCANNER: 360° CONTINUOUS</div>
                <div className="text-slate-500">DOPPLER PRF: 12.4 kHz</div>
              </div>

              {/* Cursor Coordinate Tracker HUD */}
              {radarHoverCoord && (
                <div className="absolute bottom-2 left-2 pointer-events-none font-mono text-[11px] text-cyan-300 bg-slate-950/90 px-2.5 py-1.5 rounded border border-cyan-500/40 backdrop-blur-sm">
                  <span>RNG: {radarHoverCoord.rangeKm} km</span>
                  <span className="mx-1.5 text-slate-600">|</span>
                  <span>BRG: {radarHoverCoord.bearingDeg}°</span>
                  <span className="mx-1.5 text-slate-600">|</span>
                  <span>MGRS: 32U NV {Math.abs(radarHoverCoord.x)} {Math.abs(radarHoverCoord.y)}</span>
                </div>
              )}

              {/* Quick Scramble Perimeter CTA */}
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <button
                  onClick={handleScrambleAllPerimeter}
                  className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/60 text-amber-200 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  SCRAMBLE SECTOR
                </button>
              </div>

            </div>

            {/* Selected Target / Drone Operational Context Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              
              {/* Selected Drone Mini HUD */}
              <div className="bg-[#111827] border border-slate-800 rounded p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">SELECTED PATROL NODE</div>
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedDrone ? `${selectedDrone.id} (${selectedDrone.callsign})` : 'NO DRONE SELECTED'}</span>
                  </div>
                  {selectedDrone && (
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>{selectedDrone.altitudeM}m AGL</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedDrone.airspeedKts} kts</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-300">{selectedDrone.payload}</span>
                    </div>
                  )}
                </div>
                {selectedDrone && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleScrambleDrone(selectedDrone.id)}
                      className="px-2 py-1 rounded bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-[10px] cursor-pointer"
                    >
                      SCRAMBLE
                    </button>
                    <button
                      onClick={() => handleRtbDrone(selectedDrone.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] cursor-pointer"
                    >
                      RTB
                    </button>
                  </div>
                )}
              </div>

              {/* Selected Bogey Threat Countdown HUD */}
              <div className="bg-[#111827] border border-slate-800 rounded p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">DESIGNATED THREAT CONTACT</div>
                  <div className="text-sm font-semibold text-rose-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    <span>{selectedBogey ? `${selectedBogey.code} [${selectedBogey.threatTier}]` : 'NO THREAT TARGETED'}</span>
                  </div>
                  {selectedBogey && (
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span className="text-slate-200">Range: {(selectedBogey.rangeM / 1000).toFixed(2)} km</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-400 font-semibold">T-BREACH: {selectedBogey.timeToBreachSec}s</span>
                    </div>
                  )}
                </div>
                {selectedBogey && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAutoTrackBogey(selectedBogey.id)}
                      className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] cursor-pointer"
                    >
                      LOCK HPM
                    </button>
                  </div>
                )}
              </div>

            </div>

          </section>

          {/* -------------------------------------------------------------------
              PANE 3: CENTER-RIGHT ELECTRONIC WARFARE (EW) & DIRECTED ENERGY
          ------------------------------------------------------------------- */}
          <section className="lg:col-span-5 flex flex-col gap-3 lg:gap-4">
            
            {/* Top Subsection: Real-Time RF Spectrum Waterfall */}
            <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3 lg:p-4 flex flex-col">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
                  <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-slate-100 font-mono">
                    ELECTRONIC WARFARE (EW) SPECTRUM WATERFALL
                  </h2>
                </div>
                <span className="text-xs font-mono text-cyan-400 tabular-nums hidden sm:inline">2.4 / 5.8 GHz & GNSS</span>
              </div>

              {/* Band Tabs */}
              <div className="flex items-center gap-1 mb-2 font-mono text-[10px]">
                {['ALL', '2.4 GHz', '5.8 GHz', 'GNSS L1/L2'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedSpectrumTab(tab)}
                    className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                      selectedSpectrumTab === tab
                        ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Spectrum Waterfall Visualizer */}
              <div className="bg-[#070B12] rounded border border-slate-900 p-2 font-mono flex flex-col gap-2">
                
                {/* SVG RF Waveform Trace */}
                <div className="relative h-28 w-full bg-[#05080E] rounded border border-slate-900/80 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
                  
                  <div className="absolute left-1 top-1 text-[8px] text-slate-500">-20 dBm</div>
                  <div className="absolute left-1 top-10 text-[8px] text-slate-500">-60 dBm</div>
                  <div className="absolute left-1 bottom-1 text-[8px] text-slate-500">-100 dBm</div>

                  <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
                    <path
                      d="M 0 85 Q 30 83, 60 86 T 120 84 T 180 85 T 240 83 T 300 86 T 360 84 L 400 85"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <path
                      d="M 50 85 Q 75 80, 85 45 T 95 85"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 170 85 Q 190 70, 205 18 T 225 85"
                      fill="rgba(244,63,94,0.15)"
                      stroke="#F43F5E"
                      strokeWidth="2"
                    />
                    <path
                      d="M 280 85 Q 295 65, 305 28 T 320 85"
                      fill="rgba(245,158,11,0.12)"
                      stroke="#F59E0B"
                      strokeWidth="1.8"
                    />
                  </svg>

                  <div className="absolute top-1 right-2 text-[9px] text-rose-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>5.8 GHz JAMMING SPIKE (+22 dBm)</span>
                  </div>
                </div>

                {/* RF Spectrum Waterfall Rows */}
                <div className="space-y-0.5 pt-1">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>BAND FREQUENCY</span>
                    <span>NOISE FLOOR</span>
                    <span>PEAK SIG</span>
                    <span>EW STATUS</span>
                  </div>

                  {spectrum.map((band) => (
                    <div
                      key={band.id}
                      className="text-[11px] py-1 px-1.5 rounded flex items-center justify-between bg-slate-900/60 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${band.jammingDetected ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
                        <span className="font-medium text-slate-200">{band.name}</span>
                      </div>
                      <div className="text-slate-400 tabular-nums">{band.noiseFloorDbm} dBm</div>
                      <div className={`tabular-nums font-semibold ${band.jammingDetected ? 'text-rose-400' : 'text-slate-300'}`}>
                        {band.peakSignalDbm} dBm
                      </div>
                      <div className={`text-[10px] font-semibold ${band.jammingDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {band.jammingDetected ? `JAM: ${band.jammingType}` : 'NOMINAL'}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Bottom Subsection: High-Power Microwave (HPM) Diagnostics */}
            <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3 lg:p-4 flex flex-col">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                  <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-slate-100 font-mono">
                    DIRECTED ENERGY (HPM) EMITTER DIAGNOSTICS
                  </h2>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  capacitorBankPct >= 50
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30'
                    : 'border-amber-500/40 text-amber-300 bg-amber-950/30'
                }`}>
                  {capacitorBankPct >= 50 ? 'SYSTEM READY' : 'CHARGING BANK'}
                </span>
              </div>

              {/* Readouts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono mb-3">
                <div className="bg-[#111827] border border-slate-800 rounded p-2">
                  <div className="text-[10px] text-slate-400 uppercase">EMITTER POWER</div>
                  <div className="text-lg font-semibold text-slate-100 tabular-nums mt-0.5">
                    {hpmPowerKw} <span className="text-xs text-cyan-400 font-normal">kW</span>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded p-2">
                  <div className="text-[10px] text-slate-400 uppercase">CAPACITOR BANK</div>
                  <div className="text-lg font-semibold tabular-nums mt-0.5 flex items-center justify-between">
                    <span className={capacitorBankPct < 40 ? 'text-amber-400' : 'text-cyan-300'}>
                      {capacitorBankPct}%
                    </span>
                    <div className="w-12 h-2 rounded bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${capacitorBankPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded p-2 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase">GIMBAL POINTING</div>
                  <div className="text-xs font-semibold text-slate-100 tabular-nums mt-1">
                    AZ: <span className="text-cyan-300">{gimbalAzimuth}°</span> | EL: <span className="text-cyan-300">{gimbalElevation}°</span>
                  </div>
                </div>
              </div>

              {/* Gimbal Slew Controls */}
              <div className="bg-[#070B12] rounded border border-slate-900 p-2.5 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>GIMBAL SERVO SLEW</span>
                  <button
                    onClick={() => selectedBogey && handleAutoTrackBogey(selectedBogey.id)}
                    className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    SLAVE TO ACTIVE BOGEY
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSlewGimbal(-5, 0)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    ◄ AZ -5°
                  </button>
                  <button
                    onClick={() => handleSlewGimbal(0, 5)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    ▲ EL +5°
                  </button>
                  <button
                    onClick={() => handleSlewGimbal(0, -5)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    ▼ EL -5°
                  </button>
                  <button
                    onClick={() => handleSlewGimbal(5, 0)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    AZ +5° ►
                  </button>
                </div>
              </div>

              {/* HPM Trigger Button */}
              <div className="mt-3">
                <button
                  onClick={handleFireHpmPulse}
                  disabled={isHpmFiring || capacitorBankPct < 30}
                  className={`w-full py-2 px-4 rounded font-mono font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isHpmFiring
                      ? 'bg-cyan-500 text-slate-950 animate-pulse'
                      : capacitorBankPct >= 30
                      ? 'bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isHpmFiring
                      ? 'DISCHARGING 120kW BURST...'
                      : capacitorBankPct >= 30
                      ? 'EMIT DIRECTED HPM COUNTERMEASURE PULSE'
                      : 'CAPACITOR RECHARGING (<30%)'}
                  </span>
                </button>
              </div>

            </div>

          </section>

        </main>

        {/* =====================================================================
            PANE 4: BOTTOM DRONE PATROL ROSTER & INTERCEPT ENGAGEMENT LEDGER
        ===================================================================== */}
        <footer className="border-t border-slate-800 bg-[#0B0F17] p-3 lg:p-4 mt-auto">
          <div className="max-w-[1920px] mx-auto flex flex-col gap-3">
            
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
              
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveBottomTab('FLEET')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    activeBottomTab === 'FLEET'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SWARM FLEET ROSTER (16 NODES)
                </button>
                <button
                  onClick={() => setActiveBottomTab('LEDGER')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    activeBottomTab === 'LEDGER'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  INTERCEPT ENGAGEMENT AUDIT LEDGER ({engagements.length})
                </button>
                <button
                  onClick={() => setActiveBottomTab('ROE_POLICY')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    activeBottomTab === 'ROE_POLICY'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ENGAGEMENT RULES (ROE) & SECTOR CONFIG
                </button>
              </div>

              {activeBottomTab === 'FLEET' && (
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <span className="text-slate-400 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-slate-400" />
                    <span>SECTOR:</span>
                  </span>
                  {(['ALL', 'OUTER', 'INNER'] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setRosterSectorFilter(sec)}
                      className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        rosterSectorFilter === sec
                          ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                          : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sec === 'ALL' ? 'ALL 16' : sec === 'OUTER' ? 'OUTER [01-08]' : 'INNER [09-16]'}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* TAB CONTENT 1: SWARM FLEET ROSTER TABLE */}
            {activeBottomTab === 'FLEET' && (
              <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                <table className="w-full text-left font-mono border-collapse">
                  <thead className="bg-[#070B12] text-slate-300 sticky top-0 border-b border-slate-800 text-xs">
                    <tr>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">NODE IDENTIFIER</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">OPERATIONAL STATUS</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">ALTITUDE (AGL)</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">AIRSPEED</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">BATTERY RUNTIME</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">PAYLOAD MODE</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider">TARGET LOCK</th>
                      <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">QUICK TACTICAL ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-mono">
                    {filteredDrones.map((drone) => {
                      const isIntercepting = drone.status === 'INTERCEPT VECTOR';
                      const isRtb = drone.status === 'RTB // CHARGING';

                      return (
                        <tr
                          key={drone.id}
                          onClick={() => setSelectedDroneId(drone.id)}
                          className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                            selectedDroneId === drone.id ? 'bg-cyan-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                isIntercepting ? 'bg-amber-400 animate-pulse' : isRtb ? 'bg-slate-500' : 'bg-emerald-400'
                              }`} />
                              <span className="font-bold text-slate-100">{drone.id}</span>
                              <span className="text-slate-400 text-xs">({drone.callsign})</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`font-semibold ${
                              isIntercepting ? 'text-amber-400' : isRtb ? 'text-slate-400' : 'text-emerald-400'
                            }`}>
                              {drone.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap tabular-nums">
                            {drone.altitudeM} m
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap tabular-nums">
                            {drone.airspeedKts} kts
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-16 h-2 rounded bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full ${drone.batteryPct < 30 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                                  style={{ width: `${drone.batteryPct}%` }}
                                />
                              </div>
                              <span className="tabular-nums font-medium">{drone.batteryPct}%</span>
                              <span className="text-slate-400 text-xs">({drone.runtimeMin}m)</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePayload(drone.id);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono cursor-pointer transition-colors"
                              title="Click to cycle payload configuration"
                            >
                              {drone.payload}
                            </button>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {drone.targetLockId ? (
                              <span className="text-rose-400 font-bold">{drone.targetLockId}</span>
                            ) : (
                              <span className="text-slate-500">NONE // SECTOR SCAN</span>
                            )}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScrambleDrone(drone.id);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-mono font-medium cursor-pointer transition-colors"
                              >
                                SCRAMBLE INTERCEPTOR
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRtbDrone(drone.id);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono cursor-pointer transition-colors"
                              >
                                RTB DOCK
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT 2: INTERCEPT ENGAGEMENT AUDIT LEDGER */}
            {activeBottomTab === 'LEDGER' && (
              <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="bg-[#070B12] text-slate-400 sticky top-0 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2 px-3 font-medium">ENGAGEMENT ID</th>
                      <th className="py-2 px-3 font-medium">TIMESTAMP (UTC)</th>
                      <th className="py-2 px-3 font-medium">ASSET / NODE</th>
                      <th className="py-2 px-3 font-medium">TARGET CONTACT</th>
                      <th className="py-2 px-3 font-medium">COUNTERMEASURE</th>
                      <th className="py-2 px-3 font-medium">AUTHORIZATION TIER</th>
                      <th className="py-2 px-3 font-medium">STATUS</th>
                      <th className="py-2 px-3 font-medium">ENGAGEMENT OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {engagements.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-slate-100">{entry.id}</td>
                        <td className="py-2.5 px-3 text-slate-400 tabular-nums">{entry.timestamp}</td>
                        <td className="py-2.5 px-3 text-cyan-300">{entry.nodeCallsign}</td>
                        <td className="py-2.5 px-3 text-rose-400 font-semibold">{entry.contactCode}</td>
                        <td className="py-2.5 px-3">{entry.countermeasureType}</td>
                        <td className="py-2.5 px-3 text-slate-400">{entry.authorizedBy}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            entry.status === 'COMPLETED'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{entry.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT 3: ROE POLICY & GEOFENCE CONFIGURATION */}
            {activeBottomTab === 'ROE_POLICY' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#070B12] rounded border border-slate-800 font-mono text-xs">
                
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-cyan-300 uppercase">
                    AUTONOMOUS RULES OF ENGAGEMENT (ROE)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Under DEFCON 3, autonomous kinetic intercept is restricted outside the 1km critical boundary.
                    Upon keyed Master Arm authorization, interceptors are permitted autonomous Kevlar net deployment
                    and HPM directed energy bursts against hostile airborne contacts.
                  </p>
                  <div className="text-[11px] text-emerald-400">
                    STATUS: ROE POLICY ACTIVE & ENFORCED
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-cyan-300 uppercase">
                    GEOFENCE EXCLUSION BOUNDARIES
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">INNER EXCLUSION ZONE:</span>
                      <span className="text-rose-400 font-semibold">1,000 m (No-Fly Critical)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">INTERCEPT BUFFER:</span>
                      <span className="text-amber-400 font-semibold">5,000 m (Tactical Response)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">OUTER PERIMETER:</span>
                      <span className="text-cyan-400 font-semibold">10,000 m (Early Warning)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-cyan-300 uppercase">
                    DATA INTEGRATION & POSTGRESQL LINK
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Real-time flight telemetry and radar detections are mirrored to the institutional Supabase database
                    (<code className="text-cyan-300">public.swarm_nodes</code> &amp; <code className="text-cyan-300">public.radar_contacts</code>).
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Row Level Security (RLS) Enforced</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </footer>

        {/* =====================================================================
            MODAL: HIGH-SECURITY MASTER ARM CONFIRMATION MODAL
        ===================================================================== */}
        {showArmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#0B0F17] border border-rose-500/80 rounded-lg max-w-md w-full p-5 font-mono shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              
              <div className="flex items-center gap-3 text-rose-500 mb-3">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                  AUTHORIZE KINETIC INTERCEPT MASTER ARM
                </h3>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                WARNING: Engaging Master Arm authorizes all 16 autonomous swarm units and HPM directed energy platforms
                to discharge kinetic net canisters and high-frequency microwave countermeasures within the 5km buffer.
              </p>

              <div className="bg-[#070B12] p-3 rounded border border-slate-800 text-xs mb-4 space-y-1.5">
                <div className="text-slate-400">SECTOR: SIERRA-9 DEFENSE PERIMETER</div>
                <div className="text-slate-400">TARGETS IN SECTOR: BOGEY-ALPHA, BOGEY-BRAVO</div>
                <div className="text-amber-400">LEVEL 4 COMMAND OVERRIDE REQUIRED</div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setShowArmModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  ABORT / SAFE
                </button>
                <button
                  onClick={handleConfirmMasterArm}
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>CONFIRM MASTER ARM</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}
