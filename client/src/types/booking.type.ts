export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  userId: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: BookingStatus
  specialRequest?: string
  createdAt: string
  room?: {
    name: string
    type: string
    pricePerNight: number
    images?: { url: string }[]
    hotel?: {
      id: string
      name: string
      city: string
      images?: { url: string }[]
    }
  }
}

export interface CreateBookingPayload {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequest?: string
}

export interface BookingQuery {
  status?: BookingStatus
  page?: number
  limit?: number
}

export interface BookingListResponse {
  data: Booking[]
  total: number
  page: number
  limit: number
  totalPages: number
}