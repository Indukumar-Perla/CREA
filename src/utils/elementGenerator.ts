import { ColorPalette } from '../types';

interface ContentElement {
  type: 'emoji' | 'shape';
  content: string;
  color?: string;
}

const productKeywords: Record<string, string[]> = {
  amla: ['leaf', 'herb', 'plant', 'nature', 'green'],
  neem: ['leaf', 'herb', 'plant', 'nature', 'green'],
  shampoo: ['wave', 'water', 'flow', 'clean'],
  conditioner: ['wave', 'water', 'smooth', 'silky'],
  oil: ['drop', 'liquid', 'shine', 'glow'],
  cream: ['swirl', 'smooth', 'soft', 'blend'],
  moisturizer: ['water', 'hydrate', 'glow', 'fresh'],
  sunscreen: ['sun', 'shield', 'protect', 'bright'],
  natural: ['leaf', 'herb', 'plant', 'nature', 'green', 'organic'],
  organic: ['leaf', 'herb', 'plant', 'nature', 'green'],
  herbal: ['leaf', 'herb', 'plant', 'nature', 'green'],
  ayurvedic: ['leaf', 'herb', 'plant', 'nature', 'ancient'],
  turmeric: ['golden', 'warm', 'spice', 'glow', 'yellow'],
  coconut: ['brown', 'tropical', 'smooth', 'natural'],
  honey: ['golden', 'sweet', 'warm', 'natural', 'glow'],
  rose: ['pink', 'floral', 'soft', 'elegant'],
  jasmine: ['white', 'floral', 'soft', 'fresh'],
  lavender: ['purple', 'floral', 'calm', 'soothe'],
  aloe: ['green', 'cool', 'soothe', 'hydrate'],
  vitamin: ['bright', 'boost', 'energy', 'glow'],
  collagen: ['smooth', 'firm', 'elastic', 'glow'],
  serum: ['liquid', 'drop', 'shine', 'glow'],
  soap: ['bubble', 'clean', 'fresh', 'wash'],
  sanitizer: ['clean', 'shield', 'protect', 'bright'],
  lotion: ['smooth', 'soft', 'silky', 'glow'],
  body: ['wave', 'smooth', 'flow', 'care'],
  face: ['circle', 'round', 'glow', 'care'],
  hair: ['wave', 'flow', 'shine', 'strong'],
  teeth: ['bright', 'shine', 'white', 'smile'],
  dental: ['bright', 'shine', 'white', 'smile'],
  whitening: ['bright', 'shine', 'white', 'glow'],
  anti: ['shield', 'protect', 'strong', 'care'],
  aging: ['glow', 'youth', 'smooth', 'firm'],
  acne: ['clear', 'clean', 'bright', 'smooth'],
  sensitive: ['soft', 'gentle', 'calm', 'care'],
  luxury: ['premium', 'gold', 'elegant', 'shine'],
  premium: ['gold', 'elegant', 'shine', 'luxury'],
};

const shapesByKeyword: Record<string, string> = {
  leaf: '🍃',
  herb: '🌿',
  plant: '🌱',
  nature: '🌿',
  green: '🍃',
  wave: '〰',
  water: '💧',
  flow: '〰',
  clean: '✨',
  drop: '💧',
  liquid: '💧',
  shine: '✨',
  glow: '✨',
  sun: '☀',
  shield: '🛡',
  protect: '🛡',
  bright: '✨',
  golden: '✨',
  warm: '🔥',
  spice: '✨',
  yellow: '✨',
  brown: '✨',
  tropical: '🌴',
  smooth: '〰',
  pink: '💕',
  floral: '🌸',
  soft: '〰',
  elegant: '✨',
  white: '◯',
  cool: '❄',
  soothe: '〰',
  hydrate: '💧',
  boost: '⚡',
  energy: '⚡',
  bubble: '◯',
  fresh: '✨',
  wash: '〰',
  silky: '〰',
  care: '♥',
  circle: '◯',
  round: '◯',
  strong: '💪',
  smile: '✨',
  youth: '✨',
  firm: '💪',
  clear: '✨',
  calm: '〰',
  gold: '✨',
  luxury: '✨',
  premium: '✨',
  organic: '🌿',
};

export const generateContextualElements = (
  headline: string,
  palette: ColorPalette
): Array<{ type: string; content: string; color: string }> => {
  const headlineLower = headline.toLowerCase();
  const elements: Array<{ type: string; content: string; color: string }> = [];

  const foundKeywords = new Set<string>();

  Object.keys(productKeywords).forEach((keyword) => {
    if (headlineLower.includes(keyword)) {
      productKeywords[keyword].forEach((related) => {
        foundKeywords.add(related);
      });
      foundKeywords.add(keyword);
    }
  });

  const uniqueKeywords = Array.from(foundKeywords).slice(0, 3);

  uniqueKeywords.forEach((keyword) => {
    const emoji = shapesByKeyword[keyword] || '✨';
    const colors = [palette.primary, palette.secondary, palette.accent];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    elements.push({
      type: 'emoji',
      content: emoji,
      color: randomColor,
    });
  });

  if (elements.length === 0) {
    elements.push({
      type: 'emoji',
      content: '✨',
      color: palette.primary,
    });
  }

  return elements;
};
