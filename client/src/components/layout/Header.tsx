import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header 
      className="bg-white shadow-sm border-b border-gray-200"
      role="banner"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center group"
            aria-label="WhiskAI Home"
          >
            <motion.img
              src="/assets/whiskai2.png"
              alt="WhiskAI"
              className="w-72 h-24 object-contain"
              style={{ minWidth: '288px', minHeight: '96px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            />
          </Link>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Future: User menu, notifications, etc. */}
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;