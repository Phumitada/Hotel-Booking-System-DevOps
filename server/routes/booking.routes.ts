import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authorize,authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createBookingSchema } from "../validation/booking.validation";

const router = Router();

router.get("/", authenticate, bookingController.getBookings);
router.get("/:id", authenticate, bookingController.getBookingById);
router.post("/", validate(createBookingSchema) ,authenticate, bookingController.createBooking);
router.delete("/:id", authenticate, bookingController.cancelBooking);
router.get("/admin/all", authenticate, authorize('ADMIN'), bookingController.getAllBookings)
router.put("/:id/status", authenticate, authorize('ADMIN'), bookingController.updateBookingStatus)

export default router;