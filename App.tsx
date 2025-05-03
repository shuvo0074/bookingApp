/**
 * Main Application Component
 * 
 * This is the root component of the Booking App.
 * It sets up the authentication context and handles the main application flow,
 * showing either the login screen or the booking list based on authentication state.
 * 
 * @component
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/views/LoginScreen';
import HospitalListView from './src/views/BookingListView';

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <HospitalListView />;
};

/**
 * Main App Component
 * 
 * Wraps the application in the AuthProvider to provide authentication context
 * to all child components.
 * 
 * @component
 * @returns {JSX.Element} The root application component
 */
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaView>
  );
} 