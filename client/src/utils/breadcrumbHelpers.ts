import { RoutePath, ROUTES, ROUTE_LABELS } from '../constants/routes';

export interface BreadcrumbConfig {
  path: RoutePath;
  label: string;
  showInBreadcrumbs: boolean;
  parentPath?: RoutePath;
}

// Define breadcrumb configuration for each route
export const BREADCRUMB_CONFIG: Record<RoutePath, BreadcrumbConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    label: ROUTE_LABELS[ROUTES.HOME],
    showInBreadcrumbs: true,
  },
  [ROUTES.CHAT]: {
    path: ROUTES.CHAT,
    label: ROUTE_LABELS[ROUTES.CHAT],
    showInBreadcrumbs: true,
    parentPath: ROUTES.HOME,
  },
  [ROUTES.MEAL_PLANNER]: {
    path: ROUTES.MEAL_PLANNER,
    label: ROUTE_LABELS[ROUTES.MEAL_PLANNER],
    showInBreadcrumbs: true,
    parentPath: ROUTES.HOME,
  },
  [ROUTES.RECIPES]: {
    path: ROUTES.RECIPES,
    label: ROUTE_LABELS[ROUTES.RECIPES],
    showInBreadcrumbs: true,
    parentPath: ROUTES.HOME,
  },
  [ROUTES.SHOPPING_LIST]: {
    path: ROUTES.SHOPPING_LIST,
    label: ROUTE_LABELS[ROUTES.SHOPPING_LIST],
    showInBreadcrumbs: true,
    parentPath: ROUTES.HOME,
  },
  [ROUTES.PREFERENCES]: {
    path: ROUTES.PREFERENCES,
    label: ROUTE_LABELS[ROUTES.PREFERENCES],
    showInBreadcrumbs: true,
    parentPath: ROUTES.HOME,
  },
  [ROUTES.ONBOARDING]: {
    path: ROUTES.ONBOARDING,
    label: ROUTE_LABELS[ROUTES.ONBOARDING],
    showInBreadcrumbs: false, // Don't show in breadcrumbs
  },
  [ROUTES.NOT_FOUND]: {
    path: ROUTES.NOT_FOUND,
    label: ROUTE_LABELS[ROUTES.NOT_FOUND],
    showInBreadcrumbs: false, // Don't show in breadcrumbs
  },
};

export const getBreadcrumbConfig = (path: RoutePath): BreadcrumbConfig | undefined => {
  return BREADCRUMB_CONFIG[path];
};

export const shouldShowInBreadcrumbs = (path: RoutePath): boolean => {
  const config = getBreadcrumbConfig(path);
  return config?.showInBreadcrumbs ?? false;
};

export const getParentPath = (path: RoutePath): RoutePath | undefined => {
  const config = getBreadcrumbConfig(path);
  return config?.parentPath;
};

export const buildBreadcrumbChain = (currentPath: RoutePath): RoutePath[] => {
  const chain: RoutePath[] = [];
  let path: RoutePath | undefined = currentPath;

  // Build chain by following parent paths
  while (path && shouldShowInBreadcrumbs(path)) {
    chain.unshift(path);
    path = getParentPath(path);
  }

  return chain;
};

export const getCustomBreadcrumbLabel = (
  path: RoutePath,
  context?: Record<string, any>
): string => {
  const config = getBreadcrumbConfig(path);
  
  if (!config) {
    return path;
  }

  // Add context-specific labeling here
  // For example, if viewing a specific recipe, you might want to show the recipe name
  if (context) {
    switch (path) {
      case ROUTES.RECIPES:
        return context.recipeName ? `Recipe: ${context.recipeName}` : config.label;
      case ROUTES.MEAL_PLANNER:
        return context.weekOf ? `Week of ${context.weekOf}` : config.label;
      default:
        return config.label;
    }
  }

  return config.label;
};