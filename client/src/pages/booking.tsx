import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHotelDetail } from "@/hooks/useHotel";
import { useRoomDetail } from "@/hooks/useRoom";
import { useCreateBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: Coffee,
  "Beach Access": MapPin,
  Pool: Users,
};

export default function BookingPage() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [checkIn, setCheckIn] = useState(format(today, "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(tomorrow, "yyyy-MM-dd"));

  const [guests, setGuests] = useState(1);

  const { data: hotel, isLoading: hotelLoading } = useHotelDetail(hotelId!);
  const { data: room, isLoading: roomLoading } = useRoomDetail(
    hotelId!,
    roomId!
  );
  const createBookingMutation = useCreateBooking();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (hotelLoading || roomLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Found</h2>
          <p className="text-gray-600 mb-4">Hotel or room not found</p>
          <Button onClick={() => navigate("/hotels")}>Back to Hotels</Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    createBookingMutation.mutate(
      {
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
      },
      {
        onSuccess: () => {
          navigate("/bookings");
        },
        onError: (error: any) => {
          alert(error.message || "Failed to create booking");
        },
      }
    );
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return nights * room.pricePerNight;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/hotels/${hotelId}/rooms`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>
                  Review your booking details and confirm your reservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={room.capacity}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Hotel Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{hotel.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.address}, {hotel.city}
                      </p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm">
                          {hotel.starRating} Stars
                        </span>
                      </div>
                    </div>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Hotel Amenities</h5>
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.map((amenity: any) => {
                            const Icon =
                              amenityIcons[
                                amenity.name as keyof typeof amenityIcons
                              ];
                            return (
                              <div
                                key={amenity.id}
                                className="flex items-center text-sm text-gray-600"
                              >
                                {Icon && <Icon className="h-4 w-4 mr-1" />}
                                {amenity.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Room Information
                  </h3>
                  <div className="space-y-2">
                    <h4 className="font-medium">{room.type}</h4>
                    <p className="text-sm text-gray-600">{room.description}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      Up to {room.capacity} guests
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Room Rate</span>
                  <span>฿{room.pricePerNight.toLocaleString()}/night</span>
                </div>

                {checkIn && checkOut && (
                  <>
                    <div className="flex justify-between">
                      <span>Check-in</span>
                      <span>{format(new Date(checkIn), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out</span>
                      <span>{format(new Date(checkOut), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nights</span>
                      <span>
                        {Math.ceil(
                          (new Date(checkOut).getTime() -
                            new Date(checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>฿{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={
                    createBookingMutation.isPending || !checkIn || !checkOut
                  }
                  className="w-full"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By confirming this booking, you agree to our terms and
                  conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
