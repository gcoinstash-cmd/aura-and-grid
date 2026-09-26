import { MENU_ITEMS } from "../config/menuManifest";
import { MenuItemType } from "../types";

interface MenuProps {
  onSelectItem: (item: MenuItemType) => void;
}

export default function Menu({ onSelectItem }: MenuProps) {
  return (
    <section id="menu" className="py-32 px-6 max-w-7xl mx-auto border-t border-muted-charcoal">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-20 gap-4">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-raw-silk/40 block mb-3">
            seasonal curation
          </span>
          <h2 className="title-section" id="menu-section-heading">
            the course matrix
          </h2>
        </div>
        <p className="font-sans text-xs text-raw-silk/50 max-w-sm tracking-wide lowercase pt-2 leading-relaxed">
          each premium offering is harvested raw from private estates and fish markets, delivered in perfect culinary transition.
        </p>
      </div>

      {/* Strict minimalist layout grid */}
      <div 
        className="menu-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20" 
        id="menu-items-grid"
      >
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            itemScope
            itemType="https://schema.org/MenuItem"
            onClick={() => onSelectItem(item)}
            className="group cursor-pointer flex flex-col transition-all duration-500"
            id={`course-item-${item.id}`}
          >
            {/* Aspect ratio box with ultra-slow scale transition upon hover */}
            <div className="relative overflow-hidden aspect-[4/3] border border-muted-charcoal bg-sumi-ink select-none">
              <img
                itemProp="image"
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sumi-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Subtle design detail: curation origin tag */}
              <div className="absolute bottom-4 left-4">
                <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-sumi-ink/80 text-raw-silk/60 font-mono border border-muted-charcoal/40 backdrop-blur-xs select-none">
                  {item.curation}
                </span>
              </div>
            </div>

            {/* Menu Header (Title Left, Price Right) with zero decorative lines */}
            <div className="menu-header mt-6 flex justify-between items-baseline font-serif lowercase">
              <span 
                itemProp="name" 
                className="text-raw-silk text-[1.25rem] tracking-[0.05em] group-hover:text-raw-silk transition-colors"
               >
                {item.name}
              </span>
              <div 
                itemProp="offers" 
                itemScope 
                itemType="https://schema.org/Offer" 
                className="text-raw-silk/70 text-sm tracking-[0.08em] font-sans"
              >
                <span itemProp="price" content={item.priceValue.toFixed(2)}>
                  ${item.price}
                </span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
            </div>

            {/* Structured subtitle / Japanese translation helper */}
            <span className="text-[10px] font-sans tracking-[0.25em] text-raw-silk/30 mt-1 uppercase select-none">
              {item.japaneseName}
            </span>

            {/* Minimalist Description */}
            <p 
              itemProp="description" 
              className="mt-4 text-[12px] text-raw-silk/55 select-none font-sans leading-relaxed tracking-wide lowercase"
            >
              {item.description}
            </p>

            {/* Delicate opacity and translate arrow slider interaction */}
            <div className="mt-4 pt-1 flex items-center text-[10px] tracking-[0.22em] uppercase text-raw-silk/50 group-hover:text-raw-silk group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] font-mono">
              <span className="border-b border-raw-silk/10 group-hover:border-raw-silk/75 transition-colors duration-500">view details</span>
              <span className="ml-1 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform group-hover:translate-x-[3px]">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
