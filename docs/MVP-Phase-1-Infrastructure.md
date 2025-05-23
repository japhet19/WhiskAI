# MVP Phase 1: Core Infrastructure

## Overview
This phase establishes the foundational design system, state management, and routing structure for WhiskAI. Expected timeline: 1-2 weeks for a solo developer.

## 1. Design System Setup

### 1.1 Design Tokens Implementation

Create `/client/src/theme/tokens.ts`:

```typescript
export const tokens = {
  colors: {
    primary: {
      teal: '#00837B',
      tealDark: '#006B64', // hover state
      tealLight: '#E6F4F3', // backgrounds
    },
    accent: {
      melon: '#FF9B21',
      melonDark: '#E6891C', // hover state
      melonLight: '#FFF4E6', // backgrounds
    },
    surface: {
      bg: '#FFFFFF',
      bgDark: '#121212', // dark mode
      card: '#FFFFFF',
      cardDark: '#1E1E1E',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      inverse: '#FFFFFF',
    },
    state: {
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6',
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '8px',
    md: '16px',
    lg: '24px', // cards, modals
    pill: '100px', // chips, buttons
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.06)',
    cardHover: '0 4px 12px rgba(0,0,0,0.1)',
    modal: '0 20px 25px -5px rgba(0,0,0,0.1)',
    drawer: '-4px 0 24px rgba(0,0,0,0.1)',
  },
  animation: {
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: {
      instant: '100ms',
      fast: '250ms',
      normal: '300ms',
      slow: '500ms',
    }
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};
```

### 1.2 Tailwind Configuration

Update `/client/tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00837B',
          dark: '#006B64',
          light: '#E6F4F3',
        },
        melon: {
          DEFAULT: '#FF9B21',
          dark: '#E6891C',
          light: '#FFF4E6',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.25s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-pop': 'scalePop 0.2s ease-out',
        'shimmer': 'shimmer 1.5s linear infinite',
        'spin-refresh': 'spin 0.5s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scalePop: {
          '0%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    }
  }
};
```

### 1.3 Global Styles

Create `/client/src/styles/globals.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  @font-face {
    font-family: 'Inter';
    font-display: swap;
    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  }

  * {
    box-sizing: border-box;
  }

  body {
    @apply text-base leading-normal antialiased;
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  .shimmer {
    background: linear-gradient(
      90deg,
      theme('colors.gray.200') 0%,
      theme('colors.gray.100') 50%,
      theme('colors.gray.200') 100%
    );
    background-size: 200% 100%;
  }

  .glass-effect {
    @apply backdrop-blur-md bg-white/80 dark:bg-gray-900/80;
  }
}
```

### 1.4 Animation Components

Create `/client/src/components/animations/`:

#### FadeSlideUp.tsx
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeSlideUp = ({ children, delay = 0, className }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.25,
      delay,
      ease: [0.4, 0, 0.2, 1],
    }}
    className={className}
  >
    {children}
  </motion.div>
);
```

#### ScalePop.tsx
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  whileHover?: boolean;
  whileTap?: boolean;
}

export const ScalePop = ({ children, whileHover = true, whileTap = true }: Props) => (
  <motion.div
    whileHover={whileHover ? { scale: 1.02 } : undefined}
    whileTap={whileTap ? { scale: 0.98 } : undefined}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);
```

## 2. State Management Architecture

### 2.1 Local Storage Hook

Create `/client/src/hooks/useLocalStorage.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const serialize = options?.serialize || JSON.stringify;
  const deserialize = options?.deserialize || JSON.parse;

  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key, deserialize]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore));
          window.dispatchEvent(new StorageEvent('storage', {
            key,
            newValue: serialize(valueToStore),
          }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: null,
        }));
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(deserialize(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize]);

  return [storedValue, setValue, removeValue];
}
```

### 2.2 App Context

Create `/client/src/context/AppContext.tsx`:

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserPreferences {
  dietary: string[];
  cookingTime: number; // minutes
  servings: number;
  weeklyBudget: number;
}

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  cookTime: number;
  calories: number;
  cost: number;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    price: number;
  }>;
  tags: string[];
  isLocked?: boolean;
  isFavorite?: boolean;
}

interface MealPlan {
  [date: string]: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

interface AppState {
  preferences: UserPreferences;
  recipes: Recipe[];
  mealPlan: MealPlan;
  shoppingList: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    checked: boolean;
    recipeIds: string[];
  }>;
  currentWeek: Date;
}

interface AppContextType {
  state: AppState;
  actions: {
    updatePreferences: (prefs: Partial<UserPreferences>) => void;
    setRecipes: (recipes: Recipe[]) => void;
    toggleRecipeLock: (recipeId: string) => void;
    toggleRecipeFavorite: (recipeId: string) => void;
    refreshRecipe: (recipeId: string) => Promise<void>;
    updateMealPlan: (date: string, meal: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe | null) => void;
    updateShoppingList: (items: AppState['shoppingList']) => void;
    clearAllData: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  preferences: 'whiskai_preferences_v1',
  recipes: 'whiskai_recipes_v1',
  mealPlan: 'whiskai_meal_plan_v1',
  shoppingList: 'whiskai_shopping_list_v1',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  dietary: [],
  cookingTime: 30,
  servings: 2,
  weeklyBudget: 125,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences, clearPreferences] = useLocalStorage(
    STORAGE_KEYS.preferences,
    DEFAULT_PREFERENCES
  );
  
  const [recipes, setRecipesStorage, clearRecipes] = useLocalStorage<Recipe[]>(
    STORAGE_KEYS.recipes,
    []
  );
  
  const [mealPlan, setMealPlanStorage, clearMealPlan] = useLocalStorage<MealPlan>(
    STORAGE_KEYS.mealPlan,
    {}
  );
  
  const [shoppingList, setShoppingListStorage, clearShoppingList] = useLocalStorage<AppState['shoppingList']>(
    STORAGE_KEYS.shoppingList,
    []
  );

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  const setRecipes = (newRecipes: Recipe[]) => {
    setRecipesStorage(newRecipes);
  };

  const toggleRecipeLock = (recipeId: string) => {
    setRecipesStorage(prev =>
      prev.map(r => r.id === recipeId ? { ...r, isLocked: !r.isLocked } : r)
    );
  };

  const toggleRecipeFavorite = (recipeId: string) => {
    setRecipesStorage(prev =>
      prev.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r)
    );
  };

  const refreshRecipe = async (recipeId: string) => {
    // This will be implemented to call the Gemini service
    console.log('Refreshing recipe:', recipeId);
  };

  const updateMealPlan = (date: string, meal: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe | null) => {
    setMealPlanStorage(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [meal]: recipe || undefined,
      },
    }));
  };

  const updateShoppingList = (items: AppState['shoppingList']) => {
    setShoppingListStorage(items);
  };

  const clearAllData = () => {
    clearPreferences();
    clearRecipes();
    clearMealPlan();
    clearShoppingList();
  };

  const state: AppState = {
    preferences,
    recipes,
    mealPlan,
    shoppingList,
    currentWeek: new Date(),
  };

  const actions = {
    updatePreferences,
    setRecipes,
    toggleRecipeLock,
    toggleRecipeFavorite,
    refreshRecipe,
    updateMealPlan,
    updateShoppingList,
    clearAllData,
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## 3. Routing Structure

### 3.1 Install React Router

```bash
npm install react-router-dom
```

### 3.2 App Router Setup

Update `/client/src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing';
import { OnboardingFlow } from './pages/Onboarding';
import { RecipesPage } from './pages/Recipes';
import { MealPlannerPage } from './pages/MealPlanner';
import { useLocalStorage } from './hooks/useLocalStorage';

function AppRoutes() {
  const [hasOnboarded] = useLocalStorage('whiskai_onboarded', false);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route
        path="/recipes"
        element={
          hasOnboarded ? (
            <Layout>
              <RecipesPage />
            </Layout>
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
      <Route
        path="/planner"
        element={
          hasOnboarded ? (
            <Layout>
              <MealPlannerPage />
            </Layout>
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;
```

### 3.3 Layout Component

Create `/client/src/components/Layout/index.tsx`:

```typescript
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { state } = useApp();
  const [showBudgetModal, setShowBudgetModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/recipes" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="WhiskAI" className="h-8 w-8" />
              <span className="font-semibold text-xl">WhiskAI</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <NavLink to="/recipes" active={location.pathname === '/recipes'}>
                Recipes
              </NavLink>
              <NavLink to="/planner" active={location.pathname === '/planner'}>
                Meal Plan
              </NavLink>
            </nav>

            {/* Budget Pill */}
            <button
              onClick={() => setShowBudgetModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-light text-teal font-medium rounded-full hover:bg-teal hover:text-white transition-colors"
            >
              <span>${state.preferences.weeklyBudget}/wk</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Budget Modal */}
      {showBudgetModal && (
        <BudgetModal onClose={() => setShowBudgetModal(false)} />
      )}
    </div>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors ${
        active ? 'text-teal' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-teal"
        />
      )}
    </Link>
  );
}

function BudgetModal({ onClose }: { onClose: () => void }) {
  // Implementation in Phase 2
  return null;
}
```

## 4. Development Environment Setup

### 4.1 ESLint Configuration

Create `/client/.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

### 4.2 Prettier Configuration

Create `/client/.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 4.3 VS Code Settings

Create `/.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*{([^}]*)}", "'([^']*)'"]
  ]
}
```

## 5. Testing Infrastructure

### 5.1 Test Utilities

Create `/client/src/test-utils.tsx`:

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 6. Package Dependencies

Update `/client/package.json` dependencies:

```json
{
  "dependencies": {
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.3.0",
    "react-intersection-observer": "^9.10.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "@types/react-router-dom": "^5.3.3"
  }
}
```

## Next Steps

After completing Phase 1:
1. Run `npm install` to install all new dependencies
2. Test the routing structure
3. Verify design tokens are rendering correctly
4. Ensure dark mode toggle works
5. Test localStorage persistence
6. Validate all animations work smoothly

This infrastructure provides a solid foundation for Phase 2's feature implementation.