export interface Dish {
  id: string;
  courseNumber?: string;
  name: string;
  description: string;
  price: number;
  tags: string[]; // e.g. ["Limited Seating", "From Scratch"]
  dietary: string[]; // e.g. ["Vegan", "Non-Dairy", "Gluten-Free"]
  cookingMethod?: string; // Parsed from "method:*" tag
  organicAlignment?: string; // Parsed from "alignment:*" tag
  imageUrl?: string; // Opt in image URL
}

export type ExperienceId = 'tasting' | 'brunch' | 'friday';

export interface CulinaryExperience {
  id: ExperienceId;
  title: string;
  subtitle: string;
  schedule: string;
  chefQuote: string;
  description: string;
  dishes: Dish[];
}
