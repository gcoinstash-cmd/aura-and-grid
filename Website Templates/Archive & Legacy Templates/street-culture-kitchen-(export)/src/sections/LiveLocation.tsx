import React from "react";
import { motion } from "motion/react";
import { scheduleData, ScheduleItem } from "../data/scheduleData";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { MapPin, Navigation, Calendar, Flame, Clock, Radio, Compass } from "lucide-react";

export const LiveLocation: React.FC = () => {
  // Determine actual today's day name in uppercase (e.g. "SATURDAY")
  const DAYS_INDEX = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const todayDayName = DAYS_INDEX[new Date().getDay()];

  // Find if we are active today
  const todaysStop = scheduleData.find(item => item.day.toUpperCase() === todayDayName);
  
  // If today is a closed day (e.g. MON-WED), find the next active stop to showcase nicely
  const featuredStop: ScheduleItem = todaysStop || scheduleData[0];
  const isLabDay = !todaysStop;

  return (
    <section id="live-location" className="py-20 bg-[#0B0B0C] border-b border-brand-border px-6 relative">
      {/* Editorial glowing backdrop cues */}
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[35%] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Title & Visual Bracket */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-accent uppercase tracking-widest font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
              LIVE TELEMETRY // DISPATCH CORNER
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              LIVE LOCATION LOGGER
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            We move with the night. Check our active server stop for tonight or map out the remainder of your weekend culinary run.
          </p>
        </div>

        {/* Primary Interactive Split: Dynamic Today's Stop Showcase & Map Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Highlight Card: Today's Stop */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <Card glowColor="accent" className="flex-1 flex flex-col justify-between p-6 sm:p-8 border-2 border-brand-border relative">
              {/* Dynamic status sticker absolute tags */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] font-bold">
                {isLabDay ? (
                  <span className="bg-brand-orange/15 text-brand-orange px-2.5 py-1 border border-brand-orange/30 uppercase rounded-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" /> LAB RESEARCH MODE
                  </span>
                ) : (
                  <span className="bg-brand-accent/15 text-brand-accent px-2.5 py-1 border border-brand-accent/30 uppercase rounded-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" /> TRANSMITTING ACTIVE STOP
                  </span>
                )}
              </div>

              <div className="space-y-6 text-left">
                <span className="font-mono text-xs text-brand-muted tracking-widest uppercase block font-bold">
                  // TODAY'S SECTOR STATUS
                </span>

                {isLabDay ? (
                  <div className="space-y-4">
                    <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase">
                      IN THE RESEARCH LAB
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted font-sans leading-relaxed">
                      Today is <span className="text-brand-accent font-bold font-mono">{todayDayName}</span>. 
                      Our mobile kitchen truck is currently docked at our test prep depot brining fresh wagyu bricks, hand-pressing next batches of activated charcoal flour, and mixing cyber marinades.
                    </p>
                    <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-sm font-mono text-[11px] text-brand-orange flex items-center gap-2">
                      <Flame className="w-4 h-4 animate-bounce" />
                      <span>NEXT DISPATCH ENGAGES THURSDAY 18:00 SHARP.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-brand-accent/10 border border-brand-accent/40 text-brand-accent font-mono text-[10px] tracking-wider uppercase font-bold">
                      {featuredStop.day} // OPERATIONAL
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                      {featuredStop.locationName}
                    </h3>
                    
                    <div className="space-y-1.5 font-mono text-sm">
                      <div className="flex items-center gap-2 text-brand-text">
                        <Clock className="w-4 h-4 text-brand-accent" />
                        <span>TIME SLOT: {featuredStop.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-muted">
                        <MapPin className="w-4 h-4 text-brand-orange" />
                        <span className="line-clamp-1">{featuredStop.address}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlight Next Stop block */}
                <div className="pt-6 border-t border-brand-border space-y-3">
                  <span className="block font-mono text-[10px] text-brand-muted tracking-widest uppercase">
                    FEATURED NAVIGATION COORDINATES
                  </span>
                  <div className="font-mono text-xs text-brand-text/90 space-y-1">
                    <div className="flex justify-between"><span className="text-brand-muted">Target Area:</span> <span>{featuredStop.locationName}</span></div>
                    <div className="flex justify-between"><span className="text-brand-muted">Address Code:</span> <span>{featuredStop.address}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Button: Open in Maps */}
              <div className="pt-8">
                <Button 
                  variant={isLabDay ? "secondary" : "primary"}
                  className="w-full h-12 text-xs flex items-center justify-center gap-2"
                  onClick={() => window.open(featuredStop.googleMapsLink, "_blank", "noopener,noreferrer")}
                >
                  <Navigation className="w-4 h-4" /> 
                  OPEN ACTIVE STOP IN MAPS
                </Button>
              </div>

            </Card>
          </div>

          {/* Graphical Street Map representation */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[320px] bg-brand-card border border-brand-border p-6 flex flex-col justify-between overflow-hidden group">
              {/* Radar Circle overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-brand-accent/5 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-brand-orange/5 pointer-events-none" />
              
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(204,255,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(204,255,0,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

              <div className="space-y-1 z-10 text-left">
                <span className="font-mono text-[10px] text-brand-accent uppercase font-bold tracking-widest block">// DIGITALIZED LOCATION RADAR</span>
                <h4 className="font-display text-lg font-black text-white uppercase">STREET RADAR INTERCEPT</h4>
              </div>

              {/* Graphical nodes */}
              <div className="my-auto py-8 relative flex items-center justify-center">
                <div className="relative">
                  {/* HQ Base */}
                  <div className="w-3 h-3 bg-brand-orange rounded-full relative z-10 animate-pulse">
                    <span className="absolute -inset-2 bg-brand-orange/30 rounded-full animate-ping" />
                  </div>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[8px] text-brand-orange whitespace-nowrap bg-brand-bg/80 border border-brand-border px-1.5">MAIN CORE DEPOT</span>
                </div>

                {/* Draw connection line */}
                <div className="w-24 h-0.5 bg-dashed border-t border-brand-accent/40 border-dashed mx-4 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] text-brand-muted">4.5 MILES</span>
                </div>

                <div className="relative">
                  {/* Current Active Spot */}
                  <div className="w-4 h-4 bg-brand-accent rounded-full relative z-10">
                    <span className="absolute -inset-3 bg-brand-accent/35 rounded-full animate-ping" />
                  </div>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-[9px] text-brand-accent font-bold whitespace-nowrap bg-brand-bg/90 border border-brand-accent/40 px-2 py-0.5">
                    {featuredStop.day} Stop
                  </span>
                </div>
              </div>

              <div className="font-mono text-[9px] text-brand-muted flex justify-between z-10">
                <span>ZOOM REGULATION: METROPOLITAN-4</span>
                <span className="text-brand-accent">RADAR_LINK // ONLINE</span>
              </div>
            </div>
          </div>

        </div>

        {/* The rest of the Weekly Schedule Listing in beautiful scannable Grid */}
        <div className="space-y-6 pt-4">
          <h3 className="font-display text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2 text-left">
            <Calendar className="w-5 h-5 text-brand-accent" /> THE FULL WEEKLY ROADMAP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scheduleData.map((item, index) => {
              const isToday = item.day.toUpperCase() === todayDayName;

              return (
                <div 
                  key={index} 
                  id={`schedule_card_${item.day}`}
                  className={`bg-brand-card border p-5 relative transition-all duration-300 rounded-sm text-left flex flex-col justify-between gap-4 ${
                    isToday 
                      ? "border-brand-accent shadow-[0_0_15px_rgba(204,255,0,0.1)]" 
                      : "border-brand-border hover:border-brand-text/30"
                  }`}
                >
                  {/* Highlight indicator if it's today's stop */}
                  {isToday && (
                    <div className="absolute top-2 right-2 bg-brand-accent text-black font-mono text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
                      ACTIVE TODAY
                    </div>
                  )}

                  <div className="space-y-3">
                    <span className={`font-mono text-xs font-bold tracking-widest block uppercase ${isToday ? "text-brand-accent" : "text-brand-muted"}`}>
                      {item.day}
                    </span>

                    <div className="space-y-1">
                      <h4 className="font-display text-md font-black text-white uppercase leading-tight">
                        {item.locationName}
                      </h4>
                      <p className="text-xs text-brand-muted font-sans leading-normal line-clamp-2">
                        {item.address}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-brand-accent font-medium">{item.timeRange}</span>
                    <button 
                      onClick={() => window.open(item.googleMapsLink, "_blank", "noopener,noreferrer")}
                      className="text-brand-muted hover:text-white transition-colors duration-200 select-none cursor-pointer flex items-center gap-1"
                      aria-label={`Open maps directions for ${item.locationName}`}
                    >
                      MAP
                      <Compass className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
