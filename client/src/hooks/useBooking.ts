import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { bookingService } from '@/api/services/booking.service'
import type { BookingQuery, CreateBookingPayload } from '@/types/booking.type'

export const useBookings = (query: BookingQuery) => {
  return useQuery({
    queryKey: ['bookings', query],
    queryFn: () => bookingService.getBookings(query),
  })
}

export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking created successfully!')
      navigate('/bookings')
    },
    onError: (error) => {
      toast.error((error as Error).message || 'Failed to create booking')
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking cancelled successfully!')
    },
    onError: (error) => {
      toast.error((error as Error).message || 'Failed to cancel booking')
    },
  })
}