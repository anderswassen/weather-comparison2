import { Coordinates, WeatherDataPoint } from './types';

// SMHI Meteorological Observations API types
interface MetObsStation {
  key: string;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
}

interface MetObsStationListResponse {
  station: MetObsStation[];
}

interface MetObsValue {
  from: number;
  to: number;
  ref: string;
  value: string;
  quality: string;
}

interface MetObsDataResponse {
  value: MetObsValue[];
}

// Parameter IDs in SMHI metobs API
// Param 2: Daily mean temperature (°C), 1/day
// Param 5: Daily precipitation sum (mm), 1/day
// Param 4: Wind speed (m/s), hourly — large archive, use latest-months JSON only
// Param 6: Relative humidity (%), hourly — large archive, use latest-months JSON only
const PARAM_TEMPERATURE = 2;
const PARAM_WIND_SPEED = 4;
const PARAM_PRECIPITATION = 5;
const PARAM_HUMIDITY = 6;

// Daily params have small CSVs suitable for corrected-archive download
const DAILY_PARAMS = [PARAM_TEMPERATURE, PARAM_PRECIPITATION];

// Module-level cache for station lists per parameter
const stationCache = new Map<number, MetObsStation[]>();

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchStationList(paramId: number): Promise<MetObsStation[]> {
  if (stationCache.has(paramId)) {
    return stationCache.get(paramId)!;
  }

  const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/${paramId}.json`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Failed to fetch station list for param ${paramId}: ${response.statusText}`);
  }

  const data: MetObsStationListResponse = await response.json();
  const stations = data.station || [];
  stationCache.set(paramId, stations);
  return stations;
}

function findNearestStation(stations: MetObsStation[], lat: number, lon: number): MetObsStation | null {
  let nearest: MetObsStation | null = null;
  let minDist = Infinity;

  for (const station of stations) {
    if (!station.active) continue;
    const dist = haversineDistance(lat, lon, station.latitude, station.longitude);
    if (dist < minDist) {
      minDist = dist;
      nearest = station;
    }
  }

  return nearest;
}

/**
 * Parse daily data from corrected-archive CSV.
 * CSV format (daily params like temp=2, precip=5):
 *   Header lines (skip until "Från Datum Tid" line)
 *   Från Datum Tid (UTC);Till Datum Tid (UTC);Representativt dygn;Value;Kvalitet;;...
 *   1996-10-01 00:00:01;1996-10-02 00:00:00;1996-10-01;11.1;Y;;...
 */
function parseDailyCsv(
  csv: string,
  startDate: string,
  endDate: string
): Map<string, number> {
  const result = new Map<string, number>();
  const lines = csv.split('\n');

  let dataStarted = false;
  for (const line of lines) {
    if (!dataStarted) {
      if (line.startsWith('Från Datum Tid')) {
        dataStarted = true;
      }
      continue;
    }

    const parts = line.split(';');
    if (parts.length < 5) continue;

    const dateStr = parts[2]?.trim(); // "Representativt dygn" = YYYY-MM-DD
    const valueStr = parts[3]?.trim();

    if (!dateStr || !valueStr) continue;
    if (dateStr < startDate || dateStr > endDate) continue;

    const num = parseFloat(valueStr);
    if (!isNaN(num)) {
      result.set(dateStr, Math.round(num * 10) / 10);
    }
  }

  return result;
}

/**
 * Parse hourly data from corrected-archive CSV.
 * CSV format (hourly params like wind=4, humidity=6):
 *   Header lines (skip until "Datum;Tid" line)
 *   Datum;Tid (UTC);Value;Kvalitet;;...
 *   2025-02-08;13:00:00;3.2;Y;;...
 */
function parseHourlyCsv(
  csv: string,
  startDate: string,
  endDate: string,
  mode: 'average' | 'sum'
): Map<string, number> {
  const dailyValues = new Map<string, number[]>();
  const lines = csv.split('\n');

  let dataStarted = false;
  for (const line of lines) {
    if (!dataStarted) {
      if (line.startsWith('Datum;Tid')) {
        dataStarted = true;
      }
      continue;
    }

    const parts = line.split(';');
    if (parts.length < 4) continue;

    const dateStr = parts[0]?.trim(); // YYYY-MM-DD
    const valueStr = parts[2]?.trim();

    if (!dateStr || !valueStr) continue;
    if (dateStr < startDate || dateStr > endDate) continue;

    const num = parseFloat(valueStr);
    if (!isNaN(num)) {
      if (!dailyValues.has(dateStr)) {
        dailyValues.set(dateStr, []);
      }
      dailyValues.get(dateStr)!.push(num);
    }
  }

  const result = new Map<string, number>();
  for (const [dateKey, nums] of dailyValues) {
    if (mode === 'sum') {
      result.set(dateKey, Math.round(nums.reduce((a, b) => a + b, 0) * 10) / 10);
    } else {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      result.set(dateKey, Math.round(avg * 10) / 10);
    }
  }

  return result;
}

async function fetchDailyParamFromCsv(
  stationKey: string,
  paramId: number,
  startDate: string,
  endDate: string
): Promise<Map<string, number>> {
  // Try corrected-archive first (CSV), then latest-months (JSON)
  const csvUrl = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/${paramId}/station/${stationKey}/period/corrected-archive/data.csv`;
  try {
    const response = await fetch(csvUrl);
    if (response.ok) {
      const csv = await response.text();
      const result = parseDailyCsv(csv, startDate, endDate);
      if (result.size > 0) return result;
    }
  } catch {
    // Fall through to latest-months
  }

  // Fallback: latest-months JSON
  return fetchFromLatestMonthsJson(stationKey, paramId, startDate, endDate);
}

async function fetchHourlyParam(
  stationKey: string,
  paramId: number,
  startDate: string,
  endDate: string,
): Promise<Map<string, number>> {
  // For hourly params, corrected-archive CSVs can be very large (10MB+).
  // Only use latest-months JSON (covers last ~4 months).
  // If the requested dates are outside that range, wind/humidity will be unavailable.
  return fetchFromLatestMonthsJson(stationKey, paramId, startDate, endDate);
}

async function fetchFromLatestMonthsJson(
  stationKey: string,
  paramId: number,
  startDate: string,
  endDate: string
): Promise<Map<string, number>> {
  const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/${paramId}/station/${stationKey}/period/latest-months/data.json`;
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return new Map();

    const data: MetObsDataResponse = await response.json();
    const values = data.value || [];

    const result = new Map<string, number>();
    // For daily params, ref is the date directly
    // For hourly params, we need to aggregate
    const isDailyParam = DAILY_PARAMS.includes(paramId);

    if (isDailyParam) {
      for (const v of values) {
        const dateStr = v.ref;
        if (!dateStr || dateStr < startDate || dateStr > endDate) continue;
        const num = parseFloat(v.value);
        if (!isNaN(num)) {
          result.set(dateStr, Math.round(num * 10) / 10);
        }
      }
    } else {
      // Hourly: aggregate by date from the ref or from timestamp
      const dailyValues = new Map<string, number[]>();
      for (const v of values) {
        const dateStr = v.ref?.substring(0, 10) || new Date(v.from).toISOString().split('T')[0];
        if (dateStr < startDate || dateStr > endDate) continue;
        const num = parseFloat(v.value);
        if (!isNaN(num)) {
          if (!dailyValues.has(dateStr)) dailyValues.set(dateStr, []);
          dailyValues.get(dateStr)!.push(num);
        }
      }
      for (const [dateKey, nums] of dailyValues) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        result.set(dateKey, Math.round(avg * 10) / 10);
      }
    }

    return result;
  } catch {
    return new Map();
  }
}

export async function fetchHistoricalData(
  coordinates: Coordinates,
  startDate: string,
  endDate: string
): Promise<WeatherDataPoint[]> {
  const { lat, lon } = coordinates;

  // Fetch station lists for all parameters in parallel
  const [tempStations, windStations, precipStations, humidStations] = await Promise.all([
    fetchStationList(PARAM_TEMPERATURE),
    fetchStationList(PARAM_WIND_SPEED),
    fetchStationList(PARAM_PRECIPITATION),
    fetchStationList(PARAM_HUMIDITY),
  ]);

  // Find nearest stations
  const tempStation = findNearestStation(tempStations, lat, lon);
  const windStation = findNearestStation(windStations, lat, lon);
  const precipStation = findNearestStation(precipStations, lat, lon);
  const humidStation = findNearestStation(humidStations, lat, lon);

  // Fetch data from each nearest station in parallel
  const [tempDaily, windDaily, precipDaily, humidDaily] = await Promise.all([
    tempStation
      ? fetchDailyParamFromCsv(tempStation.key, PARAM_TEMPERATURE, startDate, endDate)
      : Promise.resolve(new Map<string, number>()),
    windStation
      ? fetchHourlyParam(windStation.key, PARAM_WIND_SPEED, startDate, endDate)
      : Promise.resolve(new Map<string, number>()),
    precipStation
      ? fetchDailyParamFromCsv(precipStation.key, PARAM_PRECIPITATION, startDate, endDate)
      : Promise.resolve(new Map<string, number>()),
    humidStation
      ? fetchHourlyParam(humidStation.key, PARAM_HUMIDITY, startDate, endDate)
      : Promise.resolve(new Map<string, number>()),
  ]);

  // Collect all unique dates from daily params (temp is the most reliable)
  const allDates = new Set<string>();
  for (const key of tempDaily.keys()) allDates.add(key);
  for (const key of precipDaily.keys()) allDates.add(key);

  // Merge into WeatherDataPoint array
  const result: WeatherDataPoint[] = [];
  for (const dateKey of Array.from(allDates).sort()) {
    if (!tempDaily.has(dateKey)) continue;

    result.push({
      date: new Date(dateKey),
      temperature: tempDaily.get(dateKey) ?? 0,
      windSpeed: windDaily.get(dateKey) ?? 0,
      humidity: humidDaily.get(dateKey) ?? 0,
      precipitation: precipDaily.get(dateKey) ?? 0,
    });
  }

  return result;
}
