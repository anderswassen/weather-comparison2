'use client';

import { LocationWeather } from '@/lib/types';
import { WeatherChart } from './WeatherChart';

interface ComparisonDashboardProps {
  location1: LocationWeather;
  location2: LocationWeather;
}

export function ComparisonDashboard({ location1, location2 }: ComparisonDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{location1.locationName}</span>
        </div>
        <span className="text-gray-400">vs</span>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{location2.locationName}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="temperature"
          title="Temperature"
          unit="°C"
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="windSpeed"
          title="Wind Speed"
          unit="m/s"
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="humidity"
          title="Humidity"
          unit="%"
        />
        <WeatherChart
          location1={location1}
          location2={location2}
          metric="precipitation"
          title="Precipitation"
          unit="mm"
        />
      </div>
    </div>
  );
}
