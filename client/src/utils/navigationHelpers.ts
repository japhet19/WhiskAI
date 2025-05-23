import { NavigateFunction } from 'react-router-dom';

import { RoutePath, ROUTES } from '../constants/routes';
import { buildUrl } from './routing';

export interface NavigationHelperOptions {
  replace?: boolean;
  state?: any;
  preserveQuery?: boolean;
}

export interface QuickNavigationOptions extends NavigationHelperOptions {
  query?: Record<string, string>;
  hash?: string;
}

export class NavigationHelper {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Quick navigation methods
  toHome = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.HOME, options);
  };

  toChat = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.CHAT, options);
  };

  toMealPlanner = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.MEAL_PLANNER, options);
  };

  toRecipes = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.RECIPES, options);
  };

  toShoppingList = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.SHOPPING_LIST, options);
  };

  toPreferences = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.PREFERENCES, options);
  };

  toOnboarding = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.ONBOARDING, options);
  };

  to404 = (options: NavigationHelperOptions = {}): void => {
    this.navigate(ROUTES.NOT_FOUND, options);
  };

  // Advanced navigation methods
  toRoute = (
    path: RoutePath, 
    options: QuickNavigationOptions = {}
  ): void => {
    const { query, hash, ...navigateOptions } = options;
    let url: string = path;

    if (query) {
      url = buildUrl(path, undefined, query);
    }

    if (hash) {
      url += `#${hash}`;
    }

    this.navigate(url, navigateOptions);
  };

  // Navigation with confirmation
  toRouteWithConfirmation = (
    path: RoutePath,
    message: string,
    options: NavigationHelperOptions = {}
  ): void => {
    if (window.confirm(message)) {
      this.navigate(path, options);
    }
  };

  // Replace current route
  replace = (path: RoutePath, options: Omit<NavigationHelperOptions, 'replace'> = {}): void => {
    this.navigate(path, { ...options, replace: true });
  };

  // Go back with fallback
  back = (fallbackPath?: RoutePath): void => {
    if (window.history.length > 1) {
      this.navigate(-1);
    } else if (fallbackPath) {
      this.navigate(fallbackPath);
    } else {
      this.navigate(ROUTES.CHAT);
    }
  };

  // Reload current page
  reload = (): void => {
    window.location.reload();
  };

  // Open in new tab
  openInNewTab = (path: RoutePath): void => {
    const url = new URL(path, window.location.origin);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };
}

// Factory function to create navigation helper
export const createNavigationHelper = (navigate: NavigateFunction): NavigationHelper => {
  return new NavigationHelper(navigate);
};

// Standalone utility functions
export const getNavigationMethods = (navigate: NavigateFunction) => {
  const helper = new NavigationHelper(navigate);
  
  return {
    toHome: helper.toHome,
    toChat: helper.toChat,
    toMealPlanner: helper.toMealPlanner,
    toRecipes: helper.toRecipes,
    toShoppingList: helper.toShoppingList,
    toPreferences: helper.toPreferences,
    toOnboarding: helper.toOnboarding,
    to404: helper.to404,
    toRoute: helper.toRoute,
    toRouteWithConfirmation: helper.toRouteWithConfirmation,
    replace: helper.replace,
    back: helper.back,
    reload: helper.reload,
    openInNewTab: helper.openInNewTab,
  };
};