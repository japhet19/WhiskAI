import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  ChefHat, 
  ShoppingCart, 
  Settings,
  Menu,
  X,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { getNavigationRoutes } from '../../config/routes';
import { RoutePath } from '../../constants/routes';

// Icon mapping for navigation items
const iconMap = {
  MessageCircle,
  Calendar,
  ChefHat,
  ShoppingCart,
  Settings,
} as const;

interface NavigationItemProps {
  path: RoutePath;
  label: string;
  icon?: string;
  isActive: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  path, 
  label, 
  icon, 
  isActive 
}) => {
  const IconComponent = icon && iconMap[icon as keyof typeof iconMap];

  return (
    <NavLink
      to={path}
      className={({ isActive: linkActive }) => `
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
        ${linkActive || isActive 
          ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-teal-200 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
        border border-transparent hover:border-gray-200
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {({ isActive: linkActive }) => (
        <>
          {IconComponent && (
            <motion.div
              animate={{ 
                scale: linkActive || isActive ? 1.1 : 1,
                rotate: linkActive || isActive ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <IconComponent 
                size={20} 
                className={
                  linkActive || isActive 
                    ? 'text-teal-600' 
                    : 'text-current'
                }
              />
            </motion.div>
          )}
          <span className="font-medium">{label}</span>
          
          {/* Active indicator */}
          {(linkActive || isActive) && (
            <motion.div
              layoutId="activeTab"
              className="ml-auto w-2 h-2 bg-teal-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.3 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigationRoutes = getNavigationRoutes();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex space-x-1">
            {navigationRoutes.map((route) => (
              <motion.div
                key={route.path}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className="flex-shrink-0"
              >
                <NavigationItem
                  path={route.path}
                  label={route.label}
                  icon={route.icon}
                  isActive={location.pathname === route.path}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Search size={20} />
            </motion.button>
            
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 py-4 space-y-2"
            >
              {navigationRoutes.map((route) => (
                <motion.div
                  key={route.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <NavigationItem
                    path={route.path}
                    label={route.label}
                    icon={route.icon}
                    isActive={location.pathname === route.path}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;