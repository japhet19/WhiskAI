import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

import { useLocalStorage } from '../hooks';

import { useRecipes } from './RecipeContext';
import type {
  MealPlanState,
  WeekPlan,
  DayPlan,
  MealSlot,
  ShoppingList,
  ShoppingListItem,
  MealPlanTemplate,
} from './types';

// Default state
const defaultMealPlanState: MealPlanState = {
  weekPlans: {},
  shoppingLists: {},
  templates: {},
  settings: {
    defaultMealTimes: {
      breakfast: '08:00',
      lunch: '12:00',
      dinner: '18:00',
    },
    shoppingCategories: [
      'Produce',
      'Dairy & Eggs',
      'Meat & Seafood',
      'Pantry',
      'Frozen',
      'Bakery',
      'Beverages',
      'Other',
    ],
    autoGenerateShoppingList: true,
  },
};

// Drag and drop types
export interface DragData {
  type: 'recipe' | 'meal';
  recipeId?: string;
  mealSlot?: {
    weekPlanId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    mealId: string;
  };
}

export interface DropTarget {
  weekPlanId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

// Action types for meal plan reducer
type MealPlanAction =
  | { type: 'CREATE_WEEK_PLAN'; payload: WeekPlan }
  | { type: 'UPDATE_WEEK_PLAN'; payload: { id: string; updates: Partial<WeekPlan> } }
  | { type: 'DELETE_WEEK_PLAN'; payload: string }
  | { type: 'SET_CURRENT_WEEK_PLAN'; payload: string }
  | {
      type: 'ADD_MEAL_TO_SLOT';
      payload: {
        weekPlanId: string;
        date: string;
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
        meal: MealSlot;
      };
    }
  | {
      type: 'REMOVE_MEAL_FROM_SLOT';
      payload: {
        weekPlanId: string;
        date: string;
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
        mealId?: string;
      };
    }
  | {
      type: 'UPDATE_MEAL_SLOT';
      payload: {
        weekPlanId: string;
        date: string;
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
        mealId: string;
        updates: Partial<MealSlot>;
      };
    }
  | { type: 'MOVE_MEAL'; payload: { from: DropTarget & { mealId: string }; to: DropTarget } }
  | { type: 'GENERATE_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: { id: string; updates: Partial<ShoppingList> } }
  | { type: 'TOGGLE_SHOPPING_ITEM'; payload: { listId: string; itemId: string } }
  | { type: 'CREATE_TEMPLATE'; payload: MealPlanTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<MealPlanState['settings']> }
  | { type: 'RESET_MEAL_PLANS' };

// Context type
interface MealPlanContextType {
  state: MealPlanState;
  actions: {
    createWeekPlan: (startDate: string, title?: string) => string;
    updateWeekPlan: (id: string, updates: Partial<WeekPlan>) => void;
    deleteWeekPlan: (id: string) => void;
    setCurrentWeekPlan: (id: string) => void;
    addMealToSlot: (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      recipeId: string,
      servings?: number
    ) => void;
    removeMealFromSlot: (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      mealId?: string
    ) => void;
    updateMealSlot: (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      mealId: string,
      updates: Partial<MealSlot>
    ) => void;
    moveMeal: (from: DropTarget & { mealId: string }, to: DropTarget) => void;
    handleDrop: (dragData: DragData, dropTarget: DropTarget) => void;
    generateShoppingList: (weekPlanId: string) => string;
    updateShoppingList: (id: string, updates: Partial<ShoppingList>) => void;
    toggleShoppingItem: (listId: string, itemId: string) => void;
    createTemplate: (
      weekPlanId: string,
      name: string,
      description?: string,
      tags?: string[]
    ) => string;
    deleteTemplate: (id: string) => void;
    applyTemplate: (templateId: string, startDate: string) => string;
    updateSettings: (updates: Partial<MealPlanState['settings']>) => void;
    resetMealPlans: () => void;
  };
  utils: {
    getCurrentWeekPlan: () => WeekPlan | undefined;
    getWeekPlan: (id: string) => WeekPlan | undefined;
    getWeekPlanForDate: (date: string) => WeekPlan | undefined;
    getShoppingList: (id: string) => ShoppingList | undefined;
    getShoppingListForWeekPlan: (weekPlanId: string) => ShoppingList | undefined;
    getMealSlot: (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
    ) => MealSlot | MealSlot[] | undefined;
    getWeekNutrition: (weekPlanId: string) => {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    getWeekBudget: (weekPlanId: string) => number;
    getDayMeals: (weekPlanId: string, date: string) => DayPlan | undefined;
    generateWeekDates: (startDate: string) => string[];
  };
}

// Create context
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Helper functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getWeekStartDate(date: string): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function getWeekEndDate(startDate: string): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end.toISOString().split('T')[0];
}

function categorizeIngredient(ingredient: string): string {
  const categories = {
    Produce: [
      'lettuce',
      'tomato',
      'onion',
      'garlic',
      'potato',
      'carrot',
      'apple',
      'banana',
      'spinach',
      'broccoli',
    ],
    'Dairy & Eggs': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg'],
    'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey'],
    Pantry: ['flour', 'sugar', 'rice', 'pasta', 'oil', 'salt', 'pepper', 'spice'],
    Frozen: ['frozen'],
    Bakery: ['bread', 'roll', 'bagel'],
    Beverages: ['juice', 'water', 'soda', 'coffee', 'tea'],
  };

  const lowerIngredient = ingredient.toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => lowerIngredient.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}

// Reducer function
function mealPlanReducer(state: MealPlanState, action: MealPlanAction): MealPlanState {
  switch (action.type) {
    case 'CREATE_WEEK_PLAN':
      return {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [action.payload.id]: action.payload,
        },
        currentWeekPlan: action.payload,
      };

    case 'UPDATE_WEEK_PLAN':
      if (!state.weekPlans[action.payload.id]) return state;

      const updatedWeekPlan = {
        ...state.weekPlans[action.payload.id],
        ...action.payload.updates,
        lastModified: new Date().toISOString(),
      };

      return {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [action.payload.id]: updatedWeekPlan,
        },
        currentWeekPlan:
          state.currentWeekPlan?.id === action.payload.id ? updatedWeekPlan : state.currentWeekPlan,
      };

    case 'DELETE_WEEK_PLAN':
      const { [action.payload]: _deletedPlan, ...remainingPlans } = state.weekPlans;
      return {
        ...state,
        weekPlans: remainingPlans,
        currentWeekPlan:
          state.currentWeekPlan?.id === action.payload ? undefined : state.currentWeekPlan,
        shoppingLists: Object.fromEntries(
          Object.entries(state.shoppingLists).filter(
            ([_, list]) => list.weekPlanId !== action.payload
          )
        ),
      };

    case 'SET_CURRENT_WEEK_PLAN':
      return {
        ...state,
        currentWeekPlan: state.weekPlans[action.payload],
      };

    case 'ADD_MEAL_TO_SLOT': {
      const { weekPlanId, date, mealType, meal } = action.payload;
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan) return state;

      const dayPlan = weekPlan.days[date] || { date };
      let updatedDayPlan: DayPlan;

      if (mealType === 'snacks') {
        updatedDayPlan = {
          ...dayPlan,
          snacks: [...(dayPlan.snacks || []), meal],
        };
      } else {
        updatedDayPlan = {
          ...dayPlan,
          [mealType]: meal,
        };
      }

      const updatedWeekPlan = {
        ...weekPlan,
        days: {
          ...weekPlan.days,
          [date]: updatedDayPlan,
        },
        lastModified: new Date().toISOString(),
      };

      return {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [weekPlanId]: updatedWeekPlan,
        },
        currentWeekPlan:
          state.currentWeekPlan?.id === weekPlanId ? updatedWeekPlan : state.currentWeekPlan,
      };
    }

    case 'REMOVE_MEAL_FROM_SLOT': {
      const { weekPlanId, date, mealType, mealId } = action.payload;
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan || !weekPlan.days[date]) return state;

      const dayPlan = weekPlan.days[date];
      let updatedDayPlan: DayPlan;

      if (mealType === 'snacks') {
        updatedDayPlan = {
          ...dayPlan,
          snacks: mealId ? dayPlan.snacks?.filter((snack) => snack.id !== mealId) || [] : [],
        };
      } else {
        updatedDayPlan = {
          ...dayPlan,
          [mealType]: undefined,
        };
      }

      const updatedWeekPlan = {
        ...weekPlan,
        days: {
          ...weekPlan.days,
          [date]: updatedDayPlan,
        },
        lastModified: new Date().toISOString(),
      };

      return {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [weekPlanId]: updatedWeekPlan,
        },
        currentWeekPlan:
          state.currentWeekPlan?.id === weekPlanId ? updatedWeekPlan : state.currentWeekPlan,
      };
    }

    case 'UPDATE_MEAL_SLOT': {
      const { weekPlanId, date, mealType, mealId, updates } = action.payload;
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan || !weekPlan.days[date]) return state;

      const dayPlan = weekPlan.days[date];
      let updatedDayPlan: DayPlan;

      if (mealType === 'snacks') {
        updatedDayPlan = {
          ...dayPlan,
          snacks:
            dayPlan.snacks?.map((snack) =>
              snack.id === mealId ? { ...snack, ...updates } : snack
            ) || [],
        };
      } else {
        const currentMeal = dayPlan[mealType] as MealSlot;
        if (currentMeal && currentMeal.id === mealId) {
          updatedDayPlan = {
            ...dayPlan,
            [mealType]: { ...currentMeal, ...updates },
          };
        } else {
          return state;
        }
      }

      const updatedWeekPlan = {
        ...weekPlan,
        days: {
          ...weekPlan.days,
          [date]: updatedDayPlan,
        },
        lastModified: new Date().toISOString(),
      };

      return {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [weekPlanId]: updatedWeekPlan,
        },
        currentWeekPlan:
          state.currentWeekPlan?.id === weekPlanId ? updatedWeekPlan : state.currentWeekPlan,
      };
    }

    case 'MOVE_MEAL': {
      const { from, to } = action.payload;

      // Get the source week plan
      const fromWeekPlan = state.weekPlans[from.weekPlanId];
      if (!fromWeekPlan || !fromWeekPlan.days[from.date]) return state;

      const fromDayPlan = fromWeekPlan.days[from.date];
      let sourceMeal: MealSlot | undefined;

      // Extract the meal from source
      if (from.mealType === 'snacks') {
        sourceMeal = fromDayPlan.snacks?.find((snack) => snack.id === from.mealId);
        if (!sourceMeal) return state;
      } else {
        sourceMeal = fromDayPlan[from.mealType] as MealSlot;
        if (!sourceMeal || sourceMeal.id !== from.mealId) return state;
      }

      // Create new meal with new ID for the destination
      const newMeal: MealSlot = {
        ...sourceMeal,
        id: generateId(),
      };

      // Remove from source
      let updatedFromDayPlan: DayPlan;
      if (from.mealType === 'snacks') {
        updatedFromDayPlan = {
          ...fromDayPlan,
          snacks: fromDayPlan.snacks?.filter((snack) => snack.id !== from.mealId) || [],
        };
      } else {
        updatedFromDayPlan = {
          ...fromDayPlan,
          [from.mealType]: undefined,
        };
      }

      // Get destination week plan (might be the same as source)
      const toWeekPlan = state.weekPlans[to.weekPlanId] || fromWeekPlan;
      const toDayPlan = toWeekPlan.days[to.date] || { date: to.date };

      // Add to destination
      let updatedToDayPlan: DayPlan;
      if (to.mealType === 'snacks') {
        updatedToDayPlan = {
          ...toDayPlan,
          snacks: [...(toDayPlan.snacks || []), newMeal],
        };
      } else {
        updatedToDayPlan = {
          ...toDayPlan,
          [to.mealType]: newMeal,
        };
      }

      // Update state
      const updatedFromWeekPlan = {
        ...fromWeekPlan,
        days: {
          ...fromWeekPlan.days,
          [from.date]: updatedFromDayPlan,
        },
        lastModified: new Date().toISOString(),
      };

      let updatedState = {
        ...state,
        weekPlans: {
          ...state.weekPlans,
          [from.weekPlanId]: updatedFromWeekPlan,
        },
      };

      // If moving to a different week plan, update that too
      if (to.weekPlanId !== from.weekPlanId) {
        const updatedToWeekPlan = {
          ...toWeekPlan,
          days: {
            ...toWeekPlan.days,
            [to.date]: updatedToDayPlan,
          },
          lastModified: new Date().toISOString(),
        };

        updatedState = {
          ...updatedState,
          weekPlans: {
            ...updatedState.weekPlans,
            [to.weekPlanId]: updatedToWeekPlan,
          },
        };
      } else {
        // Same week plan, update the destination day
        updatedState = {
          ...updatedState,
          weekPlans: {
            ...updatedState.weekPlans,
            [from.weekPlanId]: {
              ...updatedFromWeekPlan,
              days: {
                ...updatedFromWeekPlan.days,
                [to.date]: updatedToDayPlan,
              },
            },
          },
        };
      }

      // Update current week plan if it was modified
      if (state.currentWeekPlan?.id === from.weekPlanId) {
        updatedState.currentWeekPlan = updatedState.weekPlans[from.weekPlanId];
      } else if (state.currentWeekPlan?.id === to.weekPlanId) {
        updatedState.currentWeekPlan = updatedState.weekPlans[to.weekPlanId];
      }

      return updatedState;
    }

    case 'GENERATE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: {
          ...state.shoppingLists,
          [action.payload.id]: action.payload,
        },
      };

    case 'UPDATE_SHOPPING_LIST':
      if (!state.shoppingLists[action.payload.id]) return state;

      return {
        ...state,
        shoppingLists: {
          ...state.shoppingLists,
          [action.payload.id]: {
            ...state.shoppingLists[action.payload.id],
            ...action.payload.updates,
            lastModified: new Date().toISOString(),
          },
        },
      };

    case 'TOGGLE_SHOPPING_ITEM': {
      const { listId, itemId } = action.payload;
      const shoppingList = state.shoppingLists[listId];
      if (!shoppingList) return state;

      return {
        ...state,
        shoppingLists: {
          ...state.shoppingLists,
          [listId]: {
            ...shoppingList,
            items: shoppingList.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
            lastModified: new Date().toISOString(),
          },
        },
      };
    }

    case 'CREATE_TEMPLATE':
      return {
        ...state,
        templates: {
          ...state.templates,
          [action.payload.id]: action.payload,
        },
      };

    case 'DELETE_TEMPLATE':
      const { [action.payload]: _deletedTemplate, ...remainingTemplates } = state.templates;
      return {
        ...state,
        templates: remainingTemplates,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESET_MEAL_PLANS':
      return defaultMealPlanState;

    default:
      return state;
  }
}

// Provider component
export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage for persistence
  const [persistedState, setPersistedState] = useLocalStorage<MealPlanState>(
    'whiskai-meal-plans',
    defaultMealPlanState
  );

  // Use reducer for state management
  const [state, dispatch] = useReducer(mealPlanReducer, persistedState);

  // Get recipe context for recipe data
  const { utils: recipeUtils } = useRecipes();

  // Persist state changes to localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  // Action creators
  const createWeekPlan = useCallback((startDate: string, title?: string): string => {
    const weekStart = getWeekStartDate(startDate);
    const weekEnd = getWeekEndDate(weekStart);
    const id = generateId();

    const weekPlan: WeekPlan = {
      id,
      startDate: weekStart,
      endDate: weekEnd,
      days: {},
      title: title || `Week of ${new Date(weekStart).toLocaleDateString()}`,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    dispatch({ type: 'CREATE_WEEK_PLAN', payload: weekPlan });
    return id;
  }, []);

  const updateWeekPlan = useCallback((id: string, updates: Partial<WeekPlan>) => {
    dispatch({ type: 'UPDATE_WEEK_PLAN', payload: { id, updates } });
  }, []);

  const deleteWeekPlan = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      dispatch({ type: 'DELETE_WEEK_PLAN', payload: id });
    }
  }, []);

  const setCurrentWeekPlan = useCallback((id: string) => {
    dispatch({ type: 'SET_CURRENT_WEEK_PLAN', payload: id });
  }, []);

  const addMealToSlot = useCallback(
    (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      recipeId: string,
      servings?: number
    ) => {
      const recipe = recipeUtils.getRecipe(recipeId);
      if (!recipe) return;

      const meal: MealSlot = {
        id: generateId(),
        recipeId,
        servings: servings || recipe.servings,
      };

      dispatch({ type: 'ADD_MEAL_TO_SLOT', payload: { weekPlanId, date, mealType, meal } });
    },
    [recipeUtils]
  );

  const removeMealFromSlot = useCallback(
    (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      mealId?: string
    ) => {
      dispatch({ type: 'REMOVE_MEAL_FROM_SLOT', payload: { weekPlanId, date, mealType, mealId } });
    },
    []
  );

  const updateMealSlot = useCallback(
    (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      mealId: string,
      updates: Partial<MealSlot>
    ) => {
      dispatch({
        type: 'UPDATE_MEAL_SLOT',
        payload: { weekPlanId, date, mealType, mealId, updates },
      });
    },
    []
  );

  const moveMeal = useCallback((from: DropTarget & { mealId: string }, to: DropTarget) => {
    dispatch({ type: 'MOVE_MEAL', payload: { from, to } });
  }, []);

  const handleDrop = useCallback(
    (dragData: DragData, dropTarget: DropTarget) => {
      if (dragData.type === 'recipe' && dragData.recipeId) {
        // Adding a new recipe to a meal slot
        addMealToSlot(
          dropTarget.weekPlanId,
          dropTarget.date,
          dropTarget.mealType,
          dragData.recipeId
        );
      } else if (dragData.type === 'meal' && dragData.mealSlot) {
        // Moving an existing meal to a new slot
        const from = {
          weekPlanId: dragData.mealSlot.weekPlanId,
          date: dragData.mealSlot.date,
          mealType: dragData.mealSlot.mealType,
          mealId: dragData.mealSlot.mealId,
        };
        moveMeal(from, dropTarget);
      }
    },
    [addMealToSlot, moveMeal]
  );

  const generateShoppingList = useCallback(
    (weekPlanId: string): string => {
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan) return '';

      const ingredientMap = new Map<
        string,
        {
          amount: number;
          unit: string;
          recipeIds: string[];
          category: string;
        }
      >();

      // Aggregate ingredients from all meals in the week
      Object.values(weekPlan.days).forEach((dayPlan) => {
        const meals = [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...(dayPlan.snacks || [])];

        meals.forEach((meal) => {
          if (meal?.recipeId) {
            const recipe = recipeUtils.getRecipe(meal.recipeId);
            if (recipe) {
              const servingMultiplier = (meal.servings || recipe.servings) / recipe.servings;

              recipe.ingredients.forEach((ingredient) => {
                const key = `${ingredient.name}-${ingredient.unit}`;
                const existing = ingredientMap.get(key);

                if (existing) {
                  existing.amount += ingredient.amount * servingMultiplier;
                  if (!existing.recipeIds.includes(meal.recipeId!)) {
                    existing.recipeIds.push(meal.recipeId!);
                  }
                } else {
                  ingredientMap.set(key, {
                    amount: ingredient.amount * servingMultiplier,
                    unit: ingredient.unit,
                    recipeIds: [meal.recipeId!],
                    category: categorizeIngredient(ingredient.name),
                  });
                }
              });
            }
          }
        });
      });

      // Convert to shopping list items
      const items: ShoppingListItem[] = Array.from(ingredientMap.entries()).map(([key, data]) => {
        const [name] = key.split('-');
        return {
          id: generateId(),
          name,
          amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
          unit: data.unit,
          category: data.category,
          checked: false,
          recipeIds: data.recipeIds,
        };
      });

      const shoppingListId = generateId();
      const shoppingList: ShoppingList = {
        id: shoppingListId,
        weekPlanId,
        items,
        totalEstimatedCost: 0, // Will be calculated when prices are available
        dateGenerated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      dispatch({ type: 'GENERATE_SHOPPING_LIST', payload: shoppingList });
      return shoppingListId;
    },
    [state.weekPlans, recipeUtils]
  );

  const updateShoppingList = useCallback((id: string, updates: Partial<ShoppingList>) => {
    dispatch({ type: 'UPDATE_SHOPPING_LIST', payload: { id, updates } });
  }, []);

  const toggleShoppingItem = useCallback((listId: string, itemId: string) => {
    dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: { listId, itemId } });
  }, []);

  const createTemplate = useCallback(
    (weekPlanId: string, name: string, description?: string, tags?: string[]): string => {
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan) return '';

      const templateId = generateId();
      const template: MealPlanTemplate = {
        id: templateId,
        name,
        description,
        weekPlan: {
          days: weekPlan.days,
          title: weekPlan.title,
          notes: weekPlan.notes,
          budget: weekPlan.budget,
        },
        tags: tags || [],
        isPublic: false,
        dateCreated: new Date().toISOString(),
      };

      dispatch({ type: 'CREATE_TEMPLATE', payload: template });
      return templateId;
    },
    [state.weekPlans]
  );

  const deleteTemplate = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
    }
  }, []);

  const applyTemplate = useCallback(
    (templateId: string, startDate: string): string => {
      const template = state.templates[templateId];
      if (!template) return '';

      const weekStart = getWeekStartDate(startDate);
      const weekEnd = getWeekEndDate(weekStart);
      const id = generateId();

      const weekPlan: WeekPlan = {
        id,
        startDate: weekStart,
        endDate: weekEnd,
        ...template.weekPlan,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      dispatch({ type: 'CREATE_WEEK_PLAN', payload: weekPlan });
      return id;
    },
    [state.templates]
  );

  const updateSettings = useCallback((updates: Partial<MealPlanState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  }, []);

  const resetMealPlans = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all meal planning data?')) {
      dispatch({ type: 'RESET_MEAL_PLANS' });
    }
  }, []);

  // Utility functions
  const getCurrentWeekPlan = useCallback((): WeekPlan | undefined => {
    return state.currentWeekPlan;
  }, [state.currentWeekPlan]);

  const getWeekPlan = useCallback(
    (id: string): WeekPlan | undefined => {
      return state.weekPlans[id];
    },
    [state.weekPlans]
  );

  const getWeekPlanForDate = useCallback(
    (date: string): WeekPlan | undefined => {
      const weekStart = getWeekStartDate(date);
      return Object.values(state.weekPlans).find((plan) => plan.startDate === weekStart);
    },
    [state.weekPlans]
  );

  const getShoppingList = useCallback(
    (id: string): ShoppingList | undefined => {
      return state.shoppingLists[id];
    },
    [state.shoppingLists]
  );

  const getShoppingListForWeekPlan = useCallback(
    (weekPlanId: string): ShoppingList | undefined => {
      return Object.values(state.shoppingLists).find((list) => list.weekPlanId === weekPlanId);
    },
    [state.shoppingLists]
  );

  const getMealSlot = useCallback(
    (
      weekPlanId: string,
      date: string,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
    ): MealSlot | MealSlot[] | undefined => {
      const weekPlan = state.weekPlans[weekPlanId];
      const dayPlan = weekPlan?.days[date];
      if (!dayPlan) return undefined;

      return dayPlan[mealType];
    },
    [state.weekPlans]
  );

  const getWeekNutrition = useCallback(
    (weekPlanId: string) => {
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

      let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      Object.values(weekPlan.days).forEach((dayPlan) => {
        const meals = [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...(dayPlan.snacks || [])];

        meals.forEach((meal) => {
          if (meal?.recipeId) {
            const recipe = recipeUtils.getRecipe(meal.recipeId);
            if (recipe?.nutritionalInfo) {
              const servingMultiplier = (meal.servings || recipe.servings) / recipe.servings;
              totalNutrition.calories += recipe.nutritionalInfo.calories * servingMultiplier;
              totalNutrition.protein += recipe.nutritionalInfo.protein * servingMultiplier;
              totalNutrition.carbs += recipe.nutritionalInfo.carbs * servingMultiplier;
              totalNutrition.fat += recipe.nutritionalInfo.fat * servingMultiplier;
            }
          }
        });
      });

      return totalNutrition;
    },
    [state.weekPlans, recipeUtils]
  );

  const getWeekBudget = useCallback(
    (weekPlanId: string): number => {
      const weekPlan = state.weekPlans[weekPlanId];
      if (!weekPlan) return 0;

      let totalCost = 0;

      Object.values(weekPlan.days).forEach((dayPlan) => {
        const meals = [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...(dayPlan.snacks || [])];

        meals.forEach((meal) => {
          if (meal?.recipeId) {
            const recipe = recipeUtils.getRecipe(meal.recipeId);
            if (recipe?.pricePerServing) {
              const servings = meal.servings || recipe.servings;
              totalCost += recipe.pricePerServing * servings;
            }
          }
        });
      });

      return totalCost;
    },
    [state.weekPlans, recipeUtils]
  );

  const getDayMeals = useCallback(
    (weekPlanId: string, date: string): DayPlan | undefined => {
      const weekPlan = state.weekPlans[weekPlanId];
      return weekPlan?.days[date];
    },
    [state.weekPlans]
  );

  const generateWeekDates = useCallback((startDate: string): string[] => {
    const dates: string[] = [];
    const start = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }, []);

  const value: MealPlanContextType = {
    state,
    actions: {
      createWeekPlan,
      updateWeekPlan,
      deleteWeekPlan,
      setCurrentWeekPlan,
      addMealToSlot,
      removeMealFromSlot,
      updateMealSlot,
      moveMeal,
      handleDrop,
      generateShoppingList,
      updateShoppingList,
      toggleShoppingItem,
      createTemplate,
      deleteTemplate,
      applyTemplate,
      updateSettings,
      resetMealPlans,
    },
    utils: {
      getCurrentWeekPlan,
      getWeekPlan,
      getWeekPlanForDate,
      getShoppingList,
      getShoppingListForWeekPlan,
      getMealSlot,
      getWeekNutrition,
      getWeekBudget,
      getDayMeals,
      generateWeekDates,
    },
  };

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
};

// Custom hook
export const useMealPlan = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within MealPlanProvider');
  }
  return context;
};

// Export context for testing
export { MealPlanContext };
