'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import type { GeocodingResult } from '@/lib/types';

const LISTBOX_ID = 'location-search-listbox';

export function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error('Geocode failed');
      const data: GeocodingResult[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (result: GeocodingResult) => {
    setOpen(false);
    setQuery(result.displayName);
    router.push(`/weather?lat=${result.lat}&lon=${result.lon}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeOptionId =
    activeIndex >= 0 ? `${LISTBOX_ID}-option-${activeIndex}` : undefined;

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="search"
        name="location"
        placeholder="Search for a US zip code, city, state, etc."
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-label="Search location"
        aria-expanded={open}
        aria-controls={LISTBOX_ID}
        aria-activedescendant={activeOptionId}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      )}
      <ul
        id={LISTBOX_ID}
        role="listbox"
        className={`absolute z-10 mt-1 w-full border bg-popover ${open && results.length > 0 ? '' : 'hidden'}`}
      >
        {results.map((r, i) => (
          <li
            key={`${r.lat}-${r.lon}`}
            id={`${LISTBOX_ID}-option-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            className={`cursor-pointer truncate px-3 py-2 text-sm hover:bg-accent focus-visible:bg-accent ${i === activeIndex ? 'bg-accent' : ''}`}
            onMouseDown={() => handleSelect(r)}
          >
            {r.displayName}
          </li>
        ))}
      </ul>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {open && results.length > 0
          ? `${results.length} result${results.length === 1 ? '' : 's'} found`
          : ''}
      </div>
    </div>
  );
}
