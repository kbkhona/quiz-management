import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  // not logged in
  if (!user) return <Navigate to="/" replace />;
  // if adminOnly, ensure user is admin
  if (adminOnly && user.userType !== 'admin') return <Navigate to="/quizzes" replace />;
  return children;
};

export default ProtectedRoute;
