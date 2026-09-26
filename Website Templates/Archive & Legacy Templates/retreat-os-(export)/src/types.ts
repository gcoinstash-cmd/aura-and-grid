export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface DayPlan {
  dayNumber: number;
  dayTitle: string;
  focus: string;
  items: ItineraryItem[];
}

export interface AccommodationTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  paymentPlan: string;
  description: string;
  spotsTotal: number;
  spotsRemaining: number;
  amenities: string[];
  imageUrl: string;
}

export interface FacultyMember {
  name: string;
  role: string;
  bio: string;
  lineage: string;
  avatarUrl: string;
}

export interface Retreat {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  location: string;
  dates: string;
  durationDays: number;
  heroImage: string;
  quote: {
    text: string;
    author: string;
  };
  narrativeOverview: string;
  aboutDetails: string[];
  included: string[];
  notIncluded: string[];
  itinerary: DayPlan[];
  accommodations: AccommodationTier[];
  host: FacultyMember;
}

export interface RetreatApplication {
  id: string;
  retreatId: string;
  retreatTitle: string;
  tierId: string;
  tierName: string;
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  callingText: string;
  experienceText: string;
  dietaryRestrictions: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'accepted';
}
