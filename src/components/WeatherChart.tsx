'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { LocationWeather, WeatherDataPoint } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherChartProps {
  location1: LocationWeather;
  location2: LocationWeather;
  metric: 'temperature' | 'windSpeed' | 'humidity' | 'precipitation';
  title: string;
  unit: string;
  historicalLocation1?: WeatherDataPoint[] | null;
  historicalLocation2?: WeatherDataPoint[] | null;
}

function hasNonZeroMetric(data: WeatherDataPoint[], metric: string): boolean {
  return data.some((p) => p[metric as keyof WeatherDataPoint] !== 0);
}

const CARDINAL_KEYS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

function degreesToCardinalKey(deg: number): (typeof CARDINAL_KEYS)[number] {
  const index = Math.round(deg / 45) % 8;
  return CARDINAL_KEYS[index];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WindDirectionDot({ cx, cy, payload, color, dirKey }: any) {
  if (cx == null || cy == null) return null;
  const dir = payload?.[dirKey] as number | null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill={color} stroke={color} strokeWidth={2} />
      {dir != null && (
        <g transform={`translate(${cx}, ${cy}) rotate(${dir})`}>
          <line x1={0} y1={-6} x2={0} y2={-15} stroke={color} strokeWidth={1.5} opacity={0.7} />
          <polygon points="0,-16.5 -2.5,-12.5 2.5,-12.5" fill={color} opacity={0.7} />
        </g>
      )}
    </g>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLegend(props: any) {
  const payload = props?.payload as Array<{
    value: string;
    color?: string;
    payload?: { strokeDasharray?: string; strokeOpacity?: number; stroke?: string };
  }> | undefined;
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
      {payload.map((entry) => {
        const isDashed = entry.payload?.strokeDasharray;
        const color = entry.payload?.stroke || entry.color || '#666';
        const opacity = entry.payload?.strokeOpacity ?? 1;

        return (
          <span key={entry.value} className="flex items-center gap-1.5">
            <svg width="20" height="10" className="shrink-0">
              <line
                x1="0" y1="5" x2="20" y2="5"
                stroke={color}
                strokeWidth={isDashed ? 1.5 : 2}
                strokeDasharray={isDashed ? '4 3' : undefined}
                strokeOpacity={opacity}
              />
            </svg>
            <span style={{ opacity }}>{entry.value}</span>
          </span>
        );
      })}
    </div>
  );
}

export function WeatherChart({
  location1,
  location2,
  metric,
  title,
  unit,
  historicalLocation1,
  historicalLocation2,
}: WeatherChartProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  // Theme-aware colors
  const gridStroke = isDark ? '#374151' : '#e5e7eb';
  const axisStroke = isDark ? '#9ca3af' : '#6b7280';

  function getComparisonLabel(diff: number, metricType: typeof metric): string {
    const absDiff = Math.abs(diff).toFixed(1);
    if (metricType === 'temperature') {
      return `${absDiff}${unit} ${diff >= 0 ? t('tooltip.warmer') : t('tooltip.cooler')}`;
    }
    if (metricType === 'windSpeed') {
      return `${absDiff}${unit} ${diff >= 0 ? t('tooltip.stronger') : t('tooltip.weaker')}`;
    }
    if (metricType === 'precipitation') {
      return `${absDiff}${unit} ${diff >= 0 ? t('tooltip.more') : t('tooltip.less')}`;
    }
    // humidity
    return `${absDiff}${unit} ${diff >= 0 ? t('tooltip.higher') : t('tooltip.lower')}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const loc1Entry = payload.find((p: any) => p.dataKey === location1.locationName);
    const loc2Entry = payload.find((p: any) => p.dataKey === location2.locationName);
    const val1 = loc1Entry?.value as number | undefined;
    const val2 = loc2Entry?.value as number | undefined;
    const windDir1 = payload[0]?.payload?._windDir1 as number | undefined;
    const windDir2 = payload[0]?.payload?._windDir2 as number | undefined;

    return (
      <div className={`rounded-lg border p-3 shadow-lg ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-200 bg-white text-gray-800'}`}>
        <p className="mb-2 text-sm font-semibold">{label}</p>

        {/* Current values */}
        {val1 != null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>
              {location1.locationName}: {val1}{unit}
              {metric === 'windSpeed' && windDir1 != null && (
                <span className="ml-1.5 text-gray-500 dark:text-gray-400">
                  <svg width="10" height="10" viewBox="0 0 10 10" className="mb-px inline-block" style={{ transform: `rotate(${windDir1}deg)` }}>
                    <polygon points="5,1 8,8 2,8" fill="#3b82f6" />
                  </svg>
                  {' '}{t(`compass.${degreesToCardinalKey(windDir1)}`)} {Math.round(windDir1)}°
                </span>
              )}
            </span>
          </div>
        )}
        {val2 != null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>
              {location2.locationName}: {val2}{unit}
              {metric === 'windSpeed' && windDir2 != null && (
                <span className="ml-1.5 text-gray-500 dark:text-gray-400">
                  <svg width="10" height="10" viewBox="0 0 10 10" className="mb-px inline-block" style={{ transform: `rotate(${windDir2}deg)` }}>
                    <polygon points="5,1 8,8 2,8" fill="#ef4444" />
                  </svg>
                  {' '}{t(`compass.${degreesToCardinalKey(windDir2)}`)} {Math.round(windDir2)}°
                </span>
              )}
            </span>
          </div>
        )}

        {/* Difference between locations */}
        {val1 != null && val2 != null && (
          <>
            <hr className={`my-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`} />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {location1.locationName}: {getComparisonLabel(val1 - val2, metric)}
            </p>
          </>
        )}

        {/* Historical comparisons */}
        {historicalYear && payload.length > 0 && (
          <>
            {(() => {
              const hist1Entry = hist1Key ? payload.find((p: any) => p.dataKey === hist1Key) : null;
              const hist2Entry = hist2Key ? payload.find((p: any) => p.dataKey === hist2Key) : null;
              const histVal1 = hist1Entry?.value as number | undefined;
              const histVal2 = hist2Entry?.value as number | undefined;
              const hasHistComparison = (val1 != null && histVal1 != null) || (val2 != null && histVal2 != null);

              if (!hasHistComparison) return null;

              return (
                <>
                  <hr className={`my-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`} />
                  {val1 != null && histVal1 != null && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {location1.locationName}: {getComparisonLabel(val1 - histVal1, metric)} {t('tooltip.thanYear', { year: String(historicalYear) })}
                    </p>
                  )}
                  {val2 != null && histVal2 != null && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {location2.locationName}: {getComparisonLabel(val2 - histVal2, metric)} {t('tooltip.thanYear', { year: String(historicalYear) })}
                    </p>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
    );
  }

  // Determine the historical year from the data
  const historicalYear = historicalLocation1?.[0]?.date
    ? historicalLocation1[0].date.getFullYear()
    : historicalLocation2?.[0]?.date
      ? historicalLocation2[0].date.getFullYear()
      : null;

  // Check if historical data has meaningful (non-zero) values for this metric
  const showHist1 = !!(
    historicalYear &&
    historicalLocation1 &&
    historicalLocation1.length > 0 &&
    hasNonZeroMetric(historicalLocation1, metric)
  );
  const showHist2 = !!(
    historicalYear &&
    historicalLocation2 &&
    historicalLocation2.length > 0 &&
    hasNonZeroMetric(historicalLocation2, metric)
  );

  // Short legend label: just the year
  const hist1Key = showHist1 ? `${location1.locationName} ${historicalYear}` : null;
  const hist2Key = showHist2 ? `${location2.locationName} ${historicalYear}` : null;

  // Combine data from both locations for the chart
  const chartData = location1.weatherData.map((point, index) => {
    const loc2Point = location2.weatherData[index];
    const entry: Record<string, string | number | null> = {
      date: format(point.date, 'MMM d'),
      [location1.locationName]: point[metric],
      [location2.locationName]: loc2Point ? loc2Point[metric] : null,
    };

    if (metric === 'windSpeed') {
      entry._windDir1 = point.windDirection ?? null;
      entry._windDir2 = loc2Point?.windDirection ?? null;
    }

    // Add historical data aligned by index (same calendar day, previous year)
    if (hist1Key && historicalLocation1 && index < historicalLocation1.length) {
      entry[hist1Key] = historicalLocation1[index][metric];
    }
    if (hist2Key && historicalLocation2 && index < historicalLocation2.length) {
      entry[hist2Key] = historicalLocation2[index][metric];
    }

    return entry;
  });

  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title} ({unit})
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: axisStroke }} stroke={axisStroke} />
            <YAxis tick={{ fontSize: 12, fill: axisStroke }} stroke={axisStroke} />
            <Tooltip content={CustomTooltip} />
            <Legend content={renderCustomLegend} />
            <Line
              type="monotone"
              dataKey={location1.locationName}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={metric === 'windSpeed'
                ? (props: any) => <WindDirectionDot key={`wd1-${props.index}`} {...props} color="#3b82f6" dirKey="_windDir1" />
                : { fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey={location2.locationName}
              stroke="#ef4444"
              strokeWidth={2}
              dot={metric === 'windSpeed'
                ? (props: any) => <WindDirectionDot key={`wd2-${props.index}`} {...props} color="#ef4444" dirKey="_windDir2" />
                : { fill: '#ef4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            {hist1Key && (
              <Line
                type="monotone"
                dataKey={hist1Key}
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
            {hist2Key && (
              <Line
                type="monotone"
                dataKey={hist2Key}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
