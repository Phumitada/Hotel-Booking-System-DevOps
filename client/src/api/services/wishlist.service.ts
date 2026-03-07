import { api } from "@/api/client";
import type { WishlistQuery, WishlistListResponse } from "@/types/wishlist.type";

export const wishlistService = {
    createWishlist: async (hoteldId:string) => {
        const response = await api.post(`/wishlist/${hoteldId}`)
        return response.data.data
    },
    getWishlist: async (query: WishlistQuery): Promise<WishlistListResponse> => {
        const response = await api.get(`/wishlist`, {params:query})
        return response.data.data
    },
    unWishlist: async (hoteldId:string) => {
        const response = await api.delete(`/wishlist/${hoteldId}`)
        return response.data.data
    },
}