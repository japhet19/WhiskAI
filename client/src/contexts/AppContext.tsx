import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

import { useLocalStorage } from '../hooks';

import type {
  AppAction,
  AppSettings,
  AppState,
  BudgetSettings,
  ThemePreferences,
  UserPreferences,
} from './types';

// Default values
const defaultUserPreferences: UserPreferences = {
  dietary: {
    restrictions: [],
    allergies: [],
    cuisinePreferences: [],
    dislikedIngredients: [],
  },
  servingSize: 2,
  cookingTime: 'medium',
  skillLevel: 'intermediate',
  measurementSystem: 'imperial',
};

const defaultBudgetSettings: BudgetSettings = {
  weeklyBudget: 100,
  pricePerServing: 10,
  currency: 'USD',
};

const defaultThemePreferences: ThemePreferences = {
  mode: 'light',
  fontSize: 'medium',
};

const defaultAppSettings: AppSettings = {
  notifications: true,
  autoSave: true,
  language: 'en',
  region: 'US',
};

const defaultAppState: AppState = {
  user: {
    preferences: defaultUserPreferences,
    budget: defaultBudgetSettings,
    onboardingCompleted: false,
  },
  app: {
    settings: defaultAppSettings,
    theme: defaultThemePreferences,
  },
  ui: {
    isLoading: false,
    error: null,
    notification: null,
  },
};

// Context type
interface AppContextType {
  state: AppState;
  actions: {
    updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
    updateBudgetSettings: (budget: Partial<BudgetSettings>) => void;
    updateTheme: (theme: Partial<ThemePreferences>) => void;
    updateAppSettings: (settings: Partial<AppSettings>) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    showNotification: (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning'
    ) => void;
    clearNotification: () => void;
    completeOnboarding: () => void;
    resetApp: () => void;
  };
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload,
          },
        },
      };

    case 'SET_BUDGET_SETTINGS':
      return {
        ...state,
        user: {
          ...state.user,
          budget: {
            ...state.user.budget,
            ...action.payload,
          },
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        app: {
          ...state.app,
          theme: {
            ...state.app.theme,
            ...action.payload,
          },
        },
      };

    case 'SET_APP_SETTINGS':
      return {
        ...state,
        app: {
          ...state.app,
          settings: {
            ...state.app.settings,
            ...action.payload,
          },
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case 'SET_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: action.payload,
        },
      };

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: null,
        },
      };

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        user: {
          ...state.user,
          onboardingCompleted: true,
        },
      };

    case 'RESET_APP':
      return defaultAppState;

    default:
      return state;
  }
}

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage for persistence
  const [persistedState, setPersistedState] = useLocalStorage<AppState>(
    'whiskai-app-state',
    defaultAppState
  );

  // Use reducer for state management
  const [state, dispatch] = useReducer(appReducer, persistedState);

  // Persist state changes to localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  // Action creators
  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences });
  }, []);

  const updateBudgetSettings = useCallback((budget: Partial<BudgetSettings>) => {
    dispatch({ type: 'SET_BUDGET_SETTINGS', payload: budget });
  }, []);

  const updateTheme = useCallback((theme: Partial<ThemePreferences>) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const updateAppSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: 'SET_APP_SETTINGS', payload: settings });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });

      // Auto-clear notification after 5 seconds
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    []
  );

  const clearNotification = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  }, []);

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, []);

  const resetApp = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all app data?')) {
      dispatch({ type: 'RESET_APP' });
    }
  }, []);

  const value: AppContextType = {
    state,
    actions: {
      updateUserPreferences,
      updateBudgetSettings,
      updateTheme,
      updateAppSettings,
      setLoading,
      setError,
      showNotification,
      clearNotification,
      completeOnboarding,
      resetApp,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Export context for testing
export { AppContext };