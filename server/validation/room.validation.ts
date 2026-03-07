import { z } from 'zod'

export const createRoomSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['STANDARD', 'DELUXE', 'SUITE', 'VILLA'], {
    error: 'Invalid room type',
  }),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(20),
  pricePerNight: z.number().positive('Price must be a positive number'),
  totalRooms: z.number().int().min(1, 'Must have at least 1 room'),
})

export const updateRoomSchema = createRoomSchema.partial()