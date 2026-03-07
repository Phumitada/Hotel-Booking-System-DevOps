import { z } from 'zod';

export const createHotelSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    starRating: z.number().int().min(1).max(5),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
})  

export const updateHotelSchema = createHotelSchema.partial()