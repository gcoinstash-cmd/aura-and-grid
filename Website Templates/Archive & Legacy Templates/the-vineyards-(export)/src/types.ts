export interface FeedItem {
  id: string;
  category: 'Announcement' | 'Event' | 'Notice';
  date: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  image?: string;
  rsvpCount?: number;
  rsvpStatus?: 'Going' | 'Not Going' | 'Maybe' | null;
  likesCount: number;
  commentsCount: number;
  likedByUser?: boolean;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  category: 'HOA Assessment' | 'Amenity Fee' | 'Reserved Parking Space Lease' | 'Special Assessment';
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
}

export interface MaintenanceRequest {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'Maintenance' | 'Landscaping' | 'Architectural Review' | 'Security' | 'Others';
  priority: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Submitted' | 'Scheduled' | 'In Progress' | 'Completed';
}

export interface GuestPass {
  id: string;
  guestName: string;
  vehiclePlate: string;
  date: string;
  duration: string;
  passCode: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Bylaws & Rules' | 'Financial Reports' | 'Meeting Minutes' | 'Forms & Surveys';
  fileSize: string;
  lastUpdated: string;
}

export interface AmenityReservation {
  id: string;
  amenityId: string;
  amenityName: string;
  date: string;
  timeSlot: string;
  status: 'Active' | 'Cancelled' | 'Completed';
}

export interface AmenityDetail {
  id: string;
  name: string;
  description: string;
  capacity?: string;
  status: 'Open' | 'Closed' | 'Maintenance';
  timeSlots: string[];
}
