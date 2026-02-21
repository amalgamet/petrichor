// weather.gov API response types

/** Measurement with unit code and nullable value (stations often return nulls) */
export interface Measurement {
  unitCode: string;
  value: number | null;
}

/** Measurement with quality control indicator */
export interface QCMeasurement extends Measurement {
  qualityControl: string;
}

// --- /points/{lat},{lon} ---

export interface PointsResponse {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    observationStations: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
    timeZone: string;
  };
}

/** The subset of point data we pass around after the initial lookup */
export interface PointData {
  forecastUrl: string;
  forecastHourlyUrl: string;
  stationsUrl: string;
  city: string;
  state: string;
  timeZone: string;
}

// --- /gridpoints/{wfo}/{x},{y}/forecast ---

export interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: 'F' | 'C';
  temperatureTrend: string | null;
  probabilityOfPrecipitation: Measurement;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

// --- /gridpoints/{wfo}/{x},{y}/stations ---

export interface StationsResponse {
  features: Array<{
    properties: {
      stationIdentifier: string;
      name: string;
    };
  }>;
}

// --- /stations/{id}/observations/latest ---

export interface ObservationResponse {
  properties: {
    stationName: string;
    timestamp: string;
    textDescription: string;
    icon: string;
    temperature: QCMeasurement;
    dewpoint: QCMeasurement;
    windDirection: QCMeasurement;
    windSpeed: QCMeasurement;
    windGust: QCMeasurement;
    barometricPressure: QCMeasurement;
    visibility: QCMeasurement;
    relativeHumidity: QCMeasurement;
    windChill: QCMeasurement;
    heatIndex: QCMeasurement;
  };
}

/** Processed current conditions for display */
export interface CurrentConditionsData {
  stationName: string;
  timestamp: string;
  description: string;
  icon: string;
  temperatureC: number | null;
  dewpointC: number | null;
  windDirectionDeg: number | null;
  windSpeedKmh: number | null;
  windGustKmh: number | null;
  humidity: number | null;
  visibilityM: number | null;
  pressurePa: number | null;
  windChillC: number | null;
  heatIndexC: number | null;
}

// --- Geocoding (Nominatim) ---

export interface GeocodingResult {
  lat: string;
  lon: string;
  displayName: string;
}

// --- Unit preference ---

export type TemperatureUnit = 'F' | 'C';
