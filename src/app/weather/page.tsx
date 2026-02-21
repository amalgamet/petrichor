import { Suspense } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  } catch {
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">
            {point.city}, {point.state}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UnitToggle />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense fallback={<CurrentConditionsSkeleton />}>
          <CurrentConditions stationsUrl={point.stationsUrl} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton title="Hourly Forecast" />}>
          <HourlyForecast forecastHourlyUrl={point.forecastHourlyUrl} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton title="7-Day Forecast" />}>
          <DailyForecast forecastUrl={point.forecastUrl} />
        </Suspense>
      </div>
    </div>
  );
}

function CurrentConditionsSkeleton() {
  return (
    <>
      <Card className="flex flex-col items-center justify-center">
        <CardContent className="space-y-3 pt-6 text-center">
          <Skeleton className="mx-auto h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto h-12 w-24" />
          <Skeleton className="mx-auto h-5 w-32" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    </>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}
