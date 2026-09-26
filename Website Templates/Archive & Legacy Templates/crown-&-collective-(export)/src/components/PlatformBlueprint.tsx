import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Code, Compass, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface PlatformBlueprintProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlatformTab = 'framer' | 'webflow' | 'wix';

export default function PlatformBlueprint({ isOpen, onClose }: PlatformBlueprintProps) {
  const [activeTab, setActiveTab] = useState<PlatformTab>('framer');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-y-auto"
        >
          {/* Main Blueprint Box */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 p-6 md:p-10 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blueprint Grid Lines Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-r border-cyan-400" />
              ))}
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="flex items-center space-x-2 text-[9px] font-mono tracking-[0.35em] text-[#E6C587] uppercase">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>COMMERCIAL RE-SALE BLUEPRINT APPROVED</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-white uppercase tracking-wider mt-2">
                  Template Transfer Protocol
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Platform Tab Toggles */}
            <div className="relative z-10 flex border-b border-white/5 mb-8">
              {(['framer', 'webflow', 'wix'] as PlatformTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-[11px] font-sans uppercase tracking-[0.2em] relative transition-colors duration-300 ${
                    activeTab === tab ? 'text-[#E6C587]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span>{tab === 'framer' ? 'Framer Direct' : tab === 'webflow' ? 'Webflow Client-First' : 'Wix Studio Fluid'}</span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="blueprint-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E6C587]"
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="relative z-10 min-h-[380px]">
              {activeTab === 'framer' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-mono text-[#E6C587] tracking-widest uppercase block">PLATFORM OVERVIEW</span>
                      <h4 className="font-serif text-xl font-light text-white mt-1.5 leading-snug">
                        Framer Component Architecture
                      </h4>
                      <p className="text-xs text-[#F7F4EB]/60 leading-relaxed font-light mt-3">
                        Optimized for modern viewport performance, this layout converts into standard Framer canvas components. Utilize shared component variants with scroll-transform triggers and micro-hover vectors.
                      </p>
                    </div>

                    <div className="space-y-3.5 bg-white/[0.02] border border-white/5 p-4">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">UX VARIANTS</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Setup "Open Drawer" as a component variant mapped back to the Hero CTA block actions.</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2.5 pt-3 border-t border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">SCROLL TRANSFORMS</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Set the Hero visual frame to [Y Scale: 1] to [Y Scale: 1.08] scroll interactions.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-[#121212]/50 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase block">MIGRATION CODE SPEC</span>
                      <p className="text-[11px] text-white/70 italic mt-3 font-serif">
                        “Export directly via Framer Remix Links. Make sure all component properties map to layout coordinates perfectly.”
                      </p>
                      
                      {/* Technical specifications */}
                      <div className="mt-6 space-y-2.5 font-mono text-[10px] text-zinc-500">
                        <div className="flex justify-between">
                          <span>Aesthetic Model:</span>
                          <span className="text-[#E6C587]">Zen Luxury Dark</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Layout Engine:</span>
                          <span className="text-white">Framer Flex Stack</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Motion Easing:</span>
                          <span className="text-white">cubic-bezier(0.16, 1, 0.3, 1)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <span className="text-[9px] font-mono text-green-400 tracking-wider block">✓ FRAMER VERIFIED EXPORTABLE</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'webflow' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-mono text-[#E6C587] tracking-widest uppercase block">CLIENT-FIRST CLASS PROTOCOL</span>
                      <h4 className="font-serif text-xl font-light text-white mt-1.5 leading-snug">
                        Webflow Box-Model & Typography Scales
                      </h4>
                      <p className="text-xs text-[#F7F4EB]/60 leading-relaxed font-light mt-3">
                        Enforces precise Webflow client-first structural class naming models. Keep typography scales globally responsive via percentage EMS variables, bridging seamlessly with dynamic CMS collections.
                      </p>
                    </div>

                    <div className="space-y-3.5 bg-white/[0.02] border border-white/5 p-4">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">CLASS CONVENTIONS</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Use `section_philosophy`, `curation_grid_wrapper`, and `text-serif-display` classes exactly.</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2.5 pt-3 border-t border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">CMS COLLECTION MAP</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Connect "CurationMenu" cards dynamically to Webflow Services collection layout.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-[#121212]/50 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase block">BOX MODEL METRICS</span>
                      <p className="text-[11px] text-white/70 italic mt-3 font-serif">
                        “Enforce margin control blocks. All paddings should respect high visual density spacing of 7rem to 9rem vertical gutters on desktop.”
                      </p>

                      {/* Technical specifications */}
                      <div className="mt-6 space-y-2.5 font-mono text-[10px] text-zinc-500">
                        <div className="flex justify-between">
                          <span>Naming Rule:</span>
                          <span className="text-[#E6C587]">Client-First Framework v2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Font scaling:</span>
                          <span className="text-white">Fluid fluid-rem(2.4vw)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CMS Fields:</span>
                          <span className="text-white">6 Fields Mapped (Price, Ritual, Time)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <span className="text-[9px] font-mono text-green-400 tracking-wider block">✓ WEBFLOW CLEAN-HTML STATUS</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wix' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-mono text-[#E6C587] tracking-widest uppercase block">PERCENTAGE SCALING</span>
                      <h4 className="font-serif text-xl font-light text-white mt-1.5 leading-snug">
                        Wix Studio Docking Fluid Structures
                      </h4>
                      <p className="text-xs text-[#F7F4EB]/60 leading-relaxed font-light mt-3">
                        Ensures percentage-based layout fluidity across standard responsive screens. Use exact visual anchor docking protocols on the left/right layout blocks.
                      </p>
                    </div>

                    <div className="space-y-3.5 bg-white/[0.02] border border-white/5 p-4">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">FLUID RESPONSIVE ENGINE</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Use exact "Scale Proportionally" layout model with % values on container columns.</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2.5 pt-3 border-t border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C587] shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-white tracking-widest uppercase">DESIGN TOKENS</span>
                          <span className="block text-[11px] text-[#F7F4EB]/70 font-light mt-0.5">Design token integration mapping the #E6C587 gold hex code to Wix Palette Custom 1.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-[#121212]/50 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase block">DOCKING MATRIX</span>
                      <p className="text-[11px] text-white/70 italic mt-3 font-serif">
                        “Pin headers to Dock Left/Right. Ensure floating action panels scale gracefully without viewport intersection overflow.”
                      </p>

                      {/* Technical specifications */}
                      <div className="mt-6 space-y-2.5 font-mono text-[10px] text-zinc-500">
                        <div className="flex justify-between">
                          <span>Wix Element:</span>
                          <span className="text-[#E6C587]">Advanced Section Builder</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Responsive Mode:</span>
                          <span className="text-white">Custom Studio Fluid</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gutter Widths:</span>
                          <span className="text-white">Percentage values (6% side bounds)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <span className="text-[9px] font-mono text-green-400 tracking-wider block">✓ WIX STUDIO TOKENS DEPLOYED</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Close Footer Trigger */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center relative z-10 text-[10px] font-mono tracking-widest text-[#F7F4EB]/40">
              <span>CROWN & COLLECTIVE • COMMERCIAL DEVELOPER SPEC</span>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#E6C587] hover:bg-white text-[#0A0A0A] uppercase tracking-[0.2em] text-[9px] font-sans font-bold transition-all duration-300"
              >
                Exit Blueprint Overlay
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
