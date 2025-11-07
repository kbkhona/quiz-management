import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/Layout';
// import PublicLayout from '../layouts/PublicLayout';

import Home from '../pages/Home';
import AdminQuiz from '../pages/admin/AdminQuiz';
import QuizList from '../pages/public/QuizList';
import TakeQuiz from '../pages/public/TakeQuiz';
import LiveQuiz from '../pages/LiveQuiz';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
        {/* Home (Register + Login) */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Admin area (create quizzes) */}
        <Route path="/admin" element={<AuthLayout />}>
          <Route
            index
            element={
              <ProtectedRoute adminOnly>
                <AdminQuiz />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Quiz area */}
        <Route path="/quiz" element={<AuthLayout />}>
          <Route index element={<QuizList />} />
          <Route
            path=":quizId"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Live Quiz area */}
        <Route path="/live-quiz" element={<AuthLayout />}>
          <Route
            path=":roomId"
            element={
              <ProtectedRoute>
                <LiveQuiz />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;