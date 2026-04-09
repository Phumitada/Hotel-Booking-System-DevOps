import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotels } from "@/hooks/useHotel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import FilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/ui/pagination";
import HeartWishlist from "@/components/HeartWishlist";
import { getMinPrice } from "@/utils/hotel.utils";
import {
  Search,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Heart,
  ArrowRight,
  Loader2,
  GlassWater,
  Waves,
  Droplets,
  Utensils,
  Baby,
  Users,
  Music,
  Bike,
  Briefcase,
  Compass,
} from "lucide-react";

const amenityIcons: { [key: string]: any } = {
  wifi: Wifi,
  parking: Car,
  "valet parking": Car,
  gym: Dumbbell,
  restaurant: Coffee,
  bar: GlassWater,
  "beach access": MapPin,
  "private beach": MapPin,
  pool: Waves,
  "infinity pool": Waves,
  spa: Heart,
  concierge: Users,
  "kids club": Baby,
  "business center": Briefcase,
  laundry: Droplets,
  "water sports": Waves,
  yoga: Heart,
  "cooking class": Utensils,
  "bicycle rental": Bike,
  cycling: Bike,
  trekking: Compass,
  "beach club": Users,
  "live music": Music,
  kayaking: Waves,
  snorkeling: Waves,
  "snorkeling tours": Waves,
  tennis: Dumbbell,
};

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: hotelsData,
    isLoading,
    error,
  } = useHotels({
    page: currentPage,
    limit: 9,
    city: selectedCities.length > 0 ? selectedCities : undefined,
    starRating:
      selectedRatings.length > 0
        ? selectedRatings.map((r) => parseInt(r))
        : undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
  });

  const { data: allHotelsData } = useHotels({
    page: 1,
    limit: 1000, 
  });

  const hotels = hotelsData?.data || [];
  const totalPages = hotelsData?.totalPages || 1;

  const allHotels = allHotelsData?.data || [];
  const cities = Array.from(
    new Set(allHotels.map((h: any) => h.city).filter(Boolean)),
  ).map((city) => ({
    id: city,
    label: city,
    count: allHotels.filter((h: any) => h.city === city).length,
  }));

  const ratings = [5, 4, 3, 2, 1].map((rating) => ({
    id: rating.toString(),
    label: `${rating} Stars`,
    count: allHotels.filter((h: any) => h.starRating === rating).length,
  }));

  const allAmenities = Array.from(
    new Set(
      allHotels.flatMap((h: any) => h.amenities?.map((a: any) => a.name) || []),
    ),
  ).map((amenity) => ({
    id: amenity,
    label: amenity,
    count: allHotels.filter((h: any) =>
      h.amenities?.some((a: any) => a.name === amenity),
    ).length,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const handleCityChange = (cities: string[]) => {
    setSelectedCities(cities); 
    setCurrentPage(1); 
  };

  const handleRatingChange = (ratings: string[]) => {
    setSelectedRatings(ratings); 
    setCurrentPage(1); 
  };

  const handleAmenityChange = (amenities: string[]) => {
    setSelectedAmenities(amenities);
    setCurrentPage(1); 
  };

  const handleDropdownToggle = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load hotels</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Your Perfect Stay
              </h1>
              <p className="text-gray-600 mt-1">
                Discover amazing hotels at unbeatable prices
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {hotelsData?.total || 0} hotels available
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search hotels, destinations..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 py-3 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              title="City"
              options={cities}
              selectedValues={selectedCities}
              onSelectionChange={handleCityChange}
              isOpen={openDropdown === "city"}
              onToggle={() => handleDropdownToggle("city")}
            />
            <FilterDropdown
              title="Rating"
              options={ratings}
              selectedValues={selectedRatings}
              onSelectionChange={handleRatingChange}
              isOpen={openDropdown === "rating"}
              onToggle={() => handleDropdownToggle("rating")}
            />
            <FilterDropdown
              title="Amenities"
              options={allAmenities}
              selectedValues={selectedAmenities}
              onSelectionChange={handleAmenityChange}
              isOpen={openDropdown === "amenities"}
              onToggle={() => handleDropdownToggle("amenities")}
            />
          </div>
        </div>

        {}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {hotels.map((hotel: any) => (
            <Card
              key={hotel.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div
                onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}
                className="flex-shrink-0"
              >
                <div className="relative">
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={
                        hotel.images.find((img: any) => img.isPrimary)?.url ||
                        hotel.images[0].url
                      }
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <div className="text-muted-foreground text-center">
                        <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MapPin className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HeartWishlist hotelId={hotel.id} />
                  </div>
                </div>
              </div>

              <CardContent className="flex-1 p-4">
                <div className="min-w-0">
                  <CardTitle className="text-lg mb-2 truncate">
                    {hotel.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {hotel.city}, {hotel.country}
                    </span>
                  </CardDescription>

                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium mr-2">
                      {hotel.starRating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({hotel._count?.reviews || 0} reviews)
                    </span>
                  </div>

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.amenities.slice(0, 3).map((amenity: any) => {
                        const Icon =
                          amenityIcons[amenity.name] ||
                          amenityIcons[amenity.name?.toLowerCase()];
                        return (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-1 text-xs text-muted-foreground"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            <span>{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="flex items-center space-x-2">
                      {getMinPrice(hotel.rooms) && (
                        <>
                          <div className="text-xs text-muted-foreground mb-1">from</div>
                          <span className="text-lg font-bold text-card-foreground">
                            ฿{(getMinPrice(hotel.rooms)??0).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">per night</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 flex-shrink-0">
                <Button
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  onClick={() => navigate(`/hotels/${hotel.id}/rooms`)}
                >
                  View Rooms
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
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

        {hotels.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hotels found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
