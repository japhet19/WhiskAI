import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * Custom hook for managing localStorage with automatic JSON serialization
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [storedValue, setValue] - Current value and setter function
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, SetValue<T>] {
  // Check if we're in a browser environment
  const isClient = typeof window !== 'undefined';

  // Get initial value from localStorage or use default
  const getStoredValue = useCallback((): T => {
    if (!isClient) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, isClient]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when value changes
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (!isClient) {
        console.warn('localStorage is not available in this environment');
        return;
      }

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch storage event for other tabs/windows (skip in test environment)
        if (process.env.NODE_ENV !== 'test') {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: JSON.stringify(valueToStore),
              url: window.location.href,
              storageArea: window.localStorage,
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isClient]
  );

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (!isClient) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, isClient]);

  // Sync with localStorage if key changes
  useEffect(() => {
    if (isClient) {
      const currentValue = getStoredValue();
      if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
        setStoredValue(currentValue);
      }
    }
  }, [key, isClient, getStoredValue, storedValue]);

  return [storedValue, setValue];
}

// Helper function to clear a specific key
export function clearLocalStorageItem(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
      if (process.env.NODE_ENV !== 'test') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            url: window.location.href,
            storageArea: window.localStorage,
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
}

// Helper function to clear all localStorage
export function clearAllLocalStorage(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}