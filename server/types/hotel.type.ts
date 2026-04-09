export interface CreateHotelPayload {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  latitude: number;
  longitude: number;
}

export interface UpdateHotelPayload {
    name?: string
    description?: string
    address?: string
    city?: string
    country?: string
    starRating?: number
    checkInTime?: string
    checkOutTime?: string
    latitude?: number
    longitude?: number
  }
  
export interface QueryHotelPayload {
    city?: string | string[];
    country?: string;
    starRating?: number | number[];
    amenities?: string | string[];
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    ids?: string[];
    guests?: number | number[];
}
