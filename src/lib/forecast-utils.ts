import type { DayForecast, ForecastPeriod } from './types';

/**
 * Groups interleaved day/night forecast periods into one entry per calendar day.
 * Periods are grouped by the date portion of startTime (YYYY-MM-DD).
 */
export function pairForecastDays(periods: ForecastPeriod[]): DayForecast[] {
  const grouped = new Map<string, { day?: ForecastPeriod; night?: ForecastPeriod }>();

  for (const period of periods) {
    const date = period.startTime.slice(0, 10);
    const entry = grouped.get(date) ?? {};

    if (period.isDaytime) {
      entry.day = period;
    } else {
      entry.night = period;
    }

    grouped.set(date, entry);
  }

  const result: DayForecast[] = [];

  for (const [date, { day, night }] of grouped) {
    let dayName: string;
    if (day) {
      dayName = day.name;
    } else if (night && night.name === 'Tonight') {
      dayName = 'Tonight';
    } else if (night) {
      dayName = night.name.replace(/ Night$/, '');
    } else {
      dayName = date;
    }

    const precipValues = [
      day?.probabilityOfPrecipitation.value,
      night?.probabilityOfPrecipitation.value,
    ].filter((v): v is number => v !== null && v !== undefined);

    result.push({
      dayName,
      date,
      highTempF: day?.temperature ?? null,
      lowTempF: night?.temperature ?? null,
      shortForecast: day?.shortForecast ?? night?.shortForecast ?? '',
      precipChance: precipValues.length > 0 ? Math.max(...precipValues) : null,
    });
  }

  return result;
}

/** Returns the overall min and max temperatures across all forecast days. */
export function calcTempRange(days: DayForecast[]): {
  weekMin: number;
  weekMax: number;
} {
  const temps = days.flatMap((d) =>
    [d.highTempF, d.lowTempF].filter((t): t is number => t !== null),
  );

  if (temps.length === 0) {
    throw new Error('No temperature data available in forecast');
  }

  return {
    weekMin: Math.min(...temps),
    weekMax: Math.max(...temps),
  };
}

/** Calculates CSS percentage positioning for a temperature range bar. */
export function tempRangeBar(
  day: DayForecast,
  weekMin: number,
  weekMax: number,
): { leftPct: number; widthPct: number } {
  const span = weekMax - weekMin;

  if (span === 0) {
    return { leftPct: 0, widthPct: 100 };
  }

  const low = day.lowTempF ?? day.highTempF ?? weekMin;
  const high = day.highTempF ?? day.lowTempF ?? weekMax;

  return {
    leftPct: ((low - weekMin) / span) * 100,
    widthPct: ((high - low) / span) * 100,
  };
}
