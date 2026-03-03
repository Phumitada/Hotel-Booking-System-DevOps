import { Link } from 'react-router-dom'
import { useWishlist } from '@/hooks/useWishlist'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HeartWishlist from './HeartWishlist'
import { Heart, Star, MapPin, Wifi, Car, Coffee, Dumbbell, Users, Loader2 } from 'lucide-react'

const amenityIcons = {
  'WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Restaurant': Coffee,
  'Pool': Users,
  'Spa': Heart,
}

interface WishlistItem {
  id: string
  userId: string
  hotelId: string
  createdAt: string
  hotel: {
    id: string
    name: string
    description: string
    address: string
    city: string
    country: string
    starRating: number
    images?: Array<{
      id: string
      url: string
      isPrimary: boolean
    }>
    amenities?: Array<{
      id: string
      name: string
    }>
    _count?: {
      reviews: number
    }
  }
}

export default function Wishlist() {
  const { data: wishlistItems, isLoading, error } = useWishlist()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Wishlist</h2>
          <p className="text-gray-600">Unable to load your wishlist. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding hotels to your wishlist to keep track of your favorite places to stay.
          </p>
          <Link to="/hotels">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Hotels
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            You have {wishlistItems.length} {wishlistItems.length === 1 ? 'hotel' : 'hotels'} in your wishlist
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item: WishlistItem) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {item.hotel.images && item.hotel.images.length > 0 ? (
                  <img
                    src={item.hotel.images[0].url}
                    alt={item.hotel.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Heart Wishlist Button - Top Right */}
                <div className="absolute top-2 right-2">
                  <HeartWishlist hotelId={item.hotelId} />
                </div>

                <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                  {item.hotel.starRating} Stars
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.hotel.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.hotel.city}, {item.hotel.country}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  {item.hotel.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {item.hotel.starRating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({item.hotel._count?.reviews || 0} reviews)
                    </span>
                  </div>
                </div>

                {item.hotel.amenities && item.hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.hotel.amenities.slice(0, 3).map((amenity: any) => {
                      const Icon = amenityIcons[amenity.name as keyof typeof amenityIcons]
                      return (
                        <Badge
                          key={amenity.id}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          {Icon && <Icon className="w-3 h-3" />}
                          {amenity.name}
                        </Badge>
                      )
                    })}
                    {item.hotel.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2">
                <Link to={`/hotels/${item.hotel.id}/rooms`} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Rooms
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
