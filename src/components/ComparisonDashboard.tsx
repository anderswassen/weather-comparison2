'use client';

import { useState, useRef } from 'react';
import { LocationWeather, WeatherDataPoint } from '@/lib/types';
import { WeatherChart } from './WeatherChart';
import { useLanguage } from '@/context/LanguageContext';

interface ComparisonDashboardProps {
  location1: LocationWeather;
  location2: LocationWeather;
  historicalLocation1: WeatherDataPoint[] | null;
  historicalLocation2: WeatherDataPoint[] | null;
  isLoadingHistorical: boolean;
  fetchHistorical: () => Promise<void>;
}

export function ComparisonDashboard({
  location1,
  location2,
  historicalLocation1,
  historicalLocation2,
  isLoadingHistorical,
  fetchHistorical,
}: ComparisonDashboardProps) {
  const { t } = useLanguage();
  const [showHistorical, setShowHistorical] = useState(false);
  const historicalFetched = useRef(false);

  const handleToggleHistorical = () => {
    const newValue = !showHistorical;
    setShowHistorical(newValue);

    if (newValue && !historicalFetched.current) {
      historicalFetched.current = true;
      fetchHistorical();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{location1.locationName}</span>
        </div>
        <span className="text-gray-400">{t('comparison.vs')}</span>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{location2.locationName}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showHistorical}
            onChange={handleToggleHistorical}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('comparison.showHistorical')}
          </span>
        </label>
        {isLoadingHistorical && (
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('comparison.loadingHistorical')}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="temperature"
          title={t('comparison.temperature')}
          unit="°C"
          historicalLocation1={showHistorical ? historicalLocation1 : undefined}
          historicalLocation2={showHistorical ? historicalLocation2 : undefined}
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="windSpeed"
          title={t('comparison.windSpeed')}
          unit="m/s"
          historicalLocation1={showHistorical ? historicalLocation1 : undefined}
          historicalLocation2={showHistorical ? historicalLocation2 : undefined}
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="humidity"
          title={t('comparison.humidity')}
          unit="%"
          historicalLocation1={showHistorical ? historicalLocation1 : undefined}
          historicalLocation2={showHistorical ? historicalLocation2 : undefined}
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="precipitation"
          title={t('comparison.precipitation')}
          unit="mm"
          historicalLocation1={showHistorical ? historicalLocation1 : undefined}
          historicalLocation2={showHistorical ? historicalLocation2 : undefined}
        />
      </div>
    </div>
  );
}
