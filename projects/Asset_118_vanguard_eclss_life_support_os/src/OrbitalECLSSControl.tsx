import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Droplets,
  Flame,
  Gauge,
  Info,
  Layers,
  Lock,
  Moon,
  Power,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  Thermometer,
  Unlock,
  Volume2,
  VolumeX,
  Wind,
  Wrench,
  Zap
} from 'lucide-react';

// Type Definitions
export interface AtmosphereTelemetry {
  totalPressureKpa: number;
  o2PartialKpa: number;
  o2Percent: number;
  co2PartialKpa: number;
  humidityPercent: number;
  tempCelsius: number;
  dewPointCelsius: number;
  cabinVolumeM3: number;
  crewPresent: number;
}

export interface SubsystemNode {
  id: string;
  name: string;
  shortName: string;
  category: 'OXYGEN' | 'CARBON_DIOXIDE' | 'WATER' | 'TRACE_CONTAMINANT';
  status: 'NOMINAL' | 'ACTIVE' | 'CAUTION' | 'STANDBY' | 'PURGING';
  powerWatts: number;
  efficiencyPct: number;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  description: string;
  inputs: string[];
  outputs: string[];
  valveState: 'OPEN' | 'THROTTLED' | 'BYPASS' | 'CLOSED';
}

export interface ConsumableTank {
  id: string;
  name: string;
  code: string;
  current: number;
  capacity: number;
  unit: string;
  pressureMpa: number;
  tempK: number;
  consumptionRatePerHour: number;
  colorClass: string;
  icon: 'droplets' | 'wind' | 'flame' | 'gauge';
}

export interface HabitatNode {
  id: string;
  code: string;
  name: string;
  crewCount: number;
  metabolicO2KgDay: number;
  metabolicCO2KgDay: number;
  liohSaturationPct: number;
  hepaDeltaPPa: number;
  fanRpm: number;
  status: 'NOMINAL' | 'WARNING' | 'MAINTENANCE' | 'DEPRESSURIZED';
  lastService: string;
}

export interface MaintenanceActionLog {
  id: string;
  timestamp: string;
  action: string;
  targetNode: string;
  operator: string;
  status: 'EXECUTED' | 'QUEUED' | 'INTERLOCKED';
  detail: string;
}

export const OrbitalECLSSControl: React.FC = () => {
  // Atmosphere Telemetry State
  const [telemetry, setTelemetry] = useState<AtmosphereTelemetry>({
    totalPressureKpa: 101.32,
    o2PartialKpa: 21.21,
    o2Percent: 20.93,
    co2PartialKpa: 0.38,
    humidityPercent: 44.5,
    tempCelsius: 21.4,
    dewPointCelsius: 9.1,
    cabinVolumeM3: 420.0,
    crewPresent: 6,
  });

  // Consumable Tanks State
  const [tanks, setTanks] = useState<ConsumableTank[]>([
    {
      id: 'tank-h2o',
      name: 'Potable Water Recovery Tank',
      code: 'H2O-POT-RES-01',
      current: 842.6,
      capacity: 1000.0,
      unit: 'kg',
      pressureMpa: 0.32,
      tempK: 294.1,
      consumptionRatePerHour: 0.48, // net positive recovery
      colorClass: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      icon: 'droplets',
    },
    {
      id: 'tank-lox',
      name: 'Cryo Liquid Oxygen Reserve',
      code: 'LOX-CRYO-02A',
      current: 1420.0,
      capacity: 2000.0,
      unit: 'L',
      pressureMpa: 2.45,
      tempK: 90.2,
      consumptionRatePerHour: -0.21,
      colorClass: 'text-teal-400 bg-teal-500/20 border-teal-500/40',
      icon: 'wind',
    },
    {
      id: 'tank-ln2',
      name: 'High-Pressure Liquid Nitrogen Buffer',
      code: 'LN2-BUFF-01B',
      current: 2850.0,
      capacity: 3500.0,
      unit: 'L',
      pressureMpa: 3.12,
      tempK: 77.4,
      consumptionRatePerHour: -0.05,
      colorClass: 'text-sky-400 bg-sky-500/20 border-sky-500/40',
      icon: 'gauge',
    },
  ]);

  // Sabatier Methanation Reactor Specific Diagnostics
  const [sabatierTemp, setSabatierTemp] = useState<number>(400.2);
  const [sabatierTargetTemp] = useState<number>(400.0);
  const [sabatierDutyCycle, setSabatierDutyCycle] = useState<number>(64.5);
  const [sabatierConversionEff, setSabatierConversionEff] = useState<number>(98.4);
  const [ch4VentRateKgh, setCh4VentRateKgh] = useState<number>(0.142);
  const [sabatierCycling, setSabatierCycling] = useState<boolean>(false);

  // Habitat Nodes Log State
  const [nodes, setNodes] = useState<HabitatNode[]>([
    {
      id: 'node-01',
      code: 'NODE-01',
      name: 'Command Core & Avionics',
      crewCount: 2,
      metabolicO2KgDay: 1.68,
      metabolicCO2KgDay: 2.01,
      liohSaturationPct: 41.2,
      hepaDeltaPPa: 138,
      fanRpm: 3420,
      status: 'NOMINAL',
      lastService: '12d 04h ago',
    },
    {
      id: 'node-02',
      code: 'NODE-02',
      name: 'Central Life Support & Galley',
      crewCount: 1,
      metabolicO2KgDay: 0.84,
      metabolicCO2KgDay: 1.02,
      liohSaturationPct: 58.7,
      hepaDeltaPPa: 164,
      fanRpm: 3500,
      status: 'NOMINAL',
      lastService: '04d 18h ago',
    },
    {
      id: 'node-03',
      code: 'NODE-03',
      name: 'Science Lab & Hydroponics Rack',
      crewCount: 1,
      metabolicO2KgDay: 0.84,
      metabolicCO2KgDay: 0.72,
      liohSaturationPct: 32.0,
      hepaDeltaPPa: 142,
      fanRpm: 3380,
      status: 'NOMINAL',
      lastService: '19d 08h ago',
    },
    {
      id: 'node-04',
      code: 'NODE-04',
      name: 'Service Module & Propulsion Hub',
      crewCount: 0,
      metabolicO2KgDay: 0.0,
      metabolicCO2KgDay: 0.0,
      liohSaturationPct: 18.5,
      hepaDeltaPPa: 118,
      fanRpm: 2950,
      status: 'NOMINAL',
      lastService: '31d 02h ago',
    },
    {
      id: 'node-airlock',
      code: 'AIRLOCK',
      name: 'Alpha EVA Chamber',
      crewCount: 0,
      metabolicO2KgDay: 0.0,
      metabolicCO2KgDay: 0.0,
      liohSaturationPct: 22.1,
      hepaDeltaPPa: 125,
      fanRpm: 2400,
      status: 'NOMINAL',
      lastService: '08d 14h ago',
    },
    {
      id: 'node-berth',
      code: 'CREW-QTRS',
      name: 'Berthing Quarters 1-6',
      crewCount: 2,
      metabolicO2KgDay: 1.64,
      metabolicCO2KgDay: 1.98,
      liohSaturationPct: 67.4,
      hepaDeltaPPa: 188,
      fanRpm: 3620,
      status: 'NOMINAL',
      lastService: '02d 11h ago',
    },
  ]);

  // Subsystem Interactive Flow Nodes
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemNode | null>(null);
  const [subsystems, setSubsystems] = useState<Record<string, SubsystemNode>>({
    OGA: {
      id: 'OGA',
      name: 'Oxygen Generation Assembly',
      shortName: 'OGA (Electrolysis)',
      category: 'OXYGEN',
      status: 'ACTIVE',
      powerWatts: 1450,
      efficiencyPct: 99.1,
      primaryMetricLabel: 'O2 Gen Rate',
      primaryMetricValue: '5.42 kg/day',
      secondaryMetricLabel: 'Cell Voltage',
      secondaryMetricValue: '1.82 V/cell',
      description: 'Splits ultra-pure potable water via PEM solid polymer electrolysis. Pure O2 is routed to cabin circulation; H2 byproduct is pressurized and fed to CRA.',
      inputs: ['Ultra-Pure Potable H2O (0.28 L/hr)', '28V DC Avionics Bus'],
      outputs: ['Metabolic Oxygen O2 (226 g/hr)', 'Hydrogen Byproduct H2 (28.3 g/hr)'],
      valveState: 'OPEN',
    },
    CRA: {
      id: 'CRA',
      name: 'Sabatier Carbon Dioxide Reduction Assembly',
      shortName: 'CRA (Sabatier)',
      category: 'CARBON_DIOXIDE',
      status: 'ACTIVE',
      powerWatts: 820,
      efficiencyPct: 98.4,
      primaryMetricLabel: 'Reactor Bed Temp',
      primaryMetricValue: '400.2 °C',
      secondaryMetricLabel: 'H2O Recovery Yield',
      secondaryMetricValue: '96.2%',
      description: 'Catalytic Sabatier reactor utilizing ruthenium on alumina. Reacts scrubbed cabin CO2 with OGA H2 byproduct at 400°C to produce water and methane.',
      inputs: ['CO2 from CDRA Desorption', 'H2 from OGA Electrolysis'],
      outputs: ['Recovered Condensate H2O', 'Methane CH4 Overboard Vacuum Vent'],
      valveState: 'OPEN',
    },
    UPA: {
      id: 'UPA',
      name: 'Urine Processor Assembly (VCD)',
      shortName: 'UPA (Vapor Distillation)',
      category: 'WATER',
      status: 'NOMINAL',
      powerWatts: 380,
      efficiencyPct: 93.8,
      primaryMetricLabel: 'Distillate Production',
      primaryMetricValue: '1.45 L/hr',
      secondaryMetricLabel: 'Centrifuge Drum RPM',
      secondaryMetricValue: '1240 RPM',
      description: 'Low-pressure rotating vapor compression distillation (VCD) assembly. Reclaims 93%+ pure distillate from crew metabolic wastewater for WPA polishing.',
      inputs: ['Raw Wastewater Distillate', 'Pre-Treatment Oxidant'],
      outputs: ['Polished Distillate to WPA', 'Concentrated Brine to Disposal'],
      valveState: 'OPEN',
    },
    TCCS: {
      id: 'TCCS',
      name: 'Trace Contaminant Control Subsystem',
      shortName: 'TCCS (Catalytic)',
      category: 'TRACE_CONTAMINANT',
      status: 'ACTIVE',
      powerWatts: 260,
      efficiencyPct: 99.7,
      primaryMetricLabel: 'Bed Temperature',
      primaryMetricValue: '315.0 °C',
      secondaryMetricLabel: 'CO Destruct Ratio',
      secondaryMetricValue: '99.85%',
      description: 'Two-stage air revitalization system combining activated charcoal adsorption bed for high MW organics and high-temperature catalytic oxidizer for CO and methane.',
      inputs: ['Cabin Mixed Atmosphere', 'Catalytic Preheat Loop'],
      outputs: ['Decontaminated Air Stream', 'Trace Oxidation Effluent'],
      valveState: 'OPEN',
    },
    CDRA: {
      id: 'CDRA',
      name: 'Carbon Dioxide Removal Assembly',
      shortName: 'CDRA (4-Bed Mol Sieve)',
      category: 'CARBON_DIOXIDE',
      status: 'ACTIVE',
      powerWatts: 610,
      efficiencyPct: 96.5,
      primaryMetricLabel: 'Bed Desorb Cycle',
      primaryMetricValue: 'Bed-B (71% Desorbed)',
      secondaryMetricLabel: 'Cabin CO2 Extraction',
      secondaryMetricValue: '4.82 kg/day',
      description: 'Dual-bed regenerative thermal swing zeolite molecular sieve (13X and 5A). Continuously scrubs cabin CO2 and delivers concentrated stream to Sabatier.',
      inputs: ['Cabin Return Air Duct (0.38 kPa CO2)', 'Thermal Swing Regeneration Air'],
      outputs: ['CO2 Concentrate Stream to CRA', 'Desorbed Dry Air to Cabin'],
      valveState: 'OPEN',
    },
    WPA: {
      id: 'WPA',
      name: 'Water Processor Assembly',
      shortName: 'WPA (Catalytic Reactor)',
      category: 'WATER',
      status: 'ACTIVE',
      powerWatts: 540,
      efficiencyPct: 99.4,
      primaryMetricLabel: 'Effluent Conductivity',
      primaryMetricValue: '0.42 μS/cm',
      secondaryMetricLabel: 'High-Temp Reactor Temp',
      secondaryMetricValue: '135 °C',
      description: 'Multi-filtration beds, particulate separation, high-temperature catalytic oxidation at 135°C, and microbial biocidal stabilization with ionic silver.',
      inputs: ['UPA Distillate Loop', 'Cabin Humidity Condensate'],
      outputs: ['WHO/NASA Potable Water Standard', 'Pressurized Storage Tank Feed'],
      valveState: 'OPEN',
    },
  });

  // Emergency Safety Interlock State
  const [interlockCoverOpen, setInterlockCoverOpen] = useState<boolean>(false);
  const [interlockArmState, setInterlockArmState] = useState<boolean>(false);
  const [showDecompModal, setShowDecompModal] = useState<boolean>(false);
  const [decompFlushActive, setDecompFlushActive] = useState<boolean>(false);
  const [flushSecondsRemaining, setFlushSecondsRemaining] = useState<number>(0);

  // Audio / Avionics Sound Mock Toggle
  const [audioFeedback, setAudioFeedback] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Maintenance Logs
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceActionLog[]>([
    {
      id: 'log-01',
      timestamp: '2026-10-03 14:12:05',
      action: 'CYCLE_SABATIER_BED',
      targetNode: 'NODE-02 // CRA',
      operator: 'AVIONICS_DAEMON',
      status: 'EXECUTED',
      detail: 'Thermal desorption sweep cycle completed. Methane catalyst delta-P nominal (14.2 kPa).',
    },
    {
      id: 'log-02',
      timestamp: '2026-10-03 13:45:22',
      action: 'FLUSH_CONDENSATE_SEPARATOR',
      targetNode: 'NODE-02 // WPA',
      operator: 'CHIEF_LIFE_SUPPORT_OFFICER',
      status: 'EXECUTED',
      detail: 'Hydrophobic membrane purge executed. 480 mL trapped microgravity slurry discharged.',
    },
    {
      id: 'log-03',
      timestamp: '2026-10-03 11:10:00',
      action: 'LIOH_HEALTH_POLL',
      targetNode: 'ALL_MODULES',
      operator: 'AUTOMATED_DIAG',
      status: 'EXECUTED',
      detail: 'Scrubber canister array sampled across 6 compartments. Node-02 & Crew-Qtrs approaching 60%.',
    },
  ]);

  // Simulation Fault Injection Mode
  const [simFaultMode, setSimFaultMode] = useState<'NOMINAL' | 'CO2_SPIKE' | 'SABATIER_EXOTHERM' | 'HEPA_RESTRICTION'>('NOMINAL');
  const [activeTab, setActiveTab] = useState<'NODES' | 'CANISTERS' | 'SCHEMATIC_INSPECT'>('NODES');
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Play synthetic avionics beep
  const playBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!audioFeedback) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext failure catch
    }
  };

  // High-performance Realistic Tick Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        // Natural micro-variations
        const pJitter = (Math.random() - 0.5) * 0.04;
        const o2Jitter = (Math.random() - 0.5) * 0.02;
        const humJitter = (Math.random() - 0.5) * 0.1;
        const tempJitter = (Math.random() - 0.5) * 0.05;

        let targetCo2 = prev.co2PartialKpa;
        let targetO2 = prev.o2PartialKpa;
        let targetTotalP = prev.totalPressureKpa;

        if (simFaultMode === 'CO2_SPIKE') {
          targetCo2 = Math.min(0.68, prev.co2PartialKpa + 0.012);
        } else {
          // Drifts towards nominal 0.38
          targetCo2 = prev.co2PartialKpa + (0.38 - prev.co2PartialKpa) * 0.08;
        }

        if (decompFlushActive) {
          // Rapid N2 injection pushes total pressure back up and stabilizes atmosphere
          targetTotalP = Math.min(103.5, prev.totalPressureKpa + 0.4);
        } else {
          targetTotalP = prev.totalPressureKpa + (101.32 - prev.totalPressureKpa) * 0.04;
        }

        const newTotal = Number((targetTotalP + pJitter).toFixed(2));
        const newO2 = Number((targetO2 + o2Jitter).toFixed(2));
        const newCo2 = Number((targetCo2).toFixed(3));
        const newO2Pct = Number(((newO2 / newTotal) * 100).toFixed(2));
        const newHum = Number((Math.max(38, Math.min(52, prev.humidityPercent + humJitter))).toFixed(1));
        const newTemp = Number((prev.tempCelsius + tempJitter).toFixed(1));

        return {
          ...prev,
          totalPressureKpa: newTotal,
          o2PartialKpa: newO2,
          o2Percent: newO2Pct,
          co2PartialKpa: newCo2,
          humidityPercent: newHum,
          tempCelsius: newTemp,
        };
      });

      // Sabatier thermals tick
      setSabatierTemp((prev) => {
        let target = sabatierTargetTemp;
        if (simFaultMode === 'SABATIER_EXOTHERM') {
          target = 468.0;
        } else if (sabatierCycling) {
          target = 412.0;
        }
        const delta = (target - prev) * 0.05 + (Math.random() - 0.5) * 0.3;
        return Number((prev + delta).toFixed(1));
      });

      // Tanks gentle consumption/production dynamics
      setTanks((prev) =>
        prev.map((tank) => {
          if (tank.id === 'tank-h2o') {
            // Slight water net yield from Sabatier + UPA
            const delta = 0.005 * (Math.random() * 0.5 + 0.8);
            const current = Math.min(tank.capacity, Number((tank.current + delta).toFixed(2)));
            return { ...tank, current };
          }
          if (decompFlushActive && tank.id === 'tank-ln2') {
            // Rapid discharge
            const discharge = 2.4;
            const current = Math.max(0, Number((tank.current - discharge).toFixed(1)));
            return { ...tank, current };
          }
          const drift = tank.consumptionRatePerHour * (1 / 3600);
          return {
            ...tank,
            current: Math.max(0, Number((tank.current + drift).toFixed(2))),
          };
        })
      );

      // HEPA delta P tick for fault
      if (simFaultMode === 'HEPA_RESTRICTION') {
        setNodes((prev) =>
          prev.map((node) =>
            node.code === 'NODE-02'
              ? { ...node, hepaDeltaPPa: Math.min(310, node.hepaDeltaPPa + 1.2), status: 'WARNING' }
              : node
          )
        );
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [simFaultMode, decompFlushActive, sabatierTargetTemp, sabatierCycling]);

  // Nitrogen flush countdown handler
  useEffect(() => {
    let flushInterval: ReturnType<typeof setInterval> | null = null;
    if (decompFlushActive && flushSecondsRemaining > 0) {
      flushInterval = setInterval(() => {
        setFlushSecondsRemaining((prev) => {
          if (prev <= 1) {
            setDecompFlushActive(false);
            setBannerAlert('EMERGENCY N2 FLUSH COMPLETED. ATMOSPHERE RE-STABILIZED AT 102.4 KPA.');
            playBeep(440, 'triangle', 0.2);
            return 0;
          }
          playBeep(800 + (prev % 2 === 0 ? 120 : 0), 'sawtooth', 0.05);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (flushInterval) clearInterval(flushInterval);
    };
  }, [decompFlushActive, flushSecondsRemaining]);

  // Execute Rapid Decompression N2 Flush
  const executeRapidDecompFlush = () => {
    setShowDecompModal(false);
    setDecompFlushActive(true);
    setFlushSecondsRemaining(15);
    setBannerAlert('CRITICAL INTERLOCK TRIGGERED: RAPID DECOMPRESSION NITROGEN FLUSH IN PROGRESS (15 SEC FULL MANIFOLD DUMP)');
    playBeep(980, 'square', 0.3);

    const newLog: MaintenanceActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'RAPID_N2_FLUSH_OVERRIDE',
      targetNode: 'ALL_HABITAT_MANIFOLDS',
      operator: 'COMMANDER_SAFETY_INTERLOCK',
      status: 'EXECUTED',
      detail: 'Emergency Nitrogen Buffer manifold vented at 48 kg/min to counteract hull pressure breach / fire suppression protocol.',
    };
    setMaintenanceLogs((prev) => [newLog, ...prev]);
  };

  // Quick action: Cycle Sabatier Bed
  const triggerCycleSabatier = () => {
    setSabatierCycling(true);
    playBeep(620, 'sine', 0.1);
    setBannerAlert('CRA SABATIER CATALYST BED THERMAL SWEEP CYCLE INITIATED (CO2 FEED TEMPORARILY DIVERTED)');

    const newLog: MaintenanceActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'CYCLE_SABATIER_BED',
      targetNode: 'NODE-02 // CRA',
      operator: 'DECK_AVIONICS_MANUAL',
      status: 'EXECUTED',
      detail: 'Reactor bed pre-heater dialed to 412°C for thermal regeneration and water desorption flush.',
    };
    setMaintenanceLogs((prev) => [newLog, ...prev]);

    setTimeout(() => {
      setSabatierCycling(false);
      setBannerAlert(null);
    }, 6000);
  };

  // Quick action: Flush Condensate Water Separator
  const triggerFlushCondensate = () => {
    playBeep(700, 'sine', 0.1);
    setBannerAlert('WPA CONDENSATE SEPARATOR ROTARY DISCHARGE FLUSH EXECUTED');
    const newLog: MaintenanceActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'FLUSH_CONDENSATE_SEPARATOR',
      targetNode: 'NODE-02 // WPA',
      operator: 'DECK_AVIONICS_MANUAL',
      status: 'EXECUTED',
      detail: 'Hydrophobic rotary separator purge cleared micro-debris and restored nominal delta-P.',
    };
    setMaintenanceLogs((prev) => [newLog, ...prev]);

    setTimeout(() => {
      setBannerAlert(null);
    }, 4500);
  };

  // Quick action: Swap LiOH Canister
  const triggerSwapLiOH = (nodeCode: string) => {
    playBeep(750, 'sine', 0.12);
    setNodes((prev) =>
      prev.map((n) =>
        n.code === nodeCode
          ? { ...n, liohSaturationPct: 2.5, lastService: 'Just Now', status: 'NOMINAL' }
          : n
      )
    );
    setBannerAlert(`FRESH LIOH CANISTER (SER: LI-994-${nodeCode}) INSTALLED IN ${nodeCode}. SATURATION RESET TO 2.5%.`);

    const newLog: MaintenanceActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'SWAP_LIOH_CANISTER',
      targetNode: nodeCode,
      operator: 'CREW_EVA_SPECIALIST',
      status: 'EXECUTED',
      detail: 'Spent lithium hydroxide canister replaced with hermetically sealed unit. Ambient CO2 absorption restored.',
    };
    setMaintenanceLogs((prev) => [newLog, ...prev]);

    setTimeout(() => {
      setBannerAlert(null);
    }, 5000);
  };

  // Quick action: Clean HEPA
  const triggerServiceHEPA = (nodeCode: string) => {
    playBeep(680, 'sine', 0.12);
    setNodes((prev) =>
      prev.map((n) =>
        n.code === nodeCode
          ? { ...n, hepaDeltaPPa: 120, lastService: 'Just Now', status: 'NOMINAL' }
          : n
      )
    );
    if (simFaultMode === 'HEPA_RESTRICTION') setSimFaultMode('NOMINAL');
    setBannerAlert(`HEPA FILTER BED IN ${nodeCode} REPLACED. DIFFERENTIAL PRESSURE NORMALIZED TO 120 PA.`);
  };

  const uniqueId = useId();

  return (
    <>
      <div className="min-h-screen bg-[#06080F] text-slate-100 font-mono flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* TOP STATUS TICKER / ALERTS */}
        {decompFlushActive && (
          <div className="bg-rose-950/90 border-b border-rose-500/80 px-4 py-2 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3 text-rose-200 text-xs tracking-wider uppercase font-semibold">
              <AlertOctagon className="w-5 h-5 text-rose-400 animate-spin" />
              <span>
                CRITICAL WARNING: RAPID DECOMPRESSION NITROGEN FLUSH ENGAGED // HIGH-PRESSURE MANIFOLDS VENTING //{' '}
                {flushSecondsRemaining}S REMAINING
              </span>
            </div>
            <div className="text-xs bg-rose-500/30 px-3 py-1 rounded text-rose-100 font-bold border border-rose-400">
              ACTIVE OVERRIDE
            </div>
          </div>
        )}

        {bannerAlert && !decompFlushActive && (
          <div className="bg-cyan-950/80 border-b border-cyan-500/50 px-4 py-1.5 flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{bannerAlert}</span>
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-cyan-400 hover:text-cyan-200 text-[11px] underline cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* =========================================================================
            PANE 1: TOP CABIN ATMOSPHERE & LIFE SUPPORT HUD
           ========================================================================= */}
        <header className="border-b border-slate-800 bg-[#0B0F17]/95 px-4 py-3 backdrop-blur-md sticky top-0 z-30 shadow-lg shadow-black/50">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Header Callout & Mission Clock */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <span className="text-xs md:text-sm font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    AVIONICS DECK-02
                  </span>
                  <span className="text-xs md:text-sm font-mono font-bold tracking-widest text-slate-300">
                    MET +412:14:28:19 // ORBIT 6,482
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-wider text-slate-100 flex flex-wrap items-baseline gap-2">
                  VANGUARD ORBITAL
                  <span className="text-cyan-400 font-bold text-sm md:text-base">
                    // NODE-02 CLOSED-LOOP ECLSS RACK
                  </span>
                </h1>
              </div>
            </div>

            {/* Quick Controls / Simulation selector & Audio Toggle */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs md:text-sm">
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase">Sim Scenario:</span>
                <select
                  value={simFaultMode}
                  onChange={(e) => setSimFaultMode(e.target.value as unknown as typeof simFaultMode)}
                  className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs md:text-sm"
                >
                  <option value="NOMINAL" className="bg-slate-900 text-slate-100">NOMINAL CRUISE</option>
                  <option value="CO2_SPIKE" className="bg-slate-900 text-amber-300">SIM CO2 ELEVATION</option>
                  <option value="SABATIER_EXOTHERM" className="bg-slate-900 text-rose-300">SIM REACTOR EXOTHERM</option>
                  <option value="HEPA_RESTRICTION" className="bg-slate-900 text-amber-300">SIM HEPA CLOG</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setAudioFeedback(!audioFeedback);
                  if (!audioFeedback) playBeep(880, 'sine', 0.1);
                }}
                className={`py-1.5 px-3 rounded border flex items-center gap-2 cursor-pointer transition-colors ${
                  audioFeedback
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-slate-100'
                }`}
                title="Toggle Mission Audio Chime"
              >
                {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-xs md:text-sm font-bold hidden sm:inline">{audioFeedback ? 'AVIONICS AUDIO' : 'MUTED'}</span>
              </button>
            </div>
          </div>

          {/* TELEMETRY STRIP */}
          <div className="max-w-7xl mx-auto mt-3.5 grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Total Cabin Pressure */}
            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Total Cabin Pressure</span>
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-slate-100">
                  {telemetry.totalPressureKpa.toFixed(2)}
                </span>
                <span className="text-sm text-cyan-400 font-bold">kPa</span>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-slate-300 font-medium">Target: 101.3 kPa</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> NOMINAL
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (telemetry.totalPressureKpa / 110) * 100)}%` }}
                />
              </div>
            </div>

            {/* O2 Partial Pressure */}
            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>O2 Partial Pressure</span>
                <Wind className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-teal-300">
                  {telemetry.o2PartialKpa.toFixed(2)}
                </span>
                <span className="text-sm text-teal-400 font-bold">kPa</span>
                <span className="text-xs text-slate-300 font-bold ml-auto">({telemetry.o2Percent.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-slate-300 font-medium">Safe: 19.5 - 23.0</span>
                <span className="text-teal-400 font-bold">OGA IN-FEED</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (telemetry.o2Percent / 25) * 100)}%` }}
                />
              </div>
            </div>

            {/* CO2 Partial Pressure */}
            <div className={`rounded-lg p-3 relative overflow-hidden transition-all border ${
              telemetry.co2PartialKpa > 0.50
                ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : telemetry.co2PartialKpa > 0.42
                ? 'bg-amber-950/40 border-amber-500/80'
                : 'bg-[#0F172A]/90 border-slate-800 hover:border-amber-500/50'
            }`}>
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>CO2 Partial Press</span>
                {telemetry.co2PartialKpa > 0.45 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                ) : (
                  <Activity className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl md:text-3xl font-black ${
                  telemetry.co2PartialKpa > 0.50 ? 'text-rose-400' : telemetry.co2PartialKpa > 0.42 ? 'text-amber-400' : 'text-amber-300'
                }`}>
                  {telemetry.co2PartialKpa.toFixed(3)}
                </span>
                <span className="text-sm text-amber-400 font-bold">kPa</span>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-slate-300 font-medium">Max Limit: 0.50</span>
                <span className={telemetry.co2PartialKpa > 0.45 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {telemetry.co2PartialKpa > 0.45 ? 'CRITICAL WARN' : 'CDRA RECYCLE'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    telemetry.co2PartialKpa > 0.45 ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, (telemetry.co2PartialKpa / 0.60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cabin Relative Humidity & Temp */}
            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Cabin Humidity / Temp</span>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-blue-300">
                  {telemetry.humidityPercent.toFixed(1)}
                </span>
                <span className="text-sm text-blue-400 font-bold">%</span>
                <span className="text-xs text-slate-300 font-bold ml-auto">{telemetry.tempCelsius.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-slate-300 font-medium">Dew Point: {telemetry.dewPointCelsius}°C</span>
                <span className="text-blue-400 font-bold">CONDENSING HX</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (telemetry.humidityPercent / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* EMERGENCY RAPID DECOMPRESSION NITROGEN FLUSH INTERLOCK */}
            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-600/40 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-rose-300 uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  N2 Flush Interlock
                </span>
                <span className={interlockArmState ? 'text-rose-400 animate-pulse font-extrabold' : 'text-slate-300 font-bold'}>
                  {interlockArmState ? 'ARMED' : 'SAFE'}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                {/* Physical Safety Guard Cover Flip */}
                <button
                  onClick={() => {
                    setInterlockCoverOpen(!interlockCoverOpen);
                    if (interlockCoverOpen) {
                      setInterlockArmState(false);
                    }
                    playBeep(400, 'square', 0.08);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded border font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    interlockCoverOpen
                      ? 'bg-rose-900/60 border-rose-500 text-rose-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-slate-100'
                  }`}
                  title="Lift transparent safety interlock cover"
                >
                  {interlockCoverOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{interlockCoverOpen ? 'COVER OPEN' : 'LOCKED'}</span>
                </button>

                {/* Armed Switch / Actuator */}
                <button
                  disabled={!interlockCoverOpen || decompFlushActive}
                  onClick={() => {
                    if (!interlockArmState) {
                      setInterlockArmState(true);
                      setShowDecompModal(true);
                      playBeep(900, 'sawtooth', 0.15);
                    } else {
                      setShowDecompModal(true);
                    }
                  }}
                  className={`flex-1 text-xs py-1.5 px-2 rounded font-extrabold uppercase tracking-wider border cursor-pointer transition-all ${
                    !interlockCoverOpen
                      ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-700 text-slate-500'
                      : interlockArmState
                      ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                      : 'bg-rose-950/80 border-rose-500/80 text-rose-300 hover:bg-rose-900 hover:border-rose-400'
                  }`}
                >
                  {decompFlushActive ? 'PURGING...' : 'TRIGGER N2 FLUSH'}
                </button>
              </div>

              <div className="text-xs text-slate-300 mt-1.5 flex items-center justify-between font-mono">
                <span>LN2 Manifold: 3.12 MPa</span>
                <span className="text-slate-400">77-ALPHA</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY: 4-PANE ARCHITECTURE */}
        <main className="max-w-7xl mx-auto w-full p-4 flex-1 flex flex-col gap-4">
          {/* =========================================================================
              PANE 2 (CENTER-LEFT): 2D CLOSED-LOOP METABOLIC RECYCLING SCHEMATIC
              & PANE 3 (CENTER-RIGHT): CATALYTIC REACTOR DIAGNOSTICS & TANK GAUGES
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* PANE 2: Center-Left 2D Schematic (7 cols on lg) */}
            <section className="lg:col-span-7 bg-[#0B0F17] border border-slate-800 rounded-lg p-3 sm:p-4 flex flex-col shadow-lg shadow-black/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 uppercase">
                    Closed-Loop Metabolic Recycling Schematic (P&ID)
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                    <span className="w-2.5 h-1 bg-cyan-400 rounded-full inline-block" /> O2 Vector
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
                    <span className="w-2.5 h-1 bg-amber-400 rounded-full inline-block" /> CO2 Vector
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300">
                    <span className="w-2.5 h-1 bg-blue-400 rounded-full inline-block" /> H2O Loop
                  </span>
                </div>
              </div>

              {/* Sub-header instruction */}
              <div className="text-xs text-slate-300 mb-2 flex flex-wrap items-center justify-between font-medium">
                <span>Click any Subsystem Node to inspect live catalytic catalysts, valve states & telemetry:</span>
                <span className="text-xs text-cyan-400 font-mono font-bold">FLOW RATE: AUTO-BALANCED</span>
              </div>

              {/* INTERACTIVE SVG PROCESS FLOW DIAGRAM */}
              <div className="relative bg-[#06080F] border border-slate-800/80 rounded overflow-hidden min-h-[580px] w-full flex items-center justify-center p-3 sm:p-5">
                <svg
                  viewBox="0 0 800 520"
                  className="w-full h-full min-h-[540px] select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id={`gradCyan-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id={`gradAmber-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id={`gradBlue-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* BACKGROUND GRID MATRIX */}
                  <g opacity="0.12" stroke="#475569" strokeWidth="0.5">
                    {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
                      <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="520" strokeDasharray="3 3" />
                    ))}
                    {[60, 120, 180, 240, 300, 360, 420, 480].map((y) => (
                      <line key={`gy-${y}`} x1="0" y1={y} x2="800" y2={y} strokeDasharray="3 3" />
                    ))}
                  </g>

                  {/* ================= PIPING AND FLUID PATHWAYS ================= */}
                  {/* CYAN O2 PIPELINE: OGA (140, 120) -> Cabin Core (400, 240) */}
                  <path
                    d="M 215 120 L 330 120 L 330 220 L 350 220"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    className="animate-flow-cyan"
                  />
                  {/* AMBER CO2 PIPELINE: Cabin (470, 220) -> CDRA (520, 120) */}
                  <path
                    d="M 465 220 L 485 220 L 485 120 L 520 120"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    className="animate-flow-amber"
                  />
                  {/* AMBER CO2 CONCENTRATE: CDRA (650, 120) -> CRA Sabatier (650, 235) */}
                  <path
                    d="M 650 165 L 650 235"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    className="animate-flow-amber"
                  />
                  {/* VIOLET H2 PIPELINE: OGA (175, 165) -> CRA Sabatier (580, 290) */}
                  <path
                    d="M 175 165 L 175 320 L 580 320 L 580 295"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    className="animate-flow-violet"
                  />
                  {/* CH4 VACUUM VENT OVERBOARD: CRA (725, 280) -> OVERBOARD NOZZLE (785, 280) */}
                  <path
                    d="M 725 280 L 785 280"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    strokeDasharray="4 4"
                  />
                  {/* BLUE CONDENSATE H2O RECOVERY: CRA (650, 335) -> WPA (400, 385) */}
                  <path
                    d="M 650 335 L 650 405 L 465 405"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    className="animate-flow-blue"
                  />
                  {/* BLUE UPA DISTILLATE: UPA (240, 405) -> WPA (330, 405) */}
                  <path
                    d="M 240 405 L 330 405"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    className="animate-flow-blue"
                  />
                  {/* BLUE POTABLE H2O RECYCLE: WPA (400, 360) -> OGA (140, 165) */}
                  <path
                    d="M 400 360 L 400 345 L 140 345 L 140 165"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    className="animate-flow-blue"
                  />
                  {/* TCCS CLOSED DECONTAMINATION AIR LOOP: Cabin (405, 195) <-> TCCS (405, 135) */}
                  <path
                    d="M 405 135 L 405 195"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                  />

                  {/* LABELS FOR FLOW PIPELINES */}
                  <text x="235" y="110" fill="#06b6d4" fontSize="12" fontWeight="bold">
                    O2 TO CABIN [226 g/h]
                  </text>
                  <text x="475" y="175" fill="#f59e0b" fontSize="12" fontWeight="bold">
                    CO2 RETURN
                  </text>
                  <text x="300" y="335" fill="#a855f7" fontSize="12" fontWeight="bold">
                    H2 BYPRODUCT LINE (OGA → CRA)
                  </text>
                  <text x="245" y="425" fill="#60a5fa" fontSize="12" fontWeight="bold">
                    UPA VCD DISTILLATE
                  </text>
                  <text x="495" y="420" fill="#60a5fa" fontSize="12" fontWeight="bold">
                    RECOVERED SABATIER H2O
                  </text>
                  <text x="710" y="270" fill="#ef4444" fontSize="11" fontWeight="bold">
                    CH4 VENT ➔ VACUUM
                  </text>

                  {/* ================= NODES ================= */}

                  {/* NODE: OGA (Oxygen Generation Assembly) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.OGA);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(90, 75)"
                  >
                    <rect
                      width="125"
                      height="90"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'OGA' ? '#06b6d4' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'OGA' ? '2.5' : '1.5'}
                      className="group-hover:stroke-cyan-400 transition-all"
                      filter={`url(#glow-${uniqueId})`}
                    />
                    <rect x="0" y="0" width="125" height="22" rx="4" fill="#083344" />
                    <text x="10" y="15" fill="#22d3ee" fontSize="11.5" fontWeight="bold">
                      OGA ELECTROLYSIS
                    </text>
                    <circle cx="112" cy="11" r="4.5" fill="#10b981" />
                    <text x="10" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      2 H2O → 2 H2 + O2
                    </text>
                    <text x="10" y="59" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Eff: {subsystems.OGA.efficiencyPct}%
                    </text>
                    <text x="10" y="76" fill="#38bdf8" fontSize="12" fontWeight="bold">
                      {subsystems.OGA.primaryMetricValue}
                    </text>
                  </g>

                  {/* NODE: CDRA (Carbon Dioxide Removal Assembly) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.CDRA);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(520, 75)"
                  >
                    <rect
                      width="135"
                      height="90"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'CDRA' ? '#f59e0b' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'CDRA' ? '2.5' : '1.5'}
                      className="group-hover:stroke-amber-400 transition-all"
                    />
                    <rect x="0" y="0" width="135" height="22" rx="4" fill="#451a03" />
                    <text x="10" y="15" fill="#fbbf24" fontSize="11.5" fontWeight="bold">
                      CDRA 4-BED SIEVE
                    </text>
                    <circle cx="122" cy="11" r="4.5" fill="#10b981" />
                    <text x="10" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      CO2 Thermal Swing
                    </text>
                    <text x="10" y="59" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Bed-B: Active Regen
                    </text>
                    <text x="10" y="76" fill="#f59e0b" fontSize="12" fontWeight="bold">
                      -4.82 kg/day CO2
                    </text>
                  </g>

                  {/* NODE: CRA (Sabatier Carbon Dioxide Reduction Assembly) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.CRA);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(580, 235)"
                  >
                    <rect
                      width="145"
                      height="100"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'CRA' ? '#f59e0b' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'CRA' ? '2.5' : '1.5'}
                      className="group-hover:stroke-amber-400 transition-all"
                    />
                    <rect x="0" y="0" width="145" height="22" rx="4" fill="#451a03" />
                    <text x="10" y="15" fill="#fbbf24" fontSize="11.5" fontWeight="bold">
                      CRA SABATIER BED
                    </text>
                    <circle
                      cx="132"
                      cy="11"
                      r="4.5"
                      fill={sabatierTemp > 430 ? '#ef4444' : '#10b981'}
                    />
                    <text x="10" y="41" fill="#f8fafc" fontSize="11.5" fontWeight="bold">
                      CO2 + 4H2 → CH4 + 2H2O
                    </text>
                    <text x="10" y="58" fill={sabatierTemp > 430 ? '#f87171' : '#f59e0b'} fontSize="12" fontWeight="bold">
                      Bed Temp: {sabatierTemp.toFixed(1)}°C
                    </text>
                    <text x="10" y="74" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Duty: {sabatierDutyCycle}%
                    </text>
                    <text x="10" y="90" fill="#38bdf8" fontSize="12" fontWeight="bold">
                      H2O Yield: 96.2%
                    </text>
                  </g>

                  {/* NODE: UPA (Urine Processor Assembly / VCD) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.UPA);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(85, 360)"
                  >
                    <rect
                      width="155"
                      height="85"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'UPA' ? '#3b82f6' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'UPA' ? '2.5' : '1.5'}
                      className="group-hover:stroke-blue-400 transition-all"
                    />
                    <rect x="0" y="0" width="155" height="22" rx="4" fill="#172554" />
                    <text x="10" y="15" fill="#60a5fa" fontSize="11.5" fontWeight="bold">
                      UPA DISTILLATION (VCD)
                    </text>
                    <circle cx="140" cy="11" r="4.5" fill="#10b981" />
                    <text x="10" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      Vapor Compression
                    </text>
                    <text x="10" y="58" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Drum: 1240 RPM
                    </text>
                    <text x="10" y="75" fill="#60a5fa" fontSize="12" fontWeight="bold">
                      Recovery: {subsystems.UPA.efficiencyPct}%
                    </text>
                  </g>

                  {/* NODE: WPA (Water Processor Assembly) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.WPA);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(330, 360)"
                  >
                    <rect
                      width="135"
                      height="85"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'WPA' ? '#38bdf8' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'WPA' ? '2.5' : '1.5'}
                      className="group-hover:stroke-sky-400 transition-all"
                    />
                    <rect x="0" y="0" width="135" height="22" rx="4" fill="#0c4a6e" />
                    <text x="10" y="15" fill="#38bdf8" fontSize="11.5" fontWeight="bold">
                      WPA WATER PROCESSOR
                    </text>
                    <circle cx="122" cy="11" r="4.5" fill="#10b981" />
                    <text x="10" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      Catalytic Reactor
                    </text>
                    <text x="10" y="58" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Oxidizer: 135°C
                    </text>
                    <text x="10" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold">
                      Conductivity: 0.42 μS
                    </text>
                  </g>

                  {/* NODE: TCCS (Trace Contaminant Control Subsystem) */}
                  <g
                    onClick={() => {
                      setSelectedSubsystem(subsystems.TCCS);
                      playBeep(640, 'sine', 0.08);
                    }}
                    className="cursor-pointer group"
                    transform="translate(330, 48)"
                  >
                    <rect
                      width="135"
                      height="85"
                      rx="6"
                      fill="#0B0F17"
                      stroke={selectedSubsystem?.id === 'TCCS' ? '#10b981' : '#1e293b'}
                      strokeWidth={selectedSubsystem?.id === 'TCCS' ? '2.5' : '1.5'}
                      className="group-hover:stroke-emerald-400 transition-all"
                    />
                    <rect x="0" y="0" width="135" height="22" rx="4" fill="#064e3b" />
                    <text x="10" y="15" fill="#34d399" fontSize="11.5" fontWeight="bold">
                      TCCS CATALYTIC OX
                    </text>
                    <circle cx="122" cy="11" r="4.5" fill="#10b981" />
                    <text x="10" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      Trace CO / Volatiles
                    </text>
                    <text x="10" y="58" fill="#cbd5e1" fontSize="11" fontWeight="600">
                      Bed Temp: 315°C
                    </text>
                    <text x="10" y="75" fill="#34d399" fontSize="12" fontWeight="bold">
                      Efficiency: {subsystems.TCCS.efficiencyPct}%
                    </text>
                  </g>

                  {/* CENTER HABITAT VOLUME & CREW RESIDUAL NODE */}
                  <g transform="translate(345, 195)">
                    <rect
                      width="120"
                      height="80"
                      rx="8"
                      fill="#111827"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    <text x="12" y="20" fill="#f8fafc" fontSize="12" fontWeight="bold">
                      HABITAT CABIN
                    </text>
                    <text x="12" y="38" fill="#cbd5e1" fontSize="11.5" fontWeight="bold">
                      Crew: {telemetry.crewPresent} Souls
                    </text>
                    <text x="12" y="54" fill="#06b6d4" fontSize="12" fontWeight="bold">
                      O2: {telemetry.o2Percent}%
                    </text>
                    <text x="12" y="70" fill="#f59e0b" fontSize="12" fontWeight="bold">
                      CO2: {telemetry.co2PartialKpa} kPa
                    </text>
                  </g>
                </svg>
              </div>

              {/* Schematic Quick Diagnostic Callout */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs sm:text-sm bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-200 font-bold">Closed-Loop Recovery Rate:</span>
                  <span className="text-cyan-400 font-black">98.4% (Mass Balance Verified)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <span>Total ECLSS Power Draw:</span>
                  <span className="text-slate-100 font-bold">4.06 kW</span>
                </div>
              </div>
            </section>

            {/* PANE 3: Center-Right Catalytic Reactor Diagnostics & Consumable Tanks (5 cols on lg) */}
            <section className="lg:col-span-5 flex flex-col gap-4">
              {/* SABATIER METHANATION CATALYTIC REACTOR CARD */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3 sm:p-4 shadow-lg shadow-black/40">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 uppercase">
                      Sabatier Methanation Reactor Diagnostics
                    </h2>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
                    sabatierCycling
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300 animate-pulse'
                      : sabatierTemp > 430
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
                  }`}>
                    {sabatierCycling ? 'REGEN CYCLE' : sabatierTemp > 430 ? 'EXOTHERM WARN' : 'STABILIZED'}
                  </span>
                </div>

                {/* Primary Temp Readout & Thermocouple Gradient */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                    <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block">
                      Catalyst Bed Temp (T-Core)
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className={`text-2xl md:text-3xl font-black ${
                        sabatierTemp > 430 ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {sabatierTemp.toFixed(1)}
                      </span>
                      <span className="text-sm text-amber-400 font-bold">°C</span>
                    </div>
                    <span className="text-xs text-slate-300 mt-1 block font-medium">
                      Nominal Setpoint: 400.0 °C
                    </span>
                  </div>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3">
                    <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold block">
                      Single-Pass Yield
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl md:text-3xl font-black text-cyan-300">
                        {sabatierConversionEff.toFixed(1)}
                      </span>
                      <span className="text-sm text-cyan-400 font-bold">%</span>
                    </div>
                    <span className="text-xs text-slate-300 mt-1 block font-medium">
                      CH4 Overboard: {ch4VentRateKgh} kg/h
                    </span>
                  </div>
                </div>

                {/* Reactor PID Heater Duty Cycle & Bed Thermocouple Visualizer */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">Nichrome Pre-Heater Duty Cycle:</span>
                    <span className="text-slate-100 font-bold">{sabatierDutyCycle.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${sabatierDutyCycle}%` }}
                    />
                  </div>

                  {/* Multi-point Thermocouple Profile */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">T1 (Inlet): </span>
                      <span className="text-slate-200 font-bold">342°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400">T2 (Catalyst Center): </span>
                      <span className="text-amber-400 font-bold">{sabatierTemp.toFixed(1)}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400">T3 (Exhaust HX): </span>
                      <span className="text-slate-200 font-bold">168°C</span>
                    </div>
                  </div>
                </div>

                {/* Sabatier Quick Actions */}
                <div className="flex items-center gap-2.5">
                  <button
                    disabled={sabatierCycling}
                    onClick={triggerCycleSabatier}
                    className="flex-1 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-md text-amber-200 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className={`w-4 h-4 ${sabatierCycling ? 'animate-spin' : ''}`} />
                    <span>Cycle Sabatier Bed</span>
                  </button>

                  <button
                    onClick={triggerFlushCondensate}
                    className="flex-1 py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-md text-blue-200 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Flush Condensate HX</span>
                  </button>
                </div>
              </div>

              {/* CONSUMABLE TANK GAUGES CARD */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3 sm:p-4 shadow-lg shadow-black/40 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 uppercase">
                      Consumable Tank Telemetry & Autonomy Reserves
                    </h2>
                  </div>
                  <span className="text-xs sm:text-sm text-cyan-400 font-mono font-bold">AUTONOMY: 184 DAYS</span>
                </div>

                <div className="space-y-3">
                  {tanks.map((tank) => {
                    const pct = Math.min(100, Math.max(0, (tank.current / tank.capacity) * 100));
                    return (
                      <div
                        key={tank.id}
                        className="bg-[#0F172A] border border-slate-850 rounded-lg p-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                          <div className="flex items-center gap-2.5">
                            {tank.icon === 'droplets' && <Droplets className="w-4 h-4 text-cyan-400" />}
                            {tank.icon === 'wind' && <Wind className="w-4 h-4 text-teal-400" />}
                            {tank.icon === 'gauge' && <Gauge className="w-4 h-4 text-sky-400" />}
                            <div>
                              <div className="font-bold text-slate-100 text-xs sm:text-sm">{tank.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{tank.code}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-bold text-slate-100">
                              {tank.current.toFixed(1)}{' '}
                              <span className="text-xs font-medium text-slate-400">/ {tank.capacity} {tank.unit}</span>
                            </span>
                            <div className="text-xs sm:text-sm text-cyan-400 font-extrabold">{pct.toFixed(1)}% CAPACITY</div>
                          </div>
                        </div>

                        {/* Progress meter */}
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full transition-all duration-500 ${
                              tank.id === 'tank-h2o'
                                ? 'bg-cyan-400'
                                : tank.id === 'tank-lox'
                                ? 'bg-teal-400'
                                : 'bg-sky-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium">
                          <span>Press: {tank.pressureMpa} MPa</span>
                          <span>Temp: {tank.tempK} K</span>
                          <span className={tank.consumptionRatePerHour >= 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                            Rate: {tank.consumptionRatePerHour >= 0 ? '+' : ''}{tank.consumptionRatePerHour} {tank.unit}/h
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Mass Autonomy Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Cryo Boil-Off Mitigation: <strong className="text-emerald-400 font-bold">ACTIVE</strong></span>
                  <span>Hull Cryo Vent: <strong className="text-slate-100 font-bold">SEALED</strong></span>
                </div>
              </div>
            </section>
          </div>

          {/* =========================================================================
              PANE 4 (BOTTOM): ATMOSPHERE NODE MANIFEST & FILTER REPLACEMENT LEDGER
             ========================================================================= */}
          <section className="bg-[#0B0F17] border border-slate-800 rounded-lg p-3 sm:p-4 shadow-lg shadow-black/40">
            {/* Header Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 uppercase">
                  Atmosphere Node Manifest & Filter Replacement Ledger
                </h2>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-md border border-slate-800 text-xs sm:text-sm">
                <button
                  onClick={() => setActiveTab('NODES')}
                  className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-colors ${
                    activeTab === 'NODES'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Active Modules ({nodes.length})
                </button>
                <button
                  onClick={() => setActiveTab('CANISTERS')}
                  className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-colors ${
                    activeTab === 'CANISTERS'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Filter & Canister Health
                </button>
                <button
                  onClick={() => setActiveTab('SCHEMATIC_INSPECT')}
                  className={`px-3.5 py-1.5 rounded font-bold cursor-pointer transition-colors ${
                    activeTab === 'SCHEMATIC_INSPECT'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Maintenance History ({maintenanceLogs.length})
                </button>
              </div>
            </div>

            {/* TAB CONTENT: ACTIVE MODULES LEDGER */}
            {activeTab === 'NODES' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#0F172A] text-slate-300 uppercase text-xs font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3.5">Module Code & Name</th>
                      <th className="py-3 px-3.5">Respiration Load (O2 / CO2)</th>
                      <th className="py-3 px-3.5">LiOH Scrubber Saturation</th>
                      <th className="py-3 px-3.5">HEPA Filter ΔP (Pa)</th>
                      <th className="py-3 px-3.5">Vent Fan RPM</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {nodes.map((node) => {
                      const isLiOHHigh = node.liohSaturationPct >= 65.0;
                      const isHEPAHigh = node.hepaDeltaPPa >= 240;

                      return (
                        <tr key={node.id} className="hover:bg-slate-900/60 transition-colors">
                          {/* Module Code */}
                          <td className="py-3 px-3.5 font-semibold text-slate-200">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                              <div>
                                <div className="font-extrabold text-slate-100 text-xs sm:text-sm">{node.code}</div>
                                <div className="text-xs text-slate-400 font-normal">{node.name}</div>
                              </div>
                            </div>
                          </td>

                          {/* Respiration Load */}
                          <td className="py-3 px-3.5">
                            <div className="text-slate-100 font-bold text-xs sm:text-sm">
                              {node.metabolicO2KgDay.toFixed(2)} kg/d <span className="text-xs font-medium text-slate-400">O2</span>
                            </div>
                            <div className="text-xs text-amber-400 font-medium mt-0.5">
                              +{node.metabolicCO2KgDay.toFixed(2)} kg/d CO2 ({node.crewCount} crew)
                            </div>
                          </td>

                          {/* LiOH Scrubber */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                              <span className={isLiOHHigh ? 'text-amber-400 font-extrabold' : 'text-slate-200 font-bold'}>
                                {node.liohSaturationPct.toFixed(1)}%
                              </span>
                              <span className="text-xs text-slate-400 font-medium">MAX 85%</span>
                            </div>
                            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  isLiOHHigh ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                                style={{ width: `${node.liohSaturationPct}%` }}
                              />
                            </div>
                          </td>

                          {/* HEPA Delta P */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-baseline gap-1">
                              <span className={`font-black text-xs sm:text-sm ${isHEPAHigh ? 'text-rose-400' : 'text-slate-100'}`}>
                                {node.hepaDeltaPPa.toFixed(0)}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">Pa</span>
                            </div>
                            <span className="text-xs text-slate-400 font-normal">Nom: 120-180 Pa</span>
                          </td>

                          {/* Fan RPM */}
                          <td className="py-3 px-3.5 text-slate-200 font-mono font-bold text-xs sm:text-sm">
                            {node.fanRpm} <span className="text-xs font-normal text-slate-400">RPM</span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded border ${
                              node.status === 'WARNING' || isHEPAHigh || isLiOHHigh
                                ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                                : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
                            }`}>
                              {node.status === 'WARNING' || isHEPAHigh || isLiOHHigh ? 'SERVICE REQ' : 'NOMINAL'}
                            </span>
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => triggerSwapLiOH(node.code)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs font-bold cursor-pointer transition-colors"
                                title="Swap spent LiOH Canister with fresh canister"
                              >
                                Swap LiOH
                              </button>
                              <button
                                onClick={() => triggerServiceHEPA(node.code)}
                                className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 rounded text-xs font-bold cursor-pointer transition-colors"
                                title="Perform HEPA filter back-pulse or cartridge swap"
                              >
                                Service HEPA
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

            {/* TAB CONTENT: CANISTER & FILTER MATRIX */}
            {activeTab === 'CANISTERS' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      Lithium Hydroxide (LiOH) Array
                    </span>
                    <span className="text-xs text-cyan-400 font-bold">6 / 6 ONLINE</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    Backup non-regenerative chemical scrubbers providing localized CO2 capture in individual pressure hulls during high-metabolic EVA egress and sleep cycles.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Reserve Canisters in Airlock:</span>
                      <strong className="text-slate-100 font-bold">18 Units</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Average Depletion Rate:</span>
                      <strong className="text-slate-100 font-bold">1.8 kg LiOH / day</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-teal-400" />
                      Particulate HEPA Cartridges
                    </span>
                    <span className="text-xs text-teal-400 font-bold">99.97% CAPTURE</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    Multi-stage airborne dust, skin shed, and lunar regolith particulate filtration units rated for 0.3-micron particulate arrestance under microgravity ventilation.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Pressure Differential Max:</span>
                      <strong className="text-slate-100 font-bold">260 Pa</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Automatic Back-Pulse:</span>
                      <strong className="text-emerald-400 font-bold">ARMED</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Activated Charcoal & Ruthenium Bed
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">100% REGEN</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    Catalytic oxidizer and impregnated carbon media for ammonia, benzene, carbon monoxide, and dichloromethane trace decontamination loops.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Pre-Conditioner Life Remaining:</span>
                      <strong className="text-slate-100 font-bold">8,420 Hours</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Catalyst Bed Contamination:</span>
                      <strong className="text-emerald-400 font-bold">&lt; 0.02%</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MAINTENANCE HISTORY */}
            {activeTab === 'SCHEMATIC_INSPECT' && (
              <div className="space-y-2.5">
                <div className="text-xs text-slate-300 mb-2 font-medium">
                  Chronological institutional ledger of automated and commander-initiated life support actions:
                </div>
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg bg-[#0F172A] overflow-hidden">
                  {maintenanceLogs.map((log) => (
                    <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-900/60">
                      <div className="flex items-start gap-3">
                        <Wrench className="w-4 h-4 text-cyan-400 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-100">{log.action}</span>
                            <span className="text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
                              {log.targetNode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{log.detail}</p>
                        </div>
                      </div>

                      <div className="text-right text-xs font-mono text-slate-300">
                        <div className="text-slate-200 font-semibold">{log.timestamp}</div>
                        <div className="text-slate-400">BY: {log.operator}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>

        {/* =========================================================================
            MODAL 1: SUBSYSTEM DIAGNOSTIC INSPECTOR MODAL
           ========================================================================= */}
        {selectedSubsystem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-cyan-500/50 rounded-lg max-w-lg w-full p-4 sm:p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-950/60 border border-cyan-500/40 rounded text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                      SUBSYSTEM DIAGNOSTIC TELEMETRY
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{selectedSubsystem.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubsystem(null)}
                  className="text-slate-400 hover:text-slate-100 text-xs px-2 py-1 bg-slate-800 rounded cursor-pointer"
                >
                  ESC ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-[#0F172A] p-2.5 rounded border border-slate-800">
                {selectedSubsystem.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {selectedSubsystem.primaryMetricLabel}
                  </span>
                  <span className="text-base font-black text-cyan-400 mt-1 block">
                    {selectedSubsystem.primaryMetricValue}
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {selectedSubsystem.secondaryMetricLabel}
                  </span>
                  <span className="text-base font-black text-teal-400 mt-1 block">
                    {selectedSubsystem.secondaryMetricValue}
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Power Consumption
                  </span>
                  <span className="text-base font-black text-amber-400 mt-1 block">
                    {selectedSubsystem.powerWatts} Watts
                  </span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Subsystem Valve Matrix
                  </span>
                  <span className="text-base font-black text-emerald-400 mt-1 block">
                    {selectedSubsystem.valveState}
                  </span>
                </div>
              </div>

              {/* Process Inputs & Outputs */}
              <div className="space-y-2 mb-4 text-[11px]">
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase block mb-1">Process Feed Inputs:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {selectedSubsystem.inputs.map((inp, idx) => (
                      <li key={idx}>{inp}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-bold uppercase block mb-1">Effluent Stream Outputs:</span>
                  <ul className="list-disc list-inside text-cyan-300 space-y-0.5">
                    {selectedSubsystem.outputs.map((outp, idx) => (
                      <li key={idx}>{outp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Subsystem Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playBeep(720, 'sine', 0.1);
                    setBannerAlert(`${selectedSubsystem.name} SELF-CALIBRATION ROUTINE COMPLETED.`);
                    setSelectedSubsystem(null);
                  }}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors"
                >
                  Run Calibration Cycle
                </button>
                <button
                  onClick={() => {
                    playBeep(450, 'sawtooth', 0.1);
                    setBannerAlert(`${selectedSubsystem.name} LINE PURGE TRIGGERED.`);
                    setSelectedSubsystem(null);
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded border border-slate-700 cursor-pointer transition-colors"
                >
                  Purge Line
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 2: RAPID DECOMPRESSION NITROGEN FLUSH CONFIRMATION INTERLOCK
           ========================================================================= */}
        {showDecompModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border-2 border-rose-500 rounded-lg max-w-md w-full p-5 shadow-[0_0_40px_rgba(244,63,94,0.4)]">
              <div className="flex items-center gap-3 mb-3 text-rose-400">
                <div className="p-2.5 bg-rose-950/80 rounded border border-rose-500 animate-pulse">
                  <AlertOctagon className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-wider text-rose-200 uppercase">
                    Safety Interlock Override
                  </h3>
                  <span className="text-[10px] text-rose-400 font-mono">
                    PROTOCOL 77-ALPHA // NITROGEN DUMP
                  </span>
                </div>
              </div>

              <div className="bg-rose-950/40 border border-rose-600/40 p-3 rounded mb-4 text-xs text-rose-200 leading-relaxed">
                <strong>WARNING:</strong> This action will bypass all software dampers and discharge high-pressure Liquid Nitrogen buffer tanks directly into all active habitat ducts at 48 kg/min.
                <ul className="list-disc list-inside mt-2 text-[11px] text-rose-300 space-y-1">
                  <li>Use ONLY during confirmed micrometeoroid hull breach or rapid depressurization.</li>
                  <li>Crew must don emergency masks to avoid localized hypoxic pockets.</li>
                  <li>Buffer reserve will deplete by ~36 L over 15 seconds.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDecompModal(false);
                    setInterlockArmState(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  Abort Override
                </button>
                <button
                  onClick={executeRapidDecompFlush}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase rounded shadow-lg shadow-rose-900/50 cursor-pointer transition-all animate-pulse"
                >
                  Confirm Full N2 Dump
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER AVIONICS TELEMETRY STATUS BAR */}
        <footer className="border-t border-slate-800 bg-[#0B0F17]/95 px-4 py-2.5 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-medium">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              AVIONICS TELEMETRY LINK 100% OK
            </span>
            <span>DATA BUS: MIL-STD-1553B</span>
            <span>STATION ATTITUDE: +0.02° PITCH // -0.01° YAW</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-200 font-bold">VANGUARD FLIGHT OS v4.8.2-ECLSS</span>
            <span className="text-cyan-400 font-bold">ENCRYPTED // DUAL-REDUNDANT</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default OrbitalECLSSControl;
