import React, { useState } from 'react';
import { JournalPost } from '../types';
import { BookOpen, Calendar, Clock } from 'lucide-react';

interface JournalViewProps {
  posts: JournalPost[];
}

const JOURNAL_CATEGORIES = ['All', 'Notes', 'Process', 'Materials', 'Site Visits', 'Press'] as const;

export const JournalView: React.FC<JournalViewProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="space-y-16 py-6" id="journal-publication-view">
      
      {/* Editorial Journal Header */}
      <div className="relative border border-stone-base bg-white p-8 space-y-6">
        <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-20" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">THE JOURNAL</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-graphite-dark">Field Essays & Notes</h1>
          <p className="text-sm text-graphite-light leading-relaxed font-sans font-light">
            A research space where we document our geotech trials, site visits, structural formulas, and material monographs. We believe exposing our processes drives global architecture forward.
          </p>
        </div>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="border-y border-stone-base py-4 flex flex-wrap gap-2 md:gap-4 items-center overflow-x-auto no-scrollbar" id="journal-category-filters">
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-graphite-light mr-4">JOURNAL TOPIC:</span>
        {JOURNAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`jfilter-${cat.toLowerCase()}`}
            onClick={() => {
              setSelectedCategory(cat);
              setActivePostId(null); // Return to list view
            }}
            className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-xs ${
              selectedCategory === cat
                ? 'bg-graphite-dark text-white'
                : 'text-graphite-light hover:text-bronze-dark bg-[#F1EFEA]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main content grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial list of posts / Active Essay Reader */}
        <div className="lg:col-span-8 space-y-12">
          {activePost ? (
            /* ACTIVE POST DETAILED ESSAY VIEW */
            <div className="border border-stone-base bg-white p-8 space-y-8 relative" id={`active-essay-${activePost.id}`}>
              <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-10" />
              
              <button
                id="btn-return-journal-list"
                onClick={() => setActivePostId(null)}
                className="text-xs uppercase text-gray-400 font-mono tracking-widest hover:text-black hover:underline inline-block pb-1 mb-4"
              >
                ← Back to Essay Ledger
              </button>
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-bronze-light">
                  <span className="bg-stone-light px-2.5 py-1 uppercase">{activePost.category}</span>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> <span>{activePost.date}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> <span>{activePost.readTime}</span></div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-serif text-graphite-dark font-light leading-tight">
                  {activePost.title}
                </h1>
                
                <p className="text-lg font-serif italic text-graphite-light font-light border-l-2 border-stone-base pl-4 py-1 leading-relaxed">
                  {activePost.abstract}
                </p>
              </div>

              {/* Real architectural detail photography overlay with geometric guide lines */}
              <div className="aspect-[16/9] bg-[#E8E4DB] border border-stone-base flex items-center justify-center overflow-hidden relative">
                {activePost.image && (activePost.image.startsWith('http://') || activePost.image.startsWith('https://')) ? (
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-95 contrast-[1.05] hover:grayscale-0 transition-all duration-[800ms] select-none"
                  />
                ) : null}
                <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-40" />
                <div className="absolute bottom-4 right-4 bg-graphite-dark/95 backdrop-blur-sm text-[9px] font-mono text-[#F1EFEA] px-3 py-1 border border-stone-light/10 uppercase tracking-widest shadow-md">
                  Tectonic Study: {activePost.category}
                </div>
              </div>

              {/* Essay Content */}
              <div className="space-y-6 text-sm text-graphite-light leading-relaxed font-sans font-light">
                {activePost.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="border-t border-stone-base pt-6 flex justify-between items-baseline">
                <span className="text-xs font-mono text-gray-400">AUTHOR: PERSPECTIVE RESEARCH CELL</span>
                <button
                  id="btn-close-essay-footer"
                  onClick={() => {
                    setActivePostId(null);
                    window.scrollTo(0, 0);
                  }}
                  className="text-xs uppercase font-mono text-bronze-light hover:text-bronze-dark underline"
                >
                  Return to ledger
                </button>
              </div>
            </div>
          ) : (
            /* CLASSIC MONOGRAPH LEDGER LIST (STAGGERED ROWS ACCENTING ABSTRACTS) */
            <div className="space-y-12">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 border border-stone-base bg-white">
                  <span className="font-mono text-xs text-graphite-light uppercase tracking-wider">No essays published in this topic yet.</span>
                </div>
              ) : (
                filteredPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    id={`essay-card-${post.id}`}
                    className="group border border-stone-base bg-white p-6 md:p-8 space-y-6 relative hover:shadow-xs transition-shadow cursor-pointer"
                    onClick={() => {
                      setActivePostId(post.id);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-mono border-b border-stone-light pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-bronze-dark">0{idx + 1} //</span>
                        <span className="uppercase text-gray-400">{post.category}</span>
                      </div>
                      <span className="text-gray-400">{post.date} • {post.readTime}</span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl font-serif text-graphite-dark font-light group-hover:text-bronze-light transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-xs text-graphite-light font-sans font-light leading-relaxed line-clamp-3">
                        {post.abstract}
                      </p>
                    </div>

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-[10px] uppercase font-mono text-gray-400">RESEARCH CELL</span>
                      <span className="text-xs font-mono uppercase tracking-widest text-bronze-light group-hover:underline">
                        Read Document →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Side: Editorial static sidebar (Research categories definitions / stats) */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="border border-stone-base bg-white p-6 space-y-6">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-bold border-b border-stone-light pb-2">
              Topic Definitions
            </h3>
            <ul className="space-y-4 text-xs">
              <li>
                <span className="font-mono font-semibold block text-graphite-dark">@MATERIALS</span>
                <p className="text-gray-400 mt-1">Chemical structures, curing standards, and geological properties of raw soil, lime aggregates, and solid cedar.</p>
              </li>
              <li>
                <span className="font-mono font-semibold block text-graphite-dark">@PROCESS</span>
                <p className="text-gray-400 mt-1">Robotic joinery tolerances, CNC modeling logs, and mathematical scaffolding layout coordinates.</p>
              </li>
              <li>
                <span className="font-mono font-semibold block text-graphite-dark">@NOTES</span>
                <p className="text-gray-400 mt-1">Spontaneous field logs, thermodynamic test notes, and physical diagrams drawn live on construction sites.</p>
              </li>
            </ul>
          </div>

          <div className="border border-stone-base bg-stone-light p-6 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-graphite-dark font-semibold">
              Research Availability
            </h3>
            <p className="text-xs text-graphite-light leading-relaxed">
              We operate an open-source structural archive at our Siena library. If you are an academic researcher, structural engineer, or prospective client, we welcome scheduled visits to inspect physical wood joints and material specimens.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
