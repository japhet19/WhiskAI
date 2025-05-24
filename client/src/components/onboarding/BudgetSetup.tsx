import { motion } from 'framer-motion';
import { DollarSign, Sparkles } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';

import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { CurieAvatar } from '../common';

interface BudgetSetupProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Quick-select budget amounts
const QUICK_BUDGETS = [50, 100, 150, 200];

// Budget range
const MIN_BUDGET = 25;
const MAX_BUDGET = 250;
const DEFAULT_BUDGET = 100;

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
  if (budget <= 50) return 'Budget-friendly essentials';
  if (budget <= 100) return 'Balanced meal planning';
  if (budget <= 150) return 'Variety and quality focus';
  if (budget <= 200) return 'Premium ingredients allowed';
  return 'Maximum flexibility and choice';
};

export const BudgetSetup: React.FC<BudgetSetupProps> = ({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}) => {
  const { budget: budgetSettings, actions } = useUserPreferences();

  // Local state for budget
  const [budget, setBudget] = useState(budgetSettings.weeklyBudget || DEFAULT_BUDGET);

  // Validation state
  const [errors, setErrors] = useState<string[]>([]);

  // Validate budget
  const validateBudget = useCallback(() => {
    const validationErrors: string[] = [];

    if (budget < MIN_BUDGET) {
      validationErrors.push(`Budget must be at least ${formatCurrency(MIN_BUDGET)}`);
    }
    if (budget > MAX_BUDGET) {
      validationErrors.push(`Budget cannot exceed ${formatCurrency(MAX_BUDGET)}`);
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  }, [budget]);

  // Update validation when budget changes
  useEffect(() => {
    validateBudget();
  }, [validateBudget]);

  // Handle budget change
  const handleBudgetChange = useCallback((newBudget: number) => {
    setBudget(Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, newBudget)));
  }, []);

  // Handle quick budget selection
  const handleQuickBudget = useCallback((amount: number) => {
    setBudget(amount);
  }, []);

  // Handle completion (final step)
  const handleComplete = useCallback(() => {
    if (validateBudget()) {
      // Update context with budget
      actions.updateBudget({
        weeklyBudget: budget,
      });

      // Mark onboarding as complete
      actions.completeOnboarding();

      // Navigate to next step/page
      onNext();
    }
  }, [validateBudget, actions, budget, onNext]);

  // Calculate slider fill percentage
  const fillPercentage = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Curie prompt */}
      <div className="flex items-start space-x-4 mb-8">
        <CurieAvatar size="md" showPulse />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-2xl p-4 flex-1"
        >
          <p className="text-gray-800 leading-relaxed">
            Almost done! What's your typical weekly grocery budget? This helps me suggest recipes
            that fit your spending comfort zone and find the best deals.
          </p>
        </motion.div>
      </div>

      <div className="space-y-8">
        {/* Budget Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Grocery Budget</h3>
          </div>

          {/* Large budget display */}
          <div className="bg-gradient-to-br from-melon-50 to-orange-50 rounded-3xl p-8">
            <div className="text-6xl font-bold text-gray-900 mb-2">{formatCurrency(budget)}</div>
            <div className="text-lg text-gray-600 font-medium">{getBudgetContext(budget)}</div>
            <div className="text-sm text-gray-500 mt-2">per week for groceries</div>
          </div>
        </motion.div>

        {/* Budget Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="relative py-4">
            {/* Slider track background - Using inline styles */}
            <div
              className="relative rounded-full"
              style={{
                height: '24px',
                backgroundColor: '#6b7280', // gray-500 equivalent
              }}
            >
              {/* Gradient fill - Using inline styles */}
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${fillPercentage}%`,
                  background: 'linear-gradient(to right, #f97316, #ea580c)', // orange gradient
                }}
              />
            </div>

            {/* Range input - larger interactive area */}
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step="5"
              value={budget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
              className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
              style={{ height: '56px' }}
              aria-label="Weekly grocery budget slider"
            />

            {/* Slider thumb - Using inline styles */}
            <div
              className="absolute transform -translate-y-1/2 rounded-full"
              style={{
                top: '50%',
                left: `calc(${fillPercentage}% - 16px)`,
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6', // blue-500 equivalent
                border: '4px solid white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                zIndex: 20,
              }}
            />
          </div>

          {/* Range labels */}
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>{formatCurrency(MIN_BUDGET)}</span>
            <span>{formatCurrency(MAX_BUDGET)}</span>
          </div>
        </motion.div>

        {/* Quick Budget Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h4 className="text-center text-sm font-medium text-gray-700">Quick Select</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_BUDGETS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickBudget(amount)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200`}
                style={{
                  backgroundColor: budget === amount ? '#f97316' : 'white',
                  color: budget === amount ? 'white' : '#374151',
                  border: budget === amount ? '2px solid #ea580c' : '2px solid #d1d5db',
                  transform: budget === amount ? 'scale(1.05)' : 'scale(1)',
                  boxShadow:
                    budget === amount
                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error messages */}
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between pt-6"
        >
          <button
            onClick={onBack}
            disabled={isFirstStep}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {isLastStep ? (
            <motion.button
              onClick={handleComplete}
              disabled={errors.length > 0}
              className="relative px-8 py-4 font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)',
                color: 'white',
                border: '2px solid #047857',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Start Cooking!</span>
              </span>

              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={errors.length > 0}
              className="px-8 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#0f766e',
                color: 'white',
                border: '2px solid #115e59',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              Continue
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetSetup;
