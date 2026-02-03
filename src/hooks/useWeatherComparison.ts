'use client';

import { useState, useCallback } from 'react';
import { fetchWeatherData, aggregateDailyData } from '@/lib/smhi';
import { LocationWeather, GeocodeResult } from '@/lib/types';

interface UseWeatherComparisonResult {
  location1: LocationWeather | null;
  location2: LocationWeather | null;
  isLoading: boolean;
  error: string | null;
  compare: (loc1: GeocodeResult, loc2: GeocodeResult) => Promise<void>;
}

export function useWeatherComparison(): UseWeatherComparisonResult {
  const [location1, setLocation1] = useState<LocationWeather | null>(null);
  const [location2, setLocation2] = useState<LocationWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = useCallback(async (loc1: GeocodeResult, loc2: GeocodeResult) => {
    setIsLoading(true);
    setError(null);
    setLocation1(null);
    setLocation2(null);

    try {
      // Fetch weather data for both locations in parallel
      const [weather1, weather2] = await Promise.all([
        fetchWeatherData(loc1.coordinates),
        fetchWeatherData(loc2.coordinates),
      ]);

      // Aggregate to daily data
      const dailyWeather1 = aggregateDailyData(weather1);
      const dailyWeather2 = aggregateDailyData(weather2);

      setLocation1({
        locationName: loc1.name,
        coordinates: loc1.coordinates,
        weatherData: dailyWeather1,
      });

      setLocation2({
        locationName: loc2.name,
        coordinates: loc2.coordinates,
        weatherData: dailyWeather2,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    location1,
    location2,
    isLoading,
    error,
    compare,
  };
}
