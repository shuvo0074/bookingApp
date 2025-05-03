export interface Booking {
  id: string;
  hospitalId: string;
  hospitalName: string;
  itemId: string;
  itemName: string;
  itemType: 'test' | 'service';
  price: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
} 