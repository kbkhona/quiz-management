import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/api';

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
      const response = await loginUser(credentials); // calls API: /api/login
      // expected response: { token, user }
      const token = response.token;
      const userResp = response.user || null;
      if (!userResp) throw new Error('Invalid login response');

      // derive userType from backend flags
      const userWithType = { ...userResp, userType: userResp.isAdmin ? 'admin' : 'public' };

      // persist token + user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithType));
      setUser(userWithType);

      // redirect based on userType
      if (userWithType.userType === 'admin') navigate('/admin');
      else navigate('/quiz');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // registerUser returns e.g. { message, userId }
      const response = await registerUser(userData);
      // do not auto-login; navigate to home/login
      navigate('/');
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home (login/register) after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};