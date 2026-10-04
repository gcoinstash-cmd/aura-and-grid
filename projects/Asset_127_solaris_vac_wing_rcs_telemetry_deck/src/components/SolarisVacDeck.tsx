/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SOLARIS VAC-WING // COLD-GAS RCS HYPERCAR PROTO-12
 * Flagship Aerospace Motorsport Operations & Telemetry Deck
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Flame,
  Gauge,
  Zap,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Download,
  Play,
  Pause,
  ShieldAlert,
  Wind,
  Layers,
  Cpu,
  Compass,
  CheckCircle2,
  XCircle,
  Radio,
  BarChart3,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Info,
  Power,
  Crosshair,
  Lock,
  Unlock,
} from 'lucide-react';

// Type definitions
export interface ThrusterNozzle {
  id: string;
  index: number;
  name: string;
  location: string;
  type: 'FRONT_BRAKE' | 'DOWNWARD_SLAM' | 'LATERAL_VECTOR' | 'DIFFUSER_VACUUM';
  thrustKn: number;
  maxThrustKn: number;
  firing: boolean;
  angleDeg: number;
  solenoidLatencyMs: number;
  tempCelsius: number;
  x: number; // SVG coordinates
  y: number;
  plumeDx: number;
  plumeDy: number;
}

export interface SectorRecord {
  sector: number;
  name: string;
  entrySpeed: number;
  apexSpeed: number;
  exitSpeed: number;
  lateralG: number;
  gasMassUsedGrams: number;
  downforceDeltaKg: number;
  compressorMode: string;
  status: 'OPTIMAL' | 'HIGH_G_APEX' | 'REGEN_ACTIVE' | 'BURST_FIRED';
}

export interface DiagnosticEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  nozzleId?: string;
  durationMs: number;
  message: string;
}

export const INITIAL_NOZZLES: ThrusterNozzle[] = [
  {
    id: 'NOZZLE_01',
    index: 1,
    name: 'FL-RCS Fore Brake',
    location: 'Front Left Canard',
    type: 'FRONT_BRAKE',
    thrustKn: 2.1,
    maxThrustKn: 3.5,
    firing: false,
    angleDeg: -45,
    solenoidLatencyMs: 1.08,
    tempCelsius: -12.4,
    x: 185,
    y: 195,
    plumeDx: -40,
    plumeDy: -35,
  },
  {
    id: 'NOZZLE_02',
    index: 2,
    name: 'FR-RCS Fore Brake',
    location: 'Front Right Canard',
    type: 'FRONT_BRAKE',
    thrustKn: 2.1,
    maxThrustKn: 3.5,
    firing: false,
    angleDeg: 45,
    solenoidLatencyMs: 1.04,
    tempCelsius: -11.9,
    x: 415,
    y: 195,
    plumeDx: 40,
    plumeDy: -35,
  },
  {
    id: 'NOZZLE_03',
    index: 3,
    name: 'ML-SLAM Venturi Clamp',
    location: 'Mid Chassis Venturi Port (L)',
    type: 'DOWNWARD_SLAM',
    thrustKn: 3.8,
    maxThrustKn: 5.0,
    firing: true,
    angleDeg: 0,
    solenoidLatencyMs: 0.95,
    tempCelsius: -8.5,
    x: 170,
    y: 430,
    plumeDx: -45,
    plumeDy: 0,
  },
  {
    id: 'NOZZLE_04',
    index: 4,
    name: 'MR-SLAM Venturi Clamp',
    location: 'Mid Chassis Venturi Port (R)',
    type: 'DOWNWARD_SLAM',
    thrustKn: 3.8,
    maxThrustKn: 5.0,
    firing: true,
    angleDeg: 0,
    solenoidLatencyMs: 0.98,
    tempCelsius: -8.2,
    x: 430,
    y: 430,
    plumeDx: 45,
    plumeDy: 0,
  },
  {
    id: 'NOZZLE_05',
    index: 5,
    name: 'RL-VEC Yaw Authority',
    location: 'Rear Left Fender Spat',
    type: 'LATERAL_VECTOR',
    thrustKn: 2.4,
    maxThrustKn: 4.0,
    firing: false,
    angleDeg: -90,
    solenoidLatencyMs: 1.12,
    tempCelsius: -14.1,
    x: 165,
    y: 690,
    plumeDx: -48,
    plumeDy: 15,
  },
  {
    id: 'NOZZLE_06',
    index: 6,
    name: 'RR-VEC Yaw Authority',
    location: 'Rear Right Fender Spat',
    type: 'LATERAL_VECTOR',
    thrustKn: 2.4,
    maxThrustKn: 4.0,
    firing: false,
    angleDeg: 90,
    solenoidLatencyMs: 1.15,
    tempCelsius: -13.8,
    x: 435,
    y: 690,
    plumeDx: 48,
    plumeDy: 15,
  },
  {
    id: 'NOZZLE_07',
    index: 7,
    name: 'V-DIFF-L Ground Ejector',
    location: 'Rear Underfloor Venturi (L)',
    type: 'DIFFUSER_VACUUM',
    thrustKn: 1.9,
    maxThrustKn: 3.0,
    firing: true,
    angleDeg: 180,
    solenoidLatencyMs: 1.02,
    tempCelsius: -9.8,
    x: 250,
    y: 810,
    plumeDx: 0,
    plumeDy: 50,
  },
  {
    id: 'NOZZLE_08',
    index: 8,
    name: 'V-DIFF-R Ground Ejector',
    location: 'Rear Underfloor Venturi (R)',
    type: 'DIFFUSER_VACUUM',
    thrustKn: 1.9,
    maxThrustKn: 3.0,
    firing: true,
    angleDeg: 180,
    solenoidLatencyMs: 0.99,
    tempCelsius: -10.1,
    x: 350,
    y: 810,
    plumeDx: 0,
    plumeDy: 50,
  },
];

export const INITIAL_SECTORS: SectorRecord[] = [
  { sector: 1, name: 'Hangar Straight Launch', entrySpeed: 210.4, apexSpeed: 312.8, exitSpeed: 342.1, lateralG: 1.25, gasMassUsedGrams: 42.5, downforceDeltaKg: 480, compressorMode: 'HARVESTING (+1.2 bar)', status: 'OPTIMAL' },
  { sector: 2, name: 'Orbital Turn 1 (Supersonic)', entrySpeed: 342.1, apexSpeed: 198.5, exitSpeed: 246.0, lateralG: 3.82, gasMassUsedGrams: 185.2, downforceDeltaKg: 890, compressorMode: 'BRAKE REGEN (+4.8 bar)', status: 'BURST_FIRED' },
  { sector: 3, name: 'Apex Zero-Slip Hairpin', entrySpeed: 246.0, apexSpeed: 114.2, exitSpeed: 182.7, lateralG: 4.10, gasMassUsedGrams: 240.0, downforceDeltaKg: 1120, compressorMode: 'MAX COMPRESSION (+5.5 bar)', status: 'HIGH_G_APEX' },
  { sector: 4, name: 'Solaris S-Chicane Inbound', entrySpeed: 182.7, apexSpeed: 215.3, exitSpeed: 260.4, lateralG: 3.45, gasMassUsedGrams: 110.4, downforceDeltaKg: 640, compressorMode: 'STEADY BUFFER', status: 'OPTIMAL' },
  { sector: 5, name: 'Solaris S-Chicane Outbound', entrySpeed: 260.4, apexSpeed: 238.1, exitSpeed: 295.6, lateralG: 3.65, gasMassUsedGrams: 134.8, downforceDeltaKg: 710, compressorMode: 'PNEUMATIC CHARGE', status: 'OPTIMAL' },
  { sector: 6, name: 'Plasma Backstretch', entrySpeed: 295.6, apexSpeed: 355.2, exitSpeed: 362.4, lateralG: 0.95, gasMassUsedGrams: 25.0, downforceDeltaKg: 390, compressorMode: 'EXPANSION OPTIMIZED', status: 'OPTIMAL' },
  { sector: 7, name: 'Braking G-Slam Zone 7', entrySpeed: 362.4, apexSpeed: 168.0, exitSpeed: 210.5, lateralG: 2.90, gasMassUsedGrams: 215.6, downforceDeltaKg: 1250, compressorMode: 'BRAKE REGEN (+6.1 bar)', status: 'BURST_FIRED' },
  { sector: 8, name: 'Karman Vortex Sweeper', entrySpeed: 210.5, apexSpeed: 224.7, exitSpeed: 252.3, lateralG: 3.78, gasMassUsedGrams: 162.1, downforceDeltaKg: 830, compressorMode: 'HARVESTING (+2.0 bar)', status: 'OPTIMAL' },
  { sector: 9, name: 'Atmospheric Carousel', entrySpeed: 252.3, apexSpeed: 188.4, exitSpeed: 220.1, lateralG: 3.92, gasMassUsedGrams: 198.4, downforceDeltaKg: 960, compressorMode: 'ACTIVE REGEN (+3.4 bar)', status: 'HIGH_G_APEX' },
  { sector: 10, name: 'Sub-Floor Venturi Trench', entrySpeed: 220.1, apexSpeed: 275.8, exitSpeed: 308.2, lateralG: 2.85, gasMassUsedGrams: 88.0, downforceDeltaKg: 770, compressorMode: 'IDLE BUFFER', status: 'OPTIMAL' },
  { sector: 11, name: 'Apex Magnet Clamp Complex', entrySpeed: 308.2, apexSpeed: 142.6, exitSpeed: 195.0, lateralG: 4.05, gasMassUsedGrams: 230.5, downforceDeltaKg: 1310, compressorMode: 'BRAKE REGEN (+5.9 bar)', status: 'HIGH_G_APEX' },
  { sector: 12, name: 'Thruster Exit Chute', entrySpeed: 195.0, apexSpeed: 240.5, exitSpeed: 280.0, lateralG: 3.12, gasMassUsedGrams: 120.2, downforceDeltaKg: 680, compressorMode: 'HARVESTING (+1.8 bar)', status: 'OPTIMAL' },
  { sector: 13, name: 'Penultimate Blind Crest', entrySpeed: 280.0, apexSpeed: 265.0, exitSpeed: 305.4, lateralG: 3.52, gasMassUsedGrams: 145.0, downforceDeltaKg: 850, compressorMode: 'COMPRESSION (+2.2 bar)', status: 'OPTIMAL' },
  { sector: 14, name: 'Final Mainstrafe Straight', entrySpeed: 305.4, apexSpeed: 345.9, exitSpeed: 355.2, lateralG: 1.10, gasMassUsedGrams: 38.0, downforceDeltaKg: 520, compressorMode: 'PEAK BUFFER (350 bar)', status: 'OPTIMAL' },
];

export const INITIAL_DIAGNOSTICS: DiagnosticEvent[] = [
  { id: 'EV-1088', timestamp: '14:02:18.420', type: 'PRE_FLIGHT_ARM', severity: 'INFO', nozzleId: 'ALL_NOZZLES', durationMs: 50, message: 'All 8 cold-gas solenoids calibrated at 350 bar test pressure.' },
  { id: 'EV-1089', timestamp: '14:04:30.115', type: 'TANK_PRESSURIZED', severity: 'INFO', durationMs: 0, message: 'Composite nitrogen vessel pressurized to 350.0 bar nominal threshold.' },
  { id: 'EV-1090', timestamp: '14:06:55.840', type: 'RCS_VECTOR_BURST', severity: 'INFO', nozzleId: 'NOZZLE_01', durationMs: 180, message: 'RCS Vector Burst engaged during Sector 3 zero-slip hairpin.' },
  { id: 'EV-1091', timestamp: '14:07:44.200', type: 'YAW_CORRECTION', severity: 'INFO', nozzleId: 'NOZZLE_06', durationMs: 95, message: 'Yaw correction thruster pulse triggered by 0.08 rad/s slip angle.' },
  { id: 'EV-1092', timestamp: '14:09:12.630', type: 'DOWNFORCE_SLAM', severity: 'INFO', nozzleId: 'NOZZLE_03/04', durationMs: 240, message: 'Twin downward slam thrusters fired at 14.2 kN total clamp in Sector 11.' },
  { id: 'EV-1093', timestamp: '14:10:05.100', type: 'BRAKE_REGEN_CHARGE', severity: 'INFO', durationMs: 850, message: 'Regenerative compressor harvested 28 kJ braking energy into nitrogen buffer.' },
  { id: 'EV-1094', timestamp: '14:11:32.410', type: 'VALVE_DUTY_SPIKE', severity: 'WARN', nozzleId: 'NOZZLE_02', durationMs: 320, message: 'Corner vectoring solenoid reached 78% duty cycle during sustained lateral G.' },
  { id: 'EV-1095', timestamp: '14:12:00.000', type: 'TELEMETRY_SYNC', severity: 'INFO', durationMs: 0, message: 'Telemetry buffer synced with 0 dropped CAN bus packets across 8 nozzles.' },
];

export default function SolarisVacDeck(): React.ReactElement {
  // Operational simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 5>(1);
  const [activeTab, setActiveTab] = useState<
    'FLIGHT DECK HUD' | 'RCS THRUSTER MAP' | 'SOLID-STATE BUS' | 'SECTOR DYNAMICS LEDGER' | 'SYSTEM LOGS'
  >('FLIGHT DECK HUD');
  const [telemetryMode, setTelemetryMode] = useState<
    'ORBITAL VECTORING' | 'V-MAX ZERO DRAG' | 'APEX MAGNET CLAMP' | 'GAS PURGE'
  >('ORBITAL VECTORING');
  const [rcsVectorBurstEnabled, setRcsVectorBurstEnabled] = useState<boolean>(true);
  const [selectedNozzle, setSelectedNozzle] = useState<ThrusterNozzle | null>(null);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    null | 'REPRESSURIZE' | 'CALIBRATE' | 'EMERGENCY_DUMP' | 'EXPORT_CSV'
  >(null);
  const [modalProgress, setModalProgress] = useState<number>(0);
  const [modalStatusText, setModalStatusText] = useState<string>('');

  // Primary telemetry values (dynamic)
  const [currentSectorIndex, setCurrentSectorIndex] = useState<number>(5); // Sector 6
  const [groundSpeed, setGroundSpeed] = useState<number>(355.2);
  const [drivePowerKw, setDrivePowerKw] = useState<number>(1640.0);
  const [nitrogenMassKg, setNitrogenMassKg] = useState<number>(18.4);
  const [nitrogenPressureBar, setNitrogenPressureBar] = useState<number>(348.5);
  const [lateralG, setLateralG] = useState<number>(3.85);
  const [longitudinalG, setLongitudinalG] = useState<number>(-1.42);
  const [thrusterForceKn, setThrusterForceKn] = useState<number>(14.2);
  const [batteryTempCelsius, setBatteryTempCelsius] = useState<number>(28.4);
  const [inverter1Voltage, setInverter1Voltage] = useState<number>(994.5);
  const [inverter2Voltage, setInverter2Voltage] = useState<number>(996.2);
  const [compressorDuty, setCompressorDuty] = useState<number>(44.0);
  const [filterHighGOnly, setFilterHighGOnly] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'CRITICAL'>('ALL');

  // Nozzles and Diagnostics lists
  const [nozzles, setNozzles] = useState<ThrusterNozzle[]>(INITIAL_NOZZLES);
  const [sectors, setSectors] = useState<SectorRecord[]>(INITIAL_SECTORS);
  const [diagnostics, setDiagnostics] = useState<DiagnosticEvent[]>(INITIAL_DIAGNOSTICS);

  // Simulation step reference
  const tickRef = useRef<number>(0);

  // Simulation tick loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = simSpeed === 5 ? 120 : 450;
    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      // Cycle sectors smoothly
      if (t % 14 === 0) {
        setCurrentSectorIndex((prev) => (prev + 1) % sectors.length);
      }

      const activeSector = sectors[currentSectorIndex] || sectors[0];

      // Physical fluctuation formulas
      const speedNoise = Math.sin(t * 0.4) * 8.5;
      const targetSpeed = activeSector.apexSpeed + speedNoise;
      setGroundSpeed(Math.max(110, Math.min(382, Number(targetSpeed.toFixed(1)))));

      // Drive Power kW
      const targetPower = Math.abs(targetSpeed) > 300 ? 1640 - (Math.random() * 25) : 920 + Math.sin(t * 0.6) * 350;
      setDrivePowerKw(Number(targetPower.toFixed(0)));

      // Lateral G-Force: based on sector apex + cornering
      const gNoise = (Math.cos(t * 0.7) * 0.45);
      const computedG = activeSector.lateralG + gNoise;
      setLateralG(Number(computedG.toFixed(2)));

      // Longitudinal G
      const compLongG = Math.sin(t * 0.5) * 2.1 - 0.4;
      setLongitudinalG(Number(compLongG.toFixed(2)));

      // Dynamic thruster firing calculation based on mode and G-force
      setNozzles((prev) =>
        prev.map((nz) => {
          let shouldFire = false;
          let thrust = 0;

          if (telemetryMode === 'GAS PURGE') {
            shouldFire = true;
            thrust = nz.maxThrustKn * 0.95;
          } else if (telemetryMode === 'APEX MAGNET CLAMP') {
            // Downward and diffuser clamp thrusters active
            if (nz.type === 'DOWNWARD_SLAM' || nz.type === 'DIFFUSER_VACUUM') {
              shouldFire = true;
              thrust = nz.maxThrustKn * (0.85 + Math.random() * 0.15);
            }
          } else if (telemetryMode === 'V-MAX ZERO DRAG') {
            // Only diffuser ejectors trim wake
            if (nz.type === 'DIFFUSER_VACUUM') {
              shouldFire = true;
              thrust = nz.maxThrustKn * 0.65;
            }
          } else {
            // ORBITAL VECTORING
            if (computedG > 3.0) {
              if (nz.type === 'LATERAL_VECTOR' || nz.type === 'DOWNWARD_SLAM') {
                shouldFire = true;
                thrust = nz.maxThrustKn * (0.6 + Math.random() * 0.35);
              }
            }
            if (compLongG < -1.0 && nz.type === 'FRONT_BRAKE') {
              shouldFire = true;
              thrust = nz.maxThrustKn * 0.8;
            }
            if (nz.type === 'DIFFUSER_VACUUM') {
              shouldFire = true;
              thrust = nz.maxThrustKn * 0.75;
            }
          }

          return {
            ...nz,
            firing: shouldFire,
            thrustKn: shouldFire ? Number(thrust.toFixed(2)) : 0,
          };
        })
      );

      // Compute Total Thrust kN
      const activeThrustTotal = nozzles.reduce((acc, nz) => acc + (nz.firing ? nz.thrustKn : 0), 0);
      setThrusterForceKn(Number(activeThrustTotal.toFixed(1)));

      // Gas mass and compressor dynamics
      setNitrogenMassKg((prev) => {
        let burnRate = activeThrustTotal > 8 ? 0.015 : 0.004;
        if (!rcsVectorBurstEnabled) burnRate *= 0.5;

        // Compressor harvesting kicks in during heavy braking
        const regenRecharge = compLongG < -0.8 ? 0.018 : 0.002;
        const nextMass = prev - burnRate + regenRecharge;
        return Number(Math.max(10.0, Math.min(22.0, nextMass)).toFixed(2));
      });

      // Pressure variation
      setNitrogenPressureBar((prev) => {
        const pressurePulse = (Math.sin(t * 0.3) * 1.5);
        const base = 347.0 + pressurePulse;
        return Number(Math.max(280, Math.min(350, base)).toFixed(1));
      });

      // Battery Temp & Inverters
      setBatteryTempCelsius((prev) => {
        const temp = 28.4 + Math.sin(t * 0.2) * 1.2;
        return Number(temp.toFixed(1));
      });

      setInverter1Voltage(Number((994.0 + Math.sin(t * 0.5) * 5.0).toFixed(1)));
      setInverter2Voltage(Number((996.0 + Math.cos(t * 0.5) * 4.5).toFixed(1)));
      setCompressorDuty(Number((35.0 + Math.abs(compLongG) * 22.0).toFixed(0)));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, telemetryMode, rcsVectorBurstEnabled, currentSectorIndex, sectors, nozzles]);

  // Handlers for telemetry actions
  const triggerRepressurize = () => {
    setActiveModal('REPRESSURIZE');
    setModalProgress(0);
    setModalStatusText('Initializing 350-bar pneumatic compressor stage...');

    let p = 0;
    const timer = setInterval(() => {
      p += 20;
      setModalProgress(p);
      if (p === 40) setModalStatusText('Harvesting waste braking energy into nitrogen accumulator...');
      if (p === 80) setModalStatusText('Equalizing twin composite tank buffer manifolds...');
      if (p >= 100) {
        clearInterval(timer);
        setModalStatusText('Tank repressurization nominal: 350.0 bar sealed.');
        setNitrogenMassKg(21.8);
        setNitrogenPressureBar(350.0);
        addDiagnostic('NITROGEN_TANK_REPRESSURIZED', 'INFO', 1200, 'Composite vessel repressurized to 350.0 bar nominal via regenerative compressor.');
      }
    }, 300);
  };

  const triggerCalibrateNozzles = () => {
    setActiveModal('CALIBRATE');
    setModalProgress(0);
    setModalStatusText('Executing 8-port piezoelectric valve sweep...');

    let p = 0;
    const timer = setInterval(() => {
      p += 12.5;
      setModalProgress(p);
      const nozzleIndex = Math.min(8, Math.ceil(p / 12.5));
      setModalStatusText(`Pulsing Solenoid #${nozzleIndex}: latency verified at < 1.05 ms...`);

      if (p >= 100) {
        clearInterval(timer);
        setModalStatusText('Calibration verified: 8/8 nozzles synchronized with 0.00 bar/min leak delta.');
        addDiagnostic('NOZZLE_ARRAY_CALIBRATED', 'INFO', 850, 'Full 8-nozzle piezoelectric sweep validated. CAN-FD latency 0.98ms.');
      }
    }, 280);
  };

  const triggerEmergencyDump = () => {
    setActiveModal('EMERGENCY_DUMP');
    setModalProgress(0);
    setModalStatusText('WARNING: Emergency purge interlock armed. Awaiting authorization...');
  };

  const executeEmergencyDump = () => {
    setModalStatusText('DEPRESSURIZING ALL 8 COLD-GAS NOZZLES RAPIDLY...');
    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setModalProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setNitrogenPressureBar(14.0);
        setNitrogenMassKg(1.2);
        setThrusterForceKn(0.0);
        setModalStatusText('EMERGENCY DUMP COMPLETE: Pressure safely evacuated to 14.0 bar reserve.');
        addDiagnostic('EMERGENCY_GAS_DUMP', 'CRITICAL', 2500, 'Manual emergency cold-gas purge initiated. Nitrogen tank dumped.');
      }
    }, 350);
  };

  const exportTelemetryCsv = () => {
    setActiveModal('EXPORT_CSV');
    setModalStatusText('Generating authenticated CSV telemetry log from sector telemetry engine...');

    const headers = [
      'Sector',
      'Sector Name',
      'Entry Speed (km/h)',
      'Apex Speed (km/h)',
      'Exit Speed (km/h)',
      'Peak Lateral G',
      'Gas Mass Burned (g)',
      'Downforce Delta (kg)',
      'Compressor Mode',
      'Sector Status',
    ];

    const rows = sectors.map((s) => [
      s.sector,
      `"${s.name}"`,
      s.entrySpeed,
      s.apexSpeed,
      s.exitSpeed,
      s.lateralG,
      s.gasMassUsedGrams,
      s.downforceDeltaKg,
      `"${s.compressorMode}"`,
      s.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SOLARIS_PROTO12_TELEMETRY_LAP4_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addDiagnostic('TELEMETRY_CSV_EXPORT', 'INFO', 0, '14-Sector dynamics ledger exported to institutional CSV.');
    setModalStatusText('CSV downloaded successfully.');
  };

  const addDiagnostic = (type: string, severity: 'INFO' | 'WARN' | 'CRITICAL', durationMs: number, message: string) => {
    const newEvent: DiagnosticEvent = {
      id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      type,
      severity,
      durationMs,
      message,
    };
    setDiagnostics((prev) => [newEvent, ...prev.slice(0, 24)]);
  };

  // Filtered lists
  const filteredSectors = useMemo(() => {
    if (filterHighGOnly) {
      return sectors.filter((s) => s.lateralG >= 3.5);
    }
    return sectors;
  }, [sectors, filterHighGOnly]);

  const filteredDiagnostics = useMemo(() => {
    if (logFilter === 'ALL') return diagnostics;
    return diagnostics.filter((d) => d.severity === logFilter);
  }, [diagnostics, logFilter]);

  return (
    <>
      <div className="min-h-screen bg-[#02040A] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
        
        {/* ====================================================================
            TOP HEADER & ACTION CONTROLS (Anchored Title, Beacon, Single Row Controls)
            ==================================================================== */}
        <header className="border-b border-[#1E293B] bg-[#070B14]/90 backdrop-blur-md px-4 lg:px-6 py-2.5 sticky top-0 z-40">
          <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Title & Live Beacon */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                  <Wind className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 whitespace-nowrap">
                    SOLARIS VAC-WING
                  </h1>
                  <div className="text-[11px] font-mono tracking-wider text-purple-400 font-semibold flex items-center gap-1.5 uppercase">
                    <span>CHASSIS PROTO-12</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">COLD-GAS RCS HYPERCAR</span>
                  </div>
                </div>
              </div>

              {/* Beacon badge */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase whitespace-nowrap">
                  120 HZ // CAN-FD ARMED
                </span>
              </div>
            </div>

            {/* Operational Action Controls: Single h-9 row */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-9 px-3.5 rounded flex items-center gap-2 font-mono text-xs font-bold tracking-wider transition-colors border ${
                  isPlaying
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-200 hover:bg-purple-900/70'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-200 hover:bg-amber-900/70'
                }`}
                title="Pause or Resume Telemetry Simulator"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
              </button>

              {/* 1x / 5x Speed Selectors */}
              <div className="h-9 flex items-center bg-[#0F172A] border border-slate-800 rounded p-0.5">
                <button
                  onClick={() => setSimSpeed(1)}
                  className={`h-full px-2.5 rounded text-xs font-mono font-bold transition-colors ${
                    simSpeed === 1 ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1X
                </button>
                <button
                  onClick={() => setSimSpeed(5)}
                  className={`h-full px-2.5 rounded text-xs font-mono font-bold transition-colors ${
                    simSpeed === 5 ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  5X FAST
                </button>
              </div>

              {/* Keyed RCS Vector Burst Toggle */}
              <button
                onClick={() => {
                  setRcsVectorBurstEnabled(!rcsVectorBurstEnabled);
                  addDiagnostic(
                    rcsVectorBurstEnabled ? 'RCS_BURST_DISARMED' : 'RCS_BURST_ARMED',
                    rcsVectorBurstEnabled ? 'WARN' : 'INFO',
                    0,
                    rcsVectorBurstEnabled ? 'RCS Vector Burst / Slip Counter disengaged.' : 'RCS Vector Burst / Slip Counter fully armed.'
                  );
                }}
                className={`h-9 px-3.5 rounded flex items-center gap-2 font-mono text-xs font-bold tracking-wider transition-all border ${
                  rcsVectorBurstEnabled
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {rcsVectorBurstEnabled ? <Unlock className="w-3.5 h-3.5 text-purple-200" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                <span className="whitespace-nowrap">RCS BURST SLIP-COUNTER</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    rcsVectorBurstEnabled ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* ====================================================================
            VIEW TAB NAVIGATION (Scrollable, scrollbar-none, High contrast)
            ==================================================================== */}
        <div className="border-b border-[#1E293B] bg-[#080D18]">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
              {(
                [
                  'FLIGHT DECK HUD',
                  'RCS THRUSTER MAP',
                  'SOLID-STATE BUS',
                  'SECTOR DYNAMICS LEDGER',
                  'SYSTEM LOGS',
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`h-9 px-4 rounded text-xs md:text-sm font-mono font-bold tracking-wider whitespace-nowrap transition-all border flex items-center gap-2 ${
                      isActive
                        ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{tab}</span>
                    {tab === 'FLIGHT DECK HUD' && <Layers className="w-3.5 h-3.5 text-purple-400" />}
                    {tab === 'RCS THRUSTER MAP' && <Crosshair className="w-3.5 h-3.5 text-purple-400" />}
                    {tab === 'SOLID-STATE BUS' && <Zap className="w-3.5 h-3.5 text-purple-400" />}
                    {tab === 'SECTOR DYNAMICS LEDGER' && <BarChart3 className="w-3.5 h-3.5 text-purple-400" />}
                    {tab === 'SYSTEM LOGS' && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                        {diagnostics.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====================================================================
            MAIN FLIGHT DECK CONTAINER
            ==================================================================== */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-6 space-y-5">
          
          {/* 1. TOP POWERTRAIN & RCS ROCKET HUD STRIP */}
          <section className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
              <div>
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-purple-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>HUB CALLOUT // TELEMETRY STRIP</span>
                </div>
                <div className="text-sm md:text-base font-mono font-bold text-slate-200 mt-0.5">
                  SOLARIS VAC-WING // COLD-GAS RCS HYPERCAR PROTO-12
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  CURRENT SECTOR: <strong className="text-slate-100">{currentSectorIndex + 1}/14</strong> ({sectors[currentSectorIndex]?.name})
                </span>
                <span className="text-slate-700">|</span>
                <span>LAP 04 // PROTOCOL NOMINAL</span>
              </div>
            </div>

            {/* High-Contrast Large-Typography HUD Metric Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              
              {/* Ground Speed */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  GROUND SPEED
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {groundSpeed.toFixed(1)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">KM/H</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span>V-MAX: 382.0</span>
                  <span className="text-emerald-400">+1.4G ACCEL</span>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Total Drive Power */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  TOTAL DRIVE POWER
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {drivePowerKw.toFixed(0)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">KW</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span className="text-amber-400">2,200 BHP EQ</span>
                  <span className="text-slate-400">4x SiC AXLES</span>
                </div>
              </div>

              {/* RCS Nitrogen Mass */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  RCS NITROGEN MASS
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {nitrogenMassKg.toFixed(1)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">KG</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span className="text-purple-300">@ {nitrogenPressureBar.toFixed(0)} BAR</span>
                  <span className="text-emerald-400">REGEN ON</span>
                </div>
              </div>

              {/* Lateral G-Force */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  LATERAL G-FORCE
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {Math.abs(lateralG).toFixed(2)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">G</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span className={lateralG >= 3.8 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    PEAK 4.10 G
                  </span>
                  <span className="text-purple-300">APEX CLAMP</span>
                </div>
              </div>

              {/* Thruster Force Output */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  THRUSTER FORCE
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {thrusterForceKn.toFixed(1)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">KN</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span>8 NOZZLES</span>
                  <span className="text-amber-400 font-bold">14.2 MAX</span>
                </div>
              </div>

              {/* Solid-State Bus Temp */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded p-3.5 relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300">
                  SSB CELL TEMP
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-purple-400 mt-1">
                  {batteryTempCelsius.toFixed(1)}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1.5 uppercase">°C</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                  <span className="text-emerald-400">NOMINAL &lt; 45°</span>
                  <span className="text-slate-400">1,000V BUS</span>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================================
              CENTER ROW: 2-COLUMN VIEW (Center-Left: 6-Axis Thruster Canvas, Center-Right: Battery & Gas Matrix)
              Shown in 'FLIGHT DECK HUD', 'RCS THRUSTER MAP', 'SOLID-STATE BUS'
              ==================================================================== */}
          {(activeTab === 'FLIGHT DECK HUD' || activeTab === 'RCS THRUSTER MAP' || activeTab === 'SOLID-STATE BUS') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* CENTER-LEFT: 2D INTERACTIVE 6-AXIS THRUSTER VECTOR CANVAS */}
              <div
                className={`${
                  activeTab === 'RCS THRUSTER MAP' ? 'lg:col-span-12' : activeTab === 'SOLID-STATE BUS' ? 'hidden' : 'lg:col-span-7'
                } bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 flex flex-col shadow-xl`}
              >
                {/* Header & Modes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-purple-400" />
                      <span>6-AXIS THRUSTER VECTOR CANVAS</span>
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Top-down orbital interceptor schematic with 8 dynamic cold-gas nozzles & exhaust plumes.
                    </p>
                  </div>

                  {/* Clickable Telemetry Modes */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(
                      [
                        'ORBITAL VECTORING',
                        'V-MAX ZERO DRAG',
                        'APEX MAGNET CLAMP',
                        'GAS PURGE',
                      ] as const
                    ).map((mode) => {
                      const isModeActive = telemetryMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => {
                            setTelemetryMode(mode);
                            addDiagnostic('MODE_CHANGED', 'INFO', 0, `Telemetry mode switched to ${mode}.`);
                          }}
                          className={`h-7 px-2.5 rounded text-[11px] font-mono font-bold tracking-wider transition-colors border ${
                            isModeActive
                              ? 'bg-purple-600 border-purple-400 text-white shadow'
                              : 'bg-[#0F172A] border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SVG Canvas Visualizer Stage */}
                <div className="relative flex-1 min-h-[480px] bg-[#02040A] border border-slate-900 rounded flex items-center justify-center p-2 overflow-hidden">
                  
                  {/* Subtle Radar & Coordinate Grid */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <div className="absolute top-3 left-3 text-[11px] font-mono text-purple-400/80 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded">
                    YAW: {(lateralG * 1.8).toFixed(1)}°/s · ROLL: 0.12° · DOWNFORCE: +{sectors[currentSectorIndex]?.downforceDeltaKg || 890} KG
                  </div>
                  <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>CLICK ANY NOZZLE PORT (1-8) TO INSPECT</span>
                  </div>

                  {/* SVG Interceptor Blueprint */}
                  <svg
                    viewBox="0 0 600 900"
                    className="w-full max-w-[480px] h-auto drop-shadow-[0_0_35px_rgba(139,92,246,0.15)]"
                  >
                    <defs>
                      {/* Exhaust Plume Gradients */}
                      <linearGradient id="plumeGradientViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="plumeGradientAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#EF4444" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                      <radialGradient id="cockpitGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0B0F17" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>

                    {/* Ground Venturi Airflow & Downforce Halo */}
                    <ellipse cx="300" cy="520" rx="200" ry="240" fill="url(#cockpitGlow)" opacity="0.6" />

                    {/* DYNAMIC GAS EXHAUST PLUMES (Fired dynamically during simulation) */}
                    {nozzles.map((nz) => {
                      if (!nz.firing) return null;
                      const isHighThrust = nz.thrustKn > 2.5;
                      const grad = isHighThrust ? 'url(#plumeGradientAmber)' : 'url(#plumeGradientViolet)';
                      return (
                        <g key={`plume-${nz.id}`} className="animate-pulse-thruster">
                          {/* Outer expanded gas cone */}
                          <polygon
                            points={`
                              ${nz.x},${nz.y} 
                              ${nz.x + nz.plumeDx - nz.plumeDy * 0.4},${nz.y + nz.plumeDy + nz.plumeDx * 0.4} 
                              ${nz.x + nz.plumeDx * 1.5},${nz.y + nz.plumeDy * 1.5} 
                              ${nz.x + nz.plumeDx + nz.plumeDy * 0.4},${nz.y + nz.plumeDy - nz.plumeDx * 0.4}
                            `}
                            fill={grad}
                          />
                          {/* Inner high-energy supersonic shock diamond */}
                          <polygon
                            points={`
                              ${nz.x},${nz.y} 
                              ${nz.x + nz.plumeDx * 0.6 - nz.plumeDy * 0.2},${nz.y + nz.plumeDy * 0.6 + nz.plumeDx * 0.2} 
                              ${nz.x + nz.plumeDx * 0.9},${nz.y + nz.plumeDy * 0.9} 
                              ${nz.x + nz.plumeDx * 0.6 + nz.plumeDy * 0.2},${nz.y + nz.plumeDy * 0.6 - nz.plumeDx * 0.2}
                            `}
                            fill="#FFFFFF"
                            opacity="0.8"
                          />
                        </g>
                      );
                    })}

                    {/* CHASSIS BODY: Aerodynamic Carbon Monocoque */}
                    {/* Rear Aero Wing Structure */}
                    <path
                      d="M 120 760 L 480 760 L 460 830 L 380 840 L 300 850 L 220 840 L 140 830 Z"
                      fill="#0B132B"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    <line x1="160" y1="760" x2="160" y2="820" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
                    <line x1="440" y1="760" x2="440" y2="820" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />

                    {/* Main Interceptor Body Hull */}
                    <path
                      d="
                        M 300 80 
                        L 340 140 
                        L 380 180 
                        L 420 220 
                        L 435 320 
                        L 450 480 
                        L 440 640 
                        L 460 750 
                        L 410 780 
                        L 300 800 
                        L 190 780 
                        L 140 750 
                        L 160 640 
                        L 150 480 
                        L 165 320 
                        L 180 220 
                        L 220 180 
                        L 260 140 
                        Z
                      "
                      fill="#0D1527"
                      stroke="#475569"
                      strokeWidth="3"
                    />

                    {/* Front Splitter & Ground Canards */}
                    <path
                      d="M 230 110 L 300 65 L 370 110 L 420 180 L 390 190 L 300 130 L 210 190 L 180 180 Z"
                      fill="#070C18"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                    />

                    {/* Side Venturi Tunnels (Vac-Wing Ground Channels) */}
                    <path
                      d="M 170 330 L 210 340 L 220 620 L 160 630 Z"
                      fill="#080E1C"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />
                    <path
                      d="M 430 330 L 390 340 L 380 620 L 440 630 Z"
                      fill="#080E1C"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />

                    {/* Cockpit Canopy (Violet Reflective Glass) */}
                    <path
                      d="M 300 240 Q 330 310 330 450 Q 300 480 300 480 Q 300 480 270 450 Q 270 310 300 240 Z"
                      fill="#1E1338"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                    />
                    <path
                      d="M 300 260 L 300 460"
                      stroke="#A78BFA"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />

                    {/* Internal Reaction-Control Nitrogen High-Pressure Vessel */}
                    <rect
                      x="260"
                      y="520"
                      width="80"
                      height="130"
                      rx="20"
                      fill="#111B33"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      opacity="0.85"
                    />
                    <text
                      x="300"
                      y="590"
                      fill="#F59E0B"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                    >
                      350 BAR N2
                    </text>

                    {/* Pneumatic Conduit Lines to Nozzles */}
                    <line x1="300" y1="520" x2="185" y2="195" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="300" y1="520" x2="415" y2="195" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="260" y1="580" x2="170" y2="430" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="340" y1="580" x2="430" y2="430" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="280" y1="650" x2="165" y2="690" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="320" y1="650" x2="435" y2="690" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="290" y1="650" x2="250" y2="810" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="310" y1="650" x2="350" y2="810" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

                    {/* 8 INTERACTIVE NOZZLE CALLOUTS */}
                    {nozzles.map((nz) => {
                      const isSelected = selectedNozzle?.id === nz.id;
                      return (
                        <g
                          key={nz.id}
                          className="cursor-pointer transition-transform hover:scale-125"
                          onClick={() => setSelectedNozzle(nz)}
                        >
                          {/* Pulsing ring if firing */}
                          {nz.firing && (
                            <circle
                              cx={nz.x}
                              cy={nz.y}
                              r="18"
                              fill="none"
                              stroke={nz.thrustKn > 2.5 ? '#F59E0B' : '#8B5CF6'}
                              strokeWidth="2"
                              className="animate-ping"
                              opacity="0.8"
                            />
                          )}

                          {/* Outer circle */}
                          <circle
                            cx={nz.x}
                            cy={nz.y}
                            r={isSelected ? '14' : '11'}
                            fill={isSelected ? '#8B5CF6' : nz.firing ? '#3B82F6' : '#1E293B'}
                            stroke={isSelected ? '#FFFFFF' : nz.firing ? '#93C5FD' : '#475569'}
                            strokeWidth="2"
                          />

                          {/* Nozzle Index Number */}
                          <text
                            x={nz.x}
                            y={nz.y + 4}
                            fill="#FFFFFF"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                            textAnchor="middle"
                          >
                            {nz.index}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Nozzle Quick Inspector Footer */}
                {selectedNozzle && (
                  <div className="mt-3 bg-[#0F172A] border border-purple-500/40 rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-purple-950 border border-purple-500 flex items-center justify-center font-mono font-bold text-sm text-purple-300">
                        {selectedNozzle.index}
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
                          <span>{selectedNozzle.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">
                            {selectedNozzle.type}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {selectedNozzle.location} · LATENCY: {selectedNozzle.solenoidLatencyMs} ms · TEMP: {selectedNozzle.tempCelsius}°C
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-400">THRUST</div>
                        <div className="text-sm font-mono font-bold text-purple-400">
                          {selectedNozzle.thrustKn} / {selectedNozzle.maxThrustKn} kN
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedNozzle(null)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER-RIGHT: SOLID-STATE BATTERY & GAS PRESSURE BUFFER MATRIX */}
              <div
                className={`${
                  activeTab === 'SOLID-STATE BUS' ? 'lg:col-span-12' : activeTab === 'RCS THRUSTER MAP' ? 'hidden' : 'lg:col-span-5'
                } space-y-4`}
              >
                {/* 1. Dual 1,000V Silicon-Carbide Inverter Outputs */}
                <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>DUAL 1,000V SiC INVERTER BUS</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-400">99.4% EFFICIENCY</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Inverter Front Axle */}
                    <div className="bg-[#0F172A] border border-slate-800 p-3 rounded">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase">INV-01 FRONT AXLE</div>
                      <div className="text-2xl font-black font-mono tabular-nums text-purple-300 mt-1">
                        {inverter1Voltage.toFixed(1)} <span className="text-xs text-slate-400">V</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center justify-between">
                        <span>CURRENT: 820 A</span>
                        <span>820 kW</span>
                      </div>
                    </div>

                    {/* Inverter Rear Axle */}
                    <div className="bg-[#0F172A] border border-slate-800 p-3 rounded">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase">INV-02 REAR AXLE</div>
                      <div className="text-2xl font-black font-mono tabular-nums text-purple-300 mt-1">
                        {inverter2Voltage.toFixed(1)} <span className="text-xs text-slate-400">V</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center justify-between">
                        <span>CURRENT: 820 A</span>
                        <span>820 kW</span>
                      </div>
                    </div>
                  </div>

                  {/* Solid-State Cell Thermal Monitor */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-slate-300 font-bold uppercase">SSB CELL THERMAL ENVELOPE</span>
                      <span className="text-purple-400 font-bold">{batteryTempCelsius.toFixed(1)}°C (LIMIT 55°C)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${(batteryTempCelsius / 55) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Dynamic 350-bar Composite Nitrogen Pressure Vessel Monitor */}
                <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-purple-400" />
                      <span>350-BAR COMPOSITE N2 VESSEL</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-400">STAGE 4 BUFFER</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-1">
                        <span className="text-slate-400">TANK PRESSURE</span>
                        <span className="text-purple-300 font-bold font-mono">
                          {nitrogenPressureBar.toFixed(1)} / 350.0 BAR
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${(nitrogenPressureBar / 350) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-1">
                        <span className="text-slate-400">STORED NITROGEN MASS</span>
                        <span className="text-purple-300 font-bold font-mono">
                          {nitrogenMassKg.toFixed(2)} / 22.00 KG
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-300"
                          style={{ width: `${(nitrogenMassKg / 22) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">VALVE DUTY CYCLE:</span>
                      <span className="text-slate-200 font-bold">{compressorDuty}% PEAK</span>
                    </div>
                  </div>
                </div>

                {/* 3. Regenerative Pneumatic Compressor Status */}
                <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                    <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>REGEN PNEUMATIC COMPRESSOR</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                      ACTIVE HARVEST
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400 mb-3">
                    Harvests kinetic braking energy (up to 42 kW) to repressurize nitrogen accumulator on corner entry.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#0F172A] p-2.5 rounded border border-slate-800">
                      <div className="text-slate-400">HARVEST POWER</div>
                      <div className="text-base font-bold font-mono text-purple-400 mt-0.5">
                        {Math.max(4.0, Math.abs(longitudinalG) * 16.5).toFixed(1)} kW
                      </div>
                    </div>
                    <div className="bg-[#0F172A] p-2.5 rounded border border-slate-800">
                      <div className="text-slate-400">RECHARGE RATE</div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                        +{(Math.abs(longitudinalG) * 1.8).toFixed(1)} BAR / S
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ====================================================================
              BOTTOM 4TH PANE: HIGH-SPEED SECTOR & THRUSTER ACTUATION LEDGER
              (Always visible on HUD or full in 'SECTOR DYNAMICS LEDGER')
              ==================================================================== */}
          {(activeTab === 'FLIGHT DECK HUD' || activeTab === 'SECTOR DYNAMICS LEDGER') && (
            <section className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
              
              {/* Header & Quick-Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>HIGH-SPEED SECTOR & THRUSTER ACTUATION LEDGER</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Real-time telemetry log of Lap Sectors 1 to 14 showing entry/apex speed, lateral G, gas consumption, and downforce delta.
                  </p>
                </div>

                {/* Filter and Quick Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterHighGOnly(!filterHighGOnly)}
                    className={`h-9 px-3 rounded text-xs font-mono font-bold tracking-wider transition-colors border ${
                      filterHighGOnly
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0F172A] border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {filterHighGOnly ? 'SHOWING HIGH-G (&gt;3.5G)' : 'FILTER HIGH-G'}
                  </button>

                  <button
                    onClick={triggerRepressurize}
                    className="h-9 px-3.5 rounded bg-[#0F172A] border border-purple-500/50 hover:bg-purple-950/70 text-purple-300 font-mono text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>REPRESSURIZE GAS TANK</span>
                  </button>

                  <button
                    onClick={triggerCalibrateNozzles}
                    className="h-9 px-3.5 rounded bg-[#0F172A] border border-slate-700 hover:border-slate-500 text-slate-200 font-mono text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>CALIBRATE RCS NOZZLES</span>
                  </button>

                  <button
                    onClick={triggerEmergencyDump}
                    className="h-9 px-3.5 rounded bg-rose-950/60 border border-rose-500/50 hover:bg-rose-900/80 text-rose-300 font-mono text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>EMERGENCY GAS DUMP</span>
                  </button>

                  <button
                    onClick={exportTelemetryCsv}
                    className="h-9 px-3.5 rounded bg-purple-600 border border-purple-400 hover:bg-purple-500 text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT TELEMETRY CSV</span>
                  </button>
                </div>
              </div>

              {/* Responsive Table with py-3.5, border-slate-800, zero clipped columns */}
              <div className="overflow-x-auto scrollbar-none rounded border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#080D18] border-b border-slate-800 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      <th className="py-3.5 px-3">SECTOR</th>
                      <th className="py-3.5 px-3">NAME & DESCRIPTION</th>
                      <th className="py-3.5 px-3">ENTRY SPEED</th>
                      <th className="py-3.5 px-3">APEX SPEED</th>
                      <th className="py-3.5 px-3">EXIT SPEED</th>
                      <th className="py-3.5 px-3">PEAK LAT G</th>
                      <th className="py-3.5 px-3">GAS MASS BURN</th>
                      <th className="py-3.5 px-3">DOWNFORCE Δ</th>
                      <th className="py-3.5 px-3">COMPRESSOR STATUS</th>
                      <th className="py-3.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs md:text-sm font-mono">
                    {filteredSectors.map((row) => {
                      const isCurrent = currentSectorIndex + 1 === row.sector;
                      return (
                        <tr
                          key={row.sector}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-purple-950/40 border-l-4 border-l-purple-500'
                              : 'hover:bg-slate-900/60'
                          }`}
                        >
                          <td className="py-3.5 px-3 font-bold text-purple-300">
                            #{String(row.sector).padStart(2, '0')}
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-200">
                            {row.name}
                          </td>
                          <td className="py-3.5 px-3 tabular-nums text-slate-300">
                            {row.entrySpeed.toFixed(1)} km/h
                          </td>
                          <td className="py-3.5 px-3 tabular-nums font-bold text-purple-400">
                            {row.apexSpeed.toFixed(1)} km/h
                          </td>
                          <td className="py-3.5 px-3 tabular-nums text-slate-300">
                            {row.exitSpeed.toFixed(1)} km/h
                          </td>
                          <td className="py-3.5 px-3 tabular-nums">
                            <span
                              className={`font-bold ${
                                row.lateralG >= 3.8
                                  ? 'text-amber-400'
                                  : row.lateralG >= 3.0
                                  ? 'text-purple-300'
                                  : 'text-slate-300'
                              }`}
                            >
                              {row.lateralG.toFixed(2)} G
                            </span>
                          </td>
                          <td className="py-3.5 px-3 tabular-nums text-cyan-400 font-bold">
                            {row.gasMassUsedGrams.toFixed(1)} g
                          </td>
                          <td className="py-3.5 px-3 tabular-nums text-purple-300 font-bold">
                            +{row.downforceDeltaKg} kg
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 text-xs">
                            {row.compressorMode}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2 py-1 rounded text-[11px] font-bold tracking-wider uppercase inline-block whitespace-nowrap ${
                                row.status === 'HIGH_G_APEX'
                                  ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                                  : row.status === 'BURST_FIRED'
                                  ? 'bg-purple-950 border border-purple-500/50 text-purple-300'
                                  : 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                              }`}
                            >
                              {row.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ====================================================================
              SYSTEM LOGS TAB VIEW (When 'SYSTEM LOGS' is chosen)
              ==================================================================== */}
          {activeTab === 'SYSTEM LOGS' && (
            <section className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-4 lg:p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>REAL-TIME CAN BUS & RCS DIAGNOSTIC LOGS</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Continuous stream of solenoid actuations, pressure transients, and yaw pulse counters.
                  </p>
                </div>

                {/* Severity Filter */}
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'INFO', 'WARN', 'CRITICAL'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setLogFilter(sev)}
                      className={`h-7 px-3 rounded text-xs font-mono font-bold tracking-wider transition-colors border ${
                        logFilter === sev
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Stream List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredDiagnostics.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-[#0F172A] border border-slate-800 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-950 border border-rose-500 text-rose-300'
                            : evt.severity === 'WARN'
                            ? 'bg-amber-950 border border-amber-500 text-amber-300'
                            : 'bg-purple-950 border border-purple-500/50 text-purple-300'
                        }`}
                      >
                        {evt.severity}
                      </span>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">{evt.timestamp}</span>
                      <span className="font-mono text-xs font-bold text-slate-100">{evt.type}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-300 flex-1 md:px-4">
                      {evt.message}
                    </div>
                    {evt.durationMs > 0 && (
                      <div className="font-mono text-[11px] text-purple-400 whitespace-nowrap">
                        PULSE: {evt.durationMs} MS
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>

        {/* ====================================================================
            FOOTER: SYSTEM STATUS & ARCHITECTURAL AFFORDANCES
            ==================================================================== */}
        <footer className="border-t border-[#1E293B] bg-[#070B14] px-4 lg:px-6 py-3 mt-auto">
          <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-bold text-purple-400">SOLARIS ORBITAL REACTION LABS</span>
              <span className="text-slate-600">/</span>
              <span>ISO 9001 / FIA FLUIDICS COMPLIANT</span>
              <span className="text-slate-600">/</span>
              <span>CAN 2.0B & FD BUFFER SYNCHRONIZED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-bold">ALL 8 THRUSTER NOZZLES ARMED</span>
            </div>
          </div>
        </footer>

        {/* ====================================================================
            ACTION MODALS
            ==================================================================== */}
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-5 max-w-lg w-full shadow-2xl space-y-4">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-purple-400" />
                  <h4 className="text-base font-bold font-mono text-slate-100 uppercase">
                    {activeModal === 'REPRESSURIZE' && 'REPRESSURIZE NITROGEN TANK'}
                    {activeModal === 'CALIBRATE' && 'CALIBRATE 8 RCS NOZZLES'}
                    {activeModal === 'EMERGENCY_DUMP' && 'EMERGENCY COLD-GAS DUMP INTERLOCK'}
                    {activeModal === 'EXPORT_CSV' && 'TELEMETRY CSV EXPORT ENGINE'}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-slate-900"
                >
                  ESC
                </button>
              </div>

              {/* Modal Body & Progress */}
              <div className="space-y-3 font-mono text-xs">
                <p className="text-slate-300">{modalStatusText}</p>

                {modalProgress > 0 && modalProgress < 100 && (
                  <div className="w-full h-3 bg-slate-900 rounded overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-purple-500 transition-all duration-200"
                      style={{ width: `${modalProgress}%` }}
                    />
                  </div>
                )}

                {activeModal === 'EMERGENCY_DUMP' && modalProgress === 0 && (
                  <div className="p-3 rounded bg-rose-950/60 border border-rose-500/60 text-rose-200 space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      CRITICAL SAFETY OVERRIDE:
                    </p>
                    <p>
                      This will actuate all 8 cold-gas vent solenoids simultaneously, releasing 18.4 kg of compressed
                      nitrogen. Vehicle reaction-control authority will drop to zero.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {activeModal === 'EMERGENCY_DUMP' && modalProgress === 0 ? (
                  <>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold"
                    >
                      ABORT
                    </button>
                    <button
                      onClick={executeEmergencyDump}
                      className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold"
                    >
                      CONFIRM PURGE
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold"
                  >
                    DISMISS
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}
