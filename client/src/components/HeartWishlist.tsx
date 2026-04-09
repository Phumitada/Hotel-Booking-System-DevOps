import { useWishlist, useCreateWishlist, useUnWishlist } from '@/hooks/useWishlist'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeartWishlistProps {
  hotelId: string
  className?: string
}

export default function HeartWishlist({ hotelId, className = '' }: HeartWishlistProps) {
  const { data: wishlistItems } = useWishlist()
  const createWishlistMutation = useCreateWishlist()
  const unWishlistMutation = useUnWishlist()
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (wishlistItems) {
      const hotelInWishlist = wishlistItems.data?.some((item: any) => item.hotelId === hotelId)
      setIsWishlisted(hotelInWishlist)
    }
  }, [wishlistItems, hotelId])

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      unWishlistMutation.mutate(hotelId)
    } else {
      createWishlistMutation.mutate(hotelId)
    }
  }

  const isLoading = createWishlistMutation.isPending || unWishlistMutation.isPending

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-2 rounded-full transition-all duration-200 ${
        isWishlisted
          ? 'bg-red-50 hover:bg-red-100 text-red-500'
          : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
      } ${className}`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-200 ${
          isWishlisted ? 'fill-current' : ''
        } ${isLoading ? 'animate-pulse' : ''}`}
      />
    </Button>
  )
}
