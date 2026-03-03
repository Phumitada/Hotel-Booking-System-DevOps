export type RoomType = 'STANDARD' | 'DELUXE' | 'SUITE' | 'VILLA'

export interface CreateRoomPayload {
  hotelId: string
  name: string
  description?: string
  type: RoomType
  capacity: number
  pricePerNight: number
  totalRooms: number
}

export interface UpdateRoomPayload {
  name?: string
  description?: string
  type?: RoomType
  capacity?: number
  pricePerNight?: number
  totalRooms?: number
}

export interface RoomQuery {
  name?: string;
  type?: RoomType | RoomType[];
  capacity?: number | number[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}