import { useState } from 'react'
import { useAdminBookings, useUpdateBookingStatus } from '@/hooks/useBooking'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Pagination from '@/components/ui/pagination'
import {
  Search, Calendar, MapPin, User, CreditCard,
  CheckCircle, XCircle, Clock, Eye, Filter, Loader2
} from 'lucide-react'

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  const { data: bookingsData, isLoading } = useAdminBookings({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage,
    limit: 10,
  })

  const updateStatusMutation = useUpdateBookingStatus()

  const bookings = bookingsData?.data || []
  const totalPages = bookingsData?.totalPages || 1
  const total = bookingsData?.total || 0

  const filteredBookings = bookings.filter((booking: any) => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return (
      booking.id.toLowerCase().includes(q) ||
      booking.user?.email?.toLowerCase().includes(q) ||
      booking.room?.hotel?.name?.toLowerCase().includes(q) ||
      booking.room?.name?.toLowerCase().includes(q)
    )
  })

  const handleStatusChange = (bookingId: string, status: string) => {
    updateStatusMutation.mutate({ id: bookingId, status })
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
          <p className="text-gray-600 text-sm">Manage and monitor all hotel bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-none border border-gray-300 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ID, email, hotel..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Label className="text-xs font-semibold uppercase tracking-wide">Status:</Label>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-32 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b: any) => b.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b: any) => b.status === 'CONFIRMED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ฿{bookings.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
                    .reduce((sum: number, b: any) => sum + b.totalPrice, 0).toLocaleString()}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle className="text-gray-800">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Hotel</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Dates</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-gray-600">{booking.id.slice(0, 12)}...</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-800">{booking.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-800 font-medium">{booking.room?.hotel?.name}</p>
                      <p className="text-xs text-gray-600">{booking.room?.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" />
                        {booking.room?.hotel?.city}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">to {new Date(booking.checkOut).toLocaleDateString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-800">฿{booking.totalPrice.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-32 rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline" size="sm"
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center space-x-1 rounded-none text-xs font-semibold uppercase tracking-wide"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </CardContent>
      </Card>
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-none p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)} className="rounded-none">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Booking ID</Label>
                <p className="text-sm font-mono text-gray-800">{selectedBooking.id}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Customer</Label>
                <p className="text-sm text-gray-800">{selectedBooking.user?.name}</p>
                <p className="text-xs text-gray-500">{selectedBooking.user?.email}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Hotel</Label>
                <p className="text-sm text-gray-800">{selectedBooking.room?.hotel?.name}</p>
                <p className="text-xs text-gray-500">{selectedBooking.room?.name}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Location</Label>
                <p className="text-sm text-gray-800">{selectedBooking.room?.hotel?.city}, {selectedBooking.room?.hotel?.country}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Check-in</Label>
                <p className="text-sm text-gray-800">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Check-out</Label>
                <p className="text-sm text-gray-800">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Guests</Label>
                <p className="text-sm text-gray-800">{selectedBooking.guests}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Total Price</Label>
                <p className="text-sm font-bold text-gray-800">฿{selectedBooking.totalPrice?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Created</Label>
                <p className="text-sm text-gray-800">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-gray-700">Update Status</Label>
              <Select
                value={selectedBooking.status}
                onValueChange={(value) => handleStatusChange(selectedBooking.id, value)}
              >
                <SelectTrigger className="rounded-none mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedBooking(null)} className="rounded-none text-xs font-semibold uppercase tracking-wide">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings