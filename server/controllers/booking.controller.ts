import type { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.createBooking({
        ...req.body,
        userId: (req as AuthRequest).user.userId,
      });
      res
        .status(201)
        .json({
          success: true,
          data: booking,
          message: "Booking created successfully",
        });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  },
  getBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await bookingService.getBookingsByUserId(
        (req as AuthRequest).user.userId,
        req.query
      );
      res
        .status(200)
        .json({
          success: true,
          data: bookings,
          message: "Bookings retrieved successfully",
        });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  },
  getBookingById: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res
        .status(200)
        .json({
          success: true,
          data: booking,
          message: "Booking retrieved successfully",
        });
    } catch (error) {
      res
        .status(404)
        .json({ success: false, message: (error as Error).message });
    }
  },
  cancelBooking: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.cancelBooking(
        req.params.id,
        (req as AuthRequest).user.userId
      );
      res
        .status(200)
        .json({
          success: true,
          data: booking,
          message: "Booking cancelled successfully",
        });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  },
};
