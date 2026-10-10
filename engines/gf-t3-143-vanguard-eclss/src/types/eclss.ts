/**
 * Vanguard-ECLSS: Autonomous Closed-Loop Environmental Control & Life Support System
 * Asset Code: GF-T3-143 (Ghost FactoryOS Fleet Track 3 - F1 Skunkworks Engine)
 * 
 * Strict Typed Interfaces for Atmospheric, Hydrologic, Thermodynamic, MPC, and FDIR subsystems.
 */

export interface AtmosphericState {
  totalPressureKpa: number;       // Nominal: 101.325 kPa (Range: 98.0 - 103.4)
  ppO2Kpa: number;                // Nominal: 21.3 kPa (Range: 19.5 - 23.1)
  ppCO2Kpa: number;               // Nominal: 0.35 kPa (Emergency limit: 0.65)
  ppN2Kpa: number;                // Nominal: 78.5 kPa (Balance gas)
  ppH2OKpa: number;               // Partial pressure of water vapor
  temperatureCelsius: number;     // Nominal: 21.5 °C (Range: 18.0 - 25.0)
  relativeHumidityPct: number;    // Nominal: 45.0 % (Range: 35.0 - 60.0)
  dewPointCelsius: number;        // Calculated psychrometric dew point
  enthalpyKjPerKg: number;        // Specific cabin air enthalpy
  traceVocPpm: number;            // Volatile Organic Compounds (Nominal < 0.05 ppm)
  coPpm: number;                  // Carbon Monoxide (Nominal < 2.0 ppm)
  ch4Ppm: number;                 // Methane (Nominal < 10.0 ppm)
}

export interface HydrologicState {
  greywaterInflowLph: number;     // Greywater influx rate (L/hour)
  urineDistillateInflowLph: number; // UPA distillate feed (L/hour)
  potableYieldLph: number;        // Output potable water (L/hour)
  recoveryEfficiencyPct: number;  // Nominal: 98.4%
  catalyticOxidizerTempC: number; // Water Processor Assembly catalytic reactor (°C)
  totalOrganicCarbonPpb: number;  // TOC in potable stream (Limit < 500 ppb)
  filterSaturationIndexPct: number; // Particulate/bed saturation (0-100%)
  potableBufferLiters: number;    // Current stored reserve (Max: 500 L)
  wasteBufferLiters: number;      // Current waste store (Max: 300 L)
}

export interface ReactorState {
  // Sabatier CO2 Reduction Reactor
  sabatierTempC: number;          // Nominal: 400.0 °C (Optimal catalytic window 350-450°C)
  sabatierPressureKpa: number;    // Nominal: 150.0 kPa
  sabatierCo2FeedRateSccm: number;// Standard Cubic Centimeters per Minute
  sabatierH2FeedRateSccm: number; 
  sabatierMethaneYieldSccm: number;
  sabatierWaterYieldSccm: number;
  sabatierConversionEfficiencyPct: number; // Nominal: 94.8%
  sabatierStatus: 'NOMINAL' | 'THERMAL_SOAK' | 'COOLING_OVERDRIVE' | 'OFFLINE';

  // Oxygen Generation Assembly (PEM Electrolysis Stack)
  electrolyzerCurrentAmps: number;// Nominal: 60.0 A
  electrolyzerVoltageVolts: number;// Nominal: 28.4 V
  electrolyzerStackTempC: number; // Nominal: 65.0 °C
  electrolyzerO2ProdSccm: number; // Oxygen output flow
  electrolyzerH2ProdSccm: number; // Hydrogen feed to Sabatier
  cellDegradationIndexPct: number; // 0.0% (Fresh) -> 100% (End of life)
  electrolyzerStatus: 'NOMINAL' | 'PURGING' | 'CELL_BALANCING' | 'EMERGENCY_STOP';

  // Trace Contaminant Control System (TCCS)
  tccsBedTempC: number;           // Catalytic oxidizer (300.0 °C)
  tccsFlowRateCfm: number;        // Cabin loop throughput
  tccsStatus: 'ACTIVE' | 'REGENERATING' | 'BYPASS';
}

export interface MPCControllerState {
  stepBudgetMs: number;           // Hard deadline: 6.5 ms
  lastExecutionTimeMs: number;    // Actual P99 compute latency
  horizonSteps: number;           // Prediction horizon N = 20
  quadraticCost: number;          // J(x, u) objective value
  solverIterations: number;       // Iterations to convergence
  activeConstraintsCount: number; // Bound constraints actively engaged
  controlInputs: {
    o2InjectionRateGps: number;   // Grams per second O2 valve
    n2InjectionRateGps: number;   // Grams per second N2 valve
    co2ScrubberBlowerDutyPct: number; // 0 - 100% CDRA duty
    condensingHeatExchangerTempC: number; // CHX setpoint (4 - 15°C)
  };
}

export interface CrewMetabolicProfile {
  crewCount: number;              // 4 to 12 members
  metabolicActivity: 'REST' | 'NOMINAL' | 'STRENUOUS_EVA';
  o2ConsumptionKgPerDayPerCrew: number; // Baseline: 0.84 kg/day
  co2ProductionKgPerDayPerCrew: number;  // Baseline: 1.00 kg/day
  metabolicWaterProductionLPerDay: number; // Baseline: 0.35 L/day
  perspirationLPerDay: number;    // Baseline: 1.80 L/day
  urineProductionLPerDay: number; // Baseline: 1.50 L/day
  heatOutputWattsPerCrew: number; // Baseline: 120 W
}

export interface ConsumableReserves {
  storedO2Kg: number;             // High-pressure cryo tank (Max: 850 kg)
  storedN2Kg: number;             // High-pressure cryo tank (Max: 1800 kg)
  storedH2Kg: number;             // Buffer tank for Sabatier (Max: 60 kg)
  storedPotableWaterL: number;    // Main reservoir (Max: 1200 L)
  co2ScrubberBedRemainingHours: number; // Sorbent life
  calculatedMarginDays: number;   // Autonomous endurance margin
}

export type FDIRSeverity = 'INFO' | 'ADVISORY' | 'WARNING' | 'CRITICAL';

export interface FDIRIncident {
  id: string;
  timestampUtc: string;
  subsystem: 'ATMOSPHERE' | 'SABATIER' | 'ELECTROLYZER' | 'HYDROLOGIC' | 'TCCS';
  severity: FDIRSeverity;
  anomalyCode: string;
  description: string;
  rootCauseProbability: {
    hypothesis: string;
    probability: number;
  }[];
  mitigationProtocol: string;
  isolationValvesEngaged: string[];
  resolved: boolean;
}

export interface TelemetrySnapshot {
  timestampUtc: string;
  nodeId: string;
  atmospheric: AtmosphericState;
  hydrologic: HydrologicState;
  reactor: ReactorState;
  mpc: MPCControllerState;
  crew: CrewMetabolicProfile;
  reserves: ConsumableReserves;
  activeIncidents: FDIRIncident[];
  systemHealthScore: number;      // 0 - 100
}
