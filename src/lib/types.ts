export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherDataPoint {
  date: Date;
  temperature: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
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

export interface SMHITimeSeries {
  validTime: string;
  parameters: SMHIParameter[];
}

export interface SMHIParameter {
  name: string;
  levelType: string;
  level: number;
  unit: string;
  values: number[];
}

export interface SMHIResponse {
  approvedTime: string;
  referenceTime: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  timeSeries: SMHITimeSeries[];
}
