import { useState } from 'react'
import { useReviews } from '@/hooks/useReviews'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FilterDropdown from '@/components/FilterDropdown'
import Pagination from '@/components/ui/pagination'
import { Star, User, ChevronDown, ChevronUp } from 'lucide-react'

interface ReviewsProps {
  hotelId: string
}

export default function Reviews({ hotelId }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  const limit = showAll ? 50 : 3
  const effectiveLimit = showAll ? 10 : 3 // Use smaller limit for pagination when showing all

  const { data: reviewsData, isLoading } = useReviews(hotelId, {
    page: currentPage,
    limit: effectiveLimit,
    rating: selectedRatings.length > 0 ? selectedRatings.map(r => parseInt(r)) : undefined,
    sortOrder: 'dsc'
  })

  // Get all reviews for filter counts (without pagination)
  const { data: allReviewsData } = useReviews(hotelId, {
    limit: 1000
  })

  const reviews = reviewsData?.data || []
  const allReviews = allReviewsData?.data || []
  const totalPages = reviewsData?.totalPages || 1
  const total = reviewsData?.total || 0

  // Get unique ratings for filter
  const ratings = [5, 4, 3, 2, 1].map(rating => ({
    id: rating.toString(),
    label: `${rating} Stars`,
    count: allReviews.filter((r: any) => r.rating === rating).length
  }))

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRatingChange = (ratings: string[]) => {
    setSelectedRatings(ratings)
    setCurrentPage(1)
  }

  const handleDropdownToggle = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)
  }

  const clearFilters = () => {
    setSelectedRatings([])
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedRatings.length > 0

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

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Reviews</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Reviews</h3>
        <div className="bg-white rounded-lg p-6 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet for this hotel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Guest Reviews ({total})
        </h3>
        <div className="flex items-center gap-2">
          {showAll && (
            <>
              <FilterDropdown
                title="Rating"
                options={ratings}
                selectedValues={selectedRatings}
                onSelectionChange={handleRatingChange}
                isOpen={openDropdown === 'rating'}
                onToggle={() => handleDropdownToggle('rating')}
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
            </>
          )}
          {total > (showAll ? effectiveLimit : limit) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAll(!showAll)
                setCurrentPage(1)
              }}
              className="text-primary hover:text-primary-hover/80"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All ({total - limit} more)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review: any) => (
          <Card key={review.id} className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.user.name}</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.rating}.0</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {showAll && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
