/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Compass,
  Crosshair,
  Radio,
  BatteryCharging,
  AlertTriangle,
  ShieldAlert,
  AlertOctagon,
  Lock,
  Unlock,
  RefreshCw,
  Send,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Search,
  Eye,
  Thermometer,
  Activity,
  Navigation,
  ZoomIn,
  ZoomOut,
  Wind,
  Layers,
  MapPin,
  ChevronRight,
  Shield,
  Zap,
  ArrowRight,
  Check,
  Plane
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- TYPES & INTERFACES ---

export type PriorityTier = 'Cold-Chain Medical' | 'Rush Express' | 'Standard Cargo';
export type DeliveryStatus = 'in_transit' | 'docked' | 'queued' | 'diverted' | 'delivered' | 'aborted';
export type PadStatus = 'Occupied' | 'Swapping' | 'Charging' | 'Clear';
export type LatchStatus = 'Locked' | 'Released' | 'Releasing' | 'Secure';

export interface WaypointItem {
  id: string;
  name: string;
  altitudeFt: number;
  speedKts: number;
  bearingDeg: number;
  status: 'passed' | 'active' | 'upcoming';
  etaMinutes: number;
}

export interface DroneItem {
  id: string;
  callsign: string;
  model: string;
  battery: number;
  batteryHealth: number;
  altitude: number;
  airspeed: number;
  heading: number;
  status: 'in_flight' | 'docked' | 'charging' | 'holding' | 'emergency_landing';
  assignedPadId?: string;
  corridor: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetSector: string;
  motorTemp: number;
  payloadTemp?: number;
  priority: PriorityTier;
  manifestId: string;
  cargo: string;
  etaSeconds: number;
  waypoints?: WaypointItem[];
}

export interface NestPad {
  id: string;
  code: string;
  bayNumber: number;
  status: PadStatus;
  chargerKw: number;
  maxChargeKw: number;
  tempCelsius: number;
  latchStatus: LatchStatus;
  droneCallsign: string | null;
  swapProgress: number; // 0 - 100%
  swapSecondsRemaining?: number;
  ilsActive: boolean;
}

export interface HazardZone {
  id: string;
  code: string;
  title: string;
  type: 'Microburst Shear' | 'Downdraft Turbulence' | 'Crane Rig Obstacle';
  severity: 'advisory' | 'moderate' | 'severe';
  bearingDeg: number;
  distanceKm: number;
  radiusKm: number;
  windSpeed: number;
  x: number;
  y: number;
  isSimulated?: boolean;
}

export interface ManifestItem {
  id: string;
  trackingCode: string;
  priority: PriorityTier;
  cargo: string;
  weightKg: number;
  targetTemp?: number;
  actualTemp?: number;
  originSector: string;
  destinationSector: string;
  corridor: string;
  droneCallsign: string;
  status: DeliveryStatus;
  etaSeconds: number;
  departureTime: string;
  waypoints: WaypointItem[];
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'PAD' | 'AIRSPACE' | 'SORTIE' | 'ALERT' | 'MESH';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

// Initial Simulated Drones
const INITIAL_DRONES: DroneItem[] = [
  {
    id: 'd1',
    callsign: 'DR-118',
    model: 'CryoDart Medical-X',
    battery: 84,
    batteryHealth: 99.8,
    altitude: 360,
    airspeed: 54,
    heading: 228,
    status: 'in_flight',
    corridor: 'CORRIDOR-BRAVO (HOSPITAL MEDICAL EXPRESS)',
    x: -35,
    y: 42,
    vx: -0.22,
    vy: 0.18,
    targetSector: 'Sector 4 South Ridge Medical Plaza',
    motorTemp: 35.7,
    payloadTemp: 3.8,
    priority: 'Cold-Chain Medical',
    manifestId: 'MN-MED-9401',
    cargo: 'Whole Blood Units O-Neg (Cryo-Box)',
    etaSeconds: 384
  },
  {
    id: 'd2',
    callsign: 'DR-331',
    model: 'AeroFalcon Heavy-Hex',
    battery: 76,
    batteryHealth: 98.7,
    altitude: 410,
    airspeed: 48,
    heading: 42,
    status: 'in_flight',
    corridor: 'CORRIDOR-ALPHA (NORTHWEST COMMERCE)',
    x: 48,
    y: -38,
    vx: 0.25,
    vy: -0.22,
    targetSector: 'Sector 7B North Bay Commercial Port',
    motorTemp: 38.1,
    priority: 'Rush Express',
    manifestId: 'MN-RSH-8120',
    cargo: 'Critical Avionics Transponder Chipset',
    etaSeconds: 240
  },
  {
    id: 'd3',
    callsign: 'DR-554',
    model: 'CryoDart Medical-X',
    battery: 91,
    batteryHealth: 99.5,
    altitude: 450,
    airspeed: 51,
    heading: 134,
    status: 'in_flight',
    corridor: 'CORRIDOR-CHARLIE (EAST INDUSTRIAL HARBOR)',
    x: 62,
    y: 52,
    vx: 0.28,
    vy: 0.16,
    targetSector: 'Sector 9 East Bay Children Clinic',
    motorTemp: 34.9,
    payloadTemp: -20.2,
    priority: 'Cold-Chain Medical',
    manifestId: 'MN-MED-9402',
    cargo: 'mRNA Biological Vaccines (-20C Regulated)',
    etaSeconds: 520
  },
  {
    id: 'd4',
    callsign: 'DR-902',
    model: 'Courier Swift-V4',
    battery: 68,
    batteryHealth: 95.2,
    altitude: 480,
    airspeed: 42,
    heading: 312,
    status: 'in_flight',
    corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)',
    x: -55,
    y: -48,
    vx: -0.19,
    vy: -0.21,
    targetSector: 'Sector 12 Downtown Core Vertiport',
    motorTemp: 39.4,
    priority: 'Standard Cargo',
    manifestId: 'MN-STD-3104',
    cargo: 'High-Density Fiber Optics Splicing Kit',
    etaSeconds: 780
  },
  {
    id: 'd5',
    callsign: 'DR-620',
    model: 'SkyCargo Titan-X',
    battery: 59,
    batteryHealth: 96.0,
    altitude: 520,
    airspeed: 39,
    heading: 15,
    status: 'in_flight',
    corridor: 'CORRIDOR-ALPHA (NORTHWEST COMMERCE)',
    x: 18,
    y: -65,
    vx: 0.08,
    vy: -0.28,
    targetSector: 'Sector 15 Waterfront Maritime Yard',
    motorTemp: 41.2,
    priority: 'Standard Cargo',
    manifestId: 'MN-STD-3105',
    cargo: 'Precision Laser Surveying Toolset',
    etaSeconds: 1040
  },
  {
    id: 'd6',
    callsign: 'DR-224',
    model: 'AeroFalcon Heavy-Hex',
    battery: 72,
    batteryHealth: 98.1,
    altitude: 380,
    airspeed: 32,
    heading: 270,
    status: 'holding',
    corridor: 'CORRIDOR-BRAVO (HOSPITAL MEDICAL EXPRESS)',
    x: -60,
    y: 12,
    vx: 0.12,
    vy: 0.18,
    targetSector: 'Sector 3 South Substation Grid 08',
    motorTemp: 36.0,
    priority: 'Rush Express',
    manifestId: 'MN-RSH-8121',
    cargo: 'Emergency Power Grid Relays',
    etaSeconds: 680
  },
  {
    id: 'd7',
    callsign: 'DR-477',
    model: 'Courier Swift-V4',
    battery: 64,
    batteryHealth: 97.0,
    altitude: 430,
    airspeed: 46,
    heading: 295,
    status: 'in_flight',
    corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)',
    x: -28,
    y: -32,
    vx: -0.24,
    vy: -0.12,
    targetSector: 'Sector 1 San Francisco General VertiPad',
    motorTemp: 37.3,
    payloadTemp: 4.0,
    priority: 'Cold-Chain Medical',
    manifestId: 'MN-MED-9403',
    cargo: 'Cardiac Transport Perfusion Chamber',
    etaSeconds: 440
  }
];

// Initial 4 Automated Docking Bays
const INITIAL_PADS: NestPad[] = [
  {
    id: 'pad-1',
    code: 'PAD-ALPHA',
    bayNumber: 1,
    status: 'Occupied',
    chargerKw: 24.2,
    maxChargeKw: 45.0,
    tempCelsius: 26.4,
    latchStatus: 'Locked',
    droneCallsign: 'DR-809',
    swapProgress: 100,
    ilsActive: true
  },
  {
    id: 'pad-2',
    code: 'PAD-BETA',
    bayNumber: 2,
    status: 'Swapping',
    chargerKw: 0.0,
    maxChargeKw: 45.0,
    tempCelsius: 29.8,
    latchStatus: 'Released',
    droneCallsign: 'DR-412',
    swapProgress: 64,
    swapSecondsRemaining: 3,
    ilsActive: true
  },
  {
    id: 'pad-3',
    code: 'PAD-GAMMA',
    bayNumber: 3,
    status: 'Charging',
    chargerKw: 38.5,
    maxChargeKw: 45.0,
    tempCelsius: 31.2,
    latchStatus: 'Locked',
    droneCallsign: 'DR-705',
    swapProgress: 0,
    ilsActive: true
  },
  {
    id: 'pad-4',
    code: 'PAD-DELTA',
    bayNumber: 4,
    status: 'Clear',
    chargerKw: 0.0,
    maxChargeKw: 45.0,
    tempCelsius: 21.3,
    latchStatus: 'Released',
    droneCallsign: null,
    swapProgress: 0,
    ilsActive: true
  }
];

// Initial Weather Hazard Zones
const INITIAL_HAZARDS: HazardZone[] = [
  {
    id: 'hz-1',
    code: 'HAZARD-01-MICRO',
    title: 'Microburst Wind Shear',
    type: 'Microburst Shear',
    severity: 'severe',
    bearingDeg: 275,
    distanceKm: 11.8,
    radiusKm: 3.2,
    windSpeed: 44,
    x: -56,
    y: 5
  },
  {
    id: 'hz-2',
    code: 'HAZARD-02-DOWNDRAFT',
    title: 'Thermal Downdraft Eddy',
    type: 'Downdraft Turbulence',
    severity: 'moderate',
    bearingDeg: 48,
    distanceKm: 7.5,
    radiusKm: 2.1,
    windSpeed: 28,
    x: 35,
    y: -38
  },
  {
    id: 'hz-3',
    code: 'HAZARD-03-CRANE',
    title: 'Tower Crane Assembly Zone C',
    type: 'Crane Rig Obstacle',
    severity: 'advisory',
    bearingDeg: 162,
    distanceKm: 5.4,
    radiusKm: 1.4,
    windSpeed: 12,
    x: 18,
    y: 42
  }
];

// Delivery Manifest Items with Waypoints
const INITIAL_MANIFESTS: ManifestItem[] = [
  {
    id: 'm1',
    trackingCode: 'MN-MED-9401',
    priority: 'Cold-Chain Medical',
    cargo: 'Whole Blood Units O-Neg (Cryo-Insulated Box)',
    weightKg: 3.8,
    targetTemp: 4.0,
    actualTemp: 3.8,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 4 South Ridge Medical Plaza',
    corridor: 'CORRIDOR-BRAVO (HOSPITAL MEDICAL EXPRESS)',
    droneCallsign: 'DR-118',
    status: 'in_transit',
    etaSeconds: 384,
    departureTime: '23:38:12 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04 (Origin)', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Skyway South Bravo Checkpoint', altitudeFt: 360, speedKts: 54, bearingDeg: 228, status: 'active', etaMinutes: 2 },
      { id: 'wp-3', name: 'Mission Ridge Deconfliction Gate', altitudeFt: 380, speedKts: 52, bearingDeg: 225, status: 'upcoming', etaMinutes: 4 },
      { id: 'wp-4', name: 'South Ridge Trauma Helipad (Target)', altitudeFt: 50, speedKts: 15, bearingDeg: 228, status: 'upcoming', etaMinutes: 6 }
    ]
  },
  {
    id: 'm2',
    trackingCode: 'MN-RSH-8120',
    priority: 'Rush Express',
    cargo: 'Critical Avionics Transponder Chipset',
    weightKg: 1.2,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 7B North Bay Commercial Port',
    corridor: 'CORRIDOR-ALPHA (NORTHWEST COMMERCE)',
    droneCallsign: 'DR-331',
    status: 'in_transit',
    etaSeconds: 240,
    departureTime: '23:35:40 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Marina Skyway Checkpoint Alpha', altitudeFt: 410, speedKts: 48, bearingDeg: 42, status: 'active', etaMinutes: 2 },
      { id: 'wp-3', name: 'North Bay Pier 14 Landing Zone', altitudeFt: 40, speedKts: 12, bearingDeg: 45, status: 'upcoming', etaMinutes: 4 }
    ]
  },
  {
    id: 'm3',
    trackingCode: 'MN-MED-9402',
    priority: 'Cold-Chain Medical',
    cargo: 'mRNA Biological Vaccines (-20C Regulated)',
    weightKg: 2.1,
    targetTemp: -20.0,
    actualTemp: -20.2,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 9 East Bay Children Clinic',
    corridor: 'CORRIDOR-CHARLIE (EAST INDUSTRIAL HARBOR)',
    droneCallsign: 'DR-554',
    status: 'in_transit',
    etaSeconds: 520,
    departureTime: '23:41:00 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Bay Bridge Air Transit Gate', altitudeFt: 450, speedKts: 51, bearingDeg: 134, status: 'active', etaMinutes: 3 },
      { id: 'wp-3', name: 'East Bay Pediatrics Cryo-Dock', altitudeFt: 30, speedKts: 10, bearingDeg: 130, status: 'upcoming', etaMinutes: 8 }
    ]
  },
  {
    id: 'm4',
    trackingCode: 'MN-STD-3104',
    priority: 'Standard Cargo',
    cargo: 'High-Density Fiber Optics Splicing Kit',
    weightKg: 4.5,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 12 Downtown Core Vertiport',
    corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)',
    droneCallsign: 'DR-902',
    status: 'in_transit',
    etaSeconds: 780,
    departureTime: '23:32:15 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Market Street Air Corridor', altitudeFt: 480, speedKts: 42, bearingDeg: 312, status: 'active', etaMinutes: 5 },
      { id: 'wp-3', name: 'Civic Tower 4 Rooftop Pad', altitudeFt: 60, speedKts: 14, bearingDeg: 310, status: 'upcoming', etaMinutes: 13 }
    ]
  },
  {
    id: 'm5',
    trackingCode: 'MN-STD-3105',
    priority: 'Standard Cargo',
    cargo: 'Precision Laser Surveying Toolset',
    weightKg: 3.4,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 15 Waterfront Maritime Yard',
    corridor: 'CORRIDOR-ALPHA (NORTHWEST COMMERCE)',
    droneCallsign: 'DR-620',
    status: 'in_transit',
    etaSeconds: 1040,
    departureTime: '23:30:00 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Embarcadero Vector Node', altitudeFt: 520, speedKts: 39, bearingDeg: 15, status: 'active', etaMinutes: 7 },
      { id: 'wp-3', name: 'Maritime Cargo Crane Berth 8', altitudeFt: 50, speedKts: 12, bearingDeg: 15, status: 'upcoming', etaMinutes: 17 }
    ]
  },
  {
    id: 'm6',
    trackingCode: 'MN-RSH-8121',
    priority: 'Rush Express',
    cargo: 'Emergency Power Grid Relays',
    weightKg: 2.9,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 3 South Substation Grid 08',
    corridor: 'CORRIDOR-BRAVO (HOSPITAL MEDICAL EXPRESS)',
    droneCallsign: 'DR-224',
    status: 'in_transit',
    etaSeconds: 680,
    departureTime: '23:28:40 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Substation Outer Perimeter', altitudeFt: 380, speedKts: 32, bearingDeg: 270, status: 'active', etaMinutes: 4 },
      { id: 'wp-3', name: 'Transformer Yard Helipad B', altitudeFt: 30, speedKts: 10, bearingDeg: 270, status: 'upcoming', etaMinutes: 11 }
    ]
  },
  {
    id: 'm7',
    trackingCode: 'MN-MED-9403',
    priority: 'Cold-Chain Medical',
    cargo: 'Cardiac Transport Perfusion Chamber',
    weightKg: 5.1,
    targetTemp: 4.0,
    actualTemp: 4.0,
    originSector: 'MetroNest-04 Delta',
    destinationSector: 'Sector 1 San Francisco General VertiPad',
    corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)',
    droneCallsign: 'DR-477',
    status: 'in_transit',
    etaSeconds: 440,
    departureTime: '23:36:10 UTC',
    waypoints: [
      { id: 'wp-1', name: 'Verti-Hub Pad MN-04', altitudeFt: 0, speedKts: 0, bearingDeg: 0, status: 'passed', etaMinutes: 0 },
      { id: 'wp-2', name: 'Hospital Transit Expressway', altitudeFt: 430, speedKts: 46, bearingDeg: 295, status: 'active', etaMinutes: 3 },
      { id: 'wp-3', name: 'General Hospital Level 5 Verti-Deck', altitudeFt: 45, speedKts: 12, bearingDeg: 295, status: 'upcoming', etaMinutes: 7 }
    ]
  }
];

function DroneNestOps() {
  // --- REAL-TIME TICKING CLOCK & SIMULATED STATE ---
  const [utcTime, setUtcTime] = useState<string>('');
  const [missionElapsed, setMissionElapsed] = useState<number>(30250);
  const [groundHold, setGroundHold] = useState<boolean>(false);
  const [totalSorties, setTotalSorties] = useState<number>(142);
  const [meshLatency, setMeshLatency] = useState<number>(4.18);
  const [meshRssi] = useState<number>(-58);
  const [meshNodes] = useState<number>(14);

  // Fleet & Airspace state
  const [drones, setDrones] = useState<DroneItem[]>(INITIAL_DRONES);
  const [pads, setPads] = useState<NestPad[]>(INITIAL_PADS);
  const [hazards, setHazards] = useState<HazardZone[]>(INITIAL_HAZARDS);
  const [manifests, setManifests] = useState<ManifestItem[]>(INITIAL_MANIFESTS);
  const [selectedDrone, setSelectedDrone] = useState<DroneItem | null>(null);

  // Radar view controls
  const [radarZoom, setRadarZoom] = useState<number>(1);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showHazards, setShowHazards] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);

  // Filter & Search for manifests
  const [manifestSearch, setManifestSearch] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Panels
  const [activeTab, setActiveTab] = useState<'manifest' | 'telemetry' | 'events'>('manifest');
  const [selectedManifestDetail, setSelectedManifestDetail] = useState<ManifestItem | null>(null);
  const [abortModalDrone, setAbortModalDrone] = useState<DroneItem | null>(null);
  const [rerouteModalDrone, setRerouteModalDrone] = useState<DroneItem | null>(null);
  const [selectedNewCorridor, setSelectedNewCorridor] = useState<string>('');
  const [dispatchBayModal, setDispatchBayModal] = useState<NestPad | null>(null);

  // Operator Airspace Controls
  const [windShearActive, setWindShearActive] = useState<boolean>(false);
  const [emergencyAllLandActive, setEmergencyAllLandActive] = useState<boolean>(false);

  // Telemetry Audit Events stream
  const [eventLogs, setEventLogs] = useState<TelemetryLog[]>([
    {
      id: 'e1',
      timestamp: '23:46:12 UTC',
      type: 'PAD',
      severity: 'info',
      message: 'Pad Beta robotic gantry engaged: hot-swapping 52V cell for DR-412.'
    },
    {
      id: 'e2',
      timestamp: '23:45:30 UTC',
      type: 'AIRSPACE',
      severity: 'warning',
      message: 'Severe microburst shear registered in Sector 275° at 11.8km (44kt gusts).'
    },
    {
      id: 'e3',
      timestamp: '23:44:05 UTC',
      type: 'SORTIE',
      severity: 'info',
      message: 'DR-118 cleared ILS boundary on Corridor Bravo: Cold-Chain Medical load.'
    },
    {
      id: 'e4',
      timestamp: '23:42:18 UTC',
      type: 'PAD',
      severity: 'info',
      message: 'Pad Gamma Supercharger dynamically throttled to 38.5kW (Cell temp: 31.2°C).'
    },
    {
      id: 'e5',
      timestamp: '23:40:44 UTC',
      type: 'MESH',
      severity: 'info',
      message: '5G Low-Latency Mesh synced with 14 vertiport nodes. Round-trip ping 4.18ms.'
    }
  ]);
  const events = eventLogs;

  // Telemetry Chart Series
  const powerChartData = useMemo(() => [
    { time: 'T-15m', gridKw: 42.1, chargingKw: 28.5 },
    { time: 'T-12m', gridKw: 56.4, chargingKw: 41.2 },
    { time: 'T-09m', gridKw: 68.2, chargingKw: 52.8 },
    { time: 'T-06m', gridKw: 74.0, chargingKw: 62.7 },
    { time: 'T-03m', gridKw: 71.5, chargingKw: 59.4 },
    { time: 'NOW', gridKw: 78.4, chargingKw: 62.7 },
  ], []);

  // --- TIME & CLOCK LOOP ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
      setMissionElapsed(prev => prev + 1);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedMissionTime = useMemo(() => {
    const hrs = Math.floor(missionElapsed / 3600);
    const mins = Math.floor((missionElapsed % 3600) / 60);
    const secs = missionElapsed % 60;
    return `T+${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [missionElapsed]);

  const formatSeconds = (totalSecs: number) => {
    if (totalSecs <= 0) return '00:00';
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- RADAR SWEEP ANIMATION & AIRSPACE TELEMETRY TICK LOOP ---
  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarSweepAngle(prev => (prev + 3) % 360);

      setMeshLatency(prev => {
        const delta = (Math.random() - 0.5) * 0.12;
        return Number(Math.max(3.8, Math.min(4.8, prev + delta)).toFixed(2));
      });

      // Update active drones flight positions along corridor vectors
      setDrones(prevDrones => {
        return prevDrones.map(drone => {
          if (drone.status === 'docked') return drone;

          let newVx = drone.vx;
          let newVy = drone.vy;
          let newHeading = drone.heading;
          let newAltitude = drone.altitude;
          let newSpeed = drone.airspeed;

          if (emergencyAllLandActive) {
            const angleToCenter = Math.atan2(-drone.y, -drone.x);
            newVx = Math.cos(angleToCenter) * 0.25;
            newVy = Math.sin(angleToCenter) * 0.25;
            newHeading = Math.round((angleToCenter * (180 / Math.PI) + 90 + 360) % 360);
            newAltitude = Math.max(20, drone.altitude - 1.5);
            newSpeed = 28;
          } else if (groundHold || drone.status === 'holding') {
            const angleRad = (drone.heading + 4) * (Math.PI / 180);
            newVx = Math.cos(angleRad) * 0.15;
            newVy = Math.sin(angleRad) * 0.15;
            newHeading = (drone.heading + 4) % 360;
          } else if (windShearActive) {
            newSpeed = Math.min(30, drone.airspeed);
          }

          let newX = drone.x + newVx;
          let newY = drone.y + newVy;

          if (newX > 82) { newX = 82; newVx = -Math.abs(newVx); newHeading = 270; }
          if (newX < -82) { newX = -82; newVx = Math.abs(newVx); newHeading = 90; }
          if (newY > 82) { newY = 82; newVy = -Math.abs(newVy); newHeading = 0; }
          if (newY < -82) { newY = -82; newVy = Math.abs(newVy); newHeading = 180; }

          const newBattery = Math.max(12, Number((drone.battery - 0.015).toFixed(2)));
          const newEta = Math.max(0, drone.etaSeconds - 1);

          return {
            ...drone,
            x: Number(newX.toFixed(2)),
            y: Number(newY.toFixed(2)),
            vx: newVx,
            vy: newVy,
            altitude: Number(newAltitude.toFixed(1)),
            airspeed: newSpeed,
            heading: Math.round(newHeading),
            battery: newBattery,
            etaSeconds: newEta,
            motorTemp: Number((35 + Math.sin(Date.now() / 3000) * 2).toFixed(1))
          };
        });
      });

      // Update Pad automation states (progress swapping, charging)
      setPads(prevPads => {
        return prevPads.map(pad => {
          if (pad.status === 'Swapping') {
            const nextProgress = pad.swapProgress >= 100 ? 0 : pad.swapProgress + 20;
            const remainingSecs = Math.max(0, (pad.swapSecondsRemaining ?? 5) - 1);

            if (nextProgress >= 100 || remainingSecs === 0) {
              return {
                ...pad,
                status: 'Occupied',
                swapProgress: 100,
                swapSecondsRemaining: 0,
                latchStatus: 'Locked',
                chargerKw: 22.5
              };
            }
            return {
              ...pad,
              swapProgress: nextProgress,
              swapSecondsRemaining: remainingSecs,
              latchStatus: nextProgress > 70 ? 'Locked' : 'Releasing'
            };
          }
          if (pad.status === 'Charging') {
            const nextKw = Number((38 + Math.sin(Date.now() / 2500) * 1.5).toFixed(1));
            return {
              ...pad,
              chargerKw: nextKw,
              tempCelsius: Number((31.0 + Math.cos(Date.now() / 4000) * 0.4).toFixed(1))
            };
          }
          return pad;
        });
      });

      // Manifest ETAs & cold chain temperature micro-oscillation
      setManifests(prevManifests => {
        return prevManifests.map(m => {
          const updated = { ...m };
          if (m.status === 'in_transit' && m.etaSeconds > 0) {
            updated.etaSeconds = Math.max(0, m.etaSeconds - 1);
          }
          if (m.actualTemp !== undefined) {
            const jitter = (Math.random() - 0.5) * 0.04;
            updated.actualTemp = Number((m.actualTemp + jitter).toFixed(2));
          }
          return updated;
        });
      });
    }, 1000);

    return () => clearInterval(radarInterval);
  }, [groundHold, windShearActive, emergencyAllLandActive]);

  // Synchronize selected drone and manifest
  useEffect(() => {
    if (selectedDrone) {
      const match = drones.find(d => d.id === selectedDrone.id);
      if (match) setSelectedDrone(match);
    }
  }, [drones, selectedDrone]);

  useEffect(() => {
    if (selectedManifestDetail) {
      const match = manifests.find(m => m.id === selectedManifestDetail.id);
      if (match) setSelectedManifestDetail(match);
    }
  }, [manifests, selectedManifestDetail]);

  // --- OPERATOR CONTROL 1: SIMULATE WIND SHEAR EVENT ---
  const handleToggleWindShear = useCallback(() => {
    const nextState = !windShearActive;
    setWindShearActive(nextState);

    if (nextState) {
      const dynamicHazard: HazardZone = {
        id: 'hz-simulated-shear',
        code: 'SIM-MICROBURST-BRAVO',
        title: 'High-Shear Microburst Alert (Active)',
        type: 'Microburst Shear',
        severity: 'severe',
        bearingDeg: 210,
        distanceKm: 8.4,
        radiusKm: 4.2,
        windSpeed: 52,
        x: -42,
        y: 28,
        isSimulated: true
      };
      setHazards(prev => [...prev.filter(h => h.id !== 'hz-simulated-shear'), dynamicHazard]);

      setDrones(prevDrones =>
        prevDrones.map(d => {
          if (d.callsign === 'DR-118') {
            return {
              ...d,
              airspeed: 28,
              corridor: 'CORRIDOR-CHARLIE (EAST INDUSTRIAL HARBOR)',
              heading: 120,
              vx: 0.18,
              vy: 0.12
            };
          }
          if (d.callsign === 'DR-331') {
            return {
              ...d,
              airspeed: 29,
              corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)',
              heading: 320,
              vx: -0.15,
              vy: -0.18
            };
          }
          return {
            ...d,
            airspeed: Math.min(30, d.airspeed)
          };
        })
      );

      setManifests(prev =>
        prev.map(m => {
          if (m.droneCallsign === 'DR-118') {
            return { ...m, corridor: 'CORRIDOR-CHARLIE (EAST INDUSTRIAL HARBOR)', status: 'diverted' };
          }
          if (m.droneCallsign === 'DR-331') {
            return { ...m, corridor: 'SKYWAY-07 (DOWNTOWN SECTOR ROUTE)', status: 'diverted' };
          }
          return m;
        })
      );

      const logMsg: TelemetryLog = {
        id: `e-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        type: 'AIRSPACE',
        severity: 'critical',
        message: 'SIMULATED WIND SHEAR EVENT TRIGGERED: Microburst in Sector 210°. Max speeds clamped to 30kts. DR-118 & DR-331 autonomous deconfliction reroute executed.'
      };
      setEventLogs(prev => [logMsg, ...prev.slice(0, 19)]);
    } else {
      setHazards(prev => prev.filter(h => h.id !== 'hz-simulated-shear'));
      setDrones(prev =>
        prev.map(d => ({
          ...d,
          airspeed: d.callsign === 'DR-118' ? 54 : d.callsign === 'DR-331' ? 48 : 44
        }))
      );

      const logMsg: TelemetryLog = {
        id: `e-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        type: 'AIRSPACE',
        severity: 'info',
        message: 'Wind Shear event cleared. Speed limits restored to nominal cruise ratings.'
      };
      setEventLogs(prev => [logMsg, ...prev.slice(0, 19)]);
    }
  }, [windShearActive]);

  // --- OPERATOR CONTROL 2: EMERGENCY ALL-LAND (FAILSAFE) ---
  const handleToggleEmergencyAllLand = useCallback(() => {
    const nextState = !emergencyAllLandActive;
    setEmergencyAllLandActive(nextState);

    if (nextState) {
      setDrones(prevDrones =>
        prevDrones.map(d => {
          if (d.status === 'docked') return d;
          return {
            ...d,
            status: 'holding',
            corridor: 'RECOVERY // RETURN-TO-NEST',
            airspeed: 28
          };
        })
      );

      const logMsg: TelemetryLog = {
        id: `e-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        type: 'ALERT',
        severity: 'critical',
        message: 'EMERGENCY ALL-LAND FAILSAFE ENGAGED: All airborne units commanded into immediate return-to-nest descent.'
      };
      setEventLogs(prev => [logMsg, ...prev.slice(0, 19)]);
    } else {
      setDrones(prevDrones =>
        prevDrones.map(d => {
          if (d.status === 'docked') return d;
          return {
            ...d,
            status: 'in_flight',
            airspeed: 46
          };
        })
      );

      const logMsg: TelemetryLog = {
        id: `e-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        type: 'ALERT',
        severity: 'info',
        message: 'Emergency All-Land deactivated. Airspace units cleared to resume assigned sorties.'
      };
      setEventLogs(prev => [logMsg, ...prev.slice(0, 19)]);
    }
  }, [emergencyAllLandActive]);

  // --- BAY ACTION 1: FORCE BATTERY CYCLE (5-SECOND SIMULATED SWAP) ---
  const handleForceBatteryCycle = useCallback((padId: string) => {
    setPads(prevPads =>
      prevPads.map(p => {
        if (p.id === padId) {
          return {
            ...p,
            status: 'Swapping',
            swapProgress: 0,
            swapSecondsRemaining: 5,
            latchStatus: 'Released',
            chargerKw: 0
          };
        }
        return p;
      })
    );

    const targetPad = pads.find(p => p.id === padId);
    const log: TelemetryLog = {
      id: `e-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      type: 'PAD',
      severity: 'warning',
      message: `FORCED 5-SECOND BATTERY SWAP CYCLE initiated on ${targetPad?.code} (${targetPad?.droneCallsign || 'Standby Bay'}).`
    };
    setEventLogs(prev => [log, ...prev.slice(0, 19)]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setPads(prevPads =>
        prevPads.map(p => {
          if (p.id === padId) {
            if (progress >= 100) {
              return {
                ...p,
                status: 'Occupied',
                swapProgress: 100,
                swapSecondsRemaining: 0,
                latchStatus: 'Locked',
                chargerKw: 24.0
              };
            }
            return {
              ...p,
              swapProgress: progress,
              swapSecondsRemaining: Math.max(0, 5 - Math.floor(progress / 20)),
              latchStatus: progress > 70 ? 'Locked' : 'Released'
            };
          }
          return p;
        })
      );

      if (progress >= 100) {
        clearInterval(interval);
        if (targetPad?.droneCallsign) {
          setDrones(prevD =>
            prevD.map(d => (d.callsign === targetPad.droneCallsign ? { ...d, battery: 100 } : d))
          );
        }
      }
    }, 1000);
  }, [pads]);

  // --- BAY ACTION 2: RELEASE / TOGGLE LATCH ---
  const handleToggleBayLatch = useCallback((padId: string) => {
    setPads(prevPads =>
      prevPads.map(p => {
        if (p.id === padId) {
          const nextLatch: LatchStatus =
            p.latchStatus === 'Locked' || p.latchStatus === 'Secure' ? 'Released' : 'Locked';
          return { ...p, latchStatus: nextLatch };
        }
        return p;
      })
    );

    const pad = pads.find(p => p.id === padId);
    const willBeReleased = pad?.latchStatus === 'Locked' || pad?.latchStatus === 'Secure';

    const log: TelemetryLog = {
      id: `e-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      type: 'PAD',
      severity: willBeReleased ? 'warning' : 'info',
      message: `${pad?.code}: Mechanical payload latch ${willBeReleased ? 'RELEASED (UNLOCKED)' : 'ENGAGED (LOCKED)'}.`
    };
    setEventLogs(prev => [log, ...prev.slice(0, 19)]);
  }, [pads]);

  // Master Ground-Hold Switch
  const handleToggleGroundHold = () => {
    const nextState = !groundHold;
    setGroundHold(nextState);

    const logMsg: TelemetryLog = {
      id: `e-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      type: 'ALERT',
      severity: nextState ? 'critical' : 'info',
      message: nextState
        ? 'GROUND-HOLD ACTIVE: Directive 7-Bravo broadcast. Outbound launches halted. Airspace in holding patterns.'
        : 'GROUND-HOLD TERMINATED: Airspace clearance restored. Resuming automated sorties.'
    };
    setEventLogs(prev => [logMsg, ...prev.slice(0, 19)]);
  };

  // Dispatch Drone from Pad
  const handleDispatchDrone = (pad: NestPad) => {
    if (!pad.droneCallsign || groundHold || emergencyAllLandActive) return;
    const assignedCallsign = pad.droneCallsign;

    setPads(prev =>
      prev.map(p => {
        if (p.id === pad.id) {
          return {
            ...p,
            status: 'Clear',
            droneCallsign: null,
            chargerKw: 0,
            latchStatus: 'Released',
            swapProgress: 0
          };
        }
        return p;
      })
    );

    setTotalSorties(prev => prev + 1);

    const newDroneItem: DroneItem = {
      id: `d-${Date.now()}`,
      callsign: assignedCallsign,
      model: 'AeroFalcon Heavy-Hex',
      battery: 98,
      batteryHealth: 99.2,
      altitude: 180,
      airspeed: 42,
      heading: 45,
      status: 'in_flight',
      corridor: 'CORRIDOR-ALPHA (NORTHWEST COMMERCE)',
      x: 5,
      y: -5,
      vx: 0.22,
      vy: -0.22,
      targetSector: 'Sector 7B North Bay Commercial Port',
      motorTemp: 32.4,
      priority: 'Rush Express',
      manifestId: `MN-DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      cargo: 'Priority Payload Cargo Package',
      etaSeconds: 420
    };

    setDrones(prev => [newDroneItem, ...prev]);
    setDispatchBayModal(null);
  };

  // Abort Mission execution
  const executeMissionAbort = (drone: DroneItem, reason: 'RTB' | 'PARACHUTE' | 'DIVERT') => {
    setDrones(prev =>
      prev.map(d => {
        if (d.id === drone.id) {
          return {
            ...d,
            status: reason === 'PARACHUTE' ? 'docked' : 'holding',
            heading: (d.heading + 180) % 360,
            vx: -d.vx,
            vy: -d.vy
          };
        }
        return d;
      })
    );

    setManifests(prev =>
      prev.map(m => {
        if (m.droneCallsign === drone.callsign) {
          return { ...m, status: 'aborted' };
        }
        return m;
      })
    );

    const log: TelemetryLog = {
      id: `e-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      type: 'ALERT',
      severity: 'critical',
      message: `MISSION ABORT: ${drone.callsign} [${reason}] invoked. Flight path reversed.`
    };
    setEventLogs(prev => [log, ...prev.slice(0, 19)]);
    setAbortModalDrone(null);
    if (selectedManifestDetail && selectedManifestDetail.droneCallsign === drone.callsign) {
      setSelectedManifestDetail(prev => (prev ? { ...prev, status: 'aborted' } : null));
    }
  };

  // Reroute Corridor execution
  const executeReroute = () => {
    if (!rerouteModalDrone || !selectedNewCorridor) return;

    setDrones(prev =>
      prev.map(d => {
        if (d.id === rerouteModalDrone.id) {
          return {
            ...d,
            corridor: selectedNewCorridor,
            heading: (d.heading + 45) % 360
          };
        }
        return d;
      })
    );

    setManifests(prev =>
      prev.map(m => {
        if (m.droneCallsign === rerouteModalDrone.callsign) {
          return {
            ...m,
            corridor: selectedNewCorridor,
            status: 'diverted'
          };
        }
        return m;
      })
    );
    setRerouteModalDrone(null);
  };

  // Filtered delivery manifest items
  const filteredManifests = useMemo(() => {
    return manifests.filter(m => {
      const matchSearch =
        m.trackingCode.toLowerCase().includes(manifestSearch.toLowerCase()) ||
        m.cargo.toLowerCase().includes(manifestSearch.toLowerCase()) ||
        m.destinationSector.toLowerCase().includes(manifestSearch.toLowerCase()) ||
        m.droneCallsign.toLowerCase().includes(manifestSearch.toLowerCase());

      const matchPriority = priorityFilter === 'all' || m.priority === priorityFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [manifests, manifestSearch, priorityFilter, statusFilter]);

  const getPriorityStyle = (priority: PriorityTier) => {
    switch (priority) {
      case 'Cold-Chain Medical':
        return {
          badge: 'text-cyan-400 border border-cyan-500/40 bg-cyan-950/40',
          blip: '#06B6D4'
        };
      case 'Rush Express':
        return {
          badge: 'text-amber-400 border border-amber-500/40 bg-amber-950/40',
          blip: '#F59E0B'
        };
      case 'Standard Cargo':
      default:
        return {
          badge: 'text-slate-300 border border-slate-700 bg-slate-900/60',
          blip: '#94A3B8'
        };
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070A0F] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden antialiased">
        {/* =========================================================================
            PANE 1: TOP HUD BANNER
            ========================================================================= */}
        <header className="w-full bg-[#0B0F17] border-b border-[#1E293B] sticky top-0 z-50 shadow-2xl">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
            {/* Hub Identity & Designation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded bg-[#111827] border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <Crosshair className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-wider text-slate-100 uppercase">
                    MetroNest-04 Delta
                  </h1>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                    HUB VERTI-AIRSPACE
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-2">
                  <span>SECTOR 04-D</span>
                  <span className="text-slate-600">/</span>
                  <span>LAT 37.7749°N LON 122.4194°W</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE
                  </span>
                </p>
              </div>
            </div>

            {/* Top HUD Clock Block */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-[#111827] rounded border border-[#1E293B]">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">ACTIVE UTC CLOCK</span>
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 tabular-nums">
                  {utcTime || '2026-10-02 23:47:32 UTC'}
                </span>
              </div>
              <div className="h-5 w-[1px] bg-[#1E293B]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">MISSION ELAPSED</span>
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-200 tabular-nums">
                  {formattedMissionTime || 'T+08:24:10'}
                </span>
              </div>
            </div>

            {/* Connectivity: Simulated 5G Mesh */}
            <div className="flex items-center gap-4 bg-[#111827] px-3.5 py-1.5 rounded border border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                      5G Low-Latency Mesh
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">({meshNodes}/{meshNodes})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                    <span className="text-cyan-300 font-bold">{meshLatency} ms</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{meshRssi} dBm</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400">0.0% loss</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Sorties & Master Ground Hold */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end pr-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Total Sorties Today
                </span>
                <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
                  <span className="text-lg font-bold text-amber-400">{totalSorties}</span>
                  <span className="text-xs text-emerald-400 font-medium">99.4% OK</span>
                </div>
              </div>

              <button
                onClick={handleToggleGroundHold}
                className={`px-3 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 border ${
                  groundHold
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-[#111827] border-amber-500/50 text-amber-400 hover:bg-amber-950/30 hover:border-amber-400'
                }`}
              >
                <AlertOctagon className={`w-4 h-4 ${groundHold ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>{groundHold ? 'GROUND-HOLD: ACTIVE' : 'GROUND-HOLD: OFF'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Warning Banners */}
        {emergencyAllLandActive ? (
          <div className="w-full bg-rose-950 border-b border-rose-600 text-rose-200 px-4 py-2 flex items-center justify-between text-xs font-mono tracking-wide animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-300 shrink-0" />
              <span>
                CRITICAL AIRSPACE DIRECTIVE: EMERGENCY ALL-LAND ACTIVE. ALL AIRBORNE DRONES RETURNING TO BASE.
              </span>
            </div>
            <button
              onClick={handleToggleEmergencyAllLand}
              className="px-2 py-0.5 rounded bg-rose-900 border border-rose-400 text-[10px] font-bold uppercase hover:bg-rose-800"
            >
              Resume Nominal
            </button>
          </div>
        ) : null}

        {Boolean(windShearActive && !emergencyAllLandActive) ? (
          <div className="w-full bg-amber-950 border-b border-amber-600 text-amber-200 px-4 py-1.5 flex items-center justify-between text-xs font-mono tracking-wide">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <span>
                MICROBURST WIND SHEAR DETECTED IN SECTORS 2 & 4. SPEED LIMIT CLAMPED TO 30 KTS. DR-118 & DR-331 REROUTED.
              </span>
            </div>
            <button
              onClick={handleToggleWindShear}
              className="px-2 py-0.5 rounded bg-amber-900 border border-amber-400 text-[10px] font-bold uppercase hover:bg-amber-800"
            >
              Clear Hazard
            </button>
          </div>
        ) : null}

        {/* =========================================================================
            MAIN CENTER GRID (Panes 2 & 3: 2D Radar Canvas & Bay Matrix)
            ========================================================================= */}
        <main className="flex-1 w-full p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* PANE 2: CENTER-LEFT 2D RADAR AIRSPACE CANVAS / GRID (7 Cols) */}
          <section className="lg:col-span-7 bg-[#0B0F17] rounded border border-[#1E293B] flex flex-col overflow-hidden relative shadow-xl">
            {/* --- CONSOLIDATED RADAR HEADER BAR WITH OPERATOR TOGGLES (POLISH 2) --- */}
            <div className="px-3 py-2 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-2 z-10">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Airspace Vector Radar
                </span>
                <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 bg-cyan-950/60 border border-cyan-500/20 rounded">
                  20 KM
                </span>
              </div>

              {/* Integrated Operator Tactical Toggles */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleWindShear}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all duration-200 flex items-center gap-1 border ${
                    windShearActive
                      ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse'
                      : 'bg-[#111827] border-[#1E293B] hover:border-amber-500/50 text-amber-400/90 hover:bg-amber-950/30'
                  }`}
                  title="Simulate Microburst Wind Shear Event (clamps speed to 30kt & reroutes 2 drones)"
                >
                  <Wind className={`w-3 h-3 ${windShearActive ? 'text-amber-300 animate-spin' : 'text-amber-400'}`} />
                  <span>{windShearActive ? 'Shear: ON' : 'Wind Shear'}</span>
                </button>

                <button
                  onClick={handleToggleEmergencyAllLand}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all duration-200 flex items-center gap-1 border ${
                    emergencyAllLandActive
                      ? 'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.7)] animate-pulse'
                      : 'bg-[#111827] border-[#1E293B] hover:border-rose-500/50 text-rose-400/90 hover:bg-rose-950/30'
                  }`}
                  title="Emergency All-Land Failsafe: return all airborne units to base"
                >
                  <ShieldAlert className={`w-3 h-3 ${emergencyAllLandActive ? 'text-rose-300 animate-bounce' : 'text-rose-400'}`} />
                  <span>{emergencyAllLandActive ? 'Failsafe: ON' : 'All-Land'}</span>
                </button>

                <div className="h-4 w-[1px] bg-[#1E293B] mx-1" />

                {/* Layer Toggles & Zoom Controls */}
                <button
                  onClick={() => setShowCorridors(!showCorridors)}
                  className={`px-1.5 py-1 rounded text-[10px] font-mono border transition-colors ${
                    showCorridors
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                      : 'bg-[#111827] border-[#1E293B] text-slate-500'
                  }`}
                  title="Toggle Corridors"
                >
                  Corridors
                </button>
                <button
                  onClick={() => setShowHazards(!showHazards)}
                  className={`px-1.5 py-1 rounded text-[10px] font-mono border transition-colors ${
                    showHazards
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-[#111827] border-[#1E293B] text-slate-500'
                  }`}
                  title="Toggle Hazards"
                >
                  Hazards
                </button>
                <button
                  onClick={() => setShowVectors(!showVectors)}
                  className={`px-1.5 py-1 rounded text-[10px] font-mono border transition-colors ${
                    showVectors
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#111827] border-[#1E293B] text-slate-500'
                  }`}
                  title="Toggle Velocity Vectors"
                >
                  Vectors
                </button>

                <button
                  onClick={() => setRadarZoom(prev => Math.min(1.8, prev + 0.25))}
                  className="p-1 rounded bg-[#111827] border border-[#1E293B] text-slate-300 hover:text-cyan-400"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRadarZoom(prev => Math.max(0.6, prev - 0.25))}
                  className="p-1 rounded bg-[#111827] border border-[#1E293B] text-slate-300 hover:text-cyan-400"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Radar Viewport */}
            <div className="flex-1 w-full relative min-h-[460px] flex items-center justify-center bg-[#070A0F] overflow-hidden cursor-crosshair">
              <div
                className="w-full h-full max-w-[580px] max-h-[580px] p-2 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `scale(${radarZoom})` }}
              >
                <svg viewBox="-110 -110 220 220" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id="radarSweepGlowApp" cx="0%" cy="0%" r="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Range Rings */}
                  {[25, 50, 75, 100].map((radius, idx) => (
                    <g key={radius}>
                      <circle cx="0" cy="0" r={radius} fill="none" stroke="#1E293B" strokeWidth="0.8" />
                      <text x="3" y={-radius + 4} fill="#475569" fontSize="3.8" fontFamily="monospace">
                        {(idx + 1) * 5}km
                      </text>
                    </g>
                  ))}

                  {/* Azimuth Bearing Lines */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                    const rad = (deg - 90) * (Math.PI / 180);
                    return (
                      <g key={deg}>
                        <line x1="0" y1="0" x2={Math.cos(rad) * 102} y2={Math.sin(rad) * 102} stroke="#1E293B" strokeWidth="0.6" />
                        <text x={Math.cos(rad) * 106} y={Math.sin(rad) * 106 + 1.2} fill="#64748B" fontSize="3.4" fontFamily="monospace" textAnchor="middle">
                          {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : `${deg}°`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Corridors */}
                  {showCorridors ? (
                    <g>
                      <path d="M 0 0 L 70 -60" stroke="#06B6D4" strokeWidth="2.2" strokeOpacity="0.25" strokeDasharray="4 2" />
                      <path d="M 0 0 L -65 70" stroke="#06B6D4" strokeWidth="2.2" strokeOpacity="0.35" strokeDasharray="4 2" />
                      <path d="M 0 0 L 80 65" stroke="#06B6D4" strokeWidth="2.2" strokeOpacity="0.25" strokeDasharray="4 2" />
                      <path d="M 0 0 L -75 -65" stroke="#06B6D4" strokeWidth="2.2" strokeOpacity="0.25" strokeDasharray="4 2" />
                    </g>
                  ) : null}

                  {/* Dynamic Hazard Zones */}
                  {showHazards ? (
                    hazards.map(hazard => (
                      <g key={hazard.id}>
                        <circle
                          cx={hazard.x}
                          cy={hazard.y}
                          r={hazard.radiusKm * 6}
                          fill={hazard.isSimulated ? '#F59E0B' : '#EF4444'}
                          fillOpacity={hazard.isSimulated ? '0.2' : '0.1'}
                          stroke={hazard.severity === 'severe' || hazard.isSimulated ? '#F59E0B' : '#EF4444'}
                          strokeWidth={hazard.isSimulated ? '2' : '1.2'}
                          strokeDasharray="3 2"
                          className={hazard.isSimulated ? 'animate-pulse' : undefined}
                        />
                        <text
                          x={hazard.x}
                          y={hazard.y - hazard.radiusKm * 6 - 2}
                          fill={hazard.severity === 'severe' ? '#F87171' : '#FBBF24'}
                          fontSize="3.2"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          ! {hazard.title.toUpperCase()} ({hazard.windSpeed}kt)
                        </text>
                      </g>
                    ))
                  ) : null}

                  {/* Rotating Tactical Sweep Beam */}
                  <g transform={`rotate(${radarSweepAngle} 0 0)`}>
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#06B6D4" strokeWidth="1.4" strokeOpacity="0.9" />
                    <path d="M 0 0 L 100 0 A 100 100 0 0 0 86.6 -50 Z" fill="url(#radarSweepGlowApp)" opacity="0.35" />
                  </g>

                  {/* Center Vertiport Nest Hub */}
                  <g>
                    <circle cx="0" cy="0" r="4" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.2" />
                    <rect x="-2" y="-2" width="4" height="4" fill="#06B6D4" />
                    <text x="0" y="8" fill="#E2E8F0" fontSize="3.6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      [ MN-04 HUB ]
                    </text>
                  </g>

                  {/* --- DRONE BLIPS WITH POLISHED HIGH-CONTRAST BADGES (POLISH 1) --- */}
                  {drones.map(drone => {
                    const style = getPriorityStyle(drone.priority);
                    const isSelected = selectedDrone?.id === drone.id;
                    const headingRad = (drone.heading - 90) * (Math.PI / 180);
                    const vxLine = Math.cos(headingRad) * Math.max(8, drone.airspeed / 5);
                    const vyLine = Math.sin(headingRad) * Math.max(8, drone.airspeed / 5);

                    return (
                      <g
                        key={drone.id}
                        className="cursor-pointer transition-transform hover:scale-110"
                        onClick={() => setSelectedDrone(drone)}
                      >
                        {isSelected ? (
                          <circle cx={drone.x} cy={drone.y} r="9" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 1" />
                        ) : null}
                        {showVectors ? (
                          <line x1={drone.x} y1={drone.y} x2={drone.x + vxLine} y2={drone.y + vyLine} stroke={style.blip} strokeWidth="0.8" strokeDasharray="1.5 1" />
                        ) : null}
                        <g transform={`translate(${drone.x}, ${drone.y}) rotate(${drone.heading})`}>
                          <path d="M 0 -3.5 L 3 3 L 0 1.8 L -3 3 Z" fill={style.blip} stroke="#070A0F" strokeWidth="0.5" />
                        </g>

                        {/* High-Contrast Dark Badge Wrapping (bg-black/80 border border-slate-700/60 rounded) */}
                        {showLabels ? (
                          <g transform={`translate(${drone.x + 4}, ${drone.y - 7})`}>
                            {/* High-Contrast Badge Container Backdrop */}
                            <rect
                              x="0"
                              y="0"
                              width={drone.priority === 'Cold-Chain Medical' ? '38' : '31'}
                              height="12"
                              rx="1.5"
                              fill="#000000"
                              fillOpacity="0.82"
                              stroke="#334155"
                              strokeWidth="0.5"
                            />
                            {/* Callsign with Priority Tint */}
                            <text
                              x="2"
                              y="4.8"
                              fill={isSelected ? '#38BDF8' : '#F8FAFC'}
                              fontSize="3.4"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {drone.callsign}
                            </text>
                            {/* Altitude & Speed Metrics */}
                            <text
                              x="2"
                              y="9.6"
                              fill="#94A3B8"
                              fontSize="2.7"
                              fontFamily="monospace"
                            >
                              {Math.round(drone.altitude)}ft {Math.round(drone.airspeed)}kt
                            </text>
                          </g>
                        ) : null}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Floating Inspector HUD for selected drone */}
              {selectedDrone ? (
                <div className="absolute top-3 right-3 w-72 bg-[#0F172A]/95 border border-cyan-500/50 rounded shadow-2xl p-3 backdrop-blur-md z-20 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 mb-2">
                    <span className="font-bold text-slate-100 text-sm">{selectedDrone.callsign}</span>
                    <button onClick={() => setSelectedDrone(null)} className="text-slate-400 hover:text-slate-200">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CARGO:</span>
                      <span className="text-slate-200 truncate max-w-[170px]">{selectedDrone.cargo}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E293B]">
                      <div>
                        <span className="text-[10px] text-slate-500">ALTITUDE</span>
                        <div className="text-slate-200 font-bold">{Math.round(selectedDrone.altitude)} FT</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">AIRSPEED</span>
                        <div className="text-slate-200 font-bold">{Math.round(selectedDrone.airspeed)} KTS</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">BATTERY</span>
                        <div className="text-emerald-400 font-bold">{selectedDrone.battery}%</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">ETA</span>
                        <div className="text-amber-400 font-bold">{formatSeconds(selectedDrone.etaSeconds)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedNewCorridor(selectedDrone.corridor);
                          setRerouteModalDrone(selectedDrone);
                        }}
                        className="px-2 py-1.5 bg-[#1E293B] hover:bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300 font-bold text-[10px]"
                      >
                        REROUTE
                      </button>
                      <button
                        onClick={() => setAbortModalDrone(selectedDrone)}
                        className="px-2 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 rounded text-rose-300 font-bold text-[10px]"
                      >
                        ABORT
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* =======================================================================
              PANE 3: CENTER-RIGHT NEST PAD MATRIX (5 Cols)
              Featuring: Micro-LED Glow Indicators & Fixed-Width Quick Actions (POLISH 4)
              ======================================================================= */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#0B0F17] rounded border border-[#1E293B] p-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                    Docking Bay Telemetry & Quick Actions
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                  4/4 BAYS ACTIVE
                </span>
              </div>

              {/* 4 Automated Docking Bays (Pads Alpha through Delta) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pads.map(pad => {
                  const isClear = pad.status === 'Clear';
                  const isSwapping = pad.status === 'Swapping';

                  // --- MICRO-LED STATUS GLOW INDICATORS (POLISH 4) ---
                  const getLedIndicator = () => {
                    switch (pad.status) {
                      case 'Occupied':
                        return (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0"
                            title="Bay Occupied & Ready"
                          />
                        );
                      case 'Swapping':
                        return (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping shrink-0"
                            title="Robotic Battery Swap in Progress"
                          />
                        );
                      case 'Charging':
                        return (
                          <span
                            className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse shrink-0"
                            title="High-Voltage Supercharging Active"
                          />
                        );
                      case 'Clear':
                      default:
                        return (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_5px_#10b981] shrink-0"
                            title="Touchdown Bay Clear & Aligned"
                          />
                        );
                    }
                  };

                  return (
                    <div key={pad.id} className="bg-[#0F172A] border border-[#1E293B] rounded p-3 flex flex-col justify-between shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-slate-100">{pad.code}</span>

                        {/* Status Badge with Micro-LED Glow */}
                        <div className="flex items-center gap-1.5">
                          {getLedIndicator()}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              isSwapping
                                ? 'text-amber-300 bg-amber-950 border border-amber-500'
                                : pad.status === 'Charging'
                                ? 'text-cyan-400 bg-cyan-950 border border-cyan-500/30'
                                : pad.status === 'Occupied'
                                ? 'text-emerald-400 bg-emerald-950 border border-emerald-500/30'
                                : 'text-slate-400 bg-slate-900 border border-slate-700/50'
                            }`}
                          >
                            {pad.status}
                          </span>
                        </div>
                      </div>

                      {/* Docked Drone info */}
                      <div className="bg-[#0B0F17] rounded p-2 border border-[#1E293B] mb-2 font-mono text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-[10px]">DRONE ID:</span>
                          <span className="font-bold text-slate-200">{pad.droneCallsign || 'CLEAR'}</span>
                        </div>

                        {/* Battery Progress or 5-Second Swap Cycle Bar */}
                        {isSwapping ? (
                          <div className="mt-1.5">
                            <div className="flex justify-between text-[10px] text-amber-300 mb-1">
                              <span>SWAPPING PACK:</span>
                              <span className="font-bold">{pad.swapSecondsRemaining ?? 3}s ({pad.swapProgress}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pad.swapProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : pad.status === 'Charging' || pad.status === 'Occupied' ? (
                          <div className="mt-1 text-[10px] text-cyan-300 flex justify-between">
                            <span>CHARGING RATE:</span>
                            <span>{pad.chargerKw} kW</span>
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>READY FOR TOUCHDOWN</span>
                          </div>
                        )}
                      </div>

                      {/* Latch Status & Thermals */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          {pad.latchStatus === 'Locked' || pad.latchStatus === 'Secure' ? (
                            <Lock className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Unlock className="w-3 h-3 text-amber-400" />
                          )}
                          <span>LATCH: {pad.latchStatus}</span>
                        </div>
                        <span>{pad.tempCelsius}°C</span>
                      </div>

                      {/* Bay Action Buttons with Fixed Minimum Widths */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#1E293B]">
                        <button
                          onClick={() => handleForceBatteryCycle(pad.id)}
                          disabled={isSwapping}
                          className="min-w-[88px] w-full px-2 py-1.5 rounded bg-[#111827] hover:bg-amber-950/40 border border-[#1E293B] hover:border-amber-500/50 text-[10px] font-mono text-amber-300 disabled:opacity-30 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                          title="Trigger 5-second simulated robotic battery swap cycle"
                        >
                          <RefreshCw className={`w-3 h-3 text-amber-400 ${isSwapping ? 'animate-spin' : ''}`} />
                          <span>Force Cycle</span>
                        </button>

                        <button
                          onClick={() => handleToggleBayLatch(pad.id)}
                          disabled={isSwapping}
                          className="min-w-[88px] w-full px-2 py-1.5 rounded bg-[#111827] hover:bg-cyan-950/40 border border-[#1E293B] hover:border-cyan-500/50 text-[10px] font-mono text-cyan-300 disabled:opacity-30 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                          title="Toggle mechanical payload latch state"
                        >
                          {pad.latchStatus === 'Locked' || pad.latchStatus === 'Secure' ? (
                            <>
                              <Unlock className="w-3 h-3 text-amber-400" />
                              <span>Release Latch</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-emerald-400" />
                              <span>Lock Latch</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Secondary Dispatch Row */}
                      {!isClear ? (
                        <button
                          onClick={() => setDispatchBayModal(pad)}
                          disabled={isSwapping || groundHold || emergencyAllLandActive}
                          className="mt-1.5 w-full py-1 rounded bg-[#111827] hover:bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center justify-center gap-1 disabled:opacity-30 whitespace-nowrap"
                        >
                          <Send className="w-3 h-3 text-emerald-400" />
                          <span>Dispatch Sortie</span>
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hub Power Draw Telemetry Chart */}
            <div className="bg-[#0B0F17] rounded border border-[#1E293B] p-3 shadow-xl flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                    Hub Power & Charging Load
                  </span>
                </div>
              </div>
              <div className="w-full h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={powerChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="chargingKw" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Bays Charging kW" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </main>

        {/* =========================================================================
            MANIFEST ITEM SLIDE-OVER DRAWER
            ========================================================================= */}
        {selectedManifestDetail ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end p-0">
            <div className="w-full max-w-lg h-full bg-[#0F172A] border-l border-[#1E293B] shadow-2xl p-5 font-mono text-xs flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">
                        {selectedManifestDetail.trackingCode}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        DEPARTED: {selectedManifestDetail.departureTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedManifestDetail(null)}
                    className="p-1 rounded bg-[#111827] text-slate-400 hover:text-slate-200"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Priority & Cargo Summary */}
                <div className="bg-[#0B0F17] p-3 rounded border border-[#1E293B] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PRIORITY TIER:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityStyle(selectedManifestDetail.priority).badge}`}>
                      {selectedManifestDetail.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAYLOAD CARGO:</span>
                    <span className="text-slate-100 font-semibold">{selectedManifestDetail.cargo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAYLOAD MASS:</span>
                    <span className="text-slate-200">{selectedManifestDetail.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ASSIGNED DRONE:</span>
                    <span className="text-cyan-400 font-bold">{selectedManifestDetail.droneCallsign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TARGET SECTOR:</span>
                    <span className="text-slate-300">{selectedManifestDetail.destinationSector}</span>
                  </div>
                </div>

                {/* Cold-Chain Telemetry */}
                {selectedManifestDetail.priority === 'Cold-Chain Medical' ? (
                  <div className="bg-cyan-950/40 border border-cyan-500/40 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                        <Thermometer className="w-4 h-4 text-cyan-300" />
                        PACKAGE TEMPERATURE TELEMETRY
                      </span>
                      <span className="text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-950 rounded border border-emerald-500/30">
                        CRYO NOMINAL
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                      <div className="bg-[#0B0F17] p-2 rounded border border-cyan-900">
                        <span className="text-[10px] text-slate-400 block">CURRENT SENSOR:</span>
                        <span className="text-cyan-300 font-bold text-sm">
                          {Boolean(selectedManifestDetail.actualTemp !== undefined && selectedManifestDetail.actualTemp > 0)
                            ? `+${selectedManifestDetail.actualTemp}`
                            : selectedManifestDetail.actualTemp}°C
                        </span>
                      </div>
                      <div className="bg-[#0B0F17] p-2 rounded border border-cyan-900">
                        <span className="text-[10px] text-slate-400 block">TARGET SETPOINT:</span>
                        <span className="text-slate-200 font-bold text-sm">
                          {Boolean(selectedManifestDetail.targetTemp !== undefined && selectedManifestDetail.targetTemp > 0)
                            ? `+${selectedManifestDetail.targetTemp}`
                            : selectedManifestDetail.targetTemp}°C
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span>Peltier Refrigeration Module:</span>
                        <span className="text-cyan-300 font-bold">12V @ 1.8A (PULSE OK)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thermal Excursion Limit:</span>
                        <span className="text-slate-200">±1.5°C threshold safe window</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Simulated Route Waypoints */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-cyan-400" />
                      Simulated Route Waypoint Sequence
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ETA: {formatSeconds(selectedManifestDetail.etaSeconds)}
                    </span>
                  </div>

                  <div className="space-y-2 bg-[#0B0F17] p-3 rounded border border-[#1E293B]">
                    {selectedManifestDetail.waypoints?.map((wp, idx) => (
                      <div key={wp.id} className="flex items-start gap-2.5">
                        <div className="flex flex-col items-center mt-1">
                          <span
                            className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              wp.status === 'passed'
                                ? 'bg-emerald-500 text-black'
                                : wp.status === 'active'
                                ? 'bg-cyan-400 text-black animate-ping'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          />
                          {idx < (selectedManifestDetail.waypoints?.length ?? 0) - 1 ? (
                            <div className="w-[1px] h-6 bg-[#1E293B] my-1" />
                          ) : null}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-100 text-xs">{wp.name}</span>
                            <span className="text-[10px] text-slate-500">T+{wp.etaMinutes}m</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Alt: {wp.altitudeFt} ft | Speed: {wp.speedKts} kts | Bearing: {wp.bearingDeg}°
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Abort & Action Controls */}
              <div className="pt-4 border-t border-[#1E293B] space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Operator Airspace Controls:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const drone = drones.find(d => d.callsign === selectedManifestDetail.droneCallsign);
                      if (drone) {
                        setSelectedNewCorridor(drone.corridor);
                        setRerouteModalDrone(drone);
                      }
                    }}
                    className="py-2 px-3 rounded bg-[#1E293B] hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>REROUTE CORRIDOR</span>
                  </button>

                  <button
                    onClick={() => {
                      const drone = drones.find(d => d.callsign === selectedManifestDetail.droneCallsign);
                      if (drone) setAbortModalDrone(drone);
                    }}
                    className="py-2 px-3 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CONFIRM ABORT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Tactical Action Modals (Abort, Reroute, Dispatch) */}
        {abortModalDrone ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-rose-500/60 rounded shadow-2xl max-w-md w-full p-4 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-rose-400 font-bold text-sm">
                <span>EMERGENCY ABORT PROTOCOL</span>
                <button onClick={() => setAbortModalDrone(null)} className="text-slate-400">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-300">
                Confirm tactical abort for {abortModalDrone.callsign}. Drone will reverse vector and proceed to recovery.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => executeMissionAbort(abortModalDrone, 'RTB')}
                  className="w-full py-2 px-3 rounded bg-amber-950 border border-amber-500 hover:bg-amber-900 text-amber-300 font-bold flex justify-between"
                >
                  <span>RETURN TO BASE (METRONEST-04)</span>
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeMissionAbort(abortModalDrone, 'DIVERT')}
                  className="w-full py-2 px-3 rounded bg-[#1E293B] border border-cyan-500 hover:bg-cyan-950 text-cyan-300 font-bold flex justify-between"
                >
                  <span>DIVERT TO EMERGENCY VERTIPORT</span>
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {rerouteModalDrone ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-cyan-500/60 rounded shadow-2xl max-w-md w-full p-4 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-cyan-400 font-bold text-sm">
                <span>REROUTE FLIGHT CORRIDOR</span>
                <button onClick={() => setRerouteModalDrone(null)} className="text-slate-400">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">ALTERNATIVE CORRIDOR:</label>
                <select
                  value={selectedNewCorridor}
                  onChange={e => setSelectedNewCorridor(e.target.value)}
                  className="w-full bg-[#111827] border border-cyan-500/40 text-cyan-300 p-2 rounded focus:outline-none"
                >
                  <option value="CORRIDOR-ALPHA (NORTHWEST COMMERCE)">CORRIDOR-ALPHA (Clear)</option>
                  <option value="CORRIDOR-BRAVO (HOSPITAL MEDICAL EXPRESS)">CORRIDOR-BRAVO (Priority)</option>
                  <option value="CORRIDOR-CHARLIE (EAST INDUSTRIAL HARBOR)">CORRIDOR-CHARLIE (East Harbor)</option>
                  <option value="SKYWAY-07 (DOWNTOWN SECTOR ROUTE)">SKYWAY-07 (Downtown Route)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]">
                <button onClick={() => setRerouteModalDrone(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button onClick={executeReroute} className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Confirm Reroute
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {dispatchBayModal ? (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-emerald-500/60 rounded shadow-2xl max-w-md w-full p-4 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-emerald-400 font-bold text-sm">
                <span>AUTHORIZE SORTIE LAUNCH</span>
                <button onClick={() => setDispatchBayModal(null)} className="text-slate-400">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-300">
                Grant launch clearance for {dispatchBayModal.droneCallsign} from {dispatchBayModal.code}?
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]">
                <button onClick={() => setDispatchBayModal(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">
                  Abort
                </button>
                <button onClick={() => handleDispatchDrone(dispatchBayModal)} className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  Launch
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* =========================================================================
            PANE 4: BOTTOM BAR & EXPANDABLE DRAWER
            Featuring: Sticky Table Headers, Explicit max-h-56, Fixed Button Widths (POLISH 3)
            ========================================================================= */}
        <footer className="w-full bg-[#0B0F17] border-t border-[#1E293B] px-4 py-3 flex flex-col gap-3 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-2">
            <div className="flex items-center gap-1 bg-[#111827] p-1 rounded border border-[#1E293B]">
              <button
                onClick={() => setActiveTab('manifest')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase ${
                  activeTab === 'manifest' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'
                }`}
              >
                Manifest ({manifests.length})
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase ${
                  activeTab === 'telemetry' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'
                }`}
              >
                Fleet Analytics
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase ${
                  activeTab === 'events' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50' : 'text-slate-400'
                }`}
              >
                Tactical Events
              </button>
            </div>

            {activeTab === 'manifest' ? (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  CLICK ROW FOR ROUTE & CRYO TELEMETRY
                </span>
                <input
                  type="text"
                  value={manifestSearch}
                  onChange={e => setManifestSearch(e.target.value)}
                  placeholder="Search manifest..."
                  className="bg-[#111827] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none w-52"
                />
              </div>
            ) : null}
          </div>

          {/* TAB 2: FLEET ANALYTICS */}
          {activeTab === 'telemetry' ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-[#0F172A] rounded border border-[#1E293B]">
              <div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase mb-2 block">
                  Fleet Cell Voltage / Battery Health
                </span>
                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={drones.map(d => ({ callsign: d.callsign, battery: d.battery }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="callsign" stroke="#475569" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" />
                      <Bar dataKey="battery" fill="#10B981" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="p-3 bg-[#0B0F17] rounded border border-[#1E293B] font-mono text-xs space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase block">Station Invariants</span>
                <div className="flex justify-between text-slate-400">
                  <span>ELEVATION:</span>
                  <span className="text-slate-200 font-bold">58.4 METERS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>WIND GUSTS:</span>
                  <span className="text-amber-400 font-bold">14 KTS // G22 KTS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ILS FREQUENCY:</span>
                  <span className="text-cyan-400 font-bold">109.35 MHz</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* TAB 3: TACTICAL EVENTS */}
          {activeTab === 'events' ? (
            <div className="w-full max-h-56 overflow-y-auto rounded border border-[#1E293B] bg-[#070A0F] p-2 space-y-1.5 font-mono text-xs">
              {events.length > 0 ? (
                events.map(log => (
                  <div key={log.id} className="flex items-start gap-2.5 p-2 rounded bg-[#0F172A]/70 border border-[#1E293B]">
                    <span className="text-slate-500 text-[10px] tabular-nums shrink-0">{log.timestamp}</span>
                    <span className="text-cyan-400 text-xs">{log.message}</span>
                  </div>
                ))
              ) : null}
            </div>
          ) : null}

          {/* TAB 1: MANIFEST TABLE */}
          {activeTab === 'manifest' ? (
            <div className="w-full space-y-1.5">
              <div className="w-full overflow-y-auto overflow-x-auto max-h-56 rounded border border-[#1E293B] relative">
                <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
                  <thead className="bg-[#0F172A] text-slate-400 border-b border-[#1E293B] sticky top-0 z-20 uppercase tracking-wider text-[10px] shadow-md">
                    <tr>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">Tracking / Cargo</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">Priority</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">Assigned Drone</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">Destination</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">ETA</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0">Status</th>
                      <th className="py-2.5 px-3 bg-[#0F172A] sticky top-0 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] bg-[#0B0F17]">
                    {filteredManifests.length > 0 ? (
                      filteredManifests.map(manifest => {
                        const priorityStyle = getPriorityStyle(manifest.priority);
                        const droneObj = drones.find(d => d.callsign === manifest.droneCallsign);

                        return (
                          <tr
                            key={manifest.id}
                            onClick={() => setSelectedManifestDetail(manifest)}
                            className="hover:bg-[#111827] cursor-pointer transition-colors group"
                          >
                            <td className="py-2 px-3">
                              <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                <span>{manifest.trackingCode}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                              </div>
                              <div className="text-[11px] text-slate-400">{manifest.cargo}</div>
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityStyle.badge}`}>
                                {manifest.priority}
                              </span>
                              {Boolean(manifest.priority === 'Cold-Chain Medical' && manifest.actualTemp !== undefined) ? (
                                <div className="text-[10px] text-cyan-400 mt-0.5 flex items-center gap-1 font-bold">
                                  <Thermometer className="w-3 h-3" />
                                  {Boolean(manifest.actualTemp !== undefined && manifest.actualTemp > 0) ? `+${manifest.actualTemp}` : manifest.actualTemp}°C
                                </div>
                              ) : null}
                            </td>
                            <td className="py-2 px-3 text-slate-200">{manifest.droneCallsign}</td>
                            <td className="py-2 px-3 text-slate-300">{manifest.destinationSector}</td>
                            <td className="py-2 px-3 font-bold text-amber-400">
                              {manifest.status === 'in_transit' ? formatSeconds(manifest.etaSeconds) : '--:--'}
                            </td>
                            <td className="py-2 px-3 uppercase text-[10px]">
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold ${
                                  manifest.status === 'in_transit'
                                    ? 'text-emerald-400 bg-emerald-950 border border-emerald-500/20'
                                    : manifest.status === 'diverted'
                                    ? 'text-amber-400 bg-amber-950 border border-amber-500/20'
                                    : 'text-slate-400 bg-slate-900'
                                }`}
                              >
                                {manifest.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedManifestDetail(manifest)}
                                  className="w-16 min-w-[64px] px-2 py-1 rounded bg-[#111827] text-cyan-400 border border-[#1E293B] text-[10px] hover:bg-slate-800 text-center whitespace-nowrap"
                                  title="View Route Waypoints & Telemetry"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => {
                                    if (droneObj) {
                                      setSelectedNewCorridor(droneObj.corridor);
                                      setRerouteModalDrone(droneObj);
                                    }
                                  }}
                                  disabled={!droneObj || manifest.status !== 'in_transit'}
                                  className="w-16 min-w-[64px] px-2 py-1 rounded bg-[#111827] text-amber-300 border border-[#1E293B] text-[10px] disabled:opacity-30 hover:bg-amber-950/40 text-center whitespace-nowrap"
                                >
                                  Reroute
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-500 text-xs">
                          No matching flight manifests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 pt-0.5">
            <span>SORTIE QUEUE: {filteredManifests.length} UNITS TRACKED</span>
            <span>5G MESH TELEMETRY SYNCHRONIZED</span>
          </div>
        </footer>
      </div>
    );
}

export default DroneNestOps;
