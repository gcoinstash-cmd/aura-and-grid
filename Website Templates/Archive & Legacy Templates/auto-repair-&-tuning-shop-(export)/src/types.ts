export type VehicleType = 'sedan' | 'suv' | 'truck' | 'sports';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  estimatePrice: number;
  category: 'maintenance' | 'tuning' | 'diagnostics' | 'detailing';
  icon: string;
  helperText?: string;
}

export interface BookingRecord {
  id: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleMake: string;
  vehicleModel: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  notes?: string;
  priceEstimate: number;
  status: TicketStatus;
}

export type TicketStatus = 'inspection' | 'parts_ordered' | 'in_progress' | 'quality_check' | 'ready';

export interface TicketStatusState {
  label: string;
  description: string;
  details: string;
  percentage: number;
  iconName: string;
}

export interface PackageTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface TestimonialRecord {
  id: string;
  author: string;
  vehicle: string;
  type: string; // "Full Restomod", "Stage 2 Tune", etc.
  text: string;
  rating: number;
  beforeUrl: string;
  afterUrl: string;
  date: string;
}
