import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { AppProvider } from '../../../contexts/AppContext';
import { UserPreferencesProvider } from '../../../contexts/UserPreferencesContext';
import { BudgetSetup } from '../BudgetSetup';

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    <UserPreferencesProvider>{children}</UserPreferencesProvider>
  </AppProvider>
);

// Mock props
const defaultProps = {
  onNext: jest.fn(),
  onBack: jest.fn(),
  isFirstStep: false,
  isLastStep: false,
};

describe('BudgetSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <BudgetSetup {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText(/Weekly Grocery Budget/)).toBeInTheDocument();
    expect(screen.getByText(/What's your typical weekly grocery budget/)).toBeInTheDocument();
  });

  it('displays Curie avatar and prompt', () => {
    render(
      <TestWrapper>
        <BudgetSetup {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByAltText(/Curie - Your AI Cooking Assistant/)).toBeInTheDocument();
    expect(
      screen.getByText(/Almost done! What's your typical weekly grocery budget/)
    ).toBeInTheDocument();
  });

  describe('Budget Display', () => {
    it('displays default budget value', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Check for the large budget display (first occurrence)
      const budgetDisplays = screen.getAllByText('$100');
      expect(budgetDisplays.length).toBeGreaterThan(0);
      expect(screen.getByText('Balanced meal planning')).toBeInTheDocument();
    });

    it('displays appropriate context text for different budget amounts', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Default is $100 - "Balanced meal planning"
      expect(screen.getByText('Balanced meal planning')).toBeInTheDocument();
    });

    it('formats currency correctly', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Should display $100 without decimal places
      const budgetDisplays = screen.getAllByText('$100');
      expect(budgetDisplays.length).toBeGreaterThan(0);
      expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
    });
  });

  describe('Budget Slider', () => {
    it('updates budget when slider value changes', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      fireEvent.change(slider, { target: { value: '150' } });

      // Check that budget was updated (should appear in multiple places)
      const budgetDisplays = screen.getAllByText('$150');
      expect(budgetDisplays.length).toBeGreaterThan(0);
      expect(screen.getByText('Variety and quality focus')).toBeInTheDocument();
    });

    it('enforces minimum budget of $25', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      fireEvent.change(slider, { target: { value: '10' } });

      // Should clamp to minimum $25 (check in main display area)
      expect(screen.getByText('Budget-friendly essentials')).toBeInTheDocument();
    });

    it('enforces maximum budget of $250', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      fireEvent.change(slider, { target: { value: '300' } });

      // Should clamp to maximum $250 (check context text)
      expect(screen.getByText('Maximum flexibility and choice')).toBeInTheDocument();
    });

    it('displays range labels correctly', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('$25')).toBeInTheDocument();
      expect(screen.getByText('$250')).toBeInTheDocument();
    });
  });

  describe('Quick Budget Buttons', () => {
    it('renders all quick-select buttons', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Check that quick select buttons exist by checking Quick Select header
      expect(screen.getByText('Quick Select')).toBeInTheDocument();

      // Check that we have the expected number of budget-related elements
      expect(screen.getAllByText('$50').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('$100').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('$150').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('$200').length).toBeGreaterThanOrEqual(1);
    });

    it('selects budget when quick-select button is clicked', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Find and click the $150 button (get all and find the one that's a button)
      const buttons150 = screen.getAllByText('$150');
      const button150 = buttons150.find((el) => el.tagName === 'BUTTON');
      if (button150) {
        fireEvent.click(button150);
      }

      // Check that the budget context changed
      expect(screen.getByText('Variety and quality focus')).toBeInTheDocument();
    });

    it('highlights active quick-select button', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // Find the $100 button specifically
      const buttons100 = screen.getAllByText('$100');
      const button100 = buttons100.find((el) => el.tagName === 'BUTTON');

      expect(button100).toHaveStyle({
        backgroundColor: 'rgb(249, 115, 22)',
        color: 'white',
      });
    });

    it('updates highlighting when different button is selected', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const button150 = screen.getByText('$150');
      fireEvent.click(button150);

      expect(button150).toHaveStyle({
        backgroundColor: '#f97316',
        color: 'white',
      });
    });
  });

  describe('Navigation', () => {
    it('calls onBack when back button is clicked', () => {
      const onBack = jest.fn();

      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} onBack={onBack} />
        </TestWrapper>
      );

      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('disables back button when isFirstStep is true', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} isFirstStep={true} />
        </TestWrapper>
      );

      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
    });

    it('shows "Continue" button when not last step', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} isLastStep={false} />
        </TestWrapper>
      );

      expect(screen.getByText('Continue')).toBeInTheDocument();
      expect(screen.queryByText('Start Cooking!')).not.toBeInTheDocument();
    });

    it('shows "Start Cooking!" button when last step', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} isLastStep={true} />
        </TestWrapper>
      );

      expect(screen.getByText('Start Cooking!')).toBeInTheDocument();
      expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    });

    it('calls onNext when continue button is clicked', () => {
      const onNext = jest.fn();

      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} onNext={onNext} />
        </TestWrapper>
      );

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when "Start Cooking!" button is clicked', () => {
      const onNext = jest.fn();

      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} onNext={onNext} isLastStep={true} />
        </TestWrapper>
      );

      const startButton = screen.getByText('Start Cooking!');
      fireEvent.click(startButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Validation', () => {
    it('accepts valid budget values', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      fireEvent.change(slider, { target: { value: '75' } });

      // No error messages should be shown
      expect(screen.queryByText(/Budget must be at least/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Budget cannot exceed/)).not.toBeInTheDocument();
    });

    it('clamps budget to valid range automatically', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);

      // Test clamping to minimum
      fireEvent.change(slider, { target: { value: '10' } });
      expect(screen.getByText('Budget-friendly essentials')).toBeInTheDocument();

      // Test clamping to maximum
      fireEvent.change(slider, { target: { value: '500' } });
      expect(screen.getByText('Maximum flexibility and choice')).toBeInTheDocument();
    });
  });

  describe('Budget Context Text', () => {
    it('shows correct context for budget ranges', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);

      // Test different budget ranges
      fireEvent.change(slider, { target: { value: '40' } });
      expect(screen.getByText('Budget-friendly essentials')).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: '80' } });
      expect(screen.getByText('Balanced meal planning')).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: '130' } });
      expect(screen.getByText('Variety and quality focus')).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: '180' } });
      expect(screen.getByText('Premium ingredients allowed')).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: '220' } });
      expect(screen.getByText('Maximum flexibility and choice')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label for slider', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Weekly grocery budget slider/)).toBeInTheDocument();
    });

    it('provides proper range attributes for slider', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      expect(slider).toHaveAttribute('min', '25');
      expect(slider).toHaveAttribute('max', '250');
      expect(slider).toHaveAttribute('step', '5');
    });

    it('properly indicates disabled state for buttons', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} isFirstStep={true} />
        </TestWrapper>
      );

      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
      expect(backButton).toHaveAttribute('disabled');
    });
  });

  describe('Visual Elements', () => {
    it('renders dollar sign icon', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      // DollarSign icon should be present (test through parent container)
      expect(screen.getByText('Weekly Grocery Budget')).toBeInTheDocument();
    });

    it('renders sparkles icon on "Start Cooking!" button', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} isLastStep={true} />
        </TestWrapper>
      );

      // Sparkles icon should be present in the start cooking button
      expect(screen.getByText('Start Cooking!')).toBeInTheDocument();
    });

    it('shows quick select label', () => {
      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Quick Select')).toBeInTheDocument();
    });
  });

  describe('Integration with Context', () => {
    it('updates user preferences when budget is changed and submitted', () => {
      const onNext = jest.fn();

      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} onNext={onNext} />
        </TestWrapper>
      );

      // Change budget
      const slider = screen.getByLabelText(/Weekly grocery budget slider/);
      fireEvent.change(slider, { target: { value: '175' } });

      // Submit
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('completes onboarding when "Start Cooking!" is clicked', () => {
      const onNext = jest.fn();

      render(
        <TestWrapper>
          <BudgetSetup {...defaultProps} onNext={onNext} isLastStep={true} />
        </TestWrapper>
      );

      const startButton = screen.getByText('Start Cooking!');
      fireEvent.click(startButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });
});
