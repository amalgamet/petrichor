'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useUnit } from '@/components/unit-toggle';
import { formatTemperature } from '@/lib/utils';
import {
  toHourlyChartData,
  hourlyChartConfig,
  convertTemperature,
} from '@/lib/forecast-charts';
import type { ForecastPeriod } from '@/lib/types';

interface HourlyForecastChartProps {
  periods: ForecastPeriod[];
}

export function HourlyForecastChart({ periods }: HourlyForecastChartProps) {
  const { unit } = useUnit();

  const chartData = toHourlyChartData(periods).map((point) => ({
    ...point,
    temperature: convertTemperature(point.temperature, unit),
  }));

  return (
    <ChartContainer config={hourlyChartConfig} className="h-[200px] w-full">
      <ComposedChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="temp"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${Math.round(value)}°`}
          width={40}
        />
        <YAxis
          yAxisId="precip"
          orientation="right"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                if (name === 'temperature')
                  return formatTemperature(value as number, unit);
                return `${value}%`;
              }}
            />
          }
        />
        <Area
          yAxisId="precip"
          dataKey="precip"
          fill="var(--color-precip)"
          fillOpacity={0.2}
          stroke="var(--color-precip)"
          strokeWidth={1}
          type="monotone"
        />
        <Line
          yAxisId="temp"
          dataKey="temperature"
          stroke="var(--color-temperature)"
          strokeWidth={2}
          dot={false}
          type="monotone"
        />
      </ComposedChart>
    </ChartContainer>
  );
}
