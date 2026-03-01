import { Router } from "express";
import { hotelController } from "../controllers/hotel.controller";
import { authorize,authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/",hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.post("/", authenticate, authorize("ADMIN"), hotelController.createHotel);
router.put("/:id", authenticate, authorize("ADMIN"), hotelController.updateHotel);
router.delete("/:id", authenticate, authorize("ADMIN"), hotelController.deleteHotel);

export default router;