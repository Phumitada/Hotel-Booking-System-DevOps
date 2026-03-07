export interface CreateReviewPayload {
    hotelId: string;
    rating: number;
    comment: string;
}

export interface UpdateReviewPayload {
    rating: number;
    comment: string;
}

export interface ReviewQuery {
    hotelId?: string;
    rating?: number | number[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'dsc';
}

export interface Review {
    id: string;
    userId: string;
    hotelId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
    }
}

export interface ReviewListResponse {
    data: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}