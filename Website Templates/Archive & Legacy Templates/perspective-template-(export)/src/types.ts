export type ProjectCategory = 'Residential' | 'Commercial' | 'Hospitality' | 'Cultural' | 'Renovation' | 'Unbuilt / Concept';

export interface ProjectSpecs {
  location: string;
  year: string;
  typology: string;
  status: string;
  grossArea: string;
  materials: string;
  program: string;
  client: string;
  collaborators: string;
  photography: string;
  structuralGrid?: string;
  sparsityIndex?: string;
  facadeClass?: string;
  solarResponse?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  abstract: string;
  category: ProjectCategory;
  specs: ProjectSpecs;
  narrative: string[];
  mainImage: string;
  blueprintImage: string;
  blueprintCaption: string;
  gallery: {
    url: string;
    caption: string;
  }[];
  featured: boolean;
}

export interface JournalPost {
  id: string;
  title: string;
  category: 'Notes' | 'Process' | 'Materials' | 'Site Visits' | 'Press';
  date: string;
  readTime: string;
  abstract: string;
  paragraphs: string[];
  image: string;
}

export interface StudioTeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface StudioProfile {
  intro: string;
  philosophy: string[];
  services: {
    title: string;
    description: string;
  }[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  team: StudioTeamMember[];
  recognition: {
    year: string;
    title: string;
    medium: string;
  }[];
}

export interface CopyPromptItem {
  id: string;
  label: string;
  prompt: string;
  context: string;
}
