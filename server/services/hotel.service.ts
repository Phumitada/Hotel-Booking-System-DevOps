import { prisma } from '../db/prisma'
import type { CreateHotelPayload, UpdateHotelPayload, QueryHotelPayload } from '../types/hotel.type'

export const hotelService = {

  createHotel: async (payload: CreateHotelPayload) => {
    const hotel = await prisma.hotel.create({
      data: {
        name: payload.name,
        description: payload.description,
        address: payload.address,
        city: payload.city,
        country: payload.country,
        starRating: payload.starRating,
        checkInTime: payload.checkInTime,
        checkOutTime: payload.checkOutTime,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
    })
    return hotel
  },

  getHotels: async (query: QueryHotelPayload) => {
    const { city, country, starRating, page = 1, limit = 10 } = query

    const hotels = await prisma.hotel.findMany({
      where: {
        city: city ? { contains: city, mode: 'insensitive' } : undefined,
        country: country ? { contains: country, mode: 'insensitive' } : undefined,
        starRating: starRating ? Number(starRating) : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        images: {
          where: { isPrimary: true }, 
          take: 1,
        },
        amenities: true,
        _count: {
          select: { reviews: true }, 
        },
      },
    })

    const total = await prisma.hotel.count({
      where: {
        city: city ? { contains: city, mode: 'insensitive' } : undefined,
        country: country ? { contains: country, mode: 'insensitive' } : undefined,
        starRating: starRating ? Number(starRating) : undefined,
      },
    })

    return {
      data: hotels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  getHotelById: async (id: string) => {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: true,
        rooms: {
          include: {
            images: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!hotel) throw new Error('Hotel not found')

    return hotel
  },

  updateHotel: async (id: string, payload: UpdateHotelPayload) => {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: payload,
    })
    return hotel
  },

  deleteHotel: async (id: string) => {
    await prisma.hotel.delete({
      where: { id },
    })
  },
}