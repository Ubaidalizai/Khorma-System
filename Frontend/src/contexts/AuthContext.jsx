import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, clearAuthTokens, setAuthTokens } from '../services/apiConfig';

// import base url from environment variables
const BASE_URL = "http://localhost:3001/api/v1";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await apiRequest('/users/profile');
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          clearAuthTokens();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with credentials:', credentials);
      console.log('Login URL:', `${BASE_URL}/users/login`);
      
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify(credentials),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', data);
      
      // Store tokens if provided in response
      if (data.accessToken) {
        setAuthTokens(data.accessToken, data.refreshToken);
      }
      
      // Use the user data directly from login response
      console.log('Using login response user data:', data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      clearAuthTokens();
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      await fetch(`${BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and tokens
      clearAuthTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setAuthTokens(data.accessToken, data.refreshToken);
          return data.accessToken;
        }
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthTokens();
      setIsAuthenticated(false);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
