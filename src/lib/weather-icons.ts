import type { LucideIcon } from 'lucide-react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Snowflake,
  Sun,
  Wind,
} from 'lucide-react';

/**
 * Maps an NWS shortForecast string to a Lucide weather icon.
 * Keywords are checked in priority order (most severe first).
 */
export function getWeatherIcon(
  shortForecast: string,
  isDaytime: boolean = true,
): LucideIcon {
  const f = shortForecast.toLowerCase();

  if (f.includes('thunder')) return CloudLightning;
  if (f.includes('sleet') || f.includes('ice') || f.includes('freezing'))
    return CloudSnow;
  if (f.includes('rain') || f.includes('shower') || f.includes('drizzle'))
    return CloudRain;
  if (f.includes('snow') || f.includes('blizzard')) return Snowflake;
  if (f.includes('fog') || f.includes('haze') || f.includes('mist'))
    return CloudFog;
  if (f.includes('wind') || f.includes('breezy')) return Wind;
  if (f.includes('cloud') || f.includes('overcast')) return Cloud;
  if (f.includes('sunny') || f.includes('clear') || f.includes('fair'))
    return isDaytime ? Sun : Moon;

  return Cloud;
}
