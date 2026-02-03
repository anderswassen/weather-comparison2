import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Query parameters "lat" and "lon" are required' },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
  }

  // SMHI PMP3g API endpoint for point forecasts
  const smhiUrl = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lonNum}/lat/${latNum}/data.json`;

  try {
    const response = await fetch(smhiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Location not found or outside SMHI coverage area' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `SMHI API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
