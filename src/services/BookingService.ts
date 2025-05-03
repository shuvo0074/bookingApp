import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../models/Booking';

/**
 * Key used to store bookings in AsyncStorage
 */
const BOOKINGS_STORAGE_KEY = '@bookings';

/**
 * BookingService Class
 * 
 * A singleton service that manages booking operations using AsyncStorage for persistence.
 * Implements the Singleton pattern to ensure only one instance exists throughout the app.
 */
export class BookingService {
  private static instance: BookingService;
  private bookings: Booking[] = [];

  /**
   * Private constructor to enforce singleton pattern
   * Automatically loads existing bookings from storage when instance is created
   */
  private constructor() {
    this.loadBookings();
  }

  /**
   * Gets the singleton instance of BookingService
   * @returns {BookingService} The singleton instance
   * 
   * Usage:
   * const bookingService = BookingService.getInstance();
   */
  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  /**
   * Loads bookings from AsyncStorage into memory
   * Called automatically during service initialization
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async loadBookings(): Promise<void> {
    try {
      const storedBookings = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }

  /**
   * Saves current bookings to AsyncStorage
   * Called after any modification to the bookings array
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async saveBookings(): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(this.bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  }

  /**
   * Retrieves all bookings
   * 
   * @returns {Promise<Booking[]>} Array of all bookings
   * 
   * Usage:
   * const bookings = await bookingService.getBookings();
   */
  async getBookings(): Promise<Booking[]> {
    await this.loadBookings();
    return this.bookings;
  }

  /**
   * Creates a new booking
   * 
   * @param {Omit<Booking, 'id'>} booking - Booking data without ID (ID is auto-generated)
   * @returns {Promise<Booking>} The created booking with generated ID
   * 
   * Usage:
   * const newBooking = await bookingService.createBooking({
   *   hospitalId: '123',
   *   hospitalName: 'General Hospital',
   *   itemId: '456',
   *   itemName: 'Blood Test',
   *   itemType: 'test',
   *   price: 100,
   *   date: new Date().toISOString()
   * });
   */
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
    };
    this.bookings.push(newBooking);
    await this.saveBookings();
    return newBooking;
  }

  /**
   * Deletes a booking by ID
   * 
   * @param {string} id - ID of the booking to delete
   * @returns {Promise<boolean>} True if booking was deleted, false if not found
   * 
   * Usage:
   * const success = await bookingService.deleteBooking('123');
   */
  async deleteBooking(id: string): Promise<boolean> {
    const initialLength = this.bookings.length;
    this.bookings = this.bookings.filter(b => b.id !== id); // Filter out the booking with the given ID
    await this.saveBookings();
    return this.bookings.length !== initialLength; // Return true if booking was deleted, false if not found
  }

  /**
   * Clears all bookings from storage and memory
   * Useful for logout or reset operations
   * 
   * @returns {Promise<void>}
   * 
   * Usage:
   * await bookingService.clearBookings();
   */
  async clearBookings(): Promise<void> {
    this.bookings = [];
    await AsyncStorage.removeItem(BOOKINGS_STORAGE_KEY);
  }
} 