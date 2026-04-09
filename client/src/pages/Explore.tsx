import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHotels } from '@/hooks/useHotel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FilterDropdown from '@/components/FilterDropdown'
import Pagination from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  Users, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  Heart,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Restaurant': Coffee,
  'Pool': Users,
  'Spa': Heart,
}

const priceRanges = [
  { id: '0-1000', label: 'Under ฿1,000', min: 0, max: 1000 },
  { id: '1000-2000', label: '฿1,000 - ฿2,000', min: 1000, max: 2000 },
  { id: '2000-3000', label: '฿2,000 - ฿3,000', min: 2000, max: 3000 },
  { id: '3000-5000', label: '฿3,000 - ฿5,000', min: 3000, max: 5000 },
  { id: '5000+', label: 'Over ฿5,000', min: 5000, max: 10000 },
]

const sortOptions = [
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'starRating-desc', label: 'Highest Rated' },
  { id: 'starRating-asc', label: 'Lowest Rated' },
  { id: 'name-asc', label: 'Name: A-Z' },
  { id: 'name-desc', label: 'Name: Z-A' },
  { id: 'createdAt-desc', label: 'Newest First' },
  { id: 'createdAt-asc', label: 'Oldest First' },
]

const guestCounts = [
  { id: '1', label: '1 Guest' },
  { id: '2', label: '2 Guests' },
  { id: '3', label: '3 Guests' },
  { id: '4', label: '4 Guests' },
  { id: '5+', label: '5+ Guests' },
]

export default function ExplorePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState('starRating-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([])

  const { data: hotelsData, isLoading } = useHotels({
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
    city: selectedCities.length > 0 ? selectedCities : undefined,
    minPrice: selectedPriceRanges.length > 0 ? Math.min(...selectedPriceRanges.flatMap(r => {
      const range = priceRanges.find(pr => pr.id === r)
      return range ? [range.min] : []
    })) : undefined,
    maxPrice: selectedPriceRanges.length > 0 ? Math.max(...selectedPriceRanges.flatMap(r => {
      const range = priceRanges.find(pr => pr.id === r)
      return range ? [range.max] : []
    })) : undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    guests: selectedGuests.length > 0 ? selectedGuests.map(g => {
      if (g === '5+') return 5;
      return parseInt(g);
    }) : undefined,
    sortBy: selectedSort.split('-')[0] as any,
    sortOrder: selectedSort.split('-')[1] as 'asc' | 'desc',
    ids: selectedHotelIds.length > 0 ? selectedHotelIds : undefined
  })

  const hotels = useMemo(() => {
    let hotelList = hotelsData?.data || []
    
    const [sortBy, sortOrder] = selectedSort.split('-')
    if (sortBy === 'price') {
      hotelList = [...hotelList].sort((a, b) => {
        const aMinPrice = Math.min(...(a.rooms?.map((r: any) => r.pricePerNight) || [Infinity]))
        const bMinPrice = Math.min(...(b.rooms?.map((r: any) => r.pricePerNight) || [Infinity]))
        return sortOrder === 'asc' ? aMinPrice - bMinPrice : bMinPrice - aMinPrice
      })
    }
    
    return hotelList
  }, [hotelsData?.data, selectedSort])
  const totalPages = hotelsData?.totalPages || 1
  const total = hotelsData?.total || 0

  const { data: allHotelsData } = useHotels({ limit: 1000 })
  const allHotels = allHotelsData?.data || []
  
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(allHotels.map(h => h.city).filter(Boolean))]
    return uniqueCities.map(city => ({
      id: city,
      label: city,
      count: allHotels.filter(h => h.city === city).length
    }))
  }, [allHotels])

  const amenities = useMemo(() => {
    const allAmenities = allHotels.flatMap(h => h.amenities || [])
    const uniqueAmenities = [...new Set(allAmenities.map(a => a.name).filter(Boolean))]
    return uniqueAmenities.map(amenity => ({
      id: amenity,
      label: amenity,
      count: allHotels.filter(h => h.amenities?.some(a => a.name === amenity)).length
    }))
  }, [allHotels])

  const handleSearch = (value: string) => { setSearchTerm(value); setCurrentPage(1); }
  const handleCitiesChange = (cities: string[]) => { setSelectedCities(cities); setCurrentPage(1); }
  const handlePriceRangesChange = (ranges: string[]) => { setSelectedPriceRanges(ranges); setCurrentPage(1); }
  const handleAmenitiesChange = (amenities: string[]) => { setSelectedAmenities(amenities); setCurrentPage(1); }
  const handleGuestsChange = (guests: string[]) => { setSelectedGuests(guests); setCurrentPage(1); }
  const handleSortChange = (sort: string[]) => { setSelectedSort(sort[0] || 'starRating-desc'); setCurrentPage(1); }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleBulkFilter = () => {
    if (selectedHotelIds.length > 0) {
      navigate(`/bulk-hotels?ids=${selectedHotelIds.join(',')}`)
    }
  }

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotels/${hotelId}/rooms`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCities([])
    setSelectedPriceRanges([])
    setSelectedAmenities([])
    setSelectedGuests([])
    setSelectedSort('starRating-desc')
    setCurrentPage(1)
    setSelectedHotelIds([])
  }

  const hasActiveFilters = searchTerm || selectedCities.length > 0 || selectedPriceRanges.length > 0 || selectedAmenities.length > 0 || selectedGuests.length > 0 || selectedSort !== 'starRating-desc'
  const hasSelectedHotels = selectedHotelIds.length > 0

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
      <div className="bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Hotels</h1>
            <p className="text-xl mb-8 opacity-90">Discover your perfect stay with advanced search and filters</p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search hotels, destinations, or experiences..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-72 flex-shrink-0`}>
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkFilter}
                    disabled={!hasSelectedHotels}
                    className="text-primary hover:bg-primary/10"
                  >
                    View Selected ({selectedHotelIds.length})
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    placeholder="Hotel name or location..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <FilterDropdown title="City" options={cities} selectedValues={selectedCities} onSelectionChange={handleCitiesChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <FilterDropdown title="Price Range" options={priceRanges} selectedValues={selectedPriceRanges} onSelectionChange={handlePriceRangesChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <FilterDropdown title="Amenities" options={amenities} selectedValues={selectedAmenities} onSelectionChange={handleAmenitiesChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <FilterDropdown title="Sort" options={sortOptions} selectedValues={selectedSort ? [selectedSort] : []} onSelectionChange={handleSortChange} multiple={false} />
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {total} {total === 1 ? 'Hotel' : 'Hotels'} Found
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-gray-500 mt-1">
                    {searchTerm && `Search: "${searchTerm}" `}
                    {selectedCities.length > 0 && `• ${selectedCities.join(', ')} `}
                    {selectedPriceRanges.length > 0 && `• ${selectedPriceRanges.map(r => priceRanges.find(pr => pr.id === r)?.label).join(', ')}`}
                    {selectedGuests.length > 0 && `• ${selectedGuests.map(g => guestCounts.find(gc => gc.id === g)?.label).join(', ')}`}
                    {selectedAmenities.length > 0 && `• ${selectedAmenities.length} amenities`}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-lg border shadow-sm">
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="w-10 h-8 p-0">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="w-10 h-8 p-0">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border shadow-sm"></div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel: any) => (
                  <Card key={hotel.id} className="group cursor-pointer overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col h-full"
                    onClick={() => handleHotelClick(hotel.id)}>
                    <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.images?.[0]?.url || '/placeholder-hotel.jpg'}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-sm text-xs font-semibold shadow-sm">
                          {hotel.city}
                        </Badge>
                      </div>
                    </div>
                    
                    {}
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg leading-tight line-clamp-2">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md flex-shrink-0">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-700">
                            {(hotel.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{hotel.address}</span>
                      </div>

                      {}
                      <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-100">
                        <div className="flex -space-x-1">
                          {hotel.amenities?.slice(0, 3).map((amenity: any, i: number) => {
                            const Icon = amenityIcons[amenity.name] || amenityIcons[amenity.name?.toLowerCase()]
                            return Icon ? (
                              <div key={amenity.id} className="w-8 h-8 rounded-full bg-gray-50 border border-white flex items-center justify-center text-gray-500" title={amenity.name}>
                                <Icon className="w-4 h-4" />
                              </div>
                            ) : null
                          })}
                          {hotel.amenities?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-50 border border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                              +{hotel.amenities.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-gray-500 block mb-0.5">from</span>
                          <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-xl font-bold text-gray-900">
                              ฿{Math.min(...(hotel.rooms?.map((r: any) => r.pricePerNight) || [0])).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel: any) => (
                  <Card key={hotel.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      
                      {}
                      <div className="w-full sm:w-72 h-56 sm:h-auto flex-shrink-0 relative overflow-hidden">
                        <img
                          src={hotel.images?.[0]?.url || '/placeholder-hotel.jpg'}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">{hotel.city}</Badge>
                                <div className="flex items-center">
                                  {renderStars(Math.round(hotel.rating || 0))}
                                </div>
                              </div>
                              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-xl cursor-pointer" 
                                  onClick={() => handleHotelClick(hotel.id)}>
                                {hotel.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {hotel.address}
                              </div>
                            </div>
                            
                            {}
                            <div className="text-left sm:text-right bg-primary/5 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                              <span className="text-xs text-gray-500 block mb-1">Price per night from</span>
                              <span className="text-2xl font-bold text-primary sm:text-gray-900">
                                ฿{Math.min(...(hotel.rooms?.map((r: any) => r.pricePerNight) || [0])).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                            {hotel.description}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          {hotel.amenities?.slice(0, 6).map((amenity: any) => {
                            const Icon = amenityIcons[amenity.name] || amenityIcons[amenity.name?.toLowerCase()]
                            return (
                              <Badge key={amenity.id} variant="secondary" className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-normal px-2.5 py-1">
                                {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
                                {amenity.name}
                              </Badge>
                            )
                          })}
                          {hotel.amenities?.length > 6 && (
                            <span className="text-xs text-gray-500 ml-1">+{hotel.amenities.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}