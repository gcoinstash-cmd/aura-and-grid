/**
 * Ghost FactoryOS Track 3 (F1 Skunkworks Engine)
 * Asset GF-T3-147: Sol-Rotor Autonomous Heavy-Lift eVTOL & Swarm Flight Telemetry Engine
 * 
 * Interactive Wind Shear, Microburst & Rotor Fault Disturbance Simulator
 */

import React from 'react';
import { AtmosphereEnvironment, FlightState } from '../../engine/flightDynamics';
import { Wind, Zap, AlertOctagon, RotateCcw, Sliders, ShieldAlert, Compass } from 'lucide-react';

interface DisturbanceLabProps {
  env: AtmosphereEnvironment;
  flightState: FlightState;
  pilotCommands: {
    pitchCmdDeg: number;
    rollCmdDeg: number;
    yawCmdDeg: number;
    altitudeCmdM: number;
    targetNacelleAngleDeg: number;
  };
  onUpdateEnv: (newEnv: AtmosphereEnvironment) => void;
  onUpdatePilotCommands: (cmds: DisturbanceLabProps['pilotCommands']) => void;
  onToggleRotorFail: (rotorId: number) => void;
  onResetNominal: () => void;
}

export const DisturbanceLab: React.FC<DisturbanceLabProps> = ({
  env,
  flightState,
  pilotCommands,
  onUpdateEnv,
  onUpdatePilotCommands,
  onToggleRotorFail,
  onResetNominal,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Simulation Master Header */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase block">
            NONLINEAR FLIGHT DYNAMICS TESTBENCH
          </span>
          <h3 className="text-3xl font-extrabold font-avionics text-white mt-1 flex items-center gap-3">
            <Sliders className="w-8 h-8 text-cyan-400" />
            ATMOSPHERE DISTURBANCE & ROTOR FAULT LAB
          </h3>
          <p className="text-base text-slate-300 mt-1">
            Inject crosswinds, localized microburst downdrafts, Dryden gust spectra, and motor failures to evaluate NDI control adaptation.
          </p>
        </div>

        <button
          onClick={onResetNominal}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-sm px-4 py-2.5 rounded-lg border border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/20"
        >
          <RotateCcw className="w-4 h-4" /> RESET ALL DISTURBANCES
        </button>
      </div>

      {/* Main Disturbance Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Environmental Wind Shear & Turbulence Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <h4 className="text-xl font-bold font-avionics text-white flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400" />
            ATMOSPHERIC WIND & TURBULENCE INJECTION
          </h4>

          {/* Crosswind Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">CROSSWIND SPEED:</span>
              <span className="font-mono text-cyan-300 text-base">{env.crosswindKts.toFixed(0)} KNOTS ({(env.crosswindKts * 0.5144).toFixed(1)} m/s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={env.crosswindKts}
              onChange={(e) => onUpdateEnv({ ...env, crosswindKts: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Crosswind Heading Direction */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">WIND DIRECTION (HEADING FROM):</span>
              <span className="font-mono text-cyan-300 text-base">{env.crosswindDirectionDeg.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={env.crosswindDirectionDeg}
              onChange={(e) => onUpdateEnv({ ...env, crosswindDirectionDeg: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Microburst Downdraft Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">LOCALIZED MICROBURST INTENSITY:</span>
              <span className="font-mono text-amber-400 text-base">
                {(env.microburstIntensity * 100).toFixed(0)}% ({(env.microburstIntensity * 14.5).toFixed(1)} m/s downdraft)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={env.microburstIntensity}
              onChange={(e) => onUpdateEnv({ ...env, microburstIntensity: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Dryden Turbulence Spectrum (sigma_w) */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">DRYDEN TURBULENCE INTENSITY (σ_w):</span>
              <span className="font-mono text-cyan-300 text-base">{env.drydenTurbulenceSigma.toFixed(1)} m/s (MIL-F-8785C)</span>
            </div>
            <input
              type="range"
              min="0"
              max="4.5"
              step="0.2"
              value={env.drydenTurbulenceSigma}
              onChange={(e) => onUpdateEnv({ ...env, drydenTurbulenceSigma: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Pilot Trajectory & Nacelle Transition Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <h4 className="text-xl font-bold font-avionics text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            FLIGHT TRAJECTORY & NACELLE TRANSITION
          </h4>

          {/* Tiltrotor Nacelle Angle */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">TILTROTOR NACELLE ANGLE:</span>
              <span className="font-mono text-cyan-300 text-base">
                {pilotCommands.targetNacelleAngleDeg.toFixed(0)}° {pilotCommands.targetNacelleAngleDeg === 0 ? '(HOVER VTOL)' : pilotCommands.targetNacelleAngleDeg === 90 ? '(AIRPLANE CRUISE)' : '(TRANSITION)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={pilotCommands.targetNacelleAngleDeg}
              onChange={(e) => onUpdatePilotCommands({ ...pilotCommands, targetNacelleAngleDeg: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>0° (VTOL Hover)</span>
              <span>45° (Mid-Transition)</span>
              <span>90° (Fixed-Wing Airplane)</span>
            </div>
          </div>

          {/* Target Altitude */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">TARGET COMMANDED ALTITUDE:</span>
              <span className="font-mono text-emerald-400 text-base">{pilotCommands.altitudeCmdM.toFixed(0)} METERS MSL</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={pilotCommands.altitudeCmdM}
              onChange={(e) => onUpdatePilotCommands({ ...pilotCommands, altitudeCmdM: Number(e.target.value) })}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Pitch Angle Command */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">COMMANDED PITCH ANGLE (θ_cmd):</span>
              <span className="font-mono text-cyan-300 text-base">{pilotCommands.pitchCmdDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="-20"
              max="25"
              step="1"
              value={pilotCommands.pitchCmdDeg}
              onChange={(e) => onUpdatePilotCommands({ ...pilotCommands, pitchCmdDeg: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Roll Angle Command */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">COMMANDED ROLL ANGLE (φ_cmd):</span>
              <span className="font-mono text-cyan-300 text-base">{pilotCommands.rollCmdDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="-35"
              max="35"
              step="1"
              value={pilotCommands.rollCmdDeg}
              onChange={(e) => onUpdatePilotCommands({ ...pilotCommands, rollCmdDeg: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Emergency Rotor Fault Injection Matrix */}
      <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="text-xl font-bold font-avionics text-rose-300 flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-rose-400" />
              EMERGENCY ROTOR & ESC FAULT INJECTION BENCH
            </h4>
            <p className="text-base text-slate-300">
              Click any rotor button below to immediately shut down its ESC. Observe the autonomous NDI controller instantly rebalance differential thrust across remaining rotors to prevent loss of control.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
          {flightState.rotors.map((rotor) => {
            const isFailed = rotor.health === 'FAILED';
            return (
              <button
                key={rotor.id}
                onClick={() => onToggleRotorFail(rotor.id)}
                className={`p-4 rounded-xl border text-center font-mono transition-all ${
                  isFailed
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500'
                    : 'bg-slate-950 border-cyan-500/30 hover:border-rose-400 text-slate-300 hover:text-white'
                }`}
              >
                <div className="text-xs uppercase text-slate-400">{rotor.isTiltable ? 'Tilt' : 'Pusher'}</div>
                <div className="text-2xl font-bold font-avionics mt-1">R{rotor.id}</div>
                <div className={`text-xs font-bold mt-2 py-1 px-2 rounded ${
                  isFailed ? 'bg-rose-600 text-white' : 'bg-slate-900 text-emerald-400'
                }`}>
                  {isFailed ? 'OFFLINE' : 'NOMINAL'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
