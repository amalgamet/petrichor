import { getForecast } from "@/lib/weather-api";
import { ForecastTemperature } from "@/components/temperature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyForecastProps {
  forecastUrl: string;
}

export async function DailyForecast({ forecastUrl }: DailyForecastProps) {
  const periods = await getForecast(forecastUrl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {periods.map((period) => (
            <div
              key={period.number}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
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
                    <span className="text-xs text-blue-500">
                      {period.probabilityOfPrecipitation.value}% chance of precipitation
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
