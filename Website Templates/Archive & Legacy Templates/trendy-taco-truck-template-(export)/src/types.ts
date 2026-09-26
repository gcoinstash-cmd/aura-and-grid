export interface MenuItem {
  id: string;
  name: string;
  category: 'Tacos' | 'Sides' | 'Drinks' | 'Specials';
  description: string;
  price: number;
  ingredients: string[];
  spicyLevel: 0 | 1 | 2 | 3; // 0 = mild/none, 3 = extreme
  tags: string[]; // e.g. "Vegan", "Gluten-Free", "Award Winner"
  imageUrl: string;
  available: boolean;
}

export interface TruckLocation {
  id: string;
  spotName: string;
  address: string;
  hours: string;
  status: 'Setting Up' | 'Live' | 'Sold Out' | 'Off Duty';
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface CateringLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guestCount: number;
  budgetRange: 'under_2k' | '2k_5k' | '5k_10k' | 'over_10k';
  details: string;
  status: 'New' | 'Contacted' | 'Approved' | 'Archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
  source?: string;
}
