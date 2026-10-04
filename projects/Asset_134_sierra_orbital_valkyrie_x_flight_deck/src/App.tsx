/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Gauge,
  Activity,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  RotateCw,
  Play,
  Square,
  Radio,
  Sliders,
  RefreshCw,
  Power,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
  Unlock,
  Cpu,
  Wind,
  Thermometer,
  Zap,
  Compass,
  Crosshair,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

// --- Type Definitions ---
export type QuadLocation = 'QUAD-FWD-01' | 'QUAD-PORT-02' | 'QUAD-STBD-03' | 'QUAD-AFT-04';
export type AttitudeAxis = '+PITCH' | '-PITCH' | '+ROLL' | '-ROLL' | '+YAW' | '-YAW' | '+SWAY' | '-SWAY';
export type ThrusterStatus = 'NOMINAL' | 'FIRING' | 'STANDBY' | 'ISOLATED' | 'CALIBRATING';

export interface RCSThruster {
  id: string;
  code: string;
  quad: QuadLocation;
  axis: AttitudeAxis;
  role: string;
  chamberPressureBar: number;
  pulseCount: number;
  latencyMs: number;
  nozzleTempC: number;
  dutyCyclePct: number;
  isolated: boolean;
  status: ThrusterStatus;
  xPct: number; // For 2D SVG Spaceplane positioning
  yPct: number;
  vectorAngle: number; // Plume firing angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
}

export interface PropulsionTelemetry {
  altitudeKm: number;
  velocityMps: number;
  velocityMach: number;
  dynamicPressureQ: number; // kPa
  aerospikeThrustKn: number;
  aerospikeChamberPressureBar: number;
  turbopumpRpm: number;
  turbineInletTempK: number;
  heBottlePressureBar: number;
  heRegulatorOutletBar: number;
  mmhTankPressureBar: number;
  ntoTankPressureBar: number;
  mmhPropellantPct: number;
  ntoPropellantPct: number;
  pitchRateDegS: number;
  rollRateDegS: number;
  yawRateDegS: number;
  flightPathAngleDeg: number;
  missionTimeSeconds: number;
  scramArmed: boolean;
  manifoldIsolated: boolean;
}

export interface CommandLog {
  id: string;
  timestamp: string;
  command: string;
  quad: string;
  durationMs: number;
  operator: string;
  result: 'SUCCESS' | 'EXECUTING' | 'ABORTED';
}

// Initial 16 RCS Thrusters mapping (4 Quads x 4 Thrusters)
const INITIAL_THRUSTERS: RCSThruster[] = [
  // FORWARD QUAD (Nose Pitch & Yaw)
  {
    id: 'fwd-01',
    code: 'RCS-F-01',
    quad: 'QUAD-FWD-01',
    axis: '-PITCH',
    role: 'Nose Pitch Down Ventral',
    chamberPressureBar: 14.50,
    pulseCount: 1240,
    latencyMs: 4.12,
    nozzleTempC: 138.4,
    dutyCyclePct: 14.2,
    isolated: false,
    status: 'NOMINAL',
    xPct: 50,
    yPct: 12,
    vectorAngle: 270
  },
  {
    id: 'fwd-02',
    code: 'RCS-F-02',
    quad: 'QUAD-FWD-01',
    axis: '+PITCH',
    role: 'Nose Pitch Up Dorsal',
    chamberPressureBar: 14.45,
    pulseCount: 1180,
    latencyMs: 4.15,
    nozzleTempC: 142.1,
    dutyCyclePct: 13.8,
    isolated: false,
    status: 'NOMINAL',
    xPct: 50,
    yPct: 18,
    vectorAngle: 90
  },
  {
    id: 'fwd-03',
    code: 'RCS-F-03',
    quad: 'QUAD-FWD-01',
    axis: '-YAW',
    role: 'Nose Yaw Port Lateral',
    chamberPressureBar: 14.52,
    pulseCount: 890,
    latencyMs: 3.98,
    nozzleTempC: 115.6,
    dutyCyclePct: 9.4,
    isolated: false,
    status: 'NOMINAL',
    xPct: 45,
    yPct: 15,
    vectorAngle: 180
  },
  {
    id: 'fwd-04',
    code: 'RCS-F-04',
    quad: 'QUAD-FWD-01',
    axis: '+YAW',
    role: 'Nose Yaw Stbd Lateral',
    chamberPressureBar: 14.48,
    pulseCount: 915,
    latencyMs: 4.05,
    nozzleTempC: 118.2,
    dutyCyclePct: 9.8,
    isolated: false,
    status: 'NOMINAL',
    xPct: 55,
    yPct: 15,
    vectorAngle: 0
  },

  // PORT WING QUAD (Roll & Sway)
  {
    id: 'port-01',
    code: 'RCS-P-01',
    quad: 'QUAD-PORT-02',
    axis: '+ROLL',
    role: 'Port Wing Roll Up (Clockwise)',
    chamberPressureBar: 14.55,
    pulseCount: 670,
    latencyMs: 4.22,
    nozzleTempC: 94.3,
    dutyCyclePct: 7.2,
    isolated: false,
    status: 'NOMINAL',
    xPct: 18,
    yPct: 56,
    vectorAngle: 270
  },
  {
    id: 'port-02',
    code: 'RCS-P-02',
    quad: 'QUAD-PORT-02',
    axis: '-ROLL',
    role: 'Port Wing Roll Down (C-Clockwise)',
    chamberPressureBar: 14.50,
    pulseCount: 710,
    latencyMs: 4.20,
    nozzleTempC: 96.8,
    dutyCyclePct: 7.6,
    isolated: false,
    status: 'NOMINAL',
    xPct: 18,
    yPct: 62,
    vectorAngle: 90
  },
  {
    id: 'port-03',
    code: 'RCS-P-03',
    quad: 'QUAD-PORT-02',
    axis: '+SWAY',
    role: 'Port Outboard Lateral Vent',
    chamberPressureBar: 14.42,
    pulseCount: 420,
    latencyMs: 4.30,
    nozzleTempC: 81.5,
    dutyCyclePct: 4.5,
    isolated: false,
    status: 'NOMINAL',
    xPct: 14,
    yPct: 59,
    vectorAngle: 180
  },
  {
    id: 'port-04',
    code: 'RCS-P-04',
    quad: 'QUAD-PORT-02',
    axis: '-SWAY',
    role: 'Port Inboard Counter Vent',
    chamberPressureBar: 14.49,
    pulseCount: 445,
    latencyMs: 4.26,
    nozzleTempC: 83.2,
    dutyCyclePct: 4.8,
    isolated: false,
    status: 'NOMINAL',
    xPct: 22,
    yPct: 59,
    vectorAngle: 0
  },

  // STARBOARD WING QUAD (Roll & Sway)
  {
    id: 'stbd-01',
    code: 'RCS-S-01',
    quad: 'QUAD-STBD-03',
    axis: '-ROLL',
    role: 'Stbd Wing Roll Down (C-Clockwise)',
    chamberPressureBar: 14.52,
    pulseCount: 690,
    latencyMs: 4.18,
    nozzleTempC: 95.1,
    dutyCyclePct: 7.4,
    isolated: false,
    status: 'NOMINAL',
    xPct: 82,
    yPct: 56,
    vectorAngle: 270
  },
  {
    id: 'stbd-02',
    code: 'RCS-S-02',
    quad: 'QUAD-STBD-03',
    axis: '+ROLL',
    role: 'Stbd Wing Roll Up (Clockwise)',
    chamberPressureBar: 14.51,
    pulseCount: 685,
    latencyMs: 4.20,
    nozzleTempC: 94.7,
    dutyCyclePct: 7.3,
    isolated: false,
    status: 'NOMINAL',
    xPct: 82,
    yPct: 62,
    vectorAngle: 90
  },
  {
    id: 'stbd-03',
    code: 'RCS-S-03',
    quad: 'QUAD-STBD-03',
    axis: '-SWAY',
    role: 'Stbd Outboard Lateral Vent',
    chamberPressureBar: 14.45,
    pulseCount: 410,
    latencyMs: 4.32,
    nozzleTempC: 80.8,
    dutyCyclePct: 4.4,
    isolated: false,
    status: 'NOMINAL',
    xPct: 86,
    yPct: 59,
    vectorAngle: 0
  },
  {
    id: 'stbd-04',
    code: 'RCS-S-04',
    quad: 'QUAD-STBD-03',
    axis: '+SWAY',
    role: 'Stbd Inboard Counter Vent',
    chamberPressureBar: 14.47,
    pulseCount: 430,
    latencyMs: 4.28,
    nozzleTempC: 82.0,
    dutyCyclePct: 4.6,
    isolated: false,
    status: 'NOMINAL',
    xPct: 78,
    yPct: 59,
    vectorAngle: 180
  },

  // AFT BASE QUAD (Yaw & Retro Pitch Trim)
  {
    id: 'aft-01',
    code: 'RCS-A-01',
    quad: 'QUAD-AFT-04',
    axis: '-YAW',
    role: 'Aft Tail Yaw Port Vector',
    chamberPressureBar: 14.58,
    pulseCount: 1420,
    latencyMs: 3.92,
    nozzleTempC: 164.2,
    dutyCyclePct: 16.4,
    isolated: false,
    status: 'NOMINAL',
    xPct: 36,
    yPct: 86,
    vectorAngle: 180
  },
  {
    id: 'aft-02',
    code: 'RCS-A-02',
    quad: 'QUAD-AFT-04',
    axis: '+YAW',
    role: 'Aft Tail Yaw Stbd Vector',
    chamberPressureBar: 14.56,
    pulseCount: 1395,
    latencyMs: 3.95,
    nozzleTempC: 161.8,
    dutyCyclePct: 16.1,
    isolated: false,
    status: 'NOMINAL',
    xPct: 64,
    yPct: 86,
    vectorAngle: 0
  },
  {
    id: 'aft-03',
    code: 'RCS-A-03',
    quad: 'QUAD-AFT-04',
    axis: '+PITCH',
    role: 'Aft Base Pitch Trim Dorsal',
    chamberPressureBar: 14.49,
    pulseCount: 1050,
    latencyMs: 4.10,
    nozzleTempC: 132.5,
    dutyCyclePct: 11.2,
    isolated: false,
    status: 'NOMINAL',
    xPct: 42,
    yPct: 91,
    vectorAngle: 90
  },
  {
    id: 'aft-04',
    code: 'RCS-A-04',
    quad: 'QUAD-AFT-04',
    axis: '-PITCH',
    role: 'Aft Base Pitch Trim Ventral',
    chamberPressureBar: 14.51,
    pulseCount: 1080,
    latencyMs: 4.08,
    nozzleTempC: 134.1,
    dutyCyclePct: 11.5,
    isolated: false,
    status: 'NOMINAL',
    xPct: 58,
    yPct: 91,
    vectorAngle: 90
  }
];

export function AerospikeRCSControl() {
  // --- Operational State ---
  const [telemetry, setTelemetry] = useState<PropulsionTelemetry>({
    altitudeKm: 82.40,
    velocityMps: 1740.0,
    velocityMach: 5.12,
    dynamicPressureQ: 2.38,
    aerospikeThrustKn: 245.0,
    aerospikeChamberPressureBar: 88.8,
    turbopumpRpm: 48000,
    turbineInletTempK: 980.0,
    heBottlePressureBar: 350.4,
    heRegulatorOutletBar: 18.5,
    mmhTankPressureBar: 18.18,
    ntoTankPressureBar: 18.38,
    mmhPropellantPct: 82.4,
    ntoPropellantPct: 82.4,
    pitchRateDegS: 0.00,
    rollRateDegS: 0.00,
    yawRateDegS: 0.00,
    flightPathAngleDeg: 3.8,
    missionTimeSeconds: 864,
    scramArmed: false,
    manifoldIsolated: false
  });

  const [thrusters, setThrusters] = useState<RCSThruster[]>(INITIAL_THRUSTERS);
  const [activePlumes, setActivePlumes] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RCS_MATRIX' | 'TURBOPUMP' | 'ATTITUDE_LOGS'>('OVERVIEW');
  const [pulseDuration, setPulseDuration] = useState<number>(35); // milliseconds
  const [aerospikeThrottle, setAerospikeThrottle] = useState<number>(100); // 70% to 105%
  const [autoRateDamping, setAutoRateDamping] = useState<boolean>(true);

  // Modals & Interlocks
  const [showScramModal, setShowScramModal] = useState<boolean>(false);
  const [selectedThruster, setSelectedThruster] = useState<RCSThruster | null>(null);
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([
    {
      id: 'cmd-01',
      timestamp: 'T+14:20.10',
      command: 'RCS_NULL_RATES',
      quad: 'ALL_QUADS',
      durationMs: 40,
      operator: 'GN&C AUTO-ATTITUDE',
      result: 'SUCCESS'
    },
    {
      id: 'cmd-02',
      timestamp: 'T+14:15.42',
      command: 'TRIM_PITCH_DORSAL',
      quad: 'QUAD-FWD-01',
      durationMs: 25,
      operator: 'PILOT STICK VECTOR',
      result: 'SUCCESS'
    },
    {
      id: 'cmd-03',
      timestamp: 'T+14:02.88',
      command: 'HE_REG_CALIBRATE',
      quad: 'PRESS_MANIFOLD',
      durationMs: 120,
      operator: 'PROPULSION ENG 1',
      result: 'SUCCESS'
    }
  ]);

  // Telemetry loop with realistic physics drift and flight progression
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        // If scrammed or isolated, thrust drops
        const targetThrust = prev.scramArmed || prev.manifoldIsolated ? 0 : 245.0 * (aerospikeThrottle / 100);
        const thrustDelta = (targetThrust - prev.aerospikeThrustKn) * 0.15;
        const currentThrust = Math.max(0, prev.aerospikeThrustKn + thrustDelta);

        // Suborbital altitude climb ~ +0.03 km per second in mesosphere
        const newAlt = prev.altitudeKm < 108.5 ? prev.altitudeKm + 0.024 : prev.altitudeKm;
        const newTime = prev.missionTimeSeconds + 1;

        // Mesospheric atmospheric decay -> lower dynamic pressure Q
        const newQ = Math.max(0.05, 2.38 * Math.exp(-(newAlt - 82.4) / 12));
        const updatedVel = Math.min(1820, Number((prev.velocityMps + 0.4).toFixed(1)));

        // Tiny realistic jitter in sensor readings
        const rpmNoise = (Math.random() - 0.5) * 40;
        const tempNoise = (Math.random() - 0.5) * 0.8;
        const pcDrift = (Math.random() - 0.5) * 0.1;

        // Auto rate damping damping effect
        let newPitch = prev.pitchRateDegS;
        let newRoll = prev.rollRateDegS;
        let newYaw = prev.yawRateDegS;
        if (autoRateDamping) {
          newPitch *= 0.82;
          newRoll *= 0.82;
          newYaw *= 0.82;
          if (Math.abs(newPitch) < 0.002) newPitch = 0;
          if (Math.abs(newRoll) < 0.002) newRoll = 0;
          if (Math.abs(newYaw) < 0.002) newYaw = 0;
        }

        return {
          ...prev,
          altitudeKm: Number(newAlt.toFixed(2)),
          velocityMps: updatedVel,
          velocityMach: Number((updatedVel / 340).toFixed(2)),
          dynamicPressureQ: Number(newQ.toFixed(2)),
          aerospikeThrustKn: Number(currentThrust.toFixed(1)),
          aerospikeChamberPressureBar: Number((currentThrust > 10 ? 88.8 + pcDrift : 0.0).toFixed(1)),
          turbopumpRpm: Math.round(currentThrust > 10 ? 48000 + rpmNoise : 0),
          turbineInletTempK: Number((currentThrust > 10 ? 980 + tempNoise : 295.0).toFixed(1)),
          pitchRateDegS: Number(newPitch.toFixed(3)),
          rollRateDegS: Number(newRoll.toFixed(3)),
          yawRateDegS: Number(newYaw.toFixed(3)),
          missionTimeSeconds: newTime
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [aerospikeThrottle, autoRateDamping]);

  // Trigger individual or multi-thruster RCS pulse firing
  const fireThrustersByAxes = (axes: AttitudeAxis[], quadFilter?: QuadLocation) => {
    if (telemetry.manifoldIsolated) return;

    const matchedThrusters = thrusters.filter((t) => {
      if (t.isolated) return false;
      if (quadFilter && t.quad !== quadFilter) return false;
      return axes.includes(t.axis);
    });

    if (matchedThrusters.length === 0) return;

    // Trigger visual plume & chamber pressure spike
    const plumeUpdate: Record<string, boolean> = {};
    matchedThrusters.forEach((t) => {
      plumeUpdate[t.id] = true;
    });
    setActivePlumes((prev) => ({ ...prev, ...plumeUpdate }));

    // Apply attitude rate impulse based on axes
    let pitchImpulse = 0;
    let rollImpulse = 0;
    let yawImpulse = 0;

    matchedThrusters.forEach((t) => {
      const impulse = (pulseDuration / 100) * 0.45;
      if (t.axis === '+PITCH') pitchImpulse += impulse;
      if (t.axis === '-PITCH') pitchImpulse -= impulse;
      if (t.axis === '+ROLL') rollImpulse += impulse;
      if (t.axis === '-ROLL') rollImpulse -= impulse;
      if (t.axis === '+YAW') yawImpulse += impulse;
      if (t.axis === '-YAW') yawImpulse -= impulse;
    });

    setTelemetry((prev) => ({
      ...prev,
      pitchRateDegS: Number((prev.pitchRateDegS + pitchImpulse).toFixed(3)),
      rollRateDegS: Number((prev.rollRateDegS + rollImpulse).toFixed(3)),
      yawRateDegS: Number((prev.yawRateDegS + yawImpulse).toFixed(3)),
      mmhPropellantPct: Math.max(0, Number((prev.mmhPropellantPct - 0.02 * matchedThrusters.length).toFixed(2))),
      ntoPropellantPct: Math.max(0, Number((prev.ntoPropellantPct - 0.03 * matchedThrusters.length).toFixed(2)))
    }));

    // Update thruster status & chamber pressure spike
    setThrusters((prev) =>
      prev.map((t) => {
        if (matchedThrusters.some((m) => m.id === t.id)) {
          return {
            ...t,
            chamberPressureBar: 14.85,
            pulseCount: t.pulseCount + 1,
            nozzleTempC: Number((t.nozzleTempC + 1.2).toFixed(1)),
            status: 'FIRING'
          };
        }
        return t;
      })
    );

    // Append to Command Log
    const newLog: CommandLog = {
      id: `cmd-${Date.now()}`,
      timestamp: `T+${Math.floor(telemetry.missionTimeSeconds / 60)}:${(telemetry.missionTimeSeconds % 60).toString().padStart(2, '0')}`,
      command: `PULSE_${axes.join('_')}`,
      quad: quadFilter || 'SELECTIVE_ARRAY',
      durationMs: pulseDuration,
      operator: 'FLIGHT_DIRECTOR_CONSOLE',
      result: 'SUCCESS'
    };
    setCommandLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    // Reset plumes after pulse duration (min 180ms for visual human persistence)
    setTimeout(() => {
      const resetPlumes: Record<string, boolean> = {};
      matchedThrusters.forEach((t) => {
        resetPlumes[t.id] = false;
      });
      setActivePlumes((prev) => ({ ...prev, ...resetPlumes }));

      setThrusters((prev) =>
        prev.map((t) => {
          if (matchedThrusters.some((m) => m.id === t.id)) {
            return {
              ...t,
              chamberPressureBar: 14.50,
              status: 'NOMINAL'
            };
          }
          return t;
        })
      );
    }, Math.max(180, pulseDuration));
  };

  // Quick Action 1: Null Vehicle Rates
  const handleNullVehicleRates = () => {
    const axesNeeded: AttitudeAxis[] = [];
    if (telemetry.pitchRateDegS > 0.01) axesNeeded.push('-PITCH');
    if (telemetry.pitchRateDegS < -0.01) axesNeeded.push('+PITCH');
    if (telemetry.rollRateDegS > 0.01) axesNeeded.push('-ROLL');
    if (telemetry.rollRateDegS < -0.01) axesNeeded.push('+ROLL');
    if (telemetry.yawRateDegS > 0.01) axesNeeded.push('-YAW');
    if (telemetry.yawRateDegS < -0.01) axesNeeded.push('+YAW');

    if (axesNeeded.length === 0) {
      fireThrustersByAxes(['+PITCH', '-PITCH']);
    } else {
      fireThrustersByAxes(axesNeeded);
    }

    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        pitchRateDegS: 0.00,
        rollRateDegS: 0.00,
        yawRateDegS: 0.00
      }));
    }, 150);
  };

  // Quick Action 2: Calibrate Verniers
  const handleCalibrateVerniers = () => {
    fireThrustersByAxes(['+PITCH', '+ROLL', '+YAW'], 'QUAD-FWD-01');
    setTimeout(() => {
      fireThrustersByAxes(['-PITCH', '-ROLL', '-YAW'], 'QUAD-AFT-04');
    }, 120);
  };

  // Quick Action 3: Test Fire Aft Quad
  const handleTestFireAftQuad = () => {
    fireThrustersByAxes(['-YAW', '+YAW'], 'QUAD-AFT-04');
  };

  // Toggle Thruster Isolation
  const toggleThrusterIsolation = (id: string) => {
    setThrusters((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextIso = !t.isolated;
          return {
            ...t,
            isolated: nextIso,
            status: nextIso ? 'ISOLATED' : 'NOMINAL'
          };
        }
        return t;
      })
    );
  };

  // Toggle Entire Quad Isolation
  const toggleQuadIsolation = (quad: QuadLocation) => {
    setThrusters((prev) => {
      const allCurrentlyIsolated = prev.filter((t) => t.quad === quad).every((t) => t.isolated);
      return prev.map((t) => {
        if (t.quad === quad) {
          return {
            ...t,
            isolated: !allCurrentlyIsolated,
            status: !allCurrentlyIsolated ? 'ISOLATED' : 'NOMINAL'
          };
        }
        return t;
      });
    });
  };

  // Emergency Scram / Manifold Isolation
  const handleExecuteEmergencyScram = () => {
    setTelemetry((prev) => ({
      ...prev,
      scramArmed: true,
      manifoldIsolated: true,
      aerospikeThrustKn: 0.0,
      aerospikeChamberPressureBar: 0.0,
      turbopumpRpm: 0
    }));
    setThrusters((prev) =>
      prev.map((t) => ({
        ...t,
        isolated: true,
        status: 'ISOLATED'
      }))
    );
    setShowScramModal(false);

    const newLog: CommandLog = {
      id: `cmd-${Date.now()}`,
      timestamp: `T+${Math.floor(telemetry.missionTimeSeconds / 60)}:${(telemetry.missionTimeSeconds % 60).toString().padStart(2, '0')}`,
      command: 'CRITICAL_AEROSPIKE_SCRAM_AND_RCS_ISOLATION',
      quad: 'ALL_MANIFOLDS',
      durationMs: 0,
      operator: 'COMMANDER_PHYSICAL_INTERLOCK',
      result: 'ABORTED'
    };
    setCommandLogs((prev) => [newLog, ...prev]);
  };

  // Reset Scram State
  const handleResetScram = () => {
    setTelemetry((prev) => ({
      ...prev,
      scramArmed: false,
      manifoldIsolated: false,
      aerospikeThrustKn: 245.0,
      aerospikeChamberPressureBar: 88.8,
      turbopumpRpm: 48000
    }));
    setThrusters((prev) =>
      prev.map((t) => ({
        ...t,
        isolated: false,
        status: 'NOMINAL'
      }))
    );
  };

  // Format mission elapsed time
  const formatMET = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `T+${m}:${s}`;
  };

  return (
    <>
      <div className="min-h-screen bg-[#03060C] text-slate-100 font-mono flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* =========================================================================
            PANE 1: TOP VEHICLE TRAJECTORY & PROPULSION HUD
            ========================================================================= */}
        <header className="border-b border-slate-800 bg-[#070D18]/95 sticky top-0 z-40 backdrop-blur px-4 py-3 shadow-2xl">
          <div className="max-w-[1720px] mx-auto flex flex-col gap-3">
            {/* Top Facility Banner & Emergency Isolation Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-2 bg-cyan-400 rounded-xs shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                <div>
                  <h1 className="text-xl md:text-2xl font-black font-mono tracking-wider leading-snug text-slate-100 flex items-center gap-2.5">
                    SIERRA-ORBITAL // VALKYRIE-X SUBORBITAL AEROSPIKE & RCS FLIGHT DECK
                  </h1>
                  <div className="flex items-center gap-3 text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-400 mt-0.5">
                    <span className="text-cyan-400 font-bold">CHASSIS: SO-VX-04</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">ACTIVE FLIGHT VECTOR</span>
                    <span>·</span>
                    <span>MISSION: VALK-SUB-09</span>
                    <span>·</span>
                    <span className="text-amber-400 font-bold">{formatMET(telemetry.missionTimeSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Interlock Toggle Section */}
              <div className="flex items-center gap-3">
                {telemetry.scramArmed || telemetry.manifoldIsolated ? (
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-red-950/80 border border-red-500 text-red-300 text-xs md:text-sm font-black font-mono tracking-wider uppercase animate-pulse flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      MANIFOLDS ISOLATED // SCRAM ACTIVE
                    </div>
                    <button
                      onClick={handleResetScram}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      RESET PROPULSION INTERLOCK
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowScramModal(true)}
                    className="group px-4 py-2 bg-red-950/40 hover:bg-red-900/80 border-2 border-red-600/80 hover:border-red-500 text-red-300 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs md:text-sm font-black font-mono tracking-wider uppercase text-red-200">
                        EMERGENCY SCRAM / ISOLATION
                      </div>
                      <div className="text-[10px] text-red-400/80 font-mono">
                        ARMED SAFETY COVER LATCHED
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* High-Contrast Large-Typography Telemetry Strip - Balanced 6-Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 pt-1">
              {/* Metric 1: Aerospike Thrust */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>MAIN AEROSPIKE THRUST</span>
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.aerospikeThrustKn.toFixed(1)}
                  </span>
                  <span className="text-base font-bold text-amber-400 ml-1.5">kN</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span>PC: {telemetry.aerospikeChamberPressureBar} BAR</span>
                  <span className="text-emerald-400 font-bold">DUAL-RAMP</span>
                </div>
              </div>

              {/* Metric 2: Vehicle Altitude */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>VEHICLE ALTITUDE</span>
                  <ArrowUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.altitudeKm.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-cyan-400 ml-1.5">km</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span className="text-cyan-300 font-bold">MESOSPHERE</span>
                  <span>APOGEE: 108.5 km</span>
                </div>
              </div>

              {/* Metric 3: Vehicle Velocity */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>VEHICLE VELOCITY</span>
                  <Gauge className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    M {telemetry.velocityMach.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span className="text-slate-200 font-bold">
                    {telemetry.velocityMps.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m/s
                  </span>
                  <span className="text-emerald-300 font-bold">Q: {telemetry.dynamicPressureQ.toFixed(2)} kPa</span>
                </div>
              </div>

              {/* Metric 4: Reaction Control Propellant */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>RCS PROPELLANT (MMH/NTO)</span>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.mmhPropellantPct.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span>HE REG: {telemetry.heRegulatorOutletBar.toFixed(1)} BAR</span>
                  <span className="text-purple-300 font-bold">HYPERGOLIC</span>
                </div>
              </div>

              {/* Metric 5: Attitude Rate Summary */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>ATTITUDE RATES (°/S)</span>
                  <Compass className="w-4 h-4 text-amber-400" />
                </div>
                <div className="grid grid-cols-3 gap-1 my-1 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">PITCH</div>
                    <div className={`text-base md:text-lg font-black font-mono ${telemetry.pitchRateDegS !== 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {telemetry.pitchRateDegS > 0 ? `+${telemetry.pitchRateDegS.toFixed(2)}` : telemetry.pitchRateDegS.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">ROLL</div>
                    <div className={`text-base md:text-lg font-black font-mono ${telemetry.rollRateDegS !== 0 ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {telemetry.rollRateDegS > 0 ? `+${telemetry.rollRateDegS.toFixed(2)}` : telemetry.rollRateDegS.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">YAW</div>
                    <div className={`text-base md:text-lg font-black font-mono ${telemetry.yawRateDegS !== 0 ? 'text-purple-400' : 'text-slate-200'}`}>
                      {telemetry.yawRateDegS > 0 ? `+${telemetry.yawRateDegS.toFixed(2)}` : telemetry.yawRateDegS.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span className="text-emerald-400 font-bold">AUTO-DAMP: {autoRateDamping ? 'ENGAGED' : 'OFF'}</span>
                  <span>GAMMA: +{telemetry.flightPathAngleDeg.toFixed(1)}°</span>
                </div>
              </div>

              {/* Metric 6: Dynamic Pressure & Aerothermal Flux */}
              <div className="bg-[#0B1220] border border-slate-800/90 p-3.5 rounded-xs shadow-inner flex flex-col justify-between">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 flex items-center justify-between">
                  <span>DYNAMIC PRESSURE & FLUX</span>
                  <Wind className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-3xl md:text-4xl font-black font-mono tabular-nums text-slate-100">
                    {telemetry.dynamicPressureQ.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-amber-400 ml-1.5">kPa</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                  <span className="text-amber-300 font-bold">AEROTHERMAL HEAT FLUX: 1.84 MW/m²</span>
                  <span className="text-slate-400 font-bold">STAGNATION</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================================
            NAVIGATION / OPERATIONAL VIEW SELECTOR & ACTION TRIGGER RIBBON
            ========================================================================= */}
        <div className="bg-[#050912] border-b border-slate-800 px-4 py-2.5">
          <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
            {/* View Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3.5 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition-colors rounded-xs cursor-pointer ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                1. DUAL FLIGHT DECK (CANVAS + DIAGNOSTICS)
              </button>
              <button
                onClick={() => setActiveTab('RCS_MATRIX')}
                className={`px-3.5 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition-colors rounded-xs cursor-pointer ${
                  activeTab === 'RCS_MATRIX'
                    ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                2. 16-THRUSTER MANIFOLD LEDGER
              </button>
              <button
                onClick={() => setActiveTab('TURBOPUMP')}
                className={`px-3.5 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition-colors rounded-xs cursor-pointer ${
                  activeTab === 'TURBOPUMP'
                    ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                3. PRESSURIZATION & TURBOPUMP DETAILED
              </button>
              <button
                onClick={() => setActiveTab('ATTITUDE_LOGS')}
                className={`px-3.5 py-2 text-xs md:text-sm font-bold font-mono tracking-wider uppercase transition-colors rounded-xs cursor-pointer ${
                  activeTab === 'ATTITUDE_LOGS'
                    ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                4. ATTITUDE COMMAND MANIFEST
              </button>
            </div>

            {/* Tactical Override Quick Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleNullVehicleRates}
                className="px-3.5 py-2 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Fire balanced opposing verniers to null vehicle pitch/roll/yaw rates"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                NULL VEHICLE RATES
              </button>
              <button
                onClick={handleCalibrateVerniers}
                className="px-3.5 py-2 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/70 text-purple-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Execute 15ms micro-pulse benchmark across all 4 quads"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                CALIBRATE VERNIERS
              </button>
              <button
                onClick={handleTestFireAftQuad}
                className="px-3.5 py-2 bg-amber-950/70 hover:bg-amber-900 border border-amber-500/70 text-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Fire 50ms verified burst on aft base quad"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                TEST FIRE AFT QUAD
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN OPERATIONAL WORKSPACE (PANES 2, 3, AND 4)
            ========================================================================= */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 flex flex-col gap-5">
          {/* TOP DUAL PANE: (PANE 2 LEFT: VEHICLE CANVAS) & (PANE 3 RIGHT: TURBOPUMP & PRESSURIZATION) */}
          {(activeTab === 'OVERVIEW' || activeTab === 'RCS_MATRIX') && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              {/* ===================================================================
                  PANE 2: CENTER-LEFT 2D VEHICLE SILHOUETTE & RCS PLUME CANVAS (7 cols)
                  =================================================================== */}
              <section className="xl:col-span-7 bg-[#080E1C] border border-slate-800 rounded-xs p-4 flex flex-col justify-between shadow-2xl relative">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                      <Wind className="w-5 h-5 text-cyan-400" />
                      VALKYRIE-X LIFTING-BODY SILHOUETTE & 16-RCS PLUME VECTOR CANVAS
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Interactive top-down suborbital aerodynamic chassis · 4 Quads · Dual-Ramp Aerospike
                    </p>
                  </div>

                  {/* Micro Pulse Duration Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono uppercase text-slate-300">PULSE:</span>
                    {[15, 35, 75, 150].map((ms) => (
                      <button
                        key={ms}
                        onClick={() => setPulseDuration(ms)}
                        className={`px-2 py-1 text-xs font-bold font-mono transition-colors cursor-pointer ${
                          pulseDuration === ms
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {ms}ms
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2D Interactive Spaceplane Silhouette SVG Canvas */}
                <div className="relative w-full h-[460px] bg-[#02050B] border border-slate-800/90 rounded-xs flex items-center justify-center overflow-hidden p-2">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Flight telemetry overlays in SVG canvas corners */}
                  <div className="absolute top-3 left-3 bg-[#0A1224]/85 border border-slate-800 p-2 text-xs font-mono space-y-1 z-20">
                    <div className="text-slate-400 font-bold uppercase">FORWARD NOSE QUAD</div>
                    <div className="text-cyan-300">QUAD-FWD-01: 4/4 ACTIVE</div>
                    <div className="text-[11px] text-slate-400">PITCH: +14.45 / -14.50 bar</div>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#0A1224]/85 border border-slate-800 p-2 text-xs font-mono space-y-1 z-20 text-right">
                    <div className="text-slate-400 font-bold uppercase">DUAL-RAMP AEROSPIKE</div>
                    <div className="text-amber-400">THRUST: {telemetry.aerospikeThrustKn} kN</div>
                    <div className="text-[11px] text-slate-400">BASE BLEED: 2.38 bar (MESOSPHERE)</div>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#0A1224]/85 border border-slate-800 p-2 text-xs font-mono space-y-1 z-20">
                    <div className="text-slate-400 font-bold uppercase">PORT STRAKE QUAD</div>
                    <div className="text-purple-300">QUAD-PORT-02: ACTIVE</div>
                    <div className="text-[11px] text-slate-400">ROLL / SWAY VECTOR</div>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-[#0A1224]/85 border border-slate-800 p-2 text-xs font-mono space-y-1 z-20 text-right">
                    <div className="text-slate-400 font-bold uppercase">STARBOARD STRAKE QUAD</div>
                    <div className="text-purple-300">QUAD-STBD-03: ACTIVE</div>
                    <div className="text-[11px] text-slate-400">ROLL / SWAY VECTOR</div>
                  </div>

                  {/* SVG Spaceplane Silhouette */}
                  <svg
                    viewBox="0 0 600 680"
                    className="w-full h-full max-h-[440px] drop-shadow-[0_0_25px_rgba(6,182,212,0.15)] z-10"
                  >
                    <defs>
                      {/* Gradient for Lifting-Body Fuselage */}
                      <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="40%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#0B132B" />
                      </linearGradient>

                      {/* Aerospike Hot Flame Gradient */}
                      <linearGradient id="aerospikeFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                        <stop offset="40%" stopColor="#D97706" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#7C2D12" stopOpacity="0.0" />
                      </linearGradient>

                      {/* RCS Hypergolic Violet Plume Gradient */}
                      <radialGradient id="rcsPlumeViolet" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E879F9" stopOpacity="1" />
                        <stop offset="45%" stopColor="#A855F7" stopOpacity="0.85" />
                        <stop offset="85%" stopColor="#6B21A8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#03060C" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Outer Coordinate Grid Lines */}
                    <circle cx="300" cy="340" r="280" fill="none" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                    <line x1="300" y1="20" x2="300" y2="660" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4" />
                    <line x1="40" y1="340" x2="560" y2="340" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="4 4" />

                    {/* =========================================================
                        LIFTING-BODY VEHICLE AIRFRAME (VALKYRIE-X)
                        ========================================================= */}
                    <path
                      d="
                        M 300,70
                        C 320,120 360,200 420,330
                        L 510,480
                        L 490,520
                        L 430,500
                        L 380,520
                        L 360,560
                        L 240,560
                        L 220,520
                        L 170,500
                        L 110,520
                        L 90,480
                        L 180,330
                        C 240,200 280,120 300,70
                        Z
                      "
                      fill="url(#fuselageGrad)"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />

                    {/* Cockpit Canopy */}
                    <polygon
                      points="300,105 315,160 300,185 285,160"
                      fill="#0369A1"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />

                    {/* Canted Twin Vertical Stabilizers (Port & Starboard) */}
                    <polygon
                      points="170,420 150,510 165,515 200,440"
                      fill="#1E293B"
                      stroke="#64748B"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="430,420 450,510 435,515 400,440"
                      fill="#1E293B"
                      stroke="#64748B"
                      strokeWidth="1.5"
                    />

                    {/* Elevon Control Surface Seam Lines */}
                    <line x1="120" y1="500" x2="220" y2="515" stroke="#475569" strokeWidth="2" />
                    <line x1="480" y1="500" x2="380" y2="515" stroke="#475569" strokeWidth="2" />

                    {/* Center Fuselage Spine */}
                    <line x1="300" y1="185" x2="300" y2="550" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="6 3" />

                    {/* =========================================================
                        DUAL-RAMP LINEAR AEROSPIKE PROPULSION BASE
                        ========================================================= */}
                    <rect x="250" y="555" width="100" height="25" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                    <polygon points="255,555 280,575 270,580 250,565" fill="#EF4444" opacity="0.8" />
                    <polygon points="345,555 320,575 330,580 350,565" fill="#EF4444" opacity="0.8" />
                    <rect x="285" y="565" width="30" height="15" fill="#3B82F6" opacity="0.6" stroke="#60A5FA" strokeWidth="1" />
                    <text x="300" y="576" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">BLEED</text>

                    {/* Dynamic Aerospike Plume */}
                    {telemetry.aerospikeThrustKn > 0 && (
                      <g>
                        <polygon
                          points="250,580 280,660 300,580"
                          fill="url(#aerospikeFlame)"
                          className="animate-pulse"
                        />
                        <polygon
                          points="350,580 320,660 300,580"
                          fill="url(#aerospikeFlame)"
                          className="animate-pulse"
                        />
                        <ellipse cx="300" cy="595" rx="14" ry="18" fill="#38BDF8" opacity="0.75" />
                      </g>
                    )}

                    {/* =========================================================
                        16 RCS THRUSTER NOZZLES & DYNAMIC GAS PLUMES
                        ========================================================= */}
                    {thrusters.map((thruster) => {
                      const cx = (thruster.xPct / 100) * 600;
                      const cy = (thruster.yPct / 100) * 680;
                      const isFiring = activePlumes[thruster.id] || thruster.status === 'FIRING';

                      let plumeDx = 0;
                      let plumeDy = 0;
                      if (thruster.vectorAngle === 0) plumeDx = 42;
                      if (thruster.vectorAngle === 180) plumeDx = -42;
                      if (thruster.vectorAngle === 90) plumeDy = 42;
                      if (thruster.vectorAngle === 270) plumeDy = -42;

                      return (
                        <g key={thruster.id} className="cursor-pointer" onClick={() => setSelectedThruster(thruster)}>
                          {isFiring && (
                            <g>
                              <ellipse
                                cx={cx + plumeDx * 0.65}
                                cy={cy + plumeDy * 0.65}
                                rx={plumeDx !== 0 ? 24 : 12}
                                ry={plumeDy !== 0 ? 24 : 12}
                                fill="url(#rcsPlumeViolet)"
                                className="animate-ping"
                              />
                              <line
                                x1={cx}
                                y1={cy}
                                x2={cx + plumeDx}
                                y2={cy + plumeDy}
                                stroke="#F472B6"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                            </g>
                          )}

                          <circle
                            cx={cx}
                            cy={cy}
                            r="7.5"
                            fill={thruster.isolated ? '#450A0A' : isFiring ? '#F43F5E' : '#0F172A'}
                            stroke={thruster.isolated ? '#EF4444' : isFiring ? '#F472B6' : '#38BDF8'}
                            strokeWidth="2"
                          />

                          <circle
                            cx={cx}
                            cy={cy}
                            r="2.5"
                            fill={thruster.isolated ? '#EF4444' : isFiring ? '#FFFFFF' : '#38BDF8'}
                          />

                          <text
                            x={cx}
                            y={cy + (thruster.vectorAngle === 90 ? -11 : 16)}
                            textAnchor="middle"
                            fill={thruster.isolated ? '#EF4444' : '#E2E8F0'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            className="select-none pointer-events-none"
                          >
                            {thruster.code.replace('RCS-', '')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Direct Vector Override Control Bar */}
                <div className="mt-3 bg-[#0A1224] border border-slate-800 p-3 rounded-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                    <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      INSTANT ATTITUDE THRUST VECTORS (MANUAL OVERRIDE STICK)
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={autoRateDamping}
                        onChange={(e) => setAutoRateDamping(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span>AUTO CLOSED-LOOP RATE DAMPING</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    <button
                      onClick={() => fireThrustersByAxes(['+PITCH'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                      +PITCH (UP)
                    </button>

                    <button
                      onClick={() => fireThrustersByAxes(['-PITCH'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                      -PITCH (DOWN)
                    </button>

                    <button
                      onClick={() => fireThrustersByAxes(['-ROLL'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-purple-950 border border-slate-700 hover:border-purple-400 text-slate-200 hover:text-purple-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                      -ROLL (PORT)
                    </button>

                    <button
                      onClick={() => fireThrustersByAxes(['+ROLL'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-purple-950 border border-slate-700 hover:border-purple-400 text-slate-200 hover:text-purple-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                      +ROLL (STBD)
                    </button>

                    <button
                      onClick={() => fireThrustersByAxes(['-YAW'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-amber-950 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                      -YAW (PORT)
                    </button>

                    <button
                      onClick={() => fireThrustersByAxes(['+YAW'])}
                      disabled={telemetry.manifoldIsolated}
                      className="px-3 py-2 bg-slate-900 hover:bg-amber-950 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      +YAW (STBD)
                    </button>
                  </div>
                </div>
              </section>

              {/* ===================================================================
                  PANE 3: CENTER-RIGHT PROPELLANT PRESSURIZATION & TURBOPUMP DIAGNOSTICS (5 cols)
                  =================================================================== */}
              <section className="xl:col-span-5 bg-[#080E1C] border border-slate-800 rounded-xs p-4 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div>
                      <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-amber-400" />
                        PROPELLANT PRESSURIZATION & TURBOPUMP DIAGNOSTICS
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Helium COPV Storage · Hypergolic MMH/NTO Feed · 48k RPM Aerospike Powerhead
                      </p>
                    </div>
                  </div>

                  {/* Helium COPV Storage */}
                  <div className="bg-[#0B1324] border border-slate-800/90 p-3 rounded-xs mb-3">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        HELIUM COPV COMPOSITE OVERWRAP SYSTEM
                      </span>
                      <span className="text-emerald-400">PILOT REG ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase">COPV BOTTLE PRESSURE</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-slate-100">
                          {telemetry.heBottlePressureBar}
                          <span className="text-sm font-bold text-cyan-400 ml-1">BAR</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">RATED: 400 BAR MAX</div>
                      </div>

                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase">REGULATOR OUTLET</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-emerald-300">
                          {telemetry.heRegulatorOutletBar}
                          <span className="text-sm font-bold text-emerald-400 ml-1">BAR</span>
                        </div>
                        <div className="text-[10px] text-emerald-400/80 mt-0.5">DOME FEEDBACK NOMINAL</div>
                      </div>
                    </div>
                  </div>

                  {/* Hypergolic Tanks */}
                  <div className="bg-[#0B1324] border border-slate-800/90 p-3 rounded-xs mb-3">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-purple-400" />
                        HYPERGOLIC MMH / NTO MANIFOLD PRESSURES
                      </span>
                      <span className="text-purple-400">ULLAGE: 17.6%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-purple-300 font-bold uppercase">MMH FUEL TANK</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-slate-100">
                          {telemetry.mmhTankPressureBar}
                          <span className="text-sm font-bold text-purple-400 ml-1">BAR</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                          <span>TEMP: 294.2 K (21°C)</span>
                          <span className="text-purple-300">{telemetry.mmhPropellantPct}%</span>
                        </div>
                      </div>

                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-amber-300 font-bold uppercase">NTO OXIDIZER TANK</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-slate-100">
                          {telemetry.ntoTankPressureBar}
                          <span className="text-sm font-bold text-amber-400 ml-1">BAR</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
                          <span>TEMP: 291.5 K (18°C)</span>
                          <span className="text-amber-300">{telemetry.ntoPropellantPct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Turbopump */}
                  <div className="bg-[#0B1324] border border-slate-800/90 p-3 rounded-xs mb-3">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-amber-400" />
                        LINEAR AEROSPIKE TURBOPUMP SHAFT ASSEMBLY
                      </span>
                      <span className="text-amber-400 font-black">
                        {telemetry.turbopumpRpm > 0 ? 'ROTATING' : 'STOPPED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2.5">
                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase">TURBOPUMP SHAFT RPM</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-amber-300">
                          {telemetry.turbopumpRpm.toLocaleString()}
                          <span className="text-sm font-bold text-amber-400 ml-1">RPM</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">REDLINE: 54,000 RPM</div>
                      </div>

                      <div className="bg-[#050A14] p-2.5 border border-slate-800">
                        <div className="text-[11px] text-slate-400 uppercase">TURBINE INLET TEMP</div>
                        <div className="text-2xl font-black font-mono tabular-nums text-slate-100">
                          {telemetry.turbineInletTempK}
                          <span className="text-sm font-bold text-red-400 ml-1">K</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">MAX LIMIT: 1,120 K</div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 h-3 rounded-xs overflow-hidden border border-slate-800 flex">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-amber-400 to-red-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (telemetry.turbopumpRpm / 54000) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>0 RPM</span>
                      <span>NOMINAL (48k)</span>
                      <span>MAX (54k)</span>
                    </div>
                  </div>
                </div>

                {/* Aerospike Throttle Controls */}
                <div className="bg-[#0A1224] border border-slate-800 p-3 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-200">
                      AEROSPIKE THROTTLE COMMAND: {aerospikeThrottle}%
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {(245.0 * (aerospikeThrottle / 100)).toFixed(1)} kN
                    </span>
                  </div>

                  <input
                    type="range"
                    min="65"
                    max="105"
                    step="1"
                    value={aerospikeThrottle}
                    onChange={(e) => setAerospikeThrottle(Number(e.target.value))}
                    disabled={telemetry.scramArmed}
                    className="w-full accent-cyan-400 cursor-pointer disabled:opacity-30"
                  />

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => setAerospikeThrottle(70)}
                      disabled={telemetry.scramArmed}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                    >
                      MIN (70%)
                    </button>
                    <button
                      onClick={() => setAerospikeThrottle(100)}
                      disabled={telemetry.scramArmed}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 font-bold cursor-pointer"
                    >
                      100% RATED
                    </button>
                    <button
                      onClick={() => setAerospikeThrottle(105)}
                      disabled={telemetry.scramArmed}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300 font-bold cursor-pointer"
                    >
                      105% APOGEE
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================================
              PANE 4: BOTTOM RCS THRUSTER CLUSTER LEDGER & ATTITUDE COMMAND MANIFEST
              ========================================================================= */}
          <section className="bg-[#080E1C] border border-slate-800 rounded-xs p-4 shadow-2xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base md:text-lg font-bold font-mono tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  RCS THRUSTER CLUSTER LEDGER & ATTITUDE COMMAND MANIFEST
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time telemetry across 16 hypergolic thrusters · Latency tracking · Chamber pressures · Manifold isolation
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase text-slate-300">MANIFOLD ISOLATION:</span>
                {(['QUAD-FWD-01', 'QUAD-PORT-02', 'QUAD-STBD-03', 'QUAD-AFT-04'] as QuadLocation[]).map((q) => {
                  const isQuadIsolated = thrusters.filter((t) => t.quad === q).every((t) => t.isolated);
                  return (
                    <button
                      key={q}
                      onClick={() => toggleQuadIsolation(q)}
                      className={`px-2.5 py-1 text-xs font-bold font-mono uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isQuadIsolated
                          ? 'bg-red-950 border border-red-500 text-red-300'
                          : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200'
                      }`}
                    >
                      {isQuadIsolated ? <Lock className="w-3 h-3 text-red-400" /> : <Unlock className="w-3 h-3 text-emerald-400" />}
                      {q.replace('QUAD-', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High-Contrast Large-Typography Data Table */}
            <div className="overflow-x-auto border border-slate-800 bg-[#040812]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#091020] text-xs font-bold font-mono tracking-wider uppercase text-slate-300">
                    <th className="py-3.5 px-3">THRUSTER ID</th>
                    <th className="py-3.5 px-3">QUAD & AXIS</th>
                    <th className="py-3.5 px-3">ROLE VECTOR</th>
                    <th className="py-3.5 px-3">CHAMBER PC</th>
                    <th className="py-3.5 px-3">PULSE COUNT</th>
                    <th className="py-3.5 px-3">VALVE LATENCY</th>
                    <th className="py-3.5 px-3">NOZZLE TEMP</th>
                    <th className="py-3.5 px-3">DUTY CYCLE</th>
                    <th className="py-3.5 px-3">STATUS</th>
                    <th className="py-3.5 px-3 text-right">MANIFOLD ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm font-mono text-slate-200">
                  {thrusters.map((thruster) => (
                    <tr
                      key={thruster.id}
                      className={`hover:bg-[#0E182E] transition-colors ${
                        thruster.status === 'FIRING'
                          ? 'bg-purple-950/30'
                          : thruster.isolated
                          ? 'bg-red-950/20 opacity-75'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 font-black text-slate-100 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            thruster.isolated
                              ? 'bg-red-500'
                              : thruster.status === 'FIRING'
                              ? 'bg-purple-400 animate-ping'
                              : 'bg-emerald-400'
                          }`}
                        />
                        {thruster.code}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-300 font-bold">{thruster.quad}</span>
                        <span className="text-cyan-400 ml-1.5 font-bold">{thruster.axis}</span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-400">{thruster.role}</td>

                      <td className="py-3.5 px-3 font-bold tabular-nums">
                        <span
                          className={
                            thruster.status === 'FIRING'
                              ? 'text-purple-300 font-black'
                              : thruster.isolated
                              ? 'text-slate-500'
                              : 'text-slate-100'
                          }
                        >
                          {thruster.chamberPressureBar.toFixed(2)} bar
                        </span>
                      </td>

                      <td className="py-3.5 px-3 tabular-nums text-slate-300">
                        {thruster.pulseCount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 tabular-nums">
                        <span className="text-emerald-300 font-bold">{thruster.latencyMs} ms</span>
                      </td>

                      <td className="py-3.5 px-3 tabular-nums">
                        <span
                          className={
                            thruster.nozzleTempC > 150
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-300'
                          }
                        >
                          {thruster.nozzleTempC}°C
                        </span>
                      </td>

                      <td className="py-3.5 px-3 tabular-nums text-slate-300">
                        {thruster.dutyCyclePct}%
                      </td>

                      <td className="py-3.5 px-3">
                        {thruster.isolated ? (
                          <span className="text-red-400 font-bold">ISOLATED</span>
                        ) : thruster.status === 'FIRING' ? (
                          <span className="text-purple-300 font-black animate-pulse">FIRING PULSE</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">NOMINAL</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => fireThrustersByAxes([thruster.axis], thruster.quad)}
                            disabled={thruster.isolated || telemetry.manifoldIsolated}
                            className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-200 text-xs font-bold uppercase disabled:opacity-30 transition-colors cursor-pointer"
                          >
                            PULSE
                          </button>
                          <button
                            onClick={() => toggleThrusterIsolation(thruster.id)}
                            className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors cursor-pointer ${
                              thruster.isolated
                                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                                : 'bg-red-950/60 border border-red-500/70 text-red-300'
                            }`}
                          >
                            {thruster.isolated ? 'ARM' : 'ISOLATE'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Real-time Logs and Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#050A14] border border-slate-800 p-3 rounded-xs">
                <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-2 flex items-center justify-between">
                  <span>LIVE ATTITUDE COMMAND MANIFEST LOG</span>
                  <span className="text-cyan-400 text-xs">{commandLogs.length} ENTRIES LOGGED</span>
                </div>
                <div className="h-44 overflow-y-auto space-y-1.5 text-xs font-mono pr-1">
                  {commandLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 bg-[#091020] border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{log.timestamp}</span>
                        <span className="text-slate-100 font-bold">{log.command}</span>
                        <span className="text-slate-400">[{log.quad}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300">{log.durationMs}ms</span>
                        <span className="text-emerald-400 font-bold">{log.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#050A14] border border-slate-800 p-3 rounded-xs flex flex-col justify-between">
                <div>
                  <div className="text-xs md:text-sm font-bold font-mono tracking-wider uppercase text-slate-300 mb-2 flex items-center justify-between">
                    <span>AEROSPIKE & MESOSPHERIC FLIGHT DYNAMICS ARCHITECTURE</span>
                    <span className="text-emerald-400 text-xs">AERO-PROPULSION VERIFIED</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                    <p>
                      · <strong className="text-cyan-300">Linear Aerospike Altitude Compensation:</strong> As Valkyrie-X
                      climbs through the mesosphere (82.4 km), ambient air pressure drops to near-vacuum. The open base bleed
                      fan recirculates secondary gas, maintaining high specific impulse (Isp ~338s) across all trajectory regimes.
                    </p>
                    <p>
                      · <strong className="text-purple-300">Hypergolic Reaction Control (MMH/NTO):</strong> 16 pulsed
                      thrusters deliver millisecond-level torque response without external ignition sources. Low valve response latency
                      (4.1ms) enables precision vehicle rate damping at Mach 5+.
                    </p>
                    <p>
                      · <strong className="text-amber-300">Interlock Protection:</strong> High-pressure helium COPV manifold isolation
                      safeguards hypergolic tank ullage volumes against micro-meteorite rupture or turbopump thermal runaway.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                  <span>SIERRA ORBITAL AVIONICS BUS: ARINC-429 & MIL-STD-1553B</span>
                  <span className="text-emerald-400">ALL SYSTEMS NOMINAL</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* =========================================================================
            MODAL 1: EMERGENCY SCRAM / MANIFOLD ISOLATION CONFIRMATION
            ========================================================================= */}
        {showScramModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0710] border-2 border-red-500 rounded-xs max-w-lg w-full p-6 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
              <div className="flex items-center gap-3 border-b border-red-800 pb-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                <div>
                  <h3 className="text-lg md:text-xl font-black font-mono tracking-wider uppercase text-red-100">
                    CRITICAL PROPULSION SCRAM // MANIFOLD ISOLATION
                  </h3>
                  <p className="text-xs font-mono text-red-400">
                    CONFIRMATION REQUIRED FOR IMMEDIATE MAIN ENGINE CUTOFF & RCS SHUTDOWN
                  </p>
                </div>
              </div>

              <div className="text-xs md:text-sm font-mono text-slate-300 space-y-3 mb-6">
                <p className="bg-red-950/60 border border-red-800/80 p-3 text-red-200">
                  WARNING: Executing this abort procedure will instantly close all high-pressure helium isolation valves,
                  cut MMH and NTO propellant feed lines, shutdown the dual-ramp aerospike turbopump, and safe all 16 RCS thruster quads.
                </p>
                <div className="space-y-1 text-slate-300">
                  <div>· Aerospike Thrust: 245.0 kN ➔ 0.0 kN</div>
                  <div>· Turbopump: 48,000 RPM ➔ 0 RPM (Coast-down brake)</div>
                  <div>· 16-RCS Hypergolic Manifolds: Isolated</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  onClick={() => setShowScramModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-bold font-mono uppercase cursor-pointer"
                >
                  CANCEL / RESUME MISSION
                </button>
                <button
                  onClick={handleExecuteEmergencyScram}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs md:text-sm font-black font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.7)] cursor-pointer"
                >
                  CONFIRM SCRAM & ISOLATE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 2: INDIVIDUAL THRUSTER DIAGNOSTIC INSPECTOR
            ========================================================================= */}
        {selectedThruster && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B1324] border border-slate-700 rounded-xs max-w-md w-full p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold font-mono tracking-wider uppercase text-slate-100">
                    {selectedThruster.code} // DIAGNOSTIC INSPECTOR
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedThruster(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs md:text-sm font-mono">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Quad Assignment:</span>
                  <span className="text-cyan-300 font-bold">{selectedThruster.quad}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Attitude Vector Axis:</span>
                  <span className="text-purple-300 font-bold">{selectedThruster.axis}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Chamber Pressure Pc:</span>
                  <span className="text-slate-100 font-bold">{selectedThruster.chamberPressureBar} bar</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Cumulative Pulses:</span>
                  <span className="text-slate-100 font-bold">{selectedThruster.pulseCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Valve Response Latency:</span>
                  <span className="text-emerald-400 font-bold">{selectedThruster.latencyMs} ms</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Nozzle Thermocouple:</span>
                  <span className="text-amber-400 font-bold">{selectedThruster.nozzleTempC}°C</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Manifold Isolated:</span>
                  <span className={selectedThruster.isolated ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {selectedThruster.isolated ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4 mt-4">
                <button
                  onClick={() => {
                    fireThrustersByAxes([selectedThruster.axis], selectedThruster.quad);
                  }}
                  disabled={selectedThruster.isolated || telemetry.manifoldIsolated}
                  className="px-3 py-1.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-100 text-xs font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  TEST FIRE NOZZLE
                </button>
                <button
                  onClick={() => {
                    toggleThrusterIsolation(selectedThruster.id);
                    setSelectedThruster((prev) => (prev ? { ...prev, isolated: !prev.isolated } : null));
                  }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    selectedThruster.isolated
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-red-950 border border-red-500 text-red-300'
                  }`}
                >
                  {selectedThruster.isolated ? 'RE-ENABLE' : 'ISOLATE NOZZLE'}
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
      <AerospikeRCSControl />
    </>
  );
}
