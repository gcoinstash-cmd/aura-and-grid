import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingRecord, TicketStatus } from '../types';
import { 
  Search, Wrench, Shield, Compass, Cpu, CheckCircle2, 
  Activity, Play, HelpCircle, User, Calendar, Sliders, AlertCircle, Sparkles
} from 'lucide-react';

interface ServiceTrackerProps {
  bookings: BookingRecord[];
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => void;
}

const STATUS_PIPELINE: { key: TicketStatus; label: string; desc: string }[] = [
  { key: 'inspection', label: 'Safety Audit', desc: 'Pre-inspection scan & chassis integrity verification.' },
  { key: 'parts_ordered', label: 'Parts Acquisition', desc: 'Sourcing OEM parts & performance compound gaskets.' },
  { key: 'in_progress', label: 'Tuning / In Progress', desc: 'Active hardware modifications & dyno ECU mapping.' },
  { key: 'quality_check', label: 'Telemetry Test', desc: 'High-speed diagnostic analysis & stress audits.' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Complimentary mini detail, final pass & keys secured.' }
];

export default function ServiceTracker({ bookings, onUpdateStatus }: ServiceTrackerProps) {
  const [searchId, setSearchId] = useState('');
  const [activeTicket, setActiveTicket] = useState<BookingRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Search logic
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    
    if (searchId.trim() === '') {
      setErrorMsg('Please input a terminal ticket identification code.');
      return;
    }

    const match = bookings.find(b => b.ticketId.toUpperCase() === searchId.trim().toUpperCase());
    if (match) {
      setActiveTicket(match);
    } else {
      setActiveTicket(null);
      setErrorMsg('Ticket ID not located in current database. Try APEX-9502, TRACK-4108, or active user scheduler codes.');
    }
  };

  // Keep activeTicket in sync when bookings parent state updates
  useEffect(() => {
    if (activeTicket) {
      const updated = bookings.find(b => b.ticketId === activeTicket.ticketId);
      if (updated) {
        setActiveTicket(updated);
      }
    }
  }, [bookings, activeTicket]);

  // Handle fast-forward demo state modification
  const handleAdvanceStatus = () => {
    if (!activeTicket) return;
    const currentIndex = STATUS_PIPELINE.findIndex(s => s.key === activeTicket.status);
    if (currentIndex < STATUS_PIPELINE.length - 1) {
      setIsSimulating(true);
      const nextStatus = STATUS_PIPELINE[currentIndex + 1].key;
      
      // Artificial dynamic delay for dashboard realism
      setTimeout(() => {
        onUpdateStatus(activeTicket.ticketId, nextStatus);
        setIsSimulating(false);
      }, 700);
    }
  };

  const handleRegressionStatus = () => {
    if (!activeTicket) return;
    const currentIndex = STATUS_PIPELINE.findIndex(s => s.key === activeTicket.status);
    if (currentIndex > 0) {
      setIsSimulating(true);
      const prevStatus = STATUS_PIPELINE[currentIndex - 1].key;
      setTimeout(() => {
        onUpdateStatus(activeTicket.ticketId, prevStatus);
        setIsSimulating(false);
      }, 500);
    }
  };

  const getStatusNumber = (status: TicketStatus) => {
    const idx = STATUS_PIPELINE.findIndex(s => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStep = activeTicket ? getStatusNumber(activeTicket.status) : 0;
  const progressPercentage = activeTicket ? ((currentStep) / (STATUS_PIPELINE.length - 1)) * 100 : 0;

  // Mechanics details mapping
  const getEngineerDetails = (serviceId: string) => {
    switch (serviceId) {
      case 'ecu-tuning':
        return { name: "Rick 'Dyno' Sterling", role: "Master ECU Calibrator", bay: "Bay 3 (Chassis Dyno)" };
      case 'paint-ceramic':
        return { name: "Kenji Sato", role: "Detailing Artisan & Paint Specialist", bay: "Bay 5 (Detailing Cleanroom)" };
      case 'track-prep':
        return { name: "Marcus Thorne", role: "Lead Race suspension Lead", bay: "Bay 2 (Active Lift)" };
      default:
        return { name: "Sarah Alvarez", role: "Performance Technician", bay: "Bay 1 (General Diagnostics)" };
    }
  };

  const engineer = activeTicket ? getEngineerDetails(activeTicket.serviceId) : null;

  return (
    <section id="tracker" className="relative py-20 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(255,95,31,0.06),transparent_65%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-orange bg-accent-orange/5 px-3 py-1 rounded-full uppercase">
            <span>[ REALTIME METRICS ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Apex Live Work Tracker
          </h2>
          <p className="text-zinc-500 font-sans text-sm font-light">
            Verify active hardware service logs, engine diagnostics, and detailing handovers. Key in your designated ticket ID to sync with our computer terminals.
          </p>
        </div>

        {/* Input Terminal Area */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-zinc-600" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="INPUT REPAIR TICKET (e.g., APEX-9502, TRACK-4108)"
                className="w-full bg-[#101115] border border-neutral-900 rounded-lg pl-11 pr-4 py-3.5 text-sm uppercase text-white font-mono tracking-wider focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange placeholder-zinc-600 transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-accent-orange hover:bg-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider px-6 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sync</span>
            </button>
          </form>

          {errorMsg && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-red-500 font-mono text-center flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </motion.p>
          )}

          <div className="mt-4 flex justify-center gap-4 text-[10px] font-mono text-zinc-500">
            <span>DEMO INPUTS:</span>
            <button onClick={() => { setSearchId('APEX-9502'); setTimeout(() => handleSearch(), 50); }} className="text-accent-orange border-b border-dashed border-accent-orange/30 hover:text-white transition-colors cursor-pointer">APEX-9502 (In Progress)</button>
            <button onClick={() => { setSearchId('TRACK-4108'); setTimeout(() => handleSearch(), 50); }} className="text-accent-orange border-b border-dashed border-accent-orange/30 hover:text-white transition-colors cursor-pointer">TRACK-4108 (Ready)</button>
          </div>
          
          <p className="mt-5 text-xs text-slate-400 font-sans text-center leading-relaxed max-w-lg mx-auto">
            ℹ️ Simplifies operations: Your customers can monitor exactly where their vehicle is in the repair pipeline without needing to call the or disrupt your technicians.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeTicket ? (
            <motion.div
              key={activeTicket.ticketId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Tracking Progression pipeline (8 cols) */}
              <div className="lg:col-span-8 bg-[#101115] rounded-2xl border border-neutral-900 p-6 sm:p-8 space-y-8 flex flex-col justify-between">
                
                {/* Header with car information details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">[ ENGINE BAY LOG ]</span>
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {activeTicket.vehicleMake} {activeTicket.vehicleModel}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 uppercase">
                      <span>Ticket: {activeTicket.ticketId}</span>
                      <span className="text-zinc-600">•</span>
                      <span>Owner: {activeTicket.customerName}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">CURRENT PHASE</span>
                    <span className="inline-flex rounded-full bg-accent-orange/15 border border-accent-orange/30 px-3 py-1 text-xs font-mono font-bold tracking-wide text-accent-orange uppercase mt-1">
                      {STATUS_PIPELINE[currentStep].label}
                    </span>
                  </div>
                </div>

                {/* VISUAL COMPRESSIVE STATUS BAR AND TIMELINE BULLETS */}
                <div className="space-y-12 py-6 relative">
                  
                  {/* Horizonal progress bar behind bullets */}
                  <div className="absolute top-[88px] sm:top-8 left-6 right-6 h-1.5 bg-neutral-900 rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className="bg-accent-orange h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-accent-orange/40"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Nodes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {STATUS_PIPELINE.map((stage, idx) => {
                      const isCompleted = idx < currentStep;
                      const isActive = idx === currentStep;
                      
                      return (
                        <div key={stage.key} className="flex sm:flex-col items-center text-left sm:text-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-3 relative">
                          {/* Dot Circle */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-accent-orange text-black font-semibold' 
                              : isActive 
                              ? 'bg-[#101115] border-2 border-accent-orange text-accent-orange ring-4 ring-accent-orange/10 scale-110' 
                              : 'bg-neutral-900 border border-neutral-800 text-zinc-600'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-4 w-4 stroke-[3px]" /> : idx + 1}
                          </div>

                          {/* Node Text metadata */}
                          <div className="space-y-0.5 max-w-[120px] sm:max-w-none">
                            <span className={`block font-display text-[11px] font-bold uppercase tracking-wider ${
                              isActive ? 'text-accent-orange' : isCompleted ? 'text-zinc-200' : 'text-zinc-500'
                            }`}>
                              {stage.label}
                            </span>
                            <span className="block text-[9px] font-sans text-zinc-500 leading-normal hidden md:block">
                              {stage.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Terminal notes for that phase */}
                <div className="bg-neutral-950 rounded-xl p-5 border border-neutral-900 font-mono text-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-neutral-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-accent-orange animate-pulse" />
                      MICRO-ENGINE LOGGING TERMINAL
                    </span>
                    <span>ESTD COMPL: SAME-DAY</span>
                  </div>
                  
                  {/* Dynamic description lines based on stage */}
                  <div className="space-y-2 text-zinc-400">
                    <p className="text-white text-[13px] font-light italic">
                      &gt; "{STATUS_PIPELINE[currentStep].desc}"
                    </p>
                    <div className="text-[11px] text-zinc-500 space-y-1 pt-1.5">
                      <p>&gt; Connection sync established at 100kb/s.</p>
                      {activeTicket.status === 'inspection' && (
                        <p className="text-zinc-400">&gt; Dynamic diagnostics run verified zero permanent CAN-bus failures. Initiating suspension bolt inspection.</p>
                      )}
                      {activeTicket.status === 'parts_ordered' && (
                        <p className="text-zinc-400">&gt; Tracking ID order number 305417 received by racing performance supplier. Airfreight logistics delivery on final approach.</p>
                      )}
                      {activeTicket.status === 'in_progress' && (
                        <p className="text-zinc-400">&gt; Custom throttle map flashed inside ECU. Launch control profile locked at aggressive parameters. Preparing for fourth Dyno stress sweep.</p>
                      )}
                      {activeTicket.status === 'quality_check' && (
                        <p className="text-zinc-400">&gt; Calibration lead conducting dynamic road test under full load. Checking exhaust back-off parameters and suspension corner rebound integrity.</p>
                      )}
                      {activeTicket.status === 'ready' && (
                        <p className="text-emerald-400">&gt; Dynamic telemetry optimization complete. Certified 112% yield improvement. Car keys and calibration dyno charts loaded in locker B-12.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Mechanics profile, and the "Simulated Progression" DEMO controls (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Mechanic Profile assignment Panel */}
                {engineer && (
                  <div className="bg-[#101115] rounded-2xl border border-neutral-900 p-6 space-y-4">
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white border-b border-neutral-900 pb-3">
                      Assigned Calibration Lead
                    </h4>

                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-accent-orange font-mono font-bold text-sm">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block font-display text-sm font-bold text-white">{engineer.name}</span>
                        <span className="block text-[11px] font-mono text-zinc-500 uppercase">{engineer.role}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-900 grid grid-cols-2 gap-4 font-mono text-[10px] text-zinc-500">
                      <div>
                        <span>GARAGE STATION</span>
                        <span className="block font-bold text-zinc-300 mt-0.5">{engineer.bay}</span>
                      </div>
                      <div>
                        <span>TELEMETRY PLUGS</span>
                        <span className="block font-bold text-zinc-300 mt-0.5 text-ellipsis overflow-hidden">OFT_PRO_OBD_II</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* THE "WOW" FEATURE DEMO ENGINE SUITE */}
                <div className="bg-[#101115] rounded-2xl border border-accent-orange/20 overflow-hidden relative shadow-lg shadow-accent-orange/5">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-orange/5 to-transparent pointer-events-none" />
                  
                  {/* Banner bar */}
                  <div className="bg-accent-orange/15 border-b border-accent-orange/20 px-5 py-2.5 flex items-center space-x-2 text-accent-orange">
                    <Sliders className="h-4 w-4 animate-pulse" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Live Demo Simulator</span>
                  </div>

                  <div className="p-5 space-y-4 font-sans text-xs">
                    <p className="text-zinc-400 font-light leading-relaxed">
                      This template is fully local. Test the interactive mechanics flow by forcing progression steps back and forth below to see the user dashboard update.
                    </p>

                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <button
                        onClick={handleRegressionStatus}
                        disabled={currentStep === 0 || isSimulating}
                        className="rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 p-2.5 text-center text-[10px] text-zinc-400 font-semibold uppercase disabled:opacity-35 transition-all cursor-pointer"
                      >
                        &lt; Revoke Stage
                      </button>
                      <button
                        onClick={handleAdvanceStatus}
                        disabled={currentStep === STATUS_PIPELINE.length - 1 || isSimulating}
                        className="rounded-lg bg-accent-orange hover:brightness-110 p-2.5 text-center text-[10px] text-black font-bold uppercase disabled:opacity-35 transition-all cursor-pointer"
                      >
                        Advance Stage &gt;
                      </button>
                    </div>

                    {isSimulating && (
                      <div className="flex items-center justify-center space-x-2 text-accent-orange font-mono text-[10px] uppercase">
                        <Activity className="h-3 w-3 animate-spin" />
                        <span>Flashing Telemetry Controller...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Support box */}
                <div className="bg-neutral-900/40 rounded-2xl border border-neutral-900 p-6 space-y-3 text-xs text-zinc-500">
                  <div className="flex items-center space-x-2 text-zinc-300 font-mono text-[10px] uppercase font-bold">
                    <Shield className="h-4 w-4 text-accent-orange" />
                    <span>Locked Security Socket</span>
                  </div>
                  <p className="font-light leading-relaxed">
                    Have active telemetry queries regarding custom maps or dyno runs? Speak directly back with our active tuner staff at the terminal link.
                  </p>
                  <span className="block font-mono text-zinc-400 text-xs text-left font-bold select-all">
                    LOGS_PORT: 3000 // APEX_SSL
                  </span>
                </div>

              </div>
            </motion.div>
          ) : (
            /* Empty Tracker splash block */
            <motion.div
              key="empty-tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto rounded-2xl border border-neutral-900 bg-[#101115] p-12 text-center space-y-6"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-accent-orange">
                <Compass className="h-6 w-6 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  Console Standby Status
                </h3>
                <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto leading-relaxed font-light">
                  Input a valid mechanical ticket number to establish a secure live status connection. The default template comes with active diagnostics preloaded.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => { setSearchId('APEX-9502'); handleSearch(); }}
                  className="rounded-lg border border-accent-orange/30 hover:border-accent-orange bg-accent-orange/5 hover:bg-accent-orange/10 px-5 py-3 text-xs font-mono font-bold uppercase text-accent-orange transition-all cursor-pointer"
                >
                  Load Preseeded Demo Ticket (APEX-9502)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
