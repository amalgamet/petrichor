'use client';

import {
  Bar,
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useUnit } from '@/components/unit-toggle';
import { formatTemperature } from '@/lib/utils';
import {
  type DailyChartPoint,
  dailyChartConfig,
  convertTemperature,
} from '@/lib/forecast-charts';

interface DailyForecastChartProps {
  data: DailyChartPoint[];
}

export function DailyForecastChart({ data }: DailyForecastChartProps) {
  const { unit } = useUnit();

  const chartData = data.map((point) => ({
    ...point,
    high: point.high !== null ? convertTemperature(point.high, unit) : null,
    low: point.low !== null ? convertTemperature(point.low, unit) : null,
  }));

  return (
    <ChartContainer config={dailyChartConfig} className="h-[250px] w-full">
      <ComposedChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
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
                if (name === 'high' || name === 'low')
                  return formatTemperature(value as number, unit);
                return `${value}%`;
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          yAxisId="precip"
          dataKey="precip"
          fill="var(--color-precip)"
          fillOpacity={0.3}
          radius={[2, 2, 0, 0]}
        />
        <Line
          yAxisId="temp"
          dataKey="high"
          stroke="var(--color-high)"
          strokeWidth={2}
          dot={{ r: 3 }}
          type="monotone"
          connectNulls
        />
        <Line
          yAxisId="temp"
          dataKey="low"
          stroke="var(--color-low)"
          strokeWidth={2}
          dot={{ r: 3 }}
          type="monotone"
          connectNulls
        />
      </ComposedChart>
    </ChartContainer>
  );
}
