import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TIME_SLOTS } from '../data/rooms';
import type { Booking, RoomFilters, TimeSlot } from '../types';
import { dateKeyFromOffset } from '../utils/date';

interface NewBooking {
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  slot: TimeSlot;
}

interface BookingResult {
  ok: boolean;
  booking?: Booking;
  reason?: string;
}

interface BookingState {
  filters: RoomFilters;
  bookings: Booking[];
  setQuery: (query: string) => void;
  toggleAvailable: () => void;
  setMinCapacity: (capacity: RoomFilters['minCapacity']) => void;
  setBuilding: (building: RoomFilters['building']) => void;
  setFeature: (feature: RoomFilters['feature']) => void;
  clearFilters: () => void;
  hasConflict: (date: string, slotId: string) => boolean;
  bookRoom: (input: NewBooking) => BookingResult;
  cancelBooking: (bookingId: string) => void;
}

const defaultFilters: RoomFilters = {
  query: '',
  availableOnly: false,
  minCapacity: 0,
  building: '',
  feature: '',
};

const initialSlot = TIME_SLOTS[2]!;

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      bookings: [
        {
          id: 'BK-2401',
          roomId: 'room-06',
          roomName: 'Creative Studio',
          building: 'Tòa A3',
          date: dateKeyFromOffset(1),
          slot: initialSlot,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
        },
      ],
      setQuery: (query) => set((state) => ({ filters: { ...state.filters, query } })),
      toggleAvailable: () =>
        set((state) => ({
          filters: { ...state.filters, availableOnly: !state.filters.availableOnly },
        })),
      setMinCapacity: (capacity) =>
        set((state) => ({
          filters: {
            ...state.filters,
            minCapacity: state.filters.minCapacity === capacity ? 0 : capacity,
          },
        })),
      setBuilding: (building) =>
        set((state) => ({
          filters: {
            ...state.filters,
            building: state.filters.building === building ? '' : building,
          },
        })),
      setFeature: (feature) =>
        set((state) => ({
          filters: {
            ...state.filters,
            feature: state.filters.feature === feature ? '' : feature,
          },
        })),
      clearFilters: () => set({ filters: defaultFilters }),
      hasConflict: (date, slotId) =>
        get().bookings.some(
          (booking) =>
            booking.status === 'confirmed' && booking.date === date && booking.slot.id === slotId,
        ),
      bookRoom: (input) => {
        if (get().hasConflict(input.date, input.slot.id)) {
          return {
            ok: false,
            reason: 'Bạn đã có một lịch đặt khác trong khung giờ này.',
          };
        }

        const booking: Booking = {
          ...input,
          id: `BK-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
        };
        set((state) => ({ bookings: [booking, ...state.bookings] }));
        return { ok: true, booking };
      },
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== bookingId),
        })),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings }),
      version: 1,
    },
  ),
);
