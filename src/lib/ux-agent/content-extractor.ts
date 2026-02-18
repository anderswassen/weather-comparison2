import { UXCategory, ExtractedInsight } from './types';

/**
 * Keyword dictionaries for categorizing UX content.
 */
const CATEGORY_KEYWORDS: Record<UXCategory, string[]> = {
  navigation: [
    'navigation', 'menu', 'breadcrumb', 'wayfinding', 'sitemap',
    'back button', 'tab bar', 'hamburger', 'search', 'routing',
    'user flow', 'information architecture',
  ],
  accessibility: [
    'aria', 'wcag', 'screen reader', 'keyboard', 'alt text',
    'contrast', 'focus', 'semantic', 'assistive', 'disability',
    'inclusive', 'a11y',
  ],
  'visual-design': [
    'typography', 'whitespace', 'color palette', 'hierarchy',
    'grid', 'spacing', 'layout', 'design system', 'dark mode',
    'theme', 'branding', 'visual',
  ],
  performance: [
    'lazy load', 'code splitting', 'cache', 'render', 'bundle',
    'lighthouse', 'core web vitals', 'performance', 'speed',
    'optimization', 'streaming',
  ],
  mobile: [
    'responsive', 'touch target', 'viewport', 'mobile first',
    'breakpoint', 'swipe', 'tap', 'phone', 'tablet',
    'adaptive', 'gesture',
  ],
  'data-visualization': [
    'chart', 'graph', 'tooltip', 'axis', 'legend',
    'data visualization', 'dashboard', 'plot', 'infographic',
    'd3', 'visualization',
  ],
};

/**
 * Parse an RSS feed XML string into article entries.
 * Uses simple regex parsing to avoid external dependencies.
 */
export function parseRSSFeed(
  xml: string,
): Array<{ title: string; link: string; description: string }> {
  const items: Array<{ title: string; link: string; description: string }> = [];

  // Match <item> blocks
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemContent = itemMatch[1];

    const title = extractTag(itemContent, 'title');
    const link = extractTag(itemContent, 'link');
    const description = stripHTML(
      extractTag(itemContent, 'description'),
    );

    if (title && link) {
      items.push({ title, link, description: description || '' });
    }
  }

  // Also try Atom <entry> format
  if (items.length === 0) {
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
    let entryMatch;

    while ((entryMatch = entryRegex.exec(xml)) !== null) {
      const entryContent = entryMatch[1];

      const title = extractTag(entryContent, 'title');
      const linkMatch = entryContent.match(
        /<link[^>]*href=["']([^"']+)["'][^>]*\/?>/,
      );
      const link = linkMatch?.[1] || extractTag(entryContent, 'link');
      const description = stripHTML(
        extractTag(entryContent, 'summary') ||
        extractTag(entryContent, 'content'),
      );

      if (title && link) {
        items.push({ title, link, description: description || '' });
      }
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    'i',
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular content
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract UX insights from text content using keyword matching.
 */
export function extractInsightsFromText(
  articles: Array<{ title: string; link: string; description: string }>,
  sourceReliability: number,
): ExtractedInsight[] {
  const insights: ExtractedInsight[] = [];

  for (const article of articles) {
    const fullText = `${article.title} ${article.description}`.toLowerCase();

    // Score each category by keyword matches
    let bestCategory: UXCategory | null = null;
    let bestScore = 0;
    const matchedTags: string[] = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (fullText.includes(keyword)) {
          score += keyword.length;
          matchedTags.push(keyword);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category as UXCategory;
      }
    }

    // Only include if there's a meaningful category match
    if (bestCategory && bestScore >= 8) {
      insights.push({
        text: article.description.slice(0, 300),
        category: bestCategory,
        confidence: Math.min(sourceReliability * (bestScore / 30), 1.0),
        tags: [...new Set(matchedTags)].slice(0, 5),
        sourceUrl: article.link,
        title: article.title,
      });
    }
  }

  return insights;
}
