/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PULSAR MAGNETO-GT // PLASMA TOKAMAK HYPERCAR PROTO-13 TELEMETRY DECK
 * Principal Systems Architect - Magnetic Fusion Cockpit & Superconducting MagLev Flight Matrix
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Zap,
  Shield,
  ShieldAlert,
  Gauge,
  Flame,
  Layers,
  Cpu,
  RotateCw,
  Sparkles,
  Play,
  Pause,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Thermometer,
  Sliders,
  X,
  Crosshair,
  TrendingUp,
  Terminal,
  Settings2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Radio,
  ChevronRight,
  Maximize2
} from 'lucide-react';

// Type definitions for institutional telemetry
export type OperationalMode =
  | 'TOKAMAK EQUILIBRIUM'
  | 'FLUX BOOST (V-Max)'
  | 'HIGH-G MAGLEV STIFFEN'
  | 'COIL QUENCH EMERGENCY';

export type DeckTab =
  | 'FUSION FLIGHT DECK'
  | 'TOKAMAK CONFINEMENT'
  | 'MAGLEV & CRYO'
  | 'FUSION SECTOR LEDGER'
  | 'SYSTEM LOGS';

export interface CoilNode {
  id: number;
  label: string;
  angleDeg: number;
  currentKA: number;
  tempK: number;
  fieldTesla: number;
  inductanceH: number;
  status: 'SUPERCONDUCTING' | 'OVERDRIVE' | 'HIGH_FLUX' | 'QUENCH_WARN';
}

export interface WheelCornerData {
  id: 'FL' | 'FR' | 'RL' | 'RR';
  name: string;
  clearanceMm: number;
  repulsiveForceKn: number;
  motorTorqueNm: number;
  motorPowerKw: number;
  slipAngleDeg: number;
  coilTempK: number;
  damperState: 'OPTIMAL' | 'COMPRESSED' | 'EXTENDED' | 'MAX_REPULSION';
}

export interface SectorRecord {
  sectorNumber: number;
  name: string;
  timeSec: number;
  trapSpeedKmh: number;
  peakTempMk: number;
  meanFieldTesla: number;
  maglevGapMm: number;
  powerKw: number;
  deltaSec: number;
  status: 'OPTIMUM' | 'RECORD' | 'STIFFEN' | 'OVERDRIVE' | 'NOMINAL';
}

export interface IncidentLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'NOMINAL';
  description: string;
  actionTaken: string;
}

export default function PulsarMagnetoDeck() {
  // Master operational states
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<DeckTab>('FUSION FLIGHT DECK');
  const [operationalMode, setOperationalMode] = useState<OperationalMode>('TOKAMAK EQUILIBRIUM');
  const [fluxOverdrive, setFluxOverdrive] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);
  const [keyCoverUnlocked, setKeyCoverUnlocked] = useState<boolean>(false);

  // Active sector tracking
  const [activeSector, setActiveSector] = useState<number>(5);
  const [lapElapsedSec, setLapElapsedSec] = useState<number>(84.32);

  // Dynamic telemetry states
  const [speed, setSpeed] = useState<number>(368.2);
  const [fusionPowerKw, setFusionPowerKw] = useState<number>(1865);
  const [toroidalField, setToroidalField] = useState<number>(12.4);
  const [plasmaTempMk, setPlasmaTempMk] = useState<number>(15.2);
  const [betaStability, setBetaStability] = useState<number>(99.8);
  const [neutronFlux, setNeutronFlux] = useState<number>(4.85);
  const [heliumTempK, setHeliumTempK] = useState<number>(4.2);
  const [heliumPressureBar, setHeliumPressureBar] = useState<number>(1.18);
  const [maglevClearanceMm, setMaglevClearanceMm] = useState<number>(12.0);
  const [plasmaPhase, setPlasmaPhase] = useState<number>(0);

  // Modals & Inspection
  const [selectedCoil, setSelectedCoil] = useState<CoilNode | null>(null);
  const [isCalibratingCoils, setIsCalibratingCoils] = useState<boolean>(false);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [isPurgingHelium, setIsPurgingHelium] = useState<boolean>(false);
  const [purgePressureDrop, setPurgePressureDrop] = useState<number>(1.18);
  const [isSymmetrizing, setIsSymmetrizing] = useState<boolean>(false);
  const [symmetrizePhase, setSymmetrizePhase] = useState<string>('');

  // 12 Superconducting Toroidal Magnetic Coils
  const coils: CoilNode[] = useMemo(() => {
    const labels = [
      'TF-01 α', 'TF-02 β', 'TF-03 γ', 'TF-04 δ',
      'TF-05 ε', 'TF-06 ζ', 'TF-07 η', 'TF-08 θ',
      'TF-09 ι', 'TF-10 κ', 'TF-11 λ', 'TF-12 μ'
    ];
    return labels.map((label, idx) => {
      const angle = (idx * 360) / 12;
      const baseKA = fluxOverdrive ? 73.8 : 68.2;
      const baseField = fluxOverdrive ? 13.4 : 12.4;
      const isOverdrive = fluxOverdrive;
      const isQuench = operationalMode === 'COIL QUENCH EMERGENCY' && idx === 6;
      return {
        id: idx + 1,
        label,
        angleDeg: angle,
        currentKA: +(baseKA + Math.sin(plasmaPhase * 0.1 + idx) * 0.4).toFixed(1),
        tempK: +(4.18 + (idx % 3 === 0 ? 0.03 : 0.01) + (isOverdrive ? 0.04 : 0)).toFixed(2),
        fieldTesla: +(baseField + Math.cos(plasmaPhase * 0.15 + idx) * 0.15).toFixed(2),
        inductanceH: 1.42,
        status: isQuench ? 'QUENCH_WARN' : isOverdrive ? 'OVERDRIVE' : idx === 3 ? 'HIGH_FLUX' : 'SUPERCONDUCTING'
      };
    });
  }, [fluxOverdrive, operationalMode, plasmaPhase]);

  // 4 MagLev Suspension Corners
  const [wheels, setWheels] = useState<WheelCornerData[]>([
    {
      id: 'FL',
      name: 'Front-Left MagLev Pin',
      clearanceMm: 11.8,
      repulsiveForceKn: 41.2,
      motorTorqueNm: 820,
      motorPowerKw: 466,
      slipAngleDeg: -0.42,
      coilTempK: 4.18,
      damperState: 'OPTIMAL'
    },
    {
      id: 'FR',
      name: 'Front-Right MagLev Pin',
      clearanceMm: 12.1,
      repulsiveForceKn: 40.8,
      motorTorqueNm: 815,
      motorPowerKw: 464,
      slipAngleDeg: 0.38,
      coilTempK: 4.2,
      damperState: 'OPTIMAL'
    },
    {
      id: 'RL',
      name: 'Rear-Left High-Flux Hub',
      clearanceMm: 11.6,
      repulsiveForceKn: 44.5,
      motorTorqueNm: 940,
      motorPowerKw: 468,
      slipAngleDeg: -0.15,
      coilTempK: 4.19,
      damperState: 'MAX_REPULSION'
    },
    {
      id: 'RR',
      name: 'Rear-Right High-Flux Hub',
      clearanceMm: 11.7,
      repulsiveForceKn: 44.2,
      motorTorqueNm: 935,
      motorPowerKw: 467,
      slipAngleDeg: 0.12,
      coilTempK: 4.21,
      damperState: 'MAX_REPULSION'
    }
  ]);

  // Neutron Shielding Thermal Sensor Grid (8 zones)
  const thermalSensors = useMemo(() => [
    { zone: 'Upper Divertor Target', temp: '984°C', flux: '14.2 MW/m²', status: 'NORMAL' },
    { zone: 'Lower Divertor Monoblock', temp: '1,048°C', flux: '16.8 MW/m²', status: 'ELEVATED' },
    { zone: 'First Wall Inboard Tile', temp: '762°C', flux: '8.4 MW/m²', status: 'NORMAL' },
    { zone: 'Outboard Tritium Blanket', temp: '528°C', flux: '4.6 MW/m²', status: 'OPTIMAL' },
    { zone: 'Neutral Beam Ingestion Armor', temp: '695°C', flux: '9.1 MW/m²', status: 'NORMAL' },
    { zone: 'RF Resonant Launcher Port', temp: '480°C', flux: '3.2 MW/m²', status: 'OPTIMAL' },
    { zone: 'Cryostat Vacuum Boundary', temp: '4.22 K', flux: '<0.01 W/m²', status: 'SUPERCONDUCTING' },
    { zone: 'Poloidal Feeder Busbar 1-4', temp: '4.19 K', flux: '<0.01 W/m²', status: 'SUPERCONDUCTING' }
  ], []);

  // 14 Sector Ledger records
  const sectorRecords: SectorRecord[] = useMemo(() => [
    { sectorNumber: 1, name: 'Tiergarten Launch Straight', timeSec: 12.418, trapSpeedKmh: 372.4, peakTempMk: 15.12, meanFieldTesla: 12.45, maglevGapMm: 11.8, powerKw: 1865, deltaSec: -0.042, status: 'OPTIMUM' },
    { sectorNumber: 2, name: 'Hatzenbach Poloidal Sweep', timeSec: 19.642, trapSpeedKmh: 284.1, peakTempMk: 14.85, meanFieldTesla: 12.30, maglevGapMm: 10.5, powerKw: 1720, deltaSec: 0.015, status: 'OPTIMUM' },
    { sectorNumber: 3, name: 'Hocheichen Magneto-Chicane', timeSec: 14.881, trapSpeedKmh: 246.8, peakTempMk: 15.30, meanFieldTesla: 12.60, maglevGapMm: 9.8, powerKw: 1680, deltaSec: 0.038, status: 'STIFFEN' },
    { sectorNumber: 4, name: 'Flugplatz Kinetic Crest', timeSec: 18.230, trapSpeedKmh: 365.9, peakTempMk: 15.65, meanFieldTesla: 12.80, maglevGapMm: 13.2, powerKw: 1890, deltaSec: -0.012, status: 'OPTIMUM' },
    { sectorNumber: 5, name: 'Schwedenkreuz V-Max Descent', timeSec: 16.104, trapSpeedKmh: 388.5, peakTempMk: 16.10, meanFieldTesla: 13.10, maglevGapMm: 11.2, powerKw: 1940, deltaSec: -0.089, status: 'RECORD' },
    { sectorNumber: 6, name: 'Aremberg Magnetic Compression', timeSec: 17.925, trapSpeedKmh: 238.4, peakTempMk: 15.40, meanFieldTesla: 12.50, maglevGapMm: 9.5, powerKw: 1610, deltaSec: 0.021, status: 'STIFFEN' },
    { sectorNumber: 7, name: 'Fuchsrohre Downforce Dip', timeSec: 15.319, trapSpeedKmh: 352.0, peakTempMk: 15.80, meanFieldTesla: 12.95, maglevGapMm: 8.8, powerKw: 1845, deltaSec: -0.005, status: 'OPTIMUM' },
    { sectorNumber: 8, name: 'Adenauer-Forst Symmetrizer', timeSec: 20.145, trapSpeedKmh: 198.6, peakTempMk: 14.90, meanFieldTesla: 12.15, maglevGapMm: 12.0, powerKw: 1520, deltaSec: 0.064, status: 'NOMINAL' },
    { sectorNumber: 9, name: 'Metzgesfeld High-G Apex', timeSec: 17.780, trapSpeedKmh: 276.5, peakTempMk: 15.25, meanFieldTesla: 12.40, maglevGapMm: 10.0, powerKw: 1715, deltaSec: 0.002, status: 'OPTIMUM' },
    { sectorNumber: 10, name: 'Kallenhard Toroidal Decel', timeSec: 18.490, trapSpeedKmh: 215.2, peakTempMk: 15.05, meanFieldTesla: 12.20, maglevGapMm: 10.4, powerKw: 1590, deltaSec: 0.019, status: 'OPTIMUM' },
    { sectorNumber: 11, name: 'Wehrseifen Cryo Recirc', timeSec: 21.305, trapSpeedKmh: 174.9, peakTempMk: 14.70, meanFieldTesla: 12.05, maglevGapMm: 11.9, powerKw: 1480, deltaSec: 0.052, status: 'NOMINAL' },
    { sectorNumber: 12, name: 'Breidscheid Magnetic Drop', timeSec: 16.890, trapSpeedKmh: 268.0, peakTempMk: 15.45, meanFieldTesla: 12.55, maglevGapMm: 10.8, powerKw: 1750, deltaSec: -0.014, status: 'OPTIMUM' },
    { sectorNumber: 13, name: 'Bergwerk Full Poloidal Surge', timeSec: 19.420, trapSpeedKmh: 310.8, peakTempMk: 15.90, meanFieldTesla: 13.00, maglevGapMm: 11.5, powerKw: 1875, deltaSec: -0.031, status: 'OPTIMUM' },
    { sectorNumber: 14, name: 'Galgenkopf V-Max Terminal', timeSec: 15.092, trapSpeedKmh: 396.2, peakTempMk: 16.42, meanFieldTesla: 13.45, maglevGapMm: 12.1, powerKw: 1980, deltaSec: -0.105, status: 'OVERDRIVE' }
  ], []);

  // System Action Incident Logs
  const [incidentLogs, setIncidentLogs] = useState<IncidentLog[]>([
    {
      id: 'EVT-904',
      timestamp: 'T-00:00:14',
      type: 'PLASMA_OVERDRIVE_ENGAGED',
      severity: 'INFO',
      description: 'Pilot keyed Plasma Flux Overdrive switch. Poloidal compression field intensified to 13.45 T.',
      actionTaken: 'Superconducting feeder stepped to 74.2 kA; core output verified at 1,980 kW.'
    },
    {
      id: 'EVT-903',
      timestamp: 'T-00:01:28',
      type: 'COIL_PRE_CHILL_CYCLE',
      severity: 'NOMINAL',
      description: 'Supercritical He-4 primary manifold subcooling pump balanced to 14.6 L/min.',
      actionTaken: 'Coil temperature stabilized at 4.18 K. Meissner flux pinning coefficient at 99.98%.'
    },
    {
      id: 'EVT-902',
      timestamp: 'T-00:03:45',
      type: 'TOROIDAL_FIELD_SYMMETRIZED',
      severity: 'NOMINAL',
      description: 'High-order magnetic ripple shimming deployed across coils 6 through 9.',
      actionTaken: 'Toroidal magnetic flux field error corrected to <0.02% harmonic distortion.'
    },
    {
      id: 'EVT-901',
      timestamp: 'T-00:07:12',
      type: 'MAGLEV_HIGH_G_STIFFEN',
      severity: 'INFO',
      description: 'Apex lateral load sensor detected 3.8G cornering event at Flugplatz crest.',
      actionTaken: 'MagLev repulsive force stepped to 44.5 kN on rear corners; ride clearance held at 11.6 mm.'
    },
    {
      id: 'EVT-900',
      timestamp: 'T-00:12:05',
      type: 'BETA_LIMIT_THRESHOLD_WARN',
      severity: 'WARNING',
      description: 'Troyon beta stability reached 99.3% limit during high-rpm regenerative pulse.',
      actionTaken: 'Dynamic magnetic shear injection modulated poloidal coils to restore 99.8% beta.'
    }
  ]);

  // Audio tone generator for flight-deck realism
  const playDeckTone = (freq: number = 880, type: OscillatorType = 'sine', duration: number = 0.08) => {
    if (!audioFeedback) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // High-frequency telemetry tick simulation
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      setPlasmaPhase((prev) => (prev + 0.15 * simSpeed) % (Math.PI * 2));
      setLapElapsedSec((prev) => +(prev + 0.05 * simSpeed).toFixed(2));

      // Dynamic oscillation based on operational mode and overdrive
      const baseTargetSpeed = fluxOverdrive
        ? 396.5
        : operationalMode === 'FLUX BOOST (V-Max)'
        ? 388.0
        : operationalMode === 'HIGH-G MAGLEV STIFFEN'
        ? 324.0
        : operationalMode === 'COIL QUENCH EMERGENCY'
        ? 140.0
        : 368.2;

      setSpeed((prev) => {
        const noise = (Math.random() - 0.49) * 1.2 * simSpeed;
        const target = baseTargetSpeed + noise;
        return +(prev + (target - prev) * 0.08).toFixed(1);
      });

      const baseKw = fluxOverdrive
        ? 1980
        : operationalMode === 'FLUX BOOST (V-Max)'
        ? 1940
        : operationalMode === 'COIL QUENCH EMERGENCY'
        ? 620
        : 1865;

      setFusionPowerKw((prev) => {
        const noise = (Math.random() - 0.48) * 8 * simSpeed;
        return Math.round(prev + (baseKw + noise - prev) * 0.1);
      });

      const baseTesla = fluxOverdrive ? 13.45 : operationalMode === 'FLUX BOOST (V-Max)' ? 13.1 : 12.4;
      setToroidalField((prev) => {
        const noise = (Math.random() - 0.5) * 0.04;
        return +(prev + (baseTesla + noise - prev) * 0.08).toFixed(2);
      });

      const baseTemp = fluxOverdrive ? 16.42 : operationalMode === 'COIL QUENCH EMERGENCY' ? 8.2 : 15.2;
      setPlasmaTempMk((prev) => {
        const noise = (Math.random() - 0.5) * 0.06;
        return +(prev + (baseTemp + noise - prev) * 0.06).toFixed(2);
      });

      setBetaStability((prev) => {
        const target = operationalMode === 'COIL QUENCH EMERGENCY' ? 84.5 : fluxOverdrive ? 99.6 : 99.8;
        const noise = (Math.random() - 0.5) * 0.08;
        return +(prev + (target + noise - prev) * 0.08).toFixed(1);
      });

      setNeutronFlux((prev) => {
        const target = fluxOverdrive ? 5.55 : 4.85;
        const noise = (Math.random() - 0.5) * 0.04;
        return +(prev + (target + noise - prev) * 0.05).toFixed(2);
      });

      // Update 4 corner wheels
      setWheels((prev) =>
        prev.map((w) => {
          const cornerNoise = (Math.random() - 0.5) * 0.3;
          const targetGap =
            operationalMode === 'HIGH-G MAGLEV STIFFEN' ? 9.8 : fluxOverdrive ? 11.2 : 12.0;
          const targetForce =
            operationalMode === 'HIGH-G MAGLEV STIFFEN'
              ? 44.8
              : w.id.startsWith('R')
              ? 43.5
              : 41.0;

          return {
            ...w,
            clearanceMm: +(w.clearanceMm + (targetGap + cornerNoise - w.clearanceMm) * 0.1).toFixed(1),
            repulsiveForceKn: +(w.repulsiveForceKn + (targetForce + cornerNoise * 2 - w.repulsiveForceKn) * 0.1).toFixed(1),
            slipAngleDeg: +(Math.sin(Date.now() * 0.002 + (w.id === 'FL' ? 1 : 2)) * 0.45).toFixed(2)
          };
        })
      );

      // Periodically shift active sector
      setActiveSector((prev) => (Math.floor(Date.now() / (12000 / simSpeed)) % 14) + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [simulationRunning, simSpeed, fluxOverdrive, operationalMode]);

  // Mode change handler
  const handleModeChange = (mode: OperationalMode) => {
    playDeckTone(640, 'triangle', 0.12);
    setOperationalMode(mode);

    if (mode === 'COIL QUENCH EMERGENCY') {
      setFluxOverdrive(false);
      const newIncident: IncidentLog = {
        id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
        timestamp: 'T-LIVE',
        type: 'MANUAL_QUENCH_TRIGGERED',
        severity: 'CRITICAL',
        description: 'Pilot initiated emergency magnetic coil quench and divertor plasma containment bleed.',
        actionTaken: 'Superconducting feeder disconnected; helium flood cooling activated on TF-07.'
      };
      setIncidentLogs((prev) => [newIncident, ...prev.slice(0, 19)]);
    } else {
      const newIncident: IncidentLog = {
        id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
        timestamp: 'T-LIVE',
        type: `MODE_${mode.replace(/\s+/g, '_')}`,
        severity: 'INFO',
        description: `Operational deck mode transitioned to ${mode}. Magnetic bias updated.`,
        actionTaken: 'Poloidal shaping coils balanced for new flight profile.'
      };
      setIncidentLogs((prev) => [newIncident, ...prev.slice(0, 19)]);
    }
  };

  // Plasma Overdrive toggle
  const toggleOverdrive = () => {
    if (!keyCoverUnlocked) {
      playDeckTone(240, 'sawtooth', 0.15);
      return;
    }
    const next = !fluxOverdrive;
    setFluxOverdrive(next);
    playDeckTone(next ? 1200 : 400, 'square', 0.2);

    const newLog: IncidentLog = {
      id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
      timestamp: 'T-LIVE',
      type: next ? 'PLASMA_FLUX_OVERDRIVE_ON' : 'PLASMA_OVERDRIVE_STANDBY',
      severity: next ? 'WARNING' : 'INFO',
      description: next
        ? 'Keyed Plasma Flux Overdrive locked ON. High-order poloidal compression ramped to 13.45 T.'
        : 'Overdrive disengaged. Toroidal field relaxed to nominal 12.4 T cruising equilibrium.',
      actionTaken: next ? 'Subcooled He-4 mass flow boosted to 18.2 L/min.' : 'Cryogenic recirc nominal.'
    };
    setIncidentLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // Action: Recalibrate Magnetic Coils
  const handleRecalibrateCoils = () => {
    setIsCalibratingCoils(true);
    setCalibrationProgress(5);
    playDeckTone(880, 'sine', 0.1);

    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCalibratingCoils(false);
            setCalibrationProgress(0);
            playDeckTone(1400, 'sine', 0.18);
            setIncidentLogs((logs) => [
              {
                id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
                timestamp: 'T-LIVE',
                type: 'COILS_RECALIBRATED',
                severity: 'NOMINAL',
                description: 'Full 12-coil phased alignment verified across 360-degree toroidal plane.',
                actionTaken: 'Phase offset harmonized to 0.000 rad across all ReBCO tape stacks.'
              },
              ...logs.slice(0, 19)
            ]);
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  // Action: Purge Helium Loop
  const handlePurgeHelium = () => {
    setIsPurgingHelium(true);
    playDeckTone(320, 'sawtooth', 0.2);
    setPurgePressureDrop(1.35);

    setTimeout(() => {
      setPurgePressureDrop(1.22);
    }, 600);

    setTimeout(() => {
      setPurgePressureDrop(1.18);
      setIsPurgingHelium(false);
      playDeckTone(990, 'sine', 0.15);
      setIncidentLogs((logs) => [
        {
          id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
          timestamp: 'T-LIVE',
          type: 'HELIUM_LOOP_PURGED',
          severity: 'NOMINAL',
          description: 'Flash boil-off accumulator vented through aerodynamic floor diffuser.',
          actionTaken: 'Primary cryostat loop settled at 4.18 K @ 1.18 bar nominal reserve.'
        },
        ...logs.slice(0, 19)
      ]);
    }, 1400);
  };

  // Action: Trigger Field Symmetrizer
  const handleTriggerSymmetrizer = () => {
    setIsSymmetrizing(true);
    setSymmetrizePhase('ANALYZING HARMONIC DRIFT...');
    playDeckTone(720, 'sine', 0.1);

    setTimeout(() => {
      setSymmetrizePhase('INJECTING POLOIDAL SHIMS...');
      playDeckTone(940, 'triangle', 0.1);
    }, 700);

    setTimeout(() => {
      setSymmetrizePhase('SYMMETRIZATION LOCKED (ΔB/B < 0.01%)');
      playDeckTone(1280, 'sine', 0.15);
    }, 1400);

    setTimeout(() => {
      setIsSymmetrizing(false);
      setIncidentLogs((logs) => [
        {
          id: `EVT-${Math.floor(Math.random() * 899 + 100)}`,
          timestamp: 'T-LIVE',
          type: 'FIELD_SYMMETRIZED',
          severity: 'NOMINAL',
          description: 'Toroidal magnetic surface reconstructed with zero non-axisymmetric ripple.',
          actionTaken: 'Plasma boundary elongation kappa balanced at 1.84.'
        },
        ...logs.slice(0, 19)
      ]);
    }, 2100);
  };

  // Action: Export Fusion Telemetry CSV
  const handleExportCSV = () => {
    playDeckTone(1100, 'sine', 0.1);
    const headers = [
      'Sector',
      'SectorName',
      'TimeSec',
      'TrapSpeedKmh',
      'CoreTempMk',
      'ToroidalFieldTesla',
      'MagLevClearanceMm',
      'FusionPowerKw',
      'DeltaSec',
      'Status'
    ];
    const rows = sectorRecords.map((s) => [
      s.sectorNumber,
      `"${s.name}"`,
      s.timeSec,
      s.trapSpeedKmh,
      s.peakTempMk,
      s.meanFieldTesla,
      s.maglevGapMm,
      s.powerKw,
      s.deltaSec,
      s.status
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `pulsar_magneto_gt_proto13_telemetry_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Visual helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECORD':
      case 'OVERDRIVE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'OPTIMUM':
      case 'SUPERCONDUCTING':
      case 'NOMINAL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'STIFFEN':
      case 'HIGH_FLUX':
      case 'ELEVATED':
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'QUENCH_WARN':
      case 'CRITICAL':
        return 'bg-red-600/30 text-red-200 border-red-500 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#030308] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        {/* TOP STATUS BAR: INSTITUTIONAL COCKPIT HEADER */}
        <header className="border-b border-[#1E293B] bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-30 px-3 md:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left Header: Locked Chassis Code & Flight Deck Title (Eliminate mobile line-wraps) */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-2.5 h-9 bg-gradient-to-b from-rose-500 via-purple-500 to-amber-500 rounded-sm shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300 font-mono text-xs font-black tracking-widest shrink-0 whitespace-nowrap">
                  PROTO-13
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold tracking-wider shrink-0 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  BETA 99.8% STABLE
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 truncate whitespace-nowrap">
                PULSAR MAGNETO-GT // PLASMA TOKAMAK HYPERCAR PROTO-13
              </h1>
            </div>

            {/* Right Action Controls: Clean h-9 aligned row */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Simulation Play/Pause Toggle */}
              <div className="h-9 flex items-center bg-[#111827] border border-[#1E293B] rounded px-1">
                <button
                  onClick={() => {
                    playDeckTone(520, 'sine', 0.08);
                    setSimulationRunning(!simulationRunning);
                  }}
                  className={`h-7 px-2.5 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    simulationRunning
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title={simulationRunning ? 'Pause Live Telemetry' : 'Resume Live Telemetry'}
                >
                  {simulationRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> PAUSE
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> LIVE
                    </>
                  )}
                </button>

                {/* Speed Multiplier Selectors (1x, 2x, 5x) */}
                <div className="flex items-center ml-1 border-l border-slate-700/60 pl-1">
                  {[1, 2, 5].map((speedVal) => (
                    <button
                      key={speedVal}
                      onClick={() => {
                        playDeckTone(700 + speedVal * 60, 'sine', 0.06);
                        setSimSpeed(speedVal);
                      }}
                      className={`h-7 px-2 rounded font-mono text-xs font-bold transition-all ${
                        simSpeed === speedVal
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speedVal}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio immersion toggle */}
              <button
                onClick={() => {
                  setAudioFeedback(!audioFeedback);
                  if (!audioFeedback) playDeckTone(880, 'sine', 0.1);
                }}
                className={`h-9 px-2.5 rounded border font-mono text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  audioFeedback
                    ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                    : 'bg-[#111827] border-[#1E293B] text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Acoustic Telemetry Tones"
              >
                {audioFeedback ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" /> TONES ON
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" /> MUTED
                  </>
                )}
              </button>

              {/* Safety Keyed Plasma Overdrive Toggle */}
              <div className="h-9 flex items-center bg-[#111827] border border-[#1E293B] rounded px-1.5 gap-1.5">
                <button
                  onClick={() => {
                    playDeckTone(480, 'sine', 0.08);
                    setKeyCoverUnlocked(!keyCoverUnlocked);
                  }}
                  className={`h-7 px-1.5 rounded flex items-center gap-1 font-mono text-xs font-bold transition-colors ${
                    keyCoverUnlocked
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title={keyCoverUnlocked ? 'Safety Cover Open' : 'Arm Overdrive Switch'}
                >
                  {keyCoverUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="hidden sm:inline">SAFETY</span>
                </button>

                <button
                  onClick={toggleOverdrive}
                  disabled={!keyCoverUnlocked}
                  className={`h-7 px-2.5 rounded font-mono text-xs font-black tracking-wider transition-all flex items-center gap-1.5 ${
                    !keyCoverUnlocked
                      ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                      : fluxOverdrive
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.6)] animate-pulse'
                      : 'bg-rose-950/60 border border-rose-600/60 text-rose-300 hover:bg-rose-900/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OVERDRIVE {fluxOverdrive ? 'ACTIVE' : 'STANDBY'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RESPONSIVE TAB BAR: Horizontal overflow wrapper with scrollbar-none */}
          <div className="mt-2.5 pt-2 border-t border-[#1E293B]/70 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {[
                { id: 'FUSION FLIGHT DECK', icon: Gauge, badge: 'PRIMARY' },
                { id: 'TOKAMAK CONFINEMENT', icon: Activity, badge: '12 COILS' },
                { id: 'MAGLEV & CRYO', icon: Layers, badge: '4.2 K' },
                { id: 'FUSION SECTOR LEDGER', icon: Crosshair, badge: '14 SECTORS' },
                { id: 'SYSTEM LOGS', icon: Terminal, badge: 'INCIDENTS' }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playDeckTone(750, 'sine', 0.05);
                      setActiveTab(tab.id as DeckTab);
                    }}
                    className={`h-8 px-3 rounded font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all whitespace-nowrap border ${
                      isActive
                        ? 'bg-rose-600/20 text-rose-300 border-rose-500/80 shadow-[0_0_10px_rgba(225,29,72,0.2)]'
                        : 'bg-[#111827]/70 text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span>{tab.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* PANE 1: TOP POWERTRAIN & FUSION PLASMA HUD STRIP */}
        <section className="bg-[#0B0F17] border-b border-[#1E293B] px-3 md:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Metric 1: Ground Speed */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  Ground Speed
                </span>
                <Gauge className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  {speed.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">KM/H</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (speed / 420) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>V-MAX: 412 KM/H</span>
                <span className="text-emerald-400 font-bold">DRAG: -0.18 Cd</span>
              </div>
            </div>

            {/* Metric 2: Fusion Core Output */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  Fusion Core Output
                </span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  {fusionPowerKw.toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">kW</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (fusionPowerKw / 2200) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>≈ {Math.round(fusionPowerKw * 1.341)} HP</span>
                <span className="text-purple-400 font-bold">Q-FUSION: 14.8</span>
              </div>
            </div>

            {/* Metric 3: Toroidal Field Strength */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  Toroidal Field
                </span>
                <Radio className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  {toroidalField.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">TESLA</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (toroidalField / 15.0) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>POLOIDAL: 5.12 T</span>
                <span className="text-purple-300 font-bold">ReBCO 2G-HTS</span>
              </div>
            </div>

            {/* Metric 4: Plasma Core Temp */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  Plasma Core Temp
                </span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  {plasmaTempMk.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">MK</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (plasmaTempMk / 20.0) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>D-T CONFINEMENT</span>
                <span className="text-amber-400 font-bold">15.2M °C</span>
              </div>
            </div>

            {/* Metric 5: MagLev Coil Clearance */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  MagLev Clearance
                </span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  {maglevClearanceMm.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">mm</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (maglevClearanceMm / 20.0) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>@ 4.2 KELVIN</span>
                <span className="text-emerald-400 font-bold">MEISSNER LOCK</span>
              </div>
            </div>

            {/* Metric 6: Live Sector & Stint Time */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase">
                  Active Track Sector
                </span>
                <Crosshair className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-rose-400">
                  S-{activeSector.toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">/ 14</span>
              </div>
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${(activeSector / 14) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1.5">
                <span>STINT: {lapElapsedSec.toFixed(1)}s</span>
                <span className="text-emerald-400 font-bold">DELTA: -0.08s</span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN COCKPIT VIEWPORT */}
        <main className="flex-1 px-3 md:px-6 py-5 max-w-[1920px] w-full mx-auto space-y-5">
          {/* TAB 1: FUSION FLIGHT DECK (THE 4-PANE FLAGSHIP LAYOUT) */}
          {activeTab === 'FUSION FLIGHT DECK' && (
            <>
              {/* OPERATIONAL MODES QUICK SWITCHER */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-400" />
                    <span className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      Core Operational Profile:
                    </span>
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-black tracking-widest bg-rose-600/30 text-rose-300 border border-rose-500/50">
                      {operationalMode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {[
                      { mode: 'TOKAMAK EQUILIBRIUM', desc: 'Balanced Cruise', color: 'hover:border-purple-500' },
                      { mode: 'FLUX BOOST (V-Max)', desc: 'Peak Poloidal kW', color: 'hover:border-rose-500' },
                      { mode: 'HIGH-G MAGLEV STIFFEN', desc: '45 kN Damping', color: 'hover:border-cyan-500' },
                      { mode: 'COIL QUENCH EMERGENCY', desc: 'Plasma Vent', color: 'hover:border-red-600 text-red-400' }
                    ].map((item) => {
                      const isSelected = operationalMode === item.mode;
                      return (
                        <button
                          key={item.mode}
                          onClick={() => handleModeChange(item.mode as OperationalMode)}
                          className={`px-3 py-2 rounded text-left border font-mono transition-all ${
                            isSelected
                              ? 'bg-rose-600/30 border-rose-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.3)]'
                              : `bg-[#111827] border-[#1E293B] text-slate-300 ${item.color}`
                          }`}
                        >
                          <div className="text-xs font-black tracking-wider uppercase truncate">
                            {item.mode}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                            {item.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2-COLUMN SPLIT: CENTER-LEFT TOKAMAK CANVAS & CENTER-RIGHT MAGLEV MATRIX */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                {/* PANE 2: CENTER-LEFT 2D INTERACTIVE TOKAMAK PLASMA CONFINEMENT CANVAS (7 cols) */}
                <div className="xl:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 md:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                        2D Tokamak Toroidal Core Schematic
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      CLICK COIL NODES (1-12) TO INSPECT INDIVIDUAL FLUX
                    </span>
                  </div>

                  {/* SVG Tokamak Interactive Donut */}
                  <div className="relative w-full aspect-square max-h-[460px] mx-auto flex items-center justify-center p-2">
                    <svg viewBox="0 0 500 500" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                      <defs>
                        {/* Outer Glow filter */}
                        <filter id="plasmaGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Plasma gradient */}
                        <radialGradient id="plasmaCoreGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#0B0F17" stopOpacity="0.9" />
                          <stop offset="40%" stopColor="#A855F7" stopOpacity="0.4" />
                          <stop offset="65%" stopColor="#E11D48" stopOpacity="0.85" />
                          <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                        </radialGradient>

                        {/* Poloidal flux loop gradient */}
                        <linearGradient id="fluxLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#E11D48" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
                        </linearGradient>
                      </defs>

                      {/* Outer cryostat vacuum vessel ring */}
                      <circle cx="250" cy="250" r="230" fill="none" stroke="#1E293B" strokeWidth="6" />
                      <circle cx="250" cy="250" r="222" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6,4" />

                      {/* Radiation shielding inner circle */}
                      <circle cx="250" cy="250" r="195" fill="none" stroke="#334155" strokeWidth="4" />

                      {/* Toroidal Plasma Donut Path */}
                      <circle
                        cx="250"
                        cy="250"
                        r="145"
                        fill="none"
                        stroke="url(#plasmaCoreGrad)"
                        strokeWidth="70"
                        filter="url(#plasmaGlow)"
                        opacity="0.85"
                      />

                      {/* Rotating dynamic magnetic field lines */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <ellipse
                          key={deg}
                          cx="250"
                          cy="250"
                          rx="145"
                          ry="35"
                          fill="none"
                          stroke="url(#fluxLineGrad)"
                          strokeWidth="1.5"
                          strokeDasharray="8,6"
                          opacity={0.35 + Math.sin(plasmaPhase + deg) * 0.25}
                          transform={`rotate(${deg + (plasmaPhase * 180) / Math.PI * 0.1}, 250, 250)`}
                        />
                      ))}

                      {/* Swirling interactive plasma particles */}
                      {[...Array(24)].map((_, i) => {
                        const radius = 120 + ((i * 19) % 50);
                        const angle = (i * (Math.PI * 2)) / 24 + plasmaPhase * (i % 2 === 0 ? 1 : 1.3);
                        const cx = 250 + radius * Math.cos(angle);
                        const cy = 250 + radius * Math.sin(angle);
                        const size = 2 + (i % 4);
                        const color = i % 3 === 0 ? '#F59E0B' : i % 2 === 0 ? '#E11D48' : '#A855F7';
                        return (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r={size}
                            fill={color}
                            opacity={0.75 + Math.sin(angle * 2) * 0.2}
                          />
                        );
                      })}

                      {/* Central Solenoid Core (Inner Island) */}
                      <circle cx="250" cy="250" r="75" fill="#0B0F17" stroke="#1E293B" strokeWidth="4" />
                      <circle cx="250" cy="250" r="60" fill="#0F172A" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx="250" cy="250" r="28" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
                      <text
                        x="250"
                        y="246"
                        textAnchor="middle"
                        fill="#E2E8F0"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        CENTRAL
                      </text>
                      <text
                        x="250"
                        y="262"
                        textAnchor="middle"
                        fill="#A855F7"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        SOLENOID
                      </text>

                      {/* 12 Superconducting Toroidal Magnetic Coil Nodes */}
                      {coils.map((coil) => {
                        const rad = (coil.angleDeg * Math.PI) / 180;
                        const coilRadius = 195;
                        const cx = 250 + coilRadius * Math.cos(rad);
                        const cy = 250 + coilRadius * Math.sin(rad);

                        const isQuenched = coil.status === 'QUENCH_WARN';
                        const isOver = coil.status === 'OVERDRIVE';
                        const fillColor = isQuenched
                          ? '#DC2626'
                          : isOver
                          ? '#E11D48'
                          : '#0F172A';
                        const strokeColor = isQuenched
                          ? '#EF4444'
                          : isOver
                          ? '#F43F5E'
                          : '#A855F7';

                        return (
                          <g
                            key={coil.id}
                            className="cursor-pointer transition-transform hover:scale-110"
                            onClick={() => {
                              playDeckTone(800 + coil.id * 30, 'sine', 0.1);
                              setSelectedCoil(coil);
                            }}
                          >
                            <circle
                              cx={cx}
                              cy={cy}
                              r="15"
                              fill={fillColor}
                              stroke={strokeColor}
                              strokeWidth="2.5"
                            />
                            <text
                              x={cx}
                              y={cy + 4}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="9"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {coil.id}
                            </text>
                            {/* Radial tick to core */}
                            <line
                              x1={cx}
                              y1={cy}
                              x2={cx - 15 * Math.cos(rad)}
                              y2={cy - 15 * Math.sin(rad)}
                              stroke={strokeColor}
                              strokeWidth="2"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Central Overlay HUD Badge */}
                    <div className="absolute bottom-2 left-2 bg-[#0B0F17]/90 border border-[#1E293B] rounded p-2 text-[11px] font-mono backdrop-blur-sm">
                      <div className="text-slate-400 uppercase font-bold">Troyon Beta Limit</div>
                      <div className="text-emerald-400 font-bold text-sm">
                        {betaStability.toFixed(1)}% (STABLE)
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-[#0B0F17]/90 border border-[#1E293B] rounded p-2 text-[11px] font-mono backdrop-blur-sm text-right">
                      <div className="text-slate-400 uppercase font-bold">Neutron Flux</div>
                      <div className="text-purple-300 font-bold text-sm">
                        {neutronFlux.toFixed(2)} × 10¹⁴ n/cm²·s
                      </div>
                    </div>
                  </div>

                  {/* Neutron Shielding Thermal Sensor Grid */}
                  <div className="mt-4 pt-3 border-t border-[#1E293B]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                        Neutron Shielding Thermal Sensor Grid
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        ALL 8 ZONES SUPERCONDUCTING/PASSIVE
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {thermalSensors.map((sensor, idx) => (
                        <div
                          key={idx}
                          className="bg-[#111827] border border-[#1E293B] rounded p-2 text-xs font-mono"
                        >
                          <div className="text-slate-400 truncate text-[11px] font-bold">{sensor.zone}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-rose-300 font-bold">{sensor.temp}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${getStatusBadge(sensor.status)}`}>
                              {sensor.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PANE 3: CENTER-RIGHT SUPERCONDUCTING MAGLEV & LIQUID-HELIUM LOOP MATRIX (5 cols) */}
                <div className="xl:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 md:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                          Superconducting MagLev & Cryo Matrix
                        </h2>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        45 kN REPULSIVE DAMPING
                      </span>
                    </div>

                    {/* 4-Wheel MagLev Telemetry Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {wheels.map((wheel) => (
                        <div
                          key={wheel.id}
                          className="bg-[#111827] border border-[#1E293B] rounded-md p-3 font-mono relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-slate-200 tracking-wider">
                              {wheel.id} // {wheel.name}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(wheel.damperState)}`}>
                              {wheel.damperState}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase">Ride Clearance</div>
                              <div className="text-lg font-black text-rose-300">
                                {wheel.clearanceMm.toFixed(1)} <span className="text-xs text-slate-400">mm</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase">Repulsive Force</div>
                              <div className="text-lg font-black text-cyan-300">
                                {wheel.repulsiveForceKn.toFixed(1)} <span className="text-xs text-slate-400">kN</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase">Hub Output</div>
                              <div className="text-xs font-bold text-slate-200">
                                {wheel.motorPowerKw} kW <span className="text-[10px] text-slate-400">({wheel.motorTorqueNm} Nm)</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase">Slip Angle</div>
                              <div className="text-xs font-bold text-amber-300">
                                {wheel.slipAngleDeg > 0 ? `+${wheel.slipAngleDeg}` : wheel.slipAngleDeg}°
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Clearance bar */}
                          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 transition-all duration-300"
                              style={{ width: `${(wheel.clearanceMm / 20) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Liquid Helium Cryostat Loop Monitors */}
                    <div className="bg-[#111827] border border-[#1E293B] rounded-md p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                            Supercritical He-4 Loop & Accumulator
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          CLOSED LOOP RECIRC
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-center">
                        <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Cryostat Temp</div>
                          <div className="text-base font-black text-rose-300">
                            {heliumTempK.toFixed(2)} K
                          </div>
                          <div className="text-[10px] text-slate-400">-268.95 °C</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Boil-Off Press</div>
                          <div className="text-base font-black text-cyan-300">
                            {isPurgingHelium ? purgePressureDrop.toFixed(2) : heliumPressureBar.toFixed(2)} bar
                          </div>
                          <div className="text-[10px] text-emerald-400">NOMINAL</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Pump Flow</div>
                          <div className="text-base font-black text-purple-300">14.6 L/m</div>
                          <div className="text-[10px] text-slate-400">DUAL SCROLL</div>
                        </div>
                      </div>

                      {/* Helium accumulator visual bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                          <span>FLASH BOIL-OFF ACCUMULATOR VOLUME</span>
                          <span className="text-cyan-300 font-bold">58% RESERVE</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[58%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QUICK-ACTION BUTTONS ROW */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1E293B]">
                    <button
                      onClick={handleRecalibrateCoils}
                      disabled={isCalibratingCoils}
                      className="px-3 py-2.5 rounded bg-[#111827] border border-[#1E293B] hover:border-purple-500 text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 text-purple-400 ${isCalibratingCoils ? 'animate-spin' : ''}`} />
                      <span>{isCalibratingCoils ? `CALIBRATING (${calibrationProgress}%)` : 'Recalibrate Coils'}</span>
                    </button>

                    <button
                      onClick={handlePurgeHelium}
                      disabled={isPurgingHelium}
                      className="px-3 py-2.5 rounded bg-[#111827] border border-[#1E293B] hover:border-cyan-500 text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Wind className={`w-3.5 h-3.5 text-cyan-400 ${isPurgingHelium ? 'animate-pulse' : ''}`} />
                      <span>{isPurgingHelium ? 'VENTING...' : 'Purge Helium Loop'}</span>
                    </button>

                    <button
                      onClick={handleTriggerSymmetrizer}
                      disabled={isSymmetrizing}
                      className="px-3 py-2.5 rounded bg-[#111827] border border-[#1E293B] hover:border-amber-500 text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSymmetrizing ? 'SHIMMING...' : 'Trigger Symmetrizer'}</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-2.5 rounded bg-rose-950/60 border border-rose-600/70 hover:bg-rose-900/60 text-rose-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-rose-300" />
                      <span>Export Telemetry CSV</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PANE 4: BOTTOM HIGH-SPEED FUSION STINT & MAGNETIC SECTOR LEDGER */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1E293B] mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-rose-400" />
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      High-Speed Fusion Stint & Sector Ledger (14 Sectors)
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>TRACK: NORDSCHLEIFE HYBRID PROVING GROUND</span>
                    <span className="text-rose-400 font-bold">TOTAL LAP TIME: 4:13.824</span>
                  </div>
                </div>

                {/* Data Table with py-3.5 vertical clearance & zero clipped columns */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider">
                        <th className="py-2.5 px-3">Sector</th>
                        <th className="py-2.5 px-3">Track Checkpoint Name</th>
                        <th className="py-2.5 px-3">Sector Time</th>
                        <th className="py-2.5 px-3">Trap Speed</th>
                        <th className="py-2.5 px-3">Core Temp (MK)</th>
                        <th className="py-2.5 px-3">Toroidal Field</th>
                        <th className="py-2.5 px-3">MagLev Gap</th>
                        <th className="py-2.5 px-3">Core Output</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono text-xs md:text-sm">
                      {sectorRecords.map((sector) => {
                        const isCurrent = sector.sectorNumber === activeSector;
                        return (
                          <tr
                            key={sector.sectorNumber}
                            className={`transition-colors border-b border-slate-800 hover:bg-[#1E293B]/40 ${
                              isCurrent ? 'bg-rose-950/30 border-l-4 border-l-rose-500' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3 font-bold text-slate-200">
                              <span className="flex items-center gap-1.5">
                                {isCurrent && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
                                S-{sector.sectorNumber.toString().padStart(2, '0')}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-300 font-semibold">{sector.name}</td>
                            <td className="py-3.5 px-3 font-black text-rose-300 tabular-nums">
                              {sector.timeSec.toFixed(3)}s{' '}
                              <span className={`text-[10px] font-normal ${sector.deltaSec < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                ({sector.deltaSec < 0 ? '' : '+'}{sector.deltaSec.toFixed(3)}s)
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-200 tabular-nums">{sector.trapSpeedKmh.toFixed(1)} km/h</td>
                            <td className="py-3.5 px-3 text-amber-300 tabular-nums">{sector.peakTempMk.toFixed(2)} MK</td>
                            <td className="py-3.5 px-3 text-purple-300 tabular-nums">{sector.meanFieldTesla.toFixed(2)} T</td>
                            <td className="py-3.5 px-3 text-cyan-300 tabular-nums">{sector.maglevGapMm.toFixed(1)} mm</td>
                            <td className="py-3.5 px-3 text-slate-200 tabular-nums font-bold">{sector.powerKw.toLocaleString()} kW</td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(sector.status)}`}>
                                {sector.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TOKAMAK CONFINEMENT DEEP DIVE */}
          {activeTab === 'TOKAMAK CONFINEMENT' && (
            <>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      12 Superconducting Toroidal Coils Diagnostics Matrix
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Individual ReBCO 2G High-Temperature Superconductor current feeds, quench margins, and phase angles.
                    </p>
                  </div>
                  <button
                    onClick={handleRecalibrateCoils}
                    className="px-3 py-1.5 rounded bg-purple-950/70 border border-purple-600 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> RE-ALIGN ALL PHASES
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {coils.map((coil) => (
                    <div
                      key={coil.id}
                      onClick={() => setSelectedCoil(coil)}
                      className="bg-[#111827] border border-[#1E293B] hover:border-rose-500 rounded p-3.5 font-mono cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-slate-100 group-hover:text-rose-300">
                          {coil.label}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getStatusBadge(coil.status)}`}>
                          {coil.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Superconducting Current:</span>
                          <span className="text-rose-300 font-bold">{coil.currentKA} kA</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Field Strength:</span>
                          <span className="text-purple-300 font-bold">{coil.fieldTesla} T</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Tape Stack Temperature:</span>
                          <span className="text-emerald-300 font-bold">{coil.tempK} K</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Geometric Phase:</span>
                          <span className="text-slate-300">{coil.angleDeg}°</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>L: {coil.inductanceH} H</span>
                        <span className="text-rose-400 font-bold group-hover:underline">VIEW COIL &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 3: MAGLEV & CRYO DEEP DIVE */}
          {activeTab === 'MAGLEV & CRYO' && (
            <>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 space-y-5">
                <div className="border-b border-[#1E293B] pb-3">
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    Quad Superconducting Magnetic Levitation Chassis
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Repulsive Meissner-effect levitation pins and quad high-flux direct-drive induction hub motors.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {wheels.map((w) => (
                    <div key={w.id} className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 font-mono">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 text-xs font-black">
                            {w.id}
                          </span>
                          <span className="text-sm font-black text-slate-100">{w.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusBadge(w.damperState)}`}>
                          {w.damperState}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Ride Clearance</div>
                          <div className="text-xl font-black text-rose-300">{w.clearanceMm} mm</div>
                          <div className="text-[10px] text-emerald-400">Target: 12.0 mm</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Repulsive Force</div>
                          <div className="text-xl font-black text-cyan-300">{w.repulsiveForceKn} kN</div>
                          <div className="text-[10px] text-slate-400">Max: 45.0 kN</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Coil Temp</div>
                          <div className="text-xl font-black text-purple-300">{w.coilTempK} K</div>
                          <div className="text-[10px] text-emerald-400">Superconducting</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Hub Motor Output</div>
                          <div className="text-lg font-bold text-slate-100">{w.motorPowerKw} kW</div>
                          <div className="text-[10px] text-slate-400">{Math.round(w.motorPowerKw * 1.341)} HP</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Torque Vector</div>
                          <div className="text-lg font-bold text-slate-100">{w.motorTorqueNm} Nm</div>
                          <div className="text-[10px] text-slate-400">Direct Drive</div>
                        </div>

                        <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Magnetic Slip Angle</div>
                          <div className="text-lg font-bold text-amber-300">{w.slipAngleDeg}°</div>
                          <div className="text-[10px] text-slate-400">Active Steering</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 4: FUSION SECTOR LEDGER EXPANDED */}
          {activeTab === 'FUSION SECTOR LEDGER' && (
            <>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1E293B] gap-2">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      Full 14-Sector High-Speed Fusion Stint Telemetry
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Historical and live telemetry per track sector with thermal peak records and magnetic damping gaps.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
                  >
                    <Download className="w-4 h-4" /> EXPORT TELEMETRY CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-3">Sector</th>
                        <th className="py-3 px-3">Sector Name</th>
                        <th className="py-3 px-3">Time</th>
                        <th className="py-3 px-3">Speed</th>
                        <th className="py-3 px-3">Core MK</th>
                        <th className="py-3 px-3">Tesla</th>
                        <th className="py-3 px-3">MagLev Gap</th>
                        <th className="py-3 px-3">kW</th>
                        <th className="py-3 px-3">Delta</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs md:text-sm">
                      {sectorRecords.map((s) => (
                        <tr key={s.sectorNumber} className="border-b border-slate-800 hover:bg-[#1E293B]/40">
                          <td className="py-3.5 px-3 font-bold text-slate-200">
                            S-{s.sectorNumber.toString().padStart(2, '0')}
                          </td>
                          <td className="py-3.5 px-3 text-slate-300 font-semibold">{s.name}</td>
                          <td className="py-3.5 px-3 font-black text-rose-300">{s.timeSec.toFixed(3)}s</td>
                          <td className="py-3.5 px-3 text-slate-200">{s.trapSpeedKmh.toFixed(1)} km/h</td>
                          <td className="py-3.5 px-3 text-amber-300">{s.peakTempMk.toFixed(2)} MK</td>
                          <td className="py-3.5 px-3 text-purple-300">{s.meanFieldTesla.toFixed(2)} T</td>
                          <td className="py-3.5 px-3 text-cyan-300">{s.maglevGapMm.toFixed(1)} mm</td>
                          <td className="py-3.5 px-3 text-slate-200">{s.powerKw.toLocaleString()} kW</td>
                          <td className={`py-3.5 px-3 font-bold ${s.deltaSec < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {s.deltaSec < 0 ? '' : '+'}{s.deltaSec.toFixed(3)}s
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(s.status)}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 5: SYSTEM LOGS & INCIDENT ACTIONS */}
          {activeTab === 'SYSTEM LOGS' && (
            <>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      System Action & Incident Audit Log
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Real-time magnetic quench triggers, helium loop purges, and poloidal field shimming events.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {incidentLogs.length} EVENTS RECORDED
                  </span>
                </div>

                <div className="space-y-2.5">
                  {incidentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#111827] border border-[#1E293B] rounded p-3.5 font-mono text-xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold">{log.timestamp}</span>
                          <span className="text-slate-200 font-black">{log.type}</span>
                          <span className="text-[10px] text-slate-400">({log.id})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(log.severity)}`}>
                          {log.severity}
                        </span>
                      </div>

                      <div className="text-slate-300 font-sans text-xs">{log.description}</div>
                      <div className="text-emerald-400 text-[11px] pt-1 border-t border-slate-800">
                        <span className="text-slate-400 font-mono">Mitigation Action:</span> {log.actionTaken}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>

        {/* MODAL: COIL NODE INSPECTOR */}
        {selectedCoil && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg max-w-md w-full p-5 font-mono space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-slate-100 uppercase">
                    Coil Node {selectedCoil.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCoil(null)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#111827] p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Superconducting Current:</span>
                    <span className="text-rose-300 font-bold">{selectedCoil.currentKA} kA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Toroidal Field Peak:</span>
                    <span className="text-purple-300 font-bold">{selectedCoil.fieldTesla} Tesla</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ReBCO Stack Temp:</span>
                    <span className="text-emerald-300 font-bold">{selectedCoil.tempK} Kelvin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Toroidal Position Angle:</span>
                    <span className="text-slate-200 font-bold">{selectedCoil.angleDeg}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Self-Inductance:</span>
                    <span className="text-slate-200 font-bold">{selectedCoil.inductanceH} H</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operating Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedCoil.status)}`}>
                      {selectedCoil.status}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Active cryogenic feed subcooling rate: 0.8 L/min liquid helium. Quench margin: +4.8 K before transition to normal conducting state.
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#1E293B]">
                <button
                  onClick={() => {
                    playDeckTone(1050, 'sine', 0.1);
                    setSelectedCoil(null);
                  }}
                  className="flex-1 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
                >
                  Confirm & Return
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: FIELD SYMMETRIZER RUNNING NOTIFICATION */}
        {isSymmetrizing && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-amber-500/80 rounded-lg p-6 max-w-sm w-full text-center font-mono space-y-3 shadow-2xl">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Magnetic Field Symmetrizer
              </h3>
              <div className="text-xs text-amber-300 font-bold animate-pulse">
                {symmetrizePhase}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-amber-400 w-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* FOOTER: SYSTEM ARCHITECT TELEMETRY VERIFICATION */}
        <footer className="border-t border-[#1E293B] bg-[#0B0F17] px-3 md:px-6 py-3 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AURA & GRID // GHOST FACTORY - PROTO-13 TELEMETRY CORE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>CAN-FD BUS: 1000 kB/s</span>
              <span>CRYOGENIC CRYOSTAT: 4.2 KELVIN</span>
              <span className="text-rose-400 font-bold">MEISSNER FLUX LOCK</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
