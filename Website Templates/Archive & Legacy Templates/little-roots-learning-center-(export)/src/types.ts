export interface Program {
  id: string;
  name: string;
  ageRange: string;
  ratio: string;
  hours: string;
  description: string;
  extendedDescription: string;
  curriculumHighlights: string[];
  dailyRhythm: string[];
  monthlyTuition: number;
  annualSupplyFee: number;
  availability: 'Limited Openings' | 'Waitlist Active' | 'Now Enrolling';
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  imageUrl: string;
  quote?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  relation: string; // e.g., "Mother of Maya, Age 2 & Miles, Age 4"
  neighborhood: string; // e.g., "Baldwin Hills", "View Park", "Leimert Park"
  parentSince: number;
  rating: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Classrooms' | 'Play & Nature' | 'Art & Culture';
  imageUrl: string;
  description: string;
}

export interface TourBooking {
  parentName: string;
  childName: string;
  childAge: string;
  parentEmail: string;
  parentPhone: string;
  selectedDate: string;
  selectedTime: string;
  selectedProgramId: string;
  notes?: string;
}
