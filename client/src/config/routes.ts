import { ROUTES, RoutePath } from '../constants/routes';
import { AppRouteConfig } from '../types/routing';

export const ROUTE_CONFIG: Record<RoutePath, AppRouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    label: 'Home',
    element: () => import('../pages/HomePage') as any,
    isProtected: false,
    showInNavigation: false,
    description: 'Landing page with app overview',
  },
  [ROUTES.CHAT]: {
    path: ROUTES.CHAT,
    label: 'Chat',
    element: () => import('../pages/ChatPage') as any,
    isProtected: false,
    showInNavigation: true,
    icon: 'MessageCircle',
    description: 'AI-powered meal planning chat',
  },
  [ROUTES.MEAL_PLANNER]: {
    path: ROUTES.MEAL_PLANNER,
    label: 'Meal Planner',
    element: () => import('../pages/MealPlannerPage'),
    isProtected: true,
    showInNavigation: true,
    icon: 'Calendar',
    description: 'Weekly meal planning interface',
  },
  [ROUTES.RECIPES]: {
    path: ROUTES.RECIPES,
    label: 'Recipes',
    element: () => import('../pages/RecipesPage'),
    isProtected: true,
    showInNavigation: true,
    icon: 'ChefHat',
    description: 'Recipe collection and management',
  },
  [ROUTES.SHOPPING_LIST]: {
    path: ROUTES.SHOPPING_LIST,
    label: 'Shopping List',
    element: () => import('../pages/ShoppingListPage'),
    isProtected: true,
    showInNavigation: true,
    icon: 'ShoppingCart',
    description: 'Smart grocery shopping lists',
  },
  [ROUTES.PREFERENCES]: {
    path: ROUTES.PREFERENCES,
    label: 'Preferences',
    element: () => import('../pages/PreferencesPage'),
    isProtected: true,
    showInNavigation: true,
    icon: 'Settings',
    description: 'User preferences and settings',
  },
  [ROUTES.ONBOARDING]: {
    path: ROUTES.ONBOARDING,
    label: 'Get Started',
    element: () => import('../pages/OnboardingPage'),
    isProtected: false,
    showInNavigation: false,
    description: 'User onboarding flow',
  },
  [ROUTES.NOT_FOUND]: {
    path: ROUTES.NOT_FOUND,
    label: 'Not Found',
    element: () => import('../pages/NotFoundPage'),
    isProtected: false,
    showInNavigation: false,
    description: '404 error page',
  },
} as const;

export const getNavigationRoutes = (): AppRouteConfig[] => {
  return Object.values(ROUTE_CONFIG).filter(route => route.showInNavigation);
};

export const getPublicRoutes = (): AppRouteConfig[] => {
  return Object.values(ROUTE_CONFIG).filter(route => !route.isProtected);
};

export const getProtectedRoutes = (): AppRouteConfig[] => {
  return Object.values(ROUTE_CONFIG).filter(route => route.isProtected);
};

export const getRouteConfig = (path: RoutePath): AppRouteConfig | undefined => {
  return ROUTE_CONFIG[path];
};