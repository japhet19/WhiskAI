import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoutePath, ROUTES } from '../constants/routes';
import { getRouteConfig } from '../config/routes';
import { isValidRoute, getRouteTitle } from '../utils/routing';

interface UseRouteUtilsReturn {
  // Current route info
  currentRoute: RoutePath;
  currentRouteConfig: ReturnType<typeof getRouteConfig>;
  routeTitle: string;
  
  // Route checking
  isCurrentRoute: (path: RoutePath) => boolean;
  isValidRoute: (path: string) => boolean;
  
  // Route metadata
  getRouteConfig: (path: RoutePath) => ReturnType<typeof getRouteConfig>;
  getRouteTitle: (path: RoutePath) => string;
  
  // Navigation state
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  
  // Route history utilities
  getPreviousRoute: () => RoutePath | null;
  getRouteDepth: () => number;
}

export const useRouteUtils = (): UseRouteUtilsReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  // Current route information
  const currentRoute = useMemo(() => {
    const path = location.pathname;
    return isValidRoute(path) ? (path as RoutePath) : ROUTES.NOT_FOUND;
  }, [location.pathname]);

  const currentRouteConfig = useMemo(() => {
    return getRouteConfig(currentRoute);
  }, [currentRoute]);

  const routeTitle = useMemo(() => {
    return getRouteTitle(currentRoute);
  }, [currentRoute]);

  // Route checking functions
  const isCurrentRouteCheck = useCallback((path: RoutePath) => {
    return currentRoute === path;
  }, [currentRoute]);

  const isValidRouteCheck = useCallback((path: string) => {
    return isValidRoute(path);
  }, []);

  // Route metadata functions
  const getRouteConfigUtil = useCallback((path: RoutePath) => {
    return getRouteConfig(path);
  }, []);

  const getRouteTitleUtil = useCallback((path: RoutePath) => {
    return getRouteTitle(path);
  }, []);

  // Navigation state
  const canNavigateBack = useMemo(() => {
    return window.history.length > 1;
  }, []);

  const canNavigateForward = useMemo(() => {
    // This is simplified - would need proper history tracking for accurate forward navigation
    return false;
  }, []);

  // Route history utilities
  const getPreviousRoute = useCallback((): RoutePath | null => {
    // This is simplified - would need to track route history in context/state
    const state = location.state as { from?: RoutePath } | null;
    return state?.from || null;
  }, [location.state]);

  const getRouteDepth = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.length;
  }, [location.pathname]);

  return {
    // Current route info
    currentRoute,
    currentRouteConfig,
    routeTitle,
    
    // Route checking
    isCurrentRoute: isCurrentRouteCheck,
    isValidRoute: isValidRouteCheck,
    
    // Route metadata
    getRouteConfig: getRouteConfigUtil,
    getRouteTitle: getRouteTitleUtil,
    
    // Navigation state
    canNavigateBack,
    canNavigateForward,
    
    // Route history utilities
    getPreviousRoute,
    getRouteDepth,
  };
};

export default useRouteUtils;