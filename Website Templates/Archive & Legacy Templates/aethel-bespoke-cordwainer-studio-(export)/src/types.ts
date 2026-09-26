export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: number[];
  specs: {
    label: string;
    value: string;
  }[];
  origin: string;
  leatherType: string;
  status?: 'available' | 'limited' | 'sold_out';
  inventoryCount?: number;
}

export interface CartItem {
  id: string; // Unique combination of product id + selected size
  product: Product;
  size: number;
  quantity: number;
}

export interface FittingPreferences {
  fittingType: 'standard' | 'custom';
  archProfile: 'low' | 'neutral' | 'high';
  instepProfile: 'sleek' | 'standard' | 'robust';
  fullName: string;
  email: string;
  notes: string;
}

export interface BlueprintSpec {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  sourcing: string;
  origin: string;
  longevity: string;
  image?: string;
}
