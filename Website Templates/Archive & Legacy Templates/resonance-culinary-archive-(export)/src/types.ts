export interface DesignSystem {
  id: string;
  name: string;
  primaryFont: string;
  secondaryFont: string;
  colors: {
    background: string;
    card: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    border: string;
  };
  spacingRatio: string;
  microInteractions: string;
}

export interface MenuItem {
  id: string;
  course: string;
  title: string;
  sensoryDescription: string;
  heritageNotes: string;
}

export interface CulinaryTemplate {
  id: string;
  title: string;
  tagline: string;
  narrative: string;
  curatorQuote: string;
  curatorName: string;
  images: {
    hero: string;
    plating: string;
    atmosphere: string;
  };
  menu: MenuItem[];
  designSpecs: {
    typography: {
      heading: string;
      subheading: string;
      body: string;
    };
    whitespace: string;
    emotionalAtmosphere: string;
  };
  tailwindConfig: string;
  reactCode: string;
}

export interface PlateToken {
  hash: string;
  blockNumber: number;
  dishName: string;
  estateChef: string;
  lineageAttributes: string[];
  ancestralRegion: string;
  timestamp: string;
  verifiedStatus: 'Verified' | 'Pending' | 'Secured';
}

export interface AuctionLot {
  id: string;
  title: string;
  chef: string;
  description: string;
  minimumIncrement: number;
  currentBid: number;
  highestBidder: string;
  endsAt: string;
  bidsHistory: Array<{
    bidder: string;
    amount: number;
    timestamp: string;
  }>;
  imageUrl: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'bid' | 'verify' | 'customizer' | 'system';
  timestamp: string;
}
