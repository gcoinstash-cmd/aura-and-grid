import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Database, Layers, Code, Play } from 'lucide-react';

interface BlueprintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAnnotated: boolean;
  onToggleAnnotations: () => void;
}

export default function BlueprintDrawer({
  isOpen,
  onClose,
  isAnnotated,
  onToggleAnnotations,
}: BlueprintDrawerProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(identifier);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const webflowCMSFields = [
    { label: 'Item Name', type: 'Plain Text (Required)', key: 'name', example: 'The Royal Crown Curl & Coil Sculpting' },
    { label: 'Item Price', type: 'Number (Required)', key: 'price', example: '180' },
    { label: 'Item Duration', type: 'Plain Text', key: 'duration', example: '75 min' },
    { label: 'Ritual Step', type: 'Plain Text', key: 'ritual-step', example: 'Thermal Aromatherapy + Organic Mist Infusion' },
    { label: 'Category', type: 'Option Field (cut-styling | color | treatments)', key: 'category', example: 'cut-styling' },
    { label: 'Description', type: 'Rich Text', key: 'description', example: 'A bespoke silhouette designed to honor your natural textured curl...' },
  ];

  const framerProps = [
    { name: 'serviceTitle', type: 'String', default: 'Service Name' },
    { name: 'priceUnit', type: 'Number', default: '0.00' },
    { name: 'durationLabel', type: 'String', default: '00 min' },
    { name: 'complementaryQuote', type: 'String', default: 'Quote' },
    { name: 'activeState', type: 'Boolean', default: 'false' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#070707] border-l border-zinc-800 p-6 md:p-8 z-50 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center space-x-1 text-[8px] font-mono tracking-[0.3em] text-[#E6C587] uppercase">
                <Layers className="w-3 h-3" />
                <span>SPECIFICATION OVERLAY SYSTEM</span>
              </div>
              <h3 className="font-serif text-xl text-white font-light tracking-wide mt-1.5">
                Developer Blueprint Hub
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Annotation Quick Toggle */}
          <div className="my-6 p-4 bg-zinc-900/50 border border-zinc-850 flex items-center justify-between">
            <div className="max-w-[70%]">
              <span className="text-[10px] uppercase tracking-wider text-white font-medium block">
                Visual HUD Overlays
              </span>
              <p className="text-[11px] text-zinc-400 font-light mt-1">
                Toggle interactive grid lines, Webflow classes, and Framer node names directly in the live UI.
              </p>
            </div>
            <button
              onClick={onToggleAnnotations}
              className={`px-4 py-2 text-[9px] uppercase tracking-[0.15em] font-mono transition-all duration-300 flex items-center space-x-1.5 ${
                isAnnotated
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-750'
              }`}
            >
              <span>{isAnnotated ? 'HUD ACTIVE' : 'ACTIVATE HUD'}</span>
              <Play className={`w-2.5 h-2.5 transition-transform ${isAnnotated ? 'rotate-90 fill-cyan-400' : ''}`} />
            </button>
          </div>

          <div className="space-y-6 mt-6">
            {/* Target 1: Webflow Webflow Client-First CMS Mapping */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Database className="w-3.5 h-3.5 text-[#E6C587]" />
                <span className="text-[10px] font-mono tracking-widest text-[#E6C587] uppercase font-bold">
                  Webflow CMS Schema Guidelines
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-4">
                Structure your Webflow Collections using this exact scheme to link dynamically with the services pricing layout cards.
              </p>

              <div className="space-y-2.5">
                {webflowCMSFields.map((field) => (
                  <div 
                    key={field.key} 
                    className="p-3 bg-zinc-950 border border-zinc-900 flex flex-col justify-between relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif text-white font-medium">{field.label}</span>
                      <span className="text-[9px] font-mono text-zinc-500">{field.type}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900/60 font-mono text-[10px]">
                      <span className="text-zinc-400">slug-key: <code className="text-[#E6C587]">{field.key}</code></span>
                      <button
                        onClick={() => handleCopy(field.key, field.key)}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Copy Key Name"
                      >
                        {copiedField === field.key ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target 2: Framer Direct Canvas Component Properties */}
            <div className="pt-4 border-t border-zinc-900">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="w-3.5 h-3.5 text-[#E6C587]" />
                <span className="text-[10px] font-mono tracking-widest text-[#E6C587] uppercase font-bold">
                  Framer Component Bindings
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-4">
                Expose these component properties to allow clean content changes inside Framer without disrupting the layout hierarchy.
              </p>

              <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xs space-y-3">
                {framerProps.map((prop) => (
                  <div key={prop.name} className="flex items-center justify-between text-[11px] border-b border-zinc-900/40 pb-2 last:border-0 last:pb-0">
                    <span className="font-mono text-white text-[11px]">{prop.name}</span>
                    <div className="font-mono text-[10px] text-zinc-500 flex items-center space-x-2">
                      <span>{prop.type}</span>
                      <span className="bg-zinc-900 px-1.5 py-0.5 text-zinc-400">Default: {prop.default}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-900 mt-8 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
          <span>SPEC ENG WRAPPER V1.2.0</span>
          <span>READY FOR COMMERCIAL TRANSFERS</span>
        </div>
      </motion.div>
    </>
  );
}
