import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/api/services/wishlist.service";

export const useWishlist = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: () => wishlistService.getWishlist(),
    })
}

export const useCreateWishlist = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (hotelId:string) => wishlistService.createWishlist(hotelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })
}

export const useUnWishlist = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (hotelId:string) => wishlistService.unWishlist(hotelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })
}