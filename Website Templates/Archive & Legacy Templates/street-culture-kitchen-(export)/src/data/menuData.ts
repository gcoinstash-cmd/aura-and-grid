export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Tacos' | 'Burritos' | 'Sides' | 'Drinks' | string;
  image: string;
  tags: string[];
}

export const menuData: MenuItem[] = [
  {
    id: "taco-01",
    name: "Charcoal-Kissed Wagyu Taco",
    description: "Flame-seared A5 wagyu brisket, served on an hand-pressed charcoal-infused corn tortilla. Topped with wild scallion cream, local micro-greens, and a dash of white-truffle infused oil.",
    price: 18.50,
    category: "Tacos",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    tags: ["Spicy", "Chef Special", "Artisanal"]
  },
  {
    id: "SEC // TACO-02",
    name: "Flame-Torched Carne Asada Al Pastor",
    description: "Crispy double-layered corn tortillas loaded with flame-torched citrus-marinated pork al pastor, seared carne asada strips, caramelized pineapple telemetry chunks, salsa verde, and micro-cilantro foliage.",
    price: 18.00,
    category: "TACOS",
    image: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25'%3E%3Crect width='400' height='400' fill='%231e293b'/%3E%3Cdefs%3E%3Cpattern id='slateGrid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23334155' stroke-width='1'/%3E%3C/pattern%3E%3ClinearGradient id='tortillaGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f59e0b'/%3E%3Cstop offset='100%25' stop-color='%23b45309'/%3E%3C/linearGradient%3E%3ClinearGradient id='porkGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ea580c'/%3E%3Cstop offset='100%25' stop-color='%239a3412'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23slateGrid)' opacity='0.4'/%3E%3Ccircle cx='200' cy='195' r='170' fill='none' stroke='%23f43f5e' stroke-width='1.5' stroke-dasharray='4 8' opacity='0.3'/%3E%3Ccircle cx='200' cy='195' r='140' fill='%230f172a' stroke='%23334155' stroke-width='2'/%3E%3Cg transform='translate(140, 160) rotate(-10)'%3E%3Cellipse cx='40' cy='50' rx='80' ry='45' fill='url(%23tortillaGrad)' stroke='%2378350f' stroke-width='2'/%3E%3Cellipse cx='40' cy='50' rx='72' ry='40' fill='%23fde047' opacity='0.3'/%3E%3Ccircle cx='0' cy='35' r='4' fill='%23451a03' opacity='0.6'/%3E%3Ccircle cx='65' cy='65' r='5' fill='%23451a03' opacity='0.5'/%3E%3Ccircle cx='20' cy='20' r='3' fill='%23451a03' opacity='0.7'/%3E%3C/g%3E%3Cg transform='translate(190, 185) rotate(15)'%3E%3Cellipse cx='0' cy='0' rx='80' ry='45' fill='url(%23tortillaGrad)' stroke='%2378350f' stroke-width='2'/%3E%3Cellipse cx='0' cy='0' rx='72' ry='40' fill='%23fde047' opacity='0.3'/%3E%3Ccircle cx='-35' cy='-10' r='4' fill='%23451a03' opacity='0.6'/%3E%3Ccircle cx='25' cy='15' r='5' fill='%23451a03' opacity='0.5'/%3E%3Ccircle cx='-10' cy='10' r='3' fill='%23451a03' opacity='0.7'/%3E%3C/g%3E%3Cg%3E%3Cpath d='M 150 170 Q 180 140 210 185 T 260 170' fill='none' stroke='url(%23porkGrad)' stroke-width='12' stroke-linecap='round'/%3E%3Cpath d='M 155 170 Q 180 143 210 182 T 255 171' fill='none' stroke='%23f97316' stroke-width='4' stroke-linecap='round' opacity='0.8'/%3E%3Cpath d='M 130 205 Q 170 175 210 220 T 270 200' fill='none' stroke='url(%23porkGrad)' stroke-width='12' stroke-linecap='round'/%3E%3Cpath d='M 135 204 Q 170 178 210 217 T 265 201' fill='none' stroke='%23f97316' stroke-width='4' stroke-linecap='round' opacity='0.8'/%3E%3Cpath d='M 170 230 Q 210 200 240 245 T 280 225' fill='none' stroke='url(%23porkGrad)' stroke-width='10' stroke-linecap='round'/%3E%3C/g%3E%3Cg fill='%23facc15' stroke='%23ca8a04' stroke-width='1'%3E%3Cpolygon points='160,150 175,140 180,155'/%3E%3Cpolygon points='210,165 228,155 220,175'/%3E%3Cpolygon points='140,195 152,185 158,200'/%3E%3Cpolygon points='250,190 262,175 268,195'/%3E%3Cpolygon points='190,225 205,215 208,232'/%3E%3Cpolygon points='230,230 245,215 250,235'/%3E%3C/g%3E%3Cg fill='%2322c55e' stroke='%2315803d' stroke-width='1' opacity='0.95'%3E%3Ccircle cx='160' cy='175' r='6'/%3E%3Ccircle cx='215' cy='195' r='5'/%3E%3Ccircle cx='185' cy='160' r='7'/%3E%3Ccircle cx='240' cy='180' r='6'/%3E%3Ccircle cx='175' cy='215' r='5.5'/%3E%3Ccircle cx='225' cy='215' r='7'/%3E%3Ccircle cx='160' cy='175' r='2.5' fill='%234ade80' stroke='none'/%3E%3Ccircle cx='185' cy='160' r='3' fill='%234ade80' stroke='none'/%3E%3Ccircle cx='225' cy='215' r='3' fill='%234ade80' stroke='none'/%3E%3C/g%3E%3Cpath d='M 25 40 L 40 40 L 40 25' fill='none' stroke='%23f43f5e' stroke-width='1.5' opacity='0.8'/%3E%3Cpath d='M 375 360 L 360 360 L 360 375' fill='none' stroke='%23f43f5e' stroke-width='1.5' opacity='0.8'/%3E%3Cpath d='M 375 40 L 350 40 L 350 25' fill='none' stroke='%23f43f5e' stroke-width='1.5' opacity='0.8'/%3E%3Cpath d='M 25 360 L 40 360 L 40 375' fill='none' stroke='%23f43f5e' stroke-width='1.5' opacity='0.8'/%3E%3Crect x='70' y='325' width='260' height='26' rx='5' fill='%230f172a' stroke='%23f43f5e' stroke-width='1.5'/%3E%3Crect x='80' y='334' width='8' height='8' fill='%23ea580c'/%3E%3Crect x='312' y='334' width='8' height='8' fill='%2322c55e'/%3E%3Ctext x='200' y='342' font-family='monospace' font-size='10' font-weight='900' fill='%23ffffff' text-anchor='middle' letter-spacing='1.5'%3EPSTR // SEC-02%3C/text%3E%3Ctext x='200' y='375' font-family='monospace' font-size='7.5' font-weight='700' fill='%2394a3b8' text-anchor='middle' letter-spacing='2'%3ELAT 19.4326° N / LON 99.1332° W%3C/text%3E%3C/svg%3E",
    tags: ["Tacos", "Spicy", "Torched", "Vibrant", "Specialty"]
  },
  {
    id: "taco-03",
    name: "The Cyber Avocado & Roasted Corn Taco",
    description: "Heavily muddled organic avocado, fire-seared white sweetcorn, pickled watermelon rinds, sweet hot-honey reduction, on a lightweight hemp flour tortilla.",
    price: 14.50,
    category: "Tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegan", "Gluten-Free", "Mild"]
  },
  {
    id: "burrito-01",
    name: "Subline Brisket Smasher Burrito",
    description: "24-hour slow brine chuck brisket, triple cheese weld, gold cilantro rice, refried smokey beans, wrapped together in a giant heat-pressed flour skin.",
    price: 21.00,
    category: "Burritos",
    image: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?auto=format&fit=crop&w=800&q=80",
    tags: ["Heavy", "Spice Alert"]
  },
  {
    id: "sides-01",
    name: "Loaded Glitch Cotija Fries",
    description: "Hand-cut Idaho russet potatoes, smoked truffle dust, cotija cheese crumbles, and dynamic chili-lime drizzle.",
    price: 11.50,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    tags: ["Gluten-Free", "Vegan Option"]
  },
  {
    id: "drinks-01",
    name: "Liquid Neon Cactus Limeade",
    description: "Activated matcha nectar, double squeezed fresh lime juice, wild cactus honey syrup, carbonated mineral water splash.",
    price: 7.50,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegan", "High Alert", "Refresh"]
  }
];
