'use client';

import { format } from 'date-fns';
import { LocationWeather } from '@/lib/types';
import { WeatherIcon, getWeatherLabel } from './WeatherIcon';
import { useLanguage } from '@/context/LanguageContext';

interface DailyForecastStripProps {
  location1: LocationWeather;
  location2: LocationWeather;
}

export function DailyForecastStrip({ location1, location2 }: DailyForecastStripProps) {
  const { language } = useLanguage();
  const days = location1.weatherData;
  const days2 = location2.weatherData;

  // Only render if we have weather symbols
  const hasSymbols = days.some((d) => d.weatherSymbol != null);
  if (!hasSymbols) return null;

  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-0">
          {days.map((day, i) => {
            const day2 = days2[i];
            const sym1 = day.weatherSymbol;
            const sym2 = day2?.weatherSymbol;
            const high1 = day.temperatureMax ?? day.temperature;
            const low1 = day.temperatureMin ?? day.temperature;
            const high2 = day2?.temperatureMax ?? day2?.temperature;
            const low2 = day2?.temperatureMin ?? day2?.temperature;

            return (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1 px-2 py-1"
              >
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {format(day.date, 'EEE')}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {format(day.date, 'MMM d')}
                </span>

                {/* Location 1 */}
                <div className="flex flex-col items-center" title={sym1 ? getWeatherLabel(sym1, language) : undefined}>
                  <div className="flex h-5 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>
                  {sym1 ? (
                    <WeatherIcon symbol={sym1} size={28} />
                  ) : (
                    <div className="h-7 w-7" />
                  )}
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    {high1}° <span className="text-gray-400">{low1}°</span>
                  </span>
                </div>

                {/* Location 2 */}
                <div className="flex flex-col items-center" title={sym2 ? getWeatherLabel(sym2, language) : undefined}>
                  <div className="flex h-5 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  {sym2 ? (
                    <WeatherIcon symbol={sym2} size={28} />
                  ) : (
                    <div className="h-7 w-7" />
                  )}
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    {high2 != null ? `${high2}°` : ''} <span className="text-gray-400">{low2 != null ? `${low2}°` : ''}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
