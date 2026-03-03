import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Wishlist from '@/components/Wishlist'

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return <Wishlist />
}
