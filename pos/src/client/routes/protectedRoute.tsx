import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthProvider';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, preserving the current route as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
