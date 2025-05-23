export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  MEAL_PLANNER: '/meal-planner',
  RECIPES: '/recipes',
  SHOPPING_LIST: '/shopping-list',
  PREFERENCES: '/preferences',
  ONBOARDING: '/onboarding',
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.HOME,
  ROUTES.CHAT,
  ROUTES.ONBOARDING,
  ROUTES.NOT_FOUND,
];

export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.MEAL_PLANNER,
  ROUTES.RECIPES,
  ROUTES.SHOPPING_LIST,
  ROUTES.PREFERENCES,
];

export const ROUTE_LABELS: Record<RoutePath, string> = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.CHAT]: 'Chat',
  [ROUTES.MEAL_PLANNER]: 'Meal Planner',
  [ROUTES.RECIPES]: 'Recipes',
  [ROUTES.SHOPPING_LIST]: 'Shopping List',
  [ROUTES.PREFERENCES]: 'Preferences',
  [ROUTES.ONBOARDING]: 'Onboarding',
  [ROUTES.NOT_FOUND]: 'Page Not Found',
} as const;