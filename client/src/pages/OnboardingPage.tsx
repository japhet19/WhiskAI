import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../constants/routes';

const OnboardingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to WhiskAI
      </h1>
      <p className="text-gray-600 mb-8">
        Let's get you started with AI-powered meal planning
      </p>
      
      <Link
        to={ROUTES.CHAT}
        className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Start Chatting with Curie
      </Link>
    </motion.div>
  );
};

export default OnboardingPage;