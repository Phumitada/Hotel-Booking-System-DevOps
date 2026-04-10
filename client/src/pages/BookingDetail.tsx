import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBookingDetail } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Loader2,
  Download,
  Share2,
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

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "payment" | "policies">("overview");

  const { data: booking, isLoading, error } = useBookingDetail(bookingId!);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-none p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200">
          <p className="text-red-600 mb-4">Failed to load booking details</p>
          <Button onClick={() => navigate("/bookings")}>Back to Bookings</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    return Math.ceil(
      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/bookings")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-600">Booking ID: {booking.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(booking.status).replace('border-', 'bg-').replace('text-', 'text-')}`}>
                {getStatusIcon(booking.status)}
                <span>{booking.status}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "payment", label: "Payment" },
                  { id: "policies", label: "Policies" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Hotel Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hotel Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {booking.room?.hotel?.images && booking.room.hotel.images.length > 0 ? (
                          <img
                            src={booking.room.hotel.images[0]?.url || ''}
                            alt={booking.room.hotel.name || 'Hotel'}
                            className="w-32 h-32 object-cover rounded-none"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 rounded-none flex items-center justify-center border border-gray-300">
                            <MapPin className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {booking.room?.hotel?.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>
                            {booking.room?.hotel?.city}
                          </span>
                        </div>
                        <div className="flex items-center mb-4">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm">4 Stars</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Room Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Room Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {booking.room?.type}
                      </h3>
                      <p className="text-gray-600 mb-4">Comfortable room with modern amenities</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Capacity</p>
                            <p className="font-medium">Up to {booking.guests} guests</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Nights</p>
                            <p className="font-medium">{calculateNights()} nights</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Guests</p>
                            <p className="font-medium">{booking.guests} guests</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Check-in
                        </label>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(new Date(booking.checkIn), "EEEE, MMMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(booking.checkIn), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Check-out
                        </label>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(new Date(booking.checkOut), "EEEE, MMMM dd, yyyy")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(booking.checkOut), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Guest Information</p>
                          <p className="text-sm text-gray-500">Booking for {booking.guests} guests</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Rate ({booking.room?.pricePerNight}/night)</span>
                        <span className="font-medium">
                          ฿{booking.room?.pricePerNight?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Nights</span>
                        <span className="font-medium">{calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ฿{(booking.room?.pricePerNight || 0 * calculateNights()).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total Amount</span>
                          <span className="text-blue-600">฿{(booking.room?.pricePerNight || 0 * calculateNights()).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Credit Card</p>
                        <p className="text-sm text-gray-500">Payment processed via Omise</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === "policies" && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-sm p-4 mb-6">
                        <p className="text-sm text-gray-600">
                          <strong>Important:</strong> Cancellation may be subject to the hotel's cancellation policy. 
                          Please review the terms before proceeding.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-4 py-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Free Cancellation:</span> Cancel up to 24 hours before check-in for a full refund.
                        </p>
                      </div>
                      <div className="border-l-4 border-yellow-400 pl-4 py-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Late Cancellation:</span> Cancellations within 24 hours of check-in may incur a charge equal to the first night's stay.
                        </p>
                      </div>
                      <div className="border-l-4 border-red-400 pl-4 py-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">No-Show Policy:</span> Failure to arrive at the hotel will result in a charge for the full booking amount.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hotel Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Check-in / Check-out</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>Check-in: 2:00 PM - 10:00 PM</li>
                          <li>Check-out: 11:00 AM</li>
                          <li>Early check-in / Late check-out subject to availability</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">House Rules</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>No smoking in rooms</li>
                          <li>No pets allowed</li>
                          <li>No parties or events</li>
                          <li>Quiet hours: 10:00 PM - 7:00 AM</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Payment Terms</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>Full payment required at booking</li>
                          <li>All major credit cards accepted</li>
                          <li>Prices include taxes and fees</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium text-right truncate max-w-[120px]" title={booking.id}>
                      {booking.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-blue-600 text-right">
                      ฿{(booking.room?.pricePerNight || 0 * calculateNights()).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  If you have any questions about your booking, please contact us.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hotel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.status === "PENDING" && (
                  <Button
                    onClick={() => navigate(`/payment?bookingId=${booking.id}&amount=${Number(booking.totalPrice)}`)}
                    className="w-full"
                  >
                    Complete Payment
                  </Button>
                )}
                {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                  <Button variant="destructive" className="w-full">
                    Cancel Booking
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Modify Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
