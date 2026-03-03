import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  ArrowRight, MapPin, Star, Shield, Zap, Hotel,
  Wifi, Car, Coffee, Dumbbell, Users, ChevronRight
} from 'lucide-react'
import chiang_mai  from '@/assets/imgs/chiang_mai.jpg'
import pattaya from '@/assets/imgs/pattaya.jpg'

const stats = [
  { value: '500+', label: 'Hotels Worldwide' },
  { value: '50K+', label: 'Happy Guests' },
  { value: '4.9', label: 'Average Rating' },
  { value: '24/7', label: 'Customer Support' },
]

const features = [
  {
    icon: Hotel,
    title: 'Curated Hotels',
    description: 'Hand-picked luxury and boutique properties across Thailand and beyond.',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'JWT authentication, encrypted payments, and transaction-safe reservations.',
  },
  {
    icon: Zap,
    title: 'Real-time Availability',
    description: 'Live room availability with race-condition prevention via database transactions.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Authentic reviews only from guests who have completed their stay.',
  },
]

const destinations = [
  {
    city: 'Bangkok',
    country: 'Thailand',
    hotels: 12,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80',
  },
  {
    city: 'Phuket',
    country: 'Thailand',
    hotels: 8,
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=80',
  },
  {
    city: 'Chiang Mai',
    country: 'Thailand',
    hotels: 6,
    image: chiang_mai,
  },
  {
    city: 'Pattaya',
    country: 'Thailand',
    hotels: 10,
    image: pattaya,
  },
  {
    city: 'Krabi',
    country: 'Thailand',
    hotels: 7,
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80',
  },
  {
    city: 'Hua Hin',
    country: 'Thailand',
    hotels: 5,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
  },
]

const amenities = [
  { icon: Wifi, label: 'Free WiFi' },
  { icon: Car, label: 'Free Parking' },
  { icon: Dumbbell, label: 'Fitness Center' },
  { icon: Coffee, label: 'Restaurant' },
  { icon: Users, label: 'Pool Access' },
  { icon: Star, label: 'Spa & Wellness' },
]

const techStack = [
  'React 18', 'TypeScript', 'Node.js', 'Express',
  'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'React Query',
  'Zod', 'JWT Auth', 'bcrypt', 'shadcn/ui',
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* ───────── HERO — bg-primary ───────── */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-medium border border-primary-foreground/20 px-4 py-2 rounded-full mb-8 bg-primary-foreground/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Hotel Booking System
          </span>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6">
            <span className="block">Find Your</span>
            <span className="block font-semibold text-secondary">Perfect Stay</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-grade booking platform inspired by Agoda — built with modern full-stack architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary-hover text-secondary-foreground font-semibold px-8 py-6 text-sm tracking-wider uppercase shadow-lg"
            >
              <Link to="/hotels">
                Explore Hotels
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-light px-8 py-6 text-sm tracking-wider uppercase"
              >
                <Link to="/register">Create Account</Link>
              </Button>
            )}
          </div>
        </div>

        {/* wave bottom */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ───────── STATS — bg-background ───────── */}
      <section className="bg-background py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="font-heading text-4xl md:text-5xl font-semibold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                {s.value}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── DESTINATIONS — bg-primary ───────── */}
      <section className="bg-primary text-primary-foreground py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60"
            style={{ transform: 'scaleY(-1)' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto pt-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-3">Explore</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light">Top Destinations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((dest, i) => (
              <Link
                key={i}
                to={`/hotels?city=${dest.city}`}
                className={`group relative overflow-hidden cursor-pointer rounded-lg ${i === 0 ? 'md:row-span-2 lg:row-span-1' : ''}`}
                style={{ height: i === 0 ? '280px' : '280px' }}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-1 text-white/60 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.hotels} hotels · {dest.country}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-light text-white">{dest.city}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ───────── FEATURES — bg-background ───────── */}
      <section className="bg-background py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Built Different</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">Why This Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <Card key={i} className="border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 group h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-5 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 rounded-md flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-heading text-base font-semibold mb-2 text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────── AMENITIES — bg-primary ───────── */}
      <section className="bg-primary text-primary-foreground py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60"
            style={{ transform: 'scaleY(-1)' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto pt-8">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-3">Included</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light">World-Class Amenities</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {amenities.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:border-secondary/50 transition-all duration-300 group">
                  <Icon className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs tracking-wider uppercase text-primary-foreground/70 text-center">{a.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ───────── TECH STACK — bg-background ───────── */}
      <section className="bg-background py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Under the Hood</p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-border text-muted-foreground text-xs tracking-widest uppercase hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-default rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA — bg-primary ───────── */}
      <section className="bg-primary text-primary-foreground py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none" height="60"
            style={{ transform: 'scaleY(-1)' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        <div className="absolute inset-0 opacity-5">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center pt-8">
          <h2 className="font-heading text-5xl md:text-7xl font-light mb-6">
            Ready to <span className="text-secondary italic">explore?</span>
          </h2>
          <p className="text-primary-foreground/60 mb-10 text-lg leading-relaxed">
            Browse hotels, check availability, and experience a production-grade booking flow.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary-hover text-secondary-foreground font-semibold px-10 py-6 text-sm tracking-widest uppercase shadow-lg"
          >
            <Link to="/hotels">
              <Hotel className="mr-2 w-5 h-5" />
              Start Booking Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ───────── FOOTER — bg-background ───────── */}
      <footer className="bg-background border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm tracking-widest uppercase font-heading">
            Hotel Booking System
          </span>
          <span className="text-muted-foreground text-xs">
            Inspired by Agoda · Built with React + Express + PostgreSQL
          </span>
        </div>
      </footer>
    </div>
  )
}