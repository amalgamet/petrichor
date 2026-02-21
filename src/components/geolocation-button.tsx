'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { roundCoordinate } from '@/lib/utils';

export function GeolocationButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = roundCoordinate(position.coords.latitude);
        const lon = roundCoordinate(position.coords.longitude);
        router.push(`/weather?lat=${lat}&lon=${lon}`);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access was denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
        }
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleClick} disabled={loading} variant="outline">
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Locating\u2026
          </>
        ) : (
          'Use my location'
        )}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
