import type { ChartConfig } from '@/components/ui/chart';
import type { ForecastPeriod, TemperatureUnit } from './types';
import { fahrenheitToCelsius } from './utils';

// --- Hourly chart ---

export interface HourlyChartPoint {
  time: string;
  temperature: number;
  precip: number;
}

export function toHourlyChartData(
  periods: ForecastPeriod[],
): HourlyChartPoint[] {
  return periods.map((p) => ({
    time: new Date(p.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    }),
    temperature: p.temperature,
    precip: p.probabilityOfPrecipitation.value ?? 0,
  }));
}

// --- Daily chart ---

export interface DailyChartPoint {
  day: string;
  high: number | null;
  low: number | null;
  precip: number;
}

export function toDailyChartData(periods: ForecastPeriod[]): DailyChartPoint[] {
  const days: DailyChartPoint[] = [];

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    if (!period.isDaytime) continue;

    const next = periods[i + 1];
    const hasNight = next && !next.isDaytime;

    days.push({
      day: new Date(period.startTime).toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      high: period.temperature,
      low: hasNight ? next.temperature : null,
      precip: Math.max(
        period.probabilityOfPrecipitation.value ?? 0,
        hasNight ? (next.probabilityOfPrecipitation.value ?? 0) : 0,
      ),
    });
  }

  return days;
}

// --- Chart configs ---

export const hourlyChartConfig = {
  temperature: {
    label: 'Temperature',
    color: 'var(--chart-1)',
  },
  precip: {
    label: 'Precipitation',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export const dailyChartConfig = {
  high: {
    label: 'High',
    color: 'var(--chart-1)',
  },
  low: {
    label: 'Low',
    color: 'var(--chart-2)',
  },
  precip: {
    label: 'Precipitation',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

// --- Unit conversion for chart display ---

export function convertTemperature(f: number, unit: TemperatureUnit): number {
  if (unit === 'C') return fahrenheitToCelsius(f)!;
  return f;
}
