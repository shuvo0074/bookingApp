/**
 * BookingListView Component
 * 
 * This component displays a list of bookings and provides functionality
 * to create, view, and delete bookings. It includes a header with a logout button
 * and handles loading and error states.
 * 
 * @component
 */

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBookingViewModel } from '../viewmodels/BookingViewModel';
import { useAuth } from '../context/AuthContext';

/**
 * BookingListView Component
 * 
 * Displays a list of bookings with the ability to create new bookings,
 * delete existing ones, and logout from the application.
 * 
 * @component
 * @returns {JSX.Element} The booking list view component
 */
export const BookingListView = () => {
  // Get booking management functions from the ViewModel
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    deleteBooking,
  } = useBookingViewModel();
  
  // Get logout function from auth context
  const { logout } = useAuth();

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /**
   * Handles the creation of a new booking
   * Creates a sample booking with default values
   */
  const handleCreateBooking = async () => {
    try {
      await createBooking({
        title: 'New Booking',
        date: new Date(),
        status: 'pending',
        description: 'Sample booking',
      });
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleCreateBooking}>
        <Text style={styles.buttonText}>Create New Booking</Text>
      </TouchableOpacity>
      
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date.toLocaleDateString()}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBooking(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

/**
 * Styles for the BookingListView component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
}); 