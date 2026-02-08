'use client';

import { useState, useCallback } from 'react';
import { fetchWeatherData, aggregateDailyData } from '@/lib/smhi';
import { LocationWeather, GeocodeResult, WeatherDataPoint } from '@/lib/types';

interface UseWeatherComparisonResult {
  location1: LocationWeather | null;
  location2: LocationWeather | null;
  isLoading: boolean;
  error: string | null;
  compare: (loc1: GeocodeResult, loc2: GeocodeResult) => Promise<void>;
  historicalLocation1: WeatherDataPoint[] | null;
  historicalLocation2: WeatherDataPoint[] | null;
  isLoadingHistorical: boolean;
  fetchHistorical: () => Promise<void>;
}

export function useWeatherComparison(): UseWeatherComparisonResult {
  const [location1, setLocation1] = useState<LocationWeather | null>(null);
  const [location2, setLocation2] = useState<LocationWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalLocation1, setHistoricalLocation1] = useState<WeatherDataPoint[] | null>(null);
  const [historicalLocation2, setHistoricalLocation2] = useState<WeatherDataPoint[] | null>(null);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);

  const compare = useCallback(async (loc1: GeocodeResult, loc2: GeocodeResult) => {
    setIsLoading(true);
    setError(null);
    setLocation1(null);
    setLocation2(null);
    // Clear historical data when new comparison starts
    setHistoricalLocation1(null);
    setHistoricalLocation2(null);

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
      const message = err instanceof Error ? err.message : 'ERROR_UNEXPECTED';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistorical = useCallback(async () => {
    if (!location1 || !location2) return;
    if (location1.weatherData.length === 0) return;

    setIsLoadingHistorical(true);

    try {
      // Compute date range from forecast data, shifted back 1 year
      const forecastDates = location1.weatherData.map((p) => p.date);
      const minDate = new Date(Math.min(...forecastDates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...forecastDates.map((d) => d.getTime())));

      const startDate = new Date(minDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      const endDate = new Date(maxDate);
      endDate.setFullYear(endDate.getFullYear() - 1);

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const [hist1, hist2] = await Promise.all([
        fetchHistoricalForLocation(location1.coordinates, startStr, endStr),
        fetchHistoricalForLocation(location2.coordinates, startStr, endStr),
      ]);

      setHistoricalLocation1(hist1);
      setHistoricalLocation2(hist2);
    } catch (err) {
      console.warn('Failed to fetch historical data:', err);
      // Non-blocking: historical data stays null
    } finally {
      setIsLoadingHistorical(false);
    }
  }, [location1, location2]);

  return {
    location1,
    location2,
    isLoading,
    error,
    compare,
    historicalLocation1,
    historicalLocation2,
    isLoadingHistorical,
    fetchHistorical,
  };
}

async function fetchHistoricalForLocation(
  coordinates: { lat: number; lon: number },
  startDate: string,
  endDate: string
): Promise<WeatherDataPoint[]> {
  const params = new URLSearchParams({
    lat: coordinates.lat.toString(),
    lon: coordinates.lon.toString(),
    startDate,
    endDate,
  });

  const response = await fetch(`/api/historical?${params.toString()}`);

  if (!response.ok) {
    console.warn(`Historical fetch failed for ${coordinates.lat},${coordinates.lon}: ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  return data.map((point: { date: string; temperature: number; windSpeed: number; humidity: number; precipitation: number }) => ({
    ...point,
    date: new Date(point.date),
  }));
}
