/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoffeeBean {
  id: string;
  name: string;
  subName: string; // e.g. "GESHA MICRO-LOT"
  origin: string;  // e.g. "Sidama, Ethiopia"
  tastingNotes: string[]; // e.g. ["Jasmine", "Bergamot", "White Peach"]
  elevation: string;   // e.g. "2,100 MASL"
  roastLevel: 'light' | 'light-medium' | 'medium';
  processType: string; // e.g. "Double Anaerobic Wash"
  description: string;
  price: number; 
  imageUrl: string;
  isLimitedEdition: boolean;
  score: number; // e.g. 94pts
  stockLeft?: number;
}

export interface CartItem {
  id: string; // Unique for cart (coffeeId + grind)
  coffeeId: string;
  name: string;
  grind: string;
  price: number;
  quantity: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  perks: string[];
  pointsMultiplier: number;
  badge: string;
}

export interface ActiveSubscription {
  tierId: string;
  billingFrequency: 'monthly' | 'annual';
  grindOption: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  deliveryAddress: string;
  nextShipDate: string;
}

export interface ReservationSlot {
  id: string;
  title: string;
  type: 'omakase' | 'workshop' | 'slowbar';
  description: string;
  date: string;
  time: string;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  duration: string;
}

export interface Review {
  id: string;
  coffeeId: string;
  reviewerName: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  roastTag: string;
  verifiedPurchase: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  type: 'omakase' | 'seasonal' | 'alliance';
  description: string;
  timestamp: string;
  isActive: boolean;
}

export interface OrderTrackState {
  orderId: string;
  status: 'preparing' | 'brewing' | 'ready' | 'collected';
  estimatedTime: string;
  items: string[];
  pickupCode: string;
}
