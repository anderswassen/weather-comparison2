'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ComparisonDashboard } from '@/components/ComparisonDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherComparison } from '@/hooks/useWeatherComparison';
import { GeocodeResult } from '@/lib/types';

// Dynamically import the map to avoid SSR issues with Leaflet
const LocationMap = dynamic(
  () => import('@/components/LocationMap').then((mod) => mod.LocationMap),
  { ssr: false, loading: () => <div className="h-full min-h-[300px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" /> }
);

export default function Home() {
  const [selectedLocation1, setSelectedLocation1] = useState<GeocodeResult | null>(null);
  const [selectedLocation2, setSelectedLocation2] = useState<GeocodeResult | null>(null);
  const { location1, location2, isLoading, error, compare } = useWeatherComparison();

  const handleCompare = () => {
    if (selectedLocation1 && selectedLocation2) {
      compare(selectedLocation1, selectedLocation2);
    }
  };

  const canCompare = selectedLocation1 && selectedLocation2 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="relative mb-8 text-center">
          <div className="absolute right-0 top-0">
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
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCompare}
                disabled={!canCompare}
                className="w-full rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 dark:focus:ring-offset-gray-800"
              >
                {isLoading ? 'Loading...' : 'Compare Weather'}
              </button>
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
