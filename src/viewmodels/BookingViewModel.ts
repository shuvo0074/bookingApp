import { useState, useCallback } from 'react';
import { Booking } from '../models/Booking';
import { BookingService } from '../services/BookingService';

export const useBookingViewModel = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bookingService = new BookingService();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (booking: Omit<Booking, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newBooking = await bookingService.createBooking(booking);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError('Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBooking = useCallback(async (id: string, booking: Partial<Booking>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await bookingService.updateBooking(id, booking);
      if (updatedBooking) {
        setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      }
      return updatedBooking;
    } catch (err) {
      setError('Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await bookingService.deleteBooking(id);
      if (success) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
}; 