import { LocationSearch } from '@/components/location-search';
import { GeolocationButton } from '@/components/geolocation-button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Petrichor</h1>
        <p className="mt-2 text-muted-foreground">
          Weather for anywhere in the US
        </p>
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <LocationSearch />
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-px w-8 bg-border" />
          or
          <div className="h-px w-8 bg-border" />
        </div>
        <GeolocationButton />
      </div>
    </div>
  );
}
