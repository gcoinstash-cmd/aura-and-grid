import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Eye, ShieldCheck, HelpCircle, ArrowRight, Gauge, Lock } from 'lucide-react';
import { playNeonChime } from '../utils/audio';
import ChassisProfileSelector, { ProfileType } from './ChassisProfileSelector';

interface ExpressLogisticsProps {
  initialWaitMin?: number;
  onSyncComplete?: (plate: string, profile: ProfileType) => void;
}

export default function ExpressLogistics({ initialWaitMin = 4.2, onSyncComplete }: ExpressLogisticsProps) {
  const [plateNumber, setPlateNumber] = useState('MDN-998-XP');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>('Coupe');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [pipelineActiveStep, setPipelineActiveStep] = useState<1 | 2 | 3>(2);

  // Dynamic Arrival Window Calculation
  const [arrivalWindow, setArrivalWindow] = useState({ start: '21:42', end: '21:47' });

  useEffect(() => {
    // Generate a beautiful, calculated future time screen based on actual device clock or system seed
    const updateArrivalTimes = () => {
      const now = new Date();
      
      // Calculate dynamic preparation offset in minutes based on active vehicle class
      let baseOffset = 5;
      if (selectedProfile === 'Coupe') baseOffset = 4;
      if (selectedProfile === 'SUV') baseOffset = 7;

      const start = new Date(now.getTime() + baseOffset * 60 * 1000);
      const end = new Date(now.getTime() + (baseOffset + 5) * 60 * 1000);

      const pad = (num: number) => num.toString().padStart(2, '0');
      setArrivalWindow({
        start: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        end: `${pad(end.getHours())}:${pad(end.getMinutes())}`
      });
    };

    updateArrivalTimes();
    const interval = setInterval(updateArrivalTimes, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [selectedProfile]);

  const handleSyncTelemetry = () => {
    if (isSyncing) return;
    playNeonChime();
    setIsSyncing(true);
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          // Highlight pipeline fully active
          setPipelineActiveStep(3);
          if (onSyncComplete) {
            onSyncComplete(plateNumber, selectedProfile);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div 
      id="express-lane-logistics-wrapper" 
      className="bg-[#121212] border border-[#222] p-6 text-white w-full space-y-6 max-w-4xl mx-auto backdrop-blur-md relative"
    >
      {/* Accent corner neon brackets in reactive green */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00FF66]" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00FF66]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00FF66]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00FF66]" />

      {/* Control Module Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#00FF66] font-extrabold uppercase">
              EXPRESS LANE // TELEMETRY DIRECTORY
            </span>
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight text-white mt-1">
            OPERATIONAL LOGISTICS INTERFACE
          </h2>
        </div>
        
        {/* Status badges */}
        <div className="flex gap-2 font-mono text-[9px]">
          <span className="bg-[#1a1a1a] border border-[#222] text-neutral-400 px-2 py-0.8">
            SYS_LINK: SECURE
          </span>
          <span className="bg-[#00FF66]/10 border border-[#00FF66]/20 text-[#00FF66] px-2 py-0.8 animate-pulse">
            KITCHEN PIPELINE: LIVE
          </span>
        </div>
      </div>

      {/* Split-Screen Dual-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        
        {/* LEFT COLUMN: Data Ingestion */}
        <div id="logistics-left-column" className="space-y-6">
          <div>
            <span className="text-[10px] text-neutral-400 font-mono tracking-widest block mb-1">
              01 // PLATE RECOGNITION SYSTEM
            </span>
            <h3 className="font-display font-medium text-xs text-white uppercase tracking-wider mb-3">
              VEHICLE IDENTIFICATION KEY
            </h3>
            
            {/* Minimalist text input with smooth border transition */}
            <div className="relative">
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-lg font-mono font-bold text-white tracking-widest outline-none py-2 border-b border-[#222] focus:border-[#444] transition-colors duration-300 uppercase"
                placeholder="ENTER PLATE (E.G. MDN-998)"
              />
              {/* Dynamic bottom highlighting accent line */}
              <div 
                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#00FF66] transition-all duration-300 ${
                  isFocused ? 'w-full shadow-[0_0_8px_#00FF66]' : 'w-0'
                }`}
              />
            </div>
            <span className="text-[9px] text-neutral-500 font-mono mt-1.5 block">
              INPUT THE ACTIVE PHYSICAL VEHICLE PLATE NUMBER FOR AUTOMATED INDUCTION BARRIER RELEASE.
            </span>
          </div>

          {/* Vehicle profile selection with custom SVG silhouette buttons */}
          <ChassisProfileSelector 
            selectedProfile={selectedProfile}
            onProfileChange={(prof) => setSelectedProfile(prof)}
          />

          {/* Sync Trigger button */}
          <div className="pt-2">
            <button
              onClick={handleSyncTelemetry}
              disabled={isSyncing}
              className="w-full relative py-3 bg-[#111111] hover:bg-[#151515] border border-[#222] hover:border-[#00FF66]/30 transition-all duration-300 flex justify-between items-center px-4 overflow-hidden group"
            >
              {isSyncing && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-[#00FF66]/5 transition-all duration-300" 
                  style={{ width: `${syncProgress}%` }}
                />
              )}
              <div className="flex items-center gap-2.5 relative z-10">
                <Cpu className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#00FF66]' : 'text-neutral-500 group-hover:text-[#00FF66] transition-colors'}`} />
                <span className="font-mono text-xs tracking-wider text-white uppercase font-bold text-left block">
                  {isSyncing ? `TRANSMITTING VEHICLE TELEMETRY... [${syncProgress}%]` : 'SYNC VEHICLE TELEMETRY'}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#00FF66] group-hover:translate-x-1.5 transition-all relative z-10" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Fulfillment Matrix */}
        <div id="logistics-right-column" className="space-y-6 flex flex-col justify-between">
          
          {/* Estimated Arrival Window display */}
          <div className="bg-[#151515] border border-[#222] p-4 relative">
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]"></span>
            </span>

            <span className="text-[10px] text-neutral-500 font-mono tracking-widest block uppercase">
              ESTIMATED ARRIVAL WINDOW
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display font-black text-3xl md:text-4xl text-[#00FF66] tracking-tighter">
                {arrivalWindow.start} - {arrivalWindow.end}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                (LOCAL TIMESTAMP)
              </span>
            </div>
            
            <p className="text-[10px] text-neutral-400 font-mono mt-1 leading-normal">
              PREPARATION INDEX ALIGNS PRECISELY WITH YOUR VEHICLE PROFILE STALL ESTIMATION. DO NOT ARRIVE BEYOND THIS SPAN to preserve heat intensity.
            </p>
          </div>

          {/* Industrial-style linear stepper tracking PREPARATION PIPELINE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-neutral-500 font-mono tracking-widest block uppercase">
                PREPARATION PIPELINE
              </span>
              <span className="font-mono text-[9px] text-[#00FF66] font-bold">
                STAGE {pipelineActiveStep} OF 3
              </span>
            </div>

            {/* Steps stack */}
            <div className="space-y-3">
              {[
                { step: 1, label: 'ORDER AUTHENTICATED', desc: 'Secure telemetry handshake successfully established with culinary queue.', requiredStep: 1 },
                { step: 2, label: 'WOK LINE ALPHA ACTIVE', desc: 'Searing at 320°Celsius. Liquid gas spice induction triggered.', requiredStep: 2 },
                { step: 3, label: 'LANE QUEUE ASSIGNED', desc: 'Auto-barrier identification unlocked. Vector lane 01 locked.', requiredStep: 3 },
              ].map((s) => {
                const isActive = pipelineActiveStep >= s.requiredStep;
                return (
                  <div 
                    key={s.step} 
                    className={`p-3.5 border transition-all duration-300 relative flex gap-4 ${
                      isActive 
                        ? 'border-[#00FF66]/30 bg-[#00FF66]/5 shadow-[0_0_12px_rgba(0,255,102,0.03)]' 
                        : 'border-[#1a1a1a] bg-[#0c0c0c]'
                    }`}
                  >
                    {/* Status side bar vertical indicators */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#00FF66] text-[#0d0d0d] shadow-[0_0_10px_#00FF66]' 
                            : 'bg-[#1a1a1a] text-neutral-500'
                        }`}
                      >
                        0{s.step}
                      </div>
                      {s.step < 3 && (
                        <div 
                          className={`w-[1px] h-10 mt-2 transition-all duration-300 ${
                            pipelineActiveStep > s.step ? 'bg-[#00FF66]' : 'bg-[#1a1a1a]'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step descriptions */}
                    <div className="space-y-1">
                      <h4 className={`font-display font-medium text-xs tracking-wider transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-neutral-600'
                      }`}>
                        {s.label}
                      </h4>
                      <p className={`text-[10px] leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-neutral-400' : 'text-neutral-800'
                      }`}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#151515] border border-[#222] p-3 text-[10px] font-mono text-neutral-500 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
              AUTHENTICATION ENCRYPTED AES-256
            </span>
            <span className="text-[#00FF66] font-bold">TUNED: STABLE</span>
          </div>

        </div>

      </div>
    </div>
  );
}
