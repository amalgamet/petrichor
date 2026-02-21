import { NextRequest, NextResponse } from 'next/server';
import type { GeocodingResult } from '@/lib/types';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q.trim());
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('countrycodes', 'us');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'petrichor/1.0',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const raw: NominatimResult[] = await res.json();
  const results: GeocodingResult[] = raw.map((r) => ({
    lat: r.lat,
    lon: r.lon,
    displayName: r.display_name,
  }));

  return NextResponse.json(results);
}
