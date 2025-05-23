import { RouteObject } from 'react-router-dom';

import { RoutePath } from '../constants/routes';

export interface AppRouteConfig {
  path: RoutePath;
  label: string;
  element: () => any;
  isProtected: boolean;
  showInNavigation: boolean;
  icon?: string;
  description?: string;
}

export interface NavigationItem {
  path: RoutePath;
  label: string;
  icon?: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface RouteGuardProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  fallbackPath?: RoutePath;
}

export interface BreadcrumbItem {
  label: string;
  path?: RoutePath;
  isActive: boolean;
}

export interface NavigationContextValue {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
  goBack: () => void;
  breadcrumbs: BreadcrumbItem[];
  isRouteProtected: (path: RoutePath) => boolean;
}

export type AppRouteObject = RouteObject & {
  meta?: {
    title?: string;
    description?: string;
    isProtected?: boolean;
    showInNavigation?: boolean;
  };
};