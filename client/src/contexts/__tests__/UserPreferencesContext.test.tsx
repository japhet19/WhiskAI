import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { AppProvider } from '../AppContext';
import { UserPreferencesProvider, useUserPreferences } from '../UserPreferencesContext';

describe('UserPreferencesContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>
      <UserPreferencesProvider>{children}</UserPreferencesProvider>
    </AppProvider>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default preferences', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    expect(result.current.preferences.servingSize).toBe(2);
    expect(result.current.preferences.cookingTime).toBe('medium');
    expect(result.current.preferences.skillLevel).toBe('intermediate');
    expect(result.current.budget.weeklyBudget).toBe(100);
    expect(result.current.onboardingCompleted).toBe(false);
  });

  it('should update dietary preferences', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.actions.updateDietaryPreferences({
        restrictions: ['vegetarian'],
        allergies: ['nuts'],
      });
    });

    expect(result.current.preferences.dietary.restrictions).toEqual(['vegetarian']);
    expect(result.current.preferences.dietary.allergies).toEqual(['nuts']);
  });

  it('should add and remove dietary restrictions', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.actions.addDietaryRestriction('vegetarian');
    });

    expect(result.current.preferences.dietary.restrictions).toContain('vegetarian');

    act(() => {
      result.current.actions.addDietaryRestriction('vegetarian'); // Should not add duplicate
    });

    expect(result.current.preferences.dietary.restrictions).toEqual(['vegetarian']);

    act(() => {
      result.current.actions.removeDietaryRestriction('vegetarian');
    });

    expect(result.current.preferences.dietary.restrictions).toEqual([]);
  });

  it('should manage allergies', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.actions.addAllergy('peanuts');
    });

    expect(result.current.preferences.dietary.allergies).toContain('peanuts');

    act(() => {
      result.current.actions.addAllergy('shellfish');
    });

    expect(result.current.preferences.dietary.allergies).toEqual(['peanuts', 'shellfish']);

    act(() => {
      result.current.actions.removeAllergy('peanuts');
    });

    expect(result.current.preferences.dietary.allergies).toEqual(['shellfish']);
  });

  it('should update cooking preferences', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.actions.updateCookingPreferences({
        cookingTime: 'quick',
        skillLevel: 'beginner',
        servingSize: 4,
      });
    });

    expect(result.current.preferences.cookingTime).toBe('quick');
    expect(result.current.preferences.skillLevel).toBe('beginner');
    expect(result.current.preferences.servingSize).toBe(4);
  });

  it('should update measurement system', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    act(() => {
      result.current.actions.updateMeasurementSystem('metric');
    });

    expect(result.current.preferences.measurementSystem).toBe('metric');
  });

  it('should validate preferences', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    // Test invalid serving size
    act(() => {
      result.current.actions.updateCookingPreferences({ servingSize: 0 });
    });

    const errors = result.current.actions.validatePreferences();
    expect(errors).toContain('Serving size must be between 1 and 12');
  });

  it('should calculate estimated weekly budget', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    // Default: $10 per serving, 2 servings, 21 meals = $420
    expect(result.current.utils.getEstimatedWeeklyBudget()).toBe(420);

    act(() => {
      result.current.actions.updateBudget({ pricePerServing: 5 });
      result.current.actions.updateCookingPreferences({ servingSize: 1 });
    });

    // Updated: $5 per serving, 1 serving, 21 meals = $105
    expect(result.current.utils.getEstimatedWeeklyBudget()).toBe(105);
  });

  it('should provide cooking time ranges', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    // Default is 'medium'
    expect(result.current.utils.getCookingTimeInMinutes()).toEqual({ min: 30, max: 60 });

    act(() => {
      result.current.actions.updateCookingPreferences({ cookingTime: 'quick' });
    });

    expect(result.current.utils.getCookingTimeInMinutes()).toEqual({ min: 5, max: 30 });
  });

  it('should detect dietary restrictions', () => {
    const { result } = renderHook(() => useUserPreferences(), { wrapper });

    expect(result.current.utils.hasAnyDietaryRestrictions()).toBe(false);
    expect(result.current.utils.hasAllergies()).toBe(false);

    act(() => {
      result.current.actions.addDietaryRestriction('vegetarian');
    });

    expect(result.current.utils.hasAnyDietaryRestrictions()).toBe(true);

    act(() => {
      result.current.actions.addAllergy('nuts');
    });

    expect(result.current.utils.hasAllergies()).toBe(true);
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useUserPreferences());
    }).toThrow('useUserPreferences must be used within UserPreferencesProvider');

    consoleSpy.mockRestore();
  });
});