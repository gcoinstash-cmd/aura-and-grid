/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GalaEvent {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  location: string;
  venue: string;
  squareFootage: string;
  guestCount: string;
  scentProfile: {
    top: string;
    heart: string;
    base: string;
  };
  acousticTheme: string;
  bpm: number;
  waveformSeed: number[];
  blueprintUrl: string;
  photoUrl: string;
  editorialText: string;
}

export interface Vendor {
  id: string;
  name: string;
  alphabet: string;
  category: "Florals" | "Catering" | "Acoustics" | "Couture" | "Production" | "Scent Design";
  location: string;
  tiers: string[];
  startingPrice: string;
  rating: string;
  about: string;
  portfolioCount: number;
  contactEmail: string;
}

export interface RSVPResponse {
  fullName: string;
  email: string;
  attendance: "accept" | "decline" | "";
  guestCount: number;
  dietaryRestrictions: string[];
  accommodationPreference: string;
  customRequests: string;
}

export interface CustomSensoryMix {
  id: string;
  eventName: string;
  topNote: string;
  heartNote: string;
  baseNote: string;
  bpm: number;
  acousticStyle: string;
  lightingKey: string;
}
