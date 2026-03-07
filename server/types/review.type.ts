export interface CreateReviewPayload {
    bookingId: string
    rating: number 
    comment?: string
  }
  
  export interface UpdateReviewPayload {
    rating?: number
    comment?: string
  }
  
  export interface ReviewQuery {
    rating?: number | number[]
    page?: number
    limit?: number
    sortOrder?: 'asc' | 'dsc'
  }