/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OCEANUS-ICE TETHER RIG // CRYOBOT PROBE CR-07 [SUB-OCEAN PENETRATOR]
 * Flagship Institutional Sub-Ice Deep-Submergence Robotics Control Deck
 */

import React, { useState, useEffect, useId } from 'react';
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowDown,
  ArrowUp,
  BatteryCharging,
  Bell,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  Download,
  Flame,
  Gauge,
  Globe,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Power,
  Radio,
  RefreshCw,
  RotateCw,
  Search,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  Thermometer,
  Unlock,
  Volume2,
  VolumeX,
  Waves,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';

// ============================================================================
// Types & Internationalization Dictionaries
// ============================================================================

export type OperatorRole = 
  | 'mission_director'
  | 'rov_lead_pilot'
  | 'biogeochemist_specialist'
  | 'flight_engineer';

export type Language = 'EN' | 'NO' | 'JA' | 'FR';

export interface TelemetryState {
  depth: number; // meters
  pressure: number; // MPa
  corePower: number; // kW
  tetherPayout: number; // meters
  tetherTension: number; // kN
  coreTemp: number; // Celsius
  cartridgeTemps: [number, number, number, number]; // C
  busVoltage: number; // V
  fiberAttenuation: number; // dB/km
  pumpFlowRate: number; // L/min
  pumpRpm: number;
  pumpDeltaP: number; // bar
  bladderVolume: number; // L (max 40)
  pistonPressure: number; // bar
  ch4: number; // nmol/L
  h2: number; // umol/kg
  pH: number;
  salinity: number; // PSU
  dissolvedO2: number; // umol/L
  orp: number; // mV
  turbidity: number; // FNU
  iceClosureRate: number; // mm/hr
}

export interface ScienceBay {
  id: number;
  volumeMl: number;
  capacityMl: number;
  status: 'empty_purged' | 'sampling_active' | 'sealed_refrigerated';
  depthMeters?: number;
  salinityPsu?: number;
  ch4Nmol?: number;
  timestamp?: string;
}

export interface AlertRecord {
  id: string;
  subsystem: string;
  severity: 'nominal' | 'advisory' | 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  value: string;
  threshold: string;
  time: string;
  acknowledged: boolean;
}

export interface WaypointZone {
  id: string;
  name: string;
  depthRange: [number, number];
  color: string;
  ambientTemp: string;
  iceRegime: string;
  recommendedThrottleKw: number;
  cavitationRequired: boolean;
}

const WAYPOINTS: WaypointZone[] = [
  {
    id: 'wp-surface',
    name: 'Surface Firn & Brittle Shell',
    depthRange: [0, 2000],
    color: '#38bdf8',
    ambientTemp: '-165°C to -85°C',
    iceRegime: 'Brittle Polycrystalline Ice I',
    recommendedThrottleKw: 140,
    cavitationRequired: false,
  },
  {
    id: 'wp-ductile',
    name: 'Ductile Convective & Brine Veins',
    depthRange: [2000, 8500],
    color: '#06b6d4',
    ambientTemp: '-42°C to -12°C',
    iceRegime: 'Plastic Warm Ice / Saline Slush',
    recommendedThrottleKw: 185,
    cavitationRequired: true,
  },
  {
    id: 'wp-ingress',
    name: 'Sub-Ice Ceiling / Ocean Ingress',
    depthRange: [8500, 11200],
    color: '#2dd4bf',
    ambientTemp: '-3.2°C to 0.5°C',
    iceRegime: 'Basal Frazil Melt Slurry',
    recommendedThrottleKw: 210,
    cavitationRequired: true,
  },
  {
    id: 'wp-abyssal',
    name: 'Sub-Surface Liquid Abyssal Plain',
    depthRange: [11200, 18500],
    color: '#0ea5e9',
    ambientTemp: '+1.8°C to +4.0°C',
    iceRegime: 'Hyper-Saline Free Ocean Column',
    recommendedThrottleKw: 60,
    cavitationRequired: false,
  },
  {
    id: 'wp-vents',
    name: 'Benthic Hydrothermal Vent Floor',
    depthRange: [18500, 20000],
    color: '#f97316',
    ambientTemp: '+84.5°C Plume Exudate',
    iceRegime: 'Basalt Serpentinization Field',
    recommendedThrottleKw: 45,
    cavitationRequired: false,
  },
];

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  EN: {
    hubTitle: 'OCEANUS-ICE TETHER RIG // CRYOBOT PROBE CR-07 [SUB-OCEAN PENETRATOR]',
    depthLabel: 'OCEAN DEPTH',
    pressureLabel: 'AMBIENT PRESSURE',
    thermalPowerLabel: 'THERMAL CORE POWER',
    tetherPayoutLabel: 'TETHER PAYOUT',
    coreTempLabel: 'CORE MELT TEMP',
    guillotineSwitch: 'EMERGENCY GUILLOTINE CUTTER',
    statusNominal: 'SYSTEM NOMINAL',
    statusWarning: 'THERMAL DELTA EXCURSION',
    statusCritical: 'HIGH ACIDITY PLUME',
    iceProfileHeader: '2D VERTICAL ICE COLUMN & PENETRATION PROFILE',
    telemetryHeader: 'POWER & FIBER-OPTIC TELEMETRY DIAGNOSTICS',
    scienceHeader: 'SCIENCE PAYLOAD MANIFEST & VENT WATER CHEMISTRY LEDGER',
    predictiveHeader: 'PREDICTIVE STRUCTURAL HEALTH & BOREHOLE CLOSURE HEURISTICS',
    niskinTrigger: 'TRIGGER NISKIN BOTTLE',
    flushNozzles: 'FLUSH CAVITATION NOZZLES',
    pulseTransponder: 'PULSE ACOUSTIC TRANSPONDER',
    exportCsv: 'EXPORT DIAGNOSTIC CSV',
    offlineMode: 'OFFLINE EDGE MODE',
    onlineRelay: 'ORBITAL RELAY SYNCED',
  },
  NO: {
    hubTitle: 'OCEANUS-IS KABELRIGG // KRYOBOT SONDE CR-07 [DYPHAVSPENETRATOR]',
    depthLabel: 'HAVDYP',
    pressureLabel: 'OMGIVELSESTRYKK',
    thermalPowerLabel: 'TERMISK KJERNEEFFEKT',
    tetherPayoutLabel: 'KABELLENGDE UTLAGT',
    coreTempLabel: 'SMELTEKJERNETEMP',
    guillotineSwitch: 'NØDKUTTER FOR HOVEDKABEL',
    statusNominal: 'SYSTEM NOMINELLT',
    statusWarning: 'TERMISK AVVIK',
    statusCritical: 'HØY SYREINNHOLD I DYPET',
    iceProfileHeader: '2D VERTIKAL ISPROFIL & PENETRASJONSSTATUS',
    telemetryHeader: 'KRAFTDISTRIBUSJON & FIBEROPTISK DIAGNOSTIKK',
    scienceHeader: 'VITENSKAPELIGE SENSORER & VANNKJEMI-JOURNAL',
    predictiveHeader: 'PREDIKTIV SLITASJE OG BORHULLSLUKKING',
    niskinTrigger: 'UTLØS NISKIN-FLASKE',
    flushNozzles: 'SPYL KAVITASJONSDYSER',
    pulseTransponder: 'SEND AKUSTISK TRANSPONDER-PULS',
    exportCsv: 'EKSPORTER CSV-LOGG',
    offlineMode: 'LOKAL KANTMODUS (FRAKOBLET)',
    onlineRelay: 'SATELLITTFORBINDELSE AKTIV',
  },
  JA: {
    hubTitle: 'OCEANUS 氷殻テザー探査リグ // クライオボット CR-07 [深海貫通型ROV]',
    depthLabel: '深海深度',
    pressureLabel: '静水圧',
    thermalPowerLabel: '熱溶融コア出力',
    tetherPayoutLabel: 'テザー繰出長',
    coreTempLabel: '溶融ヘッドコア温度',
    guillotineSwitch: '非常用テザーギロチン切断スイッチ',
    statusNominal: '全系正常',
    statusWarning: '熱カートリッジ偏差警告',
    statusCritical: '熱水噴出孔酸性ブルーム検出',
    iceProfileHeader: '2次元鉛直氷殻断面 & 貫通プロファイル',
    telemetryHeader: '高圧電力供給 & 光ファイバー通信診断',
    scienceHeader: '科学観測ペイロード & 噴出孔水質化学台帳',
    predictiveHeader: 'ボアホール氷閉塞予測 & 予知保全アナリティクス',
    niskinTrigger: 'ニスキン採水器をトリガー',
    flushNozzles: 'キャビテーションノズル洗浄噴射',
    pulseTransponder: '音響測位トランスポンダ発信',
    exportCsv: '診断ログCSV出力',
    offlineMode: 'オフライン自律記録モード',
    onlineRelay: '軌道通信衛星リンク同期中',
  },
  FR: {
    hubTitle: 'OCEANUS PLATEFORME GLACE-TÉLÉMÉTRIE // CRYOBOT CR-07 [PÉNÉTRATEUR ABYSSAL]',
    depthLabel: 'PROFONDEUR OCÉAN',
    pressureLabel: 'PRESSION AMBIANTE',
    thermalPowerLabel: 'PUISSANCE DU CŒUR THERMIQUE',
    tetherPayoutLabel: 'DÉROULEMENT DU CÂBLE',
    coreTempLabel: 'TEMPÉRATURE DU CŒUR',
    guillotineSwitch: 'GUILLOTINE DE CÂBLE D’URGENCE',
    statusNominal: 'SYSTÈME NOMINAL',
    statusWarning: 'DÉRIVE THERMIQUE CARTOUCHE',
    statusCritical: 'PLUME HYDROTHERMALE ACIDE',
    iceProfileHeader: 'PROFIL VERTICAL 2D DU GLACIER & PÉNÉTRATION',
    telemetryHeader: 'DISTRIBUTION DE PUISSANCE & TÉLÉMÉTRIE FIBRE',
    scienceHeader: 'REGISTRE DES INSTRUMENTS & CHIMIE DES FLUIDES',
    predictiveHeader: 'ANALYTIQUE PRÉDICTIVE & HEURISTIQUE DE FERMETURE',
    niskinTrigger: 'DÉCLENCHER BOUTEILLE NISKIN',
    flushNozzles: 'PURGER BUSES DE CAVITATION',
    pulseTransponder: 'PULSER TRANSPONDEUR ACOUSTIQUE',
    exportCsv: 'EXPORTER DIAGNOSTICS CSV',
    offlineMode: 'MODE AUTONOME HORS-LIGNE',
    onlineRelay: 'LIAISON RELAIS ORBITAL ACTIVE',
  },
};

// ============================================================================
// Main Flagship Component: SubseaCryoDrillControl
// ============================================================================

export function SubseaCryoDrillControl() {
  const gradientId = useId();
  // Mission Operational State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineBufferCount, setOfflineBufferCount] = useState<number>(0);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('EN');
  const [currentRole, setCurrentRole] = useState<OperatorRole>('rov_lead_pilot');
  const [activeTab, setActiveTab] = useState<'deck' | 'science' | 'power' | 'analytics' | 'collab'>('deck');

  // Keyed Safety Arming State for Emergency Guillotine
  const [isGuillotineArmed, setIsGuillotineArmed] = useState<boolean>(false);
  const [showGuillotineModal, setShowGuillotineModal] = useState<boolean>(false);
  const [guillotineCountdown, setGuillotineCountdown] = useState<number | null>(null);
  const [isGuillotineSevered, setIsGuillotineSevered] = useState<boolean>(false);

  // Active Interactive Triggers & Modals
  const [showNiskinModal, setShowNiskinModal] = useState<boolean>(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string>('wp-ductile');
  const [isFlushingNozzles, setIsFlushingNozzles] = useState<boolean>(false);
  const [isTransponderPulsing, setIsTransponderPulsing] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'alert' } | null>(null);

  // High-Density Telemetry State
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    depth: 4120.4,
    pressure: 41.2,
    corePower: 185.0,
    tetherPayout: 5240.8,
    tetherTension: 16.6,
    coreTemp: 320.4,
    cartridgeTemps: [320.0, 318.5, 325.2, 317.1],
    busVoltage: 399.8,
    fiberAttenuation: 0.185,
    pumpFlowRate: 142.5,
    pumpRpm: 3450,
    pumpDeltaP: 4.2,
    bladderVolume: 24.8,
    pistonPressure: 385.0,
    ch4: 895.0,
    h2: 108.4,
    pH: 4.12,
    salinity: 35.75,
    dissolvedO2: 0.45,
    orp: -540,
    turbidity: 5.85,
    iceClosureRate: 3.2,
  });

  // Telemetry Sparkline Buffers (last 24 points)
  const [voltageHistory, setVoltageHistory] = useState<number[]>([
    400, 399.8, 400.1, 400.2, 399.7, 399.9, 400.0, 400.1, 399.8, 399.7,
    400.3, 400.0, 399.9, 400.1, 399.6, 400.0, 400.2, 399.8, 400.1, 399.7,
    399.9, 400.0, 399.8, 399.8
  ]);

  const [tensionHistory, setTensionHistory] = useState<number[]>([
    16.1, 16.2, 16.3, 16.1, 16.4, 16.5, 16.4, 16.6, 16.7, 16.5,
    16.6, 16.8, 16.5, 16.7, 16.6, 16.8, 16.7, 16.9, 16.6, 16.7,
    16.5, 16.8, 16.6, 16.6
  ]);

  const [methaneHistory, setMethaneHistory] = useState<number[]>([
    420, 480, 520, 560, 610, 680, 710, 740, 770, 810,
    830, 850, 865, 875, 882, 888, 892, 895, 894, 896,
    893, 897, 895, 895
  ]);

  // Science Niskin Carousel (8 bays)
  const [niskinBays, setNiskinBays] = useState<ScienceBay[]>([
    { id: 1, volumeMl: 750, capacityMl: 750, status: 'sealed_refrigerated', depthMeters: 3200, salinityPsu: 34.8, ch4Nmol: 310, timestamp: '10-04 00:15 UTC' },
    { id: 2, volumeMl: 750, capacityMl: 750, status: 'sealed_refrigerated', depthMeters: 4050, salinityPsu: 35.2, ch4Nmol: 680, timestamp: '10-04 01:45 UTC' },
    { id: 3, volumeMl: 410, capacityMl: 750, status: 'sampling_active', depthMeters: 4120, salinityPsu: 35.7, ch4Nmol: 895, timestamp: 'LIVE SAMPLING' },
    { id: 4, volumeMl: 0, capacityMl: 750, status: 'empty_purged' },
    { id: 5, volumeMl: 0, capacityMl: 750, status: 'empty_purged' },
    { id: 6, volumeMl: 0, capacityMl: 750, status: 'empty_purged' },
    { id: 7, volumeMl: 0, capacityMl: 750, status: 'empty_purged' },
    { id: 8, volumeMl: 0, capacityMl: 750, status: 'empty_purged' },
  ]);

  // Active Alerts Ledger
  const [alerts, setAlerts] = useState<AlertRecord[]>([
    {
      id: 'ALT-8821',
      subsystem: 'THERMAL_BANK',
      severity: 'warning',
      title: 'Cartridge 3 Delta Excursion',
      message: 'Cartridge 3 running +5.2°C above array centroid due to basal silicate friction.',
      value: '325.2°C',
      threshold: '> 323.0°C',
      time: '02:18:44 UTC',
      acknowledged: false,
    },
    {
      id: 'ALT-8819',
      subsystem: 'VENT_CHEMISTRY',
      severity: 'critical',
      title: 'Acidic Plume Boundary Crossing',
      message: 'Abyssal pH plunged to 4.12; extreme H2 exudate (108.4 μmol/kg) detected.',
      value: '4.12 pH',
      threshold: '< 4.50 pH',
      time: '02:12:10 UTC',
      acknowledged: false,
    },
    {
      id: 'ALT-8804',
      subsystem: 'TETHER_TELEMETRY',
      severity: 'nominal',
      title: 'Fiber Loss Nominal Across 5.24 km',
      message: '1550nm return link loss stable at 0.185 dB/km. Full HD sub-ice imagery locked.',
      value: '0.185 dB/km',
      threshold: '< 0.250 dB/km',
      time: '01:55:00 UTC',
      acknowledged: true,
    },
  ]);

  // Collaborative Mission Notes
  const [collabNotes, setCollabNotes] = useState<Array<{ id: string; author: string; role: string; text: string; time: string }>>([
    {
      id: 'note-1',
      author: 'Dr. Elena Vance',
      role: 'Mission Director',
      text: 'Borehole stable. Penetrator CR-07 encountering active serpentine hydrothermal flow at 4,120 m. Prioritize Niskin Bay 3 fill.',
      time: '02:05 UTC',
    },
    {
      id: 'note-2',
      author: 'Commander Kai Thorne',
      role: 'Lead Pilot',
      text: 'Tether tension rippling between 16.4 and 16.8 kN. Capstan winch compensator active. Cavitation nozzles ready for basal crust punch.',
      time: '02:16 UTC',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState<string>('');

  const t = TRANSLATIONS[language];

  // ============================================================================
  // Realistic Tick Loop: Telemetry Drift, Tension Ripple, Depth Progression
  // ============================================================================
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Subtle drift simulation
        const depthDelta = isGuillotineSevered ? -0.4 : 0.08; // ascent if severed, descent if normal
        const newDepth = Math.max(10, Number((prev.depth + depthDelta).toFixed(2)));
        const newPressure = Number((newDepth * 0.01001).toFixed(2));
        const tensionJitter = (Math.random() - 0.49) * 0.25;
        const newTension = Math.max(5.0, Number((prev.tetherTension + tensionJitter).toFixed(2)));
        const voltageJitter = (Math.random() - 0.5) * 0.3;
        const newVoltage = Number((400 + voltageJitter).toFixed(1));
        const methaneDrift = (Math.random() - 0.45) * 3.5;
        const newMethane = Math.max(100, Number((prev.ch4 + methaneDrift).toFixed(1)));
        const h2Drift = (Math.random() - 0.48) * 0.6;
        const newH2 = Math.max(10, Number((prev.h2 + h2Drift).toFixed(1)));
        const phDrift = (Math.random() - 0.5) * 0.02;
        const newPh = Math.max(2.8, Math.min(8.2, Number((prev.pH + phDrift).toFixed(2))));

        // Cartridge 3 slight fluctuation
        const c3 = Number((325.0 + (Math.random() - 0.4) * 0.8).toFixed(1));
        const c1 = Number((320.0 + (Math.random() - 0.5) * 0.4).toFixed(1));
        const c2 = Number((318.5 + (Math.random() - 0.5) * 0.4).toFixed(1));
        const c4 = Number((317.1 + (Math.random() - 0.5) * 0.4).toFixed(1));

        return {
          ...prev,
          depth: newDepth,
          pressure: newPressure,
          tetherPayout: isGuillotineSevered ? prev.tetherPayout : Number((prev.tetherPayout + 0.08).toFixed(1)),
          tetherTension: newTension,
          busVoltage: newVoltage,
          ch4: newMethane,
          h2: newH2,
          pH: newPh,
          cartridgeTemps: [c1, c2, c3, c4],
        };
      });

      // Update history arrays
      setVoltageHistory((prev) => [...prev.slice(1), Number((400 + (Math.random() - 0.5) * 0.3).toFixed(1))]);
      setTensionHistory((prev) => [...prev.slice(1), Number((16.5 + (Math.random() - 0.5) * 0.4).toFixed(2))]);
      setMethaneHistory((prev) => [...prev.slice(1), Number((895 + (Math.random() - 0.5) * 10).toFixed(1))]);

      // Handle offline buffer
      if (isOffline) {
        setOfflineBufferCount((c) => c + 1);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, isOffline, isGuillotineSevered]);

  // Toast auto-clear
  useEffect(() => {
    if (!notificationToast) return;
    const timer = setTimeout(() => setNotificationToast(null), 4000);
    return () => clearTimeout(timer);
  }, [notificationToast]);

  // Emergency Guillotine Countdown Handler
  useEffect(() => {
    if (guillotineCountdown === null) return;
    if (guillotineCountdown <= 0) {
      setIsGuillotineSevered(true);
      setShowGuillotineModal(false);
      setGuillotineCountdown(null);
      setNotificationToast({
        type: 'alert',
        message: 'EMERGENCY SEVER INITIATED: Optical tether pyrotechnic bolt fired. Cryobot probe CR-07 transitioning to autonomous ascent ballast release!',
      });
      return;
    }
    const timer = setTimeout(() => {
      setGuillotineCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [guillotineCountdown]);

  // ============================================================================
  // Action Handlers
  // ============================================================================

  const handleArmGuillotineToggle = () => {
    if (currentRole !== 'mission_director' && currentRole !== 'rov_lead_pilot') {
      setNotificationToast({
        type: 'warning',
        message: 'PERMISSION DENIED: Guillotine arming requires Mission Director or Lead Pilot clearance (Level 4+).',
      });
      return;
    }
    setIsGuillotineArmed((prev) => !prev);
  };

  const handleExecuteGuillotine = () => {
    if (!isGuillotineArmed) {
      setNotificationToast({
        type: 'warning',
        message: 'SAFETY INTERLOCK ENGAGED: Rotate physical key switch to ARMED before firing guillotine.',
      });
      return;
    }
    setShowGuillotineModal(true);
    setGuillotineCountdown(5);
  };

  const handleCancelGuillotine = () => {
    setShowGuillotineModal(false);
    setGuillotineCountdown(null);
    setNotificationToast({
      type: 'info',
      message: 'ABORT CONFIRMED: Tether guillotine ignition sequence terminated. Optical link intact.',
    });
  };

  const handleNiskinTrigger = () => {
    const activeIndex = niskinBays.findIndex((b) => b.status === 'sampling_active');
    if (activeIndex === -1) {
      const emptyIndex = niskinBays.findIndex((b) => b.status === 'empty_purged');
      if (emptyIndex === -1) {
        setNotificationToast({
          type: 'warning',
          message: 'NISKIN CAROUSEL FULL: All 8 sample bays are sealed. Return to docking sleeve required.',
        });
        return;
      }
      // Activate next empty
      setNiskinBays((prev) =>
        prev.map((b, idx) =>
          idx === emptyIndex
            ? { ...b, status: 'sampling_active', depthMeters: telemetry.depth, timestamp: 'SAMPLING...' }
            : b
        )
      );
      setNotificationToast({
        type: 'success',
        message: `NISKIN BAY #${emptyIndex + 1} ACTUATED: Hydraulic valve opened for abyssal fluid collection.`,
      });
    } else {
      // Seal currently active bay and advance
      setNiskinBays((prev) =>
        prev.map((b, idx) =>
          idx === activeIndex
            ? {
                ...b,
                status: 'sealed_refrigerated',
                volumeMl: 750,
                salinityPsu: telemetry.salinity,
                ch4Nmol: telemetry.ch4,
                timestamp: new Date().toISOString().replace('T', ' ').slice(5, 16) + ' UTC',
              }
            : b
        )
      );
      setNotificationToast({
        type: 'success',
        message: `NISKIN BAY #${activeIndex + 1} HERMETICALLY SEALED: Refrigerated at +1.8°C sample lock.`,
      });
    }
    setShowNiskinModal(false);
  };

  const handleFlushCavitation = () => {
    setIsFlushingNozzles(true);
    setNotificationToast({
      type: 'info',
      message: 'CAVITATION JET FLUSH: 450 bar pulsed de-ionized water purging debris from melt-head micro-orifices.',
    });
    setTimeout(() => {
      setIsFlushingNozzles(false);
      setNotificationToast({
        type: 'success',
        message: 'NOZZLE PURGE COMPLETE: Forward thermal conductivity restored to 100%. Differential pressure nominal.',
      });
    }, 2500);
  };

  const handlePulseTransponder = () => {
    setIsTransponderPulsing(true);
    setNotificationToast({
      type: 'info',
      message: 'ACOUSTIC TRANSPONDER PING: 12.5 kHz ultra-short baseline (USBL) chirp broadcast to surface ice array.',
    });
    setTimeout(() => {
      setIsTransponderPulsing(false);
      setNotificationToast({
        type: 'success',
        message: 'ACOUSTIC RANGE FIX CONFIRMED: Slant range 4,142.6 m | Horizontal offset 14.2 m | Beacon 3-D lock.',
      });
    }, 2000);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, acknowledged: true } : alt))
    );
    setNotificationToast({
      type: 'info',
      message: `ALERT ACKNOWLEDGED: Diagnostic record ${id} logged by ${currentRole.toUpperCase()}.`,
    });
  };

  const handleAddCollabNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const authorNames: Record<OperatorRole, string> = {
      mission_director: 'Dr. Elena Vance',
      rov_lead_pilot: 'Commander Kai Thorne',
      biogeochemist_specialist: 'Dr. Astrid Lindholm',
      flight_engineer: 'Lt. Marcus Chen',
    };
    const roleLabels: Record<OperatorRole, string> = {
      mission_director: 'Mission Director',
      rov_lead_pilot: 'ROV Lead Pilot',
      biogeochemist_specialist: 'Biogeochemist',
      flight_engineer: 'Flight Engineer',
    };
    const newEntry = {
      id: `note-${Date.now()}`,
      author: authorNames[currentRole],
      role: roleLabels[currentRole],
      text: newNoteText.trim(),
      time: new Date().toISOString().replace('T', ' ').slice(11, 16) + ' UTC',
    };
    setCollabNotes((prev) => [newEntry, ...prev]);
    setNewNoteText('');
    setNotificationToast({
      type: 'success',
      message: 'MISSION LOG BROADCAST: Entry shared to all distributed console displays.',
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'Timestamp_ISO',
      'Depth_Meters',
      'Pressure_MPa',
      'Core_Power_kW',
      'Tether_Payout_m',
      'Tether_Tension_kN',
      'Core_Temp_C',
      'Cartridge1_C',
      'Cartridge2_C',
      'Cartridge3_C',
      'Cartridge4_C',
      'Bus_Voltage_V',
      'Fiber_Attenuation_dB_km',
      'Dissolved_Methane_nmol_L',
      'Dissolved_H2_umol_kg',
      'pH_Level',
      'Salinity_PSU',
    ];

    const now = new Date().toISOString();
    const rows = [
      [
        now,
        telemetry.depth,
        telemetry.pressure,
        telemetry.corePower,
        telemetry.tetherPayout,
        telemetry.tetherTension,
        telemetry.coreTemp,
        ...telemetry.cartridgeTemps,
        telemetry.busVoltage,
        telemetry.fiberAttenuation,
        telemetry.ch4,
        telemetry.h2,
        telemetry.pH,
        telemetry.salinity,
      ],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OCEANUS_CR07_TELEMETRY_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationToast({
      type: 'success',
      message: 'DIAGNOSTIC CSV EXPORTED: High-resolution telemetry packet archived to operator terminal.',
    });
  };

  const handleWaypointSelect = (wp: WaypointZone) => {
    setSelectedWaypoint(wp.id);
    setTelemetry((prev) => ({
      ...prev,
      depth: wp.depthRange[0] + 50,
      corePower: wp.recommendedThrottleKw,
    }));
    setNotificationToast({
      type: 'info',
      message: `WAYPOINT RE-TARGETED: Cryobot auto-throttling to ${wp.recommendedThrottleKw} kW for ${wp.name}.`,
    });
  };

  // Helper for sparkline paths
  const renderSparkline = (data: number[], color: string, height: number = 36) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 140;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-9 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#02050B] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* ==================================================================== */}
        {/* Top Operational Status Banner & Role Bar */}
        {/* ==================================================================== */}
        <header className="border-b border-slate-800/80 bg-[#09101D]/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
          <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-1">
            
            {/* Facility Hub Callout Title */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0">
                <Gauge className="w-6 h-6 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider text-slate-100 leading-snug">
                  OCEANUS-ICE TETHER RIG // CRYOBOT CR-07 <span className="text-cyan-400 text-sm md:text-base font-bold">[SUB-OCEAN PENETRATOR]</span>
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SUB-ICE DOCK LINKED
                  </span>
                  <span>•</span>
                  <span>PWYLL CRATER BOREHOLE #4</span>
                  <span>•</span>
                  <span className="text-cyan-300">TETHER BUS: 3,000V AC</span>
                </div>
              </div>
            </div>

            {/* Command & Action Ribbon Alignment: uniform height h-8 md:h-9 with matching border styling */}
            <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0">
              
              {/* Language Selector Pills */}
              <div className="h-8 md:h-9 flex items-center bg-slate-900 border border-slate-700 rounded-md p-0.5 text-xs font-mono">
                {(['EN', 'NO', 'JA', 'FR'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`h-full px-2.5 flex items-center justify-center rounded transition-colors ${
                      language === lang
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Operator Badge / Role-Based Authentication Selector */}
              <div className="h-8 md:h-9 flex items-center bg-slate-900 border border-slate-700 rounded-md px-2.5 gap-1.5 text-xs font-mono">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-400 uppercase hidden sm:inline">Clearance:</span>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as OperatorRole)}
                  className="bg-transparent text-slate-200 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="mission_director" className="bg-slate-900 text-slate-200">DIR // Dr. Vance (Lvl 5)</option>
                  <option value="rov_lead_pilot" className="bg-slate-900 text-slate-200">PILOT // Cmdr. Thorne (Lvl 4)</option>
                  <option value="biogeochemist_specialist" className="bg-slate-900 text-slate-200">CHEM // Dr. Lindholm (Lvl 4)</option>
                  <option value="flight_engineer" className="bg-slate-900 text-slate-200">ENG // Lt. Chen (Lvl 4)</option>
                </select>
              </div>

              {/* Relay Toggle / Offline Edge Mode */}
              <button
                onClick={() => {
                  setIsOffline(!isOffline);
                  if (isOffline) {
                    setNotificationToast({
                      type: 'success',
                      message: `EDGE SYNC RESTORED: ${offlineBufferCount} telemetry frames successfully synchronized to ground stations.`,
                    });
                    setOfflineBufferCount(0);
                  } else {
                    setNotificationToast({
                      type: 'warning',
                      message: 'OFFLINE EDGE MODE ACTIVATED: Telemetry caching to local solid-state partition.',
                    });
                  }
                }}
                className={`h-8 md:h-9 flex items-center gap-1.5 px-3 rounded-md border text-xs font-mono font-bold transition-all ${
                  isOffline
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5 shrink-0" /> : <Wifi className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                <span>{isOffline ? `OFFLINE (${offlineBufferCount})` : 'RELAY ON'}</span>
              </button>

              {/* Real-time Play/Pause Stream Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-8 md:h-9 flex items-center gap-1.5 px-2.5 rounded-md border text-xs font-mono font-bold transition-all ${
                  isPlaying
                    ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-slate-600'
                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                }`}
                title={isPlaying ? 'Pause telemetry stream' : 'Resume live feed'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
                <span className="hidden sm:inline">{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
              </button>

              {/* Audio Chime Mute */}
              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="h-8 md:h-9 w-8 md:w-9 flex items-center justify-center rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                title={audioMuted ? 'Unmute alerts' : 'Mute alert chimes'}
              >
                {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCsv}
                className="h-8 md:h-9 flex items-center gap-1.5 px-3 rounded-md bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 text-xs font-mono font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{t.exportCsv}</span>
                <span className="md:hidden">CSV</span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Toast Notification */}
        {notificationToast && (
          <div className="fixed top-16 right-4 z-50 max-w-md animate-in slide-in-from-top-2 duration-200">
            <div
              className={`flex items-start gap-3 p-3 rounded-lg border shadow-xl backdrop-blur-md ${
                notificationToast.type === 'alert'
                  ? 'bg-red-950/95 border-red-500 text-red-200 shadow-red-900/30'
                  : notificationToast.type === 'warning'
                  ? 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-amber-900/30'
                  : notificationToast.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 shadow-emerald-900/30'
                  : 'bg-slate-900/95 border-cyan-500 text-cyan-200 shadow-cyan-900/30'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-mono">
                <p className="font-bold">{notificationToast.message}</p>
              </div>
              <button
                onClick={() => setNotificationToast(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PANE 1: TOP ABYSSAL DEPTH & MELT-HEAD HUD */}
        {/* ==================================================================== */}
        <section className="border-b border-slate-800 bg-[#060B16] px-4 py-4">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-3">
              
              {/* Telemetry Metric: Ocean Depth */}
              <div className="mt-3 bg-[#0B1325] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ArrowDown className="w-4 h-4 text-cyan-400" />
                    {t.depthLabel}
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                    ABYSSAL
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.depth.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm font-bold font-mono text-cyan-400">m</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>DESCENT VELOCITY</span>
                  <span className="text-emerald-400 font-bold">+28.8 m/hr</span>
                </div>
              </div>

              {/* Telemetry Metric: Hydrostatic Pressure */}
              <div className="mt-3 bg-[#0B1325] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    {t.pressureLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    HULL LOAD
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.pressure.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm font-bold font-mono text-cyan-400">MPa</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>EQUIVALENT</span>
                  <span className="text-slate-300 font-bold">{(telemetry.pressure * 9.869).toFixed(0)} atm</span>
                </div>
              </div>

              {/* Telemetry Metric: Thermal Melt Core Power */}
              <div className="mt-3 bg-[#0B1325] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-orange-500/40 transition-colors shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    {t.thermalPowerLabel}
                  </span>
                  <span className="text-[10px] text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-800">
                    ENTHALPY
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.corePower.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm font-bold font-mono text-orange-400">kW</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>THROTTLE INDEX</span>
                  <span className="text-orange-400 font-bold">{((telemetry.corePower / 250) * 100).toFixed(0)}% MAX</span>
                </div>
              </div>

              {/* Telemetry Metric: Tether Payout */}
              <div className="mt-3 bg-[#0B1325] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    {t.tetherPayoutLabel}
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                    WINCH SPINDLE
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.tetherPayout.toFixed(0)}
                  </span>
                  <span className="ml-1 text-sm font-bold font-mono text-cyan-400">m</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>DYNAMIC TENSION</span>
                  <span className="text-cyan-300 font-bold">{telemetry.tetherTension.toFixed(1)} kN</span>
                </div>
              </div>

              {/* Telemetry Metric: Core Temp */}
              <div className="mt-3 bg-[#0B1325] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-orange-500/40 transition-colors shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    {t.coreTempLabel}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                    STABLE
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.coreTemp.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm font-bold font-mono text-orange-400">°C</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>BANK 1-4 MEAN</span>
                  <span className="text-slate-300 font-bold">
                    {(telemetry.cartridgeTemps.reduce((a, b) => a + b, 0) / 4).toFixed(1)}°C
                  </span>
                </div>
              </div>

              {/* Emergency Guillotine Toggle Control Box */}
              <div
                className={`mt-3 rounded-lg p-3.5 flex flex-col justify-between border transition-all ${
                  isGuillotineSevered
                    ? 'bg-red-950/70 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : isGuillotineArmed
                    ? 'bg-red-950/30 border-red-500/70'
                    : 'bg-[#0B1325] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-red-400">
                    <ShieldAlert className="w-4 h-4" />
                    GUILLOTINE CUTTER
                  </span>
                  <button
                    onClick={handleArmGuillotineToggle}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border transition-colors ${
                      isGuillotineArmed
                        ? 'bg-red-600 text-white border-red-500 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isGuillotineArmed ? 'ARMED [UNLOCKED]' : 'SAFE [LOCKED]'}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-300 block">PYRO BOLT</span>
                    <span className={`text-[10px] font-mono ${isGuillotineSevered ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                      {isGuillotineSevered ? 'TETHER SEVERED' : isGuillotineArmed ? 'READY TO DETONATE' : 'CIRCUIT DISARMED'}
                    </span>
                  </div>
                  
                  {/* Physical Key Interlock Button */}
                  <button
                    disabled={isGuillotineSevered}
                    onClick={handleExecuteGuillotine}
                    className={`px-3 py-2 rounded font-mono text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                      isGuillotineSevered
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : isGuillotineArmed
                        ? 'bg-red-600 hover:bg-red-500 text-white border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:border-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isGuillotineSevered ? 'SEVERED' : 'FIRE CUTTER'}
                  </button>
                </div>

                <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>AUTONOMOUS RETURN:</span>
                  <span className="text-slate-200 font-bold">BALLAST DETACH READY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation for Extended Sub-Ice Diagnostics */}
        <nav className="bg-[#040812] border-b border-slate-800 px-4">
          <div className="max-w-[1920px] mx-auto flex items-center gap-1 sm:gap-2">
            {[
              { id: 'deck', label: 'OPERATIONS FLIGHT DECK', icon: Gauge },
              { id: 'science', label: 'SCIENCE & GEOCHEMISTRY', icon: Database },
              { id: 'power', label: 'POWER & OPTICAL BUS', icon: Zap },
              { id: 'analytics', label: 'PREDICTIVE ANALYTICS', icon: Sparkles },
              { id: 'collab', label: 'MISSION LOGS & NOTES', icon: Radio },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all ${
                    isActive
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ==================================================================== */}
        {/* MAIN BODY: 4-PANE ARCHITECTURE & OPERATIONAL SUB-PANELS */}
        {/* ==================================================================== */}
        <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 space-y-4">
          
          {/* Deck View: Contains Center-Left & Center-Right panes side-by-side */}
          {(activeTab === 'deck' || activeTab === 'power') && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* ============================================================== */}
              {/* PANE 2: CENTER-LEFT 2D VERTICAL ICE-COLUMN & PROBE CANVAS      */}
              {/* ============================================================== */}
              <div className="xl:col-span-7 bg-[#0B1325] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      {t.iceProfileHeader}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">WAYPOINT LOCK:</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {WAYPOINTS.find((w) => w.id === selectedWaypoint)?.name.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Waypoint Quick-Jump Selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3">
                  {WAYPOINTS.map((wp) => {
                    const isSelected = selectedWaypoint === wp.id;
                    return (
                      <button
                        key={wp.id}
                        onClick={() => handleWaypointSelect(wp)}
                        className={`p-2 rounded text-left border transition-all ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-slate-400">{wp.depthRange[0]}–{wp.depthRange[1]} m</div>
                        <div className="text-xs font-mono font-bold truncate text-slate-200">{wp.name}</div>
                        <div className="text-[10px] font-mono text-cyan-400">{wp.ambientTemp}</div>
                      </button>
                    );
                  })}
                </div>

                {/* 2D Interactive SVG Vertical Ice Profile Simulation */}
                <div className="relative w-full h-[400px] sm:h-[450px] bg-[#02050B] rounded-lg border border-slate-800/80 overflow-hidden my-2 flex">
                  
                  {/* Left Depth Ruler */}
                  <div className="w-14 sm:w-16 h-full bg-[#050B16] border-r border-slate-800 flex flex-col justify-between py-2 px-1 text-[10px] font-mono text-slate-500 select-none">
                    <span>0 km</span>
                    <span>2 km</span>
                    <span>4 km</span>
                    <span>8 km</span>
                    <span>12 km</span>
                    <span>16 km</span>
                    <span>20 km</span>
                  </div>

                  {/* SVG Canvas Profile */}
                  <div className="relative flex-1 h-full">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 450">
                      <defs>
                        {/* Cold Ice Gradient (0 - 45px = 0 - 2000m) */}
                        <linearGradient id="iceColdGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.3" />
                        </linearGradient>

                        {/* Convective Ductile Ice Gradient (45px - 190px = 2000 - 8500m) */}
                        <linearGradient id="iceDuctileGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.25" />
                        </linearGradient>

                        {/* Basal Ingress Slurry (190px - 250px = 8500 - 11200m) */}
                        <linearGradient id="iceSlushGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0e7490" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#155e75" stopOpacity="0.6" />
                        </linearGradient>

                        {/* Liquid Sub-Surface Ocean (250px - 410px = 11200 - 18500m) */}
                        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#022c22" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#020d1a" stopOpacity="0.9" />
                        </linearGradient>

                        {/* Hydrothermal Benthic Vent Floor (410px - 450px = 18500 - 20000m) */}
                        <linearGradient id="ventFloorGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#431407" stopOpacity="0.95" />
                        </linearGradient>

                        {/* Melt-head thermal glow filter */}
                        <radialGradient id="thermalGlow">
                          <stop offset="0%" stopColor="#ffedd5" stopOpacity="1" />
                          <stop offset="35%" stopColor="#f97316" stopOpacity="0.8" />
                          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      {/* Geological Layers */}
                      <rect x="0" y="0" width="600" height="45" fill="url(#iceColdGrad)" />
                      <line x1="0" y1="45" x2="600" y2="45" stroke="#38bdf8" strokeDasharray="3 3" opacity="0.3" />

                      <rect x="0" y="45" width="600" height="145" fill="url(#iceDuctileGrad)" />
                      <line x1="0" y1="190" x2="600" y2="190" stroke="#2dd4bf" strokeDasharray="3 3" opacity="0.3" />

                      <rect x="0" y="190" width="600" height="60" fill="url(#iceSlushGrad)" />
                      <line x1="0" y1="250" x2="600" y2="250" stroke="#06b6d4" strokeWidth="2" opacity="0.6" />

                      <rect x="0" y="250" width="600" height="160" fill="url(#oceanGrad)" />
                      <line x1="0" y1="410" x2="600" y2="410" stroke="#f97316" strokeDasharray="4 2" opacity="0.4" />

                      <rect x="0" y="410" width="600" height="40" fill="url(#ventFloorGrad)" />

                      {/* Layer Labels in Canvas */}
                      <text x="15" y="28" fill="#7dd3fc" fontSize="11" fontFamily="monospace" opacity="0.75">BRITTLE SHELL (0–2 km)</text>
                      <text x="15" y="110" fill="#5eead4" fontSize="11" fontFamily="monospace" opacity="0.75">CONVECTIVE BRINE VEIN SYSTEM (2–8.5 km)</text>
                      <text x="15" y="225" fill="#67e8f9" fontSize="11" fontFamily="monospace" opacity="0.75">ICE-OCEAN INTERFACE / BASAL CEILING (8.5–11.2 km)</text>
                      <text x="15" y="320" fill="#38bdf8" fontSize="11" fontFamily="monospace" opacity="0.75">ABYSSAL LIQUID OCEAN MATRIX (11.2–18.5 km)</text>
                      <text x="15" y="435" fill="#fdba74" fontSize="11" fontFamily="monospace" opacity="0.9">SERPENTINITE HYDROTHERMAL VENT FLOOR (18.5–20 km)</text>

                      {/* Hydrothermal Plumes on Floor */}
                      <path d="M 450 410 Q 440 370 470 330 Q 490 300 480 260" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" opacity="0.25" />
                      <path d="M 450 410 Q 440 370 470 330 Q 490 300 480 260" fill="none" stroke="#fdba74" strokeWidth="3" strokeDasharray="6 4" opacity="0.7" />

                      {/* Optical Tether Line from Surface down to Probe */}
                      {/* Depth mapped from 0..20,000m to 0..450px */}
                      {(() => {
                        const probeY = Math.min(420, Math.max(20, (telemetry.depth / 20000) * 450));
                        const probeX = 300;
                        return (
                          <>
                            {/* Tether wire */}
                            {!isGuillotineSevered ? (
                              <path
                                d={`M 300 0 Q ${295 + Math.sin(Date.now() / 400) * 4} ${probeY / 2} 300 ${probeY - 14}`}
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="2.5"
                                opacity="0.85"
                              />
                            ) : (
                              <path
                                d={`M 300 0 L 300 ${probeY / 3}`}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                opacity="0.6"
                              />
                            )}

                            {/* Acoustic Sonar Radial Wavefronts (Echo Sounding) */}
                            <circle
                              cx={probeX}
                              cy={probeY}
                              r={isTransponderPulsing ? 65 : 30}
                              fill="none"
                              stroke="#06b6d4"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              className={isTransponderPulsing ? 'animate-ping' : ''}
                              opacity={isTransponderPulsing ? 0.9 : 0.4}
                            />
                            <circle
                              cx={probeX}
                              cy={probeY}
                              r={isTransponderPulsing ? 110 : 55}
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="1"
                              strokeDasharray="2 4"
                              opacity={isTransponderPulsing ? 0.6 : 0.25}
                            />

                            {/* Thermal Melt Envelope & Cavitation Bubbles */}
                            <circle
                              cx={probeX}
                              cy={probeY + 12}
                              r="26"
                              fill="url(#thermalGlow)"
                            />

                            {/* Upward Cavitation Micro-Bubbles */}
                            <circle cx={probeX - 8} cy={probeY - 8} r="2" fill="#e0f2fe" opacity="0.8" />
                            <circle cx={probeX + 7} cy={probeY - 14} r="2.5" fill="#bae6fd" opacity="0.7" />
                            <circle cx={probeX - 4} cy={probeY - 24} r="1.5" fill="#e0f2fe" opacity="0.6" />
                            <circle cx={probeX + 10} cy={probeY - 32} r="2" fill="#7dd3fc" opacity="0.5" />

                            {/* Cryobot Probe Chassis CR-07 */}
                            <g transform={`translate(${probeX - 12}, ${probeY - 20})`}>
                              {/* Probe Hull */}
                              <rect x="6" y="0" width="12" height="34" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                              {/* Thermal Melt Nose Cone */}
                              <polygon points="6,34 12,42 18,34" fill="#f97316" stroke="#fdba74" strokeWidth="1" />
                              {/* Science Carousel Window */}
                              <circle cx="12" cy="18" r="3" fill="#22d3ee" />
                              {/* Stabilizer Fins */}
                              <line x1="2" y1="12" x2="6" y2="16" stroke="#38bdf8" strokeWidth="2" />
                              <line x1="22" y1="12" x2="18" y2="16" stroke="#38bdf8" strokeWidth="2" />
                            </g>

                            {/* Real-time Callout Tag Floating Beside Probe */}
                            <g transform={`translate(${probeX + 28}, ${probeY - 15})`}>
                              <rect x="0" y="0" width="165" height="42" rx="4" fill="#09101D" stroke="#06b6d4" strokeWidth="1" opacity="0.95" />
                              <text x="8" y="15" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                CR-07 PENETRATOR
                              </text>
                              <text x="8" y="28" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                                DEPTH: {telemetry.depth.toFixed(1)} m
                              </text>
                              <text x="8" y="38" fill="#fdba74" fontSize="8" fontFamily="monospace">
                                NOSE: {telemetry.coreTemp.toFixed(1)}°C | {telemetry.tetherTension.toFixed(1)} kN
                              </text>
                            </g>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Sub-Ice Profile Flight Controls Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-xs font-mono text-slate-300">THERMAL MELT THROTTLE:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setTelemetry((p) => ({ ...p, corePower: Math.max(50, p.corePower - 10) }))}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-bold hover:bg-slate-700"
                      >
                        -10
                      </button>
                      <span className="text-xs font-mono font-bold text-orange-400">{telemetry.corePower.toFixed(0)} kW</span>
                      <button
                        onClick={() => setTelemetry((p) => ({ ...p, corePower: Math.min(250, p.corePower + 10) }))}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-bold hover:bg-slate-700"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-xs font-mono text-slate-300">CAVITATION WATER JET:</span>
                    <button
                      onClick={handleFlushCavitation}
                      disabled={isFlushingNozzles}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        isFlushingNozzles
                          ? 'bg-cyan-600 text-white animate-pulse'
                          : 'bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                      }`}
                    >
                      {isFlushingNozzles ? 'PULSING (450 BAR)' : 'ENGAGE JET'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-xs font-mono text-slate-300">SONAR TRANSPONDER:</span>
                    <button
                      onClick={handlePulseTransponder}
                      disabled={isTransponderPulsing}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        isTransponderPulsing
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                      }`}
                    >
                      {isTransponderPulsing ? 'TRANSMITTING' : 'PULSE USBL'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* PANE 3: CENTER-RIGHT POWER & FIBER TELEMETRY DIAGNOSTICS      */}
              {/* ============================================================== */}
              <div className="xl:col-span-5 bg-[#0B1325] border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                      {t.telemetryHeader}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                    BUS 400V DC NOMINAL
                  </span>
                </div>

                {/* High-Voltage Tether Bus & Optical Fiber Health */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Bus Voltage Sparkline */}
                  <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span>400V DC BUS STABILITY</span>
                      <span className="font-bold text-cyan-400">{telemetry.busVoltage.toFixed(1)} V</span>
                    </div>
                    <div className="mt-2">
                      {renderSparkline(voltageHistory, '#06b6d4')}
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Surface In: 3,000V AC</span>
                      <span className="text-emerald-400">Loss: 3.4 kW (1.8%)</span>
                    </div>
                  </div>

                  {/* Optical Fiber Attenuation */}
                  <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span>FIBER ATTENUATION (1550nm)</span>
                      <span className="font-bold text-emerald-400">{telemetry.fiberAttenuation.toFixed(3)} dB/km</span>
                    </div>
                    <div className="mt-2">
                      {renderSparkline(tensionHistory, '#10b981')}
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Optical Margin: +18.2 dB</span>
                      <span className="text-cyan-400">BER: 1.2e-12</span>
                    </div>
                  </div>
                </div>

                {/* Melt-Head Thermal Cartridge Bank Temperatures (1 - 4) */}
                <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono uppercase text-slate-300">
                      MELT-HEAD HEATING CARTRIDGE ARRAY (QUAD-BANK)
                    </span>
                    <span className="text-[11px] font-mono text-orange-400 font-bold">LIMIT: 340.0°C</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {telemetry.cartridgeTemps.map((temp, idx) => {
                      const isHot = temp > 323;
                      const pct = Math.min(100, Math.max(0, ((temp - 250) / (340 - 250)) * 100));
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded border ${
                            isHot
                              ? 'bg-amber-950/40 border-amber-500/60'
                              : 'bg-slate-900/90 border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                            <span>BANK #{idx + 1}</span>
                            {isHot && <span className="text-[9px] text-amber-400 font-bold">DELTA</span>}
                          </div>
                          <div className="text-base font-black font-mono text-slate-100 mt-1">
                            {temp.toFixed(1)}°C
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isHot ? 'bg-amber-400' : 'bg-cyan-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subsea Circulator & Hydraulic Variable Buoyancy Engine (VBE) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Circulator Pump Flow */}
                  <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                        CIRCULATOR COOLANT PUMP
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold font-mono text-slate-100">
                        {telemetry.pumpFlowRate.toFixed(1)}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">L/min</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>SPEED: {telemetry.pumpRpm} RPM</span>
                      <span>ΔP: {telemetry.pumpDeltaP} bar</span>
                    </div>
                  </div>

                  {/* Variable Buoyancy Engine (VBE) */}
                  <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                        VARIABLE BUOYANCY ENGINE
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold font-mono text-slate-100">
                        {telemetry.bladderVolume.toFixed(1)}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">/ 40 L (BLADDER)</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>PISTON: {telemetry.pistonPressure.toFixed(0)} bar</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setTelemetry((p) => ({ ...p, bladderVolume: Math.min(40, p.bladderVolume + 1) }))}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold hover:bg-slate-700"
                        >
                          +L
                        </button>
                        <button
                          onClick={() => setTelemetry((p) => ({ ...p, bladderVolume: Math.max(0, p.bladderVolume - 1) }))}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold hover:bg-slate-700"
                        >
                          -L
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* PANE 4: BOTTOM SCIENCE PAYLOAD MANIFEST & VENT WATER CHEMISTRY     */}
          {/* ================================================================== */}
          <div className="bg-[#0B1325] border border-slate-800 rounded-lg p-4 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  {t.scienceHeader}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNiskinModal(true)}
                  className="px-3 py-1.5 rounded bg-cyan-900/80 border border-cyan-500/60 text-cyan-200 text-xs font-mono font-bold hover:bg-cyan-800 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.niskinTrigger}
                </button>
                <button
                  onClick={handleFlushCavitation}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold hover:bg-slate-800 transition-colors"
                >
                  {t.flushNozzles}
                </button>
                <button
                  onClick={handlePulseTransponder}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold hover:bg-slate-800 transition-colors"
                >
                  {t.pulseTransponder}
                </button>
              </div>
            </div>

            {/* Geochemistry Strip: CH4, H2, pH, Salinity, ORP, Turbidity */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Dissolved Methane CH4 */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase">DISSOLVED METHANE (CH4)</div>
                <div className="text-2xl md:text-3xl font-black font-mono text-cyan-300 mt-1">
                  {telemetry.ch4.toFixed(1)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">nmol / Liter (Serpentine)</div>
              </div>

              {/* Dissolved Hydrogen H2 */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase">DISSOLVED HYDROGEN (H2)</div>
                <div className="text-2xl md:text-3xl font-black font-mono text-emerald-300 mt-1">
                  {telemetry.h2.toFixed(1)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">μmol / kg (Plume tracer)</div>
              </div>

              {/* pH Level Bar */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase">
                  <span>pH LEVEL</span>
                  <span className={`font-bold ${telemetry.pH < 5.0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {telemetry.pH < 5.0 ? 'ACIDIC' : 'NEUTRAL'}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono text-slate-100 my-0.5">
                  {telemetry.pH.toFixed(2)}
                </div>
                {/* Visual Gradient Bar for pH */}
                <div className="w-full h-2 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400 relative">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-md transform -translate-x-1/2"
                    style={{ left: `${Math.min(100, Math.max(0, ((telemetry.pH - 2.8) / (8.2 - 2.8)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Salinity CTD */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase">SALINITY (CTD INDUCTIVE)</div>
                <div className="text-2xl md:text-3xl font-black font-mono text-slate-100 mt-1">
                  {telemetry.salinity.toFixed(2)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">PSU (Practical Salinity)</div>
              </div>

              {/* Oxidation-Reduction Potential (ORP) */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase">REDOX POTENTIAL (ORP)</div>
                <div className="text-2xl md:text-3xl font-black font-mono text-slate-100 mt-1">
                  {telemetry.orp}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">mV (Deep reducing fluid)</div>
              </div>

              {/* Turbidity / Optical Backscatter */}
              <div className="bg-[#070D18] border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase">TURBIDITY (BACKSCATTER)</div>
                <div className="text-2xl md:text-3xl font-black font-mono text-slate-100 mt-1">
                  {telemetry.turbidity.toFixed(2)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">FNU (Particulate density)</div>
              </div>
            </div>

            {/* Science Sensor Payload Table & Niskin Sample Carousel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              
              {/* Sensor Payload Status Table */}
              <div className="lg:col-span-7 bg-[#070D18] border border-slate-800 rounded-lg overflow-x-auto">
                <div className="p-3 border-b border-slate-800 text-xs font-mono font-bold uppercase text-slate-300 flex justify-between items-center">
                  <span>ACTIVE SCIENCE INSTRUMENT PAYLOAD MATRIX</span>
                  <span className="text-[10px] text-cyan-400">4 / 4 ONLINE</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono font-bold uppercase bg-slate-900/60">
                      <th className="py-3 px-3">CODE</th>
                      <th className="py-3 px-3">INSTRUMENT SPECIFICATION</th>
                      <th className="py-3 px-3">TARGET REGIME</th>
                      <th className="py-3 px-3">RATE</th>
                      <th className="py-3 px-3">HEALTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-cyan-300">SAM-01</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-200">Quadrupole Mass Spectrometer</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-400">Volatiles & Prebiotic Organics</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-300">1.0 Hz</td>
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-emerald-400">99.2% NOM</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-cyan-300">RAMAN-532</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-200">532nm Deep-UV Raman Laser</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-400">Silicates, Clathrates, Carbonates</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-300">5.0 Hz</td>
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-emerald-400">97.8% NOM</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-cyan-300">CTD-PREC</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-200">Micro-Inductive Salinity & Temp Cell</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-400">Hydrographic Density Profile</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-300">20.0 Hz</td>
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-emerald-400">100.0% NOM</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-cyan-300">UVP-FLUORO</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-200">Deep-Abyssal Micro-Fluorometer</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-400">Bioluminescent Signature / PAH</td>
                      <td className="py-3.5 px-3 text-xs font-mono text-slate-300">10.0 Hz</td>
                      <td className="py-3.5 px-3 text-xs font-mono font-bold text-emerald-400">96.4% NOM</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Niskin Sample Bay Carousel Status (8 Vials) */}
              <div className="lg:col-span-5 bg-[#070D18] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono font-bold uppercase text-slate-300 border-b border-slate-800 pb-2">
                  <span>NISKIN ROTARY CAROUSEL (8 BAYS)</span>
                  <span className="text-[10px] text-cyan-400">2 SEALED / 1 ACTIVE / 5 EMPTY</span>
                </div>

                <div className="grid grid-cols-4 gap-2 my-2">
                  {niskinBays.map((bay) => {
                    const isSealed = bay.status === 'sealed_refrigerated';
                    const isActive = bay.status === 'sampling_active';
                    return (
                      <div
                        key={bay.id}
                        className={`p-2 rounded border flex flex-col items-center justify-between text-center transition-all ${
                          isActive
                            ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse'
                            : isSealed
                            ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">BAY #{bay.id}</div>
                        
                        {/* Vial Icon Graphic */}
                        <div className="w-6 h-10 border border-slate-600 rounded-b-md relative my-1 bg-slate-950 overflow-hidden">
                          <div
                            className={`absolute bottom-0 left-0 right-0 transition-all ${
                              isActive ? 'bg-cyan-400' : isSealed ? 'bg-emerald-500' : 'bg-transparent'
                            }`}
                            style={{ height: `${(bay.volumeMl / bay.capacityMl) * 100}%` }}
                          />
                        </div>

                        <div className="text-[9px] font-mono">
                          {isActive ? 'SAMPLING' : isSealed ? 'SEALED' : 'READY'}
                        </div>
                        <div className="text-[8px] font-mono text-slate-500 truncate w-full">
                          {bay.volumeMl} ml
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800">
                  <span>CAROUSEL DRIVE: STEPPER ACTUATOR NOMINAL</span>
                  <button
                    onClick={handleNiskinTrigger}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-100 uppercase"
                  >
                    ADVANCE & SEAL →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* TAB 4: PREDICTIVE ANALYTICS & HEURISTICS (IF ACTIVE TAB)           */}
          {/* ================================================================== */}
          {activeTab === 'analytics' && (
            <div className="bg-[#0B1325] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  {t.predictiveHeader}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Heuristic 1: Ice Closure Velocity */}
                <div className="bg-[#070D18] border border-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
                    <span>BOREHOLE CLOSURE PREDICTION</span>
                    <span className="text-emerald-400 font-bold">SAFE MARGIN</span>
                  </div>
                  <div className="text-3xl font-black font-mono text-slate-100 mt-2">
                    {telemetry.iceClosureRate.toFixed(1)} mm/hr
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed">
                    Based on Glen’s Law for ice creep at -12°C under 41.2 MPa overburden pressure. Recommended minimum thermal power to avoid entrapment: 120 kW.
                  </p>
                  <div className="mt-4 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    STATUS: Overcoming closure with +65 kW reserve enthalpy margin.
                  </div>
                </div>

                {/* Heuristic 2: Tether Cyclic Strain & Bending Fatigue */}
                <div className="bg-[#070D18] border border-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
                    <span>TETHER CYCLIC FATIGUE INDEX</span>
                    <span className="text-cyan-400 font-bold">3.1% ACCUMULATED</span>
                  </div>
                  <div className="text-3xl font-black font-mono text-slate-100 mt-2">
                    96.9% LIFE REMAINING
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed">
                    Kevlar-reinforced optical core subjected to 16.6 kN dynamic waves. Capstan heave-compensator has absorbed 14,200 tension cycles with zero slip.
                  </p>
                  <div className="mt-4 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300">
                    ESTIMATED REMAINING RUNTIME: 240+ continuous hours.
                  </div>
                </div>

                {/* Heuristic 3: Melt Head Cartridge Life Matrix */}
                <div className="bg-[#070D18] border border-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
                    <span>HEATING ELEMENT OHMIC DRIFT</span>
                    <span className="text-orange-400 font-bold">CARTRIDGE 3 ANOMALY</span>
                  </div>
                  <div className="text-3xl font-black font-mono text-slate-100 mt-2">
                    +0.04 Ω / 100 hrs
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-2 leading-relaxed">
                    Cartridge 3 impedance shift consistent with slight silicate slag deposition on outer diamond face. Water jet cavitation pulse cleared 82% of debris.
                  </p>
                  <div className="mt-4 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-orange-300">
                    MAINTENANCE RECOMMENDATION: Execute 450 bar flush every 6 hours.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* TAB 5: COLLABORATION, BROADCAST LOGS & OPERATOR NOTES              */}
          {/* ================================================================== */}
          {activeTab === 'collab' && (
            <div className="bg-[#0B1325] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                    REAL-TIME MISSION COLLABORATION LOG
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  SESSION ENCRYPTION: SHA-256 AES-GCM
                </span>
              </div>

              {/* Compose New Operational Directive */}
              <form onSubmit={handleAddCollabNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Broadcast mission flight directive, waypoint note, or science observation..."
                  className="flex-1 bg-[#070D18] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  BROADCAST
                </button>
              </form>

              {/* Feed of Notes */}
              <div className="space-y-2">
                {collabNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-[#070D18] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{note.author}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{note.role}</span>
                      </div>
                      <span className="text-slate-500">{note.time}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-200">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* SYSTEM ALERTS & EVENT LOG LEDGER                                   */}
          {/* ================================================================== */}
          <div className="bg-[#0B1325] border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100">
                  DIAGNOSTIC ALERTS & THRESHOLD AUDIT LEDGER
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {alerts.filter((a) => !a.acknowledged).length} UNACKNOWLEDGED ACTIVE
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono font-bold uppercase bg-slate-900/60">
                    <th className="py-3 px-3">SEVERITY</th>
                    <th className="py-3 px-3">TIMESTAMP</th>
                    <th className="py-3 px-3">SUBSYSTEM</th>
                    <th className="py-3 px-3">ALERT EVENT</th>
                    <th className="py-3 px-3">READING</th>
                    <th className="py-3 px-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {alerts.map((alt) => (
                    <tr key={alt.id} className="hover:bg-slate-900/30">
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            alt.severity === 'critical'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : alt.severity === 'warning'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono text-slate-400">{alt.time}</td>
                      <td className="py-3 px-3 text-xs font-mono font-bold text-slate-300">{alt.subsystem}</td>
                      <td className="py-3 px-3 text-xs font-mono text-slate-200">
                        <div className="font-bold">{alt.title}</div>
                        <div className="text-slate-400 text-[11px]">{alt.message}</div>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono text-cyan-300 font-bold">{alt.value}</td>
                      <td className="py-3 px-3">
                        {alt.acknowledged ? (
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ACKED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledgeAlert(alt.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700"
                          >
                            ACK
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* ==================================================================== */}
        {/* MODAL 1: EMERGENCY GUILLOTINE DUAL-KEY CONFIRMATION                  */}
        {/* ==================================================================== */}
        {showGuillotineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#0B1325] border-2 border-red-600 rounded-xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
                <div>
                  <h3 className="text-lg font-black font-mono tracking-wider uppercase text-red-400">
                    CRITICAL WARNING: TETHER GUILLOTINE CUTTER
                  </h3>
                  <p className="text-xs font-mono text-slate-300">
                    PYROTECHNIC CABLE SEVERANCE AUTHORIZATION
                  </p>
                </div>
              </div>

              <div className="p-3 rounded bg-red-950/40 border border-red-800 text-xs font-mono text-red-200 leading-relaxed">
                Firing this guillotine will permanently cut the 5,240 m optical fiber power tether to Cryobot CR-07. The probe will decouple immediately, deploy emergency variable buoyancy ascent bladders, and attempt acoustic homing toward the surface ice borehole sleeve.
              </div>

              <div className="text-center py-2">
                <span className="text-xs font-mono text-slate-400 uppercase block">AUTO-IGNITION COUNTDOWN</span>
                <span className="text-5xl font-black font-mono text-red-500 tabular-nums">
                  00:0{guillotineCountdown}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleCancelGuillotine}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold uppercase transition-colors"
                >
                  ABORT SEVERANCE
                </button>
                <button
                  onClick={() => {
                    setIsGuillotineSevered(true);
                    setShowGuillotineModal(false);
                    setGuillotineCountdown(null);
                    setNotificationToast({
                      type: 'alert',
                      message: 'EMERGENCY SEVER INITIATED: Tether pyrotechnic cut complete. Autonomous ballast burn active.',
                    });
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase transition-colors shadow-lg shadow-red-900/50"
                >
                  CONFIRM DETONATE NOW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL 2: NISKIN BOTTLE ROTARY SAMPLE TRIGGER                         */}
        {/* ==================================================================== */}
        {showNiskinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-[#0B1325] border border-cyan-500/70 rounded-xl max-w-lg w-full p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Database className="w-7 h-7" />
                <div>
                  <h3 className="text-lg font-black font-mono tracking-wider uppercase text-slate-100">
                    NISKIN FLUID SAMPLER CAROUSEL
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ABYSSAL HYDROTHERMAL FLUID COLLECTION ACTUATION
                  </p>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span>CURRENT DEPTH:</span>
                  <span className="text-cyan-400 font-bold">{telemetry.depth.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>AMBIENT PRESSURE:</span>
                  <span className="text-cyan-400 font-bold">{telemetry.pressure.toFixed(1)} MPa</span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET FLUID pH:</span>
                  <span className="text-amber-400 font-bold">{telemetry.pH.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>DISSOLVED METHANE:</span>
                  <span className="text-emerald-400 font-bold">{telemetry.ch4.toFixed(1)} nmol/L</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNiskinModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleNiskinTrigger}
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  CONFIRM NISKIN SEAL & ADVANCE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="border-t border-slate-800 bg-[#040812] px-4 py-3 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <div>
            OCEANUS-ICE EXPLORATION PROGRAM // DEEP SUBMERGENCE ROBOTICS BLUEPRINT CR-07
          </div>
          <div className="flex items-center gap-3">
            <span>TERMINAL ID: ECL-NAV-8042</span>
            <span>•</span>
            <span className="text-slate-400">LAT: 25.2°S LON: 271.8°W (PWYLL)</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">STATUS: FLIGHT READY</span>
          </div>
        </footer>

      </div>
    </>
  );
}

// Default export for institutional React 19 app container
export default function App() {
  return (
    <>
      <SubseaCryoDrillControl />
    </>
  );
}
