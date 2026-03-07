import { useState } from 'react'
import { useCreateReview } from '@/hooks/useReviews'
import { useBookings } from '@/hooks/useBooking'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Star, Loader2, PenLine } from 'lucide-react'

interface CreateReviewProps {
  hotelId: string
  onReviewCreated?: () => void
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}

export default function CreateReview({ hotelId, onReviewCreated }: CreateReviewProps) {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const createReviewMutation = useCreateReview()

  const { data: bookingsData } = useBookings(
    { status: 'COMPLETED', limit: 100 },
    { enabled: isAuthenticated }
  )

  const completedBookingForHotel = bookingsData?.data?.find(
    (booking: any) => booking.room?.hotel?.id === hotelId
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0 || !comment.trim() || !completedBookingForHotel) return

    createReviewMutation.mutate(
      { bookingId: completedBookingForHotel.id, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setRating(0)
          setComment('')
          setIsExpanded(false)
          onReviewCreated?.()
        },
      }
    )
  }

  const activeRating = hoveredStar || rating

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md bg-white">
        <span className="text-sm text-gray-500">Sign in to leave a review</span>
        <button
          onClick={() => (window.location.href = '/login')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign In
        </button>
      </div>
    )
  }

  // ── No completed stay ──
  if (bookingsData && !completedBookingForHotel) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-md bg-gray-50">
        <Star className="w-4 h-4 text-gray-300 shrink-0" />
        <span className="text-sm text-gray-400">
          Only guests who have completed a stay may leave a review.
        </span>
      </div>
    )
  }

  // ── Collapsed trigger bar ──
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            Write a review for this hotel
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-gray-200" />
          ))}
        </div>
      </button>
    )
  }

  // ── Expanded form ──
  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
      {/* Form header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Write a Review</span>
        </div>
        <button
          onClick={() => { setIsExpanded(false); setRating(0); setComment('') }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Star rating row */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-14 shrink-0">
            Rating
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  i < activeRating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 hover:text-amber-300'
                }`}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(0)}
              />
            ))}
          </div>
          {activeRating > 0 && (
            <span className="text-xs text-gray-500">{RATING_LABELS[activeRating]}</span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Comment */}
        <div className="flex gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide w-14 shrink-0 pt-2">
            Review
          </span>
          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience..."
              rows={3}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-300"
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-300 mt-0.5">
              {comment.length} / 1000
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            disabled={rating === 0 || !comment.trim() || createReviewMutation.isPending}
            className="h-8 px-4 text-xs font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
          >
            {createReviewMutation.isPending ? (
              <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Submitting</>
            ) : (
              'Submit Review'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}