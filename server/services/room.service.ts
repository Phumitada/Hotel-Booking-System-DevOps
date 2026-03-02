import { prisma } from '../db/prisma'
import type { CreateRoomPayload, UpdateRoomPayload, RoomQuery } from '../types/room.type'

export const roomService = {
  createRoom: async (payload: CreateRoomPayload) => {
    const room = await prisma.room.create({
      data: {
        hotelId: payload.hotelId,
        name: payload.name,
        description: payload.description,
        type: payload.type,
        capacity: payload.capacity,
        pricePerNight: payload.pricePerNight,
        totalRooms: payload.totalRooms,
      },
    })
    return room
  },

  getRoomsByHotelId: async (hotelId: string, query: RoomQuery) => {
    const {
      name,
      type,
      capacity,
      minPrice,  
      maxPrice,  
      page = 1,
      limit = 10,
    } = query

    const where = {
      hotelId,
      name: name ? { contains: name, mode: 'insensitive' as const } : undefined,
      type: type ? type : undefined,
      capacity: capacity ? Number(capacity) : undefined,
      pricePerNight: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { pricePerNight: 'asc' },
        include: {
          images: true,
          _count: {
            select: { bookings: true },
          },
        },
      }),
      prisma.room.count({ where }),
    ])

    return {
      data: rooms,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  },

  getRoomById: async (id: string) => {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        images: true,
      },
    })
    if (!room) throw new Error('Room not found')
    return room
  },

  updateRoom: async (id: string, payload: UpdateRoomPayload) => {
    const room = await prisma.room.update({
      where: { id },
      data: payload,
    })
    return room
  },

  deleteRoom: async (id: string) => {
    await prisma.room.delete({
      where: { id },
    })
  },
}