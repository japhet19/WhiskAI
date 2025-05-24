import { motion } from 'framer-motion';
import React from 'react';

import type { DragData } from '../../contexts/MealPlanContext';
import type { MealSlot } from '../../contexts/types';

interface DraggableMealProps {
  meal: MealSlot;
  weekPlanId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  children: React.ReactNode;
  onDragStart?: (dragData: DragData) => void;
  onDragEnd?: () => void;
  className?: string;
}

export const DraggableMeal: React.FC<DraggableMealProps> = ({
  meal,
  weekPlanId,
  date,
  mealType,
  children,
  onDragStart,
  onDragEnd,
  className = '',
}) => {
  const dragData: DragData = {
    type: 'meal',
    mealSlot: {
      weekPlanId,
      date,
      mealType,
      mealId: meal.id,
    },
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
        rotate: -1,
        zIndex: 50,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      data-meal-id={meal.id}
      data-drag-type="meal"
    >
      {children}
    </motion.div>
  );
};

export default DraggableMeal;
