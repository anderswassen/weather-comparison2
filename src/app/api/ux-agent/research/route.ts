import { NextRequest, NextResponse } from 'next/server';
import { CURATED_SOURCES } from '@/lib/ux-agent/curated-sources';
import {
  parseRSSFeed,
  extractInsightsFromText,
} from '@/lib/ux-agent/content-extractor';
import {
  addKnowledgeEntries,
  logResearch,
} from '@/lib/ux-agent/knowledge-manager';
import { UXKnowledgeEntry, WebResearchResult } from '@/lib/ux-agent/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryFilter = searchParams.get('category') || undefined;

    const results: WebResearchResult[] = [];

    // Filter sources by category if specified
    const sources = categoryFilter
      ? CURATED_SOURCES.filter((s) =>
          s.categories.includes(categoryFilter as never),
        )
      : CURATED_SOURCES;

    // Fetch RSS feeds in parallel
    const fetchPromises = sources
      .filter((source) => source.rssUrl)
      .map(async (source) => {
        try {
          const response = await fetch(source.rssUrl!, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'User-Agent': 'WeatherCompare-UXAgent/1.0',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const xml = await response.text();
          const articles = parseRSSFeed(xml).slice(0, 10); // Limit to 10 per source
          const insights = extractInsightsFromText(
            articles,
            source.reliability,
          );

          // Convert insights to knowledge entries
          const entries: UXKnowledgeEntry[] = insights.map((insight) => ({
            id: `web-${Buffer.from(insight.sourceUrl).toString('base64url').slice(0, 20)}`,
            category: insight.category,
            title: insight.title,
            description: insight.text,
            source: 'web-research' as const,
            sourceUrl: insight.sourceUrl,
            confidence: insight.confidence,
            dateAdded: new Date().toISOString(),
            tags: insight.tags,
            actionable: false,
          }));

          const added = await addKnowledgeEntries(entries);
          await logResearch(source.name, 'success', insights.length);

          const result: WebResearchResult = {
            source: source.name,
            insights,
            status: 'success',
          };
          return result;
        } catch (error) {
          await logResearch(source.name, 'failed', 0);
          const result: WebResearchResult = {
            source: source.name,
            insights: [],
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          return result;
        }
      });

    const settled = await Promise.all(fetchPromises);
    results.push(...settled);

    const totalInsights = results.reduce(
      (sum, r) => sum + r.insights.length,
      0,
    );
    const successCount = results.filter((r) => r.status === 'success').length;

    return NextResponse.json({
      results,
      summary: {
        sourcesQueried: results.length,
        sourcesSucceeded: successCount,
        totalInsights,
      },
    });
  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: 'Research failed' },
      { status: 500 },
    );
  }
}
