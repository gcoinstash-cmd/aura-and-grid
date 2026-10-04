/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Space Elevator Infrastructure & Heavy Climber Robotics Control Deck
 * Facility: Apex-Ascent Orbital Tether Operations Command
 * Carriage Chassis: Heavy Climber Carriage HC-12 (Gen-4)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  Cpu,
  Crosshair,
  Download,
  Eye,
  FastForward,
  Flame,
  Gauge,
  Layers,
  Lock,
  Orbit,
  Pause,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Satellite,
  Search,
  ShieldAlert,
  Sliders,
  SlidersHorizontal,
  Sun,
  Terminal,
  Thermometer,
  Unlock,
  X,
  Zap,
  ZapOff
} from 'lucide-react';

// ==============================================================================
// DOMAIN TYPES & INTERFACES
// ==============================================================================
export type AscentStatus = 
  | 'ASCENDING' 
  | 'DESCENDING' 
  | 'HOLD' 
  | 'EMERGENCY_BRAKE' 
  | 'STATION_DOCKED';

export type OperatorRole = 
  | 'FLIGHT_DIRECTOR' 
  | 'TRACTION_ENGINEER' 
  | 'LASER_PROPULSION' 
  | 'CARGO_OFFICER';

export interface CargoPod {
  id: string;
  code: string;
  payload: string;
  category: 'HABITAT_RING' | 'SOLAR_ARRAY' | 'CRYO_GAS' | 'SATELLITE_BUS' | 'ROVER' | 'METALLURGY';
  massKg: number;
  integrityPct: number;
  progressPct: number;
  etaHours: number;
  powerDrawKwhKm: number;
  priority: 'CRITICAL' | 'TIER_1' | 'TIER_2' | 'BULK';
  destination: string;
  status: 'IN_TRANSIT' | 'STAGE_TRANSFER' | 'SECURED';
}

export interface PinchWheel {
  index: number;
  side: 'PORT' | 'STARBOARD';
  torqueNm: number;
  rpm: number;
  slipPct: number;
  pinchForceKn: number;
  tempC: number;
  status: 'NOMINAL' | 'WARNING' | 'OVERTORQUE';
}

export interface DefectItem {
  id: string;
  altitudeKm: number;
  type: 'MICROMETEORITE_PIT' | 'CARBON_FIBER_FRAY' | 'PLASMA_ETCHING';
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  depthUm: number;
  coordinateY: number;
  status: 'ACTIVE' | 'RESOLVED';
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  details: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'ACTION';
}

export interface Waypoint {
  id: string;
  name: string;
  altitudeKm: number;
  type: 'ANCHOR' | 'ATMOSPHERE' | 'DEBRIS_ZONE' | 'RADIATION_BELT' | 'ORBITAL_GEO' | 'COUNTERWEIGHT';
  description: string;
}

// Fixed Waypoints along the 100,000 km carbon nanotube ribbon
const TETHER_WAYPOINTS: Waypoint[] = [
  { id: 'wp-0', name: 'Earth Surface Anchor (Galapagos)', altitudeKm: 0, type: 'ANCHOR', description: 'Equatorial Ocean Platform & 820nm Ground Laser Array' },
  { id: 'wp-1', name: 'Karman Line Boundary', altitudeKm: 100, type: 'ATMOSPHERE', description: 'Atmospheric escape boundary; aerodynamic drag ceases' },
  { id: 'wp-2', name: 'LEO Debris Shield Zone', altitudeKm: 1200, type: 'DEBRIS_ZONE', description: 'Radar tracking corridor; orbital micrometeorite deflectors' },
  { id: 'wp-3', name: 'Inner Van Allen Proton Belt', altitudeKm: 4200, type: 'RADIATION_BELT', description: 'Trapped high-energy proton flux; active magnetic shield engaged' },
  { id: 'wp-curr', name: 'HC-12 Current Position', altitudeKm: 14280, type: 'ATMOSPHERE', description: 'Trans-orbital transfer leg to Geostationary Terminal' },
  { id: 'wp-4', name: 'Outer Van Allen Electron Belt', altitudeKm: 22000, type: 'RADIATION_BELT', description: 'Relativistic electron environment; dielectric dissipation' },
  { id: 'wp-5', name: 'GEO Apex Station Terminal', altitudeKm: 35786, type: 'ORBITAL_GEO', description: 'Geostationary orbital hub, cargo transfer shipyard & docks' },
  { id: 'wp-6', name: 'Counterweight Terminal Station', altitudeKm: 100000, type: 'COUNTERWEIGHT', description: 'Captured asteroid ballast counterweight generating ribbon tension' },
];

export default function SpaceElevatorClimberControl() {
  // ----------------------------------------------------------------------------
  // GLOBAL SIMULATION STATE
  // ----------------------------------------------------------------------------
  const [altitudeKm, setAltitudeKm] = useState<number>(14280.0);
  const [velocityKmh, setVelocityKmh] = useState<number>(220.0);
  const [laserPowerMw, setLaserPowerMw] = useState<number>(4.8);
  const [tetherStrainGpa, setTetherStrainGpa] = useState<number>(68.4);
  const [coreTempC, setCoreTempC] = useState<number>(24.2);
  const [ascentStatus, setAscentStatus] = useState<AscentStatus>('ASCENDING');
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 5x, 25x, 0 = paused
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);

  // Optical receiver & laser array state
  const [pvVoltageV, setPvVoltageV] = useState<number>(1200.0);
  const [beamFluxMwM2, setBeamFluxMwM2] = useState<number>(8.65);
  const [jitterMrad, setJitterMrad] = useState<number>(0.042);
  const [heatPipeRejectionMw, setHeatPipeRejectionMw] = useState<number>(1.34);
  const [laserAimOffsetM, setLaserAimOffsetM] = useState<{ x: number; y: number }>({ x: 0.12, y: -0.08 });

  // 8-Wheel Traction Drive
  const [pinchWheels, setPinchWheels] = useState<PinchWheel[]>([
    { index: 1, side: 'PORT', torqueNm: 1540.2, rpm: 318.4, slipPct: 0.019, pinchForceKn: 48.6, tempC: 42.1, status: 'NOMINAL' },
    { index: 2, side: 'PORT', torqueNm: 1535.8, rpm: 318.5, slipPct: 0.021, pinchForceKn: 48.5, tempC: 41.9, status: 'NOMINAL' },
    { index: 3, side: 'PORT', torqueNm: 1552.1, rpm: 318.6, slipPct: 0.018, pinchForceKn: 48.7, tempC: 43.4, status: 'NOMINAL' },
    { index: 4, side: 'PORT', torqueNm: 1548.4, rpm: 318.3, slipPct: 0.022, pinchForceKn: 48.6, tempC: 42.8, status: 'NOMINAL' },
    { index: 5, side: 'STARBOARD', torqueNm: 1515.6, rpm: 318.5, slipPct: 0.020, pinchForceKn: 48.4, tempC: 40.9, status: 'NOMINAL' },
    { index: 6, side: 'STARBOARD', torqueNm: 1522.0, rpm: 318.4, slipPct: 0.020, pinchForceKn: 48.5, tempC: 41.2, status: 'NOMINAL' },
    { index: 7, side: 'STARBOARD', torqueNm: 1530.9, rpm: 318.7, slipPct: 0.023, pinchForceKn: 48.5, tempC: 41.7, status: 'NOMINAL' },
    { index: 8, side: 'STARBOARD', torqueNm: 1538.3, rpm: 318.5, slipPct: 0.019, pinchForceKn: 48.6, tempC: 42.0, status: 'NOMINAL' },
  ]);

  // Optical Inspection Defects
  const [defects, setDefects] = useState<DefectItem[]>([
    { id: 'DEF-104', altitudeKm: 13180.4, type: 'MICROMETEORITE_PIT', severity: 'LOW', depthUm: 4.2, coordinateY: 13180400, status: 'RESOLVED', timestamp: '02:14:10' },
    { id: 'DEF-105', altitudeKm: 13400.1, type: 'CARBON_FIBER_FRAY', severity: 'LOW', depthUm: 1.8, coordinateY: 13400150, status: 'ACTIVE', timestamp: '02:30:45' },
    { id: 'DEF-106', altitudeKm: 13840.8, type: 'MICROMETEORITE_PIT', severity: 'MEDIUM', depthUm: 11.5, coordinateY: 13840800, status: 'RESOLVED', timestamp: '02:44:12' },
    { id: 'DEF-107', altitudeKm: 14060.2, type: 'PLASMA_ETCHING', severity: 'LOW', depthUm: 0.6, coordinateY: 14060220, status: 'ACTIVE', timestamp: '02:51:30' },
    { id: 'DEF-108', altitudeKm: 14220.9, type: 'CARBON_FIBER_FRAY', severity: 'LOW', depthUm: 2.1, coordinateY: 14220900, status: 'ACTIVE', timestamp: '02:58:04' },
  ]);

  // Cargo Pods (POD-GEO-01 to POD-GEO-10)
  const [cargoPods, setCargoPods] = useState<CargoPod[]>([
    { id: 'p1', code: 'POD-GEO-01', payload: 'Orbital Habitat Life-Support Ring Alpha', category: 'HABITAT_RING', massKg: 12000, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 14.8, priority: 'CRITICAL', destination: 'GEO Habitat Ring Alpha', status: 'IN_TRANSIT' },
    { id: 'p2', code: 'POD-GEO-02', payload: 'High-Flux Multi-Junction PV Array Spine', category: 'SOLAR_ARRAY', massKg: 8500, integrityPct: 99.98, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 11.2, priority: 'TIER_1', destination: 'GEO Power Node Beta', status: 'IN_TRANSIT' },
    { id: 'p3', code: 'POD-GEO-03', payload: 'Cryogenic Liquid Xenon Ion Bladder Tank', category: 'CRYO_GAS', massKg: 11400, integrityPct: 99.85, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 16.5, priority: 'CRITICAL', destination: 'Counterweight Booster Stage', status: 'IN_TRANSIT' },
    { id: 'p4', code: 'POD-GEO-04', payload: 'Deep Space Communications Transceiver Bus Mk-IV', category: 'SATELLITE_BUS', massKg: 6200, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 9.4, priority: 'TIER_1', destination: 'GEO Relay Platform Gamma', status: 'IN_TRANSIT' },
    { id: 'p5', code: 'POD-GEO-05', payload: 'Lunar Polar Regolith Autonomous Excavator Rover', category: 'ROVER', massKg: 9800, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 13.1, priority: 'TIER_2', destination: 'GEO Interplanetary Dock', status: 'IN_TRANSIT' },
    { id: 'p6', code: 'POD-GEO-06', payload: 'Zero-G High-Entropy Induction Furnace', category: 'METALLURGY', massKg: 14200, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 18.2, priority: 'TIER_1', destination: 'GEO Orbital Foundry Node', status: 'IN_TRANSIT' },
    { id: 'p7', code: 'POD-GEO-07', payload: 'Cosmic Ray High-Resolution Spectrometer', category: 'SATELLITE_BUS', massKg: 4800, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 8.1, priority: 'TIER_2', destination: 'Apex Observatory Hub', status: 'IN_TRANSIT' },
    { id: 'p8', code: 'POD-GEO-08', payload: 'Dense Carbon Nanotube Spool Repair Reel', category: 'SOLAR_ARRAY', massKg: 7300, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 10.6, priority: 'CRITICAL', destination: 'GEO Tether Service Bay', status: 'IN_TRANSIT' },
    { id: 'p9', code: 'POD-GEO-09', payload: 'Pressurized Hydroponic Biomass Chamber Module', category: 'HABITAT_RING', massKg: 11500, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 15.0, priority: 'TIER_1', destination: 'GEO Habitat Ring Alpha', status: 'IN_TRANSIT' },
    { id: 'p10', code: 'POD-GEO-10', payload: 'Titanium Modular Structural Truss Spine', category: 'METALLURGY', massKg: 16000, integrityPct: 100, progressPct: 39.9, etaHours: 97.7, powerDrawKwhKm: 19.8, priority: 'BULK', destination: 'GEO Spacecraft Shipyard', status: 'IN_TRANSIT' },
  ]);

  // Logs & Audit Trail
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'l1', timestamp: '02:58:30', operator: 'FLIGHT_DIR_VEGA', action: 'TELEMETRY_SYNC', details: 'Altitude 14,280 km confirmed on nominal GEO transfer arc.', level: 'INFO' },
    { id: 'l2', timestamp: '02:54:12', operator: 'LASER_SYS_ORTEGA', action: 'AIM_TRIMMED', details: 'Galapagos 820nm beam collimation adjusted; flux 8.65 MW/m².', level: 'ACTION' },
    { id: 'l3', timestamp: '02:49:05', operator: 'TRACTION_ENG_CHEN', action: 'PINCH_PRESSURE_OK', details: 'Bogie hydraulic force equalized at 48.6 kN across W1-W8.', level: 'INFO' },
    { id: 'l4', timestamp: '02:35:20', operator: 'SAFETY_SYSTEM', action: 'DEBRIS_SCAN_CLEAR', details: 'No orbital debris threat within 120 km corridor.', level: 'INFO' },
  ]);

  // Interactive UI state
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(TETHER_WAYPOINTS[4]);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'PROPULSION' | 'RIBBON_HEALTH' | 'CARGO' | 'AUDIT'>('TELEMETRY');
  const [cargoFilter, setCargoFilter] = useState<string>('ALL');
  const [cargoSearch, setCargoSearch] = useState<string>('');
  const [operatorRole, setOperatorRole] = useState<OperatorRole>('FLIGHT_DIRECTOR');
  
  // Modals
  const [activeModal, setActiveModal] = useState<
    'NONE' | 'EMERGENCY_BRAKE' | 'TRIM_LASER' | 'PINCH_PRESSURE' | 'REGEN_DESCENT' | 'ULTRASONIC_SCAN' | 'EXPORT_LEDGER'
  >('NONE');

  // Input states for modals
  const [modalInputVal, setModalInputVal] = useState<string>('');
  const [brakeConfirmKey, setBrakeConfirmKey] = useState<string>('');
  const [isBrakeArmed, setIsBrakeArmed] = useState<boolean>(false);

  // ----------------------------------------------------------------------------
  // REAL-TIME TICK LOOP (Altitude, Jitter, Strain, Thermal)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!isSimRunning || simSpeed === 0) return;

    const interval = setInterval(() => {
      // Small realistic fluctuations
      const jitterDelta = (Math.random() - 0.5) * 0.004;
      const strainNoise = (Math.random() - 0.5) * 0.15;
      const voltageNoise = (Math.random() - 0.5) * 1.8;
      const tempNoise = (Math.random() - 0.5) * 0.05;

      setJitterMrad(prev => Math.max(0.015, Math.min(0.085, +(prev + jitterDelta).toFixed(3))));
      setTetherStrainGpa(prev => Math.max(62.0, Math.min(76.5, +(68.4 + strainNoise + (altitudeKm / 35786) * 4.2).toFixed(2))));
      setPvVoltageV(prev => +(1200.0 + voltageNoise).toFixed(1));
      setCoreTempC(prev => +(24.2 + tempNoise).toFixed(1));

      // Altitude progression
      if (ascentStatus === 'ASCENDING') {
        const deltaKm = (velocityKmh / 3600) * (simSpeed * 0.5); // scaled for animation
        setAltitudeKm(prev => {
          const next = prev + deltaKm;
          if (next >= 35786) {
            setAscentStatus('STATION_DOCKED');
            setVelocityKmh(0);
            return 35786.0;
          }
          return +(next).toFixed(3);
        });

        // Update cargo progress
        setCargoPods(prevPods => 
          prevPods.map(pod => {
            const nextProgress = Math.min(100, +( (altitudeKm / 35786) * 100 ).toFixed(1));
            const remainingKm = Math.max(0, 35786 - altitudeKm);
            const remainingHours = +(remainingKm / (velocityKmh || 1)).toFixed(1);
            return {
              ...pod,
              progressPct: nextProgress,
              etaHours: remainingHours,
            };
          })
        );
      } else if (ascentStatus === 'DESCENDING') {
        const deltaKm = (velocityKmh / 3600) * (simSpeed * 0.5);
        setAltitudeKm(prev => {
          const next = Math.max(0, prev - deltaKm);
          if (next <= 0) {
            setAscentStatus('HOLD');
            setVelocityKmh(0);
            return 0.0;
          }
          return +(next).toFixed(3);
        });
      }

      // Slight wheel fluctuations
      setPinchWheels(prevWheels =>
        prevWheels.map(w => ({
          ...w,
          torqueNm: +(1530 + (Math.random() - 0.5) * 15).toFixed(1),
          slipPct: +(0.02 + (Math.random() - 0.5) * 0.004).toFixed(3),
        }))
      );

    }, 500);

    return () => clearInterval(interval);
  }, [isSimRunning, simSpeed, ascentStatus, velocityKmh, altitudeKm]);

  // Add audit log helper
  const addLog = (action: string, details: string, level: LogEntry['level'] = 'INFO') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LogEntry = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      operator: operatorRole,
      action,
      details,
      level,
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  // ----------------------------------------------------------------------------
  // MODAL ACTIONS & COMMAND HANDLERS
  // ----------------------------------------------------------------------------
  const handleExecuteEmergencyBrake = () => {
    if (brakeConfirmKey !== 'OVERRIDE-APEX-BRAKE') {
      alert('Security token mismatch! You must enter OVERRIDE-APEX-BRAKE to decouple power.');
      return;
    }
    setAscentStatus('EMERGENCY_BRAKE');
    setVelocityKmh(0);
    setLaserPowerMw(0);
    setIsBrakeArmed(true);
    setActiveModal('NONE');
    setBrakeConfirmKey('');
    addLog('EMERGENCY_BRAKE_ENGAGED', 'Mechanical ceramic friction clamps deployed at 14,280 km. Beamed power decoupled.', 'CRITICAL');
  };

  const handleDisengageBrake = () => {
    setAscentStatus('ASCENDING');
    setVelocityKmh(220);
    setLaserPowerMw(4.8);
    setIsBrakeArmed(false);
    addLog('EMERGENCY_BRAKE_RELEASED', 'Ceramic clamps retracted. Restored 4.8 MW beamed laser propulsion.', 'ACTION');
  };

  const handleTrimLaser = (dx: number, dy: number) => {
    const newX = +(laserAimOffsetM.x + dx).toFixed(2);
    const newY = +(laserAimOffsetM.y + dy).toFixed(2);
    setLaserAimOffsetM({ x: newX, y: newY });
    setJitterMrad(0.028);
    setBeamFluxMwM2(8.82);
    setActiveModal('NONE');
    addLog('LASER_AIM_TRIMMED', `Optical center shifted ΔX=${dx > 0 ? '+' : ''}${dx}m, ΔY=${dy > 0 ? '+' : ''}${dy}m. Receiver flux nominal.`, 'ACTION');
  };

  const handleCyclePinchForce = (newKn: number) => {
    setPinchWheels(prev =>
      prev.map(w => ({
        ...w,
        pinchForceKn: newKn,
        slipPct: 0.015,
      }))
    );
    setActiveModal('NONE');
    addLog('PINCH_PRESSURE_BALANCED', `Hydraulic normal force commanded to ${newKn} kN across 8 bogie wheels. Slip minimized.`, 'ACTION');
  };

  const handleEngageRegenDescent = () => {
    setAscentStatus('DESCENDING');
    setVelocityKmh(160);
    setLaserPowerMw(0.8);
    setActiveModal('NONE');
    addLog('REGENERATIVE_DESCENT_ENGAGED', 'Traction drives set to dynamic generator mode. Returning 420 kW back to ribbon capacitors.', 'WARN');
  };

  const handleUltrasonicScan = () => {
    setActiveModal('NONE');
    const newDef: DefectItem = {
      id: 'DEF-' + (108 + Math.floor(Math.random() * 50)),
      altitudeKm: +(altitudeKm + 0.5).toFixed(1),
      type: 'MICROMETEORITE_PIT',
      severity: 'LOW',
      depthUm: 3.1,
      coordinateY: +(altitudeKm * 1000 + 500).toFixed(0),
      status: 'RESOLVED',
      timestamp: new Date().toTimeString().split(' ')[0],
    };
    setDefects(prev => [newDef, ...prev]);
    addLog('ULTRASONIC_SCAN_COMPLETED', `High-frequency acoustic shear sweep verified nanotube matrix at ${altitudeKm} km. 0 critical delaminations.`, 'ACTION');
  };

  const exportManifestCSV = () => {
    const headers = 'Pod Code,Payload,Category,Mass (kg),Integrity (%),Progress (%),ETA (h),Power Draw (kWh/km),Priority,Destination,Status\n';
    const rows = cargoPods.map(p => 
      `"${p.code}","${p.payload}","${p.category}",${p.massKg},${p.integrityPct},${p.progressPct},${p.etaHours},${p.powerDrawKwhKm},"${p.priority}","${p.destination}","${p.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apex_climber_manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('MANIFEST_EXPORTED_CSV', 'Downloaded complete orbital freight ledger in CSV format.', 'INFO');
  };

  // Filtered Cargo
  const filteredCargo = useMemo(() => {
    return cargoPods.filter(pod => {
      const matchesFilter = 
        cargoFilter === 'ALL' ||
        (cargoFilter === 'CRITICAL' && pod.priority === 'CRITICAL') ||
        (cargoFilter === 'HABITAT' && pod.category === 'HABITAT_RING') ||
        (cargoFilter === 'CRYO' && pod.category === 'CRYO_GAS') ||
        (cargoFilter === 'AVIONICS' && (pod.category === 'SATELLITE_BUS' || pod.category === 'SOLAR_ARRAY'));
      
      const matchesSearch = 
        pod.code.toLowerCase().includes(cargoSearch.toLowerCase()) ||
        pod.payload.toLowerCase().includes(cargoSearch.toLowerCase()) ||
        pod.destination.toLowerCase().includes(cargoSearch.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [cargoPods, cargoFilter, cargoSearch]);

  // Ribbon Visualizer Calculations (normalized 0 to 100,000 km)
  // Let climber height in SVG map to SVG coordinates
  const svgHeight = 520;
  const svgWidth = 340;
  // Non-linear visual scale so the first 36,000 km is prominent
  const getCanvasY = (altKm: number) => {
    // 0 km = Earth surface (bottom, y = 480)
    // 35,786 km = GEO Station (y = 160)
    // 100,000 km = Apex counterweight (y = 40)
    if (altKm <= 35786) {
      // 0 to 35,786 maps to 480 down to 160 (span 320 px)
      return 480 - (altKm / 35786) * 320;
    } else {
      // 35,786 to 100,000 maps to 160 down to 40 (span 120 px)
      return 160 - ((altKm - 35786) / (100000 - 35786)) * 120;
    }
  };

  const climberY = getCanvasY(altitudeKm);
  const geoY = getCanvasY(35786);
  const karmanY = getCanvasY(100);
  const leoY = getCanvasY(1200);
  const vanAllenY = getCanvasY(4200);

  // Coriolis deflection calculation: max deflection occurs in mid-transfer (~15,000 km)
  const coriolisDeflectionMeters = +(Math.sin((altitudeKm / 35786) * Math.PI) * 48.5).toFixed(1);
  const coriolisSvgOffset = (coriolisDeflectionMeters / 50) * 18;

  return (
    <>
      <div className="min-h-screen bg-[#02040A] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* ==================================================================== */}
        {/* TOP BANNER / FLIGHT DECK NAVIGATION BAR                              */}
        {/* ==================================================================== */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 sticky top-0 z-40">
          <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Zone 1: Chassis Title & Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                <Satellite className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100 leading-snug">
                  APEX-ASCENT TETHER // HEAVY CLIMBER HC-12
                </h1>
                <p className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-cyan-400 font-bold">TETHER ID: CNT-PACIFIC-01</span>
                  <span>•</span>
                  <span>GALAPAGOS BASE</span>
                  <span>•</span>
                  <span>GEO APEX TERMINAL (35,786 KM)</span>
                </p>
              </div>
            </div>

            {/* Zone 2: Operator Role & Master Simulation Switch */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
              <div className="hidden xl:flex items-center gap-1 bg-[#111827] border border-slate-800 rounded-lg p-1 text-xs font-mono h-9">
                <span className="px-2 text-slate-400 font-bold">ROLE:</span>
                <select 
                  value={operatorRole}
                  onChange={(e) => {
                    const newRole = e.target.value as OperatorRole;
                    setOperatorRole(newRole);
                    addLog('OPERATOR_ROLE_CHANGE', `Switched active command station role to ${newRole}`, 'INFO');
                  }}
                  className="bg-slate-900 text-cyan-300 font-semibold px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-cyan-500 h-7"
                >
                  <option value="FLIGHT_DIRECTOR">FLIGHT DIRECTOR</option>
                  <option value="TRACTION_ENGINEER">TRACTION PROPULSION</option>
                  <option value="LASER_PROPULSION">LASER BEAM DIR</option>
                  <option value="CARGO_OFFICER">CARGO LOGISTICS</option>
                </select>
              </div>

              {/* Playback Controls ('00', '1x') and Emergency Brake Button on single aligned row */}
              <div className="flex items-center gap-2 flex-nowrap">
                <div className="flex items-center gap-1 bg-[#111827] border border-slate-800 rounded-lg p-1 h-9">
                  <button
                    onClick={() => setIsSimRunning(!isSimRunning)}
                    title={isSimRunning ? "Pause Simulation" : "Resume Simulation"}
                    className={`px-2.5 h-7 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                      isSimRunning ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    }`}
                  >
                    {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSimRunning ? 'RUN' : '00'}</span>
                  </button>
                  <button
                    onClick={() => setSimSpeed(s => (s === 1 ? 5 : s === 5 ? 25 : 1))}
                    title="Cycle Simulation Speed"
                    className="px-2.5 h-7 bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-cyan-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                  >
                    {simSpeed}x
                  </button>
                </div>

                {isBrakeArmed ? (
                  <button
                    onClick={handleDisengageBrake}
                    className="h-9 px-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-lg font-mono text-xs md:text-sm font-bold flex items-center gap-2 animate-pulse whitespace-nowrap"
                  >
                    <Unlock className="w-4 h-4" />
                    RESET BRAKE LOCK
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveModal('EMERGENCY_BRAKE')}
                    className="h-9 px-3.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/60 rounded-lg font-mono text-xs md:text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all whitespace-nowrap"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>EMERGENCY BRAKE</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </header>

        {/* ==================================================================== */}
        {/* PANE 1: TOP ASCENT TRAJECTORY & CLIMBER HUD METRIC CARDS             */}
        {/* ==================================================================== */}
        <section className="bg-[#0B0F17] border-b border-slate-800 px-4 lg:px-8 py-5">
          <div className="max-w-[1720px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              
              {/* Metric 1: Current Altitude */}
              <div className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>CURRENT ALTITUDE</span>
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {altitudeKm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  <span className="text-xs uppercase font-mono text-cyan-400 ml-1.5 font-bold">KM</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>TRANSIT TO GEO</span>
                  <span className="text-cyan-400 font-semibold">{((altitudeKm / 35786) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Metric 2: Ascent Velocity */}
              <div className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>ASCENT VELOCITY</span>
                  <Gauge className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {velocityKmh.toFixed(1)}
                  <span className="text-xs uppercase font-mono text-emerald-400 ml-1.5 font-bold">KM/H</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>STATUS</span>
                  <span className={`font-semibold ${
                    ascentStatus === 'ASCENDING' ? 'text-emerald-400' :
                    ascentStatus === 'EMERGENCY_BRAKE' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    ● {ascentStatus}
                  </span>
                </div>
              </div>

              {/* Metric 3: Beamed Laser Optical Power */}
              <div className="bg-[#111827] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>BEAMED LASER POWER</span>
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {laserPowerMw.toFixed(2)}
                  <span className="text-xs uppercase font-mono text-amber-400 ml-1.5 font-bold">MW</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>820NM ARRAY</span>
                  <span className="text-amber-400 font-semibold">94.2% ABSORP</span>
                </div>
              </div>

              {/* Metric 4: Tether Axial Strain */}
              <div className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>AXIAL TETHER STRAIN</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {tetherStrainGpa.toFixed(1)}
                  <span className="text-xs uppercase font-mono text-cyan-400 ml-1.5 font-bold">GPA</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>LIMIT: 130 GPA</span>
                  <span className="text-emerald-400 font-semibold">52.6% SAFETY</span>
                </div>
              </div>

              {/* Metric 5: Core Carriage Temp */}
              <div className="bg-[#111827] border border-slate-800 hover:border-indigo-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>CORE CHASSIS TEMP</span>
                  <Thermometer className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {coreTempC.toFixed(1)}
                  <span className="text-xs uppercase font-mono text-indigo-400 ml-1.5 font-bold">°C</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>HEAT REJECTION</span>
                  <span className="text-indigo-300 font-semibold">{heatPipeRejectionMw} MW</span>
                </div>
              </div>

              {/* Metric 6: Coriolis Lateral Deflection */}
              <div className="bg-[#111827] border border-slate-800 hover:border-sky-500/40 rounded-xl p-3.5 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-1">
                  <span>CORIOLIS DEFLECTION</span>
                  <ArrowDownUp className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100 flex items-baseline">
                  {coriolisDeflectionMeters > 0 ? `+${coriolisDeflectionMeters}` : coriolisDeflectionMeters}
                  <span className="text-xs uppercase font-mono text-sky-400 ml-1.5 font-bold">M</span>
                </div>
                <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>ANGULAR OFFSET</span>
                  <span className="text-sky-300 font-semibold">{(coriolisDeflectionMeters * 0.012).toFixed(2)} mrad</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* MAIN OPERATIONS WORKSPACE: 4-PANE ARCHITECTURE                      */}
        {/* ==================================================================== */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
          
          {/* Navigation Tab Bar Strip with Smooth Horizontal Scrolling */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none whitespace-nowrap border-b border-slate-800/80 pb-2 mb-4">
            {[
              { id: 'TELEMETRY', label: 'FLIGHT DECK' },
              { id: 'PROPULSION', label: 'TRACTION & MOTORS' },
              { id: 'RIBBON_HEALTH', label: 'TETHER SCANNER' },
              { id: 'CARGO', label: 'CARGO LEDGER' },
              { id: 'AUDIT', label: 'OPERATOR LOGS' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs md:text-sm font-mono font-bold tracking-wider rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* TOP SPLIT: PANE 2 (Center-Left 2D Tether Profile) & PANE 3 (Center-Right Diagnostics) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ---------------------------------------------------------------- */}
            {/* PANE 2: CENTER-LEFT 2D VERTICAL TETHER RIBBON ELEVATION CANVAS   */}
            {/* ---------------------------------------------------------------- */}
            <div className="lg:col-span-5 bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    2D Vertical Tether Ribbon & Climber Elevation
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    100,000 km Carbon Nanotube Ribbon Profile · Coriolis Dynamic Bending
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-bold">
                  LIVE INTERACTIVE
                </span>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="relative bg-[#02040A] rounded-xl border border-slate-800/80 overflow-hidden flex justify-center p-2">
                
                {/* SVG Visualizer */}
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-[520px] select-none"
                  style={{ maxHeight: '540px' }}
                >
                  <defs>
                    {/* Linear gradient for laser beam from ground */}
                    <linearGradient id="groundLaserGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                    </linearGradient>

                    {/* Gradient for space reflector laser */}
                    <linearGradient id="spaceLaserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.7" />
                      <stop offset="60%" stopColor="#10B981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Starfield background dust */}
                  {Array.from({ length: 45 }).map((_, i) => (
                    <circle
                      key={`star-${i}`}
                      cx={(i * 37) % svgWidth}
                      cy={(i * 61) % svgHeight}
                      r={(i % 3 === 0) ? 1.2 : 0.8}
                      fill="#64748B"
                      opacity={(i % 5 === 0) ? 0.7 : 0.3}
                    />
                  ))}

                  {/* Atmospheric gradient overlay (0 - 100 km) */}
                  <rect
                    x="20"
                    y={karmanY}
                    width={svgWidth - 40}
                    height={480 - karmanY}
                    fill="url(#atmosGrad)"
                    opacity="0.25"
                  />
                  <linearGradient id="atmosGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.0" />
                  </linearGradient>

                  {/* LEO Debris Alert Zone (600 - 1400 km) */}
                  <rect
                    x="25"
                    y={getCanvasY(1400)}
                    width={svgWidth - 50}
                    height={getCanvasY(600) - getCanvasY(1400)}
                    fill="#F59E0B"
                    opacity="0.06"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - 30}
                    y={getCanvasY(1000)}
                    textAnchor="end"
                    fill="#F59E0B"
                    fontSize="9"
                    fontFamily="monospace"
                    opacity="0.8"
                  >
                    LEO DEBRIS CORRIDOR
                  </text>

                  {/* Van Allen Inner Belt Zone (3000 - 8000 km) */}
                  <rect
                    x="25"
                    y={getCanvasY(8000)}
                    width={svgWidth - 50}
                    height={getCanvasY(3000) - getCanvasY(8000)}
                    fill="#8B5CF6"
                    opacity="0.08"
                    stroke="#8B5CF6"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={svgWidth - 30}
                    y={getCanvasY(5500)}
                    textAnchor="end"
                    fill="#A78BFA"
                    fontSize="9"
                    fontFamily="monospace"
                    opacity="0.8"
                  >
                    INNER VAN ALLEN BELT
                  </text>

                  {/* Ground Base / Earth curvature representation */}
                  <path
                    d={`M 10 500 Q ${svgWidth / 2} 475 ${svgWidth - 10} 500 L ${svgWidth} 520 L 0 520 Z`}
                    fill="#0F172A"
                    stroke="#0284C7"
                    strokeWidth="2"
                  />
                  <text
                    x={svgWidth / 2}
                    y={512}
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    GALAPAGOS EQUATORIAL ANCHOR (0 KM)
                  </text>

                  {/* Opposing Laser Beams */}
                  {/* Ground Laser Beam: from bottom center (x=170, y=480) shooting up to climber */}
                  <polygon
                    points={`160,480 180,480 ${170 + coriolisSvgOffset + 8},${climberY + 12} ${170 + coriolisSvgOffset - 8},${climberY + 12}`}
                    fill="url(#groundLaserGrad)"
                    filter="url(#laserGlow)"
                    opacity="0.8"
                  />

                  {/* Space Reflector Laser Beam: from GEO reflector satellite shooting down to climber */}
                  <polygon
                    points={`164,${geoY - 20} 176,${geoY - 20} ${170 + coriolisSvgOffset + 6},${climberY - 12} ${170 + coriolisSvgOffset - 6},${climberY - 12}`}
                    fill="url(#spaceLaserGrad)"
                    filter="url(#laserGlow)"
                    opacity="0.7"
                  />

                  {/* Central Tether Nanotube Ribbon with Coriolis S-Curve */}
                  {/* Anchor: (170, 480) -> Midway curve with deflection -> GEO (170, 160) -> Counterweight (170, 40) */}
                  <path
                    d={`M 170 480 Q ${170 + coriolisSvgOffset * 1.4} ${(480 + geoY) / 2} 170 ${geoY} L 170 40`}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#laserGlow)"
                  />

                  {/* Inner high-strain ribbon core */}
                  <path
                    d={`M 170 480 Q ${170 + coriolisSvgOffset * 1.4} ${(480 + geoY) / 2} 170 ${geoY} L 170 40`}
                    fill="none"
                    stroke="#E0F2FE"
                    strokeWidth="1.2"
                  />

                  {/* GEO Station graphic at 35,786 km */}
                  <g transform={`translate(170, ${geoY})`}>
                    <line x1="-35" y1="0" x2="35" y2="0" stroke="#F59E0B" strokeWidth="2.5" />
                    <rect x="-18" y="-7" width="36" height="14" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#10B981" />
                    <text x="40" y="4" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      GEO TERMINAL 35,786 KM
                    </text>
                  </g>

                  {/* Apex Counterweight Asteroid graphic at 100,000 km */}
                  <g transform={`translate(170, 40)`}>
                    <polygon
                      points="-18,-8 12,-12 22,2 14,14 -12,12 -20,2"
                      fill="#334155"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    <text x="28" y="4" fill="#CBD5E1" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      APEX BALLAST (100,000 KM)
                    </text>
                  </g>

                  {/* Dynamic Climber Carriage Marker */}
                  <g transform={`translate(${170 + coriolisSvgOffset}, ${climberY})`}>
                    {/* Pulsing beacon ring */}
                    <circle cx="0" cy="0" r="14" fill="#06B6D4" opacity="0.2" className="animate-ping" />
                    
                    {/* Climber Chassis */}
                    <rect x="-14" y="-10" width="28" height="20" rx="3" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
                    
                    {/* Optical receiver dish on top/bottom */}
                    <path d="M -10 -10 Q 0 -15 10 -10 Z" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1" />
                    <path d="M -10 10 Q 0 15 10 10 Z" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1" />
                    
                    {/* Central tracking sensor */}
                    <circle cx="0" cy="0" r="3.5" fill="#10B981" />
                    
                    {/* Callout box */}
                    <g transform="translate(18, -12)">
                      <rect x="0" y="0" width="95" height="26" rx="4" fill="#02040A" stroke="#06B6D4" strokeWidth="1" opacity="0.95" />
                      <text x="6" y="11" fill="#E2E8F0" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                        HC-12 CARRIAGE
                      </text>
                      <text x="6" y="21" fill="#22D3EE" fontSize="8" fontFamily="monospace">
                        {altitudeKm.toFixed(0)} KM · {velocityKmh} KM/H
                      </text>
                    </g>
                  </g>

                  {/* Waypoint Markers */}
                  {TETHER_WAYPOINTS.map(wp => {
                    const yPos = getCanvasY(wp.altitudeKm);
                    const isSelected = selectedWaypoint?.id === wp.id;
                    return (
                      <g 
                        key={wp.id} 
                        transform={`translate(35, ${yPos})`} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedWaypoint(wp)}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? "5" : "3.5"}
                          fill={isSelected ? "#22D3EE" : "#475569"}
                          stroke={isSelected ? "#FFFFFF" : "#1E293B"}
                          strokeWidth="1.5"
                        />
                        <text
                          x="10"
                          y="3"
                          fill={isSelected ? "#E0F2FE" : "#94A3B8"}
                          fontSize="9"
                          fontWeight={isSelected ? "bold" : "normal"}
                          fontFamily="monospace"
                          className="group-hover:fill-cyan-300 transition-colors"
                        >
                          {wp.name} ({wp.altitudeKm.toLocaleString()} KM)
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Altitude Quick Scrub & Readout Bar */}
                <div className="absolute top-3 left-3 bg-[#0B0F17]/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur text-xs font-mono">
                  <div className="text-slate-400 font-bold mb-1">CORIOLIS OFFSET</div>
                  <div className="text-sky-300 font-bold text-sm">ΔX: {coriolisDeflectionMeters} M</div>
                  <div className="text-slate-400 text-[10px] mt-1">LATITUDE: 00°00'00"N</div>
                </div>

                <div className="absolute top-3 right-3 bg-[#0B0F17]/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur text-xs font-mono text-right">
                  <div className="text-slate-400 font-bold mb-1">OPTICAL BEAM AIM</div>
                  <div className="text-amber-400 font-bold text-sm">820NM LOCK</div>
                  <div className="text-emerald-400 text-[10px] mt-1">JITTER: ±{jitterMrad} mrad</div>
                </div>
              </div>

              {/* Waypoint Inspector Drawer */}
              {selectedWaypoint && (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-cyan-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" />
                      INSPECTING: {selectedWaypoint.name}
                    </span>
                    <span className="text-slate-300">{selectedWaypoint.altitudeKm.toLocaleString()} KM</span>
                  </div>
                  <p className="text-slate-300">{selectedWaypoint.description}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span>TYPE: {selectedWaypoint.type}</span>
                    <span>·</span>
                    <button
                      onClick={() => {
                        setAltitudeKm(selectedWaypoint.altitudeKm);
                        addLog('WAYPOINT_TRANSIT_OVERRIDE', `Manual simulation jump to ${selectedWaypoint.name} (${selectedWaypoint.altitudeKm} km)`, 'WARN');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 underline font-bold"
                    >
                      JUMP CLIMBER TO THIS ALTITUDE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* PANE 3: CENTER-RIGHT PHOTOVOLTAIC RECEIVER & TRACTION DIAGNOSTICS */}
            {/* ---------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Section 3A: High-Efficiency Multi-Junction Laser PV Receiver */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-400" />
                      Photovoltaic Laser Receiver & Thermal Dissipation
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Multi-junction InGaAsP/GaAs Concentrator Array · Ventral Heat-Pipe Radiators
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal('TRIM_LASER')}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    TRIM LASER RECEIVER AIM
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-3">
                    <div className="text-xs font-mono text-slate-400 uppercase">ARRAY VOLTAGE</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-slate-100 mt-1 tabular-nums">
                      {pvVoltageV.toFixed(1)} <span className="text-xs font-normal text-amber-400">V DC</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">NOMINAL: 1,200 V</div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-3">
                    <div className="text-xs font-mono text-slate-400 uppercase">BEAM FLUX</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-slate-100 mt-1 tabular-nums">
                      {beamFluxMwM2.toFixed(2)} <span className="text-xs font-normal text-amber-400">MW/m²</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">LOCK: 99.4% CENTERING</div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-3">
                    <div className="text-xs font-mono text-slate-400 uppercase">HEAT PIPE REJECT</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-slate-100 mt-1 tabular-nums">
                      {heatPipeRejectionMw.toFixed(2)} <span className="text-xs font-normal text-indigo-400">MW</span>
                    </div>
                    <div className="text-[10px] font-mono text-indigo-300 mt-1">TEMP: 342.1 K</div>
                  </div>

                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-3">
                    <div className="text-xs font-mono text-slate-400 uppercase">ABSORPTION EFF</div>
                    <div className="text-xl md:text-2xl font-black font-mono text-slate-100 mt-1 tabular-nums">
                      94.2 <span className="text-xs font-normal text-emerald-400">%</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">MULTI-JUNCTION</div>
                  </div>
                </div>

                {/* Laser Receiver Target Scope */}
                <div className="bg-[#02040A] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Visual target reticle */}
                    <div className="relative w-24 h-24 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-slate-800/60 m-3" />
                      <div className="absolute inset-0 rounded-full border border-slate-800/40 m-6" />
                      <div className="absolute w-full h-[1px] bg-slate-700/60" />
                      <div className="absolute h-full w-[1px] bg-slate-700/60" />
                      
                      {/* Laser spot marker */}
                      <div 
                        className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_#F59E0B] transition-all duration-300"
                        style={{
                          transform: `translate(${laserAimOffsetM.x * 30}px, ${laserAimOffsetM.y * 30}px)`
                        }}
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <div className="text-slate-300 font-bold mb-1">GIMBAL TRACKING SERVO COORD:</div>
                      <div className="text-slate-400">OFFSET X: <span className="text-amber-400 font-bold">{laserAimOffsetM.x > 0 ? `+${laserAimOffsetM.x}` : laserAimOffsetM.x} m</span></div>
                      <div className="text-slate-400">OFFSET Y: <span className="text-amber-400 font-bold">{laserAimOffsetM.y > 0 ? `+${laserAimOffsetM.y}` : laserAimOffsetM.y} m</span></div>
                      <div className="text-slate-400">ATMOSPHERIC JITTER: <span className="text-emerald-400 font-bold">{jitterMrad} mrad</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleTrimLaser(0, 0)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono font-bold"
                    >
                      AUTO-ZERO BEAM CALIBRATION
                    </button>
                    <div className="text-[11px] font-mono text-slate-400 text-center md:text-right">
                      Source: Galapagos Phased Array (820 nm)
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3B: 8-Wheel Magnetic Pinch Traction Drive Diagnostics */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      8-Wheel Magnetic Pinch Traction Drive
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Independent Direct-Drive High-Torque Bogies · 48.5 kN Hydraulic Normal Clamping
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModal('PINCH_PRESSURE')}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      CYCLE PINCH PRESSURE
                    </button>
                    <button
                      onClick={() => setActiveModal('REGEN_DESCENT')}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      REGEN DESCENT
                    </button>
                  </div>
                </div>

                {/* 8-Wheel Visual Diagnostic Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pinchWheels.map(wheel => (
                    <div
                      key={wheel.index}
                      className="bg-[#111827] border border-slate-800 hover:border-cyan-500/30 rounded-xl p-3 flex flex-col gap-1 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className="text-cyan-400">WHEEL #{wheel.index}</span>
                        <span className="text-slate-400 text-[10px]">{wheel.side}</span>
                      </div>
                      
                      <div className="text-sm font-mono font-bold text-slate-100 mt-1">
                        {wheel.torqueNm} <span className="text-xs text-slate-400 font-normal">Nm</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400 mt-1 pt-1 border-t border-slate-800">
                        <div>
                          CLAMP: <span className="text-slate-200 font-semibold">{wheel.pinchForceKn} kN</span>
                        </div>
                        <div>
                          SLIP: <span className="text-emerald-400 font-semibold">{wheel.slipPct}%</span>
                        </div>
                        <div>
                          TEMP: <span className="text-slate-200">{wheel.tempC}°C</span>
                        </div>
                        <div>
                          RPM: <span className="text-slate-200">{wheel.rpm}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-[#02040A] p-3 rounded-xl border border-slate-800 text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>OVERALL SLIP RATIO: <span className="text-emerald-400 font-bold">0.020%</span> (TOLERANCE &lt; 0.05%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>REGENERATIVE RECOVERY: <span className="text-indigo-400 font-bold">420 kW CAPACITY</span></span>
                  </div>
                </div>
              </div>

              {/* Section 3C: Tether Ribbon Optical Inspection & Pitting Defect Scanner */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      Tether Ribbon Optical Inspection Cameras
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Continuous 4K Nanoscale Surface Scanner · Micrometeorite Pitting & Fiber Fraying Monitor
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal('ULTRASONIC_SCAN')}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    RUN ULTRASONIC TEST
                  </button>
                </div>

                {/* Defect Log Summary */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider">
                        <th className="py-2.5 px-3">EVENT ID</th>
                        <th className="py-2.5 px-3">ALTITUDE</th>
                        <th className="py-2.5 px-3">DEFECT TYPE</th>
                        <th className="py-2.5 px-3">SEVERITY</th>
                        <th className="py-2.5 px-3">PITTING DEPTH</th>
                        <th className="py-2.5 px-3">ACTION STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                      {defects.map(def => (
                        <tr key={def.id} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 text-cyan-400 font-bold">{def.id}</td>
                          <td className="py-2 px-3 text-slate-200">{def.altitudeKm} KM</td>
                          <td className="py-2 px-3 text-slate-300 font-semibold">{def.type}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              def.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' :
                              def.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                            }`}>
                              {def.severity}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-200">{def.depthUm} µm</td>
                          <td className="py-2 px-3">
                            <span className={`font-semibold ${def.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              ● {def.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>OVERALL TETHER STRUCTURAL INTEGRITY: <span className="text-emerald-400 font-bold">99.88% NOMINAL</span></span>
                  <span>SCAN SENSORS: 4/4 ACTIVE</span>
                </div>
              </div>

            </div>

          </div>

          {/* ------------------------------------------------------------------ */}
          {/* PANE 4: BOTTOM CLIMBER CARGO MANIFEST & ORBITAL DELIVERY LEDGER   */}
          {/* ------------------------------------------------------------------ */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Box className="w-5 h-5 text-cyan-400" />
                  Climber Cargo Manifest & Orbital Delivery Ledger
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Pressurized Pods POD-GEO-01 through POD-GEO-10 · Total Payload Mass: 101,700 kg
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter pods..."
                    value={cargoSearch}
                    onChange={(e) => setCargoSearch(e.target.value)}
                    className="bg-[#111827] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-[#111827] border border-slate-800 rounded-lg p-1 text-xs font-mono">
                  {['ALL', 'CRITICAL', 'HABITAT', 'CRYO', 'AVIONICS'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCargoFilter(cat)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        cargoFilter === cat
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Export CSV Button */}
                <button
                  onClick={exportManifestCSV}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  EXPORT CSV
                </button>
              </div>
            </div>

            {/* High-Contrast Large-Typography Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-300 text-xs md:text-sm font-bold font-mono uppercase tracking-wider bg-slate-900/60">
                    <th className="py-3.5 px-3">POD CODE</th>
                    <th className="py-3.5 px-3">PAYLOAD DESCRIPTION</th>
                    <th className="py-3.5 px-3">MASS</th>
                    <th className="py-3.5 px-3">INTEGRITY</th>
                    <th className="py-3.5 px-3">PROGRESS</th>
                    <th className="py-3.5 px-3">ETA GEO</th>
                    <th className="py-3.5 px-3">POWER DRAW</th>
                    <th className="py-3.5 px-3">PRIORITY</th>
                    <th className="py-3.5 px-3">DESTINATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm font-mono">
                  {filteredCargo.map(pod => (
                    <tr key={pod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-cyan-400 whitespace-nowrap">
                        {pod.code}
                      </td>
                      <td className="py-3.5 px-3 text-slate-100 font-medium">
                        {pod.payload}
                      </td>
                      <td className="py-3.5 px-3 text-slate-200 tabular-nums whitespace-nowrap">
                        {pod.massKg.toLocaleString()} kg
                      </td>
                      <td className="py-3.5 px-3 text-emerald-400 font-bold tabular-nums whitespace-nowrap">
                        {pod.integrityPct.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${pod.progressPct}%` }}
                            />
                          </div>
                          <span className="text-slate-200 font-bold tabular-nums">{pod.progressPct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-semibold tabular-nums whitespace-nowrap">
                        {pod.etaHours} h
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 tabular-nums whitespace-nowrap">
                        {pod.powerDrawKwhKm} kWh/km
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          pod.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' :
                          pod.priority === 'TIER_1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {pod.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 text-xs font-mono whitespace-nowrap">
                        {pod.destination}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ledger Footer Metrics */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <span>TOTAL PODS: <span className="text-slate-200 font-bold">{cargoPods.length}</span></span>
                <span>ATMOSPHERIC SEAL: <span className="text-emerald-400 font-bold">100% SECURE</span></span>
                <span>AGGREGATE POWER CONSUMPTION: <span className="text-amber-400 font-bold">136.6 kWh/km</span></span>
              </div>
              <div className="text-cyan-400 font-semibold">
                GEO ARRIVAL WINDOW: T+97.7 HOURS
              </div>
            </div>

          </section>

          {/* ------------------------------------------------------------------ */}
          {/* OPERATOR AUDIT TRAIL LOG DRAWER                                    */}
          {/* ------------------------------------------------------------------ */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Flight Director Event Log & Audit Ledger
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {logs.length} RECORDED ACTIONS
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-[#111827] px-3 py-2 rounded-lg text-xs font-mono border border-slate-800/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 font-bold">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                      {log.operator}
                    </span>
                    <span className="font-bold text-slate-200">{log.action}:</span>
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase self-start sm:self-auto ${
                    log.level === 'CRITICAL' ? 'text-rose-400' :
                    log.level === 'WARN' ? 'text-amber-400' :
                    log.level === 'ACTION' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    [{log.level}]
                  </span>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ==================================================================== */}
        {/* INTERACTIVE ACTION MODALS                                            */}
        {/* ==================================================================== */}

        {/* Modal 1: Emergency Brake / Decouple Key Switch */}
        {activeModal === 'EMERGENCY_BRAKE' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border-2 border-rose-500/80 rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 text-rose-400">
                  <ShieldAlert className="w-8 h-8 text-rose-500" />
                  <div>
                    <h3 className="text-lg font-black font-mono tracking-wider text-rose-100">
                      CONFIRM EMERGENCY FRICTION CLAMP
                    </h3>
                    <p className="text-xs font-mono text-rose-300">
                      Decouple 4.8 MW Optical Beaming & Deploy Ceramic Pinch Brakes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal('NONE')}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3.5 text-xs font-mono text-rose-200 space-y-2">
                <p className="font-bold">CRITICAL WARNING:</p>
                <p>
                  Deploying friction clamps at 14,280 km altitude will generate severe thermal spikes (up to 480°C) across the carbon nanotube ribbon. This action is irreversible without Flight Director override keys.
                </p>
                <p className="text-slate-300">
                  Type <span className="text-amber-400 font-bold">OVERRIDE-APEX-BRAKE</span> to arm failsafe decouple:
                </p>
              </div>

              <input
                type="text"
                value={brakeConfirmKey}
                onChange={(e) => setBrakeConfirmKey(e.target.value)}
                placeholder="OVERRIDE-APEX-BRAKE"
                className="bg-[#02040A] border border-rose-600 rounded-lg p-2.5 text-sm font-mono text-rose-300 placeholder:text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveModal('NONE')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-bold"
                >
                  ABORT
                </button>
                <button
                  onClick={handleExecuteEmergencyBrake}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold shadow-lg shadow-rose-900/50"
                >
                  ENGAGE EMERGENCY BRAKE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Trim Laser Receiver Aim */}
        {activeModal === 'TRIM_LASER' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-amber-500/60 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <Sun className="w-6 h-6" />
                  <h3 className="text-base font-bold font-mono tracking-wider text-slate-100">
                    TRIM LASER RECEIVER AIM
                  </h3>
                </div>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300">
                Adjust gimbal servo mirrors to center the 820 nm ground laser beam flux on the multi-junction PV concentrator.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div />
                <button
                  onClick={() => handleTrimLaser(0, -0.05)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded"
                >
                  ▲ +Y
                </button>
                <div />
                <button
                  onClick={() => handleTrimLaser(-0.05, 0)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded"
                >
                  ◀ -X
                </button>
                <button
                  onClick={() => handleTrimLaser(0, 0)}
                  className="p-2.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/40"
                >
                  ZERO
                </button>
                <button
                  onClick={() => handleTrimLaser(0.05, 0)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded"
                >
                  +X ▶
                </button>
                <div />
                <button
                  onClick={() => handleTrimLaser(0, 0.05)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded"
                >
                  ▼ -Y
                </button>
                <div />
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded">
                Current Offset: X={laserAimOffsetM.x}m, Y={laserAimOffsetM.y}m | Flux: 8.65 MW/m²
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Cycle Pinch Wheel Pressure */}
        {activeModal === 'PINCH_PRESSURE' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-cyan-500/60 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <SlidersHorizontal className="w-6 h-6" />
                  <h3 className="text-base font-bold font-mono tracking-wider text-slate-100">
                    CYCLE PINCH PRESSURE
                  </h3>
                </div>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300">
                Command hydraulic actuators across all 8 drive bogies to balance carbon nanotube clamping force and prevent micro-slip.
              </p>

              <div className="flex flex-col gap-2">
                {[
                  { label: 'Standard Ascent (48.5 kN - Optimal Wear)', val: 48.5 },
                  { label: 'High-Tension Boost (52.0 kN - Steep Gradient)', val: 52.0 },
                  { label: 'Low-Friction Coast (42.0 kN - Power Save)', val: 42.0 },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => handleCyclePinchForce(opt.val)}
                    className="p-3 bg-slate-800/80 hover:bg-slate-700 text-left rounded-lg text-xs font-mono text-slate-200 hover:text-cyan-300 border border-slate-700 flex justify-between items-center"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Engage Regenerative Descent */}
        {activeModal === 'REGEN_DESCENT' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-indigo-500/60 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 text-indigo-400">
                  <RotateCcw className="w-6 h-6" />
                  <h3 className="text-base font-bold font-mono tracking-wider text-slate-100">
                    ENGAGE REGENERATIVE DESCENT
                  </h3>
                </div>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300">
                Reverse drive polarity into dynamo energy harvesting mode. Power will feed directly back into carriage supercapacitors at 160 km/h.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveModal('NONE')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleEngageRegenDescent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono font-bold"
                >
                  CONFIRM REVERSE DESCENT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 5: Run Ultrasonic Scan */}
        {activeModal === 'ULTRASONIC_SCAN' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-emerald-500/60 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <RefreshCw className="w-6 h-6" />
                  <h3 className="text-base font-bold font-mono tracking-wider text-slate-100">
                    ULTRASONIC ACOUSTIC TEST
                  </h3>
                </div>
                <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300">
                Pulse high-frequency acoustic waves through the 1-meter-wide carbon nanotube ribbon to detect internal delamination or invisible lattice microfractures.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveModal('NONE')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUltrasonicScan}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold"
                >
                  EXECUTE PULSE SWEEP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* QUIET FOOTER                                                         */}
        {/* ==================================================================== */}
        <footer className="border-t border-slate-900 bg-[#02040A] py-4 px-6 text-center text-xs font-mono text-slate-400">
          APEX-ASCENT ORBITAL TETHER ARCHITECTURE · GALAPAGOS BASE TO GEO TERMINAL · CLIMBER HC-12 DEPLOYED
        </footer>

      </div>
    </>
  );
}
