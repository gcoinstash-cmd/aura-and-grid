/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category: "signature" | "mains" | "cocktails" | "sides" | "dessert";
  tags: string[];
  image: string;
  isPopular?: boolean;
}

export interface LiveEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  artist: string;
  description: string;
  coverCharge: string;
  image: string;
  status: "Selling Fast" | "Sold Out" | "Available";
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  quote: string;
  source: "Google" | "Yelp" | "Michelin Guide" | "Eater";
}

export interface AtmosphereHighlight {
  id: string;
  title: string;
  desc: string;
  icon: string;
  image: string;
}

export interface HospitalityNiche {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    primaryGlow: string;
    accent: string;
    accentGlow: string;
    bg: string;
    cardBg: string;
    textGlow: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  brandStory: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    chefName: string;
    chefRole: string;
  };
  contact: {
    phone: string;
    address: string;
    cityState: string;
    instagram: string;
    hours: {
      weekdays: string;
      weekends: string;
      sunday: string;
    };
  };
  menuItems: MenuItem[];
  events: LiveEvent[];
  highlights: AtmosphereHighlight[];
}
