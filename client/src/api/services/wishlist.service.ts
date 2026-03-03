import { api } from "@/api/client";

export const wishlistService = {
    createWishlist: async (hoteldId:string) => {
        const response = await api.post(`/wishlist/${hoteldId}`)
        return response.data.data
    },
    getWishlist: async () => {
        const response = await api.get(`/wishlist`)
        return response.data.data
    },
    unWishlist: async (hoteldId:string) => {
        const response = await api.delete(`/wishlist/${hoteldId}`)
        return response.data.data
    },
}