export interface NoteItem {
  name: string;
  description?: string;
  origin?: string;
}

export interface OlfactoryPyramid {
  top: NoteItem[];
  heart: NoteItem[];
  base: NoteItem[];
}

export interface FragranceProduct {
  id: string;
  name: string;
  tagline: string;
  story: string;
  character: string;
  intensity: number; // 1-5 scale
  notes: OlfactoryPyramid;
  imageUrl?: string;
  heroImage?: string;
}
