import { motion } from 'framer-motion';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES, RoutePath } from '../../constants/routes';
import { RouteGuardProps } from '../../types/routing';

interface ProtectedRouteProps extends RouteGuardProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  fallbackPath?: RoutePath;
  onboardingRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredAuth = true,
  fallbackPath = ROUTES.ONBOARDING,
  onboardingRequired = false,
}) => {
  const location = useLocation();

  // TODO: Replace with actual authentication logic
  const isAuthenticated = false; // Placeholder for future auth
  
  // TODO: Replace with actual onboarding completion check
  const hasCompletedOnboarding = false; // Placeholder for future onboarding

  // TODO: Replace with actual user data
  const _user = null; // Placeholder for future user context

  // Authentication check
  if (requiredAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Onboarding check for authenticated users
  if (isAuthenticated && onboardingRequired && !hasCompletedOnboarding) {
    return (
      <Navigate 
        to={ROUTES.ONBOARDING} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Render children with loading state during auth checks
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;