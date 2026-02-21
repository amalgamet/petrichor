import { cacheLife, cacheTag } from 'next/cache';
import { roundCoordinate } from './utils';
import type {
  PointsResponse,
  PointData,
  ForecastResponse,
  ForecastPeriod,
  StationsResponse,
  ObservationResponse,
  CurrentConditionsData,
} from './types';

const USER_AGENT = 'petrichor/1.0';

async function weatherFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`weather.gov ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function getPointData(
  lat: number,
  lon: number,
): Promise<PointData> {
  'use cache';
  cacheLife('hours');

  const rlat = roundCoordinate(lat);
  const rlon = roundCoordinate(lon);
  cacheTag(`point-${rlat},${rlon}`);

  const data = await weatherFetch<PointsResponse>(
    `https://api.weather.gov/points/${rlat},${rlon}`,
  );

  const { properties: p } = data;
  return {
    forecastUrl: p.forecast,
    forecastHourlyUrl: p.forecastHourly,
    stationsUrl: p.observationStations,
    city: p.relativeLocation.properties.city,
    state: p.relativeLocation.properties.state,
    timeZone: p.timeZone,
  };
}

export async function getForecast(
  forecastUrl: string,
): Promise<ForecastPeriod[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`forecast-${forecastUrl}`);

  const data = await weatherFetch<ForecastResponse>(forecastUrl);
  return data.properties.periods;
}

export async function getHourlyForecast(
  forecastHourlyUrl: string,
): Promise<ForecastPeriod[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`forecast-hourly-${forecastHourlyUrl}`);

  const data = await weatherFetch<ForecastResponse>(forecastHourlyUrl);
  return data.properties.periods;
}

export async function getCurrentConditions(
  stationsUrl: string,
): Promise<CurrentConditionsData> {
  'use cache';
  cacheLife('observations');
  cacheTag(`current-conditions-${stationsUrl}`);

  const stations = await weatherFetch<StationsResponse>(stationsUrl);
  const stationId = stations.features[0]?.properties.stationIdentifier;
  if (!stationId) {
    throw new Error('No observation stations found');
  }

  const obs = await weatherFetch<ObservationResponse>(
    `https://api.weather.gov/stations/${stationId}/observations/latest`,
  );

  const { properties: p } = obs;
  return {
    stationName: p.stationName,
    timestamp: p.timestamp,
    description: p.textDescription,
    icon: p.icon,
    temperatureC: p.temperature.value,
    dewpointC: p.dewpoint.value,
    windDirectionDeg: p.windDirection.value,
    windSpeedKmh: p.windSpeed.value,
    windGustKmh: p.windGust.value,
    humidity: p.relativeHumidity.value,
    visibilityM: p.visibility.value,
    pressurePa: p.barometricPressure.value,
    windChillC: p.windChill.value,
    heatIndexC: p.heatIndex.value,
  };
}
