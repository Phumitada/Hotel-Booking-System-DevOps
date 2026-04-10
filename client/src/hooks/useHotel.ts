import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelService } from '@/api/services/hotel.service'
import { toast } from 'sonner'
import type { HotelQuery } from '@/types/hotel.type'

export const useHotels = (query: HotelQuery) => {
  return useQuery({
    queryKey: ['hotels', query],
    queryFn: () => hotelService.getHotels(query),
  })
}

export const useHotelDetail = (id: string) => {
  return useQuery({
    queryKey: ['hotels', id],
    queryFn: () => hotelService.getHotelById(id),
    enabled: !!id,
  })
}

export const useCreateHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => hotelService.createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel created successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create hotel')
    },
  })
}

export const useUpdateHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      hotelService.updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update hotel')
    },
  })
}

export const useDeleteHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      toast.success('Hotel deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete hotel')
    },
  })
}