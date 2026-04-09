import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import AuthLayout from '@/layout/AuthLayout'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import HotelsPage from '@/pages/hotels'
import ExplorePage from '@/pages/explore'
import RoomsPage from '@/pages/rooms'
import BookingPage from '@/pages/Booking'
import BookingsPage from '@/pages/bookings'
import WishlistPage from '@/pages/wishlist'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        } />
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />
        <Route path="/hotels" element={
          <MainLayout>
            <HotelsPage />
          </MainLayout>
        } />
        <Route path="/explore" element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        } />
        <Route path="/hotels/:hotelId/rooms" element={
          <MainLayout>
            <RoomsPage />
          </MainLayout>
        } />
        <Route path="/booking/:hotelId/:roomId" element={
          <MainLayout>
            <BookingPage />
          </MainLayout>
        } />
        <Route path="/bookings" element={
          <MainLayout>
            <BookingsPage />
          </MainLayout>
        } />
        <Route path="/search" element={
          <MainLayout>
            <HotelsPage />
          </MainLayout>
        } />
        <Route path="/wishlist" element={
          <MainLayout>
            <WishlistPage />
          </MainLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App