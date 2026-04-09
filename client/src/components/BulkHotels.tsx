import { useState } from 'react'
import { useBulkHotels } from '@/hooks/useBulkHotels'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X, MapPin, Star, Users, Wifi, Car, Coffee, Dumbbell, Heart } from 'lucide-react'

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Restaurant': Coffee,
  'Pool': Users,
  'Spa': Heart,
}

export default function BulkHotels() {
  const [hotelIds, setHotelIds] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const { data: hotels, isLoading, error } = useBulkHotels(hotelIds)

  const handleAddHotel = () => {
    const id = inputValue.trim()
    if (id && !hotelIds.includes(id)) {
      setHotelIds([...hotelIds, id])
      setInputValue('')
    }
  }

  const handleRemoveHotel = (id: string) => {
    setHotelIds(hotelIds.filter(hotelId => hotelId !== id))
  }

  const handleClearAll = () => {
    setHotelIds([])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Bulk Hotel Query
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter hotel ID (e.g., hotel-123)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddHotel()
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleAddHotel} disabled={!inputValue.trim()}>
                  Add Hotel
                </Button>
              </div>

              {}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClearAll} disabled={hotelIds.length === 0}>
                  Clear All
                </Button>
                <Badge variant="secondary">
                  {hotelIds.length} {hotelIds.length === 1 ? 'Hotel' : 'Hotels'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading hotels...</p>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="text-center py-6">
                <p className="text-red-600">Error loading hotels: {error.message}</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && (
            <>
              {hotelIds.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels selected</h3>
                    <p className="text-gray-600">Add hotel IDs to fetch their details</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {}
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Hotels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {hotelIds.map((id) => (
                          <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono">
                                {id}
                              </Badge>
                              <span className="text-sm text-gray-600">Loading...</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveHotel(id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {}
                  {hotels && hotels.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hotels.map((hotel) => (
                        <Card key={hotel.id} className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-0">
                            {}
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={hotel.images?.[0]?.url || '/placeholder-hotel.jpg'}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-semibold">
                                  {hotel.city}
                                </Badge>
                              </div>
                            </div>

                            {}
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                                    {hotel.name}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {hotel.address}, {hotel.city}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center">
                                    {renderStars(Math.round(hotel._count?.reviews || 0))}
                                    <span className="ml-1 text-sm text-gray-600">
                                      ({hotel._count?.reviews || 0})
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {}
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <span className="text-xs text-gray-500 mb-1">from</span>
                                  <span className="text-xl font-bold text-gray-900">
                                    ฿{Math.min(...(hotel.rooms?.map((r: any) => r.pricePerNight) || [0])).toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500">per night</span>
                                </div>
                              </div>

                              {}
                              {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {hotel.amenities.slice(0, 4).map((amenity: any) => {
                                    const Icon = amenityIcons[amenity.name] || amenityIcons[amenity.name?.toLowerCase()]
                                    return (
                                      <div
                                        key={amenity.id}
                                        className="flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-full"
                                      >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        <span>{amenity.name}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
