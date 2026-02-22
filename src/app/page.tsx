import { UserButton } from '@/components/user-button';
import { LocationSearch } from '@/components/location-search';
import { GeolocationButton } from '@/components/geolocation-button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-end px-8 pb-16 sm:px-12 md:px-20">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          weather for anywhere in the us
        </p>
        <div className="mt-3 h-px w-16 bg-border" />
        <h1 className="mt-3 text-6xl sm:text-8xl md:text-9xl">petrichor</h1>
        <div className="mt-10 flex max-w-sm flex-col items-start gap-4">
          <LocationSearch />
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            or
            <div className="h-px w-8 bg-border" />
          </div>
          <GeolocationButton />
        </div>
      </div>
    </div>
  );
}
