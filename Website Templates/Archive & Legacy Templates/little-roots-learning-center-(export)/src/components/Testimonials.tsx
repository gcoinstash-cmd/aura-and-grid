import { useState } from 'react';
import { testimonialsData } from '../data';
import { ChevronLeft, ChevronRight, Quote, Star, MapPin } from 'lucide-react';

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(part => part && part !== '&' && part !== 'and');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : '';
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const current = testimonialsData[index];

  return (
    <section id="testimonials" className="py-20 md:py-24 bg-brand-sand/30 border-y border-brand-sand relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Quote Mark Icon Decorative */}
        <div className="w-16 h-16 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest mx-auto mb-8">
          <Quote className="w-8 h-8 text-brand-forest fill-brand-forest" />
        </div>

        {/* Heading */}
        <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
          Community Voice
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-black text-brand-forest tracking-tight mb-12">
          From Our Los Angeles Families
        </h2>

        {/* Carousel Slide Area */}
        <div className="relative min-h-[250px] flex flex-col justify-center max-w-3xl mx-auto">
          {/* Active Testimonial Card */}
          <div className="transition-all duration-300 transform scale-100 ease-in-out">
            {/* Stars */}
            <div className="flex justify-center gap-1.5 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
              ))}
            </div>

            {/* Large Italic Quote */}
            <blockquote className="font-serif italic text-lg sm:text-2xl text-brand-charcoal/90 leading-relaxed font-medium mb-8 max-w-2xl mx-auto px-4 md:px-0">
              “{current.quote}”
            </blockquote>

            {/* Author Details and Neighborhood */}
            <div className="flex flex-col items-center">
              {/* Warm circular avatar placeholder with forest green background and gold initials */}
              <div className="w-16 h-16 rounded-full bg-[#1B3A2D] ring-2 ring-brand-gold/40 flex items-center justify-center shadow-md relative overflow-hidden mb-4 select-none">
                <div className="absolute inset-1 border border-brand-gold/10 rounded-full pointer-events-none" />
                <span className="font-serif text-lg font-bold text-brand-gold tracking-wider leading-none">
                  {getInitials(current.author)}
                </span>
              </div>

              <span className="font-serif text-lg font-black text-brand-forest">
                {current.author}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-1.5 text-xs text-brand-charcoal/70">
                <span className="font-medium">{current.relation}</span>
                <span className="text-brand-gold">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-terracotta" />
                  {current.neighborhood}
                </span>
                <span className="text-brand-gold">•</span>
                <span className="font-bold text-brand-forest uppercase tracking-wider text-[10px]">
                  Parent since {current.parentSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-5 mt-12">
          {/* Prev Button */}
          <button
            type="button"
            onClick={prev}
            className="w-12 h-12 rounded-full border border-brand-sand hover:border-brand-forest bg-white hover:bg-brand-cream text-brand-charcoal hover:text-brand-forest transition flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicator dots */}
          <div className="flex items-center gap-2">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === i ? 'w-6 bg-brand-terracotta' : 'w-2 bg-brand-sand hover:bg-brand-gold'
                }`}
                aria-label={`Go to slide ${i+1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={next}
            className="w-12 h-12 rounded-full border border-brand-sand hover:border-brand-forest bg-white hover:bg-brand-cream text-brand-charcoal hover:text-brand-forest transition flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
