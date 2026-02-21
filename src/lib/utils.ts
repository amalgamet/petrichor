import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TemperatureUnit } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Temperature conversion ---

export function celsiusToFahrenheit(c: number | null): number | null {
  if (c === null) return null;
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f: number | null): number | null {
  if (f === null) return null;
  return Math.round(((f - 32) * 5) / 9);
}

// --- Unit conversion ---

export function kmhToMph(kmh: number | null): number | null {
  if (kmh === null) return null;
  return kmh * 0.621371;
}

export function metersToMiles(m: number | null): number | null {
  if (m === null) return null;
  return m / 1609.34;
}

export function pascalsToInHg(pa: number | null): number | null {
  if (pa === null) return null;
  return pa * 0.0002953;
}

// --- Wind direction ---

const COMPASS_DIRECTIONS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const;

export function degreesToCompass(deg: number | null): string | null {
  if (deg === null) return null;
  const index = Math.round(deg / 22.5) % 16;
  return COMPASS_DIRECTIONS[index];
}

// --- Coordinates ---

export function roundCoordinate(coord: number): number {
  return Math.round(coord * 10000) / 10000;
}

export function isValidCoordinate(lat: number, lon: number): boolean {
  if (Number.isNaN(lat) || Number.isNaN(lon)) return false;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// --- Formatting ---

export function formatTemperature(
  value: number | null,
  unit: TemperatureUnit,
): string {
  if (value === null) return `--°${unit}`;
  return `${Math.round(value)}°${unit}`;
}
