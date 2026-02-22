import { Suspense } from 'react';
import { UserButton } from '@/components/user-button';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPointData } from '@/lib/weather-api';
import { isValidCoordinate } from '@/lib/utils';
import { CurrentConditions } from '@/components/current-conditions';
import { HourlyForecast } from '@/components/hourly-forecast';
import { DailyForecast } from '@/components/daily-forecast';
import { UnitToggle } from '@/components/unit-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherPageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export async function generateMetadata({
  searchParams,
}: WeatherPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lat = parseFloat(params.lat ?? '');
  const lon = parseFloat(params.lon ?? '');

  if (!isValidCoordinate(lat, lon)) {
    return { title: 'Weather' };
  }

  try {
    const point = await getPointData(lat, lon);
    return {
      title: `${point.city}, ${point.state} Weather`,
      description: `Current weather conditions and forecast for ${point.city}, ${point.state}`,
    };
  } catch (err) {
    console.error('Failed to generate weather page metadata:', err);
    return { title: 'Weather' };
  }
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;
  const lat = parseFloat(params.lat ?? '');
  const lon = parseFloat(params.lon ?? '');

  if (!isValidCoordinate(lat, lon)) {
    redirect('/');
  }

  const point = await getPointData(lat, lon);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="mb-12 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase hover:underline focus-visible:underline"
          >
            &larr; back
          </Link>
          <h1 className="truncate text-4xl sm:text-5xl">
            {point.city}, {point.state}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <UnitToggle />
          <UserButton />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-10 md:grid-cols-12">
        <Suspense fallback={<CurrentConditionsSkeleton />}>
          <CurrentConditions stationsUrl={point.stationsUrl} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton title="Hourly Forecast" />}>
          <HourlyForecast forecastHourlyUrl={point.forecastHourlyUrl} />
        </Suspense>
        <div className="md:col-span-12">
          <div className="h-px bg-border" />
        </div>
        <Suspense fallback={<DailyForecastSkeleton />}>
          <DailyForecast forecastUrl={point.forecastUrl} />
        </Suspense>
      </div>
    </div>
  );
}

function CurrentConditionsSkeleton() {
  return (
    <div className="md:col-span-5 space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-20 w-36" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="h-px bg-border" />
      <div>
        <h2>Conditions</h2>
        <div className="mt-3 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <section className="md:col-span-7">
      <h2>{title}</h2>
      <Skeleton className="mt-3 h-[200px] w-full sm:h-[280px]" />
    </section>
  );
}

function DailyForecastSkeleton() {
  return (
    <section className="md:col-span-12">
      <h2>7-Day Forecast</h2>
      <div className="mt-3 space-y-4">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </section>
  );
}
