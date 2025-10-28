import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRouter />
                <div id="modal-root">HELLO</div>
            </Router>
        </AuthProvider>
    );
};

export default App;