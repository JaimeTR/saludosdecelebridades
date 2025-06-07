
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { loginUser, registerUser, getCurrentUser, logoutUser, MOCK_ADMIN_CREDENTIALS } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<User | null>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const user = await loginUser(email, pass);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      setCurrentUser(null); // Ensure user is null on failure
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, pass: string, name: string): Promise<User | null> => {
    setLoading(true);
    try {
      const user = await registerUser(email, pass, name);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const isAdmin = currentUser?.role === UserRole.ADMIN && currentUser.email === MOCK_ADMIN_CREDENTIALS.email;

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
