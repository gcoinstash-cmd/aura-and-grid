/**
 * Ghost FactoryOS Track 3 (F1 Skunkworks Engine)
 * Asset GF-T3-147: Sol-Rotor Autonomous Heavy-Lift eVTOL & Swarm Flight Telemetry Engine
 * 
 * Interactive Avionics Primary Flight Display (PFD)
 * High-contrast luxury avionics dark mode: slate-950, cyan-400 attitude, emerald-400 climb, amber-400 caution.
 * Strict typography floor: text-base/text-lg body, text-2xl/text-3xl headers, text-2xl to text-4xl key telemetry numbers.
 */

import React from 'react';
import { FlightState } from '../../engine/flightDynamics';
import { Compass, Gauge, AlertTriangle, ShieldCheck, Zap, Activity, Wind, ArrowUpRight } from 'lucide-react';

interface PrimaryFlightDisplayProps {
  state: FlightState;
  onToggleRotorFail: (rotorId: number) => void;
}

export const PrimaryFlightDisplay: React.FC<PrimaryFlightDisplayProps> = ({ state, onToggleRotorFail }) => {
  const { euler, airspeedKts, altitudeBaroM, altitudeRadarM, verticalSpeedMps, verticalSpeedFpm, nacelleAngleDeg, rotors, totalThrustKn, vrsRiskLevel, flightMode, ndiLoopLatencyMs } = state;

  // Artificial horizon pitch and roll translation
  const pitchOffsetPx = euler.pitch * 5.0; // 5px per degree
  const rollRotationDeg = -euler.roll;

  // Altitude tape ticks
  const baseAlt = Math.round(altitudeBaroM / 20) * 20;
  const altTicks = [-60, -40, -20, 0, 20, 40, 60].map(delta => baseAlt + delta).filter(a => a >= 0);

  // Speed tape ticks
  const baseSpeed = Math.round(airspeedKts / 10) * 10;
  const speedTicks = [-30, -20, -10, 0, 10, 20, 30].map(delta => baseSpeed + delta).filter(s => s >= 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" /> FLIGHT REGIME
          </span>
          <span className="text-2xl font-bold font-avionics text-white tracking-wide mt-1">
            {flightMode.replace('_', ' ')}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-cyan-400" /> NACELLE ANGLE
          </span>
          <span className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {nacelleAngleDeg.toFixed(1)}° <span className="text-base text-slate-400 font-normal">{nacelleAngleDeg < 15 ? '(VTOL)' : nacelleAngleDeg > 75 ? '(CRUISE)' : '(TRANS)'}</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" /> TOTAL THRUST
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {totalThrustKn.toFixed(1)} <span className="text-base text-slate-400 font-normal">kN</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> NDI LATENCY
          </span>
          <span className={`text-2xl font-bold font-mono mt-1 ${ndiLoopLatencyMs < 4.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {ndiLoopLatencyMs.toFixed(2)} <span className="text-base text-slate-400 font-normal">ms (P99)</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" /> HEADING / TRACK
          </span>
          <span className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {euler.yaw.toFixed(1).padStart(5, '0')}°
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> VRS ENVELOPE
          </span>
          <span className={`text-2xl font-bold font-avionics mt-1 ${
            vrsRiskLevel === 'CRITICAL' ? 'text-rose-400 animate-pulse' :
            vrsRiskLevel === 'CAUTION' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {vrsRiskLevel === 'NONE' ? 'SAFE ENVELOPE' : `${vrsRiskLevel} ALERT`}
          </span>
        </div>
      </div>

      {/* Main Primary Flight Display (PFD) Center Cockpit HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Airspeed Ladder (Left Tape) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="text-center pb-2 border-b border-slate-800">
            <span className="text-base font-bold text-cyan-400 uppercase tracking-widest">AIRSPEED</span>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {airspeedKts.toFixed(0)} <span className="text-base text-cyan-400 font-semibold">KTS</span>
            </div>
            <div className="text-sm font-mono text-slate-400">
              {(airspeedKts * 1.852).toFixed(0)} km/h
            </div>
          </div>

          {/* Scrolling Airspeed Tape */}
          <div className="relative h-64 my-3 flex flex-col justify-center items-end pr-3 border-r-2 border-cyan-500/40">
            {speedTicks.map(speed => {
              const diff = speed - airspeedKts;
              const topOffset = 128 - diff * 3.5;
              if (topOffset < 0 || topOffset > 256) return null;
              const isSelected = Math.abs(diff) < 5;
              return (
                <div
                  key={speed}
                  className={`absolute right-0 flex items-center gap-2 transition-all ${
                    isSelected ? 'text-cyan-300 font-bold text-xl' : 'text-slate-400 text-base'
                  }`}
                  style={{ top: `${topOffset}px` }}
                >
                  <span className="font-mono">{speed}</span>
                  <div className={`h-0.5 ${isSelected ? 'w-5 bg-cyan-400' : 'w-3 bg-slate-600'}`} />
                </div>
              );
            })}
            {/* Center Bug Marker */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="w-4 h-4 bg-cyan-400 rotate-45 transform translate-x-2 border border-white" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-sm font-mono flex flex-col gap-1 text-slate-400">
            <div className="flex justify-between">
              <span>V_STALL:</span> <span className="text-rose-400 font-bold">38 KTS</span>
            </div>
            <div className="flex justify-between">
              <span>V_CRUISE:</span> <span className="text-emerald-400 font-bold">145 KTS</span>
            </div>
            <div className="flex justify-between">
              <span>V_NE:</span> <span className="text-rose-500 font-bold">180 KTS</span>
            </div>
          </div>
        </div>

        {/* Center Attitude Director Indicator (ADI) */}
        <div className="lg:col-span-8 bg-slate-950 border-2 border-cyan-500/50 rounded-xl p-4 flex flex-col relative overflow-hidden shadow-2xl min-h-[460px]">
          
          {/* Compass Heading Tape (Top of ADI) */}
          <div className="h-10 border-b border-cyan-500/30 relative flex items-center justify-center overflow-hidden bg-slate-900/60 rounded-t-lg mb-2">
            <div className="flex gap-8 font-mono text-base text-slate-300">
              {[-30, -15, 0, 15, 30].map(offset => {
                const hdg = (Math.round(euler.yaw + offset) + 360) % 360;
                const isCenter = offset === 0;
                let cardinal = '';
                if (hdg >= 355 || hdg <= 5) cardinal = 'N';
                else if (hdg >= 85 && hdg <= 95) cardinal = 'E';
                else if (hdg >= 175 && hdg <= 185) cardinal = 'S';
                else if (hdg >= 265 && hdg <= 275) cardinal = 'W';

                return (
                  <div key={offset} className={`flex flex-col items-center ${isCenter ? 'text-cyan-300 font-bold text-lg' : 'text-slate-400'}`}>
                    <span>{cardinal ? cardinal : hdg.toString().padStart(3, '0')}</span>
                    <div className={`w-0.5 ${isCenter ? 'h-2.5 bg-cyan-400' : 'h-1.5 bg-slate-600'}`} />
                  </div>
                );
              })}
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-amber-400 z-10" />
          </div>

          {/* Artificial Horizon Screen */}
          <div className="relative flex-1 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            
            {/* Rotating Sky / Ground Disk */}
            <div
              className="absolute w-[800px] h-[800px] transition-transform duration-75 ease-out"
              style={{
                transform: `rotate(${rollRotationDeg}deg) translateY(${pitchOffsetPx}px)`,
              }}
            >
              {/* Sky Upper Half (Deep Royal Cyan-Slate) */}
              <div className="w-full h-1/2 bg-gradient-to-t from-cyan-950/80 via-blue-950/60 to-slate-950 relative border-b-2 border-cyan-300">
                {/* Pitch Ladder Lines (Positive Pitch) */}
                {[5, 10, 15, 20, 25, 30].map(deg => (
                  <div
                    key={deg}
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 text-cyan-300 font-mono text-sm"
                    style={{ bottom: `${deg * 5}px` }}
                  >
                    <span>{deg}</span>
                    <div className="w-16 h-0.5 bg-cyan-400/80" />
                    <span>{deg}</span>
                  </div>
                ))}
              </div>

              {/* Ground Lower Half (Deep Amber-Slate Ground) */}
              <div className="w-full h-1/2 bg-gradient-to-b from-amber-950/60 via-stone-950/80 to-slate-950 relative">
                {/* Pitch Ladder Lines (Negative Pitch) */}
                {[-5, -10, -15, -20, -25, -30].map(deg => (
                  <div
                    key={deg}
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 text-amber-300/80 font-mono text-sm"
                    style={{ top: `${Math.abs(deg) * 5}px` }}
                  >
                    <span>{Math.abs(deg)}</span>
                    <div className="w-16 h-0.5 bg-amber-500/60 border-t border-dashed border-amber-400" />
                    <span>{Math.abs(deg)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Static Aircraft Reference Symbol (The Yellow / Cyan Crosshairs) */}
            <div className="absolute z-20 pointer-events-none flex items-center justify-center">
              {/* Left Wing Bar */}
              <div className="w-16 h-2 bg-amber-400 border border-black shadow-lg" />
              {/* Center Dot */}
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 mx-2 shadow-lg" />
              {/* Right Wing Bar */}
              <div className="w-16 h-2 bg-amber-400 border border-black shadow-lg" />
            </div>

            {/* Roll Angle Arc & Pointer Indicator (Top Arc) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-4 h-4 border-l-8 border-r-8 border-b-[12px] border-l-transparent border-r-transparent border-b-cyan-400 shadow-md" />
              <div className="text-base font-mono font-bold text-cyan-300 mt-1 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                ROLL: {euler.roll.toFixed(1)}°
              </div>
            </div>

            {/* Pitch Readout (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-md">
              <span className="text-slate-400 text-xs uppercase font-bold block">PITCH</span>
              <span className="text-xl font-bold font-mono text-cyan-300">{euler.pitch.toFixed(1)}°</span>
            </div>

            {/* G-Force Load Factor (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-md text-right">
              <span className="text-slate-400 text-xs uppercase font-bold block">LOAD FACTOR</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{state.loadFactorG.toFixed(2)} G</span>
            </div>
          </div>
        </div>

        {/* Altitude & VSI Tape (Right Tape) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="text-center pb-2 border-b border-slate-800">
            <span className="text-base font-bold text-emerald-400 uppercase tracking-widest">ALTITUDE</span>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {altitudeBaroM.toFixed(0)} <span className="text-base text-emerald-400 font-semibold">M</span>
            </div>
            <div className="text-sm font-mono text-slate-400">
              {(altitudeBaroM * 3.28084).toFixed(0)} ft MSL
            </div>
          </div>

          {/* Scrolling Altitude Tape */}
          <div className="relative h-64 my-3 flex flex-col justify-center items-start pl-3 border-l-2 border-emerald-500/40">
            {altTicks.map(alt => {
              const diff = alt - altitudeBaroM;
              const topOffset = 128 - diff * 2.8;
              if (topOffset < 0 || topOffset > 256) return null;
              const isSelected = Math.abs(diff) < 10;
              return (
                <div
                  key={alt}
                  className={`absolute left-0 flex items-center gap-2 transition-all ${
                    isSelected ? 'text-emerald-300 font-bold text-xl' : 'text-slate-400 text-base'
                  }`}
                  style={{ top: `${topOffset}px` }}
                >
                  <div className={`h-0.5 ${isSelected ? 'w-5 bg-emerald-400' : 'w-3 bg-slate-600'}`} />
                  <span className="font-mono">{alt}</span>
                </div>
              );
            })}
            {/* Center Bug Marker */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="w-4 h-4 bg-emerald-400 rotate-45 transform -translate-x-2 border border-white" />
            </div>
          </div>

          {/* Vertical Speed Readout (VSI) */}
          <div className="pt-2 border-t border-slate-800 text-sm font-mono flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">VSI (CLIMB):</span>
              <span className={`font-bold text-base ${verticalSpeedMps >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {verticalSpeedMps >= 0 ? '+' : ''}{verticalSpeedMps.toFixed(1)} m/s
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>RATE:</span>
              <span>{verticalSpeedFpm >= 0 ? '+' : ''}{verticalSpeedFpm.toFixed(0)} FPM</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-slate-400">RADAR AGL:</span>
              <span className="text-cyan-300 font-bold">{altitudeRadarM.toFixed(1)} M</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Rotor Thrust & Dynamic Actuator Telemetry Array */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <div>
            <h3 className="text-2xl font-bold font-avionics text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              DISTRIBUTED 8-ROTOR ELECTRIC PROPULSION MATRIX
            </h3>
            <p className="text-base text-slate-400">
              4 Forward Tilting Nacelles (R1–R4) + 4 Aft Lift-Pusher Co-axial Rotors (R5–R8). Click any rotor to simulate emergency fault injection.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-mono">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              NOMINAL: {rotors.filter(r => r.health === 'NOMINAL').length}/8
            </div>
            <div className="flex items-center gap-1.5 text-sm text-rose-400 font-mono">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              FAILED: {rotors.filter(r => r.health !== 'NOMINAL').length}/8
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {rotors.map((rotor) => {
            const isNominal = rotor.health === 'NOMINAL';
            const thrustPct = Math.min(100, Math.round((rotor.thrust / 8000) * 100));

            return (
              <div
                key={rotor.id}
                onClick={() => onToggleRotorFail(rotor.id)}
                className={`cursor-pointer transition-all duration-200 p-3 rounded-lg border flex flex-col justify-between ${
                  isNominal
                    ? 'bg-slate-950/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                    : 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-avionics font-bold text-base text-white">
                    {rotor.isTiltable ? `T-R${rotor.id}` : `P-R${rotor.id}`}
                  </span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold ${
                    isNominal ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-900 text-rose-200 border border-rose-500'
                  }`}>
                    {rotor.health}
                  </span>
                </div>

                <div className="text-xs text-slate-400 truncate mb-2">
                  {rotor.isTiltable ? 'Tilt Nacelle' : 'Aft Pusher'}
                </div>

                {/* Vertical Thrust Bar Indicator */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${isNominal ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${isNominal ? thrustPct : 0}%` }}
                  />
                </div>

                <div className="space-y-1 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RPM:</span>
                    <span className={`font-bold ${isNominal ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {rotor.currentRpm}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">THRUST:</span>
                    <span className={`font-bold ${isNominal ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {(rotor.thrust / 1000).toFixed(2)} kN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PWR:</span>
                    <span className="text-slate-300">
                      {rotor.powerKw.toFixed(1)} kW
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">INFLOW:</span>
                    <span className="text-cyan-400 text-xs">
                      {rotor.inducedVelocity.toFixed(1)} m/s
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className={`text-xs uppercase font-bold py-0.5 px-2 rounded block ${
                    isNominal ? 'bg-slate-900 text-slate-400 hover:text-rose-400' : 'bg-rose-900/80 text-rose-200'
                  }`}>
                    {isNominal ? 'Inject Fault' : 'Restore'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
