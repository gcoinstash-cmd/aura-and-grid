import React from 'react';
import { Project } from '../types';
import { RenderAisGraphic } from './AisGraphics';

interface HomeViewProps {
  variant: 'monograph' | 'studio' | 'residential';
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigateToPage: (page: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  variant,
  projects,
  onSelectProject,
  onNavigateToPage
}) => {
  // Grab the primary project (Stone Monolith or Komorebi) for main focus
  const monolith = projects.find(p => p.id === 'stone-monolith') || projects[0];
  const featured = projects.filter(p => p.featured);

  // Variant A: Monograph Landing Page
  if (variant === 'monograph') {
    return (
      <div className="space-y-24 py-6" id="monograph-home">
        {/* Massive full-bleed hero image and grid rules */}
        <div className="relative border border-stone-base p-6 bg-white shadow-xs">
          {/* Subtle 12-column decoration rules inside the frame to match guidelines */}
          <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-40" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">Selected Project</span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-graphite-dark leading-tight tracking-tight">
                Structure <br />
                <span className="italic font-normal text-bronze-dark">Precedes</span> Form.
              </h1>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <p className="text-sm text-graphite-light font-sans font-light leading-relaxed">
                We design buildings that respond to site, climate, and the way people move through space.
              </p>
              <button
                id="btn-discover-studio"
                onClick={() => onNavigateToPage('studio')}
                className="group flex items-center gap-3 text-xs uppercase font-mono tracking-widest text-graphite-dark hover:text-bronze-dark transition-all duration-300"
              >
                <span>View Studio Profile</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>

          {/* Core Feature Image Column with instant project routing */}
          <div className="mt-12 group cursor-pointer overflow-hidden border border-stone-base" onClick={() => onSelectProject(monolith.id)} id="monograph-hero-card">
            <div className="relative h-[480px] lg:h-[620px] transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <RenderAisGraphic type={monolith.mainImage} blueprint={false} />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#D9C8B4]">{monolith.specs.typology} — {monolith.specs.location}</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide">{monolith.title}</h2>
                  <p className="text-xs md:text-sm text-stone-base/80 font-sans font-light max-w-lg line-clamp-2">
                    {monolith.abstract}
                  </p>
                  <span className="inline-block text-[10px] uppercase font-mono tracking-widest pt-2 border-b border-orange-200/50">
                    View Case Study
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>PROJECT SEED: {monolith.specs.year}</span>
              <span>•</span>
              <span>GROSS AREA: {monolith.specs.grossArea}</span>
              <span>•</span>
              <span>PRIMARY MATERIAL: BOARD-FORMED STRUCTURE / SCHIST STONE</span>
            </div>
            <div className="text-right hidden sm:block">
              <span>PHOTOGRAPHY: STUDIO ARCHIVE</span>
            </div>
          </div>
        </div>

        {/* Selected works index (3 featured projects in alternating layout) */}
        <div className="space-y-16">
          <div className="flex justify-between items-baseline border-b border-stone-base pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-graphite-light">Selected Projects</h3>
            <button
              id="lnk-view-all-projects-mono"
              onClick={() => onNavigateToPage('projects')}
              className="text-xs uppercase font-mono tracking-widest text-bronze-light hover:text-bronze-dark transition-colors"
            >
              Selected Works ({projects.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.slice(0, 3).map((proj, idx) => (
              <div
                key={proj.id}
                id={`featured-mono-${proj.id}`}
                className="group cursor-pointer space-y-4"
                onClick={() => onSelectProject(proj.id)}
              >
                <div className="border border-stone-base overflow-hidden relative h-64 bg-stone-light">
                  <div className="absolute inset-0 opacity-15 bg-grid-lines pointer-events-none" />
                  <RenderAisGraphic type={proj.mainImage} blueprint={false} />
                  <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white font-mono text-[9px] px-2 py-1 tracking-wider uppercase">
                    MOD 0{idx + 1}
                  </div>
                </div>
                <div className="space-y-1.5 pb-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-serif text-lg text-graphite-dark group-hover:text-bronze-light transition-colors">{proj.title}</h4>
                    <span className="font-mono text-xs text-graphite-light">{proj.specs.year}</span>
                  </div>
                  <p className="text-xs text-graphite-light font-mono tracking-wider">{proj.specs.location} • {proj.category}</p>
                  <div className="flex justify-between text-[8px] font-mono uppercase text-gray-400/80 tracking-widest pt-2.5 pb-2">
                    <span>ARCHITECTS: VANCE / THORNE</span>
                    <span>PHOTO: J. HANSER</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Statement & Belief Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-stone-base p-10 bg-stone-light relative overflow-hidden" id="practice-stmt-block">
          <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-20" />
          <div className="lg:col-span-4 space-y-4 relative z-10">
            <span className="text-xs uppercase font-mono tracking-widest text-bronze-light">THE MANIFESTO</span>
            <h3 className="text-3xl font-serif text-graphite-dark font-light">Material Logic</h3>
          </div>
          <div className="lg:col-span-8 space-y-6 relative z-10 text-sm text-graphite-light leading-relaxed font-sans font-light">
            <p>
              We prioritize material integrity, spatial clarity, and buildings that respond precisely to context.
            </p>
            <p>
              Our work uses structure, orientation, and material to create calm, durable spaces with reduced energy demand.
            </p>
          </div>
        </div>

        {/* Blueprint view split introduction rail */}
        <div className="border border-stone-base p-8 bg-black text-white relative overflow-hidden" id="blueprint-strip">
          <div className="absolute inset-0 bg-blueprint-grid opacity-10" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-teal-400">TECHNICAL SCHEMATICS</span>
              <h3 className="text-3xl font-serif font-light tracking-wide text-white">Interactive Blueprint View</h3>
              <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                Toggle any photographic study into a technical drawing layer to inspect underlying grids, dimensions, and structural section callouts.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-end">
              <button
                id="btn-test-blueprint-toggle"
                onClick={() => onSelectProject(monolith.id)}
                className="px-6 py-3 border border-teal-500/35 bg-teal-950/20 text-teal-400 font-mono text-xs uppercase tracking-widest hover:bg-teal-400 hover:text-black transition-all duration-300 rounded-xs shadow-xs"
              >
                Open Blueprint View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant B: Studio-Forward Page
  if (variant === 'studio') {
    return (
      <div className="space-y-24 py-6" id="studio-home">
        {/* Massive philosophical statement */}
        <div className="border border-stone-base bg-white p-8 lg:p-16 space-y-8 relative">
          <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-30" />
          <div className="max-w-4xl space-y-6 relative z-10">
            <span className="text-xs uppercase font-mono tracking-widest text-bronze-light">STUDIO PROFILE</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-graphite-dark leading-tight">
              Designing structures rooted in Context, Material Depth, and <span className="font-normal italic text-bronze-dark">Tectonic Rigor</span>.
            </h1>
            <div className="border-t border-stone-base pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-graphite-light font-sans font-light">
              <p>
                Perspective is an architectural practice. We reject generic, one-size-fits-all designs. Our works look toward the topography, climate, and local materials of their exact sites as active building blocks.
              </p>
              <p>
                From private Swiss sanctuaries embedded in mountain shale to lightweight modular pavilions floating over Kyoto moss, each project operates in mathematical and mechanical tension.
              </p>
            </div>
          </div>
        </div>

        {/* Big Alternating Row layouts of featured work */}
        <div className="space-y-16">
          <div className="flex justify-between items-baseline border-b border-stone-base pb-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#404040]">Featured Portfolio Rail</h3>
            <button
              id="lnk-view-all-studio"
              onClick={() => onNavigateToPage('projects')}
              className="text-xs uppercase font-mono tracking-widest text-bronze-light hover:text-bronze-dark transition-colors"
            >
              Browse Category Filters →
            </button>
          </div>

          <div className="space-y-16">
            {featured.slice(0, 2).map((proj, idx) => (
              <div
                key={proj.id}
                id={`studio-feat-${proj.id}`}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group`}
                onClick={() => onSelectProject(proj.id)}
              >
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="border border-stone-base overflow-hidden relative h-96 bg-stone-light">
                    <RenderAisGraphic type={proj.mainImage} blueprint={false} />
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs uppercase font-mono tracking-widest text-bronze-light">{proj.category} • {proj.specs.year}</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-graphite-dark group-hover:text-bronze-dark transition-colors">{proj.title}</h3>
                  <p className="text-sm text-graphite-light font-sans font-light leading-relaxed">
                    {proj.abstract}
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-stone-base pt-4 font-mono text-[10px] text-graphite-light uppercase">
                    <div>
                      <span className="block text-gray-400">LOCATION</span>
                      <span className="font-semibold text-graphite-dark">{proj.specs.location}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400">AREA</span>
                      <span className="font-semibold text-graphite-dark">{proj.specs.grossArea}</span>
                    </div>
                  </div>
                  <span className="inline-block text-xs uppercase font-mono tracking-widest text-bronze-light pt-2 group-hover:underline">
                    View Project Spec Sheets
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick process pillars strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-stone-base pt-12">
          {[
            { tag: '01', title: 'SITE ANALYSIS', desc: 'Analyzing topography, microclimates, and regional materials to inform context-informed structures.' },
            { tag: '02', title: 'STRUCTURAL ORDER', desc: 'Establishing clear modular grid systems that allow for spatial versatility and structural integrity.' },
            { tag: '03', title: 'PASSIVE DESIGN', desc: 'Optimizing solar orientation and natural air currents to reduce energy demands.' },
            { tag: '04', title: 'MATERIAL IMPLEMENTATION', desc: 'Collaborating with master craftspersons to ensure material junctions are refined and durable.' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-3">
              <span className="block text-xs uppercase font-mono tracking-wider font-semibold text-bronze-dark">{item.tag} // {item.title}</span>
              <p className="text-xs text-graphite-light leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Variant C: Residential-Specialist
  return (
    <div className="space-y-16 py-6 font-sans" id="residential-home">
      {/* Editorial Headline */}
      <div className="border-b border-stone-base pb-8 space-y-4">
        <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">RESIDENTIAL PORTFOLIO</span>
        <h1 className="text-4xl md:text-6xl font-serif text-graphite-dark font-light md:max-w-3xl">
          Private sanctuaries crafted with silent geometry and durable weight.
        </h1>
      </div>

      {/* Bento Grid layout prioritizing stunning full-width alpine configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Large featured card spanning 8 cols */}
        <div
          id="bento-card-large"
          className="lg:col-span-8 border border-stone-base bg-white p-4 space-y-4 group cursor-pointer"
          onClick={() => onSelectProject('stone-monolith')}
        >
          <div className="overflow-hidden relative h-[360px] md:h-[480px]">
            <RenderAisGraphic type="stone-monolith-render" blueprint={false} />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs text-graphite-dark font-mono text-[10px] px-3 py-1.5 uppercase tracking-widest border border-stone-base">
              Lugano Residence
            </div>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <h2 className="text-2xl font-serif text-graphite-dark group-hover:text-bronze-dark transition-colors">The Stone Monolith</h2>
            <span className="text-xs font-mono text-graphite-light">LUGANO, SWITZERLAND</span>
          </div>
          <p className="text-xs text-graphite-light font-sans font-light">
            Set into the hillside, using board-formed concrete to frame lake views and respond to native topography.
          </p>
        </div>

        {/* Small adjacent cards spanning 4 cols */}
        <div className="lg:col-span-4 space-y-8">
          <div className="border border-stone-base bg-stone-light p-6 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-bronze-dark font-semibold">Residential Expertise</h4>
            <p className="text-xs text-graphite-light leading-relaxed">
              We design homes for clients who desire permanent shelter from external clutter. Each structure uses heavy walls to stabilize thermal properties and custom light wells to introduce kinetic sun arcs.
            </p>
            <button
              id="btn-read-bio"
              onClick={() => onNavigateToPage('studio')}
              className="text-xs uppercase text-graphite-dark hover:text-bronze-dark font-mono font-semibold tracking-widest underline"
            >
              Meet Private Architects
            </button>
          </div>

          <div
            id="bento-card-small-relic"
            className="border border-stone-base bg-white p-4 space-y-4 cursor-pointer group"
            onClick={() => onSelectProject('relic-void')}
          >
            <div className="overflow-hidden h-48 bg-stone-base relative">
              <RenderAisGraphic type="relic-render" blueprint={false} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B45309]">RESTORATION</span>
              <h3 className="font-serif text-lg group-hover:text-bronze-dark transition-colors">Relic & Void</h3>
              <p className="text-[11px] text-graphite-light font-sans line-clamp-2">
                A modern steel & glass micro-house slipped into 14th-century Italian masonry ruins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected gallery strip showing custom materials */}
      <div className="border border-stone-base p-8 bg-white space-y-6">
        <h3 className="text-xs uppercase font-mono tracking-widest text-graphite-light border-b border-stone-base pb-3">Selected Material Palettes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Board-formed Concrete', focus: 'Lugano Retaining structure', desc: 'Heavy structural matrix with cedar-pressed skin lines.' },
            { title: 'Shou Sugi Ban Cypress', focus: 'Kyoto Tea Pavilion', desc: 'Charred timber repelling rot, mold, and insect penetration.' },
            { title: 'Aged Schist Stone', focus: 'Alpine Drymasonry', desc: 'Local raw gneiss stack holding heat with pristine joint patterns.' },
            { title: 'Siena Ceramic Brick', focus: 'Tuscan Ruins core', desc: 'Acoustically dense clay baked to historic kiln codes.' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2 border-r last:border-0 border-stone-base pr-4">
              <span className="block font-serif text-sm font-medium text-graphite-dark">{item.title}</span>
              <span className="block font-mono text-[9px] uppercase text-bronze-light">{item.focus}</span>
              <p className="text-[11px] text-graphite-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
