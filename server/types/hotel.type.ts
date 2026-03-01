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
    city?: string;
    country?: string;
    starRating?: number;
    page?: number;
    limit?: number;
}
