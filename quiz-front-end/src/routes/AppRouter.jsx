import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CreateQuiz from '../pages/Admin/CreateQuiz';
import QuizList from '../pages/Public/QuizList';
import TakeQuiz from '../pages/Public/TakeQuiz';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
                <ProtectedRoute path="/admin/create-quiz" component={CreateQuiz} />
                <Route path="/quizzes" component={QuizList} />
                <Route path="/take-quiz/:id" component={TakeQuiz} />
                <Route path="/" exact component={QuizList} />
            </Switch>
        </Router>
    );
};

export default AppRouter;