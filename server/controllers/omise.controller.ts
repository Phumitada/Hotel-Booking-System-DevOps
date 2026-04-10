import { Request, Response } from "express";
import { Payment } from "../services/omise.service";
import { bookingService } from "../services/booking.service";

export const PaymentController = {
  checkout: async (req: Request, res: Response) => {
    try {
      const { bookingId, amount, token, source, type } = req.body;
      const return_uri = `${process.env.FRONTEND_URL}/payment-verify?bookingId=${bookingId}`;

      const charge = await Payment.createCharge({ amount, token, source, type, return_uri });

      if (charge.status === "successful") {
        await bookingService.updateBookingStatus(bookingId, "CONFIRMED");
        return res.status(200).json({ success: true, message: "Payment Success", data: charge });
      }

      if (charge.status === "pending" && (charge as any).source?.type === "promptpay") {
        return res.status(200).json({
          success: true,
          promptpay: true,
          qrImage: (charge as any).source?.scannable_code?.image?.download_uri,
          chargeId: charge.id,
          bookingId,
        });
      }

      if (charge.authorize_uri) {
        return res.status(200).json({
          success: true,
          authorize: true,
          url: charge.authorize_uri,
          chargeId: charge.id,
        });
      }

      if (charge.status === "failed") {
        await bookingService.updateBookingStatus(bookingId, "CANCELLED");
        throw new Error(charge.failure_message ?? "Payment failed");
      }

    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  verifyPayment: async (req: Request, res: Response) => {
    try {
      const { chargeId, bookingId, forceResult } = req.body;

      if (process.env.NODE_ENV !== 'production' && forceResult) {
        if (forceResult === 'success') {
          await bookingService.updateBookingStatus(bookingId, "CONFIRMED");
          return res.status(200).json({ success: true, status: "completed" });
        } else {
          await bookingService.updateBookingStatus(bookingId, "CANCELLED");
          return res.status(400).json({ success: false, message: "Payment forcefully failed" });
        }
      }

      const charge = await Payment.getCharge(chargeId);

      if (charge.status === "successful") {
        await bookingService.updateBookingStatus(bookingId, "CONFIRMED");
        return res.status(200).json({ success: true, status: "completed" });
      } else if (charge.status === "pending") {
        return res.status(400).json({ success: false, message: "Payment not confirmed yet. Please scan and pay first." });
      } else {
        await bookingService.updateBookingStatus(bookingId, "CANCELLED");
        return res.status(400).json({ success: false, status: "failed" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};