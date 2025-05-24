import { motion } from 'framer-motion';
import React from 'react';

import type { DragData } from '../../contexts/MealPlanContext';
import type { Recipe } from '../../contexts/types';

interface DraggableRecipeProps {
  recipe: Recipe;
  children: React.ReactNode;
  onDragStart?: (dragData: DragData) => void;
  onDragEnd?: () => void;
  className?: string;
}

export const DraggableRecipe: React.FC<DraggableRecipeProps> = ({
  recipe,
  children,
  onDragStart,
  onDragEnd,
  className = '',
}) => {
  const dragData: DragData = {
    type: 'recipe',
    recipeId: recipe.id,
  };

  const handleDragStart = (): void => {
    onDragStart?.(dragData);
  };

  const handleDragEnd = (): void => {
    onDragEnd?.();
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 0.95,
        rotate: 2,
        zIndex: 50,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      data-recipe-id={recipe.id}
      data-drag-type="recipe"
    >
      {children}
    </motion.div>
  );
};

export default DraggableRecipe;
