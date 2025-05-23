import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { RoutePath, ROUTES } from '../constants/routes';
import { isValidRoute, buildUrl, parseQuery } from '../utils/routing';

interface NavigationOptions {
  replace?: boolean;
  state?: any;
}

interface UseNavigationReturn {
  // Navigation functions
  navigateTo: (path: RoutePath, options?: NavigationOptions) => void;
  navigateWithQuery: (path: RoutePath, query?: Record<string, string>, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  
  // Current route info
  currentPath: RoutePath;
  currentQuery: Record<string, string>;
  isCurrentRoute: (path: RoutePath) => boolean;
  
  // Route utilities
  canGoBack: boolean;
  canGoForward: boolean;
  
  // Redirect utilities
  redirectTo: (path: RoutePath, reason?: string) => void;
  redirectWithState: (path: RoutePath, state: any) => void;
}

export const useNavigation = (): UseNavigationReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current route info
  const currentPath = useMemo(() => {
    const path = location.pathname;
    return isValidRoute(path) ? path : ROUTES.NOT_FOUND;
  }, [location.pathname]);

  const currentQuery = useMemo(() => {
    return parseQuery(location.search);
  }, [location.search]);

  // Navigation functions
  const navigateTo = useCallback((path: RoutePath, options: NavigationOptions = {}) => {
    if (!isValidRoute(path)) {
      console.warn(`Invalid route path: ${path}`);
      return;
    }
    navigate(path, options);
  }, [navigate]);

  const navigateWithQuery = useCallback((
    path: RoutePath, 
    query: Record<string, string> = {}, 
    options: NavigationOptions = {}
  ) => {
    const url = buildUrl(path, undefined, query);
    navigate(url, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  // Route checking
  const isCurrentRoute = useCallback((path: RoutePath) => {
    return currentPath === path;
  }, [currentPath]);

  // History state (simplified - could be enhanced with actual history tracking)
  const canGoBack = useMemo(() => {
    return window.history.length > 1;
  }, []);

  const canGoForward = useMemo(() => {
    return false; // Simplified - would need proper history tracking
  }, []);

  // Redirect utilities
  const redirectTo = useCallback((path: RoutePath, reason?: string) => {
    const state = reason ? { redirectReason: reason, from: currentPath } : { from: currentPath };
    navigate(path, { replace: true, state });
  }, [navigate, currentPath]);

  const redirectWithState = useCallback((path: RoutePath, state: any) => {
    navigate(path, { replace: true, state: { ...state, from: currentPath } });
  }, [navigate, currentPath]);

  return {
    // Navigation functions
    navigateTo,
    navigateWithQuery,
    goBack,
    goForward,
    reload,
    
    // Current route info
    currentPath,
    currentQuery,
    isCurrentRoute,
    
    // Route utilities
    canGoBack,
    canGoForward,
    
    // Redirect utilities
    redirectTo,
    redirectWithState,
  };
};