/**
 * Types and Interfaces for Aura Supper Club
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  course: 'Small Plates' | 'Mains' | 'Final Notes';
  dietary?: string[];
  ingredients: string[];
  highlighted: boolean;
}

export interface SupperClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  ticketsLeft: number;
  neighborhood: 'View Park' | 'Baldwin Hills' | 'Leimert Park' | 'Ladera Heights';
  locationDetail: string;
  curatedVinylSummary: string;
  curatedVinylPlaylistId: string;
  status: 'Open' | 'Selling Fast' | 'Sold Out';
  atmosphere: string;
}

export interface VinylTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear: number;
  albumCover: string;
  moodTag: string;
  labelColor: string; // hex representation for the internal cylinder vinyl label
  vibes: string[];
}

export interface ReservationSubmission {
  id: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount: number;
  seatingPreference: 'Courtyard Firepit' | 'Vinyl Library Arcade' | 'Garden Terrace' | 'Chef Communal Counter';
  dietaryNotes: string;
  customSpiceTier: 'Traditional Southern Subtle' | 'Chef Signature Warmth' | 'South LA Heat';
  curationAddon: boolean; // Custom vinly recommendation to go
  createdTime: string;
}

export interface CateringInquirySubmission {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  groupSize: number;
  neighborhood: string;
  cateringScope: 'Full On-Site Kitchen Takeover' | 'Bespoke Curated Drop-off' | 'Vinyl Sound & Food Sync';
  customRequestNotes: string;
  createdTime: string;
}
