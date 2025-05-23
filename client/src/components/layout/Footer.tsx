import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer 
      className="bg-white border-t border-gray-200 py-8 mt-auto"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © 2025 WhiskAI. AI-powered meal planning made simple.
          </div>
          
          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Privacy Policy"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Terms of Service"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Support"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;