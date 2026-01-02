
import { AppState, Business, Slot, Booking } from './types';

const STORAGE_KEY = 'noshowpay_v1';

const initialState: AppState = {
  businesses: [],
  slots: [],
  bookings: [],
  platformFee: 15,
};

export const getStore = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialState;
};

export const saveStore = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const addBusiness = (business: Business) => {
  const store = getStore();
  store.businesses.push(business);
  saveStore(store);
};

export const addSlot = (slot: Slot) => {
  const store = getStore();
  store.slots.push(slot);
  saveStore(store);
};

export const createBooking = (booking: Booking) => {
  const store = getStore();
  store.bookings.push(booking);
  // Mark slot as booked
  const slot = store.slots.find(s => s.id === booking.slotId);
  if (slot) slot.status = 'booked';
  saveStore(store);
};

export const updateBookingStatus = (bookingId: string, status: 'refunded' | 'forfeited') => {
  const store = getStore();
  const booking = store.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    const slot = store.slots.find(s => s.id === booking.slotId);
    if (slot) slot.status = 'completed';
    saveStore(store);
  }
};
