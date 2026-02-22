import { describe, it, expect } from 'vitest';
import { pairForecastDays, calcTempRange, tempRangeBar } from './forecast-utils';
import { makePeriod } from './test-factories';

describe('pairForecastDays', () => {
  it('pairs consecutive day and night periods into a single day', () => {
    const periods = [
      makePeriod({
        name: 'Monday',
        startTime: '2026-02-23T06:00:00-06:00',
        isDaytime: true,
        temperature: 45,
        shortForecast: 'Sunny',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 10 },
      }),
      makePeriod({
        name: 'Monday Night',
        startTime: '2026-02-23T18:00:00-06:00',
        isDaytime: false,
        temperature: 30,
        shortForecast: 'Clear',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 5 },
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      dayName: 'Monday',
      date: '2026-02-23',
      highTempF: 45,
      lowTempF: 30,
      shortForecast: 'Sunny',
      precipChance: 10,
    });
  });

  it('handles starting with a nighttime "Tonight" period', () => {
    const periods = [
      makePeriod({
        name: 'Tonight',
        startTime: '2026-02-22T18:00:00-06:00',
        isDaytime: false,
        temperature: 28,
        shortForecast: 'Partly Cloudy',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
      }),
      makePeriod({
        name: 'Monday',
        startTime: '2026-02-23T06:00:00-06:00',
        isDaytime: true,
        temperature: 42,
        shortForecast: 'Sunny',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
      }),
      makePeriod({
        name: 'Monday Night',
        startTime: '2026-02-23T18:00:00-06:00',
        isDaytime: false,
        temperature: 25,
        shortForecast: 'Clear',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      dayName: 'Tonight',
      date: '2026-02-22',
      highTempF: null,
      lowTempF: 28,
      shortForecast: 'Partly Cloudy',
      precipChance: null,
    });
    expect(result[1]).toEqual({
      dayName: 'Monday',
      date: '2026-02-23',
      highTempF: 42,
      lowTempF: 25,
      shortForecast: 'Sunny',
      precipChance: null,
    });
  });

  it('handles last day with only a daytime period', () => {
    const periods = [
      makePeriod({
        name: 'Saturday',
        startTime: '2026-03-01T06:00:00-06:00',
        isDaytime: true,
        temperature: 50,
        shortForecast: 'Mostly Sunny',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 0 },
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      dayName: 'Saturday',
      date: '2026-03-01',
      highTempF: 50,
      lowTempF: null,
      shortForecast: 'Mostly Sunny',
      precipChance: 0,
    });
  });

  it('uses max precipitation across day and night', () => {
    const periods = [
      makePeriod({
        name: 'Wednesday',
        startTime: '2026-02-25T06:00:00-06:00',
        isDaytime: true,
        temperature: 40,
        shortForecast: 'Chance Rain',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 30 },
      }),
      makePeriod({
        name: 'Wednesday Night',
        startTime: '2026-02-25T18:00:00-06:00',
        isDaytime: false,
        temperature: 35,
        shortForecast: 'Rain',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 80 },
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result[0].precipChance).toBe(80);
  });

  it('returns null precipChance when both day and night are null', () => {
    const periods = [
      makePeriod({
        name: 'Thursday',
        startTime: '2026-02-26T06:00:00-06:00',
        isDaytime: true,
        temperature: 55,
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
      }),
      makePeriod({
        name: 'Thursday Night',
        startTime: '2026-02-26T18:00:00-06:00',
        isDaytime: false,
        temperature: 40,
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result[0].precipChance).toBeNull();
  });

  it('prefers daytime shortForecast over nighttime', () => {
    const periods = [
      makePeriod({
        name: 'Friday',
        startTime: '2026-02-27T06:00:00-06:00',
        isDaytime: true,
        shortForecast: 'Mostly Sunny',
      }),
      makePeriod({
        name: 'Friday Night',
        startTime: '2026-02-27T18:00:00-06:00',
        isDaytime: false,
        shortForecast: 'Partly Cloudy',
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result[0].shortForecast).toBe('Mostly Sunny');
  });

  it('uses nighttime shortForecast when no daytime period exists', () => {
    const periods = [
      makePeriod({
        name: 'Tonight',
        startTime: '2026-02-22T18:00:00-06:00',
        isDaytime: false,
        shortForecast: 'Chance Snow',
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result[0].shortForecast).toBe('Chance Snow');
  });

  it('derives dayName by stripping " Night" when only nighttime exists', () => {
    const periods = [
      makePeriod({
        name: 'Monday Night',
        startTime: '2026-02-23T18:00:00-06:00',
        isDaytime: false,
        temperature: 30,
      }),
    ];

    const result = pairForecastDays(periods);

    expect(result[0].dayName).toBe('Monday');
  });

  it('handles a full week of periods', () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const periods = days.flatMap((name, i) => [
      makePeriod({
        name,
        startTime: `2026-02-${23 + i}T06:00:00-06:00`,
        isDaytime: true,
        temperature: 40 + i,
      }),
      makePeriod({
        name: `${name} Night`,
        startTime: `2026-02-${23 + i}T18:00:00-06:00`,
        isDaytime: false,
        temperature: 25 + i,
      }),
    ]);

    const result = pairForecastDays(periods);

    expect(result).toHaveLength(7);
    expect(result.map((d) => d.dayName)).toEqual(days);
    expect(result[0].highTempF).toBe(40);
    expect(result[0].lowTempF).toBe(25);
    expect(result[6].highTempF).toBe(46);
    expect(result[6].lowTempF).toBe(31);
  });
});

describe('calcTempRange', () => {
  it('returns min and max across all days', () => {
    const days = [
      { dayName: 'Mon', date: '2026-02-23', highTempF: 45, lowTempF: 30, shortForecast: '', precipChance: null },
      { dayName: 'Tue', date: '2026-02-24', highTempF: 50, lowTempF: 25, shortForecast: '', precipChance: null },
      { dayName: 'Wed', date: '2026-02-25', highTempF: 42, lowTempF: 35, shortForecast: '', precipChance: null },
    ];

    expect(calcTempRange(days)).toEqual({ weekMin: 25, weekMax: 50 });
  });

  it('handles days with null highTempF', () => {
    const days = [
      { dayName: 'Tonight', date: '2026-02-22', highTempF: null, lowTempF: 28, shortForecast: '', precipChance: null },
      { dayName: 'Mon', date: '2026-02-23', highTempF: 45, lowTempF: 30, shortForecast: '', precipChance: null },
    ];

    expect(calcTempRange(days)).toEqual({ weekMin: 28, weekMax: 45 });
  });

  it('handles days with null lowTempF', () => {
    const days = [
      { dayName: 'Sat', date: '2026-03-01', highTempF: 50, lowTempF: null, shortForecast: '', precipChance: null },
    ];

    expect(calcTempRange(days)).toEqual({ weekMin: 50, weekMax: 50 });
  });

  it('handles all identical temperatures', () => {
    const days = [
      { dayName: 'Mon', date: '2026-02-23', highTempF: 40, lowTempF: 40, shortForecast: '', precipChance: null },
    ];

    expect(calcTempRange(days)).toEqual({ weekMin: 40, weekMax: 40 });
  });

  it('throws when no temperature data is available', () => {
    expect(() => calcTempRange([])).toThrow('No temperature data available');
  });

  it('throws when all temperatures are null', () => {
    const days = [
      { dayName: 'Mon', date: '2026-02-23', highTemp: null, lowTemp: null, shortForecast: '', precipChance: null },
    ];

    expect(() => calcTempRange(days)).toThrow('No temperature data available');
  });
});

describe('tempRangeBar', () => {
  it('calculates left offset and width as percentages', () => {
    const day = { dayName: 'Mon', date: '2026-02-23', highTempF: 40, lowTempF: 30, shortForecast: '', precipChance: null };

    const result = tempRangeBar(day, 20, 60);

    expect(result.leftPct).toBe(25);  // (30-20)/(60-20) = 25%
    expect(result.widthPct).toBe(25); // (40-30)/(60-20) = 25%
  });

  it('returns full width when weekMin equals weekMax', () => {
    const day = { dayName: 'Mon', date: '2026-02-23', highTempF: 40, lowTempF: 40, shortForecast: '', precipChance: null };

    const result = tempRangeBar(day, 40, 40);

    expect(result.leftPct).toBe(0);
    expect(result.widthPct).toBe(100);
  });

  it('handles null lowTempF by using highTempF', () => {
    const day = { dayName: 'Sat', date: '2026-03-01', highTempF: 50, lowTempF: null, shortForecast: '', precipChance: null };

    const result = tempRangeBar(day, 20, 60);

    // lowTempF falls back to highTempF (50), so: left=(50-20)/40=75%, width=(50-50)/40=0%
    expect(result.leftPct).toBe(75);
    expect(result.widthPct).toBe(0);
  });

  it('handles null highTempF by using lowTempF', () => {
    const day = { dayName: 'Tonight', date: '2026-02-22', highTempF: null, lowTempF: 28, shortForecast: '', precipChance: null };

    const result = tempRangeBar(day, 20, 60);

    // highTempF falls back to lowTempF (28), so: left=(28-20)/40=20%, width=(28-28)/40=0%
    expect(result.leftPct).toBe(20);
    expect(result.widthPct).toBe(0);
  });

  it('spans the full range for the most extreme day', () => {
    const day = { dayName: 'Mon', date: '2026-02-23', highTempF: 60, lowTempF: 20, shortForecast: '', precipChance: null };

    const result = tempRangeBar(day, 20, 60);

    expect(result.leftPct).toBe(0);
    expect(result.widthPct).toBe(100);
  });
});
