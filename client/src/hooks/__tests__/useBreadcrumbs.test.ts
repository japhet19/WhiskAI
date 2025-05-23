import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { useBreadcrumbs } from '../useBreadcrumbs';
import { ROUTES } from '../../constants/routes';

// Mock React Router
const mockLocation = {
  pathname: '/meal-planner',
  search: '',
  state: null,
  hash: '',
  key: 'default',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useBreadcrumbs', () => {
  it('should generate breadcrumbs for a route', () => {
    const { result } = renderHook(() => useBreadcrumbs(), { wrapper });
    
    const breadcrumbs = result.current;
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({
      label: 'Home',
      path: ROUTES.HOME,
      isActive: false,
    });
    expect(breadcrumbs[1]).toEqual({
      label: 'Meal Planner',
      path: undefined,
      isActive: true,
    });
  });

  it('should exclude root when requested', () => {
    const { result } = renderHook(
      () => useBreadcrumbs({ excludeRoot: true }), 
      { wrapper }
    );
    
    const breadcrumbs = result.current;
    
    expect(breadcrumbs).toHaveLength(1);
    expect(breadcrumbs[0].label).toBe('Meal Planner');
    expect(breadcrumbs[0].isActive).toBe(true);
  });

  it('should use custom labels when provided', () => {
    const customLabels = {
      [ROUTES.HOME]: 'Dashboard',
      [ROUTES.MEAL_PLANNER]: 'My Meal Plans',
    };

    const { result } = renderHook(
      () => useBreadcrumbs({ customLabels }), 
      { wrapper }
    );
    
    const breadcrumbs = result.current;
    
    expect(breadcrumbs[0].label).toBe('Dashboard');
    expect(breadcrumbs[1].label).toBe('My Meal Plans');
  });

  it('should handle root route correctly', () => {
    // Mock root location
    const rootMockLocation = { ...mockLocation, pathname: '/' };
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => rootMockLocation,
    }));

    const { result } = renderHook(() => useBreadcrumbs(), { wrapper });
    
    const breadcrumbs = result.current;
    
    expect(breadcrumbs).toHaveLength(1);
    expect(breadcrumbs[0]).toEqual({
      label: 'Home',
      path: ROUTES.HOME,
      isActive: true,
    });
  });
});