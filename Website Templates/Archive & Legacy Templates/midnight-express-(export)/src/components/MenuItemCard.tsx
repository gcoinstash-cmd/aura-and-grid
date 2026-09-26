import React from 'react';
import { MenuItem } from '../types';
import { playWokSizzle } from '../utils/audio';

interface MenuItemCardProps {
  key?: any;
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MenuItemCard({ item, isSelected, onSelect }: MenuItemCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleClick = () => {
    playWokSizzle();
    onSelect();
  };

  return (
    <button
      id={`menu-item-${item.id}`}
      onClick={handleClick}
      className={`group relative text-left w-full border transition-all duration-300 p-4 bg-[#111111] ${
        isSelected
          ? 'border-[#FF3366] shadow-[0_0_22px_rgba(255,51,102,0.3)] bg-[#161213] ring-1 ring-[#FF3366]/30'
          : 'border-white/5 hover:border-white/15 hover:bg-[#151515]'
      }`}
    >
      {/* Selection corner bracket */}
      {isSelected && (
        <>
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF3366]" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF3366]" />
        </>
      )}

      <div className="flex gap-4 items-start justify-between">
        {/* Cinematic Thumbnail Image with no-referrer policy */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-[#0c0c0c] border border-white/5 relative group-hover:border-[#FF3366]/40 transition-colors">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-[#0c0c0c] flex items-center justify-center animate-pulse z-10">
              <svg className="w-5 h-5 text-neutral-800 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {imageError ? (
            <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-1 text-center select-none">
              <span className="text-[7.5px] text-[#FF3366]/90 font-mono tracking-tighter uppercase font-extrabold animate-pulse leading-none">// ERR_0xCC</span>
              <span className="text-[7px] text-neutral-500 font-mono scale-90 leading-tight uppercase font-medium mt-0.5">FALLBACK</span>
              <div className="w-4 h-4 border border-dashed border-[#FF3366]/20 rounded-full mt-1 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#FF3366]/40 rounded-full" />
              </div>
            </div>
          ) : (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: (isSelected && imageLoaded) ? 'scale(1.02)' : undefined
              }}
              referrerPolicy="no-referrer"
            />
          )}

          <style dangerouslySetInnerHTML={{__html: `
            #menu-item-${item.id}:hover img {
              transform: scale(1.02) !important;
            }
          `}} />
          <div 
            className="absolute inset-0 pointer-events-none z-10" 
            style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }}
          />
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0">
          {/* Headline pairing: Sharp tracking headers & Chinese characters */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#FF3366] transition-colors">
              {item.name}
            </h4>
            <span className="text-[10px] bg-white/5 text-neutral-400 px-1.5 py-0.5 tracking-tight font-mono">
              {item.chineseName}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 tracking-normal mt-1 leading-relaxed line-clamp-2 md:line-clamp-none">
            {item.description}
          </p>
        </div>

        <div className="text-right flex flex-col items-end shrink-0 pl-1">
          <span className="font-mono text-xs font-bold text-[#FF3366] tracking-wider">
            {item.price}
          </span>
          <span className="text-[9px] text-neutral-500 font-mono mt-1">
            {item.prepTimeSeconds}S PREP
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span>SPICE LEVEL:</span>
          <span className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rotate-45 ${
                  i < item.spicyLevel ? 'bg-[#FF3366]' : 'bg-neutral-800'
                }`}
              />
            ))}
          </span>
        </div>
        <span>{item.calories} KCAL</span>
      </div>
    </button>
  );
}
