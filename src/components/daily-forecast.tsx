import { getForecast } from '@/lib/weather-api';
import { ForecastTemperature } from '@/components/temperature';
import { pairForecastDays, calcTempRange, tempRangeBar } from '@/lib/forecast-utils';
import { WeatherIcon } from '@/lib/weather-icons';
import type { DayForecast } from '@/lib/types';

interface DailyForecastProps {
  forecastUrl: string;
}

export async function DailyForecast({ forecastUrl }: DailyForecastProps) {
  const periods = await getForecast(forecastUrl);
  const days = pairForecastDays(periods);
  const { weekMin, weekMax } = calcTempRange(days);

  return (
    <section className="md:col-span-12">
      <h2>7-Day Forecast</h2>
      <div className="mt-3 divide-y">
        {days.map((day) => (
          <DayRow
            key={day.date}
            day={day}
            weekMin={weekMin}
            weekMax={weekMax}
          />
        ))}
      </div>
    </section>
  );
}

function DayRow({
  day,
  weekMin,
  weekMax,
}: {
  day: DayForecast;
  weekMin: number;
  weekMax: number;
}) {
  const { leftPct, widthPct } = tempRangeBar(day, weekMin, weekMax);
  const isTonight = day.dayName === 'Tonight';
  const label = isTonight ? day.dayName : day.dayName.slice(0, 3);

  return (
    <div className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0 sm:gap-4">
      <span className="w-16 shrink-0 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <WeatherIcon shortForecast={day.shortForecast} isDaytime={!isTonight} size={16} aria-hidden className="shrink-0 text-muted-foreground" />
      <span className="hidden min-w-0 flex-1 truncate text-muted-foreground sm:block">
        {day.shortForecast}
      </span>
      {day.precipChance !== null && day.precipChance > 0 && (
        <span className="hidden w-10 shrink-0 text-right text-xs tabular-nums text-highlight sm:block">
          {day.precipChance}%
        </span>
      )}
      <div className="relative hidden h-1 w-24 shrink-0 bg-muted sm:block lg:w-32">
        <div
          className="absolute inset-y-0 bg-foreground"
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right tabular-nums text-muted-foreground">
        {day.lowTempF !== null ? (
          <ForecastTemperature fahrenheit={day.lowTempF} />
        ) : (
          '--'
        )}
      </span>
      <span className="w-10 shrink-0 text-right font-medium tabular-nums">
        {day.highTempF !== null ? (
          <ForecastTemperature fahrenheit={day.highTempF} />
        ) : (
          '--'
        )}
      </span>
    </div>
  );
}
