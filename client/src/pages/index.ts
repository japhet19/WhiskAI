// Lazy load pages for better performance
import { lazy } from 'react';

export const HomePage = lazy(() => import('./HomePage'));
export const ChatPage = lazy(() => import('./ChatPage'));
export const NotFoundPage = lazy(() => import('./NotFoundPage'));

// Exports for existing pages
export const MealPlannerPage = lazy(() => import('./MealPlannerPage'));
export const RecipesPage = lazy(() => import('./RecipesPage'));
export const ShoppingListPage = lazy(() => import('./ShoppingListPage'));
export const PreferencesPage = lazy(() => import('./PreferencesPage'));
export const OnboardingPage = lazy(() => import('./OnboardingPage'));