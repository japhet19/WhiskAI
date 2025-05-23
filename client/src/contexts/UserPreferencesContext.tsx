import React, { createContext, useContext, useCallback } from 'react';

import { useAppContext } from './AppContext';
import type { BudgetSettings, DietaryPreferences, UserPreferences } from './types';

// Extended user preferences with validation
interface UserPreferencesContextType {
  preferences: UserPreferences;
  budget: BudgetSettings;
  onboardingCompleted: boolean;
  actions: {
    updateDietaryPreferences: (dietary: Partial<DietaryPreferences>) => void;
    updateCookingPreferences: (
      preferences: Partial<Pick<UserPreferences, 'cookingTime' | 'skillLevel' | 'servingSize'>>
    ) => void;
    updateMeasurementSystem: (system: 'metric' | 'imperial') => void;
    updateBudget: (budget: Partial<BudgetSettings>) => void;
    addDietaryRestriction: (restriction: string) => void;
    removeDietaryRestriction: (restriction: string) => void;
    addAllergy: (allergy: string) => void;
    removeAllergy: (allergy: string) => void;
    addCuisinePreference: (cuisine: string) => void;
    removeCuisinePreference: (cuisine: string) => void;
    addDislikedIngredient: (ingredient: string) => void;
    removeDislikedIngredient: (ingredient: string) => void;
    completeOnboarding: () => void;
    resetPreferences: () => void;
    validatePreferences: () => string[]; // Returns validation errors
  };
  utils: {
    hasAnyDietaryRestrictions: () => boolean;
    hasAllergies: () => boolean;
    getEstimatedWeeklyBudget: () => number;
    getCookingTimeInMinutes: () => { min: number; max: number };
    isValidBudget: () => boolean;
  };
}

// Create context
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Provider component
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, actions } = useAppContext();

  // Validation functions
  const validatePreferences = useCallback((): string[] => {
    const errors: string[] = [];

    // Validate serving size
    if (state.user.preferences.servingSize < 1 || state.user.preferences.servingSize > 12) {
      errors.push('Serving size must be between 1 and 12');
    }

    // Validate budget
    if (state.user.budget.weeklyBudget <= 0) {
      errors.push('Weekly budget must be greater than 0');
    }

    if (state.user.budget.pricePerServing <= 0) {
      errors.push('Price per serving must be greater than 0');
    }

    // Validate currency
    if (!state.user.budget.currency || state.user.budget.currency.length !== 3) {
      errors.push('Currency must be a valid 3-letter code');
    }

    return errors;
  }, [state.user.preferences.servingSize, state.user.budget]);

  // Utility functions
  const hasAnyDietaryRestrictions = useCallback((): boolean => {
    return (
      state.user.preferences.dietary.restrictions.length > 0 ||
      state.user.preferences.dietary.allergies.length > 0
    );
  }, [state.user.preferences.dietary]);

  const hasAllergies = useCallback((): boolean => {
    return state.user.preferences.dietary.allergies.length > 0;
  }, [state.user.preferences.dietary.allergies]);

  const getEstimatedWeeklyBudget = useCallback((): number => {
    const { pricePerServing } = state.user.budget;
    const { servingSize } = state.user.preferences;
    // Assume 21 meals per week (3 meals × 7 days)
    return pricePerServing * servingSize * 21;
  }, [state.user.budget.pricePerServing, state.user.preferences.servingSize]);

  const getCookingTimeInMinutes = useCallback((): { min: number; max: number } => {
    const timeRanges = {
      quick: { min: 5, max: 30 },
      medium: { min: 30, max: 60 },
      long: { min: 60, max: 180 },
    };
    return timeRanges[state.user.preferences.cookingTime];
  }, [state.user.preferences.cookingTime]);

  const isValidBudget = useCallback((): boolean => {
    return validatePreferences().filter((error) => error.includes('budget')).length === 0;
  }, [validatePreferences]);

  // Action creators
  const updateDietaryPreferences = useCallback(
    (dietary: Partial<DietaryPreferences>) => {
      actions.updateUserPreferences({
        dietary: {
          ...state.user.preferences.dietary,
          ...dietary,
        },
      });
    },
    [actions, state.user.preferences.dietary]
  );

  const updateCookingPreferences = useCallback(
    (preferences: Partial<Pick<UserPreferences, 'cookingTime' | 'skillLevel' | 'servingSize'>>) => {
      actions.updateUserPreferences(preferences);
    },
    [actions]
  );

  const updateMeasurementSystem = useCallback(
    (system: 'metric' | 'imperial') => {
      actions.updateUserPreferences({ measurementSystem: system });
    },
    [actions]
  );

  const updateBudget = useCallback(
    (budget: Partial<BudgetSettings>) => {
      actions.updateBudgetSettings(budget);
    },
    [actions]
  );

  // Helper functions for managing arrays
  const addDietaryRestriction = useCallback(
    (restriction: string) => {
      const current = state.user.preferences.dietary.restrictions;
      if (!current.includes(restriction)) {
        updateDietaryPreferences({
          restrictions: [...current, restriction],
        });
      }
    },
    [state.user.preferences.dietary.restrictions, updateDietaryPreferences]
  );

  const removeDietaryRestriction = useCallback(
    (restriction: string) => {
      updateDietaryPreferences({
        restrictions: state.user.preferences.dietary.restrictions.filter((r) => r !== restriction),
      });
    },
    [state.user.preferences.dietary.restrictions, updateDietaryPreferences]
  );

  const addAllergy = useCallback(
    (allergy: string) => {
      const current = state.user.preferences.dietary.allergies;
      if (!current.includes(allergy)) {
        updateDietaryPreferences({
          allergies: [...current, allergy],
        });
      }
    },
    [state.user.preferences.dietary.allergies, updateDietaryPreferences]
  );

  const removeAllergy = useCallback(
    (allergy: string) => {
      updateDietaryPreferences({
        allergies: state.user.preferences.dietary.allergies.filter((a) => a !== allergy),
      });
    },
    [state.user.preferences.dietary.allergies, updateDietaryPreferences]
  );

  const addCuisinePreference = useCallback(
    (cuisine: string) => {
      const current = state.user.preferences.dietary.cuisinePreferences;
      if (!current.includes(cuisine)) {
        updateDietaryPreferences({
          cuisinePreferences: [...current, cuisine],
        });
      }
    },
    [state.user.preferences.dietary.cuisinePreferences, updateDietaryPreferences]
  );

  const removeCuisinePreference = useCallback(
    (cuisine: string) => {
      updateDietaryPreferences({
        cuisinePreferences: state.user.preferences.dietary.cuisinePreferences.filter(
          (c) => c !== cuisine
        ),
      });
    },
    [state.user.preferences.dietary.cuisinePreferences, updateDietaryPreferences]
  );

  const addDislikedIngredient = useCallback(
    (ingredient: string) => {
      const current = state.user.preferences.dietary.dislikedIngredients;
      if (!current.includes(ingredient)) {
        updateDietaryPreferences({
          dislikedIngredients: [...current, ingredient],
        });
      }
    },
    [state.user.preferences.dietary.dislikedIngredients, updateDietaryPreferences]
  );

  const removeDislikedIngredient = useCallback(
    (ingredient: string) => {
      updateDietaryPreferences({
        dislikedIngredients: state.user.preferences.dietary.dislikedIngredients.filter(
          (i) => i !== ingredient
        ),
      });
    },
    [state.user.preferences.dietary.dislikedIngredients, updateDietaryPreferences]
  );

  const resetPreferences = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your preferences?')) {
      actions.resetApp();
    }
  }, [actions]);

  const value: UserPreferencesContextType = {
    preferences: state.user.preferences,
    budget: state.user.budget,
    onboardingCompleted: state.user.onboardingCompleted,
    actions: {
      updateDietaryPreferences,
      updateCookingPreferences,
      updateMeasurementSystem,
      updateBudget,
      addDietaryRestriction,
      removeDietaryRestriction,
      addAllergy,
      removeAllergy,
      addCuisinePreference,
      removeCuisinePreference,
      addDislikedIngredient,
      removeDislikedIngredient,
      completeOnboarding: actions.completeOnboarding,
      resetPreferences,
      validatePreferences,
    },
    utils: {
      hasAnyDietaryRestrictions,
      hasAllergies,
      getEstimatedWeeklyBudget,
      getCookingTimeInMinutes,
      isValidBudget,
    },
  };

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
};

// Custom hook
export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};

// Export context for testing
export { UserPreferencesContext };