/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HospitalityNiche, Testimonial } from "./types";

export const HOST_NICHES: HospitalityNiche[] = [
  {
    id: "jazz-lounge",
    name: "YOUR BRAND NAME",
    tagline: "YOUR BRAND TAGLINE",
    description: "[Insert brand description here]",
    colors: {
      primary: "#C5A85C", // Muted Brass Gold
      primaryGlow: "rgba(197, 168, 92, 0.2)",
      accent: "#1A102F", // Subterranean Deep Violet
      accentGlow: "rgba(26, 16, 47, 0.4)",
      bg: "#0A080E", // Night-sky Obsidian
      cardBg: "#120F1B", // Velvet Shadows
      textGlow: "#C5A85C1A",
    },
    fonts: {
      display: "font-serif",
      body: "font-sans",
    },
    brandStory: {
      title: "Our Philosophy",
      subtitle: "Crafting timeless culinary experiences.",
      paragraphs: [
        "We believe that exceptional hospitality lies in the harmonious interplay of flavor, ambiance, and moment. Every menu item and curated performance is designed to transport our guests, creating an evening of refined tranquility away from the demands of the modern world.",
        "Our culinary curation highlights seasonal abundance and precision craftsmanship. Guided by a respect for the classic traditions of dining, our kitchen emphasizes robust textures, elegant reductions, and unexpected regional finishes that complement our hand-selected spirits.",
        "Whether seated in our main dining room or sharing bespoke plates in our refined atmosphere, our space welcomes you to gather, linger, and discover the art of deliberate hospitality."
      ],
      chefName: "Professional Name",
      chefRole: "Executive Chef & Partner"
    },
    contact: {
      phone: "[Your Phone Number]",
      address: "[Your Street Address]",
      cityState: "[Your City, State, Zip]",
      instagram: "@your_brand",
      hours: {
        weekdays: "5:00 PM — 1:00 AM",
        weekends: "5:00 PM — 2:00 AM",
        sunday: "11:00 AM — Midnight"
      }
    },
    menuItems: [
      {
        id: "m1",
        name: "Pan-Seared Duck Breast",
        price: "$34",
        description: "Pan-seared duck breast with sweet potato purée and a warm cherry reduction.",
        category: "mains",
        tags: ["Signature"],
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
        isPopular: true
      },
      {
        id: "m2",
        name: "Signature Old Fashioned",
        price: "$19",
        description: "Rye whiskey, brown sugar, house bitters, served over a hand-carved ice sphere.",
        category: "cocktails",
        tags: ["House Classic"],
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        isPopular: true
      },
      {
        id: "m3",
        name: "Truffle Lobster Frites",
        price: "$38",
        description: "Butter-seared lobster tail, hand-cut frites, and premium black summer truffles.",
        category: "mains",
        tags: ["Signature"],
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        isPopular: true
      },
      {
        id: "m4",
        name: "Prime Beef Carpaccio",
        price: "$24",
        description: "Thinly sliced Wagyu beef, fresh arugula, capers, parmesan, and olive oil.",
        category: "mains",
        tags: ["Classic"],
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
        isPopular: false
      },
      {
        id: "m5",
        name: "The Signature Sour",
        price: "$18",
        description: "Dry gin, house blueberry infusion, fresh lemon, and a subtle lavender accent.",
        category: "cocktails",
        tags: ["Floral"],
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
        isPopular: false
      },
      {
        id: "m6",
        name: "Warm Brioche Bread Pudding",
        price: "$14",
        description: "Rich custard-baked brioche, warm caramel sauce, pecans, and vanilla bean cream.",
        category: "dessert",
        tags: ["Classic"],
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        isPopular: true
      }
    ],
    events: [
      {
        id: "e1",
        title: "The Late-Night Quintet",
        date: "Every Fri & Sat",
        time: "10:30 PM - 1:30 AM",
        artist: "Benny Green & the Harlem Vanguard",
        description: "A classic live performance featuring standout saxophone layers and a warm rhythm section.",
        coverCharge: "$25 performance cover",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
        status: "Available"
      },
      {
        id: "e2",
        title: "Classic Standards & Vocal Evenings",
        date: "Thursday Nights",
        time: "8:00 PM - 11:00 PM",
        artist: "Chloe Sterling Quartet",
        description: "An intimate, low-lit evening of warm performances and elegant vocal and instrumental arrangements.",
        coverCharge: "$15 performance cover",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        status: "Available"
      }
    ],
    highlights: [
      {
        id: "h1",
        title: "Refined Sanctuary",
        desc: "Thoughtfully configured seating layouts and soft premium materials that establish a warm, sophisticated atmosphere.",
        icon: "Volume2",
        image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: "h2",
        title: "The Lounge Bar",
        desc: "A classic, polished wood bar wrapping around the performance stage, placing guests close to the music.",
        icon: "Music",
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=500&q=80"
      },
      {
        id: "h3",
        title: "The Wine Reserve",
        desc: "A temperature-controlled selection housing a carefully curated collection of fine local and imported premium vintages.",
        icon: "Wine",
        image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=500&q=80"
      }
    ]
  }
];

export const GENERAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "National Dining Guide",
    role: "Dining Critic",
    rating: 5,
    quote: "A beautiful, memorable dining experience. Restrained warm lighting and a live music set that pairs naturally with a refined, focused dinner menu.",
    source: "Michelin Guide"
  },
  {
    id: "t2",
    author: "Local Culinary Press",
    role: "Beverage Editor",
    rating: 5,
    quote: "The cocktail list is classic and focused, featuring an exceptional old fashioned. Highly recommended for premium hospitality buyers looking for inspiration.",
    source: "Eater"
  },
  {
    id: "t3",
    author: "Verified Guest Review",
    role: "Regular Guest",
    rating: 5,
    quote: "An exceptionally warm and atmospheric lounge. The acoustics are clean, the service is guest-first, and the signature duck breast is outstanding.",
    source: "Google"
  }
];
