import React, { useState } from 'react';
import { Project } from '../types';
import { RenderAisGraphic } from './AisGraphics';
import { Layers, Eye, Maximize2, X, ChevronRight, CornerDownRight } from 'lucide-react';

interface DirectCaseProps {
  project: Project;
  allProjects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigateToPage: (page: string) => void;
}

export const DirectCase: React.FC<DirectCaseProps> = ({
  project,
  allProjects,
  onSelectProject,
  onNavigateToPage
}) => {
  // Let's hold state for whether we are in Blueprint view or Photography view inside the case study!
  const [blueprintActive, setBlueprintActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Find next project index for sitemap navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="space-y-16 py-6" id={`case-study-${project.id}`}>
      
      {/* 1. Project Title Block with meta data */}
      <div className="border border-stone-base bg-white p-8 space-y-6 relative">
        <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-20" />
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[#8F806F] font-semibold">
              CASE STUDY // VOL. 0{currentIndex + 1}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-graphite-dark font-light tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-sm font-sans italic text-graphite-light">{project.subtitle}</p>
          </div>
          <button
            id="back-to-matrix-btn"
            onClick={() => onNavigateToPage('projects')}
            className="text-xs uppercase font-mono tracking-widest text-gray-400 hover:text-black self-start border-b border-gray-300 pb-1"
          >
            ← Back to Projects
          </button>
        </div>

        {/* Top summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-base text-xs font-mono">
          <div>
            <span className="block text-gray-400 text-[10px]">TYPOLOGY</span>
            <span className="font-semibold text-graphite-dark">{project.specs.typology}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-[10px]">LOCATION</span>
            <span className="font-semibold text-graphite-dark">{project.specs.location}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-[10px]">YEAR OF WORK</span>
            <span className="font-semibold text-graphite-dark">{project.specs.year}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-[10px]">COLLABORATORS</span>
            <span className="font-semibold text-graphite-dark line-clamp-1">{project.specs.collaborators}</span>
          </div>
        </div>
      </div>      {/* 2. Large-format Hero Image with Premium Frame Shift cross-fade */}
      <div className={`relative group border p-2 bg-white transition-all duration-1000 ${blueprintActive ? 'border-teal-500/40 shadow-[0_0_35px_-5px_rgba(20,184,166,0.15)] bg-slate-950' : 'border-stone-base'}`}>
        <div className="relative h-[380px] md:h-[550px] lg:h-[620px] overflow-hidden bg-stone-light transition-all duration-1000">
          
          {/* Subtle grid lines inside the hero window */}
          <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-25 z-10" />
          
          {/* Layer A: Elegant Photograph Layer */}
          <div className={`w-full h-full transition-all duration-1000 ease-in-out ${
            blueprintActive 
              ? 'opacity-[0.10] grayscale brightness-[0.35] contrast-[1.10] scale-[0.98] blur-[0.5px]' 
              : 'opacity-100 scale-100 filter-none'
          }`}>
            <RenderAisGraphic type={project.mainImage} blueprint={false} />
          </div>

          {/* Layer B: Interactive Blueprints Schematic Overlay */}
          <div className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000 ease-in-out z-20 ${
            blueprintActive 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-[1.03]'
          }`}>
            {/* Dark multiply blend overlay when blueprint is active to deepen the shadow background */}
            <div className={`absolute inset-0 bg-slate-950/40 mix-blend-multiply transition-opacity duration-1000 ${
              blueprintActive ? 'opacity-100' : 'opacity-0'
            }`} />
            
            <RenderAisGraphic type={project.mainImage} blueprint={true} />
            
            {/* Extra blueprint graph ticks */}
            <div className="absolute inset-0 bg-blueprint-grid opacity-[0.04]" />
          </div>

          {/* Interactive Toggle inside the Hero image container! */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center z-30">
            {/* Left toggle buttons with precision mechanical interaction triggers */}
            <div className="bg-graphite-dark/95 text-white backdrop-blur-md p-1.5 flex gap-1 border border-stone-light/20 shadow-lg select-none">
              <button
                id="photo-toggle-btn"
                onClick={() => setBlueprintActive(false)}
                className={`px-4 py-2 text-[11px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all group relative overflow-hidden cursor-pointer ${
                  !blueprintActive
                    ? 'bg-white text-graphite-dark font-semibold'
                    : 'text-stone-base hover:text-white hover:bg-white/10'
                }`}
              >
                <Eye className={`w-3.5 h-3.5 transition-transform duration-500 ${!blueprintActive ? 'scale-110' : 'group-hover:scale-125'}`} />
                <span>PHOTO STUDY</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${!blueprintActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
              <button
                id="blueprint-toggle-btn"
                onClick={() => setBlueprintActive(true)}
                className={`px-4 py-2 text-[11px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all group relative overflow-hidden cursor-pointer ${
                  blueprintActive
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-stone-base hover:text-[#00D2FF] hover:bg-white/10'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 transition-transform duration-500 ${blueprintActive ? 'rotate-90' : 'group-hover:rotate-12'}`} />
                <span>BLUEPRINT VIEW</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#00D2FF] transition-all duration-300 ${blueprintActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            </div>

            {/* Right expand lightbox button */}
            <button
              id="expand-cad-btn"
              onClick={() => setLightboxOpen(true)}
              className="bg-white/90 hover:bg-white text-graphite-dark backdrop-blur-md p-2.5 shadow-md flex items-center gap-2 text-xs font-mono uppercase tracking-widest border border-stone-base self-end md:self-auto"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Inspect Schematic Drawing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Project Abstract, 80-120 words */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-stone-base pb-12">
        <div className="lg:col-span-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" />
            <span>Abstract Summary</span>
          </span>
        </div>
        <div className="lg:col-span-9">
          <p className="text-xl md:text-2xl font-serif text-graphite-light font-light leading-relaxed">
            {project.abstract}
          </p>
          <div className="mt-4 text-xs font-mono text-gray-400">
            {project.blueprintCaption}
          </div>
        </div>
      </div>

      {/* 4 & 5. Technical Specs Table (Exhibition wall-text style: fine rules, uppercase, generous spacing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">
            Technical Specifications
          </span>
          <p className="text-xs text-graphite-light font-sans font-light leading-relaxed pr-6">
            Physical parameters documenting structural area, location data, and context constraints.
          </p>
        </div>

        {/* Rigorous Specifications Grid */}
        <div className="lg:col-span-8 border border-stone-base bg-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { label: 'Project Location', value: project.specs.location },
              { label: 'Year Completed/Phased', value: project.specs.year },
              { label: 'Architectural Typology', value: project.specs.typology },
              { label: 'Structural Status', value: project.specs.status },
              { label: 'Gross Enclosed Area', value: project.specs.grossArea },
              { label: 'Primary Materials Applied', value: project.specs.materials },
              { label: 'Inner Spatial Program', value: project.specs.program },
              { label: 'Client Commission Group', value: project.specs.client },
              { label: 'Lead Collaborators', value: project.specs.collaborators },
              { label: 'Tectonic Photographer Offset', value: project.specs.photography }
            ].map((spec, i) => (
              <div key={i} className="border-b border-stone-light pb-3 pt-2 last:border-0">
                <span className="block text-[9px] uppercase font-mono tracking-wider text-gray-400">
                  {spec.label}
                </span>
                <span className="block text-xs font-sans text-graphite-dark pr-2 font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Systemic Coefficient Matrix Panel */}
          {project.specs.structuralGrid && (
            <div className="mt-8 pt-6 border-t border-stone-base space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="block text-[10px] uppercase font-mono tracking-widest text-[#8A7A5B] font-bold">
                  Systemic Coefficient & Tectonic Matrix
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FAF8F5] border border-stone-base/60 p-4 space-y-1 hover:border-bronze-light transition-colors duration-300">
                  <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">Structural Grid Increment</span>
                  <span className="block text-[11px] font-mono text-graphite-dark font-medium leading-normal">{project.specs.structuralGrid}</span>
                </div>
                <div className="bg-[#FAF8F5] border border-stone-base/60 p-4 space-y-1 hover:border-bronze-light transition-colors duration-300">
                  <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">Sparsity Index (V/M Ratio)</span>
                  <span className="block text-[11px] font-mono text-graphite-dark font-medium leading-normal">{project.specs.sparsityIndex}</span>
                </div>
                <div className="bg-[#FAF8F5] border border-stone-base/60 p-4 space-y-1 hover:border-bronze-light transition-colors duration-300">
                  <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">Facade Performance Class</span>
                  <span className="block text-[11px] font-mono text-graphite-dark font-medium leading-normal">{project.specs.facadeClass}</span>
                </div>
                <div className="bg-[#FAF8F5] border border-stone-base/60 p-4 space-y-1 hover:border-bronze-light transition-colors duration-300">
                  <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">Solar Azimuth Orientation</span>
                  <span className="block text-[11px] font-mono text-graphite-dark font-medium leading-normal">{project.specs.solarResponse}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Design Narrative in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-stone-base pt-12 items-start" id="design-narrative">
        <div className="lg:col-span-4">
          <h3 className="text-xs uppercase font-mono tracking-widest text-bronze-dark font-semibold">
            Design Case Narrative
          </h3>
          <span className="block text-xs font-mono text-gray-400 mt-1">THE MATHEMATICAL FORM</span>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-graphite-light leading-relaxed font-sans font-light">
          {project.narrative.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* 7. Image Gallery with Captions */}
      <div className="space-y-8" id="captions-gallery">
        <h3 className="text-xs uppercase font-mono tracking-widest text-bronze-light border-b border-stone-base pb-3">
          Selected Views
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.gallery.map((img, i) => (
            <div key={i} className="border border-stone-base p-3 bg-white space-y-3">
              <div className="aspect-[4/3] bg-stone-light border border-stone-light overflow-hidden">
                <RenderAisGraphic type={img.url} blueprint={false} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-bronze-light">FIG. 0{i + 1}</span>
                <p className="text-xs text-graphite-light font-sans line-clamp-2">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Closing Quote or Project Principle */}
      <div className="border border-stone-base bg-stone-light p-10 text-center space-y-4 max-w-4xl mx-auto italic relative overflow-hidden" id="closing-quote-card">
        <div className="absolute inset-y-0 bg-grid-lines pointer-events-none opacity-20" />
        <span className="block text-xs uppercase font-mono tracking-widest text-bronze-light not-italic font-bold">PRACTICE PHILOSOPHY</span>
        <blockquote className="text-2xl md:text-3xl font-serif text-graphite-dark font-light md:max-w-2xl mx-auto leading-relaxed">
          "The weight of stone and transparency of glass do not require decoration. Gravity and proportion are details enough."
        </blockquote>
      </div>

      {/* 9. Next Project Navigation Rail */}
      <div
        id="btn-next-project-scrolling"
        onClick={() => {
          onSelectProject(nextProject.id);
          window.scrollTo(0, 0);
        }}
        className="group cursor-pointer border border-stone-base bg-white p-8 hover:bg-stone-light transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">NEXT MONOGRAPH</span>
            <h3 className="text-xl md:text-2xl font-serif text-graphite-dark group-hover:text-bronze-light transition-all duration-300">
              {nextProject.title}
            </h3>
            <span className="block text-xs font-mono text-bronze-dark uppercase">{nextProject.category} • {nextProject.specs.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-graphite-dark group-hover:translate-x-2 transition-transform duration-300">
            <span>Next Study</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* TECHNICAL CAD BLUEPRINT LIGHTBOX OVERLAY */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-6 overflow-y-auto" id="cad-lightbox">
          {/* Lightbox Header */}
          <div className="flex justify-between items-baseline border-b border-teal-500/20 pb-4 text-white">
            <div className="space-y-1">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">TECHNICAL DRAWINGS</span>
              <h2 className="text-lg font-serif">In-Depth blueprint schematic: {project.title}</h2>
            </div>
            <button
              id="close-lightbox-btn"
              onClick={() => setLightboxOpen(false)}
              className="p-2 border border-teal-500/30 text-teal-400 hover:bg-teal-400 hover:text-black font-mono text-xs uppercase tracking-widest transition-all gap-1 flex items-center"
            >
              <X className="w-4 h-4" />
              <span>Close Draw</span>
            </button>
          </div>

          {/* Lightbox Visual Area */}
          <div className="my-8 max-w-5xl mx-auto w-full aspect-[16/10] bg-teal-950/20 border border-teal-500/30 overflow-hidden relative shadow-lg">
            {/* Real vector drawing */}
            <RenderAisGraphic type={project.mainImage} blueprint={true} />
            <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />
          </div>

          {/* Lightbox Footer text */}
          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 text-white border-t border-teal-500/20 pt-4">
            <div className="md:col-span-4">
              <span className="font-mono text-xs text-teal-400">BLUEPRINT CAPTION DATA //</span>
            </div>
            <div className="md:col-span-8 text-xs text-slate-300 font-sans leading-relaxed">
              <p>{project.blueprintCaption}</p>
              <p className="mt-2 text-teal-500/60 font-mono text-[10px]">
                FILE: {project.id}_assembly_layout.dwg | VECTOR SCALE 1:50
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
