import { Router } from 'express'
import { roomController } from '../controllers/room.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/:hotelId/rooms', roomController.getRoomsByHotelId)
router.get('/:hotelId/rooms/:id', roomController.getRoomsById)
router.post('/:hotelId/rooms', authenticate, authorize('ADMIN'), roomController.createRoom)
router.put('/:hotelId/rooms/:id', authenticate, authorize('ADMIN'), roomController.updateRoom)
router.delete('/:hotelId/rooms/:id', authenticate, authorize('ADMIN'), roomController.deleteRoom)

export default router