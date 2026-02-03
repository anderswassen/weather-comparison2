import { Coordinates, GeocodeResult } from './types';

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

function parseNominatimResult(result: NominatimResponse): GeocodeResult {
  return {
    placeId: result.place_id,
    name: result.name,
    displayName: result.display_name,
    coordinates: {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    },
  };
}

export async function searchLocations(query: string, limit: number = 30): Promise<GeocodeResult[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    countrycodes: 'se',
    limit: limit.toString(),
  });

  const response = await fetch(`/api/geocode?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data: NominatimResponse[] = await response.json();
  return data.map(parseNominatimResult);
}

export async function geocodeLocation(locationName: string): Promise<GeocodeResult | null> {
  const results = await searchLocations(locationName, 1);
  return results.length > 0 ? results[0] : null;
}

export function isWithinSweden(coordinates: Coordinates): boolean {
  // Approximate bounding box for Sweden
  const swedenBounds = {
    minLat: 55.0,
    maxLat: 69.5,
    minLon: 10.5,
    maxLon: 24.5,
  };

  return (
    coordinates.lat >= swedenBounds.minLat &&
    coordinates.lat <= swedenBounds.maxLat &&
    coordinates.lon >= swedenBounds.minLon &&
    coordinates.lon <= swedenBounds.maxLon
  );
}
