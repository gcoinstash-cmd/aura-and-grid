interface HeroProps {
  onReserveClick: () => void;
}

export default function Hero({ onReserveClick }: HeroProps) {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 text-center select-none"
    >
      {/* Atmosphere overlay background layout */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-15">
        <img 
          src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1920&auto=format&fit=crop"
          alt="Atmospheric charcoal room background"
          className="w-full h-full object-cover filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sumi-ink via-transparent to-sumi-ink" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle, thin decorative vertical rules for zen geometry */}
        <div className="w-px h-24 bg-muted-charcoal mb-16" />

        {/* Singular, razor-sharp display heading using lowercase serif */}
        <h1 
          className="font-serif font-light text-raw-silk leading-none tracking-tight mb-8 lowercase text-transparent bg-clip-text bg-gradient-to-r from-raw-silk via-raw-silk/90 to-raw-silk/70"
          style={{ letterSpacing: "-0.01em" }}
          id="hero-title"
        >
          sixteen seats. twelve courses. one quiet room.
        </h1>

        <p className="font-sans text-xs uppercase tracking-[0.3em] text-raw-silk/50 max-w-lg mx-auto mb-16 leading-relaxed">
          a high-contrast sensory retreat centered entirely on pristine marine harvests and the precision of the knife.
        </p>

        {/* Primary CTA - single minimalist text link anchor with crisp 1px solid bottom border */}
        <a
          href="#order"
          onClick={(e) => {
            e.preventDefault();
            onReserveClick();
          }}
          className="group inline-block font-serif text-lg text-raw-silk italic tracking-[0.05em] lowercase border-b border-raw-silk py-1 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-100 hover:tracking-[0.1em]"
          id="cta-reserve"
        >
          request seating <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
        </a>
      </div>

      {/* Vertical scroll-down indicator matching the zen micro-line rule */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] tracking-[0.3em] uppercase text-raw-silk/30 mb-4 font-sans">scroll</span>
        <div className="w-px h-12 bg-muted-charcoal/60" />
      </div>
    </section>
  );
}
