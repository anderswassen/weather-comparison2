import { CuratedSource } from './types';

/**
 * Curated UX resource URLs for web research.
 * Each source has a reliability score used for confidence weighting.
 */
export const CURATED_SOURCES: CuratedSource[] = [
  {
    name: 'Nielsen Norman Group',
    baseUrl: 'https://www.nngroup.com',
    rssUrl: 'https://www.nngroup.com/feed/rss/',
    categories: ['navigation', 'accessibility', 'mobile'],
    reliability: 0.95,
  },
  {
    name: 'Smashing Magazine',
    baseUrl: 'https://www.smashingmagazine.com',
    rssUrl: 'https://www.smashingmagazine.com/feed/',
    categories: ['visual-design', 'accessibility', 'performance'],
    reliability: 0.85,
  },
  {
    name: 'web.dev',
    baseUrl: 'https://web.dev',
    rssUrl: 'https://web.dev/feed.xml',
    categories: ['performance', 'accessibility', 'mobile'],
    reliability: 0.90,
  },
  {
    name: 'A List Apart',
    baseUrl: 'https://alistapart.com',
    rssUrl: 'https://alistapart.com/main/feed/',
    categories: ['visual-design', 'accessibility', 'navigation'],
    reliability: 0.85,
  },
  {
    name: 'CSS-Tricks',
    baseUrl: 'https://css-tricks.com',
    rssUrl: 'https://css-tricks.com/feed/',
    categories: ['visual-design', 'performance', 'mobile'],
    reliability: 0.80,
  },
];
