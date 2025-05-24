import { useState, useCallback } from 'react';

import { useMealPlan } from '../contexts/MealPlanContext';
import type { DragData, DropTarget } from '../contexts/MealPlanContext';

interface DragState {
  isDragging: boolean;
  dragData: DragData | null;
  dragOrigin: { x: number; y: number } | null;
}

interface DragAndDropReturn {
  dragState: DragState;
  startDrag: (dragData: DragData, origin?: { x: number; y: number }) => void;
  endDrag: () => void;
  handleDrop: (dropTarget: DropTarget) => void;
  isValidDropTarget: (dropTarget: DropTarget, dragData?: DragData) => boolean;
  getDropZoneClassName: (dropTarget: DropTarget, baseClassName?: string) => string;
  isDragging: boolean;
  dragData: DragData | null;
}

export const useDragAndDrop = (): DragAndDropReturn => {
  const { actions } = useMealPlan();
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragData: null,
    dragOrigin: null,
  });

  const startDrag = useCallback((dragData: DragData, origin?: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      dragData,
      dragOrigin: origin || null,
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragData: null,
      dragOrigin: null,
    });
  }, []);

  const handleDrop = useCallback(
    (dropTarget: DropTarget) => {
      if (!dragState.dragData) return;

      actions.handleDrop(dragState.dragData, dropTarget);
      endDrag();
    },
    [dragState.dragData, actions, endDrag]
  );

  const isValidDropTarget = useCallback(
    (dropTarget: DropTarget, dragData?: DragData): boolean => {
      const currentDragData = dragData || dragState.dragData;
      if (!currentDragData) return false;

      // Recipes can be dropped anywhere
      if (currentDragData.type === 'recipe') {
        return true;
      }

      // Meals can be moved to different slots
      if (currentDragData.type === 'meal' && currentDragData.mealSlot) {
        const source = currentDragData.mealSlot;

        // Can't drop in the same slot
        if (
          source.weekPlanId === dropTarget.weekPlanId &&
          source.date === dropTarget.date &&
          source.mealType === dropTarget.mealType
        ) {
          return false;
        }

        return true;
      }

      return false;
    },
    [dragState.dragData]
  );

  const getDropZoneClassName = useCallback(
    (dropTarget: DropTarget, baseClassName: string = ''): string => {
      if (!dragState.isDragging) return baseClassName;

      const isValid = isValidDropTarget(dropTarget);

      return `${baseClassName} ${
        isValid
          ? 'transition-all duration-200 hover:ring-2 hover:ring-teal-400 hover:ring-opacity-50'
          : 'opacity-75'
      }`;
    },
    [dragState.isDragging, isValidDropTarget]
  );

  return {
    dragState,
    startDrag,
    endDrag,
    handleDrop,
    isValidDropTarget,
    getDropZoneClassName,
    // Convenience methods
    isDragging: dragState.isDragging,
    dragData: dragState.dragData,
  };
};

export default useDragAndDrop;
