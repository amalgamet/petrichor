"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { TemperatureUnit } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface UnitContextValue {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextValue>({
  unit: "F",
  toggleUnit: () => {},
});

export function useUnit() {
  return useContext(UnitContext);
}

const STORAGE_KEY = "petrichor-temp-unit";

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<TemperatureUnit>("F");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "C" || stored === "F") {
      setUnit(stored);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "F" ? "C" : "F";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <Button variant="outline" size="sm" onClick={toggleUnit}>
      °{unit === "F" ? "C" : "F"}
    </Button>
  );
}
