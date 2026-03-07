import { z } from 'zod';

export const registerSchema = z.object({
    
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),

    email: z.email('Please enter a valid email address'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be at most 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
        .optional(),
    
})

export const loginSchema = z.object({

    email: z.email('Please enter a valid email address'),
    
    password: z
        .string()
        .min(1, 'Password is required'),
})