/* eslint-disable import/order */
import React from 'react';
import { motion } from 'framer-motion';

import type { Recipe } from '../../contexts/types';
/* eslint-enable import/order */

interface MacroTrackerProps {
  recipe: Recipe;
  servings?: number;
  showDetailed?: boolean;
  className?: string;
}

const MacroTracker: React.FC<MacroTrackerProps> = ({
  recipe,
  servings = 1,
  showDetailed = false,
  className = '',
}) => {
  if (!recipe.nutritionalInfo) {
    return null;
  }

  const nutrition = recipe.nutritionalInfo;
  const multiplier = servings / recipe.servings;

  // Calculate adjusted values based on serving size
  const adjustedNutrition = {
    calories: Math.round(nutrition.calories * multiplier),
    protein: Math.round(nutrition.protein * multiplier * 10) / 10,
    carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
    fat: Math.round(nutrition.fat * multiplier * 10) / 10,
    fiber: Math.round(nutrition.fiber * multiplier * 10) / 10,
    sugar: Math.round(nutrition.sugar * multiplier * 10) / 10,
    sodium: Math.round(nutrition.sodium * multiplier),
  };

  // Calculate macro percentages (based on calories)
  const proteinCals = adjustedNutrition.protein * 4;
  const carbsCals = adjustedNutrition.carbs * 4;
  const fatCals = adjustedNutrition.fat * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals;

  const macroPercentages =
    totalMacroCals > 0
      ? {
          protein: Math.round((proteinCals / totalMacroCals) * 100),
          carbs: Math.round((carbsCals / totalMacroCals) * 100),
          fat: Math.round((fatCals / totalMacroCals) * 100),
        }
      : { protein: 0, carbs: 0, fat: 0 };

  // Daily value percentages (based on 2000 calorie diet)
  const dailyValues = {
    calories: Math.round((adjustedNutrition.calories / 2000) * 100),
    protein: Math.round((adjustedNutrition.protein / 50) * 100), // 50g daily value
    carbs: Math.round((adjustedNutrition.carbs / 300) * 100), // 300g daily value
    fat: Math.round((adjustedNutrition.fat / 65) * 100), // 65g daily value
    fiber: Math.round((adjustedNutrition.fiber / 25) * 100), // 25g daily value
    sodium: Math.round((adjustedNutrition.sodium / 2300) * 100), // 2300mg daily value
  };

  // const getMacroColor = (macro: 'protein' | 'carbs' | 'fat'): string => {
  //   switch (macro) {
  //     case 'protein': return 'bg-blue-500';
  //     case 'carbs': return 'bg-green-500';
  //     case 'fat': return 'bg-yellow-500';
  //     default: return 'bg-gray-500';
  //   }
  // };

  const getHealthRating = (): { rating: string; color: string; description: string } => {
    const fiberRatio = adjustedNutrition.fiber / adjustedNutrition.carbs;
    const proteinRatio = adjustedNutrition.protein / (adjustedNutrition.calories / 4);
    const sodiumPer100Cal = (adjustedNutrition.sodium / adjustedNutrition.calories) * 100;

    let score = 0;

    // High fiber is good
    if (fiberRatio > 0.1) score += 2;
    else if (fiberRatio > 0.05) score += 1;

    // Good protein content
    if (proteinRatio > 0.2) score += 2;
    else if (proteinRatio > 0.15) score += 1;

    // Low sodium is good
    if (sodiumPer100Cal < 50) score += 2;
    else if (sodiumPer100Cal < 100) score += 1;

    // Moderate calories
    if (adjustedNutrition.calories < 400) score += 1;

    if (score >= 5)
      return {
        rating: 'Excellent',
        color: 'text-green-600',
        description: 'Nutritionally well-balanced',
      };
    if (score >= 3)
      return { rating: 'Good', color: 'text-teal-600', description: 'Good nutritional profile' };
    if (score >= 1)
      return {
        rating: 'Fair',
        color: 'text-yellow-600',
        description: 'Moderate nutritional value',
      };
    return {
      rating: 'Poor',
      color: 'text-red-600',
      description: 'Consider nutritional improvements',
    };
  };

  const healthRating = getHealthRating();

  if (!showDetailed) {
    // Compact version for recipe cards
    return (
      <div className={`flex items-center justify-between text-xs text-gray-500 ${className}`}>
        <span className="font-medium">{adjustedNutrition.calories} cal</span>
        <span>{adjustedNutrition.protein}g protein</span>
        <span>{adjustedNutrition.carbs}g carbs</span>
        <span>{adjustedNutrition.fat}g fat</span>
      </div>
    );
  }

  // Detailed version for recipe details
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Nutrition Facts</h3>
        <div className="text-right">
          <div className={`text-sm font-medium ${healthRating.color}`}>{healthRating.rating}</div>
          <div className="text-xs text-gray-500">{healthRating.description}</div>
        </div>
      </div>

      {servings !== recipe.servings && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
          Adjusted for {servings} serving{servings !== 1 ? 's' : ''} (recipe serves{' '}
          {recipe.servings})
        </div>
      )}

      {/* Main Macros */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{adjustedNutrition.calories}</div>
          <div className="text-xs text-gray-600">Calories</div>
          <div className="text-xs text-gray-500">{dailyValues.calories}% DV</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-blue-600">{adjustedNutrition.protein}g</div>
          <div className="text-xs text-gray-600">Protein</div>
          <div className="text-xs text-gray-500">{dailyValues.protein}% DV</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-green-600">{adjustedNutrition.carbs}g</div>
          <div className="text-xs text-gray-600">Carbs</div>
          <div className="text-xs text-gray-500">{dailyValues.carbs}% DV</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-yellow-600">{adjustedNutrition.fat}g</div>
          <div className="text-xs text-gray-600">Fat</div>
          <div className="text-xs text-gray-500">{dailyValues.fat}% DV</div>
        </div>
      </div>

      {/* Macro Distribution Bar */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Macro Distribution</div>
        <div className="flex rounded-full overflow-hidden h-3 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${macroPercentages.protein}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-blue-500"
            title={`Protein: ${macroPercentages.protein}%`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${macroPercentages.carbs}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-green-500"
            title={`Carbs: ${macroPercentages.carbs}%`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${macroPercentages.fat}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-yellow-500"
            title={`Fat: ${macroPercentages.fat}%`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Protein {macroPercentages.protein}%</span>
          <span>Carbs {macroPercentages.carbs}%</span>
          <span>Fat {macroPercentages.fat}%</span>
        </div>
      </div>

      {/* Additional Nutrients */}
      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fiber</span>
          <div className="text-right">
            <span className="text-sm font-medium">{adjustedNutrition.fiber}g</span>
            <span className="text-xs text-gray-500 ml-2">{dailyValues.fiber}% DV</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Sugar</span>
          <span className="text-sm font-medium">{adjustedNutrition.sugar}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Sodium</span>
          <div className="text-right">
            <span className="text-sm font-medium">{adjustedNutrition.sodium}mg</span>
            <span className="text-xs text-gray-500 ml-2">{dailyValues.sodium}% DV</span>
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-1">Health Insights</div>
        <div className="text-xs text-gray-600 space-y-1">
          {adjustedNutrition.fiber >= 5 && (
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              <span>Good source of fiber</span>
            </div>
          )}
          {adjustedNutrition.protein >= 20 && (
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              <span>High protein content</span>
            </div>
          )}
          {adjustedNutrition.sodium < 400 && (
            <div className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              <span>Low sodium</span>
            </div>
          )}
          {adjustedNutrition.sodium > 800 && (
            <div className="flex items-center gap-1">
              <span className="text-amber-500">!</span>
              <span>High sodium content</span>
            </div>
          )}
          {adjustedNutrition.sugar > 15 && (
            <div className="flex items-center gap-1">
              <span className="text-amber-500">!</span>
              <span>High sugar content</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        * Percent Daily Values are based on a 2000 calorie diet
      </div>
    </div>
  );
};

export default MacroTracker;
