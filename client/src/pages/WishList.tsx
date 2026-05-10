import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import FilterDropdown from '@/components/FilterDropdown'
import Pagination from '@/components/ui/pagination'
import HeartWishlist from '@/components/HeartWishlist'
import { getMinPrice } from '@/utils/hotel.utils'
import { Heart, Star, MapPin, Wifi, Car, Coffee, Dumbbell, Users, Loader2, Search, X } from 'lucide-react'

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
    images?: Array<{ id: string; url: string; isPrimary: boolean }>
    amenities?: Array<{ id: string; name: string }>
    rooms?: Array<{ id: string; pricePerNight: number }>
    _count?: { reviews: number }
  }
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const { data: wishlistData, isLoading, error } = useWishlist({
    page: currentPage,
    limit: 9,
    city: selectedCities.length > 0 ? selectedCities : undefined,
  })

  const { data: allWishlistData } = useWishlist({ page: 1, limit: 1000 })

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
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

  const wishlistItems: WishlistItem[] = wishlistData?.data || []
  const allWishlistItems: WishlistItem[] = allWishlistData?.data || []
  const totalPages = wishlistData?.totalPages || 1
  const total = wishlistData?.total || 0

  const cities = Array.from(new Set(allWishlistItems.map((item) => item.hotel.city).filter(Boolean)))
    .map((city) => ({
      id: city,
      label: city,
      count: allWishlistItems.filter((item) => item.hotel.city === city).length,
    }))

  const hasActiveFilters = searchTerm || selectedCities.length > 0

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handleCityChange = (cities: string[]) => { setSelectedCities(cities); setCurrentPage(1) }
  const handleDropdownToggle = (id: string) => setOpenDropdown(openDropdown === id ? null : id)
  const handleSearchChange = (value: string) => { setSearchTerm(value); setCurrentPage(1) }
  const clearFilters = () => { setSearchTerm(''); setSelectedCities([]); setCurrentPage(1) }

  if (wishlistItems.length === 0 && !hasActiveFilters) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding hotels to your wishlist to keep track of your favorite places to stay.
          </p>
          <Link to="/hotels">
            <Button>Browse Hotels</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            You have {total} {total === 1 ? 'hotel' : 'hotels'} in your wishlist
          </p>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search wishlist..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 py-3 border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterDropdown
                title="City"
                options={cities}
                selectedValues={selectedCities}
                onSelectionChange={handleCityChange}
                isOpen={openDropdown === 'city'}
                onToggle={() => handleDropdownToggle('city')}
              />
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {item.hotel.images && item.hotel.images.length > 0 ? (
                    <img
                      src={item.hotel.images.find((img) => img.isPrimary)?.url || item.hotel.images[0].url}
                      alt={item.hotel.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <HeartWishlist hotelId={item.hotelId} />
                  </div>
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    {item.hotel.starRating} Stars
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{item.hotel.name}</CardTitle>
                  <CardDescription className="flex items-center text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.hotel.city}, {item.hotel.country}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{item.hotel.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{item.hotel.starRating}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({item.hotel._count?.reviews || 0} reviews)
                      </span>
                    </div>
                    {item.hotel.rooms && item.hotel.rooms.length > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">from</div>
                        <div className="text-lg font-bold text-gray-900">
                          ฿{(getMinPrice(item.hotel.rooms) ?? 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    )}
                  </div>

                  {item.hotel.amenities && item.hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.hotel.amenities.slice(0, 3).map((amenity) => {
                        const Icon = amenityIcons[amenity.name as keyof typeof amenityIcons]
                        return (
                          <Badge key={amenity.id} variant="secondary" className="text-xs flex items-center gap-1">
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
                    <Button className="w-full">View Rooms</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
