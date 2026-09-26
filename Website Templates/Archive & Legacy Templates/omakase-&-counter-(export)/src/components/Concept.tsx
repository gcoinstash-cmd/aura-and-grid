export default function Concept() {
  const principles = [
    {
      subtitle: "THE ORIGIN",
      title: "subtraction as luxury",
      desc: "we remove the noise of the modern banquet. by stripping away rich sauces and heavy garnishes, we reveal the absolute crispness of pure, seasonal ocean harvest and grain texture."
    },
    {
      subtitle: "THE MEDIUM",
      title: "the custom counter",
      desc: "with only sixteen hand-planed hinoki wood seats surrounding a single counter, the barrier between chef and enthusiast ceases to exist. each piece transitions from hand to hand in seconds."
    },
    {
      subtitle: "THE RITUAL",
      title: "eternal seasonal flux",
      desc: "our menu adapts to the sea’s temperature and wind patterns daily, sourced from tsukiji brokers and small-boat fishermen in prime prefectures."
    }
  ];

  return (
    <section 
      id="about" 
      className="py-36 px-6 max-w-7xl mx-auto border-t border-muted-charcoal scroll-mt-24"
    >
      <div className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start" id="concept">
        {/* Left Column Description */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-8 lg:sticky lg:top-32">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-raw-silk/40 block mb-3">
              our core philosophy
            </span>
            <h2 className="title-section mb-6 text-3xl font-serif tracking-[0.12em] lowercase text-raw-silk">
              the luxury of stillness
            </h2>
          </div>
          <p className="font-sans text-xs text-raw-silk/65 leading-relaxed tracking-wider lowercase">
            to experience omakase is to surrender the burden of choice. we curate the progression from light, clean white meats to deep, rich bluefin cuts, matching temperature and acidity with precision.
          </p>

          {/* Minimalist image illustration representing luxury craft with macro workspace */}
          <div 
            className="about-image relative overflow-hidden aspect-[4/3] border border-muted-charcoal bg-sumi-ink mt-8 transition-opacity duration-1000 ease-out"
            id="artisan-workspace-image"
          >
            <img
              src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop"
              alt="High-contrast craft knife and hinoki wood workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 hover:scale-[1.02] hover:brightness-90 transition-all duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sumi-ink/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Column Principles List */}
        <div className="lg:col-span-7 flex flex-col justify-between pt-4 lg:pt-16">
          <div className="space-y-20">
            {principles.map((pr) => (
              <div 
                key={pr.title} 
                className="border-b border-muted-charcoal/60 pb-16 flex flex-col md:flex-row gap-6 md:gap-16 items-start"
                id={`concept-principle-${pr.subtitle.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="font-sans text-[10px] tracking-[0.35em] text-raw-silk/35 min-w-[8rem] uppercase pt-1">
                  {pr.subtitle}
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-lg font-serif text-raw-silk tracking-[0.08em] lowercase">
                    {pr.title}
                  </h3>
                  <p className="font-sans text-xs text-raw-silk/60 leading-relaxed tracking-wider lowercase max-w-lg">
                    {pr.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
