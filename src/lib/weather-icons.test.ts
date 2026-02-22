import { describe, it, expect } from 'vitest';
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
import { getWeatherIcon } from './weather-icons';

describe('getWeatherIcon', () => {
  it('returns CloudLightning for thunderstorms', () => {
    expect(getWeatherIcon('Thunderstorms')).toBe(CloudLightning);
    expect(getWeatherIcon('Chance Thunderstorms')).toBe(CloudLightning);
  });

  it('returns Snowflake for snow', () => {
    expect(getWeatherIcon('Snow')).toBe(Snowflake);
    expect(getWeatherIcon('Heavy Snow And Areas Of Blowing Snow')).toBe(Snowflake);
    expect(getWeatherIcon('Chance Light Snow')).toBe(Snowflake);
    expect(getWeatherIcon('Blizzard')).toBe(Snowflake);
  });

  it('returns CloudSnow for sleet and ice', () => {
    expect(getWeatherIcon('Sleet')).toBe(CloudSnow);
    expect(getWeatherIcon('Freezing Rain')).toBe(CloudSnow);
    expect(getWeatherIcon('Ice Pellets')).toBe(CloudSnow);
  });

  it('returns CloudRain for rain and showers', () => {
    expect(getWeatherIcon('Rain')).toBe(CloudRain);
    expect(getWeatherIcon('Chance Rain Showers')).toBe(CloudRain);
    expect(getWeatherIcon('Light Drizzle')).toBe(CloudRain);
    expect(getWeatherIcon('Rain And Snow')).toBe(CloudRain);
  });

  it('returns CloudFog for fog, haze, and mist', () => {
    expect(getWeatherIcon('Fog')).toBe(CloudFog);
    expect(getWeatherIcon('Patchy Fog')).toBe(CloudFog);
    expect(getWeatherIcon('Haze')).toBe(CloudFog);
    expect(getWeatherIcon('Mist')).toBe(CloudFog);
  });

  it('returns Wind for windy conditions', () => {
    expect(getWeatherIcon('Windy')).toBe(Wind);
    expect(getWeatherIcon('Breezy')).toBe(Wind);
  });

  it('returns Cloud for cloudy conditions', () => {
    expect(getWeatherIcon('Cloudy')).toBe(Cloud);
    expect(getWeatherIcon('Mostly Cloudy')).toBe(Cloud);
    expect(getWeatherIcon('Overcast')).toBe(Cloud);
    expect(getWeatherIcon('Partly Cloudy')).toBe(Cloud);
  });

  it('returns Sun for sunny/clear daytime conditions', () => {
    expect(getWeatherIcon('Sunny')).toBe(Sun);
    expect(getWeatherIcon('Mostly Sunny')).toBe(Sun);
    expect(getWeatherIcon('Clear')).toBe(Sun);
    expect(getWeatherIcon('Fair')).toBe(Sun);
  });

  it('returns Moon for clear nighttime conditions', () => {
    expect(getWeatherIcon('Clear', false)).toBe(Moon);
    expect(getWeatherIcon('Mostly Clear', false)).toBe(Moon);
  });

  it('returns Sun by default for clear conditions when isDaytime is not specified', () => {
    expect(getWeatherIcon('Clear')).toBe(Sun);
  });

  it('returns Cloud as fallback for unknown conditions', () => {
    expect(getWeatherIcon('Unknown Weather')).toBe(Cloud);
    expect(getWeatherIcon('')).toBe(Cloud);
  });

  it('is case-insensitive', () => {
    expect(getWeatherIcon('THUNDERSTORMS')).toBe(CloudLightning);
    expect(getWeatherIcon('mostly sunny')).toBe(Sun);
    expect(getWeatherIcon('HEAVY SNOW')).toBe(Snowflake);
  });

  it('checks rain before snow in priority order', () => {
    // "Rain And Snow" contains both keywords; rain is matched first
    expect(getWeatherIcon('Rain And Snow')).toBe(CloudRain);
  });
});
