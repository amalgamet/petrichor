# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Petrichor is a US weather app built with Next.js 16, React 19, and TypeScript. It fetches data from the National Weather Service (weather.gov) API and uses Nominatim (OpenStreetMap) for geocoding. No API keys are required for either service.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Run tests (vitest run)
pnpm lint         # ESLint
npx vitest run src/lib/utils.test.ts  # Run a single test file
```

Package manager is **pnpm** (not npm).

## Architecture

### Data Flow

1. User searches a location (Nominatim via `/api/geocode`) or uses browser geolocation
2. Router navigates to `/weather?lat={lat}&lon={lon}`
3. Weather page calls `getPointData()` to resolve coordinates to NWS grid info
4. Three parallel Suspense sections fetch current conditions, hourly forecast, and 7-day forecast

### Server vs Client Components

- **Server (async)**: Weather data components (`CurrentConditions`, `HourlyForecast`, `DailyForecast`) and pages fetch data directly
- **Client (`"use client"`)**: Interactive components (`LocationSearch`, `GeolocationButton`, `UnitToggle`, `Temperature`)

### Caching (`"use cache"` directive)

`cacheComponents: true` is enabled in next.config.ts. API functions in `src/lib/weather-api.ts` use `"use cache"` with `cacheLife()` profiles and `cacheTag()` for invalidation. Custom cache profile `observations` is defined in next.config.ts.

### Unit Conversion

weather.gov returns observations in Celsius and forecasts in Fahrenheit. The `UnitProvider` context (in `unit-toggle.tsx`) manages user preference with localStorage. `Temperature` handles observation display; forecast components display Fahrenheit values directly.

### External API Calls

All weather.gov requests use `User-Agent: petrichor/1.0` (required by their API policy). Nominatim results are limited to US (`countrycodes=us`).

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- UI components: shadcn/ui (new-york style) in `src/components/ui/`, added via `npx shadcn add`
- Styling: Tailwind CSS v4 with CSS variables
- Types for external APIs live in `src/lib/types.ts`
- Tests live alongside source files (`*.test.ts`)
