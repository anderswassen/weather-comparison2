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
import { LocationWeather } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';

interface WeatherChartProps {
  location1: LocationWeather;
  location2: LocationWeather;
  metric: 'temperature' | 'windSpeed' | 'humidity' | 'precipitation';
  title: string;
  unit: string;
}

const metricLabels = {
  temperature: 'Temperature',
  windSpeed: 'Wind Speed',
  humidity: 'Humidity',
  precipitation: 'Precipitation',
};

export function WeatherChart({ location1, location2, metric, title, unit }: WeatherChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-aware colors
  const gridStroke = isDark ? '#374151' : '#e5e7eb';
  const axisStroke = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1f2937' : 'white';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';

  // Combine data from both locations for the chart
  const chartData = location1.weatherData.map((point, index) => {
    const loc2Point = location2.weatherData[index];
    return {
      date: format(point.date, 'MMM d'),
      [location1.locationName]: point[metric],
      [location2.locationName]: loc2Point ? loc2Point[metric] : null,
    };
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
            <Legend wrapperStyle={{ color: isDark ? '#f3f4f6' : '#1f2937' }} />
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
