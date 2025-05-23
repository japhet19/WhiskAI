import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { useNavigation } from '../useNavigation';
import { ROUTES } from '../../constants/routes';

// Mock React Router
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/chat',
  search: '?tab=recipes',
  state: null,
  hash: '',
  key: 'default',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useSearchParams: () => [new URLSearchParams('tab=recipes'), jest.fn()],
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return current path correctly', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    expect(result.current.currentPath).toBe('/chat');
  });

  it('should return current query parameters', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    expect(result.current.currentQuery).toEqual({ tab: 'recipes' });
  });

  it('should navigate to a route', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    result.current.navigateTo(ROUTES.MEAL_PLANNER);
    
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.MEAL_PLANNER, {});
  });

  it('should navigate with options', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    const options = { replace: true, state: { from: '/chat' } };
    
    result.current.navigateTo(ROUTES.RECIPES, options);
    
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.RECIPES, options);
  });

  it('should navigate with query parameters', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    result.current.navigateWithQuery(ROUTES.RECIPES, { category: 'dessert' });
    
    expect(mockNavigate).toHaveBeenCalledWith('/recipes?category=dessert', {});
  });

  it('should check if current route matches', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    expect(result.current.isCurrentRoute(ROUTES.CHAT)).toBe(true);
    expect(result.current.isCurrentRoute(ROUTES.RECIPES)).toBe(false);
  });

  it('should handle redirect with reason', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    result.current.redirectTo(ROUTES.ONBOARDING, 'auth_required');
    
    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.ONBOARDING,
      { 
        replace: true, 
        state: { 
          redirectReason: 'auth_required', 
          from: '/chat' 
        } 
      }
    );
  });

  it('should handle back navigation', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    result.current.goBack();
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should warn for invalid routes', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() => useNavigation(), { wrapper });
    
    result.current.navigateTo('/invalid-route' as any);
    
    expect(consoleSpy).toHaveBeenCalledWith('Invalid route path: /invalid-route');
    expect(mockNavigate).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});