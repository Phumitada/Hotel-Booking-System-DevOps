import { Router } from "express";
import { PaymentController } from "../controllers/omise.controller";

const router = Router();

router.post("/create-charge",PaymentController.checkout)
router.post("/verify-charge",PaymentController.verifyPayment)

export default router;