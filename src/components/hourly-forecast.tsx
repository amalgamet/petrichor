import Image from "next/image";
import { getHourlyForecast } from "@/lib/weather-api";
import { ForecastTemperature } from "@/components/temperature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HourlyForecastProps {
  forecastHourlyUrl: string;
}

export async function HourlyForecast({ forecastHourlyUrl }: HourlyForecastProps) {
  const periods = await getHourlyForecast(forecastHourlyUrl);
  const next24 = periods.slice(0, 24);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {next24.map((period) => {
            const time = new Date(period.startTime);
            const hour = time.toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });

            return (
              <div
                key={period.number}
                className="flex shrink-0 flex-col items-center gap-1 rounded-lg border p-3 text-sm"
              >
                <span className="text-muted-foreground">{hour}</span>
                <Image
                  src={period.icon}
                  alt={period.shortForecast}
                  width={40}
                  height={40}
                />
                <ForecastTemperature fahrenheit={period.temperature} className="font-medium" />
                {period.probabilityOfPrecipitation.value !== null &&
                  period.probabilityOfPrecipitation.value > 0 && (
                    <span className="text-xs text-blue-500">
                      {period.probabilityOfPrecipitation.value}%
                    </span>
                  )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
