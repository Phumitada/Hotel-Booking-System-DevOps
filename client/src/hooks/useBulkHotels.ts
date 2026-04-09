import { useQuery } from "@tanstack/react-query"
import { hotelService } from "@/api/services/hotel.service"

export const useBulkHotels = (ids: string[]) => {
  return useQuery({
    queryKey: ["bulk-hotels", ids],
    queryFn: () => hotelService.getBulkHotels(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5, 
  })
}
