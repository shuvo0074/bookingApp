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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/views/LoginScreen';
import { HospitalListView } from './src/views/BookingListView';

const Stack = createNativeStackNavigator();

/**
 * AppContent Component
 * 
 * Handles the conditional rendering of the application based on authentication state.
 * Shows the login screen when not authenticated, and the booking list when authenticated.
 * 
 * @component
 * @returns {JSX.Element} The appropriate screen based on authentication state
 */
const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Login" 
          options={{ headerShown: false }}
        >
          {(props) => <LoginScreen {...props} onLogin={login} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen 
          name="Hospitals" 
          component={HospitalListView} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
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
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
} 