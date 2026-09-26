/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'client' | 'broker';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  status: 'available' | 'pending' | 'sold';
  amenities: string[];
  brokerId: string;
  createdAt: any; // Firestore Timestamp
}

export interface Inquiry {
  id: string;
  propertyId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'closed';
  brokerId: string;
  createdAt: any; // Firestore Timestamp
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'scheduled' | 'completed';
  brokerId: string;
  createdAt: any; // Firestore Timestamp
  scheduledDate?: string;
}

export interface Appointment {
  id: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  brokerId: string;
  datetime: any; // Firestore Timestamp or ISO string
  status: 'requested' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: any; // Firestore Timestamp
}

export interface DocumentRecord {
  id: string;
  title: string;
  fileUrl: string;
  clientId: string;
  brokerId: string;
  uploadedBy: string;
  createdAt: any; // Firestore Timestamp
}
