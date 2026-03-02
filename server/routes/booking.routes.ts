import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authorize,authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, bookingController.getBookings);
router.get("/:id", authenticate, bookingController.getBookingById);
router.post("/", authenticate, bookingController.createBooking);
router.delete("/:id", authenticate, bookingController.cancelBooking);

export default router;