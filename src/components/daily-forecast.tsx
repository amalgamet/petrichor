import Image from 'next/image';
import { getForecast } from '@/lib/weather-api';
import { toDailyChartData } from '@/lib/forecast-charts';
import { ForecastTemperature } from '@/components/temperature';
import { DailyForecastChart } from '@/components/daily-forecast-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyForecastProps {
  forecastUrl: string;
}

export async function DailyForecast({ forecastUrl }: DailyForecastProps) {
  const periods = await getForecast(forecastUrl);
  const chartData = toDailyChartData(periods);

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <DailyForecastChart data={chartData} />
        <div className="mt-4 divide-y">
          {periods.map((period) => (
            <div
              key={period.number}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <Image
                src={period.icon}
                alt={period.shortForecast}
                width={48}
                height={48}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{period.name}</span>
                  <ForecastTemperature
                    fahrenheit={period.temperature}
                    className="text-lg font-semibold"
                  />
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {period.shortForecast}
                </p>
                {period.probabilityOfPrecipitation.value !== null &&
                  period.probabilityOfPrecipitation.value > 0 && (
                    <span className="text-xs text-muted-foreground italic">
                      {period.probabilityOfPrecipitation.value}% chance of
                      precipitation
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
