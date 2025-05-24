/* eslint-disable import/order */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
/* eslint-enable import/order */

import { BudgetModal } from '../../components/budget';
import type { Recipe, BudgetSettings } from '../../contexts/types';

interface BudgetWarningsProps {
  recipes: Recipe[];
  budget: BudgetSettings;
  showDetailed?: boolean;
  className?: string;
}

interface BudgetAnalysis {
  totalCost: number;
  averageCostPerRecipe: number;
  averageCostPerServing: number;
  overBudgetRecipes: Recipe[];
  budgetUtilization: number;
  weeklyProjection: number;
  savingsOpportunities: string[];
  recommendations: string[];
}

const BudgetWarnings: React.FC<BudgetWarningsProps> = ({
  recipes,
  budget,
  showDetailed = false,
  className = '',
}) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const analyzeBudget = (): BudgetAnalysis => {
    const recipesWithPrice = recipes.filter((r) => r.pricePerServing);
    const totalCost = recipesWithPrice.reduce(
      (sum, recipe) => sum + (recipe.pricePerServing || 0),
      0
    );
    const averageCostPerRecipe =
      recipesWithPrice.length > 0 ? totalCost / recipesWithPrice.length : 0;
    const averageCostPerServing = averageCostPerRecipe;

    const overBudgetRecipes = recipesWithPrice.filter(
      (r) => (r.pricePerServing || 0) > budget.pricePerServing
    );
    const budgetUtilization = (averageCostPerServing / budget.pricePerServing) * 100;

    // Project weekly cost if user makes these recipes
    const weeklyProjection = averageCostPerServing * 21; // 3 meals per day * 7 days

    const savingsOpportunities: string[] = [];
    const recommendations: string[] = [];

    // Generate savings opportunities
    if (overBudgetRecipes.length > 0) {
      savingsOpportunities.push(
        `${overBudgetRecipes.length} recipes exceed your per-serving budget`
      );
    }

    if (budgetUtilization > 100) {
      savingsOpportunities.push(
        'Average cost exceeds budget by ' + (budgetUtilization - 100).toFixed(0) + '%'
      );
    }

    if (weeklyProjection > budget.weeklyBudget) {
      savingsOpportunities.push(
        'Weekly projection exceeds budget by $' +
          (weeklyProjection - budget.weeklyBudget).toFixed(2)
      );
    }

    // Generate recommendations
    if (budgetUtilization > 120) {
      recommendations.push('Consider simpler recipes with fewer expensive ingredients');
      recommendations.push('Look for recipes with seasonal or bulk ingredients');
    } else if (budgetUtilization > 100) {
      recommendations.push('Try substituting expensive ingredients with budget alternatives');
    } else if (budgetUtilization < 70) {
      recommendations.push('You have room to explore premium ingredients');
      recommendations.push('Consider recipes with higher-quality proteins');
    }

    if (overBudgetRecipes.length > recipes.length * 0.3) {
      recommendations.push('Filter recipes by maximum price to stay within budget');
    }

    return {
      totalCost,
      averageCostPerRecipe,
      averageCostPerServing,
      overBudgetRecipes,
      budgetUtilization,
      weeklyProjection,
      savingsOpportunities,
      recommendations,
    };
  };

  const analysis = analyzeBudget();

  const getBudgetStatus = (): { status: string; color: string; icon: string } => {
    if (analysis.budgetUtilization <= 80) {
      return {
        status: 'Under Budget',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: '✓',
      };
    } else if (analysis.budgetUtilization <= 100) {
      return { status: 'On Track', color: 'text-teal-600 bg-teal-50 border-teal-200', icon: '○' };
    } else if (analysis.budgetUtilization <= 120) {
      return {
        status: 'Slightly Over',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        icon: '!',
      };
    } else {
      return { status: 'Over Budget', color: 'text-red-600 bg-red-50 border-red-200', icon: '⚠' };
    }
  };

  const budgetStatus = getBudgetStatus();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budget.currency || 'USD',
    }).format(amount);
  };

  if (recipes.length === 0) {
    return null;
  }

  if (!showDetailed) {
    // Compact version for recipe lists
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border ${budgetStatus.color} ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{budgetStatus.icon}</span>
          <div>
            <div className="font-medium text-sm">{budgetStatus.status}</div>
            <div className="text-xs opacity-75">
              Avg: {formatCurrency(analysis.averageCostPerServing)} / Budget:{' '}
              {formatCurrency(budget.pricePerServing)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{analysis.budgetUtilization.toFixed(0)}%</div>
          <div className="text-xs opacity-75">of budget</div>
        </div>
      </div>
    );
  }

  // Detailed version for budget analysis
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget Analysis</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${budgetStatus.color}`}>
          {budgetStatus.icon} {budgetStatus.status}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(analysis.averageCostPerServing)}
          </div>
          <div className="text-xs text-gray-600">Avg/Serving</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(budget.pricePerServing)}
          </div>
          <div className="text-xs text-gray-600">Budget/Serving</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {analysis.budgetUtilization.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Budget Used</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{analysis.overBudgetRecipes.length}</div>
          <div className="text-xs text-gray-600">Over Budget</div>
        </div>
      </div>

      {/* Budget Utilization Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
          <span className="text-sm text-gray-600">{analysis.budgetUtilization.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(analysis.budgetUtilization, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              analysis.budgetUtilization <= 80
                ? 'bg-green-500'
                : analysis.budgetUtilization <= 100
                  ? 'bg-teal-500'
                  : analysis.budgetUtilization <= 120
                    ? 'bg-amber-500'
                    : 'bg-red-500'
            }`}
          />
          {analysis.budgetUtilization > 100 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(analysis.budgetUtilization - 100, 50)}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-red-300 relative -top-3"
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>{formatCurrency(budget.pricePerServing)}</span>
          {analysis.budgetUtilization > 100 && (
            <span className="text-red-500">+{(analysis.budgetUtilization - 100).toFixed(0)}%</span>
          )}
        </div>
      </div>

      {/* Weekly Projection */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-blue-900">Weekly Projection</div>
            <div className="text-sm text-blue-700">Based on current recipe costs</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-900">
              {formatCurrency(analysis.weeklyProjection)}
            </div>
            <div
              className={`text-sm ${
                analysis.weeklyProjection <= budget.weeklyBudget ? 'text-green-600' : 'text-red-600'
              }`}
            >
              Budget: {formatCurrency(budget.weeklyBudget)}
            </div>
          </div>
        </div>
      </div>

      {/* Savings Opportunities */}
      {analysis.savingsOpportunities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-amber-500">💡</span>
            Savings Opportunities
          </h4>
          <div className="space-y-2">
            {analysis.savingsOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{opportunity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-teal-500">💭</span>
            Recommendations
          </h4>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-teal-500 mt-0.5">•</span>
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Over Budget Recipes */}
      {analysis.overBudgetRecipes.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">
            Over Budget Recipes ({analysis.overBudgetRecipes.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {analysis.overBudgetRecipes.map((recipe) => (
              <div key={recipe.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate">{recipe.title}</span>
                <span className="text-red-600 font-medium ml-2">
                  {formatCurrency(recipe.pricePerServing || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust Budget Button */}
      {showDetailed &&
        (analysis.budgetUtilization > 100 || analysis.overBudgetRecipes.length > 0) && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              Adjust Budget
            </button>
          </div>
        )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onConfirm={(_newBudget) => {
          // The modal handles the context update internally
        }}
      />
    </div>
  );
};

export default BudgetWarnings;
