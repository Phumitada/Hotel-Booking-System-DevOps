import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useHotelDetail } from '@/hooks/useHotel'
import { useRooms } from '@/hooks/useRoom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import FilterDropdown from '@/components/FilterDropdown'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import Pagination from '@/components/ui/pagination'
import Reviews from '@/components/Reviews'
import CreateReview from '@/components/CreateReview'
import { ArrowLeft, Users, Wifi, Car, Coffee, Dumbbell, Heart, Calendar, Loader2, Check, Search, SortAsc, SortDesc } from 'lucide-react'

const amenityIcons = {
  'WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Restaurant': Coffee,
  'Pool': Users,
  'Spa': Heart,
}

export default function RoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [sortBy, setSortBy] = useState('pricePerNight')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
      setCurrentPage(1)
    }, 300) 

    return () => clearTimeout(timer)
  }, [priceRange])
  
  const { data: hotel, isLoading: hotelLoading } = useHotelDetail(hotelId!)

  const { data: allRoomsData } = useRooms(hotelId!, { page: 1, limit: 1000 })
  const allRooms = allRoomsData?.data || []

  const { minRoomPrice, maxRoomPrice } = useMemo(() => {
    if (allRooms.length === 0) return { minRoomPrice: 0, maxRoomPrice: 10000 }
    const prices = allRooms.map((r: any) => r.pricePerNight)
    return {
      minRoomPrice: Math.min(...prices),
      maxRoomPrice: Math.max(...prices)
    }
  }, [allRooms])

  useEffect(() => {
    if (priceRange.min === 0 && priceRange.max === 10000 && (minRoomPrice > 0 || maxRoomPrice < 10000)) {
      setPriceRange({ min: minRoomPrice, max: maxRoomPrice })
      setDebouncedPriceRange({ min: minRoomPrice, max: maxRoomPrice })
    }
  }, [minRoomPrice, maxRoomPrice])

  const roomQuery = {
    name: searchTerm || undefined,
    type: selectedTypes.length > 0 ? selectedTypes : undefined,
    capacity: selectedCapacities.length > 0 ? selectedCapacities.map(c => parseInt(c)) : undefined,
    minPrice: debouncedPriceRange.min > 0 ? debouncedPriceRange.min : undefined,
    maxPrice: debouncedPriceRange.max < 10000 ? debouncedPriceRange.max : undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 9,
  }
  
  const { data: roomsData, isLoading: roomsLoading } = useRooms(hotelId!, roomQuery)
  
  const rooms = roomsData?.data || []
  const totalPages = roomsData?.totalPages || 1
  const isLoading = hotelLoading || roomsLoading

  const roomTypes = Array.from(new Set(allRooms.map((r: any) => r.type)))
    .map(type => ({ id: type, label: type, count: allRooms.filter((r: any) => r.type === type).length }))

  const capacities = Array.from(new Set(allRooms.map((r: any) => r.capacity)))
    .sort((a, b) => a - b)
    .map(capacity => ({ 
      id: capacity.toString(), 
      label: `${capacity} Guests`, 
      count: allRooms.filter((r: any) => r.capacity === capacity).length 
    }))

  const handleBookRoom = (roomId: string) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    navigate(`/booking/${hotelId}/${roomId}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types)
    setCurrentPage(1)
  }

  const handleCapacityChange = (capacities: string[]) => {
    setSelectedCapacities(capacities)
    setCurrentPage(1)
  }

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const handleDropdownToggle = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTypes([])
    setSelectedCapacities([])
    setPriceRange({ min: minRoomPrice || 0, max: maxRoomPrice || 10000 })
    setDebouncedPriceRange({ min: minRoomPrice || 0, max: maxRoomPrice || 10000 })
    setSortBy('pricePerNight')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hotel not found</p>
          <Button onClick={() => navigate('/hotels')}>Back to Hotels</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/hotels')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hotels</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
              <p className="text-gray-600 mt-1">{hotel.city}, {hotel.country}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(hotel.starRating || 0)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full" />
                ))}
              </div>
              <span className="text-sm text-gray-600">({hotel.starRating} stars)</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Hotel</h2>
              <p className="text-gray-600 mb-4">{hotel.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Check-in: {hotel.checkInTime || '3:00 PM'} | Check-out: {hotel.checkOutTime || '11:00 AM'}
                  </span>
                </div>
                
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity: any) => (
                        <Badge key={amenity.id} variant="secondary" className="flex items-center space-x-1">
                          {amenityIcons[amenity.name as keyof typeof amenityIcons] && (
                            (() => {
                              const Icon = amenityIcons[amenity.name as keyof typeof amenityIcons]
                              return <Icon className="w-3 h-3" />
                            })()
                          )}
                          <span>{amenity.name}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {hotel.images && hotel.images.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-2">
                  {hotel.images.slice(0, 4).map((image: any) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={hotel.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
            <div className="text-sm text-gray-500">
              {roomsData?.total || 0} rooms available
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterDropdown
                  title="Room Type"
                  options={roomTypes}
                  selectedValues={selectedTypes}
                  onSelectionChange={handleTypeChange}
                  isOpen={openDropdown === 'type'}
                  onToggle={() => handleDropdownToggle('type')}
                />
                <FilterDropdown
                  title="Capacity"
                  options={capacities}
                  selectedValues={selectedCapacities}
                  onSelectionChange={handleCapacityChange}
                  isOpen={openDropdown === 'capacity'}
                  onToggle={() => handleDropdownToggle('capacity')}
                />
              </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md">
                <PriceRangeSlider
                  min={minRoomPrice || 0}
                  max={maxRoomPrice || 10000}
                  value={priceRange}
                  onChange={(newValue) => setPriceRange(newValue)}
                />
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Button
                  variant={sortBy === 'pricePerNight' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('pricePerNight')}
                  className="flex items-center gap-1"
                >
                  Price
                  {sortBy === 'pricePerNight' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('name')}
                  className="flex items-center gap-1"
                >
                  Name
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={sortBy === 'capacity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('capacity')}
                  className="flex items-center gap-1"
                >
                  Capacity
                  {sortBy === 'capacity' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>
          
          {rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms available</h3>
              <p className="text-gray-600">This hotel doesn't have any rooms available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room: any) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    {room.images && room.images.length > 0 ? (
                      <img
                        src={room.images[0].url}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <span>No Image</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {room.totalRooms} available
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">{room.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {room.type} • Up to {room.capacity} guests
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">฿{room.pricePerNight}</span>
                        <span className="text-sm text-gray-500 ml-1">per night</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity} guests</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Free cancellation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Instant confirmation</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3">
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookRoom(room.id)}
                    >
                      {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {}
          <div className="mt-12">
            <Reviews hotelId={hotelId!} />
          </div>

          {}
          <div className="mt-8">
            <CreateReview 
              hotelId={hotelId!} 
              onReviewCreated={() => {
                
                window.location.reload()
              }}
            />
          </div>

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
    </div>
  )
}
