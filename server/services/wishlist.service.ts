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
    getWishlistByUserId: async (userId: string, query: any) => {
        const { city, page = 1, limit = 9 } = query
        const pageNum = Number(page) || 1
        const limitNum = Number(limit) || 9
      
        const whereClause: any = { userId }  
        if (city) {
          whereClause.hotel = Array.isArray(city)
            ? { city: { in: city } }
            : { city: { contains: city, mode: 'insensitive' } }
        }
      
        const [wishlists, total] = await Promise.all([
          prisma.wishlist.findMany({
            where: whereClause,
            skip: (pageNum - 1) * limitNum,  
            take: limitNum,                 
            include: {
              hotel: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                  rooms: {
                    select: {
                        pricePerNight: true,
                    }
                  }
                },
              },
            },
          }),
          prisma.wishlist.count({ where: whereClause }),
        ])
      
        return {
          data: wishlists,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        }
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