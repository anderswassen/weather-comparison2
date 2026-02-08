import { LocationWeather, WeatherDataPoint } from './types';
import { format } from 'date-fns';

// --- Thresholds (easy to tune) ---
const TEMP_DIFF_THRESHOLD = 1.0; // °C
const TREND_CHANGE_THRESHOLD = 2.0; // °C
const WIND_CHILL_FEELS_DIFF = 3.0; // °C
const WIND_CHILL_MAX_TEMP = 10; // °C
const WIND_CHILL_MIN_WIND_KMH = 4.8; // km/h

export interface Insight {
  id: 'tempDiff' | 'bestDay' | 'tempTrend' | 'windChill';
  emoji: string;
  headlineKey: string;
  headlineParams: Record<string, string>;
  descriptionKey: string;
  descriptionParams: Record<string, string>;
}

export function generateInsights(
  loc1: LocationWeather,
  loc2: LocationWeather,
): Insight[] {
  const results: (Insight | null)[] = [
    findBiggestTempDifference(loc1, loc2),
    findBestOutdoorDay(loc1, loc2),
    detectTemperatureTrend(loc1, loc2),
    findWindChillAlert(loc1, loc2),
  ];
  return results.filter((r): r is Insight => r !== null);
}

export function computeWindChill(
  tempC: number,
  windSpeedMs: number,
): number | null {
  const windKmh = windSpeedMs * 3.6;
  if (tempC > WIND_CHILL_MAX_TEMP || windKmh < WIND_CHILL_MIN_WIND_KMH) {
    return null;
  }
  const vExp = Math.pow(windKmh, 0.16);
  return 13.12 + 0.6215 * tempC - 11.37 * vExp + 0.3965 * tempC * vExp;
}

export function linearRegression(values: number[]): { slope: number } {
  const n = values.length;
  if (n < 2) return { slope: 0 };
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return { slope };
}

// --- Sub-functions ---

function findBiggestTempDifference(
  loc1: LocationWeather,
  loc2: LocationWeather,
): Insight | null {
  const d1 = loc1.weatherData;
  const d2 = loc2.weatherData;
  const len = Math.min(d1.length, d2.length);
  if (len === 0) return null;

  let maxDiff = 0;
  let maxIdx = 0;
  for (let i = 0; i < len; i++) {
    const diff = Math.abs(d1[i].temperature - d2[i].temperature);
    if (diff > maxDiff) {
      maxDiff = diff;
      maxIdx = i;
    }
  }

  if (maxDiff < TEMP_DIFF_THRESHOLD) return null;

  const warmer =
    d1[maxIdx].temperature >= d2[maxIdx].temperature
      ? loc1.locationName
      : loc2.locationName;
  const dateStr = format(d1[maxIdx].date, 'MMM d');

  return {
    id: 'tempDiff',
    emoji: '\uD83C\uDF21\uFE0F',
    headlineKey: 'insights.tempDiff.headline',
    headlineParams: {
      date: dateStr,
      warmerLocation: warmer,
      diff: maxDiff.toFixed(1),
    },
    descriptionKey: 'insights.tempDiff.description',
    descriptionParams: {},
  };
}

function findBestOutdoorDay(
  loc1: LocationWeather,
  loc2: LocationWeather,
): Insight | null {
  let bestScore = -Infinity;
  let bestPoint: WeatherDataPoint | null = null;
  let bestLocation = '';

  function scorePoint(p: WeatherDataPoint): number {
    return 10 - Math.abs(p.temperature - 15) - p.windSpeed - p.precipitation * 10;
  }

  for (const p of loc1.weatherData) {
    const s = scorePoint(p);
    if (s > bestScore) {
      bestScore = s;
      bestPoint = p;
      bestLocation = loc1.locationName;
    }
  }
  for (const p of loc2.weatherData) {
    const s = scorePoint(p);
    if (s > bestScore) {
      bestScore = s;
      bestPoint = p;
      bestLocation = loc2.locationName;
    }
  }

  if (!bestPoint) return null;

  const windDesc =
    bestPoint.windSpeed < 5
      ? 'insights.bestDay.lightWind'
      : 'insights.bestDay.moderateWind';
  const rainDesc =
    bestPoint.precipitation === 0
      ? 'insights.bestDay.noRain'
      : 'insights.bestDay.someRain';

  return {
    id: 'bestDay',
    emoji: '\u2600\uFE0F',
    headlineKey: 'insights.bestDay.headline',
    headlineParams: {
      date: format(bestPoint.date, 'MMM d'),
      location: bestLocation,
    },
    descriptionKey: 'insights.bestDay.description',
    descriptionParams: {
      temperature: bestPoint.temperature.toFixed(1),
      windDescription: `{${windDesc}}`,
      rainDescription: `{${rainDesc}}`,
    },
  };
}

function detectTemperatureTrend(
  loc1: LocationWeather,
  loc2: LocationWeather,
): Insight | null {
  const temps1 = loc1.weatherData.map((p) => p.temperature);
  const temps2 = loc2.weatherData.map((p) => p.temperature);
  const reg1 = linearRegression(temps1);
  const reg2 = linearRegression(temps2);
  const change1 = Math.abs(reg1.slope * (temps1.length - 1));
  const change2 = Math.abs(reg2.slope * (temps2.length - 1));

  let slope: number;
  let change: number;
  let locationName: string;
  if (change1 >= change2) {
    slope = reg1.slope;
    change = change1;
    locationName = loc1.locationName;
  } else {
    slope = reg2.slope;
    change = change2;
    locationName = loc2.locationName;
  }

  if (change < TREND_CHANGE_THRESHOLD) return null;

  const warming = slope > 0;

  return {
    id: 'tempTrend',
    emoji: warming ? '\uD83D\uDCC8' : '\uD83D\uDCC9',
    headlineKey: 'insights.tempTrend.headline',
    headlineParams: {
      location: locationName,
      direction: warming
        ? '{insights.tempTrend.directionWarming}'
        : '{insights.tempTrend.directionCooling}',
    },
    descriptionKey: warming
      ? 'insights.tempTrend.warming'
      : 'insights.tempTrend.cooling',
    descriptionParams: { change: change.toFixed(1) },
  };
}

function findWindChillAlert(
  loc1: LocationWeather,
  loc2: LocationWeather,
): Insight | null {
  interface Candidate {
    diff: number;
    point: WeatherDataPoint;
    feelsLike: number;
    location: string;
  }

  let worst: Candidate | null = null;

  const allPoints: Array<{ data: WeatherDataPoint[]; name: string }> = [
    { data: loc1.weatherData, name: loc1.locationName },
    { data: loc2.weatherData, name: loc2.locationName },
  ];

  for (const { data, name } of allPoints) {
    for (const p of data) {
      const wc = computeWindChill(p.temperature, p.windSpeed);
      if (wc === null) continue;
      const diff = p.temperature - wc;
      if (!worst || diff > worst.diff) {
        worst = { diff, point: p, feelsLike: wc, location: name };
      }
    }
  }

  if (!worst || worst.diff < WIND_CHILL_FEELS_DIFF) return null;

  return {
    id: 'windChill',
    emoji: '\uD83E\uDD76',
    headlineKey: 'insights.windChill.headline',
    headlineParams: {
      date: format(worst.point.date, 'MMM d'),
      location: worst.location,
      feelsLike: worst.feelsLike.toFixed(1),
    },
    descriptionKey: 'insights.windChill.description',
    descriptionParams: {
      actual: worst.point.temperature.toFixed(1),
    },
  };
}
