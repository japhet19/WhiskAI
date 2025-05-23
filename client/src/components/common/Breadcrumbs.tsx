import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { BreadcrumbItem } from '../../hooks/useBreadcrumbs';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHomeIcon = true,
  maxItems = 5,
}) => {
  // Truncate items if there are too many
  const displayItems = items.length > maxItems 
    ? [
        items[0], // Keep first item (usually home)
        { label: '...', isActive: false }, // Ellipsis
        ...items.slice(-(maxItems - 2)) // Keep last few items
      ]
    : items;

  if (items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => (
          <motion.li
            key={`${item.label}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center"
          >
            {/* Separator */}
            {index > 0 && (
              <ChevronRight 
                size={14} 
                className="text-gray-400 mx-2" 
                aria-hidden="true"
              />
            )}
            
            {/* Breadcrumb item */}
            {item.label === '...' ? (
              <span className="text-gray-400">...</span>
            ) : item.isActive ? (
              <span 
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {index === 0 && showHomeIcon ? (
                  <span className="flex items-center space-x-1">
                    <Home size={14} aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : item.path ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded-md px-2 py-1"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {index === 0 && showHomeIcon ? (
                    <span className="flex items-center space-x-1">
                      <Home size={14} aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              </motion.div>
            ) : (
              <span className="text-gray-600">
                {index === 0 && showHomeIcon ? (
                  <span className="flex items-center space-x-1">
                    <Home size={14} aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;