import { motion } from 'framer-motion';
import React from 'react';

import { useRecipes, useMealPlan } from '../../contexts';
import type { Recipe, MealSlot } from '../../contexts/types';
import { useDragAndDrop } from '../../hooks';

import { DraggableRecipe, DraggableMeal, DropZone } from './index';

interface MealSlotCardProps {
  weekPlanId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  meal?: MealSlot;
  onMealRemove?: (mealId: string) => void;
}

const MealSlotCard: React.FC<MealSlotCardProps> = ({
  weekPlanId,
  date,
  mealType,
  meal,
  onMealRemove,
}) => {
  const { utils: recipeUtils } = useRecipes();
  const { actions } = useMealPlan();

  const recipe = meal?.recipeId ? recipeUtils.getRecipe(meal.recipeId) : undefined;

  const dropTarget = {
    weekPlanId,
    date,
    mealType,
  };

  const handleMealRemove = (): void => {
    if (meal && onMealRemove) {
      onMealRemove(meal.id);
    }
  };

  return (
    <DropZone
      dropTarget={dropTarget}
      onDrop={actions.handleDrop}
      className="min-h-[120px] p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors"
      emptyStateComponent={
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <div className="text-2xl mb-2">🍽️</div>
          <div className="text-sm font-medium capitalize">{mealType}</div>
          <div className="text-sm">Drop a recipe here</div>
        </div>
      }
    >
      {meal && recipe && (
        <DraggableMeal
          meal={meal}
          weekPlanId={weekPlanId}
          date={date}
          mealType={mealType}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{recipe.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                <span>⏱️ {recipe.readyInMinutes}min</span>
                <span>👥 {meal.servings || recipe.servings}</span>
                {recipe.pricePerServing && <span>💰 ${recipe.pricePerServing.toFixed(2)}</span>}
              </div>
            </div>
            <button
              onClick={handleMealRemove}
              className="ml-2 p-1 text-gray-800 hover:text-red-500 transition-colors"
              title="Remove meal"
            >
              ❌
            </button>
          </div>
        </DraggableMeal>
      )}
    </DropZone>
  );
};

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <DraggableRecipe
      recipe={recipe}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="aspect-w-16 aspect-h-9 mb-3">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-24 object-cover rounded-md"
        />
      </div>
      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">{recipe.title}</h3>
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>⏱️ {recipe.readyInMinutes}min</span>
        <span>👥 {recipe.servings}</span>
        {recipe.pricePerServing && <span>💰 ${recipe.pricePerServing.toFixed(2)}</span>}
      </div>
    </DraggableRecipe>
  );
};

export const MealPlanningExample: React.FC = () => {
  const { state, actions, utils } = useMealPlan();
  const { state: recipeState } = useRecipes();
  const { isDragging } = useDragAndDrop();

  // Sample week plan for demonstration
  const currentWeekPlan = state.currentWeekPlan;
  const sampleDate = '2025-01-22';
  const dayMeals = currentWeekPlan ? utils.getDayMeals(currentWeekPlan.id, sampleDate) : undefined;

  // Get a few sample recipes
  const sampleRecipes = Object.values(recipeState.recipes).slice(0, 6);

  const handleMealRemove = (mealId: string): void => {
    if (currentWeekPlan) {
      actions.removeMealFromSlot(currentWeekPlan.id, sampleDate, 'breakfast', mealId);
    }
  };

  const createSampleWeekPlan = (): void => {
    actions.createWeekPlan(sampleDate, 'Sample Week Plan');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Drag & Drop Meal Planning</h1>
        <p className="text-gray-700">
          Drag recipes from the library to meal slots, or drag meals between slots to reorganize.
        </p>

        {!currentWeekPlan && (
          <button
            onClick={createSampleWeekPlan}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Create Sample Week Plan
          </button>
        )}
      </div>

      {currentWeekPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipe Library */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipe Library</h2>
            <div className="grid grid-cols-1 gap-4">
              {sampleRecipes.length > 0 ? (
                sampleRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <div className="text-4xl mb-2">📚</div>
                  <p>No recipes available</p>
                  <p className="text-sm">Add some recipes to start planning meals</p>
                </div>
              )}
            </div>
          </div>

          {/* Meal Plan Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date(sampleDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h2>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${
                isDragging ? 'opacity-90' : 'opacity-100'
              }`}
            >
              <MealSlotCard
                weekPlanId={currentWeekPlan.id}
                date={sampleDate}
                mealType="breakfast"
                meal={dayMeals?.breakfast}
                onMealRemove={handleMealRemove}
              />

              <MealSlotCard
                weekPlanId={currentWeekPlan.id}
                date={sampleDate}
                mealType="lunch"
                meal={dayMeals?.lunch}
                onMealRemove={handleMealRemove}
              />

              <MealSlotCard
                weekPlanId={currentWeekPlan.id}
                date={sampleDate}
                mealType="dinner"
                meal={dayMeals?.dinner}
                onMealRemove={handleMealRemove}
              />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Snacks</h3>
                {dayMeals?.snacks && dayMeals.snacks.length > 0 ? (
                  dayMeals.snacks.map((snack, _index) => (
                    <MealSlotCard
                      key={snack.id}
                      weekPlanId={currentWeekPlan.id}
                      date={sampleDate}
                      mealType="snacks"
                      meal={snack}
                      onMealRemove={handleMealRemove}
                    />
                  ))
                ) : (
                  <MealSlotCard
                    weekPlanId={currentWeekPlan.id}
                    date={sampleDate}
                    mealType="snacks"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
        <ul className="text-sm text-gray-800 space-y-1">
          <li>• Drag recipes from the library to meal slots to plan meals</li>
          <li>• Drag existing meals between slots to reorganize your day</li>
          <li>• Click the ❌ button to remove meals from slots</li>
          <li>• Visual feedback shows valid drop zones while dragging</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default MealPlanningExample;
