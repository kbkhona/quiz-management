import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin, apiRegister } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/'); // Redirect to home or desired page after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/'); // Redirect to home or desired page after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};