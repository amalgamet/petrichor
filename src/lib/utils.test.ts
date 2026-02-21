import { describe, it, expect } from "vitest";
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  kmhToMph,
  metersToMiles,
  pascalsToInHg,
  degreesToCompass,
  roundCoordinate,
  isValidCoordinate,
  formatTemperature,
} from "./utils";

describe("celsiusToFahrenheit", () => {
  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("converts 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("converts negative temperatures", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it("returns null for null input", () => {
    expect(celsiusToFahrenheit(null)).toBeNull();
  });
});

describe("fahrenheitToCelsius", () => {
  it("converts 32°F to 0°C", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
  });

  it("converts 212°F to 100°C", () => {
    expect(fahrenheitToCelsius(212)).toBe(100);
  });

  it("returns null for null input", () => {
    expect(fahrenheitToCelsius(null)).toBeNull();
  });
});

describe("kmhToMph", () => {
  it("converts km/h to mph", () => {
    expect(kmhToMph(100)).toBeCloseTo(62.14, 1);
  });

  it("converts 0 to 0", () => {
    expect(kmhToMph(0)).toBe(0);
  });

  it("returns null for null input", () => {
    expect(kmhToMph(null)).toBeNull();
  });
});

describe("metersToMiles", () => {
  it("converts meters to miles", () => {
    expect(metersToMiles(1609.34)).toBeCloseTo(1, 1);
  });

  it("returns null for null input", () => {
    expect(metersToMiles(null)).toBeNull();
  });
});

describe("pascalsToInHg", () => {
  it("converts standard atmosphere to ~29.92 inHg", () => {
    expect(pascalsToInHg(101325)).toBeCloseTo(29.92, 1);
  });

  it("returns null for null input", () => {
    expect(pascalsToInHg(null)).toBeNull();
  });
});

describe("degreesToCompass", () => {
  it("converts 0° to N", () => {
    expect(degreesToCompass(0)).toBe("N");
  });

  it("converts 90° to E", () => {
    expect(degreesToCompass(90)).toBe("E");
  });

  it("converts 180° to S", () => {
    expect(degreesToCompass(180)).toBe("S");
  });

  it("converts 270° to W", () => {
    expect(degreesToCompass(270)).toBe("W");
  });

  it("converts 45° to NE", () => {
    expect(degreesToCompass(45)).toBe("NE");
  });

  it("converts 225° to SW", () => {
    expect(degreesToCompass(225)).toBe("SW");
  });

  it("converts 350° to N (wrapping)", () => {
    expect(degreesToCompass(350)).toBe("N");
  });

  it("returns null for null input", () => {
    expect(degreesToCompass(null)).toBeNull();
  });
});

describe("roundCoordinate", () => {
  it("rounds to 4 decimal places", () => {
    expect(roundCoordinate(40.748817)).toBe(40.7488);
  });

  it("handles negative coordinates", () => {
    expect(roundCoordinate(-73.985643)).toBe(-73.9856);
  });

  it("does not add precision to short decimals", () => {
    expect(roundCoordinate(40.7)).toBe(40.7);
  });
});

describe("isValidCoordinate", () => {
  it("accepts valid US coordinates", () => {
    expect(isValidCoordinate(40.7484, -73.9856)).toBe(true);
  });

  it("accepts Alaska", () => {
    expect(isValidCoordinate(64.2, -152.5)).toBe(true);
  });

  it("accepts Hawaii", () => {
    expect(isValidCoordinate(21.3069, -157.8583)).toBe(true);
  });

  it("rejects latitude out of range", () => {
    expect(isValidCoordinate(91, -73)).toBe(false);
  });

  it("rejects longitude out of range", () => {
    expect(isValidCoordinate(40, -181)).toBe(false);
  });

  it("rejects NaN", () => {
    expect(isValidCoordinate(NaN, -73)).toBe(false);
  });
});

describe("formatTemperature", () => {
  it("formats Fahrenheit with degree symbol", () => {
    expect(formatTemperature(72, "F")).toBe("72°F");
  });

  it("formats Celsius with degree symbol", () => {
    expect(formatTemperature(22, "C")).toBe("22°C");
  });

  it("rounds to nearest integer", () => {
    expect(formatTemperature(72.6, "F")).toBe("73°F");
  });

  it("returns -- for null", () => {
    expect(formatTemperature(null, "F")).toBe("--°F");
  });
});
