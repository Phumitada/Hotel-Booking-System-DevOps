import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/api/services/wishlist.service";
import { useAuth } from "@/hooks/useAuth";
import type { WishlistQuery } from "@/types/wishlist.type";

export const useWishlist = (query: WishlistQuery = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["wishlist", query],
    enabled: isAuthenticated,
    queryFn: () => wishlistService.getWishlist(query),
  });
};

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hotelId: string) => wishlistService.createWishlist(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useUnWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hotelId: string) => wishlistService.unWishlist(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
