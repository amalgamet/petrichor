'use client';

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from 'react';
import type { TemperatureUnit } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface UnitContextValue {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextValue>({
  unit: 'F',
  toggleUnit: () => {},
});

export function useUnit() {
  return useContext(UnitContext);
}

const STORAGE_KEY = 'petrichor-temp-unit';
const UNIT_CHANGE_EVENT = 'petrichor-unit-change';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(UNIT_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(UNIT_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): TemperatureUnit {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'C' || stored === 'F' ? stored : 'F';
}

function getServerSnapshot(): TemperatureUnit {
  return 'F';
}

export function UnitProvider({ children }: { children: ReactNode }) {
  const unit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleUnit = useCallback(() => {
    const next = unit === 'F' ? 'C' : 'F';
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(UNIT_CHANGE_EVENT));
  }, [unit]);

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
      °{unit === 'F' ? 'C' : 'F'}
    </Button>
  );
}
