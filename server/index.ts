import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import hotelRoutes from './routes/hotel.routes'
import roomRoutes from './routes/room.routes'
import bookingRoutes from './routes/booking.routes'
import wishlistRoutes from './routes/wishlist.routes'
import reviewRoutes from './routes/review.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/hotels', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})