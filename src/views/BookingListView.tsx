/**
 * HospitalListView Component
 * 
 * This component displays a list of hospitals with their available tests and services.
 * It includes a header with a logout button and handles loading and error states.
 * 
 * @component
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/ApiService';
import { BookingService } from '../services/BookingService';
import { Booking } from '../models/Booking';
import { Ionicons } from '@expo/vector-icons';

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
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

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

  /**
   * Fetches bookings from the BookingService and updates the state
   * Called when component mounts and after booking operations
   */
  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  /**
   * Generates a random date at least 24 hours in the future
   * 
   * @returns {string} ISO string of the random future date
   */
  const generateRandomFutureDate = (): string => {
    const now = new Date();
    const minHours = 24;
    const maxHours = 168; // 7 days
    const randomHours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
    const futureDate = new Date(now.getTime() + randomHours * 60 * 60 * 1000);
    return futureDate.toISOString();
  };

  /**
   * Handles booking creation for a specific hospital item (test or service)
   * 
   * @param {string} hospitalId - ID of the hospital
   * @param {string} hospitalName - Name of the hospital
   * @param {string} itemId - ID of the test or service
   * @param {string} itemName - Name of the test or service
   * @param {'test' | 'service'} itemType - Type of the item being booked
   * @param {number} price - Price of the item
   */
  const handleBookItem = async (
    hospitalId: string,
    hospitalName: string,
    itemId: string,
    itemName: string,
    itemType: 'test' | 'service',
    price: number
  ) => {
    try {
      setLoading(true);
      const booking = await bookingService.createBooking({
        hospitalId,
        hospitalName,
        itemId,
        itemName,
        itemType,
        price,
        date: generateRandomFutureDate(),
        status: 'pending'
      });

      // Check if booking with same ID already exists in state
      const isDuplicate = bookings.some(b => b.id === booking.id);
      if (!isDuplicate) {
        setBookings(prev => [...prev, booking]);
        Alert.alert('Success', 'Booking created successfully!');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles deletion of a booking
   * 
   * @param {string} id - ID of the booking to delete
   */
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

  /**
   * Toggles the expanded state of a hospital's test or service section
   * 
   * @param {string} hospitalId - ID of the hospital
   * @param {'tests' | 'services'} sectionType - Type of section to toggle
   */
  const toggleSection = (hospitalId: string, sectionType: 'tests' | 'services') => {
    const key = `${hospitalId}-${sectionType}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  /**
   * Renders a single hospital item with its tests and services
   * 
   * @param {{ item: Hospital }} - Object containing the hospital data
   * @returns {JSX.Element} The rendered hospital item
   */
  const renderHospitalItem = ({ item }: { item: Hospital }) => (
    <View style={styles.hospitalItem}>
      <Text style={styles.hospitalName}>{item.name}</Text>
      <Text style={styles.hospitalAddress}>{item.address}</Text>
      <Text style={styles.hospitalContact}>{item.contact}</Text>

      <View style={styles.servicesContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(item.id, 'tests')}
        >
          <Text style={styles.servicesTitle}>Tests</Text>
          <Ionicons
            name={expandedSections[`${item.id}-tests`] ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        {expandedSections[`${item.id}-tests`] && item.tests.map((test: Test) => (
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

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(item.id, 'services')}
        >
          <Text style={styles.servicesTitle}>Services</Text>
          <Ionicons
            name={expandedSections[`${item.id}-services`] ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        {expandedSections[`${item.id}-services`] && item.services.map((service: Service) => (
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
  );

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hospitals</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {bookings.length === 0 ? (
            <View style={styles.fullScreenSection}>
              <Text style={styles.sectionTitle}>Available Hospitals</Text>
              <FlatList
                data={hospitals}
                keyExtractor={(item) => item.id}
                renderItem={renderHospitalItem}
              />
            </View>
          ) : (
            <>
              <View style={styles.hospitalsSection}>
                <Text style={styles.sectionTitle}>Available Hospitals</Text>
                <FlatList
                  data={hospitals}
                  keyExtractor={(item) => item.id}
                  renderItem={renderHospitalItem}
                />
              </View>

              <View style={styles.bookingsSection}>
                <Text style={styles.sectionTitle}>Your Bookings</Text>
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
              </View>
            </>
          )}
        </View>
      </View>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  fullScreenSection: {
    flex: 1,
    padding: 16,
  },
  hospitalsSection: {
    flex: 1,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookingsSection: {
    flex: 1,
    padding: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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