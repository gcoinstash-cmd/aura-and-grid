import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { GalleryItem } from '../types';
import { Heart, ZoomIn, Plus } from 'lucide-react';

interface GalleryCardProps {
  key?: React.Key;
  item: GalleryItem;
  onClick: () => void;
  liked: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
}

export default function GalleryCard({ item, onClick, liked, onLikeToggle }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values for tracking mouse position within the card bounds
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Luxurious, smooth spring dampening for optimal modern visual transitions
  const springX = useSpring(x, { damping: 30, stiffness: 220 });
  const springY = useSpring(y, { damping: 30, stiffness: 220 });

  // Transforms: High-fidelity card tilting (approx -5 to 5 deg)
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  // Image translations to produce beautiful physical dual-layered opposite movement parallax
  const imgX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const imgY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  // Ambient glare reflect maps
  const glareX = useTransform(springX, [-0.5, 0.5], ['30%', '70%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['30%', '70%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse vector mapped off-center from -0.5 to +0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1100,
      }}
      className={`group relative overflow-hidden bg-[#161616] border border-white/5 p-2 w-full cursor-zoom-in select-none ${item.spanClass} ${
        item.spanClass.includes('row-span-2')
          ? 'aspect-[3/4] md:aspect-auto'
          : item.spanClass.includes('col-span-2')
          ? 'aspect-video md:aspect-auto'
          : 'aspect-square md:aspect-auto'
      }`}
    >
      {/* Secure Inner Frame masking the scaled image layer */}
      <div 
        className="w-full h-full overflow-hidden bg-[#0B0B0B] relative flex justify-center items-center"
        style={{ transform: 'translateZ(15px)' }}
      >
        <motion.img
          src={item.url}
          alt={item.title}
          referrerPolicy="no-referrer"
          style={{
            x: imgX,
            y: imgY,
            scale: hovered ? 1.05 : 1.00,
          }}
          className="absolute w-[114%] h-[114%] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
        />

        {/* Dynamic Light Reflexive Layer */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(230, 197, 135, 0.08) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        />

        {/* Ambient Overlay Layer */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10 opacity-40 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center space-y-2.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
            <div className="w-10 h-10 rounded-full border border-[#E6C587]/30 flex items-center justify-center bg-black/75 backdrop-blur-md">
              <Plus className="w-5 h-5 text-[#E6C587]" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#E6C587] uppercase font-bold">
              Inspect Notes
            </span>
          </div>
        </div>

        {/* Category Label Overlay */}
        <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[8px] font-mono tracking-widest text-[#E6C587] uppercase bg-black/90 px-2 py-1 border border-[#E6C587]/20 font-semibold">
            {item.category}
          </span>
        </div>

        {/* Floating Minimalist Heart Save Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(e);
          }}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-[#E6C587] hover:border-[#E6C587]/30 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-90"
          title={liked ? "Saved to Collection" : "Save composition"}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors duration-300 ${liked ? 'fill-[#E6C587] text-[#E6C587]' : ''}`} />
        </button>

        {/* Editorial Text Caption Panel */}
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-10 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
          <p className="font-serif text-base text-white font-light tracking-wide">
            {item.title}
          </p>
          <div className="flex items-center justify-between mt-3 text-[9px] font-mono tracking-widest text-[#F7F4EB]/80">
            <span>NIA CROWNE STUDIO</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
