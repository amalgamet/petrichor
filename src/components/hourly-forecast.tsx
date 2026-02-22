import { getHourlyForecast } from '@/lib/weather-api';
import { HourlyForecastChart } from '@/components/hourly-forecast-chart';

interface HourlyForecastProps {
  forecastHourlyUrl: string;
}

export async function HourlyForecast({
  forecastHourlyUrl,
}: HourlyForecastProps) {
  const periods = await getHourlyForecast(forecastHourlyUrl);
  const next24 = periods.slice(0, 24);

  return (
    <section className="md:col-span-7">
      <h2>Hourly Forecast</h2>
      <div className="mt-3">
        <HourlyForecastChart periods={next24} />
      </div>
    </section>
  );
}
