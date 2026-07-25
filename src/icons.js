import {
  Sparkles, Palette, Droplet, Scissors, Flower2, Wind, Baby,
  Gift, ShoppingBag, Tag, Star, Heart, Package, Sun, Moon,
  Coffee, Camera, Music, Book, Home, Car, Watch, Gem, Shirt, Utensils, Dumbbell, Smartphone,
} from 'lucide-react';

export const ICON_MAP = {
  Sparkles, Palette, Droplet, Scissors, Flower2, Wind, Baby,
  Gift, ShoppingBag, Tag, Star, Heart, Package, Sun, Moon,
  Coffee, Camera, Music, Book, Home, Car, Watch, Gem, Shirt, Utensils, Dumbbell, Smartphone,
};

export const ICON_KEYS = Object.keys(ICON_MAP);

export const iconFor = key => ICON_MAP[key] || Tag;

// Cycled automatically when a new category is created — keeps colors visually distinct
// without needing a color picker in the admin UI.
export const CATEGORY_PALETTE = [
  { tint: '#fdeef3', fg: '#d1568a' },
  { tint: '#e9f4ee', fg: '#12805c' },
  { tint: '#eef1fb', fg: '#5b6bd1' },
  { tint: '#fff3e6', fg: '#d98a2b' },
  { tint: '#f2ecfb', fg: '#8b5bd1' },
  { tint: '#eaf6fb', fg: '#2f9ad1' },
  { tint: '#fdf2e2', fg: '#b5790b' },
  { tint: '#e6f6f0', fg: '#0f9d72' },
];

export const slugify = name => String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'category';
