import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, AlertTriangle, Check } from 'lucide-react';
import React, { useState, useCallback, useEffect, useRef } from 'react';

import { useRecipes } from '../../contexts/RecipeContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (newBudget: number) => void;
}

// Quick-select budget amounts
const QUICK_BUDGETS = [50, 75, 100, 125, 150, 200, 250];

// Budget range
const MIN_BUDGET = 25;
const MAX_BUDGET = 300;

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get budget context text
const getBudgetContext = (budget: number): string => {
  if (budget <= 50) return 'Essential ingredients only';
  if (budget <= 75) return 'Basic meal planning';
  if (budget <= 100) return 'Balanced variety';
  if (budget <= 150) return 'Good ingredient quality';
  if (budget <= 200) return 'Premium options available';
  return 'Maximum flexibility';
};

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { budget: currentBudget, actions } = useUserPreferences();
  const { state } = useRecipes();
  const recipes = Object.values(state.recipes);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Local state for budget adjustment
  const [newBudget, setNewBudget] = useState(currentBudget.weeklyBudget || 100);
  const [isConfirming, setIsConfirming] = useState(false);

  // Reset budget when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewBudget(currentBudget.weeklyBudget || 100);
      setIsConfirming(false);
    }
  }, [isOpen, currentBudget.weeklyBudget]);

  // Focus management
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Calculate conflict analysis
  const getConflictAnalysis = useCallback(() => {
    // For now, consider favorited recipes as "locked" since there's no explicit lock state
    const lockedRecipes = recipes.filter((recipe) => state.favorites.includes(recipe.id));
    const lockedRecipesCost = lockedRecipes.reduce((total, recipe) => {
      return total + (recipe.pricePerServing || 0);
    }, 0);

    // Calculate weekly cost projection for locked recipes
    const weeklyLockedCost = lockedRecipesCost * 7; // Assume one serving per day
    const perServingBudget = newBudget / 21; // 21 meals per week

    const conflictingRecipes = lockedRecipes.filter(
      (recipe) => (recipe.pricePerServing || 0) > perServingBudget
    );

    return {
      lockedRecipes,
      lockedRecipesCost,
      weeklyLockedCost,
      conflictingRecipes,
      hasConflicts: conflictingRecipes.length > 0 || weeklyLockedCost > newBudget,
      perServingBudget,
    };
  }, [recipes, newBudget, state.favorites]);

  const conflict = getConflictAnalysis();

  // Handle budget change
  const handleBudgetChange = useCallback((budget: number) => {
    setNewBudget(Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, budget)));
  }, []);

  // Handle quick budget selection
  const handleQuickBudget = useCallback((amount: number) => {
    setNewBudget(amount);
  }, []);

  // Handle confirm
  const handleConfirm = useCallback(async () => {
    setIsConfirming(true);

    try {
      // Update budget in context
      actions.updateBudget({
        weeklyBudget: newBudget,
        pricePerServing: newBudget / 21, // 21 meals per week
      });

      // Call optional callback
      onConfirm?.(newBudget);

      // Close modal
      onClose();
    } catch (error) {
      console.error('Failed to update budget:', error);
    } finally {
      setIsConfirming(false);
    }
  }, [newBudget, actions, onConfirm, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Calculate slider fill percentage
  const fillPercentage = ((newBudget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        {/* Backdrop with blur */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h2 id="budget-modal-title" className="text-xl font-semibold text-gray-900">
                  Adjust Weekly Budget
                </h2>
              </div>
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current vs New Budget Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Current Budget</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(currentBudget.weeklyBudget || 100)}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-melon-50 to-orange-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">New Budget</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(newBudget)}
                  </div>
                </div>
              </div>

              {/* Budget context */}
              <div className="text-center">
                <div className="text-lg text-gray-700 font-medium">
                  {getBudgetContext(newBudget)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  About {formatCurrency(newBudget / 21)} per meal
                </div>
              </div>

              {/* Conflict Warning */}
              {conflict.hasConflicts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">Budget Conflict Detected</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        {conflict.conflictingRecipes.length > 0 && (
                          <>
                            You have {conflict.conflictingRecipes.length} locked recipe(s) that
                            exceed your new per-meal budget of{' '}
                            {formatCurrency(conflict.perServingBudget)}.
                          </>
                        )}
                        {conflict.weeklyLockedCost > newBudget && (
                          <>
                            Your locked recipes would cost{' '}
                            {formatCurrency(conflict.weeklyLockedCost)} per week, exceeding your
                            budget by {formatCurrency(conflict.weeklyLockedCost - newBudget)}.
                          </>
                        )}
                      </p>
                      {conflict.conflictingRecipes.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-amber-600 font-medium">
                            Conflicting recipes:
                          </div>
                          <div className="text-xs text-amber-700 mt-1">
                            {conflict.conflictingRecipes.map((recipe) => recipe.title).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Budget Slider */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Weekly Budget: {formatCurrency(newBudget)}
                </label>

                <div className="relative py-4">
                  {/* Slider track background */}
                  <div className="relative rounded-full h-6 bg-gray-300">
                    {/* Gradient fill */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>

                  {/* Range input */}
                  <input
                    type="range"
                    min={MIN_BUDGET}
                    max={MAX_BUDGET}
                    step="5"
                    value={newBudget}
                    onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
                    className="absolute top-0 left-0 w-full h-14 opacity-0 cursor-pointer"
                    aria-label="Weekly grocery budget slider"
                  />

                  {/* Slider thumb */}
                  <div
                    className="absolute top-1/2 w-8 h-8 bg-blue-500 border-4 border-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-4"
                    style={{ left: `${fillPercentage}%` }}
                  />
                </div>

                {/* Range labels */}
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>{formatCurrency(MIN_BUDGET)}</span>
                  <span>{formatCurrency(MAX_BUDGET)}</span>
                </div>
              </div>

              {/* Quick Budget Buttons */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Quick Select</div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_BUDGETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleQuickBudget(amount)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        newBudget === amount
                          ? 'bg-orange-500 text-white border-2 border-orange-600 scale-105 shadow-md'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isConfirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Update Budget</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetModal;
