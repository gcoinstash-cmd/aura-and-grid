/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  Compass,
  Crosshair,
  Database,
  Download,
  Flame,
  Gauge,
  Layers,
  Lock,
  Orbit,
  Pause,
  Play,
  Power,
  Radio,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ThermometerSnowflake,
  Timer,
  Unlock,
  Wifi,
  WifiOff,
  Zap,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

// --- Domain Interfaces ---
export interface PayloadItem {
  id: string;
  canisterCode: string;
  material: string;
  massKg: number;
  destination: 'L2 Lagrange Transfer' | 'Low Lunar Orbit Depot' | 'Earth Transfer Trajectory';
  launchAzimuthDeg: number;
  apoapsisTargetKm: number;
  targetVelocityMs: number;
  releaseAccuracyMs: number;
  bucketStatus: 'READY' | 'ARRESTED' | 'IN_TRANSIT' | 'RECAPTURED';
  status: 'QUEUED' | 'PRIMED' | 'ACCELERATING' | 'INJECTED' | 'ABORTED';
  scheduledTime: string;
}

export interface TelemetryData {
  exitVelocityMs: number;
  statorPeakCurrentKa: number;
  capacitorEnergyMj: number;
  capacitorChargePct: number;
  barrelCryoTempK: number;
  levitationGapMm: number;
  pfnVoltageKv: number;
  htsResistanceMicroohms: number;
  cryocoolerDeltaPKpa: number;
  eddyThermalDissipationKw: number;
  bucketClearanceGaps: [number, number, number, number]; // [Bow, Stern, Port, Starboard]
  trackVacuumTorr: number;
}

export interface StatorStage {
  index: number;
  positionMeters: number;
  currentKa: number;
  tempK: number;
  active: boolean;
  fluxT: number;
}

// Preset orbital target configurations
export const ORBITAL_TARGETS = {
  'Earth Transfer Trajectory': {
    deltaVMs: 1682.4,
    azimuthDeg: 45.2,
    apoapsisKm: 384400,
    transitTime: '4.2 Days to High Earth Orbit',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/50 text-cyan-300',
    tagBg: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200',
  },
  'Low Lunar Orbit Depot': {
    deltaVMs: 1678.8,
    azimuthDeg: 90.0,
    apoapsisKm: 100,
    transitTime: '118 Min Orbital Insertion',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-emerald-300',
    tagBg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200',
  },
  'L2 Lagrange Transfer': {
    deltaVMs: 1684.1,
    azimuthDeg: 182.4,
    apoapsisKm: 64500,
    transitTime: '36 Hours to Gateway Station',
    color: 'from-purple-500/20 to-violet-500/10 border-purple-500/50 text-purple-300',
    tagBg: 'bg-purple-950/80 border-purple-500/60 text-purple-200',
  },
};

const INITIAL_PAYLOADS: PayloadItem[] = [
  {
    id: 'p-01',
    canisterCode: 'LOAD-REG-01',
    material: 'Sintered Iron Regolith Armor Tiles',
    massKg: 250,
    destination: 'Earth Transfer Trajectory',
    launchAzimuthDeg: 45.2,
    apoapsisTargetKm: 384400,
    targetVelocityMs: 1682.4,
    releaseAccuracyMs: 0.012,
    bucketStatus: 'RECAPTURED',
    status: 'INJECTED',
    scheduledTime: '01:15:00 UTC',
  },
  {
    id: 'p-02',
    canisterCode: 'LOAD-REG-02',
    material: 'Purified Volatile Water-Ice Cylinders',
    massKg: 250,
    destination: 'Low Lunar Orbit Depot',
    launchAzimuthDeg: 90.0,
    apoapsisTargetKm: 100,
    targetVelocityMs: 1678.8,
    releaseAccuracyMs: 0.009,
    bucketStatus: 'RECAPTURED',
    status: 'INJECTED',
    scheduledTime: '01:22:30 UTC',
  },
  {
    id: 'p-03',
    canisterCode: 'LOAD-REG-03',
    material: 'Refined Ilmenite / High-Titanium Feedstock',
    massKg: 250,
    destination: 'L2 Lagrange Transfer',
    launchAzimuthDeg: 182.4,
    apoapsisTargetKm: 64500,
    targetVelocityMs: 1684.1,
    releaseAccuracyMs: 0.015,
    bucketStatus: 'RECAPTURED',
    status: 'INJECTED',
    scheduledTime: '01:30:00 UTC',
  },
  {
    id: 'p-04',
    canisterCode: 'LOAD-REG-04',
    material: 'Anorthosite Lunar Glass Structural Rods',
    massKg: 250,
    destination: 'Low Lunar Orbit Depot',
    launchAzimuthDeg: 90.0,
    apoapsisTargetKm: 100,
    targetVelocityMs: 1678.8,
    releaseAccuracyMs: 0.011,
    bucketStatus: 'RECAPTURED',
    status: 'INJECTED',
    scheduledTime: '01:37:30 UTC',
  },
  {
    id: 'p-05',
    canisterCode: 'LOAD-REG-05',
    material: 'Cryogenic Liquid Oxygen Pressure Sphere',
    massKg: 250,
    destination: 'L2 Lagrange Transfer',
    launchAzimuthDeg: 182.4,
    apoapsisTargetKm: 64500,
    targetVelocityMs: 1684.1,
    releaseAccuracyMs: 0.014,
    bucketStatus: 'RECAPTURED',
    status: 'INJECTED',
    scheduledTime: '01:45:00 UTC',
  },
  {
    id: 'p-06',
    canisterCode: 'LOAD-REG-06',
    material: 'Solid State Silicon Monoxide Crystals',
    massKg: 250,
    destination: 'Earth Transfer Trajectory',
    launchAzimuthDeg: 45.2,
    apoapsisTargetKm: 384400,
    targetVelocityMs: 1682.4,
    releaseAccuracyMs: 0.008,
    bucketStatus: 'READY',
    status: 'PRIMED',
    scheduledTime: '02:45:00 UTC',
  },
  {
    id: 'p-07',
    canisterCode: 'LOAD-REG-07',
    material: 'Sintered Regolith Habitat Bulkheads',
    massKg: 250,
    destination: 'Low Lunar Orbit Depot',
    launchAzimuthDeg: 90.0,
    apoapsisTargetKm: 100,
    targetVelocityMs: 1678.8,
    releaseAccuracyMs: 0.016,
    bucketStatus: 'READY',
    status: 'QUEUED',
    scheduledTime: '02:45:45 UTC',
  },
  {
    id: 'p-08',
    canisterCode: 'LOAD-REG-08',
    material: 'Refined Rare Earth Metallurgical Ingots',
    massKg: 250,
    destination: 'Earth Transfer Trajectory',
    launchAzimuthDeg: 45.2,
    apoapsisTargetKm: 384400,
    targetVelocityMs: 1682.4,
    releaseAccuracyMs: 0.010,
    bucketStatus: 'READY',
    status: 'QUEUED',
    scheduledTime: '02:46:30 UTC',
  },
];

export function LunarMassDriverControl() {
  // Operational role
  const [role, setRole] = useState<'COMMANDER' | 'FIELD_ENG' | 'CRYO_SPEC'>('COMMANDER');
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'CONTROL_DECK' | 'PFN_DIAGNOSTICS' | 'MANIFEST_LEDGER'>('CONTROL_DECK');

  // Emergency Abort Keyed Switch
  const [abortArmed, setAbortArmed] = useState(false);
  const [emergencyDumpTriggered, setEmergencyDumpTriggered] = useState(false);
  const [arrestorNetDeployed, setArrestorNetDeployed] = useState(false);

  // Selected trajectory & elevation
  const [selectedDestination, setSelectedDestination] = useState<
    'Earth Transfer Trajectory' | 'Low Lunar Orbit Depot' | 'L2 Lagrange Transfer'
  >('Earth Transfer Trajectory');
  const [launchElevationAngle, setLaunchElevationAngle] = useState<number>(7.4); // degrees above Shackleton horizon

  // Launch cadence & countdown
  const [cadenceSeconds] = useState(45);
  const [countdownSeconds, setCountdownSeconds] = useState(38);
  const [autoCadenceActive, setAutoCadenceActive] = useState(true);

  // Launch Simulation State
  const [launchPhase, setLaunchPhase] = useState<'IDLE' | 'CHARGING' | 'FIRING_WAVE' | 'OPTICAL_SEPARATION' | 'BUCKET_DECEL'>('IDLE');
  const [carrierPositionMeters, setCarrierPositionMeters] = useState(0); // 0 to 1200m
  const [currentCarrierVelocity, setCurrentCarrierVelocity] = useState(0); // m/s
  const [activeWaveStage, setActiveWaveStage] = useState(0); // 0 to 120
  const [logMessages, setLogMessages] = useState<Array<{ id: string; time: string; text: string; type: 'info' | 'warn' | 'success' | 'alert' }>>([
    { id: '1', time: '02:42:01.012', text: '120 HTS stator coils at 4.200 K. Meissner levitation lock verified.', type: 'info' },
    { id: '2', time: '02:42:05.420', text: 'PFN Marx bank voltage at 25.01 kV. Capacitive bank 98.2% primed.', type: 'info' },
    { id: '3', time: '02:42:15.918', text: 'Optical muzzle trigger gate synced to 14ns latency datum.', type: 'success' },
  ]);

  // Manifest items state
  const [payloads, setPayloads] = useState<PayloadItem[]>(INITIAL_PAYLOADS);
  const [searchFilter, setSearchFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('ALL');

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authKeyInput, setAuthKeyInput] = useState('CATAPULT-SHACKLETON-89S-01');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeStep, setPurgeStep] = useState(0);

  // Telemetry core numbers
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    exitVelocityMs: 1682.4,
    statorPeakCurrentKa: 84.5,
    capacitorEnergyMj: 412.44, // 98.2% of 420 MJ
    capacitorChargePct: 98.2,
    barrelCryoTempK: 4.201,
    levitationGapMm: 4.5,
    pfnVoltageKv: 25.0,
    htsResistanceMicroohms: 0.0,
    cryocoolerDeltaPKpa: 142.5,
    eddyThermalDissipationKw: 18.4,
    bucketClearanceGaps: [4.51, 4.49, 4.5, 4.5],
    trackVacuumTorr: 1.2e-11,
  });

  // Track stages array (120 stages representation)
  const statorStages = useMemo<StatorStage[]>(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const idx = i + 1;
      const pos = idx * 10;
      return {
        index: idx,
        positionMeters: pos,
        currentKa: idx <= activeWaveStage ? 84.5 * Math.exp(-0.01 * (activeWaveStage - idx)) : 0,
        tempK: 4.195 + (idx % 5) * 0.005,
        active: Math.abs(idx - activeWaveStage) <= 3 && activeWaveStage > 0,
        fluxT: idx <= activeWaveStage ? 17.1 : 0.05,
      };
    });
  }, [activeWaveStage]);

  // PFN Discharge waveform live sample
  const pfnVoltageCurvePoints = useMemo(() => {
    // Generate realistic 25kV Marx pulse discharge curve (0 to 10 microseconds)
    const points: string[] = [];
    const width = 360;
    const height = 110;
    for (let x = 0; x <= width; x += 6) {
      const t = (x / width) * 10; // microseconds
      let v = 0;
      if (t < 0.8) {
        v = (t / 0.8) * 25.0; // steep rise
      } else if (t < 2.0) {
        v = 25.0 - (t - 0.8) * 1.5; // flat top with slight droop
      } else {
        v = Math.max(0, 23.2 * Math.exp(-0.45 * (t - 2.0))); // LC decay
      }
      // Add slight jitter
      v += (Math.sin(x * 0.3) * 0.2);
      const y = height - (Math.max(0, v) / 28) * (height - 12);
      points.push(`${x},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  // System tick loop for live telemetry micro-variations & auto-countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        if (emergencyDumpTriggered) {
          return {
            ...prev,
            statorPeakCurrentKa: 0.0,
            capacitorEnergyMj: Math.max(0, prev.capacitorEnergyMj * 0.75),
            capacitorChargePct: Math.max(0, prev.capacitorChargePct * 0.75),
            pfnVoltageKv: Math.max(0, prev.pfnVoltageKv * 0.7),
            barrelCryoTempK: 4.25,
            eddyThermalDissipationKw: 140.0,
          };
        }

        const jitter = (Math.random() - 0.5) * 0.08;
        const currentJitter = (Math.random() - 0.5) * 0.15;
        const tempJitter = (Math.random() - 0.5) * 0.003;
        const gapJitter = (Math.random() - 0.5) * 0.02;

        let charge = prev.capacitorChargePct;
        let energy = prev.capacitorEnergyMj;

        if (charge < 98.2) {
          charge = Math.min(98.2, charge + 0.35);
          energy = (charge / 100) * 420;
        }

        return {
          ...prev,
          exitVelocityMs: Number((1682.4 + jitter).toFixed(3)),
          statorPeakCurrentKa: Number((84.5 + currentJitter).toFixed(2)),
          capacitorChargePct: Number(charge.toFixed(2)),
          capacitorEnergyMj: Number(energy.toFixed(2)),
          barrelCryoTempK: Number(Math.max(4.18, 4.2 + tempJitter).toFixed(3)),
          levitationGapMm: Number((4.5 + gapJitter).toFixed(2)),
          htsResistanceMicroohms: 0.0,
          cryocoolerDeltaPKpa: Number((142.5 + jitter * 2).toFixed(1)),
          eddyThermalDissipationKw: Number((18.4 + (Math.random() - 0.5) * 0.3).toFixed(2)),
          bucketClearanceGaps: [
            Number((4.5 + (Math.random() - 0.5) * 0.03).toFixed(2)),
            Number((4.5 + (Math.random() - 0.5) * 0.03).toFixed(2)),
            Number((4.5 + (Math.random() - 0.5) * 0.03).toFixed(2)),
            Number((4.5 + (Math.random() - 0.5) * 0.03).toFixed(2)),
          ],
        };
      });

      // Countdown handling
      if (autoCadenceActive && !emergencyDumpTriggered && launchPhase === 'IDLE') {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            triggerAutomatedLaunch();
            return cadenceSeconds;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [emergencyDumpTriggered, launchPhase, autoCadenceActive, cadenceSeconds]);

  // High-Speed Firing Animation Tick Loop
  const launchPhaseRef = useRef(launchPhase);
  launchPhaseRef.current = launchPhase;

  const triggerAutomatedLaunch = useCallback(() => {
    if (emergencyDumpTriggered) return;
    setLaunchPhase('FIRING_WAVE');
    setCarrierPositionMeters(0);
    setCurrentCarrierVelocity(100);
    setActiveWaveStage(1);

    addLog('Launch authorization token verified. Optical gate trigger engaged.', 'info');
    addLog(`Traveling magnetic wave initiated across 120 stator stages at 84.5 kA.`, 'info');

    let currentStage = 1;
    let pos = 0;
    let vel = 120;

    const fireInterval = setInterval(() => {
      currentStage += 4;
      pos = (currentStage / 120) * 1200;
      vel = Math.min(1682.4, 120 + Math.pow(currentStage / 120, 1.8) * (1682.4 - 120));

      setActiveWaveStage(currentStage);
      setCarrierPositionMeters(Math.min(1200, pos));
      setCurrentCarrierVelocity(Number(vel.toFixed(1)));

      if (currentStage >= 118) {
        clearInterval(fireInterval);
        setLaunchPhase('OPTICAL_SEPARATION');
        setActiveWaveStage(120);
        setCarrierPositionMeters(1200);
        setCurrentCarrierVelocity(1682.4);

        addLog(`Muzzle Exit: Payload released at 1,682.4 m/s. Dispersion ±0.011 m/s.`, 'success');

        // Transition to bucket deceleration
        setTimeout(() => {
          setLaunchPhase('BUCKET_DECEL');
          addLog(`Optical lock confirmed payload injection to ${selectedDestination}.`, 'success');
          addLog(`Reverse eddy-current brake caught carrier bucket in arrestor loop.`, 'info');

          // Update active payload in manifest
          setPayloads((prev) => {
            const primedIndex = prev.findIndex((p) => p.status === 'PRIMED');
            if (primedIndex !== -1) {
              const updated = [...prev];
              updated[primedIndex] = {
                ...updated[primedIndex],
                status: 'INJECTED',
                bucketStatus: 'RECAPTURED',
              };
              // Prime next queued
              const nextQueued = updated.findIndex((p) => p.status === 'QUEUED');
              if (nextQueued !== -1) {
                updated[nextQueued] = {
                  ...updated[nextQueued],
                  status: 'PRIMED',
                };
              }
              return updated;
            }
            return prev;
          });

          // Discharge capacitor bank and start recharge
          setTelemetry((t) => ({
            ...t,
            capacitorChargePct: 35.0,
            capacitorEnergyMj: 147.0,
          }));

          // Reset to IDLE after recovery
          setTimeout(() => {
            setLaunchPhase('IDLE');
            setActiveWaveStage(0);
            setCarrierPositionMeters(0);
            setCurrentCarrierVelocity(0);
            addLog(`Carrier bucket returned to Track 01 staging rail. Ready for next canister.`, 'info');
          }, 3500);
        }, 1200);
      }
    }, 65);
  }, [emergencyDumpTriggered, selectedDestination]);

  // Logging helper
  const addLog = (text: string, type: 'info' | 'warn' | 'success' | 'alert') => {
    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(now.getUTCMilliseconds()).padStart(3, '0')}`;
    setLogMessages((prev) => [{ id: String(Date.now() + Math.random()), time: timeStr, text, type }, ...prev.slice(0, 19)]);
  };

  // Emergency Dump Execution
  const triggerEmergencyAbort = () => {
    if (!abortArmed && !emergencyDumpTriggered) {
      setAbortArmed(true);
      addLog('WARNING: Emergency abort guard opened. Magnet dump switch ARMED.', 'warn');
      return;
    }

    if (!emergencyDumpTriggered) {
      setEmergencyDumpTriggered(true);
      setArrestorNetDeployed(true);
      setLaunchPhase('IDLE');
      setActiveWaveStage(0);
      setAutoCadenceActive(false);
      addLog('CRITICAL: KEYED ABORT MAGNET DUMP ACTIVATED. Rapid quench resistors online.', 'alert');
      addLog('Arrestor net fired across decelerator zone. 420 MJ dumped to cryogenic sink.', 'alert');
    } else {
      // Reset
      setEmergencyDumpTriggered(false);
      setArrestorNetDeployed(false);
      setAbortArmed(false);
      setTelemetry((prev) => ({
        ...prev,
        capacitorChargePct: 15.0,
        capacitorEnergyMj: 63.0,
        barrelCryoTempK: 4.201,
        pfnVoltageKv: 25.0,
        statorPeakCurrentKa: 84.5,
      }));
      addLog('System interlocks reset. Commencing slow cryogenic purge and recharge.', 'info');
    }
  };

  // Quick Action: Charge PFN Banks
  const handleRapidCharge = () => {
    addLog('PFN Rapid charge override initiated. 18 MW auxiliary bus connected.', 'info');
    setTelemetry((prev) => ({
      ...prev,
      capacitorChargePct: 99.8,
      capacitorEnergyMj: 419.16,
    }));
  };

  // Quick Action: Purge Levitation Guides
  const startTrackPurge = () => {
    setShowPurgeModal(true);
    setPurgeStep(1);
    setTimeout(() => setPurgeStep(2), 1000);
    setTimeout(() => setPurgeStep(3), 2200);
    setTimeout(() => {
      setPurgeStep(4);
      addLog('1,200m Track levitation guides purged. Cryosorption panels clear of lunar dust.', 'success');
      setTimeout(() => setShowPurgeModal(false), 900);
    }, 3400);
  };

  // Quick Action: Authorize Launch
  const handleAuthorizeCycle = () => {
    setShowAuthModal(false);
    addLog(`Launch cycle manually authorized by ${role} with key token.`, 'success');
    triggerAutomatedLaunch();
  };

  // Export Manifest & Telemetry Report (EOD Summary)
  const exportTelemetryManifestReport = () => {
    const reportData = {
      facility: 'SHACKLETON POLAR CATAPULT // E-LAUNCH MASS DRIVER TRACK 01',
      coordinates: '89.9000° S, 0.0000° E (Shackleton Rim Connecting Ridge)',
      exportTimestamp: new Date().toISOString(),
      statorLengthMeters: 1200,
      statorCoilStages: 120,
      activeTarget: selectedDestination,
      elevationAngleDeg: launchElevationAngle,
      currentTelemetry: telemetry,
      manifestHistory: payloads,
      systemStatus: emergencyDumpTriggered ? 'EMERGENCY_DUMP' : 'OPERATIONAL_NOMINAL',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPC-TRACK01-TELEMETRY-EOD-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Automated End-Of-Day Telemetry Ledger exported successfully.', 'info');
  };

  // Filtered payloads
  const filteredPayloads = useMemo(() => {
    return payloads.filter((p) => {
      const matchText = p.canisterCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.material.toLowerCase().includes(searchFilter.toLowerCase());
      const matchDest = destinationFilter === 'ALL' || p.destination === destinationFilter;
      return matchText && matchDest;
    });
  }, [payloads, searchFilter, destinationFilter]);

  return (
    <>
      <div className="min-h-screen bg-[#03050C] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* ==================================================================== */}
        {/* TOP STATUS BAR & FACILITY CHASSIS HEADER */}
        {/* ==================================================================== */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-3">
          <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Unified Facility Header Alignment */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-cyan-950/70 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0">
                <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100">
                    SHACKLETON POLAR CATAPULT
                  </h1>
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                    TRACK 01 // E-LAUNCH
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                  <span>GEO: 89.9000° S, 0.0000° E</span>
                  <span>•</span>
                  <span>1,200m SUPERCONDUCTING BORE</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">
                    STATUS: {emergencyDumpTriggered ? 'ABORT DUMP ACTIVE' : 'NOMINAL'}
                  </span>
                </p>
              </div>
            </div>

            {/* Single-Row Utility Action Ribbon */}
            <div className="flex flex-wrap items-center gap-2.5 mt-2 xl:mt-0">
              {/* Role Switcher */}
              <div className="h-8 md:h-9 flex items-center bg-[#0F172A] border border-slate-700/80 rounded-md px-1">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 px-1.5 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  ROLE:
                </span>
                {(['COMMANDER', 'FIELD_ENG', 'CRYO_SPEC'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`h-6 md:h-7 px-2.5 text-xs font-mono font-bold rounded flex items-center justify-center transition-colors ${
                      role === r
                        ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r === 'COMMANDER' ? 'CMD' : r === 'FIELD_ENG' ? 'ENG' : 'CRYO'}
                  </button>
                ))}
              </div>

              {/* Offline / Online Sync Tag */}
              <div
                onClick={() => setIsOnline(!isOnline)}
                className={`h-8 md:h-9 cursor-pointer px-2.5 rounded-md border flex items-center gap-1.5 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all ${
                  isOnline
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                }`}
                title="Click to toggle simulated Earth telemetry downlink"
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isOnline ? 'DOWNLINK: LIVE (0.08ms)' : 'LOCAL CACHED'}</span>
              </div>

              {/* Export Report Button */}
              <button
                onClick={exportTelemetryManifestReport}
                className="h-8 md:h-9 px-3 rounded-md bg-[#111827] hover:bg-[#1E293B] border border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase flex items-center gap-1.5 whitespace-nowrap transition-all shadow hover:shadow-cyan-900/20 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPORT EOD</span>
              </button>
            </div>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* PANE 1: TOP ELECTROMAGNETIC ACCELERATION HUD (6 Large Metric Cards) */}
        {/* ==================================================================== */}
        <section className="px-4 md:px-6 py-4 bg-[#070B13] border-b border-slate-800/80">
          <div className="max-w-[1720px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Metric 1: Exit Velocity */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    EXIT VELOCITY
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                    TARGET
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline gap-1">
                    {telemetry.exitVelocityMs.toFixed(1)}
                    <span className="text-xs md:text-sm font-mono font-normal text-slate-400">m/s</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-cyan-400/90 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span>LUNAR INJECTION</span>
                  <span className="text-emerald-400 font-bold">±0.02 m/s ACC</span>
                </div>
              </div>

              {/* Metric 2: Stator Peak Current */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-violet-400" />
                    STATOR CURRENT
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-800 text-violet-300">
                    PEAK
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline gap-1">
                    {telemetry.statorPeakCurrentKa.toFixed(1)}
                    <span className="text-xs md:text-sm font-mono font-normal text-slate-400">kA</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-violet-400/90 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span>120-STAGE SYNC</span>
                  <span className="text-slate-300">17.15 TESLA</span>
                </div>
              </div>

              {/* Metric 3: Capacitor Bank Energy */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-amber-400" />
                    CAPACITOR BANK
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                    420 MJ
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline gap-1">
                    {telemetry.capacitorEnergyMj.toFixed(0)}
                    <span className="text-xs md:text-sm font-mono font-normal text-slate-400">MJ</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden my-0.5">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, telemetry.capacitorChargePct)}%` }}
                  ></div>
                </div>
                <div className="text-[11px] font-mono text-amber-400/90 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span>{telemetry.capacitorChargePct.toFixed(1)}% PRIMED</span>
                  <button
                    onClick={handleRapidCharge}
                    className="text-[10px] text-cyan-300 hover:text-cyan-100 underline decoration-cyan-500/60"
                  >
                    RAPID CHARGE
                  </button>
                </div>
              </div>

              {/* Metric 4: Launch Cadence & Shot Clock */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-emerald-400" />
                    CADENCE
                  </span>
                  <button
                    onClick={() => setAutoCadenceActive(!autoCadenceActive)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      autoCadenceActive
                        ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    {autoCadenceActive ? 'AUTO ON' : 'PAUSED'}
                  </button>
                </div>
                <div className="my-1.5 flex items-baseline justify-between">
                  <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    T-{String(countdownSeconds).padStart(2, '0')}
                    <span className="text-xs md:text-sm font-mono font-normal text-slate-400">s</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">45s CYCLE</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400/90 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span>1 LOAD / 45s</span>
                  <span className="text-slate-300">80 CANISTERS/HR</span>
                </div>
              </div>

              {/* Metric 5: Barrel Cryo Temp */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                    BARREL CRYO
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300">
                    LHe BATH
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline gap-1">
                    {telemetry.barrelCryoTempK.toFixed(3)}
                    <span className="text-xs md:text-sm font-mono font-normal text-slate-400">K</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                  <span>SUPERCONDUCTING</span>
                  <span className="text-emerald-400">0.000 µΩ</span>
                </div>
              </div>

              {/* Metric 6: Emergency Keyed Toggle Switch */}
              <div
                className={`rounded-lg p-3.5 shadow relative overflow-hidden flex flex-col justify-between min-h-[154px] md:min-h-[160px] h-full border transition-all ${
                  emergencyDumpTriggered
                    ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : abortArmed
                    ? 'bg-amber-950/70 border-amber-500 text-amber-100'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 text-rose-300">
                    <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                    MAGNET DUMP
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      emergencyDumpTriggered
                        ? 'bg-rose-500 text-black animate-pulse'
                        : abortArmed
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {emergencyDumpTriggered ? 'DUMP ACTIVE' : abortArmed ? 'KEY ARMED' : 'SAFE'}
                  </span>
                </div>

                <div className="my-1.5 flex items-center gap-2">
                  <button
                    onClick={triggerEmergencyAbort}
                    className={`w-full py-2 px-3 rounded font-mono font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                      emergencyDumpTriggered
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                        : abortArmed
                        ? 'bg-rose-700 hover:bg-rose-600 text-white animate-bounce'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {emergencyDumpTriggered ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        RESET INTERLOCKS
                      </>
                    ) : abortArmed ? (
                      <>
                        <Flame className="w-4 h-4" />
                        CONFIRM MAGNET DUMP
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        ARM ABORT KEY
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] font-mono flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-slate-400">
                  <span>ARRESTOR NET</span>
                  <span className={arrestorNetDeployed ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {arrestorNetDeployed ? 'DEPLOYED' : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation for Desktop / Tablet */}
        <div className="border-b border-slate-800 bg-[#0B0F17] px-4 md:px-6">
          <div className="max-w-[1720px] mx-auto flex gap-2">
            <button
              onClick={() => setActiveTab('CONTROL_DECK')}
              className={`py-3 px-4 text-xs md:text-sm font-bold font-mono tracking-wider uppercase border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'CONTROL_DECK'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              ACCELERATION RAIL CANVAS & FIRING CONTROLS
            </button>
            <button
              onClick={() => setActiveTab('PFN_DIAGNOSTICS')}
              className={`py-3 px-4 text-xs md:text-sm font-bold font-mono tracking-wider uppercase border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'PFN_DIAGNOSTICS'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              PULSE POWER & SUPERCONDUCTOR DIAGNOSTICS
            </button>
            <button
              onClick={() => setActiveTab('MANIFEST_LEDGER')}
              className={`py-3 px-4 text-xs md:text-sm font-bold font-mono tracking-wider uppercase border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'MANIFEST_LEDGER'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              REGOLITH MANIFEST & ORBITAL INJECTION LEDGER
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CENTER DECKS: SPLIT VIEW (2D Rail Canvas + Diagnostics) */}
        {/* ==================================================================== */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 md:p-6 space-y-6">
          {(activeTab === 'CONTROL_DECK' || activeTab === 'PFN_DIAGNOSTICS') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ================================================================ */}
              {/* PANE 2: CENTER-LEFT 2D MASS DRIVER RAIL & BUCKET ACCELERATION CANVAS */}
              {/* ================================================================ */}
              <div
                className={`bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl ${
                  activeTab === 'CONTROL_DECK' ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/80 gap-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      1,200M MASS DRIVER ACCELERATOR // HORIZONTAL CROSS-SECTION
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      120 Pulsed Coil Stages • Optical Separation at 1,198m • Eddy-Current Recovery Loop
                    </p>
                  </div>

                  {/* Firing Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                        launchPhase === 'FIRING_WAVE'
                          ? 'bg-violet-950/80 border-violet-500 text-violet-200 animate-pulse'
                          : launchPhase === 'OPTICAL_SEPARATION'
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 animate-ping'
                          : launchPhase === 'BUCKET_DECEL'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                          : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      PHASE: {launchPhase}
                    </span>
                    <button
                      onClick={triggerAutomatedLaunch}
                      disabled={launchPhase !== 'IDLE' || emergencyDumpTriggered}
                      className="px-3.5 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      FIRE NOW
                    </button>
                  </div>
                </div>

                {/* Interactive SVG Cross-Section */}
                <div className="my-5 bg-[#03050C] border border-slate-800 rounded-lg p-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
                    <span>STAGE 001 (BREECH 0m)</span>
                    <span className="text-cyan-400 font-bold">
                      CARRIER POS: {carrierPositionMeters.toFixed(0)}m / 1,200m
                    </span>
                    <span className="text-violet-400 font-bold">
                      VELOCITY: {currentCarrierVelocity.toFixed(1)} m/s
                    </span>
                    <span>STAGE 120 (MUZZLE 1,200m)</span>
                  </div>

                  <svg
                    viewBox="0 0 1000 220"
                    className="w-full h-48 md:h-56 select-none bg-radial from-slate-900/60 to-[#03050C]"
                  >
                    {/* Definitions for gradients & glow */}
                    <defs>
                      <linearGradient id="boreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B132B" />
                        <stop offset="70%" stopColor="#1C2541" />
                        <stop offset="100%" stopColor="#3A506B" />
                      </linearGradient>
                      <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Vacuum Tube Bore Housing */}
                    <rect x="20" y="55" width="940" height="90" rx="6" fill="url(#boreGradient)" stroke="#1E293B" strokeWidth="2" />

                    {/* Cryogenic cooling jackets (top & bottom rails) */}
                    <line x1="20" y1="58" x2="960" y2="58" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 3" opacity="0.6" />
                    <line x1="20" y1="142" x2="960" y2="142" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 3" opacity="0.6" />

                    {/* Stator Coils (120 stages rendered systematically) */}
                    {Array.from({ length: 40 }).map((_, idx) => {
                      const x = 30 + idx * 23;
                      const stageNum = idx * 3 + 1;
                      const isFiring = Math.abs(stageNum - activeWaveStage) <= 4 && activeWaveStage > 0;
                      return (
                        <g key={idx}>
                          {/* Top Coil Pole */}
                          <rect
                            x={x}
                            y="40"
                            width="14"
                            height="20"
                            rx="2"
                            fill={isFiring ? '#06b6d4' : '#1e293b'}
                            stroke={isFiring ? '#67e8f9' : '#334155'}
                            strokeWidth="1.5"
                            className="transition-colors duration-100"
                            filter={isFiring ? 'url(#glowEffect)' : undefined}
                          />
                          {/* Bottom Coil Pole */}
                          <rect
                            x={x}
                            y="140"
                            width="14"
                            height="20"
                            rx="2"
                            fill={isFiring ? '#06b6d4' : '#1e293b'}
                            stroke={isFiring ? '#67e8f9' : '#334155'}
                            strokeWidth="1.5"
                            className="transition-colors duration-100"
                            filter={isFiring ? 'url(#glowEffect)' : undefined}
                          />
                          {/* Tick markers */}
                          {idx % 5 === 0 && (
                            <text x={x + 7} y="32" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                              {stageNum}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Levitation Center Axis Guide Line */}
                    <line x1="25" y1="100" x2="955" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Dynamic Traveling Magnetic Pulse Wave Vector */}
                    {activeWaveStage > 0 && (
                      <rect
                        x={Math.max(25, ((activeWaveStage - 6) / 120) * 920 + 25)}
                        y="62"
                        width="80"
                        height="76"
                        rx="4"
                        fill="url(#waveGlow)"
                        filter="url(#glowEffect)"
                      />
                    )}

                    {/* Optical Muzzle Release Trigger Point (1,198m) */}
                    <g transform="translate(930, 48)">
                      <line x1="0" y1="0" x2="0" y2="104" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
                      <circle cx="0" cy="52" r="5" fill="#f43f5e" filter="url(#glowEffect)" />
                      <text x="-4" y="-8" fill="#fda4af" fontSize="9" fontFamily="monospace" textAnchor="end">
                        OPTICAL RELEASE (1,198m)
                      </text>
                    </g>

                    {/* Bucket Arrestor Net / Eddy Deceleration Zone */}
                    <rect x="940" y="55" width="40" height="90" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="960" y="200" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      ARRESTOR NET
                    </text>

                    {/* Magnetic Bucket Carrier and Payload Object */}
                    {(() => {
                      const carrierX = 30 + (carrierPositionMeters / 1200) * 890;
                      return (
                        <g transform={`translate(${carrierX}, 80)`}>
                          {/* Carrier Bucket Frame */}
                          <rect
                            x="-22"
                            y="0"
                            width="44"
                            height="40"
                            rx="4"
                            fill="#0F172A"
                            stroke="#06b6d4"
                            strokeWidth="2"
                            filter="url(#glowEffect)"
                          />
                          {/* Levitation Halbach magnet indicators */}
                          <circle cx="-14" cy="5" r="3" fill="#38bdf8" />
                          <circle cx="14" cy="5" r="3" fill="#38bdf8" />
                          <circle cx="-14" cy="35" r="3" fill="#38bdf8" />
                          <circle cx="14" cy="35" r="3" fill="#38bdf8" />

                          {/* Payload Canister Inside Carrier */}
                          <rect x="-12" y="8" width="24" height="24" rx="2" fill="#cbd5e1" stroke="#f59e0b" strokeWidth="1.5" />
                          <text x="0" y="24" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            250kg
                          </text>

                          {/* Velocity plume/exhaust glow when accelerating */}
                          {currentCarrierVelocity > 50 && (
                            <path
                              d="M -22 10 L -45 20 L -22 30 Z"
                              fill="#06b6d4"
                              fillOpacity="0.7"
                              filter="url(#glowEffect)"
                            />
                          )}
                        </g>
                      );
                    })()}

                    {/* Track Ruler Axis */}
                    <line x1="30" y1="180" x2="950" y2="180" stroke="#475569" strokeWidth="1.5" />
                    {[0, 300, 600, 900, 1200].map((m) => {
                      const x = 30 + (m / 1200) * 920;
                      return (
                        <g key={m}>
                          <line x1={x} y1="175" x2={x} y2="185" stroke="#94a3b8" strokeWidth="1.5" />
                          <text x={x} y="198" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                            {m}m
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Interactive Controls: Launch Angle Elevation & Orbital Destinations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Elevation Ramp Angle Slider */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-cyan-400" />
                        LAUNCH ANGLE ELEVATION
                      </span>
                      <span className="text-base font-black font-mono text-cyan-300">
                        +{launchElevationAngle.toFixed(1)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3.2"
                      max="18.5"
                      step="0.1"
                      value={launchElevationAngle}
                      onChange={(e) => setLaunchElevationAngle(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      <span>+3.2° (Grazing Orbit)</span>
                      <span>+7.4° (Nominal Polar Egress)</span>
                      <span>+18.5° (Direct Earth Transfer)</span>
                    </div>
                  </div>

                  {/* Destination Targets Selection */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200 flex items-center gap-1.5">
                        <Orbit className="w-4 h-4 text-violet-400" />
                        ORBITAL INJECTION TARGET
                      </span>
                      <span className="text-xs font-mono text-slate-400">DELTA-V LOCKED</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(ORBITAL_TARGETS) as Array<keyof typeof ORBITAL_TARGETS>).map((dest) => {
                        const isSelected = selectedDestination === dest;
                        const conf = ORBITAL_TARGETS[dest];
                        return (
                          <button
                            key={dest}
                            onClick={() => {
                              setSelectedDestination(dest);
                              addLog(`Target vector aligned to ${dest}. Target Δv: ${conf.deltaVMs} m/s.`, 'info');
                            }}
                            className={`p-2 rounded text-left border transition-all ${
                              isSelected
                                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                : 'bg-[#111827] border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                            }`}
                          >
                            <div className="text-[11px] font-mono font-bold leading-tight truncate">
                              {dest.split(' ')[0]} {dest.split(' ')[1]}
                            </div>
                            <div className="text-[10px] font-mono text-slate-300 mt-1">
                              {conf.deltaVMs} m/s
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Subsystem Live Event Ticker */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-slate-300">LATEST TELEMETRY EVENT:</span>
                    <span className="text-cyan-300 font-bold">{logMessages[0]?.text || 'Systems nominal'}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{logMessages[0]?.time}</span>
                </div>
              </div>

              {/* ================================================================ */}
              {/* PANE 3: CENTER-RIGHT PULSE POWER & CRYOGENIC SUPERCONDUCTOR DIAGNOSTICS */}
              {/* ================================================================ */}
              <div
                className={`bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl ${
                  activeTab === 'CONTROL_DECK' ? 'lg:col-span-5 xl:col-span-4' : 'lg:col-span-12'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      PFN & CRYO DIAGNOSTICS
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600 text-amber-300">
                      25.0 kV DISCHARGE
                    </span>
                  </div>

                  {/* Marx Generator & PFN Waveform SVG Curve */}
                  <div className="mt-4 bg-[#03050C] border border-slate-800/90 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-300 font-bold">PFN DISCHARGE VOLTAGE PULSE</span>
                      <span className="text-cyan-400 font-mono">10 µs TRACE // 25.01 kV</span>
                    </div>

                    <div className="relative">
                      <svg viewBox="0 0 360 110" className="w-full h-28 bg-[#070B13] rounded border border-slate-800/80">
                        {/* Grid lines */}
                        <line x1="0" y1="25" x2="360" y2="25" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="55" x2="360" y2="55" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="85" x2="360" y2="85" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="90" y1="0" x2="90" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="180" y1="0" x2="180" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="270" y1="0" x2="270" y2="110" stroke="#1e293b" strokeDasharray="3 3" />

                        {/* Pulse Discharge Curve Polyline */}
                        <polyline
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          points={pfnVoltageCurvePoints}
                          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        />
                      </svg>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                        <span>0 µs (Trigger)</span>
                        <span>2.5 µs (Peak Flat)</span>
                        <span>5.0 µs (Decay)</span>
                        <span>10.0 µs (Quench)</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostics Grid: HTS Resistance, Cryocooler Delta-P, Levitation Airgap, Eddy Dissipation */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {/* HTS Superconducting Resistance */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-mono font-bold uppercase text-slate-300">
                        HTS STATOR RESISTANCE
                      </div>
                      <div className="text-xl md:text-2xl font-black font-mono text-emerald-400 mt-1">
                        {telemetry.htsResistanceMicroohms.toFixed(4)}
                        <span className="text-xs font-mono font-normal text-slate-400 ml-1">µΩ</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Meissner State: 99.98% Lock
                      </div>
                    </div>

                    {/* Cryocooler Delta-P */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-mono font-bold uppercase text-slate-300">
                        CRYOCOOLER LOOP ΔP
                      </div>
                      <div className="text-xl md:text-2xl font-black font-mono text-cyan-300 mt-1">
                        {telemetry.cryocoolerDeltaPKpa.toFixed(1)}
                        <span className="text-xs font-mono font-normal text-slate-400 ml-1">kPa</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        LHe Mass Flow: 2.4 L/s
                      </div>
                    </div>

                    {/* Levitation Gap Clearance */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-mono font-bold uppercase text-slate-300">
                        LEVITATION CLEARANCE
                      </div>
                      <div className="text-xl md:text-2xl font-black font-mono text-amber-300 mt-1">
                        {telemetry.levitationGapMm.toFixed(2)}
                        <span className="text-xs font-mono font-normal text-slate-400 ml-1">mm</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Nominal Gap: 4.50 ± 0.05mm
                      </div>
                    </div>

                    {/* Eddy Current Thermal Dissipation */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-mono font-bold uppercase text-slate-300">
                        EDDY BRAKE THERMAL
                      </div>
                      <div className="text-xl md:text-2xl font-black font-mono text-violet-300 mt-1">
                        {telemetry.eddyThermalDissipationKw.toFixed(1)}
                        <span className="text-xs font-mono font-normal text-slate-400 ml-1">kW</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Sink: Shadowed Crater Bed
                      </div>
                    </div>
                  </div>

                  {/* 4-Quadrant Levitation Gap Sensors Visualization */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200 mb-2">
                      <span>4-QUADRANT SENSOR CLEARANCE (mm)</span>
                      <span className="text-emerald-400 font-bold">BALANCED</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'BOW', val: telemetry.bucketClearanceGaps[0] },
                        { label: 'STERN', val: telemetry.bucketClearanceGaps[1] },
                        { label: 'PORT', val: telemetry.bucketClearanceGaps[2] },
                        { label: 'STBD', val: telemetry.bucketClearanceGaps[3] },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 block">{item.label}</span>
                          <span className="text-sm font-black font-mono text-slate-100">{item.val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subsystem Health Status Tags */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    THYRATRON TIMING: 1.2ns JITTER
                  </span>
                  <span className="text-slate-400">VAC: 1.2e-11 TORR</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* PANE 4: BOTTOM PAYLOAD MANIFEST & ORBITAL TRAJECTORY INJECTION LEDGER */}
          {/* ==================================================================== */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl">
            {/* Header & Quick Action Triggers */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-slate-800/80 gap-4">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  PAYLOAD MANIFEST & ORBITAL TRAJECTORY INJECTION LEDGER
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Real-time canister verification, sub-millisecond telemetry sync, and bucket recovery tracking
                </p>
              </div>

              {/* Quick Action Triggers Required by Spec */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRapidCharge}
                  className="px-3 py-2 rounded-md bg-[#111827] hover:bg-slate-800 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow hover:shadow-amber-500/20 active:scale-95"
                >
                  <BatteryCharging className="w-4 h-4 text-amber-400" />
                  CHARGE PFN BANKS
                </button>

                <button
                  onClick={startTrackPurge}
                  className="px-3 py-2 rounded-md bg-[#111827] hover:bg-slate-800 border border-cyan-500/60 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow hover:shadow-cyan-500/20 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  PURGE LEVITATION GUIDES
                </button>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95"
                >
                  <Unlock className="w-4 h-4" />
                  AUTHORIZE LAUNCH CYCLE
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter by Canister ID or Material..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full sm:w-72 bg-[#03050C] border border-slate-700/80 rounded px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">DESTINATION:</span>
                <select
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="bg-[#03050C] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="ALL">ALL TARGETS</option>
                  <option value="Earth Transfer Trajectory">Earth Transfer Trajectory</option>
                  <option value="Low Lunar Orbit Depot">Low Lunar Orbit Depot</option>
                  <option value="L2 Lagrange Transfer">L2 Lagrange Transfer</option>
                </select>
              </div>
            </div>

            {/* Table with Generous Vertical Clearance & No Clipped Columns */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    <th className="py-3.5 px-3">CANISTER ID</th>
                    <th className="py-3.5 px-3">PAYLOAD CARGO & MASS</th>
                    <th className="py-3.5 px-3">TARGET DESTINATION</th>
                    <th className="py-3.5 px-3">AZIMUTH (°)</th>
                    <th className="py-3.5 px-3">APOAPSIS (KM)</th>
                    <th className="py-3.5 px-3">TARGET VELOCITY</th>
                    <th className="py-3.5 px-3">DISPERSION (± m/s)</th>
                    <th className="py-3.5 px-3">BUCKET RECAPTURE</th>
                    <th className="py-3.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-[#0B0F17] text-xs md:text-sm font-mono text-slate-200">
                  {filteredPayloads.map((payload) => {
                    const isPrimed = payload.status === 'PRIMED';
                    const isInjected = payload.status === 'INJECTED';
                    return (
                      <tr
                        key={payload.id}
                        className={`hover:bg-[#111827] transition-colors ${
                          isPrimed ? 'bg-cyan-950/20 border-l-4 border-l-cyan-400' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          {payload.canisterCode}
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">
                          <div className="font-bold text-slate-100">{payload.material}</div>
                          <span className="text-[11px] text-slate-400 font-mono">{payload.massKg} kg Standard Canister</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wide border ${
                              payload.destination === 'Earth Transfer Trajectory'
                                ? 'bg-cyan-950/60 border-cyan-600 text-cyan-300'
                                : payload.destination === 'Low Lunar Orbit Depot'
                                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                                : 'bg-purple-950/60 border-purple-600 text-purple-300'
                            }`}
                          >
                            {payload.destination}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-200">{payload.launchAzimuthDeg.toFixed(1)}°</td>
                        <td className="py-3.5 px-3 font-bold text-slate-200">{payload.apoapsisTargetKm.toLocaleString()} km</td>
                        <td className="py-3.5 px-3 font-black text-cyan-300">{payload.targetVelocityMs.toFixed(1)} m/s</td>
                        <td className="py-3.5 px-3 text-emerald-400 font-bold">±{payload.releaseAccuracyMs.toFixed(3)}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              payload.bucketStatus === 'RECAPTURED'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {payload.bucketStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-mono font-black tracking-wider uppercase inline-flex items-center gap-1.5 border ${
                              isInjected
                                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                                : isPrimed
                                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 animate-pulse'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {isInjected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {payload.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Manifest Summary Footer */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <div>
                SHOWING {filteredPayloads.length} OF {payloads.length} CANISTERS IN QUEUE // TOTAL MASS IN FLIGHT: 1,250 kg
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">ALL RECOVERY NETS ARMED</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">100% ORBITAL ACCURACY</span>
              </div>
            </div>
          </div>
        </main>

        {/* ==================================================================== */}
        {/* ACTION MODAL: AUTHORIZE LAUNCH CYCLE */}
        {/* ==================================================================== */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-cyan-500/60 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 text-cyan-400 mb-3">
                <ShieldAlert className="w-7 h-7" />
                <h3 className="text-lg font-black font-mono uppercase tracking-wider text-slate-100">
                  AUTHORIZE LAUNCH CYCLE
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-300 mb-4 leading-relaxed">
                Confirm electromagnetic discharge for the next primed regolith canister. Ensure optical muzzle release gate is locked and 4.2K helium cryocooler loop is balanced.
              </p>

              <div className="bg-[#03050C] border border-slate-800 rounded p-3 mb-4 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">OPERATOR CALLSIGN:</span>
                  <span className="text-cyan-300 font-bold">{role} (LUNAR-COMMAND)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DESTINATION VECTOR:</span>
                  <span className="text-violet-300 font-bold">{selectedDestination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PFN VOLTAGE:</span>
                  <span className="text-amber-300 font-bold">25.01 kV (420 MJ)</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  SECURITY KEYPAD CODE:
                </label>
                <input
                  type="text"
                  value={authKeyInput}
                  onChange={(e) => setAuthKeyInput(e.target.value)}
                  className="w-full bg-[#03050C] border border-slate-700 rounded px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold uppercase"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAuthorizeCycle}
                  className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                >
                  CONFIRM & COMMENCE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ACTION MODAL: PURGE TRACK LEVITATION GUIDES */}
        {/* ==================================================================== */}
        {showPurgeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-cyan-500/60 rounded-xl max-w-sm w-full p-6 shadow-2xl text-center">
              <RefreshCw className="w-8 h-8 text-cyan-400 mx-auto animate-spin mb-3" />
              <h3 className="text-base font-black font-mono uppercase text-slate-100 mb-2">
                PURGING 1,200M TRACK GUIDES
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-4">
                Ultrasonic transducer sweep & cryogenic desorption cycle active across all 120 stages.
              </p>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${purgeStep * 25}%` }}
                ></div>
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                {purgeStep === 1 && 'SWEEPING PARTICULATE (0m - 400m)...'}
                {purgeStep === 2 && 'SWEEPING MID-SECTION (400m - 800m)...'}
                {purgeStep === 3 && 'CLEANING OPTICAL RELEASE CURTAIN (800m - 1200m)...'}
                {purgeStep === 4 && 'PURGE COMPLETE. RESIDUAL DUST < 0.001 mg/m².'}
              </div>
            </div>
          </div>
        )}

        {/* Institutional System Footer */}
        <footer className="border-t border-slate-800 bg-[#070B13] px-4 md:px-6 py-3 mt-auto">
          <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div>
              SHACKLETON POLAR CATAPULT // OPERATED BY ARTEMIS REGOLITH LOGISTICS CONSORTIUM
            </div>
            <div className="flex items-center gap-3">
              <span>LATENCY: 0.08ms</span>
              <span>•</span>
              <span>CRYOGENIC ZERO-BOIL-OFF: ACTIVE</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">POSTGRES DDL: SYNCHRONIZED</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LunarMassDriverControl;
