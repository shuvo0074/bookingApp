/**
 * HospitalListView Component
 * 
 * This component displays a list of hospitals with their available tests and services.
 * It includes a header with a logout button and handles loading and error states.
 * 
 * @component
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/ApiService';

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

/**
 * HospitalListView Component
 * 
 * Displays a list of hospitals with their available tests and services.
 * 
 * @component
 * @returns {JSX.Element} The hospital list view component
 */
export const HospitalListView = () => {
  // Get logout function from auth context
  const { logout } = useAuth();

  // State for hospitals
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hospitals when component mounts
  useEffect(() => {
    fetchHospitals();
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
                  <Text key={test.id} style={styles.serviceItem}>
                    • {test.name} - ${test.price}
                  </Text>
                ))}
                <Text style={styles.servicesTitle}>Services:</Text>
                {item.services.map((service: Service) => (
                  <Text key={service.id} style={styles.serviceItem}>
                    • {service.name} - ${service.price}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

/**
 * Styles for the HospitalListView component
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
  serviceItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
}); 