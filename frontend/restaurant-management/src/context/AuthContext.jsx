import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('restaurant_token');
    const storedUser = localStorage.getItem('restaurant_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const userData = {
        username: ADMIN_USERNAME,
        fullName: 'Restaurant Admin',
        role: 'ADMIN',
      };
      const fakeToken = 'restaurant-admin-token-' + Date.now();

      localStorage.setItem('restaurant_token', fakeToken);
      localStorage.setItem('restaurant_user', JSON.stringify(userData));
      setToken(fakeToken);
      setUser(userData);
      navigate('/');
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    localStorage.removeItem('restaurant_token');
    localStorage.removeItem('restaurant_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
