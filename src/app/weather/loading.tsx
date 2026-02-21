import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WeatherLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex flex-col gap-6">
        {['Current Conditions', 'Hourly Forecast', '7-Day Forecast'].map(
          (title) => (
            <Card key={title}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
