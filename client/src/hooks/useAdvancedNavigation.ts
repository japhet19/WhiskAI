import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoutePath } from '../constants/routes';
import { createNavigationHelper, NavigationHelper } from '../utils/navigationHelpers';

interface UseAdvancedNavigationReturn {
  // Navigation helper instance
  nav: NavigationHelper;
  
  // Quick navigation methods
  toHome: () => void;
  toChat: () => void;
  toMealPlanner: () => void;
  toRecipes: () => void;
  toShoppingList: () => void;
  toPreferences: () => void;
  toOnboarding: () => void;
  
  // Advanced methods
  goBackOrFallback: (fallback?: RoutePath) => void;
  openInNewTab: (path: RoutePath) => void;
  navigateWithConfirmation: (path: RoutePath, message: string) => void;
  replaceCurrentRoute: (path: RoutePath) => void;
  reloadPage: () => void;
}

export const useAdvancedNavigation = (): UseAdvancedNavigationReturn => {
  const navigate = useNavigate();

  // Create navigation helper instance
  const nav = useMemo(() => {
    return createNavigationHelper(navigate);
  }, [navigate]);

  // Quick navigation methods
  const toHome = useCallback(() => nav.toHome(), [nav]);
  const toChat = useCallback(() => nav.toChat(), [nav]);
  const toMealPlanner = useCallback(() => nav.toMealPlanner(), [nav]);
  const toRecipes = useCallback(() => nav.toRecipes(), [nav]);
  const toShoppingList = useCallback(() => nav.toShoppingList(), [nav]);
  const toPreferences = useCallback(() => nav.toPreferences(), [nav]);
  const toOnboarding = useCallback(() => nav.toOnboarding(), [nav]);

  // Advanced methods
  const goBackOrFallback = useCallback((fallback?: RoutePath) => {
    nav.back(fallback);
  }, [nav]);

  const openInNewTab = useCallback((path: RoutePath) => {
    nav.openInNewTab(path);
  }, [nav]);

  const navigateWithConfirmation = useCallback((path: RoutePath, message: string) => {
    nav.toRouteWithConfirmation(path, message);
  }, [nav]);

  const replaceCurrentRoute = useCallback((path: RoutePath) => {
    nav.replace(path);
  }, [nav]);

  const reloadPage = useCallback(() => {
    nav.reload();
  }, [nav]);

  return {
    // Navigation helper instance
    nav,
    
    // Quick navigation methods
    toHome,
    toChat,
    toMealPlanner,
    toRecipes,
    toShoppingList,
    toPreferences,
    toOnboarding,
    
    // Advanced methods
    goBackOrFallback,
    openInNewTab,
    navigateWithConfirmation,
    replaceCurrentRoute,
    reloadPage,
  };
};

export default useAdvancedNavigation;