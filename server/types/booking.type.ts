export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface CreateBookingPayload {
    roomId: string,
    userId: string,
    checkIn: string,
    checkOut: string,
    guests: number,
    specialRequest?: string
}

export interface BookingQuery {
    status?: BookingStatus
    page?: number
    limit?: number
  }