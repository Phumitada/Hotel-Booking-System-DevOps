import { api } from '@/api/client'
import type { CreateBookingPayload, Booking, BookingListResponse, BookingQuery } from '@/types/booking.type'

export const bookingService = {
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await api.post('/bookings', payload)
    return response.data.data
  },

  getBookings: async (query: BookingQuery): Promise<BookingListResponse> => {
    const response = await api.get('/bookings', { params: query })
    return response.data.data
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`)
    return response.data.data
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`) 
  },
}