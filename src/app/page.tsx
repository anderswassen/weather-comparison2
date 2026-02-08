'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ComparisonDashboard } from '@/components/ComparisonDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserGuide } from '@/components/UserGuide';
import { useWeatherComparison } from '@/hooks/useWeatherComparison';
import { GeocodeResult } from '@/lib/types';

// Dynamically import the map to avoid SSR issues with Leaflet
const LocationMap = dynamic(
  () => import('@/components/LocationMap').then((mod) => mod.LocationMap),
  { ssr: false, loading: () => <div className="h-full min-h-[300px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" /> }
);

function buildShareUrl(loc1: GeocodeResult, loc2: GeocodeResult): string {
  const params = new URLSearchParams({
    loc1: loc1.name,
    lat1: loc1.coordinates.lat.toString(),
    lon1: loc1.coordinates.lon.toString(),
    loc2: loc2.name,
    lat2: loc2.coordinates.lat.toString(),
    lon2: loc2.coordinates.lon.toString(),
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedLocation1, setSelectedLocation1] = useState<GeocodeResult | null>(null);
  const [selectedLocation2, setSelectedLocation2] = useState<GeocodeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { location1, location2, isLoading, error, compare } = useWeatherComparison();

  const handleCompare = useCallback(() => {
    if (selectedLocation1 && selectedLocation2) {
      compare(selectedLocation1, selectedLocation2);
      window.history.replaceState(null, '', buildShareUrl(selectedLocation1, selectedLocation2));
    }
  }, [selectedLocation1, selectedLocation2, compare]);

  // Parse URL params on mount and auto-trigger comparison
  useEffect(() => {
    const loc1 = searchParams.get('loc1');
    const lat1 = searchParams.get('lat1');
    const lon1 = searchParams.get('lon1');
    const loc2 = searchParams.get('loc2');
    const lat2 = searchParams.get('lat2');
    const lon2 = searchParams.get('lon2');

    if (loc1 && lat1 && lon1 && loc2 && lat2 && lon2) {
      const parsedLat1 = parseFloat(lat1);
      const parsedLon1 = parseFloat(lon1);
      const parsedLat2 = parseFloat(lat2);
      const parsedLon2 = parseFloat(lon2);

      if ([parsedLat1, parsedLon1, parsedLat2, parsedLon2].every((v) => !isNaN(v))) {
        const geocode1: GeocodeResult = {
          placeId: 0,
          name: loc1,
          displayName: loc1,
          coordinates: { lat: parsedLat1, lon: parsedLon1 },
        };
        const geocode2: GeocodeResult = {
          placeId: 0,
          name: loc2,
          displayName: loc2,
          coordinates: { lat: parsedLat2, lon: parsedLon2 },
        };
        setSelectedLocation1(geocode1);
        setSelectedLocation2(geocode2);
        compare(geocode1, geocode2);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    if (selectedLocation1 && selectedLocation2) {
      const url = buildShareUrl(selectedLocation1, selectedLocation2);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canCompare = selectedLocation1 && selectedLocation2 && !isLoading;
  const showShareButton = location1 && location2 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="relative mb-8 text-center">
          <div className="absolute right-0 top-0 flex items-center gap-1">
            <UserGuide />
            <ThemeToggle />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">Weather Compare</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare weather forecasts for two Swedish locations
          </p>
        </header>

        <div className="mb-8 grid gap-6 lg:grid-cols-5">
          {/* Location inputs - narrower */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <LocationAutocomplete
                label="First Location"
                placeholder="Search for a location..."
                selectedLocation={selectedLocation1}
                onSelect={setSelectedLocation1}
                disabled={isLoading}
              />
              <LocationAutocomplete
                label="Second Location"
                placeholder="Search for a location..."
                selectedLocation={selectedLocation2}
                onSelect={setSelectedLocation2}
                disabled={isLoading}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCompare}
                disabled={!canCompare}
                className="flex-1 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 dark:focus:ring-offset-gray-800"
              >
                {isLoading ? 'Loading...' : 'Compare Weather'}
              </button>
              {showShareButton && (
                <button
                  onClick={handleShare}
                  className="rounded-lg border border-blue-600 px-4 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:focus:ring-offset-gray-800"
                >
                  {copied ? 'Copied!' : 'Share'}
                </button>
              )}
            </div>
          </div>

          {/* Map - wider */}
          <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800 lg:col-span-3">
            <LocationMap location1={selectedLocation1} location2={selectedLocation2} />
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading && <LoadingSpinner message="Fetching weather data..." />}

        {location1 && location2 && !isLoading && (
          <ComparisonDashboard location1={location1} location2={location2} />
        )}

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Weather data provided by{' '}
            <a
              href="https://www.smhi.se/data/oppna-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              SMHI
            </a>
            . Geocoding by{' '}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              OpenStreetMap
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-slate-900" />}>
      <HomeContent />
    </Suspense>
  );
}
