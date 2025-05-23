import { motion } from 'framer-motion';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

interface OnboardingGuardProps {
  children: React.ReactNode;
  skipOnboarding?: boolean;
}

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ 
  children, 
  skipOnboarding = false 
}) => {
  const location = useLocation();

  // TODO: Replace with actual onboarding context
  const onboardingState: OnboardingState = {
    isCompleted: false, // Will be managed by future onboarding context
    currentStep: 1,
    totalSteps: 4,
    completedSteps: [], // e.g., ['preferences', 'dietary-info']
  };

  // TODO: Replace with actual user preferences check
  const hasRequiredPreferences = false;

  // Skip onboarding if explicitly requested or if accessing onboarding route
  if (skipOnboarding || location.pathname === ROUTES.ONBOARDING) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  // Check if onboarding is needed
  const needsOnboarding = !onboardingState.isCompleted || !hasRequiredPreferences;

  // Redirect to onboarding if needed
  if (needsOnboarding) {
    return (
      <Navigate 
        to={ROUTES.ONBOARDING}
        state={{ 
          from: location.pathname,
          step: onboardingState.currentStep,
          reason: !hasRequiredPreferences ? 'preferences' : 'incomplete'
        }} 
        replace 
      />
    );
  }

  // Render children if onboarding is complete
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      data-onboarding-completed="true"
    >
      {children}
    </motion.div>
  );
};

export default OnboardingGuard;