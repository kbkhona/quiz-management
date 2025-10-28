import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await api.checkAuth();
                setUser(response.data.user);
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (username, password) => {
        const response = await api.login(username, password);
        setUser(response.data.user);
        navigate('/admin'); // Redirect to admin dashboard or public page based on user role
    };

    const logout = () => {
        setUser(null);
        navigate('/'); // Redirect to home or login page
    };

    const register = async (username, password, isAdmin) => {
        const response = await api.register(username, password, isAdmin);
        setUser(response.data.user);
        navigate('/admin'); // Redirect to admin dashboard or public page based on user role
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};