import { api } from '@/api/client';
import type { CreateReviewPayload, UpdateReviewPayload, Review, ReviewListResponse, ReviewQuery } from '@/types/review.type';

export const reviewService = {
  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const response = await api.post('/reviews', payload)
    return response.data.data
  },

  getReviewsByHotelId: async (hotelId: string, query?: ReviewQuery): Promise<ReviewListResponse> => {
    const response = await api.get(`/reviews/${hotelId}`, { params: query })
    return response.data.data
  },

  updateReview: async (id: string, payload: UpdateReviewPayload): Promise<Review> => {
    const response = await api.put(`/reviews/${id}`, payload)
    return response.data.data
  },

  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`)
  },
}