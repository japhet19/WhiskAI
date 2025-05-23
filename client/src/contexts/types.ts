// Type definitions for all contexts

// User dietary preferences
export interface DietaryPreferences {
  restrictions: string[]; // e.g., ['vegetarian', 'gluten-free']
  allergies: string[]; // e.g., ['nuts', 'dairy']
  cuisinePreferences: string[]; // e.g., ['Italian', 'Mexican']
  dislikedIngredients: string[]; // e.g., ['mushrooms', 'olives']
}

// User settings
export interface UserPreferences {
  dietary: DietaryPreferences;
  servingSize: number; // Default number of servings
  cookingTime: 'quick' | 'medium' | 'long'; // Preferred cooking time
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  measurementSystem: 'metric' | 'imperial';
}

// Budget settings
export interface BudgetSettings {
  weeklyBudget: number;
  pricePerServing: number;
  currency: string; // e.g., 'USD', 'EUR'
}

// Theme preferences
export interface ThemePreferences {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  fontSize: 'small' | 'medium' | 'large';
}

// App settings
export interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
  language: string; // e.g., 'en', 'es'
  region: string; // e.g., 'US', 'UK'
}

// Global app state
export interface AppState {
  user: {
    preferences: UserPreferences;
    budget: BudgetSettings;
    onboardingCompleted: boolean;
  };
  app: {
    settings: AppSettings;
    theme: ThemePreferences;
  };
  ui: {
    isLoading: boolean;
    error: string | null;
    notification: {
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
    } | null;
  };
}

// Recipe-related types
export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  originalString: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // milligrams
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  instructions: string[];
  ingredients: Ingredient[];
  cuisineTypes: string[];
  dishTypes: string[];
  diets: string[];
  nutritionalInfo?: NutritionalInfo;
  pricePerServing?: number;
  sourceUrl?: string;
  sourceName?: string;
  spoonacularId?: number;
  dateAdded: string;
  lastViewed?: string;
}

export interface RecipeRating {
  recipeId: string;
  rating: number; // 1-5
  review?: string;
  dateRated: string;
}

export interface RecipeSearchQuery {
  query: string;
  filters: {
    cuisines?: string[];
    diets?: string[];
    intolerances?: string[];
    maxReadyTime?: number;
    minCalories?: number;
    maxCalories?: number;
    maxPrice?: number;
  };
  timestamp: string;
}

export interface RecipeState {
  recipes: Record<string, Recipe>; // Keyed by recipe ID
  favorites: string[]; // Recipe IDs
  searchHistory: RecipeSearchQuery[];
  ratings: Record<string, RecipeRating>; // Keyed by recipe ID
  recentlyViewed: string[]; // Recipe IDs, most recent first
  cache: {
    searchResults: Record<string, string[]>; // Search query hash -> recipe IDs
    lastUpdated: Record<string, string>; // Cache timestamps
  };
}

// Meal planning types
export interface MealSlot {
  id: string;
  recipeId?: string;
  customMeal?: string; // For custom meals not from recipes
  notes?: string;
  servings?: number; // Override recipe servings
}

export interface DayPlan {
  date: string; // ISO date string (YYYY-MM-DD)
  breakfast?: MealSlot;
  lunch?: MealSlot;
  dinner?: MealSlot;
  snacks: MealSlot[]; // Array for multiple snacks
}

export interface WeekPlan {
  id: string;
  startDate: string; // ISO date string for Monday of the week
  endDate: string; // ISO date string for Sunday of the week
  days: Record<string, DayPlan>; // Keyed by date (YYYY-MM-DD)
  title?: string;
  notes?: string;
  budget?: number;
  dateCreated: string;
  lastModified: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string; // e.g., 'produce', 'dairy', 'meat'
  checked: boolean;
  estimatedPrice?: number;
  recipeIds: string[]; // Which recipes need this ingredient
}

export interface ShoppingList {
  id: string;
  weekPlanId: string;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  dateGenerated: string;
  lastModified: string;
}

export interface MealPlanTemplate {
  id: string;
  name: string;
  description?: string;
  weekPlan: Omit<WeekPlan, 'id' | 'startDate' | 'endDate' | 'dateCreated' | 'lastModified'>;
  tags: string[];
  isPublic: boolean;
  dateCreated: string;
}

export interface MealPlanState {
  currentWeekPlan?: WeekPlan;
  weekPlans: Record<string, WeekPlan>; // Keyed by week plan ID
  shoppingLists: Record<string, ShoppingList>; // Keyed by shopping list ID
  templates: Record<string, MealPlanTemplate>; // Keyed by template ID
  settings: {
    defaultMealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    shoppingCategories: string[];
    autoGenerateShoppingList: boolean;
  };
}

// Action types for app reducer
export type AppAction =
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_BUDGET_SETTINGS'; payload: Partial<BudgetSettings> }
  | { type: 'SET_THEME'; payload: Partial<ThemePreferences> }
  | { type: 'SET_APP_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATION'; payload: AppState['ui']['notification'] }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_APP' };