export interface Room {
  id: string;
  name: string;
  description?: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
  images?: RoomImage[];
}

export interface CreateRoomPayload {
  hotelId: string;
  name: string;
  description?: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
}

export interface UpdateRoomPayload {
  name?: string;
  description?: string;
  type?: string;
  capacity?: number;
  pricePerNight?: number;
  totalRooms?: number;
}

export interface RoomQuery {
  name?: string;
  type?: string | string[];
  capacity?: number | number[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RoomImage {
  id: string;
  url: string;
}

export interface RoomListResponse {
  data: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
