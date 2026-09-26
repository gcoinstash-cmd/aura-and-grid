import { CulinaryExperience, Dish } from './types';

/**
 * Scans a product's tag array for specific prefix patterns.
 * e.g., 'method:clay baked' -> extracts 'CLAY BAKED' as cookingMethod.
 * e.g., 'alignment:98%' -> extracts '98%' as organicAlignment.
 */
export function parseProductTags(tags: string[]): {
  cookingMethod?: string;
  organicAlignment?: string;
  cleanTags: string[];
} {
  let cookingMethod: string | undefined = undefined;
  let organicAlignment: string | undefined = undefined;
  const cleanTags: string[] = [];

  tags.forEach(tag => {
    const trimmed = tag.trim();
    if (trimmed.toLowerCase().startsWith('method:')) {
      cookingMethod = trimmed.substring('method:'.length).trim().toUpperCase();
    } else if (trimmed.toLowerCase().startsWith('alignment:')) {
      organicAlignment = trimmed.substring('alignment:'.length).trim().toUpperCase();
    } else {
      cleanTags.push(trimmed);
    }
  });

  return { cookingMethod, organicAlignment, cleanTags };
}

const RAW_CULINARY_EXPERIENCES: CulinaryExperience[] = [
  {
    id: 'tasting',
    title: "Chef's Tasting Table",
    subtitle: "A multi-sensory progressive dinner curated in single sittings",
    schedule: "Thursdays — Sittings at 18:00 & 20:30",
    chefQuote: "“To dine is to read an essay written in texture, smoke, and memory.” — Chef Marcus Vance",
    description: "An intimate culinary exploration of the Pacific Slope, designed around organic micro-farms and high-end artisanal handcraft. Each course is paired with cellar-released biodynamic vintages.",
    dishes: [
      {
        id: 'tasting-1',
        courseNumber: "Course I",
        name: "Hand-Rolled Cavatelli",
        description: "Melted forest chanterelles, house-cured guanciale, emulsion of aged pecorino, and wild marjoram.",
        price: 34,
        tags: ["From Scratch", "Limited Seating", "method:Milled Hand Kneaded", "alignment:95%"],
        dietary: ["Nut-Free"],
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'tasting-2',
        courseNumber: "Course II",
        name: "Heritage Pork Belly",
        description: "Slow-roasted Berkshire lardons, caramelized organic parsnip velvet, reduction of wild sour cherry and star anise.",
        price: 46,
        tags: ["Heritage breed", "method:Clay Baked", "alignment:98%"],
        dietary: ["Gluten-Free", "Non-Dairy"],
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'tasting-3',
        courseNumber: "Course III",
        name: "Meyer Lemon Tart",
        description: "Delicate pine-nut cardamon oil sandcrust, fresh candied lavender bloom, and hard-burnt winter sea-salt meringue.",
        price: 22,
        tags: ["House Pastry", "Foraged Bloom", "alignment:100%"],
        dietary: ["Vegetarian"],
        imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'tasting-4',
        courseNumber: "Intermezzo",
        name: "Chilled Sorrel & Apple Snow",
        description: "Clean pressed green wood-apple ice crystals, cold-infused lemon balm, and raw sage syrup.",
        price: 14,
        tags: ["Pressed to Order", "Micro Harvest", "method:Cold Infused", "alignment:100%"],
        dietary: ["Vegan", "Non-Dairy", "Gluten-Free"],
        imageUrl: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: 'brunch',
    title: "View Park Brunch",
    subtitle: "A serene afternoon of light, butter-brushed brioche, and morning sun",
    schedule: "Saturdays & Sundays — 10:00 to 14:30",
    chefQuote: "“Morning light demands soft textures, subtle salts, and a languid approach to time.”",
    description: "Honoring our historical neighborhood with local roasts, fresh-pressed heirloom citruses, and comforting morning staples transformed through French culinary geometry.",
    dishes: [
      {
        id: 'brunch-1',
        name: "Brioche French Toast",
        description: "Thick-cut house brioche soaked in vanilla bean custard, whipped raw organic butter, and wood-fired high-mountain maple nectar.",
        price: 26,
        tags: ["Baked Daily", "Heritage Wheat", "method:Wood Fired", "alignment:94%"],
        dietary: ["Vegetarian"],
        imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'brunch-2',
        name: "Smoked Salmon Benedict",
        description: "Cold-smoked wild sockeye salmon over toasted house-kneaded sourdough, soft poached pasture eggs, and freshly pulled bronze dill hollandaise.",
        price: 29,
        tags: ["Wild Caught", "Poached to Order", "method:Cold Smoked"],
        dietary: ["Nut-Free"],
        imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'brunch-3',
        name: "Truffle Scramble",
        description: "Soft-curd pasture eggs folded with shaved Périgord black truffles, raw cultured butter crumbles, and snipped backyard garlic-chives.",
        price: 32,
        tags: ["Fresh Shaved", "Limited Availability", "alignment:99%"],
        dietary: ["Gluten-Free", "Vegetarian"],
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'brunch-4',
        name: "Heirloom Tomato & Foraged Greens",
        description: "Salt-pressed purple-cherokee tomatoes, wild mustard greens, cold-pressed avocado emulsion, roasted flax crackers.",
        price: 19,
        tags: ["Raw Harvest", "Unrefined", "alignment:100%"],
        dietary: ["Vegan", "Non-Dairy", "Gluten-Free"],
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: 'friday',
    title: "Because It's Friday",
    subtitle: "An end-of-week release centered around open flame, woodsmoke, and craft preservation",
    schedule: "Fridays Only — 17:00 to Late",
    chefQuote: "“Friday is an invitation to put aside structural restraint and celebrate pure smoke and caramel.”",
    description: "A tribute to traditional home-style slow food. Our hearth utilizes local cherrywood logs and custom stone grates to deliver dark-blistered proteins and heirloom grains.",
    dishes: [
      {
        id: 'friday-1',
        name: "Slow-Smoked Ribs",
        description: "Twelve-hour oakwood dry-rubbed heritage pork ribs, glazed in elderberry vinegar infusion and caramelized wildflower honey.",
        price: 38,
        tags: ["12hr Oakwood", "Prime Cut", "method:Cherry Wood Smoked", "alignment:96%"],
        dietary: ["Gluten-Free", "Non-Dairy"],
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'friday-2',
        name: "Artisanal Mac & Cheese",
        description: "In-house cast iron baked torchio pasta with a five-year aged cheddar and sheep-milk gruyère velvet, topped with toasted rye-sourdough crumbs.",
        price: 24,
        tags: ["Wood Fired", "Comfort Classic", "method:Skillet Baked"],
        dietary: ["Vegetarian"],
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'friday-3',
        name: "Cornbread Pudding",
        description: "Warm stone-ground white heirloom corn custard pudding, served with a dollop of whipped Madagascar vanilla-bean crème fraîche.",
        price: 18,
        tags: ["Stone Ground", "Heirloom Crop", "alignment:97%"],
        dietary: ["Gluten-Free", "Vegetarian"],
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 'friday-4',
        name: "Smoked Ember Oyster Mushrooms",
        description: "Direct-fired grey oyster clusters, glazed in home-brewed sweet leek tare, roasted walnut snow, and nasturtium vinegar.",
        price: 22,
        tags: ["Ember Kissed", "Wild Spun", "method:Direct Hearth Ember", "alignment:100%"],
        dietary: ["Vegan", "Non-Dairy", "Gluten-Free"],
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

// Dynamically compile CULINARY_EXPERIENCES by mapping the tags and sanitizing them
export const CULINARY_EXPERIENCES: CulinaryExperience[] = RAW_CULINARY_EXPERIENCES.map(experience => ({
  ...experience,
  dishes: experience.dishes.map(dish => {
    const { cookingMethod, organicAlignment, cleanTags } = parseProductTags(dish.tags);
    return {
      ...dish,
      tags: cleanTags,
      cookingMethod,
      organicAlignment
    };
  })
}));
