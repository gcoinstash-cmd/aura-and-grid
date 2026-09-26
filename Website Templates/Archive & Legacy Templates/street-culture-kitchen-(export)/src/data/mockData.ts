export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "tacos" | "burgers" | "loaded-fries" | "drinks";
  imageUrl: string;
  tags: string[];
  spicyLevel?: 0 | 1 | 2 | 3;
  chefSpecial?: boolean;
}

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  features: string[];
  tags: string[];
}

export interface LocationHour {
  days: string;
  hours: string;
}

export const MONO_STATISTICS = [
  { label: "BURGERS SMASHED", value: "85K+" },
  { label: "STREET SCORE", value: "4.9★" },
  { label: "SPICE VARIANTS", value: "18+" },
  { label: "SECRET POPUPS", value: "14" },
];

export const BRAND_STORY = {
  title: "VANDAL FLAVORS. PREMIUM CRAFT.",
  sub: "THE UNDERGROUND STATEMENT FOR MODERN PALATES",
  paragraphs: [
    "We started in an abandoned alleyway with one flame-torched griddle, a custom soundsystem, and a relentless dedication to making street culinary masterpieces. No rules. No compromises.",
    "Street Culture Kitchen fuses high-fashion aesthetic layouts with raw, unapologetic fast food craft. From custom 24-hour beef brining to charcoal-infused artisan tortillas, every bite is a designed statement.",
    "We believe dining is an audio-visual-gustatory ritual. Good food doesn't belong behind white table cloths — it belongs on concrete, under neon lights, loaded with heavy bass."
  ]
};

export const MENU_CATEGORIES = [
  { id: "all", name: "THE FULL GRID" },
  { id: "tacos", name: "CHARCOAL TACOS" },
  { id: "burgers", name: "SMASH BURGERS" },
  { id: "loaded-fries", name: "GLITCH FRIES" },
  { id: "drinks", name: "CYBER ELIXIRS" }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "t1",
    name: "Neon Tokyo Brisket Taco",
    description: "Charcoal-activated flour tortilla, 18-hour smoked wagyu brisket, yuzu-lime cream, local micro-cilantro, pickled pink ginger.",
    price: 16.50,
    category: "tacos",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    tags: ["Best Seller", "Charcoal Crust"],
    spicyLevel: 1,
    chefSpecial: true
  },
  {
    id: "t2",
    name: "Vandal Citrus Shrimp Taco",
    description: "Habanero-infused corn tortilla, crispy tempura rock shrimp, charred pineapple pico de gallo, lime-avocado emulsion, shaved purple cabbage.",
    price: 15.00,
    category: "tacos",
    imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
    tags: ["Spicy", "Crispy Seafood"],
    spicyLevel: 2
  },
  {
    id: "b1",
    name: "District Truffle Smash Burger",
    description: "Double dry-aged brisket & short-rib blend, molten smoked gouda, hand-crafted truffle paste, flame-caramelized sweet onions, toasted brioche.",
    price: 18.00,
    category: "burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Dry-Aged", "House Sauce"],
    chefSpecial: true
  },
  {
    id: "b2",
    name: "The Cyberpunx Habanero Smasher",
    description: "Smashed beef patty, crisp pork belly lardons, ghost-pepper cheddar, jalapeño rings, fermented habanero jam, black-ink brioche bun.",
    price: 19.50,
    category: "burgers",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    tags: ["Extreme Heat", "Limited Run"],
    spicyLevel: 3
  },
  {
    id: "f1",
    name: "Glitch Street-Loaded Fries",
    description: "Twenty-four-hour brined hand-cut Russet potatoes, melted cotija cheese, flame-torched pork belly pieces, sriracha drizzle, crisp scallions, garlic dust.",
    price: 14.00,
    category: "loaded-fries",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    tags: ["Great For Sharing"],
    spicyLevel: 1
  },
  {
    id: "f2",
    name: "Holy Truffle Fries",
    description: "Golden fries tossed in parmesan crumbs, shaved burgundy truffles, rosemary essence, served with smoked chive aioli dip.",
    price: 15.00,
    category: "loaded-fries",
    imageUrl: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian Favor", "Elite Truffle"]
  },
  {
    id: "d1",
    name: "Hyper-Peach Cold Brew Tonic",
    description: "Triple-shot cold brew concentrate, carbonated white peach nectar, fresh rosemary smoke mist, wild floral honey float.",
    price: 8.50,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80",
    tags: ["High Caffeine", "Artisanal"]
  },
  {
    id: "d2",
    name: "Liquid Neon Limeade",
    description: "Muddled lime peels, cold-pressed mint juice, cucumber extraction, activated blue spirulina, topped with soda fizz and custom glow stick.",
    price: 7.00,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    tags: ["Gluten-Free", "Vibrant Refresh"]
  }
];

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: "cat1",
    name: "The Alleyway Pop-up",
    description: "Our core street experience. Standard food truck setup on-site, serving unlimited food tacos, fries, and elotes from custom branded packaging.",
    pricePerPerson: 35,
    minGuests: 30,
    features: [
      "2 Hours of unlimited live cooking",
      "Street Culture Custom Music playlist",
      "3 Taco varieties + Branded Fries",
      "Full digital booking & scheduling support"
    ],
    tags: ["Original Experience", "Highly Versatile"]
  },
  {
    id: "cat2",
    name: "Vandal Sound & Feast",
    description: "A synchronized aesthetic event. Complete layout installation including custom neon ambient setups, a live street-art DJ booth, and gourmet smash burgers cooked to order.",
    pricePerPerson: 65,
    minGuests: 50,
    features: [
      "4 Hours of total event curation",
      "Live performance DJs with premium sound",
      "Interactive graffiti banner for guest participation",
      "The entire premium smash burger and craft taco menu",
      "Complimentary Cyber Elixirs list for guests"
    ],
    tags: ["Festival Ready", "Ultimate Styling"]
  },
  {
    id: "cat3",
    name: "VVIP Warehouse Takeover",
    description: "High-fashion meets private catering. Tailor-made underground fine-casual event with customized course cards, custom menus, glowing drink towers, and absolute styling perfection.",
    pricePerPerson: 110,
    minGuests: 20,
    features: [
      "Private VIP multi-course street-inspired dining",
      "Custom menus designed around guest taste preferences",
      "Personal head chef presentation & table service",
      "Custom branded merch tokens for guests",
      "Custom dynamic visual projects / mappings"
    ],
    tags: ["Elite Luxury", "Fully Custom"]
  }
];

export const LOCATION_DETAILS = {
  address: "1082 Vandal Way SE, District 4, Industrial Quarter",
  subtext: "Look for the flashing neon green arrow and heavy bass.",
  phone: "+1 (888) 555-CORE",
  email: "clandestine@streetculture.kitchen",
  hours: [
    { days: "THU - FRI", hours: "18:00 - 02:00 (LATE NIGHT)" },
    { days: "SATURDAY", hours: "16:00 - 04:00 (RAW PARTY RUN)" },
    { days: "SUNDAY", hours: "12:00 - 22:00 (RECOVERY FEAST)" },
    { days: "MON - WED", hours: "CLOSED (RESEARCH & CURATION)" }
  ],
  socials: {
    instagram: "@StreetCultureKitchen",
    spotify: "SCK_Radio",
    tiktok: "@VandalFlavors"
  }
};
