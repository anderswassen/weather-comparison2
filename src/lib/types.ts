export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherDataPoint {
  date: Date;
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  windDirection?: number;
  weatherSymbol?: number;
}

export interface LocationWeather {
  locationName: string;
  coordinates: Coordinates;
  weatherData: WeatherDataPoint[];
}

export interface GeocodeResult {
  placeId: number;
  name: string;
  displayName: string;
  coordinates: Coordinates;
}

export interface SMHITimeSeriesData {
  air_temperature: number;
  wind_speed: number;
  relative_humidity: number;
  precipitation_amount_mean: number;
  wind_from_direction: number;
  [key: string]: number;
}

export interface SMHITimeSeries {
  time: string;
  intervalParametersStartTime: string;
  data: SMHITimeSeriesData;
}

export interface SMHIResponse {
  createdTime: string;
  referenceTime: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  timeSeries: SMHITimeSeries[];
}
