import { NavigateFunction } from 'react-router-dom';

import { RoutePath, ROUTES } from '../constants/routes';

export interface RedirectOptions {
  replace?: boolean;
  state?: any;
  preserveQuery?: boolean;
}

export interface RedirectState {
  from?: RoutePath;
  reason?: string;
  timestamp?: number;
  [key: string]: any;
}

export const createRedirectState = (
  from: RoutePath,
  reason?: string,
  additionalState?: any
): RedirectState => {
  return {
    from,
    reason,
    timestamp: Date.now(),
    ...additionalState,
  };
};

export const redirectToOnboarding = (
  navigate: NavigateFunction,
  currentPath: RoutePath,
  reason = 'onboarding_required'
) => {
  const state = createRedirectState(currentPath, reason);
  navigate(ROUTES.ONBOARDING, { replace: true, state });
};

export const redirectToChat = (
  navigate: NavigateFunction,
  currentPath?: RoutePath,
  reason = 'default_redirect'
) => {
  const state = currentPath ? createRedirectState(currentPath, reason) : undefined;
  navigate(ROUTES.CHAT, { replace: true, state });
};

export const redirectToAuth = (
  navigate: NavigateFunction,
  currentPath: RoutePath,
  reason = 'authentication_required'
) => {
  const state = createRedirectState(currentPath, reason);
  // For now, redirect to chat as we don't have dedicated auth pages
  navigate(ROUTES.CHAT, { replace: true, state });
};

export const redirectAfterAuth = (
  navigate: NavigateFunction,
  intendedPath?: RoutePath,
  defaultPath: RoutePath = ROUTES.MEAL_PLANNER
) => {
  const targetPath = intendedPath || defaultPath;
  navigate(targetPath, { replace: true });
};

export const redirectAfterOnboarding = (
  navigate: NavigateFunction,
  intendedPath?: RoutePath,
  defaultPath: RoutePath = ROUTES.MEAL_PLANNER
) => {
  const targetPath = intendedPath || defaultPath;
  navigate(targetPath, { replace: true });
};

export const redirectToNotFound = (
  navigate: NavigateFunction,
  currentPath?: RoutePath
) => {
  const state = currentPath ? createRedirectState(currentPath, 'not_found') : undefined;
  navigate(ROUTES.NOT_FOUND, { replace: true, state });
};

export const getRedirectFromState = (state: any): RoutePath | undefined => {
  if (state && typeof state === 'object' && 'from' in state) {
    return state.from as RoutePath;
  }
  return undefined;
};

export const getRedirectReason = (state: any): string | undefined => {
  if (state && typeof state === 'object' && 'reason' in state) {
    return state.reason as string;
  }
  return undefined;
};

export const shouldRedirect = (
  isAuthenticated: boolean,
  hasCompletedOnboarding: boolean,
  currentPath: RoutePath
): { shouldRedirect: boolean; redirectPath?: RoutePath; reason?: string } => {
  // Public routes that don't require redirection
  const publicRoutes: RoutePath[] = [ROUTES.HOME, ROUTES.CHAT, ROUTES.ONBOARDING, ROUTES.NOT_FOUND];
  
  if (publicRoutes.includes(currentPath)) {
    return { shouldRedirect: false };
  }

  // Check authentication for protected routes
  if (!isAuthenticated) {
    return {
      shouldRedirect: true,
      redirectPath: ROUTES.ONBOARDING,
      reason: 'authentication_required',
    };
  }

  // Check onboarding completion
  if (isAuthenticated && !hasCompletedOnboarding) {
    return {
      shouldRedirect: true,
      redirectPath: ROUTES.ONBOARDING,
      reason: 'onboarding_required',
    };
  }

  return { shouldRedirect: false };
};