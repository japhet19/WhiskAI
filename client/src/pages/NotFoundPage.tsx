import { motion } from 'framer-motion';
import { Home, MessageCircle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 max-w-md">
          Oops! The page you're looking for doesn't exist. 
          Let's get you back to cooking with Curie.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Home size={18} />
          <span>Go Home</span>
        </Link>
        
        <Link
          to={ROUTES.CHAT}
          className="inline-flex items-center space-x-2 border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <MessageCircle size={18} />
          <span>Chat with Curie</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;