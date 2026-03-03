import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/api/services/room.service'
import type { RoomQuery } from '@/types/room.type'

export const useRooms = (hotelId: string, query: RoomQuery) => {
  return useQuery({
    queryKey: ['rooms', hotelId, query],
    queryFn: () => roomService.getRoomsByHotelId(hotelId, query),
    enabled: !!hotelId,
  })
}

export const useRoomDetail = (hotelId: string, roomId: string) => {
  return useQuery({
    queryKey: ['rooms', hotelId, roomId],
    queryFn: () => roomService.getRoomById(hotelId, roomId),
    enabled: !!hotelId && !!roomId,
  })
}