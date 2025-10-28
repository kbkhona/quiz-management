import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/Layout';
// import PublicLayout from '../layouts/PublicLayout';

import Home from '../pages/Home';
import AdminQuiz from '../pages/admin/AdminQuiz';
import QuizList from '../pages/public/QuizList';
import TakeQuiz from '../pages/public/TakeQuiz';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Home (Register + Login) */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Admin area (create quizzes) */}
        <Route path="/admin" element={<AuthLayout />}>
          <Route index element={<AdminQuiz />} />
        </Route>

        {/* Public area (list and take quizzes) */}
        <Route path="/quizzes" element={<AuthLayout />}>
          <Route index element={<QuizList />} />
        </Route>

        <Route path="/quiz/:quizId" element={<AuthLayout />}>
          <Route index element={<TakeQuiz />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;