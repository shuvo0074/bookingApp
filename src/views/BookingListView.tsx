import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBookingViewModel } from '../viewmodels/BookingViewModel';

export const BookingListView = () => {
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    deleteBooking,
  } = useBookingViewModel();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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