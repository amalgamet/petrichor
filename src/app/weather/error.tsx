"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WeatherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message.includes("weather.gov")
              ? "The weather service is temporarily unavailable. Please try again."
              : "We couldn't load the weather data for this location."}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <a href="/">Search another location</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
