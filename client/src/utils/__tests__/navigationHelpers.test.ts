import { NavigationHelper, createNavigationHelper } from '../navigationHelpers';
import { ROUTES } from '../../constants/routes';

describe('NavigationHelper', () => {
  let mockNavigate: jest.Mock;
  let navigationHelper: NavigationHelper;

  beforeEach(() => {
    mockNavigate = jest.fn();
    navigationHelper = new NavigationHelper(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('quick navigation methods', () => {
    it('should navigate to home', () => {
      navigationHelper.toHome();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME, {});
    });

    it('should navigate to chat', () => {
      navigationHelper.toChat();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CHAT, {});
    });

    it('should navigate to meal planner', () => {
      navigationHelper.toMealPlanner();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.MEAL_PLANNER, {});
    });

    it('should navigate to recipes', () => {
      navigationHelper.toRecipes();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.RECIPES, {});
    });

    it('should navigate to shopping list', () => {
      navigationHelper.toShoppingList();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SHOPPING_LIST, {});
    });

    it('should navigate to preferences', () => {
      navigationHelper.toPreferences();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PREFERENCES, {});
    });

    it('should navigate to onboarding', () => {
      navigationHelper.toOnboarding();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ONBOARDING, {});
    });

    it('should navigate to 404', () => {
      navigationHelper.to404();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NOT_FOUND, {});
    });
  });

  describe('navigation with options', () => {
    it('should pass options to navigate', () => {
      const options = { replace: true, state: { from: '/previous' } };
      navigationHelper.toChat(options);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CHAT, options);
    });
  });

  describe('advanced navigation', () => {
    it('should navigate to route with query parameters', () => {
      navigationHelper.toRoute(ROUTES.RECIPES, { 
        query: { category: 'dessert', page: '1' } 
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        '/recipes?category=dessert&page=1', 
        {}
      );
    });

    it('should navigate to route with hash', () => {
      navigationHelper.toRoute(ROUTES.RECIPES, { hash: 'ingredients' });
      expect(mockNavigate).toHaveBeenCalledWith('/recipes#ingredients', {});
    });

    it('should navigate to route with query and hash', () => {
      navigationHelper.toRoute(ROUTES.RECIPES, { 
        query: { id: '123' }, 
        hash: 'instructions',
        replace: true 
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        '/recipes?id=123#instructions', 
        { replace: true }
      );
    });
  });

  describe('navigation with confirmation', () => {
    it('should navigate when user confirms', () => {
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
      
      navigationHelper.toRouteWithConfirmation(
        ROUTES.PREFERENCES, 
        'Are you sure you want to leave?'
      );
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to leave?');
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PREFERENCES, {});
      
      mockConfirm.mockRestore();
    });

    it('should not navigate when user cancels', () => {
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
      
      navigationHelper.toRouteWithConfirmation(
        ROUTES.PREFERENCES, 
        'Are you sure you want to leave?'
      );
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to leave?');
      expect(mockNavigate).not.toHaveBeenCalled();
      
      mockConfirm.mockRestore();
    });
  });

  describe('replace navigation', () => {
    it('should replace current route', () => {
      navigationHelper.replace(ROUTES.CHAT, { state: { replaced: true } });
      expect(mockNavigate).toHaveBeenCalledWith(
        ROUTES.CHAT, 
        { replace: true, state: { replaced: true } }
      );
    });
  });

  describe('back navigation', () => {
    it('should go back when history length > 1', () => {
      Object.defineProperty(window, 'history', {
        value: { length: 2 },
        writable: true,
      });

      navigationHelper.back();
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should navigate to fallback when no history', () => {
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });

      navigationHelper.back(ROUTES.HOME);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
    });

    it('should navigate to default chat when no history and no fallback', () => {
      Object.defineProperty(window, 'history', {
        value: { length: 1 },
        writable: true,
      });

      navigationHelper.back();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CHAT);
    });
  });

  describe('reload', () => {
    it('should reload the page', () => {
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      navigationHelper.reload();
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('open in new tab', () => {
    it('should open route in new tab', () => {
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true,
      });

      navigationHelper.openInNewTab(ROUTES.RECIPES);
      expect(mockOpen).toHaveBeenCalledWith(
        'http://localhost/recipes',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('factory function', () => {
    it('should create navigation helper instance', () => {
      const helper = createNavigationHelper(mockNavigate);
      expect(helper).toBeInstanceOf(NavigationHelper);
      
      helper.toChat();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CHAT, {});
    });
  });
});