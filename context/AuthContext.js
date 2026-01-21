import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to load token', e);
    } finally {
      setIsLoading(false);
    }
  };

  const setToken = async (token) => {
    setUserToken(token);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('userToken', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('userToken');
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // OAuth2PasswordRequestForm expects form data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const { access_token } = response.data;
      setToken(access_token);
    } catch (e) {
      setError(e.response?.data?.detail || 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Register endpoint expects JSON body (UserCreate model)
      const response = await api.post('/auth/register', {
        email,
        password,
      });
      
      const { access_token } = response.data;
      setToken(access_token);
    } catch (e) {
      setError(e.response?.data?.detail || 'Registration failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
