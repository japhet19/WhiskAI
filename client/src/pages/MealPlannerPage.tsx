import { motion } from 'framer-motion';
import React from 'react';

const MealPlannerPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Meal Planner
      </h1>
      <p className="text-gray-600">
        Coming Soon - Plan your weekly meals with AI assistance
      </p>
    </motion.div>
  );
};

export default MealPlannerPage;