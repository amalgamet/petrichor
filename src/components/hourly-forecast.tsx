import { getHourlyForecast } from '@/lib/weather-api';
import { HourlyForecastChart } from '@/components/hourly-forecast-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HourlyForecastProps {
  forecastHourlyUrl: string;
}

export async function HourlyForecast({
  forecastHourlyUrl,
}: HourlyForecastProps) {
  const periods = await getHourlyForecast(forecastHourlyUrl);
  const next24 = periods.slice(0, 24);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <HourlyForecastChart periods={next24} />
      </CardContent>
    </Card>
  );
}
