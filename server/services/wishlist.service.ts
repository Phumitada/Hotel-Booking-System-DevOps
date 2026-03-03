import { prisma } from "../db/prisma"

export const wishlistService = {
    createWishlist : async (hotelId:string,userId:string) => {
        const wishlist = await prisma.wishlist.create({
            data: {
                hotelId:hotelId,
                userId:userId
            }
        })
        return wishlist
    },
    getWishlistByUserId : async (userId:string) => {
        const wishlists = await prisma.wishlist.findMany({
            where: {
                userId:userId
            },
            include:{
                hotel:{
                    include:{
                        images:{
                            where:{isPrimary:true},
                            take:1
                        }
                    }
                }
            }
        })
        return wishlists
    },
    unWishlist : async (hotelId:string,userId:string) => {
        const wishlist = await prisma.wishlist.delete({
            where: {
                userId_hotelId:{
                    userId:userId,
                    hotelId:hotelId
                }
            }
        })
        return wishlist
    },
}