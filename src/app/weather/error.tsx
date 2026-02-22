'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WeatherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 h-px w-16 bg-border" />
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message.includes('weather.gov')
            ? 'The weather service is temporarily unavailable. Please try again.'
            : "We couldn't load the weather data for this location."}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Search another location</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
