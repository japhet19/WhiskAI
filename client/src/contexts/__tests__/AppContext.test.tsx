import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { AppProvider, useAppContext } from '../AppContext';

describe('AppContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide default state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.state.user.preferences.servingSize).toBe(2);
    expect(result.current.state.user.budget.weeklyBudget).toBe(100);
    expect(result.current.state.app.theme.mode).toBe('light');
    expect(result.current.state.ui.isLoading).toBe(false);
  });

  it('should update user preferences', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.actions.updateUserPreferences({
        servingSize: 4,
        cookingTime: 'quick',
      });
    });

    expect(result.current.state.user.preferences.servingSize).toBe(4);
    expect(result.current.state.user.preferences.cookingTime).toBe('quick');
  });

  it('should update budget settings', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.actions.updateBudgetSettings({
        weeklyBudget: 150,
        currency: 'EUR',
      });
    });

    expect(result.current.state.user.budget.weeklyBudget).toBe(150);
    expect(result.current.state.user.budget.currency).toBe('EUR');
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(result.current.state.ui.isLoading).toBe(true);

    act(() => {
      result.current.actions.setLoading(false);
    });

    expect(result.current.state.ui.isLoading).toBe(false);
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.actions.setError('Test error');
    });

    expect(result.current.state.ui.error).toBe('Test error');

    act(() => {
      result.current.actions.setError(null);
    });

    expect(result.current.state.ui.error).toBeNull();
  });

  it('should show and clear notifications', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.actions.showNotification('Test message', 'success');
    });

    expect(result.current.state.ui.notification).toEqual({
      message: 'Test message',
      type: 'success',
    });

    act(() => {
      result.current.actions.clearNotification();
    });

    expect(result.current.state.ui.notification).toBeNull();
  });

  it('should complete onboarding', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.state.user.onboardingCompleted).toBe(false);

    act(() => {
      result.current.actions.completeOnboarding();
    });

    expect(result.current.state.user.onboardingCompleted).toBe(true);
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within AppProvider');

    consoleSpy.mockRestore();
  });
});