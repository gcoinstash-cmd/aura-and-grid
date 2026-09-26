/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoffeeBean, SubscriptionTier, ReservationSlot, Review, NotificationAlert } from './types';

export const COFFEE_BEANS: CoffeeBean[] = [
  {
    id: 'ethiopia-gesha',
    name: 'Wush Wush Gesha',
    subName: 'ANAEROBIC HONEY MICRO-LOT',
    origin: 'Kaffa Province, Ethiopia',
    tastingNotes: ['Bergamot', 'White Tea', 'Candied Ginger', 'Jasmine'],
    elevation: '2,150 MASL',
    roastLevel: 'light',
    processType: '120hr Anaerobic Honey',
    description: 'An exceptional crop sourced from wild micro-plots. This Gesha specimen undergoes sealed anaerobic chambers for 120 hours before honey-depulping, unlocking rare lavender florality and clean tea-like translucency.',
    price: 36,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    isLimitedEdition: true,
    score: 95,
    stockLeft: 14
  },
  {
    id: 'panama-geisha',
    name: 'Esmeralda Special',
    subName: 'THE GOLDEN SEED SERIES',
    origin: 'Boquete, Panama',
    tastingNotes: ['Leche Citron', 'Dried Apricot', 'Orange Blossom', 'Jasmine Honey'],
    elevation: '1,950 MASL',
    roastLevel: 'light',
    processType: 'Carbonic Maceration Natural',
    description: 'Widely considered the pinnacle of modern specialty coffee. Originating from the elite dry-plots of Hacienda La Esmeralda, it blooms in the cup with a fragrance resembling a fine perfume.',
    price: 64,
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    isLimitedEdition: true,
    score: 97,
    stockLeft: 6
  },
  {
    id: 'colombia-el-paraiso',
    name: 'El Paraiso Lychee',
    subName: 'THERMAL SHOCK INNOVATOR',
    origin: 'Cauca, Colombia',
    tastingNotes: ['Lychee syrup', 'Greek Yogurt', 'Passion Fruit', 'Pink Grapefruit'],
    elevation: '1,850 MASL',
    roastLevel: 'light-medium',
    processType: 'Thermal Shock Double Fermentation',
    description: 'A mind-bending profile from Diego Bermudez. Injected with specific native yeasts during high-pressure thermal shock, this coffee is incredibly fruity, tasting of pure lychee compote.',
    price: 38,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    isLimitedEdition: false,
    score: 94,
    stockLeft: 32
  },
  {
    id: 'yemen-ismail',
    name: 'Harazi Bani Ismail',
    subName: 'ANCIENT TERRACE RESERVE',
    origin: 'Haraaz Highlands, Yemen',
    tastingNotes: ['Cardamom', 'Dark Cherry', 'Cacao Nib', 'Sandalwood'],
    elevation: '2,300 MASL',
    roastLevel: 'medium',
    processType: 'Ancient Natural Bed-Dry',
    description: 'Cultivated on centuries-old volcanic stone terraces clinging to cliffs. Intensely concentrated berry sugars mixed with warming spices—a dramatic journey into the historical roots of espresso coffee.',
    price: 48,
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    isLimitedEdition: true,
    score: 93,
    stockLeft: 9
  },
  {
    id: 'japan-kissa-espresso',
    name: 'Dark Kissa Espresso',
    subName: 'HOUSE HOUSE-ROAST BLEND',
    origin: 'Brazil Pulped Natural & Ethiopia Natural',
    tastingNotes: ['Dark Cocoa', 'Toasted Hazelnut', 'Blackberry Marmalade'],
    elevation: '1,600 MASL',
    roastLevel: 'medium',
    processType: 'Artisanal Dynamic Blend',
    description: 'Our proprietary house blend designed specifically to anchor milk drinks or deliver a syrupy, heavy-bodied double shot with subtle floral top notes.',
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=800',
    isLimitedEdition: false,
    score: 91
  }
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'alliance-minimalist',
    name: 'The Minimalist',
    tagline: 'Precision for the purist.',
    priceMonthly: 29,
    priceAnnual: 24,
    perks: [
      'One micro-lot shipment monthly',
      'Choose complete raw or custom grind specs',
      'Access to Seasonal Drop pre-release alerts',
      '1x Loyalty Points on physical bar orders'
    ],
    pointsMultiplier: 1.0,
    badge: 'Single Origin'
  },
  {
    id: 'alliance-connoisseur',
    name: 'The Connoisseur',
    tagline: 'Cultivated curiosity in light and shadow.',
    priceMonthly: 54,
    priceAnnual: 45,
    perks: [
      'Two micro-lot shipments monthly',
      'Priority roaster custom-notes detailing',
      'Access to Omakase Reservations 48 hrs early',
      '1.5x Loyalty Points multiplier'
    ],
    pointsMultiplier: 1.5,
    badge: 'Micro-Lot Elite'
  },
  {
    id: 'alliance-reserve',
    name: 'The Obsidian Reserve',
    tagline: 'Private cellar access for culinary obsession.',
    priceMonthly: 89,
    priceAnnual: 75,
    perks: [
      'Two Reserve bags + One secret farm nano-lot',
      'Complimentary monthly double espresso at LA bar',
      'VIP reservation priority (instant seat lock-in)',
      '2.0x Loyalty Points multiplier'
    ],
    pointsMultiplier: 2.0,
    badge: 'VIP Cellar'
  }
];

export const RESERVATION_SLOTS: ReservationSlot[] = [
  {
    id: 'omakase-sat',
    title: 'The Slow-Bar Omakase',
    type: 'omakase',
    description: 'An intimate five-pour sensory flight curated by our head roaster, highlighting contrasting processing style variables and exquisite floral chemistry. Accompanied by minimalist botanical infusions.',
    date: 'Saturday, May 30',
    time: '11:00 AM — 12:30 PM',
    pricePerSeat: 75,
    totalSeats: 6,
    availableSeats: 2,
    duration: '90 Minutes'
  },
  {
    id: 'omakase-sun',
    title: 'The Slow-Bar Omakase',
    type: 'omakase',
    description: 'An intimate five-pour sensory flight curated by our head roaster, highlighting contrasting processing style variables and exquisite floral chemistry. Accompanied by minimalist botanical infusions.',
    date: 'Sunday, May 31',
    time: '2:00 PM — 3:30 PM',
    pricePerSeat: 75,
    totalSeats: 6,
    availableSeats: 4,
    duration: '90 Minutes'
  },
  {
    id: 'workshop-pour',
    title: 'Extraction Chemistry Masterclass',
    type: 'workshop',
    description: 'Unpack the physics of temperature profile curves, mineral water hardness composition, and particle distribution using uniform flat-bed brewers.',
    date: 'Sunday, May 31',
    time: '10:00 AM — 11:30 AM',
    pricePerSeat: 95,
    totalSeats: 4,
    availableSeats: 1,
    duration: '90 Minutes'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    coffeeId: 'ethiopia-gesha',
    reviewerName: 'Sorella K.',
    rating: 5,
    date: 'May 24, 2026',
    title: 'Pure Translucency',
    content: 'Tastes like sweet jasmine water mixed with cold white peace juices. Absolutely zero bitterness or standard roasted carbon. It feels more like drinking an ancient vintage tea.',
    roastTag: 'Light Roast / Pour-Over',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    coffeeId: 'panama-geisha',
    reviewerName: 'Marcus T. (LA Arts District)',
    rating: 5,
    date: 'May 18, 2026',
    title: 'An Olfactory Spell',
    content: 'Yes, it is expensive, but the Esmeralda Special completely redefines the capability of coffee. The dry aroma alone is powerful enough to saturate my entire workspace. A phenomenal masterpiece.',
    roastTag: 'Light Roast / Origami Dripper',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    coffeeId: 'colombia-el-paraiso',
    reviewerName: 'Elena G.',
    rating: 5,
    date: 'May 20, 2026',
    title: 'Pure Lychee Compote',
    content: 'The thermal shock process is incredibly distinct. Upon opening the sealed pouch, it smells immediately of fresh lychees and sweet cream yogurt. Stunning acidity.',
    roastTag: 'Light-Medium / V60 Filter',
    verifiedPurchase: true
  }
];

export const NOTIFICATION_ALERTS: NotificationAlert[] = [
  {
    id: 'notif-1',
    title: 'Aroma Peak Alert',
    type: 'seasonal',
    description: 'Panama Geisha Esmeralda Special has restocked with small-batch #3. Only 12 bags left on the rack.',
    timestamp: 'Just now',
    isActive: true
  },
  {
    id: 'notif-2',
    title: 'Omakase Weekend',
    type: 'omakase',
    description: 'Booking open for June 6th Secret Cellar Session – Ethiopian Wild Gesha Flight.',
    timestamp: '2 hours ago',
    isActive: true
  },
  {
    id: 'notif-3',
    title: 'Alliance Notice',
    type: 'alliance',
    description: 'Monthly roasting schedule locked. Shipments dispatched tomorrow morning.',
    timestamp: '1 day ago',
    isActive: false
  }
];
