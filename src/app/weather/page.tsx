import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPointData } from "@/lib/weather-api";
import { isValidCoordinate } from "@/lib/utils";
import { CurrentConditions } from "@/components/current-conditions";
import { HourlyForecast } from "@/components/hourly-forecast";
import { DailyForecast } from "@/components/daily-forecast";
import { UnitToggle } from "@/components/unit-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherPageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export async function generateMetadata({
  searchParams,
}: WeatherPageProps): Promise<Metadata> {
  const params = await searchParams;
  const lat = parseFloat(params.lat ?? "");
  const lon = parseFloat(params.lon ?? "");

  if (!isValidCoordinate(lat, lon)) {
    return { title: "Weather" };
  }

  try {
    const point = await getPointData(lat, lon);
    return {
      title: `${point.city}, ${point.state} Weather`,
      description: `Current weather conditions and forecast for ${point.city}, ${point.state}`,
    };
  } catch {
    return { title: "Weather" };
  }
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;
  const lat = parseFloat(params.lat ?? "");
  const lon = parseFloat(params.lon ?? "");

  if (!isValidCoordinate(lat, lon)) {
    redirect("/");
  }

  const point = await getPointData(lat, lon);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
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
      <div className="flex flex-col gap-6">
        <Suspense fallback={<WeatherSkeleton title="Current Conditions" />}>
          <CurrentConditions stationsUrl={point.stationsUrl} />
        </Suspense>
        <Suspense fallback={<WeatherSkeleton title="Hourly Forecast" />}>
          <HourlyForecast forecastHourlyUrl={point.forecastHourlyUrl} />
        </Suspense>
        <Suspense fallback={<WeatherSkeleton title="7-Day Forecast" />}>
          <DailyForecast forecastUrl={point.forecastUrl} />
        </Suspense>
      </div>
    </div>
  );
}

function WeatherSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
