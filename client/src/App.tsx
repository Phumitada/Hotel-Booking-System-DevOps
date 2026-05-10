import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import AdminLayout from "@/components/AdminLayout";
import BookingPage from "@/pages/Booking";
import PaymentVerificationPage from "@/pages/PaymentVerification";
import PaymentPage from "@/pages/PaymentPage";
import BookingDetailPage from "@/pages/BookingDetail";
import AdminHotels from "@/pages/admin/AdminHotels";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminGuard from "./components/AdminGuard";
import ExplorePage from "./pages/Explore";
import BookingsPage from "./pages/Bookings";
import WishlistPage from "./pages/WishList";
import RoomsPage from "./pages/Rooms";
import HotelsPage from "./pages/Hotels";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/hotels"
          element={
            <MainLayout>
              <HotelsPage />
            </MainLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <MainLayout>
              <ExplorePage />
            </MainLayout>
          }
        />
        <Route
          path="/hotels/:hotelId/rooms"
          element={
            <MainLayout>
              <RoomsPage />
            </MainLayout>
          }
        />
        <Route
          path="/booking/:hotelId/:roomId"
          element={
            <MainLayout>
              <BookingPage />
            </MainLayout>
          }
        />
        <Route
          path="/bookings"
          element={
            <MainLayout>
              <BookingsPage />
            </MainLayout>
          }
        />
        <Route
          path="/search"
          element={
            <MainLayout>
              <HotelsPage />
            </MainLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <MainLayout>
              <WishlistPage />
            </MainLayout>
          }
        />
        <Route path="/payment-verify" element={<PaymentVerificationPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/booking/:bookingId" element={<BookingDetailPage />} />
        <Route
          path="/admin/hotels"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminHotels />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
