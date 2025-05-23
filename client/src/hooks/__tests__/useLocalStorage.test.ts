import { renderHook, act } from '@testing-library/react';

import { useLocalStorage, clearLocalStorageItem } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('testKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should handle function updates like useState', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should handle complex objects', () => {
    const complexObject = { name: 'Test', value: 42, nested: { data: true } };
    const { result } = renderHook(() => useLocalStorage('testKey', complexObject));

    const newObject = { ...complexObject, value: 100 };
    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(localStorageMock.getItem('testKey') || '{}')).toEqual(newObject);
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = jest.fn(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'value'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "testKey":',
      expect.any(Error)
    );

    // Restore original implementation
    localStorageMock.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });

  it('should clear localStorage item', () => {
    localStorageMock.setItem('testKey', JSON.stringify('value'));
    
    act(() => {
      clearLocalStorageItem('testKey');
    });

    expect(localStorageMock.getItem('testKey')).toBeNull();
  });
});