import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CurieAvatar } from '../components/common';
import { DietaryPreferences, TimeAndServings, BudgetSetup } from '../components/onboarding';
import { ROUTES } from '../constants/routes';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

// Onboarding step types
type OnboardingStep = 'welcome' | 'dietary' | 'cooking' | 'budget' | 'complete';

interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Step components (placeholders for now - will be implemented in subsequent tasks)
const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext }) => (
  <div className="text-center py-8">
    <CurieAvatar size="xl" className="mx-auto mb-6" showPulse />
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to WhiskAI!</h2>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      I'm Curie, your AI cooking assistant. Let's set up your preferences to create the perfect meal
      plans just for you.
    </p>
    <button
      onClick={onNext}
      className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Let's Get Started
    </button>
  </div>
);

const DietaryStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}) => (
  <DietaryPreferences
    onNext={onNext}
    onBack={onBack}
    isFirstStep={isFirstStep}
    isLastStep={isLastStep}
  />
);

const CookingStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}) => (
  <TimeAndServings
    onNext={onNext}
    onBack={onBack}
    isFirstStep={isFirstStep}
    isLastStep={isLastStep}
  />
);

const BudgetStep: React.FC<OnboardingStepProps> = ({ onNext, onBack, isFirstStep, isLastStep }) => (
  <BudgetSetup onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />
);

const CompleteStep: React.FC<OnboardingStepProps> = () => {
  const navigate = useNavigate();
  const { actions } = useUserPreferences();

  const handleComplete = useCallback(() => {
    actions.completeOnboarding();
    navigate(ROUTES.RECIPES);
  }, [actions, navigate]);

  return (
    <div className="text-center py-8">
      <CurieAvatar size="xl" className="mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Great! I now have everything I need to create amazing meal plans tailored just for you.
      </p>
      <button
        onClick={handleComplete}
        className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Start Meal Planning
      </button>
    </div>
  );
};

// Progress indicator component
const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
            }`}
            initial={{ scale: 0.8 }}
            animate={{
              scale: index === currentStep ? 1.2 : 1,
              backgroundColor: index <= currentStep ? '#0d9488' : '#d1d5db',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

const OnboardingPage: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: OnboardingStepConfig[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: "Let's get started",
      component: WelcomeStep,
    },
    {
      id: 'dietary',
      title: 'Dietary Preferences',
      description: 'Tell us about your dietary needs',
      component: DietaryStep,
    },
    {
      id: 'cooking',
      title: 'Cooking Preferences',
      description: 'How do you like to cook?',
      component: CookingStep,
    },
    {
      id: 'budget',
      title: 'Budget Setup',
      description: 'Set your grocery budget',
      component: BudgetStep,
    },
    {
      id: 'complete',
      title: 'Complete',
      description: "You're all set!",
      component: CompleteStep,
    },
  ];

  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex flex-col"
    >
      {/* Header with Curie */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <CurieAvatar size="md" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">WhiskAI Setup</h1>
            <p className="text-sm text-gray-500">{currentStep.description}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Progress indicator */}
      <ProgressIndicator currentStep={currentStepIndex} totalSteps={steps.length} />

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <CurrentStepComponent
                onNext={handleNext}
                onBack={handleBack}
                isFirstStep={currentStepIndex === 0}
                isLastStep={currentStepIndex === steps.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingPage;
