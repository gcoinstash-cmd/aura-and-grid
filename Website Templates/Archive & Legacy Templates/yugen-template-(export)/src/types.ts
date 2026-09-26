/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  romanizedName?: string;
  category: 'nigiri' | 'composition' | 'pairing';
  description: string;
  sensoryNote: string; // Dynamic olfactory/sensory notes e.g. "Top note: Cold-pressed yuzu, toasted nori oil"
  price: number;
}

export interface DiningTier {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  inclusions: string[];
  isPremium?: boolean;
}

export interface PrivateBuyoutOption {
  id: string;
  title: string;
  basePrice: number;
  capacity: string;
  description: string;
  exclusivePerks: string[];
}

export interface BookingFormState {
  guestName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  experienceTier: string; // id of DiningTier or PrivateBuyoutOption
  addCaviarAssortment: boolean;
  addPrivateSakeSommelier: boolean;
  specialRequests: string;
  isCustomConsultation: boolean; // Custom buyout starting at $3,500+
}
