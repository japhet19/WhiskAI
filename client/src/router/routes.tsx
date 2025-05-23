import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { Layout } from '../components/layout';
import { ProtectedRoute } from '../components/routing';
import { ROUTES } from '../constants/routes';
import {
  HomePage,
  ChatPage,
  MealPlannerPage,
  RecipesPage,
  ShoppingListPage,
  PreferencesPage,
  OnboardingPage,
  NotFoundPage,
} from '../pages';

// Loading component for Suspense fallback
const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
);

// Wrapper for Suspense
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: ROUTES.CHAT,
        element: (
          <SuspenseWrapper>
            <ChatPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.MEAL_PLANNER,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <MealPlannerPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.RECIPES,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <RecipesPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SHOPPING_LIST,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <ShoppingListPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PREFERENCES,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <PreferencesPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ONBOARDING,
        element: (
          <SuspenseWrapper>
            <OnboardingPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Layout>
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      </Layout>
    ),
  },
];

export default routes;