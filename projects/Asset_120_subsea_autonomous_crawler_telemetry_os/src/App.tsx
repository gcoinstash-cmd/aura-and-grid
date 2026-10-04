import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Compass,
  Gauge,
  Activity,
  Waves,
  Cpu,
  AlertTriangle,
  RotateCw,
  Anchor,
  ShieldAlert,
  Database,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Crosshair,
  Radio,
  Sliders,
  Maximize2,
  Minimize2,
  RefreshCw,
  Terminal,
  Zap,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  Flame,
  ArrowUpRight
} from 'lucide-react';

// --- TYPES & INTERFACES ---
export interface SonarWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  depthM: number;
  noduleGrade: string;
  densityKgM2: number;
  estimatedTons: number;
  status: 'COMPLETED' | 'TARGET' | 'PLANNED';
  notes: string;
}

export interface NoduleCluster {
  id: string;
  x: number;
  y: number;
  radius: number;
  density: number; // 0 to 100
  type: string;
  grade: string;
}

export interface HarvestRecord {
  id: string;
  lotCode: string;
  timestamp: string;
  mineralClass: string;
  wetWeightKg: number;
  dryEquivKg: number;
  mnPct: number;
  niPct: number;
  coPct: number;
  cuPct: number;
  extractionZone: string;
  hopperBay: string;
}

export interface AcousticBeacon {
  id: string;
  tag: string;
  frequencyKhz: number;
  snrDb: number;
  batteryPct: number;
  syncDriftUs: number;
  status: 'LOCKED' | 'SYNC' | 'DEGRADED';
  depthM: number;
}

// --- SYNTHETIC AUDIO GENERATOR (NO EXTERNAL ASSETS) ---
class TelemetryAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazily initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playSonarPing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.38);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playHydraulicPurge() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // White noise buffer for pneumatic / hydraulic rush
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Audio fallback
    }
  }

  public playAlertChirp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1174, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.28);
    } catch {
      // Audio fallback
    }
  }
}

const audioEngine = new TelemetryAudio();

// Initial Waypoints
const INITIAL_WAYPOINTS: SonarWaypoint[] = [
  { id: 'wp-1', name: 'WP-01', x: 140, y: 70, depthM: -4178.5, noduleGrade: 'Grade-A Prime (30% Mn)', densityKgM2: 18.2, estimatedTons: 14.5, status: 'COMPLETED', notes: 'Touchdown marker reached. Pelagic clay seabed.' },
  { id: 'wp-2', name: 'WP-02', x: 210, y: 130, depthM: -4181.2, noduleGrade: 'Polymetallic Crust Bed', densityKgM2: 22.4, estimatedTons: 18.2, status: 'COMPLETED', notes: 'Continuous dense nodule pavement. Rake intake 90%.' },
  { id: 'wp-3', name: 'WP-03', x: 275, y: 180, depthM: -4183.0, noduleGrade: 'Cobalt-Enriched Crust', densityKgM2: 15.6, estimatedTons: 11.4, status: 'COMPLETED', notes: 'Traction lock engaged. Gradient 3.8 deg.' },
  { id: 'wp-4', name: 'WP-04', x: 350, y: 240, depthM: -4180.4, noduleGrade: 'Grade-A Prime (31% Mn)', densityKgM2: 24.8, estimatedTons: 21.0, status: 'TARGET', notes: 'Current active harvester extraction coordinate.' },
  { id: 'wp-5', name: 'WP-05', x: 420, y: 290, depthM: -4179.1, noduleGrade: 'Nickel-Rich Sediment Basin', densityKgM2: 19.5, estimatedTons: 16.8, status: 'PLANNED', notes: 'Sub-bottom profiler shows soft silt cushion.' },
  { id: 'wp-6', name: 'WP-06', x: 490, y: 320, depthM: -4184.5, noduleGrade: 'Escarpment Rim Deposit', densityKgM2: 12.0, estimatedTons: 9.5, status: 'PLANNED', notes: 'Caution: basalt outcropping 12m to port side.' },
  { id: 'wp-7', name: 'WP-07', x: 560, y: 380, depthM: -4186.0, noduleGrade: 'Hydrothermal Flank Silts', densityKgM2: 16.0, estimatedTons: 13.0, status: 'PLANNED', notes: 'Local temp anomaly +0.3 deg C.' },
];

const NODULE_CLUSTERS: NoduleCluster[] = [
  { id: 'c1', x: 190, y: 110, radius: 38, density: 88, type: 'Polymetallic Nodule Field', grade: '31.2% Mn | 1.48% Ni' },
  { id: 'c2', x: 340, y: 220, radius: 52, density: 94, type: 'Ultra-Dense Nodule Pavement', grade: '32.1% Mn | 1.54% Ni' },
  { id: 'c3', x: 430, y: 270, radius: 44, density: 76, type: 'Nickel Sediment Swale', grade: '28.5% Mn | 1.82% Ni' },
  { id: 'c4', x: 260, y: 310, radius: 32, density: 65, type: 'Cobalt Crust Outcrop', grade: '24.1% Mn | 0.92% Co' },
  { id: 'c5', x: 520, y: 360, radius: 46, density: 82, type: 'Deep Basaltic Sulfide Bed', grade: '29.7% Mn | 1.35% Cu' },
];

const INITIAL_HARVEST: HarvestRecord[] = [
  { id: 'rec-1', lotCode: 'LOT-11B-001', timestamp: '01:14:22', mineralClass: 'Grade-A Manganese Nodules', wetWeightKg: 4280, dryEquivKg: 3124, mnPct: 29.8, niPct: 1.42, coPct: 0.28, cuPct: 1.15, extractionZone: 'Sector 11B Trench North', hopperBay: 'BAY-01A' },
  { id: 'rec-2', lotCode: 'LOT-11B-002', timestamp: '01:38:05', mineralClass: 'Grade-A Manganese Nodules', wetWeightKg: 4650, dryEquivKg: 3394, mnPct: 30.1, niPct: 1.48, coPct: 0.31, cuPct: 1.20, extractionZone: 'Sector 11B Trench North', hopperBay: 'BAY-01B' },
  { id: 'rec-3', lotCode: 'LOT-11B-003', timestamp: '02:04:19', mineralClass: 'High-Cobalt Crust Aggregate', wetWeightKg: 3820, dryEquivKg: 2788, mnPct: 24.5, niPct: 1.10, coPct: 0.84, cuPct: 0.68, extractionZone: 'Escarpment Outcrop Flank', hopperBay: 'BAY-02A' },
  { id: 'rec-4', lotCode: 'LOT-11B-004', timestamp: '02:29:41', mineralClass: 'High-Cobalt Crust Aggregate', wetWeightKg: 4100, dryEquivKg: 2993, mnPct: 25.2, niPct: 1.15, coPct: 0.88, cuPct: 0.72, extractionZone: 'Escarpment Outcrop Flank', hopperBay: 'BAY-02B' },
  { id: 'rec-5', lotCode: 'LOT-11B-005', timestamp: '02:51:10', mineralClass: 'Polymetallic Sulfide Matrix', wetWeightKg: 5100, dryEquivKg: 3825, mnPct: 18.4, niPct: 2.85, coPct: 0.42, cuPct: 3.40, extractionZone: 'Ridge Basalt Boundary', hopperBay: 'BAY-03A' },
  { id: 'rec-6', lotCode: 'LOT-11B-006', timestamp: '03:15:33', mineralClass: 'Polymetallic Sulfide Matrix', wetWeightKg: 4890, dryEquivKg: 3667, mnPct: 19.1, niPct: 2.70, coPct: 0.39, cuPct: 3.25, extractionZone: 'Ridge Basalt Boundary', hopperBay: 'BAY-03B' },
  { id: 'rec-7', lotCode: 'LOT-11B-007', timestamp: '03:40:02', mineralClass: 'Rare-Earth Enriched Silts', wetWeightKg: 3450, dryEquivKg: 2415, mnPct: 14.8, niPct: 0.95, coPct: 0.22, cuPct: 0.85, extractionZone: 'South Vent Swale', hopperBay: 'BAY-04A' },
  { id: 'rec-8', lotCode: 'LOT-11B-008', timestamp: '04:02:18', mineralClass: 'Grade-A Manganese Nodules', wetWeightKg: 4420, dryEquivKg: 3226, mnPct: 30.6, niPct: 1.52, coPct: 0.33, cuPct: 1.25, extractionZone: 'Central Abyssal Basin', hopperBay: 'BAY-04B' },
  { id: 'rec-9', lotCode: 'LOT-11B-009', timestamp: '04:28:44', mineralClass: 'Grade-A Manganese Nodules', wetWeightKg: 4180, dryEquivKg: 3051, mnPct: 29.9, niPct: 1.45, coPct: 0.29, cuPct: 1.18, extractionZone: 'Central Abyssal Basin', hopperBay: 'BAY-05A' },
  { id: 'rec-10', lotCode: 'LOT-11B-010', timestamp: '04:55:12', mineralClass: 'Nickel Hydrothermal Core', wetWeightKg: 3960, dryEquivKg: 2970, mnPct: 22.1, niPct: 3.12, coPct: 0.45, cuPct: 2.90, extractionZone: 'Sector 11B Core Vent', hopperBay: 'BAY-05B' },
];

const INITIAL_BEACONS: AcousticBeacon[] = [
  { id: 'b-1', tag: 'BEACON-A12', frequencyKhz: 18.5, snrDb: 28.4, batteryPct: 94.2, syncDriftUs: 1.4, status: 'LOCKED', depthM: -4172 },
  { id: 'b-2', tag: 'BEACON-B04', frequencyKhz: 19.2, snrDb: 24.1, batteryPct: 88.6, syncDriftUs: 2.8, status: 'LOCKED', depthM: -4185 },
  { id: 'b-3', tag: 'BEACON-C09', frequencyKhz: 20.1, snrDb: 26.8, batteryPct: 91.0, syncDriftUs: 0.9, status: 'LOCKED', depthM: -4191 },
  { id: 'b-4', tag: 'BEACON-D01', frequencyKhz: 21.0, snrDb: 31.2, batteryPct: 96.5, syncDriftUs: 0.4, status: 'LOCKED', depthM: -4180 },
];

// --- MAIN FLAGSHIP COMPONENT ---
export function SubseaCrawlerOps() {
  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<'MISSION_DECK' | 'SONAR_BATHYMETRY' | 'ROBOTIC_ARM' | 'HARVEST_LOG'>('MISSION_DECK');

  // Simulation running state
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastPingTime, setLastPingTime] = useState<string>('JUST NOW');

  // Telemetry state values (fluctuating realistically)
  const [depth, setDepth] = useState<number>(-4180.42);
  const [hydrostaticPressure, setHydrostaticPressure] = useState<number>(41.81);
  const [ambientTemp, setAmbientTemp] = useState<number>(1.84);
  const [acousticLatency, setAcousticLatency] = useState<number>(380);
  const [heading, setHeading] = useState<number>(142.6);

  // Hydraulic & Arm Diagnostics
  const [primaryHydraulicPsi, setPrimaryHydraulicPsi] = useState<number>(3458);
  const [auxHydraulicPsi, setAuxHydraulicPsi] = useState<number>(2820);
  const [intakeRateTph, setIntakeRateTph] = useState<number>(14.85);
  const [slurryDensity, setSlurryDensity] = useState<number>(1.62);
  const [batteryKwh, setBatteryKwh] = useState<number>(482.4);
  const [powerKw, setPowerKw] = useState<number>(48.7);
  const [hydraulicTempC, setHydraulicTempC] = useState<number>(42.4);

  // 6-Axis Arm States
  const [armPose, setArmPose] = useState<string>('SEABED_RAKE_ACTIVE');
  const [joint1Yaw, setJoint1Yaw] = useState<number>(14.2);
  const [joint2Boom, setJoint2Boom] = useState<number>(35.8);
  const [joint3Stick, setJoint3Stick] = useState<number>(68.4);
  const [joint4Roll, setJoint4Roll] = useState<number>(-12.5);
  const [joint5Pitch, setJoint5Pitch] = useState<number>(43.2);
  const [joint6GripperKn, setJoint6GripperKn] = useState<number>(46.5);
  const [suctionVacuumKpa, setSuctionVacuumKpa] = useState<number>(84.2);

  // Operational toggles
  const [isMagneticLocked, setIsMagneticLocked] = useState<boolean>(false);
  const [isPurgingSlurry, setIsPurgingSlurry] = useState<boolean>(false);
  const [purgeProgress, setPurgeProgress] = useState<number>(0);
  const [ballastArmed, setBallastArmed] = useState<boolean>(true);
  const [ballastBlown, setBallastBlown] = useState<boolean>(false);

  // Modal dialog states
  const [showBallastModal, setShowBallastModal] = useState<boolean>(false);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);
  const [showAddWaypointModal, setShowAddWaypointModal] = useState<boolean>(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<SonarWaypoint | null>(INITIAL_WAYPOINTS[3]);
  const [selectedCluster, setSelectedCluster] = useState<NoduleCluster | null>(null);

  // Data Collections
  const [waypoints, setWaypoints] = useState<SonarWaypoint[]>(INITIAL_WAYPOINTS);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>(INITIAL_HARVEST);
  const [beacons, setBeacons] = useState<AcousticBeacon[]>(INITIAL_BEACONS);
  const [hopperPayloadTons, setHopperPayloadTons] = useState<number>(42.85);
  const [filterClass, setFilterClass] = useState<string>('ALL');

  // SVG Sonar Canvas Interaction
  const [sonarZoom, setSonarZoom] = useState<number>(1);
  const [activeSonarMode, setActiveSonarMode] = useState<'FLS' | 'SSS' | 'BATHYMETRY'>('BATHYMETRY');
  const [newWpCoords, setNewWpCoords] = useState<{ x: number; y: number }>({ x: 300, y: 200 });

  const sonarGradientId = useId();

  // Handle audio muting state
  useEffect(() => {
    audioEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Main High-Precision Telemetry Tick Loop (Updates smoothly every 1000ms, with micro-fluctuations)
  useEffect(() => {
    if (!isSimRunning || ballastBlown) return;

    const interval = setInterval(() => {
      // Oscillate depth with subtle oceanic heave (±0.04m)
      setDepth((prev) => {
        const delta = (Math.random() - 0.49) * 0.08;
        return Number((prev + delta).toFixed(2));
      });

      // Pressure calculated dynamically from depth: P = rho * g * h
      setHydrostaticPressure((prev) => {
        const delta = (Math.random() - 0.5) * 0.02;
        return Number((prev + delta).toFixed(2));
      });

      // Subtle latency drift
      setAcousticLatency((prev) => {
        const drift = Math.floor((Math.random() - 0.5) * 6);
        return Math.max(360, Math.min(410, prev + drift));
      });

      // Ambient temperature fluctuation around 1.84°C
      setAmbientTemp((prev) => {
        const tDrift = (Math.random() - 0.5) * 0.01;
        return Number((prev + tDrift).toFixed(2));
      });

      // Primary hydraulics variance (nominal 3450-3465)
      setPrimaryHydraulicPsi((prev) => {
        const pDelta = Math.floor((Math.random() - 0.5) * 8);
        return Math.max(3410, Math.min(3510, prev + pDelta));
      });

      // Suction rate fluctuation
      setIntakeRateTph((prev) => {
        const flow = (Math.random() - 0.48) * 0.25;
        const next = Math.max(12.5, Math.min(18.2, prev + flow));
        return Number(next.toFixed(2));
      });

      // Battery discharge
      setBatteryKwh((prev) => {
        if (prev <= 10) return prev;
        return Number((prev - 0.014).toFixed(2));
      });

      // Increment payload hopper gradually if intake active
      setHopperPayloadTons((prev) => {
        if (prev >= 60.0) return 60.0;
        const tonsIncrement = 0.0035;
        return Number((prev + tonsIncrement).toFixed(2));
      });

      // Arm subtle joint vibration while cutting
      setJoint1Yaw((prev) => Number((prev + (Math.random() - 0.5) * 0.06).toFixed(1)));
      setJoint2Boom((prev) => Number((prev + (Math.random() - 0.5) * 0.04).toFixed(1)));
      setSuctionVacuumKpa((prev) => Number((prev + (Math.random() - 0.5) * 0.3).toFixed(1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimRunning, ballastBlown]);

  // Periodic Acoustic Sonar Ping Loop (every 8 seconds, fires sound & visual update)
  useEffect(() => {
    if (!isSimRunning || ballastBlown) return;

    const pingInterval = setInterval(() => {
      audioEngine.playSonarPing();
      const now = new Date();
      setLastPingTime(now.toTimeString().split(' ')[0]);
    }, 8500);

    return () => clearInterval(pingInterval);
  }, [isSimRunning, ballastBlown]);

  // Purge cycle simulation timer
  useEffect(() => {
    if (!isPurgingSlurry) return;
    audioEngine.playHydraulicPurge();
    const interval = setInterval(() => {
      setPurgeProgress((prev) => {
        if (prev >= 100) {
          setIsPurgingSlurry(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPurgingSlurry]);

  // Trigger manual acoustic sonar ping
  const handlePulseSonarPing = () => {
    audioEngine.playSonarPing();
    const now = new Date();
    setLastPingTime(now.toTimeString().split(' ')[0]);
  };

  // Toggle magnetic track anchor
  const handleToggleMagneticLock = () => {
    audioEngine.playAlertChirp();
    setIsMagneticLocked((prev) => !prev);
  };

  // Trigger slurry purge
  const handleTriggerPurge = () => {
    setIsPurgingSlurry(true);
    setPurgeProgress(5);
  };

  // Trigger emergency buoyancy ballast blow
  const handleConfirmBallastBlow = () => {
    audioEngine.playAlertChirp();
    setBallastBlown(true);
    setShowBallastModal(false);
    setIntakeRateTph(0);
    // Harvester begins rapid buoyant ascent
    const ascentInterval = setInterval(() => {
      setDepth((prev) => {
        if (prev >= 0) {
          clearInterval(ascentInterval);
          return 0;
        }
        return Number((prev + 120.5).toFixed(1));
      });
    }, 400);
  };

  // Reset harvester simulation after ballast blow
  const handleResetHarvester = () => {
    setBallastBlown(false);
    setDepth(-4180.42);
    setHydrostaticPressure(41.81);
    setIntakeRateTph(14.85);
    setHopperPayloadTons(42.85);
  };

  // Add custom waypoint on canvas click
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round((e.clientX - rect.left) / sonarZoom);
    const clickY = Math.round((e.clientY - rect.top) / sonarZoom);
    setNewWpCoords({ x: clickX, y: clickY });
    setShowAddWaypointModal(true);
  };

  const handleCreateWaypoint = (name: string, grade: string, tons: number) => {
    const newWp: SonarWaypoint = {
      id: `wp-${Date.now()}`,
      name: name || `WP-0${waypoints.length + 1}`,
      x: newWpCoords.x,
      y: newWpCoords.y,
      depthM: Number((depth + (Math.random() - 0.5) * 4).toFixed(1)),
      noduleGrade: grade,
      densityKgM2: 20.5,
      estimatedTons: tons,
      status: 'PLANNED',
      notes: 'Operator mapped exploration waypoint via sonar radar grid.'
    };
    setWaypoints((prev) => [...prev, newWp]);
    setSelectedWaypoint(newWp);
    setShowAddWaypointModal(false);
    audioEngine.playAlertChirp();
  };

  // Export Manifest as CSV
  const handleExportManifestCSV = () => {
    const headers = ['Lot Code', 'Timestamp', 'Mineral Class', 'Wet Weight (kg)', 'Dry Equiv (kg)', 'Mn %', 'Ni %', 'Co %', 'Cu %', 'Extraction Zone', 'Hopper Bay'];
    const rows = harvestRecords.map(r => [
      r.lotCode,
      r.timestamp,
      `"${r.mineralClass}"`,
      r.wetWeightKg,
      r.dryEquivKg,
      r.mnPct,
      r.niPct,
      r.coPct,
      r.cuPct,
      `"${r.extractionZone}"`,
      r.hopperBay
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SubseaHarvester_Sector11B_Manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    audioEngine.playAlertChirp();
  };

  // Filtered harvest records
  const filteredRecords = harvestRecords.filter(r => {
    if (filterClass === 'ALL') return true;
    return r.mineralClass.includes(filterClass);
  });

  return (
    <>
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-mono flex flex-col selection:bg-cyan-500 selection:text-slate-950 border-t-2 border-cyan-500">
        
        {/* ==================================================================== */}
        {/* TOP LEVEL NAVIGATION & COMMAND HEADER */}
        {/* ==================================================================== */}
        <header className="bg-[#0F172A] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs tracking-widest font-black uppercase text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  NAUTILUS-X9
                </span>
                <span className="text-xs text-slate-400 font-semibold tracking-wider">
                  PACIFIC TRENCH - SECTOR 11B // DEEP-SEA TETHERLESS MINING HARVESTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>AUTONOMOUS EXTRACTION CYCLE ACTIVE</span>
                <span className="text-slate-600">|</span>
                <span>USBL ACOUSTIC CARRIER: 18.5 kHz</span>
                <span className="text-slate-600">|</span>
                <span>LAST PING: <span className="text-cyan-300 font-bold">{lastPingTime}</span></span>
              </p>
            </div>
          </div>

          {/* Operational Controls & Sound Engine */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sonar & Hydraulic Audio' : 'Enable Acoustic Telemetry Audio'}
              className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-all ${
                soundEnabled
                  ? 'bg-slate-900 border-cyan-700/60 text-cyan-300 hover:bg-slate-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
            </button>

            <button
              onClick={() => setIsSimRunning(!isSimRunning)}
              className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-all ${
                isSimRunning
                  ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-600/80 text-amber-300'
              }`}
            >
              {isSimRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden md:inline">{isSimRunning ? 'TELEMETRY LIVE' : 'FROZEN'}</span>
            </button>

            <button
              onClick={() => setShowDiagnosticsModal(true)}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>SYS AUDIT</span>
            </button>

            {/* Emergency Buoyancy Ballast Blow Button */}
            {!ballastBlown ? (
              <button
                onClick={() => setShowBallastModal(true)}
                className="px-3 py-1.5 rounded bg-red-950/70 hover:bg-red-900 border border-red-600/90 text-red-200 font-bold text-xs flex items-center gap-1.5 tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all animate-pulse"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>BALLAST BLOW</span>
              </button>
            ) : (
              <button
                onClick={handleResetHarvester}
                className="px-3 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-200 font-bold text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>RESET MISSION</span>
              </button>
            )}
          </div>
        </header>

        {/* ==================================================================== */}
        {/* PANE 1: TOP HULL & DEPTH TELEMETRY HUD STRIP */}
        {/* ==================================================================== */}
        <section className="bg-[#111827] border-b border-slate-800 px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Metric 1: Depth */}
            <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  DEPTH
                </span>
                <span className="text-[10px] text-cyan-400/80">SEABED REF</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-cyan-300">
                  {depth.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  <span className="text-xs font-normal text-slate-400 ml-1">m</span>
                </span>
                <span className="text-[10px] px-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  TARGET -4,180m
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div className="bg-cyan-500 h-full w-[94%]" />
              </div>
            </div>

            {/* Metric 2: Hydrostatic Pressure */}
            <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  EXT. PRESSURE
                </span>
                <span className="text-[10px] text-amber-400/80">HYDROSTATIC</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-300">
                  {hydrostaticPressure.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">MPa</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  ~{(hydrostaticPressure * 10).toFixed(0)} Bar
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div className="bg-amber-500 h-full w-[82%]" />
              </div>
            </div>

            {/* Metric 3: Ambient Sea Temp */}
            <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  SEA TEMP
                </span>
                <span className="text-[10px] text-slate-400">SAL 34.7</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-300">
                  {ambientTemp.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
                </span>
                <span className="text-[10px] text-slate-400">ABYSSAL</span>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div className="bg-blue-500 h-full w-[24%]" />
              </div>
            </div>

            {/* Metric 4: Acoustic Ping Latency */}
            <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  ACOUSTIC LATENCY
                </span>
                <span className="text-[10px] text-emerald-400">USBL 4.2k</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-cyan-300">
                  {acousticLatency}
                  <span className="text-xs font-normal text-slate-400 ml-1">ms</span>
                </span>
                <span className="text-[10px] text-slate-400">1.48 km/s</span>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div className="bg-cyan-500 h-full w-[45%]" />
              </div>
            </div>

            {/* Metric 5: Battery Reserves */}
            <div className="bg-[#0B0F17] p-2.5 rounded border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  SOLID BATTERY
                </span>
                <span className="text-[10px] text-amber-400 font-bold">{powerKw.toFixed(1)} kW</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-300">
                  {batteryKwh.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400 ml-1">kWh</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {((batteryKwh / 650) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all"
                  style={{ width: `${(batteryKwh / 650) * 100}%` }}
                />
              </div>
            </div>

            {/* Metric 6: Emergency Ballast Status Toggle */}
            <div className={`p-2.5 rounded border flex flex-col justify-between transition-all ${
              ballastBlown
                ? 'bg-red-950/60 border-red-500'
                : 'bg-[#0B0F17] border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <AlertTriangle className={`w-3.5 h-3.5 ${ballastBlown ? 'text-red-400' : 'text-emerald-400'}`} />
                  BALLAST STATUS
                </span>
                <span className={`text-[10px] font-bold ${ballastBlown ? 'text-red-400' : 'text-emerald-400'}`}>
                  {ballastBlown ? 'JETTISONED' : 'ARMED / SECURE'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {ballastBlown ? 'SURFACE ASCENT IN PROGRESS' : 'DUAL ACTUATORS READY'}
                </span>
                <button
                  onClick={() => setShowBallastModal(true)}
                  disabled={ballastBlown}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-all ${
                    ballastBlown
                      ? 'bg-red-800 text-white cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-red-900/60 text-red-300 border border-red-800/80'
                  }`}
                >
                  {ballastBlown ? 'BLOWN' : 'RELEASE'}
                </button>
              </div>
              <div className="w-full bg-slate-900 h-1 mt-2 rounded overflow-hidden">
                <div className={`h-full w-full ${ballastBlown ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================================== */}
        {/* TAB CONTROLS (FULL MISSION DECK VS FOCUSED DRILLDOWNS) */}
        {/* ==================================================================== */}
        <div className="bg-[#0B0F17] border-b border-slate-800 px-4 flex items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('MISSION_DECK')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'MISSION_DECK'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>4-PANE MISSION DECK</span>
            </button>
            <button
              onClick={() => setActiveTab('SONAR_BATHYMETRY')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'SONAR_BATHYMETRY'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>2D SONAR & BATHYMETRY</span>
            </button>
            <button
              onClick={() => setActiveTab('ROBOTIC_ARM')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'ROBOTIC_ARM'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>6-AXIS HYDRAULIC ARM</span>
            </button>
            <button
              onClick={() => setActiveTab('HARVEST_LOG')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'HARVEST_LOG'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>HARVEST MANIFEST & HOPPER</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span>HEADING: <strong className="text-cyan-300">{heading.toFixed(1)}° SE</strong></span>
            <span>MAGNETIC TRACKS: <strong className={isMagneticLocked ? 'text-amber-400' : 'text-slate-300'}>{isMagneticLocked ? 'LOCKED' : 'NOMINAL'}</strong></span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MAIN OPERATIONS WORKSPACE */}
        {/* ==================================================================== */}
        <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ================================================================== */}
          {/* PANE 2: CENTER-LEFT 2D SONAR BATHYMETRY CANVAS */}
          {/* ================================================================== */}
          <div className={`${
            activeTab === 'SONAR_BATHYMETRY'
              ? 'lg:col-span-12'
              : activeTab === 'MISSION_DECK'
              ? 'lg:col-span-7'
              : 'hidden'
          } flex flex-col bg-[#111827] rounded border border-slate-800 overflow-hidden shadow-xl`}>
            
            {/* Sonar Canvas Header Bar */}
            <div className="bg-[#0F172A] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">
                  2D BATHYMETRY & SONAR SWEEP // SECTOR 11B ABYSSAL PLAIN
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  120 kHz FLS
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handlePulseSonarPing}
                  className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                >
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>PULSE PING</span>
                </button>

                <div className="flex items-center bg-slate-900 rounded border border-slate-800 p-0.5 text-[11px]">
                  <button
                    onClick={() => setActiveSonarMode('BATHYMETRY')}
                    className={`px-2 py-0.5 rounded ${activeSonarMode === 'BATHYMETRY' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
                  >
                    BATHY
                  </button>
                  <button
                    onClick={() => setActiveSonarMode('FLS')}
                    className={`px-2 py-0.5 rounded ${activeSonarMode === 'FLS' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
                  >
                    RADAR
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSonarZoom(Math.max(0.8, sonarZoom - 0.2))}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Zoom Out"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 w-8 text-center">{(sonarZoom * 100).toFixed(0)}%</span>
                  <button
                    onClick={() => setSonarZoom(Math.min(1.8, sonarZoom + 0.2))}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Zoom In"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Sonar Canvas */}
            <div className="relative flex-1 bg-[#070b12] p-2 min-h-[380px] flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 700 450"
                onClick={handleCanvasClick}
                className="w-full h-full max-h-[460px] cursor-crosshair select-none"
                style={{ transform: `scale(${sonarZoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
              >
                <defs>
                  {/* Sweep Gradient for Sonar Radar */}
                  <linearGradient id={sonarGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>

                  {/* Grid Pattern */}
                  <pattern id="sonar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="50" y2="0" stroke="#1e293b" strokeWidth="0.7" strokeDasharray="2 2" />
                    <line x1="0" y1="0" x2="0" y2="50" stroke="#1e293b" strokeWidth="0.7" strokeDasharray="2 2" />
                  </pattern>
                </defs>

                {/* Background Grid */}
                <rect width="700" height="450" fill="url(#sonar-grid)" />

                {/* Bathymetric Isobar Contours */}
                <path d="M 0 100 Q 150 80, 300 130 T 700 110" fill="none" stroke="#1e3a5f" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" />
                <text x="20" y="95" fill="#38bdf8" fontSize="9" opacity="0.5">-4,175m ISO</text>

                <path d="M 0 200 Q 200 180, 420 230 T 700 210" fill="none" stroke="#1e3a5f" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" />
                <text x="20" y="195" fill="#38bdf8" fontSize="9" opacity="0.5">-4,180m ISO</text>

                <path d="M 0 320 Q 220 300, 450 350 T 700 330" fill="none" stroke="#1e3a5f" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" />
                <text x="20" y="315" fill="#38bdf8" fontSize="9" opacity="0.5">-4,185m ISO</text>

                {/* Range Rings Centered on Active Harvester (Waypoint 4: 350, 240) */}
                <circle cx="350" cy="240" r="80" fill="none" stroke="#0e7490" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                <text x="435" y="244" fill="#06b6d4" fontSize="8" opacity="0.6">100m</text>

                <circle cx="350" cy="240" r="160" fill="none" stroke="#0e7490" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
                <text x="515" y="244" fill="#06b6d4" fontSize="8" opacity="0.6">200m</text>

                <circle cx="350" cy="240" r="240" fill="none" stroke="#0e7490" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.2" />
                <text x="595" y="244" fill="#06b6d4" fontSize="8" opacity="0.6">300m</text>

                {/* Manganese Nodule Deposit Clusters */}
                {NODULE_CLUSTERS.map((cl) => (
                  <g
                    key={cl.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCluster(cl);
                    }}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={cl.x}
                      cy={cl.y}
                      r={cl.radius}
                      fill="#0284c7"
                      fillOpacity={cl.density / 350}
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="group-hover:stroke-cyan-300 transition-all"
                    />
                    <circle cx={cl.x} cy={cl.y} r="2" fill="#38bdf8" />
                    <text
                      x={cl.x}
                      y={cl.y - cl.radius - 4}
                      fill="#7dd3fc"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-bold opacity-75 group-hover:opacity-100"
                    >
                      {cl.density}% DENSITY
                    </text>
                  </g>
                ))}

                {/* Traversal Vector Trajectory Path */}
                <polyline
                  points={waypoints.map((wp) => `${wp.x},${wp.y}`).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />

                {/* Clickable Waypoints */}
                {waypoints.map((wp, idx) => {
                  const isCurrent = wp.id === selectedWaypoint?.id;
                  const isReached = wp.status === 'COMPLETED';
                  const isTarget = wp.status === 'TARGET';

                  return (
                    <g
                      key={wp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWaypoint(wp);
                        audioEngine.playAlertChirp();
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Pulse circle for active target */}
                      {isTarget && (
                        <circle
                          cx={wp.x}
                          cy={wp.y}
                          r="16"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="1.5"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        cx={wp.x}
                        cy={wp.y}
                        r={isTarget ? 7 : 5}
                        fill={isTarget ? '#06b6d4' : isReached ? '#10b981' : '#f59e0b'}
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="group-hover:r-8 transition-all"
                      />

                      {/* Waypoint Label */}
                      <rect
                        x={wp.x + 8}
                        y={wp.y - 12}
                        width="46"
                        height="16"
                        fill="#0b0f17"
                        fillOpacity="0.85"
                        stroke={isCurrent ? '#06b6d4' : '#1e293b'}
                        rx="2"
                      />
                      <text
                        x={wp.x + 12}
                        y={wp.y}
                        fill={isCurrent ? '#38bdf8' : '#e2e8f0'}
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {wp.name}
                      </text>
                    </g>
                  );
                })}

                {/* Acoustic Beacon Mesh Anchors */}
                {beacons.map((bc, bIdx) => {
                  const bx = 100 + bIdx * 160;
                  const by = 50 + (bIdx % 2) * 280;
                  return (
                    <g key={bc.id} className="cursor-pointer">
                      <polygon
                        points={`${bx},${by - 8} ${bx + 7},${by + 6} ${bx - 7},${by + 6}`}
                        fill="#059669"
                        stroke="#10b981"
                        strokeWidth="1"
                      />
                      <text x={bx + 9} y={by + 4} fill="#6ee7b7" fontSize="8">
                        {bc.tag} ({bc.snrDb}dB)
                      </text>
                    </g>
                  );
                })}

                {/* Harvester Crawler Vehicle Icon at WP-04 (350, 240) */}
                <g transform="translate(350, 240)">
                  {/* Synthetic Sonar Beam Sweep (CSS animation) */}
                  <g className="animate-radar">
                    <path
                      d="M 0 0 L 160 -80 A 180 180 0 0 1 180 0 Z"
                      fill={`url(#${sonarGradientId})`}
                    />
                  </g>

                  {/* Sonar Ping Ripple Ring */}
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="animate-ping-sonar" />

                  {/* Crawler Hull Chassis Graphic */}
                  <rect x="-18" y="-12" width="36" height="24" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  {/* Tracks */}
                  <rect x="-21" y="-15" width="42" height="6" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="-21" y="9" width="42" height="6" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  {/* Excavator Arm Boom Line */}
                  <line x1="8" y1="0" x2="26" y2="6" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  {/* Forward Suction Intake Head */}
                  <circle cx="28" cy="7" r="4" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />

                  {/* Heading Vector Arrow */}
                  <line x1="0" y1="0" x2="28" y2="0" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 1" />
                  <polygon points="32,0 26,-3 26,3" fill="#22d3ee" />
                </g>
              </svg>

              {/* Inset Canvas Overlay Legend */}
              <div className="absolute bottom-3 left-3 bg-[#0B0F17]/90 border border-slate-800 p-2.5 rounded text-[11px] backdrop-blur-sm pointer-events-none">
                <div className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SECTOR 11B BATHYMETRIC OVERLAY</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Active Target
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Reached WP
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> Planned WP
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Nodule Bed
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1">
                  * Click any coordinate on map to plot new waypoint.
                </p>
              </div>

              {/* Waypoint Details Drawer / Popover when selected */}
              {selectedWaypoint && (
                <div className="absolute top-3 right-3 bg-[#0F172A]/95 border border-cyan-700/60 p-3 rounded w-64 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="font-black text-cyan-300 text-xs flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedWaypoint.name} DETAILS
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      selectedWaypoint.status === 'TARGET' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                      selectedWaypoint.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                      'bg-slate-800 text-amber-300'
                    }`}>
                      {selectedWaypoint.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Coordinates:</span>
                      <span className="font-mono text-slate-200">X: {selectedWaypoint.x}m | Y: {selectedWaypoint.y}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Depth:</span>
                      <span className="font-mono text-cyan-300">{selectedWaypoint.depthM} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nodule Class:</span>
                      <span className="font-bold text-slate-200">{selectedWaypoint.noduleGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Density:</span>
                      <span className="text-amber-400 font-bold">{selectedWaypoint.densityKgM2} kg/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Yield:</span>
                      <span className="text-emerald-400 font-bold">{selectedWaypoint.estimatedTons} Tons</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 italic">
                      &quot;{selectedWaypoint.notes}&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sonar Footer Quick Bar */}
            <div className="bg-[#0B0F17] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>ACTIVE TRANSLATION SPEED: <strong className="text-cyan-300">0.42 m/s (0.81 kts)</strong></span>
                <span>SEABED CONTACT ANGLE: <strong className="text-slate-200">1.8° PITCH</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMagneticLock}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                    isMagneticLocked
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Anchor className="w-3 h-3 inline mr-1" />
                  {isMagneticLocked ? 'MAGNETIC CLAMP ACTIVE' : 'ENGAGE MAGNETIC LOCK'}
                </button>
              </div>
            </div>

          </div>

          {/* ================================================================== */}
          {/* PANE 3: CENTER-RIGHT ROBOTIC ARTICULATION & HYDRAULIC DIAGNOSTICS */}
          {/* ================================================================== */}
          <div className={`${
            activeTab === 'ROBOTIC_ARM'
              ? 'lg:col-span-12'
              : activeTab === 'MISSION_DECK'
              ? 'lg:col-span-5'
              : 'hidden'
          } flex flex-col bg-[#111827] rounded border border-slate-800 overflow-hidden shadow-xl`}>
            
            {/* Header */}
            <div className="bg-[#0F172A] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  6-AXIS EXCAVATOR ARM & HYDRAULICS
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                {armPose}
              </span>
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Hydraulic Pressure & Intake Summary Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>PRIMARY HYDRAULIC</span>
                    <span className="text-amber-400 font-bold">CIRCUIT A</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-amber-300">
                      {primaryHydraulicPsi}
                      <span className="text-xs font-normal text-slate-400 ml-1">PSI</span>
                    </span>
                    <span className="text-[10px] text-emerald-400">NOMINAL</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 mt-2 rounded overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all"
                      style={{ width: `${(primaryHydraulicPsi / 4000) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#0B0F17] p-3 rounded border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>SUCTION INTAKE</span>
                    <span className="text-cyan-400 font-bold">SLURRY RAKE</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-cyan-300">
                      {intakeRateTph}
                      <span className="text-xs font-normal text-slate-400 ml-1">t/hr</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      DEN: {slurryDensity} g/cm³
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 mt-2 rounded overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full transition-all"
                      style={{ width: `${(intakeRateTph / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 6-Axis Robotic Kinematic Articulation Sliders / Telemetry */}
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    6-AXIS ARTICULATION MATRIX
                  </span>
                  <span className="text-[10px] text-slate-400">
                    SERVO BUS: 48V CANopen
                  </span>
                </div>

                {/* Axis 1: Base Yaw */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 1 (Base Yaw):</span>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="0.5"
                    value={joint1Yaw}
                    onChange={(e) => setJoint1Yaw(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint1Yaw}°</span>
                </div>

                {/* Axis 2: Boom Pitch */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 2 (Boom Pitch):</span>
                  <input
                    type="range"
                    min="0"
                    max="75"
                    step="0.5"
                    value={joint2Boom}
                    onChange={(e) => setJoint2Boom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint2Boom}°</span>
                </div>

                {/* Axis 3: Stick Pitch */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 3 (Stick Pitch):</span>
                  <input
                    type="range"
                    min="0"
                    max="110"
                    step="0.5"
                    value={joint3Stick}
                    onChange={(e) => setJoint3Stick(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint3Stick}°</span>
                </div>

                {/* Axis 4: Wrist Roll */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 4 (Wrist Roll):</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={joint4Roll}
                    onChange={(e) => setJoint4Roll(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint4Roll}°</span>
                </div>

                {/* Axis 5: Wrist Pitch */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 5 (Wrist Pitch):</span>
                  <input
                    type="range"
                    min="-45"
                    max="90"
                    step="1"
                    value={joint5Pitch}
                    onChange={(e) => setJoint5Pitch(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint5Pitch}°</span>
                </div>

                {/* Axis 6: Suction Head Gripper Force */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="min-w-[130px] text-slate-400 shrink-0">Axis 6 (Gripper Clamp):</span>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="0.5"
                    value={joint6GripperKn}
                    onChange={(e) => setJoint6GripperKn(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-[70px] text-right font-mono font-bold text-cyan-300 shrink-0">{joint6GripperKn} kN</span>
                </div>
              </div>

              {/* Arm Pose Presets Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Poses:</span>
                <button
                  onClick={() => {
                    setArmPose('SEABED_RAKE_ACTIVE');
                    setJoint1Yaw(14.2);
                    setJoint2Boom(35.8);
                    setJoint3Stick(68.4);
                  }}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    armPose === 'SEABED_RAKE_ACTIVE' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  SEABED RAKE
                </button>
                <button
                  onClick={() => {
                    setArmPose('NODULE_RECLAMATION');
                    setJoint1Yaw(22.0);
                    setJoint2Boom(42.0);
                    setJoint3Stick(74.5);
                  }}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    armPose === 'NODULE_RECLAMATION' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  RECLAMATION
                </button>
                <button
                  onClick={() => {
                    setArmPose('SAMPLING_CORE');
                    setJoint1Yaw(0.0);
                    setJoint2Boom(25.0);
                    setJoint3Stick(55.0);
                  }}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    armPose === 'SAMPLING_CORE' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  SAMPLING CORE
                </button>
                <button
                  onClick={() => {
                    setArmPose('STOWED_TRANSIT');
                    setJoint1Yaw(0.0);
                    setJoint2Boom(5.0);
                    setJoint3Stick(15.0);
                  }}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    armPose === 'STOWED_TRANSIT' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  STOWED
                </button>
              </div>

              {/* Diagnostic Action Bar: Slurry Purge */}
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">SUCTION SLURRY PURGE</div>
                  <div className="text-[10px] text-slate-400">
                    Reverse vortex water jet cleans nodule rock jams
                  </div>
                </div>
                <button
                  onClick={handleTriggerPurge}
                  disabled={isPurgingSlurry}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    isPurgingSlurry
                      ? 'bg-amber-950 border border-amber-500 text-amber-300 animate-pulse'
                      : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-200'
                  }`}
                >
                  {isPurgingSlurry ? `PURGING (${purgeProgress}%)` : 'PURGE INTAKE SLURRY'}
                </button>
              </div>

            </div>
          </div>

          {/* ================================================================== */}
          {/* PANE 4: BOTTOM SEAFLOOR HARVEST MANIFEST & HOPPER STATUS */}
          {/* ================================================================== */}
          <div className={`${
            activeTab === 'HARVEST_LOG'
              ? 'lg:col-span-12'
              : activeTab === 'MISSION_DECK'
              ? 'lg:col-span-12'
              : 'hidden'
          } bg-[#111827] rounded border border-slate-800 overflow-hidden shadow-xl flex flex-col`}>
            
            {/* Manifest Header */}
            <div className="bg-[#0F172A] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">
                    SEAFLOOR HARVEST MANIFEST & HOPPER CAPACITY
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                  TOTAL EXTRACTED: {hopperPayloadTons.toFixed(2)} / 60.00 TONS ({((hopperPayloadTons / 60) * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter dropdown */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Minerals</option>
                    <option value="Manganese">Manganese Nodules</option>
                    <option value="Cobalt">Cobalt Crust</option>
                    <option value="Sulfide">Polymetallic Sulfide</option>
                    <option value="Silts">Rare-Earth Silts</option>
                  </select>
                </div>

                <button
                  onClick={handleExportManifestCSV}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPORT CSV</span>
                </button>
              </div>
            </div>

            {/* Hopper Visual Fill Bar */}
            <div className="bg-[#0B0F17] px-4 py-2 border-b border-slate-800 flex items-center gap-4">
              <span className="text-xs text-slate-400 whitespace-nowrap">HOPPER CAPACITY:</span>
              <div className="flex-1 bg-slate-900 h-3 rounded overflow-hidden border border-slate-800 relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${(hopperPayloadTons / 60) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-300 whitespace-nowrap">
                {(60.0 - hopperPayloadTons).toFixed(2)} TONS REMAINING UNTIL SHUTTLE DOCK
              </span>
            </div>

            {/* Tabular Real-Time Mineral Yield Log */}
            <div className="p-3 pb-0">
              <div className="max-h-[300px] overflow-y-auto overflow-x-auto border border-cyan-900/40 rounded-md bg-slate-950/80 mb-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-950 z-10 border-b border-cyan-800/60">
                    <tr className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Lot Code</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Mineral Classification</th>
                      <th className="py-2.5 px-3 text-right">Wet Wt</th>
                      <th className="py-2.5 px-3 text-right">Dry Equiv</th>
                      <th className="py-2.5 px-3 text-center">Assay Grade (Mn / Ni / Co / Cu)</th>
                      <th className="py-2.5 px-3">Extraction Zone</th>
                      <th className="py-2.5 px-3 text-center">Hopper Bay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-cyan-300">{item.lotCode}</td>
                        <td className="py-2 px-3 text-slate-400">{item.timestamp}</td>
                        <td className="py-2 px-3 text-slate-200">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                          {item.mineralClass}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-100">
                          {item.wetWeightKg.toLocaleString()} kg
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400">
                          {item.dryEquivKg.toLocaleString()} kg
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-cyan-300 font-bold">{item.mnPct}% Mn</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-emerald-300">{item.niPct}% Ni</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-amber-300">{item.coPct}% Co</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-blue-300">{item.cuPct}% Cu</span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">{item.extractionZone}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                            {item.hopperBay}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Telemetry Status Summary */}
            <div className="bg-[#0B0F17] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ACOUSTIC BEACON MESH: <strong className="text-emerald-400">4/4 NODES SYNCHRONIZED</strong>
                </span>
                <span className="text-slate-700">|</span>
                <span>AVERAGE SYNC DRIFT: <strong className="text-slate-300">1.37 μs</strong></span>
              </div>
              <div>
                <span>ESTIMATED MISSION DURATION REMAINING: <strong className="text-cyan-300">9h 42m</strong></span>
              </div>
            </div>

          </div>

        </main>

        {/* ==================================================================== */}
        {/* MODAL 1: EMERGENCY BUOYANCY BALLAST BLOW CONFIRMATION */}
        {/* ==================================================================== */}
        {showBallastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0F172A] border-2 border-red-600/90 rounded-lg max-w-md w-full p-5 shadow-[0_0_50px_rgba(239,68,68,0.35)]">
              <div className="flex items-center gap-3 text-red-400 border-b border-red-900/60 pb-3">
                <div className="w-10 h-10 rounded-full bg-red-950 flex items-center justify-center border border-red-500">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wide text-red-200">
                    CRITICAL SAFETY OVERRIDE
                  </h3>
                  <p className="text-xs text-red-400 font-mono">
                    BUOYANCY BALLAST MECHANICAL RELEASE
                  </p>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-300 font-mono">
                <p>
                  Initiating this command will trigger the mechanical release of the heavy steel counterweights at a depth of{' '}
                  <strong className="text-red-300 font-bold">{depth.toFixed(1)}m</strong>.
                </p>
                <div className="bg-red-950/40 border border-red-800/80 p-3 rounded space-y-1 text-[11px] text-red-200">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    CONSEQUENCES OF BALLAST BLOW:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-red-300">
                    <li>Immediate abort of Sector 11B harvesting operation</li>
                    <li>Uncontrolled buoyant ascent at ~120 meters/minute</li>
                    <li>Requires shipboard recovery crane upon surface broach</li>
                  </ul>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Confirm authorization for Harvester unit NAUTILUS-X9.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowBallastModal(false)}
                  className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold"
                >
                  CANCEL / ABORT
                </button>
                <button
                  onClick={handleConfirmBallastBlow}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
                >
                  CONFIRM BALLAST RELEASE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 2: ADD SONAR WAYPOINT MODAL */}
        {/* ==================================================================== */}
        {showAddWaypointModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0F172A] border border-cyan-700/80 rounded-lg max-w-sm w-full p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  PLOT NEW BATHYMETRY WAYPOINT
                </span>
                <button
                  onClick={() => setShowAddWaypointModal(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem('wpName') as HTMLInputElement).value;
                  const grade = (form.elements.namedItem('wpGrade') as HTMLSelectElement).value;
                  const tons = parseFloat((form.elements.namedItem('wpTons') as HTMLInputElement).value) || 12;
                  handleCreateWaypoint(name, grade, tons);
                }}
                className="py-3 space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Coordinates:</label>
                  <input
                    type="text"
                    disabled
                    value={`X: ${newWpCoords.x}m, Y: ${newWpCoords.y}m (Est. Depth: -4,180m)`}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Waypoint Identifier:</label>
                  <input
                    name="wpName"
                    defaultValue={`WP-0${waypoints.length + 1}`}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Deposit Geological Grade:</label>
                  <select
                    name="wpGrade"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Grade-A Prime (32% Mn)">Grade-A Prime (32% Mn)</option>
                    <option value="Cobalt-Enriched Crust Bed">Cobalt-Enriched Crust Bed</option>
                    <option value="Nickel-Rich Sediment Silt">Nickel-Rich Sediment Silt</option>
                    <option value="Basaltic Outcrop Margin">Basaltic Outcrop Margin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Estimated Nodule Yield (Tons):</label>
                  <input
                    name="wpTons"
                    type="number"
                    defaultValue="16.5"
                    step="0.5"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddWaypointModal(false)}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Add Waypoint
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 3: SYSTEM AUDIT & SECURITY ACCESS LOGS */}
        {/* ==================================================================== */}
        {showDiagnosticsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0F172A] border border-slate-700 rounded-lg max-w-lg w-full p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  INSTITUTIONAL SYSTEM AUDIT & ACCESS LOGS
                </span>
                <button
                  onClick={() => setShowDiagnosticsModal(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs font-mono text-slate-300 max-h-[350px] overflow-y-auto">
                <div className="p-2 rounded bg-[#0B0F17] border border-slate-800 text-[11px] space-y-1">
                  <div className="text-cyan-400 font-bold">[02:14:02 UTC] AUTH: TOKEN VERIFIED</div>
                  <div className="text-slate-400">Caller: gcoinstash@gmail.com // ROLE: PRINCIPAL ARCHITECT</div>
                  <div className="text-slate-500">Security Clearance: LEVEL 4 - ABYSSAL DEEP-SEA AUTHORIZATION</div>
                </div>

                <div className="p-2 rounded bg-[#0B0F17] border border-slate-800 text-[11px] space-y-1">
                  <div className="text-emerald-400 font-bold">[02:12:44 UTC] CANOPEN SERVO INTEGRITY: 100%</div>
                  <div className="text-slate-400">6/6 Axis encoders calibrated. Zero slip detected on tracked chassis.</div>
                </div>

                <div className="p-2 rounded bg-[#0B0F17] border border-slate-800 text-[11px] space-y-1">
                  <div className="text-amber-400 font-bold">[02:10:15 UTC] HYDROSTATIC SEAL TRANSDUCERS</div>
                  <div className="text-slate-400">Atmospheric chamber 1: 1.01 atm (Hermetic). Vacuum suction: -84.2 kPa.</div>
                </div>

                <div className="p-2 rounded bg-[#0B0F17] border border-slate-800 text-[11px] space-y-1">
                  <div className="text-cyan-400 font-bold">[02:08:33 UTC] USBL ACOUSTIC REPEATER HANDSHAKE</div>
                  <div className="text-slate-400">Surface vessel R/V GHOST VANGUARD positioned at +14.28° N, -125.64° W.</div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowDiagnosticsModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Close Diagnostic View
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <SubseaCrawlerOps />
    </>
  );
}
