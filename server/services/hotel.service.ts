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
    const { 
      city, 
      country, 
      starRating, 
      amenities, 
      page = 1, 
      limit = 10,
      search,
      minPrice,
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc',
      ids,
      guests
    } = query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const whereClause: any = {};
    
    if (ids && ids.length > 0) {
      whereClause.id = { in: ids };
    }
    
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
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (guests) {
      const guestCounts = Array.isArray(guests) ? guests : [guests];
      const roomCapacityConditions = guestCounts.map(count => {
        if (count >= 5) {
          return { capacity: { gte: 5 } };
        }
        return { capacity: count };
      });
      
      whereClause.rooms = {
        some: {
          OR: roomCapacityConditions
        }
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const roomFilter: any = {};
      if (minPrice !== undefined) {
        roomFilter.pricePerNight = { gte: minPrice };
      }
      if (maxPrice !== undefined) {
        roomFilter.pricePerNight = { ...roomFilter.pricePerNight, lte: maxPrice };
      }
      
      if (whereClause.rooms) {
        if (whereClause.rooms.some.OR) {
          
          whereClause.rooms.some.AND = [roomFilter];
        } else {
          
          whereClause.rooms.some = { ...whereClause.rooms.some, ...roomFilter };
        }
      } else {
        whereClause.rooms = { some: roomFilter };
      }
    }

    let orderBy: any = {};
    
    if (sortBy === 'price') {

      orderBy = {
        name: sortOrder === 'desc' ? 'desc' : 'asc'
      };
    } else if (sortBy === 'starRating') {
      orderBy = {
        starRating: sortOrder
      };
    } else if (sortBy === 'name') {
      orderBy = {
        name: sortOrder
      };
    } else if (sortBy === 'createdAt') {
      orderBy = {
        createdAt: sortOrder
      };
    } else {
      
      orderBy = {
        name: 'asc'
      };
    }
    
    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy,
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
