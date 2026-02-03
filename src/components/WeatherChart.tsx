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
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {title} ({unit})
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
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
