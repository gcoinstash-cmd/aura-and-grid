import React from 'react';

export interface Category {
  name: string;
  items?: string[];
}

export interface TreatmentMenuProps {
  categories: Category[];
}

/**
 * TreatmentMenu Component
 * 
 * An elegant, dark luxury accordion-style spa treatment menu that uses native HTML `<details>` and `<summary>` tags 
 * for zero re-render transitions, styled with luxury serif typography and smooth interactive animations.
 */
export const TreatmentMenu: React.FC<TreatmentMenuProps> = ({ categories }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {categories.map((category, catIndex) => {
        const hasItems = Array.isArray(category.items) && category.items.length > 0;

        return (
          <details
            key={`${category.name}-${catIndex}`}
            id={`treatment-category-${catIndex}`}
            className="group border-b border-stone-800/40 pb-1"
          >
            <summary className="list-none flex justify-between items-center py-6 cursor-pointer focus:outline-none select-none">
              <div className="space-y-1 flex-1 pr-4 min-w-0">
                <h3 className="font-serif text-lg sm:text-2xl font-light tracking-wide text-stone-300 italic transition-colors duration-300 group-hover:text-stone-100 break-words leading-tight whitespace-normal">
                  {category.name}
                </h3>
                {/* Instant dynamic UX preview showing short details on collapse */}
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.12em] text-stone-500 group-open:invisible transition-all duration-300 break-words leading-relaxed whitespace-normal">
                  {category.name.includes("Bodywork") || category.name.includes("Massages")
                    ? `${hasItems ? category.items!.length : 0} Therapeutic Massages • 60-90 Min • Deep Muscle Rest`
                    : category.name.includes("Thermal") || category.name.includes("Aqueous")
                    ? `${hasItems ? category.items!.length : 0} Purification Baths • 30-45 Min • Mineral Detoxification`
                    : category.name.includes("Facials") || category.name.includes("Skin")
                    ? `${hasItems ? category.items!.length : 0} Botanical Remedies • 60-75 Min • Cellular Recovery`
                    : "Traditional Breathwork • 15-30 Min • Respiratory Balance"
                  }
                </p>
              </div>
              
              {/* Interactive Morphing Plus/Minus Icon */}
              <div 
                id={`icon-wrapper-${catIndex}`}
                className="relative w-8 h-8 rounded-full border border-stone-800/60 bg-stone-950/20 hover:border-stone-700 flex items-center justify-center text-stone-500 hover:text-stone-200 transition-all duration-300"
              >
                {/* Horizontal Bar */}
                <span className="absolute w-3 h-[1px] bg-current rounded-full transition-transform duration-300 group-open:rotate-180" />
                {/* Vertical Bar that collapses on open */}
                <span className="absolute w-[1px] h-3 bg-current rounded-full transition-all duration-300 origin-center group-open:scale-y-0 group-open:rotate-90" />
              </div>
            </summary>

            <div className="pb-8 pt-2 px-1 transition-all duration-300 ease-in-out">
              {/* Category-level wellness description for commercial practicality */}
              <div id={`category-description-${catIndex}`} className="mb-6 max-w-2xl text-left text-xs text-stone-400 font-light leading-relaxed border-l-2 border-stone-800/50 pl-4 py-0.5">
                {category.name.includes("Bodywork") || category.name.includes("Massages") ? (
                  <span>
                    Our signature bodywork is designed to release persistent muscular tension and restore alignment. Each session incorporates therapeutic pressure, customized organic botanical oils, and target-focused stretching techniques tailored to your lifestyle. 
                    <span className="block mt-1 font-mono text-[10px] text-stone-500">Includes: Aromatherapy consultation • Restorative massage styles • Choice of light to deep pressure</span>
                  </span>
                ) : category.name.includes("Thermal") || category.name.includes("Aqueous") ? (
                  <span>
                    Experience the restorative powers of mineral hydration and quiet thermal chambers. These hydrotherapy sessions and steam rituals stimulate safe circulation, clear mental fog, and soothe full-body muscular soreness.
                    <span className="block mt-1 font-mono text-[10px] text-stone-500">Includes: Private herbal steam access • Mineral soak baths • Warm towels & infused botanical water</span>
                  </span>
                ) : category.name.includes("Facials") || category.name.includes("Skin") ? (
                  <span>
                    Our skin remedies protect and rejuvenate using clean, biodynamic botanicals, facial massage, and pure oxygen infusion. This is active skin medicine focused on hydration, natural dermal elasticity, and immediate calm radiance.
                    <span className="block mt-1 font-mono text-[10px] text-stone-500">Includes: Gentle botanical cleanse • Warm compress • Nourishing customized serum & protective shielding</span>
                  </span>
                ) : (
                  <span>
                    A guided breathing practice to lower heart rate and calm mental overactivity. Ideal for reducing anxiety, boosting respiratory depth, and clearing your mind in a quiet atmosphere.
                    <span className="block mt-1 font-mono text-[10px] text-stone-500">Includes: Posture adjustment • Breath pacing tutorials • Soft-lighting guidance session</span>
                  </span>
                )}
              </div>

              {hasItems ? (
                <ul className="space-y-4" id={`treatment-list-${catIndex}`}>
                  {category.items!.map((item, itemIndex) => {
                    // Intelligently parse item standard format e.g., "Deep Tissue Massage | 60 Min / $180"
                    let name = item;
                    let priceDuration = "60 Min / $180"; // Premium placeholder default

                    if (item.includes('|')) {
                      const parts = item.split('|');
                      name = parts[0].trim();
                      priceDuration = parts[1].trim();
                     } else if (item.includes(' - ')) {
                      const parts = item.split(' - ');
                      name = parts[0].trim();
                      priceDuration = parts[1].trim();
                    }

                    return (
                      <li 
                        key={`${name}-${itemIndex}`}
                        id={`treatment-item-${catIndex}-${itemIndex}`}
                        className="flex items-baseline justify-between py-1 text-stone-400 hover:text-stone-100 transition-all duration-300 ease-out hover:translate-x-1 group/item-row"
                      >
                        {/* Treatment Name & Signature Badge */}
                        <span className="text-sm font-light tracking-wide font-sans pr-4 transition-colors duration-200 text-stone-300 group-hover/item-row:text-stone-100 inline-flex items-center flex-wrap">
                          <span>{name}</span>
                          {(name.includes('Ritual') || name.includes('Lift')) && (
                            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-stone-500 border border-stone-800/40 bg-stone-950/20 px-1.5 py-0.5 rounded-full ml-3 select-none">
                              Signature
                            </span>
                          )}
                        </span>
                        
                        {/* Dotted Spacer Line */}
                        <div className="flex-1 border-b border-dotted border-stone-800/45 mx-2 relative -top-[4px] self-stretch" />
                        
                        {/* Price & Duration */}
                        <span className="text-xs font-mono font-light text-stone-500 pl-4 tracking-widest group-hover/item-row:text-stone-300 transition-colors duration-200">
                          {priceDuration}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div 
                  id={`fallback-${catIndex}`}
                  className="py-6 text-center border border-dashed border-stone-800/40 bg-stone-950/20 rounded-sm"
                >
                  <p className="text-xs font-serif italic text-stone-500 tracking-wider">
                    Individual appointments can be tailored with our therapists upon arrival.
                  </p>
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
};

export default TreatmentMenu;
