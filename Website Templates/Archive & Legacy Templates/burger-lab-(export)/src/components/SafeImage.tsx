import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  placeholderText?: string;
  accentColor?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  placeholderText = "ASSET PLACEHOLDER",
  accentColor = "#E1FF01",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const triggerError = () => {
    setHasError(true);
  };

  if (!src || hasError) {
    return (
      <div 
        className={`relative overflow-hidden w-full h-full flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 select-none ${fallbackClassName || className || ''}`}
        id={`asset-placeholder-${alt ? alt.toLowerCase().replace(/\s+/g, '-') : 'unknown'}`}
      >
        {/* Sleek radial gradient & grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1.2px,transparent_1.2px),linear-gradient(to_bottom,#18181b_1.2px,transparent_1.2px)] bg-[size:16px_16px] pointer-events-none opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.3)_0%,rgba(9,9,11,0.9)_100%)] pointer-events-none" />
        
        {/* Blueprint outer alignment crosshairs */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-neutral-700/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-neutral-700/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-neutral-700/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-neutral-700/40" />

        {/* Dynamic decorative radar/crosshair in center */}
        <div className="w-12 h-12 rounded-full border border-neutral-800/60 flex items-center justify-center relative mb-3">
          <div className="w-6 h-6 rounded-full border border-dashed border-neutral-700/40 animate-spin absolute" style={{ animationDuration: '20s' }} />
          <span className="text-[9px] font-mono opacity-40" style={{ color: accentColor }}>•</span>
        </div>

        {/* Text Details */}
        <div className="text-center px-4 relative z-10 space-y-1">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-neutral-400 uppercase">
            {placeholderText}
          </p>
          <p className="text-[8px] font-mono text-zinc-650 uppercase tracking-widest max-w-[200px] truncate">
            {alt || "SYSTEM_REF_NULL"}
          </p>
        </div>

        {/* Technical spec line at the bottom */}
        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <span className="text-[7px] font-mono text-zinc-800 tracking-wider">
            GRID // 0xCCFF // OFFLINE_SRC
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      className={className}
      alt={alt}
      onError={triggerError}
      {...props}
    />
  );
};
