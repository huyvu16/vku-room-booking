import { useQuery } from '@tanstack/react-query';

import { rooms } from '../data/rooms';
import type { Room } from '../types';

async function fetchRooms(): Promise<Room[]> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return rooms;
}

export function useRoomsQuery() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });
}
