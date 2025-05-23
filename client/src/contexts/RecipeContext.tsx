import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

import { useLocalStorage } from '../hooks';

import type { Recipe, RecipeRating, RecipeSearchQuery, RecipeState } from './types';

// Default state
const defaultRecipeState: RecipeState = {
  recipes: {},
  favorites: [],
  searchHistory: [],
  ratings: {},
  recentlyViewed: [],
  cache: {
    searchResults: {},
    lastUpdated: {},
  },
};

// Action types for recipe reducer
type RecipeAction =
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'ADD_RECIPES'; payload: Recipe[] }
  | { type: 'UPDATE_RECIPE'; payload: { id: string; updates: Partial<Recipe> } }
  | { type: 'REMOVE_RECIPE'; payload: string }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'ADD_SEARCH_QUERY'; payload: RecipeSearchQuery }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'ADD_RATING'; payload: RecipeRating }
  | { type: 'UPDATE_RATING'; payload: RecipeRating }
  | { type: 'REMOVE_RATING'; payload: string }
  | { type: 'VIEW_RECIPE'; payload: string }
  | { type: 'CACHE_SEARCH_RESULTS'; payload: { query: string; recipeIds: string[] } }
  | { type: 'CLEAR_CACHE' }
  | { type: 'RESET_RECIPES' };

// Context type
interface RecipeContextType {
  state: RecipeState;
  actions: {
    addRecipe: (recipe: Recipe) => void;
    addRecipes: (recipes: Recipe[]) => void;
    updateRecipe: (id: string, updates: Partial<Recipe>) => void;
    removeRecipe: (id: string) => void;
    toggleFavorite: (recipeId: string) => void;
    addSearchQuery: (query: RecipeSearchQuery) => void;
    clearSearchHistory: () => void;
    rateRecipe: (rating: RecipeRating) => void;
    removeRating: (recipeId: string) => void;
    viewRecipe: (recipeId: string) => void;
    cacheSearchResults: (query: string, recipeIds: string[]) => void;
    clearCache: () => void;
    resetRecipes: () => void;
  };
  utils: {
    getRecipe: (id: string) => Recipe | undefined;
    isFavorite: (recipeId: string) => boolean;
    getRecipeRating: (recipeId: string) => RecipeRating | undefined;
    getRecentlyViewedRecipes: () => Recipe[];
    getFavoriteRecipes: () => Recipe[];
    searchRecipes: (query: string) => Recipe[];
    getRecipesByDiet: (diet: string) => Recipe[];
    getRecipesByCuisine: (cuisine: string) => Recipe[];
    getTotalRecipes: () => number;
    getAverageRating: (recipeId: string) => number;
    getCachedSearchResults: (query: string) => string[] | undefined;
  };
}

// Create context
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Reducer function
function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: {
          ...state.recipes,
          [action.payload.id]: action.payload,
        },
      };

    case 'ADD_RECIPES':
      const newRecipes = action.payload.reduce((acc, recipe) => {
        acc[recipe.id] = recipe;
        return acc;
      }, {} as Record<string, Recipe>);

      return {
        ...state,
        recipes: {
          ...state.recipes,
          ...newRecipes,
        },
      };

    case 'UPDATE_RECIPE':
      if (!state.recipes[action.payload.id]) return state;

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [action.payload.id]: {
            ...state.recipes[action.payload.id],
            ...action.payload.updates,
          },
        },
      };

    case 'REMOVE_RECIPE':
      const { [action.payload]: removedRecipe, ...remainingRecipes } = state.recipes;
      return {
        ...state,
        recipes: remainingRecipes,
        favorites: state.favorites.filter((id) => id !== action.payload),
        recentlyViewed: state.recentlyViewed.filter((id) => id !== action.payload),
      };

    case 'ADD_TO_FAVORITES':
      if (state.favorites.includes(action.payload)) return state;
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case 'ADD_SEARCH_QUERY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.slice(0, 49)], // Keep last 50
      };

    case 'CLEAR_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [],
      };

    case 'ADD_RATING':
    case 'UPDATE_RATING':
      return {
        ...state,
        ratings: {
          ...state.ratings,
          [action.payload.recipeId]: action.payload,
        },
      };

    case 'REMOVE_RATING':
      const { [action.payload]: removedRating, ...remainingRatings } = state.ratings;
      return {
        ...state,
        ratings: remainingRatings,
      };

    case 'VIEW_RECIPE':
      const filteredViewed = state.recentlyViewed.filter((id) => id !== action.payload);
      return {
        ...state,
        recentlyViewed: [action.payload, ...filteredViewed.slice(0, 19)], // Keep last 20
        recipes: state.recipes[action.payload]
          ? {
              ...state.recipes,
              [action.payload]: {
                ...state.recipes[action.payload],
                lastViewed: new Date().toISOString(),
              },
            }
          : state.recipes,
      };

    case 'CACHE_SEARCH_RESULTS':
      return {
        ...state,
        cache: {
          ...state.cache,
          searchResults: {
            ...state.cache.searchResults,
            [action.payload.query]: action.payload.recipeIds,
          },
          lastUpdated: {
            ...state.cache.lastUpdated,
            [action.payload.query]: new Date().toISOString(),
          },
        },
      };

    case 'CLEAR_CACHE':
      return {
        ...state,
        cache: {
          searchResults: {},
          lastUpdated: {},
        },
      };

    case 'RESET_RECIPES':
      return defaultRecipeState;

    default:
      return state;
  }
}

// Provider component
export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage for persistence
  const [persistedState, setPersistedState] = useLocalStorage<RecipeState>(
    'whiskai-recipes',
    defaultRecipeState
  );

  // Use reducer for state management
  const [state, dispatch] = useReducer(recipeReducer, persistedState);

  // Persist state changes to localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  // Action creators
  const addRecipe = useCallback((recipe: Recipe) => {
    dispatch({ type: 'ADD_RECIPE', payload: recipe });
  }, []);

  const addRecipes = useCallback((recipes: Recipe[]) => {
    dispatch({ type: 'ADD_RECIPES', payload: recipes });
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates } });
  }, []);

  const removeRecipe = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_RECIPE', payload: id });
  }, []);

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      if (state.favorites.includes(recipeId)) {
        dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: recipeId });
      } else {
        dispatch({ type: 'ADD_TO_FAVORITES', payload: recipeId });
      }
    },
    [state.favorites]
  );

  const addSearchQuery = useCallback((query: RecipeSearchQuery) => {
    dispatch({ type: 'ADD_SEARCH_QUERY', payload: query });
  }, []);

  const clearSearchHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
  }, []);

  const rateRecipe = useCallback((rating: RecipeRating) => {
    dispatch({ type: 'ADD_RATING', payload: rating });
  }, []);

  const removeRating = useCallback((recipeId: string) => {
    dispatch({ type: 'REMOVE_RATING', payload: recipeId });
  }, []);

  const viewRecipe = useCallback((recipeId: string) => {
    dispatch({ type: 'VIEW_RECIPE', payload: recipeId });
  }, []);

  const cacheSearchResults = useCallback((query: string, recipeIds: string[]) => {
    dispatch({ type: 'CACHE_SEARCH_RESULTS', payload: { query, recipeIds } });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  const resetRecipes = useCallback(() => {
    if (window.confirm('Are you sure you want to remove all recipe data?')) {
      dispatch({ type: 'RESET_RECIPES' });
    }
  }, []);

  // Utility functions
  const getRecipe = useCallback(
    (id: string): Recipe | undefined => {
      return state.recipes[id];
    },
    [state.recipes]
  );

  const isFavorite = useCallback(
    (recipeId: string): boolean => {
      return state.favorites.includes(recipeId);
    },
    [state.favorites]
  );

  const getRecipeRating = useCallback(
    (recipeId: string): RecipeRating | undefined => {
      return state.ratings[recipeId];
    },
    [state.ratings]
  );

  const getRecentlyViewedRecipes = useCallback((): Recipe[] => {
    return state.recentlyViewed.map((id) => state.recipes[id]).filter(Boolean);
  }, [state.recentlyViewed, state.recipes]);

  const getFavoriteRecipes = useCallback((): Recipe[] => {
    return state.favorites.map((id) => state.recipes[id]).filter(Boolean);
  }, [state.favorites, state.recipes]);

  const searchRecipes = useCallback(
    (query: string): Recipe[] => {
      const lowerQuery = query.toLowerCase();
      return Object.values(state.recipes).filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowerQuery) ||
          recipe.description?.toLowerCase().includes(lowerQuery) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(lowerQuery)) ||
          recipe.cuisineTypes.some((cuisine) => cuisine.toLowerCase().includes(lowerQuery))
      );
    },
    [state.recipes]
  );

  const getRecipesByDiet = useCallback(
    (diet: string): Recipe[] => {
      return Object.values(state.recipes).filter((recipe) =>
        recipe.diets.some((d) => d.toLowerCase() === diet.toLowerCase())
      );
    },
    [state.recipes]
  );

  const getRecipesByCuisine = useCallback(
    (cuisine: string): Recipe[] => {
      return Object.values(state.recipes).filter((recipe) =>
        recipe.cuisineTypes.some((c) => c.toLowerCase() === cuisine.toLowerCase())
      );
    },
    [state.recipes]
  );

  const getTotalRecipes = useCallback((): number => {
    return Object.keys(state.recipes).length;
  }, [state.recipes]);

  const getAverageRating = useCallback(
    (recipeId: string): number => {
      const rating = state.ratings[recipeId];
      return rating ? rating.rating : 0;
    },
    [state.ratings]
  );

  const getCachedSearchResults = useCallback(
    (query: string): string[] | undefined => {
      return state.cache.searchResults[query];
    },
    [state.cache.searchResults]
  );

  const value: RecipeContextType = {
    state,
    actions: {
      addRecipe,
      addRecipes,
      updateRecipe,
      removeRecipe,
      toggleFavorite,
      addSearchQuery,
      clearSearchHistory,
      rateRecipe,
      removeRating,
      viewRecipe,
      cacheSearchResults,
      clearCache,
      resetRecipes,
    },
    utils: {
      getRecipe,
      isFavorite,
      getRecipeRating,
      getRecentlyViewedRecipes,
      getFavoriteRecipes,
      searchRecipes,
      getRecipesByDiet,
      getRecipesByCuisine,
      getTotalRecipes,
      getAverageRating,
      getCachedSearchResults,
    },
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

// Custom hook
export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider');
  }
  return context;
};

// Export context for testing
export { RecipeContext };