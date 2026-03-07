import type { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import type { AuthRequest } from "../middleware/auth.middleware";

export const reviewController = {
    createReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as AuthRequest).user.userId
            const review = await reviewService.createReview(userId, req.body)
            res.status(201).json({ success: true, data: review ,message:"Review created successfully" })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    getReviewsByHotelId: async (req: Request, res: Response) => {
        try {
            const reviews = await reviewService.getReviewsByHotelId(req.params.hotelId, req.query)
            res.status(200).json({ success: true, data: reviews ,message:"Reviews retrieved successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    updateReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as AuthRequest).user.userId
            const reviewId = req.params.id  
            const review = await reviewService.updateReview(userId, reviewId, req.body)
            res.status(200).json({ success: true, data: review ,message:"Review updated successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    deleteReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as AuthRequest).user.userId
            await reviewService.deleteReview(req.params.id, userId)
            res.status(200).json({ success: true, message: 'Review deleted successfully' })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
}