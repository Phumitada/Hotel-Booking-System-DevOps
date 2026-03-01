import type { Request, Response } from 'express'
import { hotelService } from '../services/hotel.service'

export const hotelController = {
  createHotel: async (req: Request, res: Response) => {
    try {
      const hotel = await hotelService.createHotel(req.body)
      res.status(201).json({ success: true, data: hotel }) 
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message })
    }
  },

  getHotels: async (req: Request, res: Response) => {
    try {
      const hotels = await hotelService.getHotels(req.query)
      res.status(200).json({ success: true, data: hotels })
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message })
    }
  },

  getHotelById: async (req: Request, res: Response) => {
    try {
      const hotel = await hotelService.getHotelById(req.params.id) 
      res.status(200).json({ success: true, data: hotel })
    } catch (error) {
      res.status(404).json({ success: false, message: (error as Error).message })
    }
  },

  updateHotel: async (req: Request, res: Response) => {
    try {
      const hotel = await hotelService.updateHotel(req.params.id, req.body)
      res.status(200).json({ success: true, data: hotel })
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message })
    }
  },

  deleteHotel: async (req: Request, res: Response) => {
    try {
      await hotelService.deleteHotel(req.params.id) 
      res.status(200).json({ success: true, message: 'Hotel deleted successfully' })
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message })
    }
  },
}