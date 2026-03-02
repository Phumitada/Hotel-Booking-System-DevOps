import type { Request,Response } from "express";
import { roomService } from "../services/room.service";

export const roomController = {
    createRoom: async (req:Request, res:Response) => {
        try {
            const room = await roomService.createRoom({
                ...req.body,
                hotelId: req.params.hotelId,})
            res.status(201).json({ success: true, data: room ,message:"Room created successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    getRoomsByHotelId: async (req:Request, res:Response) => {
        try {
            const rooms = await roomService.getRoomsByHotelId(req.params.hotelId, req.query)
            res.status(200).json({ success: true, data: rooms ,message:"Rooms retrieved successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    getRoomsById: async (req:Request, res:Response) => {
        try {
            const room = await roomService.getRoomById(req.params.id)
            res.status(200).json({ success: true, data: room,message:"Room retrieved successfully" })
        } catch (error) {
            res.status(404).json({ success: false, message: (error as Error).message }) 
        }
    },
    updateRoom: async (req:Request, res:Response) => {
        try {
            const room = await roomService.updateRoom(req.params.id, req.body)
            res.status(200).json({ success: true, data: room ,message:"Room updated successfully" })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
    deleteRoom: async (req:Request, res:Response) => {
        try {
            await roomService.deleteRoom(req.params.id)
            res.status(200).json({ success: true, message: 'Room deleted successfully' })
        } catch (error) {
            res.status(400).json({ success: false, message: (error as Error).message })
        }
    },
}