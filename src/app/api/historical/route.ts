import { NextRequest, NextResponse } from 'next/server';
import { fetchHistoricalData } from '@/lib/smhi-historical';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!lat || !lon || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Query parameters "lat", "lon", "startDate", and "endDate" are required' },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return NextResponse.json({ error: 'Dates must be in YYYY-MM-DD format' }, { status: 400 });
  }

  try {
    const data = await fetchHistoricalData({ lat: latNum, lon: lonNum }, startDate, endDate);

    // Serialize dates to ISO strings for JSON transport
    const serialized = data.map((point) => ({
      ...point,
      date: point.date.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Historical data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch historical weather data' }, { status: 500 });
  }
}
