/**
 * Authentication Context
 * 
 * This module provides authentication state management for the Booking App.
 * It includes a context provider and a custom hook for accessing authentication state
 * and functions throughout the application.
 * 
 * @module AuthContext
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BookingService } from '../services/BookingService';

/**
 * Interface defining the shape of the authentication context
 * @interface AuthContextType
 * @property {boolean} isAuthenticated - Current authentication state
 * @property {function} login - Function to handle user login
 * @property {function} logout - Function to handle user logout
 */
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

/**
 * Authentication Context
 * 
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the application.
 * Manages authentication state and provides login/logout functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to auth context
 * @returns {JSX.Element} The context provider component
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bookingService = BookingService.getInstance();

  /**
   * Handles user login
   * 
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @note In a production environment, this would validate against a backend service
   */
  const login = (username: string, password: string) => {
    // For demo purposes, we'll just check if both fields are filled
    // In a real app, you would validate against a backend
    if (username && password) {
      setIsAuthenticated(true);
    }
  };

  /**
   * Handles user logout
   * Resets the authentication state
   */
  const logout = async () => {
    await bookingService.clearBookings();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing authentication context
 * 
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 