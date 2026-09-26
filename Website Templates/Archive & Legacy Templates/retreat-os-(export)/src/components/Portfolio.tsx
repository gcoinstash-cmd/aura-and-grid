import React from 'react';
import { motion } from 'motion/react';
import { Retreat } from '../types';
import { Compass, Calendar, MapPin, ArrowRight, CornerDownRight } from 'lucide-react';

interface PortfolioProps {
  retreats: Retreat[];
  onSelectRetreat: (retreat: Retreat) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Portfolio({ retreats, onSelectRetreat, setCurrentTab }: PortfolioProps) {
  // Let the first retreat be the highly featured one to construct an asymmetric editorial grid layout
  const featuredRetreat = retreats[0];
  const secondaryRetreats = retreats.slice(1);

  const handleViewRetreat = (retreat: Retreat) => {
    onSelectRetreat(retreat);
    setCurrentTab('details');
    // Scroll window back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectApply = (retreat: Retreat, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectRetreat(retreat);
    setCurrentTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Editorial Title Banner */}
      <div className="border-b border-ink/15 pb-10 mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl text-left">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#C4A482] uppercase block mb-3 h-4">
            PREMIUM RETREAT WEBSITE TEMPLATE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-ink leading-[1.2] mb-6">
            The Premium Storefront <span className="italic font-normal">Template for High-Ticket</span> Retreats & Programs
          </h1>
          
          {/* Line-ruled sub-headline directly above the fold */}
          <div className="border-y border-ink/10 py-5 my-6">
            <p className="text-sm md:text-base font-serif italic text-ink/90 tracking-wide leading-relaxed">
              A premium, fully customizable website template built for retreat hosts, boutique programs, and wellness coordinators.
            </p>
          </div>

          <p className="text-sm text-ink/75 font-sans tracking-wide leading-relaxed mt-4 max-w-xl font-medium">
            Retreat OS provides a polished, high-converting website template for boutique programs. Engineered for elegant bookings and easy updates, this template removes all technical setup hassle by using a simple content file to power the entire site.
          </p>

          {/* Restructured CTA: exactly ONE dominant visual path */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
            <button
              onClick={() => {
                setCurrentTab('apply');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-center bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 transition duration-300 cursor-pointer shadow-sm"
            >
              Purchase Template
            </button>
            <button
              onClick={() => {
                const target = document.getElementById('listings');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-ink/60 hover:text-ink text-xs uppercase tracking-[0.25em] font-semibold transition cursor-pointer hover:underline border-none p-0 bg-transparent inline-flex items-center"
            >
              Explore Active Retreats
            </button>
          </div>

          {/* Calm Credibility Block */}
          <div className="mt-12 pt-8 border-t border-ink/10 grid grid-cols-2 gap-6 sm:gap-10">
            <div>
              <span className="font-mono text-[9px] text-[#5A6455] font-bold block uppercase tracking-widest mb-1">SPEED & SEO</span>
              <p className="text-xl font-serif font-light text-ink">Instant Loading Times</p>
              <p className="text-[10px] text-ink/65 font-sans mt-0.5">Lightweight pages designed to capture mobile traffic and lift booking rates.</p>
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#5A6455] font-bold block uppercase tracking-widest mb-1">SIMPLE SETUP</span>
              <p className="text-xl font-serif font-light text-ink">Fast & Easy Launch</p>
              <p className="text-[10px] text-ink/65 font-sans mt-0.5">Polished, reservation-ready pages with visual setup guides included.</p>
            </div>
          </div>
        </div>
        <div className="md:text-right font-sans text-xs uppercase tracking-[0.18em] text-[#5A6455] font-bold space-y-1">
          <p>Retreat Storefront Template</p>
          <p className="text-ochre font-bold">Launch Your Website Today</p>
        </div>
      </div>

      {/* 1. Buyer "Who This Is For" Block */}
      <div className="mb-16 md:mb-24 border-b border-ink/10 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#C4A482] font-semibold uppercase block mb-1">
              TAILORED FOR BOUTIQUE PROGRAMS
            </span>
            <h2 className="font-serif text-3xl font-light text-ink">
              Polished Online Storefront <span className="italic font-normal">for Creative Hosts & Brands</span>
            </h2>
          </div>
          <p className="text-xs text-ink/65 font-sans tracking-wide max-w-md">
            An elegant, fast-loading website template for retreat hosts, boutique programs, and creative coordinators wanting high booking conversions and zero setup headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-ink/10 bg-white/40 rounded-sm transition hover:border-[#C4A482]/40 hover:bg-[#FBF9F6]/50">
            <span className="text-[9px] font-mono font-bold text-[#C4A482] uppercase block mb-3">PRIVATE VILLAS</span>
            <h3 className="font-serif text-lg font-light text-ink mb-2">Boutique Properties & Venues</h3>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Showcase properties, room descriptions, availability tracking, and high-ticket packages with gorgeous listings designed to turn visitors into guests.
            </p>
          </div>

          <div className="p-6 border border-ink/10 bg-[#FBF9F6]/30 rounded-sm transition hover:border-[#5A6455]/40 hover:bg-[#FBF9F6]/50">
            <span className="text-[9px] font-mono font-bold text-[#5A6455] uppercase block mb-3">WELLNESS DIRECTORS</span>
            <h3 className="font-serif text-lg font-light text-ink mb-2">Yoga & Wellness Teachers</h3>
            <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed">
              Present detailed retreat schedules, custom registration forms, and clean pricing layouts to keep your guest applications organized.
            </p>
          </div>

          <div className="p-6 border border-ink/10 bg-white/40 rounded-sm transition hover:border-[#C4A482]/40 hover:bg-[#FBF9F6]/50">
            <span className="text-[9px] font-mono font-bold text-[#C4A482] uppercase block mb-3">PROGRAM COORDINATORS</span>
            <h3 className="font-serif text-lg font-light text-ink mb-2">Creative Workshop Leaders</h3>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Index and organize photos, list upcoming seasonal workshop schedules, and manage all client applications effortlessly in one space.
            </p>
          </div>
        </div>
      </div>

      {/* 1. FEATURED RETREAT LAYOUT (Asymmetric, wide) */}
      {featuredRetreat && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-28"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Massive visual stage */}
            <div className="lg:col-span-7 relative group overflow-hidden bg-white/40 border border-ink/10 cursor-pointer" onClick={() => handleViewRetreat(featuredRetreat)}>
              <div className="absolute top-4 left-4 z-10 bg-[#FBF9F6] px-3 py-1.5 border border-ink/10 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#C4A482]">
                FEATURED RETREAT
              </div>
              <motion.img 
                referrerPolicy="no-referrer"
                src={featuredRetreat.heroImage} 
                alt={featuredRetreat.title}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover filter grayscale brightness-[0.98] contrast-[1.01] hover:grayscale-0 transition-all duration-700 ease-out"
                whileHover={{ scale: 1.03 }}
              />
              <div className="absolute inset-0 bg-ink/5 group-hover:bg-transparent transition duration-500" />
            </div>

            {/* Content narrative block */}
            <div className="lg:col-span-5 flex flex-col justify-center py-4">
              <div className="flex items-center space-x-1 text-xs text-[#5A6455] font-mono uppercase tracking-widest mb-3 flex-wrap gap-y-1">
                <MapPin size={12} className="text-[#5A6455]" />
                <span>{featuredRetreat.location}</span>
                <span className="mx-2 text-ink/20">•</span>
                <Calendar size={12} className="text-[#5A6455]" />
                <span>{featuredRetreat.dates}</span>
                <span className="mx-2 text-ink/20">•</span>
                <span className="text-[#5A6455] font-bold">Tuition from ${Math.min(...featuredRetreat.accommodations.map(a => a.price))} — All-Inclusive</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink tracking-tight leading-tight mt-1 mb-4">
                {featuredRetreat.title}
              </h2>
              
              <p className="text-xs uppercase tracking-[0.2em] text-ochre font-medium mb-5">
                {featuredRetreat.subtitle}
              </p>

              <div className="h-[1px] bg-ink/15 w-full my-4" />

              <p className="text-sm text-ink/75 font-sans leading-relaxed tracking-wide mb-6">
                {featuredRetreat.tagline}
              </p>

              <p className="text-xs italic text-ink/65 font-serif border-l border-ochre/40 pl-4 py-1 mb-8">
                &ldquo;{featuredRetreat.quote.text}&rdquo; <span className="block text-[10px] uppercase tracking-wider font-sans font-semibold text-ink/85 mt-1.5">— {featuredRetreat.quote.author}</span>
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <button
                  onClick={(e) => handleDirectApply(featuredRetreat, e)}
                  className="w-full sm:w-auto text-center bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 px-6 transition duration-300 cursor-pointer shadow-sm"
                >
                  Apply for this retreat
                </button>
                <button
                  onClick={() => handleViewRetreat(featuredRetreat)}
                  className="text-ink/60 hover:text-ink text-xs uppercase tracking-[0.2em] font-semibold transition cursor-pointer hover:underline border-none p-0 bg-transparent self-start"
                >
                  View Details & Live Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Magazine Editorial Rhythm Break (Large Landscape Image Block) */}
      <div className="my-20 md:my-32 border-t border-ink/10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          <div className="lg:col-span-8">
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#5A6455] uppercase font-bold block mb-2">HIGH-QUALITY IMAGERY</span>
            <h4 className="font-serif text-3xl font-light text-ink leading-tight max-w-xl">
              Clean, immersive visuals curated for <span className="italic">an editorial, premium brand feel.</span>
            </h4>
          </div>
          <div className="lg:col-span-4 text-left lg:text-right">
            <p className="text-[10px] text-ochre font-mono tracking-widest uppercase font-bold">EDITABLE PHOTO GALLERY</p>
            <p className="text-xs text-ink/60 font-sans mt-1">Stunning display layouts / Simple photograph updates</p>
          </div>
        </div>
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-ink/5 border border-ink/10 rounded-sm">
          <img 
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1500" 
            alt="Serene landscape" 
            className="w-full h-full object-cover filter grayscale contrast-[1.03] hover:grayscale-0 transition-all duration-[1200ms] brightness-95"
          />
          <div className="absolute bottom-4 left-4 bg-[#FBF9F6]/90 px-3 py-1.5 border border-[#1A1A1A]/10 text-[9px] font-mono uppercase tracking-widest text-[#5A6455] font-bold">
            "A peaceful space to retreat and recharge."
          </div>
        </div>
      </div>

      {/* 2. Platform Deliverables & Storefront Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-20 md:my-28 border-b border-ink/10 pb-16">
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] tracking-[0.25em] font-mono text-[#C4A482] uppercase font-bold block">WHY CLIENTS CHOOSE IT</span>
          <h4 className="font-serif text-2xl lg:text-3xl font-light text-ink leading-tight">
            Built for <span className="italic">Retreat Hosts & Programs</span>
          </h4>
          <p className="text-xs text-ink/75 leading-relaxed font-sans">
            Retreat OS delivers polished, booking-ready layouts with everything you need. Host high-converting booking pages and collect leads seamlessly without complicated setups, technical overhead, or high monthly software fees.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-5 border border-ink/10 bg-[#FBF9F6]/40 rounded-sm">
            <span className="text-[9px] font-mono font-bold text-[#5A6455] uppercase block mb-2">GUEST APPLICATIONS</span>
            <h5 className="font-serif text-base font-light text-ink mb-1">Included Application Flow</h5>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Features a seamless, elegant registration form. Guests can select lodging packages, share travel preferences, and submit reservation requests with ease.
            </p>
          </div>

          <div className="p-5 border border-ink/10 bg-[#FBF9F6]/40 rounded-sm">
            <span className="text-[9px] font-mono font-bold text-[#5A6455] uppercase block mb-2">MOBILE READY</span>
            <h5 className="font-serif text-base font-light text-ink mb-1">Responsive Mobile Layouts</h5>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Optimized imagery and elegant typography ensure your listing pages load incredibly fast and look spectacular on phones, tablets, and desktops.
            </p>
          </div>

          <div className="p-5 border border-ink/10 bg-[#FBF9F6]/40 rounded-sm">
            <span className="text-[9px] font-mono font-bold text-[#5A6455] uppercase block mb-2">SIMPLE PUBLISHING</span>
            <h5 className="font-serif text-base font-light text-ink mb-1">Setup Guides Included</h5>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Launch your site on free, reliable hosting. Follow our step-by-step visual documentation to make custom updates and go live in under five minutes.
            </p>
          </div>

          <div className="p-5 border border-ink/10 bg-[#FBF9F6]/40 rounded-sm">
            <span className="text-[9px] font-mono font-bold text-[#5A6455] uppercase block mb-2">AUTOMATED SELECTION</span>
            <h5 className="font-serif text-base font-light text-ink mb-1">Room & Availability Tracking</h5>
            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Lodging options automatically show up-to-date available spots, helping guests understand room layouts while encouraging early registrations.
            </p>
          </div>
        </div>
      </div>

      {/* Grid line separator */}
      <div className="h-[1px] bg-ink/10 w-full mb-16 md:mb-24" />

      {/* 2. SECONDARY RETREATS GRID (Dynamic, asymmetric layout) */}
      <div className="mb-20">
        <h3 id="listings" className="text-xs uppercase tracking-[0.3em] font-semibold text-ochre mb-10 block scroll-mt-24">UPCOMING RETREATS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {secondaryRetreats.map((retreat, index) => (
            <motion.div 
              key={retreat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onClick={() => handleViewRetreat(retreat)}
              className="group cursor-pointer flex flex-col h-full border border-ink/5 bg-white/40 hover:bg-white/70 p-5 rounded-sm transition duration-500 shadow-xs"
            >
              {/* Image Frame */}
              <div className="relative aspect-video w-full overflow-hidden mb-6 bg-ink/5 border border-ink/10">
                <motion.img 
                  referrerPolicy="no-referrer"
                  src={retreat.heroImage} 
                  alt={retreat.title}
                  className="w-full h-full object-cover filter grayscale brightness-95 hover:grayscale-0 transition-all duration-[800ms] ease-out"
                  whileHover={{ scale: 1.03 }}
                />
                <div className="absolute top-3 left-3 bg-[#FBF9F6]/90 px-2 py-1 text-[8px] tracking-[0.15em] uppercase font-bold border border-ink/10 text-sage">
                  {retreat.dates}
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center space-x-1.5 text-[10px] text-sage font-mono uppercase tracking-widest mb-2 flex-wrap gap-y-1">
                  <MapPin size={10} />
                  <span>{retreat.location}</span>
                  <span>•</span>
                  <span>{retreat.durationDays} Days</span>
                  <span>•</span>
                  <span className="text-[#5A6455] font-bold">Tuition from ${Math.min(...retreat.accommodations.map(a => a.price))} — All-Inclusive</span>
                </div>

                <h4 className="font-serif text-2xl font-light text-ink tracking-wide leading-snug group-hover:text-ochre transition duration-300 mt-1">
                  {retreat.title}
                </h4>

                <p className="text-[10px] uppercase tracking-widest text-[#C4A482] font-semibold mt-1 mb-4">
                  {retreat.subtitle}
                </p>

                <p className="text-xs text-ink/75 font-sans leading-relaxed tracking-wide mb-6 line-clamp-2">
                  {retreat.tagline}
                </p>

                <div className="mt-auto pt-4 border-t border-ink/10 flex items-center justify-between">
                  <button 
                    onClick={() => handleViewRetreat(retreat)}
                    className="text-[10px] uppercase tracking-[0.18em] text-ink hover:text-ochre font-bold border-b border-ink/10 hover:border-ochre/40 pb-0.5 transition duration-300 cursor-pointer"
                  >
                    Explore lodging details →
                  </button>
                  <span className="text-[10px] text-[#5A6455] font-mono tracking-widest bg-[#5A6455]/10 px-2 py-0.5 rounded-sm">
                    Spots Left: {retreat.accommodations.reduce((acc, tier) => acc + tier.spotsRemaining, 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zen Commercial Modules */}
      <div className="my-24 border-t border-ink/10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pb-16 border-b border-ink/10">
          
          {/* Customization Made Simple */}
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#5A6455] uppercase font-bold block">SIMPLE UPDATES</span>
            <h3 className="font-serif text-3xl font-light text-ink leading-tight">
              Customization <span className="italic">Made Simple</span>
            </h3>
            <p className="text-sm text-ink/75 leading-relaxed font-sans">
              No technical configuration or complicated hosting systems required. Every price, program duration, image section, itinerary hour, and packing checklist is managed inside one clear content file. Update your details in one central file, and your storefront updates instantly.
            </p>
            
            {/* Visual Config Snippet placeholder */}
            <div className="bg-[#1A1A1A] p-5 rounded-sm font-mono text-[11px] text-zinc-300 leading-relaxed shadow-md border border-neutral-800">
              <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-800 pb-2 mb-3 text-[10px]">
                <span>website-details.txt</span>
                <span className="text-ochre">SIMPLE CONTENT FILE</span>
              </div>
              <p><span className="text-indigo-300">location</span>: <span className="text-amber-200">"Ubud, Bali"</span></p>
              <p className="mt-1"><span className="text-indigo-300">accommodations</span>: <span className="text-amber-200">["Waterfront Bungalow", "Private Suite"]</span></p>
              <p className="mt-1"><span className="text-indigo-300">tuition_usd</span>: <span className="text-amber-200">4200</span></p>
              <p className="mt-1"><span className="text-indigo-300">available_spots</span>: <span className="text-amber-200">12</span></p>
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] font-mono text-ochre uppercase font-bold block">INCLUDED FEATURES</span>
              <h3 className="font-serif text-2xl font-light text-ink leading-tight mb-6">
                What's <span className="italic">Included</span>
              </h3>
              
              <div className="space-y-4 font-sans">
                <div className="flex items-start gap-3">
                  <span className="text-ochre font-mono text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide text-ink">Polished Booking & Listing Pages</h4>
                    <p className="text-xs text-ink/70">Beautifully styled pages including layout grids, retreat schedules, guest applications, and packing checklists out-of-the-box.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-ink/5 pt-4">
                  <span className="text-ochre font-mono text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide text-ink">Simple Content Updates</h4>
                    <p className="text-xs text-ink/70">A single source-of-truth configuration setup to edit program details, descriptions, hero photos, and price points without touching complex code.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-ink/5 pt-4">
                  <span className="text-ochre font-mono text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide text-ink">Room & Availability Tracking</h4>
                    <p className="text-xs text-ink/70">Give prospective guests instant information on available spots with room tracking that helps drive faster bookings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-ink/5 pt-4">
                  <span className="text-ochre font-mono text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wide text-ink">Setup Guides Included</h4>
                    <p className="text-xs text-[#5A6455] font-semibold">Includes straightforward, step-by-step launch guides for publishing your retreat website completely free in minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Best For / Not For (Side-by-Side Dual Lists with beautiful background) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 p-8 border border-ink/10 bg-[#FBF9F6]/60 rounded-sm">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.2em] font-mono text-[#5A6455] uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-700" /> PERFECT FOR
            </span>
            <ul className="space-y-2.5 text-xs text-ink/80 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Boutique Hospitality Hosts:</strong> Venues wanting a gorgeous editorial website with room tracking and availability displays.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Wellness Brands & Teachers:</strong> Instructors setting up polished booking pages and simple guest application forms.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Retreat Organizers:</strong> Curators managing high-ticket gatherings and multi-tiered packages without the digital hassle.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 border-t md:border-t-0 md:border-l border-ink/10 pt-6 md:pt-0 md:pl-8">
            <span className="text-[10px] tracking-[0.2em] font-mono text-ochre uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ochre" /> NOT DESIGNED FOR
            </span>
            <ul className="space-y-2.5 text-xs text-ink/70 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-ochre font-bold">✕</span>
                <span><strong>Generic Corporate Seminars:</strong> Organizations looking for complex enterprise sales layouts.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-ochre font-bold">✕</span>
                <span><strong>High-Volume Ticket Sales:</strong> Major stadium festivals or bulk general-admission conventions.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-ochre font-bold">✕</span>
                <span><strong>Complex Systems & Database Platforms:</strong> Multi-vendor marketplace projects or sites requiring ongoing custom databases.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Buyer FAQ Section */}
        <div className="space-y-8 my-16">
          <div className="text-center md:text-left">
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#5A6455] uppercase font-bold block mb-1">
              RECURRING QUESTIONS
            </span>
            <h3 className="font-serif text-2xl font-light text-ink">
              Template <span className="italic">FAQ</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left">
            <div className="space-y-2">
              <h4 className="font-serif text-base text-ink font-light">Do I need extensive coding knowledge to run this?</h4>
              <p className="text-xs text-ink/75 leading-relaxed font-sans">
                No. Because the entire template runs from simple layout setup files, basic copy changes in one simple file allow you to update dates, customize rooms, and alter photos instantly.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-base text-ink font-light">How is payment or intake processed?</h4>
              <p className="text-xs text-ink/75 leading-relaxed font-sans">
                Retreat OS is pre-wired to support high-converting booking applications. You can link your application directly to Stripe, PayPal, or your preferred payment provider through the included content file.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-base text-ink font-light">What technology is used?</h4>
              <p className="text-xs text-ink/75 leading-relaxed font-sans">
                It uses premium, lightning-fast modern code, ensuring instant loading speeds, reliable search engine optimization, and a beautiful mobile-first viewing experience.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-base text-ink font-light">Does the template support multiple active listings?</h4>
              <p className="text-xs text-ink/75 leading-relaxed font-sans">
                Yes. The homepage updates automatically for as many retreats as you host. If you have five global events per year, you can list all five inside the content file, and they will display beautifully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extra magazine-style details to showcase premium branding */}
      <footer className="mt-20 border-t border-ink/15 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-3">01 / CONVERSION DRIVEN</span>
          <p className="text-xs text-ink/75 leading-relaxed font-sans">
            Built to capture high-value leads with elegant intake friction, qualifying serious applicants only for exclusive high-ticket events.
          </p>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-3">02 / EASY COMPATIBILITY</span>
          <p className="text-xs text-ink/75 leading-relaxed font-sans">
            Lodging choices automatically update remaining spots based on registrations, preventing booking errors or manual tracking conflicts.
          </p>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-3">03 / FAST LAUNCH</span>
          <p className="text-xs text-[#C4A482] leading-relaxed font-sans font-medium">
            Standalone and ultra-fast. Launch and host your customized website with our simple launch guide in less than five minutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
