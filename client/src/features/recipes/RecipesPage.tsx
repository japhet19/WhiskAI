/* eslint-disable import/order */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRecipes } from '../../contexts/RecipeContext';
import type { Recipe } from '../../contexts/types';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { useRecipeGeneration } from '../../hooks/useRecipeGeneration';

import RecipeCard from './RecipeCard';
import BudgetWarnings from './BudgetWarnings';
import RecipeDetailModal from './RecipeDetailModal';
/* eslint-enable import/order */

interface RecipeFilters {
  search: string;
  cuisines: string[];
  diets: string[];
  maxCookingTime: number | null;
  maxPrice: number | null;
  showFavoritesOnly: boolean;
  showLockedOnly: boolean;
}

const RecipesPage: React.FC = () => {
  const { state: recipeState, actions: recipeActions } = useRecipes();
  const { budget } = useUserPreferences();
  const { state: generationState, actions: generationActions } = useRecipeGeneration();

  const [filters, setFilters] = useState<RecipeFilters>({
    search: '',
    cuisines: [],
    diets: [],
    maxCookingTime: null,
    maxPrice: null,
    showFavoritesOnly: false,
    showLockedOnly: false,
  });

  const [lockedRecipes, setLockedRecipes] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get all recipes as an array
  const allRecipes = Object.values(recipeState.recipes);

  // Available filter options
  const availableCuisines = useMemo(() => {
    const cuisines = new Set<string>();
    allRecipes.forEach((recipe) => {
      recipe.cuisineTypes.forEach((cuisine) => cuisines.add(cuisine));
    });
    return Array.from(cuisines).sort();
  }, [allRecipes]);

  const availableDiets = useMemo(() => {
    const diets = new Set<string>();
    allRecipes.forEach((recipe) => {
      recipe.diets.forEach((diet) => diets.add(diet));
    });
    return Array.from(diets).sort();
  }, [allRecipes]);

  // Filter recipes based on current filters
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Search filter
      if (filters.search && !recipe.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Cuisine filter
      if (
        filters.cuisines.length > 0 &&
        !recipe.cuisineTypes.some((cuisine) => filters.cuisines.includes(cuisine))
      ) {
        return false;
      }

      // Diet filter
      if (filters.diets.length > 0 && !recipe.diets.some((diet) => filters.diets.includes(diet))) {
        return false;
      }

      // Cooking time filter
      if (filters.maxCookingTime && recipe.readyInMinutes > filters.maxCookingTime) {
        return false;
      }

      // Price filter
      if (filters.maxPrice && recipe.pricePerServing && recipe.pricePerServing > filters.maxPrice) {
        return false;
      }

      // Favorites filter
      if (filters.showFavoritesOnly && !recipeState.favorites.includes(recipe.id)) {
        return false;
      }

      // Locked recipes filter
      if (filters.showLockedOnly && !lockedRecipes.has(recipe.id)) {
        return false;
      }

      return true;
    });
  }, [allRecipes, filters, recipeState.favorites, lockedRecipes]);

  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    const budgetPerServing = budget.pricePerServing;
    const recipesWithPrice = filteredRecipes.filter((r) => r.pricePerServing);
    const overBudgetCount = recipesWithPrice.filter(
      (r) => r.pricePerServing! > budgetPerServing
    ).length;
    const averagePrice =
      recipesWithPrice.length > 0
        ? recipesWithPrice.reduce((sum, r) => sum + (r.pricePerServing || 0), 0) /
          recipesWithPrice.length
        : 0;

    return {
      total: filteredRecipes.length,
      withPrice: recipesWithPrice.length,
      overBudget: overBudgetCount,
      averagePrice,
      budgetPerServing,
    };
  }, [filteredRecipes, budget.pricePerServing]);

  const handleGenerateRecipes = async (): Promise<void> => {
    try {
      await generationActions.generateRecipes({
        numberOfRecipes: 12,
      });
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  const handleToggleLock = (recipeId: string): void => {
    const newLocked = new Set(lockedRecipes);
    if (newLocked.has(recipeId)) {
      newLocked.delete(recipeId);
    } else {
      newLocked.add(recipeId);
    }
    setLockedRecipes(newLocked);
  };

  const handleViewDetails = (recipe: Recipe): void => {
    setSelectedRecipe(recipe);
    recipeActions.viewRecipe(recipe.id);
  };

  const resetFilters = (): void => {
    setFilters({
      search: '',
      cuisines: [],
      diets: [],
      maxCookingTime: null,
      maxPrice: null,
      showFavoritesOnly: false,
      showLockedOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
              <p className="text-gray-600 mt-1">
                Discover delicious recipes that fit your preferences and budget
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateRecipes}
              disabled={generationState.isGenerating}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generationState.isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Generate New Recipes
                </>
              )}
            </motion.button>
          </div>

          {/* Budget Stats Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{budgetStats.total}</div>
                  <div className="text-sm text-gray-600">Total Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${budgetStats.averagePrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Price/Serving</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{budgetStats.overBudget}</div>
                  <div className="text-sm text-gray-600">Over Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    ${budgetStats.budgetPerServing.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Budget/Serving</div>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Budget Analysis */}
        {filteredRecipes.length > 0 && (
          <BudgetWarnings
            recipes={filteredRecipes}
            budget={budget}
            showDetailed={false}
            className="mb-6"
          />
        )}

        {/* Error Message */}
        {generationState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="font-medium">Error generating recipes:</span>
              <span>{generationState.error}</span>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filter Recipes</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                      placeholder="Search recipes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Max Cooking Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Cooking Time
                    </label>
                    <select
                      value={filters.maxCookingTime || ''}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxCookingTime: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Any time</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price per Serving
                    </label>
                    <select
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value ? parseFloat(e.target.value) : null,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Any price</option>
                      <option value="5">Under $5</option>
                      <option value="10">Under $10</option>
                      <option value="15">Under $15</option>
                      <option value="20">Under $20</option>
                    </select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Filters
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.showFavoritesOnly}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, showFavoritesOnly: e.target.checked }))
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Favorites only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.showLockedOnly}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, showLockedOnly: e.target.checked }))
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Locked only</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cuisine and Diet Tags */}
                {(availableCuisines.length > 0 || availableDiets.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableCuisines.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cuisines
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableCuisines.map((cuisine) => (
                              <button
                                key={cuisine}
                                onClick={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    cuisines: prev.cuisines.includes(cuisine)
                                      ? prev.cuisines.filter((c) => c !== cuisine)
                                      : [...prev.cuisines, cuisine],
                                  }))
                                }
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  filters.cuisines.includes(cuisine)
                                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {cuisine}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableDiets.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Diets
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableDiets.map((diet) => (
                              <button
                                key={diet}
                                onClick={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    diets: prev.diets.includes(diet)
                                      ? prev.diets.filter((d) => d !== diet)
                                      : [...prev.diets, diet],
                                  }))
                                }
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  filters.diets.includes(diet)
                                    ? 'bg-melon-100 text-melon-800 border border-melon-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {diet}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={handleViewDetails}
                showBudgetInfo={true}
                isLocked={lockedRecipes.has(recipe.id)}
                onToggleLock={handleToggleLock}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && !generationState.isGenerating && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              {allRecipes.length === 0
                ? 'Generate some recipes to get started with your meal planning journey.'
                : "Try adjusting your filters or generate new recipes to find what you're looking for."}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateRecipes}
              disabled={generationState.isGenerating}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
            >
              Generate Recipes
            </motion.button>
          </div>
        )}

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={selectedRecipe !== null}
          onClose={() => setSelectedRecipe(null)}
        />
      </div>
    </div>
  );
};

export default RecipesPage;
