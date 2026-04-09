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
      sortBy = 'pricePerNight',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = query

    const where: any = {
      hotelId,
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' as const }
    }

    if (type) {
      if (Array.isArray(type)) {
        where.type = { in: type }
      } else {
        where.type = { contains: type, mode: 'insensitive' as const }
      }
    }

    if (capacity) {
      if (Array.isArray(capacity)) {
        where.capacity = { in: capacity.map(Number) }
      } else {
        where.capacity = Number(capacity)
      }
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {}
      if (minPrice) where.pricePerNight.gte = Number(minPrice)
      if (maxPrice) where.pricePerNight.lte = Number(maxPrice)
    }

    let orderBy: any = {}
    if (sortBy === 'pricePerNight') {
      orderBy.pricePerNight = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'capacity') {
      orderBy.capacity = sortOrder
    } else if (sortBy === 'type') {
      orderBy.type = sortOrder
    } else {
      orderBy.pricePerNight = sortOrder 
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy,
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