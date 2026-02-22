import type { ForecastPeriod } from './types';

export function makePeriod(
  overrides: Partial<ForecastPeriod> = {},
): ForecastPeriod {
  return {
    number: 1,
    name: 'Monday',
    startTime: '2026-02-21T14:00:00-06:00',
    endTime: '2026-02-21T15:00:00-06:00',
    isDaytime: true,
    temperature: 72,
    temperatureUnit: 'F',
    temperatureTrend: null,
    probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
    windSpeed: '10 mph',
    windDirection: 'NW',
    icon: 'https://api.weather.gov/icons/land/day/skc',
    shortForecast: 'Sunny',
    detailedForecast: 'Sunny, with a high near 72.',
    ...overrides,
  };
}
