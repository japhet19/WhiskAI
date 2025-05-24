/* eslint-disable import/order */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useRecipes } from '../../contexts/RecipeContext';
import type { Recipe } from '../../contexts/types';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

import MacroTracker from './MacroTracker';
/* eslint-enable import/order */

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  showBudgetInfo?: boolean;
  isLocked?: boolean;
  onToggleLock?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onViewDetails,
  showBudgetInfo = true,
  isLocked = false,
  onToggleLock,
}) => {
  const { actions: recipeActions, state: recipeState } = useRecipes();
  const { budget } = useUserPreferences();
  const [imageError, setImageError] = useState(false);

  const isFavorite = recipeState.favorites.includes(recipe.id);
  const budgetPerServing = budget.pricePerServing;
  const isOverBudget = recipe.pricePerServing ? recipe.pricePerServing > budgetPerServing : false;

  const handleToggleFavorite = (e: React.MouseEvent): void => {
    e.stopPropagation();
    recipeActions.toggleFavorite(recipe.id);
  };

  const handleToggleLock = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onToggleLock) {
      onToggleLock(recipe.id);
    }
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  const formatCookingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
        hover:shadow-lg transition-all duration-200 cursor-pointer group
        ${isLocked ? 'ring-2 ring-teal-500' : ''}
      `}
      onClick={() => onViewDetails(recipe)}
    >
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-melon-50">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                🍳
              </div>
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Lock/Unlock Button */}
          {onToggleLock && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleLock}
              className={`
                p-2 rounded-full backdrop-blur-sm transition-all
                ${
                  isLocked
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-teal-600'
                }
              `}
              title={isLocked ? 'Unlock recipe' : 'Lock recipe'}
            >
              {isLocked ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              )}
            </motion.button>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`
              p-2 rounded-full backdrop-blur-sm transition-all
              ${
                isFavorite
                  ? 'bg-melon-500 text-white hover:bg-melon-600'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-melon-600'
              }
            `}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className="w-4 h-4"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>
        </div>

        {/* Budget Warning Badge */}
        {showBudgetInfo && isOverBudget && (
          <div className="absolute top-3 left-3">
            <div className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Over Budget
            </div>
          </div>
        )}

        {/* Diet Tags */}
        {recipe.diets.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="flex gap-1 flex-wrap">
              {recipe.diets.slice(0, 2).map((diet) => (
                <span key={diet} className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                  {diet}
                </span>
              ))}
              {recipe.diets.length > 2 && (
                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  +{recipe.diets.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-teal-600 transition-colors">
            {recipe.title}
          </h3>
        </div>

        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        )}

        {/* Recipe Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatCookingTime(recipe.readyInMinutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>

        {/* Budget Information */}
        {showBudgetInfo && recipe.pricePerServing && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Price per serving:</span>
              <span
                className={`font-semibold ${isOverBudget ? 'text-amber-600' : 'text-green-600'}`}
              >
                {formatPrice(recipe.pricePerServing)}
              </span>
            </div>
            {budgetPerServing && (
              <div className="text-xs text-gray-500">Budget: {formatPrice(budgetPerServing)}</div>
            )}
          </div>
        )}

        {/* Nutritional Info Preview */}
        <MacroTracker recipe={recipe} showDetailed={false} className="pt-2" />
      </div>
    </motion.div>
  );
};

export default RecipeCard;
