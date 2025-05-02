/**
 * LoginScreen Component
 * 
 * This component provides a login interface for the Booking App.
 * It includes username and password input fields with validation,
 * and a login button that triggers the authentication process.
 * 
 * @component
 * @example
 * <LoginScreen onLogin={(username, password) => handleLogin(username, password)} />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

/**
 * Props for the LoginScreen component
 * @interface LoginScreenProps
 * @property {function} onLogin - Callback function triggered when login is attempted
 * @param {string} username - The entered username
 * @param {string} password - The entered password
 */
interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

/**
 * LoginScreen Component
 * 
 * @param {LoginScreenProps} props - The props for the LoginScreen component
 * @returns {JSX.Element} The rendered login screen
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles the login button press
   * Validates the input fields and calls the onLogin callback
   */
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    onLogin(username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Booking App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Styles for the LoginScreen component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 