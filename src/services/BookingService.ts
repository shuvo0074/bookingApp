import { Booking } from '../models/Booking';

export class BookingService {
  private bookings: Booking[] = [];

  async getBookings(): Promise<Booking[]> {
    return this.bookings;
  }

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | null> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.bookings[index] = { ...this.bookings[index], ...booking };
    return this.bookings[index];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const initialLength = this.bookings.length;
    this.bookings = this.bookings.filter(b => b.id !== id);
    return this.bookings.length !== initialLength;
  }
} 