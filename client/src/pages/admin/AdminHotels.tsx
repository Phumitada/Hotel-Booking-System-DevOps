import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHotels, useCreateHotel, useUpdateHotel, useDeleteHotel } from '@/hooks/useHotel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Pagination from '@/components/ui/pagination'
import {
  Plus, Edit, Trash2, Search, MapPin, Star,
  Image as ImageIcon, Save, X, Loader2
} from 'lucide-react'

const AdminHotels = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'Thailand',
    starRating: 3,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: '',
    images: '',
  })

  const { data: hotelsData, isLoading } = useHotels({ page: currentPage, limit: 9 })
  const createHotelMutation = useCreateHotel()
  const updateHotelMutation = useUpdateHotel()
  const deleteHotelMutation = useDeleteHotel()

  const hotels = hotelsData?.data || []

  const filteredHotels = hotels.filter((hotel: any) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '', description: '', address: '', city: '',
      country: 'Thailand', starRating: 3,
      checkInTime: '14:00', checkOutTime: '12:00',
      amenities: '', images: '',
    })
  }

  const openEditModal = (hotel: any) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      starRating: hotel.starRating,
      checkInTime: hotel.checkInTime || '14:00',
      checkOutTime: hotel.checkOutTime || '12:00',
      amenities: hotel.amenities?.map((a: any) => a.name).join(', ') || '',
      images: hotel.images?.map((i: any) => i.url).join(', ') || '',
    })
  }

  const buildPayload = () => ({
    name: formData.name,
    description: formData.description,
    address: formData.address,
    city: formData.city,
    country: formData.country,
    starRating: formData.starRating,
    checkInTime: formData.checkInTime,
    checkOutTime: formData.checkOutTime,
    amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
    images: formData.images.split(',').map(url => ({ url: url.trim(), isPrimary: false }))
      .filter(img => img.url)
      .map((img, i) => ({ ...img, isPrimary: i === 0 })),
  })

  const handleCreate = () => {
    createHotelMutation.mutate(buildPayload(), {
      onSuccess: () => { setIsCreateModalOpen(false); resetForm() }
    })
  }

  const handleUpdate = () => {
    if (!editingHotel) return
    updateHotelMutation.mutate({ id: editingHotel.id, data: buildPayload() }, {
      onSuccess: () => { setEditingHotel(null); resetForm() }
    })
  }

  const handleDelete = (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return
    deleteHotelMutation.mutate(hotelId)
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
          <h1 className="text-2xl font-bold text-gray-800">Hotel Management</h1>
          <p className="text-gray-600 text-sm">Manage your hotel inventory</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 rounded-none text-xs font-semibold uppercase tracking-wide"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hotel</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel: any) => (
          <Card key={hotel.id} className="overflow-hidden border border-gray-300">
            <div className="aspect-video bg-gray-100 relative">
              {hotel.images?.length > 0 ? (
                <img
                  src={hotel.images.find((i: any) => i.isPrimary)?.url || hotel.images[0].url}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <div className="inline-flex items-center space-x-1 px-2 py-1 bg-white text-black text-xs font-semibold uppercase tracking-wide rounded-none">
                  <Star className="w-3 h-3" />
                  <span>{hotel.starRating}</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{hotel.name}</h3>
                <div className="flex space-x-1 shrink-0 ml-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(hotel)} className="p-1 rounded-none">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handleDelete(hotel.id)}
                    disabled={deleteHotelMutation.isPending}
                    className="p-1 text-red-600 hover:text-red-700 rounded-none"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="flex flex-wrap gap-1">
                {hotel.amenities?.slice(0, 3).map((amenity: any) => (
                  <div key={amenity.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold uppercase tracking-wide rounded-none">
                    {amenity.name}
                  </div>
                ))}
                {hotel.amenities?.length > 3 && (
                  <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-none">
                    +{hotel.amenities.length - 3}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hotelsData && hotelsData.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={hotelsData.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingHotel) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-none p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingHotel ? 'Edit Hotel' : 'Create New Hotel'}
              </h2>
              <Button variant="outline" size="sm" onClick={() => { setIsCreateModalOpen(false); setEditingHotel(null); resetForm() }} className="rounded-none">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter hotel name" />
                </div>
                <div>
                  <Label htmlFor="starRating">Star Rating</Label>
                  <Select value={formData.starRating.toString()} onValueChange={(v) => setFormData({ ...formData, starRating: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(r => (
                        <SelectItem key={r} value={r.toString()}>{r} {r === 1 ? 'Star' : 'Stars'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter hotel description" rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street address" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInTime">Check-in Time</Label>
                  <Input id="checkInTime" value={formData.checkInTime} onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })} placeholder="14:00" />
                </div>
                <div>
                  <Label htmlFor="checkOutTime">Check-out Time</Label>
                  <Input id="checkOutTime" value={formData.checkOutTime} onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })} placeholder="12:00" />
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input id="amenities" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} placeholder="wifi, pool, spa, restaurant" />
              </div>

              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input id="images" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} placeholder="https://example.com/image1.jpg" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setEditingHotel(null); resetForm() }} className="rounded-none text-xs font-semibold uppercase tracking-wide">
                Cancel
              </Button>
              <Button
                onClick={editingHotel ? handleUpdate : handleCreate}
                disabled={createHotelMutation.isPending || updateHotelMutation.isPending}
                className="flex items-center space-x-2 rounded-none text-xs font-semibold uppercase tracking-wide"
              >
                {(createHotelMutation.isPending || updateHotelMutation.isPending)
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Save className="w-4 h-4" />
                }
                <span>{editingHotel ? 'Update' : 'Create'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHotels