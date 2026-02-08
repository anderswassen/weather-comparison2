'use client';

import { LocationWeather } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherSummaryCardsProps {
  location1: LocationWeather;
  location2: LocationWeather;
}

function computeStats(location: LocationWeather) {
  const data = location.weatherData;
  const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
  const maxWind = Math.max(...data.map((d) => d.windSpeed));
  const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
  const totalPrecip = data.reduce((sum, d) => sum + d.precipitation, 0);

  return {
    avgTemp: Math.round(avgTemp * 10) / 10,
    maxWind: Math.round(maxWind * 10) / 10,
    avgHumidity: Math.round(avgHumidity),
    totalPrecip: Math.round(totalPrecip * 10) / 10,
  };
}

type MetricKey = 'avgTemp' | 'maxWind' | 'avgHumidity' | 'totalPrecip';

interface CardConfig {
  key: MetricKey;
  labelKey: string;
  unit: string;
  // 'higher' = higher value is highlighted, 'lower' = lower value is highlighted, 'none' = no highlight
  highlight: 'higher' | 'lower' | 'none';
}

const cards: CardConfig[] = [
  { key: 'avgTemp', labelKey: 'summary.avgTemp', unit: '°C', highlight: 'higher' },
  { key: 'maxWind', labelKey: 'summary.maxWind', unit: 'm/s', highlight: 'lower' },
  { key: 'avgHumidity', labelKey: 'summary.avgHumidity', unit: '%', highlight: 'none' },
  { key: 'totalPrecip', labelKey: 'summary.totalPrecip', unit: 'mm', highlight: 'lower' },
];

export function WeatherSummaryCards({ location1, location2 }: WeatherSummaryCardsProps) {
  const { t } = useLanguage();
  const stats1 = computeStats(location1);
  const stats2 = computeStats(location2);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const val1 = stats1[card.key];
        const val2 = stats2[card.key];

        let bold1 = false;
        let bold2 = false;

        if (card.highlight === 'higher') {
          if (val1 > val2) bold1 = true;
          else if (val2 > val1) bold2 = true;
        } else if (card.highlight === 'lower') {
          if (val1 < val2) bold1 = true;
          else if (val2 < val1) bold2 = true;
        }

        return (
          <div
            key={card.key}
            className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800"
          >
            <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              {t(card.labelKey)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span
                  className={`text-sm text-gray-700 dark:text-gray-300 ${bold1 ? 'font-bold' : ''}`}
                >
                  {val1} {card.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span
                  className={`text-sm text-gray-700 dark:text-gray-300 ${bold2 ? 'font-bold' : ''}`}
                >
                  {val2} {card.unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
