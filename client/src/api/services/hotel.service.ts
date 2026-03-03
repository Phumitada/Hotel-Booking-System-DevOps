import { api } from "@/api/client";
import type {
  CreateHotelPayload,
  Hotel,
  HotelListResponse,
  HotelQuery,
  UpdateHotelPayload,
} from "@/types/hotel.type";

export const hotelService = {
  createHotel: async (payload: CreateHotelPayload): Promise<Hotel> => {
    const response = await api.post("/hotels", payload);
    return response.data.data;
  },
  getHotels: async (query: HotelQuery): Promise<HotelListResponse> => {
    const response = await api.get("/hotels", { params: query });
    return response.data.data;
  },
  getHotelById: async (id: string): Promise<Hotel> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data.data;
  },
  updateHotel: async (
    id: string,
    payload: UpdateHotelPayload
  ): Promise<Hotel> => {
    const response = await api.put(`/hotels/${id}`, payload);
    return response.data.data;
  },
  deleteHotel: async (id: string): Promise<void> => {
    await api.delete(`/hotels/${id}`);
  },
};
