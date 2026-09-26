import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Ticket, ArrowUpRight, Music, AlertCircle } from 'lucide-react';
import { EVENTS } from '../data';
import { SupperClubEvent } from '../types';

interface TicketingSectionProps {
  onSelectEvent: (event: SupperClubEvent) => void;
}

export default function TicketingSection({ onSelectEvent }: TicketingSectionProps) {
  return (
    <div id="ticketing-seating-section" className="space-y-10">
      
      {/* Decorative Title Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal border border-white/10">
            <Ticket className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold font-bold">Liturgy of Seating</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-medium tracking-tight">
            Secure Your Board
          </h2>
          <p className="max-w-xl text-sm text-stone-400 font-sans font-light leading-relaxed">
            Seating at Aura is extremely limited to preserve intimacy, communal flow, and direct dialogue with our culinary team and selectors. All tickets are fully-inclusive of pairings.
          </p>
        </div>

        {/* Dynamic Trust indicator */}
        <div className="bg-stone-950/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 max-w-sm md:self-stretch">
          <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 animate-pulse" />
          <div className="text-xs font-sans text-stone-300">
            <strong className="text-white block font-medium mb-0.5">Note on Neighborhood Spaces</strong>
            Addresses of our private garden compounds are shared with confirmed ticket holders 48 hours prior.
          </div>
        </div>
      </div>

      {/* Dynamic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map((evt, index) => {
          const isSoldOut = evt.ticketsLeft <= 0;
          const isSellingFast = evt.ticketsLeft <= 5 && evt.ticketsLeft > 0;
          const percentageLeft = Math.round((evt.ticketsLeft / evt.capacity) * 100);

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-charcoal border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              id={`event-ticket-card-${evt.id}`}
            >
              {/* Highlight ribbon representing low vacancy */}
              {isSellingFast && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-terracotta to-gold text-obsidian text-[8px] font-mono uppercase font-bold tracking-widest px-4 py-1 rounded-bl-lg">
                  Selling Fast
                </div>
              )}

              {/* Central Details */}
              <div className="space-y-5">
                
                {/* Meta details row: Neighborhood & Price */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="font-mono text-xs text-gold tracking-widest uppercase font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta" />
                    <span>{evt.neighborhood}, South LA</span>
                  </span>
                  <span className="font-serif text-2xl text-white font-bold">
                    ${evt.price} <span className="font-sans text-[11px] text-stone-400 font-light">/ head</span>
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="font-serif text-2xl text-stone-100 font-medium group-hover:text-gold transition-colors leading-tight">
                  {evt.title}
                </h3>

                {/* Date & Time */}
                <div className="space-y-2 font-sans text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                </div>

                {/* Micro Ambiance description */}
                <p className="text-xs text-stone-400 font-mono italic leading-relaxed">
                  "{evt.atmosphere}"
                </p>

                {/* Curated Sound metadata */}
                <div className="p-3 bg-stone-950/50 rounded-lg border border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-terracotta font-semibold uppercase">
                    <Music className="w-3 h-3 text-gold" />
                    <span>Spinning Alignment</span>
                  </div>
                  <p className="text-[11px] text-stone-300 font-sans leading-normal">
                    {evt.curatedVinylSummary}
                  </p>
                </div>

                {/* Seating Capacity meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-stone-400">Total Seating Board Vacancy</span>
                    <span className={isSellingFast ? 'text-terracotta font-bold' : 'text-stone-300'}>
                      {isSoldOut ? 'Sold Out' : `${evt.ticketsLeft} of ${evt.capacity} Seats Remain`}
                    </span>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="w-full h-1 bg-stone-950/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        isSellingFast ? 'bg-terracotta' : 'bg-gold'
                      }`}
                      style={{ width: `${Math.max(5, isSoldOut ? 0 : percentageLeft)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action trigger button */}
              <div className="mt-8">
                {isSoldOut ? (
                  <button
                    disabled
                    className="w-full py-3 bg-stone-900 border border-white/5 text-stone-500 rounded-xl font-mono text-xs uppercase tracking-widest cursor-not-allowed"
                    aria-label={`Tickets sold out for ${evt.title}`}
                  >
                    Sold Out
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectEvent(evt)}
                    className="w-full py-3 cursor-pointer bg-stone-950 hover:bg-[#1f1e1e] border border-gold/40 hover:border-gold text-gold font-mono text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-gold/2"
                    aria-label={`Booking pass for ${evt.title}`}
                  >
                    <span>Request Admission Pass</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
