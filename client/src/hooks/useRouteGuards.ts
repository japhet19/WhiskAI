import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { RoutePath } from '../constants/routes';
import { isProtectedRoute, isPublicRoute } from '../utils/routing';

interface RouteGuardInfo {
  isProtected: boolean;
  isPublic: boolean;
  requiresAuth: boolean;
  requiresOnboarding: boolean;
  canAccess: boolean;
  redirectPath?: RoutePath;
  redirectReason?: string;
}

interface UseRouteGuardsOptions {
  isAuthenticated?: boolean;
  hasCompletedOnboarding?: boolean;
  skipGuards?: boolean;
}

export const useRouteGuards = (options: UseRouteGuardsOptions = {}): RouteGuardInfo => {
  const location = useLocation();
  const {
    isAuthenticated = false,
    hasCompletedOnboarding = false,
    skipGuards = false,
  } = options;

  return useMemo(() => {
    const currentPath = location.pathname as RoutePath;
    const isProtected = isProtectedRoute(currentPath);
    const isPublic = isPublicRoute(currentPath);

    // Skip all guards if requested
    if (skipGuards) {
      return {
        isProtected,
        isPublic,
        requiresAuth: false,
        requiresOnboarding: false,
        canAccess: true,
      };
    }

    // Public routes are always accessible
    if (isPublic) {
      return {
        isProtected: false,
        isPublic: true,
        requiresAuth: false,
        requiresOnboarding: false,
        canAccess: true,
      };
    }

    // Protected routes require authentication
    if (isProtected && !isAuthenticated) {
      return {
        isProtected: true,
        isPublic: false,
        requiresAuth: true,
        requiresOnboarding: false,
        canAccess: false,
        redirectPath: '/onboarding' as RoutePath,
        redirectReason: 'authentication_required',
      };
    }

    // Authenticated users might need onboarding for certain routes
    if (isProtected && isAuthenticated && !hasCompletedOnboarding) {
      return {
        isProtected: true,
        isPublic: false,
        requiresAuth: false,
        requiresOnboarding: true,
        canAccess: false,
        redirectPath: '/onboarding' as RoutePath,
        redirectReason: 'onboarding_required',
      };
    }

    // User can access the route
    return {
      isProtected,
      isPublic,
      requiresAuth: isProtected,
      requiresOnboarding: false,
      canAccess: true,
    };
  }, [location.pathname, isAuthenticated, hasCompletedOnboarding, skipGuards]);
};

export default useRouteGuards;