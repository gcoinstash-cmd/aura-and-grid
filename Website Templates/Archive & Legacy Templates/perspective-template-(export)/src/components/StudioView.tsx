import React from 'react';
import { StudioProfile } from '../types';
import { Award, Layers, Compass, HelpCircle } from 'lucide-react';

interface StudioViewProps {
  profile: StudioProfile;
}

export const StudioView: React.FC<StudioViewProps> = ({ profile }) => {
  return (
    <div className="space-y-16 py-6" id="studio-practice-view">
      
      {/* Editorial Profile Header */}
      <div className="relative border border-stone-base bg-white p-8 lg:p-12 space-y-6">
        <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-20" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">PRACTICE PROFILE</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-graphite-dark">The Studio</h1>
          <p className="text-lg md:text-xl text-graphite-light font-sans font-light leading-relaxed">
            {profile.intro}
          </p>
        </div>
      </div>

      {/* Philosophy Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-y border-stone-base py-12 items-baseline">
        <div className="lg:col-span-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">
            Our Philosophy
          </span>
          <span className="block text-xs font-mono text-gray-400 mt-1">SPATIAL PRINCIPLES</span>
        </div>
        <div className="lg:col-span-8 space-y-6 text-sm text-graphite-light font-sans font-light leading-relaxed">
          {profile.philosophy.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Services List (Technical & Specific for Architects) */}
      <div className="space-y-8">
        <div className="space-y-2 border-b border-stone-base pb-3">
          <span className="text-xs uppercase font-mono tracking-widest text-gray-400">EXPERT AREAS</span>
          <h2 className="text-2xl font-serif text-graphite-dark">Studio Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.services.map((serv, i) => (
            <div key={i} className="border border-stone-base bg-white p-6 space-y-3 relative group hover:bg-stone-light/10 transition-colors">
              <div className="absolute top-4 right-4 text-stone-dark text-xs font-mono">CAP. 0{i + 1}</div>
              <h3 className="font-serif text-lg text-graphite-dark font-medium">{serv.title}</h3>
              <p className="text-xs text-graphite-light leading-relaxed font-sans font-light">
                {serv.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section representing "How we build" */}
      <div className="space-y-8 border-t border-stone-base pt-12">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-gray-400">METHODOLOGY</span>
          <h2 className="text-2xl font-serif text-graphite-dark">Our Process</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {profile.process.map((p, i) => (
            <div key={i} className="border border-stone-base bg-white p-6 space-y-4">
              <span className="text-xs font-mono text-bronze-light font-bold block">PHASE {p.step}</span>
              <h4 className="font-serif text-base text-graphite-dark font-medium border-b border-stone-light pb-2">{p.title}</h4>
              <p className="text-xs text-graphite-light leading-relaxed font-sans font-light">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Bios */}
      <div className="space-y-8 border-t border-stone-base pt-12" id="practitioners">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-gray-400">FOUNDING ARCHITECTS</span>
          <h2 className="text-2xl font-serif text-graphite-dark">The Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.team.map((member, i) => (
            <div key={i} className="border border-stone-base bg-white p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start" id={`member-${member.name.toLowerCase().replace(/[^a-z]/g, '')}`}>
              {/* Profile silhouette avatar or high-end Unsplash portrait */}
              <div className="sm:col-span-4 aspect-square bg-[#E8E4DB] border border-stone-base flex items-center justify-center relative overflow-hidden">
                {member.image && (member.image.startsWith('http://') || member.image.startsWith('https://')) ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-[600ms] ease-out select-none"
                  />
                ) : (
                  <>
                    <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-25" />
                    <div className="text-xs font-mono text-stone-dark uppercase">PRIN. 0{i+1}</div>
                  </>
                )}
              </div>
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <h3 className="font-serif text-xl font-medium text-graphite-dark">{member.name}</h3>
                  <p className="text-xs uppercase font-mono tracking-wider text-bronze-light">{member.role}</p>
                </div>
                <p className="text-xs text-graphite-light leading-relaxed font-sans font-light">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recognition Table: fine rules, uppercase labels, compact column layout */}
      <div className="space-y-8 border-t border-stone-base pt-12" id="press-awards">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-gray-400">AWARDS & RECOGNITIONS</span>
          <h2 className="text-2xl font-serif text-graphite-dark">Studio Ledger</h2>
        </div>
        <div className="border border-stone-base bg-white overflow-hidden">
          <div className="grid grid-cols-12 bg-stone-light p-4 text-[9px] font-mono tracking-widest text-gray-400 uppercase border-b border-stone-base hidden md:grid">
            <div className="col-span-2">YEAR</div>
            <div className="col-span-5">PREMIUM NOMINATION / TITLE</div>
            <div className="col-span-5">PUBLISHED IN / MEDIUM</div>
          </div>
          <div className="divide-y divide-stone-light font-sans text-xs">
            {profile.recognition.map((rec, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-4 gap-2 items-center hover:bg-stone-light/10">
                <div className="col-span-2 font-mono font-medium text-bronze-dark text-xs md:text-sm">{rec.year}</div>
                <div className="col-span-5 font-semibold text-graphite-dark">{rec.title}</div>
                <div className="col-span-5 italic text-graphite-light">{rec.medium}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
