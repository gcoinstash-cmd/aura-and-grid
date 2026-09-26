import { ServiceItem, Stylist, GalleryItem } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'cut-ritual',
    name: 'The Royal Crown Curl & Coil Sculpting',
    duration: '75 min',
    price: 180,
    category: 'cut-styling',
    description: 'A bespoke silhouette designed to honor your natural textured curl pattern, coily density, and bone structure. Includes a deep cold-pressed botanical detox, high-vibration scalp massage, and specialized steam-infusion hydration.',
    ritualStep: 'Thermal Aromatherapy + Organic Mist Infusion'
  },
  {
    id: 'dimensional-color',
    name: 'Melanin-Tone Dimensional Color',
    duration: '180 min',
    price: 360,
    category: 'color',
    description: 'High-fidelity dimensional painting, copper glazes, and rich honey balayage custom formulated specifically for textured strands. Protects curl density and integrity using slow-release protective lipids.',
    ritualStep: 'Post-Color Amino Acid Wash + Custom Tone Glaze'
  },
  {
    id: 'bleach-tone',
    name: 'Avant-Garde Coil Lifting & Toners',
    duration: '210 min',
    price: 450,
    category: 'color',
    description: 'Double-process lifting masterfully engineered for coily and textured crowns. Deeply protective of natural oil barriers with a customized earth-toned glaze or icy platinum finish.',
    ritualStep: 'Deep Keratin Bond Reinforcement Therapy'
  },
  {
    id: 'editorial-styling',
    name: 'The Crown Press & Silk Experience',
    duration: '60 min',
    price: 120,
    category: 'cut-styling',
    description: 'A luxury low-tension silk press or botanical blow-out. Uses precision ceramic sealing and weightless organic serums to deliver a high-gloss, flowing finish with bouncy volume.',
    ritualStep: 'Cold-Air Dry + Protective Organic Shine Seal'
  },
  {
    id: 'moisture-alchemy',
    name: 'Botanical Coil Hydration & Loc Ritual',
    duration: '90 min',
    price: 160,
    category: 'treatments',
    description: 'A luxurious micro-mist cellular therapy that deeply infuses dry coils, twists, or locs with complex moisture. Features botanical oils, hibiscus extracts, and a specialized scalp rejuvenation routine.',
    ritualStep: 'Micro-Steam Scalp Scaling + Hydrid Shield Mist'
  },
  {
    id: 'cellular-repair',
    name: 'Molecular Bounce & Pattern Protection',
    duration: '90 min',
    price: 195,
    category: 'treatments',
    description: 'An advanced bond-rebuilding therapy restoring inner core strength and elasticity to highly textured, colored, or heat-processed strands. Defines and stabilizes coily crowns.',
    ritualStep: 'High-Frequency Infrared Laser Shield Seal'
  }
];

export const STYLISTS: Stylist[] = [
  {
    id: 'nia-crowne',
    name: 'Nia Crowne',
    role: 'Creative Director & Founder',
    bio: 'With 14 years of design residency in Paris, Tokyo, and Los Angeles, Nia treats hair as an architectural crown of self-expression. She specializes in sculptural afro geometry, bespoke loc rituals, and premium modern silhouettes.',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=400&auto=format&fit=crop',
    specialty: 'Textured Silhouette Architecture, Sculptural Afros',
    instagram: '@nia_crowne'
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Senior Master Colorist',
    bio: 'Marcus is an alchemist of melanin-rich tones and coily curl integrity. He is famous for high-contrast blonding, warm copper glazes, and protective paintwork on delicate, beautiful textures.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    specialty: 'Bespoke Coily Blonding, Color Synthesis',
    instagram: '@marcus.vance.hair'
  },
  {
    id: 'amani-taylor',
    name: 'Amani Taylor',
    role: 'Editorial Principal Stylist',
    bio: 'Educated between London and Accra, Amani designs precision-sculpted dry cuts, low-tension high-fashion twists, and premium silk presses tailored uniquely to the fast-paced entrepreneurial lifestyle.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop',
    specialty: 'Loc & Twist Sculpting, Ceramic Silk Presses',
    instagram: '@amani.taylor.hair'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop',
    title: 'Architectural Coil Silhouette',
    category: 'Cuts',
    spanClass: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    title: 'Minimalist Botanical Alchemy',
    category: 'Atmosphere',
    spanClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    title: 'Sculptural Afro Crown Design',
    category: 'Editorial',
    spanClass: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    title: 'Melrose Private Studio Lounge',
    category: 'Atmosphere',
    spanClass: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?q=80&w=600&auto=format&fit=crop',
    title: 'Bespoke Hydration Sheen',
    category: 'Editorial',
    spanClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=600&auto=format&fit=crop',
    title: 'Warm Honey Balayage on Curls',
    category: 'Color',
    spanClass: 'md:col-span-1 md:row-span-2'
  }
];
