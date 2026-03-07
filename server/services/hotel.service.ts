import { prisma } from "../db/prisma";
import type {
  CreateHotelPayload,
  UpdateHotelPayload,
  QueryHotelPayload,
} from "../types/hotel.type";

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
    });
    return hotel;
  },

  getHotels: async (query: QueryHotelPayload) => {
    const { city, country, starRating, amenities, page = 1, limit = 10 } = query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const whereClause: any = {};
    
    if (city) {
      if (Array.isArray(city)) {
        whereClause.city = { in: city };
      } else {
        whereClause.city = { contains: city, mode: "insensitive" };
      }
    }
    
    if (country) {
      whereClause.country = { contains: country, mode: "insensitive" };
    }
    
    if (starRating) {
      if (Array.isArray(starRating)) {
        whereClause.starRating = { in: starRating.map(r => Number(r)) };
      } else {
        whereClause.starRating = Number(starRating);
      }
    }

    if (amenities) {
      const amenityNames = Array.isArray(amenities) ? amenities : [amenities];
      whereClause.amenities = {
        some: {
          name: { in: amenityNames }
        }
      };
    }
    
    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { name: "asc" },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        amenities: true,
        _count: {
          select: { reviews: true },
        },
        rooms : {
          select :{
            pricePerNight : true
          }
        }
      },
    });

    const total = await prisma.hotel.count({
      where: whereClause,
    });

    return {
      data: hotels,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
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
    });

    if (!hotel) throw new Error("Hotel not found");

    return hotel;
  },

  updateHotel: async (id: string, payload: UpdateHotelPayload) => {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: payload,
    });
    return hotel;
  },

  deleteHotel: async (id: string) => {
    const activeBookings = await prisma.booking.count({
      where: {
        room: { hotelId: id },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (activeBookings > 0) {
      throw new Error("Cannot delete hotel with active bookings");
    }
    await prisma.booking.deleteMany({
      where: { room: { hotelId: id } },
    });

    await prisma.hotel.delete({ where: { id } });
  },
};
