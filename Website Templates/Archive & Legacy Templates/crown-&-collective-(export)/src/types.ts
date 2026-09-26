export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  category: 'cut-styling' | 'color' | 'treatments';
  ritualStep: string;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  specialty: string;
  instagram: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'Cuts' | 'Editorial' | 'Color' | 'Atmosphere';
  spanClass: string; // Tailored specifically for aesthetic masonry layouts
}

export interface BookingDetails {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}
