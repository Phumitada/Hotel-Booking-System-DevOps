import { useState } from 'react'
import { useReviews, useUpdateReview } from '@/hooks/useReviews'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import FilterDropdown from '@/components/FilterDropdown'
import Pagination from '@/components/ui/pagination'
import { Star, User, ChevronDown, ChevronUp, PenLine, Loader2, Check, X } from 'lucide-react'

interface ReviewsProps {
  hotelId: string
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
}

export default function Reviews({ hotelId }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editComment, setEditComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)

  const effectiveLimit = showAll ? 10 : 3
  const { user } = useAuth()
  const updateReviewMutation = useUpdateReview()

  const { data: reviewsData, isLoading } = useReviews(hotelId, {
    page: currentPage,
    limit: effectiveLimit,
    rating: selectedRatings.length > 0 ? selectedRatings.map(r => parseInt(r)) : undefined,
    sortOrder: 'dsc',
  })

  const { data: allReviewsData } = useReviews(hotelId, { limit: 1000 })

  const reviews = reviewsData?.data || []
  const allReviews = allReviewsData?.data || []
  const totalPages = reviewsData?.totalPages || 1
  const total = reviewsData?.total || 0

  const ratings = [5, 4, 3, 2, 1].map(r => ({
    id: r.toString(),
    label: `${r} Stars`,
    count: allReviews.filter((rv: any) => rv.rating === r).length,
  }))

  const startEdit = (review: any) => {
    setEditingId(review.id)
    setEditRating(review.rating)
    setEditComment(review.comment || '')
    setHoveredStar(0)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditRating(0)
    setEditComment('')
    setHoveredStar(0)
  }

  const handleUpdate = (reviewId: string) => {
    if (editRating === 0 || !editComment.trim()) return
    updateReviewMutation.mutate(
      { id: reviewId, reviewData: { rating: editRating, comment: editComment.trim() } },
      { onSuccess: () => cancelEdit() }
    )
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
    ))

  const renderEditStars = () => {
    const active = hoveredStar || editRating
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < active ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-300'
        }`}
        onClick={() => setEditRating(i + 1)}
        onMouseEnter={() => setHoveredStar(i + 1)}
        onMouseLeave={() => setHoveredStar(0)}
      />
    ))
  }
  
  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Guest Reviews</h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Guest Reviews</h3>
        <div className="border border-gray-100 rounded-lg p-8 text-center bg-white">
          <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No reviews yet for this hotel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Guest Reviews <span className="text-gray-400 font-normal">({total})</span>
        </h3>
        <div className="flex items-center gap-2">
          {showAll && (
            <>
              <FilterDropdown
                title="Rating"
                options={ratings}
                selectedValues={selectedRatings}
                onSelectionChange={(r) => { setSelectedRatings(r); setCurrentPage(1) }}
                isOpen={openDropdown === 'rating'}
                onToggle={() => setOpenDropdown(openDropdown === 'rating' ? null : 'rating')}
              />
              {selectedRatings.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => { setSelectedRatings([]); setCurrentPage(1) }}
                  className="text-gray-400 hover:text-gray-600 text-xs h-7 px-2">
                  Clear
                </Button>
              )}
            </>
          )}
          {total > 3 && (
            <button
              onClick={() => { setShowAll(!showAll); setCurrentPage(1) }}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              {showAll
                ? <><ChevronUp className="w-4 h-4" /> Show Less</>
                : <><ChevronDown className="w-4 h-4" /> Show All ({total - 3} more)</>
              }
            </button>
          )}
        </div>
      </div>

      {}
      <div className="space-y-2">
        {reviews.map((review: any) => {
          const isOwner = user?.id === review.user?.id || user?.userId === review.user?.id
          const isEditing = editingId === review.id

          return (
            <div
              key={review.id}
              className={`rounded-lg border bg-white overflow-hidden transition-all ${
                isOwner
                  ? 'border-amber-300 ring-1 ring-amber-100'
                  : 'border-gray-100'
              }`}
            >
              {}
              {isOwner && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-amber-50 border-b border-amber-100">
                  <span className="text-xs font-semibold text-amber-600 tracking-wide uppercase">
                    Your Review
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(review)}
                      className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-700 transition-colors"
                    >
                      <PenLine className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>
              )}

              {}
              {!isEditing && (
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isOwner ? 'bg-amber-50' : 'bg-gray-100'
                      }`}>
                        <User className={`w-4 h-4 ${isOwner ? 'text-amber-400' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 leading-tight">
                          {review.user?.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                          <span className="text-xs text-gray-400">{review.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 shrink-0 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">{review.comment}</p>
                </div>
              )}

              {}
              {isEditing && (
                <div className="px-4 pb-4 pt-3 space-y-3">
                  {}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-14 shrink-0">
                      Rating
                    </span>
                    <div className="flex items-center gap-1">{renderEditStars()}</div>
                    {(hoveredStar || editRating) > 0 && (
                      <span className="text-xs text-gray-400">
                        {RATING_LABELS[hoveredStar || editRating]}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-amber-100" />

                  {}
                  <div className="flex gap-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-14 shrink-0 pt-2">
                      Review
                    </span>
                    <div className="flex-1">
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        className="w-full text-sm px-3 py-2 border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 resize-none"
                      />
                      <div className="text-right text-xs text-gray-300 mt-0.5">
                        {editComment.length} / 1000
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded border border-gray-200 hover:border-gray-300"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(review.id)}
                      disabled={editRating === 0 || !editComment.trim() || updateReviewMutation.isPending}
                      className="flex items-center gap-1 text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded"
                    >
                      {updateReviewMutation.isPending
                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving</>
                        : <><Check className="w-3 h-3" /> Save Changes</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {}
      {showAll && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}