export interface SommelierPairing {
  name: string;
  temp: string;
  notes: string;
}

export interface MenuItemType {
  id: string;
  name: string;
  japaneseName: string;
  description: string;
  price: string;
  priceValue: number;
  image: string;
  curation: string; // e.g. "early spring", "tsukiji morning auction"
  pairing: SommelierPairing; // Each premium item includes its sommelier pairing definition
}

export interface RestaurantConfig {
  name: string;
  seatingCapacity: number;
  courseCount: number;
  roomType: string;
  heroSubtext: string;
  seatingTimes: string[];
  address: string;
  location: string;
  phone: string;
  instagramUrl: string;
  journalUrl: string;
  privacyUrl: string;
}
