import { Request, Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const wishlistController = {
    createWishlist: async (req:Request,res:Response) => {
        try {
            const wishlist = await wishlistService.createWishlist(req.params.hotelId,(req as AuthRequest).user.userId)
            res.status(201).json({ success: true, data: wishlist ,message:"Hotel added to wishlist successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    getWishlist: async (req:Request,res:Response) => {
        try {
            const wishlist = await wishlistService.getWishlistByUserId((req as AuthRequest).user.userId,req.query)
            res.status(200).json({ success: true, data: wishlist ,message:"Wishlist retrieved successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    unWishlist: async (req:Request,res:Response) => {
        try {
            const wishlist = await wishlistService.unWishlist(req.params.hotelId,(req as AuthRequest).user.userId)
            res.status(200).json({ success: true, data: wishlist ,message:"Hotel removed from wishlist successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    }
}