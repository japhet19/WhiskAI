import React from 'react';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from './routes';

// Create router instance
const router = createBrowserRouter(routes);

// Router Provider component
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

// Alternative: Simple Browser Router (if needed for debugging)
export const SimpleBrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default AppRouter;