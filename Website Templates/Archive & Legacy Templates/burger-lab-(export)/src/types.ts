/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrandAngleId = 'burger-lab' | 'smash-theory' | 'field-notes' | 'char-grid';

export interface BrandAngleConfig {
  id: BrandAngleId;
  name: string;
  tagline: string;
  slogan: string;
  description: string;
  philosophyTitle: string;
  philosophyText: string;
  accentClass: string; // Tailwind class like bg-lime-400 or text-orange-500
  accentHex: string;   // Hex code for styles
  primaryFont: string; // Font classes
  badgeText: string;
  labSpecs: {
    label: string;
    value: string;
    index: number;
  }[];
}

export type ThemeId = 'light' | 'dark' | 'steel';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  textColorMuted: string;
  borderColor: string;
  gridLineColor: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  code: string;
  category: 'burgers' | 'sides' | 'shakes' | 'late-night';
  description: string;
  composition: {
    label: string;
    value: string;
  }[];
  maillardScore?: number;
  hydrationIndex?: string;
  image: string;
  calories: string;
}
