import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '@/utils/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While checking auth, show loading screen and don't render children
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // After loading, if not authenticated, redirect to login
  if (!isAuthenticated) {
    logger.debug('🔒 Not authenticated - redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Only render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
