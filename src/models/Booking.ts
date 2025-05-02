export interface Booking {
  id: string;
  title: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  description?: string;
} 