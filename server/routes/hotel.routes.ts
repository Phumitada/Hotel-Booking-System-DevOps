import { Router } from "express";
import { hotelController } from "../controllers/hotel.controller";
import { authorize,authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createHotelSchema, updateHotelSchema } from "../validation/hotel.validation";

const router = Router();

router.get("/",hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.post("/", validate(createHotelSchema),authenticate, authorize("ADMIN"), hotelController.createHotel);
router.put("/:id", validate(updateHotelSchema),authenticate, authorize("ADMIN"), hotelController.updateHotel);
router.delete("/:id", authenticate, authorize("ADMIN"), hotelController.deleteHotel);

export default router;