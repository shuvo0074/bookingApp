/**
 * Main Application Component
 * 
 * This is the root component of the Booking App.
 * It sets up the authentication context and handles the main application flow,
 * showing either the login screen or the booking list based on authentication state.
 * 
 * @component
 */

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { BookingListView } from './src/views/BookingListView';
import { LoginScreen } from './src/views/LoginScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

/**
 * AppContent Component
 * 
 * Handles the conditional rendering of the application based on authentication state.
 * Shows the login screen when not authenticated, and the booking list when authenticated.
 * 
 * @component
 * @returns {JSX.Element} The appropriate screen based on authentication state
 */
function AppContent() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <BookingListView />
    </SafeAreaView>
  );
}

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
      <AppContent />
    </AuthProvider>
  );
}

/**
 * Styles for the App component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 