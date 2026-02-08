'use client';

import { useMemo } from 'react';
import { LocationWeather } from '@/lib/types';
import { generateInsights, Insight } from '@/lib/insights';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherInsightsProps {
  location1: LocationWeather;
  location2: LocationWeather;
}

export function WeatherInsights({ location1, location2 }: WeatherInsightsProps) {
  const { t } = useLanguage();
  const insights = useMemo(
    () => generateInsights(location1, location2),
    [location1, location2],
  );

  function resolveText(key: string, params: Record<string, string>): string {
    const resolved: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      // If the value looks like {some.translation.key}, resolve it
      const match = v.match(/^\{(.+)\}$/);
      resolved[k] = match ? t(match[1]) : v;
    }
    return t(key, resolved);
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {t('insights.title')}
      </h3>
      {insights.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('insights.noInsights')}
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight: Insight) => (
            <div key={insight.id} className="flex gap-3">
              <span className="text-2xl leading-tight">{insight.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {resolveText(insight.headlineKey, insight.headlineParams)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {resolveText(insight.descriptionKey, insight.descriptionParams)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
