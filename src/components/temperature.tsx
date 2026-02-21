"use client";

import { useUnit } from "@/components/unit-toggle";
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemperature } from "@/lib/utils";

interface TemperatureProps {
  /** Temperature in Celsius (weather.gov observation units) */
  celsius: number | null;
  className?: string;
}

/** Displays a temperature in the user's preferred unit (F or C) */
export function Temperature({ celsius, className }: TemperatureProps) {
  const { unit } = useUnit();

  const displayValue =
    unit === "F" ? celsiusToFahrenheit(celsius) : celsius !== null ? Math.round(celsius) : null;

  return <span className={className}>{formatTemperature(displayValue, unit)}</span>;
}

interface ForecastTemperatureProps {
  /** Temperature value from the forecast API (already in F) */
  fahrenheit: number;
  className?: string;
}

/** Displays a forecast temperature (which comes as F from weather.gov) in the user's preferred unit */
export function ForecastTemperature({ fahrenheit, className }: ForecastTemperatureProps) {
  const { unit } = useUnit();

  const displayValue =
    unit === "C" ? fahrenheitToCelsius(fahrenheit) : fahrenheit;

  return <span className={className}>{formatTemperature(displayValue, unit)}</span>;
}
