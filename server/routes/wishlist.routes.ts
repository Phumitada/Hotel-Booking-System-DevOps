import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post("/:hotelId", authenticate, wishlistController.createWishlist)
router.get("/", authenticate, wishlistController.getWishlist)
router.delete("/:hotelId", authenticate, wishlistController.unWishlist)

export default router;