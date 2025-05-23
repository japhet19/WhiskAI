import { motion } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';
import SkipLink from './SkipLink';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip to main content link for keyboard users */}
      <SkipLink />
      
      {/* Header */}
      <Header />
      
      {/* Main Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 container mx-auto px-4 py-6 max-w-7xl"
        role="main"
        aria-label="Main content"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          {children || <Outlet />}
        </motion.div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;