/**
 * HospitalListView Component
 * 
 * This component displays a list of hospitals with their available tests and services.
 * It includes a header with a logout button and handles loading and error states.
 * 
 * @component
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/ApiService';
import { BookingService } from '../services/BookingService';
import { Booking } from '../models/Booking';

interface Test {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  tests: Test[];
  services: Service[];
}

const HospitalListView: React.FC = () => {
  const { logout } = useAuth();
  const bookingService = BookingService.getInstance();

  // State for hospitals and bookings
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hospitals and bookings when component mounts
  useEffect(() => {
    fetchHospitals();
    fetchBookings();
  }, []);

  /**
   * Fetches hospitals from the backend
   */
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHospitals();
      setHospitals(data);
    } catch (err) {
      setError('Failed to fetch hospitals');
      console.error('Failed to fetch hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const handleBookItem = async (
    hospitalId: string,
    hospitalName: string,
    itemId: string,
    itemName: string,
    itemType: 'test' | 'service',
    price: number
  ) => {
    try {
      const booking = await bookingService.createBooking({
        hospitalId,
        hospitalName,
        itemId,
        itemName,
        itemType,
        price,
        date: new Date().toISOString(),
        status: 'pending'
      });
      setBookings(prev => [...prev, booking]);
      Alert.alert('Success', 'Booking created successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to create booking');
      console.error('Failed to create booking:', err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const success = await bookingService.deleteBooking(id);
      if (success) {
        setBookings(prev => prev.filter(b => b.id !== id));
        Alert.alert('Success', 'Booking deleted successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete booking');
      console.error('Failed to delete booking:', err);
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hospitals</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Hospitals</Text>
          <FlatList
            data={hospitals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.hospitalItem}>
                <Text style={styles.hospitalName}>{item.name}</Text>
                <Text style={styles.hospitalAddress}>{item.address}</Text>
                <Text style={styles.hospitalContact}>{item.contact}</Text>
                <View style={styles.servicesContainer}>
                  <Text style={styles.servicesTitle}>Tests:</Text>
                  {item.tests.map((test: Test) => (
                    <View key={test.id} style={styles.itemContainer}>
                      <Text style={styles.serviceItem}>
                        • {test.name} - ${test.price}
                      </Text>
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => handleBookItem(
                          item.id,
                          item.name,
                          test.id,
                          test.name,
                          'test',
                          test.price
                        )}
                      >
                        <Text style={styles.bookButtonText}>Book</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <Text style={styles.servicesTitle}>Services:</Text>
                  {item.services.map((service: Service) => (
                    <View key={service.id} style={styles.itemContainer}>
                      <Text style={styles.serviceItem}>
                        • {service.name} - ${service.price}
                      </Text>
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => handleBookItem(
                          item.id,
                          item.name,
                          service.id,
                          service.name,
                          'service',
                          service.price
                        )}
                      >
                        <Text style={styles.bookButtonText}>Book</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Bookings</Text>
          {bookings.length === 0 ? (
            <Text style={styles.emptyText}>No bookings yet</Text>
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingHospital}>{item.hospitalName}</Text>
                  <Text style={styles.bookingTitle}>{item.itemName}</Text>
                  <Text style={styles.bookingDetails}>
                    ${item.price}
                  </Text>
                  <Text style={styles.bookingDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.bookingStatus}>Status: {item.status}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBooking(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HospitalListView;

/**
 * Styles for the HospitalListView component
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  hospitalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hospitalContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  servicesContainer: {
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  serviceItem: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  bookingHospital: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  bookingDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
}); 