import { useState } from 'react';
import { galleryData } from '../data';
import { GalleryImage } from '../types';
import { Sparkles, Maximize2, X } from 'lucide-react';

export default function Environment() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Classrooms' | 'Play & Nature' | 'Art & Culture'>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const categories: ('All' | 'Classrooms' | 'Play & Nature' | 'Art & Culture')[] = [
    'All',
    'Classrooms',
    'Play & Nature',
    'Art & Culture'
  ];

  const filteredImages = activeCategory === 'All'
    ? galleryData
    : galleryData.filter(img => img.category === activeCategory);

  return (
    <section id="environment" className="py-20 md:py-28 bg-brand-sand/20 border-t border-brand-sand relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
            Our Sanctuary
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-brand-forest tracking-tight mb-4">
            A Space Built for Brilliance
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6 rounded-full" />
          <p className="text-sm md:text-base text-brand-charcoal/85 max-w-2xl mx-auto">
            Our physical environment serves as the ‘third teacher.’ Architecturally styled with organic California woods, earth-toned terracotta, botanical walls, and deep natural lighting.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-forest text-brand-cream shadow font-extrabold'
                  : 'bg-brand-cream hover:bg-brand-sand text-brand-charcoal border border-brand-sand'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid (with smooth transitions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightboxImage(img)}
              className="group cursor-pointer bg-white rounded-[24px] overflow-hidden border border-brand-sand/70 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 duration-300 relative flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative aspect-video sm:aspect-square lg:aspect-[4/3] overflow-hidden bg-brand-sand/10">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover select-none transition duration-500 group-hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop";
                  }}
                />
                
                {/* Full screen overlay handle icon */}
                <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-brand-forest shadow">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Category Badge */}
                <span className="absolute bottom-3 left-3 bg-brand-forest/90 text-[10px] font-bold tracking-wider text-brand-cream px-2.5 py-1 rounded-md uppercase">
                  {img.category}
                </span>
              </div>

              {/* Technical detail & title bar */}
              <div className="p-5">
                <h3 className="font-serif text-base font-bold text-brand-forest group-hover:text-brand-terracotta transition-colors duration-200">
                  {img.title}
                </h3>
                <p className="text-xs text-brand-charcoal/70 font-sans mt-2 leading-relaxed">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant design detail */}
        <div className="mt-16 bg-brand-forest text-brand-cream rounded-[24px] p-8 md:p-12 relative overflow-hidden shadow-xl border border-brand-gold/25">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-bl-full pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase block mb-2">
                Aesthetics of Joy
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-4">
                Designed to affirm their identity and nurture their potential.
              </h3>
              <p className="text-xs md:text-sm text-brand-cream/80 max-w-xl">
                Every bookshelf features authors and protagonists of color. Every toy is handselected to emphasize ecological harmony, mathematical order, and fine tactile coordination. This is organic elegance built specifically for Black brilliance.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="text-center lg:text-right">
                <p className="text-3xl font-serif font-black text-brand-gold">100%</p>
                <p className="text-[10px] uppercase font-bold tracking-wider mt-1 text-white/90">
                  Toxin-Free Organic Wood Toys Only
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          />

          <div className="relative max-w-4xl w-full z-10 bg-brand-cream rounded-3xl overflow-hidden border border-brand-sand shadow-2xl">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/85 hover:bg-brand-forest text-brand-cream transition flex items-center justify-center shadow"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-8 aspect-video md:aspect-auto md:h-[500px] overflow-hidden bg-black">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop";
                  }}
                />
              </div>

              <div className="md:col-span-4 p-8 flex flex-col justify-between h-full min-h-[250px] md:h-[500px]">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-terracotta uppercase block mb-1">
                    {lightboxImage.category} Sanctuary
                  </span>
                  <h4 className="font-serif text-2xl font-black text-brand-forest leading-tight mb-4">
                    {lightboxImage.title}
                  </h4>
                  <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans mb-6">
                    {lightboxImage.description}
                  </p>
                </div>

                <div className="border-t border-brand-sand/60 pt-4">
                  <p className="text-[10px] font-bold tracking-widest text-brand-forest uppercase leading-none mb-1">
                    Design Detail
                  </p>
                  <p className="text-[11px] text-brand-charcoal/60 leading-normal">
                    Designed by interior specialists to decrease sensory overstimulation and promote deeply focused work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
