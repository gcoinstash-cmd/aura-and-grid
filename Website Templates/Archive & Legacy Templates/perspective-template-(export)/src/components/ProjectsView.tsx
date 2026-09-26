import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { RenderAisGraphic } from './AisGraphics';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Residential',
  'Commercial',
  'Hospitality',
  'Cultural',
  'Renovation',
  'Unbuilt / Concept'
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');

  // Filter projects accordingly
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16 py-6" id="projects-index-view">
      {/* Title & Introduction block */}
      <div className="relative border border-stone-base bg-white p-8 space-y-6">
        <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-20" />
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">SELECTED WORKS</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-graphite-dark">Project Matrix</h1>
          <p className="text-sm text-graphite-light leading-relaxed font-sans font-light">
            A chronological matrix of our commissions and research studies. Each project represents a specific dialogue between site conditions, structural clarity, and materials.
          </p>
        </div>
      </div>

      {/* Categories Horizontal Filter Rail */}
      <div className="border-y border-stone-base py-4 flex flex-wrap gap-2 md:gap-4 items-center justify-start overflow-x-auto no-scrollbar" id="matrix-filters">
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-graphite-light mr-4">CATEGORIES:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(/[^a-z]/g, '')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-sm ${
              selectedCategory === cat
                ? 'bg-graphite-dark text-white'
                : 'text-graphite-light hover:text-bronze-dark bg-[#F1EFEA]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image-led Rows list block */}
      <div className="space-y-12" id="projects-row-matrix">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-stone-base bg-white">
            <span className="font-mono text-xs text-graphite-light uppercase tracking-wider">No commissions matched your spatial filter.</span>
          </div>
        ) : (
          filteredProjects.map((proj, idx) => (
            <div
              key={proj.id}
              id={`matrix-row-${proj.id}`}
              onClick={() => onSelectProject(proj.id)}
              className="group cursor-pointer border border-stone-base bg-white p-6 transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 relative"
            >
              <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Index numbering + Name */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-bronze-light">0{idx + 1} //</span>
                    <span className="text-xs font-mono text-gray-400 font-light">{proj.category.toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-graphite-dark font-light group-hover:text-bronze-light transition-all duration-300 leading-tight">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-graphite-light font-sans font-light italic">
                    {proj.subtitle}
                  </p>
                  <div className="flex gap-4 text-[9px] font-mono text-gray-400 uppercase tracking-widest pt-2 pb-2">
                    <span>ARCHITECTS: VANCE / THORNE</span>
                    <span>•</span>
                    <span>PHOTO: J. HANSER</span>
                  </div>
                </div>

                {/* Technical data table (Compact block similar to exhibition text) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-4 text-xs font-mono border-l lg:border-l-0 lg:border-x border-stone-base lg:px-6">
                  <div>
                    <span className="block text-gray-400 text-[9px] uppercase">LOCATION</span>
                    <span className="font-medium text-graphite-dark">{proj.specs.location}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[9px] uppercase">YEAR</span>
                    <span className="font-medium text-graphite-dark">{proj.specs.year}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[9px] uppercase">GROSS AREA</span>
                    <span className="font-medium text-[#1A1A1A]">{proj.specs.grossArea}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[9px] uppercase">STATUS</span>
                    <span className="font-medium text-bronze-dark uppercase">{proj.specs.status}</span>
                  </div>
                </div>

                {/* Thumbnail image and direct link */}
                <div className="lg:col-span-4 flex items-center gap-6 justify-between lg:justify-end">
                  <div className="hidden sm:block w-48 h-28 border border-stone-base overflow-hidden bg-stone-light">
                    <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-105">
                      <RenderAisGraphic type={proj.mainImage} blueprint={false} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs uppercase font-mono tracking-widest text-bronze-light group-hover:text-bronze-dark transition-colors border-b border-stone-base pb-1">
                      Case Study →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Unbuilt Statement block */}
      <div className="border border-stone-base bg-[#FAF8F5] p-8 text-center max-w-2xl mx-auto space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-widest text-[#8A7A5B] font-semibold">CONCEPT & DEVELOPMENT</h4>
        <p className="text-xs text-graphite-light font-sans font-light leading-relaxed">
          Projects marked as Concept or Unbuilt represent ongoing spatial research and speculative enquiries. We present these studies with the same technical rigor as our built works to continuously test structural and environmental principles.
        </p>
      </div>
    </div>
  );
};
