"use client";

import { useState, useEffect } from "react";

/**
 * Debounces a value by the given delay in milliseconds.
 * Useful for search inputs to avoid excessive API calls.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
