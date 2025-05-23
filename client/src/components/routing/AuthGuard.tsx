import { motion } from 'framer-motion';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackPath?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null; // TODO: Replace with proper User type
  error: string | null;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  fallbackPath = ROUTES.CHAT // Default to chat for public access
}) => {
  const location = useLocation();

  // TODO: Replace with actual auth context
  const authState: AuthState = {
    isAuthenticated: false, // Will be managed by future auth context
    isLoading: false,
    user: null,
    error: null,
  };

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
          />
          <p className="text-gray-600 text-sm">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Handle authentication requirement
  if (requireAuth && !authState.isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath}
        state={{ 
          from: location.pathname,
          reason: 'authentication_required'
        }} 
        replace 
      />
    );
  }

  // Handle already authenticated users accessing auth pages
  if (!requireAuth && authState.isAuthenticated) {
    const redirectTo = (location.state as any)?.from || ROUTES.MEAL_PLANNER;
    return (
      <Navigate 
        to={redirectTo}
        replace 
      />
    );
  }

  // Render children with auth context
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      data-authenticated={authState.isAuthenticated}
      data-user-id={authState.user?.id}
    >
      {children}
    </motion.div>
  );
};

export default AuthGuard;