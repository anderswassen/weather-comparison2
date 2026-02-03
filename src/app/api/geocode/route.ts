import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const format = searchParams.get('format') || 'json';
  const countrycodes = searchParams.get('countrycodes') || 'se';
  const limit = searchParams.get('limit') || '1';

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Failed to geocode location' }, { status: 500 });
  }
}
