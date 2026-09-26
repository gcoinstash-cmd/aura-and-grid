import { Property } from './types';

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'The Obsidian Pavilion',
    description: 'A masterpiece of contemporary brutalism and Japanese-inspired Zen design. This concrete and black charred cedar wood villa is integrated into a windswept cliffside, featuring uninterrupted thermal floor-to-ceiling glass walls, a sunken fire pit lounge, and an infinity pool that merges seamlessly with the ocean horizon.',
    price: 8450000,
    location: 'Big Sur, California',
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 6200,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85'
    ],
    status: 'available',
    amenities: ['Oceanfront Clifftop', 'Charred Cedar Cladding', 'Private Onsen pool', 'Sunken Conversation Pit', 'Tesla Solar Array', 'Professional Chef Kitchen'],
    brokerId: 'broker-alpha',
    createdAt: new Date('2026-05-01')
  },
  {
    id: 'prop-002',
    title: 'Minimalist Atrium House',
    description: 'Conceived by award-winning architects, this single-story oasis is organized around a private interior courtyard featuring a solitary specimen maple tree. Raw board-formed concrete walls, structural limestone flooring, and concealed lighting tracks create an atmosphere of monastic serenity and refined quiet luxury.',
    price: 4200000,
    location: 'Kyoto Highlands, Japan',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 3100,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'
    ],
    status: 'available',
    amenities: ['Zen Maple Court', 'Board-Formed Concrete', 'Radiant Heated Stone', 'Dual Master Tea Suites', 'Smart Tinting Glazing'],
    brokerId: 'broker-alpha',
    createdAt: new Date('2026-05-10')
  },
  {
    id: 'prop-003',
    title: 'The Champagne Penthouse',
    description: 'Occupying the entire top level of a boutique residential tower, this penthouse is designed with a champagne-anodized aluminum skeletal frame. Offers panoramic views of the skyline through custom curved glass corners, featuring honed white travertine cladding and bespoke brass fittings throughout.',
    price: 12500000,
    location: 'Tribeca, New York',
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 4800,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85'
    ],
    status: 'pending',
    amenities: ['Skydome Skylights', 'Travertine Wellness Spa', 'Helipad Access Portal', 'Private Wine Vault', 'Integrated Audio-Acoustics', 'Wrap-around Champagne Deck'],
    brokerId: 'broker-beta',
    createdAt: new Date('2026-05-15')
  },
  {
    id: 'prop-004',
    title: 'The Brutalist Sanctuary',
    description: 'A striking statement of linear geometric forms situated within a lush private pine forest. Raw, exposed architectural steel beams flank high-density basalt tile workspaces and customized oak partitions. Perfect for high-profile clients seeking absolute solitude and bulletproof privacy.',
    price: 6900000,
    location: 'Sintra, Portugal',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7400,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85'
    ],
    status: 'available',
    amenities: ['10-Acre Private Forest', 'Biometric Security Vault', 'Natural Cold Plunge Pool', 'Cantilevered Gym Capsule', 'Basalt-slab Flooring', 'Separate Staff Quarters'],
    brokerId: 'broker-beta',
    createdAt: new Date('2026-05-20')
  }
];
