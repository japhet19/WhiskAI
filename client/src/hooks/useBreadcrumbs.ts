import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES, ROUTE_LABELS } from '../constants/routes';
import { RoutePath } from '../constants/routes';

export interface BreadcrumbItem {
  label: string;
  path?: RoutePath;
  isActive: boolean;
}

interface UseBreadcrumbsOptions {
  excludeRoot?: boolean;
  customLabels?: Partial<Record<RoutePath, string>>;
}

export const useBreadcrumbs = (options: UseBreadcrumbsOptions = {}): BreadcrumbItem[] => {
  const location = useLocation();
  const { excludeRoot = false, customLabels = {} } = options;

  return useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home/root breadcrumb
    if (!excludeRoot) {
      const isHome = location.pathname === ROUTES.HOME || location.pathname === '/';
      breadcrumbs.push({
        label: customLabels[ROUTES.HOME] || ROUTE_LABELS[ROUTES.HOME],
        path: ROUTES.HOME,
        isActive: isHome,
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routePath = currentPath as RoutePath;
      const isLast = index === pathSegments.length - 1;

      // Check if this is a valid route
      if (Object.values(ROUTES).includes(routePath)) {
        const label = customLabels[routePath] || ROUTE_LABELS[routePath] || segment;
        
        breadcrumbs.push({
          label,
          path: isLast ? undefined : routePath, // Don't make the last item clickable
          isActive: isLast,
        });
      }
    });

    return breadcrumbs;
  }, [location.pathname, excludeRoot, customLabels]);
};

export default useBreadcrumbs;