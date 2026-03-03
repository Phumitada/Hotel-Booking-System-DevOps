export interface Hotel {
  id: string
  name: string
  description: string
  address: string
  city: string
  country: string
  starRating: number
  checkInTime: string
  checkOutTime: string
  latitude?: number
  longitude?: number
  images?: HotelImage[]
  amenities?: HotelAmenity[]
  rooms?: Room[]
  _count?: {
    reviews: number
  }
}

export interface HotelImage {
  id: string
  url: string
  isPrimary: boolean
}

export interface HotelAmenity {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  type: string
  capacity: number
  pricePerNight: number
  totalRooms: number
  images?: RoomImage[]
}

export interface RoomImage {
  id: string
  url: string
}

export interface CreateHotelPayload {
  name: string
  description: string
  address: string
  city: string
  country: string
  starRating: number
  checkInTime?: string
  checkOutTime?: string
  latitude?: number
  longitude?: number
}

export interface UpdateHotelPayload {
  name?: string
  description?: string
  address?: string
  city?: string
  country?: string
  starRating?: number
  checkInTime?: string
  checkOutTime?: string
  latitude?: number
  longitude?: number
}

export interface HotelQuery {
  city?: string | string[]
  country?: string
  starRating?: number | number[]
  amenities?: string | string[]
  page?: number
  limit?: number
}

export interface HotelListResponse {
  data: Hotel[]
  total: number
  page: number
  limit: number
  totalPages: number
}