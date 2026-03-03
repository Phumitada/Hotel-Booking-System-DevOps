import { useQuery } from '@tanstack/react-query'
import { hotelService } from '@/api/services/hotel.service'
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