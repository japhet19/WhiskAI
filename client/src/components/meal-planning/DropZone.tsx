import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';

import type { DragData, DropTarget } from '../../contexts/MealPlanContext';

interface DropZoneProps {
  dropTarget: DropTarget;
  onDrop: (dragData: DragData, dropTarget: DropTarget) => void;
  children: React.ReactNode;
  className?: string;
  emptyStateComponent?: React.ReactNode;
  acceptTypes?: ('recipe' | 'meal')[];
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  dropTarget,
  onDrop,
  children,
  className = '',
  emptyStateComponent,
  acceptTypes = ['recipe', 'meal'],
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidDrag, setIsValidDrag] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dropElement = dropRef.current;
    if (!dropElement || disabled) return;

    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;

      if (dragCounter === 1) {
        setIsDragOver(true);

        // Check if the dragged item is valid for this drop zone
        const draggedElement = document.querySelector('[data-drag-type]');
        if (draggedElement) {
          const dragType = draggedElement.getAttribute('data-drag-type') as 'recipe' | 'meal';
          setIsValidDrag(acceptTypes.includes(dragType));
        }
      }
    };

    const handleDragOver = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;

      if (dragCounter === 0) {
        setIsDragOver(false);
        setIsValidDrag(false);
      }
    };

    const handleDrop = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      dragCounter = 0;
      setIsDragOver(false);
      setIsValidDrag(false);

      // Find the dragged element
      const draggedElement = document.querySelector('[data-drag-type]');
      if (!draggedElement) return;

      const dragType = draggedElement.getAttribute('data-drag-type') as 'recipe' | 'meal';

      if (!acceptTypes.includes(dragType)) return;

      let dragData: DragData;

      if (dragType === 'recipe') {
        const recipeId = draggedElement.getAttribute('data-recipe-id');
        if (!recipeId) return;

        dragData = {
          type: 'recipe',
          recipeId,
        };
      } else if (dragType === 'meal') {
        const mealId = draggedElement.getAttribute('data-meal-id');
        if (!mealId) return;

        // For meal moves, we need to get the source location
        // This would typically be passed through the drag data
        // For now, we'll handle this in the parent component
        return;
      } else {
        return;
      }

      onDrop(dragData, dropTarget);
    };

    // Add event listeners
    dropElement.addEventListener('dragenter', handleDragEnter);
    dropElement.addEventListener('dragover', handleDragOver);
    dropElement.addEventListener('dragleave', handleDragLeave);
    dropElement.addEventListener('drop', handleDrop);

    return () => {
      dropElement.removeEventListener('dragenter', handleDragEnter);
      dropElement.removeEventListener('dragover', handleDragOver);
      dropElement.removeEventListener('dragleave', handleDragLeave);
      dropElement.removeEventListener('drop', handleDrop);
    };
  }, [dropTarget, onDrop, acceptTypes, disabled]);

  // Alternative approach using Framer Motion's drag detection
  const _handleFramerDrop = (dragData: DragData): void => {
    if (!acceptTypes.includes(dragData.type) || disabled) return;
    onDrop(dragData, dropTarget);
  };

  const isEmpty =
    !children || (React.isValidElement(children) && !(children.props as any).children);

  return (
    <motion.div
      ref={dropRef}
      className={`
        relative transition-all duration-200
        ${isDragOver && isValidDrag ? 'ring-2 ring-teal-400 ring-opacity-60 bg-teal-50' : ''}
        ${isDragOver && !isValidDrag ? 'ring-2 ring-red-400 ring-opacity-60 bg-red-50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      data-drop-target="true"
      data-week-plan-id={dropTarget.weekPlanId}
      data-date={dropTarget.date}
      data-meal-type={dropTarget.mealType}
    >
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              absolute inset-0 border-2 border-dashed rounded-lg flex items-center justify-center
              ${
                isValidDrag
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-red-400 bg-red-50 text-red-700'
              }
            `}
            style={{ zIndex: 10 }}
          >
            <div className="text-center p-4">
              {isValidDrag ? (
                <>
                  <div className="text-lg mb-1">📍</div>
                  <div className="text-sm font-medium">Drop here</div>
                </>
              ) : (
                <>
                  <div className="text-lg mb-1">❌</div>
                  <div className="text-sm font-medium">Invalid drop</div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEmpty && !isDragOver && emptyStateComponent}
      {children}
    </motion.div>
  );
};

export default DropZone;
