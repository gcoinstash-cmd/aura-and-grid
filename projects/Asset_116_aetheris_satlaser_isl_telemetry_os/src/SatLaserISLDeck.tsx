/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AETHERIS-MESH LEO CONSTELLATION // OPTICAL INTERSATELLITE CROSSLINK TERMINAL 04
 * Flagship Deep-Space Intersatellite Laser Communications Operations Deck
 * 
 * Component: SatLaserISLDeck
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Radio,
  Activity,
  Shield,
  ShieldAlert,
  Compass,
  Zap,
  RefreshCw,
  Trash2,
  Sliders,
  Maximize2,
  Eye,
  EyeOff,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  Cpu,
  Thermometer,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Play,
  Pause,
  CircleDot
} from 'lucide-react';

// -----------------------------------------------------------------------------
// TYPES & DATA STRUCTURES
// -----------------------------------------------------------------------------

export interface SatelliteNode {
  id: string;
  code: string;
  plane: number;
  slot: number;
  altitudeKm: number;
  inclinationDeg: number;
  trueAnomalyDeg: number;
  raanDeg: number;
  batterySoc: number;
  solarFluxW: number;
  status: 'NOMINAL' | 'DEGRADED' | 'ECLIPSE' | 'MAINTENANCE';
}

export interface ActiveCrosslink {
  id: string;
  identifier: string;
  direction: 'FORE' | 'AFT' | 'PORT' | 'STARBOARD';
  targetSatCode: string;
  targetPlane: number;
  rangeKm: number;
  rangeRateKms: number;
  dopplerGhz: number;
  latencyMs: number;
  wavelengthNm: number;
  frequencyThz: number;
  osnrDb: number;
  marginDb: number;
  berString: string;
  throughputGbps: number;
  bufferDepthKb: number;
  dropCount: number;
  status: 'LOCKED' | 'RE_ACQUIRING' | 'DEGRADED' | 'SHUTTER_HALT';
}

export interface ManifestRoute {
  id: string;
  hash: string;
  name: string;
  path: string[];
  hops: number;
  totalLatencyMs: number;
  bandwidthGbps: number;
  priority: 'ULTRA_LOW_LATENCY' | 'BULK_BACKHAUL' | 'CRITICAL_TELECOMMAND' | 'DEEP_SPACE_RELAY';
  status: 'ACTIVE' | 'REROUTING' | 'STANDBY';
}

export interface TelecommandLog {
  id: string;
  timestamp: string;
  terminal: string;
  command: string;
  origin: string;
  status: 'SUCCESS' | 'EXECUTING' | 'REJECTED';
  detail: string;
}

// -----------------------------------------------------------------------------
// CONSTANTS & SEED SATELLITES (24 Walker Delta nodes across 8 planes)
// -----------------------------------------------------------------------------

const INITIAL_SATELLITES: SatelliteNode[] = Array.from({ length: 24 }, (_, index) => {
  const satNum = index + 1;
  const plane = Math.floor(index / 3) + 1;
  const slot = (index % 3) + 1;
  const baseAnomaly = (slot - 1) * 120 + (plane - 1) * 15;
  return {
    id: `sat-${satNum.toString().padStart(2, '0')}`,
    code: `SAT-${satNum.toString().padStart(2, '0')}`,
    plane,
    slot,
    altitudeKm: 550 + (index % 5) * 0.15 - 0.3,
    inclinationDeg: 97.4,
    trueAnomalyDeg: baseAnomaly % 360,
    raanDeg: (plane - 1) * 45,
    batterySoc: 94 + (index % 5) * 1.1,
    solarFluxW: 2480 + (index % 4) * 15,
    status: 'NOMINAL',
  };
});

const INITIAL_CROSSLINKS: ActiveCrosslink[] = [
  {
    id: 'link-01',
    identifier: 'LINK-FORE-01',
    direction: 'FORE',
    targetSatCode: 'SAT-05',
    targetPlane: 2,
    rangeKm: 1842.15,
    rangeRateKms: 0.012,
    dopplerGhz: 0.045,
    latencyMs: 6.145,
    wavelengthNm: 1550.52,
    frequencyThz: 193.35,
    osnrDb: 28.4,
    marginDb: 7.2,
    berString: '1.20e-11',
    throughputGbps: 100.0,
    bufferDepthKb: 142,
    dropCount: 0,
    status: 'LOCKED',
  },
  {
    id: 'link-02',
    identifier: 'LINK-AFT-02',
    direction: 'AFT',
    targetSatCode: 'SAT-06',
    targetPlane: 2,
    rangeKm: 1838.4,
    rangeRateKms: -0.008,
    dopplerGhz: -0.032,
    latencyMs: 6.132,
    wavelengthNm: 1550.12,
    frequencyThz: 193.4,
    osnrDb: 29.1,
    marginDb: 7.8,
    berString: '9.80e-12',
    throughputGbps: 100.0,
    bufferDepthKb: 118,
    dropCount: 0,
    status: 'LOCKED',
  },
  {
    id: 'link-03',
    identifier: 'LINK-PORT-03',
    direction: 'PORT',
    targetSatCode: 'SAT-07',
    targetPlane: 3,
    rangeKm: 3120.8,
    rangeRateKms: 1.42,
    dopplerGhz: 3.428,
    latencyMs: 10.41,
    wavelengthNm: 1550.92,
    frequencyThz: 193.3,
    osnrDb: 22.8,
    marginDb: 4.6,
    berString: '4.20e-11',
    throughputGbps: 99.4,
    bufferDepthKb: 384,
    dropCount: 12,
    status: 'LOCKED',
  },
  {
    id: 'link-04',
    identifier: 'LINK-STBD-04',
    direction: 'STARBOARD',
    targetSatCode: 'SAT-01',
    targetPlane: 1,
    rangeKm: 3450.25,
    rangeRateKms: -1.89,
    dopplerGhz: -4.56,
    latencyMs: 11.508,
    wavelengthNm: 1551.32,
    frequencyThz: 193.25,
    osnrDb: 21.2,
    marginDb: 3.8,
    berString: '8.50e-11',
    throughputGbps: 98.8,
    bufferDepthKb: 512,
    dropCount: 38,
    status: 'LOCKED',
  },
];

const INITIAL_ROUTES: ManifestRoute[] = [
  {
    id: 'route-alpha',
    hash: '0x7F8A3D90E21C',
    name: 'TRANS-PACIFIC TRUNK ALPHA',
    path: ['SAT-04', 'SAT-05', 'SAT-08', 'SAT-14', 'SAT-19'],
    hops: 4,
    totalLatencyMs: 28.18,
    bandwidthGbps: 100.0,
    priority: 'ULTRA_LOW_LATENCY',
    status: 'ACTIVE',
  },
  {
    id: 'route-bravo',
    hash: '0x4A1B9C83F62E',
    name: 'TRANS-ATLANTIC COHERENT BACKHAUL',
    path: ['SAT-04', 'SAT-06', 'SAT-11'],
    hops: 2,
    totalLatencyMs: 18.25,
    bandwidthGbps: 100.0,
    priority: 'BULK_BACKHAUL',
    status: 'ACTIVE',
  },
  {
    id: 'route-charlie',
    hash: '0x9C2D1E04B78A',
    name: 'POLAR RELAY SVALBARD-MCMURDO',
    path: ['SAT-04', 'SAT-07', 'SAT-12', 'SAT-18', 'SAT-23'],
    hops: 4,
    totalLatencyMs: 34.25,
    bandwidthGbps: 98.4,
    priority: 'DEEP_SPACE_RELAY',
    status: 'ACTIVE',
  },
  {
    id: 'route-delta',
    hash: '0x2E5F8A19D43C',
    name: 'NORTHERN TIER TT&C TELECOMMAND',
    path: ['SAT-04', 'SAT-02'],
    hops: 1,
    totalLatencyMs: 6.14,
    bandwidthGbps: 100.0,
    priority: 'CRITICAL_TELECOMMAND',
    status: 'ACTIVE',
  },
];

// -----------------------------------------------------------------------------
// COMPONENT IMPLEMENTATION
// -----------------------------------------------------------------------------

export function SatLaserISLDeck() {
  // Global Operational States
  const [shutterSafeMode, setShutterSafeMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CROSS_LINKS' | 'ROUTING_MANIFEST' | 'PAT_LOGS'>('CROSS_LINKS');
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteNode | null>(INITIAL_SATELLITES[3]); // Default SAT-04
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Canvas visual toggles
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [showFsmCones, setShowFsmCones] = useState<boolean>(true);
  const [showRails, setShowRails] = useState<boolean>(true);

  // Dynamic Telemetry States (with micro-jitter loops)
  const [meshThroughput, setMeshThroughput] = useState<number>(100.0);
  const [berExponent, setBerExponent] = useState<number>(-11);
  const [berMantissa, setBerMantissa] = useState<number>(1.2);
  const [ephemerisJitter, setEphemerisJitter] = useState<number>(0.42);
  const [solarExclusionAngle, setSolarExclusionAngle] = useState<number>(38.4);
  const [qpdErrorX, setQpdErrorX] = useState<number>(0.142);
  const [qpdErrorY, setQpdErrorY] = useState<number>(-0.281);
  const [qpdTrail, setQpdTrail] = useState<{ x: number; y: number }[]>([
    { x: 0.142, y: -0.281 },
  ]);
  const [edfaPower, setEdfaPower] = useState<number>(4.82);
  const [edfaBoostActive, setEdfaBoostActive] = useState<boolean>(false);
  const [gimbalAz, setGimbalAz] = useState<number>(142.84);
  const [gimbalEl, setGimbalEl] = useState<number>(-12.38);
  const [motorTempAz, setMotorTempAz] = useState<number>(24.3);
  const [motorTempEl, setMotorTempEl] = useState<number>(26.8);
  const [piezoTemp, setPiezoTemp] = useState<number>(18.7);
  const [jitterHistory, setJitterHistory] = useState<number[]>([0.41, 0.42, 0.43, 0.41, 0.42, 0.44, 0.42, 0.41, 0.43, 0.42]);

  // Links & Routes Data State
  const [crosslinks, setCrosslinks] = useState<ActiveCrosslink[]>(INITIAL_CROSSLINKS);
  const [routes, setRoutes] = useState<ManifestRoute[]>(INITIAL_ROUTES);
  const [logs, setLogs] = useState<TelecommandLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-10-04T03:10:02Z',
      terminal: 'HEAD-04-PRIME',
      command: 'CALIBRATE_FSM_CLOSED_LOOP',
      origin: 'SYSTEM_AUTONOMY',
      status: 'SUCCESS',
      detail: 'Piezo closed-loop bandwidth locked at 5.2 kHz with residual error 0.31 µrad',
    },
    {
      id: 'log-2',
      timestamp: '2026-10-04T03:09:44Z',
      terminal: 'HEAD-04-PORT',
      command: 'DWDM_CARRIER_FREQ_STABILIZE',
      origin: 'OPTICAL_PAYLOAD_DSP',
      status: 'SUCCESS',
      detail: 'Laser diode thermal controller locked within ±0.002°C at 193.30 THz',
    },
    {
      id: 'log-3',
      timestamp: '2026-10-04T03:08:12Z',
      terminal: 'HEAD-04-STBD',
      command: 'EPHEMERIS_KALMAN_UPDATE',
      origin: 'GNSS_ORBIT_NAV',
      status: 'SUCCESS',
      detail: 'State vector ingested from inter-satellite ranging; covariance residual 0.04m',
    },
  ]);

  // Interactive Modals
  const [modalMode, setModalMode] = useState<'NONE' | 'RE_ACQUIRE' | 'PURGE' | 'TUNE_CHANNEL' | 'SAT_DETAIL'>('NONE');
  const [modalTargetLink, setModalTargetLink] = useState<ActiveCrosslink | null>(null);
  const [rasterScanning, setRasterScanning] = useState<boolean>(false);
  const [rasterProgress, setRasterProgress] = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = useState<number>(1550.52);

  // UTC Clock State
  const [utcTime, setUtcTime] = useState<string>('');

  // -----------------------------------------------------------------------------
  // SIMULATION TICK LOOP (Orbital Doppler shifts, micro-jitter, bursts)
  // -----------------------------------------------------------------------------

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' · ').substring(0, 23) + 'Z');
    }, 100);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      // 1. Ephemeris Micro-Jitter (stochastic Gaussian walk around 0.42 µrad)
      const jitterDelta = (Math.random() - 0.5) * 0.04;
      const nextJitter = Math.max(0.28, Math.min(0.58, 0.42 + jitterDelta));
      setEphemerisJitter(parseFloat(nextJitter.toFixed(3)));
      setJitterHistory((prev) => [...prev.slice(1), nextJitter]);

      // 2. QPD Error tracking drift (FSM piezo micro-tracking)
      if (!shutterSafeMode) {
        const qpdWalkX = (Math.random() - 0.5) * 0.035;
        const qpdWalkY = (Math.random() - 0.5) * 0.035;
        const nextX = parseFloat((0.14 + qpdWalkX).toFixed(3));
        const nextY = parseFloat((-0.28 + qpdWalkY).toFixed(3));
        setQpdErrorX(nextX);
        setQpdErrorY(nextY);
        setQpdTrail((prev) => [...prev.slice(-6), { x: nextX, y: nextY }]);
      }

      // 3. Solar exclusion angle slow drift
      setSolarExclusionAngle((prev) => {
        const drift = (Math.random() - 0.48) * 0.02 * simSpeed;
        return parseFloat((prev + drift).toFixed(2));
      });

      // 4. Mesh Throughput packet bursts (98.6 to 102.4 Gbps)
      if (!shutterSafeMode) {
        const burst = 99.4 + Math.random() * 2.8;
        setMeshThroughput(parseFloat(burst.toFixed(2)));

        // BER fluctuations (1.12e-11 to 1.38e-11)
        const mantissa = 1.1 + Math.random() * 0.28;
        setBerMantissa(parseFloat(mantissa.toFixed(2)));
      } else {
        setMeshThroughput(0.0);
        setBerMantissa(0.0);
      }

      // 5. Motor temperatures & Gimbal azimuth drift
      setGimbalAz((prev) => parseFloat((prev + 0.005 * simSpeed).toFixed(2)));
      setMotorTempAz((prev) => parseFloat((24.3 + (Math.random() - 0.5) * 0.15).toFixed(2)));
      setMotorTempEl((prev) => parseFloat((26.8 + (Math.random() - 0.5) * 0.12).toFixed(2)));

      // 6. Crosslink dynamics: Slant range & Doppler shift updates
      setCrosslinks((prevLinks) =>
        prevLinks.map((link) => {
          if (shutterSafeMode) {
            return {
              ...link,
              status: 'SHUTTER_HALT',
              throughputGbps: 0,
              osnrDb: 0,
              marginDb: 0,
            };
          }

          // In-plane links (FORE, AFT) have minimal range rate; cross-plane (PORT, STBD) experience higher Doppler
          const dopplerNoise = (Math.random() - 0.5) * 0.006;
          const updatedDoppler = parseFloat((link.dopplerGhz + dopplerNoise).toFixed(3));
          const updatedRange = parseFloat((link.rangeKm + (link.rangeRateKms * 0.1 * simSpeed)).toFixed(2));
          const updatedLatency = parseFloat((updatedRange / 299.792458).toFixed(3)); // Speed of light in vacuum
          const throughputBurst = parseFloat((98.5 + Math.random() * 2.5).toFixed(2));

          return {
            ...link,
            status: link.status === 'SHUTTER_HALT' ? 'LOCKED' : link.status,
            dopplerGhz: updatedDoppler,
            rangeKm: updatedRange,
            latencyMs: updatedLatency,
            throughputGbps: throughputBurst,
            bufferDepthKb: Math.max(80, Math.min(600, link.bufferDepthKb + Math.floor((Math.random() - 0.48) * 15))),
          };
        })
      );
    }, 450);

    return () => clearInterval(interval);
  }, [isSimRunning, shutterSafeMode, simSpeed]);

  // -----------------------------------------------------------------------------
  // SHUTTER SAFE-MODE TOGGLE HANDLER
  // -----------------------------------------------------------------------------

  const handleToggleShutter = useCallback(() => {
    setShutterSafeMode((prev) => {
      const nextState = !prev;
      if (nextState) {
        // Shutter CLOSED: Cut laser power, set safe mode
        setEdfaPower(0.0);
        setMeshThroughput(0.0);
        setLogs((l) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            terminal: 'APERTURE-BAY-ALL',
            command: 'EMERGENCY_SHUTTER_ENGAGE',
            origin: 'SAFETY_INTERLOCK_DESK',
            status: 'SUCCESS',
            detail: 'Optical mechanical shutters fully deployed. High-power EDFA pumped to safe idle (0.0 W).',
          },
          ...l,
        ]);
      } else {
        // Shutter OPEN: Restore 4.82 W nominal
        setEdfaPower(4.82);
        setLogs((l) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            terminal: 'APERTURE-BAY-ALL',
            command: 'EMERGENCY_SHUTTER_DISENGAGE',
            origin: 'SAFETY_INTERLOCK_DESK',
            status: 'SUCCESS',
            detail: 'Optical shutters retracted to nominal open aperture. EDFA laser amplifier ramped to 4.82 W.',
          },
          ...l,
        ]);
      }
      return nextState;
    });
  }, []);

  // -----------------------------------------------------------------------------
  // QUICK-ACTION: RE-ACQUIRE BEACON (Raster Scan Routine)
  // -----------------------------------------------------------------------------

  const handleStartRasterScan = useCallback(() => {
    if (!modalTargetLink) return;
    setRasterScanning(true);
    setRasterProgress(10);

    const scanInterval = setInterval(() => {
      setRasterProgress((p) => {
        if (p >= 100) {
          clearInterval(scanInterval);
          setRasterScanning(false);
          // Restore link to locked
          setCrosslinks((links) =>
            links.map((lnk) =>
              lnk.id === modalTargetLink.id
                ? {
                    ...lnk,
                    status: 'LOCKED',
                    osnrDb: 28.6,
                    marginDb: 7.4,
                    dropCount: 0,
                  }
                : lnk
            )
          );
          setLogs((l) => [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              terminal: modalTargetLink.identifier,
              command: 'PAT_SPIRAL_RASTER_SCAN_COMPLETE',
              origin: 'AUTONOMOUS_PAT_DSP',
              status: 'SUCCESS',
              detail: `Spiral raster sweep locked target ${modalTargetLink.targetSatCode} in 410ms. Peak beacon SNR: 28.6 dB.`,
            },
            ...l,
          ]);
          setModalMode('NONE');
          return 100;
        }
        return p + 25;
      });
    }, 300);
  }, [modalTargetLink]);

  // -----------------------------------------------------------------------------
  // QUICK-ACTION: PURGE BUFFER QUEUE
  // -----------------------------------------------------------------------------

  const handleConfirmPurgeQueue = useCallback(() => {
    if (!modalTargetLink) return;
    setCrosslinks((links) =>
      links.map((lnk) =>
        lnk.id === modalTargetLink.id
          ? {
              ...lnk,
              bufferDepthKb: 0,
              dropCount: 0,
            }
          : lnk
      )
    );
    setLogs((l) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        terminal: modalTargetLink.identifier,
        command: 'FIFO_BUFFER_PURGE_EXECUTE',
        origin: 'OPERATOR_DESK',
        status: 'SUCCESS',
        detail: `Flushed optical burst buffer queue for ${modalTargetLink.identifier}. Dropped packet accumulator reset to zero.`,
      },
      ...l,
    ]);
    setModalMode('NONE');
  }, [modalTargetLink]);

  // -----------------------------------------------------------------------------
  // QUICK-ACTION: CHANNEL TUNING
  // -----------------------------------------------------------------------------

  const handleApplyChannel = useCallback(() => {
    if (!modalTargetLink) return;
    const freq = parseFloat((299792.458 / selectedChannel).toFixed(2));
    setCrosslinks((links) =>
      links.map((lnk) =>
        lnk.id === modalTargetLink.id
          ? {
              ...lnk,
              wavelengthNm: selectedChannel,
              frequencyThz: freq,
            }
          : lnk
      )
    );
    setLogs((l) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        terminal: modalTargetLink.identifier,
        command: 'DWDM_ITU_GRID_TUNING',
        origin: 'OPERATOR_DESK',
        status: 'SUCCESS',
        detail: `Wavelength shifted to ${selectedChannel} nm (${freq} THz) on 100 GHz ITU grid.`,
      },
      ...l,
    ]);
    setModalMode('NONE');
  }, [modalTargetLink, selectedChannel]);

  // -----------------------------------------------------------------------------
  // EDFA BOOST OVERDRIVE TOGGLE
  // -----------------------------------------------------------------------------

  const handleToggleEdfaBoost = useCallback(() => {
    if (shutterSafeMode) return;
    setEdfaBoostActive((prev) => {
      const next = !prev;
      setEdfaPower(next ? 5.25 : 4.82);
      setLogs((l) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          terminal: 'EDFA-STAGE2-PUMP',
          command: next ? 'EDFA_BOOST_OVERDRIVE_ENABLE' : 'EDFA_BOOST_OVERDRIVE_DISABLE',
          origin: 'AMPLIFIER_TELEMETRY',
          status: 'SUCCESS',
          detail: next
            ? 'EDFA 980nm pump drive current boosted to 940 mA; optical output reaches 5.25 W (+0.43 dBm).'
            : 'EDFA returned to nominal 4.82 W steady state output.',
        },
        ...l,
      ]);
      return next;
    });
  }, [shutterSafeMode]);

  // -----------------------------------------------------------------------------
  // 2D ORBITAL RING PROJECTION MATH
  // -----------------------------------------------------------------------------

  // Pre-calculate positions of satellites for the 2D orbital visualization
  const orbitalProjectedNodes = useMemo(() => {
    const cx = 320;
    const cy = 240;
    const radiusX = 230;
    const radiusY = 175;

    return INITIAL_SATELLITES.map((sat) => {
      // 8 planes tilted at angles from 0 to 180 degrees
      const planeAngleRad = ((sat.plane - 1) * Math.PI) / 8;
      // Anomaly along its circular orbit
      const anomalyRad = (sat.trueAnomalyDeg * Math.PI) / 180;

      // Unrotated orbit coordinates
      const orbitX = Math.cos(anomalyRad) * radiusX;
      const orbitY = Math.sin(anomalyRad) * radiusY;

      // Rotate by orbital plane inclination in 2D perspective
      const cosP = Math.cos(planeAngleRad * 0.6);
      const sinP = Math.sin(planeAngleRad * 0.6);
      const projX = cx + orbitX * cosP - orbitY * sinP * 0.35;
      const projY = cy + orbitX * sinP * 0.4 + orbitY * cosP * 0.85;

      return {
        ...sat,
        projX,
        projY,
      };
    });
  }, []);

  const sat04Node = orbitalProjectedNodes.find((n) => n.code === 'SAT-04') || orbitalProjectedNodes[3];

  return (
    <>
      <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 flex flex-col antialiased">
        {/* ========================================================================= */}
        {/* PANE 1: TOP CONSTELLATION BUS & LINK HUD                                */}
        {/* ========================================================================= */}
        <header className="border-b border-[#162544] bg-[#080D1A]/95 backdrop-blur-md px-4 lg:px-6 py-3 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            {/* Top Bar: Clean Responsive Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
              {/* Left Column: Radio Icon + Title & Subtitle Ribbon */}
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#0F172A] border border-[#1E293B] shadow-inner shrink-0">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-emerald-400 tracking-wider font-mono">
                    AETHERIS-MESH LEO CONSTELLATION // OPTICAL ISL TERMINAL 04
                  </h1>
                  <p className="text-xs md:text-sm font-mono text-slate-300 mt-1">
                    Walker Delta 24/8/1 • 550km Sun-Sync 97.4° • Host: SAT-04 [PRIME-OP-HEAD]
                  </p>
                </div>
              </div>

              {/* Right Column: Clock & Flush-Right Mechanical Shutter Switch with shrink-0 sm:self-start */}
              <div className="shrink-0 sm:self-start flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-md bg-[#0F172A] border border-[#1E293B]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">EPOCH UTC:</span>
                  <span className="text-slate-200 font-semibold">{utcTime || '2026-10-04 · 03:10:00.000Z'}</span>
                </div>

                {/* Mechanical Optical Shutter Switch Box with comfortable padding, border, and glowing indicator */}
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0B132B] border border-slate-800 shadow-md">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      OPTICAL SHUTTER
                    </div>
                    <div
                      className={`text-xs font-mono font-bold flex items-center justify-end gap-1.5 ${
                        shutterSafeMode ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          shutterSafeMode
                            ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                            : 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                        }`}
                      />
                      {shutterSafeMode ? 'SAFE-MODE [CLOSED]' : 'APERTURE OPEN'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleShutter}
                    title="Toggle Laser Optical Shutter / Sun-Blind Safe-Mode"
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      shutterSafeMode
                        ? 'bg-amber-600 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'bg-emerald-950 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        shutterSafeMode ? 'translate-x-7 text-amber-600' : 'translate-x-0.5 text-emerald-800'
                      }`}
                    >
                      {shutterSafeMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sun-Blind Safe Mode Banner if Active */}
            {shutterSafeMode && (
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono animate-pulse">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    WARNING: EMERGENCY OPTICAL SHUTTER CLOSED // SUN INTERFERENCE OR HIGH SOLAR FLUX MITIGATION ACTIVE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleShutter}
                  className="px-2.5 py-1 text-[11px] font-bold uppercase rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 cursor-pointer transition-colors"
                >
                  Disengage Safe-Mode
                </button>
              </div>
            )}

            {/* Telemetry Strip: 4 Prime Operational Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {/* Metric 1: Constellation Mesh Throughput */}
              <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-xs font-semibold tracking-wider mb-1 font-mono">
                  <span>MESH THROUGHPUT</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-slate-100">
                    {meshThroughput.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Gbps</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                  <span>Coherent DWDM Cap</span>
                  <span className="text-emerald-400/90 font-medium">100.0 Gbps Nom</span>
                </div>
              </div>

              {/* Metric 2: Bit Error Rate (BER) */}
              <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-xs font-semibold tracking-wider mb-1 font-mono">
                  <span>BIT ERROR RATE (BER)</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-slate-100">
                    {shutterSafeMode ? 'NO SIGNAL' : `${berMantissa.toFixed(2)}e${berExponent}`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                  <span>Forward Error Corr</span>
                  <span className="text-cyan-400 font-medium">BCH-3 High Gain</span>
                </div>
              </div>

              {/* Metric 3: Ephemeris Jitter */}
              <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-xs font-semibold tracking-wider mb-1 font-mono">
                  <span>EPHEMERIS JITTER</span>
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-slate-100">
                    ±{ephemerisJitter.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">µrad</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                  <span>Piezo Loop Residual</span>
                  <span className="text-emerald-400 font-medium">&lt; 0.50 µrad Spec</span>
                </div>
              </div>

              {/* Metric 4: Solar Exclusion Angle */}
              <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-xs font-semibold tracking-wider mb-1 font-mono">
                  <span>SOLAR EXCLUSION ANGLE</span>
                  <Sun className={`w-3.5 h-3.5 ${solarExclusionAngle < 25 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${
                      solarExclusionAngle < 25 ? 'text-amber-400' : 'text-slate-100'
                    }`}
                  >
                    {solarExclusionAngle.toFixed(1)}°
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">FOV</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                  <span>Baffle Blind Threshold</span>
                  <span className={solarExclusionAngle < 25 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    20.0° Safe Margin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* CENTER SECTION: 2D ORBITAL RING CANVAS + PAT DIAGNOSTICS                */}
        {/* ========================================================================= */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* --------------------------------------------------------------------- */}
            {/* PANE 2: 2D ORBITAL RING & COHERENT BEAM ROUTING CANVAS (Col 1-7)      */}
            {/* --------------------------------------------------------------------- */}
            <section className="lg:col-span-7 bg-[#080D1A] border border-[#162544] rounded-xl flex flex-col overflow-hidden shadow-2xl">
              {/* Canvas Header & Toggles */}
              <div className="px-4 py-2.5 bg-[#0B132B] border-b border-[#162544] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-base md:text-lg font-bold font-mono text-slate-200 tracking-wider uppercase">
                    ORBITAL PLANE MESH & COHERENT BEAM ROUTING
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">24 Spacecraft · 8 Planes</span>
                </div>

                {/* Interactive display controls */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setShowBeams(!showBeams)}
                    className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                      showBeams ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-[#0F172A] text-slate-400 border-[#1E293B]'
                    }`}
                  >
                    Beams
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFsmCones(!showFsmCones)}
                    className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                      showFsmCones ? 'bg-cyan-950 text-cyan-300 border-cyan-600' : 'bg-[#0F172A] text-slate-400 border-[#1E293B]'
                    }`}
                  >
                    FSM Cones
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRails(!showRails)}
                    className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                      showRails ? 'bg-slate-800 text-slate-200 border-slate-600' : 'bg-[#0F172A] text-slate-400 border-[#1E293B]'
                    }`}
                  >
                    Rails
                  </button>

                  <div className="h-3 w-px bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => setIsSimRunning(!isSimRunning)}
                    title={isSimRunning ? 'Pause Orbital Propagation' : 'Resume Orbital Propagation'}
                    className="p-1 rounded bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white cursor-pointer"
                  >
                    {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
                    title="Simulation Speed"
                    className="px-1.5 py-1 rounded bg-[#0F172A] border border-[#1E293B] text-cyan-400 font-bold hover:bg-[#162544] cursor-pointer"
                  >
                    {simSpeed}x
                  </button>
                </div>
              </div>

              {/* Main SVG Visualization */}
              <div className="min-h-[440px] w-full bg-[#020308] border border-slate-800/80 rounded-lg relative overflow-hidden flex items-center justify-center p-2 select-none">
                {/* Visual coordinate grid overlay */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, #162544 1px, transparent 1px), linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid meet" className="w-full h-full max-h-[460px]">
                  <defs>
                    {/* Laser Beam Glow Filters */}
                    <filter id="emeraldLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="cyanLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    {/* Radial gradients for Earth core & FSM cones */}
                    <radialGradient id="earthGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0B1C38" />
                      <stop offset="70%" stopColor="#051024" />
                      <stop offset="100%" stopColor="#030814" />
                    </radialGradient>
                    <radialGradient id="fsmConeGradient" cx="0%" cy="0%" r="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Central Earth Globe & Atmospheric Limb */}
                  <circle cx="320" cy="240" r="85" fill="url(#earthGradient)" stroke="#162E52" strokeWidth="1.5" />
                  <circle cx="320" cy="240" r="92" fill="none" stroke="#22D3EE" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.35" />
                  <circle cx="320" cy="240" r="105" fill="none" stroke="#00FF87" strokeWidth="0.5" strokeDasharray="1,5" opacity="0.25" />

                  {/* Earth Nadir Grid lines */}
                  <ellipse cx="320" cy="240" rx="85" ry="32" fill="none" stroke="#162E52" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.6" />
                  <ellipse cx="320" cy="240" rx="32" ry="85" fill="none" stroke="#162E52" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.6" />
                  <text x="320" y="244" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace" opacity="0.6">
                    LEO NADIR 550KM
                  </text>

                  {/* Orbital Plane Rings (8 Planes) */}
                  {showRails &&
                    Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i * 180) / 8;
                      return (
                        <ellipse
                          key={`plane-${i}`}
                          cx="320"
                          cy="240"
                          rx="230"
                          ry="175"
                          fill="none"
                          stroke="#1E293B"
                          strokeWidth="0.8"
                          strokeDasharray="4,6"
                          transform={`rotate(${angle * 0.45}, 320, 240)`}
                          opacity={i + 1 === sat04Node.plane ? 0.8 : 0.3}
                        />
                      );
                    })}

                  {/* FSM Lock Cones radiating from SAT-04 to connected targets */}
                  {showFsmCones && !shutterSafeMode && (
                    <g>
                      {crosslinks.map((link) => {
                        const target = orbitalProjectedNodes.find((n) => n.code === link.targetSatCode);
                        if (!target) return null;
                        const dx = target.projX - sat04Node.projX;
                        const dy = target.projY - sat04Node.projY;
                        const angle = Math.atan2(dy, dx);
                        const coneLength = 65;
                        const spread = 0.22; // ~12 degrees FSM dynamic envelop

                        const x1 = sat04Node.projX;
                        const y1 = sat04Node.projY;
                        const x2 = x1 + Math.cos(angle - spread) * coneLength;
                        const y2 = y1 + Math.sin(angle - spread) * coneLength;
                        const x3 = x1 + Math.cos(angle + spread) * coneLength;
                        const y3 = y1 + Math.sin(angle + spread) * coneLength;

                        return (
                          <path
                            key={`fsm-cone-${link.id}`}
                            d={`M ${x1} ${y1} L ${x2} ${y2} A ${coneLength} ${coneLength} 0 0 1 ${x3} ${y3} Z`}
                            fill="url(#fsmConeGradient)"
                            opacity="0.65"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Laser Beam Connection Vectors (Dynamic & Color-coded by Link Margin) */}
                  {showBeams && !shutterSafeMode && (
                    <g>
                      {crosslinks.map((link) => {
                        const target = orbitalProjectedNodes.find((n) => n.code === link.targetSatCode);
                        if (!target) return null;

                        // Margin > 6 dB: Emerald (#00FF87), 3-6 dB: Cyan (#06B6D4), <3 dB: Amber (#F59E0B)
                        const beamColor =
                          link.marginDb >= 6.0 ? '#00FF87' : link.marginDb >= 3.0 ? '#06B6D4' : '#F59E0B';
                        const isIntraPlane = link.direction === 'FORE' || link.direction === 'AFT';

                        return (
                          <g key={`beam-${link.id}`}>
                            {/* Outer Glow Line */}
                            <line
                              x1={sat04Node.projX}
                              y1={sat04Node.projY}
                              x2={target.projX}
                              y2={target.projY}
                              stroke={beamColor}
                              strokeWidth="3.5"
                              strokeOpacity="0.25"
                              filter={beamColor === '#00FF87' ? 'url(#emeraldLaserGlow)' : 'url(#cyanLaserGlow)'}
                            />
                            {/* Coherent Photon Carrier Beam with animation pulses */}
                            <line
                              x1={sat04Node.projX}
                              y1={sat04Node.projY}
                              x2={target.projX}
                              y2={target.projY}
                              stroke={beamColor}
                              strokeWidth={isIntraPlane ? '1.8' : '1.4'}
                              strokeDasharray={isIntraPlane ? '6,3' : '4,4'}
                              className="animate-pulse"
                            />
                            {/* Link Vector Midpoint Margin Badge */}
                            <g
                              transform={`translate(${(sat04Node.projX + target.projX) / 2}, ${
                                (sat04Node.projY + target.projY) / 2
                              })`}
                            >
                              <rect
                                x="-24"
                                y="-9"
                                width="48"
                                height="18"
                                rx="3"
                                fill="#04060C"
                                stroke={beamColor}
                                strokeWidth="0.8"
                                opacity="0.92"
                              />
                              <text
                                x="0"
                                y="3.5"
                                textAnchor="middle"
                                fill={beamColor}
                                fontSize="8.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                +{link.marginDb.toFixed(1)}dB
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Satellite Nodes (24 Walker Delta spacecraft) */}
                  {orbitalProjectedNodes.map((sat) => {
                    const isPrimeHost = sat.code === 'SAT-04';
                    const isSelected = selectedSatellite?.code === sat.code;
                    const isConnectedLink = crosslinks.some((l) => l.targetSatCode === sat.code);

                    return (
                      <g
                        key={sat.id}
                        transform={`translate(${sat.projX}, ${sat.projY})`}
                        onClick={() => setSelectedSatellite(sat)}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {/* Target Selection Rings */}
                        {isSelected && (
                          <circle
                            r="15"
                            fill="none"
                            stroke="#38BDF8"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            className="animate-spin"
                          />
                        )}

                        {/* Prime Host SAT-04 Pulsing Outer Halo */}
                        {isPrimeHost && (
                          <>
                            <circle r="12" fill="#00FF87" fillOpacity="0.2" className="animate-ping" />
                            <circle r="10" fill="none" stroke="#00FF87" strokeWidth="1.5" />
                          </>
                        )}

                        {/* Connected Node Highlight Ring */}
                        {isConnectedLink && !isPrimeHost && (
                          <circle r="8" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3,3" />
                        )}

                        {/* Core Spacecraft Dot */}
                        <circle
                          r={isPrimeHost ? '5.5' : isSelected ? '4.5' : '3.5'}
                          fill={isPrimeHost ? '#00FF87' : isConnectedLink ? '#06B6D4' : '#94A3B8'}
                          stroke="#080D1A"
                          strokeWidth="1"
                        />

                        {/* Node Label Readout */}
                        <text
                          x="0"
                          y={isPrimeHost ? '-14' : '-8'}
                          textAnchor="middle"
                          fill={isPrimeHost ? '#00FF87' : isSelected ? '#38BDF8' : '#94A3B8'}
                          fontSize={isPrimeHost ? '9' : '7.5'}
                          fontFamily="monospace"
                          fontWeight={isPrimeHost || isSelected ? 'bold' : 'normal'}
                        >
                          {sat.code}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Satellite Inspector Overlay (Bottom-Left within Canvas) */}
                {selectedSatellite && (
                  <div className="absolute bottom-2 left-2 p-2.5 rounded-lg bg-[#080D1A]/90 border border-[#1E293B] backdrop-blur-md text-[11px] font-mono shadow-xl max-w-xs">
                    <div className="flex items-center justify-between gap-3 border-b border-[#1E293B] pb-1.5 mb-1.5">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        <CircleDot className="w-3 h-3 text-cyan-400" />
                        {selectedSatellite.code}
                        {selectedSatellite.code === 'SAT-04' && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                            PRIME
                          </span>
                        )}
                      </span>
                      <span className="text-slate-400">
                        Plane {selectedSatellite.plane} · Slot {selectedSatellite.slot}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
                      <div>
                        <span className="text-slate-500">Altitude: </span>
                        <span>{selectedSatellite.altitudeKm.toFixed(1)} km</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Anomaly: </span>
                        <span>{selectedSatellite.trueAnomalyDeg.toFixed(1)}°</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Battery: </span>
                        <span className="text-emerald-400">{selectedSatellite.batterySoc.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Solar: </span>
                        <span>{selectedSatellite.solarFluxW} W</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
                      <span className="text-cyan-400">STATUS: {selectedSatellite.status}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setModalMode('SAT_DETAIL');
                        }}
                        className="text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Deep Orbit Telemetry →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas Legend */}
              <div className="px-4 py-2 bg-[#0B132B] border-t border-[#162544] flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00FF87]"></span>
                    <span>High Margin (&gt;6 dB)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4]"></span>
                    <span>Nominal (3–6 dB)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                    <span>Marginal (&lt;3 dB)</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Coherent Interlock:</span> 4 Active ISL Heads (Intra/Inter Plane)
                </div>
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* PANE 3: OPTICAL TERMINAL & PAT DIAGNOSTICS (Col 8-12)                 */}
            {/* --------------------------------------------------------------------- */}
            <section className="lg:col-span-5 bg-[#080D1A] border border-[#162544] rounded-xl flex flex-col overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#0B132B] border-b border-[#162544] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-base md:text-lg font-bold font-mono text-slate-200 tracking-wider uppercase">
                    PAT SUBSYSTEM & OPTICAL DIAGNOSTICS
                  </span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#0F172A] text-emerald-400 font-bold border border-emerald-900">
                  {shutterSafeMode ? 'SHUTTER SHUT' : 'CLOSED LOOP 5kHz'}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-4 flex-1">
                {/* Quadrant Photodiode (QPD) Tracker Reticle */}
                <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-bold font-mono text-slate-200">
                      QUADRANT PHOTODIODE (QPD) TRACKER
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {Math.sqrt(qpdErrorX ** 2 + qpdErrorY ** 2) < 0.5 ? 'FINE LOCK (<0.5 µrad)' : 'ACQUISITION'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                    {/* Reticle Target SVG */}
                    <div className="relative w-36 h-36 mx-auto sm:mx-0 bg-[#04060C] border border-[#1E293B] rounded-lg flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Concentric µrad rings: 0.5, 1.0, 2.0 */}
                        <circle cx="50" cy="50" r="12" fill="none" stroke="#1E293B" strokeWidth="0.8" />
                        <circle cx="50" cy="50" r="24" fill="none" stroke="#162544" strokeWidth="0.8" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#102038" strokeWidth="0.8" />

                        {/* Quadrant Crosshairs dividing Q1, Q2, Q3, Q4 */}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="2,2" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="2,2" />

                        {/* Labels for Quadrants */}
                        <text x="75" y="25" fill="#334155" fontSize="6" fontFamily="monospace">Q1</text>
                        <text x="25" y="25" fill="#334155" fontSize="6" fontFamily="monospace">Q2</text>
                        <text x="25" y="75" fill="#334155" fontSize="6" fontFamily="monospace">Q3</text>
                        <text x="75" y="75" fill="#334155" fontSize="6" fontFamily="monospace">Q4</text>

                        {/* Micro-jitter trajectory trail */}
                        {!shutterSafeMode &&
                          qpdTrail.map((pt, idx) => (
                            <circle
                              key={`trail-${idx}`}
                              cx={50 + pt.x * 35}
                              cy={50 + pt.y * 35}
                              r="1.2"
                              fill="#00FF87"
                              opacity={(idx + 1) / (qpdTrail.length + 1) * 0.4}
                            />
                          ))}

                        {/* Spot Centroid Beam Focus Dot */}
                        {!shutterSafeMode ? (
                          <g>
                            <circle
                              cx={50 + qpdErrorX * 35}
                              cy={50 + qpdErrorY * 35}
                              r="4"
                              fill="#00FF87"
                              fillOpacity="0.3"
                              className="animate-ping"
                            />
                            <circle
                              cx={50 + qpdErrorX * 35}
                              cy={50 + qpdErrorY * 35}
                              r="2.5"
                              fill="#00FF87"
                              stroke="#ffffff"
                              strokeWidth="0.5"
                            />
                          </g>
                        ) : (
                          <text x="50" y="52" textAnchor="middle" fill="#F59E0B" fontSize="6" fontFamily="monospace">
                            NO LIGHT
                          </text>
                        )}
                      </svg>
                    </div>

                    {/* Numerical Error Readouts */}
                    <div className="flex flex-col gap-2 font-mono">
                      <div className="flex items-center justify-between p-2 rounded bg-[#080D1A] border border-[#162544]">
                        <span className="text-slate-300 text-xs md:text-sm font-semibold">Error X (ΔX):</span>
                        <span className="text-emerald-400 font-bold text-sm md:text-base">
                          {shutterSafeMode ? '0.000' : `${qpdErrorX >= 0 ? '+' : ''}${qpdErrorX.toFixed(3)} µrad`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-[#080D1A] border border-[#162544]">
                        <span className="text-slate-300 text-xs md:text-sm font-semibold">Error Y (ΔY):</span>
                        <span className="text-emerald-400 font-bold text-sm md:text-base">
                          {shutterSafeMode ? '0.000' : `${qpdErrorY >= 0 ? '+' : ''}${qpdErrorY.toFixed(3)} µrad`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-[#080D1A] border border-[#162544]">
                        <span className="text-slate-300 text-xs md:text-sm font-semibold">Centroid Vector:</span>
                        <span className="text-cyan-400 font-black text-xl md:text-2xl">
                          {shutterSafeMode ? '0.000' : `${Math.sqrt(qpdErrorX ** 2 + qpdErrorY ** 2).toFixed(3)} µrad`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span>Sum Voltage: 845.2 mV</span>
                        <span>BW: 5.2 kHz</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EDFA Optical Output Power Diagnostics */}
                <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-bold font-mono text-slate-200">
                      EDFA OPTICAL OUTPUT & PUMP LASERS
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleEdfaBoost}
                      disabled={shutterSafeMode}
                      className={`text-xs font-mono font-semibold px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        edfaBoostActive
                          ? 'bg-amber-950 text-amber-300 border-amber-500'
                          : 'bg-[#0F172A] text-slate-300 border-[#1E293B] hover:border-slate-500'
                      }`}
                    >
                      {edfaBoostActive ? 'BOOST ACTIVE (+0.4W)' : 'ENGAGE BOOST'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#080D1A] border border-[#162544]">
                      <div className="text-xs font-semibold text-slate-300">Optical Output Power</div>
                      <div className="text-xl md:text-2xl font-black text-slate-100 flex items-baseline gap-1.5 mt-0.5">
                        <span>{edfaPower.toFixed(2)}</span>
                        <span className="text-sm font-bold text-emerald-400">Watts</span>
                      </div>
                      {/* Power Progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            edfaPower > 5 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${(edfaPower / 6.0) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#080D1A] border border-[#162544]">
                      <div className="text-xs font-semibold text-slate-300">Dual 980nm Pumps</div>
                      <div className="text-slate-200 mt-1.5 flex flex-col gap-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pump A:</span>
                          <span className="text-cyan-400 font-bold">{shutterSafeMode ? '0 mA' : '855.0 mA'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pump B:</span>
                          <span className="text-cyan-400 font-bold">{shutterSafeMode ? '0 mA' : '862.0 mA'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Stage 2 Gain: 34.2 dB</span>
                    <span>Wavelength Grid: 1550.52 nm ± 0.02</span>
                  </div>
                </div>

                {/* Gimbal Azimuth/Elevation & Coarse Pointing Motor Temps */}
                <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-bold font-mono text-slate-200">
                      GIMBAL ANGLES & THERMAL STATUS
                    </span>
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono mb-2">
                    <div className="p-2 rounded bg-[#080D1A] border border-[#162544] flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-300">Azimuth:</span>
                      <span className="text-slate-100">{gimbalAz.toFixed(2)}°</span>
                    </div>
                    <div className="p-2 rounded bg-[#080D1A] border border-[#162544] flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-300">Elevation:</span>
                      <span className="text-slate-100">{gimbalEl.toFixed(2)}°</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-mono font-bold">
                    <div className="p-1.5 rounded bg-[#080D1A] border border-[#162544] text-center">
                      <span className="text-slate-400 text-xs block font-normal">Az Motor</span>
                      <span className="text-slate-100">{motorTempAz.toFixed(1)}°C</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#080D1A] border border-[#162544] text-center">
                      <span className="text-slate-400 text-xs block font-normal">El Motor</span>
                      <span className="text-slate-100">{motorTempEl.toFixed(1)}°C</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#080D1A] border border-[#162544] text-center">
                      <span className="text-slate-400 text-xs block font-normal">FSM Piezo</span>
                      <span className="text-emerald-400">{piezoTemp.toFixed(1)}°C</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#080D1A] border border-[#162544] text-center">
                      <span className="text-slate-400 text-xs block font-normal">Radiator</span>
                      <span className="text-cyan-400">-32.4°C</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Micro-Jitter Sparkline (SVG) */}
                <div className="bg-[#0B132B]/80 border border-[#162544] rounded-lg p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>FSM MICRO-JITTER OSCILLOSCOPE (LAST 10 SAMPLES)</span>
                    <span className="text-emerald-400">±{ephemerisJitter.toFixed(3)} µrad</span>
                  </div>
                  <div className="h-9 w-full bg-[#04060C] border border-[#1E293B] rounded flex items-center px-1">
                    <svg viewBox="0 0 180 30" className="w-full h-full" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="#00FF87"
                        strokeWidth="1.5"
                        points={jitterHistory
                          .map((val, idx) => {
                            const x = (idx / (jitterHistory.length - 1)) * 180;
                            const y = 30 - ((val - 0.28) / (0.58 - 0.28)) * 26;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* PANE 4: INTERSATELLITE LINK LEDGER & ROUTING ROUTE MANIFEST               */}
          {/* ========================================================================= */}
          <section className="bg-[#080D1A] border border-[#162544] rounded-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Tab Navigation Header */}
            <div className="px-4 py-2 bg-[#0B132B] border-b border-[#162544] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('CROSS_LINKS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    activeTab === 'CROSS_LINKS'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/60 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  ACTIVE CROSSLINKS (4 HEADS)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ROUTING_MANIFEST')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    activeTab === 'ROUTING_MANIFEST'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/60 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  ROUTING ROUTE MANIFEST
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('PAT_LOGS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    activeTab === 'PAT_LOGS'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/60 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  TELECOMMAND LOGS
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>Active Channels: 4/4 Locked</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">DWDM ITU 100GHz Standard</span>
              </div>
            </div>

            {/* TAB CONTENT 1: ACTIVE CROSSLINKS TABLE */}
            {activeTab === 'CROSS_LINKS' && (
              <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                  <thead className="sticky top-0 bg-[#060814] z-10 border-b border-slate-800">
                    <tr className="text-slate-300">
                      <th className="py-3 px-4 font-bold tracking-wider">IDENTIFIER</th>
                      <th className="py-3 px-3 font-bold tracking-wider">TARGET NODE</th>
                      <th className="py-3 px-3 font-bold tracking-wider">RANGE / RATE</th>
                      <th className="py-3 px-3 font-bold tracking-wider">DOPPLER</th>
                      <th className="py-3 px-3 font-bold tracking-wider">LATENCY</th>
                      <th className="py-3 px-3 font-bold tracking-wider">WAVELENGTH</th>
                      <th className="py-3 px-3 font-bold tracking-wider">OSNR / MARGIN</th>
                      <th className="py-3 px-3 font-bold tracking-wider">QUEUE / DROPS</th>
                      <th className="py-3 px-3 font-bold tracking-wider">STATUS</th>
                      <th className="py-3 px-4 text-right font-bold tracking-wider">QUICK ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162544]">
                    {crosslinks.map((link) => (
                      <tr
                        key={link.id}
                        className={`hover:bg-[#0B132B]/50 transition-colors ${
                          link.status === 'SHUTTER_HALT' ? 'opacity-60 bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-slate-100 text-xs md:text-sm flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              link.status === 'LOCKED'
                                ? 'bg-emerald-400 shadow-[0_0_8px_#00FF87]'
                                : link.status === 'SHUTTER_HALT'
                                ? 'bg-amber-400'
                                : 'bg-cyan-400 animate-ping'
                            }`}
                          />
                          {link.identifier}
                        </td>
                        <td className="py-3 px-3 text-cyan-400 font-semibold text-xs md:text-sm">
                          {link.targetSatCode} (P{link.targetPlane})
                        </td>
                        <td className="py-3 px-3 text-slate-200 text-xs md:text-sm">
                          <div className="font-semibold">{link.rangeKm.toFixed(1)} km</div>
                          <div className="text-xs text-slate-400">
                            {link.rangeRateKms >= 0 ? '+' : ''}
                            {link.rangeRateKms.toFixed(3)} km/s
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs md:text-sm">
                          <span className={`font-bold ${Math.abs(link.dopplerGhz) > 2 ? 'text-amber-300' : 'text-slate-200'}`}>
                            {link.dopplerGhz >= 0 ? '+' : ''}
                            {link.dopplerGhz.toFixed(3)} GHz
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-100 font-bold text-xs md:text-sm">{link.latencyMs.toFixed(2)} ms</td>
                        <td className="py-3 px-3 text-slate-200 text-xs md:text-sm">
                          <div className="font-semibold">{link.wavelengthNm} nm</div>
                          <div className="text-xs text-slate-400">{link.frequencyThz} THz</div>
                        </td>
                        <td className="py-3 px-3 text-xs md:text-sm">
                          <div className="text-slate-100 font-semibold">{link.osnrDb.toFixed(1)} dB OSNR</div>
                          <div
                            className={`text-xs font-bold ${
                              link.marginDb >= 6.0
                                ? 'text-emerald-400'
                                : link.marginDb >= 3.0
                                ? 'text-cyan-400'
                                : 'text-amber-400'
                            }`}
                          >
                            +{link.marginDb.toFixed(1)} dB Margin
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-200 text-xs md:text-sm">
                          <div className="font-semibold">{link.bufferDepthKb} kB</div>
                          <div className={link.dropCount > 0 ? 'text-amber-400 text-xs font-bold' : 'text-slate-400 text-xs'}>
                            {link.dropCount} dropped
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded font-bold ${
                              link.status === 'LOCKED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : link.status === 'SHUTTER_HALT'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                            }`}
                          >
                            {link.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setModalTargetLink(link);
                                setModalMode('RE_ACQUIRE');
                              }}
                              title="Trigger Automated Fine-Steering Mirror Spiral Raster Scan"
                              className="px-2.5 py-1.5 rounded bg-[#0F172A] hover:bg-[#162544] text-slate-200 hover:text-emerald-300 border border-[#1E293B] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Re-Acquire
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setModalTargetLink(link);
                                setModalMode('PURGE');
                              }}
                              title="Flush Buffer FIFO and Reset Drop Accumulator"
                              className="px-2.5 py-1.5 rounded bg-[#0F172A] hover:bg-[#162544] text-slate-200 hover:text-amber-300 border border-[#1E293B] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Purge
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setModalTargetLink(link);
                                setSelectedChannel(link.wavelengthNm);
                                setModalMode('TUNE_CHANNEL');
                              }}
                              title="Tune DWDM Channel"
                              className="p-1.5 rounded bg-[#0F172A] hover:bg-[#162544] text-slate-300 hover:text-cyan-300 border border-[#1E293B] transition-colors cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT 2: ROUTING ROUTE MANIFEST */}
            {activeTab === 'ROUTING_MANIFEST' && (
              <div className="p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="p-3.5 rounded-lg bg-[#0B132B]/80 border border-[#162544] text-xs font-mono flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-100">{route.name}</span>
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                            {route.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
                          <span>Route Hash: {route.hash}</span>
                          <span className="text-slate-600">·</span>
                          <span>Hops: {route.hops}</span>
                        </div>

                        {/* Visual Path Flow */}
                        <div className="flex items-center gap-1.5 py-2 px-2.5 rounded bg-[#04060C] border border-[#1E293B] overflow-x-auto text-[11px]">
                          {route.path.map((node, i) => (
                            <React.Fragment key={`${route.id}-${node}-${i}`}>
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold ${
                                  node === 'SAT-04'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                    : 'bg-[#0F172A] text-slate-300 border border-[#1E293B]'
                                }`}
                              >
                                {node}
                              </span>
                              {i < route.path.length - 1 && (
                                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#162544] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Total Latency:{' '}
                          <span className="text-emerald-400 font-bold">{route.totalLatencyMs} ms</span>
                        </span>
                        <span className="text-slate-400">
                          Allocated Bandwidth:{' '}
                          <span className="text-slate-200 font-semibold">{route.bandwidthGbps} Gbps</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: TELECOMMAND AUDIT LOG */}
            {activeTab === 'PAT_LOGS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#04060C] text-slate-400 border-b border-[#162544]">
                      <th className="py-2.5 px-4 font-semibold">TIMESTAMP (UTC)</th>
                      <th className="py-2.5 px-3 font-semibold">TERMINAL / BAY</th>
                      <th className="py-2.5 px-3 font-semibold">COMMAND IDENTIFIER</th>
                      <th className="py-2.5 px-3 font-semibold">ORIGINATOR</th>
                      <th className="py-2.5 px-3 font-semibold">EXECUTION STATUS</th>
                      <th className="py-2.5 px-4 font-semibold">TELEMETRY RESPONSE DETAIL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162544]">
                    {logs.map((lg) => (
                      <tr key={lg.id} className="hover:bg-[#0B132B]/50 transition-colors">
                        <td className="py-2.5 px-4 text-slate-400">{lg.timestamp.substring(11, 19)} UTC</td>
                        <td className="py-2.5 px-3 text-cyan-400 font-medium">{lg.terminal}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-200">{lg.command}</td>
                        <td className="py-2.5 px-3 text-slate-400">{lg.origin}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {lg.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-300 text-[11px]">{lg.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {/* ========================================================================= */}
        {/* INTERACTIVE MODALS                                                       */}
        {/* ========================================================================= */}

        {/* Modal 1: Re-Acquire Beacon (Fine-Steering Raster Scan) */}
        {modalMode === 'RE_ACQUIRE' && modalTargetLink && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#080D1A] border border-[#162544] rounded-xl max-w-md w-full p-5 shadow-2xl text-mono">
              <div className="flex items-center justify-between border-b border-[#162544] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold font-mono text-slate-100 uppercase">
                    PAT SPIRAL RASTER SEARCH // {modalTargetLink.identifier}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-mono text-slate-300 flex flex-col gap-3 mb-4">
                <p>
                  Target Spacecraft: <span className="text-cyan-400 font-bold">{modalTargetLink.targetSatCode}</span> (Plane {modalTargetLink.targetPlane})
                </p>
                <div className="p-3 rounded bg-[#04060C] border border-[#1E293B] flex flex-col gap-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Search Cone Envelope:</span>
                    <span className="text-slate-200">±2.5 mrad spiral</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Detector Threshold:</span>
                    <span className="text-slate-200">-34.0 dBm beacon SNR</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Piezo Bandwidth:</span>
                    <span className="text-emerald-400">5.2 kHz closed loop</span>
                  </div>
                </div>

                {rasterScanning && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-emerald-400 animate-pulse">Executing Spiral Sweep...</span>
                      <span>{rasterProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded transition-all duration-300"
                        style={{ width: `${rasterProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#162544] pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  disabled={rasterScanning}
                  className="px-3 py-1.5 rounded bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartRasterScan}
                  disabled={rasterScanning}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {rasterScanning ? 'Scanning...' : 'Execute Raster Scan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Purge Buffer Queue */}
        {modalMode === 'PURGE' && modalTargetLink && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#080D1A] border border-[#162544] rounded-xl max-w-md w-full p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#162544] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold font-mono text-slate-100 uppercase">
                    PURGE BUFFER QUEUE // {modalTargetLink.identifier}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-mono text-slate-300 flex flex-col gap-3 mb-4">
                <p>
                  Confirm optical packet queue flush for head{' '}
                  <span className="text-cyan-400 font-bold">{modalTargetLink.identifier}</span>?
                </p>
                <div className="p-3 rounded bg-[#04060C] border border-[#1E293B] flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Queue Depth:</span>
                    <span className="text-slate-100 font-bold">{modalTargetLink.bufferDepthKb} kB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accumulated Drops:</span>
                    <span className="text-amber-400 font-bold">{modalTargetLink.dropCount} packets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Action:</span>
                    <span className="text-emerald-400">FIFO Flush & Jitter Re-Sync</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#162544] pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="px-3 py-1.5 rounded bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPurgeQueue}
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
                >
                  Flush Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: DWDM Channel Tune */}
        {modalMode === 'TUNE_CHANNEL' && modalTargetLink && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#080D1A] border border-[#162544] rounded-xl max-w-md w-full p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#162544] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold font-mono text-slate-100 uppercase">
                    DWDM WAVELENGTH TUNING // {modalTargetLink.identifier}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-mono text-slate-300 flex flex-col gap-3 mb-4">
                <p>Select ITU-T G.694.1 100 GHz Grid Optical Carrier:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[1550.12, 1550.52, 1550.92, 1551.32].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setSelectedChannel(ch)}
                      className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                        selectedChannel === ch
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                          : 'bg-[#04060C] border-[#1E293B] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold">{ch} nm</div>
                      <div className="text-[10px] text-slate-500">
                        {parseFloat((299792.458 / ch).toFixed(2))} THz
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#162544] pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="px-3 py-1.5 rounded bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyChannel}
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
                >
                  Apply Carrier Channel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Deep Orbit Spacecraft Detail */}
        {modalMode === 'SAT_DETAIL' && selectedSatellite && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#080D1A] border border-[#162544] rounded-xl max-w-lg w-full p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#162544] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold font-mono text-slate-100 uppercase">
                    SPACECRAFT ORBITAL DOSSIER // {selectedSatellite.code}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs font-mono text-slate-300 flex flex-col gap-3 mb-4">
                <div className="grid grid-cols-2 gap-2 p-3 rounded bg-[#04060C] border border-[#1E293B]">
                  <div>
                    <span className="text-slate-500 block">Orbital Plane:</span>
                    <span className="text-slate-100 font-bold">Plane {selectedSatellite.plane} (RAAN {selectedSatellite.raanDeg}°)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Plane Slot:</span>
                    <span className="text-slate-100 font-bold">Slot {selectedSatellite.slot} of 3</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Semimajor Axis:</span>
                    <span className="text-slate-100 font-bold">6,928.14 km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Inclination:</span>
                    <span className="text-slate-100 font-bold">97.40° Sun-Synchronous</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Orbital Period:</span>
                    <span className="text-slate-100 font-bold">95.6 minutes (15.06 rev/day)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Relative Velocity:</span>
                    <span className="text-emerald-400 font-bold">7.59 km/s</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0B132B] border border-[#162544] text-[11px] text-slate-400">
                  <div className="text-slate-300 font-bold mb-1">Payload Complement:</div>
                  <div>· 4x Coherent Optical Intersatellite Link (ISL) Transceivers (1550nm)</div>
                  <div>· 2-Stage Erbium-Doped Fiber Amplifier (EDFA) 5W Optical Head</div>
                  <div>· Fast Steering Mirror (FSM) Piezo Stage (5.2 kHz closed-loop tracking)</div>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-[#162544] pt-3">
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SatLaserISLDeck;
