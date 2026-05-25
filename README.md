# Hotel Booking System

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-6+-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/) [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![nginx](https://img.shields.io/badge/nginx-009639?style=flat&logo=nginx&logoColor=white)](https://nginx.org/) [![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)](https://github.com/features/actions) [![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat&logo=grafana&logoColor=white)](https://grafana.com/)

A full-stack hotel booking platform inspired by Agoda, built with TypeScript and deployed on production infrastructure with Docker, nginx, SSL, and CI/CD automation.

**Live Demo:** https://hotel.phumitada.com  
**API:** https://hotel-api.phumitada.com

**Demo Account**
```
Email:    john@example.com
Password: password123
```

---

## Overview

A production-ready hotel booking system featuring real-time room availability, Omise payment integration (Credit Card + PromptPay QR), JWT authentication with refresh token rotation, and a full admin dashboard for hotel and booking management.

---

## Tech Stack

**Frontend**
- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- React Query, React Hook Form, Zod
- Axios with JWT interceptors

**Backend**
- Node.js, Express, TypeScript
- PostgreSQL 15, Prisma ORM
- Redis (Refresh Token Storage)
- JWT Authentication (Access + Refresh Token)
- Omise Payment Gateway

**Infrastructure**
- Docker, Docker Compose
- nginx (Reverse Proxy + SSL Termination)
- Let's Encrypt (SSL Certificate)
- GitHub Actions (CI/CD Pipeline)
- DigitalOcean VPS (Ubuntu 24.04)
- Grafana, Prometheus, Loki (Observability)

---

## Architecture

```
Client (React + Vite)
  |-- HTTPS
  v
nginx (Reverse Proxy)
  |-- hotel.phumitada.com      --> Frontend Container  (port 5200)
  |-- hotel-api.phumitada.com  --> Backend Container   (port 5001)
  v
Express API Server
  |-- /api/auth
  |-- /api/hotels
  |-- /api/rooms
  |-- /api/bookings
  |-- /api/reviews
  |-- /api/payments
  v
PostgreSQL Container     Redis Container
```

**Database Schema**
```
User --< Booking >-- Room --< Hotel
 |                              |
 +--< Review >------------------+
 |
 +--< Payment
```

| Table   | Description                              |
|---------|------------------------------------------|
| User    | Authentication and profile management    |
| Hotel   | Hotel information, amenities, images     |
| Room    | Room types, pricing, capacity            |
| Booking | Reservation records with status tracking |
| Review  | User ratings and feedback                |
| Payment | Transaction records (Omise)              |

---

## CI/CD Pipeline

Every push to `main` triggers the following pipeline via GitHub Actions:

```
git push origin main
  --> Run unit tests (Vitest)
  --> SSH into VPS
  --> git pull origin main
  --> docker compose up -d --build
```

Deployment only proceeds if all tests pass.

---

## Observability

Production monitoring is implemented with the Grafana PLG stack:

- **Prometheus** — Metrics collection (CPU, RAM, Disk, Network)
- **Node Exporter** — Host-level metrics
- **cAdvisor** — Per-container metrics
- **Loki + Promtail** — Centralized log aggregation
- **Grafana** — Dashboard and alerting

---

## Features

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| Hotel Search         | Filter by city, star rating, amenities, price range      |
| Room Availability    | Real-time availability with date conflict prevention     |
| Booking Management   | Create, view, and cancel reservations                    |
| Payment Processing   | Credit card tokenization and PromptPay QR via Omise      |
| Review System        | Ratings and written reviews for booked hotels            |
| Admin Dashboard      | Hotel, room, and booking management for administrators   |
| JWT Authentication   | Access token (15m) + Refresh token (7d) with rotation    |

---

## Local Development

**Prerequisites**
- Node.js 20+
- Docker Desktop
- npm

**Option 1 — Docker (Recommended)**

```bash
git clone https://github.com/Phumitada/Hotel-Booking-System-DevOps.git
cd Hotel-Booking-System-DevOps

cp .env.example .env
# Edit .env with your values

docker compose up --build
```

Access the application at http://localhost:5200

**Option 2 — Manual**

```bash
# Backend
cd server
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend
cd client
npm install
npm run dev
```

**Environment Variables**

Create `.env` at project root:

```env
POSTGRES_DB=appdb
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_password
DATABASE_URL=postgresql://admin:your_password@db:5432/appdb
REDIS_URL=redis://redis:6379
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
PORT=5000
FRONTEND_URL=https://hotel.phumitada.com
OMISE_PUBLIC_KEY=your_omise_public_key
OMISE_SECRET_KEY=your_omise_secret_key
```

Create `client/.env`:

```env
VITE_API_URL=https://hotel-api.phumitada.com/api
VITE_OMISE_PUBLIC_KEY=your_omise_public_key
```

---

## API Reference

**Authentication**

| Method | Endpoint              | Description                        | Auth    |
|--------|-----------------------|------------------------------------|---------|
| POST   | /api/auth/register    | Register new user                  | Public  |
| POST   | /api/auth/login       | Login, receive tokens              | Public  |
| POST   | /api/auth/refresh     | Refresh access token               | Public  |
| POST   | /api/auth/logout      | Logout, revoke refresh token       | Private |
| GET    | /api/auth/me          | Get current user profile           | Private |

**Hotels**

| Method | Endpoint              | Description                        | Auth    |
|--------|-----------------------|------------------------------------|---------|
| GET    | /api/hotels           | List hotels with filters           | Public  |
| GET    | /api/hotels/:id       | Get hotel details                  | Public  |
| POST   | /api/hotels           | Create hotel                       | Admin   |
| PUT    | /api/hotels/:id       | Update hotel                       | Admin   |
| DELETE | /api/hotels/:id       | Delete hotel                       | Admin   |

**Bookings**

| Method | Endpoint              | Description                        | Auth    |
|--------|-----------------------|------------------------------------|---------|
| GET    | /api/bookings         | Get user bookings                  | Private |
| POST   | /api/bookings         | Create booking                     | Private |
| GET    | /api/bookings/:id     | Get booking details                | Private |
| DELETE | /api/bookings/:id     | Cancel booking                     | Private |

**Payments**

| Method | Endpoint              | Description                        | Auth    |
|--------|-----------------------|------------------------------------|---------|
| POST   | /api/payments/card    | Charge via credit card (Omise)     | Private |
| POST   | /api/payments/promptpay | Create PromptPay QR source       | Private |

---

## Project Structure

```
Hotel-Booking-System-DevOps/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   ├── features/           # Feature modules
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service functions
│   │   └── types/              # TypeScript types
│   └── Dockerfile
├── server/                     # Express backend
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth middleware
│   ├── prisma/                 # Schema + migrations
│   ├── seeds/                  # Seed scripts
│   └── tests/                  # Unit tests
│       ├── helpers/
│       │   └── mockPrisma.ts
│       └── unit/
│           └── hotel.service.test.ts
└── docker-compose.yml
```

---

## Authentication Flow

```
POST /api/auth/login
  --> Access Token  (15 minutes, Bearer)
  --> Refresh Token (7 days, stored in Redis)

Subsequent requests:
  Authorization: Bearer <access_token>

Token expired:
  --> Axios interceptor auto-calls POST /api/auth/refresh
  --> Retries original request
  --> Redirects to login if refresh token also expired
```

---

## Payment Flow

**Credit Card**
```
Client tokenizes card via Omise.js
  --> POST /api/payments/card { token, bookingId }
  --> Server charges token via Omise API
  --> Booking status updated to CONFIRMED
```

**PromptPay**
```
POST /api/payments/promptpay { bookingId }
  --> Server creates Omise source (promptpay)
  --> Returns QR code URL
  --> Client displays QR for user to scan
  --> Webhook updates booking status on payment confirmation
```