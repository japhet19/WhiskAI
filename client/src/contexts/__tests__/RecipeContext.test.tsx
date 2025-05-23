import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { RecipeProvider, useRecipes } from '../RecipeContext';
import type { Recipe } from '../types';

describe('RecipeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecipeProvider>{children}</RecipeProvider>
  );

  const mockRecipe: Recipe = {
    id: 'recipe-1',
    title: 'Test Recipe',
    description: 'A test recipe',
    image: 'https://example.com/image.jpg',
    servings: 4,
    readyInMinutes: 30,
    instructions: ['Step 1', 'Step 2'],
    ingredients: [
      {
        id: 'ing-1',
        name: 'Tomato',
        amount: 2,
        unit: 'pieces',
        originalString: '2 tomatoes',
      },
    ],
    cuisineTypes: ['Italian'],
    dishTypes: ['main course'],
    diets: ['vegetarian'],
    dateAdded: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default state', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    expect(result.current.state.recipes).toEqual({});
    expect(result.current.state.favorites).toEqual([]);
    expect(result.current.state.searchHistory).toEqual([]);
    expect(result.current.utils.getTotalRecipes()).toBe(0);
  });

  it('should add a recipe', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
    });

    expect(result.current.state.recipes['recipe-1']).toEqual(mockRecipe);
    expect(result.current.utils.getTotalRecipes()).toBe(1);
    expect(result.current.utils.getRecipe('recipe-1')).toEqual(mockRecipe);
  });

  it('should add multiple recipes', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    const recipe2: Recipe = { ...mockRecipe, id: 'recipe-2', title: 'Recipe 2' };

    act(() => {
      result.current.actions.addRecipes([mockRecipe, recipe2]);
    });

    expect(result.current.utils.getTotalRecipes()).toBe(2);
    expect(result.current.utils.getRecipe('recipe-1')).toEqual(mockRecipe);
    expect(result.current.utils.getRecipe('recipe-2')).toEqual(recipe2);
  });

  it('should update a recipe', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
    });

    act(() => {
      result.current.actions.updateRecipe('recipe-1', { title: 'Updated Recipe' });
    });

    expect(result.current.utils.getRecipe('recipe-1')?.title).toBe('Updated Recipe');
  });

  it('should remove a recipe', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
      result.current.actions.toggleFavorite('recipe-1');
    });

    expect(result.current.utils.getTotalRecipes()).toBe(1);
    expect(result.current.utils.isFavorite('recipe-1')).toBe(true);

    act(() => {
      result.current.actions.removeRecipe('recipe-1');
    });

    expect(result.current.utils.getTotalRecipes()).toBe(0);
    expect(result.current.utils.getRecipe('recipe-1')).toBeUndefined();
    expect(result.current.utils.isFavorite('recipe-1')).toBe(false);
  });

  it('should manage favorites', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
    });

    expect(result.current.utils.isFavorite('recipe-1')).toBe(false);

    act(() => {
      result.current.actions.toggleFavorite('recipe-1');
    });

    expect(result.current.utils.isFavorite('recipe-1')).toBe(true);
    expect(result.current.utils.getFavoriteRecipes()).toEqual([mockRecipe]);

    act(() => {
      result.current.actions.toggleFavorite('recipe-1');
    });

    expect(result.current.utils.isFavorite('recipe-1')).toBe(false);
    expect(result.current.utils.getFavoriteRecipes()).toEqual([]);
  });

  it('should track recently viewed recipes', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
    });

    act(() => {
      result.current.actions.viewRecipe('recipe-1');
    });

    expect(result.current.state.recentlyViewed).toEqual(['recipe-1']);
    expect(result.current.utils.getRecentlyViewedRecipes()).toHaveLength(1);
    expect(result.current.utils.getRecentlyViewedRecipes()[0].id).toBe('recipe-1');
    expect(result.current.utils.getRecipe('recipe-1')?.lastViewed).toBeDefined();
  });

  it('should manage recipe ratings', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    const rating = {
      recipeId: 'recipe-1',
      rating: 5,
      review: 'Great recipe!',
      dateRated: '2023-01-01T00:00:00Z',
    };

    act(() => {
      result.current.actions.addRecipe(mockRecipe);
      result.current.actions.rateRecipe(rating);
    });

    expect(result.current.utils.getRecipeRating('recipe-1')).toEqual(rating);
    expect(result.current.utils.getAverageRating('recipe-1')).toBe(5);

    act(() => {
      result.current.actions.removeRating('recipe-1');
    });

    expect(result.current.utils.getRecipeRating('recipe-1')).toBeUndefined();
    expect(result.current.utils.getAverageRating('recipe-1')).toBe(0);
  });

  it('should search recipes', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    const recipe2: Recipe = {
      ...mockRecipe,
      id: 'recipe-2',
      title: 'Pasta Dish',
      description: 'A delicious pasta recipe',
      cuisineTypes: ['French'],
      diets: ['vegetarian'],
    };

    act(() => {
      result.current.actions.addRecipes([mockRecipe, recipe2]);
    });

    // Search by title
    expect(result.current.utils.searchRecipes('Test')).toEqual([mockRecipe]);
    expect(result.current.utils.searchRecipes('Pasta')).toEqual([recipe2]);

    // Search by cuisine
    expect(result.current.utils.getRecipesByCuisine('Italian')).toEqual([mockRecipe]);
    expect(result.current.utils.getRecipesByCuisine('French')).toEqual([recipe2]);

    // Search by diet
    expect(result.current.utils.getRecipesByDiet('vegetarian')).toEqual([mockRecipe, recipe2]);
  });

  it('should cache search results', () => {
    const { result } = renderHook(() => useRecipes(), { wrapper });

    act(() => {
      result.current.actions.cacheSearchResults('italian recipes', ['recipe-1', 'recipe-2']);
    });

    expect(result.current.utils.getCachedSearchResults('italian recipes')).toEqual([
      'recipe-1',
      'recipe-2',
    ]);

    act(() => {
      result.current.actions.clearCache();
    });

    expect(result.current.utils.getCachedSearchResults('italian recipes')).toBeUndefined();
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useRecipes());
    }).toThrow('useRecipes must be used within RecipeProvider');

    consoleSpy.mockRestore();
  });
});