export type RoomStatus = 'available' | 'limited' | 'occupied';

export type RoomFeature =
  | 'Máy chiếu'
  | 'Bảng trắng'
  | 'Yên tĩnh'
  | 'Ổ cắm'
  | 'Điều hòa'
  | 'TV hội nghị';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  status: RoomStatus;
  distance: string;
  imageUrl: string;
  features: RoomFeature[];
  description: string;
  unavailableSlotsByDay: Record<number, string[]>;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  period: 'Sáng' | 'Chiều' | 'Tối';
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  slot: TimeSlot;
  createdAt: string;
  status: 'confirmed';
}

export interface RoomFilters {
  query: string;
  availableOnly: boolean;
  minCapacity: 0 | 20 | 40;
  building: '' | 'A3' | 'Thư viện';
  feature: '' | RoomFeature;
}
