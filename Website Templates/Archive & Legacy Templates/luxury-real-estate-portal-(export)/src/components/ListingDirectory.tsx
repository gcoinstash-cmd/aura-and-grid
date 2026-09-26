/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { SlidersHorizontal, Search, X, Check, MapPin, DollarSign, Home } from 'lucide-react';

interface ListingDirectoryProps {
  properties: Property[];
  onInquire: (property: Property) => void;
  onSchedule: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export function ListingDirectory({ properties, onInquire, onSchedule, onViewDetails }: ListingDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(15000000); // Max up to 15 Million
  const [minBeds, setMinBeds] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique locations in the catalog
  const locations = useMemo(() => {
    const list = new Set<string>();
    properties.forEach((p) => list.add(p.location.split(',')[1]?.trim() || p.location));
    return ['All', ...Array.from(list)];
  }, [properties]);

  // Gather all unique amenities across properties
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => p.amenities.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [properties]);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setPriceRange(15000000);
    setMinBeds(0);
    setStatusFilter('all');
    setSelectedAmenities([]);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Text Search Filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query);

      // 2. Location Filter
      const matchesLocation =
        selectedLocation === 'All' || p.location.includes(selectedLocation);

      // 3. Price Filter
      const matchesPrice = p.price <= priceRange;

      // 4. Bedrooms Filter
      const matchesBeds = p.bedrooms >= minBeds;

      // 5. Status Filter
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      // 6. Amenities Filter
      const matchesAmenities = selectedAmenities.every((amenity) =>
        p.amenities.includes(amenity)
      );

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesBeds &&
        matchesStatus &&
        matchesAmenities
      );
    });
  }, [properties, searchQuery, selectedLocation, priceRange, minBeds, statusFilter, selectedAmenities]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="listing-directory-module">
      
      {/* Header and Filter Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">
            Curated Architectural Archive
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-white tracking-tight mt-2">
            The Property Catalog
          </h2>
        </div>
        
        {/* Compact Modern Search and Filters Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              placeholder="Search by name, site, architectural feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-neutral-800 text-xs text-neutral-300 pl-10 pr-4 py-2.5 rounded-md focus:outline-none focus:border-gold-500/50 transition-colors"
              id="global-property-search"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border text-xs tracking-wider uppercase font-sans transition-all duration-300 ${
              showFilters
                ? 'bg-neutral-900 border-gold-500/40 text-[#E5D3B3]'
                : 'bg-[#0A0A0A] border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            id="toggle-filter-panel"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Advanced Animated Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden border border-neutral-900 bg-[#070707] rounded-lg mb-12"
            id="filter-panel-drawer"
          >
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Location Selector */}
              <div className="flex flex-col space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Region / State
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-3 py-2 text-left rounded-sm text-xs truncate transition-colors ${
                        selectedLocation === loc
                          ? 'bg-[#15130F] border border-gold-500/20 text-[#E5D3B3]'
                          : 'bg-[#0E0E0E] text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Cap Threshold Slider */}
              <div className="flex flex-col space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Maximum Budget</span>
                  <span className="text-[#E5D3B3] font-mono text-xs">
                    {(priceRange / 1000000).toFixed(1)}M USD
                  </span>
                </label>
                <div className="pt-4 px-1">
                  <input
                    type="range"
                    min={2000000}
                    max={15000000}
                    step={500000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-gold-500 cursor-pointer h-1 bg-neutral-900 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-700 font-mono mt-1 pt-1">
                    <span>$2.0M</span>
                    <span>$8.5M</span>
                    <span>$15.0M</span>
                  </div>
                </div>
              </div>

              {/* Beds / Rooms Count */}
              <div className="flex flex-col space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" /> Minimum Bedrooms
                </label>
                <div className="flex gap-2 mt-2">
                  {[0, 2, 3, 4, 5].map((bedNum) => (
                    <button
                      key={bedNum}
                      onClick={() => setMinBeds(bedNum)}
                      className={`flex-1 py-1.5 rounded-sm text-xs font-mono transition-colors ${
                        minBeds === bedNum
                          ? 'bg-[#15130F] border border-gold-500/20 text-[#E5D3B3]'
                          : 'bg-[#0E0E0E] text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {bedNum === 0 ? 'Any' : `${bedNum}+`}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col space-y-1">
                  <label className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
                    Listing Status
                  </label>
                  <div className="flex rounded-sm bg-[#0E0E0E] p-0.5 mt-1 border border-neutral-900">
                    {['all', 'available', 'pending', 'sold'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`flex-1 py-1 text-[10px] uppercase font-mono rounded-sm transition-colors ${
                          statusFilter === st
                            ? 'bg-neutral-900 text-gold-400'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exclusive Amenities checklist */}
              <div className="flex flex-col space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                  Exclusive Amenities
                </label>
                <div className="flex flex-wrap gap-1.5 h-36 overflow-y-auto pr-1 mt-2 border border-neutral-900 bg-[#0B0B0B] p-2 rounded-sm scrollbar-thin">
                  {allAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-sans tracking-wide rounded-sm transition-all border duration-200 ${
                          isSelected
                            ? 'bg-[#1C1812] text-[#E5D3B3] border-gold-500/30'
                            : 'bg-neutral-950 text-neutral-500 border-transparent hover:text-neutral-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-gold-400" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0A0A0A] border-t border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono">
                Matching Properties Found: <span className="text-neutral-300">{filteredProperties.length}</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors py-1.5 px-3 uppercase font-mono tracking-widest text-[9px]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of curations */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="properties-grid">
          {filteredProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onInquire={onInquire}
              onSchedule={onSchedule}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-dashed border-neutral-900 rounded-lg py-24 px-6 text-center">
          <p className="font-display text-lg text-neutral-400 font-light max-w-sm">
            No estates match your refined criterion. Please reset the filtering preferences to browse the core catalog.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2 text-xs font-mono tracking-widest uppercase bg-neutral-900 hover:bg-neutral-800 text-gold-400 border border-neutral-800 rounded-sm"
          >
            Clear Selected Criteria
          </button>
        </div>
      )}
    </div>
  );
}
