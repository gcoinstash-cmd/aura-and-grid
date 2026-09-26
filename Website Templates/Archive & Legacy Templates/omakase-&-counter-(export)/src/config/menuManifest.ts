import { MenuItemType, RestaurantConfig } from "../types";

/**
 * =========================================================================
 *                   OMAKASE & COUNTER - MASTER MANIFEST
 * =========================================================================
 * This central configuration houses all localized copy, price guides, image 
 * URLs, sommelier recommendations, and dynamic metadata for the template.
 *
 * GUIDELINES FOR NON-TECHNICAL ACQUIRERS:
 * 1. Text & Copy: Keep styling lowercase for consistent brand voice.
 * 2. Prices: 'price' is a string shown in the UI. 'priceValue' is the raw number.
 * 3. Images: Use secure, high-resolution Unsplash URLs.
 * 4. Pairings: Pair each seafood profile with temperature-sensitive wines/sakes.
 */

export const RESTaurant_CONFIG: RestaurantConfig = {
  name: "omakase & counter",
  seatingCapacity: 16,
  courseCount: 12,
  roomType: "one quiet room",
  heroSubtext: "a high-contrast sensory retreat centered entirely on pristine marine harvests and the precision of the knife.",
  seatingTimes: ["5:30 pm", "8:15 pm"],
  address: "18 hinoki avenue, floor 2",
  location: "kyoto / gion district",
  phone: "+81 (75) 555-0190",
  instagramUrl: "#instagram",
  journalUrl: "#journal",
  privacyUrl: "#legal"
};

export const MENU_ITEMS: MenuItemType[] = [
  {
    id: "uni",
    name: "hokkaido uni",
    japaneseName: "北海道ウニ",
    description: "hand-harvested sea urchin from hokkaido, served over warm seasoned shari, wrapped in premium crisp maruoyama nori.",
    price: "24",
    priceValue: 24,
    image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?q=80&w=1200&auto=format&fit=crop",
    curation: "coastal cold waters",
    pairing: {
      name: "jokigen 'original luxury' junmai daiginjo",
      temp: "serve chilled (10°C)",
      notes: "velvety viscosity with smooth green melon esters that frame the ocean-rich fat of raw unpasteurized uni."
    }
  },
  {
    id: "otoro",
    name: "otoro nigiri",
    japaneseName: "大トロ握り",
    description: "aged ten days, hand-brushed with our 12-year sake-infused nikiri glaze, finished with hand-grated wild shizuoka wasabi.",
    price: "28",
    priceValue: 28,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    curation: "tsukiji direct auction",
    pairing: {
      name: "kokuryu 'black dragon' ryusen junmai daiginjo",
      temp: "serve slightly chilled (12°C)",
      notes: "intense cedar and dry pear finish that cuts cleanly through aged bluefin fat levels."
    }
  },
  {
    id: "a5wagyu",
    name: "miyazaki a5 wagyu",
    japaneseName: "宮崎牛 A5",
    description: "purebred a5 black kuroge wagyu, kissed with binchotan oak charcoal embers, finished with micro-shiitake reduction and volcanic salt.",
    price: "32",
    priceValue: 32,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    curation: "southern prefecture",
    pairing: {
      name: "kenzo estate 'murasaki' rindo cabernet blend",
      temp: "cellar temperature (16°C)",
      notes: "deep violet tannins with soft cacao undertones, elevating the binchotan-toasted miyazaki beef melt."
    }
  },
  {
    id: "madai",
    name: "shojin madai",
    japaneseName: "真鯛の昆布締め",
    description: "line-caught red sea bream, cured gently in sugar-kelp beds, seasoned with freshly squeezed wild sudachi citrus rind.",
    price: "18",
    priceValue: 18,
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200&auto=format&fit=crop",
    curation: "pristine bays",
    pairing: {
      name: "sohomare 'heart and soul' tokubetsu kimoto",
      temp: "chilled (8°C)",
      notes: "earthy, complex, clean-edged wild dry sake designed specifically for delicate white-fleshed kombujime."
    }
  },
  {
    id: "tamago",
    name: "shiba-ebi tamago",
    japaneseName: "芝海老玉子焼き",
    description: "traditional sweet castella-style table omelet baked four hours over embers, crafted with mountain yam and ground wild tiger prawns.",
    price: "14",
    priceValue: 14,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    curation: "edo period recipe",
    pairing: {
      name: "toko 'glowing light' aged koshu sweet sake",
      temp: "room temperature (18°C)",
      notes: "amber hues, toasted sugar and chestnut tones that embrace the baked mountain-yam profile."
    }
  },
  {
    id: "matcha",
    name: "shizuoka reserve tea",
    japaneseName: "静岡銘茶",
    description: "stone-ground ceremonial grade uji抹茶 or hand-roasted 2024 vintage hojicha charcoal tea selection served in bespoke pottery.",
    price: "12",
    priceValue: 12,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1200&auto=format&fit=crop",
    curation: "private estate harvest",
    pairing: {
      name: "soma 'ancestral origin' dry sparkling sake",
      temp: "chilled (5°C)",
      notes: "wild effervescence with elegant rice-koji sweetness, cleansing the palate perfectly."
    }
  }
];
