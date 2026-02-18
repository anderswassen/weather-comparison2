import { Coordinates, WeatherDataPoint, SMHIResponse, SMHITimeSeries } from './types';

function getParameterValue(timeSeries: SMHITimeSeries, paramName: string): number | null {
  const param = timeSeries.parameters.find((p) => p.name === paramName);
  return param ? param.values[0] : null;
}

export function parseWeatherData(data: SMHIResponse): WeatherDataPoint[] {
  const weatherPoints: WeatherDataPoint[] = [];

  for (const timeSeries of data.timeSeries) {
    const date = new Date(timeSeries.validTime);

    // Get weather parameters
    // t = temperature (Celsius)
    // ws = wind speed (m/s)
    // r = relative humidity (%)
    // pmean = mean precipitation (mm/h)
    const temperature = getParameterValue(timeSeries, 't');
    const windSpeed = getParameterValue(timeSeries, 'ws');
    const humidity = getParameterValue(timeSeries, 'r');
    const precipitation = getParameterValue(timeSeries, 'pmean');
    const windDirection = getParameterValue(timeSeries, 'wd');
    const weatherSymbol = getParameterValue(timeSeries, 'Wsymb2');

    if (temperature !== null && windSpeed !== null && humidity !== null && precipitation !== null) {
      weatherPoints.push({
        date,
        temperature,
        windSpeed,
        humidity,
        precipitation,
        windDirection: windDirection ?? undefined,
        weatherSymbol: weatherSymbol ?? undefined,
      });
    }
  }

  return weatherPoints;
}

export async function fetchWeatherData(coordinates: Coordinates): Promise<WeatherDataPoint[]> {
  const { lat, lon } = coordinates;

  // Round coordinates to 6 decimal places as required by SMHI API
  const roundedLat = Math.round(lat * 1000000) / 1000000;
  const roundedLon = Math.round(lon * 1000000) / 1000000;

  const response = await fetch(`/api/weather?lat=${roundedLat}&lon=${roundedLon}`);

  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.statusText}`);
  }

  const data: SMHIResponse = await response.json();
  return parseWeatherData(data);
}

export function circularMeanDegrees(degrees: number[]): number {
  const toRad = Math.PI / 180;
  let sinSum = 0;
  let cosSum = 0;
  for (const d of degrees) {
    sinSum += Math.sin(d * toRad);
    cosSum += Math.cos(d * toRad);
  }
  let mean = Math.atan2(sinSum / degrees.length, cosSum / degrees.length) * (180 / Math.PI);
  if (mean < 0) mean += 360;
  return Math.round(mean * 10) / 10;
}

export function aggregateDailyData(hourlyData: WeatherDataPoint[]): WeatherDataPoint[] {
  const dailyMap = new Map<string, WeatherDataPoint[]>();

  // Group by date
  for (const point of hourlyData) {
    const dateKey = point.date.toISOString().split('T')[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(point);
  }

  // Calculate daily averages
  const dailyData: WeatherDataPoint[] = [];
  for (const [dateKey, points] of dailyMap) {
    const temps = points.map((p) => p.temperature);
    const avgTemperature = temps.reduce((sum, t) => sum + t, 0) / temps.length;
    const minTemperature = Math.min(...temps);
    const maxTemperature = Math.max(...temps);
    const avgWindSpeed = points.reduce((sum, p) => sum + p.windSpeed, 0) / points.length;
    const avgHumidity = points.reduce((sum, p) => sum + p.humidity, 0) / points.length;
    const totalPrecipitation = points.reduce((sum, p) => sum + p.precipitation, 0);

    const windDirValues = points.map((p) => p.windDirection).filter((d): d is number => d != null);
    const avgWindDirection = windDirValues.length > 0 ? circularMeanDegrees(windDirValues) : undefined;

    // Pick the most common weather symbol (mode) for the day
    const symbolValues = points.map((p) => p.weatherSymbol).filter((s): s is number => s != null);
    let modeSymbol: number | undefined;
    if (symbolValues.length > 0) {
      const freq = new Map<number, number>();
      for (const s of symbolValues) {
        freq.set(s, (freq.get(s) ?? 0) + 1);
      }
      let maxCount = 0;
      for (const [sym, count] of freq) {
        if (count > maxCount) {
          maxCount = count;
          modeSymbol = sym;
        }
      }
    }

    dailyData.push({
      date: new Date(dateKey),
      temperature: Math.round(avgTemperature * 10) / 10,
      temperatureMin: Math.round(minTemperature * 10) / 10,
      temperatureMax: Math.round(maxTemperature * 10) / 10,
      windSpeed: Math.round(avgWindSpeed * 10) / 10,
      humidity: Math.round(avgHumidity),
      precipitation: Math.round(totalPrecipitation * 10) / 10,
      windDirection: avgWindDirection,
      weatherSymbol: modeSymbol,
    });
  }

  return dailyData.sort((a, b) => a.date.getTime() - b.date.getTime());
}
