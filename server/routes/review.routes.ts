import { Router } from 'express'
import { reviewController } from '../controllers/review.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticate, reviewController.createReview)
router.get('/:hotelId', reviewController.getReviewsByHotelId)
router.put('/:id', authenticate, reviewController.updateReview)
router.delete('/:id', authenticate, reviewController.deleteReview)

export default router