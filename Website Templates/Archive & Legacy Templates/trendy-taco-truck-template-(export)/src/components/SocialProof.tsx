import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ArrowLeft, ArrowRight, Camera, Calendar, Users, Award } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  organization: string;
  eventType: string;
  guestCount: number;
  rating: number;
  quote: string;
  date: string;
  menuSelection: string;
  imageUrl: string;
}

export const SocialProof: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: 'testimonial-1',
      clientName: 'Alexander Sterling',
      organization: 'Sterling & Co. Design Studio',
      eventType: 'Corporate Launch Gala',
      guestCount: 150,
      rating: 5,
      quote: 'Agave & Mesa completely reimagined our studio launch. The mesquite double-smoked pork belly was the talk of the night, and their blue corn tortillas are absolutely unparalleled. A masterpiece of street culture and gourmet rigor.',
      date: 'July 2025',
      menuSelection: 'Signature Feast (Tier II) + Unlimited Refrescas',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'testimonial-2',
      clientName: 'Elena Rostova',
      organization: 'Private Estate Wedding',
      eventType: 'Backyard Wedding Reception',
      guestCount: 85,
      rating: 5,
      quote: 'We commissioned the Reserve VIP tier for our intimate wedding, and it exceeded every possible expectation. The truffle elote street corn and agave-charcoal shrimp were pristine. Complete visual styling and zero-stress cleanup.',
      date: 'August 2025',
      menuSelection: 'Reserve VIP (Tier III) + Warm Churros Station',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'testimonial-3',
      clientName: 'Marcus Vance',
      organization: 'LACMA Vernissage Afterparty',
      eventType: 'Contemporary Art Exhibition',
      guestCount: 220,
      rating: 5,
      quote: 'An absolute sensation. From the custom-printed wood menu boards to the slow-braised chipotle birria, the visual presentation matched the culinary depth perfectly. Highly recommend for any creative high-end event.',
      date: 'October 2025',
      menuSelection: 'Bespoke Art Curation (Custom Tier)',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'testimonial-4',
      clientName: 'Dr. Evelyn Chen',
      organization: 'Biotech Summit Keynote Dinner',
      eventType: 'Executive Outdoor Retreat',
      guestCount: 60,
      rating: 5,
      quote: 'Remarkable attention to organic, gluten-free, and vegan alternatives without compromising a single ounce of smoky, bold flavor. The smoked jackfruit carnitas with charred pineapple salsa was spectacular.',
      date: 'November 2025',
      menuSelection: 'Street Ritual (Tier I) + Botanical Mocktails',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="social-proof-section" className="space-y-10 scroll-mt-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs text-agave-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            Gastronomy Chronicles
          </span>
          <h3 className="font-display font-medium text-3xl text-white mt-1">Client Chronicles &amp; Proof.</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl">
            A window into our past private event commissions, gallery launch receptions, and high-ticket weddings across Southern California.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-10 h-10 rounded-xl bg-charcoal border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-10 h-10 rounded-xl bg-charcoal border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Carousel Wrapper */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 w-[90%] sm:w-[540px] md:w-[620px] bg-charcoal border border-zinc-850/80 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 snap-start group hover:border-zinc-700 transition-all duration-300 shadow-xl"
          >
            {/* Left Media/Image Column */}
            <div className="md:col-span-5 h-48 md:h-full relative bg-obsidian overflow-hidden">
              <img
                src={t.imageUrl}
                alt={t.eventType}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal via-transparent to-transparent opacity-90" />
              
              {/* Event Coordinates Overlay badge */}
              <div className="absolute bottom-4 left-4 bg-obsidian/90 backdrop-blur-md border border-zinc-850 py-1.5 px-3 rounded-xl text-[10px] font-mono text-zinc-400">
                <span className="text-white font-bold block">{t.eventType}</span>
                {t.date}
              </div>
            </div>

            {/* Right Information & Quote Column */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Quotation Icon and Rating Plate */}
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900">
                    <Quote className="w-3.5 h-3.5 text-agave-400 fill-agave-400" />
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Core Quote */}
                <p className="text-sm text-zinc-300 leading-relaxed font-sans italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Commission Client Sign-off */}
              <div className="pt-4 border-t border-zinc-850 space-y-3">
                <div>
                  <h4 className="font-display font-medium text-sm text-white">
                    {t.clientName}
                  </h4>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {t.organization}
                  </p>
                </div>

                {/* Logistics Metadata summary chips */}
                <div className="flex flex-wrap gap-2 text-[9px] font-mono text-zinc-400">
                  <span className="bg-obsidian border border-zinc-900 px-2 py-0.5 rounded flex items-center gap-1">
                    <Users className="w-3 h-3 text-zinc-600" /> {t.guestCount} heads
                  </span>
                  <span className="bg-obsidian border border-zinc-900 px-2 py-0.5 rounded flex items-center gap-1 max-w-[200px] truncate">
                    <Award className="w-3 h-3 text-agave-400" /> {t.menuSelection}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
