import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LOCATION_DETAILS } from "../data/mockData";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { MapPin, Compass, Navigation, Clock, Phone, Mail, ChevronRight, Activity } from "lucide-react";

export const Location: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState("");
  const [directionSteps, setDirectionSteps] = useState<string[] | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingPoint.trim()) return;

    setIsRouting(true);
    setDirectionSteps(null);

    // Simulate luxury-street router calculation
    setTimeout(() => {
      setIsRouting(false);
      setDirectionSteps([
        "ENGAGE RADIAL INTERCEPT: Head southeast towards the Industrial Sector.",
        "MONITOR HIGHWAY BEATS: Turn left onto District 4 bypass (Follow sign for Sound Gate).",
        "STREET MARKER SCAN: After the shipping yard, take the third exit on the concrete roundabout.",
        "TARGET LOCATED: Enter Vandal Way SE. Spot the bright blinking neon lime arrow. Heavy bass begins here."
      ]);
    }, 1200);
  };

  const handleClearRoute = () => {
    setStartingPoint("");
    setDirectionSteps(null);
  };

  return (
    <section id="location" className="py-24 bg-[#0B0B0C] border-b border-brand-border px-6 relative">
      <div className="absolute top-[40%] left-[5%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-accent uppercase tracking-widest font-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent animate-bounce" /> INDUSTRIAL QUARTER // D1082
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              FIND THE KITCHEN
            </h2>
          </div>
          
          <p className="max-w-md text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            Our clandestine prep space is docked deep in District 4. No maps verify our entry flags, look for the pulsing lights.
          </p>
        </div>

        {/* Location Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Schedule and details */}
          <div className="lg:col-span-6 space-y-6">
            <Card glowColor="orange" className="p-6 sm:p-8">
              <div className="space-y-6 text-left">
                <span className="font-mono text-xs text-brand-orange tracking-widest uppercase font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-orange" /> OPERATIONAL LOCK TIMES
                </span>

                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                  DOORS LOCKED & ACTIVE
                </h3>

                <div className="divide-y divide-brand-border font-mono text-xs">
                  {LOCATION_DETAILS.hours.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-3.5 items-center">
                      <span className="text-white font-bold">{item.days}</span>
                      <span className="text-brand-accent tracking-tighter">{item.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="block text-[9px] text-brand-muted font-mono uppercase">SECURE HOTLINE</span>
                    <a href={`tel:${LOCATION_DETAILS.phone}`} className="flex items-center gap-1.5 font-display text-xs text-brand-text hover:text-brand-orange transition-colors duration-200">
                      <Phone className="w-3.5 h-3.5 text-brand-orange" /> {LOCATION_DETAILS.phone}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] text-brand-muted font-mono uppercase">SECURE COMM CHANNEL</span>
                    <a href={`mailto:${LOCATION_DETAILS.email}`} className="flex items-center gap-1.5 font-display text-xs text-brand-text hover:text-brand-orange transition-colors duration-200 truncate">
                      <Mail className="w-3.5 h-3.5 text-brand-orange" /> {LOCATION_DETAILS.email}
                    </a>
                  </div>
                </div>

              </div>
            </Card>

            <Card glowOnHover={false} className="p-5 bg-brand-bg/60">
              <div className="flex gap-4 text-left items-start">
                <div className="w-9 h-9 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex flex-shrink-0 items-center justify-center text-brand-accent">
                  <Compass className="w-4 h-4 text-brand-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">LOCATOR FLAG:</h4>
                  <p className="text-xs text-brand-text leading-relaxed font-sans font-medium">
                    {LOCATION_DETAILS.address}
                  </p>
                  <p className="text-[11px] text-brand-orange font-mono font-bold">
                    ★ {LOCATION_DETAILS.subtext}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side: Interactive street directions calculator & stylized map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border border-brand-border p-6 bg-brand-card text-left space-y-6 rounded-sm relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[8px] text-brand-muted">
                <Activity className="w-3 h-3 text-brand-accent animate-pulse" />
                <span>GRID INTERCEPT: D-04</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-black text-white uppercase tracking-wider">
                  D4 INTERACTIVE ROUTER
                </h3>
                <p className="text-xs text-brand-muted font-sans leading-normal">
                  Calculate stylized concrete guidance from your location to the Industrial Quarter.
                </p>
              </div>

              {/* Form trigger starting point */}
              <form onSubmit={handleRouteSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    placeholder="ENTER STARTING POINT (E.G. DOWNTOWN, AIRPORT)"
                    className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent focus:shadow-[0_0_10px_rgba(204,255,0,0.1)] text-white placeholder-brand-muted/40 font-mono text-xs px-4 py-3.5 pr-10 outline-none transition-all duration-200 uppercase"
                  />
                  <div className="absolute top-3.5 right-3.5 text-brand-muted">
                    <Navigation className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <Button type="submit" variant="primary" className="flex-1 h-12 text-xs" disabled={isRouting}>
                    {isRouting ? "INTERRUPTING SECTORS..." : "CALCULATE STREET ROUTE"}
                  </Button>
                  
                  {directionSteps && (
                    <Button type="button" variant="secondary" onClick={handleClearRoute} className="h-12 text-xs px-4 border border-brand-border select-none">
                      CLEAR
                    </Button>
                  )}
                </div>
              </form>

              {/* Step calculations */}
              <AnimatePresence>
                {directionSteps && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-brand-border/60 pt-4 mt-2 space-y-3.5 font-mono text-xs"
                  >
                    <span className="block text-[9px] text-brand-accent tracking-widest uppercase font-bold">
                      // SCK DIRECTIONS TRANSLATION ENGINE:
                    </span>
                    
                    <div className="space-y-3">
                      {directionSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-2.5 bg-brand-bg/40 border border-brand-border/40 rounded-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-brand-accent/5 border border-brand-accent/15 text-brand-accent text-[9px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-brand-text text-[11px] leading-relaxed text-left">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-brand-accent/5 border border-brand-accent/10 flex justify-between items-center text-[10px]">
                      <span className="text-brand-muted">TOTAL GRID COMPACTION:</span>
                      <span className="text-brand-accent font-black tracking-widest uppercase">7.5 MILES // ENGAGED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Stylized high-fashion geometric wireframe map representing the dark street grid */}
            <div className="relative aspect-[16/9] w-full bg-brand-card border border-brand-border overflow-hidden select-none">
              
              {/* Decorative target markers and wirelines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
              
              {/* Simulated visual radar circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-brand-border/20 pointer-events-none animate-[pulse_6s_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-brand-accent/10 pointer-events-none" />

              {/* Target glowing sector block */}
              <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 p-2.5 bg-brand-accent/10 border border-brand-accent shadow-[0_0_15px_rgba(204,255,0,0.2)] font-mono text-[9px] text-brand-accent font-bold z-10 flex items-center gap-1.5 animate-pulse">
                <MapPin className="w-3.5 h-3.5 text-brand-orange fill-brand-orange animate-bounce" />
                <span>SCK TARGET BASE</span>
              </div>

              {/* Wireframe lines drawing directions */}
              <svg className="absolute inset-0 w-full h-full text-brand-accent/30 stroke-current stroke-1 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="10" y1="20" x2="50" y2="20" strokeDasharray="2,2" />
                <line x1="50" y1="20" x2="50" y2="48" strokeDasharray="2,2" />
                <line x1="90" y1="80" x2="70" y2="60" strokeDasharray="1,1" />
                <line x1="70" y1="60" x2="50" y2="48" strokeDasharray="1,1" className="text-brand-orange/40 animate-[dash_2s_linear_infinite]" />
              </svg>

              <div className="absolute bottom-3 left-3 flex gap-4 font-mono text-[8px] text-brand-muted uppercase">
                <span>ZOOM: OPTIMAL GRID-4</span>
                <span>SYSTEM STATUS: COMPLIED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
