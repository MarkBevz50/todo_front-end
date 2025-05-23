import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5134/api';

export interface UserProfile {
  id: string;
  email: string;
  registeredAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  authLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(false); 
  const [authLoading, setAuthLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${storedToken}` },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed or failed to fetch profile', error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setAuthLoading(false);
    };
    validateTokenAndFetchUser();
  }, []);

  const login = async (email_param: string, password_param: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email_param,
        password: password_param,
      });
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        try {
            const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${newToken}` },
            });
            setUser(profileResponse.data);
            setIsAuthenticated(true);
            setLoading(false);
            return { success: true };
        } catch (profileError) {
            console.error('Failed to fetch profile after login', profileError);
            setUser(null);
            setIsAuthenticated(true); 
            setLoading(false);
            return { success: true, error: 'Logged in, but failed to fetch profile details.' };
        }
      } else {
        setLoading(false);
        return { success: false, error: 'Login failed: No token received.' };
      }
    } catch (err: any) {
      setLoading(false);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = 'Login failed. Please check your credentials or try again.';
        }
      }
      console.error('Login error:', err);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
