import React, { useState } from 'react';
import { ARCHITECTURE_PROJECTS, JOURNAL_POSTS, STUDIO_PROFILE } from './data';
import { HomeView } from './components/HomeView';
import { ProjectsView } from './components/ProjectsView';
import { DirectCase } from './components/DirectCase';
import { StudioView } from './components/StudioView';
import { JournalView } from './components/JournalView';
import { ContactView } from './components/ContactView';
import { AppUi } from './components/AppUi';
import { ArrowUpRight, Compass, ShieldCheck, Mail, BookOpen, Layers, Eye, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [homeVariant, setHomeVariant] = useState<'monograph' | 'studio' | 'residential'>('monograph');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('stone-monolith');
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'variants' | 'prompts' | 'setup' | 'sales'>('variants');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom interactive parameters managed in metadata console
  const [gridDensity, setGridDensity] = useState<'tight' | 'lax'>('lax');
  const [themeMode, setThemeMode] = useState<'muted' | 'high'>('muted');

  // Compute dynamic architectural traits
  const layoutBg = themeMode === 'high' ? 'bg-[#FFFFFF] text-black border-black/80' : 'bg-[#FAF8F5] text-graphite-dark border-stone-base';
  const gridOpacity = gridDensity === 'tight' ? 'opacity-35' : 'opacity-20';
  const draftingGridStyle = gridDensity === 'tight' 
    ? { 
        backgroundImage: 'linear-gradient(to right, rgba(140, 122, 91, 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(140, 122, 91, 0.04) 1px, transparent 1px)',
        backgroundSize: '4.166666% 24px'
      }
    : undefined;

  // Helper to trigger premium micro-toast feedback
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Grab the selected project
  const currentProject = ARCHITECTURE_PROJECTS.find(p => p.id === selectedProjectId) || ARCHITECTURE_PROJECTS[0];

  // Simple route navigation helpers
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActivePage('case-study');
    window.scrollTo(0, 0);
  };

  const handleNavigateToPage = (pageName: string) => {
    setActivePage(pageName);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out relative selection:bg-stone-dark selection:text-graphite-dark ${layoutBg}`}>
      
      {/* 12-Column dynamic gridlines decor running down the full viewport height to recreate a draft-board feel */}
      <div 
        className={`absolute inset-y-0 inset-x-0 w-full max-w-7xl mx-auto ${draftingGridStyle ? '' : 'bg-grid-lines'} pointer-events-none transition-all duration-500 z-0 ${gridOpacity}`} 
        style={draftingGridStyle}
      />

      {/* TOP DEPLOYMENT STATUS BANNER */}
      <div className="border-b border-stone-base bg-white py-2.5 px-4 text-center text-[10px] font-mono uppercase tracking-widest relative z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTFOLIO PREVIEW: ARCHITECTURAL PRESET</span>
        </div>
        <div className="text-gray-400 hidden md:block">
          STUDIO LOCATIONS: SIENA, ITALY / ZÜRICH, SWITZERLAND | SYSTEM YEAR: 2026
        </div>
        <div>
          <button
            id="sandbox-toggle-hdr-btn"
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className="text-xs uppercase font-mono tracking-wider font-semibold text-bronze-dark hover:underline flex items-center gap-1"
          >
            {isSandboxOpen ? '[ Close Preview Console ]' : '[ Open Preview Console ]'}
          </button>
        </div>
      </div>

      {/* PRIMARY SPLIT MATRIX- LAYOUT GRID */}
      {/* If sandbox is open, split into 8-col preview / 4-col customization panels */}
      <div className="grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* TEMPLATE CONTAINER SIDE (8 Columns or full grid) */}
        <div className={`${isSandboxOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8 flex flex-col justify-between`}>
          
          <div className="space-y-8">
            {/* LETER-CLASSIC HEADER */}
            <header className="border-b border-stone-base/40 pb-6 space-y-6 bg-[#FAF8F5]/85 backdrop-blur-md p-4 sticky top-0 z-20 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                {/* Brand Logo with literal tag names */}
                <div className="cursor-pointer" onClick={() => handleNavigateToPage('home')} id="logo-branding-container">
                  <h1 className="text-2xl md:text-3xl font-serif font-light tracking-widest text-[#1A1A1A] uppercase">
                    PERSPECTIVE
                  </h1>
                  <span className="block text-[8px] uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">
                    Architectural Monograph & Portfolio
                  </span>
                </div>

                {/* Sitemap Navigation List (6 high-end routes) */}
                <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono tracking-widest" id="sitemap-navigation-bar">
                  <button
                    id="nav-link-home"
                    onClick={() => handleNavigateToPage('home')}
                    className={`uppercase pb-1 ${activePage === 'home' ? 'text-bronze-dark font-bold border-b border-bronze-dark' : 'text-gray-400 hover:text-black'}`}
                  >
                    Home
                  </button>
                  <button
                    id="nav-link-projects"
                    onClick={() => handleNavigateToPage('projects')}
                    className={`uppercase pb-1 ${activePage === 'projects' || activePage === 'case-study' ? 'text-bronze-dark font-bold border-b border-bronze-dark' : 'text-gray-400 hover:text-black'}`}
                  >
                    Work
                  </button>
                  <button
                    id="nav-link-studio"
                    onClick={() => handleNavigateToPage('studio')}
                    className={`uppercase pb-1 ${activePage === 'studio' ? 'text-bronze-dark font-bold border-b border-bronze-dark' : 'text-gray-400 hover:text-black'}`}
                  >
                    Studio
                  </button>
                  <button
                    id="nav-link-journal"
                    onClick={() => handleNavigateToPage('journal')}
                    className={`uppercase pb-1 ${activePage === 'journal' ? 'text-bronze-dark font-bold border-b border-bronze-dark' : 'text-gray-400 hover:text-black'}`}
                  >
                    Journal
                  </button>
                  <button
                    id="nav-link-contact"
                    onClick={() => handleNavigateToPage('contact')}
                    className={`uppercase pb-1 ${activePage === 'contact' ? 'text-bronze-dark font-bold border-b border-bronze-dark' : 'text-gray-400 hover:text-black'}`}
                  >
                    Contact
                  </button>
                </nav>
              </div>
            </header>

            {/* MAIN SITEMAP PAGES RENDER */}
            <main className="space-y-12">
              {activePage === 'home' && (
                <HomeView
                  variant={homeVariant}
                  projects={ARCHITECTURE_PROJECTS}
                  onSelectProject={handleSelectProject}
                  onNavigateToPage={handleNavigateToPage}
                />
              )}

              {activePage === 'projects' && (
                <ProjectsView
                  projects={ARCHITECTURE_PROJECTS}
                  onSelectProject={handleSelectProject}
                />
              )}

              {activePage === 'case-study' && (
                <DirectCase
                  project={currentProject}
                  allProjects={ARCHITECTURE_PROJECTS}
                  onSelectProject={handleSelectProject}
                  onNavigateToPage={handleNavigateToPage}
                />
              )}

              {activePage === 'studio' && (
                <StudioView
                  profile={STUDIO_PROFILE}
                />
              )}

              {activePage === 'journal' && (
                <JournalView
                  posts={JOURNAL_POSTS}
                />
              )}

              {activePage === 'contact' && (
                <ContactView />
              )}
            </main>
          </div>

          {/* SOPHISTICATED EDITORIAL FOOTER */}
          <footer className="border-t border-stone-base pt-12 pb-6 mt-24 space-y-8 bg-white/30 p-6 relative">
            <div className="absolute inset-x-0 bg-grid-lines pointer-events-none opacity-5" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs relative z-10">
              <div className="space-y-4">
                <h3 className="font-serif text-lg tracking-widest text-[#1A1A1A]">PERSPECTIVE</h3>
                <p className="text-gray-400 leading-relaxed font-sans font-light">
                  A portfolio system for architecture studios that need rigorous case studies, technical clarity, and a calm editorial presence.
                </p>
              </div>

              <div className="space-y-2 font-mono text-gray-400">
                <span className="block text-graphite-dark uppercase text-[10px] tracking-wider font-bold">PRACTICE AREAS</span>
                <p>— 01 Private Residences</p>
                <p>— 02 Cultural Pavilions</p>
                <p>— 03 Mass-Timber CLT Studies</p>
                <p>— 04 Masonry Ruin Recovery</p>
              </div>

              <div className="space-y-4">
                <span className="block text-[10px] uppercase font-mono tracking-widest text-graphite-dark font-bold">COMMISSIONS & INQUIRIES</span>
                <p className="text-gray-400 font-sans font-light">
                  Brief reviews are held bi-weekly by the principal architects Elena Vance & Marcus Thorne.
                </p>
                <button
                  id="footer-action-commission"
                  onClick={() => handleNavigateToPage('contact')}
                  className="group px-5 py-2.5 bg-[#1A1A1A] hover:bg-bronze-dark text-white font-mono text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
                >
                  <span>Submit Inquiry</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>

            <div className="border-t border-stone-light pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-400 text-center md:text-left">
              <div>© 2026 Perspective Architectural Monograph. All rights reserved.</div>
              <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1">
                <span>siena@perspective-studios.com</span>
                <span className="hidden sm:inline">•</span>
                <span>zurich@perspective-studios.com</span>
              </div>
            </div>
          </footer>
        </div>

        {/* PERSPECTIVE CREATOR TOOLBOX & SALES PANEL (4 Columns) */}
        {isSandboxOpen && (
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 self-start bg-white p-4 border border-stone-base shadow-xs relative z-20">
            <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-graphite-dark">Perspective Portfolio Console</h4>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed font-light">
                  Interactively compare layout variants, copy content-generation prompts, and read the implementation manuals.
                </p>
              </div>

              <AppUi
                currentVariant={homeVariant}
                onChangeVariant={setHomeVariant}
                onNavigateToPage={handleNavigateToPage}
                activePage={activePage}
                activeConsoleTab={activeConsoleTab}
                onConsoleTabChange={setActiveConsoleTab}
                gridDensity={gridDensity}
                onChangeGridDensity={(density) => {
                  setGridDensity(density);
                  triggerToast(`Grid spacing updated successfully to [${density.toUpperCase()}]`);
                }}
                themeMode={themeMode}
                onChangeThemeMode={(mode) => {
                  setThemeMode(mode);
                  triggerToast(`Theme contrast updated successfully to [${mode.toUpperCase()}]`);
                }}
              />

              <div className="border-t border-stone-base pt-4 text-center">
                <button
                  id="lnk-gumroad-pricing-ladder"
                  onClick={() => {
                    setActiveConsoleTab('setup');
                    triggerToast("Console: Setup manual focused. Drag individual fields to customize your corporate DNS credentials.");
                  }}
                  className="w-full py-2.5 bg-[#1A1A1A] hover:bg-bronze-dark text-white font-mono text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Install Setup manual</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* FLOAT COMPASS TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div id="toast-notification-console" className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white border border-stone-light/20 p-4 shadow-2xl max-w-sm flex flex-col gap-1 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C7A5B] animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C7A5B] font-bold">SYSTEM BROADCAST</span>
          </div>
          <p className="text-xs font-sans text-[#EAE6DF] font-light leading-relaxed pr-2">
            {toastMessage}
          </p>
        </div>
      )}
    </div>
  );
}
