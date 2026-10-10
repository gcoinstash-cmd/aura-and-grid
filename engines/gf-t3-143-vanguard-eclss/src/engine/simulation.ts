/**
 * Vanguard-ECLSS: Autonomous Closed-Loop Environmental Control & Life Support System
 * Simulation Orchestrator & Deterministic Telemetry Streamer
 */

import {
  AtmosphericState,
  ConsumableReserves,
  CrewMetabolicProfile,
  FDIRIncident,
  HydrologicState,
  MPCControllerState,
  ReactorState,
  TelemetrySnapshot,
} from '../types/eclss';
import {
  calculateActualVaporPressure,
  calculateDewPoint,
  calculateEnthalpy,
  solveElectrolyzerFaraday,
  solveMimoMpcStep,
  solveSabatierKinetics,
} from './physics';

export const INITIAL_CREW: CrewMetabolicProfile = {
  crewCount: 6,
  metabolicActivity: 'NOMINAL',
  o2ConsumptionKgPerDayPerCrew: 0.84,
  co2ProductionKgPerDayPerCrew: 1.00,
  metabolicWaterProductionLPerDay: 0.35,
  perspirationLPerDay: 1.80,
  urineProductionLPerDay: 1.50,
  heatOutputWattsPerCrew: 120,
};

export const INITIAL_ATMOSPHERE: AtmosphericState = {
  totalPressureKpa: 101.325,
  ppO2Kpa: 21.28,
  ppCO2Kpa: 0.36,
  ppN2Kpa: 78.42,
  ppH2OKpa: 1.265,
  temperatureCelsius: 21.5,
  relativeHumidityPct: 45.2,
  dewPointCelsius: 9.3,
  enthalpyKjPerKg: 42.8,
  traceVocPpm: 0.018,
  coPpm: 1.15,
  ch4Ppm: 3.42,
};

export const INITIAL_HYDROLOGIC: HydrologicState = {
  greywaterInflowLph: 3.85,
  urineDistillateInflowLph: 1.25,
  potableYieldLph: 5.02,
  recoveryEfficiencyPct: 98.4,
  catalyticOxidizerTempC: 135.0,
  totalOrganicCarbonPpb: 120.0,
  filterSaturationIndexPct: 14.5,
  potableBufferLiters: 418.0,
  wasteBufferLiters: 42.0,
};

export const INITIAL_REACTOR: ReactorState = {
  sabatierTempC: 402.5,
  sabatierPressureKpa: 152.0,
  sabatierCo2FeedRateSccm: 850.0,
  sabatierH2FeedRateSccm: 3400.0,
  sabatierMethaneYieldSccm: 805.8,
  sabatierWaterYieldSccm: 1611.6,
  sabatierConversionEfficiencyPct: 94.8,
  sabatierStatus: 'NOMINAL',

  electrolyzerCurrentAmps: 58.5,
  electrolyzerVoltageVolts: 28.2,
  electrolyzerStackTempC: 64.8,
  electrolyzerO2ProdSccm: 840.0,
  electrolyzerH2ProdSccm: 1680.0,
  cellDegradationIndexPct: 4.2,
  electrolyzerStatus: 'NOMINAL',

  tccsBedTempC: 298.5,
  tccsFlowRateCfm: 50.0,
  tccsStatus: 'ACTIVE',
};

export const INITIAL_RESERVES: ConsumableReserves = {
  storedO2Kg: 780.0,
  storedN2Kg: 1650.0,
  storedH2Kg: 48.5,
  storedPotableWaterL: 940.0,
  co2ScrubberBedRemainingHours: 4200,
  calculatedMarginDays: 182.5,
};

export const INITIAL_MPC: MPCControllerState = {
  stepBudgetMs: 6.5,
  lastExecutionTimeMs: 1.18,
  horizonSteps: 20,
  quadraticCost: 4.82,
  solverIterations: 4,
  activeConstraintsCount: 0,
  controlInputs: {
    o2InjectionRateGps: 0.058,
    n2InjectionRateGps: 0.012,
    co2ScrubberBlowerDutyPct: 52.4,
    condensingHeatExchangerTempC: 9.8,
  },
};

export class ECLSSSimulationEngine {
  private atmosphere: AtmosphericState = { ...INITIAL_ATMOSPHERE };
  private hydrologic: HydrologicState = { ...INITIAL_HYDROLOGIC };
  private reactor: ReactorState = { ...INITIAL_REACTOR };
  private reserves: ConsumableReserves = { ...INITIAL_RESERVES };
  private mpc: MPCControllerState = { ...INITIAL_MPC };
  private crew: CrewMetabolicProfile = { ...INITIAL_CREW };
  private activeIncidents: FDIRIncident[] = [];
  private history: TelemetrySnapshot[] = [];
  private maxHistoryLength = 60;
  private autoControlEnabled = true;

  // Anomaly overrides
  private decompressionActive = false;
  private sabatierQuenchActive = false;
  private electrolyzerDegradationActive = false;

  constructor() {
    // Populate initial 20 historical points
    for (let i = 20; i >= 0; i--) {
      const pastTime = new Date(Date.now() - i * 1000).toISOString();
      this.history.push({
        timestampUtc: pastTime,
        nodeId: 'VANGUARD-OUTPOST-01',
        atmospheric: { ...this.atmosphere },
        hydrologic: { ...this.hydrologic },
        reactor: { ...this.reactor },
        mpc: { ...this.mpc },
        crew: { ...this.crew },
        reserves: { ...this.reserves },
        activeIncidents: [],
        systemHealthScore: 99.4,
      });
    }
  }

  public setCrew(profile: Partial<CrewMetabolicProfile>) {
    this.crew = { ...this.crew, ...profile };
  }

  public setAutoControl(enabled: boolean) {
    this.autoControlEnabled = enabled;
  }

  public triggerAnomaly(type: 'DECOMPRESSION' | 'SABATIER_QUENCH' | 'ELECTROLYZER_DEGRADE' | 'VOC_SPIKE') {
    const timestamp = new Date().toISOString();
    const id = `INC-${Date.now().toString(36).toUpperCase()}`;

    if (type === 'DECOMPRESSION') {
      this.decompressionActive = true;
      this.activeIncidents.push({
        id,
        timestampUtc: timestamp,
        subsystem: 'ATMOSPHERE',
        severity: 'CRITICAL',
        anomalyCode: 'ERR_ATM_DP_RATE_07X',
        description: 'Rapid Barometric Delta-P detected (-0.18 kPa/s). Micro-meteoroid breach or hatch seal compromise suspected.',
        rootCauseProbability: [
          { hypothesis: 'Module Alpha Outer Seal Failure', probability: 0.74 },
          { hypothesis: 'Micrometeorite Penetration in Bay 3', probability: 0.22 },
          { hypothesis: 'Relief Valve Stuck Open (RV-102)', probability: 0.04 },
        ],
        mitigationProtocol: 'ENGAGE_ISOLATION_SECTOR_A + HIGH_FLOW_N2_INJECTION',
        isolationValvesEngaged: ['ISO-V101-ALPHA', 'ISO-V102-ALPHA-RETURN'],
        resolved: false,
      });
    } else if (type === 'SABATIER_QUENCH') {
      this.sabatierQuenchActive = true;
      this.activeIncidents.push({
        id,
        timestampUtc: timestamp,
        subsystem: 'SABATIER',
        severity: 'WARNING',
        anomalyCode: 'ERR_SAB_CAT_TEMP_DROP',
        description: 'Sabatier catalyst bed temperature dropped below 340°C. Methanation reaction quenching with unreacted CO2 pass-through.',
        rootCauseProbability: [
          { hypothesis: 'Pre-Heater Element 2 Failure', probability: 0.65 },
          { hypothesis: 'H2/CO2 Ratio Mismatch (Stoichiometric Excess)', probability: 0.28 },
          { hypothesis: 'Ru/Al2O3 Catalyst Bed Sulfur Poisoning', probability: 0.07 },
        ],
        mitigationProtocol: 'ACTIVATE_AUX_HEATER_B + RECIRCULATE_CO2_BUFFER',
        isolationValvesEngaged: ['SAB-V204-VENT', 'SAB-V208-RECIRC'],
        resolved: false,
      });
    } else if (type === 'ELECTROLYZER_DEGRADE') {
      this.electrolyzerDegradationActive = true;
      this.reactor.cellDegradationIndexPct = 28.5;
      this.activeIncidents.push({
        id,
        timestampUtc: timestamp,
        subsystem: 'ELECTROLYZER',
        severity: 'WARNING',
        anomalyCode: 'ERR_OGS_CELL_VOLTAGE_DRIFT',
        description: 'Cell voltage dispersion exceeding 180 mV delta. Proton Exchange Membrane resistance increasing.',
        rootCauseProbability: [
          { hypothesis: 'Anode Catalyst Layer Delamination', probability: 0.58 },
          { hypothesis: 'Deionized Feedwater Conductivity Spike (>0.1 uS/cm)', probability: 0.33 },
          { hypothesis: 'Cathode Gas Diffusion Layer Flooding', probability: 0.09 },
        ],
        mitigationProtocol: 'CURRENT_DERATE_20PCT + STACK_NITROGEN_PURGE',
        isolationValvesEngaged: ['OGS-V301-PURGE'],
        resolved: false,
      });
    } else if (type === 'VOC_SPIKE') {
      this.atmosphere.traceVocPpm = 0.42;
      this.activeIncidents.push({
        id,
        timestampUtc: timestamp,
        subsystem: 'TCCS',
        severity: 'ADVISORY',
        anomalyCode: 'ERR_TCCS_VOC_ELEVATED',
        description: 'Volatile organic compound concentration spike detected in Crew Quarters loop.',
        rootCauseProbability: [
          { hypothesis: 'Polymer Off-Gassing from Cargo Container 4', probability: 0.52 },
          { hypothesis: 'TCCS Sorbent Charcoal Bed Saturation', probability: 0.38 },
          { hypothesis: 'Solvent Spill in Science Glovebox', probability: 0.10 },
        ],
        mitigationProtocol: 'TCCS_BLOWER_OVERDRIVE_MAX + CATALYTIC_OXIDIZER_320C',
        isolationValvesEngaged: ['TCCS-V402-MAXFLOW'],
        resolved: false,
      });
    }
  }

  public resolveIncident(incidentId: string) {
    const inc = this.activeIncidents.find((i) => i.id === incidentId);
    if (inc) {
      inc.resolved = true;
    }
    // Remove if resolved or revert anomaly flags
    this.activeIncidents = this.activeIncidents.filter((i) => !i.resolved);
    if (!this.activeIncidents.some((i) => i.subsystem === 'ATMOSPHERE')) this.decompressionActive = false;
    if (!this.activeIncidents.some((i) => i.subsystem === 'SABATIER')) this.sabatierQuenchActive = false;
    if (!this.activeIncidents.some((i) => i.subsystem === 'ELECTROLYZER')) {
      this.electrolyzerDegradationActive = false;
      this.reactor.cellDegradationIndexPct = 4.2;
    }
  }

  public resolveAllIncidents() {
    this.activeIncidents = [];
    this.decompressionActive = false;
    this.sabatierQuenchActive = false;
    this.electrolyzerDegradationActive = false;
    this.reactor.cellDegradationIndexPct = 4.2;
    this.atmosphere.traceVocPpm = 0.018;
  }

  public stepTick(dtSeconds: number = 1.0): TelemetrySnapshot {
    // 1. Solve MIMO-MPC control output
    const mpcResult = solveMimoMpcStep(this.atmosphere, this.crew, dtSeconds);

    this.mpc = {
      stepBudgetMs: 6.5,
      lastExecutionTimeMs: mpcResult.executionDurationMs,
      horizonSteps: 20,
      quadraticCost: mpcResult.quadraticCost,
      solverIterations: 4 + Math.floor(Math.random() * 2),
      activeConstraintsCount: mpcResult.activeConstraintViolations.length,
      controlInputs: {
        o2InjectionRateGps: mpcResult.suggestedO2InjectionGps,
        n2InjectionRateGps: mpcResult.suggestedN2InjectionGps,
        co2ScrubberBlowerDutyPct: mpcResult.suggestedCo2ScrubberDutyPct,
        condensingHeatExchangerTempC: mpcResult.suggestedChxTempC,
      },
    };

    // 2. Anomaly Modifiers
    let leakRateKpa = 0.0;
    if (this.decompressionActive) {
      leakRateKpa = 0.15; // Loss of pressure
    }

    if (this.sabatierQuenchActive) {
      this.reactor.sabatierTempC = Math.max(310.0, this.reactor.sabatierTempC - 2.5 * dtSeconds);
      this.reactor.sabatierStatus = 'COOLING_OVERDRIVE';
    } else {
      this.reactor.sabatierTempC = Math.min(403.0, this.reactor.sabatierTempC + 1.2 * dtSeconds);
      this.reactor.sabatierStatus = 'NOMINAL';
    }

    // 3. Sabatier & Electrolyzer Kinetics
    const sabatierSol = solveSabatierKinetics(
      this.reactor.sabatierCo2FeedRateSccm,
      this.reactor.sabatierH2FeedRateSccm,
      this.reactor.sabatierTempC,
      this.reactor.sabatierPressureKpa
    );
    this.reactor.sabatierMethaneYieldSccm = sabatierSol.ch4YieldSccm;
    this.reactor.sabatierWaterYieldSccm = sabatierSol.waterYieldSccm;
    this.reactor.sabatierConversionEfficiencyPct = sabatierSol.conversionEfficiencyPct;

    const electrolyzerSol = solveElectrolyzerFaraday(
      this.reactor.electrolyzerCurrentAmps,
      this.reactor.electrolyzerVoltageVolts,
      24,
      this.reactor.cellDegradationIndexPct
    );
    this.reactor.electrolyzerO2ProdSccm = electrolyzerSol.o2ProducedSccm;
    this.reactor.electrolyzerH2ProdSccm = electrolyzerSol.h2ProducedSccm;

    // 4. Update Atmospheric State
    if (this.autoControlEnabled) {
      // Natural noise fluctuation
      const noise = (Math.random() - 0.5) * 0.01;
      
      let nextPpO2 = mpcResult.predictedState.ppO2Kpa + noise;
      let nextPpCO2 = mpcResult.predictedState.ppCO2Kpa + noise * 0.5;
      let nextPpN2 = mpcResult.predictedState.ppN2Kpa - leakRateKpa * 0.78;
      let nextPtot = nextPpO2 + nextPpCO2 + nextPpN2 + this.atmosphere.ppH2OKpa - leakRateKpa;

      let nextRh = mpcResult.predictedState.relativeHumidityPct + (Math.random() - 0.5) * 0.1;
      let nextDewPoint = calculateDewPoint(this.atmosphere.temperatureCelsius, nextRh);
      let nextEnthalpy = calculateEnthalpy(this.atmosphere.temperatureCelsius, nextRh, nextPtot);

      let nextVoc = Math.max(0.015, this.atmosphere.traceVocPpm - 0.002 * dtSeconds);

      this.atmosphere = {
        totalPressureKpa: Math.round(nextPtot * 1000) / 1000,
        ppO2Kpa: Math.round(nextPpO2 * 1000) / 1000,
        ppCO2Kpa: Math.round(nextPpCO2 * 1000) / 1000,
        ppN2Kpa: Math.round(nextPpN2 * 1000) / 1000,
        ppH2OKpa: Math.round(calculateActualVaporPressure(this.atmosphere.temperatureCelsius, nextRh) * 1000) / 1000,
        temperatureCelsius: 21.5 + (Math.random() - 0.5) * 0.1,
        relativeHumidityPct: Math.round(nextRh * 10) / 10,
        dewPointCelsius: Math.round(nextDewPoint * 10) / 10,
        enthalpyKjPerKg: Math.round(nextEnthalpy * 10) / 10,
        traceVocPpm: Math.round(nextVoc * 1000) / 1000,
        coPpm: 1.15 + (Math.random() - 0.5) * 0.02,
        ch4Ppm: 3.42 + (Math.random() - 0.5) * 0.05,
      };
    }

    // 5. Update Hydrologic recovery
    const crewPerspirationLph = (this.crew.perspirationLPerDay * this.crew.crewCount) / 24.0;
    const sabatierWaterLph = sabatierSol.waterYieldLitersPerHour;
    this.hydrologic.potableYieldLph = Math.round((crewPerspirationLph * 0.984 + sabatierWaterLph) * 100) / 100;
    this.hydrologic.potableBufferLiters = Math.min(500, this.hydrologic.potableBufferLiters + (this.hydrologic.potableYieldLph - (this.crew.crewCount * 2.5 / 24)) * (dtSeconds / 3600));

    // 6. Calculate System Health Score
    let health = 100.0;
    if (this.activeIncidents.some((i) => i.severity === 'CRITICAL')) health -= 35;
    if (this.activeIncidents.some((i) => i.severity === 'WARNING')) health -= 15;
    if (this.activeIncidents.some((i) => i.severity === 'ADVISORY')) health -= 5;
    if (this.atmosphere.ppO2Kpa < 19.5 || this.atmosphere.ppO2Kpa > 23.1) health -= 10;
    if (this.atmosphere.ppCO2Kpa > 0.5) health -= 10;
    health = Math.max(0, Math.min(100, health));

    // 7. Calculate Reserves Margin Days
    const o2BurnPerDay = this.crew.crewCount * this.crew.o2ConsumptionKgPerDayPerCrew;
    const netO2BurnWithLoop = o2BurnPerDay * (1.0 - (this.reactor.sabatierConversionEfficiencyPct / 100.0) * 0.85);
    const marginDays = Math.round((this.reserves.storedO2Kg / Math.max(0.1, netO2BurnWithLoop)) * 10) / 10;
    this.reserves.calculatedMarginDays = marginDays;

    const snapshot: TelemetrySnapshot = {
      timestampUtc: new Date().toISOString(),
      nodeId: 'VANGUARD-OUTPOST-01',
      atmospheric: { ...this.atmosphere },
      hydrologic: { ...this.hydrologic },
      reactor: { ...this.reactor },
      mpc: { ...this.mpc },
      crew: { ...this.crew },
      reserves: { ...this.reserves },
      activeIncidents: [...this.activeIncidents],
      systemHealthScore: Math.round(health * 10) / 10,
    };

    this.history.push(snapshot);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    return snapshot;
  }

  public getLatestSnapshot(): TelemetrySnapshot {
    return this.history[this.history.length - 1] || this.stepTick();
  }

  public getHistory(): TelemetrySnapshot[] {
    return this.history;
  }
}
