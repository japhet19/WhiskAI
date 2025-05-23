import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-primary-600 text-white px-4 py-2 rounded-md font-medium 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 z-50 transition-all duration-200"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;