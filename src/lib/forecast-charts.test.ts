import { describe, it, expect } from 'vitest';
import { toHourlyChartData, convertTemperature } from './forecast-charts';
import type { ForecastPeriod } from './types';

function makePeriod(overrides: Partial<ForecastPeriod> = {}): ForecastPeriod {
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

describe('toHourlyChartData', () => {
  it('maps periods to chart points with formatted time labels', () => {
    const periods = [
      makePeriod({ startTime: '2026-02-21T14:00:00-06:00', temperature: 72 }),
      makePeriod({ startTime: '2026-02-21T15:00:00-06:00', temperature: 70 }),
    ];

    const result = toHourlyChartData(periods);

    expect(result).toHaveLength(2);
    // Time labels are locale-formatted; just check they end with AM/PM
    expect(result[0].time).toMatch(/\d+\s*(AM|PM)/);
    expect(result[1].time).toMatch(/\d+\s*(AM|PM)/);
    expect(result[0].temperature).toBe(72);
    expect(result[1].temperature).toBe(70);
  });

  it('defaults precipitation to 0 when null', () => {
    const periods = [
      makePeriod({
        probabilityOfPrecipitation: {
          unitCode: 'wmoUnit:percent',
          value: null,
        },
      }),
    ];

    const result = toHourlyChartData(periods);

    expect(result[0].precip).toBe(0);
  });

  it('preserves precipitation value when present', () => {
    const periods = [
      makePeriod({
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 40 },
      }),
    ];

    const result = toHourlyChartData(periods);

    expect(result[0].precip).toBe(40);
  });

  it('preserves temperature in Fahrenheit', () => {
    const periods = [makePeriod({ temperature: 32 })];

    const result = toHourlyChartData(periods);

    expect(result[0].temperature).toBe(32);
  });
});

describe('convertTemperature', () => {
  it('returns Fahrenheit unchanged when unit is F', () => {
    expect(convertTemperature(72, 'F')).toBe(72);
  });

  it('converts to Celsius when unit is C', () => {
    expect(convertTemperature(32, 'C')).toBe(0);
    expect(convertTemperature(212, 'C')).toBe(100);
    expect(convertTemperature(72, 'C')).toBe(22);
  });
});
