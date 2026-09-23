import type { Booking } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetails: { roomId: string };
  BookingSuccess: { booking: Booking };
};

export type MainTabParamList = {
  Browse: undefined;
  Bookings: undefined;
  Profile: undefined;
};
