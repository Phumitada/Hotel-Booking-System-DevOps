import { z } from 'zod'

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  
  checkIn: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), 'Invalid check-in date'),
  
  checkOut: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), 'Invalid check-out date'),
  
  guests: z
    .number()
    .int()
    .min(1, 'At least 1 guest required')
    .max(10, 'Maximum 10 guests'),
  
  specialRequest: z.string().max(500).optional(),
})
.refine(data => new Date(data.checkOut) > new Date(data.checkIn), {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],  
})