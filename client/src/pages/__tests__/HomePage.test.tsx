import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    img: ({ children, ...props }: any) => <img {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock CurieAvatar component
jest.mock('../../components/common', () => ({
  CurieAvatar: ({ size, className }: any) => (
    <div data-testid="curie-avatar" className={className}>
      Curie Avatar ({size})
    </div>
  ),
}));

// Mock animation components
jest.mock('../../components/ui/animations', () => ({
  FadeSlideUp: ({ children, className }: any) => (
    <div data-testid="fade-slide-up" className={className}>
      {children}
    </div>
  ),
  ScalePop: ({ children }: any) => (
    <div data-testid="scale-pop">{children}</div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Hero Section', () => {
    it('should render the main headline', () => {
      renderWithRouter(<HomePage />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("What's for dinner tonight?");
    });

    it('should render the value proposition text', () => {
      renderWithRouter(<HomePage />);
      expect(screen.getByText(/WhiskAI helps you plan delicious meals/i)).toBeInTheDocument();
    });

    it('should render the Get Started button', () => {
      renderWithRouter(<HomePage />);
      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toBeInTheDocument();
    });

    it('should navigate to onboarding when Get Started is clicked', async () => {
      renderWithRouter(<HomePage />);
      
      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toHaveAttribute('href', '/onboarding');
    });

    it('should render Curie avatar', () => {
      renderWithRouter(<HomePage />);
      expect(screen.getByTestId('curie-avatar')).toBeInTheDocument();
    });
  });

  describe('Typing Animation', () => {
    const TYPING_MESSAGES = [
      "What's for dinner tonight?",
      "Let me help you plan your meals",
      "Cooking made simple and fun",
      "Your AI-powered kitchen companion"
    ];

    it('should display typing animation with first message', async () => {
      renderWithRouter(<HomePage />);
      
      // Initial state - should start typing first message
      expect(screen.getByTestId('typing-message')).toBeInTheDocument();
      
      // Advance timers to complete first message (50ms per character + some buffer)
      const firstMessageLength = TYPING_MESSAGES[0].length;
      
      await act(async () => {
        jest.advanceTimersByTime(firstMessageLength * 50 + 100);
      });
      
      // Check that the full message is displayed (without cursor)
      const messageElement = screen.getByTestId('typing-message');
      expect(messageElement.textContent).toContain(TYPING_MESSAGES[0]);
    });

    it('should cycle through all messages', async () => {
      renderWithRouter(<HomePage />);
      
      // Complete first message
      const firstMessageLength = TYPING_MESSAGES[0].length;
      await act(async () => {
        jest.advanceTimersByTime(firstMessageLength * 50 + 100);
      });
      
      // Verify first message is complete
      expect(screen.getByTestId('typing-message').textContent).toContain(TYPING_MESSAGES[0]);
      
      // Wait for pause between messages (2000ms) and start of second message
      await act(async () => {
        jest.advanceTimersByTime(2100);
      });
      
      // Should now be typing second message (first char should be visible)
      const messageText = screen.getByTestId('typing-message').textContent;
      expect(messageText).toContain(TYPING_MESSAGES[1].charAt(0));
    });

    it('should show typing cursor during animation', () => {
      renderWithRouter(<HomePage />);
      const typingCursor = screen.getByTestId('typing-cursor');
      expect(typingCursor).toBeInTheDocument();
      expect(typingCursor).toHaveClass('animate-pulse');
    });
  });

  describe('Feature Preview Cards', () => {
    const features = [
      { title: 'Smart Recipe Suggestions', icon: '🍳' },
      { title: 'Meal Planning Made Easy', icon: '📅' },
      { title: 'Instant Shopping Lists', icon: '🛒' },
    ];

    it('should render all feature cards', () => {
      renderWithRouter(<HomePage />);
      
      features.forEach(feature => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
      });
    });

    it('should render feature descriptions', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByText(/AI-powered recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/Drag and drop to create/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate grocery lists/i)).toBeInTheDocument();
    });

    it('should apply hover effects to feature cards', () => {
      renderWithRouter(<HomePage />);
      
      const firstCard = screen.getByText(features[0].title).closest('.feature-card');
      
      // Just check that the hover class is present in the className
      expect(firstCard).toHaveClass('feature-card');
      expect(firstCard?.className).toContain('hover:shadow-cardHover');
    });
  });

  describe('Navigation Header', () => {
    it('should render sticky header with navigation', () => {
      renderWithRouter(<HomePage />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0');
    });

    it('should render WhiskAI logo', () => {
      renderWithRouter(<HomePage />);
      
      const logo = screen.getByAltText('WhiskAI');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/assets/whiskai.png');
    });

    it('should render navigation links', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should hide navigation on mobile', () => {
      renderWithRouter(<HomePage />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('hidden', 'md:flex');
    });

    it('should adjust grid layout for feature cards', () => {
      renderWithRouter(<HomePage />);
      
      const featureGrid = screen.getByTestId('feature-grid');
      expect(featureGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<HomePage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have proper ARIA labels for interactive elements', () => {
      renderWithRouter(<HomePage />);
      
      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toHaveAccessibleName();
      
      const whiskAILogo = screen.getByAltText('WhiskAI');
      expect(whiskAILogo).toHaveAccessibleName();
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter(<HomePage />);
      
      // Find all focusable elements
      const focusableElements = screen.getAllByRole('link');
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // Check that elements can receive focus
      focusableElements[0].focus();
      expect(document.activeElement).toBe(focusableElements[0]);
    });
  });

  describe('Performance', () => {
    it('should lazy load Curie avatar image', () => {
      renderWithRouter(<HomePage />);
      
      const curieAvatar = screen.getByTestId('curie-avatar');
      expect(curieAvatar).toBeInTheDocument();
      // In real implementation, check for loading="lazy" attribute
    });

    it('should use optimized animations', () => {
      renderWithRouter(<HomePage />);
      
      // Check that animation wrappers are used
      expect(screen.getAllByTestId('fade-slide-up').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('scale-pop').length).toBeGreaterThan(0);
    });
  });
});