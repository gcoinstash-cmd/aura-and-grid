export type PizzaCategory = 'classic' | 'red-base' | 'white-base' | 'house-specials' | 'vegetarian' | 'pizza' | 'pasta' | 'dessert';

export interface Pizza {
  id: string;
  name: string;
  italianName: string;
  description: string;
  price: number;
  category: PizzaCategory;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image: string;
  ingredients?: string[];
  allergens?: string[];
}

export type CrustType = 'neapolitan' | 'thin-crispy' | 'gluten-free';
export type SauceType = 'san-marzano' | 'bianco-cream' | 'basil-pesto' | 'none';
export type CheeseType = 'fior-di-latte' | 'buffalo-mozzarella' | 'gorgonzola' | 'vegan-mozz' | 'none';

export interface ToppingOption {
  id: string;
  name: string;
  italianName: string;
  price: number;
  type: 'meat' | 'veggie-herb';
  color: string; // Used for visual canvas layer dots
}

export interface CustomPizza {
  id: string;
  name: string;
  crust: CrustType;
  sauce: SauceType;
  cheese: CheeseType;
  toppings: string[]; // List of ToppingOption ids
  price: number;
}

export interface CartItem {
  id: string; // Unique instanced id (so duplicate menu pizzas or customized variants are handled)
  pizzaId?: string; // Present if it's a menu pizza
  customPizza?: CustomPizza; // Present if it's a custom-built pizza
  name: string;
  italianName?: string;
  price: number;
  quantity: number;
  customizations?: string[];
}

export type SeatingZone = 'garden-patio' | 'wood-oven' | 'sommelier-lounge';

export interface Reservation {
  id: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  zone: SeatingZone;
  notes?: string;
  status: 'confirmed';
}

export type OrderStep = 'dough' | 'sauce' | 'wood-fire' | 'finish' | 'dispatched';

export interface OrderTracker {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  currentStep: OrderStep;
  createdAt: string;
}
