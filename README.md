# Hotel Booking System

A modern, full-stack hotel booking platform inspired by Agoda, built with cutting-edge technologies and best practices.

## Features

### Core Functionality
- **Hotel Management** - Browse, search, and filter hotels by location, price, and amenities
- **Room Booking** - Real-time room availability checking and reservation system
- **User Authentication** - Secure JWT-based authentication with role-based access
- **Payment Integration** - Mock payment processing with order management
- **Review System** - User ratings and reviews for hotels
- **Admin Dashboard** - Complete hotel and booking management for administrators

### Technical Features
- **Real-time Availability** - Prevent double bookings with database transactions
- **Advanced Search** - Filter by dates, guests, price range, and amenities
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation across stack
- **State Management** - React Query for server state management
- **Database Relations** - Complex relationships with Prisma ORM

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management and caching
- **React Hook Form** - Form validation and management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Modern database toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Input validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Fast build tool and dev server

## Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── db/                 # Database connection
└── shared/                 # Shared types and utilities
```

## Database Schema

### Core Models
- **User** - Authentication and profile management
- **Hotel** - Hotel information and details
- **Room** - Room types and availability
- **Booking** - Reservation management
- **Review** - User ratings and feedback
- **Payment** - Transaction records

### Key Relationships
- Users can have multiple bookings
- Hotels can have multiple rooms
- Rooms can have multiple bookings (non-overlapping)
- Users can review hotels they've booked

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agoda-clone
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Setup database**
   ```bash
   cd server
   # Create .env file with database URL
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/agoda_clone" > .env
   
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   ```

4. **Start development servers**
   ```bash
   # Backend (port 5000)
   cd server
   npm run dev
   
   # Frontend (port 3000)
   cd client
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (admin)
- `PUT /api/hotels/:id` - Update hotel (admin)

### Rooms
- `GET /api/rooms` - Get rooms with availability
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `GET /api/reviews` - Get hotel reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Zod schemas for API validation
- **Role-based Access** - Admin vs user permissions
- **SQL Injection Prevention** - Prisma ORM protection
- **CORS Configuration** - Cross-origin resource sharing

## UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern UI** - Clean, professional interface
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation feedback
- **Toast Notifications** - Non-intrusive user feedback

## Testing (Future)

- **Unit Tests** - Jest for component and utility testing
- **Integration Tests** - Supertest for API testing
- **E2E Tests** - Playwright for user flow testing

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd server
npm run build
# Deploy with environment variables
```

### Database (Supabase/PlanetScale)
- Configure connection string in production
- Run migrations in production environment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Agoda](https://www.agoda.com/)
- Built with modern web technologies
- Following best practices and design patterns

---

**Note:** This is a portfolio project demonstrating full-stack development skills with modern technologies.
