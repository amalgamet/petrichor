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

// --- Unit conversion for chart display ---

export function convertTemperature(f: number, unit: TemperatureUnit): number {
  if (unit === 'C') return fahrenheitToCelsius(f)!;
  return f;
}
