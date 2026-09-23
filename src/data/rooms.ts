import type { Room, RoomFeature, RoomStatus, TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  { id: '07:30-09:00', start: '07:30', end: '09:00', period: 'Sáng' },
  { id: '09:15-10:45', start: '09:15', end: '10:45', period: 'Sáng' },
  { id: '11:00-12:30', start: '11:00', end: '12:30', period: 'Sáng' },
  { id: '13:30-15:00', start: '13:30', end: '15:00', period: 'Chiều' },
  { id: '15:15-16:45', start: '15:15', end: '16:45', period: 'Chiều' },
  { id: '17:00-18:30', start: '17:00', end: '18:30', period: 'Tối' },
];

const photos = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
];

const featureSets: RoomFeature[][] = [
  ['Máy chiếu', 'Bảng trắng', 'Điều hòa'],
  ['Yên tĩnh', 'Ổ cắm', 'Điều hòa'],
  ['TV hội nghị', 'Bảng trắng', 'Ổ cắm'],
  ['Máy chiếu', 'Ổ cắm', 'Điều hòa'],
];

const names = [
  'Lab A3-101',
  'Phòng thảo luận A3-204',
  'Không gian mở A3-305',
  'Library Zone B',
  'Phòng đọc nhóm 2.1',
  'Creative Studio',
  'Innovation Hub',
  'Lab AI 4.2',
  'Phòng Seminar 201',
  'Learning Commons',
  'Quiet Room 3A',
  'Media Lab',
  'Lab IoT A3-402',
  'Phòng học nhóm 1.3',
  'Design Thinking Room',
  'Research Corner',
  'Project Room 5B',
  'Digital Library Lab',
  'Phòng Hội thảo nhỏ',
  'Collaboration Space',
  'Lab A3-503',
  'Study Pod 01',
  'Study Pod 02',
  'Graduate Lounge',
];

export const rooms: Room[] = names.map((name, index) => {
  const isLibrary = index % 3 === 0 || index === 3;
  const status: RoomStatus = index % 7 === 0 ? 'occupied' : index % 4 === 0 ? 'limited' : 'available';
  const features = featureSets[index % featureSets.length] ?? featureSets[0]!;

  return {
    id: `room-${String(index + 1).padStart(2, '0')}`,
    name,
    building: isLibrary ? 'Thư viện' : 'Tòa A3',
    floor: isLibrary ? `Tầng ${(index % 4) + 1}` : `Tầng ${(index % 5) + 1}`,
    capacity: [8, 12, 20, 24, 30, 40, 50][index % 7] ?? 20,
    status,
    distance: `${2 + (index % 8)} phút đi bộ`,
    imageUrl: photos[index % photos.length] ?? photos[0]!,
    features,
    description:
      'Không gian học tập sáng, thoáng và linh hoạt cho học cá nhân hoặc làm việc nhóm. Phòng được trang bị đầy đủ thiết bị cần thiết và Wi-Fi tốc độ cao.',
    unavailableSlotsByDay: {
      0: index % 3 === 0 ? ['09:15-10:45', '13:30-15:00'] : ['15:15-16:45'],
      1: index % 2 === 0 ? ['07:30-09:00', '15:15-16:45'] : ['11:00-12:30'],
      2: index % 4 === 0 ? ['09:15-10:45', '17:00-18:30'] : [],
      3: index % 5 === 0 ? ['13:30-15:00'] : ['07:30-09:00'],
      4: [],
    },
  };
});
