/* eslint-disable import/order */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Recipe } from '../../contexts/types';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

import BudgetWarnings from './BudgetWarnings';
import MacroTracker from './MacroTracker';
/* eslint-enable import/order */

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  const { budget } = useUserPreferences();

  if (!recipe) return null;

  const formatCookingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">{recipe.title}</h2>
                  {recipe.description && <p className="mt-1 text-gray-600">{recipe.description}</p>}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{recipe.servings} servings</span>
                    </div>
                    {recipe.pricePerServing && (
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <span>${recipe.pricePerServing.toFixed(2)}/serving</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recipe Image and Basic Info */}
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-melon-50">
                              <div class="text-center text-gray-500">
                                <div class="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                                  🍳
                                </div>
                                <p class="text-sm">No image available</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* Diet and Cuisine Tags */}
                    <div className="flex flex-wrap gap-2">
                      {recipe.diets.map((diet) => (
                        <span
                          key={diet}
                          className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full"
                        >
                          {diet}
                        </span>
                      ))}
                      {recipe.cuisineTypes.map((cuisine) => (
                        <span
                          key={cuisine}
                          className="px-3 py-1 bg-melon-100 text-melon-800 text-sm rounded-full"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition and Budget Analysis */}
                  <div className="space-y-4">
                    <MacroTracker recipe={recipe} showDetailed={true} />

                    {recipe.pricePerServing && (
                      <BudgetWarnings recipes={[recipe]} budget={budget} showDetailed={true} />
                    )}
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">{ingredient.name}</span>
                        <span className="text-gray-600 text-sm">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                  <div className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Information */}
                {(recipe.sourceUrl || recipe.sourceName) && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Source</h3>
                    {recipe.sourceUrl ? (
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 text-sm underline"
                      >
                        {recipe.sourceName || 'View Original Recipe'}
                      </a>
                    ) : (
                      <span className="text-gray-600 text-sm">{recipe.sourceName}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeDetailModal;
