import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockPrisma } from '../helper/mockPrisma'
import { hotelService } from '../../services/hotel.service'

beforeEach(() => {
    vi.clearAllMocks()
  })

describe('hotelService', () => {
    describe('getHotels', () => {
  
      it('should return paginated result', async () => {
        const mockHotels = [
          { id: 'hotel-1', name: 'Test Hotel', city: 'Bangkok', starRating: 5 }
        ]
        mockPrisma.hotel.findMany.mockResolvedValue(mockHotels)
        mockPrisma.hotel.count.mockResolvedValue(1)
  
        const result = await hotelService.getHotels({ page: 1, limit: 10 })
  
        expect(result.data).toEqual(mockHotels)
        expect(result.total).toBe(1)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.totalPages).toBe(1)
      })
  
      it('should calculate correct skip for pagination', async () => {
        mockPrisma.hotel.findMany.mockResolvedValue([])
        mockPrisma.hotel.count.mockResolvedValue(0)
  
        await hotelService.getHotels({ page: 3, limit: 5 })
  
        expect(mockPrisma.hotel.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 10,  
            take: 5,
          })
        )
      })
  
      it('should filter by city', async () => {
        mockPrisma.hotel.findMany.mockResolvedValue([])
        mockPrisma.hotel.count.mockResolvedValue(0)
  
        await hotelService.getHotels({ city: 'Bangkok' })
  
        expect(mockPrisma.hotel.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              city: expect.objectContaining({
                contains: 'Bangkok'
              })
            })
          })
        )
      })
  
      it('should filter by starRating', async () => {
        mockPrisma.hotel.findMany.mockResolvedValue([])
        mockPrisma.hotel.count.mockResolvedValue(0)
  
        await hotelService.getHotels({ starRating: 5 })
  
        expect(mockPrisma.hotel.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              starRating: 5
            })
          })
        )
      })
  
    })
  
    describe('getHotelById', () => {
  
      it('should return hotel when found', async () => {
        const mockHotel = { id: 'hotel-1', name: 'Test Hotel' }
        mockPrisma.hotel.findUnique.mockResolvedValue(mockHotel)
  
        const result = await hotelService.getHotelById('hotel-1')
  
        expect(result).toEqual(mockHotel)
        expect(mockPrisma.hotel.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: 'hotel-1' }
          })
        )
      })
  
      it('should throw error when hotel not found', async () => {
        mockPrisma.hotel.findUnique.mockResolvedValue(null)
  
        await expect(hotelService.getHotelById('not-exist'))
          .rejects.toThrow('Hotel not found')
      })
  
    })
  
    describe('deleteHotel', () => {
  
      it('should throw error when hotel has active bookings', async () => {
        mockPrisma.booking.count.mockResolvedValue(2)
  
        await expect(hotelService.deleteHotel('hotel-1'))
          .rejects.toThrow('Cannot delete hotel with active bookings')
      })
  
      it('should delete hotel when no active bookings', async () => {
        mockPrisma.booking.count.mockResolvedValue(0)
        mockPrisma.booking.deleteMany.mockResolvedValue({ count: 0 })
        mockPrisma.hotel.delete.mockResolvedValue({})
  
        await hotelService.deleteHotel('hotel-1')
        expect(mockPrisma.hotel.delete).toHaveBeenCalledWith({
          where: { id: 'hotel-1' }
        })
      })
  
    })
  
  })