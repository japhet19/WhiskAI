import { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES, RoutePath } from '../constants/routes';

export const createPath = (route: RoutePath, params?: Record<string, string | number>): string => {
  let path: string = route;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  
  return path;
};

export const isValidRoute = (path: string): path is RoutePath => {
  return Object.values(ROUTES).includes(path as RoutePath);
};

export const isPublicRoute = (path: RoutePath): boolean => {
  return PUBLIC_ROUTES.includes(path);
};

export const isProtectedRoute = (path: RoutePath): boolean => {
  return PROTECTED_ROUTES.includes(path);
};

export const getDefaultRoute = (): RoutePath => {
  return ROUTES.CHAT;
};

export const getFallbackRoute = (): RoutePath => {
  return ROUTES.NOT_FOUND;
};

export const sanitizePath = (path: string): RoutePath => {
  const cleanPath = path.split('?')[0].split('#')[0];
  return isValidRoute(cleanPath) ? cleanPath : getFallbackRoute();
};

export const buildUrl = (
  route: RoutePath, 
  params?: Record<string, string | number>,
  query?: Record<string, string | number>
): string => {
  let url = createPath(route, params);
  
  if (query) {
    const queryString = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [key, String(value)])
    ).toString();
    
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

export const parseQuery = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

export const getRouteTitle = (path: RoutePath): string => {
  const routeMap: Record<RoutePath, string> = {
    [ROUTES.HOME]: 'WhiskAI - AI Meal Planning',
    [ROUTES.CHAT]: 'Chat - WhiskAI',
    [ROUTES.MEAL_PLANNER]: 'Meal Planner - WhiskAI',
    [ROUTES.RECIPES]: 'Recipes - WhiskAI',
    [ROUTES.SHOPPING_LIST]: 'Shopping List - WhiskAI',
    [ROUTES.PREFERENCES]: 'Preferences - WhiskAI',
    [ROUTES.ONBOARDING]: 'Welcome - WhiskAI',
    [ROUTES.NOT_FOUND]: 'Page Not Found - WhiskAI',
  };
  
  return routeMap[path] || 'WhiskAI';
};