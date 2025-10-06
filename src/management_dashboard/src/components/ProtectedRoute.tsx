import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    // You can return a loading spinner here if you want
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    // User is not logged in, redirect them to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && auth.user.role !== requiredRole) {
    // User is logged in but does not have the required role, redirect them
    // You could redirect to a "Forbidden" page or back to the dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;