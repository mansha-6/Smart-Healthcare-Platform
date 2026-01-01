import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user data is not yet loaded (optional handling if loading state exists)
  // For now assuming user is present if token is present (loaded in AuthContext)
  // If user object is null but token is there, we might need to wait or it means invalid token.
  // Assuming strict synced state for this MVP.
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Unauthorized role
    // Redirect to their appropriate dashboard to avoid getting stuck
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
