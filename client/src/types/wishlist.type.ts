export interface WishlistQuery {
  page?: number
  limit?: number
  city?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface WishlistListResponse {
  data: any[]
  total: number
  totalPages: number
  currentPage: number
}
