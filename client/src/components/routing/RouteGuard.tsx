import { motion } from 'framer-motion';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { RoutePath } from '../../constants/routes';
import { isProtectedRoute, isPublicRoute } from '../../utils/routing';

interface RouteGuardProps {
  children: React.ReactNode;
  loading?: boolean;
}

interface RouteAccessInfo {
  canAccess: boolean;
  requiresAuth: boolean;
  requiresOnboarding: boolean;
  reason?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, loading = false }) => {
  const location = useLocation();
  const currentPath = location.pathname as RoutePath;

  // TODO: Replace with actual auth context
  const isAuthenticated = false;
  const hasCompletedOnboarding = false;

  const getRouteAccess = (path: RoutePath): RouteAccessInfo => {
    const isProtected = isProtectedRoute(path);
    const isPublic = isPublicRoute(path);

    // Public routes are always accessible
    if (isPublic) {
      return {
        canAccess: true,
        requiresAuth: false,
        requiresOnboarding: false,
      };
    }

    // Protected routes require authentication
    if (isProtected && !isAuthenticated) {
      return {
        canAccess: false,
        requiresAuth: true,
        requiresOnboarding: false,
        reason: 'Authentication required',
      };
    }

    // Authenticated users might need onboarding
    if (isProtected && isAuthenticated && !hasCompletedOnboarding) {
      return {
        canAccess: false,
        requiresAuth: false,
        requiresOnboarding: true,
        reason: 'Onboarding required',
      };
    }

    return {
      canAccess: true,
      requiresAuth: isProtected,
      requiresOnboarding: false,
    };
  };

  const routeAccess = getRouteAccess(currentPath);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Render children with route context
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full"
      data-route-protected={routeAccess.requiresAuth}
      data-route-onboarding-required={routeAccess.requiresOnboarding}
    >
      {children}
    </motion.div>
  );
};

export default RouteGuard;