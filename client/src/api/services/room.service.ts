import { api } from '@/api/client';
import type { CreateRoomPayload, Room, RoomListResponse, RoomQuery, UpdateRoomPayload } from '@/types/room.type';

export const roomService = {
    createRoom: async (hotelId: string, payload: CreateRoomPayload): Promise<Room> => {
      const response = await api.post(`/hotels/${hotelId}/rooms`, payload)
      return response.data.data
    },
  
    getRoomsByHotelId: async (hotelId: string, query: RoomQuery): Promise<RoomListResponse> => {
      const response = await api.get(`/hotels/${hotelId}/rooms`, { params: query })
      return response.data.data
    },
  
    getRoomById: async (hotelId: string, id: string): Promise<Room> => {
      const response = await api.get(`/hotels/${hotelId}/rooms/${id}`)
      return response.data.data
    },
  
    updateRoom: async (hotelId: string, id: string, payload: UpdateRoomPayload): Promise<Room> => {
      const response = await api.put(`/hotels/${hotelId}/rooms/${id}`, payload)
      return response.data.data
    },
  
    deleteRoom: async (hotelId: string, id: string): Promise<void> => {
      await api.delete(`/hotels/${hotelId}/rooms/${id}`)
    },
  }