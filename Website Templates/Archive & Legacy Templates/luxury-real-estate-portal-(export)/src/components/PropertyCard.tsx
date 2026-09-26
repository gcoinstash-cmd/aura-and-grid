/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Property } from '../types';
import { Compass, Maximize, Eye } from 'lucide-react';

interface PropertyCardProps {
  key?: any;
  property: Property;
  onInquire: (property: Property) => void;
  onSchedule: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export function PropertyCard({ property, onInquire, onSchedule, onViewDetails }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col bg-[#0A0A0A]/80 border border-neutral-900 rounded-lg overflow-hidden transition-all duration-500 hover:border-gold-500/30 hover:shadow-xl hover:shadow-black/60"
      id={`property-card-${property.id}`}
    >
      {/* Property Image Cover */}
      <div className="relative aspect-video xl:aspect-[1.8/1] overflow-hidden bg-neutral-950">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
        />
        
        {/* Subtle Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        {/* Exclusive Status Tag */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-[#050505]/95 backdrop-blur-md border border-neutral-800 rounded-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${
            property.status === 'available' ? 'bg-emerald-500' :
            property.status === 'pending' ? 'bg-amber-500' : 'bg-neutral-600'
          }`} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-300">
            {property.status}
          </span>
        </div>

        {/* Price Tag Overlay at Bottom Corner */}
        <div className="absolute bottom-4 right-4 z-10 bg-[#050505]/90 backdrop-blur-md px-3.5 py-1.5 border border-gold-500/20 rounded-sm">
          <span className="font-display text-base font-semibold tracking-wide text-amber-100/90">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Property Information */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="font-display text-xl font-medium text-white tracking-tight leading-snug group-hover:text-[#E5D3B3] transition-colors duration-300">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-neutral-500 mt-1">
              <Compass className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-xs font-sans font-normal tracking-wide text-neutral-400">
                {property.location}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed mb-6">
          {property.description}
        </p>

        {/* Technical Architectural Parameters */}
        <div className="grid grid-cols-3 border-t border-b border-neutral-900/60 py-4 mb-6 text-center divide-x divide-neutral-900/40">
          <div>
            <div className="font-mono text-xs font-semibold text-neutral-200">
              {property.bedrooms}
            </div>
            <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
              Beds
            </div>
          </div>
          <div>
            <div className="font-mono text-xs font-semibold text-neutral-200">
              {property.bathrooms}
            </div>
            <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
              Baths
            </div>
          </div>
          <div>
            <div className="font-mono text-xs font-semibold text-neutral-200 flex items-center justify-center gap-0.5">
              {property.sqft.toLocaleString()}
              <Maximize className="w-2.5 h-2.5 opacity-40" />
            </div>
            <div className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
              Sq Ft
            </div>
          </div>
        </div>

        {/* Premium CTA Panel */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => onViewDetails(property)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans tracking-wide text-neutral-400 hover:text-white transition-all duration-200 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 rounded-md"
            id={`view-details-btn-${property.id}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onInquire(property)}
              className="px-3.5 py-2 text-xs font-sans tracking-wide text-neutral-200 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-gold-500/20 rounded-md transition-all duration-200"
              id={`inquire-btn-${property.id}`}
            >
              Inquire
            </button>
            <button
              onClick={() => onSchedule(property)}
              className="px-3.5 py-2 text-xs font-sans tracking-wide font-medium bg-[#1a1712] hover:bg-[#2c2417] text-amber-200/90 hover:text-amber-100 border border-gold-500/30 rounded-md shadow-sm transition-all duration-300"
              id={`schedule-btn-${property.id}`}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
