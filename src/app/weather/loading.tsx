import { Skeleton } from '@/components/ui/skeleton';

export default function WeatherLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="mb-12">
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-10 pt-10">
        {['Current Conditions', 'Hourly Forecast', '7-Day Forecast'].map(
          (title, i) => (
            <section key={title}>
              {i > 0 && <div className="mb-10 h-px bg-border" />}
              <Skeleton className="h-3 w-32" />
              <div className="mt-3 space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}
