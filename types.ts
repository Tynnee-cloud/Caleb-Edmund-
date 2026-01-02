
export type UserRole = 'business' | 'customer' | 'admin' | 'none';

export interface Business {
  id: string;
  name: string;
  type: string;
  location: string;
  payoutDetails: string;
  email: string;
}

export type SlotStatus = 'available' | 'booked' | 'completed';
export type BookingStatus = 'paid' | 'refunded' | 'forfeited';

export interface Slot {
  id: string;
  businessId: string;
  date: string;
  time: string;
  bondAmount: number;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  slotId: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  status: BookingStatus;
  amount: number;
  timestamp: number;
}

export interface AppState {
  businesses: Business[];
  slots: Slot[];
  bookings: Booking[];
  platformFee: number; // Percentage, default 15
}
