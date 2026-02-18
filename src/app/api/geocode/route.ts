import { NextRequest, NextResponse } from 'next/server';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 200;

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  // Evict oldest entries if at capacity
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const format = searchParams.get('format') || 'json';
  const countrycodes = searchParams.get('countrycodes') || 'se';
  const limit = searchParams.get('limit') || '1';

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const cacheKey = `${q.toLowerCase()}:${countrycodes}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
  nominatimUrl.searchParams.set('q', q);
  nominatimUrl.searchParams.set('format', format);
  nominatimUrl.searchParams.set('countrycodes', countrycodes);
  nominatimUrl.searchParams.set('limit', limit);

  try {
    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'WeatherCompareApp/1.0 (weather-compare-app)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nominatim API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    setCache(cacheKey, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Failed to geocode location' }, { status: 500 });
  }
}
