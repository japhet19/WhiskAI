import {
  createPath,
  isValidRoute,
  isPublicRoute,
  isProtectedRoute,
  getDefaultRoute,
  getFallbackRoute,
  sanitizePath,
  buildUrl,
  parseQuery,
  getRouteTitle,
} from '../routing';
import { ROUTES } from '../../constants/routes';

describe('routing utilities', () => {
  describe('createPath', () => {
    it('should return path as-is when no params provided', () => {
      expect(createPath(ROUTES.CHAT)).toBe('/chat');
    });

    it('should replace params in path', () => {
      const path = '/recipes/:id' as any;
      const result = createPath(path, { id: '123' });
      expect(result).toBe('/recipes/123');
    });

    it('should handle multiple params', () => {
      const path = '/users/:userId/recipes/:recipeId' as any;
      const result = createPath(path, { userId: '456', recipeId: '789' });
      expect(result).toBe('/users/456/recipes/789');
    });
  });

  describe('isValidRoute', () => {
    it('should return true for valid routes', () => {
      expect(isValidRoute(ROUTES.CHAT)).toBe(true);
      expect(isValidRoute(ROUTES.MEAL_PLANNER)).toBe(true);
      expect(isValidRoute(ROUTES.NOT_FOUND)).toBe(true);
    });

    it('should return false for invalid routes', () => {
      expect(isValidRoute('/invalid-route')).toBe(false);
      expect(isValidRoute('')).toBe(false);
      expect(isValidRoute('/random/path')).toBe(false);
    });
  });

  describe('isPublicRoute', () => {
    it('should return true for public routes', () => {
      expect(isPublicRoute(ROUTES.HOME)).toBe(true);
      expect(isPublicRoute(ROUTES.CHAT)).toBe(true);
      expect(isPublicRoute(ROUTES.ONBOARDING)).toBe(true);
    });

    it('should return false for protected routes', () => {
      expect(isPublicRoute(ROUTES.MEAL_PLANNER)).toBe(false);
      expect(isPublicRoute(ROUTES.RECIPES)).toBe(false);
      expect(isPublicRoute(ROUTES.PREFERENCES)).toBe(false);
    });
  });

  describe('isProtectedRoute', () => {
    it('should return true for protected routes', () => {
      expect(isProtectedRoute(ROUTES.MEAL_PLANNER)).toBe(true);
      expect(isProtectedRoute(ROUTES.RECIPES)).toBe(true);
      expect(isProtectedRoute(ROUTES.SHOPPING_LIST)).toBe(true);
      expect(isProtectedRoute(ROUTES.PREFERENCES)).toBe(true);
    });

    it('should return false for public routes', () => {
      expect(isProtectedRoute(ROUTES.HOME)).toBe(false);
      expect(isProtectedRoute(ROUTES.CHAT)).toBe(false);
      expect(isProtectedRoute(ROUTES.ONBOARDING)).toBe(false);
    });
  });

  describe('getDefaultRoute', () => {
    it('should return chat route as default', () => {
      expect(getDefaultRoute()).toBe(ROUTES.CHAT);
    });
  });

  describe('getFallbackRoute', () => {
    it('should return 404 route as fallback', () => {
      expect(getFallbackRoute()).toBe(ROUTES.NOT_FOUND);
    });
  });

  describe('sanitizePath', () => {
    it('should return valid paths as-is', () => {
      expect(sanitizePath(ROUTES.CHAT)).toBe(ROUTES.CHAT);
    });

    it('should strip query parameters', () => {
      expect(sanitizePath('/chat?tab=recipes')).toBe(ROUTES.CHAT);
    });

    it('should strip hash fragments', () => {
      expect(sanitizePath('/chat#section')).toBe(ROUTES.CHAT);
    });

    it('should return 404 for invalid paths', () => {
      expect(sanitizePath('/invalid-route')).toBe(ROUTES.NOT_FOUND);
    });
  });

  describe('buildUrl', () => {
    it('should build URL with path only', () => {
      expect(buildUrl(ROUTES.CHAT)).toBe('/chat');
    });

    it('should build URL with query parameters', () => {
      const result = buildUrl(ROUTES.RECIPES, undefined, { category: 'dessert', page: '2' });
      expect(result).toBe('/recipes?category=dessert&page=2');
    });

    it('should build URL with path params and query', () => {
      const path = '/recipes/:id' as any;
      const result = buildUrl(path, { id: '123' }, { view: 'detailed' });
      expect(result).toBe('/recipes/123?view=detailed');
    });
  });

  describe('parseQuery', () => {
    it('should parse empty query string', () => {
      expect(parseQuery('')).toEqual({});
    });

    it('should parse single parameter', () => {
      expect(parseQuery('?tab=recipes')).toEqual({ tab: 'recipes' });
    });

    it('should parse multiple parameters', () => {
      const result = parseQuery('?category=dessert&page=2&sort=name');
      expect(result).toEqual({
        category: 'dessert',
        page: '2',
        sort: 'name',
      });
    });

    it('should handle URL encoded values', () => {
      const result = parseQuery('?query=chocolate%20cake');
      expect(result).toEqual({ query: 'chocolate cake' });
    });
  });

  describe('getRouteTitle', () => {
    it('should return correct titles for all routes', () => {
      expect(getRouteTitle(ROUTES.HOME)).toBe('WhiskAI - AI Meal Planning');
      expect(getRouteTitle(ROUTES.CHAT)).toBe('Chat - WhiskAI');
      expect(getRouteTitle(ROUTES.MEAL_PLANNER)).toBe('Meal Planner - WhiskAI');
      expect(getRouteTitle(ROUTES.RECIPES)).toBe('Recipes - WhiskAI');
      expect(getRouteTitle(ROUTES.SHOPPING_LIST)).toBe('Shopping List - WhiskAI');
      expect(getRouteTitle(ROUTES.PREFERENCES)).toBe('Preferences - WhiskAI');
      expect(getRouteTitle(ROUTES.ONBOARDING)).toBe('Welcome - WhiskAI');
      expect(getRouteTitle(ROUTES.NOT_FOUND)).toBe('Page Not Found - WhiskAI');
    });

    it('should return default title for unknown routes', () => {
      const unknownRoute = '/unknown' as any;
      expect(getRouteTitle(unknownRoute)).toBe('WhiskAI');
    });
  });
});