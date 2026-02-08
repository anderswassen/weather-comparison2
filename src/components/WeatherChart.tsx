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
  const isDark = theme === 'dark';

  // Theme-aware colors
  const gridStroke = isDark ? '#374151' : '#e5e7eb';
  const axisStroke = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1f2937' : 'white';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

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
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            />
            <Legend content={renderCustomLegend} />
            <Line
              type="monotone"
              dataKey={location1.locationName}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey={location2.locationName}
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
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
