import React from 'react';
import { Sparkles, Check } from 'lucide-react';

function CrossSellBgImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  if (error) {
    return <div className="absolute inset-0 bg-neutral-900/30" />;
  }

  return (
    <img 
      src={src} 
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={`w-full h-full object-cover transition-opacity duration-500 opacity-[0.07] group-hover:opacity-[0.14] group-hover:scale-[1.02] transition-all duration-550 ${loaded ? 'opacity-[0.07]' : 'opacity-0'}`} 
      referrerPolicy="no-referrer"
    />
  );
}

/**
 * Props defined for CrossSellPanel.
 */
export interface CrossSellPanelProps {
  /**
   * Whether the Chili Crisp option is selected or premium loaded.
   */
  addChiliInfusion: boolean;
  /**
   * Whether the Pu-Erh Tea pairing cell option is selected.
   */
  addPuerhTea: boolean;
  /**
   * Callback fired to toggle the state of the Chili Crisp infusion selection.
   */
  onToggleChili: () => void;
  /**
   * Callback fired to toggle the state of the Vintage Pu-Erh pairing selection.
   */
  onTogglePuerh: () => void;
  /**
   * Mode to prevent tweaking settings post-validation workflow.
   */
  disabled?: boolean;
}

/**
 * CrossSellPanel - Highly customizable, documented, and responsive
 * enhancement portal display containing premium add-on card components.
 */
export default function CrossSellPanel({
  addChiliInfusion,
  addPuerhTea,
  onToggleChili,
  onTogglePuerh,
  disabled = false,
}: CrossSellPanelProps) {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div>
          <span className="font-mono text-[10px] text-neutral-400 tracking-wider block uppercase font-bold">
            03 // ENHANCE THE PROFILE
          </span>
          <span className="font-sans text-[11px] text-neutral-500 block leading-tight mt-0.5">
            Activate elite culinary pairing upgrades below. Highly recommended for premium vehicle handshakes.
          </span>
        </div>
        <Sparkles className="w-5 h-5 text-[#FF3366] shrink-0" />
      </div>

      {/* ITEM A: CHILI CRISP INFUSION CR-03 */}
      <div 
        onClick={() => {
          if (!disabled) onToggleChili();
        }}
        className={`group flex flex-col sm:flex-row justify-between items-stretch border p-4 cursor-pointer select-none transition-all duration-300 relative overflow-hidden ${
          addChiliInfusion 
            ? 'border-[#FF3366] bg-[#FF3366]/5 shadow-[0_0_15px_rgba(255,51,102,0.12)]' 
            : 'border-white/5 bg-black/40 hover:border-white/15'
        } ${disabled ? 'opacity-85 cursor-not-allowed' : ''}`}
      >
        {/* Subtle premium background image overlay */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <CrossSellBgImage 
            src="https://images.unsplash.com/photo-1596790011462-22926824302c?auto=format&fit=crop&w=800&q=80" 
            alt="Chili Crisp backdrop" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-[#030303]/90" />
        </div>

        <div className="flex-1 space-y-1.5 pr-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-[#FF3366] border border-[#FF3366]/30 px-1.5 font-bold">
              [CR-03 OIL FORMULA]
            </span>
            {addChiliInfusion && (
              <span className="text-[8px] font-mono text-[#00FF66] flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> SELECTED
              </span>
            )}
          </div>
          
          <h4 className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#FF3366] transition-colors uppercase">
            CHILI CRISP INFUSION CR-03
          </h4>

          <p className="text-[10px] text-neutral-400 font-sans leading-snug">
            High-octane x-press crisp infusion containing toasted shallots, Sichuan peppercorn sediment, and custom oil extraction.
          </p>
        </div>

        <div className="sm:text-right mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 flex sm:flex-col justify-between items-baseline sm:items-end shrink-0 select-none relative z-10">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block">RECOMMENDED</span>
          <span className="font-mono text-sm font-black text-[#FF3366] block">
            +¥28 <span className="text-[10px] text-neutral-500 font-normal">($4.00)</span>
          </span>
        </div>
      </div>

      {/* ITEM B: VINTAGE PU-ERH TEA PAIRING */}
      <div 
        onClick={() => {
          if (!disabled) onTogglePuerh();
        }}
        className={`group flex flex-col sm:flex-row justify-between items-stretch border p-4 cursor-pointer select-none transition-all duration-300 relative overflow-hidden ${
          addPuerhTea 
            ? 'border-[#FF3366] bg-[#FF3366]/5 shadow-[0_0_15px_rgba(255,51,102,0.12)]' 
            : 'border-white/5 bg-black/40 hover:border-white/15'
        } ${disabled ? 'opacity-85 cursor-not-allowed' : ''}`}
      >
        {/* Subtle premium background image overlay */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <CrossSellBgImage 
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80" 
            alt="Vintage Pu-erh Tea backdrop" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-[#030303]/90" />
        </div>

        <div className="flex-1 space-y-1.5 pr-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-[#00FF66] border border-[#00FF66]/30 px-1.5 font-bold uppercase">
              [PAIRING CELLAR DEPT]
            </span>
            {addPuerhTea && (
              <span className="text-[8px] font-mono text-[#00FF66] flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> SELECTED
              </span>
            )}
          </div>

          <h4 className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#FF3366] transition-colors uppercase">
            VINTAGE PU-ERH TEA PAIRING
          </h4>

          <p className="text-[10px] text-neutral-400 font-sans leading-snug">
            Earth-steeped vintage post-fermented deep red tea. Counterbalances massive wok spice intensity and cleanses grease.
          </p>
        </div>

        <div className="sm:text-right mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 flex sm:flex-col justify-between items-baseline sm:items-end shrink-0 select-none relative z-10">
          <span className="text-[9px] font-mono text-neutral-500 uppercase block">SOMMELIER SPEC</span>
          <span className="font-mono text-sm font-black text-[#FF3366] block">
            +¥63 <span className="text-[10px] text-neutral-500 font-normal">($9.00)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
