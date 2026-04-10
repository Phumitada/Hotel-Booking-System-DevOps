import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBookings, useCancelBooking } from '@/hooks/useBooking'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Pagination from '@/components/ui/pagination'
import { Calendar, MapPin, Users, Star, ArrowRight, Loader2, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BookingsPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null)
  
  const cancelBookingMutation = useCancelBooking()
  
  const { data: bookingsData, isLoading, error } = useBookings({ page: currentPage, limit: 10 })
  
  const bookings = bookingsData?.data || []
  const totalPages = bookingsData?.totalPages || 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCancelBooking = (bookingId: string) => {
    cancelBookingMutation.mutate(bookingId, {
      onSuccess: () => {
        setShowCancelDialog(null)
      }
    })
  }

  const canCancelBooking = (status: string) => {
    return status === 'PENDING' || status === 'CONFIRMED'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your bookings</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load bookings</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your hotel reservations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-none flex items-center justify-center mx-auto mb-4 border border-gray-300">
              <Calendar className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven't made any hotel reservations yet</p>
            <Button onClick={() => window.location.href = '/hotels'}>
              Browse Hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {}
                    <div className="flex-shrink-0">
                      {booking.room?.hotel?.images?.length > 0 ? (
                        <img
                          src={booking.room.hotel.images.find((img: any) => img.isPrimary)?.url || booking.room.hotel.images[0].url}
                          alt={booking.room.hotel.name}
                          className="w-32 h-32 object-cover rounded-none"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-none flex items-center justify-center border border-gray-300">
                          <MapPin className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.room?.hotel?.name}
                          </h3>
                          <p className="text-gray-600 mb-2">{booking.room?.name}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {booking.room?.hotel?.city}, {booking.room?.hotel?.country}
                          </div>
                        </div>
                        <div className={`inline-flex items-center space-x-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(booking.status).replace('border-', 'bg-').replace('text-', 'text-')}`}>
                          {booking.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-500">Guests</p>
                            <p className="font-medium">{booking.guests}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">฿{booking.totalPrice}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {booking.status === 'CONFIRMED' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/booking/${booking.id}`)}
                            >
                              View Details
                            </Button>
                          )}
                          {booking.status === 'PENDING' && (
                            <Button
                            size="sm"
                            onClick={() => navigate(`/payment?bookingId=${booking.id}&amount=${Number(booking.totalPrice)}`)}
                          >
                            Complete Payment
                          </Button>
                          )}
                          {canCancelBooking(booking.status) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setShowCancelDialog(booking.id)}
                              disabled={cancelBookingMutation.isPending}
                            >
                              {cancelBookingMutation.isPending && showCancelDialog === booking.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

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
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-none p-6 max-w-md w-full mx-4 shadow-lg border border-gray-300">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Booking</h3>
              <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-4 py-2 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Important:</span> Cancellation may be subject to the hotel's cancellation policy. 
                Please review the terms before proceeding.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(null)}
                className="flex-1"
                disabled={cancelBookingMutation.isPending}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(showCancelDialog)}
                className="flex-1"
                disabled={cancelBookingMutation.isPending}
              >
                {cancelBookingMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
